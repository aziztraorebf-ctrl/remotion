"""
Peste 1347 — Test B : Kling O3 Nano Banana (start + end frame)
Start : peste-scene-start-frame.png
End   : peste-scene-end-frame-v1.webp (zoom in 15%, memes personnages)
Objectif : zoom controle vers personnage central, style preserve
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/peste-pixel"
OUTPUT_PATH = ASSETS_DIR / "peste-test-B-kling-o3-nanobana.mp4"

os.environ["FAL_KEY"] = os.getenv("FAL_KEY")


def upload(path: str, label: str) -> str:
    print(f"  Uploading {label}...")
    url = fal_client.upload_file(str(path))
    print(f"  URL: {url}")
    return url


def run_kling_o3(start_url: str, end_url: str) -> str:
    print("\n=== Kling O3 Nano Banana — Peste scene dolly in ===")

    result = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": start_url,
            "end_image_url": end_url,
            "prompt": (
                "Medieval plague town square, flat design illustration. "
                "Very slow cinematic dolly in toward the central standing figure in brown tunic. "
                "The three characters stay in place — distressed man left, calm young man center, grieving woman right. "
                "Dust particles float in the air. Rats on ground barely move. "
                "Sepia and ochre tones preserved. Parchment texture preserved. "
                "Flat 2D illustration style throughout. Smooth continuous motion. No cuts. No text."
            ),
            "negative_prompt": (
                "photorealistic, 3D, morphing, style change, color change, "
                "distorted figures, text, watermark, fast motion, jump cut"
            ),
            "duration": "5",
            "aspect_ratio": "16:9",
            "cfg_scale": 0.5,
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
    print("=== Test B — Kling O3 Nano Banana — Peste scene ===\n")
    start_url = upload(str(ASSETS_DIR / "peste-scene-start-frame.png"), "start frame")
    end_url = upload(str(ASSETS_DIR / "peste-scene-end-frame-v1.webp"), "end frame (zoom in)")
    video_path = run_kling_o3(start_url, end_url)

    if video_path:
        print(f"\nSUCCES : {video_path}")
        import subprocess
        subprocess.run(["open", video_path], check=False)
    else:
        print("\nECHEC : verifier les logs ci-dessus")


if __name__ == "__main__":
    main()
