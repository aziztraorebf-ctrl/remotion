"""Regen Soundjata Acte IV Clip 1 storyboard: 4 panels for exile + Mema + messagers.

Applies fresh rules from session 2026-04-16:
- Rule 20: density 4-5 panels for contemplative narrative multi-beats (NOT 9).
- Rule: refs multiples imperatif (stack storyboard + all char canon refs).
- 2 rows x 2 columns = 4 panels, each 9:16 vertical, reading order top-left,
  top-right, bottom-left, bottom-right.

Uses Gemini 3.1 Flash Image preview with 4 reference images:
  1. soundjata-exile-ref.png (panel 1)
  2. soundjata-adult-warrior-ref.png (panels 2 and 4)
  3. messagers-cavaliers-ref.png (panels 3 and 4)
  4. mema-environment.png (panel 2 background)
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
REFS_DIR = REPO / "public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte4"

REFS = [
    REFS_DIR / "soundjata-exile-ref.png",
    REFS_DIR / "soundjata-adult-warrior-ref.png",
    REFS_DIR / "messagers-cavaliers-ref.png",
    REFS_DIR / "mema-environment.png",
]

OUTPUT = REFS_DIR / "storyboard-acte4-clip1-4panels-v1.png"

PROMPT = """Generate a NEW pre-production storyboard sketch page in EXACTLY 4 panels arranged in 2 rows x 2 columns layout. Each panel is a 9:16 vertical rectangle with a thin black border. Read order: top-left, top-right, then bottom-left, bottom-right. Shot label in caps at the TOP of each panel (OUTSIDE the drawing area).

STYLE: warm 2D vivid flat illustration, West African 13th century epic. Flat-BD semi-detailed color wash, professional pre-production storyboard look. Clear line work, character faces readable, rich atmospheric lighting specific to each panel.

IDENTITY REFERENCES:
- Image 1 = Soundjata in exile (young adult, braided hair, white tunic, red sash, carrying a baluchon/bundle over the shoulder, dignified but weary). Use for panel 1.
- Image 2 = Soundjata warrior canon (same face, braided hair, white tunic, red sash, sword at belt, more mature). Use for panels 2 and 4. Slight beard acceptable (7 years later).
- Image 3 = 3 Mande messenger horsemen (blue, red, green turbans; traditional boubou robes; bay, black, white horses). Use for panels 3 and 4.
- Image 4 = Mema environment (Sahelian architecture, red-earth buildings with vertical minaret of mud, palm trees, baobabs). Use for panel 2 background.

PANEL 1 (top-left) - LABEL: "WIDE EXIL"
Wide shot. Soundjata (from Image 1) seen from behind, walking away from the camera toward a distant ochre horizon, baluchon over his right shoulder. His native village of Niani is visible in soft focus on the left - small banco earthen houses, a few silhouetted villagers watching him leave in silence. Golden late-afternoon sunset light, long shadows stretching across the dry red earth. Atmosphere: bittersweet departure. NO crowd, just 2-3 silhouettes of villagers.

PANEL 2 (top-right) - LABEL: "MEDIUM MEMA TRAINING"
Medium shot. Soundjata (from Image 2, slightly more mature, possibly a faint beard) standing in the Sahelian savanna near Mema. He is mid-motion practicing sword forms - blade raised and angled. Background is the Mema environment from Image 4: red-earth architecture with a vertical minaret of mud, tall palm trees, a large baobab in the distance. His expression is concentrated but his gaze is distant - thinking of the Manden he left behind. Warm midday light. NO crowd.

PANEL 3 (bottom-left) - LABEL: "WIDE MESSAGERS GALOP"
Wide shot. 3 Mande horsemen (from Image 3) at full gallop across the savanna, moving left-to-right across the frame. Ochre dust clouds rising behind them, silhouetted baobabs in the far background against a golden sky. Horses at full stretch, turbans flowing in the wind. Epic travel composition. Cinematic low angle, dynamic movement.

PANEL 4 (bottom-right) - LABEL: "MEDIUM MESSAGERS KNEEL"
Medium shot. The 3 messengers (from Image 3) have arrived at Mema. The lead messenger is on one knee, head bowed, in the Mande gesture of supplication before a sovereign. The 2 others stand respectfully behind him with their horses. Soundjata (from Image 2) stands facing them, hands at his sides, his expression solemn - he understands his people are calling him back. Moment of realization and dignity, NOT yet triumph (triumph comes in the next shot). Soft evening light, warm earth tones. Mema architecture faintly visible in the background.

CRITICAL RULES:
- EXACTLY 4 panels in a 2 rows x 2 columns grid. NOT 9 panels. NOT 6 panels.
- Shot labels ONLY at the top of each panel, OUTSIDE the drawing area.
- NO text, NO dialogue, NO panel numbers inside the drawings.
- NO modern clothing anywhere - strict 13th century West African Mande attire: handwoven cotton, indigo and terracotta dyes, leather, cowrie shells.
- Panels 1, 2, 4 MUST show the same Soundjata face (from Images 1 and 2) - braided hair, consistent facial features. Only slight maturation between panel 1 (young exile) and panels 2/4 (7 years later).
- Panel 3 and 4 MUST show the same 3 messengers from Image 3 - same turbans (blue, red, green), same boubou colors.
- Panel 2 background MUST match the Mema architecture from Image 4.
- Consistent illustration style across all 4 panels.
- Epic but contemplative tone. This is the exile and call-to-destiny sequence, not a battle."""


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
