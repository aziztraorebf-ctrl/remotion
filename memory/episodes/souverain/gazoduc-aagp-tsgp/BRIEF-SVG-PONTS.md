# MISSION — SVG de production, prêt à animer : "LES DEUX PONTS"

Tu produis UN SEUL fichier SVG statique (1920x1080), destiné à être ANIMÉ ENSUITE par nous dans
Remotion/React. Tu ne codes AUCUNE animation : tu livres le décor et les pièces, correctement
découpés et nommés. C'est nous qui animons.

## LE CONTEXTE NARRATIF (ce que la scène doit dire, sans un mot à l'écran)

Épisode documentaire sur deux projets de gazoduc rivaux vers l'Europe. Ce plan clôt l'acte 3 et dure
17,3 secondes. La voix off dit exactement :

"C'est le paradoxe de cette course. Le Maroc mise sur un tracé pacifié mais suspendu à un accord de
financement international. L'Algérie mise sur ses propres fonds, mais va devoir construire et
protéger une infrastructure géante en pleine zone de conflit."

Le paradoxe est une SYMÉTRIE CROISÉE : chaque pays a une force et la faiblesse inverse de l'autre.
- MAROC  : l'ouvrage est intact (force) / il ne tient à rien, le financement manque (faiblesse)
- ALGÉRIE : l'ouvrage est solidement fondé (force) / il est rompu en pleine zone de conflit (faiblesse)
Aucun des deux n'a les deux.

## LE DISPOSITIF VISUEL RETENU (validé — ne pas le redessiner autrement)

DEUX PONTS, côte à côte, de taille comparable, vus de profil.

PONT MAROC (à gauche, doré) : structure parfaite, arches régulières, tablier continu et lisse.
MAIS il ne repose sur RIEN : aucune pile, aucune fondation, aucun sol dessous. Il est SUSPENDU en
l'air par TROIS FILS très fins qui montent verticalement hors du cadre par le haut. Sous lui, un
vide net et sombre.
⚠️ POINT CRITIQUE — ces trois fils sont le sens même du plan ("suspendu à un accord"). Ils doivent
rester visibles, lisibles et présents ; ne les efface jamais, ne les rends jamais décoratifs.

PONT ALGÉRIE (à droite, cyan) : l'inverse exact. Fondations MASSIVES, piles épaisses plantées dans
un sol solide, ancrage visiblement lourd et définitif. MAIS son tablier est ROMPU en son milieu :
une brèche nette, des fragments détachés, et une lueur rouge qui pulse dans la fracture.

Le sens : l'un est parfait mais ne tient à rien ; l'autre tient solidement mais il est cassé.

## CE QUE TU DOIS LIVRER — DÉCOUPAGE EN PIÈCES ANIMABLES (LE POINT LE PLUS IMPORTANT)

⛔ Le piège à éviter absolument : livrer un beau SVG monolithique qu'on ne peut pas animer.
Un tablier fusionné avec ses arches est INUTILISABLE : on ne peut plus ouvrir la brèche.

Découpe la scène en groupes `<g id="...">` indépendants et adressables, un par élément qui devra
bouger séparément. Au minimum :

  fond                     fond radial
  maroc_tablier            le tablier doré, d'un seul tenant (il ne casse jamais)
  maroc_arches             les arches sous le tablier
  maroc_fils               les 3 fils de suspension — ⚠️ chacun dans un sous-groupe distinct
                           (fil_1, fil_2, fil_3) pour pouvoir les faire vibrer en décalé
  maroc_vide               la zone sombre sous le pont (l'absence d'appui)
  algerie_tablier_gauche   le demi-tablier gauche, jusqu'à la brèche
  algerie_tablier_droit    le demi-tablier droit, à partir de la brèche
                           ⚠️ deux groupes SÉPARÉS : c'est ce qui permet d'ouvrir la fracture
  algerie_fragments        les éclats détachés dans la brèche (à révéler)
  algerie_lueur_rouge      la lueur dans la fracture (à révéler et faire pulser)
  algerie_piles            les piles/fondations massives
  algerie_sol              le sol dans lequel elles sont plantées
  plaque_maroc             plaque de nom (rectangle + texte MAROC)
  plaque_algerie           plaque de nom (rectangle + texte ALGÉRIE)

Règles de découpage, non négociables :
1. TOUT élément destiné à TOURNER ou PIVOTER doit être dans son propre `<g>` dont le point (0,0)
   local EST son axe — utilise `transform="translate(cx cy)"` sur le groupe et dessine les enfants
   autour de l'origine, pour qu'un simple `rotate()` suffise.
   (Vécu : un axe recalculé à la main était faux de 29 px et a coûté 4 essais.)
2. Chaque état alternatif est un groupe SÉPARÉ superposé — jamais un seul dessin "moyen".
3. Les groupes à révéler progressivement (fragments, lueur rouge) : `opacity="0"` dans le livrable.
4. Aucun `style=""` inline sur un attribut que nous devrons animer (opacity, transform, fill) —
   mets-les en ATTRIBUTS XML.
5. Pas de `<style>` global, pas de classes CSS, pas de `<animate>`, pas de JS. SVG statique pur.
6. En tête de fichier, un commentaire XML listant chaque groupe : ce qu'il est, et comment on est
   censé l'animer.

## MATIÈRE ET PALETTE (strictes)

Style : flat vector éditorial premium (registre Vox / Bloomberg Originals). Aplats, dégradés
linéaires ou radiaux SIMPLES, contours nets, halos doux.
⛔ INTERDITS : 3D, biseaux, effets métalliques ou vitrés, textures photoréalistes, perspective,
ombres portées réalistes, dégradés à plus de 3 arrêts.

  fond radial          #0d1f38 (centre) -> #050c1a (bords)
  or / Maroc           #FFC742   (accent chaud #FFE38A pour les surbrillances)
  cyan / Algérie       #00C4FF
  rouge alerte         #FF4B45
  pierre / structure   #16304f  avec contours #58809f
  blanc / texte        #F4F8FF

Texte autorisé à l'écran : UNIQUEMENT les deux plaques de noms (MAROC, ALGÉRIE). Rien d'autre.
⚠️ Les accents français doivent être présents et corrects : "ALGÉRIE" avec le É.
⚠️ Vérifie l'attribution : la plaque MAROC va sous le pont DORÉ SUSPENDU, la plaque ALGÉRIE sous le
pont CYAN ROMPU. (Un modèle précédent les a inversées — ne reproduis pas cette erreur.)

## SORTIE ATTENDUE

Écris le fichier ici :
  src/projects/_rnd/svg-scenes/GazoducDeuxPonts.svg

Puis donne-moi, en quelques lignes, la liste des groupes que tu as créés et comment tu recommandes
de les animer sur les 17,3 s. Ne code aucun composant React, ne modifie aucun autre fichier.
