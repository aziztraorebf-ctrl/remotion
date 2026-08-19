#!/usr/bin/env python3
"""
gemini-storyboard-with-ref.py — variante ponctuelle de gemini-storyboard-panels.py qui joint une
IMAGE DE REFERENCE (une vraie frame de notre render valide) en plus du prompt texte, pour ancrer
visuellement la contrainte de style plutot que de compter sur des mots seuls.

Cause du retour Aziz (session 2026-07-15, Beat2 senegal-short-d3) : le 1er appel storyboard (texte
seul, "flat editorial illustration, NOT 3D") a quand meme produit des panels 3D isometriques (barres
avec faces laterales, entonnoir en perspective) — Gemini derive vers son registre par defaut riche des
que le sujet est "chiffre/data", meme avec la contrainte ecrite. Montrer > decrire.

Usage :
  python3 scripts/tools/_session-icons-senegal-short/gemini-storyboard-with-ref.py \
    --prompt-file /tmp/prompt.txt --ref-image /tmp/frame.png --out /tmp/storyboard.png --ratio 9:16
"""
import argparse
import io
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

# parents[2] = racine du repo (le fichier est dans scripts/tools/). Etait parents[3] : le .env etait
# cherche AU-DESSUS du workspace, donc GEMINI_API_KEY n'etait jamais chargee et le script mourait sur
# "Missing key inputs argument" (constate 2026-08-15, contourne a la main). Les scripts voisins
# (openrouter-*.py) utilisent bien parents[2].
PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")

MODEL = "gemini-3.1-flash-image-preview"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt-file", required=True)
    ap.add_argument("--ref-image", required=True, help="Frame de reference (PNG/JPG) a joindre")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    prompt_path = Path(args.prompt_file)
    ref_path = Path(args.ref_image)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if not prompt_path.exists():
        print(f"[ERROR] Prompt introuvable : {prompt_path}", file=sys.stderr)
        sys.exit(1)
    if not ref_path.exists():
        print(f"[ERROR] Image de reference introuvable : {ref_path}", file=sys.stderr)
        sys.exit(1)

    full_prompt = prompt_path.read_text().strip()
    ref_img = Image.open(ref_path)

    print(f"=== STORYBOARD GEMINI FLASH avec IMAGE-REF — {out_path.name} ===")
    print(f"  Modele : {MODEL}")
    print(f"  Ref image : {ref_path} ({ref_img.size})")
    print(f"  Prompt : {len(full_prompt)} chars\n")

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model=MODEL,
        contents=[full_prompt, ref_img],
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
            print(f"[text] {part.text[:300]}")

    if not saved:
        print("[ERROR] Aucune image retournee par Gemini.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
