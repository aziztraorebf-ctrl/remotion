"""
Seedance 2.0 image-to-video — Scene 1 complement (fallback i2v)
Endpoint: fal-ai/bytedance/seedance-2.0/image-to-video
Source: scene1-v5-lastframe.png
Output: scene1-complement-v1-i2v.mp4
Cost: ~$1.80 (6s x $0.30/s)
GO: Aziz 2026-04-24
"""

import os
import sys
import json
import time
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

import fal_client

SCENE1_LASTFRAME = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/scene1/scene1-v5-lastframe.png"
OUTPUT_PATH = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/scene1/scene1-complement-v1-i2v.mp4"
META_PATH = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/scene1/scene1-complement-v1-i2v.meta.json"
PROMPT_PATH = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/scene1/scene1-complement-v1-i2v.prompt.txt"

PROMPT = """STRICT STYLE FIDELITY to paper-craft cut-paper collage aesthetic: sepia palette
(ochre, burnt sienna, warm cream, deep navy uniforms, crimson fez tassels),
flat paper-cut fills, visible fiber texture, dot-eyes only, no gradients,
no 3D rendering.

Camera: continue with very subtle push-in over 6 seconds. No pan, no orbit, no handheld.

SECONDS 0 TO 2:
The center tirailleur CLENCHES his jaw, SQUARES his shoulders. The left
tirailleur TURNS his gaze toward the approaching vessel. The right tirailleur
SHIFTS weight, HANDS folding behind his back.

SECONDS 2 TO 4:
A troop transport ship GLIDES into frame from the harbor mouth, hull cutting
the water. The center tirailleur's expression HARDENS, brow low, lips pressed
firm. The left tirailleur STRAIGHTENS posture. The right tirailleur LIFTS his
chin, gaze LOCKED on the ship.

SECONDS 4 TO 6:
The ship continues its approach, now clearly visible mid-harbor. All three
tirailleurs HOLD composed stances, bodies grounded, micro-shifts in breathing
and weight.

Continuous throughout: water RIPPLES against the quay stone, seagulls GLIDE
across the upper sky, faint smoke CURLS from the ship's stack.

MAINTAIN dot-eyes throughout, small black dot pupils. Uniforms stay intact.
No text visible. Ambient sounds only: lapping water, distant gulls, faint
ship engine hum."""

def main():
    # Upload image
    print("Uploading last frame to fal.ai...")
    with open(SCENE1_LASTFRAME, "rb") as f:
        image_url = fal_client.upload(f.read(), "image/png")
    print(f"Image URL: {image_url}")

    # Submit
    print("Submitting to fal-ai/bytedance/seedance-2.0/image-to-video...")
    handler = fal_client.submit(
        "fal-ai/bytedance/seedance-2.0/image-to-video",
        arguments={
            "prompt": PROMPT,
            "image_url": image_url,
            "duration": 6,
            "aspect_ratio": "9:16",
            "generate_audio": True
        }
    )
    request_id = handler.request_id
    print(f"Request ID: {request_id}")
    print(f"Timestamp: {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}")

    # Save prompt sidecar immediately
    Path(PROMPT_PATH).write_text(PROMPT)
    print(f"Prompt saved: {PROMPT_PATH}")

    # Poll
    print("Polling for result (3-8 min expected)...")
    start = time.time()
    while True:
        elapsed = int(time.time() - start)
        try:
            status = fal_client.status("fal-ai/bytedance/seedance-2.0/image-to-video", request_id, with_logs=True)
            status_str = str(type(status).__name__)
            print(f"[{elapsed}s] Status: {status_str}")
            if hasattr(status, 'logs') and status.logs:
                for log in status.logs[-3:]:
                    print(f"  LOG: {log}")
            # Check if completed
            if "Completed" in status_str or "Done" in status_str:
                break
            # Also try checking for result directly after 2 min
            if elapsed > 120:
                try:
                    result = fal_client.result("fal-ai/bytedance/seedance-2.0/image-to-video", request_id)
                    print("Result obtained via result() call")
                    process_result(result, request_id)
                    return
                except Exception:
                    pass
        except Exception as e:
            print(f"[{elapsed}s] Status check error: {e}")
        time.sleep(20)

    # Get final result
    result = fal_client.result("fal-ai/bytedance/seedance-2.0/image-to-video", request_id)
    process_result(result, request_id)


def process_result(result, request_id):
    print(f"Result: {result}")

    # Extract video URL
    video_url = None
    if hasattr(result, 'video') and result.video:
        video_url = result.video.url if hasattr(result.video, 'url') else str(result.video)
    elif isinstance(result, dict):
        if 'video' in result:
            v = result['video']
            video_url = v.get('url') if isinstance(v, dict) else str(v)

    if not video_url:
        print(f"ERROR: Could not extract video URL from result: {result}")
        sys.exit(1)

    print(f"Video URL: {video_url}")

    # Download
    print(f"Downloading to {OUTPUT_PATH}...")
    urllib.request.urlretrieve(video_url, OUTPUT_PATH)
    size_mb = Path(OUTPUT_PATH).stat().st_size / 1024 / 1024
    print(f"Downloaded: {size_mb:.1f} MB")

    # Save meta
    meta = {
        "tool": "fal-ai/bytedance/seedance-2.0/image-to-video",
        "request_id": request_id,
        "source_image": "scene1-v5-lastframe.png",
        "duration": 6,
        "aspect_ratio": "9:16",
        "generate_audio": True,
        "cost_estimate": "$1.80",
        "date": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        "video_url": video_url
    }
    Path(META_PATH).write_text(json.dumps(meta, indent=2))
    print(f"Meta saved: {META_PATH}")
    print(f"DONE. Output: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
