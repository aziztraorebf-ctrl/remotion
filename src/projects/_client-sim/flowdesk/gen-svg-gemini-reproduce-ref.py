"""
Teste si Gemini 3.1 Pro (roi organique, vision native) sait reproduire la silhouette
"personne/emotion" du storyboard-v2-gpt.png (contour simple non-articule) + les icones de
canaux, en SVG texte, avec l'image jointe en reference. Ad-hoc, scope = ce chantier uniquement.
"""
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[4]
load_dotenv(ROOT / ".env")

OUT_DIR = Path(__file__).resolve().parent
REF_IMAGE = OUT_DIR / "storyboard-v2-gpt.png"

GEMINI_MODEL = "gemini-3.1-pro-preview"

PROMPT = r"""
L'image jointe est un storyboard en 4 panneaux pour une video explicative produit ("Flowdesk").
Regarde ATTENTIVEMENT le PREMIER panneau (en haut a gauche, "ETAT INITIAL") : une silhouette
humaine assise a un bureau devant un ordinateur portable, entouree d'icones de canaux (email,
chat, Slack, HR, document...).

TACHE : reproduis en SVG (viewBox 1920x1080, palette stricte #0B1F3A bleu fonce / #FFFFFF blanc
/ #FF6B1A orange accent) ce premier panneau en entier : la silhouette humaine assise au bureau
AVEC le laptop, ET les 6-8 icones de canaux qui l'entourent (bulles/carres arrondis blancs avec
un pictogramme simple a l'interieur : enveloppe, bulle de chat, document, personne, etc.).

OBSERVE PRECISEMENT la construction de la silhouette avant de dessiner : c'est un CONTOUR SIMPLE,
une silhouette de profil en aplat blanc plein (pas de bras/coude/main dessines comme des segments
articules separes -- le bras est absorbe dans le contour general du dos/torse). C'est plus proche
d'un pictogramme/decoupage papier que d'une figure anatomique detaillee. REPRODUIS cette meme
logique de construction (contour unique, pas de segments articules calcules individuellement).

Pour les icones : cartes/bulles arrondies blanches avec un pictogramme simple lisible a
l'interieur, disposees autour de la silhouette comme dans l'image de reference.

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


def gen_gemini(out: Path):
    from google import genai
    from google.genai import types

    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing")
        sys.exit(1)
    client = genai.Client(api_key=key)
    parts = [
        types.Part.from_bytes(data=REF_IMAGE.read_bytes(), mime_type="image/png"),
        types.Part.from_text(text=PROMPT),
    ]
    print(f"Generating SVG with {GEMINI_MODEL} (vision)...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
    text = resp.candidates[0].content.parts[0].text
    svg = _extract_svg(text)
    out.write_text(svg, encoding="utf-8")
    print(f"[gemini-3.1-pro] Saved: {out} ({len(svg)} chars)")


if __name__ == "__main__":
    if not REF_IMAGE.exists():
        print(f"ERROR: reference image not found: {REF_IMAGE}")
        sys.exit(1)
    gen_gemini(OUT_DIR / "proto-gemini-reproduce-ref.svg")
