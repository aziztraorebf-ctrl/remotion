"""mkprevis-drone-descente.py — PREVIS de CAMERA PURE : drone qui descend EN SE REDRESSANT.

⭐ POURQUOI UN 5e GENERATEUR (et pas un --mode de plus sur mkprevis.py)
Nos generateurs existants filment un INTERIEUR depuis une camera a hauteur d'homme
(couloir, atelier) ou tournent autour d'un sujet. Ici le mouvement est d'une autre
nature : la camera part a la VERTICALE au-dessus du sujet et finit HORIZONTALE devant
lui. Ce n'est ni un push, ni un crane, ni une orbite — c'est une BASCULE D'AXE.
Reference mesuree (Foster « With Confidence », 18,45 -> 20,90 s) :
    18,80 s  vue du dessus, on voit le TOIT
    19,50 s  oblique ~45 deg, on voit toit ET facade
    20,50 s  frontale au sol, on ne voit plus que la FACADE

⭐ CE QUI EST REPRIS DES ACQUIS (chaque ligne a coute un essai ailleurs)
  * NIVEAUX DE GRIS PURS : un previs colore « appelle » la copie de ses couleurs.
    Saturation 0,00 -> le modele n'a que la trajectoire a lire. (gradient 3,4 -> 8,5)
  * ZERO ZONE VIDE : une zone vide du previs se retrouve en bloc gris a l'ecran.
    Le decor couvre donc tout le cadre a chaque frame.
  * REPERES DE PROFONDEUR de TAILLES VARIEES : sans eux la descente est invisible
    (mesure ailleurs : 7,29 -> 13,28). D'ou les arbres de 3 rayons differents et
    les buissons, et non un aplat d'herbe uniforme.
  * AUCUN CORPS DESSINE : ici c'est gratuit, la scene n'a aucun personnage.
    Une maison et des arbres sont du DECOR, pas des corps — rien qui puisse etre
    recopie en « rectangle a tete ».

LA BASCULE, COMMENT ELLE EST DESSINEE
Pas de vraie 3D : on interpole entre deux LECTURES du meme objet.
  * vue du dessus  -> la maison est un quadrilatere large et plat (le toit), les
    arbres sont des DISQUES (on les voit par au-dessus) ;
  * vue frontale   -> la maison est une facade haute (mur + pignon), les arbres
    sont des SILHOUETTES VERTICALES (tronc + houppier).
On interpole la hauteur apparente, la position verticale et la forme des arbres.
C'est grossier — et c'est le but : le previs doit etre LAID, il ne transporte
qu'une trajectoire.

USAGE
  python3 scripts/tools/mkprevis-drone-descente.py --out /tmp/previs-drone --gif
"""

from PIL import Image, ImageDraw
from pathlib import Path

W, H, N = 864, 480, 124  # 124 frames = 5,167 s, le format natif H3

# Palette : gris purs uniquement (R=G=B), aucune couleur a recopier.
G_SKY = (150, 150, 150)
G_GROUND = (120, 120, 120)
G_GRASS_LIGHT = (134, 134, 134)
G_PATH = (176, 176, 176)
G_TREE_DARK = (58, 58, 58)
G_TREE_MID = (78, 78, 78)
G_TREE_LIGHT = (96, 96, 96)
G_ROOF = (44, 44, 44)
G_WALL = (226, 226, 226)
G_SHADOW = (100, 100, 100)


def ease_out(t):
    """Decelere en fin de course : la reference s'amortit sur la derniere seconde."""
    return 1 - (1 - t) ** 3


def lerp(a, b, t):
    return a + (b - a) * t


