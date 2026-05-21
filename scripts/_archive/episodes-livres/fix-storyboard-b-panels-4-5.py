"""
Storyboard Segment B v3c - Surgical fix on panels 4 and 5 only.

Uses gemini-3-pro-image-preview (surgical edit) to preserve panels 1-2-3
of the existing v3b storyboard and replace only panels 4 and 5 so the
arrow direction is consistent (arrow enters LEFT SHOULDER from the front,
stays lodged, does NOT transpierce through the body).

Input  : storyboard-segment-B-v3b.png (panels 1-3 good, 4-5 inconsistent)
Output : storyboard-segment-B-v3c.png

The fix resolves the v3b problem:
  v3b Panel 4 shows arrow coming from front (empennage visible on chest).
  v3b Panel 5 shows arrow shaft OUT of the chest (implying arrow from behind).
Resolution: Option 3 - arrow lodges in the LEFT SHOULDER, does not pass
through. Same wound visible in both Panel 4 and Panel 5, consistent angle.
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
# Surgical editor - preserves source composition
MODEL = "models/gemini-3-pro-image-preview"

ROOT = Path(__file__).parent.parent.parent
REFS_DIR = ROOT / "public" / "assets" / "library" / "geoafrique" / "soundjata" / "combat-refs"
SOURCE_PATH = REFS_DIR / "storyboard-segment-B-v3b.png"
OUT_PATH = REFS_DIR / "storyboard-segment-B-v3c.png"

PROMPT = """This is a black-and-white pencil sketch storyboard with 5 panels in a
single horizontal row.

TASK: Keep panels 1, 2, and 3 (the three LEFT panels) COMPLETELY IDENTICAL
to the source image - do NOT change anything in those three panels.

REPLACE ONLY panels 4 and 5 (the two RIGHT panels) with NEW content
following the descriptions below. Maintain the same pencil sketch style,
same panel borders, same panel size and position as the existing panels.

NEW PANEL 4 (fourth from left - IMPACT): Soumaoro struck by an arrow in
his LEFT SHOULDER. The arrow ENTERS his left shoulder FROM THE FRONT
(entered his body from the viewer's angle) and LODGES there - the arrow
does NOT pass through his body, it stays planted in the shoulder. Only
the TAIL FEATHERS / empennage and about half of the shaft are visible
protruding from the FRONT of his shoulder. The arrowhead is buried
inside, not visible from behind. His body JERKS BACKWARD violently from
the impact - torso cambered back, both arms FLYING UP and OUTWARD in a
reflex, one foot LIFTING off the ground. His red magical aura EXPLODES
into scattered dispersing wisps around him - no longer contained, blown
apart. Dreadlocks WHIP back wildly. Face contorted in sharp shock and
pain - eyes wide, mouth open in silent scream, teeth bared. Dust kicks
up at his feet. Dynamic action lines radiating from the impact point on
his shoulder. He is shown from a 3/4 front-facing angle so we clearly
see the arrow entering his left shoulder FROM THE FRONT.

NEW PANEL 5 (rightmost - TERROR): Soumaoro standing, slightly hunched
forward, staggered and wounded. The SAME arrow from Panel 4 is still
LODGED in his left shoulder - we see the empennage and half-shaft
sticking OUT of the FRONT of his shoulder (same orientation as Panel 4 -
the arrow did NOT pass through). His LEFT HAND clutches the shaft of
the arrow where it enters his flesh, as if he's about to try pulling it
out or just trying to endure the pain. Body hunched slightly forward,
knees slightly bent. Face shows PURE TERROR: eyes wide open, mouth open
in silent gasp, jaw slack, teeth bared, dreadlocks disheveled around his
face. He looks SIDEWAYS over his wounded shoulder with wild fearful
eyes - the look of a fallen tyrant realizing he is mortal. NO AURA -
only faint wisps of dissipating red smoke fading in the air around him.
Savanna and dust behind him, slightly cooler/dimmer atmosphere than the
earlier panels. Posture suggests IMMINENT FLIGHT but he has not yet
moved. He is shown from a 3/4 front-facing angle to match Panel 4 - same
side of the body, same wound visible from the same angle.

CRITICAL CONSISTENCY: The arrow in Panel 4 and Panel 5 is the SAME
arrow, lodged in the SAME LEFT SHOULDER, visible from the SAME 3/4
FRONT angle, with the SAME empennage protruding from the FRONT of his
left shoulder. No arrow-through-the-back shown. No arrow-in-chest shown.
Only arrow-lodged-in-left-shoulder-from-front.

STYLE: pencil sketch, black lines on white paper, dynamic action lines
in Panel 4 (impact bursts, aura explosion wisps, motion arcs), quieter
more emotional sketch in Panel 5 (less motion, careful facial rendering,
atmospheric haze). Panel 5 has a slightly darker/grayer background to
suggest cooler atmosphere. Soft dabs of desaturated red color are
acceptable for the aura wisps (as in the source image).

DO NOT modify panels 1, 2, or 3 in any way. Preserve the left three
panels exactly as they are in the source image."""


def main():
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(f"Source storyboard missing: {SOURCE_PATH}")

    with open(SOURCE_PATH, "rb") as f:
        src_bytes = f.read()
    print(f"[SRC] {SOURCE_PATH.name} ({len(src_bytes)} bytes)")

    contents = [
        types.Part.from_bytes(data=src_bytes, mime_type="image/png"),
        PROMPT,
    ]

    print(f"[GEN] surgical edit via {MODEL}")
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
    main()
