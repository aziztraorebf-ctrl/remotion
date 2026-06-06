#!/usr/bin/env python3
"""
outlier-scan.py — Detection d'OUTLIERS YouTube dans une niche (ScrapeCreators API).

Principe (technique des createurs data-driven) : une video qui fait BEAUCOUP plus de
vues que la mediane de sa chaine = signal fort. Le sujet/format/angle a touche quelque
chose. On cherche ces "outliers" recents pour reperer ce qui marche AVANT de produire.

Difference avec last30days : last30days = pouls general cross-platform. outlier-scan =
"cette video precise a fait x5-x10 sa chaine il y a 2 semaines" = signal actionnable.

Workflow recommande (voir CLAUDE.md) :
  1. last30days (pouls niche)
  2. outlier-scan (CE script — quelles videos surperforment)
  3. croiser : sujet a demande validee + format qu'on est seul a faire
  4. production pipeline premium

Usage :
  python3 scripts/tools/outlier-scan.py
  python3 scripts/tools/outlier-scan.py --queries "lobito corridor,africa minerals,china africa"
  python3 scripts/tools/outlier-scan.py --min-ratio 3 --max-age-days 45

NO emojis (code file).
"""
import argparse
import json
import os
import statistics
import time
from datetime import datetime

import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

API_KEY = os.getenv("SCRAPE_CREATOR_API_KEY")
if not API_KEY:
    print("ERREUR : SCRAPE_CREATOR_API_KEY manquante dans .env")
    raise SystemExit(1)

BASE_URL = "https://api.scrapecreators.com"
HEADERS = {"x-api-key": API_KEY}
DELAY = 0.35

# Requetes par defaut : niche carte/geopol/Afrique macro (modifiable via --queries)
DEFAULT_QUERIES = [
    "africa map animated",
    "lobito corridor",
    "africa china minerals",
    "africa economy explained",
    "war map africa",
    "africa resources geopolitics",
    "sahel explained",
    "africa empire history map",
]


def api_get(endpoint, params=None):
    try:
        r = requests.get(f"{BASE_URL}{endpoint}", headers=HEADERS, params=params or {}, timeout=30)
        time.sleep(DELAY)
        if r.status_code == 200:
            return r.json()
        return {}
    except Exception as exc:
        print(f"  [warn] {endpoint} : {exc}")
        return {}


def search_videos(query, max_n=15):
    """Retourne les videos d'une recherche YouTube (titre, vues, chaine, age)."""
    data = api_get("/v1/youtube/search", {"query": query})
    out = []
    for v in (data.get("videos") or [])[:max_n]:
        ch = v.get("channel") or {}
        out.append({
            "id": v.get("id"),
            "title": v.get("title", ""),
            "url": v.get("url", ""),
            "views": int(v.get("viewCountInt", 0) or 0),
            "channel_handle": ch.get("handle", ""),
            "channel_title": ch.get("title", ""),
            "published": v.get("publishedTimeText", ""),
            "length_s": int(v.get("lengthSeconds", 0) or 0),
            "query": query,
        })
    return out


def channel_median_views(handle, exclude_id=None, sample=12):
    """Mediane des vues des dernieres videos d'une chaine = baseline pour l'outlier ratio."""
    if not handle:
        return None
    data = api_get("/v1/youtube/channel-videos", {"handle": handle})
    views = []
    for v in (data.get("videos") or [])[:sample]:
        if v.get("id") == exclude_id:
            continue
        vc = int(v.get("viewCountInt", 0) or 0)
        if vc > 0:
            views.append(vc)
    if len(views) < 3:
        return None
    return statistics.median(views)


def is_recent(published_text, max_age_days):
    """Heuristique sur le texte 'il y a X' de YouTube (pas de date exacte via l'API search)."""
    t = (published_text or "").lower()
    if any(u in t for u in ["hour", "heure", "minute", "day", "jour", "week", "semaine"]):
        return True
    if "month" in t or "mois" in t:
        # extrait le nombre de mois
        import re
        m = re.search(r"(\d+)", t)
        months = int(m.group(1)) if m else 1
        return months * 30 <= max_age_days
    return False  # annees = trop vieux


def fmt(n):
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n/1_000:.0f}k"
    return str(n)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--queries", help="liste separee par virgules (sinon niche par defaut)")
    ap.add_argument("--min-ratio", type=float, default=2.5, help="ratio vues/mediane-chaine pour qualifier un outlier")
    ap.add_argument("--max-age-days", type=int, default=60, help="age max de la video")
    ap.add_argument("--min-views", type=int, default=20000, help="plancher de vues absolu")
    args = ap.parse_args()

    queries = [q.strip() for q in args.queries.split(",")] if args.queries else DEFAULT_QUERIES

    print(f"OUTLIER SCAN — {len(queries)} requetes | seuil ratio >={args.min_ratio} | age <={args.max_age_days}j | min {fmt(args.min_views)} vues\n")

    outliers = []
    seen_channels = {}  # cache mediane par chaine

    for q in queries:
        print(f"[scan] {q}")
        vids = search_videos(q)
        for v in vids:
            if v["views"] < args.min_views:
                continue
            if not is_recent(v["published"], args.max_age_days):
                continue
            handle = v["channel_handle"]
            if handle not in seen_channels:
                seen_channels[handle] = channel_median_views(handle, exclude_id=v["id"])
            median = seen_channels[handle]
            if not median or median <= 0:
                continue
            ratio = v["views"] / median
            if ratio >= args.min_ratio:
                v["channel_median"] = median
                v["ratio"] = ratio
                outliers.append(v)

    # tri par ratio decroissant
    outliers.sort(key=lambda x: x["ratio"], reverse=True)

    print(f"\n{'='*70}")
    print(f"OUTLIERS DETECTES : {len(outliers)}")
    print(f"{'='*70}\n")

    for o in outliers:
        fmt_type = "SHORT" if o["length_s"] and o["length_s"] <= 75 else "LONG "
        print(f"x{o['ratio']:.1f}  [{fmt_type}] {fmt(o['views'])} vues (mediane chaine {fmt(o['channel_median'])})")
        print(f"      \"{o['title'][:70]}\"")
        print(f"      {o['channel_title']} | {o['published']} | {o['url']}")
        print()

    # sauvegarde JSON pour reutilisation
    out_path = os.path.join(os.path.dirname(__file__), "..", "..", "memory",
                            "tools", "outlier-scan-latest.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"queries": queries, "outliers": outliers,
                   "params": vars(args)}, f, indent=2, ensure_ascii=False)
    print(f"-> {out_path}")
    print(f"Credits restants : voir derniere reponse API")


if __name__ == "__main__":
    main()
