"""
Gemini 3.1 Flash Image — edit chirurgical de thumbnails Souverain.

Usage:
    python3 scripts/tools/gemini-thumbnail-edit.py \
        --input out/SHOWCASES/thumbnails-senegal/v6-B.png \
        --output out/SHOWCASES/thumbnails-senegal/v6-B-gemini.png \
        --brief senegal

Briefs disponibles : senegal, niger
"""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY missing")
    sys.exit(1)

MODEL = "gemini-3.1-flash-image-preview"


BRIEFS = {
    "sonjata": """Edit this image to transform it into a beautiful storybook-style African illustration -- preserve the narrative composition but elevate the visual quality dramatically.

PRESERVE EXACTLY:
- The warm orange/brown/sepia color palette (sunset over savanna feel)
- The gradient sky from orange-red at top to deep brown at bottom
- The text "SONJATA · EMPIRE MANDÉ · 1235" and "Les premiers droits de l'homme en Afrique" on the right side, in cream/gold color, exact position
- The overall composition: warrior hero silhouette CENTER-LEFT, baobab tree LEFT of warrior, large setting sun BEHIND warrior
- The dramatic backlighting effect (warrior and tree as dark silhouettes against bright sun)

TRANSFORM the simplistic SVG silhouettes into a BEAUTIFUL HAND-PAINTED STORYBOOK ILLUSTRATION:
- Transform the warrior silhouette into a powerful, dignified Mandinka WARRIOR HERO holding a traditional bow, wearing simple traditional cloth, standing tall and proud. The silhouette should remain dark/black (backlit by sun) but with refined human proportions and posture.
- Transform the baobab tree into a MAJESTIC ANCIENT BAOBAB with its characteristic gnarled trunk, fat base, and stylized crown of branches (recognizable iconic shape of African baobab)
- Add savanna grass tufts at the base of the warrior and baobab
- Enhance the setting sun with more dramatic warm orange/red glow
- Add subtle silhouettes of huts (cases mandingues) in the distance behind the warrior (very small, suggesting a village)
- Add 2-3 birds flying across the sky in silhouette
- Use a hand-painted illustration style reminiscent of African storybook art: warm, dignified, mythological, NOT cartoony
- Add subtle texture suggesting hand-painted brushwork on warm paper

The result should look like a beautiful illustration from a high-quality African mythology storybook or an animated film poster about West African epics, in the spirit of films like "Kirikou" or animated documentaries about African history, with a dignified epic feel suitable for a YouTube documentary thumbnail about Sonjata Keita and the Empire of Mali.
""",

    "mansa": """Edit this image with surgical transformations -- preserve the layout but transform the visual style.

PRESERVE EXACTLY:
- The dark navy starry night sky background
- The text "MANSA MOUSSA · 1324" and "Le pèlerinage qui ruina l'Égypte" on the right side, in cream/ivory color, exact position
- The general position of the map (left side of image, taking about 50% of width). The map can be enlarged to take more vertical space since there is no bottom banner.
- The color palette: terracotta/orange for land, gold for Mali, ivory cream for text
- IMPORTANT: there is NO bottom banner in this image. Do NOT add any banner, source citation, or text at the bottom. The bottom should remain clean with the dark navy starry background only.

TRANSFORM the simplified bean-shaped continent into a REAL stylized antique map:
- Make it look like a 14th-century PORTOLAN MAP or ancient parchment map of NORTH-WEST AFRICA with surrounding regions
- The continent shape should be GEOGRAPHICALLY RECOGNIZABLE: include North Africa coastline, the Mediterranean Sea (subtle dark area to the north), the Atlantic Ocean (to the west), and a hint of the Arabian peninsula on the right edge near the Caire marker
- Transform the gold "Mali" central region into a clearly recognizable kingdom marked with golden coloring (like a country on an old map highlighted in gold leaf), with subtle ancient calligraphy "MALI" or "EMPIRE" if possible
- Replace the dotted caravan route with a hand-drawn ancient route line crossing the Sahara, made of brown ink dashes, suggesting the historical pilgrimage route from Mali to Cairo
- Add 2-3 small VISIBLE camel caravan figures along the route (small but clearly identifiable silhouettes of camels with riders, not pixel art)
- The Cairo marker should be a small ancient compass rose or city symbol
- Add subtle paper texture and aged parchment feel to the entire map area
- Add subtle decorative elements: tiny ancient ship in the Mediterranean, faint compass rose somewhere, antique cartography style

The result should look like a beautiful illustrated antique map of medieval West Africa, ready for a National Geographic-style YouTube documentary thumbnail about Mansa Moussa's pilgrimage.
""",

    "senegal": """Edit this image with surgical improvements only -- preserve the overall composition.

PRESERVE EXACTLY:
- The dark navy blue background with subtle dot grid texture
- The text "SÉNÉGAL" and "Le pétrole de la patience" on the right side, in gold/cream serif, exactly as positioned
- The Senegal flag colors (green/yellow/red with green star) at the bottom 18% of the cylinder
- The horizontal gold line separating the filled and empty parts
- The vertical cylindrical shape of the oil drum
- The ratio of 18% filled at the bottom, 82% empty above

IMPROVE:
- Make the oil drum look like a REAL photographic metal oil barrel: brushed steel texture with realistic specular highlights and reflections on the metal surface
- Add subtle metallic shine and shadows that suggest a real 3D oil drum, not a flat illustration
- Make the top circular ellipse look like a real metal lid with realistic depth
- Slightly soften the harsh edge between the empty top and filled bottom with a subtle oil meniscus effect
- Keep the Senegal flag bottom section CRISP and clearly visible

The result should look like a high-quality editorial photograph of an oil drum with a Senegalese identity, suitable for a YouTube documentary thumbnail.
""",

    "niger": """Edit this image to transform the visual metaphor while preserving the layout.

PRESERVE EXACTLY:
- The dark navy blue background with subtle dot grid texture
- The text "NIGER" and "L'uranium qui éclaire la France" on the right side, in gold/cream serif, exactly as positioned
- The general position of the light bulb (centered-left of the image)
- The gold/yellow color palette consistency
- The Niger flag colors (orange, white, green) integrated into the design

TRANSFORM the light bulb into a REALISTIC photographic light bulb:
- Replace the current rectangular bar-shaped element inside with a CLASSIC TUNGSTEN FILAMENT: a thin metallic wire bent in a zigzag pattern, glowing intensely with warm orange-white light, suspended between two support posts inside the bulb
- The glass bulb should be TRANSPARENT and clearly visible, showing the filament inside through the glass
- The bulb shape should be the classic Edison "pear" shape (round top tapering to a narrower neck and metal screw base)
- Add a STRONG warm golden glow/halo around the bulb, suggesting the bulb is brightly lit
- The screw base (culot) should look like real brass/metal with visible threads
- IMPORTANT: integrate the Niger flag colors (orange/white/green vertical bands or stripes) into the filament glow itself, so the light coming from the bulb has those national colors. This represents "Niger lights up France"
- Add subtle light rays emanating from the bulb in gold

The result should look like a high-quality editorial photograph of a glowing vintage light bulb, with the Niger flag colors expressed through the warm light it produces.
""",
}


