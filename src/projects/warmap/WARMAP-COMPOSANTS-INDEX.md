# WAR-MAP — COMPOSANTS-INDEX ("quand Aziz dit X → utilise Y")

> Catalogue du RÉUTILISABLE du 3e pilier. Miroir de `src/projects/_shared/COMPOSANTS-INDEX.md` (Souverain)
> et `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` (Atlas). Créé 2026-06-05.
> Référencé depuis `WARMAP-INDEX.md`. **Lire AVANT de coder une brique war-map** (réutiliser > recréer).
>
> ⚠️ État : **1 seule instance (Soudan)**. Les briques sont VALIDÉES mais encore couplées au moteur
> (`WarMapEngine.tsx`). Le découplage en composants génériques isolés se fera au 2e sujet (règle :
> généraliser au 2e cas concret, pas au 1er). Ce catalogue dit OÙ est chaque brique aujourd'hui.

---

## ⭐ NOUVEAUX COMPOSANTS `_shared/` — Sahel Session 2026-06-07

> `src/projects/warmap/_shared/` est maintenant CRÉÉ avec 3 composants génériques réutilisables.
> Headless-safe (opacité uniquement, jamais filter:blur), frame-driven (progress via interpolate).
> Différence clé vs AtlasAttackArrow : projection via `map.project()` (Mapbox) et non d3-geo.

