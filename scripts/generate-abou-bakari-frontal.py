"""
Generation vue frontale Abou Bakari II — hero reference pour Kling O3 reference-to-video
Output: public/assets/geoafrique/abou-bakari-frontal-v1.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/abou-bakari-frontal-v1.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """
Flat design vector illustration of a West African king, front-facing portrait.
Strict 2D illustration style — NO photorealism, NO 3D rendering, NO gradients on skin.

Character design (match exactly):
- Dark brown skin, flat filled shapes, clean outlines
- Golden embroidered kufi cap with geometric scale/diamond pattern on top
- Golden/mustard yellow traditional tunic/boubou, subtle seam lines in darker gold
- Calm, noble expression — eyes open, looking forward
- Strong jaw, defined flat features in the style of modern African flat design illustration
- NO beard, clean face

Composition:
- Bust portrait, centered, filling upper 60% of frame
- Solid black background (#050208), no texture, no gradient
- Slight breathing room around the character

Color palette (strict):
- Skin: #8B5E3C flat fill
- Cap and garment: #D4AF37 (gold) with #B8942A (darker gold) for details
- Background: #050208 (black)
- Outlines: none or very subtle dark lines only

Format: 9:16 vertical (1080x1920)
Style reference: modern African documentary flat design, clean vector shapes, premium animated documentary aesthetic
NO text, NO labels, NO decorative elements in background
"""

def generate():
    print("=== Generating Abou Bakari II — frontal hero reference ===")
    print(f"Output: {OUTPUT_PATH}")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=PROMPT,
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
