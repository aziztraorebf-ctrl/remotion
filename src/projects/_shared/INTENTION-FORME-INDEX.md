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
> l'écran ? je le PROLONGE) · 3.Forme (quel geste porte l'intention ?) · **3bis.MOTEUR** ·
> 4.Template (ici) · 5.Épure (retirer ce que la voix dit déjà) · 6.Calage (image ~1s avant le mot-clé).
>
> ⛔⛔ **ÉTAPE 3bis — QUEL MOTEUR ? À NE JAMAIS SAUTER** → `memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md`
> Entre la FORME et le TEMPLATE, il y a le **REGISTRE D'EXPRESSION** : carte réelle (Mapbox) · géométrie
> calculée (D3) · objet/processus/métaphore (SVG) · un acteur humain (stick-figure) · **matière filmée
> (MiniMax H3)** · **le RACCORD / le montage** (on a le droit de QUITTER la carte, de couper, d'alterner).
> Sauter cette étape = rabattre la scène sur le moteur déjà en tête, et produire une redite du beat
> précédent. **Vécu 2026-08-15** (storyboard Gazoduc 4B entièrement en tracés/flèches : le brief
> n'ouvrait aucune autre porte, donc les modèles n'en ont trouvé aucune).
> La doctrine donne l'**AMPLITUDE PROUVÉE** de chaque moteur + les **8 trous** que rien ne couvre.

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

> 🔗 **DEMANDES COMPOSÉES (Aziz demande souvent 2 choses dans le même beat).** La table liste les formes une par une, mais un beat en combine souvent deux. Règle de composition : une forme = un **calque** (base) + des **overlays** ancrés par-dessus. Patterns prouvés :
> - **Carte qui fait X + plaque/donnée à côté** → la plaque (`GeoCountryPlaque`, etc.) se passe en `children`/overlay du composant carte (ex: `ResourceTextureFill` + plaque en enfant) — 1 seul beat, plaque ancrée au pays.
> - **Cortège qui traverse + plusieurs étapes géo** → `FormationMarch` (la formation) sur un path à waypoints (Niani→Sahara→Mecque) — les deux axes se cumulent, ne pas choisir l'un OU l'autre.
> - **Concept sur carte + texte solennel** → `WarMapDimmedOverlay` (base assombrie) + `WarMapOverlayDynamic` (bloc texte par-dessus).
> Si la composition n'a pas de pattern ci-dessus : base = l'élément SPATIAL (carte), overlays = les éléments CONCEPTUELS (data, texte), jamais l'inverse.

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
> ⚠️ **Pivot OBJET ou CHIFFRE ?** (lève l'ambiguïté avec la ligne « chiffre qui FRAPPE » ci-dessus) : si un objet physique signifiant s'impose (pièce, baril, tour) → Data-Hero objet. Si le centre EST le nombre (PIB, réserve) sans objet évident → Data-Hero où **le pivot est la typo monumentale verrouillée au centre + count-up à l'entrée**, données en satellites. Un simple `BigStat`/`CountUp` plein écran (sans satellites) suffit seulement si AUCUNE donnée ne contextualise.
| **2 récits/vérités opposés qui basculent** | **pièce 3D qui se retourne** | [S] `CoinFlip.tsx` (props `custom` par face, `rotateYExternal` sync voix) | catbox qx51mw, validé Aziz |

### Faire RESSENTIR une TENDANCE / évolution chiffrée
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Une courbe qui monte/descend dans le temps | line chart qui se trace | ⭐ `ProtoHera_ChartsParchemin` (line, parchemin), ⭐ `HeraFidele_V12_LineChart` (bande highlight, modulable couleur) | _proto-16-9 |
| Comparer 2 grandeurs (A vs B) | bars / poll-bar | ⭐ `ProtoHera_ChartsParchemin` (bars, poll), `DualStat`, `StatComparisonGrid` | _proto-16-9 / COMPOSANTS § COMPARAISON |
| Répartition d'un tout (parts) | donut | ⭐ `ProtoHera_TerminalNeon` (donut glow, registre marché/tech) | _proto-16-9 |
| Présenter des données (registre encre SVG, plein écran) | grille de données + graphiques encre qui se construisent | `GridBackground` + `InkBarChart`/`InkDonutChart`/`CounterEncre` (Vox grid) | COMPOSANTS-INDEX § DONNÉES |

### Faire RESSENTIR la GÉOGRAPHIE / le territoire
> ⭐ **RÉPONSES PAR DÉFAUT, ne pas réinventer :** drapeau sur un pays **avec PITCH (relief V5)** = **`MapboxCountryFlagDecal`** (source image découpée à la silhouette — la SEULE qui ne dérive ni ne carrelle, prouvé 2026-06-21) · drapeau sur carte **plate** (pitch 0) = `useClipFlags` (images HD, JAMAIS `drawFlagCanvas`) · annoncer un pays avec donnée+source = `GeoCountryPlaque`. Filtrer un pays = `countryFilter(iso,…)` par **ISO**. Relief = `camCountryApproach()` pitch ~32.
> ⛔ **PROJETER UN DRAPEAU — 3 méthodes, 2 pièges** (doctrine `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`) : SVG clippé (`useClipFlags`/`MapboxFlagFill`) DÉRIVE au pitch · fill-pattern (`addCountryFlagFill`) CARRELLE au dézoom · ✅ source-image découpée (`MapboxCountryFlagDecal`) = robuste. Hiérarchie pays : aplat uni (neutre) / couleurs nationales (secondaire) / drapeau complet (héros).

| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Situer un pays/lieu | globe + reveal | [C] `GlobeCountryReveal(Mapbox)`, `FlagPin` | COMPOSANTS § CARTE |
| Un pays prend son **vrai** drapeau (carte avec PITCH) | source image drapée sur silhouette | [C] ⭐ **`MapboxCountryFlagDecal`** (défaut V5, zéro dérive/carrelage) ; carte plate → `useClipFlags`/`SequentialFlagReveal` | CARTO-OVERLAYS-PRINCIPES |
| Marquer un POINT précis sur la carte (gisement, site, événement) | jeton hexagonal géo-ancré (taille zoom-driven) | [C] ⭐ **`GisementMarker`** (`GisementTokens.tsx`) : kinds gas/oil/sonar/flag/seal, SVG via `llm-gen-svg.py` | CARTO-OVERLAYS-PRINCIPES |
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
| Des flux/connexions/corridors entre lieux | arcs / route animée + sprite | [C] ⛔ **DEUX composants portent le nom `GeoFlowConnection`, contrats OPPOSÉS** : `_shared/mapbox/GeoFlowConnection` = sprite **orienté** (`sprite="plane"\|"cargo"\|"dot"\|"none"`, cargo top-view, exige **pitch≈0**), dormant · `warmap/_shared/GeoFlowConnection` = marqueur **NON orienté** (point lumineux, `markerProgress` découplé du tracé), **publié Soudan**. Vérifier le chemin d'import. Aussi : `GlobalPulse`, `FlowArrowsMap` | CATALOGUE l.143 |
| **Montrer qu'un flux PASSE À CÔTÉ de / ÉVITE quelque chose (contournement, mise à l'écart)** | **comète UNIQUE non bouclée**, lente et suivable des yeux, sur un trajet **composite** (jalons concaténés à la volée : tracé existant + point de destination) — pendant que la route évitée **se vide de ses impulsions** | ⚠️ **≠ `Impulsions`** (pluie de particules en boucle = « ça circule ») : ici UNE seule tête qu'on suit, sinon l'œil ne lit pas le trajet. ⛔ Ne PAS rendre un contournement par un changement de couleur — *contourner est un MOUVEMENT* (cf contre-preuve [[CONTINUITE-SCENE-INTENTION-DABORD]]). **proto**, 1 usage : `souverain/gazoduc-aagp-tsgp/GazoducActe4Objectifs.tsx` (jalons + rendu inline, pas encore extrait). Validé Aziz, FINAL 2026-08-15 | ce fichier |
| **Un OBJET (navire/avion/véhicule) se déplace le long d'un chemin** | sprite positionné + **orienté par la tangente** du tracé | ⚠️ **4 implémentations indépendantes** (audit 2026-08-15, chemins + imports vérifiés sur disque) : ⭐ **[2] `atlas/_shared/geoUtils.ts` = LE CANON** (`positionAlongRoute`/`bearingAlongRoute`/`rotationFromBearing`/`caravanePositions`, lon-lat turf, 337 l.) — seule à passer les 3 filtres : module `.ts` pur avec **projection injectée** (`proj`, donc réutilisable hors Atlas), ✅ **livrée en épisode** (`atlas/peste-1347/Beat5MaliVivant.tsx`), importée par **14 fichiers dont les 4 templates travel-map**. C'est elle que `GoldRoute8Dir` (sprite 8 directions + walk-cycle, le modèle le plus abouti) importe réellement · [1] `travel-map/pathUtils.ts` (55 l., Catmull-Rom en % écran, zéro dép.) = **fallback léger** pour un chemin décoratif sans géo réelle — plus SIMPLE, pas plus abouti, 2 consommateurs seulement · [3] `_shared/mapbox/GeoFlowConnection` (558 l.) ⛔ non isolable (primitive + carte + caméra + city markers mêlés, exige pitch≈0) · [4] `MilitaryMarchLine` (344 l.) ⛔ **à déprécier** (`getPointAtLength` local dupliqué, `MAP_WIDTH=1080` 9:16 figé, objet = emoji, viole R-OBJ-2). **Manque réel** = l'adaptateur entre espaces (% écran ↔ lon-lat ↔ coords d3 pré-projetées type `aagpFullPath` du Gazoduc Acte 2) + l'ancrage taille au zoom (R-OBJ-1). ⛔ **Ne PAS coder une 5e version** : unifier au 1er vrai usage (Acte 4/5), jamais dans le vide | ce fichier |
| Données ancrées à un point sur la carte | popup geo | [C] `GlassmorphismGeoPopup` | CATALOGUE-CARTE-VIVANTE |
| Couper vers un insert puis revenir à la carte | cutaway plein écran (4 modes) | [C] `MapCutaway` (texte/stat/image/flag, typewriter) | CATALOGUE l.28 |
| **Montrer CE QUI TRANSITE dans un tracé** (gaz, pétrole, minerai) — la carte ne montre qu'une ligne | insert « coupe » ancré sur le tracé + impulsions qui circulent | [P] ⭐ **`ProtoInsertMatiereConduite`** (clip H3 en boucle dans un cadre + sens de lecture SVG) — proto validé, à extraire en composant au 1er vrai usage | INSERT-MATIERE ci-dessous |
| Distinguer N pays sans charger la carte | 1 contour coloré par pays + pulse | [WM] `SAHEL_COUNTRY_COLORS` (moteur, contours tracé-in) | WARMAP-COMPOSANTS |
> ⚠️ Carte/contour/contagion : **toujours préférer Mapbox 3D frame-driven** (mouvement caméra) aux repros SVG plates. Hooks d'ouverture carto : `KineticMaskSlam`, `FiberOpticFlagInvade` (voir hooks-lib).

#### INSERT-MATIERE — clip vidéo ancré géographiquement sur une carte (pattern, PAS encore un composant)

**Le pattern** : carte assombrie + **pin/point géo-ancré qui pulse** (projection réelle, suit la caméra)
+ **connecteur pointillé qui se trace** du point vers le cadre + **cadre insert** contenant un clip en
`<Loop>` + `<OffthreadVideo>`. L'insert se SUPERPOSE à la carte, il ne la pousse jamais.

⛔ **Copié-collé à la main dans 3 fichiers, jamais importé** (audit EXTRACTOR 2026-08-14) :
`_rnd/svg-scenes/GazoducH3IntegrationTestReal.tsx` (R&D de référence) → `souverain/gazoduc-aagp-tsgp/GazoducActe3CarteTSGP.tsx`
L794+ (**production**, commentaire au code : « mécanique reprise TELLE QUELLE du prototype validé ») →
`_rnd/svg-scenes/ProtoInsertMatiereConduite.tsx` (cette session, variante : ancrage sur le **TRACÉ**
plutôt que sur une ville). **3e occurrence = seuil de duplication dépassé — extraire en composant au
prochain usage réel**, pas dans le vide (même règle que les 4 implémentations de sprite-sur-chemin
ci-dessus). ⚠️ Ne PAS coder une 4e variante sans extraire.

**Ce qui va DANS le cadre** — familles identifiées, seule la n°1 est testée :
1. ⭐ **La matière** (testé, validé) : ce qui transite dans le tuyau — gaz, pétrole, minerai, grain.
2. Le mécanisme en coupe : vanne, compresseur, turbine, écluse (cf `STRUCTURE-OBJET-MECANISME`).
3. L'échelle humaine ponctuelle : silhouette qui donne la mesure — ⛔ jamais de visage lisible, jamais
   de dialogue (écarté par Aziz : « faudrait faire attention avec ça »).
4. La conséquence (contrechamp) : compteur, facture, station à sec — la carte montre la cause,
   l'insert montre l'effet chez les gens.
5. Transition d'échelle carte → insert plein cadre → carte : **climax de rythme, à garder rare**.

**Produire l'asset** : chaîne **Gemini 3.1 Flash image (composition verrouillée) → MiniMax H3 R2V
(turbulence seule)**, 0 crédit. ⛔ **Jamais en T2V** — le modèle recompose la scène et on ne contrôle
plus rien. Règle de partage : **composition + géométrie = NOUS** (déterministe) · **turbulence +
matière = H3**. Si le mouvement est géométrique (translation, tracé, compteur) → SVG maison, H3
n'apporte rien. Détail + mesures + gotchas : `memory/tools/minimax-h3-comfy-cloud.md` § INSERT MATIÈRE.

⚠️ **Le sens de lecture ne se négocie pas avec le modèle** : H3 fait *bouillonner* la matière mais ne
tient pas une direction demandée. Porter la direction en SVG déterministe par-dessus (impulsions le
long du tracé, flèche, dégradé qui progresse) — c'est ce que fait `ProtoInsertMatiereConduite`.

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
| Un cortège/caravane traverse un territoire | file de sprites décalés sur path courbe | [A] **canonique** : `caravanePositions()` (`atlas/_shared/geoUtils.ts`) + `FormationMarch` (`src/projects/atlas/_blueprints/formation-march/`) OU templates `_shared/templates/travel-map/GoldRoute*`. ⚠️ `_reference-atlas-poc/composants-tsx/AnimatedCaravan.tsx` EXISTE (contrairement à ce que disait cette ligne avant le 2026-08-15) mais reste **POC hors-prod, non porté délibérément** : imports locaux au POC non résolus depuis `src/`, rend des dots (viole R-OBJ-2). Sa fonction utile est déjà extraite dans `geoUtils.ts` — ne pas le porter | ATLAS-COMPOSANTS §3 |
| Voyage multi-villes (A→B→C→D) | waypoints + sprite tourne par direction | [A] blueprint `WaypointMarch` | _blueprints |
| Un affrontement / 2 forces convergent | chorégraphie file→ligne→charge→clash, OU confrontation face-à-face | [A] `AtlasV2ArmyDeployScene`, `AtlasV2ConfrontationScene`, blueprint `Alliance` | ATLAS-PLAYBOOK §3 |
| Un mouvement tactique (flèche, tenaille) | arc géodésique marching-ants + tête mobile | [A] `AtlasAttackArrow`, `AtlasEncirclement` | _shared atlas |
| Un empire qui grandit | stroke-dashoffset path + fill fade | [A] blueprint `EmpireExpansion` | _blueprints |
| Un territoire qui s'effondre (choc) | Dutch tilt + shake + désaturation continent | [A] blueprint `ShakeImpact`/`DutchTiltCollapse` + grisaille narrative (lerp RGB sauf protagoniste) | _blueprints / ATLAS-PLAYBOOK §3 |
| Nommer un lieu / chiffre-impact (registre Atlas) | pill Cormorant spring · cartouche Cinzel wobble · pulse-marker radar | [A] `AtlasLabel`, `AtlasCartouche`, `AtlasPulseMarker` | atlas-components |
| L'échange (sel↔or) / insert chiffré sur carte | dim carte + boîte parchemin double-cadre glow | [A] `SpotlightInsert` (Ghana — à extraire en composant) | ATLAS-PLAYBOOK §3 |
| Un personnage qui VIT une scène SVG encre (marche, se penche, ramasse) — PAS sur carte | stick figure d'encre animé par code (frame-driven) | ⭐ `StickRig` + scène-proto `RecolteAuSol` (`_shared/personnage-vivant-svg/`) | PERSONNAGE-VIVANT-INDEX |
| Dialoguer (2 personnages échangent) | 2 personnages face-à-face + bulle de parole | ⭐ **stick figure de profil** ×2 face-à-face + bulle courte (⛔ la bulle ne doit JAMAIS répéter la voix off — elle porte ce que la voix NE dit pas). GeminiRig écarté en prod | COMPOSANTS-INDEX § CITATION/TEXTE FORT · PERSONNAGE-VIVANT-INDEX |
| Montrer un écran/interface (données, tableau de bord) qu'un personnage regarde | écran/tableau de données + personnage devant | `DataScreen` + ⭐ **stick figure de profil** devant (GeminiRig écarté en prod) | COMPOSANTS-INDEX § DONNÉES · PERSONNAGE-VIVANT-INDEX |

### Faire RESSENTIR du CONCEPTUEL sans quitter la carte  ← ⭐ CATÉGORIE WAR-MAP (manquait)
> Voir **RÈGLE MAÎTRESSE 2**. Composants dans `src/projects/warmap/_shared/` — chemins exacts + props : `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md`. ⛔ `semitransp` BANNI (voile < 0.5 qui montre la carte derrière). Plein écran = masquer carte Mapbox ET contours moteur. Combiner l'ARSENAL (jetons + zones + contours + plaques), jamais 1 seul asset. CAUSE avant EFFET (jamais pop magique). Registre grave/solennel = voile plus dense + montée lente + 1 plateau tenu (halo qui respire).
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
  ⚠️ Vaut pour un **OVERLAY qui REMPLACE** la lecture de la carte. Un **INSERT qui s'y SUPERPOSE** obéit à un autre seuil (0.40 unique · 0.22 multi) — voir § INSERT MATIÈRE / § INSERT LIEU plus bas. Ce n'est pas une violation de cette règle.
- **Forcer un concept ABSTRAIT sur la carte** (métaphores plaquées, liens qui se tracent pour un accord) → faible. → sortir en `WarMapDimmedOverlay`.
- **SVG plat monochrome sur carte** (1ère passe P2) → rejeté 4/10. → grammaire causale (jetons + sillage + contour).
- **Légende factions / timeline graduée permanentes** (Acte1 legacy) → registre dashboard, tue le hook. Supprimées.
- **Poussière diffuse / dust devil top-down** → ni SVG ni PixelLab ne rendent le diffus top-down (confirmé 2×).

**Atlas / sprites :**
- **Bataille en rectangles/blocs top-down** (copie BazBattles) → « un rectangle reste un rectangle », sans identité. → nos jetons/sprites.
- **Sprites PixelLab pour jetons trait-fin** → effets denses chaotiques. → Gemini (trait fin) ou SVG animé par code.

**En attente d'arbitrage Aziz (ni acquis ni rejet) :** jetons en losange/octogone vs cercle (test A/B non tranché).

---

## ⭐⭐ INSERT MATIÈRE — montrer ce qui TRANSITE dans un tracé (proto validé 2026-08-15)

> **Intention** : une carte ne montre qu'une **ligne**. Elle ne dit jamais ce qui passe DEDANS — le gaz
> sous pression, le pétrole, le minerai. L'insert matière ouvre la conduite sans quitter la carte.
> **Statut : PROTO validé, pas encore composant.** À extraire en composant paramétré au 1er vrai usage
> en épisode (règle : on généralise après un 2e cas réel, pas sur un seul exemple).
>
> Fichier : `src/projects/_rnd/svg-scenes/ProtoInsertMatiereConduite.tsx` · composition Remotion
> `Proto-InsertMatiere-Conduite` · rendu de référence :
> https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/proto-insert-matiere-v2-U9B1wXTxnFniC3p65Vi3hPpeTFMjpd.mp4

**Les 4 briques qui font l'effet** (c'est la COMBINAISON qui marche, pas le clip seul) :
1. **Le clip H3 en boucle** dans un cadre ancré — la turbulence de la matière, seule chose que H3
   apporte vraiment (`<Loop>` sous la durée réelle du clip, jamais la dernière frame → écran noir).
