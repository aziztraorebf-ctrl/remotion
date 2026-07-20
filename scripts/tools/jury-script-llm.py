#!/usr/bin/env python3
"""
Jury LLM 3 modeles pour script video (clarte + densite/flux fusionnes en 1 seul passage).
Kimi k2.5 (Moonshot direct) + Gemini 3.1 Pro (Google genai direct) + GPT-5.5 (OpenRouter).

Usage :
    python3 scripts/tools/jury-script-llm.py <fichier.md> <marqueur_debut> <marqueur_fin> [--contexte "texte"]

Exemple :
    python3 scripts/tools/jury-script-llm.py memory/projects/soudan-midform-ACTE5-SCRIPT.md \
        "## BEAT 1" "## GATE D'ECRITURE" \
        --contexte "Acte 5, verrou institutionnel UA/ONU/Quad + conclusion ouverte."

Fusionne les 2 briefs qui ont ete separes lors du Soudan Acte 4 (2026-07-10) : un 1er jury clarte
phrase-par-phrase avait valide un script qui restait dense/confus en lecture cumulative -- un 2e jury
dedie a la densite a du etre relance apres coup. Ce script fait les deux en un seul passage.
Doctrine associee : memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md (regle 6bis + gate point 5).
"""

import os
import sys
import json
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

BRIEF_TEMPLATE = """Tu es un jury d'expert en scriptwriting video documentaire (francais), format analytique
oral (voix off neutre analyste). {contexte}

Voici le script a evaluer :

---
{beats_text}
---

Evalue ce script sur ces 9 axes PRECIS, en donnant un VERDICT structure pour chacun. Les axes 1-4 testent
la CLARTE phrase par phrase ; les axes 5-9 testent la DENSITE CUMULATIVE et le FLUX NARRATIF de l'acte
ENTIER lu d'une traite -- ce sont deux familles de defauts DIFFERENTES, teste les deux explicitement,
meme si un script peut reussir la premiere famille et echouer sur la seconde.

=== FAMILLE A : CLARTE PHRASE PAR PHRASE ===

1. CLARTE ORALE : chaque phrase est-elle comprehensible a la premiere ecoute (pas de lecture) ? Repere les
   phrases trop denses, les listes de chiffres qui sonnent comme un tableau lu a voix haute plutot qu'une
   vraie phrase parlee, les fragments sans sujet-verbe (meme s'ils sont courts -- un fragment court reste
   telegraphique, ce n'est PAS du rythme syncope).

2. SHOW-DON'T-TELL : chaque affirmation a-t-elle un equivalent visuel concret decrit dans la partie CARTE/
   VISUEL, ou reste-t-elle une assertion "dans le vide" (dite mais pas montree) ?

3. COHERENCE FACTUELLE / NEUTRALITE : y a-t-il un biais implicite, une affirmation trop categorique compte
   tenu de l'incertitude documentee ? Le ton reste-t-il clinique, sans diabolisation d'un camp ?

4. RETENTION / RYTHME : le paradoxe est-il bien tenu en tension ? Y a-t-il des moments de "phrase coup de
   poing" (une phrase COMPLETE courte, pas un fragment) apres l'explication ? Le pont final fonctionne-t-il
   (boucle ouverte, pas refermee) ?

=== FAMILLE B : DENSITE CUMULATIVE ET FLUX NARRATIF (sur l'acte ENTIER, pas phrase par phrase) ===

5. CHARGE COGNITIVE CUMULATIVE : pour chaque phrase, compte combien de faits/noms/dates NOUVEAUX (jamais
   mentionnes avant dans l'acte) elle introduit. Un spectateur qui decouvre le sujet SANS connaissances
   prealables peut-il retenir tout ca en une seule ecoute ? Signale precisement les phrases qui empilent 3+
   elements factuels nouveaux d'un coup (ex: une date + un acteur + un lieu + une action + une consequence
   dans la meme phrase).

6. CONTINUITE DES REFERENCES : un acteur nomme garde-t-il TOUJOURS le meme nom du DEBUT a la FIN de l'acte,
   ou le script utilise-t-il des synonymes/variantes journalistiques qui obligent le spectateur a faire un
   lien mental supplementaire ? A l'oral (pas a l'ecrit ou on peut relire), chaque changement de designation
   est un risque de decrochage -- signale-les TOUS, meme les "petits", meme une seule occurrence isolee.

7. TEST "ET ALORS ?" STRICT ENTRE CHAQUE PHRASE (pas seulement entre beats) : pour CHAQUE paire de phrases
   consecutives dans le script ENTIER, le lien logique est-il evident sans effort, ou le spectateur doit-il
   deviner le rapport ?

8. ORDRE DES BEATS = RISQUE DE FAUSSE CAUSALITE IMPLICITE : le PLACEMENT d'un fait dans la sequence peut
   creer un lien logique qui n'existe pas, meme si chaque phrase est individuellement vraie et neutre. Pour
   CHAQUE paire de beats consecutifs : le fait qui suit est-il -- meme implicitement -- attribue au sujet du
   beat precedent, a tort ? Exemple type : un beat sur l'acteur A suivi directement d'un fait sur l'acteur B
   sans lien reel fait que le spectateur associe B a A par simple proximite narrative.

9. FLUX NARRATIF DE BOUT EN BOUT + TEST DOUBLE-LECTEUR : au-dela de chaque beat individuel, est-ce que
   l'ACTE ENTIER se lit comme UNE HISTOIRE qui avance et se construit, ou comme une SUCCESSION DE
   MINI-ANNONCES independantes ? Et separement : le script tient-il A LA FOIS pour un spectateur INITIE ET
   un spectateur LAMBDA, sans infantiliser le premier ni perdre le second ?

Pour chaque axe : cite les passages exacts problematiques (mots-pour-mots du script), explique precisement
POURQUOI c'est un probleme, et propose une reecriture concrete si possible.

Reponds en francais, structure par les 9 points (regroupes en 2 familles). Termine par :
- Un score de densite/flux subjectif sur 10 (10 = parfaitement digeste ET fluide pour un spectateur lambda)
- Un VERDICT GLOBAL : PRET / AJUSTEMENTS MINEURS / A RETRAVAILLER EN PROFONDEUR
- Les 3 corrections les PLUS PRIORITAIRES, tous axes confondus."""


