"""
Traitement d'integration pour icones de batiments generees par Gemini (vue top-down),
pour eviter la rupture de registre bitmap identifiee sur SudanWarMapEpic60 (bitmap nu = "flotte"
au-dessus de la carte plate). Desaturation + teinte parchemin + cadre encre fin.

Contexte : memory/archive/starters-perimes-2026-07-11/STARTER-PROMPT-inserts-tactiques-soudan.md section "VERDICT CONFIRME".

Usage:
    python3 scripts/tools/gemini-batiment-integration.py --input path.png --output path-integre.png
"""
import argparse
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

PARCHEMIN = (209, 178, 124)  # #d1b27c
ENCRE = (43, 33, 23)  # #2b2117


def process(input_path: Path, output_path: Path):
    img = Image.open(input_path).convert("RGB")

    img = ImageEnhance.Color(img).enhance(0.55)
    img = ImageEnhance.Contrast(img).enhance(0.9)

    overlay = Image.new("RGB", img.size, PARCHEMIN)
    img = Image.blend(img, overlay, 0.12)

    img = ImageOps.expand(img, border=6, fill=ENCRE)
    img = ImageOps.expand(img, border=14, fill=PARCHEMIN)
    img = ImageOps.expand(img, border=3, fill=ENCRE)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path)
    print(f"Saved: {output_path}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    process(Path(args.input), Path(args.output))


if __name__ == "__main__":
    main()
