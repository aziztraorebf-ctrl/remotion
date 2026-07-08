# STORYBOARD — "L'AES en 90 secondes" (Short 9:16, reprise V4 après 4 rejets)

**Direction figée** : carte géographique vivante, d3-geo PUR (zéro Mapbox), fond parchemin quadrillé ocre.
Un seul cadre continu du début à la fin, jamais de cut de décor. Sous-titres mot-par-mot. Une seule
rupture de registre (CEDEAO). Audio : `public/_shared/audio/sahel-warmap/short-90s-v1.mp3` (91.86s, 2756f @30fps).
Whisper : `src/projects/warmap/_shared/whisper-words-short-90s.ts`.

Je documente ci-dessous ce que j'ai VÉRIFIÉ sur le disque (pas d'affirmation non vérifiée) :
- `public/_shared/geo-data/sahel/sahel-countries.geojson` contient exactement `Mali`, `Niger`, `Burkina Faso` (3 features, Polygon/MultiPolygon réels).
- `public/_shared/geo-data/sahel/libya-outline.geojson` EXISTE déjà — Libye en GeoJSON réel, pas à générer.
- Drapeaux présents : `ml.png`, `bf.png`, `ne.png` dans `public/_shared/flags/`. **`ly.png` (Libye) ABSENT** — confirmé par `ls`, liste complète : ao,au,bf,cn,de,es,fr,gb,ma,ml,ne,ng,no,sn. Asset manquant à récupérer.
- `ProtoCarto_ContinentDraw.tsx` : pattern de trace multi-pays (`geoMercator().fitExtent` + `geoPath` + `strokeDasharray`/`strokeDashoffset` décalé par pays + fill qui monte + grille parchemin + grain papier + balayage lumière). C'est la base généralisable.
- `ProtoEffect_Fracture.tsx` : fracture zigzag déterministe (`random()` seedé, PAS Math.random) qui traverse UN path pays via 2 `clipPath` (moitié A/moitié B) + shake + debris + vignette + virage couleur ocre→rouge. Actuellement câblé sur `SENEGAL_PATH` (un seul pays, un seul centroïde) — généraliser à un GROUPE de 3 pays est un travail neuf (détaillé §4).
- `SahelAttackArrow.tsx` : **Mapbox-only** (`map.project()`, `mapboxgl.Map`). **Non réutilisable tel quel** en d3-geo pur — à réécrire en une version SVG qui projette via `projection(coord)` (la fonction d3 `geoMercator()`, pas Mapbox). Je le signale explicitement en §6.
- `LiptakoRevealSVG9x16.tsx` / `ResourcesRevealSVG9x16.tsx` : fond fixe `#EBE0C8` (Liptako) / dégradé `#eadbba→#d2be97` (Resources) — parchemin crème plus clair/plus rosé que la carte (`#e4ddca`/`#d6cdb4`). Proches mais PAS identiques — recolorage nécessaire, mapping en §5.
- `CtaCard.tsx` : fond = **image JPEG** (frame vidéo longue) + fond navy `#16213a`, PAS parchemin. C'est une rupture de registre supplémentaire non mentionnée dans la direction ("une seule rupture, au moment CEDEAO") — je le signale en Faisabilité comme point à trancher avec Aziz, pas de décision seul.

---

## 1. STORYBOARD PANEL PAR PANEL

Convention : frame absolue = `round(t_seconde * 30)`. Le fichier ancre l'audio à `t=0` → `f=0`.
Sous-titres mot-par-mot = composant karaoké existant (grammaire GGW : mot actif allumé, fond parchemin
semi-transparent, bas de cadre) — piloté directement par `WHISPER_WORDS`, pas de retiming ici.

