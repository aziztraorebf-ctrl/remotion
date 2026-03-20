"""
Generation Mansa Moussa V3 — style flat design identique a Abou Bakari
3 variations : meme base de prompt strict 2D, elements Moussa differents
Output : public/assets/geoafrique/characters/mansa-moussa-v3a.png
         public/assets/geoafrique/characters/mansa-moussa-v3b.png
         public/assets/geoafrique/characters/mansa-moussa-v3c.png
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

BASE_STYLE = """
Flat design vector illustration of a West African emperor, front-facing portrait.
Strict 2D illustration style — NO photorealism, NO 3D rendering, NO gradients on skin, NO texture, NO shadows.
Clean flat filled shapes with crisp outlines only. Same visual style as modern African flat design documentary animation.

Skin: #3D1F0F flat solid fill — no shading, no highlights, no texture.
Background: #050208 (near black), completely flat, no architecture visible.

Format: 9:16 vertical (1080x1920)
Bust portrait centered, filling upper 60% of frame.
NO text, NO labels, NO decorative background elements.
"""

VARIANTS = [
    {
        "name": "mansa-moussa-v3a",
        "label": "V3A — Couronne cylindrique or, robe verte, barbe large",
        "prompt": BASE_STYLE + """
Character: Mansa Moussa, emperor of Mali, half-brother of Abou Bakari II.

Crown: tall cylindrical gold crown, flat solid gold fill (#D4AF37), geometric diamond pattern band around base — distinctly African, NOT European spires
Robe: deep emerald green (#1B5E20) flat fill, single gold embroidery band at collar only
Necklace: thick gold chain, flat solid fill, simple geometric links
Beard: large full black beard (#111111), flat solid shape, wide square cut extending past jaw edges — same flat fill technique as crown
Expression: cold sovereign gaze, eyes looking directly forward, heavy brows
NO moustache separated from beard — single solid beard shape
"""
    },
    {
        "name": "mansa-moussa-v3b",
        "label": "V3B — Couronne evasee or, robe verte foncee, barbe arrondie",
        "prompt": BASE_STYLE + """
Character: Mansa Moussa, emperor of Mali, half-brother of Abou Bakari II.

Crown: wide flared gold crown (#D4AF37), flat solid fill, flares outward at top like a traditional African royal crown — wider at top than base, geometric cross-hatch pattern engraved
Robe: very dark forest green (#0D3B1A) flat fill, gold embroidery chevron pattern at shoulders only
Necklace: wide flat gold pectoral plate, solid fill, covers upper chest
Beard: full rounded black beard (#111111), flat solid shape, rounded at bottom, medium width — contained within jaw width
Expression: slight downward gaze, heavy-lidded eyes, absolute stillness
"""
    },
    {
        "name": "mansa-moussa-v3c",
        "label": "V3C — Couronne tiare or, robe verte, barbe courte structuree",
        "prompt": BASE_STYLE + """
Character: Mansa Moussa, emperor of Mali, half-brother of Abou Bakari II.

Crown: tall tiara-style gold crown (#D4AF37), flat solid fill, three-tier stacked bands with Mali geometric triangles and diamonds — imposing height
Robe: rich emerald green (#1B5E20) flat fill, dense gold geometric embroidery covering full chest area
Necklace: thick layered gold necklace, flat solid fill
Beard: structured medium beard (#111111), flat solid shape, squared-off at jaw level — neat but full, clearly a beard not just stubble
Expression: chin slightly raised, eyes direct and piercing, calm absolute authority
"""
    }
]


def generate_variant(variant: dict) -> str | None:
    output_path = OUTPUT_DIR / f"{variant['name']}.png"
    print(f"\n=== Generating {variant['label']} ===")

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
        print(f"ERROR: No image for {variant['name']}")
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

    print(f"\n=== Done: {len(results)}/3 ===")
    for p in results:
        print(f"  {p}")

    if results:
        import subprocess
        subprocess.run(["open", str(OUTPUT_DIR)], check=False)
