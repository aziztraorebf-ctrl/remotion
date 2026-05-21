#!/usr/bin/env python3
"""
Veille sujets viraux Souverain — ScrapCreators API
Usage : python3 scripts/tools/veille-sujets-souverain.py
Mesure la presence + performance de sujets candidats sur TikTok + YouTube.
Produit un classement actionnable pour choisir le prochain episode.
"""

import os
import time
import json
from datetime import datetime
from collections import defaultdict

import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

API_KEY = os.getenv("SCRAPE_CREATOR_API_KEY")
if not API_KEY:
    print("ERREUR : SCRAPE_CREATOR_API_KEY manquante dans .env")
    raise SystemExit(1)

BASE_URL = "https://api.scrapecreators.com"
HEADERS = {"x-api-key": API_KEY}
DELAY = 0.4  # secondes entre requetes

# ---------------------------------------------------------------------------
# Sujets candidats — modifier cette liste selon les sessions
# Format : (label_affichage, [queries_tiktok], [queries_youtube])
# ---------------------------------------------------------------------------

SUJETS = [
    (
        "Maroc batteries Kenitra",
        ["Maroc usine voiture electrique", "Maroc gigafactory batteries", "Kenitra voiture electrique"],
        ["Morocco battery factory Kenitra", "Maroc usine batteries electriques"],
    ),
    (
        "RDC cobalt batteries",
        ["RDC cobalt voiture electrique", "Congo cobalt exploitation", "africa cobalt batteries"],
        ["DRC cobalt electric car", "Congo cobalt mining batteries"],
    ),
    (
        "Migrations sahariennes",
        ["migration Sahara Afrique subsaharienne", "traversee desert migrants africains", "migration Niger Mali"],
        ["Sahara migration Africa", "sub-saharan migration desert route"],
    ),
    (
        "Zimbabwe lithium",
        ["Zimbabwe lithium mine", "Zimbabwe ban lithium export", "Zimbabwe minerais"],
        ["Zimbabwe lithium ban", "Zimbabwe lithium mining"],
    ),
    (
        "Ghana or royalties",
        ["Ghana or mine royalties", "Ghana mine or loi", "Ghana gold mining law"],
        ["Ghana gold royalties law", "Ghana mining reform gold"],
    ),
    (
        "Senegal petrole gaz",
        ["Senegal petrole 2024 2025", "Senegal gaz offshore", "Dakar petrole richesse"],
        ["Senegal oil gas discovery", "Senegal petroleum economy"],
    ),
    (
        "Nigeria economie premiere Afrique",
        ["Nigeria premiere economie Afrique", "Nigeria GDP Afrique naira", "Nigeria economie crise"],
        ["Nigeria economy Africa largest", "Nigeria GDP crisis naira"],
    ),
    (
        "Ethiopie economie croissance",
        ["Ethiopie croissance economique", "Addis Abeba developpement", "Ethiopie industrie"],
        ["Ethiopia economic growth", "Ethiopia manufacturing hub Africa"],
    ),
    (
        "Dette africaine FMI Banque Mondiale",
        ["dette Afrique FMI annulation", "dette pays africains banque mondiale", "Afrique dette souveraine"],
        ["Africa debt IMF World Bank", "African debt crisis 2025"],
    ),
    (
        "Franc CFA reforme",
        ["franc CFA reforme", "CFA monnaie Afrique souverainete", "eco monnaie Afrique"],
        ["CFA franc reform West Africa", "Africa monetary sovereignty"],
    ),
]

# ---------------------------------------------------------------------------
# Helpers API
# ---------------------------------------------------------------------------

credits_used = {"n": 0}


def api_get(endpoint, params=None):
    url = f"{BASE_URL}{endpoint}"
    try:
        r = requests.get(url, headers=HEADERS, params=params, timeout=20)
        credits_used["n"] += 1
        if r.status_code == 200:
            return r.json()
        return None
    except Exception:
        return None


