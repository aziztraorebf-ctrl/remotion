"""
Beat 4 "Bras de Fer" Storyboard v2
Niger Uranium Short — 22.9 secondes (frames 1175-1862, 30fps)

Narration:
  Orano saisit le tribunal arbitral de la Banque mondiale.
  1300 tonnes d'uranium concentre restent sur le site.
  250 millions d'euros immobilises.
  En juillet, Moscou exprime son interet pour reprendre l'exploitation.
  En septembre, le tribunal interdit au Niger de vendre le stock.

Palette Caspian Sepia: sable #d8c9a8, eau #a8c2d4, highlight or #c08820, navy #0d1525
Format: 1080x1920 (9:16 vertical), tone journalistique premium.
"""

import io
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

OUT_PATH = (
    Path(__file__).parent.parent.parent
    / "public"
    / "souverain"
    / "niger-uranium"
    / "assets"
    / "storyboard-v3"
    / "beat4_storyboard_gemini_v2.png"
)
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = """Create a storyboard for a 23-second vertical video segment (1080x1920, 9:16) about
a legal and geopolitical confrontation between Niger (West Africa) and Orano (French nuclear company).

The narration (French voiceover, journalistic tone):
"Orano saisit le tribunal arbitral de la Banque mondiale. Mille trois cents tonnes d'uranium
concentre restent sur le site. Deux cent cinquante millions d'euros immobilises. En juillet,
Moscou exprime son interet. En septembre, le tribunal interdit au Niger de vendre le stock."

Produce a 4-PANEL storyboard arranged in a 2x2 grid (2 columns, 2 rows). Each panel is a
rectangular cell with a thin dark border. Panels are numbered 1 to 4 reading left-to-right,
top-to-bottom.

PANEL 1 (0s-7s) — "Tribunal arbitral":
Visual: An abstract editorial illustration of a legal scale (balance de la justice) centered on
a sandy beige background. Below the scale, a bold text label reads "TRIBUNAL ARBITRAL — BANQUE
MONDIALE". A small location pin marks Niger on a minimal outline map fragment. The scale tips
slightly to one side. Colors: sandy beige #d8c9a8, dark navy #0d1525, gold accent #c08820.
Timestamp label in corner: "0s-7s".

PANEL 2 (7s-12s) — "Les stocks bloques":
Visual: A bird's-eye schematic of a mining site. Large rectangular storage zones filled with
dots representing uranium drums. Two bold stats float over the image: "1 300 T" (top) and
"250 M€" (bottom), in Bebas Neue style bold white text on dark navy pills. A padlock icon
overlays the central zone. Background: dusty sand tones. Timestamp label: "7s-12s".

PANEL 3 (12s-17s) — "Moscou s'interesse":
Visual: A minimal political map showing Africa and Russia connected by a curved dashed line
(like a flight route or interest arc). A small Russian flag icon near Moscow label. Niger is
highlighted in gold. The map is in Caspian Sepia style — sandy continent shapes on dusty blue
water. Label "MOSCOU" near top, "NIGER" near bottom-left. Timestamp label: "12s-17s".

PANEL 4 (17s-23s) — "Le tribunal tranche":
Visual: A dramatic full-width editorial graphic. A large red STOP hand icon or an oversized
bold word "INTERDIT" in dark red/crimson stamped diagonally over a document icon (representing
the Niger uranium stock certificate). The background is sandy beige #d8c9a8 with heavy
documentary texture. A thin gold border frames the panel. Timestamp label: "17s-23s".

STYLE RULES (NON-NEGOTIABLE):
- Flat editorial illustration style, NOT 3D, NOT photorealistic, NOT cartoon
- Tone: premium journalistic documentary (think Le Monde, Africa Eye, Caspian Report)
- Color palette strictly: sandy beige #d8c9a8, dusty blue #a8c2d4, dark navy #0d1525, gold #c08820
- Each panel has a small timestamp label in its bottom-right corner (white text on navy pill)
- NO subtitles, NO voiceover text, NO narration inside panels
- Geographic labels like "NIGER", "MOSCOU", "FRANCE" are allowed
- Clean panel borders, white gutter between panels
- Overall image dimensions: landscape rectangle fitting 4 panels in 2x2 grid (approximately 1600x900 overall)
- Do NOT add any text outside the panels (no title, no caption below the grid)
- No text, no letters, no numerals visible anywhere EXCEPT: timestamp labels, geographic labels, and the stats "1 300 T" and "250 M€" in Panel 2 and "INTERDIT" in Panel 4
"""

print(f"Sending storyboard generation request to {MODEL}...")
print(f"Output path: {OUT_PATH}")

response = client.models.generate_content(
    model=MODEL,
    contents=[PROMPT],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data is not None:
        image_data = part.inline_data.data
        img = Image.open(io.BytesIO(image_data))
        img.save(OUT_PATH)
        print(f"Storyboard saved: {OUT_PATH}")
        print(f"Image size: {img.size}, mode: {img.mode}")
        saved = True
        break
    elif hasattr(part, "text") and part.text:
        print(f"Text response: {part.text[:200]}")

if not saved:
    print("ERROR: No image returned by Gemini.")
    for i, part in enumerate(response.candidates[0].content.parts):
        print(f"Part {i}: type={type(part)}, has inline_data={part.inline_data is not None}")
