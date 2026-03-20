"""
Gemini chirurgical -- Fix startframe sol
Remplacer les bandes blanches horizontales du sol par du sable uni dore
Conserver tout le reste : reine, pyramides, soleil, ciel
"""

import os, base64, json, urllib.request, subprocess, tempfile
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")
API_KEY    = os.getenv("GEMINI_API_KEY", "")
INPUT      = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-startframe-v2-clean.png"
OUTPUT     = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-startframe-v3-sol.png"
RESIZED    = Path(tempfile.gettempdir()) / "startframe-v2-resize.png"

INSTRUCTION = """Fix ONLY the ground/desert floor area in the lower half of this image.

The desert floor currently has multiple horizontal white stripes crossing it.
These white bands make the ground look like a river or water surface -- this is wrong.

Replace the entire ground/floor area with a clean desert ground:
- Solid warm gold/amber color (#C8922A range) -- flat, no stripes
- You may add 1-2 very subtle, gentle sand dune curves (soft, organic shapes, NOT horizontal lines)
- The dunes should be low and wide -- desert landscape, not geometric stripes
- Match the gold/amber tone already present between the white stripes

DO NOT change anything else:
- Keep the queen exactly as-is (position, dress, crown, face, spear)
- Keep the pyramids exactly as-is
- Keep the orange sun exactly as-is
- Keep the sky (cream/peach) exactly as-is
- Only fix the ground stripes

Return only the edited image."""


def resize(src, dst):
    subprocess.run(["ffmpeg", "-y", "-i", str(src), "-vf", "scale=512:910", str(dst)],
                   check=True, capture_output=True)

def encode(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

if __name__ == "__main__":
    resize(INPUT, RESIZED)
    b64 = encode(RESIZED)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={API_KEY}"
    payload = {
        "contents": [{"parts": [
            {"inline_data": {"mime_type": "image/png", "data": b64}},
            {"text": INSTRUCTION},
        ]}],
        "generationConfig": {"responseModalities": ["image", "text"]},
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    print("Sending startframe to Gemini -- fixing ground stripes...")
    with urllib.request.urlopen(req, timeout=120) as r:
        result = json.loads(r.read())

    for part in result["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            OUTPUT.write_bytes(base64.b64decode(part["inlineData"]["data"]))
            print(f"Saved: {OUTPUT} ({OUTPUT.stat().st_size // 1024} KB)")
            subprocess.run(["open", str(OUTPUT)], check=False)
            break
    else:
        print("No image returned.")
        for part in result["candidates"][0]["content"]["parts"]:
            if "text" in part:
                print(part["text"][:300])
