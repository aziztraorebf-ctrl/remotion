"""Generate Mansa Moussa portrait A v2 — gros-plan medaillon CTA scene 5.
Reference: Abou Bakari char-ref royal v1 (3-view canonical).
Style: cohesive with GeoAfrique character canon (Sonjata, Abou Bakari).
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

REF_PATH = ROOT / "public/assets/abou-bakari/refs/abou-bakari-royal-charref-v1.png"
OUT_DIR = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / "assets"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "mansa-portrait-A-v2-canonique.png"

PROMPT = """The reference image shows the EXACT visual style we want: West African royal character in flat 2D illustration style, mudcloth-pattern royal robes in deep indigo blue, golden ornamental belt, golden cap/crown, dark skin rendered with smooth flat shading, calm dignified expression, traditional Mande aesthetic. Use this reference as a STYLE GUIDE for color palette, illustration technique, costume era, character proportions.

Now generate a DIFFERENT character: Mansa Musa I of Mali, the 14th century emperor who made the famous Hajj to Mecca with 80 camels of gold.

Key visual differentiators from the reference:
- DIFFERENT face (Mansa Moussa is a distinct person, NOT the reference character)
- More elaborate ELABORATE GOLDEN CROWN with West African geometric ornaments (he was emperor, not just a king)
- Holding a single golden gold nugget in his right hand (visible)
- Expression: contemplative and visionary, calm authority
- Royal robes: warm terracotta and golden tones (instead of deep blue) with mudcloth/bogolan patterns
- Same flat 2D illustration style as reference

Composition: front-facing close-up portrait (head and shoulders only, NOT full body), centered for circular medallion crop, head and crown taking ~70% of canvas height, the golden nugget in hand visible at the bottom of the frame.

Background: solid deep indigo color #1F2A4A, completely flat solid indigo extending to all edges, no gradient, no texture, no sky.

Color palette strict: terracotta #A85A3A and warm browns for skin and robes, golden amber #D4A574 for crown and gold nugget, parchment cream #F2E5C8 for highlights, deep umber for shadows, all on solid indigo #1F2A4A background. No white, no light blue, no gradients.

Format: 1024x1024 square, single character only, no text, no decorative borders, no extra elements."""


def main() -> int:
    print(f"Reference: {REF_PATH}")
    print(f"Output: {OUT_FILE}")
    print(f"Cost preview: ~$0.07")
    print()

    if not REF_PATH.exists():
        print(f"ERROR: ref not found")
        return 1

    ref_bytes = REF_PATH.read_bytes()
    print(f"Ref size: {len(ref_bytes)/1024:.1f} KB")

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
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
