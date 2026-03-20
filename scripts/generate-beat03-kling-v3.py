"""
Beat03 Fleet — Kling O3 v3
Correction timing : transition flotte->pirogue a 5s (pas 10s)
Objectif : pirogue solitaire visible quand la voix dit "un seul bateau revient" (frame 150)
Memes frames start+end que v2
"""

import fal_client
import os, time, urllib.request, pathlib
from dotenv import load_dotenv

load_dotenv(pathlib.Path(__file__).parent.parent / ".env")

ASSETS_DIR = pathlib.Path("public/assets/geoafrique")

# Memes frames que v2 — deja uploadees
start_url = "https://v3b.fal.media/files/b/0a9249c4/PzVi20jjGQz2q5vnvONDa_beat03-startframe-v1.png"
end_url = "https://v3b.fal.media/files/b/0a924a36/-QJdR7_2soqOoTOKCoVhq_beat03-endframe-v2.png"

print("Submitting Kling O3 v3 job (transition a 5s)...")

handler = fal_client.submit(
    "fal-ai/kling-video/o3/standard/image-to-video",
    arguments={
        "prompt": (
            "Shot 1 (4s): A massive fleet of Malian pirogues sails powerfully westward. "
            "Hundreds of sails billow in the wind, boats rock on organic waves, white foam wakes trail each hull. "
            "Flat design style preserved. "
            "Shot 2 (1s): Quick transition — the ocean darkens abruptly, the fleet vanishes into the deep. "
            "Shot 3 (8s): A single lone pirogue remains, tilted against a large wave, sail straining. "
            "The boat struggles against the hostile dark ocean. Long hold on the lone survivor."
        ),
        "negative_prompt": (
            "photorealistic, 3D render, text, watermark, gold elements, "
            "calm water, static boats, still sails"
        ),
        "image_url": start_url,
        "end_image_url": end_url,
        "duration": "13",
        "aspect_ratio": "9:16",
        "cfg_scale": 0.4,
    }
)

print(f"Job submitted. Request ID: {handler.request_id}")
print("Waiting 120s...")
time.sleep(120)

result = fal_client.result("fal-ai/kling-video/o3/standard/image-to-video", handler.request_id)

video_url = result["video"]["url"]
out_path = ASSETS_DIR / "beat03-o3-fleet-v3.mp4"
print(f"Downloading to {out_path}...")
urllib.request.urlretrieve(video_url, out_path)
print(f"Saved: {out_path}")
