"""
gazoduc-svg-inserts-gen.py — genere les 2 inserts SVG narratifs de l'Acte 2 Gazoduc via 4 modeles
(comparatif, mix-and-match ensuite par Aziz). Pattern d'appel repris de llm-gen-svg.py (memes 4
providers, memes gotchas Kimi K3), brief specifique aux 2 scenes decidees en session 2026-08-04.

Regle n0 (SVG-SCENES-GENERATIVES.md) : le modele dessine un SVG STATIQUE decoupe en <g id> nommes,
JAMAIS l'animation — c'est nous qui animons ensuite en frame-driven Remotion.

Usage :
    python3 scripts/tools/gazoduc-svg-inserts-gen.py --scene signature --provider gemini --out /tmp/x.json
    python3 scripts/tools/gazoduc-svg-inserts-gen.py --scene financement --provider kimi --out /tmp/y.json
"""
import argparse
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.6-sol"  # remplace gpt-5.5 pour decor/scene riche (memory/tools/openrouter-svg.md)
GLM_MODEL = "z-ai/glm-5.2"
KIMI_K3_MODEL = "moonshotai/kimi-k3"

COMMON_HEADER = r"""
Tu es un illustrateur SVG pour une chaine YouTube geopolitique/economique francaise premium
("Souverain"/"Kora et Cartes"). Tu dessines une SCENE STATIQUE COMPLETE, PAS d'animation — nous
animons ensuite le dessin cote code (Remotion, frame-driven). Ton seul travail : composer une scene
riche, DECOUPEE EN GROUPES NOMMES <g id="..."> pour qu'on puisse les animer separement ensuite.

CONTRAINTES TECHNIQUES STRICTES (non negociables) :
- viewBox="0 0 1920 1080" (format 16:9).
- SVG STATIQUE uniquement — ZERO attribut anime, ZERO JS inline, ZERO CSS animation/@keyframes.
- Chaque element narratif important est un <g id="nom_explicite"> distinct et adressable.
- Palette bleu-marine (#182746 fond, #2a3f66/#3a5488 variantes) + dore (#FFC742) — coherent avec le
  reste de la video (carte D3 du meme episode). Encre neutre/pale par defaut ; UNE seule touche de
  couleur (doree) reservee au geste climax de la scene, pas de couleur partout.
- ZERO texte a l'ecran dans le SVG (le texte sera ajoute cote code si besoin).
- ZERO visage/portrait figuratif humain detaille (registre symbolique, pas de personnage rigge).
- Registre "gravure/encre premium" — traits nets, pas de degrade photo-realiste, pas de style cartoon.
"""

