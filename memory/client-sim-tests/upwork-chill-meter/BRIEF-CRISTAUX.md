# BRIEF SVG — PLANCHE DE CRISTAUX DE GIVRE ET DE GEL DE BORD D'ECRAN

## LE PROBLEME A RESOUDRE
Dans une animation d'overlay video, quand un compteur atteint 100 %, les 4 bords de l'ecran
doivent GELER. Actuellement le gel est fait de polygones a 7 cotes generes par code : ca se lit
comme **des petits carres blancs qui apparaissent de nulle part**, pas comme du vrai givre.
On veut remplacer ca par de VRAIS cristaux dessines.

## CE QU'ON DEMANDE
UN fichier SVG contenant une **PLANCHE de pieces reutilisables** (pas une scene composee).
Chaque piece est un `<symbol>` autonome qu'on instanciera N fois par code, a des positions,
tailles et rotations differentes.

viewBox de la planche : `0 0 1200 800`. Fond TRANSPARENT.

## LES PIECES ATTENDUES — ids EXACTS

### A. Cristaux de neige individuels (6 variantes)
`<symbol id="cristal_01">` … `<symbol id="cristal_06">`
- Vrais flocons a **symetrie hexagonale (6 branches)**, comme dans la nature.
- Chacun DIFFERENT : dendritique (branches ramifiees comme une fougere), etoile simple,
  plaque hexagonale, colonne, aiguille, fougere dense.
- Dessines dans un viewBox local `0 0 100 100`, **centres sur (50,50)** pour qu'une rotation
  autour du centre soit triviale.
- Trait fin blanc/bleu glace, avec un leger halo. Ils doivent rester lisibles a 12 px comme a 80 px.

### B. Gel de bord (4 pieces, une par cote)
`<symbol id="gel_bord_bas">` `gel_bord_haut` `gel_bord_gauche` `gel_bord_droit`
- Une bande de givre qui **s'accroche au bord** et pousse vers l'interieur du cadre.
- Bord franc du cote du cadre, **frange irreguliere et organique** du cote interieur
  (dents de longueurs variables, comme du gel qui progresse sur une vitre).
- Doit pouvoir etre etiree horizontalement sans se deformer visiblement (formes repetables).
- Piece horizontale : viewBox local `0 0 400 120`. Piece verticale : `0 0 120 400`.

### C. Fleurs de givre (3 variantes)
`<symbol id="fleur_givre_01">` `fleur_givre_02` `fleur_givre_03`
- Les motifs ramifies qui se forment sur une vitre froide : arborescences qui partent d'un point
  et se ramifient en s'affinant. PAS symetriques — organiques, chaotiques, comme du vrai givre.
- viewBox local `0 0 200 200`, origine de croissance au point `(100,190)` (bas-centre),
  la ramification monte vers le haut.

### D. Eclat de glace (3 variantes)
`<symbol id="eclat_01">` `eclat_02` `eclat_03`
- Petits fragments cristallins anguleux, facettes, comme des eclats de verre glace.
- viewBox local `0 0 60 60`, centres sur (30,30).

## CONTRAINTES TECHNIQUES (non negociables)
1. **Chaque piece est un `<symbol>` autonome** avec son propre `viewBox`, jamais un `<g>` pose
   a une position absolue. On doit pouvoir faire `<use href="#cristal_03" x=".." y=".." width=".."/>`.
2. **ZERO animation** : pas de `<animate>`, `<animateTransform>`, `<style>`, classe CSS, JS.
   Tout en attributs XML kebab-case (`stroke-width`, `fill-opacity`).
3. Les `<defs>` (gradients, filtres) sont partages en tete, ids prefixes `gv_`.
4. Palette : blanc `#ffffff`, blanc glace `#eaf7ff`, cyan `#8fe4ff`, bleu glace `#5cc8ff`.
   Les pieces seront posees sur un fond SOMBRE et parfois sur de la video : privilegier
   le trait clair lumineux, jamais du bleu fonce invisible.
5. **Opacite** : les pieces sont livrees pleinement visibles (`opacity` non fixee ou = 1) —
   c'est notre code qui gerera l'apparition progressive.
6. En bas de la planche, poser une **grille de demonstration** : toutes les pieces instanciees
   cote a cote via `<use>`, dans un `<g id="demo_planche">`, pour qu'on voie le rendu d'un coup.

## FIDELITE — ce qui compte
Du VRAI givre : symetrie hexagonale pour les flocons, ramification organique pour les fleurs de
givre, franges irregulieres pour les bords. Le test de reussite : **on ne doit jamais pouvoir dire
"c'est un polygone genere par une boucle"**. C'est exactement le defaut qu'on corrige.

## LIVRABLE
UN fichier `.svg` valide (`xmllint --noout` passe), autonome, sans police exotique.
