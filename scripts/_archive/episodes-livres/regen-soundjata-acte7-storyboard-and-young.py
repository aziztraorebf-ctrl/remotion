"""
Regen ciblee Acte VII Soundjata — 2 corrections :
  1. storyboard.png : passer de 1x5 -> 9 panels 3x3 grid (gabarit storyboard-9panels-test)
  2. young.png      : passer d'enfant ~12 ans -> jeune griot adulte 25-32

Gabarit visuel de reference : public/assets/library/geoafrique/soundjata/combat-refs/storyboard-9panels-test.png

Modele : models/gemini-3.1-flash-image-preview
Budget : 2 x $0.08 = $0.16
"""

import io
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).parent.parent.parent
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

ACTE7_DIR = (
    ROOT
    / "public"
    / "assets"
    / "library"
    / "geoafrique"
    / "heros-oublies"
    / "soundjata"
    / "refs"
    / "acte7"
)

ELDER_REF = ACTE7_DIR / "elder.png"
FEMALE_REF = ACTE7_DIR / "female.png"

STORYBOARD_OUT = ACTE7_DIR / "storyboard.png"
YOUNG_OUT = ACTE7_DIR / "young.png"


# -------- PROMPT STORYBOARD (9 panels 3x3) --------

PROMPT_STORYBOARD = """Generate a NEW black-and-white sketch storyboard page.

CRITICAL LAYOUT:
- EXACTLY 9 panels in a 3x3 GRID (3 rows, 3 columns)
- Each panel is a rectangle with clean thin border
- Read order: top-left to top-right, then middle row, then bottom row
- All 9 panels same size, thin gutters between panels
- Small shot label at the TOP of each panel in thin caps text (shot labels listed below)

CONTENT STYLE:
- Pencil/graphite sketch style with loose gestural lines
- Small touches of desaturated warm orange acceptable for firelight glow (sparingly)
- NO text inside panels except the tiny shot labels at the top edge
- NO speech bubbles, NO panel numbers inside the drawings, NO dialogue text
- Contemplative nocturnal atmosphere (campfire + starry night, Mali savanna)

The two reference images show identity of characters:
- Image 1 = ELDER GRIOT (aged 60-70, white beard, indigo-blue boubou, kora instrument with calabash body + straight vertical neck + 21 strings)
- Image 2 = GRIOTTE WOMAN / jelimusow (aged 35-45, burgundy-red head-wrap with gold patterns, burgundy-and-gold patterned boubou, gold hoop earrings, dignified bearing)

Third character described in the shot list (no ref provided, describe visually):
- YOUNG ADULT MALE GRIOT: deep brown dark skin, aged 25-32 (ADULT, NOT a child, NOT a teenager), short-cropped black hair, no beard or very light stubble, earth-ochre / terracotta boubou (DIFFERENT color from the elder's indigo), adult facial structure, adult body proportions

SHOT LIST (9 panels, 3x3 grid, night campfire in Mali savanna, 3 griots transmitting the Soundjata epic):

PANEL 1 (top-left) - WIDE ESTABLISHING: 3 griots seated around a blazing night fire in a circle. Elder griot (ref 1, indigo boubou) at the center back holding his kora. Young adult griot (terracotta boubou) seated on the left. Griotte woman (ref 2, burgundy gele and boubou) on the right. Acacia tree silhouettes, starry night sky. Warm firelight on their faces.

PANEL 2 (top-middle) - EXTREME CLOSE-UP HANDS: the elder griot's fingers plucking the kora strings, detail on the knuckles near the neck of the instrument, reflections of firelight on the nylon strings, calabash body partially visible.

PANEL 3 (top-right) - MEDIUM CLOSE-UP: face of the elder griot singing, eyes half-closed, mouth slightly open, firelight illuminating his face from below (chiaroscuro), white beard catching the warm light.

PANEL 4 (middle-left) - EXTREME CLOSE-UP EYES: the young ADULT griot's eyes only (dark brown, ADULT eyes with adult brow and crow's feet faint), wide open in captivation, pupils dilated by wonder, narrow horizontal crop across the eyes, nothing else visible. ADULT facial features, NOT a child's eyes.

PANEL 5 (middle-middle) - LOW ANGLE: the griotte (ref 2) takes over the telling, seen from below, fire in the blurred foreground, she is upright with hands open in a conteuse's gesture, her gele and boubou catching firelight.

PANEL 6 (middle-right) - OVER-THE-SHOULDER: view from behind the young adult griot's shoulder (his nape and short-cropped hair in blurred foreground, ADULT shoulders and neck), looking toward the griotte who is telling the tale. She is in focus in the mid-frame.

PANEL 7 (bottom-left) - EXTREME CLOSE-UP EMBERS: fire embers and sparks rising into the starry night sky, pure detail shot (no characters), suggests transmission traveling outward.

PANEL 8 (bottom-middle) - MEDIUM: the young ADULT griot receives the kora. His hands (ADULT hands) reach forward to take the instrument passed from the elder (elder's arm visible off-frame handing the kora over). Focused concentration on the young adult's face.

PANEL 9 (bottom-right) - WIDE FINAL: the 3 silhouettes seen from far, seated around the fire, immense starry sky above them, acacia silhouettes framing the scene, a feeling of transmission continuing forever.

STYLE: loose graphite pencil sketch, dynamic line work for firelight and embers in panels 2, 5, 7, emotional close-ups in panels 3, 4, 6, environment wide shots in panels 1 and 9. Black lines on cream paper. Subtle warm orange tinting ONLY where firelight is essential — mostly monochrome.

FINAL LAYOUT REMINDER: 9 panels in a 3x3 grid, read left-to-right top-to-bottom, each panel has a small shot-label at its top edge.

CRITICAL: The young griot is an ADULT (25-32), NOT a child. No children anywhere in this storyboard."""


