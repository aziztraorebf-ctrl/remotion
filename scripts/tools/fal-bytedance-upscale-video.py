"""fal-bytedance-upscale-video.py — Upscale video via ByteDance Upscaler (fal.ai).

Voir memory/tools/minimax-h3-styles-tests.md pour le contexte (test comparatif upscalers 2026-08-13).
Endpoint : fal-ai/bytedance-upscaler/upscale/video. Tarif : $0.0072/s (1080p, 30fps),
$0.0144/s (2K), $0.0288/s (4K) ; mode pro = 10x le prix.

Usage :
    python3 scripts/tools/fal-bytedance-upscale-video.py \
        --video-url https://.../clip.mp4 \
        --resolution 1080p \
        --output out/upscaled.mp4
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

MODEL = "fal-ai/bytedance-upscaler/upscale/video"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video-url", required=True, help="URL publique du clip source")
    ap.add_argument("--resolution", default="1080p", choices=["1080p", "2k", "4k"])
    ap.add_argument("--pro", action="store_true", help="mode pro, 10x le prix")
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    print(f"[1/2] {MODEL} ({args.resolution}, pro={args.pro})... peut prendre plusieurs minutes")
    result = fal_client.subscribe(
        MODEL,
        arguments={
            "video_url": args.video_url,
            "resolution": args.resolution,
            "mode": "pro" if args.pro else "normal",
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
    print(f"[2/2] Download -> {out}")
    r = requests.get(video_url, timeout=300)
    r.raise_for_status()
    out.write_bytes(r.content)
    print(f"Done: {out} ({len(r.content)/1024:.0f} KB)")
    print(f"video_url source: {video_url}")


if __name__ == "__main__":
    main()
