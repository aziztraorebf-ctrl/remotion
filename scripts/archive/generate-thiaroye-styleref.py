"""
Thiaroye Style Reference Generator
Uses Gemini 3.1 Flash to generate a style reference image for Seedance.
Input: frame-03.jpg (our validated flat illustration style) as style anchor
Output: 9:16 vertical image in the same style, depicting the Clip 1 scene
"""

import os
import base64
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "thiaroye-styleref"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Load style reference image
STYLE_REF_PATH = Path(__file__).parent.parent / "public" / "assets" / "library" / "geoafrique" / "thiaroye-1944" / "frames" / "frame-03.jpg"

with open(STYLE_REF_PATH, "rb") as f:
    style_ref_bytes = f.read()

PROMPT_CLIP1 = """
Look at this reference image carefully. This is the EXACT visual style I need you to replicate:
- 2D flat illustration with bold black outlines
- Limited color palette: warm ochre, khaki, sepia tones
- Stylized but anatomically correct human figures
- Clean flat color fills, no photorealistic textures
- Graphic novel / bande dessinee aesthetic
- Serious historical tone, not cartoon or cute

Now generate a NEW image in this EXACT SAME style with these specifications:

FORMAT: Vertical 9:16 (1080x1920 portrait orientation)

SCENE: Dakar 1944, a dusty military port at golden hour.
Three Senegalese tirailleurs in worn French army uniforms (khaki, belts, boots) stand in a line on a concrete pier. Duffel bags at their feet. Behind them: a military ship docked, harbour cranes, and distant French officers as small silhouettes.

The three soldiers are DIFFERENT from each other — different heights, different faces, different postures. The central soldier holds a folded white letter at chest height.

Their expressions are dignified, patient, stoic.

LIGHTING: Late afternoon golden hour. Warm light on the soldiers. The background (pier, ships, officers) is in cold grey-blue desaturated tones while the tirailleurs remain in warm ochre/khaki.

COMPOSITION: Medium shot, soldiers occupy the center-bottom two-thirds of the frame. Sky and harbour fill the top third. Camera at eye level.

CRITICAL: Match the reference image style EXACTLY. Flat illustration. Bold outlines. No 3D, no photorealism, no Pixar, no soft gradients. This is a serious historical graphic novel frame.
"""

PROMPT_CLIP2 = """
Look at this reference image carefully. This is the EXACT visual style I need you to replicate:
- 2D flat illustration with bold black outlines
- Limited color palette: warm ochre, khaki, sepia tones
- Stylized but anatomically correct human figures
- Clean flat color fills, no photorealistic textures
- Graphic novel / bande dessinee aesthetic
- Serious historical tone, not cartoon or cute

Now generate a NEW image in this EXACT SAME style with these specifications:

FORMAT: Vertical 9:16 (1080x1920 portrait orientation)

SCENE: Interior of a military barracks, Thiaroye camp, December 1944.
Three Senegalese tirailleurs in worn khaki uniforms sit around a heavy wooden table. Papers and an opened white envelope are spread on the table. The central soldier has his open palm pressed flat on the table, leaning forward with controlled anger. His two comrades sit beside him, fists clenched on the table surface.

Across the table, a French colonial officer in grey-green uniform stands behind a desk, arms crossed, expression cold and dismissive. Filing cabinets line the walls behind him.

Harsh midday light comes through a barred window on the right wall, casting striped shadows across the table and floor.

LIGHTING: Warm dusty interior light. Ochre tones on the tirailleurs, cold grey-green on the French officer and the institutional walls.

COMPOSITION: Medium shot from the side, showing both the tirailleurs and the officer across the table. The barred window shadows create dramatic diagonal lines across the scene.

CRITICAL: Match the reference image style EXACTLY. Flat illustration. Bold outlines. No 3D, no photorealism, no Pixar, no soft gradients. This is a serious historical graphic novel frame.
"""

PROMPT = PROMPT_CLIP2


def generate():
    print(f"Loading style reference: {STYLE_REF_PATH}")
    print(f"Model: gemini-3.1-flash-image-preview")
    print(f"Output: {OUTPUT_DIR}\n")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=[
            types.Part.from_bytes(data=style_ref_bytes, mime_type="image/jpeg"),
            PROMPT,
        ],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    image_bytes = None
    text_response = ""
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
        elif hasattr(part, "text") and part.text:
            text_response = part.text

    if not image_bytes:
        print(f"ERROR: No image generated")
        if text_response:
            print(f"Model said: {text_response}")
        return None

    output_path = OUTPUT_DIR / "thiaroye-clip2-styleref-v1.png"
    with open(output_path, "wb") as f:
        f.write(image_bytes)

    print(f"Saved: {output_path}")
    if text_response:
        print(f"Model notes: {text_response}")

    return str(output_path)


if __name__ == "__main__":
    print("=== Thiaroye Style Reference Generator ===\n")
    result = generate()
    if result:
        import subprocess
        subprocess.run(["open", result], check=False)
        print("\nDone. Review the image and use as Seedance reference if style matches.")
    else:
        print("\nFailed. Check API key and model availability.")
