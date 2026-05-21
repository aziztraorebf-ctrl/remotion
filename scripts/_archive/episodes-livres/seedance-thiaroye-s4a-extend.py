"""
Seedance 2.0 reference-to-video -- Scene 4A complement (Video Extend)
Endpoint: fal-ai/bytedance/seedance-2.0/reference-to-video
Source: scene4a-effacement-archives.mp4 (clip valide par Aziz)
Output: scene4a-effacement-archives-extend.mp4
Cost: ~$0.91 (5s x $0.1814/s avec discount video input)
GO: Aziz 2026-04-25
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

CLIPS_DIR = "/Users/clawdbot/Workspace/remotion/public/assets/thiaroye-1944/clips-final"
SOURCE_VIDEO = f"{CLIPS_DIR}/scene4a-effacement-archives.mp4"
OUTPUT_PATH = f"{CLIPS_DIR}/scene4a-effacement-archives-extend.mp4"
META_PATH = f"{CLIPS_DIR}/scene4a-effacement-archives-extend.meta.json"
PROMPT_PATH = f"{CLIPS_DIR}/scene4a-effacement-archives-extend.prompt.txt"

PROMPT = """[Video1] Continue this scene. STRICT STYLE FIDELITY: maintain exact same paper-craft aesthetic -- thick black outlines, flat color fills, cold bureaucratic grey palette, fluorescent flat light, paper kraft texture. NO photorealism, NO gradients, NO depth-of-field blur, NO BD comic drift.

Camera: continue the very slow dolly-out throughout 5 seconds. Smooth and continuous, no shake, no cuts.

SECONDS 0 TO 2: Camera continues pulling back at the same slow pace. The distant figure at the end of the corridor takes one final step, then turns and walks deeper, becoming smaller in the perspective. One fluorescent light overhead FLICKERS once, stabilizes. The corridor reveals slightly more depth at frame edges.

SECONDS 2 TO 4: Camera continues the dolly-out. The distant figure DISAPPEARS around a far corner -- frame absorbs the absence quietly. Two more rows of cabinets become visible at the frame edges as the perspective widens. Another fluorescent FLICKERS further down the corridor, stabilizes.

SECONDS 4 TO 5: Camera HOLDS. Empty corridor remains. Cold flat fluorescent light. Stillness settles. One last distant FLICKER, then steady hum.

CRITICAL CONSTRAINTS: NO new characters entering frame. NO drawers opening on their own. The bureaucratic emptiness is the message.

MAINTAIN paper-craft style throughout. No text visible.

Ambient: low fluorescent hum, one distant flicker-buzz at second 1, faint receding footsteps fading to silence by second 3, then pure fluorescent hum until end. No dialogue, no music."""

ENDPOINT = "bytedance/seedance-2.0/reference-to-video"


def main():
    print(f"Uploading {SOURCE_VIDEO} to fal.ai...")
    with open(SOURCE_VIDEO, "rb") as f:
        video_url = fal_client.upload(f.read(), "video/mp4")
    print(f"Video URL: {video_url}")

    print(f"Submitting to {ENDPOINT}...")
    handler = fal_client.submit(
        ENDPOINT,
        arguments={
            "prompt": PROMPT,
            "video_urls": [video_url],
            "duration": 5,
            "aspect_ratio": "9:16",
            "generate_audio": False
        }
    )
    request_id = handler.request_id
    print(f"Request ID: {request_id}")
    print(f"Timestamp: {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}")

    Path(PROMPT_PATH).write_text(PROMPT)
    print(f"Prompt saved: {PROMPT_PATH}")

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
        "source_video": "scene4a-effacement-archives.mp4",
        "source_video_url": source_url,
        "duration": 5,
        "aspect_ratio": "9:16",
        "generate_audio": False,
        "cost_estimate": "$0.91",
        "date": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        "video_url": video_url
    }
    Path(META_PATH).write_text(json.dumps(meta, indent=2))
    print(f"Meta saved: {META_PATH}")
    print(f"DONE. Output: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
