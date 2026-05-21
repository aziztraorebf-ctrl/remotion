"""Generate 8 scene images for Abou Bakari II Short (parallel asyncio.gather).

Scenes:
  scene-ocean-v1       -- open Atlantic, fog wall (no charref)
  scene-empire-v1      -- throne room, Abou Bakari Royal
  scene-fleet-a-v1     -- 2000 pirogues at sea (no charref)
  scene-fleet-b-v1     -- lone returning captain, Capitaine pirogue
  scene-name-v1        -- abdication steps, Abou Bakari Marin
  scene-abdication-v1  -- new Moussa on throne
  scene-obsession-v1   -- single pirogue into fog, Abou Bakari Marin
  scene-colomb-v1      -- European caravel 1492, cold palette (no charref)

Rules applied:
  - R-NO-PARTICLES: zero dust/sparkles in all prompts
  - R-VIVANT: movement implied in every scene
  - R-STYLE-SEPIA: warm ochre/sienna/creme/or except scene-colomb (intentional cold)
  - R-EPOQUE: no European swords, no metal armor
  - Model: gemini-3.1-flash-image-preview (NON-NEGOTIABLE)
  - responseModalities: ["IMAGE", "TEXT"] -- no responseMimeType

Model: gemini-3.1-flash-image-preview
Cost: 8 images x $0.04 = $0.32
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
# PROMPTS — 8 scenes
# ============================================================

PROMPT_OCEAN = """Paper-craft illustration, 9:16 vertical format.

SCENE: The Atlantic Ocean horizon as seen from the West African coast, 1311. Three-quarters of the frame is deep blue-black ocean with gentle wave shapes in flat paper-craft layers. The horizon is a thick horizontal band of pale fog -- dense, opaque, impenetrable. At the very bottom of the frame, the edge of a sandy ochre beach with a few silhouetted figures (small, distant) leaning forward, looking out to sea -- bodies in motion, scanning the unknown. The fog wall fills the upper portion of the frame -- no sun visible, just diffuse light through the haze. One silhouetted figure stands slightly larger than the others, turned toward the ocean, weight shifted forward in contemplation and desire.

MOOD: foreboding vastness, the unknown. Warm ochre sand contrasting with cold blue-black ocean. The figures are alive with tension and curiosity.

STYLE: paper-craft flat illustration. Thick black outlines. Flat color fills. Warm ochre/sienna sand, deep blue-black ocean, pale fog band. 9:16 vertical.

NO text, NO labels, NO letters, NO numerals. NO dust particles, NO sparkles, NO floating particles."""


PROMPT_EMPIRE = """Paper-craft illustration, 9:16 vertical format.

REPRODUCE THE CHARACTER from the provided CHARACTER REF image exactly: same face, same short beard, same chibi proportions (large head, short body), same indigo boubou, same golden dome cap. Dark brown skin.

SCENE: The throne room of the Mali Empire, 1311. Mansa Abou Bakari II seated on a carved ebony throne elevated on ochre adobe steps. The throne room has tall adobe walls with geometric indigo-and-gold tapestries swaying gently. Gold ingots and salt slabs visible stacked in the background. Abou Bakari sits upright, leaning slightly forward, but his gaze drifts toward a small arched window on the left -- through it, a sliver of ocean horizon is visible. His expression: powerful but haunted, 60% authority 40% longing.

COMPOSITION: Character fills center 60% of frame. Throne room interior fills background. The small arched window with ocean hint visible upper left.

STYLE: paper-craft flat illustration. Thick black outlines. Flat color fills. Warm sepia palette (ochre, sienna, indigo/gold accents). 9:16 vertical.

NO text, NO labels, NO letters, NO numerals. NO dust particles, NO sparkles, NO floating particles."""


PROMPT_FLEET_A = """Paper-craft illustration, 9:16 vertical format.