2. **Le pin géo-ancré sur le TRACÉ** (pas sur une ville) + connecteur tracé jusqu'au cadre : c'est la
   conduite qu'on ouvre, à un point qui existe réellement sur la géométrie.
3. ⭐ **Les impulsions qui circulent le long du tracé** (petits cercles cyan, période commune avec le
   balayage) — c'est ce qui fait lire le tracé comme *vivant et orienté*, pas comme un trait mort.
4. ⭐ **La bande claire qui balaie la coupe** (`linear-gradient` + `mixBlendMode: screen`) — donne le
   SENS DU TRANSIT que le clip ne porte pas (H3 fait bouillonner sur place, cf `minimax-h3-comfy-cloud.md`).

**⛔ La règle de partage qui fait tenir l'ensemble** : **turbulence + matière = H3** ·
**composition + géométrie + DIRECTION = NOUS** (SVG déterministe). Tout ce qui est géométrique
(translation, sens de lecture, tracé qui se dessine, compteur) se code — ne jamais le négocier avec le
modèle : coût GPU, résultat incertain, et non réglable à la frame.

**⚠️ Voile à 0.40, PAS ≥0.62** — ne contredit pas la règle War-Map ci-dessus (« voile ≥ 0.62 »), qui vise
un overlay qui doit **remplacer** la lecture de la carte. Ici l'insert se **superpose** : la carte doit
rester lisible derrière pour que l'ancrage géographique survive. Cas d'usage différent, seuil différent.
Corollaire mesuré : au-delà de ~2.0× de zoom sur un tracé saharien, le cadre finit sur du vide sans repère.

