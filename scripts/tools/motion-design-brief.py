#!/usr/bin/env python3
"""
motion-design-brief.py — demande a un modele un PLAN D'ANIMATION structure pour un panneau SVG
statique deja fige (pas de generation d'image : le panneau visuel est deja choisi/valide).

Different de svg-scene-abstrait.py (qui genere la COMPOSITION statique) : ce script prend le SVG
deja decide et demande COMMENT l'animer dans le temps -- sequencement, principes de motion design
(12 principes Disney adaptes au 2D/typo), ce qui bouge/quand/pourquoi, en respectant une contrainte
de rythme (rien de statique > N secondes).

Usage:
  python3 scripts/tools/motion-design-brief.py --provider gemini|gpt|kimi \
    --svg path/to/panel.svg --context "<brief narratif du panneau>" \
    --duration-s 2.8 --out /tmp/x.md
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401

import argparse
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.6-sol"
KIMI_MODEL = "moonshotai/kimi-k3"

BRIEF_TEMPLATE = """Tu es un motion designer senior specialise en animation typographique/motion
graphics 2D premium (registre publicite courte, type Bloomberg/Vox/agences motion design SaaS haut
de gamme) — PAS en animation de personnages 3D, PAS en effets cinema.

CONTRAINTE DE FORMAT NON-NEGOCIABLE : ce panneau dure {duration_s} secondes dans une publicite
verticale totale de 15.5 secondes. Le rythme doit rester DYNAMIQUE — jamais plus de 2 secondes sans
qu'un changement perceptible se produise (une entree, une transformation, un accent, un mouvement de
cadrage). Pas de plat mort, mais pas non plus de fouillis illisible : chaque mouvement doit avoir une
fonction narrative claire.

CONTEXTE DU PANNEAU (ce qu'il doit faire comprendre) :
{context}

LE SVG STATIQUE DEJA VALIDE (composition fixee, decoupee en groupes <g id="..."> nommes) :
{svg_groups_list}

SVG COMPLET (reference, pour comprendre la geometrie exacte) :
```svg
{svg_content}
```

TA TACHE : produire un PLAN D'ANIMATION detaille pour ce panneau, groupe par groupe, en t'appuyant
explicitement sur les principes de motion design pertinents (les 12 principes de Disney adaptes au
2D/typo — squash & stretch, anticipation, staging, straight-ahead vs pose-to-pose, follow-through
and overlapping action, slow in/slow out (easing), arcs, secondary action, timing, exaggeration,
solid drawing/staging, appeal — n'utilise QUE ceux qui s'appliquent reellement au 2D/typo, ignore
ceux qui sont purement 3D/personnage) ET sur les pratiques reelles de motion design premium (grandes
agences/studios de motion design editorial et publicitaire — sans nommer une marque/createur
specifique, decris la PRATIQUE).

Pour chaque groupe <g id> anime, precise :
1. QUOI bouge (quelle propriete : position, opacite, scale, stroke-dashoffset/trace, clip-path, etc.)
2. QUAND (timing relatif au debut du panneau, en secondes ou %)
3. COMMENT (quelle courbe d'easing, quel principe de motion design ca applique et POURQUOI ce choix
   sert le message — pas juste "ca bouge pour bouger")
4. Si un element necessite une GENERATION supplementaire non presente dans le SVG statique fourni
   (ex: une texture de particules a generer, un chemin de trace additionnel, un asset manquant),
   dis-le explicitement et decris precisement ce qu'il faudrait generer.

Structure ta reponse ainsi :
## Sequencement global (timeline du panneau, entree -> developpement -> sortie)
## Plan groupe par groupe
[un sous-titre par groupe <g id>, avec QUOI/QUAND/COMMENT/principe applique]
## Ce qu'il faudrait generer en plus (si applicable)
## Piege a eviter specifique a ce panneau

Sois concret et actionnable — quelqu'un doit pouvoir coder ton plan directement en Remotion
(interpolate/spring frame-driven, pas de CSS transition). Pas de generalites."""


def extract_groups(svg_content):
    import re
    ids = re.findall(r'<g[^>]*\bid="([^"]+)"', svg_content)
    return "\n".join(f"- {i}" for i in ids) if ids else "(aucun groupe id trouve)"


def build_prompt(svg_content, context, duration_s):
    return BRIEF_TEMPLATE.format(
        duration_s=duration_s,
        context=context,
        svg_groups_list=extract_groups(svg_content),
        svg_content=svg_content,
    )


def gen_gemini(prompt, out):
    from google import genai
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    print(f"[gemini] {GEMINI_MODEL} motion-design-brief ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
    out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    print(f"[gemini] saved -> {out}")


def gen_gpt(prompt, out):
    import requests
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": prompt}]}
    print(f"[gpt] {GPT_MODEL} motion-design-brief ...")
    rr = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
        json=payload, timeout=900,
    )
    if rr.status_code != 200:
        raise SystemExit(f"[gpt] HTTP {rr.status_code} : {rr.text[:500]}")
    out.write_text(rr.json()["choices"][0]["message"]["content"], encoding="utf-8")
    print(f"[gpt] saved -> {out}")


def gen_kimi(prompt, out):
    import requests
    payload = {
        "model": KIMI_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "reasoning": {"max_tokens": 2000},
        "max_tokens": 16000,
    }
    print(f"[kimi-k3] {KIMI_MODEL} motion-design-brief ...")
    rr = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
        json=payload, timeout=900,
    )
    if rr.status_code != 200:
        raise SystemExit(f"[kimi-k3] HTTP {rr.status_code} : {rr.text[:500]}")
    data = rr.json()
    if "choices" not in data:
        raise SystemExit(f"[kimi-k3] reponse sans 'choices' : {data.get('error', data)}")
    msg = data["choices"][0]["message"]
    text = msg.get("content")
    if not text:
        fr = data["choices"][0].get("finish_reason")
        raise SystemExit(f"[kimi-k3] AUCUN CONTENU (content=null). finish_reason={fr}")
    out.write_text(text, encoding="utf-8")
    print(f"[kimi-k3] saved -> {out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt", "kimi"])
    ap.add_argument("--svg", required=True)
    ap.add_argument("--context", required=True)
    ap.add_argument("--duration-s", required=True, type=float)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    svg_content = Path(a.svg).read_text(encoding="utf-8")
    prompt = build_prompt(svg_content, a.context, a.duration_s)

    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    fn = {"gemini": gen_gemini, "gpt": gen_gpt, "kimi": gen_kimi}[a.provider]
    fn(prompt, out)


if __name__ == "__main__":
    main()
