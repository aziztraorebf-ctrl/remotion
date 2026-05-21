#!/usr/bin/env python3
"""Jury creative pass 1 — Niger uranium storyboard V2.

Composition jury : GPT-4o + Grok-2-vision + Kimi K2.5 (3 LLMs).
Round A : 6 questions cibles par scene (storyboard V2).
Round B : 1 question transverse (palette globale).

Output : out/jury-niger-storyboard.json + console
Cout estime : ~$0.10
"""
import os
import sys
import json
import base64
import time
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import openai
import requests

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

env_path = PROJECT_ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip())

STORYBOARD_DIR = PROJECT_ROOT / "public" / "souverain" / "niger-uranium" / "assets" / "storyboard"
OUT_PATH = PROJECT_ROOT / "out" / "jury-niger-storyboard.json"
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)


def encode_image(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("utf-8")


CONTEXT = """CONTEXTE EPISODE :
Short YouTube vertical 1080x1920, 96s, serie "Souverain" (data-journalism geopolitique africain).
Sujet : Niger uranium vs Orano. Le Niger nationalise la Somair en juin 2025. Orano saisit le tribunal CIRDI.
Style cible : dark premium data-journalism, sobre, Le Monde Diplomatique / Bloomberg.
100% Remotion + Mapbox 3D. Zero AfterEffects, zero 3D rendering.
Symetrie d'humanisation NON-NEGOCIABLE : ne pas faire pencher la sympathie d'un cote.
Anti-piege "Niger gentil / Orano mechant".

REGLES SIGNATURE :
- Palette actuelle : fond #0a0a0a (quasi-noir), or #f5d547, niger-vert #00833D, orano-bleu #003D7A, uranium-jaune #d9b410
- Mapbox style Or Africain valide (ocean bleu profond, terre desaturee, frontieres blanches subtiles)
- Overlays Remotion : locator (gris uppercase), headline (blanc 56px), caption (rouge Plex Mono pour claim conteste)

TON ROLE :
Tu es un directeur creatif senior. L'aziz cherche des AMELIORATIONS PRECISES, pas un brainstorm.
Pour chaque question : reponds en 5-7 lignes max. Si tu valides la proposition, dis-le. Si tu proposes mieux, sois operationnel (technique precise).
"""

QUESTIONS = [
    {
        "id": "Q1_S1_HOOK",
        "frame": "s1-hook-arlit.png",
        "question": """SCENE 1 — HOOK (0-12.5s) : Carte Mapbox Niger highlight vert + pulse radar Arlit + 4 futs radioactifs flat en bas + headline "400 FUTS RADIOACTIFS".

PROPOSITION AZIZ : virer les futs Gemini, garder uniquement carte + pulse + headline overlay. Les futs sont redondants avec le texte. Carte Niger + pulse vert + headline portent l'idee.

CHALLENGE : valides-tu cette suppression ? Ou les futs apportent un punch visuel essentiel pour les 5 premieres secondes (retention TikTok/Shorts) qu'il faut absolument garder ? Si garder, comment les rendre meilleurs en SVG/Remotion (pas Gemini) ?"""
    },
    {
        "id": "Q2_S2_PARTAGE",
        "frame": "s2-partage-timeline.png",
        "question": """SCENE 2 — PARTAGE (12.5-27.9s) : Timeline 1971-2024 + 2 barres flat (Orano 86% bleu / Niger 9.2% vert).

VERDICT AZIZ : trop basique, fond trop noir, pas memorable.

PROPOSITIONS A CHALLENGER :
A) Waffle chart 100 cubes (86 bleus Orano + 9 verts Niger + reste vide) — comparaison incarnee
B) Animation barres qui se construisent en 1.5s avec compteur qui defile 0->86% / 0->9.2%
C) Fond #1a1f2e (bleu nuit profond) au lieu de #0a0a0a noir
D) Timeline glissante sur 53 ans avec ticks evenements cles (1971 ouverture, 2007 crise prix, 2014 contrat, 2025 nationalisation)

QUESTION : quelle combinaison (max 2-3 elements) donne le plus d'impact pour un Short mobile dark sur 15s ? Justifier."""
    },
    {
        "id": "Q3_S3_NATIONALISATION",
        "frame": "s3-nationalisation-split.png",
        "question": """SCENE 3 — NATIONALISATION (27.9-39.2s) : Split-screen. Gauche : carte Niger highlight vert. Droite : silhouette tour corporate vue de bas, bleu Orano.

PROBLEME AZIZ : trop partisan ("Niger sympa / corporate froid"). Symetrie d'humanisation cassee. La vue de bas dramatise Orano = on prend parti subliminalement.

PROPOSITIONS A CHALLENGER :
A) Deux documents factuels neutres : decret nigerien gauche / communique Orano droite. Deux papiers, deux voix.
B) Deux logos institutionnels sobres (drapeau Niger + logo Orano), neutralise par symetrie graphique pure.
C) MEME carte Niger split en deux halos colores : gauche vert (revendication souverainete) / droite bleu (revendication contractuelle). Meme territoire, deux interpretations.
D) Garder split actuel mais retravailler la tour Orano (pas vue de bas, vue normale, neutre).

QUESTION : laquelle preserve le mieux la symetrie d'humanisation ? Bonus : suggerer une animation pour casser le statique (la scene actuelle est statique)."""
    },
    {
        "id": "Q4_S4_PROCEDURES",
        "frame": "s4-procedures-flux-moscou.png",
        "question": """SCENE 4 — PROCEDURES (39.2-62.1s) : Carte monde Mapbox + arc Bezier orange Niger->Moscou + marqueur or Arlit + sceau CIRDI bas-gauche.

CONTRAINTE : 23s a remplir avec 4 informations narratives :
1. Orano saisit CIRDI tribunal arbitral
2. 1300 tonnes uranium bloquees sur site
3. 250 millions d'euros immobilises
4. Juillet 2025 Moscou (Rosatom) interesse
5. Septembre 2025 CIRDI bloque le stock

QUESTION : quelle sequence d'apparition narrative et visuelle permet de delivrer ces 5 infos sans surcharger ? L'arc Niger->Moscou doit-il apparaitre des le debut ou plus tard (juillet 2025) ? Le sceau CIRDI doit-il etre present partout ou apparaitre au moment ou on parle du tribunal ?

Bonus : suggerer 1-2 micro-animations qui ajoutent du dynamisme (ex: tirets animes sur arc, pulse sur marqueur Arlit, sceau qui s'estampille)."""
    },
    {
        "id": "Q5_S5_ETRANGLEMENT",
        "frame": "s5-etranglement-symetrique.png",
        "question": """SCENE 5 — ETRANGLEMENT (62.1-82.7s) : Split-screen 2 cartes. Gauche : Niger isole vert. Droite : monde avec 3 pins bleus (Canada, France, Kazakhstan).

PROBLEME : composition gauche ressemble a Scene 3 gauche. Repetition visuelle.

PROPOSITION AZIZ : garder gauche Niger isole, MAIS droite = globe rotatif Mapbox (projection: 'globe' supportee) avec 3 FLECHES SORTANTES depuis Arlit/France HQ vers Canada + Kazakhstan + (autre site). Symbolise la diversification ACTIVE d'Orano qui "s'echappe" du Niger.

QUESTION : un globe rotatif avec fleches sortantes bat-il un globe statique avec pins pour symboliser "Orano global vs Niger seul" ? Ou y a-t-il une 3eme option plus forte (ex: Niger qui retrecit a gauche / Orano qui s'expand a droite via animation echelle) ?

Critere de jugement : impact narratif + faisabilite Remotion + Mapbox + lisibilite mobile portrait."""
    },
    {
        "id": "Q6_S6_ECHIQUIER",
        "frame": "s6-echiquier-flat.png",
        "question": """SCENE 6 — CONCLUSION (82.7-96s) : Echiquier 2D top-down + 4 pieces Orano bleues + 1 pion vert Niger seul + papiers procedures flat 2D autour. Fond noir.

VERDICT AZIZ : la composition est tres bien et faisable Remotion. MAIS le fond #0a0a0a est trop noir et monotone (toutes les scenes sont noires). Veut un fond plus chaud/colore mais coherent.

PROPOSITIONS A CHALLENGER :
A) Fond brun chaud #1a1410 + halo dore subtil au centre derriere echiquier (lumiere de lampe de bureau juridique)
B) Fond vert sombre desature #0e1a14 (allusion table de feutre verte juge/jury)
C) Fond bleu nuit #0d1424 + halo bleute (ambiance courthouse nocturne)

QUESTION : laquelle de ces variations chromatiques renforce la metaphore de la "guerre d'usure devant tribunal" sans casser la coherence dark Souverain ? Suggerer aussi 1-2 micro-animations sobres (ex: une piece bleue Orano qui se deplace, papiers qui glissent legerement, ombres qui s'allongent)."""
    },
    {
        "id": "Q7_PALETTE_GLOBALE",
        "frame": None,
        "question": """QUESTION TRANSVERSE (pas de frame) — PALETTE GLOBALE EPISODE.

SITUATION : la serie Souverain utilise actuellement #0a0a0a (quasi-noir) comme fond pour TOUTES les scenes. L'aziz trouve ca monotone sur 96s, surtout sur mobile en plein jour ou la lisibilite baisse.

PROPOSITION : introduire 2-3 fonds tonalites differents qui tournent sur les 6 sections, sans casser la coherence signature dark.

EX :
- S1 Hook : noir profond (drame, urgence)
- S2 Partage : bleu nuit subtil #1a1f2e (data viz, sobriete financiere)
- S3 Nationalisation : noir + halo or central (decret, gravite institutionnelle)
- S4 Procedures : gris-bleu cool #14181f (tribunal, neutralite)
- S5 Etranglement : noir profond (asymetrie, tension)
- S6 Conclusion : brun chaud #1a1410 (courthouse, gravite finale)

QUESTION : cette progression chromatique fonctionne-t-elle narrativement ? Risques (incoherence, surcharge cognitive) ? Si tu rejettes cette progression, propose une palette ALTERNATIVE 2-3 tons qui marche pour Souverain (en sachant que l'episode 1 Or Africain etait noir uniforme)."""
    },
]


def call_gpt4o(prompt: str, image_path: Path | None = None) -> str:
    client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    content = [{"type": "text", "text": prompt}]
    if image_path:
        b64 = encode_image(image_path)
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": content}],
        max_tokens=1500,
    )
    return response.choices[0].message.content


