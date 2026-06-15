#!/usr/bin/env python3
"""
TikTok Niche Analysis - Histoire Africaine Animee Francophone
Cartographie le niche via l'API Scrape Creator.
Budget : max 50 requetes total.
"""

import os
import sys
import time
import json
from collections import defaultdict
from datetime import datetime

import requests
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

API_KEY = os.getenv("SCRAPE_CREATOR_API_KEY")
if not API_KEY:
    print("ERREUR : SCRAPE_CREATOR_API_KEY manquante dans .env")
    sys.exit(1)

BASE_URL = "https://api.scrapecreators.com"

HEADERS = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
}

HASHTAGS = [
    "histoireafricaine",
    "histoiremali",
    "empireafricain",
    "afriquehistoire",
    "africamap",
    "africahistory",
    "animatedmap",
    "africanhistory",
]

KEYWORDS = [
    "histoire afrique animation",
    "africa map animation",
    "animated african history",
    "empire mali animation",
]

MAX_REQUESTS = 50
REQUEST_BUDGET = {"used": 0}

# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------


def api_get(endpoint, params=None, retry=2):
    """GET request avec gestion d erreurs et budget."""
    if REQUEST_BUDGET["used"] >= MAX_REQUESTS:
        return None

    url = f"{BASE_URL}{endpoint}"
    for attempt in range(retry + 1):
        try:
            resp = requests.get(url, headers=HEADERS, params=params, timeout=15)
            REQUEST_BUDGET["used"] += 1

            if resp.status_code == 200:
                return resp.json()
            elif resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 5))
                print(f"  [429] Rate limit - attente {wait}s...")
                time.sleep(wait)
            elif resp.status_code == 402:
                print(f"  [402] Credits insuffisants pour {endpoint}")
                return None
            elif resp.status_code == 401:
                print(f"  [401] Cle API invalide")
                sys.exit(1)
            else:
                print(f"  [HTTP {resp.status_code}] {endpoint}")
                return None
        except requests.exceptions.Timeout:
            print(f"  [Timeout] Tentative {attempt + 1}/{retry + 1} - {endpoint}")
            if attempt < retry:
                time.sleep(2)
        except requests.exceptions.RequestException as e:
            print(f"  [Erreur reseau] {e}")
            return None
    return None


# ---------------------------------------------------------------------------
# Extraction de donnees video
# ---------------------------------------------------------------------------


def extract_video_data(video):
    """Extrait les champs utiles d un objet video TikTok.

    L API ScrapeCreator retourne des champs snake_case differents selon l endpoint :
    - hashtag : aweme_list[] avec stats.play_count, author.unique_id, create_time (epoch)
    - keyword  : search_item_list[].aweme_info avec la meme structure
    """
    stats = video.get("statistics", {})
    author = video.get("author", {})
    music = video.get("music", {})

    # Description et hashtags
    desc = video.get("desc", "")
    hashtags = []
    for word in desc.split():
        if word.startswith("#"):
            hashtags.append(word.lower().strip("#.,!?"))

    # Duree : API retourne les ms pour certains endpoints
    raw_duration = video.get("video", {}).get("duration", 0) or video.get("duration", 0)
    # Si > 10000, c est probablement en ms -> convertir en secondes
    if raw_duration and raw_duration > 10000:
        duration_s = raw_duration // 1000
    else:
        duration_s = raw_duration

    # Date publication (snake_case create_time)
    create_time = video.get("create_time", 0) or video.get("createTime", 0)
    if create_time:
        try:
            pub_date = datetime.fromtimestamp(create_time).strftime("%Y-%m-%d")
        except (OSError, ValueError):
            pub_date = "inconnue"
    else:
        pub_date = "inconnue"

    # Stats : snake_case (play_count, digg_count, comment_count, share_count)
    views = int(stats.get("play_count", 0) or stats.get("playCount", 0) or 0)
    likes = int(stats.get("digg_count", 0) or stats.get("diggCount", 0) or 0)
    comments = int(stats.get("comment_count", 0) or stats.get("commentCount", 0) or 0)
    shares = int(stats.get("share_count", 0) or stats.get("shareCount", 0) or 0)

    engagement_rate = 0.0
    if views > 0:
        engagement_rate = round((likes + comments) / views * 100, 2)

    # Username : unique_id (snake_case) ou uniqueId
    username = author.get("unique_id", "") or author.get("uniqueId", "")
    display_name = author.get("nickname", "")

    # Video ID : aweme_id ou id
    video_id = video.get("aweme_id", "") or video.get("id", "")

    return {
        "video_id": video_id,
        "username": username,
        "display_name": display_name,
        "description": desc[:120],
        "hashtags": hashtags,
        "views": views,
        "likes": likes,
        "comments": comments,
        "shares": shares,
        "engagement_rate": engagement_rate,
        "duration_s": duration_s,
        "pub_date": pub_date,
        "music_title": music.get("title", ""),
    }


