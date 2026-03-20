"""
Amanirenas O3 V2A — memes frames, duree 8s
Test : est-ce que 8s seul resout le probleme de remontee des soldats ?
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

START_PATH  = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-recraft-vivid-startframe.png"
END_PATH    = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-recraft-vivid-endframe.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/amanirenas-o3-v2a-8s.mp4"


def upload_image(path: Path) -> str:
    print(f"Uploading: {path.name} ({path.stat().st_size // 1024} KB)...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), "image/png")
    print(f"Uploaded: {url}")
    return url


def generate_clip(start_url: str, end_url: str) -> str | None:
    print("\n=== Amanirenas O3 V2A — 8s, memes frames ===")

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Slow cinematic orbit around the queen. "
            "Camera rotates from her face to her back, "
            "revealing her vast army stretching into the horizon. "
            "She raises her spear high as the camera completes the arc. "
            "Bold flat graphic style fully preserved. "
            "Warm gold and navy palette throughout. "
            "Steady, epic, commanding movement."
        ),
        "negative_prompt": (
            "photorealistic, 3D render, style change, realistic shading, "
            "fast movement, shaking camera, morphing shapes, "
            "distorted figures, text, watermark, style drift, "
            "pale skin, European features"
        ),
        "duration": "8",
        "aspect_ratio": "9:16",
        "cfg_scale": 0.35,
    }

    print("Submitting job...")
    handler = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments=arguments,
    )

    request_id = handler.request_id
    print(f"Job ID: {request_id}")
    print("Waiting...")

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
            return None
        time.sleep(15)

    result = fal_client.result("fal-ai/kling-video/o3/standard/image-to-video", request_id)
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
    start_url = upload_image(START_PATH)
    end_url   = upload_image(END_PATH)
    clip_path = generate_clip(start_url, end_url)
    if clip_path:
        print(f"\n=== Done: {clip_path} ===")
        subprocess.run(["open", clip_path], check=False)
    else:
        print("\n=== FAILED ===")
