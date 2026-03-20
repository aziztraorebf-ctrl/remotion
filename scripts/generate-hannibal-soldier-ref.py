"""
Generate Carthaginian soldier type reference image via Gemini Flash.
Used as @Element2 in Kling elements param to lock army style.
Style must match exactly: flat 2D, black/navy silhouette, purple shield, mint green sky.
"""

import os
import base64
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("GEMINI_API_KEY", "")
STYLE_REF_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-solo-alpes-start.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/references/hannibal-soldier-type-REF.png"

PROMPT = """Generate a single Carthaginian foot soldier in the EXACT same flat 2D graphic style as the reference image.

STYLE (match exactly — this is critical):
- Flat 2D bold graphic illustration style, zero shading, zero gradients, zero textures
- Body is a solid dark navy/black silhouette with minimal interior lines
- Round purple/violet shield held in front of the body
- Short purple/violet tunic or cape element
- Pointed helmet same style as the general's helmet in the reference
- Mint green / turquoise sky background (#5ECFAA approx)
- Standing upright, body facing AWAY from viewer (back visible), same orientation as general
- Bold graphic line quality, flat color fills only

COMPOSITION:
- Single soldier, centered in frame
- Full body visible from helmet to feet
- 9:16 vertical format
- No weapons other than shield (no spear visible — keep it clean)

CRITICAL: This image will be used as a character reference for AI video generation.
The soldier must be visually consistent with the general in the reference image — same graphic style, same color palette, same level of detail. Think of them as the same illustration system."""


def encode_image(path: Path) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def generate_soldier(image_b64: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={API_KEY}"

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
                    {"text": PROMPT},
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

    print("Sending to Gemini Flash...")
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    for part in result["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            print("Image received.")
            return base64.b64decode(part["inlineData"]["data"])

    print("No image returned. Text response:")
    for part in result["candidates"][0]["content"]["parts"]:
        if "text" in part:
            print(part["text"])
    return b""


if __name__ == "__main__":
    print(f"Style ref: {STYLE_REF_PATH}")
    image_b64 = encode_image(STYLE_REF_PATH)
    result_bytes = generate_soldier(image_b64)

    if result_bytes:
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_PATH.write_bytes(result_bytes)
        size = OUTPUT_PATH.stat().st_size / 1024
        print(f"Saved: {OUTPUT_PATH} ({size:.0f} KB)")
        import subprocess
        subprocess.run(["open", str(OUTPUT_PATH)], check=False)
    else:
        print("FAILED - no image returned")
