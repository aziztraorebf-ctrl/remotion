"""
Kling O3 — Hannibal final 8s
Start : portrait REF canonical (de face)
End   : end frame final (de dos, armee detaillee)
"""
import os, time, urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

load_dotenv(Path(__file__).parent.parent / ".env")
os.environ["FAL_KEY"] = os.getenv("FAL_KEY", "")

START_PATH = Path(__file__).parent.parent / "tmp/brainstorm/references/hannibal-portrait-REF-CANONICAL.png"
END_PATH   = Path(__file__).parent.parent / "tmp/brainstorm/references/hannibal-endframe-FINAL.png"
OUTPUT     = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-o3-final-8s.mp4"

def upload(path):
    print(f"Uploading {path.name}...")
    with open(path, "rb") as f:
        url = fal_client.upload(f.read(), "image/png")
    print(f"  -> {url}")
    return url

if __name__ == "__main__":
    start_url = upload(START_PATH)
    end_url   = upload(END_PATH)

    print("\n=== Kling O3 — Hannibal face->dos 8s FINAL ===")
    handler = fal_client.submit(
        "fal-ai/kling-video/o3/standard/image-to-video",
        arguments={
            "image_url": start_url,
            "tail_image_url": end_url,
            "prompt": (
                "Hannibal Barca standing in the snowy Alps. "
                "He slowly turns from facing the camera to standing with his back to us, "
                "revealing his vast army on both sides. "
                "Purple cape flows as he turns. "
                "Flat graphic illustration style preserved throughout. "
                "Slow, majestic, epic movement."
            ),
            "negative_prompt": "photorealistic, 3D, style change, fast movement, shaking, morphing, distortion, text, watermark",
            "duration": "8",
            "aspect_ratio": "3:4",
            "cfg_scale": 0.3,
        },
    )

    req_id = handler.request_id
    print(f"Job ID: {req_id}")

    while True:
        status = fal_client.status("fal-ai/kling-video/o3/standard/image-to-video", req_id, with_logs=False)
        stype = type(status).__name__
        print(f"  {stype}")
        if stype == "Completed":
            break
        elif stype == "Failed":
            print(f"FAILED: {status}"); exit(1)
        time.sleep(15)

    result = fal_client.result("fal-ai/kling-video/o3/standard/image-to-video", req_id)
    video_url = result.get("video", {}).get("url", "")
    urllib.request.urlretrieve(video_url, OUTPUT)
    print(f"\nSaved: {OUTPUT} ({OUTPUT.stat().st_size/1024/1024:.1f} MB)")
    import subprocess; subprocess.run(["open", str(OUTPUT)], check=False)
