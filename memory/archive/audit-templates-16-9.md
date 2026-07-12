# Audit Templates 16:9 — Bibliothèque Souverain & Benchmark Documentaires

> **Date** : 2026-05-21
> **Contexte** : Aziz pivote vers le mid-form 16:9 documentaire (style Vox / Johnny Harris / Polymatter / Caspian Report). Audit complet de la bibliothèque existante + benchmark de 7 vidéos référence + audit des composants opaques (anti-pattern de composition).
> **Statut** : Phase 1 du plan de stratégie templates 16:9.
> **Décisions issues de cet audit** :
> - Hybride "grammaire dominante 8 templates + inserts libres" (à valider après prototype)
> - V1 `MapboxSatelliteSenegal` validée 2026-05-21 (voir [ASSETS-INDEX Template C-bis](../public/_shared/ASSETS-INDEX.md))
> - Refactor 17 composants opaques à programmer en Phase 3

---

## 1. Audit bibliothèque existante (33 templates `src/projects/_shared/components/layouts/`)

### 1.1 Responsivité format (16:9 vs vertical Shorts)

Mesure : présence de `useVideoConfig()` + absence de hardcode 1080×1920.

| Statut | Nombre | Templates |
|---|---|---|
| ✅ Responsive natif (16:9 ready sans modif) | **19** | ArchiveFade, BarRace, BrutalHookSplit, CoinFlip, CountdownReveal, DualStat, DataRevealSouverain, FillScreen, IconStat, MilitaryMarchLine, OdometerFlip, PortraitGeometry, PulseNumber, QuoteImpact, RadarPing, RadarScan, ScaleShock, SpeechBubble, StackedBars, Timeline, TypeReveal, TypeWriter, WordExplode |
| ⚠️ Responsive partiel (useVideoConfig + dimensions hardcodées résiduelles) | **9** | IconGrid, GlitchReveal, NetworkGraph, ProcessFlow, TimelineFracture, BurnReveal, ScaleTilt, ShatterReform, SplitScreenSouverain |
| ❌ Hardcoded vertical (Tailwind/flex pur sans useVideoConfig) | **1** | SplitFlap |

**Verdict format** : la bibliothèque est **majoritairement responsive en intention** (~80%). 9 templates nécessitent un fix mineur (remplacer constantes hardcodées par `useVideoConfig().width/height`). 1 seul est à laisser pour Shorts.

### 1.2 Composition (opaque vs transparent)

Mesure : présence d'un `<AbsoluteFill style={{ backgroundColor: ...}}>` opaque en root du composant — anti-pattern qui empêche la composition sur fond custom (KraftCard, Mapbox, etc.).

| Statut | Nombre | Implication |
|---|---|---|
| ❌ OPAQUE (couleur fond hardcodée, masque tout parent) | **17** | Non-composable. Refactor obligatoire pour Phase 3. |
| ✅ TRANSPARENT (pas de backgroundColor en root) | **6** | Composable directement. |
| 🟡 CONDITIONNEL (bg via prop optionnel) | **3** | Composable mais à activer. |
| ❓ Non audité (manque dans rapport agent) | **7** | À auditer Phase 3 avant refactor. |

#### Liste OPAQUE — refactor prioritaire pour pipeline 16:9 documentaire

| Template | Couleur fond hardcodée | Catégorie d'usage |
|---|---|---|
| OdometerFlip | `#060a10` | Data hero (chiffre) |
| BarRace | `#0d1420` | Data viz |
| PulseNumber | `#0C121A` | Data hero |
| NetworkGraph | `#0d1420` | Data viz |
| IconStat | `#0b121f` | Data hero |
| Timeline | `#0d1420` | Narration timeline |
| StackedBars | `#0d1420` + radial-gradient | Data viz |
| ScaleShock | `#0d1420` | Data comparison |
| ProcessFlow | `#0b1220` | Flow diagram |
| RadarPing | `#060a10` | Alerte / focus |
| IconGrid | `#0d1420` | Grille acteurs |
| BurnReveal | `#0d1420` | Reveal animé |
| CoinFlip | `#0d1420` | Reveal binaire |
| RadarScan | `#0b1220` | Balayage radar |
| ShatterReform | `#0d1420` | Reveal fracture |
| SplitFlap | `#0d1420` | Flip cards |
| GlitchReveal | `#0d1420` (div) | Glitch effect |

