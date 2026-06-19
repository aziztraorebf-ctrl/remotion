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

**Promotion proto → brique** : un proto devient une brique `_shared` seulement s'il est réutilisé ≥2 fois OU
validé par Aziz. Sinon il reste dans `_rnd/` et se purge. Ne PAS coder direct dans `_shared` « au cas où ».

⚠️ Tout `.tsx` de scène (livrable ou proto) doit être enregistré dans `src/Root.tsx` (`<Composition>` + import)
pour être rendu. Une brique `_shared` n'est pas enregistrée — elle est importée par les scènes.

---

## TABLE INTENTION → FORME

Lis la colonne **INTENTION** (ce que tu veux faire RESSENTIR), pas la colonne composant.
⭐ = motion-design validé externe (templates décodés de hera.video, 2026-06-18) — réponse de référence.

### Faire RESSENTIR un chiffre / une ampleur
| Intention | Forme | Réponse(s) | Catalogue détaillé |
|---|---|---|---|
| Un chiffre énorme qui FRAPPE | count-up / odomètre | `CountUp`, `OdometerFlip`, `BigStat`, `ChiffreChoc` | COMPOSANTS-INDEX § CHIFFRE |
| Le chiffre monte SUR une carte (contexte géo) | barre/axe sur carte estompée | ⭐ `ProtoHera_ChartOnMap` (carte claire + barre or) | _proto-16-9 / COMPOSANTS § DONNÉES |
| Une part qui se remplit | jauge | `FillScreen` | COMPOSANTS § CHIFFRE |

### Faire RESSENTIR une TENDANCE / évolution chiffrée
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Une courbe qui monte/descend dans le temps | line chart qui se trace | ⭐ `ProtoHera_ChartsParchemin` (line, parchemin), ⭐ `HeraFidele_V12_LineChart` (bande highlight, modulable couleur) | _proto-16-9 |
| Comparer 2 grandeurs (A vs B) | bars / poll-bar | ⭐ `ProtoHera_ChartsParchemin` (bars, poll), `DualStat`, `StatComparisonGrid` | _proto-16-9 / COMPOSANTS § COMPARAISON |
| Répartition d'un tout (parts) | donut | ⭐ `ProtoHera_TerminalNeon` (donut glow, registre marché/tech) | _proto-16-9 |

### Faire RESSENTIR la GÉOGRAPHIE / le territoire
| Intention | Forme | Réponse(s) | Catalogue |
|---|---|---|---|
| Situer un pays/lieu | globe + reveal | `GlobeCountryReveal(Mapbox)`, `FlagPin` | COMPOSANTS § CARTE |
| Un pays se colore / prend son drapeau | FlagFill frame-driven | `MapboxFlagFill`, `CountryFlagFill`, `SequentialFlagReveal` | CATALOGUE-CARTE-VIVANTE |
| Une frontière se dessine | tracé fibre/laser | `FiberOpticBorderDraw`, `ProtoEffect_MapDraw(Parchemin)` | CATALOGUE-CARTE-VIVANTE / _proto |
| Une influence se propage de pays en pays | contagion par vagues | `DominoContagionFill` (Mapbox 3D, frame-driven) | CATALOGUE-CARTE-VIVANTE |
| Des flux/connexions entre lieux | arcs / flèches | `GlobalPulse`, `FlowArrowsMap` | COMPOSANTS § RÉSEAU |
| Données ancrées à un point sur la carte | popup geo | `GlassmorphismGeoPopup` | CATALOGUE-CARTE-VIVANTE |
> ⚠️ Carte/contour/contagion : **toujours préférer Mapbox 3D frame-driven** (mouvement caméra) aux repros SVG plates.

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

---

## LES 4 REGISTRES DE FOND (décodés hera.video — « quel background ? » résolu)
Le fond se choisit selon le registre éditorial, pas au hasard (anti-retour-en-arrière) :
1. **Parchemin clair** (`#e4ddca` + grille or-sable) — éditorial/documentaire premium. Réf : `ProtoEffect_MapDrawParchemin`.
2. **Carte estompée claire** — quand la géo est le CONTEXTE d'un chart. Réf : `ProtoHera_ChartOnMap`.
3. **Terminal néon noir** (`#0c0c0e` + grille + glow) — marché/tech/data brute (PAS l'éco-politique premium).
4. **Sketch/whiteboard** (papier + trait crayon) — registre chaleureux/pédagogique. Réf : `ProtoHera_Sketch`.
Détail + palettes : [[decode-hera-templates]] + README `out/_r-and-d/decode-hera/`.

---

## CATALOGUES DÉTAILLÉS (fiches techniques — consultés APRÈS, pas en premier)
- `src/projects/_shared/COMPOSANTS-INDEX.md` — Souverain (déjà « Quand Aziz dit »)
- `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` + `MAPBOX-COMPOSANTS.md` — carte vivante
- `src/projects/_shared/hooks-lib/HOOKS-LIBRARY-CATALOGUE.md` — hooks
- `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` · `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`
- `memory/tools/CATALOGUE-GEMINI.md` — assets data-viz Gemini
- Protos Hera (motion-design validé) : `src/projects/_proto-16-9/ProtoHera_*` + `ProtoHeraFidele_*`
