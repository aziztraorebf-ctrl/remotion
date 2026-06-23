"""
svg-from-image-target.py — TEST D'ECART image-cible -> SVG (doctrine SVG-FAISABILITE-AMONT).

On joint l'IMAGE-CIBLE (raster grave genere) + on demande au LLM de la REPRODUIRE en SVG vectoriel,
decoupe en <g id> nommes (sinon inanimable). On rend ensuite le SVG et on COMPARE a l'image-cible
cote a cote pour mesurer ce qui se transcrit / s'effondre AVANT de coder le pilote.

Modeles verrouilles (CLAUDE.md) : gemini-3.1-pro-preview / openai/gpt-5.5 (texte+vision).
Sortie = JSON {scene_svg, groups, notes}.
Usage:
  python3 scripts/tools/svg-from-image-target.py --provider gemini|gpt --target cible.png \
    --intention "<contexte court>" --out /tmp/x.json
"""
import argparse, base64, json, os, re, sys
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

BRIEF = r"""Tu es un illustrateur SVG VECTORIEL expert. L'image jointe est l'IMAGE-CIBLE : le rendu EXACT
qu'on veut obtenir (gravure naturaliste / planche d'etude : trait d'encre vivant, HACHURES, lignes de
construction, cotes, annotations). Ta mission : REPRODUIRE cette image en SVG vectoriel le plus fidelement
possible, AU TRAIT (pas d'aplats plats colores ; le volume se rend par hachures et croisillons, comme la cible).

CONTRAINTES TECHNIQUES (non-negociables) :
- viewBox="0 0 1080 1920" (vertical 9:16).
- Decoupe OBLIGATOIRE en <g id="..."> nommes, UN groupe par element ANIMABLE separement (on animera chaque
  groupe par frame : apparition, trace stroke-dasharray, croissance, recoloration). Nomme-les clairement en
  snake_case (ex: cadre, sol_surface, cuvette_demi_lune, arbre_tronc, arbre_branches, feuilles, racine_pivot,
  radicelles, nappe_eau, hachures_sol, lignes_mesure, annotations, soleil, pluie, graticule, trace_ceinture,
  arbres_alignes, cartouche, rose_des_vents, echelle, labels_pays...). Adapte les noms a CE que montre la cible.
- Pour les TRACES qu'on voudra "dessiner a la main" (frontieres, ligne de ceinture, racine, cotes) : utilise
  des <path stroke="..." fill="none"> (pas des formes pleines) pour qu'on puisse les animer en stroke-dasharray.
- Le texte/annotations : balises <text> separees dans un groupe annotations (avec accents FR si presents).
- Palette = trait brun-noir #2b2117 sur fond parchemin creme #e8dcc0 (comme la cible). Hachures = lignes fines.
- AUCUNE animation de ta part (statique pur). AUCUN attribut JS. SVG standard (kebab-case : stroke-width, etc.).

CONTEXTE de la scene (pour nommer juste les groupes) :
{INTENTION}

REPONDS EN JSON STRICT (rien d'autre, pas de ```), forme exacte :
{
  "scene_svg": "<svg viewBox=\"0 0 1080 1920\" xmlns=\"http://www.w3.org/2000/svg\"> ... </svg>",
  "groups": ["liste des id de groupes, dans l'ordre d'apparition narrative souhaite"],
  "notes": "ce que tu n'as PAS pu reproduire fidelement en vectoriel (ou ca s'appauvrit vs la cible raster), 2-3 phrases"
}
"""

def gen_gemini(intention, target, out):
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    parts = [types.Part.from_text(text=BRIEF.replace("{INTENTION}", intention)),
             types.Part.from_bytes(data=Path(target).read_bytes(), mime_type="image/png")]
    print(f"[gemini] {GEMINI_MODEL} image->svg ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
    out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    print(f"[gemini] saved -> {out}")

def gen_gpt(intention, target, out):
    import requests
    b64 = base64.b64encode(Path(target).read_bytes()).decode()
    content = [{"type": "text", "text": BRIEF.replace("{INTENTION}", intention)},
               {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}]
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": content}]}
    print(f"[gpt] {GPT_MODEL} image->svg ...")
    rr = requests.post("https://openrouter.ai/api/v1/chat/completions",
                       headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
                       json=payload, timeout=900)
    rr.raise_for_status()
    out.write_text(rr.json()["choices"][0]["message"]["content"], encoding="utf-8")
    print(f"[gpt] saved -> {out}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt"])
    ap.add_argument("--target", required=True)
    ap.add_argument("--intention", default="")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    (gen_gemini if a.provider == "gemini" else gen_gpt)(a.intention, a.target, out)

if __name__ == "__main__":
    main()
