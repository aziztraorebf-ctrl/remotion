**DIAGNOSTIC RAPIDE** : Votre Vidéo 2 souffre d'un syndrome d'"hésitation narrative". Vous avez peur d'encombrer, donc vous ne posez que le squelette (contours + point). La Vidéo 1 réussit parce qu'elle superpose **3 couches simultanées** : occupation territoriale (teintes) + présence physique (bases/sprites) + acteurs humains (jetons). C'est cette densité stratifiée qu'il faut retrouver.

---

## VOLET A — TECHNIQUES DE REMPLISSAGE CONCRÈTES

### 1. COUCHE ACTEURS (Densité humaine)

**A1. "Crowd Tokens" (Déjà faisable)**
- **Quand** : Dès qu'on parle de factions, groupes armés, coalitions.
- **Comment** : Ne pas se contenter du leader (jeton D=58px). Ajouter 2-3 "soldats anonymes" (jetons D=32px, bordure grise) en cluster autour du leader, légèrement transparents (opacity 0.7). 
- **Effet** : Visualise immédiatement la masse/complexité d'un groupe sans lire le texte.
- **Action** : `waypoints` sur les soldats secondaires avec délai de 3-6 frames pour effet "onde".

**A2. "Shadow Trail" persistants (Déjà faisable)**
- **Quand** : Déplacements stratégiques (retraite, offensive).
- **Comment** : Le jeton actuel a un sillage cinétique (déjà codé). **Conserver** une version figée/fantôme du sillage à l'ancienne position pendant 2-3 secondes avant fade-out. 
- **Effet** : Mémoire du mouvement, trajectoire lisible.

**A3. "Status Rings" (À coder, faisable)**
- **Quand** : Bataille en cours, siège, statut incertain.
- **Comment** : Anneau SVG autour du jeton (stroke-dasharray animé) qui pulse. Couleur = intensité (rouge = combat, orange = tension).
- **Stack** : SVG overlay positionné en coordonnées géo, frame-driven rotation.

**A4. "Dual Presence" (Déjà faisable)**
- **Quand** : Un acteur contrôle deux zones (ex: GAO + DOUENTZA dans Vidéo 1).
- **Comment** : Ne pas bouger le jeton. **Dupliquer** le visage avec une ligne de connexion GeoFlowConnection subtile (trait gris clair, 1px). Le second jeton est un "clone" réduit (D=40px).

### 2. COUCHE TERRITOIRE (Occupation spatiale)

**B1. "Halo Progressif" (Déjà faisable, sous-exploité)**
- **Quand** : Expansion territoriale (Vidéo 2 : avancée des forces libyennes vers El-Fasher).
- **Comment** : Au lieu d'un aplat brutal, utiliser un **radial gradient** qui "respire" (scale 0.9 → 1.1 sur 60 frames) autour du point de contrôle. Ajouter une **texture SVG** (hachures obliques fines) dans le halo pour matérialiser le contrôle effectif vs revendiqué.
- **Action** : `jumpTo` sur le centre du halo, scale animé.

**B2. "Corridors" (GeoFlowConnection enrichi)**
- **Quand** : Routes d'approvisionnement, corridors humanitaires.
- **Comment** : Utiliser GeoFlowConnection mais avec **sprite de convoi** (wagon-cargo ou camion) qui voyage dessus. Ajouter des **points de contrôle intermédiaires** (petits carrés) le long du trait pour montrer les checkpoints.
- **Effet** : La carte devient un réseau logistique, pas juste des frontières.

**B3. "Zone Tampon Animée" (Déjà faisable)**
- **Quand** : Zone d'influence disputée (ex: désert entre Libye et Soudan).
- **Comment** : Zone SVG avec fill pattern "vagues" ou "ondulation" (stroke-dashoffset animé sur des lignes parallèles). 
- **Stack** : Masque de détourage sur la zone concernée.

