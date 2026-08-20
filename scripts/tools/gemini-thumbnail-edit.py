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
import sys as _sys
_sys.path.insert(0, str(Path(__file__).resolve().parent))
from gemini_models import IMAGE_MODEL_HQ

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY missing")
    sys.exit(1)

# miniature YouTube publiee -> HQ explicite (le defaut Lite plafonne a 1K)
MODEL = IMAGE_MODEL_HQ


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

    "aes_focal_clean": """Edit this map image with surgical precision — isolate the focal territories.

KEEP EXACTLY AS IS:
- The three central AES country territories (Mali, Burkina Faso, Niger) with ALL their current color fills, textures, and borders between them — do not touch these at all

REMOVE ENTIRELY from the surrounding area:
- All internal border lines of neighboring countries (Senegal, Guinea, Ivory Coast, Ghana, Togo, Benin, Nigeria, Chad, Algeria, Mauritania, Libya — erase ALL their subdivision and border lines)
- All text labels anywhere in the image
- All remaining UI elements, legends, timelines

REPLACE the surrounding area (everything outside Mali + Burkina Faso + Niger) with:
- A clean, smooth, dark navy background (#06101e) — completely empty, no lines, no texture, no country outlines
- The transition from the AES territories to the dark background should be a soft, slightly blurred edge — not a hard cut

RESULT: The three colored AES territories should appear as a vivid dramatic focal island floating on a clean empty dark background. Strong contrast between the rich colored center and the empty dark surround. Add a subtle dark vignette on the outer edges.
""",

    "aes_dark_map": """Transform this image into a dramatic cinematic war room map of West Africa.

The image shows a dark navy background with a golden blob shape representing the AES alliance countries (Mali + Burkina Faso + Niger). Transform it as follows:

BACKGROUND: Keep the deep navy/black background exactly as is. Do NOT change it to parchment or light colors.

TRANSFORM the golden blob into GEOGRAPHICALLY ACCURATE country shapes:
- Replace the schematic blob with the real geographic shapes of Mali (large, rectangular-ish with a notch at top), Burkina Faso (small, roughly circular, south of Mali), and Niger (large, eastern, irregular shape)
- These three countries should glow in warm gold/amber tones (#c8a951 to #e8c472 gradient)
- Add subtle fill texture inside each country — like a faintly glowing illuminated surface
- Show the internal borders between the three countries as thin dashed gold lines
- The surrounding African countries (Senegal, Guinea, Ivory Coast, Ghana, Togo, Benin, Nigeria, Chad, Algeria, Mauritania) should be BARELY VISIBLE as very dark, almost-invisible faint outlines on the dark background — ghost countries

GLOW AND DRAMA:
- Add a strong warm golden halo/aura emanating from the center of the three-country bloc, as if the AES territory is radiating power/heat
- The glow should be most intense at the center and fade outward
- Keep the small central gold circle/seal from the original image

STYLE: Cinematic war room tactical map — like something from a geopolitical thriller film. Dark, dramatic, the three countries as the focal point of light in a dark continent silhouette.

NO text, NO labels, NO legend, NO timeline, NO sprites — pure geographic visual drama on dark background.
""",

    "aes_warmap": """Edit this war map image to create a dramatic clean thumbnail.

REMOVE ENTIRELY (erase completely, leaving only the map underneath):
- The white legend box in the top-left corner (with 'CONTROLE TERRITORIAL' header and color legend text)
- The entire timeline bar at the bottom (the horizontal bar with years 2021, 2022 and event markers)
- ALL circular character sprite tokens/medallions on the map (the illustrated warrior/figure circles)
- ALL city text labels: BAMAKO, OUAGADOUGOU, NIAMEY
- The data sources credit text in the bottom-right corner

KEEP AND ENHANCE:
- The parchment/parchemin map base texture (beige, warm, aged paper feel)
- The territorial color zones: blue government zones, amber/beige contested zones, red-brown JNIM zones
- The country border lines
- The geographic shape of West Africa

ENHANCE the colors to be more dramatic and vivid:
- Intensify the amber/gold contested zones to a warm rich gold (#c8a951 tone)
- Deepen the blue government-controlled zones to a deep saturated navy/midnight blue
- Make the red-brown JNIM zones a deeper, more dramatic dark red
- Increase contrast between zones so the territorial division reads clearly

ADD a subtle dark vignette around all edges (darker corners fading to center) to give depth and drama.

The result should be a CLEAN DRAMATIC WAR MAP thumbnail with NO text, NO UI overlays, NO character sprites — pure territorial geography visualization with vivid, cinematic colors on an aged parchment-style map. Think movie poster meets National Geographic war coverage.
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
    parser.add_argument("--brief", required=True, choices=list(BRIEFS.keys()), metavar="BRIEF")
    args = parser.parse_args()

    sys.exit(edit_image(Path(args.input), Path(args.output), args.brief))


if __name__ == "__main__":
    main()
