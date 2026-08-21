# ARSENAL DE SCÈNE — fiche de déclenchement (lire AVANT de dessiner quoi que ce soit à la main)

> **Pourquoi cette fiche existe** : les autres fiches enseignent la MÉTHODE (caméra, SVG, storyboard).
> Aucune ne disait ce qu'on POSSÈDE. Coût mesuré le 2026-08-21 (gabarit client Zambie) : scène codée
> avec des `<circle>` dessinés à la main alors que `GisementMarker` (5 variantes, halo, anti-collision,
> taille pilotée par le zoom) existait et était **utilisable tel quel**. Livrable jugé « prototype »
> par Aziz, à refaire. La règle « ne jamais re-coder un effet qui existe » était écrite dans CLAUDE.md
> depuis des mois — écrite ne suffit pas, il faut la poser sous les yeux au moment où on code.
> ⚠️ Si ce que tu lis ici ne correspond PAS au code sous tes yeux : **c'est la fiche qui a tort**. Corrige-la.
> Chemins vérifiés sur disque (`ls` + compilation) : 2026-08-21.

## LA QUESTION À SE POSER AVANT D'ÉCRIRE UN `<circle>` OU UN `<rect>`

**« Est-ce que je suis en train de redessiner à la main quelque chose qu'on a déjà ? »**
Aziz ne mémorise pas 70+ composants — moi si, c'est mon travail. Un `<circle>` posé à la main sur une
carte est presque toujours un jeton qui s'ignore.

---

## 1. POSER UN POINT / UN MARQUEUR SUR UNE CARTE

⭐ **`GisementMarker`** — `src/projects/_shared/mapbox/GisementTokens.tsx`
Hexagone navy + liseré or + halo respirant + ombre. 5 `kind` : `sonar` | `gas` | `oil` | `flag` | `seal`.

⭐⭐ **N'IMPORTE PAS `mapbox-gl` malgré son chemin** (vérifié : seuls imports = React + ses SVG).
Il reçoit `(x, y)` **déjà projetés** → **utilisable en D3 comme en Mapbox**. C'est le pont le plus court
entre les deux moteurs. Passer `zambiaGeo.project()` ou `map.project()`, indifféremment.

- `kind="sonar"` et `kind="seal"` sont **self-contained, zéro asset externe** — le bon choix quand le délai est court.
- ⛔ **Le prop `zoom` est optionnel en TypeScript mais obligatoire en pratique** : `sizeFactor` reste
  bloqué à 1 sans lui (`zoom == null ? 1 : ...`, ligne 164) et les jetons s'agglutinent au dézoom.
  En D3 (pas de `getZoom()`), fabriquer un zoom synthétique à partir de l'échelle de projection.
- ⛔ Passer un `uid` unique par jeton, sinon collision de `clipPath` entre jetons `fill`.
- Le jeton ne calcule PAS sa position : le parent reprojette **chaque frame**.

Voir aussi : `GeoCountryPlaque.tsx` (plaque déportée + leader fléché vers le point).

## 2. HABILLAGE ÉDITORIAL / CARTOUCHE

