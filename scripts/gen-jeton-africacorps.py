"""
Génère le jeton Africa Corps (portrait mercenaire russe) pour la War-Map Sahel P3.
Même style/cadrage que jeton-fama.png (buste illustré encré, fond transparent) mais homme blanc/européen,
tenue contractor désert gris-fer — visuellement DISTINCT des FAMa (Aziz : Africa Corps = majoritairement Russes).
Recette : Gemini gemini-3.1-flash-image-preview, fond cream #d4c29d -> removeBackground Recraft.
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

NAME = "jeton-africacorps"
PROMPT = (
    "Bust portrait illustration of a Russian private military contractor (Africa Corps / ex-Wagner mercenary), "
    "semi-realistic hand-inked editorial style, head and shoulders, facing forward. A WHITE European man with "
    "pale skin, hard neutral expression, wearing a desert-tan tactical contractor outfit with a plate carrier "
    "vest and a tan boonie hat or military cap (no insignia, no flag, no logo, no patch). Muted military palette: "
    "desert tan, grey-iron, olive. Bold ink outlines, flat muted fills, consistent with a parchment war-map token "
    "style. Centered bust. Plain solid CREAM background color #d4c29d, edge to edge, WITHOUT transparency, "
    "WITHOUT checkered pattern, WITHOUT gradient, WITHOUT any text, emblem or symbol."
)

def gen_gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={GEMINI_KEY}"
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.3}}
    r = requests.post(url, json=body, timeout=120)
    if r.status_code != 200: raise RuntimeError(f"Gemini {r.status_code}: {r.text[:300]}")
    for part in r.json()["candidates"][0]["content"]["parts"]:
        if "inlineData" in part: return base64.b64decode(part["inlineData"]["data"])
    raise RuntimeError("No image")

def remove_bg(b):
    r = requests.post("https://external.api.recraft.ai/v1/images/removeBackground",
        headers={"Authorization": f"Bearer {RECRAFT_KEY}"}, files={"file": ("i.png", b, "image/png")}, timeout=120)
    if r.status_code != 200: raise RuntimeError(f"Recraft {r.status_code}: {r.text[:300]}")
    return requests.get(r.json()["image"]["url"], timeout=60).content

def verify_cream(b):
    try:
        from PIL import Image; import io
        px = Image.open(io.BytesIO(b)).convert("RGB").getpixel((4, 4))
        diff = sum(abs(px[i]-c) for i, c in enumerate((212, 194, 157)))
        print(f"  pixel(4,4)={px} diff={diff}"); return diff < 80
    except ImportError: return True

print(f"[{NAME}] Gemini portrait mercenaire russe...")
raw = gen_gemini(PROMPT)
(OUT / f"{NAME}-raw.png").write_bytes(raw)
print(f"  raw {len(raw)//1024}KB"); verify_cream(raw)
print("  removeBackground...")
(OUT / f"{NAME}.png").write_bytes(remove_bg(raw))
print(f"  DONE: {NAME}.png")
