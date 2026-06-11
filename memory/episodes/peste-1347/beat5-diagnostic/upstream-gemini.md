Voici l'analyse experte et le plan de bataille pour valider définitivement ce Beat 5. 

### RÉPONSE AUX QUESTIONS UPSTREAM (Le Diagnostic du Plan)

**Ce plan attaque-t-il la VRAIE cause ?** 
**OUI, à 100%.** Le diagnostic est parfait. Le syndrome du "sticker qui glisse" vient toujours de trois manques : l'absence de sol (C1/C5), l'absence de physique/inertie (C2), et l'absence d'espace (C4). 

**Manque-t-il une correction déterminante ?**
**Oui : La gestion de l'échelle (Scale) au moment du Zoom-Out.** Quand la caméra va dézoomer pour montrer l'Europe qui s'effondre (f529), si tes sprites (caravane/bateau) gardent la même taille relative à l'écran, ils vont paraître gigantesques sur la carte globale. *Correction à ajouter :* Lier le `scale` des sprites à l'inverse du `scale` de la caméra, ou les faire fondre (fade out) subtilement quand l'Europe devient le sujet principal.

**Un point risque-t-il d'empirer ?**
Le **C4 (Tilt fausse-3D)**. Dans un environnement SVG/d3-geo, utiliser `transform: scaleY(0.6) skewX(-15deg)` sur le conteneur global va écraser les *strokes* (bordures des pays) et les rendre incohérents. *Parade technique :* Assure-toi que tous tes tracés SVG utilisent `vector-effect="non-scaling-stroke"`, et que les sprites appliquent la transformation inverse pour rester "debout" face caméra (billboarding 2D).

**Ordre de construction :** Ton ordre (C1 -> C2 -> C3/C5 -> C4 -> C6) est le bon. On construit la mécanique (le chemin), la physique (l'easing), l'intégration (ombres/glow), la réalisation (caméra), et enfin la narration (la peste).

---

### ANGLES OBLIGATOIRES (La Review)

**1. SPECTATEUR LAMBDA (Compréhension & Regard)**
*   **Le problème :** Le spectateur décroche au Maghreb. Si la caravane disparaît et qu'un bateau apparaît plus loin, l'œil est perdu. De plus, si l'Europe devient rouge d'un coup, le lien de causalité avec le bateau est invisible.
*   **La piste (Stack) :** Le regard doit suivre **l'Or**. Au Maghreb, la caravane s'arrête, l'opacité du bateau passe de 0 à 1 *exactement au même point géographique*, et le bateau démarre. À Venise, le bateau touche la côte, et c'est *ce point de contact précis* qui déclenche une animation SVG (un `clip-path` circulaire qui grandit ou un `fill` qui se propage de pays en pays via un délai Remotion) pour colorer l'Europe.

**2. NARRATION / SYNCHRO (Voix vs Visuel)**
*   **Le problème :** La voix cite "Florence f459" puis "Venise f497". Si le bateau va en ligne droite vers Venise, l'image est désynchronisée de l'audio à f459.
*   **La piste (Stack) :** Le bateau accoste en Italie vers f450. La propagation rouge commence par Florence (f459), puis atteint Venise (f497), puis le reste de l'Europe (f529). Le visuel *valide* ce que dit la voix au frame près.

**3. TRANSITIONS vs ÉTATS (Fluidité)**
*   **Le problème :** Le passage de la "phase Mali" à la "phase Europe" risque d'être un cut sec.
*   **La piste (Stack) :** Une **caméra continue**. Utilise un objet "Null" (des coordonnées virtuelles interpolées). La caméra tracke ce Null. Le Null suit la caravane, puis le bateau, puis au moment où le bateau touche Venise, le Null se déplace vers le centre de l'Europe pendant que la caméra dézoome. Zéro cut.

**4. AI-SLOP (Ce qui fait amateur)**
*   **Le problème :** L'image v12 fournie crie "boucle de code" avec sa grille parfaite 2x3 de porteurs alignés au pixel près, avançant à la même vitesse.
*   **La piste (Stack) :** Le retard de phase (C1) est vital. Mais pour tuer l'AI-slop, ajoute un **micro-offset sur l'axe Y (perpendiculaire à la route)** pour chaque sprite. `position = getPointAtLength(t - delay) + noiseY`. Ils ne marcheront plus sur une ligne parfaite, mais en grappe organique.

**5. EXPERT DU MÉTIER (Le détail pro)**
*   **Le problème :** La carte est trop vide autour de l'action. Le Sahara ressemble à un aplat de couleur mort.
*   **La piste (Stack) :** Ajoute des tracés SVG extrêmement subtils (opacité 0.05, stroke-dasharray) représentant *d'autres* routes commerciales historiques en arrière-plan. Cela donne de la profondeur au monde et met en valeur la route principale (dorée et animée) par contraste.

---

### SECTION OBLIGATOIRE — ÉVITER L'AI-SLOP (Préventif)

Voici les pièges procéduraux qui vont ruiner le plan une fois codé, et comment les contrer dans Remotion :

1.  **Le "Chemin Bézier Parfait" (Risque critique) :**
    *   *Risque :* Une courbe mathématique lisse entre Niani et le Maghreb fait "GPS moderne", pas expédition du 14e siècle.
    *   *Parade :* Ne pas utiliser un simple `M x y Q x y x y`. Utiliser d3-geo pour générer une route passant par 3 ou 4 vraies oasis historiques (Tombouctou, Taghaza). Le tracé aura de légers angles naturels. Lisser ensuite avec un `curveBasis` de D3.
2.  **L'Easing "Vanilla" (Risque modéré) :**
    *   *Risque :* Un `spring` Remotion par défaut sur la progression globale donne un effet "élastique" absurde pour une caravane.
    *   *Parade :* Utiliser `Easing.bezier(0.25, 0.1, 0.25, 1)` (ease-in-out classique) sur la progression du tracé (`stroke-dashoffset` et position des sprites). La caravane part lentement, atteint sa vitesse de croisière, et ralentit en arrivant au port.
3.  **Le Glow "On/Off" (Risque esthétique) :**
    *   *Risque :* Baisser l'opacité du glow Mali (C3) avec une interpolation linéaire basique (1 -> 0.2) fait "dimmer switch".
    *   *Parade :* Garder le `fill` du Mali constant mais animer le `stroke` (bordure) avec un léger effet de respiration (sinusoïde basée sur `frame / fps`), même quand il est atténué. Le pays reste "vivant" sans écraser la caravane.
4.  **L'Ombre "Sticker" (Risque d'intégration) :**
    *   *Risque :* Une ellipse noire sous les pieds qui tourne avec le sprite quand la route tourne.
    *   *Parade :* L'ombre (ellipse SVG) doit toujours rester horizontale (`rotation: 0`), peu importe l'angle du sprite ou de la route.

