# Décor de fond océanique — 4e piste (dessin statique) — « Le cauri »

Mission : dessiner un décor de fond illustré (aplats purs, style vectoriel), pas coder une
animation. Le fond défilera par translation horizontale lente en Remotion — ce n'est PAS
mon ressort ici, ni le choix final entre cette piste et les 3 variantes génératives déjà
codées dans `fond-vivant.tsx`.

## Dimensions

- **Largeur choisie : 4800 px** (2,5x la largeur finale 1920px). Marge large pour un
  travelling de 23s sans jamais approcher un bord, quelle que soit la vitesse retenue par
  l'orchestrateur.
- Hauteur : 1080 px (exact, comme demandé).
- `viewBox="0 0 4800 1080"`.

## Composition — 3 couches de profondeur

`<g id="decor-fond">` racine, 3 sous-groupes nommés par profondeur :

- `<g id="couche-lointaine">` — 2 bandes ondulées larges (vallées abyssales) + 5 masses
  organiques éparses (bancs lointains), teinte `#0A2038` (plus sombre que le fond), très
  faible opacité (0,28-0,55).
- `<g id="couche-mediane">` — 1 bande ondulée + 4 masses organiques plus grandes (reliefs),
  teinte `#123A5C`, opacité 0,36-0,50.
- `<g id="couche-proche">` — 1 bande haute (suggestion de lumière lointaine, jamais un
  horizon net) + 1 bande basse (premier plan flou) + 6 "courants" très allongés et fins
  (traits, pas des bulles), teinte `#1A4A72`, opacité 0,13-0,28 — la plus claire des 3
  couches mais reste très en retrait du blanc chaud `#F2E8D5` réservé aux coquilles.

Chaque couche est pensée pour un parallax à vitesse différente (lointaine = la plus lente,
proche = la plus rapide) — le montage/l'animation n'est pas fait ici, mais la séparation en
groupes le permet directement.

## Palette utilisée (verrouillée, aucun écart)

- `#0E2A44` — fond de base (brief §5).
- `#0A2038` — couche lointaine (plus sombre que le fond).
- `#123A5C` — couche médiane.
- `#1A4A72` — couche proche (plus claire, contraste le plus fort mais reste doux).
- **Aucun** `#F2E8D5` (réservé aux coquilles) et **aucun** rouge-brun `#8A5A2B` (réservé à
  l'effondrement) — vérifié par grep, absents du SVG.

## Zéro dégradé, zéro filtre — comment le relief est suggéré

Conformément à la contrainte "aplats purs, zéro dégradé, zéro ombre portée" : tout est fait
par **empilement de formes pleines à opacité variable** (jamais de `<linearGradient>` /
`<radialGradient>`, jamais utilisés — vérifié par grep, 0 occurrence). La sensation de
profondeur vient uniquement de : (1) la superposition de bandes ondulées à teintes/opacités
différentes, (2) la taille décroissante des masses de la couche proche vers la couche
lointaine.

## Comment la boucle horizontale est garantie

Chaque bande ondulée est une somme d'harmoniques `sin(2*pi*k*x/LARGEUR + phase)` avec `k`
entier — la fonction paramétrique a donc une période mathématique **exactement égale** à
`LARGEUR` (4800px). Conséquence directe : `y(x=0) == y(x=LARGEUR)` de façon exacte dans le
code, pas approximée. Les masses organiques (blobs) sont positionnées à des `x` réguliers
(`largeur/n` + jitter) pour garder la même densité de part et d'autre de la couture x=0/4800.

**Vérifié** : rendu du SVG en PNG (rsvg-convert 4800x1080), extraction de la colonne de
pixels x=0 et x=4799, comparaison composante par composante sur 216 échantillons verticaux
→ écart max 15/765 (≈2%), imputable à l'anti-aliasing du rasterizer, pas à la géométrie
(le SVG source est périodique exact). Le brief n'exigeait pas un raccord pixel-perfect,
seulement qu'aucune forme nette ne soit coupée en deux au bord — confirmé sur les 4 crops
(voir ci-dessous), aucune forme n'est tronquée de façon visible.

## Preuve de défilement — `apercu-defilement.png`

Planche 2x2, 4 fenêtres de 1920x1080 extraites du SVG rendu en pleine résolution :
- haut-gauche : x=0
- haut-droite : x=960 (1/3 de 4800-1920)
- bas-gauche : x=1920 (2/3 de 4800-1920)
- bas-droite : x=2880 (fin, dernière position possible avant de sortir du cadre)

Chaque fenêtre a été **regardée isolément** avant ce montage (règle de vérification de
l'agent) : aucune forme n'est coupée bizarrement dans aucune des 4, le contraste reste
faible et cohérent partout, et le relief médian (le plus grand blob) traverse plusieurs
positions de façon crédible sans jamais devenir net.

## Itération faite en cours de mission

1re version : masses en ellipses parfaites régulièrement espacées → lisait comme un motif
de "pois" plutôt qu'un relief (vu au rendu, pas supposé). Corrigé en remplaçant les
`<ellipse>` par des `blob_svg()` — polygones à contour irrégulier (variation de rayon par
lobe, déterministe) — et en réduisant leur nombre (9→5, 7→4, 11→6) pour casser la
répétition mécanique. Les bandes ondulées elles-mêmes sont passées de 3-4 à 6-7 harmoniques
pour une silhouette moins "sinusoïde de manuel", toujours strictement périodique.

## Écarts au brief

Aucun écart connu. Le générateur est déterministe (seed=7) : rejouer `gen-decor-fond.py`
reproduit exactement le même SVG.

## Fichiers

- `decor-fond.svg` — le dessin (4800x1080, 25 ids uniques, XML validé, 0 filtre/mask/clip/
  use/pattern/text/image/gradient).
- `gen-decor-fond.py` — générateur rejouable.
- `apercu-defilement.png` — planche de preuve des 4 positions de défilement.
