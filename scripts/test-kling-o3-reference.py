"""
Test Kling O3 reference-to-video — Beat04 (name)
Objectif : valider la coherence personnage Abou Bakari II cross-shots
Reference : beat02-man-profile-v1.png (profil) + abou-bakari-frontal-v1.png (face)
Start image : scene Beat04 generee par Gemini (portrait royal sur fond noir)
"""

import os
import time
import requests
import fal_client
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

ASSETS_DIR = Path(__file__).parent.parent / "public/assets/geoafrique"
OUTPUT_DIR = ASSETS_DIR
FAL_KEY = os.getenv("FAL_KEY")

os.environ["FAL_KEY"] = FAL_KEY


# --- Etape 1 : Generer l'image de scene Beat04 avec Gemini ---

def generate_beat04_scene():
    print("=== Etape 1 : Generation scene Beat04 (Gemini) ===")
    output_path = ASSETS_DIR / "beat04-name-scene-v1.png"

    # v2 : utiliser l'image avec le roi deja assis (corrige le pop/morphing O3)
    output_path_v2 = ASSETS_DIR / "beat04-name-scene-v2.png"
    if output_path_v2.exists():
        print(f"  Image v2 trouvee (roi deja assis) : {output_path_v2}")
        return str(output_path_v2)

    if output_path.exists():
        print(f"  Image v1 trouvee (trone vide) : {output_path}")
        return str(output_path)

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = """
Flat design vector illustration. Strict 2D, NO photorealism, NO 3D.

Scene: Majestic composition for a West African king reveal.
A central throne — geometric gold shapes, angular and powerful, slightly elevated.
Behind the throne: the faint ghost outline of the Mali Empire map, very subtle, dark gold on black.
Decorative geometric border elements in corners inspired by Islamic/African patterns, in dark gold.
Atmosphere: pure darkness, the throne emerges from shadow, divine light from above (subtle gold glow).

NO human figure in this image — the person will be composited by Kling.
The throne is empty — waiting.

Color palette:
- Background: #050208 (black)
- Throne: #D4AF37 (gold) with #B8942A (darker gold) details
- Map ghost: #1a1508 (very subtle)
- Decorative elements: #2a1f05

Format: 9:16 vertical (1080x1920)
NO text, NO labels.
Minimal, iconic, premium documentary aesthetic.
"""

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    image_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
            break

    if not image_bytes:
        print("  ERROR: No image in response")
        return None

    with open(output_path, "wb") as f:
        f.write(image_bytes)

    print(f"  Saved: {output_path}")
    return str(output_path)


# --- Etape 2 : Upload images sur fal.ai storage ---

def upload_to_fal(local_path: str, label: str) -> str:
    print(f"  Uploading {label}...")
    url = fal_client.upload_file(local_path)
    print(f"  URL: {url}")
    return url


# --- Etape 3 : Lancer Kling O3 reference-to-video ---

def run_kling_o3(start_image_url: str, frontal_url: str, reference_url: str) -> str:
    print("\n=== Etape 3 : Kling O3 reference-to-video ===")

    result = fal_client.submit(
        "fal-ai/kling-video/o3/standard/reference-to-video",
        arguments={
            "start_image_url": start_image_url,
            "prompt": "The West African king Abou Bakari II appears on his throne. "
                      "Sub-cinematic breathing motion, eyes open, calm and powerful expression. "
                      "Maintain strict flat vector 2D illustration style. "
                      "NO 3D rendering, NO photorealism. "
                      "The character is a flat 2D shape. Background is locked matte black. "
                      "Gentle light from above on the golden cap and garment.",
            "negative_prompt": "photorealistic, 3D render, morphing, distortion, text, watermark, "
                               "extra characters, background change, realistic skin texture",
            "elements": [
                {
                    "reference_image_urls": [reference_url],
                    "frontal_image_url": frontal_url,
                }
            ],
            "duration": "5",
            "aspect_ratio": "9:16",
            "cfg_scale": 0.35,
            "generate_audio": False,
        },
    )

    print(f"  Job submitted. Request ID: {result.request_id}")
    print("  Waiting for result (polling every 15s)...")

    while True:
        status = fal_client.status("fal-ai/kling-video/o3/standard/reference-to-video", result.request_id, with_logs=False)
        state = status.status if hasattr(status, 'status') else str(type(status).__name__)
        print(f"  Status: {state}")

        if "Completed" in state or "completed" in state.lower():
            break
        if "Failed" in state or "failed" in state.lower():
            print(f"  ERROR: Job failed")
            return None

        time.sleep(15)

    final = fal_client.result("fal-ai/kling-video/o3/standard/reference-to-video", result.request_id)
    video_url = final.get("video", {}).get("url") or final.get("video_url")

    if not video_url:
        print(f"  ERROR: No video URL in result: {final}")
        return None

    print(f"  Video URL: {video_url}")

    # Download
    output_path = OUTPUT_DIR / "beat04-name-o3-v2.mp4"
    resp = requests.get(video_url, timeout=120)
    output_path.write_bytes(resp.content)
    size_mb = len(resp.content) / (1024 * 1024)
    print(f"  Downloaded: {output_path} ({size_mb:.1f} MB)")

    return str(output_path)


def main():
    print("=== Test Kling O3 reference-to-video — Beat04 (name) ===\n")

    # Etape 1 : scene Beat04
    scene_path = generate_beat04_scene()
    if not scene_path:
        return

    import subprocess
    subprocess.run(["open", scene_path], check=False)

    # Etape 2 : uploads
    print("\n=== Etape 2 : Upload des images sur fal.ai ===")
    start_url = upload_to_fal(scene_path, "scene Beat04")
    frontal_url = upload_to_fal(str(ASSETS_DIR / "abou-bakari-frontal-v1.png"), "frontal reference")
    reference_url = upload_to_fal(str(ASSETS_DIR / "beat02-man-profile-v1.png"), "Beat02 profil reference")

    # Etape 3 : Kling O3
    video_path = run_kling_o3(start_url, frontal_url, reference_url)

    if video_path:
        print(f"\nSUCCES : {video_path}")
        subprocess.run(["open", video_path], check=False)
    else:
        print("\nECHEC : verifier les logs ci-dessus")


if __name__ == "__main__":
    main()
