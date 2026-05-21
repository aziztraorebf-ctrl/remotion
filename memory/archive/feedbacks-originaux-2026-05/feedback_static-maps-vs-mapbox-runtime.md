---
name: Cartes statiques vs Mapbox-gl runtime — pivot architectural Atlas
description: Decision strategique 2026-04-29. Pour Shorts narratifs avec personnages animes et dynamisme TikTok, abandonner Mapbox-gl runtime au profit de cartes statiques pre-rendues + Remotion compositing.
type: feedback
---

# Cartes statiques vs Mapbox-gl runtime

**Regle :** pour les Shorts Atlas Geoafrique narratifs (1-5 min, style cesar dense, audience YouTube/TikTok mobile), preferer **cartes statiques pre-rendues + Remotion compositing** plutot que Mapbox-gl runtime.

**Why :** session Mansa Moussa V1 (2026-04-29) a livre une video satisfaisante mais avec saccades aux switch projection globe<->mercator + manque flexibilite creative (pas de personnages chibi animes sur la carte, pas de cuts dynamiques entre styles cartographiques, camera moves limites par les contraintes geo-precis Mapbox). Aziz a analyse une video reference (https://youtube.com/shorts/-VWk5IDn3CA - Hundred Years War) qui utilise pipeline statique et a un dynamisme TikTok superieur.

**How to apply :**

### Quand utiliser cartes statiques (V2 hybride)
- Shorts narratifs avec arc complet (Hook + densite + climax + CTA)
- Besoin de personnages chibi animes sur la carte (caravane, soldats, marchands)
- Multiple styles cartographiques dans le meme Short (parchemin + satellite + aerial)
- Sous-titres TikTok karaoke synchronises
- Audience mobile qui scroll rapidement (besoin dynamisme constant)
- Episodes recurrents (assets carte reutilisables cross-episodes)

### Quand garder Mapbox-gl runtime (rare)
- Demos techniques montrant explicitement la geographie 3D
- Shorts purement educatifs sans narrative complexe
- Quand precision geographique > flexibilite creative
- Episode unique sans reutilisation prevue

### Pattern technique cartes statiques

**Generation** :
- Recraft (mode SVG natif + remove background) : ideal pour cartes stylisees
- Gemini 3 Pro avec prompt `"map of Africa, parchment style, no labels, no text, transparent or solid color background"`
- Mapbox Studio en pre-render (export 4096x4096 PNG une seule fois)

**Animation Remotion** :
- Camera moves illusoires : `interpolate(frame, ..., scale)` + `translate` sur `<Img>` carte fixe
- Type 1 (breathing) : `Math.sin(frame * 0.15) * 4` pour translate Y
- Type 3 (trajectoire) : `pathRef.current.getPointAtLength(t * pathTotalLength)` pour position le long courbe Bezier
- Type 4 (apparition) : spring scale 0->1 sur 0.5s

**Architecture** :
- 100% Remotion + `<Img>` + SVG overlays (pas Mapbox-gl)
- Cuts directs entre plans cartographiques (pas de transitions complexes)
- Sequence orchestre les overlays (cartouches, personnages, sous-titres)

### Reference visuelle

Hundred Years War Short telecharge dans `research/reference-shorts/ref-france-england.webm` + 13 frames analysees dans `research/reference-shorts/frames/`.

### Reutilisable cross-episodes

80% du code V2 sera reutilisable pour Songhai, Ghana, Aksoum, Kanem-Bornou, Almoravides, etc. Investissement architectural amortit rapidement.

---

## Detail des 4 types d'animation

Reference complete : `memory/atlas-mansa-moussa/NEXT-SESSION-mansa-moussa-v2-hybride.md` section "4 TYPES D'ANIMATION".

1. **Type 1 - Transform CSS** : breathing, ondulation, pulse (boucle 30-60 frames)
2. **Type 2 - Spritesheet** : cycles complexes (archer, drapeau qui claque) - 4-8 PNG frames
3. **Type 3 - Trajectoire Bezier** : caravane qui voyage le long d'une route
4. **Type 4 - Apparition spring** : entree progressive personnages

---

## Outils utilises par les chaines pro

- **After Effects** : standard motion graphics (~$23/mois, courbe d'apprentissage 3-6 mois)
- **Photoshop** : preparation cartes statiques + personnages PNG
- **Premiere Pro** : edit final + sous-titres
- **Stock assets** : flaticon, freepik, vecteezy (chibi), envato (effets), Epidemic Sound (musique)

**Equivalence Remotion** : tout faisable en code React. Plus rapide pour quelqu'un qui pense en code (Aziz via Claude). Pas besoin Adobe.

---

## Limites Remotion (a connaitre)

**Faisable facilement** :
- Camera moves illusoires (scale/translate/rotate) sur images fixes
- Compositing par couches avec timing-precis
- Trajectoires Bezier
- Cycles breathing/pulse
- Cross-fades
- Sous-titres karaoke

**Plus complexe** :
- Effets atmospheriques volumineux (flammes deformation, fumee volumetrique)
- Spritesheets multi-frames (faisable mais demande generation 8+ PNG coherents)

**Non disponible** :
- Animations tissu realiste avec physique
- Effets particules 1000+ avec collision
- Vraie rotation 3D objets

Pour Mansa Moussa V2, on a besoin uniquement des choses faciles.

---

## Decision actee Atlas Geoafrique

A partir de 2026-04-29, **tous les futurs episodes Atlas Geoafrique seront produits en V2 hybride** (cartes statiques + Remotion compositing). V1 Mansa Moussa reste en archive comme reference architecturale du pipeline Mapbox-gl runtime, mais ne sera publiee qu'en comparaison post-V2.

`atlas-template-v1.md` deviendra `atlas-template-v2.md` une fois V2 Mansa Moussa validee.
