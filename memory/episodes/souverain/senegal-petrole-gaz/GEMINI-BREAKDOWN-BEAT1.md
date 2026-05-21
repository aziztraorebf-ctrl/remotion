Excellent. En tant que directeur technique, je vois un plan clair se dessiner. Le rythme est dicté par la voix-off, et notre mission est de construire un support visuel qui non seulement illustre, mais amplifie le propos.

Voici la construction exacte, de A à Z, pour l'Acte I (f0 à f1299), en utilisant notre stack. Nous allons mapper les panels 1 à 6 du storyboard sur ce premier beat. Les panels 7, 8 et 9 appartiendront logiquement aux actes suivants.

---

### **Vue d'Ensemble de l'Acte I : L'Anomalie (f0 - f1299)**

*   **f0 - f360 (12s) :** Introduction géographique. On établit le lieu, l'enjeu. Panels 1 & 2.
*   **f360 - f871 (17s) :** La promesse chiffrée et sa fragilité. Panels 3 & 4.
*   **f871 - f1299 (14.3s) :** La question centrale et l'amorce de la complexité. Panels 5 & 6.

---

### **Panel 1 : Carte d'introduction - Sangomar**

1.  **Mapping Frames :** `f0` -> `f180` (6.0s)
2.  **Background & Style :**
    *   Le fond est géré par le composant `MapboxGlobe`.
    *   Une surcouche de grain est appliquée sur toute la composition via `<SVGGrain />`.
3.  **Composants Remotion :**
    *   `<MapboxGlobe />` : Le composant principal qui gère l'instance Mapbox.
    *   `<Sequence from={30}>` : Pour animer l'apparition du marqueur.
    *   Nouveau composant à créer : `<MapMarker />`.
