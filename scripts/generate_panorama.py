"""
Generate medieval street panorama via GPT-Image-1 (gpt-image-1)
Target: 1792x1024px (closest to 1920x540 supported by API), then crop/scale in code
Style: pixel art, side-view medieval street, dusk lighting
"""

import os
import base64
import requests
from pathlib import Path

API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    # Try reading from .env
    env_path = Path(__file__).parent.parent / ".env"
    with open(env_path) as f:
        for line in f:
            if line.startswith("OPENAI_API_KEY="):
                API_KEY = line.strip().split("=", 1)[1]
                break

OUTPUT_DIR = Path(__file__).parent.parent / "public/assets/peste-pixel/pixellab/side-view/backgrounds"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """Pixel art medieval street scene, horizontal panorama, side-view perspective.
A narrow cobblestone street in a 14th century European town at dusk.
Left to right: continuous row of medieval half-timbered buildings with warm amber windows,
a stone church with a pointed spire, more timber-frame houses.
Ground: dark grey cobblestone pavement, continuous and flat.
Sky: deep purple-indigo gradient with hints of red at horizon.
Style: 16-bit pixel art, 32 colors maximum, clean pixel outlines, flat side-view (no isometric),
buildings fill upper 70% of frame, cobblestone ground fills bottom 30%.
No characters, no people. Seamless left-to-right composition.
Mood: ominous medieval plague era, torchlight flickering in windows."""

print(f"Generating panorama with GPT-Image-1...")
print(f"Prompt: {PROMPT[:100]}...")

response = requests.post(
    "https://api.openai.com/v1/images/generations",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    },
    json={
        "model": "gpt-image-1",
        "prompt": PROMPT,
        "n": 1,
        "size": "1536x1024",
        "quality": "high",
        "output_format": "png",
    },
    timeout=120,
)

if response.status_code != 200:
    print(f"ERROR {response.status_code}: {response.text}")
    exit(1)

data = response.json()
print(f"Response keys: {list(data.keys())}")

if "data" in data and len(data["data"]) > 0:
    img_data = data["data"][0]

    if "b64_json" in img_data:
        img_bytes = base64.b64decode(img_data["b64_json"])
        output_path = OUTPUT_DIR / "medieval-street-panorama.png"
        with open(output_path, "wb") as f:
            f.write(img_bytes)
        print(f"Saved to: {output_path} ({len(img_bytes):,} bytes)")
    elif "url" in img_data:
        url = img_data["url"]
        print(f"Got URL: {url}")
        img_response = requests.get(url, timeout=60)
        output_path = OUTPUT_DIR / "medieval-street-panorama.png"
        with open(output_path, "wb") as f:
            f.write(img_response.content)
        print(f"Saved to: {output_path} ({len(img_response.content):,} bytes)")
    else:
        print(f"Unknown response format: {img_data}")
else:
    print(f"No image data in response: {data}")
