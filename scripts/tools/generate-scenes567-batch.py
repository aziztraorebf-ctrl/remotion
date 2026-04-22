"""
Generate 10 images for Sonjata Papercraft Scenes 5-6-7.
Each image uses charsheet + style-ref as input where appropriate.
Model: gemini-3.1-flash-image-preview
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

PROJECT_DIR = Path(__file__).resolve().parents[2] / "sonjata-papercraft"
IMG_DIR = PROJECT_DIR / "images"
REFS_DIR = PROJECT_DIR / "refs"

CHILD_CHARSHEET = REFS_DIR / "sunjata-child-charsheet-v1.png"
ADULT_CHARSHEET = REFS_DIR / "sunjata-adult-charsheet-v1.png"
SCENE4_LASTFRAME = Path("/tmp/scene4-lastframe.png")
STYLE_REF = IMG_DIR / "scene1-prophetie-v2.png"  # paper-craft style anchor


def load_image(path: Path) -> types.Part:
    data = path.read_bytes()
    return types.Part.from_bytes(data=data, mime_type="image/png")


def generate_image(prompt: str, source_images: list[Path], output_name: str):
    """Generate image with Gemini, optionally with source images."""
    contents = []
    for img_path in source_images:
        if img_path.exists():
            contents.append(load_image(img_path))
            print(f"  + ref: {img_path.name}")
        else:
            print(f"  ! MISSING: {img_path}")
    contents.append(prompt)

    print(f"\n{'='*60}")
    print(f"Generating: {output_name}")
    print(f"Prompt: {prompt[:150]}...")
    print(f"{'='*60}")

    response = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    output_path = IMG_DIR / output_name
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            output_path.write_bytes(part.inline_data.data)
            size_kb = output_path.stat().st_size / 1024
            print(f"  -> Saved: {output_path.name} ({size_kb:.0f} KB)")
            return output_path
        elif part.text:
            print(f"  Text: {part.text[:200]}")

    print(f"  ! No image generated for {output_name}")
    return None


# ============================================================
# PROMPTS
# ============================================================

PROMPTS = [
    {
        "id": "scene5a",
        "name": "scene5a-barre-arc.png",
        "refs": [CHILD_CHARSHEET, STYLE_REF],
        "prompt": """Use these reference images for character design and visual style.

Papercraft storybook illustration, thick black outlines, warm GOLDEN paper texture, chibi proportions with dot-eyes, flat color fills, West African village setting.

A young African boy (MATCH THIS CHARACTER SHEET EXACTLY: bare-chested, red/terracotta loincloth, curly black hair, dark brown skin, determined fierce expression) stands TRIUMPHANT in the center of the frame, holding a BENT iron bar curved into an arc between both hands raised above his head. His arms are fully extended, muscles straining.

Around him in a wide circle, 8-10 villagers stand FROZEN in shock -- hands over mouths, bodies leaning BACK. Each villager has DISTINCT face, different ages and body types. No two faces alike.

Background: round thatched huts, large baobab tree, warm golden afternoon light. Dust particles floating in the golden light.

The boy is the LARGEST figure in the frame, centered, facing the viewer at three-quarter angle.

CRITICAL: the iron bar is BENT into a clear arc/U-shape between his hands. The bar is thick, dark grey iron. Boy is STANDING on both feet (not kneeling). Vertical 9:16 portrait format. No text, no letters, no numerals visible anywhere."""
    },
    {
        "id": "scene5b",
        "name": "scene5b-baobab-arrache.png",
        "refs": [CHILD_CHARSHEET, STYLE_REF],
        "prompt": """Use these reference images for character design and visual style.

Papercraft storybook illustration, thick black outlines, warm GOLDEN paper texture, chibi proportions with dot-eyes, flat color fills, West African village setting.

LOW ANGLE shot looking UP at a massive baobab tree filling the top two-thirds of the frame. The trunk is enormous, thick, textured bark in browns and greys.

At the base of the tree, a young African boy (MATCH THIS CHARACTER SHEET EXACTLY: bare-chested, red/terracotta loincloth, curly black hair, dark brown skin, determined expression) GRIPS the trunk with both hands, feet planted wide on the ground, body leaning back ready to PULL. His entire posture shows maximum effort about to begin.

