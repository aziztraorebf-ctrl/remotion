"""
Generate scene2-humiliation-v2.png for Sonjata Papercraft.
ALL characters in NEUTRAL starting positions (R-PC1 compliance).
Uses papercraft1 frame as style reference.
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
OUTPUT_PATH = OUTPUT_DIR / "scene2-humiliation-v2.png"

PROMPT = """Using the attached image as the EXACT style reference. Match this style PRECISELY: thick black outlines, warm sepia aged paper texture, chibi proportions with simple dot-eyes, flat color fills, simple shapes, muted earth tones. Papercraft storybook illustration.

Generate a NEW image in 9:16 portrait format (1080x1920).

Scene: West African village courtyard, 13th century. Round thatched-roof huts with mud walls, one large baobab tree in background, red-orange laterite soil, pale yellow sky with soft clouds.

CHARACTERS - ALL IN NEUTRAL STANDING/SITTING POSITIONS (this is a START FRAME, no action yet):

CENTER-BOTTOM: Soundjata - a small African boy (dark brown skin, curly black hair, red cloth sash/belt around waist) sitting on the ground on his hands and knees, palms flat on the soil, looking straight ahead with a neutral determined expression. He is completely still, NOT actively crawling or moving. Simple neutral face.

LEFT FOREGROUND: Sassouma Berete - a tall imposing African woman (dark brown skin) with an elaborate geometric-patterned headwrap and long patterned dress in deep blue/indigo tones. Standing perfectly straight with BOTH ARMS relaxed AT HER SIDES. Chin slightly raised. She is NOT pointing, NOT gesturing. Her authority comes only from her tall posture and raised chin.

RIGHT MIDDLE: Sogolon - a hunched African woman (dark brown skin) in simple beige/cream cloth wrap. Standing with ARMS AT HER SIDES, head slightly bowed, looking at the ground. No visible reaction or gesture. Simply standing still.

AROUND SOUNDJATA: Three children of VARIED ages (one small ~5, one medium ~8, one taller ~11, all dark brown skin, varied simple clothing) standing still in different positions around the boy. Some face him, some look elsewhere. They are NOT running, NOT laughing, NOT in any action. Just standing.

BACKGROUND: 3-4 adult villagers (dark brown skin, VARIED ages and body types - one old thin man, one sturdy woman, etc.) standing normally with hands at their sides or clasped in front. Observing passively. NOT covering mouths, NOT whispering, NOT reacting.

CRITICAL RULES:
- Every single character must be in a NEUTRAL resting position
- NO pointed fingers, NO raised hands, NO covering mouths, NO running
- Thick black outlines on everything
- Warm sepia/aged paper background texture
- Chibi/simplified proportions with dot-eyes
- Flat color fills, no gradients, no glow effects
- No text, no letters, no writing, no signs, no banners visible ANYWHERE
- Muted earth tone palette: ochre, sienna, beige, indigo, terracotta
- All characters have dark brown skin (West African)"""

print(f"Generating scene2-humiliation-v2 with {MODEL}...")
print(f"Style ref: {REF_PATH}")
print(f"Output: {OUTPUT_PATH}")

response = client.models.generate_content(
    model=MODEL,
    contents=[ref_part, PROMPT],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

# Extract and save image
saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
        OUTPUT_PATH.write_bytes(part.inline_data.data)
        print(f"Saved: {OUTPUT_PATH}")
        saved = True
        break
    elif part.text:
        print(f"Text response: {part.text}")

if not saved:
    print("ERROR: No image generated")
    sys.exit(1)

print("Done.")
