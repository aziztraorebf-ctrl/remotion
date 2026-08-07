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

## Tests réalisés

- ⭐⭐⭐ **Flowdesk (SaaS fictif, centralisation de demandes internes) — CLOS 2026-08-06.**
  Conclusions stratégiques (pipeline SaaS V1 formalisé, Direction A/B, règle
  draw-on/mouvement/vie, structure CONCRET→ABSTRAIT→CONCRET) :
  [flowdesk-client-sim-conclusions](../projects/flowdesk-client-sim-conclusions.md).
  Détail technique (code, bugs, timings, historique V1→V4) :
  [STATUS](../episodes/_client-sim/flowdesk/STATUS.md).
  Code : `src/projects/_client-sim/flowdesk/`.

## Test en cours — pivot vers un storyboard incarné (2026-08-07)

- ⭐⭐⭐ **NorthShield (SaaS cybersécurité, scoring de risque de connexion).** Objectif testé :
  HUMAN + SYSTEM + PRODUCT. **Direction B pure (100% abstraite) codée en v1 puis v2 (motion
  corrigé après rejet unanime d'un jury à 4 modèles) — mais REJETÉE SUR LE FOND par Aziz après
  visionnage v2** : le flux P1 reformule le cliché "pluie de données" interdit par le brief, et
  l'absence d'incarnation humaine viole la chaîne HUMAN→SYSTEM→PRODUCT. **Pivot décidé : storyboard
  V3 mixte** (Direction A incarnée + Direction B mécanisme + apports d'un storyboard GPT externe),
  personnage Sarah en MiniMax H3 (pas SVG). Détail complet + code v2 réutilisable :
  [STATUS](../episodes/_client-sim/noteshield/STATUS.md). Storyboard à coder la prochaine
  session : [STORYBOARD-V3-MIX-INCARNE](noteshield/STORYBOARD-V3-MIX-INCARNE.md).
  Brief client original : [BRIEF-CLIENT](noteshield/BRIEF-CLIENT.md).

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
