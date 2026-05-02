"""Regenerate 4 corrected scenes for Abou Bakari II Short — v3 corrections.

Corrections vs v2:
- scene-abdication-v3 (Moussa): throne normal scale, diverse servants at normal height, deferential posture/clothing not size
- scene-fleet-b-v3 (capitaine): holding on to prow in storm, profile/back view, NOT arm raised at nobody
- scene-name-v3 (depart): v1 composition + style strict paper-craft, no BD drift, fix banner+clone guard+simple pirogue
- scene-obsession-v3: v1 fog composition + royal pirogue from v2, strict paper-craft, no BD drift
"""

import asyncio
import io
import os
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

REFS = ROOT / "public" / "assets" / "abou-bakari" / "refs"
STYLE_ANCHOR = REFS / "style-anchor-scene1-village.png"
REF_ROYAL = REFS / "abou-bakari-royal-charref-v1.png"
REF_MARIN = REFS / "abou-bakari-marin-charref-v1.png"
REF_MOUSSA = REFS / "mansa-moussa-charref-v2.png"
REF_CAPITAINE = REFS / "capitaine-pirogue-charref-v3.png"

STYLE_RULES = """STRICT PAPER-CRAFT STYLE — this is NON-NEGOTIABLE:
- Flat 2D storybook illustration. Thick clean black outlines on every shape.
- Flat color fills ONLY — no gradients, no shading, no realistic lighting, no painterly textures.
- Paper kraft warm texture on background only. Warm sepia palette: ochre, burnt sienna, cream, indigo, gold.
- Chibi/cartoon proportions on all characters: large round heads, short bodies. Same style as the CHARACTER REF provided.
- Dot-eyes: single black dot per eye, no iris, no white sclera.
- NO photorealism. NO comic-book BD style. NO manga. NO realistic proportions. STRICTLY paper-craft flat cartoon.
- NO dust particles. NO sparkles. NO gold dust. NO floating particles of any kind.
- NO text. NO labels. NO numbers anywhere."""


def pil_part(path: Path) -> types.Part:
    data = path.read_bytes()
    return types.Part.from_bytes(data=data, mime_type="image/png")


