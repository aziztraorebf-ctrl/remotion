"""
Soundjata Acte VII — "Legende vivante" (griots / transmission intergenerationnelle).

Phase 1 : generation des 5 refs Gemini pour futur Seedance storyboard-to-video 12s.
Couvre scenes : griots + boucheOreille + pasDeVersion + chaqueGriot.

Refs produites (output : public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte7/) :
  1. storyboard.png       - 1x5 panels black-and-white sketch, transmission orale
  2. elder.png            - griot age, kora, feu de camp nocturne
  3. young.png            - jeune griot/auditeur, feu suggere en arriere-plan
  4. female.png           - griotte ou matriarche auditrice, feu suggere
  5. environment.png      - plate nuit savane feu de camp, ZERO personnage

Style serie GeoAfrique : flat 2D BD illustree, pas photorealisme, pas Pixar.

Modele : models/gemini-3.1-flash-image-preview
Cle : GEMINI_API_KEY (.env)
Budget : 5 x $0.08 = $0.40
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

OUT_DIR = (
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

# Style-anchor reference (optional, kept minimal — we rely on text prompt for series style)
# If needed later, pass existing combat-refs savanna plate as a style anchor.

# -------- PROMPTS --------

PROMPT_STORYBOARD = """Generate a NEW black-and-white sketch storyboard page.

CRITICAL LAYOUT:
- EXACTLY 5 panels in a SINGLE HORIZONTAL ROW (1 row, 5 columns)
- Each panel is a clean rectangle with border
- Read order: left to right
- All 5 panels same size, same vertical height
- NOT a 2x3 grid. NOT a stacked layout. ONE ROW of 5 panels.

CONTENT STYLE:
- Loose graphite pencil sketch, rapid gestural lines
- Warm orange/ember dabs acceptable for firelight glow
- NO text, NO speech bubbles, NO panel numbers, NO letters anywhere
- Dynamic lines for motion (hand gestures, firelight flicker)

STORY: Acte VII - Griots transmit the Soundjata legend around a night fire in the Mali savanna. Oral tradition passed generation to generation. Each griot adds his own version.

SHOT LIST (5 panels, ONE HORIZONTAL ROW):

PANEL 1 - WIDE ESTABLISHING NIGHT SHOT: circle of listeners around a blazing fire under starry sky, savanna silhouettes of baobabs. Elder griot seated with kora instrument, young listeners around him. Warm firelight casts shadows.

PANEL 2 - MEDIUM CLOSE-UP on the ELDER GRIOT: dark brown skin, deeply wrinkled face, white beard, blue indigo boubou robe, kora (21-string harp-lute) held across his lap, both hands on the strings. Eyes half-closed, mouth open in song. Firelight on his face from below-right.

PANEL 3 - EXTREME CLOSE-UP on the elder griot's HANDS plucking kora strings: individual fingers on the 21 strings visible, motion lines indicating music, the round calabash body of the kora partially visible. Detailed knuckles, gold ring on one finger.

PANEL 4 - MEDIUM SHOT on a YOUNG LISTENER: dark brown skin, short hair, simple cotton tunic, age around 12, seated cross-legged, eyes WIDE in wonder, mouth slightly open, completely captivated. Firelight on his face. Another child partially visible beside him.

PANEL 5 - WIDE SHOT: years later, the young listener is now ADULT, grown up, seated WITH HIS OWN kora instrument, passing the story to a NEW circle of children around a new fire. Same posture as the elder in panel 1. Visual suggestion of generational continuity.

STYLE: loose graphite pencil sketch, warm firelight wash in all panels, emotional close-ups in panels 2, 3, 4. Black lines on cream paper with orange firelight accents.

FINAL LAYOUT REMINDER: 5 panels in ONE HORIZONTAL ROW, read left to right. Not a grid. One row.

NO text, NO letters, NO numerals anywhere in the image."""


PROMPT_ELDER = """Generate a 2D flat illustrated BD-style character reference portrait.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D look, no painterly texture. Matches the GeoAfrique YouTube series aesthetic - a flat animated educational documentary style with warm African color palette.

