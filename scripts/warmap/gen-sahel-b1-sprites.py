"""
Génère les 2 sprites mobiles top-down pour B1 (War-Map Sahel Acte 2) :
  - avion-militaire : avion de transport militaire vu de dessus (l'arrivée "11 jours")
  - convoi-uranium  : 2 camions miniers alignés vus de dessus (le flux uranium Arlit)

Style cohérent jetons Acte 1 (encre hachuré sépia) MAIS vue TOP-DOWN (objet sur carte, pitch 0),
PAS un portrait. Silhouette technique "dessin d'état-major / Jane's recognition".
Fond cream #d4c29d -> Recraft removeBackground -> PNG transparent.

Modèle : gemini-3.1-flash-image (verrouillé CLAUDE.md).
Sortie : public/_shared/sprites/warmap/{avion-militaire,convoi-uranium}.png
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

# --- TAIL commun OBJETS TOP-DOWN (vue de dessus stricte, silhouette technique) ---
# Cohérent avec l'encre des jetons Acte 1, mais c'est un OBJET vu du ciel, pas un portrait.
# Contour franc pour détacher du parchemin. Pas d'ombre portée (gérée en SVG si besoin).
TOPDOWN_TAIL = (
    "STRICT TOP-DOWN view (seen directly from above, orthographic, pitch 0), as drawn on an old "
    "military staff map. Hand-drawn INK style: confident BLACK ink outline (bold 2px), fine "
    "sepia/earth cross-hatching for volume, monochrome dark sepia, high contrast so it detaches "
    "from a light parchment background. Like a Jane's recognition silhouette, NOT a photo, NOT a "
    "3D render, NOT a flat colored vector icon. Single object centered, small and clean enough to "
    "stay readable as a ~80px map marker. "
    "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
    "WITHOUT any transparency, checkered pattern, gradient, WITHOUT any circle/frame/border, "
    "WITHOUT any map, terrain, runway, road, text, letters or decorative elements."
)

ASSETS = [
    {
        "name": "avion-militaire",
        "prompt": (
            "A military tactical transport aircraft (type A400M / C-160 Transall) seen STRICTLY "
            "from directly above: long fuselage, high straight wings spanning left-right, four "
            "engine nacelles on the wings, T-tail. Nose pointing toward the top of the frame. "
            "Conveys fast force-projection. " + TOPDOWN_TAIL
        ),
    },
    {
        "name": "convoi-uranium",
        "prompt": (
            "A mining transport convoy of TWO heavy dump trucks (semi-trailer ore haulers) lined "
            "up one behind the other, seen STRICTLY from directly above: rectangular cab + long "
            "loaded trailer box for each, wheels visible along the sides, both trucks pointing "
            "toward the top of the frame. A small discreet radiation trefoil mark (three muted "
            "mustard-yellow arcs) on the lead trailer roof, subtle, no glow. Conveys slow heavy "
            "continuous extraction. " + TOPDOWN_TAIL
        ),
    },
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
    print(f"Generating {len(ASSETS)} Sahel B1 top-down sprites (Gemini -> Recraft removeBg)\n")
    for sp in ASSETS:
        name = sp["name"]
        print(f"[{name}] Gemini...")
        raw = gen_gemini(sp["prompt"])
        (OUT / f"{name}-raw.png").write_bytes(raw)
        print(f"  raw saved ({len(raw)//1024}KB)")
        if not verify_cream(raw):
            print("  WARNING: bg may not be cream -- proceeding")
        print(f"  Recraft removeBg...")
        (OUT / f"{name}.png").write_bytes(remove_bg_recraft(raw))
        print(f"  DONE: {name}.png\n")
    print("All Sahel B1 sprites generated.")

if __name__ == "__main__":
    main()
