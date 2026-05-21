"""
Regen State E only — fix wrong flags (African flags appeared instead of Western flags).
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
client = genai.Client(api_key=API_KEY)
MODEL = "gemini-3.1-flash-image-preview"

OUTPUT_DIR = Path(__file__).parent.parent.parent / "public/souverain/or-africain/assets/storyboard"

PROMPT_E = """
Create a vertical 9:16 dark data-journalism storyboard image.

BACKGROUND/MAP:
A 3D dark globe viewed from space (like Mapbox dark globe), showing West Africa.
Ghana is visible as a golden-yellow highlighted territory (#f5d547) on the coast.
Space background #050510, land masses dark brown #1a1410, oceans deep blue #03224c.
Globe curvature visible at edges. Very subtle red vignette around image edges (dark red #d32f2f at 15-20% opacity, very soft).
Red border: a 2px red line #d32f2f around the entire image perimeter.

TOP FLAGS BANNER — THIS IS THE CRITICAL ELEMENT:
At the very top of the image, a horizontal row of exactly 5 national flags.
These are WESTERN country flags from rich developed nations — NOT African flags.
Flag 1: UNITED STATES OF AMERICA flag (red and white stripes, blue canton with white stars)
Flag 2: UNITED KINGDOM flag (Union Jack — red cross on blue, diagonal red/white stripes)
Flag 3: CHINA flag (solid red with large yellow star + 4 small yellow stars)
Flag 4: CANADA flag (red stripes on sides, white center with red maple leaf)
Flag 5: AUSTRALIA flag (blue background, Union Jack top left, Commonwealth Star, Southern Cross)

Flags arranged left to right: USA, UK, China, Canada, Australia.
Each flag: approximately 90x60px, rounded corners.
White label under each flag: "USA", "UK", "Chine", "Canada", "Australie" — 24px white text.
Dark rounded rectangle background (#1a1a1a at 85% opacity) behind the entire flags row.
This banner is positioned at the very top, y approximately 60-280px.

SUBTITLE BAR at bottom (y approximately 1700px):
Text in RED color #ff4444: "Le message : n allez pas plus loin..."
Small white/dark gradient behind for legibility.

OVERALL MOOD: confrontation, threat, ominous. The Western flags loom over the golden Ghana below.
"""

output_path = OUTPUT_DIR / "storyboard-b3-e-tension.png"
print(f"Regenerating State E with corrected Western flags...")
print(f"Output: {output_path}")

response = client.models.generate_content(
    model=MODEL,
    contents=PROMPT_E,
    config=types.GenerateContentConfig(
        response_modalities=["image", "text"],
        temperature=0.7,
    ),
)

image_data = None
for part in response.candidates[0].content.parts:
    if hasattr(part, "inline_data") and part.inline_data is not None:
        image_data = part.inline_data.data
        break

if image_data is None:
    print("ERROR: No image data")
    for part in response.candidates[0].content.parts:
        if hasattr(part, "text") and part.text:
            print(f"Model text: {part.text[:300]}")
    sys.exit(1)

with open(output_path, "wb") as f:
    f.write(image_data)

size_kb = output_path.stat().st_size // 1024
print(f"OK: {size_kb}KB saved.")
