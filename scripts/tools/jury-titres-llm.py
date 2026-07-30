#!/usr/bin/env python3
"""
Jury LLM 4 modeles pour TITRES YouTube (generation + classement).
Kimi k2.5 (Moonshot) + Gemini 3.1 Pro (Google genai) + GPT-5.5 (OpenRouter) + Grok 4.20 (xAI).

Chaque modele recoit le SCRIPT COMPLET + la charte editoriale + les regles de titrage maison,
et rend 10 titres CLASSES du plus fort au plus faible, avec justification par titre.
Aucun modele ne voit les propositions des autres (avis independants -> convergence = signal fort,
cf memory/feedbacks/feedback_convergence-spontanee-2-modeles-signal-fort.md).

Usage :
    python3 scripts/tools/jury-titres-llm.py <script.md> --contexte "texte" [--out chemin.md]

Exemple :
    python3 scripts/tools/jury-titres-llm.py out/episodes/senegal-petrole-gaz/_audio-v3/SCRIPT-V3-senegal.md \
        --contexte "Video longue 8min16, chaine Kora et Cartes. Thumbnail deja fige : baril enchaine, \
LED rouge 132 pourcent, carte du Senegal. Le titre ne doit PAS repeter ce que le thumbnail montre deja."

Pourquoi ce script existe : generer ET juger soi-meme un titre = juge et partie. Le jury casse ce biais.
Grok est inclus volontairement pour sa tendance a sortir du consensus des autres modeles (demande Aziz
2026-07-30) -- un modele qui diverge est precisement ce qui manque quand les 3 autres convergent vers le sage.
Doctrines associees : memory/feedback_doctrine-titres-youtube-kora-cartes.md (formule fait+consequence+cause),
memory/templates/regles-titres.md (5 regles mesurees), memory/doctrines/SUJET-PRIME-SUR-PRODUCTION.md
(sujet MATERIEL > sujet META).
"""

import os
import sys
import socket
import argparse
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

# Fix connu du projet : IPv6 mort dans le sandbox bloque les SDK Python (cf memory/tools/yt-dlp.md).
_orig_getaddrinfo = socket.getaddrinfo
socket.getaddrinfo = lambda *a, **k: [ai for ai in _orig_getaddrinfo(*a, **k) if ai[0] == socket.AF_INET]

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

