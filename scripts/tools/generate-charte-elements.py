"""
Generate individual Charte du Manden elements for Remotion overlay.
Each element on pure white background -> PIL white-to-transparent.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image
import io

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUTPUT_DIR = Path(__file__).parent.parent.parent / "public" / "assets" / "library" / "geoafrique" / "heros-oublies" / "soundjata" / "charte"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

STYLE_PREAMBLE = """An ancient West African petroglyph / rock art icon, ochre and dark brown ink style, carved-in look.
Style: painted 2D illustration, bold outlines, flat fills, graphic novel aesthetic. Match the aesthetic of Mandinka-era pictograms.
CRITICAL: pure white background (#FFFFFF) — absolutely no other colors in the background.
No shadows, no gradients, no decorations outside the main icon. Centered composition, single icon only.
FORMAT: 1024x1024 square, the icon takes roughly 60-70% of the frame, centered.
No text, no letters, no numerals visible anywhere."""

ELEMENTS = {
    "icon-01-life": f"""{STYLE_PREAMBLE}

SUBJECT: A single human silhouette figure with a small circle (heart symbol) at chest level.
The figure is drawn frontally, symmetrical, with arms held slightly out from the body.
Warm ochre color for the figure, dark brown for outline details.
Represents the RIGHT TO LIFE.""",

    "icon-02-protection": f"""{STYLE_PREAMBLE}

SUBJECT: A single stylized female figure with both arms raised above her head in a protective gesture.
The figure has clearly feminine form (wider hips, rounded silhouette) drawn in ancient African rock art style.
Warm ochre color for the figure, dark brown for outline details.
Represents PROTECTION OF WOMEN.""",

    "icon-03-dignity": f"""{STYLE_PREAMBLE}

SUBJECT: Two open hands side by side, palms up, with broken chains falling away from the wrists.
The chain links are clearly broken — some falling downward. The hands are strong, open, free.
Warm ochre color for the hands, dark brown for outline details and chains.
Represents DIGNITY OF CAPTIVES / FREEDOM.""",

    "medallion-mali": f"""An ancient circular medallion or seal, gold and ochre colors, featuring a stylized African throne with a baobab tree behind it.
The medallion has a decorative circular frame with small geometric Mandinka patterns along the edge.
Style: painted 2D illustration, bold outlines, graphic novel aesthetic.
CRITICAL: pure white background (#FFFFFF) — absolutely no other colors in the background.
No shadows, no gradients outside the medallion.
FORMAT: 1024x1024 square, the medallion takes roughly 80% of the frame, centered.
No text, no letters, no numerals visible anywhere.""",

    "medallion-west": f"""An ancient circular medallion or seal, cool silver-grey and aged parchment colors, featuring a stylized classical rolled scroll with a dove above it.
The medallion has a decorative circular frame with small classical geometric patterns along the edge.
Style: painted 2D illustration, bold outlines, graphic novel aesthetic.
CRITICAL: pure white background (#FFFFFF) — absolutely no other colors in the background.
No shadows, no gradients outside the medallion.
FORMAT: 1024x1024 square, the medallion takes roughly 80% of the frame, centered.
No text, no letters, no numerals visible anywhere.""",
}


def white_to_transparent(png_bytes: bytes, threshold: int = 240) -> bytes:
    """Convert pure white pixels to transparent."""
    img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        r, g, b, a = item
        if r > threshold and g > threshold and b > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    out = io.BytesIO()
    img.save(out, format="PNG")
    return out.getvalue()


def generate(element_id: str, prompt: str) -> Path | None:
    print(f"\n--- {element_id} ---")

    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt],
        config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
    )

    image_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
            break

    if not image_bytes:
        print(f"  FAIL: no image")
        return None

    # Save raw version
    raw_path = OUTPUT_DIR / f"{element_id}-raw.png"
    raw_path.write_bytes(image_bytes)

    # Save transparent version
    transparent_bytes = white_to_transparent(image_bytes)
    out_path = OUTPUT_DIR / f"{element_id}.png"
    out_path.write_bytes(transparent_bytes)
    print(f"  OK: {out_path.name} ({len(transparent_bytes) // 1024}KB)")
    return out_path


if __name__ == "__main__":
    print("=" * 60)
    print("Soundjata Charte — individual elements (transparent PNG)")
    print("=" * 60)

    to_gen = ELEMENTS
    if len(sys.argv) > 1:
        requested = set(sys.argv[1:])
        to_gen = {k: v for k, v in ELEMENTS.items() if k in requested}

    for element_id, prompt in to_gen.items():
        generate(element_id, prompt)

    print(f"\nOutput: {OUTPUT_DIR}")
