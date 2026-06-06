"""
Generate top-down cargo wagon sprites for Lobito corridor warmap scene.
Recette validée 2026-06-05 (feedback_sprites-topdown-gemini-vs-recraft.md).
Modèle : gemini-3.1-flash-image-preview (verrouillé CLAUDE.md).
Fond cream #d4c29d imposé -> removeBackground Recraft pour PNG transparent.
2 sprites :
  - wagon-cargo-or.png   : wagon de fret or/cuivre (flux ouest Lobito/Atlantique)
  - wagon-cargo-rouge.png : wagon de fret rouge brique (flux est Dar/Chine)
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
RECRAFT_KEY = os.getenv("RECRAFT_API_KEY")
OUT = ROOT / "public/_shared/sprites/warmap"
OUT.mkdir(parents=True, exist_ok=True)

if not GEMINI_KEY:
    print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
if not RECRAFT_KEY:
    print("ERROR: RECRAFT_API_KEY missing"); sys.exit(1)

SPRITES = [
    {
        "name": "wagon-cargo-or",
        "prompt": (
            "A top-down bird's eye view illustration of a freight railway wagon (cargo wagon) "
            "loaded with copper and cobalt ore. STRICTLY from directly straight above, orthographic, "
            "looking straight down. No perspective, no side view, no 3/4 angle. "
            "The wagon is oriented pointing toward the TOP of the image. "
            "You see: a rectangular flat wagon body, metallic frame edges on all sides, "
            "a central open container filled with rough dark ore/mineral chunks, "
            "two wheel axles (small rectangles) visible at top and bottom ends. "
            "Color palette: warm gold #C8A46A body, dark ore #4a3520 mineral load, "
            "dark brown #2a1a0a outlines and frame. Clean flat illustration style, bold outlines. "
            "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
            "WITHOUT any transparency, checkered pattern, gradient, "
            "WITHOUT any map, roads, grid, compass rose, or decorative elements."
        ),
    },
    {
        "name": "wagon-cargo-rouge",
        "prompt": (
            "A top-down bird's eye view illustration of a freight railway wagon (cargo wagon) "
            "loaded with copper and cobalt ore. STRICTLY from directly straight above, orthographic, "
            "looking straight down. No perspective, no side view, no 3/4 angle. "
            "The wagon is oriented pointing toward the TOP of the image. "
            "You see: a rectangular flat wagon body, metallic frame edges on all sides, "
            "a central open container filled with rough dark ore/mineral chunks, "
            "two wheel axles (small rectangles) visible at top and bottom ends. "
            "Color palette: brick red #B14B3C body, dark ore #3a2010 mineral load, "
            "dark brown #1a0a00 outlines and frame. Clean flat illustration style, bold outlines. "
            "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
            "WITHOUT any transparency, checkered pattern, gradient, "
            "WITHOUT any map, roads, grid, compass rose, or decorative elements."
        ),
    },
]

def gen_gemini(prompt: str) -> bytes:
    """Generate image via Gemini 3.1 flash image preview."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={GEMINI_KEY}"
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["image", "text"],
            "temperature": 0.25,
        },
    }
    r = requests.post(url, json=body, timeout=120)
    if r.status_code != 200:
        raise RuntimeError(f"Gemini {r.status_code}: {r.text[:300]}")
    data = r.json()
    for part in data["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    raise RuntimeError("No image in Gemini response")

def remove_bg_recraft(img_bytes: bytes) -> bytes:
    """Remove background via Recraft API."""
    url = "https://external.api.recraft.ai/v1/images/removeBackground"
    r = requests.post(
        url,
        headers={"Authorization": f"Bearer {RECRAFT_KEY}"},
        files={"file": ("image.png", img_bytes, "image/png")},
        timeout=120,
    )
    if r.status_code != 200:
        raise RuntimeError(f"Recraft {r.status_code}: {r.text[:300]}")
    img_url = r.json()["image"]["url"]
    return requests.get(img_url, timeout=60).content

def verify_cream(img_bytes: bytes) -> bool:
    """Check pixel(4,4) is close to cream #d4c29d."""
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        px = img.getpixel((4, 4))
        cream = (212, 194, 157)
        diff = sum(abs(px[i]-cream[i]) for i in range(3))
        print(f"  pixel(4,4) = {px}, diff from cream = {diff}")
        return diff < 80
    except ImportError:
        print("  PIL not available, skipping pixel check")
        return True

def main():
    print(f"Generating {len(SPRITES)} wagon sprites (Gemini → Recraft removeBackground)\n")
    for sp in SPRITES:
        name = sp["name"]
        print(f"[{name}] Generating with Gemini...")
        raw = gen_gemini(sp["prompt"])
        # Save raw for inspection
        raw_path = OUT / f"{name}-raw.png"
        raw_path.write_bytes(raw)
        print(f"  Raw saved: {raw_path.name} ({len(raw)//1024}KB)")
        ok = verify_cream(raw)
        if not ok:
            print("  WARNING: background may not be cream — proceeding anyway")
        print(f"  Removing background via Recraft...")
        transparent = remove_bg_recraft(raw)
        final_path = OUT / f"{name}.png"
        final_path.write_bytes(transparent)
        print(f"  DONE: {final_path.name} ({len(transparent)//1024}KB)\n")
    print("All sprites generated.")

if __name__ == "__main__":
    main()
