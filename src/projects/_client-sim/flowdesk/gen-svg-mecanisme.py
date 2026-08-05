"""
Genere le panneau "MECANISME - AIGUILLAGE AUTOMATIQUE" (3e panneau du storyboard abstrait
Flowdesk) via GPT-5.6 Sol et Kimi K3 (mode exigeant, meme brief que le panneau bascule).
Ad-hoc, scope = ce chantier uniquement.
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
Tu generes un SVG statique complet et valide (viewBox 960x1080), destine a etre le 3e panneau
d'un storyboard 4 panneaux pour une video explicative produit premium (client fictif "Flowdesk",
logiciel qui centralise les demandes internes d'entreprise). Palette STRICTE, aucune autre
couleur : #0B1F3A (bleu fonce, fond), #FFFFFF (blanc), #FF6B1A (orange accent).

SUJET : "MECANISME — AIGUILLAGE AUTOMATIQUE". Ce panneau vient APRES un panneau "BASCULE" ou
un flux de fragments/particules converge vers un point central (vortex/entonnoir). Ce panneau-ci
doit montrer la SUITE logique : le flux, une fois capture au point central, se RE-DIVISE et
s'AIGUILLE automatiquement vers plusieurs destinations distinctes et nettes (3 a 5 sorties), comme
un systeme de routage/tri automatique. Sensation recherchee : ordre, precision, automatisation --
l'oppose du chaos du premier panneau.

EXIGENCES DE QUALITE (les protos precedents de ce meme brief exigeant ont ete juges tres reussis
-- vise ce niveau) :
1. REMPLIS le cadre 960x1080 -- composition dense, pas une vignette isolee entouree de vide.
2. PROFONDEUR reelle : plusieurs plans distincts, variations de taille/opacite qui suggerent la
   distance, flou gaussien leger sur les elements lointains.
3. MOUVEMENT SUGGERE : traines directionnelles, degrades qui s'etirent dans le sens du flux depuis
   le point central vers chaque sortie.
4. Le point de depart (a gauche ou au centre, coherent avec un flux qui arrive de la bascule
   precedente) peut avoir un halo lumineux orange. Les 3 a 5 rails/sorties doivent etre nets,
   distincts, avec une intention de DESTINATION claire (pas juste des lignes qui s'eparpillent --
   chaque sortie doit se lire comme MENANT quelque part de precis, avec un point d'arrivee marque).
5. Densite reelle sur les rails (particules/paquets qui voyagent le long de chaque trajectoire).

CONTRAINTES STRICTES : aucune icone d'application, aucun personnage/silhouette humaine, aucune
interface utilisateur, aucun texte a l'ecran sauf le label du panneau en haut a gauche
"MECANISME — AIGUILLAGE AUTOMATIQUE" en petit texte blanc.

REPONDS UNIQUEMENT avec le code SVG complet et valide (balise <svg> a <svg/>), sans commentaire,
sans explication autour, sans bloc markdown ```svg -- juste le XML brut du SVG pret a etre ecrit
dans un fichier .svg.
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
        # effort=high demande par Aziz -- OpenRouter refuse reasoning.max_tokens + effort ensemble.
        "reasoning": {"effort": "high"},
        "max_tokens": 20000,
    }
    print(f"Generating SVG with {KIMI_K3_MODEL} (reasoning effort=high) via OpenRouter...")
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
    gen_gpt_sol(OUT_DIR / "proto-gpt56sol-mecanisme.svg")
    gen_kimi_k3(OUT_DIR / "proto-kimik3-mecanisme.svg")
