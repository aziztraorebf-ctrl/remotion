"""Regen Soundjata Acte IV Clip 1 storyboard v3: Kimi DA direction.

Key changes from v2:
- Panel 1: Soundjata YOUNG (child/teen from Acte III baobab, bare-chested,
  simple loincloth) walking RIGHT with lateral tracking camera. NOT adult.
- Panel 2: Soundjata ADULT (warrior canon) executing a SHARP horizontal
  sword strike (not contemplative). Low angle. Mema architecture background.
- Panel 3: 3 messengers galloping in STRICT LATERAL PROFILE with pan camera
  left-to-right. NOT frontal (frontal = Seedance slow-mo/gelatin trap).
  Single file formation, scanning the horizon.
- Panel 4: Over-the-shoulder from Soundjata toward kneeling messenger.
  More cinematic framing than face-to-face.

Uses 5 reference images (adds soundjata-young-exile-ref.jpg from Acte III).
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
    REFS_DIR / "soundjata-young-exile-ref.jpg",
    REFS_DIR / "soundjata-adult-warrior-ref.png",
    REFS_DIR / "messagers-cavaliers-ref.png",
    REFS_DIR / "mema-environment.png",
]

OUTPUT = REFS_DIR / "storyboard-acte4-clip1-4panels-v3.png"

PROMPT = """Generate a NEW pre-production storyboard sketch page in EXACTLY 4 panels arranged in 2 rows x 2 columns layout. Each panel is a 9:16 vertical rectangle with a thin black border. Read order: top-left, top-right, then bottom-left, bottom-right.

STYLE: warm 2D vivid flat illustration, West African 13th century epic. Flat-BD semi-detailed color wash. Clear line work, faces readable.

IDENTITY REFERENCES (STRICT):
- Image 1 = Soundjata YOUNG — a child/teenager (around 12-14 years old), bare-chested, wearing a simple brown loincloth/pagne, barefoot, dark skin, short hair. This is the boy who just uprooted a baobab tree. Use ONLY for panel 1.
- Image 2 = Soundjata ADULT WARRIOR — young adult, braided hair, white tunic with yellow trim, red sash around waist, holds a curved sword in right hand pointing down-forward, sandals. Clean-shaven. Use for panels 2 and 4.
- Image 3 = 3 Mande messenger horsemen — blue turban leader, red turban, green turban. Traditional boubou robes. Horses: bay, black, white. Use for panels 3 and 4.
- Image 4 = Mema environment — Sahelian red-earth architecture with a tall vertical mud-minaret, palm trees, distant baobabs. Use for panel 2 background.

PANEL 1 (top-left) - FUITE / EXILE
WIDE shot. Lateral tracking composition — the scene reads LEFT to RIGHT as if the camera pans alongside Soundjata.

Soundjata YOUNG (Image 1: bare-chested child/teen in brown loincloth, barefoot, dark skin, short hair) walks briskly toward the RIGHT side of the frame. His gaze is cast downward, expression melancholic. He carries a small fabric bundle (ballot) slung over his right shoulder on a short stick. His left arm swings naturally at his side.

Behind him on the LEFT side: 2-3 hostile silhouettes of court figures turning their backs or gesturing dismissively, receding into the dust. A few banco huts of Niani village in the far background, partially obscured by rising ochre dust.

Atmosphere: golden late-afternoon light, warm but somber. Long shadows. Dust lifted by his footsteps. The whole composition suggests LATERAL MOVEMENT to the right — departure.

CRITICAL: Soundjata in this panel is a CHILD/TEENAGER. NOT an adult. NOT wearing a white tunic. He is bare-chested with a simple brown loincloth, exactly as in Image 1.

PANEL 2 (top-right) - FORGE / MEMA TRAINING
MEDIUM shot, slight LOW ANGLE (camera looking up at Soundjata, conveying power).

