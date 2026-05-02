"""Generate Mansa Moussa portrait B — BD flat modern with imposed palette (test variant).
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
OUT_FILE = OUT_DIR / "mansa-portrait-B-bdflat.png"

PROMPT = """Portrait of Mansa Musa I of Mali (14th century West African emperor), regal seated three-quarter view, intense direct gaze toward viewer suggesting power and dignity, holding a single golden nugget in his right hand, wearing royal robes with intricate Mande textile patterns (mudcloth motifs), elaborate golden crown with West African geometric ornaments. Style: modern flat illustration with bold clean lines (BD/comic flat color style, NOT paper-craft, NOT cartoon), expressive detailed face with nuanced expression, simplified but realistic anatomy, smooth gradient-free flat color fills, similar to contemporary editorial illustration (Aaron Blaise / Kim Jung Gi simplified / Aurelien Police aesthetic). Background is solid deep indigo color #1F2A4A (completely solid flat indigo, no gradient, no texture, no sky, extending to all edges). Strict color palette imposed: terracotta #A85A3A for skin warm tones, sandy beige #C4995A for accents, golden amber #D4A574 for crown and gold nugget, parchment cream #F2E5C8 for highlights, deep umber #3A2A1A for skin shadow tones, all on solid indigo #1F2A4A background. No text, no modern elements, no white. Centered composition for circular medallion crop. 1024x1024 square format."""


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
