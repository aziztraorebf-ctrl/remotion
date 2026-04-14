"""
Style Reference Generator (parametric)
Generates Gemini style reference images for any clip list.
Input: style anchor image + CLIPS table with scene descriptions
Output: 9:16 vertical images in the same style, one per clip
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

STYLE_ANCHOR = Path(__file__).parent.parent / "public" / "assets" / "library" / "geoafrique" / "thiaroye-1944" / "frames" / "frame-03.jpg"

STYLE_PREAMBLE = """Look at this reference image carefully. This is the EXACT visual style I need you to replicate:
- 2D flat illustration with bold black outlines
- Limited color palette: warm ochre, khaki, sepia tones
- Stylized but anatomically correct human figures
- Clean flat color fills, no photorealistic textures
- Graphic novel / bande dessinee aesthetic
- Serious historical tone, not cartoon or cute

Now generate a NEW image in this EXACT SAME style with these specifications:

FORMAT: Vertical 9:16 (1080x1920 portrait orientation)

"""

STYLE_SUFFIX = """

CRITICAL: Match the reference image style EXACTLY. Flat illustration. Bold outlines. No 3D, no photorealism, no Pixar, no soft gradients. This is a serious historical graphic novel frame."""

# ============================================================
# CLIPS TABLE - Edit this for each project
# Each clip: { "id": "clip1", "scene": "scene description" }
# ============================================================

CLIPS = [
    {
        "id": "clip1",
        "scene": """SCENE: Dakar 1944, a dusty military port at golden hour.
Three Senegalese tirailleurs in worn French army uniforms (khaki, belts, boots) stand in a line on a concrete pier. Duffel bags at their feet. Behind them: a military ship docked, harbour cranes, and distant French officers as small silhouettes.
The three soldiers are DIFFERENT from each other -- different heights, different faces, different postures. The central soldier holds a folded white letter at chest height.
Their expressions are dignified, patient, stoic.
LIGHTING: Late afternoon golden hour. Warm light on the soldiers. The background (pier, ships, officers) is in cold grey-blue desaturated tones while the tirailleurs remain in warm ochre/khaki.
COMPOSITION: Medium shot, soldiers occupy the center-bottom two-thirds of the frame. Sky and harbour fill the top third. Camera at eye level.""",
    },
    {
        "id": "clip2",
        "scene": """SCENE: Interior of a military barracks, Thiaroye camp, December 1944.
Three Senegalese tirailleurs in worn khaki uniforms sit around a heavy wooden table. Papers and an opened white envelope are spread on the table. The central soldier has his open palm pressed flat on the table, leaning forward with controlled anger. His two comrades sit beside him, fists clenched on the table surface.
Across the table, a French colonial officer in grey-green uniform stands behind a desk, arms crossed, expression cold and dismissive. Filing cabinets line the walls behind him.
Harsh midday light comes through a barred window on the right wall, casting striped shadows across the table and floor.
LIGHTING: Warm dusty interior light. Ochre tones on the tirailleurs, cold grey-green on the French officer and the institutional walls.
COMPOSITION: Medium shot from the side, showing both the tirailleurs and the officer across the table. The barred window shadows create dramatic diagonal lines across the scene.""",
    },
    {
        "id": "clip3",
        "scene": """SCENE: Thiaroye camp exterior, pre-dawn darkness, December 1, 1944.
Ground-level perspective of a dusty parade ground. Shell casings, scattered papers, a single kepi hat, and boot prints in the dust. Thin wisps of smoke drift across the ground. In the deep background, silhouettes of barracks buildings against a dark sky with the faintest hint of dawn light on the horizon.
No people visible -- only the aftermath. A torn French tricolor flag hangs limply from a tilted flagpole on the right side.
LIGHTING: Pre-dawn blue-grey with warm orange glow at the horizon line. Cold tones dominate.
COMPOSITION: Low angle from ground level, looking across the debris-covered ground toward the horizon. The flagpole and kepi create vertical and horizontal focal points.""",
    },
]

OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "styleref"


def generate_clip(clip: dict, style_ref_bytes: bytes) -> str | None:
    clip_id = clip["id"]
    prompt = STYLE_PREAMBLE + clip["scene"] + STYLE_SUFFIX

    print(f"\n--- Generating {clip_id} ---")

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=style_ref_bytes, mime_type="image/jpeg"),
            prompt,
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
        print(f"FAIL: {clip_id} - no image generated")
        if text_response:
            print(f"  Model said: {text_response}")
        return None

    output_path = OUTPUT_DIR / f"{clip_id}-styleref.png"
    with open(output_path, "wb") as f:
        f.write(image_bytes)

    print(f"OK: {output_path}")
    if text_response:
        print(f"  Notes: {text_response[:100]}")

    return str(output_path)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not STYLE_ANCHOR.exists():
        print(f"ERROR: Style anchor not found: {STYLE_ANCHOR}")
        sys.exit(1)

    with open(STYLE_ANCHOR, "rb") as f:
        style_ref_bytes = f.read()

    # Filter clips if IDs passed as args
    clips_to_generate = CLIPS
    if len(sys.argv) > 1:
        requested = set(sys.argv[1:])
        clips_to_generate = [c for c in CLIPS if c["id"] in requested]
        if not clips_to_generate:
            print(f"ERROR: No matching clips. Available: {[c['id'] for c in CLIPS]}")
            sys.exit(1)

    print(f"=== Style Reference Generator ===")
    print(f"Model: {MODEL}")
    print(f"Clips: {[c['id'] for c in clips_to_generate]}")
    print(f"Output: {OUTPUT_DIR}")

    results = []
    for clip in clips_to_generate:
        result = generate_clip(clip, style_ref_bytes)
        results.append((clip["id"], result))

    print(f"\n=== Results ===")
    for clip_id, path in results:
        status = "OK" if path else "FAIL"
        print(f"  {status}: {clip_id}")


if __name__ == "__main__":
    main()
