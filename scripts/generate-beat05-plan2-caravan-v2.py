"""
Beat05 Plan 2 — Caravane v2 — edit chirurgical
Ajout conducteurs/guides a cote des chameaux
Source : beat05-plan2-gemini-c.png
Output : public/assets/geoafrique/beat05-plan2-caravan-v2.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
import subprocess

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-plan2-gemini-c.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-plan2-caravan-v2.png"

PROMPT = """
Keep this image IDENTICAL — same desert landscape, same camels, same gold sacks, same sun, same composition, same colors.

Only add one thing : human figures walking alongside the camels.

FIGURES TO ADD :
- One robed figure per camel, walking beside it on the left side
- Figures in long flowing robes — dark burgundy #6B0000 or deep brown — same flat 2D style as the rest of the image
- Figures are guides/handlers leading the caravan — they walk at the same pace as the camels
- Figures are silhouettes — no facial detail, just flat 2D shapes consistent with the graphic style
- Scale : figures should be slightly shorter than the camels
- Their shadows cast on the desert sand, consistent with the existing camel shadows and sun direction

Do NOT change anything else — no sky, no dunes, no camels, no sun, no composition.
Same flat 2D vector illustration style throughout.
9:16 vertical format.
NO text, NO labels.
"""


def generate():
    print("=== Beat05 Plan 2 — Caravane v2 — ajout conducteurs ===")
    print(f"Source : {SOURCE_PATH}")

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
