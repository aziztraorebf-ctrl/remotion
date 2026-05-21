#!/usr/bin/env python3
"""
beat-breakdown.py — Appel Gemini 1 (AVANT le code)

Lit le storyboard PNG d'un beat et retourne un JSON "quoi coder" :
segments, composants suggérés, code_values palette, contraintes R1.

Usage:
  python3 scripts/beat-breakdown.py --beat 6
  python3 scripts/beat-breakdown.py --beat 6 --storyboard public/souverain/silicon-savannah/beat6/storyboard-gemini.png
  python3 scripts/beat-breakdown.py --beat 6 --output /tmp/beat6-breakdown.json

Output JSON :
  {
    "beat": 6,
    "segments": [...],
    "components_suggested": [...],
    "assets_needed": [...],
    "code_values": {...},
    "r1_check": [...],
    "palette": {"gold": "#c8a951", "ivory": "#f0e8d8", "navy": "#112240"}
  }

Ce script s'arrête après avoir sauvé le JSON. Claude lit ce fichier avant de coder.
Ne pas chaîner avec visual_review.py — ce sont deux étapes séparées avec arrêt entre les deux.
"""

import os
import sys
import base64
import json
import argparse
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent'

BREAKDOWN_PROMPT = """Tu es directeur artistique senior pour la série "Souverain" par GéoAfrique (YouTube Shorts, 1080x1920, 30fps).

Palette locked :
- navy   #112240  (fond principal)
- gold   #c8a951  (accent, chiffres clés, titres impact)
- ivory  #f0e8d8  (texte courant, sous-titres)
- dark   #0d1420  (fond le plus sombre si besoin)

Police : Bebas Neue pour les titres (via @remotion/google-fonts). IBM Plex Mono pour les stats.
Règle R1 : aucun segment > 8s sans changement visuel (permanent motion comme glow/flottement ne compte PAS).
Composants disponibles : SplitScreenSouverain, WordExplode, TypeReveal (dans src/projects/_shared/components/layouts/).
Animations disponibles : spring(), interpolate() Remotion. Pas de CSS transitions, pas de keyframes.

TAILWIND OBLIGATOIRE — tokens disponibles (tailwind.config.ts) :
Couleurs  : text-gold / text-ivory / bg-navy / text-gold-light / bg-navy-deep
Tailles   : text-stat-2xl(200px) / text-stat-xl(180px) / text-stat-lg(120px) / text-stat-md(80px) / text-entity(110px) / text-label(38px)
Spacing   : safe-top(288px) / safe-bottom(192px) / col-pad(54px) / side-pad(30px)
RÈGLES LAYOUT :
- Toute zone définie en % de hauteur → h-[X%] + flex + justify-center + items-center (JAMAIS position:absolute + paddingTop manuel)
- Tout split 50/50 → flex flex-row + flex-1 sur chaque colonne
- Espacement entre éléments → gap-X Tailwind (JAMAIS marginTop inline)
- Couleurs texte/fond → tokens Tailwind (JAMAIS inline si token existe)
- Exception autorisée : valeurs SVG natives (fill, stroke, cx, cy) et animations (opacity, transform) restent inline

Voici le storyboard du beat. Analyse-le et retourne UNIQUEMENT du JSON brut (pas de markdown, pas de ```, pas de texte autour).

{
  "beat": <numero>,
  "duration_frames": <N>,
  "fps": 30,
  "segments": [
    {
      "id": "phase_a",
      "label": "nom descriptif",
      "frame_start": 0,
      "frame_end": 300,
      "duration_s": 10.0,
      "narration": "texte narration ce segment",
      "visual_description": "description visuelle précise",
      "component": "nom composant React suggéré ou 'custom'",
      "r1_ok": true,
      "r1_note": "quel changement visuel justifie R1"
    }
  ],
  "components_suggested": [
    {
      "name": "NomComposant",
      "role": "ce qu'il fait dans ce beat",
      "reuse_existing": true,
      "existing_path": "src/projects/_shared/components/layouts/NomComposant.tsx ou null"
    }
  ],
  "assets_needed": [
    {
      "filename": "beat6/bg.png",
      "type": "background|illustration|icon",
      "status": "present|missing",
      "generation_prompt": "prompt Gemini image si missing, sinon null"
    }
  ],
  "code_values": {
    "title_font_size": 96,
    "stat_font_size": 200,
    "title_color": "#c8a951",
    "body_color": "#f0e8d8",
    "bg_color": "#112240",
    "spring_damping": 90,
    "spring_stiffness": 60,
    "glow_filter": "drop-shadow(0px 0px 24px rgba(200,169,81,0.7))",
    "notes": "toute valeur CSS/SVG spécifique au beat"
  },
  "r1_violations_risk": [
    {
      "segment": "phase_a",
      "static_duration_s": 12.0,
      "fix": "subdiviser — ajouter count-up ou animation secondaire"
    }
  ],
  "palette": {
    "gold": "#c8a951",
    "ivory": "#f0e8d8",
    "navy": "#112240",
    "dark": "#0d1420"
  },
  "tailwind_layout": {
    "zone_haute": "h-[X%] flex flex-row (split) ou flex flex-col items-center justify-center",
    "zone_basse": "h-[Y%] flex items-center justify-center",
    "colonnes": "flex-1 flex flex-col items-center justify-center gap-Z",
    "texte_principal": "text-gold text-entity tracking-wider (ou token adapté)",
    "texte_secondaire": "text-ivory text-label tracking-widest",
    "notes": "classes spécifiques à ce beat — pas de valeurs inline pour couleurs/typo/spacing"
  },
  "construction_order": [
    "1. Structure AbsoluteFill + bg",
    "2. Phase A — composant principal",
    "3. Phase B — transition + composant secondaire",
    "4. Sous-titres + Audio"
  ]
}"""


