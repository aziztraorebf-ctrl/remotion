"""
Generate consolidated character sheet for Abou Bakari.
One image with multiple views: front, profile, 3/4, back, standing full body.
Saves 4 image slots on Seedance 2.0 (1 image instead of 5).
"""

from google import genai
from google.genai import types
from pathlib import Path

API_KEY = "AIzaSyA0TxrLQQO06oRT9IE8L1RnAH-UI8MTTZM"
MODEL = "gemini-3.1-flash-image-preview"

CHAR_DIR = Path("public/assets/library/geoafrique/characters/abou-bakari")

client = genai.Client(api_key=API_KEY)


def load_image_part(path):
    with open(path, "rb") as f:
        return types.Part.from_bytes(data=f.read(), mime_type="image/png")


def save_image(response, output_path):
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            with open(output_path, "wb") as f:
                f.write(part.inline_data.data)
            print(f"Saved: {output_path} ({len(part.inline_data.data)} bytes)")
            return output_path
    for part in response.candidates[0].content.parts:
        if part.text:
            print(f"Text: {part.text[:300]}")
    return None


# Load all existing refs as context
refs = [
    load_image_part(CHAR_DIR / "abou-bakari-roi-gros-plan-REF.png"),
    load_image_part(CHAR_DIR / "abou-bakari-westlook-v3.png"),
    load_image_part(CHAR_DIR / "abou-bakari-three-quarter-v1.png"),
    load_image_part(CHAR_DIR / "abou-bakari-back-view-v1.png"),
    load_image_part(CHAR_DIR / "abou-bakari-standing-v1.png"),
]

print("--- Generating Character Sheet ---")

response = client.models.generate_content(
    model=MODEL,
    contents=[
        types.Content(
            role="user",
            parts=[
                *refs,
                types.Part.from_text(text="""These 5 reference images all show the same character: African king Abou Bakari II.

Create a SINGLE CHARACTER SHEET / TURNAROUND SHEET combining all views of this character on ONE image.

Layout: horizontal row of 5 poses on a clean white background, evenly spaced:
1. FRONT VIEW (bust/shoulders up, looking at camera)
2. THREE-QUARTER VIEW (bust, slightly turned right)
3. SIDE PROFILE VIEW (bust, facing left)
4. BACK VIEW (bust, seen from behind)
5. FULL BODY STANDING (head to feet, commanding regal pose)

Character: dark brown skin, short black goatee beard, tall golden kufi hat with geometric diamond patterns, golden ochre royal robes with embroidered vertical patterns.

Style: EXACTLY matching the reference images - clean vector illustration, flat color blocks, bold outlines, geometric African art-inspired. Professional character sheet layout.

CRITICAL RULES:
- All 5 poses must be clearly the SAME person with identical features
- White/light background, no other elements
- Each pose clearly separated with consistent proportions
- Landscape/wide format to fit all 5 poses in a row
- This is a professional reference sheet for animation/video production"""),
            ]
        )
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
        temperature=0.3,
    )
)

result = save_image(response, CHAR_DIR / "abou-bakari-character-sheet-v1.png")
print(f"\nResult: {'OK' if result else 'FAILED'}")
