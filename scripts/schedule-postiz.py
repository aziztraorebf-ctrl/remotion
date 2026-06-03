"""
Postiz scheduling script — Kora & Cartes
3 videos/week over 3 weeks (Mon/Wed/Fri), 4 platforms simultaneously.
Usage: python3 scripts/schedule-postiz.py [--dry-run]
"""

import os
import sys
import json
import requests
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.environ["POSTIZ_API_KEY"]
BASE_URL = "https://api.postiz.com/public/v1"
HEADERS = {"Authorization": API_KEY}

DRY_RUN = "--dry-run" in sys.argv

# Integration IDs
INTEGRATIONS = {
    "youtube":   "cmpsuxkke00h9ru0yk8mcfubf",
    "tiktok":    "cmpsuyefy00hbru0yqe2ez8ip",
    "instagram": "cmpsydwti013eru0y5skhzjm1",
    "facebook":  "cmpsuzy1p00horu0yga3na02r",
}

# Videos in publication order
# Format: (filename, slug, title_yt, hashtags)
VIDEOS = [
    (
        "or-africain-FINAL.mp4",
        "or-africain",
        "L'empire qui produisait la moitié de l'or mondial",
        ["histoire", "afrique", "orAfricain", "géopolitique", "Mali"],
    ),
    (
        "vraie-taille-afrique-FINAL.mp4",
        "vraie-taille",
        "La vraie taille de l'Afrique va vous surprendre",
        ["afrique", "géographie", "cartographie", "histoireAfricaine", "maps"],
    ),
    (
        "thiaroye-v5-FINAL.mp4",
        "thiaroye",
        "Thiaroye 1944 : le massacre que l'histoire a effacé",
        ["Thiaroye", "histoireAfricaine", "Sénégal", "mémoire", "colonisation"],
    ),
    (
        "niger-uranium-FINAL.mp4",
        "niger-uranium",
        "Le Niger et l'uranium : ce que la France ne dit pas",
        ["Niger", "uranium", "géopolitique", "afrique", "souveraineté"],
    ),
    (
        "mansa-moussa-atlas-v2-FINAL.mp4",
        "mansa-moussa",
        "Mansa Moussa : l'homme le plus riche de tous les temps",
        ["MansaMoussa", "Mali", "histoireAfricaine", "empire", "richesse"],
    ),
    (
        "empire-ghana-FINAL-v2.mp4",
        "empire-ghana",
        "L'Empire du Ghana : la puissance oubliée de l'Afrique de l'Ouest",
        ["empireGhana", "histoireAfricaine", "afrique", "géopolitique", "or"],
    ),
    (
        "sonjata-v7-FINAL.mp4",
        "sonjata",
        "Soundjata Keïta : le fondateur de l'empire qui domina l'Afrique",
        ["Soundjata", "Mali", "empireMandin", "histoireAfricaine", "épopée"],
    ),
    (
        "silicon-savannah-FINAL.mp4",
        "silicon-savannah",
        "Silicon Savannah : quand l'Afrique invente la tech de demain",
        ["siliconSavannah", "Kenya", "tech", "Afrique", "innovation"],
    ),
    (
        "senegal-petrole-gaz-FINAL-compressed.mp4",
        "senegal-petrole",
        "Sénégal pétrole et gaz : la souveraineté en jeu",
        ["Sénégal", "pétrole", "gaz", "souveraineté", "géopolitique"],
    ),
]

# Publication schedule: 3 weeks, Mon/Wed/Fri at 15:00 UTC (11h EST)
# Start date: next Monday from today
def get_schedule_dates(start_iso: str):
    """Returns list of 9 ISO datetime strings for Mon/Wed/Fri over 3 weeks."""
    from datetime import timedelta
    start = datetime.fromisoformat(start_iso).replace(tzinfo=timezone.utc)
    dates = []
    offsets = [0, 2, 4, 7, 9, 11, 14, 16, 18]  # days from start (Mon=0, Wed=2, Fri=4)
    for offset in offsets:
        d = start + timedelta(days=offset)
        dates.append(d.isoformat().replace("+00:00", ".000Z"))
    return dates


# Captions per platform
def captions(video):
    _, slug, title, tags = video

    hashtags_yt = " ".join(f"#{t}" for t in tags)
    hashtags_short = " ".join(f"#{t}" for t in tags[:4])

    yt_desc = (
        f"{title}\n\n"
        f"Kora & Cartes, c'est l'Afrique racontée autrement.\n"
        f"Des cartes animées. Des histoires vraies. Des héros que l'école n'a pas mentionnés.\n\n"
        f"Chaque épisode explore un moment, une figure ou une logique géopolitique de l'Afrique "
        f"et du monde — avec des animations cartographiques, des données réelles et un regard critique.\n\n"
        f"{hashtags_yt}\n\n"
        f"📩 Contact : koraetcartes@gmail.com"
    )

    ig_caption = (
        f"{title} 🗺️\n\n"
        f"L'Afrique racontée autrement — cartes animées, données réelles, regard critique.\n\n"
        f"{hashtags_short} #koraetcartes #histoireafricaine"
    )

    tiktok_caption = (
        f"On vous a caché ça à l'école 👇 {hashtags_short} #fyp #afrique #histoire"
    )

    fb_caption = (
        f"{title}\n\n"
        f"L'Afrique vue autrement. Cartes animées, faits réels.\n"
        f"{hashtags_short} #koraetcartes"
    )

    return yt_desc, ig_caption, tiktok_caption, fb_caption


