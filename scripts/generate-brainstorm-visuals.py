"""
Brainstorm visuals — 3 sujets GeoAfrique potentiels
- Amanirenas (reine guerriere de Koush)
- Murailles du Benin
- Hannibal dans les Alpes
Style : semi-realiste, meme DNA visuel qu'Abou Bakari II
Output: tmp/brainstorm/
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
        "filename": "01-amanirenas-portrait.png",
        "prompt": """
Semi-realistic digital illustration of Queen Amanirenas of the Kingdom of Kush (ancient Nubia/Sudan).
Style: cinematic animated documentary, same visual language as a modern African history YouTube channel.

Character:
- Powerful African queen, dark brown skin, strong proud expression
- One eye scarred or blind from battle (right eye closed or scarred)
- Wearing golden Nubian royal headdress, large gold earrings and collar necklace
- White and gold royal garments with geometric Nubian patterns
- Holding a spear, standing tall

Background:
- Meroe pyramids (Sudan — steep narrow pyramids, NOT Egyptian) in warm golden desert light
- Dramatic sunset sky, deep orange and red tones
- Dust in the air, epic atmosphere

Style notes:
- Semi-realistic: defined human features, painterly shading, NOT photorealistic
- Bold color contrast: warm gold and terracotta against deep blue sky
- Cinematic framing: bust/half-body portrait, subject fills frame
- No text, no UI elements

Format: 9:16 vertical
""",
    },
    {
        "filename": "02-amanirenas-battle.png",
        "prompt": """
Semi-realistic digital illustration: Queen Amanirenas of Kush leading Nubian archers against Roman soldiers.
Style: cinematic animated documentary, modern African history YouTube aesthetic.

Scene:
- Queen in center, one eye scarred, golden armor and Nubian headdress, arm raised commanding troops
- Nubian archers on both sides drawing their famous composite bows
- Roman soldiers in the background recoiling, shields raised
- Sudanese desert landscape, steep Meroe pyramids distant on horizon

Lighting and mood:
- Dramatic battle light, sun low, long shadows on desert sand
- Warm orange and gold palette with dusty atmosphere
- Epic, triumphant energy — this is a victory scene

Style notes:
- Semi-realistic painterly illustration, bold shapes, NOT photorealistic
- Strong silhouettes, cinematic composition
- No text, no labels

Format: 16:9 horizontal
""",
    },
    {
        "filename": "03-benin-walls-city.png",
        "prompt": """
Semi-realistic digital illustration: The great earthen walls of the Benin Kingdom (Nigeria, 1000-1500 AD).
Style: cinematic animated documentary, modern African history YouTube aesthetic.

Scene:
- Aerial or wide establishing view of the massive earthen ramparts surrounding the city
- The walls are enormous earthen embankments, 20 meters high, stretching across lush green tropical landscape
- Inside the walls: a thriving city with organized streets, a grand royal palace with bronze plaques gleaming on its walls
- Market activity, people in colorful traditional Edo attire
- Dense tropical forest beyond the outer walls

Lighting:
- Golden afternoon light, rich greens and warm earth tones
- Bronze plaques on the palace catching the light

Style notes:
- Semi-realistic painterly illustration
- Sense of SCALE is crucial — make the walls feel massive and impressive
- No text, no labels

Format: 16:9 horizontal
""",
    },
    {
        "filename": "04-hannibal-alps.png",
        "prompt": """
Semi-realistic digital illustration: Hannibal Barca leading war elephants through the snowy Alps, 218 BC.
Style: cinematic animated documentary, modern African history YouTube aesthetic.

Scene:
- Hannibal in foreground: North African general, dark skin, bronze Carthaginian armor with purple cape, determined expression
- Massive African war elephant behind him, exhaling steam in the freezing air
- Carthaginian soldiers in cloaks struggling through deep snow on a narrow mountain pass
- Dramatic snow-covered Alps peaks, storm clouds gathering, icy blue atmosphere

Lighting and mood:
- Cold blue and white palette contrasting with warm bronze and dark skin tones
- Epic, cinematic — this is the impossible made real
- Snow blowing in wind, atmosphere of hardship and determination

Style notes:
- Semi-realistic painterly illustration, NOT photorealistic
- Strong color contrast: warm human figures against cold icy mountains
- No text, no labels

Format: 16:9 horizontal
""",
    },
    {
        "filename": "05-benin-bronze-interior.png",
        "prompt": """
Semi-realistic digital illustration: Interior of the Benin Kingdom royal palace, craftsmen creating bronze plaques.
Style: cinematic animated documentary, modern African history YouTube aesthetic.

Scene:
- A grand interior space with high ceilings
- Master craftsmen (Edo people, dark skin, traditional attire) working on intricate bronze casting
- Finished bronze plaques on the walls depicting warriors, kings and ceremonies — detailed and gleaming
- Warm firelight from furnaces, rich atmospheric glow
- Court officials and guards in background

Lighting:
- Warm amber and bronze tones, firelight creating dramatic shadows
- The bronze artwork GLOWS and catches the light beautifully

Style notes:
- Semi-realistic painterly illustration
- Sense of craftsmanship, sophistication, and cultural richness
- No text, no labels

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
    print("=== Brainstorm Visuals — Gemini 3.1 Flash ===")
    print(f"Output dir: {OUTPUT_DIR}\n")

    results = []
    for subject in SUBJECTS:
        path = generate_image(subject)
        if path:
            results.append(path)

    print(f"\n=== Done: {len(results)}/{len(SUBJECTS)} images generated ===")

    if results:
        print("\nOpening all images...")
        subprocess.run(["open"] + results, check=False)
