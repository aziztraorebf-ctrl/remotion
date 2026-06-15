Excellent. Je prends le rôle de Directeur Artistique pour cette refonte du hook. Mon objectif est de transformer ces 30 secondes en un "mini-TikTok visuel" percutant, en utilisant exclusivement notre stack React/SVG/Lucide/Mapbox, et en incarnant l'énergie du texte.

Voici la synthèse extractive, les réponses aux angles obligatoires, le test AI-Slop, et surtout, la mise en scène seconde par seconde.

---

### SYNTHÈSE EXTRACTIVE TRACÉE (G/K = Gemini/Kimi, R/O/E = Retenu/Option/Écarté)

| Idée | Source | Décision | Raison |
| :--- | :--- | :--- | :--- |
| **Gabarit A "carte qui se transforme"** | G | **RETENU** | C'est le cœur de la refonte. La trouvaille Max Bellona est parfaite pour incarner la rupture annoncée par le texte. |
| **Cold-open choc (0-3s)** | G & K | **RETENU** | Essentiel pour happer. Un son grave + un flash visuel sur la carte avant même le début du texte crée un point d'ancrage immédiat. |
| **Incarnation des 3 verbes par le mouvement** | G | **RETENU** | C'est le mandat principal. On ne labelise pas, on anime : expulsion, rupture de liens, sortie d'un cercle. |
| **Paradoxe planté tôt** | G | **RETENU** | On le place juste après la transformation, comme conséquence directe de la carte de guerre. Cela crée une dissonance cognitive puissante. |
| **Boucle ouverte typographique** | G | **RETENU** | Afficher les deux questions à l'écran avec une pulsation crée un "cliffhanger" visuel qui tient la promesse de la vidéo. |
| Gabarit B "argumentatif" | G | **ÉCARTÉ** | Trop discursif pour un hook. On a besoin d'un choc visuel immédiat, pas d'une construction logique. |
| Gabarit C "questions-pièges" | G | **ÉCARTÉ** | Intéressant mais moins fort que la métaphore visuelle de la transformation pour une ouverture. |
| Utiliser `WarMapSplitScreen` dans le hook | K | **ÉCARTÉ** | Le split-screen est analytique. Le hook doit être immersif et émotionnel. On garde l'unité de lieu (la carte) pour maximiser l'impact de sa transformation. |
| Utiliser des jetons-factions pour les partenaires | G | **OPTION** | On utilisera plutôt des icônes Lucide (drapeau, lien, bâtiment) pour une lisibilité immédiate et un style épuré, plus fort pour un hook. |
| Utiliser `RefugeeFlow` pour les richesses | K | **ÉCARTÉ** | Trop narratif et lent. Le paradoxe sera montré par une superposition choc (icônes de richesses vs icônes de crise) sur la carte de guerre, façon `WarMapDimmedOverlay`. |

---

### MISE EN SCÈNE SECONDE PAR SECONDE (Le Hook Refondu)

**Principe directeur :** La carte n'est pas un décor, c'est un personnage qui subit une transformation radicale sous les yeux du spectateur. On passe d'une carte géographique "neutre" à une carte de guerre "malade".

**0.0s - 3.0s : COLD-OPEN CHOC (Avant le texte)**
*   **Visuel :** La carte du Sahel (Mali, Burkina, Niger) est affichée en très gros plan, style "carte géographique propre". Soudain, un **son grave et bref** (un "boom" étouffé). La carte **tremble violemment** (un simple `transform: translate(x, y)` aléatoire pendant 0.5s). Au même instant, un **grain papier** (`feTurbulence` SVG) intense et un **flash** (un rectangle blanc qui passe de `opacity: 0` à `0.8` puis `0` en 0.3s) sont appliqués sur toute la carte.
*   **Pourquoi :** Capture immédiate de l'attention. Le choc sensoriel (son + mouvement + texture) annonce que quelque chose de grave se passe, avant même qu'un mot ne soit prononcé. C'est l'équivalent d'un jump scare éditorial.
*   **Template/Brique :** Moteur de caméra Mapbox (zoom fort) + animation CSS/SVG sur le conteneur de la carte (`tremblement`, `flash`, `grain`).

