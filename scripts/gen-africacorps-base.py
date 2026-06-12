"""
Génère la base Africa Corps (fortin paramilitaire top-down) pour la War-Map Sahel P3.
Recette validée 2026-06-05 (feedback_sprites-topdown-gemini-vs-recraft.md).
Modèle : gemini-3.1-flash-image-preview (verrouillé CLAUDE.md).
Fond cream #d4c29d imposé -> removeBackground Recraft -> PNG transparent.

Remplace l'emblème étoile-crâne (base-africacorps-emblem.png sauvegardé) par un VRAI campement
vu strictement du dessus, cohérent avec base-minusma-td.png (la base ONU déjà sur la carte).
Les 3 verrous : NO skull/star/emblem (anti-logo Wagner) · Gemini pas Recraft (fond cream) · STRICTLY top-down.
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
RECRAFT_KEY = os.getenv("RECRAFT_API_KEY")
OUT = ROOT / "public/_shared/sprites/warmap"

if not GEMINI_KEY:
    print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
if not RECRAFT_KEY:
    print("ERROR: RECRAFT_API_KEY missing"); sys.exit(1)

NAME = "base-africacorps"
PROMPT = (
    "A small paramilitary forward operating base seen STRICTLY from directly straight above "
    "— bird's eye orthographic view, looking straight down, no perspective, no side view, no 3/4 view. "
    "You see from above: a compact fortified compound with sandbag/HESCO walls forming a rough square "
    "perimeter, two or three rectangular tents or prefab shelters inside, a couple of parked military "
    "vehicles (technicals/4x4) near the entrance, a watchtower as a small square at one corner. "
    "Earthy, dusty, utilitarian — desert tan, olive drab, dark grey. Hand-inked map-token style "
    "consistent with a parchment war map, subtle ink outlines and flat muted fills. "
    "NO flag, NO emblem, NO logo, NO skull, NO star symbol, NO text. "
    "UNIFORM solid CREAM background #d4c29d edge to edge, WITHOUT transparency, "
    "WITHOUT checkered/gradient, WITHOUT any map/roads/grid/compass/pins."
)

def gen_gemini(prompt: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={GEMINI_KEY}"
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.25},
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
    url = "https://external.api.recraft.ai/v1/images/removeBackground"
    r = requests.post(url, headers={"Authorization": f"Bearer {RECRAFT_KEY}"},
        files={"file": ("image.png", img_bytes, "image/png")}, timeout=120)
    if r.status_code != 200:
        raise RuntimeError(f"Recraft {r.status_code}: {r.text[:300]}")
    return requests.get(r.json()["image"]["url"], timeout=60).content

def verify_cream(img_bytes: bytes) -> bool:
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
        print("  PIL not available, skipping pixel check"); return True

def main():
    print(f"[{NAME}] Generating with Gemini (top-down FOB, anti-emblem)...")
    raw = gen_gemini(PROMPT)
    raw_path = OUT / f"{NAME}-raw.png"
    raw_path.write_bytes(raw)
    print(f"  Raw saved: {raw_path.name} ({len(raw)//1024}KB)")
    if not verify_cream(raw):
        print("  WARNING: background may not be cream — proceeding anyway")
    print("  Removing background via Recraft...")
    transparent = remove_bg_recraft(raw)
    final_path = OUT / f"{NAME}.png"
    final_path.write_bytes(transparent)
    print(f"  DONE: {final_path.name} ({len(transparent)//1024}KB)")

if __name__ == "__main__":
    main()
