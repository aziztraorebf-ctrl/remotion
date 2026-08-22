#!/usr/bin/env python3
"""
measure-camera.py — mesure OBJECTIVE d'un mouvement de camera.

POURQUOI CET OUTIL EXISTE
-------------------------
3 des 5 boucles d'iteration les plus cheres du projet sont des boucles camera
(4 + 3 + 3 iterations completes de code+render+review). AUCUNE n'etait un
probleme de dosage : toutes avaient une cause STRUCTURELLE, et toutes ont ete
resolues par UNE mesure. Chacune de ces mesures a ete ecrite en script jetable
puis PERDUE, donc reecrite a zero la fois suivante.

Cet outil capitalise les 3 mesures. Au 2e rejet du meme symptome de mouvement :
ne PAS retoucher une 3e valeur -> lancer la mesure correspondante.

LES 3 SOUS-COMMANDES
--------------------
  speed   Vitesse frame a frame depuis un JSON de positions camera (HORS render,
          le moins cher). Detecte le piege n°1 : easeInOut PAR SEGMENT, qui met
          la vitesse a EXACTEMENT 0 a chaque keypoint ("elle approche, stop,
          elle approche, stop"). Detecte aussi les paliers (index arrondi).

  scale   Diametre/etendue reelle du sujet sur N frames d'une video. Detecte le
          piege n°2 : une valeur derivee du zoom qui ne suit PAS le zoom (ex.
          GLOBE_R au lieu de globeR). Symptome mesure sur le cas reel : diametre
          868px +/-1px sur 85s alors que le zoom allait de 1.2 a 4.0.

  motion  Immobilite reelle (!= gel). Rapporte min/mediane/max du pourcentage de
          pixels qui changent, ET la plus longue serie consecutive sous seuil.
          ATTENTION : mesurer a 640px MINIMUM. Un detecteur en vignettes 320px
          est AVEUGLE aux mouvements lents/localises (2 faux positifs "10s
          figees"/"9s figees" ont ete dementis par une mesure fine).

EXEMPLES
--------
  # 1) Exporter les positions camera depuis le code (voir --emit-helper), puis :
  python3 scripts/tools/measure-camera.py speed cam.json

  # 2) Sur un rendu, verifier que le globe grandit vraiment :
  python3 scripts/tools/measure-camera.py scale out/episodes/x/beat.mp4 --frames 12

  # 3) Verifier qu'aucun segment n'est fige :
  python3 scripts/tools/measure-camera.py motion out/episodes/x/beat.mp4

  # Aide pour produire le JSON attendu par 'speed' :
  python3 scripts/tools/measure-camera.py --emit-helper
"""

import argparse
import json
import os
import statistics
import subprocess
import sys
import tempfile

HELPER = r"""
// --- Helper a coller dans un fichier .mjs temporaire, puis : node ce-fichier.mjs > cam.json
// But : rejouer la fonction camera SANS render (mesure la moins chere).
// Adapter l'import et l'appel a la fonction camera reelle du beat.

import { camAt } from './src/projects/_rnd/d3-16x9/globeCamera.ts';
const KEYS = [ /* coller les CamKey du beat */ ];
const TOTAL = 2400;              // frames du beat
const out = [];
for (let f = 0; f <= TOTAL; f++) {
  const c = camAt(KEYS, f);
  // x/y/scale : n'importe quelle grandeur continue qui DOIT bouger.
  out.push({ frame: f, x: c.lon, y: c.lat, scale: c.scaleMul });
}
console.log(JSON.stringify(out));
"""


def die(msg, code=1):
    print(f"ERREUR : {msg}", file=sys.stderr)
    sys.exit(code)


def need(mod):
    try:
        return __import__(mod)
    except ImportError:
        die(f"module '{mod}' requis. Installer : pip3 install {mod}")


def ffprobe_duration(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", path],
        capture_output=True, text=True)
    if r.returncode != 0:
        die(f"ffprobe a echoue sur {path}")
    return float(r.stdout.strip())


