"""Pecheur test — Scene unique — Seedance 2.0 image-to-video.
Duration : 10s  |  Cost est (grille reelle memoire ~$0.683/s) : ~$6.83  |  Audio : False
Valide par Aziz 2026-07-04 (Option B : image-to-video simple, narratif riche, pas de storyboard multi-images).
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

SOURCE_IMAGE    = REPO / "public/assets/pecheur-seedance-test/scenes/pecheur-source-v1.png"
OUTPUT_DIR      = REPO / "public/assets/pecheur-seedance-test/clips"
OUTPUT_MP4      = OUTPUT_DIR / "pecheur-v1.mp4"
OUTPUT_META     = OUTPUT_DIR / "pecheur-v1.meta.json"
REQUEST_ID_FILE = OUTPUT_DIR / "pecheur-v1.request-id.txt"

ENDPOINT = "bytedance/seedance-2.0/image-to-video"

DURATION        = "10"
GENERATE_AUDIO  = False
COST_ESTIMATE   = 6.83   # 10s * ~$0.683/s (grille reelle observee 2026-04-26)

PROMPT = """Animate this exact illustration. STRICT STYLE FIDELITY: minimalist ink-line 2D flat illustration — thin black outlined stick-figure character, flat solid color fills, no shading beyond the existing sun halo, no added texture or detail, no photorealism, no 3D rendering. Do NOT drift toward anime or cartoon style.

The fisherman stands in his pirogue on calm water. He performs one full fishing sequence, narrated as continuous action: He WINDS UP his cast, torso leaning back, arm raised high with the folded net. He RELEASES the throw — the net WHIPS forward and fans open over the water. He HAULS the net back in with visible effort, torso straightening, net dragging against the pirogue's side. He TURNS in a three-quarter angle toward the inside of the boat — never facing the camera directly — a fish in hand, and LOWERS it into the wicker basket resting at the bottom of the pirogue. He STRAIGHTENS, gaze drifting toward the horizon. His expression DARKENS — brow lowers, mouth flattens — and he goes still.

Identity lock: dark brown skin, teal shirt, dark slate-grey pants, shaved head, calm profile face, same proportions throughout. Pirogue and flat ink ocean/sky stay consistent with the source image. The wicker basket stays in the same position at the bottom of the boat throughout.

Camera holds steady, gentle handheld sway only. No unnecessary rotations. Normal human body structure, no anatomical distortion.

No text, no banners, no signs, no writing visible anywhere. No music, no words, no dialogue. No dust motes, no floating particles."""


def submit_and_save_request_id():
    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}"); sys.exit(1)
    print(f"  OK ({SOURCE_IMAGE.stat().st_size // 1024} KB) {SOURCE_IMAGE.name}")

    print("[2/4] Uploading to fal.ai CDN...")
    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"  -> {image_url}")

    print("[3/4] Submitting...")
    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": DURATION,
        "aspect_ratio": "16:9",
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
