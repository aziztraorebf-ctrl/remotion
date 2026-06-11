"""
Republication Kora & Cartes — Phase 2 (coverB, juin 2026)

Calendrier :
  Lun  9 juin 15h UTC : or-africain   -> IG + FB seulement (deja sur YT)
  Lun  9 juin 15h UTC : vraie-taille  -> IG + FB seulement (deja sur YT)
  Mer 11 juin 15h UTC : senegal-short -> YT + IG + TikTok + FB
  Mer 11 juin 15h UTC : mansa-moussa  -> YT + IG + TikTok + FB
  Ven 13 juin 15h UTC : empire-ghana  -> YT + IG + TikTok + FB
  Ven 13 juin 15h UTC : sonjata       -> YT + IG + TikTok + FB
  Lun 16 juin 15h UTC : silicon-savannah -> YT + IG + TikTok + FB

Usage:
  python3 scripts/republish-kora.py [--dry-run]
"""

import os
import sys
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.environ["POSTIZ_API_KEY"]
BASE_URL = "https://api.postiz.com/public/v1"
HEADERS = {"Authorization": API_KEY}

DRY_RUN = "--dry-run" in sys.argv

COVERS_DIR = ROOT / "out" / "episodes" / "_r-and-d" / "covers-B"

INTEGRATIONS = {
    "youtube":   "cmpsuxkke00h9ru0yk8mcfubf",
    "tiktok":    "cmpsuyefy00hbru0yqe2ez8ip",
    "instagram": "cmpsydwti013eru0y5skhzjm1",
    "facebook":  "cmpsuzy1p00horu0yga3na02r",
}

# (slug, coverB_filename, title, tags, date_iso, platforms)
PUBLICATIONS = [
    (
        "or-africain",
        "or-africain-coverB.mp4",
        "L'empire qui produisait la moitie de l'or mondial",
        ["histoireAfricaine", "afrique", "orAfricain", "Mali"],
        "2026-06-09T15:00:00.000Z",
        ["instagram", "facebook"],
    ),
    (
        "vraie-taille",
        "vraie-taille-coverB.mp4",
        "La vraie taille de l'Afrique va vous surprendre",
        ["afrique", "geographie", "cartographie", "histoireAfricaine"],
        "2026-06-09T15:00:00.000Z",
        ["instagram", "facebook"],
    ),
    (
        "senegal-short",
        "senegal-short-coverB.mp4",
        "Decouvrir une fortune et rester pauvre : le pari du Senegal",
        ["Senegal", "petrole", "geopolitique", "afrique"],
        "2026-06-11T15:00:00.000Z",
        ["youtube", "instagram", "tiktok", "facebook"],
    ),
    (
        "mansa-moussa",
        "mansa-moussa-coverB.mp4",
        "Mansa Moussa : l'homme le plus riche de tous les temps",
        ["MansaMoussa", "Mali", "histoireAfricaine", "richesse"],
        "2026-06-11T15:00:00.000Z",
        ["youtube", "instagram", "tiktok", "facebook"],
    ),
    (
        "empire-ghana",
        "empire-ghana-coverB.mp4",
        "L'Empire du Ghana : la puissance oubliee de l'Afrique de l'Ouest",
        ["empireGhana", "histoireAfricaine", "afrique", "or"],
        "2026-06-13T15:00:00.000Z",
        ["youtube", "instagram", "tiktok", "facebook"],
    ),
    (
        "sonjata",
        "sonjata-coverB.mp4",
        "Soundjata Keita : le fondateur de l'empire qui domina l'Afrique",
        ["Soundjata", "Mali", "empireMandin", "histoireAfricaine"],
        "2026-06-13T15:00:00.000Z",
        ["youtube", "instagram", "tiktok", "facebook"],
    ),
    (
        "silicon-savannah",
        "silicon-savannah-coverB.mp4",
        "Silicon Savannah : quand l'Afrique invente la tech de demain",
        ["siliconSavannah", "Kenya", "tech", "Afrique"],
        "2026-06-16T15:00:00.000Z",
        ["youtube", "instagram", "tiktok", "facebook"],
    ),
]


