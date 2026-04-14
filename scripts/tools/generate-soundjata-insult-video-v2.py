"""
Generate Soundjata insult clip v2 — Seedance 2.0 image-to-video.
Fixes v1 :
  - "cueillir" -> "aller chercher" (prononciation simple)
  - Background anime (silhouettes marchent, feuilles bougent, poussiere flotte)
"""

import json
import os
import pathlib
import sys
import time
import urllib.request

import fal_client
from dotenv import load_dotenv

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT / ".env")

OUTPUT_DIR = ROOT / "tmp" / "soundjata-insult"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

STARTING_POSE = ROOT / "tmp" / "heros-oublies-styleref" / "soundjata-insult-starting-pose-styleref.png"

ENDPOINT = "bytedance/seedance-2.0/image-to-video"

PROMPT = """2D vivid flat illustration style, bold black outlines, warm ochre and indigo palette, serious historical graphic novel aesthetic. No text, no banners, no signs, no writing visible anywhere. No unnecessary 360-degree turns. Without motion distortion. The human body structure is normal.

Two West African women face to face in 13th century Manden village. LEFT woman Sogolon in turquoise wrap and turban. RIGHT woman rival wife in indigo and ochre patterned wrap with dark blue turban, right arm extended pointing at Sogolon's face.

SECONDS 0 TO 2: Steady medium-wide shot, both women in frame. Rival wife's mouth OPENS, finger HOLDS steady toward Sogolon, lips MOVING as she speaks in French: "Au moins mon fils peut aller chercher des feuilles de baobab." Sogolon's chin LIFTS slightly, eyes NARROW, jaw CLENCHES. BACKGROUND: two village silhouettes WALK slowly past the distant huts, one carries a woven basket on her head. Baobab leaves RUSTLE gently in a warm breeze.

SECONDS 2 TO 4: Camera holds steady. Rival wife continues: "Le tien ne sait meme pas se lever." Her lip CURLS in contempt. Sogolon's LEFT hand CLENCHES into a fist, breath CATCHES. BACKGROUND: red dust DRIFTS across the ground, heat haze SHIMMERS above the distant huts.

SECONDS 4 TO 5: Rival wife's arm LOWERS slowly to her side, expression settling into cold satisfaction. Sogolon stands motionless, head high. BACKGROUND silhouettes continue walking away.

COLOR GRADE: warm ochre earth, indigo and turquoise wraps vivid, amber midday light, red laterite dust."""


def upload(path: pathlib.Path) -> str:
    print(f"Uploading {path.name} ({path.stat().st_size // 1024}KB)...")
    url = fal_client.upload_file(str(path))
    print(f"  -> {url[:80]}...")
    return url


def download(url: str, dest: pathlib.Path) -> pathlib.Path:
    print(f"Downloading to {dest.name}...")
    urllib.request.urlretrieve(url, dest)
    print(f"  -> {dest} ({dest.stat().st_size // 1024}KB)")
    return dest


def main():
    if not STARTING_POSE.exists():
        print(f"ERROR: Starting pose image not found: {STARTING_POSE}")
        sys.exit(1)

    if not os.getenv("FAL_KEY"):
        print("ERROR: FAL_KEY not set in .env")
        sys.exit(1)

    print("=" * 60)
    print("Soundjata insult clip v2 — Seedance 2.0 i2v")
    print("=" * 60)
    print(f"Fixes : cueillir -> aller chercher, background anime")
    print(f"Prompt chars: {len(PROMPT)}")
    print("=" * 60)

    image_url = upload(STARTING_POSE)

    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": "5",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
    }

    print("\nSubmitting request to fal.ai...")
    start = time.time()

    handler = fal_client.submit(ENDPOINT, arguments=args)
    request_id = handler.request_id
    print(f"Request ID: {request_id}")

    while True:
        status = fal_client.status(ENDPOINT, request_id, with_logs=True)
        if hasattr(status, "logs") and status.logs:
            for log in status.logs:
                msg = log.get("message", "") if isinstance(log, dict) else str(log)
                if msg:
                    print(f"  [log] {msg}")
        if type(status).__name__ == "Completed":
            break
        time.sleep(5)

    result = fal_client.result(ENDPOINT, request_id)
    elapsed = time.time() - start
    print(f"\nDone in {elapsed:.1f}s")

    video_url = result.get("video", {}).get("url")
    if not video_url:
        print("ERROR: No video URL in result")
        print(json.dumps(result, indent=2))
        sys.exit(1)

    output_video = OUTPUT_DIR / "soundjata-insult-v2.mp4"
    download(video_url, output_video)

    print("\n" + "=" * 60)
    print(f"OK: {output_video}")
    print("=" * 60)


if __name__ == "__main__":
    main()
