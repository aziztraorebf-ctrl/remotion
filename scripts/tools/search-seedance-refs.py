#!/usr/bin/env python3
"""
Search Seedance 2.0 prompt library for reference videos.

Usage:
    python3 scripts/tools/search-seedance-refs.py "cavalry battle charge"
    python3 scripts/tools/search-seedance-refs.py "slow push in dramatic speech king" --top 5
    python3 scripts/tools/search-seedance-refs.py "exile desert journey" --download
    python3 scripts/tools/search-seedance-refs.py "battle army" --recent   # April 2026+ only
    python3 scripts/tools/search-seedance-refs.py "battle army" --exclude "fantasy,magic,dragon,robot,sci-fi"

CSV file: ~/Downloads/seedance-2-0-prompts-20260418.csv
(Update CSV_PATH below or use --csv flag if file moves)
"""

import csv
import json
import re
import sys
import os
import subprocess
from datetime import datetime
from pathlib import Path

CSV_PATH = os.path.expanduser("~/Downloads/seedance-2-0-prompts-20260418.csv")
DOWNLOAD_DIR = Path(os.path.expanduser(
    "~/Workspace/remotion/public/assets/library/references/seedance-refs"
))

# Styles that cause artifacts when used as ref for our historical African shorts
STYLE_PENALTIES = [
    "sci-fi", "robot", "mecha", "cyberpunk", "futuristic", "neon",
    "dragon", "magic spell", "laser", "lightsaber", "spaceship",
    "zombie", "alien", "monster", "kaiju", "titan",
    "gun", "pistol", "rifle", "bullet", "firearm", "shooting",
    "car", "truck", "vehicle", "motorcycle",
    "stickman", "stick figure", "stick-fight",
    "cat ", "dog ", "animal fight",
]


def load_entries(csv_path: str) -> list[dict]:
    entries = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                videos = json.loads(row.get("sourceVideos", "[]") or "[]")
            except json.JSONDecodeError:
                videos = []
            if not videos:
                continue

            try:
                refs = json.loads(row.get("sourceReferenceImages", "[]") or "[]")
            except json.JSONDecodeError:
                refs = []

            # Parse date
            date_str = row.get("sourcePublishedAt", "")
            pub_date = None
            if date_str:
                try:
                    pub_date = datetime.fromisoformat(
                        date_str.replace("Z", "+00:00")
                    )
                except ValueError:
                    pass

            # Prompt length as quality signal
            content = row.get("content", "")

            entries.append({
                "id": row.get("id", ""),
                "title": row.get("title", ""),
                "description": row.get("description", ""),
                "content": content,
                "link": row.get("sourceLink", ""),
                "author": row.get("author", ""),
                "video_url": videos[0].get("url", "") if videos else "",
                "thumbnail": videos[0].get("thumbnail", "") if videos else "",
                "has_refs": len(refs) > 0,
                "num_videos": len(videos),
                "pub_date": pub_date,
                "prompt_len": len(content),
            })
    return entries


def score_entry(
    entry: dict,
    keywords: list[str],
    exclude_terms: list[str],
    prefer_recent: bool,
) -> float:
    searchable = (
        entry["title"] + " " +
        entry["description"] + " " +
        entry["content"]
    ).lower()

    # Hard exclude on user-specified terms
    for term in exclude_terms:
        if term in searchable:
            return -1.0

    # Keyword matching
    score = 0.0
    matched = 0
    for kw in keywords:
        count = searchable.count(kw)
        if count > 0:
            matched += 1
            score += count * (1.0 + (2.0 if kw in entry["title"].lower() else 0.0))

    if matched == 0:
        return 0.0

    # Coverage bonus — matching more distinct keywords is better
    coverage = matched / len(keywords)
    score *= (0.5 + coverage)

    # Bonus for entries with reference images (proven workflow)
    if entry["has_refs"]:
        score *= 1.15

    # Style penalty — reduce score for content that would cause artifacts
    # in our historical African epic style
    penalty_count = sum(1 for p in STYLE_PENALTIES if p in searchable)
    if penalty_count > 0:
        score *= max(0.2, 1.0 - (penalty_count * 0.2))

    # Recency bonus — April 2026+ prompts are more mature
    if entry["pub_date"]:
        days_old = (datetime.now(entry["pub_date"].tzinfo) - entry["pub_date"]).days
        if days_old <= 7:
            score *= 1.4  # Last week = strong bonus
        elif days_old <= 21:
            score *= 1.2  # Last 3 weeks = moderate bonus
        elif days_old > 45:
            score *= 0.7  # Older than 45 days = penalty

    # Prompt length signal — very long prompts (>3000 chars) often indicate
    # over-engineering; medium prompts (500-2000) tend to work better
    if entry["prompt_len"] > 4000:
        score *= 0.8
    elif entry["prompt_len"] > 3000:
        score *= 0.9

    # Prefer --recent if flag set
    if prefer_recent and entry["pub_date"]:
        if entry["pub_date"].month < 4 or entry["pub_date"].year < 2026:
            score *= 0.3

    return score


