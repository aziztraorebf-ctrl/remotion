"""
beat1-paradoxe-svg-revise.py — REVISION du SVG Beat1Paradoxe (concept A, deja adopte) via GPT-5.6 Sol,
a partir du code EXISTANT (pas une regeneration de zero) + une liste precise de retouches demandees
par Aziz suite a un retour Gemini partiellement valide.

Usage :
    python3 scripts/tools/beat1-paradoxe-svg-revise.py --out /tmp/beat1-svg-solA-v2.json
"""
import argparse
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

SOL_MODEL = "openai/gpt-5.6-sol"

EXISTING_SCENE = json.load(open("/tmp/beat1-svg-solA.json"))["scene"]

PROMPT = f"""
Tu as deja genere le SVG frame-driven ci-dessous pour un insert Remotion (documentaire Soudan, registre
parchemin/encre). Il a ete valide comme BASE ADOPTEE (meilleur que l'alternative testee) mais Aziz demande
une REVISION CIBLEE, pas une regeneration de zero. Voici le code EXACT actuel :

```
{EXISTING_SCENE}
```

Contexte : viewBox 1920x1080, variable `f` = frame courante (30fps), 523 frames au total (17.4s).
Palette : fond #F2E5C8, encre #3A2A18, or #D4A574 (GOLD), rouge RSF #B14B3C, bleu SAF #3E6E9E, gris
mystere #8A8F94. Timing narratif : f0-134 "ca coute cher / fuite", f134-302 "2 camps rechargent",
f302-367 "3e source mystere", f367-523 "inversion + fondu de sortie".

RETOUCHES DEMANDEES (toutes CONFIRMEES pertinentes, applique-les TOUTES sans en ignorer) :

1. RECENTRER : la jauge est actuellement en bas-centre (y~560-1080), decalee du centre vertical de
   l'ecran (540). Repositionne l'ensemble de la composition (jauge + les 2 cercles R/S + le filet gris)
   pour qu'elle soit mieux centree verticalement dans le cadre 1080px de haut — garde les proportions et
   relations spatiales relatives entre les elements, deplace juste l'ensemble vers le haut d'environ
   80-120px pour une composition plus equilibree.

2. FUITE PLUS VISIBLE DES LE DEBUT : entre f0 et f30, le mouvement de baisse du niveau doit etre
   PERCEPTIBLE a l'oeil des les premieres frames (actuellement quasi imperceptible avant f30-40 a cause
   d'une interpolation lineaire trop lente sur 134 frames). Accelere legerement la chute initiale
   (courbe non-lineaire : plus rapide au debut f0-40, puis qui ralentit vers f100-134) pour que "ca
   engloutit" se lise DES le premier instant, pas seulement apres plusieurs secondes.

3. GRADUATIONS QUI S'ETEIGNENT : les petites lignes de graduation sur les cotes de la jauge (actuellement
   statiques a opacite fixe ~0.55) doivent s'ETEINDRE une par une du HAUT vers le BAS (opacity 1 -> 0.3)
   AU RYTHME EXACT ou le niveau du liquide descend en dessous de chaque graduation — quand le liquide
   passe sous une graduation, elle perd en opacite. Ca renforce visuellement "le niveau baisse vraiment".

4. DEGRADE DORE SUBTIL SUR LE LIQUIDE : remplace le fill uni actuel du rectangle de liquide (#D4A574) par
   un <linearGradient> vertical tres subtil (2-3 stops, du #D4A574 vers une teinte legerement plus foncee
   #B8935C ou plus claire #E0BC8A en haut) — matte, PAS brillant/glossy, juste assez pour suggerer une
   matiere precieuse plutot qu'un aplat plat.

5. GOUTTES DE FUITE EN FADE-OUT : les petites gouttes qui s'echappent par le bas de la jauge (deja
   presentes dans le code) doivent avoir leur OPACITY qui diminue progressivement (1 -> 0) au fur et a
   mesure qu'elles tombent/s'eloignent de la jauge, pour suggerer qu'elles "s'evaporent" — actuellement
   elles gardent une opacite fixe pendant leur chute.

6. PULSATIONS LE LONG DES TUYAUX R/S : sur les 2 traits qui relient les cercles R (rouge) et S (bleu) a
   la jauge (phase f134-302), ajoute un effet de "petits points lumineux qui voyagent le long du trait
   par intermittence" (façon transactions/pulsations electriques) — en PLUS des particules dorees deja
   presentes qui montrent le flux continu, quelque chose de plus ponctue/scintillant pour renforcer
   "reseau financier actif". Reste discret, ne remplace pas les particules existantes, ajoute une couche.

CONTRAINTES TECHNIQUES INCHANGEES (rappel) :
- ZERO CSS animation/keyframes/setTimeout/Math.random. Tout deterministe via Math.sin/modulo sur `f`.
- AUCUN personnage humain/silhouette articulee.
- ZERO IIFE `(() => {{...}})()` dupliquee identique plusieurs fois — si une formule est reutilisee,
  dis-le dans tes notes plutot que de la copier-coller partout (le code ci-dessus respecte deja cette
  regle, garde cette discipline).
- Le filet gris mystere (phase C/D, deja fonctionnel avec sa fleche qui s'inverse a f367) NE DOIT PAS
  etre modifie dans sa logique — seul le repositionnement global (retouche #1) doit l'affecter, comme
  le reste de la composition.

REPONDS EN JSON STRICT (et rien d'autre), de la forme :
{{
  "scene": "<g>...le SVG COMPLET revise, incluant toutes les retouches...</g>",
  "notes": "resume des changements appliques, un par ligne"
}}
"""


def gen_sol(out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"model": SOL_MODEL, "messages": [{"role": "user", "content": PROMPT}]}
    print(f"Revising Beat1Paradoxe SVG with {SOL_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"[sol] Saved raw: {out} ({len(text)} chars)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    gen_sol(out)


if __name__ == "__main__":
    main()
