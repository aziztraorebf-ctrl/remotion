"""Abou Bakari II — Scene fleet-b — Seedance 2.0 image-to-video.

Duration : 6s
Endpoint : bytedance/seedance-2.0/image-to-video
Cost est : $4.10
Audio    : generate_audio=True
Note     : Tempete, vague geante, capitaine. Anti-morphing clauses ajoutees.
"""

import os, sys, json, time
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

FAL_KEY = os.environ.get("FAL_KEY", "")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set"); sys.exit(1)

import fal_client

REPO = Path("/Users/clawdbot/Workspace/remotion")

SOURCE_IMAGE    = REPO / "public/assets/abou-bakari/scenes/scene-fleet-b-v4.png"
OUTPUT_DIR      = REPO / "public/assets/abou-bakari/clips"
OUTPUT_MP4      = OUTPUT_DIR / "fleet-b-v1.mp4"
OUTPUT_META     = OUTPUT_DIR / "fleet-b-v1.meta.json"
REQUEST_ID_FILE = OUTPUT_DIR / "fleet-b-v1.request-id.txt"

ENDPOINT       = "bytedance/seedance-2.0/image-to-video"
DURATION       = "6"
GENERATE_AUDIO = True
COST_ESTIMATE  = 4.10

PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY paper-craft sepia palette: maintain flat graphic outlines, dark navy storm clouds, deep blue-grey waves, warm brown wooden hull, no added realism, no texture beyond paper grain.

Camera holds STEADY — no movement. The figure and wave fill the frame.

SECONDS 0 TO 2: The massive wave is ALREADY mid-crash — it continues CRASHING FORWARD and DOWNWARD, never pulling back. The captain PLANTS his feet wide on the deck, DARK BROWN skin, body BRACING against the impact — legs BENDING, torso LEANING into the wave. His arms GRIP the mast tightly throughout.

SECONDS 2 TO 4: White foam BURSTS across the bow. The captain STAGGERS — weight SHIFTING hard to his right, head TURNING away from the spray. The torn sail WHIPS continuously LEFT TO RIGHT — never reversing direction. The wooden hull SHUDDERS.

SECONDS 4 TO 6: The boat TILTS sharply. The captain PULLS himself upright, eyes WIDE, scanning the wall of water ahead. Storm clouds CHURN overhead. A second wave RISES on the left — even larger. He SHOUTS — mouth OPEN, body TENSED.

NO MORPHING: wave maintains its paper-craft flat graphic form throughout. Hull stays rigid. No objects appear or disappear.

COLOR GRADE: deep navy storm clouds, dark blue-grey ocean, warm brown hull — cold dramatic palette. No dust motes, no floating particles, no sparkles. No text anywhere.
"""


def submit_and_save_request_id():
    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}"); sys.exit(1)
    print(f"  OK ({SOURCE_IMAGE.stat().st_size // 1024} KB) {SOURCE_IMAGE.name}")

    print("[2/4] Uploading to fal.ai CDN...")
    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"  -> {image_url}")

    print("[3/4] Submitting...")
    print(f"  Endpoint   : {ENDPOINT}")
    print(f"  Duration   : {DURATION}s")
    print(f"  Aspect     : 9:16")
    print(f"  Resolution : 1080p")
    print(f"  Audio      : {GENERATE_AUDIO}")
    print(f"  Est. cost  : ${COST_ESTIMATE}")

    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": DURATION,
        "aspect_ratio": "9:16",
        "resolution": "1080p",
        "generate_audio": GENERATE_AUDIO,
    }
    handler = fal_client.submit(ENDPOINT, arguments=args)
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    REQUEST_ID_FILE.write_text(
        f"{request_id}\n# endpoint: {ENDPOINT}\n# image_url: {image_url}\n"
        f"# saved_at: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    )
    return request_id, image_url


def poll_until_complete(request_id):
    print("  Polling...")
    start, last_log = time.time(), ""
    while True:
        status = fal_client.status(ENDPOINT, request_id, with_logs=False)
        elapsed = int(time.time() - start)
        s = type(status).__name__
        if s != last_log:
            print(f"    [{elapsed}s] {s}"); last_log = s
        if s == "Completed": break
        if elapsed > 600: print("  TIMEOUT — use --recover"); sys.exit(1)
        time.sleep(5)


def download_and_save(request_id, image_url):
    result = fal_client.result(ENDPOINT, request_id)
    print("[4/4] Downloading...")
    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size")
    print(f"  URL: {video_url}  |  Seed: {seed}")
    if file_size: print(f"  Size: {file_size/1024/1024:.1f} MB")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED: {OUTPUT_MP4}")

    OUTPUT_META.write_text(json.dumps({
        "request_id": request_id, "endpoint": ENDPOINT,
        "duration_s": int(DURATION), "generate_audio": GENERATE_AUDIO,
        "seed": seed, "video_url": video_url, "file_size": file_size,
        "source_image": SOURCE_IMAGE.name, "source_image_url": image_url,
        "prompt": PROMPT, "cost_usd_estimate": COST_ESTIMATE,
    }, indent=2))
    print(f"  META: {OUTPUT_META}")


def recover():
    if not REQUEST_ID_FILE.exists():
        print(f"ERROR: {REQUEST_ID_FILE} not found"); sys.exit(1)
    lines = REQUEST_ID_FILE.read_text().splitlines()
    rid = lines[0].strip()
    url = next((l.split(":",1)[1].strip() for l in lines[1:] if l.startswith("# image_url:")), "")
    print(f"RECOVER: {rid}")
    poll_until_complete(rid)
    download_and_save(rid, url)


def main():
    print("=" * 60)
    print("SEEDANCE 2.0 — Abou Bakari II | fleet-b (6s)")
    print("=" * 60)
    if "--recover" in sys.argv:
        recover()
    else:
        rid, url = submit_and_save_request_id()
        poll_until_complete(rid)
        download_and_save(rid, url)
    print(f"\nDONE — {OUTPUT_MP4}")
    print("=" * 60)

if __name__ == "__main__":
    main()
