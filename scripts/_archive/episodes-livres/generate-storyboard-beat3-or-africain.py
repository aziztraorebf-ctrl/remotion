"""
Generate Beat 3 storyboard states for "Or Africain" (Souverain series).
6 sequential states: A (spatial entry) -> F (quote cutaway)
Model: gemini-3.1-flash-image-preview
Output: public/souverain/or-africain/assets/storyboard/
"""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent.parent / ".env")

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not found in .env")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
MODEL = "gemini-3.1-flash-image-preview"

OUTPUT_DIR = Path(__file__).parent.parent.parent / "public/souverain/or-africain/assets/storyboard"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Style anchor shared across all states
STYLE_ANCHOR = """
VISUAL STYLE: dark premium data-journalism, 9:16 vertical format (1080x1920px).
Base background: #0a0a0a deep black.
Palette: gold #f5d547, orange #e89b3c, red #d32f2f, dark gray #4a4a4a, white #ffffff.
Overall aesthetic: cinematic, high-contrast, premium documentary.
NO WATERMARKS. NO BORDERS. NO FRAME NUMBERS. NO LABELS ON THE IMAGE ITSELF.
"""

GLOBE_STYLE = """
MAP STYLE — NON-NEGOTIABLE:
The map/globe MUST be rendered as a 3D dark globe viewed from space, like Mapbox 3D globe dark mode.
Spatial dark background: #050510 deep space black, with extremely subtle scattered stars (very small, very dim).
Globe is visibly curved — you can see the curvature of the Earth.
Land masses: dark brown-gray #1a1410.
Oceans: deep night blue #03224c.
Country borders: very thin, dark warm #3a2a1a.
West Africa (Gulf of Guinea region) is in the lower-left quadrant of the visible globe face.
Ghana is identifiable as a small rectangular country on the West African coast.
NO flat 2D map. NO SVG-style flat projection. Always 3D globe with visible curvature and space atmosphere.
"""

