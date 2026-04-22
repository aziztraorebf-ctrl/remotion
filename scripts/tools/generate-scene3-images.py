"""
Generate 3 images for Sonjata Papercraft Scene 3.
Clip A: surgical edit of scene2-last-frame.png (rage reaction)
Clip B: new image with style-ref (blacksmith arrives)
Clip C: new image with style-ref (circle forms, match papercraft1)
"""

import os
import sys
import base64
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

IMG_DIR = Path(__file__).resolve().parents[2] / "sonjata-papercraft" / "images"
SCENE2_LAST = IMG_DIR / "scene2-last-frame.png"
STYLE_REF = IMG_DIR / "scene2-humiliation-v4.png"
PAPERCRAFT1_REF = IMG_DIR / "papercraft1-frame1.png"


def load_image(path: Path) -> types.Part:
    data = path.read_bytes()
    return types.Part.from_bytes(data=data, mime_type="image/png")


def generate_image(prompt: str, source_images: list[Path], output_name: str):
    """Generate image with Gemini, optionally with source images."""
    contents = []
    for img_path in source_images:
        contents.append(load_image(img_path))
    contents.append(prompt)

    print(f"\n{'='*60}")
    print(f"Generating: {output_name}")
    print(f"Source images: {[p.name for p in source_images]}")
    print(f"Prompt preview: {prompt[:200]}...")
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
            print(f"Text response: {part.text}")

    print("ERROR: No image in response")
    return None


# --- CLIP A: Surgical edit of scene2-last-frame ---
PROMPT_A = """Take this image exactly as it is. Make these surgical changes, NOTHING ELSE:

1. The tall woman in blue patterned dress pointing with her finger (LEFT foreground) -- SHRINK her and move her to the FAR LEFT BACKGROUND, partially hidden behind the hut. She is TURNING AWAY, her pointing hand NOW dropped to her side.

2. The small boy crawling on the ground (CENTER-BOTTOM with red sash) -- change ONLY his upper body posture: his PALMS press FLAT on the ground, his arms PUSH UP lifting his chest off the dirt. His head is RAISED, chin UP, staring FORWARD with FIERCE DETERMINATION. Jaw CLENCHED. Expression = 80% rage, 20% resolve. He is NOT crying, NOT defeated. His body shows the BEGINNING of pushing himself up.

3. Keep ALL other villagers exactly where they are -- same positions, same clothes, same sizes. Keep the baobab, huts, sky, ground texture IDENTICAL.

Style MUST remain: flat 2D paper-craft, warm sepia aged paper texture, chibi proportions with dot-eyes, clean dark outlines, flat color fills. No added detail or realism.

No text, no letters, no writing, no watermark anywhere in the image."""

# --- CLIP B: Blacksmith arrives (new image with style-ref) ---
PROMPT_B = """Use the provided reference image ONLY for visual style matching. Generate a completely NEW scene in the EXACT SAME STYLE:

Paper-craft storybook illustration, 9:16 vertical format, flat 2D, warm sepia aged paper texture, chibi proportions with dot-eyes, clean dark outlines, flat color fills.

SCENE: A West African village clearing, XIIIth century Mandinka Empire.

CENTER-BOTTOM: A small dark-skinned boy (age 7-8), chibi proportions, dot-eyes BURNING with fierce determination, curly black hair, red loincloth with red sash at waist. He KNEELS on the dusty ground, fists CLENCHED on his thighs. He STARES to the RIGHT side of the frame.

RIGHT SIDE, WALKING FROM BACKGROUND TOWARD CENTER: A large muscular man -- the village BLACKSMITH. Dark brown skin, leather apron over bare chest, thick forearms, sweat on brow. He carries a LONG STRAIGHT IRON BAR horizontally across his broad shoulders, gripping it with both hands. The bar is dark grey metal, extends past his shoulders on both sides. He walks with heavy determined steps.

BACKGROUND LEFT: 4-5 villagers scattered in varied poses -- an old man with white beard leaning on a staff, a young woman holding a toddler on her hip, two men in traditional pagnes watching intently. ALL faces turned toward the blacksmith. Expressions: curiosity mixed with apprehension.

ENVIRONMENT: Large baobab tree RIGHT background (trunk visible, canopy above frame). 2 round thatched-roof huts LEFT background. Warm dusty ochre ground, sepia-toned sky with soft clouds. Low afternoon sun casting warm light.

CRITICAL: flat 2D paper-craft style, muted earth tones only (ochre, sienna, brown, rust-red, cream). Chibi proportions. Dot-eyes on all characters. Clean thick dark outlines. Paper texture visible. NO realism, NO 3D shading, NO modern clothing.

No text, no letters, no writing, no watermark anywhere. Clean ground -- no dust effects, no motion lines drawn."""

