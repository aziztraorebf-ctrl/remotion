#!/usr/bin/env python3
"""
Generateur de la coquille de cauri — piece portfolio « Le cauri ».

UNE seule coquille, structuree en 2 calques de premier niveau :
  <g id="silhouette">  toujours visible, doit lire comme un cauri jusqu'a ~10 px de large
  <g id="fente">       detail signature, MASQUE PAR CODE sous un seuil d'echelle

Registre : APLATS PURS (cf. TECHNIQUES.md § BALANCOIRE, confirme par coupe de pixels).
Zero degrade, zero ombre portee, zero <filter>, zero <text>, zero stroke.

Morphologie MESUREE sur 2 references photographiques (vue ventrale) :
  out/_r-and-d/cauri/coquille/{moneta,annulus}.jpg — Wikimedia Commons, H. Zell.
  - ratio h/w : 1,18 (moneta) et 1,35 (annulus) -> retenu 1,32
    /!\\ la coquille est PLUS HAUTE QUE LARGE (le brief annoncait l'inverse)
  - largeur max a t=0,40-0,48 de la hauteur
  - sommet (t=0) etroit et arrondi ; base (t=1) TRONQUEE a ~0,50 de la largeur max
  - fente : centre a x=0,58 (decentree a DROITE), arquee (0,50 -> 0,63 -> 0,51),
    s'elargissant vers le bas (0,05 -> 0,19 de la largeur)
  - 12 dents sur la levre droite, amplitude 4 % de la largeur, pas 6,7 % de la hauteur

Sortie : coquille.svg (+ planche-echelles.png via gen-planche.py)
"""

import math

# ---------------------------------------------------------------------------
# PALETTE — brief § 5. Aplats purs, 3 teintes au total sur la piece.
# ---------------------------------------------------------------------------
# Fond bleu profond ocean. Assez sombre pour que la nacre tranche a 10 px, assez
# sature pour ne pas lire « gris ardoise ». Ce n'est PAS le bleu electrique TED-Ed.
FOND = "#0E2A44"
# Nacre / blanc creme chaud. Releve sur la reference : moyenne #E0D6C4, teintes
# frequentes #E7E0D0/#E8DFCE. Remonte en clarte (la ref est photographiee, pas
# un aplat graphique) en gardant le biais chaud R>G>B qui signe la nacre.
NACRE = "#F2E8D5"
# La fente : plus SOMBRE et plus CHAUDE que la nacre — sur la vraie coquille
# c'est l'ombre de l'ouverture, brun-ambre. Choisie assez foncee pour se detacher
# sans devenir un trou noir (qui lirait comme un defaut de dessin).
FENTE = "#8A5A2B"

# ---------------------------------------------------------------------------
# GEOMETRIE — systeme local : largeur 100, hauteur 132, origine au CENTRE.
# Une seule coquille dessinee une seule fois ; toute la mise a l'echelle se fait
# par transform cote animation (regle R6 : reassignation par echelle/groupement).
# ---------------------------------------------------------------------------
W = 100.0
H = 132.0

# Profil de demi-largeur mesure sur les references, indexe par t (0 = sommet).
# Chaque entree : (t, demi-largeur / demi-largeur max).
# Le sommet n'est pas une pointe (0,04 mesure a t=0) mais il est nettement plus
# etroit que la base tronquee (0,50) : c'est CETTE asymetrie qui doit survivre a
# 10 px, pas les details de bord.
# ⛔ Piege paye (v2) : les 3 premieres valeurs MESUREES au sommet (0,055 a t=0 ;
# 0,33 a t=0,03 ; 0,455 a t=0,06) font passer la pente de 236 a 479 puis 290 en
# 3 noeuds. Meme avec un interpolant C1, une pente qui change aussi vite sur un
# intervalle aussi court produit une EPAULE visible de chaque cote du sommet
# (lecture « chapeau pince »). Or ces valeurs ne decrivent pas la coquille :
# a t=0 la reference ne donne qu'UNE ligne de pixels antialiases du dome.
# -> le sommet est traite comme une CALOTTE circulaire (cf. calotte_sommet),
# et le profil mesure ne commence qu'a t=T_CALOTTE, ou il est deja regulier.
T_CALOTTE = 0.105

