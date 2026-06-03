#!/usr/bin/env python3
"""
gemini-storyboard-panels.py — Génère un storyboard VISUEL multi-panels via Gemini Flash.

NON-NEGOTIABLE dans le pipeline Beat Remotion : tout beat passe par un storyboard visuel
Gemini Flash AVANT le code. Le storyboard multi-panels montre la PROGRESSION du beat
(intro -> developpement -> climax/verdict), comme une planche. C'est de lui qu'on tire
le breakdown JSON et c'est lui qui permet de coder sans hesiter.

Usage :
  python3 scripts/tools/gemini-storyboard-panels.py \
    --episode maroc-batteries --beat 3 \
    --prompt-file /tmp/maroc-batteries-beat3-storyboard-prompt.txt

Le prompt (--prompt-file) DOIT etre redige par Claude depuis le scan (templates choisis
+ combinaisons) et VALIDE par Aziz AVANT l'appel. Modele : gemini-3.1-flash-image-preview.
Sortie : public/souverain/<episode>/beat<N>/storyboard-gemini.png (chemin attendu par preflight).
"""

import io
import os
import sys
import argparse
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent.parent
load_dotenv(PROJECT_ROOT / ".env")

MODEL = "gemini-3.1-flash-image-preview"

# Charte + style commun (injecté dans tout prompt — cohérence storyboard)
STYLE_BLOCK = """
STYLE RULES (NON-NEGOTIABLE) :
- Flat editorial illustration, NOT 3D, NOT photorealistic, NOT cartoon
- Premium journalistic documentary tone (Bloomberg, Vox, Le Monde)
- Palette STRICTE : navy #141c2e (fond), gold #c8a951 (donnee cle), ivory #f0e8d8 (texte),
  accent rouge #cc2200 / vert #4caf7d UNIQUEMENT pour un verdict
- Multi-panels : 3 ou 4 cellules rectangulaires, bordure fine, numerotees, montrant la
  PROGRESSION temporelle du beat (gauche->droite). Timestamp dans un coin de chaque panel.
- NO subtitles, NO voiceover text inside panels (sauf labels data/geo explicitement demandes)
- Vertical format target 1080x1920 (9:16) — les panels illustrent ce cadrage
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--episode", required=True)
    ap.add_argument("--beat", type=int, required=True)
    ap.add_argument("--prompt-file", required=True,
                    help="Fichier texte avec le prompt storyboard (redige par Claude, valide par Aziz)")
    ap.add_argument("--out", default=None, help="Override chemin de sortie")
    args = ap.parse_args()

    prompt_path = Path(args.prompt_file)
    if not prompt_path.exists():
        print(f"[ERROR] Prompt introuvable : {prompt_path}", file=sys.stderr)
        sys.exit(1)
    user_prompt = prompt_path.read_text().strip()

    out_path = Path(args.out) if args.out else (
        PROJECT_ROOT / "public" / "souverain" / args.episode / f"beat{args.beat}" / "storyboard-gemini.png"
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)

    full_prompt = user_prompt + "\n\n" + STYLE_BLOCK

    print(f"=== STORYBOARD GEMINI FLASH — {args.episode} Beat{args.beat} ===")
    print(f"  Modele : {MODEL}")
    print(f"  Sortie : {out_path.relative_to(PROJECT_ROOT)}")
    print(f"  Prompt : {len(full_prompt)} chars\n")

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model=MODEL,
        contents=[full_prompt],
        config=types.GenerateContentConfig(response_modalities=["image", "text"]),
    )

    saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            img = Image.open(io.BytesIO(part.inline_data.data))
            img.save(out_path)
            print(f"[OK] Storyboard sauve : {out_path}")
            print(f"     Taille : {img.size}, mode : {img.mode}")
            saved = True
            break
        elif hasattr(part, "text") and part.text:
            print(f"[text] {part.text[:200]}")

    if not saved:
        print("[ERROR] Aucune image retournee par Gemini.", file=sys.stderr)
        sys.exit(1)

    print(f"\n[NEXT] Presenter le storyboard a Aziz. Apres validation :")
    print(f"       python3 scripts/beat-session.py --episode {args.episode} --beat {args.beat} --phase breakdown")


if __name__ == "__main__":
    main()
