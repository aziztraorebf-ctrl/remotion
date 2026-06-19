# Index des composants partagés — par cas d'usage
> ⭐ **AVANT cet index : passe par `INTENTION-FORME-INDEX.md`** (déduis l'intention d'abord — doctrine
> [[CONTINUITE-SCENE-INTENTION-DABORD]]). Cet index est la FICHE TECHNIQUE consultée une fois la forme déduite,
> pas un catalogue-vitrine où l'on cherche « quoi mettre ».
> 71 composants + templates Hera (motion-design validé). Source : `src/projects/_shared/components/` + `_proto-16-9/`.
> Format : `NomComposant` → dossier d'import, colonne « Quand Aziz dit » (= l'intention, pas la techno).

---

## CHIFFRE / STAT — afficher un nombre, une statistique

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `BigStat` | inserts | "3.7 milliards dollars extraits" — chiffre énorme 70% écran, minimaliste |
| `CountUp` | ui | "ça monte à 47 milliards..." — compteur animé 0→target avec glow doré |
| `DualStat` | layouts | "X vs Y côte à côte" — deux chiffres en colonnes avec label |
| `PulseNumber` | layouts | "Le chiffre qui pulse" — stat avec animation de pulsation |
| `OdometerFlip` | layouts | "Le compteur monte..." — 8 rouleaux numérotés spinant en cascade |
| `DataCard` | inserts | "Chaque pays exporte sa richesse" — fiche donnée isolée avec source |
| `FillScreen` | layouts | "60% des terres vendues" — barre de remplissage 0→100% progressive |
| `ChiffreChoc` | layouts | Chiffre révélé avec effet choc visuel (impact + hold) |

---

## COMPARAISON — mettre deux entités face à face

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `StatComparisonGrid` | layouts | "France vs RDC GDP" — 2 blocs stats face-à-face, VS central, coins crosshair |
| `ComparisonTable` | inserts | "Chine 6x plus grande que..." — tableau 2 colonnes avec pills cascadants + verdict |
| `SplitScreenSouverain` | layouts | "D'un côté... de l'autre..." — split 50/50 générique Tailwind avec labels |
| `FaceAFace` | layouts | Deux entités en face-à-face avec tension visuelle |
| `WealthScale` | inserts | "Riche en ressources. Pauvre en revenus." — balance de justice déséquilibrée |
| `OsintSplitScreen` | inserts | "Source brute → analyse" — split 50/50 OSINT avec annotations cercles |
| `SurfaceComparison` | inserts | "Voici la vraie taille de l'Afrique" — pays superposés exactement (thetruesize) |
| `CountryStackComparison` | inserts | "On peut faire rentrer la France 4x dans la RDC" — silhouettes empilées |
| `ScaleTilt` | layouts | Deux poids sur une balance qui bascule |
| `ScaleShock` | layouts | Révélation d'échelle avec effet choc (avant/après) |

---

## TIMELINE / PROGRESSION — séquences temporelles, évolution

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `Timeline` | layouts | "En 1960... puis 1975... aujourd'hui" — timeline horizontale avec points clés |
| `TimelineFracture` | layouts | Timeline avec rupture/cassure à un moment pivot |
| `ParadigmShiftTimeline` | layouts | "Tout change à ce moment précis" — timeline avec shift visuel majeur |
| `MilitaryMarchLine` | layouts | "La marche de 2000 km en 40 jours" — progression sur carte avec waypoints |
| `FilRouge` | layouts | "Suivez le fil rouge de l'argent" — nœuds connectés révélés en cascade |
| `TickerTapeHistory` | inserts | "Hier : esclaves. (flash) Aujourd'hui : cobalt." — bandeau historique crossfade |
| `Palimpseste` | layouts | "Routes coloniales VS corridors ZLECAF" — couches SVG animées staggered |
| `LeCadranSolaire` | layouts | Temps qui s'écoule, représentation solaire/cyclique |
| `Stratigraphie` | layouts | Couches historiques révélées comme une coupe géologique |

