"""
Beat04 — Suppression rayon de lumiere via Nano Banana
Etape 1 : gemini-2.0-flash analyse l'image et identifie le rayon
Etape 2 : gemini-3-pro-image-preview supprime le rayon, garde tout le reste intact
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

SOURCE = Path("public/assets/geoafrique/beat04-source-v1.png")
OUT    = Path("public/assets/geoafrique/beat04-source-v2.png")


def main():
    if not SOURCE.exists():
        print(f"ERREUR: image source introuvable — {SOURCE}")
        sys.exit(1)

    with open(SOURCE, "rb") as f:
        img_bytes = f.read()

    # Etape 1 : analyse Flash (optionnelle — on connait deja le probleme)
    print("Etape 1 : analyse de l'image source...")
    analyse_response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
            types.Part.from_text(
                text="Describe briefly the spotlight/light beam visible in this image: where it is, its color, and what it illuminates."
            ),
        ],
    )
    print(f"Analyse: {analyse_response.text}\n")

    # Etape 2 : suppression chirurgicale via gemini-3-pro-image-preview
    print("Etape 2 : suppression du rayon de lumiere (gemini-3-pro-image-preview)...")
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
            types.Part.from_text(text="""Edit this image: REMOVE the spotlight / light beam (the bright cone of yellowish light shining down from above onto the king).

Replace it with a natural dark night sky matching the surrounding darkness (#0a0a0f). Keep the stars visible.

Keep EVERYTHING ELSE exactly identical:
- The king's silhouette, clothing, kufi hat
- The pirogue and all boat details
- The sailors on adjacent boats
- The ocean, water reflections
- The overall composition and framing

Only remove the spotlight beam. Nothing else changes."""),
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
    if hasattr(response, "text"):
        print(f"Reponse texte: {response.text}")
    sys.exit(1)


if __name__ == "__main__":
    main()
