"""Generate Thiaroye V5 Scene 1 source image — V3 MINIMALISTE (R-PROMPT-LIBERAL).

Pivot 2026-04-23: V1 = ils sont deja arrives. V2 = rigide, trinite forcee, pas vivant.
V3 = approche liberale, prompt court, laisser Gemini composer la vie organiquement.

Hypothese testee (R-PROMPT-LIBERAL): sur-scripting tue la vie dans les compositions
paper-craft. Les references visuelles + une direction narrative claire + des contraintes
STYLE strictes suffisent — la composition peut etre ouverte.

Cible V3:
- 6-8 tirailleurs scattered naturally sur le pont, PAS de trinite rigide
- Expressions variees (weary, pensive, curious, drained) — faces humaines, pas figees
- Scene vivante: amorces de mouvement, postures organiques, pas parade
- Palette froide dual-tone preservee (ciel/mer/Dakar = froid; uniformes = ocre-khaki)
- Dot-eyes stricts sur TOUTES les faces (R-PC17)
- 9:16 vertical, paper-craft Sonjata
- ZERO trinite d'activites forcee, ZERO hand-choreography detaillee

Model: gemini-3.1-flash-image-preview
Cost: $0.04 pour 1 image.

Budget V3 total (image + clip Seedance suivant) = $3.94 max.
Si V3 echoue self-review -> bascule Pan Remotion sur v2. Pas de V4.
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

OUT_DIR = ROOT / "public" / "assets" / "thiaroye-1944" / "scene1"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# DOUBLE ANCHOR (proven pattern V1/V2) — on garde les memes refs
STYLE_ANCHOR_1 = Path("/tmp/thiaroye-v5-style-anchors/scene1-assembled-frame.png")
STYLE_ANCHOR_2 = (
    ROOT / "public" / "assets" / "thiaroye-1944" / "refs" / "tirailleur-principal-charsheet.png"
)


# ==========================================================================
# Prompt V3 minimaliste — R-PROMPT-LIBERAL
# ==========================================================================
# Philosophie: direction narrative + contraintes STYLE non-negotiables + liberte
# compositionnelle. Gemini compose la vie sur le pont.

PROMPT_V3 = """Paper-craft storybook illustration, 9:16 vertical frame.

SCENE: Cold December morning, 1944. On the deck of a French troop ship arriving at the port of Dakar. Senegalese tirailleurs are returning home after fighting for France. The ship approaches the harbor; Dakar's colonial waterfront emerges in cold misty distance. A lived-in moment of arrival — weary, quiet, human.

REFERENCES:
- Reference 1: our canonical paper-craft style (thick black outlines, flat color fills, paper kraft texture, rounded cartoon proportions, PURE DOT EYES).
- Reference 2: the exact tirailleur character design (khaki-green uniform, French flag patch, dark green beret, dark brown skin, dot-eyes). ALL soldiers in the scene match this design.

PEOPLE ON DECK:
- 6 to 8 Senegalese tirailleurs scattered naturally across the deck. No parade, no formation — organic placement, some closer, some further, some in groups of two or three, some alone.
- Each soldier has his own moment: some lean on the railing looking toward Dakar, some sit on crates or duffel bags, some stand quietly, some in small conversation, one perhaps smoking, one perhaps adjusting his kit. Let the composition breathe.
- Expressions are VARIED and HUMAN: weary, pensive, curious, tired, thoughtful, distant. NOT all identical, NOT frozen, NOT ceremonial. Each face tells a slightly different small story.
- All faces keep PURE DOT EYES (one black dot per eye, even in profile views) — no iris, no pupils, no eyelashes. Smooth skin, no wrinkles.
- All soldiers are West African Senegalese with DARK BROWN skin. No ambiguity with North African or lighter tones.