# -------- PROMPT YOUNG (adult 25-32) --------

PROMPT_YOUNG = """Generate a 2D flat illustrated BD-style character reference portrait.

ADULT MAN aged 25-32 years old. NOT a child. NOT a teenager. NOT a boy. This is a YOUNG ADULT MAN.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D look, no painterly texture. Matches the GeoAfrique YouTube series aesthetic - a flat animated educational documentary style with warm African color palette.

CHARACTER: YOUNG ADULT GRIOT / APPRENTICE MASTER (Mali, 13th century).
- Young ADULT man, aged 25-32 years
- Deep warm brown dark skin
- Facial features of an adult male (25-32 years): visible adult jawline, defined cheekbones, adult brow, NOT rounded child cheeks, NOT smooth teenage face
- Short-cropped black hair (close to the scalp, neat)
- No beard or very light stubble, clean-shaven
- Calm focused gaze, slight serious expression, eyes concentrated (not wide-eyed childish wonder)
- Adult body proportions: broad adult shoulders, proportional neck-to-head ratio of an adult man
- Earth-ochre / terracotta orange-brown BOUBOU robe (DIFFERENT color from the elder griot's indigo blue), traditional West African cut, subtle embroidery at collar
- Seated cross-legged holding a small kora or simply seated with hands on knees, ready to receive teaching
- Simple leather cord necklace with a single amber bead
- Adult feet visible in simple leather sandals

COMPOSITION: full-body portrait, centered, character occupies ~70% of vertical frame. Character seated.

BACKGROUND: Suggest a NIGHT FIRE SCENE in the background — warm orange firelight glow from the LEFT side (off-frame fire), dark blue savanna night sky, silhouettes of acacia trees barely visible. Firelight casts a strong warm glow on the LEFT side of his face and body. Background is painterly-soft so the character stays the focal point.

FORMAT: 1080x1920 vertical (9:16).

CRITICAL: subject is a YOUNG ADULT MAN, not a child. Adult proportions, adult facial structure, adult body. NO child. NO teenager. NO boy. Aged 25-32 only.

CRITICAL: No text, no letters, no numerals visible anywhere. No signs, no writing on robe. Natural anatomy — correct number of fingers (5 per hand), realistic adult male proportions, no morphing, no extra limbs."""


# -------- GENERATION LOGIC --------


def load_refs_for_storyboard():
    parts = []
    for ref in [ELDER_REF, FEMALE_REF]:
        if not ref.exists():
            raise FileNotFoundError(f"Reference missing: {ref}")
        with open(ref, "rb") as f:
            data = f.read()
        parts.append(types.Part.from_bytes(data=data, mime_type="image/png"))
        print(f"[REF] loaded {ref.name} ({len(data)} bytes)")
    return parts


def generate_storyboard() -> Path | None:
    print(f"\n[GEN 1/2] storyboard.png (9 panels 3x3)")
    try:
        contents = load_refs_for_storyboard() + [PROMPT_STORYBOARD]
        resp = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
        )
        for part in resp.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img = Image.open(io.BytesIO(part.inline_data.data))
                img.save(STORYBOARD_OUT, "PNG")
                print(f"[OK] {STORYBOARD_OUT} ({img.size[0]}x{img.size[1]})")
                return STORYBOARD_OUT
        print("[FAIL] storyboard — no image returned")
        return None
    except Exception as e:
        print(f"[ERROR] storyboard — {e}")
        return None


def generate_young() -> Path | None:
    print(f"\n[GEN 2/2] young.png (adult 25-32)")
    try:
        resp = client.models.generate_content(
            model=MODEL,
            contents=[PROMPT_YOUNG],
            config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
        )
        for part in resp.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img = Image.open(io.BytesIO(part.inline_data.data))
                img.save(YOUNG_OUT, "PNG")
                print(f"[OK] {YOUNG_OUT} ({img.size[0]}x{img.size[1]})")
                return YOUNG_OUT
        print("[FAIL] young — no image returned")
        return None
    except Exception as e:
        print(f"[ERROR] young — {e}")
        return None


def main():
    print(f"[INFO] Output dir: {ACTE7_DIR}")
    sb = generate_storyboard()
    yg = generate_young()
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  storyboard.png : {'OK' if sb else 'FAIL'}")
    print(f"  young.png      : {'OK' if yg else 'FAIL'}")
    ok = sum(x is not None for x in (sb, yg))
    print(f"\n{ok}/2 regens successful")
    sys.exit(0 if ok == 2 else 1)


if __name__ == "__main__":
    main()
