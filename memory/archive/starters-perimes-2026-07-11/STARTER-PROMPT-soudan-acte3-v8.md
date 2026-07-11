---
name: STARTER-PROMPT-soudan-acte3-v8
description: Prompt de reprise DÉTAILLÉ — plan chiffré issu de 3 agents R&D (diagnostic + exploration libre + fouille interne) pour résoudre les 3 problèmes persistants après v5→v6→v7 (zoom intro, caméra suiveuse, drapeaux) + pistes créatives (transformation or→drone, split-screen substantiel). Rapports complets rapatriés dans acte3-v8-agents-rnd/.
metadata:
  type: project
---

# STARTER — SOUDAN ACTE 3 v8 — PLAN DÉTAILLÉ ISSU DE 3 AGENTS R&D (2026-07-10)

> Session précédente : v5→v6→v7 ont chacun *semblé* corriger 3 problèmes (zoom intro, caméra suiveuse,
> drapeaux) sur la base d'un diff relatif ("mieux qu'avant"), mais une reconfrontation directe à la
> référence Silk Road 2 en fin de session a montré que les 3 restent NON résolus dans l'absolu. Cf
> [[feedback_reconfronter-brief-original-pas-diff-relatif]]. 3 agents indépendants ont été lancés pour
> repartir avec un diagnostic frais — leurs **rapports complets** (bien plus détaillés que ce résumé) sont
> rapatriés dans `memory/episodes/soudan-midform/acte3-v8-agents-rnd/` :
> - `agent-diagnostic-camera-drapeaux.md` — diagnostic chiffré, calculs de distance/zoom Mapbox.
> - `agent-exploration-libre.md` — 5 propositions de mise en scène, comportement frame par frame détaillé.
> - `agent-mapanimation-templates.md` — fouille catalogue concurrent + composants internes sous-exploités.
> **Lire les fichiers complets avant de coder** — ce document est une synthèse fidèle mais condensée ;
> les rapports sources contiennent le raisonnement complet, les citations de code exactes, les numéros de
> ligne.

## AVANT DE CODER : 2 clarifications à trancher avec Aziz

### 1. Drapeaux (`CountryColorLayer`, SoudanActe3.tsx)

**État actuel** : aplat de COULEUR UNIE (une seule teinte nationale) dans le contour du pays — PAS le
motif complet du drapeau. Le code importe déjà `useClipFlags` mais ne s'en sert que pour calculer le
CONTOUR géométrique ; l'image du drapeau elle-même n'est jamais affichée (`fill={f.color}` au lieu de
`<image href={flagUrl}>`).

**Pourquoi c'est comme ça** : une note dans le code cite "retour Aziz 2026-07-09 : même sans le drapeau
en tant que tel" — décision actée une session précédente, formalisée dans
`memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md` § hiérarchie de remplissage à 3 niveaux (aplat uni →
couleurs nationales sans emblème → drapeau complet), qui range `CountryColorLayer` au niveau 1 en
justifiant par la lisibilité au dézoom large (zoom ~2.5-3.5, "le motif complet écrase l'écran").

**Ce qu'Aziz redemande cette session** (répété plusieurs fois, sous plusieurs formulations) : la VRAIE
couleur/motif du drapeau, pas un aplat uni — "à moins que le drapeau soit littéralement une seule
couleur, ce qui m'étonnerait". C'est un changement d'avis par rapport à la décision du 2026-07-09, à
confirmer explicitement.

**Solution technique déjà identifiée (agent 1)** : `useClipFlags`/`ClipFlagsLayer` est déjà importé et
câblé pour la géométrie — il suffit de rendre `<image href={flagUrl}>` au lieu de l'aplat `fill`. Aucune
brique à écrire, une ligne à changer. Proposition : seuil de zoom qui bascule entre les 2 modes —
`zoom < ~4.0` → garder l'aplat (dézoom large où le motif écraserait) ; `zoom >= ~4.0` → motif complet
clippé. **Réserve honnête de l'agent** : en fin d'acte, 3 drapeaux (EAU/Turquie/Égypte) peuvent être
actifs SIMULTANÉMENT pendant que la carte dézoome large pour le beat de synthèse (`cam3At` va jusqu'à
zoom 2.3) — passer les 3 en motif détaillé en même temps à ce zoom-là risque de surcharger l'écran. Le
seuil exact (probablement pas 4.0 tel quel) est à calibrer EMPIRIQUEMENT : rendre une frame à chaque
moment où un drapeau s'allume, comparer aplat vs motif réel côte à côte, choisir par l'œil plutôt qu'à
l'aveugle. Piste alternative si le seuil s'avère trop risqué : le beat 7 (`Acte3SideFlags`, volets
latéraux du split-screen) utilise DÉJÀ le motif complet dans un contexte cadré/isolé — on pourrait
compter sur ce panneau dédié pour livrer "le vrai drapeau" plutôt que de complexifier la carte principale,
mais ça change la structure narrative (le drapeau complet arriverait plus tard dans le récit qu'aujourd'hui).