⭐ **`DiscFrame.tsx`** — `src/projects/_shared/components/DiscFrame.tsx`
`DiscContent` + `DiscRing` : disque qui accueille un contenu + anneau lumineux qui se referme
(draw-on `strokeDashoffset`). **Agnostique du moteur, entièrement paramétré** (`stroke`/`glow`/`background`
passés par l'appelant) — le seul du lot sans charte hardcodée. Extrait après 2 réimplémentations indépendantes.

⚠️ **Doublon de nom** : `_client-sim/noteshield/ui/DiscFrame.tsx` existe aussi (version cyan d'origine).
Toujours importer la version `_shared`.

Autres briques : `ui/` (`Badge`, `CountUp`, `GoldLine`, `SVGGrain`), `inserts/` (`BigStat`, `DataCard`,
`KraftCard`), `overlays/SourceTag`.
⚠️ `PortraitEditorial.tsx` compile mais est **hardcodé 1920×1080** (constantes de position) et quasi-dormant.

## 3. EFFET VIVANT SUR CARTE (Mapbox uniquement)

Catalogue complet **avec preview vidéo par template** : `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md`.

| Besoin | Composant |
|---|---|
| N entités s'allument chacune sur son beat | ⭐ `SequentialBorderPulse.tsx` |
| Idem + drapeau dans chaque silhouette | `SequentialFlagReveal.tsx` |
| Un territoire qui respire | `PulsingRegionFill.tsx` |
| Propagation par vagues | `DominoContagionFill.tsx` |
| Isoler/spotlight une zone | `MapboxIsolateZone.tsx` |
| Quitter la carte puis y revenir | ⭐⭐ `MapCutaway.tsx` (« le + réutilisable ») |
| Image drapée sur le terrain 3D | `MapboxCountryFlagDecal.tsx` |

⛔ `MapboxCountryFlagDecal` s'injecte **une seule fois** (`doneRef`) : incapable d'apparition
séquentielle ou de changement en cours de scène. Il lit `countries-50m.json` = niveau **pays**, pas admin-1.
⛔ `MapboxFlagFill` / `drawFlagCanvas` : **bannis dès qu'il y a du pitch** (dérive prouvée).

## 4. CAMÉRA — voir `FICHE-CAMERA.md`

⛔⛔ **La « caméra continue » n'est PAS une brique** : `camFor`/`lerpCam`/`buildFullPathSamples` sont
copiés-collés dans 3 fichiers, jamais extraits. Ne pas chercher un composant — reprendre le mécanisme
de `GazoducActe2AAGP.tsx` ou `SenegalActe2Continu.tsx`.

⛔⛔ **Jamais keyframes + `easeInOut` par segment** pour un mouvement continent→pays : dérivée nulle aux
deux bouts = la caméra **s'arrête** à chaque keypoint (mesuré `v=0.00 px/f`, 3 itérations perdues).
Zoom monotone + centre interpolé en continu. Globe D3 : **`camAtContinu()`**, jamais `camAt()`.

## 5. GLOBE / OUVERTURE CONTINENTALE

`src/projects/_rnd/d3-16x9/globeGeo.ts` + `globeCamera.ts` — socle D3, 12 fichiers en dépendent.
`_shared/components/inserts/GlobeCountryReveal.tsx` (9:16, exige que l'appelant calcule `countryPath`).
⚠️ `globeGeo.ts` fait un import **statique** d'un JSON sous `public/` (gitignoré) : absent d'un clone frais = erreur de build.

---

## PIÈGES D'IMPORT VÉRIFIÉS

- **`GeoFlowConnection` existe en 3 exemplaires**, contrats opposés :
  `warmap/_shared/` = marqueur nu, **publié** (5 importeurs) · `_shared/mapbox/` = scène autonome qui crée
  sa propre Map, **0 importeur** · `warmap/GeoFlowConnectionTest.tsx` = banc d'essai.
  **Toujours nommer le chemin complet.**
- **Ne compilent pas** (dérive de l'API `mapbox-gl`) : `GlobalPulse.tsx`, `GoldVein.tsx`, `LoomWeaver.tsx`.
- **Archivés, pas disponibles** : tout sprite raster géo-ancré (`geoSprite.ts`, `spritePlayer.ts`).
  Il n'existe **aucun** système de sprite raster géo-ancré vivant → passer par `GisementMarker` mode `fill`.
- **`src/projects/_demos/` = ZONE GELÉE** : ne pas s'en inspirer comme source de vérité.
- `public/_shared/ASSETS-INDEX.md` a **3 mois de retard** — ne connaît ni jetons, ni decal, ni globe D3.

## VÉRIFIER AVANT DE PARTIR SUR UNE BRIQUE
```bash
ls <chemin> && git ls-files <chemin>          # existe ET versionné ?
find src -name "<Nom>*" | grep -v _archive     # 2 résultats = piège d'import
```
Un catalogue qui affirme une ABSENCE est faillible : un registre « canonique » peut vivre sur une branche
R&D jamais mergée (4 occurrences constatées).
