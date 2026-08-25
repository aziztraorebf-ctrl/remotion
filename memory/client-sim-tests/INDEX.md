# Tests client-sim (SaaS et hors-Souverain) — INDEX

> Porte d'entrée dédiée aux tests "client simulé" — exercices de positionnement freelance visant
> des marchés HORS Souverain (SaaS, produits tech, autres verticales). Isolé volontairement de
> `MEMORY.md` (qui reste concentré sur le sujet principal : YouTube/Souverain) — ce dossier n'est
> PAS chargé automatiquement en début de session, seulement consulté quand on travaille
> explicitement sur un test client-sim. `MEMORY.md` ne garde qu'un pointeur d'une ligne vers ce
> fichier.
>
> Décision Aziz (2026-08-06) : garder cette distinction stricte pour ne pas diluer la mémoire
> principale avec des sujets secondaires, même bien référencés.

## ⭐⭐⭐ LA MÉTHODE — `memory/fiches/FICHE-BRIEF-CLIENT.md`

**Avant de trier, lire ou répondre à un brief client : c'est là que sont les règles.** Ce fichier-ci
raconte les tests (des RÉCITS, chronologiques) ; la fiche donne la MÉTHODE extraite de ces récits —
trier l'annonce · lire le brief · répondre · envoyer. Auto-injectée par `fiche-inject.sh` dès qu'on
touche un chemin `client-sim`/`upwork`/`freelance-linkedin`.

⭐ Elle existe parce que le savoir était éparpillé : le ratio dépensé/embauches ici, la règle
lien-vs-pièce-jointe dans un STATUS, « résumé ≠ source » dans un feedback, le prix des connects
ailleurs. Trois endroits pour une seule tâche. **Tout nouvel acquis d'un test client va dans la
fiche**, pas seulement dans le récit du test.

## Tests réalisés

