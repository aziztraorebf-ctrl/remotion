Voici un retour de Direction Artistique implacable. Le script est bon, l'intention géopolitique est là, mais l'exécution visuelle actuelle est au stade du prototype. On va passer d'une "carte avec du texte" à un **véritable documentaire spatialisé**.

Voici le plan de bataille pour hisser cette scène au standard de notre Hook (Scène 0) et des références premium (Johnny Harris / RLL).

---

### 🚨 SECTION OBLIGATOIRE : LE TEST "AI-SLOP" & AMATEURISME
Ce qui crie "généré par IA / amateur" dans ces 4 frames, et comment le tuer avec notre stack :

1. **Le syndrome "Océan Vide & Texte Flottant" (Frame 1 & 4) :** Placer deux mots au milieu d'un océan bleu uni ou d'un fond noir, c'est le degré zéro du compositing. Ça hurle "j'ai mis un calque texte dans Premiere". L'espace négatif n'est pas géré, il est subi.
   * *La cure (Notre Stack) :* On supprime la carte sur l'intro. On passe en plein écran (Remotion) sur la texture parchemin de la scène 0. On utilise des formes SVG pleines, des typographies géantes qui structurent l'espace (`KineticMaskSlam` ou typographie cinétique maison).
2. **Les arcs de cercle "mathématiques" par défaut (Frame 3 - GTA) :** Ces deux lignes pointillées jaunes sont faméliques. Elles n'ont aucune épaisseur, aucun glow, aucune vie. C'est le tracé procédural basique d'une librairie sans styling.
   * *La cure (Notre Stack) :* Utiliser **`GeoFlowConnection V2`**. On dessine un `<path>` SVG avec un `stroke-dasharray` épais, un `stroke-dashoffset` animé par une `spring`, un léger drop-shadow doré, et un sprite (avion/navire) orienté sur la tangente. La ligne doit "irradier" l'énergie de l'export.
3. **Le drift des éléments (Le Bug) :** Un élément UI qui "glisse" par rapport à la carte quand la caméra bouge détruit instantanément l'illusion de profondeur. C'est l'erreur n°1 des cartes web mal codées.
   * *La cure (Notre Stack) :* Arrêter le positionnement CSS absolu statique. **Chaque élément (plaque, icône Lucide) doit passer par `map.project([lon, lat])` à CHAQUE FRAME** de l'animation pour recalculer ses coordonnées X/Y en temps réel pendant le flyTo.
4. **Le gris "carte routière" non assumé :** Le Sénégal n'est qu'un contour. Le fond est un gris Mapbox par défaut. Il n'y a pas de hiérarchie visuelle.
   * *La cure (Notre Stack) :* Remplir le pays. Rendre l'océan "Navy" profond et la terre "Gold" ou utiliser **`WavingFlagFill`** pour rendre le pays vivant.

---

### (A, C, D) CHRONOLOGIE & GESTES VISUELS (Le plan frame par frame)

L'erreur du premier jet est d'avoir fait 3 fois "point + plaque". Voici comment différencier chaque moment narratif.