def fetch_tiktok_keyword(query):
    data = api_get("/v1/tiktok/search/keyword", {"query": query, "cursor": 0})
    if not data:
        return []
    raw = data.get("search_item_list", [])
    videos = []
    for item in raw:
        v = item.get("aweme_info", item)
        stats = v.get("statistics", {})
        views = int(stats.get("play_count", 0) or 0)
        likes = int(stats.get("digg_count", 0) or 0)
        comments = int(stats.get("comment_count", 0) or 0)
        desc = v.get("desc", "")[:120]
        create_time = v.get("create_time", 0)
        try:
            pub_date = datetime.fromtimestamp(create_time).strftime("%Y-%m-%d") if create_time else "?"
        except Exception:
            pub_date = "?"
        videos.append({
            "platform": "tiktok",
            "query": query,
            "desc": desc,
            "views": views,
            "likes": likes,
            "comments": comments,
            "pub_date": pub_date,
        })
    time.sleep(DELAY)
    return videos


def fetch_youtube_search(query):
    data = api_get("/v1/youtube/search", {"query": query})
    if not data:
        return []
    raw = data.get("videos", data.get("items", []))
    videos = []
    for v in raw:
        views = int(v.get("viewCount", 0) or v.get("view_count", 0) or 0)
        likes = int(v.get("likeCount", 0) or v.get("like_count", 0) or 0)
        title = v.get("title", "")[:120]
        pub_date = v.get("publishedAt", v.get("published_at", "?"))[:10] if v.get("publishedAt") or v.get("published_at") else "?"
        videos.append({
            "platform": "youtube",
            "query": query,
            "desc": title,
            "views": views,
            "likes": likes,
            "comments": 0,
            "pub_date": pub_date,
        })
    time.sleep(DELAY)
    return videos


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

def score_sujet(videos_tiktok, videos_youtube):
    """
    Score composite sur 100 :
    - Volume brut (nb videos > 0 vues) : 20 pts
    - Vues totales TikTok : 30 pts (log-normalise)
    - Vues max TikTok (signal viral) : 20 pts
    - Presence YouTube (nb resultats) : 15 pts
    - Engagement TikTok (likes+comments / views) : 15 pts
    """
    import math

    all_tt = [v for v in videos_tiktok if v["views"] > 0]
    all_yt = [v for v in videos_youtube if v["views"] > 0]

    # Volume brut
    volume = len(all_tt) + len(all_yt)
    score_volume = min(volume / 40 * 20, 20)

    # Vues totales TikTok
    total_views_tt = sum(v["views"] for v in all_tt)
    score_views = min(math.log10(total_views_tt + 1) / 8 * 30, 30) if total_views_tt > 0 else 0

    # Vues max TikTok (1 video qui explose = signal fort)
    max_views_tt = max((v["views"] for v in all_tt), default=0)
    score_max = min(math.log10(max_views_tt + 1) / 7 * 20, 20) if max_views_tt > 0 else 0

    # Presence YouTube
    score_yt = min(len(all_yt) / 15 * 15, 15)

    # Engagement TikTok
    total_eng = sum(v["likes"] + v["comments"] for v in all_tt)
    eng_rate = total_eng / max(total_views_tt, 1)
    score_eng = min(eng_rate * 500 * 15, 15)

    total = score_volume + score_views + score_max + score_yt + score_eng
    return round(total, 1), {
        "volume": round(score_volume, 1),
        "views_tt": round(score_views, 1),
        "max_views_tt": round(score_max, 1),
        "youtube": round(score_yt, 1),
        "engagement": round(score_eng, 1),
        "total_views_tt": total_views_tt,
        "max_views_tt_raw": max_views_tt,
        "nb_tt": len(all_tt),
        "nb_yt": len(all_yt),
    }


# ---------------------------------------------------------------------------
# Rapport
# ---------------------------------------------------------------------------

def fmt(n):
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n/1_000:.0f}K"
    return str(n)


