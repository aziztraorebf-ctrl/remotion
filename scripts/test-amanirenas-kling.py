"""
Kling O3 -- Amanirenas v9 -- THE DESERT SPEAR (Gemini Kling Director)
Dolly-In + flanking formation + buffer central anti-collision
Sol propre (v3-sol + v5-sol), cfg_scale 0.35 (anti-style-drift)
Portrait v4-patch : oeil droit = patch cuir opaque (non-animable)
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

START_PATH   = REF_DIR / "amanirenas-startframe-v3-sol.png"
END_PATH     = REF_DIR / "amanirenas-endframe-v5-sol.png"
PORTRAIT_REF = REF_DIR / "amanirenas-portrait-REF-v4-patch.png"
WARRIOR_REF  = REF_DIR / "amanirenas-warrior-type-REF-canonical.png"

OUTPUT = Path(__file__).parent.parent / "tmp/brainstorm/amanirenas-o3-v9-desert-spear.mp4"
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

    start_url    = upload(START_PATH, "start frame")
    end_url      = upload(END_PATH, "end frame")
    portrait_url = upload(PORTRAIT_REF, "@Element1 portrait")
    warrior_url  = upload(WARRIOR_REF, "@Element2 warrior")

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Shot 1 (0s-10s): Cinematic optical dolly in towards @Element1. "
            "The Queen exhibits a subtle fierce micro-expression: a slight twitch of the left eyebrow "
            "and a firm set of the jaw, showing breathing motion. "
            "Her right eye is covered by a dark leather eye patch, completely opaque. She does not blink. "
            "In the background, @Element2 silhouettes of Nubian warriors emerge from the far left and right edges, "
            "marching forward in a flanking formation on the golden sand, never crossing the center. "
            "Flat graphic style, navy and gold palette. No morphing, no 3D rendering."
        ),
        "negative_prompt": (
            "eye patch moving, removing eye patch, eye patch disappearing, both eyes open, blinking, smiling, talking, "
            "fluid liquid floor, water, river, waves, wet sand, "
            "warriors merging, warriors crossing center, "
            "3d shading, realistic skin, eye symmetry, motion blur, "
            "photorealistic, style drift, text, watermark"
        ),
        "elements": [
            {"frontal_image_url": portrait_url, "reference_image_urls": []},
            {"frontal_image_url": warrior_url, "reference_image_urls": []},
        ],
        "duration": "10",
        "aspect_ratio": "9:16",
        "cfg_scale": 0.35,
    }

    print(f"\n=== Kling O3 -- Amanirenas v9 DESERT SPEAR ===")
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
