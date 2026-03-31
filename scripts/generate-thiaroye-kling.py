"""
Thiaroye 1944 — Kling video generation for 9 storyboard frames
Extracts 9 frames from the 3x3 grid, uploads to fal.ai, generates clips in parallel.
Output: public/assets/library/geoafrique/thiaroye-1944/clips/frame-XX.mp4
"""

import fal_client
import os
import time
import urllib.request
import pathlib
from PIL import Image
from dotenv import load_dotenv

load_dotenv(pathlib.Path(__file__).parent.parent / ".env")

GRID_PATH = pathlib.Path("public/assets/library/geoafrique/thiaroye-1944/thiaroye-storyboard-grid-v2.jpg")
FRAMES_DIR = pathlib.Path("public/assets/library/geoafrique/thiaroye-1944/frames")
CLIPS_DIR = pathlib.Path("public/assets/library/geoafrique/thiaroye-1944/clips")
FRAMES_DIR.mkdir(parents=True, exist_ok=True)
CLIPS_DIR.mkdir(parents=True, exist_ok=True)

NEGATIVE_PROMPT = "text, writing, letters, numbers, dates, subtitles, captions, watermark, signature, title, label, stamp, typography, words, digits, calendar, timestamps, photorealistic, 3D render, CGI"

FRAMES_CONFIG = [
    {
        "id": 1,
        "model": "fal-ai/kling-video/v3/pro/image-to-video",
        "duration": "5",
        "cfg_scale": 0.4,
        "prompt": "Extreme close-up of weathered dark hands slowly pressing a brass wax seal onto blank parchment paper. Warm candlelight shifts across the textured paper grain and the wax melting. Atmospheric movement only: subtle hand tremor, light breathing, slow light shift. No text visible anywhere. Gold and sepia palette.",
    },
    {
        "id": 2,
        "model": "fal-ai/kling-video/v3/standard/image-to-video",
        "duration": "5",
        "cfg_scale": 0.35,
        "prompt": "Wide establishing shot down a long dusty path lined by low military barracks under a harsh sepia sky. Palm trees frame the shot. The camp is empty, silent, oppressive heat. Atmospheric movement only: dust motes drifting slowly, palm fronds swaying gently, light shimmer on the sand. No figures, no text. Gold sepia charcoal palette.",
    },
    {
        "id": 3,
        "model": "fal-ai/kling-video/o3/standard/image-to-video",
        "duration": "5",
        "cfg_scale": 0.35,
        "prompt": "Medium shot of a long row of African soldiers in military uniform standing at attention. They face the camera with solemn dignified expressions. The row stretches deep into background. Atmospheric movement only: collective slow breathing, fabric rippling in a gentle breeze, light shifting slightly. No text, no writing, no labels. Gold sepia flat illustration style.",
    },
    {
        "id": 4,
        "model": "fal-ai/kling-video/o3/standard/image-to-video",
        "duration": "5",
        "cfg_scale": 0.35,
        "prompt": "Tight close-up profile tracking along a line of soldiers' faces. Jaws clenched, eyes fixed forward with intense resolve and quiet dignity. Atmospheric movement only: focused breath visible, deepening shadows, slow blink, subtle eye movement. No text. Charcoal and sepia palette.",
    },
    {
        "id": 5,
        "model": "fal-ai/kling-video/o3/standard/image-to-video",
        "duration": "5",
        "cfg_scale": 0.35,
        "prompt": "Medium shot of a group of African soldiers holding up completely blank white sheets of paper toward an unseen authority. They stand respectfully but firmly. The paper is entirely blank with no marks. Atmospheric movement only: paper edges shifting slightly in breeze, collective slow inhalation. No text anywhere. Gold sepia flat style.",
    },
    {
        "id": 6,
        "model": "fal-ai/kling-video/o3/standard/image-to-video",
        "duration": "5",
        "cfg_scale": 0.4,
        "prompt": "Dramatic high-contrast silhouette composition. Dark static silhouettes of soldiers against a sky filled with rising charcoal smoke and harsh light flashes suggesting distant gunfire. Atmospheric movement only: volumetric smoke rising slowly, rapid light pulses, very subtle camera vibration. No complex character motion. No text. Black charcoal gold palette.",
    },
    {
        "id": 7,
        "model": "fal-ai/kling-video/v3/pro/image-to-video",
        "duration": "5",
        "cfg_scale": 0.4,
        "prompt": "Close-up of two aged heavily wrinkled hands resting on a plain wooden table surface. The skin texture is deeply defined, reflecting decades of time passed. Atmospheric movement only: slow deep pulse in a vein, gradual shift in the angle of warm light across the knuckles, barely perceptible tremor. No text. Sepia gold warm palette.",
    },
    {
        "id": 8,
        "model": "fal-ai/kling-video/v3/standard/image-to-video",
        "duration": "5",
        "cfg_scale": 0.35,
        "prompt": "Wide shot of a lone elderly man in civilian clothes standing with his back to the camera on a dark silhouetted shoreline. He gazes out at a vast grey ocean horizon at twilight. Atmospheric movement only: gentle waves rolling slowly, gradual change in twilight light intensity, slight breeze in his clothing. No text. Charcoal grey sepia palette.",
    },
    {
        "id": 9,
        "model": "fal-ai/kling-video/v3/pro/image-to-video",
        "duration": "5",
        "cfg_scale": 0.4,
        "prompt": "Tight portrait of a young Black woman facing directly at camera. She offers a calm composed expression that slowly softens into a slight smile. A soft warm shaft of golden light gradually illuminates her face from above. Atmospheric movement only: natural breathing, a gentle smile forming slowly, light intensifying. No text. Gold warm sepia palette.",
    },
]


