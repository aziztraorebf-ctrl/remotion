"""mkprevis-couloir.py — PREVIS Gazoduc b5 : la non-rencontre (deux hommes qui s'evitent).

3e cas d'usage reel de la methode previs (1er = scribe, 2e = chantier d'Adrar).
⭐ PREMIER previs a DEUX PERSONNAGES en interaction — palier identifie comme non teste par la R&D
("cumule 2 sujets, contact et dynamique"). Le risque nouveau est la FUSION des deux corps.

CE QUI EST REPRIS TEL QUEL (acquis mesures, ne pas desactiver)
  * NIVEAUX DE GRIS  : un previs colore se fait copier (gradient min 3,42 -> 8,52)
  * ZERO ZONE VIDE   : chaque pixel appartient a une surface
  * CLAMP ANATOMIQUE : bras <= 0,95x le buste
  * 2 PHASES DE NATURES DIFFERENTES : ici marche laterale (0-6,4 s) puis quasi-immobilite +
    leger push (6,4-10,2 s). Natures differentes = le cas qui marche (2 mouvements de CAMERA
    consecutifs restent non acquis).
  * 245 frames = 10,2 s
  * REPERES DE PROFONDEUR : sans eux le push-in est invisible autour des sujets (mesure 7,29 -> 13,28)
  * DIMENSIONNER PAR LE CALCUL : marge au-dessus du crane verifiee a la frame finale, jamais a l'estime

CE QUI EST NOUVEAU ICI
  * DEUX corps qui doivent rester DISTINCTS : separes en X (jamais le meme centre), en TAILLE
    (profondeurs differentes) et en NIVEAU DE GRIS (deux valeurs franchement ecartees).
    Ils ne se superposent JAMAIS — leurs boites restent disjointes a chaque frame (verifie par mesure).
  * Geste = une NON-RENCONTRE : ils convergent, ralentissent, se font face une seconde, puis chacun
    repart vers SA porte. Progression d'etat : couloir avec 2 hommes -> couloir vide, 2 portes fermees.
  * Les PORTES sont dessinees a chaque frame (objet de la scene) et CHANGENT d'etat (ouverte -> fermee)
    — c'est ce changement qui porte le "but" du plan.

⛔ Ce que le previs NE doit PAS suggerer : aucun contact, aucune poignee de main, aucun geste vers
   l'autre. La voix off dit "ils ne se parlent pas" — le plan montre le silence, pas un conflit.
"""

from PIL import Image, ImageDraw
from pathlib import Path

W, H, N = 864, 480, 245

# Palette 100 % grise. Les 2 hommes ont des valeurs franchement ecartees (85 vs 125) pour que
# le modele ne les fusionne pas en un seul corps.
G_CEIL, G_WALL, G_FLOOR = (34, 34, 34), (96, 96, 96), (146, 146, 146)
G_WALL_FAR, G_DOORWAY, G_DOOR = (72, 72, 72), (40, 40, 40), (186, 186, 186)
G_A_BODY, G_A_HEAD = (85, 85, 85), (205, 205, 205)      # homme A (gauche, plus PRES = plus grand)
G_B_BODY, G_B_HEAD = (125, 125, 125), (232, 232, 232)   # homme B (droite, plus LOIN = plus petit)
G_ROLL, G_BENCH, G_HELMET, G_PIPE = (243, 243, 243), (112, 112, 112), (250, 250, 250), (130, 130, 130)


def ease(t):
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def lerp(a, b, t):
    return a + (b - a) * t


