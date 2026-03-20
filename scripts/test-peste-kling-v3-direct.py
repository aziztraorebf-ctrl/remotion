"""
Peste 1347 — Test A : Kling V3 image-to-video direct (sans end frame)
Start : peste-scene-start-frame.png (scene medievale sombre)
Objectif : atmospheriques — dolly in leger + rats qui bougent
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/peste-pixel"
OUTPUT_PATH = ASSETS_DIR / "peste-test-A-kling-v3-direct.mp4"

os.environ["FAL_KEY"] = os.getenv("FAL_KEY")


def upload(path: str, label: str) -> str:
    print(f"  Uploading {label}...")
    url = fal_client.upload_file(path)
    print(f"  URL: {url}")
    return url


def run_kling_v3(start_url: str) -> str:
    print("\n=== Kling V3 direct — Peste scene atmospherique ===")

    result = fal_client.submit(
        "fal-ai/kling-video/v1.6/standard/image-to-video",
        arguments={
            "image_url": start_url,
            "prompt": (
                "Medieval plague town square, flat design illustration. "
                "Slow atmospheric camera — very gentle dolly in toward the central standing figure in brown tunic. "
                "Rats on the ground move slowly and sniff the dirt. "
                "Dust particles float gently in the air. "
                "The grieving woman in black slightly sways. "
                "The distressed man on the left trembles slightly. "
                "Sepia and ochre tones, parchment texture, warm sandy ground. "
                "Flat 2D illustration style preserved throughout. Smooth subtle motion. No cuts. No text."
            ),
            "negative_prompt": (
                "photorealistic, 3D render, morphing shapes, distorted figures, "
                "style change, color change, text, watermark, abrupt movement, fast motion"
            ),
            "duration": "5",
            "aspect_ratio": "16:9",
        },
    )

    print(f"  Job submitted. Request ID: {result.request_id}")
    print("  Polling every 15s...")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/v1.6/standard/image-to-video",
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
        "fal-ai/kling-video/v1.6/standard/image-to-video",
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
    print("=== Test A — Kling V3 direct — Peste scene ===\n")
    start_url = upload(str(ASSETS_DIR / "peste-scene-start-frame.png"), "start frame (scene medievale)")
    video_path = run_kling_v3(start_url)

    if video_path:
        print(f"\nSUCCES : {video_path}")
        import subprocess
        subprocess.run(["open", video_path], check=False)
    else:
        print("\nECHEC : verifier les logs ci-dessus")


if __name__ == "__main__":
    main()
