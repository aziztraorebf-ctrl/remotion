"""
svg-scene-narrative.py — generation SVG d'une SCENE NARRATIVE (PAS un schema technique).
Variante de svg-scene-libre.py SANS l'imposition "cotes/lignes de construction" (qui forcait le mode planche).
Cause racine trouvee 2026-06-23 : le brief interne de svg-scene-libre IMPOSAIT "lignes de construction, cotes"
-> tout derivait vers le schema technique meme avec un brief narratif. Ici : on demande une SCENE QUI RACONTE.

Supporte 2 images-ref a ROLES DISTINCTS :
  --narrative-ref = une SCENE qui RACONTE (peut etre dans un autre registre/teinte) -> "vise CE niveau de narration"
  --style-ref     = le STYLE/teinte/trait a adopter (ex encre propre) -> "rends-le dans CE style"
Au moins une des deux. Si une seule, elle sert de style+exemple.

Sortie = JSON {scene_svg, groups, notes}. Decoupe <g id> nommes OBLIGATOIRE (animable).
Usage:
  python3 scripts/tools/svg-scene-narrative.py --provider gemini|gpt --brief "<scene>" \
    [--narrative-ref scene.png] [--style-ref encre.png] --out /tmp/x.json
"""
import argparse, base64, os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

BRIEF = r"""Tu es un illustrateur SVG VECTORIEL expert en SCENES NARRATIVES (pas en schemas techniques).
Genere une SCENE QUI RACONTE UN MOMENT — un instant charge d'emotion avec 4-6 OBJETS-HEROS reconnaissables,
comme une illustration d'album / un plan de film d'animation au trait. PAS un plan technique, PAS un schema.

{REF_NOTE}

⛔ INTERDITS ABSOLUS (sinon la scene rate) :
- AUCUNE cote, AUCUNE ligne de mesure, AUCune fleche de dimension, AUCUN "+17m"/"3,20m"/echelle.
- AUCUNE grille, AUCUN cartouche/encadre de donnees, AUCUN "FIG. 01"/"PLAN DE COUPE"/titre technique.
- AUCUNE legende, AUCUN label pointant un element, AUCUNE annotation type carnet d'ingenieur.
- Ce n'est PAS un releve, PAS un blueprint, PAS un plan d'arpentage. C'est une SCENE qui se regarde comme une image.

CE QU'ON VEUT :
- un MOMENT lisible en 1 seconde : on comprend l'histoire en un coup d'oeil.
- 4-6 objets-heros DESSINES (formes pleines reconnaissables : arbres, personnages, animaux, batiments, eau, ciel,
  outils, vehicules...) — chacun NET, zero blob, zero masse informe.
- de la profondeur (avant-plan / fond), un cadrage qui remplit le 9:16 vertical.
- de l'emotion (le geste, la lumiere, la tension) — pas de l'information.

CONTRAINTES TECHNIQUES :
- viewBox="0 0 1080 1920" (VERTICAL 9:16).
- Decoupe OBLIGATOIRE en <g id="..."> nommes (snake_case), UN groupe par objet-heros animable separement
  (on animera par frame : apparition, mouvement, recoloration, trace stroke-dasharray). Adapte les noms au contenu.
- Le DESERT/SABLE (si present) = dunes a cretes, JAMAIS une vague d'eau.
- AUCUNE animation de ta part (statique pur). AUCUN attribut JS. SVG standard kebab-case.

SCENE A GENERER :
{BRIEF}

REPONDS EN JSON STRICT (rien d'autre, pas de ```), forme exacte :
{
  "scene_svg": "<svg viewBox=\"0 0 1080 1920\" xmlns=\"http://www.w3.org/2000/svg\"> ... </svg>",
  "groups": ["id des groupes, ordre d'apparition narrative souhaite"],
  "notes": "1-2 phrases : le moment raconte + ce qui sera le plus efficace a animer"
}
"""

def build(brief, has_narr, has_style):
    if has_narr and has_style:
        note = ("DEUX images sont jointes. IMAGE 1 = une SCENE NARRATIVE REUSSIE (peut-etre dans une autre teinte/registre) : "
                "vise CE NIVEAU de narration et de lisibilite (un moment qui raconte, pas une planche). "
                "IMAGE 2 = le STYLE/teinte/trait a ADOPTER (couleur, type de trait, ambiance) : rends ta scene dans CE style. "
                "Ne copie le CONTENU d'aucune des deux : la scene demandee est decrite plus bas.")
    elif has_style:
        note = ("UNE image est jointe = REFERENCE DE STYLE ET DE NIVEAU NARRATIF (le look + le niveau de scene qui raconte). "
                "Ne copie pas son contenu : la scene demandee est differente, decrite plus bas.")
    else:
        note = ""
    return BRIEF.replace("{REF_NOTE}", note).replace("{BRIEF}", brief)

def _imgs(narr, style):
    out = []
    if narr: out.append(narr)
    if style: out.append(style)
    return out

def gen_gemini(brief, narr, style, out):
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    parts = [types.Part.from_text(text=build(brief, bool(narr), bool(style)))]
    for img in _imgs(narr, style):
        parts.append(types.Part.from_bytes(data=Path(img).read_bytes(), mime_type="image/png"))
    print(f"[gemini] {GEMINI_MODEL} svg-narrative ({len(_imgs(narr,style))} ref) ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
    out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    print(f"[gemini] saved -> {out}")

def gen_gpt(brief, narr, style, out):
    import requests
    content = [{"type": "text", "text": build(brief, bool(narr), bool(style))}]
    for img in _imgs(narr, style):
        b64 = base64.b64encode(Path(img).read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": content}]}
    print(f"[gpt] {GPT_MODEL} svg-narrative ({len(_imgs(narr,style))} ref) ...")
    rr = requests.post("https://openrouter.ai/api/v1/chat/completions",
                       headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
                       json=payload, timeout=900)
    rr.raise_for_status()
    out.write_text(rr.json()["choices"][0]["message"]["content"], encoding="utf-8")
    print(f"[gpt] saved -> {out}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt"])
    ap.add_argument("--brief", required=True)
    ap.add_argument("--narrative-ref", default="")
    ap.add_argument("--style-ref", default="")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    narr = a.narrative_ref if a.narrative_ref.strip() else None
    style = a.style_ref if a.style_ref.strip() else None
    (gen_gemini if a.provider == "gemini" else gen_gpt)(a.brief, narr, style, out)

if __name__ == "__main__":
    main()
