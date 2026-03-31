"""
Generate Abou Bakari standing pose for Seedance 2.0 motion test.
He needs to go from seated (throne) to standing, so we need a standing ref.
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
            print(f"Saved: {output_path}")
            return output_path
    for part in response.candidates[0].content.parts:
        if part.text:
            print(f"Text: {part.text[:200]}")
    return None


# Load existing refs
ref_front = load_image_part(CHAR_DIR / "abou-bakari-roi-gros-plan-REF.png")
ref_large = load_image_part(CHAR_DIR / "abou-bakari-roi-plan-large-REF.png")
ref_quarter = load_image_part(CHAR_DIR / "abou-bakari-three-quarter-v1.png")

# Generate standing full-body pose
print("--- Generating standing pose ---")

response = client.models.generate_content(
    model=MODEL,
    contents=[
        types.Content(
            role="user",
            parts=[
                ref_front,
                ref_large,
                ref_quarter,
                types.Part.from_text(text="""Look at these reference images of African king Abou Bakari II.

Generate a FULL BODY view of this EXACT same character STANDING UPRIGHT with a commanding posture.

He has just risen from his throne. His posture is regal and determined.
His right hand is slightly extended forward in a gesture of authority.
He stands tall, looking slightly to the right, chin up.

Character: dark brown skin, short black goatee beard, golden kufi hat with geometric diamond patterns,
golden ochre royal robes with vertical embroidered patterns.

Style: EXACTLY the same clean vector illustration with flat color blocks, bold outlines,
geometric African art-inspired patterns as the reference images.
White or very light plain background.
Full body from head to feet, centered composition."""),
            ]
        )
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
        temperature=0.4,
    )
)

result = save_image(response, CHAR_DIR / "abou-bakari-standing-v1.png")
print(f"\nResult: {'OK' if result else 'FAILED'}")
