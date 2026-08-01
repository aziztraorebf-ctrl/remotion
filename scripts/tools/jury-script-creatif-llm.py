#!/usr/bin/env python3
"""
Jury LLM 4 modeles pour la CRITIQUE CREATIVE d'un script video (hook, rythme, technicite, ton),
PAS la conformite doctrine (pour ca, voir scripts/tools/jury-script-llm.py -- clarte/densite/flux).
Kimi k2.5 (Moonshot) + Gemini 3.1 Pro (Google genai) + GPT-5.6 Sol (OpenRouter) + Grok 4.20 (xAI).

Chaque modele recoit le SCRIPT COMPLET et repond a un brief structure : technicite/decrochage,
force du hook, dynamisme/retention, equilibre vulgarisation/serieux, ton humain (reference chaines
connues pour leur ecriture), note /10, ET une reecriture complete s'il devait tout refaire en
gardant les grandes lignes -- DANS LE MEME APPEL (pas un 2e passage separe).

A LANCER APRES le script V1 (etape 8 de RECHERCHE-PRESCRIPT-UNIFIEE.md), AVANT le fact-check
formulations (etape 9) -- fact-checker un texte qu'on va reecrire suite au jury est du travail perdu.
Fusion du meilleur des 4 verdicts = MANUELLE par Aziz (choix de gout), pas automatique.

Usage :
    python3 scripts/tools/jury-script-creatif-llm.py <script.md> --contexte "..." [--out chemin.md]

Exemple :
    python3 scripts/tools/jury-script-creatif-llm.py memory/episodes/.../SCRIPT-V1.md \
        --contexte "Mid-form Souverain, 8-10min, sujet gazoduc AAGP vs TSGP, angle rivalite deux tracés"

Doctrines associees : memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md (etape 8),
memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md (16 regles ecriture orale),
memory/doctrines/CHARTE-EDITORIALE-SOUVERAIN.md (analyste, pas militant ni neutre --
filtrer les verdicts "neutralite" du jury a travers CETTE charte, pas une neutralite generique).
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

BRIEF_TEMPLATE = """Tu es un consultant editorial expert en scripts YouTube de vulgarisation
geopolitique/economique, format documentaire anime long (5-10 min), destines a une audience
generaliste curieuse mais PAS experte du sujet.

## LA CHAINE

"Kora et Cartes" -- vulgarisation geopolitique et economique sur l'Afrique, format cartographique
anime (SVG/D3, pas de presentateur humain a l'ecran, voix-off narree). Audience cible : 25-50 ans,
curieux eduques + diaspora eduquee. Cette audience REJETTE le clickbait criard MAIS decroche vite
si le script est trop technique/dense/universitaire. Positionnement : ANALYSTE -- "ni militant ni
neutre" (charte). Du ton, du style, une tension narrative sont ATTENDUS ; seul un jugement moral
non sourcE sur un acteur (mechant designe OU heros implicite) est a eviter.

## CONTEXTE DE CETTE VIDEO

{contexte}

## LE SCRIPT COMPLET (brouillon, PAS encore fact-checke sur les formulations -- juge le FOND
narratif/rythme/accroche, pas les chiffres eux-memes)

---
{script_text}
---

## TA MISSION -- reponds a CHAQUE question, dans l'ordre, de facon concrete et actionnable

1. **NIVEAU DE TECHNICITE / OU CA DECROCHE** : a quel point ce script est-il lourd ou technique pour
   une audience YouTube generaliste ? Quelqu'un qui ne connait RIEN au sujet pourrait-il suivre sans
   se perdre ? Identifie PRECISEMENT les phrases ou passages ou un spectateur moyen risque de
   decrocher (trop de noms/sigles d'un coup, trop de chiffres, trop de mecanique institutionnelle).

2. **LA PREMIERE MINUTE / LE HOOK** : le hook accroche-t-il vraiment, ou sonne-t-il clinique/
   universitaire/plat ? Sois severe. Propose concretement ce qui manque (tension, image concrete,
   incarnation) pour qu'il attrape des les 10 premieres secondes.

3. **DYNAMISME ET RETENTION** : le rythme est-il soutenu sur l'ensemble du script, ou y a-t-il des
   passages qui s'essoufflent (trop de faits d'affilee, pas assez de respiration/relance) ? Identifie
   les zones plates.

4. **EQUILIBRE VULGARISATION / SERIEUX / TON HUMAIN** : le script sonne-t-il comme un humain qui
   raconte quelque chose, ou comme un rapport lu a voix haute ? Comment font les chaines YouTube
   CONNUES POUR LEUR ECRITURE (pas forcement journalistiques) pour expliquer des concepts complexes
   sans perdre le spectateur ? Cite des techniques precises (pas juste des noms de chaines) qu'on
   pourrait reprendre ici.

5. **NOTE GLOBALE SUR 10** avec une justification en 3-4 lignes (force principale, faiblesse
   principale).

6. **REECRITURE COMPLETE** : si tu devais reecrire ce script en entier, EN GARDANT LES GRANDES LIGNES
   (meme structure en actes, memes faits, meme angle), comment le ferais-tu ? Produis ta VERSION
   REECRITE COMPLETE, acte par acte, avec le meme niveau de detail factuel que l'original (ne retire
   ni n'invente aucun fait -- reformule/reordonne/re-rythme uniquement). Priorise surtout un hook qui
   accroche vraiment et une texture plus humaine/orale.

Reponds en francais, de facon structuree (titres clairs pour chaque point 1-6)."""


def call_kimi(brief):
    if not MOONSHOT_API_KEY:
        return "ERROR: MOONSHOT_API_KEY missing"
    payload = {
        "model": "kimi-k2.5",
        "messages": [{"role": "user", "content": brief}],
        "max_tokens": 12000,
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
        "model": "openai/gpt-5.6-sol",
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
    parser.add_argument("--contexte", default="", help="Format, duree, sujet, angle de la video")
    parser.add_argument("--out", default=None, help="Chemin de sortie (defaut: <fichier>-jury-creatif.md)")
    args = parser.parse_args()

    script_text = Path(args.fichier).read_text(encoding="utf-8")
    brief = BRIEF_TEMPLATE.format(contexte=args.contexte, script_text=script_text)

    print(f"Script lu : {args.fichier} ({len(script_text)} caracteres)")
    print("Appel des 4 modeles en parallele (Kimi, Gemini, GPT-5.6 Sol, Grok)...\n")

    results = {}
    with ThreadPoolExecutor(max_workers=4) as ex:
        futures = {
            ex.submit(call_kimi, brief): "kimi-k2.5",
            ex.submit(call_gemini, brief): "gemini-3.1-pro-preview",
            ex.submit(call_gpt, brief): "gpt-5.6-sol",
            ex.submit(call_grok, brief): "grok-4.20-reasoning",
        }
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                results[name] = fut.result()
            except Exception as e:
                results[name] = f"EXCEPTION: {e}"
            print(f"  [OK] {name}")

    out_path = args.out or (str(Path(args.fichier).with_suffix("")) + "-jury-creatif.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Jury LLM creatif (4 modeles) - {Path(args.fichier).name}\n\n")
        f.write(f"> Contexte : {args.contexte}\n")
        for name, verdict in results.items():
            f.write(f"\n\n---\n## {name}\n\n{verdict}\n")

    print(f"\n--- Sauvegarde complete dans {out_path} ---")


if __name__ == "__main__":
    main()
