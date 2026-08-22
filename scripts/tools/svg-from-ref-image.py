"""
svg-from-ref-image.py — reproduire un objet depuis une IMAGE DE REFERENCE en SVG "pret a animer".

Difference avec les scripts existants :
  - `svg-from-image-target.py` : brief INTERNE verrouille sur le registre gravure/parchemin 9:16.
  - `llm-gen-svg.py`           : prompt fige (jetons), text-only, pas d'image de reference.
Ici : le brief est FOURNI par l'appelant (--brief) et l'image de reference est jointe (vision).
Sert le contrat "PRET A ANIMER" (memory : fiche SVG dessine, decision 2026-08-18).

Modeles verrouilles (CLAUDE.md) :
  gemini -> gemini-3.1-pro-preview
  gpt    -> openai/gpt-5.6-sol   (texte+vision, remplace GPT-5.5 pour decor/scene riche)
  kimi   -> moonshotai/kimi-k3   (vision->SVG one-shot)

Usage :
  python3 scripts/tools/svg-from-ref-image.py --provider gpt \
      --brief /tmp/BRIEF.md --ref /tmp/reference.png --out /tmp/out-gpt.svg
"""
import argparse
import base64
import os
import re
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.6-sol"
KIMI_K3_MODEL = "moonshotai/kimi-k3"

TAIL = """

---
REPONDS UNIQUEMENT PAR LE FICHIER SVG COMPLET, commencant par <svg et finissant par </svg>.
Aucun texte avant, aucun texte apres, pas de bloc markdown.
"""


def extract_svg(text: str) -> str:
    """Isole le <svg>...</svg> meme si le modele a ajoute du bavardage ou un fence markdown."""
    m = re.search(r"<svg[\s\S]*?</svg>", text)
    return m.group(0) if m else text


def gen_gemini(brief: str, ref: Path, out: Path):
    from google import genai
    from google.genai import types

    key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing")
        sys.exit(1)
    client = genai.Client(api_key=key)
    img = types.Part.from_bytes(data=ref.read_bytes(), mime_type="image/png")
    print(f"[gemini] {GEMINI_MODEL} — reference {ref.name} ...")
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[img, brief + TAIL],
    )
    svg = extract_svg(resp.text or "")
    out.write_text(svg, encoding="utf-8")
    print(f"[gemini] saved {out} ({len(svg)} chars)")


def _openrouter_vision(model: str, brief: str, ref: Path, out: Path, extra: dict | None = None):
    import requests

    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing")
        sys.exit(1)
    b64 = base64.b64encode(ref.read_bytes()).decode()
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}},
                    {"type": "text", "text": brief + TAIL},
                ],
            }
        ],
    }
    if extra:
        payload.update(extra)
    print(f"[{model}] reference {ref.name} ...")
    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json=payload,
        timeout=1800,
    )
    r.raise_for_status()
    data = r.json()
    msg = data["choices"][0]["message"]
    text = msg.get("content") or ""
    if not text:
        # gotcha K3 documente : content=null si le raisonnement n'est pas borne
        text = msg.get("reasoning_content") or ""
        print(f"[{model}] WARNING: content vide, fallback reasoning_content ({len(text)} chars)")
    svg = extract_svg(text)
    out.write_text(svg, encoding="utf-8")
    print(f"[{model}] saved {out} ({len(svg)} chars) usage={data.get('usage', {})}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt", "kimi"])
    ap.add_argument("--brief", required=True, help="fichier .md du brief")
    ap.add_argument("--ref", required=True, help="image de reference (png)")
    ap.add_argument("--out", required=True, help="fichier .svg de sortie")
    args = ap.parse_args()

    brief = Path(args.brief).read_text(encoding="utf-8")
    ref = Path(args.ref)
    out = Path(args.out)
    if not ref.exists():
        print(f"ERROR: reference introuvable: {ref}")
        sys.exit(1)

    if args.provider == "gemini":
        gen_gemini(brief, ref, out)
    elif args.provider == "gpt":
        _openrouter_vision(GPT_MODEL, brief, ref, out)
    else:
        # K3 : borner le raisonnement, sinon content=null (memory/tools/kimi-k3-reasoning-borne.md)
        _openrouter_vision(
            KIMI_K3_MODEL,
            brief,
            ref,
            out,
            extra={"max_tokens": 32000, "reasoning": {"max_tokens": 3000}},
        )


if __name__ == "__main__":
    main()
