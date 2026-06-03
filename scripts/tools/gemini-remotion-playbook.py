#!/usr/bin/env python3
"""
gemini-remotion-playbook.py — Construit le SOUVERAIN-REMOTION-PLAYBOOK via 2 appels Gemini 3.1 Pro.

Miroir Remotion de gemini-visual-playbook.py (qui couvre le Mapbox).
Registre : beats data-viz / hero-data / graphisme editorial (PAS carte Mapbox).

Appel 1 (principes) : nos 2 videos data-viz validees (Silicon Savannah + Niger Uranium)
  -> extraire les principes premium reproductibles du motion design data-driven.
  Gemini compare mentalement aux standards premium connus (Bloomberg/Vox/Kurzgesagt).
Appel 2 (gap + doctrine) : memes videos + principes appel 1
  -> ou on applique bien/mal, comment combler dans NOTRE style, template storyboard beat Remotion.

Sortie : /tmp/remotion-playbook-appel1.json + /tmp/remotion-playbook-appel2.json
(Claude redige ensuite memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md a partir de ces JSON.)
"""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
from google import genai
from google.genai import types

MODEL = "gemini-3.1-pro-preview"
PROJECT_ROOT = Path(__file__).parent.parent.parent

OUR_VIDEOS = [
    ("Silicon Savannah (data-viz hero : chiffres, barres, objets hero)",
     PROJECT_ROOT / "out/PRET-PUBLICATION/silicon-savannah-FINAL.mp4"),
    ("Niger Uranium (graphisme reseau : entites, flux, diagrammes)",
     PROJECT_ROOT / "out/PRET-PUBLICATION/niger-uranium-FINAL.mp4"),
]

# Charte couleur reelle (lue dans le code Silicon Savannah)
CHARTE = """
- Fond navy #141c2e (jamais noir pur) + degrade radial central pour profondeur
- Gold #c8a951 (accent principal) + ivory #f0e8d8 (texte)
- Accent verdict : rouge #cc2200 / vert #4caf7d (RESERVE aux moments de verdict, jamais decoratif)
- Police : Bebas Neue (titres/chiffres hero) + IBM Plex Mono / monospace (sources, sous-labels)
- Stack : Remotion (React), frame-driven (useCurrentFrame + interpolate + spring), Tailwind tokens
- Contrainte R1 : max 8s sans changement visuel fort (glow/float ne comptent pas)
"""

PROMPT_1 = """Tu es DIRECTEUR ARTISTIQUE expert en motion design data-driven editorial
(reference du genre premium : Bloomberg Originals, Vox, Kurzgesagt, Polymatter).

On te montre 2 videos verticales (9:16) VALIDEES d'une chaine d'analyse geopolitique/economique
africaine (style "Souverain"). Ce sont nos meilleures productions data-viz/graphisme (PAS de la carte).

## NOTRE CHARTE (le style qu'on veut comprendre et renforcer)
{charte}

## TA MISSION (Appel 1/2 — EXTRACTION DE PRINCIPES PREMIUM)

Extrais les PRINCIPES REPRODUCTIBLES de motion design data-driven qui distinguent ces videos
d'un graphisme amateur. Analyse RIGOUREUSEMENT ces axes :

(A) CHIFFRE HERO — comment un chiffre cle est traite (count-up anime, bounce/pop final, glow,
    hold, scale). Le chiffre est-il un EVENEMENT ou juste affiche ?
(B) BICHROMIE & CONTRASTE — usage gold/ivory/navy + couleur d'accent. Discipline chromatique.
(C) RESPIRATION & RYTHME — vide assume vs saturation, cadence d'apparition, R1 (max 8s sans event).
(D) HIERARCHIE VISUELLE — un hero central + elements satellites ? composition de l'ecran.
(E) OBJETS / ELEMENTS VIVANTS — float, halo, ping-ring, glow oscillant : comment un objet statique
    devient vivant sans etre cartoon.
(F) TRANSITIONS INTER-SCENES — coupures, fondus, marquage des actes.
(G) TYPOGRAPHIE ANIMEE — reveal mot-par-mot, typewriter, impact.
(H) tout autre principe premium que tu observes.

Pour CHAQUE principe : mecanique precise + a quel moment l'utiliser + pourquoi ca capte l'attention.

COMPARAISON PREMIUM : par rapport aux standards que tu connais (Bloomberg/Vox/Kurzgesagt),
qu'est-ce qui RAPPROCHE ces videos du premium, et qu'est-ce qui les en ELOIGNE encore ?

## SORTIE — JSON STRICT
{{
  "principes_premium": [
    {{ "axe": "A|B|C|D|E|F|G|H", "nom": "...", "mecanique": "...", "quand_utiliser": "...",
       "pourquoi_ca_marche": "...", "exemple_video": "Silicon Savannah|Niger Uranium" }}
  ],
  "ecart_au_premium": [
    {{ "constat": "...", "ref_premium": "Bloomberg|Vox|Kurzgesagt", "comment_combler": "..." }}
  ],
  "synthese": "2-3 phrases : qu'est-ce qui distingue un beat data-viz vivant d'un beat mort"
}}
"""

