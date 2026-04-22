"""
9-panel storyboard test (visual validation only, no Seedance).

Purpose: validate what a high-density 9-panel storyboard looks like with
Gemini 3.1 Flash, applied to the Segment B content (Soundjata fires
arrow, impact on Soumaoro, terror).

This is for Aziz to SEE the visual feel of a 9-panel layout before
applying the technique to Thiaroye or other future projects.

NOT to be sent to Seedance - no video generation from this storyboard.
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
OUT_PATH = REFS_DIR / "storyboard-9panels-test.png"

IDENTITY_REFS = [
    REFS_DIR / "soundjata-combat-ref.png",
    REFS_DIR / "soumaoro-combat-ref.png",
]

PROMPT = """Generate a NEW black-and-white sketch storyboard page.

CRITICAL LAYOUT:
- EXACTLY 9 panels in a 3x3 GRID (3 rows, 3 columns)
- Each panel is a rectangle with clean border
- Read order: top-left to top-right, then middle row, then bottom row
- All 9 panels same size

CONTENT STYLE:
- Pencil/graphite sketch style with rapid gestural lines
- Small dabs of desaturated red acceptable for aura wisps
- NO text, NO speech bubbles, NO panel numbers
- Dynamic action lines (speed streaks, impact bursts) where appropriate

The two reference images show identity of characters:
- Image 1 = SOUNDJATA (warrior, braided hair, white tunic, red sash, gold bracelet)
- Image 2 = SOUMAORO (sorcerer, long dreadlocks, black robe, bone amulets, red magical aura)

SHOT LIST (9 panels, Soundjata fires an arrow at Soumaoro in the savanna):

PANEL 1 (top-left) - POV FIRST-PERSON, Soundjata draws bow: his left hand grips the bow vertically, right hand pulls string to cheek, arrow nocked. Soumaoro tiny on horizon with red aura. White tunic sleeve and gold bracelet visible.

PANEL 2 (top-middle) - EXTREME CLOSE-UP on Soundjata's right fingers releasing the bowstring, individual fingers splayed open, motion streak where arrow just left. Pure detail shot of the release.

PANEL 3 (top-right) - EXTREME CLOSE-UP on Soundjata's eyes only, intense focus, slight squint, brow furrowed. Cropped tightly on the eyes band across frame.

PANEL 4 (middle-left) - LATERAL SIDE VIEW, arrow flies horizontally left-to-right, arrowhead on right, motion lines trailing left. Single arrow with rooster spur tied near tip. Blurred savanna.

PANEL 5 (middle-middle) - LOW ANGLE on Soumaoro: he stands arms raised with red aura around hands, about to notice the incoming threat. Medium shot.

PANEL 6 (middle-right) - EXTREME CLOSE-UP on Soumaoro's face: eyes wide in sudden realization, mouth starting to open, dreadlocks frozen mid-frame.

PANEL 7 (bottom-left) - IMPACT: medium shot of Soumaoro struck in the left shoulder from the front. Arrow tail feathers protruding from front of shoulder. Body jerks back, one arm flying up. Red aura EXPLODES into scattered wisps around him.

PANEL 8 (bottom-middle) - EXTREME CLOSE-UP on the arrow wound: just the shoulder area, arrow shaft protruding from front, red aura fragments dispersing. Dynamic impact lines radiating from the wound point.

PANEL 9 (bottom-right) - MEDIUM LONG SHOT of Soumaoro: standing staggered, hunched forward, left hand clutching the arrow in his shoulder, face contorted in pure terror (eyes wide, mouth open). NO aura remaining, only faint smoke wisps dissipating. Defeat posture.

STYLE: loose graphite pencil sketch, dynamic action lines in panels 2, 4, 7, 8 (motion streaks, impact bursts, aura explosion), emotional close-ups in panels 3, 6, 9 (careful facial rendering). Black lines on white/cream paper.

FINAL LAYOUT REMINDER: 9 panels in 3x3 grid, read left-to-right top-to-bottom."""


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
    print(f"[GEN] 9-panel storyboard test -> {OUT_PATH.name}")
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
