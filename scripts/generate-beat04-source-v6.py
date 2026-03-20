"""
Beat04 — Source v6 : base v4 (pleine mer) + corrections completes
- Rameurs assis, tournes vers l'avant dans tous les bateaux
- Pas de rive, pas de voiles blanches minimalistes
- Roi debout a l'avant, bras le long du corps
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

SOURCE  = Path("public/assets/geoafrique/beat04-source-v4.png")
REF_ROI = Path("public/assets/library/geoafrique/characters/abou-bakari/abou-bakari-roi-plan-large-REF.png")
OUT     = Path("public/assets/geoafrique/beat04-source-v6.png")


def main():
    if not SOURCE.exists():
        print(f"ERREUR: image source introuvable — {SOURCE}")
        sys.exit(1)

    with open(SOURCE, "rb") as f:
        src_bytes = f.read()

    with open(REF_ROI, "rb") as f:
        roi_bytes = f.read()

    print("Generation beat04-source-v6...")

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            types.Part.from_bytes(data=src_bytes, mime_type="image/png"),
            types.Part.from_text(text="BASE IMAGE: This is your starting composition. Open ocean at night, king seen from behind, dark water, starry sky. Use this environment exactly — no shore, no sand, no land."),
            types.Part.from_bytes(data=roi_bytes, mime_type="image/png"),
            types.Part.from_text(text="CHARACTER REFERENCE: King Abou Bakari II. His kufi hat and robes pattern must be recognizable from behind."),
            types.Part.from_text(text="""Redraw this scene with these precise changes:

1. KING: Standing upright at the bow of his pirogue, back to camera. Arms hanging naturally at his sides — NOT raised, NOT open wide. Calm, commanding posture.

2. KING'S PIROGUE (foreground): ONE large wooden pirogue. Inside it, behind the king, there are 3-4 rowers SITTING DOWN, facing FORWARD (same direction as the king, toward the horizon). They hold paddles dipping into the water. NO one faces backward or toward the king.

3. TWO SIDE PIROGUES (left and right of the king's boat): Each has 2-3 rowers SITTING DOWN, facing FORWARD toward the horizon, paddling. Same direction as everyone else.

4. BACKGROUND FLEET: Instead of small white triangular sail icons, show dark wooden pirogues with rowers, diminishing in size toward the horizon. Same flat design style, consistent with the foreground boats.

5. ENVIRONMENT: Open ocean only. Dark water all around. NO shore, NO sand, NO beach, NO land visible anywhere. The boats are already at sea.

6. Keep: dark night sky, stars, same color palette (dark navy ocean, wood tones, king's terracotta/gold robes).

NO text, NO watermark, NO labels, NO white sail triangles."""),
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
