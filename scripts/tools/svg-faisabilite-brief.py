"""
svg-faisabilite-brief.py — ETAPE INTERMEDIAIRE "faisabilite SVG" (idee Aziz 2026-06-22).

Principe : c'est le LLM (Gemini/GPT) qui DESSINE le SVG -> c'est donc LUI qui connait SES capacites.
Avant de coder une scene, on lui demande, depuis SA force native :
  (a) la MEILLEURE facon de dessiner cette scene en SVG pour qu'elle soit 100% LISIBLE,
  (b) ce qu'il CHANGERAIT (vue, decoupage, niveau de detail) pour que ca "lise",
  (c) un MINI-STORYBOARD pre-SVG (3-4 etats de l'animation envisagee, en mots),
  (d) le PROMPT exact d'une IMAGE-CIBLE a generer (qu'on passera a un modele image).
On joint des FRAMES de reference (ce qu'on sait deja rendre) pour qu'il calibre le niveau.
Contrainte technique LEGERE rappelee : decoupe en <g id> nommes (sinon inanimable). Le reste = sa liberte.

Sortie = JSON {approche, changements, mini_storyboard, image_cible_prompt, faisable_note}.
Usage :
  python3 scripts/tools/svg-faisabilite-brief.py --provider gemini --intention "<...>" --refs a.png,b.png --out /tmp/x.json
"""
import argparse, base64, json, os, sys
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

BRIEF = r"""Tu es un illustrateur SVG VECTORIEL expert. Tu vas DESSINER le SVG d'une scene pour une video courte premium.
TOI SEUL connais TES capacites reelles en dessin SVG vectoriel. On te fait 100% confiance la-dessus.

NOTRE ROLE (pas le tien) : une fois que tu nous livres le SVG decoupe en groupes nommes, NOUS l'ANIMONS par frame
(apparition, trace, croissance) et nous pilotons la COULEUR (un monde "mort" en N&B/sombre, la VIE qui jaillit en
couleur pleine). Tu n'as donc PAS a animer ni a colorer la transition — juste a livrer une MATIERE statique LISIBLE
et bien decoupee. SEULE CONTRAINTE TECHNIQUE : decoupe la scene en <g id="..."> nommes (un par element animable),
sinon on ne peut rien animer. Pour le reste (vue, cadrage, niveau de detail, style), TU choisis ce qui rend le MIEUX.

IMAGES JOINTES : des rendus de REFERENCE de ce qu'on sait deja produire (pour calibrer le niveau premium attendu)
ET, si presente, une TENTATIVE RATEE de la scene demandee (pour que tu voies le probleme a eviter).

SCENE DEMANDEE (l'intention + le geste voulu) :
{INTENTION}

REPONDS EN JSON STRICT (rien d'autre, pas de ```), forme exacte :
{
  "faisable_note": "0-10 : a quel point TU peux rendre cette scene LISIBLE et premium en SVG vectoriel, + 1 phrase franche",
  "approche": "TA meilleure facon de dessiner cette scene en SVG pour qu'elle LISE a 100% (quelle VUE : top-down / 3-4 plongee / profil / coupe ; pourquoi ; comment tu dessines l'element-cle pour qu'il soit reconnaissable)",
  "changements": "ce que tu CHANGERAIS par rapport a l'intention naive pour que ca lise vraiment (ex : 'le top-down pur rend un arbre illisible -> vue 3/4', ou 'allege a N elements', ou 'autre angle')",
  "mini_storyboard": ["etat 1 (mots)", "etat 2", "etat 3", "etat 4 (apogee)"],
  "image_cible_prompt": "le PROMPT exact, en anglais, pour generer une IMAGE-CIBLE photoreal-ou-illustree de ce que ton SVG visera (pour qu'on VOIE avant de coder). Decris la vue, la compo, le style, l'element-cle."
}
"""

def encode_img(p):
    return base64.b64encode(Path(p).read_bytes()).decode()

def gen_gemini(intention, refs, out):
    from google import genai
    from google.genai import types
    key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=key)
    parts = [types.Part.from_text(text=BRIEF.replace("{INTENTION}", intention))]
    for r in refs:
        parts.append(types.Part.from_bytes(data=Path(r).read_bytes(), mime_type="image/png"))
    print(f"[gemini] {GEMINI_MODEL} faisabilite ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
    out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    print(f"[gemini] saved -> {out}")

def gen_gpt(intention, refs, out):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    content = [{"type": "text", "text": BRIEF.replace("{INTENTION}", intention)}]
    for r in refs:
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{encode_img(r)}"}})
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": content}]}
    print(f"[gpt] {GPT_MODEL} faisabilite ...")
    rr = requests.post("https://openrouter.ai/api/v1/chat/completions",
                       headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                       json=payload, timeout=600)
    rr.raise_for_status()
    out.write_text(rr.json()["choices"][0]["message"]["content"], encoding="utf-8")
    print(f"[gpt] saved -> {out}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt"])
    ap.add_argument("--intention", required=True)
    ap.add_argument("--refs", default="", help="png paths comma-separated")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    refs = [r for r in a.refs.split(",") if r.strip()]
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    if a.provider == "gemini":
        gen_gemini(a.intention, refs, out)
    else:
        gen_gpt(a.intention, refs, out)

if __name__ == "__main__":
    main()
