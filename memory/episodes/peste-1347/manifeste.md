---
name: peste-1347-manifeste
description: Manifeste beat par beat — La Peste et le Sahara 1347. Source de vérité code Remotion.
metadata:
  type: project
---

# Manifeste — La Peste et le Sahara 1347
> Basé sur timing.ts LOCKED + script V3 LOCKED + assets Phase 4 confirmés
> À lire AVANT d'écrire une ligne de code Remotion.
> Durée : 105.12s | 3153 frames @30fps

---

## Vue globale — 6 beats

| Beat | Frames | Durée | Vue carte | Personnages/Assets |
|------|--------|-------|-----------|-------------------|
| HOOK | f2→f225 | 7.5s | mercLarge — vue complète | aucun |
| SETUP GÉO | f241→f690 | 15s | mercLarge → drift Crimée → Sicile | bateau génois |
| DENSITÉ CESAR | f714→f1223 | 17s | mercEurope (focus Angleterre) | rat noir |
| CLIMAX BOUCLIER | f1241→f2291 | 35s | mercSahara (zoom Sahara) | chameau Mali |
| MALI VIVANT | f2323→f2974 | 22s | mercMali (focus Afrique Ouest) | Souleymane + caravane |
| PUNCHLINE | f2975→f3153 | 6s | mercLarge — retour vue complète | aucun |

---

## BEAT 1 — HOOK (f2→f225)

**Script :** "En mil trois cent quarante-sept, un tiers de l'Europe disparaît en trois ans. L'Afrique subsaharienne, elle, continue."

**Vue carte :** `mercLarge` — carte statique, pas de drift, pas de markers
**Animation :** Légère apparition carte (fade in 0→1 en 30f)
**Overlay :**
- Titre principal centré : "1347" (apparaît f15, font serif, grande taille, couleur `#f5e6c8`)
- Sous-titre : "La Peste et le Sahara" (apparaît f30, plus petit)
- Pas de markers, pas de SFX

**Couleurs actives :**
- Europe : terracotta `#a0614a` (zone Peste dès le départ — annonce le sujet)
- Mali : or `#b8860b`
- Sahara : parchemin clair

**Règle R1 :** 7.5s — titre + sous-titre suffisent pour le mouvement. OK.

---

## BEAT 2 — SETUP GÉO (f241→f690)

**Script :** "Octobre mil trois cent quarante-sept. Un navire accoste en Sicile. Il vient de Crimée. À son bord : la Peste. La Peste se propage vers le nord. Vers Paris. Vers Londres. Vers Stockholm. Mais le Sahara est là."

**Vue carte :** `mercLarge` avec drift progressif vers le nord

**Séquence visuelle :**

| Frame | Trigger | Action |
|-------|---------|--------|
| f241 | SETUP_START | carte visible, drift lent vers Crimée |
| f345 | CITIES.SICILE | SFX-B marker pin → marker rouge Sicile apparaît |
| f390 | CITIES.CRIMEE | SFX-B → marker rouge Caffa (Crimée) |
| f345-f390 | — | bateau génois animé (CSS translateX) Sicile→Caffa, disparaît après |
| f491 | ROUTES.PROPAGATION_START | SFX-C ink-draw → vague rouge depuis Sicile (cercle SVG r animé 0→max) |
| f562 | CITIES.PARIS | SFX-B → marker Paris |
| f588 | CITIES.LONDRES | SFX-B → marker Londres |
| f612 | CITIES.STOCKHOLM | SFX-B → marker Stockholm |
| f659 | PIVOTS.SAHARA_BOUCLIER | vague s'ARRÊTE — highlight doré Sahara pulse |
| f682 | PIVOTS.SAHARA_EST_LA | texte overlay "SAHARA" pulse brièvement en or |

**Assets :**
- `bateau-genois.png` — 64×48 — apparaît f340, suit une trajectoire SVG Sicile→Crimée
- Markers `AtlasPulseMarker` rouge pour villes Peste
- Vague propagation : cercle SVG `<circle cx cy r>` animé depuis poi.Sicile

**Règle R1 :** Vague + 5 markers en cascade = changement toutes les 3-4s. OK.

---

## BEAT 3 — DENSITÉ CESAR (f714→f1223)

**Script :** "En Angleterre : quarante-six pour cent de la population meurt. Quatre virgule huit millions d'habitants. Deux virgule six millions survivent. Au Caire, en décembre mil trois cent quarante-huit : sept mille morts par jour. Sept mille. Chaque jour."

**Vue carte :** `mercEurope` — zoom Europe, Angleterre highlightée en rouge plus intense

**Séquence visuelle :**

