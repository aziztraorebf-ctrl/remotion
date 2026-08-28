#!/usr/bin/env python3
"""
sfx-cues.py — OU placer les SFX dans une video, mesure sur l'IMAGE.

Le probleme qu'il resout (repro Foster, 2026-08-27) : j'ai pose les SFX sur les
pics d'un signal AUDIO, releves dans une capture degradee (16 kHz mono). Verdict
d'Aziz : « les SFX sont parfois un peu decales, et dans l'originale ils sont deux
fois plus nombreux — c'est litteralement ce qui donne le cote premium ».
⭐ La cause est de methode : un SFX se cale sur l'EVENEMENT VISUEL (un element qui
apparait, une coupe, un mouvement qui se pose), pas sur un pic sonore. L'audio
d'une reference dit quand ILS ont sonorise ; il ne dit pas ou l'image bouge chez
NOUS. Et sur un rendu muet, il n'y a tout simplement pas d'audio a analyser.

CE QU'IL FAIT — trois familles d'evenements, mesurees frame par frame :
  COUPE      rupture franche entre 2 frames (diff > seuil haut)
  APPARITION un element entre dans le cadre : la quantite d'ENCRE augmente d'un
             coup (pixels clairs sur fond sombre, ou l'inverse), sans que l'image
             entiere change — c'est ce qui distingue une apparition d'une coupe.
  POSE       un mouvement continu s'ARRETE (la diff retombe sous un plancher
             apres avoir ete elevee) : la fin d'un travelling, une camera qui se
             cale. C'est un temps fort qu'on oublie de sonoriser.

USAGE :
  python3 scripts/tools/sfx-cues.py <video.mp4> [--fps 30] [--crop W:H:X:Y]
                                    [--start S] [--end S] [--json out.json]

SORTIE : un tableau frame / temps / type / intensite, et un bloc TSX pret a coller
(`<Sequence from={F} durationInFrames={20}><Audio .../></Sequence>`).

⛔ CE QU'IL NE FAIT PAS : choisir le son. Il dit OU, jamais QUOI — le choix du
fichier reste un jugement (cf. `public/_shared/sfx/SFX-INDEX.md`, et la banque
ecoutable listee dans `memory/INDEX-LIENS.md`).
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile

try:
    import numpy as np
    from PIL import Image
except ImportError:
    sys.exit("Il faut numpy et Pillow : pip install numpy pillow")


def extract(video, outdir, fps, crop, start, end):
    vf = f"fps={fps}"
    if crop:
        vf = f"crop={crop},{vf}"
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if start is not None:
        cmd += ["-ss", str(start)]
    cmd += ["-i", video]
    if end is not None and start is not None:
        cmd += ["-t", str(round(end - start, 3))]
    cmd += ["-vf", vf, "-q:v", "3", os.path.join(outdir, "f_%05d.jpg")]
    subprocess.run(cmd, check=True)
    return sorted(
        os.path.join(outdir, f) for f in os.listdir(outdir) if f.startswith("f_")
    )


def analyse(frames):
    """Retourne, par frame : diff globale et quantite d'encre.

    ⚠️ On travaille en niveaux de gris REDUITS (largeur 480) : la mesure porte sur
    la STRUCTURE de l'image, pas sur le bruit de compression. Un grain qui bouge
    d'un pixel ne doit pas compter comme un evenement.
    """
    diffs, inks = [], []
    prev = None
    for f in frames:
        im = Image.open(f).convert("L")
        w, h = im.size
        im = im.resize((480, max(1, round(480 * h / w))))
        a = np.asarray(im, dtype=np.float32)
        # « encre » = ce qui tranche sur le fond. On prend l'ecart a la mediane :
        # marche que le sujet soit clair sur fond sombre ou l'inverse.
        inks.append(float(np.abs(a - np.median(a)).mean()))
        diffs.append(0.0 if prev is None else float(np.abs(a - prev).mean()))
        prev = a
    return np.array(diffs), np.array(inks)


def detect(diffs, inks, fps):
    """Classe les evenements. Les seuils sont RELATIFS a la video analysee :
    un seuil absolu ne survit pas au changement de registre (une scene de typo
    sur noir et un plan filme n'ont pas la meme energie de base)."""
    ev = []
    med = float(np.median(diffs[1:])) if len(diffs) > 1 else 0.0
    mad = float(np.median(np.abs(diffs[1:] - med))) or 0.01
    hi = med + 12 * mad      # coupe franche
    mid = med + 4 * mad      # changement notable
    floor_ = med + 1.2 * mad  # « ca ne bouge quasi plus »

    d_ink = np.diff(inks, prepend=inks[0])
    ink_med = float(np.median(np.abs(d_ink)))
    ink_mad = float(np.median(np.abs(np.abs(d_ink) - ink_med))) or 0.005
    ink_hi = ink_med + 5 * ink_mad

    # ⛔ Une COUPE est RARE et ISOLEE. Sans ce garde-fou, une salve d'apparitions
    # rapides (une phrase qui s'ecrit mot a mot) sortait entierement en « COUPE » :
    # le seuil d'intensite ne suffit pas, il faut le CONTEXTE. Une vraie coupe est
    # un pic qui domine largement ses voisines ; une salve, ce sont des pics
    # comparables qui se suivent.
    def is_real_cut(i, d):
        lo = max(1, i - 6)
        hi_ = min(len(diffs), i + 7)
        voisines = [diffs[j] for j in range(lo, hi_) if j != i]
        if not voisines:
            return True
        return d > 2.5 * max(voisines)

    was_moving = False
    for i in range(1, len(diffs)):
        d = diffs[i]
        if d > hi and is_real_cut(i, d):
            ev.append((i, "COUPE", d))
        elif d > mid and d_ink[i] > ink_hi:
            # l'encre AUGMENTE nettement : un element entre dans le cadre
            ev.append((i, "APPARITION", d))
        elif d > hi:
            # fort mais pas isole : un changement dans une salve
            ev.append((i, "APPARITION", d))
        elif was_moving and d < floor_:
            # le mouvement vient de s'arreter : la pose
            ev.append((i, "POSE", d))
        was_moving = d > mid
    # dedoublonner : 2 evenements a moins de 4 frames = le meme
    out = []
    for e in ev:
        if out and e[0] - out[-1][0] < 4:
            if e[2] > out[-1][2]:
                out[-1] = e
            continue
        out.append(e)
    return out


SUGGEST = {
    "COUPE": "_shared/sfx/ui/plate-pop.mp3",
    "APPARITION": "_shared/sfx/ui/node-appear.mp3",
    "POSE": "_shared/sfx/data/stat-tick.mp3",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--crop", default=None, help="ex. 1920:1080:270:0")
    ap.add_argument("--start", type=float, default=None)
    ap.add_argument("--end", type=float, default=None)
    ap.add_argument("--json", default=None)
    a = ap.parse_args()

    with tempfile.TemporaryDirectory() as td:
        frames = extract(a.video, td, a.fps, a.crop, a.start, a.end)
        if not frames:
            sys.exit("Aucune frame extraite — verifier le chemin et les bornes.")
        diffs, inks = analyse(frames)
        ev = detect(diffs, inks, a.fps)

    off = a.start or 0.0
    print(f"\n{len(frames)} frames analysees a {a.fps} fps — {len(ev)} evenements\n")
    print(f"{'frame':>6} {'t (s)':>8}  {'type':<11} intensite")
    print("-" * 44)
    for i, kind, d in ev:
        print(f"{i:6d} {off + i / a.fps:8.3f}  {kind:<11} {d:6.2f}")

    print("\n--- a coller dans la scene (adapter les fichiers) ---")
    for i, kind, _ in ev:
        print(f'      {{ at: {i}, src: "{SUGGEST[kind]}", vol: 0.3 }},  // {kind.lower()}')

    print(
        "\n⚠️ Ce sont des CANDIDATS mesures, pas une verite : garder ce qui porte un\n"
        "   sens narratif, retirer le reste. Un SFX par micro-mouvement fatigue autant\n"
        "   que pas de SFX du tout.\n"
        "⛔ Pas de whoosh sur une coupe d'UI (fiche UI-PRODUIT) : vocabulaire de\n"
        "   mouvement physique, sans rapport avec un logiciel."
    )

    if a.json:
        json.dump(
            [{"frame": i, "t": round(off + i / a.fps, 3), "type": k,
              "intensity": round(d, 3)} for i, k, d in ev],
            open(a.json, "w"), indent=1,
        )
        print(f"\n-> {a.json}")


if __name__ == "__main__":
    main()
