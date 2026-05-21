# Analyse croisee - Style Jacques a dit -> Implementation V4

**Date** : 2026-05-18
**Sources** :
- Video 1 : Jacques a dit - Pourquoi la geographie du Bresil n'a aucun sens (560s)
- Video 2 : Jacques a dit - 9 Faits Incroyables sur le Quebec (735s)
- Analyses : manuelle (Claude, 14 frames extraites) + Gemini 2.5 Pro (2 videos completes)

---

## DECOUVERTE CLE

**Jacques a dit utilise DEUX styles de carte distincts selon la video** :

| Video | Style de base | Aspect |
|---|---|---|
| Bresil | Satellite + composition After Effects (texture relief, bathymetrie, vignettage) | Photorealiste cinematic |
| Quebec | Vector clean Mapbox Studio custom (couleurs unies, relief subtil) | Epure illustratif |

Notre POCV3 etait calque sur l'esthetique Quebec (outdoors-v12 clean). **C'est le bon choix pour matcher la video de reference Quebec.** Mais on peut aussi tenter le style Bresil pour les sequences "vue de l'espace" / wow visuel.

---

## RECETTE COMMUNE AUX DEUX VIDEOS

### Base
1. **Carte sans AUCUN label** (villes, pays, routes) - confirme par Gemini ET visible sur toutes nos 14 frames
2. **Camera 2D pure** : pan + zoom, pas de bearing/rotation 3D (sauf occasionnel pitch leger sur Bresil)
3. **Easing systematique `ease-in-out`** - jamais lineaire
4. **Camera fixe 2-4s** quand un overlay important apparait

### Le truc visuel signature : le HALO LUMINEUX
**C'est l'element le plus distinctif de leur style.** Technique exacte (analyse Gemini) :
- 2 couches `line` Mapbox sur le meme GeoJSON :
  - Couche dessous : large, floue (`line-blur`), couleur vive (jaune/orange/blanc)
  - Couche dessus : fine, nette
- Optionnel : pulsation de l'opacite/largeur de la couche floue pour effet "respiration"

### Colorisation du pays/region surligne
- Layer `fill` Mapbox sur GeoJSON
- **Sur fond satellite (Bresil)** : couleur vive avec mode de fusion CSS `mix-blend-mode: overlay` ou `soft-light` pour laisser transparaitre le relief
- **Sur fond vector (Quebec)** : couleur unie directe

### Overlays par-dessus la carte
- Photos en **vignettes geometriques** (cercles, octogones, rectangles arrondis) avec contour blanc + `box-shadow`
- Photos legerement rotatees (~5-10 deg) pour effet scrapbook
- Pins lumineux jaunes (CSS `box-shadow: 0 0 20px gold`)
- Lignes courbes tracees (`stroke-dashoffset` anime)
- Numeros chapitre en haut a gauche (rouge handwritten, deja fait via `AnimatedChapterNumber.tsx`)

### Typographie
- **Sans-serif geometrique gras** : Montserrat / Poppins / Raleway (suggestion Gemini)
- Tous les textes ont `drop-shadow` ou contour pour rester lisibles sur la carte
- Apparition : fade-in + leger scale
- Hierarchie : titre/chiffre cle GROS, sous-titre regular

### Transitions
- **Cuts secs majoritaires**, synchronises sur la narration
- Occasionnel : transition graphique "wipe nuages" comme element de rupture

---

## CE QU'ON A DEJA & CE QU'IL FAUT AJOUTER

| Element | Etat | Action V4 |
|---|---|---|
| Style outdoors-v12 sans labels | ✅ `MapPlatV3` | Garder pour scenes vector style Quebec |
| Style satellite sans labels | ❌ | Creer `MapSatelliteV4` (variante `MapPlatV3` avec `satellite-v9` + meme stripLabels) |
| Halo lumineux pays/region | ❌ | Creer `GlowingRegionOverlay.tsx` (2 line layers Mapbox + fill optionnel) |
| Vignettage cinematic | ❌ | Composant `CinematicVignette.tsx` (CSS `radial-gradient` overlay) |
| Numeros chapitre rouge | ✅ `AnimatedChapterNumber` | Garder tel quel |
| Drapeau sur silhouette | ✅ `QuebecFlagSilhouette` | Garder tel quel |
| Photos vignettes rotatees | ❌ | Composant `PhotoVignette.tsx` (Img + clip-path + rotate + shadow) |
| Pin lumineux jaune | ❌ | Composant `GlowingPin.tsx` (div + box-shadow) |
| Ligne courbe animee (rivieres, trajets) | ❌ | Composant `AnimatedPath.tsx` (SVG path + stroke-dashoffset) |
| Annotation lasso (forme libre) | ❌ | SVG path dessine main, peu prioritaire |
| Police Montserrat/Poppins | ❌ | Ajouter via Remotion `<Font>` ou Google Fonts CDN |
| Camera ease-in-out 2D pure | ✅ `MapPlatV3` | Garder, ne PAS reactiver pitch/bearing |
| Mix-blend-mode overlay sur satellite | ❌ | A faire dans `GlowingRegionOverlay` quand fond = satellite |

---

## VERDICT FINAL POUR V4

**Difficulte globale : 3/5** (Gemini disait 4/5, je suis plus optimiste car on a deja les briques principales).

### 3 composants prioritaires a creer

1. **`GlowingRegionOverlay.tsx`** - Le plus gros gain visuel. Charge un GeoJSON (Quebec, Bresil, region), affiche fill + double line layer halo. Animable (fade-in, pulse).

2. **`PhotoVignette.tsx`** - Affiche une photo dans une forme (octogone/cercle/rect-rounded) avec contour blanc, ombre portee, rotation legere, pop spring.

3. **`MapSatelliteV4.tsx`** - Variante satellite de `MapPlatV3` pour les sequences "vue cinematic".

### 2 polish a faire passer en standard

4. **`CinematicVignette.tsx`** - Overlay vignettage radial qui s'applique sur toute scene cartographique pour donner le look "cinematic".

5. **Police globale Montserrat/Poppins** au lieu de Helvetica Neue.

### Ce qu'on garde tel quel
- `MapPlatV3` (outdoors-v12 sans labels) = parfait pour matcher style Quebec
- `QuebecFlagSilhouette` = parfait
- `AnimatedChapterNumber` = parfait
- Architecture scenes (Scene001V3, Scene002, etc.)

### Strategie scene-par-scene pour POCV4

| Scene | Duree | Fond | Overlays cle |
|---|---|---|---|
| Scene 1 Intro | 0-8.5s | `MapPlatV3` zoom-out + vignette | silhouette drapeau + hook text + QUIZ pop |
| Scene 2 Titre | 8.5-10.5s | Plein cadre couleur unie (cut sec) | titre brush + drapeau anime |
| Scene 3 Taille | 10.5-69s | `MapPlatV3` + `GlowingRegionOverlay` Quebec | photo vignette compare, chiffres, annotations |
| Scene 4 Fleuve | 69-80s | `MapPlatV3` zoom + `AnimatedPath` St-Laurent | pin lumineux, distance label |

---

## NOTES POUR PLUS TARD

- Le drapeau 3D qui flotte (intro Bresil) demande Blender + export webm transparent - hors scope V4
- L'imagerie satellite + bathymetrie style Bresil exige du compositing complexe - reservee aux moments "wow", pas par defaut
- Force Alignment audio reste un must-have separe (probleme #4 du feedback initial) - a faire en parallele V4
