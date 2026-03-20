"""
Beat02 — Kling O3 regeneration a 12s
Start frame : beat04-name-scene-v2.png (roi sur trone plan large — identique au clip actuel)
End frame   : beat02-endframe-westlook-v3.png (roi profil gauche, regard vers l'ouest)
Duree       : 12s (beat empire = 12.08s)
cfg_scale   : 0.4
Output      : beat02-o3-westlook-v1.mp4
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

START_IMAGE = ASSETS_DIR / "beat04-name-scene-v2.png"
END_IMAGE = ASSETS_DIR / "beat02-endframe-westlook-v3.png"
OUTPUT = ASSETS_DIR / "beat02-o3-westlook-v1.mp4"

PROMPT = (
    "The camera slowly dollies in toward the king seated on his golden throne. "
    "As the camera moves closer, the king slowly turns his head to look to his left — "
    "toward the horizon, as if gazing at a distant ocean. "
    "His expression becomes distant and haunted. Eyes blink once slowly. "
    "Flat 2D vector illustration style preserved throughout. Smooth continuous motion. No text."
)

NEGATIVE_PROMPT = (
    "photorealistic, 3D render, morphing, distorted face, "
    "text, watermark, abrupt jump, flickering, sad tears, crying"
)


def main():
    print("=== Beat02 O3 — roi regarde vers l'ouest (12s) ===\n")

    print("Upload start frame (roi sur trone)...")
    start_url = fal_client.upload_file(str(START_IMAGE))
    print(f"  start: {start_url}")

    print("Upload end frame (profil gauche, regard horizon)...")
    end_url = fal_client.upload_file(str(END_IMAGE))
    print(f"  end:   {end_url}")

    print("\nLancement generation (12s, cfg 0.4)...")
    result = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": start_url,
            "end_image_url": end_url,
            "prompt": PROMPT,
            "negative_prompt": NEGATIVE_PROMPT,
            "duration": "12",
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