CHARACTER: ELDER GRIOT (age 70+, Mali, 13th century).
- Dark brown skin (deep warm brown)
- Deeply wrinkled face, crow's feet at eyes, laugh lines around mouth
- Short white beard, short white hair
- Dignified serene expression, half-smile, eyes looking slightly off-camera as if lost in song
- Long flowing indigo-blue BOUBOU robe with subtle embroidery at collar, traditional West African cut
- Seated cross-legged
- Holding a KORA instrument across his lap: large round calabash sound body (covered with cowhide, natural beige), long wooden neck vertical, 21 nylon strings splitting into two parallel rows, handle bars for gripping. Both of his hands are on the strings, thumbs and index fingers plucking.
- Simple leather sandals visible

COMPOSITION: full-body portrait, centered, character occupies ~65% of vertical frame. Character seated.

BACKGROUND: Suggest a NIGHT FIRE SCENE in the background — warm orange and red firelight glow behind him, dark blue savanna night sky above, silhouettes of acacia trees and a baobab far in the distance. The background is painterly-soft / slightly blurred so the character remains the focal point. Firelight casts a warm rim on his face from below-right.

FORMAT: 1080x1920 vertical (9:16).

CRITICAL: No text, no letters, no numerals visible anywhere. No signs, no banners, no writing on robe or instrument. Natural anatomy — correct number of fingers (5 per hand), realistic proportions, no morphing. No extra limbs."""


PROMPT_YOUNG = """Generate a 2D flat illustrated BD-style character reference portrait.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D look, no painterly texture. Matches the GeoAfrique YouTube series aesthetic.

CHARACTER: YOUNG LISTENER / APPRENTICE GRIOT (age 12, Mali, 13th century).
- Dark brown skin (same warm tone as elder)
- Round youthful face, smooth skin, full cheeks
- Short dark hair, closely cropped
- Large expressive DARK BROWN eyes, WIDE OPEN in wonder and awe, pupils slightly dilated
- Mouth slightly parted in quiet amazement
- Simple cream/off-white cotton tunic, no ornaments, a small leather cord necklace
- Bare arms, slender build
- Seated cross-legged, hands resting on knees, body leaning slightly forward toward an off-screen storyteller

COMPOSITION: full-body portrait, centered, character occupies ~70% of vertical frame. Character seated.

BACKGROUND: Suggest a NIGHT FIRE SCENE in the background — warm orange firelight glow from the LEFT side (off-frame fire), dark blue savanna night sky, silhouettes of other seated listeners (children) barely visible as dark shapes behind him. Firelight casts a strong warm glow on the LEFT side of his face and body. Background is painterly-soft so character stays the focal point.

FORMAT: 1080x1920 vertical (9:16).

CRITICAL: No text, no letters, no numerals visible anywhere. No signs, no writing. Natural anatomy — correct number of fingers (5 per hand), realistic child proportions, no morphing. No extra limbs. Face shows pure captivation, not fear."""


PROMPT_FEMALE = """Generate a 2D flat illustrated BD-style character reference portrait.

STYLE: Flat vector illustration, vivid saturated colors, clean confident ink-like outlines, no photorealism, no Pixar/3D look, no painterly texture. Matches the GeoAfrique YouTube series aesthetic.

CHARACTER: GRIOTTE / FEMALE MATRIARCH (age around 45, Mali, 13th century). She is a woman keeper of oral tradition, not a man.
- Dark brown skin (deep warm brown)
- Oval face, dignified serene expression, slight knowing smile, eyes half-closed as if listening to the song deeply
- Hair wrapped in a richly colored HEADSCARF (gele) in deep red and gold patterns, tied high
- Large gold hoop earrings
- Deep burgundy-red boubou robe with yellow and orange woven pattern at the chest, traditional West African cut
- Layered amber and gold necklaces
- Seated with her hands gently clasped in her lap
- Mature adult body, respectful dignified posture

COMPOSITION: full-body portrait, centered, character occupies ~65% of vertical frame. Character seated.

BACKGROUND: Suggest a NIGHT FIRE SCENE in the background — warm orange firelight glow from the RIGHT side (off-frame fire), dark blue savanna night sky above, silhouettes of acacia trees far in the distance. Firelight casts a warm rim on the RIGHT side of her face. Background is painterly-soft so the character remains the focal point.

