"""mkprevis-chantier.py — PREVIS du hook Gazoduc : ouvrier de nuit sur le chantier d'Adrar.

2e cas d'usage reel de la methode previs (le 1er est le scribe, `mkprevis.py --mode combo`).
Le decor de `mkprevis.py` est celui du scribe et son entete le dit : defaut surchargeable,
"ne pas abstraire avant un 2e cas d'usage reel". Ce fichier EST ce 2e cas : meme MECANIQUE
validee, decor et geste differents. On ne generalise toujours pas — deux cas concrets d'abord.

CE QUI EST REPRIS TEL QUEL (acquis mesures, ne pas desactiver)
  * NIVEAUX DE GRIS  : un previs colore se fait copier (gradient min 3,42 -> 8,52)
  * ZERO ZONE VIDE   : chaque pixel appartient a une surface (sol, ciel, talus, corps)
  * CLAMP ANATOMIQUE : bras <= 0,95x le buste
  * 2 PHASES DE NATURES DIFFERENTES : camera fixe 0-5 s, puis push-in 5-10,2 s
  * 245 frames = 10,2 s (grille interne de H3)

CE QUI EST NOUVEAU ICI
  * Decor exterieur nocturne : ciel, talus de sable, TRANCHEE qui barre le premier plan
  * Geste : l'ouvrier CREUSE (3 coups de pelle) puis SE REDRESSE
  * ⭐ FIX DU MORPHING DES JAMBES : le redressement est decompose en 3 temps explicites avec
    des blocs de jambes DISTINCTS (flechi -> appui/poussee -> tendu), au lieu du seul
    delta-hauteur du bloc-corps qui avait produit un fondu des jambes sur le scribe.
  * La PELLE est dessinee a CHAQUE frame (jamais absente) — regle de l'objet manipule.

USAGE
  python3 scripts/tools/mkprevis-chantier.py --out /tmp/previs-chantier --gif
"""

from PIL import Image, ImageDraw
from pathlib import Path

W, H, N = 864, 480, 245

# Palette 100 % grise — aucune couleur a imiter, seulement la geometrie.
G_SKY, G_DUNE_FAR, G_DUNE_NEAR = (30, 30, 30), (92, 92, 92), (118, 118, 118)
G_GROUND, G_TRENCH, G_TRENCH_LIP = (140, 140, 140), (44, 44, 44), (168, 168, 168)
G_BODY, G_HEAD, G_HELMET, G_ARM = (85, 85, 85), (200, 200, 200), (225, 225, 225), (150, 150, 150)
G_LEG, G_SPADE, G_MAST, G_LAMP = (70, 70, 70), (238, 238, 238), (150, 150, 150), (250, 250, 250)


def ease(t):
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def lerp(a, b, t):
    return a + (b - a) * t