### 📦 ASSETS INSERT DÉJÀ PRODUITS ET VALIDÉS — réutiliser avant d'en générer un nouveau

> Tous dans `public/_rnd/minimax-h3-tests/insert-matiere/` (image source `*-source*.png` + clip
> `*-r2v-v1.mp4`). **Garder l'image source** : c'est elle qui permet de re-générer une variante
> cohérente plus tard, et c'est elle qui verrouille la composition.

| Asset | Fichier clip | Statut | Sert |
|---|---|---|---|
| **Gaz sous pression** (conduite pleine) | `conduite-gaz-r2v-v1.mp4` | ✅ validé — 75× décor/matière | Gazoduc Actes 2-3, « ce qui transite » |
| **Billets qui se consument** | `billets-r2v-v1.mp4` | ✅ validé — flammes+fumée, fond 0.03 | Acte 5 (facture européenne), coût d'un projet |
| **Conduite qui se vide** | `conduite-vide-r2v-v1.mp4` | ✅ retenu (dérive assumée) | ⭐ Acte 4 Gazoduc — les 70% siphonnés |
| **Torchère** (gaz brûlé en pure perte) | `torchere-r2v-v1.mp4` | ✅✅ meilleur score — 36× flamme/tour, taille ±6%, boucle 1.1× | Gaz gaspillé faute d'export, gisement qui brûle |