MOONSHOT_API_KEY = os.getenv("MOONSHOT_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
XAI_API_KEY = os.getenv("XAI_API_KEY")

BRIEF_TEMPLATE = """Tu es un expert du titrage YouTube francophone, specialiste des chaines de
vulgarisation geopolitique/economique haut de gamme (references du creneau : Caspian Report, PolyMatter,
RealLifeLore). Ta mission : proposer les MEILLEURS titres possibles pour la video decrite ci-dessous.

## LA CHAINE

"Kora et Cartes" -- vulgarisation geopolitique et economique sur l'Afrique, format cartographique anime.
Audience cible : 25-50 ans, curieux eduques + diaspora eduquee. Cette audience REJETTE ACTIVEMENT le
clickbait criard (visages hurlants, fleches rouges, majuscules integrales, "CE QU'ON VOUS CACHE").
Positionnement editorial : ANALYSTE, pas militant. On explique des mecanismes, on ne designe pas de
coupable. Notre seul avantage defendable est la JUSTESSE : donnees > emotion.

## CONTEXTE DE CETTE VIDEO

{contexte}

## LE SCRIPT COMPLET DE LA VIDEO

---
{script_text}
---

## LES REGLES DE TITRAGE DE LA MAISON (mesurees, non negociables)

1. FORMULE CANONIQUE : fait verifiable + consequence inattendue + cause surprenante. L'emerveillement
   vient du FAIT lui-meme, jamais d'un jugement politique. Titre de reference maison :
   "Il a traverse le desert. L'economie mondiale s'est effondree." -- les trois temps y sont.

2. ZERO DATE dans le titre (les titres avec une annee recoivent 53% moins de vues medianes : la date
   vieillit le titre et l'algorithme le distribue moins avec le temps).

3. CIBLE 50 CARACTERES, MAXIMUM 55. La longueur suit une courbe monotone : plus court = mieux distribue
   et mieux affiche sur mobile. 60-70 caracteres = deja -59% de performance.

4. CHIFFRE PRECIS EN UNITES QUOTIDIENNES si tu en utilises un : "9 centimes sur l'euro" pas "9,2%".
   "8 millions de dollars par jour" pas "un afflux massif". Un chiffre precis surperforme de 23% dans
   les niches educatives -- mais il doit etre physiquement comprehensible.

5. TENSION BINAIRE COURTE : deux faits opposes dans le meme titre battent la formulation descriptive.
   Les deux faits en tension doivent tenir dans les 48 premiers caracteres.

6. DECLARATIF > QUESTION. Les questions rhetoriques performent moins bien et sonnent militantes.

7. FORMULES MORTES A PROSCRIRE (-34% de CTR entre 2023 et 2025, signalent du contenu conspirationniste
   qui tue la credibilite educative) : "Ce qu'ils cachent", "La vraie raison de X", "Ce qu'on ne te dit
   pas", "Personne n'en parle", "Ils ne veulent pas que tu saches", titres en MAJUSCULES INTEGRALES.

8. SUJET MATERIEL > SUJET META (regle mesuree sur une chaine concurrente : ecart x157 de vues a
   production strictement identique). "L'argent qui part" bat "la statistique qui manque". Un titre qui
   porte sur une absence, une lacune, une donnee manquante ou une lecon abstraite est a REFORMULER sur
   l'objet materiel en jeu, ou a ecarter. Prefere le concret physique a la comparaison conceptuelle.

9. TEST TOKYO : quelqu'un a Tokyo, Paris ou Montreal qui ne s'interesse pas specialement a l'Afrique
   a-t-il une raison de cliquer ? ATTENTION -- ce test ne veut PAS dire retirer le nom du pays. Le nom
   du pays et le mot-cle principal (petrole, or, dette...) doivent rester dans le titre, de preference
   tot, parce que ce sont eux qui rendent la video CHERCHABLE. Le Test Tokyo demande d'ajouter un enjeu
   universel, pas de supprimer l'ancrage local.

10. NEUTRALITE : ne jamais prendre un camp, ne jamais utiliser "humilie", "pille", "trahi". Pas de
    confrontation implicite (souverainiste/anti, pro-Europe/anti). Le fait suffit.

## EXIGENCE DE FIDELITE FACTUELLE (CRITIQUE)

Le titre doit etre RIGOUREUSEMENT exact par rapport au script ci-dessus. Un titre qui exagere, qui
affirme une causalite que le script nuance, ou qui annonce un evenement qui n'a pas eu lieu tel quel,
est DISQUALIFIE meme s'il est accrocheur. Relis le script avant de proposer : verifie que chaque
affirmation de ton titre y est litteralement soutenue. Signale toi-meme si un titre frole la limite.

## CE QUE TU DOIS PRODUIRE

Propose exactement 10 TITRES, CLASSES du plus fort (n1) au plus faible (n10) selon TON jugement de ce
qui va reellement generer des clics QUALIFIES sans trahir la charte analyste.

Pour CHAQUE titre, donne sur une ligne compacte :
- le titre exact, entre guillemets
- son nombre de caracteres
- en une phrase : pourquoi il fonctionne (quel ressort psychologique il actionne)
- en une phrase : sa faiblesse ou son risque principal (chaque titre en a un -- sois honnete)

Cherche la VARIETE entre tes 10 propositions : ne livre pas 10 variantes de la meme idee. Explore
plusieurs angles (le paradoxe, le chiffre, l'enjeu humain, la mecanique, l'echelle mondiale, le
suspense). Au moins 2 de tes titres doivent oser sortir du registre le plus sage, sans jamais tomber
dans le clickbait ni dans l'inexactitude.

Termine par une section "RECOMMANDATION FINALE" : ton titre n1, et en 3 lignes maximum, pourquoi c'est
celui-la qu'il faut publier plutot que le n2.

Reponds en francais."""


def call_kimi(brief):
    if not MOONSHOT_API_KEY:
        return "ERROR: MOONSHOT_API_KEY missing"
    payload = {
        "model": "kimi-k2.5",
        "messages": [{"role": "user", "content": brief}],
        "max_tokens": 8000,
    }
    try:
        r = requests.post(
            "https://api.moonshot.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {MOONSHOT_API_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=300,
        )
        if r.status_code != 200:
            return f"ERROR Kimi {r.status_code}: {r.text[:500]}"
        msg = r.json()["choices"][0]["message"]
        return msg.get("content") or msg.get("reasoning_content") or ""
    except Exception as e:
        return f"EXCEPTION Kimi: {e}"


def call_gemini(brief):
    if not GEMINI_API_KEY:
        return "ERROR: GEMINI_API_KEY missing"
    try:
        import google.genai as genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-3.1-pro-preview",
            contents=[brief],
        )
        return response.text
    except Exception as e:
        return f"ERROR Gemini: {e}"


