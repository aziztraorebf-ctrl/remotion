#!/usr/bin/env python3
"""Test scene — Mariama Bâ assise à sa table d'écriture (50 ans, fin années 70).
Valide que le charsheet canonique fonctionne comme reference de personnage en contexte.
Style: papercraft GeoAfrique, dot eyes, plat.
Model: gemini-3.1-flash-image-preview
"""

import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
CHAR_DIR = PROJECT_ROOT / "public" / "assets" / "library" / "geoafrique" / "characters" / "mariama-ba"

CHARSHEET_REF = CHAR_DIR / "mariama-ba-charsheet-CANONICAL.png"
SCENE_STYLE_REF = PROJECT_ROOT / "sonjata-papercraft" / "clips-existants" / "papercraft1-cercle-barre-fer-frame1.png"

OUTPUT_PATH = CHAR_DIR / "scenes-test" / "scene-table-ecriture-v1.png"
PROMPT_PATH = CHAR_DIR / "scenes-test" / "scene-table-ecriture-v1.prompt.txt"

PROMPT = """Generate a NEW scene image — portrait orientation (9:16 ratio, 1080x1920) — in the GeoAfrique papercraft sepia style.

REFERENCE IMAGES PROVIDED:
1. CHARACTER REFERENCE (charsheet of an adult Senegalese woman with tall ochre gele headwrap, cream boubou with thin gold neckline, hoop earrings, slim build): copy this exact character — her face, her costume, her body proportions, her style. She is the subject of this scene.
2. SCENE STYLE REFERENCE (Sonjata papercraft village scene): copy this exact scene rendering style — fine confident black outlines, flat color fills, layered paper depth (foreground, midground, background as cut paper layers), warm sepia palette, matte paper texture, simplified iconic shapes.

CRITICAL STYLE RULE — DOT EYES, NOT REALISTIC EYES:
The character must have DOT EYES — small black filled dots only. NO iris, NO pupil, NO eye-white. Iconic papercraft face, NOT portrait-realistic.

SCENE — Mariama Bâ writing at her table in 1970s Dakar:

CENTER FIGURE: the woman from the charsheet reference, seated at a small simple wooden writing table. She wears the same tall ochre gele headwrap, cream boubou with thin gold neckline trim, hoop earrings. Her right hand holds a fountain pen, poised over a sheet of paper on the table. Her left hand rests calmly on the table beside the paper. She is gently leaning forward slightly, her dot eyes looking down at the paper. Calm composed expression, small closed mouth. She is in profile or three-quarters view, turned slightly toward the right side of the frame.

TABLE: small simple wooden writing table, warm brown wood with paper grain texture. On the table: one sheet of off-white paper with faint suggested handwriting lines (NO actual readable text, NO letters), a small ceramic teacup in soft terracotta color, a single flower in a tiny vase or none.

CHAIR: simple wooden chair under her, only partially visible.

BACKGROUND — layered papercraft depth:
- BEHIND HER: a soft cream interior wall with a single open window on the right side. Through the window: a Dakar sky in pale ochre or very soft dusty blue (sunset light), the silhouette of a single palm tree (papercraft cut shape), a low ochre wall in the distance.
- A thin curtain frames the window edge, in pale cream.
- Floor: warm earth-brown tone.

LIGHTING: warm late-afternoon light coming from the window on the right. The light falls softly on her face and on the paper she writes on. NO harsh shadows. Flat papercraft sepia palette.

PALETTE (NON-NEGOTIABLE):
- Dominant: warm ochres, terracotta, cream
- Soft accents: dusty pale blue (sky only), warm brown (wood, earth)
- Skin: uniform warm brown, no shading
- NO bright colors, NO saturated greens, NO realistic gradients

STYLE RULES (NON-NEGOTIABLE):
- DOT EYES only — never realistic eyes
- Fine confident black outlines — NOT thick BD/comic outlines
- Flat color fills — NOT painted illustration with shading
- Layered paper depth — figure clearly cut from background, background clearly cut from sky
- Iconic stylized rendering — NOT portrait-realistic
- Paper grain texture visible everywhere

NO text. NO labels. NO captions. NO readable writing on the paper she writes on (just suggested lines). NO annotations of any kind anywhere in the image.

Calm intimate scene of an intellectual woman writing — NOT dramatic, NOT tragic, NOT epic. The mood is patient, warm, contemplative."""


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    refs = [
        ("CHARACTER", CHARSHEET_REF, "image/png"),
        ("SCENE_STYLE", SCENE_STYLE_REF, "image/png"),
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

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
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
