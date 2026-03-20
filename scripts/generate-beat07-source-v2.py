"""
Beat07 Colomb — source v2 — etalonnage froid
Retouche chirurgicale : ciel gris plombe, lumiere desaturee, froideur Atlantique Nord
Source : beat07-colomb-source-v1.png
Output : public/assets/geoafrique/beat07-colomb-source-v2.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
import subprocess

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat07-colomb-source-v1.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat07-colomb-source-v2.png"

PROMPT = """Keep this image IDENTICAL — same caravel ship, same composition, same flat 2D graphic style, same waves, same sails, same hull, same flag, same overall structure.

Make ONLY color and mood changes:

1. SKY: Replace the light blue sky with heavy overcast grey — color #8A9099, flat and oppressive, no brightness
2. CLOUDS: Make the clouds dark grey and heavy (#5A6170), like storm clouds before rain, no white brightness
3. OCEAN: Desaturate the ocean to a cold grey-blue (#4A5C70), remove warmth completely
4. OVERALL TONE: Apply a cold desaturated filter across the entire image — reduce saturation by 60%, reduce brightness by 20%
5. SAILS: Keep white but make them slightly grey (#E8E4DF) — less brilliant
6. MOOD: The result should feel like a cold grey winter day on the North Atlantic — factual, cold, mechanical — NOT adventurous or heroic

Do NOT change: ship structure, composition, wave style, flat 2D graphic quality, size or position of any element."""

def generate():
    print("=== Beat07 Colomb — Etalonnage froid v2 ===")

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
