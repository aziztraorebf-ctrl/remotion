## Q1 — Validation
### Idée 1 — Hook combo cinématique + typo
- Verdict : oui
- Commentaire : Cette idée est approuvée car elle crée un impact visuel immédiat et immersif, aligné sur le format vertical YouTube Shorts, en combinant narration et visuel cinétique pour capter l'attention dès les premières secondes.

### Idée 2 — Cartouches sources iklwa + bouclier
- Verdict : oui
- Commentaire : Cette idée est approuvée comme quick win essentiel pour crédibiliser le documentaire, en complétant les inserts existants et en évitant les accusations de biais historique.

### Idée 3 — Carte d3-geo réelle
- Verdict : oui
- Commentaire : Cette idée est approuvée pour sa précision géographique et sa réutilisabilité, renforçant l'aspect éducatif sans surcharger le stack.

### Idée 4 — Composant signature "Cornes de buffle"
- Verdict : oui avec amendement
- Commentaire : L'idée est globalement forte pour marquer les transitions thématiquement, mais vu les limites de Claude en formes organiques, je recommande exclusivement la version géométrique minimaliste (2 arcs Bézier SVG) plutôt que Gemini → Recraft, car cela reste audacieux, rapide à coder et cohérent avec la palette Shaka (parchemin/bordeaux/or), évitant les coûts et les artefacts de vectorisation qui pourraient alourdir les performances en Remotion.

### Idée 5 — PixelLab caravane impi sur carte S3
- Verdict : oui
- Commentaire : Cette idée est approuvée pour son dynamisme narratif, réutilisant avec succès le test Mansa Moussa et ajoutant une couche humaine sans violer les limites SVG.

### Idée 6 — Déformation S4 organique
- Verdict : oui avec amendement
- Commentaire : L'idée est prometteuse pour symboliser la spirale du deuil, mais les formes organiques complexes posent un risque avec Claude ; amendez en limitant à des filtres SVG purs (feDisplacementMap + feTurbulence) appliqués sur la carte d3-geo, sans génération Gemini pour les ondes concentriques, afin d'éviter les incohérences stylistiques et de privilégier une déformation abstraite géométrique (cercles concentriques animés via spring/interpolate) qui reste réaliste et performante.

### Idée 7 — Traitement Blueprint des inserts existants
- Verdict : oui
- Commentaire : Cette idée est approuvée pour son uniformité visuelle et son évitement des stéréotypes, en modernisant les inserts sans refonte totale.

## Q2 — Implementation
### Idée 1
- SVG pur : La gravure typographique "Il est né paria" en Cormorant Garamond, animée avec spring/interpolate pour un effet d'apparition progressive et zoom-out.
- d3-geo : Non utilisé directement ici, mais la transition finale zoome vers la carte KwaZulu-Natal préparée en d3-geo pour S1.
- PixelLab : Non utilisé.
- Gemini/Seedance : Image source Gemini (Shaka de dos en style paper-craft) convertie en clip vidéo 5s Seedance pour le visuel cinématique initial.
- Recraft : Non utilisé.

### Idée 2
- SVG pur : Cadres blueprint des cartouches (lignes techniques fines) et typo sans-serif (Inter/JetBrains Mono) pour les données, avec Cormorant Garamond pour la source "J. LABAND · The Rise and Fall of the Zulu Kingdom".
- d3-geo : Non utilisé.
- PixelLab : Non utilisé.
- Gemini/Seedance : Non utilisé.
- Recraft : Non utilisé.

