"""Generate Sankore mosque icon for Atlas Tombouctou Phase 2 showcase.
Style: stylized illustration, transparent background, palette coherent with Atlas identity.
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

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-tombouctou" / "assets"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "mosquee-sankore.png"

PROMPT = """Generate a stylized vertical illustration of the Sankore Mosque of Timbuktu, the iconic 14th century mud-brick (banco) mosque with wooden beam protrusions (toron).

Style requirements:
- Flat 2D illustration, NO 3D rendering, NO photorealism
- Hand-drawn stylized line art with flat color fills
- Color palette ONLY:
  * Terracotta orange (#A85A3A) for the mosque walls
  * Dark indigo (#1F2A4A) for outlines and shadows
  * Warm cream (#F2E5C8) for highlights
  * Gold (#D4A574) for accents
- Solid indigo blue background (#1F2A4A) filling the entire canvas — NOT transparent
- The mosque should be the only element, centered on this solid indigo background
- Iconic features: pyramidal minaret with wooden beams sticking out, square mud-brick base, traditional Mande architecture

Composition:
- Front view, perfectly centered
- Mosque takes ~70% of canvas height
- Symmetric vertical composition
- Clean silhouette, easily recognizable as a small icon

Critical:
- NO text, NO letters, NO writing
- NO people, NO animals, NO landscape
- NO atmospheric effects, NO clouds
- Sharp clean lines, suitable for use as a small icon overlay (~200x200px display size)
- The image IS placed on a solid indigo blue (#1F2A4A) background — the indigo IS the background color

Format: 1024x1024, PNG with solid background."""


def main() -> int:
    print(f"Output: {OUT_FILE}")
    print(f"Model: {MODEL}")
    print(f"Cost preview: ~$0.07")
    print()

    response = client.models.generate_content(
        model=MODEL,
        contents=[PROMPT],
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            OUT_FILE.write_bytes(part.inline_data.data)
            size_kb = len(part.inline_data.data) / 1024
            print(f"OK saved: {OUT_FILE} ({size_kb:.1f} KB)")
            return 0
        elif part.text:
            print(f"Text response: {part.text}")

    print("ERROR: No image in response")
    return 1


if __name__ == "__main__":
    sys.exit(main())
