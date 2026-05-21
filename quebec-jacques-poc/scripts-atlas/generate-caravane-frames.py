"""Generate 2 additional frames of caravane chibi (walk cycle).

Uses original transparent caravane as STYLE reference. Produces frames B and C
showing camel legs in different walking positions, identical character + costume
to maintain consistency.
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

REF_PATH = ROOT / "quebec-jacques-poc" / "public" / "atlas-mansa-moussa" / "v2" / "chibi" / "caravane-transparent.png"

OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "v2" / "chibi"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT_BASE = """Use the reference image as the EXACT character + costume + style guide. The character (Mande rider on camel) and his outfit MUST stay IDENTICAL: same blue turban, same indigo robes, same cream undershirt, same brown saddle, same beige camel.

Generate the SAME character + camel in a DIFFERENT walking pose:

{POSE_INSTRUCTIONS}

Critical:
- Same character identity (face, costume, colors)
- Same side view facing right
- Same chibi proportions
- TRANSPARENT BACKGROUND (no checkered, no gray, no white, no parchment)
- No additional elements, no scenery, no shadow on ground
- Only the character + camel centered

Aspect: 1024x1024 square."""

POSES = [
    {
        "label": "B-walk-mid",
        "instructions": """Walking pose B (mid-stride):
- Camel front-right leg LIFTED up forward
- Camel back-left leg LIFTED up
- Other 2 legs planted on ground
- Body slightly tilted (mid-step momentum)
- Rider keeps same pose""",
    },
    {
        "label": "C-walk-other",
        "instructions": """Walking pose C (alternate stride):
- Camel front-LEFT leg LIFTED up forward
- Camel back-RIGHT leg LIFTED up
- Other 2 legs planted on ground
- Body slightly tilted opposite from pose B
- Rider keeps same pose""",
    },
]


def generate_frame(label: str, instructions: str) -> int:
    out_file = OUT_DIR / f"caravane-{label}.png"
    print(f"=== {label} ===")
    ref_bytes = REF_PATH.read_bytes()
    prompt = PROMPT_BASE.replace("{POSE_INSTRUCTIONS}", instructions)
    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
            prompt,
        ],
        config=types.GenerateContentConfig(response_modalities=["image", "text"]),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            out_file.write_bytes(part.inline_data.data)
            print(f"OK saved {out_file.name} ({len(part.inline_data.data)/1024:.1f} KB)")
            return 0
        elif part.text:
            print(f"  Text: {part.text}")
    print(f"ERROR: no image for {label}")
    return 1


def main():
    print(f"Reference: {REF_PATH.name}")
    print(f"Total cost preview: ~$0.14 (2x $0.07)")
    print()
    for pose in POSES:
        generate_frame(pose["label"], pose["instructions"])


if __name__ == "__main__":
    main()
