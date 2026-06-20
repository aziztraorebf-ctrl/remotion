# INDEX PAR INTENTION → FORME → où trouver la réponse

> ⭐ **PORTE D'ENTRÉE de tous les catalogues. À consulter APRÈS avoir déduit l'intention, jamais avant.**
> Né de la doctrine [[CONTINUITE-SCENE-INTENTION-DABORD]] (intention → forme → template, dans cet ordre).
>
> ⛔ **Ce fichier n'est PAS un catalogue où l'on vient piocher.** On ne l'ouvre pas en se demandant
> « qu'est-ce qu'on a ? ». On l'ouvre quand on a DÉJÀ répondu à « ce moment doit faire ressentir QUOI ? »
> (1 verbe dominant), et il répond seulement à : *« a-t-on déjà une forme pour cette intention ? »*
> Si oui → on adapte. Si non → l'intention est claire, on code (on sait EXACTEMENT quoi).
>
> Procédure (checklist doctrine, 30s) : 1.Intention (1 verbe) · 2.Continuité (quel monde est déjà à
> l'écran ? je le PROLONGE) · 3.Forme (quel geste porte l'intention ?) · 4.Template (ici) · 5.Épure
> (retirer ce que la voix dit déjà) · 6.Calage (image ~1s avant le mot-clé).

---

## OÙ RANGER CE QUE JE CODE (règle des 3 zones — 1 question)

> Avant d'écrire un `.tsx`, répondre : « ce que je code, c'est… ». Le bon emplacement doit être ÉVIDENT.
> (Posée 2026-06-19, Chantier C anti-fouillis. L'existant `_proto-16-9/` migre vers `_rnd/` au fil de l'eau,
> pas en big-bang — il reste valide en attendant.)

