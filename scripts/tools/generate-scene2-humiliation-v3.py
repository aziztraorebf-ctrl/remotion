"""
Generate Scene 2 Humiliation v3 for Sonjata Papercraft.
Corrections: traditional clothing on children, children standing still, 2 distinct children, neutral poses (R-PC1).
Uses gemini-3.1-flash-image-preview with papercraft1 frame as style anchor.
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

from google import genai
from google.genai import types

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not found in .env")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
MODEL = "gemini-3.1-flash-image-preview"

# Load style reference
PROJECT_ROOT = Path(__file__).resolve().parents[2]
REF_PATH = PROJECT_ROOT / "sonjata-papercraft/clips-existants/papercraft1-cercle-barre-fer-frame1.png"
ref_bytes = REF_PATH.read_bytes()
ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/png")

OUTPUT_DIR = PROJECT_ROOT / "sonjata-papercraft/images"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """Using the attached reference image as the EXACT style anchor (same papercraft storybook illustration style, same warm sepia aged paper texture, same thick black outlines, same chibi proportions with dot-eyes, same flat color fills, same muted earth tones), generate a NEW scene:

Papercraft storybook illustration, 9:16 portrait format (1080x1920). West African village, 13th century. Round thatched-roof huts, baobab tree, red-orange soil, pale yellow sky.

Center-bottom: a small African boy (dark brown skin, curly black hair, red cloth sash around waist) on his hands and knees on the ground, palms flat on the soil, looking straight ahead with a determined expression. He is in a static position, NOT actively crawling. Chibi proportions matching the style reference.

Left foreground: a tall imposing African woman (dark brown skin) with an elaborate geometric-patterned headwrap and long blue patterned dress, standing straight with ARMS AT HER SIDES, chin raised, expression of superiority. NOT pointing, NOT gesturing.

Right middle: a hunched African woman (dark brown skin) in simple beige cloth wrap, ARMS AT HER SIDES, head slightly bowed, expression of sadness.

Near the boy, two children of CLEARLY DIFFERENT sizes standing still:
- SMALLER child (about knee-height to the adults): wears a simple BROWN LOINCLOTH only, bare chest, bare feet, standing still, looking at the boy with curiosity. Dark brown skin.
- TALLER child (about waist-height to the adults): wears a BEIGE WRAPPED CLOTH around the waist, bare chest, bare feet, standing still, looking away uncomfortably. Dark brown skin.
CRITICAL: NO modern clothing on anyone. No t-shirts, no shorts, no shoes. 13th century West African clothing ONLY: loincloths, wrapped cloth, draped fabric.

Background: 3-4 adult villagers (dark brown skin, VARIED ages and body types) in simple traditional wrapped cloth, standing with hands at sides, observing. NO covering mouths. NO pointing. ALL in neutral standing poses.

Style: thick black outlines, warm sepia aged paper texture, chibi proportions with dot-eyes, flat color fills, muted earth tones (ochre, sienna, beige, olive). No text, no letters, no numerals visible anywhere. No watermarks. No UI elements."""

print(f"Generating scene2-humiliation-v3 with {MODEL}...")
print(f"Style ref: {REF_PATH.name}")
print(f"Prompt length: {len(PROMPT)} chars")

response = client.models.generate_content(
    model=MODEL,
    contents=[
        ref_part,
        PROMPT,
    ],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

# Save result
output_path = OUTPUT_DIR / "scene2-humiliation-v3.png"
saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
        output_path.write_bytes(part.inline_data.data)
        print(f"Saved: {output_path}")
        saved = True
    elif part.text:
        print(f"Model text: {part.text[:200]}")

if not saved:
    print("ERROR: No image generated!")
    sys.exit(1)

print("Done.")
