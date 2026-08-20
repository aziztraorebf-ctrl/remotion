# Assets Index — Source de vérité unique

> **Fichier vivant** — mis à jour à chaque validation d'asset/template (règle CLAUDE.md).
> Couvre code (`src/projects/_shared/`) + assets visuels & audio (`public/_shared/`).
> Dernière mise à jour : 2026-05-21 (+3 layouts Vague 7 : PortraitSilhouette, MosaïqueActeurs, PassationPouvoir — templates personnages & réseaux).
> **Règle visuelle** : texte à l'écran = erreur par défaut. Icônes Lucide > texte. Max 1-2 mots par élément. Jamais de phrase.

## 🎵 MUSIQUES — 67 pistes existantes, index dédié

⛔ **AVANT TOUT APPEL Minimax/fal.ai : lire `public/_shared/audio/INDEX-MUSIQUES.md`.**
71 fichiers musicaux (67 uniques + 4 doublons binaires) vivaient dans `public/` **sans aucun index** —
d'où des variantes payées plusieurs fois parce qu'introuvables. L'index les mesure toutes
(durée · amplitude · **bande 200 Hz–2 kHz de la voix**) et isole les **12 pistes longues+stables**
utilisables telles quelles sur un mid-form. Générer sans l'avoir lu = re-payer ce qu'on possède.

## 🎨 Mockups Gemini — blueprints de design

**Path** : `public/_shared/previews/mockups-gemini/`
**README** : `public/_shared/previews/mockups-gemini/README.md` — catalogue complet + workflow re-diffusion

Ces images sont les **références design originales** de chaque template, générées par le modele image Gemini (`IMAGE_MODEL`, defaut Lite) avant le codage. Utiliser pour :
- Comprendre l'intent design d'un template existant
- Re-diffuser vers `gemini-3.1-pro-preview` pour demander des améliorations
- Faire un diff render actuel vs mockup source

| Template | Mockup local | URL catbox (permanente) |
|---|---|---|
| **BarRace** | `Layout-BarRace-mockup-gemini.png` | https://files.catbox.moe/6hq9zo.png |
| **PulseNumber** | `Layout-PulseNumber-mockup-gemini.png` | https://files.catbox.moe/qloo3o.png |
| **StackedBars** | `Layout-StackedBars-mockup-gemini.png` | https://files.catbox.moe/bciqg8.png |
| **ScaleShock** | `Layout-ScaleShock-mockup-gemini.png` | https://files.catbox.moe/koode6.png |
| **Timeline** | `Layout-Timeline-mockup-gemini.png` | https://files.catbox.moe/1s0hhz.png |
| **NetworkGraph** | `Layout-NetworkGraph-mockup-gemini.png` | https://files.catbox.moe/v2luef.png |
| **IconGrid** | `Layout-IconGrid-mockup-gemini.png` | https://files.catbox.moe/1kisbo.png |
| **IconStat** | `Layout-IconStat-mockup-gemini.png` | https://files.catbox.moe/ammoun.png |
| **ProcessFlow** | `Layout-ProcessFlow-mockup-gemini.png` | https://files.catbox.moe/r05h5v.png |
| **TypeReveal v1** (rejeté) | `Layout-TypeReveal-v1-mockup-gemini.png` | https://files.catbox.moe/sofpfu.png |
| **TypeReveal v2** (validé) | `Layout-TypeReveal-v2-mockup-gemini.png` | https://files.catbox.moe/rkjgrh.png |

> **Règle** : toujours copier le mockup dans ce dossier IMMÉDIATEMENT après génération Gemini, avant le breakdown. Ne pas attendre la fin de session (les fichiers `/tmp/` sont perdus au reboot).

---

## 🎬 Templates compositions (utilisables tels quels)

### Template — BrutalHookSplit (hook photo + texte typewriter + Ken Burns diagonal)

**Path code** : `src/projects/_shared/components/layouts/BrutalHookSplit.tsx`
**Status** : ✅ Validé production Silicon Savannah Beat1 — 2026-05-14
**Cas d'usage** : beat d'ouverture hook (5-12s) — photo plein haut + narration typewriter mot par mot + accent Bebas Neue doré

**Anatomie visuelle :**
- Haut (`photoRatio` %) : photo avec **Ken Burns diagonal** (zoom 1.0→1.15 + drift latéral + léger montée) dans `overflow:hidden` — aucun débordement
- Bas (reste) : fond `#0a0a0a` avec gradient de raccord photo→texte (220px)
- Lignes narration : `Inter 60px`, typewriter 9f/mot, apparition par `lineTriggers[]`
- Accent : `Bebas Neue 128px`, couleur `accentColor` (défaut `#FFB800`), slide-up spring
- Tag étiquette : bandeau `accentColor` en haut à gauche
- Barre signature : `scaleX` spring sous l'accent

**Props clés :**
```tsx
<BrutalHookSplit
  photoSrc={staticFile("mon-projet/assets/photo.jpg")}
  bgSrc={staticFile("mon-projet/bg-texture.png")}   // optionnel
  lines={["Ligne 1", "Ligne 2", null, "Ligne 3"]}   // null = spacer
  lineTriggers={[2, 76, -1, 178]}
  accentText="MON PAYS."
  accentTrigger={282}
  tagLabel="PAYS · SUJET"
  sourceLabel="SOURCE · ANNÉE"
  duration={330}
  // Optionnels — valeurs par défaut déjà calées:
  photoRatio={0.55}        // 55% photo / 45% texte
  kenBurnsScale={1.15}     // zoom final
  kenBurnsDriftX={-0.04}   // drift gauche (-) ou droite (+)
  kenBurnsDriftY={-0.03}   // drift haut (-) ou bas (+)
  accentColor="#FFB800"
/>
```

**Règles importantes :**
- Toujours ajouter `<Audio>` narration + musique DANS le composant parent (pas dans BrutalHookSplit)
- `endAt` sur la narration = timestamp fin du dernier mot spoken (depuis alignment JSON)
- `lineTriggers` = frames absolues du beat standalone (depuis alignment ElevenLabs)
- `kenBurnsScale={1.15}` = le minimum pour que le zoom soit perceptible sans déformer
- Photo doit être au moins 1.15x plus grande que le conteneur pour que Ken Burns ne montre pas de bord blanc

---

### Template A — MapboxGeoAfriqueV5 (style signature dark Souverain)

**Path code** : src/projects/poc-money-legends/MapboxOceanColor.tsx → `MapboxGeoAfriqueV5`
**Style helper partagé** : `src/projects/_shared/mapbox/MapboxBase.tsx` → `applyGeoAfriqueV5`, `STYLE_GEO_AFRIQUE_V5`
**Composition Remotion** : `MapboxGeoAfriqueV5` (Root.tsx, 300 frames)
**Status** : ✅ Validé production Or Africain 2026-05-07 — style signature de la chaîne GéoAfrique
**Cas d'usage** : toute scène carte dark Souverain — situer un pays avec highlight pays focus, zoom continent→pays, pitch cinématique

**Palette** :
- Océan : `#1a3a5c` (bleu profond)
- Terres : `#4a4a4a` (gris désaturé)
- Frontières : `#c8c8c8` (blanc subtil)
- Fond espace : bleu-gris foncé (pas noir pur)
- Highlight pays : `#FFB800` (or chaud — modulable par épisode)

**Éléments inclus dans la composition POC** :
- `StarField` en fond (z=0)
- Carte Mapbox dark-v11 + overrides palette (z=1, brightness +30%)
- Highlight pays cible (fill + border)
- Badge titre en haut-gauche (z=2, fade-in frame 30→60)
- Animation caméra : zoom 1.4→4.0 + lat/lon drift + pitch 0→30°