### PANEL 1 — Ouverture : les 3 pays se tracent (0.0s–4.1s / f0–f123)
**À l'écran** : fond parchemin quadrillé (`PARCH #e4ddca`, grille `GRID #c2a96a`, grain papier), viewBox
1080×1920. Les contours de Mali, Burkina Faso, Niger se tracent au `strokeDashoffset` (NAVY `#16213a`),
décalés dans le temps (ordre : Mali f0-f36, Burkina f18-f54, Niger f36-f72 — chevauchement volontaire,
pas de séquence figée un par un). Le fill ocre (`OCRE #e7bd78` → `OCRE_DARK #bf9442`) monte 15f après
chaque trace individuel.
**Geste précis** : identique au pattern `perCountry()` de `ProtoCarto_ContinentDraw` mais projection
`geoMercator().fitExtent()` calée sur la bbox des 3 pays sahéliens SEULS (pas l'Afrique entière) — cadrage
serré portrait, les 3 pays occupent le tiers central-haut du cadre 1080×1920 pour laisser la place aux
gestes suivants en dessous.
**Enchaînement** : aucun panel avant — c'est le premier frame. Respiration `breath` (sinus, amplitude 0.005)
active dès f0, jamais de cut.
**Sous-titre actif** : "En moins de trois ans, trois nations ont tout changé en même temps." (mots 0.0→4.08s).

### PANEL 2 — Rupture des alliances : bases qui s'éteignent (5.5s–12.7s / f165–f381)
**À l'écran** : les 3 pays restent visibles (contour fixe, fill stable), 3 petits points-icônes (bases
militaires, coord approx. Gao/Ouahigouya/Niamey — à VALIDER coord précises avant code) s'éteignent un par
un (opacity 1→0.15, `spring` dur damping 10) au rythme des mots "chassent"(5.78s) / "rompent"(8.14s) /
"quittent...CEDEAO"(10.2-11s). Un cordage doré fin (repris du geste `bondDraw` de Liptako, mais INVERSÉ :
il se DÉFAIT — `strokeDashoffset` va de 0 vers `len`, pas l'inverse) reliant les 3 pays à un point hors-cadre
(symbolisant "CEDEAO"/alliance extérieure) se rétracte et disparaît sur "quittent la CEDEAO" (f306-f330).
**Geste précis** : `interpolate(frame, [f_mot_start, f_mot_start+18], [1, 0.15])` par base ; cordage =
`strokeDashoffset: len * progress` avec `progress` qui va 0→1 (défait) au lieu de 1→0 (tracé).
**Enchaînement** : la carte NE BOUGE PAS de cadrage — seuls des éléments s'ajoutent/s'enlèvent dessus.
Continuité totale du panel 1.
**Sous-titre actif** : "Ils chassent leurs partenaires militaires, rompent leurs alliances historiques,
et quittent la CEDEAO pour bâtir quelque chose de nouveau."

### PANEL 3 — La Libye entre en scène (14.3s–17.6s / f429–f528)
**À l'écran** : le cadre s'ÉLARGIT (pas un cut — un zoom-out progressif du `viewBox` ou de la `projection`,
piloté par `interpolate`) pour révéler la Libye en haut du cadre (nord), au-dessus des 3 pays AES qui
restent visibles en bas, dans une continuité de MÊME projection (recalcul `fitExtent` sur bbox Mali∪Niger∪
Burkina∪Libye, PAS un remplacement de composition). La Libye se trace exactement comme au panel 1
(`strokeDashoffset`, fill ocre qui monte) sur "Tout bascule en 2012" (14.36-15.98s) puis "la Libye
s'effondre" (16.6-17.62s).
**Geste précis** : zoom-out = `projection.fitExtent()` recalculé frame par frame n'est PAS interpolable
nativement (fitExtent recalcule tout instantanément) → la vraie technique : garder LA MÊME projection
(calée sur la bbox élargie dès le départ, calculée une fois au montage), et faire apparaître/disparaître
la Libye par simple opacity + son propre trace, SANS bouger la caméra. Le "zoom-out" perçu vient du fait
que la Libye apparaît dans un espace déjà présent mais vide (au-dessus), pas d'un vrai mouvement de
projection. **Ceci est un choix de mise en scène tranché ici** : pas de mouvement de caméra artificiel
(cf. contrainte réalisateur "PAS de mouvement de caméra artificiel"), la projection finale est fixée UNE
FOIS pour toute la vidéo dès le panel 1 (bbox = Mali∪Niger∪Burkina∪Libye), et le cadrage panel 1 n'est
qu'un CROP visuel (masque/`viewBox` qui s'élargit) sur cette même géométrie sous-jacente. C'est le geste
juste : la géométrie ne bouge jamais, seul ce qu'on DÉCIDE de montrer/cacher (opacity, masque) change.
**Enchaînement** : aucun cut — extension du cadre déjà en place, la Libye rejoint une carte déjà connue.
**Sous-titre actif** : "Tout bascule en 2012, quand la Libye s'effondre :"

### PANEL 4 — Libye : drapeau → gris → rouge, contagion vers le Mali (18.9s–22.9s / f567–f687)
**À l'écran** : le drapeau libyen (aplat couleur — voir §2 pour le choix tranché) apparaît dans le polygone
Libye sur "Armes et combattants" (18.98s), PUIS vire au gris terne sur "descendent vers le sud" (19.54-
19.96s), PUIS au rouge crise (`CRISIS #b23a2e`) sur "le nord du Mali s'enflamme" (21.58-22.92s). Une traînée
de points (pas une flèche Mapbox — voir §6) migre de la Libye vers le nord du Mali le long d'une trajectoire
SVG fixe (`<path>` avec `FlowDots`-like pattern, technique déjà prouvée dans `ResourcesRevealSVG9x16`
`FlowDots`), teintée rouge progressif. Le nord du Mali (sous-région du polygone Mali, approximée par un
cercle/tache à la latitude ~18-20°N) s'embrase en rouge en fondu.
**Geste précis** : chorégraphie couleur exacte en §3.
**Enchaînement** : la Libye reste dans le MÊME cadre que le panel 3 (pas de nouveau cadrage), seule sa
couleur/état change. Le Mali (déjà tracé au panel 1) reçoit juste une tache de couleur en overlay — pas de
redessin de son contour.
**Sous-titre actif** : "armes et combattants descendent vers le sud, et le nord du Mali s'enflamme."