def call_grok(prompt: str, image_path: Path | None = None) -> str:
    client = openai.OpenAI(
        api_key=os.environ["XAI_API_KEY"],
        base_url="https://api.x.ai/v1",
    )
    content = [{"type": "text", "text": prompt}]
    if image_path:
        b64 = encode_image(image_path)
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    response = client.chat.completions.create(
        model="grok-4-fast-non-reasoning",
        messages=[{"role": "user", "content": content}],
        max_tokens=1500,
    )
    return response.choices[0].message.content


def call_kimi(prompt: str, image_path: Path | None = None) -> str:
    content = [{"type": "text", "text": prompt}]
    if image_path:
        b64 = encode_image(image_path)
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}})

    response = requests.post(
        "https://api.moonshot.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.environ['MOONSHOT_API_KEY']}",
            "Content-Type": "application/json",
        },
        json={
            "model": "moonshot-v1-32k-vision-preview",
            "messages": [{"role": "user", "content": content}],
            "max_tokens": 1500,
        },
        timeout=120,
    )
    data = response.json()
    if "choices" not in data:
        return f"ERROR: {data}"
    return data["choices"][0]["message"]["content"]


def query_juror(juror_name: str, q: dict) -> tuple[str, str, str]:
    """Returns (juror_name, question_id, response_text)."""
    full_prompt = CONTEXT + "\n\n=== QUESTION ===\n" + q["question"]
    image_path = STORYBOARD_DIR / q["frame"] if q["frame"] else None

    try:
        if juror_name == "GPT-4o":
            text = call_gpt4o(full_prompt, image_path)
        elif juror_name == "Grok":
            text = call_grok(full_prompt, image_path)
        elif juror_name == "Kimi":
            text = call_kimi(full_prompt, image_path)
        else:
            text = "UNKNOWN JUROR"
    except Exception as e:
        text = f"ERROR: {str(e)[:300]}"
    return (juror_name, q["id"], text)


