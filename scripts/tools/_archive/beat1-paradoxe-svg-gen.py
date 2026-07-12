"""
beat1-paradoxe-svg-gen.py — genere le SVG frame-driven de l'insert Beat1Paradoxe (Acte 3 Soudan) via
GPT-5.6 Sol et/ou Gemini 3.1 Pro, en UN appel chacun. Adapte de llm-gen-svg.py (meme mecanique d'appel),
brief dedie au CONCEPT A valide avec Aziz (2026-07-10, apres rejet du concept B jugé pas assez narratif) :
"UN PUITS SANS FOND" — jauge qui fuit + 2 sources qui rechargent + 3e filet mystere qui repart a rebours.

Usage :
    python3 scripts/tools/beat1-paradoxe-svg-gen.py --provider sol    --out /tmp/beat1-svg-sol.json
    python3 scripts/tools/beat1-paradoxe-svg-gen.py --provider gemini --out /tmp/beat1-svg-gemini.json
"""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
SOL_MODEL = "openai/gpt-5.6-sol"

PROMPT = r"""
Tu es un generateur de SCENE SVG frame-driven pour un documentaire geopolitique premium sur la guerre au
Soudan (registre "parchemin/encre" : fond ocre/sable #F2E5C8, contours d'encre #3A2A18, or #D4A574 pour
l'argent, rouge brique #B14B3C pour la faction RSF, bleu ardoise #3E6E9E pour la faction SAF, gris metal
#8A8F94 pour un flux "exterieur, non identifie").

CONTEXTE NARRATIF : cet insert dure ~17.4 secondes (523 frames a 30fps) et illustre un PARADOXE avant que
la carte ne prenne le relais. Texte narre (voix off, deja enregistree, sert de reference de timing) :
  "Cette guerre engloutit des centaines de millions de dollars chaque mois. [Pourtant, f134] Aucun des
  deux camps ne manque jamais d'argent pour continuer a se battre. [Quelqu'un paie cette guerre, f302]
  Il faut suivre l'argent [f367] pour comprendre qui — et pourquoi. [le Darfour, f523]"

CONCEPT VALIDE (ne pas en devier — priorite absolue : la scene doit se comprendre SANS légende, par
l'enchainement CAUSE -> EFFET des gestes visuels, pas juste par de jolies formes statiques) :
"UN PUITS SANS FOND". Une JAUGE VERTICALE (rectangle a contour encre, ~120px large, ~500px haut, centree
BAS-CENTRE de l'ecran, ~x=960 y=580-1080) affiche un niveau d'or qui remplit son interieur.

PHASE A (f0-134, "engloutit... chaque mois") : la jauge apparait DEJA pleine a 85%, puis son niveau
DESCEND EN CONTINU et VISIBLEMENT (comme un sablier qui fuit) — quelques particules dorees s'echappent
par le bas et tombent hors du cadre. Ca doit lire sans ambiguite "ca coute cher, ca part vite".

PHASE B (f134-302, "aucun des deux camps ne manque jamais d'argent") : DEUX CERCLES apparaissent de
chaque cote de la jauge (a gauche contour rouge RSF + petit losange faction R dedans ; a droite contour
bleu SAF + losange S). De CHAQUE cercle part un FILET/TUYAU qui COULE VISIBLEMENT vers le HAUT de la
jauge (particules ou tirets qui avancent le long du trait, direction claire vers la jauge) — la jauge,
au lieu de continuer a se vider, SE STABILISE (elle respire legerement mais ne descend plus). L'effet
doit etre lisible comme "2 sources rechargent ce qui fuit, en meme temps que ca fuit".

PHASE C (f302-367, "Quelqu'un paie cette guerre") : un TROISIEME filet, GRIS METAL, arrive depuis le
BORD DE L'ECRAN (hors-champ, cote droit ou depuis le coin, PAS un cercle plein comme RSF/SAF — ce filet
n'a pas de source visible, juste un trait pointille "flou/non identifie" qui vient de l'exterieur du
cadre) et vient AUSSI nourrir la jauge par le haut. Le niveau de la jauge monte legerement au-dela de
son niveau stable — preuve visuelle qu'il y a une 3e source, plus grosse, qu'on ne voit pas encore.

PHASE D (f367-523, "il faut suivre l'argent pour comprendre qui et pourquoi... le Darfour") : le filet
gris mystere S'INVERSE — il cesse d'arriver et REPART dans l'autre sens, retournant vers le bord de
l'ecran d'ou il venait (meme trait, mais le mouvement des particules/tirets le long du chemin change de
sens — litteralement "on remonte la source a rebours"). Puis toute la scene doit pouvoir se fondre (fade
final f483-523, opacite qui baisse vers ~0.35 en fin, PAS totalement a 0 pour que la derniere frame reste
lisible isolement si besoin).

CONTRAINTES TECHNIQUES STRICTES (non negociables) :
- Le SVG sera rendu dans React/Remotion, viewBox "0 0 1920 1080". Utilise UNIQUEMENT des elements SVG
  (path, circle, rect, line, polygon, ellipse, g, text) avec des attributs STATIQUES OU dependant d'une
  variable `f` (le numero de frame courant, 30fps) via des expressions JS inline `{expression}`.
- ZERO CSS animation, ZERO @keyframes, ZERO setTimeout, ZERO requestAnimationFrame, ZERO Math.random
  (tout jitter doit etre deterministe via Math.sin(seed) si besoin). EVITE les IIFE `(() => {...})()`
  repetees plusieurs fois de façon identique dans le JSX — si une formule de phase est reutilisee
  plusieurs fois, dis-le clairement dans tes notes plutot que de la dupliquer telle quelle partout.
- AUCUN personnage humain, AUCUNE silhouette articulee — INTERDIT, deja teste et rejete sur ce projet.
  Uniquement des formes geometriques abstraites.
- PRIORITE : la LISIBILITE DU MOUVEMENT (qui coule, dans quel sens, vers quoi) prime sur la richesse
  decorative. Chaque flux (fuite / recharge / mystere / inversion) doit etre visuellement DIRECTIONNEL
  et EVIDENT — pas juste une ligne statique qui change de couleur.

REPONDS EN JSON STRICT (et rien d'autre), de la forme :
{
  "scene": "<g>...tout le SVG de la scene, un seul groupe englobant...</g>",
  "notes": "remarques sur les choix d'animation, timing, ou ecarts au brief si justifies"
}
"""


def gen_gemini(out: Path):
    from google import genai
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
    client = genai.Client(api_key=key)
    print(f"Generating Beat1Paradoxe (concept A) SVG with {GEMINI_MODEL}...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=[PROMPT])
    text = resp.candidates[0].content.parts[0].text
    out.write_text(text, encoding="utf-8")
    print(f"Saved raw: {out} ({len(text)} chars)")


def gen_sol(out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"model": SOL_MODEL, "messages": [{"role": "user", "content": PROMPT}]}
    print(f"Generating Beat1Paradoxe (concept A) SVG with {SOL_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"[sol] Saved raw: {out} ({len(text)} chars)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "sol"])
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.provider == "gemini":
        gen_gemini(out)
    else:
        gen_sol(out)


if __name__ == "__main__":
    main()
