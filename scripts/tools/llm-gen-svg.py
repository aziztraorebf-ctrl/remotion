"""
llm-gen-svg.py — genere des JETONS SVG (paths/groupes) via un LLM, en UN seul appel pour PLUSIEURS jetons.

But (carto V5, 2026-06-21) : au lieu que Claude devine le SVG d'un jeton, demander a Gemini 3.1 Pro OU GPT-5.5
de produire le contenu SVG de N jetons d'une scene d'un coup (economie d'appels). Le LLM ne dessine QUE le
contenu interieur (centre sur 0,0, dans un rayon donne) ; le cadre hexagonal + l'ancrage geo sont geres par
notre TokenFrame cote code.

Usage :
    python3 scripts/tools/llm-gen-svg.py --provider gemini --out /tmp/svg-gemini.json
    python3 scripts/tools/llm-gen-svg.py --provider gpt    --out /tmp/svg-gpt.json
"""
import argparse
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

# Le brief : ce qu'on veut, le registre exact, la contrainte technique (frame-driven, centre 0,0).
PROMPT = r"""
Tu es un generateur de PICTOGRAMMES SVG pour une chaine de cartographie geopolitique premium (registre
"Souverain" : fond bleu navy #16213a, accents OR #c8a951, ivoire #f2efe6). Ces pictogrammes seront poses a
l'interieur de jetons hexagonaux geo-ancres sur une carte Mapbox (le cadre hexagonal et l'ancrage sont deja
geres par le code : tu ne dessines QUE le CONTENU interieur).

CONTRAINTES TECHNIQUES STRICTES (non negociables) :
- Coordonnees centrees sur l'origine (0,0). Le contenu doit tenir dans un rayon de 40 unites (donc x,y dans [-40, 40]).
- Le SVG sera rendu dans React/Remotion : utilise UNIQUEMENT des elements SVG (path, circle, rect, line, polygon,
  ellipse, g) avec des attributs statiques OU dependant d'une variable `f` (le numero de frame courant, 30fps).
- Pour ANIMER : tu PEUX utiliser `f` dans des expressions JS inline via la syntaxe `{expression}` dans les attributs.
  Exemples valides : opacity={0.5 + 0.5 * Math.sin(f / 8)} , transform={`translate(0 ${2 * Math.sin(f/10)})`}.
- ZERO CSS animation, ZERO @keyframes, ZERO setTimeout, ZERO requestAnimationFrame. Animation = fonction de `f` uniquement.
- Anime sur des periodes LENTES et lisibles (cycles de ~0.3s a 3s), jamais stroboscopique.
- Palette : surtout or #c8a951, ivoire #f2efe6, navy #16213a. Premium, pas simpliste, mais lisible a petite taille.

JETONS DEMANDES (genere CHACUN comme une chaine de JSX SVG, contenu interieur seulement) :
1. "gas"     : une torchere / flamme de gaz qui vacille (mouvement organique non-robotique).
2. "oil"     : une goutte de petrole + ondes, ou un derrick stylise, avec une pulsation lente.
3. "sonar"   : un point central + anneaux concentriques qui se propagent (ping sonar) en boucle.
4. "export"  : une fleche / un flux qui part vers l'exterieur (idee d'exportation), anime.
5. "reserve" : un symbole de reserve/stock (barils empiles ou jauge) avec un remplissage anime.

REPONDS EN JSON STRICT (et rien d'autre), de la forme :
{
  "tokens": {
    "gas":     "<g>...JSX SVG...</g>",
    "oil":     "<g>...</g>",
    "sonar":   "<g>...</g>",
    "export":  "<g>...</g>",
    "reserve": "<g>...</g>"
  },
  "notes": "remarques eventuelles sur les choix d'animation"
}
"""


def gen_gemini(out: Path):
    from google import genai
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
    client = genai.Client(api_key=key)
    print(f"Generating SVG tokens with {GEMINI_MODEL}...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=[PROMPT])
    text = resp.candidates[0].content.parts[0].text
    out.write_text(text, encoding="utf-8")
    print(f"Saved raw: {out}")


def gen_gpt(out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": GPT_MODEL,
        "messages": [{"role": "user", "content": PROMPT}],
    }
    print(f"Generating SVG tokens with {GPT_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"Saved raw: {out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt"])
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.provider == "gemini":
        gen_gemini(out)
    else:
        gen_gpt(out)


if __name__ == "__main__":
    main()