| Frame | Trigger | Action |
|-------|---------|--------|
| f714 | DENSITE_START | transition vers mercEurope (zoom progressif 30f) |
| f718 | STATS.ANGLETERRE_46PCT | SFX-D thud → cartouche "46%" apparaît sur Angleterre |
| f840 | STATS.QUATRE_VIRGULE | SFX-D → cartouche "4,8M" |
| f926 | STATS.DEUX_VIRGULE | SFX-D → cartouche "2,6M survivent" |
| f1009 | CITIES.CAIRE | SFX-B → marker orange Le Caire |
| f1105 | STATS.SEPT_MILLE | SFX-D → cartouche "7 000 / jour" rouge sang sur Le Caire |

**Cartouches (`AtlasCartouche`) :**
- Style : fond sombre `#1a0a00`, texte `#f5e6c8`, chiffre en grand
- Positionnement : sur la zone géographique concernée (Angleterre, puis Le Caire)
- Apparition : slide in depuis le bas, 15f
- Durée visible : jusqu'à la stat suivante ou fin du beat

**Assets :**
- Rat noir `rat-noir.png` 32×32 — optionnel, peut apparaître sur les routes maritimes pendant ce beat si la composition le permet. Ne pas surcharger.

**Règle R1 :** 6 events en 17s = ~1 toutes les 3s. OK.

---

## BEAT 4 — CLIMAX BOUCLIER (f1241→f2291)

**Script :** "La bactérie voyage avec les rats, les puces, les bateaux. Elle suit les routes maritimes. Et voici ce qu'elle ne peut pas faire. Traverser le Sahara à dos de chameau prend soixante à quatre-vingt-dix jours. Un malade de la Peste meurt en deux à six jours. La puce vectrice exige une humidité élevée pour survivre. L'air du désert l'assèche en quelques heures. En Europe : des milliers de fosses communes. Au sud du Sahara : aucune. La même époque. Le même pathogène. Un désert entre les deux."

**Vue carte :** `mercSahara` — Sahara plein écran, barrière visible

**Séquence visuelle :**

| Frame | Trigger | Action |
|-------|---------|--------|
| f1241 | CLIMAX_START | transition vers mercSahara (zoom 40f) |
| f1365 | ROUTES.ROUTES_MARITIMES | SFX-C → routes maritimes tracées (pointillés animés rouges) |
| f1434 | PIVOTS.VOICI | pause dramatique — vague rouge s'approche du Sahara et STOPPE |
| f1502 | STATS.TRAVERSER | SFX-D → cartouche "60-90 jours" avec chameau icon |
| f1705 | STATS.DEUX_SIX_JOURS | SFX-D → cartouche "2-6 jours" — rouge sang, contraste fort |
| f1800 | — | chameau Mali animé traverse le Sahara lentement (W→E ou E→W) |
| f2100 | — | overlay contraste : gauche rouge (fosses communes) / droite or (aucune) |
| f2291 | CLIMAX_END | freeze frame Sahara |

**Assets :**
- Chameau Mali `0b93031f` — walk east — traverse visuellement le Sahara
- Vague rouge bloquée au bord du Sahara (même composant que Beat 2, r figé)
- Overlay `saharaPath` highlighté en or semi-transparent `#c8960c` opacité 0.3

**Règle R1 :** 35s — chameau en mouvement permanent + vague figée + cartouches. OK.

---

## BEAT 5 — MALI VIVANT (f2323→f2974)

**Script :** "Pendant ce temps, Mansa Souleymane gouverne le Mali. Les récits de l'époque décrivent des routes sûres, un commerce qui prospère, aucune épidémie. L'or du Mali part en caravane vers le Maghreb, puis par bateau vers les ports de Florence et de Venise. L'Europe s'effondre. Le Mali alimente ses monnaies."

**Vue carte :** `mercMali` — Afrique de l'Ouest centrée, Empire Mali en or

**Séquence visuelle :**

| Frame | Trigger | Action |
|-------|---------|--------|
| f2323 | MALI_START | transition vers mercMali (drift 40f) |
| f2370 | PIVOTS.SOULEYMANE | Mansa Souleymane sprite apparaît sur Niani (capitale) |
| f2641 | ROUTES.OR_CARAVANE | SFX-C → route or animée Niani→Tombouctou→Maghreb (trait doré progressif) |
| f2703 | CITIES.MAGHREB | SFX-B → marker or Maghreb |
| f2781 | CITIES.FLORENCE | SFX-B → marker or Florence |
| f2806 | CITIES.VENISE | SFX-B → marker or Venise |

**Assets :**
- Mansa Souleymane `eb3d1a3e` — walk east — se déplace depuis Niani vers Tombouctou
- Chameau Mali `0b93031f` — caravane sur route or
- Marchands berbères `79865794` — apparaissent au Maghreb

**Règle R1 :** Souleymane en mouvement + route or animée + markers cascade. OK.

---

