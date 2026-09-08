#!/usr/bin/env python3
"""
Decor de fond oceanique pour la piece "Le cauri" (portfolio) — 4e piste (dessin statique,
PAS d'animation codee ici : le fond defilera par translation en Remotion, pas par ce script).

Registre : aplats purs, meme famille que coquille.svg (silhouettes fermees, zero degrade,
zero ombre portee, zero filtre). "Geographie abstraite" : de grandes masses de dunes
sous-marines / vallees abyssales suggerees par des bandes ondulees empilees en profondeur —
jamais une carte, jamais un paysage litteral (pas d'horizon net, pas de soleil, pas de relief
identifiable).

Boucle horizontale : chaque bande ondulee est une somme de sinusoides dont les frequences
sont des multiples ENTIERS de (2*pi / LARGEUR) -> f(x=0) == f(x=LARGEUR) exactement, et les
memes frequences pilotent aussi la position des masses ponctuelles (bulles/reliefs), donc
tout motif qui touche x=0 retrouve la meme valeur a x=LARGEUR : le raccord est mathematique,
pas approxime a l'oeil.

Sortie : decor-fond.svg (LARGEUR x HAUTEUR=1080), + 4 crops de verification (apercu-defilement).
"""
import math
import random

LARGEUR = 4800   # >= 2x 1920 (fenetre finale), marge large pour un travelling 23s sans jamais voir de bord
HAUTEUR = 1080

FOND = "#0E2A44"        # brief §5, teinte de base verrouillee
BLEU_PROFOND = "#0A2038"  # plus sombre que le fond -> creux/vallees lointaines
BLEU_MEDIAN = "#123A5C"   # plus clair -> masses medianes
BLEU_CLAIR = "#1A4A72"    # encore plus clair, reserve a la couche proche (contraste le plus fort, reste doux)

random.seed(7)  # deterministe : le meme dessin a chaque regeneration


def bande_periodique(y_base, amplitude, n_harmoniques, phase_offset, largeur=LARGEUR):
    """
    Construit les points (x, y) d'une bande ondulee sur toute la largeur, PERIODIQUE :
    y(x) = y_base + somme_k [ amp_k * sin(2*pi*k*x/largeur + phase_k) ]
    Les frequences k sont des ENTIERS -> periode exacte = largeur -> boucle garantie.
    """
    harmoniques = []
    for k in range(1, n_harmoniques + 1):
        amp_k = amplitude / k * random.uniform(0.6, 1.0)
        phase_k = phase_offset + random.uniform(0, math.pi * 2)
        harmoniques.append((k, amp_k, phase_k))

    pas = 24  # px entre points d'echantillonnage -> courbe lisse, fichier raisonnable
    pts = []
    x = 0
    while x <= largeur:
        y = y_base
        for k, amp_k, phase_k in harmoniques:
            y += amp_k * math.sin(2 * math.pi * k * x / largeur + phase_k)
        pts.append((x, y))
        x += pas
    # point final EXACT a x=largeur pour garantir la fermeture (le sample precedent peut
    # legerement depasser largeur a cause du pas fixe)
    y_fin = y_base
    for k, amp_k, phase_k in harmoniques:
        y_fin += amp_k * math.sin(2 * math.pi * k * largeur / largeur + phase_k)
    pts.append((largeur, y_fin))
    return pts


def path_bande_remplie(pts, largeur=LARGEUR, hauteur=HAUTEUR):
    """Ferme une bande ondulee en polygone plein jusqu'au bas du cadre (pour une masse
    de fond qui descend hors champ)."""
    d = f"M {pts[0][0]:.1f} {pts[0][1]:.1f} "
    d += " ".join(f"L {x:.1f} {y:.1f}" for x, y in pts[1:])
    d += f" L {largeur} {hauteur} L 0 {hauteur} Z"
    return d


def path_bande_haut(pts, largeur=LARGEUR):
    """Ferme une bande ondulee en polygone plein jusqu'au HAUT du cadre (masse qui monte
    hors champ, pour la couche la plus proche en haut de l'image)."""
    d = f"M {pts[0][0]:.1f} {pts[0][1]:.1f} "
    d += " ".join(f"L {x:.1f} {y:.1f}" for x, y in pts[1:])
    d += f" L {largeur} 0 L 0 0 Z"
    return d