⭐⭐ **VERROUILLER UN NIVEAU / UNE TAILLE = interdire les DEUX sens** *(gabarit copiable : `memory/tools/H3-PROMPT-BLOCKS.md` — source de vérité du TEXTE de prompt ; ici on garde le POURQUOI)* (leçon payée sur `conduite-vide`,
validée du 1er coup sur `torchere`) : n'interdire que « never grows » laisse le modèle faire décroître.
Écrire un bloc **SIZE LOCK** explicite (« same size in the last frame as in the first frame, never grows
AND never shrinks ») + **jamais d'adjectif de jugement** (insufficient, scarce, failing) — un adjectif
d'état est joué par le modèle comme une ACTION à mettre en scène.

⭐⭐ **CONTINUITÉ VISUELLE — réutiliser la MÊME image source d'un insert à l'autre** (retour Aziz
2026-08-15) : `conduite-gaz` et `conduite-vide` partent du même objet dessiné dans le même registre,
seule l'animation diffère. Résultat : les deux inserts se répondent et **construisent un langage
visuel** au lieu d'être deux vignettes isolées. Appliquer par défaut — décliner une image source
existante (même objet, autre état) plutôt que d'en générer une repartant de zéro.

⚠️ **H3 génère TOUJOURS une piste audio** (node `VAEDecodeAudio` du graphe) — musique/SFX parasites
sans rapport. **Toujours monter le clip muet** (`<OffthreadVideo muted />`, déjà le cas dans le proto) :
notre son vient de notre propre pipeline. Non bloquant, mais ne jamais l'oublier à l'intégration.

