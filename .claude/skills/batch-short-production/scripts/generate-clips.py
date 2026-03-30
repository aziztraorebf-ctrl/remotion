"""
Batch Short Production — Phase 4: I2V Clip Generation
Generates video clips from storyboard frames using fal.ai (Kling V3/O3).

Usage:
    python generate-clips.py --config clips-config.json --output-dir project/clips/
    python generate-clips.py --config clips-config.json --output-dir project/clips/ --dry-run

clips-config.json format:
{
  "frames": [
    {
      "id": 1,
      "frame_path": "project/frames/frame-01.jpg",
      "model": "fal-ai/kling-video/v3/pro/image-to-video",
      "duration": "10",
      "cfg_scale": 0.35,
      "prompt": "Close-up of hands PRESSING a wax seal..."
    },
    ...
  ]
}

Claude generates this config from timing.json + video prompts + shot type analysis.
"""

import argparse
import json
import os
import sys
import time
import pathlib
import urllib.request
from dotenv import load_dotenv

try:
    import fal_client
except ImportError:
    print("ERROR: fal_client not installed. Run: pip install fal-client")
    sys.exit(1)


NEGATIVE_PROMPT = (
    "text, writing, letters, numbers, dates, subtitles, captions, watermark, "
    "signature, title, label, stamp, typography, words, digits, calendar, "
    "timestamps, photorealistic, 3D render, CGI"
)

MAX_POLL_WAIT = 600
POLL_INTERVAL = 20


def find_env():
    path = pathlib.Path.cwd()
    while path != path.parent:
        env_file = path / ".env"
        if env_file.exists():
            return str(env_file)
        path = path.parent
    return None


def upload_frame(frame_path):
    print(f"  Uploading {pathlib.Path(frame_path).name}...")
    url = fal_client.upload_file(str(frame_path))
    print(f"  -> {url[:60]}...")
    return url


def submit_job(config, image_url):
    frame_id = config["id"]
    model = config["model"]
    model_short = model.split("/")[-2] + "/" + model.split("/")[-1]
    print(f"Submitting Frame {frame_id} ({model_short}, {config['duration']}s, cfg {config['cfg_scale']})...")

    handler = fal_client.submit(
        model,
        arguments={
            "image_url": image_url,
            "prompt": config["prompt"],
            "negative_prompt": NEGATIVE_PROMPT,
            "duration": config["duration"],
            "aspect_ratio": "9:16",
            "cfg_scale": config["cfg_scale"],
        },
    )
    print(f"  Request ID: {handler.request_id}")
    return handler.request_id


def poll_and_download(config, request_id, output_dir):
    frame_id = config["id"]
    model = config["model"]
    out_path = output_dir / f"frame-{frame_id:02d}.mp4"

    print(f"\nPolling Frame {frame_id}...")
    elapsed = 0

    while elapsed < MAX_POLL_WAIT:
        try:
            status = fal_client.status(model, request_id, with_logs=False)
            status_type = type(status).__name__
            print(f"  Frame {frame_id}: {status_type} ({elapsed}s)")

            if status_type == "Completed":
                result = fal_client.result(model, request_id)
                video_url = result["video"]["url"]
                print(f"  Downloading Frame {frame_id}...")
                urllib.request.urlretrieve(video_url, str(out_path))
                print(f"  Saved: {out_path}")
                return str(out_path)

            if status_type == "Failed":
                print(f"  Frame {frame_id} FAILED")
                return None

        except Exception as e:
            print(f"  Frame {frame_id} poll error: {e}")

        time.sleep(POLL_INTERVAL)
        elapsed += POLL_INTERVAL

    print(f"  Frame {frame_id} TIMEOUT after {MAX_POLL_WAIT}s")
    return None


def main():
    parser = argparse.ArgumentParser(description="Generate I2V clips from storyboard frames")
    parser.add_argument("--config", required=True, help="Path to clips-config.json")
    parser.add_argument("--output-dir", required=True, help="Output directory for clips")
    parser.add_argument("--dry-run", action="store_true", help="Print config without generating")
    args = parser.parse_args()

    env_path = find_env()
    if env_path:
        load_dotenv(env_path)

    if not os.getenv("FAL_KEY"):
        print("ERROR: FAL_KEY not found in environment")
        sys.exit(1)

    config_path = pathlib.Path(args.config)
    if not config_path.exists():
        print(f"ERROR: Config file not found: {config_path}")
        sys.exit(1)

    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    frames_config = config["frames"]
    output_dir = pathlib.Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"=== Clip Generation: {len(frames_config)} frames ===\n")

    if args.dry_run:
        for fc in frames_config:
            model_short = fc["model"].split("/")[-2] + "/" + fc["model"].split("/")[-1]
            print(f"  Frame {fc['id']:2d}: {model_short}, {fc['duration']}s, cfg {fc['cfg_scale']}")
            print(f"           {fc['prompt'][:80]}...")
            print()
        print("Dry run complete. Remove --dry-run to generate.")
        return

    # Upload all frames
    print("Uploading frames...")
    frame_urls = {}
    for fc in frames_config:
        frame_path = fc["frame_path"]
        if not pathlib.Path(frame_path).exists():
            print(f"ERROR: Frame not found: {frame_path}")
            sys.exit(1)
        frame_urls[fc["id"]] = upload_frame(frame_path)

    # Submit all jobs
    print("\nSubmitting jobs...")
    request_ids = {}
    for fc in frames_config:
        url = frame_urls[fc["id"]]
        request_ids[fc["id"]] = submit_job(fc, url)
        time.sleep(2)

    # Wait for initial processing
    wait_time = min(90, len(frames_config) * 15)
    print(f"\nWaiting {wait_time}s for initial processing...")
    time.sleep(wait_time)

    # Poll and download
    print("\nPolling and downloading...")
    results = {}
    for fc in frames_config:
        frame_id = fc["id"]
        result = poll_and_download(fc, request_ids[frame_id], output_dir)
        results[frame_id] = result

    # Summary
    print("\n=== SUMMARY ===")
    success = 0
    failed = []
    for fc in frames_config:
        frame_id = fc["id"]
        path = results.get(frame_id)
        status = "OK" if path else "FAILED"
        print(f"  Frame {frame_id:02d}: {status} {path or ''}")
        if path:
            success += 1
        else:
            failed.append(frame_id)

    print(f"\n{success}/{len(frames_config)} clips generated successfully")
    if failed:
        print(f"Failed frames: {failed} — regenerate with adjusted prompts")
    print(f"Output directory: {output_dir.resolve()}")

    print("\nNext step: review clips, then assemble in Remotion")


if __name__ == "__main__":
    main()
