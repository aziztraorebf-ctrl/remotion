"""
Generate start/end frames for Soundjata Acte 2 - Trou A (humiliation scene)
Uses gemini-3.1-flash-image-preview with frame-01.png as style anchor.
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

# Load reference image
REF_PATH = Path(__file__).resolve().parents[2] / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/frame-01.png"
ref_bytes = REF_PATH.read_bytes()
ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/png")

OUTPUT_DIR = REF_PATH.parent
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# --- Prompts ---

PROMPT_START = """Using the attached reference image as the EXACT style anchor (same 2D vivid flat anime illustration style, same color palette, same line weight, same cel-shaded flat colors), generate a NEW scene:

2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors. 9:16 vertical format (1080x1920).

Scene: a Mandinka village courtyard, 13th century West Africa. Warm afternoon light, ochre/earth tones, thatched round huts in background, one baobab tree.

CENTER: a tall imposing MATRONE (dark brown skin, West African features, blue robe with geometric patterns, dark blue headwrap) stands dominant, POINTING her finger downward with CONTEMPT, LAUGHING with chin raised high, mocking expression (80% cruel amusement, 20% superiority).

BACKGROUND: 2-3 village women of VARIED ages and body types (dark brown skin, West African) watch from behind, some whispering, some looking uncomfortable.

Sogolon is NOT visible in this shot. She is off-frame, being mocked from a distance.

CRITICAL: No text, no letters, no numerals, no watermarks, no modern clothing, no crown, no scepter visible anywhere. Pure illustration, no UI elements."""

PROMPT_END = """Using the attached reference image as the EXACT style anchor (same 2D vivid flat anime illustration style, same color palette, same line weight, same cel-shaded flat colors), generate a NEW scene:

2D vivid flat anime illustration, painted graphic novel, bold clean outlines, cel-shaded flat colors. 9:16 vertical format (1080x1920).

CLOSE-UP of two women facing each other in a Mandinka village, 13th century West Africa.

LEFT: the MATRONE (dark brown skin, West African features, blue robe with geometric patterns, dark blue headwrap) stands DOMINANT, chin raised, one hand on hip, eyes looking DOWN with CONTEMPT and SUPERIORITY (90% disdain, 10% cruel satisfaction). She towers over the other woman.

RIGHT: SOGOLON (dark brown skin, turquoise/teal draped garment, modest headwrap) stands DEFEATED, head BOWED DOWN, shoulders HUNCHED and curved inward, eyes cast DOWN to the ground, expression of DEEP HUMILIATION and SHAME (80% humiliation, 20% quiet pain). Her posture is small, crushed, submissive.

Power dynamic CLEAR and EXAGGERATED: matrone towers with authority, Sogolon shrinks with shame. The height difference and body language must make the dominance obvious.

Village huts BLURRED in far background. Warm ochre afternoon light.

CRITICAL: No text, no letters, no numerals, no watermarks, no modern clothing, no crown, no scepter visible anywhere. Pure illustration, no UI elements."""

def generate_image(prompt: str, output_name: str):
    """Generate an image with Gemini Flash Image using ref as style anchor."""
    print(f"\n--- Generating {output_name} ---")

    response = client.models.generate_content(
        model=MODEL,
        contents=[ref_part, prompt],
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    # Extract image from response
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            out_path = OUTPUT_DIR / output_name
            out_path.write_bytes(part.inline_data.data)
            print(f"Saved: {out_path}")

            # Save prompt sidecar
            prompt_path = OUTPUT_DIR / f"{Path(output_name).stem}.prompt.txt"
            prompt_path.write_text(prompt)
            print(f"Prompt saved: {prompt_path}")
            return True
        elif part.text:
            print(f"Text response: {part.text}")

    print(f"ERROR: No image returned for {output_name}")
    return False

if __name__ == "__main__":
    print(f"Model: {MODEL}")
    print(f"Ref: {REF_PATH}")
    print(f"Output dir: {OUTPUT_DIR}")

    ok1 = generate_image(PROMPT_START, "start-frame-humiliation.png")
    ok2 = generate_image(PROMPT_END, "end-frame-humiliation.png")

    if ok1 and ok2:
        print("\n=== Both images generated successfully ===")
    else:
        print("\n=== Some generations failed ===")
        sys.exit(1)
