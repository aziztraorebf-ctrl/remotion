# Diagnostic — Soudan Acte 3 : zoom intro, caméra suiveuse, drapeaux pays

Date : 2026-07-10. Rapport de diagnostic uniquement — aucun fichier de code édité.

Fichiers examinés : `src/projects/warmap/soudan-acte3/SoudanActe3.tsx`,
`src/projects/warmap/engine/SoudanWarMapEngine.tsx`,
`src/projects/_shared/mapbox/useClipFlags.tsx`, `MapboxCountryFlagDecal.tsx`,
`memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`, `memory/doctrines/WARMAP-GRAMMAIRE.md`,
`memory/_r-and-d-mapanimation-ANALYSE.md`. Frames extraites de `_incoming/silk road 1.mov`
et `_incoming/silk road 2.mov` (ffmpeg fps=0.5).

**Correctif factuel préalable** : la consigne indique Darfour/Khartoum "50-80km" — c'est
faux, à corriger avant toute décision de zoom. Distances réelles (haversine) :
- Darfour ↔ Khartoum : **~707 km**
- Jebel Amer ↔ Dubaï : **~3530 km**
- Ankara ↔ Khartoum : **~2706 km**

Ces distances sont l'échelle du problème — ~10× plus grandes que l'hypothèse de départ. Ça
change la réponse : à 700km d'écart, on ne peut PAS avoir "un seul point qui remplit
l'écran" pour les DEUX portraits simultanément à moins de sacrifier l'un des deux hors-cadre.

---

## Problème 1 — Zoom d'intro pas resserré

### Preuve visuelle de référence
`silk road 2.mov` (30s, la vraie référence "close-up serré") : à chaque étape du trajet, la
frame montre **un point (parfois deux, très proches) + label texte**, le point occupant peut-être
1-2% de la largeur écran mais la VILLE VOISINE LA PLUS PROCHE n'est jamais dans le cadre. Le
zoom est calé pour que le POINT SUIVANT du trajet n'apparaisse qu'au moment où la caméra
progresse vers lui (ex : frame `f_10` montre seulement "Constantinople (Istanbul)", aucune
autre ville visible, aucun pays voisin nommé). C'est un zoom Mapbox estimé **~6.5-7.5**
(comparable à un zoom "ville" standard, où une agglomération occupe l'essentiel de l'écran).

`silk road 1.mov` en revanche est la fausse piste : elle DÉZOOME progressivement d'un
close-up (`f_02`, zoom serré sur Istanbul seul) vers une vue tout-Europe/Moyen-Orient
(`f_06`, montre Milan→Amritsar sur un seul écran, zoom ~3). C'est un pull-back de reveal, pas
un close-up permanent. Si le beat 1 s'est inspiré par erreur de "silk road 1" plutôt que
"silk road 2", ça expliquerait la confusion sur l'intention.

### Pourquoi le zoom 5.3-5.8 actuel ne marche pas
`CAM1` (SoudanActe3.tsx L120-130) centre la caméra sur le **point médian géographique** entre
DARFUR et KHARTOUM (`A1_CENTER_LON/LAT`), séparés de ~707km, à zoom 5.3. À ce zoom sur
Mercator, la largeur d'écran visible avoisine **~1500-1700km** (zoom 5 ≈ ~2200km de large sur
1920px, zoom 6 ≈ ~1100km — approximation standard Mapbox/Web-Mercator à cette latitude ~15°N).
Donc à zoom 5.3, l'écran montre grosso modo tout le Soudan utile (Darfour à Khartoum ET une
bonne marge de chaque côté) — exactement le symptôme rapporté par Aziz : "on voit encore tout
le Soudan".

**Le vrai problème n'est pas le zoom en valeur absolue, c'est le CADRAGE binoculaire** :
demander un "close-up serré sur 2 portraits" séparés de 700km avec UNE SEULE caméra centrée
entre les deux est géométriquement contradictoire avec zoom≥6 (à zoom 6+, l'un des deux points
sort du cadre). Le breakdown (commentaire ligne 116-119) cite Gemini+Kimi convergents sur
"commence direct en vue SERRÉE sur les 2 portraits" — cette convergence est probablement un
artefact de la référence silk road 2 mal transposée : dans silk road 2, on ne voit JAMAIS 2
villes lointaines simultanément en gros plan, on voit UNE ville à la fois. Le "close-up sur 2
généraux" n'a pas d'équivalent direct dans la référence.

