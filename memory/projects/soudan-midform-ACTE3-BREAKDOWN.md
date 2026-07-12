---
name: soudan-midform-ACTE3-BREAKDOWN
description: Breakdown technique beat-par-beat de l'Acte 3 Soudan ("Suivre l'or") — coordonnées géo, camKeys, composants, frames exactes. Base directe pour écrire SoudanActe3.tsx.
metadata:
  type: project
---

# BREAKDOWN TECHNIQUE — SOUDAN ACTE 3 « SUIVRE L'OR »

> Source : script v7 (`soudan-midform-ACTE3-SCRIPT.md`) + timing (`soudanActe3Timing.ts`).
> Socle : `SoudanWarMapEngine.tsx` (camKeys/zones/highlights/children) + `soudanActors.tsx` (SoudanToken/SoudanBase/SoudanTrail).
> Nouveau composant à coder AVANT le beat : `GeoFlowConnection` (specs en fin de doc).
> ⭐⭐ **v2 DE MISE EN SCÈNE (post-render v3, retour Aziz + jury Kimi/Gemini 2026-07-09)** — voir section
> dédiée juste en dessous. Le reste du document (v1) garde sa valeur pour coordonnées/composants/assets,
> mais la mise en scène caméra + feedback flèches + beat 7 sont RÉVISÉS par la section v2. Texte du script
> v7 INCHANGÉ — seule la mise en scène carte change.

---

## ⭐⭐⭐ RÉVISION v2 — MISE EN SCÈNE (2026-07-09, post-render v3)

> Déclenchée par : render v3 jugé "dézoom vide" en fin d'acte + flèches "mortes" (2 avis indépendants,
> Kimi ET Gemini, convergents sur le diagnostic). Comparatif complet des 2 avis + arbitrage Aziz : voir
> conversation session 2026-07-09. Gemini jugé plus fort sur les 3 points de divergence (caméra suiveuse,
> feedback nommé aux impacts, rupture de registre en climax) — direction retenue.

### Décision 1 — Caméra SUIVEUSE plutôt que dézoom qui recule (Gemini, validé Aziz)

**Constat** : le v3 recule la caméra à chaque beat pour tout montrer d'un coup (Soudan+Dubaï+Ankara
simultanés) → à l'échelle finale, tout est minuscule et statique, "de l'information diluée dans de
l'espace vide" (Kimi). Ta propre remarque : le dézoom est trop agressif, pas nécessaire d'aller jusqu'au
monde entier.

**Nouveau principe** : la caméra ACCOMPAGNE le marqueur en mouvement au lieu de reculer pour anticiper
sa destination. Beats 3/4/5 redécoupés en micro-travellings :
- **Beat 3 (Darfour→Dubaï)** : la caméra PIVOTE/GLISSE en suivant le marqueur doré le long de son
  trajet (pas un dézoom statique qui montre Dubaï dès le départ) — zoom resserré sur le segment de
  courbe actif, pas sur toute la carte. Cadrage max ~zoom 3.2-3.5 (JAMAIS le zoom mondial ~2.0 du v3).
- **Retour caméra sur le Soudan entre chaque trajet** (repris de la reco Kimi "revenir sur le Soudan
  entre chaque connexion, ne pas laisser le spectateur perdu") — après l'arrivée à Dubaï (beat 3→4) et
  après l'arrivée à Suakin/SAF (beat 5→5bis), la caméra RE-RESSERRE sur le Soudan avant de repartir vers
  la connexion suivante. Ça ancre chaque flèche dans son point de départ soudanais plutôt que de laisser
  le spectateur dériver dans l'espace international.
- **Cadrage max jamais mondial** : borne dure `zoom >= 3.0` sur tout l'acte (contre ~1.9-2.0 en fin de
  v3). Si Ankara/Dubaï ne tiennent pas dans le cadre en même temps que le Soudan à ce zoom, c'est
  ACCEPTABLE — la caméra suiveuse résout ce problème en ne montrant qu'UN trajet à la fois, jamais besoin
  de cadrer les 2 extrêmes simultanément sauf au beat 6 (synthèse, seul moment de vue large volontaire).

### Décision 1bis — Référence concrète : "Silk Road 2" + faisabilité `cameraFollowsPath` (2026-07-09 tard)

