"""
Beat06 Obsession — Kling V1.5 Standard via fal.ai, camera locked, cfg 0.3
Source : beat06-obsession-source-v2.png
Output : public/assets/geoafrique/beat06-obsession-v1.mp4
"""

import os
import base64
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat06-obsession-source-v2.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat06-obsession-v1.mp4"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Cinematic static locked shot. Absolutely no camera movement whatsoever. "
    "The silhouette of a crowned king stands in profile on the right, gazing west into the void. "
    "Inside the silhouette, ocean waves have a very slow hypnotic undulating motion. "
    "Subtle atmospheric dust particles drift slowly across the dark starry sky. "
    "The golden horizon line remains perfectly still and sharp. "
    "The dark ocean in the lower left is calm with barely perceptible surface shimmer. "
    "2D flat graphic style. Deep ink blacks, navy blues, golden accents. "
    "No morphing. No style drift. No camera movement."
)

NEGATIVE_PROMPT = (
    "camera movement, zoom, pan, tilt, dolly, crane, morphing, style change, "
    "3D effect, realistic skin, photorealism, distortion, text, watermark"
)


def encode_image_to_data_uri(path: Path) -> str:
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:image/png;base64,{data}"


def generate():
    print("=== Beat06 Obsession — Kling V1.5 Standard Locked ===")
    print(f"Source: {SOURCE_PATH}")

    image_url = encode_image_to_data_uri(SOURCE_PATH)

    result = fal_client.subscribe(
        "fal-ai/kling-video/v3/standard/image-to-video",
        arguments={
            "prompt": PROMPT,
            "negative_prompt": NEGATIVE_PROMPT,
            "image_url": image_url,
            "duration": "5",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.3,
        },
        with_logs=True,
        on_queue_update=lambda update: print(f"  [{update.status}]") if hasattr(update, "status") else None,
    )

    video_url = result["video"]["url"]
    print(f"Video URL: {video_url}")

    urllib.request.urlretrieve(video_url, OUTPUT_PATH)
    size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
    print(f"Saved: {OUTPUT_PATH} ({size_mb:.1f} MB)")
    return str(OUTPUT_PATH)


if __name__ == "__main__":
    path = generate()
    if path:
        print("Done.")