PROFIL = [
    # --- sommet : dome. Les 4 premiers points suivent un quart d'ellipse de
    # demi-hauteur T_CALOTTE et de demi-largeur 0,580 (la valeur mesuree a la
    # jonction), echantillonne aux memes t. Ils donnent une tangente quasi
    # verticale a t=0 et rejoignent le profil mesure sans cassure, parce que
    # c'est la MEME spline qui passe par les uns et les autres.
    # ⛔ (0,000 ; 0,000) faisait une POINTE au sommet : une largeur strictement
    # nulle est un cusp, pas un dome. La reference a de la matiere au sommet
    # (le dos de la coquille se voit par-dessus). On demarre donc a une largeur
    # non nulle et on laisse la spline arrondir.
    (0.000, 0.118),
    (0.018, 0.238),
    (0.042, 0.362),
    (0.070, 0.484),
    # --- corps : valeurs MESUREES sur la reference (cf. en-tete)
    (0.100, 0.580),
    (0.150, 0.700),
    (0.200, 0.792),
    (0.250, 0.868),
    (0.300, 0.928),
    (0.350, 0.968),
    (0.420, 0.998),
    (0.480, 1.000),
    (0.550, 0.988),
    (0.600, 0.964),
    (0.650, 0.930),
    (0.700, 0.890),
    (0.750, 0.844),
    (0.800, 0.790),
    (0.850, 0.724),
    (0.900, 0.646),
    (0.950, 0.560),
    (0.980, 0.505),
    (1.000, 0.470),
]

# Derive de l'axe : sur la reference, le centre de la coquille se decale
# legerement (l'ovale n'est pas symetrique haut/bas). Amplitude mesuree ~2 % de
# la largeur. On la garde : c'est ce qui empeche la forme de lire « ellipse ».
def derive_axe(t: float) -> float:
    return 0.022 * W * math.sin(math.pi * t) * (1.0 - 1.7 * t)


def _profil_mesure(t: float) -> float:
    """Spline Catmull-Rom passant par les points MESURES sur la reference.

    ⛔ Piege paye ici (v1) : une interpolation par smoothstep ENTRE PAIRES de
    points de controle est continue en VALEUR mais sa DERIVEE saute a chaque
    noeud -> le contour rendu montre un escalier de facettes, visible a 480 px.
    Augmenter le nombre d'echantillons n'y change rien : on echantillonne plus
    finement la meme courbe cassee. Il faut un interpolant C1 : Catmull-Rom,
    qui passe par tous les points MESURES et dont la tangente est continue.
    """
    pts = PROFIL
    if t <= pts[0][0]:
        return pts[0][1]
    if t >= pts[-1][0]:
        return pts[-1][1]
    i = 0
    while i < len(pts) - 2 and t > pts[i + 1][0]:
        i += 1
    p0 = pts[max(0, i - 1)]
    p1, p2 = pts[i], pts[i + 1]
    p3 = pts[min(len(pts) - 1, i + 2)]
    k = (t - p1[0]) / (p2[0] - p1[0])
    # Catmull-Rom non uniforme approxime par des tangentes en differences finies
    # ponderees par les intervalles reels (les points mesures ne sont pas equidistants).
    d1 = (p2[1] - p0[1]) / max(1e-9, p2[0] - p0[0]) * (p2[0] - p1[0])
    d2 = (p3[1] - p1[1]) / max(1e-9, p3[0] - p1[0]) * (p2[0] - p1[0])
    k2, k3 = k * k, k * k * k
    h00 = 2 * k3 - 3 * k2 + 1
    h10 = k3 - 2 * k2 + k
    h01 = -2 * k3 + 3 * k2
    h11 = k3 - k2
    return h00 * p1[1] + h10 * d1 + h01 * p2[1] + h11 * d2


