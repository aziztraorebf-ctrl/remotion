"""
Generation end frame Mansa Moussa — base V3C via Part.from_bytes
Modification chirurgicale uniquement : chin legerement releve, regard plus direct
Tout le reste identique a V3C (couronne, robe, barbe, fond)
Output : public/assets/geoafrique/characters/mansa-moussa-v3c-endframe.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c-endframe.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """
This is the same character — make only one subtle change to the pose:
- Chin raised very slightly upward — looking slightly above the viewer
- Eyes fully open, direct piercing gaze — cold absolute authority
- Everything else must remain IDENTICAL: crown, robe, beard, necklace, colors, background, flat design style

Keep strictly:
- Same flat 2D illustration style — NO added realism, NO texture, NO shading
- Same tiara-style gold crown with geometric patterns
- Same emerald green robe with gold embroidery
- Same structured beard shape and size
- Same near-black background
- Same skin tone

Only the chin angle and eye gaze change. Nothing else.
"""


def generate():
    print("=== Generating Mansa Moussa V3C — end frame (from_bytes) ===")
    print(f"Source: {SOURCE_PATH}")
    print(f"Output: {OUTPUT_PATH}")

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
