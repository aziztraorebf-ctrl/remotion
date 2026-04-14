"""
Storyboard Segment B v3 REGEN — insists on 5 panels single row.

Previous v3 produced 6 cells in a 2x3 grid; this regen hammers the layout
constraint harder: "EXACTLY 5 cells, single horizontal row, no 2x3 grid,
no extra cells. Cells ordered left to right only."

Content identical to v3 (POV-first design, lateral arrow, staggered
Soumaoro in terror).
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
OUT_PATH = REFS_DIR / "storyboard-segment-B-v3b.png"

IDENTITY_REFS = [
    REFS_DIR / "soundjata-combat-ref.png",
    REFS_DIR / "soumaoro-combat-ref.png",
]

PROMPT = """Generate a NEW black-and-white sketch storyboard page.

CRITICAL LAYOUT RULE (READ CAREFULLY):
- EXACTLY 5 panels, no more, no less
- SINGLE HORIZONTAL ROW (one row only, read left to right)
- NOT a 2x3 grid
- NOT a 2x2 grid with an extra cell
- NOT 6 panels, NOT 4 panels, ONLY 5 panels
- Each panel is a tall vertical rectangle (portrait orientation), arranged side by side in one row
- All 5 panels are the SAME size
- Clean rectangular borders around each panel
- The overall page is a wide landscape format showing the 5 portrait-oriented panels side by side

CONTENT RULES:
- Pencil/graphite sketch style with rapid gestural lines
- NO color, NO ink wash, NO text, NO speech bubbles, NO panel numbers
- All drawn content STAYS FULLY INSIDE its own panel border (no arrows, dust, hands, or motion lines crossing panel edges)

The two reference images provided show the identity of the two characters:
- Image 1 = SOUNDJATA (young warrior with braided hair, white tunic, red sash, gold bracelet) - we see ONLY HIS HANDS AND ARMS in panels 1-2 (first-person POV)
- Image 2 = SOUMAORO (older sorcerer-king, long dreadlocks, black robe with bone amulets, dark red magical aura on hands) - appears in panels 3, 4, 5

Match Soundjata's skin tone, hand proportions, white tunic sleeve, gold bracelet. Match Soumaoro's face, dreadlocks, body, costume, amulets from his reference.

PANEL 1 (leftmost position) - FIRST-PERSON POV, SOUNDJATA DRAWS THE BOW. We see through his own eyes: his LEFT hand extended forward gripping a wooden bow vertically, his RIGHT hand pulling the bowstring back to his cheek. A single ARROW is nocked, pointing FORWARD into the distance, with a small rooster spur tied near the arrowhead. Bow fully bent, string taut. Partial view of his white tunic sleeve and GOLD BRACELET on left wrist. In the far distance at center, SOUMAORO's tiny distant figure on the savanna plain, arms raised outward, glowing red aura around his hands - unaware he is being targeted. Amber savanna, acacia trees blurred on horizon.

PANEL 2 - FIRST-PERSON POV, SAME EXACT ANGLE AS PANEL 1 but showing the INSTANT AFTER THE RELEASE. His RIGHT hand fingers SPLAYED OPEN, the bowstring VIBRATING BACKWARD in motion blur. The arrow is NO LONGER IN THE PANEL - it has just flown away into the distance. Only motion streaks remain where it departed. LEFT hand still grips the bow. Same distant view of Soumaoro tiny on horizon. STRICT continuity with Panel 1 angle.

PANEL 3 - EXTERNAL LATERAL SIDE-VIEW OF THE ARROW IN FLIGHT. The arrow flies HORIZONTALLY from LEFT to RIGHT across the panel. ONLY ONE arrow - no duplicates. The ARROWHEAD (sharp metal tip with rooster spur tied near it) is positioned toward the RIGHT side of the panel, clearly POINTING RIGHT. The TAIL FEATHERS are on the LEFT side. Motion streaks and radial speed lines TRAIL BEHIND the arrow to the LEFT. Dust-blurred warm savanna in the background. At the far RIGHT edge, SOUMAORO's distant figure is visible, arms raised, aura glowing red, unaware the arrow is coming. Sense of speed and inevitability.

PANEL 4 - MEDIUM SHOT: IMPACT. Soumaoro struck HARD by the arrow. The arrowhead has ENTERED his upper left chest / shoulder area FROM THE FRONT; the wooden shaft is lodged in his body, tip exiting from the back. His body JERKS BACKWARD VIOLENTLY - torso cambered back, both arms FLYING UP and OUTWARD in a reflex, one foot LIFTING off the ground from the recoil. His red magical aura EXPLODES into scattered dispersing wisps and fragments all around him - no longer contained, blown apart. Dreadlocks WHIP back wildly. Face contorted in SHARP SHOCK and pain - eyes wide, mouth open in silent scream, teeth bared. Dust kicks up at his feet. Dynamic action lines radiating from the impact point. Soumaoro is in FULL REACTIVE MOTION, NOT a static pose.

PANEL 5 (rightmost position) - MEDIUM CLOSE-UP: SOUMAORO STANDING STAGGERED IN TERROR. He is upright but visibly wounded and UNSTABLE. ONE arrow still lodged in his shoulder (not multiple arrows). His LEFT HAND clutches the wound tightly, gripping the shaft. Body hunched forward slightly, knees slightly bent as if about to bolt. Face shows PURE TERROR: eyes wide open, mouth open in silent gasp, jaw slack, teeth bared, dreadlocks disheveled around his head. He glances SIDEWAYS over his wounded shoulder with wild fearful eyes - the look of a fallen tyrant realizing he is mortal. NO AURA - only faint wisps of dissipating red smoke fading in the air around him. Savanna and dust behind him, slightly cooler/dimmer atmosphere than earlier panels. Posture suggests IMMINENT FLIGHT but he has not yet moved. SUSPENDED MOMENT OF DAWNING DEFEAT.

STYLE: loose graphite pencil storyboard with dynamic action lines in panels 2-4 (speed streaks, impact bursts, aura explosion rays, motion arcs); quieter emotionally-focused sketch style in panel 5 (less motion, careful facial rendering, atmospheric haze via gentle hatching). Black lines on white paper throughout. No color. No text.

FINAL LAYOUT REMINDER: 5 panels, single horizontal row, read left to right. No 2x3 grid. No extra sixth panel."""


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
    print(f"[GEN] Storyboard Segment B v3b (regen, strict 5 panels) -> {OUT_PATH.name}")
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
