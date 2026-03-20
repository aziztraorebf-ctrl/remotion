"""
Beat05 Plan 2 — 3 directions visuelles richesse — Gemini flash image preview
Prompt-only, palette imposee en texte, aucun personnage
Output : public/assets/geoafrique/beat05-plan2-gemini-[a/b/c].png
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
import subprocess

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BASE_STYLE = """
Flat 2D vector illustration. NO characters, NO people, NO human figures whatsoever.
Visual style : Mali empire flat design.
Palette STRICT — use ONLY these colors :
- Background and deep shadows : near-black warm brown #1A0A00
- Gold highlights and shapes : #D4AF37 flat solid fills
- Deep burgundy / dark red : #6B0000
- Emerald green accents : #1A6B3A
- Warm cream details : #F5DC96
Bold flat shapes with crisp outlines. Geometric decorative patterns.
NO photorealism. NO gradients on surfaces. NO 3D rendering. NO shadows with blur.
NO text. NO labels. NO symbols.
9:16 vertical format, 1080x1920.
"""

VARIANTS = [
    {
        "id": "a",
        "label": "Salle du tresor",
        "prompt": BASE_STYLE + """
Scene : Royal Mali treasury chamber interior.
- Massive stacks of gold ingots pyramided in the center background
- Open treasure chests overflowing with gold coins at the base
- Two tall ornate columns with gold geometric inlay flanking the scene
- Grand pointed arch visible at top center
- Rich geometric floor tile pattern in dark burgundy and gold leading toward center
- Deep near-black atmosphere with warm gold glow emanating from the gold pile
- More treasure chests receding into darkness on each side
- Monumental and overwhelming scale — the gold dominates the frame
""",
    },
    {
        "id": "b",
        "label": "Palais Mali crepuscule",
        "prompt": BASE_STYLE + """
Scene : Exterior view of grand Mali royal palace at deep twilight.
- Massive mud-brick palace facade in dark burgundy and deep brown tones
- Architecture style of Djenne and Timbuktu — tall facade with protruding wooden beams (toron), geometric relief carvings
- Central grand entrance arch flanked by two imposing towers
- Sky is deep near-black at top, transitioning to dark gold at the very horizon behind the palace
- Dramatic long shadows on the palace walls
- Geometric tile pathway in gold leading toward the entrance gate
- The palace fills most of the frame — monumental presence
- No sky visible at top — palace towers rise out of frame
""",
    },
    {
        "id": "c",
        "label": "Caravane de l'or desert",
        "prompt": BASE_STYLE + """
Scene : Epic wide shot of a royal gold caravan crossing the Sahara.
- Long procession of camels silhouetted against the horizon — at least 12 camels visible
- Camels loaded with heavy rectangular gold sacks on their backs
- Caravan stretches from lower left to upper right vanishing point — extreme depth perspective
- Vast desert dunes in deep terracotta #6B0000 and dark gold #D4AF37
- Blazing gold sun as a bold flat circle low on the horizon, radiating flat gold rays
- Deep near-black sky above, warm gold at the horizon
- Long flat shadows extending from the camels toward viewer
- Scale : camels appear small against the immensity of the desert — epic scope
""",
    },
]


def generate_variant(variant: dict) -> str | None:
    print(f"\n=== Variant {variant['id'].upper()} — {variant['label']} ===")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[types.Part.from_text(text=variant["prompt"])],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    output_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            output_bytes = part.inline_data.data
            break

    if not output_bytes:
        print(f"ERROR: No image in response for variant {variant['id']}")
        return None

    out_path = OUTPUT_DIR / f"beat05-plan2-gemini-{variant['id']}.png"
    with open(out_path, "wb") as f:
        f.write(output_bytes)

    size_kb = out_path.stat().st_size / 1024
    print(f"Saved: {out_path} ({size_kb:.0f} KB)")
    return str(out_path)


if __name__ == "__main__":
    results = []
    for variant in VARIANTS:
        path = generate_variant(variant)
        if path:
            results.append(path)

    print("\n=== DONE ===")
    for r in results:
        print(f"  {r}")

    if results:
        subprocess.run(["open"] + results, check=False)