def demi_largeur(t: float) -> float:
    """Demi-largeur du contour au parametre t (0 = sommet, 1 = base), en unites.

    UNE SEULE courbe pour tout le contour, sommet compris.

    ⛔ Deux tentatives payees avant d'en arriver la :
      v2 — le profil mesure brut au sommet (pente 236 -> 479 -> 290 en 3 noeuds)
           produisait une EPAULE de chaque cote du sommet.
      v3 — j'ai voulu coller une calotte elliptique par-dessus et la FONDRE avec
           le profil. Deux courbes qui n'ont ni la meme valeur ni la meme pente au
           raccord ne se raccordent pas par un fondu : j'ai obtenu les 2 memes
           defauts (encoche d'epaule a la jonction + nub aplati au sommet).
    ⭐ La lecon est celle deja ecrite en doctrine : un raccord qui resiste ne
    devrait pas exister. La bonne solution n'est pas un meilleur melange, c'est
    de supprimer la jonction — le sommet devient des POINTS DE CONTROLE de la
    meme spline, choisis pour donner un dome a tangente verticale.
    """
    return _profil_mesure(t) * W / 2.0


def point_contour(t: float, cote: int) -> tuple:
    """Point du contour au parametre t. cote = -1 (gauche) ou +1 (droite)."""
    y = -H / 2.0 + t * H
    x = derive_axe(t) + cote * demi_largeur(t)
    return (x, y)


def f(v: float) -> str:
    """Formatte un nombre court (3 decimales, sans zeros inutiles)."""
    s = f"{v:.3f}".rstrip("0").rstrip(".")
    return s if s not in ("-0", "") else "0"


def polyligne_fermee(pts) -> str:
    """Path ferme a partir d'une liste de points. Toutes les formes sont
    fermees et remplies (contrainte Lottie : aucun stroke, aucune forme ouverte)."""
    d = "M" + f(pts[0][0]) + " " + f(pts[0][1])
    for x, y in pts[1:]:
        d += "L" + f(x) + " " + f(y)
    return d + "Z"


# ---------------------------------------------------------------------------
# SILHOUETTE — UNE seule forme fermee.
# Regle de doctrine n°3 : un raccord qui resiste ne devrait pas exister. La
# coquille est un contour continu unique (descente du bord droit, base, remontee
# du bord gauche), pas un assemblage sommet+corps+base.
# ---------------------------------------------------------------------------
def path_silhouette(pas: int = 220) -> str:
    """Contour continu unique : arc du sommet, bord droit, arc de base, bord
    gauche. Aucun raccord a rater — il n'y en a aucun.

    ⛔ v1 : je fermais le contour par une CORDE DROITE d'un bord a l'autre ->
    la base lisait comme une COUPE FRANCHE horizontale (« galet scie »).
    ⛔ v5 : le meme defaut au SOMMET, en pire — la coquille ayant de la largeur
    a t=0, la corde du haut faisait un PLATEAU a deux angles vifs (lecture
    « tente »). Les deux bouts de la coquille sont des ARCS, pas des cordes.
    """
    droite = [point_contour(i / pas, +1) for i in range(pas + 1)]
    gauche = [point_contour(i / pas, -1) for i in range(pas, -1, -1)]

    def arc(x_de, x_vers, y, fleche, n=34):
        """Arc surbaisse reliant deux points de meme y. fleche > 0 = bombe vers
        le bas (base), < 0 = bombe vers le haut (sommet)."""
        return [
            (x_de + (x_vers - x_de) * (i / n), y + fleche * math.sin(math.pi * (i / n)))
            for i in range(1, n)
        ]

    xd_bas, y_bas = droite[-1]
    xg_bas = gauche[0][0]
    xg_haut, y_haut = gauche[-1]
    xd_haut = droite[0][0]
    # ⛔ v6 : j'ai choisi la fleche du sommet A L'ESTIME (0,55 de la largeur du
    # sommet, « c'est un dome donc c'est bombe ») -> une TOURELLE en tetine
    # posee sur la coquille. Mesure : la fleche qui PROLONGE exactement les
    # flancs vaut 0,099, soit 5,5 fois moins. Elle ne se devine pas, elle se
    # CALCULE a partir de la pente du contour au point de raccord.
    # Pour une parabole y = f*(1-(x/demi)^2), la pente en x=demi vaut -2f/demi ;
    # on l'egale a la pente du flanc pour que l'arc et le flanc soient tangents.
    base = arc(xd_bas, xg_bas, y_bas, 0.075 * (xd_bas - xg_bas))
    demi_sommet = (xd_haut - xg_haut) / 2.0
    eps = 1e-4
    pente_flanc = (demi_largeur(eps) - demi_largeur(0.0)) / (eps * H)
    fleche_sommet = demi_sommet / (2.0 * pente_flanc) if pente_flanc > 1e-6 else 0.0
    sommet = arc(xg_haut, xd_haut, y_haut, -fleche_sommet)
    return polyligne_fermee(droite + base + gauche + sommet)


