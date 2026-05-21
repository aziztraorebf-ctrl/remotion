"""Atlas Mansa Moussa V2 - Carte statique C1 Afrique Ouest XIVe parchemin Mande.

Test gate bloquante: valider style avant generer reste cartes V2.
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "v2" / "maps"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "C1-afrique-ouest-test.png"

PROMPT = """Subject: Stylized historical map of West Africa, 14th century context, parchment Mande aesthetic.

COMPOSITION (vertical portrait orientation):
- Centered focus on West Africa: Sahel + Sahara southern edge + Atlantic coast (Senegal/Mauritania) + Niger river bend + Lake Chad area
- No country labels, no text, no captions, no compass rose, no scale bar
- No characters, no caravans, no people, no animals
- Subtle topographic relief: Sahara dunes texture north, Sahel scrubland mid, Niger river clearly visible as flowing line, mountains (Air, Adrar) suggested

PALETTE (strict):
- Background parchment: warm sepia #E8D9B5 with subtle aging stains (no heavy grunge)
- Land: muted indigo #1F2A4A with 0.55 opacity feel for modern country shapes (BUT no borders drawn, just landmass tint)
- Sahara/desert: warm terracotta #C97D5A wash, soft gradient
- Water (Atlantic + Niger river): deep indigo #0F1E3D with subtle ripple texture
- Accent gold #D4A574 used VERY sparingly (river highlights only)

STYLE:
- Hand-drawn cartographic feel, ink-on-parchment but CLEAN and modern (NOT heavy grunge, NOT distressed)
- Subtle paper texture but NOT vintage-overprocessed
- Painterly washes, soft edges
- Reference: medieval Mali codex aesthetic but with modern legibility
- Flat illustration mood, GeoAfrique editorial style

ABSOLUTELY NO:
- Country borders/boundary lines
- Text, labels, place names, dates
- Modern map elements (legend, north arrow, grid)
- Photorealistic terrain, satellite imagery look
- Decorative cartouches, sea monsters, ship icons

Aspect: vertical 9:16 portrait format. Highest quality. Sharp focus."""


def main() -> int:
    print(f"Output: {OUT_FILE}")
    print(f"Model: {MODEL}")
    print(f"Cost preview: ~$0.07")
    print()
    response = client.models.generate_content(
        model=MODEL,
        contents=[PROMPT],
        config=types.GenerateContentConfig(response_modalities=["image", "text"]),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            OUT_FILE.write_bytes(part.inline_data.data)
            print(f"OK saved: {OUT_FILE} ({len(part.inline_data.data)/1024:.1f} KB)")
            return 0
        elif part.text:
            print(f"Text: {part.text}")
    print("ERROR: No image")
    return 1


if __name__ == "__main__":
    sys.exit(main())
