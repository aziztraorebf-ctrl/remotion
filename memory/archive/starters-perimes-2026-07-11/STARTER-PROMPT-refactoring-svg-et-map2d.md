# STARTER — Refactoring SVG production-ready + Test carte 2D flat (d3-geo)

> Session du 2026-07-02 : grammaire visuelle SVG COMPLETE (4 registres valides).
> Aziz a demande ce starter pour la prochaine session. 2 chantiers dans l'ordre.

---

## CHANTIER 1 — Refactoring SVG via agents (prioritaire)

L'audit SVG de 3 agents (2026-07-02) a identifie 5 axes de refactoring. Lancer des agents Sonnet en worktree pour executer.

### 1A. Deplacer GeminiRig dans `_shared/`
- **Probleme** : `GeminiRig` (rig FK Gemini, canonical) est dans `_rnd/svg-scenes/ProtoGeminiPoseBankWalk.tsx` — un proto jetable. 12+ fichiers l'importent depuis la.
- **Action** : creer `src/projects/_shared/personnage-vivant-svg/rig/GeminiRig.tsx`, y deplacer les exports (`GeminiRig`, `LimbAngles`, `FaceExpression`, `FaceView`, poses `WALK_A`, `WALK_B`, `IDLE`). Mettre a jour TOUS les imports. Garder un re-export temporaire dans le proto pour ne rien casser.
- **Test** : `npx remotion studio` doit demarrer sans erreur.

### 1B. Deduplication des composants data-viz
- **GridBackground** : duplique dans `ProtoDataVizPleinEcran.tsx` et `ProtoNarratifPlusData.tsx` — extraire dans `src/projects/_shared/components/GridBackground.tsx`.
- **DonutChart** : triple dans `ProtoDataVizEncre` (InkDonutChart), `ProtoDataVizPleinEcran` (DonutFull), `ProtoNarratifPlusData` (DonutScene) — unifier dans `src/projects/_shared/components/InkDonutChart.tsx` (parametrique : cx, cy, r, segments, frame, fps).
- **BarChart** : duplique dans `ProtoDataVizEncre` (InkBarChart) et `ProtoDataVizPleinEcran` (BarChartFull) — unifier dans `src/projects/_shared/components/InkBarChart.tsx`.
- **CounterEncre** : duplique similaire — unifier.

### 1C. Harmoniser la palette
- **Probleme** : `BG="#16213a"` (narratif) vs `BG="#0f1a2e"` (data-viz) vs variantes. PARCH_DIM varie (`#d4c9a8` vs `#b0a58a`).
- **Action** : creer `src/projects/_shared/svg-library/palette.ts` avec les constantes nommees :
  ```
  NARRATIVE_BG, DATAVIZ_BG, GRID_COLOR, INK, PARCH, PARCH_DIM
  ```
  Mettre a jour tous les protos SVG pour importer depuis ce fichier.

### 1D. Archiver les vieux protos — ✅ FAIT
- **10+ fichiers** dans `_rnd/svg-scenes/` etaient des protos historiques qui dupliquent le rig avant GeminiRig (GraineGeminiAnimee, HeroGptAnimee, MineGeminiAnimee, CreusetAnimee, etc.).
- **Action** : deplaces dans `src/projects/_rnd/svg-scenes/_archive/` (exclu du `tsconfig.json`). Compositions retirees de Root.tsx. Fichiers conserves sur disque (pas supprimes) — rendus catbox associes restent la reference visuelle (voir `svg-library/RD-INDEX.md`).

### 1E. Mettre a jour la documentation
- `PERSONNAGE-VIVANT-INDEX.md` : ajouter section "Rig FK Gemini" avec chemin vers le nouveau fichier `_shared/`.
- `INTENTION-FORME-INDEX.md` : ajouter les 3 nouvelles formes validees :
  - "Presenter des donnees" → DataViz plein ecran (Vox grid)
  - "Dialoguer" → SpeechBubble + 2 persos face-a-face
  - "Montrer un ecran/interface" → DataScreen + personnage devant
- `INTENTION-FORME-SVG.md` : ajouter les techniques data-viz (spring bar grow-in, donut arc, counter roll-up).
- `COMPOSANTS-INDEX.md` : ajouter GridBackground, InkBarChart, InkDonutChart, CounterEncre, SpeechBubble, DataScreen.

### Strategie d'execution
Lancer 3 agents Sonnet en worktree :
- **Agent MOVE-RIG** : 1A (deplacer GeminiRig) — le plus risque, fait en premier
- **Agent DEDUP** : 1B + 1C (deduplication + palette) — depends du resultat de MOVE-RIG
- **Agent DOCS** : 1D + 1E (archivage + documentation) — independant

Apres merge des 3 : `npx remotion studio` pour verifier que tout compile.

---

## CHANTIER 2 — Test carte 2D flat (d3-geo SVG)

> Decision Aziz (2026-07-02) : "des cartes 2D, on pourrait utiliser tout ce que nous avons appris avec Atlas et faire des cartes modernes [...] je doute tres fortement que des cartes mapbox 3D passeraient dans ce style. Ca casse le tout."

### Objectif
Prouver qu'une carte 2D plate (projection SVG via d3-geo) s'integre dans l'esthetique encre/parchemin sans casser l'univers visuel. C'est le **4eme registre** de la video longue SVG.

### Approche
1. **Proto minimal** : `src/projects/_rnd/svg-scenes/ProtoMap2dEncre.tsx`
   - Projection `d3.geoMercator()` ou `d3.geoNaturalEarth1()` centree sur l'Afrique de l'Ouest
   - GeoJSON frontieres (Natural Earth 110m, deja dans `public/assets/` ou a telecharger)
   - Palette encre : frontieres en `INK` (#2b2117), remplissage en tons parchemin, fond `DATAVIZ_BG`
   - Grille `GridBackground` en arriere-plan (coherence avec le registre data-viz)
2. **Animation** : un pays se colorie progressivement (buvard-circulaire ou reveal clip-path)
3. **Texte** : nom du pays + chiffre-cle en Georgia serif (coherence typographique)
4. **Cross-fade** : tester transition depuis une scene narrative SVG (comme le proto narratif+data)

### Packages necessaires
- `d3-geo` (deja installe — verifier `package.json`)
- `topojson-client` (pour convertir TopoJSON → GeoJSON si besoin)
- GeoJSON Afrique de l'Ouest : `public/assets/geo/africa-west.geojson` (a creer ou telecharger)

### Criteres de succes
- La carte ne "casse pas" l'esthetique encre/parchemin (jugement Aziz)
- L'animation est frame-driven (pas de flyTo/easeTo — coherence doctrine)
- La transition depuis une scene narrative est fluide (cross-fade)
- La carte est LISIBLE (pas trop de detail — 110m suffit pour un short)

---

## Comment demarrer

Dire a Claude : **"On reprend le refactoring SVG + test carte 2D. Lis le starter `memory/STARTER-PROMPT-refactoring-svg-et-map2d.md`."**

1. Claude lit ce fichier
2. Lance les 3 agents de refactoring (chantier 1)
3. Pendant que les agents travaillent, prepare le proto carte 2D (chantier 2)
4. Valide le tout avec Aziz
