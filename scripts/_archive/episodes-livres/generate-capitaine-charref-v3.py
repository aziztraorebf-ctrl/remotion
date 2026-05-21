"""Generate capitaine pirogue charref v3 — with long unkempt beard."""

import asyncio
import io
import os
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

STYLE_CLAUSE = """FORMAT: Three views of the same character on a single image -- front view (left), three-quarter view (center), profile view (right). Same layout as REF 1. Plain warm parchment background (pale ochre, no scene, no environment).

PROPORTIONS: Match REF 1 exactly -- chibi/cartoon ratio: large round head (~1/3 body height), short torso, short legs, small hands and feet. NOT realistic proportions.

STYLE: Paper-craft flat cartoon. Warm sepia palette (ochre, burnt sienna, cream). Match REF 2 for warmth. Match REF 1 for structure.

EYES: Dot-eyes -- single small black dot per eye, no iris, no white sclera, no eyelashes, minimal eyebrows.

OUTLINES: Thick clean black outlines. Flat color fills only -- no hatching, no shading gradients, no texture on skin.

CRITICAL: No text, no labels visible anywhere."""

PROMPT = f"""Generate a CHARACTER REFERENCE SHEET for the captain of the only pirogue that returned.

{STYLE_CLAUSE}

CHARACTER: Captain of the only returned pirogue, ~50 years old. Dark brown skin, stocky weathered build. Expression: terrified, haunted -- the face of a man who has seen the open ocean swallow everything.

BEARD: LONG UNKEMPT BEARD -- at least 3-4 cm long, slightly irregular and disheveled, as if not groomed for weeks at sea. Dark brown beard. Clearly longer and more ragged than a short groomed beard. Visible on ALL 3 views.

COSTUME (common sailor/fisherman -- ZERO gold, ZERO royal elements):
- Simple worn linen tunic, earth brown, sleeveless
- Cloth wrap around waist (sienna/ochre, tied loosely)
- Bare feet
- Rope bracelet on one wrist (no other accessories)

THREE-QUARTER VIEW (center): one arm raised, palm facing outward at shoulder level -- gesture of warning, refusal, or warding off.

PALETTE: muted earth tones only (brown, sienna, ochre, dark skin) -- clearly a commoner versus royals. No gold, no embroidery, no ornaments.

COMPOSITION: 9:16 vertical. Three views horizontal. Character ~70% of frame height. Warm parchment background.

CRITICAL: 3 views. Chibi. LONG UNKEMPT BEARD on all 3 views. Dot-eyes. Flat fills. No text. 9:16."""


async def main() -> None:
    name = "capitaine-pirogue-charref-v3"
    out_path = OUT_DIR / f"{name}.png"

    print(f"Generating {name}...")
    print(f"REF1: {REF1_PATH.name} | REF2: {REF2_PATH.name}")
    print(f"Cost: ~$0.04")
    print()

    ref1_bytes = REF1_PATH.read_bytes()
    ref2_bytes = REF2_PATH.read_bytes()

    contents = [
        types.Part.from_bytes(data=ref1_bytes, mime_type="image/png"),
        types.Part.from_bytes(data=ref2_bytes, mime_type="image/png"),
        PROMPT,
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
            img.save(out_path)
            print(f"SAVED: {out_path.name} ({img.size[0]}x{img.size[1]})")
            return

    print("ERROR: no image in response")


if __name__ == "__main__":
    asyncio.run(main())