# ---------------------------------------------------------------- speed
def cmd_speed(args):
    if not os.path.isfile(args.positions):
        die(f"fichier introuvable : {args.positions}\n"
            f"Produire ce JSON avec : measure-camera.py --emit-helper")
    data = json.load(open(args.positions))
    if not isinstance(data, list) or len(data) < 3:
        die("JSON attendu : liste d'objets {frame, x, y, scale}")

    speeds, scale_speeds = [], []
    for a, b in zip(data, data[1:]):
        dx = b.get("x", 0) - a.get("x", 0)
        dy = b.get("y", 0) - a.get("y", 0)
        speeds.append((b.get("frame", 0), (dx * dx + dy * dy) ** 0.5))
        scale_speeds.append(abs(b.get("scale", 0) - a.get("scale", 0)))

    vals = [v for _, v in speeds]
    nz = [v for v in vals if v > 1e-9]
    vmax = max(vals) if vals else 0
    median = statistics.median(vals) if vals else 0

    print(f"Frames analysees        : {len(data)}")
    print(f"Vitesse mediane         : {median:.4f} u/frame")
    print(f"Vitesse max             : {vmax:.4f} u/frame")
    print(f"Vitesse min (non nulle) : {min(nz):.6f}" if nz else "Vitesse min : TOUT EST NUL")
    print(f"Variation de scale max  : {max(scale_speeds):.4f}" if scale_speeds else "")

    # PIEGE 1 : quasi-arrets en cours de trajet.
    # NE PAS tester v == 0 : entre 2 frames ENTIERES la vitesse au keypoint n'est
    # jamais exactement nulle, juste tres petite. Test verifie sur le bug reel
    # reproduit : min non nul = 0.0002 contre une mediane de 0.17, soit 0.1 %.
    # Le bon critere est donc RELATIF a la mediane, pas absolu.
    floor = median * args.ratio
    zeros = [f for f, v in speeds[1:-1] if v <= floor]
    print()
    if zeros:
        print(f"⛔ PIEGE 1 DETECTE — vitesse quasi nulle (< {args.ratio:.0%} de la mediane) "
              f"a {len(zeros)} frame(s) en cours de trajet : "
              f"{zeros[:12]}{' ...' if len(zeros) > 12 else ''}")
        print("   Cause typique : easeInOut applique PAR SEGMENT (derivee nulle aux 2 bouts).")
        print("   Fix : lerp pur, smoothstep attenue, ou UN SEUL easing global sur toute la plage.")
        print("   Reference : GazoducActe4Objectifs.tsx:290-303 / camAtContinu().")
    else:
        print("✅ Aucun arret complet en cours de trajet.")

    # Paliers : pics isoles = index arrondi.
    if vals and median > 0 and vmax > median * 20:
        print(f"\n⚠️  Pic de vitesse {vmax / median:.0f}x la mediane — avance par PALIERS ?")
        print("   Cause typique : Math.round sur un index de samples.")

    sys.exit(2 if zeros else 0)


