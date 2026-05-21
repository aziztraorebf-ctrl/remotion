"""Regenerate 4 Thiaroye char-refs V3 with TRUE paper-craft Sonjata style.

Previous attempt (V1/V2) was BD flat Disney-ish, not paper-craft.
Root cause: wrong style anchor (thiaroye-v4 BD flat instead of Sonjata paper-craft).

This version uses Sonjata scene1 frame as TRUE structural anchor:
- Thick black outlines
- Pure dot-eyes (no iris, no white visible)
- Paper kraft texture background
- Rounded cartoon proportions (not semi-realistic)
- Flat color fills with NO shading gradients

Palette shift: warm sepia -> COLD grey-blue-olive (Thiaroye 1944 military)

Model: gemini-3.1-flash-image-preview
Cost: 4 * $0.04 = $0.16
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

OUT_DIR = ROOT / "public" / "assets" / "thiaroye-1944" / "refs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# TRUE paper-craft style anchor from Sonjata published clip
STYLE_ANCHOR = Path("/tmp/thiaroye-v5-style-anchors/scene1-assembled-frame.png")


# ============================================================
# STYLE CLAUSE v3 (MUCH more specific paper-craft)
# ============================================================

STYLE_CLAUSE = """STYLE - CRITICAL - MATCH THE REFERENCE IMAGE PRECISELY:

The reference image shows our canonical PAPER-CRAFT STORYBOOK ILLUSTRATION style. You MUST match this style EXACTLY in terms of structure, but SHIFT THE PALETTE from warm sepia to COLD grey-blue-olive.

STRUCTURAL STYLE (non-negotiable, must match reference):
- THICK BLACK OUTLINES around every shape (not thin lines -- bold, confident, visible)
- FLAT COLOR FILLS inside each shape (no gradients, no shading, no soft transitions)
- PAPER KRAFT TEXTURE visible in the background (subtle grain, not smooth canvas)
- ROUNDED CARTOON PROPORTIONS for characters (rounded heads, simplified bodies -- NOT semi-realistic BD)
- PURE DOT-EYES: each eye is ONE SIMPLE BLACK DOT -- no iris, no white visible, no pupil structure, no eyelashes

PALETTE SHIFT for Thiaroye 1944 (adapt FROM warm sepia TO cold colonial military):
- Skies: stormy grey-blue, slate, cold clouds (NOT warm golden hour)
- Uniforms: dark KHAKI-OLIVE and dark NAVY-BLUE (depending on character)
- Terrain: muted ochre-brown earth, greyish puddles (cold)
- Skin: dark warm BROWN (Senegalese) or pale COLD beige (French officer)
- NO bright colors. NO warm sepia. Everything desaturated and cold.

STRICT RULES:
- NO photorealism, NO Pixar 3D, NO Disney-style BD flat
- NO iris or pupils visible in eyes (just black dots)
- NO shading gradients (flat fills only)
- NO thin delicate lines (bold thick outlines)

FORMAT: 1080x1920 vertical (9:16).
CRITICAL: No text, no labels, no banners, no writing anywhere."""


# ============================================================
# PROMPTS v3 — character sheets in 3 views
# ============================================================

PROMPT_TIRAILLEUR = f"""Generate a CHARACTER REFERENCE SHEET for a Senegalese tirailleur, showing 3 different views.

{STYLE_CLAUSE}

CHARACTER: Senegalese tirailleur (West African soldier in the French colonial army, 1944).
- Young adult man (~25-30 years old), dark BROWN skin
- Short cropped dark hair under a dark KHAKI-OLIVE beret (paper-craft simple shape)
- Military tunic: KHAKI-OLIVE, 4 simplified chest pockets with flaps, matching pants
- Dark brown leather belt at waist
- Small French flag patch (3 color stripes) on left shoulder
- Brown ankle-high boots (simple shape)
- Calm, dignified bearing

COMPOSITION: 3 full-body views side-by-side on a plain cold grey-beige paper-craft background:
- LEFT: FRONT view, arms at sides, neutral face
- CENTER: 3/4 view, head slightly tilted, determined
- RIGHT: PROFILE view, head high, hopeful

The character must be instantly recognizable across all 3 views (same face shape, same uniform, same proportions).

CRITICAL REMINDER: eyes are PURE DOTS (black dots), not iris/pupil structure. Outlines are THICK and BLACK. Style MUST match the reference paper-craft aesthetic exactly."""


PROMPT_OFFICIER = f"""Generate a CHARACTER REFERENCE SHEET for a French army officer, showing 3 different views.

{STYLE_CLAUSE}

CHARACTER: French army officer, 1944, colonial military.
- Adult man (~40-50 years old), pale cold BEIGE skin (NOT pink, not warm)
- Thin dark moustache (simplified paper-craft brushstroke)
- Dark NAVY-BLUE kepi hat with small gold band
- Dark NAVY-BLUE military jacket with 4 brass buttons and shoulder epaulettes (simplified)
- Dark NAVY pants, simple shape
- Black ankle-high boots
- Black leather belt with holster on hip
- Stern, rigid, authoritarian bearing

