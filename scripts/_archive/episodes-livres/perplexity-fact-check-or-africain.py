#!/usr/bin/env python3
"""
Fact-check rétroactif du script Or Africain via Perplexity Sonar Deep Research (OpenRouter).
RÈGLE D'OR : à faire AVANT TTS sur les futures vidéos. Ici en post-mortem pour valider la v3.
"""

import os
import sys
import json
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("OPENROUTER_API_KEY missing in .env"); sys.exit(1)

MODEL = "perplexity/sonar-deep-research"
URL = "https://openrouter.ai/api/v1/chat/completions"

# Script Or Africain complet (texte plain, version FINAL diffusée)
SCRIPT_OR_AFRICAIN = """
SCRIPT VIDÉO "Or Africain" — Short documentaire 9:16, 99.5s, sortie publication 2026-05-07

[BEAT 1 - HOOK 9.7s]
Le prix de l'or vient de battre tous les records.
Six gouvernements se sont levés contre le Ghana.
Le Ghana a signé quand même.

[BEAT 2 - CONTEXTE 17.6s]
Depuis deux mille dix, le Ghana touchait cinq pour cent de royalties sur son or — peu importe si le prix était à mille ou cinq mille dollars l'once.
Les multinationales encaissaient toute la hausse.
L'État ghanéen ? Rien.

[BEAT 3a - LE FAIT 14.7s]
En janvier deux mille vingt-six, l'or dépasse cinq mille dollars l'once pour la première fois de l'histoire.
Le Ghana propose des royalties progressives : de cinq pour cent à douze pour cent selon le cours.

[BEAT 3b - LA PRESSION 14.0s]
Les États-Unis, le Royaume-Uni, la Chine, le Canada et l'Australie écrivent une lettre officielle au gouvernement ghanéen.
Le message : n'allez pas plus loin. Cette loi menace nos investissements.
Le Ghana a signé quand même.

[BEAT 4 - LE TWIST 29.5s]
Et le Ghana n'est pas un cas isolé.
Depuis deux ans, plusieurs pays africains reprennent le contrôle de leur sous-sol.
Le Mali a saisi trois tonnes d'or à Barrick Mining — quatre cent trente millions de dollars de règlement.
Le Burkina Faso a revu son code minier.
Le Niger a nationalisé sa seule mine industrielle.
Quatre pays. Un même signal.

[BEAT 5 - VERDICT 10s]
L'Afrique commence à changer les règles de son propre sous-sol.
Discrètement. Sans que personne n'en parle.

[CTA 4s]
Si tu veux des histoires que les médias ne racontent pas — abonne-toi.

SOURCES ACTUELLEMENT AFFICHÉES DANS LA VIDÉO (à valider) :
- Mali : "Bloomberg, nov. 2025" sur badge "$430M saisis à Barrick"
- Burkina Faso : "Loi 016-2024/ALT, juillet 2024" sur badge "Code minier révisé"
- Niger : "Mine Somaïr (uranium) — Décret 2024" sur badge "100% nationalisé"
"""