| Quand tu veux... | Composant | Où | Props clés |
|---|---|---|---|
| **Flèche tactique qui pousse progressivement** (axe d'offensive, convergence, tenaille) sur carte Mapbox | `SahelAttackArrow` | `warmap/_shared/SahelAttackArrow.tsx` | `map`, `waypoints: [number,number][]`, `progress: 0→1`, `color`, `strokeWidth`, `headType`, `marchingFrame` |
| **Zones de contrôle qui grandissent organiquement** (expansion territoriale, contamination) | `TerritorialExpansion` | `warmap/_shared/TerritorialExpansion.tsx` | `map`, `regions: ExpansionRegion[]`, `startFrame`, `endFrame`, `frame`, `color`, `maxOpacity`. Données Act2 JNIM incluses dans `EXPANSION_REGIONS_ACT2` |
| **Flux de déplacés / migration en rubans animés** (corridors humanitaires, flux population) | `RefugeeFlow` | `warmap/_shared/RefugeeFlow.tsx` | `map`, `flows: FlowCorridor[]`, `frame`, `color`, `baseWidth`. Données Act4 Sahel incluses dans `REFUGEE_FLOWS_ACT4` |
| **⭐ OVERLAY DYNAMIQUE semi-transp/plein écran** (meubler une section vide, ajouter de l'info SANS tout forcer sur la carte — décision Aziz 2026-06-12) | `WarMapOverlayDynamic` | `warmap/_shared/WarMapOverlayDynamic.tsx` | `inAt`, `outAt`, `mode` ("card"=cartouche opaque carte visible autour / "fullscreen"=parchemin opaque ; "semitransp" BANNI), `accent`, `anchorPx` (relier à un point carte), `blocks[]` (déclaratif) OU `children` (libre). **Blocs animés composables** : `TitleReveal`, `Kicker`, `TokenRow`, `StatCountUp`, `QuoteType`, `BadgeRow`. RÈGLE : overlay TOUJOURS dynamique. |
| **⭐⭐ CARTE ASSOMBRIE + ÉLÉMENTS SUPERPOSÉS** (montrer un CONCEPT/accord/data SANS quitter la carte : on l'assombrit, ses contours/couleurs restent visibles, on superpose sceau/drapeaux/titre/schéma par-dessus = spotlight cinématographique — **TEMPLATE PRINCIPAL validé Aziz 2026-06-14, réutilisable largement**) | `WarMapDimmedOverlay` + helper `dimmedOverlayHole()` | `warmap/_shared/WarMapDimmedOverlay.tsx` | `frame`, `inAt`, `outAt`, `width`, `height`, `veil` (0.62), `haloColor`, `centerY`, `children` (la scène superposée). ⚠️ Si contours rendus par le moteur APRÈS l'overlay → percer un TROU (mask SVG) sous l'élément via `dimmedOverlayHole()` (réf : mask `confed-seal-hole` dans SahelWarMapEngine). NE PAS masquer TOUS les contours. Réf : confédération AES P4 (`p4-chantier3-confed-FINAL.mp4`, catbox xt8ztb). Doctrine : `WARMAP-GRAMMAIRE.md`. |
| **⭐⭐ SPLIT-SCREEN — 2 OU 3 mondes côte à côte** (DIVERGENCE/comparaison : carte AES\|data Paris, OU 3 pays/ressources juxtaposés. Incarne la dualité/juxtaposition. **TEMPLATE PRINCIPAL validé Aziz 2026-06-15**, promu R&D P5/P6) | `WarMapSplitScreen` | `warmap/_shared/WarMapSplitScreen.tsx` | `frame`, `inAt`, `outAt`, `width`, `height`, `orientation` (vertical/horizontal), **`panels` (2 OU 3 render-props)**, **`ratios[]` (largeurs, peuvent être ANIMÉES = effet accordéon : 1 volet s'élargit au climax)**, **`panelAppearAt[]` (apparition/remplissage séquencé par volet)**, `labels`, `connector` (traverse la séparation), `sepColor`. Réf 2 volets : CFA (`p4-cfa-FINAL.mp4`, 5fxlvp). Réf 3 volets : RESSOURCES (`p4-ressources-FINAL.mp4`, 88k2gg) — Mali\|Burkina\|Niger, accordéon (Niger s'élargit), pays colorié + icône. ⚠️ Si overlay PLEIN ÉCRAN : masquer carte Mapbox (`MAP_HIDE_WINDOWS`) ET contours moteur (`CONTOUR_HIDE_WINDOWS`) sur la fenêtre, sinon "on voit la carte à travers". Doctrine : `WARMAP-GRAMMAIRE.md`. |

**Showcase de validation** : `MapAnimationShowcase` (composition Root.tsx) — 40s, 3 segments.
Render : litter.catbox.moe/lhgy3u.mp4 (72h, 2026-06-07)

### ⭐ HOOK AES — Sahel Session 2026-06-26 (décode Castile, intégrés au moteur)

| Quand tu veux... | Composant | Où | Props clés |
|---|---|---|---|
| **Un pays s'allume / plante son étendard / affirme sa souveraineté** (drapeau RÉEL qui se plante one-shot avec rebond sec + ondule) | `WarMapBanner` | `warmap/_shared/WarMapBanner.tsx` | `frame`, `fps`, `pos{x,y}` (déjà projeté par le moteur), `flag` (staticFile `_shared/flags/*.png` — JAMAIS `drawFlagCanvas`), `appearAt`, `accent`, `poleH/flagW/flagH`, `yOffset`. ⚠️ Ondulation = **bandes verticales DOM** (background-position + translateY sinusoïdal), PAS clipPath SVG (échoue en headless). |
| **Chiffre/mot géant qui slamme, carte visible À TRAVERS, puis zoom-reveal jusqu'à la carte pleine — SANS amener de 2e carte** (mécanique KineticMaskSlam adaptée à la contrainte « 1 seule Map continue ») | `Acte1IntroSlam` | `warmap/_shared/Acte1IntroSlam.tsx` | `bigText` ("3"), `slamAt`, `revealStart`, `revealEnd`, `veilColor` (parchemin), `ink`. Overlay PUR (voile troué par le texte via mask SVG) au-dessus de la carte du moteur. |

> Intégrés dans `SahelWarMapEngine` (compo `SahelActe1-Refonte`, commit `23a550a`) : hook « détachement+soudure »
> (3 → drapeaux plantés f145/217/286 → détachement vignette → liséré d'union AES). Doctrine décodage : `feedback_decode-castile-warmap-vivante.md`.

### ⭐ CONTOURS NATIONAUX COLORÉS (Sahel, Aziz 2026-06-14) — "touche de couleur épurée"

| Quand tu veux... | Mécanisme | Où | Règle |
|---|---|---|---|
| **Distinguer les pays par une touche de couleur SANS charger la carte** (1 ton par pays sur le contour national, draw-in + pulse aux moments clés) | `countryBorderPaths` (reprojetés/frame depuis `sahel-countries`) + rendu SVG au-dessus du grain + `SAHEL_COUNTRY_COLORS` + `COUNTRY_PULSES` + `CONTOUR_HIDE_WINDOWS` | `engine/SahelWarMapEngine.tsx` + couleurs dans `engine/SahelControlData.ts` | **UNIQUEMENT sur parties ÉPURÉES** (fond mosaïque = porte déjà la couleur, NE PAS ajouter). Contours s'EFFACENT sous tout overlay (jamais de cohabitation = bouillie). Respiration douce. Démo : compo `SahelCountryBordersTest`. |

**Couleurs pays** : Mali `#D98A3D` ocre · Burkina `#C0553C` brique · Niger `#4E8C7D` sarcelle.
**Réutiliser pour P4** : ajouter `partie4` au gate `partie3 || countryBordersTest` + fenêtres overlay P4 dans `CONTOUR_HIDE_WINDOWS`.

---

## 🧩 LES BRIQUES ACTUELLES (dans `engine/`)

| Quand tu veux... | Brique / mécanisme | Où | Règle |
|---|---|---|---|
| **Une carte de contrôle qui bascule dans le temps** (front, dominance, valeur 0..1 par région) | `WarMapEngine` (couche fill data-driven) + `sudanControlData.controlAt()` | `engine/WarMapEngine.tsx` + `engine/sudanControlData.ts` | Polygones admin-1, couleur interpolée par frame. Front glow sur états en bascule |
| **Des véhicules/unités qui avancent sur la carte** | `VEHICLES` + rendu sprite orienté | `engine/warmapVehicles.ts` + `engine/WarMapEngine.tsx` | Sprites Gemini top-down, orientés selon la marche + traînée. Taille ×1.45 |
| **Des personnes/réfugiés/figures qui se déplacent** (côté humain) | `REFUGEES` (jetons-visage mouvants) | `engine/warmapVehicles.ts` | Portrait Gemini en cercle. Sur la carte, jamais plein écran (R1) |
| **Incarner une figure ponctuelle** (chef, victime) | jeton-visage statique (`unitStyle: "token"`) | `engine/WarMapEngine.tsx` | Usage ponctuel/statique, pas pour remplacer les véhicules |
| **Poser une DONNÉE majeure** (chiffre sans équivalent carto : famine, PIB) | `WarMapOverlayData` ⭐ **_shared** | `_shared/WarMapOverlayData.tsx` | Fond SOLIDE parchemin, centré, fige l'action 7-10s. Data-driven (props : kicker, big, unit, sub, tagline, source, accentColor). Plus de dict hardcodé |
| **Expliquer ce qui se passe sur la carte** (exode, contexte) | `WarMapOverlayExplicatif` ⭐ **_shared** | `_shared/WarMapOverlayExplicatif.tsx` | Plaque OPAQUE centrée (jamais en haut), AUCUN voile sur la carte (corrigé 2026-07-11). Props : title, text, topOffset, wobble |
| **Présenter une figure en gros** (portrait + légende) | `WarMapFigureOverlay` | `engine/WarMapDataOverlay.tsx` | Cercle parchemin. (Note : la figure du déplacé est passée en jeton-mouvant, voir R1) |
| **HUD date/horloge/pertes** | bloc HUD dans `WarMapEngine` | `engine/WarMapEngine.tsx` | Date plaque haut, pertes/légende bas, safe zones mobiles. Horloge = polish ouvert (→ JOUR N) |
| **Symbole véhicule SVG** (fallback sans Gemini) | `VehicleSymbol` | `engine/VehicleSymbols.tsx` | DÉPRÉCIÉ par les sprites Gemini. Garder comme fallback only |

## 🎬 2e SOURCE D'ANIMATION — MAPANIMATION (linking, comme Atlas)

> Aziz : mapanimation est notre 2e source d'inspiration d'animation. Les décodages SONT FAITS, les
> templates sont excellents, et ils s'appliquent DIRECTEMENT à la war-map (mouvement de troupes, axes
> d'attaque, flux de réfugiés = leur vocabulaire). À EXPLOITER pour enrichir les beats war-map.

| Quand tu veux... | Ressource (déjà décodée/codée) | Où |
|---|---|---|
| **Une flèche tactique** (axe d'offensive, poussée RSF/SAF) | `AtlasAttackArrow` (flèche géodésique séquentielle) | `src/projects/atlas/_shared/AtlasAttackArrow.tsx` + `AtlasAttackArrowDemo.tsx` |
| **Un encerclement / tenaille / pince** (poche, siège El Fasher) | `AtlasEncirclement` (pincerArrows) | `src/projects/atlas/_shared/AtlasEncirclement.tsx` + demo |
| **Vocabulaire de manœuvre** (colonne, ligne, flanquement, embuscade, repli) | décode BazBattles | `memory/atlas-decode/DECODE-bazbattles-manoeuvres.md` |
| **Catalogue mapanimation premium** (effets, flux, transitions cartographiques) | analyse + catalog | `memory/archive/_r-and-d-mapanimation-PREMIUM-DECODE-2026-06-03.md` + `memory/_r-and-d-mapanimation-catalog.json` + `memory/archive/_r-and-d-mapanimation-ANALYSE-2026-06-03.md` |
| **Faisabilité / verdict d'intégration** (ce qui marche chez nous) | feedback faisabilité | `memory/feedbacks/feedback_atlas-inspiration-externe-faisabilite.md` + `memory/feedbacks/feedback_mapanimation-veille-et-geoflow.md` |

**Note technique (corrigée 2026-07-11)** : ces composants sont d3-geo (socle Atlas). War-Map utilise
Mapbox reskinné en PRODUCTION DÉFINITIVE (tranché 2026-07-11, voir `WARMAP-PLAYBOOK.md` intro — la bascule
vers d3-geo pur n'a jamais eu lieu en 6 semaines et n'est plus envisagée). Ces composants Atlas ne se
brancheront donc PAS directement (pas de friction de projection nulle) — mais leur PRINCIPE de mouvement
(flèche qui pousse, pince qui se referme) reste réutilisable en l'adaptant au rendu Mapbox.

---

## ⭐⭐ MOTEUR D'AFFRONTEMENT 2 FACTIONS — INSERT SVG "ÉTAT-MAJOR" (Session 2026-07-06, validé Aziz)

> ⚠️ **REGISTRE DIFFÉRENT des composants Mapbox ci-dessus.** Ceux du haut (`SahelAttackArrow`,
> `TerritorialExpansion`, `RefugeeFlow`) sont pour la **carte Mapbox réelle** (vidéo AES longue).
> Ce moteur-ci est un **insert SVG pur « médaillon d'état-major »** (Kings & Generals / Battle Probe),
> PAS de Mapbox, PAS de géo réelle. Registre gravé sable/or/rouge, top-down illustré. À utiliser pour
> un beat de **prise de territoire / mouvement de forces / affrontement** où la vraie géo est un
> obstacle à la lecture. Doctrine complète : `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md`.

| Quand tu veux... | Composant | Où | Notes |
|---|---|---|---|
| **Le moteur complet** (factions, formations, choc, front, zones, sceaux, effets) | `warmapChoc.tsx` | `warmap/_shared/warmapChoc.tsx` | Système `Faction` (RSF/SAF = instances, jamais de lettre en dur). Frame-driven pur. |
| **Un pion de faction** (losange biseauté + lettre, lisible à toute échelle) | `FactionToken` | idem | `{faction, heading, scale}`. |
| **Une colonne qui avance** le long d'une courbe (échelon, swagger, poussière) | `AdvancingFormation` | idem | `{origin, front, faction, travelFrames, bow}`. |
| **Une formation qui défend** (arc face à l'assaillant, recule) | `HoldingFormation` | idem | `facing` = arc défensif orienté. |
| **Une flèche de manœuvre** qui se trace (axe, tenaille, encerclement) | `ManeuverArrow` | idem | ⛔ jamais décorative : des jetons DOIVENT suivre la même courbe (`bow` partagé). `dashed`=intention. |
| **Une zone qui bascule** (territoire pris par balayage) | `SweepZone` | idem | Teinte+hachure+bord+`dir`. RÉSERVÉ au basculement territorial, pas à un assaut ponctuel. |
| **Sceau de capture / défaite** | `CaptureSeal` / `DefeatedSeal` | idem | Losange qui s'installe / se barre. |
| **Effets** (impact, fumée, poussière, étincelles de choc, sonar) | `Impact`/`SmokeColumn`/`DustTrail`/`ClashSparks`/`Sonar` | idem | Recolorables, déterministes (zéro Math.random). |
| **Portrait-commandant** (le "qui", FAIBLE densité seulement) | `CommanderMedallion` | idem | ⚠️ règle densité (voir ci-dessous). |
| **Habillage** (cadre, cartouche, légende, sous-titre) | `EmFrame`/`FactionLegend`/`EmSubtitle`/`EmDefs` | idem | Réutilisable. |

**5 variantes d'habillage validées** (= preuve que le moteur est réutilisable) :
- **`KhartoumChocSVG`** (compo Root) — assaut ponctuel : RSF prend le palais, SAF défend puis submergée.
  `out/_rnd/warmap-choc/khartoum-choc-v6.mp4` · catbox `k552fw`.
- **`FrontOuvertSVG`** (compo Root) — front qui bouge : impasse → tenaille qui encercle une poche SAF.
  **Brique directe pour l'Acte 2 Soudan** (impasse militaire). `front-ouvert-v5.mp4` · catbox `1ed8vp`.
- **`TwoFaceToken`** (`warmap/soudan-acte2/TwoFaceToken.tsx`, prouvé, rattrapage 2026-08-07) — alliance de
  2 factions qui fusionne (2 demi-visages soudés) puis se scinde (faille dorée qui vibre → 2 jetons
  distincts). "Une alliance qui fusionne puis rompt" — actuellement câblé sur 2 portraits en dur
  (`faceImg()`), généralisable en passant les 2 sprites en props.
- **`BlocImpasseB6`** (`warmap/soudan-acte2/BlocImpasseB6.tsx`, prouvé, rattrapage 2026-08-07) — colonne de
  chars qui avance en formation, bute sur un front qui se déforme (cloche gaussienne) puis reflue à sa
  position initiale : "une offensive matérielle qui échoue malgré la supériorité de feu". Réutilise déjà
  le socle `warmapChoc.tsx` (EmDefs/EmFrame/ManeuverArrow/ClashSparks/Impact/Sonar).
- ⚠️ **`BlocRapportForce`** (`warmap/soudan-acte2/BlocRapportForce.tsx`, proto — rendu final non confirmé,
  c'est `BlocImpasseB6` ci-dessus qui a été monté dans le livrable) — variante 100% vectorielle/abstraite
  (pas de sprites raster) : "un rapport de force sans lieu précis" — 2 masses géométriques opposées
  séparées par un front qui encaisse 3 vagues et rebondit sans céder. Doctrine "concept sans lieu → BLOC
  pas carte" déjà documentée dans le code.
- **`KhartoumEtatMajorSVG`** (`warmap/KhartoumEtatMajorSVG.tsx`, prouvé, rattrapage 2026-08-07) — insert
  plein écran 856 lignes : "une capitale qui tombe en une seule journée" — 3 cibles fixes frappées en
  séquence STRICTE (jamais simultané), colonne qui converge, impact+fumée+sceau à chaque prise. Isolable
  moyennant généralisation des cibles/positions/fond (actuellement Khartoum 15 avril 2023 en dur).

**3 règles gravées** (détail : doctrine) : (1) une flèche annonce toujours un mouvement ; (2) SweepZone
seulement pour un vrai basculement territorial ; (3) pion-visage à faible densité / bloc abstrait en nombre
(loi de lisibilité qui explique le choix Kings & Generals). Commits `351514e` + `3974235`.

**HOOK d'ouverture Soudan (bonus, même registre encre)** : `OrDarfourHook` (`warmap/soudan-hook/`) — insert
SVG parchemin/encre "l'or du Darfour" (pelle+lingot+fumée de guerre+traînée d'or), pose le fil rouge de
l'épisode. Reskin par remap couleur (`orDarfourGroups.ts`, zéro LLM). Commit `9920643`. À finir (reformuler
accroche, pelle-drapeau, colorisation séquencée). Détail : `memory/projects/soudan-midform-STORYBOARD-ACTE1.md` § HOOK.

## 🗺️ RÉVÉLATION TERRITORIALE SVG 9:16 (Short AES 90s, rattrapage 2026-08-07)

| Quand tu veux... | Composant | Où | Notes |
|---|---|---|---|
| **Révéler une zone territoriale stratégique** (bande frontalière, bassin transfrontalier) | `TerritoryRevealSVG9x16` (généralisation de `LiptakoRevealSVG9x16`) | `warmap/shorts/aes-short-90s/LiptakoRevealSVG9x16.tsx` | Prouvé. Contour qui se dessine + remplissage/surbrillance de zone, carte SVG pure 9:16. Isolable moyennant remplacement du path Liptako-Gourma + labels voisins par props. |
| **Établir le contexte continental avant de recentrer sur une sous-région** | `ContinentOpeningSVG9x16` (généralisation de `AfriqueOpening`) | `warmap/shorts/aes-short-90s/AfriqueOpening.tsx` | Prouvé. Silhouette Afrique qui apparaît puis zoome vers la sous-région du sujet. |

---

## 🌐 GLOBE D3 — briques réutilisables (rattrapage 2026-08-07, Gazoduc + Soudan Actes 3/4/5/6)

> ⛔ **Section absente jusqu'ici** — ce catalogue ne couvrait que le registre Mapbox alors que Gazoduc et
> Soudan utilisent massivement un globe D3 orthographique en SVG pur (projection différente, pas de
> `map.project()`). Socle commun (déjà réutilisé par 3 projets, à ne PAS reproposer comme candidat neuf) :
> `GlobeFlagFill`, `BorderPulse`, `ShockRing`, `SiegeRings`, `DestPoint`, `GeoPlaqueSVG`, `FlagToken`,
> `windingPathD`/`pointAlongWinding` — vivent dans `SoudanActe3GlobeProto16x9.tsx` et `geoArc.ts`
> (`src/projects/_rnd/d3-16x9/`), importés tels quels par Gazoduc et les Actes 3/4/5/6 Soudan.

| Quand tu veux... | Composant | Où | Notes |
|---|---|---|---|
| **Révéler un pays avant qu'un tracé n'en parte/arrive** | `GlobeCountryTraceReveal` | `souverain/gazoduc-aagp-tsgp/GazoducActe1Hook.tsx` (`PaysTrace`, L167-256) | Prouvé. Contour qui se trace lentement (10s) puis se remplit. Utilisé 3× (Nigeria/Maroc/Algérie). |
| **⭐ Rivalité entre 2 tracés concurrents** (2 propositions, 2 routes) | `GlobeArcTravelerMarker` | `souverain/gazoduc-aagp-tsgp/GazoducActe1Hook.tsx` (L278-331, L602-617) | Prouvé. Trajet segmenté sur jalons géo réels + marker "tête de trace" voyageur + label ancré mobile + anti-collision. **Découverte la plus transférable du chantier Gazoduc** — le stagger temporel + couleurs différenciées EST le langage visuel de la rivalité géographique. |
| **Bloc régional multi-pays comme cible commune** (marché, zone de couverture) | `GlobeRegionMaskReveal` | `souverain/gazoduc-aagp-tsgp/GazoducActe1Hook.tsx` (L491-533) | Prouvé. Assombrit tout le globe puis laisse percer la zone avec glow — plus fort qu'un simple contour qui pulse. Itération V2 après retour Aziz ("vu de loin, le glow ne montre pas qu'on parle de l'Europe"). |
| **Caméra qui suit un tracé long automatiquement** (pas de keyframes manuelles) | `MapContinuousFollowCamera` | `souverain/gazoduc-aagp-tsgp/GazoducActe2AAGP.tsx` (`camFor`/`buildFullPathSamples`/`windowBBox`, L155-276) | Prouvé. Bbox glissante recalculée à chaque frame, 4 phases (approche/suivi/ralenti-climax/dézoom). S'adapte à n'importe quelle géométrie de tracé sans recalibrage. |
| **"Qui arme qui"** — N sources convergent vers 1 point | `GlobeArcConvergenceOcclusion` | `_rnd/d3-16x9/SoudanActe4B6Globe.tsx` (L295-410) | Proto. Occlusion 3D réelle (rare en SVG pur) + onde de choc convergente. Généralisable via props `sources[]` + `target`. |
| **Un acteur nommé reste "actif" après nomination** | Frontière qui respire (`BorderPulse` one-shot + glow sinusoïdal persistant) | Répété identique 3× : `SoudanActe4B1toB4Globe.tsx`, `SoudanActe4B6Globe.tsx`, `SoudanActe6Globe.tsx` | Prouvé — répétition 3× SANS jamais être remis en cause = preuve de maturité. Extraction triviale en hook `useBreathingBorder(feature, path, onAt, color)`. |
| **Chef de guerre/acteur nommé incarné sur le globe** | `PortraitToken` (globe) | `_rnd/d3-16x9/SoudanActe5Globe.tsx` (source canonique — dupliqué ensuite dans Acte3/Acte4, doublon confirmé) | Prouvé — répété identiquement 3× (preuve de portabilité forte). Cercle parchemin + bordure couleur-camp + portrait clippé + pulse d'arrivée. |
| **⭐ Route de trafic (or/armes/carburant)** — priorité haute pour Sahel/AES | Corridor de contrebande sinueux (artère + 2 pistes secondaires + checkpoints + convois en boucle) | `_rnd/d3-16x9/SoudanActe5Globe.tsx` (L192-230 calcul + L435-483 rendu) | Proto (système complet à extraire en 1 composant composite `SmugglingCorridor{from,to,waypoints[],checkpointFractions[]}`). Tracé qui SERPENTE (pas un arc géodésique "trop GPS"). Aucun équivalent dans les catalogues — `RefugeeFlow` est un flux de population, forme et intention différentes (corridor = contrôle, pas déplacement humain). |
| **Blocage institutionnel incarné** (UA, CEDEAO, Conseil de sécurité) | `VoteBlockedByVeto` (onde physique + X qui se trace + marteau) | `_rnd/d3-16x9/SoudanActe6VoteInsert.tsx` (216 lignes) | Prouvé — fruit documenté d'une passe DA-brief (Gemini+Kimi, convergence), validé et ajusté après retour Aziz ("trop rapide"). Cascade par distance réelle depuis le siège bloquant, pas un délai arbitraire. |
| **Objet mobile crédible à toute distance caméra** (véhicule sur globe) | Pattern de calibration proportionnelle au zoom (`scale = baseScale * (camScale/calibScale) * reveal`) | `_rnd/d3-16x9/SoudanActe4B1toB4Globe.tsx` (`NavireEncreAuGlobe`, L245-302) | Proto — la vraie valeur est la FORMULE de calibration, généralisable à tout objet posé sur un globe D3 qui doit rester cohérent au zoom (pas le SVG du navire lui-même, déjà indexé ailleurs). |

---

## 📐 CONVENTION DE RANGEMENT (où mettre une nouvelle brique)

Pour ne pas re-disperser le pilier quand il grandit :
- **Brique générique réutilisable** (overlay, marqueur, transition, mouvement) → `src/projects/warmap/_shared/` (À CRÉER au 1er composant vraiment générique, pas avant).
- **Donnée d'un sujet** (jalons, paths, fenêtres narratives) → `engine/<sujet>Data.ts` + `data/<sujet>.warmap.json`.
- **Une instance complète** (Soudan, Lobito...) → aujourd'hui dans `engine/` (Soudan) ; convention cible `src/projects/warmap/instances/<sujet>/` quand on découplera.
- **Un asset** (sprite, audio, géo) → `public/_shared/{sprites/warmap, audio/<sujet>, geo-data/<sujet>}`.
- **Enrichissement mapanimation** → `warmap/_shared/SahelAttackArrow.tsx` (Mapbox, FAIT) ou `AtlasAttackArrow` (d3-geo, Atlas). Ne PAS recoder depuis zéro.

## ⏳ À FAIRE quand le pilier grandit

- ✅ `_shared/` créé avec 3 composants (2026-06-07) — seuil atteint
- Extraire les briques génériques de `WarMapEngine` vers `_shared/` (overlays, HUD, jetons) au 2e sujet.
- **Previews visuelles** (start/mid/end, manifest) — `MapAnimationShowcase` est le premier preview.
- River Flow animation (fleuve Niger SVG animé) — 4e template, priorité basse, non encore codé.
