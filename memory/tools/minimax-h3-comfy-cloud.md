# MiniMax H3 — Comfy Cloud (mécanique, node IDs, guide officiel, tests réels)

> ⭐⭐ **Blocs de prompt prêts à copier (SIZE/ANCHOR/LIGHT/EMPTINESS LOCK) : `memory/tools/H3-PROMPT-BLOCKS.md`**
> ⭐ **Mesurer un clip avant de le juger : `scripts/tools/measure-insert-clip.py`**
>
> Fichier scindé depuis `minimax.md` le 2026-08-13. Sommaire général : `minimax.md`. Tests de styles (Hand Drawn, Poster Vector) : `minimax-h3-styles-tests.md`. API fal.ai payante : `minimax-h3-api-fal.md`.
> Contenu : template open-weight `video_minimax_h3_r2v`/`video_minimax_h3_t2v` via Comfy Cloud (inclus dans l'abonnement), guide de prompting officiel MiniMax, format 6-sections (⚠️ voir correction 2026-08-14 dans `minimax-h3-styles-tests.md` avant d'appliquer — ce format est officiel pour l'API hébergée payante, pas confirmé pour notre node local gratuit), workflow validé `submit_workflow`, tous les tests réels (Sonjata, NoteShield, Flowdesk, Pêcheur, Mariama Bâ...).

## ⭐⭐ MiniMax H3 via Comfy Cloud (open-weight, INCLUS DANS L'ABONNEMENT, validé 2026-08-08) — PRÉFÉRER À L'API fal.ai

> Découverte de session : H3-Base (le modèle sous-jacent, pas juste le wrapper API) est **open-weight
> depuis début août 2026** et tourne sur Comfy Cloud (`cloud.comfy.org`) via un plugin Claude Code
> officiel. Coûte ~1.30$/5s sur fal.ai (section ci-dessous) pour EXACTEMENT le même modèle self-hosted
> ici, sans surcoût par génération. **Toujours essayer cette voie en premier**, garder fal.ai en
> fallback si Comfy Cloud est down/saturé.
>
> ⚠️ **CORRECTION (2026-08-08, même session) : "0 crédit" ≠ gratuit, c'est "inclus dans l'allocation
> d'heures GPU mensuelle du forfait".** `estimate_credits` affiche 0 pour la variante open-weight (pas
> de surcoût crédits *au-delà* du forfait), mais le job consomme du vrai temps GPU décompté du
> forfait — confirmé via `get_usage_report` : $0.173 dépensés sur nos 4 premiers tests (~$0.043/clip
> en moyenne, clips 8-15s), catégorie "GPU Hours Product". **Le vrai mécanisme de facturation** :
> 0.39 crédit/seconde de GPU actif → Standard (4200 créd./mois) ≈ **4.4h de GPU/mois**, Creator (7400
> créd./mois) ≈ **7.7h/mois**. Reste très avantageux vs fal.ai (~26x moins cher au clip), mais ce
> n'est PAS un puits sans fond — surveiller la conso cumulée si beaucoup de tests s'enchaînent.
> Détail limite technique (pas liée à ce budget) : **30 min max par exécution unique** (1h sur Pro),
> job annulé automatiquement au-delà — sans rapport avec l'allocation mensuelle, aucun de nos tests
> n'en a approché la moitié.
>
> ⭐ **Suivi de coût — préférence Aziz (2026-08-08)** : rapporter en priorité la **consommation GPU
> réelle** (minutes/heures, via le mécanisme 0.39 crédit/seconde documenté ci-dessus) plutôt que
> marteler un montant en dollars à chaque test. Le dollar reste la métrique de secours fiable tant
> qu'~~aucun endpoint ne renvoie directement une durée GPU~~ ⛔ **FAUX, corrigé 2026-08-21** : `get_billing_activity` renvoie `gpu_seconds` + `gpu_type` PAR JOB (mais aucun dollar). `get_usage_report` donne les dollars par produit, jamais les heures. Croiser les deux pour un coût par job. Tarif dérivé constant vérifié : **4,66 $/h sur `rtx_pro_6000`** (5,00 h = 23,30 $ sur 116 jobs, coût moyen 0,20 $/job). `get_job_status` donne succeeded/job_failed (vérifié
> 2026-08-08 : l'outil ne renvoie que des dollars, pas de minutes — ne PAS halluciner de taux de
> conversion crédit→GPU pour combler ce manque, le signaler explicitement à la place). Objectif :
> savoir combien de temps GPU réel a été utilisé sur Comfy Cloud, pas juste le prix payé.

### ⭐⭐⭐ Vitesse par résolution + ralentissement en parallèle (mesuré, 2026-08-09)

Même scène (poignée de main, 2 personnages, R2V) générée en 480p, 720p, 1080p pour comparer vitesse ET qualité.

| Résolution | Dimensions | Temps SOLO (1 seul job) |
|---|---|---|
| 480p | 864×480 | ~141s |
| 720p | 1280×720 | ~473-502s (~8min) — **"sweet spot" qualité/vitesse selon Aziz** |
| 1080p | 1920×1072 (override manuel width/height node 136) | ~19min |

- **Qualité 480p surprenamment nette** pour le style cartoon-flat/papercraft (aplats de couleur,
  contours nets) — tolère beaucoup mieux la basse résolution qu'un style photoréaliste, moins de
  gradients/détails fins à préserver. Utile pour du prototypage rapide multi-variantes.
- **Ratio temps/résolution non-linéaire** : 1080p ne fait que ~2.25x plus de pixels que 720p mais
  prend ~2.4x plus de temps — cohérent, mais l'écart absolu (8min → 19min) est significatif à budgéter.

> ⭐⭐ **MESURE CONTRADICTOIRE (2026-08-15, 480p, 2 jobs R2V 5s lancés dans le même message)** :
> **2 clips livrés en 132s au TOTAL** (1er à 79s, 2e à 132s) — soit MOINS que les ~141s annoncés
> ci-dessous pour UN SEUL clip 480p solo. Le ralentissement 3.5× décrit juste après **ne s'est pas
> reproduit**. Les 2 jobs : `55948042` (conduite) + `4e8d57b5` (billets), 864×480, 124 frames chacun.
> Hypothèse la plus probable : la mesure du 09/08 tombait un weekend (charge du service), pas une
> limite structurelle du compte — cohérent avec le doute déjà exprimé ci-dessous (« non confirmé si
> structurel au compte ou lié à une charge weekend »). **En pratique : lancer 2 jobs courts en
> parallèle est rentable**, ne pas s'en priver par précaution. À re-mesurer si un jour 2 jobs longs
> (15s) sont lancés ensemble — non testé à cette échelle.

**⛔⛔ DÉCOUVERTE — ralentissement 3-4x quand 2 jobs H3 tournent EN PARALLÈLE (même compte)** : un job
480p qui prend normalement ~141s solo est passé à ~502s (~3.5x plus lent) quand lancé en même temps
qu'un autre job. **La parallélisation ne réduit PAS le temps total pour obtenir 2 résultats** sur ce
compte — hypothèse : allocation GPU partagée/limitée plutôt que jobs concurrents sur ressources
séparées. **Nuance la recommandation "prototypage rapide multi-variantes EN PARALLÈLE" ci-dessous**
(2026-08-08) : reste valable pour la LATENCE PERÇUE (tout finit "en même temps" plutôt qu'en séquence
stricte), mais PAS pour le temps GPU total consommé, qui grimpe. **Non confirmé si structurel au
compte ou lié à une charge weekend du service Comfy Cloud** — à revérifier un jour de semaine avant de
trancher définitivement. Ne pas assumer une parallélisation gratuite pour la planification de futurs
tests tant que ce n'est pas clarifié.

### ⚠️ Storyboard multi-panneaux (grille) comme référence H3 — PISTE OUVERTE, non résolue (2026-08-09)

Exploration (suggestion Aziz, hors brief initial) : utiliser une image-grille multi-panneaux (ex. 2x2)
comme référence unique pour raconter une séquence en plusieurs temps dans un seul clip H3.

**Recherche communautaire (Tavily)** :
- La communauté MiniMax H3 utilise bien des grilles storyboard comme référence — traitées comme
  n'importe quelle image de référence, **pas de node/template officiel dédié** pour H3 sur Comfy Cloud
  (contrairement à Seedance 2.0 qui A un template officiel `template_seedance2_storyboard_to_video`,
  mais payant/API, pas open-weight comme H3).
- Failure mode documenté par la communauté : **le modèle blend les panneaux simultanément quand le
  prompt est ambigu**. Fix recommandé = segmentation temporelle STRICTE et explicite par panneau
  (ex. "0-2s: EXACTEMENT panel 1, HOLD, ne pas transitionner encore").

**Résultats des 2 tests menés** :
- Test 1 (prompt "transitions smoothly", sans segmentation stricte) : ÉCHEC — dérive au-delà de la
  consigne (accolade complète au lieu de poignée de main simple), 4 panneaux traités de façon floue/
  simultanée. Job aussi plus lent (12min) que l'équivalent image simple (7-8min) à même résolution —
  indice qu'une grille multi-panneaux est plus coûteuse en calcul à traiter.
- Test 2 (prompt corrigé, segmentation stricte par blocs de 2s + clause "STOP à la poignée de main, no
  hug, no embrace") : AMÉLIORATION nette — dérive vers l'accolade évitée, progression plus fidèle aux
  4 panneaux. MAIS le problème de fond N'EST PAS résolu — Aziz signale que les 4 panneaux restent
  "animés chacun en même temps" plutôt que vraiment séquentiels. Job plus rapide (7min), cohérent avec
  l'hypothèse charge parallèle (ce test tournait en même temps qu'un autre job — cf section vitesse
  ci-dessus, à ne pas confondre avec un vrai gain de la technique elle-même).

**DÉCISION AZIZ** : arrêter d'itérer sur le storyboard par essais de prompt seul. La vraie méthode
reste à découvrir via une **recherche communautaire dédiée** (YouTube "last 30 days", ou liens fournis
par Aziz en session future) — **PAS en continuant à deviner des formulations de prompt** sans nouvelle
source d'information.

**Pour la prochaine session sur ce sujet** : chercher d'abord si une méthode/paramètre spécifique
(node caché, syntaxe de prompt particulière, ordre de tags `<Picture N>`) existe côté communauté H3
avant de retenter un 3e essai de formulation à l'aveugle.

**⭐⭐ PISTE NEUVE (2026-08-09, analyse 4 transcripts YouTube H3)** : nos 2 tests précédents utilisaient
tous les deux **UNE seule image composite multi-panneaux** (grille 2x2 dans une image) comme référence.
Une vidéo (« How To Use MiniMax H3 in ComfyUI », creator anonyme) rapporte un succès (« pulled it off
beautifully ») avec un « comic collage » animé « comme l'ouverture d'un thriller » + timestamps par
élément — MAIS le transcript (auto-caption, imprécis) ne permet pas de trancher s'il s'agissait d'une
image composite unique ou de **plusieurs frames séparées connectées chacune à un node `LoadImage`
distinct** (le node R2V accepte jusqu'à 9-12 références simultanées, cf section multi-référence
ci-dessous — largement assez pour 4 panneaux). Cette 2e hypothèse est un test que nous n'avons PAS
encore fait (nos 2 essais = toujours 1 seule image grille) et diffère structurellement : le modèle
recevrait 4 images numérotées distinctes (`<Picture 1>`...`<Picture 4>`) plutôt qu'une image à décoder
lui-même en sous-régions. **Prochain test recommandé** : découper le storyboard en N fichiers séparés
(un crop par panneau), les uploader comme N `LoadImage` distincts (nodes 137/139/+ éventuels slots
additionnels), prompt avec segmentation stricte par tranche + référencer chaque `<Picture N>` dans
l'ordre — avant de conclure que la piste storyboard est morte pour de bon.

**⭐⭐⭐ CONFIRMATION + architecture précise (2026-08-09, vidéo dédiée « Free StoryBoard Workflow »,
GeekatplayStudio)** : la piste "N images séparées" ci-dessus est CONFIRMÉE par une vidéo qui traite
frontalement ce sujet — mais l'architecture réelle est différente de ce qu'on imaginait (pas N images
simultanées référencées `<Picture 1..N>` dans un seul prompt/run). C'est un **enchaînement de segments
first/last-frame**, pas une segmentation temporelle interne à un run unique :
- Workflow custom gratuit, **téléchargeable tel quel** :
  `https://github.com/GeekatplayStudio/ComfyUI-MiniMax-H3-StoryBoard` (pas un template officiel
  Comfy Cloud — à importer/adapter si on veut le reproduire).
- Architecture : un node **"Storyboard Manager"** central + N **"Panels"**, chaque panel = 1 image
  importée + un champ texte ("story panel") qui décrit action/scénographie/découpage temporel. **Le
  panel N+1 sert de last-frame au panel N** — donc c'est une chaîne de segments R2V (chacun avec son
  propre couple first/last-frame) mise bout à bout par le manager, PAS un seul run H3 qui reçoit 4
  images numérotées à traiter en une passe. Ça correspond structurellement à notre outil existant
  (node 139 = 2e slot LoadImage pour interpolation first/last, déjà documenté plus haut) répété N fois
  en chaîne plutôt qu'utilisé une fois.
- **2 modes de sortie** : (a) fusion en 1 seul clip long (testé dans la vidéo, 5 panels × 10s ≈ 1min)
  — (b) export de chaque segment séparément, **recommandé par l'auteur lui-même** ("the segments work
  little bit better, they are seamless, you can assemble them afterward") — cohérent avec notre
  pratique Remotion existante (on monte déjà par segments/beats).
