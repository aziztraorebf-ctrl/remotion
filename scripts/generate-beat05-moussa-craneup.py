"""
Beat05 Plan 1 — Mansa Moussa — Crane Up — prompt seul, pas de end frame
Source : mansa-moussa-v3c-palace.png
Modele : V3 Pro, cfg_scale 0.4, 5s
Output : public/assets/geoafrique/beat05-moussa-craneup-v1.mp4
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import fal_client
import base64
import urllib.request

load_dotenv(Path(__file__).parent.parent / ".env")

SOURCE_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c-palace.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-moussa-craneup-v1.mp4"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Slow crane up movement — camera rises smoothly from chest level to reveal "
    "the full crown and palace arches above. "
    "Mansa Moussa remains seated and static on his throne. "
    "One slow deliberate eye blink. Subtle chest breathing motion. "
    "Flat graphic style preserved throughout. No morphing, no distortion. "
    "Gold tones remain stable. Figure remains static."
)

NEGATIVE_PROMPT = (
    "text, watermark, photorealistic skin, 3D rendering, camera shake, "
    "fast movement, multiple people, blur, zoom in, zoom out"
)


def upload_image(path: Path) -> str:
    with open(path, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def generate():
    print("=== Beat05 Plan 1 — Crane Up — V3 Pro ===")
    print(f"Source : {SOURCE_PATH}")
    print(f"Prompt : {PROMPT}")

    image_url = upload_image(SOURCE_PATH)

    result = fal_client.subscribe(
        "fal-ai/kling-video/v3/pro/image-to-video",
        arguments={
            "prompt": PROMPT,
            "negative_prompt": NEGATIVE_PROMPT,
            "image_url": image_url,
            "duration": "5",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
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
