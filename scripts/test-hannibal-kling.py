"""
Test animation Kling V3 Pro — Hannibal dans les Alpes
Image source : tmp/brainstorm/04b-hannibal-alps-v2.png
Modele : V3 Pro, 5s, 16:9
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

IMAGE_PATH = Path(__file__).parent.parent / "tmp/brainstorm/04b-hannibal-alps-v2.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-v3pro-5s.mp4"


def upload_image(path: Path) -> str:
    print(f"Uploading: {path.name} ({path.stat().st_size // 1024} KB)...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), "image/png")
    print(f"Uploaded: {url}")
    return url


def generate_clip(image_url: str) -> str | None:
    print("\n=== Kling V3 Pro — Hannibal Alps ===")

    arguments = {
        "image_url": image_url,
        "prompt": (
            "Slow cinematic push in with slight left rotation, entering the scene. "
            "Hannibal slowly turns his head toward the distant horizon, eyes scanning with determination. "
            "His purple cape whips and billows in the fierce mountain wind. "
            "Visible cold breath vapor from his mouth in the freezing air. "
            "The war elephant behind him exhales a slow breath of steam from its trunk, head sways gently. "
            "Snow falls steadily, a gust sweeps fine snow off the ground. "
            "Background soldiers remain dark silhouettes, still. "
            "Epic, slow, cinematic — the calm before a historic crossing. "
            "Semi-realistic illustrated style fully preserved."
        ),
        "negative_prompt": (
            "raised arms, arms wide open, prophetic pose, charging elephant, "
            "fast movement, shaking camera, rapid zoom, "
            "soldiers running, battle action, "
            "morphing faces, distorted features, style change, photorealistic, "
            "text, watermark, bright flash"
        ),
        "duration": "5",
        "aspect_ratio": "16:9",
        "cfg_scale": 0.45,
    }

    print("Submitting job...")
    handler = fal_client.submit(
        "fal-ai/kling-video/v3/pro/image-to-video",
        arguments=arguments,
    )

    request_id = handler.request_id
    print(f"Job ID: {request_id}")
    print("Waiting (~2-3 min)...")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/v3/pro/image-to-video",
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

    result = fal_client.result("fal-ai/kling-video/v3/pro/image-to-video", request_id)
    video_url = result.get("video", {}).get("url", "")

    if not video_url:
        print(f"ERROR: No video URL. Result: {result}")
        return None

    print(f"\nVideo URL: {video_url}")
    print(f"Downloading to: {OUTPUT_PATH}")
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
