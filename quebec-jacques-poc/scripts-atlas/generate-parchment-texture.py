"""Generate parchment texture for V2 hybrid satellite overlay.

Output: PNG 1024x1024 seamless-ish parchment texture, Mande sepia palette.
Used as multiply overlay on top of Mapbox satellite views.
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

OUT_DIR = ROOT / "quebec-jacques-poc" / "public" / "textures"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "parchment-mande.png"

PROMPT = """Aged parchment paper texture, full-frame square format, no objects, no characters, no text, no borders, no decorative elements.

Visual qualities:
- Warm sepia tones: cream #F2E5C8 base with subtle aging
- Soft brown stains and warm patina (NOT heavy grunge, NOT distressed)
- Natural fiber texture (subtle cross-hatch paper grain visible up close)
- Slight terracotta tint #C97D5A in the corners
- Gentle aging marks (small spots, subtle creases) but overall CLEAN
- Mande/West African aged manuscript paper feel
- Photographic quality, top-down flat scan view

Critical:
- NO text, NO writing, NO calligraphy, NO ink marks
- NO borders, NO decorative motifs
- NO maps, NO drawings
- Just RAW aged parchment texture, edge-to-edge
- Suitable to be used as a tileable texture overlay

Background should fill the entire frame uniformly. 1024x1024 square."""


def main() -> int:
    print(f"Output: {OUT_FILE}")
    print(f"Cost: ~$0.07")
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