**Familles ouvertes par la même chaîne** (non encore testées) : pétrole qui remplit, minerai sur tapis,
eau derrière un barrage, fumée d'usine.

---

## ⭐⭐⭐ INSERT LIEU — montrer l'INSTALLATION, pas la matière (validé 2026-08-15)

> **La correction la plus importante de la série d'inserts** (Aziz) : pour un GISEMENT, un SITE, un
> PORT, un barrage — ce n'est pas une matière qu'on montre, c'est un **lieu équipé**. Trois vignettes
> de fluide (gaz doré, pétrole noir) se ressemblent ; **trois installations se distinguent par leur
> SILHOUETTE avant même la couleur**. L'insert matière reste juste pour une conduite (une conduite
> n'a rien d'autre à montrer que son contenu) — pas pour un lieu.
>
> Proto : `src/projects/_rnd/svg-scenes/ProtoTroisGisementsInserts.tsx` · composition
> `Proto-TroisGisements-Inserts` · rendu :
> https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/proto-3gisements-v3-YiniVLBAxDYlWglL6DhtIHhmr3nhdW.mp4

**⭐ N INSERTS SIMULTANÉS : ça marche.** Question posée : 3 mini-inserts côte à côte deviennent-ils une
bouillie ? Non — à condition que **chaque vignette montre un objet de silhouette différente**. Vérifié
sur les 3 champs du Sénégal (assets dans `public/_rnd/minimax-h3-tests/insert-lieux/`) :

