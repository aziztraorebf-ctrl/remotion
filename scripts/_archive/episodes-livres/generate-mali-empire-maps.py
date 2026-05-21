"""
Generate 3 Gemini maps of the Mali Empire for Soundjata acte VI.
Different styles to compare.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUTPUT_DIR = Path(__file__).parent.parent.parent / "tmp" / "soundjata-empire-maps"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MAPS = {
    "A-parchment-gold-empire": """A medieval illustrated map of West Africa on aged parchment, circa 1236 AD — showing the Empire of Mali at its greatest extent.

FORMAT: VERTICAL 9:16 (1080x1920 portrait orientation) — the map fills the frame.

STYLE: painted illustrated fantasy map, aged sepia parchment background, warm ochre and amber tones throughout. Graphic novel aesthetic with bold outlines. Not photographic, not modern cartography.

KEY ELEMENTS:
- The Mali Empire territory is clearly SHADED IN RICH GOLD AND OCHRE TONES covering the region from the Atlantic coast (Senegal/Gambia) east to Timbuktu and the Niger River bend.
- Surrounding regions outside the empire are in faded cream/neutral tones without color.
- The Niger River is visible as a thin blue-grey curving line threading through the empire.
- Subtle topographical texture — hills suggested with small painted shapes, scattered trees.
- A decorative compass rose in one corner (ochre and dark brown).
- Thin decorative border around the map edges.

NO TEXT, NO CITY NAMES, NO LABELS, NO LETTERS, NO NUMERALS visible anywhere on the map. The map must be completely clean of any written text so we can add labels in Remotion.

The overall feel: a rich, noble historical map that immediately communicates "medieval West African empire" without any text.""",

    "B-watercolor-minimal": """A minimalist watercolor-style map of West Africa showing the Mali Empire circa 1236.

FORMAT: VERTICAL 9:16 (1080x1920 portrait orientation).

STYLE: soft watercolor painting, muted warm palette (ochre, terracotta, cream, soft amber), painted 2D aesthetic, gentle texture, NOT photographic.

KEY ELEMENTS:
- The Mali Empire territory is painted in a warm SATURATED GOLDEN-OCHRE wash — clearly distinct from surrounding regions.
- Surrounding regions are in pale washed-out cream and grey, creating strong contrast.
- The Niger River visible as a thin indigo curve.
- Atlantic Ocean to the west shown as soft grey-blue wash.
- Sparse visual elements — no clutter, no mountains, no trees. Clean minimalist approach.
- Subtle paper grain texture overall.

BACKGROUND: soft cream-colored background, not parchment texture.

NO TEXT, NO CITY NAMES, NO LABELS, NO LETTERS, NO NUMERALS visible anywhere. The map must be clean.

The overall feel: noble, quiet, refined — emphasizes scale and contrast through color only.""",

    "C-ancient-manuscript": """A medieval Arabic/African manuscript-style map of the Mali Empire, inspired by 14th-century Islamic cartography traditions.

FORMAT: VERTICAL 9:16 (1080x1920 portrait orientation).

STYLE: painted illuminated manuscript, rich ochre and dark red tones, gold leaf highlights, bold black outlines, graphic novel aesthetic. Similar to al-Idrisi or Catalan Atlas style but West African.

KEY ELEMENTS:
- The Mali Empire territory is rendered in DEEP RICH GOLD with darker amber borders clearly delineating the imperial territory from Atlantic coast to Timbuktu region.
- Surrounding lands in faded muted earth tones.
- Stylized mountains suggested as small painted triangular shapes along certain regions.
- The Niger River as a decorative serpentine line in darker ink.
- An ornate circular decoration (like a medallion or star pattern) in one corner.
- Aged paper texture with slight darkening at edges (vignette effect).

NO TEXT, NO CITY NAMES, NO LABELS, NO LETTERS, NO ARABIC SCRIPT, NO NUMERALS visible anywhere. The map must be completely clean.

The overall feel: precious, historical, connecting Mali to its rich trans-Saharan cultural context.""",
}


def generate(map_id: str, prompt: str):
    print(f"\n--- {map_id} ---")
    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt],
        config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
    )

    image_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
            break

    if not image_bytes:
        print(f"  FAIL")
        return

    out = OUTPUT_DIR / f"{map_id}.png"
    out.write_bytes(image_bytes)
    print(f"  OK: {out.name} ({len(image_bytes) // 1024}KB)")


if __name__ == "__main__":
    for map_id, prompt in MAPS.items():
        generate(map_id, prompt)
    print(f"\nOutput: {OUTPUT_DIR}")