def search(
    query: str,
    entries: list[dict],
    top_n: int = 3,
    exclude_terms: list[str] | None = None,
    prefer_recent: bool = False,
) -> list[tuple[dict, float]]:
    keywords = [w.strip().lower() for w in query.split() if len(w.strip()) > 2]
    if not keywords:
        print("Query too short. Use 3+ character words.")
        return []

    exclude = [t.strip().lower() for t in (exclude_terms or [])]

    scored = [
        (e, score_entry(e, keywords, exclude, prefer_recent))
        for e in entries
    ]
    scored = [(e, s) for e, s in scored if s > 0]
    scored.sort(key=lambda x: -x[1])
    return scored[:top_n]


def format_date(pub_date) -> str:
    if not pub_date:
        return "???"
    return pub_date.strftime("%b %d")


def download_video(url: str, entry_id: str, title: str) -> str | None:
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    safe_title = re.sub(r"[^\w\s-]", "", title)[:40].strip().replace(" ", "-").lower()
    filename = f"ref-{entry_id}-{safe_title}.mp4"
    filepath = DOWNLOAD_DIR / filename

    if filepath.exists():
        print(f"  Already downloaded: {filepath}")
        return str(filepath)

    try:
        result = subprocess.run(
            ["curl", "-sL", "-o", str(filepath), url],
            capture_output=True, timeout=30
        )
        if result.returncode == 0 and filepath.stat().st_size > 10000:
            print(f"  Downloaded: {filepath} ({filepath.stat().st_size // 1024}KB)")
            return str(filepath)
        else:
            filepath.unlink(missing_ok=True)
            print(f"  Download failed for {entry_id}")
            return None
    except Exception as e:
        print(f"  Error: {e}")
        return None


def main():
    import argparse
    parser = argparse.ArgumentParser(
        description="Search Seedance 2.0 prompt library for reference videos"
    )
    parser.add_argument("query", help="Search query (e.g. 'cavalry battle charge')")
    parser.add_argument("--top", type=int, default=3, help="Number of results")
    parser.add_argument("--download", action="store_true", help="Download top videos")
    parser.add_argument("--csv", default=CSV_PATH, help="Path to CSV file")
    parser.add_argument(
        "--recent", action="store_true",
        help="Strongly prefer April 2026+ entries (mature prompts)"
    )
    parser.add_argument(
        "--exclude",
        help="Comma-separated terms to exclude (e.g. 'fantasy,dragon,magic')"
    )
    args = parser.parse_args()

    if not os.path.exists(args.csv):
        print(f"CSV not found: {args.csv}")
        sys.exit(1)

    exclude_terms = []
    if args.exclude:
        exclude_terms = [t.strip() for t in args.exclude.split(",")]

    print(f"Loading {args.csv}...")
    entries = load_entries(args.csv)
    print(f"Loaded {len(entries)} entries with videos.")
    if args.recent:
        print("Mode: --recent (April 2026+ preferred)")
    if exclude_terms:
        print(f"Excluding: {', '.join(exclude_terms)}")
    print()

    results = search(
        args.query, entries, args.top,
        exclude_terms=exclude_terms,
        prefer_recent=args.recent,
    )
    if not results:
        print("No matches found. Try different keywords or remove --exclude terms.")
        return

    print(f"Top {len(results)} results for: '{args.query}'\n")
    print("=" * 70)

    for i, (entry, score) in enumerate(results, 1):
        date_str = format_date(entry["pub_date"])
        prompt_len = entry["prompt_len"]

        print(f"\n#{i} [{entry['id']}] {entry['title']}")
        print(f"   Score: {score:.1f} | Date: {date_str} | Prompt: {prompt_len} chars")
        print(f"   X: {entry['link']}")

        # Show prompt excerpt (first 250 chars of actual content)
        content = entry["content"].replace("\n", " ")[:250]
        print(f"   Prompt: {content}...")

        if entry["has_refs"]:
            print(f"   [Has reference images]")

        print(f"   Video: {entry['video_url'][:80]}...")

        if args.download:
            download_video(entry["video_url"], entry["id"], entry["title"])

    print("\n" + "=" * 70)
    if not args.download:
        print("\nTip: Add --download to save top videos locally.")
        print("Tip: Add --recent to prefer April 2026+ entries.")
        print("Tip: Add --exclude 'fantasy,dragon' to filter out styles.")


if __name__ == "__main__":
    main()