| Phase | Preview |
|---|---|
| Mid (globe Afrique + Ghana highlight or) | ![ghav5-mid](https://files.catbox.moe/8ico3w.png) |
| End (zoom Afrique de l'Ouest + Ghana) | ![ghav5-end](https://files.catbox.moe/lrnas3.png) |

**API minimale pour réutilisation** :
```tsx
import { applyGeoAfriqueV5, STYLE_GEO_AFRIQUE_V5 } from "../_shared/mapbox/MapboxBase";

map.on("style.load", () => {
  applyGeoAfriqueV5(map);
  // Ajouter highlight pays cible par-dessus
});
```

**Utilisé dans** : `Beat3aLeFait.tsx` (Or Africain), `S1HookNiger.tsx` (Niger Uranium)

---

### Template B — CartoCaspian (Mapbox éditorial 2D)

**Path code** : `src/projects/_shared/mapbox/templates/CartoCaspian.tsx`
**Demo** : `Insert-CartoCaspianDemo` dans Root.tsx
**Status** : ✅ V1 validé Aziz 2026-05-09
**Cas d'usage** : géopolitique narrative, vue plate Mercator, océan crème + terre claire

| Phase | Preview |
|---|---|
| End (Niger or + Algérie indigo) | ![carto](https://files.catbox.moe/bmb8mn.png) |

**API minimale** :
```tsx
import { applyCartoCaspian, CASPIAN_SEPIA, CASPIAN_NOIR } from "../mapbox/templates/CartoCaspian";
applyCartoCaspian(map, CASPIAN_SEPIA);  // default Niger uranium
```

**4 palettes disponibles** (Jour 5) — partagent grammaire/typo/highlights, seule la "lumière" change :

| Palette | Catbox | Usage recommandé |
|---|---|---|
| `CASPIAN_PALETTE` (original) | https://files.catbox.moe/m22mdh.mp4 | Référence Or Africain, lumineux. Frontières discrètes. |
| `CASPIAN_SEPIA` ⭐ | https://files.catbox.moe/6twbzh.mp4 | **DEFAULT Niger uranium**. Lisibilité max + ADN papier archives. |
| `CASPIAN_SMOKE` | https://files.catbox.moe/fpg8po.mp4 | Neutre désaturé. Rare use (sujets austères). |
| `CASPIAN_NOIR` | https://files.catbox.moe/6rl0al.mp4 | Variante climax / révélation dramatique. Cohérence EntityDiagram dossier. |

**Principe color script** : OK de changer de variante DANS une vidéo (Sepia → Noir pour climax) car même grammaire visuelle = pas de rupture stylistique. NE PAS changer de family (Caspian → AtlasRealiste3D = rupture).

**Mémoire dédiée** : memory/feedback_caspian-niger-palettes-validated.md

---

### Template C — AtlasRealiste3D (Mapbox satellite 3D)

**Path code** : `src/projects/_shared/mapbox/templates/AtlasRealiste3D.tsx`
**Demo / Showcase** : `TemplateC-AtlasRealiste3DDemo` / `TemplateC-AtlasRealiste3DShowcase`
**Status** : ✅ V3 validé jury 3 LLMs 2026-05-09
**Cas d'usage** : situer un pays géographiquement avec contexte continent, satellite + relief
**Décision jury** : abandon overlay monde gris, **garder uniquement hillshade + pays focus or**

| Phase | Preview |
|---|---|
| Niger Sahel — vue continentale | ![atlas-niger](https://files.catbox.moe/3ad6qf.png) |
| Mali — zoom relief | ![atlas-mali](https://files.catbox.moe/1vvnvo.png) |

**API minimale** :
```tsx
import { applyAtlasRealiste3D, addCountryFocus, ATLAS3D_PALETTE } from "../mapbox/templates/AtlasRealiste3D";
applyAtlasRealiste3D(map);                        // satellite + hillshade
addCountryFocus(map, "NER", ATLAS3D_PALETTE.accentOr);
```

---

### Template C-bis — MapboxSatelliteSenegal (16:9 cinématique camera flyTo)

**Path code** : `src/projects/_proto-16-9/Prototype_A_MapboxSatelliteSenegal.tsx`
**Composition Remotion** : `ProtoA-MapboxSatelliteSenegal` (1920×1080, 180 frames / 6s)
**Status** : ✅ V1 validé Aziz 2026-05-21 — premier template Mapbox 16:9 cinématique du projet
**Cas d'usage** : ouverture mid-form documentaire — zoom continent → pays → zone offshore avec pitch progressif (0→55°) + bearing (0→-20°). Look Caspian Report / Johnny Harris.
**Backlog améliorations** : [`memory/archive/backlogs-perimes-2026-07-11/backlog-ameliorations-mapbox-satellite.md`](../../memory/archive/backlogs-perimes-2026-07-11/backlog-ameliorations-mapbox-satellite.md) — PÉRIMÉ (projet Sénégal V3 terminé) — V2 prioritaire : éclaircir océan (trop sombre actuellement)

**Anatomie** :
- Style satellite-v9 + applyAtlasRealiste3D (hillshade)
- 3 keyframes camera (start → mid → end) avec lerp linéaire
- Sénégal highlight or `#d4a93c` à 55% opacity
- Vignettage radial gradient (rgba(0,0,0,0.55) sur bords)
- Cartouche haut-gauche "SÉNÉGAL / BLOC SANGOMAR" spring entry
- Label bas-droite "100 km offshore — Opérateur Woodside Energy" fade-in

| Phase | Preview |
|---|---|
| Mid (zoom intermédiaire côte Atlantique) | ![senegal-mid](https://files.catbox.moe/hnvai5.png) |
| End (zoom final Sangomar pitch 55°) | ![senegal-end](https://files.catbox.moe/1zm06w.png) |

**Vidéo complète (6s)** : https://files.catbox.moe/zdramv.mp4
**Render local FINAL** : `out/templates-souverain/FINAL-MapboxSatelliteSenegal-v1-16x9.mp4`

**Render obligatoire via script** :
```bash
./scripts/render-mapbox.sh ProtoA-MapboxSatelliteSenegal out/render.mp4
```
⚠️ JAMAIS `npx remotion render` direct — voir [memory/feedback_mapbox-render-pattern-canonique.md](../../memory/feedback_mapbox-render-pattern-canonique.md)

**Adaptation pour autre pays** : copier le fichier, changer ISO (`addCountryFocus(map, "MAR"...)`) + coordonnées CAM_START/MID/END pour cibler la zone.

---

## 🗺️ Templates Mapbox CARTE VIVANTE — Chantier C (2026-06-02, hybrides V+H)

> 9 templates premium dans `src/projects/_shared/mapbox/`. Vraie carte vivante (drift, altitude pays, océan navy, voisins ivory), charte navy/gold. Render via `scripts/render-mapbox.sh`. **Détails complets + previews + cas d'usage : `src/projects/_shared/mapbox/MAPBOX-COMPOSANTS.md` et `src/projects/_shared/COMPOSANTS-INDEX.md` (section CARTE/GÉO).**

- `MapboxFlagFill` — drapeau/image clippé(e) dans la silhouette (projette toute image + bichromie)
- `MapboxIsolateZone` — spotlight pays + zone offshore hachurée + badge + stat
- `SequentialBorderPulse` — frontières s'allument en séquence
- `GlassmorphismGeoPopup` — encarts données ancrés au point geo
- `SequentialFlagReveal` — pays s'allument avec leur drapeau (séquentiel, technique chaînes)
- `LottieGeoAura` — Lottie premium ancré au point (assets `lottie/premiumLottieAssets.ts`)
- `SweepRevealTerritory` ⭐ — faisceau lumineux révèle le pays (scanner)
- `DominoContagionFill` — couleur contamine les pays par vagues
- `FiberOpticBorderDraw` ⭐ — frontière se dessine en laser doré

Backlog idées Gemini : `memory/tools/gemini-template-ideas-v2-2026-06-02.json`.

---

## 🎨 Templates 16:9 — Vague 3 (Mécaniques signature)

> Codés sur specs JSON Gemini 3.1-pro. Tous transparents (`bgColor="transparent"`). Utilisés via `<SouverainScene>` + `DarkCssBg`.
> Showcase 3D-3F : `out/templates-souverain/FINAL-ProtoH-Vague3b-Showcase-v1-16x9.mp4`
> Showcase 3G-3I : `out/templates-souverain/FINAL-ProtoI-Vague3c-Showcase-v1-16x9.mp4`
> **ProtoQ — Showcase complet 9 templates (81s)** : [ProtoQ-Vague3-Complete-Showcase-v1.mp4](https://files.catbox.moe/0gpkz1.mp4)

---

### Template Vague3A — LaCalebasse (Capacity Fill)

**Quand l'utiliser** : Remplir une jauge de façon non conventionnelle — réserves d'uranium vs demande, caisses État post-exploitation, taux d'utilisation d'un port. Alternative au pie chart, beaucoup plus mémorable.

**Path code** : `src/projects/_shared/components/layouts/LaCalebasse.tsx`
**Composition Remotion** : `Template-LaCalebasse` (240f, 1920×1080)

**Props clés** :
- `percentage` : 0-100 (défaut 67)
- `label` : texte principal (ex: `"RÉSERVES URANIUM"`)
- `sublabel` : contexte (ex: `"VS DEMANDE MONDIALE 2030"`)
- `liquidColor` : couleur de remplissage (défaut gold)
- `bgColor` : défaut `"transparent"`

**Mécaniques visuelles** : contour SVG draw-on, vague ondulante clipPath, odometer %, crosshairs aux coins.

**Previews** :
| Frame | Preview |
|---|---|
| MP4 render | [LaCalebasse-v1.mp4](https://i.imgur.com/EiKCOGD.mp4) |

---

### Template Vague3B — LeCadranSolaire (Ombre Équatoriale)

**Quand l'utiliser** : Frises chronologiques avec sensation de passage du temps — transition énergétique, ères pré/post-indépendance, cycle de 10/50/100 ans. L'ombre qui tourne = le temps qui avance.

**Path code** : `src/projects/_shared/components/layouts/LeCadranSolaire.tsx`
**Composition Remotion** : `Template-LeCadranSolaire` (270f, 1920×1080)

**Props clés** :
- `era1Label` / `era2Label` : noms des deux périodes (ex: `"ÈRE COLONIALE"` / `"ÈRE SOUVERAINE"`)
- `pivotYear` : année charnière affichée au centre
- `bgColor` : défaut `"transparent"`

**Mécaniques visuelles** : cercle draw-on, aiguille spring mécanique, glitch 3 frames à l'inversion, bascule colorimétrique active/inactive.

**Previews** :
| Frame | Preview |
|---|---|
| MP4 render | [LeCadranSolaire-v1.mp4](https://i.imgur.com/gIxIqCu.mp4) |

---

### Template Vague3C — Stratigraphie (Resource Cut)

**Quand l'utiliser** : Tout ce qui est sous la surface — forages Sangomar, mines uranium Niger, nappes phréatiques, strates géologiques. Coupe transversale qui révèle ce que la carte ne montre pas.

**Path code** : `src/projects/_shared/components/layouts/Stratigraphie.tsx`
**Composition Remotion** : `Template-Stratigraphie` (270f, 1920×1080)

**Props clés** :
- `layers` : array `{ label, depth, color, resource? }`
- `title` : titre du forage (ex: `"BLOC SANGOMAR — PROFIL GÉOLOGIQUE"`)
- `bgColor` : défaut `"transparent"`

**Mécaniques visuelles** : scan clipPath descendant, couches géologiques ondulées, pulse ressource, bloc info latéral.

**Previews** :
| Frame | Preview |
|---|---|
| MP4 render | [Stratigraphie-v1.mp4](https://i.imgur.com/xrVKuub.mp4) |

---

### Template Vague3D — LeSceau (Treaty Stamp)

**Quand l'utiliser** : Annoncer un acte officiel avec du poids dramatique — signature de contrat pétrolier, sanctions CEDEAO, ratification ZLECAf, résolution ONU. **Moment de pause** dans le flux narratif, équivalent d'un coup de tampon sur un document.

**Exemple en production** : narration *"En 2023, BP signe avec l'État sénégalais un contrat d'exploitation de 25 ans"* → coupe sur Le Sceau → cercle gold se trace → étoile pop → **"CONTRAT D'EXPLOITATION — SANGOMAR"** frappe l'écran.

**Path code** : `src/projects/_shared/components/layouts/LeSceau.tsx`
**Composition Remotion** : `Template-LeSceau` (240f, 1920×1080)

**Props clés** :
- `title` : texte central principal (ex: `"SANCTIONS ÉCONOMIQUES"`)
- `subtitle` : texte circulaire sur pourtour (ex: `"COMMUNAUTÉ ÉCONOMIQUE DES ÉTATS DE L'AFRIQUE DE L'OUEST"`)
- `institution` : badge sous le titre (ex: `"CEDEAO"`)
- `date` : ligne analytique bas (ex: `"JANVIER · 2024"`)
- `sealColor` : couleur du sceau (défaut gold `#c8a951`)
- `bgColor` : défaut `"transparent"`

**Mécaniques visuelles** : cercle SVG draw-on (stroke-dashoffset), texte circulaire sur textPath SVG, étoile 4 branches spring pop, impact stamp overshooting (scale 1.4→1.0), glitch titre 3 frames, date fadeIn bleu analytique.

**Previews** :
| Frame | Preview |
|---|---|
| Mid (sceau complet pré-impact) | ![sceau-mid](https://i.imgur.com/WJr79U8.jpeg) |
| End (titre + date visibles) | ![sceau-end](https://i.imgur.com/fbQY52d.jpeg) |

---

### Template Vague3E — PolyrythmieData (Syncopated Reveal)

**Quand l'utiliser** : Comparaisons entre 5-8 entités où l'ordre d'apparition raconte lui-même l'inégalité. Les barres arrivent en rythme syncopé (pas régulier — groove djembé), la dernière à arriver est la plus haute = révélation dramatique.

**Exemple en production** : *"Le déséquilibre économique de la CEDEAO est saisissant"* → MALI pop, silence, BURKINA pop, NIGER pop, silence long, SÉNÉGAL pop, GUINÉE pop, CÔTE D'IVOIRE pop en dernier (la plus haute) → ligne de moyenne bleue tranche visuellement les petites économies.

**Cas d'usage** : PIB comparé CEDEAO, productions minières (uranium Niger vs Congo vs Zambie), parts de marché pétrole africain, budgets défense vs éducation par pays.

**Path code** : `src/projects/_shared/components/layouts/PolyrythmieData.tsx`
**Composition Remotion** : `Template-PolyrythmieData` (240f, 1920×1080)

**Props clés** :
- `bars` : `Array<{ label: string; value: number; displayValue: string }>` (6 barres max recommandé)
- `maxValue` : valeur maximale de l'axe Y
- `title` : titre IBM Plex Mono en haut gauche
- `thresholdValue` : valeur de la ligne de seuil/moyenne (optionnel)
- `thresholdLabel` : label de cette ligne (ex: `"MOYENNE RÉGIONALE"`)
- `bgColor` : défaut `"transparent"`

**Mécaniques visuelles** : lignes de grille draw-on (staff musical), barres spring pop depuis bas avec délais syncopés `[20, 35, 45, 60, 70, 85]` (pattern 3+2+3), labels pays bleu analytique, valeurs gold, ligne de seuil tiretée draw-on.

**Previews** :
| Frame | Preview |
|---|---|
| Mid (5 barres visibles, seuil absent) | ![polyrythmie-mid](https://i.imgur.com/EqHegtm.jpeg) |
| End (6 barres + ligne moyenne) | ![polyrythmie-end](https://i.imgur.com/W8mkRoM.jpeg) |

---

### Template Vague3F — NoeudTisserand (Bottleneck)

**Quand l'utiliser** : Visualiser un goulot d'étranglement — plusieurs flux entrent, un seul sort (ou sort réduit). Monopole batteries Chine, dépendance corridor Mali-Burkina-Niger vers port Dakar, choke point détroit, concentration d'une chaîne de valeur.

**Exemple en production** : *"100% des exportations du Mali, du Burkina et du Niger transitent par un seul port"* → 3 fils bezier or/bleu/ivoire convergent vers un cercle rouge "GOULOT" → "PORT DE DAKAR" → fil de sortie rouge unique + indicateur "BLOQUÉ".

**Path code** : `src/projects/_shared/components/layouts/NoeudTisserand.tsx`
**Composition Remotion** : `Template-NoeudTisserand` (270f, 1920×1080)

**Props clés** :
- `inputFlows` : `Array<{ label: string; percentage: number; color?: string; side: "left" }>` (3 flux max)
- `bottleneckEntity` : nom du goulot (ex: `"PORT DE DAKAR"`)
- `bottleneckLabel` : label dans le cercle (ex: `"GOULOT"`)
- `outputLabel` : destination sortie (ex: `"TRANSIT INTERNATIONAL"`)
- `blocked` : `true` = rouge bloqué / `false` = vert fluide
- `bgColor` : défaut `"transparent"`

**Mécaniques visuelles** : paths SVG cubic bezier draw-on, épaisseur fil ∝ pourcentage, nœud central pulsant spring, squeeze animation (fils s'épaississent à l'entrée), labels + % fadeIn.

**Previews** :
| Frame | Preview |
|---|---|
| Mid (fils dessinés, nœud apparu) | ![noeud-mid](https://i.imgur.com/MEYjg9Y.jpeg) |
| End (labels % + BLOQUÉ) | ![noeud-end](https://i.imgur.com/JnUZRBU.jpeg) |

---

### Template Vague3G — LeSemeur (Awalé Shift)

**Quand l'utiliser** : Montrer que de la valeur quitte un endroit pour aller ailleurs — fuite de capitaux, IDE, fuite des cerveaux, transferts ZLECAf. La métaphore Awalé rend le flux concret et culturellement ancré : les graines bougent, tu vois exactement d'où elles partent et où elles arrivent.

**Ce qui est unique** : C'est le seul template qui montre un transfert comme un jeu de stratégie. Les fosses se vident en haut (origine) et se remplissent en bas (destination). L'animation des graines qui voyagent le long de courbes bezier est immédiatement lisible sans légende.

**Exemples en production** :
- *"En 2023, $2.3B d'IDE quittent l'Afrique de l'Ouest vers l'Europe"* → MALI/SÉNÉGAL/NIGER se vident vers FRANCE/SUISSE/UK
- *"La fuite des cerveaux : 35% des diplômés sénégalais travaillent à l'étranger"* → fosses pays africains → fosses villes européennes
- *"ZLECAf : les échanges intra-africains encore faibles"* → fosses pays → fosses pays, graines très peu nombreuses

**Path code** : `src/projects/_shared/components/layouts/LeSemeur.tsx`
**Composition Remotion** : `Template-LeSemeur` (270f, 1920×1080)

**Props clés** :
- `cups` : `Array<{ id, label, seeds, role: "source"|"destination", x, y }>` — 4 sources bas + 4 destinations haut
- `totalValue` : valeur totale affichée au centre à la fin (ex: `"$2.3B"`)
- `title` / `subtitle`
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| Mid (graines en transit, destinations qui se remplissent) | ![semeur-mid](https://i.imgur.com/guKypqg.jpeg) |
| End (labels visibles, fosses remplies) | ![semeur-end](https://i.imgur.com/YTxeSA7.jpeg) |

---

### Template Vague3H — Palimpseste (Frontières Dissolvantes)

**Quand l'utiliser** : Montrer que les découpages anciens (coloniaux, administratifs) sont devenus obsolètes face aux réalités modernes — corridors commerciaux, zones d'influence, routes de transit. Le mot "palimpseste" = parchemin réécrit par-dessus l'ancien texte.

**Ce qui est unique** : La séquence en deux temps est le cœur du template. D'abord les frontières rigides gold s'impriment sur l'écran (comme tracées à la règle — c'est voulu, ça évoque Berlin 1885). Puis elles se dissolvent, s'effacent, et des lignes courbes bleu vif les traversent librement. Le titre lui-même glitch pour changer. C'est une **contradiction animée**.

**Exemples en production** :
- *"La ZLECAf ignore les frontières coloniales"* → frontières AOF/AEF → corridors commerciaux continentaux
- *"Les routes transsahariennes relient ce que Berlin avait séparé"* → découpage Sahel colonial → routes caravanières modernes
- *"Les zones d'influence de Wagner traversent 5 pays"* → frontières officielles → zones de présence réelle

**Path code** : `src/projects/_shared/components/layouts/Palimpseste.tsx`
**Composition Remotion** : `Template-Palimpseste` (270f, 1920×1080)

**Props clés** :
- `colonialLines` : `Array<{ x1, y1, x2, y2, label, labelX, labelY }>` — lignes rigides à la règle
- `modernFlows` : `Array<{ path: string (SVG bezier), label, labelX, labelY, color? }>` — lignes organiques
- `titleColonial` / `titleModern` : les deux titres (avant/après glitch)
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| Mid (frontières coloniales gold tracées) | ![palimpseste-mid](https://i.imgur.com/T1XTJcR.jpeg) |
| End (corridors bleu par-dessus frontières dissoutes) | ![palimpseste-end](https://i.imgur.com/9yQfxZq.jpeg) |

---

### Template Vague3I — ArbreAPalabres (Stakeholder Constellation)

**Quand l'utiliser** : Cartographier qui est autour de la table — et surtout de quel côté chacun se trouve. L'arbre à palabres africain est le lieu où les décisions se prennent en cercle. Ici, le sujet central rayonne vers tous ses acteurs, colorés selon leur alignement.

**Ce qui est unique** : La légende de couleur (gold = allié, bleu = neutre, rouge = adversaire) transforme une liste d'acteurs en **carte de pouvoir**. D'un seul regard, on voit qui s'oppose à qui. Les connexions entre acteurs périphériques révèlent les alliances cachées. C'est le template le plus politique de la bibliothèque.

**Exemples en production** :
- *"Autour du pétrole de Sangomar, six acteurs aux intérêts divergents"* → État/Petrosen (gold) vs Communautés/ONG (rouge) vs Woodside/sous-traitants (bleu)
- *"La crise au Niger : qui veut quoi ?"* → JUNTA (centre) → CEDEAO (adversaire rouge), France (adversaire rouge), Wagner (neutre bleu), populations (neutre bleu), AES (allié gold)
- *"Les acteurs du lithium zimbabwéen"* → LITHIUM ZIMBABWE (centre) → 6 acteurs miniers + État + ONG

**Path code** : `src/projects/_shared/components/layouts/ArbreAPalabres.tsx`
**Composition Remotion** : `Template-ArbreAPalabres` (270f, 1920×1080)

**Props clés** :
- `centralLabel` : texte centre, supporte `\n` pour deux lignes (ex: `"PÉTROLE\nSANGOMAR"`)
- `actors` : `Array<{ id, label, role?, angle, x, y, weight: 1|2|3, alignment: "ally"|"neutral"|"adversary", branchPath }>` — les coordonnées x/y et branchPath sont pré-calculées depuis angle + rayon
- `connections` : `Array<{ from, to, path }>` — arcs entre acteurs périphériques
- `bgColor` : défaut `"transparent"`

**Note production** : les `x`, `y` et `branchPath` de chaque acteur doivent être calculés depuis `angle` et `radius` (le breakdown Gemini le fait automatiquement — lui donner le nombre d'acteurs et il retourne les coordonnées exactes).

**Previews** :
| Frame | Preview |
|---|---|
| Mid (centre + premières branches) | ![arbre-mid](https://i.imgur.com/IL9G5yU.jpeg) |
| End (constellation complète + connexions + légende) | ![arbre-end](https://i.imgur.com/eutr1sZ.jpeg) |

---

## 🎨 Templates 16:9 — Vague 4 (Mécaniques FUN — Investigation & Transition)

> Showcase complet (4A-4C) : `out/templates-souverain/FINAL-ProtoJ-Vague4-Showcase-v1-16x9.mp4`
> GIF animé showcase (27s, 12fps) : https://i.imgur.com/lwJ7MMa.gif
> Workflow Gemini-first : specs reçues le 2026-05-21 depuis `gemini-3.1-pro-preview`.

### Template Vague4A — Caviardage (Document Déclassifié)

**Concept** : Un document officiel ivoire. Un marqueur noir barre progressivement les mots de langue de bois. Dessous apparaissent les vrais mots en gold. À la fin : tampon rouge "DÉCLASSIFIÉ" frappe au centre.

**Quand utiliser** : révéler le décalage discours officiel / réalité. Contrats miniers, communiqués diplomatiques, promesses de campagne vs résultats.

**Ce qui est unique** : le mouvement du marqueur est linéaire et brutal (pas de spring — comme un vrai coup de feutre). La vibration de 3 frames sur le texte barré donne un effet de choc physique. La lecture "officiel barré / vrai révélé" est immédiate.

**Exemples production** :
- "PARTENARIAT STRATÉGIQUE" → "DETTE SOUVERAINE"
- "DÉVELOPPEMENT DURABLE" → "EXTRACTION TOTALE"
- Bulletin de vote : "ÉLECTION LIBRE" → "FRAUDE ORGANISÉE"

**Path code** : `src/projects/_shared/components/layouts/Caviardage.tsx`
**Composition Remotion** : `Template-Caviardage` (210f, 1920×1080)

**Props clés** :
- `lines` : `Array<{ official: string; real: string }>` — max 4-5 lignes
- `stampText` : défaut `"DECLASSIFIE"` (sans accents pour compatibilité monospace)
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| GIF animé (séquence complète) | ![cav-gif](https://i.imgur.com/lwJ7MMa.gif) |
| Mid (barres navy + vrais mots gold) | ![cav-mid](https://i.imgur.com/Ohmz794.jpeg) |
| End (tampon rouge DÉCLASSIFIÉ) | ![cav-end](https://i.imgur.com/wfdHESo.jpeg) |

---

### Template Vague4B — FilRouge (Tableau d'Enquête)

**Concept** : Un tableau d'investigation sombre. Des fiches ivoire apparaissent une à une (spring pop + punaise rouge). Un fil rouge se trace entre elles en zigzag. La dernière fiche — "BÉNÉFICIAIRE FINAL / INCONNU" avec "?" — se révèle en bleu.

**Quand utiliser** : révéler un réseau caché (corruption, trafic, flux financiers opaques). Chaque fiche = un acteur. Le fil = la chaîne de connexion. La révélation finale = le vrai bénéficiaire.

**Ce qui est unique** : le stroke-dashoffset du fil se trace en temps réel (polyline length calculée dynamiquement). La tension du fil s'épaissit via spring au dernier nœud. Les fiches apparaissent à des intervalles non réguliers (enquête qui progresse).

**Exemples production** :
- Réseau d'extraction minier : ministre → société écran → banque offshore → bénéficiaire inconnu
- Flux d'aide détournée : ONG → sous-traitant → compte Caïmans → ?
- Chaîne de commandement dans un coup d'État

**Path code** : `src/projects/_shared/components/layouts/FilRouge.tsx`
**Composition Remotion** : `Template-FilRouge` (240f, 1920×1080)

**Props clés** :
- `nodes` : `Array<{ label, role, value?, x, y, isTarget? }>` — 4-6 nœuds. isTarget=true sur le dernier (révélation finale)
- `threadPath` : path SVG polyline reliant les nœuds (`"M x y L x y L x y ..."`) — à calculer depuis les coordonnées x,y des nœuds
- `title` : titre en haut à gauche (défaut `"RESEAU D'EXTRACTION"`)
- `bgColor` : défaut `"#1a2535"` (le dark est la palette naturelle du tableau)

**Previews** :
| Frame | Preview |
|---|---|
| GIF animé (séquence complète) | ![fil-gif](https://i.imgur.com/lwJ7MMa.gif) |
| Mid (fil en cours de tracé, 4 fiches) | ![fil-mid](https://i.imgur.com/i5xwnPF.jpeg) |
| End (5 fiches + révélation "?" bleu) | ![fil-end](https://i.imgur.com/muuYiY9.jpeg) |

---

### Template Vague4C — SovereignEclipse (Transition Chapitre)

**Concept** : Un disque noir glisse de gauche, recouvre l'écran. Au pic : un anneau gold éclate du centre avec 6 arcs fragmentés qui partent en étoile. Le texte du chapitre apparaît au centre. Puis le disque repart vers la droite, révélant la scène suivante.

**Quand utiliser** : transition entre grandes parties d'un documentaire. Marque un tournant narratif fort. Vibe Vox/Caspian mais avec signature solaire africaine.

**Ce qui est unique** : le disque entre en interpolation cubique (régulier, inéluctable — pas spring). L'anneau éclate en spring haute stiffness (choc visuel au peak). Les 6 arcs fragmentés partent radialement comme une couronne solaire. Effet ciné premium.

**Exemples production** :
- "CHAPITRE II — L'EXTRACTION" entre deux phases d'un documentaire pétrole
- "ACTE III — LA RÉSISTANCE" dans un récit historique
- Transition "AVANT / APRÈS" dans une analyse économique

**Path code** : `src/projects/_shared/components/layouts/SovereignEclipse.tsx`
**Composition Remotion** : `Template-SovereignEclipse` (180f, 1920×1080)

**Props clés** :
- `chapterLabel` : ligne supérieure (ex: `"CHAPITRE II"`)
- `chapterTitle` : titre principal (ex: `"L'EXTRACTION"`)
- `eclipseColor` : couleur du disque (défaut `"#1a2535"`)
- `ringColor` : couleur de l'anneau (défaut `"#c8a951"`)
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| GIF animé (séquence complète) | ![eclipse-gif](https://i.imgur.com/lwJ7MMa.gif) |
| Mid (anneau gold + fragments + texte chapitre) | ![eclipse-mid](https://i.imgur.com/SH0ctB2.jpeg) |
| End (disque sorti, scène suivante révélée) | ![eclipse-end](https://i.imgur.com/lZcHPRS.jpeg) |

---

### Template D — KraftCard (insert identité acteur)

**Path code** : `src/projects/_shared/components/inserts/KraftCard.tsx` (3 variantes : kraft / slate / ivoire)
+ **Preset Direction C** : `src/projects/_shared/components/inserts/KraftCardDocClassifie.tsx` ⭐ paramétrable
**Showcase** : `TemplateD-KraftCardShowcase` (3 options visuelles)
**Status** : ✅ V3 validé jury 3 LLMs 2026-05-09
**Cas d'usage** : identité acteur (citation, fiche pays, document classifié)

#### Option 1 — Cadre collection (premium muséal)

| Phase | Preview |
|---|---|
| Mid | ![cadre-mid](https://files.catbox.moe/xzkfd5.png) |
| End | ![cadre-end](https://files.catbox.moe/7jskuc.png) |

#### Option 2 — Fond narratif drapeau (citation incarnée — KEEP jury)

| Phase | Preview |
|---|---|
| Mid | ![narratif-mid](https://files.catbox.moe/s5sx6y.png) |
| End | ![narratif-end](https://files.catbox.moe/uc3d6j.png) |

#### Option 3 — Document classifié ⭐ (Direction C, paramétrable)

| Phase | Preview |
|---|---|
| Mid (polaroid posé) | ![doc-mid](https://files.catbox.moe/rqcvea.png) |
| End (tampon apparu) | ![doc-end](https://files.catbox.moe/z1mkbm.png) |

**Variantes subject (preset paramétrable)** :

| Subject | Preview |
|---|---|
| Portrait leader | ![doc-portrait](https://files.catbox.moe/efki9k.png) |
| Drapeau pays | ![doc-flag](https://files.catbox.moe/45oqjg.png) |
| Photo / icône / scan / autre | (compatible — n'importe quel ReactNode) |

**API DocClassifie** :
```tsx
import { KraftCardDocClassifie } from "../components/inserts/KraftCardDocClassifie";

<KraftCardDocClassifie
  subject={<Img src={staticFile("...")} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
  caption="M. ISSOUFOU — Niamey, 2018"
  tampon="VÉRIFIÉ"               // ou "OFFICIEL" | "CONTESTÉ" | "CLASSIFIÉ"
  tamponSubtext="SOURCE PRIMAIRE"
  note="Discours ONU 2018, repris par Le Monde Afrique."
/>
```

---

### Template Insert — BrutalHeadline (titre choc + photo plein cadre)

**Path code** : `src/projects/_shared/components/inserts/BrutalHeadline.tsx`
**Showcase** : `Jour4-ShowcaseA-BrutalHeadline-DataCard-BigStat` (phases 0-1) + `Jour4-ShowcaseV2-Iterations` (phases 2-4)
**Status** : ✅ KEEP — validé jury 3 LLMs 2026-05-09
**Cas d'usage** : hook accrocheur, thumbnail éditorial, brutalisme journalistique

| Variant | Preview |
|---|---|
| Noir (placeholder) | ![bh-noir](https://litter.catbox.moe/05vzg6.png) |
| Rouge | ![bh-rouge](https://litter.catbox.moe/uh9vur.png) |
| + Photo B&W terrain ⭐ (priorité 1) | ![bh-bw](https://litter.catbox.moe/x2wk3n.png) |
| + Illustration gravure ⭐ (priorité 2) | ![bh-illus](https://litter.catbox.moe/ioglc9.png) |

**Règle jury** : photo slot = TOUJOURS B&W ou duotone noir/or/sable. Jamais couleur brute.
**Assets Gemini disponibles** : `public/_shared/brutal-headline-assets/terrain-bw.png` + `illustration-stylisee.png`

**API** :
```tsx
import { BrutalHeadline } from "../components/inserts/BrutalHeadline";

<BrutalHeadline
  headline="L'URANIUM QUI VAUT UN EMPIRE"
  subline="Niger · 2006–2026"
  tag="SOUVERAIN"
  variant="noir"       // "noir" | "rouge" | "blanc"
  photoRatio={0.58}    // fraction de l'écran pour la photo (0.5–0.65)
  photo={<Img src={staticFile("_shared/brutal-headline-assets/terrain-bw.png")} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
/>
```

---

### Template Insert — DataCard (fiche donnée chiffre central)

**Path code** : `src/projects/_shared/components/inserts/DataCard.tsx`
**Showcase** : `Jour4-ShowcaseA-BrutalHeadline-DataCard-BigStat` (phases 2-3)
**Status** : ✅ KEEP+TWEAK — jury 3 LLMs 2026-05-09 (kraft contraste corrigé)
**Cas d'usage** : preuve documentaire (source + contexte + comparaison)

| Variant | Preview |
|---|---|
| Kraft (sujets ressources/archives) | ![dc-kraft](https://litter.catbox.moe/jcqxq2.png) |
| Dark (chiffre choc, contexte financier) | ![dc-dark](https://litter.catbox.moe/dlqiht.png) |

**API** :
```tsx
import { DataCard } from "../components/inserts/DataCard";

<DataCard
  value="3 500 T"
  label="d'uranium extrait par an"
  source="AIEA, 2022"
  context="2e producteur africain"
  country="Niger"
  variant="kraft"   // "cream" | "kraft" | "dark"
/>
```

---

### Template Insert — BigStat (chiffre seul, impact maximal)

**Path code** : `src/projects/_shared/components/inserts/BigStat.tsx`
**Showcase** : `Jour4-ShowcaseA-BrutalHeadline-DataCard-BigStat` (phase 4)
**Status** : ✅ KEEP — consensus 3/3 jury 2026-05-09
**Cas d'usage** : emphase narrative "écoutez bien ce chiffre" — 1 à 2 secondes max

| Variant | Preview |
|---|---|
| Noir | ![bs](https://litter.catbox.moe/m3q1kh.png) |

**API** :
```tsx
import { BigStat } from "../components/inserts/BigStat";

<BigStat
  value="$3.7B"
  unit="par an"
  label="extraits du sol nigérien"
  variant="noir"   // "noir" | "blanc" | "accent"
/>
```

---

### Template Insert — NewsClipping V2 (article presse plein écran)

**Path code** : Inline dans `Jour4ShowcaseV2.tsx` → **à extraire en composant autonome** lors du 1er usage production
**Showcase** : `Jour4-ShowcaseV2-Iterations` (phases 0-1)
**Status** : ✅ KEEP — référence standard citation presse (consensus 3/3)
**Décision** : V1 (posé avec rotation) = DROP. V2 plein écran = standard adopté.

| Variant | Preview |
|---|---|
| Crème (standard, Le Monde Afrique) | ![nc-creme](https://litter.catbox.moe/kg968f.png) |
| Grain + accent source (Reuters → rouge brique) | ![nc-grain](https://litter.catbox.moe/6oxic3.png) |

**Règle** : accent couleur = palette chaude uniquement (`#c8972b` or par défaut, `#8B3A2A` rouge brique pour sources anglophones type Reuters/AP).

---

### Template Insert — DateBar (marqueur temporel)

**Path code** : `src/projects/_shared/components/inserts/DateBar.tsx`
**Showcase** : `Jour4-ShowcaseB-NewsClipping-DateBar` (phases 1-2)
**Status** : ✅ KEEP — 2 usages conservés (consensus 3/3)
**Cas d'usage** : deux modes distincts

| Mode | Preview | Quand |
|---|---|---|
| Fullscreen or (transition chapitre) | ![db-full](https://litter.catbox.moe/zaqa4z.png) | Saut temporel majeur, "titre de section" |
| Bottom overlay | ![db-bottom](https://litter.catbox.moe/c2scj2.png) | Calage date discret sur b-roll ou carte |

**API** :
```tsx
import { DateBar } from "../components/inserts/DateBar";

<DateBar date="1960" label="Indépendance du Niger" position="fullscreen" colorVariant="or" />
<DateBar date="12 Novembre 2018" position="bottom" colorVariant="or" />
```

---

### Template Insert — SmallMultiplesGrid (data-viz comparatif multi-pays)

**Path code** : `src/projects/_shared/components/inserts/SmallMultiplesGrid.tsx`
**Demos** : `Insert-SmallMultiplesGridDemoA-Cream` + `Insert-SmallMultiplesGridDemoB-Kraft`
**Status** : ✅ V4 validé jury 3 LLMs 2026-05-09
**Cas d'usage** : comparaison brutale multi-pays (3 entités), point doré sur la valeur clé, source institutionnelle inline

#### Variante Cream (pédagogique calme)

| Phase | Preview |
|---|---|
| Start (1ère ligne apparue) | ![smg-start](https://files.catbox.moe/thnqh7.png) |
| Mid (3 courbes finies) | ![smg-mid](https://files.catbox.moe/pyw0yw.png) |
| End (annotations + dates) | ![smg-end](https://files.catbox.moe/pyw0yw.png) |

#### Variante Kraft (sujets ressources/extraction)

| Phase | Preview |
|---|---|
| Mid + End | ![smg-kraft](https://files.catbox.moe/zmuisk.png) |

**API** :
```tsx
<SmallMultiplesGrid
  variant="cream"  // ou "kraft"
  items={[
    { entity: "Niger", image: "...", data: [0.15, 0.22, ...], annotation: "Pic 2010", source: "World Bank, 2023" },
    ...
  ]}
  xLabels={["1990", "2000", "2010", "2020"]}
/>
```

---

### Layout — CountdownReveal (arc SVG animé + countUp + flash révélation)

**Path code** : `src/projects/_shared/components/layouts/CountdownReveal.tsx`
**Composition Remotion** : `Layout-CountdownReveal` (120 frames, 30fps)
**Status** : ✅ VALIDÉ Aziz 2026-05-13 — production-ready, zéro asset externe requis
**Built with** : Tailwind CSS 3 + SVG arc `strokeDashoffset` + `interpolate`

**Props principales** :
- `label` : texte haut (Cinzel bold uppercase, ex: "DEPUIS L'INDÉPENDANCE")
- `subLabel?` : ligne secondaire sous le label (ex: "1960 — 2024")
- `value` : valeur finale du countUp (ex: 64)
- `unit` : unité sous le chiffre (ex: "ans")
- `contextText` : texte contexte bas (supporte `\n` pour saut de ligne)
- `fillDegrees?` : degrés remplis à la fin (défaut: 340 — laisse un gap en haut-gauche)
- `accentColor?` : couleur arc (défaut: `#c8a951` gold)
- `trackColor?` : couleur piste vide (défaut: `#1a2535`)
- `startFrame` / `revealFrame` : timing de l'animation

**Architecture** :
```
AbsoluteFill bg-navy-deep
├── label block (absolute top:120)
├── SVG ring 880×880 (absolute centré 50%/50%) — r=390, strokeWidth=32
│   └── value overlay (chiffre 380px + unité 88px, centré dans le ring)
├── context block (absolute bottom:160)
└── flash AbsoluteFill blanc (opacity spike 6f sur revealFrame)
```
- Arc se remplit de 0→fillDegrees via `interpolate` (pas de spring — progression linéaire)
- CountUp : `Math.round(interpolate(...))` de 0→value
- Flash final : spike 3 keyframes `[revealFrame-1, revealFrame+1, revealFrame+4]`

| Phase | Preview |
|---|---|
| Start (arc vide, chiffre à 0) | ![cd-start](https://files.catbox.moe/pq3wxb.png) |
| Mid (arc 57%, chiffre 37) | ![cd-mid](https://files.catbox.moe/geehdt.png) |
| End (arc 340°, chiffre 64, flash) | ![cd-end](https://files.catbox.moe/db2qxr.png) |

**Quand utiliser** : tension narrative "compte à rebours" avant une révélation. Années écoulées depuis indépendance, ressources extraites, coups d'état depuis 1960, etc.
**Cas validé** : "64 ans depuis l'indépendance — France détient 75% uranium nigérien"

---

### Layout — PortraitGeometry (leader dans forme géométrique + typo massive)

**Path code** : `src/projects/_shared/components/layouts/PortraitGeometry.tsx`
**Composition Remotion** : `Layout-PortraitGeometry` (90 frames, 30fps)
**Status** : ✅ VALIDÉ Aziz 2026-05-13 — nécessite image portrait (`portraitSrc`)
**Built with** : Tailwind CSS 3 + clip-path CSS + positions absolues

**Props principales** :
- `bgColor` : couleur hex fond (ex: `"#8B3A2A"` rouge brique)
- `shape` : `"circle"` | `"hexagon"`
- `portraitSrc` : chemin `staticFile()` vers image portrait
- `countryName` : texte principal (Cinzel 220px ivory uppercase)
- `year` : année (Cinzel 260px gold)
- `statLine` : ligne sous l'année (Nunito Sans 58px gold, uppercase)
- `ringColor?` : couleur contour (défaut: `#c8a951`)
- `startFrame?` : défaut 0

**Architecture** :
```
AbsoluteFill (bgColor inline)
├── forme géométrique (absolute top:290, left:150, 780×780)
│   circle: border-radius:50% + border gold
│   hexagon: double div clip-path (outer=ringColor, inner=portrait)
└── text block (absolute top:1100, centré)
    countryName (220px) → divider or → year (260px) → statLine (58px)
```
- 6 springs en cascade (shape+0, portrait+6, country+14, divider+20, year+26, stat+36)
- Pour hexagone : `polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)`
- Double div obligatoire pour hexagone (clip-path + border ne se combinent pas)

| Phase | Preview |
|---|---|
| Start (forme scale-in) | ![pg-start](https://files.catbox.moe/hckfqv.png) |
| Mid (portrait + typo en cascade) | ![pg-mid](https://files.catbox.moe/f30ns7.png) |
| End (tout visible) | ![pg-end](https://files.catbox.moe/t9f179.png) |

**Quand utiliser** : présentation d'un leader africain avec son pays + date clé. Hook, intro épisode, carte de présentation d'un acteur.
**Cas validé** : Kwame Nkrumah / GHANA / 1957

---

### Layout — SpeechBubble (citation orale animée — portrait + bulle)

**Path code** : `src/projects/_shared/components/layouts/SpeechBubble.tsx`
**Composition Remotion** : `Layout-SpeechBubble` (90 frames, 30fps)
**Status** : ✅ CODÉ 2026-05-13 — nécessite image portrait (`portraitSrc`)
**Built with** : Tailwind CSS 3 + positions absolues

**Props principales** :
- `quoteLines` : `Array<{ text: string; highlight: boolean }>` — highlight=true → gold bold
- `speaker` : nom du locuteur
- `speakerDetail` : lieu, date (ex: "Ouagadougou, 1984")
- `portraitSrc` : chemin `staticFile()` vers portrait
- `startFrame` : frame de départ

**Quand utiliser** : citation orale d'un leader, discours historique, format TikTok natif.
**Cas validé** : Thomas Sankara — "L'impérialisme est un système... SYSTÈME."

---

### Layout — ArchiveFade (photo archive + annotations SVG dynamiques)

**Path code** : `src/projects/_shared/components/layouts/ArchiveFade.tsx`
**Composition Remotion** : `Layout-ArchiveFade` (120 frames, 30fps)
**Status** : ✅ CODÉ 2026-05-13 — nécessite image archive (`imageSrc`)
**Built with** : Tailwind CSS 3 + SVG `strokeDashoffset` + CSS filter grayscale→color

**Props principales** :
- `imageSrc` : `staticFile()` vers photo historique
- `annotations` : `Array<{ id, text, anchorX, anchorY, labelX, labelY, appearAtFrame }>`
- `stampLabel` / `stampDate` : tampon style archives bas-gauche
- `colorizeAtFrame` : frame de colorisation (-1 = rester B&W)
- `startFrame` : frame de départ

**Quand utiliser** : contextualiser une photo historique avec annotations analytiques. Conférence de Berlin, traités coloniaux, photos de dirigeants.

---

### Layout — MilitaryMarchLine (ligne de marche sur carte statique)

**Path code** : `src/projects/_shared/components/layouts/MilitaryMarchLine.tsx`
**Composition Remotion** : `Layout-MilitaryMarchLine` (150 frames, 30fps)
**Status** : ✅ CODÉ 2026-05-13 — nécessite image carte (`mapImageSrc`)
**Built with** : Tailwind CSS 3 + SVG polyline `strokeDashoffset` + icône mobile interpolé

**Props principales** :
- `title` / `date` / `stat` : panel bas navy
- `mapImageSrc` : `staticFile()` vers carte PNG/JPG sépia
- `waypoints` : `Array<{ id, label, x, y, state, style: "filled"|"empty"|"ripple" }>`
- `pathPoints` : `Array<{ x, y }>` normalisé 0-1 — chemin de l'icône mobile
- `iconEmoji` : emoji ou texte icône mobile
- `totalPathLength?` : défaut 2200

**Quand utiliser** : campagnes militaires historiques, routes commerciales, itinéraires géographiques. Atlas épisodes.
**Cas validé** : Hannibal 218 AV. J.-C. — 37 éléphants de guerre.

---

### Layout — FillScreen (remplissage liquide + stat centrale — révélation choc)

**Path code** : `src/projects/_shared/components/layouts/FillScreen.tsx`
**Composition Remotion** : `Layout-FillScreen` (90 frames, 30fps)
**Status** : ✅ VALIDÉ v3 2026-05-13
**Built with** : Tailwind CSS 3 + SVG wave + spring fill

**Props principales** :
- `fillPercent` : pourcentage cible (ex: 60)
- `centralValue` : valeur affichée en grand (ex: "60%")
- `topLabel` : label au-dessus (Cinzel, uppercase)
- `bottomLabel` : label en dessous (Nunito Sans)
- `fillColor` : couleur hexa de la zone remplie (ex: "#8B3A2A")
- `startFrame?` / `durationFrames?`

**Architecture** :
- Fond = `fillColor`. Div navy-deep descend du haut et couvre la zone non-remplie.
- Frontière = vague SVG path `M0,60 C180,0 360,120 540,60 ...`
- 3 textes groupés `flex flex-col items-center justify-center gap-8` — centrés verticalement

| Phase | Preview |
|---|---|
| Mid (60% rempli, vague visible) | ![fillscreen-mid](https://litter.catbox.moe/38ipz8.png) |

**Quand utiliser** : stat en pourcentage avec impact visuel fort (terres vendues, ressources extraites, population touchée). Typique beat révélation Souverain.

---

### Layout — OdometerFlip (compteur slot machine — chiffres qui défilent + rebond élastique)

**Path code** : `src/projects/_shared/components/layouts/OdometerFlip.tsx`
**Composition Remotion** : `Layout-OdometerFlip` (150 frames, 30fps)
**Status** : ✅ VALIDÉ v4-slot 2026-05-13
**Built with** : Tailwind CSS 3 + rouleau vertical translateY + spring overshoot

**Props principales** :
- `toValue` : valeur cible (string de chiffres, ex: "1984")
- `label?` : label décoratif au-dessus (ex: "ANNÉE")
- `subtitle?` : texte sous le séparateur or (ex: "de la Conférence de Berlin")
- `spinStartFrame?` : défaut 20
- `spinStagger?` : décalage entre cases (défaut 12f)
- `spinDuration?` : durée phase rapide par case (défaut 30f)

**Mécanique** :
- Chaque case = rouleau de 10 chiffres (0-9) qui défile rapidement (×2 tours) puis ralentit
- Phase rapide : `interpolate` linéaire → phase spring : `damping:18, stiffness:140` overshoot
- Gradients haut/bas sur chaque case pour effet de profondeur
- Ligne or horizontale centrée (séparateur mécanique)
- Stagger gauche→droite : les dernières cases s'arrêtent après les premières

| Phase | Preview |
|---|---|
| Final (1984 affiché) | ![odometer-mid](https://litter.catbox.moe/6289vc.png) |

**Quand utiliser** : année clé, date historique, chiffre record à révéler avec tension. Ne fonctionne qu'avec des chiffres (0-9). Caractères non-numériques s'affichent statiques.

---

### Layout — RadarPing (radar géopolitique — anneaux pulsants + stats orbitales)

**Path code** : `src/projects/_shared/components/layouts/RadarPing.tsx`
**Composition Remotion** : `Layout-RadarPing` (150 frames, 30fps)
**Status** : ✅ VALIDÉ v3 2026-05-13
**Built with** : Tailwind CSS 3 + SVG anneaux + spring stats + vignette radiale

**Props principales** :
- `title?` : titre en haut (Cinzel, défaut "RESSOURCES AFRICAINES")
- `stats?` : `Array<{ value, label, angle, revealDelay, ringRadius? }>`
- `startFrame?` / `durationFrames?`

**Architecture** :
- Fond `#060a10` + dot grid CSS (`radial-gradient 1px or 8% / 32px`)
- 3 anneaux persistants SVG : r=250 (or 70%), r=400 (slate 35%), r=520 (slate 18%)
- 2 ping rings animés en expansion (maxR=420, period=90f, stagger 20f)
- Dot central pulsant : r=12 solide + r=30 halo pulsant + r=60 outer halo
- Stats positionnées par angle+rayon (trigonométrie) — apparaissent en spring
- Tirets dorés directionnels vers le centre (gauche si angle>180, droite sinon)
- Vignette radiale : `radial-gradient transparent 30% → #060a10 90%`

| Phase | Preview |
|---|---|
| Mid (stats révélées, ping actif) | ![radarpng-mid](https://litter.catbox.moe/aedy8k.png) |

**Quand utiliser** : données géopolitiques multi-stats autour d'un centre (ressources extraites + nombre de pays, flux financiers + acteurs). Fort impact visuel, adapté beat choc Souverain.

---

### Layout — BarRace (course de barres horizontales — classement animé)

**Path code** : `src/projects/_shared/components/layouts/BarRace.tsx`
**Composition Remotion** : `Layout-BarRace` (180 frames, 30fps)
**Status** : ✅ VALIDÉ Aziz 2026-05-13
**Built with** : Tailwind CSS flex + spring Remotion. Fond navy `#0d1420` + dots dorés 42%.
**Props principales** :
- `title` : titre Cinzel doré en haut
- `data` : `Array<{ label, value, suffix }>` — ex: `[{ label: "Nigeria", value: 340, suffix: "Md" }]`
- `maxValue` : valeur max (dicte la barre à 100%)
- `subtitle` : footer bas

**Architecture** :
- Label pays dans bloc crème `#f5efe0` arrondi gauche (200px), barre dorée collée à droite, valeur monospace blanc
- Barres animées via spring staggeré (12f/barre), countUp 45f
- Layout `flex-col h-full` Tailwind : titre haut → barres `flex-1 justify-evenly` → footer bas

| Phase | Preview |
|---|---|
| Mid (barres en cours d'animation) | ![barrace-mid](https://litter.catbox.moe/pu3vvf.png) |
| End (layout complet + footer visible) | ![barrace-end](https://litter.catbox.moe/c98bg6.png) |

**Quand utiliser** : tout beat classement pays par valeur économique (PIB, production, exportation). Stagger animé = lecture progressive = suspense naturel.

---

### Layout — PulseNumber (chiffre géant pulsant — stat choc centrale)

**Path code** : `src/projects/_shared/components/layouts/PulseNumber.tsx`
**Composition Remotion** : `Layout-PulseNumber` (150 frames, 30fps)
**Status** : ✅ VALIDÉ Aziz 2026-05-13
**Built with** : SVG rings + CSS halo blur + spring entry. Fond `#0C121A` + dots blancs 7%.
**Props principales** :
- `topLabel` : label haut en doré désaturé (ex: "MILLIARDS EXTRAITS")
- `value` : chiffre/stat central (ex: "$2.3T") — IBM Plex Mono 340px
- `subtitle` : sous-titre bas (ex: "depuis 1960")

**Architecture** :
- Heartbeat : `Math.sin((frame/45)*PI*2)` → scale 1.0–1.04 + haloOpacity 0.4–0.9
- 3 anneaux SVG expansifs staggerés (period 120f, stagger 40f, fade out en fin de course)
- Halo : div dupliqué avec `filter: blur(60px)` derrière le texte principal
- Entry spring(damping:12, stiffness:90, startFrame:5)

| Phase | Preview |
|---|---|
| Mid (chiffre + rings + glow) | ![pulsenumber-mid](https://litter.catbox.moe/mbbinb.png) |

**Quand utiliser** : stat unique massive, chiffre-clé qui nécessite d'être gravé dans la mémoire (montant volé, population, dette).

---

### Layout — TypeReveal (typing effect — phrase révélée lettre par lettre)

**Path code** : `src/projects/_shared/components/layouts/TypeReveal.tsx`
**Composition Remotion** : `Layout-TypeReveal` (150 frames, 30fps)
**Status** : ✅ VALIDÉ Aziz 2026-05-13
**Built with** : flex-row inline + spring scale sur mot-clé. Fond `#050A10` radial-gradient.
**Props principales** :
- `textBefore` : texte normal avant le mot-clé (ex: "En 1885, l'Afrique fut ")
- `keyword` : mot-clé géant doré (ex: "DIVISÉE") — Cinzel 210px + glow
- `textAfter` : texte normal après (ex: " entre 14 puissances.")
- `subtitle` : annotation bas (ex: "Conférence de Berlin, 1885")
- `typeSpeed` : frames par caractère (défaut: 2)

**Architecture** :
- Typing : `Math.floor(frame / typeSpeed)` chars révélés, découpés sur textBefore→keyword→textAfter
- flex-row `alignItems: baseline` pour aligner textes 82px + mot-clé 210px sur la même baseline
- Mot-clé : spring scale 0.3→1 au premier caractère (effet pop)
- Curseur clignotant : `Math.floor(frame/15)%2` → opacité 0/1

| Phase | Preview |
|---|---|
| Mid (phrase en cours de frappe, DIVISÉE visible) | ![typereveal-mid](https://litter.catbox.moe/sw2mtl.png) |

**Quand utiliser** : citation historique, phrase-choc, constat factuel dévastateur. Le typing crée une tension naturelle. Idéal pour hook ou climax narratif.

---

### Layout — StackedBars (barres verticales comparatives — podium de données)

**Path code** : `src/projects/_shared/components/layouts/StackedBars.tsx`
**Composition Remotion** : `Layout-StackedBars` (150 frames, 30fps)
**Status** : ✅ VALIDÉ Aziz 2026-05-13
**Built with** : positions absolues + spring staggeré. Fond `#0d1420` radial glow doré.
**Props principales** :
- `bars` : `Array<{ id, label, value, displayValue }>` — max 4 barres
- `revealLabelsFrame` : frame de révélation des labels (défaut: 90)
- `title` : titre monospace haut
- `subtitle` : footer bas monospace

**Architecture** :
- 4 barres positionnées absolument à `xPositions:[140,360,580,800]`, ancrées bottom y=1560
- Hauteur : `interpolate(spring, [0,1], [0, 1100*(value/maxValue)])` — croissance du bas vers le haut
- Gradient "tube 3D" : `linear-gradient(to bottom, #FFE895 2%, #9B762A 15%, #9B762A 85%, #FFE895 98%)`
- Labels : blocs gris flous avant frame revealLabelsFrame → labels monospace blancs révélés avec spring
- Stagger : 12f par barre

| Phase | Preview |
|---|---|
| Mid (barres poussées, valeurs visibles) | ![stackedbars-mid](https://litter.catbox.moe/rpd1pz.png) |
| End (labels OR/CUIVRE/DIAMANT/COBALT + footer) | ![stackedbars-end](https://litter.catbox.moe/d7p3b0.png) |

**Quand utiliser** : comparaison 2–4 ressources/secteurs verticaux. Excellent pour "podium" de richesses naturelles, ranking secteurs. Le mystery reveal des labels crée un mini suspense.

---

### Layout — ScaleShock (deux cercles proportionnels — choc d'échelle visuel)

**Path code** : `src/projects/_shared/components/layouts/ScaleShock.tsx`
**Composition Remotion** : `Layout-ScaleShock` (150 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-13
**Built with** : Tailwind CSS 3 + spring Remotion + overflow visible (cercle déborde intentionnellement)
**Mockup source** : `public/_shared/previews/mockups-gemini/Layout-ScaleShock-mockup-gemini.png`

**Props principales** :
- `topLabel?` : titre haut (défaut: "SUPERFICIE COMPARÉE")
- `labelLeft?` / `labelLeftSub?` : entité gauche (défaut: "Belgique" / "30 528 km²")
- `labelRight?` / `labelRightSub?` : entité droite (défaut: "Afrique" / "30 370 000 km²")
- `subtitle?` : footer (défaut: "superficie comparée")
- `ratioScale?` : ratio surface droite/gauche — la taille est `Math.sqrt(ratio)` (défaut: 30)

**Animation** :
- Entrée : titre + petit cercle slide depuis le haut (spring `damping 18, stiffness 80`)
- Croissance grand cercle : démarre frame 20, spring `damping 14, mass 1.2` → taille finale cappée à 480px diamètre
- Glow : suit la croissance (radius 8→60px, opacity 0.3→0.7)
- Labels : fade-in après frame 30 avec translateY

**Layout** : zone gauche 35% (petit cercle + label) / zone droite 65% (grand cercle + label) — flex column centré dans chaque zone. Séparateur vertical or entre les deux. Lignes horizontales animées (scaleX/scaleY spring).

| Phase | Preview |
|---|---|
| Mid (grand cercle en croissance) | ![scaleshock-mid](https://files.catbox.moe/x7lzv9.png) |
| End (taille finale + glow + labels) | ![scaleshock-end](https://files.catbox.moe/13y60n.png) |

**Quand utiliser** : choc visuel de proportion (superficie pays vs continent, PIB, population). L'animation de croissance crée un effet "wow" sur mobile. Fonctionne avec tout ratio ≥ 4.

---

### Layout — Timeline (chronologie animée — noeuds séquentiels sur ligne verticale)

**Path code** : `src/projects/_shared/components/layouts/Timeline.tsx`
**Composition Remotion** : `Layout-Timeline` (180 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-13
**Built with** : Tailwind CSS 3 + spring Remotion séquencé par noeud
**Mockup source** : `public/_shared/previews/mockups-gemini/Layout-Timeline-mockup-gemini.png`

**Props principales** :
- `topLabel?` : titre haut (défaut: "CHRONOLOGIE")
- `events?` : `TimelineEvent[]` — tableau `{ year, title, desc }` (défaut: 4 événements Mali médiéval)
- `activeIndex?` : index du noeud "actif" — plus grand, glow doré (défaut: 1)
- `subtitle?` : footer (défaut: "explorer l'histoire")

**Animation** :
- Titre : slide depuis le haut (spring frame 0)
- Ligne verticale : draw-in top→bottom (spring frame 10)
- Noeuds : révélation séquentielle, délai `15 + i * 18` frames — slide depuis la gauche
- Noeud actif : dot rempli or + glow pulsant + année et titre plus grands
- Noeuds passés/futurs : dot outline seul, taille réduite

**Layout** : ligne verticale à 42% du width. Années à gauche de la ligne (alignées à droite). Dot centré sur la ligne. Titre + description à droite. 4 noeuds répartis uniformément sur ~1200px de hauteur.

| Phase | Preview |
|---|---|
| Mid (2 premiers noeuds révélés, ligne en cours) | ![timeline-mid](https://files.catbox.moe/nzfnto.png) |
| End (4 noeuds visibles, noeud actif glowing) | ![timeline-end](https://files.catbox.moe/8b2s7h.png) |

**Quand utiliser** : tout épisode avec une progression temporelle — empires, règnes, conflits, évolution économique. Remplace les listes statiques. Fonctionne avec 3 à 5 événements.

---

### Layout — NetworkGraph (réseau de connexions animé — noeuds + arcs + icônes)

**Path code** : `src/projects/_shared/components/layouts/NetworkGraph.tsx`
**Composition Remotion** : `Layout-NetworkGraph` (210 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-13
**Built with** : SVG (arcs + pulse dots) + Lucide React (icônes) + Tailwind + springs séquencés
**Mockup source** : `public/_shared/previews/mockups-gemini/Layout-NetworkGraph-mockup-gemini.png`

**Props principales** :
- `centralLabel?` : titre (supporte `\n` pour saut de ligne, défaut: "EMPIRE\nCONNECTIONS")
- `centralIcon?` : icône Lucide du noeud central (défaut: "crown")
- `nodes?` : `SatelliteNode[]` — tableau `{ cx, cy, label, icon, edgeLabel?, lineWeight? }`
- `subtitle?` : footer (défaut: "réseau de pouvoir")

**Icônes disponibles** : `crown | pickaxe | bank | flag | ship | factory | zap | globe | diamond | wheat | fuel | building | boxes | network`

**lineWeight** : `"thin"` (2px) / `"medium"` (3.5px) / `"thick"` (5.5px) — suggère l'intensité de la connexion

**Animation** :
- Titre : slide depuis le haut (frame 0)
- Noeud central : scale-in (frame 5)
- Arcs : draw-in séquentiel, délai `18 + i*12` frames par noeud
- Noeuds satellites : pop-in après l'arc correspondant
- Pulse dots : mouvement continu centre → satellite (cycle 60 frames)
- Edge labels : fade-in à 60% de progression de l'arc

**Layout** : 1 noeud central (r=105) + jusqu'à 6 satellites (r=68). Coordonnées en pixels absolus sur canvas 1080×1920. Labels au-dessus des noeuds hauts, en-dessous des noeuds bas.

| Phase | Preview |
|---|---|
| Mid (3 noeuds révélés, arcs en cours) | ![ng-mid](https://files.catbox.moe/23cv5q.png) |
| End (6 noeuds + arcs complets + pulse dots) | ![ng-end](https://files.catbox.moe/2ogno5.png) |

**Quand utiliser** : révélation de connexions cachées (qui finance qui, qui contrôle quoi), structure d'un empire économique, carte d'influence géopolitique. Visuel "tableau de conspiration" cinématique.

---

### Layout — IconGrid (grille icônes + stats — données visuelles multi-entrées)

**Path code** : `src/projects/_shared/components/layouts/IconGrid.tsx`
**Composition Remotion** : `Layout-IconGrid` (150 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-13
**Mockup source** : `public/_shared/previews/mockups-gemini/Layout-IconGrid-mockup-gemini.png`

**Props** : `title?` (1-2 mots Cinzel) · `items?: GridItem[]` (`{ icon, stat, label }`) · `cols?: 2` · `subtitle?`
**Icônes** : 20 disponibles — `pickaxe | bank | factory | ship | flag | diamond | zap | globe | wheat | fuel | building | crown | boxes | network | cpu | water | leaf | sun | wind | mountain`
**Animation** : titre slide haut → cartes pop-in séquentiel (délai `12 + i*10` frames)
**Règle** : stat = max 6 chars (`"8.2M"`, `"65%"`). Label = 1 mot majuscule.

| Phase | Preview |
|---|---|
| Mid (cartes 1-3 visibles) | ![ig-mid](https://files.catbox.moe/atdxsm.png) |
| End (grille 2×3 complète) | ![ig-end](https://files.catbox.moe/scbynu.png) |

**Quand utiliser** : 4-6 ressources/secteurs à présenter simultanément. "Les 6 richesses du pays", "4 indicateurs économiques". Maximal visuellement, zéro phrase.

---

### Layout — IconStat (icône géante + chiffre central — stat choc visuelle)

**Path code** : `src/projects/_shared/components/layouts/IconStat.tsx`
**Composition Remotion** : `Layout-IconStat` (150 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-13
**Mockup source** : `public/_shared/previews/mockups-gemini/Layout-IconStat-mockup-gemini.png`

**Props** : `topLabel?` (1 mot) · `icon?: StatIcon` · `stat?` (chiffre brut) · `contextLabel?` (1 mot) · `subtitle?` (2 mots)
**Icônes** : 20 disponibles — `smartphone | diamond | coins | zap | globe | pickaxe | bank | factory | ship | flag | wheat | fuel | building | crown | trending | users | dollar | chart | wifi | battery`
**Animation** : topLabel slide → icône scale-in avec glow pulsant → stat scale-in → contextLabel fade
**Différence vs PulseNumber** : l'icône IS le message. Le chiffre complète. PulseNumber = chiffre seul.

| Phase | Preview |
|---|---|
| Mid (icône visible, stat en cours) | ![is-mid](https://files.catbox.moe/sqfnrv.png) |
| End (icône + stat + contexte complets) | ![is-end](https://files.catbox.moe/6kbfgs.png) |

**Quand utiliser** : 1 stat pilier qui a besoin d'un visuel immédiat — "67% ADOPTION" avec icône smartphone, "90% EXPORT" avec icône ship.

---

### Layout — ProcessFlow (flux de processus vertical — étapes + flèches + icônes)

**Path code** : `src/projects/_shared/components/layouts/ProcessFlow.tsx`
**Composition Remotion** : `Layout-ProcessFlow` (150 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-13
**Mockup source** : `public/_shared/previews/mockups-gemini/Layout-ProcessFlow-mockup-gemini.png`

**Props** : `title?` (1 mot) · `steps?: FlowStep[]` (`{ icon, label, edgeLabel?, isActive? }`) · `subtitle?`
**FlowStep** : `icon` (même set que ProcessFlow) · `label` (1-2 mots) · `edgeLabel?` (chiffre sur la flèche) · `isActive?` (glow + taille +)
**Animation** : étapes pop-in séquentiel, connecteurs draw-in entre chaque étape, edge labels fade après 60% de progression

| Phase | Preview |
|---|---|
| Mid (2 étapes + connecteurs) | ![pf-mid](https://files.catbox.moe/nk6wan.png) |
| End (4 étapes + "$4.2B" edge label) | ![pf-end](https://files.catbox.moe/55xdqz.png) |

**Quand utiliser** : "Mine → Broker → London → Marché", "Dépôt → Virement → Agent → Retrait M-Pesa". 3-4 étapes max. 1 étape `isActive` pour indiquer où on en est.

---

### Layout — CoinFlip (pièce 3D qui tourne — révèle deux faces avec icône + stat)

**Path code** : `src/projects/_shared/components/layouts/CoinFlip.tsx`
**Composition Remotion** : `Layout-CoinFlip` (210 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-14 (v2 — diff Gemini appliqué)
**FINAL** : `out/templates-souverain/FINAL-CoinFlip.mp4`

**Props** : `faceA?: FaceContent` · `faceB?: FaceContent` · `subtitle?`
**FaceContent** : `{ icon: CoinIcon, label: string, value: string }`
**CoinIcon** : `"crown" | "globe" | "diamond" | "zap" | "flag" | "building" | "wheat" | "ship" | "pickaxe" | "landmark" | "trending" | "users"`
**Defaults** : faceA `{ icon:"crown", label:"EMPIRE", value:"1235" }` · faceB `{ icon:"globe", label:"ÉTENDUE", value:"2M KM²" }` · subtitle `"MALI · MANSA MOUSSA"`

**Mécanique** : pièce 680px diamètre, perspective 1200px, rotateX(15deg) permanent. Face A (frames 15-75) → flip rotateY 0→180° (frames 75-135) → Face B (135-195). Wobble ±1.5° continu. `backfaceVisibility: hidden` sur chaque face. Bordure or + glow + anneau décoratif intérieur.

| Phase | Preview |
|---|---|
| Face A (icône Crown + "1235") | ![coinflip-mid](https://files.catbox.moe/vlyrt7.png) |
| Face B (icône Globe + "2M KM²") | ![coinflip-end](https://files.catbox.moe/ggpzu4.png) |

**Quand utiliser** : révéler deux faces d'un même sujet (ressources vs défis, avant vs après, mythes vs réalité). Idéal pour intro dramatique.

---

### Layout — GlitchReveal (stat corrompue → stabilisation → révélation nette — style CRT)

**Path code** : `src/projects/_shared/components/layouts/GlitchReveal.tsx`
**Composition Remotion** : `Layout-GlitchReveal` (210 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-14 (v2 — diff Gemini appliqué)
**FINAL** : `out/templates-souverain/FINAL-GlitchReveal.mp4`

**Props** : `topLabel?` · `mainStat?` · `contextLabel?` · `icon?: GlitchIcon` · `subtitle?`
**GlitchIcon** : `"zap" | "diamond" | "trending" | "users" | "flag" | "crown" | "globe" | "shield"`
**Defaults** : topLabel `"RESSOURCES"` · mainStat `"$40B"` · contextLabel `"EXTRACTION"` · icon `"diamond"` · subtitle `"AFRIQUE · 2024"`

**Mécanique** : Phase glitch (frames 8-60) — stat affiche valeurs aléatoires déterministes (`???`, `ERR`, `###`), label = caractères corrompus, blocs cyan/magenta parsèment l'écran, scanline défile. Phase stabilisation (60-90). Phase reveal (90-210) — stat propre + glow doré intense + icône 240px spring pop-in. Tout déterministe via `Math.sin(frame * 9.1 + slot * 7.3)`.

| Phase | Preview |
|---|---|
| Glitch (blocs corrompus + scanline) | ![glitch-mid](https://files.catbox.moe/1zuizb.png) |
| Reveal (stat nette + icône + glow) | ![glitch-end](https://files.catbox.moe/owqxic.png) |

**Quand utiliser** : révéler une stat choc après tension (chiffres cachés, données supprimées, vérité vs propagande). Fort pour intro ou climax.

---

### Layout — SplitFlap (tableau d'aéroport — lettres qui roulent puis se fixent)

**Path code** : `src/projects/_shared/components/layouts/SplitFlap.tsx`
**Composition Remotion** : `Layout-SplitFlap` (210 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-14 (v2 — diff Gemini appliqué)
**FINAL** : `out/templates-souverain/FINAL-SplitFlap.mp4`

**Props** : `header?` · `lines?: SplitFlapLine[]` · `footer?`
**SplitFlapLine** : `{ text: string, startFrame: number, size?: "normal" | "large" | "xlarge" }`
**Defaults** : header `"CHRONOLOGIE"` · lines `[{text:"MALI",startFrame:20,size:"large"},{text:"1324",startFrame:60,size:"xlarge"},{text:"AP JC",startFrame:100}]` · footer `"EMPIRE MEDIEVAL"`

**Mécanique** : Cellules rectangulaires dark (`#0a1628`, bordure or, borderRadius 10px) avec ligne horizontale split au milieu. Rolling : caractère ALPHA défile (`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`) → se fixe sur target après `startFrame + 20` frames. Séquentiel gauche-droite par ligne, ligne 1 → 2 → 3. Couleur rolling = or, fixé = ivoire. Hiérarchie 3 tailles avec séparateur gold entre ligne 1 et 2.

| Phase | Preview |
|---|---|
| Rolling en cours (ligne 1 fixée, ligne 2 en cours) | ![splitflap-mid](https://files.catbox.moe/5f92m4.png) |
| Toutes cellules fixées — MALI / 1324 / AP JC | ![splitflap-end](https://files.catbox.moe/ywyt0o.png) |

**Quand utiliser** : révéler une date, un nom de lieu, une statistique clé avec tension progressive. Style nostalgique aéroport. Très satisfaisant à regarder.

---

### Layout — TimelineFracture (ligne de temps brisée — éclats + icône émerge de la fracture)

**Path code** : `src/projects/_shared/components/layouts/TimelineFracture.tsx`
**Composition Remotion** : `Layout-TimelineFracture` (210 frames, 30fps)
**Status** : ✅ VALIDÉ 2026-05-14 (v2 — diff Gemini appliqué)
**FINAL** : `out/templates-souverain/FINAL-TimelineFracture.mp4`

**Props** : `dateLabel?` · `eventLabel?` · `icon?: FractureIcon` · `subtitle?`
**FractureIcon** : `"zap" | "crown" | "flag" | "diamond" | "building" | "ship" | "users" | "flame"`
**Defaults** : dateLabel `"1235"` · eventLabel `"FONDATION"` · icon `"crown"` · subtitle `"EMPIRE MALI"`

**Mécanique** : Ligne dorée draw-in (frames 0-30). Fracture au centre cx=540, cy=960 (frames 50-75) — ligne se brise en 2 segments, 8 éclats triangulaires (or/ivoire/orange #e8874a) jaillissent, glow orange-ambré au point de fracture. Icône Lucide émerge (spring, frames 60-120). État final : bloc info au-dessus de la ligne ("1235" 80px Cinzel + "FONDATION" 44px ivoire), labels "AVANT"/"APRÈS" aux extrémités. Shards `maxDist = 80+i*20`, taille `14+i%3*8`.

| Phase | Preview |
|---|---|
| Explosion (éclats + glow orange) | ![fracture-mid](https://files.catbox.moe/2fndc6.png) |
| État final (ligne brisée + Crown + bloc info) | ![fracture-end](https://files.catbox.moe/5cr96a.png) |

**Quand utiliser** : marquer un tournant historique dramatique, une rupture de civilisation, un avant/après. Très narratif.

---

### Layout — DualStat (comparaison deux entités avec stats — RÉUTILISABLE)

**Path code** : `src/projects/_shared/components/layouts/DualStat.tsx`
**Status** : ✅ VALIDÉ Beat 6 Zimbabwe Lithium (2026-05-13)
**Built with** : Tailwind CSS 3 + positions absolues (zéro flexbox pour le layout split)
**Props principales** :
- `title` : question/titre affiché en haut (Cinzel or)
- `subtitle?` : footer discret (ex: "Zimbabwe · Lithium · 2023")
- `entityA` / `entityB` : `{ entity, stat, label, startFrame, side: "left"|"right" }`
- `dividerStartFrame?` : frame de départ du diviseur vertical (défaut: 30)

**Architecture** :
```
AbsoluteFill → titre (top:160) + zone split (top:460, height:1000) + footer (bottom:100)
Zone split : diviseur absolu centré + 2 StatCards absolues (top:50%, translateY:-50%)
```
- Chaque StatCard slide depuis son côté (left: -200px / right: +200px) sur `startFrame`
- Diviseur vertical or : draw top→bottom via spring animé
- Séquencement audio-driven : entityA révélée en premier, entityB en second

**Quand utiliser** : tout beat avec comparaison deux pays/entités + stat chiffrée centrale (pop, PIB, surface, etc.)
**Cas validé** : Zimbabwe 16M vs Chine 1.4Md habitants — Beat 6 question.

---

### Layout — QuoteImpact (question/citation plein écran — RÉUTILISABLE)

**Path code** : `src/projects/_shared/components/layouts/QuoteImpact.tsx`
**Status** : ✅ VALIDÉ Beat 6 Zimbabwe Lithium (2026-05-13)
**Built with** : Tailwind CSS 3 + fond dégradé radial navy
**Props principales** :
- `question` : texte principal (Cinzel 175px ivory, uppercase, occupe ~65% largeur)
- `subtitle?` : footer discret sous la réglette or
- `startFrame` : frame de départ du fade-in + scale spring

**Architecture** :
```
AbsoluteFill (bg-navy-deep) + radial-gradient → AbsoluteFill animée (opacity+scale)
Guillemets décoratifs " " (480px, opacity 16%) → texte centré → réglette or → sous-titre
Zone karaoke réservée : 200px en bas (sous-titres TikTok)
```
- Fond noir profond avec halo navy central (pas de noir pur plat)
- Transition depuis DualStat via `zIndex: 10`

**Quand utiliser** : freeze final / punchline / question rhétorique plein écran. Idéal pour la dernière scène d'un épisode Souverain.
**Cas validé** : "Qui a vraiment gagné ?" — Beat 6 Zimbabwe Lithium.

---

### Layout — DataRevealSouverain (comparaison 2 valeurs — Data-Driven Motion Design)

**Path code** : `src/projects/_shared/components/layouts/DataRevealSouverain.tsx`
**Status** : ✅ VALIDÉ Beat4Prix Silicon Savannah M-PESA (2026-05-15)
**Fiche technique** : `memory/rules/rules-data-driven-motion-design.md` (8 techniques T1-T8)
**Props principales** :
- `pivotAsset` : image centrale flottante (ping ring + glow gold)
- `leftBar` / `rightBar` : `DataBar { label, value, barFillRatio, color, appearFrame, ... }`
- `verdictText` / `verdictFrame` : conclusion rouge avec glow pulsant
- `title`, `subtitles`, `narrationAsset`, `musicAsset`, `backgroundAsset`, `sourceText`

**Cas d'usage** : frais bancaires, taux d'intérêt, prix ressources, accès services, salaires comparatifs
**Règle barFillRatio** : valeur de référence = 1.0, autre = ratio_réel (mathématiquement correct, jamais estimé)

---

### Layout — SplitScreenSouverain (split 50/50 générique — PRIORITÉ)

**Path code** : `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx`
**Status** : ✅ VALIDÉ Beat 5 Zimbabwe Lithium (2026-05-13)
**Built with** : Tailwind CSS 3 + flex layout (zéro calcul manuel de coordonnées)
**Props principales** :
- `left` / `right` : `SplitColumnProps { asset: React.ReactNode, assetStartAt, items: SplitItem[], px }`
- `SplitItem` : `{ text, startAt, fontSize, color, font: "bebas"|"mono", separator }`
- `subtitle`, `subtitleStartAt`, `showDivider`

**Architecture** :
```
pt-[288px] (safe zone) + asset flex-shrink-0 (pleine largeur colonne) + flex-1 justify-around (textes)
```
- Colonne gauche : slide depuis left. Colonne droite : slide depuis right.
- Séparateur or vertical animé (strokeDasharray pulsant)
- Sous-titres réservés via `pb-[200px]` + position absolute bottom: 60
- Asset ratio contrôle la hauteur visuelle (MAP_RATIO, aspectRatio CSS)

**Quand utiliser** : tout beat Souverain avec carte pays vs drapeau/logo, stat vs illustration, deux entités en tension.
**Cas validé** : Zimbabwe MAP (SVG d3-geo) vs drapeau Chine PNG (fond transparent ffmpeg colorkey).

---

### Template Insert — SplitScreen (mise en tension visuelle)

**Path code** : `src/projects/_shared/components/inserts/SplitScreen.tsx`
**Démo** : `Insert-SplitScreenDemo`
**Status** : ✅ KEEP (validé Jour 4)
**Layouts** : `stacked` (vertical 50/50), `split` (horizontal 50/50), `reveal` (panneau droit caché révélé à `revealFrame`)
**Props** : `leftPanel`, `rightPanel`, `layout`, `separatorColor`, `separatorSize`, `revealFrame`
**Cas d'usage** : terrain vs portrait, illustration vs photo, storyboard vs leader

---

### Template Insert — EntityDiagram V2 (dossier d'enquête Souverain)

**Path code** : `src/projects/_shared/components/inserts/EntityDiagram.tsx`
**Démo** : `Insert-EntityDiagramDemo` (Niger uranium : Orano / SOMAIR / État Niger)
**Catbox** : https://files.catbox.moe/s6ptze.mp4
**Status** : ✅ KEEP (validé Jour 5)
**Différenciation NYT VI** : tampon "DOSSIER N°XXX", grain papier, edges typés (direct/suspecté/déclaré), annotations OSINT mono, halo dashed pour pivot
**Props clés** : `nodes`, `edges` (avec `kind: "direct"|"suspected"|"declared"`), `parentLabel`, `dossierNumber`, `dossierDate`, `title`, `subtitle`, `source`
**Backgrounds** : `noir` / `kraft` / `dossier` / `mat`
**Icons fournis** : `ShipIcon`, `FactoryIcon`, `CrownIcon`, `FlagIcon`, `BankIcon`, `PersonIcon`

---

### Template Insert — ComparisonTable V2 (comparaison générique multi-cas)

**Path code** : `src/projects/_shared/components/inserts/ComparisonTable.tsx`
**Démo** : `Insert-ComparisonTableDemo` (Niger uranium 1970 vs 2025)
**Catbox** : https://files.catbox.moe/vzpjpu.mp4
**Status** : ✅ KEEP (validé Jour 5)
**Différenciation PolyMatter** : générique (pays/entreprises/époques/acteurs), 4 backgrounds, verdict optionnel, source line, 3 styles soulignes
**Props clés** : `colA` / `colB` (avec `kind: "country"|"company"|"era"|"actor"|"custom"`), `rows`, `verdict`, `source`, `title`, `subtitle`, `underlineStyle: "slab"|"fine"|"dashed"`
**Backgrounds** : `accent` (rouge brique), `kraft` (papier), `dossier` (bleu nuit), `noir`
**Icons fournis** : `FighterIcon`, `TroopsIcon`, `SubmarineIcon`, `ShipIconFlat`, `TankIcon`, `UraniumIcon`, `MoneyIcon`, `PercentIcon`, `PeopleGroupIcon`

---

### Template Insert — GlobeLocationReveal V5 (hook ouverture Mapbox, 2 styles canoniques)

**Path code** : `src/projects/_shared/components/inserts/GlobeLocationReveal.tsx`

**Démos V5 (avec dot capitale + subInfo + marges 11%)** :
- `Insert-GlobeCountryRevealMapboxDemo` Niger Style 1 souverain — https://files.catbox.moe/rjv10e.mp4
- `Insert-GlobeMontrealDemo` Montréal Style 2 caspian — https://files.catbox.moe/m5tltq.mp4
- `Insert-GlobeToMercatorDemo` end-to-end globe→Mercator 14s — https://files.catbox.moe/agm5tc.mp4

**Status** : ✅ KEEP locked Jour 5

**Pattern** : Mapbox `projection: 'globe'` + atmosphère + réticule SVG positionné via `map.project([lon, lat])` + panel pays/ville + dot capitale dans silhouette + transition globe→Mercator native

**2 styles canoniques** (cf memory/feedback_globe-reveal-2-styles-locked.md) :
- `style="souverain"` — sombre étoilé, accent jaune `#f5d547`, panel bleu nuit. Pour révélations dramatiques.
- `style="caspian"` — lumineux papier, accent terracotta `#a05a3a`, panel crème. Pour révélations apaisées éditoriales.

**Props clés V5** : `targetCoord` (via MCP Mapbox), `countryIso?`, `primaryLabel`, `subInfo?` (donnée éditoriale courte), `secondaryLabel?` (rétrocompat), `countryPath?` + `countryBBox?` (silhouette), `capitalSvgCoord?` + `capitalLabel?` (dot capitale), `style`, `panelMode`, `cameraKeyframes?`

**Conventions cadrage** :
- Marges 11% (PANEL_X=120, PANEL_W=840)
- Sous-titres dynamiques **en haut** pendant scène globe
- `subInfo` ("SAHEL · 26.2M HAB.") préféré à `secondaryLabel` (capitale redondante si dot visible)

**Render** : OBLIGATOIRE via `./scripts/render-mapbox.sh <CompId> <out.mp4>` (WebGL, Chrome for Testing + --gl=angle)
**Mémoires dédiées** : memory/feedback_globe-mapbox-pattern-validated.md + memory/feedback_globe-reveal-2-styles-locked.md

---

### Template Insert — WealthScale (balance inégalité)

**Path code** : `src/projects/_shared/components/inserts/WealthScale.tsx`
**Démo** : `Insert-WealthScaleDemo` dans Root.tsx (90 frames, 1080x1920)
**Status** : ✅ Validé Aziz 2026-05-12 — prêt production

**Concept** : Balance d'apothicaire animée. Le plateau ressource/extraction descend (-28°), le plateau peuple remonte. Glow doré sur plateau lourd. Transition en 2 temps : équilibre → bascule.

**Assets requis** :
- `public/_shared/assets/templates-souverain/gold-nugget.png` — pépite organique lumineuse (plateau lourd)
- `public/_shared/assets/templates-souverain/people-icon.png` — silhouette famille ivoire (plateau léger)

**Props clés** : `resourceLabel`, `resourceValue`, `resourceSubtext`, `peopleLabel`, `peopleValue`, `punchline`

**Cas d'usage (non exhaustif)** :
- Ressources extraites vs revenus reversés (Niger uranium, Congo cobalt)
- Population africaine vs représentation internationale
- Budget colonial vs budget éducation
- Durée colonisation (années) vs durée indépendance
- Terres vendues vs terres cultivées localement

**Preview** : https://litter.catbox.moe/kv52gm.mp4 (72h)

---

### Template Insert — CrossSection (coupe géologique)

**Path code** : `src/projects/_shared/components/inserts/CrossSection.tsx`
**Démo** : `Insert-CrossSectionDemo` dans Root.tsx (90 frames, 1080x1920)
**Status** : ✅ Validé Aziz 2026-05-12 — prêt production

**Concept** : Bloc centré "core sample". Silhouette ville africaine en surface. Révélation staggerée des couches souterraines avec prix/valeurs. Overlay vitré à droite en end state. Masque clipPath descendant.

**Assets requis** :
- `public/_shared/assets/templates-souverain/city-silhouette.png` — horizon urbain africain avec minarets

**Props clés** : `countryLabel`, `layers[]` (name, color, price, unit), `punchline`

**Cas d'usage (non exhaustif)** :
- Sous-sol d'un pays (minerais, pétrole, gaz) vs vie en surface
- Économie informelle (dessous) vs PIB officiel (dessus)
- Histoire réelle (dessous) vs histoire enseignée (dessus)
- Richesse perçue vs dette réelle
- Stratigraphie temporelle : ce qui s'est passé en 1885, 1960, 2024

**Preview** : https://litter.catbox.moe/u4663n.mp4 (72h)

---

### Template Insert — TickerTapeHistory (bandeau téléscripteur historique)

**Path code** : `src/projects/_shared/components/inserts/TickerTapeHistory.tsx`
**Démo** : `Insert-TickerTapeHistoryDemo` dans Root.tsx (90 frames, 1080x1920)
**Status** : ✅ Validé Aziz 2026-05-12 — prêt production

**Concept** : Bandeau central imposant (280px). Texte historique Playfair Display italic défile → flash gold à f45 → commodités modernes Oswald doré. Dates encadrantes aux extrémités. Masque fondu bords.

**Assets requis** :
- `public/_shared/assets/templates-souverain/ticker-texture.png` — texture papier navy (15% opacity)

**Props clés** : `historicalText`, `historicalYear`, `modernYear`, `commodities[]` (name, price, trend), `speed?`

**Cas d'usage (non exhaustif)** :
- Archive coloniale 1884 → cours matière première aujourd'hui
- Discours indépendance 1960 → dette publique 2024
- Rapport colonial "sols fertiles" → prix cacao aujourd'hui
- Prix d'achat esclave 1750 → salaire minimum Afrique Ouest 2024
- Traité de Berlin → frontières actuelles

**Preview** : https://litter.catbox.moe/y0vqji.mp4 (72h)

---

### Template Insert — GoldVein (veine géologique animée sur carte)

**Path code** : `src/projects/_shared/components/inserts/GoldVein.tsx`
**Démo** : `Insert-GoldVeinDemo` dans Root.tsx (150 frames, 1080x1920)
**Status** : ✅ V3 livré 2026-05-12 — Equal Earth + 4 branches arborescentes + zoom progressif monde → sol

**Concept** : Carte Mapbox CartoCaspian Sepia. Ouverture Equal Earth (projection aplatie, vue monde), zoom progressif 1.8→5.5 en 3 keyframes. 4 branches dorées arborescentes depuis Arlit (stagger 8f), panel données slide-in à f110.

**Stack** : Mapbox GL JS (`projection: equalEarth` → mercator auto ~zoom 4) + `applyCartoCaspian SEPIA` + overlay SVG React AbsoluteFill + `spring()` / `interpolate()` Remotion

**Animation** :
- f0–30 : carte fade-in, vue monde Equal Earth (zoom 1.8)
- f30–55 : zoom vers continent (zoom 3.4, pitch 10°)
- f55–80 : zoom vers Niger gros plan (zoom 5.5, pitch 30°, bearing -8°)
- f50–90 : 4 branches arborescentes se tracent depuis Arlit (stagger 8f/branche)
- f80 : dot Arlit pulse sinus permanent
- f110–150 : panel données slide-in spring

**Props clés** : `countryIso`, `countryLabel`, `resourceName`, `resourceValue`, `resourceUnit`, `resourceSource`

**Cas d'usage** :
- Révéler le sous-sol d'un pays (uranium Niger, cobalt RDC, or Ghana, pétrole Angola)
- Contraste richesse souterraine vs surface appauvrie
- Toute ressource extractive avec données AIEA / World Bank

**Preview V3** : https://litter.catbox.moe/sy5viv.mp4 (72h)

---

### Template Insert — EmpireOverlay (empire historique sur carte moderne)

**Path code** : `src/projects/_shared/components/inserts/EmpireOverlay.tsx`
**Démo** : `Insert-EmpireOverlayDemo` dans Root.tsx (120 frames, 1080x1920)
**Status** : ✅ V1 livré 2026-05-12 — pipeline 3 passes (storyboard Gemini Flash → breakdown Gemini 2.5 Pro → code)

**Concept** : Carte Mapbox CartoCaspian Sepia. Polygon GeoJSON empire historique (world_1300.geojson, aourednik) qui fade-in sur les frontières modernes. Villes historiques via SVG overlay + map.project(). Titre serif dramatique + panel données.

**Stack** : Mapbox GL JS + `applyCartoCaspian SEPIA` + `addLayer` fill GeoJSON + overlay SVG React AbsoluteFill + `spring()` / `interpolate()` Remotion

**Animation** :
- f0–15 : carte fade-in (zoom 3.5 Afrique de l'Ouest)
- f15–45 : polygon empire fade-in (fill `#d9b366` opacity 0→0.7, border terracotta)
- f30–50 : titre + dates slide-up spring
- f45–60 : dots villes scale-up spring (Niani pulse permanent)
- f60–80 : panel données slide-up spring
- f0–120 : zoom progressif 3.5→4.2, drift lon 0→-4

**GeoJSON** : `public/_shared/geo-data/world_1300.geojson` (feature `NAME === geojsonFeatureName`)
**Props clés** : `empireName`, `empireDate`, `territory`, `population`, `capital`, `modernCountries`, `geojsonFeatureName`

**Cas d'usage** :
- Atlas épisodes Mali Empire, Songhaï, Ghana, Kongo, Kanem-Bornou
- Comparaison territoire historique vs frontières coloniales actuelles
- Révéler l'étendue d'un empire à son apogée (zoom continent)

**Preview V1** : https://litter.catbox.moe/en9fay.mp4 (72h)

---

### Template Insert — GlobalPulse (flux commerciaux globe animé)

**Path code** : `src/projects/_shared/components/inserts/GlobalPulse.tsx`
**Compositions** :
- `Insert-GlobalPulseDemo` — V1 : globe statique zoom 1.8, pulse modéré
- `Insert-GlobalPulseV2Demo` — **V2 VALIDÉE** : zoom-in Niger → dézoom progressif pendant tracé arcs, pulse amplifié (rayon 420px)

**Status** : ✅ V1 + V2 validées 2026-05-12 — V2 recommandée (fidélité storyboard ~95%)

**Concept** : Globe Mapbox dark-v11 + atmosphère nuit étoilée. Point d'origine or pulsant (5 anneaux bleus électriques). 3 arcs SVG great-circle staggerés vers destinations. Labels pourcentages. Panel données slide-in.

**Stack** : Mapbox GL JS (`projection: globe`) + overlay SVG React AbsoluteFill + bezier quadratique + `strokeDashoffset` + `spring()` Remotion

**Animation V2** (recommandée) :
- f0–30 : zoom serré Niger (zoom 4.2), dot or + 5 anneaux pulse bleus dominants
- f30–90 : dézoom progressif 4.2→2.2 pendant que les arcs se tracent (stagger 5f)
- f50–95 : arc USA / f55–100 : arc France / f60–105 : arc Chine
- f85–110 : labels destinations apparaissent
- f110–128 : panel données slide-up spring (bottom-center)

**Props clés** : `originLabel`, `resourceName`, `production`, `worldShare`, `dataSource`

**Cas d'usage** :
- Flux export ressources africaines (uranium, cobalt, or, pétrole, cacao)
- Routes commerciales historiques vs modernes
- Diaspora africaine — destinations de migration
- Investissements étrangers entrants/sortants

**GeoJSON** : aucun — coordonnées lon/lat hardcodées dans DESTINATIONS_V2
**Preview V1** : https://litter.catbox.moe/38iq7e.mp4 (72h)
**Preview V2** : https://litter.catbox.moe/3n5sm6.mp4 (72h)

---

## 🧩 Helpers Mapbox partagés

**Path** : `src/projects/_shared/mapbox/MapboxBase.tsx`
**Exports** : `applyGeoAfriqueV5` + `STYLE_GEO_AFRIQUE_V5` (Template A — style signature Souverain), `MapboxBrandingHide` (retire logo+copyright), helpers `lerpCam`, `removeLabels`, ISO codes pays africains.

---

## 🖼️ Assets visuels statiques (`public/_shared/`)

### `flags-portraits/`

| Path | Type | Cas d'usage |
|---|---|---|
| `countries/niger-portrait.png` | Portrait éditorial B&W | SmallMultiplesGrid, KraftCard data |
| `countries/mali-portrait.png` | idem | idem |
| `countries/burkina-portrait.png` | idem | idem |
| `leaders/leader-portrait-editorial.png` | Portrait leader masculin (illustration) | KraftCard fond narratif, DocClassifie |
| `leaders/leader-portrait-f-editorial.png` | Portrait leader féminin | idem |
| `icons/icon-mine-uranium.png` | Icône thématique | Templates Niger/uranium |

### `textures/`

| Path | Cas d'usage |
|---|---|
| `bg-kraft-affirme.png` | Fond papier kraft (KraftCard, DocClassifie, multiply blend) |

### `geo-data/`

| Path | Cas d'usage |
|---|---|
| `countries-50m.json` | TopoJSON Natural Earth (d3-geo, projection Atlas) |
| `us-48states.json` | GeoJSON USA 48 états contigus (Alaska+Hawaii exclus) — pour toute comparaison de surface. Généré 2026-05-11 via bbox filter sur countries-50m. |

---

## 🎬 Refs Seedance (camera movements réutilisables)

**Path** : `public/_shared/motion-refs/`

| Type | File | Durée | Mouvement | Quand utiliser |
|---|---|---|---|---|
| Combat/duel | `combat/anime-duel-8s.mp4` | 8s | Multi-angle clash, snap zooms | Scènes de clash, batailles |
| Push-in dramatique | `discours-proclamation/push-in-oppenheimer-6s.mp4` | 6s | Slow push in face | Discours, contemplation |
| Foule/armée | `foule-armee/pullback-drone-beach-6s.mp4` | 6s | FPV pull back reveal | Révélation foule, panorama |
| Marche/voyage | `marche-voyage/tracking-walk-boulevard-6s.mp4` | 6s | Steadicam tracking from behind | Voyage, déplacement personnage |
| Moment dramatique | `moment-dramatique/dolly-in-intense-6s.mp4` | 6s | Frontal dolly in | Tension, climax |
| Panorama aerial | `panorama-lieu/aerial-drone-paris-6s.mp4` | 6s | Drone orbital sunset | Reveal lieu |
| Panorama arc | `panorama-lieu/arc-orbit-basterds-6s.mp4` | 6s | Arc orbit autour de personnages | Scène statique de personnages |

**Règle** : max 15s cumulés de video refs par génération Seedance. Sweet spot = 1 ref de 4-8s. Toujours pairer avec image refs pour identité personnage.

---

## 🎭 Characters refs Gemini (seeds canoniques)

**Path** : `public/_shared/characters-refs/`

**Règle absolue** : ne jamais générer ces personnages from scratch sans REF — dérive garantie.

| Personnage | Path seed principal | Notes |
|---|---|---|
| Abou Bakari II | `abou-bakari/abou-bakari-roi-plan-large-REF.png` | Plan large, kufi, fond sombre — ref Gemini multimodal |
| Hannibal Barca | `hannibal/hannibal-vivid-portrait-REF.png` | Casque or, eye patch droit |
| Amanirenas | `amanirenas/amanirenas-portrait-REF-v4-patch.png` | Eye patch gauche obligatoire |
| Moussa | `moussa/` | À documenter |
| Mariama Bâ | `mariama-ba/` | À documenter |
| Christophe Colomb | `colomb/` | À documenter |

Détails complets dans `public/_shared/characters-refs/<personnage>/README.md` quand disponible.

---

## 🎵 SFX génériques

**Path** : `public/_shared/sfx/`

| File | Usage |
|---|---|
| `sfx-ambiance.mp3` | Ambiance générique |
| `sfx-footsteps.mp3` | Pas |
| `sfx-jump.mp3` | Saut/impact |
| `sfx-music.mp3` | Musique courte |
| `sfx-surprise.mp3` | Stinger surprise |
| `sfx-wave.mp3` | Vague/transition |

---

## 🚦 Combinaisons recommandées (recettes)

| Cas d'usage | Combo templates | Exemple |
|---|---|---|
| Hook accrocheur Short | `BrutalHeadline` + photo B&W terrain | "L'URANIUM QUI VAUT UN EMPIRE" sur mine Arlit B&W |
| Chiffre-clé unique (emphase 2s) | `BigStat` | "$3.7B extraits du sol nigérien" |
| Donnée sourcée avec contexte | `DataCard` dark ou kraft | "$0.80/kg vs $40–80 marché libre" |
| Citation de presse | `NewsClippingV2` crème ou grain | Article Le Monde / Reuters plein écran |
| Marqueur temporel fort | `DateBar` fullscreen or | "1960" / "2018" entre deux chapitres |
| Présenter un dirigeant africain | `AtlasRealiste3D` (situer) + `KraftCardDocClassifie` portrait + tampon | Niger uranium : Niger en or sur carte Sahel → Issoufou polaroid VÉRIFIÉ |
| Comparer 3 pays sur une métrique économique | `CartoCaspian` (vue géo région) + `SmallMultiplesGrid` kraft | Sahel uranium : carte AES → grille balance commerciale 3 pays |
| Citation incarnée d'un leader | `KraftCard` Option 2 fond narratif drapeau | Issoufou citation ONU sur drapeau Niger flou |
| Identité d'un pays / drapeau historique | `KraftCardDocClassifie` subject=drapeau + tampon "OFFICIEL" | Drapeau Niger 1959 + tampon ARCHIVES D'ÉTAT |

---

## 📋 Backlog — templates NON encore codés (Jour 5+)

(Source : memory/templates-research/scouting/CONSOLIDATION-V1.md + `V2.md`)

| Template | Source d'inspiration | Effort estimé | Priorité |
|---|---|---|---|
| `<OsintSplitScreen>` | Africa Eye + NYT VI | ~45 min | Moyenne — composant codé, pas encore rendu/reviewé |
| `<ResourcesScrollTable>` | Caspian Report | ~45 min | Moyenne |
| `<PillCityLabel>` | Vox | ~15 min | Basse |
| `<GridSCRT>` (extension SmallMultiples) | The Pudding | ~60 min | Basse (déjà couvert partiellement) |
| Template E "Le Monde Cartographique" | Le Monde | ~2h | Backlog — POC requis |
| Template F "Carnet Reporter" (Johnny Harris) | Johnny Harris | POC requis | Backlog |
| Template G "Grille SCRT" | The Pudding | ~1h | Backlog |

**Codés mais DROP (jury Jour 4) :**
- `<NewsClipping>` V1 posé avec rotation → remplacé par V2 plein écran
- `<BrutalHeadline>` + drapeau SVG → concept trop faible, abandonné

---

## 🔧 Scripts utilitaires

| Script | Path | Usage |
|---|---|---|
| Génération previews automatique | `scripts/generate_template_previews.py` | `python3 scripts/generate_template_previews.py [filter]` — render + upload catbox + manifest JSON |
| Jury LLM 3 modèles (templates) | scripts/jury_3llms_jour3.py | Évaluation parallèle Kimi+GPT+Gemini sur frames |

---

## 🎨 Templates 16:9 — Vague 5 (Mécaniques Personnages & Confrontation)

> Showcase complet (5A-5C) : `out/templates-souverain/FINAL-ProtoK-Vague5-Showcase-v1-16x9.mp4`
> Workflow Gemini-first : specs reçues le 2026-05-21 depuis `gemini-3.1-pro-preview`.

### Template Vague5A — VoixDuPeuple (Testimonial Citation)

**Concept** : Une grande citation apparaît mot par mot (spring pop par ligne). Guillemets en gold massive de chaque côté. Ligne séparatrice gold tracée. Bloc identité (nom + rôle + année) slide-in. Pouls subtil après apparition.

**Quand utiliser** : citation d'un acteur historique, discours clé, témoignage qui incarne le propos. Le fond doit être sobre (slate-medium ou dark-dots-navy).

**Path code** : `src/projects/_shared/components/layouts/VoixDuPeuple.tsx`
**Composition Remotion** : `Template-VoixDuPeuple` (210f, 1920×1080)

**Props clés** :
- `quote` : texte de la citation (wrappé auto ~42 chars/ligne)
- `speaker` : nom en majuscules
- `role` : titre/fonction en gold
- `year` : année en bleu analytique
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| Mid (citation complète, identité visible) | https://files.catbox.moe/pdqwee.png |

---

### Template Vague5B — FaceAFace (Confrontation Comparaison)

**Concept** : Écran splitté par une ligne verticale centrale. Entité A (gold) à gauche, Entité B (bleu) à droite. 3 stats chacun (valeur grande + label). Médaillon VS au centre avec verdict optionnel.

**Quand utiliser** : comparaison de deux pays/acteurs/données, duel économique, bilan avant/après.

**Path code** : `src/projects/_shared/components/layouts/FaceAFace.tsx`
**Composition Remotion** : `Template-FaceAFace` (240f, 1920×1080)

**Props clés** :
- `entityA` / `entityB` : `{ name: string, stats: [{value, label}] }` — 3 stats chacun
- `verdict` : `{ symbol: string, label?: string }` — médaillon central (défaut "VS")
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| Mid (entités + stats + médaillon VS) | https://files.catbox.moe/9hk9ta.png |

---

### Template Vague5C — PortraitDossier (Fiche Intelligence)

**Concept** : Cadre polygonal (coins coupés) à gauche avec silhouette. 5 champs info (label bleu + valeur ivory) avec underscore draw-on. Ligne de scan bleue. Bannière statut plein écran en bas (ACTIF/RECHERCHE/DECEDE).

**Quand utiliser** : présenter un acteur clé (politicien, entrepreneur, personnage historique) façon dossier d'enquête.

**Path code** : `src/projects/_shared/components/layouts/PortraitDossier.tsx`
**Composition Remotion** : `Template-PortraitDossier` (240f, 1920×1080)

**Props clés** :
- `name` / `role` / `nationality` / `period` / `keyFact` : champs du dossier
- `status` : `"ACTIF"` (gold) | `"RECHERCHE"` (rouge) | `"DECEDE"` (gris)
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| End (dossier complet + bannière RECHERCHE) | https://files.catbox.moe/uc65z9.png |

---

## 🎨 Templates 16:9 — Vague 6 (Mécaniques Impact & Preuve)

> Showcase complet (6A-6C) : `out/templates-souverain/FINAL-ProtoL-Vague6-Showcase-v1-16x9.mp4`
> GIF animé showcase : https://files.catbox.moe/nmu5kj.gif
> Workflow Gemini-first : specs reçues le 2026-05-21 depuis `gemini-3.1-pro-preview`.

### Template Vague6A — TextChoc (Phrase Impact Mot à Mot)

**Concept** : Une phrase courte frappe mot par mot en spring pop individuel (scale+opacity). Les délais s'accélèrent = impression d'urgence montante. Le dernier mot (ou mot désigné) frappe en couleur accent (gold ou rouge). Soulignage qui se trace sous le mot accent.

**Quand utiliser** : moment choc, révélation narrative, chiffre qui scandalise mis en contexte. Très efficace sur fond dark-dots-navy ou b-roll.

**Ce qui est unique** : délais non-réguliers (premiers mots espacés, derniers rapides = urgence). Spring snappy damping=14/stiffness=120. Soulignage stroke-dashoffset 8 frames après l'accent.

**Exemples production** :
- "ILS ONT VOLÉ 63 MILLIARDS AU PEUPLE" → PEUPLE en rouge
- "UNE SEULE FAMILLE CONTRÔLE TOUT" → TOUT en gold
- "LA RÉPONSE EST 47 ANS" → 47 ANS en gold

**Path code** : `src/projects/_shared/components/layouts/TextChoc.tsx`
**Composition Remotion** : `Template-TextChoc` (150f, 1920×1080)

**Props clés** :
- `words` : `string[]` — chaque mot séparé (permet ciblage accent par index)
- `accentIndex` : index du mot accent (défaut : dernier mot)
- `accentColor` : `"#c8a951"` gold | `"#e63946"` rouge (défaut rouge)
- `fontSize` : défaut 96px
- `underlineAccent` : défaut true
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| Mid (phrase en cours) | https://files.catbox.moe/pdqwee.png |
| End (phrase complète + accent rouge souligné) | https://files.catbox.moe/9hk9ta.png |
| GIF (séquence complète) | https://files.catbox.moe/nmu5kj.gif |

---

### Template Vague6B — SourceProuve (Article Highlight)

**Concept** : Rectangle ivoire représentant un article de presse. Slide-in depuis le bas (spring). Nom publication en rouge, date en gris, titre en navy. Un rectangle gold semi-transparent glisse horizontalement sous la phrase-clé.

**Quand utiliser** : ancrer une affirmation dans une source crédible. Montrer "l'article dit ça". Investigation documentaire. Très efficace juste avant ou après un ChiffreChoc.

**Ce qui est unique** : le rectangle gold glisse en interpolate (pas spring) = lecture de gauche à droite comme surligner avec un surligneur. L'article a une ombre portée (effet "document posé sur le fond").

**Path code** : `src/projects/_shared/components/layouts/SourceProuve.tsx`
**Composition Remotion** : `Template-SourceProuve` (180f, 1920×1080)

**Props clés** :
- `publication` : nom source (ex: `"REUTERS"`, `"FINANCIAL TIMES"`)
- `headline` : titre article (wrappé auto ~50 chars/ligne, max 3 lignes)
- `highlightText` : phrase à surligner (doit correspondre au début d'une ligne du headline wrappé)
- `date` : ex: `"12 MAI 2024"`
- `publicationColor` : défaut rouge `"#e63946"`
- `bgColor` : défaut `"transparent"`

**Previews** :
| Frame | Preview |
|---|---|
| End (article complet + surlignage gold) | https://files.catbox.moe/uc65z9.png |
| GIF (slide-in + surlignage en direct) | https://files.catbox.moe/nmu5kj.gif |

---

### Template Vague6C — ChiffreChoc (Stat Fullscreen Impact)

**Concept** : Un seul chiffre massif (220px) prend tout l'écran sur fond navy quadrillé. Spring overshoot (damping=8, stiffness=150 = rebond visible). Préfixe en gold plus petit arrive 5 frames avant. Ligne séparatrice trace. Deux lignes de contexte (WHAT + SO WHAT) fade-in séquentiel.

**Quand utiliser** : LE moment de l'épisode — le chiffre que le spectateur retient. Différent de PulseNumber (insert) : celui-ci est fullscreen, standalone, sans concurrent visuel.

**Ce qui est unique** : le fond navy avec grille (opacity 0.06) est toujours visible même si bgColor est passé en prop. L'overshoot spring est calibré pour un léger rebond (pas un spring amorti classique). Le préfixe et la valeur sont alignés baseline dynamiquement (calcul widths charW).

**Exemples production** :
- `prefix="$"` + `value="63B"` + `context1="REVENUS PETROLIERS DÉTOURNÉS"`
- `prefix="-"` + `value="47%"` + `valueColor="#e63946"` + `context1="CHUTE DU PIB EN 3 ANS"`
- `prefix=""` + `value="9 000"` + `context1="DOCUMENTS CLASSIFIÉS FUITES"`

**Path code** : `src/projects/_shared/components/layouts/ChiffreChoc.tsx`
**Composition Remotion** : `Template-ChiffreChoc` (150f, 1920×1080)

**Props clés** :
- `value` : valeur principale (ex: `"63B"`, `"47%"`, `"9 000"`)
- `prefix` : symbole avant (ex: `"$"`, `"-"`, `"×"`, `""`)
- `context1` : ligne WHAT (majuscules, letterSpacing 6)
- `context2` : ligne SO WHAT optionnelle (ton plus doux, opacity 0.7)
- `valueColor` : défaut gold `"#c8a951"`, rouge pour alarme `"#e63946"`
- `bgColor` : défaut `"#1a2535"` (la grille est toujours rendue)

**Previews** :
| Frame | Preview |
|---|---|
| Mid (chiffre apparu, ligne en cours) | https://files.catbox.moe/9hk9ta.png |
| End (chiffre + ligne + 2 contextes) | https://files.catbox.moe/uc65z9.png |
| GIF (overshoot + tracé + fade contextes) | https://files.catbox.moe/nmu5kj.gif |

---

## 🎨 Templates 16:9 — Vague 7 (Personnages & Réseaux)

> Showcase complet (7A-7C) : `out/templates-souverain/FINAL-ProtoM-Vague7-Showcase-v1-16x9.mp4`
> Showcase MP4 (72h) : https://litter.catbox.moe/vd9kby.mp4
> GIF animé showcase : https://files.catbox.moe/wuf4sk.gif
> Workflow Gemini-first : specs reçues le 2026-05-21 depuis `gemini-3.1-pro-preview`.
> Validé Aziz : 2026-05-21

### Template Vague7A — PortraitSilhouette (Profil Acteur Plein Écran)

**Concept** : Split vertical gold. Gauche : cadre octogonal bleu avec silhouette géométrique (tête cercle + épaules trapèze, gradient navy). Badge pays en or. Droite : NOM (72px ivory, spring), TITRE (gold), PAYS (bleu), 3 faits numérotés slide-in séquentiel. Badge statut en bas.

**Quand utiliser** : présenter un acteur-clé en début de segment. Le fond SouverainScene fait le reste — le template est entièrement transparent.

**Path code** : `src/projects/_shared/components/layouts/PortraitSilhouette.tsx`
**Composition Remotion** : `Template-PortraitSilhouette` (240f, 1920×1080)

**Props clés** :
- `name` / `title` / `country` / `countryCode` : identité
- `facts` : `string[]` — max 3 faits courts
- `status` : `"EN FONCTION"` | `"OPPOSANT"` | `"EXILE"` | `"DECEDE"`

**Previews** :
| Frame | Preview |
|---|---|
| End (portrait complet + statut EN FONCTION) | https://files.catbox.moe/c682o3.png |
| MP4 render (72h) | https://litter.catbox.moe/0gj2dd.mp4 |
| GIF (reveal complet) | https://files.catbox.moe/wuf4sk.gif |

---

### Template Vague7B — MosaïqueActeurs (Grille Réseau d'Acteurs)

**Concept** : Grille 2×3 de fiches acteurs sur fond slate. Chaque fiche = nom + rôle + badge statut coloré (ALLIÉ bleu / NEUTRE gold / ANTAGONISTE rouge / CIBLE rouge). Rotations fixes légères (-1.5° à +1.2°) donnent l'effet "punaisé sur tableau". Connexions gold dessinées au stroke-dashoffset après les cartes.

**Quand utiliser** : révéler un réseau (corruption, alliance, acteurs d'un dossier pétrolier). Chaque connexion gold = lien entre acteurs.

**Path code** : `src/projects/_shared/components/layouts/MosaiqueActeurs.tsx`
**Composition Remotion** : `Template-MosaiqueActeurs` (240f, 1920×1080)

**Props clés** :
- `title` : titre du réseau
- `actors` : `Array<{name, role, status, statusColor?}>` — max 6
- `connections` : `[number, number][]` — paires d'indices à relier en gold

**Previews** :
| Frame | Preview |
|---|---|
| End (6 fiches + connexions gold) | https://files.catbox.moe/kbcgcz.png |
| MP4 render (72h) | https://litter.catbox.moe/70dayt.mp4 |
| GIF (apparition séquentielle + tracé connexions) | https://files.catbox.moe/wuf4sk.gif |

---

### Template Vague7C — PassationPouvoir (Transition de Leadership)

**Concept** : Sortant grisé à gauche (recule + s'efface), Entrant en couleurs à droite (prend de l'espace). Ligne gold centrale avec badge année. Flash gold éclate au moment de la bascule. Timeline DÉPART/ARRIVÉE en bas.

**Quand utiliser** : transition de présidence, changement de gouvernement, fin d'ère. Un des templates les plus narrativement forts de la bibliothèque.

**Path code** : `src/projects/_shared/components/layouts/PassationPouvoir.tsx`
**Composition Remotion** : `Template-PassationPouvoir` (240f, 1920×1080)

**Props clés** :
- `outgoing` / `incoming` : `{name, role, period}`
- `transitionYear` : année affichée au centre (badge gold)

**Previews** :
| Frame | Preview |
|---|---|
| End (Macky grisé + Diomaye en couleurs + 2024 + timeline) | https://files.catbox.moe/sztnce.png |
| MP4 render (72h) | https://litter.catbox.moe/y6pv4j.mp4 |
| GIF (flash + bascule complète) | https://files.catbox.moe/wuf4sk.gif |

---

---

## 🎨 Templates 16:9 — Vague 8 (Éditorial & Pouvoir)

> Showcase complet (8A-8B) : `out/templates-souverain/FINAL-ProtoN-Vague8-Showcase-v1-16x9.mp4`
> Showcase MP4 (72h) : https://litter.catbox.moe/7i8npl.mp4
> Workflow Gemini-first : specs reçues le 2026-05-21 depuis `gemini-3.1-pro-preview`.
> Validé Aziz : 2026-05-21

### Template Vague8A — PortraitEditorial (Une de Magazine Analytique)

**Concept** : Split gauche/droite. Gauche : zone photo 700×900px (ou placeholder silhouette géométrique navy) + cadre gold stroke-dashoffset. Droite : bloc éditorial complet — rubrique rouge, séparateur or, titre 52px ivory 2 lignes, sous-titre gold, 3 mini-stats avec barre gold, badge SOURCE en bas.

**Quand utiliser** : ouverture de dossier d'investigation. Peut recevoir une photo réelle (Gemini ou asset externe) via `imageUrl`. Sans photo : placeholder silhouette premium suffisant.

**Path code** : `src/projects/_shared/components/layouts/PortraitEditorial.tsx`
**Composition Remotion** : `Template-PortraitEditorial` (180f, 1920×1080)

**Props clés** :
- `imageUrl?` : URL image (optionnel — silhouette auto si absent)
- `rubrique?` : catégorie rouge en haut (défaut "INVESTIGATION")
- `titre` : `string[]` — 1-2 lignes
- `sousTitre?` : ligne gold sous le titre
- `stats` : `Array<{label, valeur}>` — max 3
- `source?` : texte badge SOURCE

**Previews** :
| Frame | Preview |
|---|---|
| End — rubrique + titre + stats + source | https://litter.catbox.moe/y3xnfa.png |
| MP4 render (72h) | https://litter.catbox.moe/1c4288.mp4 |

---

### Template Vague8B — TrombinoscapeStrategique (Cartographie du Pouvoir)

**Concept** : Grille 4-6 portraits (300×300px chacun) avec disposition auto (2×2, 3+2, 3×2). Chaque portrait : placeholder géométrique (losange + point central coloré) + barre accent couleur statut en haut + nom + rôle + barre de pouvoir 0-100% colorée. Arcs SVG courbes gold entre portraits sélectionnés (stroke-dashoffset séquentiel).

**Quand utiliser** : cartographie d'un conseil, d'un réseau de décision, d'un organigramme de pouvoir. Fonctionne sans photos — les couleurs de statut (rouge/bleu/gold) encodent le type de pouvoir.

**Path code** : `src/projects/_shared/components/layouts/TrombinoscapeStrategique.tsx`
**Composition Remotion** : `Template-TrombinoscapeStrategique` (210f, 1920×1080)

**Props clés** :
- `titre?` : titre global (défaut "CARTOGRAPHIE DU POUVOIR")
- `portraits` : `Array<{name, role, pouvoir: 0-100, statutColor?, imageUrl?}>` — 4 à 6
- `arcs?` : `[number, number][]` — paires d'indices à relier

**Previews** :
| Frame | Preview |
|---|---|
| End — 6 portraits grille 3×2 + arcs gold | https://litter.catbox.moe/gqtbd2.png |
| MP4 render (72h) | https://litter.catbox.moe/ut71oe.mp4 |

---

## 🎨 Templates 16:9 — Vague 6 Expérimentale (Textures & Systèmes Vivants)

> Codés : 2026-05-21. Renders : Litterbox 72h (catbox.moe down ce jour).
> **Nature** : abstraits par design — nécessitent un contexte narratif précis pour devenir premium.
> **Workflow upgrade** : envoyer v1 + storyboard + previews à Gemini 3.1-pro → `code_values` ciblés → scène 2x premium. Voir memory/feedback_gemini-v2-upgrade-workflow.md.

### Template Vague6Exp-A — ParallaxeDiorama (Profondeur 3 Couches)

**Path code** : `src/projects/_shared/components/layouts/ParallaxeDiorama.tsx`
**Composition Remotion** : `Template-ParallaxeDiorama` (200f, 1920×1080)
**Showcase** : `ProtoO-Vague6Exp-Showcase` (1200f = 5 scènes × 240f)

**Cas d'usage** : intro cinématique à révélation lente — paysage géographique, panorama économique, ouverture d'épisode.

**Anatomie :**
- 3 couches SVG rectangulaires avec parallaxe différentielle : layer0 tx=−12px, layer1 tx=−30px, layer2 tx=−60px (sur 180f)
- Fade stagger : [0-20f], [10-30f], [20-40f]
- Drop-shadow SVG + radialGradient vignette
- `label` + `caption` en overlay

**Props** : `label?`, `caption?`, `bgColor?` (défaut transparent — SouverainScene gère le fond)

| Frame | Preview |
|---|---|
| MP4 render (72h) | https://litter.catbox.moe/nxd0xf.mp4 |

---

### Template Vague6Exp-B — MosaïqueWax (Tissu Vivant)

**Path code** : `src/projects/_shared/components/layouts/MosaiqueWax.tsx`
**Composition Remotion** : `Template-MosaiqueWax` (210f, 1920×1080)

**Cas d'usage** : diversité culturelle, textile, identité africaine, alliances tribales, multiplicité d'acteurs.

**Anatomie :**
- 24 triangles calculés depuis hexagone régulier r=400 centré (960,540)
- Spring pop stagger delays [0,4,8,...92], config {damping:10, stiffness:180, mass:0.8}
- 5 couleurs wax cycliques : #e63946, #c8a951, #4a9eff, #2d9e6b, #f2ebd9
- Scale ancré au centroïde de chaque triangle (moyenne des 3 sommets)
- Badge titre à f150+ avec spring

**Props** : `title?`, `subtitle?`, `colors?` (5 couleurs personnalisables), `bgColor?`

| Frame | Preview |
|---|---|
| MP4 render (72h) | https://litter.catbox.moe/tay7fd.mp4 |

---

### Template Vague6Exp-C — MétamorphoseFiduciaire (Symbole → Symbole)

**Path code** : `src/projects/_shared/components/layouts/MetamorphoseFiduciaire.tsx`
**Composition Remotion** : `Template-MetamorphoseFiduciaire` (180f, 1920×1080)

**Cas d'usage** : transition monétaire (Franc CFA → autre devise), conversion d'alliances économiques, changement d'ère.

**Anatomie :**
- Symbole A fade 40-80f
- 15 gouttes d'encre spring depuis le centre, delays 40-82 step 3, config {damping:8, stiffness:200}
- ClipPath cercle rayon 0→550px (80-120f) révèle Symbole B en gold sur disque navy
- Gouttes fade 120-150f
- Fond gradient ivoire

**Props** : `symbolA?` ("₣"), `symbolB?` ("¥"), `inkColor?` (#1a2535), `bgColor?`

| Frame | Preview |
|---|---|
| MP4 render (72h) | https://litter.catbox.moe/1k24tn.mp4 |

---

### Template Vague6Exp-D — OrigamiCarto (4 Quadrants)

**Path code** : `src/projects/_shared/components/layouts/OrigamiCarto.tsx`
**Composition Remotion** : `Template-OrigamiCarto` (180f, 1920×1080)

**Cas d'usage** : cartographie des enjeux géopolitiques, 4 axes narratifs d'un épisode, 4 acteurs d'un conflit.

**Anatomie :**
- 4 volets 960×540 se déploient depuis le centre (960,540) en spring scale
- Stagger : Q1(0-40f), Q2(10-50f), Q3(20-60f), Q4(30-70f), config {damping:14, stiffness:120}
- ClipPath par volet — pas de débordement pendant l'animation
- Croix de pliure gold (ligne x=960 + y=540) disparaît 60-90f
- Titre global au-dessus après déploiement

**Props** : `title?`, `labels?: string[4]` (un label par quadrant cardinal), `bgColor?`

| Frame | Preview |
|---|---|
| MP4 render (72h) | https://litter.catbox.moe/rzspra.mp4 |

---

### Template Vague6Exp-E — LoomWeaver (Tisser les Alliances)

**Path code** : `src/projects/_shared/components/layouts/LoomWeaver.tsx`
**Composition Remotion** : `Template-LoomWeaver` (220f, 1920×1080)

**Cas d'usage** : alliances géopolitiques, interdépendances économiques, réseau d'acteurs, flux commerciaux.

**Anatomie :**
- 8 fils warp (horizontaux) : dashoffset 1920→0, stagger [0,8,...56]
- 8 fils weft (verticaux) : dashoffset 1080→0, stagger [40,50,...110]
- 64 nœuds aux intersections : spring config {damping:12, stiffness:150, mass:0.8}, delay = 120 + (xi+yi)×2
- Couleurs par quadrant : tl=#4a9eff, tr=#c8a951, bl=#e63946, br=#2d9e6b
- Badge titre à f160+

**Props** : `title?`, `nodeColors?` ({tl,tr,bl,br}), `bgColor?`

| Frame | Preview |
|---|---|
| MP4 render (72h) | https://litter.catbox.moe/742vdq.mp4 |

**Showcase complet Vague 6 exp (ProtoO)** : https://litter.catbox.moe/plttdy.mp4

---

## 🎨 Templates 16:9 — Vague 4 Manquants (FUN Investigation & Transition)

> Codés : 2026-05-21. Renders : Litterbox 72h (catbox.moe down ce jour).

### Template Vague4-bis-A — CalqueDechire (Torn Veil)

**Path code** : `src/projects/_shared/components/layouts/CalqueDechire.tsx`
**Composition Remotion** : `Template-CalqueDechire` (180f, 1920×1080)

**Cas d'usage** : déconstruire la communication officielle — révéler la dette cachée derrière un méga-projet, le double discours d'un communiqué.

**Anatomie :**
- Phase 1 (0-40f) : document ivoire centré "COMMUNIQUÉ OFFICIEL" + 3 lignes langue de bois
- Phase 2 (40-70f) : déchirure SVG irrégulière — moitié gauche translate(−860px) + rotate(−8°), droite +860px +8° spring sec {damping:14, stiffness:280}
- Phase 3 (70-180f) : fond navy révélé + stat rouge + source gold fade-in spring

**Props** : `officialText?`, `bodyLines?: string[]`, `statLabel?`, `sourceLabel?`, `bgColor?`

| Frame | Preview |
|---|---|
| MP4 render | https://i.imgur.com/O5MxaUm.mp4 |

---

### Template Vague4-bis-B — ScanInfrarouge (UV Truth)

**Path code** : `src/projects/_shared/components/layouts/ScanInfrarouge.tsx`
**Composition Remotion** : `Template-ScanInfrarouge` (200f, 1920×1080)

**Cas d'usage** : révéler la présence cachée de forces étrangères, concessions minières non publiées, accords confidentiels.

**Anatomie :**
- Surface normale : fond navy + grille discrète + 3 data points officiels (opacité 45%)
- Ligne de scan : 3px bleu électrique + glow, descend 0→1080px (f40→f160)
- Zone révélée en dessous : fond vert #0d3a22 + grille bleue + points rouges pulsants + labels gold
- 4 points cachés avec `triggerFrame` individuels — apparaissent au passage du scan

**Props** : `hiddenPoints?: ScanPoint[]`, `bgColor?`

| Frame | Preview |
|---|---|
| MP4 render | https://i.imgur.com/xCLRZIk.mp4 |

---

### Template Vague4-bis-D — EffetDomino (Tipping Point)

**Path code** : `src/projects/_shared/components/layouts/EffetDomino.tsx`
**Composition Remotion** : `Template-EffetDomino` (210f, 1920×1080)

**Cas d'usage** : contagion géopolitique, succession coups d'État Sahel, effet domino économique.

**Anatomie :**
- 5 piliers drapeaux 2D (3 bandes de couleur) alignés horizontalement
- Labels code + nom pays au-dessus de chaque pilier
- Cascade déclenchée : chaque chute démarre quand le précédent atteint 45° (délai 27f)
- Spring chute {damping:8, stiffness:120} — effet poids réaliste
- Texte d'impact après f165 : spring {damping:18, stiffness:150}

**Props** : `piliers?: DominoPilier[]`, `impactText?`, `impactSubText?`, `bgColor?`

| Frame | Preview |
|---|---|
| MP4 render | https://i.imgur.com/x89R2LJ.mp4 |

---

### Template Vague4-T1 — LoomWipe (Transition Tissage Signature)

**Path code** : `src/projects/_shared/components/layouts/LoomWipe.tsx`
**Composition Remotion** : `Template-LoomWipe` (90f, 1920×1080)

**Cas d'usage** : transition entre chapitres — élégante, ancrage culturel subtil (métaphore tissu/pagne).

**Anatomie :**
- 4 bandes horizontales (h=270px) : alternent gold/navy, glissent de gauche/droite alternativement
- 4 bandes verticales (w=480px) : alternent navy/gold, glissent de haut/bas alternativement
- Convergence à f=42, écran couvert f45→f50, sortie symétrique f50→f88
- Overlay toujours opaque (pas de bgColor — c'est une transition)

**Props** : `bandColorA?` (#c8a951), `bandColorB?` (#1a2535)

| Frame | Preview |
|---|---|
| MP4 render | https://i.imgur.com/DElPL70.mp4 |

**Showcase complet Vague 4 bis (ProtoP)** : https://i.imgur.com/AdddtKp.mp4

---

---

## 🎬 Lottie disponibles (`public/_shared/lottie/`)

| Fichier | Usage | Source | Statut |
|---------|-------|--------|--------|
| `smoke.json` | Fumée vectorielle organique — pollution, raffinerie, production pétrolière | LottieFiles (existant projet) | ✅ Validé headless 2026-05-26 |

**Règle d'usage Lottie + Mapbox fill-pattern** :
- ✅ Textures organiques continues (fumée, eau, feu) qui couvrent tout le canvas → idéal pour fill-pattern tilé sur territoire
- ❌ Éléments localisés (markers, pulses, points uniques) → utiliser DOM markers Mapbox à la place

Pattern technique complet : `memory/tools/mapbox-mcp.md` section "Lottie off-screen".
Showcase narratif : https://files.catbox.moe/bj078h.mp4

---

## 📐 Règles de maintenance de cet index

1. **À chaque nouveau template/asset validé** : ajouter section + previews
2. **À chaque modification visuelle** : régénérer les previews via script + remplacer URLs
3. **`_manifest.json`** dans `public/_shared/previews/` reste source de vérité technique pour Gemini i2i
4. **Frame previews** : règle Aziz Jour 3 — start/mid/end pour templates animés, mid/end seulement pour ceux sans animation start, GIF optionnel uniquement pour animation critique (b-strategy)