| Ce que je code… | Emplacement | Durée de vie | Enregistré dans Root.tsx ? |
|---|---|---|---|
| un **livrable** d'un épisode précis (un Beat de la vidéo finale) | `src/projects/<pilier>/<episode>/` (ex: `souverain/senegal-petrole-gaz/beats/`) | permanent | oui, `<Folder>` de l'épisode |
| un **proto jetable** (tester une mécanique d'animation, R&D) | `src/projects/_rnd/<sujet>/` | 7j implicite, se purge | oui, `<Folder name="proto-*">` |
| une **brique réutilisable** validée (sort du proto, sert ≥2 fois ou validée Aziz) | `src/projects/_shared/components/` (ou `/mapbox/`, `/templates/`) + indexer dans COMPOSANTS-INDEX | permanent | non (importée par les beats) |
| ⛔ `src/projects/_demos/` | **ZONE GELÉE** — 8 démos shorts de référence déjà livrées. NE PAS y ajouter, NE PAS s'en inspirer comme source de vérité (les vraies briques sont dans `_shared/`). Consultable seulement. | archive | (déjà enregistrées) |

**Promotion proto → brique** : un proto devient une brique `_shared` seulement s'il est réutilisé ≥2 fois OU
validé par Aziz. Sinon il reste dans `_rnd/` et se purge. Ne PAS coder direct dans `_shared` « au cas où ».

⚠️ Tout `.tsx` de scène (livrable ou proto) doit être enregistré dans `src/Root.tsx` (`<Composition>` + import)
pour être rendu. Une brique `_shared` n'est pas enregistrée — elle est importée par les scènes.

### Niveau PROTO vs LIVRABLE (déterministe — quand passer par la session complète ?)

| | **PROTO** (tester vite) | **LIVRABLE** (la vraie vidéo) |
|---|---|---|
| Emplacement | `_rnd/<sujet>/` | `<pilier>/<episode>/` |
| Workflow | render local direct, self-review scriptée (`mapbox-selfreview.py` si carte). PAS de Gemini, PAS de review.json. | **session complète obligatoire** via `/beat` → `beat-session.py`/`mapbox-session.py` (scan→breakdown→self-review→review→upload). review.json adjacent. |
| Présentation | libre (le hook exempte `_rnd/`) | bloquée par le hook tant que review.json adjacent ≥ 8/10 absent. |
| Règle dure | **jamais dans `out/episodes/`**, jamais présenté comme « final ». | **jamais hors session** ; un livrable rendu vers `/tmp/` ou `_rnd/` est invalide. |

Ne pas « déduire » qu'un livrable mérite le mode proto pour aller vite : si c'est destiné à la vidéo finale, c'est LIVRABLE.

---

## ⭐⭐ 2 RÈGLES MAÎTRESSES (à se rappeler AVANT de scanner la table)

Deux acquis transversaux ressortent de TOUTES nos prods. Les ignorer = re-tâtonner une chose déjà tranchée.

1. **DATA-HERO — le graphisme premium épuré, c'est CETTE grammaire (ne jamais la réinventer).**
   Quand un moment doit faire ressentir *un objet central immuable autour duquel des chiffres se greffent* :
   pivot central verrouillé (pièce / baril / tour / trapèze) + labels asymétriques gauche/droite décalés (spring)
   + halo radial (respiration) + 1 plateau toutes les 5-6s + easing ease-out (jamais pop).
   **Prouvé** : Silicon Savanna (FINAL prêt-pub), coin-flip Sénégal (catbox qx51mw, validé Aziz).
   **Réf** : `memory/atlas-decode/DECODE-mpesa-data-hero-MOTION.md` (grammaire complète) · `src/projects/_proto-16-9/SenegalScene1IntroCoin.tsx` (implémentation pièce) · `src/projects/_demos/afrique-numerique/AfriqueNumeriqueShort.tsx` (réf M-Pesa). Transversal **Atlas + Souverain**.

2. **CARTE = spatial/causal · OVERLAY = conceptuel (ne jamais forcer l'abstrait sur la carte).**
   Un moment SPATIAL (un territoire, un flux, une cause→effet géographique) → reste **SUR la carte** (Mapbox 3D frame-driven).
   Un moment CONCEPTUEL (un accord, une donnée pure, un paradoxe, une citation) → **sort en OVERLAY** (carte assombrie + bloc, ou plein écran), PUIS retour carte. La transition est TENUE (overlay ancré solide), jamais un cut sec.
   **Prouvé** : War-Map P3/P4 (`WarMapDimmedOverlay`/`WarMapSplitScreen`), diagnostic « PowerPoint de luxe » V1 Sénégal = cut sec.
   **Réf** : [[spatial-carte-abstrait-remotion]] · `memory/doctrines/WARMAP-GRAMMAIRE.md`. Transversal **War-Map + Souverain**.

---

## TABLE INTENTION → FORME

Lis la colonne **INTENTION** (ce que tu veux faire RESSENTIR), pas la colonne composant.
⭐ = motion-design validé externe (templates décodés de hera.video, 2026-06-18) — réponse de référence.
Tag pilier : [S]=Souverain · [WM]=War-Map · [A]=Atlas · [C]=Carte vivante Mapbox (transversal). Une forme taguée [WM] peut servir ailleurs — le tag dit l'ORIGINE prouvée, pas l'exclusivité.

### Faire RESSENTIR un chiffre / une ampleur
| Intention | Forme | Réponse(s) | Catalogue détaillé |
|---|---|---|---|
| Un chiffre énorme qui FRAPPE | count-up / odomètre | [S] `CountUp`, `OdometerFlip`, `BigStat`, `ChiffreChoc` | COMPOSANTS-INDEX § CHIFFRE |
| Le chiffre monte SUR une carte (contexte géo) | barre/axe sur carte estompée | ⭐ [S] `ProtoHera_ChartOnMap` (carte claire + barre or) | _proto-16-9 / COMPOSANTS § DONNÉES |
| Une part qui se remplit | jauge | [S] `FillScreen` ; baril-jauge or/rouge (cf. Scène 1 Sénégal) | COMPOSANTS § CHIFFRE |
| **Un objet central + chiffres greffés autour** (premium épuré) | **Data-Hero** (pivot + labels asym. + halo) | ⭐⭐ voir **RÈGLE MAÎTRESSE 1** ci-dessus | DECODE-mpesa-data-hero-MOTION |
| **2 récits/vérités opposés qui basculent** | **pièce 3D qui se retourne** | [S] `CoinFlip.tsx` (props `custom` par face, `rotateYExternal` sync voix) | catbox qx51mw, validé Aziz |

### Faire RESSENTIR une TENDANCE / évolution chiffrée
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Une courbe qui monte/descend dans le temps | line chart qui se trace | ⭐ `ProtoHera_ChartsParchemin` (line, parchemin), ⭐ `HeraFidele_V12_LineChart` (bande highlight, modulable couleur) | _proto-16-9 |
| Comparer 2 grandeurs (A vs B) | bars / poll-bar | ⭐ `ProtoHera_ChartsParchemin` (bars, poll), `DualStat`, `StatComparisonGrid` | _proto-16-9 / COMPOSANTS § COMPARAISON |
| Répartition d'un tout (parts) | donut | ⭐ `ProtoHera_TerminalNeon` (donut glow, registre marché/tech) | _proto-16-9 |

### Faire RESSENTIR la GÉOGRAPHIE / le territoire
> ⭐ **2 RÉPONSES PAR DÉFAUT, ne pas réinventer :** drapeau dans un pays = `useClipFlags` (VRAIES images HD, net à toute échelle — JAMAIS `drawFlagCanvas`) · annoncer un pays avec donnée+source = `GeoCountryPlaque` (pilule nom + stat serif gold + source mono). Filtrer un pays = `countryFilter(iso,…)` par **ISO**, jamais par `'name'`. Relief = `camCountryApproach()` pitch ~32 (inclinaison caméra).

| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Situer un pays/lieu | globe + reveal | [C] `GlobeCountryReveal(Mapbox)`, `FlagPin` | COMPOSANTS § CARTE |
| Un pays prend son **vrai** drapeau | FlagFill clip SVG frame-driven | [C] `MapboxFlagFill` + **`useClipFlags`** (défaut), `SequentialFlagReveal` (séquence) | CATALOGUE-CARTE-VIVANTE |
| Annoncer un pays : nom + donnée + source | plaque éditoriale | [C] **`GeoCountryPlaque`** (+ `GeoProgressCounter` cumul X/N, + `GeoClimaxOverlay` climax) | CATALOGUE l.96-98 |
| Un pays se remplit de sa **ressource** | texture bichromie projetée | [C] `ResourceTextureFill` (pétrole/phosphate/or) | CATALOGUE N2.1 |
| Intensité / évolution (choropleth) | gradient qui monte/baisse | [C] `HeatGradientFill` (5 palettes) | CATALOGUE N2.2 |
| Une frontière se dessine | tracé fibre/laser | [C] `FiberOpticBorderDraw`, [S] `ProtoEffect_MapDrawParchemin` | CATALOGUE / _proto |
| Frontières s'allument en **séquence** (synchro syllabe) | pulse séquentiel | [C] `SequentialBorderPulse` | CATALOGUE l.85 |
| Une influence se propage de pays en pays | contagion par vagues | [C] `DominoContagionFill`, `ContagionFlagSpread` (drapeau remplace) | CATALOGUE N4.1 |
| Changement d'allégeance (occupation, AES) | crossfade 2 drapeaux | [C] `FlagDissolveTransition` | CATALOGUE N3.2 |
| Zone de tension/conflit qui respire | pulse région | [C] `PulsingRegionFill` | CATALOGUE N3.4 |
| Révéler un pays avec dynamisme (scanner) | faisceau qui traverse | [C] `SweepRevealTerritory` | CATALOGUE l.77 |
| Isoler un pays + zone (spotlight) | pays bright, reste assombri + hachures | [C] `MapboxIsolateZone` | CATALOGUE l.38 |
| Des flux/connexions/corridors entre lieux | arcs / route animée + sprite | [C] `GeoFlowConnection` (route+caméra suit), `GlobalPulse`, `FlowArrowsMap` | CATALOGUE l.143 |
| Données ancrées à un point sur la carte | popup geo | [C] `GlassmorphismGeoPopup` | CATALOGUE-CARTE-VIVANTE |
| Couper vers un insert puis revenir à la carte | cutaway plein écran (4 modes) | [C] `MapCutaway` (texte/stat/image/flag, typewriter) | CATALOGUE l.28 |
| Distinguer N pays sans charger la carte | 1 contour coloré par pays + pulse | [WM] `SAHEL_COUNTRY_COLORS` (moteur, contours tracé-in) | WARMAP-COMPOSANTS |
> ⚠️ Carte/contour/contagion : **toujours préférer Mapbox 3D frame-driven** (mouvement caméra) aux repros SVG plates. Hooks d'ouverture carto : `KineticMaskSlam`, `FiberOpticFlagInvade` (voir hooks-lib).

### Faire RESSENTIR le TEMPS / une séquence  ← (catégorie renforcée)
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Jalons dans le temps | frise + médaillons | ⭐ `ProtoHera_Timeline` (frise or + fiches), `Timeline`, `TimelineFracture` | _proto-16-9 / COMPOSANTS § TIMELINE |
| Un basculement à un moment pivot | timeline qui se fend | `TimelineFracture`, `ParadigmShiftTimeline`, `ProtoEffect_Fracture` | COMPOSANTS § TIMELINE |
| Hier vs aujourd'hui (comparatif daté) | fiches then/now sur carte | ⭐ `HeraFidele_V04_FlagsOnMap` (drapeaux + valeurs barrées→neuves) | _proto-16-9 |

### Faire RESSENTIR du TEXTE / mettre l'EMPHASE  ← ⭐ CATÉGORIE NOUVELLE (manquait)
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Une phrase-choc qui se construit, accent sur 1 mot | texte cinétique + souligné | ⭐ `HeraFidele_V03_KineticText` (mot par mot, souligné rouge) | _proto-16-9 |
| Une citation / titre d'impact | texte fort plein écran | `TextChoc`, voir COMPOSANTS § CITATION/TEXTE FORT | COMPOSANTS § CITATION |
| Le paradoxe nu en 2 mots opposés | bascule typographique | `ProtoEffect_Fracture` (« S'enrichir. / S'effondrer. ») | _proto (hook Sénégal) |

### Faire RESSENTIR l'AUTORITÉ / la PREUVE
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Un fait validé par la presse | article éditorial animé | ⭐ `HeraFidele_V02_PressArticle` (titre serif + logo + portrait) | _proto-16-9 |
| Une source / document OSINT | preuve annotée | `DataCard`, `OsintSplitScreen`, voir § PREUVE | COMPOSANTS § PREUVE |
| Présenter un acteur | portrait | `PortraitReveal`, illustration stipple Gemini (cf. `press-portrait.png`) | COMPOSANTS § PORTRAIT |

### Faire RESSENTIR une INCARNATION / un acteur qui agit  ← ⭐ CATÉGORIE ATLAS (manquait)
> Atlas = sprites-acteurs (PixelLab/Gemini) ancrés à la carte. ⛔ Taille ancrée à la carte (`spriteMapWidth` en degrés), JAMAIS vmin. L'objet est une IMAGE, jamais un dot. ⛔ Bataille en rectangles/blocs top-down = REJET (sans identité).
> **Désambiguïsation marche A→B** (3 lignes proches) : 1 figure isolée qui marche = `WalkToDestination` · plusieurs unités en colonne/cortège (armée, caravane) = `FormationMarch`/`caravanePositions()` · plusieurs étapes A→B→C = `WaypointMarch`. **Pilier** : « armée/caravane historique » → Atlas (sprites). Si l'épisode est War-Map → équivalent = jetons qui avancent + sillage (pas de sprite PixelLab). ⚠️ Vérifier que le blueprint existe RÉELLEMENT dans `src/projects/atlas/_blueprints/` avant de coder (les index périment).
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Incarner un acteur sur un trajet (A→B) | sprite walk-cycle ancré-pied + caméra suit | [A] `AtlasPixelChar` + blueprint `WalkToDestination` | ATLAS-COMPOSANTS §3 |
| Un cortège/caravane traverse un territoire | file de sprites décalés sur path courbe | [A] `caravanePositions()` + blueprint `FormationMarch` | ATLAS-COMPOSANTS §3 |
| Voyage multi-villes (A→B→C→D) | waypoints + sprite tourne par direction | [A] blueprint `WaypointMarch` | _blueprints |
| Un affrontement / 2 forces convergent | chorégraphie file→ligne→charge→clash, OU confrontation face-à-face | [A] `AtlasV2ArmyDeployScene`, `AtlasV2ConfrontationScene`, blueprint `Alliance` | ATLAS-PLAYBOOK §3 |
| Un mouvement tactique (flèche, tenaille) | arc géodésique marching-ants + tête mobile | [A] `AtlasAttackArrow`, `AtlasEncirclement` | _shared atlas |
| Un empire qui grandit | stroke-dashoffset path + fill fade | [A] blueprint `EmpireExpansion` | _blueprints |
| Un territoire qui s'effondre (choc) | Dutch tilt + shake + désaturation continent | [A] blueprint `ShakeImpact`/`DutchTiltCollapse` + grisaille narrative (lerp RGB sauf protagoniste) | _blueprints / ATLAS-PLAYBOOK §3 |
| Nommer un lieu / chiffre-impact (registre Atlas) | pill Cormorant spring · cartouche Cinzel wobble · pulse-marker radar | [A] `AtlasLabel`, `AtlasCartouche`, `AtlasPulseMarker` | atlas-components |
| L'échange (sel↔or) / insert chiffré sur carte | dim carte + boîte parchemin double-cadre glow | [A] `SpotlightInsert` (Ghana — à extraire en composant) | ATLAS-PLAYBOOK §3 |

### Faire RESSENTIR du CONCEPTUEL sans quitter la carte  ← ⭐ CATÉGORIE WAR-MAP (manquait)
> Voir **RÈGLE MAÎTRESSE 2**. ⛔ `semitransp` BANNI (voile < 0.5 qui montre la carte derrière). Plein écran = masquer carte Mapbox ET contours moteur. Combiner l'ARSENAL (jetons + zones + contours + plaques), jamais 1 seul asset. CAUSE avant EFFET (jamais pop magique).
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Superposer un concept sans quitter la carte | carte assombrie (voile 0.62, halo, trous locaux) + bloc | [WM] `WarMapDimmedOverlay` + `dimmedOverlayHole()` | catbox xt8ztb, validé Aziz |
| Juxtaposer 2-3 mondes (divergence, comparaison) | split-screen 2/3 volets, ratios animés, accordéon | [WM] `WarMapSplitScreen` | catbox 5fxlvp / 88k2gg |
| Overlay dynamique réutilisable (titre/stat/citation/jetons) | 6 blocs composables semi/fullscreen | [WM] `WarMapOverlayDynamic` (TitleReveal, Kicker, TokenRow, StatCountUp, QuoteType, BadgeRow) | P3+P4, validé Aziz |
| Une question-pivot qui suspend le récit | typo massive plein écran (pulse) | [WM] `WarMapOverlayDynamic` mode fullscreen | Acte1 hooks |

---

## LES 4 REGISTRES DE FOND (décodés hera.video — « quel background ? » résolu)
Le fond se choisit selon le registre éditorial, pas au hasard (anti-retour-en-arrière) :
1. **Parchemin clair** (`#e4ddca` + grille or-sable) — éditorial/documentaire premium. Réf : `ProtoEffect_MapDrawParchemin`.
2. **Carte estompée claire** — quand la géo est le CONTEXTE d'un chart. Réf : `ProtoHera_ChartOnMap`.
3. **Terminal néon noir** (`#0c0c0e` + grille + glow) — marché/tech/data brute (PAS l'éco-politique premium).
4. **Sketch/whiteboard** (papier + trait crayon) — registre chaleureux/pédagogique. Réf : `ProtoHera_Sketch`.
Détail + palettes : [[decode-hera-templates]] + README `out/_r-and-d/decode-hera/`.

⭐ **PALETTE DE BACKGROUNDS VALIDÉE (images de réf, palette FERMÉE)** : `public/_shared/refs/backgrounds/`
(`_PALETTE-BACKGROUNDS.md`). 4 fonds PURS validés Aziz 2026-06-19 : parchemin-clair ⭐ (défaut éditorial), dots-navy ⭐,
parchemin-kraft, uni-navy. **Pour un storyboard,
on PART de cette palette** (l'agent choisit dedans, n'invente pas un fond → identité visuelle stable). Génération
dual-gen : Gemini RESPECTE le fond imposé (outil du contrôle de fond) · GPT-image le fait AUSSI mais il faut le
mettre en 1ʳᵉ phrase + formulé négatif (« LIGHT … NOT dark/navy »). TOUJOURS les 2 modèles (2 directions à comparer).
Fonds clairs/épurés = génération fiable ; fonds sombres/chargés = risque de texte parasite (prompt court + « no other text »).

⚠️ **Registre → composant qui sait le faire** (ne pas abandonner un registre parce que LE composant scanné
ne l'offre pas) : un **chiffre-choc sur PARCHEMIN** → `ChiffreChoc` avec `bgColor="#e4ddca"` (fond libre), PAS
`OrAfricainStat` (qui n'a que `noir`/`navy`). Le registre décide le composant, pas l'inverse. Si aucun composant
n'offre le registre voulu, le signaler/l'ajouter — ne pas silencieusement basculer sur noir.

---

## ⛔ REJETS PROUVÉS — DÉJÀ ESSAYÉ, ABANDONNÉ (ne pas re-tenter)

> Aussi important que ce qui marche : ces formes ont été testées ET écartées, avec la raison. Les re-proposer = refaire une erreur déjà payée. Si une de ces formes semble tentante, relire la raison AVANT.

**Carte / Mapbox :**
- **`drawFlagCanvas` pour un drapeau visible** → déforme (étoile Maroc cassée, Chine en aplat). → `useClipFlags` (vraies images). Exception unique : `WavingFlagFill` sur 3 bandes unies.
- **`flyTo` / `easeTo` en headless** → casse le render (~5fps, KO). → `jumpTo()` + center/bearing frame-driven.
- **Filtrer un pays par `'name'`** → polygone reste gris/vide en headless (a touché 7 templates). → `countryFilter(iso,…)`.
- **Charger images async sans `delayRender`/`continueRender`** → 1er frame rend avant chargement → polygone vide. → précharger les canvas AVANT init carte.
- **SFX en `{frame===X && <Audio/>}`** → silence en render. → wrapper dans `<Sequence durationInFrames={20-30}>`.
- **Pitch 3D pour du relief sur carte plate** → frames identiques, aucune profondeur. → `camCountryApproach` (inclinaison caméra, pitch 32) si vraiment besoin.

**War-Map / overlay :**
- **`semitransp` (voile < 0.5)** → « on voit la carte à travers ». Voile ≥ 0.62 ou plein écran opaque.
- **Forcer un concept ABSTRAIT sur la carte** (métaphores plaquées, liens qui se tracent pour un accord) → faible. → sortir en `WarMapDimmedOverlay`.
- **SVG plat monochrome sur carte** (1ère passe P2) → rejeté 4/10. → grammaire causale (jetons + sillage + contour).
- **Légende factions / timeline graduée permanentes** (Acte1 legacy) → registre dashboard, tue le hook. Supprimées.
- **Poussière diffuse / dust devil top-down** → ni SVG ni PixelLab ne rendent le diffus top-down (confirmé 2×).

**Atlas / sprites :**
- **Bataille en rectangles/blocs top-down** (copie BazBattles) → « un rectangle reste un rectangle », sans identité. → nos jetons/sprites.
- **Sprites PixelLab pour jetons trait-fin** → effets denses chaotiques. → Gemini (trait fin) ou SVG animé par code.

**En attente d'arbitrage Aziz (ni acquis ni rejet) :** jetons en losange/octogone vs cercle (test A/B non tranché).

---

## CATALOGUES DÉTAILLÉS (fiches techniques — consultés APRÈS, pas en premier)
- `src/projects/_shared/COMPOSANTS-INDEX.md` — Souverain (déjà « Quand Aziz dit »)
- `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` + `MAPBOX-COMPOSANTS.md` — carte vivante
- `src/projects/_shared/hooks-lib/HOOKS-LIBRARY-CATALOGUE.md` — hooks
- `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` · `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`
- `memory/tools/CATALOGUE-GEMINI.md` — assets data-viz Gemini
- Protos Hera (motion-design validé) : `src/projects/_proto-16-9/ProtoHera_*` + `ProtoHeraFidele_*`
