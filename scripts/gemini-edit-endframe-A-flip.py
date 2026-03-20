"""
Gemini 3.1 Flash edit - Amanirenas endframe v2 -> v3
Fix: supprimer les bandes blanches horizontales dans le ciel
Remplacer par ciel uni chaud ivoire/peche, conserver toute la composition
"""
import os, base64, json, urllib.request, subprocess, tempfile
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")
API_KEY     = os.getenv("GEMINI_API_KEY", "")
INPUT_PATH  = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-endframe-v2.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-endframe-v3.png"
RESIZED     = Path(tempfile.gettempdir()) / "endframe-v2-small.png"

INSTRUCTION = """Fix ONLY the sky area in the upper portion of this image.

The sky currently has horizontal white bands/stripes crossing it -- these are unwanted artifacts.

Replace the entire sky area (above the pyramids and army) with a smooth, solid warm color:
- Warm ivory/cream or soft peach tone -- no bands, no stripes, no gradients with harsh edges
- Match the overall warm desert palette of the scene (gold, terracotta, navy)
- The sky should be a single flat warm tone, completely clean

DO NOT change anything else:
- Keep the queen exactly as-is (white dress, red crown, center position)
- Keep all warriors exactly as-is
- Keep the pyramids exactly as-is
- Keep the orange sun exactly as-is
- Keep the gold desert floor exactly as-is
- Only fix the sky bands.

Return only the edited image. No explanation."""


def resize(src, dst, w=512, h=854):
    subprocess.run(["ffmpeg", "-y", "-i", str(src), "-vf", f"scale={w}:{h}", str(dst)],
                   check=True, capture_output=True)


def encode_image(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def gemini_edit(b64):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={API_KEY}"
    payload = {
        "contents": [{"parts": [
            {"inline_data": {"mime_type": "image/png", "data": b64}},
            {"text": INSTRUCTION},
        ]}],
        "generationConfig": {"responseModalities": ["image", "text"]},
    }
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    print("Sending to Gemini 3.1 Flash...")
    with urllib.request.urlopen(req, timeout=120) as r:
        result = json.loads(r.read())
    for part in result["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            print("Image received.")
            return base64.b64decode(part["inlineData"]["data"])
    print("No image. Text:", result["candidates"][0]["content"]["parts"])
    return b""


if __name__ == "__main__":
    resize(INPUT_PATH, RESIZED)
    b64 = encode_image(RESIZED)
    result = gemini_edit(b64)
    if result:
        OUTPUT_PATH.write_bytes(result)
        print(f"Saved: {OUTPUT_PATH} ({OUTPUT_PATH.stat().st_size // 1024} KB)")
        subprocess.run(["open", str(OUTPUT_PATH)], check=False)
    else:
        print("FAILED")
