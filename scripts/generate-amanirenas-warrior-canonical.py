"""
Generate canonical warrior type REF for Amanirenas elements pipeline.
Uses startframe CANONICAL as style reference to guarantee palette coherence.
Produces: amanirenas-warrior-type-REF-canonical.png
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
STYLE_REF_PATH = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-startframe-CANONICAL.png"
OUTPUT_DIR = Path(__file__).parent.parent / "tmp/brainstorm/references"
OUTPUT_PATH = OUTPUT_DIR / "amanirenas-warrior-type-REF-canonical.png"
RESIZED_REF = Path(tempfile.gettempdir()) / "amanirenas-startframe-ref-small.png"

PROMPT_WARRIOR = """Generate a single Kushite/Meroitic foot warrior in the EXACT same flat 2D graphic style as the reference scene.

STYLE (match the reference image exactly):
- Flat 2D bold graphic illustration, zero shading, zero gradients, zero textures
- Body is a solid very dark navy/black silhouette with thin gold contour outline at edges
- Same palette as reference: warm ivory/cream sky, gold desert ground, dark navy silhouettes, muted terracotta/ochre accents
- Bold flat color fills only, no rendering, no realism
- Minimal interior lines, graphic silhouette-first approach

COMPOSITION:
- Single warrior, centered in frame
- Full body visible from head to feet
- Standing upright, body facing AWAY from viewer (back visible, we see the warrior's back)
- Feet pointing straight forward, parallel -- NOT duck feet, NOT splayed outward
- Short dark tunic, round wooden shield held in left arm close to body
- Spear held vertically in right hand, tip pointing upward
- 9:16 vertical format
- Simple warm neutral background (ivory/cream sky + gold ground strip), no scene elements

CRITICAL: Used as character reference for Kling AI video generation (elements parameter).
Must be visually consistent with the dark navy warrior silhouettes visible in the reference image.
Same graphic language, same palette, same flat 2D style. No photorealism whatsoever."""


def resize_image(src: Path, dst: Path, w: int = 512, h: int = 854):
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(src), "-vf", f"scale={w}:{h}", str(dst)],
        check=True,
        capture_output=True,
    )
    print(f"Resized {src.name} -> {dst} ({w}x{h})")


def encode_image(path: Path) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def generate_image(image_b64: str, prompt: str, output_path: Path) -> bool:
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

    print("Sending warrior canonical REF to Gemini Flash...")
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    for part in result["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            print("Image received.")
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(base64.b64decode(part["inlineData"]["data"]))
            size_kb = output_path.stat().st_size // 1024
            print(f"Saved: {output_path} ({size_kb} KB)")
            return True

    print("No image returned. Text response:")
    for part in result["candidates"][0]["content"]["parts"]:
        if "text" in part:
            print(part["text"][:400])
    return False


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: GEMINI_API_KEY not set in .env")
        exit(1)

    if not STYLE_REF_PATH.exists():
        print(f"ERROR: Style ref not found: {STYLE_REF_PATH}")
        exit(1)

    print(f"Style ref: {STYLE_REF_PATH}")
    resize_image(STYLE_REF_PATH, RESIZED_REF)
    image_b64 = encode_image(RESIZED_REF)

    ok = generate_image(image_b64, PROMPT_WARRIOR, OUTPUT_PATH)

    if ok:
        subprocess.run(["open", str(OUTPUT_PATH)], check=False)
        print("\nWarrior canonical REF generated. Review before launching elements script.")
    else:
        print("\nGeneration failed.")
        exit(1)
