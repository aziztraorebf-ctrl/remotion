#!/usr/bin/env python3
"""Generate Shaka Zulu inserts via Gemini 3 Pro Image.

Targets : iklwa (lance courte) + bouclier cowhide Zulu, style parchemin militaire.
Output : public/atlas-shaka-zulu/inserts/gemini/

Budget hard cap : $0.30 max (4 images x ~$0.067)
Retry policy : 1 retry per image on transient errors, then skip + log.
"""
import os
import sys
import time
from datetime import datetime
from pathlib import Path

from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# Load .env
env_path = PROJECT_ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

OUT_DIR = PROJECT_ROOT / "public" / "atlas-shaka-zulu" / "inserts" / "gemini"
OUT_DIR.mkdir(parents=True, exist_ok=True)
COST_LOG = PROJECT_ROOT / "out" / "shaka-cost-log.txt"

BUDGET_HARD_CAP_USD = 0.30
COST_PER_IMAGE = 0.067

ASSETS = [
    {
        "name": "iklwa-parchemin",
        "prompt": """Old military parchment illustration, sepia tones with warm aged paper texture.
Subject: a single iklwa (short Zulu stabbing spear). Centered composition.
The iklwa has a short wooden shaft (about 60cm) ending in a broad, leaf-shaped iron blade with a sharp point and clear central ridge.
Style: detailed pen-and-ink technical drawing on aged parchment, like an explorer's field notebook from the 1820s.
Subtle annotations: small handwritten labels in faded brown ink pointing to the blade, ridge, and shaft (in French: "lame", "arete", "hampe").
Background: aged ivory parchment with subtle stains, brown ink wash gradient at edges.
Single object, isolated, no figures, no scene.
Color palette: cream parchment (#F5E6C8), dark sepia ink (#3E2C1A), occasional gold leaf accent (#C8A84B).
Aspect ratio: 1:1 (square), portrait-like centered subject.""",
    },
    {
        "name": "bouclier-parchemin",
        "prompt": """Old military parchment illustration, sepia tones with warm aged paper texture.
Subject: a single Zulu cowhide war shield (isihlangu) viewed from the front.
The shield is large, oval-shaped, made of layered cowhide stretched on a vertical wooden frame stick visible top and bottom.
Pattern: distinctive Zulu shield pattern with white and dark brown patches (irregular bovine hide markings).
Style: detailed pen-and-ink technical drawing on aged parchment, like an explorer's field notebook from the 1820s.
Subtle annotations: small handwritten labels in faded brown ink pointing to the wooden stick handle, hide layers, and edge (in French: "manche", "cuir", "bordure").
Background: aged ivory parchment with subtle stains, brown ink wash gradient at edges.
Single object, isolated, no figures, no scene, no warrior holding it.
Color palette: cream parchment (#F5E6C8), dark sepia ink (#3E2C1A), white and dark brown for the hide pattern, occasional bordeaux red accent (#8B1A1A).
Aspect ratio: 1:1 (square), portrait-like centered subject.""",
    },
    {
        "name": "iklwa-pixellab-style",
        "prompt": """Pixel art object illustration, side view, Zulu iklwa (short stabbing spear).
Style: 96x96 pixel art, clean limited palette, no anti-aliasing, hard edges.
Subject: short wooden shaft (warm brown #6B4423) ending in a broad leaf-shaped iron blade (cool steel #B0B0B0 with darker shading #707070).
Sharp tip pointing right. Visible central ridge on blade.
Solid black outline (#1A1A1A) on all edges.
Pure black background (#000000).
Composition: spear centered, blade tip pointing toward right edge, full object visible.
Single object isolated. No figure, no hand, no scene.
Style references: Octopath Traveler weapon icons, Final Fantasy Tactics item sprites.""",
    },
    {
        "name": "bouclier-pixellab-style",
        "prompt": """Pixel art object illustration, front view, Zulu cowhide war shield (isihlangu).
Style: 96x96 pixel art, clean limited palette, no anti-aliasing, hard edges.
Subject: large oval cowhide shield viewed straight on. Vertical wooden stick handle visible top and bottom of the shield.
Cowhide pattern: white (#F5F5F0) and dark brown (#3E2C1A) irregular patches, asymmetric like real bovine hide.
Wooden stick: warm brown #6B4423.
Solid black outline (#1A1A1A) on all edges.
Pure black background (#000000).
Composition: shield centered, fills 80% of canvas vertically, full oval visible.
Single object isolated. No figure, no warrior.
Style references: Octopath Traveler shield icons, classic JRPG equipment sprites.""",
    },
]


def log_cost(name: str, cost: float, status: str, cumul: float):
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] [gemini-3-pro-image] [{name}] [${cost:.4f}] [cumul ${cumul:.4f}] [{status}]\n"
    with open(COST_LOG, "a") as f:
        f.write(line)
    print(line.rstrip())


def generate(client, asset: dict, retry_count: int = 0) -> tuple[bool, str]:
    """Generate one image. Returns (success, status_message)."""
    out_path = OUT_DIR / f"{asset['name']}.png"
    if out_path.exists():
        return True, "already-exists"

    try:
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=[asset["prompt"]],
            config=types.GenerateContentConfig(response_modalities=["image", "text"]),
        )

        # Extract image
        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                out_path.write_bytes(part.inline_data.data)
                size_kb = out_path.stat().st_size / 1024
                return True, f"saved {size_kb:.1f}KB"

        return False, "no image in response"

    except Exception as e:
        msg = str(e)[:200]
        # Sementic errors: don't retry
        if "400" in msg or "invalid" in msg.lower() or "permission" in msg.lower():
            return False, f"semantic-error: {msg}"
        # Transient: retry once
        if retry_count == 0:
            print(f"  Transient error, waiting 60s before retry: {msg}")
            time.sleep(60)
            return generate(client, asset, retry_count=1)
        return False, f"failed-after-retry: {msg}"


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY missing")
        sys.exit(1)

    estimated_total = COST_PER_IMAGE * len(ASSETS)
    if estimated_total > BUDGET_HARD_CAP_USD:
        print(f"BUDGET REFUSED: ${estimated_total:.2f} > cap ${BUDGET_HARD_CAP_USD:.2f}")
        sys.exit(1)

    print(f"Budget cap: ${BUDGET_HARD_CAP_USD:.2f} | Estime: ${estimated_total:.2f}")
    print(f"Output: {OUT_DIR}")
    print()

    client = genai.Client(api_key=api_key)
    cumul = 0.0
    results = []

    for i, asset in enumerate(ASSETS, 1):
        print(f"[{i}/{len(ASSETS)}] {asset['name']}...")
        t0 = time.time()
        success, msg = generate(client, asset)
        elapsed = time.time() - t0

        if success:
            cumul += COST_PER_IMAGE
            log_cost(asset["name"], COST_PER_IMAGE, f"OK {msg} ({elapsed:.1f}s)", cumul)
            results.append((asset["name"], "OK"))
        else:
            log_cost(asset["name"], 0.0, f"FAIL {msg}", cumul)
            results.append((asset["name"], f"FAIL: {msg}"))

        # Rate limit between calls
        if i < len(ASSETS):
            time.sleep(3)

    print()
    print("=== RESUME ===")
    for name, status in results:
        print(f"  {name}: {status}")
    print(f"Cout total: ${cumul:.4f}")


if __name__ == "__main__":
    main()
