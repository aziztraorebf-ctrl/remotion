"""Generate 2 Tombouctou icons for Atlas Mansa Moussa V2 BLOC 2 (S2).
Replaces Iconify generic icons with custom Gemini illustrations.
Style: papercraft / hand-drawn stylized, palette Atlas (cream + terracotta + indigo + gold).
Output: PNG with solid background, then chroma-keyed to RGBA transparent via PIL.

Cost: ~$0.07 x 2 = $0.14
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

OUT_DIR = ROOT / "quebec-jacques-poc" / "public" / "atlas-mansa-moussa" / "assets"
OUT_DIR.mkdir(parents=True, exist_ok=True)

CHROMA_BG_HEX = "#1F2A4A"
CHROMA_BG_RGB = (0x1F, 0x2A, 0x4A)


PROMPT_BOOK = """Generate a stylized illustration of an open medieval Islamic manuscript / codex book — symbolic of Timbuktu's library culture.

Style requirements:
- Flat 2D papercraft illustration, NO 3D rendering, NO photorealism
- Hand-drawn stylized line art with flat color fills
- Color palette ONLY:
  * Warm cream / aged parchment (#F2E5C8) for the open pages
  * Terracotta orange (#A85A3A) for the leather cover
  * Dark indigo / black ink (#1F2A4A) for outlines and Arabic-style abstract script lines
  * Gold (#D4A574) for decorative ornaments / illuminations
- Solid indigo blue background (#1F2A4A) filling the entire canvas — the indigo IS the background

Composition:
- Open book viewed from slightly above (3/4 perspective acceptable)
- Two open pages visible, with abstract horizontal lines suggesting Arabic calligraphy (NOT real letters, just suggestive horizontal strokes)
- A small gold ornament / arabesque on each page
- Book is centered, takes ~65% of canvas
- Symmetric, balanced composition

Critical:
- NO real text, NO real letters, NO real Arabic calligraphy (just abstract suggestive lines)
- NO people, NO hands, NO landscape, NO table or surface (book floats centered)
- NO atmospheric effects, NO shadows on the background
- Sharp clean lines, suitable as a small icon (~200x200 display)
- Solid indigo (#1F2A4A) IS the entire background — uniform color, no gradient

Format: 1024x1024, PNG with solid indigo background."""


PROMPT_MOSQUE = """Generate a stylized illustration of the Djingareyber / Sankore mosque of Timbuktu — iconic 14th century Sahelian mud-brick architecture.

Style requirements:
- Flat 2D papercraft illustration, NO 3D rendering, NO photorealism
- Hand-drawn stylized line art with flat color fills
- Color palette ONLY:
  * Terracotta orange / mud-brick (#A85A3A) for the walls
  * Warm cream (#F2E5C8) for highlights and detail
  * Dark indigo (#1F2A4A) for outlines, doorway, and the wooden beams (toron)
  * Gold (#D4A574) for the small finial / accent on top
- Solid indigo blue background (#1F2A4A) filling the entire canvas — the indigo IS the background

Composition:
- Front view, perfectly symmetric
- Pyramidal minaret in the center with horizontal wooden beams (toron) protruding from each side
- Square mud-brick base with a small arched doorway
- Mosque takes ~70% of canvas height
- Symmetric vertical composition

Critical:
- NO text, NO letters, NO writing
- NO people, NO animals, NO landscape, NO ground line (mosque floats centered)
- NO atmospheric effects, NO clouds
- Sharp clean lines, suitable as a small icon (~200x200 display)
- Solid indigo (#1F2A4A) IS the entire background — uniform color, no gradient

Format: 1024x1024, PNG with solid indigo background."""


def chroma_key_to_rgba(in_path: Path, out_path: Path, bg_rgb=CHROMA_BG_RGB, tol=40):
    """Replace bg_rgb pixels (within tol) with alpha=0, then crop to bbox."""
    im = Image.open(in_path).convert("RGBA")
    px = im.load()
    W, H = im.size
    br, bg, bb = bg_rgb
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            # Match indigo bg with tolerance (per-channel + total dist)
            if abs(r - br) < tol and abs(g - bg) < tol and abs(b - bb) < tol:
                px[x, y] = (0, 0, 0, 0)
    # Crop bbox of non-transparent pixels
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(out_path, "PNG")
    print(f"  Chroma-keyed -> {out_path.name} ({im.size[0]}x{im.size[1]})")


def generate(prompt: str, raw_path: Path, transp_path: Path):
    print(f"-> {raw_path.name}")
    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt],
        config=types.GenerateContentConfig(response_modalities=["image", "text"]),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            raw_path.write_bytes(part.inline_data.data)
            size_kb = len(part.inline_data.data) / 1024
            print(f"  Saved raw: {raw_path.name} ({size_kb:.1f} KB)")
            chroma_key_to_rgba(raw_path, transp_path)
            return True
        elif part.text:
            print(f"  Text: {part.text}")
    return False


def main() -> int:
    print(f"Model: {MODEL}")
    print(f"Cost preview: 2 x ~$0.07 = ~$0.14 total")
    print(f"Output dir: {OUT_DIR}")
    print()

    targets = [
        ("book", PROMPT_BOOK),
        ("mosque", PROMPT_MOSQUE),
    ]
    ok = 0
    for name, prompt in targets:
        raw = OUT_DIR / f"icon-{name}-raw.png"
        transp = OUT_DIR / f"icon-{name}.png"
        if generate(prompt, raw, transp):
            ok += 1
    print()
    print(f"Done: {ok}/{len(targets)}")
    return 0 if ok == len(targets) else 1


if __name__ == "__main__":
    sys.exit(main())