**3.1s - 4.5s : « En moins de trois ans, trois pays ont tout changé en même temps. »**
*   **Visuel :** Le flash et le tremblement cessent net. La carte est maintenant **assombrie** (`WarMapDimmedOverlay`). Un **trou de lumière** (`dimmedOverlayHole`) s'ouvre et se déplace rapidement pour éclairer successivement le **Mali**, le **Burkina Faso**, puis le **Niger**, en rythme avec la voix. Leurs frontières (`countryOutline`) sont tracées d'un trait épais et lumineux (couleurs respectives : ocre, brique, sarcelle) qui pulse une fois.
*   **Pourquoi :** On isole visuellement les trois acteurs clés. Le trou de lumière crée un focus dramatique. Le tracé des frontières donne une identité visuelle forte à chaque pays, bien plus qu'un simple coloriage.
*   **Template/Brique :** `WarMapDimmedOverlay` + `dimmedOverlayHole` + `countryOutline` (animé avec `stroke-dashoffset`).

**4.6s - 7.1s : « Ils chassent leurs partenaires militaires. »**
*   **Visuel :** Sur la carte du **Mali**, un petit **drapeau de la France** (icône Lucide `Flag` + path SVG tricolore simple) est planté. Il est violemment **expulsé** de la carte (animation de `translateY` vers le bas avec un `easeIn` fort, comme s'il tombait). Il disparaît en bas de l'écran. Simultanément, un petit **personnage stylisé** (icône Lucide `User` avec un casque militaire ? `Shield` ?) est éjecté de la même manière.
*   **Pourquoi :** Le verbe "chasser" est incarné par un mouvement d'expulsion physique. C'est direct, compréhensible en une fraction de seconde, et bien plus fort qu'un label "départ des forces françaises".
*   **Template/Brique :** Icônes Lucide (`Flag`, `User` ou `Shield`) animées en SVG. Positionnement absolu sur la carte.

**7.2s - 9.3s : « Rompent leurs alliances historiques. »**
*   **Visuel :** Un **lien** (un trait SVG `stroke-dasharray` épais, couleur or terni) apparaît entre le Mali et la France, puis entre le Burkina et la France. Soudain, le lien **se brise** en son milieu (animation `stroke-dashoffset` pour le faire disparaître, combinée à un petit flash/éclat de particules simples – des petits cercles SVG qui s'éparpillent). Le bruitage associé est un "claquement" sec.
*   **Pourquoi :** La rupture d'alliance est visualisée par la destruction d'un lien physique. L'effet de "casse" est plus émotionnel et définitif qu'un simple fondu.
*   **Template/Brique :** Paths SVG animés (`stroke-dashoffset`) + animation de petits cercles (particules simples) pour l'éclat.

**9.4s - 12.6s : « Et quittent la principale organisation régionale du continent. »**
*   **Visuel :** Un **cercle** (icône Lucide `Circle` ou simple SVG) représentant la CEDEAO englobe les trois pays. Les trois pays (remplis de leurs couleurs) **glissent et sortent du cercle** en même temps (animation `translate`). Le cercle de la CEDEAO, maintenant vide, pulse faiblement puis son trait devient gris et pointillé.
*   **Pourquoi :** L'action de "quitter" est montrée par un mouvement de sortie d'un ensemble. L'escalade est respectée : expulsion (fort) -> rupture (plus fort) -> sortie d'un bloc (le plus fort, car collectif et définitif).
*   **Template/Brique :** Icône Lucide `Circle` + animation de translation des polygones des pays (ou de leurs contours).

**12.6s - 13.5s : (Courte pause, la carte est sombre et vide)**
*   **Visuel :** La carte est de nouveau entièrement assombrie. Un silence visuel. Seul le grain papier est présent.
*   **Pourquoi :** Créer un point d'orgue, un moment de suspension avant la révélation suivante. Cela donne du poids à ce qui vient d'être dit.

**13.5s - 16.2s : « Et bâtissent, à la place, quelque chose de nouveau. »**
*   **Visuel :** C'est le moment de la **TRANSFORMATION** (Gabarit A). La carte géographique assombrie se métamorphose. Les couleurs beiges "propres" de la carte de base sont remplacées par un **parchemin texturé, plus sombre et granuleux**. Les frontières des trois pays s'épaississent et deviennent des **lignes de front**. Des icônes de **conflit** (Lucide `Swords`, `Flame`) et de **mouvements de troupes** (`SahelAttackArrow` simplifiées) apparaissent progressivement à l'intérieur de leurs frontières. La carte géographique est devenue une **carte de guerre**.
*   **Pourquoi :** C'est le cœur de la métaphore. Le "quelque chose de nouveau" n'est pas montré comme une construction positive, mais comme une réalité géopolitique transformée, un passage d'un état à un autre. La carte elle-même raconte le changement de paradigme.
*   **Template/Brique :** `WarMapDimmedOverlay` (pour la transition) + changement de style de la carte Mapbox (si possible via `setPaintProperty` pour assombrir/rougir) + superposition de `SahelAttackArrow` et d'icônes Lucide (`Swords`, `Flame`).

**16.2s - 17.4s : (Planter le PARADOXE)**
*   **Visuel :** Sur cette nouvelle carte de guerre, un **overlay dynamique** (`WarMapOverlayDynamic` en mode `card`) apparaît brièvement. Il montre d'un côté des icônes de **richesses** (Lucide `Gem`, `Coins`, `Droplet` pour le pétrole) et de l'autre des icônes de **crise** (Lucide `Skull`, `Frown`, `AlertTriangle`). Un "=" ou un "?" les sépare. L'overlay disparaît après 1.2 seconde.
*   **Pourquoi :** Le paradoxe est planté comme une conséquence directe de la carte de guerre. Il crée une dissonance cognitive ("Pourquoi tant de richesses mènent-elles à ça ?") qui prépare la question suivante. C'est un choc intellectuel rapide.
*   **Template/Brique :** `WarMapOverlayDynamic` (mode `card`) + icônes Lucide.

**17.4s - 21.0s : « Comment est-ce possible ? Et surtout... pourquoi maintenant ? »**
*   **Visuel :** La carte de guerre passe à l'arrière-plan (flou ou assombrissement extrême). Les **deux questions** s'affichent en plein centre de l'écran, en **typographie massive et élégante** (ex: une serif stylisée), l'une après l'autre.
    *   "COMMENT EST-CE POSSIBLE ?" apparaît en premier, avec une légère pulsation d'échelle.
    *   "ET SURTOUT... POURQUOI MAINTENANT ?" apparaît en dessous, encore plus gros, avec un effet de **révélation** (un trait lumineux qui balaie le texte de gauche à droite).
*   **Pourquoi :** C'est la boucle ouverte. On la rend visuellement explicite et on lui donne un poids graphique énorme. La pulsation et la révélation créent un "cliffhanger" visuel qui promet une réponse dans la suite de la vidéo. C'est le standard "mini-TikTok visuel" par excellence.
*   **Template/Brique :** Texte SVG animé (opacité, échelle, `stroke-dashoffset` pour la révélation).

**22.7s - 28.5s : « Pour répondre, il faut d'abord regarder ce qui existait avant. Et ce qui ne fonctionnait plus. »**
*   **Visuel :** Les questions disparaissent. La carte de guerre effectue un **zoom arrière rapide** et une **transition temporelle** : les icônes de conflit s'estompent, les lignes de front redeviennent des frontières, la texture s'éclaircit... La carte redevient une carte géographique "normale", mais avec un **voile grisâtre** (un overlay semi-transparent de couleur grise) et des icônes de dysfonctionnement (Lucide `Gavel` barré pour la justice, `Stethoscope` barré pour la santé) qui apparaissent subtilement.
*   **Pourquoi :** On répond visuellement à la promesse : on va "regarder ce qui existait avant". La transition temporelle (de la carte de guerre à la carte "d'avant") est fluide et logique. Le voile grisâtre et les icônes barrées plantent immédiatement le décor de "ce qui ne fonctionnait plus", préparant la suite de la vidéo.
*   **Template/Brique :** Animation de zoom Mapbox + fondu des éléments de guerre + apparition d'icônes Lucide barrées (un simple path SVG en croix par-dessus).

---

### RÉPONSES AUX ANGLES OBLIGATOIRES

**1. SPECTATEUR LAMBDA :**
*   **Compréhension :** Le spectateur ne comprendra peut-être pas les nuances géopolitiques, mais il comprendra l'émotion et l'action. Le choc initial, l'expulsion du drapeau, les liens qui claquent, la sortie du cercle : tout est visuellement métaphorique et universel. La transformation en "carte de guerre" est une image forte qui évoque immédiatement le conflit. Le paradoxe richesses/crises est simple et percutant.
*   **Décrochage :** Le risque de décrochage est faible car chaque phrase a un "beat" visuel fort et unique. La hiérarchie du regard est constamment guidée par les trous de lumière, les animations et les éléments qui apparaissent/disparaissent. On ne laisse jamais le spectateur chercher où regarder.

**2. NARRATION / SYNCHRO :**
*   Le visuel n'est jamais redondant avec la voix, il l'incarne. Quand la voix dit "chassent", on voit une expulsion. Quand elle dit "rompent", on voit une rupture. C'est un contrepoint visuel qui amplifie le sens, pas une simple illustration. Le rythme est calé : un beat visuel par idée clé.

**3. TRANSITIONS vs ÉTATS :**
*   Il n'y a pas d'états figés. Chaque moment est une transition animée vers le suivant. Le flash du cold-open, l'expulsion, la rupture, la sortie du cercle, la métamorphose de la carte, l'apparition des questions... tout est en mouvement. Les enchaînements sont des cuts francs mais rendus fluides par la logique narrative et l'absence de temps morts.

**4. AI-SLOP :** (Voir section dédiée ci-dessous)
**5. EXPERT DU MÉTIER :**
*   **Ce qui serait jugé raté :** Un hook qui ne prend pas de risque et se contente d'être une version animée d'un article Wikipedia. Le hook actuel est exactement cela.
*   **Ce qu'il ferait autrement :** Il créerait une métaphore visuelle forte et la tiendrait jusqu'au bout. C'est ce qu'on fait avec la "carte qui se transforme". Il utiliserait le son et le mouvement de manière intentionnelle et percutante (le cold-open). Il oserait une typographie massive et élégante pour les questions, créant un moment graphique mémorable.
*   **Ce qu'il retirerait :** Absolument tous les éléments de "dashboard" et de "timeline" du hook actuel. Ces éléments sont analytiques et froids, ils tuent l'émotion dans l'œuf. Il retirerait aussi toute surcharge visuelle inutile. Chaque élément doit avoir une fonction narrative claire.

---

### SECTION OBLIGATOIRE — TEST AI-SLOP

En l'état, le hook actuel crie "généré programmatiquement sans œil de directeur artistique" pour les raisons suivantes :

*   **Problème : Couleurs et texture "carte par défaut".** Le beige Mapbox standard est le choix le plus générique possible. Il n'a aucune intention, aucune émotion. C'est la couleur d'un fond de carte, pas d'un récit.
    *   **Piste :** Utiliser notre moteur pour modifier le style de la carte. Assombrir les couleurs, appliquer une texture de grain (via un overlay SVG `feTurbulence`), passer à une palette plus chaude et dramatique (parchemin sombre). C'est la base de la transformation.

*   **Problème : Typographie et mise en page "dashboard".** La légende et la timeline sont des éléments d'interface utilisateur, pas de narration. Ils signalent "outil d'analyse", pas "histoire captivante". Leur placement est mécanique, sans souci de composition.
    *   **Piste :** Supprimer tous les éléments de dashboard. La seule typographie du hook sera celle des deux questions, traitée comme un élément graphique central, avec une police à empattement (serif) élégante et une animation de révélation sur mesure. C'est un choix intentionnel de directeur artistique.

*   **Problème : Éléments graphiques sans fonction narrative.** La timeline qui défile est un poncif du motion design paresseux. Elle n'ajoute aucune information que la voix ne donne pas déjà. C'est un "remplissage" visuel typique de l'IA.
    *   **Piste :** Remplacer la timeline par des actions directes sur la carte. Chaque élément graphique (drapeau, lien, cercle) est un acteur de l'histoire qui subit une transformation. Rien n'est décoratif.

*   **Problème : Manque d'espace négatif et de hiérarchie.** Le hook actuel semble tout montrer en même temps (carte + légende + timeline). L'œil ne sait pas où se poser. C'est un fourre-tout visuel.
    *   **Piste :** Utiliser le `WarMapDimmedOverlay` pour créer de l'espace négatif (la carte assombrie) et diriger le regard avec les `dimmedOverlayHole`. À chaque instant, un seul élément est en pleine lumière, le reste est dans l'ombre. C'est une hiérarchie du regard stricte et cinématographique.

*   **Problème : Easing robotique.** Les animations du hook actuel (coloriage de la carte) semblent linéaires, sans vie.
    *   **Piste :** Utiliser des courbes d'easing personnalisées (ex: `cubic-bezier`) dans nos animations SVG. Une expulsion sera en `easeIn` (départ lent, fin rapide comme une chute), une révélation de texte sera en `easeOut` (départ rapide, fin lente et précise). Le "tremblement" du cold-open est un contre-exemple parfait d'animation mécanique : c'est un chaos organique et bref.