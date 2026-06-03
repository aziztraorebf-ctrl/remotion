"""
postiz-weekly-check.py — Vérification mi-semaine (JEUDI) des publications Postiz.

Vérifie que les posts programmés du LUNDI au JEUDI de la semaine courante ont bien
été PUBLISHED. Sort un rapport clair + exit code non-zéro si un post a échoué/manqué
(utile pour qu'une routine cloud déclenche une alerte).

CLOUD-SAFE :
- Clé via variable d'environnement POSTIZ_API_KEY (PAS de .env local requis).
  En local : lit aussi .env si présent (fallback dev).
- Aucun chemin local en dur. Dépend uniquement de l'API Postiz.

Usage :
  python3 scripts/postiz-weekly-check.py              # lundi→jeudi semaine courante
  python3 scripts/postiz-weekly-check.py --full-week  # lundi→dimanche
"""
import os
import sys
import requests
from datetime import datetime, timezone, timedelta

# Clé : env d'abord (cloud), puis .env local (dev) en fallback
API_KEY = os.environ.get("POSTIZ_API_KEY")
if not API_KEY:
    try:
        from pathlib import Path
        from dotenv import load_dotenv
        load_dotenv(Path(__file__).resolve().parents[1] / ".env")
        API_KEY = os.environ.get("POSTIZ_API_KEY")
    except Exception:
        pass
if not API_KEY:
    print("ERREUR : POSTIZ_API_KEY absente (env ou .env).")
    sys.exit(2)

BASE = "https://api.postiz.com/public/v1"
HEADERS = {"Authorization": API_KEY}
FULL_WEEK = "--full-week" in sys.argv

now = datetime.now(timezone.utc)
monday = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
end = monday + timedelta(days=7) if FULL_WEEK else now  # jusqu'à maintenant (jeudi) par défaut

ISO = "%Y-%m-%dT%H:%M:%S.000Z"
params = {"startDate": monday.strftime(ISO), "endDate": (monday + timedelta(days=7)).strftime(ISO)}

resp = requests.get(f"{BASE}/posts", headers=HEADERS, params=params, timeout=30)
if resp.status_code != 200:
    print(f"ERREUR API Postiz : {resp.status_code} {resp.text[:200]}")
    sys.exit(2)

posts = resp.json().get("posts", [])

# On ne juge que les posts dont la date de publication est DÉJÀ passée
due = []
for p in posts:
    pd = datetime.fromisoformat(p["publishDate"].replace("Z", "+00:00"))
    if monday <= pd <= end and pd <= now:
        due.append(p)

published = [p for p in due if p["state"] == "PUBLISHED"]
problems = [p for p in due if p["state"] != "PUBLISHED"]

print("=" * 60)
print(f"POSTIZ — Check mi-semaine ({now.strftime('%A %d %b %Y %H:%M UTC')})")
print(f"Fenêtre : {monday.strftime('%d %b')} → {'dimanche' if FULL_WEEK else 'maintenant'}")
print("=" * 60)
print(f"À publier (échéance passée) : {len(due)}")
print(f"  ✅ Publiés  : {len(published)}")
print(f"  ⚠️  Problème : {len(problems)}")

if due:
    print("\nDétail :")
    for p in sorted(due, key=lambda x: x["publishDate"]):
        plat = p["integration"]["providerIdentifier"]
        flag = "✅" if p["state"] == "PUBLISHED" else f"⚠️ {p['state']}"
        c = p["content"].split("\n")[0][:40]
        date = p["publishDate"][:16].replace("T", " ")
        url = p.get("releaseURL") or ""
        print(f"  {date} [{plat:10}] {flag:14} {c}")
        if url:
            print(f"                ↳ {url}")

# Prochains posts en attente (info, pas une alerte)
upcoming = [p for p in posts if datetime.fromisoformat(p["publishDate"].replace("Z", "+00:00")) > now]
if upcoming:
    print(f"\n⏳ À venir cette semaine : {len(set(p['publishDate'] for p in upcoming))} créneau(x)")
    for pd in sorted(set(p["publishDate"] for p in upcoming)):
        sample = next(p for p in upcoming if p["publishDate"] == pd)
        print(f"  {pd[:16].replace('T',' ')} — {sample['content'].split(chr(10))[0][:40]}")

if problems:
    print(f"\n🚨 ALERTE : {len(problems)} post(s) non publié(s) — vérifier Postiz.")
    sys.exit(1)
print("\n✓ Tout est en ordre.")
sys.exit(0)
