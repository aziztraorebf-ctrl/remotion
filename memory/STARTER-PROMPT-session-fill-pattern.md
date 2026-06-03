# STARTER — Session Fill-Pattern & Objets sur carte (PROCHAINE SESSION PRIORITAIRE)

> À coller au début de la session dédiée. Objectif : construire la bibliothèque de templates qui colorient et peuplent la carte Mapbox. C'est la pièce manquante identifiée le 2026-06-02 pour des cartes vivantes.
> Validé par Aziz. Cette session précède Beat 2 Maroc.

---

## 1. Lire AVANT de coder (dans cet ordre)

1. `memory/feedback_flagfill-templates-decouverte.md` — les 2 templates FlagFill validés + règles techniques
2. `memory/feedback_recherche-templates-obligatoire.md` — la règle de recherche
3. `memory/DOCTRINE-SOUVERAIN.md` sections 3.9 (FlagFill N°1) et 3.10 (recherche templates)
4. `src/projects/souverain/maroc-batteries/beats/Beat1Phosphate.tsx` — code de référence : `drawMarocFlagCanvas`, `loadFlagCanvas`, `pushCanvas`, `GeoPlaque`, `ArcLabel`, `IconMineBadge`, `IconFactoryBadge`, dots CSS via `map.project()`
5. Les 2 templates FINAL : `out/templates-souverain/FINAL-FlagFill-FocusUn-V.mp4` + `FINAL-FlagFill-MultiPays-V.mp4`

## 2. Contexte — la découverte

Une carte Mapbox DOIT être colorée/peuplée dès le départ. Le gris = vide non rempli, pas un style. Deux mécaniques complémentaires :
- **Remplir un TERRITOIRE** : fill-pattern (drapeau/texture) dans la silhouette d'un pays
- **Marquer un POINT** : objet/badge overlay CSS positionné via `map.project()`

Toutes les chaînes premium font ça. Eux = émojis géants moches. Nous = badges/objets premium navy/gold, dimensionnables et animés.

## 3. TOP 3 VALIDÉ AZIZ — coder en premier

**#3 — Bibliothèque drapeaux canvas** (fondation)
- 15 drapeaux dessinés en canvas pur (PAS de fetch — local `public/_shared/flags/`)
- Pays africains + grands partenaires (Chine, USA, France, Allemagne, Espagne, Russie...)
- Helper `pushFlagToMap(map, iso)` réutilisable
- Pays principal = canvas pur dispo à f0 ; autres = PNG locaux via `staticFile()`

**#4 — ResourceTextureFill** (le vrai différenciant)
- 6 textures bichromie navy/gold projetées dans les polygones :
  - Pétrole (gouttes/derricks) · Or (pépites/lingots) · Phosphate (cristaux hex, déjà prototypé)
  - Agriculture (épis) · Lithium (cellules batteries) · Gaz (flammes)
- Le pays n'est pas juste coloré, il est "rempli de sa ressource". Aucune chaîne africaine ne fait ça.

**#6 — WavingFlagFill** (l'effet premium)
- Drapeau qui ondule dans la silhouette (canvas redessiné frame par frame, décalage sinusoïdal)
- Pattern d'ondulation déjà dans `src/_archive/MarocBatteriesShort_OLD_2026-06-02.tsx` (fonction drawMarocFlag avec phase)

## 4. Liste complète des templates (référence — affiner en début de session)

### Fondations
1. `FlagFillStatic` — 1 drapeau + voisins couleurs unies (= template A formalisé)
2. `FlagFillSequence` — drapeaux s'allument en séquence synchro voix (= template B formalisé)
3. Bibliothèque drapeaux canvas + `pushFlagToMap(map, iso)` ⭐ TOP 3

### Textures narratives
4. `ResourceTextureFill` — texture ressource dans polygone (6 textures) ⭐ TOP 3
5. `HeatGradientFill` — choropleth dynamique, couleur monte avec la voix

### Effets avancés
6. `WavingFlagFill` — drapeau ondulant ⭐ TOP 3
7. `FlagDissolveTransition` — un pays passe d'un drapeau à un autre (crossfade)
8. `ImageProjectionFill` — image réelle stylisée bichromie clippée dans polygone (suggestion Gemini)
9. `PulsingRegionFill` — couleur d'une zone qui pulse (point chaud/tension)

### Combos
10. `ContagionFlagSpread` — DominoContagionFill + drapeaux (alliance qui s'étend : AES, CEDEAO, BRICS)

## 5. OBJETS SUR LA CARTE — 2e grand chantier de la session (idée Aziz 2026-06-02)

Mécanique : overlay CSS/SVG positionné via `map.project()` (comme `GeoPlaque`/`ArcLabel`), au-dessus d'un POINT géo. Différent des drapeaux (qui remplissent un territoire).

**Objets à créer (bibliothèque) :**
- **Ressources** : baril pétrole, lingot or, cristal, pile/batterie, épi blé, goutte eau
- **Infrastructure** : usine, port (grue/conteneur), centrale, pipeline, antenne 5G, panneau solaire
- **Symboles** : flèche directionnelle, cible/radar, point d'exclamation (tension), signe $/€
- **Transport** : cargo, camion, avion (pour les flux)

**2 sources :**
1. SVG React épuré bichromie (léger, animable — pattern `IconMineBadge` déjà codé)
2. Images Gemini bichromie navy/gold (plus riches pour objets complexes — usine stylisée vs pictogramme)

**Jouer avec la taille (narratif, pas décoratif) :**
- Spring d'apparition (scale 0→1)
- Taille encode une donnée : le plus gros baril = le plus gros producteur
- Helper `GeoObject({ coord, type, size, at })` réutilisable

**Template cible : `GeoObjectMarker`** — objet SVG/image ancré géo, taille fixe écran OU proportionnelle à une donnée, spring d'entrée, optionnel pulse.

## 6. Livrables de la session

- Helpers réutilisables : `pushFlagToMap`, `pushTextureToMap`, `GeoObject`
- 15 drapeaux canvas + 6 textures + 10-12 objets SVG
- Templates formalisés dans `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md`
- Previews dashboard si validés
- Mettre à jour COMPOSANTS-INDEX + INDEX-DES-INDEX

## 7. Après cette session

Beat 2 Cailloux Maroc (pur Remotion — indépendant, mais bénéficie des objets pour cohérence visuelle). Puis Beats 3-5.