# ---------------------------------------------------------------------------
# Collecte par hashtag
# ---------------------------------------------------------------------------


def fetch_hashtag_videos(hashtag):
    """Recupere une page de videos pour un hashtag donne."""
    print(f"  Hashtag #{hashtag}...")
    data = api_get("/v1/tiktok/search/hashtag", params={"hashtag": hashtag, "cursor": 0})
    if not data:
        return []

    raw_videos = data.get("aweme_list", [])
    videos = []
    for v in raw_videos:
        extracted = extract_video_data(v)
        extracted["source"] = f"#{hashtag}"
        videos.append(extracted)

    print(f"    -> {len(videos)} videos (credits restants: {data.get('credits_remaining', '?')})")
    return videos


# ---------------------------------------------------------------------------
# Collecte par mot-cle
# ---------------------------------------------------------------------------


def fetch_keyword_videos(query):
    """Recupere une page de videos pour un mot-cle donne.

    L endpoint keyword retourne search_item_list[].aweme_info (pas aweme_list).
    """
    print(f"  Keyword '{query}'...")
    data = api_get("/v1/tiktok/search/keyword", params={"query": query, "cursor": 0})
    if not data:
        return []

    # Format specifique keyword : search_item_list[].aweme_info
    raw_items = data.get("search_item_list", []) or data.get("aweme_list", []) or data.get("item_list", [])
    videos = []
    for item in raw_items:
        # Unwrap aweme_info si present
        v = item.get("aweme_info", item)
        extracted = extract_video_data(v)
        extracted["source"] = f"kw:{query}"
        videos.append(extracted)

    print(f"    -> {len(videos)} videos (credits restants: {data.get('credits_remaining', '?')})")
    return videos


# ---------------------------------------------------------------------------
# Analyse
# ---------------------------------------------------------------------------


def analyze(all_videos):
    """Calcule les stats cles sur le corpus collecte."""

    # Deduplication par video_id
    seen_ids = set()
    unique_videos = []
    for v in all_videos:
        vid = v.get("video_id", "")
        if vid and vid not in seen_ids:
            seen_ids.add(vid)
            unique_videos.append(v)
        elif not vid:
            unique_videos.append(v)

    # --- Createurs uniques ---
    creator_stats = defaultdict(lambda: {
        "display_name": "",
        "videos": 0,
        "total_views": 0,
        "total_likes": 0,
        "total_comments": 0,
        "engagement_rates": [],
    })

    for v in unique_videos:
        u = v["username"] or "inconnu"
        cs = creator_stats[u]
        cs["display_name"] = v["display_name"] or u
        cs["videos"] += 1
        cs["total_views"] += v["views"]
        cs["total_likes"] += v["likes"]
        cs["total_comments"] += v["comments"]
        if v["engagement_rate"] > 0:
            cs["engagement_rates"].append(v["engagement_rate"])

    # Engagement rate moyen par createur
    for u, cs in creator_stats.items():
        if cs["engagement_rates"]:
            cs["avg_engagement"] = round(sum(cs["engagement_rates"]) / len(cs["engagement_rates"]), 2)
        else:
            cs["avg_engagement"] = 0.0

    # --- Stats par source (hashtag / keyword) ---
    source_stats = defaultdict(lambda: {"videos": 0, "total_views": 0, "view_list": []})
    for v in unique_videos:
        s = v["source"]
        source_stats[s]["videos"] += 1
        source_stats[s]["total_views"] += v["views"]
        if v["views"] > 0:
            source_stats[s]["view_list"].append(v["views"])

    for s, ss in source_stats.items():
        if ss["view_list"]:
            ss["avg_views"] = int(sum(ss["view_list"]) / len(ss["view_list"]))
            ss["max_views"] = max(ss["view_list"])
        else:
            ss["avg_views"] = 0
            ss["max_views"] = 0

    return unique_videos, creator_stats, source_stats


# ---------------------------------------------------------------------------
# Rapport terminal
# ---------------------------------------------------------------------------


def fmt_number(n):
    """Formate un entier avec separateurs de milliers."""
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    elif n >= 1_000:
        return f"{n / 1_000:.0f}K"
    return str(n)


def print_separator(char="=", width=72):
    print(char * width)