# ---------------------------------------------------------------------------
# FENTE — le detail signature, ENTIEREMENT contenu dans son groupe.
# Contrainte du brief : si on retire <g id="fente">, il ne doit rester AUCUN
# artefact et la silhouette doit rester une forme complete et fermee. C'est le
# cas par construction : la fente est POSEE PAR-DESSUS la silhouette pleine,
# elle n'y decoupe rien (pas de mask, pas d'evenodd traversant les deux groupes).
#
# Geometrie mesuree :
#   axe central     : 0,50 -> 0,63 -> 0,51 (fraction de la largeur, arc doux)
#   demi-ouverture  : 0,025 en haut -> 0,095 en bas (elle s'evase vers la base)
#   dents           : 12 sur la levre DROITE, amplitude 4 % de la largeur
# Sur la reference, les deux levres ne sont PAS symetriques : la droite porte des
# bosses arrondies qui MORDENT dans la fente, la gauche est plus lisse et ses plis
# rayonnent vers l'exterieur. On reproduit cette asymetrie — c'est elle qui
# distingue une vraie fente de cauri d'une simple boutonniere dentelee.
# ---------------------------------------------------------------------------
T0_FENTE = 0.075   # la fente demarre sous le sommet
T1_FENTE = 0.910   # et s'arrete AVANT la base
# ⛔ v11 : avec T1=0,972 et une fente elargie, l'arc de bout de la fente
# DEBORDAIT sous la silhouette (un croissant brun pendait sous la coquille).
# La regle du brief est explicite : si on retire le groupe `fente`, il ne doit
# rester aucun artefact — donc la fente doit etre STRICTEMENT INTERIEURE. Le
# controle `verifier_confinement` ci-dessous l'impose desormais a la generation.
N_DENTS = 12
# ⛔ v8 : profondeur de dent donnee en fraction de W (0,030) -> en HAUT, ou la
# fente est etroite, la dent etait plus profonde que la demi-ouverture : les
# dents se rejoignaient et TRANCHAIENT la fente en tronconnant le brun (lecture
# « scie », pas « fente dentelee »). La profondeur d'une dent doit etre relative
# a l'ouverture LOCALE, jamais a la largeur de la coquille.
PROF_DENT_D = 0.42   # levre droite : les bosses franches de la reference
PROF_DENT_G = 0.30   # levre gauche : plus lisse (asymetrie mesuree)


def axe_fente(t: float) -> float:
    """Abscisse de l'axe de la fente (t local 0..1 le long de la fente)."""
    # 0,505 -> 0,632 (ventre a ~45 %) -> 0,515 : l'arc mesure sur la reference.
    frac = 0.505 + 0.127 * math.sin(math.pi * (t ** 0.86))
    return (frac - 0.5) * W


def demi_ouverture(t: float) -> float:
    """Demi-largeur de la fente : elle s'evase vers le bas (mesure).

    ⛔ v1 : la fermeture haute etait LINEAIRE sur 10 % de la longueur -> un
    DARD triangulaire fin qui lisait comme une fissure dans la coquille.
    ⛔ v7 : la fermeture haute en racine laissait la fente se terminer en CROCHET
    FIN (lecture « fissure », pas « ouverture »). Sur la reference le haut de la
    fente est etroit mais JAMAIS effile : largeur franche, puis fermeture nette
    et arrondie par les arcs de bout (cf. path_fente), pas par un amincissement.
    ⛔ v8 : le « plancher » etait applique a une base qui tendait vers zero -> la
    fente finissait quand meme en QUEUE DIAGONALE FINE. Un plancher relatif ne
    planche rien : la largeur minimale est ABSOLUE (0,030*W), quelle que soit t.
    ⛔ v10 : evasement plafonne a ~0,09*W -> ma fente restait un RUBAN sur toute
    sa longueur, alors que la reference OUVRE une vraie cavite sombre dans le
    tiers bas (mesure : demi-ouverture 0,026 en haut -> 0,095 en bas, soit x3,6).
    Defaut invisible sur mon seul dessin, evident des la mise cote a cote.
    """
    evase = 0.030 + 0.115 * (t ** 1.45)
    return max(0.030 * W, evase * W)


