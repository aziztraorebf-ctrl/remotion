"""
Genere une carte Nil/Nubie/Egypte pour Amanirenas
Style : flat 2D illustration, sans texte, sans annotations
3 variantes : Gemini semi-realiste, Recraft vivid_shapes, Recraft emotional_flat
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = Path(__file__).parent.parent / "tmp/brainstorm/maps"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT_GEMINI = """
Flat 2D illustrated map of northeast Africa, NO TEXT, NO LABELS, NO ANNOTATIONS anywhere.

Geographic layout (vertical 9:16 format):
- Top third: Mediterranean Sea (deep blue), delta of the Nile spreading into it
- Middle: Egypt territory (warm sandy gold/ochre), the Nile as a clear blue-green ribbon running vertically through the center
- Lower middle: First Cataract of the Nile (visible as white water rapids, narrow zone)
- Bottom two-thirds: Nubia/Meroe territory (rich terracotta/burnt orange), the Nile continuing south
- Far bottom: suggestion of savanna/desert

Style: bold flat shapes with clear color blocks. Deep lapis blue for water.
Sandy gold for Egypt. Rich terracotta for Nubia. Clean graphic illustration,
no photorealism, no gradients, no text anywhere.
The Nile must be clearly visible as the central axis of the entire image.
"""

def generate_gemini():
    print("=== Gemini Flash Image — Carte Nil/Nubie ===")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=PROMPT_GEMINI,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            out = OUTPUT_DIR / "map-nil-gemini-v1.png"
            out.write_bytes(part.inline_data.data)
            size_kb = out.stat().st_size // 1024
            print(f"Saved: {out} ({size_kb} KB)")
            return str(out)

    print("No image in response")
    return None


if __name__ == "__main__":
    path = generate_gemini()
    if path:
        import subprocess
        subprocess.run(["open", path], check=False)
        print(f"\nDone: {path}")
