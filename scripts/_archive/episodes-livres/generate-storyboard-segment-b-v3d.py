"""
Storyboard Segment B v3d - FULL REGEN with Flash, arrow-in-shoulder fix.

Previous attempts with gemini-3-pro-image-preview and gemini-3.1-flash-image-preview
in edit mode both produced near-identical images (refused to modify panels 4-5).

This script does a COMPLETE regeneration (no source image), using the same
prompt structure as v3b but with the arrow-orientation clause corrected
upstream: the arrow LODGES in the left shoulder from the FRONT, does NOT
pass through the body.

Refs: Soundjata + Soumaoro combat sheets (identity anchors only).
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
OUT_PATH = REFS_DIR / "storyboard-segment-B-v3d.png"

IDENTITY_REFS = [
    REFS_DIR / "soundjata-combat-ref.png",
    REFS_DIR / "soumaoro-combat-ref.png",
]

PROMPT = """Generate a NEW black-and-white sketch storyboard page.

CRITICAL LAYOUT:
- EXACTLY 5 panels, no more, no less
- SINGLE HORIZONTAL ROW (one row only, read left to right)
- NOT a 2x3 grid, NOT 4 panels, NOT 6 panels - ONLY 5 panels
- Each panel is a tall vertical rectangle (portrait orientation), arranged side by side
- All 5 panels same size
- Clean rectangular borders

CONTENT STYLE:
- Pencil/graphite sketch style with rapid gestural lines
- Small soft dabs of desaturated red acceptable for the aura wisps
- NO text, NO speech bubbles, NO panel numbers
- All drawn content STAYS FULLY INSIDE its own panel border

CHARACTERS (from reference images provided):
- Image 1 = SOUNDJATA (young warrior with braided hair, white tunic, red sash, gold bracelet) - we see ONLY HIS HANDS AND ARMS in panels 1-2 (first-person POV)
- Image 2 = SOUMAORO (older sorcerer-king, long dreadlocks, black robe with bone amulets, dark red magical aura on hands) - appears in panels 3, 4, 5

PANEL 1 (leftmost) - FIRST-PERSON POV, SOUNDJATA DRAWS THE BOW. We see through his own eyes: his LEFT hand extended forward gripping a wooden bow vertically, his RIGHT hand pulling the bowstring back to his cheek. A single ARROW is nocked, pointing FORWARD into the distance, with a small rooster spur tied near the arrowhead. Bow fully bent, string taut. Partial view of white tunic sleeve and GOLD BRACELET on left wrist. In the far distance at center, SOUMAORO's tiny distant figure on the savanna plain, arms raised outward, glowing red aura around his hands - unaware. Amber savanna, acacia trees on horizon.

PANEL 2 - FIRST-PERSON POV, SAME EXACT ANGLE AS PANEL 1, SHOWING THE INSTANT AFTER RELEASE. His RIGHT hand fingers SPLAYED OPEN, bowstring VIBRATING BACKWARD in motion blur. The arrow is NO LONGER IN THE PANEL - it has just flown away into the distance. Only motion streaks remain where it departed. LEFT hand still grips the bow. Same distant view of Soumaoro on horizon. Strict continuity with Panel 1 angle.

PANEL 3 - EXTERNAL LATERAL SIDE-VIEW OF THE ARROW IN FLIGHT. Camera outside (no longer POV). ONE arrow flies HORIZONTALLY from LEFT to RIGHT across the panel. The ARROWHEAD (sharp metal tip with rooster spur tied near it) is positioned toward the RIGHT side of the panel, clearly POINTING RIGHT. The TAIL FEATHERS are on the LEFT side. Motion streaks and radial speed lines TRAIL BEHIND the arrow to the LEFT. Dust-blurred warm savanna in the background. At the far RIGHT edge, SOUMAORO's distant figure is visible, arms raised, aura glowing red, unaware. One arrow only, unambiguous direction.

PANEL 4 - MEDIUM SHOT, IMPACT: Soumaoro struck by ONE arrow in his LEFT SHOULDER. VERY IMPORTANT: the arrow ENTERS his LEFT shoulder FROM THE FRONT (from the viewer side) and LODGES there. The arrow DOES NOT pass through his body. Only the TAIL FEATHERS (empennage) and about HALF of the wooden shaft are visible, protruding from the FRONT of his left shoulder toward the viewer. The arrowhead is buried in the shoulder flesh and is NOT visible. His body JERKS BACKWARD violently: torso cambered back, both arms FLYING UP and OUTWARD, one foot LIFTING off the ground. His red magical aura EXPLODES into scattered dispersing wisps all around him - no longer contained, blown apart. Dreadlocks WHIP back wildly. Face contorted in sharp shock and pain - eyes wide, mouth open in silent scream, teeth bared. Dust kicks up at his feet. Dynamic action lines radiate from the impact point. Shown from a 3/4 FRONT-FACING angle so the arrow's feathered tail is visible sticking OUT of the FRONT of his left shoulder.

PANEL 5 (rightmost) - MEDIUM CLOSE, TERROR: Soumaoro standing but visibly wounded and UNSTABLE. The SAME ONE arrow from Panel 4 is still lodged in his LEFT shoulder. The tail feathers and half shaft still protrude from the FRONT of his left shoulder (same orientation as Panel 4, arrow does not pass through, only one visible wound). His LEFT HAND clutches the shaft of the arrow where it enters his flesh. Body hunched slightly forward, knees slightly bent. Face shows PURE TERROR: eyes wide open, mouth open in silent gasp, jaw slack, teeth bared, dreadlocks disheveled around his face. He glances SIDEWAYS over his wounded shoulder with wild fearful eyes. NO MORE AURA - only faint wisps of dissipating red smoke fading around him. Savanna and dust behind him, slightly cooler/dimmer atmosphere. Body language of IMMINENT FLIGHT but he has not yet moved. Shown from a 3/4 FRONT-FACING angle matching Panel 4 - same side of body, same wound visible from same angle.

ARROW CONSISTENCY RULE: in both Panel 4 and Panel 5, the arrow is the SAME single arrow, lodged in the SAME LEFT SHOULDER, visible from the SAME 3/4 FRONT angle with tail feathers protruding from the FRONT of his shoulder. NEVER show the arrow passing through the body. NEVER show the arrow entering from behind. NEVER show a second arrow in his chest or back. Only one arrow, in the left shoulder, entering from front.

STYLE: loose graphite pencil storyboard with dynamic action lines in panels 2-4 (speed streaks, impact bursts, aura explosion rays, motion arcs), quieter emotionally-focused sketch in panel 5 (less motion, careful facial rendering). Black lines on cream/white paper. Small soft dabs of desaturated red for the aura wisps. No text.

FINAL LAYOUT REMINDER: 5 panels, single horizontal row, read left to right."""


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
    print(f"[GEN] Storyboard Segment B v3d (full regen, Flash, shoulder-locked) -> {OUT_PATH.name}")
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