SCENE: The open Atlantic Ocean, 1311. An enormous fleet of 2000 dugout canoes already at sea, in formation, viewed from slightly above and behind the rearmost pirogues. The pirogues are long wooden dugouts in flat paper-craft style, with tall cloth sails in ochre and sienna billowing in the wind. The formation stretches deep to the horizon in forced perspective -- front pirogues large and detailed, middle distance smaller, horizon line pirogues tiny. Deep blue-black ocean with flat wave layers in motion. Horizon line in the upper third. Sense of epic scale -- the fleet fills the entire ocean surface. Paddlers visible on the nearest pirogues, active, mid-stroke.

MOOD: epic departure, historical scale, alive with motion.

STYLE: paper-craft flat illustration. Thick black outlines. Flat color fills. Warm ochre/sienna sails, deep blue-black ocean. 9:16 vertical.

NO text, NO labels, NO letters, NO numerals. NO dust particles, NO sparkles, NO floating particles."""


PROMPT_FLEET_B = """Paper-craft illustration, 9:16 vertical format.

REPRODUCE THE CHARACTER from the provided CHARACTER REF image exactly: same face, same long unkempt beard, same chibi proportions, same worn earth-tone tunic. Dark brown skin.

SCENE: The West African coast at the shoreline, 1311. A single battered pirogue washes up onto the ochre sand, prow scraping the beach. The capitaine stands at the prow, one arm raised palm-outward at shoulder level -- gesture of warning, terror, stopping. He is small against the vast dark ocean behind him. A handful of onlookers on the shore lean back with alarm, arms raised, faces showing shock. The ocean behind is dark and turbulent with flat wave shapes still churning. The lone pirogue is visibly scarred, sail torn.

MOOD: fear, the ocean won. The lone returning boat against the immensity of what swallowed the rest. Raw terror on the captain's face.

STYLE: paper-craft flat illustration. Thick black outlines. Flat color fills. Warm ochre sand, dark turbulent ocean. 9:16 vertical.

NO text, NO labels, NO letters, NO numerals. NO dust particles, NO sparkles, NO floating particles."""


PROMPT_NAME = """Paper-craft illustration, 9:16 vertical format.

REPRODUCE THE CHARACTER from the provided CHARACTER REF image exactly: same face, same short beard, same chibi proportions, same simpler indigo tunic, same cloth head wrap, same single gold pendant. Dark brown skin. This is the MARIN (seafaring) version -- simpler, humbler attire than the royal throne room version.

SCENE: The steps of the Mali palace leading down to a port, 1311. Abou Bakari II in his simpler marin attire descends broad ochre adobe steps alone -- each step deliberate, unhurried. At the bottom of the steps, a single royal pirogue waits moored at the dock. He is seen from medium distance -- small enough to show the grandeur of the steps, large enough to read his determined expression (90% resolve, 10% solemnity). Behind him, the palace towers in indigo and gold. Before him, the ocean stretches to the horizon. Palace servants watch from the doorway above.

MOOD: solemn, resolute departure. The greatest voluntary renunciation in history. One man choosing the unknown over all known wealth.

STYLE: paper-craft flat illustration. Thick black outlines. Flat color fills. Warm sepia palette. 9:16 vertical.

NO text, NO labels, NO letters, NO numerals. NO dust particles, NO sparkles, NO floating particles."""


PROMPT_ABDICATION = """Paper-craft illustration, 9:16 vertical format.

REPRODUCE THE CHARACTER from the provided CHARACTER REF image exactly: same face, same calm regal expression, same chibi proportions, same white/gold boubou, same white turban with gold band, same multiple gold bracelets on both wrists. Dark brown skin.

SCENE: The Mali throne room -- the same room as a previous scene, now with a new man on the throne. Mansa Moussa settles onto the carved ebony throne, straightening with composed authority. He is serene, regal, at home in power. The room is overflowing with extraordinary wealth: stacks of gold ingots piled high, salt slabs, bolts of richly embroidered fabric, ceramic vessels. His white-and-gold boubou catches the light. The room feels heavier with gold than before -- richer, more settled.

