"""
Generate rhone-beat2-composite-v1.png
Beat 2 Hannibal - Traversee du Rhone
Composite frame: characters integrated into river scene.

V2 FIX: Massive anti-snow/anti-Alps counter-prompt.
Previous attempt (rhone-frame0-composite.png) turned the Rhone river into ice/snow
because Gemini's cultural association Hannibal+elephant = Alps overpowered the
autumn river background. This version explicitly breaks that association.
"""

import os
import sys
import base64
from pathlib import Path
from google import genai
from google.genai import types

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    env_path = Path(__file__).parent.parent.parent / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                GEMINI_API_KEY = line.split("=", 1)[1].strip()
                break

if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not found")
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

ASSETS_BASE = Path("/Users/clawdbot/Workspace/remotion/public/hannibal/assets")
OUTPUT_PATH = ASSETS_BASE / "backgrounds" / "rhone-beat2-composite-v1.png"

def load_image_part(path: Path) -> types.Part:
    data = path.read_bytes()
    return types.Part.from_bytes(data=data, mime_type="image/png")


bg_part = load_image_part(ASSETS_BASE / "backgrounds" / "rhone-traversee.png")
elephant_part = load_image_part(ASSETS_BASE / "map-objects" / "elephant-radeau" / "elephant-radeau-v3-base.png")
hannibal_part = load_image_part(ASSETS_BASE / "characters" / "hannibal-v4a" / "rotations" / "east.png")
soldat_part = load_image_part(ASSETS_BASE / "characters" / "soldat-carthaginois" / "east.png")

PROMPT = """You are a pixel art compositor. Your task: integrate the provided characters into the BACKGROUND RIVER SCENE, maintaining strict 16-bit RPG pixel art consistency.

=== CRITICAL: ANTI-SNOW/ANTI-ALPS MANDATE ===
This scene takes place at the RHONE RIVER in late autumn 218 BC. NOT in the Alps. NOT on a glacier. NOT on ice.
- The river is LIQUID WATER. Dark blue-grey flowing water with white ripple lines. NOT ice. NOT frozen. NOT white.
- There is NO snow anywhere. NO ice blocks. NO frost. NO glaciers. NO snowy mountains.
- The season is late autumn: brown mud banks, orange-red autumn leaves on trees, grey stone, golden grass. No white ground cover.
- The background image (first image) shows the CORRECT scene: an autumn river with rocky cliffs, autumn-colored trees, and a muddy bank. PRESERVE this background EXACTLY as it is.
- This is a RIVER CROSSING, not an Alpine mountain crossing. The famous Hannibal Alps crossing happened MONTHS LATER than this scene.

=== STYLE ===
Strict 16-bit SNES RPG pixel art. Hard pixel edges. Flat shading. Square visible pixels. Same pixel density as the background.
Palette: warm autumn ochre (#C87830), grey stone (#8A8A7A), dark blue-grey water (#4A6080), autumn red-orange (#C84020), dusk orange sky.
NO photorealism. NO smooth gradients on characters. NO anti-aliasing.

=== BACKGROUND (first image) ===
Keep the background EXACTLY as provided:
- Lower 20%: muddy left bank (rive gauche), brown clay soil, reeds, autumn orange-red small trees
- Middle 50%: wide Rhone river, dark blue-grey water, white ripple lines indicating current
- Right side middle: dramatic grey rocky cliff (rive droite) topped with golden grass and dark pine trees
- Upper 30%: purple-orange dusk sky

=== CHARACTER PLACEMENT ===

1. ELEPHANT ON RAFT (second image - elephant with mahout rider on wooden raft):
   - Place on the RIVER, center-left, mid-crossing. The raft floats ON the flowing dark water.
   - The raft base touches the water surface (not above it, not below it).
   - Scale: elephant+raft approximately 180-200px wide in the 1080px-wide scene.
   - Position: horizontally at 25-45% from left, vertically at 55-68% from top (on the river).
   - The elephant faces RIGHT (toward the far bank = rive droite cliff).
   - Add a second smaller elephant+raft in the BACKGROUND (further right, smaller = perspective), at 60-70% from left, 50-60% from top. Scale it to 60% of the main raft.

2. HANNIBAL (third image - armored warrior in red/bronze helmet, cape, profile facing right):
   - Place him STANDING ON THE RAFT, at the front-left corner of the main raft.
   - He stands upright on the wooden planks, facing RIGHT toward the far bank.
   - Scale him to fit the raft scale: approximately 50-60px tall.
   - He is ON the raft, not on the bank.

3. SOLDIERS (fourth image - dark-armored carthaginian soldier, profile east):
   - Place 3-4 of these soldiers on the LEFT BANK (rive gauche), bottom-left area.
   - They stand on the muddy brown clay bank, feet firmly on the ground.
   - They face RIGHT, watching the crossing, lances/spears pointing upward.
   - Scale: approximately 55-70px tall each.
   - Space them naturally along the bank, some slightly overlapping.

=== OUTPUT CONSTRAINTS ===
- Output: single image, 9:16 vertical format, same dimensions as the background.
- NO text, no labels, no banners, no writing, no numbers anywhere in the image.
- NO particles, no dust, no sparkles, no magic effects.
- NO UI elements (health bars, menus, etc).
- Feet/bases of all characters must touch their ground surface. NO floating characters.
- The flowing RIVER must remain dark blue-grey liquid water with white ripple lines.
- If uncertain between snow and autumn ground: choose BROWN MUD. Always.
"""

print("Calling Gemini gemini-3.1-flash-image-preview with anti-Alps counter-prompt...")
print(f"Assets: background + elephant-v3 + hannibal + soldat-carthaginois")
print(f"Output: {OUTPUT_PATH}")
print("Estimated cost: ~$0.04-0.08")

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        bg_part,
        elephant_part,
        hannibal_part,
        soldat_part,
        PROMPT,
    ],
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
    ),
)

saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image/"):
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_PATH.write_bytes(part.inline_data.data)
        print(f"SAVED: {OUTPUT_PATH}")
        saved = True
    elif hasattr(part, "text") and part.text:
        print(f"TEXT from Gemini: {part.text[:300]}")

if not saved:
    print("ERROR: No image returned by Gemini")
    sys.exit(1)

print("Done.")
