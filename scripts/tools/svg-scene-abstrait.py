"""
svg-scene-abstrait.py — generation SVG d'une COMPOSITION ABSTRAITE/CONCEPTUELLE (dataviz, motion
design, diagramme vivant) — PAS une scene narrative avec objets-heros, PAS un schema technique
annote. Variante de svg-scene-narrative.py (memes providers/mecanique) avec un brief interne NEUTRE :
aucun narratif "objets-heros/paysage/emotion" impose, aucun interdit anti-cotes/grille qui ne
s'applique pas a ce registre.

Cause : svg-scene-narrative.py force "SCENE QUI RACONTE, 4-6 objets-heros" -> sur un brief abstrait
(lignes, flux, courbes, dataviz) les modeles hallucinent une scene paysage/personnage hors-sujet
(observe 2026-08-06, NorthShield Direction B : brief "flux de traits" -> desert + personnage).

Sortie = JSON {scene_svg, groups, notes}. Decoupe <g id> nommes OBLIGATOIRE (animable).
Usage:
  python3 scripts/tools/svg-scene-abstrait.py --provider gemini|gpt|kimi --brief "<brief>" \
    [--ref image.png] --ratio 16:9|9:16 --out /tmp/x.json
"""
import argparse, base64, os, socket
from pathlib import Path
from dotenv import load_dotenv

# FIX 2026-07-03 : IPv6 resout mais pas de route sortante sur ce reseau -> forcer IPv4.
_orig_getaddrinfo = socket.getaddrinfo
def _ipv4_only_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _ipv4_only_getaddrinfo

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.6-sol"
KIMI_K3_MODEL = "moonshotai/kimi-k3"

RATIO_VIEWBOX = {
    "9:16": ("1080 1920", "VERTICAL 9:16"),
    "16:9": ("1920 1080", "HORIZONTAL 16:9"),
}

BRIEF = r"""Tu es un illustrateur SVG VECTORIEL expert en COMPOSITIONS ABSTRAITES / MOTION DESIGN
PREMIUM (type visualisation de donnees editoriale, Bloomberg/Vox, ou motion design SaaS haut de
gamme) — PAS en scenes narratives avec personnages/paysages, PAS en schema technique annote
(pas de cotes/mesures/cartouches d'ingenieur).

{REF_NOTE}

CE QU'ON VEUT :
- une composition GEOMETRIQUE/ABSTRAITE lisible en 1 seconde : le concept se comprend d'un coup
  d'oeil, sans texte explicatif necessaire.
- de la DENSITE et de la RICHESSE visuelle reelle : ce n'est PAS un croquis minimal a 3-4 lignes
  isolees sur fond vide. Vise une texture qui occupe vraiment l'espace (multiples elements/plans
  de profondeur, glow/halo perceptible construit en couches de traits empilees a opacite
  suffisante — jamais un simple filtre blur trop pale qui disparait au rendu), comme une
  visualisation de donnees premium.
- de la profondeur si pertinent (plusieurs plans, parallaxe suggeree), un cadrage qui remplit le
  {RATIO_LABEL}.
- respecte STRICTEMENT la palette de couleurs fournie dans le brief ci-dessous — aucune couleur
  hors de cette liste.

CONTRAINTES TECHNIQUES :
- viewBox="0 0 {RATIO_VB}" ({RATIO_LABEL}).
- Decoupe OBLIGATOIRE en <g id="..."> nommes (snake_case), UN groupe par element animable
  separement (on animera par frame : apparition, mouvement, recoloration, trace stroke-dasharray,
  convergence). Adapte les noms au contenu.
- AUCUNE animation de ta part (statique pur). AUCUN attribut JS. SVG standard kebab-case.
- Respecte tous les interdits explicites mentionnes dans le brief (cliches visuels a eviter).

COMPOSITION A GENERER :
{BRIEF}

REPONDS EN JSON STRICT (rien d'autre, pas de ```), forme exacte :
{
  "scene_svg": "<svg viewBox=\"0 0 {RATIO_VB}\" xmlns=\"http://www.w3.org/2000/svg\"> ... </svg>",
  "groups": ["id des groupes, ordre d'apparition narrative souhaite"],
  "notes": "1-2 phrases : le concept represente + ce qui sera le plus efficace a animer"
}
"""

