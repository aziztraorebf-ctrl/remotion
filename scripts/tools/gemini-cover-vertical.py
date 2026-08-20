"""
Gemini 3.1 Flash Image -- recomposition verticale (9:16) d'un thumbnail 16:9 existant,
pour usage cover B (image inseree en tete des Shorts, cf memory/tools/trypost.md).

Usage:
    python3 scripts/tools/gemini-cover-vertical.py \
        --input public/_shared/thumbnails-library/senegal-petrole-gaz/senegal-piege-baril.png \
        --output out/_r-and-d/covers-vertical/senegal-cover-vertical-raw.png \
        --brief senegal
"""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
import sys as _sys
from pathlib import Path as _Path
_sys.path.insert(0, str(_Path(__file__).resolve().parent))
from gemini_models import IMAGE_MODEL

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY missing")
    sys.exit(1)

MODEL = IMAGE_MODEL

COMMON_RULES = """
This source image is a landscape 16:9 YouTube thumbnail (1920x1080), already validated and published.
Recompose it as a PORTRAIT 9:16 image (1080x1920 ratio) for a YouTube Short / Instagram Reel cover frame.

STRICT RULES:
- Do NOT invent new elements, do NOT change the color palette, do NOT change any text content or wording.
- Keep the exact same font style, exact same French text and accents, exact same colors as the source.
- This is a RECOMPOSITION of existing elements into a new layout, not a redesign. Every visual element from
  the source (icons, objects, map, text block) must still be present, just rearranged to fill a tall
  vertical frame instead of a wide horizontal one -- typically stacking what was side-by-side.
  Elements that were small in the wide frame can be scaled up to better fill the vertical space, but must
  keep their original proportions and details.
- No added logos, no added watermarks, no sparkle/star artifacts in corners.
- Keep the same dark navy background color as the source, extended/filled naturally to cover the full
  vertical frame (no white bars, no letterboxing, no empty bands top or bottom).
"""

BRIEFS = {
    "senegal": COMMON_RULES + """
SOURCE COMPOSITION: title text "PÉTROLE : LE PIÈGE SÉNÉGALAIS ?" top-left in white/gold, a chained oil
barrel with red "132%" LED display center-left, and an outlined map of Senegal with "Dakar" marker
center-right.

VERTICAL RECOMPOSITION: stack the elements top to bottom -- title text band at the TOP (can wrap to 2-3
lines, keep readable size), the chained oil barrel with the 132% display as the large CENTRAL focal
element, the Senegal map outline with Dakar marker BELOW or partially behind/around the barrel, smaller
but still clearly legible. Overall feel: one strong vertical read, barrel dominates the frame.
""",
    "aes": COMMON_RULES + """
SOURCE COMPOSITION: title text "SAHEL : LA RUPTURE" at the top (gold "SAHEL :" + red gradient "LA
RUPTURE"), a cracked/fractured map of the Sahel AES countries with the real AES seal (confederation
emblem, red/green/gold circular seal with baobab tree) at the center, gold bars/star and resource icons
(oil drops, atom/uranium symbols) bursting outward from the cracks.

VERTICAL RECOMPOSITION: title text band at the TOP, the cracked map + AES seal as the large CENTRAL
focal element (the seal can be enlarged slightly since there is more vertical room), the resource icons
(gold bars, oil drops, atom symbols) redistributed around the crack lines above and below center to fill
the tall frame -- maintain the radiating/bursting-outward energy of the original, just reoriented to
radiate up and down instead of only sideways.
""",
    "cfa": COMMON_RULES + """
SOURCE COMPOSITION: a stopped clock at midnight (hands pointing straight up) with a torn banknote
("10 000" note ripped in two, left half attached to the clock face, right half falling away) on the
left/center, and text "FRANC CFA" (gold, small caps) + "Divisé par deux en une nuit" (large cream serif,
two lines) on the right side.

VERTICAL RECOMPOSITION: the clock with the torn banknote becomes the large CENTRAL focal element (can be
enlarged to dominate the upper-middle of the frame), the text block "FRANC CFA" + "Divisé par deux en une
nuit" moves BELOW the clock, centered, same font and gold/cream color treatment as source. Keep the
radial vignette glow behind the clock, extended to fit the taller frame.
""",
}


def recompose(input_path: Path, output_path: Path, brief_key: str) -> int:
    if brief_key not in BRIEFS:
        print(f"ERROR: brief '{brief_key}' not found. Available: {list(BRIEFS.keys())}")
        return 1
    if not input_path.exists():
        print(f"ERROR: input file not found: {input_path}")
        return 1

    image_bytes = input_path.read_bytes()
    print(f"Input: {input_path.name} ({len(image_bytes) // 1024} KB)")
    print(f"Brief: {brief_key}")
    print("[COST PREVIEW] ~$0.04 (gemini-3.1-flash-image, 1 image i2i call)")
    print()

    client = genai.Client(api_key=API_KEY)

    parts = [
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        types.Part.from_text(text=BRIEFS[brief_key]),
    ]

    print("Generating vertical recomposition (Gemini 3.1 Flash Image)...")
    response = client.models.generate_content(
        model=MODEL,
        contents=parts,
        config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
    )

    if not response.candidates or not response.candidates[0].content.parts:
        print("ERROR: Gemini refused to generate. Try reformulating the brief.")
        return 1

    image_saved = False
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(part.inline_data.data)
            size_kb = len(part.inline_data.data) // 1024
            print(f"OK {output_path} ({size_kb} KB)")
            image_saved = True
        elif hasattr(part, "text") and part.text:
            print(f"[Gemini note] {part.text[:300]}")

    if not image_saved:
        print("ERROR: no image in response")
        return 1
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--brief", required=True, choices=list(BRIEFS.keys()), metavar="BRIEF")
    args = parser.parse_args()
    sys.exit(recompose(Path(args.input), Path(args.output), args.brief))


if __name__ == "__main__":
    main()
