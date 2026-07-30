"""
kimi-vision-fill-scene.py — TEST VISION CREATIVE de Kimi K3 (via OpenRouter).

R&D 2026-07-17 : on montre a K3 une COQUILLE NUE (carte d'etat-major sans elements narratifs, image PNG)
+ la partie du SCRIPT correspondante, et on lui demande d'INVENTER et coder en SVG les elements
(y compris la geometrie des batiments) pour raconter la scene. Test de vision + liberte creative + geometrie.

Vision : K3 accepte des images en entree (multimodal). On envoie l'image en data URL base64.
⚠️ CORRIGE 2026-07-30 : il faut AU CONTRAIRE borner `reasoning.max_tokens` (ex 2000) + max_tokens 16000 — sans borne K3 rend content=null. L'ancienne consigne "ne pas passer max_tokens" datait du 17/07 et est FAUSSE depuis. Detail : memory/tools/kimi-k3-reasoning-borne.md Timeout tres large.

Usage :
    python3 scripts/tools/kimi-vision-fill-scene.py --scene kosti    --image <coquille.png> --out <out.json>
    python3 scripts/tools/kimi-vision-fill-scene.py --scene khartoum --image <coquille.png> --out <out.json>
"""
import argparse
import base64
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

KIMI_K3_MODEL = "moonshotai/kimi-k3"

SCRIPTS = {
    "kosti": (
        "A Kosti, le 21 juin 2026, les paramilitaires (RSF) frappent avec un drone une station-service "
        "ou des civils attendaient de l'essence. Ce n'etait pas une cible militaire, mais ce sont les memes "
        "armes venues de l'etranger qui rendent une telle frappe possible, et ce sont des civils qui en payent "
        "le prix. La scene doit faire ressentir le cout civil : des gens ordinaires, une frappe, puis le vide."
    ),
    "khartoum": (
        "Khartoum, 15 avril 2023. La RSF lance une attaque coordonnee sur trois cibles strategiques en une "
        "seule matinee : la tour de la television nationale a Omdurman, le palais presidentiel, et l'aeroport "
        "international. Trois cibles, une seule matinee. Khartoum bascule dans la guerre. La scene doit montrer "
        "l'assaut simultane et methodique : les cibles, les axes d'attaque depuis les positions RSF, les impacts, "
        "la prise de controle."
    ),
}

PROMPT_TMPL = r"""
Tu es a la fois DIRECTEUR ARTISTIQUE et developpeur SVG pour une chaine de cartographie geopolitique
premium. Registre visuel : "carte d'etat-major" gravee, vue strictement du dessus (top-down, JAMAIS de 3D
en perspective/isometrie). Palette imposee : fond sable #d9c092, or #e7bd78 et #c7a977, rouge encre #8a2a20
et #4a1f18, ivoire #f2ebd9, traits fins #2b2117.

IMAGE JOINTE : une CARTE DE SITUATION VIDE (le decor seul : cadre, grille, terrain, routes, reperes).
Observe attentivement son style, sa palette, l'echelle de sa grille, la position de ses routes et de son cadre.

TA MISSION : a partir du SCRIPT de la scene (ci-dessous), tu INVENTES et tu DESSINES en SVG tous les
elements narratifs qui doivent apparaitre PAR-DESSUS cette carte pour raconter la scene. Cela inclut la
GEOMETRIE des batiments / installations / objets : ils ne sont PAS dans l'image, c'est TOI qui les crees
et les places (vue du dessus, graves au trait, dans la palette). Compose comme un vrai plan militaire :
- les lieux/cibles (batiments vus du dessus, dessines par toi, avec leur label en cartouche),
- les forces / pions / jetons (civils ou militaires selon la scene),
- les fleches de manoeuvre (jamais decoratives : elles vont d'une origine a une cible),
- les impacts / ondes de choc / fumee si la scene le demande,
- les labels, la date, les cotes eventuelles.
Tu as la LIBERTE CREATIVE de la mise en scene (ou tu places quoi, l'ordre d'apparition, le rythme).

CONTRAINTES TECHNIQUES (non negociables) :
- Coordonnees en PIXELS ABSOLUS dans un viewBox 0 0 1920 1080. NE redessine PAS le fond (il est deja pose) :
  tu produis uniquement la COUCHE qui se pose par-dessus. Aligne-toi sur les routes/reperes visibles.
- Elements SVG uniquement (path, line, rect, circle, polygon, polyline, ellipse, text, g). Rendu React/Remotion.
- ANIMATION : tu PEUX (et devrais) animer l'apparition via la variable `f` (numero de frame, 30fps) en syntaxe
  JSX inline `{expression}` dans les attributs. Ex : opacity={Math.min(1, Math.max(0,(f-30)/15))} ,
  strokeDashoffset={Math.max(0, 200 - f*8)} pour un trace progressif. Cycles lents, non stroboscopiques.
  ZERO CSS animation, ZERO @keyframes, ZERO setTimeout, ZERO requestAnimationFrame.
- Accents francais OK et attendus dans les <text> (labels lisibles). Pas d'emoji.
- Reste dans la palette. Premium, lisible, grave. Pense "un seul plan qui se revele".

SCRIPT DE LA SCENE :
{SCRIPT}

REPONDS EN JSON STRICT (et rien d'autre) :
{{
  "svg": "<g>...toute la couche narrative (batiments crees + pions + fleches + impacts + labels)...</g>",
  "plan": "ta note de directeur artistique : quels elements tu as invente, ou tu les as places (et pourquoi la), l'ordre et le timing d'apparition en frames"
}}
"""


def gen(scene: str, image: Path, out: Path):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    b64 = base64.b64encode(image.read_bytes()).decode("ascii")
    data_url = f"data:image/png;base64,{b64}"
    prompt = PROMPT_TMPL.replace("{SCRIPT}", SCRIPTS[scene])
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": KIMI_K3_MODEL,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": data_url}},
            ],
        }],
    }
    print(f"[vision:{scene}] calling {KIMI_K3_MODEL} (image {len(b64)//1000}KB b64) via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=1200)
    r.raise_for_status()
    resp = r.json()
    text = resp["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    usage = resp.get("usage", {})
    print(f"[vision:{scene}] Saved: {out}  ({len(text)} chars)  usage={usage}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scene", required=True, choices=list(SCRIPTS.keys()))
    ap.add_argument("--image", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    gen(args.scene, Path(args.image), out)


if __name__ == "__main__":
    main()
