"""
Generate 3 Seedance i2v clips for Sonjata Papercraft Scene 3.
Runs ONE AT A TIME (no double generation).
Usage: python scripts/tools/generate-scene3-clips.py [A|B|C|all]
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).resolve().parents[2] / ".env", override=True)

# fal_client reads FAL_KEY from env — ensure it's set after dotenv load
if not os.environ.get("FAL_KEY"):
    print("ERROR: FAL_KEY not found in .env")
    sys.exit(1)

IMG_DIR = Path(__file__).resolve().parents[2] / "sonjata-papercraft" / "images"
CLIP_DIR = Path(__file__).resolve().parents[2] / "sonjata-papercraft" / "clips-production"


def upload_image_to_fal(image_path: Path) -> str:
    """Upload image to fal.ai storage and return URL."""
    url = fal_client.upload_file(str(image_path))
    print(f"  Uploaded: {image_path.name} -> {url[:80]}...")
    return url


def download_video(url: str, output_path: Path) -> bool:
    """Download video from URL."""
    resp = requests.get(url, stream=True)
    if resp.status_code == 200:
        with open(output_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"  Saved: {output_path.name} ({size_mb:.1f} MB)")
        return True
    print(f"  Download failed: {resp.status_code}")
    return False


# --- PROMPTS ---

PROMPT_A = """Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style -- flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

SECONDS 0 TO 2: Camera HOLDS STEADY. The small boy on the ground PUSHES UP on his palms, his chest RISES off the dirt. His head LIFTS, jaw CLENCHED. His shoulders TENSE. The woman in blue in the far background TURNS AWAY and STEPS behind the hut, DISAPPEARING from view.

SECONDS 2 TO 4: The boy SHIFTS his weight onto his knees, STRAIGHTENING his torso upright. His fists CLENCH at his sides. He STARES FORWARD with DEFIANCE. The villagers in the background EXCHANGE GLANCES -- one man STEPS BACK, a woman GRIPS her child tighter.

SECONDS 4 TO 5: The boy is now KNEELING UPRIGHT, chest out, chin UP. His fists PRESS against his thighs. Camera HOLDS STEADY on his determined face. The village behind him is STILL -- everyone WATCHES.

COLOR GRADE: warm sepia, aged paper, ochre earth, sienna shadows, cream highlights.

CRITICAL CONSTRAINT: The boy NEVER stands on his feet. He stays ON THE GROUND the entire clip. His maximum position is KNEELING UPRIGHT on his knees -- torso raised, but knees REMAIN on the dirt. Do NOT animate him standing, rising to his feet, or walking.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue."""

PROMPT_B = """Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style -- flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

SECONDS 0 TO 2: Camera HOLDS STEADY. The large blacksmith on the RIGHT STRIDES FORWARD toward the center, the long iron bar balanced across his wide shoulders. His feet STAMP the dusty ground with each heavy step. Dust PUFFS rise from his footfalls. The boy kneeling at CENTER WATCHES the approaching blacksmith, fists CLENCHED on his thighs.

SECONDS 2 TO 4: The blacksmith REACHES the center. He HEAVES the iron bar OFF his shoulders and DRIVES it vertically into the ground in front of the boy -- THUD. The bar STANDS UPRIGHT, vibrating. The villagers in the background FLINCH at the impact -- the old man GRABS his staff tighter, a woman SHIELDS her child behind her.

SECONDS 4 TO 5: Camera PUSHES IN toward the boy and the upright iron bar. The boy STARES UP at the bar towering above him. His jaw SETS. His hands OPEN and CLOSE, preparing to GRIP. The blacksmith STEPS BACK, FOLDING his thick arms across his chest.

COLOR GRADE: warm sepia, aged paper, ochre earth, sienna shadows, cream highlights.

CRITICAL CONSTRAINT: The boy NEVER stands on his feet. He remains KNEELING on the ground for the entire clip. Knees on the dirt, torso upright, but he does NOT rise, does NOT stand, does NOT get up. Only his ARMS and HANDS move toward the bar.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue."""

PROMPT_C = """Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style -- flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

