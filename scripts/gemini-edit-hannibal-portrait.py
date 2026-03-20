"""
Gemini Flash image edit - Hannibal portrait surgical fixes:
1. Replace navy background band with mint green + white snow dots
2. Replace right eye with a closed diagonal scar line
"""

import os
import base64
import json
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("GEMINI_API_KEY", "")
INPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-portrait-base.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-portrait-ref-v2.png"

EDIT_INSTRUCTION = """
You are a surgical image editor working on a flat graphic illustration of a Carthaginian general.
Make ONLY these two changes — do not alter anything else:

1. BACKGROUND FIX: There is a wide dark navy blue horizontal band across the middle of the image behind the character. Replace this navy band with the same mint green color (#5ECFAA) used in the upper portion of the background. Add a few small white circular dots in this area to match the snow dots already visible above. The full background behind the character must be uniform mint green.

2. CAPE COLOR FIX: The character has a cape/cloak visible behind and beside his body. This cape must be PURPLE / VIOLET color (approximately #7B4FA6 or similar deep purple). If the cape currently appears mint green or any other color, repaint it purple. The cape is a key identifying element of this character.

PRESERVE EXACTLY as-is:
- The character's face, helmet, armor, sword, legs, sandals
- The diagonal scar line on the character's right eye (viewer's left side of face)
- The striped mint/white floor pattern at the bottom
- All snow dots in the upper background
- All navy blue dark shapes on the character's body

Return the edited image only. No explanation.
"""


def encode_image(path: Path) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def gemini_edit(image_b64: str) -> bytes:
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
                    {"text": EDIT_INSTRUCTION},
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
            print("Image received from Gemini.")
            return base64.b64decode(part["inlineData"]["data"])

    print("No image in response. Text response:")
    for part in result["candidates"][0]["content"]["parts"]:
        if "text" in part:
            print(part["text"])
    return b""


if __name__ == "__main__":
    print(f"Input: {INPUT_PATH}")
    image_b64 = encode_image(INPUT_PATH)
    result_bytes = gemini_edit(image_b64)

    if result_bytes:
        OUTPUT_PATH.write_bytes(result_bytes)
        print(f"Saved: {OUTPUT_PATH}")
        import subprocess
        subprocess.run(["open", str(OUTPUT_PATH)], check=False)
    else:
        print("FAILED - no image returned")
