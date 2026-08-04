"""
gazoduc-svg-inserts-gen-libre.py — variante "liberte creative" de gazoduc-svg-inserts-gen.py,
testee sur les 4 modeles externes (Gemini/GPT/GLM/Kimi) pour comparer avec Fable 5 (deja genere
en agent, prompt identique retrouve verbatim dans la session du 2026-08-04).

Meme pattern d'appel/gotchas que gazoduc-svg-inserts-gen.py — seul le brief change (registre +
exigence narrative + interdits, SANS dicter les 5 groupes <g id> a dessiner).

Usage :
    python3 scripts/tools/gazoduc-svg-inserts-gen-libre.py --scene signature --provider gemini --out /tmp/x.svg
    python3 scripts/tools/gazoduc-svg-inserts-gen-libre.py --scene financement --provider kimi --out /tmp/y.svg
"""
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.6-sol"
GLM_MODEL = "z-ai/glm-5.2"
KIMI_K3_MODEL = "moonshotai/kimi-k3"

COMMON_HEADER = r"""Tu es un illustrateur SVG pour une chaîne YouTube géopolitique/économique française premium ("Souverain"/"Kora et Cartes"). Tu dessines une SCÈNE STATIQUE COMPLÈTE, PAS d'animation — l'animation sera codée séparément ensuite en Remotion (frame-driven). Ton travail : composer une scène riche qui PORTE LE SENS suivant, découpée en groupes nommés `<g id="...">` adressables pour qu'on puisse l'animer ensuite.

CONTRAINTES TECHNIQUES STRICTES (non négociables) :
- viewBox="0 0 1920 1080" (format 16:9).
- SVG STATIQUE uniquement — ZÉRO attribut animé, ZÉRO JS inline, ZÉRO CSS animation/@keyframes, ZÉRO filter:blur.
- Chaque élément narratif important est un `<g id="nom_explicite">` distinct et adressable.
- Palette bleu-marine (#182746 fond, #2a3f66/#3a5488 variantes) + doré (#FFC742) — cohérent avec le reste de la vidéo (une carte D3 du même épisode utilise déjà cette palette).
- Encre neutre/pâle par défaut ; réserve une ou deux touches de couleur dorée pour le moment le plus important de la scène, pas de couleur partout.
- ZÉRO texte à l'écran dans le SVG.
- ZÉRO visage/portrait figuratif humain détaillé (registre symbolique, pas de personnage riggable).
- Registre "gravure/encre premium" — traits nets, pas de dégradé photo-réaliste, pas de style cartoon.

"""

