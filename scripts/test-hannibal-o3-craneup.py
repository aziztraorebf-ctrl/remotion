import os
import fal_client
import urllib.request
import time
from pathlib import Path

START_PATH = "tmp/brainstorm/hannibal-chain-frame-01-marching.png"
END_PATH = "tmp/brainstorm/hannibal-chain-frame-02-craneup-end.png"
OUTPUT_PATH = Path("tmp/brainstorm/hannibal-craneup-chain-v1.mp4")

print("Uploading start frame...")
start_url = fal_client.upload_file(START_PATH)
print(f"Start: {start_url}")

print("Uploading end frame...")
end_url = fal_client.upload_file(END_PATH)
print(f"End: {end_url}")

arguments = {
    "image_url": start_url,
    "tail_image_url": end_url,
    "prompt": (
        "Camera slowly cranes upward revealing the full scale of Hannibal's vast army marching through the snowy Alps. "
        "Soldiers march in unison on both sides of the central path. "
        "Camera rises steadily from ground level behind Hannibal to high aerial view. "
        "Snow falls gently throughout. "
        "Flat 2D bold graphic style fully preserved — navy blue soldiers, purple cape, mint green sky. "
        "Smooth continuous upward camera motion, no cuts, no style drift."
    ),
    "negative_prompt": (
        "photorealistic, 3D render, style change, realistic shading, "
        "fast movement, shaking camera, morphing shapes, "
        "distorted figures, extra elements, text, watermark, "
        "color palette change, style drift, rotation, spin"
    ),
    "duration": "10",
    "aspect_ratio": "9:16",
    "cfg_scale": 0.3,
}

print("Submitting to Kling O3...")
handler = fal_client.submit(
    "fal-ai/kling-video/o3/standard/image-to-video",
    arguments=arguments,
)

request_id = handler.request_id
print(f"Job ID: {request_id}")
print("Waiting (~4-5 min)...")

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
        exit(1)
    time.sleep(15)

result = fal_client.result("fal-ai/kling-video/o3/standard/image-to-video", request_id)
video_url = result.get("video", {}).get("url", "")

if not video_url:
    print(f"ERROR: No video URL. Result: {result}")
    exit(1)

print(f"\nVideo URL: {video_url}")
urllib.request.urlretrieve(video_url, str(OUTPUT_PATH))
size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
print(f"Saved: {OUTPUT_PATH} ({size_mb:.1f} MB)")
