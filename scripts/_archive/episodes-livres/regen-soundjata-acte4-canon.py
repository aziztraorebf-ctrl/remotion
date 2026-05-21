"""
Regen ciblee Acte IV Soundjata — alignement sur le ref canonique adulte.

Probleme : 4 refs Acte IV ont ete generees from scratch alors que le ref canonique
Soundjata adulte existait deja (combat-ref.png utilise dans Acte V). Resultat :
2 personnages visuellement differents pour le meme Soundjata.

Solution : passer soundjata-combat-ref.png comme INPUT IMAGE Gemini en edition
chirurgicale. Sabre partout (pas la lance), tresses, tunique blanche, sash rouge,
pas de barbe — tout preserve.

4 regens:
  1. soundjata-adult-warrior-ref.png   - edition chirurgicale (1 input ref)
  2. soundjata-exile-ref.png           - edition chirurgicale (1 input ref)
  3. soundjata-lion-returns-ref.png    - edition chirurgicale (1 input ref)
  4. storyboard-acte4-clip1.png        - generation 9 panels 3x3 (3 input refs)

Modele : models/gemini-3.1-flash-image-preview
Budget : 4 x $0.08 = $0.32 (ceiling $0.40 avec retry)

Note : NE PAS toucher messagers-cavaliers-ref.png ni mema-environment.png (deja OK).
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

# Ref canonique Soundjata adulte (source pour les 4 regens)
CANON_REF = (
    ROOT
    / "public"
    / "assets"
    / "library"
    / "geoafrique"
    / "soundjata"
    / "combat-refs"
    / "soundjata-combat-ref.png"
)

ACTE4_DIR = (
    ROOT
    / "public"
    / "assets"
    / "library"
    / "geoafrique"
    / "heros-oublies"
    / "soundjata"
    / "refs"
    / "acte4"
)

# Refs OK a recuperer pour le storyboard (NE PAS REGENERER)
MESSAGERS_REF = ACTE4_DIR / "messagers-cavaliers-ref.png"
MEMA_REF = ACTE4_DIR / "mema-environment.png"

# Outputs
WARRIOR_OUT = ACTE4_DIR / "soundjata-adult-warrior-ref.png"
EXILE_OUT = ACTE4_DIR / "soundjata-exile-ref.png"
LION_OUT = ACTE4_DIR / "soundjata-lion-returns-ref.png"
STORYBOARD_OUT = ACTE4_DIR / "storyboard-acte4-clip1.png"


# ============================================================
# PROMPTS — edition chirurgicale base sur le ref canonique
# ============================================================

CANON_LOCK = """Take the character from this reference image. Keep face, hairstyle (woven braids on the head), skin tone (deep brown), body type (athletic young adult man), white tunic with gold trim at collar, red sash tied at the waist, gold bracelet on right wrist, simple sandals, curved saber EXACTLY THE SAME — same person, same look. He is clean-shaven, NO beard, NO mustache. He has woven braids — NOT short hair, NOT bald."""


PROMPT_WARRIOR = (
    CANON_LOCK
    + """

Modify only: stance is hunter/warrior at rest, holding the curved saber lowered at his side (point toward the ground or slightly forward), slight forward lean as if observing prey, attentive gaze. Savanna environment background suggested with acacia trees and amber sky at golden hour. Same outfit, same braids, same face, no beard, no spear, no other weapon — just the curved saber from the reference.

STYLE: 2D flat illustration, vivid saturated colors, clean confident outlines, GeoAfrique BD aesthetic — match the style of the reference image exactly.

FORMAT: 1080x1920 vertical (9:16), full body portrait centered.

CRITICAL: No text, no letters, no numerals, no signs anywhere. Natural anatomy: 5 fingers per hand, no extra limbs, no morphing. Keep the exact same character identity as the reference."""
)


PROMPT_EXILE = (
    CANON_LOCK
    + """