### PANEL 5 — France + ONU : points tenus, pas les campagnes (24.5s–29.3s / f735–f879)
**À l'écran** : 2 points pulsants (villes-clés tenues, ex. Bamako + Gao/Tombouctou — coord à valider) 
apparaissent sur le territoire malien en bleu-blanc (France, `#4a6fa5` neutre, PAS le bleu-blanc-rouge
plaqué façon icône) et bleu ONU (`#5b92c9` ou nuance proche, à valider Aziz — pas de drapeau plaqué ici,
juste un point + halo, cf. contrainte "points/pulses" du brief). Un halo circulaire pulse autour d'eux
(cercle `r` oscillant, `Math.sin`) MAIS le fond rouge de contagion (panel 4) continue de couvrir le
territoire alentour ("campagnes") — DONC les points restent des îlots nets dans une mer rouge diffuse.
**Geste précis** : `pulse = 0.5 + 0.5*Math.sin(frame*0.16)`, halo `r = 8 + 12*pulse`, opacity du halo
`0.35*(1-pulse)` (pattern déjà utilisé dans `RESOURCE_POINTS` de `ProtoCarto_ContinentDraw`, réemployé).
**Enchaînement** : toujours le même cadre Mali/Libye ; le rouge de contagion (panel 4) NE RECULE PAS
— au contraire il se stabilise en fond, les points France/ONU sont des taches nettes par-dessus,
visuellement "ils tiennent des points, pas la zone".
**Sous-titre actif** : "La France, puis l'ONU interviennent — mais tiennent les villes, pas les campagnes."

### PANEL 6 — Dix ans plus tard : le rouge s'étend (30.3s–35.8s / f909–f1074)
**À l'écran** : la zone rouge (contagion panel 4-5) s'ÉTEND visuellement — le polygone teinté rouge
grandit en couvrant une plus grande fraction du territoire Mali (et déborde légèrement sur le nord Burkina/
Niger), MAIS les 2 points France/ONU restent figés à la même taille (ils NE grandissent PAS) — c'est le
contraste qui porte "plus de territoire qu'en 2012". Un tick/jauge discret (petit texte cartouche parchemin,
PAS un chiffre géant qui casse l'épure) peut marquer "2012 → 2022" en fond.
**Geste précis** : rayon/emprise de la tache rouge = `interpolate(frame, [f909, f1074], [emprise2012,
emprise2022])` où l'emprise est un simple `<circle>` ou `<path>` flouté (`feGaussianBlur`) dont le rayon
augmente — PAS un nouveau polygone dessiné (reste dans l'esprit "couleur qui gagne du terrain", pas un
symbole nouveau).
**Enchaînement** : suite directe et continue du dégradé rouge en cours depuis le panel 4 — aucune rupture,
juste amplification.
**Sous-titre actif** : "Dix ans plus tard, les groupes armés contrôlent PLUS de territoire qu'en 2012."

### PANEL 7 — Les militaires prennent le pouvoir (37.4s–41.2s / f1122–f1236)
**À l'écran** : les 3 emblèmes des pays AES (Mali/Burkina/Niger) — repris du même triangle vertical que
Liptako (`MALI`/`NIGER`/`BURKINA` positions) — POP en bas du cadre pour la première fois (spring, comme
`maliPop`/`nigerPop`/`burkinaPop` de `LiptakoRevealSVG9x16` lignes 46-51, réemployé À L'IDENTIQUE) mais
teintés KAKI (`#4a4f36` env., à valider) au lieu de leur drapeau — signal visuel "pouvoir militaire" avant
même la couleur nationale. Le rouge de contagion du haut de cadre s'atténue en toile de fond (dim 0.3) pour
faire de la place visuelle à ce nouveau geste sans le noyer.
**Geste précis** : `spring({damping:11, stiffness:140})` par embleme, décalés (f1122, f1140, f1158)
identique au timing Liptako original (58f d'écart devient ~18f ici, à recaler sur le rythme du script qui
est plus rapide que le beat long-form).
**Enchaînement** : c'est la PREMIÈRE apparition des emblèmes triangle — ils naissent ici en bas du cadre
déjà connu (carte Mali/Niger/Burkina/Libye en haut), pas un nouveau décor : ils s'ajoutent EN DESSOUS de la
carte, dans l'espace jusque-là vide du cadre 1080×1920 (la carte n'occupe que le tiers/moitié haute).
**Sous-titre actif** : "Face à cet échec, les militaires prennent le pouvoir dans les trois pays."

### PANEL 8a — Menace CEDEAO (42.5s–45.4s / f1275–f1362)
**À l'écran** : un sceau/cachet CEDEAO (cercle sombre, texte gravé "CEDEAO", teinte menaçante `#6b1f1f`
sombre) apparaît en surimpression au-dessus du triangle des 3 emblèmes kaki, grossissant lentement
(`scale` 0.8→1.05, spring mou) — posture d'intimidation, PAS encore de fracture.
**Geste précis** : `scale = interpolate(frame,[f1275,f1362],[0.8,1.05])`, `opacity` montant 0→0.9.
**Enchaînement** : le sceau vient recouvrir une partie du triangle déjà en place (occlusion partielle),
sans cacher la carte du haut. Toujours le même cadre.
**Sous-titre actif** : "La CEDEAO menace d'une intervention armée."

