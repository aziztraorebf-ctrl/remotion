"""Regenerate 2 corrected scenes for Abou Bakari II Short — v4 corrections.

- scene-fleet-b-v4: same storm composition, capitaine DARK BROWN SKIN (not pale)
- scene-name-v4: ship directly in axis of steps (not to the side), Abou Bakari walks straight toward it
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
REF_MARIN = REFS / "abou-bakari-marin-charref-v1.png"
REF_CAPITAINE = REFS / "capitaine-pirogue-charref-v3.png"

STYLE_RULES = """STRICT PAPER-CRAFT STYLE — NON-NEGOTIABLE:
- Flat 2D storybook illustration. Thick clean black outlines on every shape.
- Flat color fills ONLY — no gradients, no shading, no realistic lighting, no painterly textures.
- Warm sepia palette: ochre, burnt sienna, cream, indigo, gold.
- Chibi/cartoon proportions on all characters: large round heads, short bodies.
- Dot-eyes: single black dot per eye, no iris, no white sclera.
- NO photorealism. NO comic-book BD. NO manga. STRICTLY paper-craft flat cartoon.
- NO dust particles. NO sparkles. NO floating particles.
- NO text. NO labels."""


def pil_part(path: Path) -> types.Part:
    return types.Part.from_bytes(data=path.read_bytes(), mime_type="image/png")


SCENES = [
    {
        "name": "scene-fleet-b-v4",
        "refs": [STYLE_ANCHOR, REF_CAPITAINE],
        "prompt": f"""Generate a paper-craft illustration for the lone surviving pirogue scene.

{STYLE_RULES}

STYLE ANCHOR (first image): palette and texture reference ONLY.
CHARACTER REF (second image): the capitaine — reproduce his exact chibi proportions, long unkempt beard. CRITICAL: his skin is DARK BROWN — same deep dark brown as shown in the character ref. NOT pale, NOT light, NOT tan. DARK BROWN skin, same as the ref image.

SCENE: The open Atlantic Ocean, 1311. A single battered pirogue struggling in a violent storm. The capitaine is seen from PROFILE or THREE-QUARTER BACK VIEW — gripping the prow/mast with both hands, body low and braced, fighting to stay on the boat as massive waves crash around him. His long unkempt beard whips in the wind. The pirogue tilts dramatically. Sail torn and flapping. Ocean violent — large flat stylized wave shapes in dark blue-black cresting with white foam.

SKIN: The capitaine has DARK BROWN skin — this is mandatory. His dark skin must be clearly visible against the lighter foam and sky.

NO beach. NO shore. NO villagers. Pure open ocean, storm sky, one battered boat, one dark-skinned man fighting the sea.

COMPOSITION: Pirogue diagonal, tilting dramatically. Capitaine gripping hard at prow, profile or back view. Ocean fills 80% of frame. Dark storm sky upper 20%.

9:16 vertical. NO text. NO particles. Flat fills. Thick outlines. DARK BROWN skin on capitaine.""",
    },
    {
        "name": "scene-name-v4",
        "refs": [STYLE_ANCHOR, REF_MARIN],
        "prompt": f"""Generate a paper-craft illustration for Abou Bakari's departure scene.

{STYLE_RULES}

STYLE ANCHOR (first image): palette and texture reference ONLY.
CHARACTER REF (second image): Abou Bakari in marin attire — same chibi proportions, same face, same short neat beard, simpler indigo tunic, low cloth head wrap, single gold pendant.

SCENE: The grand steps of the Mali palace leading down to the royal port, 1311. Abou Bakari II descends wide ochre adobe steps. CRITICAL COMPOSITION: the large royal pirogue is positioned DIRECTLY AT THE BOTTOM OF THE STEPS, straight ahead in Abou Bakari's path — NOT to the side, NOT at an angle. He walks down and the ship is directly in front of him at the bottom. The viewer sees him from slightly behind or from the side, so the ship is visible straight ahead in the same axis as his descent.

The royal pirogue: large flagship vessel with tall mast, INDIGO SAIL with GOLD GEOMETRIC EMBLEM, multiple oarsmen already seated at stations. Additional pirogues of the royal fleet visible on the water behind it.

Guards on the steps flanking Abou Bakari: SHORT OCHRE/SIENNA TUNICS (not long boubous), wooden spears, round leather shields. Clearly distinct silhouette from Abou Bakari's long marin tunic.

Palace architecture in upper background: tall adobe walls, geometric indigo-and-gold patterns.

NO banners. NO streamers. NO festive decorations. Solemn departure mood.

ANIMATION NOTE built into composition: Abou Bakari's path leads straight down toward the ship — ideal for a straight tracking animation, no pivot needed.

9:16 vertical. NO text. NO banners. NO particles. Flat fills. Thick outlines.""",
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
    print(f"Generating {len(SCENES)} scenes v4...")
    print(f"Cost: ~${len(SCENES) * 0.04:.2f}")
    print()
    results = await asyncio.gather(*[generate_one(s) for s in SCENES])
    ok = sum(1 for r in results if r)
    print(f"\nDone: {ok}/{len(SCENES)} succeeded")


if __name__ == "__main__":
    asyncio.run(main())
