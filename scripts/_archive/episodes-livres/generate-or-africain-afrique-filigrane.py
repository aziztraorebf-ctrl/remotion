#!/usr/bin/env python3
"""
Genere PNG filigrane Afrique en encre/or sur parchemin pour Beat 5 Phase 3.
Modele OBLIGATOIRE : gemini-3.1-flash-image-preview.
"""

import os
import sys
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    print("GEMINI_API_KEY missing"); sys.exit(1)

MODEL = "gemini-3.1-flash-image-preview"
OUT_PATH = "public/souverain/or-africain/backgrounds/afrique-filigrane-v1.png"

PROMPT = """Continent of Africa drawn as an antique cartographic engraving on aged parchment.
The Africa silhouette is centered, rendered in fine ink lines and gold leaf accents (warm gold #f5d547),
with subtle hatching, latitude/longitude graticule lines crossing the continent very faintly.
Background : warm aged parchment cream-beige paper, slight texture, NO border ornaments, NO title text,
NO compass rose, NO labels of countries.
Style : 18th-century cartography, hand-drawn engraving, monochromatic ink with selective gold highlights.
The continent shape MUST be the recognizable real shape of Africa (Mediterranean north, Cape south, Horn of Africa east).
Vertical 9:16 portrait composition, the continent occupies center 60% of frame leaving margin space.
Soft vignette around edges fading to darker parchment.
NO modern elements, NO text, NO flags, NO icons. Pure cartographic engraving.
Output : single image, high detail, 1024x1820 portrait.
"""


def main():
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    body = {
        "contents": [{"role": "user", "parts": [{"text": PROMPT}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "temperature": 0.75,
        },
    }
    print(f"Calling {MODEL}...")
    r = requests.post(url, headers={"Content-Type": "application/json"}, json=body, timeout=180)
    if r.status_code != 200:
        print(f"ERROR {r.status_code}: {r.text[:600]}"); sys.exit(1)
    data = r.json()

    # Extract first inline_data image
    cand = data.get("candidates", [])
    if not cand:
        print(f"No candidates: {data}"); sys.exit(1)
    parts = cand[0].get("content", {}).get("parts", [])
    img_b64 = None
    for p in parts:
        if "inlineData" in p:
            img_b64 = p["inlineData"]["data"]
            break
        if "inline_data" in p:
            img_b64 = p["inline_data"]["data"]
            break
    if not img_b64:
        print(f"No inline_data in parts: {parts}"); sys.exit(1)

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "wb") as f:
        f.write(base64.b64decode(img_b64))
    size_kb = os.path.getsize(OUT_PATH) // 1024
    print(f"Saved : {OUT_PATH} ({size_kb} KB)")

    usage = data.get("usageMetadata", {})
    if usage:
        print(f"Tokens : in={usage.get('promptTokenCount','?')} out={usage.get('candidatesTokenCount','?')}")


if __name__ == "__main__":
    main()
