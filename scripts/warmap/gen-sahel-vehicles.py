"""
Génère les sprites véhicules top-down War-Map Sahel Acte 1 (JNIM + EIGS).
Recette validée 2026-06-05 (feedback_sprites-topdown-gemini-vs-recraft.md).
Modèle : IMAGE_MODEL (defaut Lite, importe depuis scripts/tools/gemini_models.py --
source de verite unique ; IMAGE_MODEL_HQ uniquement si l'image est publiee telle quelle).
Fond cream #d4c29d imposé -> removeBackground Recraft pour PNG transparent.

2 sprites (technical = pickup armé, l'arme caractéristique des groupes sahéliens) :
  - technical-jnim.png : pickup armé JNIM, rouge terre #B14B3C (lié Al-Qaïda)
  - technical-eigs.png : pickup armé EIGS, orange-brun #9C5A2E (lié Daesh), distinct du JNIM
Sortie : public/_shared/sprites/warmap/
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parents[1] / "tools"))
from gemini_models import IMAGE_MODEL

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
# Cachet MILITAIRE net (réf : tank-td-blue Soudan validé — détails propres, lisible,
# contours nets façon planche d'identification militaire). Pas "clipart".
COMMON_TAIL = (
    "STRICTLY from directly straight above, orthographic, looking straight down. "
    "No perspective, no side view, no 3/4 angle. "
    "The vehicle is oriented pointing toward the TOP of the image. "
    "MILITARY VEHICLE IDENTIFICATION PLATE style: crisp clean technical illustration, "
    "precise panel-line details, mechanical parts clearly drawn (hatches, plating seams, "
    "gun mount), bold confident dark #2a1a0a outlines, subtle cel-shading. "
    "Looks like a real military vehicle recognition chart, NOT a cartoon or clipart toy. "
    "Slightly weathered/dusty (Sahel). "
    "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
    "WITHOUT any transparency, checkered pattern, gradient, "
    "WITHOUT any map, roads, grid, compass rose, terrain, or decorative elements."
)

# JNIM — pickup technical armé, MILITAIRE et soigné (guérilla mobile, Al-Qaïda)
JNIM_PROMPT = (
    "A top-down military recognition illustration of an armed pickup truck ('technical', "
    "a 4x4 pickup with a heavy machine gun on the rear bed). Slim, agile silhouette. "
    "From above you clearly see: the cabin roof with a hatch detail at the front (top), "
    "the open rear cargo bed with a MOUNTED HEAVY MACHINE GUN on a pivot ring (clear gun barrel "
    "pointing toward the top, ammo box detail), four detailed wheels with visible tread. "
    "A small BLACK jihadist banner detail on the cabin. Realistic military proportions. "
    "Color: BRICK RED #B14B3C body with darker red panel lines, gunmetal #2a2a2a weapon. " + COMMON_TAIL
)

# EIGS — véhicule blindé tout-terrain, MILITAIRE net, taille RAISONNABLE (pas géant)
EIGS_PROMPT = (
    "A top-down military recognition illustration of an armored 4x4 combat vehicle "
    "(an armed reconnaissance/patrol armored car with a small turret). Compact and sturdy, "
    "only SLIGHTLY larger than a pickup — NOT a giant tank, reasonable size. "
    "From above you clearly see: armored hull with visible welded armor panel seams and hatches, "
    "a CENTRAL TURRET with a clear gun barrel pointing toward the top, four armored wheels with tread. "
    "Realistic military proportions, looks purposeful and dangerous. "
    "Color: DARK DESATURATED GREEN-BLACK #2E2A1E armored body with darker panel lines, "
    "gunmetal #2a2a2a turret and gun. " + COMMON_TAIL
)

SPRITES = [
    {"name": "technical-jnim", "prompt": JNIM_PROMPT},
    {"name": "technical-eigs", "prompt": EIGS_PROMPT},
]

def gen_gemini(prompt: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{IMAGE_MODEL}:generateContent?key={GEMINI_KEY}"
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
