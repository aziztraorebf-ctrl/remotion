"""
Brainstorm visuals v2 — versions simplifiees pour animation Kling
- Hannibal : peau bronzee nord-africaine, moins de details
- Benin bronze : composition simple, Kling-friendly
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = Path(__file__).parent.parent / "tmp/brainstorm"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SUBJECTS = [
    {
        "filename": "04b-hannibal-alps-v2.png",
        "prompt": """
Semi-realistic digital illustration: Hannibal Barca standing at the edge of a snowy Alpine mountain pass, 218 BC.
Style: cinematic animated documentary, modern history YouTube aesthetic. KEEP IT SIMPLE — designed for animation.

Character (MAIN FOCUS):
- Hannibal: North African general of Phoenician-Berber heritage, OLIVE BRONZE skin tone (Mediterranean, NOT dark black — think North African Berber/Tunisian complexion)
- Strong jaw, short dark hair, determined calm expression
- Bronze Carthaginian armor, deep purple cape blowing in the wind
- Standing tall, looking forward into the distance

Background (SIMPLE, few elements):
- Wide open snowy mountain landscape, a few large Alpine peaks
- ONE large war elephant visible behind/beside him, exhaling steam
- A few soldiers silhouetted in the far background, blurred
- Cold blue-white sky, snowflakes in the air

Key principle: SIMPLE COMPOSITION — large open areas of sky and snow, few focal points.
This image will be animated — avoid intricate details, busy backgrounds, small repeated elements.

Color palette:
- Cold: ice blue, white snow, grey peaks
- Warm contrast: bronze armor, olive skin, purple cape
- No text, no labels

Format: 16:9 horizontal
""",
    },
    {
        "filename": "05b-benin-bronze-v2.png",
        "prompt": """
Semi-realistic digital illustration: A Benin Kingdom craftsman holding up a large gleaming bronze plaque, firelight illuminating his face.
Style: cinematic animated documentary, modern African history YouTube aesthetic. KEEP IT SIMPLE — designed for animation.

Scene (SIMPLE, few elements):
- ONE central figure: a proud Edo craftsman, dark skin, simple traditional attire, holding a large ornate bronze plaque at chest height
- The bronze plaque is large, detailed with a warrior relief carving, catching warm firelight
- Simple dark background — just warm amber firelight glow, no complex architecture
- A few large bronze plaques hanging on the wall behind, blurred/soft focus

Key principle: SIMPLE COMPOSITION — one hero subject, clean background, large open areas.
This image will be animated — avoid busy interiors, many people, intricate details everywhere.

Color palette:
- Warm amber, bronze, deep shadow
- The gleaming bronze plaque is the visual anchor

No text, no labels
Format: 16:9 horizontal
""",
    },
]


def generate_image(subject: dict) -> str | None:
    output_path = OUTPUT_DIR / subject["filename"]
    print(f"\n--- Generating: {subject['filename']} ---")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=subject["prompt"],
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
        print(f"  ERROR: No image returned for {subject['filename']}")
        return None

    with open(output_path, "wb") as f:
        f.write(image_bytes)

    size_kb = output_path.stat().st_size / 1024
    print(f"  Saved: {output_path} ({size_kb:.0f} KB)")
    return str(output_path)


if __name__ == "__main__":
    print("=== Brainstorm v2 — Gemini 3.1 Flash ===")

    results = []
    for subject in SUBJECTS:
        path = generate_image(subject)
        if path:
            results.append(path)

    print(f"\n=== Done: {len(results)}/{len(SUBJECTS)} images generated ===")

    if results:
        subprocess.run(["open"] + results, check=False)
