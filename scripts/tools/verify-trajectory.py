#!/usr/bin/env python3
"""
verify-trajectory.py — Verifie MECANIQUEMENT qu'un element mobile (jet, vehicule, jeton)
suit sa trajectoire theorique dans un RENDU REEL, frame par frame.

Pourquoi : un bug de timing React (ex. calcul de position dans un useEffect au lieu d'etre
synchrone au rendu) est INVISIBLE en lisant le code ou en zoomant a l'oeil sur 2-3 frames —
la trajectoire mathematique peut etre parfaitement lineaire alors que le PIXEL RENDU est en
retard d'une frame a chaque capture. Trouve et corrige a la main sur ProtoSilhouetteRiseFx.tsx
(2026-07-07) : ce script automatise la meme verification qu'on a du faire manuellement
(extraire frames -> comparer position attendue vs position visible).

Methode : pour chaque frame testee,
  1. calcule la position ATTENDUE en pixels (fournie par l'appelant — meme formule que le
     composant Remotion, typiquement interpolate() sur lon/lat + une projection)
  2. cherche le pixel le plus proche de cette position dont la couleur matche la couleur
     cible (tolerance RGB), dans une fenetre de recherche autour du point attendu
  3. si aucun pixel trouve dans la fenetre -> ECHEC (element absent ou trop loin)
  4. si trouve mais hors tolerance px -> WARN (leger decalage, a surveiller)

Limite assumee : detection par couleur dominante, pas par forme. Fonctionne bien pour un
sprite/icone a couleur distinctive (ex. contour rouge JNIM #B14B3C) sur fond contrastant.
Ne remplace pas une revue visuelle humaine — detecte les DECALAGES MECANIQUES, pas le style.

IMPORTANT — choix de --window/--max-drift-px : valide 2026-07-07 sur ProtoSilhouetteRiseFx
(bug useEffect vs calcul synchrone, cf commentaire dans le .tsx). Avec une fenetre large
(window=40+), le bug passait INAPERCU (le jet etait "quelque part dans la zone"). Avec une
fenetre serree (window=10, max-drift-px=8) collee sur la position MATHEMATIQUEMENT attendue,
l'ecart reel (6.3px) ressort clairement contre la version corrigee (0.0px). Regle : pour
detecter un vrai bug de timing, TOUJOURS tester en fenetre serree (10-15px) autour du point
calcule par la MEME formule que le composant, jamais une fenetre large "large pour etre sur
de trouver l'element" — ca noie precisement le signal qu'on cherche.

Usage :
  python3 scripts/tools/verify-trajectory.py <mp4> \\
    --fps 30 \\
    --color "58,42,24" --tolerance 40 \\
    --window 60 \\
    --point 40,860,410 --point 55,780,430 --point 70,700,450

  Chaque --point est "frame,x_attendu,y_attendu" (px, resolution native du rendu).
  Exit 0 si tous les points sont dans la tolerance --max-drift-px (defaut 15).
  Exit 1 si au moins un point derive au-dela du seuil ou est introuvable.
"""
import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

RED = "\033[91m"; YEL = "\033[93m"; GRN = "\033[92m"; DIM = "\033[2m"; RST = "\033[0m"


