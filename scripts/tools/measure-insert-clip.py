#!/usr/bin/env python3
"""Mesure objective d'un clip d'insert (H3 ou autre) AVANT de le juger a l'oeil.

Ne PAS se fier au coup d'oeil pour valider un clip d'insert : cette mesure a detecte 3 defauts
invisibles a l'inspection visuelle (2026-08-15) :
  - une conduite dont le gaz se VIDAIT progressivement (zone censee rester vide 17x plus mobile
    que la zone matiere)
  - un navire cense etre a quai qui DERIVAIT de 15 px sur 5 s
  - 32 % de chaque clip rogne par un cadre au mauvais ratio

Ce que ca mesure :
  - mouvement median global et PAR ZONE  -> un insert veut un cadre stable et UNE zone qui vit
  - derive horizontale de la structure   -> l'objet doit-il rester en place ? (ancrage)
  - ratio de boucle                      -> <3x = <Loop> sans crossfade
  - ecran noir en fin                    -> defaut H3 documente 2x
  - luminosite debut/fin                 -> derive jour->nuit

Usage :
  measure-insert-clip.py clip.mp4
  measure-insert-clip.py clip.mp4 --zone matiere:340,440,300,600 --zone decor:10,80,10,200
  measure-insert-clip.py clip.mp4 --frames 60          # echantillonnage plus dense

Une zone s'ecrit  nom:y0,y1,x0,x1  (coordonnees dans le clip, pas dans la video finale).
"""
import argparse
import io
import json
import subprocess
import sys

try:
    import numpy as np
    from PIL import Image
except ImportError:
    sys.exit("Requiert numpy et Pillow (pip install numpy pillow)")


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,nb_frames,r_frame_rate",
         "-of", "json", path],
        capture_output=True, text=True,
    )
    if out.returncode != 0:
        sys.exit(f"ffprobe a echoue sur {path}")
    s = json.loads(out.stdout)["streams"][0]
    return int(s["width"]), int(s["height"]), int(s["nb_frames"])


def grab(path, idx):
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", f"select=eq(n\\,{idx})",
         "-vsync", "0", "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
        capture_output=True,
    )
    return np.asarray(Image.open(io.BytesIO(r.stdout)).convert("RGB")).astype(float)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("clip")
    ap.add_argument("--zone", action="append", default=[],
                    help="nom:y0,y1,x0,x1 — repetable")
    ap.add_argument("--frames", type=int, default=40, help="nombre de frames echantillonnees")
    args = ap.parse_args()

    w, h, total = probe(args.clip)
    idxs = np.linspace(0, total - 2, min(args.frames, total - 1)).astype(int)
    fs = [grab(args.clip, i) for i in idxs]

    diffs = [np.abs(fs[i + 1] - fs[i]).mean() for i in range(len(fs) - 1)]
    med = float(np.median(diffs))

    print(f"\n=== {args.clip} ===")
    print(f"  {w}x{h}, {total} frames, {len(fs)} echantillonnees")
    print(f"  mouvement median global : {med:.2f}")

    zones = []
    for z in args.zone:
        try:
            name, coords = z.split(":")
            y0, y1, x0, x1 = (int(v) for v in coords.split(","))
            zones.append((name, y0, y1, x0, x1))
        except ValueError:
            sys.exit(f"Zone mal formee : {z!r} (attendu nom:y0,y1,x0,x1)")

    if zones:
        print("\n  -- par zone --")
        vals = {}
        for name, y0, y1, x0, x1 in zones:
            zd = [np.abs(fs[i + 1][y0:y1, x0:x1] - fs[i][y0:y1, x0:x1]).mean()
                  for i in range(len(fs) - 1)]
            vals[name] = float(np.median(zd))
            print(f"  {name:24s}: {vals[name]:.2f}")
        if len(vals) >= 2:
            hi = max(vals.values())
            lo = max(min(vals.values()), 0.01)
            print(f"  -> separation max/min : {hi / lo:.0f}x"
                  f"   ({'BON — cadre stable, matiere vivante' if hi / lo >= 10 else 'FAIBLE — le cadre bouge autant que le sujet'})")

    # derive horizontale : correlation du profil vertical entre 1re et derniere frame
    def prof(f):
        return f.mean(axis=(0, 2))
    p0, p1 = prof(fs[0]), prof(fs[-1])
    span = max(10, min(30, w // 20))
    shifts = range(-span, span + 1)
    best = max(shifts, key=lambda s: np.corrcoef(p0[span:-span], np.roll(p1, s)[span:-span])[0, 1])
    print(f"\n  derive horizontale : {best:+d} px"
          f"   ({'immobile' if abs(best) <= 2 else 'ATTENTION — la structure se deplace'})")

    lum = [float(f.mean()) for f in fs]
    print(f"  luminosite         : {lum[0]:.1f} -> {lum[-1]:.1f}  (min {min(lum):.1f})")
    if min(lum) < 12:
        print("  /!\\ ECRAN NOIR probable (defaut H3 documente) — reduire la duree de Loop")
    if abs(lum[-1] - lum[0]) > 8:
        print("  /!\\ derive de luminosite — ajouter un LIGHT LOCK au prompt")

    loop = float(np.abs(fs[-1] - fs[0]).mean())
    ratio = loop / max(med, 0.01)
    verdict = "<Loop> sans crossfade" if ratio < 3 else ("crossfade conseille" if ratio < 8 else "RACCORD FRANC — inutilisable en boucle")
    print(f"  boucle             : ecart {loop:.2f} = {ratio:.1f}x le mouvement median  -> {verdict}")
    print()


if __name__ == "__main__":
    main()
