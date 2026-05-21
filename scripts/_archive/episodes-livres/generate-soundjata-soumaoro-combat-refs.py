"""
Combat Reference Generator — Soundjata vs Soumaoro
Generates 2 character refs for Seedance 2.0 Omni reference-to-video test.
Goal: reproduce the motion/choreography of test-choregraphie.mov with our characters.

Output: 2 PNG images (1 per character), full-body combat stance, neutral background.
Format: 9:16 to match Seedance output, graphic novel anime style.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image
import io

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUT_DIR = Path(__file__).parent.parent.parent / "public" / "assets" / "library" / "geoafrique" / "soundjata" / "combat-refs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

STYLE_PREAMBLE = """Generate a NEW illustration with these EXACT specifications:

STYLE: 2D anime/graphic novel illustration, bold clean black outlines, flat color fills with subtle cel-shading, painted 2D aesthetic similar to modern animated series (Avatar: The Last Airbender, Dragon Prince style). No photorealism, no 3D render, no Pixar soft look, no manga screen tones. Serious historical tone.

FORMAT: Vertical 9:16 portrait (1080x1920).

BACKGROUND: Neutral muted plain background — soft warm tan / dusty desert tone with very subtle distant haze. No detailed scenery, no text, no banners. The character is the subject.

LIGHTING: Natural daylight from left, soft warm highlights on skin and fabric, cool subtle shadows.

ANATOMY: Accurate human proportions. Full body visible head to feet. Dynamic combat stance, weight on legs, ready to move.

NO TEXT, NO LETTERS, NO NUMERALS, NO BANNERS visible anywhere.

"""

STYLE_SUFFIX = """

CRITICAL: 2D flat illustration only. Bold outlines. Clean flat colors with cel-shading. Full body head to feet, centered in frame. Combat-ready stance (not static portrait). Neutral muted background."""


CHARACTERS = [
    {
        "id": "soundjata-combat-ref",
        "prompt": """CHARACTER: Soundjata Keita, legendary 13th century Mandinka warrior-king of the Mali Empire.

APPEARANCE:
- Young African man, early 20s, dark skin (deep brown complexion), athletic muscular build
- Short braided hair close to the scalp, Mandinka warrior style
- Determined fierce expression, intense focused eyes looking forward
- Clean strong facial features, no beard

OUTFIT:
- Sleeveless white cotton tunic reaching mid-thigh, clean ivory-white color
- Golden embroidered trim at the collar and hem (Mali empire gold)
- Wide crimson red sash (belt) tied at the waist, ends hanging loose
- Simple leather sandals
- Gold bracelet on right wrist

WEAPON:
- Holds a curved Mandinka sabre (takoba) in his RIGHT HAND, blade raised diagonally upward and to the side in a combat guard position
- Blade is clean polished steel with slight curve
- Leather-wrapped hilt

POSE:
- Full body visible, head to feet
- Dynamic combat stance: feet planted wide apart, knees slightly bent, body weight forward and ready
- RIGHT arm raised with sabre held diagonally across the upper body
- LEFT arm extended forward, open palm facing opponent (warding gesture)
- Body facing slightly 3/4 toward camera, head turned toward viewer with intense gaze
- Ready-to-strike posture, coiled energy

COLORS: White tunic, red sash, gold accents, steel blade, warm brown skin""",
    },
    {
        "id": "soumaoro-combat-ref",
        "prompt": """CHARACTER: Soumaoro Kante, the sorcerer-king of the Sosso Empire, antagonist in the Epic of Sundiata. Powerful dark wizard.

APPEARANCE:
- Older African man, late 40s, dark skin (deep brown complexion), tall imposing lean build
- Long black dreadlocks or braids hanging past the shoulders
- Severe menacing expression, piercing eyes, slight scowl
- Sharp angular facial features, trimmed short beard

OUTFIT:
- Long flowing black robe/tunic reaching mid-calf, deep matte black fabric
- Dark red (blood crimson) geometric patterns embroidered along the hem and sleeves
- Wide black leather sash tied at the waist with copper buckle
- Bare feet, or dark leather sandals
- Heavy bone and iron fetish amulets hanging on his chest (sacred magical charms, small skulls and claws)
- Copper arm bands on both forearms

WEAPON: NO WEAPON. His hands are bare — he fights with SORCERY.

MAGICAL SIGNATURE:
- Both hands held open, fingers spread wide
- Faint dark red magical aura glows around his palms and fingertips (subtle red energy wisps, not too bright, painterly not VFX)
- Small floating red embers drifting up from his hands

POSE:
- Full body visible, head to feet
- Dynamic combat stance: feet planted wide apart, slight lean forward
- BOTH arms raised and extended forward, palms open and facing the opponent (casting pose)
- Body facing slightly 3/4 toward camera, head lowered slightly with eyes looking up menacingly
- Intimidating commanding presence, ready to unleash magic

COLORS: Black robe, dark red accents, copper metal, bone white amulets, dark red magical glow, warm brown skin""",
    },
]


def generate(character):
    print(f"[GEN] {character['id']}...")
    full_prompt = STYLE_PREAMBLE + character["prompt"] + STYLE_SUFFIX
    resp = client.models.generate_content(
        model=MODEL,
        contents=[full_prompt],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
        ),
    )
    for part in resp.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            img = Image.open(io.BytesIO(part.inline_data.data))
            out_path = OUT_DIR / f"{character['id']}.png"
            img.save(out_path, "PNG")
            print(f"[OK] {out_path} ({img.size})")
            return out_path
    print(f"[FAIL] {character['id']} — no image in response")
    return None


if __name__ == "__main__":
    for c in CHARACTERS:
        generate(c)
    print("\nDone.")