def draw(i):
    t = i / (N - 1)
    ts = t * 10.208                       # temps en secondes

    # ---- CAMERA : fixe 0-5 s, push-in 5-10,2 s (2 phases de natures differentes) ----
    # Centre vise legerement plus bas que le sujet : garde la TRANCHEE dans le cadre au zoom max
    # (c'est elle qui dit "on creuse deja"), et cadre l'ouvrier plus pres des 2/3 hauts.
    z = 1.0 if ts < 5.0 else lerp(1.0, 1.20, ease((ts - 5.0) / 5.2))
    # cy suit le sujet : il se REDRESSE pendant le push, viser trop bas lui coupe la tete.
    cy_track = lerp(H * 0.70, H * 0.58, 0.0 if ts < 5.4 else min(1.0, (ts - 5.4) / 2.6))
    cx_cam, cy_cam = W * 0.42, cy_track

    img = Image.new('RGB', (W, H), G_SKY)
    d = ImageDraw.Draw(img)

    def P(x, y):
        return ((x * W - cx_cam) * z + W / 2, (y * H - cy_cam) * z + H / 2)

    def R(x0, y0, x1, y1, col):
        d.rectangle([P(x0, y0), P(x1, y1)], fill=col)

    # ---- DECOR : zero zone vide, tout l'ecran est couvert meme au zoom max ----
    R(-0.5, -0.5, 1.5, 0.42, G_SKY)            # ciel de nuit
    R(-0.5, 0.34, 1.5, 0.52, G_DUNE_FAR)       # dunes lointaines
    R(-0.5, 0.46, 1.5, 0.60, G_DUNE_NEAR)      # talus proche
    R(-0.5, 0.58, 1.5, 1.5, G_GROUND)          # sol du chantier
    # tranchee : barre le premier plan, c'est le sujet du plan
    R(-0.5, 0.86, 1.5, 0.90, G_TRENCH_LIP)     # levre eclairee
    R(-0.5, 0.90, 1.5, 1.5, G_TRENCH)          # entaille sombre

    # ---- REPERES DE PROFONDEUR ----
    # Sans eux le decor n'est qu'un empilement de bandes horizontales : le push-in devient
    # invisible autour du sujet (mesure : 7,29 sur la bande mediane contre 45 sur le sol).
    # Des volumes de TAILLES DIFFERENTES a des profondeurs differentes grossissent
    # visiblement pendant le zoom et donnent a H3 de quoi construire la perspective.
    for (jx, jy, jw) in ((0.055, 0.615, 0.011), (0.215, 0.640, 0.014),
                         (0.640, 0.645, 0.015), (0.815, 0.625, 0.012)):
        R(jx - jw, jy - 0.075, jx + jw, jy, G_MAST)          # jalons de piquetage
        R(jx - jw * 1.9, jy - 0.092, jx + jw * 1.9, jy - 0.072, G_LAMP)
    # tas de sable extrait, de part et d'autre — volumes proches, forte croissance au zoom
    R(0.115, 0.760, 0.290, 0.862, G_DUNE_NEAR)
    R(0.610, 0.735, 0.845, 0.862, G_DUNE_NEAR)
    R(0.655, 0.700, 0.800, 0.740, G_DUNE_FAR)
    # segments de conduite en attente le long de la tranchee (le sujet de l'episode)
    for (px0, px1) in ((0.020, 0.185), (0.230, 0.360), (0.700, 0.880)):
        R(px0, 0.905, px1, 0.945, G_TRENCH_LIP)
    # mats d'eclairage de chantier : donnent la profondeur et justifient la lumiere
    for mx in (0.10, 0.86):
        R(mx - 0.008, 0.30, mx + 0.008, 0.62, G_MAST)
        R(mx - 0.030, 0.265, mx + 0.030, 0.305, G_LAMP)

    # ---- SUJET : l'ouvrier, de trois quarts, au bord de la tranchee ----
    # Il occupe une bonne part de la hauteur : c'est un plan qui doit porter la couche HUMAINE,
    # une silhouette lointaine ne la porterait pas.
    cx = 0.40
    feet_y = 0.86                              # pieds au bord de la tranchee

    # 3 coups de pelle (0-5,4 s) : le buste plonge et se releve, cycle court
    if ts < 5.4:
        cycle = (ts % 1.8) / 1.8
        dig = ease(cycle * 2) if cycle < 0.5 else ease((1 - cycle) * 2)
    else:
        dig = 0.0

    # ⭐ REDRESSEMENT DECOMPOSE EN 3 TEMPS (fix du morphing des jambes)
    #   p1 5,4-6,6 s : flechi, en appui — les 2 jambes plient
    #   p2 6,6-8,0 s : poussee — la jambe avant se tend en premier, l'arriere suit
    #   p3 8,0-10,2 s : debout, les 2 jambes tendues, immobile
    if ts < 5.4:
        p1 = p2 = 0.0
    elif ts < 6.6:
        p1, p2 = ease((ts - 5.4) / 1.2), 0.0
    elif ts < 8.0:
        p1, p2 = 1.0, ease((ts - 6.6) / 1.4)
    else:
        p1 = p2 = 1.0

    # hauteur du buste : penche (creuse) -> flechi -> redresse
    lean = 0.055 * dig                          # plongee du buste pendant le coup de pelle
    body_h = lerp(lerp(0.203, 0.235, p1), 0.333, p2) - lean
    bw = lerp(0.057, 0.050, p2)
    hip_y = feet_y - lerp(lerp(0.086, 0.106, p1), 0.167, p2)   # hauteur de hanche
    top = hip_y - body_h

    # --- JAMBES : 2 blocs DISTINCTS, jamais fondus dans le buste ---
    # jambe avant (celle qui pousse en premier) et jambe arriere, ecartees lateralement
    knee_drop_front = lerp(lerp(0.056, 0.071, p1), 0.012, p2)
    knee_drop_back = lerp(lerp(0.050, 0.066, p1), 0.018, min(1.0, p2 * 0.8))
    fx, bx = cx + 0.030, cx - 0.034            # ecartement des appuis
    # cuisse puis tibia, chaque segment visible separement
    R(fx - 0.019, hip_y, fx + 0.019, hip_y + knee_drop_front, G_LEG)
    R(fx - 0.016, hip_y + knee_drop_front, fx + 0.016, feet_y, G_LEG)
    R(bx - 0.019, hip_y, bx + 0.019, hip_y + knee_drop_back, G_LEG)
    R(bx - 0.016, hip_y + knee_drop_back, bx + 0.016, feet_y, G_LEG)

    # --- BUSTE + TETE + CASQUE ---
    R(cx - bw, top, cx + bw, hip_y, G_BODY)
    head_h = 0.088
    R(cx - 0.038, top - head_h, cx + 0.038, top, G_HEAD)
    R(cx - 0.046, top - head_h - 0.028, cx + 0.046, top - head_h, G_HELMET)

    # --- BRAS + PELLE : la pelle est dessinee a CHAQUE frame ---
    shoulder = (cx + 0.040, top + 0.045)
    buste_px = body_h * H
    max_reach = buste_px * 0.95                # clamp anatomique (<= 1,0x le buste)

    if ts < 5.4:                               # creuse : la pelle plonge vers la tranchee
        hand = (lerp(0.470, 0.505, dig), lerp(0.760, 0.870, dig))
    elif ts < 8.0:                             # se redresse : la pelle remonte avec lui
        q = ease((ts - 5.4) / 2.6)
        hand = (lerp(0.505, 0.478, q), lerp(0.870, 0.720, q))
    else:                                      # debout : pelle tenue verticale, au repos
        hand = (0.478, 0.720)

    hx, hy = hand
    dx, dy = (hx - shoulder[0]) * W, (hy - shoulder[1]) * H
    dist = (dx * dx + dy * dy) ** 0.5
    if dist > max_reach and dist > 0:
        k = max_reach / dist
        hx, hy = shoulder[0] + dx * k / W, shoulder[1] + dy * k / H

    d.line([P(*shoulder), P(hx, hy)], fill=G_ARM, width=max(2, int(H * 0.038 * z)))
    R(hx - 0.015, hy - 0.026, hx + 0.015, hy + 0.026, G_ARM)

    # manche de pelle : de la main vers le sol pendant le creusement, vertical ensuite
    if ts < 8.0:
        tip = (hx + 0.030, min(0.955, hy + 0.075))
    else:
        tip = (hx + 0.010, hy + 0.120)
    d.line([P(hx, hy), P(*tip)], fill=G_SPADE, width=max(2, int(H * 0.016 * z)))
    R(tip[0] - 0.026, tip[1] - 0.006, tip[0] + 0.026, tip[1] + 0.022, G_SPADE)  # lame

    return img


