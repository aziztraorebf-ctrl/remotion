"""Abou Bakari II — Scene fleet-a — Seedance 2.0 image-to-video.

Duration : 10s
Endpoint : bytedance/seedance-2.0/image-to-video
Cost est : $3.00
Audio    : generate_audio=True
Note     : Scene historiquement difficile — flotte 2000 pirogues, scale epique.
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

SOURCE_IMAGE    = REPO / "public/assets/abou-bakari/scenes/scene-fleet-a-v1.png"
OUTPUT_DIR      = REPO / "public/assets/abou-bakari/clips"
OUTPUT_MP4      = OUTPUT_DIR / "fleet-a-v1.mp4"
OUTPUT_META     = OUTPUT_DIR / "fleet-a-v1.meta.json"
REQUEST_ID_FILE = OUTPUT_DIR / "fleet-a-v1.request-id.txt"

ENDPOINT       = "bytedance/seedance-2.0/image-to-video"
DURATION       = "10"
GENERATE_AUDIO = False
COST_ESTIMATE  = 3.00

PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY paper-craft warm sepia palette: maintain flat layered paper silhouettes, deep navy wave bands, golden sails, no added realism, no texture beyond paper grain.

Camera holds WIDE — no push-in, no pan. The entire fleet fills the frame from foreground to horizon. Steady, majestic shot.

SECONDS 0 TO 3: The wave bands ROLL in slow continuous undulation left to right. The foreground pirogues RISE and FALL gently with the swell. The golden sails BILLOW slightly in the wind — fabric SWELLING then RELAXING. Distant pirogues at the horizon SWAY as a mass, tiny but alive.

SECONDS 3 TO 6: The rowing figures in the foreground pirogues PULL their oars in a slow steady rhythm — FORWARD PULL, LIFT, RECOVER. The sail fabric continues BILLOWING. The fleet advances WESTWARD — all pirogues drift subtly forward as one.

SECONDS 6 TO 10: The camera TILTS SLIGHTLY upward toward the horizon — revealing the sheer scale of the fleet stretching endlessly west. Hundreds of golden sails SWAY together. The cream sky BRIGHTENS faintly at the horizon. Clouds DRIFT slowly rightward.

COLOR GRADE: deep navy blue ocean, warm golden-ochre sails, cream sky — paper-craft sepia warm palette throughout. No dust motes, no floating particles, no sparkles. No text anywhere.
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
    print("SEEDANCE 2.0 — Abou Bakari II | fleet-a (10s)")
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
