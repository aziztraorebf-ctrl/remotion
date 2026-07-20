"""
svg-personnage-gen.py — TEST R&D piste 1 (2026-06-30) : generer le CODE SVG d'un personnage d'encre articule.

But : comparer 3 modeles (GLM-5.2, GPT-5.5, Gemini 3.1 Pro) sur leur capacite a produire un COMPOSANT SVG
React/Remotion du planteur de cacao, articule et anime par props frame-driven, dans NOTRE registre encre.
On compare ensuite au PlanteurEncre.tsx actuel (squelette minimal) pour decider : SVG genere vs redessin manuel.

Usage :
    python3 scripts/tools/svg-personnage-gen.py --provider glm    --out /tmp/.../perso-glm.txt
    python3 scripts/tools/svg-personnage-gen.py --provider gpt    --out /tmp/.../perso-gpt.txt
    python3 scripts/tools/svg-personnage-gen.py --provider gemini --out /tmp/.../perso-gemini.txt

GLM = text-only (la planche est decrite dans le prompt). GPT + Gemini recoivent la planche en image.
"""
import argparse
import base64
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"
GLM_MODEL = "z-ai/glm-5.2"

REF_PNG = ROOT / "public/_shared/refs/personnages/planteur-cacao-charsheet-GEMINI.png"

PROMPT = r"""
Tu generes le CODE d'un COMPOSANT React/Remotion (TypeScript) representant un PLANTEUR DE CACAO dessine
comme une SILHOUETTE D'ENCRE STYLISEE facon pictogramme (style "stick figure" digne, traits epais et fluides) —
PAS un humain realiste/detaille. C'est une chaine de documentaire economique africain, registre encre/parchemin.

REGISTRE VISUEL EXACT (a respecter) :
- Trait encre couleur #2b2117, traits epais et arrondis (strokeLinecap="round", strokeLinejoin="round").
- Chapeau de paille : remplissage paille #d1b46b, bord plus fonce #c39a4f, contour encre.
- Fond suppose clair (parchemin), pas de fond dans le composant.
- Reference : un personnage-baton expressif type "stickman" mais avec une EPAISSEUR de trait qui lui donne
  de la dignite (pas des batons fins). Tete = cercle. Corps/membres = paths epais.

CE QUI MANQUE AU SQUELETTE ACTUEL (et qu'on veut) : des ARTICULATIONS INTERMEDIAIRES.
Le rig doit avoir : bassin, torse, tete, DEUX bras avec COUDE (epaule->coude->main), DEUX jambes avec GENOU
(hanche->genou->pied). Donc chaque membre = 2 segments articules, pas un seul segment droit.

ANIMATION = par PROPS uniquement (le parent passe la frame ; ZERO logique de frame, ZERO hook, ZERO CSS,
ZERO setTimeout/@keyframes/requestAnimationFrame dans ce composant). Props attendues :
  walkPhase?: number   // phase continue de marche (le parent passe typiquement la frame) -> balancier jambes+bras
  bend?: number        // 0 debout .. 1 penche en avant (recolte au sol), flexion a la hanche
  armReach?: number    // 0..1 extension du bras avant vers le sol (geste de ramasser une cabosse)
  facing?: 1 | -1       // direction du regard/marche
Les angles des articulations (coude, genou) doivent varier de facon COHERENTE avec walkPhase/bend/armReach :
une vraie marche (genou qui plie en phase), un vrai penche (torse + genoux qui flechissent), un vrai geste de
recolte (epaule + coude qui s'etendent vers le sol). Mouvement LENT et lisible, jamais stroboscopique.

ECHELLE : origine (0,0) au niveau du SOL entre les pieds. Le personnage monte vers les y negatifs (tete vers
le haut). Hauteur totale debout ~360 unites (comme le composant actuel : hanche ~ y=-150, tete ~ y=-330).

SORTIE : reponds UNIQUEMENT avec le code TypeScript complet du composant (un seul export nomme PlanteurEncreV2),
pret a coller dans un .tsx, sans aucune explication avant/apres, sans bloc markdown ```. Importe React.
Le composant retourne un <g> (il sera place dans un <svg> parent). Commente brievement les choix d'articulation.
"""


def gen_gemini(out: Path):
    from google import genai
    from google.genai import types
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
    client = genai.Client(api_key=key)
    img_bytes = REF_PNG.read_bytes()
    print(f"[gemini] {GEMINI_MODEL} + ref image ({len(img_bytes)} bytes)...")
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[
            types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
            PROMPT,
        ],
    )
    text = resp.candidates[0].content.parts[0].text
    out.write_text(text, encoding="utf-8")
    print(f"[gemini] Saved: {out} ({len(text)} chars)")


def _openrouter(model: str, with_image: bool, out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    if with_image:
        b64 = base64.b64encode(REF_PNG.read_bytes()).decode()
        content = [
            {"type": "text", "text": PROMPT},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}},
        ]
    else:
        content = PROMPT
    payload = {"model": model, "messages": [{"role": "user", "content": content}]}
    print(f"[{model}] via OpenRouter (image={with_image})...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"[{model}] Saved: {out} ({len(text)} chars)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt", "glm"])
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.provider == "gemini":
        gen_gemini(out)
    elif args.provider == "gpt":
        _openrouter(GPT_MODEL, with_image=True, out=out)
    else:  # glm = text-only
        _openrouter(GLM_MODEL, with_image=False, out=out)


if __name__ == "__main__":
    main()