SCENES = [
    {
        "name": "scene-abdication-v3",
        "refs": [STYLE_ANCHOR, REF_MOUSSA],
        "prompt": f"""Generate a paper-craft illustration for the Mali throne room scene.

{STYLE_RULES}

STYLE ANCHOR (first image): use for palette and texture reference ONLY — do NOT copy its composition or narrative.
CHARACTER REF (second image): Mansa Moussa — reproduce exactly: same chibi proportions, same white-and-gold boubou, same white turban with gold band, same gold bracelets, calm regal expression.

SCENE: Interior throne room of the Mali Empire, 1311. Mansa Moussa is seated on a carved ebony throne. THE THRONE IS NORMAL SIZE — proportionate to Moussa's body, not monumental or towering. Moussa sits naturally on it, his feet resting on the floor. The throne is elevated on TWO OR THREE low adobe steps only.

Around the throne: 3 to 4 servants and courtiers, all at NORMAL HUMAN HEIGHT — same scale as Moussa, not miniaturized. Their servant status is shown through POSTURE (slight bow, hands clasped, attentive gaze toward Moussa) and CLOTHING (plain cotton tunics in ochre and sienna, simple cloth wraps, no gold embroidery, no jewelry) — NOT through being made physically smaller. The servants are DIVERSE: different heights, different facial features, different skin tones within the dark brown range.

The room: closed interior walls of adobe, geometric indigo tapestries hanging, tall carved wooden columns. Warm torchlight atmosphere. A single large gold scepter across Moussa's lap. Tasteful wealth in the architecture — no piled gold bars.

COMPOSITION: Moussa centered. Servants flanking and slightly behind. Room interior fills background. No sky, no outdoor elements, no baobab.

9:16 vertical. NO text. NO particles. Flat fills. Thick outlines.""",
    },
    {
        "name": "scene-fleet-b-v3",
        "refs": [STYLE_ANCHOR, REF_CAPITAINE],
        "prompt": f"""Generate a paper-craft illustration for the lone returning pirogue scene.

{STYLE_RULES}

STYLE ANCHOR (first image): palette and texture reference ONLY.
CHARACTER REF (second image): the capitaine — same chibi proportions, long unkempt beard, worn earth-tone sleeveless tunic.

SCENE: The open Atlantic Ocean, 1311. A single battered pirogue struggling in a violent storm. The capitaine is seen from PROFILE or THREE-QUARTER BACK VIEW — he is NOT facing the viewer, NOT raising his arm to greet anyone. He is gripping the prow railing with both hands, body low and braced, fighting to stay on the boat as waves crash. The pirogue tilts dramatically in the swell. The sail is torn and flapping. The ocean is violent — large flat stylized wave shapes in dark blue-black cresting with white foam layers.

The capitaine's posture communicates survival, not warning: hunched, gripping tight, body at an angle against the storm. His long unkempt beard whips in the wind.

NO beach. NO shore. NO villagers. NO crowd. Pure open ocean, storm sky, one battered boat, one man fighting the sea.

COMPOSITION: Pirogue diagonal, tilting. Capitaine at prow gripping hard, profile or back view. Ocean fills 80% of frame. Dark storm sky upper 20%.

9:16 vertical. NO text. NO particles. Flat fills. Thick outlines.""",
    },
    {
        "name": "scene-name-v3",
        "refs": [STYLE_ANCHOR, REF_MARIN],
        "prompt": f"""Generate a paper-craft illustration for Abou Bakari's departure scene.

{STYLE_RULES}

STYLE ANCHOR (first image): palette and texture reference ONLY — use its warm ochre/sienna/indigo colors and paper-craft texture.
CHARACTER REF (second image): Abou Bakari in marin attire — same chibi proportions, same face, same short neat beard, simpler indigo tunic, low cloth head wrap, single gold pendant.

SCENE: The grand steps of the Mali palace leading down to the royal port, 1311. Abou Bakari II descends wide ochre adobe steps with calm determination. He is center frame, seen from a medium distance.

At the dock below: a LARGE ROYAL PIROGUE — clearly a flagship vessel, significantly bigger than a fishing boat. It has a tall mast with an INDIGO SAIL bearing a simple GOLD GEOMETRIC EMBLEM. Multiple oarsmen are already at their stations on this lead pirogue. Behind it, more pirogues of the royal fleet stretch across the water toward the horizon.

Guards on the steps are CLEARLY DIFFERENT from Abou Bakari: they wear SHORT OCHRE/SIENNA TUNICS (not long boubous), carry wooden spears with iron tips and round leather shields. Their silhouette is compact and military, completely distinct from Abou Bakari's flowing marin tunic.

NO banners. NO streamers. NO festive decorations of any kind. The mood is solemn and historic.

Palace architecture visible in upper background: tall adobe walls, geometric indigo-and-gold patterns, no European elements.

COMPOSITION: Abou Bakari center-frame on steps. Royal pirogue and fleet visible at bottom and background. Guards flanking steps. Palace behind.

9:16 vertical. NO text. NO banners. NO particles. Flat fills. Thick outlines.""",
    },
    {
        "name": "scene-obsession-v3",
        "refs": [STYLE_ANCHOR, REF_MARIN],
        "prompt": f"""Generate a paper-craft illustration for Abou Bakari's lone westward voyage.

{STYLE_RULES}

STYLE ANCHOR (first image): palette and texture reference ONLY.
CHARACTER REF (second image): Abou Bakari in marin attire — same chibi proportions, same face, same short neat beard, simpler indigo tunic, low cloth head wrap.

SCENE: The open Atlantic, 1311. A LARGE ROYAL PIROGUE — the flagship vessel, bigger than a fishing pirogue, with a TALL INDIGO SAIL bearing a GOLD GEOMETRIC EMBLEM — moves westward into a vast wall of white fog. The pirogue is seen from SLIGHTLY ABOVE AND BEHIND, moving away from the viewer toward the horizon.

Abou Bakari stands at the stern, silhouetted, gaze fixed west into the fog. Two or three oarsmen are visible at their stations — he is not alone, this is a crewed royal vessel. The fog wall fills the upper half of the frame — dense, white, opaque, swallowing the horizon completely. The ocean is dark blue-black with flat wave layers. The bow of the pirogue is already disappearing into the mist.

A distant shoreline or coast may be faintly visible far to the right — this is acceptable and adds depth.

MOOD: solitary obsession, westward resolve, the unknown ahead.

COMPOSITION: Royal pirogue large and central, moving away. Fog fills upper frame. Dark ocean below. Abou Bakari silhouette at stern. Crew at oars.

9:16 vertical. NO text. NO particles. Flat fills. Thick outlines. STRICT paper-craft style — no BD, no painterly.""",
    },
]


async def generate_one(scene: dict) -> bool:
    name = scene["name"]
    out_path = OUT_DIR / f"{name}.png"
    print(f"[{name}] starting...")

    contents = [pil_part(r) for r in scene["refs"]] + [scene["prompt"]]

    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
                temperature=1.0,
            ),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data and "image" in part.inline_data.mime_type:
                img = Image.open(io.BytesIO(part.inline_data.data))
                img.save(out_path)
                print(f"[{name}] SAVED {img.size[0]}x{img.size[1]}")
                return True
        print(f"[{name}] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[{name}] EXCEPTION: {e}")
        return False


async def main() -> None:
    print(f"Generating {len(SCENES)} scenes v3...")
    print(f"Cost: ~${len(SCENES) * 0.04:.2f}")
    print()
    results = await asyncio.gather(*[generate_one(s) for s in SCENES])
    ok = sum(1 for r in results if r)
    print(f"\nDone: {ok}/{len(SCENES)} succeeded")


if __name__ == "__main__":
    asyncio.run(main())
