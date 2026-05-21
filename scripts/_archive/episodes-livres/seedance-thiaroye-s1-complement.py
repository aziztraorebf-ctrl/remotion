"""
Seedance Video Extend - Thiaroye V5 Scene 1 Complement
Reference-to-video: use s1-retour-v5.mp4 as style/motion reference
Duration: 6s | Aspect: 9:16 | Audio: true
"""
import os
import sys
import json
import time
import urllib.request
from pathlib import Path

import fal_client

# Paths
PROJECT_ROOT = Path("/Users/clawdbot/Workspace/remotion")
SOURCE_VIDEO = PROJECT_ROOT / "public/assets/thiaroye-1944/clips/s1-retour-v5.mp4"
FALLBACK_IMAGE = PROJECT_ROOT / "public/assets/thiaroye-1944/scene1/scene1-v5-lastframe.png"
OUTPUT_PATH = PROJECT_ROOT / "public/assets/thiaroye-1944/scene1/scene1-complement-v1.mp4"
OUTPUT_PATH_I2V = PROJECT_ROOT / "public/assets/thiaroye-1944/scene1/scene1-complement-v1-i2v.mp4"
META_PATH = PROJECT_ROOT / "public/assets/thiaroye-1944/scene1/scene1-complement-v1.meta.json"
PROMPT_PATH = PROJECT_ROOT / "public/assets/thiaroye-1944/scene1/scene1-complement-v1.prompt.txt"

PROMPT = """STRICT STYLE FIDELITY to paper-craft cut-paper collage aesthetic: sepia palette \
(ochre, burnt sienna, warm cream, deep navy uniforms, crimson fez tassels), \
flat paper-cut fills, visible fiber texture, dot-eyes only, no gradients, \
no 3D rendering.

Camera: continue with very subtle push-in over 6 seconds. No pan, no orbit, no handheld.

SECONDS 0 TO 2:
The center tirailleur CLENCHES his jaw, SQUARES his shoulders. The left \
tirailleur TURNS his gaze toward the approaching vessel. The right tirailleur \
SHIFTS weight, HANDS folding behind his back.

SECONDS 2 TO 4:
A troop transport ship GLIDES into frame from the harbor mouth, hull cutting \
the water. The center tirailleur's expression HARDENS, brow low, lips pressed \
firm. The left tirailleur STRAIGHTENS posture. The right tirailleur LIFTS his \
chin, gaze LOCKED on the ship.

SECONDS 4 TO 6:
The ship continues its approach, now clearly visible mid-harbor. All three \
tirailleurs HOLD composed stances, bodies grounded, micro-shifts in breathing \
and weight.

Continuous throughout: water RIPPLES against the quay stone, seagulls GLIDE \
across the upper sky, faint smoke CURLS from the ship's stack.

MAINTAIN dot-eyes throughout, small black dot pupils. Uniforms stay intact. \
No text visible. Ambient sounds only: lapping water, distant gulls, faint \
ship engine hum."""

def download_file(url, dest_path):
    print(f"Downloading to {dest_path}...")
    urllib.request.urlretrieve(url, dest_path)
    size_mb = dest_path.stat().st_size / (1024 * 1024)
    print(f"Saved: {dest_path} ({size_mb:.2f} MB)")

def save_meta(request_id, endpoint, result_url, cost_note, output_path):
    meta = {
        "request_id": request_id,
        "endpoint": endpoint,
        "result_url": result_url,
        "cost_note": cost_note,
        "date": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "output": str(output_path),
        "prompt_chars": len(PROMPT),
    }
    META_PATH.write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    print(f"Meta saved: {META_PATH}")

def try_r2v():
    endpoint = "bytedance/seedance-2.0/reference-to-video"
    print(f"\n--- Uploading source video ({SOURCE_VIDEO.stat().st_size / 1024:.0f} KB)...")
    with open(SOURCE_VIDEO, "rb") as f:
        video_url = fal_client.upload(f.read(), "video/mp4")
    print(f"Uploaded: {video_url}")

    print(f"\n--- Submitting to {endpoint}...")
    handler = fal_client.submit(
        endpoint,
        arguments={
            "prompt": PROMPT,
            "video_urls": [video_url],
            "duration": 6,
            "aspect_ratio": "9:16",
            "generate_audio": True,
        },
    )
    request_id = handler.request_id
    print(f"Request ID: {request_id}")
    return endpoint, request_id

def try_i2v():
    endpoint = "bytedance/seedance-2.0/image-to-video"
    print(f"\n--- FALLBACK: uploading lastframe image...")
    with open(FALLBACK_IMAGE, "rb") as f:
        image_url = fal_client.upload(f.read(), "image/png")
    print(f"Uploaded: {image_url}")

    print(f"\n--- Submitting to {endpoint}...")
    handler = fal_client.submit(
        endpoint,
        arguments={
            "prompt": PROMPT,
            "image_url": image_url,
            "duration": 6,
            "aspect_ratio": "9:16",
            "generate_audio": True,
        },
    )
    request_id = handler.request_id
    print(f"Request ID: {request_id}")
    return endpoint, request_id

def poll_result(endpoint, request_id, timeout=600):
    print(f"\n--- Polling result (up to {timeout//60} min)...")
    start = time.time()
    while True:
        elapsed = time.time() - start
        if elapsed > timeout:
            raise TimeoutError(f"Timeout after {elapsed:.0f}s")
        try:
            result = fal_client.result(endpoint, request_id)
            return result
        except Exception as e:
            msg = str(e)
            if "IN_PROGRESS" in msg or "IN_QUEUE" in msg or "not found" in msg.lower():
                print(f"  [{elapsed:.0f}s] Still processing... ({msg[:60]})")
                time.sleep(15)
            else:
                raise

def main():
    os.environ["FAL_KEY"] = "b5fd93ba-dc99-4d10-a018-233dc8844197:4648554e4f1003e192fd0c2f90586a89"
    PROMPT_PATH.write_text(PROMPT)
    print(f"Prompt saved: {PROMPT_PATH}")

    # Try reference-to-video first
    r2v_ok = True
    try:
        endpoint, request_id = try_r2v()
    except Exception as e:
        msg = str(e)
        print(f"\nR2V failed: {msg}")
        if "moderation" in msg.lower() or "policy" in msg.lower() or "content" in msg.lower():
            print("Content moderation detected — switching to i2v fallback")
            r2v_ok = False
        else:
            raise

    if not r2v_ok:
        endpoint, request_id = try_i2v()
        output_dest = OUTPUT_PATH_I2V
        cost_note = "~$1.80 (i2v 6s @ $0.30/s fallback)"
    else:
        output_dest = OUTPUT_PATH
        cost_note = "~$1.09 (r2v 6s @ $0.1814/s)"

    print(f"\nCost estimate: {cost_note}")
    print(f"Output will be saved to: {output_dest}")

    result = poll_result(endpoint, request_id)
    print(f"\nResult received: {result}")

    # Extract video URL from result
    video_url = None
    if isinstance(result, dict):
        if "video" in result and isinstance(result["video"], dict):
            video_url = result["video"].get("url")
        elif "video_url" in result:
            video_url = result["video_url"]
        elif "url" in result:
            video_url = result["url"]

    if not video_url:
        print(f"ERROR: Could not extract video URL from result: {result}")
        sys.exit(1)

    print(f"\nVideo URL: {video_url}")
    download_file(video_url, output_dest)
    save_meta(request_id, endpoint, video_url, cost_note, output_dest)

    print(f"\nDONE. Asset: {output_dest}")

if __name__ == "__main__":
    main()