SCENES = {
    "signature": COMMON_HEADER + r"""CONTEXTE NARRATIF (le texte narré à ce moment de la vidéo, pour que tu comprennes ce qui se joue) : "C'est un vieux rêve qui remonte à 2016 — l'année où le roi Mohammed VI et le président nigérian Muhammadu Buhari posent ensemble la première pierre symbolique d'un projet [...]. Le 19 juillet 2026, à Freetown, en Sierra Leone, quinze chefs d'État ouest-africains signent officiellement un accord."

L'EXIGENCE NARRATIVE (le sens que la scène doit porter, à toi de choisir COMMENT le représenter) : cette scène ouvre l'Acte 2 d'une vidéo sur la rivalité de deux méga-projets de gazoducs africains. Le spectateur vient de voir un globe 3D animé (Acte 1) et va ensuite voir une carte géographique qui trace le pipeline physique (le reste de l'Acte 2). CETTE scène-ci, elle, doit faire comprendre au spectateur qu'un ENGAGEMENT POLITIQUE/DIPLOMATIQUE a été formalisé — quelque chose qui existe sur le papier, dans les intentions et les signatures, mais pas encore dans le monde physique. C'est un moment d'OFFICIALISATION, presque solennel, qui contraste avec la carte vivante qui suivra. Tu as la liberté totale de choisir QUEL geste visuel représente le mieux cette idée — un tampon qui se pose est UNE possibilité parmi d'autres, pas une contrainte. Compose la scène qui, selon TON jugement créatif, rend cette idée le plus fort possible dans notre registre visuel.

Une fois ta scène composée, explique-nous en 3-4 phrases POURQUOI tu as fait ces choix précis (quel geste central tu as choisi et pourquoi, comment la composition raconte l'histoire).

Réponds avec le SVG complet dans un bloc de code, suivi de ton explication.
""",
    "financement": COMMON_HEADER + r"""CONTEXTE NARRATIF (le texte narré à ce moment de la vidéo, pour que tu comprennes ce qui se joue) : "Personne n'a encore sorti le chéquier. À ce jour, il n'y a aucune décision finale d'investissement [...]. Pour que le tracé fonctionne, il faut l'accord formel de pays comme la Mauritanie [...]. C'est un projet séduisant, diplomatiquement très mûr… mais dont les tuyaux restent, pour l'instant, VIRTUELS."

L'EXIGENCE NARRATIVE (le sens que la scène doit porter, à toi de choisir COMMENT le représenter) : cette scène clôt l'Acte 2 d'une vidéo sur la rivalité de deux méga-projets de gazoducs africains. Le spectateur vient de voir, juste avant cette scène, une carte géographique vivante où le pipeline se traçait physiquement à travers plusieurs pays jusqu'en Europe. CETTE scène-ci, elle, doit faire ressentir un RETOUR BRUTAL À LA RÉALITÉ : malgré tout ce qui vient d'être montré (le tracé, l'ambition), le projet n'est encore qu'une INTENTION — l'argent n'est pas là, un pays clé n'a pas signé, tout reste suspendu/virtuel. C'est un moment de DOUTE, presque un dégonflement après l'élan de la carte qui vient de se dessiner. Tu as la liberté totale de choisir QUEL geste visuel représente le mieux cette idée — un tracé pointillé qui s'arrête est UNE possibilité parmi d'autres, pas une contrainte. Compose la scène qui, selon TON jugement créatif, rend cette idée le plus fort possible dans notre registre visuel.

Une fois ta scène composée, explique-nous en 3-4 phrases POURQUOI tu as fait ces choix précis (quel geste central tu as choisi et pourquoi, comment la composition raconte l'histoire).

Réponds avec le SVG complet dans un bloc de code, suivi de ton explication.
""",
}


def gen_gemini(prompt: str, out: Path):
    from google import genai
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
    client = genai.Client(api_key=key)
    print(f"Generating SVG insert (libre) with {GEMINI_MODEL}...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=[prompt])
    text = resp.candidates[0].content.parts[0].text
    out.write_text(text, encoding="utf-8")
    print(f"Saved raw: {out}  ({len(text)} chars)")


def gen_gpt(prompt: str, out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": prompt}]}
    print(f"Generating SVG insert (libre) with {GPT_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"Saved raw: {out}  ({len(text)} chars)")


def gen_glm(prompt: str, out: Path):
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {"model": GLM_MODEL, "messages": [{"role": "user", "content": prompt}]}
    print(f"Generating SVG insert (libre) with {GLM_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"[glm] Saved raw: {out}  ({len(text)} chars)")


def gen_kimi(prompt: str, out: Path):
    # borner reasoning.max_tokens + max_tokens, sinon content=None (memory/tools/kimi-k3-reasoning-borne.md)
    import requests
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        print("ERROR: OPENROUTER_API_KEY missing"); sys.exit(1)
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": KIMI_K3_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 16000,
        "reasoning": {"max_tokens": 2000},
    }
    print(f"Generating SVG insert (libre) with {KIMI_K3_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=900)
    r.raise_for_status()
    data = r.json()
    text = data["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    usage = data.get("usage", {})
    print(f"[kimi-k3] Saved raw: {out}  ({len(text)} chars)  usage={usage}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scene", required=True, choices=list(SCENES.keys()))
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt", "glm", "kimi"])
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    prompt = SCENES[args.scene]
    if args.provider == "gemini":
        gen_gemini(prompt, out)
    elif args.provider == "glm":
        gen_glm(prompt, out)
    elif args.provider == "kimi":
        gen_kimi(prompt, out)
    else:
        gen_gpt(prompt, out)


if __name__ == "__main__":
    main()
