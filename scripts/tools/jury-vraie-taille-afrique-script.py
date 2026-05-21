#!/usr/bin/env python3
"""
Jury LLM — "La vraie taille de l'Afrique" (script review).
Jury : GPT-4o + Gemini 3.1 Pro (OpenRouter) + Kimi K2.6 (Moonshot).
Pas d'images — review textuelle du script + storyboard beats.
Cout estime : ~$0.05-0.10
"""

import os, sys, json, time
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import openai
import requests

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

for line in (PROJECT_ROOT / ".env").read_text().splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, _, v = line.partition("=")
        os.environ.setdefault(k.strip(), v.strip())

OUT_PATH = PROJECT_ROOT / "out" / "_r-and-d" / "jury-vraie-taille-afrique-script.json"
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

CONTEXT = """CONTEXTE :
Short YouTube vertical (1080x1920), 60 secondes, serie "Souverain" (GeoAfrique).
Sujet : la vraie taille de l'Afrique vs la projection de Mercator.
Format : 100% Remotion + Mapbox. Pas de footage video, pas d'images generees. Uniquement code.
Audience cible : grand public africain + diaspora + curieux, 18-35 ans, mobile-first.
Ton : factuel, percutant, zero militantisme, laisse le spectateur conclure seul.

SCRIPT COMPLET (5 beats) :

Beat 1 — Hook (0-5s) :
"Voila l'Afrique. Telle que tu l'as toujours vue."
Visuel : carte Mercator standard, Afrique au centre, taille apparente normale.

Beat 2 — Retournement progressif (5-25s) :
"Les Etats-Unis rentrent dedans. La Chine aussi. L'Europe entiere. Et l'Inde."
Visuel : silhouettes pays qui glissent une a une dans le continent africain.

Beat 3 — Climax silencieux (25-38s) :
(Pas de VO — silence ou musique seule)
Visuel : toutes les silhouettes en place dans le continent. Chiffre a l'ecran : 30,3 millions km2.

Beat 4 — Explication Mercator (38-52s) :
"La carte de Mercator, concue en mil cinq cent soixante-neuf pour les navigateurs, exagere les terres aux poles. Le Groenland y parait aussi grand que l'Afrique — en realite il est quatorze fois plus petit. Chaque projection cartographique exagere differemment. C'est de la geometrie, pas de la geopolitique."
Visuel : comparaison cote a cote Mercator vs projection Equal Earth.

Beat 5 — Sortie (52-60s) :
"Trente virgule trois millions de kilometres carres. Maintenant tu sais."
Visuel : l'Afrique seule, plein ecran, projection vraie.

DUREES AUDIO MESUREES (ElevenLabs TTS) :
- Beat 1 VO : 3.7s (dans une fenetre de 5s)
- Beat 2 VO : 5.5s (dans une fenetre de 20s)
- Beat 3 : silence total (13s)
- Beat 4 VO : 22.8s (dans une fenetre de 14s) -> ATTENTION : trop long pour la fenetre
- Beat 5 VO : 5.4s (dans une fenetre de 8s)

NOTE SUR BEAT 4 : la VO de 22.8s depasse la fenetre prevue de 14s. C'est un probleme a resoudre.

TON ROLE :
Tu es directeur creatif senior. Repondre en francais. 5-8 lignes max par question. Sois precis et operationnel.
"""

QUESTIONS = [
    {
        "id": "Q1_RYTHME_GLOBAL",
        "question": """RYTHME GLOBAL — Le script est concu pour 60 secondes avec 5 beats.
Beat 4 (explication Mercator) dure 22.8s de VO pour une fenetre de 14s prevue.

QUESTIONS :
1. Faut-il couper le Beat 4 en deux beats separes (4a : Mercator deforme / 4b : Groenland comparaison) ?
2. Ou allonger le Short a 75-80s pour lui donner de l'espace ?
3. Ou couper du texte dans le Beat 4 — si oui, quelle phrase sacrifier ?

Critere : impact maximum sur mobile en 60s.""",
    },
    {
        "id": "Q2_SILENCE_BEAT3",
        "question": """BEAT 3 — SILENCE (13 secondes).
Le beat 3 est uniquement visuel : toutes les silhouettes pays dans l'Afrique + chiffre 30,3M km2 a l'ecran. Aucune VO. Silence ou musique seule.

QUESTIONS :
1. 13 secondes de silence pur est-ce trop long pour un Short mobile ? L'audience va-t-elle decoder ?
2. Faut-il ajouter une VO minimaliste (ex: juste "Trente virgule trois millions.") ou garder le silence ?
3. Quelle ambiance musicale conviendrait a ce moment ? (Genre, tempo, emotion)""",
    },
    {
        "id": "Q3_BEAT4_MERCATOR",
        "question": """BEAT 4 — EXPLICATION MERCATOR (le plus dense du script).
VO actuelle : "La carte de Mercator, concue en mil cinq cent soixante-neuf pour les navigateurs, exagere les terres aux poles. Le Groenland y parait aussi grand que l'Afrique — en realite il est quatorze fois plus petit. Chaque projection cartographique exagere differemment. C'est de la geometrie, pas de la geopolitique."

QUESTIONS :
1. Cette explication est-elle trop technique pour l'audience grand public du Short ? Ou est-ce le bon niveau ?
2. La derniere phrase "C'est de la geometrie, pas de la geopolitique." — trop explicite ? Ou necesssaire pour blinder contre l'interpretation militante ?
3. Propose une version alternative plus courte et plus percutante (max 2 phrases) si tu penses que la version actuelle est trop longue.""",
    },
    {
        "id": "Q4_VISUELS_SUGGESTIONS",
        "question": """VISUELS — Suggestions pour chaque beat (Remotion + Mapbox uniquement, pas de footage, pas d'IA generative).

Beat 1 : Mercator standard. Quelle premiere image arreterait le scroll ?
Beat 2 : Silhouettes pays qui se superposent. Dans quel ordre les faire apparaitre pour maximum d'impact ? (actuels : USA, Chine, Europe, Inde)
Beat 3 : Climax silencieux. Comment afficher le chiffre 30,3M km2 pour que ce soit memorisable ?
Beat 4 : Mercator vs Equal Earth cote a cote. Faut-il montrer le Groenland sur les deux projections pour visualiser la distorsion ?
Beat 5 : Afrique seule. Quelle couleur/traitement pour le continent dans cette scene finale ?""",
    },
    {
        "id": "Q5_HOOK_SORTIE",
        "question": """HOOK & SORTIE — Les deux moments les plus importants pour la retention.

HOOK actuel (Beat 1) : "Voila l'Afrique. Telle que tu l'as toujours vue."
SORTIE actuelle (Beat 5) : "Trente virgule trois millions de kilometres carres. Maintenant tu sais."

QUESTIONS :
1. Le hook est-il assez fort pour arreter le scroll dans les 3 premieres secondes ? Ou trop passif ?
2. La sortie "Maintenant tu sais." — satisfaisante comme closure ? Ou trop abrupte ?
3. Propose une version alternative du hook ou de la sortie si tu penses qu'on peut faire mieux. Garder le ton factuel, sans militantisme.""",
    },
]


