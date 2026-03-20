import os
from pathlib import Path
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

input_path = Path("tmp/brainstorm/hannibal-chain-frame-01-marching.png")
output_path = Path("tmp/brainstorm/hannibal-chain-frame-02-craneup-end.png")

image_bytes = input_path.read_bytes()

prompt = """Transform this flat vector illustration into an aerial top-down view, as if a camera has craned up high above the scene.

The result should show:
- Hannibal as a small central figure seen from directly above, still recognizable by his purple cape
- His army extending behind him in long rows, seen from above, marching forward
- The Alps mountains visible in the far background, small and distant
- Snow falling
- Same flat geometric art style, same color palette (mint green sky, navy blue figures, purple cape)
- The perspective shift should feel like a dramatic crane-up camera move — we are now looking straight down from high altitude

Keep the exact same art style, colors, and flat geometric aesthetic. Only change the camera angle from ground level to high aerial top-down view."""

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
