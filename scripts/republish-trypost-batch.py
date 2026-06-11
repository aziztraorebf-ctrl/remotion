"""
Republication batch — TryPost (YT+IG+FB) + Postiz (TikTok)
Utilise l'API TryPost REST + Postiz REST directement.
Usage: python3 scripts/republish-trypost-batch.py [--dry-run]
"""

import os, sys, json, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

DRY_RUN = "--dry-run" in sys.argv
COVERS = ROOT / "out" / "episodes" / "_r-and-d" / "covers-B"

TRYPOST_KEY = os.environ["TRYPOST_API_KEY"]
TRYPOST_BASE = "https://app.trypost.it/api"
TH = {"Authorization": f"Bearer {TRYPOST_KEY}"}

POSTIZ_KEY = os.environ["POSTIZ_API_KEY"]
POSTIZ_BASE = "https://api.postiz.com/public/v1"
PH = {"Authorization": POSTIZ_KEY}
POSTIZ_TIKTOK = "cmpsuyefy00hbru0yqe2ez8ip"

YT  = "019e9de9-e350-70ce-a3cb-2570aab342db"
IG  = "019e9de9-6c3d-71a3-b438-1f3a3fda9c37"
FB  = "019e9de9-291d-7305-ba18-ed46fbec26ea"

COMPRESSED = {
    "mansa-moussa-coverB.mp4":  "mansa-moussa-coverB-compressed.mp4",
    "senegal-short-coverB.mp4": "senegal-short-coverB-compressed.mp4",
    "sonjata-coverB.mp4":       "sonjata-coverB-compressed.mp4",
}

# (slug, coverB, trypost_platforms, date)
VIDEOS = [
    ("vraie-taille",    "vraie-taille-coverB.mp4",    [IG, FB],     "2026-06-09T15:00:00Z"),
    ("senegal-short",   "senegal-short-coverB.mp4",   [YT, IG, FB], "2026-06-11T15:00:00Z"),
    ("mansa-moussa",    "mansa-moussa-coverB.mp4",    [YT, IG, FB], "2026-06-11T15:00:00Z"),
    ("empire-ghana",    "empire-ghana-coverB.mp4",    [YT, IG, FB], "2026-06-13T15:00:00Z"),
    ("sonjata",         "sonjata-coverB.mp4",         [YT, IG, FB], "2026-06-13T15:00:00Z"),
    ("silicon-savannah","silicon-savannah-coverB.mp4",[YT, IG, FB], "2026-06-16T15:00:00Z"),
]

CAPTIONS = {
    "vraie-taille":     "La vraie taille de l'Afrique va vous surprendre\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#afrique #geographie #cartographie #histoireAfricaine #koraetcartes",
    "senegal-short":    "Decouvrir une fortune et rester pauvre : le pari du Senegal\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#Senegal #petrole #geopolitique #afrique #koraetcartes",
    "mansa-moussa":     "Mansa Moussa : l'homme le plus riche de tous les temps\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#MansaMoussa #Mali #histoireAfricaine #richesse #koraetcartes",
    "empire-ghana":     "L'Empire du Ghana : la puissance oubliee de l'Afrique de l'Ouest\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#empireGhana #histoireAfricaine #afrique #or #koraetcartes",
    "sonjata":          "Soundjata Keita : le fondateur de l'empire qui domina l'Afrique\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#Soundjata #Mali #empireMandin #histoireAfricaine #koraetcartes",
    "silicon-savannah": "Silicon Savannah : quand l'Afrique invente la tech de demain\n\nL'Afrique racontee autrement — cartes animees, donnees reelles.\n#siliconSavannah #Kenya #tech #Afrique #koraetcartes",
}

