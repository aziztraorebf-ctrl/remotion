"""
Generate storyboard + character refs + env plate for Scene 3 storyboard-to-video test.
All derived from existing validated Scene 2/3 images for perfect continuity.
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

IMG_DIR = Path(__file__).resolve().parents[2] / "sonjata-papercraft" / "images"


def load_image(path: Path) -> types.Part:
    return types.Part.from_bytes(data=path.read_bytes(), mime_type="image/png")


def generate(prompt: str, source_images: list[Path], output_name: str):
    contents = []
    for img_path in source_images:
        contents.append(load_image(img_path))
    contents.append(prompt)

    print(f"\n{'='*60}")
    print(f"Generating: {output_name}")
    print(f"Sources: {[p.name for p in source_images]}")
    print(f"{'='*60}")

    response = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    output_path = IMG_DIR / output_name
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            output_path.write_bytes(part.inline_data.data)
            print(f"Saved: {output_path}")
            return output_path
        elif part.text:
            print(f"Text: {part.text}")

    print("ERROR: No image in response")
    return None


def main():
    # === 1. CHARACTER REF: Soundjata enfant ===
    # Extract from scene2-humiliation-v4.png (best validated image)
    generate(
        prompt="""Create a CHARACTER SHEET of the small boy from this image.

Show him on a CLEAN WHITE BACKGROUND with:
- FULL BODY front view (center, largest)
- FULL BODY side view (right)
- Close-up FACE with determined/angry expression
- Close-up FACE with neutral expression

The boy: dark skin, curly black hair, red loincloth with red sash at waist,
chibi proportions, dot-eyes, age 7-8.

CRITICAL: maintain EXACT SAME art style as the source image -- flat 2D
paper-craft, warm sepia palette, thick black outlines, flat color fills.
Do NOT add detail or change his appearance in ANY way.

Label nothing. No text, no letters, no writing anywhere.""",
        source_images=[IMG_DIR / "scene2-humiliation-v4.png"],
        output_name="scene3-ref-soundjata-charsheet.png",
    )

    # === 2. CHARACTER REF: Forgeron ===
    # Extract from scene3-clipB-forgeron.png (validated by Aziz)
    generate(
        prompt="""Create a CHARACTER SHEET of the large muscular blacksmith from this image.

Show him on a CLEAN WHITE BACKGROUND with:
- FULL BODY front view (center, largest) — leather apron, thick arms,
  carrying the iron bar across shoulders
- FULL BODY side view (right) — same outfit
- Close-up FACE — serious/determined expression

The blacksmith: dark brown skin, muscular build, leather apron over bare
chest, thick forearms. Chibi proportions, dot-eyes.

CRITICAL: maintain EXACT SAME art style as the source image -- flat 2D
paper-craft, warm sepia palette, thick black outlines, flat color fills.

Label nothing. No text, no letters, no writing anywhere.""",
        source_images=[IMG_DIR / "scene3-clipB-forgeron.png"],
        output_name="scene3-ref-forgeron-charsheet.png",
    )

    # === 3. ENVIRONMENT PLATE ===
    # Derive from scene2-last-frame — remove all characters, keep village
    generate(
        prompt="""Take this image and REMOVE ALL CHARACTERS (people, children, everyone).

Keep ONLY the environment:
- The baobab tree
- The round thatched-roof huts
- The dusty ochre ground
- The sepia sky with clouds
- The hills/mountains in background

Fill the areas where characters were with more ground, huts, or open space
that matches the existing style. The result should be an EMPTY VILLAGE
SCENE with no people.

CRITICAL: maintain EXACT SAME art style -- flat 2D paper-craft, warm sepia
palette, thick black outlines, flat color fills, aged paper texture.

No text, no letters, no writing anywhere.""",
        source_images=[IMG_DIR / "scene2-last-frame.png"],
        output_name="scene3-ref-env-village.png",
    )

    # === 4. STORYBOARD 6 PANELS ===
    # Black & white sketch, 2x3 grid, scene progression
    generate(
        prompt="""Generate a BLACK AND WHITE SKETCH STORYBOARD with exactly 6 panels in a 2x3 GRID layout (2 columns, 3 rows).

This is for a paper-craft animated scene. Each panel is a rough SKETCH (not colored, not detailed).

Panel 1 (top-left) — WIDE SHOT:
A small boy kneels on the ground in a village. He PUSHES UP on his arms,
lifting his chest. Expression: RAGE. A tall woman walks AWAY in the background.

Panel 2 (top-right) — MEDIUM SHOT:
The boy is now KNEELING UPRIGHT, fists clenched at sides. He stares forward
with fierce determination. Villagers behind him watch nervously.

Panel 3 (middle-left) — WIDE SHOT:
A large muscular BLACKSMITH walks in from the right, carrying a long IRON
BAR across his shoulders. The kneeling boy watches him approach.

Panel 4 (middle-right) — MEDIUM SHOT:
The blacksmith PLANTS the iron bar VERTICALLY into the ground in front of
the boy. IMPACT — dust rises. The bar stands TALL and STRAIGHT.

Panel 5 (bottom-left) — WIDE SHOT:
Villagers CONVERGE from all sides, forming a CIRCLE around the boy and the
upright iron bar. At least 8 people visible.

Panel 6 (bottom-right) — MEDIUM CLOSE-UP:
The boy GRIPS the vertical iron bar with both hands. His knuckles TIGHTEN.
His jaw is SET. The circle of villagers watches in silence behind him.

STYLE: rough pencil sketch, black and white, no color, no shading.
Simple stick-figure-ish but with clear poses and framing.
Each panel has a thin black border.

CRITICAL: The boy NEVER stands on his feet in any panel. He is always
KNEELING or on the ground. The iron bar is VERTICAL (planted in ground)
in panels 4, 5, and 6.

No text, no labels, no numbers, no writing of any kind.""",
        source_images=[IMG_DIR / "scene2-humiliation-v4.png"],
        output_name="scene3-storyboard-6panels.png",
    )

    print(f"\n{'='*60}")
    print("ALL DONE. Generated:")
    print("  1. scene3-ref-soundjata-charsheet.png (character ref)")
    print("  2. scene3-ref-forgeron-charsheet.png (character ref)")
    print("  3. scene3-ref-env-village.png (environment plate)")
    print("  4. scene3-storyboard-6panels.png (storyboard)")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
