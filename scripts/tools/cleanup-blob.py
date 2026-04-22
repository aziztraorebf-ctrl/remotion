"""Delete specific blobs from Vercel Blob store.

Usage:
    python scripts/tools/cleanup-blob.py <prefix_or_url> [<prefix_or_url> ...]

Deletes any blob whose pathname starts with the given prefix, OR matches the URL exactly.
"""
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")
TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
API = "https://blob.vercel-storage.com"

if not TOKEN:
    print("ERROR: BLOB_READ_WRITE_TOKEN missing")
    sys.exit(1)


def list_all() -> list:
    blobs = []
    cursor = None
    while True:
        params = {"limit": 1000}
        if cursor:
            params["cursor"] = cursor
        r = requests.get(
            API,
            headers={"Authorization": f"Bearer {TOKEN}", "x-api-version": "7"},
            params=params,
        )
        r.raise_for_status()
        data = r.json()
        blobs.extend(data.get("blobs", []))
        cursor = data.get("cursor")
        if not cursor or not data.get("hasMore"):
            break
    return blobs


def delete_url(url: str) -> bool:
    r = requests.post(
        f"{API}/delete",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "x-api-version": "7",
            "Content-Type": "application/json",
        },
        json={"urls": [url]},
    )
    return r.status_code == 200


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: cleanup-blob.py <prefix_or_url> [...]")
        return 1

    targets = sys.argv[1:]
    blobs = list_all()
    print(f"Total blobs: {len(blobs)}")

    to_delete = []
    for blob in blobs:
        pathname = blob.get("pathname", "")
        url = blob.get("url", "")
        for t in targets:
            if url == t or pathname.startswith(t):
                to_delete.append((pathname, url, blob.get("size", 0)))
                break

    if not to_delete:
        print("No matching blobs.")
        return 0

    total_mb = sum(s for _, _, s in to_delete) / (1024 * 1024)
    print(f"\nWill delete {len(to_delete)} blobs ({total_mb:.1f} MB):")
    for pathname, _url, size in to_delete:
        print(f"  {size/(1024*1024):>7.1f} MB  {pathname}")

    print("\nDeleting...")
    freed = 0
    for pathname, url, size in to_delete:
        if delete_url(url):
            freed += size
            print(f"  OK   {pathname}")
        else:
            print(f"  FAIL {pathname}")

    print(f"\nFreed {freed/(1024*1024):.1f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
