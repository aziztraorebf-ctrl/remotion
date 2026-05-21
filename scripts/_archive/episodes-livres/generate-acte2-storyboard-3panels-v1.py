#!/usr/bin/env python3
"""
Generate storyboard 3 panels for Soundjata Acte II (Humiliation setup).

Uses Gemini 3.1 Flash Image with 4 canonical refs as input images.
Output: N&B pencil sketch, 3 panels stacked vertically, 9:16 format.

Refs passed as source images:
  - soundjata-enfant-7ans-ref.png (boy 7-8 years, crawling - from Acte III iron bar clip)
  - start-frame-humiliation.png (matrone alone, pointing)
  - end-frame-humiliation.png (matrone + sogolon confrontation)
  - village-daytime-plate.png (village mandingue environment)

Gate 13 (style): refs used as anchors, NOT generated from scratch.
"""

import os
import sys
from pathlib import Path

# --- Setup ---
ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT))

from google import genai
from google.genai import types

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    from dotenv import load_dotenv
    load_dotenv(ROOT / ".env")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

assert GEMINI_API_KEY, "GEMINI_API_KEY not found in environment"

client = genai.Client(api_key=GEMINI_API_KEY)

# --- Refs ---
REFS_DIR = ROOT / "public" / "assets" / "library" / "geoafrique" / "heros-oublies" / "soundjata" / "refs"

ref_paths = {
    "enfant_7ans": REFS_DIR / "acte2" / "soundjata-enfant-7ans-ref.png",
    "matrone": REFS_DIR / "acte2" / "start-frame-humiliation.png",
    "confrontation": REFS_DIR / "acte2" / "end-frame-humiliation.png",
    "village": REFS_DIR / "acte2" / "village-daytime-plate.png",
}

for name, path in ref_paths.items():
    assert path.exists(), f"Missing ref: {name} at {path}"

# --- Load images ---
def load_image(path: Path) -> types.Part:
    data = path.read_bytes()
    return types.Part.from_bytes(data=data, mime_type="image/png")

ref_parts = {name: load_image(path) for name, path in ref_paths.items()}

# --- Prompt ---
PROMPT = """You are a storyboard artist for an animated series. I am providing 4 reference images. Use them as STRICT identity anchors for the characters and environment.

IMAGE 1 = Soundjata as a CHILD aged 7-8 years old (boy, dark brown skin, short curly hair, brown/ochre simple tunic, crawling on all fours on red earth. He is NOT a baby, NOT a toddler. He is a school-age boy who cannot walk.)
IMAGE 2 = The Matrone (tall woman, dark skin, navy blue/indigo headwrap, blue-gray geometric patterned wrapped dress, pearl necklace, one hand on hip, pointing with other hand, arrogant/sneering posture)
IMAGE 3 = Matrone confronting Sogolon (same matrone on left, Sogolon on right wearing teal/turquoise wrapped dress and teal headwrap, head bowed in shame and humiliation)
IMAGE 4 = Village environment (Mandinka village, round banco huts with thatched roofs, large baobab tree, red/ochre earth, warm golden sky, clay pots)

Create a STORYBOARD with exactly 3 PANELS stacked VERTICALLY in a single tall image (portrait 9:16 ratio). Each panel takes roughly 1/3 of the image height.

The storyboard must be BLACK AND WHITE PENCIL/INK SKETCH. No color. Clean black lines on white paper, like a manga/BD storyboard draft. Light crosshatching for shadows is acceptable.

PANEL 1 (top) - "WIDE - crawling":
Wide shot of the village courtyard (matching IMAGE 4 environment). Soundjata (matching IMAGE 1 exactly: 7-8 year old boy, NOT a baby) crawls on all fours on the red earth. His face shows effort and frustration. In the background, 3-4 village women stand watching, some whispering to each other. Cases banco and baobab visible. Camera slightly high angle looking down at the boy.

PANEL 2 (middle) - "MED - matrone sneers":
Medium shot. The Matrone (matching IMAGE 2 exactly: same headwrap, same geometric dress, same necklace) stands tall, hand on hip, chin raised high. She sneers down with contempt and points off-panel toward Soundjata. Her posture radiates arrogance and cruelty. Behind her, 2-3 village women watch. Village huts visible in background.

PANEL 3 (bottom) - "TWO - humiliation":
Two-shot. The Matrone (left, matching IMAGE 2) towers over and confronts Sogolon (right, matching IMAGE 3: teal headwrap, teal dress). Matrone leans forward aggressively, finger pointing at Sogolon. Sogolon's head is bowed, shoulders slumped, arms hanging — posture of deep shame. Village women visible as small silhouettes in the background. This is a public humiliation.

CRITICAL REQUIREMENTS:
- BLACK AND WHITE INK/PENCIL SKETCH ONLY. No color whatsoever.
- Exactly 3 panels stacked VERTICALLY in one tall portrait image (9:16 ratio)
- Each panel separated by a clear black border line
- Characters MUST match the provided reference images exactly (face shape, headwrap style, dress patterns, age, body proportions)
- Soundjata is a 7-8 YEAR OLD BOY, not a baby, not a toddler. School-age child who crawls because he cannot walk.
- Small framing label text at top-left corner of each panel: "WIDE - crawling", "MED - matrone sneers", "TWO - humiliation"
- No speech bubbles, no dialogue text, no decorative text
- COMPOSITION GUIDE ONLY. Do NOT interpret, deviate from, or add to the storyboard layout.
- No text, no letters, no numerals visible anywhere except the framing labels.
"""

# --- Generate ---
print("Generating storyboard 3 panels with Gemini 2.0 Flash Exp...")
print(f"  Model: gemini-3.1-flash-image-preview")
print(f"  Refs: {', '.join(ref_paths.keys())}")
print(f"  Output: 3 panels vertical N&B sketch")

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        ref_parts["enfant_7ans"],
        ref_parts["matrone"],
        ref_parts["confrontation"],
        ref_parts["village"],
        PROMPT,
    ],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

# --- Save output ---
OUTPUT_DIR = REFS_DIR / "acte2"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
output_path = OUTPUT_DIR / "storyboard-3panels-humiliation-v1.png"

saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
        output_path.write_bytes(part.inline_data.data)
        print(f"Storyboard saved to: {output_path}")
        saved = True
        break
    elif part.text:
        print(f"Text response: {part.text[:300]}")

if not saved:
    print("ERROR: No image generated. Full response:")
    for part in response.candidates[0].content.parts:
        if part.text:
            print(part.text)
    sys.exit(1)

# --- Save refs sidecar (Gate 13) ---
refs_file = OUTPUT_DIR / "storyboard-3panels-humiliation-v1.refs.txt"
refs_content = """Storyboard 3 panels - Soundjata Acte II Humiliation v1
Generated: 2026-04-18
Model: gemini-3.1-flash-image-preview

Canonical refs used as source images (Gate 13):
1. soundjata-enfant-7ans-ref.png — Soundjata enfant 7-8 ans, extrait frame acte3-iron-bar-v1.mp4
2. start-frame-humiliation.png — Matrone seule, pagne bleu geometrique, turban indigo, doigt pointe
3. end-frame-humiliation.png — Matrone + Sogolon face-a-face, Sogolon turban vert/teal
4. village-daytime-plate.png — Village mandingue, cases banco, baobab, terre rouge
"""
refs_file.write_text(refs_content)
print(f"Refs sidecar saved to: {refs_file}")

print("Done.")
