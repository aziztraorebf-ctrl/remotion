#!/usr/bin/env python3
"""
make-comparatif-panel.py — planche A/B pour le 3e appel COMPARATIF (storyboard vs rendu).

⛔ POURQUOI CE SCRIPT EXISTE (paye le 2026-08-21)
Une planche qui empile 4 vignettes de rendu sous la rangee du storyboard fait HALLUCINER
le modele sur le cadrage : Gemini ET Grok ont tous deux affirme que le pays occupait
"15-20 % du cadre" alors que la mesure donnait 61 % et 54 %. Ils jugeaient la vignette,
pas la frame. Gemini en avait meme fait son "fix n1".
=> UNE case de storyboard face a UNE frame PLEINE TAILLE, a la meme hauteur. Jamais de bande.

Usage :
  make-comparatif-panel.py --storyboard SB.jpg --row 0 --panel 2 \
      --render frame.png --out cmp.png [--label "CONCEPT A - beat 3"]
"""
import argparse
from PIL import Image, ImageDraw

# Geometrie des planches produites par storyboard-dual-gen (2 rangees x 4 cases).
ROW_Y = {0: (0.06, 0.43), 1: (0.55, 0.92)}
COL_X0, COL_STEP, COL_W = 0.018, 0.2455, 0.236


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--storyboard", required=True)
    ap.add_argument("--row", type=int, required=True, choices=[0, 1])
    ap.add_argument("--panel", type=int, required=True, help="1-4")
    ap.add_argument("--render", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--label", default="")
    args = ap.parse_args()

    sb = Image.open(args.storyboard).convert("RGB")
    w, h = sb.size
    y0, y1 = ROW_Y[args.row]
    i = args.panel - 1
    case = sb.crop((
        int(w * (COL_X0 + i * COL_STEP)),
        int(h * y0),
        int(w * (COL_X0 + i * COL_STEP + COL_W)),
        int(h * y1),
    ))

    rd = Image.open(args.render).convert("RGB")

    # Meme HAUTEUR pour les deux : le modele compare des surfaces comparables.
    TARGET_H = 620
    case = case.resize((int(case.width * TARGET_H / case.height), TARGET_H))
    rd = rd.resize((int(rd.width * TARGET_H / rd.height), TARGET_H))

    BAND = 46
    W = case.width + rd.width
    out = Image.new("RGB", (W, TARGET_H + BAND), (12, 12, 16))
    d = ImageDraw.Draw(out)
    d.text((12, 14), f"{args.label}   GAUCHE = CIBLE (storyboard)   |   DROITE = RENDU ACTUEL",
           fill=(255, 215, 120))
    out.paste(case, (0, BAND))
    out.paste(rd, (case.width, BAND))
    d.line([(case.width, BAND), (case.width, BAND + TARGET_H)], fill=(255, 215, 120), width=3)
    out.save(args.out)
    print(f"{args.out} {out.size}  (case {case.size} | rendu {rd.size})")


if __name__ == "__main__":
    main()
