"""
postiz-weekly-report.py — Bilan hebdomadaire (SAMEDI) des publications Kora & Cartes.

Liste tous les posts PUBLIÉS de la semaine écoulée avec leurs URLs live, regroupés
par contenu. Sert de "tableau de bord anti-scroll" : tu ouvres directement chaque
post pour voir ses stats natives, sans parcourir ton fil.

⚠️ LIMITE CONNUE : l'API publique Postiz n'expose PAS les métriques d'engagement
(vues/likes/commentaires). Ce rapport donne les LIENS pour consulter les stats sur
chaque plateforme. L'agrégation auto des vues nécessiterait les APIs natives
(Meta Graph / TikTok / Instagram) — chantier séparé non couvert ici.

CLOUD-SAFE : clé via POSTIZ_API_KEY (env), fallback .env local.

Usage :
  python3 scripts/postiz-weekly-report.py            # semaine écoulée (lundi→dimanche)
  python3 scripts/postiz-weekly-report.py --days 14  # 14 derniers jours
"""
import os
import sys
import requests
from datetime import datetime, timezone, timedelta

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
    print("ERREUR : POSTIZ_API_KEY absente.")
    sys.exit(2)

BASE = "https://api.postiz.com/public/v1"
HEADERS = {"Authorization": API_KEY}

DAYS = None
if "--days" in sys.argv:
    DAYS = int(sys.argv[sys.argv.index("--days") + 1])

now = datetime.now(timezone.utc)
if DAYS:
    start = now - timedelta(days=DAYS)
else:
    # semaine écoulée : lundi dernier → maintenant
    start = (now - timedelta(days=now.weekday() + 7)).replace(hour=0, minute=0, second=0, microsecond=0)

ISO = "%Y-%m-%dT%H:%M:%S.000Z"
params = {"startDate": start.strftime(ISO), "endDate": now.strftime(ISO)}
resp = requests.get(f"{BASE}/posts", headers=HEADERS, params=params, timeout=30)
if resp.status_code != 200:
    print(f"ERREUR API : {resp.status_code} {resp.text[:200]}")
    sys.exit(2)

posts = [p for p in resp.json().get("posts", []) if p["state"] == "PUBLISHED"]

# Regrouper par post logique = (date de publication + titre sans hashtags).
# Les captions diffèrent par canal (hashtags), mais le titre + la date sont communs.
def group_key(p):
    title = p["content"].split("\n")[0].split("#")[0].strip()[:40]
    return (p["publishDate"][:16], title)

by_content = {}
labels = {}
for p in posts:
    k = group_key(p)
    by_content.setdefault(k, []).append(p)
    if k not in labels:
        labels[k] = p["content"].split("\n")[0].split("#")[0].strip()[:60]

print("=" * 64)
print(f"BILAN HEBDO Kora & Cartes — {now.strftime('%A %d %b %Y')}")
print(f"Période : {start.strftime('%d %b')} → {now.strftime('%d %b')}")
print("=" * 64)
print(f"\n{len(by_content)} contenu(s) publié(s) sur {len(posts)} canaux au total.\n")

if not by_content:
    print("Aucun post publié sur la période.")
    sys.exit(0)

for i, (k, group) in enumerate(sorted(by_content.items(), key=lambda x: x[1][0]["publishDate"]), 1):
    date = group[0]["publishDate"][:10]
    print(f"{i}. [{date}] {labels[k]}")
    for p in group:
        plat = p["integration"]["providerIdentifier"]
        url = p.get("releaseURL") or "(URL non disponible)"
        print(f"     {plat:20} → {url}")
    print()

print("-" * 64)
print("👉 Ouvre les liens pour voir les stats natives (vues/likes/commentaires).")
print("   L'API Postiz ne fournit pas ces chiffres — consultation manuelle ciblée.")
print("\n📊 Pour le bilan : note ce qui a percé vs stagné. Décisions à 2 semaines,")
print("   pas à chaud. Régularité > vues des premiers posts (compte en amorçage).")
