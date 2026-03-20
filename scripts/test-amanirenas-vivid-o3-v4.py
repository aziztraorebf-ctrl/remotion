"""
Kling O3 -- Amanirenas v6 -- OPTION SURE : Orbite 180 (recommandation Gemini Kling Director)
Strategie : orbite cinematique stable autour de la reine, armee revelee en arriere-plan
cfg_scale 0.35 (plus bas = plus de liberte de mouvement)
Valide sur Hannibal (meme technique, 9.5/10 Kimi)
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

START_PATH   = REF_DIR / "amanirenas-startframe-v2-clean.png"
END_PATH     = REF_DIR / "amanirenas-endframe-v4-silhouette.png"
PORTRAIT_REF = REF_DIR / "amanirenas-portrait-REF-CANONICAL.png"
WARRIOR_REF  = REF_DIR / "amanirenas-warrior-type-REF-canonical.png"

OUTPUT = Path(__file__).parent.parent / "tmp/brainstorm/amanirenas-o3-v6-orbit.mp4"

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

    start_url    = upload(START_PATH, "start frame v2 clean")
    end_url      = upload(END_PATH, "end frame v4 silhouette")
    portrait_url = upload(PORTRAIT_REF, "@Element1 portrait")
    warrior_url  = upload(WARRIOR_REF, "@Element2 warrior")

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Shot 1 (0s-10s): Cinematic 180-degree orbit rotation around @Element1. "
            "The camera moves in a smooth semi-circle, revealing @Element2 army of Nubian warriors in the background. "
            "Her crown and scarred right eye remain the focal point throughout. "
            "Flat vector illustration style preserved. "
            "Golden desert and orange sun remain static in the far distance. "
            "Substantial breathing motion in her white robes. "
            "No morphing, no 3D rendering. Flat graphic style preserved throughout."
        ),
        "negative_prompt": (
            "photorealistic, 3d render, "
            "open right eye, both eyes open, facial symmetry, "
            "perspective distortion, blurry background, shaky cam, "
            "morphing shapes, style drift, text, watermark"
        ),
        "elements": [
            {"frontal_image_url": portrait_url, "reference_image_urls": []},
            {"frontal_image_url": warrior_url, "reference_image_urls": []},
        ],
        "duration": "10",
        "aspect_ratio": "9:16",
        "cfg_scale": 0.35,
    }

    print(f"\n=== Kling O3 -- Amanirenas v6 ORBIT ===")
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