TIKTOK_CAPTIONS = {
    "or-africain":      "On vous a cache ca a l'ecole #histoireAfricaine #afrique #orAfricain #Mali #fyp",
    "vraie-taille":     "Personne ne vous dit ca a l'ecole #afrique #geographie #cartographie #histoireAfricaine #fyp",
    "senegal-short":    "Ce que le Senegal fait avec son petrole va vous surprendre #Senegal #petrole #geopolitique #afrique #fyp",
    "mansa-moussa":     "L'homme le plus riche de l'histoire et ce n'est pas Elon Musk #MansaMoussa #Mali #histoireAfricaine #fyp",
    "empire-ghana":     "L'empire africain qui controlait la moitie de l'or mondial #empireGhana #histoireAfricaine #afrique #fyp",
    "sonjata":          "Le lion du Mande que l'histoire a oublie #Soundjata #Mali #empireMandin #histoireAfricaine #fyp",
    "silicon-savannah": "L'Afrique invente la tech que le monde va copier #siliconSavannah #Kenya #tech #Afrique #fyp",
}

YT_TITLES = {
    "vraie-taille":     "La vraie taille de l'Afrique va vous surprendre",
    "senegal-short":    "Decouvrir une fortune et rester pauvre : le pari du Senegal",
    "mansa-moussa":     "Mansa Moussa : l'homme le plus riche de tous les temps",
    "empire-ghana":     "L'Empire du Ghana : la puissance oubliee de l'Afrique de l'Ouest",
    "sonjata":          "Soundjata Keita : le fondateur de l'empire qui domina l'Afrique",
    "silicon-savannah": "Silicon Savannah : quand l'Afrique invente la tech de demain",
}

PLATFORM_CONTENT_TYPES = {
    YT: "youtube_short",
    IG: "instagram_reel",
    FB: "facebook_reel",
}


def get_file(coverB):
    c = COMPRESSED.get(coverB)
    if c:
        p = COVERS / c
        if p.exists():
            return p
    return COVERS / coverB


def trypost_upload_and_schedule(slug, filepath, platform_ids, date_iso):
    size_mb = filepath.stat().st_size // 1024 // 1024
    print(f"  [TryPost] Requesting upload slot ({size_mb} MB)...")
    r = requests.post(f"{TRYPOST_BASE}/uploads", headers=TH, timeout=30)
    if r.status_code not in (200, 201):
        raise RuntimeError(f"Slot: {r.status_code} {r.text[:150]}")
    d = r.json()
    token = d["upload_token"]
    url   = d["upload_url"]

    print(f"  [TryPost] Uploading...")
    with open(filepath, "rb") as f:
        up = requests.post(url, files={"media": (filepath.name, f, "video/mp4")}, timeout=300)
    if up.status_code not in (200, 201, 204):
        raise RuntimeError(f"Upload: {up.status_code} {up.text[:150]}")
    print(f"  [TryPost] Upload OK")

    platforms_payload = [
        {"social_account_id": pid, "content_type": PLATFORM_CONTENT_TYPES[pid]}
        for pid in platform_ids
    ]
    caption = CAPTIONS.get(slug, "")
    cr = requests.post(
        f"{TRYPOST_BASE}/posts",
        headers={**TH, "Content-Type": "application/json"},
        json={"content": caption, "platforms": platforms_payload, "scheduled_at": date_iso},
        timeout=30,
    )
    if cr.status_code not in (200, 201):
        raise RuntimeError(f"Create: {cr.status_code} {cr.text[:200]}")
    post_id = cr.json()["id"]
    print(f"  [TryPost] Post {post_id}")

    at = requests.post(
        f"{TRYPOST_BASE}/posts/{post_id}/media",
        headers={**TH, "Content-Type": "application/json"},
        json={"upload_token": token},
        timeout=30,
    )
    if at.status_code not in (200, 201, 204):
        raise RuntimeError(f"Attach: {at.status_code} {at.text[:200]}")

    pub = requests.post(
        f"{TRYPOST_BASE}/posts/{post_id}/publish",
        headers={**TH, "Content-Type": "application/json"},
        json={"scheduled_at": date_iso},
        timeout=30,
    )
    if pub.status_code not in (200, 201):
        raise RuntimeError(f"Publish: {pub.status_code} {pub.text[:200]}")
    plats = [PLATFORM_CONTENT_TYPES[p].split("_")[0] for p in platform_ids]
    print(f"  [TryPost] Scheduled {'+'.join(plats)} -> {date_iso[:10]} OK")
    return post_id