Behind him at a safe distance, 6-8 villagers watch from both sides of the frame, creating a natural corridor. Each villager has DISTINCT face and body type. Some shield children behind them. No two faces alike.

Ground: dry earth, visible roots emerging from soil around the trunk base. Small cracks forming in the earth near the roots.

CRITICAL: No iron bar visible anywhere in this image. The boy's hands are EMPTY except for gripping the tree trunk. Warm golden palette. Vertical 9:16 portrait format. No text, no letters, no numerals visible anywhere."""
    },
    {
        "id": "scene6a",
        "name": "scene6a-exil-sunset.png",
        "refs": [CHILD_CHARSHEET, STYLE_REF],
        "prompt": """Use these reference images for character design and visual style.

Papercraft storybook illustration, thick black outlines, SUNSET palette -- deep orange, burnt sienna, dark purple sky, warm paper texture, chibi proportions, flat color fills.

WIDE SHOT from behind. A small African family walks AWAY from the viewer toward a large setting sun on the horizon. Three figures with visible dark brown skin tones (NOT pure black silhouettes):
- Center: a small boy (bare-chested, red loincloth, curly hair) walking with determined steps
- Left: a hunched woman in simple cloth wrap (his mother), walking with a staff
- Right: a taller figure carrying a bundle on their head

The path is a dusty trail through dry savanna. Behind them in the far background, the village they are leaving -- small round huts barely visible.

Mood: melancholic but dignified. The sun is huge and low, casting long shadows toward the viewer. Dry grass on both sides of the path.

CRITICAL: figures seen from BEHIND, walking AWAY. Sunset colors dominate. Vertical 9:16 portrait format. No text, no letters visible anywhere."""
    },
    {
        "id": "scene6b",
        "name": "scene6b-guerrier-mema.png",
        "refs": [ADULT_CHARSHEET, STYLE_REF],
        "prompt": """Use these reference images for character design and visual style.

Papercraft storybook illustration, thick black outlines, warm sepia/amber paper texture, chibi proportions with dot-eyes, flat color fills, West African setting.

MEDIUM SHOT. A young African warrior (MATCH THIS CHARACTER SHEET EXACTLY: white sleeveless tunic with gold trim, red sash at waist, braided hair in rows, curved sword at hip, gold necklace, dark brown skin, confident commanding expression) stands in a three-quarter pose facing slightly left.

He is in a training ground or courtyard in the kingdom of Mema. Behind him: a mud-brick wall with geometric patterns, a wooden training dummy, spears leaning against the wall. Warm afternoon light from the right.

His right hand rests on the pommel of his curved sword. His posture is UPRIGHT, shoulders BACK, chin slightly raised -- a warrior fully formed.

Two soldiers in simple tunics and leather armor stand at attention in the background, slightly blurred. Each has distinct features.

CRITICAL: This is an ADULT warrior, NOT a child. NOT a teenager. Adult proportions per character sheet. Confident, not aggressive. Vertical 9:16 portrait format. No text, no letters visible anywhere."""
    },
    {
        "id": "scene6c",
        "name": "scene6c-messager.png",
        "refs": [ADULT_CHARSHEET, STYLE_REF],
        "prompt": """Use these reference images for character design and visual style.

Papercraft storybook illustration, thick black outlines, warm sepia paper texture shifting to URGENT amber/red tones, chibi proportions with dot-eyes, flat color fills.

TWO-SHOT composition. Left side: an EXHAUSTED messenger on one knee, dark brown skin, torn dusty clothes, one arm extended pointing behind him, sweat drops visible, mouth open as if shouting urgent news. He has a different face from all other characters -- gaunt, older, weathered.

Right side: Sunjata the adult warrior (MATCH THIS CHARACTER SHEET EXACTLY: white tunic, gold trim, red sash, braided hair, curved sword, gold necklace, dark brown skin) stands tall, facing the messenger, his expression FIERCE determination. His hand GRIPS his sword handle.

Background: the courtyard of Mema, but now the sky behind the messenger has an ominous ORANGE-RED glow suggesting distant fires. Smoke wisps in the sky.

CRITICAL: two distinct characters with very different body language -- one collapsed/desperate, one upright/determined. Adult warrior proportions. Vertical 9:16 portrait format. No text, no letters visible anywhere."""
    },
    {
        "id": "scene7a",
        "name": "scene7a-soumaoro.png",
        "refs": [STYLE_REF],
        "prompt": """Use this reference image for visual style only.

Papercraft storybook illustration, thick black outlines, COLD palette -- dark grey, blue-grey, desaturated earth tones, aged paper texture, chibi proportions with dot-eyes, flat color fills.

IMPOSING LOW ANGLE shot. A terrifying sorcerer-king stands at the center, filling the upper half of the frame. He wears:
- A horned SKULL MASK covering the upper half of his face (animal skull with curved horns)
- A dark feathered CLOAK that spreads wide like wings
- Leather armor with bone ornaments and talismans
- Dark brown skin visible on arms and lower face, strong jaw

His arms are spread wide, palms open, in a gesture of absolute POWER. His posture radiates menace and invincibility.

Behind him: rows of warriors in dark leather armor, holding spears and shields, arranged in tight formation. The army stretches to the edges of the frame. COLD grey-blue sky with heavy clouds.

Mood: dread, intimidation, darkness. This is the VILLAIN.

CRITICAL: cold desaturated palette -- NO warm tones. The skull mask has CURVED horns (not straight). Dark feathered cloak. Each visible soldier face is distinct. Vertical 9:16 portrait format. No text, no letters visible anywhere."""
    },
    {
        "id": "scene7b",
        "name": "scene7b-ergot-fleche.png",
        "refs": [ADULT_CHARSHEET, STYLE_REF],
        "prompt": """Use these reference images for character design and visual style.

Papercraft storybook illustration, thick black outlines, cold grey-blue palette with warm AMBER firelight from the left, aged paper texture, chibi proportions with dot-eyes, flat color fills.

CLOSE-UP MEDIUM shot. Sunjata the adult warrior (MATCH THIS CHARACTER SHEET EXACTLY: white tunic, gold trim, red sash, braided hair, curved sword at hip, gold necklace, dark brown skin, FIERCE focused expression) sits cross-legged on the ground.

His hands work carefully in front of him: he is ATTACHING a small WHITE ROOSTER SPUR (a small curved white claw/talon, 3-4 cm long) to the TIP of an arrow. The arrow is held in his left hand, the spur in his right, binding them with thin cord.

A quiver of arrows lies beside him. His bow rests against his knee -- a simple curved wooden bow.

Background: a military camp at NIGHT. Small campfire to the left casting warm amber light on his face and hands. Dark tents/shelters behind. Stars visible in cold dark blue sky.

CRITICAL: the rooster spur is SMALL, WHITE, CURVED like a tiny claw. It must be clearly visible being attached to the arrowhead. Intimate focused moment before battle. Vertical 9:16 portrait format. No text, no letters visible anywhere."""
    },
    {
        "id": "scene7c_start",
        "name": "scene7c-start-arc-bande.png",
        "refs": [ADULT_CHARSHEET, STYLE_REF],
        "prompt": """Use these reference images for character design and visual style.

Papercraft storybook illustration, thick black outlines, cold grey-blue palette, aged paper texture, chibi proportions with dot-eyes, flat color fills.

DRAMATIC MEDIUM SHOT. Sunjata the adult warrior (MATCH THIS CHARACTER SHEET EXACTLY: white tunic, gold trim, red sash, braided hair, gold necklace, dark brown skin, INTENSE expression) in SIDE PROFILE facing LEFT.

He DRAWS his bow at full extension -- left arm straight forward holding the bow, right arm PULLED BACK to his cheek holding the arrow string. The arrow with a WHITE SPUR TIP points forward toward the left edge of the frame.

His body forms a perfect archer stance: feet planted wide, core twisted, every muscle engaged. The bow is a simple curved wooden bow under tension.

Background: battlefield DUST and CHAOS behind him, blurred dark figures fighting. But he is STILL, FOCUSED, a moment of calm before release.

Ground: clean dry earth. NO drawn effects, NO motion lines, NO dust clouds pre-drawn. Clean static frame.

CRITICAL: SIDE PROFILE facing LEFT. Full bow draw. Arrow tip with small white spur visible. Clean ground -- no effects drawn. Vertical 9:16 portrait format. No text visible anywhere."""
    },
    {
        "id": "scene7c_end",
        "name": "scene7c-end-arc-relache.png",
        "refs": [ADULT_CHARSHEET, STYLE_REF],
        "prompt": """Use these reference images for character design and visual style.

Papercraft storybook illustration, thick black outlines, cold grey-blue palette, aged paper texture, chibi proportions with dot-eyes, flat color fills.

DRAMATIC MEDIUM SHOT. Sunjata the adult warrior (MATCH THIS CHARACTER SHEET EXACTLY: white tunic, gold trim, red sash, braided hair, gold necklace, dark brown skin, FIERCE triumphant expression) in SIDE PROFILE facing LEFT.

He has JUST RELEASED the arrow -- left arm still extended holding the bow (now relaxed, string forward), right arm has followed through past his ear. His body leans slightly forward with the release momentum.

The arrow is GONE -- it has been fired. The bow string is relaxed.

His expression has shifted from concentration to fierce certainty.

Background: same battlefield dust, but slightly clearer. A distant dark figure (tiny in the background) is visible in the direction the arrow flew.

Ground: clean dry earth. NO drawn effects, NO motion lines. Clean static frame.

CRITICAL: SAME composition as archer pose but POST-RELEASE. No arrow in bow. String relaxed. Same side profile LEFT. Clean ground. Vertical 9:16 portrait format. No text visible anywhere."""
    },
    {
        "id": "scene7d",
        "name": "scene7d-defaite.png",
        "refs": [STYLE_REF],
        "prompt": """Use this reference image for visual style only.

Papercraft storybook illustration, thick black outlines, transitioning palette -- left side COLD grey-blue, right side WARM GOLDEN, aged paper texture, chibi proportions with dot-eyes, flat color fills.

WIDE HIGH ANGLE shot looking down on a battlefield.

LEFT HALF (cold/dark): a sorcerer-king has FALLEN -- he lies face-down on the ground, his horned skull mask cracked and displaced, his dark feathered cloak spread around him like broken wings. An arrow protrudes from his shoulder area. His body is STILL. Dark brown skin visible.

RIGHT HALF (warm/golden): his army of dark-armored warriors FLEE in disarray -- running AWAY toward the horizon. Shields and spears dropped on the ground. Dust clouds rise from their retreat.

The transition from cold to warm across the frame represents the shift from tyranny to liberation.

Above: the sky mirrors the split -- dark clouds on the left breaking to golden sunset light on the right.

CRITICAL: HIGH ANGLE looking DOWN. Sorcerer-king face-down defeated. Army fleeing. Palette transition cold to warm across the frame. Each visible face distinct. Vertical 9:16 portrait format. No text, no letters visible anywhere."""
    },
]