def main():
    for key in ["OPENAI_API_KEY", "XAI_API_KEY", "MOONSHOT_API_KEY"]:
        if not os.environ.get(key):
            print(f"ERROR: {key} missing")
            sys.exit(1)

    print(f"Storyboard: {STORYBOARD_DIR}")
    print(f"Questions: {len(QUESTIONS)}")
    print(f"Jurors: GPT-4o, Grok-2-vision, Kimi K2.5")
    print(f"Total calls: {len(QUESTIONS) * 3}")
    print()

    # Verify frames
    for q in QUESTIONS:
        if q["frame"]:
            p = STORYBOARD_DIR / q["frame"]
            if not p.exists():
                print(f"ERROR: missing frame {p}")
                sys.exit(1)

    results = {}
    jobs = []
    for q in QUESTIONS:
        for juror in ["GPT-4o", "Grok", "Kimi"]:
            jobs.append((juror, q))

    print(f"Starting {len(jobs)} parallel calls...")
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(query_juror, juror, q): (juror, q["id"]) for juror, q in jobs}
        done = 0
        for fut in as_completed(futures):
            juror, qid, text = fut.result()
            results.setdefault(qid, {})[juror] = text
            done += 1
            print(f"  [{done}/{len(jobs)}] {juror} {qid} done")

    elapsed = time.time() - t0
    print(f"\nAll done in {elapsed:.1f}s")

    # Save raw JSON
    output = {
        "timestamp": datetime.now().isoformat(),
        "elapsed_seconds": elapsed,
        "questions": {q["id"]: {"frame": q["frame"], "question": q["question"], "responses": results.get(q["id"], {})} for q in QUESTIONS},
    }
    OUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    print(f"\nSaved: {OUT_PATH}")

    # Print compiled answers
    print("\n" + "=" * 80)
    print("COMPILED ANSWERS")
    print("=" * 80)
    for q in QUESTIONS:
        print(f"\n{'#' * 80}")
        print(f"# {q['id']}")
        print(f"{'#' * 80}")
        for juror in ["GPT-4o", "Grok", "Kimi"]:
            text = results.get(q["id"], {}).get(juror, "MISSING")
            print(f"\n--- {juror} ---")
            print(text)


if __name__ == "__main__":
    main()
