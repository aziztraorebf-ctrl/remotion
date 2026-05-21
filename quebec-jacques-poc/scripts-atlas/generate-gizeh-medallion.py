"""Generate Gizeh pyramids medallion for Atlas Mansa Moussa scene 4.
Style: paper-craft sepia, solid indigo background for circular medallion crop.
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

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "assets"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "gizeh-medallion.png"

PROMPT = """Cinematic illustration of the Pyramids of Giza at sunset, featuring the Great Pyramid prominent in the foreground with two smaller pyramids behind it, golden warm light hitting the limestone faces, ancient Egyptian architecture rendered in textured paper-craft style with sepia tones and subtle hand-cut paper layers. Background is solid deep indigo color #1F2A4A (no sky, no gradient, no clouds, completely solid indigo flat background extending to all edges of the image). The pyramids cast long sharp shadows. Color palette restricted to: warm terracotta #A85A3A, sandy beige #C4995A, golden amber #D4A574, parchment cream #F2E5C8 for highlights, all on solid indigo #1F2A4A background. Style: Atlas Geoafrique series, cohesive with Mali Empire parchment-craft aesthetic. No people, no text, no modern elements, no Sphinx. Centered composition for circular medallion crop. 1024x1024 square format."""


def main() -> int:
    print(f"Output: {OUT_FILE}")
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
