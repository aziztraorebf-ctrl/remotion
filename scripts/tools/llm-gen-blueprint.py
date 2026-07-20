"""
llm-gen-blueprint.py — genere un SCHEMA BLUEPRINT technique SVG (registre plan d'ingenieur) via un LLM.

R&D 2026-07-17 : test des capacites SVG "blueprint" de Kimi K3 (via OpenRouter), au-dela des jetons.
Registre : trace de construction fin (wireframe), cotes/fleches de mesure, labels annotes, cartouche technique.
Trace anime "plan qui se dessine" via stroke-dashoffset pilote par f (30fps). text-only, pas de vision.

NE PAS passer max_tokens (le reasoning "max" de K3 etouffe la sortie sinon). Timeout large.

Usage :
    python3 scripts/tools/llm-gen-blueprint.py --subject derrick --out /tmp/bp-derrick.json
    python3 scripts/tools/llm-gen-blueprint.py --subject tanker  --out /tmp/bp-tanker.json
"""
import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

KIMI_K3_MODEL = "moonshotai/kimi-k3"

SUBJECTS = {
    "derrick": (
        "un DERRICK PETROLIER (tour de forage) en elevation technique : mat/derrick treillis, "
        "couronne et moufle en tete, table de rotation, plancher de forage, train de tiges qui "
        "descend sous le niveau du sol jusqu'a un reservoir de petrole souterrain. Ligne de sol "
        "marquee. Composants nommes (labels) et au moins 3 cotes de mesure (fleches double-sens + valeur)."
    ),
    "tanker": (
        "un PETROLIER (navire tanker) en coupe longitudinale technique (vue de profil) : coque, "
        "citernes/cuves separees par cloisons, ligne de flottaison, pont, chateau/passerelle a l'arriere, "
        "helice. Composants nommes (labels) et au moins 3 cotes de mesure (longueur hors-tout, tirant d'eau, "
        "hauteur de coque)."
    ),
}

PROMPT_TMPL = r"""
Tu es un generateur de SCHEMA BLUEPRINT technique SVG, registre "plan d'ingenieur" premium.

REGISTRE VISUEL :
- Fond navy #16213a (deja pose par le code : NE dessine PAS de rectangle de fond plein).
- Traits de construction FINS, wireframe (pas de gros aplats pleins) : structure en ivoire #f2efe6 et
  cyan clair #7fb2d9, strokeWidth entre 1 et 2.
- Cotes de mesure, fleches, valeurs chiffrees et LABELS de composants en OR #c8a951 (police monospace,
  fontSize 13 a 18). Chaque cote = une ligne fine + petits traits d'about + une valeur (ex "42 m").
- Grille de fond technique DISCRETE (lignes tres faibles, opacity ~0.06) optionnelle.
- Cartouche/cadre technique en bas a droite (petit rectangle avec 1-2 lignes de texte : titre du plan + echelle).

CONTRAINTES TECHNIQUES STRICTES (non negociables) :
- viewBox de reference : 0 0 1600 900. Tout le contenu tient dedans avec des marges (~80px).
- Rendu React/Remotion : UNIQUEMENT des elements SVG (path, line, rect, circle, polygon, polyline, ellipse,
  text, g) avec attributs statiques OU dependant de la variable `f` (numero de frame, 30fps).
- ANIMATION "plan qui se dessine" OBLIGATOIRE : les traits principaux de structure s'affichent par un trace
  progressif via strokeDasharray + strokeDashoffset pilote par `f`. Exemple valide :
  strokeDasharray="600" strokeDashoffset={Math.max(0, 600 - f * 12)}. Les labels/cotes peuvent apparaitre
  en fondu (opacity fonction de f) une fois leur trait trace. Trace lisible, non stroboscopique (le plan est
  entierement dessine vers f=70-90 puis reste stable).
- Pour animer, syntaxe JSX inline `{expression}` dans les attributs. ZERO CSS animation, ZERO @keyframes,
  ZERO setTimeout, ZERO requestAnimationFrame.
- Accents francais OK dans les <text> (labels lisibles). Pas d'emoji.

SUJET DU PLAN : {SUBJECT}

REPONDS EN JSON STRICT (et rien d'autre) :
{{
  "svg": "<g>...tout le contenu SVG (structure + cotes + labels + cartouche)...</g>",
  "notes": "remarques sur la structure, l'ordre de trace anime, les cotes choisies"
}}
"""


def gen(subject: str, out: Path):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    prompt = PROMPT_TMPL.replace("{SUBJECT}", SUBJECTS[subject])
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"model": KIMI_K3_MODEL, "messages": [{"role": "user", "content": prompt}]}
    print(f"[blueprint:{subject}] calling {KIMI_K3_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=900)
    r.raise_for_status()
    data = r.json()
    text = data["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    usage = data.get("usage", {})
    print(f"[blueprint:{subject}] Saved: {out}  ({len(text)} chars)  usage={usage}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--subject", required=True, choices=list(SUBJECTS.keys()))
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    gen(args.subject, out)


if __name__ == "__main__":
    main()
