"""
Generation Mansa Moussa V2 — portrait corrige
- Demi-frere (pas neveu), probablement plus jeune qu'Abou Bakari
- Barbe historique plausible, pas moderne
- Pas de bagues (anachronique)
- Robe vert emeraude (V1C retenu par Aziz)
- Semi-realiste flat design (pas photoréaliste)
Output : public/assets/geoafrique/characters/mansa-moussa-v2.png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v2.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """
Close-up portrait of Mansa Moussa, half-brother and successor of Abou Bakari II, West African Mali Empire, early 14th century.
Powerful sovereign gaze, direct and cold — he does not look toward the horizon, he owns it.
Neat full beard, historically plausible for 14th century West Africa — full but not modern-styled or hipster-trimmed.
Slightly younger than middle age — vigorous, not elderly.

Massive gold crown with intricate Mali empire geometric patterns — tiered, imposing, distinctly African design, NOT European crown shape.
Heavy gold pectoral necklace spanning the chest.
Rich deep emerald green royal robe (#1B5E20) with dense gold embroidery covering shoulders and chest.
Hands resting on ornate throne armrests — no rings, no modern jewelry.
Dark deep skin tone (#3D1F0F), clean stylized shapes.

Dark palace interior background — warm deep tones, subtle architectural hint of Mali palace, no bright colors.

Stylized semi-realistic flat design — NOT fully photorealistic, clean vector-inspired shapes with depth and texture.
9:16 vertical format, 1080x1920.
NO text, NO labels, NO decorative background elements.
"""


def generate():
    print("=== Generating Mansa Moussa V2 — corrected portrait ===")
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
