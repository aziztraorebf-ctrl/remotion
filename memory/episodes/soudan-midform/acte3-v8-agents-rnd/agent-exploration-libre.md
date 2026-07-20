# Exploration libre — mise en scène caméra/objets pour trajet géographique de flux (or -> Dubaï -> drones -> Soudan)

## Ce que montrent les vidéos de repérage concurrentes (mapanimation.io)

Extraction de frames (`silk road 1.mov` 17s, `silk road 2.mov` 31s) — les deux sont en fait **le même
template**, deux réglages de vitesse/zoom différents. Description factuelle de ce qu'il fait :

- Caméra "tapis roulant" : le point courant reste **quasi fixe à l'écran** (centre-bas), et c'est la
  **carte qui défile en dessous**, révélant progressivement le trajet vers le nord-est.
- Un tireté jaune se dessine au fur et à mesure (stroke-dashoffset classique), avec un point plein qui
  "avance" à sa pointe.
- Chaque ville traversée fait un pop-in de label (fade + petite montée), reste affichée, puis quand
  l'écran devient trop chargé les anciens labels commencent à se chevaucher/se recouvrir (défaut visible
  vers sr1_17 : "THE SILK ROAD" titre passe derrière l'opacité, labels Milan/Venice se collent).
- Zéro géographie réelle visible au sens narratif : pas de relief, pas de couleur de territoire, pas de
  frontières signifiantes — juste un fond gris uniforme avec liserés blancs de pays. Le pays de départ
  (Chine, en marron) et celui d'arrivée (Italie, en vert) sont seuls teintés, en aplat plat, sans lien
  clair avec pourquoi ces deux couleurs.
- **Vitesse constante du début à la fin.** Aucune accélération, aucune pause, aucun ralenti sur un point
  d'intérêt. Le rythme est un métronome — exactement le problème "flèche qui bouge" mentionné dans la
  mission, juste habillé avec un joli style carte sombre + police serif dorée.
- Aucune transformation d'objet : le point de départ et le point d'arrivée sont un cercle jaune
  identique du début à la fin. Rien ne raconte "ce qui voyage change de nature".
- Le titre reste figé en haut tout du long (bandeau noir translucide) — fonctionne comme repère mais
  n'accompagne pas le récit (pas de sous-titre d'étape qui évolue).

