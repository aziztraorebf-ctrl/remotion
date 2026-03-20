"""
Kling O3 — Hannibal elements v2
Test : bouclier rond via prompt + negative_prompt renforce
Seul changement vs v1 : "round circular shields" dans prompt + "square shield" dans negative
"""

import os
import time
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")
os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

START_PATH   = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-solo-alpes-start.png"
END_PATH     = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-army-reveal-D.png"
HANNIBAL_REF = Path(__file__).parent.parent / "tmp/brainstorm/references/hannibal-portrait-REF-CANONICAL.png"
SOLDIER_REF  = Path(__file__).parent.parent / "tmp/brainstorm/references/hannibal-soldier-type-REF.png"
OUTPUT       = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-elements-v2.mp4"

ENDPOINT = "fal-ai/kling-video/o3/standard/image-to-video"


def upload(path: Path, label: str) -> str:
    print(f"Uploading {label}...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), "image/png")
    print(f"  -> {url}")
    return url


if __name__ == "__main__":
    start_url    = upload(START_PATH, "start frame")
    end_url      = upload(END_PATH, "end frame")
    hannibal_url = upload(HANNIBAL_REF, "Hannibal REF (@Element1)")
    soldier_url  = upload(SOLDIER_REF, "soldier REF (@Element2)")

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Camera stays completely static throughout. No camera movement whatsoever. "
            "@Element1 stands alone at the front, facing the Alps, back to camera. "
            "Purple cape flows in the cold wind. "
            "Soldiers gradually emerge and march in from behind the camera, filling the frame on both sides. "
            "All @Element2 soldiers face forward toward the Alps — backs visible, same direction as @Element1. "
            "Navy/black silhouettes with ROUND CIRCULAR shields held on left arm, identical style to @Element1. "
            "Each soldier carries a round circular shield — perfectly circular, like the reference image. "
            "The army materializes progressively — columns forming on each side of the central path. "
            "Snow falls gently. "
            "Flat 2D bold graphic style fully preserved — navy blue soldiers, round purple shields, purple cape, mint green sky. "
            "No style drift, no camera movement, no angle change, no semi-realistic drift on soldiers."
        ),
        "negative_prompt": (
            "camera movement, zoom, pan, tilt, crane, pull back, push in, orbit, rotation, "
            "soldiers facing sideways, soldiers facing camera, profile view of soldiers, "
            "photorealistic, 3D render, style change, realistic shading, fabric texture, detailed clothing, "
            "morphing shapes, distorted figures, text, watermark, color palette change, style drift, "
            "white soldiers, grey soldiers, light colored silhouettes, realistic skin, "
            "square shield, rectangular shield, oval shield, oblong shield"
        ),
        "elements": [
            {
                "frontal_image_url": hannibal_url,
                "reference_image_urls": [],
            },
            {
                "frontal_image_url": soldier_url,
                "reference_image_urls": [],
            },
        ],
        "duration": "10",
        "aspect_ratio": "9:16",
        "cfg_scale": 0.45,
    }

    print(f"\n=== Kling O3 + elements v2 — test bouclier rond ===")
    handler = fal_client.submit(ENDPOINT, arguments=arguments)
    req_id = handler.request_id
    print(f"Job ID: {req_id}")
    print("Waiting (~5-6 min)...")

    while True:
        status = fal_client.status(ENDPOINT, req_id, with_logs=False)
        stype = type(status).__name__
        print(f"  {stype}")
        if stype == "Completed":
            break
        elif stype == "Failed":
            print(f"FAILED: {status}")
            exit(1)
        time.sleep(15)

    result = fal_client.result(ENDPOINT, req_id)
    video_url = result.get("video", {}).get("url", "")

    if not video_url:
        print(f"ERROR: No video URL. Result: {result}")
        exit(1)

    urllib.request.urlretrieve(video_url, str(OUTPUT))
    size_mb = OUTPUT.stat().st_size / (1024 * 1024)
    print(f"\nSaved: {OUTPUT} ({size_mb:.1f} MB)")
    import subprocess
    subprocess.run(["open", str(OUTPUT)], check=False)
