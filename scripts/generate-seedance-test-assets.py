"""
Generate complementary assets for Seedance 2.0 test with Abou Bakari.
- Royal court / palace interior
- Royal throne
- Cinematic lighting mood reference

All in the same vector/flat style as existing Abou Bakari REFs.
"""

from google import genai
from google.genai import types
from pathlib import Path

API_KEY = "AIzaSyA0TxrLQQO06oRT9IE8L1RnAH-UI8MTTZM"
MODEL = "gemini-3.1-flash-image-preview"

OUTPUT_DIR = Path("public/assets/library/geoafrique/decors")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Load Abou Bakari REF for style consistency
REF_PATH = Path("public/assets/library/geoafrique/characters/abou-bakari/abou-bakari-roi-gros-plan-REF.png")
FLEET_REF = Path("public/assets/library/geoafrique/beats/beat03/beat03-startframe-v1.png")

client = genai.Client(api_key=API_KEY)


def load_image_part(path):
    with open(path, "rb") as f:
        data = f.read()
    return types.Part.from_bytes(data=data, mime_type="image/png")


def save_image(response, filename):
    output_path = OUTPUT_DIR / filename
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            with open(output_path, "wb") as f:
                f.write(part.inline_data.data)
            print(f"Saved: {output_path}")
            return output_path
    for part in response.candidates[0].content.parts:
        if part.text:
            print(f"Text response: {part.text[:300]}")
    print(f"ERROR: No image in response for {filename}")
    return None


def generate_asset(name, prompt, filename):
    print(f"\n--- Generating {name} ---")

    ref_char = load_image_part(REF_PATH)
    ref_fleet = load_image_part(FLEET_REF)

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Content(
                role="user",
                parts=[
                    ref_char,
                    ref_fleet,
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


STYLE_ANCHOR = (
    "Clean vector illustration style with flat color blocks, bold outlines, "
    "geometric African art-inspired patterns. Same art style as the reference images. "
    "Rich golden/ochre/earth tone palette. 16:9 landscape format."
)

# 1. Royal Court / Palace Interior
palace_result = generate_asset(
    "Royal Palace Interior",
    f"""These reference images show the art style I want you to match exactly.

Generate a WIDE INTERIOR VIEW of the royal palace of Niani, capital of the Mali Empire.

Scene: Grand audience hall with thick banco (mud-brick) columns,
arched doorways, geometric patterns carved into walls,
golden light streaming through openings,
rich textiles hanging from walls,
a central aisle leading to a raised platform where a throne would sit.
The room is majestic but grounded in West African architecture.

Style: {STYLE_ANCHOR}
No characters or people in the scene. Empty palace interior ready for compositing.
Wide shot, slightly low angle to emphasize grandeur.""",
    "palais-royal-niani-v1.png"
)

# 2. Royal Throne
throne_result = generate_asset(
    "Royal Throne",
    f"""These reference images show the art style I want you to match exactly.

Generate a CENTERED VIEW of a West African royal throne / seat of power.

Object: An ornate wooden throne carved from dark wood,
with gold leaf accents and geometric Mandinka patterns,
rich cushions in deep red/burgundy fabric,
flanked by two carved wooden posts with ancestral symbols,
placed on a raised platform with patterned tiles.

Style: {STYLE_ANCHOR}
Just the throne and its immediate surroundings. No people.
Clean background, centered composition, suitable as a prop reference for AI video generation.""",
    "trone-royal-mali-v1.png"
)

# 3. Cinematic Mood / Lighting Reference
mood_result = generate_asset(
    "Cinematic Mood Reference",
    f"""These reference images show the art style I want you to match exactly.

Generate a MOOD / ATMOSPHERE reference image for cinematic golden-hour lighting.

Scene: An abstract or semi-abstract composition showing warm golden light
filtering through a grand interior space. Dust particles visible in light beams.
Deep shadows contrasting with warm golden highlights.
Color palette: deep amber, burnt gold, warm brown shadows, touches of deep red.

Style: {STYLE_ANCHOR}
This image will be used as a lighting/color grading reference for AI video generation.
Focus on atmosphere and light quality rather than specific objects.
Dramatic, regal, cinematic feeling.""",
    "mood-golden-royal-v1.png"
)

print("\n=== Generation Complete ===")
for name, result in [("Palace", palace_result), ("Throne", throne_result), ("Mood", mood_result)]:
    status = "OK" if result else "FAILED"
    print(f"  {name}: {status}")