PALETTE — thematic dual-tone:
- Cold world (ship deck surfaces, Dakar buildings in distance, harbor water, sky, railings): desaturated slate grey, cold blue-grey, muted steel, pale overcast cold clouds.
- Warm pockets (tirailleur uniforms, berets, boots, duffel bags, skin): khaki-green, dark green, brown leather, tan canvas, dark brown skin.
- This contrast is the thematic point: the men return warm-toned to a world that reads cold. Cold overcast morning, NO golden hour, NO warm sunset glow.

SETTING DETAILS:
- Foreground: weathered wooden deck planks, a few tan canvas duffel bags.
- Mid/background: the ship's low railing, a hint of the ship's cabin/chimney silhouette, the harbor water with simple flat ripple shapes, Dakar's colonial port silhouette emerging in the cold distance (rooflines, a small lighthouse or warehouse shapes, all desaturated cold greys).
- The ship is APPROACHING, not docked. We are ON the ship.

STYLE (NON-NEGOTIABLE):
- Flat 2D paper-craft. Thick black outlines. Flat color fills, NO gradients, NO shading.
- Paper kraft texture on background.
- Rounded cartoon proportions — NOT semi-realistic BD, NOT Pixar 3D, NOT photorealism.
- Pure dot-eyes on every face, every view including profile.
- NO text anywhere (no ship names, no signs, no banners, no writing on flag patches beyond the plain tricolor).
- NO motion lines, NO speed lines, NO dust, NO drawn wind, NO drawn light rays, NO lens flares, NO emotion marks.

MOOD: lived-in, quiet, human, cold arrival. Let the scene breathe — natural composition, organic placement, varied humanity. This is deck life at the end of a long voyage home, not a staged arrival ceremony."""


async def generate_scene(anchor1_bytes: bytes, anchor2_bytes: bytes) -> bool:
    out_path = OUT_DIR / "scene1-source-v3.png"

    print("[scene1 v3] generating MINIMALIST approach (R-PROMPT-LIBERAL)...")
    print(f"[scene1 v3] prompt length: {len(PROMPT_V3)} chars (~{len(PROMPT_V3.split())} words)")
    try:
        contents = [
            types.Part.from_bytes(data=anchor1_bytes, mime_type="image/png"),
            types.Part.from_bytes(data=anchor2_bytes, mime_type="image/png"),
            PROMPT_V3,
        ]
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
                print(f"[scene1 v3] SAVED: {out_path} ({img.size[0]}x{img.size[1]})")

                sidecar = OUT_DIR / "scene1-source-v3.prompt.txt"
                sidecar.write_text(
                    f"# Scene 1 V3 source image prompt (R-PROMPT-LIBERAL)\n"
                    f"Model: {MODEL}\n"
                    f"Anchor 1: {STYLE_ANCHOR_1}\n"
                    f"Anchor 2: {STYLE_ANCHOR_2}\n"
                    f"Approach: minimalist, compositional freedom, ~35 lines\n\n"
                    f"---PROMPT---\n{PROMPT_V3}\n"
                )
                print(f"[scene1 v3] sidecar prompt saved: {sidecar.name}")
                return True

        print("[scene1 v3] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[scene1 v3] EXCEPTION: {e}")
        return False


async def main():
    if not STYLE_ANCHOR_1.exists():
        print(f"ERROR: style anchor 1 not found: {STYLE_ANCHOR_1}")
        return 1
    if not STYLE_ANCHOR_2.exists():
        print(f"ERROR: style anchor 2 not found: {STYLE_ANCHOR_2}")
        return 1

    anchor1_bytes = STYLE_ANCHOR_1.read_bytes()
    anchor2_bytes = STYLE_ANCHOR_2.read_bytes()
    print(f"Anchor 1: {STYLE_ANCHOR_1.name} (paper-craft canonical)")
    print(f"Anchor 2: {STYLE_ANCHOR_2.name} (tirailleur charref validated)")
    print(f"Output: {OUT_DIR}")
    print(f"[COST PREVIEW] 1 * $0.04 = $0.04")
    print()

    ok = await generate_scene(anchor1_bytes, anchor2_bytes)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
