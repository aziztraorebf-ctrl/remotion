# Style Exploration Analysis - Phase Test

> Migré depuis auto-memory 2026-08-31. **PÉRIMÉ** — comparatif de styles visuels réalisé fev 2026,
> avant le pivot vers les registres actuels (Souverain/Atlas/SVG maison). Conservé pour
> l'historique de décision (pourquoi Data Viz Cinématique a été abandonné, pourquoi Sketch/Doodle
> a été retenu à l'époque) et la méthode de décomposition en sous-styles.

## Styles Testes

### 1. Data Viz Cinematique (v1) - ARCHIVED
- Particules, degradees, blur, cinematique
- Verdict: "After Effects template", generique, pas d'identite
- Lesson: l'effet wow ne suffit pas, il faut une identite

### 2. Brutalist Data Viz (v2) - DEFINI, PAS PROTOTYPE
- Typography-driven, hard cuts, zero decoration
- Potentiel: fort pour finance/business
- Probleme: sans audio ca parait "flat" (normal), pas encore teste en production complete

### 3. Sketch/Doodle (v3) - PROVEN (a l'epoque)
- Papier creme, stick figure a lunettes, hand-drawn SVG
- Verdict: "beaucoup plus interessant", retour positif Aziz + reviewers externes
- Forces: charme, identite (lunettes), facile a produire, expressif
- Faiblesses: peut paraitre "simple" pour des sujets serieux/complexes

---

## Styles a Explorer (Propositions, non retenues depuis)

### 4. Data Design Pro + Retro (inspire par les images d'Aziz)

**Ce que c'est**:
Fond sombre + data viz professionnelle + esthetique retro (pixel art, typographie monospace, textures vieillies). Mix entre Kurzgesagt, Data is Beautiful, et pixel art.

**Ce qu'Aziz a montre**:
- Cartes detaillees avec routes de propagation (lignes rouges)
- Crane stylise en icone forte (orange/rouge)
- Bar charts multicolores (rouge/bleu/vert)
- Scenes pixel art de villages/marches medievaux
- Tableaux comparatifs Avant/Apres avec fleches
- Typographie MAJUSCULE monospace
- Fond tres sombre (#1a1a1a ou similaire)
- Beaucoup d'info par ecran (trop selon Aziz lui-meme)

**Faisabilite en Remotion**:
- Data viz (charts, cartes, timelines): OUI, deja prouve avec SketchyLineChart
- Fond sombre + typographie monospace: TRIVIAL
- Animations de donnees (bar charts progressifs, counters): OUI
- Tableaux comparatifs anime: OUI
- **Pixel art de villages**: NON en code pur. Necessite des ASSETS pre-faits (sprites/tilesets)
- **Crane detaille**: semi-faisable en SVG, ou mieux en asset pre-fait

**Decomposition en 2 sous-styles**:

#### 4a. Data Design Pro (100% Remotion, zero assets externes)
- Fond sombre + gradients subtils
- Charts animes (bar, line, donut, timeline)
- Cartes SVG avec routes animees
- Tableaux comparatifs avec animations
- Typography: Space Grotesk + JetBrains Mono
- Icones simples SVG (pas de pixel art)
- **Difficulte**: Moyenne - reutilise les patterns deja prouves
- **Identite**: professionnelle, "data journalist"
- **Ideal pour**: finance, economie, stats

#### 4b. Retro/Pixel Art Hybride (Remotion + assets achetes)
- Scenes pixel art pre-faites (tilesets + sprites)
- Animations frame-by-frame (spritesheet) pour personnages
- Data viz integree dans le monde pixel (ex: chart qui "pousse" dans le decor)
- **Difficulte**: HAUTE - necessite:
  1. Acheter/creer des tilesets (itch.io, ~5-20 EUR par pack)
  2. Creer des spritesheets pour animations
  3. Integrer dans Remotion (possible mais complexe)
  4. Maintenir la coherence visuelle entre pixel art et data viz
- **Identite**: forte, tres differenciante, nostalgique
- **Ideal pour**: histoire, recits, narratifs

**Recommandation d'Aziz a l'epoque**: "moins d'images par ecran" - les references sont trop denses.
Principe: 1 idee = 1 ecran. Pas 4 charts sur le meme frame.

---

### 5. Whiteboard Animation (non demande mais pertinent a l'epoque)
- Style "RSA Animate" / "Draw My Life"
- Main qui dessine en temps reel
- Fond blanc, tracage progressif
- Tres proche du sketch/doodle mais plus "premium"
- Faisabilite: HAUTE en Remotion (SVG path drawing + hand image overlay)
- Difficulte: moyenne (hand tracking est le challenge)

### 6. Infographic Motion (non demande mais pertinent a l'epoque)
- Style "Vox" / "Visual Capitalist animated"
- Flat design, animations fluides, transitions morphing
- Icones vectorielles, palette reduite
- Faisabilite: HAUTE en Remotion
- Difficulte: faible a moyenne
- Risque: peut tomber dans le "generique" comme v1

---

## Recommandation Strategique (a l'epoque)

**Pour la phase test, tester 4a (Data Design Pro) en priorite**:

1. Reutilise 80% du travail deja fait (charts, maps, animations)
2. Zero cout d'assets (tout en code)
3. Se differencie clairement du sketch/doodle (sombre vs clair)
4. Professionnel pour la niche finance
5. Comparaison directe possible: meme contenu (Peste 1347) dans 2 styles

**4b (Pixel Art) en phase 2 si Aziz voulait investir**:
- Necessite un budget assets (~50-100 EUR de tilesets)
- Necessite plus de temps de developpement
- Mais le resultat serait tres differenciant

---

## Nouvelle Approche a l'epoque: Last 30 Days pour Validation de Style (fev 2026)

Aziz proposait d'utiliser le skill Last 30 Days pour scanner les tendances YouTube
animation educative 2026 AVANT de choisir le prochain style a prototyper.

**Tests prevus (voir résultats dans `last30days-style-trends-scan-feb2026.md`, même dossier)** :
1. "YouTube educational animation style trends 2026" - quel style emerge organiquement ?
2. Dark Triad psychologie + exploration Retro Pixel - sujet propose via conversation Gemini
3. Sujet finance FR time-sensitive - "credit immobilier taux 2026 France"

**Principe**: au lieu de choisir le style par intuition, laisser les donnees trending
informer le choix. Le cross-referencing Reddit + X + Web peut reveler quel style
les audiences engagent le plus en ce moment.

**Caveat**: le style de base doit rester stable (identite de chaine). Last 30 Days
informe des micro-ajustements et du choix de SUJET, pas du changement de style fondamental.

---

## Note (2026-08-31) — issue de ce comparatif

Aucun de ces styles n'a survécu tel quel dans le projet actuel — le pivot vers Souverain/Atlas/
Mapbox/SVG maison (voir `memory/doctrines/`) est postérieur à cette exploration et répond à un
tout autre sujet (géopolitique africaine, pas finance FR générique). Ce fichier reste une trace
utile de méthode (comparatif structuré, décomposition en sous-styles, test avant engagement).
