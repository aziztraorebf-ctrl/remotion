# STARTER PROMPT — Sénégal Acte 3 (session ultérieure)

> Session de production Acte 3 — "LES MÉCANISMES QUI DÉCIDENT" (~2:30, 150s)
> Pré-requis : Acte 1 et 2 validés. Voir `MEMORY.md` pour l'état complet.

---

## Contexte rapide

- **Acte 1 VALIDÉ** : `out/episodes/senegal-petrole-gaz/senegal-acte1-FINAL.mp4` (42.3s) — Hook + setup
- **Acte 2 VALIDÉ** : `out/episodes/senegal-petrole-gaz/acte2-FINAL.mp4` (88.3s) — 3 champs (Sangomar/GTA/Yakaar) + verdict 60%
- **Total rendu : ~130s / ~385s estimés** → on est à 1/3 de la vidéo
- **Script source** : `memory/episodes/souverain/senegal-petrole-gaz/SCRIPT-V2.md` (lignes 79-150 = Acte 3)
- **Audio voix-off** : `public/souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3` — Acte 3 démarre à ~165s

---

## Structure Acte 3 — 4 sous-sections distinctes

### S1 — Comparatif Norvège / Congo / Botswana (~30s)
- Setup : *"Trois pays. Un seul choix différent."*
- Visuel : `SmallMultiplesGrid` 2-3 colonnes
- Norvège (1969) : fonds souverain, 1500 Mds$ aujourd'hui, 280k$/Norvégien
- Congo (~même époque) : dette, pauvreté
- Botswana (1966) : diamants, institutions
- **Punchline narrative** : *"Ce ne sont pas les ressources, ce sont les mécanismes"*

### S2 — Mécanisme 1 : Le contrat (~30s)
- Visuel : `KraftCardDocClassifie` (doc tampon "CONTESTÉ")
- Graphique : `StackedBars` (revenu brut / cost recovery Woodside / reste à partager)
- Storytelling : le 60% est une estimation, désaccord Woodside vs État
- **✅ PROTOTYPE EXISTANT** : `src/projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars.tsx`
  - Comp Remotion id : `Senegal-Proto-D3-StackedBars` (450f / 15s)
  - 4 phases narratives : Revenu brut → Cost recovery découpe → Découpe finale 3 segments → Révélation "60% annoncé → 36% réel"
  - Construit avec **D3.js utility-only** (validé 2026-05-23) — `scaleLinear`, `format`, `ticks`
  - Catbox v1 : https://files.catbox.moe/mb1skz.mp4
  - **Reste à faire** : sync audio Acte 3 (forced alignment), polir label $24M, ticks qui s'effacent en Phase 4, rectangle révélation plus impactant, ajouter KraftCardBackground si voulu

### S3 — Mécanisme 2 : Fonds souverain + dette (~40s)
- Visuel : icône coffre-fort FONSIS + `ProcessFlow` (FONSIS → valve → Budget)
- Tension : FONSIS bon, MAIS dette 70% PIB = tentation
- FMI alerte. Règles moins rigides que la Norvège.

### S4 — Mécanisme 3 : Coulisses Yakaar (~30s)
- **Reprise visuelle de l'Acte 2** — carte Mapbox zoom sur Yakaar (dot cyan déjà cohérent)
- `CoinFlip` : face Européens (scénario A) / pile Chinois (scénario B)
- Tension géopolitique : Europe se retire, Chine regarde

---

## Mécaniques narratives — élargir la palette (sans interdire la réutilisation)

> Aziz validé 2026-05-23 : **on peut réutiliser un pattern si ça sert la scène et qu'il reste premium. Pas d'interdiction absolue. Une variation d'un pattern existant est valide. Le but est d'expliquer la scène — pas de réinventer la roue à chaque acte.** Les plus grandes chaînes réutilisent volontairement.

