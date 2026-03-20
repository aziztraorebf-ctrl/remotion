"""
Test Recraft V4 via API directe — Hannibal dans les Alpes
Modele : recraftv4_vector
But : verifier si les SVG V4 sont mieux structures (groupes, IDs) que V3
"""

import os
import subprocess
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("RECRAFT_API_KEY")
BASE_URL = "https://external.api.recraft.ai/v1"
OUTPUT_DIR = Path(__file__).parent.parent / "tmp/brainstorm"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT = """
Hannibal Barca leading war elephants through the snowy Alps, flat 2D vector illustration.
North African general in center foreground, olive bronze skin, purple cape, bronze armor.
One large war elephant behind him to the right, steam from trunk.
Two soldier silhouettes in the far background.
Snowy Alpine mountains, cold blue and white palette contrasting warm bronze tones.
Bold clean flat shapes, minimal detail, iconic composition.
Hannibal is the clear hero — large, centered, facing slightly left.
"""

def generate():
    print("=== Recraft V4 Vector — Hannibal Alps ===")
    print(f"Endpoint: {BASE_URL}/images/generations")

    response = requests.post(
        f"{BASE_URL}/images/generations",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "prompt": PROMPT,
            "model": "recraftv4_vector",
            "size": "1024x1024",
            "n": 1,
        },
        timeout=120,
    )

    if response.status_code != 200:
        print(f"ERROR {response.status_code}: {response.text}")
        return None

    data = response.json()
    print(f"Response keys: {list(data.keys())}")

    image_url = data.get("data", [{}])[0].get("url", "")
    if not image_url:
        print(f"No URL found. Full response: {data}")
        return None

    print(f"Image URL: {image_url}")

    img_response = requests.get(image_url, timeout=60)
    output_path = OUTPUT_DIR / "hannibal-recraft-v4.svg"
    with open(output_path, "wb") as f:
        f.write(img_response.content)

    size_kb = output_path.stat().st_size / 1024
    print(f"Saved: {output_path} ({size_kb:.0f} KB)")

    # Analyse structure SVG
    content = output_path.read_text()
    path_count = content.count("<path")
    group_count = content.count("<g")
    id_count = content.count("id=")
    print(f"\n=== SVG Structure Analysis ===")
    print(f"  <path> elements : {path_count}")
    print(f"  <g> groups      : {group_count}")
    print(f"  id= attributes  : {id_count}")

    if group_count > 0:
        print("  -> STRUCTURE PRESENTE — animation par elements possible")
    else:
        print("  -> PAS DE GROUPES — meme probleme que V3")

    return str(output_path)


if __name__ == "__main__":
    path = generate()
    if path:
        subprocess.run(["open", path], check=False)