def extract_frame(mp4: Path, frame_idx: int, out_png: Path):
    """Extrait UNE frame par index exact (pas par timestamp — evite les arrondis ffmpeg -ss
    qui avaient fait echouer une premiere tentative de comparaison manuelle, 2026-07-07)."""
    cmd = [
        "ffmpeg", "-y", "-i", str(mp4),
        "-vf", f"select='eq(n\\,{frame_idx})'",
        "-vsync", "0", "-frames:v", "1",
        str(out_png),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if not out_png.exists():
        raise RuntimeError(f"Extraction frame {frame_idx} echouee: {r.stderr[-500:]}")


def find_closest_match(img: Image.Image, cx: int, cy: int, target_rgb, tolerance: int, window: int):
    """Cherche le pixel le plus proche de (cx,cy) dont la couleur est a <=tolerance du
    target_rgb (distance de Chebyshev par canal), dans un carre de cote 2*window autour
    du point. Retourne (dx, dy, dist) du meilleur match ou None si rien trouve."""
    w, h = img.size
    px = img.load()
    tr, tg, tb = target_rgb
    best = None  # (dist_from_center, dx, dy)
    x0, x1 = max(0, cx - window), min(w, cx + window)
    y0, y1 = max(0, cy - window), min(h, cy + window)
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b = px[x, y][:3]
            if abs(r - tr) <= tolerance and abs(g - tg) <= tolerance and abs(b - tb) <= tolerance:
                d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
                if best is None or d < best[0]:
                    best = (d, x - cx, y - cy)
    if best is None:
        return None
    return best[1], best[2], best[0]


def parse_point(s: str):
    parts = s.split(",")
    if len(parts) != 3:
        raise argparse.ArgumentTypeError(f"--point attend 'frame,x,y', reçu: {s}")
    return int(parts[0]), int(parts[1]), int(parts[2])


def parse_color(s: str):
    parts = [int(p) for p in s.split(",")]
    if len(parts) != 3:
        raise argparse.ArgumentTypeError(f"--color attend 'r,g,b', reçu: {s}")
    return tuple(parts)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("mp4", type=Path)
    ap.add_argument("--point", action="append", type=parse_point, required=True,
                     help="frame,x_attendu,y_attendu — repetable")
    ap.add_argument("--color", type=parse_color, required=True, help="r,g,b couleur cible de l'element")
    ap.add_argument("--tolerance", type=int, default=40, help="tolerance couleur par canal RGB (defaut 40)")
    ap.add_argument("--window", type=int, default=60, help="rayon de recherche en px autour du point attendu (defaut 60)")
    ap.add_argument("--max-drift-px", type=int, default=15, help="ecart max tolere avant WARN/FAIL (defaut 15px)")
    args = ap.parse_args()

    if not args.mp4.exists():
        print(f"{RED}FICHIER INTROUVABLE{RST}: {args.mp4}")
        sys.exit(2)

    fails = 0
    warns = 0
    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        print(f"\n{DIM}── verify-trajectory: {args.mp4.name} ──{RST}")
        for frame_idx, ex, ey in args.point:
            png = tmp_dir / f"f{frame_idx}.png"
            try:
                extract_frame(args.mp4, frame_idx, png)
            except RuntimeError as e:
                print(f"{RED}  ✗ frame {frame_idx}: {e}{RST}")
                fails += 1
                continue
            img = Image.open(png).convert("RGB")
            match = find_closest_match(img, ex, ey, args.color, args.tolerance, args.window)
            if match is None:
                print(f"{RED}  ✗ frame {frame_idx}: AUCUN pixel couleur {args.color} trouve "
                      f"dans un rayon de {args.window}px autour de ({ex},{ey}) — element absent/trop loin{RST}")
                fails += 1
                continue
            dx, dy, dist = match
            if dist > args.max_drift_px:
                print(f"{YEL}  ⚠ frame {frame_idx}: decalage {dist:.1f}px (dx={dx}, dy={dy}) "
                      f"> seuil {args.max_drift_px}px — position attendue ({ex},{ey}){RST}")
                warns += 1
            else:
                print(f"{GRN}  ✓ frame {frame_idx}: OK, decalage {dist:.1f}px (dx={dx}, dy={dy}){RST}")

    print()
    if fails:
        print(f"{RED}VERIFY-TRAJECTORY ECHOUEE : {fails} point(s) introuvable(s), {warns} decalage(s).{RST}")
        sys.exit(1)
    if warns:
        print(f"{YEL}VERIFY-TRAJECTORY : 0 echec mais {warns} decalage(s) au-dela du seuil — a examiner.{RST}")
        sys.exit(1)
    print(f"{GRN}VERIFY-TRAJECTORY OK : tous les points dans la tolerance.{RST}")
    sys.exit(0)


if __name__ == "__main__":
    main()
