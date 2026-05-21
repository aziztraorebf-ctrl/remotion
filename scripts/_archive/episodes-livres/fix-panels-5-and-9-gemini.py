#!/usr/bin/env python3
"""Surgical fix v2: regenerate panels 5 AND 9 of Gemini storyboard.
Source: A-gemini-FIXED-storyboard.png (eyes fixed in panel 9, but panel 5 still empty
        and panel 9 baobab still standing instead of laying down).
Issues:
  - Panel 5: empty tree (no boy gripping trunk) -- breaks narrative continuity panels 4->6
  - Panel 9: baobab standing vertically instead of laying horizontally on the ground
Fix: redraw both panels coherently with the rest of the storyboard.
"""

import os
import sys
import time
from pathlib import Path

from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
SOURCE = PROJECT_ROOT / "tests" / "2026-05-01-gpt-image2-vs-gemini-scene5" / "A-gemini-FIXED-storyboard.png"
OUTPUT = PROJECT_ROOT / "tests" / "2026-05-01-gpt-image2-vs-gemini-scene5" / "A-gemini-FIXED-v2-storyboard.png"

FIX_PROMPT = """This is a 9-panel papercraft storyboard (3x3 grid layout).

Keep panels 1, 2, 3, 4, 6, 7, and 8 EXACTLY as they are. Do not modify them.

Modify ONLY panel 5 (top-right) AND panel 9 (bottom-right):

PANEL 5 (top-right corner):
Wide shot in the same papercraft sepia style, same warm aged paper texture, same thick black outlines, same chibi proportions as the other panels.
The young African boy (dark chocolate brown skin, curly black hair, red sash at waist, bare-chested, chibi proportions) is GRIPPING the massive baobab trunk with both arms wrapped around it, pulling hard, his body leaning back with effort, feet planted on the clay-red ground.
The clay-red ground around the base of the baobab is starting to CRACK with visible cracks radiating outward from the roots. Some small pieces of soil are lifting up.
Background: distant straw huts and other baobabs, warm sepia palette.
Keep the small "5" numeral at the top-left of the panel and the bold black panel border.
Eyes: small solid black pupils only, NO white iris, NO sclera.

PANEL 9 (bottom-right corner):
Wide shot in the same papercraft sepia style.
The boy stands PROUDLY next to a HUGE BAOBAB TREE THAT IS LAYING HORIZONTALLY ON THE GROUND. The baobab is FALLEN, on its side, lying horizontally across the foreground. Massive trunk laying flat on the clay-red ground, large torn roots visible to the left side (ripped out of the earth, dirt clinging to them), and the leafy green canopy to the right side. The whole tree is horizontal, parallel to the ground.
The boy stands upright next to the laid-down trunk, small fists at his sides, satisfied expression.
Next to the boy: his mother Sogolon (a small chibi African woman in a plain brown cloth wrap, head slightly bowed, hands clasped in front of her). She stands close to her son.
Behind them: 3-4 diverse villagers (varied African ethnicities, ages, body types) watching in awe — hands covering mouths, eyes wide with amazement.
Background: village huts, other baobabs in the distance.
Eyes for ALL characters in panel 9: small solid black pupils ONLY. NO white iris. NO sclera. NO round white eyes. Just simple black dots.
Keep the small "9" numeral at the top-left of the panel and the bold black panel border.

Panels 1, 2, 3, 4, 6, 7, 8 must remain IDENTICAL to the input. The output must be the same 3x3 storyboard image with only panels 5 and 9 updated."""


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    if not SOURCE.exists():
        print(f"ERROR: Source not found: {SOURCE}")
        sys.exit(1)

    print(f"Source: {SOURCE}")
    print(f"Output: {OUTPUT}")
    print(f"Prompt length: {len(FIX_PROMPT)} chars")

    client = genai.Client(api_key=api_key)
    src_bytes = SOURCE.read_bytes()
    src_part = types.Part.from_bytes(data=src_bytes, mime_type="image/png")

    print("\nGenerating surgical fix v2 (panels 5 + 9)...")
    t0 = time.time()
    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[src_part, FIX_PROMPT],
        config=types.GenerateContentConfig(response_modalities=["image", "text"]),
    )
    elapsed = time.time() - t0

    saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            OUTPUT.write_bytes(part.inline_data.data)
            saved = True
            print(f"OK | {elapsed:.1f}s | ~$0.039")
            print(f"-> {OUTPUT}")
        elif part.text:
            print(f"Text response: {part.text}")

    if not saved:
        print("ERROR: No image returned")
        sys.exit(1)


if __name__ == "__main__":
    main()
