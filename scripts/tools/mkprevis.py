"""mkprevis.py — generateur de PREVIS pour piloter un clip genere MiniMax H3.

Un previs = une video de reference en geometrie grossiere qui MONTRE au modele le mouvement
(camera et/ou geste) au lieu de le DECRIRE en mots. Branche sur `ref_videos` via un GIF.
Doctrine + gotchas : memory/fiches/FICHE-CLIP-GENERE.md (auto-injectee).

REGLAGES PAR DEFAUT — ce sont des acquis mesures, ne pas les desactiver sans raison :
  * NIVEAUX DE GRIS  : un previs colore se fait COPIER par le modele (gradient min 3,42 -> 8,52 en gris)
  * ZERO ZONE VIDE   : un trou dans le previs (17-19 %) fait decrocher le style
  * CLAMP ANATOMIQUE : bras <= 1,0x le buste (un previs a 1,63x a produit un bras etire)
  * MEME LONGUEUR    : 124 frames = 5,167 s · 245 frames = 10,2 s (grille interne de H3)

USAGE
  python3 scripts/tools/mkprevis.py --mode combo --out /tmp/previs --gif
  python3 scripts/tools/mkprevis.py --mode orbit --frames 124 --gif
  modes : push | lateral | orbit | crane | dolly | lever | bras | combo

⛔ Le decor est celui de la scene de reference (niches, table, jarres, fenetre). C'est un DEFAUT
   surchargeable, pas un moteur generique : ne pas abstraire avant un 2e cas d'usage reel.
"""

from PIL import Image, ImageDraw
from pathlib import Path

W, H, N = 864, 480, 245

G_CEIL, G_WALL, G_NICHE = (38,38,38), (105,105,105), (58,58,58)
G_FLOOR, G_TABLE = (140,140,140), (170,170,170)
G_BODY, G_HEAD, G_ARM = (85,85,85), (200,200,200), (150,150,150)
G_LIGHT, G_JAR, G_PEN = (245,245,245), (120,120,120), (235,235,235)


def ease(t): return 4*t**3 if t < 0.5 else 1-(-2*t+2)**3/2
def lerp(a, b, t): return a+(b-a)*t