#### Pattern de refactor recommandé (OPAQUE → COMPOSABLE)

```tsx
// AVANT (OPAQUE — masque tout parent)
export const Component: React.FC<Props> = (...) => (
  <AbsoluteFill style={{ backgroundColor: "#0d1420" }}>...</AbsoluteFill>
);

// APRES (COMPOSABLE — fond optionnel via prop)
type Props = { ...; bgColor?: string };
export const Component: React.FC<Props> = ({ bgColor = "transparent", ... }) => (
  <AbsoluteFill style={{ backgroundColor: bgColor }}>...</AbsoluteFill>
);
```

**Effort estimé** : ~5 min par template × 17 = ~1h30 pour le refactor systématique. Aucun risque (default `"transparent"` change rien aux comportements actuels, juste DÉBLOQUE la composition).

### 1.3 Templates "premium signature" (motion design pro déjà construit)

Insight Aziz 2026-05-21 : ces templates sont du niveau After Effects mais ont été traités comme blocs Shorts isolés au lieu d'un langage signature. À réintégrer comme **mécaniques signature** dans la grammaire mid-form.

| Template | Effet | Usage potentiel 16:9 |
|---|---|---|
| **OdometerFlip** | Compteur mécanique qui tourne (chiffres flip) | "100 000 barils/jour" — révélation chiffre fort |
| **GlitchReveal** | Reveal avec glitch effect | Moment de bascule narrative (avant/après) |
| **BurnReveal** | Carte/doc qui brûle pour révéler | Document classifié / dossier secret |
| **CoinFlip** | Pile/face card flip | Choix binaire / dilemme |
| **ShatterReform** | Brisure puis reformation | "L'illusion de la souveraineté" / fracture |
| **RadarPing** | Ping radar circulaire | Alerte / lieu d'intérêt |
| **TimelineFracture** | Timeline qui se brise | Rupture historique |
| **SplitFlap** | Flip-cards style horloge gare | Annonce / verdict |

**Tous OPAQUE actuellement** → refactor Phase 3 prioritaire pour les rendre composables sur Kraftcard / Mapbox / autres fonds.

---

## 2. Benchmark vidéos documentaires 16:9 (corpus 7 vidéos, 70 frames analysées)

### 2.1 Corpus

| Chaîne | Vidéo | Durée | Style dominant |
|---|---|---|---|
| Johnny Harris | The Internet Didn't Fail | 13:01 | PTC cinéma + maps + archive |
| Vox | Tolkien / Palantir | 11:35 | Collage culturel + interviews + caption |
| PolyMatter | Puerto Rico Economy | 16:54 | Charts long-tenus + B-roll thématique |
| Map Men | World's most annoying road | 13:21 | Two-presenter + cartoon maps |
| Wendover | Car Dealerships Scam | 17:55 | B-roll terrain + macbook tilted + maps |
| Real Life Lore | NH Geography Glitch | 23:03 | Mapbox 3D continu + animations intra-shot |
| **Caspian Report** | Greenland is only the beginning | 16:18 | **Mapbox 3D satellite + drapeaux + hachures** ← référence directe Souverain |

Frames analysées dans `/tmp/benchmark-frames/{slug}/` (10 frames par vidéo, JPEG 540p).

### 2.2 Insights majeurs

**Insight #1 — Le rythme "5-8s" n'est PAS du cut.** PolyMatter (6.3s/cut) et Real Life Lore (16 hard cuts sur 23 min) tiennent des shots longs MAIS font évoluer le contenu *à l'intérieur* (labels qui apparaissent en cascade, lignes qui se tracent, caméra qui zoom). **Conséquence pour nous** : chaque `<Sequence>` Remotion doit porter **2-3 micro-événements espacés** (spring fadeIn → label1 → label2 → arrow → conclusion), pas un asset statique tenu. C'est exactement ce que les templates Souverain premium (OdometerFlip, RadarPing, WordExplode) savent déjà faire.

**Insight #2 — Caspian Report = référence directe pour Atlas/Souverain.** Mapbox 3D satellite tilted (pitch 55°, bearing -20°) + drapeaux pin + zones hachurées + labels badges noirs. **5 patterns par minute**. Si on devait choisir UNE chaîne à imiter en grammaire visuelle, c'est elle. Pattern `MapboxSatelliteSenegal` V1 (validé 2026-05-21) reproduit déjà cette grammaire.

