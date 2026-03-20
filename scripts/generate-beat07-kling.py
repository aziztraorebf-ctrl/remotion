"""
Beat07 Colomb — Kling V3 Standard via fal.ai
Dolly in lent + derive laterale gauche->droite, cfg 0.3, 5s
Source : beat07-colomb-source-v2.png
Output : public/assets/geoafrique/beat07-colomb-v1.mp4
"""

import os
import base64
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat07-colomb-source-v2.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat07-colomb-v1.mp4"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Slow cinematic dolly in with a subtle left-to-right lateral drift. "
    "The camera advances steadily toward the caravel as it sails right, "
    "closing the distance slowly and mechanically. "
    "The ship grows slightly larger as the camera moves forward. "
    "The grey overcast sky and dark clouds remain static and oppressive. "
    "The ocean waves have a slow rhythmic motion — cold, grey, relentless. "
    "2D flat graphic style preserved throughout. Cold grey-blue palette unchanged. "
    "No warmth, no heroism, no drama — factual and mechanical. "
    "No morphing. No style drift. Smooth continuous movement."
)

NEGATIVE_PROMPT = (
    "warm colors, gold, sunshine, heroic lighting, camera shake, "
    "morphing, style change, 3D effect, photorealism, distortion, "
    "text, watermark, zoom out, crane"
)


def encode_image_to_data_uri(path: Path) -> str:
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:image/png;base64,{data}"


def generate():
    print("=== Beat07 Colomb — Kling V3 Standard Dolly In ===")
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
