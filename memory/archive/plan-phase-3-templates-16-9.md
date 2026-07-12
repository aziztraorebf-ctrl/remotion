# Plan Phase 3 — Templates 16:9 Souverain (R&D consolidée)

> **Date** : 2026-05-21
> **Statut** : plan validé Aziz, prêt à exécuter
> **Source** : consolidation de 6 brainstorms (Kimi + Gemini 3.1-pro × 4 angles) + audit bibliothèque Phase 1
> **Verbatim brainstorms** : `memory/brainstorms/`
> **Total templates à coder** : ~40 (35 prévus + 7 personnages + 2 transitions signature)

---

## Principes directeurs (ne pas oublier en cours d'exécution)

1. **Tous transparents par défaut** — chaque nouveau template aura un prop `bgColor?: string` default `"transparent"` pour permettre composition libre (fix de l'anti-pattern OPAQUE détecté Phase 1).
2. **Render Mapbox via script obligatoire** — `./scripts/render-mapbox.sh` pour toute compo contenant `mapbox-gl` (voir `memory/feedback_mapbox-render-pattern-canonique.md`).
3. **Pattern V1 valide** — base satellite-v9 + applyAtlasRealiste3D (copy de `AtlasRealiste3DShowcase` testé en 16:9 avec `MapboxSatelliteSenegal`).
4. **Pas de transition tape-à-l'œil** — anti-pattern confirmé du benchmark 7 vidéos. Cuts francs ou crossfade subtil partout sauf dans les 2 transitions signature dédiées (Loom Wipe, Sovereign Eclipse).
5. **Promouvoir validation** — chaque template validé Aziz → FINAL.mp4 dans `out/templates-souverain/` + entrée ASSETS-INDEX + frames mid/end sur catbox + (optionnel) update dashboard.

---

## VAGUE 0 — Préparation infrastructure (déjà fait Phase 1)

- ✅ V1 MapboxSatelliteSenegal validée → `out/templates-souverain/FINAL-MapboxSatelliteSenegal-v1-16x9.mp4`
- ✅ Audit 33 templates (19 responsive / 9 partiel / 1 vertical pur)
- ✅ Audit composants opaques (17 OPAQUE identifiés)
- ✅ Benchmark 7 vidéos doc + 22 mécaniques cibles
- ✅ Dashboard live : https://onyx-monsoon-mrar.here.now/
- ✅ Mémoire indexée + leçon Mapbox sauvegardée

---

## VAGUE 1.5 — Système de composition unifié (NOUVELLE, validée 2026-05-21)

> Insertion entre Vague 1 et Vague 2 pour garantir que tous les templates des vagues suivantes héritent d'un système modulaire mix-and-match. Sans cette étape, on risque de devoir refactor 40 templates plus tard pour ajouter le mix-and-match.

### Livrables de la Vague 1.5

1. **Composant racine `<SouverainScene>`** dans `src/projects/_shared/components/SouverainScene.tsx` :
   ```tsx
   <SouverainScene
     background?: KraftBgVariant | "atlas-cosmos" | "papier-ancien" | "transparent"
     map?: { style: "geoafrique" | "caspian" | "satellite", config: MapConfig }
   >
     {/* templates posés dessus */}
   </SouverainScene>
   ```
   Le composant gère la stack de couches (background → carte optionnelle → children) et fournit un fond cohérent.

2. **3-4 backgrounds Gemini générés en amont** (assets statiques PNG/SVG, pas vidéo) :
   - `bg-papier-ancien.png` (texture parchemin/document archive)
   - `bg-plateau-awale.png` (fond plateau de jeu Awalé minimaliste pour mécanique Le Semeur)
   - `bg-cosmos-atlas3d.png` (fond noir cosmos étoilé pour data hero techy)
   - Bonus : `bg-beton-architectural.png` (texture sobre pour sujets infrastructure)

3. **Test cohabitation 3 styles Mapbox** : un fichier `_proto-16-9/MapboxStyleComparison.tsx` qui rend les 3 styles (GeoAfriqueV5 dark, CartoCaspian Sepia, SatelliteSenegal) en triptyque pour valider visuellement leur cohérence dans le mix-and-match.

4. **Décision palette Mapbox confirmée Aziz 2026-05-21** :
   - **3 styles maintenus en parallèle**, chacun pour son cas d'usage :
     - **MapboxGeoAfriqueV5** (dark signature) → vue stratégique tableau de bord, hook d'ouverture
     - **CartoCaspian** (4 palettes sepia/cream/smoke/noir) → vue éditoriale Mercator papier, sujets diplo/éco
     - **MapboxSatelliteSenegal** (V1 satellite tilted) → vue drone agence renseignement, sujets territoriaux/ressources
   - Atlas3D vertical (`AtlasRealiste3DShowcase`) reste en backlog **pour Shorts uniquement**.

**Estimation** : 2-3h total (1h composant SouverainScene + 1h génération 3-4 backgrounds Gemini + 30 min test triptyque Mapbox).

---

## VAGUE 1 — Refactor 17 composants OPAQUE → COMPOSABLE (no-risk)

**Pourquoi en premier** : sans ça, tous les templates des vagues 2-6 qu'on veut composer sur fond Kraft/Mapbox seront bloqués.

**Pattern de refactor** :
```tsx
// AVANT (OPAQUE)
<AbsoluteFill style={{ backgroundColor: "#0d1420" }}>...</AbsoluteFill>

// APRES (COMPOSABLE)
type Props = { ...; bgColor?: string };
const Component = ({ bgColor = "transparent", ... }) => (
  <AbsoluteFill style={{ backgroundColor: bgColor }}>...</AbsoluteFill>
);
```

**Liste des 17 templates** :
- Niveau data hero : OdometerFlip, PulseNumber, IconStat, BarRace, StackedBars, ScaleShock
- Niveau data viz : NetworkGraph, ProcessFlow, Timeline, IconGrid, TimelineFracture
- Niveau motion design pro : BurnReveal, CoinFlip, ShatterReform, GlitchReveal, SplitFlap, RadarPing, RadarScan

**Estimation** : 5 min × 17 = ~1h30. No risk (default "transparent" ne casse rien).

---

## VAGUE 2 — Top 7 Utilitaires (fondamentaux)

Le squelette éditorial de toute mid-form Souverain. Tous responsive 16:9, tous transparents.

| # | Nom | Anatomie courte | Cas d'usage | Référence |
|---|---|---|---|---|
| **2.1** | **MapboxSatelliteSenegal pattern** (adaptable) | Satellite tilted + camera flyTo + highlight pays | Ouverture sujet, situer pays/zone | ✅ V1 livrée Caspian |
| **2.2** | **FlowArrowsMap** | Tracé flèches courbées SVG animées + épaisseur ∝ volume + labels | Flux export/import, routes commerciales | Caspian/Wendover |
| **2.3** | **StatComparisonSplitFlap** | Recycle `SplitFlap` + `OdometerFlip` — comparaison stats grandeur | "PIB actuel vs revenus projetés GTA" | PolyMatter/Vox |
| **2.4** | **CountryIsolateWithHatch** (fusion Country+Hatch) | Pays isolate fill or + drapeau pin + label badge + zone hachurée intégrée | Sangomar offshore, frontière contestée | Caspian (5x/min) |
| **2.5** | **LineChartDrawOn** | Stroke animé `@remotion/paths` + point au bout + legend inline + source | Production gaz Sénégal 2024-2030 | PolyMatter signature |
| **2.6** | **ParadigmShiftTimeline** | Recycle `TimelineFracture` — timeline qui se brise + bascule colorimétrique | Sénégal pré-2014 → ère gazière | JH/Vox |
| **2.7** | **HighlightedQuote** | Bande noire arrondie + surlignage jaune fluo qui se trace + source | Chiffres-chocs, citations | Vox/Harris/Caspian |

**Estimation** : 1-2h par template × 7 = ~10-14h.

---

## VAGUE 3 — Top 10 Mécaniques signature (vision long terme Souverain)

La grammaire visuelle distinctive de Souverain, ancrée dans la sensibilité africaine sans folklorique frontal.

| # | Nom | Métaphore/Concept | Cas d'usage Souverain |
|---|---|---|---|
| **3.1** | **Le Semeur (Awalé Shift)** | Jeu stratégie Awalé — graines entre fosses | Fuite cerveaux Mali, IDE Maroc, transferts ZLECAf |
| **3.2** | **Fractale de Croissance** | Art africain fractal — micro → macro récursif | Cellule batterie → Gigafactory Maroc, démographie sahélienne |
| **3.3** | **Stratigraphie (Resource Cut)** | Coupe transversale sous-sol | Forages Sangomar, mines uranium Niger, nappes phréatiques |
| **3.4** | **Le Cadran Solaire (Ombre Équatoriale)** | Ombre portée géométrique = passage du temps | Frises chronologiques, transition énergétique, ères pré/post-indépendance |
| **3.5** | **Palimpseste (Frontières Dissolvantes)** | Frontières coloniales qui se dissolvent + flux qui traversent | ZLECAf, routes transsahariennes, zones d'influence groupes armés |
| **3.6** | **Polyrythmie Data (Syncopated Reveal)** | Apparition syncopée — rythme musique africaine | Comparaisons PIB CEDEAO, parts marché pétrole, timeline coups d'État |
| **3.7** | **Le Sceau (Treaty Stamp)** | Tampon institutionnel circulaire | Sanctions CEDEAO Mali/Niger, signature contrats BP Sénégal, ratification ZLECAf |
| **3.8** | **La Calebasse (Capacity Fill)** | Contenant qui se remplit (alt au pie chart) | Réserves uranium vs demande, caisses État post-exploitation, démographie |
| **3.9** | **Nœud de Tisserand (Bottleneck)** | Pendant "crise" de LoomWeaver — fils convergent en goulot rouge | Goulot port Dakar, monopole batteries Chine, dépendance corridor Mali |
| **3.10** | **Arbre à Palabres (Stakeholder Constellation)** | Coordonnées polaires — canopée Baobab/Acacia | Acteurs crise Niger, sous-traitants pétrole Sénégal, blocs ZLECAf |

**Estimation** : 2-4h par template × 10 = ~20-40h (certains sont plus complexes — Polyrythmie, Calebasse avec ondulation SVG, Arbre à Palabres avec coords polaires).

---

## VAGUE 4 — Top 5 FUN risque FAIBLE + 2 Transitions signature

**Effet WOW visuel** sur 1-3 secondes max, compatibles avec grammaire éditoriale premium.

| # | Nom | Effet | Cas d'usage |
|---|---|---|---|
| **4.1** | **Calque Déchiré (Torn Veil)** | Document officiel se déchire pour révéler dette cachée | Méga-projet infrastructure : com officielle vs réalité |
| **4.2** | **Scan Infrarouge (UV Truth)** | Scanner horizontal révèle bases Wagner cachées | Concessions minières Centrafrique/Mali |
| **4.3** | **Caviardage Brutal (Redacted)** ⭐ COUP DE CŒUR | Marqueur noir gratte mots de langue de bois | Décortiquer communiqué CEDEAO, "objectifs éco-responsables" multinationale Nigeria |
| **4.4** | **Effet Domino Géopol (Tipping Point)** | Drapeaux qui tombent en cascade | Succession coups d'État Sahel (Mali → Burkina → Niger → Gabon) |
| **4.5** | **Fil Rouge (Detective Board)** ⭐ COUP DE CŒUR | Fil tendu zippe entre portraits — démêler scandale | Trajet or contrebande Soudan → Dubaï, chaîne corruption complexe |

| # | Transition | Effet | Vibe |
|---|---|---|---|
| **4.T1** | **Loom Wipe (Tissage)** | 4 bandes s'entrecroisent au centre, sortent | Élégant, ancrage culturel subtil |
| **4.T2** | **Sovereign Eclipse** ⭐ COUP DE CŒUR | Disque noir glisse, anneau d'or éclate au pic | Vox/Caspian. Souveraine, inéluctable. Signature de transition chapitre |

**Estimation** : 1-3h par template × 7 = ~10-20h.

---

## VAGUE 5 — Top 7 Personnages (gap critique identifié)

Templates pour présenter les acteurs (chefs d'État, experts, opposants). Style BD éditoriale mi-réaliste sur fond Kraft.

### Pattern technique fondamental (à coder en premier de la vague)

Composant maître `<CharacterPortrait />` qui accepte :
- `imageSrc` (PNG portrait Gemini généré avec prompt standardisé)
- `scale`, `flipX` (orientation regard), `shadow` (ombre portée Kraft)
- Astuce technique majeure : `mix-blend-mode: multiply` sur fond blanc → fusion automatique avec grain Kraft (pas besoin de détourage manuel)

**Prompt Gemini standardisé pour cohérence visuelle** :
> "Portrait of [Name], editorial illustration style, clear lines, flat watercolor fills, muted colors, white background, masterpiece, professional geopolitical magazine style."

### Les 8 templates personnages

| # | Nom | Anatomie | Cas d'usage |
|---|---|---|---|
| **5.0** | **CharacterPortrait** (composant maître) | Base réutilisée par tous les autres | — |
| **5.1** | **Portrait Éditorial (1 personne)** | Composition magazine asymétrique + grand cercle SVG fond + typo massive | Bassirou Diomaye Faye lors de son élection |
| **5.2** | **Ligne de Fracture (2 personnes opposition)** | Ligne vectorielle texturée diagonale + 2 portraits se regardent | Crise Macron vs Tebboune |
| **5.3** | **Trombinoscope Stratégique (3-4 personnes)** | Alignement horizontal + leader plus grand au premier plan + étiquettes | Leaders AES : Goïta, Traoré, Tiani |
| **5.4** | **Passation de Pouvoir (transition 2 personnes)** | Portrait A recule grisé, Portrait B émerge en couleurs | Macky Sall → Bassirou Diomaye Faye |
| **5.5** | **Diptyque Temporel (évolution 1 personne)** | Barre scanner révèle version âgée | Paul Biya jeune vs patriarche actuel |
| **5.6** | **Ombre & Caviardage (acteur sensible)** | Silhouette + bloc noir + typo Courier | Cadre Wagner non identifié, informateur RDC |
| **5.7** | **Matrice des Acteurs (6-8 personnes)** | Grille mur d'enquête 2×3 ou 2×4 + statuts colorés | Écosystème conflit Est RDC (Tshisekedi, Kagame, M23, MONUSCO) |
| **5.8** | **Citation Souveraine (1 personne + citation)** | Typo serif géante + guillemets SVG filigrane + portrait coin bas | Discours Sankara à l'ONU, déclaration Kagame |

**Estimation** : 5.0 = 2h. 5.1-5.8 = 1-3h chacun. Total ~12-20h.

**Pré-requis** : générer 6-8 portraits BD test (Macky Sall, Bassirou Faye, Macron, Tebboune, Goïta, Traoré, Wagner anonyme, Sankara) avec Gemini 3.1-flash-image en amont pour disposer des assets de validation.

---

## VAGUE 6 — Top 4 expérimentale (risque MOYEN à ÉLEVÉ)

À tenter en fin de plan, quand on a les fondamentaux solides. Si une foire, on a déjà 35 templates derrière.

| # | Nom | Risque | Pourquoi tenter |
|---|---|---|---|
| **6.1** | **Parallaxe 2.5D (Diorama Pop)** | MOYEN | Effet Netflix profondeur photo archive — dépend qualité détourage |
| **6.2** | **Mosaïque Wax (Textile Build-up)** | MOYEN | Triangles wax remplissent silhouette pays — signature culturelle |
| **6.3** | **Métamorphose Fiduciaire (Ink Bleed)** | MOYEN | CFA → Yuan via filtre SVG `feTurbulence` — élégant pour inflation/influence |
| **6.4** | **Origami Cartographique (Map Unfold)** | ÉLEVÉ | Carte se déplie 4 volets perspective — précision CSS critique |
| **6.5** | **LoomWeaver (signature visionnaire)** | MOYEN | Tissage fils chaîne/trame — métaphore alliance/écosystème — pari signature Souverain |

**Estimation** : 3-6h par template × 5 = ~15-30h.

---

## SÉQUENCES SIGNATURE (combinaisons réutilisables 8-15s)

Pour créer la reconnaissance instantanée "ah, c'est du Souverain". À documenter et utiliser comme blocs narratifs récurrents.

### Séquence A — "Anatomie d'une Ressource" (Intro de sujet)
Durée : ~10s
1. **Stratigraphie** (0-3s) — carte se tranche, révèle sous-sol
2. **La Calebasse** (3-6s) — ressource s'écoule dans jauge minimaliste, volume massif
3. **Le Semeur** (6-10s) — calebasse se transforme en graines éjectées vers l'extérieur (Europe/Asie)

### Séquence B — "Le Théâtre Géopolitique" (Setup conflit/négociation)
Durée : ~12s (à construire)
1. **MapboxSatelliteSenegal** zoom continent → pays (0-4s)
2. **CountryIsolateWithHatch** highlight zone (4-6s)
3. **Matrice des Acteurs** (5.7) — fiches acteurs apparaissent (6-12s)

### Séquence C — "La Révélation" (Moment dramatique)
Durée : ~8s (à construire)
1. **Document statique** (citation officielle, com gouvernementale)
2. **Calque Déchiré** (4.1) — révèle l'envers
3. **HighlightedQuote** (2.7) — souligne le chiffre/mot-clé qui contredit

### Séquence D — "Le Verdict" (Conclusion chapitre)
Durée : ~6s (à construire)
1. **Le Sceau** (3.7) — tampon institutionnel "frappe" l'écran
2. **Sovereign Eclipse** (4.T2) — transition vers chapitre suivant

**Note** : ces séquences sont des **propositions de combinaison**, pas des templates rigides. À affiner en production réelle.

---

## ORDRE D'EXÉCUTION RECOMMANDÉ

```
Phase 3 — semaine type
├── J1 matin    : Vague 1 (refactor 17 composants opaques) [1h30] + Vague 1.5 (SouverainScene + 3 backgrounds Gemini + test triptyque Mapbox) [2-3h]
├── J1 après-midi : Vague 2.1 + 2.2 + 2.3 (Mapbox déjà ok, FlowArrows, StatComparison)
├── J2          : Vague 2.4 + 2.5 + 2.6 + 2.7 (CountryIsolate+Hatch, LineChart, Paradigm, HighlightedQuote)
├── J3-J4       : Vague 3 (10 mécaniques signature)
├── J5          : Vague 4 (5 FUN + 2 transitions) — moments WOW
├── J6          : Vague 5 (CharacterPortrait + 7 templates personnages) — gap critique
├── J7+         : Vague 6 (4 expérimentaux) — selon temps restant
└── Validation continue : chaque template → render → review perso → présentation Aziz → FINAL
```

**Estimation totale** : 7-10 jours de travail focusé (Aziz a dit "1-2 jours en travail focusé" — optimiste vu le nombre, mais réaliste si certains templates s'enchaînent vite et qu'on parallélise).

---

## LIVRABLES PHASE 3 ATTENDUS

Pour chaque template :
1. Fichier `.tsx` dans `src/projects/_shared/components/layouts/` (ou `inserts/` selon type)
2. Composition enregistrée dans Root.tsx (Folder dédié `souverain-templates-16-9`)
3. Render `out/_proto-16-9/<TemplateName>-v1.mp4` (validation interne)
4. Si validé Aziz : promotion → `out/templates-souverain/FINAL-<TemplateName>-v1-16x9.mp4`
5. Entrée dans `public/_shared/ASSETS-INDEX.md` avec previews mid/end + URL catbox
6. Si gros template (séquence signature, expérimental) : mémoire dédiée dans `memory/feedback_<template>.md`

**Update dashboard** : après chaque vague complétée, regénérer `dashboard/strategie-16-9-phase1.html` avec les nouveaux templates intégrés visuellement.

---

## RÉFÉRENCES

- **Audit + benchmark consolidés** : [`audit-templates-16-9.md`](audit-templates-16-9.md)
- **V1 MapboxSatelliteSenegal** : [`memory/archive/backlogs-perimes-2026-07-11/backlog-ameliorations-mapbox-satellite.md`](backlogs-perimes-2026-07-11/backlog-ameliorations-mapbox-satellite.md)
- **Pattern canonique render Mapbox** : [`feedback_mapbox-render-pattern-canonique.md`](feedback_mapbox-render-pattern-canonique.md)
- **Brainstorms verbatim sources** : [`brainstorms/`](brainstorms/)
  - `2026-05-21-gemini-shortlist-utilitaires.md` → vague 2
  - `2026-05-21-gemini-visionnaire-long-terme.md` → vague 3
  - `2026-05-21-gemini-templates-fun.md` → vague 4
  - `2026-05-21-gemini-personnages.md` → vague 5
  - `2026-05-21-kimi-*` → archive (pas exploitable)
- **Dashboard live** : https://onyx-monsoon-mrar.here.now/