SCENES = {
    "signature": COMMON_HEADER + r"""
SCENE A DESSINER : "Genese 2016 + Signature du traite 19 juillet 2026" (insert d'ouverture, ~30s
d'ecran, avant que la carte du gazoduc n'apparaisse).

Le texte narre a ce moment (pour contexte, ne pas afficher a l'ecran) : "C'est un vieux reve qui
remonte a 2016 — l'annee ou le roi Mohammed VI et le president nigerian Muhammadu Buhari posent
ensemble la premiere pierre symbolique d'un projet [...]. Le 19 juillet 2026, a Freetown, en Sierra
Leone, quinze chefs d'Etat ouest-africains signent officiellement un accord."

GESTE CENTRAL DEMANDE (le mouvement qui portera tout le sens, a composer visuellement meme si tu ne
l'animes pas) : UN TAMPON/SCEAU OFFICIEL qui se pose sur un document — inspire du geste "tampon qui
tombe par gravite" deja valide sur une autre video du projet (Franc CFA, scene de signature 1994).
Prevois EXPLICITEMENT dans ta composition :
1. Un groupe <g id="rappel_2016"> : une representation SYMBOLIQUE bref (PAS de visages) de l'idee
   "deux mains/silhouettes qui se serrent" ou "une premiere pierre posee" — reste tres discret,
   en second plan, encre pale uniquement.
2. Un groupe <g id="document"> : un document/parchemin stylise, plat, au centre de la composition.
3. Un groupe <g id="tampon"> : le tampon/sceau lui-meme, positionne AU-DESSUS du document (pret a
   descendre — nous animerons la chute), avec un cercle/anneau doré qui sera son motif de sceau.
4. Un groupe <g id="halo_sceau"> : un halo/glow doré (sans filter:blur — utilise plusieurs cercles
   concentriques en opacite decroissante) autour du point d'impact du tampon, pour le moment climax.
5. Un decor MINIMAL (pas de carte, pas de geographie) : peut-etre une table/bureau stylise en encre,
   rien de plus — la scene doit rester epuree, le tampon+document sont les vedettes.

Reponds en JSON strict, forme :
{
  "scene_svg": "<svg viewBox=\"0 0 1920 1080\">...tous les <g id> ici...</svg>",
  "groups": ["rappel_2016", "document", "tampon", "halo_sceau", "decor"],
  "notes": "remarques sur les choix de composition, points d'ancrage pour l'animation (ex: position exacte du tampon avant/apres la chute)"
}
""",
    "financement": COMMON_HEADER + r"""
SCENE A DESSINER : "Financement manquant + tuyaux virtuels + Mauritanie qui ne signe pas" (insert de
cloture du beat AAGP, ~25-30s d'ecran, apres que la carte a montre le trace + la traversee europeenne).

Le texte narre a ce moment (pour contexte, ne pas afficher a l'ecran) : "Personne n'a encore sorti le
chequier. A ce jour, il n'y a aucune decision finale d'investissement [...]. Pour que le trace
fonctionne, il faut l'accord formel de pays comme la Mauritanie [...]. C'est un projet seduisant,
diplomatiquement tres mur... mais dont les tuyaux restent, pour l'instant, VIRTUELS."

GESTE CENTRAL DEMANDE (le mouvement qui portera tout le sens, a composer visuellement meme si tu ne
l'animes pas) : UN TRACE DE PIPELINE EN POINTILLES qui tente de se solidifier et s'arrete net — la
ligne reste grise/pointillee, jamais pleine. Prevois EXPLICITEMENT dans ta composition :
1. Un groupe <g id="trace_pointille"> : un tuyau/trace stylise en pointilles (PAS une vraie carte
   geographique — un schema/diagramme abstrait, une ligne qui serpente legerement de gauche a droite),
   qui semble vouloir se solidifier a un endroit precis mais reste en pointilles au-dela.
2. Un groupe <g id="jauge_financement"> : une jauge ou une pile de pieces/jetons empiles qui
   represente le financement — DOIT pouvoir "lacher"/s'effondrer visuellement (une piece en haut de
   la pile plus grande/distincte que les autres, prete a tomber ou a manquer).
3. Un groupe <g id="jeton_mauritanie"> : un jeton/marqueur distinct (cercle simple, PAS un drapeau)
   positionne SUR le trace pointille a l'endroit ou il s'arrete, qui doit pouvoir rester visuellement
   "grise/inerte" pendant qu'un autre element (si tu en ajoutes) serait illumine.
4. Un groupe <g id="halo_incertitude"> : un halo/glow discret (pas de filter:blur, cercles concentriques
   en opacite decroissante) autour du point ou le trace s'arrete, pour signaler la zone d'incertitude.
5. Decor MINIMAL, encre neutre — pas de vraie carte geographique, un diagramme/schema epure.

Reponds en JSON strict, forme :
{
  "scene_svg": "<svg viewBox=\"0 0 1920 1080\">...tous les <g id> ici...</svg>",
  "groups": ["trace_pointille", "jauge_financement", "jeton_mauritanie", "halo_incertitude", "decor"],
  "notes": "remarques sur les choix de composition, points d'ancrage pour l'animation (ex: coordonnees exactes ou le trace s'arrete, ou se trouve la piece qui doit lacher)"
}
""",
}


def gen_gemini(prompt: str, out: Path):
    from google import genai
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY missing"); sys.exit(1)
    client = genai.Client(api_key=key)
    print(f"Generating SVG insert with {GEMINI_MODEL}...")
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
    print(f"Generating SVG insert with {GPT_MODEL} via OpenRouter...")
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
    print(f"Generating SVG insert with {GLM_MODEL} via OpenRouter...")
    r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=600)
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]
    out.write_text(text, encoding="utf-8")
    print(f"[glm] Saved raw: {out}  ({len(text)} chars)")


def gen_kimi(prompt: str, out: Path):
    # ⚠️ Kimi K3 : borner reasoning.max_tokens + max_tokens, sinon content=None (memory/tools/kimi-k3-reasoning-borne.md)
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
    print(f"Generating SVG insert with {KIMI_K3_MODEL} via OpenRouter...")
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
