# PLAN 6 — MESURES (session 2026-08-27)

## BORNES REELLES (⚠️ le tableau d'origine annoncait 18,03 -> 18,41)
- **Fondu croise entree** : demarre ~**17,00 s** (lum 43->31 pendant que le globe monte).
  A 17,10 « FosterWith » du plan 5 est ENCORE lisible par-dessus le globe.
- **Globe seul (fin du fondu)** : ~**17,45 s** (dark passe de 17% a 1,7% puis 0,1%).
- **Fin du plan / bascule plan 7** : ~**18,45 s** (flou radial max, luminance effondree).
- **Duree utile de la plongee** : 17,45 -> 18,45 = **1,00 s**.

## LE ZOOM — 2 methodes independantes, convergentes
| Methode | Resultat |
|---|---|
| Optique (recalage d'echelle frame a frame) | facteur **x1,125 par frame** constant, ~4,1 niv/s |
| Geographique (villes identifiees) | **z 3,08 -> 7,94** = **4,86 niveaux** sur 0,90 s = 5,4 niv/s |

⭐ **A CODER : zoom LINEAIRE de z=3,1 a z=7,9.**
⛔ Gemini a dit « acceleration exponentielle » — **FAUX au sens ou il l'entendait**.
Un facteur CONSTANT par frame (x1,125) = zoom lineaire en NIVEAUX Mapbox.
Coder une acceleration serait un contresens. (Meme famille que le piege n°5 : une
impression de vitesse n'est pas une mesure de vitesse.)

## LA CIBLE GEOGRAPHIQUE
Nebraska central — reperes lus sur la frame 18,30 : **Lexington · Johnson Lake ·
Elwood · Cozad · Gothenburg**, le long de l'I-80.
-> centre approx **lon -99.75 / lat 40.72** (zone Johnson Lake / Elwood).
Depart : Amerique du Nord centree, on voit Honolulu a gauche ET la Norvege a droite.

## LE FLOU RADIAL (raccord vers le plan 7)
Mesure de nettete (variance du laplacien) :
- 18,17 -> 18,30 : nettete stable **6,1 -> 4,6**
- 18,30 -> 18,50 : chute **4,6 -> 1,1** ET luminance **99 -> 46**
-> Le flou monte sur les **~0,33 s finales**, avec assombrissement SIMULTANE.
-> A 18,45 l'image est quasi illisible : une petite maison blanche au centre exact.
⭐ Consequence utile : **la fin du plan n'a pas besoin d'etre fidele geographiquement**,
elle est noyee. L'effort doit porter sur le DEBUT (le globe) et la REGULARITE du zoom.

## ⛔⛔ PIEGE DE LA SOURCE — NE PAS REPRODUIRE
La source contient des **frames entierement noires** a 18,033 et 18,100 s
(et 18,40 / 18,467 partiellement). J'ai failli les prendre pour un flash de montage.
**Verification qui a tranche** : sur ces frames, les SEULS pixels non-noirs sont
en y 9-44 / x 1790-1907 = **le watermark fiverr**, composite par-dessus.
=> Ce sont des **frames perdues par la capture d'ecran Fiverr**, pas du montage.
La video est en **VFR** (avg 30 fps, intervalles 24-50 ms, r_frame_rate=90000/1 aberrant).
⭐ Regle generale : une frame noire dont SEUL l'overlay survit est un artefact de capture.
Toujours regarder OU sont les pixels non-noirs avant de conclure a un effet.
