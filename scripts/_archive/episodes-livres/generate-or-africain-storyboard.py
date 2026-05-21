"""
Generate 8 storyboard frames for "Or Africain" (serie Souverain).
Format: 1080x1920px (9:16), dark data-journalism style.
Model: gemini-3.1-flash-image-preview (NON-NEGOTIABLE per memory/tools/gemini.md)
"""

import os
import sys
import time
from pathlib import Path
from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    env_path = Path(__file__).parent.parent.parent / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                API_KEY = line.split("=", 1)[1].strip()

if not API_KEY:
    print("ERROR: GEMINI_API_KEY not found")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
MODEL = "gemini-3.1-flash-image-preview"

OUT_DIR = Path(__file__).parent.parent.parent / "public/souverain/or-africain/assets/storyboard"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# -----------------------------------------------------------------------
# GLOBAL STYLE PREAMBLE — included in every prompt
# -----------------------------------------------------------------------
GLOBAL_STYLE = """
TECHNICAL SPECS: 1080x1920 pixels, 9:16 vertical aspect ratio, mobile-optimized.

VISUAL STYLE: Dark premium data-journalism — inspired by Bloomberg/NYT data visualization adapted for vertical mobile.
- Background base: #0a0a0a (deep black, NOT pure black)
- Primary typography: bold condensed sans-serif (Inter Bold / Roboto Condensed / Bebas Neue style — terminal/data aesthetic)
- Strict color palette: gold #f5d547 / orange #e89b3c / red accent #d32f2f / gray #4a4a4a / white #ffffff
- NO garish gradients, NO neon colors, NO heavy drop shadows, NO decorative flourishes
- Style: minimal, surgical, information-dense — every element must earn its place
- Safe zones: 60px top/bottom margins, 80px left/right margins
- This is a LAYOUT/TYPOGRAPHY STORYBOARD — the goal is to show precise positioning, color, and typographic hierarchy. Precision over aesthetic perfection.
"""