def build(brief, has_ref, ratio):
    note = ("UNE image est jointe = REFERENCE DE CALIBRAGE (niveau de densite/richesse visuelle a "
            "atteindre, PAS le contenu a copier) : la composition demandee est decrite plus bas.") if has_ref else ""
    vb, label = RATIO_VIEWBOX[ratio]
    return (BRIEF.replace("{REF_NOTE}", note).replace("{BRIEF}", brief)
                 .replace("{RATIO_VB}", vb).replace("{RATIO_LABEL}", label))

def gen_gemini(brief, ref, out, ratio):
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    parts = [types.Part.from_text(text=build(brief, bool(ref), ratio))]
    if ref:
        parts.append(types.Part.from_bytes(data=Path(ref).read_bytes(), mime_type="image/png"))
    print(f"[gemini] {GEMINI_MODEL} svg-abstrait ratio={ratio} ({1 if ref else 0} ref) ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
    out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    print(f"[gemini] saved -> {out}")

def gen_gpt(brief, ref, out, ratio):
    import requests
    content = [{"type": "text", "text": build(brief, bool(ref), ratio)}]
    if ref:
        b64 = base64.b64encode(Path(ref).read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": content}]}
    print(f"[gpt] {GPT_MODEL} svg-abstrait ratio={ratio} ({1 if ref else 0} ref) ...")
    rr = requests.post("https://openrouter.ai/api/v1/chat/completions",
                       headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
                       json=payload, timeout=900)
    if rr.status_code != 200:
        raise SystemExit(f"[gpt] HTTP {rr.status_code} : {rr.text[:500]}")
    out.write_text(rr.json()["choices"][0]["message"]["content"], encoding="utf-8")
    print(f"[gpt] saved -> {out}")

def gen_kimi(brief, ref, out, ratio):
    import requests
    content = [{"type": "text", "text": build(brief, bool(ref), ratio)}]
    if ref:
        b64 = base64.b64encode(Path(ref).read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    # BORNER LE REASONING, SINON K3 NE REND JAMAIS DE CONTENU (memes gotchas que svg-scene-narrative.py).
    payload = {
        "model": KIMI_K3_MODEL,
        "messages": [{"role": "user", "content": content}],
        "reasoning": {"max_tokens": 2000},
        "max_tokens": 16000,
    }
    print(f"[kimi-k3] {KIMI_K3_MODEL} svg-abstrait ratio={ratio} ({1 if ref else 0} ref) ...")
    rr = requests.post("https://openrouter.ai/api/v1/chat/completions",
                       headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
                       json=payload, timeout=900)
    if rr.status_code != 200:
        raise SystemExit(f"[kimi-k3] HTTP {rr.status_code} : {rr.text[:500]}")
    data = rr.json()
    if "choices" not in data:
        raise SystemExit(f"[kimi-k3] reponse sans 'choices' : {data.get('error', data)}")
    msg = data["choices"][0]["message"]
    usage = data.get("usage", {})
    text = msg.get("content")
    if not text:
        fr = data["choices"][0].get("finish_reason")
        rt = usage.get("completion_tokens_details", {}).get("reasoning_tokens")
        raise SystemExit(
            f"[kimi-k3] AUCUN CONTENU (content=null). finish_reason={fr} reasoning_tokens={rt}.\n"
            f"  -> le reasoning a mange tout le budget. Augmenter max_tokens ou baisser "
            f"reasoning.max_tokens."
        )
    out.write_text(text, encoding="utf-8")
    print(f"[kimi-k3] saved -> {out}  usage={usage}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt", "kimi"])
    ap.add_argument("--brief", required=True)
    ap.add_argument("--ref", default="")
    ap.add_argument("--ratio", default="16:9", choices=["9:16", "16:9"])
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    ref = a.ref if a.ref.strip() else None
    fn = {"gemini": gen_gemini, "gpt": gen_gpt, "kimi": gen_kimi}[a.provider]
    fn(a.brief, ref, out, a.ratio)

if __name__ == "__main__":
    main()
