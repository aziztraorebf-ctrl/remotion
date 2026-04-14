"""
Storyboard Segment B v2 Generator - Soundjata Acte V (battle + impact + fuite).

Major rewrite vs v1:
- 5 panels (not 4) to include the fuite of Soumaoro into the mountains
- Horizontal strip layout (1 row of 5 cells, not 2x2 grid)
- Panel 1 replaces aerial army charge with Soundjata in savanna + blurred
  armies suggested in background - restores continuity with Segment A
- Panel 2 is an actual release-of-arrow action shot (fixes "static Soumaoro")
- Panel 4 is impact + reaction (arrow FROM FRONT, aura EXPLODES) - fixes
  the v1 problems: static pose, flipped arrow, no physical reaction
- Panel 5 is the contemplative fuite into mountains - new, covers tyranFuite

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
OUT_PATH = REFS_DIR / "storyboard-segment-B-v2.png"

IDENTITY_REFS = [
    REFS_DIR / "soundjata-combat-ref.png",
    REFS_DIR / "soumaoro-combat-ref.png",
]

PROMPT = """Generate a NEW black-and-white sketch storyboard page showing 5 panels in
a HORIZONTAL STRIP LAYOUT (1 row of 5 rectangular cells side by side,
read left to right). Pencil/graphite sketch style with rapid gestural
lines, dynamic action-focused linework - NO color, NO ink wash, NO text,
NO speech bubbles, NO panel numbers, NO borders around the whole page.
Each of the 5 panels has a clean rectangular border.

The two reference images provided show the identity of the two characters
that MUST appear in the storyboard:
- Image 1 = SOUNDJATA (young warrior with braided hair, white tunic, red
  sash) - he appears in panels 1 and 2
- Image 2 = SOUMAORO (older sorcerer-king, long dreadlocks, black robe,
  red magical aura on hands) - he appears in panels 3, 4, and 5

Match body proportions, faces, costume silhouettes from refs, but render
everything as a rough black-and-white pencil sketch. This storyboard is
the CONTINUATION of an earlier sequence where Soundjata finished binding
a rooster spur to an arrow - maintain visual continuity (same Soundjata,
same costume, same savanna setting).

PANEL 1 (leftmost) - WIDE LOW-ANGLE HEROIC: Soundjata stands in the
savanna plain, feet planted wide, arms fully extended, drawing back a
longbow to full tension. Arrow nocked with a small rooster spur visible
near the arrowhead. His expression sharp and focused. Behind him on both
sides, BLURRY DISTANT SILHOUETTES of two armies (small out-of-focus
figures with spears raised) - suggested, not detailed. Acacia trees in
the background. Amber savanna sky.

PANEL 2 - MEDIUM CLOSE ACTION SHOT: Soundjata captured mid-release - his
right-hand fingers have just opened, the bowstring is still vibrating
backward, the arrow has just left the bow and is streaking off-frame to
the right with motion lines trailing from its tail. His face is
determined, eyes locked forward. Cropped framing on torso and arms. The
arrow itself extends off-frame right - only the tail feathers and a bit
of shaft visible as it exits.

PANEL 3 - EXTREME FORESHORTENED ARROW POV: the arrow mid-flight,
arrowhead pointing straight at the viewer, motion streaks and radial
speed lines trailing behind the shaft. Rooster spur still visible tied
near the arrowhead. The shaft fills the vertical center of the panel. At
the far end of the perspective, Soumaoro's full figure is visible - arms
raised outward, red magical aura around his palms, standing unaware.
Dust-blurred savanna on the sides. Sense of incredible speed.

PANEL 4 - MEDIUM SHOT: IMPACT. Soumaoro struck hard in the LEFT shoulder
- the arrowhead has PIERCED his shoulder FROM THE FRONT and exits out
the back; empty wooden shaft visible coming out his chest side. His body
JERKS backward violently, torso torqued, arms flying up and outward. His
red magical aura EXPLODES into scattered dispersing wisps around him -
not contained anymore, blown apart. Dreadlocks whip in the recoil. One
foot staggering back. Face contorted in shock and pain, mouth open in a
grimace. Dust rises at his feet from the impact.

PANEL 5 (rightmost) - WIDE CONTEMPLATIVE DISTANT SHOT: Soumaoro seen
from BEHIND, walking away from the camera into the distance. His
silhouette is small in the frame (he's already far). He walks slowly,
his body stooped, dreadlocks hanging. Around him and between him and the
viewer, thick clouds of ochre dust drift. At the horizon, JAGGED
MOUNTAIN SILHOUETTES - a new colder landscape beyond the savanna. An
acacia tree silhouette frames the left edge of the panel. No aura, no
magic, no power - just a defeated figure disappearing. Quiet, final.

STYLE: loose graphite pencil storyboard with dynamic action lines in
panels 2-4 (speed lines, motion streaks, impact bursts, aura explosion
rays), and a softer more contemplative sketch style in panel 5 (fewer
hard lines, atmospheric haze indicated by gentle hatching). Black lines
on white paper throughout. No color. No text inside any panel.
Professional animation action storyboard feel.

FORMAT: single page, HORIZONTAL STRIP with 5 equal panels in 1 row,
landscape orientation, all 5 panels visible and readable at once."""


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
    print(f"[GEN] Storyboard Segment B v2 -> {OUT_PATH.name}")
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
