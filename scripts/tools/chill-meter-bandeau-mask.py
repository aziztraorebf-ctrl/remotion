"""Genere le pochoir du texte grave du bandeau « AbiGirl Reacts » du chill-meter.

Sortie : public/_client-sim/chill-meter/bandeau-texte-mask.png (1195x896, aligne 1:1
sur device-rustique.png). Consomme par `mask_bandeauTexte` dans ChillMeterRustic.tsx
pour n'allumer en bleu QUE le mot et les 2 flocons, sans toucher a la plaque.

POURQUOI PAS UN SEUIL DE LUMINANCE
-----------------------------------
Sur cette plaque, texte et metal occupent la MEME plage de luminance : l'histogramme
de la zone est strictement unimodal (p25=77, p50=102, p75=127). Aucun seuil ne separe
lettre / metal / rouille — mesure refaite, c'est la cause des regressions successives
(plaque noircie, puis plaque bleue uniforme, puis lettres trouees). Toute variante de
DOSAGE de seuil echoue de la meme facon : soit les lettres restent percees, soit le
mouchetis de rouille entre dans le masque.

CE QUI MARCHE : UNE METHODE GEOMETRIQUE, PAS UN SEUIL
------------------------------------------------------
Les lettres sont EMBOSSEES. Le biseau qui fait le tour de chaque glyphe est une zone de
FORTE VARIANCE LOCALE (transition metal clair -> face de lettre -> ombre portee dure),
alors que la face de la lettre et la plaque sont, elles, des plages relativement lisses.
L'ecart-type local (fenetre 5x5) trace donc un ANNEAU FERME autour de chaque glyphe —
verifie topologiquement : le fond de plaque forme UNE SEULE composante qui touche le bord
du cadre, et les interieurs de lettres sont des composantes ENCLOSES qui ne le touchent
pas. C'est cette propriete de topologie, et non un niveau de gris, qui identifie le texte.

Pipeline (3 etages, chacun geometrique) :
 1. CŒURS  — anneau = std local > STD_RING ; on labellise le complementaire et on garde
    les composantes qui ne touchent PAS le bord du cadre. Elles sont, par construction,
    a l'interieur d'un glyphe. Resultat : positions fiables, zero bruit de rouille, mais
    silhouette erodee (il manque la largeur du biseau).
 2. BISEAU — un top-hat blanc (lisere clair) et un top-hat noir (ombre portee) tracent le
    contour. On ne garde que le materiau de contour CONNECTE a un cœur : le mouchetis de
    rouille, qui ne touche aucun cœur, disparait sans avoir a le seuiller.
 3. FLOCONS — ils n'ont pas d'interieur clos (traits fins), donc l'etape 1 ne les voit pas.
    Ils sont repris par leur signature geometrique propre, mesuree : ~900 px, boite ~45x48,
    aux deux extremites du bandeau (hors de la plage x du mot). Pas de seuil de couleur.

Le masque est donc EXTRAIT de l'image — cale au pixel. Une police de substitution derive :
la gravure est une grotesque geometrique (« a » a un seul etage, « t » a chapeau plat) de
la famille Futura, pas Arial Black, et le calage global derive d'une largeur de lettre
entiere sur « Reacts ». D'ou le refus de redessiner le texte en <text>.

Relancer uniquement si device-rustique.png change.
"""

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "public/_client-sim/chill-meter/device-rustique.png"
OUT = "public/_client-sim/chill-meter/bandeau-texte-mask.png"

# Interieur de la plaque du bandeau, hors cadre biseaute (releve dans le PNG).
ZY0, ZY1, ZX0, ZX1 = 150, 228, 262, 930

STD_WIN = 5      # fenetre de l'ecart-type local : la largeur du biseau, pas le grain
STD_RING = 18    # au-dessus = biseau (transition), en dessous = face lisse ou plaque
CORE_MIN = 25    # px : sous ce seuil un interieur clos est un artefact, pas un contrechamp
WHITE_TH = 32    # top-hat blanc : lisere clair du biseau
BLACK_TH = 35    # top-hat noir : ombre portee du biseau
# Signature mesuree des 2 flocons (aucun interieur clos, donc traites a part).
FLOC_MIN, FLOC_MAX = 400, 1600   # px du trace
FLOC_BOX = (30, 70)              # cote de la boite englobante, min/max
WORD_X0, WORD_X1 = 90, 595       # plage x du MOT dans le repere du cadre
SPECK_MIN = 45   # px : plus petit qu'un point de « i » => mouchetis, pas un glyphe
FEATHER = 0.6    # px d'antialiasing — lisse l'escalier sans flouter


def _zone_luminance() -> np.ndarray:
    rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(float)
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    return lum[ZY0:ZY1, ZX0:ZX1]


