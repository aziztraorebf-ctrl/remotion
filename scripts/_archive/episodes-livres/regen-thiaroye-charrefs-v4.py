"""Regenerate 2 Thiaroye char-refs V4 — surgical fix for Biram + Jeune temoin.

Problems observed on V3:
- Biram V3: forehead wrinkles, under-eye lines, almond eyes with visible iris white
  - Age reads as "old face with skin texture" instead of paper-craft-simplified elder
- Jeune temoin V3: profile view has almond-shaped eye with visible pupil/iris structure
  - Breaks R-PC17 (dot-eyes strict, including in profile)

V3 tirailleur is VALIDATED by Aziz as the correct simplification level:
- Zero wrinkles even on adult face
- Pure black dots for eyes in all 3 views including profile
- Minimalist facial features (short eyebrows, single-line mouth)

V4 strategy: DOUBLE ANCHOR
1. Sonjata scene1 frame: canonical paper-craft structure (thick outlines, flat fills, dot-eyes)
2. Tirailleur V3: proof that this simplification level holds in Thiaroye cold palette

V4 prompts add explicit ANTI-TROPISM clauses targeting the V3 failures.

NOT regenerated: tirailleur (validated), officier (out of scope for Priority 0 fix).

Model: gemini-3.1-flash-image-preview
Cost: 2 * $0.04 = $0.08
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

# DOUBLE ANCHOR
STYLE_ANCHOR_1 = Path("/tmp/thiaroye-v5-style-anchors/scene1-assembled-frame.png")
STYLE_ANCHOR_2 = OUT_DIR / "tirailleur-principal-charsheet.png"  # V3 validated


# ============================================================
# STYLE CLAUSE v4 — same core as v3 + explicit double-anchor framing
# ============================================================

STYLE_CLAUSE = """STYLE - CRITICAL - MATCH BOTH REFERENCE IMAGES PRECISELY:

You are given TWO reference images that together define the target style.

REFERENCE 1 (Sonjata scene): our canonical PAPER-CRAFT STORYBOOK ILLUSTRATION style.
- Observe how even elderly characters (white-haired griot figures) have PURE DOT EYES with zero wrinkles on their faces.
- Age is shown ONLY by white hair / white beard / slight stoop — NEVER by skin wrinkles or face lines.

REFERENCE 2 (tirailleur character sheet): PROOF that this exact simplification level holds in the cold Thiaroye palette.
- Observe: even in the profile view (rightmost figure), the eye is ONE BLACK DOT — not an oval, not an iris with pupil, not an eyelash. Just a dot.
- The skin is completely smooth — no wrinkles, no texture, no lines.
- Outlines are thick and confident. Color fills are flat (no gradients).

YOU MUST MATCH THIS LEVEL OF SIMPLIFICATION. If the tirailleur's face is simple, the new character's face must be EQUALLY simple.

STRUCTURAL STYLE (non-negotiable):
- THICK BLACK OUTLINES around every shape (bold, confident)
- FLAT COLOR FILLS inside each shape (no gradients, no shading)
- PAPER KRAFT TEXTURE visible in the background (subtle grain)
- ROUNDED CARTOON PROPORTIONS (rounded heads, simplified bodies — NOT semi-realistic BD)
- PURE DOT-EYES: each eye is ONE SIMPLE BLACK DOT in ALL views including profile — no iris, no white visible, no pupil structure, no eyelashes, no almond shape

PALETTE — Thiaroye 1944 cold colonial:
- Skies: stormy grey-blue, slate, cold clouds
- Clothing: dark NAVY-BLUE, dark GREY-BLUE, DARK OLIVE
- Terrain: muted ochre-brown, greyish puddles
- Skin: dark warm BROWN (Senegalese)
- NO bright colors, NO warm sepia, everything desaturated and cold

STRICT RULES:
- NO photorealism, NO Pixar 3D, NO Disney BD flat
- NO iris or pupils (just black dots)
- NO shading gradients (flat fills only)
- NO thin lines (bold thick outlines)

FORMAT: 1080x1920 vertical (9:16).
CRITICAL: No text, no labels, no banners, no writing anywhere."""


# ============================================================
# PROMPTS v4 — with anti-tropism clauses for V3 observed failures
# ============================================================

PROMPT_BIRAM = f"""Generate a CHARACTER REFERENCE SHEET for an elderly Senegalese man (Biram Senghor), showing 3 different views.

{STYLE_CLAUSE}

CHARACTER: Elderly Senegalese man (~85-90 years old), ORDINARY unremarkable face (NOT resembling any famous actor — generic grandfather figure, anonymous).
- Tall, thin, slightly stooped but dignified
- Dark BROWN skin, rounded simplified face (paper-craft cartoon proportions, NOT semi-realistic)
- Short WHITE cropped hair, short WHITE beard stubble (simplified shapes)
- Modern civilian clothing: DARK GREY-BLUE sober suit jacket, plain white shirt underneath, no tie
- DARK OLIVE trousers
- Brown simple shoes
- Hands are visible and hold a plain white folded paper (no text, no writing)
- Calm dignified expression (NO tears, grief expressed through posture)

