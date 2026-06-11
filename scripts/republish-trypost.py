"""
Republication Kora & Cartes — TryPost (YT + IG + FB) + Postiz (TikTok)

TryPost  : YouTube + Instagram + Facebook
Postiz   : TikTok uniquement

Calendrier :
  9  juin 15h UTC : or-africain   -> IG + FB (TryPost) + TikTok (Postiz)
  9  juin 15h UTC : vraie-taille  -> IG + FB (TryPost) + TikTok (Postiz)
  11 juin 15h UTC : senegal-short -> YT + IG + FB (TryPost) + TikTok (Postiz)
  11 juin 15h UTC : mansa-moussa  -> YT + IG + FB (TryPost) + TikTok (Postiz)
  13 juin 15h UTC : empire-ghana  -> YT + IG + FB (TryPost) + TikTok (Postiz)
  13 juin 15h UTC : sonjata       -> YT + IG + FB (TryPost) + TikTok (Postiz)
  16 juin 15h UTC : silicon-savannah -> YT + IG + FB (TryPost) + TikTok (Postiz)

Usage: python3 scripts/republish-trypost.py [--dry-run]
"""

import os
import sys
import json
import subprocess
import requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

DRY_RUN = "--dry-run" in sys.argv

COVERS_DIR = ROOT / "out" / "episodes" / "_r-and-d" / "covers-B"

# TryPost
TRYPOST_API = os.environ["TRYPOST_API_KEY"]
TRYPOST_BASE = "https://app.trypost.it/api"
TRYPOST_HEADERS = {"Authorization": f"Bearer {TRYPOST_API}"}

TRYPOST_ACCOUNTS = {
    "youtube":   "019e9de9-e350-70ce-a3cb-2570aab342db",
    "instagram": "019e9de9-6c3d-71a3-b438-1f3a3fda9c37",
    "facebook":  "019e9de9-291d-7305-ba18-ed46fbec26ea",
}

# Postiz (TikTok uniquement)
POSTIZ_API = os.environ["POSTIZ_API_KEY"]
POSTIZ_BASE = "https://api.postiz.com/public/v1"
POSTIZ_HEADERS = {"Authorization": POSTIZ_API}
POSTIZ_TIKTOK = "cmpsuyefy00hbru0yqe2ez8ip"

# (slug, coverB_filename, title, trypost_platforms, date_iso)
PUBLICATIONS = [
    (
        "or-africain",
        "or-africain-coverB.mp4",
        "L'empire qui produisait la moitie de l'or mondial",
        ["instagram", "facebook"],
        "2026-06-09T15:00:00Z",
    ),
    (
        "vraie-taille",
        "vraie-taille-coverB.mp4",
        "La vraie taille de l'Afrique va vous surprendre",
        ["instagram", "facebook"],
        "2026-06-09T15:00:00Z",
    ),
    (
        "senegal-short",
        "senegal-short-coverB.mp4",
        "Decouvrir une fortune et rester pauvre : le pari du Senegal",
        ["youtube", "instagram", "facebook"],
        "2026-06-11T15:00:00Z",
    ),
    (
        "mansa-moussa",
        "mansa-moussa-coverB.mp4",
        "Mansa Moussa : l'homme le plus riche de tous les temps",
        ["youtube", "instagram", "facebook"],
        "2026-06-11T15:00:00Z",
    ),
    (
        "empire-ghana",
        "empire-ghana-coverB.mp4",
        "L'Empire du Ghana : la puissance oubliee de l'Afrique de l'Ouest",
        ["youtube", "instagram", "facebook"],
        "2026-06-13T15:00:00Z",
    ),
    (
        "sonjata",
        "sonjata-coverB.mp4",
        "Soundjata Keita : le fondateur de l'empire qui domina l'Afrique",
        ["youtube", "instagram", "facebook"],
        "2026-06-13T15:00:00Z",
    ),
    (
        "silicon-savannah",
        "silicon-savannah-coverB.mp4",
        "Silicon Savannah : quand l'Afrique invente la tech de demain",
        ["youtube", "instagram", "facebook"],
        "2026-06-16T15:00:00Z",
    ),
]

