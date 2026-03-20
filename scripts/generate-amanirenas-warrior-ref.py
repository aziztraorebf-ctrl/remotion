"""
Generate Amanirenas character references for Kling O3 elements param.
Produces two images via Gemini Flash Image:
  1. amanirenas-portrait-vivid-REF.png  -- portrait reserre face/buste (@Element1)
  2. amanirenas-warrior-type-REF.png    -- guerriere Meroe de dos (@Element2)
Style ref: amanirenas-recraft-vivid-startframe.png
"""

import os
import base64
import json
import urllib.request
import subprocess
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("GEMINI_API_KEY", "")
STYLE_REF_PATH = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-recraft-vivid-startframe.png"
OUTPUT_DIR = Path(__file__).parent.parent / "tmp/brainstorm/references"

PROMPT_PORTRAIT = """Generate a portrait of Queen Amanirenas of Meroe in the EXACT same flat 2D graphic style as the reference image.

STYLE (match exactly):
- Flat 2D bold graphic illustration, zero shading, zero gradients, zero textures
- Same warm palette as reference: gold, terracotta, deep warm skin tone, warm sky
- Bold contour lines, flat color fills only
- Same graphic language and level of detail as reference image

COMPOSITION:
- Queen facing camera, centered
- Cropped portrait -- face and upper bust only, no full body
- 9:16 vertical format
- No army, no pyramids, no background elements -- just the queen on a plain warm neutral background
- Crown or headdress visible at top of frame

CRITICAL: This image will be used as a character reference for AI video generation.
Must visually match the queen in the reference -- same flat graphic style, same warm palette."""

PROMPT_WARRIOR = """Generate a single Nubian/Kushite foot warrior in the EXACT same flat 2D graphic style as the reference image.

STYLE (match exactly):
- Flat 2D bold graphic illustration, zero shading, zero gradients, zero textures
- Body is a solid dark brown/black silhouette with minimal interior lines
- Round wooden shield in warm brown/ochre tones, held in front of the body
- Short terracotta or red-brown tunic
- Warm desert palette: terracotta, gold, dark skin, ochre
- Sandy gold ground, warm blue sky background

COMPOSITION:
- Single warrior, centered in frame
- Full body visible from helmet to feet
- Standing upright, body facing AWAY from viewer (back visible)
- 9:16 vertical format
- Spear visible in right hand

CRITICAL: This image will be used as a character reference for AI video generation.
The warrior must be visually consistent with the queen in the reference -- same graphic system, same warm palette."""


def encode_image(path: Path) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def generate_image(image_b64: str, prompt: str, output_path: Path, label: str) -> bool:
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-3.1-flash-image-preview:generateContent?key={API_KEY}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "image/png",
                            "data": image_b64,
                        }
                    },
                    {"text": prompt},
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["image", "text"],
        },
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    print(f"Sending {label} to Gemini Flash...")
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    for part in result["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            print(f"Image received for {label}.")
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(base64.b64decode(part["inlineData"]["data"]))
            size_kb = output_path.stat().st_size // 1024
            print(f"Saved: {output_path} ({size_kb} KB)")
            return True

    print(f"No image returned for {label}. Text response:")
    for part in result["candidates"][0]["content"]["parts"]:
        if "text" in part:
            print(part["text"][:300])
    return False


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: GEMINI_API_KEY not set in .env")
        exit(1)

    if not STYLE_REF_PATH.exists():
        print(f"ERROR: Style ref not found: {STYLE_REF_PATH}")
        exit(1)

    print(f"Style ref: {STYLE_REF_PATH}")
    image_b64 = encode_image(STYLE_REF_PATH)

    portrait_path = OUTPUT_DIR / "amanirenas-portrait-vivid-REF.png"
    warrior_path = OUTPUT_DIR / "amanirenas-warrior-type-REF.png"

    ok1 = generate_image(image_b64, PROMPT_PORTRAIT, portrait_path, "Amanirenas portrait REF")
    ok2 = generate_image(image_b64, PROMPT_WARRIOR, warrior_path, "warrior type REF")

    if ok1:
        subprocess.run(["open", str(portrait_path)], check=False)
    if ok2:
        subprocess.run(["open", str(warrior_path)], check=False)

    if ok1 and ok2:
        print("\nBoth REF images generated. Review before running elements script.")
    else:
        print("\nOne or more generations failed.")
        exit(1)