def upload_video(filepath: Path) -> dict:
    print(f"  Uploading {filepath.name} ({filepath.stat().st_size // 1024 // 1024} MB)...")
    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/upload",
            headers=HEADERS,
            files={"file": (filepath.name, f, "video/mp4")},
            timeout=300,
        )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Upload failed: {resp.status_code} {resp.text[:200]}")
    result = resp.json()
    print(f"  Uploaded: {result.get('path', '')}")
    return result


def schedule_post(video, upload_result, date_iso: str):
    filename, slug, title, tags = video
    yt_desc, ig_caption, tiktok_caption, fb_caption = captions(video)

    yt_tags = [{"value": t, "label": t} for t in tags]
    media = [{"id": upload_result["id"], "path": upload_result["path"]}]

    payload = {
        "type": "schedule",
        "date": date_iso,
        "shortLink": False,
        "tags": [],
        "posts": [
            {
                "integration": {"id": INTEGRATIONS["youtube"]},
                "value": [{"content": yt_desc, "image": media}],
                "settings": {
                    "__type": "youtube",
                    "title": title,
                    "type": "public",
                    "selfDeclaredMadeForKids": "no",
                    "tags": yt_tags,
                },
            },
            {
                "integration": {"id": INTEGRATIONS["instagram"]},
                "value": [{"content": ig_caption, "image": media}],
                "settings": {
                    "__type": "instagram-standalone",
                    "post_type": "post",
                    "collaborators": [],
                },
            },
            {
                "integration": {"id": INTEGRATIONS["tiktok"]},
                "value": [{"content": tiktok_caption, "image": media}],
                "settings": {
                    "__type": "tiktok",
                    "privacy_level": "PUBLIC_TO_EVERYONE",
                    "duet": True,
                    "stitch": True,
                    "comment": True,
                    "autoAddMusic": "no",
                    "brand_content_toggle": False,
                    "brand_organic_toggle": False,
                    "content_posting_method": "DIRECT_POST",
                },
            },
            {
                "integration": {"id": INTEGRATIONS["facebook"]},
                "value": [{"content": fb_caption, "image": media}],
                "settings": {"__type": "facebook"},
            },
        ],
    }

    if DRY_RUN:
        print(f"  [DRY-RUN] Would schedule: {title}")
        print(f"            Date: {date_iso}")
        print(f"            Platforms: YouTube, Instagram, TikTok, Facebook")
        return {"dry_run": True}

    resp = requests.post(
        f"{BASE_URL}/posts",
        headers={**HEADERS, "Content-Type": "application/json"},
        json=payload,
        timeout=60,
    )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Schedule failed: {resp.status_code} {resp.text[:300]}")
    return resp.json()


def main():
    print("=== Kora & Cartes — Postiz Scheduler ===")
    if DRY_RUN:
        print("MODE: DRY RUN (no actual uploads or posts)\n")

    # Start date: 2026-06-02 (next Monday) at 15:00 UTC
    START_DATE = "2026-06-02T15:00:00"
    dates = get_schedule_dates(START_DATE)

    print("Publication schedule:")
    for i, (video, date) in enumerate(zip(VIDEOS, dates)):
        print(f"  {date[:10]} | {video[2][:55]}")

    print()
    confirm = input("Proceed? (y/n): ").strip().lower()
    if confirm != "y":
        print("Aborted.")
        return

    OUT_DIR = ROOT / "out" / "PRET-PUBLICATION"
    results = []

    for i, (video, date) in enumerate(zip(VIDEOS, dates)):
        filename = video[0]
        filepath = OUT_DIR / filename

        if not filepath.exists():
            print(f"\n[{i+1}/9] MISSING: {filename} — skipping")
            continue

        print(f"\n[{i+1}/9] {video[2][:55]}")
        print(f"  File   : {filename}")
        print(f"  Date   : {date[:16]} UTC")

        if DRY_RUN:
            upload_result = {"id": "dry-run-id", "path": "https://dry-run.example.com/video.mp4"}
        else:
            upload_result = upload_video(filepath)

        result = schedule_post(video, upload_result, date)
        results.append({"video": filename, "date": date, "result": result})
        print(f"  Scheduled on 4 platforms")

    print(f"\n=== Done: {len(results)}/9 videos scheduled ===")

    log_path = ROOT / "scripts" / "postiz-schedule-log.json"
    with open(log_path, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"Log saved: {log_path}")


if __name__ == "__main__":
    main()