def call_kimi(brief):
    if not MOONSHOT_API_KEY:
        return "ERROR: MOONSHOT_API_KEY missing"
    payload = {
        "model": "kimi-k2.5",
        "messages": [{"role": "user", "content": brief}],
        "max_tokens": 8000,
    }
    r = requests.post(
        "https://api.moonshot.ai/v1/chat/completions",
        headers={"Authorization": f"Bearer {MOONSHOT_API_KEY}", "Content-Type": "application/json"},
        json=payload, timeout=180,
    )
    if r.status_code != 200:
        return f"ERROR Kimi {r.status_code}: {r.text[:500]}"
    msg = r.json()["choices"][0]["message"]
    return msg.get("content") or msg.get("reasoning_content") or ""


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
    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
        json=payload, timeout=180,
    )
    if r.status_code != 200:
        return f"ERROR GPT {r.status_code}: {r.text[:500]}"
    return r.json()["choices"][0]["message"]["content"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("fichier", help="Chemin du fichier .md contenant le script")
    parser.add_argument("marqueur_debut", help="Ligne marquant le debut des beats (ex: '## BEAT 1')")
    parser.add_argument("marqueur_fin", help="Ligne marquant la fin des beats (ex: '## GATE')")
    parser.add_argument("--contexte", default="", help="Contexte editorial (sujet, chaine, positionnement)")
    parser.add_argument("--out", default=None, help="Chemin de sortie (defaut: <fichier>-jury-results.md)")
    args = parser.parse_args()

    script_text = Path(args.fichier).read_text(encoding="utf-8")
    start = script_text.index(args.marqueur_debut)
    end = script_text.index(args.marqueur_fin)
    beats_text = script_text[start:end].strip()

    brief = BRIEF_TEMPLATE.format(contexte=args.contexte, beats_text=beats_text)

    results = {}
    with ThreadPoolExecutor(max_workers=3) as ex:
        futures = {
            ex.submit(call_kimi, brief): "kimi-k2.5",
            ex.submit(call_gemini, brief): "gemini-3.1-pro-preview",
            ex.submit(call_gpt, brief): "gpt-5.5",
        }
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                results[name] = fut.result()
            except Exception as e:
                results[name] = f"EXCEPTION: {e}"

    out_path = args.out or (str(Path(args.fichier).with_suffix("")) + "-jury-results.md")
    with open(out_path, "w") as f:
        f.write(f"# Jury LLM 3 modeles (clarte + densite/flux fusionnes) - {Path(args.fichier).name}\n\n")
        for name, verdict in results.items():
            f.write(f"\n\n---\n## {name}\n\n{verdict}\n")

    for name, verdict in results.items():
        print(f"\n\n{'='*80}\n{name}\n{'='*80}\n")
        print(verdict)

    print(f"\n\n--- Sauvegarde complete dans {out_path} ---")


if __name__ == "__main__":
    main()