# Define the 6 states
STATES = [
    {
        "filename": "storyboard-b3-a-entree.png",
        "label": "State A — t=27s Entree spatiale",
        "prompt": f"""
{STYLE_ANCHOR}

{GLOBE_STYLE}

STATE A — DISTANT SPACE ENTRY (t=27s):
Camera is pulled very far back in space. The full Earth globe is visible, centered in frame.
The globe occupies about 60-65% of the vertical height of the image.
The globe is slightly tilted to show Africa facing the viewer.
Africa's west coast is visible on the globe face.
The globe glows very faintly with a soft blue atmosphere rim around its edge.
The space around the globe is very dark #050510 with a handful of tiny, very dim stars.

HUD ELEMENT — TOP RIGHT CORNER:
A small, sharp UI counter element. Text: "$5,000+" in orange #e89b3c color.
Font size approximately 52px equivalent. Semi-transparent dark rounded rectangle behind it.
Positioned at approximately x=900px, y=140px from top-left origin.

SUBTITLE BAR — BOTTOM OF IMAGE:
At approximately y=1700px from top: a single line of white text, ~38px.
Text reads: "En janvier deux mille vingt-six..."
Text is centered horizontally.
Subtle dark gradient behind the subtitle for legibility.

OVERALL: Cinematic establishing shot from deep space. Calm, cold, vast. No people, no icons beyond the counter.
No text visible on the globe itself. No country labels. No city labels.
""",
    },
    {
        "filename": "storyboard-b3-b-zoom.png",
        "label": "State B — t=31s Zoom vers Ghana",
        "prompt": f"""
{STYLE_ANCHOR}

{GLOBE_STYLE}

STATE B — ZOOM PROGRESSION TOWARD GHANA (t=31s):
The camera has moved closer. The globe now fills about 80% of the frame vertically.
We see roughly 3/4 of the globe face — the curvature is still clearly visible on the edges.
West Africa now occupies approximately 40% of the visible globe face.
Ghana is becoming identifiable — a small country on the coast of the Gulf of Guinea.

GHANA HIGHLIGHT:
Over the area of Ghana on the globe: a soft pulsing golden glow in color #f5d547.
The glow is gentle, not harsh — like a warmth radiating from that region.
Opacity about 50-60%. Blurred soft edges. Not a sharp polygon.

The space background is still visible at the edges (#050510, very few dim stars).
The globe atmosphere rim (thin blue-white edge) is still visible.

HUD ELEMENT — TOP RIGHT CORNER:
Counter "$5,000+" in orange #e89b3c, same style as State A. Same position.

SUBTITLE BAR — BOTTOM:
At y=1700px: white centered text ~38px.
Text: "L or depasse cinq mille dollars l once..."
Dark gradient behind for legibility.

OVERALL: The golden glow on Ghana creates a sense of something awakening in that region. The zoom is in progress.
No text on the globe itself. No country labels visible.
""",
    },
    {
        "filename": "storyboard-b3-c-ghana.png",
        "label": "State C — t=36s Ghana zoome arc royalties",
        "prompt": f"""
{STYLE_ANCHOR}

{GLOBE_STYLE}

STATE C — GHANA CLOSE-UP WITH ROYALTY ARC (t=36s):
Camera is now much closer. Ghana occupies approximately 60% of the image height.
The globe curvature is subtly visible at the very edges of the frame — we are semi-zoomed in.
Ghana territory is clearly defined with a golden overlay (#f5d547) at 60% opacity.
The territory fill is clean, not blurry — a precise semi-transparent golden shape over Ghana.
Surrounding countries (Ivory Coast, Togo, Burkina Faso) visible but darker, unremarkable.

ROYALTY ARC UI ELEMENT — CENTERED ON GHANA TERRITORY:
A clean data-journalism UI panel floating over Ghana:
- Rounded rectangle dark background (#0a0a0a at 85% opacity)
- Inside: bold white text "5%" on the left, white bold text "12%" on the right
- Between them: a curved upward arc arrow in gold #f5d547, showing progression from 5 to 12
- Arrow style: clean SVG-like arc with an arrowhead pointing to "12%"
- Below the percentages: small white label "royalties progressives" at about 28px
- Panel dimensions: approximately 600x160px centered on Ghana

The globe space atmosphere is still slightly visible at the very corners of the image.

HUD ELEMENT — TOP RIGHT:
Counter "$5,000+" in orange #e89b3c.

SUBTITLE BAR — BOTTOM:
White centered text: "Le Ghana propose des royalties progressives..."

OVERALL: This is the KEY PROPOSITION moment. Ghana glows gold. The arc UI is the hero element.
No country labels. No city labels on the map. The UI text (5%, 12%) is part of the deliberate design.
""",
    },
    {
        "filename": "storyboard-b3-d-drapeaux.png",
        "label": "State D — t=42s Drapeaux cascade",
        "prompt": f"""
{STYLE_ANCHOR}

{GLOBE_STYLE}

STATE D — FLAGS CASCADE (t=42s):
Same Ghana close-up view as State C. Ghana still has golden overlay #f5d547 at 60% opacity.
The globe is slightly dimmed compared to State C (about 70% brightness/opacity on the map).

TOP FLAGS BANNER:
At the very top of the image (y approximately 140px to 320px):
A horizontal row of 5 national flags, centered horizontally.
Each flag: approximately 90px wide, 60px tall. Rounded corners.
Flags in order left to right: USA flag, United Kingdom flag, China flag, Canada flag, Australia flag.
Each flag has a white label centered below it at approximately 26px: "USA", "UK", "Chine", "Canada", "Australie".
Behind the entire flags row: a dark rounded rectangle #1a1a1a at 85% opacity, slightly larger than the flags row.
This flags banner should be clean, readable, and slightly elevated above the map below it.

The royalty arc UI from State C is NOT present anymore — replaced entirely by the flags banner.

SUBTITLE BAR — BOTTOM:
White centered text: "Les Etats-Unis le Royaume-Uni la Chine..."

OVERALL: Tension is building. 5 powerful nations are being named. The flags feel like a confrontation forming above Ghana.
No country labels on the map itself.
""",
    },
    {
        "filename": "storyboard-b3-e-tension.png",
        "label": "State E — t=52s Montee tension",
        "prompt": f"""
{STYLE_ANCHOR}

{GLOBE_STYLE}

STATE E — RISING TENSION (t=52s):
Same composition as State D — Ghana zoomed, flags banner at top still visible.

TENSION VIGNETTE:
Around the very edges of the entire image: a very subtle dark-red vignette.
Color: deep red #d32f2f at approximately 20% opacity. Very soft blur, 80-100px feathering.
It is barely perceptible but creates subconscious unease. Like blood pressure rising.

BORDER ELEMENT:
Along all 4 edges of the image frame: an extremely thin red border, approximately 2px, color #d32f2f.
Subtle but present — signals danger is encroaching.

FLAGS BANNER: same as State D, still visible at top.

Ghana territory: still gold #f5d547 overlay but perhaps slightly more orange-tinted from the encroaching red atmosphere.

SUBTITLE BAR — BOTTOM:
This time the subtitle text is in red #ff4444 instead of white.
Text: "Le message : n allez pas plus loin..."
Dark gradient behind for legibility.

OVERALL: The atmosphere is shifting from confrontation to threat. Red is bleeding into the frame. The mood is ominous.
No country labels on the map.
""",
    },
    {
        "filename": "storyboard-b3-f-coupure.png",
        "label": "State F — t=54s COUP DE THEATRE",
        "prompt": f"""
STATE F — BRUTAL CUT QUOTE CARD (t=54s):

FULL IMAGE DESIGN — NO MAP, NO GLOBE:
The entire 1080x1920 image is a solid flat deep red: #d32f2f.
No texture, no gradient, no shadow. Pure flat red.
This is a complete break from all previous states — maximum visual shock.

CENTERED TYPOGRAPHIC BLOCK:
Vertically and horizontally centered on the red background:

Line 0 (opening quote mark):
Large quotation mark character in light gray #cccccc, approximately 100px tall.
Positioned just above the text block.

Line 1: "N'ALLEZ PAS PLUS LOIN."
Color: white #ffffff. Font style: bold, condensed, uppercase. Approximately 76px equivalent.

Line 2: "CETTE LOI MENACE"
Color: white #ffffff. Same bold condensed uppercase style. Same size.

Line 3: "NOS INVESTISSEMENTS."
Color: white #ffffff. Same bold condensed uppercase style. Same size.

Line 4 (closing quote mark):
Large quotation mark in light gray #cccccc, approximately 100px tall.
Positioned just below the text block.

Spacing between lines: approximately 20-24px.
The entire text block is vertically centered in the image.

NO map. NO globe. NO flags. NO UI elements. NO subtitle bar.
NO stars. NO dark background. Only the red background and the white/gray text.

IMPACT: Maximum. Cold. Threatening. Institutional voice delivering a clear ultimatum.

The text characters N'ALLEZ PAS PLUS LOIN and CETTE LOI MENACE and NOS INVESTISSEMENTS
should be fully readable — these are intentional quote text elements in the design.
""",
    },
]


