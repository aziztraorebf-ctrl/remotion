"""
Beat05 Plan 1 — Mansa Moussa portrait — Kling V3 Pro
Dolly in lent + clignement lent + respiration
Start frame : mansa-moussa-v3c.png
End frame   : mansa-moussa-v3c-endframe.png
Duree       : 5s (Plan 1 sur 13.4s total)
Output      : public/assets/geoafrique/beat05-moussa-v1.mp4
"""

import os
import time
import base64
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")

START_FRAME = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c.png"
END_FRAME   = Path(__file__).parent.parent / "public/assets/geoafrique/characters/mansa-moussa-v3c-endframe.png"
OUTPUT_PATH = Path(__file__).parent.parent / "public/assets/geoafrique/beat05-moussa-v1.mp4"
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Shot 1 (0s-5s): Slow optical zoom in towards the face of Mansa Moussa. "
    "Intense cold royal gaze fills the frame. One slow deliberate eye blink. "
    "Subtle chest breathing motion. Figure remains static. "
    "Flat graphic style preserved throughout. No morphing, no distortion. "
    "Gold tones remain stable."
)

NEGATIVE_PROMPT = (
    "text, watermark, photorealistic skin, 3D rendering, camera shake, "
    "fast movement, multiple people, background figures, blur"
)


def upload_image(path: Path) -> str:
    with open(path, "rb") as f:
        data = f.read()
    b64 = base64.b64encode(data).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def generate():
    print("=== Beat05 Plan 1 — Mansa Moussa — Kling V3 Pro ===")
    print(f"Start frame : {START_FRAME}")
    print(f"End frame   : {END_FRAME}")
    print(f"Prompt      : {PROMPT}")

    start_url = upload_image(START_FRAME)
    end_url   = upload_image(END_FRAME)

    result = fal_client.subscribe(
        "fal-ai/kling-video/v3/pro/image-to-video",
        arguments={
            "prompt": PROMPT,
            "negative_prompt": NEGATIVE_PROMPT,
            "image_url": start_url,
            "tail_image_url": end_url,
            "duration": "5",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
        },
        with_logs=True,
        on_queue_update=lambda update: print(f"  [{update.status}]") if hasattr(update, "status") else None,
    )

    video_url = result["video"]["url"]
    print(f"Video URL: {video_url}")

    import urllib.request
    urllib.request.urlretrieve(video_url, OUTPUT_PATH)
    size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
    print(f"Saved: {OUTPUT_PATH} ({size_mb:.1f} MB)")
    return str(OUTPUT_PATH)


if __name__ == "__main__":
    path = generate()
    if path:
        import subprocess
        subprocess.run(["open", path], check=False)