def encode_b64(filepath: str) -> str:
    return base64.b64encode(Path(filepath).read_bytes()).decode()


def run_breakdown(beat_num: int, storyboard_path: str | None, output_path: str | None) -> dict:
    if not GEMINI_API_KEY:
        print("[ERROR] GEMINI_API_KEY manquant dans .env", file=sys.stderr)
        sys.exit(1)

    parts = []

    if storyboard_path and Path(storyboard_path).exists():
        print(f"[breakdown] Storyboard charge : {storyboard_path}")
        img_b64 = encode_b64(storyboard_path)
        ext = Path(storyboard_path).suffix.lower().lstrip('.')
        mime = 'image/png' if ext == 'png' else 'image/jpeg'
        parts.append({
            "inline_data": {"mime_type": mime, "data": img_b64}
        })
    else:
        print("[WARN] Aucun storyboard fourni — breakdown sans reference visuelle")

    parts.append({"text": BREAKDOWN_PROMPT.replace("<numero>", str(beat_num))})

    payload = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }

    print(f"[breakdown] Appel Gemini 2.5-pro pour Beat{beat_num}...")
    resp = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}",
        json=payload,
        timeout=120
    )
    resp.raise_for_status()

    data = resp.json()
    text = data['candidates'][0]['content']['parts'][0]['text']

    try:
        result = json.loads(text)
    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON invalide retourne par Gemini : {e}", file=sys.stderr)
        print(f"Raw : {text[:500]}", file=sys.stderr)
        sys.exit(1)

    if output_path:
        Path(output_path).write_text(json.dumps(result, indent=2, ensure_ascii=False))
        print(f"[breakdown] Sauvegarde : {output_path}")
    else:
        default_out = f"/tmp/beat{beat_num}-breakdown.json"
        Path(default_out).write_text(json.dumps(result, indent=2, ensure_ascii=False))
        print(f"[breakdown] Sauvegarde : {default_out}")
        output_path = default_out

    return result


def print_summary(result: dict) -> None:
    print("\n=== BREAKDOWN BEAT", result.get('beat'), "===")
    print(f"Duration : {result.get('duration_frames')} frames")
    print(f"\nSegments ({len(result.get('segments', []))}) :")
    for seg in result.get('segments', []):
        r1 = "R1 OK" if seg.get('r1_ok') else "R1 RISK"
        print(f"  {seg['id']:12s} f{seg['frame_start']:4d}→{seg['frame_end']:4d}  {r1}  {seg['component']}")

    print(f"\nAssets ({len(result.get('assets_needed', []))}) :")
    for asset in result.get('assets_needed', []):
        status = asset['status'].upper()
        print(f"  [{status:7s}] {asset['filename']}")

    missing = [a for a in result.get('assets_needed', []) if a['status'] == 'missing']
    if missing:
        print(f"\n[WARN] {len(missing)} asset(s) manquant(s) — generer avant de coder :")
        for a in missing:
            print(f"  - {a['filename']}")
            if a.get('generation_prompt'):
                print(f"    Prompt : {a['generation_prompt'][:120]}...")

    risks = result.get('r1_violations_risk', [])
    if risks:
        print(f"\n[R1 RISK] {len(risks)} segment(s) a risque :")
        for r in risks:
            print(f"  - {r['segment']} : {r['static_duration_s']}s statique — {r['fix']}")

    print("\n[OK] Breakdown complet. Lire le JSON avant de coder.")
    print("     Ne pas lancer visual_review.py maintenant — attendre la fin du code + render.")


def main():
    parser = argparse.ArgumentParser(description='beat-breakdown.py — Analyse storyboard avant code')
    parser.add_argument('--beat', type=int, required=True, help='Numero du beat (ex: 6)')
    parser.add_argument('--storyboard', type=str, default=None, help='Chemin vers le PNG storyboard')
    parser.add_argument('--output', type=str, default=None, help='Fichier JSON de sortie')
    args = parser.parse_args()

    result = run_breakdown(args.beat, args.storyboard, args.output)
    print_summary(result)


if __name__ == '__main__':
    main()
