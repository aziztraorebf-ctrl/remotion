"""
Génère les 5 assets War-Map Sahel Acte 2 :
  - 2 insignes de bases militaires (France + Africa Corps)
  - 3 jetons (FAMa malien + CSP touareg + civil réfugié)

Style cohérent avec les jetons-combattants Acte 1 (gen-sahel-fighters.py) :
encre hachuré sepia, fond cream #d4c29d -> removeBackground Recraft pour PNG transparent.

Modèle : gemini-3.1-flash-image-preview (verrouillé CLAUDE.md).
Sortie : public/_shared/sprites/warmap/{base-france,base-africacorps,jeton-fama,jeton-csp,jeton-refugie}.png
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

# --- TAIL commun jetons-portraits (cohérent fighter-jnim/eigs) ---
PORTRAIT_TAIL = (
    "Hand-drawn INK ILLUSTRATION with fine cross-hatching shading (same style as a military "
    "recognition portrait: confident ink lines, sepia/earth cross-hatch shadows, NOT a photo, "
    "NOT a smooth 3D render). Bust framing (head + shoulders), facing forward, centered, for "
    "insertion into a circular token. Determined neutral expression. "
    "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
    "WITHOUT any transparency, checkered pattern, gradient, WITHOUT any circle/frame/border, "
    "WITHOUT any map, terrain, text or decorative elements."
)

# --- TAIL commun insignes (emblème tactique, pas portrait) ---
# DENSE : trait NOIR franc et ÉPAIS, l'emblème REMPLIT le cadre (lisible à petite échelle
# sur fond parchemin clair). Corrige le 1er jet (sépia clair fin = invisible, leçon 2026-06-09).
EMBLEM_TAIL = (
    "BOLD hand-drawn INK EMBLEM in the style of an old tactical military map stamp: THICK "
    "confident BLACK ink lines, heavy solid fills, strong dark cross-hatching, high contrast, "
    "NOT a photo, NOT a 3D render, NOT a flat vector logo, NOT thin or faint lines. "
    "Single bold centered emblem that FILLS most of the frame, symmetrical, designed to stay "
    "readable as a SMALL map marker on a light parchment background. "
    "UNIFORM solid CREAM background color #d4c29d, edge to edge, "
    "WITHOUT any transparency, checkered pattern, gradient, WITHOUT any circle/frame border, "
    "WITHOUT any map, terrain, text, letters or decorative elements."
)

ASSETS = [
    # --- BASES MILITAIRES (insignes) — RÉGÉNÉRÉS DENSES (leçon 2026-06-09) ---
    {
        "name": "base-france",
        "prompt": (
            "A bold military base insignia: a THICK solid 4-pointed NATO-style compass star "
            "emblem in heavy black ink, suggesting a Western/French permanent military presence. "
            "Strong filled star, high contrast, fills most of the frame. " + EMBLEM_TAIL
        ),
    },
    {
        "name": "base-africacorps",
        "prompt": (
            "A bold paramilitary base insignia: a THICK solid Soviet-style 5-pointed star emblem "
            "in heavy black ink with a small stylized skull silhouette at its center, suggesting "
            "the Russian Africa Corps (ex-Wagner) presence. Brutalist, very dark, high contrast, "
            "fills most of the frame. " + EMBLEM_TAIL
        ),
    },
]

def gen_gemini(prompt: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={GEMINI_KEY}"
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
    print(f"Generating {len(ASSETS)} Sahel Acte 2 assets (Gemini -> Recraft removeBg)\n")
    for sp in ASSETS:
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
    print("All Sahel Acte 2 assets generated.")

if __name__ == "__main__":
    main()