# ---------------------------------------------------------------- scale
def cmd_scale(args):
    np = need("numpy")
    Image = need("PIL").Image

    if not os.path.isfile(args.video):
        die(f"video introuvable : {args.video}")
    dur = ffprobe_duration(args.video)
    n = max(3, args.frames)
    times = [dur * i / (n - 1) for i in range(n)]

    widths = []
    with tempfile.TemporaryDirectory() as td:
        for i, t in enumerate(times):
            png = os.path.join(td, f"f{i}.png")
            subprocess.run(
                ["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", args.video,
                 "-frames:v", "1", "-vf", f"scale={args.width}:-1", "-y", png],
                check=False)
            if not os.path.isfile(png):
                continue
            im = np.asarray(Image.open(png).convert("RGB")).astype(int)
            h = im.shape[0]
            row = im[h // 2]                      # ligne mediane
            bg = np.median(im[:5].reshape(-1, 3), axis=0)   # fond = haut de l'image
            diff = np.abs(row - bg).max(axis=1)
            cols = np.where(diff > args.threshold)[0]
            w = (cols.max() - cols.min()) if len(cols) > 1 else 0
            widths.append((t, int(w)))
            print(f"  t={t:6.2f}s  etendue={w:5d}px")

    if len(widths) < 3:
        die("pas assez de frames extraites")
    vals = [w for _, w in widths]
    wmin, wmax = min(vals), max(vals)
    amp = ((wmax - wmin) / wmax * 100) if wmax else 0
    print(f"\nEtendue min/max : {wmin} / {wmax} px   —   amplitude {amp:.1f} %")
    print()
    if amp < 5:
        print("⛔ PIEGE 2 SUSPECTE — la taille du sujet ne varie quasiment PAS.")
        print("   Si le zoom est cense varier, une valeur derivee ne suit pas le zoom.")
        print("   Grep : apres avoir calcule globeR, aucun GLOBE_R ne doit rester")
        print("   (clipPath, cercle atmosphere, ocean, lisere, terminateur).")
        sys.exit(2)
    print("✅ La taille du sujet varie — pas de silhouette clouee.")
    print("   Rappel : au zoom max le globe DOIT deborder du cadre (Soudan A6 : 1792/1920).")
    print("   Des marges constantes = signal du bug, meme si l'interieur bouge.")


# ---------------------------------------------------------------- motion

def cmd_sheet(args):
    """Planche-contact horodatee : ou se joue REELLEMENT le geste dans un rendu long.

    ⛔ Ecrit en script jetable le 2026-08-21 puis versionne ici — c'est exactement le
    motif que la docstring de ce fichier decrit ("mesure ecrite en script jetable puis
    PERDUE, donc reecrite a zero la fois suivante").

    Pourquoi : un rendu de 10-23 s NE COMMENCE PAS par son geste. Decouper "au jugement"
    a produit 3 clips faux le meme jour (galerie de mouvements de camera) :
      - pull-back-reveal a 72,5 s montrait la camera qui SE RESSERRE (vrai geste : 69,5 s)
      - zoom-sol-3d a 82,5 s contenait DEUX gestes distincts (vrai : 81,5 s)
      - 6 blueprints Atlas decoupes a 1,0 s : 4 vignettes sur 6 ne montraient RIEN
        (vrais timecodes 6,6 / 12,0 / 9,0 s sur des rendus de 10,0 / 21,2 / 23,1 s)
    """
    import subprocess, tempfile
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        sys.exit("Pillow requis : pip install Pillow")

    dur = float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", args.video],
        capture_output=True, text=True).stdout.strip())
    start = args.start if args.start is not None else 0.0
    # -0.15 s : une extraction pile a la duree totale echoue (frame inexistante)
    end = args.end if args.end is not None else max(start, dur - 0.15)
    step = args.step if args.step else max(0.5, (end - start) / 12)

    tmp = tempfile.mkdtemp(prefix="camsheet_")
    ims, t = [], start
    while t <= end + 1e-6:
        f = os.path.join(tmp, f"f{t:.2f}.png")
        subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", args.video,
                        "-vf", f"scale={args.width}:-1", "-frames:v", "1", "-y", f],
                       capture_output=True)
        if not os.path.exists(f):
            t += step
            continue
        im = Image.open(f).convert("RGB")
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 62, 20], fill=(0, 0, 0))
        d.text((5, 5), f"{t:.1f}s", fill=(255, 220, 0))
        ims.append(im)
        t += step

    if not ims:
        sys.exit("aucune frame extraite")
    w, h = ims[0].size
    cols = args.cols
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (w * cols, h * rows), (0, 0, 0))
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % cols) * w, (i // cols) * h))
    sheet.save(args.out)
    print(f"duree source : {dur:.2f}s")
    print(f"{len(ims)} frames de {start:.1f}s a {end:.1f}s (pas {step:.2f}s) -> {args.out}")
    print("REGARDE la planche : le geste occupe une fenetre etroite, elle est rarement au debut.")

def cmd_motion(args):
    np = need("numpy")
    Image = need("PIL").Image

    if not os.path.isfile(args.video):
        die(f"video introuvable : {args.video}")
    if args.width < 640:
        print(f"⚠️  width={args.width} < 640 : un detecteur trop petit est AVEUGLE aux")
        print("   mouvements lents/localises (2 faux positifs documentes). Force a 640.")
        args.width = 640

    with tempfile.TemporaryDirectory() as td:
        subprocess.run(
            ["ffmpeg", "-v", "error", "-i", args.video,
             "-vf", f"fps={args.fps},scale={args.width}:-1",
             "-y", os.path.join(td, "f%05d.png")], check=False)
        files = sorted(os.listdir(td))
        if len(files) < 3:
            die("extraction de frames impossible")

        pcts = []
        prev = None
        for fn in files:
            im = np.asarray(Image.open(os.path.join(td, fn)).convert("RGB")).astype(int)
            if prev is not None:
                pct = float((np.abs(im - prev).max(axis=2) > args.threshold).mean() * 100)
                pcts.append(pct)
            prev = im

    step = 1.0 / args.fps
    longest = cur = 0
    for p in pcts:
        cur = cur + 1 if p < args.still else 0
        longest = max(longest, cur)

    print(f"Frames comparees : {len(pcts)} (a {args.fps} fps, largeur {args.width}px)")
    print(f"Pixels qui changent — min {min(pcts):.2f} %  mediane {statistics.median(pcts):.2f} %  max {max(pcts):.2f} %")
    print(f"Plus longue serie sous {args.still} % : {longest * step:.1f} s")
    print()
    print("Sain : min > 1 %, mediane ~5 %, serie = 0 s.")
    if longest * step >= args.max_still:
        print(f"\n⛔ IMMOBILITE — {longest * step:.1f}s sous le seuil.")
        print("   AVANT d'iterer sur ce verdict : re-mesurer plus fin (--width 960)")
        print("   ET REGARDER un crop de la zone. 2 faux positifs deja documentes.")
        sys.exit(2)
    print("✅ Aucune immobilite significative.")


def main():
    ap = argparse.ArgumentParser(
        description="Mesure objective d'un mouvement de camera (3 mesures capitalisees).",
        formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__)
    ap.add_argument("--emit-helper", action="store_true",
                    help="affiche le helper Node pour produire le JSON de 'speed'")
    sub = ap.add_subparsers(dest="cmd")

    s = sub.add_parser("speed", help="vitesse frame a frame (HORS render) — piege 1")
    s.add_argument("positions", help="JSON : [{frame,x,y,scale}, ...]")
    s.add_argument("--ratio", type=float, default=0.10,
                   help="seuil de quasi-arret, en fraction de la vitesse mediane (defaut 0.10)")
    s.set_defaults(func=cmd_speed)

    c = sub.add_parser("scale", help="etendue du sujet sur N frames — piege 2")
    c.add_argument("video")
    c.add_argument("--frames", type=int, default=10)
    c.add_argument("--width", type=int, default=960)
    c.add_argument("--threshold", type=int, default=18)
    c.set_defaults(func=cmd_scale)

    sh = sub.add_parser("sheet", help="planche-contact horodatee — OU se joue le geste (avant toute decoupe)")
    sh.add_argument("video")
    sh.add_argument("--out", default="/tmp/camera-sheet.png")
    sh.add_argument("--start", type=float, default=None)
    sh.add_argument("--end", type=float, default=None)
    sh.add_argument("--step", type=float, default=None, help="defaut : ~12 frames sur la plage")
    sh.add_argument("--cols", type=int, default=4)
    sh.add_argument("--width", type=int, default=300)
    sh.set_defaults(func=cmd_sheet)

    m = sub.add_parser("motion", help="immobilite reelle (!= gel)")
    m.add_argument("video")
    m.add_argument("--fps", type=float, default=2)
    m.add_argument("--width", type=int, default=640)
    m.add_argument("--threshold", type=int, default=10)
    m.add_argument("--still", type=float, default=0.5, help="seuil %% pixels changes")
    m.add_argument("--max-still", type=float, default=2.0, help="secondes tolerees")
    m.set_defaults(func=cmd_motion)

    a = ap.parse_args()
    if a.emit_helper:
        print(HELPER)
        return
    if not getattr(a, "func", None):
        ap.print_help()
        sys.exit(1)
    a.func(a)


if __name__ == "__main__":
    main()
