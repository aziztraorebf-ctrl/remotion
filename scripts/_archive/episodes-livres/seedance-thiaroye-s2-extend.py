"""
Seedance 2.0 reference-to-video -- Scene 2 complement (Video Extend)
Endpoint: fal-ai/bytedance/seedance-2.0/reference-to-video
Source: scene2-la-revendication.mp4 (clip valide par Aziz)
Output: scene2-la-revendication-extend.mp4
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
SOURCE_VIDEO = f"{CLIPS_DIR}/scene2-la-revendication.mp4"
OUTPUT_PATH = f"{CLIPS_DIR}/scene2-la-revendication-extend.mp4"
META_PATH = f"{CLIPS_DIR}/scene2-la-revendication-extend.meta.json"
PROMPT_PATH = f"{CLIPS_DIR}/scene2-la-revendication-extend.prompt.txt"

PROMPT = """[Video1] Continue this scene. STRICT STYLE FIDELITY: maintain exact same paper-craft aesthetic -- thick black outlines, flat color fills, cold grey-blue-indigo palette, paper kraft texture, dot-eyes throughout. NO photorealism, NO gradients, NO depth-of-field blur, NO BD comic drift.

Camera: slow orbit 45 degrees around the table over 5 seconds -- pivoting gradually from the original OTS angle, sliding around to progressively reveal the French officer's profile and partial face. Smooth and continuous, no shake, no cuts.

SECONDS 0 TO 2: The central tirailleur extends the paper further forward, his arm holding firm. The camera begins its slow orbit around the table. The OTS officer's silhouette starts rotating into partial profile view -- chest, shoulder, jaw line emerging from the foreground blur. The seated tirailleur on the left looks up from his writing.

SECONDS 2 TO 4: Camera continues the orbit. The officer's profile becomes visible -- WHITE FRENCH OFFICER, pale Caucasian skin, sharp jaw, clean-shaven, 50s, military kepi, dot-eyes only (no realistic iris). His brow FURROWS very slightly. His jaw TIGHTENS, lips PRESS together firmly. His head stays mostly still -- only the smallest acknowledgment that he has heard.

The tirailleurs respond as the officer emerges. The CENTRAL tirailleur keeps his arm extended with the paper -- the paper TREMBLES very slightly in his fingers, his eyes LOCKED on the officer's emerging profile, his shoulders RISING with one held breath. The LEFT tirailleur SETS DOWN his pencil quietly on the table, lifts his gaze. The RIGHT tirailleur LOWERS his gesturing hand to rest on the table, his torso STRAIGHTENING into alert attention.

SECONDS 4 TO 5: The orbit completes its arc. The officer's face is now in three-quarter view -- stoic, jaw set. His gaze SHIFTS slightly to the side, AWAY from the central tirailleur and the paper. He does NOT take the paper. He does NOT speak. He does NOT look directly at the tirailleur.

The central tirailleur's hand stays extended -- the paper still TREMBLING faintly. The other two tirailleurs HOLD their alert posture, bodies micro-shifting with breath, eyes fixed on the officer.

R-VIVANT-PARTOUT: All four characters stay engaged, bodies continuously micro-shifting. Nobody freezes.

CRITICAL CONSTRAINTS: The officer is WHITE -- pale European skin, European features, NO drift to dark skin tone, NO change to West African features. The officer's skin contrasts visibly with the tirailleurs' skin. Tirailleurs keep their West African features and dark brown skin tone exactly as in the source video. MAINTAIN strict dot-eyes throughout, pure black dot pupils, no realistic eyes, no iris.

NO new characters entering frame. NO text readable. The officer's full face must NOT be shown directly to camera -- only profile and three-quarter view.

Ambient: faint indoor camp sounds, distant muffled military voices, paper rustle, the tension of held silence. No dialogue, no music."""

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
        "source_video": "scene2-la-revendication.mp4",
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