SECONDS 0 TO 2: Camera HOLDS STEADY. Villagers CONVERGE from the edges of the frame toward the center -- the elder with white beard SHUFFLES FORWARD from the left, two young men STRIDE IN from the right, women with children PRESS CLOSER from the background. They form a TIGHTENING CIRCLE around the boy and the iron bar.

SECONDS 2 TO 4: The circle is NOW COMPLETE -- at least 8 villagers STAND shoulder to shoulder, ALL FACING INWARD. The boy at the center REACHES FORWARD with both hands toward the iron bar lying on the ground. His fingers STRETCH OPEN. Every villager FREEZES, watching. One man SHAKES his head in doubt. Another woman CLASPS her hands together.

SECONDS 4 TO 5: Camera TIGHTENS on the boy and the bar. His hands GRIP the iron bar firmly. He PLANTS his knees wider in the dirt. His shoulders SQUARE. The circle of villagers HOLDS STILL, breathless. The massive baobab TOWERS behind them all.

COLOR GRADE: warm sepia, aged paper, ochre earth, sienna shadows, cream highlights.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue."""

CLIPS = {
    "A": {
        "image": IMG_DIR / "scene3-clipA-rage.png",
        "prompt": PROMPT_A,
        "output": CLIP_DIR / "scene3-clipA-rage-5s.mp4",
    },
    "B": {
        "image": IMG_DIR / "scene3-clipB-forgeron.png",
        "prompt": PROMPT_B,
        "output": CLIP_DIR / "scene3-clipB-forgeron-5s.mp4",
    },
    "C": {
        "image": IMG_DIR / "scene3-clipC-cercle.png",
        "prompt": PROMPT_C,
        "output": CLIP_DIR / "scene3-clipC-cercle-5s.mp4",
    },
}


def generate_clip(clip_id: str):
    clip = CLIPS[clip_id]
    print(f"\n{'='*60}")
    print(f"CLIP {clip_id}: {clip['image'].name}")
    print(f"Output: {clip['output'].name}")
    print(f"{'='*60}")

    # Check if output already exists
    if clip["output"].exists():
        print(f"  OUTPUT ALREADY EXISTS. Skipping. Delete to regenerate.")
        return True

    # Upload image
    print(f"\n  Step 1: Upload image...")
    image_url = upload_image_to_fal(clip["image"])

    # Submit and wait using fal_client
    print(f"\n  Step 2: Submit Seedance i2v 5s and wait...")

    def on_queue_update(update):
        if hasattr(update, "logs") and update.logs:
            for log in update.logs:
                print(f"  [log] {log.get('message', log)}")
        if hasattr(update, "status"):
            print(f"  Status: {update.status}")

    try:
        result = fal_client.subscribe(
            "bytedance/seedance-2.0/image-to-video",
            arguments={
                "image_url": image_url,
                "prompt": clip["prompt"],
                "duration": 5,
                "aspect_ratio": "9:16",
                "seed": 42,
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )
    except Exception as e:
        print(f"  FAILED: {e}")
        return False

    if not result:
        print(f"  FAILED: No result returned")
        return False

    # Download video
    video_url = result.get("video", {}).get("url", "")
    if not video_url:
        print(f"  FAILED: No video URL in result")
        print(f"  Result: {json.dumps(result, indent=2)[:500]}")
        return False

    print(f"\n  Step 3: Download video...")
    return download_video(video_url, clip["output"])


def main():
    target = sys.argv[1].upper() if len(sys.argv) > 1 else "ALL"

    CLIP_DIR.mkdir(parents=True, exist_ok=True)

    if target == "ALL":
        clips_to_generate = ["A", "B", "C"]
    elif target in CLIPS:
        clips_to_generate = [target]
    else:
        print(f"Usage: python {sys.argv[0]} [A|B|C|all]")
        sys.exit(1)

    results = {}
    for clip_id in clips_to_generate:
        success = generate_clip(clip_id)
        results[clip_id] = success
        if not success:
            print(f"\n  Clip {clip_id} FAILED. Stopping to avoid wasting budget.")
            break

    print(f"\n{'='*60}")
    print("RESULTS:")
    for clip_id, success in results.items():
        print(f"  Clip {clip_id}: {'OK' if success else 'FAILED'}")
    remaining = [c for c in ["A", "B", "C"] if c not in results]
    if remaining:
        print(f"  Not attempted: {', '.join(remaining)}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
