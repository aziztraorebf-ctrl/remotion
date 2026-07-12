# R&D — Idées neuves pour 3 gaps Soudan Acte 3

> Recherche sur `_r-and-d-mapanimation-catalog.json` (89 templates, prompts tronqués à 400 caractères
> dans le fichier — c'est le maximum stocké, pas une limite de ma recherche), catalogues internes
> (`INTENTION-FORME-INDEX.md`, `COMPOSANTS-INDEX.md`, `warmap/_shared/`), et l'état RÉEL du code
> `SoudanActe3.tsx` (863 lignes, déjà en v3/v5 avec pas mal de décisions déjà tranchées et CODÉES).
> `out/_r-and-d/mapanimation/` n'existe pas (dossier absent, pas de clips à visionner).

**Découverte majeure avant tout** : les 3 "gaps" ne sont pas tous à l'état de gap — le code existant
est plus avancé que ce que le prompt suggère. Détail par section ci-dessous.

---

## PROBLÈME 1 — Caméra suiveuse immersive sur trajet longue distance

### Ce qui existe DÉJÀ dans le code (pas un gap, un outil à exploiter/régler)

Deux implémentations distinctes de la même idée coexistent dans le repo :

**A. `cameraFollowsPath()` — `src/projects/warmap/engine/SoudanWarMapEngine.tsx` lignes 88-112**, DÉJÀ
utilisée en production dans `SoudanActe3.tsx` (lignes 470, 481, 498, 639) :
```ts
export function cameraFollowsPath(waypoints: [number, number][], t: number, zoom: number): CamKey {
  const clamped = Math.max(0, Math.min(1, t));
  const totalSegments = waypoints.length - 1;
  const targetIdx = clamped * totalSegments;
  const floorIdx = Math.min(totalSegments - 1, Math.floor(targetIdx));
  const frac = targetIdx - floorIdx;
  const a = waypoints[floorIdx];
  const b = waypoints[floorIdx + 1] ?? waypoints[floorIdx];
  return { f: 0, lon: a[0] + (b[0]-a[0])*frac, lat: a[1] + (b[1]-a[1])*frac, zoom };
}
```
Commentaire dans le code lui-même : référence explicite à `_incoming/silk road 2.mov` (existe sur
disque, NE PAS SUPPRIMER) comme cible ("zoom serré en PERMANENCE sur le point courant du trajet, JAMAIS
de vue d'ensemble"). `SoudanActe3.tsx` l'utilise déjà avec un `blendCam()` (transition douce entre mode
"follow" et mode "reste sur destination") aux lignes 476/486/513.

**B. `GoldRouteAtlasZoom.tsx` — `src/projects/_shared/templates/travel-map/GoldRouteAtlasZoom.tsx`**
(9:16, projet Atlas, PAS Mapbox — SVG/d3-geo pur maison). Mécanisme différent et à mon sens PLUS
"immersif" que A parce qu'il combine 3 effets simultanés au lieu d'un seul :
```ts
const camScale = interpolate(frame, [0, 40, durationInFrames], [3.2, 4.0, 4.6], { extrapolateRight: "clamp" });
const driftX = (W / 2 - leader[0]) * camScale;
const driftY = (H / 2 - leader[1]) * camScale;
// ...
const camTransform = `translate(${W/2+driftX} ${H/2+driftY}) scale(${camScale}) translate(${-W/2} ${-H/2})`;
```
Différences clés vs A qui valent d'être VOLÉES pour Soudan Acte 3 :
1. **Le zoom lui-même progresse dans le temps** (3.2→4.0→4.6), pas juste la position — ça crée une
   sensation d'accélération/resserrement progressif du "piège" qui se referme, pas juste un travelling
   plat à zoom constant.
2. **Les territoires traversés se teintent (or) au passage et RESTENT teintés** (vague persistante
   derrière le porteur) — la caméra suiveuse laisse une trace visible de "ce qui a déjà été parcouru"
   sans jamais montrer de vue d'ensemble. C'est un signal de progression qui ne casse pas le
   resserrement caméra (contrairement à un mini-map ou un dézoom final).
3. **Sprite en screen-space, carte en world-space** — le porteur/marqueur reste net (pas déformé par le
   scale SVG) car positionné en `position:absolute; left/top` calculés depuis les mêmes `camScale`/`drift`,
   tandis que la carte est dans un `<g transform="...scale(camScale)...">`. Directement transposable à
   Mapbox où le marqueur SVG overlay (`GeoFlowConnection`) est déjà en screen-space via `map.project()`.

### Idée neuve n°1 : combiner les deux — zoom qui SE RESSERRE progressivement, pas fixe

`cameraFollowsPath` (SoudanWarMapEngine) prend un `zoom` FIXE en paramètre. `GoldRouteAtlasZoom` prouve
que faire varier le zoom pendant le suivi (resserrement progressif) ajoute une sensation de tension
croissante que le zoom fixe n'a pas. Adaptation headless-safe directe : changer la signature de
`cameraFollowsPath(waypoints, t, zoom)` en `cameraFollowsPath(waypoints, t, zoomAt: (t:number)=>number)`
ou ajouter un 4e paramètre optionnel `zoomCurve` — aucune violation headless (c'est juste un nombre
interpolé de plus dans un calcul déjà frame-driven, `map.jumpTo()` reste inchangé).

### Idée neuve n°2 : trace persistante derrière le marqueur (vague de couleur qui reste)

`GeoFlowConnection` a déjà `persistAfterArrival` (le TRACÉ pointillé reste visible en fantôme) mais
PAS de "territoire teinté au passage" comme `GoldRouteAtlasZoom`. C'est un ajout headless-safe simple :
un overlay SVG supplémentaire qui, pour chaque pays/zone dont le centroïde est proche de la polyligne
`waypoints` ET dont le `t` du point le plus proche est `<= markerProgress`, dessine un `<path>` avec
`fillOpacity` croissante (déjà le mécanisme de `CountryColorLayer` dans `SoudanActe3.tsx` ligne 829,
mais piloté par la progression du marqueur au lieu d'un `atAbsolute` fixe). Réutilise `useClipFlags`
existant — pas de nouveau composant nécessaire, juste un nouveau déclencheur temporel.

### Catalogue concurrent — ce qu'il confirme (rien de radicalement neuf, mais valide la direction)

- **ID 184** (prompt intégral, 155 caractères — pas tronqué) : *"also show all tp1 to tp6 in dholera
  make a professional map animation that zoom on map and camera tracting the path of highway and
  showing all tTPS"* — confirme juste le besoin ("camera tracking the path"), aucune recette technique
  nouvelle (prompt utilisateur brut, pas un template raffiné).
- **ID 142** (Israel→Iran airstrike) : *"Icon Animation: Fighter jet icon launches from Israel toward
  Iran. Path: Use a curved arc flight path with a comet trail effect behind the jet. Camera: Pan along
  with the jet"* — "pan along with the jet" est la même idée que A/B ci-dessus, rien de plus précis
  dans le texte tronqué. Le "comet trail" (traînée qui s'estompe derrière, pas persistante) est
  l'OPPOSÉ de l'idée n°2 ci-dessus (territoire teinté qui RESTE) — les deux se justifient selon
  l'intention (traînée = vitesse/fugacité ; territoire teinté = accumulation/conséquence durable). Pour
  Soudan (l'or qui finance durablement les deux camps), la persistance est plus juste narrativement
  que la traînée fugace.
- **ID 96** (Silk Road) et **ID 264** (Globe→Macédoine) : prompts tronqués avant la description de la
  caméra elle-même — pas d'info exploitable au-delà du titre déjà connu.

**Verdict problème 1** : pas de recette concurrente neuve à copier. La vraie trouvaille est INTERNE
(`GoldRouteAtlasZoom.tsx`, projet Atlas, jamais croisé avec le pipeline Warmap/Mapbox) — un beat qui
suit un porteur avec zoom progressif + territoire qui se teinte au passage, déjà rendu et validé dans
un autre contexte. Recommandation concrète : porter le duo "zoom progressif + persistance couleur" de
`GoldRouteAtlasZoom` vers `cameraFollowsPath`/`GeoFlowConnection` (Mapbox), PAS repartir de zéro.

---

## PROBLÈME 2 — Transformation visuelle forte (or → drones à mi-parcours)

### Ce qui existe DÉJÀ : deux briques à combiner, aucune ne fait le morph de FORME seule

**A. `GeoFlowConnection.markerColorTransition`** (`src/projects/warmap/_shared/GeoFlowConnection.tsx`
lignes 48-52, 185-190) — bascule COULEUR au franchissement d'un seuil `beforeT`. Déjà utilisé dans
`SoudanActe3.tsx` ligne 562 : `markerColorTransition={{ beforeT: 0.02, colorBefore: GOLD, colorAfter: METAL }}`.
**Limite** : change la couleur, PAS la forme/silhouette. Le marqueur reste un `dot`/`diamond`/`drone`
figé, sans transition visuelle de silhouette.

**B. `MetamorphoseFiduciaire.tsx`** (`src/projects/_shared/components/layouts/MetamorphoseFiduciaire.tsx`)
— **C'EST la brique de morph qui manquait**, jamais croisée avec `GeoFlowConnection`/warmap. Mécanisme
100% headless-safe (SVG pur, `interpolate`/`spring`, zéro CSS transition) :
1. Symbole A (`₣`) visible, fade out (frame 40-80).
2. "Gouttes d'encre" (15 cercles avec springs échelonnés par `delay`) qui grandissent en éventail —
   effet transitoire, pas de particules DOM, juste des `<circle>` SVG avec `r` interpolé par spring.
3. Un `clipPath` circulaire (`<circle r={clipRadius}>`, rayon interpolé 0→550 sur frame 80-120) révèle
   progressivement le Symbole B (`¥`) dans une couleur différente — **exactement le mécanisme "wipe
   circulaire par clipPath" qu'on veut pour un morph or→drone**, juste avec du texte au lieu de silhouettes.

### Idée neuve : combiner B (mécanisme clipPath+gouttes) avec des silhouettes SVG au lieu de glyphes texte

Le morph "or devient drones" n'a pas besoin d'un nouveau composant — c'est `MetamorphoseFiduciaire`
avec `symbolA`/`symbolB` remplacés par deux `<path>` SVG (lingot stylisé vs silhouette drone, déjà
dessinée dans `GeoFlowConnection.tsx` lignes 229-238 comme `markerIcon="drone"`, et un pictogramme
"lingot" existe déjà — `PICTO_GOLD` référencé dans `SoudanActe3.tsx` ligne 786/826). Adaptation :
- Remplacer les deux `<text>` de `MetamorphoseFiduciaire` par les deux `<g>` SVG existants
  (`PICTO_GOLD` et le path drone de `GeoFlowConnection`).
- Positionner ce mini-morph AU POINT du marqueur (`markerPos.x/y` de `GeoFlowConnection`) au lieu de
  centre-écran fixe (960,540) — donc le sortir en composant séparé prenant `x`/`y`/`triggerFrame` en
  props, déclenché quand `markerProgress` franchit le seuil de transformation.
- Les "gouttes d'encre" (15 cercles, taille max 18-35px dans l'original plein écran) doivent être
  réduites d'échelle (le marqueur fait ~7-24px sur la carte, pas 1920×1080) — paramétrer `DROPS` en
  fonction d'un `scale` prop plutôt que coordonnées absolues.
- Durée : l'original dure 150 frames (5s à 30fps) pour un plein écran — à mi-parcours d'un trajet de
  ~90 frames (le timing typique `GeoFlowConnection` dans `SoudanActe3.tsx`), il faut compresser à
  ~20-30 frames pour ne pas dominer le beat. Le mécanisme (spring delays + clipPath radius) scale
  linéairement, donc juste réduire toutes les frames de delta proportionnellement.

Ceci est **headless-safe par construction** : 100% SVG (`<circle>`, `<clipPath>`, `<path>`), aucun
`filter:blur` CSS, aucune particule DOM, springs et interpolate frame-driven — le composant source
est déjà conforme, aucune adaptation de contrainte nécessaire, seulement un changement d'échelle/contenu.

### Catalogue concurrent — rien de neuf trouvé sur la transformation de forme

Recherche exhaustive : zéro résultat pour `morph`, `transform`, `turns into`, `becomes`, `convert`,
`shape-?shift`, `dissolve into` dans les 89 prompts (même en tenant compte de la troncature à 400
caractères — la plupart des templates militaires/géopolitiques n'ont pas ce besoin, ils gardent le même
sprite du début à la fin d'un trajet, ex. ID 142 "Fighter jet icon launches... Path: curved arc...").
**Aucun template mapanimation.io ne fait de transformation d'objet en cours de trajet.** C'est un vrai
angle mort chez eux, pas juste un oubli de recherche de ma part.

**Verdict problème 2** : la solution est un mariage de deux briques internes déjà codées et validées
séparément (`MetamorphoseFiduciaire` pour le MÉCANISME de morph, `GeoFlowConnection` + pictogrammes
existants pour le CONTENU/position) — jamais combinées avant. Aucune idée externe à emprunter, le
concurrent ne fait pas ça.

---

## PROBLÈME 3 — Split-screen final avec substance

### État réel du code : le split-screen "substantiel" existe DÉJÀ en composant, mais N'EST PAS utilisé dans Acte 3

**`WarMapSplitScreen.tsx`** (`src/projects/warmap/_shared/WarMapSplitScreen.tsx`) — composant PRODUCTION
(promu R&D, "validé Aziz 2026-06-14"), gère 2 OU 3 volets avec :
- `ratios` animés par volet (pas forcément 33/33/33 — peut mettre le volet central plus large).
- Ouverture séquencée (`panelAppearAt` par volet, chaque volet glisse depuis son bord).
- **`connector`** — render-prop qui dessine PAR-DESSUS toute la largeur, traversant la séparation entre
  volets (ex. un fil qui relie visuellement les 2-3 mondes malgré la coupure spatiale).
- Chaque volet est un render-prop indépendant `(w,h) => ReactNode` — peut contenir une VRAIE carte
  Mapbox par volet, pas juste une image statique.

Le breakdown (`memory/projects/soudan-midform-ACTE3-BREAKDOWN.md`, Décision 4) documente EXPLICITEMENT
qu'Aziz a rejeté une 1ère tentative de panneaux flottants (`Acte3DashboardTest.tsx`, obsolète) en
demandant "le pattern déjà utilisé pour un short Sénégal... un VRAI split-screen à 3 volets" via
`WarMapSplitScreen`. Or le code ACTUEL (`SoudanActe3.tsx` ligne 711, commentaire du dev précédent) dit :
> *"PAS WarMapSplitScreen (redimensionner la vraie Mapbox Soudan dans un panel 1/3 casserait tous les
> overlays enfants câblés 1920x1080 — testé, écarté)."*

C'est une contradiction non résolue entre la décision documentée (utiliser `WarMapSplitScreen`) et
l'implémentation réelle (contournement par overlay glissant, pas un vrai split structurel) — à signaler
à Aziz avant de coder quoi que ce soit d'autre, indépendamment des idées ci-dessous.

### Idée neuve n°1 : volet central = Mapbox nativement redimensionné (pas la carte 1920×1080 réutilisée)

Le blocage noté ("overlays enfants câblés 1920x1080") vient du fait que `SoudanWarMapEngine` a déjà
`width`/`height` en props (`SoudanWarMapEngine.tsx` lignes 172-175 : *"utile pour poser la carte dans un
panel réduit (ex. volet central d'un WarMapSplitScreen, beat 7 Acte 3) sans casser les usages plein
écran"*) — **le moteur a déjà été préparé pour ce cas d'usage exact**, mais les enfants (`GeoFlowConnection`,
`ImpactPictogram`, etc.) reçoivent `proj()` (fonction de projection) qui elle-même dépend de la carte
réduite — donc en théorie ça devrait suivre. Le blocage réel est probablement les composants enfants qui
ont des tailles absolues codées en dur (`markerSize`, offsets de texte) pensées pour un cadre plein écran,
pas la logique de projection elle-même. **Piste concrète non testée** : instancier une DEUXIÈME
`SoudanWarMapEngine` (ou une carte Mapbox minimale sans les jetons/pictogrammes complexes, juste les
`ZoneControl`/highlights) à l'intérieur du volet central de `WarMapSplitScreen`, avec `width`/`height`
réduits — sans les enfants complexes qui posent problème, seulement le fond carte + halos.

### Idée neuve n°2 : les volets latéraux montrent un FLUX chiffré (pas juste drapeau+silhouette+2 faits)

Le split actuel (`SIDE_PANELS` dans `SoudanActe3.tsx`) montre : silhouette pays + drapeau clippé + icône
+ 2 faits textuels. C'est déjà pas mal mais reste de la DESCRIPTION statique. Idée pour ajouter de la
substance comparative (ce que demande le prompt : "comparaison de flux, de montants, de trajectoires") :
brancher `StatComparisonGrid.tsx` (`src/projects/_shared/components/layouts/StatComparisonGrid.tsx`) —
composant DÉJÀ CODÉ pour "X vs Y" avec count-up odometer + crosshair corners + accent color par côté —
comme COUCHE SUPPLÉMENTAIRE par-dessus les 2 volets latéraux de `WarMapSplitScreen` (ou fusionné dans
`SidePanelTerritory`) pour afficher un chiffre qui COMPTE (ex. "$X milliards via EAU" à gauche vs "Y
livraisons de drones" à droite) au lieu de texte factuel statique. `StatComparisonGrid` a déjà le
mécanisme de count-up (`isPureNumeric` + `interpolate` sur la valeur), juste besoin de le rendre en
half-width (`leftStat`/`rightStat` seuls, pas les deux dans le même appel) dans chaque volet.

### Idée neuve n°3 : le `connector` de `WarMapSplitScreen` pour montrer "le même or paie les deux côtés"

Le breakdown note (ligne "Beat 6... c'est le point du texte : le même or paie les deux côtés du front")
— c'est EXACTEMENT le cas d'usage du prop `connector` de `WarMapSplitScreen` (*"un fil/lien qui TRAVERSE
la séparation, ex. la parité CFA qui relie les 2 mondes"*), jamais exploité dans Acte 3 actuellement. Un
connector qui dessine un trait or partant du volet central (Soudan) et se divisant en 2 branches vers
chaque volet latéral (EAU et Turquie) rendrait visuellement l'idée "un seul flux, deux destinations" —
plus fort qu'un split qui montre juste 3 blocs indépendants côte à côte sans lien visuel entre eux.

### Catalogue concurrent — pas de vrai split-screen chez eux

Recherche exhaustive : **zéro résultat** pour `split`, `side.by.side`, `comparison`, `versus`, `dual`,
`panel`, `two panels` dans les 89 prompts (titres ET prompts). Seul hit indirect : **ID 72** — *"street
view map 0–4s cinematic zoom into India... → 12–15s slow zoom-out keeping both centered"* — titre
"Dual Slow Zoom-Out" mais le prompt (intégral, 155 caractères, pas tronqué) décrit juste UNE carte avec
2 pays cadrés ensemble à la fin, PAS un split-screen structurel à volets séparés. **mapanimation.io n'a
aucun template split-screen** — leur format est mono-carte du début à la fin, cohérent avec le constat
déjà écrit dans `memory/archive/_r-and-d-mapanimation-ANALYSE-2026-06-03.md` (§3 AXE A/B) qui ne liste aucun split dans leur
catalogue. Ce n'est pas un gap de recherche, c'est une case vide chez eux.

**Verdict problème 3** : rien à emprunter au concurrent (ils n'ont pas ce pattern). La vraie voie est
de résoudre la contradiction interne (décision documentée "utiliser WarMapSplitScreen" vs code actuel
qui le contourne), puis enrichir avec 2 briques déjà prêtes (`StatComparisonGrid` pour le chiffre qui
compte, `connector` de `WarMapSplitScreen` pour montrer visuellement "un flux, deux destinations" —
tous deux jamais utilisés dans ce beat jusqu'ici).

---

## Résumé actionnable (priorité recherche → code, PAS decidé ici)

| Problème | Rien de neuf chez le concurrent | Vraie trouvaille (interne, jamais croisée) |
|---|---|---|
| 1. Caméra suiveuse | Confirmé (ID 184, 142 — juste "pan along", aucune recette) | `GoldRouteAtlasZoom.tsx` (zoom progressif + territoire teinté persistant) à croiser avec `cameraFollowsPath` (Mapbox) déjà en prod |
| 2. Transformation or→drone | Confirmé absent (0 hit morph/transform/becomes sur 89 prompts) | `MetamorphoseFiduciaire.tsx` (mécanisme clipPath+gouttes) à recycler avec silhouettes SVG existantes au lieu de glyphes texte, positionné au point du marqueur `GeoFlowConnection` |
| 3. Split-screen substantiel | Confirmé absent (0 hit split/panel/dual/comparison) | `WarMapSplitScreen.connector` (jamais utilisé) + `StatComparisonGrid` (jamais branché dans ce beat) — ET une contradiction à trancher : le breakdown dit "utiliser WarMapSplitScreen", le code actuel dit "écarté, testé" — à clarifier avec Aziz avant de coder |

Tous les mécanismes proposés sont 100% SVG/DOM frame-driven (`interpolate`/`spring`/`useCurrentFrame`),
aucun ne viole la contrainte headless-safe — ce sont des recombinaisons de composants déjà conformes,
pas de nouvelles briques à inventer.
