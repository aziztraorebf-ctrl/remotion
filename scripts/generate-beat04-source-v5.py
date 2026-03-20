"""
Beat04 — Source v5 : correction sur beat04-start-frame-v1.png
Base : image deja en pleine mer avec flotte en formation
Corrections : bras roi vers le bas, rameurs dans pirogue royale, style coherent
"""

import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("ERREUR: GEMINI_API_KEY manquant dans .env")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)

SOURCE  = Path("public/assets/geoafrique/beat04-start-frame-v1.png")
REF_ROI = Path("public/assets/library/geoafrique/characters/abou-bakari/abou-bakari-roi-plan-large-REF.png")
OUT     = Path("public/assets/geoafrique/beat04-source-v5.png")


def main():
    if not SOURCE.exists():
        print(f"ERREUR: image source introuvable — {SOURCE}")
        sys.exit(1)

    with open(SOURCE, "rb") as f:
        src_bytes = f.read()

    with open(REF_ROI, "rb") as f:
        roi_bytes = f.read()

    print("Generation beat04-source-v5 (base start-frame-v1 + corrections)...")

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            types.Part.from_bytes(data=src_bytes, mime_type="image/png"),
            types.Part.from_text(text="BASE IMAGE: Use this as the starting composition. Keep the overall scene: king seen from behind, fleet of pirogues behind him, open ocean, starry night sky. This is the base to work from."),
            types.Part.from_bytes(data=roi_bytes, mime_type="image/png"),
            types.Part.from_text(text="CHARACTER REFERENCE: This is King Abou Bakari II. His kufi hat, robes pattern and body proportions must be visible from behind."),
            types.Part.from_text(text="""Edit this image with the following corrections:

1. ARMS: The king's arms must hang naturally at his sides, relaxed. NO raised arms, NO open arms gesture. Arms down, neutral standing pose.

2. ROWERS: Add 2-3 visible rowers/sailors sitting inside the king's pirogue (the foreground boat), rowing with paddles. The king stands at the bow, the rowers are behind him in the same boat.

3. STYLE CONSISTENCY: Make the king's robes and the pirogues in the fleet use the same flat design illustration style — same level of detail, same color palette. The fleet pirogues behind should match the foreground pirogue's wood tone and style.

4. KEEP EVERYTHING ELSE: same composition, same open ocean (no shore, no land, no beach), same starry sky, same fleet formation behind, same dark background.

NO text, NO watermark, NO labels."""),
        ],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            with open(OUT, "wb") as f:
                f.write(part.inline_data.data)
            print(f"Sauvegarde: {OUT}")
            return

    print("ERREUR: pas d'image generee")
    sys.exit(1)


if __name__ == "__main__":
    main()
