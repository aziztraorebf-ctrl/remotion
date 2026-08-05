"""
Genere le meme brief SVG (chaos->convergence Flowdesk, mode exigeant) via GPT-5.6 Sol et Kimi K3,
pour comparer a Fable 5 v2 (proto-fable5-v2-max.svg). Ad-hoc, scope = ce chantier uniquement.
"""
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[4]
load_dotenv(ROOT / ".env")

OUT_DIR = Path(__file__).resolve().parent

GPT_SOL_MODEL = "openai/gpt-5.6-sol"
KIMI_K3_MODEL = "moonshotai/kimi-k3"

PROMPT = r"""
Tu generes un SVG statique complet et valide (viewBox 1920x1080), destine a etre rendu dans une
video explicative produit premium (client fictif "Flowdesk", logiciel qui centralise les demandes
internes d'entreprise). Palette STRICTE, aucune autre couleur : #0B1F3A (bleu fonce, fond), #FFFFFF
(blanc), #FF6B1A (orange accent).

SUJET : deux elements cote a cote dans le meme fichier.
- MOITIE GAUCHE : "le chaos de demandes dispersees" -- des formes geometriques abstraites (PAS
  d'icones d'app, PAS d'enveloppe/bulle de chat/telephone) qui evoquent la dispersion, l'absence de
  direction commune, des signaux erratiques qui partent dans tous les sens.
- MOITIE DROITE : "la convergence ordonnee" -- les memes types de formes geometriques, mais
  desormais alignees et orientees vers un flux unique qui converge vers un point/hub central,
  avec une sensation de routage/aiguillage automatique (plusieurs sorties nettes possibles apres
  le hub).

EXIGENCES DE QUALITE (un premier essai plus timide a deja ete juge insuffisant -- ne pas repeter ces
erreurs) :
1. REMPLIS le cadre 1920x1080 -- composition cinematographique dense, pas une vignette isolee
   entouree de vide. Vise un taux de remplissage visuel d'au moins 50% de chaque moitie.
2. PROFONDEUR reelle : plusieurs plans distincts (formes grandes/nettes au premier plan, formes
   petites/attenuees en opacite en arriere-plan), variations de taille et d'opacite qui suggerent la
   distance. Un flou gaussien leger (feGaussianBlur, stdDeviation croissant avec l'eloignement) est
   bienvenu pour les plans lointains.
3. MOUVEMENT SUGGERE dans le fige : traines directionnelles (effet de filet photo -- un degrade qui
   s'etire dans le sens du deplacement implicite), formes etirees selon leur vitesse implicite
   (plus une forme "va vite", plus elle est allongee dans sa direction de mouvement).
4. DENSITE reelle : plusieurs dizaines d'elements par moitie (pas une dizaine) -- le chaos doit
   vraiment ressembler a un chaos dense et charge, la convergence doit vraiment ressembler a un
   flux dense et puissant qui accelere en approchant du hub central.
5. Le hub de convergence (moitie droite) peut avoir un halo lumineux orange (feDropShadow ou
   radialGradient), avec 3 a 5 sorties nettes en eventail apres le hub (le routage automatique vers
   plusieurs destinations).

CONTRAINTES STRICTES : aucune icone d'application, aucun personnage/silhouette humaine, aucune
interface utilisateur, aucun texte a l'ecran. Uniquement de la geometrie abstraite (polygones,
losanges, traits, degrades) avec une intention de mouvement et de profondeur clairement lisible.

REPONDS UNIQUEMENT avec le code SVG complet et valide (balise <svg> a <svg/>), sans commentaire, sans
explication autour, sans bloc markdown ```svg -- juste le XML brut du SVG pret a etre ecrit dans un
fichier .svg.
"""


def _extract_svg(text: str) -> str:
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            if "<svg" in part:
                text = part
                if text.strip().startswith("svg"):
                    text = text.strip()[3:]
                break
    start = text.find("<svg")
    end = text.rfind("</svg>")
    if start == -1 or end == -1:
        return text.strip()
    return text[start : end + len("</svg>")]


def gen_gpt_sol(out: Path):
    import requests

    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing")
        sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": GPT_SOL_MODEL,
        "messages": [{"role": "user", "content": PROMPT}],
    }
    print(f"Generating SVG with {GPT_SOL_MODEL} via OpenRouter...")
    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=600,
    )
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    svg = _extract_svg(text)
    out.write_text(svg, encoding="utf-8")
    print(f"[gpt-5.6-sol] Saved: {out} ({len(svg)} chars)")


def gen_kimi_k3(out: Path):
    import requests

    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing")
        sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": KIMI_K3_MODEL,
        "messages": [{"role": "user", "content": PROMPT}],
        "reasoning": {"max_tokens": 2000},
        "max_tokens": 16000,
    }
    print(f"Generating SVG with {KIMI_K3_MODEL} via OpenRouter (reasoning bounded)...")
    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=900,
    )
    r.raise_for_status()
    data = r.json()
    text = data["choices"][0]["message"]["content"]
    if not text:
        print(f"ERROR: empty content. Full response: {data}")
        sys.exit(1)
    svg = _extract_svg(text)
    out.write_text(svg, encoding="utf-8")
    usage = data.get("usage", {})
    print(f"[kimi-k3] Saved: {out} ({len(svg)} chars) usage={usage}")


if __name__ == "__main__":
    gen_gpt_sol(OUT_DIR / "proto-gpt56sol-v2-max.svg")
    gen_kimi_k3(OUT_DIR / "proto-kimik3-v2-max.svg")
