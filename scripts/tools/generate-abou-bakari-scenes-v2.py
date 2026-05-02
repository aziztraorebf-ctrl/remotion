"""Generate 5 corrected scene images v2 for Abou Bakari II Short (parallel asyncio.gather).

Scenes regenerated with corrections:
  scene-empire-v2   -- throne room, Abou Bakari Royal (FIXED: pieds nus -> sandales en cuir or)
  scene-fleet-b-v2  -- capitaine still at sea, NOT on beach (FIXED: plage -> ocean dechaine)
  scene-name-v2     -- abdication steps with LARGE royal pirogue + fleet visible (FIXED: banderole + garde clone + pirogue trop simple)
  scene-abdication-v2 -- Moussa throne room INTERIOR ONLY (FIXED: copie Sonjata naissance -> interieur seul)
  scene-obsession-v2 -- LARGE royal pirogue into fog with crew (FIXED: pirogue trop simple)

Rules applied:
  - R-NO-PARTICLES: zero dust/sparkles in all prompts
  - R-VIVANT: movement implied in every scene
  - R-STYLE-SEPIA: warm ochre/sienna/creme/or palette
  - R-EPOQUE: no European swords, no metal armor
  - R-STYLE-ONLY: style anchor = palette/texture only, NOT composition
  - Model: gemini-3.1-flash-image-preview (NON-NEGOTIABLE)
  - responseModalities: ["IMAGE", "TEXT"] -- no responseMimeType

Model: gemini-3.1-flash-image-preview
Cost: 5 images x $0.04 = $0.20
Output: public/assets/abou-bakari/scenes/
"""

import asyncio
import io
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUT_DIR = ROOT / "public" / "assets" / "abou-bakari" / "scenes"
OUT_DIR.mkdir(parents=True, exist_ok=True)

REFS_DIR = ROOT / "public" / "assets" / "abou-bakari" / "refs"

STYLE_ANCHOR = REFS_DIR / "style-anchor-scene1-village.png"
REF_ROYAL = REFS_DIR / "abou-bakari-royal-charref-v1.png"
REF_MARIN = REFS_DIR / "abou-bakari-marin-charref-v1.png"
REF_MOUSSA = REFS_DIR / "mansa-moussa-charref-v2.png"
REF_CAPITAINE = REFS_DIR / "capitaine-pirogue-charref-v3.png"


# ============================================================
# PROMPTS v2 -- 5 corrected scenes
# ============================================================

PROMPT_EMPIRE_V2 = """STYLE ANCHOR (palette/texture only, NOT composition): first image provided.
CHARACTER REF: second image provided -- reproduce this exact character: same chibi proportions, same face, same short neat beard, same deep indigo boubou with gold embroidery, same golden dome cap, same gold necklace and bracelets. CRITICALLY: he wears ORNATE LEATHER SANDALS with gold details -- clearly visible on his feet, NOT barefoot.

Paper-craft illustration, 9:16 vertical. SCENE: The throne room of the Mali Empire, 1311. Mansa Abou Bakari II seated on a carved ebony throne elevated on ochre adobe steps. The throne room has tall adobe walls with geometric indigo-and-gold tapestries hanging on the walls. A few gold objects (cups, scepters) on a low table beside the throne -- tasteful, not piled high. Abou Bakari sits upright but his gaze drifts toward a small arched window on the left -- through it, a sliver of ocean horizon is visible at dusk. His expression: powerful but haunted. His SANDALS with gold details are clearly visible at his feet -- ornate leather, NOT bare feet.

COMPOSITION: Character fills center 60% of frame. Interior closed room -- no outdoor baobab, no sky, no exterior. Two or three attendants in background (smaller, in plain ochre tunics, clearly different from Abou Bakari).

NO text. NO labels. NO dust particles. NO sparkles. NO bare feet. Thick outlines. Flat fills. 9:16 vertical."""


PROMPT_FLEET_B_V2 = """STYLE ANCHOR (palette/texture only): first image provided.
CHARACTER REF: second image provided -- reproduce this exact character: same chibi proportions, same long unkempt beard, same worn earth-tone sleeveless tunic, same cloth wrap at waist. He stands at the bow of a battered pirogue, one arm raised palm-outward in a gesture of terror and warning.

Paper-craft illustration, 9:16 vertical. SCENE: The open Atlantic Ocean, 1311. A single battered pirogue is still at sea -- NOT on a beach, NOT near shore. The pirogue is damaged, sail torn, wood cracked. The capitaine stands at the bow, arm raised in warning. The ocean around him is turbulent -- large flat stylized wave shapes in dark blue-black, cresting white. The sky is storm-grey. NO beach visible. NO villagers. NO shore. Just the lone surviving boat on a violent sea. Mood: this man survived something terrifying and he is still surrounded by it.

COMPOSITION: Pirogue diagonal across center frame. Ocean fills 80% of frame. Sky storm-grey upper 20%. Character clearly visible at bow.

NO text. NO labels. NO dust particles. NO beach. NO crowd. NO shore. Flat fills. 9:16 vertical."""


