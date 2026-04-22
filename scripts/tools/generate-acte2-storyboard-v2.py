#!/usr/bin/env python3
"""
Generate storyboard 5 panels for Soundjata Acte II (Humiliation).

Uses Gemini 3.1 Flash Image (edition chirurgicale) with canonical refs as input.
Output: N&B pencil sketch, 5 panels stacked vertically, 9:16 format.

Refs passed as source images:
  - soundjata-baby-ref.png (baby crawling)
  - start-frame-humiliation.png (matrone alone, pointing)
  - end-frame-humiliation.png (matrone + sogolon confrontation)
"""

import os
import sys
import base64
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
    "baby": REFS_DIR / "acte1" / "soundjata-baby-ref.png",
    "matrone": REFS_DIR / "acte2" / "start-frame-humiliation.png",
    "confrontation": REFS_DIR / "acte2" / "end-frame-humiliation.png",
}

for name, path in ref_paths.items():
    assert path.exists(), f"Missing ref: {name} at {path}"

# --- Load images ---
def load_image(path: Path) -> types.Part:
    data = path.read_bytes()
    return types.Part.from_bytes(data=data, mime_type="image/png")

ref_parts = {name: load_image(path) for name, path in ref_paths.items()}

# --- Prompt ---
PROMPT = """You are a storyboard artist. I am providing 3 reference images of characters from an animated series.

IMAGE 1 = Baby Soundjata (toddler boy, dark brown skin, short curly hair, ochre tunic, sitting on the ground, cannot walk)
IMAGE 2 = The Matrone (tall woman, dark skin, navy blue headwrap, blue-gray geometric patterned dress, pearl necklace, one hand on hip, pointing with other hand, arrogant posture)
IMAGE 3 = Matrone confronting Sogolon (same matrone on left, Sogolon on right wearing teal/turquoise dress and teal headwrap, head bowed in shame)

Using these character designs as STRICT identity anchors, create a STORYBOARD with exactly 5 PANELS stacked VERTICALLY in a single tall image (portrait 9:16 ratio).

The storyboard must be BLACK AND WHITE PENCIL SKETCH ONLY. No color. No shading. No gray tones. Pure black ink lines on white paper, like a manga storyboard draft.

PANEL 1 (top): WIDE SHOT - Village courtyard, dusty ground. Baby Soundjata CRAWLS on all fours in the dirt. His face shows effort and frustration. Other children run and play in the background, standing upright. Framing label: "WIDE - village"

PANEL 2: MEDIUM SHOT - The Matrone stands tall, hand on hip, chin raised, SNEERING down. She points at something off-panel (toward Soundjata). Behind her, 3-4 village women watch with varied expressions (some amused, some uncomfortable). Framing label: "MED - matrone sneers"

PANEL 3: CLOSE-UP - Matrone's face from slightly below (low angle), mouth open mid-insult, eyes narrowed with cruelty and disdain. Her pointing finger is visible at the edge of frame. Framing label: "CU - insult"

PANEL 4: TWO-SHOT - The Matrone towers over Sogolon, leaning forward aggressively. Sogolon's head is bowed, shoulders slumped, hands clasped. The matrone's body language dominates the frame. Village women visible as silhouettes in background. Framing label: "TWO - humiliation"

PANEL 5 (bottom): LOW ANGLE CLOSE-UP - Baby Soundjata on the ground, looking UP directly at camera. His expression has CHANGED: no longer frustration but quiet DETERMINATION. His small fists press into the dirt. Dramatic shadow falls across half his face. Framing label: "CU LOW - resolve"

CRITICAL REQUIREMENTS:
- BLACK AND WHITE PENCIL SKETCH ONLY. No color whatsoever. No gray washes.
- 5 panels stacked VERTICALLY in one tall portrait image
- Each panel separated by a clear black border line
- Characters MUST match the provided reference images exactly (face shape, headwrap, dress patterns, baby proportions)
- Framing labels in small text at top-left of each panel
- No text, no speech bubbles, no dialogue
- Clean compositional lines showing camera angles clearly
"""

# --- Generate ---
print("Generating storyboard with Gemini 3.1 Flash Image...")
print(f"  Model: gemini-3.1-flash-image-preview")
print(f"  Refs: {', '.join(ref_paths.keys())}")

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        ref_parts["baby"],
        ref_parts["matrone"],
        ref_parts["confrontation"],
        PROMPT,
    ],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

# --- Save output ---
OUTPUT_DIR = REFS_DIR / "acte2"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
output_path = OUTPUT_DIR / "storyboard-5panels-humiliation-v2.png"

saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
        output_path.write_bytes(part.inline_data.data)
        print(f"Storyboard saved to: {output_path}")
        saved = True
        break
    elif part.text:
        print(f"Text response: {part.text[:200]}")

if not saved:
    print("ERROR: No image generated. Full response:")
    for part in response.candidates[0].content.parts:
        if part.text:
            print(part.text)
    sys.exit(1)

print("Done.")
