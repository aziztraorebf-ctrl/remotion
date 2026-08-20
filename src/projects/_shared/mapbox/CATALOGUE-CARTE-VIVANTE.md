# CATALOGUE CARTE VIVANTE — Templates Mapbox Souverain

> **Source de vérité unique** des templates carte vivante (créés 2026-06-02).
> Lire AVANT de composer un beat carto (hook, corps, insert). Référencé depuis CLAUDE.md + skill souverain-preproduction + mapbox-session.py.
> Tous : vraie carte Mapbox (drift fluide, altitude pays, océan navy `#16213a`, voisins ivory 10%, gold `#c8a951`). Hybrides V (1080×1920) + H (1920×1080). Render via `scripts/render-mapbox.sh <CompId> <out.mp4>`.
> Compositions Root : `<Nom>-<Lieu>-V` / `-H`. Galerie visuelle : `dashboard/templates-carte-vivante.html`.

---

## 🎬 HOOKS — ouverture de vidéo (punch frame 0, 5-30s)

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **KineticMaskSlam** ⭐ | Chiffre/mot géant slamme, carte visible DANS le texte, zoom dans le "0" révèle la carte | Ouvrir sur un chiffre choc ("70% du phosphate") | `bigText`, `subText`, `focusIso`, `center`, `baseZoom` | [V](https://files.catbox.moe/9hu9oe.mp4) [H](https://files.catbox.moe/6zivbg.mp4) |
| **FiberOpticFlagInvade** ⭐ | Frontière se trace en laser PUIS le drapeau envahit le pays, séquentiel multi-pays | Ouvrir en présentant des pays (bloc régional) | `countries[]` ({iso,geoName,flagCode,at,label}), `center` | [V](https://files.catbox.moe/6jtjc7.mp4) [H](https://files.catbox.moe/v0ot0h.mp4) |

## 🔗 COMBOS — hooks par assemblage (progression narrative)

| Template | Progression | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **ComboMaskSweep** ⭐ | Chiffre choc → révèle carte → faisceau allume le pays | Hook fort 3 temps (le plus abouti) | `bigText`, `subText`, `geoName`, `boundaryIsos`, `label` | [V](https://files.catbox.moe/h75bhk.mp4) [H](https://files.catbox.moe/n9f3u3.mp4) |
| **ComboSweepDominoFlag** | Déclencheur → propagation par vagues → chaque pays reçoit son drapeau | Raconter une dynamique régionale (AES, CEDEAO) | `waves[][]`, `flags{iso:{geoName,code}}` | [V](https://files.catbox.moe/httrq8.mp4) [H](https://files.catbox.moe/yyfa3a.mp4) |
| **ComboFiberAuraPopup** | Frontière (où) → onde du point (quoi) → encart donnée relié (combien) | Data storytelling premium | `geoName`, `point`, `popupTitle`, `popupValue` | [V](https://files.catbox.moe/4byelm.mp4) [H](https://files.catbox.moe/ypg7vp.mp4) |

## 🎞️ INSERTS — couper la carte puis revenir (pendant la narration)

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **MapCutaway** ⭐⭐ | Carte → overlay plein écran → retour carte + target lock. Textes TYPEWRITER. 4 modes | Appuyer un point sans quitter le sujet (le + réutilisable) | `mode` (image/stat/reveal/flag), `bigText`, `subText`, `image`/`flagCode`, `focusIso`, `inAt`, `outAt` | [Stat](https://files.catbox.moe/pbjdzd.mp4) [Image](https://files.catbox.moe/88s176.mp4) [Flag](https://files.catbox.moe/rg4j0i.mp4) [Reveal](https://files.catbox.moe/5ech8j.mp4) |
| **RapidFireCountries** | Rafale de pays (drapeau+nom, cut sec) puis freeze sur LE pays | Énergie d'introduction d'un pays | `flash[]`, `focus`, `cutFrames` | [V](https://files.catbox.moe/a09vsm.mp4) [H](https://files.catbox.moe/yamy5v.mp4) |
| **ClassifiedRedactReveal** | Écran TOP SECRET + censure qui glisse → révèle carte + target lock | Révélation, ton investigation | `stampText`, `teaseText`, `focusIso`, `revealAt` | [V](https://files.catbox.moe/z95wbs.mp4) [H](https://files.catbox.moe/noljgi.mp4) |

## 📍 PREUVE ANCRÉE — montrer qu'il se passe quelque chose de concret à un point précis

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Statut |
|---|---|---|---|---|
| **Carte-insert vidéo ancrée** (proto, pas encore extrait) | Cartouche composé superposé à la carte assombrie : badge date + clip vidéo en boucle + jauge circulaire % + barres de progression + badge d'activité, relié par un connecteur pointillé doré à un pin pulsé posé sur le point géo | Prouver visuellement qu'un événement est EN COURS à un endroit (chantier, activité, opération) sans quitter la carte — remplace le pictogramme posé nu, qui lit comme un jouet | ancre écran du pin, `videoSrc` (staticFile + `Loop`+`OffthreadVideo`), `dateLabel`, `progress` (pilote jauge+barres+%), `activityLabel`, `connectorDraw` | **proto** — concept validé Aziz 2026-08-14 sur le prototype R&D ; en production dans `souverain/gazoduc-aagp-tsgp/GazoducActe3CarteTSGP.tsx` (Beat 2) et `_rnd/svg-scenes/GazoducH3IntegrationTestReal.tsx`. ⚠️ Codé 2× en dur, jamais extrait en composant partagé — à extraire au 3e usage. |

⚠️ **Piège mesuré (2026-08-14)** : à fort zoom, le pin d'ancrage peut se projeter PILE SOUS le cartouche
(donc invisible, l'insert semble flotter sans ancrage). Mesurer la position écran du pin et décaler la
caméra pour le projeter hors de la zone du cartouche (~36 % de la largeur si l'insert occupe 47→85 %).

## 🎥 CAMÉRA — travelling continu le long d'un tracé

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Statut |
|---|---|---|---|---|
| **Caméra continue qui suit la tête d'un tracé** | Zoom monotone unique sur toute la durée + centre interpolé en continu vers la position de la tête du tracé. Aucun point de contrôle discret, donc aucun palier possible | Tout travelling qui accompagne une ligne qui se dessine (pipeline, route, front). Remplace toute liste de keyframes | `camFor(center, scale)`, `lerpCam`, `buildFullPathSamples`, `windowBBox` (déjà présents dans les 3 fichiers) | **prouvé** — 3 usages : `GazoducActe2AAGP.tsx` L220-278 (validé Aziz), `GazoducActe3CarteTSGP.tsx` Beat 1 (validé Aziz 2026-08-14), `_rnd/d3-16x9/ProtoGazoducA2CameraVsVoisins.tsx` (`ProtoA2CameraContinue`) |

⛔⛔ **NE JAMAIS remplacer ce mécanisme par une liste de points de contrôle + `easeInOut` PAR SEGMENT** :
`easeInOut` a une dérivée nulle à ses 2 extrémités → la vitesse tombe à EXACTEMENT 0 à chaque point
(mesuré : 7 arrêts complets en 22 s). Le symptôme « la caméra avance par à-coups » n'est alors PAS un
problème de dosage — 3 itérations perdues à retoucher les valeurs le 2026-08-14. Détail :
`feedback_camera-a-coups-easeinout-par-segment-pas-un-dosage`.

## 🌍 TERRITOIRE — couleur/drapeau/zone dans les pays (corps de vidéo)

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **MapboxFlagFill** | Drapeau OU toute image clippé(e) dans la silhouette du pays + bichromie | "Le drapeau/la texture remplit le pays" | `geoName` (str\|[]), `flagCode`/`flagImage`, `bichromie`, `boundaryIsos` | [V](https://files.catbox.moe/80ti00.mp4) [H](https://files.catbox.moe/xay797.mp4) |
| **MapboxIsolateZone** | Spotlight pays (reste assombri) + zone offshore hachurée + badge + stat | "On isole ce pays et sa zone" | `countryIso`, `zone`, `badge`, `badgeCoord`, `statValue` | [V](https://files.catbox.moe/nv5azm.mp4) [H](https://files.catbox.moe/npq08b.mp4) |
| **SequentialFlagReveal** | Pays s'allument avec leur drapeau en séquence, restent allumés | "Les pays X,Y,Z avec leur drapeau" | `countries[]` | [V](https://files.catbox.moe/i7bq1e.mp4) [H](https://files.catbox.moe/tyat4h.mp4) |
| **GlassmorphismGeoPopup** | Encarts données (navy translucide + or) reliés au point geo par ligne fine | "Afficher des chiffres ancrés sur la carte" | `points[]` ({coord,at,title,value}), `highlightIso` | [V](https://files.catbox.moe/p6f31u.mp4) [H](https://files.catbox.moe/04tkmg.mp4) |

## 🎌 FILL-PATTERN N1 — Fondations drapeaux (session 2026-06-03)

> **Bibliothèque centrale : `flagCanvas.ts`** — 45 drapeaux canvas pur, helper `pushFlagToMap(map, iso)`. Zéro fetch, headless-safe. Tous les templates ci-dessous l'utilisent.

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **FlagFillStatic** ⭐ N1.1 | 1 pays principal avec son drapeau, voisins en couleurs unies | "Ce pays dans son contexte géopolitique" | `mainIso`, `mainBoundaryIsos`, `secondaryCountries[]` ({iso,color}) | [V](https://files.catbox.moe/uxjodx.mp4) |
| **FlagFillSequence** ⭐ N1.2 | Drapeaux s'allument pays par pays (synchro voix), restent allumés | Présenter un bloc régional (CEDEAO, Sahel, BRICS Africa) | `countries[]` ({iso,geoName,at,fadeFrames,opacity}) | [V](https://files.catbox.moe/5bucnj.mp4) |

## 🧱 FILL-PATTERN N2 — Textures narratives (le vrai différenciant)

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **ResourceTextureFill** ⭐⭐ N2.1 | Texture de ressource bichromie navy/gold projetée dans la silhouette — le pays est "rempli de sa ressource" | "L'Algérie est pleine de pétrole", "Le Maroc est une mine de phosphate" | `countries[]` ({iso,resource,at}), resource: `oil\|gold\|phosphate\|agriculture\|lithium\|gas` | [Phosphate V](https://files.catbox.moe/tw1z5f.mp4) [Afrique V](https://files.catbox.moe/ndrxo3.mp4) |
| **HeatGradientFill** N2.2 | Choropleth dynamique — la couleur "monte" avec la narration, intensité encodée | "La production augmente", montée en puissance, comparaison multi-pays | `countries[]` ({iso,intensity,palette,at,rampFrames}), palettes: `PALETTE_PETROLE\|RICHESSE\|TENSION\|GOLD\|LITHIUM` | [V](https://files.catbox.moe/29zvt7.mp4) |

## ✨ FILL-PATTERN N3 — Effets avancés (originaux)

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **WavingFlagFill** N3.1 ⚠️ | Drapeau ondulant dans la silhouette (canvas `drawFlagCanvas`, décalage sinusoïdal) | Ouvrir sur un pays avec vie — le drapeau respire. ⛔ **RÉSERVÉ aux drapeaux 3 bandes UNIES sans emblème** (Mali, France, Guinée, Sénégal-hors-étoile…). Drapeau à étoile/emblème/détail → INTERDIT (rend carrelé/faux) → prendre `useClipFlags` (vraies images) + animer l'opacité. C'est l'EXCEPTION nommée à la règle « jamais drawFlagCanvas » ci-dessous. | `mainIso`, `waveAmplitude`, `waveFrequency`, `waveSpeed` | [V](https://files.catbox.moe/qn4eh3.mp4) |
| **FlagDissolveTransition** N3.2 | Un pays passe d'un drapeau à un autre (crossfade entre fill-patterns) | Territoire contesté, changement d'influence (AES, CEDEAO), transition géopolitique | `countries[]` ({iso,fromIso,toIso,dissolveAt,dissolveDur}) | [V](https://files.catbox.moe/qbgksz.mp4) |
| **ImageProjectionFill** N3.3 | Image réelle bichromisée navy/gold clippée dans la silhouette d'un pays | Montrer un lieu précis (mine, ville, usine) plutôt qu'un drapeau — pour les beats à fort enjeu visuel | `countries[]` ({iso,boundaryIsos,imageSrc,navyColor,goldColor,contrast}) | [Maroc/mine V](https://files.catbox.moe/7opcc9.mp4) |
| **PulsingRegionFill** N3.4 | Territoire entier qui "respire" (opacity sin) — tout le pays pulse, pas juste un dot | Zone de tension, point chaud géopolitique, conflit actif | `countries[]` ({iso,color,opacityMin,opacityMax,period,phaseOffset,showGlow}) | [V](https://files.catbox.moe/8uvzdy.mp4) |

## 🔗 FILL-PATTERN N4 — Combos narratifs

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **ContagionFlagSpread** ⭐ N4.1 | L'influence se propage en vagues → flash couleur → drapeau remplace (onde + identité) | Raconter une alliance qui s'étend (AES, CEDEAO, BRICS Africa) | `waves[][]`, `waveAt`, `waveGap`, `contagionColor`, `flagDelay`, `epicenterIso` | [AES V](https://files.catbox.moe/k84gjl.mp4) |

## ⚡ DYNAMIQUES — mouvement de couleur sur les territoires (accroche l'œil)

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **SweepRevealTerritory** ⭐ | Faisceau lumineux traverse le pays et révèle sa couleur (scanner) | Révéler un pays avec dynamisme | `geoName`, `boundaryIsos`, `label`, `sweepAt`, `sweepDur` | [V](https://files.catbox.moe/g1bvis.mp4) [H](https://files.catbox.moe/m96rpq.mp4) |
| **DominoContagionFill** | Couleur contamine les pays de proche en proche par vagues | Montrer une propagation d'influence | `waves[][]`, `epicenterIso`, `epicenterLabel` | [V](https://files.catbox.moe/3f2shf.mp4) [H](https://files.catbox.moe/spjlqt.mp4) |
| **FiberOpticBorderDraw** ⭐ | Frontière se dessine en laser doré (dasharray + glow) puis fill | Tracer une frontière/ZEE avec style | `countryIso`, `geoName`, `label`, `drawAt`, `drawDur` | [V](https://files.catbox.moe/be2pd0.mp4) [H](https://files.catbox.moe/7k3zf6.mp4) |

## 🎯 SÉQUENTIEL / ALLUMAGE

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **SequentialBorderPulse** | Frontières s'allument en séquence (synchro syllabe), restent allumées | "Les pays s'allument un par un" | `sequence[]` ({iso,at,label}), `center` | [V](https://files.catbox.moe/3lcys8.mp4) [H](https://files.catbox.moe/flk7c8.mp4) |
| **LottieGeoAura** | Lottie premium (onde de choc / anneau HUD / flux) ancré à un point geo | Effet animé premium sur un site | `auras[]` ({coord,asset,at,sizeVmin,label}) — assets: `lottie/premiumLottieAssets.ts` | [V](https://files.catbox.moe/kqybi6.mp4) [H](https://files.catbox.moe/jxkicc.mp4) |

---

## 🏷️ PLAQUES & OVERLAYS NARRATIFS (pattern Or Africain — validé Aziz 2026-06-03)

> Extrait de Or Africain Beat4. **Complément aux dots, PAS un remplaçant.** Force : afficher SOURCES + données de façon épurée, au lieu de tout jeter sur la carte. On choisit dots OU plaque selon ce qui équilibre le mieux la scène.

| Composant | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **GeoCountryPlaque** ⭐ | Pilule NOM (bordure couleur) + encart STAT (serif gold glow) + SOURCE (mono petit). Mode "top" centré OU géo-ancré (`pos` via map.project) | Annoncer un pays avec une donnée + sa source ("$430M — Bloomberg, nov. 2025") | `name`, `color`, `stat`, `source`, `appearAt`, `hideAt`, `pos` | [Showcase V](https://files.catbox.moe/8ww81g.mp4) |
| **GeoProgressCounter** | Compteur "X / N" + label au-dessus ("PAYS QUI SE LÈVENT") | Cumul narratif (combien de pays/cas révélés) | `current`, `total`, `label`, `appearAt` | idem showcase |
| **GeoClimaxOverlay** | Gros titre gold + glow (ligne 1) + sous-titre blanc (ligne 2) par-dessus carte ASSOMBRIE | Conclure un beat sur un message fort ("4 PAYS. UN MÊME SIGNAL.") | `line1`, `line2`, `appearAt`, `line2At`, `dimMax` | idem showcase |

**Caméra "approche pays" (le relief 3D qu'Aziz aime)** : `camCountryApproach(center, {bearing})` dans `MapboxBase.tsx` → zoom 4.7, **pitch 32°**, léger bearing. C'est le pitch (inclinaison) qui crée le relief — PAS un terrain 3D. Maroc Beat0/1 = pitch 0 (plat) → a perdu ce relief. Standard pour futurs beats focus 1-4 pays. Pull back climax : `CAM_MULTI_PULLBACK_DEFAULTS` (zoom 3.4, pitch 15).

---

## 🧩 UTILITAIRES réutilisables

- **`components/TypewriterText.tsx`** — texte qui s'écrit lettre par lettre (curseur gold). Props : `text`, `startAt`, `speed`, `cursor`, `style`. À utiliser dans TOUT overlay/insert pour vivifier les textes.
- **`MapboxBase.tsx`** — utilitaires : `applyGeoAfriqueV5(map)`, `COUNTRY_CENTERS`, `ISO`, `addCountryHighlight`, `MapboxBrandingHide`, `CamState`/`lerpCam`.
- **`lottie/premiumLottieAssets.ts`** — générateurs Lottie navy/gold : `shockwaveDiscovery()`, `networkFlow()`, `orbitalDataCrown()`.

## 🎨 Comment COMBINER (méthode validée)

Un bon combo = une **progression narrative** (pas une superposition). Le secret : 2-3 effets qui racontent une suite logique.
- **Choc → révélation → focus** : MaskSlam → Sweep (= ComboMaskSweep)
- **Déclencheur → propagation → identité** : Sweep → Domino → Flag (= ComboSweepDominoFlag)
- **Où → quoi → combien** : FiberOptic → Aura → Popup (= ComboFiberAuraPopup)
- Autres combos possibles à explorer : BorderPulse + GlassPopup (allumage + données), FlagFill + LottieAura (identité + effet site), MaskSlam + Domino (choc chiffre + ampleur régionale).

## 🗂️ Structure type d'une vidéo (où placer quoi)

1. **HOOK (0-10s)** : KineticMaskSlam, FiberOpticFlagInvade, ou un Combo
2. **CORPS (carte vivante)** : FlagFill, Sweep, Domino, FiberOptic, IsolateZone, SequentialFlagReveal
3. **INSERTS (couper/revenir)** : MapCutaway (4 modes) quand on veut appuyer un point ou montrer une donnée/portrait
4. **DATA sur carte** : GlassmorphismGeoPopup, SequentialBorderPulse, LottieGeoAura

## 🧩 HELPERS réutilisables

### ⭐⭐ Projeter un DRAPEAU dans un pays — `useClipFlags.tsx` (LA bonne technique)
**TOUJOURS utiliser ce helper pour mettre un drapeau dans un pays.** Hook `useClipFlags(mapRef, flags, frame)` + composant `<ClipFlagsLayer>`. Technique : **vraies images officielles HD** (`public/_shared/flags/*.png`) clippées en SVG dans la silhouette reprojetée chaque frame. Net à TOUTE échelle (étoile entière, pas carrelé).
- `ClipFlag` : `{ iso, geoNames[], flagFile, at, bgColor?, fadeFrames?, mainlandBox? }`
- **`mainlandBox` [minLon,minLat,maxLon,maxLat]** OBLIGATOIRE pour pays à outre-mer (France `[-5,41,10,52]`, sinon bbox géante Guyane→Réunion casse le drapeau). Idem USA/Pays-Bas/Danemark.
- `preserveAspectRatio="meet"` (drapeau entier) + fond `bgColor` pour combler les bords de silhouette.
- ⛔ **NE PAS utiliser `flagCanvas.ts` `drawFlagCanvas` pour un drapeau visible** — ce sont des dessins APPROXIMATIFS (étoiles fausses, bandes qui se carrellent sur les formes géo complexes). Réservé aux cas où seule la couleur dominante compte. Voir `memory/feedbacks/feedback_sfx-sequence-et-drapeaux-reels.md` (BUG 2+3).
  - **UNIQUE EXCEPTION nommée** : `WavingFlagFill` (ondulation), et SEULEMENT pour les drapeaux **3 bandes unies sans emblème** (le mouvement masque l'approximation, et 3 bandes unies n'ont pas de détail à fausser). Tout autre drapeau visible → `useClipFlags`. Si tu hésites → `useClipFlags` (jamais faux).

### Autres helpers
- **`flagCanvas.ts`** — 45 drapeaux DESSINÉS en canvas pur + `countryFilter(iso, boundaryIsos)` (filtre Mapbox par ISO, JAMAIS par `name`). ⚠️ Les drapeaux dessinés sont approximatifs → préférer `useClipFlags` (vraies images) pour tout drapeau visible. `countryFilter` reste la référence pour filtrer un fill.
- **`resourceTextures.ts`** ⭐ — 6 textures bichromie navy/gold : `drawOilTexture`, `drawGoldTexture`, `drawPhosphateTexture`, `drawAgricultureTexture`, `drawLithiumTexture`, `drawGasTexture`. Helper `drawResourceTexture(type, size)` + `resourceImageId(type)`.
- **Drapeaux HD locaux** : `public/_shared/flags/*.png` (ma, cn, de, es, fr...). Source : Wikimedia Commons SVG officiel → `rsvg-convert -w 1024`. AJOUTER un pays = télécharger son SVG Wikimedia, convertir, déposer ici. JAMAIS `flagcdn.com` en render (fetch externe KO headless).
- **`scripts/tools/gemini-gen-image.py`** — génération image text-to-image (`gemini-3.1-flash-image`). Pour assets créatifs (mine, usine bichromie pour ImageProjectionFill), PAS pour les drapeaux (prendre Wikimedia).

## 🛣️ ROUTE / FLUX SÉQUENTIEL (comble le backlog "Flux inter-pays")

| Template | Ce qu'il fait | Quand l'utiliser | Props clés | Preview |
|---|---|---|---|---|
| **GeoFlowConnection** ⭐ V2 | Route ville→ville→ville qui se DESSINE progressivement (dashed doré, dash animé) + city markers Spring Pop + labels + sprite mobile (avion orienté tangente / point) + caméra qui suit la tête puis dézoom final | Routes commerciales, corridors (gazoduc, Lobito), migrations, axes logistiques, "le trajet de X vers Y" | `waypoints[]` ({name,coord:[lon,lat],labelDx/Dy}), `title`, `accentColor`, `sprite` (plane/dot/none), `drawStartFrame`, `drawPerSegment`, `cameraFollow`, `zoom?` (auto-fit sinon) | Silk Road demo (R&D mapanimation.io) |

> Headless-safe : Catmull-Rom smoothing + map.project() frame-driven + halo par opacité (PAS feGaussianBlur ni filter:blur CSS). Différent de `ConvergingFlows` (convergence multi-source) et `FlowArrowsMap` (SVG pur non géo-attaché). Inspiration : mapanimation.io "Silk Road Caravan". R&D : `memory/archive/_r-and-d-mapanimation-ANALYSE-2026-06-03.md`.

## 📋 Backlog (idées Gemini non codées)

Effet vivant : TensionHeatZone, HexGridAnalysis, GeoRippleExpansion. Hooks : TacticalRadarScan, EpicenterShockwave, SatelliteTargetLock, GlitchMapIntro.
(Flux inter-pays = COMBLÉ par GeoFlowConnection ci-dessus.)
Sources : `memory/tools/gemini-template-ideas-v2-2026-06-02.json`, `gemini-hook-ideas-2026-06-02.json`.
