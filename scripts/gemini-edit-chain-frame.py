import os
import base64
import json
import re
from pathlib import Path
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

input_path = Path("tmp/brainstorm/hannibal-chain-frame-01-raw.png")
output_path = Path("tmp/brainstorm/hannibal-chain-frame-01-marching.png")

image_bytes = input_path.read_bytes()
image_b64 = base64.b64encode(image_bytes).decode()

prompt = """Edit this flat vector illustration with a single surgical change only:

The soldiers on both sides of the central figure (the general with the purple cape) are currently standing still with both feet flat on the ground.

Change ONLY the soldiers' legs to show a mid-stride marching posture: one leg forward, one leg back, as if they are all marching in unison. Keep the posture subtle and stylized to match the flat geometric art style.

Do NOT change:
- The central figure (Hannibal) in any way
- The colors, palette, or style
- The mountains or background
- The snow dots
- The shields or spears
- Any other element

Return only the edited image."""

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        prompt
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
        temperature=0.1,
    )
)

saved = False
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("image"):
        output_path.write_bytes(part.inline_data.data)
        print(f"Saved: {output_path}")
        saved = True
        break

if not saved:
    print("No image in response")
    for part in response.candidates[0].content.parts:
        if hasattr(part, "text") and part.text:
            print("Text response:", part.text[:300])
