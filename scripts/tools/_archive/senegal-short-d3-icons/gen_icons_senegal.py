"""
gen_icons_senegal.py — genere les 4 icones blueprint (Sangomar/GTA/Yakaar/engrenage) pour le
Beat 2 du Short Senegal Petrole Gaz D3. 1 appel par modele = les 4 icones dans la meme reponse.
Trio : GPT-5.6 Sol, Gemini 3.1 Pro, GLM-5.2 (valide Aziz session 2026-07-14).
"""
import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path("/Users/clawdbot/Workspace/remotion")
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_SOL_MODEL = "openai/gpt-5.6-sol"
GLM_MODEL = "z-ai/glm-5.2"

PROMPT = r"""
Tu es un generateur d'ICONES SVG BLUEPRINT TECHNIQUE pour une video "Souverain" (carte geopolitique
premium, fond parchemin, contours navy #16213a, accents OR #c8a951). Ces icones seront posees sur une
carte SVG du Senegal (3 gisements petrole/gaz offshore) et un symbole de mecanisme abstrait.

CONTRAINTES TECHNIQUES STRICTES (non negociables) :
- Chaque icone = un <g> autonome, coordonnees centrees sur l'origine (0,0), contenu tenant dans un
  rayon de 40 unites (x,y dans [-40, 40]).
- Rendu dans React/Remotion : UNIQUEMENT des elements SVG statiques (path, circle, rect, line, polygon,
  ellipse, g). ZERO CSS, ZERO @keyframes, ZERO JS/animation inline — le SVG doit etre un dessin FIXE,
  l'animation sera geree par notre code cote React (opacity/scale/stroke-dashoffset pilotes par nous).
- Style BLUEPRINT / SCHEMA TECHNIQUE : traits fins et propres, PAS de remplissage plein sauf accents
  ponctuels, géométrie précise façon plan d'ingénieur. Palette : traits OR #c8a951 principalement,
  quelques accents NAVY #16213a. AUCUN degrade, AUCUNE texture, fond transparent (pas de <rect> de fond).
- Chaque icone doit rester lisible a petite taille (elle sera affichee a ~30-40px de diametre sur une carte).

ICONES DEMANDEES (genere CHACUNE comme une chaine SVG <g>...</g>) :
1. "sangomar" : plateforme/derrick petrolier OFFSHORE — silhouette de plateforme sur pilotis au-dessus
   de l'eau (quelques lignes horizontales suggerant la houle en dessous), tour de forage stylisee.
   Statut ACTIF : trait plein, net.
2. "gta" : torchere a gaz (flare) — une tour fine avec une flamme stylisee au sommet (formes
   triangulaires/organiques simples pour la flamme, en trait). Statut ACTIF : trait plein, net.
3. "yakaar" : EXACTEMENT le meme motif que "gta" (torchere/flamme) mais dessine en traits POINTILLES
   (utilise stroke-dasharray dans le path/line lui-meme, valeurs fixes ex "4 3") et visuellement plus
   fin/discret — pour signifier un gisement "en suspens", pas encore actif.
4. "mecanisme" : un engrenage/rouage technique simple — cercle central + 6 a 8 dents rectangulaires
   autour, style schema technique epure (PAS un engrenage complexe/realiste, reste minimaliste).

REPONDS EN JSON STRICT (et rien d'autre), de la forme :
{
  "icons": {
    "sangomar": "<g>...contenu SVG...</g>",
    "gta": "<g>...</g>",
    "yakaar": "<g>...</g>",
    "mecanisme": "<g>...</g>"
  },
  "notes": "remarques eventuelles"
}
"""


def gen_gemini(out: Path):
    from google import genai
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
    client = genai.Client(api_key=key)
    print(f"Generating icons with {GEMINI_MODEL}...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=[PROMPT])
    text = resp.candidates[0].content.parts[0].text
    out.write_text(text, encoding="utf-8")
    print(f"Saved raw: {out} ({len(text)} chars)")


def gen_gpt_sol(out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"model": GPT_SOL_MODEL, "messages": [{"role": "user", "content": PROMPT}]}
    print(f"Generating icons with {GPT_SOL_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"Saved raw: {out} ({len(text)} chars)")


def gen_glm(out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"model": GLM_MODEL, "messages": [{"role": "user", "content": PROMPT}]}
    print(f"Generating icons with {GLM_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"Saved raw: {out} ({len(text)} chars)")


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt-sol", "glm"])
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.provider == "gemini":
        gen_gemini(out)
    elif args.provider == "gpt-sol":
        gen_gpt_sol(out)
    else:
        gen_glm(out)