ANTI-TROPISM — CRITICAL (V3 previously failed these points, do NOT repeat):
- NO wrinkles anywhere on the face. NO forehead lines. NO crow's feet. NO under-eye bags. NO nasolabial folds. NO age lines. NO skin texture details.
- Elderly status is shown ONLY by: (1) white hair, (2) white beard stubble, (3) slight stoop in posture. NEVER by face lines.
- Face skin must be as SMOOTH and SIMPLE as the tirailleur's face in the second reference image. If the tirailleur's forehead is a single smooth shape, Biram's forehead MUST also be a single smooth shape.
- Eyes are ONE BLACK DOT each — no iris shape, no white of eye visible, no pupil structure, no almond shape. Match the tirailleur reference exactly.
- Mouth is a simple minimal line — no teeth, no complex lip shape.

COMPOSITION: 3 views side-by-side on plain cold grey-beige paper-craft background:
- LEFT: full-body FRONT view, document in both hands at chest level
- CENTER: PORTRAIT CLOSE-UP of head and shoulders, 3/4 view, gaze slightly off-camera (dignified)
- RIGHT: CLOSE-UP of the HANDS holding the folded document (just hands, no face)

The character must be instantly recognizable across views. Face must be ordinary/generic, not famous.

CRITICAL REMINDER: zero wrinkles. Pure dot-eyes. Thick black outlines. Flat color fills. Match reference style exactly."""


PROMPT_JEUNE_TEMOIN = f"""Generate a CHARACTER REFERENCE SHEET for a young Senegalese man (contemporary witness), showing 3 different views.

{STYLE_CLAUSE}

CHARACTER: Young Senegalese man (~25-30 years old), contemporary generation receiving the historical memory.
- Athletic slim build, standing upright
- Dark BROWN skin
- Short cropped dark hair, clean-shaven
- Contemporary civilian clothing: DARK NAVY-BLUE plain cotton jacket, DARK GREY plain trousers, simple dark shoes
- No visible logos, no text, no accessories
- Contemplative, respectful posture

ANTI-TROPISM — CRITICAL (V3 previously failed on profile view, do NOT repeat):
- In the PROFILE view (rightmost), the visible eye is ONE BLACK DOT, NOT an oval, NOT an iris, NOT a pupil structure, NOT a lens shape, NOT an almond.
- Compare directly to the tirailleur reference image's profile view (rightmost figure): the eye there is a single dot. Match that exactly.
- In ALL views (front, back, 3/4, profile), eyes are pure black dots.
- Skin is completely smooth — no wrinkles, no shading, no texture details.
- Face features are minimal: short eyebrow marks, simple nose line, simple mouth line. No beard, no moustache.

COMPOSITION: 3 full-body views side-by-side on plain cold grey-beige paper-craft background:
- LEFT: BACK view (turned to camera, looking at something invisible ahead, head slightly tilted forward)
- CENTER: 3/4 BACK view (slight profile visible, posture contemplative)
- RIGHT: full SIDE PROFILE view, gaze toward the horizon

CRITICAL REMINDER: profile eye = one black dot (not almond, not iris). Pure dot-eyes in every view. Thick black outlines. Flat color fills. Match reference style exactly."""


CHARACTERS = [
    ("biram-senghor", PROMPT_BIRAM),
    ("jeune-temoin", PROMPT_JEUNE_TEMOIN),
]


async def generate_charref(
    name: str, prompt: str, anchor1_bytes: bytes, anchor2_bytes: bytes
):
    out_path = OUT_DIR / f"{name}-charsheet.png"
    backup_v3 = OUT_DIR / f"{name}-charsheet-v3-bdflat-wrong.png"

    # Backup V3 (with observed issues) before overwriting
    if out_path.exists() and not backup_v3.exists():
        backup_v3.write_bytes(out_path.read_bytes())
        print(f"[{name}] backed up V3 to {backup_v3.name}")

    print(f"[{name}] generating V4 with double-anchor + anti-tropism clauses...")
    try:
        contents = [
            types.Part.from_bytes(data=anchor1_bytes, mime_type="image/png"),
            types.Part.from_bytes(data=anchor2_bytes, mime_type="image/png"),
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
                print(f"[{name}] SAVED V4: {out_path.name} ({img.size[0]}x{img.size[1]})")
                return True
        print(f"[{name}] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[{name}] EXCEPTION: {e}")
        return False


async def main():
    if not STYLE_ANCHOR_1.exists():
        print(f"ERROR: style anchor 1 not found: {STYLE_ANCHOR_1}")
        return 1
    if not STYLE_ANCHOR_2.exists():
        print(f"ERROR: style anchor 2 not found: {STYLE_ANCHOR_2}")
        return 1

    anchor1_bytes = STYLE_ANCHOR_1.read_bytes()
    anchor2_bytes = STYLE_ANCHOR_2.read_bytes()
    print(f"Anchor 1: {STYLE_ANCHOR_1.name} (Sonjata paper-craft canonical)")
    print(f"Anchor 2: {STYLE_ANCHOR_2.name} (tirailleur V3 validated)")
    print(f"Output: {OUT_DIR}")
    print(f"[COST PREVIEW] {len(CHARACTERS)} * $0.04 = ${len(CHARACTERS) * 0.04:.2f}")
    print()

    tasks = [
        generate_charref(name, prompt, anchor1_bytes, anchor2_bytes)
        for name, prompt in CHARACTERS
    ]
    results = await asyncio.gather(*tasks)

    ok = sum(1 for r in results if r)
    print(f"\nResults: {ok}/{len(CHARACTERS)} succeeded")
    return 0 if ok == len(CHARACTERS) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