def draw(i):
    t = i/(N-1)
    ts = t*10.208                      # temps en secondes

    # ---- CAMERA : fixe 0-5 s, push-in 5-10 s ----
    if ts < 5.0:
        z = 1.0
    else:
        z = lerp(1.0, 1.34, ease((ts-5.0)/5.2))
    cx_cam, cy_cam = W*0.46, H*0.56

    img = Image.new('RGB', (W, H), G_WALL)
    d = ImageDraw.Draw(img)

    def R(x0, y0, x1, y1, col):
        pts = []
        for (x, y) in ((x0, y0), (x1, y1)):
            pts.append(((x*W-cx_cam)*z+W/2, (y*H-cy_cam)*z+H/2))
        d.rectangle([pts[0], pts[1]], fill=col)

    def P(x, y):
        return ((x*W-cx_cam)*z+W/2, (y*H-cy_cam)*z+H/2)

    R(-0.4, -0.4, 1.4, 0.22, G_CEIL)
    R(-0.4, 0.22, 1.4, 0.76, G_WALL)
    R(-0.4, 0.76, 1.4, 1.4, G_FLOOR)
    for x in (0.06, 0.26, 0.60, 0.80):
        for row in (0.30, 0.50):
            R(x, row, x+0.13, row+0.14, G_NICHE)
    R(0.90, 0.26, 0.955, 0.44, G_LIGHT)
    R(0.02, 0.82, 0.09, 1.0, G_JAR)
    R(0.93, 0.82, 0.99, 1.0, G_JAR)

    # ---- SUJET ----
    # phase lever : 6.0 s -> 8.0 s
    p_lever = 0.0 if ts < 6.0 else (ease(min(1.0, (ts-6.0)/2.0)))
    body_h = lerp(0.26, 0.46, p_lever)         # assis -> debout (fractions de H)
    bw     = lerp(0.075, 0.055, p_lever)
    feet_y = 0.76
    top    = feet_y-body_h
    cx     = 0.40
    R(cx-bw, top, cx+bw, feet_y, G_BODY)
    R(cx-0.042, top-0.115, cx+0.042, top, G_HEAD)
    R(0.47, 0.66, 0.68, 0.705, G_TABLE)        # table, immobile

    # ---- BRAS : proportion anatomique (<= 1.0x le buste) ----
    shoulder = (cx+0.045, top+0.05)
    buste_px = body_h*H
    max_reach = buste_px*0.95                  # <- correction v5 (etait 1.63x)
    # la plume : tenue en main 0-3.4 s, posee sur la table apres
    pen_on_table = (0.545, 0.655)
    if ts < 3.4:                               # ecrit : main au-dessus du manuscrit
        hand = (0.505, 0.645)
        pen_pos, pen_held = hand, True
    elif ts < 4.6:                             # POSE la plume (geste aller)
        q = ease((ts-3.4)/1.2)
        hand = (lerp(0.505, pen_on_table[0], q), lerp(0.645, pen_on_table[1], q))
        pen_pos, pen_held = hand, True
    else:                                      # main revient, la plume RESTE posee
        q = ease(min(1.0, (ts-4.6)/1.0))
        hand = (lerp(pen_on_table[0], cx+0.055, q), lerp(pen_on_table[1], top+0.09, q))
        pen_pos, pen_held = pen_on_table, False

    # clamp anatomique de la main
    hx, hy = hand
    dx, dy = (hx-shoulder[0])*W, (hy-shoulder[1])*H
    dist = (dx*dx+dy*dy)**0.5
    if dist > max_reach and dist > 0:
        k = max_reach/dist
        hx = shoulder[0]+dx*k/W
        hy = shoulder[1]+dy*k/H

    d.line([P(*shoulder), P(hx, hy)], fill=G_ARM, width=max(2, int(H*0.042*z)))
    R(hx-0.016, hy-0.028, hx+0.016, hy+0.028, G_ARM)
    # la plume : toujours dessinee, soit dans la main soit sur la table
    px, py = (hx, hy) if pen_held else pen_pos
    R(px-0.022, py-0.012, px+0.022, py-0.004, G_PEN)
    return img


if __name__ == '__main__':
    import argparse, subprocess, shutil
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--mode', default='combo',
                    choices=['push', 'lateral', 'orbit', 'crane', 'dolly', 'lever', 'bras', 'combo'])
    ap.add_argument('--frames', type=int, default=None,
                    help='124 = 5,167 s (defaut) · 245 = 10,2 s (defaut du mode combo)')
    ap.add_argument('--out', default='previs_out')
    ap.add_argument('--gif', action='store_true',
                    help='exporte aussi le GIF — REQUIS pour ref_videos (upload_file refuse les .mp4)')
    ap.add_argument('--fps', type=int, default=24)
    a = ap.parse_args()

    n = a.frames or (245 if a.mode == 'combo' else 124)
    globals()['N'] = n
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    for i in range(n):
        draw(i).save(out / f'f_{i:04d}.png')
    print(f"{a.mode}: {n} frames -> {out}/  ({n/a.fps:.3f} s)")

    if a.gif:
        if not shutil.which('ffmpeg'):
            print("ffmpeg introuvable — GIF non genere"); raise SystemExit(1)
        mp4, gif = f'{out}.mp4', f'{out}.gif'
        subprocess.run(['ffmpeg', '-v', 'error', '-framerate', str(a.fps),
                        '-i', str(out / 'f_%04d.png'), '-c:v', 'libx264', '-crf', '16',
                        '-pix_fmt', 'yuv420p', mp4, '-y'], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf',
                        f'fps={a.fps},scale=864:480:flags=lanczos', '-loop', '0', gif, '-y'], check=True)
        print(f"  -> {mp4}\n  -> {gif}  (a uploader puis brancher sur ref_videos via LoadImage)")
