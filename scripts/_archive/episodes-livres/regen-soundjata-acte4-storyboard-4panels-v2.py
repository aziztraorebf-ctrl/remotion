"""Regen Soundjata Acte IV Clip 1 storyboard v2: fix 3 defects from v1.

Fixes applied (Aziz feedback 2026-04-16):
- Panel 1: Soundjata should be young (just after uprooting the baobab),
  baluchon held by a cord in his hand (HANGING against his back),
  NOT resting on shoulder. No anatomical hallucination.
- Panel 2: NO beard (keep canon exile + warrior refs are both clean-shaven,
  same apparent age). SINGLE sword in right hand, NO scabbard visible
  (match warrior-ref exactly). Training stance clean, no absurd double-sword.
- Panel 3: horsemen in 3/4 frontal angle riding TOWARDS camera (or slightly
  diagonal), NOT pure lateral profile. This avoids Seedance slow-motion
  bias on lateral galloping.
- Panel 4: keep as v1 - the only panel that worked.

Uses Gemini 3.1 Flash Image preview with 4 reference images.
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

OUTPUT = REFS_DIR / "storyboard-acte4-clip1-4panels-v2.png"

PROMPT = """Generate a NEW pre-production storyboard sketch page in EXACTLY 4 panels arranged in 2 rows x 2 columns layout. Each panel is a 9:16 vertical rectangle with a thin black border. Read order: top-left, top-right, then bottom-left, bottom-right.

STYLE: warm 2D vivid flat illustration, West African 13th century epic. Flat-BD semi-detailed color wash. Clear line work, faces readable, atmospheric lighting specific to each panel.

IDENTITY REFERENCES (STRICT - do NOT deviate):
- Image 1 = Soundjata in exile. IMPORTANT: he is YOUNG (teenager / very young adult, just after his transformation). Braided hair, white tunic with yellow trim, red sash around waist, sandals. CLEAN-SHAVEN, NO beard, NO mustache. Holds a small fabric bundle (baluchon) at the end of a cord/string in his RIGHT HAND - the bundle hangs DOWN BEHIND his shoulder/back, NOT resting on top of his shoulder. Use for panel 1.
- Image 2 = Soundjata warrior canon. SAME young face as Image 1, SAME age (NOT older, NOT more mature in facial features), CLEAN-SHAVEN, NO beard, NO mustache. Braided hair, white tunic with yellow trim, red sash, holds a single curved sword in his right hand pointing down-forward, NO scabbard visible at the belt. Use for panels 2 and 4.
- Image 3 = 3 Mande messengers on horseback. Blue turban, red turban, green turban. Traditional boubou robes. Horses: bay, black, white. Use for panels 3 and 4.
- Image 4 = Mema environment. Sahelian red-earth architecture with a tall vertical minaret of mud, palm trees, distant baobabs. Use for panel 2 background.

PANEL 1 (top-left) - SHOT: WIDE EXIL
Wide shot. Young Soundjata (exact match to Image 1, clean-shaven teenager, braided hair, white tunic with yellow trim, red sash) seen from a 3/4 back angle, walking away from camera toward a distant ochre horizon. CRITICAL: his right arm hangs naturally down at his side and he holds a cord in his right hand; the small fabric bundle (baluchon) dangles from the end of that cord BEHIND his body, near his lower back - it is NOT resting on his shoulder, NOT floating, NOT at an awkward angle. His left arm hangs naturally relaxed. His native village of Niani is visible in soft focus on the left side: small banco earthen houses, 2-3 silhouetted villagers standing still, watching him leave in silence. Golden late-afternoon sunset light. Long shadows stretch across dry red earth. Mood: bittersweet, dignified departure.

PANEL 2 (top-right) - SHOT: MEDIUM MEMA TRAINING
Medium shot. Soundjata (EXACT match to Image 2: clean-shaven, NO beard, NO mustache, same young face as panel 1, braided hair, white tunic with yellow trim, red sash) standing in the Sahelian savanna near Mema, practicing his sword. CRITICAL SWORD CONSTRAINT: he holds ONE SINGLE curved sword in his RIGHT hand, blade pointed down-forward just like in Image 2. There is NO scabbard on his belt, NO second sword anywhere, NO sheath visible, NO extra weapon. His left hand is empty and relaxed at his side or extended for balance. Background from Image 4: red-earth Mema architecture with a tall vertical mud-minaret on the left side, tall palm trees, a baobab in the distance. Warm midday light. His expression is concentrated but his gaze is slightly distant - thinking of the Manden. NO crowd, NO other characters.

PANEL 3 (bottom-left) - SHOT: WIDE MESSAGERS GALOP TOWARDS CAMERA
Wide shot. The 3 messengers from Image 3 galloping at full speed TOWARDS the camera in a diagonal 3/4 frontal angle (NOT a pure side profile). They are arranged in a loose V-formation with the blue-turban messenger slightly ahead and centered, the red-turban and green-turban messengers following flanking behind him. The horses' chests and forelegs push TOWARD the viewer, hooves thundering forward, muscles tensed. Ochre dust clouds billow UP and TOWARDS the camera. Silhouetted baobabs in the far background against a golden sky. LOW camera angle, ground-level perspective. The energy is URGENT, FORWARD RUSH, NOT lateral movement. This angle is chosen specifically to convey fast-approaching motion.

PANEL 4 (bottom-right) - SHOT: MEDIUM MESSAGERS KNEEL
Medium shot. The 3 messengers from Image 3 have arrived at Mema. The blue-turban messenger is on one knee in the foreground, head bowed in the Mande gesture of supplication before a sovereign. The red-turban and green-turban messengers stand respectfully behind him, each holding the reins of their horses. Soundjata (exact match to Image 2, clean-shaven, same as panel 2) stands facing them, hands at his sides, his expression solemn and dignified. Moment of realization - NOT yet triumph, NOT yet action (those come in the next clip). Soft evening warm light. Mema red-earth walls faintly visible in the background.

CRITICAL RULES:
- EXACTLY 4 panels in a 2 rows x 2 columns grid. NOT 6, NOT 9.
- NO text, NO dialogue, NO panel numbers, NO labels inside the drawings.
- NO modern clothing anywhere - strict 13th century West African Mande attire.
- Panels 1, 2, 4 MUST show Soundjata CLEAN-SHAVEN, SAME young face across all panels, SAME age apparent. No beard, no mustache, no aging difference between panels.
- Panel 1: the baluchon MUST hang from a cord in his right hand DOWN behind his body, NOT resting on the shoulder.
- Panel 2: ONE single sword in right hand, NO scabbard visible at his belt.
- Panel 3: horsemen MUST approach camera in 3/4 frontal angle, NOT lateral profile. This is mandatory for dynamic motion.
- Panels 3 and 4: same 3 turbans from Image 3 (blue, red, green), same horse colors.
- Consistent illustration style across all 4 panels.
- Epic but contemplative. Exile and call-to-destiny, NOT battle."""


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