| Champ | Installation RÉELLE (vérifiée par recherche) | Ce qui la rend reconnaissable |
|---|---|---|
| **Sangomar** | FPSO *Léopold Sédar Senghor*, VLCC converti, ancré, ~780 m de fond | long navire bas, **seul en pleine mer** |
| **GTA** | FLNG *Gimi* derrière un **hub brise-lames en dur**, ~10 km au large, 30 m | trapu, cuves sphériques, **digue devant** |
| **Yakaar-Teranga** | **jamais développé** | **mer vide + une bouée** |

⭐⭐ **Le plan le plus fort est celui où il n'y a RIEN.** Yakaar (une bouée sur une mer vide, à côté de
deux usines) dit *« personne n'a décidé, il attend »* sans un mot. **Un insert peut porter une ABSENCE** —
et le vide doit alors être VISIBLE (ne pas l'assombrir « pour faire triste » : première version
désaturée = vignette illisible, l'information disparaissait avec la lumière).

**⭐⭐ TEINTE CLAIRE > teinte sombre pour un insert de LIEU** (test A/B mené sur les 3, retour Aziz) :
la version jour est ~3.5× plus lumineuse (161/165/148 vs 42/44/28) et **révèle des détails invisibles
en nuit** (coque bicolore, cuves, blocs de la digue) — décisif en MINI-insert, où une vignette sombre
devient un rectangle noir. ⛔ **Ne PAS généraliser aux inserts MATIÈRE** : conduite/billets/torchère
marchent justement parce que le fond sombre fait ressortir l'incandescence.
**Règle : matière incandescente → nuit · lieu / installation → jour.**
Méthode : `gemini-i2i.py` en CHANGE ONLY (lumière) / PRESERVE EXACTLY (composition, objets, style).

**⚠️ Réglages propres au multi-insert** : voile à **0.22** (et non 0.40 comme pour un insert unique) —
avec 3 ancrages, la carte est le LIANT entre les vignettes, elle ne peut pas reculer autant. Cascade
d'apparition (~1.1 s d'écart) pour que l'œil prenne chaque insert, puis coexistence : c'est là que la
comparaison opère.