def y_fente(t: float) -> float:
    return -H / 2.0 + (T0_FENTE + (T1_FENTE - T0_FENTE) * t) * H


def path_fente() -> str:
    """La fente : un seul chemin ferme. Levre DROITE dentelee (12 bosses qui
    mordent vers l'interieur), levre GAUCHE ondulee plus doucement et en
    OPPOSITION DE PHASE (les creux d'un cote font face aux bosses de l'autre —
    c'est l'engrenement decrit dans la morphologie)."""
    pas = 240
    droite = []
    for i in range(pas + 1):
        t = i / pas
        yy = y_fente(t)
        d = demi_ouverture(t)
        # dents : actives seulement la ou la fente est franche, elles s'eteignent
        # aux deux bouts (sinon elles font des barbes sur les pointes)
        env = min(1.0, (t / 0.055)) * min(1.0, ((1.0 - t) / 0.07))
        dent = PROF_DENT_D * d * env * max(0.0, math.cos(2 * math.pi * N_DENTS * t)) ** 0.72
        droite.append((axe_fente(t) + d - dent, yy))
    gauche = []
    for i in range(pas, -1, -1):
        t = i / pas
        yy = y_fente(t)
        d = demi_ouverture(t)
        env = min(1.0, (t / 0.055)) * min(1.0, ((1.0 - t) / 0.07))
        # opposition de phase (+ pi) et amplitude moindre : la levre gauche est
        # plus lisse sur la reference.
        dent = PROF_DENT_G * d * env * max(0.0, math.cos(2 * math.pi * N_DENTS * t + math.pi)) ** 0.72
        gauche.append((axe_fente(t) - d + dent, yy))
    # Bouts ARRONDIS : meme lecon que le sommet de la silhouette — une corde
    # entre les deux levres fait une POINTE (en haut) ou un angle (en bas).
    def arc_bout(pa, pb, vers_haut, n=16):
        """Arc de fermeture d'un bout de la fente.

        ⛔ v11/v12 : un DEMI-CERCLE (fleche = demi-largeur) au bout bas faisait
        sortir la fente SOUS la silhouette — la fente s'etant elargie, son rayon
        de bout avait grandi avec elle. Le bout est donc SURBAISSE : sa fleche
        est plafonnee, ce qui garde l'arrondi sans transformer le bout en bulbe.
        """
        (xa, ya), (xb, yb) = pa, pb
        rayon = min(abs(xb - xa) / 2.0, 0.030 * H)
        return [
            (xa + (xb - xa) * (i / n),
             (ya + (yb - ya) * (i / n)) + (-1 if vers_haut else 1) * rayon * math.sin(math.pi * (i / n)))
            for i in range(1, n)
        ]

    haut = arc_bout(gauche[-1], droite[0], True)
    bas = arc_bout(droite[-1], gauche[0], False)
    return polyligne_fermee(droite + bas + gauche + haut)


