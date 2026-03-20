import os
from pathlib import Path
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

input_path = Path("tmp/brainstorm/hannibal-chain-frame-02-craneup-end.png")
output_path_start = Path("tmp/brainstorm/hannibal-aerial-army-start.png")
output_path_end = Path("tmp/brainstorm/hannibal-aerial-army-end.png")

image_bytes = input_path.read_bytes()

prompt_start = """This is a flat vector illustration of an army marching through the Alps, seen from a slightly elevated angle.

Edit this image to make it a cleaner, more dramatic aerial start frame:
- The army should be visible in two clear parallel columns marching forward
- Remove Hannibal as the central dominant figure — he can be a tiny dot at the front of the columns or invisible
- The columns should be straight and parallel, not serpentine
- The Alps mountains visible at the top of the frame
- Snow falling
- Same flat geometric art style, navy blue soldiers, purple shields, mint green background
- The ground should be mostly white snow with the two purple columns of soldiers stretching from bottom to top of frame

Do NOT change the art style or color palette."""

prompt_end = """Transform this flat vector illustration into a high aerial top-down view, as if a drone has risen very high above the scene.

The result should show:
- Two long columns of soldiers seen almost directly from above, stretching into the distance
- The soldiers are tiny, like ants, but recognizable as the same navy/purple flat style
- The Alps mountains are small silhouettes in the far distance
- Vast white snowy landscape fills most of the frame
- The scale of the army relative to the mountains communicates immensity
- Same flat geometric art style, same color palette (mint green sky visible at top, white snow, navy/purple soldiers)
- Very high altitude perspective"""

for prompt, output_path in [(prompt_start, output_path_start), (prompt_end, output_path_end)]:
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
        print(f"No image for {output_path}")
        for part in response.candidates[0].content.parts:
            if hasattr(part, "text") and part.text:
                print("Text:", part.text[:200])