def main():
    # Filter by scene if args provided
    filter_ids = sys.argv[1:] if len(sys.argv) > 1 else None

    results = []
    total = len(PROMPTS)

    for i, item in enumerate(PROMPTS):
        if filter_ids and item["id"] not in filter_ids:
            continue

        print(f"\n[{i+1}/{total}] {item['id']}")
        try:
            path = generate_image(item["prompt"], item["refs"], item["name"])
            results.append({"id": item["id"], "path": path, "status": "OK"})
        except Exception as e:
            print(f"  ! ERROR: {e}")
            results.append({"id": item["id"], "path": None, "status": f"ERROR: {e}"})

        # Small delay to avoid rate limiting
        if i < total - 1:
            time.sleep(2)

    # Summary
    print(f"\n{'='*60}")
    print("BATCH SUMMARY")
    print(f"{'='*60}")
    ok = sum(1 for r in results if r["status"] == "OK")
    print(f"Generated: {ok}/{len(results)}")
    for r in results:
        status = "OK" if r["status"] == "OK" else "FAIL"
        print(f"  [{status}] {r['id']}")

    if ok == len(results):
        print("\nAll images generated successfully.")
    else:
        print(f"\n{len(results) - ok} failed. Check errors above.")


if __name__ == "__main__":
    main()
