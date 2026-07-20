"""
svg-scene-upgrade.py — WORKFLOW INVERSE (2026-07-03) : on envoie NOTRE prototype deja construit
(scene codee, parallaxe, composition deja choisie) et on demande au modele de produire SA VERSION
SUPERIEURE de la MEME scene, en exploitant a fond ses capacites SVG natives (textures, degrades,
richesse de trait) -- PAS une scene differente, PAS une reinterpretation libre du sujet.

Different de svg-scene-narrative.py (qui genere une scene depuis un brief texte, refs = calibrage de
style seulement, "ne copie pas le contenu"). Ici l'image envoyee EST le contenu a egaler/depasser.

Sortie = JSON {scene_svg, groups, notes, changements}. Decoupe <g id> nommes OBLIGATOIRE (animable).
Usage:
  python3 scripts/tools/svg-scene-upgrade.py --provider gemini|gpt --prototype frame.png \
    --brief "<ce qu'on veut ameliorer>" --ratio 16:9 --out /tmp/x.json
"""
import argparse, base64, os, socket
from pathlib import Path
from dotenv import load_dotenv

# FIX 2026-07-03 : sur ce reseau, l'IPv6 resout mais n'a pas de route sortante -> httpx/genai
# restent bloques indefiniment dessus (curl a un fallback Happy Eyeballs rapide, pas Python).
_orig_getaddrinfo = socket.getaddrinfo
def _ipv4_only_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _ipv4_only_getaddrinfo

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

RATIO_VIEWBOX = {
    "9:16": ("1080 1920", "VERTICAL 9:16"),
    "16:9": ("1920 1080", "HORIZONTAL 16:9"),
}

BRIEF = r"""Tu es un illustrateur SVG VECTORIEL expert. On te montre une image : c'est NOTRE PROTOTYPE,
une scene qu'on a DEJA construite et dont on a DEJA choisi la composition (cadrage, elements, disposition).

TA TACHE N'EST PAS de creer une scene differente. TA TACHE est de produire TA MEILLEURE VERSION de
CETTE MEME scene -- memes elements, meme composition, meme histoire -- mais dessinee avec TES capacites
SVG natives a fond : textures plus riches dans le trait, degrades/lumiere plus premium, formes plus
justes, niveau de detail superieur. Comme si un directeur artistique reprenait un storyboard grossier
et le portait au niveau final -- on garde l'intention et la mise en page, on change la qualite d'execution.

CE QU'ON VEUT AMELIORER SPECIFIQUEMENT (priorise ca) :
{BRIEF}

REGLES :
- GARDE la meme composition generale (memes elements, positions relatives, cadrage). N'invente pas de
  nouveaux personnages/objets qui n'etaient pas dans l'image, ne supprime aucun element existant.
- AMELIORE la qualite de dessin : traits plus surs, degrades de lumiere (ciel, ocean, soleil), textures
  (bois, metal, feuillage), coherence des couleurs sur TOUT le sujet (pas de zones oubliees en gris/blanc).
- AUCUNE cote, AUCUNE ligne de mesure, AUCUNE grille de schema technique, AUCUN cartouche/legende.
- viewBox="0 0 {RATIO_VB}" ({RATIO_LABEL}).
- Decoupe OBLIGATOIRE en <g id="..."> nommes (snake_case), UN groupe par objet-heros animable separement.
- AUCUNE animation de ta part (statique pur). AUCUN attribut JS. SVG standard kebab-case.

REPONDS EN JSON STRICT (rien d'autre, pas de ```), forme exacte :
{
  "scene_svg": "<svg viewBox=\"0 0 {RATIO_VB}\" xmlns=\"http://www.w3.org/2000/svg\"> ... </svg>",
  "groups": ["id des groupes"],
  "notes": "1-2 phrases sur l'approche generale",
  "changements": "liste courte de ce que tu as concretement ameliore vs le prototype"
}
"""

def build(brief, ratio):
    vb, label = RATIO_VIEWBOX[ratio]
    return BRIEF.replace("{BRIEF}", brief).replace("{RATIO_VB}", vb).replace("{RATIO_LABEL}", label)

def gen_gemini(brief, prototype, out, ratio):
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    parts = [
        types.Part.from_text(text=build(brief, ratio)),
        types.Part.from_bytes(data=Path(prototype).read_bytes(), mime_type="image/png"),
    ]
    print(f"[gemini] {GEMINI_MODEL} svg-upgrade ratio={ratio} ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
    out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    print(f"[gemini] saved -> {out}")

def gen_gpt(brief, prototype, out, ratio):
    import requests
    b64 = base64.b64encode(Path(prototype).read_bytes()).decode()
    content = [
        {"type": "text", "text": build(brief, ratio)},
        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}},
    ]
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": content}]}
    print(f"[gpt] {GPT_MODEL} svg-upgrade ratio={ratio} ...")
    rr = requests.post("https://openrouter.ai/api/v1/chat/completions",
                       headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
                       json=payload, timeout=600)
    rr.raise_for_status()
    out.write_text(rr.json()["choices"][0]["message"]["content"], encoding="utf-8")
    print(f"[gpt] saved -> {out}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt"])
    ap.add_argument("--prototype", required=True, help="chemin PNG de notre prototype (le contenu a ameliorer)")
    ap.add_argument("--brief", required=True, help="ce qu'on veut ameliorer specifiquement")
    ap.add_argument("--ratio", default="16:9", choices=["9:16", "16:9"])
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    (gen_gemini if a.provider == "gemini" else gen_gpt)(a.brief, a.prototype, out, a.ratio)

if __name__ == "__main__":
    main()
