"""
Kling O3 -- Amanirenas armee apparait -- avec ELEMENTS
Correction du defaut clips V2A/V2B : guerrieres qui derivent semi-realiste sur clips longs.

Technique : start+end frame + elements (portrait Amanirenas + guerriere type Meroe)
Endpoint  : fal-ai/kling-video/o3/standard/image-to-video
Ref valide : test-hannibal-elements-v1.py (9.5/10 Kimi, technique prouvee)

@Element1 = portrait Amanirenas vivid_shapes REF
@Element2 = guerriere Meroe de dos, palette desert/or/terracotta
"""

import os
import time
import urllib.request
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")
os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

START_PATH    = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-recraft-vivid-startframe.png"
END_PATH      = Path(__file__).parent.parent / "tmp/brainstorm/amanirenas-vivid-endframe-v2.png"
PORTRAIT_REF  = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-portrait-vivid-REF.png"
WARRIOR_REF   = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-warrior-type-REF.png"
OUTPUT        = Path(__file__).parent.parent / "tmp/brainstorm/amanirenas-elements-v1.mp4"

ENDPOINT = "fal-ai/kling-video/o3/standard/image-to-video"


def upload(path: Path, label: str) -> str:
    print(f"Uploading {label}...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), "image/png")
    print(f"  -> {url}")
    return url


if __name__ == "__main__":
    for p in [START_PATH, END_PATH, PORTRAIT_REF, WARRIOR_REF]:
        if not p.exists():
            print(f"ERROR: Missing asset: {p}")
            exit(1)

    start_url    = upload(START_PATH, "start frame")
    end_url      = upload(END_PATH, "end frame")
    portrait_url = upload(PORTRAIT_REF, "Amanirenas portrait REF (@Element1)")
    warrior_url  = upload(WARRIOR_REF, "warrior type REF (@Element2)")

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Camera stays completely static throughout. No camera movement whatsoever. "
            "@Element1 stands at the front center, spear raised high, back to camera. "
            "Royal headdress and golden cape visible from behind. "
            "Warriors gradually emerge and march in from both sides of the frame, filling the flanks. "
            "All @Element2 warriors face forward toward the horizon -- backs visible, same direction as @Element1. "
            "Dark silhouettes with ochre/brown shields, identical style to @Element1. "
            "The army materializes progressively from both edges toward the center. "
            "Sun blazes over the desert horizon. "
            "Flat 2D bold graphic style fully preserved -- dark warrior silhouettes, gold and terracotta palette, warm sky. "
            "No style drift, no camera movement, no angle change, no semi-realistic drift on warriors."
        ),
        "negative_prompt": (
            "camera movement, zoom, pan, tilt, crane, pull back, push in, orbit, rotation, "
            "warriors facing sideways, warriors facing camera, profile view of warriors, "
            "photorealistic, 3D render, style change, realistic shading, fabric texture, detailed clothing, "
            "morphing shapes, distorted figures, text, watermark, color palette change, style drift, "
            "pale skin, white warriors, grey warriors, light colored silhouettes, "
            "cold colors, blue tones, snow, mountains, Alpine landscape"
        ),
        "elements": [
            {
                "frontal_image_url": portrait_url,
                "reference_image_urls": [],
            },
            {
                "frontal_image_url": warrior_url,
                "reference_image_urls": [],
            },
        ],
        "duration": "10",
        "aspect_ratio": "9:16",
        "cfg_scale": 0.45,
    }

    print(f"\n=== Kling O3 + elements -- Amanirenas armee v1 ===")
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
    subprocess.run(["open", str(OUTPUT)], check=False)