MOOD: extraordinary wealth. A new era of unimaginable prosperity begins.

STYLE: paper-craft flat illustration. Thick black outlines. Flat color fills. Warm sepia palette (white/gold dominant for Moussa). 9:16 vertical.

NO text, NO labels, NO letters, NO numerals. NO dust particles, NO sparkles, NO floating particles."""


PROMPT_OBSESSION = """Paper-craft illustration, 9:16 vertical format.

REPRODUCE THE CHARACTER from the provided CHARACTER REF image exactly: same face, same short beard, same chibi proportions, same simpler indigo tunic, same cloth head wrap. Dark brown skin. MARIN version.

SCENE: The open Atlantic, 1311. A single royal pirogue viewed from slightly above and behind, moving westward into dense fog. Abou Bakari in marin attire stands at the stern, silhouetted against the fog wall, one hand gripping the steering oar, body leaning forward into the unknown. The fog swallows the horizon completely -- only diffuse white ahead. The ocean is dark blue-black. Only the rear third of the pirogue is visible -- the bow is already disappearing into white mist. A single cloth sail billows ahead, pulling the craft into the fog. Mood: solitary, resolute, westward. The smallest human against the largest unknown.

MOOD: singular obsession. One man. One pirogue. The infinite unknown.

STYLE: paper-craft flat illustration. Thick black outlines. Flat color fills. Dark blue-black ocean, white fog, warm ochre pirogue details. 9:16 vertical.

NO text, NO labels, NO letters, NO numerals. NO dust particles, NO sparkles, NO floating particles."""


PROMPT_COLOMB = """Paper-craft illustration, 9:16 vertical format.

IMPORTANT: Use a COLD PALETTE for this scene (blue-grey, slate, white sails) -- intentionally contrasting with the warm ochre/sienna of the previous Mali scenes.

SCENE: The Atlantic Ocean, 1492. A European caravel (Santa Maria style) under full white sail, crossing the frame from left to right with strong forward motion. The ship has a tall central mast with large square white sails filled with wind, additional lateen sail at stern. European cross flag flies at the mast. The ocean is dark grey-blue with flat wave layers. The palette is deliberately cold -- blue-grey, slate, white, minimal warm tones. The ship is large and imposing, fills the center of the frame. Flat paper-craft style, same thick outlines. A small European figure in period clothing visible at the bow, looking forward. Clouds streak in the cold sky above.

MOOD: cold historical irony. The celebrated "discoverer" arrives 181 years after someone else was already there.

STYLE: paper-craft flat illustration. Thick black outlines. Flat color fills. COLD PALETTE (blue-grey, slate, white) -- intentional contrast to warm sepia scenes. 9:16 vertical.

NO text, NO labels, NO letters, NO numerals. NO dust particles, NO sparkles, NO floating particles."""


# ============================================================
# SCENE DEFINITIONS: (output_name, prompt, [ref_paths])
# ============================================================
SCENES = [
    ("scene-ocean-v1",      PROMPT_OCEAN,       [STYLE_ANCHOR]),
    ("scene-empire-v1",     PROMPT_EMPIRE,      [STYLE_ANCHOR, REF_ROYAL]),
    ("scene-fleet-a-v1",    PROMPT_FLEET_A,     [STYLE_ANCHOR]),
    ("scene-fleet-b-v1",    PROMPT_FLEET_B,     [STYLE_ANCHOR, REF_CAPITAINE]),
    ("scene-name-v1",       PROMPT_NAME,        [STYLE_ANCHOR, REF_MARIN]),
    ("scene-abdication-v1", PROMPT_ABDICATION,  [STYLE_ANCHOR, REF_MOUSSA]),
    ("scene-obsession-v1",  PROMPT_OBSESSION,   [STYLE_ANCHOR, REF_MARIN]),
    ("scene-colomb-v1",     PROMPT_COLOMB,      [STYLE_ANCHOR]),
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