---

## CARTE / GÉO — géographie, frontières, flux

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `GlobeCountryReveal` | inserts | "Voyons où se trouve le Niger..." — globe SVG + silhouette pays spring |
| `GlobeCountryRevealMapbox` | inserts | Globe Mapbox + reticule pulsant + panel données auto-centré |
| `GlobeLocationReveal` | inserts | Globe Mapbox (3 styles) + dot pulsant + panel optionnel |
| `GlobalPulse` | inserts | "Des flux depuis un point central" — point source + arcs great-circle |
| `GoldVein` | inserts | "Depuis cette mine d'Arlit, les branches..." — zoom Equal Earth → Mercator + veines |
| `EmpireOverlay` | inserts | "Les frontières de l'empire Mali superposées" — Mapbox + GeoJSON historique + villes |
| `MapboxPulse` | layouts | Carte Mapbox avec effet de pulse sur un pays/région |
| `FlowArrowsMap` | layouts | Flèches de flux animées sur une carte |
| `CountryIsolateWithHatch | layouts | Pays isolé avec hachures (mise en évidence) |
| `RadarScan` | layouts | "Balayage des ressources" — radar balayant avec icônes révélées |
| `CountryFlagFill` | inserts | "Le drapeau épouse ses frontières" — drapeau clipé sur silhouette SVG pays |
| `FlagPin` | inserts | "Et voilà : le Sénégal." — drapeau circulaire bounce spring + float idle |
| `OrigamiCarto` | layouts | Carte qui se déplie comme un origami |

### Templates Mapbox CARTE VIVANTE — Chantier C (2026-06-02, hybrides V+H, render via `scripts/render-mapbox.sh`)
> Tous dans `_shared/mapbox/`. Vraie carte Mapbox dessous (drift, altitude pays, océan navy, voisins ivory). Charte navy/gold. **Lire `_shared/mapbox/MAPBOX-COMPOSANTS.md` avant usage.**

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `MapboxFlagFill` | mapbox | "Le drapeau (ou une image/texture) remplit le pays sur la carte" — clip SVG + reprojection frame-driven, carte vivante. `geoName` accepte tableau (Maroc+Sahara). Projette TOUTE image + bichromie 0→1 |
| `MapboxIsolateZone` | mapbox | "On isole ce pays + sa zone offshore" — spotlight (reste assombri) + zone hachurée + badge geo + stat |
| `SequentialBorderPulse` | mapbox | "Les pays X, Y, Z s'allument un par un" — frontières séquentielles synchro syllabe, flash+glow, restent allumées |
| `GlassmorphismGeoPopup` | mapbox | "Afficher des données ancrées au point sur la carte" — encarts navy translucide + bordure or reliés par ligne fine au point geo |
| `SequentialFlagReveal` | mapbox | "Les pays s'allument avec LEUR DRAPEAU un par un" — drapeau clippé séquentiel, reste allumé (technique chaînes). Prop `countries[]` |
| `LottieGeoAura` | mapbox | "Un effet animé premium sur ce site" — Lottie (onde de choc / anneau data HUD / flux) ancré à un point geo. Assets : `lottie/premiumLottieAssets.ts` |
| `SweepRevealTerritory` | mapbox | "Un faisceau balaye le pays et le révèle" — faisceau lumineux gold traverse + révèle la couleur (scanner). Dynamique ⭐ |
| `DominoContagionFill` | mapbox | "L'influence se propage de pays en pays" — couleur contamine par vagues depuis un épicentre (sans flèches). Prop `waves[][]` |
| `FiberOpticBorderDraw` | mapbox | "La frontière se dessine comme un laser" — tracé fibre optique doré (dasharray + glow) puis fill. Salle de contrôle ⭐ |
| `FiberOpticFlagInvade` | mapbox | "La frontière se trace PUIS le drapeau envahit le pays" — séquentiel multi-pays. ⭐ HOOK d'ouverture |
| `FlagFillStatic` ⭐ N1.1 | mapbox/flagCanvas | "Un pays + ses voisins colorés" — 1 drapeau canvas pur + secondaryCountries fill-color. Fondation la + simple. Props: `mainIso`, `secondaryCountries[]` |
| `FlagFillSequence` ⭐ N1.2 | mapbox/flagCanvas | "Les pays du bloc s'allument avec leur drapeau" — drapeaux séquentiels synchro voix. Parfait CEDEAO, Sahel, BRICS. Props: `countries[]({iso,at})` |
| `ResourceTextureFill` ⭐⭐ N2.1 | mapbox/resourceTextures | "Ce pays EST cette ressource" — texture bichromie navy/gold (pétrole/or/phosphate/agriculture/lithium/gaz) projetée dans le polygone. Aucune chaîne africaine ne fait ça. Props: `countries[]({iso,resource,at})` |
| `HeatGradientFill` N2.2 | mapbox | "La production monte / l'intensité augmente" — choropleth dynamique, couleur chauffée selon l'intensité. Props: `countries[]({iso,intensity,palette,rampFrames})`, palettes: PALETTE_PETROLE/RICHESSE/TENSION/GOLD/LITHIUM |
| `WavingFlagFill` ⭐ N3.1 | mapbox/flagCanvas | "Le drapeau ondule dans le pays" — canvas redessiné frame/frame, décalage sinusoïdal. Vie premium du territoire. Props: `mainIso`, `waveAmplitude`, `waveSpeed` |
| `FlagDissolveTransition` N3.2 | mapbox/flagCanvas | "Ce pays passe d'un drapeau à un autre" — crossfade entre fill-patterns. Géopolitique : AES, CEDEAO, occupation. Props: `countries[]({iso,fromIso,toIso,dissolveAt})` |
| `ImageProjectionFill` N3.3 | mapbox | "Projeter cette photo dans le polygone pays" — image bichromisée navy/gold clippée dans la silhouette. Assets Gemini requis. Props: `countries[]({iso,imageSrc,navyColor,goldColor})` |
| `PulsingRegionFill` N3.4 | mapbox | "Ce territoire est sous tension / respire" — zone entière pulse (opacity sin). Différent du dot pulse. Props: `countries[]({iso,color,period,opacityMin,opacityMax,showGlow})` |
| `ContagionFlagSpread` ⭐ N4.1 | mapbox/flagCanvas | "L'alliance s'étend de pays en pays" — flash couleur + drapeau remplace (DominoContagionFill + FlagFill). AES, CEDEAO, BRICS Africa. Props: `waves[][]`, `waveGap`, `flagDelay` |
| `GeoCountryPlaque` ⭐ | mapbox | "Annoncer un pays avec sa donnée ET sa source" — pilule nom + stat gold + source (ex: "$430M — Bloomberg"). Complément aux dots, épuré. + `GeoProgressCounter` (X/N) + `GeoClimaxOverlay` (titre final). Pattern Or Africain. Props: `name`, `stat`, `source`, `appearAt`, `hideAt`, `pos` |
| `useClipFlags` ⭐⭐ | mapbox | "Projeter un VRAI drapeau dans un pays" — hook + `<ClipFlagsLayer>`. Vraies images HD clippées SVG, net à toute échelle (étoile entière, pas carrelé). LA bonne technique drapeau (PAS `drawFlagCanvas` qui est approximatif). Props ClipFlag: `{iso, geoNames, flagFile, at, bgColor, mainlandBox}`. `mainlandBox` obligatoire pour pays à outre-mer (France) |

---

## RÉVÉLATION / TRANSITION — effets d'apparition, wipe, reveal

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `BurnReveal` | layouts | "Une découverte qui brûle..." — flamme animée révélant stat + icon glow |
| `LoomWipe` | layouts | Transition en grille tissage (bandes alternées croisées) |
| `LoomWeaver` | layouts | Grille nœuds colorés + warp/weft lines — alliances qui s'entrelacent |
| `GlitchReveal` | layouts | Révélation avec effet glitch numérique |
| `ArchiveFade` | layouts | Fondu archive (sépia → couleur, ou fade in lent) |
| `CalqueDechire` | layouts | Calque déchiré qui révèle ce qui est dessous |
| `ShatterReform | layouts | Brisure en éclats puis reformation |
| `DataRevealSouverain` | layouts | "Découvrez les frais M-PESA..." — barre pivot + 2 barres latérales spring |
| `WordExplode` | layouts | "COLONIE · RICHESSE" — 2 mots explosent depuis le centre avec flash |
| `CountdownReveal` | layouts | Compte à rebours révélant une info |
| `CoinFlip` | layouts | Pièce qui se retourne révélant face/pile (deux faces d'un sujet) |

---

## CITATION / TEXTE FORT — citations, titres d'impact

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `QuoteImpact` | layouts | "Ce qu'il a dit résonne encore..." — citation full-screen révélée mot-par-mot |
| `HighlightedQuote` | layouts | Citation avec surlignage animé sur les mots-clés |
| `BrutalHeadline` | inserts | "L'URANIUM QUI VAUT UN EMPIRE" — photo plein cadre + titre énorme Bebas |
| `SpeechBubble` | layouts | "En personne, il explique..." — portrait + bulle dialogue spring |
| `TextChoc` | layouts | Texte révélé avec impact visuel fort (zoom/flash) |
| `TypeReveal` | layouts | Texte qui s'écrit lettre par lettre (typewriter) |
| `TypeWriter` | layouts | Variante typewriter avec curseur clignotant |
| `SplitFlap` | layouts | Texte en rouleaux d'aéroport (alphabet roll) |
| `VoixDuPeuple` | layouts | "La population dit..." — citations multiples style témoignage terrain |

---

## PORTRAIT / PERSONNAGE — présenter une personne, un acteur

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `PortraitDossier` | layouts | "Voici le dossier de..." — dossier enquête : frame doré + 5 infos + banner ACTIF/DÉCÉDÉ |
| `PortraitEditorial` | layouts | Portrait style magazine/éditorial |
| `PortraitGeometry` | layouts | Portrait avec formes géométriques abstraites en fond |
| `PortraitSilhouette` | layouts | Portrait en silhouette (anonymat ou dramatisation) |
| `KraftCard` | inserts | "Rencontrez le ministre..." — fond kraft + asset + label + bulle optionnelle |
| `KraftCardDocClassifie` | inserts | "Document classifié" — Polaroid taped + tampon VÉRIFIÉ/CLASSIFIÉ + note OSINT |
| `TrombinoscapeStrategique` | layouts | Plusieurs portraits côte à côte (organigramme, acteurs clés) |
| `MosaiqueActeurs` | layouts | Mosaïque de portraits d'acteurs (style wall) |
| `PassationPouvoir` | layouts | Transition entre deux figures de pouvoir |

---

## PREUVE / SOURCE — documents, validation, OSINT

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `SourceProuve` | layouts | "Voici l'article qui le prouve" — cadre doré + highlight animé sur phrase-clé |
| `SourceTag` | overlays | Source discrète bas-gauche (ex: "FT", "Le Monde") — s'affiche sur toute vidéo |
| `NewsClipping` | inserts | "Le journal confirme..." — coupure papier réaliste (3 variantes de vieillissement) |
| `NewsClippingV2` | inserts | Coupure fullscreen avec grain + header/headline/lead/pullquote |
| `KraftCardDocClassifie` | inserts | Polaroid + tampon OFFICIEL/CONTESTÉ + annotation OSINT |
| `EntityDiagram` | inserts | "Voici le réseau complet" — nœuds + edges typées + tampon DOSSIER N°XXX |
| `Caviardage` | layouts | Texte caviardé (censuré) puis révélé |
| `ScanInfrarouge` | layouts | Effet scanner infrarouge révélant des données cachées |

---

## RÉSEAU / FLUX — connexions, dépendances, systèmes

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `FilRouge` | layouts | "Suivez le fil rouge : signataire → intermédiaire → bénéficiaire" |
| `EntityDiagram` | inserts | "Toutes les connexions" — icones + edges rouge/jaune/gris + OSINT |
| `NoeudTisserand` | layouts | "L'argent converge ici puis s'échappe" — nœud central + flux bezier |
| `NetworkGraph` | layouts | Graphe de réseau générique (nœuds + liens dynamiques) |
| `ProcessFlow` | layouts | "Étape 1 → 2 → 3" — processus linéaire ou branché |
| `GlobalPulse` | inserts | "Les flux partent vers Paris, Londres, Dubaï" — arcs great-circle |
| `ArbreAPalabres` | layouts | Arbre de mots/concepts qui se ramifient |
| `EffetDomino` | layouts | "Et ça entraîne... puis... puis..." — dominos tombant en cascade |
| `MetamorphoseFiduciaire` | layouts | Transformation d'une entité/valeur en une autre (argent, pouvoir) |

---

## HOOK / ACCROCHE — premier plan, scroll-stopper

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `BrutalHookSplit` | layouts | Hook brutal : photo + stat choc en split — scroll-stopper éprouvé |
| `BrutalHeadline` | inserts | "L'URANIUM QUI VAUT UN EMPIRE" — fullscreen photo + Bebas |
| `WordExplode` | layouts | Ouverture avec explosion de 2 mots-clés |
| `BurnReveal` | layouts | Flamme révélatrice — "ça brûle depuis le début" |
| `BigStat` | inserts | Chiffre seul, plein écran — impact immédiat |
| `CarouselSouverain` | layouts | 4 types slide (hook/fact/stat/CTA) avec progress bar |
| `DateBar` | inserts | "12 NOVEMBRE 2018 · Sommet UA" — bandeau date/événement plein largeur |
| `SovereignEclipse` | layouts | Éclipse dramatique — révélation progressive |

### Hooks Mapbox carte (Chantier HOOK, 2026-06-02 — punch frame 0, hybrides V+H, render `render-mapbox.sh`)
> Ouvertures de vidéo rapides/tape-à-l'œil sur carte Mapbox (drift fluide) + overlays cinétiques. Charte navy/gold.

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `FiberOpticFlagInvade` | mapbox | "Frontière se trace PUIS drapeau envahit, séquentiel" — hook carto premium ⭐ |
| `MapCutaway` | mapbox | "Couper la carte vers une image/stat/citation/drapeau puis revenir" — INSERT cutaway réutilisable, 4 modes, retour carte + target lock ⭐⭐ |
| `KineticMaskSlam` | mapbox | "Un chiffre choc géant, la carte visible dedans, puis zoom dans le 0" — chiffre choc ⭐ |
| `RapidFireCountries` | mapbox | "Rafale de pays qui flashent puis freeze sur LE pays" — montage cut TikTok |
| `ClassifiedRedactReveal` | mapbox | "Dossier TOP SECRET, censure qui glisse et révèle la carte" — ton investigation ⭐ |
| `ComboMaskSweep` | mapbox | "Chiffre choc puis faisceau qui révèle le pays" — combo hook (choc→révélation→focus) ⭐ |
| `ComboSweepDominoFlag` | mapbox | "Déclencheur, propagation, drapeaux" — combo hook dynamique régionale |
| `ComboFiberAuraPopup` | mapbox | "Frontière + onde + donnée reliée" — combo hook data storytelling (où→quoi→combien) |
| `TypewriterText` | components | "Le texte s'écrit lettre par lettre" — effet machine à écrire réutilisable (curseur) |

---

## DONNÉES VISUELLES — graphiques, data-viz

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `StackedBars` | layouts | Barres empilées (comparaisons multi-pays, proportions) |
| `BarRace` | layouts | "Regardez le classement évoluer..." — bar chart racing animé |
| `LineChartDrawOn` | layouts | "La courbe monte depuis 1990..." — ligne tracée progressivement |
| `IconGrid` | layouts | Grille d'icônes (ex: 100 silhouettes dont X colorées) |
| `IconStat` | layouts | Icône + stat associée (pictogramme + chiffre) |
| `MosaiqueWax` | layouts | Mosaïque style tissu wax (pattern décoratif data) |
| `SmallMultiplesGrid` | inserts | 4 colonnes B&W portrait+chart+annotation (comparaisons silencieuses) |
| `LeSceau` | layouts | Sceau officiel / cachet institutionnel |
| `LeSemeur` | layouts | Dispersion de données / semis de points |
| `ParallaxeDiorama` | layouts | Vue diorama avec parallaxe (profondeur de champ) |

### ⭐ Templates HERA — motion-design validé externe (décodés hera.video 2026-06-18) — réponses PRIORITAIRES
> Vrais templates motion-design (Y Combinator, validés par des pros). À privilégier comme réponse à une intention data-viz.
> Dossier `src/projects/_proto-16-9/`. Choix du FOND = voir les 4 registres dans `INTENTION-FORME-INDEX.md`.

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `ProtoHera_ChartOnMap` ⭐ | _proto-16-9 | "Un chiffre/barre qui monte SUR une carte" — barre or + axe sur carte Afrique claire estompée (prêt prod) |
| `ProtoHera_ChartsParchemin` ⭐ | _proto-16-9 | "Bars / poll / courbe sur papier" — 3 charts registre parchemin clair (charte Souverain) |
| `HeraFidele_V12_LineChart` ⭐ | _proto-16-9 | "Une courbe + période surlignée" — line chart lime + bande jaune highlight (couleurs MODULABLES) |
| `ProtoHera_TerminalNeon` | _proto-16-9 | "Line/donut style marché/tech" — glow néon sur noir (registre marché, PAS éco-politique premium) |
| `ProtoHera_Timeline` ⭐ | _proto-16-9 | "Frise chrono premium" — ligne or + médaillons + fiches sur carte estompée |
| `HeraFidele_V04_FlagsOnMap` ⭐ | _proto-16-9 | "Hier vs aujourd'hui par pays" — drapeaux ronds + valeurs barrées→neuves sur carte monde |
| `ProtoHera_Sketch` | _proto-16-9 | "Style dessiné-main / whiteboard" — barres crayon + flèche manuscrite (registre pédago chaleureux) |

---

## TEXTE / EMPHASE — phrase-choc, accent sur un mot, paradoxe typographique

> ⭐ Catégorie ajoutée 2026-06-18 (manquait). Pour mettre l'EMPHASE par le texte lui-même (pas une citation statique).

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `HeraFidele_V03_KineticText` ⭐ | _proto-16-9 | "La phrase se construit mot par mot, accent sur UN mot" — texte cinétique + souligné rouge (fond noir + ondulations) |
| `ProtoEffect_Fracture` | _proto-16-9 | "Le paradoxe nu en 2 mots opposés" — bascule typographique ("S'enrichir. / S'effondrer.") |
| `TextChoc` | layouts | "Le mot qui claque plein écran" — texte d'impact (voir aussi § CITATION / TEXTE FORT) |

---

## HERO DATA — data-viz premium (doctrine SOUVERAIN-REMOTION-PLAYBOOK)

> Briques codifiées 2026-06-02 depuis Silicon Savannah + analyse Gemini. Pour beats **graphisme/data-viz/hero-data** (pas carte). Charte navy/gold, secondary motion, métaphore physique. Squelette assemblage : `memory/doctrines/SOUVERAIN-REMOTION-SKELETON.md`.

| Composant | Import | Quand Aziz dit... |
|---|---|---|
| `CountUp` (preset `bounce` + `decimals`) | ui | "Le chiffre clé monte et claque" — count-up 0→target + overshoot physique + glow (P1). `decimals` pour "0.22%" |
| `HeroMirrorBars` | layouts | "Plus tu es petit plus tu paies" — 2 barres miroir HORIZONTALES rouge/vert + count-up + verdict (vibration/pulse) + slot central (P7) |
| `HeroVerticalBars` | layouts | "L'un écrase l'autre" — 2 barres VERTICALES qui montent (le contraste de hauteur = le déséquilibre) + count-up + verdict + slot central. Meuble l'espace vertical (P7). Frère vertical de HeroMirrorBars |
| `FloatingHeroObject` | layouts | "Un objet/icône qui flotte, vivant" — float sin + halo oscillant + ping-ring. Props : `clipCircle` (masque rond, anti-carré PNG), `spin` (balancement rotatif 2e motion). Image OU enfant Lucide/SVG (P5) |
| `Badge` (mode `satellite`) | ui | "Des stats qui gravitent autour" — badge navy/gold pop staggeré autour d'un hero. `sublabel` optionnel (P5) |
| `CountdownReveal` (prop `pingNode`) | layouts | "7 ANS — le cadran se remplit" — arc SVG progressif + count-up + flash + ping-node lumineux |
| `TextChoc` | layouts | "La punchline s'écrit mot par mot" — reveal typo séquentiel + underline accent (P6). Réutilisable tel quel |
| `SubtitleBarSouverain` | ui | "Sous-titre persistant en bas" — ref-based, opacité cascade, jamais de trou (P3) |

**Helpers** (`_shared/animations.ts`) : `heroBouncePop` (overshoot P1) · `appearOrganic` (reveal P3) · `floatSin`/`glowOscillate`/`pingRing` (secondary motion P5).

---

## UTILITAIRES — éléments transversaux

| Composant | Import | Usage |
|---|---|---|
| `Baseline` | ui | Ligne bas-écran (pays \| année \| source) — présent sur toutes les vidéos |
| `GoldLine` | ui | Séparateur ligne or dégradée — transitions visuelles |
| `GridOverlay` | overlays | Grille + grain Perlin — texture sous tout background |
| `SVGGrain` | ui | Grain SVG déterministe — texture sans image externe |
| `CountUp` | ui | Compteur animé — réutilisable dans n'importe quel composant |
| `Badge` | ui | Badge couleur (ALERTE / OFFICIEL / CONFIRMÉ) — spring-up |
| `KraftCardBackground` | inserts | Fond kraft/slate/ivoire — wrapper réutilisable pour cards |

---

## Carrousels Good News (briques animées) — `souverain/carousels/good-news/`

> Carrousels Instagram/Facebook "bonnes nouvelles macro Afrique". Charte LUMINEUSE (ivoire/or/navy), 100% Remotion animé. Voir `good-news/README.md`. Distinct des carrousels hybrides (`hybrid/`, issus de vidéos).

| Composant | Quand Aziz dit... |
|---|---|
| `GoodNewsSlideLight` | "slide carrousel good news" — slide générique (mode hook/fact/cta, brick gauge/flow/bars) |
| `GoodNewsSlideMap` | "carte dans un carrousel good news" — Mapbox Caspian beige + tracé animé géocodé |
| `bricks/GaugeBrick` | "jauge / pourcentage qui monte" — arc + compteur + glow |
| `bricks/BarsBrick` | "classement / X dépasse Y" — barre qui grandit et dépasse |
| `bricks/FlowBrick` | "impact / X alimente Y dans le monde" — 2 nœuds (icônes Lucide) + flux + particules |
| `GrainOverlay` | "grain papier magazine" — texture SVG subtile sur fond clair |

---

## Import type

```tsx
// layouts
import { BigStat } from '../../_shared/components/layouts/BigStat'

// inserts
import { BrutalHeadline } from '../../_shared/components/inserts/BrutalHeadline'

// ui
import { CountUp } from '../../_shared/components/ui/CountUp'

// overlays
import { SourceTag } from '../../_shared/components/overlays/SourceTag'
```
