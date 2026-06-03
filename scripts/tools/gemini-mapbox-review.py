#!/usr/bin/env python3
"""
gemini-mapbox-review.py — Directeur cartographique premium (Gemini 3.1 Pro)

Analyse une video Mapbox Souverain et retourne un JSON structure :
  - bugs[]          : clipping, buffering, collisions, timing (probleme + frame + fix_code)
  - ameliorations[] : direction artistique premium (anti-carte-grise) par critere

Brief Gemini : Production Brief (intention) + catalogue overlays disponibles +
contraintes DOCTRINE + references geotainment premium (Geo Globe-Trotter, Jacque a dit,
Vox, Johnny Harris).

Pattern Files API valide 2026-05-31 (feedback_gemini-video-review-pattern.md).

Usage :
  python3 scripts/tools/gemini-mapbox-review.py <video.mp4> [--observations "..."]
"""

import os
import sys
import time
import json
import argparse
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from google import genai
from google.genai import types

MODEL = "gemini-3.1-pro-preview"

# ── Catalogue overlays/patterns disponibles (ce que Claude peut coder) ──────────
CATALOGUE_OVERLAYS = """
PATTERNS MAPBOX DISPONIBLES (deja codes / valides headless) :
- Dots gold pulsants (halo circle anime) — marqueurs geo importants
- Labels border gold style SANGOMAR (DOM Marker geo-attache) — entites nommees
- Arcs dessines dasharray (LineString anime) — flux/exports/connexions
- Whip pan 60f + blur CSS — transition entre lieux
- Fill-pattern drapeau (canvas tile sur country boundary)
- Fill-extrusion 3D (batiments/volumes)
- Gradient vague / gradient radial pulsant / multi-pays gradients (fill-color anime)
- Noise organique (texture canvas)
- Lottie off-screen (textures organiques uniquement)
- Donut SVG anime (pourcentages) — overlay React
- Pull Back Reveal / Crane Down / Dolly In / Orbit / Tilt / Counter-rotation (camera)

CONTRAINTES NON-NEGOTIABLES :
- Fond carte = navy #16213a (jamais #000000)
- Frame-driven uniquement (jumpTo) — jamais flyTo/easeTo
- R1 : max 8s sans changement visuel
- Tailwind pour overlays React, SVG natif pour formes
- Headless : pas de satellite-v9 (tuiles trop lentes), Mercator obligatoire
"""

REFERENCES_PREMIUM = """
REFERENCES PREMIUM GEOTAINMENT / EDUTAINMENT CARTE (le niveau a atteindre) :
- Geo Globe-Trotter : cartes vivantes, jamais statiques ni grises. Couleur, profondeur,
  points d'interet, labels qui apparaissent rythmes sur la narration.
- Jacque a dit : style edutainment carte, mouvements fluides, elements graphiques
  qui ponctuent chaque info, zero temps mort visuel.
- Vox / Johnny Harris : overlays graphiques riches (fleches dessinees, zones colorees
  semi-transparentes, annotations, highlight de regions, lignes de flux animees,
  texte integre a la carte, transitions motivees). Style After Effects : la carte
  n'est jamais "juste une carte" — c'est un canevas annote en permanence.

PRINCIPE CLE A EVALUER : quels principes de ces references peut-on appliquer pour
EVITER la carte grise et vide ? (pas reparer apres coup — concevoir riche des le depart).
Exemples : highlight colore de region (fill semi-transparent), labels de villes
secondaires en contexte, fleches/zones d'annotation, profondeur par gradient,
elements qui occupent le vide negatif, texture sur les zones d'interet.
"""