### PANEL 8b — RUPTURE : la carte se fracture (46.8s–50.8s / f1404–f1524)
**LA rupture de registre unique.** Voir §4 pour la chorégraphie détaillée. En résumé : sur "va produire
l'inverse" (48.3-49.56s), une ligne de fracture zigzag traverse le BLOC ENTIER (les 3 pays AES + le sceau
CEDEAO menaçant), le fond vire du parchemin ocre vers un mode plus sombre/saturé de crise (`mode="sombre"`
de `ProtoEffect_Fracture`, adapté), shake caméra bref, debris éjectés de la faille. Sur "l'effet recherché"
(50.28-50.82s), les 2 moitiés commencent déjà à se RECOMPOSER (pas d'attente) vers le panel suivant : le
sceau CEDEAO recule/s'efface (`opacity`→0, `scale`→0.7) car "l'effet inverse" = son échec, pas une victoire.
**Enchaînement** : c'est un cut visuel FORT mais toujours dans le MÊME cadre SVG (aucun changement de
composition/route Remotion) — la rupture est un ÉVÉNEMENT dans la scène, pas un montage. Le fond
"redevient" parchemin en sortie de fracture (recompose→1) juste avant le panel 9, pour repartir propre sur
le geste Liptako qui suit.
**Sous-titre actif** : "Cette menace... va produire l'inverse de l'effet recherché."

### PANEL 9 — Naissance de l'AES (52.6s–60.5s / f1578–f1815)
**À l'écran** : reprise QUASI LITTÉRALE de `LiptakoRevealSVG9x16` — triangle Mali/Niger/Burkina (déjà
présent depuis le panel 7, donc PAS besoin de re-pop les emblèmes : ils sont déjà là, on enchaîne
directement sur le geste "cordages qui SE FORMENT" — sens inverse du panel 2 où ils se défaisaient) +
drapeaux réels qui remplacent le kaki (transition kaki→drapeau, `flagOp` spring) + sceau central qui se
scelle (wax seal rouge, symbole gravé, anneau) + cartouche titre "L'ALLIANCE DES ÉTATS DU SAHEL" + date
"16 SEPTEMBRE 2023". Recolorage fond obligatoire — voir §5.
**Geste précis** : réemploi direct du code Liptako (bondDraw, sealFadeOp, symbolDraw, rimDraw, titleOp,
dateOp) SAUF that les emblèmes n'ont plus besoin de "pop" (`maliPop`/`nigerPop`/`burkinaPop`) puisqu'ils
existent déjà depuis le panel 7 — remplacer leur apparition par une simple TRANSITION DE COULEUR
kaki→drapeau au même timing que `flagOps` originaux.
**Enchaînement** : le triangle d'emblèmes est LE MÊME triangle que celui du panel 7/8 (continuité totale
des positions MALI/NIGER/BURKINA) — seul son état visuel évolue (kaki menacé → recomposé → scellé).
**Sous-titre actif** : "Le 16 septembre 2023, les trois pays scellent leur union : naît l'Alliance des
États du Sahel."

### PANEL 10 — Les ressources : levier de l'Alliance (62.1s–70.9s / f1863–f2127)
**À l'écran** : reprise quasi littérale de `ResourcesRevealSVG9x16` — bouclier A·E·S qui se dessine
au-dessus du même triangle (ou en overlay recentré), 3 veines or/uranium/pétrole rayonnant vers
Mali/Burkina (or) et Niger (uranium+pétrole), `FlowDots` animés le long des veines. Recolorage fond —
voir §5.
**Geste précis** : réemploi direct (shieldRimDraw, orDraw/uraniumDraw/petroleDraw, FlowDots, cartouches
OR/URANIUM/PETROLE, noms pays).
**Enchaînement** : le bouclier apparaît DANS le même cadre parchemin (recoloré), au-dessus/à la place du
sceau AES qui vient de se sceller — transition de forme (sceau→bouclier) mais MÊME famille visuelle
(cercle héraldique doré), pas de rupture.
**Sous-titre actif** : "Pour tenir face aux sanctions, l'Alliance s'appuie sur un levier : l'or du Mali et
du Burkina Faso, l'uranium et le pétrole du Niger."

### PANEL 11 — Statu quo de 60 ans (72.3s–83.0s / f2169–f2490)
**À l'écran** : un compteur count-up "60" (pattern donut/count-up de `SceneBilanV3.tsx`, réemployé) monte
de 0 à 60 sur "vieux de SOIXANTE ANS" (74.76-77.6s), inscrit dans un cartouche parchemin ancré en haut du
cadre (dans l'espace au-dessus du triangle AES, qui reste visible en dessous, stable, respirant). Sur
"Reste à savoir si cette nouvelle alliance va tenir dans le temps" (79.2-83.06s), le compteur s'efface
doucement et la carte entière respire en silence (ANTI-STATIQUE : `breath` sinus + balayage lumière déjà
prévus dans le pattern de base) — c'est le seul moment de pur silence visuel du Short, à ASSUMER (voir §7).
**Geste précis** : count-up = `Math.round(interpolate(frame,[f2183,f2249],[0,60]))` avec un donut
`strokeDasharray` qui se remplit en parallèle (repris de `SceneBilanV3`).
**Enchaînement** : le triangle AES scellé (panel 9-10) reste visible et stable en dessous du cartouche
count-up — pas de nouveau cadrage.
**Sous-titre actif** : "En trois ans, le Sahel a fait tomber un statu quo vieux de SOIXANTE ANS. Reste à
savoir si cette nouvelle alliance va tenir dans le temps."

### PANEL 12 — CTA (84.0s–91.86s / f2520–f2756)
**À l'écran** : `CtaCard.tsx` réutilisé SANS MODIFICATION (consigne explicite du brief : "NE PAS toucher").
**ATTENTION** (signalé, pas tranché) : ce panel introduit une 2e rupture de registre (image vidéo réelle +
fond navy, pas parchemin) non prévue dans la direction ("une seule rupture, au moment CEDEAO"). Je ne
corrige pas ce point seul — voir §6 Faisabilité, à trancher avec Aziz.
**Sous-titre actif** : "L'histoire complète — la Libye, Kidal, le vrai coût humain — dans la vidéo longue.
Lien en description."

---

## 2. STYLE DRAPEAU — choix tranché

**Choix : APLAT/DÉGRADÉ de la couleur dominante du drapeau, PAS l'image clippée**, pour les 3 pays AES
(Mali/Burkina/Niger) sur la carte elle-même (panels 1-8). Réserve : dans le triangle d'emblèmes (panels
7-9), l'image clippée RESTE utilisée (`LiptakoRevealSVG9x16` le fait déjà, cercle ~150px de rayon, assez
grand pour rester lisible).

