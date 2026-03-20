"""
Beat06 Obsession — source v2 — correction zone noire inferieure gauche
Source : beat06-obsession-source-v1.png
Output : public/assets/geoafrique/beat06-obsession-source-v2.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
import subprocess

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat06-obsession-source-v1.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat06-obsession-source-v2.png"

PROMPT = """Keep this image IDENTICAL — same silhouette, same crown, same waves inside the silhouette, same golden horizon line, same stars in the upper sky, same composition.

Make exactly ONE change:

The bottom-left area of the image is solid black and empty. Replace it with deep dark ocean water — the same dark navy color (#0a1628) as the waves inside the silhouette, but flat and calm. The horizon line already divides the image horizontally: above it is the starry sky, below it should be deep dark ocean water filling the entire bottom-left void. Keep the ocean flat and minimal — no waves, just a deep dark navy surface. The bottom of the image becomes the ocean floor / dark water, not black void.

Do NOT change: the silhouette, the crown, the waves inside the silhouette, the golden outline, the stars, the sky, the horizon line, the overall composition."""

def generate():
    print("=== Beat06 — Correction zone noire inferieure ===")

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