# -----------------------------------------------------------------------
# 8 FRAME PROMPTS
# -----------------------------------------------------------------------
frames = [
    {
        "filename": "storyboard-f1-ouverture.png",
        "prompt": f"""
{GLOBAL_STYLE}

FRAME 1 — "Ouverture" (t=0s)

Create a vertical 9:16 mobile screen layout with:
- Background: solid #0a0a0a, completely empty
- Dead center of the screen (both horizontally and vertically): the text "$1,000" in monospace white font, approximately 180px size, bold, horizontally centered
- Immediately below the counter, a very small gray label in uppercase: "PRIX DE L'OR / ONCE" — font size ~28px, color #888888, letter-spacing wide
- Massive intentional empty space above and below — the emptiness IS the design
- Nothing else. No decorations, no lines, no borders, no gradients, no logos.

The minimalism is deliberate and meaningful. Two elements only: the number, and the label beneath it.
""",
    },
    {
        "filename": "storyboard-f2-record.png",
        "prompt": f"""
{GLOBAL_STYLE}

FRAME 2 — "Record" (t=5s)

Create a vertical 9:16 mobile screen layout with:
- Background: solid #0a0a0a
- Dead center: the text "$5,589" in bold condensed font, color #e89b3c (orange), approximately 180px, with a subtle soft glow/aura effect around the number (glow color: #e89b3c at 30% opacity spreading ~20px)
- Below the counter: a red badge pill/rectangle, background #d32f2f, containing text "RECORD HISTORIQUE" in white uppercase, font ~42px, centered
- Near the bottom of the screen (Y approximately 1700px from top): subtitle text in white ~36px: "Le prix de l'or vient de battre tous les records." — horizontally centered, simulating karaoke subtitle position
- Intentional empty space above the counter
""",
    },
    {
        "filename": "storyboard-f3-graphique.png",
        "prompt": f"""
{GLOBAL_STYLE}

FRAME 3 — "Graphique" (t=12s)

Create a vertical 9:16 mobile screen showing a data chart:
- Background: solid #0a0a0a
- Chart area occupies roughly the middle 70% of the screen vertically (from Y=400 to Y=1400)
- X-axis: horizontal line at the bottom of the chart area, labeled with years "2010" on the left and "2026" on the right, small gray text ~24px
- TWO curves plotted on the same axes:
  CURVE 1 (gold price): thick orange line #e89b3c, 3px stroke, starts at lower-left and rises steeply toward upper-right — strong upward trajectory
  CURVE 2 (royalties): thin gray line #4a4a4a, 2px stroke, perfectly flat horizontal across the entire width at a low Y position — showing 5% flat rate that never changed
- Between the two curves: a very dark semi-transparent fill (rgba 30,30,30,0.6) representing wealth captured by multinationals
- Label on the flat gray curve, positioned at the LEFT side: "5% — FIXE" in gray #4a4a4a, ~26px
- Label at the RIGHT end of the rising orange curve: "+458%" in orange #e89b3c, ~36px bold
- Near bottom Y≈1700px: small white subtitle text simulating karaoke position
""",
    },
    {
        "filename": "storyboard-f4-rien.png",
        "prompt": f"""
{GLOBAL_STYLE}

FRAME 4 — "RIEN." (t=27s)

Create a vertical 9:16 mobile screen with MAXIMUM visual impact and TOTAL minimalism:
- Background: solid #0a0a0a — completely empty
- Perfectly centered horizontally AND vertically on the screen: the single word "RIEN." in white #ffffff
- Font: approximately 240px, ultra-bold condensed (maximum weight), all caps if the font supports it, with the period included: "RIEN."
- No subtitles. No other elements. No decorations. No lines. Nothing.
- The word alone on the dark screen. The visual silence is the message.
- The "." period after RIEN must be clearly visible.
""",
    },
    {
        "filename": "storyboard-f5-carte-ghana.png",
        "prompt": f"""
{GLOBAL_STYLE}

FRAME 5 — "Carte Ghana" (t=38s)

Create a vertical 9:16 mobile screen showing a dark map:
- Background: #0a0a0a
- Map style: dark mode inspired by Mapbox dark (land areas #1a1a2e, ocean #0d1117, country borders thin #333333 lines)
- The map shows the African continent, zoomed to show West Africa clearly. No text labels on the map.
- Ghana is highlighted: filled with semi-transparent gold #f5d547 at 50% opacity
- On Ghana's territory: a white semi-transparent rounded badge (white at 85% opacity) containing the text "5% → 12%" in bold dark navy font, approximately 52px — this badge sits centered on Ghana
- At the TOP of the screen (Y approximately 180-260px), a horizontal row of 5 country flag emoji or colored rectangular flags representing USA, UK, China, Canada, Australia — approximately 55px tall each, evenly spaced horizontally, representing multinational corporations
- Near bottom Y≈1700px: white subtitle text ~34px simulating karaoke
- The map should feel premium and editorial, not decorative
""",
    },
    {
        "filename": "storyboard-f6-menace.png",
        "prompt": f"""
{GLOBAL_STYLE}

FRAME 6 — "N'ALLEZ PAS PLUS LOIN." (t=54s)

Create a vertical 9:16 mobile screen:
- Background: FULL SCREEN solid red #d32f2f — this IS the background, covers 100% of the screen
- No map, no chart, no decorations
- Perfectly centered vertically and horizontally:
  LINE 1: the text  "N'ALLEZ PAS PLUS LOIN." in white #ffffff, ~78px, bold, uppercase, with quotation marks visible
  LINE 2: immediately below line 1 (about 60px gap): "CETTE LOI MENACE NOS INVESTISSEMENTS." in white at 75% opacity, ~44px, bold, with quotation marks visible
- Both lines horizontally centered on the red background
- No subtitles. Nothing else. The red fills every pixel.
""",
    },
    {
        "filename": "storyboard-f7-carte-4pays.png",
        "prompt": f"""
{GLOBAL_STYLE}

FRAME 7 — "Carte Afrique — 4 pays" (t=72s)

Create a vertical 9:16 mobile screen:
- Background: #0a0a0a
- A 2D flat vector-style map of the African continent fills roughly the top 65% of the screen. Very thin white outline of the continent at low opacity. No text labels.
- 4 countries colored distinctly:
  Ghana: filled gold #f5d547
  Mali: filled orange #e89b3c
  Burkina Faso: filled dark orange #c47a28
  Niger: filled light orange #d4872a
- A thin curved white SVG path line (50% opacity) connecting the capitals of these 4 countries — a flowing connection curve between them showing solidarity/coordination
- Floating on Mali's territory: a white bold text badge showing "$430M" in approximately 56px bold white, and beneath it in small gray text ~28px: "Bloomberg, nov. 2025"
- Bottom section of screen (below the map, around Y=1350-1600px):
  Left-aligned (with 80px left margin): "4 PAYS" in gold #f5d547, approximately 80px bold
  Below that: "UN MÊME SIGNAL" in white, approximately 36px
- Near bottom Y≈1700px: white subtitle karaoke simulation
""",
    },
    {
        "filename": "storyboard-f8-verdict.png",
        "prompt": f"""
{GLOBAL_STYLE}

FRAME 8 — "Verdict" (t=88s)

Create a vertical 9:16 mobile screen — pure typographic layout, NO charts, NO maps, NO graphics of any kind:
- Background: solid #0a0a0a
- Font for ALL text: elegant serif (Garamond / Georgia / Times New Roman style) — this is the ONLY frame using serif typography
- All text is white #ffffff, horizontally centered

THREE TEXT BLOCKS, vertically distributed with generous spacing:

BLOCK 1 (positioned at approximately Y=580px from top):
"Le Ghana a signé la loi."
Font size: ~52px, regular weight, centered

BLOCK 2 (positioned at approximately Y=900px from top):
"L'Afrique commence à changer"
then on the next line:
"les règles de son propre sous-sol."
Font size: ~52px, regular weight, centered — two lines with tight line-height

BLOCK 3 (positioned at approximately Y=1280px from top):
"Discrètement."
Font size: ~52px, italic style, centered

- Enormous empty dark space above block 1, between blocks, and below block 3
- The silence and spacing are intentional and meaningful
- NO subtitle karaoke on this frame
- Nothing else. Three text blocks. That is all.
""",
    },
]

