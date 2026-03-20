"""
Test arc camera Kling V3 Pro — Hannibal vivid shape
3 variantes en parallele : arc lent / arc moyen / arc rapide 360
Image source : tmp/brainstorm/references/hannibal-recraft-vivid-endframe.png
"""

import os
import time
import threading
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")
os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

IMAGE_PATH = Path(__file__).parent.parent / "tmp/brainstorm/references/hannibal-recraft-vivid-endframe.png"
OUTPUT_DIR = Path(__file__).parent.parent / "tmp/brainstorm"

VARIANTS = [
    {
        "name": "arc-slow",
        "output": "hannibal-arc-slow.mp4",
        "prompt": (
            "Slow cinematic orbit shot, camera slowly arcs 90 degrees around Hannibal from behind, "
            "revealing his face and the vast army stretching to the horizon. "
            "Smooth, deliberate camera movement. "
            "Hannibal stands still, surveying his army with calm authority. "
            "Snow particles drift gently. Wind moves his cape softly. "
            "Flat illustrated vivid style fully preserved throughout."
        ),
        "negative_prompt": (
            "fast movement, shaky camera, rapid pan, style change, photorealistic, "
            "morphing, distortion, text, watermark"
        ),
    },
    {
        "name": "arc-medium",
        "output": "hannibal-arc-medium.mp4",
        "prompt": (
            "Dynamic cinematic arc shot, camera sweeps 180 degrees around Hannibal at medium speed, "
            "starting behind him and rotating to reveal his profile then the full army panorama. "
            "The army silhouettes fill both sides of frame as the camera sweeps. "
            "Hannibal raises his fist toward the horizon as camera completes the arc. "
            "Moderate camera speed, cinematic momentum. "
            "Flat illustrated vivid style fully preserved throughout."
        ),
        "negative_prompt": (
            "very slow movement, still camera, style change, photorealistic, "
            "morphing, distortion, text, watermark"
        ),
    },
    {
        "name": "arc-fast-360",
        "output": "hannibal-arc-fast-360.mp4",
        "prompt": (
            "Epic fast 360 degree arc shot, camera rapidly orbits Hannibal in a full circle, "
            "army visible all around as silhouettes stretching to the mountains. "
            "Fast sweeping camera motion, slight motion blur on the background. "
            "Hannibal stands proud at center, cape billowing dramatically. "
            "The speed of the arc conveys the scale and power of the moment. "
            "Flat illustrated vivid style fully preserved, clean graphic shapes throughout."
        ),
        "negative_prompt": (
            "slow camera, still shot, photorealistic, morphing, distortion, "
            "style change, text, watermark"
        ),
    },
]


def upload_image(path: Path) -> str:
    print(f"Uploading: {path.name} ({path.stat().st_size // 1024} KB)...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), "image/png")
    print(f"Uploaded: {url}")
    return url


def generate_variant(variant: dict, image_url: str) -> None:
    name = variant["name"]
    output_path = OUTPUT_DIR / variant["output"]

    print(f"\n[{name}] Submitting job...")

    arguments = {
        "image_url": image_url,
        "prompt": variant["prompt"],
        "negative_prompt": variant["negative_prompt"],
        "duration": "5",
        "aspect_ratio": "16:9",
        "cfg_scale": 0.5,
    }

    handler = fal_client.submit(
        "fal-ai/kling-video/v3/pro/image-to-video",
        arguments=arguments,
    )
    request_id = handler.request_id
    print(f"[{name}] Job ID: {request_id}")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/v3/pro/image-to-video",
            request_id,
            with_logs=False,
        )
        status_type = type(status).__name__
        print(f"[{name}] {status_type}")

        if status_type == "Completed":
            break
        elif status_type == "Failed":
            print(f"[{name}] ERROR: {status}")
            return

        time.sleep(15)

    result = fal_client.result("fal-ai/kling-video/v3/pro/image-to-video", request_id)
    video_url = result.get("video", {}).get("url", "")

    if not video_url:
        print(f"[{name}] ERROR: No video URL")
        return

    print(f"[{name}] Downloading to {output_path.name}...")
    urllib.request.urlretrieve(video_url, output_path)
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"[{name}] Done: {output_path.name} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    image_url = upload_image(IMAGE_PATH)

    print(f"\nLaunching 3 variants in parallel...\n")

    threads = []
    for variant in VARIANTS:
        t = threading.Thread(target=generate_variant, args=(variant, image_url))
        t.start()
        threads.append(t)
        time.sleep(2)

    for t in threads:
        t.join()

    print("\n=== All 3 variants done ===")
    print("Results:")
    for v in VARIANTS:
        p = OUTPUT_DIR / v["output"]
        if p.exists():
            print(f"  {v['name']}: {p} ({p.stat().st_size / (1024*1024):.1f} MB)")
        else:
            print(f"  {v['name']}: FAILED")