def call_gpt(brief):
    if not OPENROUTER_API_KEY:
        return "ERROR: OPENROUTER_API_KEY missing"
    payload = {
        "model": "openai/gpt-5.5",
        "messages": [{"role": "user", "content": brief}],
    }
    try:
        r = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=300,
        )
        if r.status_code != 200:
            return f"ERROR GPT {r.status_code}: {r.text[:500]}"
        return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"EXCEPTION GPT: {e}"


def call_grok(brief):
    """Grok 4.20 reasoning via API xAI directe (endpoint OpenAI-compatible)."""
    if not XAI_API_KEY:
        return "ERROR: XAI_API_KEY missing"
    payload = {
        "model": "grok-4.20-reasoning",
        "messages": [{"role": "user", "content": brief}],
    }
    try:
        r = requests.post(
            "https://api.x.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {XAI_API_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=300,
        )
        if r.status_code != 200:
            return f"ERROR Grok {r.status_code}: {r.text[:500]}"
        msg = r.json()["choices"][0]["message"]
        return msg.get("content") or msg.get("reasoning_content") or ""
    except Exception as e:
        return f"EXCEPTION Grok: {e}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("fichier", help="Chemin du fichier .md contenant le script complet")
    parser.add_argument("--contexte", default="", help="Contexte (format, duree, thumbnail deja fige...)")
    parser.add_argument("--out", default=None, help="Chemin de sortie (defaut: <fichier>-jury-titres.md)")
    args = parser.parse_args()

    script_text = Path(args.fichier).read_text(encoding="utf-8")
    brief = BRIEF_TEMPLATE.format(contexte=args.contexte, script_text=script_text)

    print(f"Script lu : {args.fichier} ({len(script_text)} caracteres)")
    print("Appel des 4 modeles en parallele (Kimi, Gemini, GPT, Grok)...\n")

    results = {}
    with ThreadPoolExecutor(max_workers=4) as ex:
        futures = {
            ex.submit(call_kimi, brief): "kimi-k2.5",
            ex.submit(call_gemini, brief): "gemini-3.1-pro-preview",
            ex.submit(call_gpt, brief): "gpt-5.5",
            ex.submit(call_grok, brief): "grok-4.20-reasoning",
        }
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                results[name] = fut.result()
            except Exception as e:
                results[name] = f"EXCEPTION: {e}"
            print(f"  [OK] {name}")

    out_path = args.out or (str(Path(args.fichier).with_suffix("")) + "-jury-titres.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Jury LLM titres (4 modeles) - {Path(args.fichier).name}\n\n")
        f.write(f"> Contexte : {args.contexte}\n")
        for name, verdict in results.items():
            f.write(f"\n\n---\n## {name}\n\n{verdict}\n")

    for name, verdict in results.items():
        print(f"\n\n{'='*80}\n{name}\n{'='*80}\n")
        print(verdict)

    print(f"\n\n--- Sauvegarde complete dans {out_path} ---")


if __name__ == "__main__":
    main()
