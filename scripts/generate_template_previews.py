#!/usr/bin/env python3
"""
Generate template previews (PNG stills) + optional GIF + upload catbox.

Usage:
  python3 scripts/generate_template_previews.py            # all configured
  python3 scripts/generate_template_previews.py kraftcard  # filter
  python3 scripts/generate_template_previews.py --update-index  # also patch ASSETS-INDEX.md

Configured templates : edit PREVIEWS list at top of file.
Output : public/_shared/previews/templates/*.png + URLs printed to stdout.
"""

import os
import sys
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent.parent
PREVIEW_DIR = ROOT / "public/_shared/previews/templates"
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

CHROME = "/Users/clawdbot/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"

# Configuration des previews — un dict par output PNG souhaité
# webgl=True pour Mapbox (passe par render mp4 + ffmpeg dernière frame)
PREVIEWS = [
    # SmallMultiplesGrid
    {"name": "smg-cream-start",       "comp": "Insert-SmallMultiplesGridDemoA-Cream", "frame": 20},
    {"name": "smg-cream-mid",         "comp": "Insert-SmallMultiplesGridDemoA-Cream", "frame": 80},
    {"name": "smg-cream-end",         "comp": "Insert-SmallMultiplesGridDemoA-Cream", "frame": 140},
    {"name": "smg-kraft-mid",         "comp": "Insert-SmallMultiplesGridDemoB-Kraft", "frame": 80},
    {"name": "smg-kraft-end",         "comp": "Insert-SmallMultiplesGridDemoB-Kraft", "frame": 140},
    # KraftCard 3 options dans le showcase (PHASE_DUR=120)
    {"name": "kraftcard-cadre-mid",         "comp": "TemplateD-KraftCardShowcase", "frame": 60},
    {"name": "kraftcard-cadre-end",         "comp": "TemplateD-KraftCardShowcase", "frame": 110},
    {"name": "kraftcard-narratif-mid",      "comp": "TemplateD-KraftCardShowcase", "frame": 180},
    {"name": "kraftcard-narratif-end",      "comp": "TemplateD-KraftCardShowcase", "frame": 230},
    {"name": "kraftcard-docclassifie-mid",  "comp": "TemplateD-KraftCardShowcase", "frame": 300},
    {"name": "kraftcard-docclassifie-end",  "comp": "TemplateD-KraftCardShowcase", "frame": 350},
    {"name": "docclassifie-subject-portrait", "comp": "TemplateD-KraftCardDocClassifie-Portrait", "frame": 130},
    {"name": "docclassifie-subject-flag",     "comp": "TemplateD-KraftCardDocClassifie-Flag",     "frame": 130},
    # Mapbox WebGL
    {"name": "atlas3d-niger-end",   "comp": "TemplateC-AtlasRealiste3DShowcase", "frame": 179, "webgl": True},
    {"name": "atlas3d-mali-end",    "comp": "TemplateC-AtlasRealiste3DShowcase", "frame": 359, "webgl": True},
    {"name": "carto-caspian-end",   "comp": "TemplateB-CartoCaspianDemo",        "frame": 159, "webgl": True},
]


def render_still(comp: str, output: Path, frame: int) -> bool:
    """Render single frame via npx remotion still."""
    cmd = ["node", "node_modules/.bin/remotion", "still", comp, str(output), f"--frame={frame}"]
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=180)
    return r.returncode == 0


def render_webgl_frame(comp: str, output: Path, frame: int) -> bool:
    """Render WebGL composition: mp4 over [frame-19, frame] then ffmpeg last frame."""
    tmp_mp4 = output.with_suffix(".mp4")
    f0 = max(0, frame - 19)
    f1 = frame
    cmd = [
        "node", "node_modules/.bin/remotion", "render", comp, str(tmp_mp4),
        f"--frames={f0}-{f1}",
        f"--browser-executable={CHROME}",
        "--gl=angle",
        "--concurrency=1",
    ]
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=300)
    if r.returncode != 0:
        print(f"  ERR render: {r.stderr[-200:]}")
        return False
    nframes = f1 - f0
    cmd2 = ["ffmpeg", "-y", "-i", str(tmp_mp4), "-vf", f"select='eq(n,{nframes})'", "-vframes", "1", str(output)]
    r2 = subprocess.run(cmd2, cwd=ROOT, capture_output=True, text=True, timeout=30)
    tmp_mp4.unlink(missing_ok=True)
    return r2.returncode == 0


def upload_catbox(path: Path) -> str:
    """Upload to catbox.moe, return URL."""
    cmd = ["curl", "-s", "-F", "reqtype=fileupload", "-F", f"fileToUpload=@{path}", "https://catbox.moe/user/api.php"]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    return r.stdout.strip()


def main():
    filter_substr = None
    if len(sys.argv) > 1 and not sys.argv[1].startswith("--"):
        filter_substr = sys.argv[1]
        print(f"Filter: '{filter_substr}'")

    results = []
    for p in PREVIEWS:
        if filter_substr and filter_substr not in p["name"]:
            continue
        out = PREVIEW_DIR / f"{p['name']}.png"
        print(f"\n[{p['name']}] frame={p['frame']} comp={p['comp']}")
        if p.get("webgl"):
            ok = render_webgl_frame(p["comp"], out, p["frame"])
        else:
            ok = render_still(p["comp"], out, p["frame"])
        if not ok:
            print(f"  FAIL render")
            continue
        url = upload_catbox(out)
        print(f"  OK {url}")
        results.append({"name": p["name"], "local": str(out.relative_to(ROOT)), "url": url})

    # JSON manifest pour ASSETS-INDEX
    manifest_path = PREVIEW_DIR / "_manifest.json"
    manifest = {"templates": results}
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    print(f"\nManifest: {manifest_path}")
    print(f"\n{len(results)} previews generated.")


if __name__ == "__main__":
    main()
