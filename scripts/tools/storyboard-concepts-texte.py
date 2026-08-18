#!/usr/bin/env python3
"""
PHASE 1 du storyboard en 2 temps : la CONCEPTION, en TEXTE, par N modeles en parallele.

Pourquoi ce script existe (decouvert 2026-08-17, idee d'Aziz a partir d'un "echec") :
Gemini a repondu EN TEXTE a une demande de storyboard image -- et son texte etait excellent.
Constat : CONCEVOIR et DESSINER sont deux competences differentes, et on les demandait au MEME
appel. Le modele d'image depensait sa capacite a ecrire du texte DANS l'image (titres, analyses,
defense du concept) au lieu de dessiner -- d'ou des vignettes minuscules, du texte corrompu
("Lee routes croisees" au lieu de "Les routes croisees") et des concepts coupes hors cadre.

Le gain principal n'est PAS la qualite : c'est que les modeles qui NE SAVENT PAS dessiner
deviennent eligibles. Kimi (la meilleure vision artistique chez nous) et Grok (instinct
"ce qui accroche") etaient exclus de nos storyboards pour une raison purement technique.

FLUX COMPLET (ne pas sauter d'etape) :
  1. CE SCRIPT -> N modeles TEXTE proposent des concepts + la description CASE PAR CASE de celui
     qu'ils defendent, prete a etre dessinee.
  2. CHOIX HUMAIN (Aziz tranche, Claude donne son avis) -- quel concept merite d'etre dessine.
     ⛔ Ce n'est PAS forcement celui que le modele defend.
  3. PHASE 2 -> la description du concept retenu part a UN modele image (Gemini 3.1 Flash Image ou
     GPT), qui ne fait plus QUE dessiner : 4 cases, format horizontal, zero analyse a ecrire.
     ⛔ UNE planche par appel, pas un appel par case (teste : le probleme venait de la charge de
     TEXTE, pas du nombre de cases -- 4 cases sans texte sont parfaitement lisibles).

Modeles (⛔ verrouilles par CLAUDE.md -- ne JAMAIS en substituer un autre) :
  kimi   -> kimi-k2.5 (Moonshot)                 vision artistique
  grok   -> grok-4.20-reasoning (xAI)            instinct retention/accroche
  gemini -> gemini-3.1-pro-preview (Google)      raisonnement long
  gpt    -> openai/gpt-5.5 (OpenRouter)          texte+vision

⚠️ Grok : le laisser faire ce qu'il fait de mieux, sans l'orienter vers le provocateur ou le
"differenciant a tout prix" (consigne Aziz). Le brief est IDENTIQUE pour tous -- aucun modele ne
recoit de consigne de personnalite. C'est la meme regle que pour nos jurys de script.

Usage :
    python3 scripts/tools/storyboard-concepts-texte.py --prompt-file <brief.txt> \
        [--models kimi,grok] [--out <sortie.md>] [--ref-note "..."]

Exemple reel (Gazoduc Acte 3 Segment C) :
    python3 scripts/tools/storyboard-concepts-texte.py \
        --prompt-file memory/episodes/souverain/gazoduc-aagp-tsgp/PROMPT-storyboard-segmentC-v1.txt \
        --models kimi,grok \
        --out memory/episodes/souverain/gazoduc-aagp-tsgp/concepts-segmentC-kimi-grok.md

Doctrine : memory/doctrines/STORYBOARD-MAPBOX.md (4 leviers de cadrage d'un brief -- ne jamais
ecrire les concepts soi-meme, montrer le materiau reel, exiger LE geste unique par panneau,
contraindre le materiau jamais l'ambition).
"""

import os
import sys
import socket
import argparse
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

# Fix connu du projet : IPv6 mort dans le sandbox bloque les SDK Python (cf memory/tools/gemini.md).
# Sans ca, les appels partent puis pendent indefiniment -- ~40 min perdues avant diagnostic en juillet.
_orig_getaddrinfo = socket.getaddrinfo
socket.getaddrinfo = lambda *a, **k: [ai for ai in _orig_getaddrinfo(*a, **k) if ai[0] == socket.AF_INET]

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

