"""
End frame pour Crane Up — meme scene, camera plus basse
Start frame : buste + couronne + arches palais (palace version)
End frame   : meme scene mais camera plus basse — on voit plus de trone,
              les accoudoirs plus visibles, le bas de la robe visible,
              couronne en haut du cadre — comme si la camera etait descendue
Output : public/assets/geoafrique/characters/mansa-moussa-craneup-endframe.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c-palace.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-craneup-endframe.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """
Keep this character and setting IDENTICAL — same face, crown, beard, robe, necklace, palace background.

Only change the camera framing — as if the camera has moved DOWN:
- The crown is now near the TOP of the frame, showing more space above the shoulders
- More of the throne armrests visible at the bottom of the frame
- More of the robe/chest visible — camera is lower, looking slightly upward at the figure
- The palace arches behind are still visible but shifted slightly upward in frame
- Figure appears more imposing — camera below eye level looking up slightly

Same flat 2D illustration style throughout.
Same colors, same character design, same palace background.
9:16 vertical format, 1080x1920.
NO text, NO labels.
"""


def generate():
    print("=== Crane Up end frame — camera basse, trone visible ===")
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
