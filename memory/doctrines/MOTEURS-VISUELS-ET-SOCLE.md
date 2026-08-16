# DOCTRINE — LES MOTEURS VISUELS SUR 1 SOCLE (quel moteur pour quelle nature de contenu)

> Complète [[CONTINUITE-SCENE-INTENTION-DABORD]] (l'intention décide) et
> `src/projects/_shared/INTENTION-FORME-INDEX.md` (la forme ensuite). Ce fichier répond au
> chaînon suivant : « je sais quelle forme — quel MOTEUR sait la produire ? ».
> Cousin opérationnel : l'« ARBRE DE DÉCISION SVG ou Mapbox ? » de `memory/ROUTAGE.md`.
> Né de l'analyse d'Aziz (2026-07-17) après AES 90s + Sénégal Pétrole D3 + Soudan.
> ⛔ Ne JAMAIS partir du moteur. Ordre : intention → forme → PUIS ce fichier (sinon = piège des 10 essais).
>
> **Titre originel : « 3 moteurs visuels sur 1 socle »** (2026-07-17). Renommé le 2026-08-15 : il y a
> désormais **5 moteurs**, l'ajout de la MATIÈRE FILMÉE (MiniMax H3) et la bascule du SVG sur un
> générateur dédié (Fable 5) ne tenaient plus dans le chiffre 3. La doctrine, elle, est inchangée.

## Les moteurs, 1 socle

Pas des piliers parallèles : **des moteurs visuels posés sur 1 socle**.
- **Remotion = LE SOCLE** (pas un moteur au même niveau) : orchestre TOUT — timing audio-driven,
  texte, chiffres, transitions, graphes simples, compositing. D3/SVG/Mapbox/H3 vivent DANS Remotion.
  On ne « choisit pas entre Remotion et SVG » : on fait du SVG *dans* Remotion.
- **Les moteurs visuels** produisent l'image animée, chacun pour une nature de contenu différente.

⭐ **Un moteur n'est pas un catalogue de templates.** C'est un REGISTRE D'EXPRESSION : il dit qu'une
porte existe, pas ce qu'il y a derrière. Les exemples donnés ci-dessous montrent l'AMPLITUDE prouvée
de chaque moteur — ils ne bornent pas ce qu'il peut faire. ⛔ Ne jamais lire cette page comme une
liste de choix : lire l'intention d'abord, puis venir chercher quel registre sait la porter.

## Quel moteur pour quelle nature de contenu

| Ce qu'on montre | Moteur dominant | Pourquoi |
|---|---|---|
| **OÙ** — lieu réel, territoire, frontières | **Mapbox** | Géo zoomable + carte vivante (couleurs, frontières, flèches, drapeaux, sprites) |
| **COMBIEN (simple)** — chiffre, barre, courbe standard | **Remotion** | Sait déjà dessiner graphes/chiffres animés |
| **COMBIEN (géométrie complexe)** — flux, réseaux, arcs, projection, choropleth | **D3** | Moteur de calcul de géométrie (pas de « graphiques »). SOUS-EXPLOITÉ |
| **QUOI / COMMENT** — objet, processus, trajet, métaphore | **SVG** | Contrôle total frame-driven, simplifie ce qui serait lourd en After Effects |
| **⭐ QUI** — un acteur humain, un geste, un rapport de force, une charge subie | **`_shared/stick-figure-svg/` (NOS briques)** | ⛔ **Jamais un modèle, jamais Seedance** : le socle stick figure (profil) est validé en production depuis le 2026-07-28 et bat ce qu'un modèle produit. **AVANT de coder, choisir le RÉGIME** : AMBIANT (figurants qui habitent un lieu) vs **DÉMONSTRATIF** (1 perso qui EST l'argument — plus fort, moins cher, à privilégier). Recette : [[SCENE-DEMONSTRATIVE-PERSONNAGE]]. Habillage : [[brique-habillage-stick-figure]] (ne JAMAIS l'improviser). |
| **⭐ LA MATIÈRE** — ce qu'on ne peut ni dessiner ni cartographier : une texture, un geste physique, un lieu filmé, la matière elle-même | **MiniMax H3** (matière filmée générée) | Le seul moteur qui produit du PHOTOGRAPHIQUE/FILMÉ. Sert quand le sujet doit être *vu*, pas schématisé (gaz qui circule dans une conduite, pelleteuse sur un chantier). ⚠️ Coût réel + non déterministe → jamais pour ce qu'un SVG fait aussi bien. Plafond narratif : un insert qui revient toutes les 20 s cesse de faire rupture. |
| **LE LIANT** — texte, chiffre-choc, transition, rythme | **Remotion** (socle) | Toujours |
| **⭐ LE RACCORD** — passer d'un registre à un autre, couper, alterner, rompre l'échelle | **Remotion** (socle) — mais c'est une DÉCISION, pas un réglage | Le montage EST une capacité expressive. Une scène de 30 s n'est pas tenue d'être un seul plan continu : on peut quitter la carte pour un plein écran SVG, revenir, alterner. ⚠️ Trou n°8 du catalogue : aujourd'hui carte→scène SVG se fait au **cut sec** ; le seul vrai raccord inter-registre prouvé est `GlobeToParchemin`. |

⚠️ **PIÈGE VÉCU — la géo réutilisée qui contourne cette table** (beat 4 CFA, 2026-07-26).
Un texte **purement CONCEPTUEL** (une garantie financière, une contrepartie, une réforme juridique)
a été codé en **carte** simplement parce qu'une géo existait déjà dans un beat antérieur — on hérite
de la carte sans jamais repasser par la table. Résultat : la scène rejouait le beat 2 (même géo, même
caméra, mêmes arcs qui pulsent), renommée. **Aucune vérification technique ne détecte ça** : le code
tournait, les timings étaient justes, le rendu était propre.

**Le tell** : si le texte du beat ne contient **aucune relation SPATIALE réelle** (un lieu qui agit sur
un autre lieu) mais seulement un **mécanisme** (garantir, déposer, réformer), alors la carte est un
habillage, pas une réponse — même si le geste visuel *semble* juste. Ligne **QUOI/COMMENT → SVG**.
→ Vérifier le TEXTE avant la FORME, et ne jamais hériter d'une géo par simple continuité.
Détail : [[feedback_pourquoi-le-beat4-cfa-a-marche-repartition-jugement]] · garde-fou opérationnel
(comparer géo + caméra + geste entre beats) : checklist § 2bis de [[CONTINUITE-SCENE-INTENTION-DABORD]].

## 🚦 GATE OUTILLÉ — `moteur-visuel-gate.sh` (posé 2026-08-15, testé 19/19)

> **Pourquoi un hook et pas une règle de plus.** La règle « INTENTION → FORME → MOTEUR → TEMPLATE »
> était DÉJÀ écrite (CLAUDE.md + INTENTION-FORME-INDEX) et elle a quand même été sautée le 2026-08-15.
> Une règle écrite ne force rien : seul un gate outillé bloque
> ([[feedback_regle-ecrite-insuffisante-sans-gate-outille]]).

**Fichier** : `.claude/hooks/moteur-visuel-gate.sh` · branché en `PreToolUse` sur `Bash` et `Edit|Write`.

**Il bloque exactement 2 moments** (ceux où le moteur se décide — pas chaque édition) :
1. **Write d'un NOUVEAU `.tsx` de scène** sans moteur déclaré en en-tête.
   → débloquer en écrivant `// MOTEUR: <registre> — <pourquoi>`. Formes acceptées : `MOTEUR:`,
   `MOTEUR DOMINANT :`, `@moteur`. Hors scope : fichiers existants, `_shared/`, `tests/`, archives,
   non-`.tsx`. ⚠️ `_rnd/` est VOLONTAIREMENT inclus (un proto doit savoir quel registre il teste).
2. **Bash lançant un storyboard vers un modèle externe** avec un brief bridé. Il ne compte PAS des
   mots-clés (ça mesure le vocabulaire, pas la liberté — le brief 4B fautif citait « cutaway » tout en
   l'interdisant). Il détecte les **4 causes réelles** :
   - fermeture explicite d'un registre entier (« ZERO/NO … insert/cutaway/full-screen/character ») ;
   - **concepts déjà écrits par nous** (« OPTION A / OPTION B ») → le modèle illustre au lieu de concevoir ;
   - absence de vraie question ouverte (« propose TON concept ») ;
   - vocabulaire mono-registre (>3 mentions de tracés/pulses contre <2 d'autre chose).

**Test de non-régression** : le gate est vérifié contre le VRAI brief qui a produit les flèches
(`breakdown-acte4/4B/PROMPT-storyboard-4B.txt`) — il doit toujours le bloquer. Suite de tests :
19 cas (blocages ET non-blocages). ⛔ Si un jour le gate gêne, **corriger sa cible, ne pas le retirer** :
c'est le seul mécanisme qui empêche la redite de registre d'une scène à l'autre.

## ⭐⭐ AMPLITUDE PROUVÉE DE CHAQUE MOTEUR (ajouté 2026-08-15)

> **À quoi sert cette section.** Elle dit **jusqu'où chaque moteur est ALLÉ**, pas ce à quoi il est
> limité. Elle existe parce qu'un moteur oublié = une scène rabattue par défaut sur celui qu'on a en
> tête (vécu 2026-08-15 : storyboard Gazoduc 4B entièrement en tracés/flèches, parce que le brief
> n'ouvrait aucune autre porte — la matière filmée, la scène SVG plein écran et le montage étaient
> simplement absents de la question posée).
>
> ⛔ **Deux colonnes, ne jamais les confondre** : **PROUVÉ EN ÉPISODE** (a servi dans une vidéo
> produite) vs **EXISTE, JAMAIS ÉPROUVÉ** (la brique est codée, souvent jamais regardée). Le 2e groupe
> est une réserve d'idées **à découvrir**, pas un acquis : avant d'y bâtir une scène, **RENDRE ET
> REGARDER** la brique (règle « un décor qu'on n'a pas vu est une dette, pas un acquis »).

### MAPBOX — le territoire réel

**Prouvé en épisode :**
- Un territoire se remplit de **sa ressource** au lieu d'un aplat de couleur (`ResourceTextureFill`) — Sénégal.
- Le vrai **drapeau épouse la silhouette** du pays, même en relief (`MapboxCountryFlagDecal`) — Sénégal V3.
- Un **flux relie deux lieux**, caméra qui suit la route (`GeoFlowConnection`) — Soudan (Actes 3/4/5).
- Une **plaque éditoriale** annonce un pays avec sa donnée et sa source (`GeoCountryPlaque`) — 5+ épisodes.
- Un pays **isolé en spotlight**, reste assombri + zone offshore hachurée (`MapboxIsolateZone`) ·
  **balayage lumineux** qui révèle (`SweepRevealTerritory`) · **frontière en fibre optique**
  (`FiberOpticBorderDraw`) — Maroc-Batteries, War-Map Sahel.
- Un concept **s'impose sans quitter la carte** (voile + bloc) et **2-3 mondes se comparent** en volets
  qui glissent (`WarMapDimmedOverlay` / `WarMapSplitScreen`) — AES + Soudan.

**Existe, jamais éprouvé en épisode :** `MapCutaway` (⭐⭐ pourtant noté « le plus réutilisable ») ·
`HeatGradientFill` (choroplèthe dont l'intensité monte avec la voix) · `ContagionFlagSpread` ·
`DominoContagionFill` (couleur qui contamine par vagues, sans flèches) · `GlassmorphismGeoPopup` ·
`SequentialBorderPulse` · `WavingFlagFill` · `LottieGeoAura` · `ImageProjectionFill`.

**Limites dures :** WebGL headless → render **obligatoirement** via `scripts/render-mapbox.sh` (~5 fps,
`jumpTo()` seul, ⛔ `flyTo`/`easeTo`) · drapeau avec pitch : seul `MapboxCountryFlagDecal` tient
(`useClipFlags` dérive, fill-pattern carrelle au dézoom) — cf [[CARTO-OVERLAYS-PRINCIPES]].

### D3 — la géométrie calculée

**Prouvé en épisode :**
- Le **globe orthographique** comme socle d'un récit entier (« vu de l'espace », rotation frame-driven,
  occlusion native) — Soudan mid-form, où il porte l'essentiel de la vidéo.
- La caméra **accompagne un tracé en continu**, sans à-coup (bbox glissante) — Gazoduc Acte 2 (validé 3×).
- Une **carte vivante 9:16 pure SVG/d3-geo** porte un Short entier (contours, drapeaux, jetons) — AES 90s.
- Un **contour de pays isolé et coloré** sans charger de carte — moteur War-Map Sahel.
- **Ancrage zéro-dérive** : jetons et carte dans le MÊME SVG via `project([lon,lat])` → ancrage parfait
  même en mouvement/dézoom. **Avantage décisif sur Mapbox.**

**Existe, jamais éprouvé en épisode** (tous rendus en proto `_rnd/d3-16x9/`) : ⭐⭐ **Chartogram** — le
contour réel d'un pays **se déforme en barre proportionnelle**, « la carte DEVIENT la donnée » (noté
*rare, personne en vulga FR*) · **Cartogramme** (pays redimensionné selon sa valeur) · **Sankey** (flux
ramifiés en rubans proportionnels) · **ForceNetwork** (réseau qui se **recompose physiquement** quand un
lien pivot s'active) · **PieMorph** · **Globe2** (occlusion 3D réelle + terminateur jour/nuit) ·
**carte + panneau data réactif** (16:9, carte 60 % / panneau 40 %).

**Limites dures :** le **SOL** — aplat uni contre le terrain texturé de Mapbox (le « terrain habité »
manque) · le globe **cale sur l'abstrait institutionnel** (un vote, un huis clos) → overlay UI ou
bascule en insert SVG plein écran.

### SVG STRUCTUREL — l'objet, le processus, la métaphore

*(le générateur Fable 5 est traité plus bas ; ici les usages)*

**Prouvé en épisode :**
- Un **jeton géo-ancré** signale un point précis sur la carte (`GisementMarker`) — Sénégal V3.
- Un **personnage vit une scène** (marche, se penche, ramasse) en stick figure d'encre animé par code,
  **sans modèle génératif** (`StickRig`) — Cacao.
- Un **chiffre-choc en cartouche** slide-in + glow synchronisé au son (`StatParchment`) — Peste 1347.
- Une **propagation qui grandit depuis un point**, cercle radial clippé qui déclenche un événement au
  contact (`AtlasExpandingWaveCircle`) — Peste 1347.
- Un **texte qui s'écrit** lettre par lettre (`TypewriterText`) — inserts/combos.

**Existe, jamais éprouvé en épisode :** ⭐ `Proto-TroisGisements-Inserts` (3 mini-inserts **simultanés**
montrant l'installation réelle) · `ProtoInsertMatiereConduite` (proto, pas encore composant) ·
⭐⭐ **~30 composants aboutis à ZÉRO usage** (mai 2026, jamais retouchés), dont : `SurfaceComparison`
(pays à leur **vraie taille**, façon thetruesize) · `CountryStackComparison` (« la France rentre 4× dans
la RDC ») · `WealthScale` (balance riche-en-ressources / pauvre-en-revenus) · **`CrossSection`** (coupe
en tranches) · `GoldVein` (zoom Equal Earth→Mercator + veines depuis une mine) · `EmpireOverlay` ·
`TickerTapeHistory` · `EntityDiagram` · `SmallMultiplesGrid` · `MilitaryMarchLine`.
⚠️ Cause identifiée : ils sont **en bas** de `COMPOSANTS-INDEX.md`, sous une longue table Mapbox
(pattern [[feedback_catalogue-position-liste-et-brief-restrictif]]).

**Limites dures :** ⛔ **jamais un contour de pays à main levée** (géo réelle = `d3-geo` + Natural Earth,
2 échecs avant pivot) · bataille en rectangles top-down **rejetée** (« un rectangle reste un rectangle »).

### ⚠️ Les 8 TROUS du catalogue (rien ne les couvre aujourd'hui)

Source : inventaire agent 2026-08-15, [[SHOWCASE-CAPACITES]]. Utiles à connaître **avant** de conclure
qu'une intention est couverte :
1. ⭐⭐ **L'ÉCHELLE HUMAINE** — rien ne rapporte un chiffre à une expérience vécue (trou n°1, convergence
   indépendante de 2 analyses).
2. **L'avant/après temporel sur un même plan** (un même lieu à deux dates, pas deux entités).
3. **Le mécanisme en coupe** (`CrossSection` existe, jamais servi).
4. **Le morphing géométrique continu** (le Chartogram prouve que c'est possible, jamais généralisé).
5. **La contre-plongée / le point de vue au sol** — tout est en vue de dessus ou de face.
6. **Le texte comme matière** (TypeWriter/SplitFlap/WordExplode : aucun usage épisode).
7. **Le son visualisé** — rien, alors que le pipeline audio est très mature.
8. **La transition entre deux registres** — `GlobeToParchemin` est le SEUL raccord inter-registre ;
   carte→scène SVG se fait au **cut sec**.

## ⭐ AMPLITUDE DES 2 MOTEURS RÉCENTS (ajouté 2026-08-15)

> Ces deux moteurs manquaient à ce fichier alors qu'ils étaient déjà en production — d'où des briefs
> qui les ignoraient et des scènes rabattues sur la carte par défaut. Les exemples ci-dessous disent
> **jusqu'où c'est allé**, pas ce à quoi c'est limité.

### MATIÈRE FILMÉE — MiniMax H3

Ce n'est PAS qu'un « petit clip dans un cadre ». Amplitude réellement prouvée :
- **Insert ancré dans une carte** — coupe de conduite en boucle posée sur le tracé TSGP réel
  (`ProtoInsertMatiereConduite`), insert LIEU, 3 inserts simultanés (gisements Sénégal). 7 clips validés.
- **Scène complète autonome** — un beat entier porté par le clip, avec dialogue français synchronisé
  (validé mot à mot par forced-align) : Anansi/Nyame, registres Poster Vector et Whiteboard Doodle.
- **Split-screen multi-panneaux** — 3 personnages dans 3 zones délimitées, bordures stables sur 10.5 s,
  matérialisation progressive indépendante par zone.
- **Motion-design pur** — reveal d'icône en overlay, objet qui frappe en synchro, pluie de pièces
  physique, logo/pictogramme animé, cuts durs internes au clip.
- **Registres visuels multiples maîtrisés** : Hand Drawn · Poster Vector (flat vector explainer) ·
  Whiteboard Doodle (trait marqueur + couleur sélective) · registre SaaS/corporate.

⛔ Limite dure connue : **scène dense à 3+ personnages avec contact physique** → écran noir/personnage
qui disparaît, cause racine NON résolue. Contournement prouvé : 2 personnages max, zéro contact croisé.
Détail : `memory/tools/minimax-h3-comfy-cloud.md` · styles : `memory/tools/minimax-h3-styles-tests.md`.

### SVG GÉNÉRATIF — Fable 5 comme moteur par défaut

Le moteur SVG a un générateur attitré depuis le 2026-07-20 : **Fable 5 appelé comme AGENT Claude Code
(zéro appel API, inclus dans l'abonnement)**. Mode élevé = scènes normales + objets/jetons ; mode MAX =
complexe (narratif, organique, visage, parallaxe, perso riggable). Amplitude prouvée :
- **Décor complet plein écran** — aéroport de Niamey nocturne (architecture, lune, halos, véhicule de
  piste, avion), jugé par Aziz **supérieur au décor existant** et adopté en production.
- **Scène-mécanisme abstraite** — dispositif dette/FMI (piles de billets, factures, flèches, pièces).
- **Objets, jetons, silhouettes, visages** — 4 silhouettes + 6 objets avec points d'accroche documentés.
- **Groupes nommés et adressables** → le SVG arrive **prêt à animer** (`ciel/lune/tour_controle/avion`…),
  avantage décisif sur une image figée.

⛔ Règle non négociable héritée : **jamais de contour de pays dessiné à main levée**, même dans une
scène par ailleurs simple — géographie réelle = `d3-geo` + Natural Earth (échoué 2× avant pivot).
⛔ Et : le modèle dessine le DÉCOR/le statique, **NOUS animons**. Détail : [[SVG-SCENES-GENERATIVES]].

## Les 3 usages du SVG (pas seulement les sprites Gemini)

Les sprites Gemini ne sont qu'une *source d'assets*. Trois usages distincts :
1. **Icône SVG maison** — créée par nous (GPT/Gemini/GLM), contrôle image par image, injectable
   DANS une autre scène (Mapbox, D3, Remotion). Jetons, marqueurs, pictos. → `GisementMarker`.
2. **Bloc SVG** — montrer une **organisation** : formation de troupes, pions/jetons sur écran dédié.
   → `FormationMarch`. (Probablement sous-exploité, à élargir.)
3. **Insert SVG narratif** (standalone) — raconter un **événement/trajet complexe** qu'une carte
   rendrait plat ou After Effects lourd. → cargo→Alpes, attaque RSF sur 3 points de Khartoum.

Force commune : simplifier ce qui serait complexe + CONTRÔLE TOTAL frame-driven via mix-and-match des LLM.

## Combos signatures (prouvés)

- **Mapbox + sprites Gemini** = signature **vidéo longue** (2 vidéos longues + Soudan). PAS « lourd » :
  c'est ce qui les rend vivantes. Combo de référence.
- **D3 + insert/icône SVG** = D3 pose le territoire, l'insert raconte le détail (coffre-fort). Pas de conflit d'attention.

## Mapbox et D3 sous-exploités — Claude propose activement

Même cause : leurs capacités ne remontent pas à la conscience d'Aziz au bon moment, et on ne peut pas
demander une technique qu'on ignore.
- **Mapbox** : une flèche vers un territoire se fait SUR la carte (arcs, `FlowArrowsMap`,
  `AtlasAttackArrow`, marching-ants) sans en sortir. Idem drapeaux, contagion, flux, spotlight — déjà
  listés dans INTENTION-FORME-INDEX. Le problème n'est pas qu'ils manquent, c'est qu'on n'y pense pas.
- **D3** : cantonné aux contours. Sait faire flux migratoires, réseaux, arcs, cartes de chaleur, treemaps.

**RÔLE DE CLAUDE** (posture généralisée dans CLAUDE.md « Signalement ET proposition proactifs ») :
croiser l'intention d'Aziz avec le corpus + la mémoire, et PROPOSER une capacité inexploitée même non
demandée. Explorer > conserver : un proto pas cher qui échoue vaut mieux que ne jamais tenter (c'est
ainsi qu'on a trouvé FlagFill, le cargo SVG, les jetons). Garde-fou : proto bon marché AVANT tout asset
payant (GATE n°1 + validation avant paid API). 1 proposition ciblée = un pari testable, JAMAIS un catalogue.

## ⭐ Capacités D3 PROUVÉES en 16:9 (R&D 2026-07-18, s13) — D3 n'est plus « cantonné aux contours »

D3 n'était utilisé qu'en 9:16 (Short AES, `geoMercator` seul). Session de protos (dossier
`src/projects/_rnd/d3-16x9/`, README dédié) : **D3 est agnostique au ratio** ; le 16:9 débloque le
LATÉRAL (côte à côte, panneaux, frises) que le 9:16 interdit. Formes neuves prouvées :
- **Globe orthographique** (`geoOrthographic` frame-driven) : rotation image-par-image, clip natif de
  l'hémisphère caché, graticule, halo. Validé Aziz « excellent, contrôle > Mapbox ». = plan « vu de
  l'espace ». Monde = `public/_rnd/vox-repro/countries-110m.json` (TopoJSON NE 110m) via `topojson-client`.
- **Raccord GLOBE → CARTE PLATE continu (waouh)** : UNE seule projection ortho dont on augmente le `scale`
  (zoom-in) jusqu'à courbure imperceptible = un globe très zoomé EST visuellement une carte plate. + lerp
  palette. **JAMAIS de crossfade entre 2 projections** (saccade). Validé « très smooth ».
- **Ancrage ZÉRO-DÉRIVE** : `project([lon,lat])` place jetons ET carte dans le MÊME SVG → ancrage parfait
  même en mouvement/dézoom. Avantage DÉCISIF sur Mapbox (qui exige `map.project()` reprojeté chaque frame =
  la cause des overlays qui dérivent, cf `CARTO-OVERLAYS-PRINCIPES`).
- **Carte + panneau data (A5)** : disposition 16:9 (carte ~60% gauche + panneau ~40% droite qui réagit),
  impossible en 9:16.

**Compositing « posé sur la carte » = IDENTIQUE D3 et Mapbox** (SVG/CSS pur, portable tel quel). Recette
médaillon posé (code Mapbox réel `Partie4Cout` l.907-925) : disque plein crème `#F5EFD6` + bordure +
DOUBLE ombre (boxShadow du disque + ombre-sol floue décalée). Règle d'ombre : objet iso illustré (ombre
native) = ZÉRO ombre externe ; buste/médaillon = ombre externe requise. Détail :
`.claude/.../feedbacks/feedback_jeton-iso-pas-d-ombre-externe.md`.

> ⭐ **LIMITE DU GLOBE SUR L'ABSTRAIT INSTITUTIONNEL — overlay UI ou insert SVG selon le degré d'abstraction**
> (gravé 2026-07-19, Soudan Acte 6, upstream Gemini+Kimi convergence totale). Le globe D3 excelle pour les
> FLUX géographiques entre lieux (Actes 3/5 : or, armes, corridors) mais atteint sa limite sur du contenu
> institutionnel/abstrait. Règle de bascule selon la nature du beat : (1) un fait institutionnel qui a un
> ANCRAGE géo (un pays suspendu, un pays qui vote) → globe + éventuel badge géo-ancré (icône Lucide au
> centroïde). (2) un MÉCANISME abstrait (un VOTE 14 contre 1, un veto) → globe + **OVERLAY UI** posé
> par-dessus (hémicycle 15 sièges SVG, compteurs, panneau) en `position:absolute` HORS du canvas D3 — la
> géo seule ne dit pas "vote". (3) une scène SANS géographie du tout (une TABLE DE NÉGOCIATION, un huis
> clos) → le globe est FORCÉ → basculer en **INSERT SVG plein écran** (cross-fade "on entre dans la
> Terre"). Le globe reste le liant de continuité inter-actes mais ne se force jamais sur le pur abstrait.
> ⚠️ Anti-slop confirmé par les 2 modèles sur nos effets : halo radial = gradient CSS basique qui bave →
> SVG clippé aux frontières ; drop-shadow lourd sur jetons = "asset jeu mobile" → cercle net stroke 2px.

**Seule limite résiduelle D3 vs Mapbox = LE SOL** : D3 = aplat uni ; Mapbox = terrain raster texturé où
l'objet se fond. N'empêche PAS de poser des objets, mais le « terrain habité » manque (piste : polygone
enrichi dégradé+grain+ombre interne, à tester). **Render D3/SVG pur = `npx remotion render` classique**
(aucun WebGL, PAS `render-mapbox.sh`). `d3` installé LARGEMENT (vérifié 2026-07-20) : array/format/geo/scale MAIS AUSSI `d3-force`, `d3-shape`,
`d3-sankey`, `d3-hierarchy`, etc. — la note « MANQUE d3-force/d3-shape » était FAUSSE. Réseau de force PROUVÉ
(proto `ForceNetworkProto16x9`, méthode = simulation CUITE en useMemo, 2 layouts pré-calculés, zéro
Math.random = déterministe). Backlog restant (globe 2.0, choroplèthe, Sankey, HUD) :
`memory/NEXT-ACTION.md` § R&D D3 en 16:9.

## Mapbox = dominant par défaut (bonne raison)

Le plus fréquent — parce que nos sujets sont géopolitiques, donc le territoire réel est souvent le bon
socle narratif, PAS par réflexe paresseux. En sortir est facile SI l'intention le motive.

## 2 règles de cohabitation

1. **Un moteur DOMINANT par scène, les autres en SUPPORT.** Jamais deux registres qui se battent dans
   le même plan (ex. D3 puis Mapbox 5s/5s = collage brouillon).
2. **Charte graphique commune = colonne vertébrale, décidée UNE fois par projet** (palette, typo, grain,
   traitement des inserts). C'est ce qui fait qu'un insert SVG et une carte Mapbox « se ressemblent ».
   Sans elle, « scène par scène » dérive en patchwork.

## La vraie valeur + le vrai travail

- **Liberté = ne jamais être bloqué** : une intention claire a toujours ≥1 moteur qui la porte. Le blocage
  n'est jamais technique, toujours en amont (intention floue). Corollaire GATE n°1 : jamais « infaisable » sans proto.
- **Le vrai travail = le RACCORD** : si l'intention désigne le moteur, le seul risque restant est la
  transition entre deux moteurs → charte commune + enchaînement motivé, jamais un cut sec entre registres.

## ⭐ QUAND appliquer : AU SCRIPT, pas à la production

Le choix du moteur se décide au moment du script / des actes (quand on fait déjà le storyboard mental),
PAS à la construction. Bénéfices : (1) **vision d'ensemble** dès le départ (pas de découverte tardive
qu'une scène ne marche pas dans le moteur prévu) ; (2) **traçabilité des routes essayées** (« tenté en
carte, c'était plat → passé en insert SVG »). Concrètement : le moteur dominant devient une COLONNE du
script/storyboard ; puis chaque scène confirme/ajuste via intention → forme → moteur. S'intègre à
[[DOCTRINE-SCRIPT-UNIFIEE]] et au pipeline storyboard→validation→breakdown.

## ⭐ Techniques de motion design classique — vocabulaire sous-exploité (introduit 2026-08-06)

3 techniques d'animation fondamentales, jamais utilisées dans ce repo avant le projet Flowdesk
(panneau chaos de notifications, `FlowdeskPersonne2B.tsx`), suggérées à la demande explicite d'Aziz
("qu'est-ce que toi tu vois, en tant qu'expert ?") — à considérer pour TOUT futur panneau avec du
mouvement rapide/chaotique/désordonné, pas seulement Flowdesk :

- **Squash & stretch** : un élément qui accélère/change de direction s'étire légèrement dans le sens
  du mouvement (`scaleX`/`scaleY` différenciés selon la vitesse instantanée, pas un `scale` uniforme).
  Donne du poids/de la vie à un pictogramme 2D plat — l'absence de cette technique est ce qui rend un
  mouvement "plat" par comparaison à un mouvement animé classiquement.
- **Anticipation** : un léger mouvement inverse (2-3 frames) précède un changement de direction marqué
  — vend un mouvement chaotique comme intentionnel plutôt qu'aléatoire/random.
- **Trails fantômes** : 2-3 copies dupliquées de l'élément en mouvement, décalées de quelques frames
  dans le passé, opacité dégressive — vend la vitesse sans `filter: blur` (interdit en Remotion
  headless). Technique gratuite en SVG (juste des `<g>` supplémentaires avec un délai de frame).

Implémentation de référence : `src/projects/_client-sim/flowdesk/FlowdeskPersonne2B.tsx`, composant
`FlyingIcon` (trajectoire Lissajous bruitée + squash/stretch dérivé de la vitesse instantanée +
anticipation + trails).
