#!/usr/bin/env python3
"""
X API — Fetch threads (replies) for top posts
Recupere les replies des posts cibles pour extraire les prompts complets.

Usage:
  python -u scripts/x_fetch_threads.py
"""

import os
import json
import requests
import time
from dotenv import load_dotenv

load_dotenv()

BEARER_TOKEN = os.getenv("X_BEARER_TOKEN")
if not BEARER_TOKEN:
    raise SystemExit("X_BEARER_TOKEN manquant dans .env")

SEARCH_URL = "https://api.twitter.com/2/tweets/search/recent"
TWEET_URL = "https://api.twitter.com/2/tweets"
TWEET_FIELDS = "author_id,created_at,public_metrics,entities,conversation_id"
EXPANSIONS = "author_id"
USER_FIELDS = "username,name"

TARGET_POSTS = [
    {"label": "EHuanglu — ChatGPT storyboard → Seedance tutorial", "id": "2052397863808938154", "author": "EHuanglu"},
    {"label": "HeyAbhishek — ChatGPT Image 2.0 → Seedance workflow", "id": "2052357352331108506", "author": "HeyAbhishek"},
    {"label": "doctorwasif — storyboard 4x4 grayscale prompt", "id": "2050810322315874557", "author": "doctorwasif"},
    {"label": "itxabdullaa — animate 16 panels in sequence", "id": "2051305170739277973", "author": "itxabdullaa"},
    {"label": "Dheepanratnam — character sheet + prompts in thread", "id": "2053029792996302849", "author": "Dheepanratnam"},
    {"label": "aimikoda — storyboard to video, prompts in replies", "id": "2053206564052390234", "author": "aimikoda"},
    {"label": "MO_IAI — GPT2 + Gemini 3 + Seedance 2 pipeline", "id": "2052139261911019726", "author": "MO_IAI"},
    {"label": "abxxai — ChatGPT Image 2 storyboard exact prompts", "id": "2053099329028833377", "author": "abxxai"},
    {"label": "Tegadesigns — story → storyboard → Seedance tutorial", "id": "2053028991380996096", "author": "Tegadesigns"},
    {"label": "beginnersblog1 — character sheet prompt complet", "id": "2051641323908903411", "author": "beginnersblog1"},
]


def headers():
    return {"Authorization": f"Bearer {BEARER_TOKEN}"}


def fetch_tweet(tweet_id):
    resp = requests.get(
        f"{TWEET_URL}/{tweet_id}",
        headers=headers(),
        params={
            "tweet.fields": TWEET_FIELDS,
            "expansions": EXPANSIONS,
            "user.fields": USER_FIELDS,
        },
        timeout=15,
    )
    if not resp.ok:
        return None
    return resp.json().get("data")


def fetch_thread(conversation_id, author_username, max_results=50):
    """Recupere tous les tweets d'une conversation (replies + author replies)."""
    query = f"conversation_id:{conversation_id} from:{author_username}"
    resp = requests.get(
        SEARCH_URL,
        headers=headers(),
        params={
            "query": query,
            "max_results": min(max_results, 100),
            "tweet.fields": TWEET_FIELDS,
            "expansions": EXPANSIONS,
            "user.fields": USER_FIELDS,
        },
        timeout=15,
    )
    if not resp.ok:
        print(f"  [!] Erreur thread {resp.status_code}: {resp.text[:200]}")
        return []
    return resp.json().get("data", [])


def extract_prompts(tweets):
    """Identifie les tweets contenant des prompts."""
    prompt_keywords = [
        "prompt", "create a", "generate", "animate", "using the provided",
        "character", "storyboard", "monochrome", "grayscale", "cinematic",
        "panel", "sequence", "workflow", "step", "here is", "here's the"
    ]
    results = []
    for t in tweets:
        text = t.get("text", "").lower()
        score = sum(1 for kw in prompt_keywords if kw in text)
        if score >= 2:
            results.append({"score": score, "text": t.get("text", ""), "created_at": t.get("created_at", "")})
    return sorted(results, key=lambda x: x["score"], reverse=True)


def main():
    all_results = []

    for post in TARGET_POSTS:
        print(f"\n{'=' * 60}")
        print(f"Post : {post['label']}")
        print(f"URL  : https://x.com/{post['author']}/status/{post['id']}")

        # Recuperer le tweet original pour avoir le conversation_id
        original = fetch_tweet(post["id"])
        if not original:
            print("  [!] Tweet non accessible")
            continue

        conversation_id = original.get("conversation_id", post["id"])
        print(f"Conversation ID : {conversation_id}")
        print(f"Texte original :\n{original.get('text', '')}\n")

        # Recuperer le thread (replies de l'auteur)
        thread_tweets = fetch_thread(conversation_id, post["author"])
        print(f"Replies de l'auteur : {len(thread_tweets)} tweets")

        if thread_tweets:
            prompts = extract_prompts(thread_tweets)
            if prompts:
                print(f"\n--- PROMPTS DETECTES ({len(prompts)}) ---")
                for p in prompts:
                    print(f"\n[score:{p['score']}] {p['created_at'][:10]}")
                    print(p["text"])
            else:
                print("Replies trouvees mais pas de prompts identifies")
                for t in thread_tweets[:3]:
                    print(f"  > {t.get('text', '')[:200]}")
        else:
            print("Aucune reply de l'auteur trouvee dans les 7 derniers jours")

        all_results.append({
            "label": post["label"],
            "url": f"https://x.com/{post['author']}/status/{post['id']}",
            "original_text": original.get("text", ""),
            "thread_tweets": thread_tweets,
        })

        time.sleep(0.5)

    # Export
    out_path = "/tmp/x_threads_prompts.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print(f"\n\nJSON complet : {out_path}")
    total_tweets = sum(len(r["thread_tweets"]) for r in all_results)
    print(f"Cout estime : ~${total_tweets * 0.005:.2f} ({total_tweets} tweets recuperes)")


if __name__ == "__main__":
    main()
