"""
Generate flat sepia style variations for Seedance test
Style: flat illustration, paper-craft look, muted sepia/earth palette,
simple characters, clean outlines, minimal detail — like the Peste 1347 image.

Scenes: Soundjata + Abou Bakari themed

Usage:
  python3 scripts/tools/test-flat-sepia-variations.py
"""

import os
import base64
from openai import OpenAI

client = OpenAI()
OUTPUT_DIR = "/tmp/flat-sepia-test"
os.makedirs(OUTPUT_DIR, exist_ok=True)

STYLE_PREFIX = (
    "Flat 2D illustration in a warm sepia and earth-tone paper-craft style. "
    "Muted palette of browns, tans, dusty yellows, and muted greens. "
    "Simple character designs with minimal facial features (dot eyes, simple shapes). "
    "Clean dark outlines, no gradients, flat color fills. "
    "Slight paper texture overlay. Historical setting. "
    "Wide establishing shot, 16:9 aspect ratio. "
)

SCENES = [
    (
        "soundjata-village-tyrannie",
        STYLE_PREFIX +
        "A 13th century West African Mandinka village under oppression. "
        "A powerful sorcerer-king figure stands imposingly on the left, wearing dark robes and a fearsome mask. "
        "Villagers cower in the background near round mud-brick huts with thatched roofs. "
        "A small child sits on the ground, unable to walk, looking up defiantly. "
        "Baobab tree in the background. Dusty ground, warm afternoon light. "
        "Style reference: Simple History YouTube channel flat illustration."
    ),
    (
        "soundjata-barre-de-fer",
        STYLE_PREFIX +
        "A 13th century West African village, dramatic moment. "
        "A young boy (7-8 years old) in simple brown tunic is pulling himself upright "
        "using a thick iron bar planted in the red earth. His arms strain with effort. "
        "The iron bar is visibly bending under his grip. "
        "Village women watch in shock, hands over mouths. "
        "Round mud-brick huts and a large baobab tree in the background. "
        "Dramatic warm golden light from the right side. "
        "Style reference: Simple History YouTube channel flat illustration."
    ),
    (
        "abou-bakari-ocean",
        STYLE_PREFIX +
        "A 14th century West African king standing at the edge of the Atlantic Ocean. "
        "He wears a flowing white and gold robe, a traditional Malian royal cap. "
        "Behind him, a fleet of large wooden canoes with reed sails lines the shore. "
        "Sailors and navigators prepare the boats, loading supplies. "
        "The ocean is rendered in simple flat blue-green tones. "
        "Sandy beach in warm tan tones. Clear sky with simple flat clouds. "
        "Style reference: Simple History YouTube channel flat illustration."
    ),
]

print("=" * 60)
print("Flat Sepia Style Variations — GPT Image 1.5")
print("=" * 60)

for name, prompt in SCENES:
    print(f"\n--- Generating: {name} ---")
    try:
        result = client.images.generate(
            model="gpt-image-1.5",
            prompt=prompt,
            size="1536x1024",
            quality="high",
            n=1,
        )

        image_b64 = result.data[0].b64_json
        out_path = os.path.join(OUTPUT_DIR, f"{name}.png")
        with open(out_path, "wb") as f:
            f.write(base64.b64decode(image_b64))
        print(f"  OK -> {out_path}")

    except Exception as e:
        print(f"  ERREUR: {e}")

print("\n" + "=" * 60)
print(f"DONE — images dans {OUTPUT_DIR}/")
print("=" * 60)