# -----------------------------------------------------------------------
# GENERATION
# -----------------------------------------------------------------------
def generate_frame(frame_def: dict, index: int) -> bool:
    filename = frame_def["filename"]
    prompt = frame_def["prompt"]
    out_path = OUT_DIR / filename

    print(f"\n[{index+1}/8] Generating: {filename}")
    print(f"  Prompt length: {len(prompt)} chars")

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["image", "text"],
            ),
        )

        image_data = None
        for part in response.candidates[0].content.parts:
            if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                image_data = part.inline_data.data
                break

        if not image_data:
            print(f"  ERROR: No image returned for {filename}")
            if response.candidates:
                print(f"  Response text: {response.candidates[0].content.parts}")
            return False

        out_path.write_bytes(image_data)
        size_kb = out_path.stat().st_size // 1024
        print(f"  Saved: {out_path} ({size_kb} KB)")
        return True

    except Exception as e:
        print(f"  ERROR generating {filename}: {e}")
        return False


def main():
    print(f"Model: {MODEL}")
    print(f"Output: {OUT_DIR}")
    print(f"Frames to generate: {len(frames)}")

    success = 0
    failed = []

    for i, frame in enumerate(frames):
        ok = generate_frame(frame, i)
        if ok:
            success += 1
        else:
            failed.append(frame["filename"])

        # small delay between calls to avoid rate limits
        if i < len(frames) - 1:
            time.sleep(2)

    print(f"\n{'='*60}")
    print(f"Generated: {success}/{len(frames)}")
    if failed:
        print(f"Failed: {failed}")
    else:
        print("All frames generated successfully.")
    print(f"Output directory: {OUT_DIR}")


if __name__ == "__main__":
    main()
