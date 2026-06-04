"""
PixelLab REST /rotate — pont Gemini->PixelLab.
Prend un sprite de base (PNG transparent) et genere d'autres directions.

Usage:
    python3 scripts/tools/pixellab-rotate.py --image base.png --out-dir dir/ \
        --from-view side --from-dir south --to-view side --to-dirs east,west,north

Genere 1 fichier par direction cible : <out-dir>/<dir>.png
"""
import argparse
import base64
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
KEY = os.getenv("PIXELLAB_API_KEY")
if not KEY:
    print("ERROR: PIXELLAB_API_KEY missing")
    sys.exit(1)

API = "https://api.pixellab.ai/v1/rotate"


def b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--from-view", default="side")
    ap.add_argument("--from-dir", default="south")
    ap.add_argument("--to-view", default="side")
    ap.add_argument("--to-dirs", required=True, help="comma-separated target directions")
    ap.add_argument("--size", type=int, default=92)
    args = ap.parse_args()

    img = Path(args.image)
    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    src_b64 = b64(img)

    for d in args.to_dirs.split(","):
        d = d.strip()
        payload = {
            "image_size": {"width": args.size, "height": args.size},
            "from_image": {"type": "base64", "base64": src_b64},
            "from_view": args.from_view,
            "to_view": args.to_view,
            "from_direction": args.from_dir,
            "to_direction": d,
        }
        print(f"rotate {args.from_dir} -> {d} ...", flush=True)
        r = requests.post(API, json=payload, headers={"Authorization": f"Bearer {KEY}"}, timeout=180)
        if r.status_code != 200:
            print(f"  FAIL {r.status_code}: {r.text[:300]}")
            continue
        data = r.json()
        # la reponse contient l'image en base64 (cle 'image' ou 'images')
        img_b64 = None
        if isinstance(data, dict):
            if "image" in data and isinstance(data["image"], dict):
                img_b64 = data["image"].get("base64")
            elif "image" in data and isinstance(data["image"], str):
                img_b64 = data["image"]
            elif "rotated_image" in data:
                ri = data["rotated_image"]
                img_b64 = ri.get("base64") if isinstance(ri, dict) else ri
        if not img_b64:
            print(f"  no image in response. keys={list(data.keys()) if isinstance(data,dict) else type(data)}")
            print(f"  raw: {str(data)[:300]}")
            continue
        dest = out / f"{d}.png"
        dest.write_bytes(base64.b64decode(img_b64))
        print(f"  saved {dest}")


if __name__ == "__main__":
    main()