PROMPT = f"""Tu es un fact-checker rigoureux pour un documentaire vidéo data-journalism. Vérifie chaque affirmation factuelle du script suivant en cherchant des sources institutionnelles primaires (lois officielles, communiqués d'entreprise, rapports d'organisations internationales, presse de référence avec article daté).

{SCRIPT_OR_AFRICAIN}

Pour CHAQUE affirmation factuelle (chiffres, dates, lois, noms d'entreprises, montants, comparaisons quantitatives, événements), produis un tableau structuré avec :

1. **Affirmation** — citation exacte du script
2. **Verdict** — ✅ CONFIRMÉ / ⚠️ PARTIELLEMENT VRAI (à nuancer) / ❌ FAUX
3. **Source primaire** — URL + nom de l'institution/média + date
4. **Notes** — précisions, nuances, ou correction proposée

Affirmations à vérifier en priorité :
- "Le prix de l'or vient de battre tous les records" — Vrai ? À quelle date exactement le record a-t-il été battu ? Quel niveau ?
- "Six gouvernements se sont levés contre le Ghana" — Lesquels exactement ? Sources ?
- "Depuis deux mille dix, le Ghana touchait cinq pour cent de royalties" — Le taux était-il vraiment 5% fixe depuis 2010 ?
- "En janvier deux mille vingt-six, l'or dépasse cinq mille dollars l'once" — Cours réel atteint en janv. 2026 ?
- "Royalties progressives de cinq pour cent à douze pour cent" — Le Ghana a-t-il vraiment proposé/signé une telle loi ? Avec quel barème exact ? Quel statut (proposé / voté / signé) ?
- "USA, UK, Chine, Canada, Australie ont écrit une lettre officielle" — Cette lettre existe-t-elle ? Quels signataires exacts ? Date ?
- "Mali a saisi trois tonnes d'or à Barrick Mining — 430M$ de règlement" — Confirmer chiffre exact, date, source primaire (communiqué Barrick ou Mali)
- "Burkina Faso a revu son code minier" — Loi 016-2024/ALT confirmée ? Date d'adoption / d'entrée en vigueur ?
- "Niger a nationalisé sa SEULE mine industrielle" — Le Niger n'a-t-il vraiment qu'une seule mine industrielle ? Somaïr (uranium) a-t-elle bien été nationalisée à 100% ? Quand ?

Conclus avec :
- **Récap des affirmations à problème** (si certaines sont fausses ou trop floues)
- **Sources institutionnelles à afficher** (suggestions précises, format court pour overlay vidéo)
- **Score de confiance global du script** sur 10
"""


def main():
    body = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": PROMPT}
        ],
        "max_tokens": 3000,
        "temperature": 0.2,
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://claude.ai",
        "X-Title": "OrAfricain Fact-Check"
    }

    print(f"Lancement {MODEL} (Deep Research peut prendre 30-90s)...")
    t0 = time.time()
    r = requests.post(URL, headers=headers, json=body, timeout=300)
    elapsed = time.time() - t0

    if r.status_code != 200:
        print(f"ERREUR {r.status_code}: {r.text[:600]}")
        sys.exit(1)

    data = r.json()
    text = data["choices"][0]["message"]["content"]
    usage = data.get("usage", {})
    cost_input = usage.get("prompt_tokens", 0) * 2.0 / 1_000_000
    cost_output = usage.get("completion_tokens", 0) * 8.0 / 1_000_000
    cost_total = cost_input + cost_output

    print(f"\n{'='*80}")
    print(f"PERPLEXITY SONAR DEEP RESEARCH — Or Africain Fact-Check")
    print(f"Time: {elapsed:.1f}s | Tokens in/out: {usage.get('prompt_tokens')}/{usage.get('completion_tokens')} | Cost: ${cost_total:.4f}")
    print(f"{'='*80}\n")
    print(text)

    # Citations (Perplexity returns them in 'citations' field at top level of choice or message)
    citations = data["choices"][0].get("citations") or data["choices"][0]["message"].get("citations") or []
    if citations:
        print(f"\n{'='*80}\nCITATIONS:\n{'='*80}")
        for i, c in enumerate(citations, 1):
            print(f"  [{i}] {c}")

    out_path = "memory/episodes/money-legends/or-africain-fact-check-perplexity.md"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Or Africain — Fact-Check Perplexity Sonar Deep Research\n\n")
        f.write(f"Date : 2026-05-07\n")
        f.write(f"Modèle : {MODEL}\n")
        f.write(f"Tokens : in={usage.get('prompt_tokens')} out={usage.get('completion_tokens')} | Coût : ${cost_total:.4f}\n")
        f.write(f"Time : {elapsed:.1f}s\n\n")
        f.write("---\n\n")
        f.write(text)
        if citations:
            f.write("\n\n---\n\n## Citations\n\n")
            for i, c in enumerate(citations, 1):
                f.write(f"{i}. {c}\n")
    print(f"\nRapport sauvegardé : {out_path}")


if __name__ == "__main__":
    main()