### Limite technique du moteur
`SoudanWarMapEngine` n'a pas de limite dure au zoom serré : `stateLineOpacity`, voile khaki,
et contour national sont tous frame-driven (`map.project()` recalculé chaque frame, aucun
seuil de zoom codé qui bloquerait un zoom élevé). Le voile khaki troué (`outlineRingsRef`,
L438-450) reprojette le contour national à chaque frame quel que soit le zoom — à zoom 7-8, le
contour Soudan sortirait simplement du cadre (le "trou" occuperait tout l'écran ou plus), ce
qui est correct visuellement (silk road 2 ne montre jamais de bordure nationale à ce niveau de
zoom, juste le point + label). Pas de bug bloquant identifié — le moteur PEUT zoomer plus fort,
rien ne l'en empêche techniquement.

Seul vrai risque technique à zoom élevé (7+) : le geojson `sudan-outline.geojson` a une
résolution de ~1176 points au total pour l'enveloppe — largement suffisant pour rester lisse
même à des zooms serrés localisés (ce n'est pas une géométrie basse-résolution qui deviendrait
anguleuse). Pas un facteur limitant.

### Proposition concrète
Deux options, à trancher avec Aziz (question de mise en scène, pas technique) :

**Option A — Renoncer au "2 portraits simultanés", suivre littéralement silk road 2** :
ouvrir SERRÉ sur Khartoum SEUL (zoom ~6.5-7), tenir ~2-3s, PUIS un mouvement de caméra marqué
(pas un fondu) vers Darfour SEUL à zoom ~6.5-7, tenir. Jamais les deux dans le même cadre au
début. C'est fidèle à la référence (qui montre toujours 1 point net à la fois) et résout la
contradiction géométrique. Timing suggéré : `F1.start` → Khartoum zoom 6.8 ; `F1.pourtant` (ou
un nouveau jalon ~frame 200) → mouvement vers Darfour zoom 6.8 ; garde le zoom 5.8 actuel
seulement pour le moment où les DEUX mines/jetons doivent être visibles ensemble (`F1.minesOr`
et après).

**Option B — Garder les 2 en même cadre mais accepter que ce n'est pas un "close-up ville"** :
si le récit exige de voir SAF et RSF ensemble dès l'ouverture (pour poser l'opposition), le
zoom max réaliste reste ~5.5-6.0 (actuel 5.3 n'est déjà pas loin) — le busword "close-up serré"
doit alors être abandonné en faveur d'un langage plus honnête ("cadrage resserré Soudan
central", pas "close-up 2 portraits"). Dans ce cas le vrai fix n'est PAS le zoom mais le
langage visuel autour : jetons plus GROS à l'écran (déjà mentionné dans les commentaires du
code comme correction récurrente pour les mines), halos plus intenses, texte-cadre qui isole
visuellement les deux points (ex : voile qui assombrit tout SAUF un couloir Darfour-Khartoum),
plutôt que d'espérer un zoom Mapbox qui ne peut pas mentir sur la distance réelle.

