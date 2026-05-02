"""Generate 4 canonical character references for Thiaroye V5 Short.

Characters (from manifest thiaroye-v5-manifest.json):
1. tirailleur_principal (scenes 1, 2, 3) - Senegalese tirailleur, khaki-green uniform
2. officier_francais (scene 3) - French officer, dark blue kepi, stern
3. biram_senghor (scene 5) - Elderly Senegalese man, modern clothing, dignified
4. jeune_temoin (scene 6) - Young Senegalese man, contemporary, back to camera

Style: paper-craft COLD palette (grey-blue-olive), dot-eyes strict (R-PC17)
Model: gemini-3.1-flash-image-preview
Style anchor: tmp/thiaroye-styleref/thiaroye-clip1-styleref-v1.png

Generation in parallel via asyncio. ~$0.04 per image = $0.16 total.
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

OUT_DIR = ROOT / "public" / "assets" / "thiaroye-1944" / "refs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

STYLE_ANCHOR = ROOT / "tmp" / "thiaroye-styleref" / "thiaroye-clip1-styleref-v1.png"

# ============================================================
# STYLE CLAUSE (applied to all prompts)
# ============================================================
STYLE_CLAUSE = """STYLE: Flat 2D paper-craft illustration, COLD palette (grey-blue, olive-khaki, muted taupe, desaturated skin tones). Simple character shapes with clean dark outlines, flat color fills, paper texture. No gradients, no shading, no realism, no Pixar/3D.

STRICT EYES RULE: paper-craft dot-eyes only -- single small black dot per eye, NO iris, NO white visible, NO pupil structure. Eyes are simple black dots.

STRICT RENDERING: flat color fills only -- warmth and depth come from palette choices and dark outlines, NOT from shading gradients or soft highlights."""


# ============================================================
# PROMPTS
# ============================================================

PROMPT_TIRAILLEUR = f"""Generate a CHARACTER REFERENCE SHEET for a Senegalese tirailleur.

{STYLE_CLAUSE}

CHARACTER: Senegalese tirailleur (West African soldier in French colonial army, 1944).
- Tall, slim build, young adult man (age ~25-30)
- Dark BROWN skin (NOT pure black silhouette, facial features must be visible via dark outlines)
- Short cropped dark hair under a dark khaki-green beret/cap
- Military uniform: khaki-green / olive tunic with 4 chest pockets, matching trousers, dark leather belt
- Small French flag patch visible on shoulder (blue-white-red, simplified)
- Brown leather boots, ankle-high
- Dignified bearing, straight posture

COMPOSITION: character sheet with 3 views side by side on neutral cold grey-beige background:
LEFT: full-body FRONT view, arms at sides, neutral expression (attending)
CENTER: full-body 3/4 view, head tilted slightly, determined expression
RIGHT: full-body PROFILE view, head high, hopeful/proud expression

FORMAT: 1080x1920 vertical (9:16). Character occupies ~75% of vertical frame.

CRITICAL: No text, no labels, no banners, no writing anywhere. No other figures.
Character must be RECOGNIZABLE across the 3 views (same face structure, same uniform details, same proportions)."""


PROMPT_OFFICIER = f"""Generate a CHARACTER REFERENCE SHEET for a French officer.

{STYLE_CLAUSE}

CHARACTER: French army officer, 1944.
- Medium build, adult man (age ~40-50)
- Lighter skin tone (pale beige, cold undertone)
- Thin dark mustache, stern cold expression
- Dark NAVY BLUE kepi with gold trim
- Dark NAVY BLUE military jacket with brass buttons and shoulder epaulettes
- Matching dark navy trousers with thin side stripe
- Black leather boots, polished
- Black leather belt with holster
- Authoritarian, rigid bearing

COMPOSITION: character sheet with 3 views side by side on neutral cold grey-beige background:
LEFT: full-body FRONT view, hands behind back, cold neutral face
CENTER: full-body 3/4 view, hand resting on holster, authoritative glance
RIGHT: full-body PROFILE view, head slightly tilted down, contemptuous expression

FORMAT: 1080x1920 vertical (9:16). Character occupies ~75% of vertical frame.

CRITICAL: No text, no labels, no banners, no writing anywhere. Eyes must remain dot-eyes (black dots, NO iris). Character must be RECOGNIZABLE across the 3 views."""


PROMPT_BIRAM = f"""Generate a CHARACTER REFERENCE SHEET for Biram Senghor, elderly Senegalese man.

{STYLE_CLAUSE}