# Compressed versions for files > 50MB
COMPRESSED = {
    "mansa-moussa-coverB.mp4": "mansa-moussa-coverB-compressed.mp4",
    "senegal-short-coverB.mp4": "senegal-short-coverB-compressed.mp4",
    "sonjata-coverB.mp4": "sonjata-coverB-compressed.mp4",
}

CONTENT_TYPES = {
    "youtube": "youtube_short",
    "instagram": "instagram_reel",
    "facebook": "facebook_reel",
}

CAPTIONS = {
    "or-africain": {
        "youtube": "L'empire qui produisait la moitie de l'or mondial\n\nKora & Cartes, c'est l'Afrique racontee autrement.\n#histoireAfricaine #afrique #orAfricain #Mali #koraetcartes\n\nContact : koraetcartes@gmail.com",
        "instagram": "L'empire qui produisait la moitie de l'or mondial\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#histoireAfricaine #afrique #orAfricain #Mali #koraetcartes",
        "facebook": "L'empire qui produisait la moitie de l'or mondial\n\nL'Afrique vue autrement.\n#histoireAfricaine #afrique #koraetcartes",
        "tiktok": "On vous a cache ca a l'ecole #histoireAfricaine #afrique #orAfricain #Mali #fyp",
    },
    "vraie-taille": {
        "youtube": "La vraie taille de l'Afrique va vous surprendre\n\nKora & Cartes, c'est l'Afrique racontee autrement.\n#afrique #geographie #cartographie #histoireAfricaine #koraetcartes\n\nContact : koraetcartes@gmail.com",
        "instagram": "La vraie taille de l'Afrique va vous surprendre\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#afrique #geographie #cartographie #histoireAfricaine #koraetcartes",
        "facebook": "La vraie taille de l'Afrique va vous surprendre\n\nL'Afrique vue autrement.\n#afrique #geographie #koraetcartes",
        "tiktok": "Personne ne vous dit ca a l'ecole #afrique #geographie #cartographie #histoireAfricaine #fyp",
    },
    "senegal-short": {
        "youtube": "Decouvrir une fortune et rester pauvre : le pari du Senegal\n\nKora & Cartes, c'est l'Afrique racontee autrement.\n#Senegal #petrole #geopolitique #afrique #koraetcartes\n\nContact : koraetcartes@gmail.com",
        "instagram": "Decouvrir une fortune et rester pauvre : le pari du Senegal\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#Senegal #petrole #geopolitique #afrique #koraetcartes",
        "facebook": "Decouvrir une fortune et rester pauvre : le pari du Senegal\n\nL'Afrique vue autrement.\n#Senegal #petrole #koraetcartes",
        "tiktok": "Ce que le Senegal fait avec son petrole va vous surprendre #Senegal #petrole #geopolitique #afrique #fyp",
    },
    "mansa-moussa": {
        "youtube": "Mansa Moussa : l'homme le plus riche de tous les temps\n\nKora & Cartes, c'est l'Afrique racontee autrement.\n#MansaMoussa #Mali #histoireAfricaine #richesse #koraetcartes\n\nContact : koraetcartes@gmail.com",
        "instagram": "Mansa Moussa : l'homme le plus riche de tous les temps\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#MansaMoussa #Mali #histoireAfricaine #richesse #koraetcartes",
        "facebook": "Mansa Moussa : l'homme le plus riche de tous les temps\n\nL'Afrique vue autrement.\n#MansaMoussa #Mali #koraetcartes",
        "tiktok": "L'homme le plus riche de l'histoire et ce n'est pas Elon Musk #MansaMoussa #Mali #histoireAfricaine #fyp",
    },
    "empire-ghana": {
        "youtube": "L'Empire du Ghana : la puissance oubliee de l'Afrique de l'Ouest\n\nKora & Cartes, c'est l'Afrique racontee autrement.\n#empireGhana #histoireAfricaine #afrique #or #koraetcartes\n\nContact : koraetcartes@gmail.com",
        "instagram": "L'Empire du Ghana : la puissance oubliee de l'Afrique de l'Ouest\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#empireGhana #histoireAfricaine #afrique #or #koraetcartes",
        "facebook": "L'Empire du Ghana : la puissance oubliee de l'Afrique de l'Ouest\n\nL'Afrique vue autrement.\n#empireGhana #histoireAfricaine #koraetcartes",
        "tiktok": "L'empire africain qui controlait la moitie de l'or mondial #empireGhana #histoireAfricaine #afrique #fyp",
    },
    "sonjata": {
        "youtube": "Soundjata Keita : le fondateur de l'empire qui domina l'Afrique\n\nKora & Cartes, c'est l'Afrique racontee autrement.\n#Soundjata #Mali #empireMandin #histoireAfricaine #koraetcartes\n\nContact : koraetcartes@gmail.com",
        "instagram": "Soundjata Keita : le fondateur de l'empire qui domina l'Afrique\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#Soundjata #Mali #empireMandin #histoireAfricaine #koraetcartes",
        "facebook": "Soundjata Keita : le fondateur de l'empire qui domina l'Afrique\n\nL'Afrique vue autrement.\n#Soundjata #Mali #koraetcartes",
        "tiktok": "Le lion du Mande que l'histoire a oublie #Soundjata #Mali #empireMandin #histoireAfricaine #fyp",
    },
    "silicon-savannah": {
        "youtube": "Silicon Savannah : quand l'Afrique invente la tech de demain\n\nKora & Cartes, c'est l'Afrique racontee autrement.\n#siliconSavannah #Kenya #tech #Afrique #koraetcartes\n\nContact : koraetcartes@gmail.com",
        "instagram": "Silicon Savannah : quand l'Afrique invente la tech de demain\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#siliconSavannah #Kenya #tech #Afrique #koraetcartes",
        "facebook": "Silicon Savannah : quand l'Afrique invente la tech de demain\n\nL'Afrique vue autrement.\n#siliconSavannah #Kenya #koraetcartes",
        "tiktok": "L'Afrique invente la tech que le monde va copier #siliconSavannah #Kenya #tech #Afrique #fyp",
    },
}


