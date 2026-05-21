# Réponse — Empire du Ghana Pass 2

## Note globale du brief : 8/10

## Q1. Validation idée par idée
1. **OUI** — Balance signature dynamique : Le concept est bien défini avec un Lottie déjà codé. Pas de souci apparent à l'implémentation.
2. **OUI** — Beat 3 silent barter : Les sprites et effets sont réalisables avec le stack disponible, surtout avec les sprites PixelLab bien préparés.
3. **AMENDEMENT** — Ligne de front rouge bordeaux : Optimiser l'animation pour éviter la surcharge SVG en appliquant un simple mouvement interpolé sur la ligne.
4. **OUI** — Beat 4 pivot Sundiata : L'utilisation de LightLeak et de Lottie pour le sceau de l'Empire Mali est pertinente.
5. **OUI** — Pop-up Labels : Synchronisé via Forced Alignment ElevenLabs, techniquement faisable.
6. **OUI** — Palette bordeaux profond : Conformément à la recommandation d3-geo, les contrastes fonctionneront.
7. **AMENDEMENT** — Koumbi Saleh illustration : Assurer que Gemini fournisse une illustration précise et stylisée avant toute mise en œuvre.

## Q2. Implémentation concrète par outil

### 1. Balance signature dynamique
- **Outils** : Lottie
- **Frames clés** : Toute la vidéo
- **Pseudocode** : Intégration à chaque scène, ajuster l'équilibre en fonction du script.
- **Estimation** : Petit

### 2. Beat 3 silent barter
- **Outils** : PixelLab, LightLeak
- **Frames clés** : Dézoom et à "sans un mot"
- **Pseudocode** : Animer sprites avec `getSpriteFramePath`, superposer LightLeak.
- **Estimation** : Moyen

### 3. Ligne de front rouge bordeaux
- **Outils** : SVG, interpolate
- **Frames clés** : Beat 4
- **Structure SVG** : Ligne simple animée avec `interpolate()`
- **Estimation** : Petit

### 4. Beat 4 pivot Sundiata
- **Outils** : Lottie, LightLeak, fade-to-black
- **Frames clés** : Juste avant Beat 5
- **Estimation** : Moyen

### 5. Pop-up Labels
- **Outils** : ElevenLabs
- **Frames clés** : Synchronisés avec chaque mention de statistique
- **Estimation** : Moyen

### 6. Palette bordeaux profond
- **Outils** : d3-geo
- **Frames clés** : Tout au long
- **Estimation** : Petit

### 7. Koumbi Saleh illustration
- **Outils** : Gemini, Lottie (ou SVG static)
- **Frames clés** : Beat 2
- **Estimation** : Moyen

## Q3. Transition Beat 4 → Beat 5
Pour gérer la transition, utiliser un changement subtile de couleur dans le fond en progressant vers un sépia plus clair, symbolisant une réflexion. En parallèle, ajouter un fini sonore doux qui se mêle à un fade-out pour créer une pause avant de relancer la narration sur Wagadou. **Spring()** sera appliquée pour éviter une saccade dans le changement de la couleur.

## Q4a. 8e idée éventuelle
**Rien à ajouter** — Les idées inclues sont suffisamment représentatives et cohérentes avec le projet.

## Q4b. 3 pièges techniques
1. **Synchronisation audio et visuels** : Des timings précis pour les labels et animations — **Solution** : Tests rigoureux avec le frame-précis; revenir aux markers audio si nécessaire.
2. **Performance sur Lottie multiple instances** : La limite simultanée pourrait freiner certaines animations. — **Solution** : Prévoir un système de priorisation ou de rotation d'instances.
3. **Complétion des tâches géométriques dans d3-geo** : Optimisation des chemins SVG et animations sur cartes. — **Solution** : Consulter des références précises et simplifier les tracés avant de charger le module d3-geo.