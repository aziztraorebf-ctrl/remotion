"""
Surgical Gemini edit — remove the compass rose from map A.
Keep everything else identical.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

SOURCE = Path(__file__).parent.parent.parent / "tmp" / "soundjata-empire-maps" / "A-parchment-gold-empire.png"
OUTPUT = Path(__file__).parent.parent.parent / "tmp" / "soundjata-empire-maps" / "A-parchment-gold-empire-noCompass.png"

PROMPT = """Take this map image exactly as it is. Make ONE surgical change:

REMOVE the decorative compass rose that appears in the upper-left corner of the map.
Replace that area with the SAME aged parchment background texture and tones as the rest of the map.

DO NOT change anything else:
- Keep the Mali Empire territory shaded in gold exactly as it is
- Keep the Niger River exactly as it is
- Keep the blue ocean on the left/south exactly as it is
- Keep the decorative border around the edges
- Keep the overall parchment texture, palette, and medieval illustrated style
- Keep the same composition and proportions

Output the edited image. No text, no labels, no other changes."""


def main():
    if not SOURCE.exists():
        print(f"ERROR: {SOURCE} not found")
        return

    source_bytes = SOURCE.read_bytes()
    print(f"Input : {SOURCE.name} ({len(source_bytes) // 1024}KB)")

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=source_bytes, mime_type="image/png"),
            PROMPT,
        ],
        config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
    )

    image_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
            break

    if not image_bytes:
        print("FAIL: no image generated")
        return

    OUTPUT.write_bytes(image_bytes)
    print(f"OK: {OUTPUT.name} ({len(image_bytes) // 1024}KB)")


if __name__ == "__main__":
    main()
