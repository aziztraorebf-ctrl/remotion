# Mapbox — Composants partagés GéoAfrique
> Créé 2026-05-06. Révisé 2026-06-02 (Chantier C). Lire ce fichier AVANT d'écrire une composition Mapbox.
> **SOURCE DE VÉRITÉ des templates carte vivante : [`CATALOGUE-CARTE-VIVANTE.md`](./CATALOGUE-CARTE-VIVANTE.md)** — lire AVANT de composer un beat carto (hook/corps/insert) pour réutiliser un template existant.

## Règle fondamentale (CORRIGÉE 2026-06-02)

**Mapbox REND en headless** via `scripts/render-mapbox.sh` (chrome-headless-shell + `--gl=angle` + slim public dir). ~5fps. L'ancienne note "ne peut pas rendre headless" était FAUSSE. Pattern frame-driven obligatoire : `useCurrentFrame` + `map.jumpTo()` (jamais flyTo/easeTo). `map.project(coord)` et `map.updateImage()`/`addImage` fonctionnent en headless. Drift = jumpTo avec bearing/center incrémentés par frame.

---

## ⭐ Templates carte VIVANTE — Chantier C (2026-06-02, hybrides V+H)

> 9 templates créés cette session. Tous : vraie carte Mapbox dessous (drift, altitude pays par défaut, océan navy via `applyGeoAfriqueV5`, voisins ivory 10%). Charte navy `#16213a` / gold `#c8a951` / ivory `#f2ebd9`. Validés Aziz. Render via `./scripts/render-mapbox.sh <CompId> <out.mp4>`.

