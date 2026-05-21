En tant que Directeur Créatif Technique, voici mon évaluation de la Vague 2 pour le projet **Atlas Shaka Zulu**. Mon approche privilégie la cohérence visuelle entre le "cinématique" (Seedance) et le "technique" (d3-geo) tout en exploitant la puissance du stack Remotion pour l'interpolation mathématique.

---

## Q1 — Validation

### Idée 1 — Hook combo cinématique + typo
- **Verdict** : Oui avec amendement.
- **Commentaire** : Le passage du "paper-craft" (Seedance) à la carte d3-geo risque de créer un "choc de texture". Je recommande d'appliquer un filtre SVG de grain de papier sur l'ensemble de la composition Remotion pour unifier le clip vidéo et la carte générée.

### Idée 2 — Cartouches sources iklwa + bouclier
- **Verdict** : Oui.
- **Commentaire** : Indispensable pour valider le positionnement "documentaire sérieux".

### Idée 3 — Carte d3-geo réelle
- **Verdict** : Oui.
- **Commentaire** : C'est le socle de vérité du projet. L'utilisation de la palette Bordeaux/Or sur fond parchemin est validée.

### Idée 4 — Composant signature "Cornes de buffle"
- **Verdict** : Amendement majeur.
- **Commentaire** : Ne pas faire de SVG pur manuel (trop rigide) ni de Gemini (trop aléatoire). Je préconise une **approche hybride** : une forme géométrique simple (2 arcs de cercle SVG) dont l'épaisseur (`stroke-width`) et la courbure sont animées via `spring` pour simuler l'encerclement tactique. C’est un outil de guerre, pas une illustration biologique.

### Idée 5 — PixelLab caravane impi sur carte S3
- **Verdict** : Oui.
- **Commentaire** : Le contraste entre la carte austère d3-geo et les sprites 2D apporte une "vibration" nécessaire au format Short.

### Idée 6 — Déformation S4 organique
- **Verdict** : Oui.
- **Commentaire** : L'utilisation de `feDisplacementMap` est la meilleure façon d'exprimer le deuil psychologique sans sortir du cadre technique de la carte.

### Idée 7 — Traitement Blueprint des inserts
- **Verdict** : Oui.
- **Commentaire** : C'est ce qui sauvera le projet du cliché "ethnographique" pour l'emmener vers le "médicolégal/historique".

---

## Q2 — Implémentation

### Idée 1 (Hook)
- **SVG pur** : Typographie Cormorant en overlay avec `mask-image` pour effet d'apparition.
- **d3-geo** : La carte finale vers laquelle on zoom-out.
- **Gemini/Seedance** : Clip 5s (Shaka de dos).

### Idée 2 (Cartouches)
- **SVG pur** : Rectangles avec bordures doubles, lignes de rappel (leader lines) vers l'objet.
- **React** : Composant `<SourceCartouche />` réutilisable prenant `author` et `title` en props.

### Idée 3 (Carte d3-geo)
- **d3-geo** : Projection `geoAzimuthalEqualArea` centrée sur le KwaZulu-Natal.
- **SVG pur** : Filtre de texture (feTurbulence) pour l'effet parchemin.

### Idée 4 (Cornes de buffle)
- **SVG pur** : Deux `path` (arcs de Bézier) animés avec `stroke-dashoffset`.
- **Recraft** : Génération d'une icône de tête de buffle minimaliste au centre pour ancrer le diagramme.

### Idée 5 (Impi PixelLab)
- **PixelLab** : Sprite sheet de guerrier zoulou (marche/attaque).
- **Remotion** : Utilisation de `interpolate` pour mapper les coordonnées GeoJSON de d3-geo vers les positions X/Y des sprites.

### Idée 6 (Déformation S4)
- **SVG pur** : Définition du filtre `<filter id="mourning-warp">` avec un `feTurbulence` dont la `baseFrequency` est liée à une `spring` de Remotion.

### Idée 7 (Blueprint)
- **SVG pur** : Grille de fond (grid lines) en 1px opacité 0.1.
- **React** : Layout en Flexbox pour les étiquettes de données (Inter/JetBrains Mono).

---

## Q3 — Transitions cinématique → carte

### Transition A : Le "Dépliage de Parchemin"
- **Description** : Le clip Seedance subit une rotation 3D (CSS `rotateX`) pour s'aplatir sur le plan de la carte, pendant que les frontières d3-geo se dessinent autour de lui comme si le clip était une illustration collée sur le document.
- **Outils** : Remotion (3D transform) + d3-geo.
- **Coût dev** : Moyen (gestion des perspectives).

### Transition B : L'Effacement Tactique (Blueprint)
- **Description** : Le clip Seedance devient soudainement bleu monochrome (filtre SVG `feColorMatrix`), se transforme en schéma technique, puis "dézoome" pour révéler qu'il n'est qu'un détail sur une carte plus large.
- **Outils** : Filtres SVG natifs + Remotion `interpolate`.
- **Coût dev** : Faible.

### Transition C : Le "Portail de Particules"
- **Description** : Le clip Seedance se fragmente en petits carrés (sprites PixelLab) qui s'envolent pour aller se positionner sur la carte d3-geo aux endroits des futures batailles.
- **Outils** : PixelLab + Remotion (calcul de trajectoire).
- **Coût dev** : Élevé (performance React).

---

## Q4 — Gap detection

### 8e idée critique : Le "Timeline Tracker" Vertical
Le format 150s est long pour un Short. Il manque un **indicateur de progression vertical** sur le bord gauche (style règle graduée ou lance qui descend).
- **Pourquoi ?** Pour donner un sentiment de progression dans la "vague" de conquêtes de Shaka.
- **Stack** : SVG pur + `interpolate(frame, [0, duration], [0, height])`.

### Piège technique : Performance d3-geo + Filtres
- **Le risque** : Appliquer un `feTurbulence` (Idée 6) sur un SVG contenant des milliers de points GeoJSON (Natural Earth) va faire ramer le rendu Remotion (et potentiellement planter l'export).
- **Solution** : Utiliser `canvas` pour le rendu de la carte d3-geo si le nombre de polygones est trop élevé, ou simplifier le GeoJSON via `topojson` avant l'intégration. Ne pas appliquer le filtre de déformation sur toute la scène, mais uniquement sur un `<g>` (groupe) spécifique.
- **Fonts** : Attention à charger les Google Fonts (Cormorant/Inter) via `@remotion/google-fonts` pour éviter les sauts de texte au rendu.