PROMPT_TEMPLATE = """Tu es DIRECTEUR CARTOGRAPHIQUE PREMIUM pour une chaine d'edutainment
geopolitique (style Vox / Johnny Harris / Geo Globe-Trotter / Jacque a dit).

Tu analyses un segment video (carte Mapbox animee) destine a un Short vertical 1080x1920.
Ce segment couvre {segment_desc}.

## INTENTION (Production Brief — ce qui etait prevu)
{production_brief}

## CE QUE CLAUDE PEUT CODER (catalogue)
{catalogue}

## REFERENCES PREMIUM (le niveau a atteindre)
{references}

## OBSERVATIONS DE L'EQUIPE (a confirmer ou infirmer, et completer)
Claude et le realisateur ont deja repere :
{observations}
Confirme ou infirme chacune, puis CHERCHE ce qu'ils ratent.

## CRITERES D'EVALUATION (note chacun /10 + justification)
1. MOUVEMENTS camera : fluidite, vitesse, clipping/buffering/tuiles-qui-chargent-mal,
   zoom trop rapide. Signale CHAQUE artefact technique avec le timecode approximatif.
2. CLARTE : la carte raconte-t-elle ce que dit la voix-off ? Synchro visuel/audio.
3. RETENTION ANTI-GRIS : c'est LE critere central. La carte est-elle vivante ou grise/vide ?
   Quels PRINCIPES des references premium appliquer pour la rendre riche DES LE DEPART
   (pas reparer) ? Sois tres concret : quel overlay, quelle couleur, quelle zone highlightee,
   quel element dans le vide negatif.
4. STYLE PREMIUM : distance au niveau Vox/Harris/Geo Globe-Trotter. Qu'est-ce qui fait
   encore "amateur" vs "broadcast" ?

## SORTIE — JSON STRICT (rien d'autre, pas de markdown autour)
{{
  "scores": {{ "mouvements": 0, "clarte": 0, "retention_anti_gris": 0, "style_premium": 0, "global": 0 }},
  "bugs": [
    {{ "probleme": "...", "timecode_s": 0.0, "gravite": "critique|majeur|mineur",
       "fix_code": "instruction technique precise pour Claude (ex: ralentir zoom phase A de 240f a 360f)" }}
  ],
  "ameliorations": [
    {{ "critere": "retention_anti_gris|clarte|style_premium|mouvements",
       "observation": "ce qui manque/cloche",
       "suggestion": "amelioration concrete",
       "template_a_utiliser": "lequel du catalogue (ou 'nouveau: description')",
       "reference_premium": "quelle chaine fait ca et comment" }}
  ],
  "verdict": "1-2 phrases : potable mais... / pret / a retravailler"
}}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video", help="Chemin video MP4")
    ap.add_argument("--brief", default="memory/episodes/souverain/maroc-batteries-kenitra/PRODUCTION-BRIEF.md")
    ap.add_argument("--observations", default="")
    ap.add_argument("--episode", default="", help="slug episode (ex: maroc-batteries) — contexte du prompt")
    ap.add_argument("--acte", default="", help="acte (ex: A5) — contexte du prompt")
    ap.add_argument("--out", default="")
    args = ap.parse_args()

    video_path = Path(args.video)
    if not video_path.exists():
        print(f"ERREUR : video introuvable : {video_path}", file=sys.stderr)
        sys.exit(1)

    brief_path = Path(args.brief)
    production_brief = brief_path.read_text() if brief_path.exists() else "(brief non trouve)"

    observations = args.observations or "(aucune observation fournie — analyse a froid)"

    # contexte dérivé des args (plus de hardcode "Maroc A2 Phosphate" pour tout épisode)
    if args.episode and args.acte:
        segment_desc = f"l'acte {args.acte} de l'episode '{args.episode}' (voir le Production Brief ci-dessous pour le sujet exact)"
    elif args.episode:
        segment_desc = f"un segment de l'episode '{args.episode}' (voir le Production Brief ci-dessous)"
    else:
        segment_desc = "un segment de Short Souverain (voir le Production Brief ci-dessous pour le sujet exact)"

    prompt = PROMPT_TEMPLATE.format(
        production_brief=production_brief,
        catalogue=CATALOGUE_OVERLAYS,
        references=REFERENCES_PREMIUM,
        observations=observations,
        segment_desc=segment_desc,
    )

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERREUR : GEMINI_API_KEY absent de .env", file=sys.stderr)
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    print(f"[1/4] Upload {video_path.name} ({video_path.stat().st_size // 1024} KB)...")
    video_file = client.files.upload(
        file=str(video_path),
        config=types.UploadFileConfig(mime_type="video/mp4"),
    )

    print("[2/4] Attente traitement (ACTIVE)...")
    while video_file.state.name == "PROCESSING":
        time.sleep(3)
        video_file = client.files.get(name=video_file.name)
    if video_file.state.name != "ACTIVE":
        print(f"ERREUR : etat fichier = {video_file.state.name}", file=sys.stderr)
        sys.exit(1)

    print(f"[3/4] Analyse via {MODEL}...")
    response = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_uri(file_uri=video_file.uri, mime_type="video/mp4"),
            types.Part(text=prompt),
        ],
        config=types.GenerateContentConfig(max_output_tokens=6000, temperature=0.2),
    )

    print("[4/4] Cleanup...")
    try:
        client.files.delete(name=video_file.name)
    except Exception:
        pass

    raw = response.text.strip()
    # Nettoyer un eventuel fence markdown
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    out_path = args.out or f"/tmp/gemini-mapbox-review-{video_path.stem}.json"
    try:
        parsed = json.loads(raw)
        Path(out_path).write_text(json.dumps(parsed, indent=2, ensure_ascii=False))
        print(f"\nJSON valide -> {out_path}\n")
        print(json.dumps(parsed, indent=2, ensure_ascii=False))
    except json.JSONDecodeError:
        Path(out_path).write_text(raw)
        print(f"\nJSON non parsable, brut sauvegarde -> {out_path}\n")
        print(raw)


if __name__ == "__main__":
    main()
