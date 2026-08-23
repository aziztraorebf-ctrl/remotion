"""
llm-gen-3d.py — genere un OBJET 3D (composant React Three Fiber) via un LLM.

Pendant 3D de `llm-gen-svg.py`. Meme principe : le modele produit la GEOMETRIE
statique d'un objet, NOUS l'animons ensuite en frame-driven cote Remotion.

Origine (2026-08-23) : reverse engineering du workflow CapCut de Danny Why, qui
fait generer une cle 3D Three.js par Fable puis l'importe en video. Test maison :
Fable (mode eleve) produit un objet nettement superieur a une geometrie ecrite a
la main. Question ouverte -> les AUTRES modeles savent-ils le faire aussi ?
Si oui, le "3D genere" devient un registre a part entiere avec son paysage de
modeles, comme le SVG.

Le contrat est identique pour tous les modeles (test equitable) :
  - un seul composant React nomme `KeyModel` (ou --objet), props {rotationY, scale}
  - AUCUNE animation interne, AUCUN Canvas, AUCUNE lumiere, AUCUN fichier externe
  - geometrie 100% procedurale, deterministe (pas de Math.random / Date.now)

Usage :
    python3 scripts/tools/llm-gen-3d.py --provider gemini --out src/.../KeyModelGemini.tsx
    python3 scripts/tools/llm-gen-3d.py --provider all --outdir src/.../keys/

Providers : gemini | gpt | glm | kimi | grok | all
"""
import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

# --- Modeles (identifiants verrouilles par CLAUDE.md — ne pas improviser) -----
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"
GLM_MODEL = "z-ai/glm-5.2"
KIMI_K3_MODEL = "moonshotai/kimi-k3"
GROK_MODEL = "x-ai/grok-4.6"

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# --- Le brief : STRICTEMENT le meme pour tous ------------------------------
BRIEF = r"""Tu dois produire UN composant React Three Fiber modelisant un objet 3D ornemental.

## Livrable
UN fichier .tsx exportant UN composant React nomme `KeyModel`, rien d'autre.

```tsx
export const KeyModel: React.FC<{ rotationY: number; scale: number }> = ({ rotationY, scale }) => { ... }
```

## Contraintes DURES
- Le composant retourne UNIQUEMENT un `<group>` JSX de react-three-fiber contenant la geometrie.
- INTERDIT : `<Canvas>`, `<ThreeCanvas>`, lumieres, camera, fond, environnement.
  L'objet sera insere dans une scene existante qui fournit deja tout cela.
- INTERDIT : toute animation interne. Pas de `useFrame`, pas de `useState`, pas de
  `useEffect`, pas de `Date.now()`, pas de `Math.random()`. La rotation vient de la
  prop `rotationY`. L'animation est faite en aval par l'appelant.
- INTERDIT : chargement de fichier externe (pas de GLTFLoader, pas de texture, pas
  de staticFile). Geometrie 100% procedurale.
- Imports autorises : `react`, `three`, `@react-three/drei`. Rien d'autre.
- Le `<group>` racine doit appliquer `rotation={[0, rotationY, <ton inclinaison>]}`
  et `scale={[scale, scale, scale]}`.
- ZERO EMOJI dans le code. Commentaires en anglais sans accents.
- TypeScript strict : pas de `any`, pas de `as unknown`, pas de `@ts-ignore`.
- Mets en cache toute geometrie construite a la main avec `useMemo`.

## L'objet
Une cle de porte ancienne, ornementale, en OR — le genre d'objet qui ouvre un coffre
ancien ou une porte de manoir. Elle doit avoir l'air PRECIEUSE et TRAVAILLEE, pas
industrielle.

Verticale, tete en haut, dents en bas. Hauteur totale environ 3.2 unites, centree
sur l'origine (l'objet doit tenir dans une boite d'environ 1.2 de large).

Ce qui separe une belle cle d'une cle banale :
- **La tete** : c'est la ou se joue le caractere. Anneau ouvrage, motif ajoure,
  volutes, quadrilobe, entrelacs — a toi de choisir. C'est la piece maitresse.
- **La tige** : rarement un simple cylindre lisse. Bagues, moulures, changements de
  section, torsade, collerettes.
- **Le panneton** (les dents) : une vraie decoupe avec creux et refends, pas deux
  boites collees.
- **Les proportions** : une cle ancienne a une tete genereuse par rapport a la tige.

## Materiau
Or poli : `metalness` eleve, `roughness` bas, via `meshStandardMaterial`. Tu peux
varier legerement le materiau entre les parties si cela sert le rendu.

## CONTRAINTE DE LISIBILITE (critere n1 de reussite)
L'objet sera vu de FACE et en LEGER TROIS-QUARTS uniquement (rotationY oscille entre
-0.2 et +1.1 radians). Il ne fera JAMAIS un tour complet.

La cle doit rester RECONNAISSABLE comme une cle sur TOUTE cette plage. Le piege
connu : si la tete est un simple tore dans le plan de la tige, alors de face l'anneau
se confond avec la tige et l'objet se lit comme un TOURNEVIS. Concois la tete pour
qu'elle presente toujours une silhouette large et lisible de face ET de trois-quarts.

## Rendu attendu
Un objet qu'on croirait modelise a la main par un artiste 3D, pas un assemblage de
primitives evidentes. Utilise `LatheGeometry`, `ExtrudeGeometry`, `Shape`,
`TubeGeometry`, `TorusGeometry` quand cela sert.

Reponds UNIQUEMENT avec le code du fichier .tsx complet, sans texte autour, sans
bloc markdown.
"""