def draw(i):
    t = i / (N - 1)

    # ── LA TRAJECTOIRE — la seule information que ce previs transporte ──────────
    # tilt 0 = camera verticale (on voit le toit) · 1 = camera horizontale (facade).
    # La bascule occupe le gros du clip puis s'amortit : mesure de la reference,
    # forte descente jusqu'a 19,6 s, amortissement jusqu'a 20,9, puis immobile.
    tilt = ease_out(min(t / 0.62, 1.0))
    # rapprochement simultane : le sujet grandit pendant la bascule.
    zoom = lerp(0.62, 1.18, ease_out(min(t / 0.72, 1.0)))

    img = Image.new('RGB', (W, H), G_SKY)
    d = ImageDraw.Draw(img)

    # L'horizon descend a mesure que la camera se redresse : vu du dessus il
    # n'existe pas (hors cadre en haut), vu de face il est au tiers superieur.
    horizon = lerp(-0.45, 0.34, tilt) * H

    # ── SOL — couvre tout sous l'horizon. Zero zone vide. ─────────────────────
    d.rectangle([0, max(0, horizon), W, H], fill=G_GROUND)
    # taches d'herbe claires : reperes de profondeur au sol
    for (gx, gy, gw) in ((0.14, 0.80, 0.20), (0.62, 0.88, 0.26), (0.86, 0.74, 0.16),
                         (0.36, 0.95, 0.30)):
        y = lerp(gy, gy * 0.90 + 0.10, tilt) * H
        if y > horizon:
            d.ellipse([gx * W - gw * W / 2, y - 0.045 * H,
                       gx * W + gw * W / 2, y + 0.045 * H], fill=G_GRASS_LIGHT)

    # ── LE CHEMIN — repere de profondeur central, il « rentre » dans l'image ──
    py0 = lerp(1.02, 0.99, tilt) * H
    py1 = lerp(0.66, 0.74, tilt) * H
    half0, half1 = lerp(0.10, 0.14, tilt) * W, lerp(0.030, 0.020, tilt) * W
    if py1 > horizon:
        d.polygon([(W * 0.47 - half0, py0), (W * 0.47 + half0, py0),
                   (W * 0.52 + half1, py1), (W * 0.52 - half1, py1)], fill=G_PATH)

    # ── LA MAISON ────────────────────────────────────────────────────────────
    # Vue du dessus : un toit large et plat, centre haut. Vue de face : une
    # facade haute posee au sol. On interpole les deux lectures.
    cx = W * 0.50
    cy = lerp(0.42, 0.58, tilt) * H
    hw = lerp(0.30, 0.21, tilt) * W * zoom          # demi-largeur
    roof_h = lerp(0.26, 0.10, tilt) * H * zoom      # le toit s'ecrase de profil
    wall_h = lerp(0.02, 0.20, tilt) * H * zoom      # le mur apparait en se redressant

    # toit : trapeze vu du dessus -> triangle de pignon vu de face
    roof_top_half = lerp(0.62, 0.30, tilt)
    d.polygon([(cx - hw, cy + roof_h / 2),
               (cx + hw, cy + roof_h / 2),
               (cx + hw * roof_top_half, cy - roof_h / 2),
               (cx - hw * roof_top_half, cy - roof_h / 2)], fill=G_ROOF)
    # mur : inexistant vu du dessus, plein cadre du sujet vu de face
    if wall_h > 2:
        d.rectangle([cx - hw * 0.92, cy + roof_h / 2,
                     cx + hw * 0.92, cy + roof_h / 2 + wall_h], fill=G_WALL)
        # ouvertures : donnent une echelle et de la matiere a la facade
        for ox in (-0.55, 0.55):
            d.rectangle([cx + ox * hw - hw * 0.13, cy + roof_h / 2 + wall_h * 0.22,
                         cx + ox * hw + hw * 0.13, cy + roof_h / 2 + wall_h * 0.62],
                        fill=G_ROOF)
        d.rectangle([cx - hw * 0.09, cy + roof_h / 2 + wall_h * 0.34,
                     cx + hw * 0.09, cy + roof_h / 2 + wall_h], fill=G_ROOF)
    # ombre portee au sol : ancre la maison, evite qu'elle « flotte »
    d.ellipse([cx - hw * 1.05, cy + roof_h / 2 + wall_h - 0.03 * H,
               cx + hw * 1.05, cy + roof_h / 2 + wall_h + 0.04 * H], fill=G_SHADOW)

    # ── LES ARBRES — disques vus du dessus, silhouettes verticales vues de face ─
    # 3 rayons distincts = les reperes de profondeur qui rendent la descente lisible.
    trees = ((0.07, 0.30, 0.115), (0.20, 0.16, 0.085), (0.33, 0.09, 0.062),
             (0.67, 0.10, 0.070), (0.80, 0.17, 0.098), (0.93, 0.32, 0.120),
             (0.12, 0.62, 0.100), (0.88, 0.60, 0.092),
             (0.28, 0.05, 0.055), (0.72, 0.04, 0.050))
    for (tx, ty, tr) in trees:
        x = lerp(tx, 0.5 + (tx - 0.5) * 1.28, tilt) * W
        y = lerp(ty, ty * 0.42 + 0.30, tilt) * H
        r = tr * W * zoom
        col = G_TREE_DARK if tr > 0.10 else (G_TREE_MID if tr > 0.07 else G_TREE_LIGHT)
        # houppier : cercle dans les deux lectures, mais il monte au-dessus du
        # tronc quand la camera se redresse
        crown_y = y - lerp(0.0, 0.10, tilt) * H
        d.ellipse([x - r, crown_y - r, x + r, crown_y + r], fill=col)
        # tronc : invisible vu du dessus, franc vu de face
        trunk_h = lerp(0.0, 0.13, tilt) * H
        if trunk_h > 2:
            d.rectangle([x - r * 0.16, crown_y + r * 0.5,
                         x + r * 0.16, crown_y + r * 0.5 + trunk_h], fill=G_TREE_DARK)

    return img


if __name__ == '__main__':
    import argparse, subprocess, shutil
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--frames', type=int, default=124,
                    help='124 = 5,167 s (format natif H3)')
    ap.add_argument('--out', default='previs_drone')
    ap.add_argument('--gif', action='store_true',
                    help='REQUIS pour ref_videos — upload_file refuse les .mp4')
    ap.add_argument('--fps', type=int, default=24)
    a = ap.parse_args()

    globals()['N'] = a.frames
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    for i in range(a.frames):
        draw(i).save(out / f'f_{i:04d}.png')
    print(f"drone-descente: {a.frames} frames -> {out}/  ({a.frames/a.fps:.3f} s)")

    if a.gif:
        if not shutil.which('ffmpeg'):
            print("ffmpeg introuvable"); raise SystemExit(1)
        mp4, gif = f'{out}.mp4', f'{out}.gif'
        subprocess.run(['ffmpeg', '-v', 'error', '-framerate', str(a.fps),
                        '-i', str(out / 'f_%04d.png'), '-c:v', 'libx264', '-crf', '16',
                        '-pix_fmt', 'yuv420p', mp4, '-y'], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf',
                        f'fps={a.fps},scale=864:480:flags=lanczos', '-loop', '0', gif, '-y'],
                       check=True)
        print(f"  -> {gif}")
