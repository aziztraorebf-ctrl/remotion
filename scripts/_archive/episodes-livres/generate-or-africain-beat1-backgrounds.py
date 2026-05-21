"""
Generate 4 background variants for Or Africain Beat 1 (Hook).
Format: 1080x1920 portrait 9:16, ambiance dark, premium feel.
The compteur ($5,589) sits center-screen; karaoke subtitles bottom.
=> Backgrounds must NOT have busy content in the central vertical band.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

OUT_DIR = ROOT / "public" / "souverain" / "or-africain" / "backgrounds"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Common base — all variants share these constraints
BASE_CONSTRAINTS = """
PORTRAIT 9:16 aspect ratio, 1080x1920 pixels.
Dark, premium, cinematic mood. Pure black or near-black dominant.
Subtle warm gold/amber highlights only — NEVER bright or saturated.
The CENTER VERTICAL BAND of the image (middle 50% width, middle 60% height) must be MINIMAL and DARK — no busy details, no text, no large objects.
Texture and detail should sit at the EDGES (top corners, bottom corners, side bands).
NO text, NO numbers, NO logos, NO watermarks anywhere.
NO people, NO faces.
Style: editorial, financial documentary, Bloomberg-meets-cinema. Premium, not flashy.
"""

VARIANTS = [
    {
        "name": "v1-bourse",
        "label": "Bourse abstraite",
        "prompt": f"""{BASE_CONSTRAINTS}

Concept: ABSTRACT TRADING FLOOR ATMOSPHERE.
Out-of-focus blurred bokeh of stock ticker numbers and price candle charts in deep amber/gold,
floating in pure black void. Heavy bokeh, shallow depth of field — numbers should be unreadable blurs.
Vertical streaks of soft amber light suggest scrolling tickers at the screen edges.
Thin horizontal grid lines barely visible, like a dim financial dashboard.
Mood: late-night Bloomberg terminal, after-hours trading, quiet tension.
""",
    },
    {
        "name": "v2-lingot",
        "label": "Lingots / coulée d'or",
        "prompt": f"""{BASE_CONSTRAINTS}

Concept: MOLTEN GOLD on dark surface.
Top portion of the frame (top 30%): close-up macro of liquid molten gold flowing slowly,
showing rich amber-orange highlights, deep reflective surface texture, hot metal glow.
Bottom 70%: solid black void with subtle warm light pooling at the very bottom edge,
as if heat radiates from below.
The center band remains dark and clean — only the top edge has the gold detail.
Mood: alchemy, raw material, primal value, weight, heat.
""",
    },
    {
        "name": "v3-parchemin-vintage",
        "label": "Parchemin financier ancien (XIXe)",
        "prompt": f"""{BASE_CONSTRAINTS}

Concept: AGED FINANCIAL LEDGER PAPER, 19th century banking archive.
Texture of dark aged parchment — deep brown-black with cracked, mottled grain.
Subtle handwritten accounting marks, old ink columns, faded sums in sepia ink — but ALL very faint, edges only.
Center of image is mostly clean dark parchment so a number can sit there.
Heavy vignette darkening the corners further.
Mood: archive vault, Rothschild-era ledger, weight of historical money records.
Color palette: deep umber, charcoal black, faint amber ink. NO bright whites.
""",
    },
    {
        "name": "v4-parchemin-modern",
        "label": "Parchemin moderne / texture papier sombre",
        "prompt": f"""{BASE_CONSTRAINTS}

Concept: MODERN DARK PREMIUM PAPER TEXTURE, editorial financial press.
Deep matte black paper with very fine fiber grain visible — like premium luxury annual report cover.
Faint embossed circular patterns or guilloché lines in the corners (security-paper style, like banknotes),
in barely-visible warm gold leaf — extremely subtle, almost invisible.
Soft radial vignette: center slightly lighter than edges, drawing the eye to the middle.
Mood: Financial Times weekend edition, IMF report cover, contemporary luxury finance.
Color palette: charcoal, deep black, hint of gold leaf.
""",
    },
]


def generate(variant):
    print(f"\n{'='*70}")
    print(f"Generating: {variant['name']} — {variant['label']}")
    print(f"{'='*70}")

    response = client.models.generate_content(
        model=MODEL,
        contents=[variant["prompt"]],
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    output_path = OUT_DIR / f"beat1-bg-{variant['name']}.png"
    saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            output_path.write_bytes(part.inline_data.data)
            print(f"  Saved: {output_path}")
            saved = True
            break

    if not saved:
        print(f"  ERROR: no image returned for {variant['name']}")
        for part in response.candidates[0].content.parts:
            if part.text:
                print(f"  Text response: {part.text[:200]}")


if __name__ == "__main__":
    for variant in VARIANTS:
        generate(variant)

    print(f"\n{'='*70}")
    print(f"Done. Outputs in: {OUT_DIR}")
    print(f"{'='*70}")