def generate_state(state: dict, index: int) -> bool:
    print(f"\n[{index+1}/6] Generating: {state['label']}")
    print(f"  Output: {state['filename']}")

    output_path = OUTPUT_DIR / state["filename"]

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=state["prompt"],
            config=types.GenerateContentConfig(
                response_modalities=["image", "text"],
                temperature=0.8,
            ),
        )

        image_data = None
        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data is not None:
                image_data = part.inline_data.data
                break

        if image_data is None:
            print(f"  ERROR: No image data in response")
            for part in response.candidates[0].content.parts:
                if hasattr(part, "text") and part.text:
                    print(f"  Model text: {part.text[:200]}")
            return False

        with open(output_path, "wb") as f:
            f.write(image_data)

        size_kb = output_path.stat().st_size // 1024
        print(f"  OK: {size_kb}KB saved to {output_path.name}")
        return True

    except Exception as e:
        print(f"  ERROR: {e}")
        return False


def main():
    print("=" * 60)
    print("STORYBOARD BEAT 3 — OR AFRICAIN (Souverain)")
    print("Model: gemini-3.1-flash-image-preview")
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 60)

    success_count = 0
    for i, state in enumerate(STATES):
        ok = generate_state(state, i)
        if ok:
            success_count += 1
        # Small pause between requests
        if i < len(STATES) - 1:
            time.sleep(2)

    print(f"\n{'=' * 60}")
    print(f"COMPLETE: {success_count}/{len(STATES)} images generated successfully")
    if success_count == len(STATES):
        print("All states delivered. Ready for visual review.")
    else:
        print("Some states failed — check errors above.")


if __name__ == "__main__":
    main()