def call_gpt4o(prompt: str) -> str:
    client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1200,
    )
    return response.choices[0].message.content


def call_gemini(prompt: str) -> str:
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://claude.ai",
        },
        json={
            "model": "google/gemini-3.1-pro-preview",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1200,
            "temperature": 0.3,
        },
        timeout=90,
    )
    data = response.json()
    if "choices" not in data:
        return f"ERROR: {data}"
    return data["choices"][0]["message"]["content"]


def call_kimi(prompt: str) -> str:
    response = requests.post(
        "https://api.moonshot.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.environ['MOONSHOT_API_KEY']}",
            "Content-Type": "application/json",
        },
        json={
            "model": "kimi-k2.6",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1200,
            "temperature": 1.0,
        },
        timeout=90,
    )
    data = response.json()
    if "choices" not in data:
        return f"ERROR: {data}"
    return data["choices"][0]["message"]["content"]


def query_juror(juror_name: str, q: dict) -> tuple[str, str, str]:
    full_prompt = CONTEXT + "\n\n=== QUESTION ===\n" + q["question"]
    try:
        if juror_name == "GPT-4o":
            text = call_gpt4o(full_prompt)
        elif juror_name == "Gemini-3.1-Pro":
            text = call_gemini(full_prompt)
        elif juror_name == "Kimi-K2.6":
            text = call_kimi(full_prompt)
        else:
            text = "UNKNOWN JUROR"
    except Exception as e:
        text = f"ERROR: {str(e)[:400]}"
    return (juror_name, q["id"], text)


def main():
    for key in ["OPENAI_API_KEY", "OPENROUTER_API_KEY", "MOONSHOT_API_KEY"]:
        if not os.environ.get(key):
            print(f"ERROR: {key} missing")
            sys.exit(1)

    jurors = ["GPT-4o", "Gemini-3.1-Pro", "Kimi-K2.6"]
    jobs = [(juror, q) for q in QUESTIONS for juror in jurors]

    print(f"Jury : {jurors}")
    print(f"Questions : {len(QUESTIONS)}")
    print(f"Total appels : {len(jobs)}")
    print()

    results = {}
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=9) as pool:
        futures = {pool.submit(query_juror, juror, q): (juror, q["id"]) for juror, q in jobs}
        done = 0
        for fut in as_completed(futures):
            juror, qid, text = fut.result()
            results.setdefault(qid, {})[juror] = text
            done += 1
            print(f"  [{done}/{len(jobs)}] {juror} — {qid} done")

    elapsed = time.time() - t0
    print(f"\nTermine en {elapsed:.1f}s")

    output = {
        "timestamp": datetime.now().isoformat(),
        "elapsed_seconds": elapsed,
        "questions": {
            q["id"]: {
                "question": q["question"],
                "responses": results.get(q["id"], {}),
            }
            for q in QUESTIONS
        },
    }
    OUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    print(f"Saved : {OUT_PATH}")

    print("\n" + "=" * 80)
    print("SYNTHESE JURY")
    print("=" * 80)
    for q in QUESTIONS:
        print(f"\n{'#' * 60}")
        print(f"# {q['id']}")
        print(f"{'#' * 60}")
        for juror in jurors:
            text = results.get(q["id"], {}).get(juror, "MISSING")
            print(f"\n--- {juror} ---")
            print(text)


if __name__ == "__main__":
    main()