def print_report(unique_videos, creator_stats, source_stats):
    print()
    print_separator()
    print("  ANALYSE NICHE - HISTOIRE AFRICAINE ANIMEE FRANCOPHONE - TIKTOK")
    print_separator()
    print(f"  Date        : {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Corpus      : {len(unique_videos)} videos uniques")
    print(f"  Createurs   : {len(creator_stats)} comptes detectes")
    print(f"  Requetes API: {REQUEST_BUDGET['used']}/{MAX_REQUESTS}")
    print()

    # --- TOP CREATEURS PAR ENGAGEMENT ---
    print_separator("-")
    print("  TOP 10 CREATEURS PAR ENGAGEMENT RATE MOYEN")
    print_separator("-")
    print(f"  {'Username':<25} {'Nom':<25} {'Videos':>6} {'Vues tot':>9} {'Eng%':>6}")
    print(f"  {'-'*25} {'-'*25} {'-'*6} {'-'*9} {'-'*6}")

    sorted_creators = sorted(
        creator_stats.items(),
        key=lambda x: x[1]["avg_engagement"],
        reverse=True
    )[:10]

    for username, cs in sorted_creators:
        print(
            f"  {('@' + username):<25} {cs['display_name'][:24]:<25} "
            f"{cs['videos']:>6} {fmt_number(cs['total_views']):>9} "
            f"{cs['avg_engagement']:>5.1f}%"
        )

    # --- TOP CREATEURS PAR VUES TOTALES ---
    print()
    print_separator("-")
    print("  TOP 10 CREATEURS PAR VUES TOTALES")
    print_separator("-")
    print(f"  {'Username':<25} {'Vues tot':>9} {'Likes tot':>10} {'Videos':>6}")
    print(f"  {'-'*25} {'-'*9} {'-'*10} {'-'*6}")

    sorted_by_views = sorted(
        creator_stats.items(),
        key=lambda x: x[1]["total_views"],
        reverse=True
    )[:10]

    for username, cs in sorted_by_views:
        print(
            f"  {('@' + username):<25} {fmt_number(cs['total_views']):>9} "
            f"{fmt_number(cs['total_likes']):>10} {cs['videos']:>6}"
        )

    # --- VUES MOYENNES PAR SOURCE ---
    print()
    print_separator("-")
    print("  PERFORMANCE PAR SOURCE (hashtag / mot-cle)")
    print_separator("-")
    print(f"  {'Source':<35} {'Videos':>6} {'Moy vues':>9} {'Max vues':>9}")
    print(f"  {'-'*35} {'-'*6} {'-'*9} {'-'*9}")

    sorted_sources = sorted(
        source_stats.items(),
        key=lambda x: x[1]["avg_views"],
        reverse=True
    )
    for source, ss in sorted_sources:
        print(
            f"  {source:<35} {ss['videos']:>6} "
            f"{fmt_number(ss['avg_views']):>9} {fmt_number(ss['max_views']):>9}"
        )

    # --- TOP 5 VIDEOS (par vues) ---
    print()
    print_separator("-")
    print("  TOP 5 VIDEOS PAR VUES")
    print_separator("-")
    top_videos = sorted(unique_videos, key=lambda x: x["views"], reverse=True)[:5]
    for i, v in enumerate(top_videos, 1):
        print(f"  {i}. @{v['username']} | {fmt_number(v['views'])} vues | {v['engagement_rate']}% eng")
        print(f"     [{v['source']}] {v['pub_date']} | {v['duration_s']}s")
        print(f"     {v['description'][:80]}...")
        print()

    # --- HASHTAGS LES PLUS FREQUENTS DANS LES DESCRIPTIONS ---
    print_separator("-")
    print("  HASHTAGS LES PLUS UTILISES DANS LES DESCRIPTIONS")
    print_separator("-")
    hashtag_counter = defaultdict(int)
    for v in unique_videos:
        for h in v["hashtags"]:
            if len(h) > 2:
                hashtag_counter[h] += 1

    top_hashtags = sorted(hashtag_counter.items(), key=lambda x: x[1], reverse=True)[:20]
    line = ""
    for h, count in top_hashtags:
        entry = f"#{h}({count})  "
        if len(line) + len(entry) > 70:
            print(f"  {line}")
            line = entry
        else:
            line += entry
    if line:
        print(f"  {line}")

    # --- GAP ANALYSIS ---
    print()
    print_separator("-")
    print("  GAP ANALYSIS - CE QUI MANQUE DANS LE NICHE")
    print_separator("-")

    # Detecter si des sous-themes sont absents
    theme_keywords = {
        "empire ghana": ["ghana", "wagadou", "koumbi"],
        "hannibal carthage": ["hannibal", "carthage"],
        "empire songhai": ["songhai", "askia"],
        "royaume kongo": ["kongo"],
        "empire axoum": ["axoum", "aksum", "aksum"],
        "empire du mali": ["mali", "mansa", "mande", "sundiata"],
        "empire ottoman afrique": ["ottoman"],
        "empire ethiopien": ["ethiopie", "abyssinie", "menelik"],
        "animation carte d3": ["d3", "animation", "carte", "map"],
        "francophone": ["francais", "afrique", "histoire"],
    }

    all_descriptions = " ".join(
        (v["description"] + " " + " ".join(v["hashtags"])).lower()
        for v in unique_videos
    )

    gaps = []
    present = []
    for theme, kws in theme_keywords.items():
        found = any(kw in all_descriptions for kw in kws)
        if found:
            present.append(theme)
        else:
            gaps.append(theme)

    print(f"\n  THEMES PRESENTS ({len(present)}) :")
    for t in present:
        print(f"    + {t}")

    print(f"\n  OPPORTUNITES / GAPS ({len(gaps)}) :")
    for t in gaps:
        print(f"    - {t}  <-- absent du niche")

    # Proportion francophone vs anglophone
    fr_count = sum(1 for v in unique_videos if v["source"].startswith("#histoire") or
                   "fr" in v["description"].lower() or "afrique" in v["description"].lower())
    en_count = len(unique_videos) - fr_count
    print(f"\n  LANGUE ESTIMEE :")
    print(f"    Francophone : {fr_count} videos ({round(fr_count/max(len(unique_videos),1)*100)}%)")
    print(f"    Anglophone  : {en_count} videos ({round(en_count/max(len(unique_videos),1)*100)}%)")

    # Durees
    durations = [v["duration_s"] for v in unique_videos if v["duration_s"] > 0]
    if durations:
        avg_dur = sum(durations) / len(durations)
        print(f"\n  DUREE MOYENNE VIDEOS : {avg_dur:.0f}s")
        under_60 = sum(1 for d in durations if d <= 60)
        over_60 = len(durations) - under_60
        print(f"    <= 60s : {under_60} videos | > 60s : {over_60} videos")

    # --- RECOMMANDATIONS STRATEGIQUES ---
    print()
    print_separator("-")
    print("  RECOMMANDATIONS STRATEGIQUES POUR GEOAFRIQUE")
    print_separator("-")

    top_eng_creator = sorted_creators[0] if sorted_creators else None
    top_views_creator = sorted_by_views[0] if sorted_by_views else None
    best_source = sorted_sources[0] if sorted_sources else None

    if top_eng_creator:
        u, cs = top_eng_creator
        print(f"  1. Createur a surveiller : @{u} ({cs['avg_engagement']}% engagement)")
    if best_source:
        src, ss = best_source
        print(f"  2. Source la plus performante : {src} ({fmt_number(ss['avg_views'])} vues moy)")
    if gaps:
        print(f"  3. Themes non couverts par la concurrence :")
        for t in gaps[:5]:
            print(f"       -> {t}")
    print(f"  4. Format dominant : videos {'courtes (<60s)' if durations and sum(1 for d in durations if d<=60) > len(durations)/2 else 'longues (>60s)'}")
    print(f"  5. Langue francophone sous-representee : potentiel blue-ocean")

    print()
    print_separator()
    print(f"  Analyse terminee. {REQUEST_BUDGET['used']} requetes utilisees.")
    print_separator()
    print()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    print()
    print("Demarrage analyse TikTok - Niche Histoire Africaine Animee")
    print(f"Budget : {MAX_REQUESTS} requetes max")
    print()

    all_videos = []

    # Phase 1 : Hashtags
    print("[Phase 1] Collecte par hashtags...")
    for hashtag in HASHTAGS:
        if REQUEST_BUDGET["used"] >= MAX_REQUESTS:
            print("  Budget atteint, arret hashtags.")
            break
        videos = fetch_hashtag_videos(hashtag)
        for v in videos:
            all_videos.append(v)
        time.sleep(0.3)  # Politesse API

    print(f"\n  Total apres hashtags : {len(all_videos)} videos brutes")

    # Phase 2 : Keywords (si budget restant)
    remaining = MAX_REQUESTS - REQUEST_BUDGET["used"]
    print(f"\n[Phase 2] Collecte par mots-cles ({remaining} requetes restantes)...")
    for query in KEYWORDS:
        if REQUEST_BUDGET["used"] >= MAX_REQUESTS:
            print("  Budget atteint, arret keywords.")
            break
        videos = fetch_keyword_videos(query)
        for v in videos:
            all_videos.append(v)
        time.sleep(0.3)

    print(f"\n  Total brut collecte : {len(all_videos)} videos")

    if not all_videos:
        print("ERREUR : Aucune video collectee. Verifier la cle API et les endpoints.")
        sys.exit(1)

    # Analyse
    print("\n[Phase 3] Analyse du corpus...")
    unique_videos, creator_stats, source_stats = analyze(all_videos)

    # Rapport
    print_report(unique_videos, creator_stats, source_stats)


if __name__ == "__main__":
    main()