def strip_fences(txt: str) -> str:
    """Retire un eventuel bloc markdown autour du code."""
    txt = txt.strip()
    m = re.search(r"```(?:tsx|typescript|ts|jsx)?\s*\n(.*?)```", txt, re.S)
    if m:
        return m.group(1).strip()
    return txt


def call_gemini() -> str:
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY absente")
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={key}"
    )
    payload = {
        "contents": [{"parts": [{"text": BRIEF}]}],
        "generationConfig": {"temperature": 0.9, "maxOutputTokens": 32000},
    }
    r = requests.post(url, json=payload, timeout=600)
    r.raise_for_status()
    data = r.json()
    parts = data["candidates"][0]["content"]["parts"]
    return "".join(p.get("text", "") for p in parts)


def call_openrouter(model: str, extra: dict | None = None) -> str:
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        raise RuntimeError("OPENROUTER_API_KEY absente")
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": BRIEF}],
        "max_tokens": 32000,
    }
    if extra:
        payload.update(extra)
    r = requests.post(
        OPENROUTER_URL,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json=payload,
        timeout=900,
    )
    r.raise_for_status()
    data = r.json()
    msg = data["choices"][0]["message"]
    content = msg.get("content")
    if not content:
        raise RuntimeError(
            f"{model} a rendu content vide "
            f"(reasoning={bool(msg.get('reasoning'))}) — voir kimi-k3-reasoning-borne.md"
        )
    return content


PROVIDERS = {
    "gemini": call_gemini,
    "gpt": lambda: call_openrouter(GPT_MODEL),
    "glm": lambda: call_openrouter(GLM_MODEL),
    # Kimi K3 : borner le reasoning, sinon content=null (memory/tools/kimi-k3-reasoning-borne.md)
    "kimi": lambda: call_openrouter(
        KIMI_K3_MODEL, {"reasoning": {"max_tokens": 2000}, "max_tokens": 16000}
    ),
    "grok": lambda: call_openrouter(GROK_MODEL),
}


def generate(provider: str, out_path: Path) -> dict:
    t0 = time.time()
    try:
        raw = PROVIDERS[provider]()
        code = strip_fences(raw)
        if "export const KeyModel" not in code:
            return {
                "provider": provider,
                "ok": False,
                "erreur": "pas d'export KeyModel dans la reponse",
                "secondes": round(time.time() - t0, 1),
            }
        out_path.write_text(code)
        return {
            "provider": provider,
            "ok": True,
            "fichier": str(out_path),
            "lignes": len(code.splitlines()),
            "secondes": round(time.time() - t0, 1),
        }
    except Exception as e:  # noqa: BLE001 — on veut le rapport, pas un crash
        return {
            "provider": provider,
            "ok": False,
            "erreur": f"{type(e).__name__}: {e}"[:300],
            "secondes": round(time.time() - t0, 1),
        }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--provider", required=True, choices=[*PROVIDERS.keys(), "all"]
    )
    ap.add_argument("--out", help="fichier .tsx de sortie (provider unique)")
    ap.add_argument("--outdir", help="dossier de sortie (--provider all)")
    args = ap.parse_args()

    if args.provider == "all":
        if not args.outdir:
            print("--outdir requis avec --provider all", file=sys.stderr)
            return 2
        outdir = Path(args.outdir)
        outdir.mkdir(parents=True, exist_ok=True)
        rapport = []
        for prov in PROVIDERS:
            dest = outdir / f"KeyModel{prov.capitalize()}.tsx"
            res = generate(prov, dest)
            rapport.append(res)
            etat = "OK " if res["ok"] else "ECHEC"
            detail = (
                f"{res.get('lignes')} lignes"
                if res["ok"]
                else res.get("erreur", "")[:110]
            )
            print(f"[{etat}] {prov:7} {res['secondes']:6.1f}s  {detail}", flush=True)
        (outdir / "_rapport-generation.json").write_text(
            json.dumps(rapport, indent=2, ensure_ascii=False)
        )
        return 0

    if not args.out:
        print("--out requis", file=sys.stderr)
        return 2
    res = generate(args.provider, Path(args.out))
    print(json.dumps(res, indent=2, ensure_ascii=False))
    return 0 if res["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
