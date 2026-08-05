"""
Teste si Kimi K3 / GPT-5.6 Sol savent REPRODUIRE en SVG le panneau "BASCULE" (2e panneau,
vortex de convergence) du storyboard-v1-gemini.png, qui a ete juge tres reussi. Ad-hoc,
scope = ce chantier uniquement. Kimi K3 lance avec reasoning.effort=high en plus de la
borne max_tokens habituelle (demande explicite Aziz : pousser l'effort, pas juste la borne).
"""
import base64
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[4]
load_dotenv(ROOT / ".env")

OUT_DIR = Path(__file__).resolve().parent
REF_IMAGE = OUT_DIR / "storyboard-v1-gemini.png"

GPT_SOL_MODEL = "openai/gpt-5.6-sol"
KIMI_K3_MODEL = "moonshotai/kimi-k3"

PROMPT = r"""
L'image jointe est un storyboard abstrait en 4 panneaux pour une video produit "Flowdesk"
(ETAT INITIAL / BASCULE / MECANISME / RESOLUTION). Ce storyboard a deja ete juge tres reussi
visuellement -- ta tache est de le REPRODUIRE fidelement, pas de reinterpreter.

Regarde ATTENTIVEMENT le 2e panneau (en haut a droite, "BASCULE — CONVERGENCE ET CAPTURE") :
des fragments geometriques blancs epars qui sont aspires vers un entonnoir/vortex en spirale,
avec des anneaux concentriques blancs qui se resserrent vers un point de capture au centre-droit.

TACHE : reproduis fidelement ce panneau en SVG (viewBox 960x1080 -- ratio du panneau seul,
palette stricte #0B1F3A bleu fonce fond / #FFFFFF blanc pour les fragments et anneaux / touches
d'orange #FF6B1A si tu en vois dans l'original). Reproduis la DENSITE de fragments, la structure
en spirale/entonnoir de l'effet de vortex, et les anneaux concentriques qui se resserrent.

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


def _image_data_url() -> str:
    data = REF_IMAGE.read_bytes()
    b64 = base64.b64encode(data).decode()
    return f"data:image/png;base64,{b64}"


def gen_gpt_sol(out: Path):
    import requests

    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing")
        sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": GPT_SOL_MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT},
                    {"type": "image_url", "image_url": {"url": _image_data_url()}},
                ],
            }
        ],
    }
    print(f"Generating SVG with {GPT_SOL_MODEL} (vision) via OpenRouter...")
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
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": PROMPT},
                    {"type": "image_url", "image_url": {"url": _image_data_url()}},
                ],
            }
        ],
        # OpenRouter n'accepte QUE l'un des deux (400 sinon) : effort=high demande par Aziz,
        # remplace la borne max_tokens habituelle (memory/tools/kimi-k3-reasoning-borne.md).
        "reasoning": {"effort": "high"},
        "max_tokens": 20000,
    }
    print(f"Generating SVG with {KIMI_K3_MODEL} (vision, reasoning effort=high, bounded) via OpenRouter...")
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
    if not REF_IMAGE.exists():
        print(f"ERROR: reference image not found: {REF_IMAGE}")
        sys.exit(1)
    gen_gpt_sol(OUT_DIR / "proto-gpt56sol-reproduce-bascule.svg")
    gen_kimi_k3(OUT_DIR / "proto-kimik3-reproduce-bascule.svg")
