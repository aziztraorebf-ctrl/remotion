"""Generate 2 canonical character reference sheets for Abou Bakari II (GeoAfrique Short).

Versions:
1. abou-bakari-royal-charref-v1.png  -- Mansa attire (pre-abdication), opulence equal to Mansa Moussa
2. abou-bakari-marin-charref-v1.png  -- Seafaring travel attire (simpler, same person)

Style: paper-craft sepia WARM palette, flat 2D cartoon, thick black outlines, flat color fills
Model: gemini-3.1-flash-image-preview (MANDATORY - no other model)
Refs:
  REF 1: tirailleur-principal-charsheet.png  -- FORMAT (3 views, proportions, layout)
  REF 2: style-anchor-scene1-village.png     -- PALETTE (warm sepia, ochre, sienna)
  REF 3: mansa-moussa-charref-v2.png         -- OPULENCE (gold necklace, bracelets, embroidery level)
Cost: ~$0.08 x 2 = $0.16 total
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

REF_FORMAT = ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "tirailleur-principal-charsheet.png"
REF_PALETTE = ROOT / "public" / "assets" / "abou-bakari" / "refs" / "style-anchor-scene1-village.png"
REF_OPULENCE = ROOT / "public" / "assets" / "abou-bakari" / "refs" / "mansa-moussa-charref-v2.png"


PROMPT_ROYAL = """Character reference sheet, paper-craft cartoon style, 9:16 vertical format.

REF IMAGE 1 = FORMAT REFERENCE: use this exact 3-view layout (front / three-quarter / profile), same proportions, same neutral background approach. Do NOT copy the soldier style or palette.

REF IMAGE 2 = PALETTE REFERENCE: warm sepia tones -- ochre, sienna, warm brown, cream. The background must be a plain pale ochre parchment. No scenes, no environment, no objects in background.

REF IMAGE 3 = OPULENCE REFERENCE: this is the level of royal richness required -- massive gold necklace with pendants, multiple stacked gold bracelets, heavy gold embroidery on garment. Abou Bakari II must have EQUAL opulence to this figure.

CHARACTER: Abou Bakari II, Mansa of Mali, approximately 45 years old. Dark brown skin, strong build, adult male with well-defined adult jaw and cheekbones. SHORT NEAT BEARD -- 3 to 4 days, well-groomed, covering jaw and chin only, clearly visible on all 3 views. Expression: visionary and determined, gaze slightly toward horizon.

COSTUME -- Royal Mansa Mali, 14th century:
- Grand boubou DEEP INDIGO with HEAVY gold embroidery at collar, chest panel, sleeves, and hem
- Headwear: TALL DOMED CAP in gold fabric with indigo geometric embroidery. The cap sits high on the head with a wide flat-topped dome -- this is a traditional African royal cap. NOT a turban, NOT a cylinder kofia, NOT a European crown. The dome must be clearly taller than wide.
- Massive gold necklace with large oval pendants (same weight as REF IMAGE 3)
- Multiple stacked gold bracelets on both wrists
- Leather sandals with gold detail
- Hands at sides -- NO paddle, NO weapon, NO staff in hands

COMPOSITION: Three views on one image:
LEFT: full-body FRONT view, arms at sides, strong regal posture
CENTER: full-body THREE-QUARTER view, head slightly turned, determined expression
RIGHT: full-body PROFILE view, chin raised, visionary gaze forward

FORMAT: 9:16 vertical. Character occupies 70 to 80 percent of vertical frame. Plain pale ochre parchment background.

STYLE RULES: Thick black outlines. Flat color fills -- no hatching, no gradients on skin or clothing. Warm sepia palette matching REF IMAGE 2. 2D flat cartoon style matching the proportions of REF IMAGE 1.

CRITICAL CHECKLIST:
- 3 views visible on one image: YES
- SHORT NEAT BEARD clearly visible on all 3 views: YES
- TALL DOMED African royal cap (not turban, not cylinder): YES
- Gold embroidery heavy on boubou: YES
- Opulence equal to REF IMAGE 3: YES
- NO paddle or staff in hands: YES
- NO text, no letters, no numerals visible anywhere in the image: YES
- Plain warm parchment background (no scene, no environment): YES"""


PROMPT_MARIN = """Character reference sheet, paper-craft cartoon style, 9:16 vertical format.

REF IMAGE 1 = FORMAT REFERENCE: use this exact 3-view layout (front / three-quarter / profile), same proportions, same neutral background approach. Do NOT copy the soldier style or palette.

REF IMAGE 2 = PALETTE REFERENCE: warm sepia tones -- ochre, sienna, warm brown, cream. Plain pale ochre parchment background. No scenes, no environment.