def captions(slug, title, tags, platforms):
    hashtags_short = " ".join(f"#{t}" for t in tags)

    yt_desc = (
        f"{title}\n\n"
        f"Kora & Cartes, c'est l'Afrique racontee autrement.\n"
        f"Des cartes animees. Des histoires vraies. Des heros que l'ecole n'a pas mentionnes.\n\n"
        f"{hashtags_short} #koraetcartes\n\n"
        f"Contact : koraetcartes@gmail.com"
    )
    ig_caption = (
        f"{title}\n\n"
        f"L'Afrique racontee autrement — cartes animees, donnees reelles, regard critique.\n\n"
        f"{hashtags_short} #koraetcartes #histoireafricaine"
    )
    tiktok_caption = (
        f"On vous a cache ca a l'ecole {hashtags_short} #fyp #afrique #histoire"
    )
    fb_caption = (
        f"{title}\n\n"
        f"L'Afrique vue autrement. Cartes animees, faits reels.\n"
        f"{hashtags_short} #koraetcartes"
    )
    return yt_desc, ig_caption, tiktok_caption, fb_caption


def upload_video(filepath: Path) -> dict:
    size_mb = filepath.stat().st_size // 1024 // 1024
    print(f"  Uploading {filepath.name} ({size_mb} MB)...")
    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/upload",
            headers=HEADERS,
            files={"file": (filepath.name, f, "video/mp4")},
            timeout=600,
        )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Upload failed: {resp.status_code} {resp.text[:300]}")
    result = resp.json()
    print(f"  Uploaded: {result.get('path', '')[:80]}")
    return result


def build_posts(slug, title, tags, platforms, media):
    yt_desc, ig_caption, tiktok_caption, fb_caption = captions(slug, title, tags, platforms)
    yt_tags = [{"value": t, "label": t} for t in tags]
    posts = []

    if "youtube" in platforms:
        posts.append({
            "integration": {"id": INTEGRATIONS["youtube"]},
            "value": [{"content": yt_desc, "image": media}],
            "settings": {
                "__type": "youtube",
                "title": title,
                "type": "public",
                "selfDeclaredMadeForKids": "no",
                "tags": yt_tags,
            },
        })
    if "instagram" in platforms:
        posts.append({
            "integration": {"id": INTEGRATIONS["instagram"]},
            "value": [{"content": ig_caption, "image": media}],
            "settings": {
                "__type": "instagram-standalone",
                "post_type": "post",
                "collaborators": [],
            },
        })
    if "tiktok" in platforms:
        posts.append({
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
        })
    if "facebook" in platforms:
        posts.append({
            "integration": {"id": INTEGRATIONS["facebook"]},
            "value": [{"content": fb_caption, "image": media}],
            "settings": {"__type": "facebook"},
        })
    return posts


def schedule_post(slug, title, tags, platforms, upload_result, date_iso):
    media = [{"id": upload_result["id"], "path": upload_result["path"]}]
    posts = build_posts(slug, title, tags, platforms, media)

    payload = {
        "type": "schedule",
        "date": date_iso,
        "shortLink": False,
        "tags": [],
        "posts": posts,
    }

    if DRY_RUN:
        print(f"  [DRY-RUN] Would schedule on: {', '.join(platforms)}")
        print(f"            Date: {date_iso}")
        return {"dry_run": True, "platforms": platforms}

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
    print("=== Kora & Cartes — Republication Phase 2 ===")
    if DRY_RUN:
        print("MODE: DRY RUN (aucun upload reel)\n")

    print("Calendrier prevu :")
    for slug, coverB, title, tags, date_iso, platforms in PUBLICATIONS:
        date_str = date_iso[:10]
        plats = "+".join(p.upper()[:2] for p in platforms)
        filepath = COVERS_DIR / coverB
        status = "OK" if filepath.exists() else "MANQUANT"
        print(f"  {date_str} | {plats:15} | {title[:45]:45} | {status}")

    print()
    confirm = input("Lancer ? (y/n): ").strip().lower()
    if confirm != "y":
        print("Annule.")
        return

    results = []
    for i, (slug, coverB, title, tags, date_iso, platforms) in enumerate(PUBLICATIONS):
        filepath = COVERS_DIR / coverB
        print(f"\n[{i+1}/{len(PUBLICATIONS)}] {title[:55]}")
        print(f"  Fichier  : {coverB}")
        print(f"  Date     : {date_iso[:10]} 15h UTC")
        print(f"  Plateformes: {', '.join(platforms)}")

        if not filepath.exists():
            print(f"  ERREUR : fichier introuvable — skip")
            continue

        if DRY_RUN:
            upload_result = {"id": "dry-run-id", "path": "https://dry-run.example.com/video.mp4"}
        else:
            upload_result = upload_video(filepath)

        result = schedule_post(slug, title, tags, platforms, upload_result, date_iso)
        results.append({"slug": slug, "date": date_iso, "platforms": platforms, "result": result})

    print(f"\n=== Done: {len(results)}/{len(PUBLICATIONS)} videos programmees ===")

    log_path = ROOT / "scripts" / "republish-kora-log.json"
    with open(log_path, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"Log: {log_path}")


if __name__ == "__main__":
    main()
