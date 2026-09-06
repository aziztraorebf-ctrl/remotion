# Wordmark AURA — relevé de mesures et reconstruction SVG

Source : `441559fe-image.jpg` (1024 × 1024, JPEG).
Méthode : **mesure puis tracé à la main**. Aucune vectorisation automatique
(pas de potrace, pas de `vectorize_image`, pas de Recraft).

---

## 1. Méthode

1. **Seuillage.** Le lettrage clair est isolé du fond bordeaux par un seuil de
   luminance (`(R+G+B)/3 > 128`). Le contraste est franc (fond ≈ 30–115, lettrage ≈ 240),
   donc le seuil n'est pas un point sensible : il tombe au milieu de l'antialiasing.
2. **Composantes connexes** (`scipy.ndimage.label`) → 5 composantes, donc
   **5 glyphes strictement séparés, aucune ligature**.
3. **Épaisseur.** Transformée de distance euclidienne, puis lecture de la valeur
   sur la crête (maxima locaux). Donne l'épaisseur en tout point du tracé.
4. **Squelettisation** (`skimage.morphology.skeletonize`) → axe médian, puis
   parcours ordonné du squelette (marche 8-connexe avec préférence pour la
   continuité de direction aux jonctions) → une polyligne du centre du trait.
5. **Ajustement de primitives.** Pour chaque portion : moindres carrés d'un cercle
   (`scipy.optimize.least_squares`) ou d'une chaîne de cubiques de Bézier **G1**
   (tangentes partagées aux nœuds, longueurs de poignées libres).
6. **Vérification par le bord.** Là où le squelette échoue (zone de fusion entre la
   barre du A et son fût), la ligne médiane a été reconstruite depuis le **bord
   gauche** du glyphe décalé de 15 u le long de sa normale. Contrôle croisé :
   au point de raccord, le squelette et cette reconstruction concordent à **0,28 px**.
7. **Boucle de raffinement.** Le SVG est rendu par `rsvg-convert`, comparé au masque
   de référence, et les coordonnées sont ajustées coordonnée par coordonnée
   contre le rendu réel — pas contre un modèle intermédiaire.

---

## 2. Réponse aux trois questions posées

### Épaisseur constante ? **OUI, mesuré.**

Largeur relevée sur les portions rectilignes (mesure la plus fiable, sans biais de courbure) :

| segment | bords | largeur |
|---|---|---|
| fût droit du A | x ∈ [365, 395] | 31 px |
| fût gauche du u | x ∈ [422, 452] | 31 px |
| fût droit du u | x ∈ [541, 570] | 30 px |
| fût du r | x ∈ [598, 628] | 31 px |
| fût du a | x ∈ [818, 847] | 29–30 px |
| fond du u (coupe verticale) | y ∈ [589, 619] | 30–31 px |

Épaisseur sur la crête de la transformée de distance : médiane 30,0 / 31,1 selon
le glyphe, p10–p90 = 28,3 → 32,0. **La dispersion (± 1 px) est celle du seuillage
de l'antialiasing, pas une variation de dessin.** L'anneau du `a` le confirme
indépendamment : épaisseur 28,0 → 29,0 sur les 24 rayons échantillonnés tous les 15°.

→ **Épaisseur = 30 u, constante.** Retenu : `stroke-width="30"`.

### Extrémités arrondies ? **OUI, mesuré.**

Toutes les terminaisons sont des demi-disques de rayon 15 (= épaisseur / 2) :
- fût bas du A : la colonne x = 380 s'étend jusqu'à y = 622, soit un centre de cap à y = 608 ;
- caps hauts du u : y min = 452 aux deux fûts → centres à y = 466–467 ;
- fût bas du a : la largeur décroît 30 → 28 → 24 → 20 → 16 → 6 entre y = 610 et 620,
  profil exactement circulaire pour un centre à y = 605,5 ;
- point du A : disque plein parfait, bbox 44 × 44 px, aire 1517 px → r = 21,97.

→ `stroke-linecap="round"`. **Le draw-on par `stroke-dasharray` est donc faisable
sans réserve** : le logo est un tracé à ligne médiane, pas un contour rempli.
C'est le point qui conditionnait la faisabilité de l'animation, et il est acquis.

### Jonctions entre lettres ? **AUCUNE. Mesuré.**

Les 5 composantes connexes sont disjointes. Écarts entre glyphes voisins
(bord à bord) : A→u = 27 px, u→r = 28 px, r→a = 6 px. Même le r et le a,
visuellement serrés, ne se touchent pas. Chaque lettre est donc animable
indépendamment.

---

## 3. Géométrie relevée, glyphe par glyphe

Repère : celui de l'image source, 1024 × 1024, y vers le bas.
`viewBox="0 0 1024 1024"` — le SVG livré est donc **directement superposable au JPEG**.