REF IMAGE 3 = SAME PERSON VISUAL ANCHOR: this figure's face structure, skin tone, and general body proportions must be adapted for Abou Bakari II in travel attire. SAME face, SAME short neat beard, SAME dark brown skin -- only the costume changes.

CHARACTER: Abou Bakari II in seafaring travel attire -- SAME PERSON as the royal version, but simpler clothing. Approximately 45 years old. Dark brown skin, strong build. SHORT NEAT BEARD -- same beard as royal version, 3 to 4 days well-groomed, visible on all 3 views. Expression: resolute and free -- a king who chose the ocean over his throne.

COSTUME -- Seafaring travel, simplified but still noble:
- Boubou medium weight linen, INDIGO but simpler weave than court dress, slightly travel-worn, no heavy embroidery -- only simple geometric hem border
- Cloth wrap around waist in sienna and ochre (practical for sea work)
- Headwear: SIMPLE INDIGO CLOTH WRAP low on the head, practical for wind and sea -- NOT the tall dome cap, NOT a turban tower. A modest flat cloth wrap.
- ONE single gold pendant necklace only (kept one token of royalty)
- Forearms bare -- sleeves rolled up to elbow
- Simple leather sandals, no gold details
- Hands at sides or arms loosely crossed -- NO paddle, NO weapon, NO staff

COMPOSITION: Three views on one image:
LEFT: full-body FRONT view, arms loosely at sides, open posture
CENTER: full-body THREE-QUARTER view, arms slightly crossed, resolute expression
RIGHT: full-body PROFILE view, chin raised, gaze toward horizon

FORMAT: 9:16 vertical. Character occupies 70 to 80 percent of vertical frame. Plain pale ochre parchment background.

STYLE RULES: Thick black outlines. Flat color fills -- no hatching, no gradients. Warm sepia palette matching REF IMAGE 2. 2D flat cartoon style matching REF IMAGE 1 proportions.

CRITICAL CHECKLIST:
- 3 views visible on one image: YES
- SAME PERSON as royal version (same face structure, same beard): YES
- SHORT NEAT BEARD clearly visible on all 3 views: YES
- SIMPLE LOW CLOTH WRAP on head (not tall dome cap): YES
- Simpler clothing than royal -- travel-worn indigo: YES
- Only ONE gold necklace (not multiple): YES
- NO paddle or staff in hands: YES
- NO text, no letters, no numerals visible anywhere: YES
- Plain warm parchment background: YES"""


VERSIONS = [
    ("abou-bakari-royal-charref-v1", PROMPT_ROYAL),
    ("abou-bakari-marin-charref-v1", PROMPT_MARIN),
]


async def generate_charref(name: str, prompt: str, ref_bytes_list: list):
    """Generate one character sheet with multiple reference images as input."""
    out_path = OUT_DIR / f"{name}.png"
    print(f"[{name}] starting generation...")
    try:
        contents = []
        for ref_bytes, ref_label in ref_bytes_list:
            contents.append(f"[{ref_label}]")
            contents.append(types.Part.from_bytes(data=ref_bytes, mime_type="image/png"))
        contents.append(prompt)

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
    for ref_path, label in [
        (REF_FORMAT, "REF IMAGE 1 FORMAT"),
        (REF_PALETTE, "REF IMAGE 2 PALETTE"),
        (REF_OPULENCE, "REF IMAGE 3 OPULENCE"),
    ]:
        if not ref_path.exists():
            print(f"ERROR: ref not found: {ref_path}")
            return 1

    ref_bytes_list = [
        (REF_FORMAT.read_bytes(), "REF IMAGE 1 FORMAT"),
        (REF_PALETTE.read_bytes(), "REF IMAGE 2 PALETTE"),
        (REF_OPULENCE.read_bytes(), "REF IMAGE 3 OPULENCE"),
    ]

    print(f"Output dir: {OUT_DIR}")
    print(f"Refs loaded:")
    print(f"  REF 1 FORMAT:   {REF_FORMAT.name}")
    print(f"  REF 2 PALETTE:  {REF_PALETTE.name}")
    print(f"  REF 3 OPULENCE: {REF_OPULENCE.name}")
    print(f"Generating {len(VERSIONS)} character sheets sequentially...")
    print(f"[COST PREVIEW] {len(VERSIONS)} x ~$0.08 = ${len(VERSIONS) * 0.08:.2f}")
    print()

    results = []
    for name, prompt in VERSIONS:
        result = await generate_charref(name, prompt, ref_bytes_list)
        results.append(result)
        print()

    ok = sum(1 for r in results if r)
    print(f"Results: {ok}/{len(VERSIONS)} succeeded")
    return 0 if ok == len(VERSIONS) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