FORMAT: 1080x1920 vertical (9:16).

CRITICAL: No text, no letters, no numerals visible anywhere. No signs, no writing on robe or scarf. Natural anatomy — correct number of fingers (5 per hand), realistic adult female proportions, no morphing. No extra limbs. Expression is serene and wise, not sad."""


PROMPT_ENVIRONMENT = """Generate a 2D flat illustrated BD-style LANDSCAPE / ENVIRONMENT plate.

STYLE: Flat illustration, vivid saturated colors, clean painterly style with confident outlines, no photorealism, no Pixar/3D. Matches the GeoAfrique YouTube series aesthetic.

SCENE: Mali savanna at NIGHT. A large central CAMP FIRE blazes in the foreground (empty circular clearing in the grass, stones arranged in a ring around it, flames rising with warm orange/yellow/red licks and ember sparks drifting upward). The fire is the focal light source.

ENVIRONMENT DETAILS:
- Surrounding the fire clearing: tall dry savanna grass, ochre and yellow tones softened by night
- Mid-ground: several silhouettes of ACACIA TREES with flat umbrella canopies
- Background: one large BAOBAB tree silhouette to the right, branches bare and twisted
- Sky: deep indigo-blue night sky with a scatter of stars and a thin crescent moon on the upper left
- Firelight glow spreads outward from the fire, casting warm orange light on the grass and the nearest tree trunks, fading to cool blue in the distance
- Small drifting embers/sparks rising from the fire

CRITICAL - ABSOLUTELY ZERO CHARACTERS:
- NO humans visible anywhere
- NO animals
- NO silhouettes of people
- NO figures of any kind around the fire
- The area around the fire is EMPTY — stones arranged for seating but no one seated yet
- Pure environment plate, ready to have characters composited in later

COMPOSITION: 1080x1920 vertical (9:16). The fire is centered in the lower third of the frame. The sky fills the upper half. Depth should be readable: foreground (fire + clearing), mid-ground (grass + first trees), background (baobab + sky).

COLOR PALETTE: deep indigo night blue, warm orange fire, ochre grass, dark tree silhouettes, soft star whites.

CRITICAL: No text, no letters, no numerals visible anywhere. No signs, no banners, no writing. No characters of any kind. Pure atmospheric environment plate."""


# -------- GENERATION LOGIC --------

TASKS = [
    ("storyboard.png", PROMPT_STORYBOARD, "1920x1080 (5 horizontal panels)"),
    ("elder.png", PROMPT_ELDER, "1080x1920 (vertical char ref)"),
    ("young.png", PROMPT_YOUNG, "1080x1920 (vertical char ref)"),
    ("female.png", PROMPT_FEMALE, "1080x1920 (vertical char ref)"),
    ("environment.png", PROMPT_ENVIRONMENT, "1080x1920 (vertical env plate)"),
]


def generate_one(filename: str, prompt: str, size_hint: str) -> Path | None:
    out_path = OUT_DIR / filename
    print(f"\n[GEN] {filename} — target {size_hint}")
    try:
        resp = client.models.generate_content(
            model=MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
        )
        for part in resp.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img = Image.open(io.BytesIO(part.inline_data.data))
                out_path.parent.mkdir(parents=True, exist_ok=True)
                img.save(out_path, "PNG")
                print(f"[OK] {out_path} ({img.size[0]}x{img.size[1]})")
                return out_path
        print(f"[FAIL] {filename} — no image in response")
        return None
    except Exception as e:
        print(f"[ERROR] {filename} — {e}")
        return None


def main():
    print(f"[INFO] Output directory: {OUT_DIR}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    results = []
    for filename, prompt, size_hint in TASKS:
        path = generate_one(filename, prompt, size_hint)
        results.append((filename, path))

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    ok = 0
    for filename, path in results:
        if path and path.exists():
            size_kb = path.stat().st_size // 1024
            print(f"  [OK]   {filename} — {size_kb} KB")
            ok += 1
        else:
            print(f"  [FAIL] {filename}")
    print(f"\n{ok}/{len(TASKS)} images generated")
    sys.exit(0 if ok == len(TASKS) else 1)


if __name__ == "__main__":
    main()