# --- CLIP C: Circle forms (match papercraft1 composition) ---
PROMPT_C = """Use the two provided reference images for style AND composition matching. The FIRST image is the style reference. The SECOND image shows the TARGET COMPOSITION to match closely.

Generate a NEW image that looks like the SECOND image's composition but in the FIRST image's exact style:

Paper-craft storybook illustration, 9:16 vertical format.

SCENE: The moment BEFORE a legendary feat. A West African village, XIIIth century.

CENTER: A small dark-skinned boy (age 7-8), chibi proportions, dot-eyes full of FIERCE DETERMINATION, curly black hair, red loincloth with red sash. He KNEELS on the ground, back straight, chin UP. His arms hang at his sides -- fists CLENCHED but NOT yet touching anything.

DIRECTLY IN FRONT OF HIM: A long straight IRON BAR lies flat on the dusty ground, horizontal, dark grey metal. It is STRAIGHT, not bent. No glow, no highlight.

SURROUNDING THEM IN A WIDE CIRCLE: At least 8 villagers form a ring around the boy and the bar. They face INWARD. VARIED characters -- no two alike:
- An elder with white beard, staff in hand (LEFT)
- A woman in headwrap holding a small child (BACK LEFT)
- Two young men in pagnes, arms crossed (RIGHT)
- An older woman in patterned wrap (BACK RIGHT)
- 2-3 children peeking between adults (scattered)
Expressions: mix of doubt, fear, and breathless anticipation.

BACKGROUND: A MASSIVE baobab tree BEHIND the circle (trunk and lower canopy visible). 2-3 round thatched-roof huts on both sides. Warm dusty ground. Sepia sky.

CRITICAL STYLE: flat 2D paper-craft, warm sepia aged paper texture, chibi proportions with dot-eyes, clean dark outlines, flat color fills. Muted earth tones ONLY. NO realism. NO 3D. NO modern elements.

CRITICAL: Clean ground -- NO dust drawn, NO motion lines, NO effects. The bar lies FLAT, perfectly STRAIGHT.

No text, no letters, no writing, no watermark anywhere."""


def main():
    print("=== Generating Scene 3 Images ===\n")

    # Clip A: surgical edit
    result_a = generate_image(PROMPT_A, [SCENE2_LAST], "scene3-clipA-rage.png")

    # Clip B: new image with style-ref
    result_b = generate_image(PROMPT_B, [STYLE_REF], "scene3-clipB-forgeron.png")

    # Clip C: new image with style-ref + papercraft1 composition target
    result_c = generate_image(PROMPT_C, [STYLE_REF, PAPERCRAFT1_REF], "scene3-clipC-cercle.png")

    print(f"\n{'='*60}")
    print("RESULTS:")
    print(f"  Clip A (rage): {'OK' if result_a else 'FAILED'}")
    print(f"  Clip B (forgeron): {'OK' if result_b else 'FAILED'}")
    print(f"  Clip C (cercle): {'OK' if result_c else 'FAILED'}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
