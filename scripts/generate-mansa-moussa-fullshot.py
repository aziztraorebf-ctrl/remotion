"""
Mansa Moussa — plan moyen (full shot)
Sujet occupe ~50% du cadre — espace pour mouvement Kling
Trone visible en entier, palais autour, sol visible
Output : public/assets/geoafrique/characters/mansa-moussa-fullshot.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-fullshot.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """
Redraw this character as a full medium shot — same character design, completely different framing.

FRAMING — CRITICAL:
- Camera pulled back far — Mansa Moussa visible from head to feet
- Figure occupies only 50% of frame height — lots of space above and around him
- Seated on a large ornate throne, both armrests and throne legs fully visible
- Feet and lower robe visible at bottom of frame

CHARACTER (keep identical to reference):
- Same face, crown, beard, necklace, emerald green robe with gold embroidery
- Same flat 2D illustration style — NO photorealism
- Same skin tone, same crown design

THRONE:
- Large imposing throne fully visible — dark carved wood with gold geometric inlay
- Wide armrests, tall throne back rising behind him
- Throne on a raised dais/platform — 2-3 steps visible at base

PALACE ENVIRONMENT (fill the frame around him):
- Tall arched ceiling visible above — lots of vertical space
- Two large columns flanking the throne
- Rich palace floor visible in foreground — geometric tile pattern, dark warm tones
- Warm deep tones throughout: dark bordeaux, deep gold, near-black shadows
- Flat 2D illustration style matching the character

Flat 2D vector illustration style throughout — same as character.
9:16 vertical format, 1080x1920.
NO text, NO labels.
"""


def generate():
    print("=== Mansa Moussa — full shot plan moyen ===")

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
