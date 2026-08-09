# Minimax — Guide complet (Music + TTS + H3 image-to-video)

> Mise a jour : 2026-05-24 (Music/TTS) + 2026-08-06 (H3 API fal.ai) + 2026-08-08 (H3 open-weight via Comfy Cloud MCP) + 2026-08-09 (multi-référence + horizontal confirmés, vitesse/résolution, storyboard ouvert)
> Endpoint musique : `fal-ai/minimax-music/v2.6`
> Endpoint TTS : `fal-ai/minimax/speech-2.8-hd` (validé 2026-05-24)
> **Note** : consulter ce fichier AVANT tout appel Minimax

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
> qu'aucun endpoint `get_usage_report` ne renvoie directement une durée GPU exploitable (vérifié
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

### Setup (déjà fait sur ce repo, one-time)
```
claude plugin marketplace add Comfy-Org/comfy-skills
claude plugin install comfy-cloud@comfy-skills
/mcp   # sélectionner comfy-cloud → Authenticate (flow OAuth navigateur)
```
Auth OAuth par session Claude Code (pas de clé API statique dans `.mcp.json` — tenté puis abandonné,
le serveur MCP exige OAuth, voir `auth_state` via `get_server_info`). Après authentification, 39
outils MCP disponibles (`mcp__claude_ai_Comfy_Cloud_MCP__*` ou nom équivalent selon la session).

### Workflow validé (T2V et R2V)
1. `search_templates(q: "MiniMax H3")` → 2 familles par tâche : `video_minimax_h3_*` (open-weight,
   **0 crédit**) vs `api_minimax_h3_*` (repasse par l'API MiniMax hébergée, ~136 crédits/génération
   sur le forfait mensuel — réservé au 2K/Context-IR non open). **Toujours choisir la variante SANS
   préfixe `api_`** pour l'usage gratuit.
2. `estimate_credits(template_name: ...)` AVANT de lancer — confirme 0 crédit pour la variante open.
3. Pour R2V (image de référence) : `upload_file(file_path: <chemin local>)` → renvoie une commande
   `curl PUT` à exécuter via Bash (pas d'upload direct par l'outil) → renvoie un `name` (ex.
   `abc123....jpg`) à réutiliser comme valeur du node `LoadImage`.
4. `run_template(name, input_overrides, wait_for_output: true, client_os: "darwin")`. **Ne PAS
   utiliser le prompt par défaut du template T2V** — buggé (mismatch de type INT/STRING sur le node
   `MiniMaxH3ImageToVideo`, erreur `return_type_mismatch`). Toujours override le node prompt avec son
   propre texte.
5. Si le job dépasse la fenêtre inline (~25s, cas fréquent pour R2V/15s) : `wait_for_job(prompt_id)`
   en boucle jusqu'à `status: "succeeded"` (aucun sleep manuel — l'outil bloque ~25s par appel).
6. `get_output(prompt_id, client_os, inline_urls: true)` → URL signée temporaire (Google Cloud
   Storage, ~6h) + commande curl prête à l'emploi. Télécharger avec `curl -sL`, puis upload
   `scripts/tools/upload-to-blob.py` pour partager avec Aziz (règle upload standard du projet).

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

## MiniMax H3 — image-to-video via API fal.ai (payant, validé 2026-08-06)

⚠️ Ne pas confondre avec Minimax Music/TTS ci-dessous — H3 est un modèle **vidéo**, sorti fin
juillet/début août 2026, testé pour la première fois sur le projet Flowdesk (_client-sim, registre
personne/émotion, panneaux "Chaos" et "Bascule" — voir `src/projects/_client-sim/flowdesk/`).
**Depuis le 2026-08-08, préférer la voie Comfy Cloud ci-dessus (même modèle, gratuit)** — garder
cette section pour le fallback si Comfy Cloud est indisponible, ou pour le tier 2K/Context-IR
non-open (variantes `api_minimax_h3_*` sur Comfy Cloud consomment aussi des crédits, donc revenir
ici reste équivalent en coût si le 2K est strictement nécessaire).

- **Endpoint** : `minimax/h3/image-to-video` (fal.ai)
- **Coût observé** : ~$1.30 pour 5s de vidéo en 2K
- **Usage validé** : anime une image statique (silhouette flat-design SVG-like) en gardant
  fidèlement le style d'origine — contrairement à Recraft qui ne produisait que des blocs SVG
  rigides non-animables par partie. Résout le blocage "personnage ne peut pas être animé via
  vectoriel" identifié dans une session antérieure.
- **⛔ Pas de lecture inversée native** (limitation Remotion ET navigateur, pas spécifique à H3) —
  pour un effet ping-pong (aller-retour en boucle), pré-générer la vidéo inversée via
  `ffmpeg -vf reverse` puis alterner/concaténer les deux fichiers en `<Sequence>` Remotion. Ne
  jamais tenter un `playbackRate` négatif au runtime, ça ne marche pas.
