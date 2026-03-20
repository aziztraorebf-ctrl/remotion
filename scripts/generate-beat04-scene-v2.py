"""
Beat04 scene v2 — personnage DEJA sur le trone dans l'image source
Lecon apprise : O3 anime ce qui est dans l'image, il ne compose pas.
Un trone vide + element reference = pop/morphing a l'entree. INTERDIT.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat04-name-scene-v2.png"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """
Flat design vector illustration. Strict 2D, NO photorealism, NO 3D rendering.

Scene: West African king seated on a geometric gold throne, front-facing.
The king IS already seated — this is not an empty throne.

Character (must match exactly):
- Dark brown skin, flat filled shapes, clean vector style
- Golden embroidered kufi cap with geometric pattern
- Golden/mustard yellow traditional boubou/tunic
- Seated posture, hands resting on throne armrests
- Calm, powerful expression, eyes open, looking forward
- Full body visible from head to feet

Throne:
- Geometric Art Deco gold throne, angular, tall backrest
- Elevated on a low gold platform
- Same throne design as already generated (diamond patterns, chevrons)

Background:
- Solid black (#050208)
- Faint ghost outline of Africa continent, very subtle dark gold, barely visible
- Dramatic spotlight from above, narrow beam on the king

Decorative elements:
- Thin gold geometric border in corners
- Islamic/African pattern motifs, minimal

Color palette:
- Background: #050208
- King skin: #8B5E3C flat
- Cap and garment: #D4AF37 with #B8942A details
- Throne: #D4AF37 with #B8942A details
- Spotlight: soft warm gold glow from above only

Format: 9:16 vertical (1080x1920)
NO text, NO labels, NO floating calligraphy.
The king fills the center 60% of the frame.
"""

def generate():
    print("=== Beat04 scene v2 — roi sur trone (image source corrigee) ===")
    print(f"Output: {OUTPUT_PATH}")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=PROMPT,
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
        print("ERROR: No image in response")
        return None

    with open(OUTPUT_PATH, "wb") as f:
        f.write(image_bytes)

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"Saved: {OUTPUT_PATH} ({size_kb:.0f} KB)")
    return str(OUTPUT_PATH)


if __name__ == "__main__":
    path = generate()
    if path:
        import subprocess
        subprocess.run(["open", path], check=False)
