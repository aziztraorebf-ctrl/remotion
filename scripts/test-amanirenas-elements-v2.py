"""
Kling O3 -- Amanirenas crane-up reveal armee -- ELEMENTS V2
4 elements : portrait reine + warrior type + hand/shield crop + hand/spear crop

Lecon elements-v1 : mauvaises frames de base (anciennes frames)
Cette version : frames CANONICAL reconstruites de zero (Recraft -> Gemini pipeline)

Elements:
  @Element1 = portrait Amanirenas CANONICAL (pschent rouge + uraeus + oeil blessure)
  @Element2 = guerrier de dos Meroe (silhouette navy, palette desert)
  @Element3 = crop main+bouclier (comment tenir le bouclier)
  @Element4 = crop main+lance (comment tenir la lance)

Technique prouvee : test-hannibal-elements-v1.py (9.5/10 Kimi)
cfg_scale 0.45 + elements = optimal style locking
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

START_PATH      = REF_DIR / "amanirenas-startframe-CANONICAL.png"
END_PATH        = REF_DIR / "amanirenas-endframe-v2.png"
PORTRAIT_REF    = REF_DIR / "amanirenas-portrait-REF-CANONICAL.png"
WARRIOR_REF     = REF_DIR / "amanirenas-warrior-type-REF-canonical.png"
HAND_SHIELD_REF = REF_DIR / "warrior-crop-hand-shield.png"
HAND_SPEAR_REF  = REF_DIR / "warrior-crop-hand-spear.png"

OUTPUT = Path(__file__).parent.parent / "tmp/brainstorm/amanirenas-elements-v2.mp4"

ENDPOINT = "fal-ai/kling-video/o3/standard/image-to-video"


def upload(path: Path, label: str) -> str:
    print(f"Uploading {label}...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), "image/png")
    print(f"  -> {url}")
    return url


if __name__ == "__main__":
    for p in [START_PATH, END_PATH, PORTRAIT_REF, WARRIOR_REF, HAND_SHIELD_REF, HAND_SPEAR_REF]:
        if not p.exists():
            print(f"ERROR: Missing asset: {p}")
            exit(1)

    print("=== Assets OK ===")

    start_url        = upload(START_PATH, "start frame CANONICAL")
    end_url          = upload(END_PATH, "end frame v2")
    portrait_url     = upload(PORTRAIT_REF, "Amanirenas portrait CANONICAL (@Element1)")
    warrior_url      = upload(WARRIOR_REF, "warrior type REF (@Element2)")
    hand_shield_url  = upload(HAND_SHIELD_REF, "hand+shield crop (@Element3)")
    hand_spear_url   = upload(HAND_SPEAR_REF, "hand+spear crop (@Element4)")

    arguments = {
        "image_url": start_url,
        "tail_image_url": end_url,
        "prompt": (
            "Slow crane-up camera movement: camera starts at ground level (feet, golden sand desert floor) "
            "and rises slowly upward, revealing @Element1 standing at center from feet to full body. "
            "As the camera rises, it reveals @Element2 warriors filling both sides of the frame -- "
            "a vast army stretching to the horizon, spears raised, backs toward camera facing the desert. "
            "@Element1 wears white robes, tall red cylindrical crown (pschent), stands upright, "
            "holds a spear in the right hand -- grip style exactly like @Element4. "
            "@Element2 warriors hold round terracotta shields in the left arm -- "
            "shield grip exactly like @Element3 -- and spears upright in the right hand -- "
            "spear grip exactly like @Element4. "
            "Nubian/Meroitic pyramids visible in background, large orange sun blazing on horizon. "
            "Flat 2D bold graphic illustration style preserved throughout. "
            "Dark navy warrior silhouettes, gold desert floor, warm ivory sky. "
            "No style drift. No floating weapons. No duck feet."
        ),
        "negative_prompt": (
            "static camera, no camera movement, "
            "warriors facing camera, warriors in profile, sideways warriors, "
            "photorealistic, 3D render, semi-realistic, detailed shading, fabric texture, "
            "floating spears, detached weapons, duck feet, splayed feet, "
            "morphing shapes, distorted figures, text, watermark, "
            "pale skin, grey silhouettes, light colored warriors, "
            "cold colors, blue tones, snow, mountains, Alpine landscape, "
            "style change, color palette change, style drift"
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
            {
                "frontal_image_url": hand_shield_url,
                "reference_image_urls": [],
            },
            {
                "frontal_image_url": hand_spear_url,
                "reference_image_urls": [],
            },
        ],
        "duration": "10",
        "aspect_ratio": "9:16",
        "cfg_scale": 0.45,
    }

    print(f"\n=== Kling O3 + 4 elements -- Amanirenas crane-up v2 ===")
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