- Fichiers de référence dans le repo : `src/projects/_client-sim/flowdesk/videoPingPong.ts`
  (wrapper Remotion ping-pong) et `src/projects/_client-sim/flowdesk/test-minimax-h3/` (itérations
  de test v1→v9).
- **⭐ Personnage récurrent sur plusieurs plans : UNE SEULE image de référence, réutilisée comme
  input à chaque appel H3** — ne jamais régénérer une nouvelle image de référence par plan/scène
  pour le même personnage (risque de dérive visuelle, le personnage ne se ressemble plus d'un
  plan à l'autre). Tranché explicitement par Aziz sur NorthShield (2026-08-07, personnage Sarah
  sur 3 plans). H3 est *image-to-video* (pas un prompt texte pur comme Seedance) : l'image de
  référence doit être générée en amont (Gemini/Recraft) avant tout appel H3. Vaut aussi pour la
  voie Comfy Cloud ci-dessus (le paramètre R2V `ref_images` fonctionne identiquement).
- **⭐ Gotcha "objet mécanique sans articulation visible" (barrière, levier, interrupteur)** :
  détail complet + exemples avant/après dans `.claude/agent-memory/visual-producer/GOTCHAS-TOOLS.md`
  — en résumé, un verbe d'impact seul ("stops abruptly", "closes abruptly") produit un clip figé
  ou un simple changement de lumière, PAS de mouvement mécanique ; il faut comparer explicitement
  à un objet mécanique réel connu ("swinging down fast like a real parking-lot barrier arm") pour
  que H3 improvise une trajectoire physique cohérente.
- Choisi pour son coût (le moins cher testé pour ce registre personne/émotion à date) — pas
  verrouillé : tester d'autres générateurs vidéo (Seedance, etc.) si H3 échoue sur un cas donné.

## Minimax TTS — speech-2.8-hd (validé 2026-05-24)

```python
import fal_client, os
os.environ['FAL_KEY'] = '...'

result = fal_client.subscribe(
    'fal-ai/minimax/speech-2.8-hd',
    arguments={
        'text': 'Votre texte ici',
        'voice_id': 'French_Calm_Woman',  # voix FR neutre validée
        'speed': 1.0,
        'emotion': 'neutral'
    },
    with_logs=True
)
# result['audio']['url'] → MP3 téléchargeable
```

