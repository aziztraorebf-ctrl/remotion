"""
Generate Scene 5A clip (6s) via fal.ai Seedance 2.0 image-to-video.
Source: last frame of scene 4 (Sunjata standing with bent iron bar).
Audio: generate_audio=True for keep-and-duck ambient mix.
"""

import os
import sys
import time
import base64
import json
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

os.environ["FAL_KEY"] = os.environ["FAL_KEY"]

PROJECT_DIR = Path(__file__).resolve().parents[2] / "sonjata-papercraft"
SOURCE_IMAGE = PROJECT_DIR / "images" / "scene5a-source.png"
OUTPUT_CLIP = PROJECT_DIR / "clips-production" / "scene5a-barre-arc-6s.mp4"
OUTPUT_META = PROJECT_DIR / "clips-production" / "scene5a-barre-arc-6s.meta.json"
OUTPUT_PROMPT = PROJECT_DIR / "clips-production" / "scene5a-barre-arc.prompt.txt"

PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY: maintain the exact visual style - flat 2D paper-craft, warm sepia palette, simple character shapes with dot-eyes, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

Camera holds STEADY with a very SUBTLE slow push-in on the young boy at center. No pan, no zoom out.

SECONDS 0 TO 3: The villagers around the boy STEP BACK half a step in shock. Hands rise toward mouths. Dust particles drift in the warm golden light. The boy HOLDS the bent iron bar above his head, arms TREMBLING slightly from the effort. His chest rises and falls with deep breaths.

SECONDS 3 TO 6: The boy's expression SHIFTS from fierce effort to calm determination. He LOWERS the bent iron bar slightly, still gripped in both hands. Villagers remain FROZEN in awe. Baobab leaves rustle gently in the background.

The iron bar REMAINS BENT in an arc - RIGID, NON-DEFORMING, length stays CONSTANT throughout. Villagers have DISTINCT faces, no two alike. No child moves in unnatural ways.

Warm golden afternoon light, sepia paper-craft palette, dust particles floating. Ambient village atmosphere: soft gasps of amazement, whispered murmurs of awe, light breeze rustling leaves, distant bird calls. No music, no words, no dialogue. No text, no banners, no signs, no writing visible anywhere."""


def upload_image(path: Path) -> str:
    """Upload image to fal.ai storage and return URL."""
    print(f"Uploading source image: {path.name}")
    url = fal_client.upload_file(str(path))
    print(f"  -> {url}")
    return url


def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(f"  [seedance] {log['message']}")


def main():
    if not SOURCE_IMAGE.exists():
        print(f"ERROR: source image not found: {SOURCE_IMAGE}")
        sys.exit(1)

    OUTPUT_CLIP.parent.mkdir(parents=True, exist_ok=True)

    print(f"Prompt length: {len(PROMPT)} chars")
    print(f"Duration: 6s")
    print(f"Audio: ENABLED (keep-and-duck)")
    print(f"Cost estimate: $1.81")
    print()

    # Upload image to fal storage
    image_url = upload_image(SOURCE_IMAGE)

    # Submit Seedance i2v job
    print("\nSubmitting Seedance i2v...")
    start_time = time.time()

    result = fal_client.subscribe(
        "fal-ai/bytedance/seedance/v1/pro/image-to-video",
        arguments={
            "prompt": PROMPT,
            "image_url": image_url,
            "resolution": "1080p",
            "duration": "6",
            "camera_fixed": False,
            "seed": 42,
            "enable_safety_checker": True,
            "generate_audio": True,
        },
        with_logs=True,
        on_queue_update=on_queue_update,
    )

    elapsed = time.time() - start_time
    print(f"\nDone in {elapsed:.0f}s")
    print(f"Result: {result}")

    # Download video
    video_url = result["video"]["url"]
    print(f"\nDownloading: {video_url}")
    import urllib.request
    urllib.request.urlretrieve(video_url, OUTPUT_CLIP)
    size_mb = OUTPUT_CLIP.stat().st_size / (1024 * 1024)
    print(f"Saved: {OUTPUT_CLIP} ({size_mb:.1f} MB)")

    # Save prompt
    OUTPUT_PROMPT.write_text(PROMPT)

    # Save metadata
    meta = {
        "scene": "5A",
        "title": "Barre en arc + village muet",
        "duration_s": 6,
        "source_image": str(SOURCE_IMAGE.relative_to(PROJECT_DIR)),
        "tool": "fal.ai Seedance 2.0 i2v",
        "cost_usd": 1.81,
        "video_url": video_url,
        "audio_enabled": True,
        "elapsed_s": elapsed,
        "seed": 42,
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"Meta: {OUTPUT_META}")

    print("\nScene 5A clip generated successfully.")


if __name__ == "__main__":
    main()
