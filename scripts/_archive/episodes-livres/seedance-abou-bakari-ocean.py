"""Abou Bakari II — Scene ocean — Seedance 2.0 image-to-video.

Duration : 10s
Endpoint : bytedance/seedance-2.0/image-to-video
Cost est : $3.00
Audio    : generate_audio=True
"""

import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

FAL_KEY = os.environ.get("FAL_KEY", "")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set")
    sys.exit(1)

import fal_client

REPO = Path("/Users/clawdbot/Workspace/remotion")

SOURCE_IMAGE = REPO / "public/assets/abou-bakari/scenes/scene-ocean-v1.png"
OUTPUT_DIR   = REPO / "public/assets/abou-bakari/clips"
OUTPUT_MP4   = OUTPUT_DIR / "ocean-v1.mp4"
OUTPUT_META  = OUTPUT_DIR / "ocean-v1.meta.json"
REQUEST_ID_FILE = OUTPUT_DIR / "ocean-v1.request-id.txt"

ENDPOINT = "bytedance/seedance-2.0/image-to-video"

PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY paper-craft sepia warm palette: maintain flat layered paper silhouettes, muted blue-grey wave bands, sandy shore, no added realism, no texture beyond paper grain.

Camera PUSHES IN steadily toward the lone figure standing at the shoreline, starting from a wide establishing shot and TIGHTENING to a medium shot centered on his profile. Smooth, stable forward motion.

SECONDS 0 TO 3: The lone figure in the short sand-colored tunic STANDS at the water's edge in LEFT-PROFILE, his gaze fixed on the horizon. He BREATHES visibly — chest RISES and FALLS. His arms SHIFT slightly behind his back. The four wave bands ROLL left to right in continuous undulation. The grey fog bank DRIFTS rightward across the upper sky.

SECONDS 3 TO 6: The three silhouette figures in the background LEAN BACK away from the ocean — one RAISES an arm to shield its face, another CROUCHES lower. The lone figure does NOT react to them — he keeps STARING westward, chin LIFTING slightly. Waves continue ROLLING.

SECONDS 6 TO 10: Camera has TIGHTENED to medium profile shot of the lone figure. He INHALES — shoulders RISE — then HOLDS the breath, unmoving but alive. His tunic fabric SHIFTS in wind. The distant horizon fog THICKENS slightly. The baobab on the far right SWAYS at its crown.

COLOR GRADE: muted blue-grey ocean, sandy warm shore, pale white-grey sky — paper-craft sepia palette throughout. No brightening. All characters stay engaged, bodies continuously micro-shifting. No dust motes, no floating particles, no sparkles. No text anywhere.
"""


def submit_and_save_request_id():
    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}")
        sys.exit(1)
    size_kb = SOURCE_IMAGE.stat().st_size // 1024
    print(f"  OK ({size_kb} KB) {SOURCE_IMAGE.name}")

    print("[2/4] Uploading source image to fal.ai CDN...")
    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"  -> {image_url}")

    print("[3/4] Submitting to Seedance 2.0...")
    print(f"  Endpoint   : {ENDPOINT}")
    print(f"  Duration   : 10s")
    print(f"  Aspect     : 9:16")
    print(f"  Resolution : 1080p")
    print(f"  Audio      : generate_audio=True")
    print(f"  Est. cost  : $3.00")

    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": "10",
        "aspect_ratio": "9:16",
        "resolution": "1080p",
        "generate_audio": True,
    }

    handler = fal_client.submit(ENDPOINT, arguments=args)
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    REQUEST_ID_FILE.write_text(
        f"{request_id}\n"
        f"# endpoint: {ENDPOINT}\n"
        f"# image_url: {image_url}\n"
        f"# saved_at: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    )
    print(f"  Request ID saved to: {REQUEST_ID_FILE}")

    return request_id, image_url


def poll_until_complete(request_id):
    print("  Polling for completion...")
    start = time.time()
    last_log = ""
    while True:
        status = fal_client.status(ENDPOINT, request_id, with_logs=False)
        elapsed = int(time.time() - start)
        status_name = type(status).__name__
        if status_name != last_log:
            print(f"    [{elapsed}s] status: {status_name}")
            last_log = status_name
        if status_name == "Completed":
            break
        if elapsed > 600:
            print("  TIMEOUT after 10 min — use --recover mode")
            sys.exit(1)
        time.sleep(5)


def download_and_save(request_id, image_url):
    result = fal_client.result(ENDPOINT, request_id)

    print("[4/4] Downloading video and metadata...")
    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size")
    print(f"  URL  : {video_url}")
    print(f"  Seed : {seed}")
    if file_size:
        print(f"  Size : {file_size} bytes ({file_size/1024/1024:.1f} MB)")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED video: {OUTPUT_MP4}")

    meta = {
        "request_id": request_id,
        "endpoint": ENDPOINT,
        "duration_s": 10,
        "aspect_ratio": "9:16",
        "resolution": "1080p",
        "generate_audio": True,
        "seed": seed,
        "video_url": video_url,
        "file_size": file_size,
        "source_image": SOURCE_IMAGE.name,
        "source_image_url": image_url,
        "prompt": PROMPT,
        "cost_usd_estimate": 3.00,
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"  SAVED meta : {OUTPUT_META}")


def recover_from_request_id():
    if not REQUEST_ID_FILE.exists():
        print(f"ERROR: no request ID file at {REQUEST_ID_FILE}")
        sys.exit(1)
    lines = REQUEST_ID_FILE.read_text().splitlines()
    request_id = lines[0].strip()
    image_url = ""
    for line in lines[1:]:
        if line.startswith("# image_url:"):
            image_url = line.split(":", 1)[1].strip()
            break
    print(f"RECOVER MODE: request_id = {request_id}")
    poll_until_complete(request_id)
    download_and_save(request_id, image_url)


def main():
    print("=" * 60)
    print("SEEDANCE 2.0 — Abou Bakari II | ocean (10s)")
    print("=" * 60)

    if "--recover" in sys.argv:
        recover_from_request_id()
    else:
        request_id, image_url = submit_and_save_request_id()
        poll_until_complete(request_id)
        download_and_save(request_id, image_url)

    print()
    print("=" * 60)
    print(f"DONE — review: {OUTPUT_MP4}")
    print("=" * 60)


if __name__ == "__main__":
    main()
