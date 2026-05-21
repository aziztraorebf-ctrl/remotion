# Réponse CTD — Empire du Ghana Pass 2

## Note globale du brief : 8.5/10
Le stack est cohérent et le verrouillage des assets (PixelLab/Lottie) sécurise la production. Le défi réside dans la fluidité des transitions d'échelle (d3-geo) et la synchronisation des sprites.

---

## Q1. Validation idée par idée

1. **OUI — Balance signature dynamique** : Élément narratif fort. Doit être instanciée en `AbsoluteFill` persistant pour éviter les sauts de rendu.
2. **AMENDEMENT — Beat 3 silent barter** : L'opacité 40% risque de rendre les sprites PixelLab illisibles sur un fond de carte texturé. **Amendement** : Utiliser un `filter: drop-shadow()` doré sur les sprites pour les détacher du sol + `mix-blend-mode: screen` pour l'effet fantomatique.
3. **OUI — Ligne de front bordeaux** : Classique d3-geo. Utiliser `stroke-dashoffset` pour l'animation de progression.
4. **OUI — Pivot Sundiata** : Le combo LightLeak + Sceau est la solution la plus "cheap & chic" pour éviter de reconstruire une topologie de carte.
5. **OUI — Pop-up Labels** : Crucial pour le dynamisme "Shorts". Attention à la collision visuelle si trop de stats apparaissent en même temps.
6. **OUI — Palette bordeaux** : Validation du contraste avec l'OR (#D4A574). Très lisible sur fond sombre.
7. **AMENDEMENT — Koumbi Saleh** : Ne pas utiliser Gemini seul (trop statique). **Amendement** : Image Gemini en fond (`opacity: 0.6`) + un Lottie `pulse-marker` sur le point d3-geo exact pour ancrer la data dans l'espace.

---

## Q2. Implémentation concrète par outil

| Idée | Recette Technique | Effort |
| :--- | :--- | :--- |
| **Balance (1)** | `Lottie` avec `progress` lié à une fonction `interpolate(frame, [start, end], [0, 1])`. Utiliser `spring` pour les oscillations lors des mots "Sel" / "Or". | Moyen |
| **Barter (2)** | `getSpriteFramePath` dans une boucle `map`. Positionnement via `projection([lon, lat])` de d3-geo. `transform: scale` géré par un `spring` global sur le container. | Gros |
| **Front (3)** | `d3.line()` + `geoPath`. Animation via `strokeDasharray` calculé sur la `node.getTotalLength()`. Couleur `#4A0E0E`. | Petit |
| **Labels (5)** | Composant React `StatPop`. Entrée en `spring` (scale 0 -> 1.2 -> 1). Sync via le JSON d'ElevenLabs (timestamp mot par mot). | Moyen |
| **Sundiata (4)** | `AbsoluteFill` avec `background: #000` + `opacity` (0.4). Overlay du Lottie `iklwa` (lance) ou sceau Mali en `#D4A574`. | Petit |

---

## Q3. Transition Beat 4 → Beat 5

**Le "Deuil de l'Empire" :**
Pour casser la friction entre la chute (Mali) et la conclusion (Wagadou), je préconise une **désaturation totale de la carte en 30 frames** (passage vers `GRIS_CENDRE`). 
- **Visuel :** La caméra effectue un "Slow Zoom Out" continu (dézoom infini). 
- **Symbole :** La balance (Idée 1) revient au centre, parfaitement horizontale, mais devient **blanche (BLANC_SEL)** ou **grise**, perdant son éclat doré. C'est le passage de l'histoire vivante à l'archive.
- **Audio-Sync :** Un silence de 0.5s dans la musique avant le "Wagadou" final pour marquer le respect.

---

## Q4a. 8e idée éventuelle (Vague 1)

**"Le Compteur de Richesse" (UI Overlay) :**
Pendant le Beat 2 (Koumbi Saleh), afficher en haut à droite deux petits compteurs (`InsertNombre`) avec icônes SVG : un sac de sel et un lingot d'or. Ils s'incrémentent frénétiquement quand la narratrice dit "taxait chaque caravane". Cela renforce l'aspect "Empire-Gestion" qui plaît sur YouTube.

---

## Q4b. 3 pièges techniques

1. **Le Drift des Sprites :** Les sprites PixelLab ont un framerate fixe. Si la `composition` Remotion est en 60fps et le sprite en 12fps, l'animation sera saccadée.
    *   *Solution :* Utiliser `Math.floor(frame / (60 / 12)) % totalFrames` dans le helper `getSpriteFramePath`.
2. **Surcharge SVG d3-geo :** Animer 5000 points de frontière en SVG natif peut faire ramer la preview Remotion et échouer au rendu.
    *   *Solution :* Utiliser `memo` sur le composant `StaticMap` et n'animer que les `groups` (`<g>`) de transformation (zoom/pan) plutôt que de recalculer les paths.
3. **Z-Index des LightLeaks :** Un LightLeak mal placé peut masquer les sous-titres Karaoke (essentiels sur Shorts).
    *   *Solution :* Wrapper le LightLeak dans une div avec `pointer-events: none` et s'assurer que le composant `Subtitles` est au sommet de l'arbre React (dernier enfant de la `Composition`).