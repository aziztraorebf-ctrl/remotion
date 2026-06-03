"""Publier le Short "Petrole de la patience" sur Postiz (4 plateformes).
Cree 2026-06-03. Remplace le creneau Niger du 9 juin (deja supprime).
Date : lundi 9 juin 2026, 15h00 UTC. Titre valide Aziz.
Usage: python3 scripts/publish-petrole-patience-short.py [--dry-run]
"""
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.environ["POSTIZ_API_KEY"]
BASE_URL = "https://api.postiz.com/public/v1"
HEADERS = {"Authorization": API_KEY}
DRY_RUN = "--dry-run" in sys.argv

INTEGRATIONS = {
    "youtube":   "cmpsuxkke00h9ru0yk8mcfubf",
    "tiktok":    "cmpsuyefy00hbru0yqe2ez8ip",
    "instagram": "cmpsydwti013eru0y5skhzjm1",
    "facebook":  "cmpsuzy1p00horu0yga3na02r",
}

VIDEO = ROOT / "out" / "PRET-PUBLICATION" / "petrole-patience-short-FINAL.mp4"
DATE_ISO = "2026-06-09T15:00:00.000Z"
TITLE = "Découvrir une fortune et rester pauvre : le pari du Sénégal"
TAGS = ["Sénégal", "pétrole", "géopolitique", "Afrique"]

YT_DESC = (
    "Découvrir une fortune et rester pauvre : le pari du Sénégal\n\n"
    "Kora & Cartes, c'est l'Afrique racontée autrement.\n"
    "Des cartes animées. Des histoires vraies. Des chiffres qu'on ne montre jamais.\n\n"
    "Le Nigeria et l'Angola pompent du pétrole depuis 50 ans — sans devenir riches.\n"
    "Le Sénégal a choisi un autre chemin. Petrosen garde 18%. Suffira-t-il ?\n"
    "L'analyse complète arrive très bientôt.\n\n"
    "#Sénégal #pétrole #géopolitique #Afrique #koraetcartes\n\n"
    "📩 Contact : koraetcartes@gmail.com"
)
IG_CAPTION = (
    "Découvrir une fortune et rester pauvre : le pari du Sénégal 🗺️\n\n"
    "50 ans de pétrole africain, et personne n'est devenu riche. Le Sénégal tente autre chose.\n\n"
    "#Sénégal #pétrole #géopolitique #Afrique #koraetcartes #histoireafricaine"
)
TIKTOK_CAPTION = (
    "Découvrir une fortune… et rester pauvre 👇 Le pari du Sénégal "
    "#Sénégal #pétrole #fyp #afrique #geopolitique"
)
FB_CAPTION = (
    "Découvrir une fortune et rester pauvre : le pari du Sénégal\n\n"
    "Le Nigeria et l'Angola pompent du pétrole depuis 50 ans, sans s'enrichir. "
    "Le Sénégal a choisi un autre modèle. Analyse complète bientôt.\n"
    "#Sénégal #pétrole #koraetcartes"
)


def upload_video(filepath: Path) -> dict:
    print(f"  Uploading {filepath.name} ({filepath.stat().st_size // 1024 // 1024} MB)...")
    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/upload",
            headers=HEADERS,
            files={"file": (filepath.name, f, "video/mp4")},
            timeout=600,
        )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Upload failed: {resp.status_code} {resp.text[:200]}")
    result = resp.json()
    print(f"  Uploaded: {result.get('path', '')}")
    return result


def schedule(upload_result: dict) -> dict:
    media = [{"id": upload_result["id"], "path": upload_result["path"]}]
    yt_tags = [{"value": t, "label": t} for t in TAGS]
    payload = {
        "type": "schedule",
        "date": DATE_ISO,
        "shortLink": False,
        "tags": [],
        "posts": [
            {
                "integration": {"id": INTEGRATIONS["youtube"]},
                "value": [{"content": YT_DESC, "image": media}],
                "settings": {
                    "__type": "youtube",
                    "title": TITLE,
                    "type": "public",
                    "selfDeclaredMadeForKids": "no",
                    "tags": yt_tags,
                },
            },
            {
                "integration": {"id": INTEGRATIONS["instagram"]},
                "value": [{"content": IG_CAPTION, "image": media}],
                "settings": {"__type": "instagram-standalone", "post_type": "post", "collaborators": []},
            },
            {
                "integration": {"id": INTEGRATIONS["tiktok"]},
                "value": [{"content": TIKTOK_CAPTION, "image": media}],
                "settings": {
                    "__type": "tiktok",
                    "privacy_level": "PUBLIC_TO_EVERYONE",
                    "duet": True, "stitch": True, "comment": True,
                    "autoAddMusic": "no",
                    "brand_content_toggle": False, "brand_organic_toggle": False,
                    "content_posting_method": "DIRECT_POST",
                },
            },
            {
                "integration": {"id": INTEGRATIONS["facebook"]},
                "value": [{"content": FB_CAPTION, "image": media}],
                "settings": {"__type": "facebook"},
            },
        ],
    }
    if DRY_RUN:
        print(f"  [DRY-RUN] Would schedule '{TITLE}' on {DATE_ISO} (YT/IG/TikTok/FB)")
        return {"dry_run": True}
    resp = requests.post(
        f"{BASE_URL}/posts",
        headers={**HEADERS, "Content-Type": "application/json"},
        json=payload,
        timeout=120,
    )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Schedule failed: {resp.status_code} {resp.text[:400]}")
    return resp.json()


def main() -> int:
    if not VIDEO.exists():
        print(f"ERROR: {VIDEO} introuvable")
        return 1
    print(f"Short: {VIDEO.name}")
    print(f"Date: {DATE_ISO} | Titre: {TITLE}")
    print(f"Mode: {'DRY-RUN' if DRY_RUN else 'LIVE'}\n")
    up = {"id": "dry", "path": "https://dry.example/v.mp4"} if DRY_RUN else upload_video(VIDEO)
    res = schedule(up)
    print(f"\nOK: {res}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
