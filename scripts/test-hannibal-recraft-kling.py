"""
Test Kling V3 Standard — Hannibal Recraft V3 vivid_shapes PNG
But : voir comment Kling anime le style flat vector
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

IMAGE_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-recraft-v3-vivid.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-recraft-kling-5s.mp4"


def upload_image(path: Path) -> str:
    print(f"Uploading: {path.name} ({path.stat().st_size // 1024} KB)...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), "image/png")
    print(f"Uploaded: {url}")
    return url


def generate_clip(image_url: str) -> str | None:
    print("\n=== Kling V3 Standard — Hannibal Recraft flat style ===")

    arguments = {
        "image_url": image_url,
        "prompt": (
            "Slow epic pan from left to right across the mountain pass. "
            "Hannibal stands still, cape flows gently in the cold wind. "
            "The elephant takes one slow step forward. "
            "Snow falls steadily. "
            "Flat 2D illustrated style fully preserved — no photorealism, no style change. "
            "Bold flat shapes stay clean and graphic."
        ),
        "negative_prompt": (
            "photorealistic, 3D render, style change, realistic shading, "
            "fast movement, shaking camera, morphing shapes, "
            "distorted figures, extra elements, text, watermark"
        ),
        "duration": "5",
        "aspect_ratio": "16:9",
        "cfg_scale": 0.4,
    }

    print("Submitting job...")
    handler = fal_client.submit(
        "fal-ai/kling-video/v3/standard/image-to-video",
        arguments=arguments,
    )

    request_id = handler.request_id
    print(f"Job ID: {request_id}")
    print("Waiting...")

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
            return None
        time.sleep(15)

    result = fal_client.result("fal-ai/kling-video/v3/standard/image-to-video", request_id)
    video_url = result.get("video", {}).get("url", "")

    if not video_url:
        print(f"ERROR: No video URL. Result: {result}")
        return None

    print(f"\nVideo URL: {video_url}")
    urllib.request.urlretrieve(video_url, OUTPUT_PATH)
    size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
    print(f"Saved: {OUTPUT_PATH} ({size_mb:.1f} MB)")
    return str(OUTPUT_PATH)


if __name__ == "__main__":
    image_url = upload_image(IMAGE_PATH)
    clip_path = generate_clip(image_url)
    if clip_path:
        print(f"\n=== Done: {clip_path} ===")
        subprocess.run(["open", clip_path], check=False)
    else:
        print("\n=== FAILED ===")