## BEAT 6 — PUNCHLINE (f2975→f3153)

**Script :** "Deux épidémies, deux destins. Un désert entre les deux. La géographie n'est pas neutre."

**Vue carte :** `mercLarge` — retour vue complète Europe + Afrique
**Animation :** zoom out progressif depuis mercMali vers mercLarge (40f)

**Overlay final :**
- Zone Europe : vignette rouge subtile
- Zone Mali : vignette or subtile
- Texte final centré : "La géographie n'est pas neutre." apparaît à f3115 (PIVOTS.GEOGRAPHIE)
- Font serif, couleur `#f5e6c8`, fade in 20f

**Règle R1 :** 6s — zoom out + texte final = 2 changements. OK.

---

## Assets complets — inventaire définitif (chemins vérifiés 2026-05-16)

### Characters Peste 1347 (NOUVEAUX)

| Asset | Chemin local | Usage beat | Notes |
|-------|-------------|-----------|-------|
| Souleymane debout | `public/atlas/peste-1347/assets/characters/souleymane/` | Beat 5 | east/west/south/north.png |
| Souleymane walk east | `...souleymane/animations/walk/east/frame_000-005.png` | Beat 5 | 6 frames |
| Souleymane walk west | `...souleymane/animations/walk/west/frame_000-005.png` | Beat 5 | 6 frames |
| Souleymane trônant | `public/atlas/peste-1347/assets/characters/souleymane-throne/` | Beat 5 (optionnel) | state de eb3d1a3e — 4 rotations |
| Marchand berbère assis | `public/atlas/peste-1347/assets/characters/marchand-assis/rotations/` | Beat 5 Tombouctou | 4 rotations |

### Map Objects Peste 1347 (NOUVEAUX)

| Asset | Chemin local | Taille | Usage beat | Notes |
|-------|-------------|--------|-----------|-------|
| Rat noir statique | `public/atlas/peste-1347/assets/objects/rat-noir.png` | 32×32 | Beat 3 | |
| Rat scurrying | public/atlas/peste-1347/assets/objects/rat-anim/frame_000-003.png | 64×64 | Beat 3 | 4 frames via animate_with_text |
| Bateau génois statique | `public/atlas/peste-1347/assets/objects/bateau-genois.png` | 64×48 | Beat 2 | |
| Bateau rocking | public/atlas/peste-1347/assets/objects/bateau-anim/frame_002-003.png | 64×64 | Beat 2 | **utiliser f2/f3 uniquement** (f0/f1 sans voiles) |
| Mosquée Tombouctou | `public/atlas/peste-1347/assets/objects/mosquee-tombouctou.png` | 64×64 | Beat 5 | |
| Ville européenne deuil | `public/atlas/peste-1347/assets/objects/ville-europeenne-deuil.png` | 64×48 | Beat 3/4 | |

### Characters réutilisables (EXISTANTS — chemins vérifiés)

| Asset | Chemin local | Usage beat | Notes |
|-------|-------------|-----------|-------|
| Chameau Mali statique | `public/empire-ghana/assets/pixellab/chameau-walk-static.png` | Beat 4/5 | |
| Chameau walk east | public/empire-ghana/assets/pixellab/chameau/walking/east/frame_000-003.png | Beat 4/5 | 4 frames |
| Marchand berbère Ghana | `public/empire-ghana/characters/berbere/rotations/east.png` (+ N/S/W) | Beat 5 Maghreb | réutiliser pour caravane |

### Audio

| Fichier | Usage | Timing |
|---------|-------|--------|
| `public/atlas/peste-1347/audio/narration-v1.mp3` | narration principale | 105.12s |
| `public/atlas/peste-1347/audio/music-c-desert.mp3` | musique fond | vol 0.04, fade 2s |
| `public/atlas/peste-1347/audio/sfx-b-marker.mp3` | marker pin | 0.43s, vol 0.6 |
| `public/atlas/peste-1347/audio/sfx-c-inkdraw.mp3` | tracé encre | 1.63s, vol 0.85 |
| `public/atlas/peste-1347/audio/sfx-d-thud.mp3` | stat impact | 0.48s, vol 1.5 |

---

## Composants Atlas à utiliser

| Besoin | Composant | Fichier |
|--------|-----------|---------|
| Carte de base | `AtlasMercator` | atlas-components.tsx |
| Marker ville | `AtlasPulseMarker` | atlas-components.tsx |
| Overlay empire | `AtlasEmpire` | atlas-components.tsx |
| Stat choc | `AtlasCartouche` | atlas-components.tsx |
| Route caravane | `AtlasCaravane` | atlas-components.tsx |
| Vague propagation | `AtlasPropagationWave` | **À CRÉER** — spec ci-dessous |

### Spec AtlasPropagationWave (à créer dans `src/projects/atlas/_shared/`)

