"""
Gemini 3.1 Flash Image — CRÉATION GUIDÉE PAR RÉFÉRENCES VISUELLES

Différent de gemini-thumbnail-edit.py :
- Edit chirurgical : input = 1 image complète à éditer
- Création guidée   : input = 1 croquis cadrage + N images de référence d'esthétique

Usage:
    python3 scripts/tools/gemini-thumbnail-create-from-refs.py \
        --croquis out/SHOWCASES/thumbnails-sonjata/croquis-v1.png \
        --refs frame1.png frame2.png frame3.png \
        --output out/SHOWCASES/thumbnails-sonjata/sonjata-final.png \
        --brief sonjata-storybook
"""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY missing")
    sys.exit(1)

MODEL = "gemini-3.1-flash-image-preview"


BRIEFS = {
    "sonjata-storybook": """You are creating a YouTube thumbnail by combining a layout draft with a target art style.

INPUT IMAGE 1 (CROQUIS — layout draft):
- This is the LAYOUT TEMPLATE for the final thumbnail
- The orange sky and brown ground define the background zones (KEEP THESE COLORS)
- The CREAM-COLORED TEXT on the right side ("SONJATA · EMPIRE MANDÉ · 1235" and "Les premiers droits de l'homme en Afrique") MUST BE PRESERVED EXACTLY — same position, same font, same color, same size
- The LEFT-CENTER area is INTENTIONALLY EMPTY — this is where you must add the illustrated scene

INPUT IMAGES 2-4 (STYLE REFERENCES — Sonjata V7 video frames):
- These show the EXACT visual style to reproduce
- Notice the characters: rounded heads, large compared to bodies, simple flat colors, dark outlines, expressive eyes
- Notice the village setting: conical thatched huts, stylized baobab trees with rounded "broccoli" canopies, flat earth ground
- Notice the color palette: warm ocre/terracotta/brown earth tones, with character clothing in deep ocre and reds
- Notice the art style: flat 2D children's storybook illustration, NOT photorealistic, NOT dramatic cinematic, NOT 3D — it's a warm hand-drawn cartoon

YOUR TASK:
Create a scene in the EMPTY left-center area of the croquis (image 1) that depicts:
- Sonjata (the hero) as a young Mandinka warrior in the EXACT cartoon style of images 2-4
  - Large rounded head, expressive simple face (cartoon eyes)
  - Standing dignified, perhaps holding a small ceremonial staff or bow
  - Wearing traditional Mandé clothing (ocre/red tones)
- A stylized BAOBAB tree to one side (in the same style as images 2-4 — rounded canopy)
- 2-3 small huts (cases mandingues with conical thatched roofs) in the background
- Maybe 1-2 small villagers in the distance to give scale
- All elements drawn in flat 2D children's storybook cartoon style with dark outlines

ABSOLUTE RULES:
- PRESERVE the cream-colored text on the right exactly as in image 1
- PRESERVE the orange sky and brown ground colors
- DO NOT make it photorealistic
- DO NOT make it dramatic cinematic
- DO NOT use silhouettes or backlighting effects
- DO match the FLAT CARTOON STYLE of the reference frames EXACTLY
- Characters should look warm, friendly, dignified — not scary or dramatic

The result should look like a still frame from the same animated video as the references — same artist, same style.
""",
}


def create_from_refs(croquis_path: Path, refs_paths: list[Path], output_path: Path, brief_key: str) -> int:
    if brief_key not in BRIEFS:
        print(f"ERROR: brief '{brief_key}' not found. Available: {list(BRIEFS.keys())}")
        return 1

    if not croquis_path.exists():
        print(f"ERROR: croquis file not found: {croquis_path}")
        return 1
    for ref in refs_paths:
        if not ref.exists():
            print(f"ERROR: reference file not found: {ref}")
            return 1

    print(f"Croquis: {croquis_path.name} ({croquis_path.stat().st_size // 1024} KB)")
    print(f"Refs : {len(refs_paths)} reference images")
    for ref in refs_paths:
        print(f"   - {ref.name} ({ref.stat().st_size // 1024} KB)")
    print(f"Brief: {brief_key}")
    print(f"[COST PREVIEW] ~$0.04 (single call, multiple image inputs)")
    print()

    client = genai.Client(api_key=API_KEY)

    # Construire la liste de parts :
    # 1) Croquis layout
    # 2-N) Références esthétique
    # N+1) Brief textuel
    parts = []
    parts.append(types.Part.from_bytes(data=croquis_path.read_bytes(), mime_type="image/png"))
    for ref in refs_paths:
        parts.append(types.Part.from_bytes(data=ref.read_bytes(), mime_type="image/png"))
    parts.append(types.Part.from_text(text=BRIEFS[brief_key]))

    print(f"Total parts sent to Gemini: {len(parts)} (1 croquis + {len(refs_paths)} refs + 1 brief)")
    print("Generating image (Gemini 3.1 Flash Image, multi-input)...")

    response = client.models.generate_content(
        model=MODEL,
        contents=parts,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"]
        ),
    )

    if not response.candidates or not response.candidates[0].content.parts:
        print("ERROR: Gemini refused to generate.")
        return 1

    image_saved = False
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(part.inline_data.data)
            print(f"OK {output_path} ({len(part.inline_data.data) // 1024} KB)")
            image_saved = True
        elif hasattr(part, "text") and part.text:
            print(f"[Gemini note] {part.text[:200]}")

    if not image_saved:
        print("ERROR: no image in response")
        return 1
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--croquis", required=True, help="Image PNG du croquis layout")
    parser.add_argument("--refs", required=True, nargs="+", help="Images PNG références esthétique")
    parser.add_argument("--output", required=True)
    parser.add_argument("--brief", required=True, choices=list(BRIEFS.keys()))
    args = parser.parse_args()

    sys.exit(create_from_refs(
        Path(args.croquis),
        [Path(p) for p in args.refs],
        Path(args.output),
        args.brief,
    ))


if __name__ == "__main__":
    main()