#### 1. 0s - 32s : L'Intro Abstraite (Le Duel)
* **Intention :** Évacuer les clichés. Ce sont des concepts idéologiques, pas des lieux.
* **Geste Visuel (Remotion Pur) :** Continuité stricte avec le Hook (Scène 0). Fond parchemin. Typographie cinétique géante.
  * Le mot "MALÉDICTION" (noir, lourd) frappe l'écran à gauche.
  * Le mot "MIRACLE" (doré, brillant) frappe à droite.
  * *Transition (32s) :* La caméra fait un zoom extrême *entre* les deux mots (dans l'espace négatif). Le parchemin se déchire/fondu enchaîné vers la mer Mapbox. On atterrit sur le large de Dakar. **Aucun cut sec.**

#### 2. 32s : SANGOMAR (Le Pétrole National)
* **Intention :** Le premier vrai lieu. Le concret. L'ancrage national.
* **Geste Visuel :**
  * Dès que la carte apparaît, on lance **`SweepRevealTerritory`** sur le Sénégal : un faisceau scanne le pays qui se remplit avec **`WavingFlagFill`** (le drapeau ondule subtilement, donnant un poids massif au pays face au gris environnant).
  * Sur l'océan, on utilise **`MapboxIsolateZone`** pour hachurer la zone maritime.
  * On ancre une **`GeoCountryPlaque`** (Mode Pos) au point exact.
  * *Touche Pro :* Au lieu d'un simple rond jaune, on anime une icône **Lucide `Droplet`** (pétrole) avec un effet de `spring` (rebond) à son apparition.

#### 3. 45s : GTA (Le Gaz Partagé & L'Export)
* **Intention :** La frontière, le partage, et la projection vers l'international (remplacer la Russie).
* **Geste Visuel :**
  * La caméra translate vers le Nord.
  * On trace la frontière maritime SN/MR avec **`FiberOpticBorderDraw`** (laser doré qui dessine la ligne de séparation).
  * La plaque GTA apparaît (icône **Lucide `Flame`** pour le gaz).
  * *L'Export :* Déclenchement de **`GeoFlowConnection V2`**. Des flux dorés épais et animés partent de GTA et sortent du cadre vers le Nord (Europe) et l'Est (Asie). On montre le *mouvement*, l'énergie qui quitte le continent.

#### 4. 65s : YAKAAR-TERANGA (Le Mystère)
* **Intention :** L'attente, la tension géopolitique, l'open-loop. Ce n'est pas un gisement actif, c'est une cible stratégique.
* **Geste Visuel :**
  * Caméra focus sur la zone de Yakaar.
  * Au lieu d'un point statique, on utilise **`LottieGeoAura`** (un asset type "radar" ou onde de choc lente qui pulse).
  * *Le regard des capitales :* Pour illustrer "plusieurs capitales le regardent", on fait popper des icônes **Lucide `Eye`** aux bords de l'écran (direction Paris, Londres, Pékin) avec de très fines lignes de ciblage (`stroke-dasharray` statique avec faible opacité) qui convergent vers le gisement. Ça spatialise la convoitise.

#### 5. 85s : LE 60% (Le Partage)
* **Intention :** Montrer une répartition, pas juste une data isolée. C'est un rapport de force.
* **Geste Visuel (Le Pont vers l'abstrait) :**
  * On utilise **`MapCutaway` (Mode Stat)** pour assombrir la carte et ramener le focus au centre.
  * *L'idée Premium (SVG Code) :* On ne met pas "60%" en texte brut. On dessine une jauge horizontale ou un empilement de 10 blocs géométriques SVG (représentant 100% de la richesse).
  * Animation frame-driven : Les blocs tombent. 6 blocs (60%) glissent vers la gauche (sous un label "SÉNÉGAL" et le drapeau), 4 blocs (40%) glissent vers la droite (label "MULTINATIONALES").
  * C'est cinétique, ça montre littéralement la part du gâteau qui reste, et ça prépare le terrain pour la phrase "ce chiffre ne dit rien".

---

### (B) COMBATTRE LE GRIS (Hiérarchie du regard)

Le problème de la frame actuelle, c'est que l'œil du spectateur ne sait pas ce qui est important. Le Sénégal a la même valeur chromatique que le Mali ou la Mauritanie.

1. **Le Contraste Actif/Inactif :** Le Sénégal doit être traité avec **`WavingFlagFill`** ou une bichromie Navy/Gold intense. Les pays frontaliers doivent rester en gris sombre (opacity 0.3) pour créer un effet de "Spotlight".
2. **L'Océan :** Il prend 70% de l'écran sur ces plans. Il ne peut pas être bleu plat. Il faut un léger gradient radial (vignettage) codé en overlay CSS par-dessus la map pour assombrir les bords de l'écran et forcer l'œil vers le centre (les gisements).

---

### RÉPONSES AUX ANGLES OBLIGATOIRES

1. **SPECTATEUR LAMBDA :** Dans le V1, il décroche aux 30 premières secondes (rien à voir). Dans le V3, il est happé par l'intro graphique, comprend que Sangomar = local (drapeau), GTA = international (lignes de flux), Yakaar = convoitise (radar/yeux). L'image raconte l'histoire sans qu'il ait besoin d'écouter la voix.
2. **NARRATION / SYNCHRO :** Le V1 était redondant (le texte à l'écran écrit ce que la voix dit). Dans le V3, l'écran montre *la mécanique*. Quand la voix dit "remplacer le gaz russe", l'écran montre des flux géants vers l'Europe. Un beat visuel par idée.
3. **TRANSITIONS vs ÉTATS :** Le V1 est un PowerPoint (Diapo 1: Sangomar. Diapo 2: GTA). Le V3 est un monde continu. La caméra "flyTo" d'un point à l'autre sans jamais couper, avec les flux qui se dessinent pendant le mouvement de caméra. La transition Map -> 60% se fait via l'overlay `MapCutaway` en douceur.
4. **AI-SLOP :** (Déjà traité en section 1. Le remède est l'utilisation rigoureuse de SVG dessinés à la main, d'icônes Lucide animées via des springs, et du recalcul `map.project()` à chaque frame).
5. **EXPERT DU MÉTIER :** Un pro de chez Vox ne laisserait jamais une carte à moitié vide. Il utiliserait des icônes vectorielles nettes (Lucide), des typographies à fort contraste (Clash Display), des ombres portées douces sur les éléments UI (`drop-shadow-xl`), et justifierait chaque mouvement de caméra. La différence entre le V1 et RLL, c'est l'**épaisseur spatiale** des données.

**En résumé pour le développeur Remotion :**
Jette les scènes 0-32s de la timeline Mapbox. Fais une composition pure Remotion. Répare le hook `useMapProjection` pour ancrer les divs. Remplace les points Mapbox natifs par des marqueurs HTML contenant des icônes Lucide animées. Implémente `GeoFlowConnection V2` pour les exports. C'est ça qui fera passer la vidéo dans la catégorie premium.