#!/usr/bin/env python3
"""Generate Scene 2 image: Rampe 7 ans + Humiliation Sassouma
Style ref: papercraft1-cercle-barre-fer-frame1.png
Model: gemini-3.1-flash-image-preview
Output: sonjata-papercraft/images/scene2-humiliation.png
"""

import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
STYLE_REF = PROJECT_ROOT / "sonjata-papercraft" / "clips-existants" / "papercraft1-cercle-barre-fer-frame1.png"
OUTPUT_PATH = PROJECT_ROOT / "sonjata-papercraft" / "images" / "scene2-humiliation.png"
PROMPT_PATH = PROJECT_ROOT / "sonjata-papercraft" / "images" / "scene2-humiliation.prompt.txt"

PROMPT = """Use the attached image ONLY as a STYLE REFERENCE. Match its visual style exactly: thick black outlines, warm sepia aged paper texture, chibi proportions with dot-eyes, flat color fills, simple shapes, muted earth tones, papercraft storybook look.

Generate a NEW image — portrait orientation (9:16 ratio, 1080x1920).

Medium-wide shot of a West African village courtyard scene of humiliation and childhood suffering.

CENTER: a small African boy (dark brown skin, curly black hair, red sash at waist) crawling on hands and knees on red-orange soil. His face shows DEFIANCE — furrowed brow, clenched jaw, determined dot-eyes looking forward. NOT sad, NOT crying. His small fists grip the ground with intensity. Chibi proportions.

LEFT FOREGROUND: a tall imposing West African woman (Sassouma — dark brown skin, elaborate patterned headwrap with geometric designs, long ornate robe with bold geometric patterns, gold jewelry at wrists). She stands with arrogant posture, chest puffed out, chin raised. Her RIGHT arm is extended with ONE index finger POINTING DOWN toward the crawling boy. Her left hand rests on her hip. She is the tallest figure in the scene.

RIGHT OF CENTER: a hunched West African woman (Sogolon — dark brown skin, simple plain brown cloth wrap, head bowed, shoulders drooping, expression of quiet endurance). She stands with arms close to her body. NO tears, NO crying — just silent resignation. Smaller and shorter than Sassouma.

AROUND THE CRAWLING BOY: 3-4 African children of VARIED ages (roughly 5-10 years), genders, body types and facial features — no two faces alike. They are in RUNNING poses — legs mid-stride, arms swinging. They run past the crawling boy, creating a visual contrast: they can run, he cannot.

BACKGROUND: 3-4 West African villagers standing as witnesses — VARIED ages, genders, body types. Some look away uncomfortably, one covers mouth. 2-3 round mud-brick huts with thatched conical roofs. 1 large baobab tree. Rolling hills in the far background. Pale yellow sky with soft white clouds.

Red-orange African soil throughout. Warm sepia aged paper texture.

All characters have dark brown skin appropriate to West African Mandinka people. Chibi proportions with large heads and small bodies throughout.

No text, no letters, no numerals, no banners, no signs, no writing visible anywhere in the image."""


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    # Load style ref
    style_ref_bytes = STYLE_REF.read_bytes()
    style_ref_part = types.Part.from_bytes(
        data=style_ref_bytes,
        mime_type="image/png"
    )

    print(f"Style ref: {STYLE_REF}")
    print(f"Output: {OUTPUT_PATH}")
    print(f"Prompt length: {len(PROMPT)} chars")
    print("Generating...")

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[style_ref_part, PROMPT],
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    # Extract image
    image_saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT_PATH.write_bytes(part.inline_data.data)
            print(f"Image saved: {OUTPUT_PATH}")
            image_saved = True
        elif part.text:
            print(f"Text response: {part.text}")

    if not image_saved:
        print("ERROR: No image in response")
        sys.exit(1)

    # Save prompt
    PROMPT_PATH.write_text(
        f"Model: gemini-3.1-flash-image-preview\n"
        f"Date: 2026-04-19\n"
        f"Style ref: sonjata-papercraft/clips-existants/papercraft1-cercle-barre-fer-frame1.png\n\n"
        f"Prompt:\n{PROMPT}\n"
    )
    print(f"Prompt saved: {PROMPT_PATH}")
    print("Done.")


if __name__ == "__main__":
    main()
