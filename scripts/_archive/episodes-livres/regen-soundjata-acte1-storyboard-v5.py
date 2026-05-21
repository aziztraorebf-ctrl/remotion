"""Regen Soundjata Acte I storyboard v5: reconcile tyrant with canon Soumaoro.

Changes from v4 (based on Aziz feedback - Option A):
- Panel 2: silhouette redesigned - Soumaoro silhouette with dreadlocks + raised hands
  emitting magical energy (NOT horned). Matches canon Soumaoro from Act V.
- Panel 4: TYRANT REACTION now shows canon Soumaoro (dreadlocks, dark robe, fetish
  necklaces, red magical energy on hands) in a shadowy throne room or ritual space.
  NO horned crown, NO generic medieval royal attire.

Uses Gemini 3.1 Flash Image preview with 6 reference images (adds Soumaoro canon).
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
    REFS_DIR / "soumaoro-combat-ref.png",
]

OUTPUT = REFS_DIR / "acte1/storyboard-6panels-v5.png"

PROMPT = """Generate a NEW pre-production storyboard sketch page in EXACTLY 6 panels arranged in 2 rows x 3 columns layout. Each panel is a 9:16 vertical rectangle with a thin black border. Read order: top-left, top-center, top-right, then bottom-left, bottom-center, bottom-right. Shot label in caps at the TOP of each panel (OUTSIDE the drawing area).

STYLE: warm African illustration with flat-BD semi-detailed color wash, professional pre-production storyboard look. Clear line work, character faces readable, rich atmospheric lighting (red-blood sky panel 1; orange torchlight + red magical glow panels 2, 3, 4; golden daylight panels 5, 6).

IDENTITY REFERENCES:
- Image 1 = elder griot (appears in panel 3)
- Image 2 = second griot (panel 3)
- Image 3 = third/female griot (panel 3)
- Image 4 = baby Soundjata toddler 3-4 years old (panels 5 and 6)
- Image 5 = Sogolon on the LEFT of that reference image (woman in turquoise turban + turquoise draped dress, dignified posture). She is Soundjata's mother. Ignore the other woman in blue patterned dress on the right.
- Image 6 = Soumaoro Kante the sorcerer-king. CRITICAL: he has long dark dreadlocks/braids hanging past his shoulders, wears a BLACK sorcerer robe with fetish necklaces (small bone/ivory charms on his chest), leather sandals, dark-brown skin, muscular build, and his hands emit red/crimson magical energy. He is NOT a generic medieval king - NO horned crown, NO gold-embroidered royal robe, NO western-style throne. He is a West African mystic warlord.

PANEL 1 (top-left) - LABEL: "WIDE TYRANNY"
Wide shot of a Mandingue village at night in ruins. Red-blood desaturated sky, black smoke rising from broken earthen huts, a dead tree in the center, crescent moon. Oppressive atmosphere. ZERO visible characters.

PANEL 2 (top-center) - LABEL: "MEDIUM SORCERER SHADOW"
Menacing silhouette of Soumaoro (from Image 6) projected onto an earthen wall - his distinctive profile with long dreadlocks falling past his shoulders and BOTH ARMS RAISED, hands emitting a red/crimson magical glow casting harsh shadows on the wall. Orange torchlight mixed with the red magical radiance. Smoke wisps. This is his symbolic presence through magic - NOT horned, NOT a demon. A real sorcerer-warlord performing a ritual.

PANEL 3 (top-right) - LABEL: "WIDE PROPHECY"
Circle of 3 Mandingue griots (13th century) around a nighttime council fire. The elder griot at center has a raised arm in a prophetic gesture; the 2 others listen attentively. Sparks rising toward a starry sky, silhouetted baobab trees in the background.

PANEL 4 (bottom-left) - LABEL: "MEDIUM SOUMAORO REACTION"
Soumaoro Kante (from Image 6) seen in medium shot inside his shadowy ritual chamber - he wears his black sorcerer robe with fetish necklaces, his long dreadlocks hang past his shoulders, dark-brown skin, muscular frame. He has just learned of the prophecy - his expression shows cold anger. His right hand clenches while the other hand crackles with faint red magical energy. Torches on the earthen walls behind him, fetish skulls or bones on a low stone altar. He is SEATED on a low wooden dais or ritual stool (NOT a western throne), or STANDING. This panel establishes him as the active antagonist. ABSOLUTELY NO horned crown, NO gold-embroidered royal robe, NO western king iconography.

PANEL 5 (bottom-center) - LABEL: "MEDIUM SOGOLON & BABY"
Medium shot of Sogolon (the woman in turquoise turban and turquoise draped dress from Image 5, LEFT side of that reference) sitting on the ochre ground of a Mandingue family courtyard in daytime. She holds baby Soundjata (the toddler from Image 4) close to her on her lap. Her expression is worried but dignified. Banco earthen houses in the background. Warm ochre daylight. ABSOLUTELY NO other children, NO running, NO other adults visible. Just Sogolon and her baby son alone in the courtyard.

PANEL 6 (bottom-right) - LABEL: "CLOSE BABY SOUNDJATA DISABLED"
Close-up of baby Soundjata, a toddler 3-4 years old, sitting ALONE on the ochre ground of the village courtyard. CRITICAL: his legs must VISIBLY show motor disability - thin frail legs stretched weakly forward on the ground, slightly twisted or uneven, his small hands pressing into the ground beside him for support (as if unable to stand), and his gaze turned DOWNWARD toward his own legs with an expression of quiet awareness. He wears a simple ochre tunic. Soft golden daylight. NO other characters. The visual must immediately communicate 'this child cannot walk' - not just 'a seated child'.

CRITICAL RULES:
- EXACTLY 6 panels in a 2 rows x 3 columns grid. NOT 9 panels.
- Shot labels ONLY at the top of each panel, OUTSIDE the drawing area.
- NO text, NO dialogue, NO panel numbers inside the drawings.
- NO modern clothing anywhere - strict 13th century West African attire.
- Panels 2 and 4 MUST show Soumaoro consistent with Image 6 (dreadlocks, black robe, red magical energy, NOT horned, NOT western royal).
- Panel 6 MUST make the disability visually explicit.
- Consistent illustration style across all 6 panels."""


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
