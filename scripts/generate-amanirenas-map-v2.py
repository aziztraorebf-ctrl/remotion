"""
Genere une carte Nil/Nubie/Egypte pour Amanirenas
Style : vivid_shapes flat graphic, sans texte, sans annotations
Gemini 3.1 Flash Image — v2 (style force vivid_shapes)
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
Bold flat vector graphic map of northeast Africa. NO TEXT, NO LABELS, NO ANNOTATIONS, NO WRITING anywhere in the image.

Vertical 9:16 portrait format. Geographic layout from top to bottom:
- Top: Mediterranean Sea as a solid deep navy blue (#1a2a6e) shape
- Upper middle: Egypt as a large solid warm gold/ochre (#d4a040) territory
- Center: The Nile River as a bold dark navy ribbon, clearly sinuous, running from top to bottom as the central vertical axis
- Small white turbulent zone at the First Cataract
- Lower half: Nubia and Meroe territory as rich solid terracotta/burnt orange (#c44a1a)
- Bottom edge: suggestion of savanna as olive green band

Style: BOLD vivid flat shapes. Maximum color contrast between regions. Hard clean edges between color blocks — like a graphic novel or poster. Think Kurzgesagt map style. Bold, graphic, illustrative. NO gradients, NO textures, NO photorealism, NO text of any kind.
"""


def generate_gemini():
    print("=== Gemini Flash Image — Carte Nil/Nubie v2 (vivid style) ===")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=PROMPT_GEMINI,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            out = OUTPUT_DIR / "map-nil-gemini-v2.png"
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