- ⭐⭐⭐ **LOTTIE UI / menu LCD embarqué (3e brief CLIENT RÉEL — NON candidaté) — 2026-08-24.**
  Genre encore différent : ni carte, ni SaaS, ni overlay — un **composant d'interface** livré en
  `.json` Lottie pour un appareil photo embarqué (4 écrans, budget 100 $, Turquie).
  ⭐⭐⭐ **L'ACQUIS N'EST PAS LE TEST, C'EST LE PIPELINE** : on sait produire du **Lottie standard
  depuis notre workflow SVG habituel, sans After Effects** — chaîne `image → Fable (SVG structuré)
  → script → .json`. **Validé dans l'outil OFFICIEL du client** (LottieFiles Creator) : calques
  nommés, dépliables, et **éléments déplaçables un par un** — l'exigence même du brief. Poids
  compressé **1 382 octets**, sous la référence que le client cite lui-même (1,4 Ko).
  Croisé sur 4 moteurs : `rlottie`, `lottie-web`, Preview et Creator.
  ⛔ 3 limites à annoncer, jamais à cacher : **courbes non gérées** (segments droits seulement,
  échec bruyant par choix) · **source `.aep` ⚠️ à TESTER** (l'affirmation « AE n'importe pas » était
  FAUSSE — Bodymovin fait l'import ; test prioritaire prochaine session) ·
  pas de personnages articulés (métier différent, pas une limite de format).
  **Décision : pas de candidature** — client à **100 $/embauche** sur 19 embauches, budget affiché
  100 $, donc aucune négociation possible. La pièce reste au portfolio (UI générique, ne périme pas).
  ⭐ Acquis de méthode : **ne jamais renvoyer au client sa propre référence comme preuve**
  (correction d'Aziz) — animer SON élément prouve qu'on a lu son écran, renvoyer son exemple ne
  prouve rien. Et **la 1re version bricolée sans Fable était moins bonne** que celle passée par le
  workflow (rectangles au lieu des vraies lettres) : la discipline paie, mesurable.
  Détail, prochaine session et limites : [STATUS](lottie-ui-lcd/STATUS.md).
  Code : `src/projects/_client-sim/lottie-ui/`.

- ⭐⭐⭐ **Upwork « Max Chill Factor Meter » / AbiGirl Reacts (OVERLAY ANIMÉ — 2e brief CLIENT RÉEL) — 2026-08-22.**
  Genre encore différent : ni carte ni SaaS, un **habillage de marque à fond transparent** livré pour
  le montage de la cliente (compteur rétro-futuriste givré, 0→100, 6 états, 350 $).
  **Prototype COMPLET de bout en bout. RIEN ENVOYÉ, aucun engagement pris.**
  Parcours : 3 annonces triées → 4 modèles au MÊME brief SVG (Kimi/GPT/Fable/**Grok**) → mix
  assemblé par script → animation Remotion → **export ProRes 4444 alpha vérifié** → démo montée
  sur le plateau réel de la cliente.
  ⭐ Acquis transférables : (1) **le ratio « total dépensé ÷ embauches » du client** trie une annonce
  en 30 s — les 2 annonces écartées étaient à 135 $ et 39 $/embauche ; (2) **le marché ne demande
  jamais « du SVG »** — aucun des 3 briefs ne nomme une technique, ils demandent un livrable et un
  format ; (3) **un brief qui DICTE les noms de `<g id>`** rend les planches de N modèles
  interchangeables pièce par pièce ; (4) **exiger l'ÉTAT NEUTRE** quand la référence client montre
  l'état FINAL (sa référence était givrée à 100 % = son état final ; sans châssis propre livré à
  part, les paliers 0/25/50 % étaient impossibles) — c'est le SYMÉTRIQUE du point 3 ci-dessous.
  Coûts mesurés : 4 planches d'un objet texturé = **0,79 $** · rendu ProRes alpha 135 frames = **53 s**.
  Détail, gotchas et suites : [STATUS](upwork-chill-meter/STATUS.md).
  Code : `src/projects/_rnd/chill-meter/`. Outil né ici : `scripts/tools/svg-from-ref-image.py`.
  ✅ **PROPOSITION ENVOYÉE le 2026-08-23** (première candidature d'Aziz, <2 j après création du profil ;
  7 connects, pas de boost). Test CapCut **validé** sur l'outil de la cliente · 6 MOV régénérés, alpha
  vérifié 2× · profil et portfolio faits (4 showcases + 11 pièces EN).
  ⛔ **Décision : ne rien produire de plus avant d'avoir le contrat.** Si elle répond → prototyper le
  SON en premier (seul point promis non démontré). Détail : [STATUS](upwork-chill-meter/STATUS.md).
  ⭐ Acquis n°5 de ce test : **la source primaire, jamais un résumé** — candidature entière rédigée
  sur le STATUS alors que le PDF existait → 2 erreurs (titre pour un champ inexistant, son demandé
  dans chaque section). C'est ce test qui a fait naître `FICHE-BRIEF-CLIENT.md`.

- ⭐⭐⭐ **Zambie / Peace Corps (CARTOGRAPHIQUE — 1er brief CLIENT RÉEL, pas un SaaS fictif) — 2026-08-21/22.**
  ⚠️ Genre différent des 3 tests ci-dessous : ce n'est pas un produit inventé mais une **vraie offre
  Upwork** (animation cartographique, volontaires en Zambie 1995→2026), et le livrable est une **démo
  d'avant-vente de 8 s en 2 traitements** (gabarit de choix), pas un film complet.
  **Objectif réel du test : éprouver le WORKFLOW**, pas produire la vidéo.
  Parcours : 1er rendu codé SANS storyboard → **rejeté « prototype » par Aziz** (conservé dans
  `v1-rejete/` comme mesure du progrès) → reprise par le storyboard (brief audité, 3 dessinateurs,
  arbitrage, breakdown par le modèle qui a dessiné) → code → self-review mécanique → comparatif →
  correction **par la mesure** → 2 concepts validés.
  ⭐ Acquis transférable : *ce qui se mesure ne se demande jamais à un modèle*. Sur 7 points remontés
  par 3 modèles : 3 justes, 2 neutres, **2 nuisibles**.
  Livrables + écarts mesurés + pièges : [MANIFESTE](zambia-peacecorps/MANIFESTE.md).
  Code : `src/projects/_client-sim/zambia-peacecorps/`. Outils nés ici :
  `scripts/tools/carto-selfreview.py` · `scripts/tools/make-comparatif-panel.py`.
  ▶️ **2e test prévu** (starter prêt dans `memory/NEXT-ACTION.md`) avant de graver le workflow.

- ⭐⭐⭐ **Flowdesk (SaaS fictif, centralisation de demandes internes) — CLOS 2026-08-06.**
  Conclusions stratégiques (pipeline SaaS V1 formalisé, Direction A/B, règle
  draw-on/mouvement/vie, structure CONCRET→ABSTRAIT→CONCRET) :
  [flowdesk-client-sim-conclusions](../projects/flowdesk-client-sim-conclusions.md).
  Détail technique (code, bugs, timings, historique V1→V4) :
  [STATUS](../episodes/_client-sim/flowdesk/STATUS.md).
  Code : `src/projects/_client-sim/flowdesk/`.

- ⭐⭐⭐ **NorthShield (SaaS cybersécurité, scoring de risque de connexion) — CLOS 2026-08-08.**
  Objectif testé et ATTEINT : HUMAN + SYSTEM + PRODUCT. Parcours : Direction B pure (100%
  abstraite) codée v1→v2, REJETÉE SUR LE FOND (cliché "pluie de données" + zéro incarnation
  humaine) malgré motion corrigé → pivot storyboard V3 mixte (incarnation MiniMax H3 + mécanisme
  SVG existant) → 1er montage 7 panneaux → retour détaillé Aziz → refonte 5 panneaux (deltas
  visibles P4, pattern disque/anneau Flowdesk P5/P6, VirtualCursor intégré, bug laptop corrigé)
  → validé "la v3 est bonne". Livrable : `out/_client-sim/noteshield/FINAL/northshield-v3-FINAL.mp4`.
  Détail complet : [STATUS](../episodes/_client-sim/noteshield/STATUS.md).
  Conclusions stratégiques transversales : pas encore écrites (à faire, cf modèle Flowdesk).

- ⭐⭐⭐ **MOCH-IT (test système A→Z, reproduction/dépassement d'une pub Fiverr existante) — CLOS 2026-08-09.**
  Objectif différent des tests précédents : pas un brief client fictif, mais une mesure objective
  (reproduire/dépasser un livrable déjà payé et approuvé, pub 15.5s). Parcours : breakdown 3-modèles
  → storyboard visuel mix&match (Gemini/GPT/Kimi par panneau) → plans d'animation 3-modèles (12
  principes Disney) → V1 codée → 2 passes de correction suite retours Aziz (V3 : abandon du morph
  PEOPLE→PROCESS et du compteur DUPLICATES, tous deux des sur-ingénieries — retour à la structure
  simple de l'original avec exécution premium ; V4 : doublon "WE DESIGN" retiré, avatars ajoutés,
  pills→rectangles, letterbox ; V5 : icônes/avatars agrandis ×2 + bicolores + spring overshoot,
  suite à un **breakdown comparatif 2-vidéos** (référence + notre rendu envoyés ensemble à
  Gemini+Kimi, script dédié `da-brief-compare-2videos.py`). Enseignements transversaux (3 mémoires
  créées) : [[script-texte-avant-code-meme-sans-audio]] (script AVANT storyboard visuel, même sans
  audio), [[depasser-executer-pas-ajouter-geste]] (dépasser = mieux exécuter, pas ajouter un
  mécanisme), [[format-vertical-etire-viewbox-fond-simple]] (viewBox étendu + fond en rectangle
  plein pour tout format vertical non-standard). Code : `src/projects/_client-sim/mochit/`.
  Script réutilisable : `scripts/tools/da-brief-compare-2videos.py` (breakdown comparatif A/B avec
  2 vidéos natives Gemini+Kimi — utile pour tout futur test "reproduire une référence").
  **Livrable : `out/_client-sim/mochit/FINAL/mochit-v5-FINAL.mp4`** (15,552 s · 465 f · 1080×2460 ·
  audio) — re-rendu le 2026-08-16 depuis la composition `MochIt-Complete`.
  > ⚠️ **Leçon (2026-08-16)** : à la clôture du 2026-08-09, le livrable final avait été **uploadé
  > (Vercel Blob) sans jamais être conservé en local** — plus aucun MP4 sur disque ni dans git, alors
  > que la note disait "livrable final uploadé". Un lien d'upload n'est PAS une archive : le render
  > local est la source. **Garder le MP4 dans `out/.../FINAL/` avant tout upload**, pour les 3 tests.

## Méthode standard pour tout nouveau test client-sim

Issue du débrief Flowdesk (voir [flowdesk-client-sim-conclusions](../projects/flowdesk-client-sim-conclusions.md)
pour le détail complet), affinée pour NorthShield (voir [BRIEF-CLIENT](noteshield/BRIEF-CLIENT.md)) :

1. **Direction A (Human/Narrative) + Direction B (System/Conceptual)** en parallèle — PAS un
   choix binaire, PAS figé en "toujours personnage vs toujours abstrait" (A peut être un objet
   concret non-humain : colis, facture, transaction...). **Ne jamais dicter la métaphore aux
   modèles** — brief l'INTENTION (ex: "rendre visible le mécanisme de décision"), jamais la
   forme visuelle elle-même (ex: ne pas dire "checkpoint"/"constellation"/"balance").
2. **Grille par panneau (ajout NorthShield)** : pour chaque panneau, répondre à INFORMATION
   (qu'est-ce que ça doit faire comprendre ?) / REPRÉSENTATION (pourquoi ce choix plutôt qu'un
   autre ?) / MEDIUM (SVG/illustration/vidéo/UI/typo/autre ?) / SEMANTIC TEST (que comprend-on
   en 5s sans narration ?) — évite de refaire une direction faible comme Flowdesk 2B seule.
3. **Semantic Test** avant toute animation coûteuse : que comprend-on de chaque storyboard sans
   narration ? **⛔⛔ C'est un GATE, pas une note informative** (leçon NorthShield, 2026-08-07) :
   si le test révèle une asymétrie nette entre deux directions concurrentes (une "comprise
   immédiatement", l'autre "partiellement comprise") sur un panneau critique, traiter ça comme un
   motif d'ARRÊT avant tout code — pas comme "à garder en tête" pendant qu'on code la direction
   faible quand même. Vécu : signal ignoré → ~2 sessions de motion design (v1+v2, jury 4 modèles)
   pour corriger un problème qui n'a jamais été le motion, mais la direction créative elle-même
   (rejet sur le fond après coup). Corollaire : "le motion design est-il bon" et "cette direction
   répond-elle au brief" sont deux questions INDÉPENDANTES — poser explicitement les deux à tout
   jury de review, ne jamais supposer que la première couvre la seconde.
4. **Mix & Match** scène par scène plutôt qu'un registre unique sur toute la durée.
5. Si l'abstraction (Direction B) est utilisée seule à un moment : s'assurer qu'elle est
   **ancrée par du concret avant/après** (structure CONCRET→ABSTRAIT→CONCRET) — l'abstraction
   non ancrée est le piège qui avait fait rejeter la 1ère passe Flowdesk (V1/V2).
6. Règle à 3 voies pour le comportement graphique : **Structure = draw-on** (stroke-dasharray) ·
   **Information = apparition/mouvement** · **Humain = vidéo/mouvement organique**.
7. **Chaîne à tester si le brief inclut un vrai produit (ajout NorthShield)** : HUMAN → SYSTEM
   (mécanisme invisible) → PRODUCT (preuve dans une vraie UI, même fictive) → conséquence
   utilisateur. Va au-delà de ce que Flowdesk a testé (HUMAN + SYSTEM seulement).
8. **Horizontal d'abord, vertical en tout dernier** (contrainte de séquencement globale, pas
   juste un test) : ne jamais mener 16:9 et 9:16 en parallèle — le recadrage vertical premium
   est une offre à tester APRÈS validation complète du 16:9, jamais avant/en même temps.
9. Pipeline complet formalisé dans [flowdesk-client-sim-conclusions](../projects/flowdesk-client-sim-conclusions.md)
   § "Pipeline SaaS V1".

## ⭐⭐ Outils & pièges techniques (à lire AVANT de lancer un nouveau test — évite de redécouvrir ces 3 pièges)

Vécu sur NorthShield (2026-08-06/07), 3 blocages qui ont coûté du temps et sont désormais évitables :

### 0. Pipeline audio TTS — même chaîne que le reste du projet
Aucun script dédié client-sim n'existe pour la voix — réutiliser directement
`scripts/generate-narration-expressive.py` (pipeline Harmonie V3 → STS GéoAfrique, doc complète
`memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`). Pas besoin de le redécouvrir : c'est le même
pipeline que Souverain/Atlas, testé sur Flowdesk et NorthShield sans adaptation.

### 1. Script voix — jury créatif 2 modèles (Gemini + Grok)
`scripts/tools/jury-script-saas-llm.py --brief script.md --label X --models gemini,grok` — variante
SaaS de `jury-script-creatif-llm.py` (celui-ci est calibré documentaire géopolitique long-form, PAS
adapté à un script pub court). Brief axé show-don't-tell/dynamisme motion-design/personnalité de
ton, pas narration factuelle. Limité à Gemini+Grok par choix (complémentaires : Grok = personnalité,
Gemini = rigueur/détection d'erreurs) — PAS les 4 modèles du script narratif.

### 2. Storyboard visuel — DEUX registres, DEUX pipelines DIFFÉRENTS
- **Direction Human/Narrative (silhouettes, personnages simplifiés)** → **Gemini 3.1 Flash Image**
  en appel direct (`gemini-3.1-flash-image-preview`, via `scripts/tools/storyboard-dual-gen.py
  --models gemini`). PAS de génération SVG pour les silhouettes — testé, perd en qualité vs Gemini
  direct sur ce type de sujet.
- **Direction System/Conceptual (abstrait, dataviz, motion design pur)** → **Fable 5 en agent
  Claude Code, mode raisonnement MAX** + optionnellement panel `scripts/tools/svg-scene-abstrait.py`
  (Gemini/GPT/Kimi) pour comparer. ⛔ **NE JAMAIS utiliser `svg-scene-narrative.py` pour un brief
  abstrait** — détail complet + cause racine + exemple :
  `memory/doctrines/SVG-SCENES-GENERATIVES.md` § GATE AMONT (source de vérité, ne pas dupliquer
  ici).

### 2bis. ⛔⛔ Fable MODE MAX — la formule doit être répétée à CHAQUE appel Agent, jamais implicite
Chaque appel du tool Agent est indépendant : dire "mode MAX" dans le premier prompt d'une série ne
fait PAS persister le mode pour les appels suivants. Vécu : 5 appels Fable consécutifs sur les
panneaux d'un même storyboard, MAX formulé seulement dans le 1er (le mockup laptop) → les 5
suivants sont tournés en effort normal (durée ~1-3min au lieu des 6-9min attendus pour MAX, poids
SVG résultant 10-50x plus léger que la référence Flowdesk MAX). Symptôme repérable : un rendu SVG
"correct mais clairsemé", qui ressemble à "3 lignes fines sur fond vide" plutôt qu'à une
composition dense. **Réflexe** : inclure la phrase complète "Tu es Fable, appelé en mode
RAISONNEMENT MAXIMUM (MAX) — prends tout le temps nécessaire (6-9 minutes), ne te presse pas" dans
CHAQUE prompt Agent séparé qui appelle Fable, sans exception, même si le précédent l'avait déjà.

### 3. Image-cible = capturer l'ÉVÉNEMENT narratif, pas un état neutre
Avant de lancer la génération d'un panneau, relire la phrase du script + la colonne REPRÉSENTATION
du storyboard et se demander explicitement : "est-ce que mon brief décrit un ÉTAT (une chose qui
existe) ou un ÉVÉNEMENT (quelque chose qui arrive/change) ?" Un brief qui ne capture que l'état
("un flux de traits qui défile") produit une image qui ne raconte rien au Semantic Test, même
techniquement irréprochable — vécu sur NorthShield P1 (script décrivait une barre qui BLOQUE un
flux + embouteillage qui se forme ; le premier brief ne demandait que "traits qui défilent",
oubliant l'événement de blocage — corrigé en explicitant la barre + l'embouteillage compressé dans
le brief v2, Semantic Test passé ensuite). **Toujours faire le Semantic Test soi-même sur le rendu
avant de le présenter** — 5 secondes, sans texte, "qu'est-ce que je comprends ?".

### 4. Deux gotchas motion design (v2 NorthShield, 2026-08-07)
- **`splitByTag` (dans `svgGroupExtractor.ts`)** : quand un groupe SVG mélange un label texte
  statique et une géométrie animée qui NE DOIVENT PAS suivre la même transformation (ex un
  `translateY` de convergence qui ne doit déplacer QUE le tracé, pas son label) — séparer les deux
  avant d'animer, sinon le label suit le mouvement et finit superposé/illisible.
- **Le hook `pre-presentation-review.sh` + `visual_review.py --palette navy` est câblé pour la
  palette Souverain (navy/gold/ivory)** — pas applicable aux projets client-sim à charte
  différente (vu 2 fois : Flowdesk, NorthShield). Nécessite un override tracé
  (`<mp4>.review-override.md`) à chaque fois tant qu'aucun mode de review paramétrable par
  palette n'existe pour client-sim.
