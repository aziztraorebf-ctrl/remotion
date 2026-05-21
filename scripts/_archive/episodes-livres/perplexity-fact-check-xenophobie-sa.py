#!/usr/bin/env python3
"""
Fact-check Perplexity Sonar Deep Research pour exploration sujet "Xenophobie Afrique du Sud 2026".
Phase pre-production — valide les faits + cherche angles narratifs avant decision de production.
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

PROMPT = """Tu es un fact-checker rigoureux pour un documentaire video panafricain serieux (serie "Souverain", style data-journalism). Sujet : la vague de violences xenophobes en Afrique du Sud avril-mai 2026 contre les ressortissants africains, dans son contexte historique long (1994-2026).

Verifie les faits suivants en cherchant des sources institutionnelles primaires (rapports HRW, ONU, Commission africaine, Afrobarometer, statistiques officielles SA, presse de reference avec article date).

Pour CHAQUE affirmation, produis un tableau structure :
1. **Affirmation** — citation exacte
2. **Verdict** — CONFIRME / PARTIELLEMENT VRAI / FAUX / IMPRECIS
3. **Source primaire** — URL + nom institution/media + date
4. **Notes** — precisions, nuances, ou correction proposee

AFFIRMATIONS A VERIFIER EN PRIORITE :

A. Donnees historiques cumulatives
- "644 morts cumules depuis 1994 dans les violences xenophobes en Afrique du Sud" — chiffre exact ? source ? periode couverte ?
- "123 760 deplacements depuis 1994" — confirmer ?
- "952 incidents documentes depuis 1994" — confirmer ?
- "62+ morts lors des emeutes de mai 2008" — chiffre exact final ? source ?
- "7 morts dans les attaques d'avril 2015" — confirmer ?
- "Operation Dudula creee en 2021 a Soweto" — date exacte de fondation ? fondateurs ?

B. Vague avril-mai 2026
- "Plus de 130 ressortissants nigerians demandent leur rapatriement debut mai 2026" — confirmer chiffre + date ?
- "Amamiro Chidiebere Emmanuel mort le 25 avril 2026 a Port Elizabeth des suites de coups par des soldats SANDF" — confirmer ? source officielle ?
- "Nnaemeka Matthew Andrew retrouve mort a la morgue de Pretoria apres arrestation 19 avril 2026" — confirmer ?
- "Marches anti-immigrants a Johannesburg, Pretoria, Cape Town entre 27-29 avril 2026 menees par Jacinta Ngobese-Zuma et Zandile Dabula" — verifier identites + appartenance politique ?
- "Appel a un national shutdown le 4 mai 2026" — confirme ?
- "Nigeria, Ghana, Mozambique ont formellement proteste aupres de Pretoria" — sources officielles ? dates ?
- "Le Ghana a saisi la Commission de l'UA" — date ? communique officiel ?
- "Le Nigeria envisage des sanctions contre l'Afrique du Sud" — source ? niveau gouvernemental ou simple declaration ?

C. Contexte structurel
- "Taux de chomage 33% en Afrique du Sud" — chiffre Stats SA recent ? si different, donner valeur exacte 2025-2026 ?
- "L'Afrique du Sud a l'un des taux d'inegalite les plus eleves au monde (Gini)" — coefficient exact ? rang mondial ?
- "Population immigree estimee en Afrique du Sud" — chiffre OIM ou Stats SA ?

D. Contexte historique panafricain
- "L'ANC a ete forme/soutenu en exil dans plusieurs pays africains pendant l'apartheid" — lesquels precisement ? Tanzanie, Zambie, Mozambique, Angola confirmes ?
- "Les Mozambicains ont accueilli les militants ANC" — source ? FRELIMO ?
- "Mandela a ete forme militairement en Algerie et au Ghana" — confirmer dates et contexte ?

E. Cadre juridique
- "La Charte africaine des droits de l'homme et des peuples interdit ces traitements" — articles precis ?
- "Position de l'Union africaine sur la xenophobie SA" — declarations recentes ?

QUESTIONS D'ANGLE NARRATIF (au-dela du fact-check pur) :
1. Quel est le narratif que les chercheurs sud-africains eux-memes (academiques, ONG, journalistes) portent sur ce sujet ? Differe-t-il du narratif panafricain externe ?
2. Y a-t-il des donnees recentes (Afrobarometer 2024-2026) sur l'opinion publique sud-africaine vis-a-vis des immigres africains ?
3. Quels sont les principaux points de desaccord factuels entre les narratifs (pro-Dudula, gouvernement SA, ONG, pays d'origine des victimes) ?
4. Quel angle un documentaire serieux n'a PAS encore traite sur ce sujet ?

CONCLUSION ATTENDUE :
- **Recap des affirmations a problemes** (faux ou trop floues)
- **Top 5 sources institutionnelles primaires** a citer
- **3 angles narratifs originaux suggeres** par les sources
- **Score de confiance global** des affirmations testees sur 10
- **Pieges factuels identifies** (chiffres souvent mal cites, raccourcis historiques, etc.)
"""


def main():
    body = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": PROMPT}
        ],
        "max_tokens": 8000,
        "temperature": 0.2,
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://claude.ai",
        "X-Title": "Souverain XenophobieSA Fact-Check"
    }

    print(f"Lancement {MODEL} (Deep Research, attendre 30-120s)...")
    t0 = time.time()
    r = requests.post(URL, headers=headers, json=body, timeout=400)
    elapsed = time.time() - t0

    if r.status_code != 200:
        print(f"ERREUR {r.status_code}: {r.text[:800]}")
        sys.exit(1)

    data = r.json()
    text = data["choices"][0]["message"]["content"]
    usage = data.get("usage", {})
    cost_input = usage.get("prompt_tokens", 0) * 2.0 / 1_000_000
    cost_output = usage.get("completion_tokens", 0) * 8.0 / 1_000_000
    cost_total = cost_input + cost_output

    print(f"\n{'='*80}")
    print(f"PERPLEXITY SONAR DEEP RESEARCH — Xenophobie SA Fact-Check")
    print(f"Time: {elapsed:.1f}s | Tokens in/out: {usage.get('prompt_tokens')}/{usage.get('completion_tokens')} | Cost: ${cost_total:.4f}")
    print(f"{'='*80}\n")
    print(text)

    citations = data["choices"][0].get("citations") or data["choices"][0]["message"].get("citations") or []
    if citations:
        print(f"\n{'='*80}\nCITATIONS:\n{'='*80}")
        for i, c in enumerate(citations, 1):
            print(f"  [{i}] {c}")

    out_path = "memory/episodes/souverain/xenophobie-sa-fact-check-perplexity.md"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Xenophobie Afrique du Sud — Fact-Check Perplexity Sonar Deep Research\n\n")
        f.write(f"Date : 2026-05-07\n")
        f.write(f"Modele : {MODEL}\n")
        f.write(f"Tokens : in={usage.get('prompt_tokens')} out={usage.get('completion_tokens')} | Cout : ${cost_total:.4f}\n")
        f.write(f"Time : {elapsed:.1f}s\n\n")
        f.write("---\n\n")
        f.write(text)
        if citations:
            f.write("\n\n---\n\n## Citations\n\n")
            for i, c in enumerate(citations, 1):
                f.write(f"{i}. {c}\n")
    print(f"\nRapport sauvegarde : {out_path}")


if __name__ == "__main__":
    main()