Modify only: replace the curved saber with a small cloth bundle slung over his right shoulder (a traveler's bundle wrapped in cloth, tied with a cord). Add light dust on the white tunic and red sash (slightly worn but SAME COLORS — still white tunic, still red sash, just dustier). Tired posture: slight slouch in the shoulders, head slightly down, weary but dignified. Neutral tan / dusty road environment background, soft warm light.

Same braids on the head, same face, no beard, NO weapon at all — only the bundle on shoulder.

STYLE: 2D flat illustration, vivid saturated colors, clean confident outlines, GeoAfrique BD aesthetic — match the style of the reference image exactly.

FORMAT: 1080x1920 vertical (9:16), full body portrait centered.

CRITICAL: No text, no letters, no numerals, no signs anywhere. Natural anatomy: 5 fingers per hand, no extra limbs, no morphing. Keep the exact same character identity as the reference."""
)


PROMPT_LION = (
    CANON_LOCK
    + """

Modify only: now mounted on a powerful black stallion, riding on a savanna hilltop crest at sunrise. Orange/amber sunrise behind him backlights his silhouette (rim light on the edges of his body and the horse). His red sash flows in the wind behind him. He raises the curved saber HIGH ABOVE HIS HEAD in an epic gesture of return and command. Strong heroic pose.

Same braids on the head, same face, no beard, same white tunic with gold trim, same red sash, same curved saber from the reference. NO spear, NO other weapon — just the curved saber.

STYLE: 2D flat illustration, vivid saturated colors, clean confident outlines, GeoAfrique BD aesthetic — match the style of the reference image exactly.

FORMAT: 1080x1920 vertical (9:16), wide heroic shot with rider centered on hilltop.

CRITICAL: No text, no letters, no numerals, no signs anywhere. Natural anatomy: 5 fingers per hand, horse with 4 legs correctly positioned, no extra limbs, no morphing. Keep the exact same character identity as the reference."""
)


# ============================================================
# STORYBOARD 9 panels 3x3 — generation avec 3 input refs
# ============================================================

PROMPT_STORYBOARD = """Generate a NEW black-and-white sketch storyboard page in 9 panels 3x3 grid layout.

Use the references with strict priority:
- Image 1 = Soundjata adult identity anchor (woven braids on the head, white tunic with gold trim at collar, red sash tied at waist, curved saber, deep brown skin, NO beard, athletic young adult man) — keep him visually consistent in all panels where he appears. NEVER give him short hair, NEVER give him a beard, NEVER give him a spear. Always woven braids, always clean-shaven (panel 6 may suggest the faintest stubble for time passage but stay subtle), always curved saber.
- Image 2 = 3 messenger horsemen identity anchor (distinct outfit colors: blue/indigo turbaned rider, red turbaned rider in ocher robe, green-robed rider) — keep their distinct colors.
- Image 3 = Mema environment anchor (Sahelian ocher mud-brick architecture with conical minaret and date palms in desert).

LAYOUT: EXACTLY 9 panels in a 3x3 grid (3 rows, 3 columns), thin black borders, all panels same size, small shot label in caps at the top of each panel (WIDE, MEDIUM, CLOSE, EXTREME CLOSE-UP, etc.), pencil graphite sketch style on cream paper with light color washes (ocher tones for Mema, sunrise warm amber for the final panel). NO text or dialogue inside panels except the tiny shot label at the top.

SHOT LIST (9 panels, read left-to-right top-to-bottom):

PANEL 1 (top-left) WIDE — Soundjata adult (woven braids, white tunic with gold trim, red sash, curved saber sheathed at hip), back to camera, small bundle on shoulder, walking away from his Mandingue village at dusk, baobabs silhouetted against amber sky.

PANEL 2 (top-middle) MEDIUM — Soundjata in profile, walking on dusty road, eyes fixed forward with quiet determination. His white tunic and red sash visible. Golden grazing light from the side.

PANEL 3 (top-right) EXTREME CLOSE-UP — sandaled feet on cracked dry earth, slow firm step, dust trail rising. Pure transition shot, no face.

PANEL 4 (middle-left) WIDE — Mema oasis-city establishing shot (use Image 3 as reference): ocher mud-brick walls, conical minaret, date palms, desert beyond. Soundjata small at center entering through the gate, tiny silhouette.

PANEL 5 (middle-middle) MEDIUM — Soundjata adult learning hunter/warrior arts, holding his curved saber in a training stance, an older Mema master beside him in flowing robes giving instruction. Savanna outskirts of Mema, a few palms in background.

PANEL 6 (middle-right) CLOSE-UP — Soundjata's face, eyes mature and patient, light beard stubble suggested but still recognizable as the canon Soundjata (woven braids preserved, no full beard, just a faint shadow on the jaw). Mature gaze.

PANEL 7 (bottom-left) WIDE — 3 distinct horsemen (use Image 2 as reference: blue/indigo + ocher with red turban + green) galloping at full speed across savanna, dust kicked up by hooves, urgency.

PANEL 8 (bottom-middle) MEDIUM — lead horseman (blue/indigo turbaned) leaning over his horse's neck, urgency and exhaustion on his face, focused forward.

PANEL 9 (bottom-right) WIDE FINAL — horsemen arriving exhausted at the gates of Mema (ocher walls in background), Soundjata adult silhouetted in a doorway recognizing the messenger. Suspended moment of recognition. Warm amber sunrise light. Soundjata's woven braids and white tunic with red sash visible in silhouette.

CRITICAL CONSTRAINTS:
- 9 panels in a 3x3 grid only. No 2x3, no 1x5, no other layout.
- Soundjata MUST keep his canonical look (woven braids, white tunic, red sash, curved saber, clean-shaven) in panels 1, 2, 5, 6, 9. Panel 6 may suggest light stubble subtly but braids and overall identity preserved.
- The 3 horsemen MUST keep their distinct outfit colors as in Image 2.
- Mostly monochrome graphite sketch, light desaturated color washes only (ocher for Mema, warm amber for sunrise final panel).
- No text labels inside panels except the shot type at the very top of each panel."""


# ============================================================
# GENERATION HELPERS
# ============================================================


def load_ref(path: Path) -> types.Part:
    if not path.exists():
        raise FileNotFoundError(f"Reference missing: {path}")
    with open(path, "rb") as f:
        data = f.read()
    print(f"[REF] loaded {path.name} ({len(data)} bytes)")
    return types.Part.from_bytes(data=data, mime_type="image/png")


def gen_with_refs(label: str, prompt: str, ref_paths: list[Path], out_path: Path) -> Path | None:
    print(f"\n[GEN] {label} -> {out_path.name}")
    try:
        contents = [load_ref(p) for p in ref_paths] + [prompt]
        resp = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
        )
        for part in resp.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img = Image.open(io.BytesIO(part.inline_data.data))
                img.save(out_path, "PNG")
                print(f"[OK] {out_path} ({img.size[0]}x{img.size[1]})")
                return out_path
        print(f"[FAIL] {label} — no image returned")
        return None
    except Exception as e:
        print(f"[ERROR] {label} — {e}")
        return None


def main():
    print(f"[INFO] Canon ref: {CANON_REF}")
    print(f"[INFO] Output dir: {ACTE4_DIR}")

    if not CANON_REF.exists():
        print(f"[FATAL] Canon ref missing: {CANON_REF}")
        sys.exit(2)

    results = {}

    # 3 editions chirurgicales (1 ref input chacune)
    results["warrior"] = gen_with_refs(
        "1/4 Adult Warrior", PROMPT_WARRIOR, [CANON_REF], WARRIOR_OUT
    )
    results["exile"] = gen_with_refs(
        "2/4 Exile (bundle, no weapon)", PROMPT_EXILE, [CANON_REF], EXILE_OUT
    )
    results["lion"] = gen_with_refs(
        "3/4 Lion Returns (mounted, saber raised)", PROMPT_LION, [CANON_REF], LION_OUT
    )

    # Storyboard 9 panels (3 refs : canon Soundjata + messagers + mema)
    results["storyboard"] = gen_with_refs(
        "4/4 Storyboard 9panels 3x3",
        PROMPT_STORYBOARD,
        [CANON_REF, MESSAGERS_REF, MEMA_REF],
        STORYBOARD_OUT,
    )

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for label, p in results.items():
        status = "OK" if p else "FAIL"
        print(f"  {label:12} : {status}  ({p.name if p else '-'})")
    ok = sum(1 for p in results.values() if p)
    print(f"\n{ok}/4 regens successful")
    sys.exit(0 if ok == 4 else 1)


if __name__ == "__main__":
    main()
