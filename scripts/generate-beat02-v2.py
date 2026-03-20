"""
Beat02 — Kling V3 standard image-to-video, 10s
Image source : abou-bakari-roi-plan-large-REF.png (roi sur trone, flat design, fond noir)
Objectif : breathing cinematique, regard vers l'horizon, 10s pour couvrir 13s beat sans freeze
Regle : V3 cfg 0.35 = standard pour personnages flat design (valide Beat02 session 5)
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
OUTPUT_PATH = ASSETS_DIR / "beat02-v2-10s.mp4"

os.environ["FAL_KEY"] = os.getenv("FAL_KEY")


def upload(path: str, label: str) -> str:
    print(f"  Uploading {label}...")
    url = fal_client.upload_file(str(path))
    print(f"  URL: {url}")
    return url


def run_kling(image_url: str) -> str:
    print("\n=== Kling V3 — Beat02 roi sur trone 10s ===")

    result = fal_client.submit(
        "fal-ai/kling-video/v3/standard/image-to-video",
        arguments={
            "image_url": image_url,
            "prompt": (
                "The West African king sits motionless on his golden throne, radiating absolute authority. "
                "Subtle cinematic breathing — chest rises and falls slowly. "
                "Eyes open, calm and powerful, gaze directed slightly toward the horizon. "
                "The golden spotlight from above glows steadily. "
                "Flat 2D vector illustration style preserved throughout. "
                "No movement except the breathing. Background remains locked matte black."
            ),
            "negative_prompt": (
                "photorealistic, 3D render, morphing, head tilt, sad expression, "
                "melancholic, particles, text, watermark, background change, "
                "realistic skin texture, floating elements"
            ),
            "duration": "10",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.35,
        },
    )

    print(f"  Job ID: {result.request_id}")
    print("  Polling every 15s...")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/v3/standard/image-to-video",
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
        "fal-ai/kling-video/v3/standard/image-to-video",
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
    print("=== Beat02 — Kling V3 roi sur trone 10s ===\n")

    image_url = upload(
        str(ASSETS_DIR / "characters/abou-bakari-roi-plan-large-REF.png"),
        "abou-bakari-roi-plan-large-REF.png"
    )

    video_path = run_kling(image_url)

    if video_path:
        print(f"\nSUCCES : {video_path}")
        import subprocess
        subprocess.run(["open", video_path], check=False)
    else:
        print("\nECHEC")


if __name__ == "__main__":
    main()