def edit_image(input_path: Path, output_path: Path, brief_key: str) -> int:
    if brief_key not in BRIEFS:
        print(f"ERROR: brief '{brief_key}' not found. Available: {list(BRIEFS.keys())}")
        return 1

    if not input_path.exists():
        print(f"ERROR: input file not found: {input_path}")
        return 1

    # Lecture image
    image_bytes = input_path.read_bytes()
    print(f"Input: {input_path.name} ({len(image_bytes) // 1024} KB)")
    print(f"Brief: {brief_key}")
    print(f"[COST PREVIEW] ~$0.04")
    print()

    client = genai.Client(api_key=API_KEY)

    parts = [
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        types.Part.from_text(text=BRIEFS[brief_key]),
    ]

    print("Generating edited image (Gemini 3.1 Flash Image)...")
    response = client.models.generate_content(
        model=MODEL,
        contents=parts,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"]
        ),
    )

    if not response.candidates or not response.candidates[0].content.parts:
        print("ERROR: Gemini refused to generate. Try reformulating the brief.")
        return 1

    image_saved = False
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(part.inline_data.data)
            size_kb = len(part.inline_data.data) // 1024
            print(f"OK {output_path} ({size_kb} KB)")
            image_saved = True
        elif hasattr(part, "text") and part.text:
            print(f"[Gemini note] {part.text[:200]}")

    if not image_saved:
        print("ERROR: no image in response")
        return 1
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Chemin vers image PNG d'entrée")
    parser.add_argument("--output", required=True, help="Chemin de sortie")
    parser.add_argument("--brief", required=True, choices=list(BRIEFS.keys()))
    args = parser.parse_args()

    sys.exit(edit_image(Path(args.input), Path(args.output), args.brief))


if __name__ == "__main__":
    main()
