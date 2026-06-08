"""
Génère les sprites véhicules top-down War-Map Sahel Acte 1 (JNIM + EIGS).
Recette validée 2026-06-05 (feedback_sprites-topdown-gemini-vs-recraft.md).
Modèle : gemini-3.1-flash-image-preview (verrouillé CLAUDE.md).
Fond cream #d4c29d imposé -> removeBackground Recraft pour PNG transparent.

2 sprites (technical = pickup armé, l'arme caractéristique des groupes sahéliens) :
  - technical-jnim.png : pickup armé JNIM, rouge terre #B14B3C (lié Al-Qaïda)
  - technical-eigs.png : pickup armé EIGS, orange-brun #9C5A2E (lié Daesh), distinct du JNIM
Sortie : public/_shared/sprites/warmap/
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
RECRAFT_KEY = os.getenv("RECRAFT_API_KEY")
OUT = ROOT / "public/_shared/sprites/warmap"
OUT.mkdir(parents=True, exist_ok=True)

if not GEMINI_KEY:
    print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
if not RECRAFT_KEY:
    print("ERROR: RECRAFT_API_KEY missing"); sys.exit(1)

# Top-down strict, pointant vers le HAUT. DIFFÉRENCIATION PAR TYPE DE VÉHICULE
# (pas juste teinte) : JNIM = pickup technical léger/agile · EIGS = blindé trapu/massif.
# Lecture instantanée même à petite échelle en mouvement (anti-camouflage rouge-sur-rouge).
COMMON_TAIL = (
    "STRICTLY from directly straight above, orthographic, looking straight down. "
    "No perspective, no side view, no 3/4 angle. "
    "The vehicle is oriented pointing toward the TOP of the image. "
    "Clean flat illustration style, bold confident dark brown #2a1a0a outlines and shadows, "
    "slightly weathered/dusty look (Sahel desert). "
    "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
    "WITHOUT any transparency, checkered pattern, gradient, "
    "WITHOUT any map, roads, grid, compass rose, terrain, or decorative elements."
)

# JNIM — pickup technical LÉGER et élancé (guérilla mobile, Al-Qaïda)
JNIM_PROMPT = (
    "A top-down bird's eye view illustration of a LIGHT, AGILE armed pickup truck (a 'technical', "
    "a slim 4x4 pickup with a machine gun on the rear bed). The silhouette is NARROW and ELONGATED. "
    "You see from above: a small rectangular cabin roof at the front (top), an open rear cargo bed behind it "
    "with a mounted machine gun on a pivot (a small dark cross/T shape), four wheels as small dark rectangles. "
    "A small BLACK banner/flag detail on the cabin roof. "
    "Color: BRICK RED #B14B3C truck body, dark gunmetal #2a2a2a gun. " + COMMON_TAIL
)

# EIGS — véhicule BLINDÉ trapu et massif (faction lourde, distincte)
EIGS_PROMPT = (
    "A top-down bird's eye view illustration of a HEAVY, BULKY armored military vehicle "
    "(a wide armored 4x4 / light MRAP-style vehicle, NOT a pickup). The silhouette is BROAD, SQUARE and MASSIVE, "
    "clearly wider and heavier than a pickup. "
    "You see from above: visible armor plating panels on the hull, a compact turret with a short gun barrel "
    "in the center pointing toward the top, four LARGE chunky wheels at the corners. "
    "Color: DARK DESATURATED BROWN-BLACK #3E2A18 armored body, dark gunmetal #2a2a2a turret. " + COMMON_TAIL
)

SPRITES = [
    {"name": "technical-jnim", "prompt": JNIM_PROMPT},
    {"name": "technical-eigs", "prompt": EIGS_PROMPT},
]

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
        diff = sum(abs(px[i]-(212,194,157)[i]) for i in range(3))
        print(f"  pixel(4,4) = {px}, diff from cream = {diff}")
        return diff < 80
    except ImportError:
        return True

def main():
    print(f"Generating {len(SPRITES)} Sahel vehicle sprites (Gemini -> Recraft removeBg)\n")
    for sp in SPRITES:
        name = sp["name"]
        print(f"[{name}] Gemini...")
        raw = gen_gemini(sp["prompt"])
        (OUT / f"{name}-raw.png").write_bytes(raw)
        print(f"  raw saved ({len(raw)//1024}KB)")
        if not verify_cream(raw):
            print("  WARNING: bg may not be cream — proceeding")
        print(f"  Recraft removeBg...")
        (OUT / f"{name}.png").write_bytes(remove_bg_recraft(raw))
        print(f"  DONE: {name}.png\n")
    print("All Sahel vehicles generated.")

if __name__ == "__main__":
    main()
