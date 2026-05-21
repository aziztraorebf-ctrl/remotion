"""Fix text parasites on scene5a-B and scene5b (both variations).

scene5a-B: remove "THIAROYE'S PROMISES" and "BIRAM SENGHOR, 2026" text from top/bottom
scene5b: regenerate with NO engravings, NO letters -- pure stone texture only

Model: gemini-3.1-flash-image-preview
"""
import asyncio
import io
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

STYLE_ANCHOR = ROOT / "public" / "assets" / "thiaroye-1944" / "scene1" / "scene1-source-v4.png"
BASE_DIR = ROOT / "public" / "assets" / "thiaroye-1944"


# ============================================================================
# Fix 1: scene5a-B — surgical text removal
# ============================================================================

SCENE5A_B_FIX_PROMPT = """Take this image. Make TWO surgical changes only:
1. REMOVE the text banner at the top of the image ("THIAROYE'S PROMISES" or any text at top). Replace it with the continuation of the portrait wall background -- same grey tone, same style of portrait frames, seamlessly extended upward.
2. REMOVE the text banner at the bottom of the image ("BIRAM SENGHOR, 2026" or any text at bottom). Replace it with the continuation of the wooden floor -- same color, same paper-craft style.

DO NOT change anything else:
- The elderly man (Biram Senghor) -- keep him exactly as he is, same position, same suit, same face, same expression
- The portrait wall behind him -- keep all the portrait frames exactly
- The eternal flame -- keep it exactly
- The document in his hands -- keep it exactly
- The paper-craft style -- keep it identical

ONLY remove the two text banners and fill with matching background. Nothing else changes."""


# ============================================================================
# Fix 2: scene5b — regenerate with pure stone, no engravings visible
# ============================================================================

SCENE5B_A_REGEN_PROMPT = """Paper-craft illustration, 9:16 vertical. SCENE: Close-up of a stone memorial wall. The wall is a LARGE EXPANSE OF PLAIN GREY-BEIGE STONE -- rough cut stone blocks, ancient and worn.

The stone surface has texture (paper-craft texture, not photorealism) but ABSOLUTELY NO LETTERS, NO WORDS, NO NUMBERS, NO ENGRAVINGS, NO INSCRIPTIONS, NO TEXT OF ANY KIND. The stone blocks are just stone -- some blocks slightly lighter, some slightly darker, natural variation in grey-beige tone.

ONE visual element of dignity: a single dried autumn leaf resting at the base of the wall on the stone ledge -- a simple flat paper-craft leaf shape, dark brown, no detail.

Cold raking light from the left creates long diagonal shadows across the stone surface -- the shadows are the ONLY lines on the stone (shadows of the block edges, not letters).

STYLE: paper-craft, thick black outlines on stone blocks, flat color fills (grey-beige stone blocks), cold directional light.

PALETTE: cool grey-beige stone, dark charcoal shadows, dark brown dried leaf. No color accents. Monolithic.

COMPOSITION: stone wall fills the entire 9:16 frame edge to edge. Stone block grid visible. The dried leaf is at bottom-left corner. Cold light from left edge.

CRITICAL: ABSOLUTELY ZERO TEXT, ZERO LETTERS, ZERO NUMBERS, ZERO INSCRIPTIONS anywhere on the stone. This is bare stone only.

9:16 vertical (1080x1920)"""

SCENE5B_B_REGEN_PROMPT = """Paper-craft illustration, 9:16 vertical. SCENE: A stone memorial wall seen from a slight angle -- wider view showing more of the courtyard context.

The wall is plain grey-beige stone blocks, worn and ancient. NO LETTERS, NO WORDS, NO INSCRIPTIONS, NO ENGRAVINGS anywhere on the stone. The stone is bare.

At the base of the wall: a small bouquet of flowers (paper-craft flat shapes -- two or three red/orange flowers with green stems), and a single folded white letter placed against the stone (face down, not readable). These are offerings left by visitors.

Cold winter sky visible at the very top of the frame (a thin strip of grey-blue). The stone wall base meets a grey stone courtyard floor.

STYLE: paper-craft, thick black outlines, flat color fills.

PALETTE: grey-beige stone, cold grey sky strip, red-orange flower accents (only warm color), white letter. No text anywhere.

COMPOSITION: wall fills most of the frame, slightly angled perspective showing depth of the stone. Offerings at bottom-center.

CRITICAL: ABSOLUTELY ZERO TEXT OR LETTERS on any surface including the folded letter (it is face-down, no text visible). Pure stone, pure paper-craft.

9:16 vertical (1080x1920)"""


async def fix_scene5a_b() -> bool:
    source = BASE_DIR / "scene5a" / "scene5a-source-v1b.png"
    out_path = BASE_DIR / "scene5a" / "scene5a-source-v1b-fixed.png"

    if not source.exists():
        print(f"ERROR: source not found: {source}")
        return False

    print("[scene5a B fix] surgical text removal...")
    try:
        contents = [
            types.Part.from_bytes(data=source.read_bytes(), mime_type="image/png"),
            SCENE5A_B_FIX_PROMPT,
        ]
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img_bytes = part.inline_data.data
                out_path.write_bytes(img_bytes)
                img = Image.open(io.BytesIO(img_bytes))
                print(f"[scene5a B fix] SAVED: {out_path} ({img.size[0]}x{img.size[1]})")
                return True
        print("[scene5a B fix] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[scene5a B fix] EXCEPTION: {e}")
        return False


async def regen_scene5b_a() -> bool:
    out_path = BASE_DIR / "scene5b" / "scene5b-source-v1a-v2.png"
    BASE_DIR.joinpath("scene5b").mkdir(parents=True, exist_ok=True)

    print("[scene5b A regen] pure stone, no text...")
    try:
        contents = [
            types.Part.from_bytes(data=STYLE_ANCHOR.read_bytes(), mime_type="image/png"),
            SCENE5B_A_REGEN_PROMPT,
        ]
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img_bytes = part.inline_data.data
                out_path.write_bytes(img_bytes)
                img = Image.open(io.BytesIO(img_bytes))
                print(f"[scene5b A regen] SAVED: {out_path} ({img.size[0]}x{img.size[1]})")
                return True
        print("[scene5b A regen] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[scene5b A regen] EXCEPTION: {e}")
        return False


async def regen_scene5b_b() -> bool:
    out_path = BASE_DIR / "scene5b" / "scene5b-source-v1b-v2.png"

    print("[scene5b B regen] stone wall with offerings, no text...")
    try:
        contents = [
            types.Part.from_bytes(data=STYLE_ANCHOR.read_bytes(), mime_type="image/png"),
            SCENE5B_B_REGEN_PROMPT,
        ]
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img_bytes = part.inline_data.data
                out_path.write_bytes(img_bytes)
                img = Image.open(io.BytesIO(img_bytes))
                print(f"[scene5b B regen] SAVED: {out_path} ({img.size[0]}x{img.size[1]})")
                return True
        print("[scene5b B regen] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[scene5b B regen] EXCEPTION: {e}")
        return False


async def main():
    print("=== Fix scene5 text parasites ===")
    print("Total: 3 ops * $0.04 = ~$0.12")

    ok1 = await fix_scene5a_b()
    ok2 = await regen_scene5b_a()
    ok3 = await regen_scene5b_b()

    print(f"\nResults: scene5a-B fix={ok1}, scene5b-A regen={ok2}, scene5b-B regen={ok3}")
    return 0 if (ok1 and ok2 and ok3) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