COMPOSITION: 3 full-body views side-by-side on plain cold grey-beige paper-craft background:
- LEFT: FRONT view, hands behind back, cold neutral
- CENTER: 3/4 view, hand on holster, authoritative
- RIGHT: PROFILE view, chin lifted, contemptuous

CRITICAL: eyes are PURE DOTS, not iris. Thick black outlines. Flat color fills only. Paper-craft style must match the reference precisely."""


PROMPT_BIRAM = f"""Generate a CHARACTER REFERENCE SHEET for an elderly Senegalese man (Biram Senghor), showing 3 different views.

{STYLE_CLAUSE}

CHARACTER: Elderly Senegalese man (~85-90 years old), ORDINARY unremarkable face (NOT resembling any famous actor — he is a generic grandfather figure, anonymous).
- Tall, thin, slightly stooped but dignified
- Dark BROWN skin, rounded simplified face (paper-craft cartoon proportions, NOT semi-realistic)
- Short WHITE cropped hair, short WHITE beard stubble (simplified shapes)
- Modern civilian clothing: DARK GREY-BLUE sober suit jacket, plain white shirt underneath, no tie
- DARK OLIVE trousers
- Brown simple shoes
- Hands are visible and hold a plain white folded paper (no text, no writing)
- Calm dignified expression (NO tears, grief expressed through posture)

COMPOSITION: 3 views side-by-side on plain cold grey-beige paper-craft background:
- LEFT: full-body FRONT view, document in both hands at chest level
- CENTER: PORTRAIT CLOSE-UP of head and shoulders, 3/4 view, gaze slightly off-camera (dignified)
- RIGHT: CLOSE-UP of the HANDS holding the folded document (just hands, no face)

CRITICAL: eyes are PURE DOTS (not iris). Thick black outlines. Flat color fills. Paper-craft storybook style, NOT semi-realistic BD. Face must be ordinary/generic, not famous."""


PROMPT_JEUNE_TEMOIN = f"""Generate a CHARACTER REFERENCE SHEET for a young Senegalese man (contemporary witness), showing 3 different views.

{STYLE_CLAUSE}

CHARACTER: Young Senegalese man (~25-30 years old), contemporary generation receiving the historical memory.
- Athletic slim build, standing upright
- Dark BROWN skin
- Short cropped dark hair, clean-shaven
- Contemporary civilian clothing: DARK NAVY-BLUE plain cotton jacket, DARK GREY plain trousers, simple dark shoes
- No visible logos, no text, no accessories
- Contemplative, respectful posture

COMPOSITION: 3 full-body views side-by-side on plain cold grey-beige paper-craft background:
- LEFT: BACK view (turned to camera, looking at something invisible ahead, head slightly tilted forward)
- CENTER: 3/4 BACK view (slight profile visible, posture contemplative)
- RIGHT: full SIDE PROFILE view, gaze toward the horizon

CRITICAL: when face is visible (right view), eyes are PURE DOTS, not iris. Thick black outlines. Flat color fills. Paper-craft style MUST match the reference image's aesthetic."""


CHARACTERS = [
    ("tirailleur-principal", PROMPT_TIRAILLEUR),
    ("officier-francais", PROMPT_OFFICIER),
    ("biram-senghor", PROMPT_BIRAM),
    ("jeune-temoin", PROMPT_JEUNE_TEMOIN),
]


async def generate_charref(name: str, prompt: str, style_anchor_bytes: bytes):
    out_path = OUT_DIR / f"{name}-charsheet.png"
    backup_v2 = OUT_DIR / f"{name}-charsheet-v2-bdflat-wrong.png"

    # Backup V2 (wrong style) before overwriting
    if out_path.exists() and not backup_v2.exists():
        backup_v2.write_bytes(out_path.read_bytes())

    print(f"[{name}] generating V3 with TRUE paper-craft anchor...")
    try:
        contents = [
            types.Part.from_bytes(data=style_anchor_bytes, mime_type="image/png"),
            prompt,
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
                img_bytes = part.inline_data.data
                out_path.write_bytes(img_bytes)
                img = Image.open(io.BytesIO(img_bytes))
                print(f"[{name}] SAVED V3: {out_path.name} ({img.size[0]}x{img.size[1]})")
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
    print(f"TRUE style anchor: {STYLE_ANCHOR.name} (Sonjata scene1 paper-craft)")
    print(f"Output: {OUT_DIR}")
    print(f"[COST PREVIEW] {len(CHARACTERS)} * $0.04 = ${len(CHARACTERS) * 0.04:.2f}")
    print()

    tasks = [generate_charref(name, prompt, style_bytes) for name, prompt in CHARACTERS]
    results = await asyncio.gather(*tasks)

    ok = sum(1 for r in results if r)
    print(f"\nResults: {ok}/{len(CHARACTERS)} succeeded")
    return 0 if ok == len(CHARACTERS) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
