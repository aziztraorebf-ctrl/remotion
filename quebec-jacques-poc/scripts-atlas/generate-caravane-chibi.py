"""Generate caravane chibi PNG transparent for Atlas V2 scene S3 Climax Hadj.

Style guide reference: abou-bakari-royal-charref-v1.png (canon GeoAfrique BD flat)
But: DIFFERENT character, Mande costume, on camel, side view, transparent BG.
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

REF_PATH = ROOT / "public" / "assets" / "abou-bakari" / "refs" / "abou-bakari-royal-charref-v1.png"

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "v2" / "chibi"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "caravane-chibi-transparent.png"

PROMPT = """Use the reference image as STYLE GUIDE ONLY for the canon flat illustration GeoAfrique aesthetic. Generate a DIFFERENT character.

Subject: Single small chibi figure - a Mali Empire 14th-century traveler riding a dromedary camel, side view (camel facing right).

Character details:
- Rider wearing traditional Mande/Soninke nomadic robes (indigo blue + cream + small gold accents)
- Turban or head wrap (indigo)
- Skin tone: warm brown
- Holding leather reins
- Slightly bent posture (long journey across Sahara)
- Single chibi style with simple proportions, friendly face, dot-eyes

Camel details:
- Single dromedary (one hump)
- Light tan/beige fur color (not white, not too dark)
- Walking pose, side profile, all 4 legs visible
- Realistic chibi proportions (not realistic photographic)
- Simple harness/saddle in dark brown leather

Style:
- Flat illustration GeoAfrique canon (clean shapes, no heavy texture, no paper-craft)
- Soft outlines (not heavy black lines)
- Warm sepia/terracotta accents on saddle
- Coherent palette with reference: indigo, cream, terracotta, gold accents

CRITICAL technical requirements:
- TRANSPARENT BACKGROUND (PNG transparent, no solid color, no white, no parchment)
- Single composition centered in frame
- No text, no labels, no captions
- No additional characters, no scenery, no ground line, no shadow on ground
- The figure should be clearly silhouetted on transparent

Aspect: 1024x1024 square. The chibi character + camel should occupy the central 70% of the frame, with empty transparent space around for compositing."""


def main() -> int:
    print(f"Reference: {REF_PATH.name}")
    print(f"Output: {OUT_FILE}")
    print(f"Cost: ~$0.07")
    print()

    ref_bytes = REF_PATH.read_bytes()
    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
            PROMPT,
        ],
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
