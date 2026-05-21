"""
Storyboard Segment A Generator — Soundjata Acte V (Setup mystique + revelation).

Generates a 4-panel pencil sketch storyboard (2x2 grid, B&W) to be used as
[REF_STORYBOARD] in the Seedance storyboard-to-video test.

Panels:
1. WIDE — Soumaoro invulnerable, arrows bouncing off
2. CLOSE-UP — Soumaoro face, cruel grin
3. MEDIUM — Soundjata crouched, griot sage whispering the secret
4. TIGHT CLOSE-UP — hands binding a rooster spur to an arrow

Refs passed: Soundjata + Soumaoro combat refs (identity anchors).
"""

import io
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

ROOT = Path(__file__).parent.parent.parent
REFS_DIR = ROOT / "public" / "assets" / "library" / "geoafrique" / "soundjata" / "combat-refs"
OUT_PATH = REFS_DIR / "storyboard-segment-A.png"

IDENTITY_REFS = [
    REFS_DIR / "soundjata-combat-ref.png",
    REFS_DIR / "soumaoro-combat-ref.png",
]

PROMPT = """Generate a NEW black-and-white sketch storyboard page showing 4 panels in
a 2x2 grid layout. Pencil/graphite sketch style with rapid gestural lines
- NO color, NO ink wash, NO text, NO speech bubbles, NO panel numbers.
Each panel has clean rectangular borders.

The two reference images provided show the identity of the two characters
that MUST appear in the storyboard:
- Image 1 = SOUNDJATA (young warrior with braided hair, white tunic, red
  sash, curved sabre) - he appears in panels 3 and 4
- Image 2 = SOUMAORO (older sorcerer-king, long dreadlocks, black robe,
  red magical aura on hands) - he appears in panels 1 and 2

Match the body proportions, faces, and costume silhouettes from the refs,
but render everything as a rough black-and-white pencil sketch.

PANEL 1 (top-left) - WIDE SHOT: Soumaoro standing at center, arms raised
outward with both palms open (casting pose), a visible aura/energy swirl
around his hands. Several arrows frozen mid-air around him bouncing off
or breaking against an invisible shield. Broken arrow shafts scattered
on the ground at his feet. He is laughing, chin lifted, supreme.

PANEL 2 (top-right) - EXTREME CLOSE-UP on Soumaoro's face: tight frame
on his head and shoulders, cruel triumphant grin, intense menacing eyes
looking slightly up, wisps of magical smoke curling around his head.
Dreadlocks visible.

PANEL 3 (bottom-left) - MEDIUM SHOT: Soundjata crouched low on one knee,
body turned slightly. Beside him, an old griot sage (elderly African man
with a long beard, simple boubou robe, holding a walking staff) leans
close to Soundjata's ear, whispering. The griot points off-panel with his
free hand. Soundjata's expression is intense and focused, eyes wide with
sudden understanding.

PANEL 4 (bottom-right) - TIGHT CLOSE-UP on Soundjata's hands: both hands
visible, carefully binding a small white rooster spur (a small curved
claw-shaped bone, clearly rooster-like) to the tip of an arrowhead with
thin cord. Strong side-light. Pure detail shot, no face.

STYLE: loose graphite pencil storyboard sketch, visible hatching and
gestural linework, some crosshatching for shadow, rough but clear in
composition. Black lines on white paper. No color. No text inside the
panels. Professional animation storyboard feel.

FORMAT: single page, 2x2 grid layout, horizontal landscape orientation,
all 4 panels visible at once."""


def load_ref_parts():
    parts = []
    for ref in IDENTITY_REFS:
        if not ref.exists():
            raise FileNotFoundError(f"Reference image missing: {ref}")
        with open(ref, "rb") as f:
            data = f.read()
        parts.append(types.Part.from_bytes(data=data, mime_type="image/png"))
        print(f"[REF] loaded {ref.name} ({len(data)} bytes)")
    return parts


def generate():
    print(f"[GEN] Storyboard Segment A -> {OUT_PATH.name}")
    contents = load_ref_parts() + [PROMPT]
    resp = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
    )
    for part in resp.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            img = Image.open(io.BytesIO(part.inline_data.data))
            OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            img.save(OUT_PATH, "PNG")
            print(f"[OK] {OUT_PATH} ({img.size})")
            return OUT_PATH
    print("[FAIL] no image returned in response")
    return None


if __name__ == "__main__":
    generate()
