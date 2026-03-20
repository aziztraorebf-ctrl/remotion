"""
Beat03 Fleet — Generation Start Frame + End Frame
Start : flotte immense de pirogues, plan large, depart vers l'ouest
End   : pirogue solitaire, ocean hostile, immensité écrasante, nuit profonde
"""

import os, pathlib
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(pathlib.Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

ref_path = pathlib.Path("tmp/beat03-fleet-ref.png")
ref_bytes = ref_path.read_bytes()

# ── START FRAME ──────────────────────────────────────────────────────────────
print("Generating START FRAME...")

start_prompt = """Using the attached reference image as strict style guide, create a vertical 9:16 illustration.

SCENE: A massive fleet of Malian war pirogues sailing west on a dark night ocean. Hundreds of boats visible, stretching toward the horizon. Slight overhead angle showing the scale of the fleet.

STYLE: Flat 2D vector illustration. Same boat style as reference — white sails, terracotta/amber hulls. Dark deep navy ocean. Small white dots for stars. No gradients, no photorealism, no 3D.

COLOR PALETTE: Background #050208 (near black), ocean #0a1628 (deep navy), sails white/cream, hulls terracotta #A52A2A, water ripples in subtle teal.

COMPOSITION: Vertical portrait format. The fleet fills the lower 2/3 of the frame. Dark sky with sparse stars in the upper 1/3. Boats sailing from right toward left (westward). NO text, NO labels, NO watermarks.

MOOD: Epic, powerful, the scale of human ambition."""

start_response = client.models.generate_content(
    model="models/gemini-3.1-flash-image-preview",
    contents=[
        start_prompt,
        types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"]
    ),
)

for part in start_response.candidates[0].content.parts:
    if part.inline_data:
        out = pathlib.Path("tmp/beat03-startframe-v1.png")
        out.write_bytes(part.inline_data.data)
        print(f"START FRAME saved: {out}")
        break

# ── END FRAME ─────────────────────────────────────────────────────────────────
print("Generating END FRAME...")

end_prompt = """Using the attached reference image as strict style guide, create a vertical 9:16 illustration.

SCENE: A single lone Malian pirogue on a vast, dark, hostile ocean at night. The boat is small and isolated, dwarfed by the immensity of the water around it. The ocean has large dark navy wave shapes — geometric flat-design swells that feel dangerous and overwhelming. No other boats. Pure solitude.

STYLE: Flat 2D vector illustration. Same boat style as reference — white sail, terracotta/amber hull. NO gold elements, NO decorative ornaments. Simple, stark, dramatic.

COLOR PALETTE: Background #050208 (near black), ocean #0a1628 (deep navy) with darker swells #060c1a, sail white/cream, hull terracotta #A52A2A, barely visible stars. Cold hostile atmosphere.

COMPOSITION: Vertical portrait format. Single pirogue in the lower third, slightly off-center. Large threatening wave forms fill the frame. Minimal sky at top. The emptiness is the danger. NO text, NO labels, NO watermarks.

MOOD: Isolation, the ocean as an adversary. The boat is tiny against infinite dark water."""

end_response = client.models.generate_content(
    model="models/gemini-3.1-flash-image-preview",
    contents=[
        end_prompt,
        types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"]
    ),
)

for part in end_response.candidates[0].content.parts:
    if part.inline_data:
        out = pathlib.Path("tmp/beat03-endframe-v1.png")
        out.write_bytes(part.inline_data.data)
        print(f"END FRAME saved: {out}")
        break

print("Done.")