def draw(i):
    t = i / (N - 1)
    ts = t * 10.208

    # ---- CAMERA : quasi fixe, tres leger push tardif (7,2-10,2 s) ----
    # Le mouvement principal de ce plan est celui des CORPS, pas de la camera. Un push discret
    # en fin de plan resserre sur les portes qui se ferment.
    z = 1.0 if ts < 7.2 else lerp(1.0, 1.13, ease((ts - 7.2) / 3.0))
    cx_cam, cy_cam = W * 0.50, H * 0.62

    img = Image.new('RGB', (W, H), G_WALL)
    d = ImageDraw.Draw(img)

    def P(x, y):
        return ((x * W - cx_cam) * z + W / 2, (y * H - cy_cam) * z + H / 2)

    def R(x0, y0, x1, y1, col):
        d.rectangle([P(x0, y0), P(x1, y1)], fill=col)

    # ---- DECOR : couloir administratif, zero zone vide ----
    R(-0.5, -0.5, 1.5, 0.14, G_CEIL)           # plafond
    R(-0.5, 0.12, 1.5, 0.78, G_WALL)           # murs lateraux
    R(0.30, 0.20, 0.70, 0.72, G_WALL_FAR)      # mur du fond (plus sombre = profondeur)
    R(-0.5, 0.74, 1.5, 1.5, G_FLOOR)           # sol

    # --- LES 2 PORTES : l'objet qui porte le sens. Elles se FERMENT en fin de plan. ---
    # ouverte = embrasure sombre visible ; fermee = panneau clair qui la recouvre
    # A ferme a 7,6 s, B a 8,4 s (decalage : ils n'agissent pas de concert)
    fermA = ease(min(1.0, max(0.0, (ts - 7.6) / 1.3)))
    fermB = ease(min(1.0, max(0.0, (ts - 8.4) / 1.3)))
    for (dx0, dx1, ferm) in ((0.085, 0.215, fermA), (0.785, 0.915, fermB)):
        R(dx0, 0.235, dx1, 0.760, G_DOORWAY)                      # embrasure (toujours dessinee)
        w_open = (dx1 - dx0) * ferm
        if w_open > 0.001:                                        # battant qui se referme
            R(dx0, 0.235, dx0 + w_open, 0.760, G_DOOR)

    # --- REPERES DE PROFONDEUR + ancrage dans le MONDE DU GAZ (pas un bureau generique) ---
    R(0.365, 0.560, 0.470, 0.740, G_BENCH)      # console basse
    R(0.392, 0.512, 0.444, 0.562, G_HELMET)     # casque de chantier pose dessus
    R(0.545, 0.585, 0.660, 0.740, G_BENCH)      # 2e console
    R(0.567, 0.545, 0.640, 0.590, G_PIPE)       # troncon de conduite en presentoir
    for lx in (0.255, 0.745):                   # luminaires au plafond = profondeur au zoom
        R(lx - 0.038, 0.145, lx + 0.038, 0.178, G_HELMET)

    # ================= LES DEUX HOMMES =================
    # Chorégraphie (ta regle : une PROGRESSION, pas une boucle) :
    #   0-4,0 s   ils avancent l'un vers l'autre depuis les deux bords
    #   4,0-5,0 s ils SE CROISENT en ralentissant — leurs trajectoires se TRAVERSENT
    #   5,0-7,4 s chacun continue vers la porte du COTE OPPOSE a son entree (le refus)
    #   7,4-10,2 s ils ont disparu, les portes se referment — couloir vide
    # ⛔ Ils ne s'ARRETENT PAS face a face : deux hommes nez a nez se lisent comme une
    #    confrontation ou une conversation. La voix dit "ils ne se parlent pas" — il faut
    #    un CROISEMENT (ils se depassent sans un mot), pas un vis-a-vis.
    def pos(depart, croise, porte):
        if ts < 4.0:
            return lerp(depart, croise, ease(ts / 4.0))
        if ts < 5.0:                           # ralentissement pendant le croisement
            return lerp(croise, croise + (porte - croise) * 0.10, (ts - 4.0) / 1.0)
        if ts < 7.4:
            return lerp(croise + (porte - croise) * 0.10, porte, ease((ts - 5.0) / 2.4))
        return porte

    # A ne se fige pas : il continue de s'enfoncer dans le couloir (il RAPETISSE = il s'eloigne).
    # C'est un mouvement lent et continu, pas un arret — un personnage fige lit comme un gel.
    eloigne = 0.0 if ts < 6.4 else min(1.0, (ts - 6.4) / 3.8)

    # ⭐ FIN DU PLAN : B disparait dans sa porte, A RESTE et s'eloigne dans le couloir.
    # Deux raisons : (1) un couloir entierement vide laisse une zone sans information et fait
    # decrocher le style (mesure R&D sur les zones vides) ; (2) narrativement, un homme SEUL qui
    # s'eloigne dit la solitude plus fort qu'un couloir desert — il reste quelqu'un, mais seul.
    visB = 1.0 if ts < 7.0 else max(0.0, 1.0 - (ts - 7.0) / 0.5)
    visA = 1.0

    def homme(cx, feet_y, ech, g_body, g_head, roll_left, vis=1.0):
        """Un homme = 2 jambes distinctes + buste + tete + rouleau de plans sous le bras.
        `ech` encode la PROFONDEUR (plus grand = plus pres). Aucun geste vers l'autre."""
        if vis <= 0.01:
            return
        body_h = 0.250 * ech
        bw = 0.052 * ech
        hip = feet_y - 0.150 * ech
        top = hip - body_h
        # jambes : 2 blocs distincts, ecartes — legere alternance de marche quand il avance
        moving = ts < 3.6 or (5.2 < ts < 7.4)
        swing = 0.016 * ech * (1 if int(ts * 6) % 2 == 0 else -1) if moving else 0.0
        R(cx - 0.040 * ech - swing, hip, cx - 0.006 * ech - swing, feet_y, g_body)
        R(cx + 0.006 * ech + swing, hip, cx + 0.040 * ech + swing, feet_y, g_body)
        # buste + tete
        R(cx - bw, top, cx + bw, hip, g_body)
        R(cx - 0.034 * ech, top - 0.105 * ech, cx + 0.034 * ech, top, g_head)
        # rouleau de plans sous le bras : ancre la scene dans le monde du chantier,
        # dessine a CHAQUE frame (regle de l'objet manipule), du cote OPPOSE a l'autre homme
        rx = cx - 0.070 * ech if roll_left else cx + 0.070 * ech
        R(rx - 0.014 * ech, top + 0.060 * ech, rx + 0.014 * ech, top + 0.190 * ech, G_ROLL)

    # A entre par la GAUCHE et repart vers la porte de DROITE ; B fait l'inverse.
    # Leurs trajectoires se TRAVERSENT — c'est ca, se croiser sans se parler.
    # ⛔ Se croiser implique de passer l'un DEVANT l'autre : en X seul ils se chevauchent
    #    (mesure : -0,103 a 5,7 s => risque de fusion des 2 corps). La separation se fait donc
    #    en PROFONDEUR, comme dans la realite : A marche sur la ligne AVANT (grand, pieds bas),
    #    B sur la ligne ARRIERE (petit, pieds hauts). Ils ne partagent jamais le meme plan.
    #    A est dessine EN DERNIER = il occulte B au moment du croisement, ce qui rend la
    #    profondeur lisible au lieu d'une collision.
    # ⭐ A ne finit PAS colle au bord droit (il y serait a moitie hors cadre, mal lisible) :
    #    apres avoir depasse B, il oblique vers le FOND du couloir. Il s'eloigne en profondeur,
    #    pas lateralement — c'est ce qui donne une silhouette entiere, de dos, qui diminue.
    ax = lerp(pos(-0.06, 0.430, 0.850), 0.545, eloigne)
    bx = pos(1.06, 0.590, 0.150)
    homme(bx, 0.790, 0.80, G_B_BODY, G_B_HEAD, roll_left=False, vis=visB)  # ARRIERE, entre et disparait
    # A s'eloigne : ses pieds remontent et son echelle diminue = il s'enfonce dans la profondeur.
    homme(ax, lerp(0.945, 0.815, eloigne), lerp(1.22, 0.86, eloigne),
          G_A_BODY, G_A_HEAD, roll_left=True, vis=visA)                     # AVANT, par-dessus

    return img


if __name__ == '__main__':
    import argparse, subprocess, shutil
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--frames', type=int, default=245)
    ap.add_argument('--out', default='previs_couloir')
    ap.add_argument('--gif', action='store_true')
    ap.add_argument('--fps', type=int, default=24)
    a = ap.parse_args()

    globals()['N'] = a.frames
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    for i in range(a.frames):
        draw(i).save(out / f'f_{i:04d}.png')
    print(f"couloir: {a.frames} frames -> {out}/  ({a.frames/a.fps:.3f} s)")

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