def get_file(coverB):
    compressed = COMPRESSED.get(coverB)
    if compressed:
        path = COVERS_DIR / compressed
        if path.exists():
            return path
    return COVERS_DIR / coverB


def trypost_upload(filepath):
    size_mb = filepath.stat().st_size // 1024 // 1024
    print(f"  [TryPost] Requesting upload slot ({size_mb} MB)...")

    resp = requests.post(f"{TRYPOST_BASE}/uploads", headers=TRYPOST_HEADERS, timeout=30)
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Upload slot failed: {resp.status_code} {resp.text[:200]}")
    data = resp.json()
    upload_url = data["upload_url"]
    upload_token = data["upload_token"]

    print(f"  [TryPost] Uploading...")
    with open(filepath, "rb") as f:
        up = requests.post(upload_url, files={"media": (filepath.name, f, "video/mp4")}, timeout=300)
    if up.status_code not in (200, 201, 204):
        raise RuntimeError(f"Upload failed: {up.status_code} {up.text[:200]}")
    print(f"  [TryPost] Upload OK (token: {upload_token[:8]}...)")
    return upload_token


def trypost_create_and_publish(slug, platforms, date_iso, upload_token):
    captions = CAPTIONS[slug]
    platform_list = []
    for p in platforms:
        platform_list.append({
            "social_account_id": TRYPOST_ACCOUNTS[p],
            "content_type": CONTENT_TYPES[p],
        })

    content = captions.get(platforms[0], "")

    resp = requests.post(
        f"{TRYPOST_BASE}/posts",
        headers={**TRYPOST_HEADERS, "Content-Type": "application/json"},
        json={
            "content": content,
            "platforms": platform_list,
            "scheduled_at": date_iso,
        },
        timeout=30,
    )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Create post failed: {resp.status_code} {resp.text[:300]}")
    post_id = resp.json()["id"]
    print(f"  [TryPost] Post created: {post_id}")

    att = requests.post(
        f"{TRYPOST_BASE}/posts/{post_id}/media",
        headers={**TRYPOST_HEADERS, "Content-Type": "application/json"},
        json={"upload_token": upload_token},
        timeout=30,
    )
    if att.status_code not in (200, 201):
        raise RuntimeError(f"Attach media failed: {att.status_code} {att.text[:300]}")

    pub = requests.post(
        f"{TRYPOST_BASE}/posts/{post_id}/publish",
        headers={**TRYPOST_HEADERS, "Content-Type": "application/json"},
        json={"scheduled_at": date_iso},
        timeout=30,
    )
    if pub.status_code not in (200, 201):
        raise RuntimeError(f"Publish failed: {pub.status_code} {pub.text[:300]}")
    print(f"  [TryPost] Scheduled {', '.join(platforms)} -> {date_iso[:10]}")
    return post_id


