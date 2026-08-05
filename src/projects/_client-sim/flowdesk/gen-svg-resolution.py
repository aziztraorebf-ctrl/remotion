"""
Genere le panneau "RESOLUTION - BOUCLE FERMEE ET CONFIRMATION" (4e et dernier panneau du
storyboard abstrait Flowdesk) via GPT-5.6 Sol et Kimi K3, meme brief exigeant que bascule/mecanisme.
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
Tu generes un SVG statique complet et valide (viewBox 960x1080), destine a etre le 4e et DERNIER
panneau d'un storyboard 4 panneaux pour une video explicative produit premium (client fictif
"Flowdesk", logiciel qui centralise les demandes internes d'entreprise). Palette STRICTE, aucune
autre couleur : #0B1F3A (bleu fonce, fond), #FFFFFF (blanc), #FF6B1A (orange accent).

SUJET : "RESOLUTION — BOUCLE FERMEE ET CONFIRMATION". Ce panneau vient APRES le mecanisme
d'aiguillage (une des sorties, un paquet/point qui voyageait vers une destination, arrive enfin a
bon port). Ce panneau final doit montrer l'ABOUTISSEMENT : un seul element (le paquet arrive) qui
percute/rejoint un symbole de VALIDATION/CONFIRMATION nette (ex: une forme qui evoque une coche, un
cercle qui se complete, un sceau qui se ferme) dans une explosion de lumiere orange. Sensation
recherchee : soulagement, cloture, certitude -- c'est la fin du parcours narratif du storyboard
(chaos -> bascule -> mecanisme -> RESOLUTION), donc le panneau le plus SEREIN et le plus SIMPLE
des 4, pas le plus charge.

EXIGENCES DE QUALITE (les 3 protos precedents de ce meme brief exigeant -- chaos, bascule,
mecanisme -- ont ete juges tres reussis, meme niveau vise ici, MAIS ce panneau doit etre plus EPURE
que les precedents, coherent avec l'idee de resolution/calme) :
1. Composition avec plus d'espace negatif que les panneaux precedents -- la resolution n'est pas
   dense, elle est CLAIRE. Un seul trajet net qui arrive, pas un flux multiple.
2. Le point d'impact final doit avoir un halo lumineux orange fort (feDropShadow ou radialGradient),
   net et satisfaisant, comme une explosion de lumiere contenue.
3. Le trajet qui mene au point d'impact peut avoir une legere traine (comme les panneaux
   precedents) mais reste simple : UNE seule trajectoire claire, pas un eventail.
4. Le symbole de confirmation lui-meme doit etre GEOMETRIQUEMENT ABSTRAIT (pas une icone de
   checkmark UI classique) -- pense cercle qui se ferme, anneau qui se complete, sceau qui
   s'illumine -- coherent avec le registre abstrait des 3 panneaux precedents.

CONTRAINTES STRICTES : aucune icone d'application, aucun personnage/silhouette humaine, aucune
interface utilisateur, aucun texte a l'ecran sauf le label du panneau en haut a gauche
"RESOLUTION — BOUCLE FERMEE ET CONFIRMATION" en petit texte blanc.

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
    gen_gpt_sol(OUT_DIR / "proto-gpt56sol-resolution.svg")
    gen_kimi_k3(OUT_DIR / "proto-kimik3-resolution.svg")
