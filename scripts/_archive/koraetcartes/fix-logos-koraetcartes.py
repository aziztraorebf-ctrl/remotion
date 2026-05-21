"""
Surgical edits for Kora & Cartes logos B and C.
Logo B v2: kora with ONE neck only (not two side handles).
Logo C v2: fix the right letter to look like a clean C (currently looks like G).
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

OUT_DIR = ROOT / "branding" / "koraetcartes"


def load_image(path: Path) -> types.Part:
    data = path.read_bytes()
    return types.Part.from_bytes(data=data, mime_type="image/png")


def edit(source: Path, prompt: str, output_name: str):
    print(f"\n{'='*70}")
    print(f"Editing: {source.name} -> {output_name}")
    print(f"{'='*70}")
    response = client.models.generate_content(
        model=MODEL,
        contents=[load_image(source), prompt],
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )
    output_path = OUT_DIR / output_name
    saved = False
    for part in response.candidates[0].content.parts:
        if getattr(part, "inline_data", None) is not None:
            output_path.write_bytes(part.inline_data.data)
            print(f"  -> Saved: {output_path}")
            saved = True
        elif getattr(part, "text", None):
            print(f"  Text: {part.text[:200]}")
    return output_path if saved else None


LOGO_B_FIX = """Edit this image with ONE correction only -- change nothing else.

PRESERVE EXACTLY:
- The circular medallion shape and its copper outer ring
- The deep midnight indigo background inside the circle
- The silhouette of the African continent in copper/orange tone
- The cream background outside the medallion
- The wordmark "Kora & Cartes" in serif typeface below
- All colors and overall composition
- The position and scale of the kora instrument (still centered, vertical, large)

CHANGE ONLY:
The kora instrument currently has TWO side handles/posts on either side of the
calabash gourd, plus the central neck. This is anatomically incorrect.
Replace with a CORRECT kora design: ONE single long vertical neck rising from
the top of the calabash gourd, with the strings running parallel along that
single neck. NO side handles. NO secondary posts. Just one central long neck
with strings. The calabash gourd at the bottom stays the same round shape.
Keep the same indigo + copper color scheme on the instrument.

CRITICAL: Only fix the kora anatomy. Everything else must remain pixel-identical
to the source image. Do not change the wordmark, the continent, the medallion,
the colors, or the composition."""


LOGO_C_FIX = """Edit this image with ONE correction only -- change nothing else.

PRESERVE EXACTLY:
- The cream background
- The capital letter K on the left (ornate calligraphic serif, deep indigo)
- The decorative ampersand "&" in the center (copper color)
- The wordmark "Kora & Cartes" in serif typeface below the monogram
- All colors, the indigo/copper palette
- The overall ornate calligraphic style and elegance
- The size and position of all elements

CHANGE ONLY:
The capital letter on the RIGHT side of the monogram currently has a closed
loop that makes it look like the letter G or a closed-off shape, not a clean C.
Redraw that right letter as a CLEAN, OPEN, ornate calligraphic capital C.
The C must have:
- An open mouth on the right side (NOT closed, NOT a loop, NOT a G)
- The same ornate serif/calligraphic style as the K on the left
- The same deep indigo color
- The same proportions and decorative flourishes as the K
- Mirror-image elegance with the K

CRITICAL: Only fix the right letter to be an unambiguous C. Everything else
must remain pixel-identical. The K, the ampersand, the wordmark below, the
colors, and the cream background must all stay exactly as they are."""


def main():
    logo_b_src = OUT_DIR / "logo-B-carte-kora.png"
    logo_c_src = OUT_DIR / "logo-C-monogramme-KC.png"

    edit(logo_b_src, LOGO_B_FIX, "logo-B-carte-kora-v2.png")
    edit(logo_c_src, LOGO_C_FIX, "logo-C-monogramme-KC-v2.png")

    print("\n" + "=" * 70)
    print("DONE")
    print("=" * 70)


if __name__ == "__main__":
    main()
