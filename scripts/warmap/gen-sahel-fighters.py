"""
Génère les 2 archétypes jetons-combattants War-Map Sahel Acte 1 (JNIM + EIGS).
Style dessin encre hachuré (cohérent portraits militaires Soudan validés : portrait-saf/rsf).
Différenciés par PERSONNAGE (pas juste bordure) : JNIM = chèche clair rural touareg/peul,
EIGS = cagoule sombre militaire (branche Daesh). Recolorés ensuite par bordure de jeton en code.

Modèle : IMAGE_MODEL (defaut Lite, importe depuis scripts/tools/gemini_models.py --
source de verite unique ; IMAGE_MODEL_HQ uniquement si l'image est publiee telle quelle).
Fond cream #d4c29d imposé -> removeBackground Recraft pour PNG transparent.
Sortie : public/_shared/sprites/warmap/fighter-{jnim,eigs}.png
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

COMMON_TAIL = (
    "Hand-drawn INK ILLUSTRATION with fine cross-hatching shading (same style as a military "
    "recognition portrait: confident ink lines, sepia/earth cross-hatch shadows, NOT a photo, "
    "NOT a smooth 3D render). Bust framing (head + shoulders + weapon across the chest), facing "
    "forward, centered, for insertion into a circular token. Determined neutral expression. "
    "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
    "WITHOUT any transparency, checkered pattern, gradient, WITHOUT any circle/frame/border, "
    "WITHOUT any map, terrain, text or decorative elements."
)

# JNIM : guérillero rural sahélien, chèche/turban CLAIR (touareg/peul), ancré local
JNIM_PROMPT = (
    "A bust portrait illustration of a Sahelian RURAL insurgent fighter (archetype, not a "
    "recognizable individual). He wears a LIGHT sand-colored cheche/turban wrapped around the "
    "head and partially covering the lower face (Tuareg/Fulani style), loose earth-toned robes. "
    "He holds a Kalashnikov rifle across his chest. Local guerrilla look, weathered. "
    "Tones: ochre, sand, warm sepia. " + COMMON_TAIL
)

# EIGS : combattant djihadiste, cagoule/foulard SOMBRE militaire (branche Daesh), est
EIGS_PROMPT = (
    "A bust portrait illustration of a jihadist fighter (archetype, not a recognizable "
    "individual). He wears a DARK balaclava/face-wrap covering the face (Islamic State style), "
    "dark military-style clothing. He holds a Kalashnikov rifle across his chest. More uniform, "
    "harder, organized military look. "
    "Tones: dark earth, charcoal, cold sepia. " + COMMON_TAIL
)

SPRITES = [
    {"name": "fighter-jnim", "prompt": JNIM_PROMPT},
    {"name": "fighter-eigs", "prompt": EIGS_PROMPT},
]

def gen_gemini(prompt: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{IMAGE_MODEL}:generateContent?key={GEMINI_KEY}"
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.3},
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
    print(f"Generating {len(SPRITES)} Sahel fighter tokens (Gemini -> Recraft removeBg)\n")
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
    print("All Sahel fighter tokens generated.")

if __name__ == "__main__":
    main()