def extract_frames(grid_path):
    print(f"Extracting 9 frames from grid...")
    img = Image.open(grid_path)
    w, h = img.size
    print(f"  Grid size: {w}x{h}")

    border = 4
    cell_w = (w - border * 4) // 3
    cell_h = (h - border * 4) // 3

    frames = []
    for row in range(3):
        for col in range(3):
            idx = row * 3 + col + 1
            x1 = border + col * (cell_w + border)
            y1 = border + row * (cell_h + border)
            x2 = x1 + cell_w
            y2 = y1 + cell_h
            frame = img.crop((x1, y1, x2, y2))
            frame_path = FRAMES_DIR / f"frame-{idx:02d}.jpg"
            frame.save(frame_path, quality=95)
            frames.append(frame_path)
            print(f"  Frame {idx}: saved to {frame_path} ({cell_w}x{cell_h})")

    return frames


def upload_frame(frame_path):
    print(f"  Uploading {frame_path.name}...")
    url = fal_client.upload_file(str(frame_path))
    print(f"  -> {url[:60]}...")
    return url


def submit_job(config, image_url):
    print(f"Submitting Frame {config['id']} ({config['model'].split('/')[-2]})...")
    handler = fal_client.submit(
        config["model"],
        arguments={
            "image_url": image_url,
            "prompt": config["prompt"],
            "negative_prompt": NEGATIVE_PROMPT,
            "duration": config["duration"],
            "aspect_ratio": "9:16",
            "cfg_scale": config["cfg_scale"],
        }
    )
    print(f"  Request ID: {handler.request_id}")
    return handler.request_id


def poll_and_download(config, request_id):
    frame_id = config["id"]
    model = config["model"]
    out_path = CLIPS_DIR / f"frame-{frame_id:02d}.mp4"

    print(f"\nPolling Frame {frame_id}...")
    max_wait = 600
    interval = 20
    elapsed = 0

    while elapsed < max_wait:
        try:
            status = fal_client.status(model, request_id, with_logs=False)
            status_type = type(status).__name__
            print(f"  Frame {frame_id}: {status_type} ({elapsed}s)")

            if status_type == "Completed":
                result = fal_client.result(model, request_id)
                video_url = result["video"]["url"]
                print(f"  Downloading Frame {frame_id}...")
                urllib.request.urlretrieve(video_url, out_path)
                print(f"  Saved: {out_path}")
                return str(out_path)

            if status_type in ("Failed", "InQueue"):
                if status_type == "Failed":
                    print(f"  Frame {frame_id} FAILED")
                    return None

        except Exception as e:
            print(f"  Frame {frame_id} poll error: {e}")

        time.sleep(interval)
        elapsed += interval

    print(f"  Frame {frame_id} TIMEOUT after {max_wait}s")
    return None


def main():
    print("=== Thiaroye 1944 — Kling Generation ===\n")

    frames = extract_frames(GRID_PATH)

    print("\nUploading all frames...")
    frame_urls = {}
    for i, frame_path in enumerate(frames):
        frame_id = i + 1
        url = upload_frame(frame_path)
        frame_urls[frame_id] = url

    print("\nSubmitting all jobs in parallel...")
    request_ids = {}
    for config in FRAMES_CONFIG:
        frame_id = config["id"]
        url = frame_urls[frame_id]
        request_id = submit_job(config, url)
        request_ids[frame_id] = request_id
        time.sleep(2)

    print("\nWaiting 90s for initial processing...")
    time.sleep(90)

    print("\nPolling and downloading results...")
    results = {}
    for config in FRAMES_CONFIG:
        frame_id = config["id"]
        request_id = request_ids[frame_id]
        result = poll_and_download(config, request_id)
        results[frame_id] = result

    print("\n=== SUMMARY ===")
    success = 0
    for frame_id, path in results.items():
        status = "OK" if path else "FAILED"
        print(f"  Frame {frame_id:02d}: {status} {path or ''}")
        if path:
            success += 1

    print(f"\n{success}/9 clips generated successfully")
    print(f"Output directory: {CLIPS_DIR.resolve()}")


if __name__ == "__main__":
    main()
