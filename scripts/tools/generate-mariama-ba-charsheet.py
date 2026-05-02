#!/usr/bin/env python3
"""Generate Mariama Bâ character sheet — 4 head views + 1 full body.
Style ref: papercraft Sonjata version finale.
Visage refs: photos historiques Wikimedia Commons (UNESCO domaine public).
Model: gemini-3.1-flash-image-preview
"""

import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

CHAR_DIR = PROJECT_ROOT / "public" / "assets" / "library" / "geoafrique" / "characters" / "mariama-ba"

FACE_PAPERCRAFT_REF = CHAR_DIR / "femme ref 2.png"
BODY_PAPERCRAFT_REF = CHAR_DIR / "femme ref 1.png"
LAYOUT_REF = CHAR_DIR / "abu bakari ref.png"

OUTPUT_DIR = CHAR_DIR
OUTPUT_PATH = OUTPUT_DIR / "mariama-ba-charsheet-v3.png"
PROMPT_PATH = OUTPUT_DIR / "mariama-ba-charsheet-v3.prompt.txt"

PROMPT = """CHARACTER SHEET — generate a NEW original character in the GeoAfrique papercraft style.

REFERENCE IMAGES PROVIDED:
1. FACE STYLE REFERENCE — Senegalese woman with white headwrap, papercraft style. Copy this exact face rendering: simple DOT EYES (small black filled dots, NO iris, NO pupil, NO realistic eye), thin curved eyebrows, tiny calm closed mouth as a single small curve, simple curved nose line, uniform warm-brown skin, fine confident black outlines, papercraft sepia paper texture.
2. BODY STYLE REFERENCE — Senegalese woman in ochre wrap with hands joined in front, papercraft style. Copy this exact body rendering: slim feminine silhouette, simple drape, calm posture, fine outlines, flat color fills.
3. LAYOUT REFERENCE — character sheet showing 3 full body figures aligned horizontally in a row (front, three-quarters, profile). Copy this exact horizontal layout with plain cream background.

CRITICAL STYLE RULE — DOT EYES, NOT REALISTIC EYES:
The character must have DOT EYES exactly like reference #1 — small black filled dots only. This is the GeoAfrique papercraft signature. Realistic eyes with iris/pupil/eye-white are FORBIDDEN. Faces in this style are iconic, not portrait-like — distinguished by costume and accessories, not by individualized features.

CHARACTER TO GENERATE:
A dignified adult Senegalese woman in 1970s Dakar attire. Her distinctive attributes:
- Tall GELE headwrap with simple geometric pattern, ochre and brown tones, tied elegantly upward
- Long flowing BOUBOU dress in soft cream color with a single thin decorative band at the neckline
- Small gold hoop earrings
- Slim slender adult build (NOT a young girl, NOT a warrior physique)
- Both hands joined gently in front of her at her midsection, holding a small closed BOOK
- Standing upright, calm, dignified posture
- Bare feet OR simple leather sandals visible at the bottom

LAYOUT — EXACTLY MATCH REFERENCE #3:
3 FULL BODY figures aligned HORIZONTALLY in a single row across the canvas, all standing on the same baseline:
- LEFT figure: front view (facing forward)
- CENTER figure: three-quarters view (turned slightly right)
- RIGHT figure: profile view (fully facing right)
All 3 figures wear the IDENTICAL costume and have the IDENTICAL pose (hands joined holding book), just shown from 3 angles. Same character, 3 views.

Wide horizontal canvas (16:9 or 3:2 aspect ratio). Plain warm cream/beige paper background. Subtle soft paper shadow under each figure. Figures clearly separated, no overlap.

STYLE RULES (NON-NEGOTIABLE):
- DOT EYES only (small black filled dots) — never realistic eyes
- Fine confident black outlines — NOT thick BD/comic outlines, NOT thin hesitant lines
- Flat ochre/terracotta/cream/soft brown palette only — NO blue, NO bright green, NO realistic shading or gradients
- Uniform skin tone (no modeling), paper grain texture visible
- Iconic stylized face — NOT portrait-realistic, NOT illustration-painted, NOT BD/comic

NO scenery. NO text. NO labels. NO captions. NO writing. NO annotations of any kind anywhere in the image.

Output format: wide horizontal sheet, plain cream paper background, 3 full body figures of the same character side by side."""


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    refs = [
        ("FACE_PAPERCRAFT", FACE_PAPERCRAFT_REF, "image/png"),
        ("BODY_PAPERCRAFT", BODY_PAPERCRAFT_REF, "image/png"),
        ("LAYOUT", LAYOUT_REF, "image/png"),
    ]

    for label, path, _ in refs:
        if not path.exists():
            print(f"ERROR: {label} ref not found: {path}")
            sys.exit(1)
        print(f"  {label}: {path} ({path.stat().st_size // 1024} KB)")

    client = genai.Client(api_key=api_key)

    parts = []
    for _, path, mime in refs:
        parts.append(types.Part.from_bytes(data=path.read_bytes(), mime_type=mime))
    parts.append(PROMPT)

    print(f"\nOutput: {OUTPUT_PATH}")
    print(f"Prompt length: {len(PROMPT)} chars")
    print("Generating...")

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=parts,
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

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

    refs_log = "\n".join(
        f"  {label}: {path.relative_to(PROJECT_ROOT)}" for label, path, _ in refs
    )
    PROMPT_PATH.write_text(
        f"Model: gemini-3.1-flash-image-preview\n"
        f"Date: 2026-04-29\n"
        f"Refs:\n{refs_log}\n\n"
        f"Prompt:\n{PROMPT}\n"
    )
    print(f"Prompt saved: {PROMPT_PATH}")
    print("Done.")


if __name__ == "__main__":
    main()
