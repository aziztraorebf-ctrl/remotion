"""
Postiz scheduling — Carrousel Good News #1 (Kora & Cartes).
Carrousel 8 slides (avec musique Mande) sur Instagram + Facebook + TikTok Photo Mode.
PAS YouTube (format carrousel non pertinent).

Usage:
  python3 scripts/schedule-goodnews-carousel.py --dry-run   # montre sans publier
  python3 scripts/schedule-goodnews-carousel.py             # publie pour de vrai
  python3 scripts/schedule-goodnews-carousel.py --date 2026-06-03T10:00:00+00:00
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

# Date par défaut : mercredi 3 juin 2026, 12h Paris (10h UTC) — séparé du créneau 15h UTC des vidéos
DATE_ISO = "2026-06-03T10:00:00.000Z"
if "--date" in sys.argv:
    DATE_ISO = sys.argv[sys.argv.index("--date") + 1]

INTEGRATIONS = {
    "tiktok":    "cmpsuyefy00hbru0yqe2ez8ip",
    "instagram": "cmpsydwti013eru0y5skhzjm1",
    "facebook":  "cmpsuzy1p00horu0yga3na02r",
}

SLIDES_DIR = ROOT / "out/_r-and-d/good-news/final/with-audio"
SLIDE_ORDER = [
    "gn-00-hook", "gn-01-maroc-fait", "gn-02-maroc-macro", "gn-03-kenya-fait",
    "gn-04-kenya-macro", "gn-05-algerie-fait", "gn-06-algerie-macro", "gn-07-cta",
]

IG_CAPTION = (
    "L'Afrique ne reçoit plus. Elle fournit. \U0001F30D\n\n"
    "Trois avancées de la semaine qui ont déjà un impact bien au-delà du continent :\n\n"
    "\U0001F1F2\U0001F1E6 Le Maroc devient la 1re puissance industrielle d'Afrique — et un maillon des chaînes européennes (jusqu'à Airbus).\n"
    "\U0001F1F0\U0001F1EA Le Kenya alimente l'IA mondiale avec une électricité à 90% renouvelable.\n"
    "\U0001F1E9\U0001F1FF Un corridor d'hydrogène vert reliera l'Algérie à l'Allemagne d'ici 2030.\n\n"
    "On décrypte chaque semaine comment l'Afrique façonne l'économie mondiale.\n"
    "Suis @koraetcartes pour la suite.\n\n"
    "#Afrique #Économie #Géopolitique #Maroc #Kenya #Algérie #Industrie #ÉnergieVerte #koraetcartes"
)
FB_CAPTION = IG_CAPTION
TIKTOK_CAPTION = (
    "L'Afrique ne reçoit plus, elle fournit \U0001F30D "
    "#afrique #economie #geopolitique #maroc #kenya #algerie #fyp #pourtoi"
)


def upload(filepath: Path) -> dict:
    print(f"  upload {filepath.name} ({filepath.stat().st_size // 1024} KB)...")
    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/upload", headers=HEADERS,
            files={"file": (filepath.name, f, "video/mp4")}, timeout=300,
        )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"upload failed {resp.status_code}: {resp.text[:200]}")
    return resp.json()


def main():
    print(f"=== Carrousel Good News #1 — {'DRY-RUN' if DRY_RUN else 'LIVE'} ===")
    print(f"Date : {DATE_ISO}")
    print(f"Plateformes : Instagram, Facebook, TikTok (carrousel 8 slides)\n")

    files = [SLIDES_DIR / f"{s}.mp4" for s in SLIDE_ORDER]
    missing = [f for f in files if not f.exists()]
    if missing:
        raise SystemExit(f"Fichiers manquants : {[str(m) for m in missing]}")

    if DRY_RUN:
        print("Slides du carrousel (ordre) :")
        for i, f in enumerate(files):
            print(f"  {i+1}. {f.name}")
        print(f"\nCaption IG/FB :\n{IG_CAPTION}\n")
        print(f"Caption TikTok :\n{TIKTOK_CAPTION}\n")
        print("[DRY-RUN] Aucun upload, aucun post créé.")
        return

    print("Upload des 8 slides...")
    media = []
    for f in files:
        r = upload(f)
        media.append({"id": r["id"], "path": r["path"]})

    payload = {
        "type": "schedule",
        "date": DATE_ISO,
        "shortLink": False,
        "tags": [],
        "posts": [
            {
                "integration": {"id": INTEGRATIONS["instagram"]},
                "value": [{"content": IG_CAPTION, "image": media}],
                "settings": {"__type": "instagram-standalone", "post_type": "post", "collaborators": []},
            },
            {
                "integration": {"id": INTEGRATIONS["facebook"]},
                "value": [{"content": FB_CAPTION, "image": media}],
                "settings": {"__type": "facebook"},
            },
            # TikTok retiré : le Photo Mode multi-éléments n'accepte que des IMAGES,
            # pas des slides vidéo ("Only pictures are supported when selecting multiple items").
            # → traiter TikTok séparément (carrousel d'images statiques OU vidéo unique gn-FULL-preview).
        ],
    }

    resp = requests.post(
        f"{BASE_URL}/posts", headers={**HEADERS, "Content-Type": "application/json"},
        json=payload, timeout=60,
    )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"schedule failed {resp.status_code}: {resp.text[:300]}")
    print("\n✅ Carrousel programmé !")
    print(resp.json())


if __name__ == "__main__":
    main()