### Patterns déjà disponibles (Acte 1+2) — peuvent être réutilisés si justifiés
- Dots gold pulsants (pour marqueurs géographiques importants)
- Labels border gold style SANGOMAR (idéal pour entités nommées sur carte)
- Arcs Europe/Asie (idéal pour flux/exports)
- Donut SVG animé (idéal pour pourcentages comparatifs)
- Pull Back Reveal (idéal pour changement d'échelle narrative)
- Whip pan 60f (idéal pour transition entre lieux)
- Architecture "1 seule Map continue" (idéale pour multi-lieux liés)

→ **Règle** : si le pattern explique mieux la scène que toute alternative, l'utiliser. Sinon proposer une variation (couleur, géométrie, timing) ou une mécanique différente.

### Nouvelles mécaniques à considérer pour Acte 3 (à valider scène par scène)
1. **Carte choroplèthe Mapbox** — pays colorés selon une variable. Bon candidat pour S1 (comparatif 3 pays).
   - Pattern : `setPaintProperty` sur `fill-color` avec expression Mapbox basée sur ISO country code
   - Réf doc : `memory/tools/mapbox-mcp.md` + skills `mapbox-data-visualization-patterns`
2. **Mouvements de caméra Mapbox additionnels** au-delà des 7 déjà validés :
   - Globe rotation 3D (passer à `projection: globe` ponctuellement pour effet de scale planétaire)
   - Focus pull (zoom rapide sur 1 pays + flou sur le reste)
   - Parallax pan (panner avec overlay qui bouge moins vite)
3. **Personnages / silhouettes éditoriales** — Aziz a évoqué "des gens, voire des voiles" :
   - Gemini i2i pour silhouettes éditoriales (politicien, signature contrat, manifestation)
   - Icons abstraites style "person" pour acteurs institutionnels (assembly, government, FMI)
4. **Voiles / textures atmosphériques** — couches CSS animées :
   - Texture papier kraft (`KraftCardBackground.tsx` déjà disponible, non utilisé en Acte 2)
   - Smoke/fog overlays animés
   - Grain photographique mobile (cinematic noise)
5. **Animation de données chiffrées** — Acte 3 est très data-driven :
   - Compteurs countUp synchronisés (1500 Mds$, 280k$, 70% dette)
   - Timeline horizontale 1966-2024 avec marqueurs
   - Comparaison side-by-side avec barres animées qui se construisent en parallèle

---

## Stack technique disponible (À ENVOYER À GEMINI dans tout breakdown — À NE JAMAIS OUBLIER)

> **Règle absolue** : avant tout breakdown Gemini ou toute proposition de mécanique visuelle, Claude DOIT connaître et considérer TOUS les outils ci-dessous. Ne jamais limiter Gemini à "Remotion + SVG" — il faut lui dire explicitement les outils à sa disposition pour qu'il propose la meilleure mécanique.

### Stack principale (Remotion + extensions natives)
- **Remotion** — framework principal, React/TypeScript, render headless via `render-mapbox.sh`
- **Mapbox GL JS** — cartes interactives, frame-driven via `useCurrentFrame` + `interpolate` + `map.jumpTo()` (jamais `flyTo`/`easeTo`)
- **@remotion/three** — Three.js intégré pour 3D (globe terrestre, objets 3D)
- **@remotion/lottie** — animations Lottie importées (After Effects / Rive)
- **@remotion/paths** — animations SVG path
- **@remotion/shapes** — formes SVG
- **Tailwind CSS** — tokens Souverain (`text-gold`, `text-ivory`, `bg-navy`, `text-stat-lg`, `text-entity`)

### Data-viz (NOUVEAU — validé 2026-05-23)
- **D3.js** ✅ — utility-only (calculs, scales, formatters). Rendu en SVG/React, animations Remotion.
  - Modules installés : `d3-scale`, `d3-array`, `d3-format`, `d3-geo`
  - Usage : `scaleLinear`, `scaleBand`, `scaleOrdinal`, `ticks()`, `format("$,.0f")`, `extent()`, etc.
  - **Pour Gemini** : "D3.js disponible pour les graphiques data-driven (StackedBars, ProcessFlow, comparaisons multi-pays, axes, échelles). Utiliser D3 pour les calculs, SVG/React pour le rendu, Remotion pour l'animation."
  - Référence : `src/projects/souverain/senegal-petrole-gaz/prototypes/PrototypeD3StackedBars.tsx`

### Génération assets (avant render)
- **Gemini 3.1-flash-image-preview** — génération/édition image
- **Gemini 3.1-pro-preview** — vision/breakdown JSON
- **Recraft** — SVG, vivid_shapes
- **Seedance / Kling** — clips vidéo
- **PixelLab** — characters, animations, tilesets, isometric tiles
- **ElevenLabs V3** — TTS voix-off (voix GéoAfrique V2)
- **Minimax 2.6** — musique de fond
- **Whisper** — forced alignment word-level (pour timing audio précis)

### Composants Souverain réutilisables
- **SplitScreenSouverain** — layout 50/50
- **BrutalHookSplit** — hook 5s
- **PulseNumber** — nombre animé
- **SurfaceComparison** — comparaison surfaces géo
- **MapboxBase** + `applyGeoAfriqueV5` — style carte Souverain
- **Animations presets** : `src/projects/_shared/animations.ts` (fadeIn, popIn, gentleReveal, countUp, drawPath, etc.)
- **Lucide-react** — icônes (`import { Icon } from "lucide-react"`)

### Outils EXPLICITEMENT ÉCARTÉS (ne pas re-proposer à Gemini ou Aziz)
- Motion Canvas (pas de Mapbox, projet stagnant)
- Revideo (Python, perd l'écosystème React)
- Shotstack / Creatomate (DSL JSON, pas de composants custom)
- Theatre.js (à reconsidérer SI projet 3D dédié)
- Framer Motion (interdit dans le projet)

→ **Détails complets** : `memory/DOCTRINE-SOUVERAIN.md` section 9 "Stack — Outils évalués".

---

## Approche recommandée pour démarrer la session

**Option recommandée — démarrer petit, valider grammaire :**

1. **Forced alignment** d'abord — extraire les frames exactes Acte 3 depuis `narration-v1-clean.mp3` via Whisper word-level
2. **S1 seul (comparatif 3 pays)** — c'est la sous-section la plus innovante (jamais codée pour Souverain). Valider le pattern visuel avant d'investir dans S2-S3-S4.
3. Pour S1 : décider entre :
   - **Option A — Carte mondiale choroplèthe** (3 pays colorés différemment + zoom progressif sur chacun)
   - **Option B — Split-screen 3 colonnes** (Norvège / Congo / Botswana avec mini-graphiques)
   - **Option C — Carrousel séquentiel** (zoom successif sur chaque pays avec sa stat)
   - Demander à Aziz son préféré AVEC PREVIEW ASCII avant de coder
4. Une fois S1 validé → coder S2/S3/S4 en parallèle ou séquentiellement

---

## Assets à préparer AVANT la session

- [ ] Forced alignment Whisper sur la tranche Acte 3 (~165s à ~315s de l'audio voix-off)
- [ ] Décider si on génère des assets Gemini (silhouettes, documents, drapeaux Norvège/Congo/Botswana)
- [ ] Vérifier si `KraftCardBackground.tsx` (composant non utilisé encore) est exploitable pour les Mécanismes 1-2
- [ ] Vérifier disponibilité données GeoJSON pour Norvège / Congo / Botswana (probablement déjà dans country-boundaries-v1 Mapbox)

---

## Backlog SFX (déjà consigné)

Voir `memory/episodes/souverain/senegal-petrole-gaz/CORRECTIONS-MINEURES.md` — section "Backlog SFX". À intégrer AVANT assemblage 4 actes final, pas à chaque session de beat.

---

## Référence visuelle premium à imiter

- **Caspian Report** : transitions entre concepts, infographies superposées sur carte
- **Johnny Harris** : split-screen documentaire, archives visuelles avec grain
- **PolyMatter** : comparaisons multi-pays via barres animées, choropleth animée
- Voir `memory/audit-templates-16-9.md` pour benchmark complet 7 vidéos doc

---

**Pour démarrer la session Acte 3, coller cette ligne :**

> Production Acte 3 Sénégal Pétrole & Gaz. Lis `memory/STARTER-PROMPT-senegal-acte3.md` puis propose-moi l'approche pour S1 (comparatif Norvège/Congo/Botswana) avec un preview ASCII des options avant de coder.
