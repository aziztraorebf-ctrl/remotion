"""Regen Soundjata Acte I storyboard v3: 6 panels 2x3 with Sogolon instead of children.

Change from v2: panel 5 is now MEDIUM SOGOLON & BABY SOUNDJATA (no running children,
no modern clothing risk). Adds Sogolon canonical ref (from insult scene) as 5th input.

Uses Gemini 3.1 Flash Image preview with 5 reference images for identity preservation.
"""

import os
import sys
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not set")
    sys.exit(1)

REPO = Path("/Users/clawdbot/Workspace/remotion")
REFS_DIR = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs"
STYLEREF_DIR = REPO / "tmp/heros-oublies-styleref"

REFS = [
    REFS_DIR / "acte7/elder.png",
    REFS_DIR / "acte7/young.png",
    REFS_DIR / "acte7/female.png",
    REFS_DIR / "acte1/soundjata-baby-ref.png",
    STYLEREF_DIR / "soundjata-insult-starting-pose-styleref.png",
]

OUTPUT = REFS_DIR / "acte1/storyboard-6panels-v3.png"

PROMPT = """Generate a NEW black-and-white pre-production storyboard sketch page in EXACTLY 6 panels arranged in 2 rows x 3 columns layout. Each panel is a 9:16 vertical rectangle with a thin black border. Read order: top-left, top-center, top-right, then bottom-left, bottom-center, bottom-right. Shot label in caps at the TOP of each panel (OUTSIDE the drawing area).

STYLE: pencil graphite sketch with MINIMAL color washes only (red-blood desaturated sky on panel 1; warm amber firelight on panels 2, 3, 4; ochre daylight on panels 5, 6). Loose gestural lines, professional pre-production storyboard look. NOT a finished comic, NOT full color illustration.

IDENTITY REFERENCES:
- Image 1 = elder griot (appears in panels 3 and 4 as prophet)
- Image 2 = second griot (panel 3)
- Image 3 = third/female griot (panel 3)
- Image 4 = baby Soundjata toddler 3-4 years old (panels 5 and 6)
- Image 5 = Sogolon on the LEFT of that reference image (woman in turquoise turban + turquoise draped dress, dignified posture). She is Soundjata's mother. Ignore the other woman in blue patterned dress on the right - she is NOT in this storyboard.

PANEL 1 (top-left) - LABEL: "WIDE TYRANNY"
Wide shot of a Mandingue village at night in ruins. Red-blood desaturated sky, black smoke rising from broken earthen huts, a dead tree in the center, crescent moon. Oppressive atmosphere. ZERO visible characters.

PANEL 2 (top-center) - LABEL: "MEDIUM TYRANT SHADOW"
Menacing shadow silhouette of a horned sorcerer mask projected onto an earthen wall, orange torchlight glow, smoke wisps. Symbolic presence of the sorcerer-king without showing him directly.

PANEL 3 (top-right) - LABEL: "WIDE PROPHECY"
Circle of 3 Mandingue griots (13th century) around a nighttime council fire. The elder griot at center has a raised arm in a prophetic gesture; the 2 others listen attentively. Sparks rising toward a starry sky, silhouetted baobab trees in the background.

PANEL 4 (bottom-left) - LABEL: "CLOSE PROPHET"
Close-up of the elder griot's face in the middle of a vision, eyes distant, firelight carving his features, mystical expression, mouth slightly open as if speaking.

PANEL 5 (bottom-center) - LABEL: "MEDIUM SOGOLON & BABY"
Medium shot of Sogolon (the woman in turquoise turban and turquoise draped dress from Image 5, LEFT side) sitting on the ochre ground of a Mandingue family courtyard in daytime. She holds baby Soundjata (the toddler from Image 4) close to her on her lap. Her expression is worried but dignified. Banco earthen houses in the background. Warm ochre daylight. ABSOLUTELY NO other children, NO running, NO other adults visible. Just Sogolon and her baby son alone in the courtyard.

PANEL 6 (bottom-right) - LABEL: "CLOSE BABY SOUNDJATA"
Close-up of baby Soundjata, a toddler 3-4 years old, sitting ALONE on the ochre ground of the village courtyard. Ochre tunic. Dignified gaze despite his solitude. NO other characters in this frame - he is isolated. Emotional contrast with panel 5 (mother present then mother absent = his destiny is solitary).

CRITICAL RULES:
- EXACTLY 6 panels in a 2 rows x 3 columns grid. NOT 9 panels. NOT 3x3. NOT 2x2.
- Shot labels ONLY at the top of each panel, OUTSIDE the drawing area.
- NO text, NO dialogue, NO panel numbers inside the drawings.
- NO captions, NO subtitles inside the panels.
- NO running children in ANY panel.
- NO modern clothing anywhere (no t-shirts, no shorts, no modern shoes - strict 13th century Mandingue attire).
- Graphite sketch aesthetic with minimal color washes - NOT a finished colored comic."""


def main():
    print(f"[1/4] Checking {len(REFS)} reference files...")
    for ref in REFS:
        if not ref.exists():
            print(f"ERROR: missing ref {ref}")
            sys.exit(1)
        print(f"  OK {ref.name}")

    print("[2/4] Loading reference images...")
    client = genai.Client(api_key=API_KEY)
    parts = [types.Part.from_text(text=PROMPT)]
    for ref in REFS:
        with open(ref, "rb") as f:
            data = f.read()
        parts.append(types.Part.from_bytes(data=data, mime_type="image/png"))

    print("[3/4] Calling Gemini 3.1 Flash Image...")
    resp = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[types.Content(role="user", parts=parts)],
    )

    print("[4/4] Saving output...")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    saved = False
    for cand in resp.candidates:
        for part in cand.content.parts:
            if part.inline_data and part.inline_data.data:
                with open(OUTPUT, "wb") as f:
                    f.write(part.inline_data.data)
                print(f"  SAVED {OUTPUT}")
                print(f"  size: {len(part.inline_data.data)} bytes")
                saved = True
                break
        if saved:
            break

    if not saved:
        print("ERROR: no image in response")
        print(resp)
        sys.exit(1)

    print("DONE")


if __name__ == "__main__":
    main()
