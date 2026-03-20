"""
Beat04 — Kling V3 image-to-video
Objectif : animer le roi assis sur son trone avec V3 (meilleur pour flat design personnages)
Source : beat04-name-scene-v2.png (roi deja assis — evite le pop O3)
cfg_scale : 0.35 (valide Beat02, regle 9 kling-pipeline.md)
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
OUTPUT_PATH = ASSETS_DIR / "beat04-name-v3-v2.mp4"

os.environ["FAL_KEY"] = os.getenv("FAL_KEY")


def main():
    print("=== Beat04 — Kling V3 image-to-video ===")

    source = ASSETS_DIR / "beat04-name-scene-v2.png"
    if not source.exists():
        print(f"ERROR: Image source introuvable : {source}")
        return

    print(f"Source : {source}")
    print("Upload sur fal.ai...")
    image_url = fal_client.upload_file(str(source))
    print(f"URL : {image_url}")

    print("\nSoumission Kling V3 standard...")
    result = fal_client.submit(
        "fal-ai/kling-video/v3/standard/image-to-video",
        arguments={
            "prompt": (
                "Slow cinematic Dolly In towards the king on his throne. "
                "The camera moves forward steadily and powerfully. "
                "Mansa Abou Bakari II remains absolutely still — a sovereign carved in gold. "
                "Eyes open, gaze locked forward, expression of unshakeable authority. "
                "Subtle gold dust particles float in the spotlight beam above him. "
                "The throne fills more of the frame as the camera approaches. "
                "Flat 2D vector illustration style preserved. Background locked matte black."
            ),
            "negative_prompt": (
                "sad, melancholic, sighing, head tilt, drooping, slouching, "
                "photorealistic, 3D render, morphing, camera shake, zoom distortion, "
                "text, watermark, extra characters, background change, realistic skin texture"
            ),
            "image_url": image_url,
            "duration": "5",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.4,
        },
    )

    print(f"Request ID : {result.request_id}")
    print("Polling (toutes les 15s)...")

    while True:
        status = fal_client.status(
            "fal-ai/kling-video/v3/standard/image-to-video",
            result.request_id,
            with_logs=False,
        )
        state = status.status if hasattr(status, "status") else type(status).__name__
        print(f"  Status : {state}")

        if "Completed" in state or "completed" in state.lower():
            break
        if "Failed" in state or "failed" in state.lower():
            print("  ERREUR : job echoue")
            return

        time.sleep(15)

    final = fal_client.result(
        "fal-ai/kling-video/v3/standard/image-to-video", result.request_id
    )
    video_url = final.get("video", {}).get("url") or final.get("video_url")

    if not video_url:
        print(f"  ERREUR : pas d'URL video dans le resultat : {final}")
        return

    print(f"\nVideo URL : {video_url}")
    resp = requests.get(video_url, timeout=120)
    OUTPUT_PATH.write_bytes(resp.content)
    size_mb = len(resp.content) / (1024 * 1024)
    print(f"Sauvegarde : {OUTPUT_PATH} ({size_mb:.1f} MB)")

    import subprocess
    subprocess.run(["open", str(OUTPUT_PATH)], check=False)


if __name__ == "__main__":
    main()
