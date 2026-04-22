"""
Generate start and end frames for Trou A (humiliation scene)
using Gemini with acte2 frame-01 as style/character reference.

Start frame: Matrone mocks Soundjata, pointing down with contempt
End frame: Matrone confronts Sogolon face-to-face, Sogolon humiliated
"""

import os
import sys
import base64
from pathlib import Path
from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not set in environment")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
MODEL = "gemini-2.5-flash-preview-04-17"

REF_PATH = Path(
    "public/assets/library/geoafrique/heros-oublies/soundjata"
    "/refs/acte2/frame-01.png"
)
OUT_DIR = Path(
    "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2"
)
OUT_DIR.mkdir(parents=True, exist_ok=True)

ref_bytes = REF_PATH.read_bytes()
ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/png")

# --- START FRAME ---
start_prompt = """Using the attached image as EXACT style reference (2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors, warm ochre/earth tones, African village background with huts and palm trees):

Generate a NEW image in the SAME style showing:

SCENE: A royal courtyard in a 13th century Mandinka village. Warm afternoon light, ochre earth, thatched huts in background.

The woman in BLUE PATTERNED dress and DARK BLUE headwrap (the matrone/first wife) stands in the center of the courtyard. She is POINTING DOWN with her right hand toward the ground, LAUGHING with contempt, chin raised. Her body language radiates superiority and mockery.

Behind her, 2-3 village women of varying ages watch the scene — some amused, some uncomfortable.

The woman in TURQUOISE dress (Sogolon) is NOT visible in this shot — she hasn't arrived yet.

9:16 vertical format. Dark skin for all characters (West African, 13th century Mande). NO text, NO watermarks, NO modern clothing."""

print("[1/2] Generating START frame (matrone mocks)...")
start_response = client.models.generate_content(
    model=MODEL,
    contents=[ref_part, start_prompt],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

start_saved = False
for part in start_response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
        out_path = OUT_DIR / "start-frame-humiliation.png"
        out_path.write_bytes(part.inline_data.data)
        print(f"  Saved: {out_path} ({out_path.stat().st_size // 1024} KB)")
        start_saved = True
    elif part.text:
        print(f"  Gemini note: {part.text[:200]}")

if not start_saved:
    print("  ERROR: no image generated for start frame")
    sys.exit(1)

# --- END FRAME ---
end_prompt = """Using the attached image as EXACT style reference (2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors, warm ochre/earth tones, African village background with huts and palm trees):

Generate a NEW image in the SAME style showing:

SCENE: Same royal courtyard, 13th century Mandinka village. Warm afternoon light.

CLOSE-UP of TWO WOMEN face to face:
- LEFT: The woman in BLUE PATTERNED dress and DARK BLUE headwrap (matrone/first wife). She stands tall, chin raised, looking DOWN at the other woman with undisguised contempt and superiority. One hand on her hip.
- RIGHT: The woman in TURQUOISE dress and TURQUOISE headwrap (Sogolon, mother of Soundjata). She has her HEAD BOWED, shoulders slumped, eyes looking at the ground. Expression of deep shame and humiliation. She appears smaller, defeated.

The power dynamic is CLEAR: the matrone DOMINATES, Sogolon is CRUSHED.

Village huts blurred in background. 9:16 vertical format. Dark skin for both (West African, 13th century Mande). NO text, NO watermarks, NO modern clothing. NO tears — just body language of humiliation."""

print("[2/2] Generating END frame (matrone confronts Sogolon)...")
end_response = client.models.generate_content(
    model=MODEL,
    contents=[ref_part, end_prompt],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

end_saved = False
for part in end_response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
        out_path = OUT_DIR / "end-frame-humiliation.png"
        out_path.write_bytes(part.inline_data.data)
        print(f"  Saved: {out_path} ({out_path.stat().st_size // 1024} KB)")
        end_saved = True
    elif part.text:
        print(f"  Gemini note: {part.text[:200]}")

if not end_saved:
    print("  ERROR: no image generated for end frame")
    sys.exit(1)

print()
print("Done! Both frames saved to:")
print(f"  START: {OUT_DIR / 'start-frame-humiliation.png'}")
print(f"  END:   {OUT_DIR / 'end-frame-humiliation.png'}")