**Recommandation Claude** : basculer vers le vrai motif avec le seuil de zoom, calibré à l'œil au premier
test — c'est ce qu'Aziz demande depuis le début, la brique existe déjà, le risque de surcharge est gérable
avec un seuil bien choisi plutôt qu'une raison de renoncer.

### 2. Split-screen : `WarMapSplitScreen` (composant existant) vs panneaux glissants actuels

**Contradiction non résolue trouvée par l'agent 3** : le breakdown (`soudan-midform-ACTE3-BREAKDOWN.md`,
Décision 4) documente explicitement qu'Aziz a validé l'usage de `WarMapSplitScreen`
(`src/projects/warmap/_shared/WarMapSplitScreen.tsx`, composant PRODUCTION promu R&D, "validé Aziz
2026-06-14") — un vrai split structurel à volets, avec un `connector` render-prop qui dessine PAR-DESSUS
la séparation (ex. un fil qui relie visuellement 2-3 mondes malgré la coupure spatiale) et des `ratios`
animés par volet (le centre peut être plus large que les côtés).

Mais le code ACTUEL (`SoudanActe3.tsx`, commentaire au-dessus de `Acte3SideFlags`) dit : *"PAS
WarMapSplitScreen (redimensionner la vraie Mapbox Soudan dans un panel 1/3 casserait tous les overlays
enfants câblés 1920x1080 — testé, écarté)."* Le contournement actuel (panneaux glissants qui recouvrent
les bords de la carte plein écran) est un pis-aller, pas l'implémentation validée.

**Piste concrète non testée (agent 3)** : `SoudanWarMapEngine` a DÉJÀ des props `width`/`height`
optionnelles (ajoutées cette session précisément pour ce cas d'usage, cf commentaire dans
`SoudanWarMapEngine.tsx`) — le blocage documenté ("casse les overlays enfants") vient probablement des
enfants COMPLEXES (`GeoFlowConnection`, `ImpactPictogram`, tailles/offsets codés en dur pour un cadre
plein écran), pas de la logique de projection elle-même qui suit `proj()` correctement. **Piste à tester** :
une DEUXIÈME instance de `SoudanWarMapEngine` réduite dans le volet central, MAIS SANS les enfants
complexes — seulement le fond carte + `ZoneControl`/halos (pas de jetons/pictogrammes/GeoFlowConnection).
Si ce test isolé marche, `WarMapSplitScreen` redevient utilisable comme prévu à l'origine.

**Recommandation Claude** : tester cette piste en isolé (proto 5 min, pas dans le fichier principal)
AVANT de décider — si ça marche, on revient au vrai split structurel prévu depuis le début plutôt que de
continuer sur le contournement.

---

## PROBLÈME 1 — Zoom d'intro (beat 1, `CAM1`) : "pourquoi c'est complexe"

**La question n'est pas "quelle valeur de zoom" mais une contrainte géométrique dure.**

Distance réelle Darfour↔Khartoum (calcul haversine, agent 1) : **~707 km** — dix fois plus que
l'estimation de départ (50-80km) qui avait orienté la mauvaise piste. Sur Mapbox Mercator à la latitude
du Soudan (~15°N), la largeur d'écran visible suit approximativement :
- zoom 5 ≈ ~2200 km de large
- zoom 6 ≈ ~1100 km de large
- zoom 6.5-7.5 (le zoom "ville" de Silk Road 2) ≈ ~150-500 km de large

