"""
Upload files to Vercel Blob storage for remote asset review.

Usage:
    python scripts/upload-to-blob.py <file_path> [--folder <folder>]
    python scripts/upload-to-blob.py --gallery <title> <file1> <file2> ... [--folder <folder>]
    python scripts/upload-to-blob.py --list
    python scripts/upload-to-blob.py --list --folder <folder>

Examples:
    python scripts/upload-to-blob.py output/beat05-audio-v1.mp3
    python scripts/upload-to-blob.py --gallery "Amanirenas Review" img1.png img2.png audio.mp3 --folder review/2026-03-27
    python scripts/upload-to-blob.py --list

Returns public URLs that can be opened on any device (mobile, desktop).
"""

import sys
import os
import argparse
import json
import tempfile
from datetime import datetime
from pathlib import Path

try:
    import requests
except ImportError:
    print("Installing requests...")
    os.system(f"{sys.executable} -m pip install requests -q")
    import requests

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

BLOB_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
BLOB_API_URL = "https://blob.vercel-storage.com"

CONTENT_TYPES = {
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".json": "application/json",
    ".txt": "text/plain",
    ".html": "text/html",
}


def _check_token():
    if not BLOB_TOKEN:
        print("ERROR: BLOB_READ_WRITE_TOKEN not found in .env")
        sys.exit(1)


def upload_file(file_path: str, folder: str = "") -> str:
    _check_token()

    path = Path(file_path)
    if not path.exists():
        print(f"ERROR: File not found: {file_path}")
        sys.exit(1)

    content_type = CONTENT_TYPES.get(path.suffix.lower(), "application/octet-stream")
    pathname = f"{folder}/{path.name}" if folder else path.name

    file_size = path.stat().st_size
    size_mb = file_size / (1024 * 1024)
    print(f"Uploading: {path.name} ({size_mb:.1f} MB, {content_type})")

    with open(path, "rb") as f:
        response = requests.put(
            f"{BLOB_API_URL}/{pathname}",
            headers={
                "Authorization": f"Bearer {BLOB_TOKEN}",
                "x-content-type": content_type,
                "x-api-version": "7",
                "x-cache-control-max-age": "31536000",
            },
            data=f,
        )

    if response.status_code != 200:
        print(f"ERROR ({response.status_code}): {response.text}")
        sys.exit(1)

    result = response.json()
    url = result.get("url", "")
    print(f"  -> {url}")
    return url


def upload_bytes(data: bytes, pathname: str, content_type: str) -> str:
    _check_token()

    response = requests.put(
        f"{BLOB_API_URL}/{pathname}",
        headers={
            "Authorization": f"Bearer {BLOB_TOKEN}",
            "x-content-type": content_type,
            "x-api-version": "7",
            "x-cache-control-max-age": "31536000",
        },
        data=data,
    )

    if response.status_code != 200:
        print(f"ERROR ({response.status_code}): {response.text}")
        sys.exit(1)

    result = response.json()
    return result.get("url", "")


