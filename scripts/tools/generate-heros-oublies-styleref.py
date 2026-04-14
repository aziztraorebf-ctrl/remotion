"""
Style Reference Generator — Serie Heros Oublies
Generates Gemini style reference images for Seedance prompts.
Input: style anchor (thiaroye frame-03) + scene descriptions
Output: 9:16 vertical images in 2D flat BD style
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "models/gemini-3.1-flash-image-preview"

STYLE_ANCHOR = (
    Path(__file__).parent.parent.parent
    / "public"
    / "assets"
    / "library"
    / "geoafrique"
    / "thiaroye-1944"
    / "frames"
    / "frame-03.jpg"
)

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
# CLIPS TABLE — Heros Oublies scenes for Seedance ref
# ============================================================

CLIPS = [
    {
        "id": "soundjata-iron-bar",
        "scene": """SCENE: 13th century West Africa, the village of Niani, Manden territory.
A young African boy, roughly 7 years old, kneeling on red laterite earth. He is thin, with determined eyes, wearing a simple brown cotton wrap around his waist. His hands grip a thick vertical iron bar planted in the ground. His knuckles are white with effort, his shoulders tensed upward as if about to push himself to standing.
Behind him, five women in colorful West African wraps (indigo, ochre, orange) watch with wide eyes and open mouths — a mix of shock and awe.
The ground is dry cracked red earth with scattered dust. A massive baobab tree fills the right side of the background, its thick trunk dominating the frame.
LIGHTING: Late afternoon warm golden light from the left. Long shadows stretching right. Warm amber tones on skin, cool blue-grey in shadows.
COMPOSITION: Medium shot, the boy centered, iron bar vertical through the frame center. Women grouped behind-left. Baobab on the right. Camera at the boy's eye level (low, looking slightly up).""",
    },
    {
        "id": "soundjata-insult-starting-pose",
        "scene": """SCENE: 13th century West Africa, the village of Niani, Manden territory. Exterior, village common area. Daytime. Confrontation between two women.

STARTING POSE FRAME for Seedance image-to-video animation — FIRST frame of an animated shot where the rival wife is about to launch a public insult.

TWO WOMEN STANDING FACE TO FACE, roughly the same height, at roughly the same eye level. Medium-full shot showing both from the knees up.

LEFT SIDE (the MOTHER of Soundjata, Sogolon): African woman of roughly thirty-five years old. She wears a TURQUOISE-TEAL colored West African wrap dress with a matching TURQUOISE head turban (this color is critical — she must match a background woman seen in our related footage). She wears SIMPLE BROWN LEATHER SANDALS with plain flat straps — modest, functional, befitting her humble station despite being a king's wife. Her expression is proud but hurt — her chin raised despite the humiliation, her eyes steady but glistening. Her hands are held at her sides, fists gently clenched. Dignity under attack. She is facing RIGHT, toward her accuser. Lit fully.

RIGHT SIDE (the RIVAL WIFE, the king's first wife): African woman of roughly forty years old. She wears a richly patterned WEST AFRICAN WRAP IN INDIGO BLUE AND OCHRE with gold beadwork at her neck, and an elaborate dark blue head turban. She wears ORNATE DARK LEATHER SANDALS with decorative tooled patterns, multiple straps crossing over the foot, and small brass accents at the ankle — clearly the footwear of a high-status royal wife. She is in profile angled three-quarters toward camera. Her RIGHT ARM is raised and extended forward, her index finger pointing accusingly at the other woman's face. Her mouth is slightly open, mid-breath, just beginning to speak. Her eyebrows are drawn together, her expression cruel and mocking. Her posture is tall, imperious. She is facing LEFT.

NO CHILDREN IN THE FRAME. Do not include any boys, children, or crawling figures. The scene focuses entirely on the two women in confrontation.

ENVIRONMENT: Red laterite earth ground. Mud-brick village huts in the background. Palm trees and a baobab tree visible in the far background. A few village details — a clay pot on the ground, woven baskets against a hut wall. Possibly one or two silhouette figures watching from a distance in the far background.

LIGHTING: Midday warm golden light from above. Hard ground shadows under both women. Warm amber and ochre palette dominant. Both women are clearly lit — this is a public confrontation, nothing is hidden in shadow.

COMPOSITION: Vertical 9:16 portrait. The two women dominate the frame face to face, the pointing arm of the rival wife crossing the center of the image horizontally. Symmetrical framing — the power dynamic comes from the posture and expression, not from sizes. Camera at their eye level.

CRITICAL POSE DETAILS for animation: rival wife's mouth barely open (natural starting point for speaking an insult over 4 seconds). Arm already extended (ready to hold while she talks). Mother facing her directly, NOT looking down, NOT seated. This is frame ZERO of a ~4 second shot where the rival wife will deliver her insult.""",
    },
    {
        "id": "yaa-asantewaa-speech",
        "scene": """SCENE: 1900, interior of a torchlit council chamber in Kumasi, Ashanti Empire (modern Ghana).
A woman of roughly sixty years old stands at the center of the frame. She is Yaa Asantewaa, Queen Mother of Ejisu. She wears brilliant gold and kente cloth — vibrant yellow-gold patterns with red and green accents. Her expression is fierce, determined, commanding. Her right arm is extended, pointing accusingly toward seated figures.
Around her in a wide semicircle, twelve Ashanti chiefs sit on carved wooden stools. They are in traditional regalia — but their colors are MUTED, DESATURATED, almost grey. Their heads are slightly bowed, arms crossed or resting on knees. They look uncertain, hesitant.
Torches on the walls cast warm flickering light. The walls are decorated with Adinkra symbols.
LIGHTING: Warm torch amber on Yaa Asantewaa (she is the brightest element). The chiefs and background are in cooler, desaturated tones. Strong contrast between her vivid gold and their muted greys.
COMPOSITION: Yaa Asantewaa stands center-frame, full body visible. Chiefs form a semicircle around her at seated height. Camera at standing eye level, facing her. The contrast between her standing posture and their seated positions is the visual anchor.""",
    },
]

OUTPUT_DIR = Path(__file__).parent.parent.parent / "tmp" / "heros-oublies-styleref"


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

    clips_to_generate = CLIPS
    if len(sys.argv) > 1:
        requested = set(sys.argv[1:])
        clips_to_generate = [c for c in CLIPS if c["id"] in requested]
        if not clips_to_generate:
            print(
                f"ERROR: No matching clips. Available: {[c['id'] for c in CLIPS]}"
            )
            sys.exit(1)

    print(f"=== Heros Oublies — Style Reference Generator ===")
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
