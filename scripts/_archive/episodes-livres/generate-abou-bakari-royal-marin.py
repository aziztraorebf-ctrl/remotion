"""Generate 2 charrefs for Abou Bakari II — Royal + Marin versions with short beard."""

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
REF3_PATH = ROOT / "public" / "assets" / "abou-bakari" / "refs" / "mansa-moussa-charref-v2.png"

STYLE_CLAUSE = """FORMAT: Three views on a single image — front view (left), three-quarter view (center), profile view (right). Same layout as REF 1. Plain warm parchment background (pale ochre, no scene, no environment).

PROPORTIONS: Match REF 1 exactly — chibi/cartoon ratio: large round head (~1/3 body height), short torso, short legs, small hands and feet. NOT realistic proportions.

STYLE: Paper-craft flat cartoon. Warm sepia palette (ochre, burnt sienna, cream, gold #D4AF37). Match REF 2 for warmth. Match REF 1 for structure.

EYES: Dot-eyes — single small black dot per eye, no iris, no white sclera, no eyelashes, minimal eyebrows.

OUTLINES: Thick clean black outlines. Flat color fills only — no hatching, no shading gradients, no texture on skin.

CRITICAL: No text, no labels visible anywhere."""

PROMPT_ROYAL = f"""Generate a CHARACTER REFERENCE SHEET for Abou Bakari II — Royal Version.

{STYLE_CLAUSE}

CHARACTER: Abou Bakari II, Mansa of Mali, ~45 years old. Dark brown skin, strong stocky build. SHORT NEAT BEARD (3-4 days, well-groomed, visible on all 3 views). Expression: visionary, determined, gaze slightly toward the horizon.

OPULENCE: Match REF 3 (Mansa Moussa) for level of wealth — Abou Bakari is equally rich. Same weight of gold accessories.

COSTUME (Mali XIVe siecle, same opulence as REF 3):
- Grand boubou DEEP INDIGO with HEAVY gold embroidery at collar, chest panel, sleeves, hem (more elaborate than previous version)
- Headwear: TALL DOMED CAP in gold fabric with indigo geometric embroidery. Wide flat-topped dome sitting high on head — African royal cap. NOT a kofia cylinder, NOT a turban, NOT European crown
- Massive gold necklace with large pendants (same weight as REF 3)
- Gold bracelets both wrists (multiple stacked)
- Leather sandals with gold details
- NO paddle, NO weapon — hands at sides

THREE-QUARTER VIEW (center): one hand raised slightly toward the horizon, the other at his side.

COMPOSITION: 9:16 vertical. Three views horizontal. Character ~70% of frame height. Warm parchment background.

CRITICAL: 3 views. Chibi. SHORT NEAT BEARD all 3 views. Dot-eyes. Flat fills. NO paddle. 9:16."""

PROMPT_MARIN = f"""Generate a CHARACTER REFERENCE SHEET for Abou Bakari II — Seafaring Version.

{STYLE_CLAUSE}

CHARACTER: Abou Bakari II in travel attire — SAME PERSON as the royal version. Same face, same SHORT NEAT BEARD, same dark brown skin, same stocky build. ~45 years old. Expression: resolute, free — a king who chose the ocean.

SAME FACE AS ROYAL VERSION: identical face shape, identical short beard, identical chibi proportions — only the clothing changes.

COSTUME — Travel/seafaring, simplified but noble:
- Boubou medium weight linen, indigo but simpler and slightly travel-worn (no heavy embroidery)
- Cloth wrap around waist in sienna/ochre (practical for sea)
- Headwear: SIMPLE LOW INDIGO CLOTH WRAP (practical for wind) — not the tall dome cap
- ONE gold pendant necklace only (single token of royalty kept)
- Bare forearms (sleeves rolled)
- Simple leather sandals, no gold details
- NO paddle in hands — arms loosely at sides

COMPOSITION: 9:16 vertical. Three views horizontal. Character ~70% of frame. Warm parchment background.

CRITICAL: 3 views. Chibi. SHORT NEAT BEARD all 3 views (same beard as royal version). Clearly same person, different clothes. NO paddle. 9:16."""

CHARACTERS = [
    ("abou-bakari-royal-charref-v1", PROMPT_ROYAL),
    ("abou-bakari-marin-charref-v1", PROMPT_MARIN),
]


async def generate_one(name: str, prompt: str) -> None:
    print(f"[{name}] starting...")
    ref1 = Image.open(REF1_PATH)
    ref2 = Image.open(REF2_PATH)
    ref3 = Image.open(REF3_PATH)

    def pil_to_part(img: Image.Image) -> types.Part:
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return types.Part.from_bytes(data=buf.getvalue(), mime_type="image/png")

    contents = [
        pil_to_part(ref1),
        pil_to_part(ref2),
        pil_to_part(ref3),
        prompt,
    ]

    response = await asyncio.to_thread(
        client.models.generate_content,
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
            temperature=1.0,
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data and "image" in part.inline_data.mime_type:
            img = Image.open(io.BytesIO(part.inline_data.data))
            out_path = OUT_DIR / f"{name}.png"
            img.save(out_path)
            print(f"[{name}] SAVED: {out_path.name} ({img.size[0]}x{img.size[1]})")
            return

    print(f"[{name}] ERROR: no image in response")


async def main() -> None:
    print(f"Generating {len(CHARACTERS)} charrefs...")
    print(f"REF1: {REF1_PATH.name} | REF2: {REF2_PATH.name} | REF3: {REF3_PATH.name}")
    print(f"Cost: ~${len(CHARACTERS) * 0.08:.2f}")
    print()
    await asyncio.gather(*[generate_one(n, p) for n, p in CHARACTERS])
    print(f"\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