def masses_ponctuelles(n, y_centre, y_jitter, rx_base, ry_base, id_prefix, largeur=LARGEUR):
    """
    Grandes masses ovales douces (relief abyssal suggere / bancs lointains), positionnees
    a des x = multiples de (largeur/n) + jitter deterministe -> motif qui se repete
    naturellement sur la periode, donc raccord x=0/x=largeur coherent (meme densite de
    masses de part et d'autre de la couture).
    """
    elements = []
    pas = largeur / n
    for i in range(n):
        cx = i * pas + random.uniform(-pas * 0.15, pas * 0.15)
        cy = y_centre + random.uniform(-y_jitter, y_jitter)
        rx = rx_base * random.uniform(0.75, 1.3)
        ry = ry_base * random.uniform(0.7, 1.2)
        elements.append((f"{id_prefix}-{i}", cx, cy, rx, ry))
    return elements


def blob_svg(id_, cx, cy, rx, ry, fill, opacity=1.0, n_lobes=4, irregularite=0.22):
    """
    Masse organique irreguliere (au lieu d'une ellipse parfaite) : un polygone ferme dont
    le rayon varie legerement par angle, pour lire comme un relief/banc dessine plutot
    qu'une forme geometrique de logiciel. Meme esprit que la coquille (aplat plein, contour
    continu) mais silhouette molle, jamais nette -> reste subordonnee au premier plan.
    """
    pts = []
    n_pts = 20
    # decalages d'angle deterministes (seed globale) pour un contour irregulier mais stable
    offsets = [random.uniform(1 - irregularite, 1 + irregularite) for _ in range(n_lobes)]
    for i in range(n_pts):
        angle = 2 * math.pi * i / n_pts
        # variation lissee : combinaison de n_lobes bosses reparties sur le tour
        lobe_idx = (angle / (2 * math.pi)) * n_lobes
        i0 = int(lobe_idx) % n_lobes
        i1 = (i0 + 1) % n_lobes
        frac = lobe_idx - int(lobe_idx)
        r_mult = offsets[i0] * (1 - frac) + offsets[i1] * frac
        x = cx + rx * r_mult * math.cos(angle)
        y = cy + ry * r_mult * math.sin(angle)
        pts.append((x, y))
    d = f"M {pts[0][0]:.1f} {pts[0][1]:.1f} "
    d += " ".join(f"L {x:.1f} {y:.1f}" for x, y in pts[1:])
    d += " Z"
    op = f' opacity="{opacity:.2f}"' if opacity < 1.0 else ""
    return f'<path id="{id_}" d="{d}" fill="{fill}"{op}/>'


def path_svg(id_, d, fill, opacity=1.0):
    op = f' opacity="{opacity:.2f}"' if opacity < 1.0 else ""
    return f'<path id="{id_}" d="{d}" fill="{fill}"{op}/>'


