"""
Storyboard Segment B v3c - Surgical fix on panels 4-5 using FLASH.

Previous attempt with gemini-3-pro-image-preview produced a near-identical
image (refused to modify). Retrying with gemini-3.1-flash-image-preview
which is the correct tool for surgical edits with source image.

Goal: preserve panels 1-2-3 from v3b, replace panels 4-5 so the arrow
orientation is consistent (arrow lodges in LEFT SHOULDER from the FRONT,
does NOT pass through body).
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
SOURCE_PATH = REFS_DIR / "storyboard-segment-B-v3b.png"
OUT_PATH = REFS_DIR / "storyboard-segment-B-v3c.png"

PROMPT = """This is a black-and-white pencil sketch storyboard with 5 panels in a
single horizontal row.

TASK: Keep panels 1, 2, and 3 (the three LEFT panels) EXACTLY IDENTICAL
to the source image. Do not change anything in those three panels.

COMPLETELY REDRAW panels 4 and 5 (the two RIGHT panels) with NEW content
as described below. The new drawings of panels 4 and 5 must VISIBLY
DIFFER from the source image. Use the same pencil sketch style, same
panel borders, same panel size and position, same B&W look with soft
dabs of red for aura wisps.

NEW PANEL 4 - IMPACT (fourth panel from left):
Soumaoro struck by ONE arrow in his LEFT SHOULDER. Critical: the arrow
ENTERS his LEFT shoulder FROM THE FRONT (from the viewer side) and
LODGES INSIDE - it does NOT pass through his body. Only the TAIL
FEATHERS (empennage) and approximately HALF of the wooden shaft are
visible, all protruding from the FRONT of his left shoulder toward the
viewer. The arrowhead is buried deep in the shoulder flesh and is NOT
visible.
His body JERKS BACKWARD violently from the impact: torso cambered back,
both arms FLYING UP and OUTWARD in a reflex, one foot LIFTING off the
ground. His red magical aura EXPLODES into scattered dispersing wisps
all around him - no longer contained. Dreadlocks WHIP back wildly.
Face contorted in sharp shock and pain: eyes wide, mouth open in a
silent scream, teeth bared. Dust kicks up at his feet. Dynamic action
lines radiate from the impact point on his shoulder.
He is shown from a 3/4 FRONT-FACING angle so the viewer clearly sees
the arrow's tail feathers sticking OUT of the FRONT of his left
shoulder.

NEW PANEL 5 - TERROR (fifth/rightmost panel):
Soumaoro standing, slightly hunched forward, wounded and terrified.
The SAME ONE arrow from Panel 4 is still lodged in his left shoulder.
We see the tail feathers and half the shaft sticking OUT of the FRONT
of his left shoulder (same orientation as Panel 4, arrow is not through
the body, only one visible wound).
His LEFT HAND clutches the shaft of the arrow where it enters his flesh.
Body hunched slightly forward, knees slightly bent.
Face shows PURE TERROR: eyes wide open, mouth open in silent gasp, jaw
slack, teeth bared, dreadlocks disheveled around his face. He looks
SIDEWAYS over his wounded shoulder with wild fearful eyes.
NO MORE AURA - only faint wisps of dissipating red smoke fading around
him.
Background slightly cooler/darker than earlier panels.
Posture suggests IMMINENT FLIGHT but he has not yet moved.
He is shown from a 3/4 FRONT-FACING angle matching Panel 4, same wound
visible from same angle.

CONSISTENCY RULE FOR PANELS 4 AND 5:
The arrow is the SAME arrow in both panels. It is lodged in the SAME
LEFT SHOULDER. It is visible from the SAME FRONT 3/4 angle. The tail
feathers protrude from the FRONT of his shoulder in BOTH panels. Never
show the arrow passing through the body. Never show the arrow entering
from behind. Never show the arrow in his chest or back.

STYLE: pencil sketch, black lines on cream/white paper, dynamic action
lines in Panel 4 (impact bursts, motion arcs, aura explosion wisps),
quieter more emotional sketch in Panel 5 (less motion, careful facial
rendering). Small dabs of desaturated red for the aura wisps, matching
the style of the existing Panels 1-3.

REMINDER: only Panels 4 and 5 change. Panels 1, 2, 3 stay exactly as
in the source. The output image must show visible differences in
Panels 4 and 5 compared to the source."""


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
