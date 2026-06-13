"""
Génère le sprite ville Kidal (petite ville sahélienne fortifiée top-down) pour la War-Map Sahel P3.
Recette validée (feedback_sprites-topdown-gemini-vs-recraft.md). Modèle gemini-3.1-flash-image-preview.
Remplace le "point GPS" de Kidal par une forteresse à prendre (reco Gemini + Aziz).
Fond cream #d4c29d -> removeBackground Recraft -> PNG transparent.
"""
import os, sys, base64, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
RECRAFT_KEY = os.getenv("RECRAFT_API_KEY")
OUT = ROOT / "public/_shared/sprites/warmap"

if not GEMINI_KEY or not RECRAFT_KEY:
    print("ERROR: clé manquante"); sys.exit(1)

NAME = "ville-kidal"
PROMPT = (
    "A small fortified Sahelian desert town seen STRICTLY from directly straight above "
    "— bird's eye orthographic view, looking straight down, no perspective, no side view, no 3/4 view. "
    "You see from above: a cluster of low flat-roofed mud-brick (adobe) buildings and compounds in earthy "
    "ochre and sand tones, organized in an irregular organic layout with narrow alleys between them, a low "
    "defensive wall or rampart partially surrounding the settlement, one or two slightly larger rectangular "
    "structures (a fort/garrison). Desert tan, ochre, dusty brown, muted terracotta. Hand-inked map-token "
    "style consistent with a parchment war map, subtle ink outlines and flat muted fills. "
    "NO flag, NO emblem, NO logo, NO text, NO modern vehicles, NO people. "
    "UNIFORM solid CREAM background #d4c29d edge to edge, WITHOUT transparency, "
    "WITHOUT checkered/gradient, WITHOUT any map/roads/grid/compass/pins."
)

def gen_gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={GEMINI_KEY}"
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.25}}
    r = requests.post(url, json=body, timeout=120)
    if r.status_code != 200: raise RuntimeError(f"Gemini {r.status_code}: {r.text[:300]}")
    for part in r.json()["candidates"][0]["content"]["parts"]:
        if "inlineData" in part: return base64.b64decode(part["inlineData"]["data"])
    raise RuntimeError("No image")

def remove_bg(b):
    r = requests.post("https://external.api.recraft.ai/v1/images/removeBackground",
        headers={"Authorization": f"Bearer {RECRAFT_KEY}"},
        files={"file": ("image.png", b, "image/png")}, timeout=120)
    if r.status_code != 200: raise RuntimeError(f"Recraft {r.status_code}: {r.text[:300]}")
    return requests.get(r.json()["image"]["url"], timeout=60).content

def verify_cream(b):
    try:
        from PIL import Image; import io
        px = Image.open(io.BytesIO(b)).convert("RGB").getpixel((4, 4))
        diff = sum(abs(px[i]-c) for i, c in enumerate((212, 194, 157)))
        print(f"  pixel(4,4)={px} diff={diff}"); return diff < 80
    except ImportError: return True

print(f"[{NAME}] Gemini top-down fortified town...")
raw = gen_gemini(PROMPT)
(OUT / f"{NAME}-raw.png").write_bytes(raw)
print(f"  raw {len(raw)//1024}KB"); verify_cream(raw)
print("  removeBackground...")
(OUT / f"{NAME}.png").write_bytes(remove_bg(raw))
print(f"  DONE: {NAME}.png")
