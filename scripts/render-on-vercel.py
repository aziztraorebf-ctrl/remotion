"""
Trigger a video render on Vercel Sandbox and return the MP4 URL.

Usage:
    python scripts/render-on-vercel.py --comp GeoTest --props '{"title": "Test"}'
    python scripts/render-on-vercel.py --comp GeoTest --props '{"title": "Abou Bakari II"}' --open

Returns a public Vercel Blob URL to the rendered MP4.
"""

import sys
import os
import json
import argparse
import uuid
from pathlib import Path

try:
    import requests
except ImportError:
    os.system(f"{sys.executable} -m pip install requests -q")
    import requests

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass

RENDER_API_URL = os.getenv(
    "VERCEL_RENDER_URL",
    "https://remotion-renderer-khaki.vercel.app"
)


def trigger_render(composition_id: str, input_props: dict) -> str:
    url = f"{RENDER_API_URL}/api/render"

    print(f"Triggering render: {composition_id}")
    print(f"Props: {json.dumps(input_props, indent=2)}")
    print(f"Endpoint: {url}")
    print()

    payload = {
        "id": str(uuid.uuid4()),
        "compositionId": composition_id,
        "inputProps": input_props,
    }

    response = requests.post(
        url,
        json=payload,
        headers={"Content-Type": "application/json"},
        stream=True,
    )

    if response.status_code != 200:
        print(f"ERROR ({response.status_code}): {response.text}")
        sys.exit(1)

    video_url = None
    for line in response.iter_lines():
        if not line:
            continue
        line = line.decode("utf-8")
        if line.startswith("data: "):
            try:
                data = json.loads(line[6:])
            except json.JSONDecodeError:
                continue

            if data.get("type") == "phase":
                progress = data.get("progress", 0)
                phase = data.get("phase", "")
                bar = "#" * int(progress * 30) + "-" * (30 - int(progress * 30))
                print(f"\r  [{bar}] {progress*100:.0f}% {phase}", end="", flush=True)

            elif data.get("type") == "done":
                video_url = data.get("url", "")
                size_mb = data.get("size", 0) / (1024 * 1024)
                print(f"\n\nRender complete!")
                print(f"Size: {size_mb:.1f} MB")
                print(f"URL: {video_url}")

            elif data.get("type") == "error":
                print(f"\n\nERROR: {data.get('message', 'Unknown error')}")
                sys.exit(1)

    return video_url


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Render video on Vercel")
    parser.add_argument("--comp", default="MyComp", help="Composition ID (e.g. GeoTest, MyComp)")
    parser.add_argument("--props", default='{"title": "Test Render"}', help="JSON input props")
    parser.add_argument("--open", action="store_true", help="Open URL in browser after render")

    args = parser.parse_args()

    try:
        props = json.loads(args.props)
    except json.JSONDecodeError:
        print(f"ERROR: Invalid JSON props: {args.props}")
        sys.exit(1)

    video_url = trigger_render(args.comp, props)

    if args.open and video_url:
        import subprocess
        subprocess.run(["open", video_url])
