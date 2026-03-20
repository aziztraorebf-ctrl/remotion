"""
Beat03 Fleet — Kling O3 v2
Corrections : nouveau end frame (pirogue penchee) + prompt mouvement organique flotte
"""

import fal_client
import os, time, urllib.request, pathlib
from dotenv import load_dotenv

load_dotenv(pathlib.Path(__file__).parent.parent / ".env")

ASSETS_DIR = pathlib.Path("public/assets/geoafrique")

# Start frame : meme image, deja uploadee
start_url = "https://v3b.fal.media/files/b/0a9249c4/PzVi20jjGQz2q5vnvONDa_beat03-startframe-v1.png"

# End frame v2 : pirogue penchee dans la vague
print("Uploading end frame v2...")
end_url = fal_client.upload_file("tmp/beat03-endframe-v2.png")
print(f"  -> {end_url}")

print("Submitting Kling O3 v2 job...")

handler = fal_client.submit(
    "fal-ai/kling-video/o3/standard/image-to-video",
    arguments={
        "prompt": (
            "Shot 1 (5s): The massive fleet of Malian pirogues sails westward across the dark ocean. "
            "The sails billow and ripple with wind. The boats rock on organic waves, creating white foam wakes behind each hull. "
            "The fleet moves together with energy and purpose, hundreds of sails catching the wind. Flat design style preserved. "
            "Shot 2 (4s): The ocean becomes rougher. Large dark swells rise. The fleet scatters — boats tilt and diverge. "
            "The formation breaks apart as the current strengthens. "
            "Shot 3 (4s): A single pirogue remains, tilted sharply against a large wave, sail straining in the wind. "
            "The boat struggles violently against the water. Danger and isolation."
        ),
        "negative_prompt": (
            "photorealistic, 3D render, text, watermark, gold elements, "
            "calm water, static boats, still sails, no movement"
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
out_path = ASSETS_DIR / "beat03-o3-fleet-v2.mp4"
print(f"Downloading to {out_path}...")
urllib.request.urlretrieve(video_url, out_path)
print(f"Saved: {out_path}")