def postiz_tiktok(slug, filepath, date_iso):
    size_mb = filepath.stat().st_size // 1024 // 1024
    print(f"  [Postiz] Uploading for TikTok ({size_mb} MB)...")
    with open(filepath, "rb") as f:
        r = requests.post(
            f"{POSTIZ_BASE}/upload",
            headers=PH,
            files={"file": (filepath.name, f, "video/mp4")},
            timeout=600,
        )
    if r.status_code not in (200, 201):
        raise RuntimeError(f"Postiz upload: {r.status_code} {r.text[:150]}")
    up = r.json()
    media = [{"id": up["id"], "path": up["path"]}]
    caption = TIKTOK_CAPTIONS.get(slug, "")
    payload = {
        "type": "schedule",
        "date": date_iso.replace("Z", ".000Z"),
        "shortLink": False,
        "tags": [],
        "posts": [{
            "integration": {"id": POSTIZ_TIKTOK},
            "value": [{"content": caption, "image": media}],
            "settings": {
                "__type": "tiktok",
                "privacy_level": "PUBLIC_TO_EVERYONE",
                "duet": True, "stitch": True, "comment": True,
                "autoAddMusic": "no",
                "brand_content_toggle": False,
                "brand_organic_toggle": False,
                "content_posting_method": "DIRECT_POST",
            },
        }],
    }
    pr = requests.post(f"{POSTIZ_BASE}/posts", headers={**PH, "Content-Type": "application/json"}, json=payload, timeout=60)
    if pr.status_code not in (200, 201):
        raise RuntimeError(f"Postiz sched: {pr.status_code} {pr.text[:200]}")
    res = pr.json()
    pid = res[0].get("postId", "?") if isinstance(res, list) else "?"
    print(f"  [Postiz] TikTok scheduled -> {date_iso[:10]} (postId: {pid})")
    return pid


def main():
    print("=== Batch TryPost+Postiz — 6 videos restantes ===")
    if DRY_RUN:
        print("DRY RUN\n")

    log = []
    for i, (slug, coverB, platform_ids, date_iso) in enumerate(VIDEOS):
        filepath = get_file(coverB)
        plat_names = [PLATFORM_CONTENT_TYPES[p].split("_")[0] for p in platform_ids]
        print(f"\n[{i+1}/{len(VIDEOS)}] {slug} | {'+'.join(plat_names)}+tiktok | {date_iso[:10]}")
        print(f"  Fichier: {filepath.name} ({filepath.stat().st_size//1024//1024} MB)")

        if DRY_RUN:
            print("  [DRY-RUN] skip")
            continue

        entry = {"slug": slug, "date": date_iso}

        try:
            post_id = trypost_upload_and_schedule(slug, filepath, platform_ids, date_iso)
            entry["trypost_id"] = post_id
        except Exception as e:
            print(f"  [TryPost] ERREUR: {e}")
            entry["trypost_error"] = str(e)

        try:
            tiktok_pid = postiz_tiktok(slug, filepath, date_iso)
            entry["postiz_tiktok_id"] = tiktok_pid
        except Exception as e:
            print(f"  [Postiz] ERREUR: {e}")
            entry["postiz_error"] = str(e)

        log.append(entry)

    print(f"\n=== Done: {len(log)}/{len(VIDEOS)} ===")
    log_path = ROOT / "scripts" / "republish-batch-log.json"
    with open(log_path, "w") as f:
        json.dump(log, f, indent=2, ensure_ascii=False)
    print(f"Log: {log_path}")


if __name__ == "__main__":
    main()