### Métriques communes

| | valeur |
|---|---|
| bbox du mot | x ∈ [174, 847], y ∈ [398, 623] — 674 × 226 px |
| ligne de base (centre des caps bas) | y = 605,0 pour u / r / a ; y = 608,0 pour le A |
| hauteur d'x (centre des caps hauts) | y = 466–468 |
| sommet du A (ligne médiane) | y = 413,5 |
| hauteur d'x | 605 − 467 = **138 u** |
| hauteur de capitale | 608 − 413,5 = **194,5 u** |

**Rythme des fûts** (centres) : A = 380,0 → u gauche = 437,0 → u droit = 555,5 →
r = 613,0 → a = 832,5. Les écarts A→u et u→r valent **57,0 et 57,5** : la chasse
est régulière, ce n'est pas un dessin approximatif.

### A — le glyphe signature

Un **tracé unique et continu**, plus une barre transversale. Parcours relevé sur le
squelette, de la queue vers la boucle :

1. **fût droit**, rigoureusement vertical, x = 380,0 (écart-type 0,82 px sur 130 px
   de hauteur), du cap bas y = 608 jusqu'à y = 445 ;
2. **arche du sommet** : arc de cercle, centre (350,1 ; 443,5), rayon 29,7.
   Sa tangente droite tombe à x = 350,1 + 29,7 = **379,8** — donc tangente au fût à
   0,2 px près. La verticalité du fût cesse exactement à y = 443,5, l'ordonnée du
   centre de l'arc : la construction est cohérente ;
3. **diagonale gauche**, de (325, 428) à (293, 500). Ce n'est **pas** une droite :
   la pente passe de −0,5 en haut à −0,17 en bas (résidu d'un ajustement linéaire :
   2,8 px). Rendue par deux cubiques ;
4. **boucle en goutte**, sens antihoraire, extrêmes x ∈ [190, 281], y ∈ [505, 607].
   Ajustement d'un cercle : erreur 23 px → ce n'est pas un cercle, c'est bien une
   spirale/goutte. Rendue par 7 cubiques G1, erreur maximale 1,30 px ;
5. la boucle **revient sur elle-même** au point de croisement, vers (277, 508).

**Barre transversale** : part du croisement (290, 508), traverse la diagonale, et
descend en s'incurvant jusqu'à **rejoindre tangentiellement le fût droit** vers
(380, 608), c'est-à-dire au cap bas. C'est le point que le squelette seul rate :
dans la zone de fusion barre + fût, l'axe médian est happé par le fût et le
squelette s'arrête à (373, 567). La ligne médiane réelle a été reconstruite depuis
le bord gauche du glyphe (relevé y par y de 500 à 622, décalé de 15 u sur la normale) :
elle passe par (352, 557), (366, 584), (372, 596) puis (378, 608). **Corriger ce
seul point a fait tomber l'écart maximal du A de 13 px à 3,6 px.**

**Point** : disque plein, centre **(306,50 ; 598,50)**, rayon **22,00**.
Il est posé dans l'ouverture de la boucle, sous le croisement — libre, il ne
touche aucun trait (distance minimale au tracé : 12 px).

### u