### Idée 3
- SVG pur : Palette de couleurs (parchemin/bordeaux/or) appliquée via filtres CSS/SVG sur les projections, et animations de zoom/fade avec spring/interpolate pour les segments S1, S3, S4.
- d3-geo : Cartes précises du KwaZulu-Natal et expansions territoriales via Natural Earth GeoJSON, réutilisant le moteur Mansa Moussa V2 pour path projections et fills dynamiques.
- PixelLab : Non utilisé ici (réservé à l'idée 5).
- Gemini/Seedance : Non utilisé.
- Recraft : Non utilisé.

### Idée 4
- SVG pur : Composant entier en géométrique minimaliste (2 arcs Bézier pour les cornes, animés via spring/interpolate pour rotation/scaling aux transitions), intégré comme overlay sur les segments.
- d3-geo : Non utilisé.
- PixelLab : Non utilisé.
- Gemini/Seedance : Non utilisé (amendement évite cela).
- Recraft : Non utilisé.

### Idée 5
- SVG pur : Intégration des sprites comme masques/positions sur la carte, avec animations de déplacement via spring/interpolate.
- d3-geo : Sprites positionnés et animés le long des paths d'expansion sur la carte KwaZulu-Natal (Natural Earth GeoJSON), en palette Shaka.
- PixelLab : 3-4 sprites guerriers zoulous (walk cycles) pour simuler la caravane impi parcourant le territoire.
- Gemini/Seedance : Non utilisé.
- Recraft : Non utilisé (sprites PixelLab sont natifs).

### Idée 6
- SVG pur : Ondes concentriques (cercles géométriques) depuis le palais via spring/interpolate, et filtres feDisplacementMap + feTurbulence pour déformation abstraite de la carte.
- d3-geo : Carte KwaZulu-Natal comme base déformable (Natural Earth GeoJSON), avec turbulences appliquées aux paths pour simuler la spirale du deuil.
- PixelLab : Non utilisé.
- Gemini/Seedance : Non utilisé (amendement évite cela).
- Recraft : Non utilisé.

### Idée 7
- SVG pur : Cadres blueprint (lignes vectorielles) et layouts typo (Inter/JetBrains Mono pour données, Cormorant Garamond pour sources), appliqués aux 5 inserts existants via composants React réutilisables.
- d3-geo : Non utilisé.
- PixelLab : Non utilisé.
- Gemini/Seedance : Non utilisé.
- Recraft : Non utilisé.

## Q3 — Transitions cinématique → carte
### Transition A
- Description : Le clip Seedance papercraft de Shaka de dos zoome out progressivement tandis que des textures parchemin SVG (simulant le paper-craft) se superposent et se dissolvent en une projection 2D d3-geo ; la typo "Il est né paria" reste fixe et s'intègre comme label sur la carte finale, créant une continuité thématique sans choc visuel. L'animation dure 1-2s pour fluidité verticale. Cela évite la rupture en rendant le passage comme un "dépliage" d'une carte ancienne.
- Outils : Remotion pour composition/timing, SVG pur (textures et typo avec spring/interpolate), d3-geo pour la carte cible, Seedance pour le clip source.
- Cout : 2-3h (Claude code vite les overlays SVG ; test rapide en Remotion).

### Transition B
- Description : Appliquer un filtre SVG feGaussianBlur progressif sur le clip Seedance pour le fondre en silhouette abstraite, pendant que la carte d3-geo émerge en overlay avec une opacité croissante (0 à 100%) ; les contours paper-craft du clip se morphent en paths géographiques via interpolation linéaire. La transition culmine avec un reveal net de la carte en 1.5s, maintenant l'immersion en transformant le cinématique en cartographique.
- Outils : SVG pur (filtres feGaussianBlur et interpolation), Remotion pour layering/opacité, d3-geo pour paths émergents, Seedance pour clip initial.
- Cout : 3h (filtres SVG simples pour Claude ; debug morphing en TypeScript).

### Transition C
- Description : Utiliser un effet de "déchirure" avec masques SVG (lignes irrégulières animées via spring/interpolate) qui "découpe" le clip Seedance pour révéler la carte d3-geo en dessous, en appliquant une palette unifiée (bordeaux/or) pour lier les styles ; la caméra virtuelle Remotion simule un tilt-shift pour passer du 3D paper-craft au 2D plat. Durée 2s, idéal pour le format vertical en accentuant la profondeur.
- Outils : Remotion pour caméra/timing, SVG pur (masques et animations), d3-geo pour carte révélée, Seedance pour clip masqué.
- Cout : 4h (masques complexes mais réalistes pour Claude ; optimisation perf en React).

## Q4 — Gap detection
- 8e idée : Une animation typographique dynamique pour les 4 actes de S2 (iklwa, bouclier, cornes, Gqokli Hill), utilisant SVG pur avec spring/interpolate pour des reveals séquentiels synchronisés à la narration ElevenLabs, afin de structurer visuellement les actes sans alourdir la carte et de booster l'engagement mid-video (inspiré des top idées pass 1, mais manquant ici pour fluidité narrative).
- Piège technique : Performance Remotion dégradée par la combinaison simultanée de d3-geo (projections lourdes), PixelLab sprites (rendu raster en overlay) et filtres SVG multiples (feTurbulence + displacement) en 9:16 vertical à 150s ; anticiper via offscreen rendering en React et tests export MP4 (risque de frame drops >10% sur mobile), plus compatibilité fonts (Cormorant Garamond peut nécessiter web-safe fallbacks pour éviter crashes en export).