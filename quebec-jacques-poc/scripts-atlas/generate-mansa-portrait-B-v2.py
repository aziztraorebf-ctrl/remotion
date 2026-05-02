"""Generate Mansa Moussa portrait B v2 — plan moyen majestueux climax.
References: Abou Bakari char-ref royal v1 + abou-bakari-roi-plan-large-REF (trône).
Style: cohesive with GeoAfrique character canon, but seated/throne pose for climax narrative.
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

REF1_PATH = ROOT / "public/assets/abou-bakari/refs/abou-bakari-royal-charref-v1.png"
REF2_PATH = ROOT / "public/assets/geoafrique/characters/abou-bakari-roi-plan-large-REF.png"
OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "assets"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "mansa-portrait-B-v2-canonique-trone.png"

PROMPT = """Two reference images are provided:
- Reference 1: West African royal character char-ref in 3 views, showing the visual STYLE (flat 2D illustration, mudcloth-pattern robes, dignified pose, traditional Mande aesthetic).
- Reference 2: Same royal character seated on golden throne with Africa-shaped backdrop, showing the COMPOSITION style for medieval emperor portraits.

Use BOTH references as visual style guide for: illustration technique, color palette, costume era, character proportions, throne composition, decorative borders.

Now generate a DIFFERENT character: Mansa Musa I of Mali, the 14th century emperor who made the famous Hajj to Mecca with 80 camels of gold.

Key visual differentiators from the references:
- DIFFERENT face (Mansa Moussa is a distinct person)
- More elaborate ELABORATE GOLDEN CROWN with West African geometric ornaments (emperor crown, even more impressive than reference 2)
- Holding a golden gold nugget in one hand (visible, positioned at chest level)
- Expression: visionary and majestic, eyes looking slightly upward as if seeing destiny
- Royal robes: warm TERRACOTTA and GOLDEN tones with rich mudcloth/bogolan patterns (NOT blue robes from references)
- Seated on a golden throne similar to reference 2 composition

Composition: medium-wide shot, full upper body visible (head to mid-thighs), seated on throne, centered. Africa continent silhouette visible in background as in reference 2 but with subtle Mali highlight.

Background: solid deep indigo color #1F2A4A, completely flat solid indigo extending to all edges. The Africa silhouette is darker indigo subtle, not breaking the indigo background. No gradient, no texture, no decorative borders.

Color palette strict: terracotta #A85A3A and warm browns for skin and robes, golden amber #D4A574 for crown, throne, gold nugget, parchment cream #F2E5C8 for highlights, deep umber for shadows. All on solid indigo #1F2A4A background. No white, no decorative golden frame borders.

Format: 1024x1024 square, single character on throne, no text, no decorative borders."""


def main() -> int:
    print(f"Reference 1: {REF1_PATH}")
    print(f"Reference 2: {REF2_PATH}")
    print(f"Output: {OUT_FILE}")
    print(f"Cost preview: ~$0.07")
    print()

    if not REF1_PATH.exists() or not REF2_PATH.exists():
        print(f"ERROR: ref not found")
        return 1

    ref1 = REF1_PATH.read_bytes()
    ref2 = REF2_PATH.read_bytes()
    print(f"Ref1 size: {len(ref1)/1024:.1f} KB | Ref2 size: {len(ref2)/1024:.1f} KB")

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=ref1, mime_type="image/png"),
            types.Part.from_bytes(data=ref2, mime_type="image/png"),
            PROMPT,
        ],
        config=types.GenerateContentConfig(response_modalities=["image", "text"]),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            OUT_FILE.write_bytes(part.inline_data.data)
            print(f"OK saved: {OUT_FILE} ({len(part.inline_data.data)/1024:.1f} KB)")
            return 0
        elif part.text:
            print(f"Text: {part.text}")
    print("ERROR: No image")
    return 1


if __name__ == "__main__":
    sys.exit(main())
