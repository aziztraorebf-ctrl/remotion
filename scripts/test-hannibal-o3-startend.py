"""
Test Kling O3 Standard — start+end frame
Start : Hannibal de face, vivid_shapes V3 (hannibal-recraft-v3-vivid.png)
End   : Hannibal de dos regardant l'armee (hannibal-recraft-endframe-v1.png)
But   : voir si O3 interpole proprement entre les deux frames sans morphing
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

START_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-recraft-v3-vivid.png"
END_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-recraft-endframe-v1.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-o3-startend-5s.mp4"


def upload_image(path: Path, mime: str = "image/png") -> str:
    print(f"Uploading: {path.name} ({path.stat().st_size // 1024} KB)...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), mime)
    print(f"Uploaded: {url}")
    return url


def generate_clip(start_url: str, end_url: str) -> str | None:
    print("\n=== Kling O3 Standard — Hannibal start+end frame ===")

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Slow cinematic rotation around Hannibal. "
            "Camera slowly orbits from his front face to his back, "
            "revealing the vast Alpine landscape and his army spread below. "
            "Cape flows gently in cold wind. "
            "Snow falls steadily. "
            "Flat 2D bold graphic style fully preserved throughout — no photorealism, no style drift. "
            "Smooth continuous motion, no cuts."
        ),
        "negative_prompt": (
            "photorealistic, 3D render, style change, realistic shading, "
            "fast movement, shaking camera, morphing shapes, "
            "distorted figures, extra elements, text, watermark, "
            "color palette change, green tint, style drift"
        ),
        "duration": "5",
        "aspect_ratio": "16:9",
        "cfg_scale": 0.35,
    }

    print("Submitting job...")
    handler = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments=arguments,
    )

    request_id = handler.request_id
    print(f"Job ID: {request_id}")
    print("Waiting (~3-4 min)...")

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
    end_url = upload_image(END_PATH)
    clip_path = generate_clip(start_url, end_url)
    if clip_path:
        print(f"\n=== Done: {clip_path} ===")
        subprocess.run(["open", clip_path], check=False)
    else:
        print("\n=== FAILED ===")
