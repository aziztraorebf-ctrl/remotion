"""
Edit chirurgical du portrait Amanirenas via Gemini 3.1 Flash Image.
Deux corrections simultanees :
  1. Couronne de laurier (romaine) -> couronne meroitique (pschent + uraeus)
  2. Oeil droit ouvert -> oeil droit ferme/cicatrice de bataille
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
INPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-portrait-vivid-REF.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-portrait-vivid-REF-v2.png"

PROMPT = """Edit this flat 2D graphic portrait with two precise surgical changes. Keep EVERYTHING else exactly identical.

CHANGE 1 — CROWN (critical historical fix):
Remove the laurel wreath crown entirely. Replace it with a Kushite/Meroitic royal crown:
- Tall flat-topped cylindrical crown in deep red/crimson flat color
- A gold uraeus cobra rising from the front center of the crown (flat 2D shape, same graphic style as rest of image)
- The crown sits high on the head, taller than the laurel wreath was
- Keep the same flat 2D bold graphic style — no gradients, no shading, flat color fills only

CHANGE 2 — RIGHT EYE (battle wound):
The right eye (viewer's left) must be visually different from the left eye:
- Left eye: remains as drawn (closed eyelid line in gold)
- Right eye: replace the gold eyelid line with a short diagonal scar mark — a flat gold diagonal slash across where the eye was, indicating a battle wound that permanently closed the eye
- Same flat 2D graphic style — just a simple diagonal mark, no realistic scarring

DO NOT CHANGE:
- Face shape, skin color, neck, shoulders
- Clothing (white garment, blue V-collar)
- Background color (golden yellow)
- Any other facial features (nose, lips, left eye)
- Overall composition or proportions"""


def encode_image(path: Path) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: GEMINI_API_KEY not set")
        exit(1)
    if not INPUT_PATH.exists():
        print(f"ERROR: Input not found: {INPUT_PATH}")
        exit(1)

    print(f"Input : {INPUT_PATH}")
    print("Sending to Gemini 3.1 Flash for surgical edit...")

    image_b64 = encode_image(INPUT_PATH)

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

    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    for part in result["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            OUTPUT_PATH.write_bytes(base64.b64decode(part["inlineData"]["data"]))
            size_kb = OUTPUT_PATH.stat().st_size // 1024
            print(f"Saved: {OUTPUT_PATH} ({size_kb} KB)")
            subprocess.run(["open", str(OUTPUT_PATH)], check=False)
            exit(0)

    print("No image returned. Text response:")
    for part in result["candidates"][0]["content"]["parts"]:
        if "text" in part:
            print(part["text"][:400])
    exit(1)
