Voici une proposition de Direction Artistique (DA) experte, conçue exclusivement pour votre stack Remotion (SVG animé par code, Lucide-React, filtres SVG), qui respecte strictement vos contraintes et l'identité "Kora & Cartes".

---

### MISSION : METTRE EN SCÈNE LE DUEL (Sans Split-Screen)

Pour éviter le syndrome "PowerPoint 50/50", nous n'allons pas diviser l'espace, mais **faire de la carte du Sénégal elle-même le terrain d'affrontement des deux récits**. Les mythes s'emparent tour à tour de la forme du pays, la saturent, avant d'être rejetés.

Voici 2 partis-pris premium et actionnables en Remotion :

#### PARTI-PRIS 1 : "L'Invasion et le Refoulement" (Le jeu de masques SVG)
*L'idée : Les deux mythes sont des "couches" qui recouvrent la réalité. On joue sur l'écrasement temporel.*

*   **Le geste visuel (0-12s - La Malédiction) :** On part du Hook-B (fond Navy profond). Le pays est sombre. Depuis l'océan (à l'ouest), des traits SVG épais (Navy `#16213a` et Rouge Crise `#b23a2e`) "pénètrent" la côte ouest du Sénégal via un `stroke-dashoffset`. Au bout de ces lignes : des icônes Lucide `Droplet` (pétrole) et `Ship` inversées qui "pompent" (animation de *scale* rythmique). La carte semble parasitée, vidée de sa substance.
*   **L'opposition (12-19s - Le Miracle) :** *Soudain*, depuis la capitale (Dakar), un cercle parfait couleur Ocre (`#e7bd78`) grandit violemment (animation de rayon SVG avec un `spring` très rebondissant). Il agit comme un `clip-path` : en s'étendant, il "nettoie" les parasites rouges/navy, ramène le fond parchemin clair (`#e4ddca`), et fait popper des icônes Lucide `Shield` et `Flag` dorées. C'est triomphant, presque *trop* parfait (le mythe).
*   **La transition "Ailleurs/En direct" (19-32s) :** La voix dit "Mais la réalité...". L'image bégaie (un *glitch* d'opacité programmé sur 3 frames). **La fracture du Hook-B réapparaît au centre du pays Ocre, mais cette fois, elle s'écarte.** En code : on sépare le polygone du Sénégal en deux moitiés distinctes qui s'éloignent (translateX avec `spring` lourd). Au centre, dans "l'espace négatif" de la déchirure, on voit un vide Navy profond. La caméra (un `<AbsoluteFill>` avec un `scale` qui augmente exponentiellement) zoome *à l'intérieur* de cette faille géante, jusqu'à ce que le Navy remplisse l'écran. À 32s, le Navy fondu enchaîne sur l'eau bleu foncé de l'océan Mapbox.
*   **Pourquoi ça sert l'intention :** Le spectateur ressent l'oppression (rouge/noir), puis une fausse libération (ocre éclatant), puis la *rupture* de ces illusions quand la carte se déchire physiquement pour nous faire "tomber" dans la réalité brute (la mer).

#### PARTI-PRIS 2 : "Le Poids des Pions" (La balance physique)
*L'idée : Traiter les récits comme des poids physiques qu'on pose sur la carte en papier, jusqu'à la faire craquer.*

*   **Le geste visuel (0-12s - La Malédiction) :** Le fond est parchemin clair, mais de lourdes icônes Lucide Navy/Rouge (`Factory`, `Anchor`) tombent du haut de l'écran (animation Y avec `spring` lourd, faible *damping* pour l'impact). À chaque impact sur le Sénégal, la carte s'assombrit légèrement (transition d'un calque d'opacité Navy par-dessus l'Ocre). Des flèches (`ArrowUpRight`) s'échappent du pays vers l'Europe/l'Amérique.
*   **L'opposition (12-19s - Le Miracle) :** Pour contrer, de l'intérieur de la carte, des "piliers" s'élèvent (des rectangles SVG Ocre qui poussent vers le haut). Ils repoussent physiquement les icônes usines hors de l'écran. Une grande icône `User` (la nation) couronnée ou rayonnante apparaît au centre.
*   **La transition "Ailleurs/En direct" (19-32s) :** La tension entre les piliers ocre (qui poussent) et les derniers poids navy (qui écrasent) est trop forte. La carte commence à vibrer (animation `translateX` aléatoire de 1-2px). **CRAAAACK.** La ligne de fracture noire zèbre l'écran entier de haut en bas, déchirant non seulement la carte, mais aussi *la grille or-sable et le parchemin du fond*. Les deux moitiés de l'écran s'ouvrent comme des portes de théâtre (rotation Y en fausse 3D, ou simple écartement X). Derrière le papier déchiré : le vide, puis le zoom dans l'océan Mapbox.
*   **Pourquoi ça sert l'intention :** On matérialise le duel non pas comme un débat intellectuel, mais comme une lutte de forces mécaniques qui finit par détruire le cadre (la carte papier) pour révéler ce qu'il y a derrière.

---

### ANGLES OBLIGATOIRES (La Review DA)

#### 1. SPECTATEUR LAMBDA (Hiérarchie et Compréhension)
*   **Le risque :** Qu'il ne comprenne pas ce que représentent les formes, vu qu'on refuse le texte.
*   **La solution Stack :** Utiliser les icônes Lucide de manière *littérale mais stylisée*. Pour les multinationales : des `Factory` et `Ship` aux traits épais (`strokeWidth={2.5}`), rouge et navy. Pour la nation : `Shield` ou `Hand`. La direction des flèches SVG animées (sortantes vs entrantes) suffit à faire comprendre "l'extraction" vs "la réappropriation". Le regard est guidé par le mouvement : d'abord la côte (les bateaux arrivent), puis le centre (le bouclier s'étend), puis la faille (qui attire l'œil au milieu avant le zoom).

#### 2. NARRATION / SYNCHRO (Le rythme visuel)
*   **Le risque :** Être redondant (montrer un bateau quand elle dit "multinationale") ou en retard.
*   **La solution Stack :** L'image *précède* d'une demi-seconde. À 4.5s (juste avant "multinationales"), le rouge commence à s'infiltrer. À 11.5s (avant "nation"), le cercle Ocre explose. À 18.5s (avant "ailleurs"), la faille apparaît. Chaque "beat" de la voix correspond à un déclenchement de `spring` dans Remotion.

#### 3. TRANSITIONS vs ÉTATS (Fluidité)
*   **Le risque :** Avoir un état "carte rouge", cut, un état "carte ocre", cut.
*   **La solution Stack :** Tout est piloté par l'interpolation de `frame` en Remotion. Le passage de l'état "Malédiction" à "Miracle" n'est pas un cut, c'est l'onde de choc (le `clip-path` circulaire) qui balaie l'écran. La transition finale n'est pas un fondu, c'est un zoom *physique* dans la déchirure SVG, maintenant la texture du papier sur les bords jusqu'à ce que l'espace négatif remplisse l'écran.

#### 4. AI-SLOP (Ce qui fait amateur)
*   *(Voir la section détaillée ci-dessous, c'est le point crucial).*

#### 5. EXPERT DU MÉTIER (La touche premium)
*   **Le