---

### SECTION OBLIGATOIRE — EXPERT CONSTRUCTEUR

**1. Nos templates choisis (Avis)**
Le combo `d3-geo` + `Remotion` + `PixelLab` est excellent pour ce format "Atlas documentaire". C'est sobre et headless-safe.
*Optimisation :* Pour la carte parchemin, assure-toi que la projection D3 (`geoMercator` ou `geoAzimuthalEqualArea`) est centrée sur un point entre le Maghreb et la Méditerranée. Si tu utilises une projection mondiale par défaut, l'Europe du Nord sera distordue et le tracking caméra sera faussé.

**2. Si je construisais ça de zéro (L'Ordre Pro)**
Je ne commencerais PAS par les sprites.
*   **Étape 1 : Le Théâtre (La carte et la route).** Je code le tracé SVG Niani -> Maghreb -> Venise. Je l'anime avec `stroke-dasharray`. Je valide que la ligne se dessine parfaitement avec le bon easing.
*   **Étape 2 : Le Caméraman (Le Tracking).** Je crée une variable `currentFocusPoint` qui lit les coordonnées du bout de la ligne animée à l'Étape 1. Je lie le `viewBox` du SVG (ou le `transform` du conteneur) à ce point. La caméra suit la ligne qui se dessine.
*   **Étape 3 : Les Acteurs (Sprites).** J'attache la caravane sur la première moitié de la ligne (avec la fonction `getPointAtLength` du SVG pour gérer le retard de phase C1). J'attache le bateau sur la deuxième moitié.
*   **Étape 4 : L'Environnement (Tilt & Ombres).** J'ajoute le `skewX/scaleY` sur le conteneur global et je m'assure du billboarding des sprites.
*   **Étape 5 : La Narration (La Peste).** Je code l'expansion du rouge déclenchée par l'arrivée du bateau.

**3. Enchaînement pour la compréhension (Séquençage)**
Pour un spectateur lambda, la hiérarchie visuelle doit être stricte (1 idée = 1 focus) :
*   **f62 - f325 (Le Départ) :** Focus sur le Mali (Glow fort). La caméra est large sur l'Afrique de l'Ouest.
*   **f325 - f382 (Le Voyage Terrestre) :** Le Glow Mali baisse. La route se dessine. La caméra zoome et tracke la caravane. Le serpentin organique rend le mouvement captivant.
*   **f382 - f425 (Le Relais - *Respiration*) :** La caravane arrive au Maghreb. **Pause d'une demi-seconde.** Le bateau apparaît. La caméra ne bouge presque plus, elle pivote légèrement l'attention vers la mer.
*   **f425 - f497 (Le Voyage Maritime) :** Le bateau traverse. La caméra le suit. L'Europe au nord est encore de couleur neutre (parchemin).
*   **f497 - f616 (Le Climax) :** Le bateau touche Venise. **Arrêt du tracking.** La caméra dézoome largement pour englober Mali + Europe. Le rouge naît à Venise et contamine l'Europe. Le Mali reste doré, protégé par le vide du Sahara. L'antithèse visuelle est parfaite.