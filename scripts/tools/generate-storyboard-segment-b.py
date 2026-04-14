"""
Storyboard Segment B Generator — Soundjata Acte V (Bataille + fleche + fuite).

Generates a 4-panel pencil sketch storyboard (2x2 grid, B&W) to be used as
[REF_STORYBOARD] in the Seedance storyboard-to-video test.

Panels:
1. WIDE AERIAL — Two armies charging in savanna
2. LOW ANGLE HEROIC — Soundjata drawing bow, arrow nocked
3. FORESHORTENED — Arrow in flight toward camera
4. MEDIUM — Soumaoro struck, aura fading, running away

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
OUT_PATH = REFS_DIR / "storyboard-segment-B.png"

IDENTITY_REFS = [
    REFS_DIR / "soundjata-combat-ref.png",
    REFS_DIR / "soumaoro-combat-ref.png",
]

PROMPT = """Generate a NEW black-and-white sketch storyboard page showing 4 panels in
a 2x2 grid layout. Pencil/graphite sketch style with rapid gestural lines,
dynamic action-focused linework - NO color, NO ink wash, NO text, NO
speech bubbles, NO panel numbers. Each panel has clean rectangular borders.

The two reference images provided show the identity of the two characters
that MUST appear in the storyboard:
- Image 1 = SOUNDJATA (young warrior with braided hair, white tunic, red
  sash) - he appears in panels 2 and 3 context
- Image 2 = SOUMAORO (older sorcerer-king, long dreadlocks, black robe,
  red magical aura on hands) - he appears in panel 4

Match the body proportions, faces, and costume silhouettes from the refs,
but render everything as a rough black-and-white pencil sketch. This
storyboard continues from an earlier sequence - maintain visual continuity.

PANEL 1 (top-left) - WIDE HIGH AERIAL SHOT: bird's-eye 3/4 view of a vast
savanna plain. Two massive armies charging at each other from left and
right, about to clash in the middle. Hundreds of tiny warrior figures
with lances and shields raised. Huge cloud of dust rising from both
armies. Dynamic diagonal composition conveying mass movement. Acacia
trees scattered in the distance.

PANEL 2 (top-right) - LOW ANGLE HEROIC SHOT: tight framing on Soundjata
standing with feet wide apart, arms fully extended, drawing back a longbow
to full tension. An arrow is nocked and aimed forward. His expression is
sharply focused, determined. Shot from below looking up at him, sky and
rising dust behind him. Keep the white tunic and red sash silhouette.

PANEL 3 (bottom-left) - FORESHORTENED ARROW-IN-FLIGHT: extreme
foreshortened close-up of the arrow mid-flight, the arrowhead pointing
toward the camera/viewer. Motion blur lines streaking behind the arrow
shaft. Tiny rooster spur/bone visible tied near the arrowhead. Blurred
battlefield far in the background. Sense of incredible speed.

PANEL 4 (bottom-right) - MEDIUM SHOT: Soumaoro struck by the arrow in
his shoulder, body recoiling, his red magical aura dispersing and fading
into wisps. He has just turned his back and is running away from camera
into a cloud of dust. We see him from a 3/4 back angle. Expression of
shock and panic visible on the side of his face. Dreadlocks flying
behind him mid-motion.

STYLE: loose graphite pencil storyboard sketch with MORE dynamic action
lines than a typical sketch - speed lines, motion streaks, impact bursts.
Visible hatching and gestural linework. Black lines on white paper. No
color. No text inside the panels. Professional animation action
storyboard feel.

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
    print(f"[GEN] Storyboard Segment B -> {OUT_PATH.name}")
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
