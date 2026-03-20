"""
Test Kling O3 — Amanirenas vivid_shapes start+end frame v2b
Start : amanirenas-vivid-startframe.png  (de face, pyramides, armee en bas)
End   : amanirenas-vivid-endframe-v2.png (de face, lance levee, armee encadrant)
Corrections v2b : 8s (5s trop court), endframe-v2, cfg 0.3 (anti-morphing max), upload_file
"""

import os
import time
import subprocess
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")
os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

BRAINSTORM = Path(__file__).parent.parent / "tmp/brainstorm"
START_PATH  = BRAINSTORM / "amanirenas-vivid-startframe.png"
END_PATH    = BRAINSTORM / "amanirenas-vivid-endframe-v2.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/amanirenas-o3-vivid-8s-v1.mp4"


def upload(path: Path) -> str:
    print(f"Upload: {path.name} ({path.stat().st_size // 1024} KB)...")
    url = fal_client.upload_file(str(path))
    print(f"  -> {url}")
    return url


def main():
    print("=== Amanirenas O3 vivid_shapes — 8s orbit v2b ===\n")

    start_url = upload(START_PATH)
    end_url   = upload(END_PATH)

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Slow, majestic cinematic orbit around the queen. "
            "Camera begins facing the queen directly — she stands tall holding her spear, "
            "pyramids rising behind her, army stretching to the horizon. "
            "Camera rotates 180 degrees around her in a smooth, steady arc. "
            "As the orbit progresses, more of her army is revealed flanking her. "
            "She raises her spear triumphantly as the camera completes the arc. "
            "Bold flat vector graphic style fully preserved. "
            "Bright gold and deep navy palette. Geometric shapes, no fine details. "
            "Epic, commanding, documentary feel."
        ),
        "negative_prompt": (
            "photorealistic, 3D, realistic shading, style change, "
            "fast movement, shaking camera, morphing, distorted figures, "
            "text, watermark, pale skin, European features, style drift"
        ),
        "duration": "8",
        "aspect_ratio": "9:16",
        "cfg_scale": 0.3,
    }

    print("\nSubmitting to Kling O3 Standard...")
    handler = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments=arguments,
    )
    request_id = handler.request_id
    print(f"Job ID: {request_id}")
    print("Waiting (~4-5 min)...\n")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/o3/standard/image-to-video",
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

    result = fal_client.result("fal-ai/kling-video/o3/standard/image-to-video", request_id)
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
