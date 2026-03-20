"""
Beat04 — Edit chirurgical v4 : uniformiser horizon bleu/vert → bleu nuit fonce
Source : beat04-source-v3.png
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

SOURCE = Path("public/assets/geoafrique/beat04-source-v3.png")
OUT    = Path("public/assets/geoafrique/beat04-source-v4.png")


def main():
    if not SOURCE.exists():
        print(f"ERREUR: image source introuvable — {SOURCE}")
        sys.exit(1)

    with open(SOURCE, "rb") as f:
        img_bytes = f.read()

    print("Edit chirurgical : uniformisation horizon bleu/vert...")

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
            types.Part.from_text(text="""Edit this image: Fix the horizon and ocean color.

The ocean and horizon area currently has an inconsistent blue-to-green/teal gradient that looks unnatural.

CHANGE: Replace all the green and teal tones in the ocean and horizon with a uniform deep dark navy blue, consistent with the dark night sky above. The entire water surface and horizon line should be the same dark navy blue (#0d1a2e). No green, no teal, no warm colors in the water.

Keep EVERYTHING ELSE exactly identical:
- The king's silhouette, terracotta robes, kufi hat
- The central pirogue shape and wood details
- The two side pirogues with sailors
- The stars in the sky
- The overall composition and framing

Only fix the ocean/horizon color from green-teal to dark navy blue."""),
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
