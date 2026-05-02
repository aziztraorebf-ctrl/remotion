#!/usr/bin/env python3
"""Full regen of Sonjata Scene 5 storyboard 3x3 with corrected panel 5 prompt.

Lesson learned from 3 failed surgical fixes: Gemini cannot reliably modify
individual panels in a structured grid layout — full regen is the only path.

This v2 prompt fixes panel 5 by explicitly stating the boy is GRIPPING the
trunk (was missing in v1), and clarifies panel 9 has the baobab LAYING
HORIZONTALLY on the ground (was ambiguous in v1).
"""

import os
import sys
import time
from pathlib import Path

from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
REF_PATH = PROJECT_ROOT / "sonjata-papercraft" / "images" / "scene3-ref-soundjata-charsheet.png"
OUTPUT = PROJECT_ROOT / "tests" / "2026-05-01-gpt-image2-vs-gemini-scene5" / "A-gemini-v2-FROM-SCRATCH.png"

PROMPT = """9-panel papercraft storyboard, 3x3 grid layout, format 9:16 vertical.
Bold black borders between panels, white gutters between cells, panels clearly numbered 1 through 9 in small black numerals at top-left of each panel.

Consistent character across ALL 9 panels: young African boy, dark chocolate brown skin, curly black hair, red sash tied at waist, bare-chested, chibi proportions (big head, small body), thick black outlines, expressive face. Same character, same outfit, same hairstyle in every panel.

Setting: Mande village, golden hour, warm sepia aged paper texture, straw huts with conical thatched roofs and giant baobab trees in background, clay-red ground.

Panel 1: Wide shot — boy stands defiant in village center, fists clenched, diverse village crowd watching from edges (old bearded elder leaning on staff, mother holding baby, children, adults of varied African ethnicities and ages).
Panel 2: Medium — boy walks toward giant baobab, determined expression, eyebrows furrowed.
Panel 3: Close-up — boy's small hands grip the massive baobab trunk.
Panel 4: Medium — boy pulls hard on the trunk, muscles tensing, sweat on brow, teeth gritted.
Panel 5: Wide — boy is GRIPPING the baobab trunk with both arms wrapped around it, leaning back with effort, feet planted on the ground. Around the base of the tree, the clay-red ground is CRACKING with visible cracks radiating outward from the roots, small chunks of soil lifting up. The boy is clearly the central subject, still pulling hard.
Panel 6: Low angle — boy lifting baobab off ground, roots tearing free of soil with dirt clinging.
Panel 7: Wide — baobab fully uprooted, held above boy's head, triumphant pose.
Panel 8: Medium — boy walks carrying the baobab over his shoulder, heading toward his mother.
Panel 9: Wide — the baobab is now LAYING HORIZONTALLY ON THE GROUND (fallen, on its side, parallel to the ground), with torn roots visible to the left and leafy canopy to the right. The boy stands proudly next to the laid-down trunk. His hunched mother (small chibi woman in plain brown cloth wrap) stands beside him. The diverse crowd watches in awe with hands covering mouths. ALL eyes in this panel are small solid black pupils only — NO white iris, NO sclera, NO round white eyes.

Style anchor: papercraft cutout aesthetic, warm sepia palette (sepia, amber, honey, warm browns, terra-red), thick black outlines on every character and object, chibi super-deformed proportions throughout, aged paper texture visible, storybook illustration. NO floating particles, NO dust motes, NO sparkles, NO pollen. Dot-eyes for all background characters (small black pupils only, no white iris). All characters dark brown skin appropriate to West African Mandinka people, varied facial features and ages — no two background faces alike."""


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    if not REF_PATH.exists():
        print(f"ERROR: REF not found: {REF_PATH}")
        sys.exit(1)

    print(f"REF: {REF_PATH}")
    print(f"Output: {OUTPUT}")
    print(f"Prompt length: {len(PROMPT)} chars")

    client = genai.Client(api_key=api_key)
    ref_bytes = REF_PATH.read_bytes()
    ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/png")

    print("\nGenerating full storyboard v2 from scratch...")
    t0 = time.time()
    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[ref_part, PROMPT],
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