def construire_svg():
    parts = []
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LARGEUR} {HAUTEUR}" '
        f'width="{LARGEUR}" height="{HAUTEUR}">'
    )
    parts.append(
        "<!-- Decor de fond oceanique, piece Le cauri. Aplats purs, zero degrade, zero "
        "ombre, zero filtre. Concu pour defiler horizontalement en boucle (periode = "
        f"largeur totale {LARGEUR}px). Voir NOTES.md. -->"
    )

    parts.append('<g id="decor-fond">')

    # --- fond de base ---
    parts.append(f'<rect id="fond-base" x="0" y="0" width="{LARGEUR}" height="{HAUTEUR}" fill="{FOND}"/>')

    # =====================================================================
    # COUCHE LOINTAINE — vallees abyssales tres douces, tres bas contraste,
    # grandes bandes larges, occupent le bas de l'image (loin = bas/loin du sujet).
    # =====================================================================
    parts.append('<g id="couche-lointaine">')

    bande_l1 = bande_periodique(y_base=780, amplitude=55, n_harmoniques=6, phase_offset=0.4)
    parts.append(path_svg("lointaine-vallee-1", path_bande_remplie(bande_l1), BLEU_PROFOND, opacity=0.55))

    bande_l2 = bande_periodique(y_base=860, amplitude=40, n_harmoniques=7, phase_offset=2.1)
    parts.append(path_svg("lointaine-vallee-2", path_bande_remplie(bande_l2), BLEU_PROFOND, opacity=0.40))

    # bancs lointains : masses organiques tres discretes, eparses (pas un motif de pois
    # regulier), haut de la couche lointaine
    for id_, cx, cy, rx, ry in masses_ponctuelles(5, y_centre=670, y_jitter=55, rx_base=170, ry_base=32,
                                                    id_prefix="lointaine-banc"):
        parts.append(blob_svg(id_, cx, cy, rx, ry, BLEU_PROFOND, opacity=0.28, n_lobes=5, irregularite=0.28))

    parts.append("</g>")  # couche-lointaine

    # =====================================================================
    # COUCHE MEDIANE — masses moyennes, contraste un cran au-dessus, occupent
    # le milieu de l'image (jamais au-dessus de ~55% hauteur pour laisser le
    # haut de l'ecran degage aux coquilles/texte).
    # =====================================================================
    parts.append('<g id="couche-mediane">')

    bande_m1 = bande_periodique(y_base=920, amplitude=70, n_harmoniques=6, phase_offset=1.0)
    parts.append(path_svg("mediane-dune-1", path_bande_remplie(bande_m1), BLEU_MEDIAN, opacity=0.50))

    # quelques masses organiques suggerant des reliefs medians epars, jamais nettes ni
    # regulieres (silhouettes molles a lobes, comme un relief dessine)
    for id_, cx, cy, rx, ry in masses_ponctuelles(4, y_centre=750, y_jitter=70, rx_base=230, ry_base=55,
                                                    id_prefix="mediane-relief"):
        parts.append(blob_svg(id_, cx, cy, rx, ry, BLEU_MEDIAN, opacity=0.36, n_lobes=6, irregularite=0.30))

    parts.append("</g>")  # couche-mediane

    # =====================================================================
    # COUCHE PROCHE — quelques grandes masses tres douces en haut de l'image
    # (suggestion de surface/lumiere lointaine au-dessus, jamais un horizon net)
    # + une bande basse proche du bord inferieur (premier plan flou de dune).
    # Contraste le plus visible des 3 couches mais reste tres inferieur a la
    # coquille (#F2E8D5 blanc chaud) : jamais de concurrence de netteté.
    # =====================================================================
    parts.append('<g id="couche-proche">')

    bande_p_haut = bande_periodique(y_base=120, amplitude=50, n_harmoniques=6, phase_offset=3.3)
    parts.append(path_svg("proche-lueur-haut", path_bande_haut(bande_p_haut), BLEU_CLAIR, opacity=0.16))

    bande_p_bas = bande_periodique(y_base=1010, amplitude=45, n_harmoniques=6, phase_offset=5.0)
    parts.append(path_svg("proche-dune-bas", path_bande_remplie(bande_p_bas), BLEU_CLAIR, opacity=0.28))

    # courants filants : traits tres allonges et fins (rx >> ry), eparpilles sans grille
    # visible -> suggerent un mouvement d'eau lointain plutot que des objets/bulles
    for id_, cx, cy, rx, ry in masses_ponctuelles(6, y_centre=520, y_jitter=300, rx_base=210, ry_base=7,
                                                    id_prefix="proche-courant"):
        parts.append(blob_svg(id_, cx, cy, rx, ry, BLEU_CLAIR, opacity=0.13, n_lobes=3, irregularite=0.35))

    parts.append("</g>")  # couche-proche

    parts.append("</g>")  # decor-fond
    parts.append("</svg>")
    return "\n".join(parts)


if __name__ == "__main__":
    import os
    svg = construire_svg()
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(out_dir, "decor-fond.svg")
    with open(out_path, "w") as f:
        f.write(svg)
    print(f"Ecrit : {out_path}")
    print(f"Largeur={LARGEUR} Hauteur={HAUTEUR}")
