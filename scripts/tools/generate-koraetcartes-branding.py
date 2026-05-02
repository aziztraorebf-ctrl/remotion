"""
Kora & Cartes - Brand identity generation.
Generates 4 logo concepts (1080x1080) + 3 YouTube banner concepts (2560x1440).
Palette: Indigo nuit #0D1B3D + Cuivre brossé #B87333 + Creme #F5F1E8.
Typography: Playfair Display (wordmark) + Inter (subtext).
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

OUT_DIR = Path(__file__).resolve().parents[2] / "branding" / "koraetcartes"
OUT_DIR.mkdir(parents=True, exist_ok=True)


PALETTE_DESC = (
    "Strict color palette: deep midnight indigo (#0D1B3D), brushed copper (#B87333), "
    "warm cream (#F5F1E8). NO other colors. NO bright greens, reds, yellows. "
    "Premium editorial feel."
)


LOGO_PROMPTS = {
    "logo-A-kora-stylisee.png": (
        f"Square 1080x1080 brand logo for a YouTube channel called 'Kora & Cartes'. "
        f"Concept: a stylized silhouette of a kora (West African 21-string harp-lute) "
        f"viewed from the front, elegant and calligraphic. The instrument body is a "
        f"large round calabash gourd with a long vertical neck. The strings are "
        f"rendered as fine vertical copper lines. Background: warm cream. "
        f"Instrument silhouette: deep midnight indigo. String details: brushed copper. "
        f"Below the instrument, the wordmark 'Kora & Cartes' in elegant Playfair "
        f"Display serif typeface, deep indigo color, centered. {PALETTE_DESC} "
        f"Clean vector look. Symmetrical composition. High contrast for readability "
        f"at small sizes (32x32 avatar). NO photorealism. NO complex textures. "
        f"NO mascot character. NO faces."
    ),
    "logo-B-carte-kora.png": (
        f"Square 1080x1080 brand logo for a YouTube channel called 'Kora & Cartes'. "
        f"Concept: a circular medallion combining the silhouette of the African "
        f"continent (deep midnight indigo) with a kora instrument neck rising "
        f"vertically from it like an axis. The kora's round calabash sits at the "
        f"bottom, the long neck pierces through the continent reaching the top of "
        f"the medallion. Strings are fine copper lines along the neck. Background: "
        f"warm cream. The continent silhouette is solid indigo, the kora is "
        f"contoured in copper. Below the medallion, wordmark 'Kora & Cartes' in "
        f"Playfair Display serif, indigo. {PALETTE_DESC} Clean vector style. "
        f"Symmetrical. High contrast. NO photorealism. NO mascot. NO faces. NO text "
        f"inside the medallion."
    ),
    "logo-C-monogramme-KC.png": (
        f"Square 1080x1080 brand logo for a YouTube channel called 'Kora & Cartes'. "
        f"Concept: an elegant typographic monogram 'K&C' as a single ornate "
        f"calligraphic mark. The K and C are interlocked, with the ampersand "
        f"flowing between them in copper. Style: West African modernized "
        f"calligraphy meets editorial premium typography. The monogram is centered, "
        f"large, in deep midnight indigo with subtle copper highlights on the "
        f"flourishes. Below, in smaller Playfair Display serif: 'Kora & Cartes'. "
        f"Background: warm cream. {PALETTE_DESC} Clean vector look. Premium feel "
        f"like The Atlantic or NYT logo. Symmetrical. NO photorealism. NO mascot. "
        f"NO illustration. JUST the typographic monogram."
    ),
    "logo-D-cordon-meridien.png": (
        f"Square 1080x1080 brand logo for a YouTube channel called 'Kora & Cartes'. "
        f"Concept: an abstract pictogram showing a single curved line that starts "
        f"as a kora string at the bottom (with a small calabash gourd) and "
        f"transforms into a curving meridian/trade route arc reaching the top of "
        f"the frame. The line evolves from string into geographic path. The kora "
        f"calabash anchors the bottom of the composition; the curving path arcs "
        f"elegantly across the frame ending in a small circular point at the top "
        f"(like a compass point or city marker). Color of the line: brushed copper. "
        f"Background: warm cream. Below the pictogram, wordmark 'Kora & Cartes' in "
        f"Playfair Display serif, deep midnight indigo. {PALETTE_DESC} Minimalist "
        f"vector style. Symmetrical balance. High contrast. Premium and "
        f"distinctive. NO photorealism. NO mascot. NO faces. NO complex details. "
        f"The metaphor is 'the string becomes the path'."
    ),
}


BANNER_PROMPTS = {
    "banner-A-carte-stylisee.png": (
        f"Wide horizontal YouTube banner, ratio 16:9 (intended size 2560x1440). "
        f"Concept: a stylized vintage map of Africa as background, with the "
        f"continent silhouette in deep midnight indigo against a warm cream "
        f"parchment-textured background. Trade routes traced across the continent "
        f"in dotted brushed copper lines (Saharan caravan routes, gold roads). "
        f"Tiny copper compass roses and city markers scattered subtly across the "
        f"map. The CENTER of the image (a horizontal band approximately 1546 "
        f"pixels wide by 423 pixels tall, centered vertically and horizontally) "
        f"contains the channel name 'Kora & Cartes' in large Playfair Display "
        f"serif typeface (deep indigo), with the tagline 'Cartes animees et heros "
        f"oublies' in Inter sans-serif below it (smaller, copper color). Below "
        f"the tagline: 'Nouveau Short chaque semaine' in even smaller Inter, "
        f"indigo. The map elements are subtle and textural in the outer areas, "
        f"never crowding the central text zone. {PALETTE_DESC} Editorial premium "
        f"feel. Clean vector + parchment texture mix. NO photorealism. NO mascot. "
        f"NO photos of people. NO bright colors. NO clipart. The text must be "
        f"perfectly legible and centered."
    ),
    "banner-B-cordon-route.png": (
        f"Wide horizontal YouTube banner, ratio 16:9 (intended size 2560x1440). "
        f"Concept: an artistic composition where a single elegant kora string "
        f"transforms into a winding serpentine trade route, sweeping from left to "
        f"right across the entire banner. The line is brushed copper, drawn "
        f"against a deep midnight indigo background that has a subtle parchment "
        f"texture. Small copper dots along the route mark cities (Tombouctou, "
        f"Gao, Djenne) but without text labels. At the LEFT origin of the line, "
        f"a small kora calabash gourd anchors the composition. The CENTER of "
        f"the image (a horizontal band approximately 1546 pixels wide by 423 "
        f"pixels tall, centered) contains the channel name 'Kora & Cartes' in "
        f"large Playfair Display serif (warm cream color), with tagline 'Cartes "
        f"animees et heros oublies' in Inter sans-serif (copper) below. The "
        f"copper line/route flows elegantly behind and around the text without "
        f"crossing it. {PALETTE_DESC} Premium artistic feel. Distinctive and "
        f"memorable. NO photorealism. NO mascot. NO photos. NO clipart. NO bright "
        f"colors. Text must be perfectly legible."
    ),
    "banner-C-galerie-portraits.png": (
        f"Wide horizontal YouTube banner, ratio 16:9 (intended size 2560x1440). "
        f"Concept: a horizontal frieze of 5 abstract bas-relief style portraits "
        f"of legendary West African historical figures (think Mansa Moussa, "
        f"Sundjata Keita, Tombouctou scholars) rendered as stylized profile "
        f"silhouettes carved into stone or parchment. The portraits are placed "
        f"in the FAR LEFT and FAR RIGHT zones of the banner only (NOT in the "
        f"center), leaving a large clear central zone. Portrait silhouettes are "
        f"deep midnight indigo on warm cream textured background, with subtle "
        f"copper detail highlights on crowns/headdresses. The CENTER of the "
        f"image (a horizontal band approximately 1546 pixels wide by 423 pixels "
        f"tall, centered) is a clean cream zone containing the channel name "
        f"'Kora & Cartes' in large Playfair Display serif (deep indigo), with "
        f"tagline 'Cartes animees et heros oublies' in Inter sans-serif (copper) "
        f"below. {PALETTE_DESC} Editorial premium feel. The portraits frame the "
        f"text without distracting from it. NO photorealism (silhouettes only). "
        f"NO clipart. NO bright colors. Text must be perfectly legible. The "
        f"portraits should feel iconic and dignified, not cartoonish."
    ),
}


def generate(prompt: str, output_name: str):
    """Generate one image with Gemini and save to OUT_DIR."""
    print(f"\n{'='*70}")
    print(f"Generating: {output_name}")
    print(f"{'='*70}")
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=["image", "text"],
            ),
        )
        output_path = OUT_DIR / output_name
        saved = False
        for part in response.candidates[0].content.parts:
            if getattr(part, "inline_data", None) is not None:
                output_path.write_bytes(part.inline_data.data)
                print(f"  -> Saved: {output_path}")
                saved = True
            elif getattr(part, "text", None):
                print(f"  Text: {part.text[:200]}")
        if not saved:
            print(f"  WARNING: no image returned for {output_name}")
        return output_path if saved else None
    except Exception as e:
        print(f"  ERROR generating {output_name}: {e}")
        return None


def main():
    print("=" * 70)
    print("Kora & Cartes - Brand Identity Generation")
    print(f"Output: {OUT_DIR}")
    print("=" * 70)

    print("\n--- LOGOS (4 concepts) ---")
    for name, prompt in LOGO_PROMPTS.items():
        generate(prompt, name)

    print("\n--- BANNERS (3 concepts) ---")
    for name, prompt in BANNER_PROMPTS.items():
        generate(prompt, name)

    print("\n" + "=" * 70)
    print("DONE. Files in:", OUT_DIR)
    print("=" * 70)


if __name__ == "__main__":
    main()