**B4. "Bases Décomposées" (Déjà faisable)**
- **Quand** : Présence militaire (Vidéo 1 le fait bien, Vidéo 2 l'ignore totalement).
- **Comment** : Sprite isométrique base + **petits éléments satellites** (tente, antenne, véhicule) posés à 10-20px aléatoire autour. Ça évite le symbole isolé.

### 3. COUCHE ÉVÉNEMENTS (Micro-narrations)

**C1. "Impact Markers" (À coder, faisable)**
- **Quand** : Frappes aériennes, explosions (comme les fumées de Vidéo 1 mais généralisé).
- **Comment** : Cercle concentrique qui s'étend (scale 0→3, opacity 1→0 sur 30 frames) + croix SVG temporaire au centre. 
- **Variante** : Pour les drones, ajouter une **icône Lucide "target"** qui verrouille la cible avant l'impact.

**C2. "Civil Presence" (Déjà faisable)**
- **Quand** : Crises humanitaires (Vidéo 2 : conflit Soudan).
- **Comment** : Jetons "civils" (bordure neutre beige) en groupe de 3-5, avec un **mini-graphique** (barre de santé ou icône faim) au-dessus. Ça humanise la carte.

**C3. "Document Traces" (À coder, faisable)**
- **Quand** : Citations de rapports (ONU, etc.).
- **Comment** : Plaque parchemin qui apparaît, puis se **miniaturise** en coin d'écran (scale 0.3) pour rester comme "preuve" visuelle pendant 5 secondes.

### 4. COUCHE UI DYNAMIQUE (Cadre narratif)

**D1. "Timeline Enrichie" (Déjà faisable)**
- **Quand** : Toute la vidéo.
- **Comment** : Sous la date principale, ajouter une **micro-frise** avec des ticks colorés indiquant les événements passés encore visibles à l'écran. 
- **Effet** : L'utilisateur comprend que les éléments présents sont la somme de l'histoire.

**D2. "Lens Map" (Split focus)**
- **Quand** : Deux théâtres d'opérations (ex: Libye ET Soudan dans Vidéo 2).
- **Comment** : Au lieu de zoomer out brutalement, utiliser un **encart** (picture-in-picture) dans un coin montrant la seconde zone, relié par une ligne GeoFlowConnection au contexte principal.
- **Stack** : Deux instances Mapbox ou une instance + SVG overlay masqué.

---

## VOLET B — QUAND GARDER VS QUAND EFFACER

### RÈGLE 1 : La Persistance Thématique (GARDER)
**Ce qui s'accumule** : Tout élément définissant la **structure du conflit**.
- **Exemple Vidéo 1** : Les bases militaires françaises (sprites) restent visibles une fois posées. Elles créent la "toile de fond" de l'intervention.
- **Application Vidéo 2** : Si on parle d'une intervention émirienne, le point "Abou Dabi" doit rester visible (en réduit, opacity 0.5) même quand on zoome sur El-Fasher. La ligne de flux doit rester en trait fantôme.

### RÈGLE 2 : La Temporalité Forte (EFFACER)
**Ce qui disparaît** : Les **événements ponctuels** et les **états transitoires**.
- **Exemple Vidéo 1** : Les fumées d'explosion (impacts) disparaissent après 2-3 secondes. Les jetons "offensifs" (militaires en mouvement) peuvent s'estomper une fois la position atteinte, laissant place à un sprite de base statique.
- **Critère** : Si l'info est un **verbe** (exploser, avancer, signer), elle s'efface. Si c'est un **nom** (base, leader, ville), elle persiste.

### RÈGLE 3 : La Saturation de Cluster (GARDER mais transformer)
**Quand** : Trop de jetons dans une zone (ex: nord Mali 2017).
- **Technique** : Les jetons ne disparaissent pas. Ils **fusionnent** en un "cluster token" avec un chiffre (badge "3" ou "5"), qui se déploie en éventail au survol (ou au jumpTo suivant).
- **Stack** : Détection de collision simple (distance euclidienne < threshold) → remplacement par token agrégé.

### RÈGLE 4 : Le Principe de "Saliences Résiduelles" (GARDER en arrière-plan)
**Technique concrète** : Tout élément ayant servi à un moment devient une **ombre** (opacity 0.2, grayscale) mais reste géo-localisé.
- **Exemple** : Dans Vidéo 2, après avoir montré Benghazi, garder un contour gris très fin de la Libye visible quand on parle du Soudan. Ça maintient la conscience géographique.

---

## VOLET C — TECHNIQUES SOUS-EXPLOITÉES / NOUVELLES PISTES

### C1. D3-Geo + Mapbox : L'Overlay Dataviz (À coder, haut potentiel)
- **Concept** : Superposer à votre Mapbox des éléments D3-geo (projections identiques) pour des **diagrammes de flux** (chord diagrams simplifiés) ou des **graphes de réseau** (forces layout) positionnés géographiquement.
- **Use case** : Montrer les flux d'armes entre 3-4 points fixes. Les lignes Mapbox sont droites ; D3 permet des courbes de Bézier avec flèches animées (marching ants complexes).
- **Stack** : Synchroniser la projection Mapbox (jumpTo) avec la projection D3 à chaque frame.

### C2. "Paper Cut" Layers (Déjà faisable, très visuel)
- **Concept** : Exploiter le style "parchemin" physiquement. Quand un nouveau pays entre en scène (ex: Burkina Faso dans Vidéo 1), il ne fait pas juste un fade-in. Il se **découpe** dans le parchemin existant (mask reveal) avec une ombre portée SVG (drop-shadow) pour créer de la profondeur 2.5D.
- **Action** : `clipPath` animé sur le polygone du pays.

### C3. Sonification Visuelle (À coder, faisable)
- **Concept** : Des **ondes de choc** circulaires qui partent d'un événement et traversent les frontières (comme un sonar).
- **Stack** : Cercle SVG scale 0→5, opacity 1→0, stroke-width épais qui diminue. Plusieurs cercles décalés de 10 frames pour effet "ripples".

### C4. "Miniatures Isométriques" (Déjà faisable, sous-utilisé)
- **Concept** : Pour les convois ou événements complexes, créer une **scène isométrique décomposée** (comme dans les jeux RTS) dans un coin, reliée par un trait à la carte.
- **Exemple** : Un convoi de drones. Sur la carte : une ligne GeoFlowConnection. En encart isométrique : les sprites des drones avec leurs ombres portées qui avancent réellement sur une route.

### C5. Glyph Sequences (À coder, faisable)
- **Concept** : Au lieu de plaques texte, utiliser des **séquences d'icônes Lucide** qui racontent l'action.
- **Exemple** : [Icône Avion] → [Icône Flèche] → [Icône Cible] pour une frappe aérienne. Animé comme une bande dessinée (wipe-in horizontal).

### C6. "Weather Layer" Narratif (Déjà faisable)
- **Concept** : Des **vents** (lignes courbes animées) ou **sable** (particles simples, pas de blur) pour indiquer la saison (Harmattan) ou la direction d'une offensive (contre le vent = difficile).
- **Stack** : Lignes SVG avec stroke-dashoffset animé, opacité très faible (0.1) pour ne pas gêner la lecture.

### C7. Mémoire des Frontières (À coder, faisable)
- **Concept** : Quand une frontière change (coup d'État, indépendance), l'ancienne ligne ne disparaît pas instantanément. Elle devient **pointillée grise** et **s'efface progressivement** (stroke-dashoffset réduit sur 2 secondes) pendant que la nouvelle se dessine en trait plein.
- **Effet** : Très élégant pour les changements de contrôle.

---

## SYNTHÈSE ACTIONNABLE POUR VIDÉO 2 (Soudan)

**Problème** : On voit juste un point qui se déplace de la Libye vers El-Fasher.

**Correction immédiate** :
1. **Ajouter le halo de contrôle** (B1) sur la zone frontalière Libye-Soudan dès que le convoi est mentionné.
2. **Poser un sprite "base logistique"** isométrique à la frontière sud-libyenne (même si le texte ne le dit pas explicitement, ça matérialise le "depot").
3. **Garder le point Abou Dabi** en miniature (Règle 4) avec un trait de flux permanent vers la Libye.
4. **Ajouter un "Impact Marker"** (C1) à l'arrivée sur El-Fasher si c'est une frappe ou une bataille.
5. **Timeline enrichie** (D1) montrant que l'on est en 2023, mais avec un rappel visuel discret de l'origine (Abou Dabi).

**Votre stack est riche. Osez l'accumulation stratifiée.**