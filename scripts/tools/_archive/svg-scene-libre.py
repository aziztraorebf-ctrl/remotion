"""
⛔ DEPRECATED (2026-06-23) — pour une SCENE NARRATIVE, utiliser `svg-scene-narrative.py` a la place.
   CET OUTIL IMPOSE "lignes de construction + cotes" dans son prompt interne -> il force le mode SCHEMA
   TECHNIQUE (planche d'ingenieur). Cause prouvee de 4 generations B2 ratees. Garde uniquement si tu veux
   VRAIMENT un schema technique avec cotes. Sinon -> svg-scene-narrative.py (scene qui raconte, sans cotes).

svg-scene-libre.py — generation SVG LIBRE depuis un brief texte (+ image-ref de STYLE optionnelle).
⛔ DEPRECATED 2026-06-23 — NE PAS UTILISER. Remplace par svg-scene-narrative.py (forcait les lignes de construction/cotes au lieu d'une scene narrative).
Methode 2026-06-22 (Aziz) : l'image-cible = le SVG NATIF du generateur, pas un raster intermediaire.
On demande directement le SVG aux 2 meilleurs modeles : Gemini 3.1 Pro (vision/SVG) + GPT-5.5.
L'image-ref jointe (si fournie) sert de REFERENCE DE STYLE/NIVEAU uniquement (pas de contenu).

Sortie = JSON {scene_svg, groups, notes}. Decoupe <g id> nommes OBLIGATOIRE (animable).
Usage:
  python3 scripts/tools/svg-scene-libre.py --provider gemini|gpt --brief "<scene>" \
    [--style-ref a.png] --out /tmp/x.json
"""
import argparse, base64, os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

BRIEF = r"""Tu es un illustrateur SVG VECTORIEL expert. Genere une scene SVG premium ANIMABLE.
{STYLE_NOTE}
CONTRAINTES TECHNIQUES (non-negociables) :
- viewBox="0 0 1080 1920" (VERTICAL 9:16).
- Registre = gravure/encre EPUREE : trait brun-noir #2b2117 sur fond parchemin creme #e8dcc0. Hachures SCHEMATIQUES
  MESUREES uniquement (quelques lignes par strate/zone, pas des milliers), lignes de construction pointillees, cotes.
  AUCUN aplat de couleur plein, AUCUN photoreal, AUCUNE hachure de plume ultra-dense. EPURE : 5-8 elements heros max,
  chacun lisible en 1 seconde. Le "premium" vient de l'epure + la proprete du trait, PAS de la densite.
- Decoupe OBLIGATOIRE en <g id="..."> nommes (snake_case), UN groupe par element animable separement (on animera par
  frame : apparition, trace stroke-dasharray "se-dessine", croissance, recoloration). Adapte les noms au contenu.
- Traits qu'on voudra "dessiner a la main" -> <path stroke fill="none"> (animable en stroke-dasharray).
- Texte/annotations FR avec accents, dans un groupe a part. SVG standard kebab-case (stroke-width, text-anchor...).
- Le DESERT/SABLE (si present) = dunes a CRETES + pointilles de grain, JAMAIS une vague d'eau/liquide.
- AUCUNE animation de ta part (statique pur). AUCUN attribut JS.

SCENE A GENERER :
{BRIEF}

REPONDS EN JSON STRICT (rien d'autre, pas de ```), forme exacte :
{
  "scene_svg": "<svg viewBox=\"0 0 1080 1920\" xmlns=\"http://www.w3.org/2000/svg\"> ... </svg>",
  "groups": ["id des groupes, ordre d'apparition narrative souhaite"],
  "notes": "1-2 phrases : choix de compo + ce qui sera le plus efficace a animer"
}
"""

def build(brief, has_ref):
    note = ("UNE IMAGE est jointe : c'est une REFERENCE DE STYLE ET DE NIVEAU DE COMPLEXITE uniquement (match ce niveau "
            "de trait/hachure/epure). Le CONTENU de la scene demandee est DIFFERENT, decrit ci-dessous." if has_ref
            else "")
    return BRIEF.replace("{STYLE_NOTE}", note).replace("{BRIEF}", brief)

def gen_gemini(brief, ref, out):
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    parts = [types.Part.from_text(text=build(brief, bool(ref)))]
    if ref:
        parts.append(types.Part.from_bytes(data=Path(ref).read_bytes(), mime_type="image/png"))
    print(f"[gemini] {GEMINI_MODEL} svg-libre ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
    out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    print(f"[gemini] saved -> {out}")

def gen_gpt(brief, ref, out):
    import requests
    content = [{"type": "text", "text": build(brief, bool(ref))}]
    if ref:
        b64 = base64.b64encode(Path(ref).read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": content}]}
    print(f"[gpt] {GPT_MODEL} svg-libre ...")
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
    ap.add_argument("--style-ref", default="")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    ref = a.style_ref if a.style_ref.strip() else None
    (gen_gemini if a.provider == "gemini" else gen_gpt)(a.brief, ref, out)

if __name__ == "__main__":
    main()
