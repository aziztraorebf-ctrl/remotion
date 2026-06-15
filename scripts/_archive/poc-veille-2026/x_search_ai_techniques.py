#!/usr/bin/env python3
"""
X API Search — AI Video Techniques
Recherche les posts sur Seedance 2.0, storyboard IA, Gemini, ChatGPT Image
sur les 7 derniers jours. Exporte JSON + résumé lisible.

Usage:
  python -u scripts/x_search_ai_techniques.py
  python -u scripts/x_search_ai_techniques.py --days 7 --max 300
"""

import os
import json
import argparse
import requests
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()

BEARER_TOKEN = os.getenv("X_BEARER_TOKEN")
if not BEARER_TOKEN:
    raise SystemExit("X_BEARER_TOKEN manquant dans .env")

SEARCH_URL = "https://api.twitter.com/2/tweets/search/recent"

QUERIES = [
    {
        "label": "Seedance storyboard workflow",
        "query": '(seedance OR "seedance 2.0" OR seedance2) (storyboard OR workflow OR technique OR "step by step" OR tutorial OR prompt OR "how to" OR process OR tips) -is:retweet lang:en',
    },
    {
        "label": "Seedance image to video",
        "query": '(seedance OR "seedance 2.0" OR seedance2) ("image to video" OR i2v OR "img2vid" OR gemini OR chatgpt OR midjourney OR flux OR "reference image") -is:retweet lang:en',
    },
    {
        "label": "Gemini storyboard workflow",
        "query": '(gemini OR "gemini 2.0" OR "gemini flash") (storyboard OR "image to video" OR workflow OR "video generation" OR "AI video") (tutorial OR technique OR tips OR prompt OR "how to") -is:retweet lang:en',
    },
    {
        "label": "ChatGPT image AI video",
        "query": '("chatgpt image" OR "gpt-4o" OR "chatgpt 4o") (storyboard OR "image to video" OR "AI video" OR workflow OR technique OR tutorial) -is:retweet lang:en',
    },
]

TWEET_FIELDS = "author_id,created_at,public_metrics,entities,attachments"
EXPANSIONS = "author_id,attachments.media_keys"
USER_FIELDS = "username,name,description,public_metrics"
MEDIA_FIELDS = "type,url,preview_image_url"


def headers():
    return {"Authorization": f"Bearer {BEARER_TOKEN}"}


def search_query(label, query, start_time, max_results=100):
    params = {
        "query": query,
        "max_results": min(max_results, 100),
        "start_time": start_time,
        "tweet.fields": TWEET_FIELDS,
        "expansions": EXPANSIONS,
        "user.fields": USER_FIELDS,
        "media.fields": MEDIA_FIELDS,
    }

    all_tweets = []
    users_map = {}
    media_map = {}
    next_token = None
    fetched = 0

    while fetched < max_results:
        if next_token:
            params["next_token"] = next_token
        elif "next_token" in params:
            del params["next_token"]

        resp = requests.get(SEARCH_URL, headers=headers(), params=params, timeout=15)

        if resp.status_code == 429:
            print(f"  [!] Rate limit atteint pour '{label}' — arret pagination")
            break

        if not resp.ok:
            print(f"  [!] Erreur {resp.status_code} pour '{label}': {resp.text[:200]}")
            break

        data = resp.json()
        tweets = data.get("data", [])
        if not tweets:
            break

        all_tweets.extend(tweets)
        fetched += len(tweets)

        # Extraire users et media des includes
        includes = data.get("includes", {})
        for u in includes.get("users", []):
            users_map[u["id"]] = u
        for m in includes.get("media", []):
            media_map[m["media_key"]] = m

        meta = data.get("meta", {})
        next_token = meta.get("next_token")
        if not next_token or fetched >= max_results:
            break

        # Mettre a jour max_results restant pour la prochaine page
        remaining = max_results - fetched
        params["max_results"] = min(remaining, 100)

    return all_tweets, users_map, media_map


