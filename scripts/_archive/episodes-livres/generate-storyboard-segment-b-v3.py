"""
Storyboard Segment B v3 Generator — POV-first design.

Major redesign vs v2:
- Panels 1 + 2 in FIRST-PERSON POV (we see Soundjata's own hands drawing
  and releasing the bow) - matches continuity from Segment A which ended
  on Soundjata's hands binding the arrow
- Panel 3 = arrow in flight, lateral side-view (not foreshortened -
  avoids ambiguous arrow direction)
- Panel 4 = impact, Soumaoro body jerks backward, arrow enters from
  front, aura explodes
- Panel 5 = Soumaoro standing staggered, clutching wound, eyes filled
  with terror - we SUGGEST the upcoming flight without showing it

Refs: Soundjata + Soumaoro combat sheets (identity anchors).
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
OUT_PATH = REFS_DIR / "storyboard-segment-B-v3.png"

IDENTITY_REFS = [
    REFS_DIR / "soundjata-combat-ref.png",
    REFS_DIR / "soumaoro-combat-ref.png",
]

PROMPT = """Generate a NEW black-and-white sketch storyboard page showing 5 panels in
a HORIZONTAL STRIP LAYOUT (1 row of 5 rectangular cells side by side,
read left to right). Pencil/graphite sketch style with rapid gestural
lines, dynamic action-focused linework - NO color, NO ink wash, NO text,
NO speech bubbles, NO panel numbers, NO borders around the whole page.
Each of the 5 panels has a clean rectangular border AND all drawn content
STAYS FULLY INSIDE its panel border (no elements crossing panel edges).

The two reference images provided show the identity of the two characters:
- Image 1 = SOUNDJATA (young warrior with braided hair, white tunic, red
  sash, gold bracelet) - we see ONLY HIS HANDS AND ARMS in panels 1-2
  (first-person POV), he does NOT appear in panels 3-5
- Image 2 = SOUMAORO (older sorcerer-king, long dreadlocks, black robe
  with bone amulets, dark red magical aura on hands) - he appears in
  panels 3, 4, and 5

Match Soundjata's skin tone, hand proportions, white tunic sleeve, gold
bracelet from the reference. Match Soumaoro's body, face, costume,
amulets, dreadlocks from his reference.

PANEL 1 (leftmost) - FIRST-PERSON POV, SOUNDJATA DRAWS THE BOW. We see
through Soundjata's own eyes, looking forward down his arms at his bow.
His LEFT hand is extended forward gripping the bow vertically at the
center of the frame; his RIGHT hand is closer to us pulling the bowstring
back to his cheek. A single ARROW is nocked and pointed FORWARD (pointing
away from us, deep into the frame), with a small rooster spur visible
tied near the arrowhead. The bow is fully bent, string taut. Partial
view of Soundjata's white tunic sleeve and gold bracelet on the left
wrist. In the far distance at the center of the frame, SOUMAORO's tiny
distant figure is visible on a savanna plain, arms raised outward,
glowing red aura around his hands - unaware he is being targeted.
Amber savanna, acacia trees blurred on the horizon.

PANEL 2 - FIRST-PERSON POV, SAME EXACT ANGLE AS PANEL 1 but showing the
INSTANT AFTER THE RELEASE. His RIGHT hand fingers are now SPLAYED OPEN
from the release, the bowstring is VIBRATING BACKWARD violently in a
motion blur. The arrow itself is NO LONGER IN THE PANEL AT ALL - it has
already flown off into the distance. Only motion lines remain where the
arrow just departed at the center-deep of the frame. His LEFT hand still
grips the bow, now relaxed. Same distant view: Soumaoro still tiny on
the horizon, about to be hit. Same savanna, same angle as Panel 1 -
strict continuity.

PANEL 3 - LATERAL SIDE-VIEW OF THE ARROW IN FLIGHT (no longer POV, we
now see the arrow from the side as an external observer). The arrow
flies HORIZONTALLY through the frame, from the LEFT side of the panel
toward the RIGHT side. The arrowhead (sharp metal tip, rooster spur
clearly tied near it) is at the RIGHT edge of the panel pointing RIGHT.
The tail feathers are on the LEFT edge. Motion streaks and radial speed
lines TRAIL BEHIND the arrow (extending to the left). In the blurred
background at the far right of the panel, Soumaoro's distant figure is
visible, arms raised, aura glowing red, unaware - the arrow is about to
reach him. Dust-blurred warm savanna atmosphere. Sense of incredible
speed and inevitability.

PANEL 4 - MEDIUM SHOT: IMPACT. Soumaoro struck hard in the LEFT shoulder
- the arrowhead has ENTERED his shoulder FROM THE FRONT (chest side) and
the tip protrudes OUT of the back of his shoulder. The wooden shaft is
clearly visible on his chest side. His body JERKS BACKWARD violently:
torso cambered back, both arms flying UP and OUTWARD in a reflex, one
foot lifting off the ground from the recoil. His red magical aura
EXPLODES into scattered dispersing wisps all around him - no longer
contained in his hands, blown apart by the impact, floating in fragments
in the air. Dreadlocks WHIP back wildly. Face contorted in sharp shock
and pain, mouth open in a silent cry, eyes wide. Dust rises at his feet
from the staggering step. Dynamic action lines radiating from the impact
point.

PANEL 5 (rightmost) - MEDIUM CLOSE SHOT: Soumaoro standing but VISIBLY
STAGGERED and BLEEDING. The arrow is still lodged in his left shoulder.
His LEFT HAND clutches the wound tightly (grabbing the arrow shaft near
where it enters his flesh). His body is hunched forward in pain, knees
slightly bent as if about to collapse or bolt. His face shows PURE
TERROR: eyes wide open, mouth open in a silent gasp, jaw slack, teeth
bared, dreadlocks disheveled around his head. He looks backward over his
wounded shoulder with wild fearful eyes - the look of a once-powerful
tyrant who realizes he is mortal. NO MORE AURA: only faint wisps of
dissipating red smoke fading away in the air around him. Savanna and
dust in the background, slightly cooler/dimmer atmosphere than earlier
panels. The posture suggests he is about to flee but has not yet moved -
suspended moment of dawning defeat.

STYLE: loose graphite pencil storyboard with dynamic action lines in
panels 2-4 (speed streaks, impact bursts, aura explosion rays, motion
arcs), and a quieter more emotionally-focused sketch style in panel 5
(less motion, more careful facial rendering, atmospheric haze via gentle
hatching). Black lines on white paper throughout. No color. No text
inside any panel. Professional animation action storyboard feel.

FORMAT: single page, HORIZONTAL STRIP with 5 equal-sized panels in 1
row, landscape orientation, all 5 panels visible and readable at once.
CRITICAL: every drawn element stays strictly WITHIN its own panel border
- no arrows, hands, dust, or motion lines crossing from one panel into
the next."""


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
    print(f"[GEN] Storyboard Segment B v3 (POV design) -> {OUT_PATH.name}")
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