def _cores(z: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Interieurs de glyphes = composantes du complementaire de l'anneau de biseau qui ne
    touchent pas le bord du cadre. Renvoie (coeurs, anneau)."""
    mean = ndimage.uniform_filter(z, STD_WIN)
    mean_sq = ndimage.uniform_filter(z * z, STD_WIN)
    std = np.sqrt(np.maximum(mean_sq - mean * mean, 0))

    ring = ndimage.binary_closing(std > STD_RING, np.ones((3, 3)))
    inv = ~ring
    lab, n = ndimage.label(inv, np.ones((3, 3)))

    # tout ce qui touche le cadre est le fond de plaque, jamais un interieur de lettre
    border = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    border.discard(0)

    sizes = ndimage.sum(inv, lab, range(1, n + 1))
    core = np.zeros(z.shape, bool)
    for i, size in enumerate(sizes, 1):
        if i in border or size < CORE_MIN:
            continue
        core |= lab == i
    return core, ring


def _bevel(z: np.ndarray) -> np.ndarray:
    """Contour du glyphe : lisere clair (top-hat blanc) + ombre portee (top-hat noir)."""
    white = z - ndimage.grey_opening(z, size=(5, 5))
    black = ndimage.grey_closing(z, size=(5, 5)) - z
    return ndimage.binary_closing((white > WHITE_TH) | (black > BLACK_TH), np.ones((3, 3)))


def _snowflakes(bevel: np.ndarray) -> np.ndarray:
    """Les 2 flocons n'ont pas d'interieur clos : on les reprend a leur geometrie propre
    (taille de trace et boite englobante mesurees), aux deux extremites du bandeau."""
    lab, n = ndimage.label(bevel, np.ones((3, 3)))
    sizes = ndimage.sum(bevel, lab, range(1, n + 1))
    boxes = ndimage.find_objects(lab)
    out = np.zeros(bevel.shape, bool)
    for i, size in enumerate(sizes, 1):
        if not (FLOC_MIN <= size <= FLOC_MAX):
            continue
        sl = boxes[i - 1]
        w = sl[1].stop - sl[1].start
        h = sl[0].stop - sl[0].start
        if not (FLOC_BOX[0] <= w <= FLOC_BOX[1] and FLOC_BOX[0] <= h <= FLOC_BOX[1]):
            continue
        # hors de la plage x du mot : c'est un flocon, pas une lettre
        if sl[1].stop < WORD_X0 or sl[1].start > WORD_X1:
            out |= lab == i
    return out


def build_mask() -> np.ndarray:
    z = _zone_luminance()
    core, _ring = _cores(z)
    bevel = _bevel(z)

    # on ne garde du contour QUE ce qui est connecte a un cœur : la rouille, qui n'en
    # touche aucun, tombe d'elle-meme — pas de seuil de bruit a doser.
    lab, _ = ndimage.label(core | bevel, np.ones((3, 3)))
    keep = set(np.unique(lab[core]))
    keep.discard(0)
    glyphs = np.isin(lab, list(keep))

    glyphs |= _snowflakes(bevel)
    glyphs = ndimage.binary_fill_holes(glyphs)

    # dernier filtre geometrique : un fragment isole plus petit qu'un point de « i » ne
    # peut pas etre un glyphe — c'est du mouchetis de rouille reste accroche au contour.
    lab, n = ndimage.label(glyphs, np.ones((3, 3)))
    sizes = ndimage.sum(glyphs, lab, range(1, n + 1))
    glyphs = np.isin(lab, [i for i, s in enumerate(sizes, 1) if s >= SPECK_MIN])

    full = np.zeros((896, 1195), bool)
    full[ZY0:ZY1, ZX0:ZX1] = glyphs
    return full


def main() -> None:
    keep = build_mask()

    zone = keep[ZY0:ZY1, ZX0:ZX1]
    cols = zone.sum(axis=0)
    covered = [x for x in range(WORD_X0, WORD_X1) if cols[x] > 0]
    print(f"mot couvert de x={covered[0]} a x={covered[-1]} (repere cadre)")
    print(f"flocons repris : {int(zone[:, :WORD_X0].sum())} px a gauche, "
          f"{int(zone[:, WORD_X1:].sum())} px a droite")

    soft = np.clip(ndimage.gaussian_filter(keep.astype(float), FEATHER) * 1.2, 0, 1)
    rgba = np.zeros((*soft.shape, 4), np.uint8)
    rgba[:, :, 0:3] = 255
    rgba[:, :, 3] = (soft * 255).astype(np.uint8)
    Image.fromarray(rgba).save(OUT)
    print(f"ecrit {OUT} — {int((rgba[:, :, 3] > 0).sum())} px opaques")


if __name__ == "__main__":
    main()
