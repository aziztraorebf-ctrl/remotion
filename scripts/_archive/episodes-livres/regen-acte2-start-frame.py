"""
Generate START frame for Acte 2 humiliation scene.
Matrone ALONE in village courtyard, no Sogolon, no villagers.
Uses end-frame-humiliation.png as ref for matrone identity.
"""
import os
import sys
from pathlib import Path
from google import genai
from google.genai import types

# Load API key
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Load reference image
ref_path = Path(__file__).resolve().parents[2] / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/end-frame-humiliation.png"
ref_bytes = ref_path.read_bytes()
ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/png")

prompt = """Generate a NEW image based on this reference. The woman on the LEFT side of the reference image is the subject.

SCENE: This woman is ALONE in a Mandinka village courtyard. She points her right index finger aggressively to the right (off-screen) with contempt. Her mouth is open in a mocking laugh, chin raised, left hand on her hip.

CHARACTER IDENTITY (MUST match the reference EXACTLY):
- The woman on the LEFT of the reference: same face, same age (~35-40), same dark brown skin tone
- Same blue-gray wrapped dress with geometric diamond/triangle patterns, one shoulder bare
- Same pearl/bead multi-strand necklace
- Same dark blue headwrap/turban
- Same sandals
- Same body proportions and build

COMPOSITION:
- Vertical 9:16 format (1080x1920)
- She is centered, full body visible, standing
- She is the ONLY person in the image
- NOBODY else visible — NO other women, NO children, NO Sogolon, NO crowd, NO silhouettes in background

BACKGROUND:
- Mandinka village: thatched-roof mud huts, ochre/terracotta earth ground
- Warm amber/orange sky matching the reference
- Palm trees and baobabs in the distance
- Same warm color palette as the reference image

STYLE: 2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors. Dark brown skin, West African, 13th century Mande Empire.

CRITICAL:
- The woman must be IDENTICAL to the left woman in the reference — same face, same age, same dress, same jewelry, same skin tone
- She must be completely ALONE — zero other people anywhere in the frame
- No text, no watermarks, no writing, no banners, no signs visible anywhere
- No other characters even partially visible or in silhouette"""

print("Generating start frame with Gemini 3.1 Flash Image...")
print(f"Ref: {ref_path}")
print(f"Prompt length: {len(prompt)} chars")

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[ref_part, prompt],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

# Extract and save image
output_path = Path(__file__).resolve().parents[2] / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/start-frame-humiliation.png"

image_saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
        output_path.write_bytes(part.inline_data.data)
        print(f"Image saved to: {output_path}")
        image_saved = True
        break
    elif part.text:
        print(f"Text response: {part.text}")

if not image_saved:
    print("ERROR: No image in response!")
    sys.exit(1)

print("Done!")
