"""
Beat04 — Kling O3 image-to-video, shots structures dans le prompt
Source : beat04-source-v4.png (image unique, pas de end frame)
Duration : 15s (couvre beat name 14.4s)
cfg_scale : 0.4
"""

import os
import sys
import time
import urllib.request
import pathlib
import fal_client
from dotenv import load_dotenv

load_dotenv(pathlib.Path(__file__).parent.parent / ".env")

ASSETS_DIR = pathlib.Path("public/assets/geoafrique")
SOURCE     = ASSETS_DIR / "beat04-source-v4.png"
OUT        = ASSETS_DIR / "beat04-kling-v1.mp4"


def main():
    if not SOURCE.exists():
        print(f"ERREUR: image source introuvable — {SOURCE}")
        sys.exit(1)

    print(f"Upload image source: {SOURCE}")
    image_url = fal_client.upload_file(str(SOURCE))
    print(f"URL: {image_url}")

    print("\nSoumission job Kling O3 (3 shots, 15s)...")

    handler = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": image_url,
            "prompt": (
                "Shot 1 (0-5s): Medium shot from behind the King. "
                "The pirogue pushes off from the shore and begins moving across the dark ocean. "
                "The wooden boat rocks gently on the water. Sailors on the side boats row steadily. "
                "Shot 2 (5-10s): Slow continuous Dolly Out. "
                "More of the dark ocean becomes visible. "
                "Dozens of other pirogues emerge from the darkness, forming a growing fleet sailing west. "
                "Shot 3 (10-15s): Extreme wide Dolly Out. "
                "The King's boat leads a massive fleet across the black Atlantic under a starry night sky. "
                "Ships spread across the ocean. The shore is gone. The King is a small silhouette at the front."
            ),
            "negative_prompt": (
                "text, watermark, label, photorealistic, 3D render, "
                "morphing faces, distorted boats, spotlight, light beam, "
                "bright colors, gold trail, calm static water"
            ),
            "duration": "15",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
        }
    )

    print(f"Job soumis. Request ID: {handler.request_id}")
    print("Attente 120s avant premier poll...")
    time.sleep(120)

    result = fal_client.result("fal-ai/kling-video/o3/standard/image-to-video", handler.request_id)

    video_url = result["video"]["url"]
    print(f"\nVideo generee: {video_url}")
    print(f"Telechargement vers {OUT}...")
    urllib.request.urlretrieve(video_url, OUT)
    print(f"\nDone: {OUT}")
    print("A valider par Aziz avant integration dans AbouBakariShort.tsx")


if __name__ == "__main__":
    main()
