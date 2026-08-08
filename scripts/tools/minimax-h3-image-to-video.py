"""minimax-h3-image-to-video.py — MiniMax H3 image-to-video (fal.ai).

Anime une image de référence statique (flat illustration) en conservant fidèlement le style
d'origine. Voir memory/tools/minimax.md § H3 pour le contexte complet (coût ~$1.30/5s en 2K,
pas de lecture inversée native, une seule image de réf par personnage récurrent).

Usage :
    python3 scripts/tools/minimax-h3-image-to-video.py \
        --image src/projects/_client-sim/noteshield/refs/sarah-candidat-B-flat-color.jpg \
        --prompt "Slow cinematic pull-back camera revealing a laptop screen, character stays still" \
        --duration 5 \
        --output out/_client-sim/noteshield/h3-tests/p5-pullback-test1.mp4
"""
import argparse
import os
import sys
from pathlib import Path

import fal_client
import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

if not os.environ.get("FAL_KEY"):
    print("[ERROR] FAL_KEY missing dans .env", file=sys.stderr)
    sys.exit(1)

MODEL = "minimax/h3/image-to-video"


def upload_fal(path: Path) -> str:
    """Upload direct vers le storage fal.ai (evite le bug catbox content-length=0 observe)."""
    return fal_client.upload_file(str(path))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True)
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--duration", type=int, default=5)
    ap.add_argument("--resolution", default="2K", choices=["768P", "2K", "4K"])
    ap.add_argument("--output", required=True)
    ap.add_argument("--model", default=MODEL, help="override endpoint fal si besoin")
    args = ap.parse_args()

    img = Path(args.image)
    if not img.exists():
        print(f"[ERROR] image introuvable: {img}", file=sys.stderr)
        sys.exit(1)

    print(f"[1/3] Upload {img.name} -> fal storage...")
    image_url = upload_fal(img)
    print(f"      {image_url}")

    print(f"[2/3] {args.model} ({args.duration}s, {args.resolution})... peut prendre 1-3min")
    result = fal_client.subscribe(
        args.model,
        arguments={
            "image_url": image_url,
            "prompt": args.prompt,
            "duration": args.duration,
            "resolution": args.resolution,
        },
        with_logs=True,
    )

    video = result.get("video") or {}
    video_url = video.get("url")
    if not video_url:
        print(f"[ERROR] pas de video dans la reponse: {result}", file=sys.stderr)
        sys.exit(1)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    print(f"[3/3] Download -> {out}")
    r = requests.get(video_url, timeout=180)
    r.raise_for_status()
    out.write_bytes(r.content)
    print(f"Done: {out} ({len(r.content)/1024:.0f} KB)")
    print(f"video_url source: {video_url}")


if __name__ == "__main__":
    main()
