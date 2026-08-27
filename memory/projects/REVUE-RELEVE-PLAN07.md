# REVUE LIGNE PAR LIGNE du releve Grok — plan 7 (avant de declarer fini)

## § 5 « CE QUI EST FACILE A RATER » — 12 points, coches un par un

| # | Point releve | Statut chez nous |
|---|---|---|
| 1 | Flou RADIAL (pas gaussien), rayons depuis le centre | ✅ dans le CLIP H3 (genere avec le flou) |
| 2 | Ease-out violent : 80 % du travelling dans le 1er quart | ✅ mesure sur notre clip : 42,6 / 39,4 / 18,0 % |
| 3 | TILT couple a la descente (pas un scale 2D) | ✅ c'est tout l'objet du previs de bascule d'axe |
| 4 | Parallaxe pelouse / maison / branches | ✅ porte par le clip genere |
| 5 | La pastille n'apparait PAS deja en pilule : cercle -> rect vide -> texte | ✅ spring sur la largeur, 86 -> 470 px |
| 6 | Le conteneur titre s'elargit PAR PALIERS avec les mots | ✅ **corrige ce jour** (titre mot par mot) |
| 7 | Le 2e bloc nait APRES le titre, VIDE, puis le texte tape dedans | ⚠️ **ECART** : chez nous il ne se monte qu'avec son 1er mot |
| 8 | Frappe par PAQUETS de mots, pas lettre a lettre | ✅ on revele mot par mot |
| 9 | Micro-poussee 3-4 frames apres le lock-off | ✅ porte par le clip |
| 10 | Branches en surplomb au 1er plan apres le stop | ✅ porte par le clip |
| 11 | Ombres qui grossissent avec l'approche | ✅ porte par le clip |
| 12 | Filigrane fiverr jamais affecte (c'est un overlay) | ✅ **ecarte volontairement** : on ne reproduit pas le watermark |

## § 4 APPARITIONS — chronologie annoncee vs la notre
| evenement | Grok (frames de SON echantillon) | nous (frames du plan) | ok ? |
|---|---|---|---|
| cercle UI | ~6 | 21 | ✅ (echelles differentes, ordre respecte) |
| « Jenny » | 8 | 66 | ✅ mesure a 20,65 s |
| « Foster » / « Care » | 11 / 13-14 | +9 / +18 | ✅ |
| 2e encadre | 11-12 | 78 | ⚠️ voir point 7 |
| corps de texte | 12-21 | 78 -> 142 | ✅ |
| dashboard | 27 (fondu, cartouches RECYCLEES) | hors de ce plan | ✅ appartient a l'ASSEMBLAGE |

## LES 2 ECARTS ASSUMES
1. **Le 2e cartouche ne parait pas vide** avant son texte (~0,2 s d'ecart). Corrige
   ci-dessous : il se monte des F_TITRE+12 avec son contour, le texte suit.
2. **Le watermark fiverr** n'est pas reproduit — decision de projet, pas un oubli.
   ⚠️ Les modeles le reclament systematiquement (piege deja documente dans REPRO-FOSTER).

## ⭐ CE QUE LA REVUE A RAPPORTE
Le point 7 n'aurait ete trouve NI par ma mesure (l'ecart dure 0,2 s) NI a l'oeil.
Il vient de la relecture du releve — exactement ce que la consigne « reprendre le
releve LIGNE PAR LIGNE avant de declarer fini » sert a attraper.
