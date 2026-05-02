"""
Seedance 2.0 reference-to-video — Scene 1 complement (Video Extend)
Endpoint: fal-ai/bytedance/seedance-2.0/reference-to-video
Source: s1-retour-v5.mp4 (clip V5 valide par Aziz)
Output: scene1-complement-v1-r2v.mp4
Cost: ~$1.09 (6s x $0.1814/s avec discount video input)
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

SOURCE_VIDEO = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/clips/s1-retour-v5.mp4"
OUTPUT_PATH = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/scene1/scene1-complement-v1-r2v.mp4"
META_PATH = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/scene1/scene1-complement-v1-r2v.meta.json"
PROMPT_PATH = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/scene1/scene1-complement-v1-r2v.prompt.txt"

PROMPT = """[Video1] Continue this scene. STRICT STYLE FIDELITY to paper-craft cut-paper collage aesthetic: sepia palette
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

ENDPOINT = "bytedance/seedance-2.0/reference-to-video"


def main():
    # Upload video
    print(f"Uploading {SOURCE_VIDEO} to fal.ai...")
    with open(SOURCE_VIDEO, "rb") as f:
        video_url = fal_client.upload(f.read(), "video/mp4")
    print(f"Video URL: {video_url}")

    # Submit
    print(f"Submitting to {ENDPOINT}...")
    handler = fal_client.submit(
        ENDPOINT,
        arguments={
            "prompt": PROMPT,
            "video_urls": [video_url],
            "duration": 6,
            "aspect_ratio": "9:16",
            "generate_audio": False
        }
    )
    request_id = handler.request_id
    print(f"Request ID: {request_id}")
    print(f"Timestamp: {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}")

    Path(PROMPT_PATH).write_text(PROMPT)
    print(f"Prompt saved: {PROMPT_PATH}")

    # Poll
    print("Polling for result (3-8 min expected)...")
    start = time.time()
    while True:
        elapsed = int(time.time() - start)
        try:
            status = fal_client.status(ENDPOINT, request_id, with_logs=True)
            status_str = type(status).__name__
            print(f"[{elapsed}s] Status: {status_str}")
            if hasattr(status, 'logs') and status.logs:
                for log in status.logs[-2:]:
                    print(f"  LOG: {log}")
            if "Completed" in status_str or "Done" in status_str:
                break
            if elapsed > 120:
                try:
                    result = fal_client.result(ENDPOINT, request_id)
                    print("Result obtained via result() call")
                    process_result(result, request_id, video_url)
                    return
                except Exception:
                    pass
        except Exception as e:
            print(f"[{elapsed}s] Status check error: {e}")
        time.sleep(20)

    result = fal_client.result(ENDPOINT, request_id)
    process_result(result, request_id, video_url)


def process_result(result, request_id, source_url):
    print(f"Result: {result}")

    video_url = None
    if hasattr(result, 'video') and result.video:
        video_url = result.video.url if hasattr(result.video, 'url') else str(result.video)
    elif isinstance(result, dict):
        v = result.get('video', {})
        video_url = v.get('url') if isinstance(v, dict) else str(v)

    if not video_url:
        print(f"ERROR: Could not extract video URL from result: {result}")
        sys.exit(1)

    print(f"Output video URL: {video_url}")

    print(f"Downloading to {OUTPUT_PATH}...")
    urllib.request.urlretrieve(video_url, OUTPUT_PATH)
    size_mb = Path(OUTPUT_PATH).stat().st_size / 1024 / 1024
    print(f"Downloaded: {size_mb:.1f} MB")

    meta = {
        "tool": ENDPOINT,
        "request_id": request_id,
        "source_video": "s1-retour-v5.mp4",
        "source_video_url": source_url,
        "duration": 6,
        "aspect_ratio": "9:16",
        "generate_audio": False,
        "cost_estimate": "$1.09",
        "date": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        "video_url": video_url
    }
    Path(META_PATH).write_text(json.dumps(meta, indent=2))
    print(f"Meta saved: {META_PATH}")
    print(f"DONE. Output: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
