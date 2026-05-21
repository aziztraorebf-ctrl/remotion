"""Generate Mansa Moussa portrait A — Paper-Craft sepia (style V8 Tombouctou cohesive).
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
OUT_FILE = OUT_DIR / "mansa-portrait-A-papercraft.png"

PROMPT = """Portrait of Mansa Musa I of Mali (14th century West African emperor), regal seated pose, looking forward with calm authority, holding a single golden nugget in his right hand, wearing royal robes inspired by Mande textile traditions (mudcloth/bogolan patterns in earth tones), elaborate golden crown with West African motifs, dark skin rendered with paper-craft layered sepia tones, dot eyes simplified and stylized, neutral facial expression suggesting wisdom. Style: paper-craft hand-cut layers, visible paper grain texture, sepia and warm earth tones aesthetic from the Atlas Geoafrique series (cohesive with Tombouctou Sankore Mosque medallion V8). Background is solid deep indigo color #1F2A4A (completely solid flat indigo, no gradient, no texture, no sky, extending to all edges). Color palette: terracotta #A85A3A, sandy beige #C4995A, golden amber #D4A574 for crown and gold nugget, parchment cream #F2E5C8 for highlights, deep brown for skin shadow tones, all on solid indigo #1F2A4A background. No text, no modern elements. Centered composition for circular medallion crop. 1024x1024 square format."""


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