def asset_type(suffix: str) -> str:
    suffix = suffix.lower()
    if suffix in (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"):
        return "image"
    if suffix in (".mp3", ".wav"):
        return "audio"
    if suffix in (".mp4", ".webm"):
        return "video"
    return "other"


def generate_gallery_html(title: str, assets: list) -> str:
    """Generate a responsive HTML gallery page for mixed asset review."""

    image_cards = []
    audio_cards = []
    video_cards = []
    other_cards = []

    for asset in assets:
        name = asset["name"]
        url = asset["url"]
        kind = asset["type"]

        if kind == "image":
            image_cards.append(f"""
        <div class="card">
            <img src="{url}" alt="{name}" loading="lazy" onclick="this.classList.toggle('zoomed')">
            <div class="label">{name}</div>
        </div>""")
        elif kind == "audio":
            audio_cards.append(f"""
        <div class="card audio-card">
            <div class="audio-icon">&#9835;</div>
            <div class="label">{name}</div>
            <audio controls preload="metadata" style="width:100%">
                <source src="{url}" type="{CONTENT_TYPES.get(Path(name).suffix.lower(), 'audio/mpeg')}">
            </audio>
        </div>""")
        elif kind == "video":
            video_cards.append(f"""
        <div class="card video-card">
            <video controls preload="metadata" style="width:100%" playsinline>
                <source src="{url}" type="{CONTENT_TYPES.get(Path(name).suffix.lower(), 'video/mp4')}">
            </video>
            <div class="label">{name}</div>
        </div>""")
        else:
            other_cards.append(f"""
        <div class="card">
            <a href="{url}" target="_blank">{name}</a>
        </div>""")

    sections = []
    if image_cards:
        sections.append(f'<h2>Images ({len(image_cards)})</h2>\n    <div class="grid">{"".join(image_cards)}\n    </div>')
    if audio_cards:
        sections.append(f'<h2>Audio ({len(audio_cards)})</h2>\n    <div class="list">{"".join(audio_cards)}\n    </div>')
    if video_cards:
        sections.append(f'<h2>Video ({len(video_cards)})</h2>\n    <div class="list">{"".join(video_cards)}\n    </div>')
    if other_cards:
        sections.append(f'<h2>Other ({len(other_cards)})</h2>\n    <div class="list">{"".join(other_cards)}\n    </div>')

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #111; color: #eee;
            padding: 16px; max-width: 1200px; margin: 0 auto;
        }}
        h1 {{ font-size: 1.4em; margin-bottom: 4px; }}
        .meta {{ color: #888; font-size: 0.85em; margin-bottom: 20px; }}
        h2 {{ font-size: 1.1em; color: #aaa; margin: 20px 0 10px; border-bottom: 1px solid #333; padding-bottom: 6px; }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 12px;
        }}
        .list {{ display: flex; flex-direction: column; gap: 12px; }}
        .card {{
            background: #1a1a1a; border-radius: 8px; overflow: hidden;
            border: 1px solid #333;
        }}
        .card img {{
            width: 100%; display: block; cursor: pointer;
            transition: transform 0.2s;
        }}
        .card img.zoomed {{
            transform: scale(2); transform-origin: center; z-index: 10;
            position: relative;
        }}
        .audio-card {{ padding: 16px; }}
        .audio-icon {{ font-size: 2em; margin-bottom: 8px; }}
        .video-card video {{ width: 100%; display: block; }}
        .label {{
            padding: 8px 12px; font-size: 0.8em; color: #aaa;
            word-break: break-all;
        }}
        a {{ color: #6cb4ee; text-decoration: none; padding: 12px; display: block; }}
        @media (max-width: 600px) {{
            .grid {{ grid-template-columns: 1fr; }}
            body {{ padding: 10px; }}
        }}
    </style>
</head>
<body>
    <h1>{title}</h1>
    <div class="meta">{timestamp} &mdash; {len(assets)} assets</div>
    {"".join(sections)}
</body>
</html>"""


def create_gallery(title: str, files: list, folder: str = "") -> str:
    """Upload multiple files and create an HTML gallery page."""
    _check_token()

    assets = []
    print(f"\nGallery: {title}")
    print(f"Uploading {len(files)} files...\n")

    for file_path in files:
        path = Path(file_path)
        if not path.exists():
            print(f"  SKIP (not found): {file_path}")
            continue

        url = upload_file(file_path, folder)
        assets.append({
            "name": path.name,
            "url": url,
            "type": asset_type(path.suffix),
        })

    if not assets:
        print("ERROR: No files uploaded.")
        sys.exit(1)

    html = generate_gallery_html(title, assets)
    slug = title.lower().replace(" ", "-")[:40]
    date_str = datetime.now().strftime("%Y%m%d-%H%M")
    gallery_path = f"{folder}/gallery-{slug}-{date_str}.html" if folder else f"gallery-{slug}-{date_str}.html"

    print(f"\nGenerating gallery page...")
    gallery_url = upload_bytes(html.encode("utf-8"), gallery_path, "text/html")

    print(f"\n{'='*60}")
    print(f"GALLERY URL: {gallery_url}")
    print(f"{'='*60}")
    print(f"\nOpen this single link to see all {len(assets)} assets.")
    print(f"Images can be tapped to zoom. Audio/video play inline.")
    return gallery_url


def list_blobs(folder_filter: str = "") -> None:
    _check_token()

    params = {"limit": 100}
    if folder_filter:
        params["prefix"] = folder_filter

    response = requests.get(
        BLOB_API_URL,
        headers={
            "Authorization": f"Bearer {BLOB_TOKEN}",
            "x-api-version": "7",
        },
        params=params,
    )

    if response.status_code != 200:
        print(f"ERROR ({response.status_code}): {response.text}")
        sys.exit(1)

    data = response.json()
    blobs = data.get("blobs", [])

    if not blobs:
        print(f"No blobs found{f' in {folder_filter}/' if folder_filter else ''}.")
        return

    galleries = []
    images = []
    audio = []
    video = []
    other = []

    for blob in blobs:
        name = blob.get("pathname", "?")
        size = blob.get("size", 0)
        url = blob.get("url", "")
        uploaded = blob.get("uploadedAt", "")
        size_str = f"{size / 1024:.0f}KB" if size < 1024 * 1024 else f"{size / (1024*1024):.1f}MB"

        entry = {"name": name, "size": size_str, "url": url, "date": uploaded[:10] if uploaded else ""}

        if name.endswith(".html"):
            galleries.append(entry)
        elif asset_type(Path(name).suffix) == "image":
            images.append(entry)
        elif asset_type(Path(name).suffix) == "audio":
            audio.append(entry)
        elif asset_type(Path(name).suffix) == "video":
            video.append(entry)
        else:
            other.append(entry)

    def print_section(title, items):
        if not items:
            return
        print(f"\n  {title} ({len(items)})")
        print(f"  {'-'*70}")
        for item in items:
            print(f"  {item['date']}  {item['size']:>8}  {item['name']}")
            print(f"           {item['url']}")

    print(f"\nBlob Store Contents ({len(blobs)} files)")
    print_section("Galleries (review pages)", galleries)
    print_section("Images", images)
    print_section("Audio", audio)
    print_section("Video", video)
    print_section("Other", other)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload files to Vercel Blob for remote review")
    parser.add_argument("files", nargs="*", help="File(s) to upload")
    parser.add_argument("--folder", default="", help="Folder prefix (e.g. review/2026-03-27)")
    parser.add_argument("--list", action="store_true", help="List all blobs")
    parser.add_argument("--gallery", metavar="TITLE", help="Create gallery page with multiple files")

    args = parser.parse_args()

    if args.list:
        list_blobs(args.folder)
    elif args.gallery:
        if not args.files:
            print("ERROR: --gallery requires at least one file")
            print("Usage: upload-to-blob.py --gallery 'Title' file1.png file2.mp3 ...")
            sys.exit(1)
        create_gallery(args.gallery, args.files, args.folder)
    elif args.files:
        for f in args.files:
            url = upload_file(f, args.folder)
        print(f"\nOpen this link on any device to view/listen/watch.")
    else:
        parser.print_help()
