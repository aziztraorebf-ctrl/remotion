"""
Beat01 — Kling O3 regeneration a 14s
Meme parametres exactement que test-kling-o3-beat01-v2.py variante B
Seul changement : duration 10 -> 14
Output : beat01-o3-pan-B-14s.mp4 (local, ne pas integrer avant validation)
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
os.environ["FAL_KEY"] = os.getenv("FAL_KEY")

START_IMAGE = ASSETS_DIR / "beat01-v5.png"
END_IMAGE = ASSETS_DIR / "beat01-endframe-pan-B.png"
OUTPUT = ASSETS_DIR / "beat01-o3-pan-B-14s.mp4"

PROMPT = (
    "The camera slowly pans westward from the African continent toward the vast Atlantic Ocean. "
    "The horizon line becomes prominent — a thin golden line cutting across the frame. "
    "The African coast slides to the right as the empty dark ocean fills the center. "
    "Flat 2D vector illustration style preserved. Smooth continuous motion. No text."
)

NEGATIVE_PROMPT = (
    "photorealistic, 3D render, morphing, distorted borders, "
    "text, watermark, abrupt jump, flickering"
)


def main():
    print("=== Beat01 O3 — regeneration 14s ===\n")

    print("Upload start frame...")
    start_url = fal_client.upload_file(str(START_IMAGE))
    print(f"  start: {start_url}")

    print("Upload end frame...")
    end_url = fal_client.upload_file(str(END_IMAGE))
    print(f"  end:   {end_url}")

    print("\nLancement generation (14s, cfg 0.4)...")
    result = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": start_url,
            "end_image_url": end_url,
            "prompt": PROMPT,
            "negative_prompt": NEGATIVE_PROMPT,
            "duration": "14",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
        },
    )

    print(f"Job ID: {result.request_id}")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/o3/standard/image-to-video",
            result.request_id,
            with_logs=False,
        )
        state = status.status if hasattr(status, "status") else type(status).__name__
        print(f"Status: {state}")

        if "Completed" in state or "completed" in state.lower():
            break
        if "Failed" in state or "failed" in state.lower():
            print("FAILED")
            return

        time.sleep(15)

    final = fal_client.result(
        "fal-ai/kling-video/o3/standard/image-to-video",
        result.request_id,
    )
    video_url = final.get("video", {}).get("url") or final.get("video_url")

    if not video_url:
        print(f"ERROR: no video URL — {final}")
        return

    resp = requests.get(video_url, timeout=120)
    OUTPUT.write_bytes(resp.content)
    size_mb = len(resp.content) / (1024 * 1024)
    print(f"\nDONE: {OUTPUT.name} ({size_mb:.1f} MB)")

    import subprocess
    subprocess.run(["open", str(OUTPUT)], check=False)


if __name__ == "__main__":
    main()