| Composant | Effet | Cas d'usage | Preview V / H |
|---|---|---|---|
| `MapboxFlagFill` | Drapeau/image clippé(e) dans la silhouette (P4). `geoName` tableau (Maroc+Sahara), `bichromie` 0→1 | "Le drapeau remplit le pays" | [V](https://files.catbox.moe/80ti00.mp4) [H](https://files.catbox.moe/xay797.mp4) |
| `MapboxIsolateZone` | Spotlight pays + zone offshore hachurée + badge geo + stat | "On isole ce pays + sa zone" | [V](https://files.catbox.moe/nv5azm.mp4) [H](https://files.catbox.moe/npq08b.mp4) |
| `SequentialBorderPulse` | Frontières s'allument en séquence (synchro syllabe), restent allumées | "Les pays X,Y,Z un par un" | [V](https://files.catbox.moe/3lcys8.mp4) [H](https://files.catbox.moe/flk7c8.mp4) |
| `GlassmorphismGeoPopup` | Encarts navy translucide reliés au point geo (NB: blur KO headless → fond solide) | "Données ancrées sur la carte" | [V](https://files.catbox.moe/p6f31u.mp4) [H](https://files.catbox.moe/04tkmg.mp4) |
| `SequentialFlagReveal` | Pays s'allument avec leur drapeau en séquence, restent (technique chaînes) | "Les pays avec leur drapeau" | [V](https://files.catbox.moe/i7bq1e.mp4) [H](https://files.catbox.moe/tyat4h.mp4) |
| `LottieGeoAura` | Lottie premium (onde/anneau HUD/flux) ancré au point geo. Assets: `lottie/premiumLottieAssets.ts` | "Effet animé sur ce site" | [V](https://files.catbox.moe/kqybi6.mp4) [H](https://files.catbox.moe/jxkicc.mp4) |
| `SweepRevealTerritory` ⭐ | Faisceau lumineux traverse le pays et révèle sa couleur (scanner) | "Un balayage révèle le pays" | [V](https://files.catbox.moe/g1bvis.mp4) [H](https://files.catbox.moe/m96rpq.mp4) |
| `DominoContagionFill` | Couleur contamine les pays par vagues depuis épicentre. Prop `waves[][]` | "L'influence se propage" | [V](https://files.catbox.moe/3f2shf.mp4) [H](https://files.catbox.moe/spjlqt.mp4) |
| `FiberOpticBorderDraw` ⭐ | Frontière se dessine en laser doré (dasharray+glow) puis fill | "La frontière se trace" | [V](https://files.catbox.moe/be2pd0.mp4) [H](https://files.catbox.moe/7k3zf6.mp4) |
| `FiberOpticFlagInvade` ⭐ HOOK | Frontière se trace PUIS le drapeau ENVAHIT le pays, séquentiel multi-pays. V2 hook | "Hook ouverture : frontière + drapeau" | [V](https://files.catbox.moe/6jtjc7.mp4) [H](https://files.catbox.moe/v0ot0h.mp4) |

### ⚡ HOOKS d'ouverture (Chantier HOOK 2026-06-02 — punch frame 0, à juger EN VIDÉO)
> Carte Mapbox en drift fluide + violence cinétique en overlay (jamais de camera épileptique). Pour les 5-30 premières secondes.

| Composant | Punch | Cas d'usage | Preview V / H |
|---|---|---|---|
| `KineticMaskSlam` ⭐ | Chiffre GÉANT slamme, carte visible DANS le texte, zoom dans le "0" révèle la carte | Chiffre choc ("70% du phosphate") | [V](https://files.catbox.moe/9hu9oe.mp4) [H](https://files.catbox.moe/6zivbg.mp4) |
| `RapidFireCountries` | Rafale de pays (drapeau+nom, cut sec ~5f) puis freeze sur LE pays | Montage cut énergique d'ouverture | [V](https://files.catbox.moe/a09vsm.mp4) [H](https://files.catbox.moe/yamy5v.mp4) |
| `ClassifiedRedactReveal` ⭐ | Écran TOP SECRET + censure qui glisse → révèle la carte + target lock | Ton investigation/thriller géopo | [V](https://files.catbox.moe/z95wbs.mp4) [H](https://files.catbox.moe/noljgi.mp4) |

Idées hook non codées (backlog) : TacticalRadarScan, EpicenterShockwave, SatelliteTargetLock, GlitchMapIntro. Détails : `memory/tools/gemini-hook-ideas-2026-06-02.json`.

### 🎬 INSERT cutaway (réutilisable PARTOUT dans une vidéo, pas juste l'intro)
> Pattern identifié par Aziz : couper la carte vers un overlay quelques secondes, puis revenir. Le 'cutaway' des grandes chaînes.

| Composant | Effet | Modes | Preview |
|---|---|---|---|
| `MapCutaway` ⭐⭐ | Carte → overlay plein écran (entrée/sortie punch) → retour carte + target lock | `image` (illustration+texte), `stat` (chiffre choc), `reveal` (citation/phrase), `flag` (drapeau+pays) | [Stat](https://files.catbox.moe/58ja74.mp4) [Image](https://files.catbox.moe/vzweq6.mp4) [Flag](https://files.catbox.moe/lspmzy.mp4) [Reveal](https://files.catbox.moe/wviemv.mp4) [Stat-H](https://files.catbox.moe/ka7jna.mp4) |

**Note méthode (Aziz 2026-06-02)** : RapidFireCountries + ClassifiedRedactReveal sont reclassés INSERTS (pas hooks). Leur valeur = le pattern cutaway, généralisé dans `MapCutaway`. Vrais hooks validés : `FiberOpticFlagInvade` + `KineticMaskSlam`.

### 🔗 COMBOS — hooks par assemblage de primitives (méthode Aziz)
> Insight Aziz : FiberOptic a marché car il COMBINE des primitives. Donc créer des hooks en assemblant ce qu'on a, chaque combo = une progression narrative. `TypewriterText` (`components/TypewriterText.tsx`) = texte lettre-par-lettre réutilisable, utilisé dans les inserts/combos.

| Composant | Progression narrative | Preview V / H |
|---|---|---|
| `ComboMaskSweep` ⭐ | Chiffre choc (MaskSlam) → révèle carte → faisceau allume le pays (Sweep) | [V](https://files.catbox.moe/h75bhk.mp4) [H](https://files.catbox.moe/n9f3u3.mp4) |
| `ComboSweepDominoFlag` | Déclencheur → propagation par vagues (Domino) → chaque pays reçoit son drapeau | [V](https://files.catbox.moe/httrq8.mp4) [H](https://files.catbox.moe/yyfa3a.mp4) |
| `ComboFiberAuraPopup` | Frontière se trace (où) → onde jaillit du point (quoi) → encart donnée relié (combien) | [V](https://files.catbox.moe/4byelm.mp4) [H](https://files.catbox.moe/ypg7vp.mp4) |

**Compositions Root** : `<Nom>-<Lieu>-V` et `-H` (ex: `FiberOpticBorderDraw-Senegal-V`). Renders dev : `out/templates-souverain/_dev/`.

**Backlog idées Gemini non codées** : TensionHeatZone, HexGridAnalysis, GeoRippleExpansion + Flux inter-pays. Détails : `memory/tools/gemini-template-ideas-v2-2026-06-02.json`.

---

## 🎌 FILL-PATTERN (session 2026-06-03) — colorer/remplir les pays (N1→N4)

> 10 templates + 2 bibliothèques helper. **Carte JAMAIS nue = règle N°1.** Helper central `flagCanvas.ts` (45 drapeaux canvas pur, `pushFlagToMap`, `countryFilter`). Filtre TOUJOURS par ISO via `countryFilter(iso, boundaryIsos)` — jamais par `name` (KO headless). Détails + gotchas : `CATALOGUE-CARTE-VIVANTE.md` sections N1-N4 + `memory/feedbacks/feedback_flagfill-templates-decouverte.md`.

| Composant | Niveau | Effet | Preview V |
|---|---|---|---|
| `FlagFillStatic` | N1.1 | 1 drapeau principal + voisins couleurs unies | [V](https://files.catbox.moe/uxjodx.mp4) |
| `FlagFillSequence` | N1.2 | Drapeaux s'allument pays par pays (synchro voix) | [V](https://files.catbox.moe/5bucnj.mp4) |
| `ResourceTextureFill` ⭐⭐ | N2.1 | Texture ressource bichromie (oil/gold/phosphate/agri/lithium/gas) dans le polygone | [Phos](https://files.catbox.moe/tw1z5f.mp4) [Afr](https://files.catbox.moe/ndrxo3.mp4) |
| `HeatGradientFill` | N2.2 | Choropleth dynamique, couleur monte avec la voix (5 palettes) | [V](https://files.catbox.moe/29zvt7.mp4) |
| `WavingFlagFill` ⭐ | N3.1 | Drapeau ondulant frame/frame (sinusoïdal) | [V](https://files.catbox.moe/qn4eh3.mp4) |
| `FlagDissolveTransition` | N3.2 | Crossfade drapeau A→B (AES, occupation) | [V](https://files.catbox.moe/qbgksz.mp4) |
| `ImageProjectionFill` | N3.3 | Image réelle bichromisée navy/gold clippée dans le polygone | [V](https://files.catbox.moe/7opcc9.mp4) |
| `PulsingRegionFill` | N3.4 | Territoire entier qui respire (opacity sin), zone de tension | [V](https://files.catbox.moe/8uvzdy.mp4) |
| `ContagionFlagSpread` ⭐ | N4.1 | Onde d'alliance : flash couleur → drapeau remplace | [V](https://files.catbox.moe/k84gjl.mp4) |

**Helpers :**
- **`useClipFlags.tsx`** ⭐⭐ — projeter un VRAI drapeau dans un pays (vraies images HD clippées SVG, net à toute échelle). `useClipFlags(mapRef, flags, frame)` + `<ClipFlagsLayer>`. `mainlandBox` obligatoire pour pays à outre-mer (France). **LA bonne technique drapeau** — pas `drawFlagCanvas` (approximatif). Utilisé par Beat1 + Beat3 Maroc.
- `flagCanvas.ts` — drapeaux dessinés (approximatifs, éviter pour drapeau visible) + `countryFilter(iso, boundaryIsos)` (filtre fill par ISO, jamais `name`).
- `resourceTextures.ts` (6 textures). Drapeaux HD : `public/_shared/flags/` (Wikimedia SVG → rsvg-convert). Asset gen image : `scripts/tools/gemini-gen-image.py`.

## 🏷️ PLAQUES & OVERLAYS NARRATIFS (pattern Or Africain — validé 2026-06-03)

> Extrait de Or Africain Beat4. **Complément aux dots, PAS un remplaçant** — brille pour afficher une SOURCE de façon épurée. Fichier : `GeoCountryPlaque.tsx`. Showcase : https://files.catbox.moe/8ww81g.mp4

| Composant | Effet | Cas d'usage |
|---|---|---|
| `GeoCountryPlaque` ⭐ | Pilule NOM + encart STAT (serif gold) + SOURCE (mono). Mode "top" ou géo-ancré (`pos`) | Annoncer un pays + donnée + source ("$430M — Bloomberg") |
| `GeoProgressCounter` | Compteur "X / N" + label | Cumul narratif (combien de cas révélés) |
| `GeoClimaxOverlay` | Gros titre gold glow + sous-titre, carte assombrie | Conclure un beat ("4 PAYS. UN MÊME SIGNAL.") |

**Caméra relief 3D** : `camCountryApproach(center, {bearing})` dans `MapboxBase.tsx` → zoom 4.7 **pitch 32**. C'est le pitch qui crée le relief (pas de terrain 3D). Standard futurs beats focus pays. Pull back : `CAM_MULTI_PULLBACK_DEFAULTS`.

---

## Fichier utilitaire principal

`src/projects/_shared/mapbox/MapboxBase.tsx`

Exports disponibles :

| Export | Usage |
|--------|-------|
| `MAPBOX_STYLES` | 5 styles prêts : dark, satellite, relief, light, navNight |
| `CamState` | Type caméra (lon, lat, zoom, pitch, bearing) |
| `lerpCam(a, b, t)` | Interpolation caméra avec easing quadratique |
| `CAM_PRESETS` | Caméras canoniques : space, westAfrica, ghana, mali, mediterranean, empireGhana |
| `removeLabels(map)` | Supprime tous les labels (carte épurée) |
| `addCountryHighlight(map, iso, color)` | Highlight pays par code ISO |
| `ISO` | Codes ISO pays africains (GHA, MLI, BFA, NER...) |
| `COUNTRY_CENTERS` | Coordonnées centres pays |
| `STYLE_GEO_AFRIQUE_V5` | Palette validée : water `#1a3a5c`, land `#4a4a4a`, border `#c8c8c8` |
| `applyGeoAfriqueV5(map)` | **TOUJOURS UTILISER** — applique palette + supprime labels en une ligne. Appeler dans `style.load`. Valide Or Africain 2026-05-07. |

---

## Styles validés visuellement (2026-05-06)

| Style | Rendu | Usage recommandé |
|-------|-------|-----------------|
| `dark` | Fond noir, frontières grises subtiles, routes fines | **Type B analytique — DEFAUT** |
| `satellite` | Photo NASA, continents réels | Hook depuis l'espace, impact immédiat |
| `relief` | Reliefs topographiques, courbes de niveau | Hannibal Alpes, traversées montagnes |
| `light` | Fond blanc/gris, propre | Infographie classique |
| `navNight` | Dark + autoroutes colorées | Routes, flux, migrations |

---

## Compositions POC disponibles

| Composition | Fichier | Format | Frames | Description |
|-------------|---------|--------|--------|-------------|
| `MapboxGhanaHighlight` | `poc-money-legends/MapboxGhanaHighlight.tsx` | 1920×1080 | 180 | Zoom espace→Ghana, highlight or, dark épuré |
| `MapboxAfricaMulti` | `poc-money-legends/MapboxAfricaMulti.tsx` | 1920×1080 | ~480 | 5 pays successifs avec mouvements caméra variés |
| `MapboxStyleShowcase` | `poc-money-legends/MapboxStyleShowcase.tsx` | 1920×1080 | 750 | 5 styles × 5s chacun avec badges |
| `MapboxTypeBVertical` | `poc-money-legends/MapboxTypeBVertical.tsx` | 1080×1920 | 870 | **TEMPLATE TYPE B** vertical, voix+musique+pings synchronisés |

---

## Pattern Type B validé — structure de base

```tsx
// 1. Zoom depuis l'espace vers le pays principal
CAM_INTRO → CAM_PAYS_PRINCIPAL  (0 → frame_allumage)

// 2. Gros plan pays principal + label
CAM_PAYS_PRINCIPAL  (frame_allumage → frame_pullback)

// 3. Pullback Afrique de l'Ouest + pays secondaires s'allument
CAM_PULLBACK  (frame_pullback → fin)

// Audio synchronisé via forced alignment ElevenLabs
// SFX ping à chaque frame d'allumage pays
```

## Règles non-négociables Type B (validées POC 2026-05-06)

1. **Carte épurée** — toujours appeler `removeLabels(map)` dans `style.load`
2. **Style dark par défaut** pour Type B analytique
3. **Nommer les acteurs explicitement** dans le script (jamais "six gouvernements")
4. **Années TTS** en lettres orales : "deux mille vingt-six" pas "vingt-vingt-six"
5. **Forced alignment** pour synchroniser les highlights avec la voix
6. **Mix audio séparé** (ffmpeg) pour valider l'audio avant render final

---

## Parchemin Mande Mapbox (à faire)

Style custom via Mapbox Studio — texture parchemin/papyrus, typo cartographique africaine.
Une fois créé : URL `mapbox://styles/azizbf12/<style-id>` à ajouter dans `MAPBOX_STYLES`.
Idéal pour épisodes Atlas (Mansa Moussa, Empire Ghana, Tombouctou).

## ⭐⭐ `MapboxCameraLab` — les 12 mouvements de caméra catalogués (indexé le 2026-08-21)

`src/projects/_shared/mapbox/MapboxCameraLab.tsx` · composition Root.tsx **`Mapbox-Camera-Lab`**.

**Laboratoire de référence** : 12 mouvements de caméra Mapbox, 10 s chacun, **avec le nom du mouvement
affiché en HUD dans l'image** — drift continu · orbit + dolly in · whip pan multi-stop · zoom + freeze ·
tilt + pull back · counter-rotation · drift + blur atmosphérique · pull back planétaire · zoom sol 3D ·
fade style switch · whip pan + style switch · zoom out → style → in.

⛔ **Il existait AVANT le 2026-08-21 et n'était indexé NULLE PART** — découvert seulement parce que la
galerie l'a rendu visible. Cas d'école de « chercher l'existant avant de produire ».

**Le voir** : https://aziztraorebf-ctrl.github.io/remotion/ (posters + clips de chaque geste, recherche
en langage courant). Rendu source : `out/episodes/_shared/mapbox-camera-lab-v2.mp4` (120 s).
