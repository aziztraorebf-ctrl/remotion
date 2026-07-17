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
| **LE LIANT** — texte, chiffre-choc, transition, rythme | **Remotion** (socle) | Toujours |

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
