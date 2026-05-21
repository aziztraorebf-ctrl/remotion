"""Regenerate scene-name v5 — Abou Bakari seen from behind, walking toward the ship."""

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

OUT_DIR = ROOT / "public" / "assets" / "abou-bakari" / "scenes"
REFS = ROOT / "public" / "assets" / "abou-bakari" / "refs"
STYLE_ANCHOR = REFS / "style-anchor-scene1-village.png"
REF_MARIN = REFS / "abou-bakari-marin-charref-v1.png"


def pil_part(path: Path) -> types.Part:
    return types.Part.from_bytes(data=path.read_bytes(), mime_type="image/png")


PROMPT = """Generate a paper-craft illustration for Abou Bakari's departure scene.

STRICT PAPER-CRAFT STYLE — NON-NEGOTIABLE:
- Flat 2D storybook illustration. Thick clean black outlines on every shape.
- Flat color fills ONLY — no gradients, no shading, no realistic lighting.
- Warm sepia palette: ochre, burnt sienna, cream, indigo, gold.
- Chibi/cartoon proportions: large round heads, short bodies. Dot-eyes.
- NO photorealism. NO BD. NO manga. STRICTLY paper-craft flat cartoon.
- NO dust particles. NO sparkles. NO text. NO labels.

STYLE ANCHOR (first image): palette and texture reference ONLY.
CHARACTER REF (second image): Abou Bakari in marin attire — same chibi proportions, short neat beard, simpler indigo tunic, low cloth head wrap, single gold pendant.

SCENE: The grand steps of the Mali palace leading down to the royal port, 1311.

CRITICAL — CHARACTER POSITION: Abou Bakari is seen FROM BEHIND — his BACK faces the camera, his FACE is turned AWAY from the viewer. He walks DOWN the steps TOWARD the royal ship waiting at the bottom. We see his back, the cloth wrap on his head, his indigo tunic from behind. He is walking AWAY from us, TOWARD the ship.

Everything else identical to the reference composition:
- Large royal pirogue at the bottom of the steps, directly in his path, with tall mast, INDIGO SAIL with GOLD GEOMETRIC EMBLEM, oarsmen seated at stations
- Additional pirogues of the royal fleet visible on the water behind the flagship
- Guards flanking both sides of the steps: SHORT OCHRE/SIENNA TUNICS, wooden spears, round leather shields — clearly distinct from Abou Bakari
- Palace architecture upper background: tall adobe walls, geometric indigo-and-gold patterns
- NO banners. NO streamers. Solemn departure mood.

9:16 vertical. Abou Bakari FROM BEHIND walking toward the ship. NO text. NO particles. Flat fills. Thick outlines."""


async def main() -> None:
    name = "scene-name-v5"
    out_path = OUT_DIR / f"{name}.png"
    print(f"Generating {name}... Cost: ~$0.04")

    contents = [pil_part(STYLE_ANCHOR), pil_part(REF_MARIN), PROMPT]

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
