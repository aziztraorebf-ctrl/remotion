"""
Amanirenas startframe v2 -- posture dynamique + guerriers en silhouette pure
Deux outputs :
  1. startframe-dynamic.png : reine avec robe en mouvement, hint de vent
  2. endframe-silhouette.png : meme composition endframe v3 mais guerriers pure silhouette navy
"""

import os
import base64
import json
import urllib.request
import subprocess
import tempfile
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("GEMINI_API_KEY", "")
REF_DIR = Path(__file__).parent.parent / "tmp/brainstorm/references"

STARTFRAME_IN  = REF_DIR / "amanirenas-startframe-CANONICAL.png"
ENDFRAME_IN    = REF_DIR / "amanirenas-endframe-v3.png"
STARTFRAME_OUT = REF_DIR / "amanirenas-startframe-v2-dynamic.png"
ENDFRAME_OUT   = REF_DIR / "amanirenas-endframe-v4-silhouette.png"

RESIZED_START = Path(tempfile.gettempdir()) / "start-small.png"
RESIZED_END   = Path(tempfile.gettempdir()) / "end-small.png"

PROMPT_START = """Edit this image with surgical precision.

The queen stands perfectly still. Make her feel ALIVE with minimal changes:
1. Her white linen dress/robe: add subtle fabric movement -- the lower hem billows slightly to her LEFT as if caught by a desert wind. Just the hem, not the whole dress.
2. Her right arm holding the spear: tilt the spear very slightly (5 degrees) to the right -- not vertical anymore, slightly angled like she just shifted her weight.
3. Keep the bold diagonal scar mark on her RIGHT eye VISIBLE AND CLEAR -- it crosses the eye area diagonally. This is her defining feature.

DO NOT change:
- Her position (center of frame)
- Her tall red cylindrical pschent crown with gold uraeus
- Background (pyramids, sun, desert)
- The flat 2D graphic style and color palette

Return only the edited image. No text."""

PROMPT_END = """Edit this image with one surgical change.

The warriors in this scene have some visible details (clothing, body rendering).

Change: Make ALL warriors (except the queen in the center) into PURE DARK NAVY SILHOUETTES -- completely flat, zero internal detail, zero body rendering, just solid dark navy/near-black shapes. Like paper cutouts.

The queen in white stays exactly as she is -- white dress, red crown, blue collar detail. Do not touch her.

The spears the warriors hold can remain as thin gold/ochre lines (they help readability).
The round terracotta shields can remain as simple flat circles (no internal detail).

Everything else stays the same:
- Composition unchanged
- Background unchanged (pyramids, sun, ivory sky)
- Gold desert floor unchanged

The warriors should look like pure dark flat shadow silhouettes -- no muscle, no clothing detail, no face.

Return only the edited image. No text."""


def resize(src, dst, w=512, h=854):
    subprocess.run(["ffmpeg", "-y", "-i", str(src), "-vf", f"scale={w}:{h}", str(dst)],
                   check=True, capture_output=True)
    print(f"Resized {src.name} -> {dst.name}")


def encode(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def gemini_edit(b64, prompt, label):
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"gemini-3.1-flash-image-preview:generateContent?key={API_KEY}")
    payload = {
        "contents": [{"parts": [
            {"inline_data": {"mime_type": "image/png", "data": b64}},
            {"text": prompt}
        ]}],
        "generationConfig": {"responseModalities": ["image", "text"]}
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                                  headers={"Content-Type": "application/json"}, method="POST")
    print(f"Sending to Gemini -- {label}...")
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode())
    for part in result["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    print(f"No image for {label}")
    return None


if __name__ == "__main__":
    resize(STARTFRAME_IN, RESIZED_START)
    resize(ENDFRAME_IN, RESIZED_END)

    img = gemini_edit(encode(RESIZED_START), PROMPT_START, "startframe dynamic posture")
    if img:
        STARTFRAME_OUT.write_bytes(img)
        print(f"Saved: {STARTFRAME_OUT} ({STARTFRAME_OUT.stat().st_size // 1024} KB)")
        subprocess.run(["open", str(STARTFRAME_OUT)], check=False)
    else:
        print("FAILED: startframe")

    img = gemini_edit(encode(RESIZED_END), PROMPT_END, "endframe pure silhouettes")
    if img:
        ENDFRAME_OUT.write_bytes(img)
        print(f"Saved: {ENDFRAME_OUT} ({ENDFRAME_OUT.stat().st_size // 1024} KB)")
        subprocess.run(["open", str(ENDFRAME_OUT)], check=False)
    else:
        print("FAILED: endframe")
