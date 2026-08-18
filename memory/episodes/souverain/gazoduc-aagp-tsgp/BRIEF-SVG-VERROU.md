# MISSION — SVG de production, prêt à animer : "LE VERROU CROISÉ"

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
- MAROC  : la route est sûre (force) / le financement est bloqué (faiblesse)
- ALGÉRIE : le financement est acquis (force) / la route est dangereuse (faiblesse)
Aucun des deux n'a les deux. C'est ÇA qu'on doit ressentir.

## LE DISPOSITIF VISUEL RETENU (validé — ne pas le redessiner autrement)

Une conduite de gaz vue EN COUPE (cutaway), horizontale, avec DEUX VANNES successives dessus.
On voit le fluide À L'INTÉRIEUR de la conduite.

Le plan se joue en deux temps sur la MÊME conduite :
- Temps 1 (0 -> 7,8 s) = le cas MAROC. La 1re vanne (sécurité) est GRANDE OUVERTE, volant large,
  mécanisme franc. Le fluide doré avance... et bute sur la 2e vanne (financement), FERMÉE, dont le
  mécanisme est fin, fragile, arachnéen — des filaments délicats au lieu d'un volant plein.
  Au-delà de cette vanne fermée, la conduite est VIDE et sombre. Le fluide ne passe pas.
- Temps 2 (7,8 -> 17,3 s) = le cas ALGÉRIE, exactement INVERSÉ. La vanne de financement est
  massive, solide, cyan, GRANDE OUVERTE, avec des disques verrouillés. Mais la vanne suivante
  (sécurité) est bloquée : barbelés stylisés enroulés autour d'elle, fissures rouges qui courent
  sur son corps. Là encore, le fluide ne passe pas.

Le sens : dans les deux cas quelque chose essaie de passer et n'y arrive jamais — mais pas au même
endroit. C'est le mouvement du fluide qui porte les 17 secondes.

## CE QUE TU DOIS LIVRER — DÉCOUPAGE EN PIÈCES ANIMABLES (LE POINT LE PLUS IMPORTANT)

⛔ Le piège à éviter absolument : livrer un beau SVG monolithique qu'on ne peut pas animer.
Un chemin qui mélange le corps de la vanne et son volant est INUTILISABLE : on ne peut pas faire
tourner le volant sans faire tourner la vanne entière.

Donc, dès CE premier appel, découpe la scène en groupes `<g id="...">` indépendants et adressables,
un par élément qui devra bouger séparément. Au minimum :

  conduite_corps          la conduite en coupe (paroi, brides) — fixe
  conduite_interieur      le volume creux dans lequel le fluide circule (sert de zone de clip)
  fluide_or               le fluide doré. ⚠️ dessine-le PLEIN sur toute la longueur utile :
                          nous en révélerons une portion variable par masque/dashoffset.
  fluide_cyan             idem en cyan pour le temps 2
  vanne1_corps            corps de la 1re vanne (fixe)
  vanne1_volant           SON VOLANT SEUL, centré sur son axe de rotation (voir ci-dessous)
  vanne2_corps            corps de la 2e vanne (fixe)
  vanne2_volant           son volant seul
  vanne2_mecanisme_fin    les filaments arachnéens (état "financement bloqué", Maroc)
  disques_verrouilles     les disques cyan empilés (état "financement acquis", Algérie)
  barbeles                les barbelés, à révéler
  fissures_rouges         les fissures, à révéler
  plaque_maroc            plaque de nom (rectangle + texte MAROC)
  plaque_algerie          plaque de nom (rectangle + texte ALGÉRIE)

Règles de découpage, non négociables :
1. TOUT élément destiné à TOURNER doit être dans son propre `<g>` dont le point (0,0) local EST son
   axe de rotation — utilise `transform="translate(cx cy)"` sur le groupe et dessine les enfants
   autour de l'origine. Ainsi `rotate()` suffira, sans que nous ayons à recalculer un centre.
   (Vécu : un axe recalculé à la main était faux de 29 px et a coûté 4 essais.)
2. Chaque état alternatif (ouvert/fermé, sain/fissuré) est un groupe SÉPARÉ, superposé au même
   endroit — jamais un seul dessin "moyen". Nous ferons apparaître/disparaître par opacité.
3. Les groupes à révéler progressivement (barbelés, fissures) : `opacity="0"` dans le livrable.
4. Aucun `style=""` inline sur un attribut que nous devrons animer (opacity, transform, fill) —
   mets-les en ATTRIBUTS XML, pas en CSS, sinon la surcharge React devient pénible.
5. Pas de `<style>` global, pas de classes CSS, pas de `<animate>`, pas de JS. SVG statique pur.
6. En tête de fichier, un commentaire XML listant chaque groupe : ce qu'il est, et comment on est
   censé l'animer (ex: `fluide_or — révéler par clip de gauche à droite, 0->100% sur 4 s`).

## MATIÈRE ET PALETTE (strictes)

Style : flat vector éditorial premium (registre Vox / Bloomberg Originals). Aplats, dégradés
linéaires ou radiaux SIMPLES, contours nets, halos doux.
⛔ INTERDITS : 3D, biseaux, effets métalliques ou vitrés, textures photoréalistes, perspective,
ombres portées réalistes, dégradés à plus de 3 arrêts.

  fond radial          #0d1f38 (centre) -> #050c1a (bords)
  or / Maroc           #FFC742   (accent chaud #FFE38A pour les surbrillances)
  cyan / Algérie       #00C4FF
  rouge alerte         #FF4B45
  métal / conduite     #16304f  avec contours #58809f
  blanc / texte        #F4F8FF

Texte autorisé à l'écran : UNIQUEMENT les deux plaques de noms (MAROC, ALGÉRIE). Rien d'autre —
pas de titre, pas de légende, pas d'annotation, pas de chiffre.
⚠️ Les accents français doivent être présents et corrects : "ALGÉRIE" avec le É.

## SORTIE ATTENDUE

Écris le fichier ici :
  src/projects/_rnd/svg-scenes/GazoducVerrouCroise.svg

Puis donne-moi, en quelques lignes, la liste des groupes que tu as créés et comment tu recommandes
de les animer sur les 17,3 s. Ne code aucun composant React, ne modifie aucun autre fichier.
