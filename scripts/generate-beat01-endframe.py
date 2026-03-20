"""
Beat01 end frame — Afrique de l'Ouest zoomee, Mali centre.
Style identique a beat01-v5.png (terracotta, fond spatial noir, halo dore).
Utilise beat01-v5.png comme reference multimodale pour coherence de style.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

REF_IMAGE = Path(__file__).parent.parent / "public/assets/geoafrique/beat01-v5.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat01-endframe-v5.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """
I am giving you a reference image. In that image, there is Africa shown as a flat terracotta shape on a dark space background.

Your task: redraw ONLY the top-left portion of that continent — the West Africa region — as if a camera has zoomed in 2x toward it.

The output must look like a digital zoom crop of the reference image, centered on the upper-left quadrant of the African continent shape shown in the reference.

Keep EXACTLY:
- Same flat terracotta color (#A52A2A) for the land
- Same dark background (#050208)
- Same golden atmospheric glow, now filling the bottom third of the frame (we are closer)
- Same flat 2D vector style, zero photorealism

The continent silhouette must match the reference exactly — just larger and cropped.
The left coastline (Atlantic side with the bulge) should be visible on the left side of the frame.
The top of the continent should be cut off at the top of the frame (we have zoomed past it).

NO borders, NO labels, NO stars, NO text.
Format: 9:16 vertical (1080x1920).
"""


def generate():
    print("=== Beat01 end frame — Afrique Ouest zoomee ===")
    print(f"Reference: {REF_IMAGE}")
    print(f"Output: {OUTPUT_PATH}")

    with open(REF_IMAGE, "rb") as f:
        ref_bytes = f.read()

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[
            types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
            PROMPT,
        ],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    image_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
            break

    if not image_bytes:
        print("ERROR: No image in response")
        return None

    with open(OUTPUT_PATH, "wb") as f:
        f.write(image_bytes)

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"Saved: {OUTPUT_PATH} ({size_kb:.0f} KB)")
    return str(OUTPUT_PATH)


if __name__ == "__main__":
    path = generate()
    if path:
        import subprocess
        subprocess.run(["open", path], check=False)
