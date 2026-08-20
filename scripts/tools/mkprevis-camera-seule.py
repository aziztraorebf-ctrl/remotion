"""mkprevis-camera-seule.py — PREVIS de CAMERA PURE : aucun corps dessine.

⭐ TEST DE LA LIGNE DE PARTAGE (2026-08-19, hypothese d'Aziz).
Le previs du couloir b5 dessinait DEUX CORPS ENTIERS. H3 les a recopies tels quels : deux
rectangles gris avec un rectangle-tete, en plein ecran a 4 s. Diagnostic : un previs est un canal
VISUEL, donc il transporte une APPARENCE en meme temps qu'une trajectoire.
  * La CAMERA n'a pas de forme propre — il n'y a rien a recopier. Le previs est gratuit.
  * Un CORPS a une forme. Dessiner un bloc pour dire "ce corps se deplace ainsi" donne aussi au
    modele une apparence de bloc, qu'il n'a aucune raison de refuser.
=> Ce generateur ne dessine QUE le decor et le mouvement de camera. Les personnages sont pilotes
   par le PROMPT (format officiel H3, cf memory/tools/minimax-h3-styles-tests.md).

CE QUI EST REPRIS (acquis mesures)
  * NIVEAUX DE GRIS · ZERO ZONE VIDE · 245 frames = 10,2 s
  * REPERES DE PROFONDEUR : sans eux le push-in est invisible (7,29 -> 13,28)

USAGE
  python3 scripts/tools/mkprevis-camera-seule.py --out /tmp/previs-cam --gif
"""

from PIL import Image, ImageDraw
from pathlib import Path

W, H, N = 864, 480, 245

G_CEIL, G_WALL, G_FLOOR = (34, 34, 34), (96, 96, 96), (146, 146, 146)
G_WALL_FAR, G_DOORWAY, G_DOOR = (72, 72, 72), (40, 40, 40), (186, 186, 186)
G_BENCH, G_HELMET, G_PIPE = (112, 112, 112), (250, 250, 250), (130, 130, 130)


def ease(t):
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def lerp(a, b, t):
    return a + (b - a) * t


def draw(i):
    t = i / (N - 1)
    ts = t * 10.208

    # CAMERA : immobile 0-7,2 s, puis un seul push-in doux jusqu'a la fin.
    # C'est la SEULE information que ce previs transporte.
    z = 1.0 if ts < 7.2 else lerp(1.0, 1.13, ease((ts - 7.2) / 3.0))
    cx_cam, cy_cam = W * 0.50, H * 0.62

    img = Image.new('RGB', (W, H), G_WALL)
    d = ImageDraw.Draw(img)

    def P(x, y):
        return ((x * W - cx_cam) * z + W / 2, (y * H - cy_cam) * z + H / 2)

    def R(x0, y0, x1, y1, col):
        d.rectangle([P(x0, y0), P(x1, y1)], fill=col)

    # ---- DECOR SEUL : le couloir, immobile. Zero zone vide. ----
    R(-0.5, -0.5, 1.5, 0.14, G_CEIL)
    R(-0.5, 0.12, 1.5, 0.78, G_WALL)
    R(0.30, 0.20, 0.70, 0.72, G_WALL_FAR)
    R(-0.5, 0.74, 1.5, 1.5, G_FLOOR)
    # les 2 portes, ouvertes en permanence (leur fermeture est decrite dans le PROMPT,
    # pas dessinee ici — une porte qui se ferme est un mouvement d'OBJET, pas de camera)
    for (dx0, dx1) in ((0.085, 0.215), (0.785, 0.915)):
        R(dx0, 0.235, dx1, 0.760, G_DOORWAY)
        R(dx0, 0.235, dx0 + 0.018, 0.760, G_DOOR)
    # mobilier + reperes de profondeur (necessaires pour que le push-in soit lisible)
    R(0.365, 0.560, 0.470, 0.740, G_BENCH)
    R(0.392, 0.512, 0.444, 0.562, G_HELMET)
    R(0.545, 0.585, 0.660, 0.740, G_BENCH)
    R(0.567, 0.545, 0.640, 0.590, G_PIPE)
    for lx in (0.255, 0.745):
        R(lx - 0.038, 0.145, lx + 0.038, 0.178, G_HELMET)

    # ⛔ AUCUN PERSONNAGE N'EST DESSINE. C'est tout l'objet de ce fichier.
    return img


if __name__ == '__main__':
    import argparse, subprocess, shutil
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--frames', type=int, default=245)
    ap.add_argument('--out', default='previs_cam')
    ap.add_argument('--gif', action='store_true')
    ap.add_argument('--fps', type=int, default=24)
    a = ap.parse_args()

    globals()['N'] = a.frames
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    for i in range(a.frames):
        draw(i).save(out / f'f_{i:04d}.png')
    print(f"camera-seule: {a.frames} frames -> {out}/  ({a.frames/a.fps:.3f} s)")

    if a.gif:
        if not shutil.which('ffmpeg'):
            print("ffmpeg introuvable"); raise SystemExit(1)
        mp4, gif = f'{out}.mp4', f'{out}.gif'
        subprocess.run(['ffmpeg', '-v', 'error', '-framerate', str(a.fps),
                        '-i', str(out / 'f_%04d.png'), '-c:v', 'libx264', '-crf', '16',
                        '-pix_fmt', 'yuv420p', mp4, '-y'], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf',
                        f'fps={a.fps},scale=864:480:flags=lanczos', '-loop', '0', gif, '-y'], check=True)
        print(f"  -> {gif}")
