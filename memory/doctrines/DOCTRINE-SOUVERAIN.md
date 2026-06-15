# DOCTRINE SOUVERAIN — Décisions durables (NON-NEGOTIABLE)

> **À lire OBLIGATOIREMENT avant tout code Souverain.**
> Ce fichier consolide les décisions techniques, éditoriales et de processus prises au fil des sessions Souverain (Or Africain, Sénégal Pétrole & Gaz, etc.). Elles s'appliquent à TOUTES les vidéos style Souverain — pas seulement Sénégal.
>
> **Mis à jour** : 2026-05-27 (session Templates Shorts + Angle Macro)
> **Référencé depuis** : `CLAUDE.md` (section "DOCTRINE SOUVERAIN")
>
> **Ne pas dupliquer ce contenu dans d'autres fichiers `memory/feedback_*.md`.** Tout ce qui est durable et applicable à Souverain doit être ici, ou ajouté ici quand validé.
>
> **Extensions Shorts (2026-05-27) :**
> - **Angle Macro** (audit obligatoire avant tout script Souverain) → [`ANGLE-MACRO-SOUVERAIN.md`](ANGLE-MACRO-SOUVERAIN.md). Question d'audit : « Pourquoi un viewer à Montréal/Paris/Tokyo cliquerait sur ce sujet ? »
> - **3 Templates Shorts** (planning visuel — A Géographe Mapbox / B Hybride Or Africain / C Analyste pure data) → [`out/SHOWCASES/templates-souverain/README.md`](../out/SHOWCASES/templates-souverain/README.md). Vocabulaire flexible, pas structure fixe.

---

## 1. PRINCIPE FONDAMENTAL — Premium d'abord, contraintes ensuite

> **La règle la plus importante.** Issue de la session Sénégal Acte 2 (2026-05-23).

Quand on a le choix entre deux solutions :
- ⛔ **NE PAS** choisir la solution facile/rapide juste pour rendre vite
- ✅ **TOUJOURS** viser la solution premium dès le départ
- ✅ Si la solution premium ne fit pas exactement dans les contraintes (timing, géométrie, perf), **adapter la solution premium** au lieu de retomber sur la solution facile

**Exemples validés cette session :**
- Pull Back Reveal au lieu d'un cut entre Beat6 et Beat7 → cinématographique, garde l'attention
- Donut SVG animé 9s au lieu de barre simple 3s → laisse respirer la voix-off, plus impactant
- Architecture "1 seule Map continue" au lieu de Sequence par beat → zéro coupure, mouvements caméra continus
- Micro-mouvements caméra constants (drift, parallax) au lieu de plans statiques → vie permanente à l'écran

**Anti-pattern à proscrire** : "Je rends d'abord en version simple, on améliorera après." → en pratique, on n'améliore jamais après et la version simple finit en FINAL.

---

## 2. RÉUTILISATION DE PATTERNS — Pas d'interdiction, principe de pertinence

> Issue de la session Sénégal Acte 2 (2026-05-23).

**Règle** : un pattern visuel/narratif déjà utilisé dans un acte précédent **peut** être réutilisé dans un acte suivant si :
1. Il explique mieux la scène que toute alternative
2. Il reste en version premium (pas de raccourci ou dégradation)
3. À défaut, une **variation** (couleur, géométrie, timing, échelle) est valide

**Les plus grandes chaînes documentaires réutilisent volontairement leurs patterns** — c'est ce qui crée le langage visuel d'une série. La cohérence est une force, pas une faiblesse.

**Patterns Souverain disponibles** (catalogue vivant) :
- **Dots gold pulsants** — marqueurs géographiques importants
- **Labels border gold (style SANGOMAR)** — entités nommées sur carte
- **Arcs dessinés** (Europe/Asie pattern) — flux/exports/connexions
- **Donut SVG animé** — pourcentages comparatifs
- **Pull Back Reveal** — changement d'échelle narrative
- **Whip pan 60f** — transition entre lieux
- **Architecture "1 seule Map continue"** — multi-lieux liés sans cut
- **Mouvements caméra Mapbox** : Crane Down, Dolly In, Orbit, Pull Back Reveal, Whip Pan, Counter-rotation, Tilt

