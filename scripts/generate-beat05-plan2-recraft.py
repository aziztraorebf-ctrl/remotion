"""
Beat05 Plan 2 — 3 directions visuelles richesse Mansa Moussa
Recraft V3 vector, vivid_shapes, 1024x1707, palette imposee
Output : public/assets/geoafrique/beat05-plan2-[a/b/c].svg + .png
"""

import os
import json
import base64
import subprocess
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("RECRAFT_API_KEY")
API_URL = "https://external.api.recraft.ai/v1/images/generations"
OUTPUT_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

CONTROLS = {
    "background_color": {"rgb": [26, 10, 0]},
    "colors": [
        {"rgb": [212, 175, 55]},
        {"rgb": [26, 107, 58]},
        {"rgb": [107, 0, 0]},
        {"rgb": [139, 69, 19]},
        {"rgb": [245, 220, 150]},
    ],
    "artistic_level": 2,
    "no_text": True,
}

VARIANTS = [
    {
        "id": "a",
        "label": "Salle du tresor",
        "prompt": (
            "Royal Mali treasury chamber. Towering stacks of gold ingots and open chests overflowing with gold coins. "
            "Ornate carved columns with gold geometric inlay flanking the space. "
            "Warm torch light casting deep amber glow across the gold. "
            "Rich geometric floor patterns in dark burgundy and gold. "
            "Deep shadows in the background revealing more treasure receding into darkness. "
            "Grand arched ceiling above. No people. Flat 2D bold graphic style. "
            "Dark warm atmosphere — near-black shadows, deep gold highlights. "
            "9:16 vertical format."
        ),
    },
    {
        "id": "b",
        "label": "Palais exterieur Tombouctou",
        "prompt": (
            "Exterior view of a grand Mali royal palace at golden hour. "
            "Massive mud-brick architecture in the style of Djenne and Timbuktu — "
            "tall imposing facade with protruding wooden beams, geometric relief patterns. "
            "Central entrance gate flanked by two tall towers. "
            "Deep warm sunset sky — dark gold and deep orange horizon. "
            "Long dramatic shadows on the palace walls. "
            "Desert sand in the foreground with geometric pattern tiles leading to the entrance. "
            "No people. Flat 2D bold graphic style. Monumental and majestic. "
            "9:16 vertical format."
        ),
    },
    {
        "id": "c",
        "label": "Caravane de l'or",
        "prompt": (
            "Epic wide shot of a royal gold caravan crossing the Sahara desert. "
            "Long procession of camels loaded with heavy gold sacks stretching to the horizon. "
            "Figures in rich robes accompanying the caravan — seen from distance, no faces. "
            "Vast desert dunes in deep terracotta and burnt sienna. "
            "Blazing gold sun low on the horizon, long dramatic shadows. "
            "Scale emphasizing the immensity — caravan appears as a long glittering line across the landscape. "
            "Flat 2D bold graphic style. Epic cinematic composition. "
            "9:16 vertical format."
        ),
    },
]


def generate_variant(variant: dict) -> str:
    print(f"\n=== Variant {variant['id'].upper()} — {variant['label']} ===")

    payload = {
        "prompt": variant["prompt"],
        "model": "recraftv3_vector",
        "style": "vector_illustration",
        "substyle": "vivid_shapes",
        "size": "1024x1707",
        "controls": CONTROLS,
    }

    response = requests.post(API_URL, headers=HEADERS, json=payload)
    response.raise_for_status()
    data = response.json()

    svg_url = data["data"][0]["url"]
    print(f"SVG URL: {svg_url}")

    svg_response = requests.get(svg_url)
    svg_response.raise_for_status()

    svg_path = OUTPUT_DIR / f"beat05-plan2-{variant['id']}.svg"
    with open(svg_path, "wb") as f:
        f.write(svg_response.content)
    print(f"Saved SVG: {svg_path} ({svg_path.stat().st_size / 1024:.0f} KB)")

    png_path = OUTPUT_DIR / f"beat05-plan2-{variant['id']}.png"
    subprocess.run(
        ["sips", "-s", "format", "png", str(svg_path), "--out", str(png_path)],
        check=True, capture_output=True
    )
    print(f"Converted PNG: {png_path} ({png_path.stat().st_size / 1024:.0f} KB)")
    return str(png_path)


if __name__ == "__main__":
    results = []
    for variant in VARIANTS:
        try:
            path = generate_variant(variant)
            results.append(path)
        except Exception as e:
            print(f"ERROR variant {variant['id']}: {e}")

    print("\n=== DONE ===")
    for r in results:
        print(f"  {r}")

    subprocess.run(["open"] + results, check=False)