Symétrique, sans descendante à droite (les deux fûts s'arrêtent à la même hauteur) :
- fûts verticaux x = 437,00 et x = 555,50 (écart-type 0,00 et 0,25 px), caps hauts y = 466 ;
- cuvette : **demi-cercle exact**, centre (496,25 ; 546,00), rayon 59,25
  (ajustement moindres carrés : erreur max 1,11 px) — soit exactement la
  demi-distance entre les fûts, donc tangence parfaite.

IoU du modèle paramétrique seul, contre le masque : **0,9927**.

### r

- fût vertical x = 613,00, cap bas y = 605,3 ;
- épaule : montée puis courbe vers la droite, terminaison à **(655,5 ; 468,5)**
  (centre du cap, déterminé comme le disque de rayon 15 inscrit maximal).
  Un arc de cercle unique n'y suffit pas (IoU 0,915) ; une chaîne de 3 cubiques
  descend à **0,96 px d'erreur maximale**. L'épaule n'est donc pas circulaire.

### a

Un **`a` à un seul étage, purement géométrique** :
- **anneau : cercle complet**, centre (762,75 ; 536,11), rayon 70,20.
  Vérifié par balayage radial tous les 15° : rayon de ligne médiane 69,75 → 71,12
  sur les 24 directions, épaisseur 28,0 → 29,0. Écart au cercle parfait : ≤ 2,8 px.
  L'échancrure visible en bas à droite n'est pas une ouverture de l'anneau, c'est le
  raccord du fût : modélisé comme cercle fermé + fût, il ne manque plus qu'**1 pixel**
  sur les 13 762 du glyphe ;
- **fût** vertical x = 832,50 (constant du haut en bas), cap bas y = 605,5.
  Il est tangent au cercle : 762,75 + 70,20 = 832,95, soit 0,45 px du fût mesuré.
  Son sommet est **noyé dans l'anneau** et donc invisible ; toute valeur ≲ 545 rend
  à l'identique. Retenu : y = 545.

---

## 4. Couleurs

- **Lettrage** : `#F2E8E9` (médiane sur 37 030 px du cœur du tracé, érodé de 4 px
  pour écarter l'antialiasing ; écart-type 1,25 / 0,97 / 0,83 par canal). Aucun
  dégradé dans les lettres : la médiane est identique sur les trois tiers de hauteur.
- **Fond** : dégradé **strictement vertical**. Régression linéaire par canal sur le
  fond (hors lettrage dilaté de 12 px) : le coefficient en x vaut −0,00005 à −0,00002,
  soit ~0 ; le coefficient en y porte tout le dégradé. RMS résiduel 1,5–2,3 par canal.
  → `#6C1D34` en haut, `#320917` en bas, `linearGradient` vertical.

⚠️ Ces valeurs sont relevées **à travers une compression JPEG** sur fond sombre.
Elles sont fidèles à l'image fournie, mais si le client dispose de sa charte, ce
sont ses valeurs qui font foi — les remplacer coûte une ligne.

---

## 5. Fidélité atteinte — chiffres

Protocole : le SVG livré est rendu par `rsvg-convert -w 1024 -h 1024`, seuillé au
même seuil que la référence, et comparé pixel à pixel.

| métrique | valeur |
|---|---|
| IoU global | **0,9675** |
| écart significatif (> 1,5 px du bord de référence) | **11 px sur 54 638** = **0,020 %** du lettrage |
| écart maximal | **2,00 px** |
| écart médian | 1,00 px |

Par glyphe : A = **0 px** d'écart significatif, u = 1 px, r = 1 px, a = 10 px,
point = 0 px. Aucun glyphe ne dépasse 2,00 px d'écart maximal.

**Sur l'interprétation de l'IoU.** L'IoU brut (0,964) sous-estime la fidélité, et il
faut le dire clairement plutôt que de le laisser passer pour une marge d'erreur :
le SVG est rendu avec un antialiasing différent de celui du JPEG, si bien qu'une
frange d'environ 1 px court le long de **tout** le contour — soit à elle seule
~2 300 px de désaccord, alors que la géométrie est juste. La preuve directe :
sur le `a`, un modèle « cercle parfait + fût vertical » laisse **1 seul pixel
manquant et 511 en trop**, et ces 511 forment un liseré uniforme de 1 px tout
autour du glyphe — un décalage de seuil, pas une erreur de forme.

C'est pourquoi la métrique retenue est l'**écart significatif** : un pixel ne compte
que s'il est à plus de 1,5 px du bord de l'autre forme, ce qui neutralise
l'antialiasing et ne mesure plus que les vraies divergences de tracé.
**47 pixels sur 54 638, écart maximal ~3 px sur un mot de 674 px de large.**

Progression au fil des passes, pour situer d'où l'on part :

| version | écart significatif | écart max |
|---|---|---|
| premier jet | 1 133 px (2,07 %) | 18,4 px |
| fût du `a` corrigé, anneau fermé | 782 px (1,43 %) | 13,0 px |
| épaule du `r` en Bézier | 491 px (0,90 %) | 13,0 px |
| **barre du A prolongée jusqu'au fût** | 142 px (0,26 %) | **3,6 px** |
| raffinement sub-pixel (A, r) | 12 px (0,022 %) | 2,00 px |
| fût du A remis parfaitement vertical | **11 px (0,020 %)** | **2,00 px** |

Le saut décisif est le quatrième : la barre du A. Un premier jet ne suffit jamais
sur du lettrage, et c'est l'inspection du diff — pas le score global — qui a
désigné la cause.

Dernière passe : le raffinement sub-pixel avait légèrement incliné le fût du A
(380,00 → 381,50 sur sa hauteur) pour gratter des pixels d'antialiasing. Le
redresser à la verticale exacte a **amélioré** le score (12 → 11 px) tout en
restaurant la construction juste. Quand l'optimiseur et la mesure divergent,
c'est la mesure qui a raison.

**Contrôle visuel.** La carte de différence absolue entre l'original et le rendu
(`difference.png`) ne montre qu'**un liseré de 1 px le long de chaque contour**,
sans aucune tache épaisse : les intérieurs des traits sont parfaitement noirs.
Une erreur de forme se verrait comme une zone pleine — il n'y en a aucune.

---

## 6. Ce qui reste imparfait, et pourquoi

1. **Écart résiduel 2 px, sur 11 pixels isolés** — dont 10 sur le `a`, au raccord
   entre l'anneau et le fût. C'est une zone de **fusion de traits**, où l'axe médian
   est intrinsèquement mal défini et où le dessin d'origine a probablement un
   raccord légèrement adouci que deux primitives tangentes ne reproduisent pas
   exactement. À l'échelle d'affichage (le mot fait 674 px de large), 2 px est très
   en dessous du seuil de perception, et l'inspection visuelle ne le distingue pas.

2. **La source est un JPEG.** Le contour de référence est lui-même flou sur ~1,5 px
   et porte des artefacts de compression. On ne peut pas être plus fidèle que la
   référence n'est nette : une partie de l'écart résiduel mesure le JPEG, pas mon tracé.

3. **Le sommet du fût du `a` est indéterminé** — il est masqué par l'anneau. La valeur
   retenue (y = 545) rend à l'identique, mais ce n'est pas une mesure, c'est un choix.
   Il devient visible si l'animation dessine le fût séparément : dans ce cas, faire
   partir le fût du point de tangence sur l'anneau, pas de y = 545.

4. **La boucle du A est approchée par 7 cubiques** (erreur 1,30 px). Le dessin
   d'origine est vraisemblablement une spirale construite autrement ; on en reproduit
   la trajectoire, pas la construction. Sans le fichier vectoriel source, c'est la
   limite structurelle de l'exercice.

5. **Non vérifié faute de source** : que ces courbes soient les courbes *originales*
   du designer. Ce qui est établi, c'est qu'elles coïncident avec le rendu fourni à
   ~3 px près. Si le client peut fournir l'AI/SVG d'origine, il prime sur ce relevé.

---

## 7. Fichiers livrés

| fichier | contenu |
|---|---|
| `aura-logo.svg` | le wordmark seul, **fond transparent** (alpha=0 verifie), lettrage `#F2E8E9` |
| `aura-logo-sur-fond.svg` | idem + le fond bordeaux dégradé, pour comparaison visuelle |
| `MESURES.md` | ce document |
| `comparaison.png` | original / rendu, cote a cote, pleine resolution |
| `difference.png` | carte de difference absolue (amplifiee x3) |
| `rendu.png` | le rendu 1024x1024 de `aura-logo-sur-fond.svg` |

### Structure — calques nommés par glyphe

```
<g id="wordmark-aura">          stroke-width=30, linecap=round, linejoin=round
  <g id="glyph-A">
      <path id="A-trait">       fût + arche + diagonale + boucle (un seul tracé)
      <path id="A-barre">       la traverse, jusqu'au raccord sur le fût
  <g id="dot-A">
      <circle id="A-point">     le point — seul élément en `fill`, pas en `stroke`
  <g id="glyph-u">  <path id="u-trait">
  <g id="glyph-r">  <path id="r-trait">
  <g id="glyph-a">
      <path id="a-anneau">      le cercle
      <path id="a-jambage">     le fût droit
```

**Tout est en `stroke`, jamais en contour rempli** (sauf le point, qui est un disque).
C'est ce qui rend le `stroke-dasharray` possible : le draw-on se pilote directement,
sans avoir à reconstruire un chemin d'animation.

### Longueurs de tracé — pour le `stroke-dasharray`

| calque | longueur |
|---|---|
| `A-trait` | 655,9 u |
| `A-barre` | 139,5 u |
| `u-trait` | 346,1 u |
| `r-trait` | 159,1 u |
| `a-anneau` | 441,1 u |
| `a-jambage` | 60,5 u |
| **total** | **1 802,3 u** |

### Notes pour l'animation

- **Sens d'écriture.** Chaque `d` part de l'extrémité naturelle du geste : le A monte
  depuis la queue, passe l'arche, descend la diagonale et finit dans la boucle — un
  draw-on par `stroke-dasharray` suit donc le geste d'un stylo, sans retournement.
  Le `u` part du fût gauche, le `r` du bas de son fût.
- **Le point est le dernier temps naturel** : il se pose (scale/opacity) après la
  boucle qui l'entoure. C'est l'élément que le client cite explicitement — il mérite
  son propre beat, pas d'être fondu dans la masse.
- **L'anneau du `a` étant un cercle fermé**, son draw-on part de 9 h (le point
  (692,55 ; 536,11)) et tourne dans le sens horaire.
- Chaque glyphe est un `<g>` distinct : un décalage temporel par lettre se fait
  sans toucher aux tracés.
- **Export Lottie** : les `id` sont conservés en noms de calques. Attention, Lottie
  ne connaît pas les arcs elliptiques `A` — les convertir en cubiques à l'export
  (le `u` et le `a-anneau` sont concernés).