**Recommandation** : Option A. Elle est fidèle à la preuve vidéo fournie par Aziz (qui EST la
référence qu'il demande de reproduire) et ne demande pas de réinventer un langage visuel — juste
de restructurer `CAM1` en deux temps forts au lieu d'un centre géométrique moyen. Risque
: nécessite un mouvement de caméra "marqué" bien exécuté (pas un jump cut, pas un fondu mou —
la doctrine `WARMAP-GRAMMAIRE.md` interdit le pull-back continental mais encourage le pan serré
et les transitions marquées "on nomme → ça se dessine").

---

## Problème 2 — Caméra suiveuse (`cameraFollowsPath`) pas assez serrée

### Preuve visuelle de référence
Les frames de `silk road 2.mov` montrent qu'à chaque étape de la caméra suiveuse, environ
**2 points sont visibles** (le point courant + le suivant à venir OU le précédent qui sort de
cadre), séparés dans la réalité par des distances de l'ordre de **300-800km** (Duhnuang-Lanzhou
~600km, Samarkand-Kashgar ~800km, Istanbul-Rome ~1500km mais on ne voit qu'un point à la fois
sur f_16 avec Rome au centre et rien d'autre de nommé). La largeur d'écran visible dans ces
frames correspond à peu près à **200-500km selon l'étape** — un zoom Mapbox de l'ordre de
**~6.5-7.5**, PAS 5.2.

### Pourquoi zoom 5.2 ne marche pas
`CAM2_ZOOM_FOLLOW = 5.2` (L438) est quasiment identique à `CAM2_ZOOM_REST = 4.6` et au zoom
CAM1 (5.3/5.8) — il n'y a donc AUCUNE différenciation perceptible entre "vue de contexte" et
"caméra suiveuse serrée". Le trajet Jebel Amer→Dubaï fait ~3530km : à zoom 5.2 (~1900km de
large à l'écran), on voit potentiellement TOUT le trajet ou une bonne partie en une fois — c'est
littéralement le contraire de l'effet recherché ("jamais de vue d'ensemble").

Le calcul intuitif de `cameraFollowsPath` est correct dans son PRINCIPE (interpole lon/lat le
long des waypoints en fonction de `t`, zoom fixe) — le bug n'est PAS dans la fonction générique
(`SoudanWarMapEngine.tsx` L98-112, elle fait exactement ce qu'elle doit), il est dans la VALEUR
passée en paramètre côté `SoudanActe3.tsx`.

### Le vrai risque : lisibilité du trajet à zoom serré
Aziz demande "à quel zoom un tel trajet reste-t-il lisible sans perdre le fil" — c'est LA
tension réelle. À zoom 6.5-7.5 sur un désert (Darfour→mer Rouge→Golfe), l'écran est
essentiellement VIDE de repères (pas de villes nommées entre Jebel Amer et Dubaï dans le
breakdown actuel — les 5 waypoints `WP_OR_ALLER` sont des points géométriques, pas des lieux
nommés). Contrairement à silk road 2 qui traverse Duhnuang→Lanzhou→Samarkand→Kashgar (des
villes RÉELLES nommées à chaque segment), le trajet or Soudan→Dubaï n'a pas de jalons
intermédiaires nommés — juste 2 points de courbure géométriques (`[30, 20.5]`, `[38, 24.5]`,
`[47, 25.5]`).

C'est le vrai obstacle à un zoom plus serré : sans jalons nommés intermédiaires, un zoom 6.5+
sur un désert vide entre Khartoum et Dubaï risque de perdre le spectateur ("juste un désert
vide", cf. la mise en garde du prompt initial). La référence contourne ce problème en NOMMANT
chaque étape (labels "Duhnuang", "Lanzhou", "Samarkand"...) — le zoom serré fonctionne PARCE
QUE chaque frame a un ancrage textuel qui dit au spectateur où il est.

### Proposition concrète
1. **Resserrer `CAM2_ZOOM_FOLLOW` à ~6.0-6.5** (pas 7+, le trajet Soudan-Dubaï traverse une zone
   sans grandes villes intermédiaires réelles contrairement à la Route de la Soie historique —
   zoom trop serré = désert vide, contre-productif). Garder `CAM2_ZOOM_REST` nettement plus
   large (~4.0-4.2, pas 4.6) pour créer un VRAI contraste perceptible entre "on suit" et "on
   contextualise" — actuellement l'écart 5.2→4.6 (0.6) est trop faible pour se voir à l'image;
   un écart de zoom perceptible commence autour de 1.5-2.0 niveaux.
2. **Ajouter des labels de survol** (réutiliser `ArrivalLabel`, déjà présent dans le fichier
   et validé comme "pattern copié EXACT de silk road 2", L308) à un ou deux points intermédiaires
   du trajet — même un simple label générique ("Mer Rouge", "Golfe Persique/Arabique") au lieu
   de rien pendant les 3500km de vide. Ça comble le vide silencieux qui rendrait un zoom serré
   illisible, et respecte la grammaire WARMAP ("6-8 événements pour un beat <60s... ne jamais
   laisser la carte au repos").
3. Le `DroneConvoy`/marqueur mobile aide déjà à occuper l'écran visuellement pendant le
   trajet — c'est un bon point, à garder, mais insuffisant seul pour justifier un zoom élevé
   sans ancrage nommé.

**Risque signalé** : ne PAS pousser au-delà de zoom ~7 sur ce trajet précis (contrairement à la
tentation de "copier exactement silk road 2") car le trajet réel manque de villes repères —
un zoom qui serait parfaitement fidèle à la référence produirait ici un désert visuel vide,
l'inverse de l'effet recherché. C'est un cas où suivre la référence à la lettre desservirait le
récit ; l'esprit (zoom serré + ancrage nommé + jamais de vue d'ensemble) est reproductible, la
valeur numérique exacte ne l'est pas telle quelle.

---

## Problème 3 — Coloriage pays incomplet (aplat uni vs vrai drapeau)

### État actuel et sa justification déjà tranchée
`CountryColorLayer` (SoudanActe3.tsx L821-852) applique un aplat de couleur unie, PAS le
drapeau. Le commentaire du code (L826-828) et la doctrine `CARTO-OVERLAYS-PRINCIPES.md`
(§"Nuance War-Map", L96-105) montrent que ce n'est **pas un raccourci de flemme mais une
décision Aziz déjà actée le 2026-07-09** : "même sans le drapeau en tant que tel". La doctrine
formalise même une **hiérarchie de remplissage pays à 3 niveaux** (aplat uni → couleurs
nationales sans emblème → drapeau complet) et range explicitement `CountryColorLayer` au
niveau 1, justifié par le fait qu'à dézoom large (~zoom 2.5-3.5, cas d'usage réel ici puisque
`CAM2_ZOOM_REST=4.6` et `cam3At` va jusqu'à zoom 2.3), "le motif complet écrase l'écran".

**Donc la question posée par Aziz aujourd'hui ("je veux la couleur du drapeau turc, pas juste
une couleur") est un changement d'avis par rapport à la session du 2026-07-09**, pas une
implémentation qui aurait dévié d'une intention constante. Le rapport doit signaler ce point
explicitement à Aziz avant de coder quoi que ce soit : soit il confirme le changement d'avis
(alors la doctrine CARTO-OVERLAYS-PRINCIPES §"Nuance War-Map" doit être mise à jour en
conséquence), soit "couleur du drapeau" était une formulation raccourcie pour dire "couleurs
nationales" (niveau 2 de la hiérarchie, pas le drapeau détaillé plein motif = niveau 3) — à
clarifier avec lui avant d'implémenter.

### Pourquoi `useClipFlags` n'a pas été branché tel quel
`useClipFlags`/`ClipFlagsLayer` EST techniquement utilisable ici : `CountryColorLayer`
l'utilise déjà en interne pour la géométrie du contour (`const { paths } = useClipFlags(...)`,
L836) — il suffit de rendre `<image>` avec l'URL du drapeau au lieu de l'aplat `fill={f.color}`
pour obtenir le motif complet. Rien n'empêche techniquement de le faire, la brique est déjà
importée et câblée. Le SEUL obstacle documenté est la doctrine de lisibilité au dézoom
(§ci-dessus) — PAS une contrainte de pitch (la carte Soudan tourne à `pitch:0` en permanence,
`SoudanWarMapEngine.tsx` L221/387, donc le warning "useClipFlags DÉRIVE au pitch" ne s'applique
même pas ici — c'est un cas où `useClipFlags` est dans son domaine de validité déclaré,
contrairement à une carte V5 avec relief).

Donc : `MapboxCountryFlagDecal` n'est pas nécessaire ici (pas de pitch, pas de risque de
dérive) — `useClipFlags` suffit techniquement. La seule vraie question est la LISIBILITÉ à
l'échelle utilisée, pas la brique.

### Proposition concrète — seuil de zoom bascule aplat/drapeau
Étendre `CountryColorLayer` avec un seuil de zoom qui bascule entre les deux modes déjà
existants dans le projet (aplat = déjà codé ; motif = `ClipFlagsLayer` déjà existant, juste
pas branché ici) :

```
const zoom = mapRef.current?.getZoom() ?? 3;
const useFullFlag = zoom >= 4.0; // seuil à valider visuellement, cf. ci-dessous
```

- **zoom < 4.0** (cas section 2/3 actuels, `CAM2_ZOOM_REST=4.6`... attention celui-ci est
  DÉJÀ au-dessus du seuil proposé — à vérifier en pratique où se situent les zooms réels aux
  frames d'allumage des drapeaux, cf. note ci-dessous) : garder l'aplat uni actuel (déjà
  fonctionnel, déjà validé lisible).
- **zoom ≥ 4.0** : basculer sur `<image>` clippée (motif complet), en gardant le contour encre
  déjà présent (L845-846) pour l'ancrage visuel.

**Point d'attention avant de coder** : il faut vérifier à quel zoom réel la caméra se trouve
AU MOMENT où chaque drapeau s'allume (`ALL_COUNTRY_FLAGS[i].atAbsolute`), pas juste supposer.
Ex. EAU s'allume à `S1_FRAMES+773` qui tombe dans la Phase 2 de `cam2At` (juste après
`F2.argentNeRestePas`, resserré sur Dubaï à `CAM2_ZOOM_REST=4.6`, PAS sur les Émirats en tant
que pays) — à ce moment le zoom réel autour des Émirats mérite d'être vérifié à l'image (frame
extraite + `map.getZoom()` loggé) avant de choisir un seuil, plutôt que de deviner. C'est un
axe empirique à trancher par un test isolé (rendre 1 frame à chaque allumage de drapeau,
comparer aplat vs motif complet côte à côte), pas par une valeur de seuil choisie à l'aveugle.

**Risque signalé** : la doctrine `CARTO-OVERLAYS-PRINCIPES.md` §"Hiérarchie de remplissage"
prévient explicitement "à utiliser avec parcimonie (pas tout le continent = illisible)" pour le
niveau 2/3 — avec 3 drapeaux (EAU, Turquie, Égypte) qui peuvent rester actifs SIMULTANÉMENT en
fin d'acte (section 3, `ALL_COUNTRY_FLAGS` est un état partagé cumulatif, pas un flag unique),
passer les 3 en motif détaillé en même temps au beat 6/7 (zoom 2.3-4.0, cadrage large "4 flux
ensemble") risque de surcharger l'écran — c'est précisément le cas d'usage qui a motivé la
décision aplat du 2026-07-09. Le beat 7 (`Acte3SideFlags`, L702-815) utilise DÉJÀ le motif
détaillé complet dans les volets latéraux dédiés (via `image href={flagUrl}` clippé à la
silhouette, L774-777) — donc le motif complet EST déjà utilisé ailleurs dans le même acte, mais
dans un contexte cadré/isolé (panneau dédié), pas en surimpression sur la carte principale.
Proposition alternative si le seuil zoom s'avère trop risqué en pratique : garder l'aplat sur
la carte principale (comme aujourd'hui) et compter sur les volets latéraux du beat 7 (déjà en
motif complet) pour livrer le "vrai drapeau" — dans ce cas, le vrai fix serait d'AVANCER
l'apparition du volet Turquie plus tôt dans le récit plutôt que de complexifier
`CountryColorLayer`, mais ça change la structure narrative du beat 7, à valider avec Aziz.

---

## Résumé actionnable

| # | Cause racine | Fix proposé | Risque principal |
|---|---|---|---|
| 1 | Cadrage géométrique contradictoire (2 points à 700km voulus "serrés" ensemble) | Séparer en 2 temps forts (Khartoum seul zoom~6.8 → Darfour seul zoom~6.8) au lieu d'un centre moyen zoom 5.3 | Transition doit être marquée, pas un fondu mou (doctrine) |
| 2 | `CAM2_ZOOM_FOLLOW=5.2` ≈ `CAM2_ZOOM_REST=4.6`, aucun contraste perceptible | Zoom follow ~6.0-6.5 + `CAM2_ZOOM_REST` baissé à ~4.0-4.2 pour creuser l'écart + labels intermédiaires sur trajets sans ville | Zoom trop serré sur trajet sans repères nommés = désert vide illisible |
| 3 | Décision Aziz du 2026-07-09 (aplat volontaire) contredite par la demande d'aujourd'hui — pas un bug d'implémentation | Clarifier l'intention avec Aziz D'ABORD ; techniquement, seuil de zoom bascule aplat/`ClipFlagsLayer` (déjà importé), à calibrer par test empirique par drapeau | 3 drapeaux actifs simultanément en fin d'acte = risque de surcharge si tous passent en motif détaillé |

Aucune des 3 pistes ne se heurte à une vraie impossibilité headless (pas de `flyTo`/`easeTo`
utilisé nulle part, tout reste `jumpTo`/`map.project()` frame-driven, conforme doctrine
Mapbox). Les 3 corrections sont des ajustements de VALEURS et de STRUCTURE de caméra/seuils,
pas de nouvelle brique technique à écrire — les briques existantes (`cameraFollowsPath`,
`useClipFlags`, `ArrivalLabel`) couvrent déjà les 3 besoins.
