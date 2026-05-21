"""
Generate rhone-frame0-composite.png
Beat 2 Hannibal - Traversee du Rhone
Frame 0 composite: background + characters integrated via Gemini
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
OUTPUT_PATH = ASSETS_BASE / "backgrounds" / "rhone-frame0-composite.png"


def load_image_part(path: Path) -> types.Part:
    data = path.read_bytes()
    b64 = base64.standard_b64encode(data).decode()
    return types.Part.from_bytes(data=base64.standard_b64decode(b64), mime_type="image/png")


bg_part = load_image_part(ASSETS_BASE / "backgrounds" / "rhone-traversee.png")
hannibal_part = load_image_part(ASSETS_BASE / "characters" / "hannibal-v4a" / "rotations" / "east.png")
volque_part = load_image_part(ASSETS_BASE / "characters" / "volque" / "rotations" / "west.png")
numide_part = load_image_part(ASSETS_BASE / "characters" / "numide" / "rotations" / "north.png")
elephant_part = load_image_part(ASSETS_BASE / "map-objects" / "elephant-radeau" / "elephant-radeau-v2-base.png")

PROMPT = """You are a pixel art compositor. Take this background scene (the first image: the Rhone river at autumn dusk) and integrate the provided characters directly into the scene as coherent pixel art elements.

STYLE MANDATE: strict 16-bit RPG pixel art style. Same color palette, same pixel density, same overall grain as the background. NO photorealism. NO smoothing. NO anti-aliasing. Pixel-perfect integration only.

WHAT YOU SEE IN THE BACKGROUND:
- Bottom third: muddy left bank (rive gauche), brown soil, reeds, autumn orange trees
- Middle: the wide Rhone river (dark blue-grey water with light ripples)
- Middle-left: a dramatic rocky cliff (rive droite) topped with golden grass and dark pine trees
- Upper third: purple-orange dusk sky

CHARACTER PLACEMENT INSTRUCTIONS:

1. HANNIBAL (the armored warrior in red/gold helmet, profile facing right):
   - Place him on the LEFT BANK (rive gauche), bottom-left area of the image
   - His feet must be firmly on the muddy ground, NOT floating
   - Scale him to fit the scene: he should appear as a character standing at the riverbank, approximately 80-100 pixels tall relative to the scene
   - He faces RIGHT toward the river, watching the crossing
   - Position: bottom-left quadrant, x=180-280px from left, standing on the bank

2. ELEPHANT ON RAFT (elephant with rider on wooden raft):
   - Place the raft on the RIVER, slightly left of center, appearing mid-crossing
   - The raft floats ON the water surface, not above it
   - Scale: the elephant+raft unit should be approximately 140-160px wide in the scene
   - Position: center-left of river, y approximately 55-65% from top

3. TWO VOLQUE WARRIORS (the warrior in blue cloak, facing left):
   - Place BOTH on TOP of the rocky cliff on the right side (rive droite plateau)
   - They stand on the golden grass plateau edge, looking down at the crossing
   - Hostile watching posture
   - Scale them smaller (60-70px tall) due to perspective/distance
   - Space them a few pixels apart, both facing left toward the river

CRITICAL RULES:
- ALL characters must have their feet/base touching the ground surface they stand on. No floating.
- Maintain exact pixel art style: blocky pixels, limited color palette matching the background, no gradients on characters
- Do NOT add text, labels, banners, numbers, or any writing anywhere
- Do NOT add any UI elements, health bars, or game interface elements
- The integration should look like these characters belong in this scene — same art style, same lighting (warm dusk light from the right/west)
- Keep the background composition exactly as it is — only ADD the characters, do not modify the landscape
- No particles, no dust, no magic effects

Output: a single 1080x1920 pixel art scene with all characters integrated."""

print("Calling Gemini gemini-3.1-flash-image-preview...")
print(f"Output: {OUTPUT_PATH}")

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        bg_part,
        hannibal_part,
        volque_part,
        numide_part,
        elephant_part,
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
        break
    elif hasattr(part, "text") and part.text:
        print(f"TEXT: {part.text[:200]}")

if not saved:
    print("ERROR: No image returned by Gemini")
    sys.exit(1)

print("Done.")
