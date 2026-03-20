"""
Kling O3 -- Amanirenas crane-up v3
Corrections vs elements-v2 :
  - 2 elements seulement (pas 4) : budget animation preserve
  - Prompt d'action explicite : mouvement concret warriors + reine
  - Endframe v3 : ciel propre sans bandes blanches
  - Zero contradiction dans negative_prompt
  - cfg_scale 0.5 : plus de liberte de mouvement

Technique : test-hannibal-elements-v1.py (9.5/10 Kimi)
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

REF_DIR = Path(__file__).parent.parent / "tmp/brainstorm/references"

START_PATH   = REF_DIR / "amanirenas-startframe-CANONICAL.png"
END_PATH     = REF_DIR / "amanirenas-endframe-v3.png"
PORTRAIT_REF = REF_DIR / "amanirenas-portrait-REF-CANONICAL.png"
WARRIOR_REF  = REF_DIR / "amanirenas-warrior-type-REF-canonical.png"

OUTPUT = Path(__file__).parent.parent / "tmp/brainstorm/amanirenas-o3-v3.mp4"

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

    print("=== Assets OK ===")

    start_url    = upload(START_PATH, "start frame CANONICAL")
    end_url      = upload(END_PATH, "end frame v3 (sky fixed)")
    portrait_url = upload(PORTRAIT_REF, "@Element1 -- Amanirenas portrait CANONICAL")
    warrior_url  = upload(WARRIOR_REF, "@Element2 -- warrior type REF")

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Slow cinematic crane-up: camera starts low at ground level on golden desert sand, "
            "rises steadily upward revealing @Element1 standing tall at center frame. "
            "@Element1 wears white linen robes and a tall red cylindrical crown. "
            "She holds a long spear upright in her right hand. "
            "As the camera rises, @Element2 warriors march in from both sides in formation -- "
            "spears swaying rhythmically as they march, shields moving with their arms. "
            "The warriors stride purposefully forward, bodies in motion, arms swinging. "
            "@Element1 robes ripple gently in the desert wind. "
            "The army fills the frame on both sides as the camera reaches full height. "
            "Large orange sun blazes on the horizon behind Nubian pyramids. "
            "Flat 2D bold graphic illustration style maintained throughout. "
            "Dark navy warrior silhouettes, warm gold desert floor, clean ivory sky."
        ),
        "negative_prompt": (
            "photorealistic, 3D render, semi-realistic shading, detailed musculature, "
            "warriors facing camera, warriors in profile view, "
            "floating weapons, detached spears, duck feet, splayed feet, "
            "morphing shapes, distorted figures, text, watermark, "
            "pale skin, grey silhouettes, light colored warriors, "
            "cold colors, blue sky, snow, mountains, Alpine landscape, "
            "style drift, color palette change, zoom out, pull back"
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
        "cfg_scale": 0.5,
    }

    print(f"\n=== Kling O3 + 2 elements -- Amanirenas crane-up v3 ===")
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

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, str(OUTPUT))
    size_mb = OUTPUT.stat().st_size / (1024 * 1024)
    print(f"\nSaved: {OUTPUT} ({size_mb:.1f} MB)")
    subprocess.run(["open", str(OUTPUT)], check=False)