def format_tweet(tweet, users_map, media_map):
    metrics = tweet.get("public_metrics", {})
    engagement = metrics.get("like_count", 0) + metrics.get("retweet_count", 0) * 2

    author = users_map.get(tweet.get("author_id"), {})
    username = author.get("username", "unknown")

    urls = []
    entities = tweet.get("entities", {})
    for url_obj in entities.get("urls", []):
        expanded = url_obj.get("expanded_url", "")
        if not expanded.startswith("https://twitter.com") and not expanded.startswith("https://x.com"):
            urls.append(expanded)

    media_types = []
    attachments = tweet.get("attachments", {})
    for mk in attachments.get("media_keys", []):
        m = media_map.get(mk, {})
        if m.get("type"):
            media_types.append(m["type"])

    return {
        "id": tweet["id"],
        "author": username,
        "author_followers": author.get("public_metrics", {}).get("followers_count", 0),
        "created_at": tweet.get("created_at", ""),
        "text": tweet.get("text", ""),
        "likes": metrics.get("like_count", 0),
        "retweets": metrics.get("retweet_count", 0),
        "replies": metrics.get("reply_count", 0),
        "engagement": engagement,
        "urls": urls,
        "media": media_types,
        "url": f"https://x.com/{username}/status/{tweet['id']}",
    }


def print_summary(results_by_label):
    print("\n" + "=" * 60)
    print("RÉSUMÉ — AI Video Techniques sur X")
    print("=" * 60)

    all_tweets = []
    for label, tweets in results_by_label.items():
        all_tweets.extend(tweets)
        print(f"\n[{label}] — {len(tweets)} posts")

    # Dédupliquer par ID
    seen = set()
    unique = []
    for t in all_tweets:
        if t["id"] not in seen:
            seen.add(t["id"])
            unique.append(t)

    print(f"\nTotal unique : {len(unique)} posts")

    # Top 10 par engagement
    top = sorted(unique, key=lambda x: x["engagement"], reverse=True)[:10]
    print("\n--- TOP 10 par engagement ---")
    for i, t in enumerate(top, 1):
        media_tag = f" [{','.join(t['media'])}]" if t["media"] else ""
        urls_tag = f" -> {t['urls'][0]}" if t["urls"] else ""
        print(f"{i:2}. @{t['author']} | {t['likes']}L {t['retweets']}RT{media_tag}")
        print(f"    {t['text'][:120].strip()}...")
        print(f"    {t['url']}{urls_tag}")

    # Comptes les plus actifs
    author_counts = defaultdict(int)
    for t in unique:
        author_counts[t["author"]] += 1
    top_authors = sorted(author_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    print("\n--- Comptes les plus actifs ---")
    for author, count in top_authors:
        print(f"  @{author} : {count} posts")

    # Posts avec vidéo
    with_video = [t for t in unique if "video" in t.get("media", [])]
    print(f"\nPosts avec vidéo native X : {len(with_video)}")

    # Posts avec URLs externes
    with_urls = [t for t in unique if t["urls"]]
    print(f"Posts avec liens externes : {len(with_urls)}")

    return unique


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=7, help="Nombre de jours en arriere (defaut: 7)")
    parser.add_argument("--max", type=int, default=75, help="Max posts par mot-cle (defaut: 75)")
    args = parser.parse_args()

    start_time = (datetime.now(timezone.utc) - timedelta(days=args.days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    print(f"Periode : {args.days} derniers jours (depuis {start_time})")
    print(f"Max par requete : {args.max} posts\n")

    results_by_label = {}
    all_users = {}
    all_media = {}

    for q in QUERIES:
        print(f"Recherche : {q['label']}...")
        tweets, users, media = search_query(q["label"], q["query"], start_time, args.max)
        all_users.update(users)
        all_media.update(media)

        formatted = [format_tweet(t, users, media) for t in tweets]
        results_by_label[q["label"]] = formatted
        print(f"  -> {len(formatted)} posts recuperes")

    unique = print_summary(results_by_label)

    # Export JSON
    out_path = "/tmp/x_search_ai_techniques.json"
    export = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "period_days": args.days,
        "total_unique": len(unique),
        "by_query": results_by_label,
        "all_unique_sorted_by_engagement": sorted(unique, key=lambda x: x["engagement"], reverse=True),
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(export, f, ensure_ascii=False, indent=2)

    print(f"\nJSON complet : {out_path}")
    estimated_cost = sum(len(v) for v in results_by_label.values()) * 0.005
    print(f"Cout estime : ~${estimated_cost:.2f}")


if __name__ == "__main__":
    main()
