"""Recupere 3 clips Abou Bakari generes manuellement sur fal.ai dashboard.

Endpoint : bytedance/seedance-2.0/image-to-video (confirme par Aziz)
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
from pathlib import Path

import fal_client

ENDPOINT = "bytedance/seedance-2.0/image-to-video"
OUTDIR = Path("public/assets/abou-bakari/clips")
OUTDIR.mkdir(parents=True, exist_ok=True)

JOBS = [
    ("name", "019dcf0f-d040-7de0-b700-6195fa027d7f"),
    ("colomb", "019dccb6-80ab-7080-a436-bbac46dbb879"),
    ("abdication", "019dccaa-ef9d-7921-99d6-2dcdb6f78784"),
]


def fetch(scene: str, request_id: str) -> bool:
    print(f"\n=== {scene} ({request_id}) ===")
    try:
        result = fal_client.result(ENDPOINT, request_id)
    except Exception as e:
        print(f"  fal_client.result failed: {e}")
        return False

    video = result.get("video")
    video_url = video.get("url") if isinstance(video, dict) else video
    if not video_url:
        print(f"  no video url. Result keys: {list(result.keys())}")
        print(f"  result preview: {json.dumps(result, indent=2)[:600]}")
        return False

    out_mp4 = OUTDIR / f"{scene}-v1.mp4"
    print(f"  downloading -> {out_mp4}")
    urllib.request.urlretrieve(video_url, out_mp4)

    (OUTDIR / f"{scene}-v1.meta.json").write_text(
        json.dumps({"request_id": request_id, "endpoint": ENDPOINT, "result": result}, indent=2)
    )
    (OUTDIR / f"{scene}-v1.request-id.txt").write_text(request_id)
    print(f"  SAVED ({out_mp4.stat().st_size / 1_000_000:.1f} MB)")
    return True


def main() -> int:
    if not os.environ.get("FAL_KEY"):
        print("ERROR: FAL_KEY env var not set")
        return 1

    results = {scene: fetch(scene, rid) for scene, rid in JOBS}

    print("\n=== SUMMARY ===")
    for scene, ok in results.items():
        print(f"  {scene}: {'OK' if ok else 'FAILED'}")
    return 0 if all(results.values()) else 2


if __name__ == "__main__":
    sys.exit(main())
