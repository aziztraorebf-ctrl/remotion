---
name: Atlas Mansa Moussa V2 - Idees polish a integrer en passe finale (Bloc 8)
description: Suggestions Kimi BLOC 2 + BLOC 3 retenues pour la passe finale, faisables Remotion vectoriel.
type: project
---

# Atlas Mansa Moussa V2 — Idees polish passe finale (Bloc 8)

> Cree : 2026-05-01 fin session BLOC 3
> Statut : a integrer apres BLOC 4 (S4 finition) + audio insert 3 + Insert Line + CTA + karaoke + render full
> Toutes ces idees sont **non-bloquantes** (Kimi confirme), juste du polish "premium documentary"

---

## Idees retenues (4)

### 1. Micro-parallax sur les labels de villes (Kimi BLOC 2 #2)
**Source** : Kimi review BLOC 2
**Idee** : labels villes (TOMBOUCTOU, LE CAIRE, LA MECQUE) flottent legerement contre le mouvement de camera — donne de la profondeur sur la carte plate.
**Implementation** : ajouter prop `parallaxFactor` au composant `<AtlasLabel>` :
```tsx
const labelParallaxY = scrollProgress * factor * 15;
transform={`translate(${coord[0]} ${coord[1] + labelParallaxY})`}
```
**Cout** : ~30 min

### 2. Pie chart segment Mali qui respire (Kimi BLOC 2 #3)
**Source** : Kimi review BLOC 2
**Idee** : sur l'insert Pie Chart, le segment Mali (50% gold) anime `scale: [1, 1.02, 1]` en boucle 3s avec `transform-origin` au centre du cercle. Souligne subtilement que ce segment EST le sujet.
**Implementation** : modifier `AtlasV2InsertPieChart.tsx` :
```tsx
const breath = 1 + 0.02 * Math.sin(localFrame * 0.07);
<path d={maliArc} fill={gold} transform={`scale(${breath})`} transform-origin="center" />
```
**Cout** : ~15 min

### 3. Trainee de poussiere doree sur la caravane (Kimi BLOC 3 #2)
**Source** : Kimi review BLOC 3
**Idee** : 20 particules dorees (#D4A574 30% opacity) qui s'effilochent derriere le chameau pendant la traversee Niani -> La Mecque. Dispersion gaussienne, gravite 0.2, friction 0.95.
**Implementation** : nouveau composant `<DustTrail emitter={camelPosition} particles={20} lifespan={45} spread={15} />` — systeme de particules SVG pur (pas de canvas), `useCurrentFrame()` pour physique simple. Pattern reutilisable pour episodes futurs (caravanes Songhai, Ghana).
**Cout** : ~1h (composant nouveau, mais reutilisable)

### 4bis. Reflet dore dynamique sur l'ocean (Kimi BLOC 3 v2 #1)
**Source** : Kimi review BLOC 3 v2
**Idee** : ajouter un `linearGradient` SVG anime sur le rect ocean, avec stop dore #D4A574 a 8% opacity qui pulse (scale 1->1.02, opacity 0.05->0.12) synchronise avec les beats narration. L'or du Mali "resonnerait" sur l'ocean autour.
**Implementation** : nouveau composant `<OceanShimmer />` avec `useCurrentFrame()` :
```tsx
<linearGradient id="oceanShimmer" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stopColor={ATLAS_COLORS.ocean} />
  <stop offset={`${50 + 30*sin(f*0.04)}%`} stopColor="#D4A574" stopOpacity={0.05 + 0.07*Math.abs(sin(f*0.04))} />
  <stop offset="100%" stopColor={ATLAS_COLORS.ocean} />
</linearGradient>
```
**Cout** : ~30 min

### 5. Cartouches avec ornements medievaux depliage (Kimi BLOC 3 #3)
**Source** : Kimi review BLOC 3
**Idee** : 4 petits paths SVG aux coins de chaque cartouche (style manuscrit medieval) qui s'animent en 6 frames a l'apparition (`scale: 0->1` spring stiffness 500, decales de 2 frames chacun pour effet "depliage").
**Implementation** : ajouter prop `ornamental={true}` au composant `<AtlasCartouche>` :
```tsx
{ornamental && [topLeft, topRight, bottomLeft, bottomRight].map((corner, i) => (
  <path key={i} d={cornerOrnament[i]} transform={`scale(${cornerSpring(i*2)})`} />
))}
```
**Cout** : ~45 min (dont design des 4 ornements SVG)

---

## Idees rejetees

### 1. Stippling/dashoffset anime sur frontieres Empire (Kimi BLOC 2 #1, BLOC 3 #1)
**Raison** : `strokeDashoffset` anime ne marche pas dans Remotion ANGLE sur paths complexes (documente dans LEARNINGS-V2-VECTOR-PIPELINE.md §5). Kimi ne le sait pas.
**Alternative envisageable** : si vraiment besoin, utiliser 40-50 `<circle>` positionnes via `path.getPointAtLength()` avec delai progressif spring (la deuxieme partie de la suggestion Kimi). Mais effet marginal pour 2h de dev. **Skip.**

## Experimentations a reprendre plus tard (pas pour V2)

### Texture papier multiply — essai 2026-05-01 INVISIBLE
**Tente** : SVG `<feTurbulence>` natif + `mix-blend-mode: multiply` a 35% opacity en overlay.
**Probleme observe** : effet quasi nul a l'oeil nu sur fond sombre `#1A1F3A`. Multiply * grain clair * fond fonce = fond fonce presque identique.
**Hypotheses pour retry futur** :
- Tester `mix-blend-mode: overlay` ou `soft-light` (marche dans les 2 sens clair/foncé)
- Augmenter opacity a 50-70%
- Utiliser PNG parchemin existant (`sonjata-papercraft/images/scene9-parchment-bg.png`) pour coherence avec autres Shorts du pilier
- Tester sur des zones specifiques (cartouches, legendes) plutot que overlay global
**Decision V2** : drop, on ne perd rien visuellement, on ne ralentit pas la prod. A reprendre en epis #2 ou en passe DA dediee.

---

## Note methode

Ces 4 idees sont a integrer **APRES** :
1. BLOC 4 (S4 finition) livre + valide
2. BLOC 5 audio insert 3 (deja genere : `insert-3-mediterranee.mp3` 6.72s)
3. BLOC 6 Insert Line + CTA livre + valide
4. BLOC 7 karaoke
5. BLOC 8 composition finale + render full

Une seule iteration de polish a la fin = on touche les composants une fois, on rend une fois, on uploade une fois. Pas de va-et-vient incremental sur ces 4 elements (qui sont du polish, pas des fixes critiques).

**Cout total estime des 4 idees** : ~2h30 de dev + 1 render final qui inclut tout.
