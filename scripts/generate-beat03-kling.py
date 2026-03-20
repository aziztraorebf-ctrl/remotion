"""
Beat03 Fleet — Kling O3 start+end frame
Start : flotte immense de pirogues (God's Eye view)
End   : pirogue solitaire sur ocean hostile
Duree : 13s (duree exacte du beat Whisper)
"""

import fal_client
import os, time, urllib.request, pathlib
from dotenv import load_dotenv

load_dotenv(pathlib.Path(__file__).parent.parent / ".env")

ASSETS_DIR = pathlib.Path("public/assets/geoafrique")
START_FRAME = pathlib.Path("tmp/beat03-startframe-v1.png")
END_FRAME = pathlib.Path("tmp/beat03-endframe-v1.png")

def upload_image(path):
    print(f"Uploading {path.name}...")
    url = fal_client.upload_file(str(path))
    print(f"  -> {url}")
    return url

start_url = "https://v3b.fal.media/files/b/0a9249c4/PzVi20jjGQz2q5vnvONDa_beat03-startframe-v1.png"
end_url = "https://v3b.fal.media/files/b/0a9249c4/fKGh7Xe8xJU4XUhimLHxl_beat03-endframe-v1.png"
print(f"Reusing uploaded URLs")

print("Submitting Kling O3 job...")

handler = fal_client.submit(
    "fal-ai/kling-video/o3/standard/image-to-video",
    arguments={
        "prompt": "Shot 1 (5s): The camera slowly pulls back from the massive fleet of pirogues sailing westward into the dark ocean. Hundreds of sails fill the frame, moving steadily toward the horizon. Organic water movement, flat design preserved. Shot 2 (4s): The ocean grows darker and more turbulent. The fleet begins to scatter and thin. Threatening wave shapes emerge. Shot 3 (4s): A single lone pirogue remains, tiny against the vast hostile dark ocean. Large waves dwarf the boat. The emptiness is overwhelming.",
        "negative_prompt": "photorealistic, 3D render, text, watermark, gold elements, glowing effects, morphing boats into unrecognizable shapes",
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
print(f"Result: {result}")

video_url = result["video"]["url"]
out_path = ASSETS_DIR / "beat03-o3-fleet-v1.mp4"
print(f"Downloading to {out_path}...")
urllib.request.urlretrieve(video_url, out_path)
print(f"Saved: {out_path}")