→ Si aucun ne sert la scène, alors inventer une nouvelle mécanique.

---

## 3. MAPBOX — Patterns techniques validés (NON-NEGOTIABLE)

### 3.1 Frame-driven camera obligatoire
```ts
// PATTERN OK (headless-compatible)
useEffect(() => {
  const f = useCurrentFrame();
  const zoom    = interpolate(f, [0, 100], [3, 5], { extrapolateRight: "clamp" });
  const bearing = interpolate(f, [0, 100], [0, -15]);
  map.jumpTo({ center: [lon, lat], zoom, bearing, pitch });
});

// PATTERN INTERDIT (timers async incompatibles headless)
map.flyTo({ ... });  // ⛔
map.easeTo({ ... }); // ⛔
```

### 3.2 Projection
- **Mercator obligatoire en headless** — `setProjection("mercator")` après style.load
- Globe = artefacts en headless. Si effet "scale planétaire" voulu, le faire en composition séparée ou via overlay SVG.

### 3.3 Ancrage des overlays
- **Toujours** ancrer dots/labels via `map.project(lngLat)` sur coordonnées géographiques réelles
- **Jamais** de positions x/y hardcodées
- Mettre à jour les positions via `useState` à chaque frame après `map.jumpTo()`

### 3.4 Mouvements caméra cinématiques (vocabulaire validé)
| Mouvement | Description | Frames typiques |
|-----------|-------------|-----------------|
| Crane Down | pitch 0→45° | 100-200f |
| Dolly In | zoom progressif | 100-300f |
| Orbit | bearing rotatif lent | 200-600f |
| Pull Back Reveal | zoom out rapide 7→3 | **60f** |
| Whip Pan | translation rapide + blur | **60f** |
| Counter-rotation | bearing s'inverse | 60-90f |
| Tilt | pitch progressif | 100-300f |

**Règle 60f** : whip pans et pull back reveal = 60 frames actives. Au-delà ça mollit. En deçà ça saccade. Si le segment a plus de temps disponible (ex 108f), faire 60f actives + 48f de settle doux.

### 3.5 Blur CSS pendant transitions rapides
- Pic 12-16px à mi-course (f30 sur un whip de 60f)
- Dissipé avant la fin de la fenêtre
- Bénéfices : cache le rechargement des tuiles + effet cinématographique authentique

### 3.6 Architecture "1 seule Map continue"
- **Quand l'utiliser** : multi-lieux narrativement liés (3 champs offshore, 3 pays comparés, etc.)
- **Pattern** : 1 seul `<div ref={containerRef} />`, 1 seule `new mapboxgl.Map(...)`, camera engine unifié dans `useEffect()`, overlays conditionnels par phase
- **Référence code** : `src/projects/souverain/senegal-petrole-gaz/SenegalActe2Continu.tsx`
- **Quotas** : 1 map load par render de composition (pas par frame). Plan gratuit = 50 000/mois. Aucun risque dans notre usage.

### 3.7 Camera Brief — OBLIGATOIRE avant getCam() (validé 2026-06-01)

**Problème récurrent** : Claude écrit `getCam()` sans validation préalable → surprise au render → refaire le travail.

**Règle** : avant d'écrire une ligne de `getCam()`, produire ce tableau et attendre la validation d'Aziz :

```
| Acte | Mouvement           | Depuis → Vers          | Zoom début→fin | Durée | Blur |
|------|---------------------|------------------------|----------------|-------|------|
| A1   | Zoom+Freeze         | Atlantique → Kénitra   | 4.2 → 7.0      | 8s    | non  |
| A2   | Whip Pan 60f        | Kénitra → Ouarzazate   | 7 → 9          | 7s    | oui  |
| A3   | Orbit lent 90°      | autour Tanger Med      | 8 → 8          | 10s   | non  |
| A4   | Pull Back Reveal    | Kénitra → Maroc entier | 9 → 4          | 6s    | non  |
| A5   | Statique            | Kénitra fixe           | 8              | 8s    | non  |
| A6   | Pull Back Planétaire| Maroc → globe          | 4 → 2          | 10s   | non  |
```

