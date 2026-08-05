"""
Teste si Fable 5 / GPT-5.6 Sol / Kimi K3 savent REPRODUIRE la silhouette "personne/emotion"
du storyboard-v2-gpt.png (contour simple non-articule, remplissage plein, PAS de pose
anatomique realiste) quand on leur DONNE l'image en reference, au lieu de la decrire en texte.
Ad-hoc, scope = ce chantier uniquement.
"""
import base64
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[4]
load_dotenv(ROOT / ".env")

OUT_DIR = Path(__file__).resolve().parent
REF_IMAGE = OUT_DIR / "storyboard-v2-gpt.png"

GPT_SOL_MODEL = "openai/gpt-5.6-sol"
KIMI_K3_MODEL = "moonshotai/kimi-k3"

PROMPT = r"""
L'image jointe est un storyboard en 4 panneaux pour une video explicative produit ("Flowdesk").
Regarde ATTENTIVEMENT le PREMIER panneau (en haut a gauche, "ETAT INITIAL") : une silhouette
humaine assise a un bureau devant un ordinateur portable, entouree d'icones de canaux (email,
chat, Slack, HR...).

TACHE : reproduis en SVG (viewBox 1920x1080, palette stricte #0B1F3A bleu fonce / #FFFFFF blanc
/ #FF6B1A orange accent) UNIQUEMENT la silhouette humaine assise au bureau de ce premier panneau
-- pas les icones, pas le texte, juste la silhouette + le bureau + le laptop.

OBSERVE PRECISEMENT la construction de cette silhouette avant de dessiner : c'est un CONTOUR
SIMPLE, une seule silhouette de profil en aplat blanc plein (pas de bras/coude/main dessines
comme des segments articules separes -- le bras est absorbe dans le contour general du dos/torse,
la main n'est qu'une legere inflexion de la ligne pres du visage). C'est plus proche d'un
pictogramme/decoupage papier que d'une figure anatomique detaillee. REPRODUIS cette meme logique
de construction (contour unique, pas de segments de bras separes calcules individuellement).

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
        "reasoning": {"max_tokens": 2000},
        "max_tokens": 16000,
    }
    print(f"Generating SVG with {KIMI_K3_MODEL} (vision, reasoning bounded) via OpenRouter...")
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
    gen_gpt_sol(OUT_DIR / "proto-gpt56sol-reproduce-ref.svg")
    gen_kimi_k3(OUT_DIR / "proto-kimik3-reproduce-ref.svg")
