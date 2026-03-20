"""
Beat02 — Kling O3 start+end frame
Start : abou-bakari-roi-cropped.png (plan large, face camera, immobile)
End   : abou-bakari-roi-endframe-v1.png (close-up, tete tournee gauche, regard horizon)
Objectif : zoom-in cinematique + pivot tete + clignements naturels 10s
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
CHARS_DIR = ASSETS_DIR / "characters"
OUTPUT_PATH = ASSETS_DIR / "beat02-o3-zoomin-v1.mp4"

os.environ["FAL_KEY"] = os.getenv("FAL_KEY")


def upload(path: str, label: str) -> str:
    print(f"  Uploading {label}...")
    url = fal_client.upload_file(str(path))
    print(f"  URL: {url}")
    return url


def run_kling_o3(start_url: str, end_url: str) -> str:
    print("\n=== Kling O3 — Beat02 zoom-in + pivot tete ===")

    result = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": start_url,
            "end_image_url": end_url,
            "prompt": (
                "The West African king sits on his golden throne, radiating absolute authority. "
                "The camera slowly zooms in toward his face — a smooth, steady cinematic push-in. "
                "As the camera approaches, his head turns gradually to the left, "
                "his gaze fixing on the distant horizon with iron determination. "
                "Natural eye blinks during the movement. Subtle chest breathing throughout. "
                "Flat 2D vector illustration style preserved. Golden spotlight steady. "
                "The movement ends with a close-up on his face and shoulders, "
                "head in 3/4 profile, eyes locked on something beyond the frame."
            ),
            "negative_prompt": (
                "photorealistic, 3D render, morphing, style drift, "
                "animated corners, moving decorations, fabric flapping, "
                "text, watermark, background change, shaky camera"
            ),
            "duration": "10",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
        },
    )

    print(f"  Job ID: {result.request_id}")
    print("  Polling every 15s...")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/o3/standard/image-to-video",
            result.request_id,
            with_logs=False,
        )
        state = status.status if hasattr(status, "status") else type(status).__name__
        print(f"  Status: {state}")

        if "Completed" in state or "completed" in state.lower():
            break
        if "Failed" in state or "failed" in state.lower():
            print("  FAILED")
            return None

        time.sleep(15)

    final = fal_client.result(
        "fal-ai/kling-video/o3/standard/image-to-video",
        result.request_id,
    )
    video_url = final.get("video", {}).get("url") or final.get("video_url")

    if not video_url:
        print(f"  ERROR: no video URL — {final}")
        return None

    print(f"  Video URL: {video_url}")
    resp = requests.get(video_url, timeout=120)
    OUTPUT_PATH.write_bytes(resp.content)
    size_mb = len(resp.content) / (1024 * 1024)
    print(f"  Downloaded: {OUTPUT_PATH} ({size_mb:.1f} MB)")
    return str(OUTPUT_PATH)


def main():
    print("=== Beat02 — Kling O3 zoom-in + pivot tete ===\n")

    start_url = upload(str(CHARS_DIR / "abou-bakari-roi-cropped.png"), "start frame (plan large)")
    end_url = upload(str(CHARS_DIR / "abou-bakari-roi-endframe-v1.png"), "end frame (close-up tete tournee)")

    video_path = run_kling_o3(start_url, end_url)

    if video_path:
        print(f"\nSUCCES : {video_path}")
        import subprocess
        subprocess.run(["open", video_path], check=False)
    else:
        print("\nECHEC")


if __name__ == "__main__":
    main()
