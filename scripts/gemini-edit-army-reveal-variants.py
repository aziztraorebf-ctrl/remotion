import os
from pathlib import Path
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

input_path = Path("tmp/brainstorm/hannibal-solo-alpes-start.png")
image_bytes = input_path.read_bytes()

variants = [
    {
        "output": Path("tmp/brainstorm/hannibal-army-reveal-A.png"),
        "prompt": """Edit this flat vector illustration with ONE surgical change only:

Add a large army of soldiers behind Hannibal — same flat geometric art style, same navy blue and purple colors.
The soldiers should fill the space behind him, stretching to the left and right edges of the frame.
They are standing in rows, visible from behind, same height as Hannibal or slightly shorter (they are further away).
Spears pointing upward above their heads.

CRITICAL: Do NOT change anything else:
- Hannibal's position, size, or appearance — unchanged
- The Alps mountains — unchanged
- The mint green sky — unchanged
- The camera angle and distance — unchanged (same ground-level view from behind)
- The snow dots — unchanged
- The green central path — unchanged

The result should look like the same scene, but now Hannibal has his army behind him."""
    },
    {
        "output": Path("tmp/brainstorm/hannibal-army-reveal-B.png"),
        "prompt": """Edit this flat vector illustration with ONE surgical change only:

Add a massive army of soldiers filling the entire lower half of the image behind Hannibal.
The army should be very dense — hundreds of soldiers visible, rows extending to the far edges.
Same flat geometric art style, navy blue soldiers with purple shields, spears pointing up.
The army fills from the left edge to the right edge, creating a wall of soldiers behind the lone figure.

CRITICAL: Do NOT change anything else:
- Hannibal's position, size, or appearance — unchanged
- The Alps mountains — unchanged
- The mint green sky — unchanged
- The camera angle — unchanged (same ground-level rear view)
- The snow — unchanged
- The green path — unchanged"""
    },
    {
        "output": Path("tmp/brainstorm/hannibal-army-reveal-C.png"),
        "prompt": """Edit this flat vector illustration with ONE surgical change only:

Add two parallel columns of soldiers marching behind Hannibal, one column on each side of the central green path.
The columns extend from just behind Hannibal all the way to the bottom edge of the frame.
Each column has many rows of soldiers visible — navy blue flat style, purple round shields, spears.
The soldiers are marching in step (one leg slightly forward).

CRITICAL: Do NOT change anything else:
- Hannibal's position, size, or appearance — unchanged
- The Alps and sky — unchanged
- Camera angle — unchanged
- Snow and path — unchanged"""
    },
]

for v in variants:
    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
            v["prompt"]
        ],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
            temperature=0.1,
        )
    )

    saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image"):
            v["output"].write_bytes(part.inline_data.data)
            print(f"Saved: {v['output']}")
            saved = True
            break

    if not saved:
        print(f"No image for {v['output']}")
        for part in response.candidates[0].content.parts:
            if hasattr(part, "text") and part.text:
                print("Text:", part.text[:200])
