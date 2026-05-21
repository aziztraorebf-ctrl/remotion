"""
Generate 5-panel storyboard for Soundjata Acte II - Humiliation scene.
5 panels stacked vertically (9:16), black and white sketch style.
Model: gemini-2.0-flash-exp (fast, free for generation).
"""

import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

# Setup
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not set")
    sys.exit(1)

client = genai.Client(api_key=api_key)

output_path = Path("/Users/clawdbot/Workspace/remotion/public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/storyboard-5panels-humiliation.png")

prompt = """Create a BLACK AND WHITE SKETCH storyboard with EXACTLY 5 panels stacked VERTICALLY (one on top of the other, portrait layout 9:16 ratio for the whole image). Each panel shows a different camera angle for a scene of public humiliation in a 13th century West African Mandinka village.

The 5 panels from top to bottom:

PANEL 1 - LOW ANGLE: A toddler (age 2-3) on his hands and knees on cracked dusty ground. He crawls forward with determination, brow furrowed. Village huts and baobab trees visible behind him. Camera at ground level looking up slightly.

PANEL 2 - MEDIUM SHOT: A tall imposing woman (the MATRONE) stands center frame, chin raised, left hand on hip, right hand pointing downward with contempt. Behind her, 3 village women of VARIED ages and body types watch - one covers mouth in shock, one looks away clutching a basket, one stares with arms crossed.

PANEL 3 - OVER-THE-SHOULDER: View from behind the Matrone (her back and headwrap fill the left edge of frame). Facing camera: a slender woman (SOGOLON) with head bowed, shoulders hunched, hands clasped at waist. Villagers visible in background forming a loose circle.

PANEL 4 - EXTREME CLOSE-UP: The Matrone face filling the frame. Mouth wide open in mocking cruel laughter, teeth visible. Eyes narrowed. Right hand raised with index finger jabbing the air. Headwrap fills top of frame.

PANEL 5 - LOW ANGLE DRAMATIC: Sogolon in left third of frame in profile, one tear on her cheek, hand gripping fabric at her chest. In the right background, the Matrone as a dark silhouette turns away dismissively. Sky visible behind them.

STYLE: Rough pencil/ink sketch, black lines on white, like a film storyboard. NO color. NO text. NO labels. NO panel numbers. Clear bold linework showing composition and framing. Each panel separated by a thin black line.

CRITICAL: EXACTLY 5 panels, stacked VERTICALLY in a single column. NOT a grid. NOT 2x3. NOT side by side. 5 panels in ONE VERTICAL COLUMN, top to bottom. The overall image should be taller than wide (portrait orientation).

No text, no letters, no numerals visible anywhere in the image."""

print("Generating storyboard with gemini-3.1-flash-image-preview...")
print(f"Prompt length: {len(prompt)} chars")

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

# Extract image
image_saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data is not None:
        image_data = part.inline_data.data
        output_path.write_bytes(image_data)
        print(f"Storyboard saved to: {output_path}")
        print(f"Size: {len(image_data)} bytes")
        image_saved = True
        break
    elif part.text is not None:
        print(f"Text response: {part.text[:200]}")

if not image_saved:
    print("ERROR: No image generated")
    sys.exit(1)

print("Done!")
