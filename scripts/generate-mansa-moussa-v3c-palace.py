"""
Edit chirurgical V3C — ajout fond palais + trone visible
Source : mansa-moussa-v3c.png (personnage valide)
Modification : fond noir -> palais malien + accoudoirs trone
Output : public/assets/geoafrique/characters/mansa-moussa-v3c-palace.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c-palace.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """
Keep this character IDENTICAL — do not change anything about the face, crown, beard, robe, necklace, or skin tone.

Only add these two elements behind and around the character:

1. BACKGROUND — Mali royal palace interior:
- Dark warm tones: deep burgundy (#3B0000) and dark gold (#4A3200)
- Two tall rounded arches visible behind the shoulders, flat design style
- Subtle flat columns on each side, same flat 2D illustration style as the character
- No bright colors, no windows, no light sources — dim and powerful atmosphere
- Background must feel BEHIND the character, not overlapping

2. THRONE — ornate seat visible at sides:
- Two throne armrests visible at lower left and right edges of frame
- Dark carved wood with gold geometric inlay, flat design shapes
- Armrests anchor the character — he is clearly seated on a throne
- Keep throne elements subtle — they frame the character, not compete with him

Maintain strict 2D flat design style throughout — same as the character.
9:16 vertical format, 1080x1920.
NO text, NO labels.
"""


def generate():
    print("=== Edit chirurgical V3C — ajout palais + trone ===")
    print(f"Source : {SOURCE_PATH}")
    print(f"Output : {OUTPUT_PATH}")

    with open(SOURCE_PATH, "rb") as f:
        image_bytes = f.read()

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
            types.Part.from_text(text=PROMPT),
        ],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    output_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            output_bytes = part.inline_data.data
            break

    if not output_bytes:
        print("ERROR: No image in response")
        return None

    with open(OUTPUT_PATH, "wb") as f:
        f.write(output_bytes)

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"Saved: {OUTPUT_PATH} ({size_kb:.0f} KB)")
    return str(OUTPUT_PATH)


if __name__ == "__main__":
    path = generate()
    if path:
        import subprocess
        subprocess.run(["open", path], check=False)