PROMPT_NAME_V2 = """STYLE ANCHOR (palette/texture only): first image provided.
CHARACTER REF: second image provided -- reproduce this exact character in seafaring attire: same face, same short neat beard, simpler indigo tunic, low cloth head wrap, single gold pendant. He walks down the palace steps toward the dock.

Paper-craft illustration, 9:16 vertical. SCENE: The grand steps of the Mali palace leading down to a busy royal port, 1311. Abou Bakari II descends wide ochre adobe steps alone and deliberately. At the dock below: a LARGE ROYAL PIROGUE -- significantly bigger than a fishing boat, with a tall indigo sail bearing a gold geometric emblem, multiple oarsmen already at their stations. Behind this lead pirogue, more pirogues of the royal fleet are visible on the water, stretching back toward the horizon -- this is not a lone departure but the beginning of an expedition.

GUARDS on the steps are CLEARLY DIFFERENT from Abou Bakari: they wear SHORT OCHRE TUNICS (not long boubous), carry wooden spears with iron tips and round leather shields, bare legs. Their silhouette is completely different from Abou Bakari's long robe. No banners. No decorative streamers. No festive elements -- the mood is solemn departure.

COMPOSITION: Abou Bakari center-frame on steps. Large royal pirogue visible at bottom. Fleet visible on water behind. Palace architecture upper background.

NO banners. NO streamers. NO clone guards. NO text. NO dust particles. Flat fills. 9:16 vertical."""


PROMPT_ABDICATION_V2 = """STYLE ANCHOR (palette/texture only -- DO NOT copy its composition or narrative): first image provided.
CHARACTER REF: second image provided -- reproduce this exact character: same chibi proportions, same white-and-gold boubou, same white turban with gold band, same multiple gold bracelets, same calm regal expression.

Paper-craft illustration, 9:16 vertical. SCENE: INTERIOR throne room of the Mali Empire -- CLOSED WALLS, no sky, no outdoor elements, no baobab tree. The same carved ebony throne with Mansa Moussa seated on it. He is ALONE on the throne -- no woman, no baby, no diviner, no crowd pressing close. Two or three distant attendants stand at the edges of the frame, small and deferential. The room conveys extraordinary wealth through architecture: gold-leaf geometric patterns on the adobe walls, rich indigo tapestries, tall carved columns. A single large gold scepter rests across his lap.

MOOD: serene, absolute power. A new era. The room itself radiates wealth -- through craftsmanship and architecture, not through piles of gold bars.

COMPOSITION: Moussa centered and dominant. Interior closed space. Attendants peripheral and small.

NO woman. NO baby. NO diviner. NO baobab. NO outdoor sky. NO piled gold bars. NO crowd. NO text. NO dust particles. Flat fills. 9:16 vertical."""


PROMPT_OBSESSION_V2 = """STYLE ANCHOR (palette/texture only): first image provided.
CHARACTER REF: second image provided -- reproduce this exact character in seafaring attire: same face, same short neat beard, same simpler indigo tunic, same low cloth head wrap.

Paper-craft illustration, 9:16 vertical. SCENE: The open Atlantic, 1311. A LARGE ROYAL PIROGUE -- clearly the flagship, bigger than a fishing boat, with a tall indigo sail bearing a gold geometric emblem -- moves westward into dense white fog. The pirogue is seen from slightly above and behind. Abou Bakari in marin attire stands at the stern, silhouetted against the fog wall, gaze fixed west. Two or three oarsmen visible at their stations on the pirogue -- he is not alone, this is a royal vessel with crew. The fog swallows the horizon completely. The ocean is dark blue-black. Only the rear third of the pirogue is fully visible -- the bow is already disappearing into white mist.

MOOD: solitary obsession, royal dignity, westward resolve. The king chose this.

NO text. NO labels. NO dust particles. NO sparkles. Flat fills. 9:16 vertical."""


# ============================================================
# SCENE DEFINITIONS: (output_name, prompt, [ref_paths])
# ============================================================
SCENES = [
    ("scene-empire-v2",      PROMPT_EMPIRE_V2,      [STYLE_ANCHOR, REF_ROYAL]),
    ("scene-fleet-b-v2",     PROMPT_FLEET_B_V2,     [STYLE_ANCHOR, REF_CAPITAINE]),
    ("scene-name-v2",        PROMPT_NAME_V2,         [STYLE_ANCHOR, REF_MARIN]),
    ("scene-abdication-v2",  PROMPT_ABDICATION_V2,  [STYLE_ANCHOR, REF_MOUSSA]),
    ("scene-obsession-v2",   PROMPT_OBSESSION_V2,   [STYLE_ANCHOR, REF_MARIN]),
]


async def generate_scene(name: str, prompt: str, ref_paths: list):
    """Generate one scene image with the provided refs as input."""
    out_path = OUT_DIR / f"{name}.png"
    print(f"[{name}] starting... ({len(ref_paths)} refs)")
    try:
        contents = []
        for ref_path in ref_paths:
            if not ref_path.exists():
                print(f"[{name}] ERROR: ref not found: {ref_path}")
                return False
            contents.append(
                types.Part.from_bytes(data=ref_path.read_bytes(), mime_type="image/png")
            )
        contents.append(prompt)

        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
            ),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.data:
                img_bytes = part.inline_data.data
                out_path.write_bytes(img_bytes)
                img = Image.open(io.BytesIO(img_bytes))
                print(f"[{name}] SAVED {out_path.name} ({img.size[0]}x{img.size[1]})")
                return True
        print(f"[{name}] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[{name}] EXCEPTION: {e}")
        return False


async def main():
    print(f"Model: {MODEL}")
    print(f"Output: {OUT_DIR}")
    print(f"Scenes: {len(SCENES)}")
    print(f"Cost estimate: {len(SCENES)} x $0.04 = ${len(SCENES) * 0.04:.2f}")
    print()

    for name, _, ref_paths in SCENES:
        for ref_path in ref_paths:
            if not ref_path.exists():
                print(f"ABORT: ref missing: {ref_path}")
                return 1

    tasks = [generate_scene(name, prompt, refs) for name, prompt, refs in SCENES]
    results = await asyncio.gather(*tasks)

    ok = sum(1 for r in results if r)
    failed = [SCENES[i][0] for i, r in enumerate(results) if not r]
    print(f"\nResults: {ok}/{len(SCENES)} succeeded")
    if failed:
        print(f"Failed: {failed}")
    return 0 if ok == len(SCENES) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