**Donc** : pour qu'un point occupe une portion significative de l'écran façon Silk Road (zoom 6.5+), le
cadre ne fait plus que quelques centaines de km de rayon — Darfour et Khartoum, à 707km d'écart, ne
peuvent PAS tenir ensemble dans un tel cadre. Ce n'est pas que le zoom actuel (5.3) est "mal réglé", c'est
qu'il est déjà proche du maximum géométriquement possible pour garder les deux généraux visibles
simultanément — et ce maximum reste, par nature, une vue "tout le Soudan visible", jamais un vrai
close-up façon Silk Road.

**Preuve vidéo (agent 1, extraction frames)** : dans `silk road 2.mov` (la vraie référence, `silk road
1.mov` est un pull-back de reveal, PAS un close-up permanent — à ne pas confondre), CHAQUE frame ne
montre jamais 2 villes lointaines en même temps en gros plan. On voit UNE ville nommée à la fois ; la
suivante n'apparaît que quand la caméra progresse vers elle. Le "close-up sur 2 généraux simultanément"
demandé n'a tout simplement pas d'équivalent dans la référence citée.

### Ce que l'agent propose comme alternative

**Option A (recommandée par l'agent, fidèle à la référence)** — Abandonner le cadrage "2 portraits en
même temps". Séquencer en 2 temps forts distincts :
1. Frame 0 : caméra SEULE sur Khartoum, zoom ~6.5-7, tenir 2-3 secondes (spring pulse sur le portrait).
2. Mouvement de caméra MARQUÉ (pas un fondu progressif — un vrai geste qui se voit à l'écran, cohérent
   avec la doctrine WARMAP-GRAMMAIRE qui encourage "pan serré + transitions marquées, pas de pull-back
   continental").
3. Caméra SEULE sur Darfour, zoom ~6.5-7, tenir.
4. Les deux jetons ne partagent le même cadre qu'au moment où le récit l'exige vraiment (`F1.minesOr` et
   après — quand plusieurs mines doivent être visibles ensemble, le zoom redescend naturellement à ~5.8
   comme aujourd'hui).

**Option B (si Aziz veut absolument les deux dès l'ouverture)** — Accepter zoom max réaliste ~5.5-6.0
(proche de l'actuel), MAIS abandonner le vocabulaire "close-up ville façon Silk Road" pour cette
séquence précise. Le vrai levier devient alors le LANGAGE VISUEL autour du cadrage large : jetons
sensiblement plus gros à l'écran, halos plus intenses/saturés, un voile qui assombrit tout SAUF un
couloir visuel reliant Darfour-Khartoum (pour guider l'œil sans mentir sur la distance réelle).

**Limite technique du moteur vérifiée** : aucune. `SoudanWarMapEngine` n'a pas de seuil de zoom codé en
dur qui bloquerait un zoom plus serré — le voile khaki et le contour national sont recalculés chaque
frame (`map.project()`), donc à zoom 7-8 le contour sortirait simplement du cadre normalement (comme dans
la référence, qui ne montre jamais de bordure nationale à ce niveau de zoom). Le geojson de contour a une
résolution suffisante (~1176 points) pour rester lisse même très zoomé. Rien n'empêche techniquement
l'Option A.

---

## PROBLÈME 2 — Caméra suiveuse (beats 3-5, `cam2At`/`cameraFollowsPath`)

**Cause racine** : `CAM2_ZOOM_FOLLOW = 5.2` vs `CAM2_ZOOM_REST = 4.6` — écart de seulement 0.6, beaucoup
trop faible pour être perceptible à l'image (un écart visible commence vers 1.5-2.0 niveaux de zoom). La
fonction `cameraFollowsPath()` elle-même est correcte dans son principe (confirmé par les 2 agents qui
l'ont lue) — le problème est uniquement dans les VALEURS passées.

**Frames de référence (agent 1)** : dans Silk Road 2, à chaque étape du trajet, l'écran montre le point
courant + éventuellement un point voisin à venir, sur une largeur d'écran correspondant à ~200-500km —
donc zoom Mapbox estimé ~6.5-7.5, pas 5.2.

**Mais attention au vrai piège (signalé par l'agent 1)** : le trajet Jebel Amer→Dubaï fait ~3530km, et
CONTRAIREMENT à la vraie route de la soie historique (qui traverse Dunhuang, Lanzhou, Samarkand, Kashgar
— des villes RÉELLES nommées à chaque segment), notre trajet or Soudan→Dubaï n'a que 2 points de courbure
GÉOMÉTRIQUES sans nom (`[30, 20.5]`, `[38, 24.5]`, `[47, 25.5]` dans `WP_OR_ALLER`). Un zoom aussi serré
que la référence (7+) sur un désert sans aucun repère nommé produirait un écran vide et illisible —
l'inverse de l'effet recherché. C'est un cas où copier la référence à la lettre desservirait le récit.

### Proposition chiffrée (agent 1)

1. Resserrer `CAM2_ZOOM_FOLLOW` à **~6.0-6.5** (pas plus haut, à cause du désert sans repères).
2. Baisser `CAM2_ZOOM_REST` à **~4.0-4.2** (pas 4.6) pour creuser un écart perceptible entre "on suit" et
   "on contextualise".
3. Ajouter des labels intermédiaires sur le trajet (réutiliser `ArrivalLabel`, déjà existant et déjà
   validé comme pattern fidèle à Silk Road) — même un label générique ("Mer Rouge", "Golfe") à 1-2 points
   du trajet pour combler le vide qui rendrait un zoom serré illisible. Cohérent avec la doctrine WARMAP
   ("ne jamais laisser la carte au repos sans événement").

### ⭐ Idée neuve non testée (agent 3, trouvée dans le code interne du projet)

Un fichier existant, `GoldRouteAtlasZoom.tsx` (`src/projects/_shared/templates/travel-map/`, projet
Atlas — PAS Mapbox, SVG/d3-geo pur), fait DÉJÀ ce que la référence Silk Road montre, avec deux effets que
notre `cameraFollowsPath` n'a pas :

1. **Le zoom lui-même progresse dans le temps** pendant le suivi (`interpolate(frame, [0,40,duration],
   [3.2, 4.0, 4.6])`) — pas un zoom fixe. Ça crée une sensation de resserrement/tension croissante ("le
   piège qui se referme") qu'un zoom constant n'a pas. Adaptation proposée pour Mapbox :
   `cameraFollowsPath(waypoints, t, zoomAt: (t)=>number)` au lieu d'un `zoom` fixe — changement mineur de
   signature, zéro violation headless (juste un nombre interpolé de plus dans un calcul déjà frame-driven).
2. **Le territoire traversé se teinte au passage et RESTE teinté** (une "vague" de couleur qui suit le
   marqueur et ne s'efface pas) — contrairement à notre `persistAfterArrival` actuel qui ne garde que le
   TRACÉ pointillé fantôme, pas une teinte de territoire. Techniquement : réutiliser `useClipFlags`
   (déjà dans le fichier) mais piloté par la progression du marqueur (`markerProgress`) au lieu d'un
   `atAbsolute` fixe — dès que le centroïde d'une zone est proche de la polyligne ET que son `t` le plus
   proche est `<= markerProgress`, dessiner un `<path>` avec opacité croissante.

**Nuance du catalogue concurrent (agent 3)** : le template "Israel→Iran" du catalogue mapanimation.io
utilise l'inverse — une "traînée de comète" qui s'ESTOMPE derrière le marqueur (fugacité), pas une
persistance. Les deux se justifient selon l'intention narrative : traînée fugace = vitesse/instant ;
territoire teinté persistant = accumulation/conséquence durable. Pour l'Acte 3 (l'or qui finance
DURABLEMENT les deux camps), la persistance est plus juste que la fugacité.

---

## PROBLÈME 3 — Split-screen final avec substance

(Dépend de la clarification #2 ci-dessus — WarMapSplitScreen vs panneaux glissants.)

### 3 briques déjà codées, jamais exploitées dans ce beat (agent 3)

1. **`WarMapSplitScreen.connector`** — un render-prop qui dessine PAR-DESSUS toute la largeur, traversant
   la séparation entre volets. Jamais utilisé dans l'Acte 3 actuel. Cas d'usage exact : le texte du beat 6
   dit "le même or paie les deux côtés du front" — un connector qui dessine un trait or partant du volet
   central (Soudan) et se divisant en 2 branches vers EAU et Turquie rendrait ÇA visuellement, au lieu de
   3 blocs indépendants sans lien visuel entre eux.

2. **`StatComparisonGrid.tsx`** (`src/projects/_shared/components/layouts/`) — composant DÉJÀ CODÉ pour
   afficher "X vs Y" avec un count-up chiffré (odometer) + coins en forme de viseur + couleur d'accent par
   côté. Jamais branché dans ce beat. Actuellement les volets latéraux montrent juste du texte factuel
   statique ("1er importateur d'or africain au monde") — brancher `StatComparisonGrid` en half-width dans
   chaque volet donnerait un CHIFFRE QUI COMPTE (ex. "$X milliards via EAU" à gauche vs "Y livraisons de
   drones" à droite) au lieu d'un texte figé, plus fort visuellement pour une comparaison.

3. **Composition asymétrique "en étau"** (agent exploration libre, détail complet) — au lieu de 3 colonnes
   égales (qui aplatissent la hiérarchie : Dubaï et Turquie montrés comme équivalents alors que la thèse
   est "le Soudan pris en étau entre les deux") :
   - Panneau central Soudan DOMINANT (~50% de largeur, pas 1/3) — c'est LE sujet, pas un panneau parmi
     d'autres.
   - Volets latéraux (~25% chacun), légèrement désaturés (`<rect>` semi-transparent par-dessus, pas de
     CSS filter) — signale visuellement "périphéries qui pèsent sur le centre", pas des égaux.
   - Bordures qui "respirent" : le cadre du panneau actif au moment précis de la narration s'illumine
     légèrement (changement de `stroke-width`/`stroke-opacity`, jamais de glow flouté), synchronisé au
     texte narré.
   - Deux traits fins convergents (même vocabulaire tireté doré que les trajets vus plus tôt dans l'acte)
     relient les bords intérieurs des panneaux latéraux au centre — lecture "étau" plutôt que
     "juxtaposition".
   - Révélation en 3 temps dissymétriques : centre d'abord (seul 20-30 frames), PUIS Dubaï glisse depuis
     la droite, PUIS 15-20 frames après Turquie depuis la gauche — jamais les 3 en même temps.
   - Sortie : au lieu d'un fade, les 2 panneaux latéraux se RESSERRENT visuellement vers le centre avant
     de disparaître — met en scène littéralement l'étau qui se referme, cohérent avec le message de
     dépendance/encerclement porté par la FORME, pas juste le texte (principe INTENTION→FORME de la
     doctrine du projet).

**Verdict du catalogue concurrent (agent 3)** : recherche exhaustive dans les 89 templates
mapanimation.io — ZÉRO résultat pour split/panel/comparison/dual/versus. Le concurrent n'a AUCUN
template split-screen, leur format reste mono-carte du début à la fin. Rien à emprunter de ce côté ;
toute la valeur ajoutée vient des briques internes déjà prêtes.

---

## PROBLÈME BONUS — Transformation or→drones à Dubaï ("trop faible", signalé par Aziz)

**Aucune brique existante ne fait un vrai morph de FORME** — `markerColorTransition` (déjà utilisé)
change seulement la COULEUR du marqueur, la silhouette reste figée (dot/diamond/drone).

**Solution trouvée (agent 3)** : `MetamorphoseFiduciaire.tsx`
(`src/projects/_shared/components/layouts/`) a EXACTEMENT le mécanisme requis, déjà validé ailleurs avec
des glyphes texte (₣ → ¥) :
1. Symbole A visible, fade out.
2. "Gouttes d'encre" — 15 cercles SVG avec springs échelonnés par delay, grandissent en éventail (pas de
   particules DOM, juste des `<circle>` avec `r` interpolé).
3. Un `clipPath` circulaire dont le rayon grandit révèle progressivement le Symbole B dans une couleur
   différente — le wipe circulaire exact qu'on veut pour or→drone.

**Adaptation concrète** :
- Remplacer les 2 `<text>` par les 2 pictogrammes SVG déjà dessinés dans le fichier (`PICTO_GOLD` et le
  path drone de `GeoFlowConnection`).
- Positionner au point du marqueur (`markerPos.x/y`) au lieu du centre-écran fixe (960,540) — sortir en
  composant séparé prenant `x`/`y`/`triggerFrame` en props.
- Réduire l'échelle (le marqueur fait ~7-24px sur la carte, pas plein écran) — paramétrer les gouttes par
  un `scale` prop.
- Compresser la durée (150 frames plein écran original → ~20-30 frames à mi-parcours d'un trajet
  ~90 frames) — le mécanisme scale linéairement, juste réduire tous les délais proportionnellement.

100% headless-safe par construction (SVG pur, aucun CSS transition/blur, springs/interpolate frame-driven)
— le composant source est déjà conforme, aucune adaptation de contrainte nécessaire.

**Piste complémentaire (agent exploration libre, Proposition 2, comportement détaillé)** :
- Le pictogramme cargaison (sac ocre suivant le tracé) arrive à Dubaï et disparaît par effacement radial
  (clipPath dont le rayon grandit depuis le centre du sac, 15 frames).
- Pause complète de 20-25 frames sur Dubaï, caméra statique, zéro mouvement — le silence narratif avant la
  bascule. Un cercle-marqueur pulse doucement (le lieu "digère" ce qui vient d'arriver).
- Le drone apparaît par croissance depuis EXACTEMENT le même point (spring avec overshoot léger), à
  l'inverse géométrique du cercle qui a effacé le sac — l'œil associe "disparu ici" à "apparu ici" sans
  texte.
- Le trajet retour (drone) a un mouvement différent du sac au sol : translation plus directe, une ombre
  portée SVG (`<ellipse>` dont l'offset grandit) suggère l'altitude sans 3D.
- Le tracé retour est visuellement différent de l'aller (pointillé plus fin, couleur rouge/gris militaire
  au lieu d'ocre/or) — l'œil comprend "aller = commerce, retour = armement" par la forme seule.

Verdict concurrent (agent 3) : ZÉRO résultat pour morph/transform/becomes/dissolve dans les 89 templates
— aucun template mapanimation.io ne transforme un objet en cours de trajet. Angle mort chez eux, pas un
oubli de recherche.

---

## Note technique — dette existante à signaler (PAS à corriger dans l'urgence)

`SenegalActe2Continu.tsx` (lignes 460, 731) utilise `filter: blur()` CSS DOM en dur — contraire à la
doctrine headless-safe du projet (comportement imprévisible en Chrome headless, documenté
`rules-outils-techniques.md` §3). Découvert par l'agent exploration libre en cherchant une alternative
conforme pour un effet de whip pan. Alternative utilisée dans les propositions ci-dessus :
`<feGaussianBlur stdDeviation={interpolate(...)} />` en `<filter>` SVG natif — prévisible en headless
contrairement au CSS `filter:` sur un DOM/canvas. À auditer/corriger dans une session dédiée dette
technique, pas urgent pour l'Acte 3.

---

## Ordre d'essai recommandé

1. **Trancher les 2 clarifications avec Aziz** (drapeaux motif complet + seuil zoom, WarMapSplitScreen
   à re-tester en isolé) — 5-10 min de discussion, conditionne le reste.
2. **Zoom intro (Problème 1, Option A)** — restructuration `CAM1` en 2 temps forts, isolé et rapide à
   tester (pas de dépendance aux autres chantiers).
3. **Zoom caméra suiveuse (Problème 2)** — ajustement de valeurs (`CAM2_ZOOM_FOLLOW`/`CAM2_ZOOM_REST`) +
   labels intermédiaires, rapide. Le zoom progressif façon `GoldRouteAtlasZoom` est un raffinement à
   tenter APRÈS que les valeurs de base soient validées à l'œil.
4. **Transformation or→drone (Bonus)** — recyclage `MetamorphoseFiduciaire`, isolable en test à part
   (composition Root dédiée) avant intégration dans le beat réel.
5. **Split-screen substantiel (Problème 3)** — le plus gros chantier, dépend de la clarification #2 (si
   `WarMapSplitScreen` redevient utilisable, tout le travail de composition asymétrique se fait dedans ;
   sinon, adapter les idées de composition aux panneaux glissants actuels).

**Renders de la session précédente à considérer comme itérations de travail, pas des finaux** :
`out/episodes/soudan-midform/wip/acte3_v5/v6/v7.mp4` (+ `_compressed.mp4`).

Liens : [[soudan-midform-ACTE3-BREAKDOWN]] · [[soudan-midform-ACTE3-SCRIPT]] ·
[[feedback_reconfronter-brief-original-pas-diff-relatif]] · `memory/episodes/soudan-midform/STATUS.md` ·
rapports complets : `memory/episodes/soudan-midform/acte3-v8-agents-rnd/`.