**⛔⛔ LE CADRE SE DÉDUIT DU RATIO DU CLIP — ne JAMAIS fixer sa hauteur à la main** (relevé par Aziz
2026-08-15 : « les vidéos ne prennent pas toute la place »). Une hauteur choisie à l'œil donnait une
zone vidéo en 2.64:1 pour un clip en 16:9 → `objectFit: cover` **rognait 32 % de chaque clip**
(haut + bas, mesuré) : un tiers de l'image générée ne s'affichait jamais. Formule :
`videoW = cardW - 2*pad` · `videoH = videoW / CLIP_AR` · `cardH = videoH + 2*pad + labelH`.
Deux pièges qui laissent des bandes noires malgré la formule : (1) mélanger les unités —
padding en `%` (calculé sur la LARGEUR pour les 4 côtés en CSS) avec un label en px ; tout figer en
**px** ; (2) laisser la zone vidéo en `flex: 1 1 auto` — lui donner `width`/`height` **explicites**.
Vérifier au rendu en comptant les lignes/colonnes quasi-noires dans la zone, pas à l'œil.
⭐ Effet : images entières, nettement plus lisibles et plus premium — un asset payé doit s'afficher
en entier.

**⚠️ ANCHOR LOCK — un navire est un objet qui GLISSE de façon crédible** : le SIZE LOCK ne suffit pas,
H3 fait naviguer le bateau (mesuré : −15 px de dérive sur GTA v1). Fix validé : nommer un **repère fixe
de la scène** dans le prompt — *« its distance to the breakwater stays EXACTLY THE SAME in every frame,
bow and stern at the same horizontal pixel positions, it is tied up, not underway »* → dérive 0 px.

---

## CATALOGUES DÉTAILLÉS (fiches techniques — consultés APRÈS, pas en premier)
- `src/projects/_shared/COMPOSANTS-INDEX.md` — Souverain (déjà « Quand Aziz dit »)
- `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` + `MAPBOX-COMPOSANTS.md` — carte vivante
- `src/projects/_shared/hooks-lib/HOOKS-LIBRARY-CATALOGUE.md` — hooks
- `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` · `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`
- `memory/tools/CATALOGUE-GEMINI.md` — assets data-viz Gemini
- Protos Hera (motion-design validé) : `src/projects/_proto-16-9/ProtoHera_*` + `ProtoHeraFidele_*`
