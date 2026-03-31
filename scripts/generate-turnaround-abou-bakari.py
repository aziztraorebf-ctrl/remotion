"""
Generate missing turnaround views for Abou Bakari using Gemini 3.1 Flash Image.
Existing: front face (gros-plan-REF) + profile/west-look (westlook-v3)
Missing: 3/4 view + back view

Uses existing REFs as identity anchors to maintain style consistency.
"""

import os
from google import genai
from google.genai import types
from pathlib import Path
import base64
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

# Config - API key from .env
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-3.1-flash-image-preview"
OUTPUT_DIR = Path("public/assets/library/geoafrique/characters/abou-bakari")

# Load existing REFs as identity anchors
REF_FRONT = OUTPUT_DIR / "abou-bakari-roi-gros-plan-REF.png"
REF_PROFILE = OUTPUT_DIR / "abou-bakari-westlook-v3.png"
REF_LARGE = OUTPUT_DIR / "abou-bakari-roi-plan-large-REF.png"

client = genai.Client(api_key=API_KEY)


def load_image_part(path):
    """Load image as Part for Gemini API."""
    with open(path, "rb") as f:
        data = f.read()
    return types.Part.from_bytes(data=data, mime_type="image/png")


def save_image(response, filename):
    """Extract and save image from Gemini response."""
    output_path = OUTPUT_DIR / filename
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            with open(output_path, "wb") as f:
                f.write(part.inline_data.data)
            print(f"Saved: {output_path}")
            return output_path
    # Check for text response
    for part in response.candidates[0].content.parts:
        if part.text:
            print(f"Text response: {part.text[:200]}")
    print(f"ERROR: No image in response for {filename}")
    return None


def generate_view(view_name, prompt, filename):
    """Generate a single view using Gemini with REF images."""
    print(f"\n--- Generating {view_name} ---")

    ref_front = load_image_part(REF_FRONT)
    ref_profile = load_image_part(REF_PROFILE)
    ref_large = load_image_part(REF_LARGE)

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Content(
                role="user",
                parts=[
                    ref_front,
                    ref_profile,
                    ref_large,
                    types.Part.from_text(text=prompt),
                ]
            )
        ],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
            temperature=0.4,
        )
    )

    return save_image(response, filename)


# Character description for consistency
CHARACTER_DESC = (
    "African king Abou Bakari II, dark brown skin, short black beard with goatee, "
    "wearing a tall golden kufi/crown hat with geometric diamond patterns, "
    "golden/ochre royal robes with vertical embroidered lines, "
    "dignified neutral expression, strong jaw, brown eyes"
)

STYLE_DESC = (
    "Clean vector illustration style with flat color blocks, bold outlines, "
    "geometric shapes, African art-inspired. Consistent with the reference images provided. "
    "Plain white background. Full body or bust portrait matching the reference proportions."
)

# View 1: Three-quarter view (3/4)
three_quarter_result = generate_view(
    "3/4 view",
    f"""Look at these three reference images of the same character - an African king named Abou Bakari II.

I need you to generate a THREE-QUARTER VIEW (3/4 angle, facing slightly to the right) of this EXACT same character.

Character details: {CHARACTER_DESC}
Style: {STYLE_DESC}

CRITICAL: Match the EXACT same art style, color palette, line weight, and level of detail as the reference images.
The character must be immediately recognizable as the same person.
Show from chest/shoulders up, similar framing to the front-facing reference.
White or very light plain background.""",
    "abou-bakari-three-quarter-v1.png"
)

# View 2: Back view
back_result = generate_view(
    "back view",
    f"""Look at these three reference images of the same character - an African king named Abou Bakari II.

I need you to generate a BACK VIEW (seen from behind) of this EXACT same character.

Character details: {CHARACTER_DESC}
Style: {STYLE_DESC}

CRITICAL: Match the EXACT same art style, color palette, line weight, and level of detail as the reference images.
Show the back of the golden kufi hat with its geometric patterns, the back of the golden robes.
Show from chest/shoulders up, similar framing to the other references.
White or very light plain background.
The character should be recognizable from behind by his distinctive hat and robes.""",
    "abou-bakari-back-view-v1.png"
)

# Summary
print("\n=== Generation Complete ===")
results = {
    "3/4 view": three_quarter_result,
    "back view": back_result,
}
for view, path in results.items():
    status = "OK" if path else "FAILED"
    print(f"  {view}: {status}")
