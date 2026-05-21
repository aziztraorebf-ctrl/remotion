#!/usr/bin/env python3
"""Surgical fix: regenerate panel 9 of Gemini storyboard.
Source: tests/2026-05-01-gpt-image2-vs-gemini-scene5/A-gemini-3-1-flash-storyboard.png
Issue: panel 9 shows incomplete baobab + white iris eyes.
Fix: complete baobab visible (like panel 8) + small black pupils only.
"""

import os
import sys
import time
from pathlib import Path

from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
SOURCE = PROJECT_ROOT / "tests" / "2026-05-01-gpt-image2-vs-gemini-scene5" / "A-gemini-3-1-flash-storyboard.png"
OUTPUT = PROJECT_ROOT / "tests" / "2026-05-01-gpt-image2-vs-gemini-scene5" / "A-gemini-FIXED-storyboard.png"

FIX_PROMPT = """This is a 9-panel papercraft storyboard (3x3 grid layout).

Keep panels 1, 2, 3, 4, 5, 6, 7, and 8 EXACTLY as they are. Do not modify them at all.

ONLY modify panel 9 (bottom-right corner). In the new panel 9, redraw it as follows:
- Wide shot, same papercraft sepia style as the rest of the storyboard, same warm aged paper texture, same thick black outlines, same chibi proportions.
- The young African boy (dark chocolate brown skin, curly black hair, red sash at waist, bare-chested) has just laid the COMPLETE BAOBAB TREE on the ground in front of his hunched mother (Sogolon, in plain brown cloth wrap). The FULL baobab must be visible: massive trunk, large roots, and the leafy canopy at the top, all laying horizontally on the clay-red ground.
- The boy stands proudly next to the laid-down tree.
- Behind them: 3-4 diverse villagers (varied African ethnicities, ages, body types) watching in awe — hands covering mouths, wide expressions of amazement.
- Critical eye fix: ALL characters in panel 9 must have SMALL SOLID BLACK PUPILS only. NO white iris visible. NO sclera. NO round white eyes. Eyes are simple black dots or thin vertical ovals, matching the dot-eye style of panels 1-8.
- Keep the small "9" numeral at the top-left of the panel.
- Keep the bold black panel border.

Do NOT modify panels 1-8. The output must be the same 3x3 storyboard image with only panel 9 (bottom-right) updated."""


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

    print("\nGenerating surgical fix (panel 9 only)...")
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
