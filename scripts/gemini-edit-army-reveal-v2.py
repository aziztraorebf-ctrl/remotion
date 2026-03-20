import os
from pathlib import Path
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

input_path = Path("tmp/brainstorm/hannibal-solo-alpes-start.png")
output_path = Path("tmp/brainstorm/hannibal-army-reveal-D.png")

image_bytes = input_path.read_bytes()

prompt = """Edit this flat vector illustration with ONE surgical change only:

Add an army of soldiers behind Hannibal. The soldiers must be facing the same direction as Hannibal — from behind, looking toward the Alps, same orientation as him (we see their backs, not their sides or faces).

The soldiers fill both sides of the central green path in two dense columns.
They are all facing forward (same direction as Hannibal), seen from behind.
Navy blue flat style, purple round shields visible on their backs or arms, spears pointing upward.
The columns extend from just behind Hannibal to the bottom edge of the frame.

CRITICAL — Do NOT change:
- Hannibal's position, size, or appearance
- The Alps mountains
- The mint green sky
- The camera angle (same ground-level rear view)
- The snow dots
- The green central path

CRITICAL — soldiers must face the SAME direction as Hannibal (toward the mountains), NOT sideways, NOT toward the camera."""

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