if __name__ == '__main__':
    import argparse, subprocess, shutil
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--frames', type=int, default=245, help='245 = 10,2 s')
    ap.add_argument('--out', default='previs_chantier')
    ap.add_argument('--gif', action='store_true',
                    help='exporte aussi le GIF — REQUIS pour ref_videos')
    ap.add_argument('--fps', type=int, default=24)
    a = ap.parse_args()

    globals()['N'] = a.frames
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    for i in range(a.frames):
        draw(i).save(out / f'f_{i:04d}.png')
    print(f"chantier: {a.frames} frames -> {out}/  ({a.frames/a.fps:.3f} s)")

    if a.gif:
        if not shutil.which('ffmpeg'):
            print("ffmpeg introuvable — GIF non genere"); raise SystemExit(1)
        mp4, gif = f'{out}.mp4', f'{out}.gif'
        subprocess.run(['ffmpeg', '-v', 'error', '-framerate', str(a.fps),
                        '-i', str(out / 'f_%04d.png'), '-c:v', 'libx264', '-crf', '16',
                        '-pix_fmt', 'yuv420p', mp4, '-y'], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf',
                        f'fps={a.fps},scale=864:480:flags=lanczos', '-loop', '0', gif, '-y'], check=True)
        print(f"  -> {mp4}\n  -> {gif}")