Soundjata ADULT (Image 2: braided hair, white tunic with yellow trim, red sash, clean-shaven) is captured mid-action executing a SHARP HORIZONTAL SWORD STRIKE from right to left. His right arm is fully extended, the curved blade slicing through the air in a clean horizontal arc. His body is rotated into the strike, weight on his front foot. Left arm pulled back for counterbalance. Expression: focused, disciplined, eyes locked forward.

Background: the Mema environment from Image 4 — the tall red-earth mud-minaret is clearly visible on the left side, palm trees, warm golden midday light. This is a DIFFERENT place from panel 1 (Niani). The architecture and vegetation must look distinctly Sahelian/Mema.

CRITICAL: ONE single sword in his right hand, NO scabbard visible, NO second weapon. Clean-shaven, NO beard. The visual jump from child (panel 1) to adult warrior (panel 2) = 7 years have passed. This contrast must be STARK and IMMEDIATE.

PANEL 3 (bottom-left) - TRAVERSEE / MESSENGERS RIDE
WIDE shot with LATERAL PAN composition — the scene reads LEFT to RIGHT, as if the camera pans alongside the riders.

The 3 messengers from Image 3 gallop in STRICT SIDE PROFILE, riding from LEFT to RIGHT across the frame in SINGLE FILE formation (NOT side by side, NOT frontal). The blue-turban messenger leads, followed by red-turban, then green-turban. Their horses are at full gallop — legs stretched, manes flying, hooves thundering. Riders lean forward urgently, scanning the horizon ahead of them.

Ochre dust clouds trail behind and below the horses. Silhouetted baobabs and acacia trees in the far background. Golden savanna sky.

CRITICAL: STRICT SIDE PROFILE view (horses and riders seen from the side, moving LEFT to RIGHT). NOT frontal, NOT 3/4 frontal, NOT coming toward camera. The camera follows them laterally. Single file, NOT abreast.

PANEL 4 (bottom-right) - SUPPLICATION / MESSENGERS KNEEL
MEDIUM shot framed OVER SOUNDJATA'S LEFT SHOULDER (over-the-shoulder composition). We see Soundjata's left shoulder and the back of his head in the foreground (soft focus, partial), and the scene unfolds BEYOND him:

The blue-turban messenger is on his knees in the mid-ground, hands clasped together in supplication, head bowed. The red-turban and green-turban messengers stand just behind him, slightly hunched, catching their breath from the journey, holding horse reins.

Soundjata (Image 2, adult warrior, white tunic, red sash, clean-shaven) is seen from behind/over-shoulder — his posture is upright, still, dignified. He is RECEIVING the news, not yet acting on it. Moment of realization, NOT triumph.

Soft warm evening light. Mema red-earth walls faintly visible in the background.

CRITICAL RULES:
- EXACTLY 4 panels in a 2x2 grid. NOT 6, NOT 9.
- NO text, NO dialogue, NO labels, NO panel numbers inside the drawings.
- NO modern clothing. Strict 13th century West African Mande attire.
- Panel 1 Soundjata = CHILD/TEEN (bare-chested, loincloth, from Image 1). Panels 2 and 4 Soundjata = ADULT WARRIOR (white tunic, red sash, sword, from Image 2). The age jump between panel 1 and 2 must be visually stark.
- Panel 2: ONE sword, NO scabbard, NO beard. Sharp horizontal strike mid-action.
- Panel 3: STRICT SIDE PROFILE gallop, single file LEFT to RIGHT. NOT frontal.
- Panel 4: OVER-THE-SHOULDER framing from behind Soundjata.
- Panels 3 and 4: same 3 turbans (blue, red, green), same horses from Image 3.
- Consistent flat-BD illustration style across all 4 panels."""


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
        mime = "image/jpeg" if ref.suffix.lower() in (".jpg", ".jpeg") else "image/png"
        parts.append(types.Part.from_bytes(data=data, mime_type=mime))

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