**Justification lisibilité** : les polygones Mali/Burkina/Niger sur la carte (panels 1-8) sont petits (le
cadre serré fait ~1/3 de la hauteur du cadre pour les 3 pays réunis, chaque pays individuellement fait
quelques centaines de pixels de large seulement) et le Burkina Faso en particulier a une forme compacte
mais le Mali et le Niger sont ALLONGÉS/CONCAVES (le Mali s'étire nord-sud sur 1300+ km, le Niger a une
forme en sablier). Une image de drapeau clippée (bandes verticales Mali/Niger, horizontales Burkina) dans
un polygone aussi étiré donnerait des bandes déformées/étirées non reconnaissables comme un drapeau — le
motif perdrait tout son sens à cette échelle et deviendrait un bruit visuel. Le clip fonctionne bien dans
`LiptakoRevealSVG9x16` PARCE QUE le polygone-support est un bouclier RÉGULIER (forme fixe, proportions
contrôlées par le design), pas un polygone géographique réel arbitraire.

**Concrètement** : `fill` du polygone pays = dégradé 2 tons dominants du drapeau (ex. Mali `#14A64A`
vert→`#CE1126` rouge sur un axe vertical léger avec bande dorée médiane suggérée par une seconde couche
`opacity` réduite ; Niger orange `#E05206`→blanc→vert `#0DB02B` en 3 bandes horizontales fines si le
polygone le permet, sinon aplat orange dominant + liseré vert bas ; Burkina rouge `#EF2B2D` haut / vert
`#009E49` bas, séparation horizontale nette car le Burkina est plus compact et supporte 2 bandes lisibles).
Le contour reste NAVY comme les autres pays (continuité stylistique avec panel 1).