Aziz a retrouvé une référence vidéo précise pour la Décision 1 : le template "Silk Road Trade Route"
(mapanimation.io, catalogue #96 — déjà analysé `memory/archive/_r-and-d-mapanimation-ANALYSE-2026-06-03.md` L47-53) existe
en 2 variantes, dans `_incoming/silk road 1.mov` et `silk road 2.mov` (NE PAS SUPPRIMER, référence
essentielle pour coder cette décision) :
- **Silk Road 1.mov** : dézoom qui S'OUVRE progressivement pour révéler tout le trajet au fur et à mesure
  qu'il s'allonge (proche de ce qu'on avait déjà au v1/v3 — PAS la bonne référence).
- **Silk Road 2.mov** : vraie **caméra suiveuse** — zoom serré en PERMANENCE sur le point courant du
  trajet en train de se tracer, la carte défile sous le trajet, JAMAIS de vue d'ensemble. **C'est LA
  référence à viser pour la Décision 1.**

Ce gap ("marqueur animé + camera follow") était déjà noté en mémoire R&D comme jamais comblé
(`memory/archive/_r-and-d-mapanimation-ANALYSE-2026-06-03.md` L53 : "extension de GeoFlowConnection") — cette session confirme
le besoin avec une référence précise au lieu d'une note abstraite.

**Faisabilité vérifiée (pas de blocage technique)** : `camAt()` (`SoudanWarMapEngine.tsx`) interpole déjà
n'importe quelle séquence de `CamKey` frame par frame — rien n'empêche de calculer une `CamKey` DYNAMIQUE
à partir de la position courante du marqueur `GeoFlowConnection` au lieu d'une séquence figée à l'avance.
**À coder à la reprise** : une fonction `cameraFollowsPath(waypoints, t, zoom)` qui interpole la position
lon/lat du marqueur sur son trajet (logique proche de `pointAt()` déjà dans `GeoFlowConnection.tsx`, mais
en coordonnées géo plutôt qu'en pixels projetés) et construit la `CamKey` de la frame courante avec ce
lon/lat comme centre + un zoom fixe resserré (~5-6, calibré sur l'impression Silk Road 2). Aucun nouveau
composant Mapbox nécessaire — juste cette fonction de calcul, réutilisable pour tout futur beat
"suivre un trajet" (brique générique, pas un hack ponctuel Acte 3).

### Décision 2 — Feedback nommé à chaque impact (Kimi + Gemini convergents, précision Gemini retenue)

**Constat** : une flèche qui touche un pays et "silence graphique" ensuite — pas de raison visible.

**Nouveau principe** : à CHAQUE arrivée de marqueur sur un pays/jeton, une micro-réaction de 2-3s
(apparaît puis disparaît — PAS de widget permanent, décision Aziz explicite) :
- **Arrivée à Dubaï (fin beat 3)** : le marqueur doré s'arrête, un petit pictogramme SVG (pas un sprite
  raster — cf décision 3) apparaît brièvement à côté : lingots/pièces stylisées, puis s'estompe avant que
  le marqueur reparte transformé (beat 4).
- **Arrivée du marqueur gris-métal sur le jeton RSF (fin beat 4)** : pulse du halo RSF (déjà en place v3)
  + un pictogramme drone minimaliste apparaît 2-3s au-dessus du jeton Hemedti, puis disparaît.
- **Arrivée du marqueur losange sur le jeton SAF en provenance d'Ankara (beat 5)** : même principe,
  pictogramme drone (variante bleu SAF) au-dessus du jeton al-Burhan, 2-3s puis disparaît.
- **Suakin** : le point s'allume comme prévu v1 (pas de pictogramme supplémentaire ici — l'objet
  isométrique dock EST déjà le feedback visuel).
- Chaque pictogramme = un jeton SVG contrôlé en code (voir décision 3), pas un asset Gemini par icône —
  coût nul, contrôle total du timing d'apparition/disparition.

### Décision 3 — Jetons SVG maison (GLM 5.2 si besoin de formes complexes, sinon SVG à la main)

Proposition Aziz, cohérente avec les 2 avis (Gemini : "tout est géré en pur SVG" ; Kimi : icônes
symboliques). Les pictogrammes (lingots, drone RSF, drone SAF) sont des **formes SVG simples**
(2-4 paths géométriques, style encre cohérent avec `GeoFlowConnection`/`SoudanToken`) codées directement
en JSX — PAS besoin de GLM 5.2 pour des formes aussi simples (un drone stylisé = un triangle + 2 ailes,
un lingot = un trapèze avec reflet). **Réserver GLM 5.2** pour le jour où on aura besoin d'une forme SVG
plus riche/organique (le workflow existe, cf `tools/openrouter-svg.md`, mais ne pas l'invoquer pour 3
pictogrammes géométriques simples — sur-ingénierie inutile).

### Décision 4 — Beat 7 : VRAI split-screen 3 volets via `WarMapSplitScreen` (RÉVISÉ 2e fois, à trancher)

> ⚠️ **ERRATUM (session 6, 2026-07-10)** : `WarMapSplitScreen` a finalement été TESTÉ et ÉCARTÉ pour ce
> beat — redimensionner la vraie carte Mapbox Soudan dans un panel 1/3 casse tous les overlays enfants
> câblés en dur pour un cadre 1920×1080 (`GeoFlowConnection`, `ImpactPictogram`, etc.). Le code réel
> (`SoudanActe3.tsx`, composant `Acte3SideFlags`) utilise une approche différente : la carte plein écran
> reste inchangée en fond, 2 volets glissent depuis les bords par-dessus (silhouette d3-geo + drapeau
> clippé). ⛔ Piste "2e instance SoudanWarMapEngine réduite" TESTÉE et ÉCARTÉE (2026-07-11, session 7) :
> 2 Maps Mapbox WebGL simultanées = crash confirmé (`Error: Failed to initialize WebGL` sur la 2e Map,
> dès l'init) — limite dure de l'environnement de rendu, pas un problème d'enfants complexes. Panneaux
> glissants gardés et enrichis (connector convergent + sortie en étau). Détail complet (archivé) :
> `memory/archive/starters-perimes-2026-07-11/STARTER-PROMPT-soudan-acte3-v8.md` § clarification 2,
> `memory/episodes/soudan-midform/STATUS.md` § ACTE 3 FINAL.

> ⚠️ **CORRECTION 2026-07-09 tard** : la 1ère version de cette décision (ci-dessous archivée) décrivait
> des "2 panneaux SVG custom type plaque flottante" — Aziz a testé ce prototype (`Acte3DashboardTest.tsx`)
> et l'a REJETÉ : ce n'était pas un vrai split-screen, juste des cartouches qui flottent sur la carte.
> Ce qu'il veut : le pattern déjà utilisé pour un short Sénégal (Botswana/Norvège/Congo) — un VRAI
> split-screen à 3 volets. Le composant existe déjà en prod : `WarMapSplitScreen`
> (`src/projects/warmap/_shared/WarMapSplitScreen.tsx`, "production, promu depuis R&D, validé Aziz
> 2026-06-14", gère 2 OU 3 volets, chaque panneau = render-prop indépendant, connecteur optionnel qui
> traverse la séparation). **NE PAS recoder de composant panneau — utiliser `WarMapSplitScreen` tel quel.**

**Constat** : le cercle pointillé qui englobe Soudan-Dubaï-Ankara au dézoom final était déjà identifié en
interne comme le point le plus faible du breakdown v1 (ajouté faute de mieux). Les 2 avis + Aziz
convergent : mauvaise idée, remplacer. Le 1er remplacement tenté (panneaux flottants) était encore
insuffisant — pas un vrai changement de registre.

**Nouveau principe (à finaliser à la reprise, PAS encore tranché dans le détail)** :
- 3 volets via `WarMapSplitScreen` (orientation `"vertical"`, `panels: [gauche, centre, droite]`).
- **Volet central = probablement la carte Mapbox Soudan** (les 2 jetons RSF/SAF, zoom serré ~4.5-5),
  cohérent avec l'idée "le Soudan reste le sujet, pris en étau" déjà actée — mais PAS encore confirmé
  avec Aziz, à trancher en premier à la reprise.
- **Volets latéraux (EAU/Turquie)** : contenu ET registre encore ouverts — la question posée en fin de
  session ("Mapbox pour chaque volet vs 2D flat/SVG simple") n'a pas été tranchée, elle a été interrompue
  par la découverte de la référence vidéo Silk Road (cf Décision 1bis ci-dessous). À trancher à la reprise :
  soit 3 vraies vues Mapbox indépendantes (cohérence totale de registre, plus lourd), soit volets latéraux
  en 2D flat/SVG simple (mini-drapeau + pictogramme + mot-clé, pas de vraie carte — plus léger, suffisant
  vu que l'info à transmettre ne nécessite pas de géo précise pour "d'où ça vient").
- Registre = rupture pour le climax (cohérent contraste CARTE→INSERT déjà prouvé Acte 2). Pas de cercle,
  pas de dézoom mondial.
- `Acte3DashboardTest.tsx` (le prototype panneaux flottants) est OBSOLÈTE — approche rejetée, à refaire
  avec `WarMapSplitScreen`. Ses renders (`out/_rnd/acte3-dashboard/`) sans objet.

#### Archive — 1ère version de la décision (panneaux flottants, REJETÉE par Aziz après test)
<details>
Caméra stabilisée sur le Soudan seul + 2 panneaux SVG type plaque (inspirés `WarMapPlaque.tsx`) qui
glissent depuis les bords gauche/droite en overlay flottant sur la carte — testé isolément
(`Acte3DashboardTest.tsx`), rendu correct visuellement (lisible, cohérent style parchemin) MAIS ce n'est
PAS ce qu'Aziz demandait : il voulait un vrai split-screen structurel (écran divisé en 3 zones), pas des
cartouches flottantes par-dessus une carte unique. Le composant `WarMapSplitScreen` existait déjà et
aurait dû être utilisé depuis le début — gap de recherche avant de coder (à ne pas reproduire : chercher
un composant split-screen existant AVANT d'improviser un design de panneau custom).
</details>

### CE QUI NE CHANGE PAS vs v1
- Script texte v7 : AUCUNE modification.
- Beats 1-2-2bis (Darfour, mines, Jebel Amer/Hemedti) : déjà validés visuellement au v3, pas de retouche.
- Drapeaux pays en aplat de couleur (`CountryColorLayer`) : gardés, mais leur RÔLE change légèrement —
  ils ne sont plus la seule réponse au "dézoom vide" (la caméra suiveuse + pictogrammes portent
  maintenant l'essentiel de la vie visuelle), ils restent un renfort de lisibilité/mémoire.
- `GeoFlowConnection` (composant) : réutilisé tel quel, juste piloté différemment (progress/markerProgress
  calés sur des fenêtres plus courtes, caméra qui suit au lieu de tout montrer d'avance).
- Beat 6 (synthèse) : reste le seul moment de vue large volontaire (cadrer les flux ensemble) — cohérent,
  c'est le point du texte ("le même or paie les deux côtés du front").

## ⚠️ CONTRAINTE CAMÉRA — bbox par défaut du moteur est le Soudan seul

`SoudanWarMapEngine` a une caméra bornée à l'origine sur lon 21.8-38.6 (Soudan). L'Acte 3 doit montrer
**Dubaï (55.27°E)** et **Ankara (32.86°E, 39.93°N — bien au nord du Soudan)** : hors de ce cadrage serré.
Le moteur n'interdit rien en dur (camKeys est juste un tableau lon/lat/zoom passé en prop) — mais il faut
des `camKeys` avec un zoom bien plus large (~zoom 3-3.5 pour voir Soudan+Dubaï+Turquie simultanément) pour
les beats 3-7. **Décision de mise en scène** : ne PAS zoomer large en continu (perd la lisibilité "carte
serrée AES") — down zoomer PROGRESSIVEMENT à chaque beat qui en a besoin, re-zoomer serré ensuite si besoin
(mais l'acte reste globalement en dézoom croissant jusqu'au bout, cohérent avec le script).

## ⭐⭐ AJOUT v2 (retour Aziz 2026-07-09) — DRAPEAUX PAYS PROGRESSIFS (`useClipFlags`)

**Problème identifié** : le voile khaki (`SoudanWarMapEngine`, assombrit tout ce qui n'est PAS le Soudan)
est conçu pour un cadrage SERRÉ sur le Soudan seul — c'est ce qui le rend lisible. Mais l'Acte 3 dézoome
large (Dubaï, Ankara, Égypte tous visibles), et à cette échelle le voile devient un immense aplat kaki
terne qui aplatit la carte au lieu de l'isoler. Constat Aziz : "ça devient un peu plate".

**Solution retenue** : à chaque fois qu'un `GeoFlowConnection` touche/nomme un PAYS (pas un lieu ponctuel
comme une mine ou Suakin), le drapeau de ce pays se COLORIE dans sa silhouette — et RESTE affiché jusqu'à
la fin de l'acte (jamais de fade-out). Ça compense le voile terne par de la couleur qui s'accumule au fil
du récit, et ça renforce la lisibilité : chaque pays nommé devient repérable durablement sur la carte, pas
juste un point qui clignote et disparaît.

- **Composant** : `useClipFlags` + `<ClipFlagsLayer>` (`src/projects/_shared/mapbox/useClipFlags.tsx`).
  PAS `MapboxCountryFlagDecal` (réservé aux cartes avec pitch — `SoudanWarMapEngine` est fixé `pitch: 0`
  en dur, donc `useClipFlags` est le bon outil ici, zéro dérive à plat).
- **4 drapeaux ajoutés** (`public/_shared/flags/`, récupérés Wikimedia Commons SVG → converti PNG 640px
  via `rsvg-convert`, 2026-07-09) : `ae.png` (Émirats), `tr.png` (Turquie), `eg.png` (Égypte), `sd.png`
  (Soudan — pas utilisé dans l'Acte 3 car le Soudan reste en mode "carte parchemin" tout du long, gardé
  en stock si besoin futur).
- **Séquencement** (`at` = frame d'allumage, synchronisé au moment où le `GeoFlowConnection` touche/nomme
  le pays — PAS avant, cohérent règle R-V5) :
  - EAU (`ae`) : `at` = frame où le marqueur or ARRIVE à Dubaï (fin beat 3, ~frame 1534) — le pays qui
    REÇOIT l'or se colorie le premier.
  - Turquie (`tr`) : `at` = frame où le marqueur drone ARRIVE sur le jeton SAF en provenance d'Ankara
    (fin beat 5, ~frame 2549, mot "Bayraktar"/"Ankara" nommé juste avant).
  - Égypte (`eg`) : `at` = frame où le tracé du beat 5bis atteint son `fadeOutAfterT` (~frame 2920+150,
    mot "Égypte" prononcé) — MAIS le drapeau, contrairement au tracé qui s'estompe (`fadeOutAfterT`), NE
    DISPARAÎT PAS. Deux éléments distincts : le tracé du flux (éphémère, montre le mouvement) vs le
    drapeau (permanent, montre l'accumulation).
- **`geoNames`** (Natural Earth, vérifiés dans `countries-50m.json`) : `["United Arab Emirates"]`,
  `["Turkey"]`, `["Egypt"]` — noms simples, pas de `mainlandBox` nécessaire (pas de territoires d'outre-mer
  pour ces 3 pays).
- **`bgColor`** (couleur de fond nationale, comble les bords en mode "meet") : EAU `#00732F` (vert),
  Turquie `#E30A17` (rouge), Égypte `#CE1126` (rouge).
- Le Soudan lui-même GARDE son traitement crème/parchemin existant (contour permanent + intérieur vide,
  cf grammaire) — on ne lui met PAS son propre drapeau, il reste le sujet, pas un acteur externe.

## COORDONNÉES GÉO VÉRIFIÉES (lon, lat)

| Lieu | Coordonnées | Source |
|---|---|---|
| Jebel Amer (mine principale) | `[23.706, 13.834]` | Mindat.org, vérifié Tavily 2026-07-09 |
| Mine Darfour #2 (générique, sud) | `[24.5, 12.8]` | Approx. zone Songo/Al-Radom (Sud-Darfour), non pointée précisément — usage décoratif |
| Mine Darfour #3 (générique, nord) | `[22.9, 14.6]` | Dispersion visuelle, zone RSF Nord-Darfour |
| Dubaï | `[55.27, 25.20]` | Standard |
| Ankara | `[32.86, 39.93]` | Standard |
| Suakin (île) | `[37.33, 19.11]` | Standard, cohérent avec Red Sea coast Sudan |
| Port-Soudan | `[37.22, 19.62]` | Déjà utilisé Actes 1-2 (grille de contrôle) |
| Égypte (sortie de cadre, pas un point précis) | direction générale `[31.24, 30.04]` (Le Caire, pour orienter le vecteur du marqueur) | Standard |
| **Jeton RSF/Hemedti (position fin Acte 2)** | `[26.0, 14.9]` | `SoudanActe2.tsx:65`, constante `DARFUR` — repris tel quel pour continuité |
| **Jeton SAF/al-Burhan (position fin Acte 2)** | `[32.55, 15.6]` | `SoudanActe2.tsx:66`, constante `KHARTOUM` — repris tel quel pour continuité |

## COMPOSANTS À RÉUTILISER TELS QUELS

- `SoudanToken` (jetons RSF/SAF déjà en place depuis fin Acte 2, D=58px fixe)
- `SoudanBase` (objets isométriques — mine-or-td pour Darfour ×2-3, à créer pour Dubaï/Suakin)
- `SoudanTrail` (sillage, réutilisable si un jeton se déplace, pas central dans cet acte)
- `camAt()` + `CamKey[]` (interpolation caméra frame-driven, smoothstep)
- `ZoneControl` / `StateHighlight` (halos locaux) — usage LÉGER dans cet acte (l'acte est surtout des flux,
  pas des bascules de territoire)

## COMPOSANT NEUF À CODER : `GeoFlowConnection`

Fichier cible : `src/projects/warmap/_shared/GeoFlowConnection.tsx` (même famille que `SahelAttackArrow.tsx`,
réutilise ses briques internes : `interpolateWaypoints`, `revealPoints`, `toPathD`, `bearing2d`).

```ts
export interface GeoFlowConnectionProps {
  map: mapboxgl.Map | null;
  waypoints: [number, number][];       // ≥2 points géo — courbé via points intermédiaires, pas juste [A,B]
  progress: number;                     // 0→1 tracé du chemin (dashOffset "marching ants" existant réutilisé)
  markerProgress?: number;              // 0→1 position du marqueur mobile le long du chemin (indépendant de `progress`)
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
  markerColor?: string;                 // couleur du marqueur à l'instant courant
  markerIcon?: "dot" | "diamond";       // forme simple (pas de sprite complexe, cohérent stack SVG pur)
  markerColorTransition?: {             // POUR LE BEAT 4 : le marqueur change de couleur à mi-parcours
    beforeT: number;                    // 0..1, seuil où la couleur bascule
    colorBefore: string;
    colorAfter: string;
  };
  fadeOutAfterT?: number;               // 0..1 — au-delà de ce seuil, le TRACÉ (pas le marqueur) s'estompe (beat 5bis, sortie hors-carte)
  persistAfterArrival?: boolean;        // le tracé reste visible en trace fantôme après que le marqueur arrive (beat 6, cadrage récap)
  dashOffsetFrame?: number;             // pour l'effet marching ants sur le TRACÉ (repris SahelAttackArrow)
  width?: number;
  height?: number;
}
```

Comportement clé (spécifique vs `SahelAttackArrow`) :
- `SahelAttackArrow` = UNE seule chose qui progresse (`progress` pilote à la fois le tracé ET la tête).
- `GeoFlowConnection` = DEUX choses indépendantes : le **tracé** (peut être révélé instantanément ou en
  continu selon le beat) et le **marqueur** qui voyage dessus à SON propre rythme (peut repartir en sens
  inverse sans redessiner le tracé, cf beat 4 : le marqueur revient sur le MÊME chemin après transformation).
- Le marqueur est un simple SVG (`circle` ou `polygon` losange) — pas de sprite raster, cohérent avec la
  contrainte stack "2D top-down stylisé, pas de 3D/After Effects".

## BEAT PAR BEAT

### BEAT 1 — Le paradoxe [frames 0 → 462, cf `BEAT1` dans soudanActe3Timing.ts]
- **Caméra** : reprend la dernière cam key de la fin Acte 2 (Soudan réduit, déjà élargi Égypte/Libye/Mer
  Rouge visibles) — PAS de coupure brutale. `camKeys` : `[{f:0, lon:32, lat:16, zoom:4.2}, {f:BEAT1.end, lon:32, lat:16, zoom:3.6}]`
  (zoom out léger, Soudan reste visible au centre).
- **Éléments** : jetons RSF/SAF déjà en place (repris de l'état final Acte 2, positions à récupérer du
  fichier Acte 2 pour continuité exacte). 3 lignes de fuite pointillées grises fines (SVG simple, PAS
  GeoFlowConnection — trop tôt, pas encore de vrai trajet nommé) partant du cadre vers NE (Turquie),
  E (mer Rouge/Golfe), NO (Libye). Opacity faible (~0.25), stroke-dasharray fin.
- **Frame 134 ("Pourtant")** : rien de nouveau à l'écran, la phrase porte le paradoxe seule.

### BEAT 2 — Le point de départ : le Darfour, plusieurs mines [frames 523 → 619+]
- **Caméra** : fondu-zoom vers le Darfour, `camKeys` resserre vers `{lon: 24, lat: 13.5, zoom: 5.8}`.
- **Frame 619 ("mines d'or")** : 2-3 `SoudanBase` (sprite `mine-or-td`) apparaissent en stagger (delay
  ~6-10 frames entre chaque) aux positions Jebel Amer + mine#2 + mine#3. Taille écran fixe (`size=56`,
  cohérent SoudanBase).

### BEAT 2bis — L'acte fondateur [frames 667 → 1141]
- **Frame 667 ("La plus importante...")** : la mine Jebel Amer se distingue — halo local (`ZoneControl`,
  faction `rsf`, `radiusKm: 60`, `intensity` monte 0→0.6) apparaît SEULEMENT autour de Jebel Amer, les 2
  autres mines gardent opacity ~0.5 (pas de halo, juste le sprite).
- **Frame 847 (mot "Hemedti", ⚠️ whisper l'écrit "Emmettie" — NE PAS utiliser cette graphie, vérifier
  Wikipédia avant tout texte affiché)** : `SoudanToken` portrait Hemedti apparaît à côté de Jebel Amer,
  relié par un simple trait fin (`<line>` SVG, stroke fin `#3A2A18` opacity 0.5, pas de composant dédié
  nécessaire).
- **Frame 1114 ("milliard")** : le halo autour de Jebel Amer se sature (couleur passe de terne à `ATLAS.rsf`
  plein). AUCUN texte de montant à l'écran (règle : la voix porte le chiffre, pas l'image).

### BEAT 3 — Le trajet vers Dubaï [frames p2 offset+0 → +368, absolu 1166 → 1534]
- **Caméra** : dézoom large nécessaire pour voir Darfour+Dubaï. `camKeys` : zoom ~3.2, centre glissant vers
  `[35, 20]` (point médian approximatif Darfour-Dubaï) sur la durée du beat.
- **Frame 1166 (début, "Depuis cette mine")** : objet Dubaï (`SoudanBase`, sprite neuf à créer —
  port/hangar, cf section assets) apparaît EN PREMIER (avant que le marqueur ne parte, cf retour jury
  GPT/Kimi : la destination doit être comprise avant le voyage).
- **Frame ~1200-1500** : `GeoFlowConnection` waypoints `[[23.706,13.834], [35,18], [45,22], [55.27,25.20]]`
  (courbe via point intermédiaire, pas une ligne droite Darfour→Dubaï). `progress` et `markerProgress`
  montent ensemble de 0→1 sur cette fenêtre. `lineColor: ATLAS.contested` (or terne) ou un doré plus vif
  dédié `#D4A574` (déjà dans ATLAS.gold). `markerColor` doré.
- **Frame 1307 ("Émirats")** : le marqueur est en cours de trajet (pas encore arrivé) — cohérent, le mot
  arrive avant la fin du voyage physique.

### BEAT 4 — Le trajet retour : les armes [frames absolues 1534 → 1826]
- **Frame 1534 ("Et cet argent ne reste pas à Dubaï")** : le marqueur (arrivé à Dubaï à la fin du beat 3)
  s'attarde — `markerColorTransition` : `beforeT` calé sur l'arrivée, `colorBefore: gold`, `colorAfter:
  "#8A8F94"` (gris-métal). Petit flash (opacity pulse 1→1.4→1 sur ~8 frames) à l'instant de bascule = effet
  "transaction".
- **Frame 1602 ("revient sous une autre forme")** : le marqueur repart, MÊME chemin en sens inverse
  (`GeoFlowConnection` avec un 2e jeu de progress qui va cette fois de Dubaï vers Jebel Amer — soit un 2e
  appel du composant avec waypoints inversés, soit un flag `reverse` sur le même appel selon l'implémentation
  choisie en code).
- **Frame 1800 ("Amnesty International")** : rien de neuf à l'écran, la voix installe la source.
- **Frame 1995 (fin "acheminement", arrivée)** : le marqueur touche le jeton RSF en `[26.0, 14.9]` (position
  héritée fin Acte 2, PAS Jebel Amer `[23.706, 13.834]` qui est proche mais distinct — le jeton Hemedti
  reste à sa position de continuité, le halo Jebel Amer du beat 2bis est séparé) — `intensity` du halo RSF
  local monte en pulse bref (1.0→1.3→1.0 sur ~15 frames), pas un highlight d'état entier.

### BEAT 5 — Le miroir : Turquie, SAF, Suakin [frames absolues 2143 → 2692]
- **Caméra** : glisse encore, cadrage doit inclure Ankara (39.93°N, bien plus au nord que tout ce qui a été
  montré) — zoom ~2.8-3.0, centre `[33, 26]` environ (compromis Soudan-Turquie-Mer Rouge).
- **Frame 2198 ("l'armée régulière a trouvé son propre fournisseur")** : rien de neuf, transition.
- **Frame 2300 ("Turquie... Bayraktar")** : `GeoFlowConnection` depuis Ankara `[32.86, 39.93]` vers le jeton
  SAF en `[32.55, 15.6]` (position héritée fin Acte 2, constante `KHARTOUM`). `lineColor: ATLAS.saf`.
  `markerIcon: "diamond"` pour différencier visuellement du marqueur or/drone RSF (rond).
- **Frame 2514 (mot "Suakin", ⚠️ whisper l'écrit "Swakine" — NE PAS utiliser, vérifier Wikipédia)** :
  2e petit point s'allume sur la côte, `SoudanBase` sprite neuf (dock/port ancien, modeste, cf assets) à
  `[37.33, 19.11]`. Le mot nomme l'objet EXACTEMENT à son apparition (règle R-V5).

### BEAT 5bis — La nuance : SAF vend aussi, vers l'Égypte [frames absolues 2806 → 3063]
- **Frame 2806 ("vend de l'or hors circuit")** : rien de neuf, la voix installe.
- **Frame 2920 ("route du nord, vers l'Égypte")** : `GeoFlowConnection` fin et discret (`lineWidth: 2`,
  `lineOpacity: 0.5`, couleur ocre pâle `#C9A76B` distincte du doré RSF) depuis une zone SAF (nord/vallée
  du Nil, PAS Port-Soudan qui reste un point neutre déjà connu, pas le départ du trait) vers le nord —
  waypoints `[[32, 19], [31, 24], [31.24, 30.04]]` (vecteur vers Égypte). `fadeOutAfterT: 0.7` — le tracé
  s'estompe avant d'atteindre le Caire précisément (montre "sortie du cadre", pas un point d'arrivée
  marqué). Pas de nouvel objet isométrique (l'Égypte n'a pas besoin d'être personnifiée par un sprite,
  cf décision déjà actée dans le script).

### BEAT 6 — Le système, pas les camps [frames absolues 3063 → 3308]
- **Caméra** : dézoom encore pour cadrer les 4 flux en même temps — zoom ~2.5, centre `[38, 22]`
  (compromis large Darfour-Dubaï-Ankara-Égypte).
- **Frame 3160 ("le même or paie les deux côtés du front", v7)** : `persistAfterArrival: true` sur les
  `GeoFlowConnection` des beats 3-4-5 — les tracés fantômes restent visibles simultanément (opacity réduite
  ~0.4 pour ceux déjà "terminés", cohérent avec l'idée de trace mémoire). Halos RSF et SAF (les jetons déjà
  en place) pulsent en alternance (offset de phase entre les deux, sur une sinusoïde lente).

### BEAT 7 — Sortie / pont vers Acte 4 [frames absolues 3308 → 3773 (fin)]
- **Frame 3415 ("Dubaï")** / **3494 ("Ankara")** : pas de nouvel élément, la voix pointe ce qui est déjà
  affiché à l'écran (cohérent avec les 2 flux encore visibles).
- **Frame 3612 (pause avant "Une question reste en suspens")** : caméra STABILISÉE ici (aucune interpolation
  de `camKeys` sur cette fenêtre — clé quasi-identique, cf le pattern déjà validé Acte 2 "figement narratif
  voulu" à un moment clé). Un cercle pointillé large (simple SVG `<circle>` stroke-dasharray, PAS de
  composant dédié) apparaît en fondu, englobant Soudan-Dubaï-Ankara à l'écran.
- **Frame 3716→3773 (fin)** : dézoom continu final, zoom ~2.0, pont vers cadrage Acte 4 (UA/ONU — hors
  scope de ce breakdown).

## ASSETS NEUFS À CRÉER (visual-producer, prompt à valider AVANT tout appel payant)

1. **Objet Dubaï** — port/hangar de transit, style cohérent `mine-or-td`/`base-saf-td` (topdown iso, même
   palette parchemin/encre). Doit lire "hub commercial", pas "ville" (évite la sur-complexité).
2. **Objet Suakin** — dock/port ancien, plus modeste visuellement que Dubaï (île historique, pas un hub
   majeur) — différenciation de taille/détail entre les deux objets pour porter l'asymétrie EAU/Turquie.
3. Réutiliser tel quel : `mine-or-td` (×2-3 instances), jeton portrait Hemedti (vérifier s'il existe déjà
   depuis l'Acte 1/2 sinon régénérer avec la même recette photo réelle → Gemini).

## ORDRE D'IMPLÉMENTATION RECOMMANDÉ

1. Coder `GeoFlowConnection.tsx` en **test isolé** (composition Root dédiée, sur un cas simple genre
   Darfour→Dubaï) — valider le marqueur qui voyage, le `markerColorTransition`, le `fadeOutAfterT` AVANT de
   l'intégrer au beat réel.
2. Générer les 2 assets neufs (Dubaï, Suakin) via visual-producer.
3. Écrire `SoudanActe3.tsx` beat par beat en suivant ce breakdown, sur le pattern déjà éprouvé
   `SoudanActe2.tsx` (sections, ancrages relatifs aux fichiers whisper, camKeys interpolées).
4. Self-review scriptée (`scripts/tools/mapbox-selfreview.py` si applicable) avant tout render.
5. Render plein format (`scripts/render-mapbox.sh`, scale=1) — jamais remotion still (gris).

Liens : [[soudan-midform-ACTE3-SCRIPT]] · [[soudan-midform-ACTE3-JURY-VERDICTS]] · [[WARMAP-GRAMMAIRE]] ·
[[WARMAP-INSERT-SVG-ETATMAJOR]].