PROMPT_2 = """Tu es DIRECTEUR ARTISTIQUE expert en motion design data-driven editorial.

## CONTEXTE
Tu viens d'analyser nos 2 videos data-viz et extrait ces PRINCIPES :
{principes_json}

## NOTRE CHARTE (a PRESERVER — notre signature)
{charte}

## CONTRAINTES NON-NEGOCIABLES
- Premium et CLASSIQUE : zero emoji, zero pop-up geant, zero image 500x sa taille.
- Tailwind obligatoire (tokens couleurs/typo) — zero style inline pour couleur/taille.
- Frame-driven Remotion : spring() > interpolate(), extrapolateRight clamp.
- Source documentee discrete en bas d'ecran (opacity ~0.45).

## TA MISSION (Appel 2/2 — GAP ANALYSIS + DOCTRINE + TEMPLATE STORYBOARD)

1. Pour CHAQUE principe premium extrait : est-ce qu'on l'applique bien / partiellement / mal ?
   Cite precisement quelle video et quel moment.
2. Pour les principes appliques partiellement/mal : COMMENT les pousser plus loin dans NOTRE style
   (navy/gold/ivory, Tailwind, classique premium) ? Sois concret et actionnable.
3. DIAGNOSTIC : ou nos chiffres/donnees manquent-ils encore d'IMPACT ? Quelle est notre faiblesse #1
   en data-viz ? Donne 2-3 solutions concretes dans notre stack.
4. Produis un TEMPLATE DE STORYBOARD pour beat Remotion data-viz : la structure a remplir AVANT le code,
   pour concevoir RICHE des le depart. Champs attendus (adapte/complete) : chiffre/donnee hero +
   animation du hero + elements satellites + respiration/vide + element vivant (float/halo) +
   transition entree/sortie + SFX. Regle d'or : aucun champ vide.

## SORTIE — JSON STRICT
{{
  "gap_analysis": [
    {{ "principe": "...", "on_applique": "bien|partiellement|mal", "preuve": "video + moment",
       "comment_pousser_plus_loin": "..." }}
  ],
  "diagnostic_impact": {{
    "faiblesse_1": "...",
    "solutions": [ "...", "...", "..." ]
  }},
  "template_storyboard_beat_remotion": {{
    "description": "comment l'utiliser",
    "champs_par_scene": [ "..." ]
  }},
  "synthese_doctrine": "le coeur de la doctrine data-viz en 3-5 phrases"
}}
"""


def upload_and_wait(client, path, label):
    print(f"  upload {label} ({Path(path).stat().st_size // 1024} KB)...")
    f = client.files.upload(file=str(path), config=types.UploadFileConfig(mime_type="video/mp4"))
    while f.state.name == "PROCESSING":
        time.sleep(3)
        f = client.files.get(name=f.name)
    if f.state.name != "ACTIVE":
        raise RuntimeError(f"{label} etat={f.state.name}")
    return f


def strip_fence(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
    return raw


def main():
    api_key = os.environ["GEMINI_API_KEY"]
    client = genai.Client(api_key=api_key)

    for label, p in OUR_VIDEOS:
        if not p.exists():
            print(f"ERREUR : video absente : {p}", file=sys.stderr)
            sys.exit(1)

    # Upload une fois, reutilise pour les 2 appels
    print("=== UPLOAD des 2 videos ===")
    uploaded = [(label, upload_and_wait(client, p, label)) for label, p in OUR_VIDEOS]

    # ── APPEL 1 — principes ──
    print("\n=== APPEL 1/2 — Extraction des principes premium ===")
    prompt1 = PROMPT_1.format(charte=CHARTE)
    contents1 = [types.Part.from_uri(file_uri=f.uri, mime_type="video/mp4") for _, f in uploaded]
    contents1.append(types.Part(text=prompt1))

    print("  analyse appel 1...")
    resp1 = client.models.generate_content(
        model=MODEL, contents=contents1,
        config=types.GenerateContentConfig(max_output_tokens=8000, temperature=0.3),
    )
    raw1 = strip_fence(resp1.text)
    Path("/tmp/remotion-playbook-appel1.json").write_text(raw1)
    print("  -> /tmp/remotion-playbook-appel1.json")

    # ── APPEL 2 — gap analysis ──
    print("\n=== APPEL 2/2 — Gap analysis + doctrine ===")
    prompt2 = PROMPT_2.format(principes_json=raw1, charte=CHARTE)
    contents2 = [types.Part.from_uri(file_uri=f.uri, mime_type="video/mp4") for _, f in uploaded]
    contents2.append(types.Part(text=prompt2))

    print("  analyse appel 2...")
    resp2 = client.models.generate_content(
        model=MODEL, contents=contents2,
        config=types.GenerateContentConfig(max_output_tokens=8000, temperature=0.3),
    )
    raw2 = strip_fence(resp2.text)
    Path("/tmp/remotion-playbook-appel2.json").write_text(raw2)
    print("  -> /tmp/remotion-playbook-appel2.json")

    # Cleanup
    for _, f in uploaded:
        try:
            client.files.delete(name=f.name)
        except Exception:
            pass

    print("\n=== TERMINE ===")
    print("Appel 1 (principes)    : /tmp/remotion-playbook-appel1.json")
    print("Appel 2 (gap+doctrine) : /tmp/remotion-playbook-appel2.json")
    print("\n--- APPEL 1 ---")
    print(raw1)
    print("\n--- APPEL 2 ---")
    print(raw2)


if __name__ == "__main__":
    main()
