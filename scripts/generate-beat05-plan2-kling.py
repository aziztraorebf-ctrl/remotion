"""
Beat05 Plan 2 — Caravane — Kling O3 Dolly In
Source : beat05-plan2-caravan-v2.png
Modele : O3 Standard, cfg_scale 0.35, 8s
Output : public/assets/geoafrique/beat05-plan2-caravan-v1.mp4
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import fal_client
import base64
import urllib.request

load_dotenv(Path(__file__).parent.parent / ".env")

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-plan2-caravan-v2.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-plan2-caravan-v1.mp4"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Slow cinematic dolly in. Camera advances steadily toward the caravan, "
    "closing the distance as if joining the procession. "
    "The lead camels and their handlers grow larger as the camera moves forward. "
    "Desert dunes on both sides recede naturally. "
    "The golden sun remains fixed on the horizon, rays spreading outward. "
    "Caravan figures and camels remain perfectly still — no walking animation. "
    "Flat 2D graphic style preserved throughout. No morphing, no distortion. "
    "Colors remain stable — warm gold sun, deep terracotta dunes, dark silhouettes. "
    "Smooth continuous movement. No camera shake."
)

NEGATIVE_PROMPT = (
    "text, watermark, photorealistic, 3D rendering, camera shake, "
    "fast movement, blur, morphing, distortion, walking animation, moving figures"
)


def upload_image(path: Path) -> str:
    with open(path, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def generate():
    print("=== Beat05 Plan 2 — Caravane Dolly In — O3 Standard ===")
    print(f"Source : {SOURCE_PATH}")

    image_url = upload_image(SOURCE_PATH)

    result = fal_client.subscribe(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "prompt": PROMPT,
            "negative_prompt": NEGATIVE_PROMPT,
            "image_url": image_url,
            "duration": "8",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.35,
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
        import subprocess
        subprocess.run(["open", path], check=False)
