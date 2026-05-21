"""
Generate Acte VI (Empire/Charte) assets via Gemini 3.1 Flash.
Produces 5 base assets + 2 candidate "single parchment background" options.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUTPUT_DIR = Path(__file__).parent.parent.parent / "tmp" / "soundjata-charte-assets"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Format 9:16 standard pour Shorts
FORMAT = "VERTICAL 9:16 (1080x1920 portrait orientation)"

ASSETS = {
    "01-parchment-scroll": f"""A medieval West African parchment scroll, unrolled and displayed.
Style: painted illustration, warm ochre and sepia tones, aged texture with subtle fiber grain.
The parchment takes up the full frame — no figures, no hands, no text visible.
Edges are slightly frayed and darkened. Rich cream and amber palette.
Subtle golden glow from warm light. The surface is empty — clean and ready for text overlays.
FORMAT: {FORMAT}.
Flat 2D illustration style, NOT photorealistic. Graphic novel aesthetic. No text, no writing, no symbols visible.""",

    "02-african-quill": f"""A traditional West African stylus made from a bird feather with a carved wooden handle, resting on aged parchment.
Close-up detail shot. The quill is on the right side of the frame, tip pointed left, ready to write.
A few drops of dark ink are visible on the parchment. Warm natural lighting from upper-left.
Style: painted 2D illustration, sepia and ochre tones, bold outlines, graphic novel aesthetic.
FORMAT: {FORMAT}.
No text, no writing, no letters visible. Empty parchment surface.""",

    "03-open-codex": f"""A medieval illuminated codex opened to a blank double-page spread.
The book is displayed centered on a dark wooden table, photographed from above at a slight angle.
The pages are clean cream parchment with subtle decorative borders in ochre and deep red —
geometric Mandinka-inspired patterns along the outer edges only, NO text in the center.
Warm candlelight from the side. The center of both pages is completely EMPTY and ready for text overlays.
Style: painted 2D illustration, warm golden tones, graphic novel aesthetic.
FORMAT: {FORMAT}.
CRITICAL: no written words, no letters, no numerals visible anywhere.""",

    "04-three-icons": f"""Three symbolic ancient pictograms arranged vertically on an aged parchment background.
Top icon: a human silhouette with a small circle (heart/life symbol).
Middle icon: a female figure with arms raised in protection, stylized African form.
Bottom icon: two open hands with broken chains falling away (freedom symbol).
Style: ancient West African petroglyph / rock art aesthetic, carved-in look, ochre and dark brown ink on aged cream parchment.
Each icon is distinctly separated with ample space between them.
FORMAT: {FORMAT}.
Flat 2D illustration, bold outlines, no shading gradient. No text, no letters, no numbers visible.""",

    "05-timeline-medallions": f"""Two circular ancient seals or medallions connected by a faded horizontal line across the frame.
LEFT medallion: gold and ochre colors, features a stylized African throne and baobab tree inside a decorative circle frame.
RIGHT medallion: cooler silver-grey and parchment colors, features a stylized classical scroll with a dove inside a decorative circle frame.
A thin sepia line connects them, with small tick marks suggesting passage of centuries.
Background: aged neutral cream parchment with subtle texture.
Style: painted 2D illustration, graphic novel aesthetic, bold outlines.
FORMAT: {FORMAT}.
No text, no dates, no numerals visible — just the visual contrast between the two medallions.""",

    "bg-option-A-rich-parchment": f"""A richly textured medieval West African parchment that fills the entire frame —
a deep warm base of aged cream and amber tones with subtle fiber grain and slight darkening at the edges (vignette effect).
The surface features very SUBTLE decorative Mandinka geometric borders along the outer edges only
(approximately 10% from each edge) in a faded ochre red color —
leaving the entire CENTER of the image (approximately 70% of the area) completely clean,
ready for text and icons to be overlaid in Remotion.
Style: painted 2D illustration, warm golden candlelight ambience, graphic novel aesthetic.
FORMAT: {FORMAT}.
CRITICAL: absolutely NO text, NO letters, NO numerals, NO figures — only the parchment texture and subtle border patterns.""",

    "bg-option-B-sober-parchment": f"""A minimal medieval parchment background filling the entire frame.
A clean aged cream and soft ochre surface with gentle fiber texture and slight darkening in the corners.
No decorative borders, no patterns, no ornaments — just a pure, noble parchment surface.
Soft warm lighting from above creates a gentle amber gradient from top to bottom.
The surface is completely empty and ready for text overlays to be added in Remotion.
Style: painted 2D illustration, serious historical tone, graphic novel aesthetic.
FORMAT: {FORMAT}.
CRITICAL: absolutely NO text, NO letters, NO numerals, NO figures, NO decorative elements — pure clean parchment only.""",
}


def generate(asset_id: str, prompt: str) -> Path | None:
    print(f"\n--- {asset_id} ---")
    print(f"  Prompt: {prompt[:80]}...")

    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    image_bytes = None
    text_response = ""
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
        elif hasattr(part, "text") and part.text:
            text_response = part.text

    if not image_bytes:
        print(f"  FAIL: no image generated")
        if text_response:
            print(f"  Model said: {text_response[:200]}")
        return None

    output_path = OUTPUT_DIR / f"{asset_id}.png"
    output_path.write_bytes(image_bytes)
    size_kb = len(image_bytes) // 1024
    print(f"  OK: {output_path.name} ({size_kb}KB)")
    return output_path


if __name__ == "__main__":
    print("=" * 60)
    print("Soundjata — Acte VI (Empire/Charte) — Gemini assets")
    print("=" * 60)

    to_generate = ASSETS
    if len(sys.argv) > 1:
        requested = set(sys.argv[1:])
        to_generate = {k: v for k, v in ASSETS.items() if k in requested}

    results = []
    for asset_id, prompt in to_generate.items():
        result = generate(asset_id, prompt)
        results.append((asset_id, result))

    print("\n" + "=" * 60)
    print("Results:")
    for asset_id, path in results:
        status = "OK" if path else "FAIL"
        print(f"  {status}: {asset_id}")
    print(f"\nOutput: {OUTPUT_DIR}")
    print("=" * 60)
