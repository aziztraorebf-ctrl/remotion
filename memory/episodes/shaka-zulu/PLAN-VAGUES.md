# Atlas Shaka Zulu — Plan d'execution par vagues

> Decision Aziz 2026-05-02 : construction par vagues pour eviter empilement d'effets non valides.
> Chaque vague est validee visuellement (mini-render) avant la suivante.

---

## VAGUE 1 — Fondation solide (must-have)

Tout ce qui constitue le squelette narratif et visuel principal. Sans ca, la video ne fonctionne pas.

### Assets a generer

- [ ] **Iklwa** (PixelLab create_map_object, view side) → `inserts/pixellab/iklwa-side.png`
- [ ] **Iklwa** (Gemini parchemin militaire) → `inserts/gemini/iklwa-parchemin.png`
- [ ] **Bouclier** (PixelLab create_map_object, view front) → `inserts/pixellab/bouclier-front.png`
- [ ] **Bouclier** (Gemini parchemin militaire) → `inserts/gemini/bouclier-parchemin.png`
- [ ] **Hook Shaka** : tester PixelLab breathing-idle full-screen ET Seedance papercraft 5s en parallele
- [ ] **Musique de fond** Minimax — isicathamiya OU ingoma (test 2 variants)

### Composants Remotion

- [ ] `AtlasShakaHook.tsx` — plein ecran Shaka + 2 lignes texte
- [ ] `AtlasShakaS1Geo.tsx` — globe ortho zoom + insert "1 500"
- [ ] `AtlasShakaS2A1Iklwa.tsx` — plein ecran iklwa + frappe descendante (rotateZ -45deg)
- [ ] `AtlasShakaS2A2Bouclier.tsx` — plein ecran bouclier + boucle 4 rotations crochet
- [ ] `AtlasShakaS2A3Cornes.tsx` — carte plein ecran + warriors marchant via bezier paths
- [ ] `AtlasShakaS2A4Synthese.tsx` — Gqokli + flash 90% + triple-screen synthese 9s
- [ ] `AtlasShakaS3Expansion.tsx` — territoire grandit + bar chart
- [ ] `AtlasShakaS4Nandi.tsx` — bascule palette or->bordeaux + compteur 4000 spring lourd
- [ ] `AtlasShakaS5CTA.tsx` — cascade Napoleon/Alexandre/Shaka + carte Afrique
- [ ] `AtlasShakaFull.tsx` — composition principale qui assemble tout

### Helpers/utilites

- [ ] `helpers/cameraShake.ts` (reutiliser Sonjata)
- [ ] `helpers/spritePlayer.ts` — player walk cycle PixelLab
- [ ] `helpers/geoSprite.ts` — wrapper d3-geo → coordonnees CSS pour positionner sprites sur carte
- [ ] `helpers/paletteTransition.ts` — interpolation HSL or→bordeaux

### Mini-renders validation (ordre)

1. Hook seul (5s)
2. S2 A1+A2 (iklwa + bouclier plein ecran) — valider lisibilite
3. S2 A3 cornes + warriors — valider concept "warriors qui marchent"
4. S2 A4 triple-screen synthese — valider que ca fait sens
5. S4 compteur 4000 spring lourd — valider impact emotionnel

Chaque mini-render doit etre uploade Vercel Blob et URL fournie a Aziz.

---

## VAGUE 2 — Enrichissement visuel (apres validation vague 1)

Ajouts qui transforment "fonctionnel" en "memorable". Activer apres mini-renders vague 1 valides.

### Assets a generer

- [ ] **Nandi spectre** (PixelLab create_character) — femme age mur, tenue Zulu, breathing-idle
- [ ] Tester `vary_object` PixelLab pour variantes iklwa/bouclier si besoin diversite

### Composants/effets a coder

- [ ] **Fracture carte** (Kimi Q4) — `components/CrackMap.tsx`
  - PROTOTYPE D'ABORD : test d3.interpolate sur 2 paths SVG simples
  - Si artefacts → fallback : zoom kraal + brightness drop (variante Kimi)
- [ ] **Nandi spectre apparition** (Kimi Q2) — sprite blend mode "screen", opacity peak 0.5
- [ ] **Parallaxe 3 couches carte** (Kimi Q1) — `components/ParallaxMap.tsx`
- [ ] **Pattern hatch derive** — rotation 0.05deg/frame sur fills territoires

### Activation manifest

```ts
// Dans shaka-manifest.ts, passer enabled: true sur :
S4_NANDI_MANIFEST.fractureCarte.enabled = true;
S4_NANDI_MANIFEST.nandiSpectre.enabled = true;
MAP_PARALLAX.enabled = true;
MAP_PATTERN_DRIFT.enabled = true;
```

---

## VAGUE 3 — Polish final (si temps disponible avant render final)

Micro-ameliorations qui font passer de "memorable" a "professionnel". Optionnel.

### A coder

- [ ] **Pulsations radar Gqokli Hill** (Kimi Q1) — cercles SVG stroke-dashoffset anime
- [ ] **Date 22 sept 1828 calligraphie** (Kimi Q5) — stroke animation + cut noir 2s
- [ ] **Barre de vie RPG S1** "deux fois debout" (Kimi Q5) — 2 coeurs pixel art
- [ ] **Tremblement camera** sur noms Napoleon/Alexandre/Shaka S5

### Activation manifest

```ts
S1_MICRO_INTERRUPTS.enabled = true;
S4_NANDI_MANIFEST.dateAssassinat.enabled = true;
```

---

## DECISIONS A PRENDRE EN COURS DE VAGUE 1

1. **Inserts S2** : PixelLab vs Gemini parchemin → Aziz choisit apres voir les 2
2. **Hook** : PixelLab Shaka full-screen vs Seedance papercraft 5s → Aziz choisit
3. **Musique** : isicathamiya (chant a cappella) vs ingoma (percussions) → Aziz choisit

---

## REGLE DE TRANSITION ENTRE VAGUES

Avant de passer de vague N a vague N+1 :
- Tous les items must-have de vague N sont validates par mini-render
- Aziz a vu et approuve les choix design en cours (inserts/hook/musique)
- Aucun blocker technique non resolu
- Le manifest reflete l'etat reel du code (pas de promesses non tenues)

Si vague N revele un probleme structurel → pause vague 1, on revoit le manifest avant de continuer.
