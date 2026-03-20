"""
Beat05 Plan 2 — Caravane v3 — suppression rayons soleil + bande noire
Source : beat05-plan2-caravan-v2.png
Output : public/assets/geoafrique/beat05-plan2-caravan-v3.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
import subprocess

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-plan2-caravan-v2.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-plan2-caravan-v3.png"

PROMPT = """
Keep this image IDENTICAL — same desert, same camels, same handlers, same dunes, same composition, same colors.

Make exactly TWO changes :

CHANGE 1 — Sun rays : Remove ALL sun rays completely. Replace with a clean solid gold circle sun #D4AF37 with no rays, no spokes, no radiating lines. Just a flat bold circle on the horizon.

CHANGE 2 — Black band at top : Remove the black band at the top of the image. Extend the sky downward from where the black band was — fill it with deep dark sky color matching the dark tone just below the black band (very dark brown #1A0A00 or deep dark gold gradient). The sky should fill the entire top portion naturally, no hard edge.

Do NOT change : camels, handlers, dunes, shadows, caravan composition, colors, flat 2D style.
9:16 vertical format. NO text. NO labels.
"""


def generate():
    print("=== Beat05 Plan 2 — Caravane v3 — sans rayons + sans bande noire ===")

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
        subprocess.run(["open", path], check=False)