4.  **Assets à Générer :**
    *   **Mapbox Style :** Un style custom nommé `documentary-dark`.
        *   Eau : `bg-navy` (#0b1f35)
        *   Terre : `text-ivory` (#f5f0e8) avec une texture de papier subtile (raster layer).
        *   Frontières : `text-gold` (#d4a93c) à 50% d'opacité.
        *   Labels (villes) : `text-ivory` (#f5f0e8).
    *   **GeoJSON :** Shape du Sénégal depuis Natural Earth 50m, à charger comme une source dans Mapbox pour styliser les frontières précisément.
    *   **SVG Icon :** Une icône de "map pin" dorée.
5.  **Timing Frame par Frame :**
    *   `f0` : La carte est visible, centrée sur l'Afrique de l'Ouest.
    *   `f0 - f180` : Animation `flyTo` de Mapbox. La caméra zoome et se déplace doucement vers la côte sénégalaise.
    *   `f30` : Début de la `Sequence` du marqueur Sangomar.
    *   `f30 - f90` : Le `<MapMarker />` pour Sangomar apparaît. L'icône scale de 0 à 1 et son opacité passe de 0 à 1. Le label "SANGOMAR" fade in. Animation gérée par un `spring()`.
6.  **Paramètres Mapbox :**
    *   **Initial (f0) :** `center: [-10, 15]`, `zoom: 3`, `pitch: 0`, `bearing: 0`.
    *   **Final (f180) :** `center: [-17.1, 14.3]`, `zoom: 6.5`, `pitch: 45`, `bearing: -15`. La transition est gérée par `map.flyTo()` avec une `duration` de 6000ms.
7.  **Nouveau Composant : `MapMarker.tsx`**
    *   Props : `label: string`, `className?: string`.
    *   Fonctionnement : Un `div` conteneur avec `flex flex-col items-center`. À l'intérieur, une `Img` pour l'icône SVG et un `div` pour le label avec la classe `text-gold font-bold tracking-wider`. L'ensemble est animé avec `interpolate` et `spring`.
8.  **Code Skeleton TSX (`Scene1_MapIntro.tsx`) :**
    ```tsx
    import { Sequence, useVideoConfig } from 'remotion';
    import { MapboxGlobe } from '../shared/MapboxGlobe';
    import { MapMarker } from './MapMarker'; // Nouveau composant
    import { SVGGrain } from '../shared/SVGGrain';

    export const Scene1_MapIntro = () => {
      const { fps } = useVideoConfig();

      return (
        <div className="flex-1 bg-navy">
          <MapboxGlobe
            mapboxStyle="mapbox://styles/your-account/documentary-dark"
            initialState={{ center: [-10, 15], zoom: 3, pitch: 0, bearing: 0 }}
            animation={{
              to: { center: [-17.1, 14.3], zoom: 6.5, pitch: 45, bearing: -15 },
              startFrame: 0,
              endFrame: 180,
            }}
          />
          <Sequence from={30} premountFor={fps}>
            <MapMarker label="SANGOMAR" coordinates={[-16.85, 14.15]} />
          </Sequence>
          <SVGGrain />
        </div>
      );
    };
    ```

---

### **Panel 2 : Ajout du champ GTA**

1.  **Mapping Frames :** `f181` -> `f360` (6.0s) - C'est une continuation de la scène précédente.
2.  **Background & Style :** Identique au Panel 1.
3.  **Composants Remotion :** La même instance de `MapboxGlobe`, une nouvelle `Sequence` pour le marqueur GTA.
4.  **Assets à Générer :** Aucun nouvel asset.
5.  **Timing Frame par Frame :**
    *   `f181 - f360` : La caméra effectue un très léger travelling (`panBy`) pour ajuster le cadre et révéler la zone de GTA.
    *   `f210` : Début de la `Sequence` du marqueur GTA.
    *   `f210 - f270` : Le `<MapMarker />` pour GTA apparaît, avec la même animation `spring` que Sangomar.
6.  **Paramètres Mapbox :**
    *   **Animation (f181-f360) :** `map.panBy([0, -50], { duration: 6000 })`. Cela crée un mouvement subtil vers le sud.
7.  **Nouveau Composant :** Aucun.
8.  **Code Skeleton TSX (`Scene1_MapIntro.tsx` - complété) :**
    ```tsx
    // ... imports
    export const Scene1_MapIntro = () => {
      const { fps } = useVideoConfig();

      return (
        <div className="flex-1 bg-navy">
          <MapboxGlobe
            // ... props de la partie 1
            // On ajoute une seconde animation de pan
            animation={{
              // ... flyTo de la partie 1
            }}
            secondaryAnimation={{
              type: 'panBy',
              offset: [0, -50],
              startFrame: 181,
              endFrame: 360,
            }}
          />
          <Sequence from={30} durationInFrames={330} premountFor={fps}>
            <MapMarker label="SANGOMAR" coordinates={[-16.85, 14.15]} />
          </Sequence>
          <Sequence from={210} premountFor={fps}>
            <MapMarker label="GTA" coordinates={[-17.0, 13.5]} />
          </Sequence>
          <SVGGrain />
        </div>
      );
    };
    ```

---

### **Panel 3 : Révélation du Chiffre Clé - $8M**

1.  **Mapping Frames :** `f525` -> `f870` (11.5s). La transition depuis la carte se fera entre `f525` et `f555`.
2.  **Background & Style :**
    *   Fond `bg-ivory` (#f5f0e8).
    *   `<SVGGrain />` en surcouche.
3.  **Composants Remotion :**
    *   `<BigStat />` : Pour afficher "$8M".
    *   `<GoldLine />` : Pour la ligne de séparation.
    *   `<SubtitleBar />` : Pour "PETROLE SENEGALAIS 2024".
4.  **Assets à Générer :** Aucun.
5.  **Timing Frame par Frame :**
    *   `f525 - f555` : Transition. On peut utiliser un `BrutalHookSplit` ou un simple fondu enchaîné rapide depuis la carte.
    *   `f555` : **Ancrage audio "Huit millions de dollars par jour"**. Le chiffre "8" doit finir son animation `CountUp` exactement sur cette frame.
    *   `f550 - f580` : Le composant `<BigStat />` anime son entrée. Le '$' et le 'M' apparaissent avec un `spring` (scale et opacity). Le '8' utilise le composant `<CountUp />` de 0 à 8.
    *   `f580 - f610` : `<GoldLine />` et `<SubtitleBar />` animent leur entrée en fondu et léger slide vertical.
    *   `f610 - f870` : Le visuel est stable. C'est une pause intentionnelle pour laisser le chiffre infuser, créant une tension avant la contradiction.
6.  **Paramètres Mapbox :** N/A.
7.  **Nouveau Composant :** Aucun.
8.  **Code Skeleton TSX (`Scene2_BigStat.tsx`) :**
    ```tsx
    import { Sequence, useVideoConfig } from 'remotion';
    import { BigStat } from '../shared/BigStat';
    import { GoldLine } from '../shared/GoldLine';
    import { SubtitleBar } from '../shared/SubtitleBar';
    import { SVGGrain } from '../shared/SVGGrain';

    export const Scene2_BigStat = () => {
      const { fps } = useVideoConfig();
      const statRevealFrame = 555; // Ancrage audio

      return (
        <div className="flex-1 bg-ivory flex-col justify-center items-center">
          <BigStat
            value={8}
            prefix="$"
            suffix="M"
            countUpStartFrame={statRevealFrame - 15}
            countUpDuration={15}
            className="text-navy"
          />
          <Sequence from={statRevealFrame + 25} premountFor={fps}>
            <div className="flex flex-col items-center w-full">
              <GoldLine className="my-4 w-1/4" />
              <SubtitleBar text="PÉTROLE SÉNÉGALAIS 2024" className="text-navy" />
            </div>
          </Sequence>
          <SVGGrain />
        </div>
      );
    };
    ```

---

### **Panel 4 : La Fissure**

1.  **Mapping Frames :** L'animation se superpose à la fin du Panel 3, de `f841` à `f871` (1.0s).
2.  **Background & Style :** Identique au Panel 3.
3.  **Composants Remotion :**
    *   Le composant `Scene2_BigStat` existant.
    *   Un nouveau composant `<AnimatedCrack />` superposé.
4.  **Assets à Générer :**
    *   **SVG :** Un fichier `crack.svg`. Le tracé de la fissure doit être un `<path>` unique, non rempli, avec un `stroke`. Le design doit être anguleux et réaliste.
5.  **Timing Frame par Frame :**
    *   `f841` : Début de l'animation de la fissure.
    *   `f841 - f871` : Le composant `<AnimatedCrack />` anime la propriété `stroke-dashoffset` du path SVG de sa longueur maximale à 0, donnant l'illusion que la fissure se dessine.
    *   `f871` : **Ancrage audio "l'Etat n'est pas certain..."**. La fissure termine sa course. On peut ajouter un très léger `screen shake` (un `spring` sur les `translateX` et `rotate` du conteneur principal) de 2-3 frames pour l'impact.
6.  **Paramètres Mapbox :** N/A.
7.  **Nouveau Composant : `AnimatedCrack.tsx`**
    *   Props : `startFrame: number`, `durationInFrames: number`.
    *   Fonctionnement : Utilise `useCurrentFrame()` pour interpoler `stroke-dashoffset`. Le SVG est importé comme un composant React.
8.  **Code Skeleton TSX (`Scene2_BigStat.tsx` - avec la fissure) :**
    ```tsx
    // ... imports
    import { AnimatedCrack } from './AnimatedCrack'; // Nouveau composant

    export const Scene2_BigStat = () => {
      // ...
      const contradictionFrame = 871; // Ancrage audio

      return (
        <div className="flex-1 bg-ivory flex-col justify-center items-center">
          {/* ... BigStat, GoldLine, SubtitleBar ... */}
          <Sequence from={contradictionFrame - 30} premountFor={fps}>
            <AnimatedCrack />
          </Sequence>
          <SVGGrain />
        </div>
      );
    };
    ```

---

### **Panel 5 : La Question**

1.  **Mapping Frames :** `f872` -> `f1118` (8.2s).
2.  **Background & Style :** `bg-ivory` avec `<SVGGrain />`.
3.  **Composants Remotion :**
    *   `<BrutalHookSplit />` pour la transition.
    *   `<Badge />` pour l'icône d'avertissement.
    *   Un simple conteneur pour le texte.
4.  **Assets à Générer :**
    *   **SVG Icon :** Une icône "warning" (triangle avec point d'exclamation) pour le badge.
5.  **Timing Frame par Frame :**
    *   `f872 - f892` : Transition `<BrutalHookSplit />` depuis la scène du chiffre fissuré.
    *   `f892` : Le texte "OÙ PASSE L'ARGENT DU PÉTROLE ?" est visible, statique et impactant.
    *   `f920 - f960` : Le `<Badge />` d'avertissement apparaît avec une animation `spring` (léger rebond en scale et opacity).
    *   `f960 - f1118` : Maintien du plan fixe pour laisser la question résonner.
6.  **Paramètres Mapbox :** N/A.
7.  **Nouveau Composant :** Aucun.
8.  **Code Skeleton TSX (`Scene3_Question.tsx`) :**
    ```tsx
    import { Sequence, useVideoConfig } from 'remotion';
    import { Badge } from '../shared/Badge';
    import { SVGGrain } from '../shared/SVGGrain';
    import WarningIcon from '../assets/warning.svg';

    export const Scene3_Question = () => {
      const { fps } = useVideoConfig();

      return (
        <div className="flex-1 bg-ivory flex-col justify-center items-center p-24">
          <div className="relative">
            <h1 className="text-8xl font-black text-navy text-center leading-tight">
              OÙ PASSE L'ARGENT<br/>DU PÉTROLE ?
            </h1>
            <Sequence from={30} premountFor={fps}>
              <Badge 
                icon={WarningIcon} 
                className="absolute -top-8 -right-8" 
              />
            </Sequence>
          </div>
          <SVGGrain />
        </div>
      );
    };
    // Note: La transition BrutalHookSplit serait gérée dans la composition parente.
    ```

---

### **Panel 6 : La Mécanique Complexe**

1.  **Mapping Frames :** `f1119` -> `f1299` (6.0s).
2.  **Background & Style :** `bg-ivory` avec `<SVGGrain />`.
3.  **Composants Remotion :**
    *   Nouveau composant : `<FlowDiagram />`.
4.  **Assets à Générer :**
    *   **SVG Icons :** Icônes stylisées pour "Puits de pétrole", "Trésor Public" (bâtiment institutionnel), et "Dépenses publiques" (groupe de personnes).
    *   **Data :** Un simple objet ou tableau JS pour définir les nœuds et les liens du diagramme.
5.  **Timing Frame par Frame :**
    *   `f1119` : **Ancrage audio "une mécanique plus complexe"**. Transition en fondu depuis la question.
    *   `f1119 - f1149` : Fondu enchaîné. Le titre "DU PUITS AU TRÉSOR PUBLIC" et les 3 blocs du diagramme apparaissent.
    *   `f1150 - f1250` : Les lignes de flux s'animent de gauche à droite, en utilisant `stroke-dashoffset`. L'animation est décalée pour chaque ligne pour plus de dynamisme.
    *   `f1250 - f1299` : Le diagramme animé est maintenu à l'écran.
    *   `f1299` : Fondu au noir pour terminer l'Acte I.
6.  **Paramètres Mapbox :** N/A.
7.  **Nouveau Composant : `FlowDiagram.tsx`**
    *   Props : `data: { nodes: [], links: [] }`.
    *   Fonctionnement : Mappe sur les `nodes` pour afficher les boîtes avec icônes et textes. Utilise D3