CHARACTER: Biram Senghor, elderly Senegalese man (age ~85-90), son of a tirailleur killed at Thiaroye in 1944, now a plaintiff in the 2026 Paris tribunal case.
- Tall, thin, slightly stooped but dignified bearing
- Dark BROWN skin with visible weathered lines (drawn as simple dark outlines, NOT shading)
- Short white cropped hair, white short beard
- Modern civilian clothing: dark grey-blue sobre suit jacket, white shirt, no tie
- His hands are prominent and weathered, holding a folded legal document (single sheet)
- Calm, determined expression. Grief held in, not shown through tears.
- R-PC19 reminder: emotion comes through POSTURE and GAZE, not tears or facial contortion

COMPOSITION: character sheet with 3 views side by side on neutral cold grey-beige background:
LEFT: full-body FRONT view, document held in both hands at chest level, facing forward
CENTER: CLOSE-UP of the WEATHERED HANDS holding the folded document (showing the grain of the paper and the hands' lines)
RIGHT: PORTRAIT 3/4 view (head and shoulders only), dignified look, gaze slightly off-camera, subtle gravity

FORMAT: 1080x1920 vertical (9:16).

CRITICAL: No text on the document (blank folded paper). No labels, no writing anywhere. Eyes are dot-eyes. No tears, no photorealistic skin detail -- emotion through posture."""


PROMPT_JEUNE_TEMOIN = f"""Generate a CHARACTER REFERENCE SHEET for a young Senegalese man, contemporary witness.

{STYLE_CLAUSE}

CHARACTER: Young Senegalese man (age ~25-30), contemporary. Represents the new generation receiving the memory.
- Athletic slim build, standing straight
- Dark BROWN skin
- Short cropped dark hair, clean-shaven
- Contemporary civilian clothing: sober dark navy cotton jacket, plain dark trousers, simple leather shoes or sneakers (visible but minimal)
- No visible logos, no text
- Reflective and respectful posture

COMPOSITION: character sheet with 3 views side by side on neutral cold grey-beige background:
LEFT: full-body BACK view (back turned to camera, head slightly tilted forward, looking at something invisible before him)
CENTER: full-body 3/4 BACK view (we can see a hint of profile, posture contemplative)
RIGHT: full-body SIDE PROFILE view, looking toward horizon

FORMAT: 1080x1920 vertical (9:16). Character occupies ~75% of vertical frame.

CRITICAL: No text, no labels, no writing. The emphasis is on POSTURE (contemplative, reverent). In the back views, the character's back must be recognizable by posture alone (no need to see face). Eyes when visible are dot-eyes."""


CHARACTERS = [
    ("tirailleur-principal", PROMPT_TIRAILLEUR),
    ("officier-francais", PROMPT_OFFICIER),
    ("biram-senghor", PROMPT_BIRAM),
    ("jeune-temoin", PROMPT_JEUNE_TEMOIN),
]


async def generate_charref(name: str, prompt: str, style_anchor_bytes: bytes):
    """Generate one character sheet with style anchor as reference."""
    out_path = OUT_DIR / f"{name}-charsheet.png"
    print(f"[{name}] starting...")
    try:
        contents = [
            types.Part.from_bytes(data=style_anchor_bytes, mime_type="image/png"),
            prompt,
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
                # Verify image
                img = Image.open(io.BytesIO(img_bytes))
                print(f"[{name}] SAVED: {out_path.name} ({img.size[0]}x{img.size[1]})")
                return True
        print(f"[{name}] ERROR: no image in response")
        return False
    except Exception as e:
        print(f"[{name}] EXCEPTION: {e}")
        return False


async def main():
    if not STYLE_ANCHOR.exists():
        print(f"ERROR: style anchor not found: {STYLE_ANCHOR}")
        return 1

    style_bytes = STYLE_ANCHOR.read_bytes()
    print(f"Style anchor: {STYLE_ANCHOR.name} ({len(style_bytes)/1024:.1f} KB)")
    print(f"Output dir: {OUT_DIR}")
    print(f"Generating {len(CHARACTERS)} character sheets in parallel...")
    print(f"[COST PREVIEW] {len(CHARACTERS)} * $0.04 = ${len(CHARACTERS) * 0.04:.2f}")
    print()

    tasks = [generate_charref(name, prompt, style_bytes) for name, prompt in CHARACTERS]
    results = await asyncio.gather(*tasks)

    ok = sum(1 for r in results if r)
    print(f"\nResults: {ok}/{len(CHARACTERS)} succeeded")
    return 0 if ok == len(CHARACTERS) else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
