"""
Génère le jeton "soldats français" pour B1 V3 (War-Map Sahel Acte 2).
Style cohérent jetons-combattants Acte 1 (fighter-jnim/eigs) : encre hachuré, fond cream → removeBg.
Doit lire "armée française moderne" et se distinguer de JNIM (chèche clair) / EIGS (cagoule sombre).

Modèle : IMAGE_MODEL (defaut Lite, importe depuis scripts/tools/gemini_models.py --
source de verite unique ; IMAGE_MODEL_HQ uniquement si l'image est publiee telle quelle).
Sortie : public/_shared/sprites/warmap/fighter-france.png
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

FRANCE_PROMPT = (
    "A bust portrait illustration of a modern French army soldier (archetype, not a recognizable "
    "individual). He wears a MODERN combat helmet and contemporary camouflage fatigues, a "
    "professional Western/NATO regular-army look, clean and disciplined — clearly DISTINCT from "
    "local insurgents (no turban, no balaclava). He holds a modern assault rifle across his chest. "
    "Cold, steel blue-grey tones. " + COMMON_TAIL
)

def gen_gemini(prompt: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{IMAGE_MODEL}:generateContent?key={GEMINI_KEY}"
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["image", "text"], "temperature": 0.3}}
    r = requests.post(url, json=body, timeout=120)
    if r.status_code != 200:
        raise RuntimeError(f"Gemini {r.status_code}: {r.text[:300]}")
    for part in r.json()["candidates"][0]["content"]["parts"]:
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

def main():
    print("[fighter-france] Gemini...")
    raw = gen_gemini(FRANCE_PROMPT)
    (OUT / "fighter-france-raw.png").write_bytes(raw)
    print(f"  raw saved ({len(raw)//1024}KB)")
    print("  Recraft removeBg...")
    (OUT / "fighter-france.png").write_bytes(remove_bg_recraft(raw))
    print("  DONE: fighter-france.png")

if __name__ == "__main__":
    main()
