"""
Postiz scheduling — Carrousel Good News #1, version TikTok (vidéo unique).
TikTok n'accepte pas les carrousels vidéo → on poste gn-FULL-tiktok.mp4 (8 slides
défilantes + musique Mande) comme vidéo unique. Même créneau que IG/FB.

Usage:
  python3 scripts/schedule-goodnews-tiktok.py --dry-run
  python3 scripts/schedule-goodnews-tiktok.py
"""
import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.environ["POSTIZ_API_KEY"]
BASE_URL = "https://api.postiz.com/public/v1"
HEADERS = {"Authorization": API_KEY}
DRY_RUN = "--dry-run" in sys.argv

DATE_ISO = "2026-06-03T10:00:00.000Z"
if "--date" in sys.argv:
    DATE_ISO = sys.argv[sys.argv.index("--date") + 1]

TIKTOK_ID = "cmpsuyefy00hbru0yqe2ez8ip"
VIDEO = ROOT / "out/_r-and-d/good-news/final/gn-FULL-tiktok.mp4"

CAPTION = (
    "L'Afrique ne reçoit plus, elle fournit \U0001F30D "
    "3 avancées qui changent l'économie mondiale cette semaine. "
    "#afrique #economie #geopolitique #maroc #kenya #algerie #fyp #pourtoi #koraetcartes"
)


def main():
    print(f"=== TikTok Good News #1 (vidéo unique) — {'DRY-RUN' if DRY_RUN else 'LIVE'} ===")
    print(f"Date : {DATE_ISO}\nFichier : {VIDEO.name}\n")
    if not VIDEO.exists():
        raise SystemExit(f"Fichier manquant : {VIDEO}")

    if DRY_RUN:
        print(f"Caption :\n{CAPTION}\n[DRY-RUN] rien posté.")
        return

    print(f"upload {VIDEO.name} ({VIDEO.stat().st_size // 1024} KB)...")
    with open(VIDEO, "rb") as f:
        r = requests.post(f"{BASE_URL}/upload", headers=HEADERS,
                          files={"file": (VIDEO.name, f, "video/mp4")}, timeout=300)
    if r.status_code not in (200, 201):
        raise RuntimeError(f"upload failed {r.status_code}: {r.text[:200]}")
    up = r.json()
    media = [{"id": up["id"], "path": up["path"]}]

    payload = {
        "type": "schedule", "date": DATE_ISO, "shortLink": False, "tags": [],
        "posts": [{
            "integration": {"id": TIKTOK_ID},
            "value": [{"content": CAPTION, "image": media}],
            "settings": {
                "__type": "tiktok",
                "privacy_level": "PUBLIC_TO_EVERYONE",
                "duet": True, "stitch": True, "comment": True,
                "autoAddMusic": "no", "brand_content_toggle": False,
                "brand_organic_toggle": False, "content_posting_method": "DIRECT_POST",
            },
        }],
    }
    resp = requests.post(f"{BASE_URL}/posts", headers={**HEADERS, "Content-Type": "application/json"},
                        json=payload, timeout=60)
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"schedule failed {resp.status_code}: {resp.text[:300]}")
    print("\n✅ Vidéo TikTok programmée !")
    print(resp.json())


if __name__ == "__main__":
    main()
