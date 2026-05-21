"""Fix 2 Thiaroye char-refs:
1. Officier francais - fix pants/boots proportions on views 2 & 3 (surgical Gemini edit)
2. Biram Senghor - regenerate to avoid Morgan Freeman resemblance

Model: gemini-3.1-flash-image-preview
Cost: ~$0.08 total
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

REFS_DIR = ROOT / "public" / "assets" / "thiaroye-1944" / "refs"
STYLE_ANCHOR = ROOT / "tmp" / "thiaroye-styleref" / "thiaroye-clip1-styleref-v1.png"

STYLE_CLAUSE = """STYLE: Flat 2D paper-craft illustration, COLD palette (grey-blue, olive-khaki, muted taupe). Simple shapes with clean dark outlines, flat color fills, paper texture. No gradients, no shading, no realism.

STRICT EYES RULE: paper-craft dot-eyes only -- single small black dot per eye, NO iris, NO white visible.

STRICT RENDERING: flat color fills only -- no shading gradients."""


# ============================================================
# FIX 1: Officier francais - surgical edit on proportions
# ============================================================

OFFICIER_FIX_PROMPT = f"""Make ONE SURGICAL CORRECTION to this character sheet of a French army officer.

PROBLEM: on the CENTER view (3/4) and RIGHT view (profile), the pants and boots look wrong -- the trousers end too high at the knee, and the boots look like tall cavalry boots that are disproportionate. This is inconsistent with the LEFT view where the pants go down normally to ankle-height boots.

FIX: make the CENTER and RIGHT views match the LEFT view proportions:
- Full-length dark navy trousers going all the way down to the ankle (NOT stopping at the knee)
- Short black leather ankle-height boots (NOT tall cavalry boots)
- Pants should have a subtle thin side stripe like the original

DO NOT CHANGE: the face, the kepi, the jacket, the mustache, the belt, the holster, the poses, the background, or the LEFT view. Only fix the pants+boots on center and right views.

{STYLE_CLAUSE}

FORMAT: keep the same 1080x1920 vertical canvas, same 3-view composition."""


# ============================================================
# FIX 2: Biram Senghor - full regeneration (avoid Morgan Freeman)
# ============================================================

BIRAM_REGEN_PROMPT = f"""Generate a CHARACTER REFERENCE SHEET for Biram Senghor, elderly Senegalese man.

{STYLE_CLAUSE}

CHARACTER: Biram Senghor, elderly Senegalese man (age ~85-90), son of a tirailleur killed at Thiaroye in 1944, now a plaintiff in the 2026 Paris tribunal case.

CRITICAL - ORDINARY FACE RULE:
- Do NOT make him resemble any famous actor or celebrity
- Do NOT base the face on Morgan Freeman, Laurence Fishburne, Samuel L. Jackson, or any well-known elderly Black actor
- He is an ORDINARY elderly West African man, generic and anonymous
- Avoid: prominent cheekbones with heavy downward lines, deep forehead wrinkles, iconic face structure
- Use: a softer rounder face shape, gentle features, UNREMARKABLE and universal -- the face of any grandfather

PHYSICAL:
- Tall, thin, dignified bearing (slightly stooped but upright)
- Dark BROWN skin (visible via dark outlines, NOT shading)
- Short white cropped hair, clean-shaven OR very short white beard stubble (NOT a distinctive pointed beard)
- Modern civilian clothing: dark grey-blue sober suit jacket, plain white shirt, no tie
- His hands are visible and hold a plain folded legal document (single white sheet, no text)
- Calm, determined expression -- grief held in, no tears

COMPOSITION: character sheet with 3 views side by side on neutral cold grey-beige background:
LEFT: full-body FRONT view, document held in both hands at chest level, facing forward
CENTER: CLOSE-UP of the weathered HANDS holding the folded document (no face visible, just hands and paper)
RIGHT: PORTRAIT 3/4 view (head and shoulders only), dignified look, gaze slightly off-camera

FORMAT: 1080x1920 vertical (9:16).

CRITICAL:
- No text on the document (blank folded paper)
- Eyes are dot-eyes (single black dots, NO iris, NO white)
- Emotion through posture and gaze, NOT through tears or facial contortion
- Face must be UNREMARKABLE, NOT a famous actor lookalike"""


async def fix_officier(style_bytes: bytes):
    """Surgical edit on officier charsheet."""
    name = "officier-francais"
    in_path = REFS_DIR / f"{name}-charsheet.png"
    out_path = REFS_DIR / f"{name}-charsheet.png"
    backup_path = REFS_DIR / f"{name}-charsheet-v1-backup.png"

    # Backup original
    if in_path.exists() and not backup_path.exists():
        backup_path.write_bytes(in_path.read_bytes())
        print(f"[{name}] backup saved: {backup_path.name}")

    print(f"[{name}] surgical edit on pants/boots proportions...")
    try:
        img_bytes = in_path.read_bytes()
        contents = [
            types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
            OFFICIER_FIX_PROMPT,
        ]
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                new_bytes = part.inline_data.data
                out_path.write_bytes(new_bytes)
                img = Image.open(io.BytesIO(new_bytes))
                print(f"[{name}] FIXED: {out_path.name} ({img.size[0]}x{img.size[1]})")
                return True
        print(f"[{name}] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[{name}] EXCEPTION: {e}")
        return False


async def regen_biram(style_bytes: bytes):
    """Full regeneration of Biram with 'ordinary face' clause."""
    name = "biram-senghor"
    in_path = REFS_DIR / f"{name}-charsheet.png"
    out_path = REFS_DIR / f"{name}-charsheet.png"
    backup_path = REFS_DIR / f"{name}-charsheet-v1-backup.png"

    # Backup original
    if in_path.exists() and not backup_path.exists():
        backup_path.write_bytes(in_path.read_bytes())
        print(f"[{name}] backup saved: {backup_path.name}")

    print(f"[{name}] full regeneration (ordinary face, no celebrity)...")
    try:
        contents = [
            types.Part.from_bytes(data=style_bytes, mime_type="image/png"),
            BIRAM_REGEN_PROMPT,
        ]
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                new_bytes = part.inline_data.data
                out_path.write_bytes(new_bytes)
                img = Image.open(io.BytesIO(new_bytes))
                print(f"[{name}] REGENERATED: {out_path.name} ({img.size[0]}x{img.size[1]})")
                return True
        print(f"[{name}] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[{name}] EXCEPTION: {e}")
        return False


async def main():
    if not STYLE_ANCHOR.exists():
        print(f"ERROR: style anchor not found: {STYLE_ANCHOR}")
        return 1

    style_bytes = STYLE_ANCHOR.read_bytes()
    print(f"[COST PREVIEW] 2 * $0.04 = $0.08")
    print()

    results = await asyncio.gather(
        fix_officier(style_bytes),
        regen_biram(style_bytes),
    )

    ok = sum(1 for r in results if r)
    print(f"\nResults: {ok}/2 succeeded")
    return 0 if ok == 2 else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
