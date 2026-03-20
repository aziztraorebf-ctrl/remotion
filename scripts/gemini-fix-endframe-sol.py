"""
Gemini chirurgical -- Fix endframe sol + boucliers
1. Remplacer les bandes blanches du sol par du sable uni dore
2. Uniformiser les boucliers en navy fonce (pas terracotta/orange)
Conserver tout le reste : reine, guerriers, pyramides, soleil, ciel
"""

import os, base64, json, urllib.request, subprocess, tempfile
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")
API_KEY    = os.getenv("GEMINI_API_KEY", "")
INPUT      = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-endframe-v5-sol.png"
OUTPUT     = Path(__file__).parent.parent / "tmp/brainstorm/references/amanirenas-endframe-v6-final.png"
RESIZED    = Path(tempfile.gettempdir()) / "endframe-v5-resize.png"

INSTRUCTION = """Make ONE surgical change to this image:

CHANGE -- Warrior shields:
The warriors are holding round shields that are terracotta/orange/brown colored.
Change ALL round shields to dark navy blue (#1A1F5E) -- flat solid circles, same dark tone as the warrior bodies.
Every single shield must become navy. There are shields visible on both sides and in the center rows.

DO NOT change anything else:
- Keep the queen exactly as-is
- Keep all warrior bodies, spears, positions exactly as-is
- Keep the ground exactly as-is
- Keep the pyramids, sun, sky exactly as-is

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
    print("Sending endframe to Gemini -- fixing ground + shields...")
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
