#!/usr/bin/env python3
"""
Jury LLM 2 modeles pour la CRITIQUE CREATIVE d'un script SaaS explainer court (45-60s),
adapte de scripts/tools/jury-script-creatif-llm.py (brief documentaire geopolitique long-form)
au format publicitaire/produit court. Gemini 3.1 Pro + Grok 4.20 -- choix delibere (pas 4
modeles) : Grok pour la personnalite/le vivant, Gemini pour l'intuition editoriale, le ton
professionnel et la detection d'erreurs. Complementaires plutot que redondants pour ce test.

Contexte : test client-sim NorthShield (memory/client-sim-tests/noteshield/BRIEF-CLIENT.md),
2e test client-sim apres Flowdesk -- Aziz veut appliquer la meme methode jury que la refonte
script AES (V1->V4) mais calibree SaaS : show-dont-tell, dynamisme motion design, ton pro avec
personnalite vivante (reference Grok -- punchy, pas un explainer generique "genere par IA").

Usage :
    python3 scripts/tools/jury-script-saas-llm.py <script.md> --contexte "..." [--out chemin.md]
"""

import os
import sys
import socket
import argparse
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

_orig_getaddrinfo = socket.getaddrinfo
socket.getaddrinfo = lambda *a, **k: [ai for ai in _orig_getaddrinfo(*a, **k) if ai[0] == socket.AF_INET]

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
XAI_API_KEY = os.getenv("XAI_API_KEY")

BRIEF_TEMPLATE = """Tu es un consultant editorial expert en scripts de video explicative SaaS
(explainer video), format publicitaire court (45-60s), destines a un usage page d'accueil /
presentation commerciale / LinkedIn. Reference de qualite : les meilleurs studios d'explainer
video SaaS (type Fiverr Pro haut de gamme, ou les videos produit des meilleures startups B2B) --
PAS le style generique "voix off IA + stock icons" qu'on voit partout.

## CONTEXTE DE CETTE VIDEO

{contexte}

## LE SCRIPT COMPLET (brouillon V1, PAS encore fact-checke sur les formulations)

---
{script_text}
---

## TA MISSION -- reponds a CHAQUE question, dans l'ordre, de facon concrete et actionnable

1. **SHOW DON'T TELL** : ce script decrit-il des choses qu'on pourrait juste MONTRER
   visuellement au lieu de les dire ? Identifie chaque phrase qui pourrait etre remplacee par une
   image forte / une preuve visuelle plutot qu'une explication verbale. Un bon script SaaS laisse
   de l'ESPACE au visuel -- il n'a pas besoin de tout dire.

2. **DYNAMISME MOTION DESIGN** : le script est-il ecrit pour occuper l'espace et bouger, ou lu
   comme un texte statique ? Identifie les passages qui sonnent "explainer plat" (voix off qui
   decrit une liste) vs ceux qui appellent naturellement un geste visuel fort (transformation,
   contraste avant/apres, reveal).

3. **TON -- PROFESSIONNEL AVEC PERSONNALITE VIVANTE** : le ton est-il credible/haut-de-gamme tout
   en ayant une voix reconnaissable (punchy, direct, un peu de mordant a la Grok) plutot qu'un
   explainer generique et interchangeable ? Cite precisement les passages plats vs ceux qui ont
   deja de la personnalite, et propose comment injecter du caractere sans perdre le serieux
   attendu d'un produit de cybersecurite B2B.

4. **CLARTE DU MECANISME PRODUIT** : quelqu'un qui ne connait rien a la cybersecurite
   comprend-il en une ecoute ce que fait le produit et pourquoi c'est different des solutions
   traditionnelles ? Le contraste bas-risque/haut-risque (les 2 exemples chiffres) est-il assez
   clair et memorable ?

5. **RESPECT DES INTERDITS ANTI-CLICHE** (contexte : le client a explicitement banni hoodie,
   Matrix, cadenas geant comme metaphore centrale, bouclier qui bloque une attaque, pluie de 0/1)
   -- le script suggere-t-il involontairement l'un de ces cliches visuels par ses mots memes ?

6. **NOTE GLOBALE SUR 10** avec justification en 3-4 lignes (force principale, faiblesse
   principale).

7. **REECRITURE COMPLETE** : si tu devais reecrire ce script en entier, EN GARDANT LA MEME
   STRUCTURE (tension initiale -> pivot -> mecanisme -> preuve produit bas risque -> preuve
   produit haut risque -> close/marque) et les 2 exemples chiffres (Sarah/Toronto/18 et
   Sarah/Berlin/82), produis ta VERSION REECRITE COMPLETE. Priorise le show-dont-tell, le
   dynamisme, et une personnalite de ton affirmee sans perdre le professionnalisme attendu d'un
   produit de securite B2B.

Reponds en francais, de facon structuree (titres clairs pour chaque point 1-7)."""


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


def call_grok(brief):
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
    parser.add_argument("--out", default=None, help="Chemin de sortie (defaut: <fichier>-jury-saas.md)")
    args = parser.parse_args()

    script_text = Path(args.fichier).read_text(encoding="utf-8")
    brief = BRIEF_TEMPLATE.format(contexte=args.contexte, script_text=script_text)

    print(f"Script lu : {args.fichier} ({len(script_text)} caracteres)")
    print("Appel des 2 modeles en parallele (Gemini, Grok)...\n")

    results = {}
    with ThreadPoolExecutor(max_workers=2) as ex:
        futures = {
            ex.submit(call_gemini, brief): "gemini-3.1-pro-preview",
            ex.submit(call_grok, brief): "grok-4.20-reasoning",
        }
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                results[name] = fut.result()
            except Exception as e:
                results[name] = f"EXCEPTION: {e}"
            print(f"  [OK] {name}")

    out_path = args.out or (str(Path(args.fichier).with_suffix("")) + "-jury-saas.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Jury LLM creatif SaaS (4 modeles) - {Path(args.fichier).name}\n\n")
        f.write(f"> Contexte : {args.contexte}\n")
        for name, verdict in results.items():
            f.write(f"\n\n---\n## {name}\n\n{verdict}\n")

    print(f"\n--- Sauvegarde complete dans {out_path} ---")


if __name__ == "__main__":
    main()