def print_report(results):
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    print()
    print("=" * 72)
    print("  VEILLE SUJETS VIRAUX SOUVERAIN — ScrapCreators API")
    print(f"  Date : {now} | Requetes API utilisees : {credits_used['n']}")
    print("=" * 72)
    print()

    sorted_results = sorted(results, key=lambda x: x["score"], reverse=True)

    print(f"  {'#':<3} {'Sujet':<35} {'Score':>5} {'TT vues':>8} {'TT max':>8} {'YT':>4}")
    print(f"  {'-'*3} {'-'*35} {'-'*5} {'-'*8} {'-'*8} {'-'*4}")

    for i, r in enumerate(sorted_results, 1):
        d = r["detail"]
        print(
            f"  {i:<3} {r['sujet']:<35} {r['score']:>5.1f} "
            f"{fmt(d['total_views_tt']):>8} {fmt(d['max_views_tt_raw']):>8} {d['nb_yt']:>4}"
        )

    print()
    print("-" * 72)
    print("  TOP 3 DETAILS")
    print("-" * 72)

    for r in sorted_results[:3]:
        d = r["detail"]
        print(f"\n  [{r['score']}/100] {r['sujet']}")
        print(f"    TikTok : {d['nb_tt']} videos, {fmt(d['total_views_tt'])} vues totales, max {fmt(d['max_views_tt_raw'])}")
        print(f"    YouTube : {d['nb_yt']} resultats")
        print(f"    Score detail : volume={d['volume']} | vues={d['views_tt']} | max={d['max_views_tt']} | yt={d['youtube']} | eng={d['engagement']}")

        # Top video TikTok
        top_tt = sorted(r["videos_tiktok"], key=lambda v: v["views"], reverse=True)
        if top_tt:
            v = top_tt[0]
            print(f"    Top TikTok : {fmt(v['views'])} vues | {v['pub_date']} | {v['desc'][:70]!r}")

        # Top video YouTube
        top_yt = sorted(r["videos_youtube"], key=lambda v: v["views"], reverse=True)
        if top_yt:
            v = top_yt[0]
            print(f"    Top YouTube : {fmt(v['views'])} vues | {v['pub_date']} | {v['desc'][:70]!r}")

    print()
    print("-" * 72)
    print("  RECOMMANDATION EDITORIALE (heuristique)")
    print("-" * 72)
    top = sorted_results[0]
    second = sorted_results[1] if len(sorted_results) > 1 else None

    print(f"\n  Sujet le plus chaud : {top['sujet']} (score {top['score']}/100)")
    if second and top["score"] - second["score"] < 10:
        print(f"  Attention : ecart faible avec {second['sujet']} (score {second['score']}/100)")
        print(f"  -> Les deux meritent consideration editoriale.")
    print()
    print("  Note : le score mesure la presence actuelle sur les reseaux.")
    print("  Un score bas peut indiquer un sujet non-couvert = opportunite gap.")
    print("  Un score eleve indique un sujet chaud = competition mais audience prouvee.")
    print()
    print("=" * 72)
    print()

    # Sauvegarde JSON
    out = {
        "date": now,
        "credits_used": credits_used["n"],
        "results": [
            {
                "sujet": r["sujet"],
                "score": r["score"],
                "detail": r["detail"],
                "top_tiktok": sorted(r["videos_tiktok"], key=lambda v: v["views"], reverse=True)[:3],
                "top_youtube": sorted(r["videos_youtube"], key=lambda v: v["views"], reverse=True)[:3],
            }
            for r in sorted_results
        ],
    }
    out_path = "/tmp/veille-souverain-latest.json"
    with open(out_path, "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"  JSON sauvegarde -> {out_path}")
    print()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print(f"\nLancement veille — {len(SUJETS)} sujets x (TikTok + YouTube)")
    print(f"Requetes estimees : {len(SUJETS) * 5} (~{len(SUJETS) * 5 * DELAY:.0f}s)\n")

    results = []

    for label, tt_queries, yt_queries in SUJETS:
        print(f"[{label}]")
        videos_tt = []
        for q in tt_queries:
            vids = fetch_tiktok_keyword(q)
            print(f"  TikTok {q!r} -> {len(vids)} videos")
            videos_tt.extend(vids)

        videos_yt = []
        for q in yt_queries:
            vids = fetch_youtube_search(q)
            print(f"  YouTube {q!r} -> {len(vids)} videos")
            videos_yt.extend(vids)

        score, detail = score_sujet(videos_tt, videos_yt)
        results.append({
            "sujet": label,
            "score": score,
            "detail": detail,
            "videos_tiktok": videos_tt,
            "videos_youtube": videos_yt,
        })
        print(f"  Score : {score}/100\n")

    print_report(results)


if __name__ == "__main__":
    main()
