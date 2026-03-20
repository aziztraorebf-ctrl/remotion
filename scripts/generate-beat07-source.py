"""
Beat07 Colomb — source image
Caravelle europeenne de profil, style flat 2D, palette froide (bleu-gris)
Contraste delibere avec les bleus chauds et dores des scenes africaines
Output : public/assets/geoafrique/beat07-colomb-source-v1.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
import subprocess

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat07-colomb-source-v1.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """Create a vertical 9:16 illustration in flat 2D graphic style.

Scene: A single European caravel sailing from left to right across a vast grey-blue ocean. The ship is seen in profile, detailed but flat — white sails, dark wooden hull, a cross flag. The ocean is turbulent with stylized waves. The sky is cold grey-blue, dramatic cumulus clouds. A faint distant coastline on the right edge.

Color palette: COLD and desaturated — slate grey (#4A5568), cold steel blue (#6B7FA3), off-white sails (#F0EDE8), dark mahogany hull (#3D1F0F), pale grey sky (#C9D0D8). NO gold, NO warm amber, NO navy deep blue.

Composition: The caravel occupies the center-right, sailing purposefully toward the right edge. Large dramatic sky above (60% of image). The ocean fills the bottom 40%.

Style: Same flat vector 2D as the rest of the video — clean shapes, minimal detail, no photorealism, no gradients, no texture. Bold outlines. Cinematic but graphic.

The mood is cold, mechanical, purposeful — contrast with the warm African scenes."""

def generate():
    print("=== Beat07 Colomb — Source Gemini ===")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[types.Part.from_text(text=PROMPT)],
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
