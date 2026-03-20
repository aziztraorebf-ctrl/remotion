"""
Gemini 3.1 Flash edit - End frame A-dos : rendre l'armee plus detaillee
tout en restant dans le meme style flat graphic
"""
import os, base64, json, urllib.request
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")
API_KEY     = os.getenv("GEMINI_API_KEY", "")
INPUT_PATH  = Path(__file__).parent.parent / "tmp/brainstorm/references/hannibal-endframe-A-dos-BEST.png"
OUTPUT_PATH = Path(__file__).parent.parent / "tmp/brainstorm/hannibal-endframe-army-detailed.png"

INSTRUCTION = """
You are a surgical image editor working on a flat graphic illustration.

The image shows a Carthaginian general seen from behind (purple cape, helmet with crest).
In the background, there are rows of navy blue soldier silhouettes on both sides.
The soldiers are currently very small and minimally detailed — just basic silhouettes.

Make ONLY this one change:
ENHANCE THE ARMY in the background — make the soldiers more detailed and more numerous while STRICTLY keeping the flat graphic style:
- Add more rows of soldiers, extending deeper into the background (perspective rows getting smaller)
- Add visible details to soldiers closer to foreground: shield shapes, spear tips pointing upward, helmet shapes
- The soldiers must remain flat navy blue silhouettes — NO shading, NO gradients, NO realistic rendering
- Keep the same flat geometric shapes — just more of them, more layered, more dense
- The army should feel vast and powerful

DO NOT change: the main character (Hannibal from behind), the mountains, the sky, the snow dots, the floor, the colors, or any other element.

Return only the edited image. No explanation.
"""

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
    print("No image returned.")
    return b""

if __name__ == "__main__":
    b64 = encode_image(INPUT_PATH)
    result = gemini_edit(b64)
    if result:
        OUTPUT_PATH.write_bytes(result)
        print(f"Saved: {OUTPUT_PATH}")
        import subprocess; subprocess.run(["open", str(OUTPUT_PATH)], check=False)
    else:
        print("FAILED")
