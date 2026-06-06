"""
Delete pending Postiz posts (#3 onwards) — Kora & Cartes
Reason: posts published without a custom cover (Postiz bug #1572) -> blank thumbnail.
Order is saved in memory/episodes/lancement-kora/ORDRE-POSTS-POSTIZ-SAUVEGARDE.md
before deletion, so the narrative sequence can be rebuilt.

Usage:
  python3 scripts/delete-postiz-pending.py --dry-run   # preview
  python3 scripts/delete-postiz-pending.py             # actually delete (asks confirmation)
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.environ["POSTIZ_API_KEY"]
BASE_URL = "https://api.postiz.com/public/v1"
HEADERS = {"Authorization": API_KEY}

DRY_RUN = "--dry-run" in sys.argv

# IMPORTANT: Postiz regenerates post IDs after creation, so the IDs saved in
# postiz-schedule-log.json are STALE and DELETE on them returns 500/404.
# Always list LIVE posts first and delete only state == "QUEUE" ones.
WINDOW_START = "2026-06-05T00:00:00.000Z"
WINDOW_END = "2026-06-25T00:00:00.000Z"


def collect_post_ids():
    resp = requests.get(
        f"{BASE_URL}/posts",
        headers=HEADERS,
        params={"startDate": WINDOW_START, "endDate": WINDOW_END},
        timeout=30,
    )
    resp.raise_for_status()
    posts = resp.json().get("posts", [])
    targets = []
    for p in posts:
        if p.get("state") != "QUEUE":
            continue  # never touch PUBLISHED posts
        plat = p["integration"]["providerIdentifier"]
        targets.append((plat, p["publishDate"][:10], p["id"]))
    return targets


def delete_post(post_id: str) -> tuple[bool, str]:
    resp = requests.delete(f"{BASE_URL}/posts/{post_id}", headers=HEADERS, timeout=30)
    # 404 = already deleted, treat as success per Postiz docs.
    if resp.status_code in (200, 201, 204, 404):
        return True, f"{resp.status_code}"
    return False, f"{resp.status_code} {resp.text[:150]}"


def main():
    targets = collect_post_ids()
    print("=== Postiz — delete pending posts (#3 onwards) ===")
    print(f"{len(targets)} posts to delete across "
          f"{len(set(t[0] for t in targets))} videos x 4 platforms\n")
    for video, date, pid in targets:
        print(f"  {date} | {video[:40]:40} | {pid}")

    if DRY_RUN:
        print("\n[DRY-RUN] No deletion performed.")
        return

    print()
    if input(f"Delete these {len(targets)} posts? (y/n): ").strip().lower() != "y":
        print("Aborted.")
        return

    ok, fail = 0, 0
    for video, date, pid in targets:
        success, msg = delete_post(pid)
        status = "OK" if success else "FAIL"
        print(f"  [{status}] {date} {video[:30]:30} {pid} -> {msg}")
        ok += success
        fail += not success
        time.sleep(0.7)  # gentle pacing

    print(f"\n=== Done: {ok} deleted, {fail} failed ===")
    if fail == 0:
        print("All pending posts removed. Narrative order preserved in memory file.")


if __name__ == "__main__":
    main()