**Voix FR disponibles** : `French_Calm_Woman` (neutre, posée)
**Durée** : ~35s pour un script de 26s lu (débit naturel légèrement plus lent qu'ElevenLabs)
**Gotcha** : ne pas mettre de tags `[solemn]` etc. — Minimax TTS ne les interprète pas comme ElevenLabs

## Minimax Voice Clone — fal-ai/minimax/voice-clone

```python
result = fal_client.subscribe(
    'fal-ai/minimax/voice-clone',
    arguments={
        'audio_url': 'https://files.catbox.moe/ienj91.mp3',  # sample 30s narratrice
        'text': SCRIPT,
        'speed': 1.0
    }
)
# result['custom_voice_id'] → réutilisable pour appels suivants
# result['audio']['url'] → MP3 final
```

**Voix GéoAfrique clonée** :
- Sample source : `https://files.catbox.moe/ienj91.mp3` (30s depuis narration-v1-clean.mp3, offset 5s)
- custom_voice_id : `Voicebbc56c501780172741` (généré 2026-05-24 — peut expirer, recloner si besoin)
- Résultat validé accroche Sénégal Beat0

---

## Endpoint et payload

```python
import fal_client

result = fal_client.subscribe(
    "fal-ai/minimax-music/v2.6",
    arguments={
        "prompt": "Traditional Mande griot music from Mali, 13th century...",
        "is_instrumental": True,
    },
    with_logs=True,
)
```

**Parametres actifs** :
- `prompt` (string, 10-2000 chars) — description style/mood/genre
- `is_instrumental` (bool) — **TRUE pour musique de fond sans voix**
- `lyrics` (optionnel, 3500 chars max) — paroles avec tags `[Intro] [Verse] [Chorus]`
- `lyrics_optimizer` (optionnel, bool) — auto-generate paroles
- `audio_setting` (optionnel, objet) — format / bitrate

**Schema name** : `TextToMusic26Request`

---

## Gotchas critiques (validation 2026-04-22)

### 1. Bug historique `reference_audio_url`
L'endpoint `fal-ai/minimax-music` (sans version, ou v1.5) attend `reference_audio_url`. String vide = 422 au fetch. Jobs marques "COMPLETED" sans resultat telechargeable.
**Solution** : TOUJOURS utiliser `v2.6` explicite. Le champ `reference_audio_url` n'existe pas dans v2.6.

### 2. Conflit prompt "instrumental" + `is_instrumental`
NE PAS mettre le mot "instrumental" dans le prompt si `is_instrumental: true` est deja passe. Cause validation 422 (observe 2026-04-22 sonjata).

### 3. `duration_seconds` ignore
Le modele genere la duree qu'il veut (typiquement 2-9 minutes). Pas de controle direct.
**Solution** : trim avec ffmpeg `-t N` apres generation, ou laisser Remotion tronquer via `<Sequence durationInFrames>`.

---

## FORMULE PROMPT VALIDEE (validee 2026-04-12 + reconfirmee 2026-04-22)

Les prompts generiques produisent une sortie ELECTRONIQUE non-africaine. Le modele empile des synthes par defaut. Appliquer SYSTEMATIQUEMENT :

1. **Artiste specifique nomme** — ex: "Style of Toumani Diabate" pour kora Mande
2. **1-2 instruments principaux** — PAS 5 instruments empiles
3. **Rythme precis** — "gentle 6/8 rhythm", BPM explicite
4. **Texture organique** — "warm, acoustic, organic"
5. **Interdictions directes** — "No synthesizers, no electronic sounds" **OBLIGATOIRE**
6. **Origine culturelle precise** — "Traditional Mande griot music from Mali", PAS "West African"

### Prompts valides — Sénégal Pétrole & Gaz (2026-05-22)

Ton : documentaire analytique moderne, souveraineté africaine, tension géopolitique. PAS Mande médiéval.

**A — Ambient Souverain** (Ballaké Sissoko, kora + basse ambient, 72 BPM, 321s générée)
```
Modern African documentary score. Sparse kora melody over slow, deep ambient bass.
Style of Ballake Sissoko. Slow 4/4 rhythm, 72 BPM.
Warm, minimal, dignified, introspective. Tension underneath.
No synthesizers, no electronic beats, no orchestral strings, no chorus.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3`

**B — Kora + Percussions** (Toumani Diabate doc score, 68 BPM, 184s générée)
```
Contemporary African score blending traditional kora with slow deep percussion.
Style of Toumani Diabate meets a documentary film score.
Deep dundun bass rhythm at 68 BPM. Kora melody on top, meditative.
Sparse, serious, organic. No synthesizers, no hi-hats, no electronic elements.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-B-kora-percussion.mp3`

**C — Sabar Cinématique** (Youssou N'Dour film score, 75 BPM, 258s générée)
```
Slow cinematic Afrobeat documentary score from Senegal.
Sabar drum pattern at 75 BPM, acoustic bass, sparse guitar melody.
Style of Youssou N'Dour film score. Dignified, modern, grounded.
No synthesizers, no electronic elements, no vocals, no upbeat energy.
```
Fichier : `public/souverain/senegal-petrole-gaz/audio/music-C-sabar-cinematique.mp3`

Script dédié : `scripts/tools/minimax-senegal-music.py` — réutiliser comme template pour chaque nouvel épisode (changer `OUT_DIR` + `VARIANTS`).

---

### Prompts valides (Sonjata session 8, 2026-04-22)

**A — Griot intime (retenu)** — Toumani Diabate, solo kora + balafon
```
Traditional Mande griot music from Mali, 13th century empire era.
Solo kora with slow balafon accents. Style of Toumani Diabate.
Gentle 6/8 rhythm, acoustic, warm, organic, meditative.
No synthesizers, no electronic sounds, no drums except soft dundun.
```
Duree generee : 157s. Valide par Aziz : "rythmes contemplatif + percussions, mix parfait".

**B — Griot royal** — Sidiki Diabate, kora + djembe + dundun
```
Traditional Mande griot music from Mali. Solo kora with deep balafon
melody, joined by acoustic djembe and dundun drums in slow 6/8 rhythm.
Style of Sidiki Diabate. Building from contemplative to majestic.
Warm, acoustic, organic, royal. No synthesizers, no electronic sounds,
no orchestral strings.
```
Duree : 168s.

**C — Griot guerrier** — Neba Solo, djembe + dundun + balafon
```
Traditional Mande warrior music from Mali, 13th century. Acoustic
djembe and dundun drums in powerful 6/8 rhythm, joined by balafon
melody. Style of Neba Solo. Tense, earthy, tribal, triumphant.
No synthesizers, no electronic sounds, no modern instruments.
```
Duree : 520s (8:40) — imprevu, mais utile pour versions longues.

---

## ANTI-PATTERN (rejete, a ne PAS reproduire)

```
Epic West African orchestral, kora melody, djembe and dunun percussion,
balafon accents, majestic warm tones, building intensity from contemplative
to triumphant, cinematic, 95 BPM
```

**Pourquoi ca echoue** :
- "West African" trop generique (vs "Mande from Mali")
- 4+ instruments empiles (vs 1-2 nommes)
- Pas d'artiste de reference (Gemini improvise)
- Mots dangereux : "orchestral", "cinematic" poussent vers les synthes
- Pas d'interdiction "no synths"

Resultat observe 2026-04-22 : "accents electroniques tres pousses, pas africain ancien" (rejete par Aziz).

---

## Workflow production

### 3 variantes parallele (~$0.30, ~6min) — recette de reference
```bash
python3 scripts/tools/_archive/minimax-music-3variants.py
```
Genere A/B/C simultanees, telecharge, probe duree. (Script archive le 2026-06-19 :
recette one-shot par episode. Pour un nouvel episode, mieux vaut un `minimax-music.py`
parametrable plutot que dupliquer.) Upload en gallery Vercel :
```bash
python3 scripts/tools/upload-to-blob.py --gallery "Title" \
  sonjata-papercraft/audio/music/v2-A-*.mp3 ... \
  --folder sonjata-papercraft/music-review
```

### Temps d'attente typiques
- Submit : <1s
- Job complete : 2-4 minutes par job (Minimax est lent)
- Download : <5s
- Total 3 variantes parallele : ~6 minutes

---

## Cout et limites

- **$0.10 par generation** (estimation fal.ai)
- Max 1 appel a la fois recommande (pas de rate limit observe mais parallelisable)
- 3 variantes simultanees = $0.30, suffit pour comparaison A/B/C

---

## Mix audio (regle projet)

- **Volume musique** : 0.15 dans Remotion (= ~-16.5dB) — compatible regle "-18dB sous narration"
- **Fade-in** : 2s (60 frames @30fps)
- **Fade-out** : 2s avant fin composition
- Utiliser `<Audio volume={frame => ...}>` avec `interpolate` clamped

Voir src/projects/geoafrique-shorts/SonjataShortFull.tsx pour l'implementation reference.

### Mix ffmpeg POST-render (mid-form long, doc "sérieux") — 2026-07-21 (Soudan)
Quand la musique est mixée en ffmpeg SUR l'assemblage (pas via `<Audio>` Remotion), cas d'un mid-form long :
- **Niveau musique sous-narration** : cible **-12/-15 dB sous la voix** (docs "sérieux" Arte/BBC vont -18/-20).
  En volume ffmpeg linéaire ≈ **0.06-0.09** (choisi Soudan : 0.08 ; →0.06 si trop fort). Plus bas que le 0.15
  Remotion ci-dessus, cohérent (cas mix externe, voix reine).
- **Dompter les basses de la musique** : `bass=g=-7:f=200:w=0.6` — les graves masquent la voix davantage que les
  aigus, donc une kora/dundun riche en basse doit être atténuée dans le grave (garde la présence sans enterrer).
- **Boucle organique** (musique courte < vidéo) : crossfade triangulaire entre répétitions,
  `acrossfade=d=3:c1=tri:c2=tri` en chaîne (N copies), + fade-in 2s/out 3s. Zéro raccord audible.
- **amix** : `amix=inputs=N:duration=first:normalize=0` (normalize=0 sinon baisse tout). Vérifier `max_volume < 0 dB` après (pas de clipping).
- Scripts de référence : `scripts/tools/soudan-audio/` (minimax-music, sfx, mix).
- ⚠️ Prompt musique : les prompts "thriller/synth geopolitical" (ex. suggestion Gemini) produisent de l'électronique
  hors-charte Kora et Cartes → TOUJOURS revenir à la formule kora/percussion validée ci-dessus (rejet daté Soudan 2026-07-21).

---

## References

- Doc Context7 fal.ai : `/websites/fal_ai_models` query "minimax-music v2.6"
- Clip reference validation : `sonjata-papercraft/audio/music/v2-A-griot-intime.mp3`
- Integration Remotion : src/projects/geoafrique-shorts/SonjataShortFull.tsx
- Script 3 variantes (archive) : `scripts/tools/_archive/minimax-music-3variants.py`

---

# Minimax Speech 2.8 HD + Voice Clone — Guide TTS

> Validé 2026-05-19 (test session R&D sur voix GeoAfrique).
> Endpoints actifs : `fal-ai/minimax/voice-clone` + `fal-ai/minimax/speech-2.8-hd`
> **Verdict Aziz** : "Très bon, plus de punch que ElevenLabs sur certains passages. Ne remplace pas ElevenLabs, mais s'ajoute au stack."

## Quand utiliser Minimax TTS (vs ElevenLabs)

- **Comparaison A/B narration** : générer 1 version ElevenLabs + 2 versions Minimax (presets différents) pour le même script. Aziz choisit à l'oreille.
- **Narrations longues budget-sensible** : Minimax = $0.10 / 1000 chars vs ElevenLabs ~$0.30. Pour un script Atlas 8-15min (~10k chars), économie réelle.
- **Voix avec punch / énergie** : Aziz a noté que Minimax neutral/happy ont plus de "beats" qu'ElevenLabs équivalent.

## Workflow voice clone (one-shot)

```python
import fal_client

# 1. Upload privé (PAS catbox — narration interne projet)
audio_url = fal_client.upload_file("/path/to/sample-25s.mp3")

# 2. Clone
result = fal_client.subscribe(
    "fal-ai/minimax/voice-clone",
    arguments={
        "audio_url": audio_url,
        "noise_reduction": True,
        "need_volume_normalization": True,
        "model": "speech-02-hd",  # ← OK, le voice_id fonctionne aussi sur 2.8 HD
    },
)
custom_voice_id = result["custom_voice_id"]
```

**Specs sample source** :
- Durée : 20-30s suffit (≥10s requis). Trim ffmpeg depuis le milieu d'une narration propre.
- Mono 44.1kHz MP3 192kbps validé. WAV OK aussi.
- **Zéro musique, zéro SFX dans le sample** — voix seule.

**Coût** : $1.50 par clonage.

**Persistance** : voice_id expire après **7 jours sans usage TTS**. Pour pin : 1 appel TTS hebdo minimum, ou re-cloner.

## Workflow TTS (Speech 2.8 HD avec voix clonée)

```python
result = fal_client.subscribe(
    "fal-ai/minimax/speech-2.8-hd",
    arguments={
        "text": TEXT,
        "voice_setting": {
            "voice_id": custom_voice_id,
            "speed": 1.0,
            "vol": 1.0,
            "pitch": 0,
            "emotion": "neutral",  # voir presets validés ci-dessous
        },
        "audio_setting": {
            "sample_rate": 44100,   # INT, pas string
            "bitrate": 256000,      # INT, pas string
            "format": "mp3",
            "channel": 1,           # INT
        },
        "language_boost": "French",
        "output_format": "url",
    },
)
url = result["audio"]["url"]
```

**Coût** : $0.10 / 1000 chars (~$0.13 pour une narration 1m30, ~$1 pour 10min Atlas).

## Presets emotion validés (Aziz 2026-05-19)

7 valeurs enum : `neutral, happy, sad, angry, fearful, disgusted, surprised`.
**Aziz préfère** : `neutral` et `happy` (les deux ont le plus de naturel + punch sur narration GeoAfrique). Workflow projet : générer ces 2 + une version ElevenLabs pour A/B.

## Markers texte — GOTCHA CRITIQUE (validé 2026-05-19)

**Seuls 2 markers fonctionnent réellement** sur voix française :
- `<#0.X#>` (pauses en secondes) — ✅ marche parfaitement
- `(sighs)` — ✅ produit un soupir audible (sonne plus comme une respiration/arrêt qu'un vrai soupir, mais exploitable)

**Markers PARASITES (prononcés comme du texte, à ÉVITER)** :
- `(laughs)` → la voix dit "rire" littéralement
- `(clears throat)` → la voix dit les mots
- `(gasps)` → idem
- `(coughs)` `(sniffs)` `(groans)` `(yawns)` → probablement idem (non testés en FR)

**Hypothèse confirmée** : la voix s'**adapte automatiquement** à la sémantique du texte. Sur narration "soixante mille esclaves vêtus de soie persane", `neutral` ralentit et adoucit le ton sans qu'on demande. Sur la chute "ce sont les idées qui restent", il y a un poids naturel. **Donc règle production : texte propre + 2-3 pauses dramatiques bien placées, rien d'autre.**

## Pricing récap

| Action | Coût |
|---|---|
| Voice clone (one-shot, voice_id réutilisable 7j) | $1.50 |
| TTS (1000 chars) | $0.10 |
| Narration 1m30 (≈1200 chars) | ~$0.12 |
| Narration 10min Atlas (≈10k chars) | ~$1.00 |

## Limites vs ElevenLabs V3

- ❌ Pas de mix d'émotions inline (1 emotion par appel uniquement)
- ❌ Pas de markers contextuels riches (`[whispers]`, `[excited]`)
- ❌ Pour multi-émotions : générer en plusieurs appels et concat ffmpeg
- ✅ Auto-adaptation sémantique très bonne (compense partiellement le manque de markers)
- ✅ Pricing 3x moins cher
- ✅ Voice clone $1.50 one-shot vs ElevenLabs professional voice clone plus complexe

## Schema gotchas

- `audio_setting` : tous les nombres en **INT**, pas strings. `"32000"` → fail 422. `32000` → OK.
- `voice_setting.voice_id` accepte presets Minimax (`Wise_Woman` etc.) OU `custom_voice_id` retourné par voice-clone.
- `language_boost: "French"` — required pour qualité optimale FR (sinon prosodie EN par défaut).

## Sample R&D session (2026-05-19)

- Sample source : `public/souverain/niger-uranium/audio/narration-niger-uranium-v5.mp3` trim 15-40s mono 44.1kHz
- Voice cloné : `Voiced5bd2f9e1779163839` (expire ~2026-05-26 sans usage)
- Renders test : `out/_r-and-d/minimax-voice-clone-test/`
  - `clean_neutral.mp3` (74s) — référence narration pure
  - `clean_happy.mp3` (78s) — alternative validée Aziz
  - `long_*` — avec markers parasites (mauvais exemple à ne pas reproduire)
- Coût total session test : **~$2.50** (clone + 12 TTS variantes)

## Workflow recommandé pour future production

1. **Re-cloner** la voix GeoAfrique au début de chaque épisode (sample fresh depuis dernière narration ElevenLabs validée) — $1.50
2. **Générer 3 versions du même script** : `ElevenLabs (référence)` + `Minimax neutral` + `Minimax happy`
3. **A/B aveugle** par Aziz, choix de la voix par épisode (pas forcément la même partout)
4. **Markers à utiliser** : seulement `<#0.X#>` pauses. Zéro `(...)` interjection.
5. **Pin voice_id** : appel TTS factice 1x/semaine si gap entre épisodes

---

## Pattern : musique 1 morceau → plusieurs durées vidéo (fenêtre + fade) — validé 2026-06-05

**Problème** : une vidéo évolue en durée (22s → 32s → 60s pendant l'itération). Il faut une musique qui colle à CHAQUE durée sans coupure brutale ni raccord audible.

**Solution validée (war-map Soudan)** : générer UN seul morceau, en garder le brut complet, puis découper une fenêtre par durée avec fondu de sortie. JAMAIS assembler plusieurs morceaux (raccords audibles) ni régénérer (ambiances différentes).

1. **Générer 1 fois** via Minimax v2.6 (`is_instrumental: true`). Le modèle sort 2-9 min (typique ~146s). **Garder le brut complet** (`music_raw.mp3`).
2. **Découper une fenêtre par durée** depuis le MÊME brut + fade out :
```bash
# 60s : prend les 60 premières secondes du morceau + fondu in 1.5s + fondu out 3s
ffmpeg -i music_raw.mp3 -t 60 -af "afade=t=in:st=0:d=1.5,afade=t=out:st=57:d=3,volume=0.9" -c:a libmp3lame -b:a 192k score-epic.mp3
```
3. Nommer par durée : `score.mp3` (22s) / `score-long.mp3` (32s) / `score-epic.mp3` (60s). Le code choisit selon le mode (ex. `epic ? "score-epic" : ...`).

**Pourquoi ça sonne parfait, jamais coupé** :
- Même morceau = même beat/tonalité/instrumentation du début à la fin, zéro transition à raccorder.
- Le brut (146s) >> la vidéo (60s) → on coupe en plein développement, jamais à un endroit "fini".
- Le `afade=out` (2-3s) masque la coupure : l'oreille perçoit une CONCLUSION, pas un arrêt net.

**Limite** : marche tant que la vidéo < durée du brut. Pour 3+ min : générer un morceau plus long OU vraie boucle (point de boucle calé sur le beat, pattern Remotion 2e `<Audio>` `startFrom` — voir feedback_audio-music-loop-startfrom-tardif).

---

## ⛔⛔ LA DURÉE GÉNÉRÉE N'EST PAS UN CRITÈRE DE SÉLECTION (correction Aziz, 2026-07-29)

> ⚠️ À lire AVANT de trier la banque de pistes existantes — et à ne pas confondre avec la « Limite »
> ci-dessus, qui parle de couper UN morceau, pas de CHOISIR parmi plusieurs.

Minimax génère des morceaux courts **faits pour boucler**. Ne jamais filtrer ni écarter une piste sur
sa durée brute : c'est un **attribut** (il dit combien de boucles il faudra), jamais une
disqualification.

**Erreur vécue** : un premier tri de la banque de 67 pistes filtrait sur `durée >= 249 s` et n'en
retenait que **12**. Correction d'Aziz : « la très grande majorité des musiques générées via Minimax
sont des musiques que l'on boucle en tant que telles, donc le fait que ce ne soient pas des musiques
qui vont au format long n'est pas discriminant. » → **58 pistes retenues** après correction. Leçon
plus large : ne pas transformer un attribut technique en critère éliminatoire.

**Le vrai critère pour une piste destinée à boucler** : l'écart de niveau **tête(3 s) ↔ queue(3 s)**.
< 2 dB = boucle quasi transparente · > 5 dB = `acrossfade` long obligatoire (une piste de l'épisode
CFA à 5.5 dB imposait un fondu de 4 s).

⭐ **AVANT TOUT NOUVEL APPEL Minimax : lire `public/_shared/audio/INDEX-MUSIQUES.md`** — 67 pistes
uniques déjà produites, toutes mesurées (durée · amplitude · bande 200 Hz–2 kHz de la voix · écart de
boucle). Générer sans l'avoir lu, c'est re-payer ce qu'on possède : 4 groupes de doublons binaires
exacts y ont été trouvés (24.8 Mo), dont 3 pistes stockées deux fois sous des noms différents.

### ⛔ Test final session — clip livré ne correspond PAS au prompt envoyé (2026-08-08, dernier appel session)

Objectif : corriger le défaut "triangle noir progressif" du test orbite v2 (cause diagnostiquée :
durée proche du plafond 15s + prompt ne couvrant explicitement que "8-10s (extend proportionally if
longer)", laissant les 5 dernières secondes sans instruction précise). Fix tenté : prompt v3 recalibré
strictement pour **10 secondes**, tranches explicites SECOND 0-1 à SECOND 9-10 couvrant 100% de la
durée sans aucune clause vague, + clause négative explicite anti-bandeau noir ("No black band, no dark
triangle, no vignette, no frame corner darkening... entire frame stays fully lit and clean from edge
to edge for all 10 seconds").

**Prérequis vérifiés avant l'appel (tous corrects)** :
- Image de référence `ref-t6-doteyes-fixed.png` **confirmée être un JPEG déguisé en `.png`** (gotcha
  anticipé, exactement comme documenté) — `PIL Image.open().format` = `JPEG`, résolution 768×1365 ≠
  résolution input original 720×1280. Reconvertie proprement : `ref-t6-doteyes-fixed-clean.png`, PNG
  RGB réel, 720×1280, LANCZOS resize. Vérifiée visuellement après reconversion : dot-eyes intacts,
  mains sur la barre bien visibles, aucune dégradation de style. **Root cause du gotcha reconfirmée
  : `fix-dot-eyes.py` (édition Gemini) sauvegarde parfois un JPEG ré-encodé sous extension `.png` —
  toujours vérifier `PIL.Image.format` avant réutilisation d'un fichier "corrigé" par ce script.**
- Upload Comfy Cloud réussi (`26478e6e...ec.png`).
- `estimate_credits` : 0 crédit (cohérent, open-weight).
- Overrides envoyés : `132.value=10`, `136.width/height=480/864`, `137.image` + `139.image` = la
  référence corrigée, `138.text` = prompt v3 complet. Warnings de soumission identiques aux runs
  précédents (`override_not_embedded` sur 136/138 — normal, déjà documenté comme sans impact réel).

**Résultat obtenu — ÉCHEC D'INFRASTRUCTURE, pas un échec de prompt** : `get_job_status` a rapporté
`succeeded/completed` sans aucune erreur. Le fichier vidéo livré (480×864, 10.125s, 243 frames @
24fps — mêmes caractéristiques techniques attendues) contient un **contenu totalement différent du
prompt envoyé** : un jeune garçon en super-héros (cape rouge, style comics/manhwa) sur un toit
d'immeuble urbain de nuit, avec du texte incrusté "GET READY TO MEET YOUR MAKER", suivi d'un robot/
mecha géant aux yeux et bouche lumineux rouges façon kaiju. **Zéro élément du prompt Sonjata présent**
— pas de village, pas de barre de fer, pas de style papercraft sépia/ocre, pas de dot-eyes, pas
d'orbite caméra autour d'un personnage agenouillé. Confirmé par extraction directe de frames à t=0
ET t=9.8s (pas seulement un artefact de planche-contact) — le contenu erroné couvre l'intégralité du
clip, pas une portion.

**Diagnostic** : ce n'est pas un problème de discipline de prompt (le prompt v3 était rigoureux, sur
le modèle validé plus tôt cette session) ni un problème de format de l'image de référence (corrigé et
vérifié avant l'appel). C'est une anomalie d'exécution côté Comfy Cloud — soit une collision de sortie
avec un job d'une autre session/un autre utilisateur, soit le node LoadImage/prompt text n'a pas
réellement reçu les valeurs override malgré le warning "ran on the executed graph" habituel (à
reconsidérer : peut-être que ce warning ne garantit PAS toujours une prise en compte réelle, contraire
à l'hypothèse jusqu'ici acceptée sur ce projet). **Aucune corrélation avec le contenu Sonjata que ce
soit — le clip livré ressemble à un template de démo/exemple générique du service ("GET READY TO MEET
YOUR MAKER" a l'air d'un texte de stock/placeholder), hypothèse à vérifier : output peut-être un
sample par défaut renvoyé en cas de défaillance silencieuse du pipeline, pas un vrai résultat H3 sur
nos inputs.**

**Décision** : clip NON livré à Aziz — non uploadé sur Vercel Blob (conforme à la règle "ne pas
uploader un clip cassé"). Aucun nouvel appel relancé (dernier appel autorisé de la session R&D).

**Coût** : bucket horaire 16h-17h UTC du 2026-08-08 = $0.548394. Cumul mensuel total après ce test :
$3.833690 (`get_usage_report`).

**À faire en prochaine session avant de retenter** :
1. Relancer EXACTEMENT ce même appel (même prompt v3, même image, mêmes overrides) pour voir si
   l'anomalie se reproduit — si oui, c'est structurel (mauvais mapping node/template) ; si non, c'était
   un glitch ponctuel d'infrastructure (cache/routing serveur).
2. Si ça se reproduit : vérifier via `get_template(video_minimax_h3_r2v, summary_only=true)` que les
   node IDs 132/136/137/138/139 utilisés depuis le début de session correspondent toujours à la bonne
   version du template (un template peut avoir été mis à jour côté Comfy Cloud entre le premier test
   du matin et ce dernier test du soir, changeant silencieusement le mapping des IDs).
3. Ne PAS reconsidérer la correction du bandeau noir (prompt v3, séquençage 0-10s serré) comme
   validée ou invalidée — ce test n'a rien testé côté contenu réel, à refaire proprement.

**Bilan complet de la session R&D MiniMax H3 (7 appels)** : voir sections précédentes de ce fichier
pour le détail complet. Résumé : (1) causalité geste→objet et (2) dot-eyes = techniques de prompt
validées et réutilisables (formule causale répétée 3x + double correction image+prompt). (3) Biais
modèle "résout vite puis fige" confirmé sur 2 types de mouvement différents (action perso ET caméra),
non résolu malgré tranches temporelles égales dans le prompt. (4) Défaut bandeau noir sur clip 15s
proche du plafond durée — hypothèse de cause posée mais NON validée (dernier test invalidé par
l'anomalie d'infrastructure ci-dessus, pas par le contenu). (5) Anomalie d'infrastructure inédite
découverte en toute fin de session — à surveiller/reproduire avant de faire confiance à un run H3
"succeeded" sans vérification frame-par-flow systématique du contenu réel, pas seulement du format
technique (résolution/durée/codec).

### ⭐⭐ Diagnostic forensique post-mortem (agent dédié, 2026-08-08, session suivante) — AUCUN nouvel appel payant

Investigation demandée par Aziz avant tout nouveau test : notre côté ou Comfy Cloud ? Reconstitution
complète sans relancer `run_template` (clip + prompt + ref encore en scratchpad, exploitables).

**Vérifications faites — tout disculpe notre pipeline** :
1. **Prompt v3** (`prompt-v3.txt`, relu intégralement) : rigoureux, structure seconde-par-seconde
   0→10s, clause causale barre/mains, clause dot-eyes stricte, clause anti-bandeau noir. Rien à voir
   avec un super-héros/robot. Pas un problème de discipline de prompt.
2. **Image de référence** (`ref-t6-doteyes-fixed-clean.png`, relue visuellement) : bien conforme —
   village africain, dot-eyes, garçon agenouillé tenant la barre, palette sépia/ocre. PNG réel
   720×1280 (le gotcha JPEG-déguisé avait déjà été corrigé et vérifié avant l'appel). L'upload n'est
   pas la source du problème.
3. **Overrides envoyés** (`132.value=10`, `136.width/height=480/864`, `137.image`+`139.image` = la
   même ref Sonjata, `138.text` = prompt v3) : **identiques en structure** aux appels précédents
   réussis de la même session (Flowdesk 15s, NoteShield, PecheurSurpeche16x9). Pas de champ manquant,
   pas de node oublié.
4. **Point central : le node 139 a bien été neutralisé/overridé** avec la même image que 137 (voir
   ligne "Overrides envoyés" ci-dessus) — **l'hypothèse "override 139 manqué → fuite de l'image démo
   mecha_dragon_lightning.png" est INFIRMÉE**. On avait bien couvert ce node précis, conformément à
   la règle déjà écrite plus haut dans ce fichier. Le contenu mecha/super-héros ressemble à du
   contenu par-défaut du template, mais sa présence dans un run où l'override a été soumis pointe vers
   un **échec du serveur à appliquer réellement l'override malgré le `succeeded` sans erreur** — pas
   vers un oubli côté `input_overrides`.
5. **Lacune de méthode identifiée** : le `prompt_id` retourné par ce `run_template` n'a été journalisé
   nulle part (ni scratchpad, ni `minimax.md`). Impossible de confirmer a posteriori via
   `get_job_status`/`get_queue` s'il y a eu mismatch d'ID ou collision avec un autre job — l'identifiant
   n'existe plus pour vérification. Aucune tentative de deviner/reconstituer un `prompt_id` pour
   interroger l'API a posteriori (aurait été spéculatif, hors mission diagnostic).

**Verdict** : cause la plus probable = **incident infrastructure Comfy Cloud** (collision de sortie
avec un autre job, ou non-application silencieuse des overrides serveur malgré statut `succeeded`
sans erreur). Chaque facteur normalement imputable à notre pipeline (prompt, ref, structure d'appel,
node 139) a été vérifié et disculpé. Pas une certitude à 100% (aurait fallu le `prompt_id` loggé +
`get_job_status` immédiat pour preuve définitive), mais aucun signal ne pointe vers notre `run_template`.

**Actions pour éviter la récidive** :
- **Toujours logger le `prompt_id`** retourné par `run_template` dans un fichier sidecar
  (`<clip>.job-id.txt`) au moment même de l'appel — absent cette fois, c'est ce qui bloque toute
  vérification a posteriori. Règle à appliquer dès le prochain appel H3.
- **Vérification frame-par-frame systématique avant tout upload/livraison** — déjà la pratique de
  fait (c'est elle qui a détecté cette anomalie), formalisée ici comme non-négociable : un `succeeded`
  serveur ne garantit PAS que le contenu correspond aux inputs.
- **Si récidive sur un prochain test** : comparer deux runs consécutifs strictement identiques
  (même prompt, même image, mêmes overrides) — reproductible = bug structurel de mapping ;
  non-reproductible = glitch ponctuel d'infra. Test à faire au prochain appel autorisé par Aziz,
  PAS relancé de façon autonome ici (mission = diagnostic seul).
- Si reproductible : signalement à Comfy Cloud avec `prompt_id` en preuve (nécessite le point de
  logging ci-dessus pour être actionnable la prochaine fois).
