"""
Generation Mansa Moussa — 3 variations portrait semi-realiste pour Beat05
Modele : gemini-3.1-flash-image-preview
Output : public/assets/geoafrique/characters/mansa-moussa-v1a.png
         public/assets/geoafrique/characters/mansa-moussa-v1b.png
         public/assets/geoafrique/characters/mansa-moussa-v1c.png

Rupture visuelle avec Abou Bakari :
- Abou Bakari : kufi simple, boubou uni or/moutarde, regard vers l'horizon, debout
- Mansa Moussa : couronne imposante, robes royales elaborees, regard direct souverain, assis sur trone
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = Path(__file__).parent.parent / "public/assets/geoafrique/characters"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

VARIANTS = [
    {
        "name": "mansa-moussa-v1a",
        "label": "V1A — Couronne haute, rouge imperial",
        "prompt": """
Flat design vector illustration of a powerful West African emperor, front-facing portrait, seated on throne.
Strict 2D illustration style — NO photorealism, NO 3D rendering, NO gradients on skin.

Character design:
- Dark brown skin (#6B3A2A), flat filled shapes, clean outlines — slightly lighter than Abou Bakari
- Tall elaborate crown: deep crimson red base with gold geometric bands and pointed golden spires
- Rich deep red royal robe (crimson #8B0000) with heavy gold embroidery patterns covering the chest
- Full black beard, thick and well-groomed — strong distinguishing feature from clean-shaved Abou Bakari
- Expression: cold authority, slight downward gaze — the look of absolute power, not curiosity
- Broader, heavier face structure — more imposing, less lean than Abou Bakari
- Gold necklace with large pendant visible at collar

Composition:
- Bust portrait, centered, filling upper 65% of frame
- Visible top of throne: ornate gold carved armrests at sides
- Dark warm background (#0D0500), no texture
- Strong presence — figure commands the frame

Color palette:
- Skin: #6B3A2A flat fill
- Crown and gold details: #D4AF37 with #8B0000 (crimson) base
- Robe: #8B0000 (deep crimson) with #D4AF37 embroidery
- Background: #0D0500 (very dark warm black)

Format: 9:16 vertical (1080x1920)
Style: modern African documentary flat design, clean vector shapes, premium animated documentary aesthetic
NO text, NO labels, NO decorative background elements
"""
    },
    {
        "name": "mansa-moussa-v1b",
        "label": "V1B — Toque blanche, violet imperial",
        "prompt": """
Flat design vector illustration of a majestic West African emperor, front-facing portrait, seated on throne.
Strict 2D illustration style — NO photorealism, NO 3D rendering, NO gradients on skin.

Character design:
- Rich deep brown skin (#5C3120), flat filled shapes, clean outlines
- Tall white ceremonial toque/cap with gold geometric border at base — striking contrast to Abou Bakari's gold kufi
- Deep purple royal robe (#4A0E6E) with dense gold embroidery covering shoulders and chest — fabric looks heavy and rich
- Full beard: wide, rounded, salt-and-pepper grey-black — mature authority, clearly older than Abou Bakari
- Expression: serene absolute power — eyes half-lidded, looking slightly above the viewer, untouchable
- Heavy gold pectoral necklace spanning full chest width
- Round face, full cheeks — physically different from lean Abou Bakari

Composition:
- Bust portrait, centered, filling upper 65% of frame
- Hint of throne back visible behind shoulders: deep carved wood with gold inlay
- Dark cool-purple background (#080010), no texture
- Figure radiates static immovable power

Color palette:
- Skin: #5C3120 flat fill
- Cap: white #F5F0E8 with gold #D4AF37 trim
- Robe: #4A0E6E (deep purple) with #D4AF37 gold embroidery
- Background: #080010 (very dark purple-black)

Format: 9:16 vertical (1080x1920)
Style: modern African documentary flat design, clean vector shapes, premium animated documentary aesthetic
NO text, NO labels, NO decorative background elements
"""
    },
    {
        "name": "mansa-moussa-v1c",
        "label": "V1C — Couronne or massive, vert emeraude",
        "prompt": """
Flat design vector illustration of an all-powerful West African emperor, front-facing portrait, seated on throne.
Strict 2D illustration style — NO photorealism, NO 3D rendering, NO gradients on skin.

Character design:
- Very deep dark brown skin (#3D1F0F), flat filled shapes — darker complexion than Abou Bakari
- Massive gold crown: wide and imposing, tiered with three levels of geometric gold bands, dominates upper frame
- Emerald green royal robe (#1B5E20 deep forest green) with thick gold embroidery — richer fabric than anything Abou Bakari wore
- Dense full beard: black, square-cut, perfectly groomed — symbol of settled power vs Abou Bakari's explorer cleanness
- Expression: absolute stillness — eyes open, direct gaze, slight upward chin tilt — he does not look at the horizon, he IS the horizon
- Both hands visible resting on throne armrests: strong, deliberate pose — grounded, not going anywhere
- Multiple gold rings on fingers, gold bracelet at wrist

Composition:
- Three-quarter bust portrait, centered, filling upper 70% of frame
- Throne armrests clearly visible: gold and dark wood, ornately carved
- Rich deep dark background (#030A03), no texture
- Figure feels immovable, eternal

Color palette:
- Skin: #3D1F0F flat fill
- Crown: #D4AF37 gold, multi-tier
- Robe: #1B5E20 (deep emerald) with #D4AF37 embroidery
- Background: #030A03 (near black with green undertone)

Format: 9:16 vertical (1080x1920)
Style: modern African documentary flat design, clean vector shapes, premium animated documentary aesthetic
NO text, NO labels, NO decorative background elements
"""
    }
]


def generate_variant(variant: dict) -> str | None:
    output_path = OUTPUT_DIR / f"{variant['name']}.png"
    print(f"\n=== Generating {variant['label']} ===")
    print(f"Output: {output_path}")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=variant["prompt"],
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
        print(f"ERROR: No image in response for {variant['name']}")
        return None

    with open(output_path, "wb") as f:
        f.write(image_bytes)

    size_kb = output_path.stat().st_size / 1024
    print(f"Saved: {output_path} ({size_kb:.0f} KB)")
    return str(output_path)


if __name__ == "__main__":
    results = []
    for variant in VARIANTS:
        path = generate_variant(variant)
        if path:
            results.append(path)

    print(f"\n=== Done: {len(results)}/3 images generated ===")
    for p in results:
        print(f"  {p}")

    if results:
        import subprocess
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)