# ---------------------------------------------------------------------------
# ASSEMBLAGE
# ---------------------------------------------------------------------------
def svg(avec_fond: bool = True) -> str:
    # viewBox propre, centree sur la coquille, avec une marge d'air.
    vb_w, vb_h = 160, 200
    parts = []
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vb_w} {vb_h}" '
        f'width="{vb_w}" height="{vb_h}">'
    )
    parts.append(
        "<!-- Coquille de cauri (Monetaria annulus / moneta, vue ventrale). "
        "Aplats purs, 2 teintes, registre du brief cauri. "
        "SEUIL MESURE : masquer le groupe 'fente' sous 18 px de LARGEUR DE "
        "COQUILLE a l'ecran (en dessous, la fente devient une tache qui salit "
        "la forme au lieu de la detailler ; la silhouette nue est alors plus "
        "lisible). Entre 18 et 26 px la fente n'a plus de dents mais reste un "
        "croissant utile. Au-dessus de 26 px les dents se comptent. "
        "Voir planche-echelles.png et NOTES.md. -->"
    )
    if avec_fond:
        parts.append('<g id="fond">')
        parts.append(f'<rect id="fond-ocean" x="0" y="0" width="{vb_w}" height="{vb_h}" fill="{FOND}"/>')
        parts.append("</g>")
    # Le groupe cauri porte le transform de PLACEMENT ; silhouette et fente sont
    # dessinees autour de (0,0) et n'ont AUCUN transform propre (regle acquise
    # sur la planche onboarding : le transform de placement vit sur la racine).
    parts.append(f'<g id="cauri" transform="translate({vb_w/2} {vb_h/2})">')
    parts.append('<g id="silhouette">')
    parts.append(f'<path id="coquille-corps" d="{path_silhouette()}" fill="{NACRE}"/>')
    parts.append("</g>")
    parts.append('<g id="fente">')
    parts.append(f'<path id="fente-ouverture" d="{path_fente()}" fill="{FENTE}"/>')
    parts.append("</g>")
    parts.append("</g>")
    parts.append("</svg>")
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# VERIFICATIONS integrees a la generation (jamais a la main)
# ---------------------------------------------------------------------------
def verifier_confinement() -> None:
    """La fente doit etre STRICTEMENT INTERIEURE a la silhouette.

    Exigence du brief : en retirant le groupe `fente`, il ne doit rester AUCUN
    artefact et la silhouette doit rester une forme complete. Corollaire : aucun
    point de la fente ne depasse du contour, sinon le morceau qui depasse dessine
    un bout de coquille et s'en va avec elle.

    ⛔ Defaut reellement produit en v11 (un croissant brun pendait SOUS la base),
    invisible dans le code et vu au rendu.
    ⛔ Et piege de VERIFICATION paye juste apres : ma premiere version de ce
    controle recalculait la geometrie du bout a partir de `demi_ouverture`, alors
    que `path_fente` plafonne desormais ce rayon. Le controle mesurait donc une
    forme que le dessin ne produit plus — il criait sur un defaut inexistant.
    ✅ On teste les POINTS REELLEMENT EMIS dans le path, jamais une reconstruction.
    """
    import re

    d = path_fente()
    pts = [
        (float(x), float(y))
        for x, y in re.findall(r"[ML](-?[\d.]+)[ ,](-?[\d.]+)", d)
    ]
    assert len(pts) > 100, "path de fente anormalement court"
    marge_min, pire = 1e9, None
    for x, y in pts:
        ts = (y + H / 2.0) / H
        assert 0.0 <= ts <= 1.0, f"fente hors du cadre vertical (ts={ts:.3f})"
        m = min(
            (derive_axe(ts) + demi_largeur(ts)) - x,
            x - (derive_axe(ts) - demi_largeur(ts)),
        )
        if m < marge_min:
            marge_min, pire = m, (x, y, ts)
    assert marge_min > 2.0, (
        f"fente trop proche du bord : marge {marge_min:.2f} u au point {pire}"
    )
    print(f"confinement OK — marge minimale fente/contour : {marge_min:.2f} u")


def verifier(s: str) -> None:
    import re

    interdits = ["<filter", "feGaussianBlur", "<mask", "<clipPath", "<use", "<pattern", "<text", "stroke="]
    for mot in interdits:
        assert mot not in s, f"element interdit present : {mot}"
    ids = re.findall(r'id="([^"]+)"', s)
    assert len(ids) == len(set(ids)), f"id duplique : {[i for i in ids if ids.count(i) > 1]}"
    for i in ids:
        assert re.fullmatch(r"[a-z0-9-]+", i), f"id non conforme (accent/majuscule) : {i}"
    assert "linearGradient" not in s and "radialGradient" not in s, "degrade present (registre aplat pur)"
    print(f"verif OK — {len(ids)} ids uniques, 0 element interdit, 0 degrade")


if __name__ == "__main__":
    import os

    ici = os.path.dirname(os.path.abspath(__file__))
    verifier_confinement()
    s = svg(avec_fond=True)
    verifier(s)
    with open(os.path.join(ici, "coquille.svg"), "w") as fh:
        fh.write(s + "\n")
    print("ecrit : coquille.svg")
