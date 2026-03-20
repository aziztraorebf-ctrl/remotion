"""
Beat03 — End Frame v2
Pirogue solitaire en danger : penchee, voile tendue, vague qui clappe
Simple et animable par Kling sans chaos
"""

import os, pathlib
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(pathlib.Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

ref_path = pathlib.Path("tmp/beat03-fleet-ref.png")
ref_bytes = ref_path.read_bytes()

prompt = """Using the attached reference image as strict style guide, create a vertical 9:16 illustration.

SCENE: A single Malian pirogue struggling against a large ocean wave at night. The boat is tilted at 15-20 degrees, leaning into the wave. The sail is stretched taut by strong wind, slightly bent at the top. A splash of white water hits the bow of the boat. The boat is centered in the lower half of the frame.

STYLE: Flat 2D vector illustration. Clean simple shapes. Same boat design as reference — white sail, terracotta/amber hull. NO complex details, NO decorative elements. The boat must read clearly as a single simple shape.

BACKGROUND: Dark ocean #050208. One large dark navy wave shape #0a1628 behind and above the boat — a single clean geometric swell form, not multiple chaotic waves. Minimal stars at top. No horizon line.

COLOR PALETTE: Background #050208, wave #0a1628, sail white/cream, hull terracotta #A52A2A, splash white. Maximum 5 colors total.

COMPOSITION: Vertical portrait 9:16. Pirogue in lower-center, tilted. Large single wave above it. Empty dark sky at top (30% of frame). NO text, NO labels, NO watermarks.

MOOD: Danger, struggle, but SIMPLE and CLEAN. One boat, one wave, one story."""

response = client.models.generate_content(
    model="models/gemini-3.1-flash-image-preview",
    contents=[
        prompt,
        types.Part.from_bytes(data=ref_bytes, mime_type="image/png"),
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"]
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        out = pathlib.Path("tmp/beat03-endframe-v2.png")
        out.write_bytes(part.inline_data.data)
        print(f"Saved: {out}")
        break
