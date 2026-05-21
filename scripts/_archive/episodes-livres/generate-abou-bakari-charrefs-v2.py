"""Generate 3 canonical character references v2 for Abou Bakari II Short.

Changes vs v1:
- 3 views mandatory (face / three-quarter / profile) on single 9:16 image
- Chibi proportions (large head, short body) matching tirailleur-principal-charsheet.png
- Dot-eyes strict (single black dot, no iris, no sclera)
- Flat fills, no hatching, no shading gradients
- Warm sepia palette (ocre, burnt sienna, cream, gold) -- NOT cold grey like Thiaroye

Characters:
1. abou-bakari-ii -- Mansa of Mali, indigo boubou + gold dome bonnet, paddle
2. mansa-moussa   -- white/gold boubou + white turban + heavy gold accessories
3. capitaine-pirogue -- worn earth-tone tunic, terrified, palm-out warning gesture

Two input refs (BOTH required for every generation):
- REF 1 (format/proportions): public/assets/thiaroye-1944/refs/tirailleur-principal-charsheet.png
- REF 2 (palette/ambiance):   public/assets/abou-bakari/refs/style-anchor-scene1-village.png

Model: gemini-3.1-flash-image-preview ($0.04/image = $0.12 total)
Output: public/assets/abou-bakari/refs/
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

OUT_DIR = ROOT / "public" / "assets" / "abou-bakari" / "refs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

REF1_PATH = ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "tirailleur-principal-charsheet.png"
REF2_PATH = ROOT / "public" / "assets" / "abou-bakari" / "refs" / "style-anchor-scene1-village.png"

# ============================================================
# SHARED STYLE CLAUSE (applied to all prompts)
# ============================================================
STYLE_CLAUSE = """FORMAT: Three views of the same character on a single image -- front view (left), three-quarter view (center), profile view (right). Same layout as REF 1 (tirailleur-principal-charsheet.png). Plain warm parchment background (pale ochre #F5E6C8, no scene, no environment, no objects).

PROPORTIONS: Match REF 1 exactly -- chibi/cartoon ratio: large round head taking up roughly 1/3 of body height, short torso, short legs, small hands and feet. NOT realistic proportions.

STYLE: Paper-craft flat cartoon illustration. WARM SEPIA palette (ocre, burnt sienna, cream, gold #D4AF37) -- NOT the cold grey of Thiaroye. Match REF 2 for color temperature and warmth. Match REF 1 for format structure and proportions.

EYES: Dot-eyes -- single small black dot per eye, no iris, no white sclera, no eyelashes, no expressive eyebrows. Eyes are simple black dots like REF 1.

OUTLINES: Thick clean black outlines on all shapes. Flat color fills only -- no hatching, no shading gradients, no cross-hatching, no texture on skin.

CRITICAL: No text, no letters, no numerals, no labels visible anywhere."""

# ============================================================
# PROMPTS
# ============================================================

PROMPT_ABOU_BAKARI = f"""Generate a CHARACTER REFERENCE SHEET for Abou Bakari II.

{STYLE_CLAUSE}

CHARACTER: Abou Bakari II, Mansa (Emperor) of the Mali Empire, ~45 years old. Dark brown skin, strong stocky build. Expression: determined, visionary.

COSTUME (Mali XIVe siecle strict, NO European elements):
- Grand boubou in deep indigo blue with geometric gold embroidery at collar and hem
- African dome-shaped bonnet in gold (NOT a European crown, NOT a turban -- a round dome cap fitting closely to the head)
- Gold pendant necklace (simple geometric diamond shape)
- Leather sandals (brown)
- Bare forearms visible below boubou sleeves

THREE-QUARTER VIEW (center): he holds a wooden pirogue paddle at his side, blade resting on ground, handle gripped at waist level.

COMPOSITION: 9:16 vertical format. Three views arranged horizontally across the image -- left (front), center (three-quarter with paddle), right (profile). Character occupies ~70% of vertical frame. Warm parchment background.

CRITICAL: 3 views on one image. Chibi proportions. Dot-eyes. Flat fills. Warm sepia palette. No text anywhere."""

PROMPT_MANSA_MOUSSA = f"""Generate a CHARACTER REFERENCE SHEET for Mansa Moussa.

{STYLE_CLAUSE}

CHARACTER: Mansa Moussa, Mansa of the Mali Empire, ~35 years old. Dark brown skin, slender build. Expression: calm, regal, composed -- more serene than Abou Bakari.

COSTUME (Mali XIVe siecle strict, distinct from Abou Bakari):
- Grand boubou in pure white with heavy gold embroidery at collar, sleeves, and hem
- White turban with gold band wrapping the head (NOT a dome bonnet -- a wrapped turban)
- Multiple gold bracelets on both wrists (3 per wrist, chunky round bands)
- Large gold necklace (heavier and more ornate than Abou Bakari -- multiple circular gold links)
- Leather sandals with gold tip embellishment
- Hands clasped in front in the front view

PALETTE DISTINCTION: white/gold dominant (vs Abou Bakari's indigo/gold) -- must be immediately readable as a different character at a glance.

COMPOSITION: 9:16 vertical format. Three views arranged horizontally -- left (front), center (three-quarter), right (profile). Character occupies ~70% of vertical frame. Warm parchment background.

CRITICAL: 3 views on one image. Chibi proportions. Dot-eyes. Flat fills. Warm sepia palette. No text anywhere."""

PROMPT_CAPITAINE = f"""Generate a CHARACTER REFERENCE SHEET for the captain of the returned pirogue.

{STYLE_CLAUSE}

CHARACTER: Captain of the only returned pirogue, ~50 years old. Dark brown skin, stocky weathered build. Expression: terrified, haunted -- the face of a man who has seen the open ocean swallow everything.

COSTUME (common sailor/fisherman -- ZERO gold, ZERO royal elements):
- Simple worn linen tunic, earth brown, sleeveless
- Cloth wrap around waist (sienna/ochre, tied loosely)
- Bare feet
- Rope bracelet on one wrist (no other accessories)

THREE-QUARTER VIEW (center): one arm raised, palm facing outward at shoulder level -- gesture of warning, refusal, or warding off.

PALETTE: muted earth tones only (brown, sienna, ochre, dark skin) -- clearly a commoner versus the two royals. No gold, no embroidery, no ornaments.

COMPOSITION: 9:16 vertical format. Three views arranged horizontally -- left (front), center (three-quarter with warning gesture), right (profile). Character occupies ~70% of vertical frame. Warm parchment background.

CRITICAL: 3 views on one image. Chibi proportions. Dot-eyes. Flat fills. Warm sepia palette. No text anywhere."""


CHARACTERS = [
    ("abou-bakari-charref-v2", PROMPT_ABOU_BAKARI),
    ("mansa-moussa-charref-v2", PROMPT_MANSA_MOUSSA),
    ("capitaine-pirogue-charref-v2", PROMPT_CAPITAINE),
]


async def generate_charref(name: str, prompt: str, ref1_bytes: bytes, ref2_bytes: bytes):
    """Generate one character sheet with both refs as input."""
    out_path = OUT_DIR / f"{name}.png"
    print(f"[{name}] starting...")
    try:
        contents = [
            types.Part.from_bytes(data=ref1_bytes, mime_type="image/png"),
            types.Part.from_bytes(data=ref2_bytes, mime_type="image/png"),
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
                print(f"[{name}] SAVED: {out_path.name} ({img.size[0]}x{img.size[1]})")
                return True
        print(f"[{name}] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[{name}] EXCEPTION: {e}")
        return False


async def main():
    for ref_path, label in [(REF1_PATH, "REF1 tirailleur-charsheet"), (REF2_PATH, "REF2 style-anchor-village")]:
        if not ref_path.exists():
            print(f"ERROR: {label} not found: {ref_path}")
            return 1

    ref1_bytes = REF1_PATH.read_bytes()
    ref2_bytes = REF2_PATH.read_bytes()
    print(f"REF1: {REF1_PATH.name} ({len(ref1_bytes)/1024:.1f} KB)")
    print(f"REF2: {REF2_PATH.name} ({len(ref2_bytes)/1024:.1f} KB)")
    print(f"Output dir: {OUT_DIR}")
    print(f"[COST PREVIEW] {len(CHARACTERS)} images * $0.04 = ${len(CHARACTERS) * 0.04:.2f}")
    print()

    tasks = [generate_charref(name, prompt, ref1_bytes, ref2_bytes) for name, prompt in CHARACTERS]
    results = await asyncio.gather(*tasks)

    ok = sum(1 for r in results if r)
    print(f"\nResults: {ok}/{len(CHARACTERS)} succeeded")
    return 0 if ok == len(CHARACTERS) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
