"""
Beat01 — Kling O3 test v2 — deux variantes en parallele
B : horizon rasant (narratif fort)
C : globe incline (coherence style)
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv
import threading

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
os.environ["FAL_KEY"] = os.getenv("FAL_KEY")

START_IMAGE = ASSETS_DIR / "beat01-v5.png"

VARIANTS = [
    {
        "label": "B — horizon rasant",
        "end_image": ASSETS_DIR / "beat01-endframe-pan-B.png",
        "output": ASSETS_DIR / "beat01-o3-pan-B.mp4",
        "prompt": (
            "The camera slowly pans westward from the African continent toward the vast Atlantic Ocean. "
            "The horizon line becomes prominent — a thin golden line cutting across the frame. "
            "The African coast slides to the right as the empty dark ocean fills the center. "
            "Flat 2D vector illustration style preserved. Smooth continuous motion. No text."
        ),
    },
    {
        "label": "C — globe incline",
        "end_image": ASSETS_DIR / "beat01-endframe-pan-C.png",
        "output": ASSETS_DIR / "beat01-o3-pan-C.mp4",
        "prompt": (
            "The globe slowly rotates westward, revealing the vast Atlantic Ocean. "
            "The African continent drifts to the right as the dark ocean fills the frame. "
            "Same flat 2D globe-from-space style preserved throughout. "
            "The golden atmospheric halo remains at the bottom. Smooth continuous rotation. No text."
        ),
    },
]


def upload(path: str, label: str) -> str:
    print(f"  Uploading {label}...")
    url = fal_client.upload_file(str(path))
    print(f"  URL: {url}")
    return url


def run_variant(variant: dict, start_url: str):
    print(f"\n=== Lancement {variant['label']} ===")

    end_url = upload(variant["end_image"], f"end frame {variant['label']}")

    result = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": start_url,
            "end_image_url": end_url,
            "prompt": variant["prompt"],
            "negative_prompt": (
                "photorealistic, 3D render, morphing, distorted borders, "
                "text, watermark, abrupt jump, flickering"
            ),
            "duration": "10",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
        },
    )

    print(f"  [{variant['label']}] Job ID: {result.request_id}")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/o3/standard/image-to-video",
            result.request_id,
            with_logs=False,
        )
        state = status.status if hasattr(status, "status") else type(status).__name__
        print(f"  [{variant['label']}] Status: {state}")

        if "Completed" in state or "completed" in state.lower():
            break
        if "Failed" in state or "failed" in state.lower():
            print(f"  [{variant['label']}] FAILED")
            return

        time.sleep(15)

    final = fal_client.result(
        "fal-ai/kling-video/o3/standard/image-to-video",
        result.request_id,
    )
    video_url = final.get("video", {}).get("url") or final.get("video_url")

    if not video_url:
        print(f"  [{variant['label']}] ERROR: no video URL — {final}")
        return

    resp = requests.get(video_url, timeout=120)
    variant["output"].write_bytes(resp.content)
    size_mb = len(resp.content) / (1024 * 1024)
    print(f"  [{variant['label']}] DONE: {variant['output']} ({size_mb:.1f} MB)")

    import subprocess
    subprocess.run(["open", str(variant["output"])], check=False)


def main():
    print("=== Beat01 O3 — test variantes B et C en parallele ===\n")

    print("Upload start frame...")
    start_url = upload(START_IMAGE, "start frame (Afrique entiere)")

    threads = []
    for v in VARIANTS:
        t = threading.Thread(target=run_variant, args=(v, start_url))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print("\n=== Toutes les generations terminees ===")


if __name__ == "__main__":
    main()