**Ce qui est bon à retenir** : la lisibilité du tracé (tireté qui se dessine devant nos yeux, jamais la
route entière d'un coup), le style epigraphique doré/sombre proche de notre esthétique parchemin/encre,
le principe de "la carte vient à nous" plutôt que l'inverse pour un trajet long.

**Ce qui manque cruellement et qu'on doit dépasser** : rythme plat, pas de pause narrative, pas de
transformation d'objet, pas de hiérarchie (tout a le même poids visuel), la géographie ne raconte rien
(les territoires traversés sont juste un fond, pas des acteurs de l'histoire).

---

## Contrainte technique (rappel, non-négociable)

100% SVG/DOM frame-driven. `useCurrentFrame()` + `interpolate()` uniquement. **Interdit** : CSS
`transition`/`@keyframes`, `setTimeout`, `requestAnimationFrame`, `filter: blur()/glow()` CSS DOM
(confirmé imprévisible en Chrome headless — j'ai vérifié : le projet a `filter: blur()` en dur dans
`SenegalActe2Continu.tsx` lignes 460 et 731, ce qui contredit la doctrine "3.5 Blur CSS pendant
transitions" — c'est une dette technique existante, pas une permission ; je ne le réutilise pas ici).
Mapbox = frame-driven avec `map.jumpTo()` uniquement, jamais `flyTo`/`easeTo`. Pas de particules
complexes. Tout effet de "flou" ou "lueur" ci-dessous est donc simulé par **SVG natif**
(`feGaussianBlur` dans un `<filter>` SVG appliqué à un `<g>`, ce qui EST prévisible en headless
contrairement au CSS `filter:`) ou par des techniques d'opacité/superposition — jamais par CSS.

---

## Proposition 1 (FACILE — 1-2h de code) — "Convoi qui respire" : rythme en 3 temps au lieu d'un métronome

Le problème n°1 identifié (chez le concurrent ET probablement dans les itérations d'Aziz) est un
mouvement à vitesse constante. La solution la moins chère à coder est de **casser le rythme en 3 temps
distincts** sur un même trajet, sans toucher à l'architecture caméra existante.

**Comportement frame par frame :**
- **Temps 1 — Départ (frames 0-40, ~1.3s)** : la caméra est fixe, cadrée serrée sur le point de départ
  (mine d'or Darfour). Le point pulse deux fois (`spring()` scale 1 -> 1.3 -> 1, deux cycles) AVANT que
  quoi que ce soit ne parte — on regarde la source avant le voyage, comme un temps d'inspiration.
- **Temps 2 — Trajet accéléré non-linéaire (frames 40-160)** : le tracé (stroke-dashoffset) et la caméra
  avancent ensemble mais **pas en vitesse constante** : `interpolate(frame, [40,70,130,160], [0,0.15,0.85,1], easing bezier avec ease-in puis ease-out}`. Concrètement : les 30 premières frames du trajet
  parcourent très peu de distance (on part lentement, comme une charge qu'on soulève), le milieu du
  trajet (Darfour -> mer Rouge -> Dubaï) est parcouru VITE (60 frames pour 70% de la distance — sensation
  de traversée rapide, presque une ellipse temporelle), puis les 30 dernières frames ralentissent en
  arrivant sur Dubaï (temps de se poser). C'est le principe d'un montage cinéma : on ne montre pas tout
  le trajet en durée réelle, on accélère le "voyage" et on ralentit les deux bouts qui comptent.
- **Temps 3 — Arrivée (frames 160-200)** : la caméra fait un `Pull Back Reveal` (60f, pattern déjà
  validé dans la doctrine) pour révéler Dubaï dans son contexte régional au moment exact où le point
  arrive — jamais pendant le trajet.
- **Objet qui voyage** : au lieu d'un point fixe qui glisse (contraire au corollaire "objet inerte ne
  glisse jamais" de CLAUDE.md — l'or ne se déplace pas tout seul), on affiche un **petit pictogramme de
  cargaison (sac/caisse SVG simple, 2 couleurs)** qui suit la tête du tracé, avec une légère oscillation
  verticale sinusoïdale (`Math.sin(frame * 0.15) * 3px`) pour suggérer transport terrestre/maritime sans
  jamais utiliser un vrai véhicule 3D. Le sac reste "or" (couleur ocre/dorée) jusqu'à l'arrivée.

**Pourquoi ça répond au problème** : le rythme en 3 temps (respiration - accélération - pose) est la
différence entre "flèche qui bouge" et "un événement qui se déroule". Zéro nouvelle techno, juste un
`interpolate()` à breakpoints multiples au lieu d'un `interpolate()` linéaire simple.

---

## Proposition 2 (MOYEN — demi-journée) — "Le point de bascule visible" : transformation par split de trajectoire, pas par changement de couleur

Le problème n°2 est de matérialiser "l'or devient des drones à Dubaï" plus fort qu'un changement de
couleur de marqueur. Un changement de couleur est faible parce qu'il est *instantané et local* — il ne
raconte pas la transformation, il l'annonce.

**Comportement frame par frame :**
- Le pictogramme cargaison (sac ocre, proposition 1) **arrive à Dubaï et disparaît par un effacement
  radial** : pas un fade opacity classique, mais un `clipPath` circulaire dont le rayon grandit depuis le
  centre du sac (`<clipPath><circle r={interpolate(...)} /></clipPath>`), qui "efface" le sac comme s'il
  fondait dans le sol de la ville — 15 frames, propre en SVG, aucun flou nécessaire.
- **Pause complète de 20-25 frames sur Dubaï** (caméra statique, zéro mouvement) — le silence narratif
  avant la bascule. Un simple cercle-marqueur pulse doucement sur place (le lieu "digère" ce qui vient
  d'arriver). C'est le moment où le spectateur doit sentir qu'on change de nature d'objet.
- **Le nouvel objet (silhouette de drone, SVG simple 3-4 formes) apparaît par croissance depuis le même
  point**, pas par un fade-in générique : `scale` de 0 à 1 via `spring()` avec un `overshoot` léger
  (bounce), à l'INVERSE géométrique du cercle qui a effacé le sac — même centre, direction inversée. Le
  spectateur associe visuellement "ce qui a disparu ici" à "ce qui apparaît ici" sans avoir besoin de
  texte explicatif.
- **Trajet retour Dubaï -> Soudan pour le drone** : cette fois le pictogramme drone A un mouvement de vol
  différent du sac au sol — translation en ligne PLUS directe (moins de courbure sur le tracé), légère
  augmentation d'altitude simulée par une **ombre portée SVG simple qui se détache du sol** (un second
  `<ellipse>` gris sous le drone, dont l'offset X/Y grandit avec `interpolate(frame,...)` — technique
  classique 2D pour suggérer l'altitude sans 3D réel, zéro risque headless).
- Optionnel (mais fort) : le tracé du retour (Dubaï -> Darfour) est visuellement **différent** du tracé
  aller (Darfour -> Dubaï) — pointillé plus fin, couleur différente (rouge/gris militaire au lieu
  d'ocre/or) — pour que l'œil comprenne sans lire "aller = commerce, retour = armement" par la seule
  forme du trait.

**Pourquoi ça répond au problème** : la transformation devient un ÉVÉNEMENT avec une durée et un silence
(pas un simple swap de sprite), et la géométrie inversée (efface ici, apparaît ici, même centre) crée un
lien causal visuel fort sans dépendre de texte.

---

## Proposition 3 (MOYEN-AMBITIEUX — 1 jour) — Caméra qui change d'ANGLE narratif à chaque acteur, pas seulement de position

Le concurrent (et probablement les itérations actuelles) garde la même distance/angle de caméra tout du
long — seule la position (pan) change. Une caméra premium change de **grammaire visuelle** selon qui est
l'acteur du moment.

**Comportement frame par frame, sur l'ensemble du beat (3 flux : or Darfour->Dubaï->drones, Turquie
drones<->Suakin, armée->Égypte) :**
- **Flux "or Darfour"** : caméra en Dolly In progressif pendant tout le trajet (zoom 6 -> 8 sur
  100-150f) — on SE RAPPROCHE du sol, sensation d'extraction/de matière brute qu'on suit de près. Le
  tracé est visuellement "sale" (irrégulier, épaisseur variable simulée par plusieurs `<path>` superposés
  à opacité dégressive, pas un trait propre) pour connoter le trafic informel.
- **Flux "Turquie <-> Suakin"** : caméra en Orbit lent (bearing rotatif, pattern déjà validé, 200-300f)
  centrée sur le point d'ancrage Suakin — on TOURNE AUTOUR du point stratégique au lieu de le traverser,
  ce qui matérialise "c'est un point d'ancrage géopolitique", pas juste une étape de trajet. Le tracé
  Turquie->Suakin est bidirectionnel (aller drones, retour ancrage/accès) — deux traits fins parallèles
  légèrement décalés, jamais superposés exactement, avec des flèches discrètes (`<polygon>` triangle
  simple) indiquant le sens à mi-parcours de chaque trait.
- **Flux "armée -> Égypte"** : caméra reste en Wide Static (zoom out fixe, aucun mouvement) — parce que
  narrativement c'est "en douce" : pas de spectacle caméra, juste un tracé fin et discret qui apparaît
  presque furtivement (vitesse de dessin du tireté 2x plus rapide que les deux autres flux, comme si on
  ne voulait pas s'attarder dessus). Le contraste de traitement caméra EST le message : un flux visible et
  choré (l'or), un flux stratégique qu'on scrute (Turquie), un flux qu'on planque (Égypte).
- Entre chaque flux : **Whip Pan 60f** (pattern déjà validé, avec le SVG-blur alternatif ci-dessous au
  lieu du CSS blur) pour signaler clairement le changement d'acteur, jamais un simple cut.
- **Alternative headless-safe au blur CSS pour le whip pan** : appliquer un `<filter>` SVG
  `<feGaussianBlur stdDeviation={interpolate(frame,[0,30,60],[0,4,0])} />` sur le `<g>` contenant les
  overlays SVG (tracés + pictogrammes, PAS la tuile Mapbox elle-même qui reste nette dessous) — prévisible
  en headless car c'est un filtre SVG natif du DOM, pas un `style.filter` CSS appliqué à un canvas/div.
  À tester en mini-render avant d'adopter largement, mais c'est la voie conforme à la contrainte.

**Pourquoi ça répond au problème** : trois flux avec trois grammaires caméra différentes (rapproche/
tourne/reste loin) créent une hiérarchie de lecture immédiate — le spectateur SENT lequel est central,
lequel est stratégique, lequel est honteux, avant même d'entendre le texte.

---

## Proposition 4 (AMBITIEUX — 1-2 jours) — Split-screen final : hiérarchie par TAILLE et SYNCHRONISATION, pas 3 cases égales

Le split-screen 3 volets "classique" (3 rectangles égaux côte à côte) aplati toute hiérarchie : Dubaï et
Turquie sont montrés comme équivalents alors que la thèse du beat est "dépendance du Soudan aux DEUX
puissances" — ce qui est plus fort visuellement, c'est de montrer le Soudan comme le point commun PRIS EN
ÉTAU, pas trois panneaux parallèles.

**Composition proposée — pas 3 colonnes égales, mais un montage asymétrique :**
- **Le panneau central n'est PAS un tiers de l'écran mais reste dominant** (environ 50% de largeur,
  centré) : c'est la carte du Soudan avec ses deux flux entrants (or sortant vers la droite, drones/
  Égypte entrant depuis les côtés) — c'est LE sujet, pas un panneau parmi d'autres.
- **Les deux panneaux latéraux (Dubaï à droite, Turquie à gauche) sont plus étroits (~25% chacun)**,
  légèrement plus sombres/désaturés (`opacity` réduite sur un calque de teinte, pas de filter CSS — un
  simple `<rect>` semi-transparent par-dessus), pour signaler visuellement "ce sont des PÉRIPHÉRIES qui
  pèsent sur le centre", pas des égaux.
- **Bordures qui respirent en fonction de l'activité** : au lieu de 3 cadres statiques, la bordure du
  panneau qui "envoie" quelque chose au Soudan à cet instant précis du beat s'illumine légèrement (léger
  changement de `stroke-width`/`stroke-opacity` via `interpolate`, jamais de glow flouté) — synchronisé
  avec le texte narré à ce moment (si la narration parle de la Turquie, le cadre Turquie pulse).
- **Un connecteur SVG fin (pas juste un split fixe) relie visuellement les 2 panneaux latéraux au panneau
  central** : deux traits fins convergents partant des bords intérieurs de Dubaï et Turquie vers le
  centre Soudan, dessinés en léger delay l'un après l'autre (Dubaï d'abord car sujet du beat, Turquie
  ensuite), qui donnent une lecture de "étau" plutôt que "juxtaposition". Ces traits utilisent le même
  vocabulaire visuel (tireté doré) que les trajets vus plus tôt dans l'acte — cohérence de grammaire.
- **Timing de révélation asymétrique** : le panneau central apparaît en premier et reste seul 20-30
  frames (le Soudan, point de départ de la question), PUIS le panneau Dubaï se glisse depuis la droite
  (translation X simple, pas de cut), PUIS 15-20 frames après le panneau Turquie depuis la gauche — jamais
  les 3 en même temps. La dissymétrie temporelle renforce que ce n'est pas une liste à 3 items égaux mais
  une histoire qui s'assemble sous nos yeux.
- **Sortie du split-screen** : au lieu d'un simple fade-out des 3 cadres, les deux panneaux latéraux se
  RESSERRENT visuellement vers le centre (translation X progressive vers le panneau central, `interpolate`
  sur 30-40f) avant de disparaître — mise en scène littérale de l'étau qui se referme, cohérente avec le
  message de dépendance/encerclement.

**Pourquoi ça répond au problème** : la composition asymétrique (1 dominant + 2 périphéries qui
convergent) porte la thèse ("le Soudan est pris en étau entre deux puissances") dans la forme même du
split-screen, avant même que la voix off ne le dise — exactement le principe INTENTION->FORME de la
doctrine du projet.

---

## Proposition 5 (LA PLUS AMBITIEUSE — R&D, 2-3 jours, risque à tester en proto minimal d'abord) — "Carte qui garde la mémoire du trajet" : les traits accumulés changent l'aspect du territoire traversé

Au lieu de traiter chaque trajet comme un tracé isolé qui apparaît puis reste statique, faire en sorte
que la carte elle-même **s'assombrisse/se teinte progressivement aux endroits où l'argent/les armes sont
passés**, pour que la carte porte visuellement la trace cumulative de tout l'acte — pas juste au dernier
beat (split-screen) mais tout du long.

**Comportement frame par frame :**
- Chaque trajet (or, drones Turquie, or Égypte) laisse derrière lui, une fois le tireté complété, une
  **fine bande de couleur en overlay SVG le long du path** (`<path>` avec `stroke-width` fin, `opacity`
  basse ~0.15-0.25, couleur propre au flux) qui NE disparaît PAS à la fin du beat suivant — elle reste
  visible en fond, de plus en plus fine/discrète à mesure que de nouveaux trajets s'ajoutent par-dessus
  (`opacity` du trait le plus ancien réduite légèrement à chaque nouveau trajet via une simple valeur
  d'état, pas d'animation continue coûteuse).
- Au moment du split-screen final, la carte du Soudan (panneau central) montre ces 3 traces superposées
  simultanément pour la première fois — payoff visuel de tout ce qu'on a vu défiler dans l'acte, sans
  avoir besoin de re-expliquer.
- **Risque à tester avant d'investir** : lisibilité (3 tracés superposés à faible opacité sur un fond
  parchemin/encre peuvent devenir un fouillis illisible) et coût de rendu (garder trace de plusieurs
  paths sur toute la durée d'un Map continue). Proto minimal recommandé : 1 seul flux, vérifier lisibilité
  en render plein format AVANT d'étendre aux 3.

**Pourquoi ça répond au problème** : ça répond directement à la frustration "petit ajustement après petit
ajustement" en proposant une architecture différente (mémoire cumulative) plutôt qu'un réglage de plus
sur la même mécanique caméra — mais c'est la proposition à plus haut risque, donc à proto-typer avant
adoption complète.

---

## Recommandation d'ordre d'essai

1. **Proposition 1** (rythme 3 temps) — quasi gratuite à tester, corrige le défaut n°1 identifié chez le
   concurrent ET probablement dans les itérations actuelles.
2. **Proposition 2** (transformation par géométrie inversée + pause narrative) — répond directement à la
   question "comment matérialiser Dubaï comme bascule" posée dans la mission.
3. **Proposition 4** (split-screen asymétrique en étau) — le split-screen final est nommé comme point
   sensible, cette proposition change sa composition sans complexité technique déraisonnable.
4. **Proposition 3** (grammaire caméra par acteur) — plus structurant, à réserver si le temps le permet
   après validation des 3 premières idées sur un flux.
5. **Proposition 5** (mémoire cumulative) — R&D pure, seulement si Aziz veut sortir complètement du
   format "beat par beat" et est prêt à un jour de proto sans garantie.