MOONSHOT_API_KEY = os.getenv("MOONSHOT_API_KEY")
XAI_API_KEY = os.getenv("XAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Bloc ajoute au brief commun : ce que la phase 1 doit produire EN PLUS des concepts, pour que la
# phase 2 (dessin) puisse partir directement de la description, sans reinterpretation par Claude.
SUFFIXE_PHASE1 = """

========================================================================
FORMAT DE TA REPONSE — lis ceci attentivement, c'est ce qui rend ta proposition utilisable
========================================================================

⛔ TU NE DESSINES RIEN. Tu ecris. Un autre modele dessinera ensuite, a partir de TA description.
C'est une bonne nouvelle pour toi : tu n'as aucune contrainte de rendu, seulement de conception.

Reponds en FRANCAIS, dans cet ordre exact :

## PARTIE 1 — TES CONCEPTS
Pour CHACUN de tes concepts (3 concepts distincts) :
- son NOM et l'idee centrale en UNE phrase
- le MOTEUR utilise (carte / data-viz geometrique / objet-metaphore / figure / matiere filmee / le raccord-montage)
- comment il exprime la SYMETRIE CROISEE sans aucun texte explicatif a l'ecran
- ce qui tient l'attention sur les 17,3 secondes, et OU le beat retomberait a plat si on ne faisait rien

## PARTIE 2 — CELUI QUE TU DEFENDS
Dis lequel des trois tu defends et POURQUOI, en argumentant contre les deux autres.

## PARTIE 3 — LA DESCRIPTION DESSINABLE (la partie la plus importante)
Pour le concept que tu defends UNIQUEMENT, ecris la description qui permettra a un modele d'image
de dessiner une planche de storyboard de **4 CASES, DISPOSEES HORIZONTALEMENT** (notre video est en
16:9 -- jamais de format vertical).

Pour CHACUNE des 4 cases, donne :
  - CASE N — TIMECODE (ex: "CASE 2 — 4,5 s")
  - CE QU'ON VOIT : description purement VISUELLE et CONCRETE. Ce qui est a l'ecran, ou, de quelle
    couleur, a quelle taille relative. Comme si tu decrivais une photographie a quelqu'un qui ne
    connait pas le sujet. Pas d'intention, pas de "cela symbolise" — seulement ce qui est visible.
  - LE GESTE UNIQUE : le seul mouvement/changement qui porte cette case, en 3-5 mots
    ("le territoire se remplit", "la camera recule", "la couleur se retire").

⚠️ Ecris la PARTIE 3 comme un cahier des charges pour le dessinateur, pas comme une analyse.
Elle doit pouvoir etre copiee-collee telle quelle vers le modele d'image et suffire a elle seule.
Elle ne doit contenir AUCUN texte a ecrire dans l'image, sauf les plaques de noms de pays.
"""


def _post(url, headers, payload, timeout=420):
    r = requests.post(url, headers=headers, json=payload, timeout=timeout)
    return r


def call_kimi(brief):
    if not MOONSHOT_API_KEY:
        return "ERROR: MOONSHOT_API_KEY missing"
    try:
        r = _post(
            "https://api.moonshot.ai/v1/chat/completions",
            {"Authorization": f"Bearer {MOONSHOT_API_KEY}", "Content-Type": "application/json"},
            {"model": "kimi-k2.5", "messages": [{"role": "user", "content": brief}], "max_tokens": 12000},
        )
        if r.status_code != 200:
            return f"ERROR Kimi {r.status_code}: {r.text[:500]}"
        msg = r.json()["choices"][0]["message"]
        # Kimi renvoie parfois sa reponse dans reasoning_content au lieu de content (bug connu,
        # cf memory/tools/kimi-review-bug.md) -- toujours tester les deux.
        return msg.get("content") or msg.get("reasoning_content") or "ERROR Kimi: reponse vide"
    except Exception as e:
        return f"EXCEPTION Kimi: {e}"


def call_grok(brief):
    """Grok 4.20 reasoning via API xAI directe (endpoint OpenAI-compatible)."""
    if not XAI_API_KEY:
        return "ERROR: XAI_API_KEY missing"
    try:
        r = _post(
            "https://api.x.ai/v1/chat/completions",
            {"Authorization": f"Bearer {XAI_API_KEY}", "Content-Type": "application/json"},
            {"model": "grok-4.20-reasoning", "messages": [{"role": "user", "content": brief}]},
        )
        if r.status_code != 200:
            return f"ERROR Grok {r.status_code}: {r.text[:500]}"
        msg = r.json()["choices"][0]["message"]
        return msg.get("content") or msg.get("reasoning_content") or "ERROR Grok: reponse vide"
    except Exception as e:
        return f"EXCEPTION Grok: {e}"


def call_gemini(brief):
    """Gemini 3.1 PRO (raisonnement), PAS le modele image -- ici on veut du texte."""
    if not GEMINI_API_KEY:
        return "ERROR: GEMINI_API_KEY missing"
    url = ("https://generativelanguage.googleapis.com/v1beta/models/"
           f"gemini-3.1-pro-preview:generateContent?key={GEMINI_API_KEY}")
    try:
        r = _post(url, {"Content-Type": "application/json"},
                  {"contents": [{"parts": [{"text": brief}]}]})
        if r.status_code != 200:
            return f"ERROR Gemini {r.status_code}: {r.text[:500]}"
        parts = r.json()["candidates"][0]["content"]["parts"]
        return "".join(p.get("text", "") for p in parts) or "ERROR Gemini: reponse vide"
    except Exception as e:
        return f"EXCEPTION Gemini: {e}"


def call_gpt(brief):
    """GPT-5.5 via OpenRouter (texte+vision)."""
    if not OPENROUTER_API_KEY:
        return "ERROR: OPENROUTER_API_KEY missing"
    try:
        r = _post(
            "https://openrouter.ai/api/v1/chat/completions",
            {"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
            {"model": "openai/gpt-5.5", "messages": [{"role": "user", "content": brief}]},
        )
        if r.status_code != 200:
            return f"ERROR GPT {r.status_code}: {r.text[:500]}"
        msg = r.json()["choices"][0]["message"]
        return msg.get("content") or msg.get("reasoning_content") or "ERROR GPT: reponse vide"
    except Exception as e:
        return f"EXCEPTION GPT: {e}"


MODELS = {
    "kimi": ("Kimi K2.5", call_kimi),
    "grok": ("Grok 4.20 reasoning", call_grok),
    "gemini": ("Gemini 3.1 Pro", call_gemini),
    "gpt": ("GPT-5.5", call_gpt),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--prompt-file", required=True, help="Brief de storyboard (texte)")
    parser.add_argument("--models", default="kimi,grok",
                        help="Modeles separes par virgule: kimi,grok,gemini,gpt (defaut: kimi,grok)")
    parser.add_argument("--out", default=None, help="Fichier .md de sortie")
    parser.add_argument("--ref-note", default="",
                        help="Description TEXTE des images de reference (ces modeles ne les voient pas)")
    args = parser.parse_args()

    brief_path = Path(args.prompt_file)
    if not brief_path.exists():
        print(f"ERREUR: brief introuvable: {brief_path}", file=sys.stderr)
        sys.exit(1)

    brief = brief_path.read_text(encoding="utf-8")
    if args.ref_note:
        brief += f"\n\n========================================================================\n"
        brief += "LES IMAGES DE REFERENCE, DECRITES EN MOTS (tu ne les vois pas)\n"
        brief += "========================================================================\n"
        brief += args.ref_note + "\n"
    brief += SUFFIXE_PHASE1

    wanted = [m.strip() for m in args.models.split(",") if m.strip()]
    unknown = [m for m in wanted if m not in MODELS]
    if unknown:
        print(f"ERREUR: modele(s) inconnu(s): {unknown}. Choix: {list(MODELS)}", file=sys.stderr)
        sys.exit(1)

    print(f"Brief: {brief_path}  ({len(brief)} caracteres)")
    print(f"Modeles: {', '.join(MODELS[m][0] for m in wanted)}\n")

    results = {}
    with ThreadPoolExecutor(max_workers=len(wanted)) as ex:
        futures = {ex.submit(MODELS[m][1], brief): m for m in wanted}
        for fut in as_completed(futures):
            key = futures[fut]
            label = MODELS[key][0]
            try:
                results[key] = fut.result()
            except Exception as e:
                results[key] = f"EXCEPTION {label}: {e}"
            head = results[key][:80].replace("\n", " ")
            status = "ERREUR" if results[key].startswith(("ERROR", "EXCEPTION")) else "OK"
            print(f"  [{status}] {label} — {len(results[key])} car. — {head}...")

    out_path = Path(args.out) if args.out else brief_path.with_name(brief_path.stem + "-CONCEPTS.md")
    lines = [
        "# Concepts de storyboard — PHASE 1 (texte, sans dessin)",
        "",
        f"> Brief source : `{brief_path}`",
        "> ⛔ Ces modeles n'ont RIEN dessine. La phase 2 (dessin) part de la PARTIE 3 du concept retenu.",
        "> Le choix du concept a dessiner est HUMAIN — ce n'est pas forcement celui que le modele defend.",
        "",
    ]
    for key in wanted:
        lines += [f"\n---\n\n## {MODELS[key][0]}\n", results.get(key, "(pas de reponse)"), ""]

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n-> {out_path}")


if __name__ == "__main__":
    main()
