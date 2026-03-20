"""
Beat01 — Kling O3 image-to-video start+end frame
Start : beat01-v5.png (Afrique entiere, vue de l'espace)
End   : beat01-endframe-v5.png (Afrique Ouest zoomee, halo dore)
Objectif : dolly in cinematique 10s vers l'Afrique de l'Ouest
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
OUTPUT_PATH = ASSETS_DIR / "beat01-o3-dollyin-v1.mp4"

os.environ["FAL_KEY"] = os.getenv("FAL_KEY")


def upload(path: str, label: str) -> str:
    print(f"  Uploading {label}...")
    url = fal_client.upload_file(path)
    print(f"  URL: {url}")
    return url


def run_kling_o3(start_url: str, end_url: str) -> str:
    print("\n=== Kling O3 start+end frame — Beat01 dolly in ===")

    result = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": start_url,
            "end_image_url": end_url,
            "prompt": (
                "Slow cinematic dolly in from space descending toward West Africa. "
                "The camera moves steadily closer, the African continent grows larger and fills the frame. "
                "Flat 2D vector illustration style preserved throughout. "
                "The golden atmospheric glow at the horizon intensifies as we approach. "
                "Smooth, continuous motion. No cuts. No text."
            ),
            "negative_prompt": (
                "photorealistic, 3D render, morphing continents, distorted borders, "
                "text, watermark, abrupt jump, flickering, stars multiplying"
            ),
            "duration": "10",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
        },
    )

    print(f"  Job submitted. Request ID: {result.request_id}")
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
            print("  ERROR: Job failed")
            return None

        time.sleep(15)

    final = fal_client.result(
        "fal-ai/kling-video/o3/standard/image-to-video",
        result.request_id,
    )
    video_url = final.get("video", {}).get("url") or final.get("video_url")

    if not video_url:
        print(f"  ERROR: No video URL in result: {final}")
        return None

    print(f"  Video URL: {video_url}")

    resp = requests.get(video_url, timeout=120)
    OUTPUT_PATH.write_bytes(resp.content)
    size_mb = len(resp.content) / (1024 * 1024)
    print(f"  Downloaded: {OUTPUT_PATH} ({size_mb:.1f} MB)")
    return str(OUTPUT_PATH)


def main():
    print("=== Beat01 — Kling O3 dolly in test ===\n")

    print("=== Upload des images ===")
    start_url = upload(str(ASSETS_DIR / "beat01-v5.png"), "start frame (Afrique entiere)")
    end_url = upload(str(ASSETS_DIR / "beat01-endframe-v5.png"), "end frame (Afrique Ouest zoomee)")

    video_path = run_kling_o3(start_url, end_url)

    if video_path:
        print(f"\nSUCCES : {video_path}")
        import subprocess
        subprocess.run(["open", video_path], check=False)
    else:
        print("\nECHEC : verifier les logs ci-dessus")


if __name__ == "__main__":
    main()
