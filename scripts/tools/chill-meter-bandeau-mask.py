"""Genere le pochoir du texte grave du bandeau « AbiGirl Reacts » du chill-meter.

Sortie : public/_client-sim/chill-meter/bandeau-texte-mask.png (1195x896, aligne 1:1
sur device-rustique.png). Consomme par `mask_bandeauTexte` dans ChillMeterRustic.tsx
pour n'allumer en bleu QUE le mot et les 2 flocons, sans toucher a la plaque.

POURQUOI UN POCHOIR ET PAS UN FILTRE DE COULEUR
-----------------------------------------------
Sur cette plaque, texte et metal occupent la MEME plage de luminance : l'histogramme
de la zone est strictement unimodal (pic large 72-136), les faces de lettres (~110-125)
chevauchent les reflets du metal (~90-100). Aucun `feComponentTransfer` ne peut donc
les separer — mesure faite, c'est la cause des 2 regressions precedentes (plaque
noircie, puis plaque teintee en bleu uniforme). Idem pour 3 autres discriminateurs par
pixel testes et ecartes : variance de texture, amplitude de gradient, integration du
relief — tous unimodaux sur ce grunge.

CE QUI MARCHE : les lettres sont EMBOSSEES. Elles se distinguent par leur RELIEF, pas
par leur valeur — lisere clair fin en haut-gauche, ombre portee dure en bas-droite.
- un top-hat morphologique (lum - ouverture 7x7) isole ce lisere fin sans repondre au
  grain large de la rouille (p99=120 contre p50=10) ;
- lisere + ombre ENCADRENT chaque glyphe : le remplissage de contour donne le corps
  plein, au trace exact du PNG.
Le masque est donc EXTRAIT de l'image — cale au pixel, la ou une police de substitution
derive (Arial Black derive d'une largeur de lettre entiere des « Reacts »).

VERIFICATION : les seules colonnes vides du masque sont x=324/604/924, qui sont
exactement les espaces inter-mots. Mesure sur le rendu final (frame 104) : delta
allume/eteint = 88.0 sur les glyphes contre 2.4 sur la plaque (ratio 37x), derive de
luminance de la plaque +1.6/255, saturation bleue de la plaque ~0.

Relancer uniquement si device-rustique.png change.
"""

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "public/_client-sim/chill-meter/device-rustique.png"
OUT = "public/_client-sim/chill-meter/bandeau-texte-mask.png"

# Interieur de la plaque du bandeau, hors cadre biseaute (releve dans le PNG).
ZY0, ZY1, ZX0, ZX1 = 154, 221, 264, 928

RIM_TOPHAT = 70   # seuil du lisere de bevel apres top-hat
SHADOW_GAP = 22   # ecart sous la moyenne locale qui marque l'ombre portee
MIN_BLOB = 120    # px : sous ce seuil c'est du mouchetis de rouille, pas un glyphe
FEATHER = 0.6     # px d'antialiasing — assez pour lisser l'escalier, pas pour flouter


def build_mask() -> np.ndarray:
    rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(float)
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]

    zone = np.zeros(lum.shape, bool)
    zone[ZY0:ZY1, ZX0:ZX1] = True

    tophat = lum - ndimage.grey_opening(lum, size=(7, 7))
    rim = (tophat > RIM_TOPHAT) & zone
    shadow = (lum < ndimage.uniform_filter(lum, 25) - SHADOW_GAP) & zone

    env = ndimage.binary_closing(rim | shadow, np.ones((3, 3)))
    filled = ndimage.binary_fill_holes(env) & zone

    lab, n = ndimage.label(filled)
    sizes = ndimage.sum(filled, lab, range(1, n + 1))
    boxes = ndimage.find_objects(lab)
    keep = np.zeros_like(filled)
    for i, size in enumerate(sizes, 1):
        if size < MIN_BLOB:
            continue
        sl = boxes[i - 1]
        # rejeter ce qui touche le coin haut-gauche de la zone : c'est le cadre, pas un glyphe
        if sl[1].start <= ZX0 + 1 and sl[0].start <= ZY0 + 1:
            continue
        keep |= lab == i
    return keep


def main() -> None:
    keep = build_mask()

    # controle : hors espaces inter-mots, aucune colonne de la zone ne doit etre vide
    cols = keep[:, ZX0:ZX1].sum(axis=0)
    empty = [ZX0 + i for i in range(0, len(cols), 20) if cols[i : i + 20].mean() < 0.5]
    print(f"colonnes vides (attendu: les 3 espaces inter-mots) -> {empty}")

    soft = np.clip(ndimage.gaussian_filter(keep.astype(float), FEATHER) * 1.2, 0, 1)
    rgba = np.zeros((*soft.shape, 4), np.uint8)
    rgba[:, :, 0:3] = 255
    rgba[:, :, 3] = (soft * 255).astype(np.uint8)
    Image.fromarray(rgba).save(OUT)
    print(f"ecrit {OUT} — {int((rgba[:, :, 3] > 0).sum())} px opaques")


if __name__ == "__main__":
    main()
