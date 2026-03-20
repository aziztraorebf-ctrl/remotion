"""
Test Kling V3 Standard — Hannibal Alpes cold palette crane-up
Source : hannibal-recraft-frame-01.png (menthe + bleu marine + blanc)
Mouvement : camera part du personnage, monte, revele montagnes + elephant + armee
Spec : cfg 0.35, V3 Standard, 8s
"""

import os
import time
import urllib.request
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")
os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

SOURCE_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-recraft-frame-01.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/hannibal-cold-craneup-v1.mp4"


def main():
    print("=== Hannibal Alpes Cold — Crane-Up V3 Standard ===\n")

    print(f"Upload: {SOURCE_PATH.name} ({SOURCE_PATH.stat().st_size // 1024} KB)...")
    start_url = fal_client.upload_file(str(SOURCE_PATH))
    print(f"URL: {start_url}\n")

    arguments = {
        "image_url": start_url,
        "prompt": (
            "Camera starts at the general's torso level, looking up slightly. "
            "Slow, majestic crane-up movement — camera rises steadily upward. "
            "As camera rises, it reveals the vast snowy mountain range behind the figure, "
            "then the elephant on the right becomes visible, "
            "then the two soldiers on the left appear fully in frame. "
            "The general's cape billows gently in the cold alpine wind. "
            "Bold flat vector graphic style fully preserved throughout. "
            "Mint green and navy blue palette. Crisp geometric shapes. "
            "Epic, commanding, cinematic feel."
        ),
        "negative_prompt": (
            "photorealistic, 3D render, style change, realistic shading, "
            "fast movement, shaking camera, morphing, distorted shapes, "
            "text, watermark, color drift, warm tones, gold, orange"
        ),
        "duration": "8",
        "aspect_ratio": "16:9",
        "cfg_scale": 0.35,
    }

    print("Submitting to Kling V3 Standard...")
    handler = fal_client.submit(
        "fal-ai/kling-video/v3/standard/image-to-video",
        arguments=arguments,
    )
    request_id = handler.request_id
    print(f"Job ID: {request_id}")
    print("Waiting (~3-4 min)...\n")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/v3/standard/image-to-video",
            request_id,
            with_logs=False,
        )
        status_type = type(status).__name__
        print(f"  {status_type}")
        if status_type == "Completed":
            break
        elif status_type == "Failed":
            print(f"  ERROR: {status}")
            return
        time.sleep(15)

    result = fal_client.result("fal-ai/kling-video/v3/standard/image-to-video", request_id)
    video_url = result.get("video", {}).get("url", "")

    if not video_url:
        print(f"ERROR: No video URL. Result: {result}")
        return

    print(f"\nVideo URL: {video_url}")
    urllib.request.urlretrieve(video_url, OUTPUT_PATH)
    size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
    print(f"Saved: {OUTPUT_PATH} ({size_mb:.1f} MB)")
    subprocess.run(["open", str(OUTPUT_PATH)], check=False)
    print("\n=== Done ===")


if __name__ == "__main__":
    main()