def postiz_upload(filepath):
    size_mb = filepath.stat().st_size // 1024 // 1024
    print(f"  [Postiz] Uploading {filepath.name} ({size_mb} MB)...")
    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{POSTIZ_BASE}/upload",
            headers=POSTIZ_HEADERS,
            files={"file": (filepath.name, f, "video/mp4")},
            timeout=600,
        )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Postiz upload failed: {resp.status_code} {resp.text[:200]}")
    result = resp.json()
    print(f"  [Postiz] Uploaded OK")
    return result


def postiz_schedule_tiktok(slug, upload_result, date_iso):
    captions = CAPTIONS[slug]
    tiktok_caption = captions.get("tiktok", "")
    media = [{"id": upload_result["id"], "path": upload_result["path"]}]
    payload = {
        "type": "schedule",
        "date": date_iso.replace("Z", ".000Z"),
        "shortLink": False,
        "tags": [],
        "posts": [{
            "integration": {"id": POSTIZ_TIKTOK},
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
        }],
    }
    resp = requests.post(
        f"{POSTIZ_BASE}/posts",
        headers={**POSTIZ_HEADERS, "Content-Type": "application/json"},
        json=payload,
        timeout=60,
    )
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"Postiz TikTok failed: {resp.status_code} {resp.text[:300]}")
    result = resp.json()
    post_id = result[0].get("postId", "?") if isinstance(result, list) else "?"
    print(f"  [Postiz] TikTok scheduled -> {date_iso[:10]} (postId: {post_id})")
    return result


def main():
    print("=== Kora & Cartes — TryPost (YT+IG+FB) + Postiz (TikTok) ===")
    if DRY_RUN:
        print("MODE: DRY RUN\n")

    results = []
    for i, (slug, coverB, title, trypost_platforms, date_iso) in enumerate(PUBLICATIONS):
        filepath = get_file(coverB)
        print(f"\n[{i+1}/{len(PUBLICATIONS)}] {title[:55]}")
        print(f"  Fichier : {filepath.name} ({filepath.stat().st_size // 1024 // 1024} MB)")
        print(f"  Date    : {date_iso[:10]} 15h UTC")
        print(f"  TryPost : {', '.join(trypost_platforms)}")
        print(f"  Postiz  : tiktok")

        if DRY_RUN:
            print("  [DRY-RUN] skip")
            continue

        entry = {"slug": slug, "date": date_iso}

        # TryPost upload (shared token for YT+IG+FB)
        try:
            upload_token = trypost_upload(filepath)
            post_id = trypost_create_and_publish(slug, trypost_platforms, date_iso, upload_token)
            entry["trypost_post_id"] = post_id
        except Exception as e:
            print(f"  [TryPost] ERREUR: {e}")
            entry["trypost_error"] = str(e)

        # Postiz TikTok (separate upload)
        try:
            postiz_result = postiz_upload(filepath)
            tiktok_result = postiz_schedule_tiktok(slug, postiz_result, date_iso)
            entry["postiz_tiktok"] = tiktok_result
        except Exception as e:
            print(f"  [Postiz] ERREUR: {e}")
            entry["postiz_error"] = str(e)

        results.append(entry)

    print(f"\n=== Done: {len(results)}/{len(PUBLICATIONS)} ===")
    log_path = ROOT / "scripts" / "republish-trypost-log.json"
    with open(log_path, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"Log: {log_path}")


if __name__ == "__main__":
    main()
