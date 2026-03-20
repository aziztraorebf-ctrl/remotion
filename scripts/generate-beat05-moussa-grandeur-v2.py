"""
Beat05 Plan 1 — Mansa Moussa — Grandeur Reveal v2 — 10s
Mouvement valide : Crane Up + Dolly Out (v1 approuve)
Ajouts : 2 clignements, mains sur accoudoirs, robe qui fremit
Source : mansa-moussa-fullshot.png
Modele : V3 Pro, cfg_scale 0.35, 10s
Output : public/assets/geoafrique/beat05-moussa-grandeur-v2.mp4
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import fal_client
import base64
import urllib.request

load_dotenv(Path(__file__).parent.parent / ".env")

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-fullshot.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-moussa-grandeur-v2.mp4"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Majestic crane up combined with slow dolly out. "
    "Camera rises steadily while pulling back to reveal the full scale of the throne room. "
    "Palace floor, ornate steps, and geometric carpet expand into view as camera retreats. "
    "Mansa Moussa remains perfectly sovereign and static on his throne throughout. "
    "Two slow deliberate eye blinks spaced apart. "
    "Fingers grip the throne armrests slowly and deliberately. "
    "Subtle robe fabric movement — gentle breeze causes slight ripple at the hem. "
    "Flat 2D graphic style preserved throughout — no morphing, no distortion, no photorealism. "
    "Gold crown and emerald green robe colors remain stable. Architectural lines stay straight. "
    "No camera shake. Smooth continuous movement."
)

NEGATIVE_PROMPT = (
    "text, watermark, photorealistic skin, 3D rendering, camera shake, "
    "fast movement, multiple people, blur, character morphing, face distortion, smile"
)


def upload_image(path: Path) -> str:
    with open(path, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def generate():
    print("=== Beat05 Plan 1 — Grandeur Reveal v2 — 10s ===")
    print(f"Source : {SOURCE_PATH}")

    image_url = upload_image(SOURCE_PATH)

    result = fal_client.subscribe(
        "fal-ai/kling-video/v3/pro/image-to-video",
        arguments={
            "prompt": PROMPT,
            "negative_prompt": NEGATIVE_PROMPT,
            "image_url": image_url,
            "duration": "10",
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
