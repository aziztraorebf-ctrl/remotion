"""
Beat04 — Kling O3 v2
Source : beat04-source-v6.png (pleine mer, rameurs assis, bras roi le long du corps)
Duration : 15s, cfg_scale 0.4
Corrections v2 : mouvement lent, pas de zoom rapide
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
SOURCE     = ASSETS_DIR / "beat04-source-v6.png"
OUT        = ASSETS_DIR / "beat04-kling-v2.mp4"


def main():
    if not SOURCE.exists():
        print(f"ERREUR: image source introuvable — {SOURCE}")
        sys.exit(1)

    print(f"Upload: {SOURCE}")
    image_url = fal_client.upload_file(str(SOURCE))
    print(f"URL: {image_url}")

    print("\nSoumission Kling O3 v2 (15s, mouvement lent)...")

    handler = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": image_url,
            "prompt": (
                "Shot 1 (0-6s): The fleet is already at sea. "
                "Slow steady rowing motion. Oars dip in and out of the dark water rhythmically. "
                "The King stands still at the bow, motionless, watching the horizon. "
                "Camera stays close, gentle rocking of the boats on calm ocean waves. "
                "Shot 2 (6-11s): Very slow smooth Dolly Out. "
                "More pirogues become visible on both sides, all rowing in the same direction. "
                "The fleet grows larger as the camera retreats. "
                "All rowers seated, paddling at a slow deliberate pace. "
                "Shot 3 (11-15s): Slow continued Dolly Out to wide shot. "
                "The King's boat is now a small figure leading a vast fleet across the black Atlantic. "
                "Stars reflected faintly on the water. Peaceful, solemn, inevitable."
            ),
            "negative_prompt": (
                "fast zoom, rapid camera movement, shaking camera, "
                "raised arms, standing passengers, shore, beach, sand, land, "
                "text, watermark, spotlight, light beam, bright colors, "
                "morphing faces, distorted boats, white sails"
            ),
            "duration": "15",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
        }
    )

    print(f"Job soumis. Request ID: {handler.request_id}")
    print("Attente 120s...")
    time.sleep(120)

    result = fal_client.result("fal-ai/kling-video/o3/standard/image-to-video", handler.request_id)

    video_url = result["video"]["url"]
    print(f"\nVideo: {video_url}")
    print(f"Telechargement vers {OUT}...")
    urllib.request.urlretrieve(video_url, OUT)
    print(f"\nDone: {OUT}")
    print("A valider par Aziz avant integration.")


if __name__ == "__main__":
    main()