- **Résultat honnête, pas une solution magique** : même avec cette architecture correcte, l'auteur
  observe des artefacts À CHAQUE JONCTION — petit "jump"/sursaut visuel à la transition, un cas de
  ralentissement local non voulu (arbres qui repoussent au ralenti), un cas de doublement de
  personnage (attribué par l'auteur à une erreur de son placement first/last-frame, pas au modèle).
  Conclusion de l'auteur : prometteur mais pas encore lisse, encore en développement de son côté.
- **Implication pour nous** : le chaînage first/last-frame répété (mode segments séparés) est
  probablement la meilleure piste réaliste pour une continuité multi-plans H3 — mais **prévoir un
  raccord/lissage en post (Remotion) systématiquement**, ne pas viser un rendu H3 100% propre en sortie
  brute. Reste à tester chez nous : chaîner 2-3 segments R2V nous-mêmes (image de fin du plan N = image
  de départ/référence du plan N+1, déjà notre pratique de continuité inter-plans validée le 2026-08-08
  sur Sonjata scene2→plan2) plutôt que retenter une image composite multi-panneaux.
- Autre détail utile de la même vidéo : qualité du **texte-à-vidéo pur jugée faible** ("missing
  details") — confirme notre pratique déjà systématique de toujours partir d'une image de référence
  générée séparément plutôt que de laisser H3 générer le premier frame en T2V pur.

### ⭐⭐ Prototypage rapide multi-variantes EN PARALLÈLE (validé 2026-08-08)
Envoyer **plusieurs appels `run_template` dans le même message** (pas un `for` séquentiel) — les jobs
tournent en parallèle côté serveur Comfy Cloud, récupérables tous en même temps ensuite. Testé : 3
variantes de prompt (même image de référence, seed différent par variante) sur la scène pêcheur,
lancées ensemble, toutes complétées en ~1 cycle d'attente au lieu de 3 séquentiels. **Usage
recommandé** : tester 3-4 directions de prompt/mise en scène sur la MÊME image avant de committer à
une version — le coût marginal par variante (~$0.04) rend ce prototypage quasi négligeable comparé à
la valeur de voir plusieurs options avant de choisir.
⚠️ `submit_batch` (l'outil batch officiel, un seul appel groupé) a échoué 2x sur ce test précis
(`validation.schema` avec le JSON complet du template R2V, 23 nodes) — probablement un format
attendu différent pour le workflow imbriqué en item de batch, pas creusé plus (JSON trop volumineux
pour itérer à l'aveugle). **La méthode qui marche à coup sûr : plusieurs `run_template` en un seul
message, pas `submit_batch`.** À revisiter si `submit_batch` devient nécessaire pour un vrai gros lot
(20+ variantes).

### ⭐ Comportement d'interprétation créative fidèle au DESIGN de l'objet, pas au verbe littéral
Sur un test "la barrière se ferme brusquement" (scène NoteShield, objet de référence = tube lumineux
cyan continu, PAS une barrière mécanique articulée) : H3 n'a pas produit de mouvement mécanique de
fermeture — il a plutôt **éteint la lumière du tube** pour signifier "bloqué/accès refusé". Résultat
jugé par Aziz comme un succès partiel, pas un échec : la marche/réaction de surprise fonctionnent,
seul le verbe "se ferme" a été réinterprété selon la logique visuelle de l'objet réellement dessiné
dans l'image de référence (pas d'articulation mécanique visible = pas de mouvement mécanique inventé).
**Leçon prompt** : si un comportement mécanique précis est requis sur un objet dont le design ne le
suggère pas visuellement, le décrire de façon plus explicite et littérale ("the light bar physically
drops down") plutôt que d'utiliser un verbe générique ("closes/shuts") laissé à l'interprétation du
modèle.

### ⭐⭐⭐ DÉCOUVERTE MAJEURE — prompt laxiste = cause racine des échecs H3, pas le modèle (2026-08-08)
Test A/B contrôlé, même image de référence (Sonjata scene2-humiliation), même durée (10s), même
mouvement demandé (le jeune Sundiata se relève) — SEULE variable changée : la rigueur du prompt.

**Prompt A (laxiste, écrit vite par Claude)** : mentionnait "gripping a wooden staff that appears in
his hands" — un bâton **halluciné dès la conception du prompt**, pas un artefact H3. Résultat :
bâton halluciné apparaît quasi immédiatement (~4s sur 10s), et **toute la foule (8 personnages)
réagit en choc collectif et simultané dès ~6.6s**, AVANT que le garçon ait visiblement fini de se
lever — la réaction précède la cause, désynchronisation dramatique complète.

**Prompt B (rigoureux, composé par l'agent `visual-producer` avec sa discipline Seedance 2.0)** :
séquençage strict par tranches de 2s ("0-2s: head slowly rises... 2-4s: back begins to
straighten... 4-6s: plants one foot... 6-8s: rises fully... 8-10s: stands upright"), **clause
négative répétée et explicite** ("NO staff, NO cane, NO stick... His hands are empty throughout" +
un bloc final "STRICT NEGATIVE: no staff, no cane, no crutch, no stick, no spear, no walking aid,
no weapon..."), décor verrouillé explicitement ("Nothing changes in the environment: same X, same Y,
same Z..."), et foule cadrée en mouvement minimal ("static feet, no walking, no repositioning").
Résultat : **zéro bâton, zéro morphing, timing respecté à la seconde près (vérifié par Aziz), foule
qui ne réagit qu'au bon moment**, respiration lourde du personnage pendant l'effort — comparaison
frame-par-frame confirme le contraste (voir captures scratch de session, non conservées).

**Conclusion actionnable, la plus importante de la session** : **le vrai levier de qualité H3 n'est
PAS le modèle, c'est la discipline d'écriture du prompt** — exactement le même principe que Seedance
2.0. Un prompt "one-shot" écrit vite (quelques phrases descriptives) produit des hallucinations et
une désynchronisation du timing dramatique. Un prompt structuré avec (1) séquençage temporel explicite
par tranches, (2) clause négative répétée pour tout élément à NE PAS faire apparaître, (3) décor
verrouillé explicitement, (4) sujets de réaction nommés précisément (pas "the crowd" en bloc si un
contrôle fin est voulu) élimine la quasi-totalité des défauts observés sur les tests précédents de
cette même session (Flowdesk, Pêcheur, NoteShield 1er essai — tous avec des prompts plus courts/lâches).

**⭐ Pour toute future génération H3 avec un enjeu narratif précis** : **toujours passer par l'agent
`visual-producer`** (pas composer le prompt soi-même à la volée) — il applique déjà la discipline
Seedance 2.0 (mots-rouges-verts, granularité micro-moment, clause négative) documentée dans
`.claude/agents/visual-producer.md` et `memory/tools/seedance-rules.md`/`seedance-prompts.md`, et ces
mêmes principes se transfèrent directement à H3 malgré les deux étant des modèles différents.
Piste à creuser : isoler quel(s) personnage(s) précis doit réagir plutôt que "the crowd"/"the group"
en bloc — Aziz a noté que la réaction collective simultanée reste "un peu exagérée" même sur le
prompt B, hypothèse que H3 a un biais à intensifier une réaction de groupe non individualisée.

**Confirmation supplémentaire (2026-08-13, projet canada-red-bay)** : même pattern (séquençage strict
par tranches de 2s + clause STRICT NEGATIVE finale listant tout ce qui ne doit pas apparaître/changer
+ décor verrouillé explicitement) appliqué à un sujet totalement différent (baleine boréale qui
plonge, pas de personnage humain) — succès net, zéro hallucination, séquençage respecté à la lettre.
2e preuve indépendante que le principe se généralise au-delà des scènes à personnages.

### ⛔⛔ TOUJOURS logger le `prompt_id` de chaque `run_template` (règle née d'un incident non résolu, 2026-08-08)

Sur le dernier test de la session du 08/08 (orbite caméra, tentative finale), le job est revenu
`succeeded` mais a livré un contenu totalement étranger au prompt envoyé (scène super-héros/robot
géant au lieu de Sonjata — voir § "Diagnostic forensique post-mortem" plus bas). Le diagnostic a
confirmé que rien de notre côté n'expliquait l'anomalie (prompt, image, overrides tous vérifiés
corrects), mais l'enquête a buté sur un point : **le `prompt_id` de ce run n'avait jamais été noté
nulle part**, rendant impossible toute vérification a posteriori côté serveur (`get_job_status`/
`get_queue`).

**Règle** : à chaque `run_template`, noter le `prompt_id` retourné (dans la réponse texte au minimum,
idéalement dans un sidecar `.txt` à côté du clip téléchargé) — avant même de savoir si le résultat sera
bon. Si un contenu aberrant apparaît malgré un statut "succeeded", ça permet de comparer via
`get_job_status`/`get_queue` et de distinguer un glitch ponctuel d'un vrai bug structurel Comfy Cloud,
plutôt que de repartir sans aucune trace exploitable.

### ⛔⛔⛔⛔ CAUSE RACINE TROUVÉE ET CORRIGÉE — `input_overrides` sur `run_template` NE S'APPLIQUE PAS de façon fiable sur `video_minimax_h3_r2v` (2026-08-11, invalide l'hypothèse "glitch infrastructure" du 08/08)

**Contexte** : test dédié (mix SVG statique + H3, piste gig freelance entrée de gamme, image de
référence "entrepreneur inquiet à son bureau" générée par Gemini 3.1 Flash Image, prompt R2V rigoureux
352 mots suivant la discipline validée le 08/08). **2 runs consécutifs via `run_template` +
`input_overrides` (nodeId→{inputName:value}), prompt_id différents
(`a81c2c89-adbb-4cb2-9b4a-f5d946d87ecb` puis `fe40ce2f-9650-4834-96e2-229a48ad35b1`), mêmes inputs
exacts** → **les 2 clips retournés sont IDENTIQUES frame pour frame** au contenu de DÉMONSTRATION
intégré au template (un enfant en cape de super-héros → texte "GET READY TO MEET YOUR MAKER" → robot
noir menaçant) — ZÉRO rapport avec notre image/prompt. `get_job_status` ne montrait rien d'anormal
dans les 2 cas (statut "completed" propre), symptôme identique au run super-héros/robot déjà rencontré
le 08/08 (§ ci-dessous) qui avait alors été attribué, faute de preuve, à un "incident infrastructure
Comfy Cloud" hors de notre contrôle.

**Aziz a challengé ce diagnostic** ("c'est impossible, on a déjà généré sans problème sur Sonjata/
Flowdesk — creusons ce qui ne marche pas") — bonne intuition, confirmée par l'investigation :

**Root cause réelle** : le warning `conversion_warning: "Node 137/139 (LoadImage): 1 extra widget
values not mapped"`, présent sur les 2 runs cassés et lu à tort comme bénin, signalait que
**`input_overrides` n'a PAS réussi à appliquer nos valeurs** sur les nodes `LoadImage` (137/139) ET
`PrimitiveStringMultiline` (138) de ce template précis — malgré un statut `succeeded_with_warnings`
qui donnait l'illusion que tout allait bien. Le template est retombé sur ses `widgets_values` par
défaut EMBARQUÉS dans le JSON du template lui-même : node 137 = `"red_superboy_on_city_roof.png"`,
node 138 = un prompt de démo mot-pour-mot le clip super-héros/mecha (vérifié en lisant le JSON complet
via `get_template` SANS `summary_only`), node 139 = `"mecha_dragon_lightning.png"` (déjà documenté
plus bas dans ce fichier comme "image de démo par défaut" — mais jusqu'ici jamais confirmé comme LA
cause d'un run cassé, seulement noté comme un risque théorique).

**Preuve définitive (test de contrôle)** : reconstruction du MÊME graphe en format API pur
(node-id → `class_type` + `inputs`, valeurs câblées EN DUR dans chaque node, aucun `input_overrides`)
soumis via `submit_workflow`. **1er essai** : `dry_run` local passe (0 warning) mais soumission réelle
rejetée PROPREMENT par le serveur AVANT tout calcul GPU (`node_errors` sur 131/`ComfyMathExpression` :
`required_input_missing`, `values.a` — le nom exact du input `a` dans ce node est `values.a`, pas `a`,
visible dans le JSON save-format d'origine mais pas dans le message d'erreur du run précédent). Fix
appliqué (`"values.a": ["132",0]` au lieu de `"a": ["132",0]`), **2e essai réussi, 0 warning, clip
CONFORME au prompt/image envoyés** — le personnage entrepreneur, chorégraphie main-qui-descend →
tête-qui-se-lève → sourire de soulagement, exactement comme spécifié dans le prompt (vérifié
frame-par-frame à t≈4/6/9s).

**Implication générale, au-delà de ce seul incident** : sur ce template (`video_minimax_h3_r2v`),
`input_overrides` via `run_template` n'est PAS fiable pour les nodes `LoadImage` (137/139) ni
`PrimitiveStringMultiline` (138) — silently retombe sur le contenu par défaut du template sans
erreur bloquante, juste un warning `conversion_warning` facile à négliger. **`submit_workflow` avec
un graphe API construit à la main (valeurs en dur, pas d'override) est la méthode fiable** pour ce
template précis. Reste à vérifier si ce défaut de mapping touche d'autres templates H3
(`video_minimax_h3_t2v`, `video_minimax_h3_i2v`) ou seulement `r2v` — non testé.

**⛔ Correction rétroactive du diagnostic du 08/08** (§ "Test corrigé — causalité barre..." plus haut
dans ce fichier, run orbite caméra Sonjata) : l'hypothèse retenue à l'époque ("incident infrastructure
Comfy Cloud, notre pipeline disculpé") était **probablement fausse** — le même symptôme exact
(contenu super-héros/robot malgré overrides envoyés) a désormais une explication vérifiée et
reproductible côté `input_overrides`, sans avoir besoin d'invoquer un bug serveur externe. Le run du
08/08 n'a pas pu être ré-analysé a posteriori (prompt_id non loggé à l'époque), donc pas de certitude
absolue que c'était EXACTEMENT ce même défaut de mapping — mais c'est maintenant l'hypothèse la plus
probable, largement au-dessus de "glitch infrastructure aléatoire".

**Point technique résolu** (même session, 2e itération) : le clip de contrôle initial était sorti en
640×640 (carré) au lieu du 864×480 attendu — `ResolutionSelector` en graphe API pur ne calculait pas
les bonnes dimensions. **Fix confirmé** : passer `width`/`height` en dur directement sur les inputs du
node 136 (`"width": 864, "height": 480`, valeurs INT littérales, pas de link vers 115) plutôt que de
piloter via `ResolutionSelector` — résultat vérifié `ffprobe` conforme (864×480 exact) sur le 2e test.

### ⭐ Leçon prompt — "mouth opens... as if about to speak" génère un cycle de parole silencieuse non désiré (2026-08-11)

Sur le test de contrôle réussi (entrepreneur, image corrigée en vue 3/4 avec dos d'écran visible —
voir plus haut § cause racine `input_overrides`), Aziz a repéré à la revue que la bouche du personnage
s'ouvre/se referme de façon répétée autour de t≈6.5-7s (vérifié par crop serré + planche-contact
30+ frames consécutives) — un petit cycle façon "parle sans son", pas juste l'entrouvrement statique
voulu. Cause probable : le prompt contenait la clause "mouth opens slightly **as if about to speak**"
pour le beat de réalisation (6-8s) — H3 semble avoir interprété "as if about to speak" plus
littéralement qu'attendu, générant un mouvement labial cyclique de type parole plutôt qu'un simple
entrouvrement figé. **Décision Aziz : ne pas re-générer, le clip prouve déjà ce qu'on cherchait
(procédé mix SVG+H3 validé) — mais retenir la leçon de prompt.**

**Leçon actionnable pour un futur prompt de réaction faciale sans dialogue voulu** : éviter toute
formulation contenant "speak"/"talk"/"say" même en comparaison ("as if about to speak") si aucun
mouvement de bouche articulé n'est désiré — préférer une description purement posturale de
l'entrouverture ("lips part slightly, mouth stays otherwise still, no talking motion") avec une clause
négative explicite ("NOT talking, NOT mouthing words, lips move minimally and only once") si le risque
existe. Cohérent avec la leçon déjà documentée plus haut dans ce fichier (§ prompt A/B Sonjata) : H3
suit le sens littéral des mots choisis, pas seulement l'intention globale.

**Méthode de diagnostic qui a payé** (à réutiliser si un futur run "succeeded" livre un contenu
aberrant) : (1) ne PAS accepter "warnings bénins" sans lire leur texte exact — un
`conversion_warning` sur un node précis pointe souvent la vraie cause ; (2) `get_template` SANS
`summary_only` pour lire les `widgets_values` par défaut réels du template et les comparer au contenu
aberrant reçu (ici, match exact avec le prompt de démo) ; (3) `dry_run` sur `submit_workflow` pour
valider gratuitement un graphe reconstruit à la main avant tout run réel ; (4) en cas d'erreur de
nommage de champ, le serveur rejette proprement AVANT calcul GPU (`node_errors`) — pas de gaspillage.

**Coût réel de toute la session de diagnostic** : 0 crédit mensuel consommé sur tous les essais
(template GPU open-weight, `estimate_credits` confirme 0 avant envoi) — seul coût = temps GPU du
forfait sur les 2 runs cassés + le run de contrôle réussi.

**Fichiers scratch (non conservés dans le repo)** : `ref-scene1-desk-worried.png` (image de référence,
propre, non en cause) + `prompt-scene1.txt` + `build_api_graph.py` (script de reconstruction du
graphe API) + `api_graph_v2.json` (graphe final fonctionnel, réutilisable comme gabarit) +
`clip-scene1-h3.mp4`/`clip-scene1-h3-attempt2.mp4` (les 2 clips cassés identiques, contenu démo) +
`clip-scene1-h3-graph.mp4` (le clip CORRECT, conforme au prompt) + frames de vérification
(`check_*.jpg`, `v2_*.jpg`, `g_*.jpg`).

---

### ⭐⭐⭐ Test enchaînement multi-plans (Sonjata scene2→plan2, 2026-08-08) — R2V confirme la continuité inter-plans

Objectif : vérifier si H3 débloque la série "héros oubliés" (abandonnée pour coût Seedance) en testant
un enchaînement narratif de 2 plans consécutifs (pas un clip isolé). Image de référence = dernière
frame réelle du clip Seedance publié `scene2-humiliation-v2-13s.mp4` (garçon à quatre pattes, mère qui
pointe, foule figée, style papercraft). Plan 2 demandé : relève fragile (PAS un exploit héroïque —
Sundiata historique se relève lentement, dignité pas triomphe), séquençage 2s, clause négative stricte
(mains vides, pas de bâton), décor verrouillé, foule quasi-statique.

**Test A/B contrôlé, 2 prompts rigoureux quasi-identiques (même discipline, séquençage légèrement
différent), même image source, même durée (15s demandé → 15.08s obtenu, conforme à la règle
d'arrondi) :**
- **Prompt B (séquence : hésitation des yeux d'abord → tête → dos → genou planté) : SUCCÈS NET.**
  Style intact 15s, décor verrouillé à 100%, mains vides sur toute la durée (clause négative
  respectée), progression du mouvement dans le bon sens (quatre-pattes → tête levée → buste redressé
  → stabilisé sur un genou, PAS debout), conforme à la contrainte "fragile dignity not triumph".
  Défaut mineur : mouvement plus subtil/lent que le séquençage détaillé du prompt (bras de la mère ne
  s'abaisse pas nettement, pas de vraie hésitation initiale visible) — fidélité approximative au
  script temporel fin, pas un échec.
- **Prompt A (séquence : tête d'abord → main plantée → genou → tenue → réaction villageoise nommée) :
  ÉCHEC TECHNIQUE, à écarter.** Pattern de moiré/quadrillage régulier sur 100% des frames (0 à 15s),
  rendant visages/mains illisibles. **Confirmé comme vrai défaut de génération, pas un artefact
  d'extraction ffmpeg** (reproduit avec 2 méthodes d'extraction différentes : filtre `select` ET
  `-ss`+`-frames:v`). Absent du clip B généré dans les mêmes conditions au même moment → hypothèse
  instabilité aléatoire du sampler sur ce run précis (seed/bruit), PAS un problème de discipline de
  prompt (les deux prompts suivaient la même rigueur validée le 08/08 matin). **Leçon : même avec un
  prompt rigoureux, un run peut sortir un artefact de moiré sévère — toujours générer ≥2 variantes en
  parallèle et inspecter chacune avant de choisir, ne jamais committer sur un seul run.**

**⚠️ Découverte non documentée avant ce test — écart de format d'aspect** : image source 720×1280
(portrait 9:16), les DEUX clips générés sortent en 864×480 (paysage 16:9). Le template R2V ne
préserve PAS automatiquement le ratio de l'image de référence. Non creusé plus (hors scope de ce
test ciblé continuité perso/mouvement) — **si un prochain test vise un format vertical précis,
chercher un param `aspect_ratio`/`resolution` sur le node R2V avant de lancer, ne pas assumer que
la ref image pilote le format de sortie.**

**⭐⭐⭐ CAUSE RACINE CONFIRMÉE + FIX validé (2026-08-08, même jour, test correctif dédié) :**
le format 864×480 forcé venait du node `ResolutionSelector` (id 115) câblé en dur sur
`"16:9 (Widescreen)"` (widgets_values `["16:9 (Widescreen)", 0.4, 32]`) et **relié par lien**
(`link`, pas un widget libre) aux entrées `width`/`height` du node `MiniMaxH3ReferenceToVideo`
(id 136). Le sélecteur n'a AUCUNE option portrait/9:16 dans sa liste (uniquement des ratios 16:9,
voir tableau `MarkdownNote` id 140 du template) — donc pour un output portrait il est **inutile de
le retoucher**, il faut contourner le lien.

**Fix qui marche** : dans `run_template(input_overrides=...)`, passer directement
`{"136": {"width": 480, "height": 864}}` — l'override s'applique **après conversion**, au niveau du
widget du node 136 lui-même, indépendamment du lien entrant depuis 115. Confirmé par les warnings de
soumission (`"override_not_embedded" ... "input is connected, not a widget" — mais "ran on the
executed graph"` : l'exécution a bien pris le override, seul le ré-affichage UI du workflow ne peut
pas l'incruster visuellement, sans impact). **Résultat mesuré** : sortie 480×864 exacte, confirmé
`ffprobe` (`width=480 height=864`), zéro bande noire/pillarbox sur les 8 frames échantillonnées.
Respecte la contrainte multiple-de-32 du modèle (480/32=15, 864/32=27 — cf tooltip `width`/`height`
du node, min 32 max 16384).

**Choix de résolution portrait** : le tableau de `ResolutionSelector` ne couvrant que du 16:9, pour
un ratio 9:16 calculer soi-même une paire proche d'un ratio cible et multiple de 32 des deux côtés
(ex. 480×864 ≈ 0.555, cible 9:16=0.5625 — écart minime, accepté). Pas de table de référence portrait
équivalente trouvée dans le template ; à construire au besoin si d'autres ratios portrait sont
requis (ex. 576×1024 pour un fullHD-ready plus grand).

**Rythme resserré (2e correction demandée le même jour)** : passer d'un séquençage en tranches de 2s
sur 15s à des tranches de 1s sur 8s (durée input `132.value = 8.0` → formule d'arrondi produit
exactement 192 frames = 8.00s réels, valeur pivot nette car `192 % 17 == 5`) **fonctionne** — le
mouvement (quatre-pattes → tête → buste redressé → genou planté → bras de la mère qui s'abaisse) est
visiblement 2x plus véloce à l'écran, sans perdre la contrainte "fragile dignity not triumph" (le
garçon reste bien agenouillé, ne se lève pas debout). Les tranches d'1s sont bien respectées dans
l'ordre (vérifié par extraction de frames à t=0,2,4,6,7s). **Leçon generalisable** : la granularité du
séquençage temporel dans le prompt (durée de chaque tranche) pilote directement la perception de
vitesse de l'action, indépendamment de la durée totale du clip — diviser la durée totale par le même
nombre de beats resserre mécaniquement le rythme.

**Prompt validé (résumé)** : mêmes 4 piliers que le prompt B du test précédent (séquençage temporel
strict, clause négative répétée mains vides/pas de bâton, décor verrouillé explicitement, foule
figée sauf micro-détail sur un seul personnage nommé) + ajout d'une clause de cadrage portrait
("Frame the scene to fill the full vertical 9:16 frame, subject centered, no empty margins on the
sides") — présente dans le prompt en plus du fix technique width/height, defense-in-depth utile si
jamais un prochain template n'a pas d'override direct possible.

Fichiers scratchpad (non conservés dans le repo, R&D pur) : prompt final + clip 480×864/8s +
8 frames d'auto-review, uploadé Vercel Blob pour présentation (URL temporaire, à re-télécharger si
le plan doit être réutilisé en prod).

**Coût réel** : `get_usage_report` cumulé mensuel $2.06 (tous tests confondus, pas de ventilation par
job) — cohérent avec l'estimation ~$0.04-0.17/clip déjà documentée plus haut.

**Fichiers** : prompts dans scratchpad session (non conservés dans le repo, R&D pur) ; clips uploadés
Vercel Blob (URLs temporaires, non pérennes — si le test est validé et doit être réutilisé,
re-télécharger et ranger dans `public/assets/` avant que le lien expire).

### ⭐⭐⭐ Test 15s multi-strates (mère + 1 figurant nommé + ambiance) — 2026-08-08, même chaîne

Suite directe du test 8s ci-dessus. Retour Aziz sur le clip 8s : dynamisme du garçon corrigé, mais
**arrière-plan figé** — demande explicite de pousser à 15s avec plusieurs strates de vie simultanées
(garçon qui se relève + mère qui réagit au-delà du bras + UN figurant nommé qui bouge + nuages qui
dérivent + feuillage du baobab qui frémit), en respectant la règle déjà documentée plus haut
("nommer précisément qui bouge, jamais 'the crowd'/'the group' en bloc").

**Prompt** : même structure que le prompt 8s validé (séquençage temporel strict, clause négative
mains vides répétée, décor verrouillé) + 3 ajouts : (1) le vieil homme chauve au châle, identifié
et décrit par sa position exacte ("standing directly behind the mother") reçoit 3 micro-beats
dédiés sur 15s (poids qui se déplace → tête qui s'incline → main portée près du menton) ; (2) la
mère reçoit un ajout au bras qui s'abaisse déjà validé : adoucissement progressif du regard/mâchoire,
sans sourire ni pardon explicite (cohérence arc narratif) ; (3) une section "CONTINUOUS AMBIENT
MOTION" séparée des beats de personnages, décrivant nuages qui dérivent lentement + feuillage du
baobab qui frémit sous la brise, explicitement en continu sur toute la durée (pas de séquençage par
tranche pour ces deux éléments).

**Exécution** : `run_template(video_minimax_h3_r2v)`, mêmes node IDs que le test précédent (137
LoadImage, 138 prompt, 132 duration=15, 136 width/height override 480×864, 139 écrasé avec la même
image pour éviter le facteur de confusion "mecha dragon" par défaut). Job long (~9 `wait_for_job`
successifs avant complétion, sensiblement plus long que le clip 8s — cohérent avec un job 2x plus
long en frames).

**Résultat mesuré (ffprobe)** : 480×864 confirmé, durée 15.083s (conforme à la règle d'arrondi déjà
documentée : viser 15s comme point d'arrondi fiable). Zéro bande noire.

**Vérification frame-par-frame (12 frames extraites, t=0,1,2,3,4.5,5.5,6,7,8,9,12,14.9)** :

- ✅ **Format** : 480×864 sur toute la durée, aucun pillarbox.
- ⚠️ **Rythme du garçon — PAS celui demandé** : contrairement à la consigne ("densité perceptible en
  permanence, progrès visible toutes les 2-3s, jamais de hold long au milieu"), le mouvement réel
  est resté **quasi invisible de t=0 à t=6-7** (le garçon est visuellement identique à la frame
  source jusque-là) puis **s'est résolu en bloc entre t=7 et t=9** (passage quatre-pattes → genou
  planté en ~2s), puis **hold figé de t=9 à t=15** (6 dernières secondes, aucun changement visible
  de pose). C'est l'inverse du défaut du tout premier test (lenteur générale) mais un nouveau
  défaut de la même famille : le modèle continue de préférer compresser l'action utile dans une
  fenêtre courte plutôt que de l'étaler uniformément, même quand le prompt demande explicitement
  un rythme régulier par tranches de 2-3s sur toute la durée.
- ✅ **Le figurant nommé (vieil homme chauve au châle) bouge de façon visible et discrète** : main
  basse à t=0, main portée progressivement vers le menton entre t=6 et t=9, posture tenue ensuite —
  seul changement de posture visible dans le reste du groupe, conforme à la consigne "pas de vedette
  volée au garçon".
- ⚠️ **Mère** : bras déjà bas dès t=9 (comme le garçon, résolu tôt puis figé) ; l'adoucissement
  d'expression demandé est marginal à l'œil sur les frames extraites — présent en négatif (la mère
  ne redevient jamais plus sévère) mais pas clairement lisible comme un mouvement facial en soi.
- ❌ **Nuages** : AUCUNE dérive perceptible entre t=0 et t=14.9 sur crop dédié (comparaison directe
  ciel haut-image) — position quasi identique.
- ❌ **Feuillage du baobab** : AUCUN frémissement perceptible entre t=0 et t=9 sur crop dédié
  (silhouette du feuillage strictement superposable, contours identiques) — la clause "CONTINUOUS
  AMBIENT MOTION" séparée du séquençage par beats n'a pas été suivie par le modèle sur ces deux
  éléments d'arrière-plan pur (sans personnage).
- ✅ **Pas d'hallucination d'objet** dans les mains du garçon sur aucune frame observée, pas de
  morphing grave visible sur les visages/mains dans l'échantillon de 12 frames.

**⚠️ CORRECTION AZIZ (2026-08-08, immédiatement après ce test) — le diagnostic de l'agent ci-dessus était
FAUX sur plusieurs points, à ne pas reproduire.** Erreur de personnification d'abord : le personnage qui
pointe du doigt n'est PAS "la mère" mais **la matrone/marâtre qui insulte Sundiata** ("il va ramper pour
toujours") ; la vraie mère de Sundiata est **le personnage à droite avec les deux jeunes enfants**, qui
ne réagit qu'en toute fin de séquence. Sur le fond, le rendu est **nettement meilleur que ce que l'agent a
rapporté** :
- Le mouvement n'est PAS "compressé puis gelé" — c'est une vraie chorégraphie enchaînée : la matrone
  baisse le doigt progressivement en affichant un petit sourire mauvais à la fin ; la mère réagit à la
  toute fin par une légère inclinaison ; Sundiata regarde la matrone → se lève (genoux à terre) → regarde
  à nouveau la matrone. Rien n'est figé, l'agent a mal lu les frames extraites.
- **Ombres portées cohérentes avec le mouvement — point technique fort, non détecté par l'agent** :
  l'ombre de Sundiata au sol suit son changement de posture (courbé → mains levées/genoux) en temps réel ;
  l'ombre du villageois qui se déplace suit également son déplacement. Comportement physique crédible,
  à retenir comme un point fort de H3 pour cette scène.
- **Villageois nommé (vieil homme au châle)** : avance depuis l'arrière-plan, se met les mains sur le
  visage en réaction choquée, pendant que les autres villageois restent immobiles — confirmé comme
  fonctionnel et bien exécuté (2e validation consécutive du principe "nommer précisément qui bouge").
- **Nuages** : mouvement réel mais très lent ("quasi stop-motion") — pas un échec, un mouvement trop
  subtil à accélérer si besoin, pas absent comme rapporté.
- **Aucune déformation ni morphing sur les 15s** — Aziz note l'hypothèse que ça tient au fait que la
  caméra reste statique (pas de cut, pas de mouvement) ; à vérifier si ça tient sur un test avec
  mouvement de caméra (cf section orbite ci-dessous).

**Leçon méthode pour la mémoire** : l'auto-review d'un agent sur des frames extraites peut sous-évaluer
un mouvement réel si l'échantillonnage de frames est trop espacé ou si la trame narrative (qui est qui,
quelle réaction appartient à quel personnage) n'est pas vérifiée contre le script/l'histoire réelle
AVANT de juger le rendu. Toujours confronter au script narratif d'origine, pas seulement au rendu brut.

**Verdict global (révisé)** : test concluant, pas juste "progrès partiel" — **le diagnostic "rythme
compressé puis gelé" du premier passage est INVALIDÉ par la correction Aziz ci-dessus**, à ne pas
reprendre comme acquis (cf le test orbite plus bas, qui cite ce diagnostic par analogie — sa propre
observation de rythme reste à évaluer indépendamment, pas comme une confirmation d'un biais déjà
"documenté" ici). Le figurant nommé fonctionne (2e validation consécutive de la règle "nommer
précisément"). Les 2 éléments d'ambiance pure (nuages, feuillage) sans porteur de mouvement de
personnage n'ont montré aucun effet malgré une clause dédiée explicite — **hypothèse à tester** : H3
semble mieux répondre aux clauses attachées à un sujet/beat temporel qu'à une clause "continue"
générique détachée du séquençage par tranche.

**Piste à creuser (prochain test)** : pour les nuages/feuillage, essayer une clause attachée à
CHAQUE tranche temporelle (répéter "clouds drift slightly, leaves tremble" dans les 6 beats du
garçon) plutôt qu'une section séparée — cohérent avec l'hypothèse ci-dessus.

**Coût réel** : `get_usage_report` cumulé mensuel passé de $2.06 à $3.29 après ce clip → **~$1.23**
pour ce seul clip 15s (vs $0.04-0.17 pour les clips 8s courts précédents — cohérent, ~2x la durée
en frames et un ratio de coût supérieur à 2x, à surveiller si les clips 15s se multiplient).

**Fichiers** : prompt + clip 480×864/15.08s + 12 frames d'auto-review dans scratchpad session (non
conservés dans le repo) ; clip uploadé Vercel Blob (URL temporaire).

### ⭐⭐⭐ Test mouvement de caméra orbital (Sonjata scene4 "barre de fer", 2026-08-08) — PREMIER test caméra en mouvement sur ce projet, verdict MITIGÉ

Tous les tests H3 précédents sur ce projet utilisaient une **caméra statique**. Premier test avec un
mouvement de caméra actif (orbite ~180°), sur une scène différente (`scene4-final-keepandduck.mp4`,
clip déjà publié — le garçon force sur une barre de fer qui se déforme en arc pendant qu'il se relève,
foule autour). Image de référence : frame extraite à t=6s du clip publié (garçon agenouillé, barre
quasi droite, caméra encore de face) — **vérifiée visuellement avant usage** (comparaison de plusieurs
frames t=3 à t=11 du clip original a montré que le pivot caméra réel du clip publié était déjà bien
engagé dès t=7, soit ~1s après la frame de référence choisie — la fenêtre pour reproduire l'intégralité
de l'orbite était donc plus resserrée que prévu au départ).

**Prompt** : même discipline validée cette session (séquençage temporel strict par tranches de 2s,
clause négative répétée contre toute hallucination d'objet/personnage, décor verrouillé explicitement)
+ description explicite d'une orbite caméra continue ~180° synchronisée avec (1) la déformation
progressive de la barre droite→arc complet et (2) le redressement du garçon agenouillé→debout. 606
mots (plus dense que le style minimal "voxelplot" documenté dans la doctrine Seedance storyboard, mais
cohérent avec la discipline H3 validée le matin même sur ce projet — pas testé en A/B contre une
version minimaliste sur ce cas précis).

**Exécution** : `run_template(video_minimax_h3_r2v)`, durée demandée 10s, override
`{"136":{"width":480,"height":864}}` (fix portrait déjà validé). **Durée réelle obtenue : 10.125s
(243 frames, 24fps)** — différent du "10→8.0s" documenté précédemment dans ce fichier pour un autre
test ; l'arrondi H3 ne semble donc pas strictement déterministe pour une même valeur d'input d'un test
à l'autre, ou dépend d'un facteur non identifié (contenu du prompt ? seed ?) — **à ne pas considérer
comme une table de correspondance fixe**, toujours vérifier `ffprobe` après coup plutôt que d'assumer.

**Vérification frame-par-frame (11 frames, t=0 à 10s, pas de 1s)** :
- ✅ **(a) Mouvement de caméra orbital réel et net** — confirmé, pas un zoom ni un pan. Signal le
  plus fort : le garçon lui-même passe de vu-de-face (t=0) à vu-de-dos (t=3-7) puis retour vu-de-face
  (t=8-10), avec l'arrière-plan (huttes, baobab) qui apparaît/disparaît/change de position de façon
  cohérente avec une vraie rotation autour du sujet. **Premier signal positif fort sur ce point** —
  H3 comprend et exécute une instruction de mouvement de caméra orbital, pas seulement un sujet qui
  bouge devant une caméra fixe.
- ⚠️ **Rythme de l'orbite non uniforme** — contrairement au séquençage demandé (progression linéaire
  sur 10s), la rotation semble déjà bien avancée dès t=3s (~90-180° parcourus en 30% du temps), puis
  la composition se stabilise/fige quasiment entre t=8 et t=10 (dernières 20% du temps, quasi aucun
  changement visible). **Observation propre à ce test, sur ses propres frames** — ⚠️ ne PAS la
  présenter comme une 2e confirmation du "biais résout-vite-puis-fige" du test 15s précédent : ce
  diagnostic-là a été en partie invalidé par Aziz (cf correction plus haut dans ce fichier, le
  mouvement du garçon/de la matrone y était en fait une chorégraphie enchaînée, pas un gel). Les deux
  observations sont indépendantes ; celle-ci sur l'orbite tient sur ses propres mesures de timing
  (90-180° en 30% du temps, stable sur les 20% finaux) et reste valable en tant que telle.
- ✅ **(b) Déformation de la barre cohérente et progressive** — droite (t=0-1) → torsion (t=2-4) →
  courbe nette (t=5-6) → arc quasi complet (t=7) → arc complet (t=8-10). Aucun morphing brutal ni
  téléportation de forme observée.
- ⚠️ **(c) Garçon agenouillé→debout crédible mais très compressé** — reste accroupi/courbé de t=0 à
  t=7 (70% du clip), puis se redresse et se retrouve debout bras levés entre t=7 et t=8 (moins d'1s).
  Transition visuellement propre (pas de morphing) mais timing très éloigné du séquençage demandé
  (qui prévoyait un redressement progressif dès 2-4s).
- ✅ **(d) Décor cohérent pendant la rotation** — pas de téléportation illogique, apparitions/
  disparitions des huttes et du baobab cohérentes avec un mouvement de caméra. Point à noter : la
  disposition exacte des huttes varie assez fortement d'une frame à l'autre (plus qu'une orbite
  stricte autour d'un point fixe ne le produirait dans un village réel) — hypothèse que le modèle
  réinvente partiellement la géométrie du décor plutôt que de maintenir un espace 3D rigoureux,
  sans que ça choque à l'œil en lecture normale.
- ✅ **(e) Aucune hallucination d'objet ni morphing facial grave** sur l'échantillon de 11 frames.
  Seul point mineur : la transition dos→face du garçon entre t=7 et t=8 est un peu abrupte, presque
  perçue comme un cut caché dans un mouvement par ailleurs continu.

**Verdict : MITIGÉ, pas un échec — premier signal important et globalement positif sur la capacité
orbite, mais avec le même défaut de rythme "compression puis hold" déjà vu sur l'action de personnage,
désormais confirmé sur un mouvement de caméra aussi.** À l'inverse de l'hypothèse d'Aziz notée dans le
test 15s précédent ("le fait que la caméra reste statique explique l'absence totale de morphing sur
15s") — ici, MALGRÉ un mouvement de caméra actif, aucun morphing grave n'a été détecté non plus. Cette
hypothèse spécifique (caméra statique = condition nécessaire à l'absence de morphing) n'est donc PAS
confirmée par ce test — au contraire, elle est plutôt infirmée sur l'échantillon observé (à confirmer
sur d'autres tests caméra mobile avant de trancher définitivement).

**Piste à creuser (prochain test)** : reprendre la contrainte anti-compression déjà notée dans le test
15s précédent ("do NOT complete the orbit before Xs", "the camera must still be mid-rotation at
Xs") appliquée cette fois au mouvement de caméra lui-même, pas seulement à la pose du personnage —
hypothèse que le biais "résout vite puis fige" est un comportement général du modèle indépendant du
type de mouvement (personnage OU caméra), donc la même parade devrait s'appliquer aux deux.

**Coût** : bucket horaire `get_usage_report` correspondant à ce job = **$1.227432** (cohérent avec le
coût du clip 15s précédent à $1.23, logique vu la durée proche 10.1s vs 15.08s). Cumul mensuel total
après ce test : **$3.285296**. ⚠️ **`get_usage_report` ne renvoie que des dollars, pas des heures/
minutes GPU directement** — aucune conversion fiable en minutes GPU n'a pu être produite à partir de
cet outil pour ce test (le taux 0.39 crédit/seconde documenté plus haut permettrait de calculer un
temps GPU si le taux $/crédit était connu avec certitude, mais ce taux n'a pas été reconfirmé cette
session — ne pas extrapoler une conversion sans le vérifier).

**Fichiers** : prompt + clip 480×864/10.125s + 11 frames d'auto-review dans scratchpad session (non
conservés dans le repo) ; clip uploadé Vercel Blob :
`https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/clip-orbit-BjMafiqK5qtwSN8JqQYVBkkW0TR57B.mp4`
(URL temporaire, re-télécharger si le plan doit être réutilisé en prod). Image de référence source :
frame t=6s de `public/assets/sonjata-papercraft/clips/scene4-final-keepandduck.mp4`.

### ⭐⭐⭐ Test corrigé — causalité barre + dot-eyes + sans audio (2026-08-08) — 2/3 défauts RÉSOLUS, 1 NOUVEAU défaut critique découvert (bandeau noir)

Suite directe du test orbite ci-dessus. Aziz avait identifié 3 défauts précis sur le clip précédent
(barre qui se tord "toute seule" sans main visible dessus au moment du pop, villageois en "googly
eyes" au lieu de dot-eyes, audio généré non désiré). Objectif : corriger les 3 AVANT tout nouveau
test créatif.

**Défaut 1 — causalité barre/mains** : ✅ **RÉSOLU**. Root cause confirmée visuellement avant fix :
sur le clip précédent, à t=2.0s la barre était déjà tordue en arc quasi complet alors qu'aucune main
n'était visible dessus (garçon juste appuyé torse contre la barre plus bas). Fix : clause CAUSALITY
dédiée en tête de prompt ("the bar bends ONLY as a direct, visible, physically caused result of the
boy's own two hands... hands STAY VISIBLY IN CONTACT... NEVER a bend that appears before the hands
are shown gripping") + rappel dans chaque tranche temporelle ("hands never leaving the bar", "hands
still locked on the bar") + rappel dans la clause négative finale. Résultat vérifié sur 14 frames
réparties (t=0.5 à 14.9s) : mains visiblement en contact avec la barre à chaque frame inspectée où
le grip est pertinent, déformation progressive et crédible (droite à t=0.5-1.5s → premier arc léger
t=2.5-3.6s → arc net t=7.5-8.5s → arc complet overhead t=12-14.9s), aucun saut de forme sans main
visible. **La formule causale explicite (chaîne de contact permanent + interdiction de saut hors-champ
répétée 3x dans le prompt) fonctionne** — à réutiliser comme template pour toute déformation d'objet
causée par un personnage sur ce projet.

**Défaut 2 — googly eyes** : ✅ **RÉSOLU en 2 temps**. (1) Diagnostic confirmé sur l'image de
référence elle-même (pas seulement le prompt) : `ref-t6.png` (frame source du test précédent)
montrait bien des villageois avec grands yeux blancs ovales + pupille noire ronde + sourcils — pas
des dot-eyes. Le garçon au premier plan n'était PAS concerné (yeux fermés/plissés par l'effort).
(2) Edit chirurgical Gemini 3.1 Flash Image AVANT le R2V (formule R-EDIT-CHIRURGICAL-PRESERVE-FIRST :
CHANGE ONLY les yeux des villageois de fond → ronds noirs pleins, PRESERVE EXACTLY tout le reste dont
le garçon, temperature=0.5). Résultat vérifié par crop 2x zoomé avant usage : yeux bien devenus des
ronds noirs pleins sans sclère blanche visible, reste de l'image intact. Image corrigée réutilisée
comme référence R2V. (3) Clause EYES dédiée dans le prompt en plus du fix image ("ALL characters keep
simple solid black dot-eyes... NEVER googly eyes... shock expressed through body language only").
Résultat sur le clip généré : dot-eyes noirs pleins maintenus sur toutes les frames inspectées,
réactions de choc bien portées par les mains-à-la-bouche/posture, pas par les yeux. **Double
correction (image + prompt) confirmée nécessaire et suffisante** — corriger seulement le prompt sans
corriger l'image source aurait probablement laissé les villageois déjà mal dessinés en base.

**Défaut 3 — audio généré non désiré** : traité en aval, pas de paramètre natif trouvé pour désactiver
l'audio dans le template `video_minimax_h3_r2v` (aucun des node IDs connus — 132/136/137/138/139 —
n'expose un flag audio ; pas creusé plus loin côté JSON du workflow faute de nécessité, `ffmpeg -an`
suffit). Méthode utilisée : `ffmpeg -c:v copy -an` sur le clip téléchargé, piste AAC confirmée
retirée par `ffprobe` après coup (1 seul stream video restant). Fichier final sans audio :
`clip-orbit-v2-noaudio.mp4` (scratchpad, non uploadé — voir défaut ci-dessous).

**⚠️ Précision 2026-08-11/12 (test dialogue supermarché 2-personnages)** : confirmé que ce n'est PAS
seulement de la musique parasite ajoutée à côté du dialogue — H3 mixe voix parlée (via `<d>[Lang]...
</d>`) ET musique/son ambiant dans **UNE SEULE piste audio stéréo** (`ffprobe` : 1 stream AAC unique,
pas de pistes séparées). Donc `ffmpeg -an` retire TOUT (voix comprise), pas juste la musique — il n'y
a pas de moyen simple d'isoler/garder la voix générée en coupant seulement la musique (demanderait une
vraie séparation de source audio, non tentée, hors scope).

**Verdict Aziz sur ce même test (2026-08-12) : l'audio généré (voix + musique) était BON sur les 2
clips de dialogue** — à ne pas traiter comme un défaut systématique à éliminer. **Décision retenue :
jugement au cas par cas, pas de règle automatique.** Écouter chaque clip généré : si la voix/musique
convient, la garder telle quelle (gain de temps, pas de resonorisation nécessaire) ; si elle ne
convient pas ou qu'un clip 100% muet est voulu pour intégrer notre propre pipeline (ElevenLabs +
`INDEX-MUSIQUES.md`), le signaler explicitement et couper avec `ffmpeg -an`. Ne jamais assumer par
défaut qu'il faut couper — c'est une option parmi d'autres, pas la règle.

### ⚠️ Écran noir en TOUTE FIN de clip — 2e occurrence, cette fois sur R2V simple 1-personnage (2026-08-12)

Test du pipeline complet "décor SVG maison → composition Gemini (perso `Roles.tsx`, agriculteur
chapeau paille + gilet vert) → animation H3" (marche vers un bateau, village de pêcheurs, 5s
demandées). Résultat : **les ~4 dernières frames du clip (864×480, 5.17s obtenus) tombent en écran
NOIR TOTAL** (luminosité moyenne mesurée = 0.0/255, confirmé par script Python sur les 124 frames
extraites) — malgré une clause anti-écran-noir explicite dans le prompt ("No black screen at any
point... must remain visible for the ENTIRE duration"). Le corps du clip (frames 1 à ~120, 97% de la
durée) est propre : marche crédible, décor stable, personnage fidèle, aucune dérive.

**Différence avec le précédent défaut similaire** (§ "NOUVEAU DÉFAUT CRITIQUE — bandeau noir
progressif" plus bas, 2026-08-08) : celui-là étalait un triangle noir progressif sur le TIERS
supérieur du cadre pendant 2/3 du clip (durée 15s, ratio forcé 480×864 non natif) ; celui-ci est un
CUT SEC total sur les toutes dernières frames seulement (durée 5s, ratio 864×480 natif). Symptômes
distincts (progressif+partiel vs cut+total, positions différentes dans la timeline) — **pas assez de
données pour conclure à une cause commune**, mais ça confirme qu'un écran noir en fin/pendant un clip
H3 R2V n'est pas un accident isolé, à surveiller systématiquement (vérification exhaustive de TOUTES
les frames, pas un échantillonnage, comme fait ici via mesure de luminosité automatisée).

**Pas encore testé/à creuser si reproduit** : réduire la durée demandée (le cut arrive tout en fin —
est-ce lié à un seuil de durée précis ?), retirer le HOLD final du prompt (le clip demandait un arrêt
net sur la dernière demi-seconde — coïncidence avec le crash ou cause possible ?), tester si un ratio
16:9 natif (pas d'override width/height) évite le défaut.

**⚠️ NOUVEAU DÉFAUT CRITIQUE découvert, non anticipé dans le brief — bandeau noir progressif** :
à partir de t≈3.7s, un triangle noir opaque apparaît en coin supérieur gauche du cadre et grandit en
fondu jusqu'à couvrir environ le tiers supérieur de l'image (zone ciel/cimes des arbres) vers t=5s,
puis **reste stable à cette taille pour tout le reste du clip jusqu'à t=15s** (~10 des 15 secondes,
soit les 2/3 du clip, confirmé par planche-contact sur 10 frames t=5 à t=15). Comportement : fondu
progressif (pas un glitch d'1 frame), zone stable une fois établie (pas de morphing ni de flicker),
mais **rend le clip non livrable tel quel** — masque une portion significative du cadre pendant la
majorité du clip. Hypothèse non vérifiée : lié à l'override `136.width/height` (480×864, ratio non
natif au template) — les warnings `override_not_embedded` sur ce node à chaque run (déjà observés sur
2 tests consécutifs, celui-ci et le précédent) indiquent que l'override s'applique bien à l'exécution
mais n'est pas un chemin "propre" dans le graphe ; possible que H3 gère mal les bords du cadre sur un
ratio forcé plutôt que nativement supporté, en particulier pendant un mouvement de caméra orbital qui
sollicite tout le cadre (le test précédent, orbite aussi, n'avait pas ce défaut documenté — donc pas
strictement systématique, à confirmer si récurrent sur un 3e test). **Autre hypothèse non vérifiée** :
le modèle interprète une portion de l'orbite comme un point de vue "ciel nocturne" incohérent avec la
palette sepia/jour demandée — mais le bord du bandeau est net et géométrique (triangle/bande), pas une
texture de ciel, ce qui penche plutôt vers un artefact de cadre que vers une hallucination de contenu.
**Piste prochain test** : essayer sans l'override 136 (accepter le ratio natif du template puis
recadrer en post) pour isoler si le bandeau noir est bien lié à cet override, ou tester avec une durée
plus courte (8-10s) pour voir si le défaut apparaît toujours à un timing proportionnel similaire
(~25-30% du clip) ou à un timing absolu fixe (~3.7s peu importe la durée totale).

**Verdict global** : 2/3 défauts du brief résolus avec succès et méthode réutilisable documentée
ci-dessus (causalité + dot-eyes). Défaut 3 (audio) traité en post-traitement faute d'option native.
Mais **clip NON livré à Aziz comme asset final** — le nouveau défaut du bandeau noir est apparu
pendant la vérification frame-par-frame obligatoire et rend ce clip précis inexploitable, malgré la
réussite des 2 corrections demandées. Ne pas répéter cette configuration (même ratio + même durée +
même type de mouvement orbite) sans d'abord tester la piste de la ligne ci-dessus.

**Coût** : cumul mensuel `get_usage_report` = **$3.285296** au moment de la vérification (delta vs
$3.29 déjà enregistré en fin de session précédente non isolable proprement — l'outil ne permet pas de
distinguer le coût unitaire de CE job dans l'agrégat journalier consulté ; ne pas confabuler un
chiffre précis pour ce clip seul, contrairement au test précédent où le bucket horaire avait permis
un chiffre net).

**Fichiers** : `ref-t6-doteyes-fixed.png` (image de référence corrigée), `prompt-v2.txt` (prompt
complet 6696 caractères), `clip-orbit-v2.mp4` (avec audio) / `clip-orbit-v2-noaudio.mp4` (sans audio),
14 frames de vérification (`check-v2/`) + planche-contact bandeau noir (`contact-sheet-5to15.jpg`) —
tous dans scratchpad session, non conservés dans le repo, non uploadés Vercel Blob (clip non livrable
en l'état).

### ⭐ Veille communautaire — 4 transcripts YouTube H3 analysés (2026-08-09)

Analyse de 4 vidéos (transcripts auto-captions, pas de frames) : "MiniMax H3 is the new FREE video AI
king", "Minimax H3 is a Local AI Video BEAST", "How To Use MiniMax H3 in ComfyUI", "How to Make MiniMax
H3 30% Faster Than LTX 2.3". Une 5e ("Matrix Fight Scene RTX 5090") sans sous-titres, pure démo, écartée.

**Confirmé par la communauté** (renforce nos observations, pas besoin de retester) :
- **H3 est littéral / dérive vers son prior appris** sur un détail atypique de l'image de référence,
  même quand le prompt demande explicitement de le préserver (test communautaire : créature stylisée
  "tigre ailé" → dérive vers tigre normal en <2s, ne garde que les ailes). Généralise notre observation
  "reproduit fidèlement les défauts" en "ne préserve pas non plus fidèlement les atypies stylisées
  demandées explicitement" — soigner l'image de référence reste le vrai levier, pas le prompt seul.
- **Multi-référence (2e image, type Seedance Omni)** massivement confirmé et utilisé par la
  communauté : jusqu'à 3 personnages simultanés, character sheet + décor, vidéo de référence, ET audio
  de référence combinés dans un seul run — "very much the Seedance vibe".
- **Palier de résolution 480p/720p/1080p** confirmé comme standard communautaire, 720p = sweet spot.
- **Durée max 15s, 24fps natif** confirmé.
- **Workflow recommandé par 2 vidéos indépendantes : générer à 720p puis upscaler en post** (LTX 2.3
  "video enhancer", upscale+enhance simultané) plutôt que générer directement en 1080p — écart de
  qualité/mouvement jugé minime, gain de temps important. **À tester sur notre pipeline** si un clip
  1080p natif (~19min) devient un goulot d'étranglement récurrent.

**Nouveau, actionnable** :
- **Limite de références multi-input : 9 à 12 médias combinés** (image+vidéo+audio) selon la source —
  largement suffisant pour nos usages actuels (2 images). Règle confirmée : référencer dans le prompt
  dans le MÊME ORDRE que la connexion des nodes (`<Picture 1>`, `<Picture 2>`...), même logique
  séparée pour vidéos et audio de référence.
- **Syntaxe timestamps confirmée** : format `"0 to 2 second, shot one, 2 to 4 second, shot two"` —
  cohérent avec notre séquençage par tranches déjà pratiqué, rien à changer.
- **Piste créative transférable — reveal progressif d'une image-cible** : uploader une image finale
  (ex. graphique, carte, UI) et prompter un cadre vide au départ, éléments qui apparaissent un par un
  jusqu'à recomposer l'image complète. Directement applicable à notre registre infographie/carte
  éditoriale (ex. une carte qui se construit territoire par territoire, un chiffre-clé qui se compose
  élément par élément).
- **Storyboard multi-panneaux — piste neuve identifiée, voir section dédiée plus haut** (N images
  séparées par node plutôt qu'1 image composite grille — pas encore testé chez nous).
- **Si retour au local ComfyUI un jour** (actuellement non prioritaire, Comfy Cloud suffit) : 4 nodes
  d'accélération (`LightX2V MiniMax H3 Turbo` LoRA, `Patch Sage Attention KJ`, `MiniMax H3 Sigma
  Shift`, `Spectrum Apply MiniMax H3`) + `Patch SoulAt` (kernels Triton Nvidia), 10 steps recommandés
  → vitesse comparable LTX 2.3. Nécessite ComfyUI ≥0.30 en install séparée (risque conflits). Turbo
  LoRA officiel MiniMax en cours d'entraînement, déjà 20→8 steps utilisable en early access.

**Non confirmé ni infirmé par la communauté** (silence, pas une preuve) : notre biais "compression puis
hold" (rythme qui se résout vite puis fige) — aucune des 4 vidéos ne le mentionne ni ne semble le
montrer, malgré des démos avec mouvements de caméra complexes. Signal faible seulement, à garder en tête
sans le considérer réfuté.

**Écarté (hors sujet pour nous)** : détails légaux/licence, comparatifs marché LTX/Flux/WAN non liés à
un paramètre H3 actionnable, installeurs locaux Windows/RunPod (on reste sur Comfy Cloud managé),
variantes non censurées.

**Ajout 2026-08-09 (2 vidéos de plus, dont la vidéo storyboard ci-dessus)** :
- **`reference_strength` = 0.7 recommandé** sur le workflow R2V officiel multi-images (8 images testées
  par un créateur : 1 sujet + accessoires séparés) — paramètre qu'on n'avait pas identifié/documenté
  chez nous. **À chercher sur nos templates Comfy Cloud** (`video_minimax_h3_r2v`) si un node/widget
  équivalent existe — potentiellement utile pour calibrer la fidélité aux images de référence vs liberté
  du modèle, en particulier sur les cas d'ombre parasite/défaut d'image déjà documentés plus haut.
- **Sampler `Res Multistep` > `Euler simple` pour la consistance du visage** sur plusieurs frames (le
  reste — accessoires, vêtements — reste stable avec les deux) ; confirme/précise que le choix de
  sampler a un impact spécifiquement sur la stabilité faciale, pas juste la vitesse/qualité générale.
- **Easy Cache déconseillé explicitement** par ce créateur ("terrible results" dans ses tests) malgré
  sa présence dans le workflow par défaut — à garder en tête si jamais on retrouve un node équivalent
  sur nos templates Comfy Cloud, ne pas l'activer par défaut sans re-tester.
- **"Sol/Soul Attention"** (patch d'attention, distinct de Sage Attention) : ~-50% de temps de rendu
  mesuré (34min vs 60-65min pour un clip 8s/1080p sur Runway Hub) contre une perte de netteté "légère
  mais visible" sur le visage/détails fins. Compromis vitesse/qualitéà garder en tête seulement si on
  repasse un jour par un ComfyUI local — non vérifié si un équivalent existe sur nos templates Comfy
  Cloud actuels.

### ⭐⭐⭐ VÉRIFICATION DIRECTE DU CATALOGUE COMFY CLOUD (2026-08-09) — ce qui existe réellement, pas ce que les vidéos décrivent

Après la veille vidéo (sections ci-dessus, majoritairement ComfyUI **local**), vérification via
`search_templates`/`search_nodes`/`get_node` de ce qui est VRAIMENT disponible sur Comfy Cloud pour H3.
Plusieurs découvertes changent notre plan de test pour le storyboard.

**⭐⭐⭐ Template officiel FLF2V H3 existe déjà — `api_minimax_h3_flf2v`** (non identifié avant cette
vérification, jamais utilisé chez nous) : 2 images en input (`first_frame`, `last_frame` sur le node
`MinimaxHailuo03FirstLastFrameNode`, catégorie `partner/video/MiniMax`), génère une transition fluide
entre les deux. **C'est structurellement identique au mécanisme interne du "Storyboard Manager" custom
de la vidéo GeekatplayStudio** (chaque panel = un segment R2V dont l'image de fin sert de first-frame
au segment suivant) — sauf que chez nous c'est un template OFFICIEL prêt à l'emploi, pas un workflow
tiers à récupérer sur GitHub et adapter. **Piste de test la plus directe pour le storyboard multi-plans** :
chaîner plusieurs appels `run_template(api_minimax_h3_flf2v)` — plan N se termine sur une frame,
cette frame devient `first_frame` du plan N+1 (avec son propre `last_frame` visé) — plutôt que de
chercher une solution "tout-en-un" via `video_minimax_h3_r2v`. Note : `api_minimax_h3_flf2v` est un
template `api_` (passe par l'API MiniMax hébergée, PAS open-weight gratuit comme `video_minimax_h3_*`)
— vérifier le coût crédits avec `estimate_credits` avant de tester à l'échelle.

**⭐⭐ Règles de prompting FLF2V — vérifiées sur le prompt-exemple officiel du template (2026-08-09)** :
confirmé que ce N'EST PAS un simple "donner 2 images et laisser le modèle inventer" — même discipline
que R2V. Prompt-exemple officiel (`api_minimax_h3_flf2v`, scène ange guerrier) :

> "Use Image 1 as the first frame and Image 2 as the last frame. One continuous cinematic fantasy shot.
> The angel warrior finishes fighting demons in the smoke, then turns and points her spear at the
> remaining enemies below. End in a triumphant low-angle hero pose. Same character, same style, smooth
> motion, no cuts, no text."

Décompose en 4 éléments, tous déjà dans notre pratique R2V habituelle :
1. **Référence explicite aux 2 images** ("Image 1 as the first frame and Image 2 as the last frame")
   — équivalent de nos `<Picture 1>`/`<Picture 2>`.
2. **Décrire l'ACTION entre les deux frames**, pas les images elles-mêmes ("finishes fighting... then
   turns and points... End in a triumphant pose") — narration du mouvement, pas description statique.
3. **Clause de continuité** ("Same character, same style, smooth motion") — équivalent décor verrouillé.
4. **Clause négative** ("no cuts, no text") — notre pratique habituelle de clause négative répétée.

**Conclusion actionnable** : pour notre usage (last-frame générée séparément, ex. via Gemini 3.1 Flash,
puis chaînage FLF2V), garder notre discipline de prompt habituelle (séquençage temporel par tranches,
clause négative répétée, décor verrouillé) — le node FLF2V n'a pas de champ dédié pour un séquençage
par tranches (contrairement à R2V/T2V où on utilise `"0-2s: ... 2-4s: ..."` dans le texte libre), tout
passe par le même champ prompt texte libre. Pas de paramètre `reference_strength` ni équivalent sur ce
node non plus (2 champs seulement : `first_frame`, `last_frame` optionnel, prompt, resolution, duration
5-15s) — la fidélité aux 2 images est déterminée uniquement par la qualité de la description de l'action
dans le prompt, pas par un curseur numérique.

### ⭐⭐⭐ TEST RÉEL 1 — Sonjata scene2→plan2 via `api_minimax_h3_flf2v` (2026-08-10) — la `last_frame` prime sur le texte du prompt en cas de conflit

Premier vrai test du chaînage first/last-frame sur un cas de production. `first_frame` = dernière frame
du clip `prototype-2-15s-multistrate-vivant.mp4` (garçon agenouillé sur un genou, regard vers la mère,
bras de la mère abaissé — cf section prototypes plus haut). `last_frame` générée par edit i2i Gemini
3.1 Flash (`scripts/tools/gemini-i2i.py`) : garçon debout. **2 tentatives i2i pour obtenir un garçon
tourné à 90° vers la foule ont toutes deux échoué** — Gemini a un biais fort à préserver le regard
mère-fils de l'image source malgré des instructions de rotation très explicites et répétées 2x avec
formulations différentes (métaphore "horloge 12h→3h" en 2e tentative, toujours sans effet). **Décision
Aziz** : ne pas insister sur la rotation dans l'IMAGE — la garder simple (debout, toujours face à la
mère) et déléguer la rotation au TEXTE du prompt vidéo à la place ("il se lève, se détourne, regarde
les villageois").

**Résultat H3 (10s demandé → 10.125s obtenu, 768×1376 vertical confirmé, prompt_id `ca1b3b94-3998-
4d1e-929b-2f9cc272c5ba`, coût réel 272 crédits pour 10s/768P — pas 136, l'estimation par défaut
`estimate_credits` suppose 5s)** : vérifié sur les 11 frames (0 à 10s, chacune à pleine résolution, pas
une planche-contact miniature qui trompe l'œil — leçon déjà documentée ailleurs, reconfirmée ici) :
- 0-1s agenouillé (position `first_frame` respectée) → 2-5s se lève, face à la mère → **6-8s dos
  tourné, fait bien face à la foule (la rotation demandée dans le texte a été exécutée)** → **9-10s
  RE-tourné face à la mère**, soit la pose exacte de la `last_frame` fournie.
- **Aucun objet halluciné, aucun morphing, décor et personnages secondaires parfaitement stables sur
  tout le clip** — le mécanisme first/last-frame est solide techniquement.

**Découverte comportementale nouvelle, pas documentée avant ce test** : quand le TEXTE du prompt décrit
une action finale ("end facing the crowd, no longer looking at his mother") qui CONTREDIT la pose de
l'image `last_frame` fournie (ici : debout face à la mère, faute d'avoir pu générer une image tournée),
**H3 a exécuté les deux dans l'ordre — la rotation demandée par le texte EN MILIEU de clip, puis un
retour à la pose de la `last_frame` en toute fin** — plutôt que d'ignorer l'image ou d'ignorer le texte.
**La `last_frame` semble donc avoir un poids plus fort que le texte pour déterminer la pose de la
TOUTE FIN du clip**, même quand le texte dit explicitement le contraire. Cohérent avec le principe déjà
documenté "H3 est littéral" (section ombre de charsheet plus haut), mais c'est la première fois qu'on
l'observe sur un CONFLIT direct texte vs image plutôt que sur une image qui n'est simplement pas
corrigée.

**Implication actionnable directe** : sur FLF2V, si la pose finale exacte compte pour la suite du
montage (raccord avec le plan suivant), **soigner l'image `last_frame` elle-même est plus fiable que
d'essayer de la corriger via le texte du prompt** — ne pas compter sur le texte pour "réparer" une
image imparfaite comme on le fait sur R2V. Si l'image de la pose voulue est difficile à générer (cf
échec Gemini rotation ci-dessus), il vaut mieux persister sur l'image (3e tentative i2i, angle
différent, ou génération from scratch plutôt qu'edit) qu'accepter une image simplifiée et compter sur
le texte pour combler l'écart.

**Verdict global** : test concluant sur le plan technique (mécanisme FLF2V fiable, ratio/durée/stabilité
tous corrects), mais **pas concluant sur l'objectif narratif initial** (pose finale "tourné vers le
village" pas obtenue en dernière frame) — à cause d'un choix amont (image simplifiée) assumé
consciemment, pas d'un défaut du modèle. Reste à tester : la même chaîne avec une `last_frame` qui
montre vraiment la pose finale voulue (nécessite de résoudre d'abord le blocage Gemini sur la rotation,
ou de générer l'image autrement — from scratch plutôt qu'edit, ou prise de vue/角度 différente dès le
prompt initial plutôt qu'un edit a posteriori).

**Confirmation qu'un usage storyboard multi-panneaux est un cas d'usage officiellement anticipé** :
le template `api_minimax_h3_r2v` (Reference-to-Video, variante API) a pour image d'exemple officielle
`9panel_storyboard_golden_hour_clay_court.png` — MiniMax/Comfy présente eux-mêmes un storyboard 9
panneaux comme cas d'usage typique du node `MinimaxHailuo03ReferenceNode`
(`model.reference_images.image_1` à `image_9`, référencés dans le prompt comme "Image 1".."Image 9"
dans l'ordre de connexion — même logique que `<Picture N>` déjà documentée pour le node core). Ça
va dans le sens d'une image storyboard multi-panneaux **envoyée en une fois comme SEULE référence
"Image 1"** OU en 9 images séparées width chacune un panel dédié — **l'exemple officiel ne tranche pas
lequel des deux usages est visé**, mais confirme que le cas d'usage storyboard est pris en charge
d'une manière ou d'une autre par ce node. À tester directement plutôt que de deviner.

**Existe aussi côté Seedance (déjà su, confirmé)** : `template_seedance2_storyboard_to_video` — génère
un storyboard 8-panneaux depuis un prompt texte PUIS l'utilise comme base Seedance 2.0. Structurellement
différent (le storyboard est généré par le template lui-même, pas fourni par nous) — pas directement
adaptable à H3 tel quel, mais confirme que Comfy Cloud a un vrai précédent de pipeline
storyboard-vers-vidéo pour un autre modèle, à consulter (`get_template`) si on veut s'en inspirer pour
construire un équivalent H3 maison.

**2 versions du node reference-to-video existent, à ne pas confondre** :
- `MiniMaxH3ReferenceToVideo` (id 136 dans notre template `video_minimax_h3_r2v`, catégorie
  `model/conditioning/minimax`, pack `core`) — **celui qu'on utilise déjà**, gratuit/open-weight,
  paramètre `ref_image_size` (`match` vs `max` — `max` = jusqu'à plusieurs fois plus lent, meilleure
  fidélité d'identité, upscale au pipeline de référence 2048px côté court) au lieu d'un
  `reference_strength` (ce paramètre de vid8, sur workflow local différent, **n'existe pas** sur notre
  node — à ne pas chercher).
- `MinimaxHailuo03ReferenceNode` (catégorie `partner/video/MiniMax`, `api_node: true`) — version API
  payante utilisée par les templates `api_minimax_h3_*`, jusqu'à 9 images + 3 vidéos + 3 audios,
  syntaxe prompt "Image 1"/"Video 1"/"Audio 1" (pas `<Picture N>`).

**Confirmation positive vid7 (Basic Guider = pas de CFG)** : notre template `video_minimax_h3_r2v`
utilise DÉJÀ `BasicGuider` (pas `CFGGuider`) — exactement le setup optimisé mémoire que vid7
recommandait de construire soi-même en local. On a ça gratuitement par défaut sur Comfy Cloud, rien à
changer. Confirme qu'il n'y a pas de negative prompt disponible sur ce template (cohérent avec ce
qu'on pratique déjà).

**Sage Attention et Easy Cache existent bien dans le catalogue Comfy Cloud** (`PathchSageAttentionKJ`,
pack `ComfyUI-KJNodes` ; `EasyCache`, pack `core`) mais **ne sont PAS câblés par défaut** dans
`video_minimax_h3_r2v` — à ajouter soi-même via `submit_workflow` (édition structurelle du graphe, pas
un simple `input_overrides`) si on veut tester le gain de vitesse. `MiniMaxH3SigmaShift` (déjà
documenté) existe aussi mais n'est pas non plus câblé par défaut sur ce template précis — à vérifier
si un autre template H3 le contient déjà avant de le rajouter à la main.

### ⭐⭐⭐ Deep dive 54min "Fine-tuning Friday" (Oxen.ai, Phil de Machine Delusions + Greg) — 2026-08-10

Vidéo la plus dense et la plus experte analysée à ce jour sur H3 — un praticien diffusion pro (~15
ans d'expérience, studios VFX/anime) + un des créateurs d'outils H3 communautaires. Résumé des points
qui changent ou affinent notre pratique.

**⭐⭐⭐ Le plafond de netteté natif à 768px est structurel, pas un réglage** : la pipeline officielle
MiniMax a 3 étages — (1) tokenisation de toutes les références, (2) le "768 pipe" = la partie
effectivement open-source, (3) une passe de refinement 2K **jamais publiée** (façon GAN/adapter en
sortie du DIT, non confirmé). Tous les benchmarks publics "SOTA" (Design Arena, etc.) reflètent la
variante fermée AVEC ce refiner caché — pas ce qu'on obtient avec les poids ouverts. **Implication
directe** : nos templates gratuits `video_minimax_h3_*` (open-weight) plafonnent probablement en
netteté à ce palier 768, quel que soit le `width`/`height` demandé en sortie — la variante `api_*`
(payante, ~136-272 crédits) appelle probablement la vraie pipeline fermée avec refiner, d'où une
netteté supérieure attendue. À vérifier par comparaison directe si la netteté devient un point bloquant.

**⭐⭐⭐ Stratégie d'itération validée par un pro : motion-check en basse résolution AVANT tout upscale.**
Rendre d'abord à 512px côté long — le mouvement y est déjà excellent, la netteté n'a aucune importance
à ce stade — puis upscaler/re-passer au sampler SEULEMENT une fois la direction/mise en scène validée.
Principe : le mouvement est la partie la plus difficile à obtenir, le nettoyage est un problème
résolu séparément. Directement transposable à notre pratique R2V/FLF2V : tester en 480p (déjà notre
palier le plus rapide, cf section vitesse), ne monter en 720p/1080p qu'après validation du geste.

**⭐⭐ Nuance sur la fidélité image de référence vs texte** : sur un test multi-référence (character
sheets + katana, plusieurs angles), le modèle **n'a PAS suivi les images littéralement** — il les a
traitées comme guide stylistique tout en réinterprétant le mouvement/la scène selon le texte. Sur un
swap de personnage complet dans une vidéo de danse (pose transfer), succès total avec des personnages
très différents visuellement de l'original. **Ça semble contredire notre observation du 2026-08-10 sur
FLF2V** (la `last_frame` fournie avait primé sur le texte contradictoire, cf test Sonjata) — mais ce
n'est probablement PAS une vraie contradiction : le mécanisme FLF2V a une contrainte structurelle de
point d'arrivée (la dernière frame doit ressembler à l'image donnée, c'est sa fonction même), alors que
le multi-référence R2V classique traite les images comme guidance stylistique plus lâche. **Ne pas
généraliser un principe unique "images vs texte" entre les deux mécanismes** — traiter FLF2V et R2V
multi-référence comme deux comportements de fidélité distincts jusqu'à preuve du contraire.

**⭐⭐ Dialogue : le prompt brut produit un audio en charabia, la structure complète le corrige.**
Démonstration directe dans la vidéo : même prompt de base ("Jim and Dwight discuss autonomous coding
agents"), envoyé brut vs envoyé après enrichissement automatique (un outil maison qui utilise le guide
officiel HuggingFace comme contexte pour réécrire le prompt). Version brute → dialogue audio
incompréhensible/langue non identifiable. Version structurée (crochets, séparation description
multimodale / soundscape / musique, **balises de langue `<D>...</D>` pour le dialogue — 11 langues
supportées**) → dialogue clair et correctement localisé. **Actionnable directement** : pour tout clip
H3 avec dialogue parlé chez nous, structurer explicitement avec ces sections plutôt qu'une description
continue — guide officiel à consulter : HuggingFace repo MiniMax H3 → Files and versions → docs.

**⭐⭐ Durée du clip doit être dimensionnée au volume de dialogue demandé.** Preuve concrète : même
prompt élaboré avec dialogue scripté, rendu en 5s vs 12s — la version 5s tronque/déforme visiblement le
texte de la réplique pour tenir dans le temps imparti. Si un prompt contient du dialogue conséquent,
prévoir une durée généreuse (viser la fourchette haute plutôt que la basse) plutôt que de compresser.

**⭐ Limite de "frame buckets" fixes, confirmée avec exemple chiffré** : le modèle n'accepte pas
n'importe quelle longueur de rendu en frames — seulement des valeurs par paliers fixes (hypothèse liée
à la compression du VAE, non confirmée à 100% par le créateur). Exemple cité : demander 37 frames →
le système impose 39 (palier valide le plus proche) → il faut crop 2 frames en post. **Cohérent avec
notre propre observation déjà documentée** (arrondi non strictement déterministe d'un test à l'autre,
cf section durée réelle vs demandée plus haut) — confirme qu'il ne faut jamais viser une durée exacte
en frames sans vérifier `ffprobe` après coup, quel que soit le mécanisme de calcul utilisé en amont.

**⭐ Contrainte structurelle : H3 exige toujours un input visuel, même pour un usage 100% audio-first.**
Le modèle refuse un audio de référence seul sans image/vidéo d'accompagnement — "fondamentalement
entraîné ainsi", pas une limite d'interface. Contournement : une image neutre/blanche suffit à satisfaire
la contrainte si le vrai driver souhaité est l'audio seul. À garder en tête si on explore un jour un
pipeline piloté par la narration audio plutôt que par une image de scène.

**Repères secondaires** : audio natif à 32kHz (proche qualité MP3, supérieur à des modèles audio dédiés
type Step ~24kHz) · setup GPU pro observé pour référence : 2× GPU 48Go VRAM (text encoder Qwen 32B
int8 ≈27Go sur un GPU, diffusion model pruned int8 sur l'autre) — H3 confirmé aussi tournable sur du
matériel modeste (RTX A4500 20Go, MacBook M5 via MLX ~45min/clip) · modèle confirmé "fully uncensored"
par les deux intervenants (violence/gore/explicite) — non pertinent pour notre registre éditorial mais
confirme l'absence de filtre côté poids ouverts · test de rupture de mouvement (salto/gymnastique, tête
qui se confond avec les pieds à un moment précis) **partagé avec Seedance** sur ce cas précis — pas un
point faible spécifique à H3 · pipeline "image unique → time-lapse" façon édition d'image (Nano Banana)
testé et **jugé peu fiable** (échec net sur le premier cas, résultat mitigé sur le second) — ne pas
prioriser cette approche chez nous · argument ROI fine-tuning cité : un rendu Seedance 2.0 de 30s coûte
10-15$ API, comparable au coût total d'un fine-tuning H3 local pour un usage de niche répété — piste
à garder en tête si un registre visuel récurrent chez nous (ex. cartes/jetons stylisés) justifiait un
jour l'investissement, mais non prioritaire actuellement (dataset de démo ~100 clips jugé
sous-dimensionné par les intervenants eux-mêmes pour un résultat robuste).

### ⭐⭐⭐ GUIDE DE PROMPTING OFFICIEL MiniMax — trouvé sur le repo GitHub, PAS deviné (2026-08-10)

Aziz a demandé explicitement d'aller lire le guide officiel plutôt que de continuer à improviser une
discipline de prompt par nous-mêmes. Trouvé sur le repo officiel `MiniMax-AI/MiniMax-H3` (GitHub),
sous forme d'un **skill installable** avec deux fichiers de référence texte :
- `skills/h3-prompt-writing/references/base-en.txt` — modes T2VA / I2VA / FL2VA / **L2VA** (4e mode
  qu'on ignorait, image de fin seule sans image de départ — le modèle invente un état de départ
  plausible et y converge).
- `skills/h3-prompt-writing/references/ref-en.txt` — mode multi-référence (Ref2VA), **notre usage
  principal actuel**.

Installable directement : `npx skills add https://github.com/MiniMax-AI/MiniMax-H3 --skill
h3-prompt-writing`. Format Markdown pur, aucun appel API — lisible/adaptable par n'importe quel agent.

**⛔⛔ Notre discipline de prompt actuelle (séquençage libre par tranches de temps, un seul bloc de
texte) N'EST PAS le format officiel attendu par le modèle** — elle fonctionne (nos tests ont donné de
bons résultats), mais le format officiel est beaucoup plus structuré et normé. À adopter progressivement
sur les prochains tests pour vérifier si ça améliore la fidélité, en particulier sur les points de
friction déjà rencontrés (dialogue, poids image/texte).

#### Structure officielle — modes de base (T2VA/I2VA/FL2VA/L2VA)

Le prompt final a TOUJOURS 2 parties :
1. **Une ligne d'alignement obligatoire en tête** (sauf T2VA qui n'en a pas), format imposé selon le
   mode. Pour FL2VA par exemple : *"Picture 1 (from Shot 1) aligns with the 0.00-second mark of the
   target video; Picture 2 (from Shot N) aligns with the S.SS-second mark of the target video."*
   (S.SS = durée réelle du clip à exactement 2 décimales). **On ne mettait jamais cette ligne** —
   à tester : est-ce qu'elle améliore la fidélité au timing/à la convergence vers la last_frame ?
2. **3 champs séparés, chacun introduit par son nom** : `integrated_multimodal_description:` (le corps
   principal, tout le visuel/action/dialogue/son synchronisé) → `overall_soundscape:` (1-4 phrases,
   ambiance/sons physiques, PAS le dialogue) → `non_diegetic_music:` (1-3 phrases, musique
   d'accompagnement inaudible par les personnages ; `N/A` si aucune). **On écrivait tout en un seul
   bloc sans cette séparation** — à adopter systématiquement.

**⭐⭐⭐ Nuance importante sur notre découverte du 2026-08-10 (test Sonjata FLF2V, "la last_frame prime
sur le texte")** : le guide officiel dit explicitement que FL2VA doit décrire une **convergence
PROGRESSIVE** vers l'image 2 ("progressively narrowing differences → last-frame state"), structure
recommandée : état de départ → changements intermédiaires observables → **écart qui se resserre
progressivement** → état final. Notre prompt de test demandait l'inverse (rotation franche vers la
foule au milieu, PUIS retour à la pose de la last_frame) — ce n'est pas la structure recommandée.
**Hypothèse à tester** : notre "aller-retour" observé vient peut-être du fait qu'on a mal structuré la
convergence (changement brutal non-monotone) plutôt que d'un vrai conflit fondamental image/texte —
à revérifier avec un prompt qui décrit une convergence progressive et continue vers la pose finale
voulue, structuré selon ce guide, avant de conclure quoi que ce soit de définitif sur "qui prime".

**Vocabulaire de mouvement de caméra normalisé** (liste fermée, 3 dimensions à combiner) :
- Type : `Zoom In/Out`, `Push In/Pull Out`, `Pan Left/Right`, `Truck Left/Right`, `Tilt Up/Down`,
  `Pedestal Up/Down`, `Arc Shot`, `Tracking Shot`, `Static Shot`, `Shake Slightly/Strongly`, `POV`,
  `Roll Clockwise/Counterclockwise`.
- Amplitude : `with small amplitude` / `with large amplitude` (omettre si amplitude moyenne).
- Vitesse : `at slow speed` / `at fast speed` (omettre si vitesse normale).
- Écrit en phrase naturelle dans le plan, pas empilé en tags séparés : *"The camera pushes in with
  small amplitude at slow speed toward..."*. **On utilisait des descriptions libres de caméra** — ce
  vocabulaire fermé est probablement plus fiable, à tester sur le prochain test avec mouvement caméra.

**Format des coupures de plan** : `[Shot 1]` sans timestamp pour le premier plan, puis
`[Shot 2] At 00:03.500, the camera cuts to...` (timestamp précision milliseconde, formulations
imposées : `cuts to`/`shot transitions to`/`shot changes to`/`shot switches to`). Une coupure doit
apporter une info nouvelle (sujet/espace/état/point de vue/temps) — sinon préférer un mouvement de
caméra continu plutôt qu'une coupure.

**Dialogue — syntaxe précise, différente de notre pratique** :
- ID de locuteur stable `(S1)`, `(S2)` etc., réutilisé à travers tous les plans où ce personnage parle.
  Combiner en `(S1,S2)` si plusieurs parlent ensemble. Un personnage qui ne parle jamais n'a pas d'ID.
- Syntaxe du dialogue : `<d>[English] texte exact</d>` — préserver mot pour mot et ponctuation
  d'origine, ne jamais traduire/reformuler à l'intérieur des balises. **On utilisait des guillemets
  simples sans balise de langue** — cohérent avec la découverte de la vidéo deep-dive (balises
  `<D>...</D>` par langue, 11 langues supportées).
- Voix off : formule exacte imposée `says in an off-screen voiceover`, suivie obligatoirement d'une
  précision que les lèvres du personnage à l'écran restent fermées.
- Dialogue qui traverse une coupure : `<scenetrans>` aux points de jonction + préciser explicitement
  la continuité audio. `<cutoff>` si la réplique est tronquée par la fin de la vidéo.

**Texte à l'écran** : entre guillemets anglais doubles, texte et ponctuation d'origine préservés sans
traduction (ex: bannière/néon/panneau visible).

#### Structure officielle — mode multi-référence (Ref2VA, NOTRE USAGE PRINCIPAL)

**⛔⛔⭐⭐⭐ CORRECTION 2026-08-14** : ce format 6-sections documenté par le guide GitHub MiniMax-AI est officiel pour l'API Ref2VA **HÉBERGÉE PAYANTE** — **PAS confirmé comme le format attendu par le node H3-Base open-weight local** qu'on utilise réellement via Comfy Cloud (`video_minimax_h3_r2v`, notre usage principal réel malgré le titre de cette section). Testé côte à côte le 2026-08-14 sur le même cas : aucune preuve que ce format apporte un avantage sur notre pipeline gratuit, et un vrai désalignement structurel identifié avec le format que le node local attend (`integrated_multimodal_description`, timestamps absolus, pas de section négative dogmatique). **Voir `memory/tools/minimax-h3-styles-tests.md` § "FORMAT DE PROMPT OFFICIEL" (en tête de fichier) avant tout nouveau prompt** — le contenu ci-dessous reste une référence valide du guide GitHub en tant que tel, mais ne plus le traiter comme "notre format à suivre" par défaut.

**6 sections dans cet ordre strict** (très différent de notre pratique actuelle en un seul bloc) :
1. **`subject_definitions`** — définit CHAQUE élément référencé séparément avec 4 types de labels :
   - `<Subject N>` : contenu visuel réutilisable (personnage, décor, costume, style, action, pose) —
     PAS le fichier source lui-même, l'élément qui sera effectivement utilisé dans la vidéo cible.
   - `<Picture N>` : une image de référence utilisée comme frame concret (première/dernière frame,
     ancre de composition) — si l'image sert juste à définir un personnage/décor/style sans être un
     frame concret, ne PAS créer d'entrée `<Picture N>` séparée, la citer dans la définition du
     `<Subject N>` correspondant à la place.
   - `<Video N>` : relation avec une vidéo entière (édition, continuation, structure/rythme/coupures
     de référence) — PAS utilisé si on réutilise juste un personnage/objet visible dedans (ça reste
     `<Subject N>`).
   - `<Audio N>` : signal audio autonome ou piste synchronisée d'une vidéo de référence (copie,
     référence de timbre de voix, référence de rythme/style musical).
   - Une fois un label assigné, il garde le même sens dans toutes les sections suivantes.
2. **`summary`** — un court paragraphe résumant la tâche et les relations de référence, commence par un
   préfixe de type de tâche entre crochets (ex: `[reference generation]`, `[video editing + audio
   reuse]`) — liste fermée de types : `keyframe completion`, `reference generation`, `video editing`,
   `video continuation`, `audio reuse`, `audio reference`, combinables avec ` + `.
3. **`retention_analysis`** — une ligne par label référencé, avec un marqueur de relation FIXE :
   pour le visuel (`<Subject N>`/`<Picture N>`/`<Video N>`) : `fully_preserved` / `partially_preserved`
   / `attribute_transfer` / `weak_reference`. Pour l'audio (`<Audio N>`) : `fully_copy` /
   `partially_copy` / `reference` / `weak_reference`.
4. **`detailed_description`** — le corps principal (équivalent du `integrated_multimodal_description`
   des modes de base), 350-500 mots recommandés pour une tâche de génération, avec les labels de
   référence insérés à leur première apparition claire et partout où leur rôle s'applique. Ouverture en
   1-2 phrases de style AVANT `[Shot 1]` (pas après comme en T2VA).
5. **`overall_soundscape`** — même règle que les modes de base.
6. **`non_diegetic_music`** — même règle que les modes de base.

**⭐⭐⭐ Implication directe et immédiate pour nous** : notre usage R2V actuel (node
`MiniMaxH3ReferenceToVideo`, `<Picture 1>`/`<Picture 2>` dans un bloc de texte libre avec séquençage
par tranches) ne suit AUCUNE de ces 6 sections. On écrit l'équivalent d'un `detailed_description` seul,
sans `subject_definitions` (donc sans définir explicitement CE QUE chaque image représente et COMMENT
elle doit être préservée), sans `retention_analysis` (donc sans dire explicitement au modèle "préserve
entièrement ce personnage" vs "transfère juste le style").

**⭐⭐⭐ TEST RÉEL 2 — même cas Sonjata, format officiel 6 sections + dialogue français (2026-08-10)** :
même paire d'images qu'au Test 1 (`prompt_id ca1b3b94`), même durée/résolution (10s, 768×1376), mais
prompt entièrement réécrit selon le format officiel `Ref2VA`-like (adapté au node FLF2V qui n'a qu'un
champ texte libre — les 6 sections tiennent dans ce seul champ), avec en plus une réplique de dialogue
ajoutée pour la matrone : *"Au moins mon fils peut cueillir des feuilles de baobab, le tien ne peut
même pas se lever."* (`prompt_id 5e70ff6e-6129-4435-ae1b-bc01c2f6f9f5`, 272 crédits, même coût que le
Test 1). Vérifié frame par frame (11 frames 0-10s, pleine résolution) + **transcription réelle de
l'audio via `scripts/tools/transcribe-openai.py`** (API Whisper OpenAI, pas d'estimation à l'oreille) :

- ✅ **Convergence propre, PAS d'aller-retour cette fois** — contrairement au Test 1 (rotation franche
  au milieu puis retour brusque à la pose de la last_frame), ici le garçon se lève entre 6-7s et sa
  pose se STABILISE ensuite jusqu'à 10s. La clause de convergence progressive du format officiel
  ("narrowing differences") semble avoir résolu le défaut observé au Test 1.
- ✅✅✅ **Dialogue parfait, vérifié par transcription automatique** : Whisper retranscrit la réplique
  **mot pour mot identique** au texte du prompt, sur le créneau 0.00s-4.74s, aucune déformation ni
  troncature. Confirme que la syntaxe `<d>[French] texte</d>` avec locuteur `(S1)` identifié fonctionne
  telle quelle sur le node FLF2V malgré le guide officiel écrit pour Ref2VA — transposition réussie.
- ✅ **Fidélité mère/foule/décor parfaite** sur les 11 frames — aucun élément déplacé/modifié.
- ⚠️ **Rotation "vers la foule" pas franchement exécutée** : le garçon finit en position frontale/
  légèrement de profil plutôt qu'une vraie rotation à 90°, cohérent avec la `last_frame` fournie qui
  elle-même n'était pas tournée (blocage Gemini du Test 1, jamais résolu). **La limite vient de l'image
  de référence, pas du prompt** — confirme qu'il faut soigner l'image `last_frame` en amont plutôt que
  compter sur le texte pour forcer une pose qu'elle ne montre pas.

**Conclusion actionnable** : le format officiel à 6 sections **résout concrètement et mesurablement**
le défaut de convergence non-monotone observé au Test 1, ET permet un dialogue synchronisé fiable et
fidèle en français. **Adopter ce format par défaut pour tout prochain test FLF2V/R2V avec dialogue**,
en particulier la clause de convergence progressive pour FLF2V et la syntaxe `<d>[Language]...</d>` +
`(Sx)` pour tout dialogue. Reste à tester : le même format sur le node R2V multi-référence classique
(pas juste FLF2V) pour voir si le gain de fidélité se confirme aussi sur ce mécanisme.

**Note sur les fichiers sources** : guide texte intégral non reproduit ici (contenu propriétaire
MiniMax) — se référer directement au repo GitHub `MiniMax-AI/MiniMax-H3` (fichiers
`skills/h3-prompt-writing/references/{base-en,ref-en}.txt`) pour les exemples complets et la formulation
exacte avant tout prompt à enjeu narratif important, plutôt que de travailler uniquement depuis ce
résumé.

### ⭐⭐ TEST RÉEL 3 — hypothèse "yeux expressifs = hiérarchie visuelle héros" (Mariama Bâ, 2026-08-10)

Hypothèse d'Aziz née de l'observation des tests Sonjata : sur ces clips, seul le personnage principal
(Sundiata) a des yeux avec iris/regard mobile ; les figurants ont des dot-eyes classiques du style
GeoAfrique et H3 anime bien les deux rendus de façon crédible et distincte. Hypothèse : utiliser des
yeux expressifs UNIQUEMENT pour le héros d'une scène pourrait servir de signal visuel de hiérarchie
narrative (qui est le protagoniste), en plus/au lieu d'autres conventions déjà documentées
(`hierarchie-figurant-heros` en mémoire globale du projet).

**Protocole de test** : personnage Mariama Bâ (charsheet canonique en dot-eyes strict, voir
`public/_shared/refs/characters/mariama-ba/`), scène "table d'écriture" existante réutilisée comme
base (`scenes-test/scene-table-ecriture-v1.png`). Edit i2i (Gemini 3.1 Flash, méthode
CHANGE-ONLY-PRESERVE-EXACTLY déjà validée) pour ajouter un iris/pupille simple aux yeux SANS changer
le reste du rendu papercraft — appliqué à la fois sur la `first_frame` (elle écrit) et la `last_frame`
(elle s'arrête, regarde par la fenêtre) pour isoler la variable "yeux expressifs" du reste. **Prototype
sciemment isolé dans un sous-dossier séparé et taggé** (pas dans le charsheet canonique) pour éviter
toute confusion future avec le personnage standard dot-eyes du projet.

**⚠️ Gotcha methode Gemini i2i, déjà vu sur Sonjata, confirmé ici** : la 1ère tentative de changement de
pose (main levée du stylo) a échoué — Gemini a gardé la main en position d'écriture active malgré
l'instruction. Correction qui a marché : simplifier au maximum la formulation ("the pen is resting on
the table... her hands are flat and relaxed") plutôt qu'une description plus longue/indirecte. **Leçon
generalisable** : pour un edit i2i de pose de main, préférer une instruction courte et concrète
("pen resting on table, hands flat") à une description elaborée.

**⚠️ Correction Aziz sur mon propre jugement visuel** : sur la 1ère tentative, j'ai affirmé à tort que
le regard n'était pas tourné vers la fenêtre — Aziz a confirmé de visu que si, c'était bien le cas,
seule la main posait problème. Rappel de la règle déjà documentée (vérifier avant d'affirmer) : mon
jugement visuel sur une image n'est pas infaillible, à confronter au jugement d'Aziz plutôt qu'à
imposer comme fait établi.

**Résultat H3 (10s, 768×1344, `prompt_id 0005acfd-1b7b-4fa2-82f0-d42178567126`, 272 crédits)**, vérifié
frame par frame (11 frames 0-10s pleine résolution) + transcription Whisper réelle :
- ✅ **Iris/regard mobile maintenu sur tout le clip** — direction du regard change de façon cohérente
  (lettre → fenêtre), contrairement à un dot-eyes qui n'a pas d'information directionnelle. Bouche
  animée avec plusieurs expressions distinctes pendant la réplique (légère surprise, sourire).
- ✅ **Convergence propre et monotone** vers la last_frame — pas d'aller-retour, cohérent avec le
  Test 2 Sonjata (même structure de prompt officielle).
- ✅ **Dialogue parfait** — phrase originale composée pour ce test (« Certaines vérités ne s'écrivent
  qu'une fois qu'on a cessé d'avoir peur de les dire », PAS une citation de l'œuvre réelle de l'autrice
  historique), transcrite par Whisper mot pour mot identique, sur 5.10-9.42s.
- ✅ **Décor stable** sur les 11 frames (table, lettre, tasse, encrier, fenêtre, palmier, silhouette
  urbaine, rideau).

**Ce que ce test prouve, et ce qu'il NE prouve PAS encore** : confirme que H3 anime de façon crédible et
stable des yeux à iris sur un personnage seul, sur toute la durée d'un plan — prérequis technique de
l'hypothèse validé. **Ne prouve pas encore l'effet de contraste hiérarchique** (pas de figurant en
dot-eyes présent dans cette scène pour comparer côte à côte) — pour trancher réellement l'hypothèse
"yeux expressifs = lisibilité héros vs figurants", il faudrait un prochain test avec Mariama Bâ (ou tout
héros) ET au moins un figurant secondaire en dot-eyes dans le même plan.

### ⭐⭐⭐ TEST RÉEL 4 — discours podium Mariama Bâ, partie 1/4 (2026-08-10) — verdict initial TROP OPTIMISTE, corrigé ci-dessous (voir Test 5)

Suite du test précédent, sur la base du bilan détaillé d'Aziz après visionnage du Test 3 (voir points
1-6 ci-dessous, tous confirmés/traités).

**Leçons méthode retenues du bilan Aziz sur le Test 3 (Mariama Bâ table d'écriture)** :
1. **Disparition d'objet non désirée détectée** : sur ce clip précédent, l'écriture visible sur la
   lettre disparaissait après qu'elle pose le stylo — artefact non demandé. **Correction appliquée sur
   ce test** : `retention_analysis` marque explicitement `fully_preserved` pour chaque objet du décor
   (podium, micro, banderole) avec la clause "keep their exact positions and appearance throughout" —
   vérifié efficace, aucune disparition observée sur ce nouveau clip.
2. **Choix d'image de référence pour les yeux** : Aziz observe qu'un des deux dessins d'yeux
   "expressifs" (l'image où elle lève les yeux vers la fenêtre) semblait visuellement plus cohérent/
   robuste à l'animation que l'autre (position penchée sur l'écriture) — possible piste : un dessin
   d'yeux plus simple/net à la base est plus facile à animer sans dérive. Pas encore isolé
   scientifiquement, à garder en tête pour choisir quelle pose de référence utiliser en priorité.
3. Mouvement d'ambiance (arbre, rideau) concentré en fin de clip plutôt que réparti sur toute la durée —
   cohérent avec le biais déjà documenté (H3 tend à concentrer l'action vers la fin/le milieu plutôt que
   répartir uniformément), pas un défaut nouveau.
4. Qualité vocale confirmée bonne (voix posée, bien prononcée, lip-sync fidèle) — cohérent avec les
   tests précédents.

**⭐ Gotcha méthode Gemini i2i sur scène multi-personnages, nouveau** : générer une scène de foule/public
varié (ratio hommes/femmes, diversité de tenues) a demandé PLUSIEURS itérations avant validation — la
première tentative avec une longue description a dérivé (mauvais ratio, un vêtement mal rendu à
l'envers) ; revenir à l'image de base et appliquer une instruction courte et ciblée ("make most of them
women, 1-2 men only, mixed in the same rows") a donné un meilleur résultat que d'empiler des corrections
successives sur une image déjà dérivée. **Leçon generalisable, cohérente avec la leçon Test 3** :
pour un edit i2i qui ne prend pas, repartir de l'image de base validée plutôt que de corriger en
cascade une version déjà dérivée.

**Scène** : décor neuf généré (pas réutilisé de Sonjata, décision Aziz) — podium en bois, micro,
banderole murale à motif bogolan, public varié (majorité femmes, 1-2 hommes mêlés dans les rangs, tenues
variées traditionnelles/modernes 1970s). Personnage Mariama Bâ avec les yeux expressifs validés au
Test 3. Discours en 4 parties prévu par Aziz — ce test couvre la **partie 1/4** seulement (décision
consciente de scoper à une seule scène avant d'enchaîner, pour ne pas propager un défaut non détecté
aux 3 parties suivantes).

**Résultat H3 (15s, 768×1344, `prompt_id ef2dd2eb-7d86-4f63-a639-7a82b556135d`, 407 crédits pour
15s/768P — coût confirmé proportionnel à la durée, cohérent avec le ratio déjà observé 10s→272cr)**,
vérifié sur 16 frames (0-15s, pleine résolution) + transcription Whisper réelle :
- ✅ **Mariama Bâ parfaitement stable** — position, expression, yeux cohérents sur toute la durée.
- ✅ **Progression du public crédible et bien temporisée** : la femme aux mains levées vers le visage
  apparaît vers t=8-10s, les deux personnages mains jointes apparaissent et se STABILISENT (pas
  d'aller-retour) jusqu'à t=15s — convergence propre vers la last_frame, cohérente avec le Test 2/3.
- ✅ **Aucune disparition d'objet** — micro, podium, banderole tous stables sur les 16 frames vérifiées.
  Confirme que la clause `retention_analysis` explicite par objet corrige bien le défaut noté au Test 3.
- ✅ **Dialogue parfait** — transcrit par Whisper en 2 segments naturels (0.00-4.84s, 7.18-9.56s)
  correspondant exactement aux deux phrases du texte original composé pour ce test (PAS une citation
  de l'œuvre réelle de l'autrice historique — phrase inventée pour ce prototype, cohérente avec ses
  combats connus pour l'éducation des femmes).

**Verdict global** : test concluant sur tous les points vérifiés — confirme que la discipline de
`retention_analysis` explicite (marquer chaque objet du décor comme `fully_preserved` avec description)
est le fix efficace contre la disparition d'objets non désirée. Scène + personnage établis comme base
réutilisable si Aziz veut enchaîner les parties 2/3/4 du discours dans une prochaine session (chaîner
via la même méthode FLF2V, dernière frame de la partie N = première frame de la partie N+1).

**Fichiers** : `public/_shared/refs/characters/mariama-ba/_prototype-expressive-eyes-rnd/discours-podium/`
(images de scène + prompt + clip + audio + frames de vérification) — dossier sciemment séparé du
charsheet canonique Mariama Bâ pour éviter toute confusion (yeux expressifs = variante prototype, pas
le standard dot-eyes du projet).

**⚠️ CORRECTION AZIZ après visionnage réel (2026-08-10) — le verdict "franc succès" ci-dessus était
TROP GÉNÉREUX, à ne pas reprendre tel quel.** Défauts réels repérés par Aziz que la vérification frame
par frame de l'agent avait manqués (leçon méthode : comparer explicitement le NOMBRE de personnages
visibles d'une frame à l'autre dans les zones de geste complexe, pas juste juger chaque frame isolément
comme "ça a l'air bien") :
1. **Personnage central disparaît au moment où 2 figurants voisins se joignent les mains** — vérifié
   frame par frame (t=11s : 4 têtes visibles : ; t=12s à t=15s : seulement 3, le personnage entre les
   deux mains a disparu, fondu dans le geste). PAS un artefact isolé.
2. Pause artificielle dans le dialogue (2 segments Whisper séparés par un silence) — jugée par Aziz
   comme un "effet étrange", pas voulu.

**⭐⭐⭐ TEST RÉEL 5 — tentative de correction, ÉCHEC PARTIEL sur le point critique (2026-08-10,
`prompt_id b143db43-4133-4846-99bb-104a8808f485`, 407 crédits, 2e dépense sur cette même scène)** :
correction tentée via (a) nommer explicitement le personnage central comme `<Subject 3>` avec clause
`fully_preserved` répétée 2x (dans `retention_analysis` ET dans `detailed_description` au moment précis
du geste — "his head and shoulders never disappearing or fading from view even as the two hands come
together just in front of his chest"), (b) fusionner le dialogue en une seule phrase continue sans
pause interne.

**Résultat, vérifié frame par frame avec comparaison explicite du nombre de têtes (leçon méthode
appliquée) :**
- ❌ **ÉCHEC — le personnage central disparaît TOUJOURS, au même moment précis (t≈12s), malgré la
  clause de préservation nommée et répétée.** Nommer explicitement un personnage et demander sa
  préservation ne suffit PAS à empêcher sa disparition quand un geste de contact physique (mains
  jointes) se forme dans son espace visuel immédiat — hypothèse à approfondir : le geste de contact
  entre 2 figures semble structurellement prioritaire sur la préservation d'une 3e figure occupant
  le même espace de composition, indépendamment de l'insistance textuelle du prompt.
- ✅ **RÉUSSI — dialogue en 1 seul segment continu** (Whisper : un seul bloc 0.00-5.72s, plus de
  coupure en deux parties) — cette partie de la correction a bien fonctionné.

**⛔ Seuil "2 échecs sur le même problème" atteint sur ce défaut précis** (Test 4 = échec initial,
Test 5 = échec de la correction ciblée) — cohérent avec le protocole projet de délégation à un agent de
diagnostic dédié après 2 tentatives infructueuses. **Ne PAS retenter un 3e essai de formulation à
l'aveugle sur ce même geste.** Deux pistes pour une prochaine session, non testées : (1) investigation
dédiée pour déterminer si le défaut est spécifique au geste "mains jointes entre 3 personnages
resserrés" ou plus général à toute composition dense en resserrement, (2) contournement pragmatique —
remplacer le geste de mains jointes par une réaction de groupe qui n'implique pas de superposition
bras/main sur l'espace d'un 3e personnage (ex. têtes qui se tournent, sans contact physique croisé).

**Fichiers additionnels** : `discours-partie1-v2.mp4` + `discours-partie1-v2-audio.mp3` +
`frames-v2/` + `prompt-partie1-v2.txt` dans le même dossier prototype que le Test 4.

**⛔⛔⛔ NOUVEAU DÉFAUT CRITIQUE, plus grave que la disparition de personnage — écran noir avec
sous-titres karaoké au lieu de la scène (2026-08-10, même job `prompt_id b143db43-4133-4846-99bb-
104a8808f485`)** : signalé par Aziz après un second visionnage plus attentif du clip Test 5 — l'agent
avait vérifié les frames t=8-15s (zone du geste mains jointes) mais PAS la zone t=1-7s, ratant un défaut
bien plus grave en début de clip.

**Fait vérifié directement sur les frames (pas une supposition)** : de t≈1s jusqu'à au moins t=7s, le
clip est un **écran totalement noir** avec le texte de la réplique affiché en incrustation blanche,
façon sous-titre karaoké qui s'écrit mot par mot au fil du temps ("Nous avons" → "Nous avons trop
longtemps appris" → ... → phrase complète à t=7s). **Aucun élément de la scène demandée (podium,
Mariama Bâ, public) n'est visible pendant cette fenêtre.** Le rendu revient à la scène normale
seulement après t=7s (à vérifier précisément où — pas encore fait).

**Ce qui a été vérifié comme n'étant PAS la cause** : le prompt source (`prompt-partie1-v2.txt`) ne
contient AUCUNE instruction demandant un affichage de texte à l'écran — au contraire, le dialogue est
correctement encapsulé dans `<d>[French]...</d>`, syntaxe réservée à l'audio parlé selon le guide
officiel, jamais à du texte visible. Ce n'est donc pas une erreur d'instruction de notre part.

**Hypothèses NON confirmées, à ne pas prendre pour acquises avant un test dédié** :
- Possible corrélation avec le seul changement structurel entre v1 (réussi visuellement) et v2 (ce
  défaut) : le dialogue est passé de 2 phrases séparées par une pause à 1 seule phrase longue et
  continue. Pourrait avoir déclenché un mode de rendu différent chez H3 (ex. le modèle interprétant la
  consigne "dialogue continu, sans coupure" comme une invitation à produire un rendu type "lyric video"
  plutôt qu'une scène jouée) — **pure spéculation, une seule occurrence, aucune preuve causale**.
- Pourrait aussi être un glitch ponctuel serveur/modèle sans rapport avec le contenu du prompt — cf
  précédent similaire déjà documenté plus haut dans ce fichier (§ "TOUJOURS logger le prompt_id") où un
  run `succeeded` avait livré un contenu totalement étranger au prompt (scène super-héros au lieu de
  Sonjata) sans cause identifiable côté prompt/image.

**⛔ Seuil de délégation largement dépassé sur cette scène précise** (Test 4 = défaut personnage, Test 5
= même défaut personnage NON résolu + CE nouveau défaut bien plus grave) — ne pas retenter un 3e essai
de prompt sur cette scène sans investigation dédiée au préalable. Si cette piste "discours podium
multi-personnages" est reprise dans une future session : (1) tester d'abord un dialogue à 1 seule
phrase longue SEUL (sans le changement de personnage central) pour isoler si c'est bien la longueur/
continuité du dialogue qui cause l'écran noir, (2) vérifier systématiquement TOUTES les frames d'un
clip (pas seulement la zone jugée à risque a priori) avant de livrer un verdict, leçon désormais
répétée 2 fois cette session (once sur le nombre de personnages, once sur la zone temporelle vérifiée).

### Setup (déjà fait sur ce repo, one-time)
```
claude plugin marketplace add Comfy-Org/comfy-skills
claude plugin install comfy-cloud@comfy-skills
/mcp   # sélectionner comfy-cloud → Authenticate (flow OAuth navigateur)
```
Auth OAuth par session Claude Code (pas de clé API statique dans `.mcp.json` — tenté puis abandonné,
le serveur MCP exige OAuth, voir `auth_state` via `get_server_info`). Après authentification, 39
outils MCP disponibles (`mcp__claude_ai_Comfy_Cloud_MCP__*` ou nom équivalent selon la session).

### ⛔⛔⭐⭐ T2V (`video_minimax_h3_t2v`) — `slot_overrides` NE MARCHE PAS, graphe à plat obligatoire (2026-08-14)

**Symptôme** : `run_template(name: "video_minimax_h3_t2v", slot_overrides: {...})` échoue
systématiquement en `{"status":"tool_error","error_type":"validation.reference"}` — y compris avec le
seul `105.prompt` surchargé (donc pas un problème de valeur envoyée). Reproduit 2×.

**Cause** : ce template est bâti autour d'un **subgraph** (node 105, type
`4c314f31-ecda-4b08-ae98-faaba1bf613f`). Ses entrées `first_frame`/`last_frame` sont optionnelles et
non branchées à l'extérieur (`link: null`), mais le subgraph les câble quand même en interne vers le
node 104 (liens 195/196). Le validateur voit des liens pointant vers des entrées mortes et rejette
tout le graphe, quelles que soient les surcharges.

**Fix (validé, clip produit)** : ne pas passer par `run_template`. Reconstruire le graphe **à plat en
format API** (14 nodes, subgraph aplati) et le soumettre via `submit_workflow` — `first_frame` et
`last_frame` sont alors simplement absents des `inputs` du node 104, plus aucun lien mort.
⭐ **Gabarit conservé** : `scripts/tools/comfy-graphs/minimax-h3-t2v-graph-template.json`
(remplacer `prompt`/`width`/`height`/`length` du node 104 et `noise_seed` du node 15).
Toujours `submit_workflow(dry_run: true)` d'abord — gratuit, 0 GPU, valide la structure.

**⭐ Formule de durée (node `ComfyMathExpression` du template, à appliquer soi-même sur graphe à plat)** :
`length = max(5, round(sec*24))` puis arrondi SUPÉRIEUR à la grille 17k+5 exigée par le modèle.
Concrètement : **6s → 141 frames** (144 → 141). Le champ `length` du node 104 attend des FRAMES, pas
des secondes. Résolution 16:9 : `864×480` (0.4 MP) pour un test, table complète dans la note du template.

**Coût** : 0 crédit confirmé par `estimate_credits` (variante open-weight sans préfixe `api_`).

### ⭐⭐ Négatifs COURTS confirmés une 2e fois + limite « H3 anime le physique, pas l'abstrait » (2026-08-14)

Test mené sur une **texture d'ambiance en boucle** (idée : passer un clip H3 en couche de fond sous une
carte D3). Deux clips T2V, 6s, Poster Vector, sans personnage ni dialogue.

**V1** (`prompt_id de821b43`, négatifs formulés EN PHRASE dans le corps : *"No horizon line, no ground,
no sky…"`) → **négatifs ignorés**, le modèle produit un paysage de dunes complet avec horizon. Mais
excellent par ailleurs : mouvement médian **12%** de pixels modifiés/0.25s, aucun gel, **aucun écran
noir en fin** (le défaut documenté 2× ne s'est pas produit), boucle ratio 2.8× (raccord discret),
registre Poster Vector parfaitement tenu.

**V2** (`prompt_id f1107c91`, mêmes interdits en `negative_keywords:` mots-clés courts en tête de
prompt + suppression de tout mot évoquant un lieu — `desert`/`dust`/`heat` retirés) → **négatifs
RESPECTÉS** : horizon, ciel, sol, dunes tous éliminés. ✅ **Confirme sur un 2e cas la règle du
2026-08-14 (`minimax-h3-styles-tests.md`) : négatifs en mots-clés courts, jamais en phrases noyées
dans le texte narratif.**

**⚠️ MAIS — limite à retenir** : V2 chute à **3.9%** de mouvement médian (3× moins que V1) et sa boucle
passe à **14×** (raccord franc, inutilisable tel quel). En retirant tout référent physique, on retire
ce qui MOTIVE le mouvement : **H3 anime bien un phénomène physique qu'il comprend (sable qui souffle,
fumée, houle), il anime mal une abstraction géométrique pure** (bandes de couleur qui dérivent).
Corollaire de prompt : garder un ancrage physique nommé même pour une texture, et écarter le décor par
`negative_keywords` plutôt qu'en désincarnant la description.

**Verdict d'usage** : piste « texture de fond neutre sous carte » **ABANDONNÉE** — soit figuratif et en
conflit visuel avec la carte (V1), soit abstrait et mou (V2) ; un fond de ce type est mieux fait en SVG
animé maison (vitesse contrôlée, boucle parfaite par construction). **En revanche V1 démontre une
capacité voisine réelle** : décor d'ambiance stylisé en boucle, sans personnage, sans dérive — utile
derrière un titre/une citation/un chiffre-choc, pas sous une carte. Clips :
`texture-sahel-v1` https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/texture-sahel-v1-FA74rayF61d1Jhace409lH9LiKQHW0.mp4
· `texture-abstraite-v2` https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/texture-abstraite-v2-1ULSkyvnwGaRnWWGQOAqJzFXXS4WE1.mp4

### ⭐⭐⭐ INSERT MATIÈRE — chaîne Gemini (composition) → H3 R2V (turbulence) VALIDÉE, 75× de séparation décor/matière (2026-08-14)

**Contexte** : après 2 échecs T2V (§ ci-dessus), Aziz corrige la méthode — *« pourquoi tout en T2V ?
On génère l'image d'abord, puis on l'anime, comme d'habitude »*. **Il avait raison, et pour une raison
mesurable** : en T2V le modèle recompose la scène entière à chaque essai (d'où dunes non voulues puis
abstrait mou) ; en R2V la composition est VERROUILLÉE par l'image, il ne reste qu'un degré de liberté —
le mouvement. Cohérent avec le Test Réel 2 déjà documenté (« la limite vient de l'image de référence,
pas du prompt »). ⛔ **Ne plus partir en T2V pour un insert : image d'abord, animation ensuite.**

**Chaîne testée** : `gemini-gen-image.py` (`IMAGE_MODEL` — Lite ; l'image sert de SOURCE a H3, jamais publiee telle quelle, coupe de conduite Poster
Vector, palette navy `#16213a`/or, cadrage centré sans décor) → `upload_file` Comfy Cloud →
`submit_workflow` graphe R2V à plat (gabarit `minimax-h3-r2v-graph-template.json`, node 136
`ref_image_size: "match"`, **un seul slot `ref_images.ref_image_0`** — `ref_image_1` OMIS pour éviter
l'image de démo parasite). `prompt_id 7e99bcbb`. 0 crédit.

**Résultats mesurés (141 frames, 864×480, 5.875s)** :
| Mesure | Valeur | Lecture |
|---|---|---|
| Mouvement médian | 8.65% | 2× le T2V abstrait |
| **Décor (bande fond navy)** | **0.13** | quasi immobile |
| **Matière (centre)** | **9.74** | **75× le décor** |
| Boucle | **0.4×** | meilleur que « parfait » — `<Loop>` sans crossfade |
| Écran noir fin | absent | luminosité 61.3→61.7 |

⭐ **Le chiffre qui compte est le rapport 75× décor/matière** : c'est LE comportement recherché pour un
insert — cadre rigoureusement stable, seule la matière vit. Le T2V ne savait pas faire ça.

**⭐⭐ Règle de partage qui en découle (à appliquer par défaut)** :
**composition + géométrie = NOUS** (Gemini ou SVG maison, déterministe) · **turbulence + matière = H3**.
Corollaire : si le mouvement est géométrique (translation, rotation, tracé qui se dessine, compteur)
→ SVG maison TOUJOURS, H3 n'apporte rien et fait perdre le déterministe. H3 ne vaut le détour que pour
le désordonné : fluide, fumée, poussière, granulaire, remous, flamme.

**⚠️ Défaut résiduel** : le gaz **bouillonne sur place** au lieu de **transiter** gauche→droite malgré
un prompt explicite sur la direction. Acceptable pour « matière sous pression », insuffisant si le sens
de lecture porte du sens (le gaz qui part VERS l'Europe).

**✅ RÉSOLU (2026-08-15) — le sens de lecture se PORTE EN SVG, on ne le renégocie pas avec H3.**
Fix appliqué sur `ProtoInsertMatiereConduite.tsx` : un `linear-gradient` clair (`backgroundSize: 55%`,
`backgroundPositionX` de -55% à 100%, `mixBlendMode: screen`) balaie la coupe par-dessus le clip, en
boucle sur la même période que les impulsions du tracé. Vérifié au rendu (crops t=5.0/5.3/5.6/5.9s :
la bande progresse bien vers la droite). **Zéro GPU, déterministe, réglable à la frame** — vs une
re-génération au résultat incertain. C'est l'application directe de la règle de partage ci-dessus :
la direction est de la GÉOMÉTRIE, donc elle nous revient ; H3 ne garde que la turbulence.
⭐ **Généralisable à toute la famille d'inserts matière** : pétrole qui monte, minerai sur tapis,
billets qui défilent — si le sens de lecture porte du sens, le coder en SVG par-dessus dès le départ
plutôt que de l'espérer du prompt.

**Familles d'inserts que cette chaîne ouvre** (même mécanique) : billets qui se consument ✅ TESTÉ ·
torchère ✅ TESTÉ · pétrole qui remplit, minerai sur tapis, eau derrière un barrage, fumée d'usine (non testés).

### ⭐⭐⭐ 4e insert — TORCHÈRE : meilleur score de la série, la leçon SIZE LOCK validée (2026-08-15)

`prompt_id 635b56ec`, 864×480, 124f. Généré juste après l'échec de niveau de `conduite-vide`, en
appliquant sa leçon — **succès du premier coup, sans itération** :

| Mesure | Valeur | Lecture |
|---|---|---|
| Flamme vs tour | **8.36 vs 0.23** | **36× de séparation** — cadre stable, seule la matière vit |
| Taille de flamme début→fin | **+6% / −4%** | le SIZE LOCK a tenu dans les DEUX sens |
| Boucle (écart dernière/première) | **1.1×** | `<Loop>` sans crossfade |
| Luminosité | 32.2 → 32.4 | aucun écran noir |

⭐ **Ce qui a fait la différence dans le prompt** (à reprendre tel quel pour tout insert où une quantité
doit rester constante) : un bloc **SIZE LOCK** dédié — *« the flame keeps EXACTLY the same overall size,
height and position throughout... It is the SAME size in the last frame as in the first frame. It never
grows, never expands, AND never shrinks, never dies down, never goes out. Only its internal shape churns
and flickers in place »* — plus un STRICT NEGATIVE listant les deux dérives (`no growing flame, no
shrinking flame, no flame going out`). Clip :
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/torchere-r2v-v1-vYe9K38yCkjuaGhSVRk3MXt3ymcZN5.mp4

⭐ **Bilan des 4 inserts** : H3 réussit très bien le **désordonné à quantité constante** (gaz sous
pression, flamme, combustion). Le seul échec de la série (`conduite-vide`) portait sur une QUANTITÉ QUI
DEVAIT RESTER STABLE, pas sur la matière elle-même — donc un problème de prompt, corrigé et re-validé,
pas une limite du modèle.

### ⭐⭐ 2e et 3e insert testés (2026-08-15) — billets ✅ / conduite à moitié vide ⚠️ dérive utile

**Billets qui se consument — SUCCÈS NET** (`prompt_id 4e8d57b5`, 864×480, 124f/5.17s). Flammes qui
montent, embers qui pulsent, fumée qui s'élève franchement ; **liasse et fond rigoureusement stables**
(fond 0.03 de mouvement médian). Aucun texte/chiffre halluciné sur les billets — obtenu en générant
l'image source avec des billets VOLONTAIREMENT VIERGES (guilloches abstraites seules, aucune devise
ni inscription) + `negative_keywords` sur text/numbers/currency. ⭐ **À refaire systématiquement pour
tout asset "argent"** : un billet sans inscription évite d'un coup les artefacts de texte ET toute
contrefaçon graphique inutile. Clip :
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/billets-r2v-v1-c20j23j3NVFEqpUb2aVvwduXi7rakK.mp4

**⚠️⚠️ Conduite à moitié vide — LEÇON DE PROMPT (`prompt_id 55948042`)** : le prompt verrouillait
« the cloud NEVER rises, NEVER fills the pipe » + « the gas is thin, sparse and **insufficient** ».
Résultat : le gaz **se vide progressivement** sur les 5s (tiers inférieur bien rempli à t=0 → mince
filet à t=5). Mesure qui l'a révélé AVANT l'œil : la zone censée rester VIDE bougeait **17× plus** que
la zone GAZ (2.34 vs 0.14) — l'inverse exact de la séparation recherchée ; luminosité 48.4→38.4.

⭐ **La leçon, généralisable à tout insert matière** : verrouiller un niveau demande d'interdire les
**DEUX** sens. J'avais interdit de monter/remplir, jamais de DESCENDRE — et « insufficient », adjectif
d'état, a été joué par le modèle comme une ACTION à accomplir. **Ne jamais décrire un niveau par un
adjectif de jugement** (insufficient, scarce, failing) : le modèle cherche à le mettre en scène.
Décrire une quantité *constante* et l'interdire dans les deux sens (« the level stays exactly where it
is, it never rises AND never drops, the amount of gas is identical in the first and last frame »).

**MAIS le résultat est narrativement PLUS FORT que la commande** : une conduite qui SE VIDE sous les
yeux sert mieux l'Acte 4 Gazoduc (« 70% siphonnés ») qu'un niveau bas figé. ⭐ Décision Aziz en
attente : garder la dérive comme effet voulu, ou re-générer un niveau stable. Cas d'école de la règle
« un défaut mesuré n'est pas forcément un défaut narratif — le signaler, laisser Aziz trancher ».
Clip : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/conduite-vide-r2v-v1-nR2l1mfzuTqKS6bl9NwOK5Vs8ttKCr.mp4 Assets : image `conduite-coupe-v1.png` + clip
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/conduite-r2v-jT45QmBgKwK6kv0eIBikqbFSTooqys.mp4

### ⛔⛔⛔ Workflow validé (T2V et R2V) — MÉTHODE CORRIGÉE 2026-08-11, `run_template`+`input_overrides` ABANDONNÉ pour R2V

**⛔ NE PAS utiliser `run_template` + `input_overrides` pour `video_minimax_h3_r2v`** — confirmé
non-fiable le 2026-08-11 (§ "CAUSE RACINE TROUVÉE ET CORRIGÉE" plus bas dans ce fichier) : les
overrides sur les nodes `LoadImage` (137/139) et `PrimitiveStringMultiline` (138) peuvent être
silencieusement ignorés (job `succeeded_with_warnings`, warning `conversion_warning: "1 extra widget
values not mapped"` facile à négliger) — le template retombe alors sur son contenu de DÉMO intégré
(image/prompt par défaut, aucun rapport avec l'input envoyé), reproduit 2x à l'identique sur des
prompt_id différents. **Utiliser `submit_workflow` avec un graphe API construit à la main à la
place** (méthode ci-dessous) — ⭐ **gabarit prêt à l'emploi, CONSERVÉ dans le repo** :
`scripts/tools/comfy-graphs/minimax-h3-r2v-graph-template.json` (graphe fonctionnel complet, testé
2026-08-11 — remplacer juste les valeurs `image` des nodes 137/139, `value` du node 138 (prompt),
et `value` du node 132 (durée en secondes) avant de soumettre via `submit_workflow`).

1. `search_templates(q: "MiniMax H3")` → 2 familles par tâche : `video_minimax_h3_*` (open-weight,
   **0 crédit**) vs `api_minimax_h3_*` (repasse par l'API MiniMax hébergée, ~136 crédits/génération
   sur le forfait mensuel — réservé au 2K/Context-IR non open). **Toujours choisir la variante SANS
   préfixe `api_`** pour l'usage gratuit.
2. `estimate_credits(template_name: ...)` AVANT de lancer — confirme 0 crédit pour la variante open.
3. Pour R2V (image de référence) : `upload_file(file_path: <chemin local>)` → renvoie une commande
   `curl PUT` à exécuter via Bash (pas d'upload direct par l'outil) → renvoie un `name` (ex.
   `abc123....jpg`) à réutiliser comme valeur du node `LoadImage`.
4. **Construire le graphe API à la main** (node-id → `{class_type, inputs}`, valeurs câblées EN DUR,
   PAS d'`input_overrides`) : `get_template(template_id, summary_only=false)` une fois pour récupérer
   la structure complète (nodes + links + `widgets_values` par défaut), puis reproduire chaque node
   en format API avec les vraies valeurs directement dans `inputs` — voir squelette de 20 nodes
   documenté § "CAUSE RACINE" plus bas (nodes 92/115/119-139, hors `MarkdownNote` non connectés).
   Points de vigilance connus : (a) node 131 `ComfyMathExpression` attend l'input nommé `values.a`,
   PAS `a` (le message d'erreur serveur le confirme si oublié — rejeté proprement AVANT tout GPU,
   pas de gaspillage) ; (b) fixer `width`/`height` en INT littéraux directement sur le node 136
   (ex. `864`/`480`) plutôt que de piloter via un link vers `ResolutionSelector` (115) — sinon
   résolution incorrecte (640×640 observé) ; (c) `submit_workflow(dry_run: true)` d'abord (gratuit,
   0 GPU) pour valider la structure avant tout run réel.
5. **Ne PAS utiliser le prompt par défaut du template T2V** — buggé (mismatch de type INT/STRING sur
   le node `MiniMaxH3ImageToVideo`, erreur `return_type_mismatch`). Toujours écrire son propre texte
   dans le node prompt (138 pour R2V / 104 pour T2V).
6. Si le job dépasse la fenêtre inline (~25s, cas fréquent pour R2V/15s) : `wait_for_job(prompt_id)`
   en boucle jusqu'à `status: "succeeded"` (aucun sleep manuel — l'outil bloque ~25s par appel).
   **Toujours noter le `prompt_id` retourné** (règle déjà en place plus bas dans ce fichier).
7. `get_output(prompt_id, client_os, inline_urls: true)` → URL signée temporaire (Google Cloud
   Storage, ~6h) + commande curl prête à l'emploi. Télécharger avec `curl -sL`, **puis TOUJOURS
   vérifier le contenu réel par extraction de frames (`ffmpeg -vf select=...`) avant de considérer
   le clip valide** — un statut "succeeded" ne garantit PAS que le contenu correspond au prompt
   envoyé (leçon du 2026-08-11). Puis upload `scripts/tools/upload-to-blob.py` pour partager avec
   Aziz (règle upload standard du projet).

**Si `run_template`+`input_overrides` doit être retenté malgré tout** (ex. pour T2V ou I2V, non
testés avec la méthode graphe-à-la-main) : surveiller spécifiquement le warning
`conversion_warning: "N extra widget values not mapped"` — s'il apparaît sur un node qui porte une
valeur importante (image, prompt), ne PAS faire confiance au statut "succeeded" et vérifier le
contenu réel avant tout usage, ou basculer immédiatement sur `submit_workflow`.

### Node IDs du template R2V (`video_minimax_h3_r2v`) — pour `input_overrides`
- **137** : `LoadImage`, champ `image` = le `name` retourné par `upload_file` (1re référence)
- **138** : `PrimitiveStringMultiline`, champ `value` = le prompt (référencer l'image par
  `<Picture 1>` dans le texte — la doc du template le confirme, ordre de connexion = ordre des tags)
- **132** : `PrimitiveFloat`, champ `value` = durée en secondes (voir limite d'arrondi ci-dessous)
- **139** : 2e slot `LoadImage` optionnel (ref_image_1) — **⚠️ contient par défaut une image de
  démo sans rapport** ("mecha_dragon_lightning.png" observé) ; si non utilisé, écraser ou ignorer
  mais noter comme facteur de confusion possible si le résultat dérive un peu du prompt.
  **⭐⭐ CONFIRMÉ FONCTIONNEL comme vraie 2e référence utile (2026-08-09)** : utilisé façon
  Seedance 2.0 Omni — image 1 (137) = personnage A + décor, image 2 (139) = personnage B inédit
  (généré séparément, même registre visuel), prompt qui les fait interagir (référencer les 2 comme
  `<Picture 1>`/`<Picture 2>`). Le 2e personnage, absent de l'image 137 de départ, apparaît et entre
  dans le cadre en respectant fidèlement son propre charsheet — plus seulement un slot à neutraliser.
- Template T2V (`video_minimax_h3_t2v`) : mêmes principes, node prompt = **104** (`prompt` input).

### Durée réelle vs durée demandée
H3 arrondit la durée à sa grille interne (multiples de 17 frames à 24fps, cf `ComfyMathExpression`
dans le JSON du template : `max(5, round(a*24)) + (5 - (max(5,round(a*24))%17))%17`). Observé :
demander `10` → obtenu `8.0s` ; demander `15` → obtenu `15.08s` (pile la borne haute annoncée du
modèle). **Ne pas viser une durée exacte, viser une fourchette** — 15s semble être le point
d'arrondi le plus fiable pour un "plein format".

### Résultat qualité — test Flowdesk panel1 (15s, image source `panel1-surcharge-source.png`)
Verdict Aziz (2026-08-08), séquence 5 beats d'action distincts sur 15s (tape → se frotte les yeux →
recul fatigué/soupir → mains sur le visage → reprend) : **« parfaitement tenu du début à la fin,
aucun morphing, aucun artefact bizarre, le dessin reste parfaitement juste »**. Points forts
observés :
- **Continuité de style totale sur 15s** (3x la durée testée en 2026-08-06 sur fal.ai) — pas de
  drift même après 8-10s, zone où beaucoup de modèles vidéo décrochent.
- **Compréhension physique implicite** : quand le personnage s'appuie en arrière, la chaise bouge
  avec son poids — cohérence physique non scriptée explicitement dans le prompt.
- **Mains à 5 doigts sans artefact**, y compris en contact avec le visage (zone classiquement
  fragile pour la génération vidéo IA).
- Seul point faible : **le SFX généré ne convient pas** (bruit de barrière/pas jugé "bizarre" sur un
  autre test le même jour, NoteShield). ⭐ Parade déjà identifiée : le mix descend de toute façon la
  vidéo générée avec le son coupé et remplace par nos propres SFX/narration — non bloquant.

### R2V validé aussi sur NoteShield (2026-08-08)
Image source `src/projects/_client-sim/noteshield/refs/p1-couloir-file.jpg` (foule stick-figure
devant barrière), consigne "la foule marche calmement au lieu de courir" → résultat conforme,
style maintenu, mouvement cohérent. Confirme que R2V respecte fidèlement des consignes de
**changement de comportement** par rapport à une vidéo de référence existante (pas seulement
anime une image statique).

### ⭐⭐ R2V validé sur le cas "réputé difficile" : PecheurSurpeche16x9 (2026-08-08)
Test ciblé sur la scène jugée la plus exigeante à ce jour (bateau + geste répétitif de lancer de
filet + action fine main→panier), après un échec Seedance antérieur sur la même scène (cf commentaire
code `PecheurSurpeche16x9.tsx` ligne 224-227, frame de référence prévue précisément pour ce test).
Image source : frame Remotion rendue via `npx remotion still RND-PecheurSurpeche16x9 --frame=N`.

**Verdict Aziz — concluant, malgré 3 défauts mineurs identifiés :**
- ✅ Style (ink/hachures) tenu du début à la fin, cohérence globale de la scène.
- ✅ Geste de lancer du filet crédible, poissons récupérés du filet, **déposés dans le panier de
  façon visible** (un objet ajouté au panier après le geste) — c'était le point le plus incertain
  du test (action fine, petit objet, cible précise).
- ✅ Le bateau prend un léger mouvement de tangage haut/bas (non demandé explicitement dans le
  prompt, mais cohérent/bienvenu — hypothèse : dérivé implicitement de "boat gently rocking" dans
  le prompt testé, à vérifier si reproductible sans cette clause).
- ⚠️ Petits morphings localisés à deux moments : quand la main sort le poisson du filet, et quand
  la tête tourne vers le panier. Jugé par Aziz comme un défaut **récurrent tous générateurs
  vidéo confondus** sur ce style de dessin précis (hypothèse : pas spécifique à H3, plutôt une
  limite générale sur les mains/rotations fines en style ink/SVG-like) — pas un rejet de H3.

**⭐⭐⭐ Découverte comportementale clé — H3 est LITTÉRAL, il ne corrige pas les défauts de l'image
source :**
- Sur l'image de référence utilisée, les pieds du personnage flottent légèrement au-dessus du
  bateau (défaut de positionnement du rig SVG d'origine, pas du contact sol parfaitement calé) —
  **H3 a reproduit fidèlement ce décalage plutôt que de le corriger**. Comportement observé
  cohérent avec le reste de la scène : fond figé (soleil, nuages, océan restent quasi-statiques,
  seule une fine ligne d'eau bouge) — **H3 anime précisément ce que le prompt décrit et laisse le
  reste de l'image tel quel**, plutôt que d'improviser du mouvement ambiant non demandé.
- **Implication directe pour la prod** : soigner la précision géométrique de l'image de référence
  AVANT l'appel H3 (contact pieds/sol, alignement objets) — ne pas compter sur le modèle pour
  "corriger au passage" un défaut de positionnement SVG. Hypothèse d'Aziz (non testée) : un modèle
  comme Seedance pourrait corriger ce genre de défaut automatiquement — à vérifier si comparaison
  utile un jour, mais pas prioritaire vu le résultat global H3 déjà jugé concluant.

**⚠️ Gotcha méthode (pas H3, erreur de sélection de frame)** : la frame de référence choisie pour ce
test était en plein milieu d'un cycle narratif (après le 1er lancer de filet dans la composition
Remotion d'origine, `cast1WindUp=60` → frame choisie 220 → `cast1Hold=260`), donc l'image contenait
déjà 3 poissons visibles dans l'eau et les éclaboussures du 1er lancer AVANT même le lancer généré
par H3. Résultat : la vidéo générée semble démarrer avec "des poissons déjà là avant le lancer" —
ce n'est pas un artefact H3, c'est un choix de frame de référence imprécis. **Pour un test propre
"scène qui démarre de zéro" : choisir une frame AVANT le début du geste (`frame < T.cast1WindUp`,
donc < 60), jamais une frame en plein cycle narratif.**

### ⭐⭐ Ombre générique de charsheet Gemini → défaut d'ombre parasite en vidéo (généralisable, 2026-08-09)

Confirme et généralise la découverte "H3 est littéral" ci-dessus sur un nouveau cas : une **ombre
elliptique générique** apparaissait sous les pieds d'un personnage dans un clip R2V. Root cause tracée
jusqu'à **l'image source, pas au moteur vidéo** — Gemini génère systématiquement, sur un charsheet
multi-pose, une ombre de type "character sheet" (ellipse plate sous chaque pose, artefact de mise en
page du charsheet plutôt qu'une vraie ombre portée cohérente avec une scène) — H3 se contente de
reproduire fidèlement cette ombre plutôt que de la corriger ou de l'adapter à la scène cible.

**Confirmé sur 2 personnages différents** (même test), donc pas un cas isolé — pattern probable sur
tout charsheet Gemini multi-pose utilisé comme référence R2V.

**Fix qui marche** : edit chirurgical Gemini (formule R-EDIT-CHIRURGICAL-PRESERVE-FIRST, déjà validée
ailleurs sur ce projet pour le fix dot-eyes) pour retirer l'ombre du charsheet **avant** tout usage en
R2V. Confirmé fonctionnel sur les 2 personnages testés. **Script générique déjà existant pour ça**
(pas besoin d'en écrire un one-off à chaque fois, erreur faite cette session) :
`scripts/tools/gemini-i2i.py --ref CHARSHEET.png --prompt "CHANGE ONLY: ... PRESERVE EXACTLY: ..." --output OUT.png`.

**Règle générale à en tirer** : avant d'utiliser un charsheet Gemini comme référence H3/vidéo, vérifier
visuellement (zoom sur les pieds/base de chaque pose) si une ombre elliptique générique de mise en page
est présente — et la retirer en amont plutôt que d'espérer que le moteur vidéo la corrige ou la
"comprenne" comme non désirée. Cohérent avec le principe déjà documenté : H3 anime fidèlement ce qui
est dans l'image, y compris ses défauts.

---


> ⚠️ **Note de re-classement (2026-08-14)** : les 2 sections ci-dessous ont été écrites le 2026-08-13
> dans l'ancien fichier `minimax.md` (avant sa scission le même jour), mais routées par erreur dans
> `minimax-music-tts.md` lors de la scission automatique — déplacées ici le 2026-08-14, contenu
> inchangé. C'est le bon foyer (mécanique H3/tests réels), pas le fichier TTS/Music.
>
> ⚠️ **Le test charsheet ci-dessous n'implique pas de génération vidéo H3** (uniquement des images
> Gemini i2i) donc n'est pas concerné par la correction de format de prompt notée dans
> `minimax-h3-styles-tests.md` (§ "FORMAT DE PROMPT OFFICIEL", format 6-sections déprécié pour les
> PROMPTS VIDÉO H3) — mais le TEST H3 3-références de la scène "Le Vol" (baleine, Canada Red Bay,
> documenté dans `memory/projects/STYLEVOX-MINIMAX-TESTS.md`) utilisait bien ce format 6-sections
> maintenant déprécié pour son prompt vidéo. Le diagnostic de cause racine de cet échec (staging spatial
> sans position/échelle explicite) reste valide indépendamment du format — mais un futur retest de
> cette scène devrait aussi adopter le nouveau format officiel documenté dans `minimax-h3-styles-tests.md`
> plutôt que de reproduire le format 6-sections.

---

### ⭐⭐⭐ TEST RÉEL — charsheet 6-vues grille 3×2 (Mariama Bâ, 2026-08-13) — 4 nouvelles vues réussies, layout/labels échoués

Suite exploration repo communautaire `OSideMedia/higgsfield-ai-prompt-skill` (méthode "Soul ID" :
charsheet en grille 3×2, 6 panneaux, 1 seul appel — ordre documenté : face, 3/4, dos, buste, mains,
gros-plan visage). Notre charsheet Mariama Bâ existante (`mariama-ba-charsheet-CANONICAL.png`) n'a que
3 vues (face, 3/4, profil), aucune vue de dos ni gros-plan dédié mains/visage — écart identifié avant
de tester.

**Protocole** : i2i Gemini 3.1 Flash Image, référence = `mariama-ba-charsheet-CANONICAL.png`, prompt
demandant explicitement une grille 3×2 (3 vues déjà connues à reproduire + 3 nouvelles : dos, buste,
gros-plan visage+mains combinés) avec consigne stricte "NO text, no labels" et layout figé. Fichiers :
`memory/episodes/_rnd/canada-red-bay/tests-visuels/mariama-ba-charsheet-6vues-v1.{png,prompt.txt}`.

**Résultat réel (corrigé après double lecture avec Aziz — mon 1er jugement visuel était FAUX, cf leçon
déjà documentée plus haut dans ce fichier § Test 3 "vérifier avant d'affirmer")** :
- ❌ **Layout grille 3×2 stricte NON respectée** : le modèle a produit 7 zones (3 figures pleine
  hauteur + 4 vignettes), pas 6 panneaux uniformes — et a généré du TEXTE/labels malgré la consigne
  explicite de ne pas en mettre.
- ❌ **Les 3 labels sur les figures pleine hauteur sont FAUX** : "BACK VIEW"/"CLOSE-UP COMBINED" collés
  sur des poses qui sont en réalité 3/4-face / 3/4 / profil (quasi-identiques à la charsheet
  CANONICAL d'origine) — mauvais mapping label↔image, pas un échec de génération de pose.
- ✅✅✅ **Les 4 VRAIES nouvelles vignettes (à droite, correctement nommées) ont TOUTES réussi** :
  - **Back view** : vraie vue de dos cohérente — motif géométrique du turban vu de derrière (enroulement
    différent de face), dos du boubou sans les mains visibles (cohérent, elles sont devant). Pas une
    répétition de face.
  - **Medium shot / bust** : buste 3/4 cohérent avec le personnage, détail du col/épaules.
  - **Close-up of the face** : dot-eyes bien préservés, proportions fidèles, agrandi lisible.
  - **Close-up of the hands and book** : mains crédibles tenant le livre fermé, style cohérent —
    jugé par Aziz comme "encore mieux" que juste les mains seules (le contexte du buste ajoute de la
    lisibilité plutôt que de nuire).

**Leçon méthode (déjà documentée, reconfirmée)** : mon évaluation initiale a comparé à tort le "dos"
holistiquement aux 3 figures pleine hauteur au lieu d'isoler CHAQUE vignette individuellement — Aziz a
corrigé en re-décrivant précisément quelle zone correspond à quelle vue. Toujours faire confirmer la
lecture d'une image complexe/multi-panneaux avant de livrer un verdict tranché, surtout quand le layout
généré diverge du layout demandé (ici : la grille stricte 3×2 n'a jamais été obtenue, seulement un
résultat approximatif en 2 zones — colonne "poses connues" + colonne "poses nouvelles").

**Ce qui est exploitable immédiatement** : les 4 nouvelles vignettes sont chacune de qualité suffisante
pour être extraites/recadrées et ajoutées au dossier de références du personnage (dos, buste, gros-plan
visage, gros-plan mains) — combleraient exactement le manque identifié (mains et dos = points de
défaillance H3 récurrents documentés plus haut dans ce fichier, ex. Test causalité barre/mains Sonjata).

**Piste NON tranchée pour une v2** : fournir une image de layout de référence dédiée (comme le faisait
le prompt `mariama-ba-charsheet-v3.prompt.txt` original, qui avait un 3e ref `LAYOUT` séparé) pourrait
corriger le non-respect de la grille stricte — cohérent avec le principe déjà documenté "référencer +
décrire plutôt que décrire seul" pour un contrôle de composition précis. Pas testé ici, priorité
laissée à Aziz.

### ⭐⭐⭐ COMPARATIF 1-appel vs 2-appels pour charsheet 7-vues — 1 SEUL APPEL GAGNE (2026-08-13)

Suite au test charsheet 6/7-vues Mariama Bâ ci-dessus (2 appels : charsheet 3-vues existante étendue
par edit i2i à 7 vues, layout/labels ratés puis corrigés par edit chirurgical), Aziz a challengé le
choix des 2 appels — hypothèse : Gemini peut probablement tout générer en un seul coup. Test comparatif
mené sur un personnage NEUF (griot fictif, même style GeoAfrique papercraft, pour comparaison propre
sans repartir d'une charsheet existante) : `test-charsheet-1appel-v1.png` /
`test-charsheet-1appel-v1.prompt.txt`.

**Résultat : 1 seul appel (text-to-image, tout décrit dès le départ — 7 vues + layout 2 rangées [3+4]
+ labels — dans le MÊME prompt) a produit un résultat PROPRE dès le premier coup** : 7 panneaux bien
encadrés, layout en 2 rangées cohérent, les 7 labels tous corrects, identité du personnage parfaitement
stable sur les 7 vues (robe, kufi, instrument, barbe identiques partout). Aucune correction nécessaire —
meilleur que le résultat 2-appels sur Mariama Bâ (qui avait raté labels + layout strict).

**Hypothèse explicative** : demander au modèle d'ÉTENDRE une image déjà existante (2e appel, i2i) est
une tâche plus ambiguë ("où mettre les nouveaux panneaux par rapport à ceux déjà là ?") que de décrire
TOUT le layout final dès le départ en un seul objectif cohérent (text-to-image). Pas vérifié
scientifiquement (1 seul essai de chaque côté), mais cohérent avec le principe déjà documenté ailleurs
dans ce fichier (prompt qui décrit tout explicitement > prompt qui laisse le modèle deviner/combler).

**⛔⛔ RÈGLE PAR DÉFAUT pour toute NOUVELLE charsheet de personnage (2026-08-13)** : générer les 7 vues
(3 poses classiques + 4 vues Soul ID : dos/buste/gros-plan visage/gros-plan mains) en **UN SEUL appel
text-to-image**, prompt qui décrit explicitement le layout (2 rangées : 3 grandes vues en haut, 4
panneaux détail en bas), les 7 labels exacts, et la cohérence de personnage à travers toutes les vues.
Gabarit réutilisable : voir structure de `test-charsheet-1appel-v1.prompt.txt` (adapter costume/traits
au personnage, garder la structure de layout + liste des 7 vues identique).

**Exception où 2 appels reste justifié** : si une charsheet EXISTANTE et déjà validée doit être
préservée/étendue sans repartir de zéro (cas de Mariama Bâ ici — charsheet CANONICAL déjà en usage
dans des productions, ne pas la regénérer au risque de dériver le personnage) — dans ce cas, l'edit i2i
en 2e appel reste la bonne méthode, mais s'attendre à devoir corriger labels/layout par edit chirurgical
en 3e appel si besoin (méthode CHANGE-ONLY-PRESERVE-EXACTLY déjà validée ailleurs dans ce fichier).

## ⛔⛔⭐⭐⭐ H3 GENERE DE LA PAROLE NON DEMANDEE → BOUCHE ANIMEE (mesure 2026-08-18)

**Symptome** (repere par Aziz au visionnage, invisible sur frames extraites) : sur un plan ou le
personnage devait juste lever les yeux et souffler, **il ouvre clairement la bouche pour dire quelque
chose**. Lu a raison comme « un dialogue a ete coupe ».

**Cause mesuree** : H3 est un modele AUDIO-VIDEO. Sans consigne explicite sur le son, il **invente une
bande-son parlee** et anime la bouche pour la justifier. Piste audio du clip mesuree :
| clip | mean_volume | lecture |
|---|---|---|
| clip1 (souffle/poussiere) | **-58,1 dB** | quasi silence |
| clip3 (leve les yeux) | **-39,8 dB** | **parole generee** (+18 dB) |

⛔ **Retirer l'audio au montage (`-an`) NE CORRIGE PAS le probleme** — la piste son disparait, mais
**l'animation labiale reste**. Le defaut est dans l'image, pas dans le son.

**Fix a appliquer dans TOUT prompt H3 sans dialogue voulu** (le negatif seul `no mouth opening` n'a PAS
suffi — il etait deja present dans le prompt fautif) :
```
AUDIO: no speech, no dialogue, no voice, no talking. The character never speaks.
His lips stay closed and still for the entire clip — no lip movement, no mouth opening,
no jaw movement, no visible breathing through the mouth.
```
+ dans STRICT NEGATIVE : `no speech, no dialogue, no lip sync, no talking, no mouth movement`
→ Verifier apres coup avec `ffmpeg -i clip.mp4 -af volumedetect -f null /dev/null` : au-dessus de
~-45 dB de moyenne sur un plan cense etre muet, il y a de la parole → la bouche bouge, regenerer.

⚠️ **Corollaire methode** : ce defaut ne se voit PAS sur des frames extraites (une bouche entrouverte
sur 1 frame passe pour une expression). Il se voit en LECTURE, et s'entend a la mesure. Encore un cas
de [[animation-vs-image-fixe-mesurer-frames-uniques]] : mesurer, ne pas juger sur frames seules.

## ⭐⭐⭐⭐ PREVIS — PILOTER LA CAMERA H3 PAR UNE VIDEO DE REFERENCE (VALIDE 2026-08-18)

**Ce que ca debloque** : nos clips H3 etaient TOUS en camera fixe (on decrivait le mouvement en mots,
H3 l'ignorait). Avec un previs, on **MONTRE** la trajectoire au lieu de la decrire. C'est la methode
d'Animistry (previs Blender → Seedance), reproduite chez nous a cout nul.

**RESULTAT MESURE — ecart premiere/derniere frame** :
| clip | ecart | lecture |
|---|---|---|
| clip1 camera fixe | **0,68**/255 (0,3 %) | rien ne bouge |
| clip3 camera fixe | 2,15/255 (0,8 %) | rien ne bouge |
| previs source (verite terrain) | 16,93/255 (6,6 %) | push-in demande |
| **clip guide par previs** | **38,55/255 (15,1 %)** | **push-in execute** |
→ **57× plus de mouvement de camera qu'un clip fixe.** Verifie visuellement : le sujet grossit
progressivement, la camera se recentre, style 100 % preserve (aucun bloc de couleur du previs).

**⛔⛔ 2 GOTCHAS BLOQUANTS (chacun a coute un essai)** :
1. **`upload_file` REFUSE les .mp4** (images seules : jpg/png/webp/gif). **Fix : encoder le previs en
   GIF anime** (`ffmpeg -i previs.mp4 -vf "fps=24,scale=W:H" previs.gif`) → accepte, et `LoadImage`
   le lit comme une SEQUENCE de frames. `LoadVideo` ne sert a rien ici : son `file` est un COMBO ferme
   sur les mp4 deja presents cote serveur, on ne peut pas y injecter un fichier.
2. **`ref_videos.ref_video_0` attend un `IMAGE`, PAS un `VIDEO`** (tooltip : *"Reference video frames
   at 24 fps (2-15s)"*). Brancher un `CreateVideo` dessus → **erreur 400 `return_type_mismatch`**.
   ✅ Brancher `LoadImage` (le GIF) DIRECTEMENT sur `ref_videos.ref_video_0`.

**Recette complete** :
```python
g["140"] = {"class_type":"LoadImage","inputs":{"image":"<previs.gif uploade>"}}
g["136"]["inputs"]["ref_videos.ref_video_0"] = ["140", 0]   # PAS de CreateVideo entre les deux
```
+ dans le prompt, separer explicitement les deux roles :
```
<Picture 1> defines the ART STYLE, the character and the room.
<Video 1> is a rough grey-box PREVIS carrying NO style information. Use it ONLY as the CAMERA
BLUEPRINT: reproduce its camera movement, framing evolution and timing exactly.
[+ mapper les blocs : "the blue block is the scribe, the brown block is the table..."]
STYLE LOCK: the look comes ONLY from <Picture 1>. NEVER adopt the grey-box look of <Video 1>.
STRICT NEGATIVE: no grey boxes, no colored placeholder blocks, no flat geometric shapes
```

**Fabriquer le previs** : geometrie plate color-codee, 1 couleur par role, anime par interpolation
deterministe (easeInOutCubic), MEME longueur que le clip cible (124 frames = 5,167 s). Script reutilisable :
`scratchpad/scribe-test/mkprevis.py`. Le previs doit etre LAID — il ne porte que la camera.
Livrables : previs https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/scribe-tombouctou/previs-TAnxaCOLLiMGZAMV8FPutUyWQZ2KHj.mp4
· resultat https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/scribe-tombouctou/clip-previs-fCLXCd8WApSQwL2z9FHMortwNBT2Lp.mp4

### ⛔⛔ LIMITE DU PREVIS — l'ORBITE 180 fait DECROCHER le modele (teste 2026-08-18)

3 mouvements testes avec la meme recette previs. **2 reussites, 1 echec net** :
| mouvement | amplitude (ecart 1re/derniere frame) | verdict |
|---|---|---|
| push-in large | 38,55/255 | ✅ |
| push-in **serre** (zoom 1.00→1.75) | 43,19/255 | ✅ passe du plan large au plan rapproche |
| travelling lateral | 45,52/255 | ✅ parallaxe correcte (jarres avant-plan plus rapides que le mur) |
| **orbite 180°** | 47,80/255 | ⛔⛔ **ECHEC** |

**Ce qui rate sur l'orbite** : ~2 s correctes, puis H3 **copie litteralement le previs** — blocs bleus,
rectangle brun, aplats noirs remplacent l'illustration. STYLE LOCK + negatifs (`no grey boxes, no
colored placeholder blocks, no black empty areas`) **n'ont PAS suffi**.

**Cause racine** : push-in et travelling ne demandent qu'un RE-CADRAGE d'information DEJA presente dans
`<Picture 1>`. Une orbite exige d'INVENTER des faces cachees (profil, dos du personnage, murs
hors-champ) a partir d'une illustration 2D plate. Sans cette matiere, le modele se rabat sur la seule
source qui montre ces angles : le previs lui-meme.

⭐ **Regle generale** : le previs pilote un **RE-CADRAGE** (push-in, pull-back, travelling, panoramique,
tilt), **jamais un changement de POINT DE VUE 3D**. Pour changer d'angle sur un sujet : generer une
NOUVELLE image sous le bon angle et COUPER (le raccord par changement d'echelle, deja valide, le cache).

⚠️ **Piege de mesure** : l'orbite a la PLUS FORTE amplitude (47,80) et c'est l'echec. L'amplitude mesure
le changement, pas la qualite — toujours regarder les frames avant de conclure.

Rendus : push serre https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/scribe-tombouctou/cam-push-kWBniGpl5qGOULxQHOhGBG5gjcXEUu.mp4
· lateral https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/scribe-tombouctou/cam-lat-Zbr4gPc90X9Z8RdirWaSnSwttuha7G.mp4
· orbite (echec) https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/scribe-tombouctou/cam-orbit-DLIxi9QxaOj7zbsmgM9EqtVNOIw92m.mp4

### ⚠️⚠️ CORRECTION (2e passe, meme jour) — l'orbite n'est PAS impossible, c'est un DECROCHAGE DE STYLE

⛔ **La conclusion de la section precedente ("previs = re-cadrage, jamais changement de point de vue")
etait TROP CATEGORIQUE.** Repere par Aziz : sur l'orbite v1, les 2 premieres secondes sont bonnes — le
decor pivote, la lumiere se deplace, le style tient. Le modele SAIT faire le mouvement.

**Cause reelle mesuree** : le previs v1 laissait **17-19 % de zones VIDES** (fond noir) quand la camera
sortait du decor — sauf a la frame du milieu (0 %). Push-in et travelling : **0 % sur toutes les frames**.
Face a une zone vide, le modele se raccroche a la seule chose visible dans la reference : ses blocs.

**Fix applique (previs v3)** : decor **CYLINDRIQUE 360** (le mur fait le tour, la camera ne peut pas
"sortir"), verifie **0,00 % de vide sur toutes les frames**. Script : `mkprevis3.py`.

**Resultat : le decrochage se DEPLACE mais ne disparait pas.** Gradient par frame (illustration saine
≈ 11-14, aplat previs ≈ 3-4) :
| clip | f5 | f40 | f80 | f118 |
|---|---|---|---|---|
| orbite v1 (previs troue) | 11,2 | 10,6 | **3,8** | **3,4** |
| orbite v3 (previs plein) | **4,0** | **3,7** | 11,9 | 11,0 |
| **crane-up v3** | **2,8** | 10,6 | **14,2** | **14,2** |

⭐ **Le CRANE-UP est un vrai succes** : apres ~1 s ratee, plongee 3/4 magnifique sur le scribe, sol +
natte + table reveles comme demande, gradient 14,2 (plus riche que l'image source). **4 s exploitables
sur 5** — utilisable en production en coupant la premiere seconde.

**Ce qui aide (applique en v3)** : previs sans aucune zone vide · qualifier `<Video 1>` de *"CAMERA PATH
DIAGRAM, not an image to imitate"* · *"if the camera reveals something not in `<Picture 1>`, INVENT it
in the same drawn style"*.
**Pistes non testees** : previs en NIVEAUX DE GRIS (retirer les couleurs saturees qui appellent la
copie) · previs texture au lieu d'aplats · 2 clips de 2,5 s · garder la portion reussie et couper.

Rendus : orbite v3 https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/scribe-tombouctou/orbit-v3-Y8oSTvsDiKMf4NbDReVvazspdcMh6N.mp4
· **crane-up** https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/rnd/scribe-tombouctou/crane-v3-lcHwLRQFdEU1rSKmpuxt2uj8VZ7dQ3.mp4


## 📎 ANNEXE — récit de mise au point du PREVIS (déversé de FICHE-CLIP-GENERE, 2026-08-19)

> Sorti de la fiche injectée pour la garder actionnable. Ici : le détail du débogage, utile pour comprendre
> POURQUOI les réglages par défaut sont ce qu'ils sont. La fiche garde la recette, cette annexe garde l'histoire.

## ⛔ H3 NE SUIT PAS LE *RYTHME* DU PREVIS, seulement sa direction

Test duo 10 s (push-in 0-5 s PUIS latéral 5-10 s). **Progression du mouvement mesurée** :
| | 10 % | 25 % | 50 % | 75 % | 100 % |
|---|---|---|---|---|---|
| previs demandé | 1 % | 25 % | 51 % | 114 % | 100 % |
| **H3 produit** | **37 %** | **75 %** | **89 %** | 92 % | 100 % |

H3 a **précipité 75 % du mouvement dans le premier quart**, puis n'avait plus rien à faire — d'où la
2e phase (latéral) quasi absente. Le clip reste beau (plan continu 10 s, style parfait), mais
**l'enchaînement de 2 mouvements n'est PAS acquis**.

**Pistes non testées** : (a) marqueur visuel de phase dans le previs (un repère qui change à la
bascule), (b) contraste plus franc entre les 2 mouvements (vraie sortie latérale, pas un glissement),
(c) prompt avec timecodes explicites `0-4s / 4-10s`, (d) 2 clips séparés raccordés — solution de repli
toujours disponible.

## ⭐⭐⭐⭐ PREVIS D'ACTION — piloter le GESTE, pas seulement la caméra (validé 2026-08-19)

**Le même mécanisme que le previs de caméra fonctionne pour l'ACTION du personnage.** Previs gris,
caméra volontairement FIXE : tout ce qui bouge à l'écran vient alors du geste.

**Mesure** (bords = décor : si ça bouge, la caméra a bougé · centre = le sujet) :
| test | bords (caméra) | centre (geste) | gradient |
|---|---|---|---|
| se lever puis se rasseoir | **0,58** | **9,59** | 11,8 / 11,8 / 11,7 |
| tendre le bras vers un objet | **1,13** | **6,88** | 11,7 / 11,9 / 11,7 |
→ caméra immobile + geste exécuté + style parfaitement tenu.

**Résultat visuel** : le scribe assis se lève **entièrement debout**, marque un temps, se rassoit. Le
modèle a **INVENTÉ son corps debout** (robe complète, ceinture, jambes) qui n'existait nulle part dans
l'image source. Le geste bras : le bras se tend vers la droite, atteint l'objet, revient.

⭐⭐ **Portée** : notre mémoire documente que « attraper un objet » est un **échec systématique en prompt
texte**, même avec 5 étapes détaillées (cf `minimax-h3-styles-tests.md` § pluie de pièces — le modèle
saute à l'état final, main déjà fermée). **Le MONTRER contourne cette limite.**
⛔ Ne pas confondre avec les règles Seedance 83/86 (« reference-to-video = échec ») : elles concernent
SEEDANCE. H3 exploite bien `ref_videos` — c'est tout l'objet de cette fiche.

**Recette identique au previs caméra** : gris pur, 0 % de vide, `<Video 1>` qualifié de *« GREYSCALE

### ⚠️ DÉFAUT RESTANT SUR L'ORBITE — la caméra TRAVERSE LE MUR (à corriger, session future)

**Repéré par Aziz** au visionnage, **confirmé par mesure** : sur l'orbite gris, le contraste de la zone
du sujet chute à **14,4 à t=2,5 s** (contre 37-42 sur tout le reste du clip) — le scribe **disparaît
derrière un mur qui passe devant la caméra**, puis réapparaît. Un seul point de rupture, au milieu.

**Cause** : notre previs cylindrique place la caméra à l'INTÉRIEUR d'un tube de murs. Quand elle tourne,
elle finit par passer *au travers* d'un pan de mur au lieu de rester dans le volume de la pièce. H3
traduit fidèlement ce qu'on lui montre — le défaut est dans le PREVIS, pas dans le modèle.

**Ce qui doit rester vrai** (règle de mise en scène, pas de technique) : dans une orbite, le sujet
**ne sort JAMAIS du champ** et rien ne passe entre lui et la caméra. La caméra tourne autour de lui en
restant dans le même volume.

**Pistes de correction (non testées)** : (a) previs avec un mur seulement sur ~270° et une ouverture
côté caméra, (b) rayon d'orbite plus court que la distance aux murs, (c) orbite partielle (90-120°) au
lieu de 180°, (d) clause de prompt explicite : *"the scribe remains fully visible at all times, nothing
ever passes between the camera and him, the camera never goes through a wall"*.

⭐ **À noter malgré ce défaut** : l'animation du personnage CONTINUE pendant toute l'orbite (il écrit,
il vit) et reste cohérente au retour — le modèle ne fige pas le sujet pour gérer le mouvement de caméra.
C'est ce qui rend l'orbite exploitable une fois le previs corrigé.

