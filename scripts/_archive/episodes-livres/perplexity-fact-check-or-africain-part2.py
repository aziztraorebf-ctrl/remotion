#!/usr/bin/env python3
"""
Part 2 fact-check : affirmations 4 à 8 (les 3 premières sont déjà validées).
"""

import os, sys, time, json, requests
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY: print("OPENROUTER_API_KEY missing"); sys.exit(1)

PROMPT = """Tu es fact-checker pour un documentaire vidéo. Vérifie ces 5 affirmations restantes du script "Or Africain" (Short 99.5s sortie 2026-05-07). Pour chacune : verdict (✅ CONFIRMÉ / ⚠️ NUANCÉ / ❌ FAUX) + source primaire (URL + nom + date) + notes correction si nécessaire.

**Affirmation 4** : "En janvier 2026, l'or dépasse 5 000 $ l'once pour la PREMIÈRE FOIS de l'histoire"
- Confirmer date exacte du seuil 5000$/once.

**Affirmation 5** : "Le Ghana propose des royalties progressives : de 5% à 12% selon le cours" (durée: début 2026)
- Cette loi a-t-elle été proposée ? Votée ? Signée ? Statut actuel mai 2026 ? Barème exact (5-12% confirmé) ?

**Affirmation 6** : "USA, UK, Chine, Canada, Australie ont écrit une LETTRE OFFICIELLE au Ghana" disant "n'allez pas plus loin, cette loi menace nos investissements"
- Cette lettre officielle existe-t-elle (document écrit) ? Ou s'agit-il d'une "pression diplomatique" générique sans lettre formelle ? À quelle date ? Citation exacte ?

**Affirmation 7** : "Le Mali a saisi 3 tonnes d'or à Barrick Mining — règlement 430M$ (novembre 2025)"
- Confirmer 3 tonnes saisies, montant 430M$, date novembre 2025, source primaire Barrick ou gouvernement Mali.

**Affirmation 8** : "Le Niger a nationalisé sa SEULE MINE INDUSTRIELLE" (badge vidéo : "100% nationalisé")
- Le Niger a-t-il vraiment qu'UNE SEULE mine industrielle ? Mine Somaïr (uranium) confirmée 100% nationalisée ? Date ? Y a-t-il d'autres mines industrielles au Niger qui n'auraient pas été nationalisées ?

Pour chaque réponse : 4-6 lignes max, structuré, dense. Pas de blabla."""

body = {
    "model": "perplexity/sonar-deep-research",
    "messages": [{"role": "user", "content": PROMPT}],
    "max_tokens": 3000,
    "temperature": 0.2,
}
headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json", "HTTP-Referer": "https://claude.ai", "X-Title": "OrAfricain FactCheck Part2"}

print("Lancement Perplexity Deep Research part 2 (30-90s)...")
t0 = time.time()
r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body, timeout=300)
elapsed = time.time() - t0
if r.status_code != 200:
    print(f"ERREUR {r.status_code}: {r.text[:500]}"); sys.exit(1)
data = r.json()
text = data["choices"][0]["message"]["content"]
usage = data.get("usage", {})
cost = (usage.get("prompt_tokens", 0) * 2.0 + usage.get("completion_tokens", 0) * 8.0) / 1_000_000
print(f"\nTime: {elapsed:.1f}s | Tokens: {usage.get('prompt_tokens')}/{usage.get('completion_tokens')} | Cost: ${cost:.4f}\n")
print(text)

with open("memory/episodes/money-legends/or-africain-fact-check-perplexity-part2.md", "w", encoding="utf-8") as f:
    f.write(f"# Fact-Check Part 2 - Affirmations 4 à 8\n\nDate: 2026-05-07 | Cost: ${cost:.4f}\n\n---\n\n{text}")
print("\nSaved part 2.")