**Exception Libye** (panel 3-4) : le drapeau libyen actuel est un DRAPEAU-SYMBOLE unique (rouge-noir-vert +
croissant/étoile, depuis 2011) — traiter en aplat rouge-noir-vert simplifié (bandes horizontales, le
polygone libyen est suffisamment large est-ouest pour porter 3 bandes horizontales lisibles), PUIS vire
gris/rouge selon §3 (le motif de bandes disparaît dès la bascule gris — un aplat suffit à ce stade,
cohérent avec l'économie de moyens du geste).

## 3. GESTE LIBYE — chorégraphie exacte

Toutes les frames ci-dessous en absolu (`f = round(t*30)`), calées sur le Whisper fourni.

| t (s) | frame | Propriété | Valeur | Sens |
|---|---|---|---|---|
| 14.36–15.98 | f431–f479 | `libyaDraw` (strokeDashoffset) | 1→0 | contour Libye se trace |
| 16.6–17.62 | f498–f529 | `libyaFillOp` | 0→1 | aplat drapeau (rouge-noir-vert) monte |
| 18.98–19.54 | f569–f586 | `libyaFlagState` | 1 (plein drapeau) | tenu stable ~0.5s (lecture) |
| 19.54–19.96 | f586–f599 | `libyaGrisK` | 0→1 | le fill vire au gris terne `mix(drapeau, "#5c5c54", grisK)` |
| 19.96–21.32 | f599–f640 | `libyaGrisK` | 1 (tenu) | gris tenu pendant "descendent vers le sud" |
| 21.32–22.92 | f640–f688 | `libyaCrisisK` | 0→1 | le gris vire au rouge crise `mix("#5c5c54", "#b23a2e", crisisK)` |
| 21.32–22.92 | f640–f688 | `flowDotsT` (le long d'un `<path>` Libye→nord Mali, coords géo réelles projetées) | 0→1 | traînée de points rouges migre vers le sud, technique `FlowDots` réemployée telle quelle (déjà générique, prend n'importe quel `d`) |
| 22.92–24.5 | f688–f735 | `maliNorthStainOp` | 0→0.7 | tache rouge diffuse (cercle flouté `feGaussianBlur`, centré ~18-20°N sur le Mali) apparaît, ancrée sur vraies coords (à préciser : Kidal ~18.44°N/1.41°E, zone de départ de la crise 2012) |
| 24.5+ (panel 5) | f735+ | Libye reste rouge fixe en fond, "consommée" | — | la Libye ne redevient JAMAIS parchemin — c'est un fait acquis, pas un cycle |
| ~30.3s (panel 6) | f909+ | le focus visuel revient sur le bloc AES (Libye passe en `opacity: 0.5` dim, jamais masquée) | — | "on revient sur l'AES qui se redessine", tel que demandé par le brief — pas un cut, un simple `dim` |

Propriétés animables résumées : `strokeDashoffset` (trace), `opacity` (montée fill/tache), `mix()` couleur
(la fonction `mix()` déjà écrite dans `ProtoEffect_Fracture.tsx` lignes 397-404, réemployable telle quelle
pour interpoler hex→hex), `strokeDasharray`/`strokeDashoffset` négatif pour `FlowDots` (déjà générique dans
`ResourcesRevealSVG9x16`).

## 4. GESTE FRACTURE CEDEAO — généralisation de ProtoEffect_Fracture

`ProtoEffect_Fracture.tsx` est câblé sur **1 seul path** (`SENEGAL_PATH`, `SENEGAL_CENTROID`) avec 2
`clipPath` demi-plans (`halfA`/`halfB`) qui séparent la zone en 2 moitiés selon une ligne diagonale fixe
(`x0,y0 → x1,y1` codés en dur en fonction de `MAP_X`/`MAP_Y`/`MAP_SCALE`, PAS dépendants de la géométrie du
pays lui-même — c'est en réalité un split de l'ESPACE ÉCRAN, pas du polygone). **Bonne nouvelle** : ça
simplifie la généralisation, car le clip ne suit pas le contour du pays, il suit une diagonale écran fixe.
Généraliser au "bloc 3 pays + sceau CEDEAO" revient à :

1. Recalculer `x0,y0,x1,y1` de la fracture pour traverser TOUTE la zone du triangle d'emblèmes + carte du
   dessus (pas juste un polygone), en gardant le même algorithme `fracturePath()` (zigzag `random()` seedé
   — déterministe, donc reproductible, PAS de nouveau random à chaque render).
2. Les 2 groupes `<g clipPath="url(#halfA)">` / `<g clipPath="url(#halfB)">` englobent CETTE FOIS tout le
   contenu du cadre (carte du haut + triangle emblèmes + sceau CEDEAO), pas un seul path pays — techniquement
   il suffit d'entourer `<g clipPath=...>` autour du `<svg>` entier déjà construit dans les panels
   précédents, PAS de reconstruire une nouvelle géométrie.
3. Le shake (`shakeX`/`shakeY`), les debris, le virage `crisisK`/`darkK`, la vignette, et la logique de
   "verrouillage" (recompose) sont directement réutilisables SANS modification — ils opèrent sur des
   `<g>` génériques, pas sur la forme Sénégal spécifiquement.
4. Différence de fond narratif : dans `ProtoEffect_Fracture`, la fracture est PERMANENTE jusqu'à la fin du
   clip (le Sénégal reste fracturé, c'est un hook qui ouvre une question). Ici, la fracture doit se
   RECOMPOSER RAPIDEMENT (le mécanisme `recompose`/`recRaw` EXISTE DÉJÀ dans le fichier, lignes 178-186)
   car le panel 9 (naissance AES) doit repartir sur un cadre PROPRE et lisible — utiliser le même
   `recompose` mais accéléré (fenêtre ~20f au lieu de ~60f, car le Short n'a pas le luxe de 92s pour une
   seule respiration comme le hook long-form de 22s dédiés à ce seul beat).
5. Le sceau CEDEAO menaçant (panel 8a) doit reculer/s'effacer PENDANT la fracture, pas après — `opacity`
   du sceau interpolée en //, décroissant sur la même fenêtre que `crackProg`.

**Faisabilité** : PROUVÉ pour le mécanisme de clip/shake/debris/recompose (code existant, juste besoin de
changer les bornes géométriques et regrouper plus de contenu dans les 2 `<g>`). À PROTOTYPER : la
généralisation à "tout le cadre" plutôt qu'"un seul path" — le principe est simple mais jamais testé sur un
contenu aussi dense (carte + triangle + sceau simultanément dans les 2 moitiés clippées) ; risque de couches
qui se chevauchent bizarrement au clip si mal ordonnées en z-index SVG (l'ordre des `<g>` dans le DOM SVG
fait l'empilement).

## 5. PALETTE DE RECOLORAGE Liptako/Resources

| Élément | Couleur actuelle | Couleur cible (carte vivante) |
|---|---|---|
| Fond Liptako | `#EBE0C8` (parchemin crème clair) | `#e4ddca` (`PARCH`, identique carte) |
| Fond Resources (dégradé) | `#eadbba` → `#d2be97` | `#e4ddca` → `#d6cdb4` (`PARCH`→`PARCH_DARK`, identique carte) |
| Grille/quadrillage Liptako | `#A38D64` (lignes fines) | `#c2a96a` (`GRID`, identique carte) — actuellement proche mais pas exact, à aligner |
| Grille/quadrillage Resources | `#c2ac83` | `#c2a96a` (`GRID`) — idem, à aligner |
| Hachures emblèmes (`lip9-hatch-dense`) | `#2C1E16` (brun-noir) | GARDER — c'est un motif de texture, pas une couleur de registre carte, ne pas toucher |
| Bordures cadre (`rect stroke`) | `#2C1E16` | `#16213a` (`NAVY`, identique contour pays carte) — pour que le cadre du cartouche s'aligne visuellement avec le contour NAVY des pays tracés plus haut dans le Short |
| Cartouches ressource (OR/URANIUM/PETROLE bg) | `#ebd69f` / `#aedda4` / `#322c26` | GARDER tels quels — ce sont des accents de lisibilité, pas le registre de fond, cohérents avec `OCRE`/`OCRE_DARK` de la charte carte |
| Texte titre/labels | `#1A1008` | `#16213a` (`NAVY`) pour aligner avec la couleur de texte utilisée ailleurs dans la carte (actuellement Liptako utilise un brun-noir légèrement différent du navy carte) |

**Principe du mapping** : ne PAS recolorer les éléments héraldiques dorés/rouges (sceau, bouclier, veines
ressources) — ce sont des ACCENTS volontairement distincts qui font sens (or=or, rouge=sceau officiel). Le
recolorage porte UNIQUEMENT sur le FOND et les lignes structurelles (grille, cadre, texte) pour que l'œil
ne perçoive pas de rupture de teinte de fond en passant du panel 8b/9 (carte) aux panels Liptako/Resources —
c'est un ajustement de 2-3 valeurs hex, pas une refonte du composant.

## 6. FAISABILITÉ (honnête, geste par geste)

| Geste | Statut | Détail |
|---|---|---|
| Trace multi-pays + fill ocre (panel 1) | **PROUVÉ** (brique `ProtoCarto_ContinentDraw.tsx`) | Généraliser de "tous pays Afrique" à "3 pays Sahel filtrés du geojson dédié" — trivial, geojson déjà exact. |
| Bases qui s'éteignent + cordage qui se défait (panel 2) | **À PROTOTYPER** | Coords précises des "bases" à définir (le script ne les nomme pas explicitement — zone approximative Gao/Ouahigouya/Niamey à valider avec Aziz ou rester abstrait : 3 points génériques sans nom de ville affiché, pour éviter d'affirmer une localisation non sourcée). |
| Élargissement de cadre Libye SANS mouvement de caméra (panel 3) | **À PROTOTYPER, risque moyen** | La technique proposée (bbox complète fixée dès le départ, "élargissement" = simple révélation d'un espace déjà présent) n'a jamais été testée dans ce repo à ma connaissance — je n'ai pas trouvé de proto qui fait "fitExtent fixe + reveal progressif d'une zone via masque". C'est un pattern nouveau, cohérent avec la contrainte "pas de mouvement de caméra artificiel", mais demande un premier test isolé avant d'aller plus loin. |
| Libye drapeau→gris→rouge + FlowDots contagion (panel 4) | **PROUVÉ** pour les sous-parties (`mix()` existe, `FlowDots` existe) — **à assembler** | Aucun obstacle technique identifié, juste un assemblage neuf de briques existantes. |
| Points France/ONU pulsants (panel 5) | **PROUVÉ** (pattern `RESOURCE_POINTS` de `ProtoCarto_ContinentDraw`, identique) | — |
| Extension de la tache rouge "10 ans plus tard" (panel 6) | **À PROTOTYPER, risque faible** | Simple interpolation de rayon/opacity d'un cercle flouté, aucun obstacle technique. |
| Triangle emblèmes kaki qui pop (panel 7) | **PROUVÉ** (réemploi direct du spring Liptako, juste substitution de couleur fill) | — |
| Sceau CEDEAO menaçant qui grossit (panel 8a) | **PROUVÉ** (simple scale+opacity spring, aucune brique complexe requise) | — |
| Fracture généralisée au bloc 3 pays + sceau (panel 8b) | **PROUVÉ pour le mécanisme** (voir §4) — **à prototyper pour l'assemblage dense** | Le risque identifié : ordre d'empilement SVG quand on clippe un ENSEMBLE de couches (carte+triangle+sceau) plutôt qu'un seul path plat — jamais testé à cette densité. |
| Transition kaki→drapeau sur emblèmes déjà en place (panel 9) | **À PROTOTYPER, risque faible** | Le code Liptako fait actuellement civil→drapeau (pas kaki→drapeau) sur des emblèmes qui POPENT — ici les emblèmes existent déjà (panel 7), il faut juste retirer le `spring` de pop et garder uniquement la transition de couleur/flagOp. Modification mineure du fichier réutilisé. |
| Réemploi Liptako/Resources recolorés (panels 9-10) | **PROUVÉ** (fichiers existants, juste substitution de 5-6 valeurs hex, voir §5) | — |
| Count-up 60 ans (panel 11) | **PROUVÉ** (pattern `SceneBilanV3.tsx` déjà utilisé ailleurs) | — |
| SahelAttackArrow pour flèches France/ONU | **CANNOT DO tel quel** | Le composant est câblé sur `mapboxgl.Map`/`map.project()` — incompatible avec un pipeline 100% d3-geo/SVG. **Alternative retenue** : ne pas utiliser de flèche du tout pour ce panel (le brief dit "points/pulses + ÉVENTUELLEMENT des flèches" — je choisis l'option SANS flèche, plus sûre, car réécrire une variante SVG pure de ce composant est un travail non prévu dans le brief et non trivial (reprojection `geoPath`/`projection()` à la main pour suivre des waypoints). Si Aziz veut une vraie flèche, c'est un item neuf à chiffrer séparément). |
| CtaCard.tsx (panel 12) | **PROUVÉ** (fichier existant, ne pas toucher) — **MAIS signalement de rupture de registre non tranchée** | Ce fichier utilise un fond IMAGE + navy, ce qui constitue une 2e rupture de registre non prévue par la direction ("une seule rupture, au moment CEDEAO"). Je ne corrige pas ce point seul : soit (a) on assume 2 ruptures (CEDEAO + CTA final, cohérent car le CTA est structurellement toujours différent dans ce format de Short), soit (b) on demande un nouveau CtaCard en registre parchemin pur. Je recommande (a) — le CTA final est un "cadre hors diégèse" (call-to-action, pas narration), l'audience accepte naturellement qu'il rompe le registre, ce n'est pas la même chose qu'une rupture EN PLEIN récit. Mais c'est un jugement de goût, pas un fait technique — à valider avec Aziz. |
| Asset drapeau Libye manquant | **BLOQUANT MINEUR** | `ly.png` absent de `public/_shared/flags/`. Comme le geste Libye (panel 3-4) utilise un APLAT couleur et non une image clippée (§2), CE N'EST PAS BLOQUANT pour ce storyboard précis — mais à signaler si un futur geste veut afficher le vrai drapeau libyen en image. |

## 7. RYTHME — tenue sur 92s dans un seul cadre continu

**Risque identifié** : le cadre reste géographiquement le même (carte Sahel+Libye) pendant environ 60% du
temps total (panels 1 à 8b, soit ~50s sur 92s) avant que le triangle d'emblèmes ne prenne le relais visuel
(panels 7-11). Le risque de lassitude se situe précisément aux panels 5-6 (24.5s-35.8s, ~11s) où le geste
est le plus statique en apparence : 2 points qui pulsent + une tache rouge qui grandit lentement, sans
nouvel élément structurel qui apparaît. C'est le point mort potentiel du Short.

**Comment je le romps (sans changer de décor)** :
1. Le contraste de VITESSE de la tache rouge (panel 6, extension sur 5.5s / 165f) doit être perceptible
   frame à frame, pas un fondu mou — utiliser une courbe d'easing marquée (ease-in cubique) plutôt qu'une
   interpolation linéaire, pour que l'œil perçoive une ACCÉLÉRATION du danger plutôt qu'un glissement plat.
2. Le grain papier + balayage lumière (`lightSweep`, déjà dans `ProtoCarto_ContinentDraw`) doivent rester
   actifs en continu sur TOUTE la durée — c'est le filet anti-statique minimal qui empêche l'image de
   paraître figée même quand rien de narratif ne bouge.
3. Micro-shake/pulse sur les 2 points France/ONU (déjà prévu, `pulse = sin(frame*0.16)`) donne un rythme
   cardiaque perceptible — à ne pas couper pendant ces 11s, c'est le seul mouvement "vivant" du panel.
4. Le sous-titre karaoké mot-par-mot lui-même porte une part du rythme (chaque mot qui s'allume est un
   micro-événement) — sur ce Short, ne JAMAIS laisser un silence de sous-titre de plus de 1s sans qu'un
   geste visuel discret (pulse, grain, sweep) compense.
5. Le vrai pic de relance rythmique reste le panel 8b (fracture) à 46.8s — bien placé aux ~50% du métrage,
   ce qui est un bon point de bascule dramaturgique classique (milieu de vidéo = climax intermédiaire).
   Après la fracture, les panels 9-11 (Liptako/Resources/count-up) sont VISUELLEMENT plus denses
   (drapeaux, sceau, veines, cartouches) donc le risque de lassitude y est plus faible — le risque se
   concentre bien avant la fracture, aux panels 5-6, pas après.

**Verdict rythme** : tenable SI le point 1 (2 points qui pulsent + tache qui grandit, panels 5-6, ~11s) est
traité avec un soin particulier sur l'anti-statique — sinon c'est le segment le plus exposé du Short à un
retour du jugement "ça ne bouge pas assez" déjà rencontré dans les rejets précédents.

---

## RÉSUMÉ FAISABILITÉ GLOBALE

- 8 gestes **prouvés** directement par des briques existantes (panels 1, 5, 6, 7, 9-10 fond, 11, sceau 8a).
- 4 gestes **à prototyper** avant code définitif (élargissement cadre Libye sans caméra — risque moyen ;
  fracture généralisée au bloc dense — risque moyen ; transition kaki→drapeau sur emblèmes déjà en place —
  risque faible ; bases qui s'éteignent — risque faible, dépend juste de coords à définir).
- 1 geste **CANNOT DO tel quel** : `SahelAttackArrow` (Mapbox-only) — alternative retenue : pas de flèche,
  juste points+halos.
- 1 asset **manquant** : `ly.png` — non bloquant ici (aplat couleur choisi), à signaler pour plus tard.
- 1 point **non tranché, remonté à Aziz** : le CTA final (`CtaCard.tsx`) introduit une 2e rupture de
  registre non prévue par la direction — je recommande de l'assumer mais ne tranche pas seul.