```tsx
interface AtlasPropagationWaveProps {
  cx: number;              // coordonnée SVG X du centre (poi.Sicile.x depuis pesteData)
  cy: number;              // coordonnée SVG Y du centre (poi.Sicile.y)
  rMax: number;            // rayon max en px SVG — assez grand pour couvrir Europe (~400)
  startFrame: number;      // frame de départ expansion (= ROUTES.PROPAGATION_START)
  stopFrame: number;       // frame où le rayon se fige (= PIVOTS.SAHARA_BOUCLIER)
  expandDuration: number;  // frames pour aller de r=0 à rMax (stopFrame - startFrame)
  clipPathId: string;      // ID du clipPath Sahara (depuis pesteData.saharaPath)
  color?: string;          // défaut "#8B0000"
  opacity?: number;        // défaut 0.35
}
```

**Comportement :**
- Phase 1 (startFrame → stopFrame) : `r` passe de 0 à `rMax` via `interpolate(..., 'clamp')`
- Phase 2 (stopFrame → fin) : `r` figé à `rMax` — vague bloquée visuellement
- Le `clipPath` Sahara masque la portion sud — la vague ne traverse pas le désert
- `saharaPath` est dans `pesteData.mercLarge.saharaPath` (et dans toutes les vues)

**Données nécessaires :**
```ts
import pesteData from "../../../../public/atlas/peste-1347/geo/peste-map-data.json";
const { propagationCenter, saharaPath } = pesteData.mercLarge;
// propagationCenter = { x, y } — coordonnées SVG de Sicile
// saharaPath = string SVG path polygone lat 15-20°N
```

---

## Règles de code (NON-NÉGOCIABLES)

1. **Audio-derived timing** : toujours `BEATS.X`, `CITIES.X`, `STATS.X` — jamais de valeur hardcodée
2. **Vue carte par beat** : importer depuis `pesteData.mercLarge / mercEurope / mercMali / mercSahara`
3. **Transitions entre vues** : interpolate scale + translateX/Y sur 40f max (pas de cut brutal)
4. **SFX** : déclencher via `<Audio src={sfx} startFrom={0} />` dans une `<Sequence>` au bon frame
5. **Sprites** : `staticFile("atlas/peste-1347/assets/...")` — pas de require() dans le composant
6. **R1** : chaque beat a au moins un changement visuel toutes les 8s max

---

## Storyboard de référence (généré Gemini 3.1 Flash — 2026-05-16)

6 images, 3 frames par beat. Chemins locaux :
```
public/atlas/peste-1347/storyboard/beat1-storyboard.png
public/atlas/peste-1347/storyboard/beat2-storyboard.png
public/atlas/peste-1347/storyboard/beat3-storyboard.png
public/atlas/peste-1347/storyboard/beat4-storyboard.png
public/atlas/peste-1347/storyboard/beat5-storyboard.png
public/atlas/peste-1347/storyboard/beat6-storyboard.png
```

**Notes d'artefacts à NE PAS reproduire dans le code :**
- Beat 3 Frame C : Gemini a écrit "77 000" au lieu de "7 000" → dans le code : "7 000"
- Beat 4 Frame A : stat en anglais "to cross the Sahara" → dans le code : tout en français
- Beat 5 Frame C : "22s total" imprimé = metadata Gemini → ignorer complètement

---

## Dette sources — à traiter lors de la composition finale

**Beat 4** : source intégrée (v10) — bandeau parchment bas écran, f527 → fin.
> *Parasites & Vectors, 2011 · Johns Hopkins University* — couvre biologie puce + chaleur sèche Sahara.

**Beats 1-2-3** : AUCUNE SOURCE intégrée à date. À ajouter lors de l'assemblage final.
Sources à utiliser :
| Beat | Affirmation à sourcer | Source recommandée |
|---|---|---|
| Beat 1 | "un tiers de l'Europe disparaît" | Britannica "Black Death" |
| Beat 2 | Origine Crimée → Sicile oct. 1347 | *Nature* 606, 2022 (Max-Planck) |
| Beat 3 | 46% Angleterre / 7 000 morts/jour Le Caire | Britannica + Al-Maqrizi (*Khitat*) |

Format à adopter : même composant parchment que Beat 4, bottom:28, fade-in 15f au moment de la stat principale.

---

## Ordre de code recommandé

1. Beat 1 (HOOK) — le plus simple, carte + titre
2. Beat 6 (PUNCHLINE) — simple, valide la structure composition
3. Beat 2 (SETUP GÉO) — vague propagation + markers
4. Beat 5 (MALI VIVANT) — Souleymane + route or
5. Beat 3 (DENSITÉ) — cartouches stats
6. Beat 4 (CLIMAX) — le plus complexe, laisser pour dernier
