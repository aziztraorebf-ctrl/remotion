# DOCTRINE — 3 moteurs visuels sur 1 socle (quel moteur pour quelle nature de contenu)

> Complète [[CONTINUITE-SCENE-INTENTION-DABORD]] (l'intention décide) et
> `src/projects/_shared/INTENTION-FORME-INDEX.md` (la forme ensuite). Ce fichier répond au
> chaînon suivant : « je sais quelle forme — quel MOTEUR sait la produire ? ».
> Cousin opérationnel : l'« ARBRE DE DÉCISION SVG ou Mapbox ? » de `memory/ROUTAGE.md`.
> Né de l'analyse d'Aziz (2026-07-17) après AES 90s + Sénégal Pétrole D3 + Soudan.
> ⛔ Ne JAMAIS partir du moteur. Ordre : intention → forme → PUIS ce fichier (sinon = piège des 10 essais).

## 3 moteurs, 1 socle

Pas 4 piliers parallèles : **3 moteurs visuels posés sur 1 socle**.
- **Remotion = LE SOCLE** (pas un moteur au même niveau) : orchestre TOUT — timing audio-driven,
  texte, chiffres, transitions, graphes simples, compositing. D3/SVG/Mapbox vivent DANS Remotion.
  On ne « choisit pas entre Remotion et SVG » : on fait du SVG *dans* Remotion.
- **3 moteurs visuels** produisent l'image animée, chacun pour une nature de contenu différente.

## Quel moteur pour quelle nature de contenu

| Ce qu'on montre | Moteur dominant | Pourquoi |
|---|---|---|
| **OÙ** — lieu réel, territoire, frontières | **Mapbox** | Géo zoomable + carte vivante (couleurs, frontières, flèches, drapeaux, sprites) |
| **COMBIEN (simple)** — chiffre, barre, courbe standard | **Remotion** | Sait déjà dessiner graphes/chiffres animés |
| **COMBIEN (géométrie complexe)** — flux, réseaux, arcs, projection, choropleth | **D3** | Moteur de calcul de géométrie (pas de « graphiques »). SOUS-EXPLOITÉ |
| **QUOI / COMMENT** — objet, processus, trajet, métaphore | **SVG** | Contrôle total frame-driven, simplifie ce qui serait lourd en After Effects |
| **⭐ QUI** — un acteur humain, un geste, un rapport de force, une charge subie | **`_shared/stick-figure-svg/` (NOS briques)** | ⛔ **Jamais un modèle, jamais Seedance** : le socle stick figure (profil) est validé en production depuis le 2026-07-28 et bat ce qu'un modèle produit. **AVANT de coder, choisir le RÉGIME** : AMBIANT (figurants qui habitent un lieu) vs **DÉMONSTRATIF** (1 perso qui EST l'argument — plus fort, moins cher, à privilégier). Recette : [[SCENE-DEMONSTRATIVE-PERSONNAGE]]. Habillage : [[brique-habillage-stick-figure]] (ne JAMAIS l'improviser). |
| **LE LIANT** — texte, chiffre-choc, transition, rythme | **Remotion** (socle) | Toujours |

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
