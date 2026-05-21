"""
Regenerate images 1 and 3 of Thiaroye moodboard with MINIMAL targeted fixes.

Fix Image 1: dot-eyes drift (iris+pupil appeared instead of single black dots)
  - Remove "eyes slightly moist" (conflicts with dot-eyes)
  - Explicit "single black dot, no iris, no white visible"

Fix Image 3: paper-craft drift toward BD flat rendering
  - KEEP all poetic elements (sunlight, petals, atmosphere) — Aziz validated
  - ADD explicit style reinforcement clause at end

Style anchor: thiaroye-camp-sombre-v1.png
Char-ref:     charref-thiaroye-tirailleur.png
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

from google import genai
from google.genai import types

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not found in .env")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
MODEL = "gemini-3.1-flash-image-preview"

STYLE_REF = Path("/tmp/flat-sepia-test/thiaroye-camp-sombre-v1.png")
CHAR_REF = Path("/tmp/flat-sepia-test/charref-thiaroye-tirailleur.png")

OUTPUT_DIR = Path("/tmp/thiaroye-moodboard")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

style_part = types.Part.from_bytes(data=STYLE_REF.read_bytes(), mime_type="image/png")
char_part = types.Part.from_bytes(data=CHAR_REF.read_bytes(), mime_type="image/png")

SCENES = [
    {
        "name": "moodboard-01-mere-village-v2",
        "prompt": """Using the first attached image as the EXACT paper-craft style anchor (same flat 2D paper-craft style, same clean dark outlines, same chibi proportions with dot-eyes, same flat color fills, same paper texture, same simple character shapes), and the second attached image as reference for the tirailleur character uniform, generate a NEW scene.

Paper-craft illustration, 16:9 landscape format. BUT with a WARM palette — completely different from the reference's cold grey palette: ochre earth ground, green palm trees, golden afternoon sunlight, soft terracotta tones. This is a West African village scene in Senegal, 1939.

At center foreground: a dignified Senegalese mother standing upright. She wears a colorful boubou dress (deep indigo blue with yellow geometric patterns) and a matching head wrap. Dark brown skin. Her arms are at her sides. Her gaze is directed toward the right side of the frame, following someone who is leaving.

CRITICAL EYES RULE: her eyes MUST be strict paper-craft dot-eyes — each eye is a single small black dot, NO iris, NO white visible, NO pupil structure, NO almond shape. Just two small black dots, exactly like the tirailleurs in the style reference image. This is non-negotiable.

Her expression conveys quiet pride and restrained sorrow — transmitted through her UPRIGHT POSTURE, her FIRM JAW, and her STEADY GAZE DIRECTION (toward her departing son). NO tears, NO crying, NO exaggerated emotion. The emotion comes from body language and composition, not from detailed eye rendering.

In the right middle-ground, half-exiting the frame: a young Senegalese tirailleur (her son Mamadou) walks away in STRICT SIDE PROFILE, seen from his back-left. He wears the exact same French colonial khaki uniform as the character reference (khaki shirt, khaki trousers, dark beret, small French flag patch on shoulder, brown leather belt, brown boots). He carries a small dark pack on his shoulder. His posture is upright, walking forward, not looking back.

Background: a round thatched-roof Sahelian hut at the left, a large baobab tree at the center-back, a low wooden fence. Soft blur on background elements to create depth. Warm golden light as if late afternoon.

Style: clean dark outlines, flat color fills, paper texture visible, chibi-like simple character proportions, STRICT DOT-EYES (single black dots only), no detailed facial features beyond the style. NO text, NO labels, NO watermarks. Do NOT add realism. Do NOT use the cold grey palette of the reference image — use warm ochre and green only."""
    },
    {
        "name": "moodboard-03-provence-baiser-v2",
        "prompt": """Using the first attached image as the EXACT paper-craft style anchor (same flat 2D paper-craft style, same clean dark outlines, same chibi proportions with dot-eyes, same flat color fills, same paper texture, same simple character shapes), and the second attached image as reference for the tirailleur uniform, generate a NEW scene.

Paper-craft illustration, 16:9 landscape format. BRIGHT SATURATED palette — completely different from the reference's cold grey: clear bright blue sky, vivid red and deep blue accents from French tricolor flags, a clean white dress, sunny yellow wildflowers scattered in the air, lush green plane trees. Warm golden sunlight. This is the ONLY vivid-color moment of the film — maximum joy and celebration.

Medium close-up, chest-level framing. A young French woman with shoulder-length wavy dark-brown 1940s-style hair and a simple light summer dress leans in and kisses the cheek of a Senegalese tirailleur. She is on the left, slightly shorter. Her gesture is warm but dignified, not romantic — a gesture of gratitude. Her eyes are closed, a gentle smile on her lips.

The Senegalese tirailleur is on the right, slightly taller, dark brown skin. He wears the exact same khaki French colonial uniform as the character reference but holds his beret in his hand (uncovered head, short dark curly hair revealed). He looks gently surprised, a soft restrained smile forming at the corner of his mouth, shoulders slightly stiff with pride and proper restraint.

CRITICAL EYES RULE: both characters MUST have strict paper-craft dot-eyes — single small black dots, NO iris, NO white visible, NO pupil structure, NO cils, NO almond shape. The woman's closed eyes should be simple small dark curved lines (closed dot-eyes). The tirailleur's open eye should be a single small black dot. Exactly like the tirailleurs in the style reference image.

Background: a warm celebratory blur — small tricolor French flags (blue-white-red) being waved by out-of-focus villagers, scattered yellow flower petals mid-air, distant silhouettes of joyful villagers on a village square in Provence. Sunlight streams through plane tree leaves creating warm golden highlights.

CRITICAL STYLE RULE: every surface must be rendered in FLAT COLOR FILLS only — uniform single-color blocks with clean dark outlines, exactly like the Thiaroye reference image. NO shading gradients on faces, NO rosy cheeks with color transitions, NO detailed hair strands (hair is a single flat color block shaped by outline), NO wood grain texture on tree trunks (tree trunks are flat brown with simple dark outline indicating shape), NO ombrage / shading on the uniform. The warm atmosphere comes from the palette choice and lighting direction, NOT from rendered light effects. Match the render-flatness of the Thiaroye reference image exactly.

Do NOT add realism. Capture dignity and tenderness, not romance cliche. The tirailleur must remain composed and proud."""
    },
]

for scene in SCENES:
    print(f"\n=== Generating {scene['name']} with {MODEL} ===")
    print(f"Prompt length: {len(scene['prompt'])} chars")

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            style_part,
            char_part,
            scene["prompt"],
        ],
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    output_path = OUTPUT_DIR / f"{scene['name']}.png"
    saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            output_path.write_bytes(part.inline_data.data)
            print(f"Saved: {output_path}")
            saved = True
        elif part.text:
            print(f"Model text: {part.text[:200]}")

    if not saved:
        print(f"ERROR: No image generated for {scene['name']}!")
        sys.exit(1)

print("\n=== Done — 2 v2 moodboard images regenerated ===")
print(f"Output dir: {OUTPUT_DIR}")
