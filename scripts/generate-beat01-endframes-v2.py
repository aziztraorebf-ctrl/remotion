"""
Beat01 end frames v2 — 3 variantes narratives
Concept : pan vers l'ouest, l'Atlantique domine, cote africaine a droite
Prepare la transition vers Beat02 (roi obsede par l'horizon)
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

REF_IMAGE = Path(__file__).parent.parent / "public/assets/geoafrique/beat01-v5.png"
ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"

VARIANTS = [
    {
        "output": ASSETS_DIR / "beat01-endframe-pan-A.png",
        "label": "A — Ocean dominant, cote droite",
        "prompt": """
Using the reference image as strict style guide.

Generate a 9:16 vertical image (1080x1920) showing the view AFTER the camera has slowly panned westward from the reference image.

What we now see:
- The vast dark Atlantic Ocean fills 65% of the frame on the LEFT — pure dark space (#050208), no waves, no texture, just immensity
- The West African coastline is visible on the RIGHT third of the frame — the terracotta continent silhouette, clean flat shape
- The coast runs vertically along the right edge: the distinctive bulge of West Africa (Senegal/Guinea area) visible as a curved outline
- The ocean is simply dark — the same deep black as space, suggesting mystery and vastness
- A very thin, subtle golden atmospheric glow line at the bottom horizon — barely visible, like a distant dawn
- A handful of stars visible in the upper left corner of the ocean (space atmosphere preserved)

The continent on the right: flat solid terracotta (#A52A2A), NO borders, NO labels, NO text.
The ocean/space: flat dark (#050208), absolutely empty — this emptiness IS the story.

Style: same flat 2D vector aesthetic as reference. NO photorealism, NO 3D.
Format: 9:16 vertical (1080x1920).
"""
    },
    {
        "output": ASSETS_DIR / "beat01-endframe-pan-B.png",
        "label": "B — Vue horizon rasant, Atlantique brumeux",
        "prompt": """
Using the reference image as strict style guide.

Generate a 9:16 vertical image (1080x1920). The camera has moved — we are now looking at the Atlantic Ocean from the edge of the African continent, a low-angle view toward the west.

What we see:
- The horizon line cuts the image at roughly 40% from the bottom
- BELOW the horizon: the dark Atlantic Ocean, flat and featureless, deep dark blue-black (#050208 to #080d1a), like a void
- ABOVE the horizon: dark space with a few scattered stars
- On the far RIGHT edge: the silhouette tip of the West African coast — just the edge, terracotta (#A52A2A), like a cliff looking out to sea
- At the horizon line: a warm golden atmospheric glow, thin and cinematic, like the last light before darkness
- The overall mood: vastness, mystery, the feeling of standing at the edge of the known world

Flat 2D vector style, minimal, cinematic.
NO text, NO labels, NO borders.
Format: 9:16 vertical (1080x1920).
"""
    },
    {
        "output": ASSETS_DIR / "beat01-endframe-pan-C.png",
        "label": "C — Globe incline, Atlantique face camera",
        "prompt": """
Using the reference image as strict style guide. Same flat 2D globe-from-space aesthetic.

Generate a 9:16 vertical image (1080x1920) where the globe has ROTATED slightly westward compared to the reference.

What changed from reference:
- The globe has rotated so that the ATLANTIC OCEAN is now more centered and facing us
- The African continent has shifted to the RIGHT — only the West African coast is still visible, on the right quarter of the frame
- The dark Atlantic fills the CENTER and LEFT of the frame — vast, empty, mysterious
- The golden atmospheric halo is still present at the bottom, same as reference
- Stars visible in the black space around the globe, same as reference
- The continent on the right: same flat terracotta (#A52A2A), clean silhouette, no borders

Keep EXACTLY the same visual style as the reference:
- Same dark space background (#050208)
- Same golden halo at horizon
- Same flat 2D illustration aesthetic
- Same color palette

NO text, NO labels, NO borders on the continent.
Format: 9:16 vertical (1080x1920).
"""
    },
]


def generate_variant(variant: dict) -> str:
    print(f"\n=== Generating {variant['label']} ===")
    print(f"Output: {variant['output']}")

    with open(REF_IMAGE, "rb") as f:
        ref_bytes = f.read()

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[
            types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
            variant["prompt"],
        ],
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
        print("  ERROR: No image in response")
        return None

    with open(variant["output"], "wb") as f:
        f.write(image_bytes)

    size_kb = variant["output"].stat().st_size / 1024
    print(f"  Saved: {variant['output']} ({size_kb:.0f} KB)")
    return str(variant["output"])


if __name__ == "__main__":
    print("=== Beat01 end frames v2 — 3 variantes ===")
    results = []
    for v in VARIANTS:
        path = generate_variant(v)
        if path:
            results.append(path)

    print(f"\n=== Done : {len(results)}/3 images generated ===")
    if results:
        import subprocess
        for p in results:
            subprocess.run(["open", p], check=False)
