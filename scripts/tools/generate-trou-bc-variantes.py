"""
Generate 6 images for Trou B (3) + Trou C (3) of Soundjata Short.
Uses Gemini 3.1 Flash Image with two style refs (iron-bar + humiliation scene).
"""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-3.1-flash-image-preview"

# Refs
REF_IRON_BAR = Path("/tmp/iron-bar-8s.png")
REF_HUMILIATION = Path("/Users/clawdbot/Workspace/remotion/public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2/end-frame-humiliation.png")

OUTPUT_DIR = Path("/Users/clawdbot/Workspace/remotion/public/assets/library/geoafrique/heros-oublies/soundjata/refs/acte2")

STYLE_ANCHOR = "2D vivid flat anime illustration, painted graphic novel style, bold clean outlines, cel-shaded flat colors, warm ochre and terracotta palette"

PROMPTS = {
    # === TROU B ===
    "trou-b-v1": f"""{STYLE_ANCHOR}.
EXTREME CLOSE-UP on the face of a young dark brown-skinned West African boy, approximately 8 years old. He is sitting on the ground in a 13th century Mande village. His eyes LOOK UP with fierce burning determination, jaw CLENCHED tight, nostrils slightly flared. The rage is BORN in his eyes — this is the moment everything changes.
Background: soft bokeh blur of village huts and baobab tree, warm golden-orange sky.
Portrait format 9:16. Dramatic side-lighting casting half his face in warm shadow.
No text, no letters, no numerals, no writing visible anywhere in the image.""",

    "trou-b-v2": f"""{STYLE_ANCHOR}.
Medium shot of a young dark brown-skinned West African boy (~8 years old) sitting on red laterite ground in a 13th century Mande village. His fists are CLENCHED in the red dust, body TENSE with suppressed fury. He wears a simple brown cloth wrap.
In the far background (blurred, small): two women standing — one pointing and laughing (in blue patterned dress), the other looking down in shame (in teal dress). They are distant silhouettes, NOT the focus.
The boy dominates the lower 2/3 of the frame. Red dust particles visible in warm golden light.
Portrait format 9:16.
No text, no letters, no numerals, no writing visible anywhere in the image.""",

    "trou-b-v3": f"""{STYLE_ANCHOR}.
Dramatic SPLIT COMPOSITION portrait format 9:16:
TOP HALF (dark, shadowy): The silhouette/shadow of a woman laughing cruelly, hand on hip, cast against an orange-gold sky. Dark and menacing.
BOTTOM HALF (lit, intense): Close-up of a young dark brown-skinned West African boy (~8 years old) on the ground, face looking UP toward the shadow above with burning defiance in his eyes. His expression is 60% cold determination, 40% barely contained rage.
A strong diagonal shadow line separates the two halves. Dramatic chiaroscuro lighting.
Red laterite ground visible beneath the boy. 13th century Mande village context.
No text, no letters, no numerals, no writing visible anywhere in the image.""",

    # === TROU C ===
    "trou-c-v1": f"""{STYLE_ANCHOR}.
CLOSE-UP on the bare feet of a young dark brown-skinned African boy, PLANTED FIRMLY and solidly on cracked red laterite earth. The feet are strong, toes gripping the ground — these feet will NEVER crawl again. The stance is wide and powerful.
Beside the feet on the ground: a twisted, bent iron bar, discarded.
The camera angle is LOW, almost ground-level, looking at the feet from slightly below.
Dust settling around the feet. Warm golden light from the side.
Portrait format 9:16 — feet in the lower third, red earth filling the frame, hint of village and baobab in soft focus above.
No text, no letters, no numerals, no writing visible anywhere in the image.""",

    "trou-c-v2": f"""{STYLE_ANCHOR}.
LOW ANGLE shot looking UP at a young dark brown-skinned West African boy (~8 years old) standing TALL and powerful. He is seen from below — he DOMINATES the frame. His posture is straight, shoulders back, chin slightly raised. Simple brown cloth wrap.
Behind him: expansive ochre-gold sky with dramatic warm clouds. A massive baobab tree silhouette to one side.
The boy's expression: calm triumph, quiet power. He has just proven everyone wrong.
Portrait format 9:16. The boy fills the center of the frame, heroic low-angle composition.
No text, no letters, no numerals, no writing visible anywhere in the image.""",

    "trou-c-v3": f"""{STYLE_ANCHOR}.
Medium shot of a young dark brown-skinned West African boy (~8 years old) standing upright in a 13th century Mande village. In his right hand: a TWISTED, BENT iron bar hanging loosely at his side. Behind him: a massive UPROOTED baobab tree lying on its side, roots exposed to the sky, dust still settling.
In the background (small, not the focus): 4-5 village women of VARIED ages with mouths open in shock and awe, hands raised to their faces.
The boy stands calm and still — the storm has passed. Warm golden-hour lighting. Red laterite ground.
Portrait format 9:16. Boy in center-left of frame, baobab behind-right.
No text, no letters, no numerals, no writing visible anywhere in the image.""",
}


def generate_image(name: str, prompt: str):
    print(f"\n{'='*60}")
    print(f"Generating: {name}")
    print(f"Prompt ({len(prompt)} chars): {prompt[:120]}...")
    print(f"{'='*60}")

    # Load refs
    ref1_bytes = REF_IRON_BAR.read_bytes()
    ref2_bytes = REF_HUMILIATION.read_bytes()

    contents = [
        types.Part.from_bytes(data=ref1_bytes, mime_type="image/png"),
        types.Part.from_bytes(data=ref2_bytes, mime_type="image/png"),
        f"Use these two reference images as STYLE GUIDE ONLY. Match their exact art style, color palette, line weight, and rendering technique. Do NOT copy their composition or pose.\n\n{prompt}",
    ]

    response = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
            temperature=1.0,
        ),
    )

    # Extract image
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            out_path = OUTPUT_DIR / f"{name}.png"
            out_path.write_bytes(part.inline_data.data)
            print(f"Saved: {out_path}")

            # Save prompt sidecar
            prompt_path = OUTPUT_DIR / f"{name}.prompt.txt"
            prompt_path.write_text(prompt)
            print(f"Prompt saved: {prompt_path}")
            return out_path

    print(f"ERROR: No image returned for {name}")
    if response.candidates[0].content.parts:
        for part in response.candidates[0].content.parts:
            if part.text:
                print(f"Text response: {part.text[:500]}")
    return None


def main():
    print(f"Output dir: {OUTPUT_DIR}")
    print(f"Ref 1 (iron-bar): {REF_IRON_BAR} ({REF_IRON_BAR.stat().st_size} bytes)")
    print(f"Ref 2 (humiliation): {REF_HUMILIATION} ({REF_HUMILIATION.stat().st_size} bytes)")
    print(f"Model: {MODEL}")
    print(f"Images to generate: {len(PROMPTS)}")

    results = {}
    for name, prompt in PROMPTS.items():
        try:
            path = generate_image(name, prompt)
            results[name] = path
            # Small delay between calls
            time.sleep(2)
        except Exception as e:
            print(f"FAILED {name}: {e}")
            results[name] = None
            time.sleep(5)

    print(f"\n{'='*60}")
    print("RESULTS:")
    for name, path in results.items():
        status = "OK" if path else "FAILED"
        print(f"  {name}: {status}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