Vocabulaire : Camera Lab v2 (https://files.catbox.moe/v0v4e6.mp4) — 12 mouvements validés headless.
Animatic optionnel : `bash scripts/render-mapbox.sh <Id> /tmp/anim.mp4 --frames A-B --scale 0.25` (10s, voir voyage avant overlays).

### 3.8 Checklist Mapbox-in-Beat (préflight obligatoire)
Avant de render un beat avec Mapbox, vérifier :
1. **Watermark masqué** : importer et placer `<MapboxBrandingHide />` (composant partagé `src/projects/_shared/mapbox/MapboxBase.tsx`) en premier enfant du `<AbsoluteFill>` racine. NE PAS inliner le `<style>` (anti-duplication). Attribution = description vidéo YouTube/TikTok. Voir [feedback_mapbox-branding-hide-pattern.md](../../../.claude/projects/-Users-clawdbot-Workspace-remotion/memory/feedback_mapbox-branding-hide-pattern.md).
2. **Style** : `MAPBOX_STYLES.dark` (jamais `satellite-v9` en headless — tuiles trop lentes)
3. **Pas de `delayRender`** : useEffect simple, retour cleanup `map.remove()`
4. **Audio en boucle si `startFrom` tardif** : si `startFrom_sec > durée_piste - durée_beat`, doubler `<Audio src=...startFrom={0} volume={interpolate(frame,[loop_start,loop_start+20],[0,vol])}/>` au-delà du point de fin. Exemple Beat13 : piste 321s, `startFrom=8851` (295s) → 26s dispo, beat 49s → loop à f780.
5. **Render via `scripts/render-mapbox.sh`** (jamais `remotion render` direct — chrome-headless-shell + slim public-dir nécessaires)

### 3.9 FlagFill — Carte colorée = RÈGLE N°1 (validé 2026-06-02, NON-NEGOTIABLE)
**Une carte Mapbox DOIT être colorée dès le départ.** Le gris/vide n'est pas un style, c'est un vide qu'on ne remplit pas. La technique reine : projeter drapeaux/couleurs dans les silhouettes de pays (fill-pattern canvas + fill-color filtré par ISO).
- **Drapeaux locaux uniquement** : `public/_shared/flags/` via `staticFile()`. JAMAIS de fetch `flagcdn.com` (échoue en headless). Pays principal = canvas pur sans fetch (dispo à f0).
- **Dots par-dessus les fills** : ajouter les `circle` layers EN DERNIER dans `style.load`. Pour les dots critiques sur fond de drapeau, utiliser `div` CSS via `map.project()` (les circle Mapbox se cachent sous fill-pattern).
- **2 templates validés** : Focus-Un-Pays (1 drapeau + couleurs unies) et Multi-Pays (tous drapeaux). Voir [feedback_flagfill-templates-decouverte.md](feedback_flagfill-templates-decouverte.md).

### 3.10 Recherche templates AVANT code (validé 2026-06-02, NON-NEGOTIABLE)
Avant d'écrire une ligne de code pour un beat, Claude scanne les catalogues (`INDEX-DES-INDEX.md` → `CATALOGUE-CARTE-VIVANTE.md` + `COMPOSANTS-INDEX.md`) et présente à Aziz ce qui existe déjà. Aziz ne peut pas mémoriser 70+ composants — Claude le peut en une fraction de seconde. Ne JAMAIS coder un effet custom sans vérifier l'existant. Voir [feedback_recherche-templates-obligatoire.md](feedback_recherche-templates-obligatoire.md). (Leçon : 18 versions Beat 1 Maroc car FlagFill pas cherché au départ.)

---

## 4. STORYBOARD & BREAKDOWN

### 4.1 Source de vérité = breakdown JSON Gemini
- Avant d'écrire UNE ligne de code de beat : breakdown via `scripts/beat-session.py --phase breakdown`
- Le storyboard `.md` découle du JSON, pas l'inverse
- Le manifest technique découle du JSON, pas l'inverse

### 4.2 Validation Aziz AVANT tout appel API payant
- Tout prompt Gemini/Recraft/Seedance/Kling → montrer à Aziz, attendre validation explicite
- Format : "Voici le prompt que je vais envoyer à [outil] : [prompt complet]. Je lance ?"
- Ne JAMAIS générer sans validation → coûteux + souvent à refaire

### 4.3 Matière finale avant code définitif
- Pour les assets visuels (Gemini, Seedance, PixelLab) : générer la matière finale AVANT de coder le placement/animations
- L'esthétique réelle change tout (couleurs dominantes, équilibre composition, vide négatif)
- Exception : prototype rapide pour valider mécanique d'animation → placeholders OK

---

## 5. GRAPHISME PREMIUM

### 5.1 Équilibre du layout
- Aucun élément ne doit écraser les autres
- Exemple : Beat9 v1-v2 → "60%" géant à fontSize 620 → écrasait le reste. v3-v5 → donut équilibré + texte droite = lisible.
- Toujours vérifier : si on enlève 1 élément, le layout reste-t-il équilibré ?

### 5.2 Timing respiratoire
- Animations qui prennent le temps de respirer avec la voix-off
- Exemple : arc donut 9s au lieu de 3s (Beat9 v4→v5) — laisse parler la narration
- Règle empirique : si une animation finit avant la fin de la phrase narrative correspondante, elle est trop rapide

### 5.3 Fond
- Fond Souverain par défaut : `#16213a` (bleu nuit lisible) — pas `#0d1525` (quasi-noir, manque de contraste)
- Validé Beat9 v4→v5 (2026-05-23)

### 5.4 Tokens Tailwind (existants)
- `text-gold` (#c8a951), `text-ivory` (#f2ebd9), `bg-navy`, `text-stat-lg`, `text-entity`
- Voir `tailwind.config.ts`. Framer Motion INTERDIT. SplitScreenSouverain.tsx = composant default.

---

## 6. SFX

- Backlog SFX consigné par épisode dans `memory/episodes/souverain/<episode>/CORRECTIONS-MINEURES.md`
- **À intégrer AVANT assemblage final** des 4 actes, pas pendant la production beat-par-beat
- Volume mix recommandé (RÉVISÉ 2026-06-03 — Aziz : "je dois toujours monter le son") :
  - Voix-off : 1.0
  - **SFX : PLANCHER 0.50 — JAMAIS en dessous.** Tous les SFX (ping, tick, snap, whoosh, swoosh, drone) à 0.50 minimum. Peut monter à 0.60 sur les gros moments cinématiques (swoosh caméra qui descend/monte, impact). L'ancienne fourchette UI 0.25-0.35 était trop basse → SFX inaudibles. Référence validée : volume où Aziz entend chaque SFX même sur haut-parleur sans monter le son.
  - Musique de fond : 0.12-0.15 (baisser si elle masque les SFX)

---

## 7. WORKFLOW — Hygiène out/

Rappel CLAUDE.md (déjà documenté ailleurs, repris ici pour exhaustivité Souverain) :
- `wip/` = renders de travail (purger en fin de session)
- `versions/` = candidats présentés à Aziz (purger après validation)
- `<beat>-FINAL.mp4` à la racine = validé, ne bouge plus
- `out/PRET-PUBLICATION/<episode>-FINAL.mp4` = livrable épisode complet

---

## 8. PATTERNS À CONSULTER EN COMPLÉMENT

| Si Aziz parle de... | Lire en complément... |
|----|----|
| Beat Mapbox Souverain | `memory/feedback_mapbox-souverain-blueprint.md` |
| Render Mapbox | `memory/feedback_mapbox-render-pattern-canonique.md` (utiliser `scripts/render-mapbox.sh`) |
| Tailwind Souverain | `memory/feedback_tailwind-remotion-setup.md` |
| Gemini storyboard / breakdown | `memory/workflow-gemini-breakdown-schema.md` |
| Audit templates 16:9 | `memory/audit-templates-16-9.md` (benchmark Caspian/JH/Vox/PolyMatter) |
| Pipeline beat 6 phases | `memory/rules-beat-production.md` |
| TTS français ElevenLabs | `memory/tools/elevenlabs.md` + section CLAUDE.md |

---

## 9. STACK — Outils évalués et retenus / écartés

> Évalué 2026-05-23 (session Sénégal Acte 2 fin de session, recherche alternatives Remotion).

### Stack principale (retenue)
- **Remotion** — framework principal, ne pas remplacer. Mature, CLI headless mature (`render-mapbox.sh`), Mapbox WebGL natif, écosystème React complet, support `@remotion/three`, `@remotion/lottie`, `@remotion/paths`.

### Outils complémentaires retenus (à intégrer dans Remotion)
- **D3.js** — ✅ **VALIDÉ 2026-05-23** via prototype `PrototypeD3StackedBars`. Pattern : D3 utility-only (calculs via `scaleLinear`, `ticks()`, `format()`) + rendu SVG/React + animations Remotion (`interpolate`, `spring`). Modules installés : `d3-scale`, `d3-array`, `d3-format`, `d3-geo`. Standard de facto data-viz (Bloomberg, NYT, FT).
  - **Pattern obligatoire** : `scaleLinear().domain([min, max]).range([0, pxWidth])` puis ancrer les SVG via `scale(value)` — JAMAIS hardcoder les positions
  - **Anti-pattern** : laisser D3 manipuler le DOM (`.append()`, `.selectAll()`) → conflits avec React reconciler. Toujours rendre en JSX classique.
  - **Référence** : `src/projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars.tsx`
- **visx** (Airbnb) — wrapper React de D3 si on veut éviter D3 brut. À considérer pour graphiques plus complexes (axes générés auto, légendes). Non encore testé.
- **@remotion/three** — pour 3D premium (globe terrestre, plateformes offshore 3D). Intégré nativement à notre stack.
- **@remotion/lottie** — pour micro-animations très polies exportées depuis After Effects/Rive.

### Outils explicitement ÉCARTÉS (et pourquoi — pour éviter de re-évaluer)

| Outil | Raison écarté | Date |
|-------|---------------|------|
| **Motion Canvas** | (1) Pas de Mapbox WebGL — bloque 90% Acte 2+. (2) Pas de Tailwind/DOM — réécriture totale composants Souverain. (3) Projet stagnant : dernière release v3.17.2 décembre 2024, 17 mois sans update au 2026-05. (4) Paradigme générateurs `yield*` impératif vs React déclaratif — casse nos patterns. (5) CLI headless secondaire (workflow primaire = éditeur navigateur). | 2026-05-23 |
| **Revideo** | Stack Python, perd tout l'écosystème React/composants Souverain. Cible : génération massive Shorts auto, pas vidéos premium. | 2026-05-23 |
| **Shotstack / Creatomate** | API Cloud par JSON DSL, impossible composants custom (SplitScreenSouverain, MapboxBase, donut SVG). Cible : 10k+ vidéos templating, pas notre cas. | 2026-05-23 |
| **Theatre.js** | Pertinent uniquement si projet 3D dédié. Pour Souverain 2D : pas de gain vs Remotion. À reconsidérer si on attaque une scène 3D ambitieuse. | 2026-05-23 |

### À retester si signal fort

- **Theatre.js** : si on attaque une scène 3D ambitieuse (globe rotation, modèle 3D plateforme offshore). Le studio visuel intégré pourrait débloquer des choses qu'on n'arrive pas à faire en code pur.
- **Rive** : pour micro-animations vectorielles importables (transitions logos/icônes complexes).

---

## 10. HISTORIQUE DES AJOUTS À CETTE DOCTRINE

| Date | Session | Décisions ajoutées |
|------|---------|--------------------|
| 2026-05-23 | Sénégal Acte 2 | Sections 1, 2, 3 (Mapbox patterns), 5.1-5.3 (graphisme), 6 (SFX) |
| 2026-05-23 | Sénégal Acte 2 (fin session) | Section 9 (Stack — outils évalués) : Motion Canvas / Revideo / Shotstack / Theatre.js écartés ; D3.js / visx / @remotion/three / @remotion/lottie retenus comme compléments à tester pour Acte 3 |
| 2026-05-23 | Test D3.js | D3 utility-only **VALIDÉ** via `PrototypeD3StackedBars` (Mécanisme 1 Acte 3). Modules installés. Pattern documenté. Prêt à utiliser pour Acte 3. |