**Insight #3 — Anti-pattern confirmé.** Aucune des 7 chaînes premium n'utilise de transitions tape-à-l'œil (whoosh, glitches lourds, lens flares). 100% cuts francs ou crossfade subtil. **Cohérent avec la charte Souverain** — on garde le cap.

**Insight #4 — Densité densité densité.** Ratio observé : ~40% B-roll cinéma réel / 60% animation infographique chez Caspian/PolyMatter, ~50/50 chez Wendover/RLL. Pour les sujets Afrique éco/géopol d'Aziz : viser **40% B-roll** (footage commandé ou Pexels) + **60% animation Remotion**.

### 2.3 Top 22 mécaniques visuelles cibles

Classement par signal (apparitions corpus) × faisabilité × pertinence Souverain.

| # | Mécanique | Apparitions | Faisabilité Remotion | Priorité |
|---|---|---|---|---|
| 1 | **Mapbox 3D satellite tilted (pitch 50-60, bearing ±20)** | 4/7 | ✅ Validé V1 MapboxSatelliteSenegal | HAUTE |
| 2 | **Country/zone isolate + fill couleur + label badge noir** | 6/7 | Simple | HAUTE |
| 3 | **Drapeau pin planté (flag SVG + mat stroke)** | 5/7 | Simple | HAUTE |
| 4 | **Caption pop-on bande noire arrondie + surlignage jaune** | 4/7 | Trivial | HAUTE |
| 5 | **Highlight reveal jaune fluo sur citation/texte scanné** | 3/7 | Simple | HAUTE |
| 6 | **Line chart draw-on + point au bout + legend inline** | 2/7 | Simple | HAUTE |
| 7 | **Rectangle de focus + hachures SVG dans la zone** | 3/7 | Simple | HAUTE |
| 8 | **Tracé pointillé animé entre 2 points** | 5/7 | Simple | HAUTE |
| 9 | **Frame-in-frame interview cadre épais + texture thématique** | 2/7 | Trivial | HAUTE |
| 10 | **Triptyque collage 3 plans + caption gros bold** | 3/7 | Trivial | HAUTE |
| 11 | Macro-shot objet thématique focus-pull | 2/7 | Externe (footage cinéma) | MOYENNE |
| 12 | **Archive footage NB plein cadre (grain conservé)** | 4/7 | Trivial | HAUTE |
| 13 | **Mapbox flyTo enchaîné entre 2-3 lieux** | 4/7 | Moyen | HAUTE |
| 14 | **Labels progressifs cascade sur carte (badge noir + bullet)** | 4/7 | Simple | HAUTE |
| 15 | Cône/radar pulsant sur point d'intérêt | 1/7 | Simple (RadarPing existe déjà) | MOYENNE |
| 16 | **Bateau/avion icône animé sur trajectoire courbe** | 2/7 | Simple | HAUTE |
| 17 | Screencast YouTube/Patreon/laptop UI mockup | 3/7 | Trivial | MOYENNE |
| 18 | Laptop tilted 3/4 perspective + screencast | 2/7 | Moyen | MOYENNE |
| 19 | Piece-to-camera décor signature (anchor narratif) | 3/7 | Externe (tournage) | BASSE (Aziz) |
| 20 | Illustration vectorielle plate (Storyset / unDraw) | 1/7 | Trivial | MOYENNE |
| 21 | **B-roll cinéma drone paysage (lent, transitionnel)** | 4/7 | Externe (Pexels) | HAUTE |
| 22 | **Watermark logo chaîne coin bas (semi-transparent fixe)** | 4/7 | Trivial | HAUTE |

### 2.4 Top 6 templates à coder en priorité 1

Tous faisables avec stack actuel (Mapbox + Recraft + SVG natif), aucun plugin externe :

1. ✅ **`<MapboxSatelliteSenegal>` / pattern adaptable** — V1 livrée 2026-05-21. Adaptable pour tout pays/zone (changer ISO + coordonnées CAM).
2. **`<CountryIsolatePin>`** — pays fill + drapeau pin + label badge (6/7 chaînes)
3. **`<HighlightedQuote>`** — surlignage jaune fluo + bande noire arrondie (4/7)
4. **`<LineChartDrawOn>`** — stroke animé `@remotion/paths` + legend inline (signature PolyMatter)
5. **`<HatchedZone>`** — rectangle focus + pattern hachures SVG (signature Caspian — 5x/min)
6. **`<TripleCollage>`** — 3 médias côte à côte + caption pop-on (Vox/Harris)

