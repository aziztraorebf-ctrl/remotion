import os
from pathlib import Path
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

input_path = Path("tmp/brainstorm/hannibal-chain-frame-01-marching.png")
output_path = Path("tmp/brainstorm/hannibal-solo-alpes-start.png")

image_bytes = input_path.read_bytes()

prompt = """Edit this flat vector illustration with one surgical change only:

Remove ALL the soldiers on both sides of the central figure. Replace them with empty snowy ground, matching the existing white/mint snow texture already present in the image.

The result should show:
- Hannibal alone, centered, de dos (from behind), with his purple cape
- Empty snowy landscape stretching on both sides — no soldiers, no spears, no shields
- The Alps mountains in the background, unchanged
- Snow falling, unchanged
- The green central path on the ground, unchanged
- Same flat geometric art style, same color palette

Do NOT change:
- Hannibal himself in any way
- The mountains
- The sky color (mint green)
- The snow dots
- The overall composition and framing"""

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
            print("Text:", part.text[:300])