---

## 3. Synthèse — Stratégie d'application

### 3.1 État réel de la bibliothèque (révisé)

Ce qu'on a en réalité :
- ✅ **19 templates responsive propres** + 9 à fix mineur = ~28 templates exploitables 16:9
- ✅ **2 templates Mapbox validés production** (CartoCaspian 2D, AtlasRealiste3D vertical)
- ✅ **1 template Mapbox 16:9 cinématique** (MapboxSatelliteSenegal V1 — nouveau 2026-05-21)
- ✅ **8 templates "motion design pro signature"** (OdometerFlip, GlitchReveal, etc.) sous-exploités

Ce qui manque réellement :
- ❌ **17 composants OPAQUE** à refactor pour permettre composition sur fonds (Kraftcard, Mapbox, etc.)
- ❌ **5 templates 16:9 manquants** (CountryIsolatePin, HighlightedQuote, LineChartDrawOn, HatchedZone, TripleCollage)
- ❌ **Aucune intégration Recraft** (la clé existe, jamais utilisée — opportunité Hand-drawn overlay style Johnny Harris)

### 3.2 Direction validée (hypothèse Aziz, à valider par prototype)

**Hybride "grammaire dominante 8 templates + inserts libres"** :
- **Set fixe de 8 templates** présents dans toutes les mid-form (signature reconnaissable de chaîne)
- **Inserts libres** (28 autres templates existants) utilisés ponctuellement quand le sujet le justifie

Set fixe proposé (à valider) :
1. `MapboxSatelliteSenegal` pattern (carte signature) — V1 validée
2. `CountryIsolatePin` (à coder)
3. `HighlightedQuote` (à coder)
4. `HatchedZone` (à coder)
5. `LineChartDrawOn` (à coder)
6. `BrutalHookSplit` (existe, validé Silicon Savannah)
7. `TypeReveal` (existe, validé)
8. Un fond signature unique : Kraftcard OU AtlasRealiste3D OU SMG cream — **un seul**, à trancher après prototype B (différé Phase 3)

### 3.3 Plan d'exécution Phase 2 → 4

**Phase 2 — Brainstorm Kimi + Gemini (parallèle)**
Inputs : ce doc + benchmark + audit composants opaques. Output : shortlist 10-12 templates 16:9 enrichie + idées créatives non couvertes par le corpus.

**Phase 3 — R&D vagues**
- Vague 1 : refactor 17 composants OPAQUE → COMPOSABLE (~1h30, no-risk)
- Vague 2 : coder les 5 templates manquants (CountryIsolatePin, HighlightedQuote, HatchedZone, LineChartDrawOn, TripleCollage)
- Vague 3 : explorer Recraft (Hand-drawn overlay style Johnny Harris, SVG flèches/cercles)

**Phase 4 — Intégration Sénégal Beat1**
Test grandeur réelle. Combine MapboxSatelliteSenegal (V2 avec océan éclairci) + 2-3 nouveaux templates Phase 3 sur l'audio Sénégal Pétrole déjà validé.

---

## 4. Références

- **V1 Mapbox 16:9 validée** : [ASSETS-INDEX Template C-bis](../public/_shared/ASSETS-INDEX.md)
- **Backlog améliorations Mapbox** : [`memory/archive/backlogs-perimes-2026-07-11/backlog-ameliorations-mapbox-satellite.md`](backlogs-perimes-2026-07-11/backlog-ameliorations-mapbox-satellite.md)
- **Pattern canonique render Mapbox** : [`feedback_mapbox-render-pattern-canonique.md`](feedback_mapbox-render-pattern-canonique.md)
- **Rapport benchmark détaillé (7 vidéos, 22 mécaniques)** : `/tmp/benchmark-docs-16-9.md` + frames `/tmp/benchmark-frames/`
- **Rapport audit composants opaques détaillé** : `/tmp/audit-composants-opaques.md`
- **Vidéo de référence absolue** : Caspian Report "Why Greenland is only the beginning" (https://www.youtube.com/watch?v=PRdEM75I9AQ)
