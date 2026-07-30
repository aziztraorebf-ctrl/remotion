# NEXT-ACTION — Recommandations actives
> Mis a jour : **2026-07-30** (CFA PROMU PRÊT-PUBLICATION · boucle NotebookLM documentée ·
> preuve de concept slide→SVG notée pour session future)
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"

## 🏁 CFA = TERMINÉ (2026-07-30) · ⏭️ 2 CHANTIERS NOTÉS POUR PLUS TARD

> **L'épisode Franc CFA est PROMU** → `out/PRET-PUBLICATION/franc-cfa-midform-FINAL.mp4`
> (4 min 28 · 8046 frames · −17,2 LUFS). Musique = `music-A-ambient-souverain`, **volume 0.0716**,
> fenêtre 19,6→259,7 s, **aucune boucle**. Détail + les 2 chiffres à ne jamais transposer :
> STATUS du worktree § 0-DUODECIES. **Reste = publication TryPost** (administratif).
>
> ⛔ **Chantiers ÉCARTÉS APRÈS TEST — ne pas les rouvrir** : le **grain** (3 intensités rendues,
> jusqu'à 6× le réglage préconisé → invisible ; « as-tu vraiment besoin d'un grain dans ce
> cas-ci ? » = non) · les **creux d'animation** mesurés (jugés non gênants au visionnage).
> ⭐⭐ **Sur 4 recommandations LLM testées, ZÉRO correction** : 3 étaient factuellement fausses
> contre le code, la 4e vraie mais sans objet. Leçon :
> `feedback_defaut-signale-par-llm-verifier-quil-nous-concerne.md`.
>
> ### ⏭️ NOTÉ POUR UNE SESSION FUTURE (décidé par Aziz, PAS commencé)
> 1. ⭐ **PREUVE DE CONCEPT : une slide NotebookLM → une scène SVG animée**
>    → `memory/starters/STARTER-PROMPT-preuve-concept-slide-nlm-vers-svg.md`
>    Objet = les « 3 piliers au-dessus d'un gouffre ». ⛔ **Pas pour l'intégrer dans le CFA**
>    (l'épisode est clos) — pour **prouver le concept**. Si ça tient : ça ouvre l'idéation de
>    scènes par planche de slides, candidat n°1 = le **GAZODUC**.
> 2. **La boucle NotebookLM long→short est enfin DOCUMENTÉE** (elle ne vivait que dans les
>    transcripts, après 3 usages et 2 Shorts publiés) →
>    `memory/tools/notebooklm-boucle-short.md`. Prompt CFA prêt dans la conversation.

## ⏭️⏭️ SESSION CFA DU 2026-07-29 SOIR — PROCHAINE ÉTAPE FIXÉE PAR AZIZ

> ⚠️ Bloc ajouté par une session parallèle (worktree `remotion-cfa`) — il ne remplace pas les
> priorités ci-dessous, il ajoute le chantier CFA qui reprend là où on s'est arrêté.
> ⭐ **STARTER PRÊT** : `memory/starters/STARTER-PROMPT-cfa-musique-puis-grain.md`
>
> **1. LA MUSIQUE — commencer par l'index qu'on vient de créer.**
>    `public/_shared/audio/INDEX-MUSIQUES.md` : 67 pistes uniques mesurées (durée · amplitude ·
>    bande 200 Hz–2 kHz · **écart de boucle**). ⛔ **La durée n'est PAS un critère** (correction
>    d'Aziz : les pistes Minimax sont faites pour BOUCLER — ma 1re version filtrait sur ≥ 249 s
>    et ne gardait que 12 pistes sur 67, erreur corrigée → **58 retenues**). Le choix est un
>    **jugement d'Aziz à l'oreille**, sur 3-4 extraits courts mixés sous un passage narré réel.
>    Puis volume recalculé **par bande 200 Hz–2 kHz**, jamais en RMS global.
>
> **2. LE GRAIN, SUR UNE SEULE SCÈNE D'ABORD** (consigne explicite d'Aziz) — test à variable
>    unique avant de toucher les 8 beats. Scène recommandée : beat 6a (frame de réf sous la main).
>    Seul point que les 2 modèles ET le code confirment : aucun grain nulle part.
>    Si validé → brique partagée → re-render complet → validation.
>
> **⛔ NE PAS APPLIQUER** 3 des 6 points des TOP 3 LLM, vérifiés FAUX : funambule « linéaire »
> (c'est une Bézier quadratique), signatures « en fondu » (elles se tracent déjà), et les 2
> « temps morts » de Gemini qui sont les passages les PLUS animés du film. Les VRAIS creux,
> mesurés par nous : 2:29 (6 s) · 4:11 · 4:24 · 0:43 · 0:52.
>
> **✅ FAIT cette session** : les 3 fixes du visionnage VALIDÉS Aziz (`f8c72545` `0456ff96`
> `a2c36905`) · **ré-assemblage v3** 4 min 28 / 8046 frames / aucun gel / −17,1 LUFS, rapatrié
> dans `out/episodes/franc-cfa-midform/v3-post-fixes/` · **INDEX-MUSIQUES** (71 fichiers → 67
> uniques, 4 doublons binaires) `aed31c4a` `c907c34b` · ⭐⭐ **`memory/doctrines/GRILLE-JUGEMENT-MIDFORM.md`**
> (7 critères observables + baseline : forces = métaphore/lisibilité, marge = **matière 2/10** et
> **poids 4/10**) · outil `scripts/tools/kimi-video-review-custom.py`.

## ⛔⛔ AVANT DE LIRE QUOI QUE CE SOIT — LES CHANTIERS VIVANTS SONT DANS DES WORKTREES

> **Ce fichier (repo principal) est structurellement EN RETARD** sur les chantiers qui vivent ailleurs.
> Vécu le 2026-07-27 : j'ai annoncé à Aziz un état périmé d'une session entière (« le beat 4 reste à
> faire ») alors qu'il était refait et l'épisode assemblé — l'info était dans le worktree, et
> l'avertissement était enfoui en milieu de fichier au lieu d'être ici.
>
> | Worktree | Branche | Chantier | Source de vérité |
> |---|---|---|---|
> | `/Users/clawdbot/Workspace/remotion-cfa` | `feat/cfa-nuit1994-svg-mix` | **Franc CFA mid-form** | `memory/episodes/souverain/franc-cfa-short/STATUS.md` (du worktree) |
> | `/Users/clawdbot/Workspace/remotion-cfa` | `rnd/stick-figures-gestes` | **Registre stick figure** | `remotion-cfa/src/projects/_shared/stick-figure-svg/STICK-FIGURE-INDEX.md` (du worktree) |
> | `/Users/clawdbot/Workspace/remotion` | `feat/soudan-passe-finale-6lots` | Soudan mid-form | `memory/episodes/soudan-midform/STATUS.md` |
> | `/Users/clawdbot/Workspace/remotion` | ✅ **`master`** (branche R&D perso MERGÉE le 2026-07-29, supprimée) | **R&D scène vivante + doctrine perso** | `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md` |
>
> **Réflexe d'ouverture de session** : `git worktree list` + `git log --oneline -5` DANS le worktree
> concerné, AVANT d'annoncer un état à Aziz. Un commit récent là-bas prime sur ce fichier-ci.
>
> ⚠️ **STASH À RÉCUPÉRER** : `stash@{0}` = `wip-soudan-itineraire-avant-rnd-port` — le chantier
> « itinéraire multi-étapes » d'Aziz (`ItineraireMultiEtapes16x9.tsx`, `RouteMultiEtapes.tsx`,
> `RouteMultiEtapesDemo.tsx` + une modif de `Root.tsx`), mis de côté le 2026-07-28 pour créer la
> branche R&D. **À restaurer (`git stash pop stash@{0}`) au retour sur `feat/soudan-passe-finale-6lots`.**

---

## 🎭🎭 SCÈNES À PERSONNAGES — **SOCLE COMPLET, 7 TESTS TRANCHÉS EN 1 JOURNÉE** (MàJ 2026-07-29)

> ⭐⭐⭐ **LIRE `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md`** — tout y est détaillé.
> ✅ **MERGÉ DANS `master` le 2026-07-29** (fast-forward, 57 commits, branche supprimée) — donc le
> socle stick figure ET ses 2 corrections sont désormais disponibles pour TOUT le monde, sans
> branche à retrouver. ⚠️ 6 erreurs `tsc` subsistent sur master (`GlobalPulse`, `GoldVein`,
> `LoomWeaver` — typages Mapbox) : **vérifiées PRÉEXISTANTES**, le merge n'en a introduit aucune.
>
> ### ⛔ LA DÉCISION DE FIN DE SESSION (Aziz) : ON ARRÊTE LA R&D, ON PASSE À LA PRODUCTION
> « Continuer éternellement pourrait être un piège pour faire ce qui est le plus important :
> créer des vidéos et les publier. » **Les socles sont validés.** Les questions qui restent ne se
> tranchent plus en laboratoire — elles demandent un vrai sujet, avec de vraies contraintes.
> ⏭️ **PROCHAINE VIDÉO ENVISAGÉE = LE GAZODUC Nigeria-Maroc-Europe, en SVG** (comme le Franc CFA).
> C'est là qu'on testera tout ceci pour de vrai — et on découvrira peut-être qu'un personnage n'y
> a aucune place (un gazoduc est spatial/causal = plutôt de la CARTE). C'est un résultat en soi.
> Sujet : `memory/projects/GAZODUC-MEGAPROJETS-SUJET.md`.

### ✅ CE QUI EST ACQUIS, VALIDÉ SUR RENDU (ne pas re-prouver)

| | |
|---|---|
| **3 registres** | CONTEMPLATIF (le lieu porte l'info) · SCHÉMATIQUE (la donnée, zéro perso) · DÉMONSTRATIF (le corps porte l'argument). **Pas des concurrents** — le choix se fait AU SCRIPT. |
| **Le personnage qui AGIT** | `PorteurCharge16x9` — la charge grossit, lui ne change pas (= un RATIO, zéro chiffre). |
| **La scène NARRÉE** | `PorteurNarre16x9` + `porteurNarreTiming.ts` — chaque geste tombe sur un mot du forced-align. « La 1re scène qui marche en tant que telle » (Aziz). |
| **Le personnage RICHE** | `PorteurRiche16x9` — tient le rôle démonstratif, gros plan + personnalisation. ⭐ Exige **2-3 ARCHÉTYPES MAX désignés au SCRIPT** (il n'a d'intérêt que s'il est reconnu d'une scène à l'autre). |
| **Ce qui élève la scène** | ✅ zoom push-in · ✅ sol qui fléchit sous le poids · ✅ graphique hors caméra (une info que le corps ne peut pas dire). |
| **Ce qui ne sert à rien** | ⛔ décor riche (même réactif) · ⛔ grille de fond (même déformée) · ⛔ compteur collé au sac · ⛔ sueur. **Le fond reste UNI.** |

### ⭐⭐ LES 2 RÈGLES GÉNÉRALES QUI EN SORTENT

1. **Un élément doit porter une information que les autres ne portent pas déjà — ET cette
   information doit être utile à la démonstration.** « Participer » est nécessaire mais **pas
   suffisant** : la grille déformée participait vraiment et a perdu quand même.
2. **Un paramètre d'effort poussé à fond dégrade la lecture avant d'ajouter du sens.** Le plafond
   n'est pas de la timidité, c'est la condition de la lisibilité (`lean` 23° → 14°).

### 🔧 2 CORRECTIONS DE SOCLE (les 2 copies synchronisées, tsc OK des 2 côtés)

- ⭐⭐ **Le verrou pas/distance était MAL ÉNONCÉ** : « x dérive des pas » est insuffisant dès que le
  pas VARIE → `walkDistance(pasTotal, swingCourant)` raccourcit rétroactivement les pas déjà faits
  (**recul de 430 px**). Formulation exacte : **x dérive des pas AU MOMENT OÙ ILS SONT FAITS**
  (intégration incrémentale). Gravé dans `StickFigure.tsx`.
- ⭐⭐ **Le vêtement DÉRIVAIT du corps** (`Roles.tsx`) : `busteXf` ancrait dans le repère du MONDE
  (`t` calculé sur `hy` courant, qui oscille avec le bob) → 2.5 unités de dérive par cycle, le
  chandail finissait **sur le visage**. Fix : `t` dans le repère de RÉFÉRENCE Fable. + le pagne ne
  pivotait pas du tout (`PAGNE_SUIVI_LEAN = 0.45`). **Non-régression vérifiée sur rendu** (planche
  `Stick-Roles-Demo` avant/après) : les 4 rôles préservés, et le fix AMÉLIORE les planches
  d'origine. → [[vetement-solidaire-du-corps-jamais-independant]]

### ⏳ RESTE OUVERT (non bloquant)

- ⚠️ **`BRAS_LAG` toujours non appliqué** par `Figure` → pose dégénérée ~9 % du cycle. ⭐ On sait
  maintenant **comment** trancher ce genre de correction sans tout revalider à l'aveugle : rendre
  avant/après et comparer, comme pour le vêtement.
- Les pieds passent légèrement à travers le sol fléchi (fix = échantillonner sous chaque pied).
- Autres formes de graphique (frise, barres) · un graphique qui **réagirait** au geste.

---

## 🎭 SCÈNES À PERSONNAGES — trace du 2026-07-28 (2 régimes distingués)

> ⭐⭐⭐ **LIRE `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md` AVANT toute scène à personnage.**
> Commits `66ad70f8` → `e1e49815` — ✅ **mergés dans `master`** le 2026-07-29 (la branche
> `rnd/port-decor-scene-vivante` a été supprimée après merge).

**LA DISTINCTION QUI CADRE TOUT** — deux régimes à ne pas confondre :
- **AMBIANT** (port vivant, village de pêcheurs) : 6-12 figurants en boucle, aucun arc, le perso
  habite un lieu. Coûteux, décoratif.
- **DÉMONSTRATIF** (le funambule CFA) : **UN** perso qui **EST** l'argument, arc complet. Moins
  cher, plus fort. ⭐ **C'est par lui qu'il faut commencer.**
  Test décisif : *si on retire le personnage et que la démonstration tient, la scène est décorative.*

**7 principes du funambule** (détail dans la doctrine) · **table des 4 scènes de référence à NE PAS
JETER** (décision Aziz) : funambule CFA · port vivant · village pêcheurs · hook Or du Darfour.

**✅✅ HYPOTHÈSE TRANCHÉE AU RENDU LE 2026-07-29 — ELLE ÉTAIT MAL POSÉE.** Test à variable unique
(3 rendus de 975 frames, seul le fond change, prouvé par diff) : **A** témoin · **B** skyline
atténué · **C** skyline plein. **Verdict Aziz : A gagne**, mais pas pour la raison attendue — « le
background **ne fait rien**, rien ne s'y passe, il est juste là pour être là ; dans A, on pense
juste aux trois éléments qui sont là ». ⭐ **La ligne de partage n'est pas riche vs vide, c'est
PARTICIPANT vs DÉCORATIF.** Un décor inerte nuit **même atténué** (aucune baisse de contraste ne le
sauve : C atténué = B, et B reste inerte). Principe n.5 reformulé. Détail + protocole :
`memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md`. Code : `FunambuleDecorTest16x9.tsx` +
`skylineDecorGroups.tsx` (Fable 5, 2 intensités). Rendus : `out/_r-and-d/funambule-decor-test/`.

**✅✅ 2e MANCHE TRANCHÉE LE MÊME JOUR — variante D, le décor qui RÉAGIT** (le décor de B repris à
l'identique, seule la lumière varie sur une courbe calée au forced-align). Verdict Aziz : « **c'est
beaucoup mieux, mais rien ne bat la version témoin sans décor** ».
⛔ **HIÉRARCHIE COMPLÈTE : ABSENCE > PARTICIPANT > INERTE.** Ce n'est PAS « le minimalisme gagne » —
*participant > inerte* est un acquis solide et réutilisable ; c'est *absence > participant* qui vaut
**pour cette scène-là**.
⭐⭐ **LE CRITÈRE À RETENIR** : **le décor doit porter une information que les éléments principaux ne
portent pas déjà.** Le funambule a une métaphore DÉJÀ COMPLÈTE (fil = parité · filet = garantie ·
vide = risque) → la ville était **redondante**, et une redondance même belle se paie en attention.
⚠️ Ne pas sur-généraliser : dans une scène où le LIEU porte une info propre (port = dépendance
maritime, frontière = blocage), la réponse pourrait s'inverser — non mesuré.

**✅✅ LE PERSONNAGE QUI AGIT = PROUVÉ (2026-07-29) — « LE PORTEUR »** : `PorteurCharge16x9.tsx`,
compo `Porteur-Charge`, 24 s, rendu `out/_r-and-d/porteur-charge/v3.mp4`. Un homme porte une charge
qui grossit ; **lui ne change pas** (= le ratio dette/capacité, zéro chiffre à l'écran).
Lecture d'Aziz sans explication = test décisif passé : « la charge grossit et l'homme est vivant […]
à la fin il est penché, il est stoppé » · « c'est simple mais ça fonctionne, **le personnage en gros
plan**, on n'a pas dix mille choses à traiter ». ⭐ Confirme le verdict décor par un autre chemin :
**la place libérée profite au personnage**.
⭐⭐ **LE VERROU PAS/DISTANCE ÉTAIT MAL ÉNONCÉ** — « x dérive des pas » est INSUFFISANT quand le pas
varie : `walkDistance(pasTotal, swingCourant)` raccourcit rétroactivement les pas déjà faits →
**recul de 430 px**. Formulation exacte : **x dérive des pas AU MOMENT OÙ ILS SONT FAITS**
(intégration incrémentale). Bug attrapé PAR LE CALCUL avant le 1er rendu — gravé dans le socle
`StickFigure.tsx` (les 2 copies synchronisées).

**✅ CE NEXT EST FAIT (2026-07-29) — `PorteurNarre16x9` existe, voir la section de tête. Ne pas
relancer ce chantier.** ~~⏭️ NEXT — LA SCÈNE NARRÉE~~ : reprendre **le porteur** et
**redériver ses timings du forced-align** au lieu de les coder à la main. Variable unique (seule la
source des timings change) — même protocole que le test décor. La question ouverte : est-ce que le
geste et la voix se **renforcent** ou se **gênent** ? Un corps qui bouge pendant qu'une voix parle
peut diviser l'attention au lieu de l'additionner : **non mesuré**. Script = Claude propose 4-5
phrases EN TEXTE, Aziz valide AVANT toute génération audio (aucun coût engagé avant accord).
⭐ **Pourquoi la narration AVANT l'enchaînement de scènes** : enchaîner sur des durées arbitraires
obligerait à tout recaler ensuite. Une fois qu'un geste sait tomber sur un mot, l'enchaînement
devient un problème de montage, pas de conception.
- ⛔ **Décor : chantier CLOS pour le régime démonstratif.** Raffiner des fonds répondrait à une
  question qu'on ne se pose plus. Rouvrir seulement pour une scène où le lieu porte une information.
- Varier les boucles des figurants du port : **relativisé** — le port est du régime AMBIANT, varier
  ses boucles ne le rendra pas participant.

**✅ ACQUIS TECHNIQUES DE LA SESSION** (gravés, ne pas re-prouver) :
- **Le partage à 3 ÉTAGES** : le modèle dessine le DÉCOR · nous animons l'ambiance · nos briques
  prennent les PERSONNAGES. Mesuré : un agent qui dessine ET anime met 939 lignes d'animation pour
  459 de matière, et livre un décor pauvre. Preuve archivée :
  `src/projects/_rnd/svg-scenes/_archive/test-agent-dessine-et-anime/`.
- **Fable 5 gagne un 2e test aveugle** (sur décor riche, terrain favorable à Opus).
- **Hiérarchie figurant/héros** validée par Aziz.
- ⛔ **La brique d'habillage EXISTE** : `_shared/stick-figure-svg/habillage.ts` + `identite/Roles.tsx`
  (4 rôles, 7 objets, `PersonnageRole`). **Ne jamais improviser un vêtement** — l'oubli a coûté
  3 tentatives + 1 agent cette session.
- ⚠️ **BUG DU SOCLE** : `BRAS_LAG` est exporté et documenté mais `Figure` ne l'applique JAMAIS →
  ~9 % de chaque cycle en pose dégénérée (trait vertical). **Touche potentiellement toutes les
  scènes stick figure existantes.** Parade côté appelant ; socle non modifié (corriger le socle
  obligerait à revalider les 6 planches — décision à prendre par Aziz).

---

## 🧍 REGISTRE STICK FIGURE — **PASSE EN PRODUCTION, 6 SCÈNES NARRATIVES** (MàJ 2026-07-28)

> ⭐⭐ **LE REGISTRE EST VALIDÉ POUR LA PRODUCTION.** Verdict Aziz sur la dernière scène : « le socle
> en tant que tel est validé, ça fonctionne, le placement, les distances — il y a juste quelques
> améliorations à faire plus tard. »
>
> **Où** : worktree `/Users/clawdbot/Workspace/remotion-cfa`, branche `rnd/stick-figures-gestes`,
> commits `25cab1c9` (6 scènes) + `5aeafd85` (3 verdicts gravés). **NON mergée dans master.**
> ⚠️ `node_modules` n'est PAS ignoré dans ce worktree → **jamais `git add -A`**.
>
> ✅✅ **CE « NEXT » EST FAIT (2026-07-29) — ne pas le rejouer.** La scène narrée existe
> (`PorteurNarre16x9.tsx` + `porteurNarreTiming.ts`, timings dérivés du forced-align), validée par
> Aziz : « la 1re scène qui marche en tant que telle ». ⛔ **Voir la section SCÈNES À PERSONNAGES en
> tête de ce fichier** — le socle est déclaré COMPLET et la R&D est close.
> *(Texte d'origine conservé ci-dessous comme trace de l'état du 2026-07-28.)*
> ~~NEXT = LA SCÈNE AVEC NARRATION (le seul test qui reste)~~ →
> `remotion-cfa/memory/starters/STARTER-PROMPT-stick-figure-scene-narree.md`
> Aujourd'hui tous les timings sont ARBITRAIRES (codés à la main). Le prochain saut : script court
> → narration ElevenLabs → **forced-align** (`scripts/tools/forced-align.py`, moteur ElevenLabs car
> le quota OpenAI/whisper est épuisé) → timings dérivés → scène. Un personnage n'entre plus « à la
> frame 60 » mais **quand la voix le nomme**.

**Ce que le registre sait faire (prouvé sur rendu, validé Aziz)** : marcher (5 variantes, verrou
pas/distance) · manipuler un objet qui change d'état et de contenant · échanger un objet à deux ·
une foule (3 marchands + 5 passants, perspective unifiée, zéro collision) · des marchands DE FACE
immobiles qui hèlent · une apparition dessinée puis animée · des bulles d'ambiance.

**⭐⭐ 2 VERDICTS TRANCHÉS PAR TEST** (gravés dans `STICK-FIGURE-INDEX.md`, ne pas rediscuter) :
1. **Le modèle dessine le DÉCOR, NOUS animons les PERSONNAGES.** Un modèle briefé avec le socle
   SAIT animer, mais son costume est « cousu sur un seul mouvement » (s'asseoir = redessin).
   À récupérer de lui : l'HABILLAGE, jamais le squelette.
2. **FABLE 5 confirmé modèle SVG par défaut, décor compris** — test AVEUGLE contre Opus élevé,
   brief identique, verdict Aziz sans hésitation. ⭐ L'écart s'explique par la MÉTHODE : Fable a
   rendu et REGARDÉ son travail (2 passes), Opus a déclaré ne pas l'avoir vu. Nuance : rien ne
   prouve un avantage Fable sur du RAISONNEMENT (audit/refactor) — Opus y a produit une vérif par
   script qui a rattrapé 2 violations réelles.

**⚠️ 3 améliorations relevées par Aziz, NON traitées** (à faire en production, pas en R&D) :
objet qui « pop » en montant à l'épaule · premier plan qui se vide quand les allures varient trop ·
personnages d'arrière-plan encore trop statiques (piste : varier la POSTURE plutôt qu'animer).

**⭐ LA RÈGLE DE COMPOSITION** (née de village réussi vs pêche ratée) : une scène convient au
registre si elle a **un SOL**, si le geste central est un geste **du CORPS**, et si le décor a été
**RENDU ET REGARDÉ**. ≥2 « non » = refuser la scène comme banc d'essai.

> ### 🗄️ TRACE — LE PROGRAMME R&D 4 VAGUES (2026-07-26/27), socle de tout ce qui précède
> Origine : découverte fortuite sur le beat 4 du Franc CFA (le funambule qui marche, vacille, tombe).
> La doctrine avait écarté le personnage animé (« pantin bien animé ») — cette conclusion valait pour
> le personnage RICHE, pas pour la stick figure de profil.
> **8 planches V1** (`out/_r-and-d/stick-figures/v1-valide/`), commits `a8f2bab2` · `25514277` ·
> `4fdb8f4d`. Verdict Aziz sur les rôles habillés : « **c'est parfait, je valide** ».
> ⛔ **Pistes écartées, ne pas ressortir** : personnage + carte · vues de dos et trois-quarts
> (**profil seul**) · tout visage, même un point d'œil.
> ⭐ **Panel LLM** : Fable 5 gagne largement (vs GPT-5.5 / Gemini 3.1 Pro / Kimi K3, même brief), à
> coût nul — seul modèle à s'être auto-relu sur rendu. Archives : `public/_shared/refs/stick-figure-panel/`.
> Chantiers ouverts non bloquants : relevage en stop-motion · largeur des tenues · 5 bugs mineurs.

---

## 🎬 FRANC CFA — MID-FORM SVG — **ÉPISODE COMPLET, VALIDÉ, PROMU JALON v2 · NEXT = 3 FIXES PUIS MUSIQUE** (MàJ 2026-07-26 fin)

> ### ⛔⛔ NEXT SESSION — DANS CET ORDRE (décisions d'Aziz du 2026-07-26, post-visionnage)
> **Épisode VALIDÉ** (« l'épisode est très bien ») et promu jalon v2 dans
> `out/episodes/franc-cfa-midform/` — ⛔ **PAS dans `PRET-PUBLICATION/`** car la musique doit changer.
> 1. **LES 3 FIXES RELEVÉS AU VISIONNAGE, EN PREMIER** → starter avec les causes déjà mesurées dans le
>    code : `remotion-cfa/memory/starters/STARTER-PROMPT-cfa-fixes-post-visionnage.md`
>    · **beat 3** : ping/ding quand chaque courbe REJOINT sa devise (les 2 SFX actuels sont sur le tracé)
>    · **beat 5b** : ⛔ **RETIRER le rappel du sac de riz** (audio ~9.6→18.3 s + visuel) — retour en
>      arrière ASSUMÉ sur l'ajout du 2026-07-25, ne pas re-plaider pour le garder. Fix audio MAISON.
>      ⚠️ recaler les timings après la coupe + refaire l'assemblage (4min38 → ~4min29).
>    · **beat 6a** : Guinée quasi invisible (hachures `#c17e3a` sur fond `#c17e3a` à 0.42 d'opacité) →
>      hachures en **crème `#f0e8d2`**, contour 2.2→~4, zoom 1.15→~1.40 **recentré sur la Guinée**.
> 2. **LA MUSIQUE** (déverrouillée, cf. bloc ci-dessous) : inventaire + index AVANT de générer.
> 3. **PASSE DOWNSTREAM sur la vidéo complète** (Gemini accepte les 4min38 via Files API — il juge le
>    rythme et les enchaînements). 2 appels séquentiels, critère n°1 ÉLIMINATOIRE dans le brief.
> 4. Points connus non traités : **plateau statique ~2 s dans le beat 5a** (t≈154 s, PRÉ-EXISTANT) ·
>    **SFX du beat 2** « à revoir à l'assemblage ».

> ### ✅✅ SESSION 2026-07-26 (fin) — LE BEAT 4 EST PRODUIT ET L'ÉPISODE EST ASSEMBLÉ
> - **BEAT 4 "Qui tient la clé" = FAIT** (commit `a5ed7f12`). Le composant `CfaActe4Cle16x9.tsx` existait
>   déjà, non commité, et n'était **pas une amorce** : complet, 2 passes de review downstream appliquées,
>   timings vérifiés mot à mot contre le forced-alignment réel. La note « à retravailler » était PÉRIMÉE.
>   2 vrais défauts trouvés **en regardant le rendu** puis corrigés : (1) **353 px de la zone CFA hors cadre**
>   (42 % visible seulement) → cadrage élargi, Paris domine par la lumière et non par l'échelle ;
>   (2) les 2 arcs de dépôt indiscernables → étiquettes **UEMOA / CEMAC**, la coupure 2020 devient lisible.
> - **1er ASSEMBLAGE COMPLET + MUSIQUE = FAIT** : `out/_r-and-d/cfa-nuit1994/cfa-midform-ASSEMBLAGE-v1-MIX.mp4`
>   — **8347 frames / 278.23s / 4min38**. Lien 72h : https://litter.catbox.moe/kqzcfn.mp4
>   Musique appliquée **telle que verrouillée** (piste unique déjà EQ, **0.26**, fade-in 1.5s), fenêtre
>   19.5s→268.167s : démarre après le beat 1 (déjà mixé) et **s'arrête pile à l'écran typewriter**.
> - ⚠️ **La piste (154s) est plus courte que la fenêtre (248.7s) → boucle OBLIGATOIRE par `acrossfade` 4s** :
>   la queue est 5.5 dB plus forte que la tête, un bout-à-bout ferait une couture audible.
> - ⭐⭐ **LEÇON NEUVE — `concat=` seul ne suffit pas** : il a donné **8357 frames au lieu de 8347** parce que
>   l'audio AAC de chaque beat est plus long que sa vidéo (+23 à +63 ms) ; `concat=` étire la vidéo pour
>   rattraper, et ça **s'accumule** (0.38s ≈ 11 frames). **Fix : `atrim` chaque audio à la durée exacte de sa
>   vidéo AVANT le concat.** Vaut aussi pour le Soudan.
> - **Vérifs** : hachage dense 1 f/s sur 278s (276/278 uniques, les 2 plateaux de 2s sont des pauses de
>   contenu confirmées au 1/2 s, **aucun gel**) · −17.1 LUFS · **mix par bande** 200Hz-2kHz : voix −21.9 dB
>   vs musique −42.0 dB = **20.1 dB de marge dans la bande de la voix**.
> - ⏭️ **NEXT = Aziz regarde l'assemblage.** Point pré-existant à trancher (PAS causé par l'assemblage) :
>   **plateau statique ~2s dans le beat 5a** (t≈154s global / local ~13.3s), beat déjà FINAL. Plus les SFX
>   du beat 2 « à revoir à l'assemblage » (note ancienne), non traités.

> ⛔ **BLOC CI-DESSOUS = TRACE** (état 7/8 d'avant cette session). Le beat 4 n'est plus un reste-à-faire.

⚠️ **TOUT le code, le script et le STATUS a jour vivent dans le WORKTREE** `/Users/clawdbot/Workspace/remotion-cfa`
(branche `feat/cfa-nuit1994-svg-mix`). Les copies du repo principal sont PERIMEES.
Source de verite : `remotion-cfa/memory/episodes/souverain/franc-cfa-short/STATUS.md` § **0-OCTIES**.

- **FAIT session 2026-07-26** :
  - **Beat 6b "Le prix du depart" = FINAL** (commit `8c389945`). 1re version REJETEE par Aziz ("trop
    abstrait, je n'arrivais pas a comprendre en quoi tout ceci avait rapport l'un avec l'autre" —
    3 metaphores heterogenes empilees : strates geologiques + sac + presse). Refonte via DA upstream
    3 voix -> **pile de 3 pieces (BANQUE CENTRALE / RESERVES / CONFIANCE) qui s'effondre sur un sac
    dont l'etiquette de prix s'affole**. Lisibilite immediate : une piece EST de la monnaie.
  - **MUSIQUE DE L'EPISODE CHOISIE + MIX VERROUILLE** (commit `eb10da82`).
  - **7 beats FINAUX rassembles** dans `out/_r-and-d/cfa-nuit1994/` du repo PRINCIPAL.

- ⛔⛔ **MUSIQUE = DEVERROUILLEE (2026-07-26, apres visionnage de l'assemblage)** — le bloc
  « MUSIQUE + VOLUME DECIDES / VERROUILLE » ci-dessus (ligne 46) est **ANNULE pour le CHOIX DE LA
  PISTE**. Retour Aziz : « la musique n'est peut-etre pas si adaptee que ça a cette video ».
  → La piste `musique-episode.mp3` et le volume `0.26` **ne sont plus la reference**.
  → ⛔ **AVANT de generer une nouvelle piste : INVENTAIRE + INDEX de l'existant** (consigne Aziz).
    **Mesure 2026-07-26 : 71 pistes musicales deja produites dans `public/`, AUCUN index.** On a
    probablement deja la bonne piste, et on a paye plusieurs fois des variantes introuvables.
    Emplacements : `public/_shared/audio/{soudan,sahel-warmap,sudan-warmap}/music/`,
    `public/souverain/<ep>/audio/`, `public/atlas/<ep>/audio/`, `public/audio/<ep>/`.
    ⚠️ `public/_shared/audio/soudan/music/_rejete-thriller/` = REJETE, ne pas ressortir.
  ⭐ **CE QUI RESTE ACQUIS = la METHODE, pas la piste** : un ecart RMS **global** correct (-18 dB,
  cible Arte/BBC) ne garantit PAS que la voix passe — voix et musique vivaient dans la MEME bande
  200Hz-2kHz (8.2 dB de marge reelle vs 17.9 en global) = **masquage frequentiel**. **Toujours
  mesurer PAR BANDE.** Le volume `0.26` etait calibre POUR l'ancienne piste → **a RECALCULER** pour
  la nouvelle. Le defaut `0.07` de la doctrine aurait donne une musique inaudible ici.
  ⚠️ Ecarter d'emblee une piste a forte amplitude (l'ancienne « A-souverain-nocturne » : 19 dB
  d'amplitude, chutes a -33.7 dB → trous audibles sous la narration).

- ✅ **[FAIT 2026-07-26] Le beat 4 "Qui tient la cle" est PRODUIT** — mais PAS selon la direction
  decrite ci-dessous. ⛔ La direction « la cle voyage vers Paris » (carte plate + flux) a ete
  **ABANDONNEE** : elle rejouait litteralement la carte du beat 2 (meme geo `cfaGeoWide`, meme camera,
  memes arcs France→UEMOA/CEMAC, renomme « garantie » au lieu de « laisse »). Le composant
  `CfaActe4Cle16x9.tsx` n'est PLUS le beat 4 (conserve comme trace).
  → **Le beat 4 est desormais `CfaActe4Filet16x9.tsx`** : un FILET DE SECURITE sous un FUNAMBULE
  (une seule metaphore, lisible en 2s, validee par TEST AVEUGLE) + la scene 1994 conservee et
  extraite dans `CfaActe4Signature1994.tsx`. Commit `72e6e35c`.

- ⏭️ **[PERIME] "PROCHAINE SESSION"** ci-dessous = FAIT (beat 4 + assemblage). Voir le bloc NEXT en
  tete de section. Conserve pour les 2 lecons d'assemblage qui restent VALIDES :
  ⚠️ Assemblage : filtre ffmpeg `concat=` (reencodage reel), **JAMAIS le concat demuxer** sur des actes
  deja issus d'un concat (DTS casses = image gelee avec audio normal, vecu Soudan 4 min). Verifier le
  MOUVEMENT par hachage dense 1 frame/s, jamais des frames isolees.

- ⭐ **REGLE D'EPISODE** : fond unifie `#182746` sur TOUS les beats. La rupture se porte par les OBJETS.
- ⛔ Piste "piece CFA fil conducteur" **ABANDONNEE** (2026-07-25) — ne pas la ressortir.
- 💡 Piste notee (non tranchee) : video separee future sur le sujet Sira/AES.

## ⏳ ACTION OUVERTE — RECHARGER LE CREDIT OPENAI
Quota epuise constate le 2026-07-25 (`429 insufficient_quota`). Bloque `whisper-align.py`,
`transcribe-openai.py` et le garde-fou whisper d'[[AUDIO-PAUSES-DETERMINISTES]].
**Contournement en place** : `scripts/tools/forced-align.py` (moteur ElevenLabs) couvre l'alignement.

## ✅ ARSENAL SVG/D3/FABLE 5 — SYSTÈME GRAVÉ (référence disponible, pas une action à mener — rétrogradé depuis ⭐⭐, session R&D du 2026-07-21)

> Session dédiée à PROUVER de nouvelles capacités (en // de la prod Acte 4 Soudan). Tout référencé + gravé. Ce contenu reste VALIDE (Fable 5 toujours modèle SVG par défaut, protos D3 toujours actifs) mais n'est plus l'action prioritaire — c'est un acquis à consulter au besoin, pas une reprise à faire.

**D3 — 8 protos prouvés** (`src/projects/_rnd/d3-16x9/README.md`, compos `D3-*` dans Root) : réseau force (recompose physique), globe 2.0 (arcs à OCCLUSION réelle), camembert, split-screen, chartogram (carte→donnée), sankey, cartogramme, pie-morph. **Constat : la force de D3 = la CARTO ; les charts restent proches du SVG-maison.**

**FABLE 5 = MODÈLE SVG MAISON par défaut** (gravé CLAUDE.md table modèles + `SVG-SCENES-GENERATIVES.md`) : appelé comme AGENT Claude Code, ZÉRO API, inclus abonnement (~2% quota/semaine pour 5 scènes). Mode élevé (scènes/objets/jetons) · mode MAX (narratif/organique/visage/parallaxe). **Visage organique ≥ Kimi K3.** 3 principaux = Fable+Gemini+GPT ; GLM+Kimi K3 complémentaires (gardés).

**Registres SVG neufs prouvés** : néon/data-terminal (prod-ready), feu/fumée organique (non-figuratif OK). **Portrait-médaillon v2 MAÎTRISÉ** (buste FIXE + colorisation progressive zone par zone + clignements ; PAS de parole). **Village parallaxe 26s** (jour→nuit) = vraie séquence narrative SVG pur.

**⛔ DOCTRINE RECENTRÉE** : notre force = **scène-lieu vivante + objets non-organiques qui voyagent** (cargo, structures) ; le **personnage complet animé = prouvé mais ÉCARTÉ en prod** (« pantin bien animé », pas maîtrisé). ⭐ **AMENDÉ 2026-07-28** : ce verdict ne vaut QUE pour le personnage **RICHE/riggable** (GeminiRig). La **STICK FIGURE DE PROFIL est passée en PRODUCTION** — voir la section REGISTRE STICK FIGURE en tête de ce fichier + `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md`.

**PROCHAINE VIDÉO envisagée = format « RÉCIT-RESSOURCE » majorité-SVG** (mélange 3 moteurs comme Soudan, ratio inversé). Squelette prédonné = 3 protos (`CargoVoyage16x9_LibreInspire`, `ProtoNarratifPlusData`, `ProtoDataVizPleinEcran`) À AUGMENTER avec l'arsenal 2026 (Sankey/chartogram/carte D3/inserts). Détail + vision « cobalt » : `memory/doctrines/SVG-MIDFORM-FORMAT.md` § FORMAT RÉCIT-RESSOURCE. ⛔ RIEN de figé — sujet à valider via pipeline (sujet prime). NON décidé cette session.

---

## 🎬🎬 SOUDAN MID-FORM — v4 PRODUITE, 11/12 PTS FAITS → RESTE RACCORDS AUDIO (MàJ 2026-07-22 nuit)

> **⭐⭐ ÉTAT RÉEL 2026-07-22 nuit — remplace le bloc v3 ci-dessous (désormais « trace ») :**
> - **v4 produite** : 11 des 12 points polish appliqués (audio pauses actes 3/4/5/6 + garde-fou whisper ·
>   SFX count-up + cascade dings ONU · globe début Acte 5 peuplé (⚠️ pas Acte 6, erreur du starter corrigée) ·
>   fade plaque hook · 8 plaques sources actes 1-4). Commit code `828e1d27` sur `feat/soudan-passe-finale-6lots`.
> - **⛔ BUG CRITIQUE trouvé par Aziz après présentation + CORRIGÉ** : image figée ~4min (2:55→7:00, fin
>   Acte3→tout Acte4) due à un concat demuxer sur un acte déjà issu d'un concat interne (DTS cassés). Fix :
>   filtre ffmpeg `concat=` (réencodage réel) au lieu du concat demuxer. Leçon gravée :
>   `.claude/.../memory/feedbacks/feedback_verifier-mouvement-video-pas-juste-frames-isolees.md` ⭐⭐ (ne
>   jamais vérifier un assemblage avec des frames isolées seules — toujours tester le MOUVEMENT).
> - **Livrable v4 (corrigé, vérifié hash MD5 sur 318 frames)** :
>   `out/episodes/soudan-midform/wip/passe-finale-v4/soudan-midform-v4-MIX.mp4` (635.1s) + `-compressed.mp4`
>   (43MB, envoyé à Aziz via litter.catbox.moe — catbox.moe normal instable ce jour, servait des liens vides
>   HTTP 200/content-length=0, préférer uguu.se ou litterbox.catbox.moe en 1er choix jusqu'à nouvel ordre).
> - **RESTE (retour Aziz 2026-07-22 nuit, post-vision v4)** : des raccords où la voix coupe brusquement
>   (timecodes précis à donner par Aziz en session suivante) + 1-2 points mineurs. Point mineur repéré côté
>   Claude (à confirmer avec Aziz, pas forcément un bug) : plateau ~7s dans l'Acte 6 vers 9:10-9:17 (animation
>   veto ONU qui ne bouge plus juste avant la transition suivante).
> - **⏭️ PROCHAINE SESSION : Aziz + Claude EN DIRECT, PAS d'agents** (décision explicite Aziz — chantier plus
>   petit, raccords audio ciblés, pas besoin du parallélisme agentique qui a servi cette session pour les 12
>   points larges). Repartir de `soudan-midform-v4-MIX.mp4`, PAS re-régénérer — méthode pauses déterministes
>   toujours valable (`memory/doctrines/AUDIO-PAUSES-DETERMINISTES.md`), retirer/déplacer une coupe = éditer
>   le manifest JSON concerné (`scripts/tools/soudan-audio/acte{N}-pauses-*.json`) + ré-appliquer + garde-fou.

> ⛔ **TOUT LE CONTENU CI-DESSOUS (daté 2026-07-21) EST UNE TRACE HISTORIQUE PÉRIMÉE** — conservé pour la
> généalogie de la production (Phase 2 Acte 4, 1er assemblage, passe LLM). Ne rien exécuter sur sa base.

> **[TRACE 2026-07-21 soir] — Acte 4 PHASE 2 + 1er assemblage + passe LLM :**
> - **Acte 4 PHASE 2 = FAITE** : 5 lots (flux qui coulent · navire vivant · jetons-portraits Hemedti/al-Burhan +
>   glows RSF/SAF · climax B6 stagger+ondes · frappe Kosti + Nil transparent) + **4 corrections Aziz** :
>   (1) navire PROPORTIONNEL au globe (ne grossit plus au dézoom, prop `camScale`) · (2) RESPIRATION NIL (Le Caire
>   devient crème + TOUS les flux s'effacent ~2,5s pour voir le Nil seul, puis retour ; jetons+géoplaques restent) ·
>   (3) Kosti civils NE REVIENNENT PLUS (figés + disparition totale) · (4) noms de pays B6 en GÉOPLAQUES sombres.
>   Livrable = `out/episodes/soudan-midform/wip/acte4-v14-phase2-full.mp4` (130.8s). Commit `3000dbbe` sur
>   `feat/soudan-acte4-globe-3registres`.
> - **AUDIT JETONS PERSONNAGES NOMMÉS = FAIT** : dérive ISOLÉE à l'Acte 3 (Hemedti Section1+Insert, al-Burhan Insert
>   affichés en sprites génériques portrait-rsf/saf). CORRIGÉ → portrait-hemeti/portrait-burhan. Commit `8481e8b9`.
>   Actes 1,2,5,6 = OK. Renders faits : `/tmp/a3-section1-fix.mp4` + `/tmp/a3-insert-fix.mp4`,
>   concat `wip/acte3-globe-jetons-fix-full.mp4` 125.9s.
> - **1er ASSEMBLAGE 6 ACTES = FAIT** (narration seule, PAS de musique/SFX) : `wip/soudan-midform-ASSEMBLAGE-v1-6actes.mp4`
>   (625.8s = 10min26) + `-compressed.mp4` (720p 30.6mo). Ordre A1(hook 57s)+A2+A3-globe+A4-v14+A5+A6. Raccords OK.
>   Acte 1 récupéré depuis catbox `qc5dgq` = v5-FINAL validé.
> - **PASSE LLM DOWNSTREAM** (doctrine 2 temps) : diagnostic Gemini+Kimi + prospectifs → a produit les 6 lots
>   de la passe finale, puis les assemblages v2 et v3.

> ⛔ **BLOC v12 CI-DESSOUS PÉRIMÉ** (garde la trace de la refonte structurelle Phase 1) :

> **ÉTAT (Phase 1, 2026-07-21) : 6/6 actes CODÉS.** Actes 1,2,3-globe,5-globe,6-globe FINAUX+promus. **Acte 4
> refait cette session en GLOBE D3 3 registres (v12 = base validée Aziz, PAS encore promu FINAL — reste la Phase 2).**
>
> **✅ FAIT cette session — Acte 4 « Même les voisins sont aspirés » refonte structurelle complète :**
> - Passé de Mapbox plat (v8 périmé) à **GLOBE D3**, cohérent avec les Actes 3/5/6. Architecture 3 registres :
>   **bloc globe CONTINU B1→B4** (`SoudanActe4B1toB4Globe.tsx`, compo `D3-SoudanActe4-B1B4-Globe`) — UNE caméra
>   continue qui accumule Russie+flux → Port-Soudan+navire → Égypte → Nil, la carte ne se vide JAMAIS +
>   **insert Kosti** (`Kosti-Beat5-Standalone`, inchangé) + **B6 globe 2.0** (`SoudanActe4B6Globe.tsx`, arcs convergents).
> - Assemblage = concaténation → `out/episodes/soudan-midform/wip/acte4-v12-continu-full.mp4` (130.8s).
> - Retours Aziz appliqués : persistance inter-beats totale · zéro sous-titre (bas = sources) · géoplaques lisibles ·
>   zoom Port-Soudan (navire) · B3 refait sur globe (D3-force rejeté = rupture registre) · cohérence couleur par acteur.
> - **Branche `feat/soudan-acte4-globe-3registres`** (PAS encore mergée master). ⛔ La note « v7 périmé / branche
>   kosti-refonte-k3 non mergée » était fausse (kosti-k3 EST mergée depuis longtemps) — corrigée.
>
> **⏭️ PROCHAINE SESSION — ACTE 4 PHASE 2 (densif + dynamisation) :** starter prêt →
> `memory/starters/STARTER-PROMPT-soudan-acte4-phase2-densif-dynamisation.md`. Les 4 rapports LLM (Gemini+Kimi ×
> densif+dynam, forte convergence) sont dans `episodes/soudan-midform/da-briefs-acte4-phase2/`. 5 lots validés Aziz :
> (1) flux qui coulent (stroke-dashoffset) · (2) navire Port-Soudan vivant · (3) glows contrôle RSF/SAF +
> **jetons-portraits Hemedti/Burhan/Poutine** (couvre partiellement l'audit jetons ci-dessous, pour l'Acte 4) ·
> (4) climax B6 (stagger arcs + onde Khartoum) + frappe Kosti plus violente · (5) B4 drapeau égyptien transparent
> pour voir le Nil. Écartés : logo ONU glitché, minimap PiP, camera-shake, changer couleur des lignes.
>
> **PUIS (plan global mid-form, après Acte 4 FINAL) :**
> - **AUDIO GLOBAL** (Minimax `fal-ai/minimax-music/v2.6` instrumental + SFX) sur tout le mid-form.
> - **ASSEMBLAGE FINAL** 6 actes (concaténation, jamais compo mixte) + visionnage d'enchaînement.
> - **⚠️ AUDIT JETONS PERSONNAGES NOMMÉS** (retour Aziz) — sur TOUS les actes : personnes nommées (Hemedti,
>   al-Burhan, Haftar) = VRAI VISAGE partout (`portrait-hemeti/burhan/haftar`), pas jeton générique. Suspicion :
>   OK Actes 1-2, dérive dès Acte 3+. Le LOT 3 Phase 2 le traite pour l'Acte 4 ; reste Actes 1-2-3-5-6.
> - **⚠️ PASSE LLM DOWNSTREAM sur la vidéo ASSEMBLÉE** — dernier brief Gemini+Kimi (lisibilité/attaque/dynamisme/
>   jetons). Diagnostic Aziz : mid-form commencé TROP CONSERVATEUR, rattraper l'écart début↔fin avant promotion.

---

## 🧪 R&D — D3.js EN 16:9 (elargir le moteur D3 au format horizontal) — SESSION 13 FAITE (2026-07-18)

> **Contexte** : le Short AES 90s (D3 pur, `src/projects/warmap/shorts/aes-short-90s/`, `aesGeo.ts`) prouve
> notre maitrise D3 en VERTICAL. Le moteur est AGNOSTIQUE AU RATIO ; le 16:9 debloque le LATERAL (cote a
> cote, panneaux, frises) que le 9:16 interdit. D3 etait SOUS-EXPLOITE (on n'utilisait que geoMercator).
> **Pourquoi D3 > Mapbox ici** : SVG pur deterministe, controle au pixel, zero WebGL (vs render-mapbox.sh).
>
> **Branche** : `feat/d3-16x9-protos` (commit `716b7ff8` = 5 protos ; A5 pas encore commite au 2026-07-18).
> **Dossier + README** : `src/projects/_rnd/d3-16x9/README.md` (table des protos, socles, palette AES).
>
> ### ✅ PROUVE cette session (protos mecaniques, sans audio, sujet Sahel/AES)
> - **A1 Globe orthographique** (`geoOrthographic` frame-driven, clip hemisphere natif, graticule, halo).
>   VALIDE Aziz ("excellent, controle > Mapbox"). Monde = `public/_rnd/vox-repro/countries-110m.json`
>   (TopoJSON NE 110m) via `topojson-client`.
> - **A1-K1 Raccord globe -> carte parchemin AES** : 1 seule projection ortho dont on augmente le scale
>   (zoom-in jusqu'a courbure imperceptible) + lerp palette bleu->parchemin. VALIDE ("tres smooth").
> - **Jetons/objets/mouvement/dezoom** (`SahelJetonsDezoom16x9`) : jetons ancres project([lon,lat]),
>   jeton en mouvement, base iso, dezoom camera. Prouve que D3 fait tout ce que faisait la video Mapbox.
> - **Comparatif compositing** (`JetonsComparatif16x9`) : buste plante vs medaillon pose vs objet iso.
>   ⭐ LECON GRAVEE `feedback_jeton-iso-pas-d-ombre-externe` : objet iso ILLUSTRE = ZERO ombre externe
>   (sinon flotte) ; buste/medaillon = ombre externe requise. Compositing objets = IDENTIQUE D3/Mapbox.
> - **A5 Carte + panneau data** (`CartePanneau16x9`) : carte gauche 60% + panneau droit 40% qui REAGIT
>   (compteur 0->3 coups, frise chrono qui s'allume, barre population qui monte). La disposition 16:9
>   signature, impossible en 9:16. Chiffres pop = ESTIMES (mention "est." affichee, a sourcer si usage reel).
>
> ### ⭐ VRAIE LIMITE RESIDUELLE identifiee (seule diff D3 vs Mapbox)
> Le **SOL** : Mapbox pose sur terrain raster texture (l'objet s'y fond), D3 sur aplat de couleur uni.
> N'empeche pas les objets d'etre bien poses (compositing OK), mais le "terrain habite" manque.
>
> ### 🎯 BACKLOG PROCHAINES SESSIONS (Aziz veut TOUT + une VRAIE SCENE COMPLETE, 2026-07-18)
> **d3 installe** : d3-array, d3-format, d3-geo, d3-scale. **MANQUE** : d3-force, d3-shape (npm install).
> 1. **⭐ PASSAGE A L'ECHELLE — une VRAIE scene complete** (script + audio + montage). LE SAUT EST FAIT.
>    **✅✅ CANDIDAT N°1 — SOUDAN ACTE 3 "SUIVRE L'OR" GLOBE 2-REGISTRES : PROMU FINAL (2026-07-19, session 15).**
>    Refonte complete validee Aziz : 3 registres (SVG+Mapbox+Globe) → **2 registres (SVG+Globe)**, toute la
>    carte en globe D3. Section 1 refaite en globe (SVG intro + fade doux + North Darfur/Khartoum colores +
>    mines + Hemedti + jetons herites), echelle 6.5 CONSTANTE = raccord parfait avec l'insert (recale 4.4→6.5).
>    SVG argent = billets $ dores (au lieu du liquide abstrait). 3 plaques de sources reelles (Amnesty/WaPo/
>    Chatham House, fact-check jury 2026-07-09), sans le mot "Source:".
>    **Livrable** : `out/PRET-PUBLICATION/soudan-midform/soudan-acte3-suivre-lor-globe-FINAL.mp4` (l'ancien
>    Mapbox `-FINAL.mp4` reste INTACT, Aziz choisit lequel publier). Code : `SoudanActe3Section1Globe.tsx` +
>    `SoudanActe3GlobeInsert.tsx`. Branche `feat/soudan-acte3-globe-d3`.
>    Moteur globe reutilisable grave : `.claude/.../memory/feedbacks/feedback_globe-d3-moteur-cartographique-reutilisable.md`.
>    **✅ ACTE 5 "le reseau qui arme" = FAIT + PROMU FINAL v5 (2026-07-19)** — refait en GLOBE D3 INTEGRAL
>    (le decoupage hybride globe/Mapbox envisage a ete abandonne au profit du globe integral : 0 couture).
>    Voir section Acte 5 en bas de ce fichier + `episodes/soudan-midform/STATUS.md`. Le moteur globe est
>    desormais prouve sur 2 actes (3 et 5). Acte 6 (verrou institutionnel) = script+audio+storyboard FAITS (2026-07-19), CODE a faire (voir section Acte 6 en tete de fichier).
> 2. **SOL ENRICHI** (Aziz a dit OUI) : polygone D3 avec degrade radial + grain + ombre interne + relief
>    simule, pour voir si D3 rattrape le "terrain habite" Mapbox et fermer le debat objets-poses.
> 3. **Waouh globe 2.0** : arcs de trajectoire `geoInterpolate` (effet vol d'avion sur la sphere),
>    terminateur jour/nuit, globe fil conducteur qui pivote entre chapitres.
> 4. **Data-viz cartographique** : choroplethe animee (`d3-scale` sequentiel + legende), cartogramme
>    (pays deformes selon une valeur), small multiples (meme carte x N annees en grille).
> 5. **Flux & reseaux** : A2 reseau de force (`d3-force`, structure de pouvoir/dependance) + A3 rubans de
>    flux (`d3-chord`/`d3-shape`, ou va la ressource/l'argent — complete l'AES qui montre QUE, pas OU).
> 6. **Registre videoludique** : A6 HUD tactique salle d'operation (reticules, leader lines, scan-line,
>    compteurs live) + A7 timeline-scrubber horizontale (curseur qui declenche des events sur la carte).

---

## 🧪 R&D — WORKFLOW "VOX PAPERCRAFT" (reproduire un style vidéo tiers sans Higgsfield) — 1re PARTIE VALIDÉE (2026-07-17)

> **PROTO CONCLUANT, pipeline officialisé.** Prouvé qu'on reproduit le style Vox/Higgsfield en HYBRIDE
> déterministe (images Gemini 3.1 Flash réutilisables + overlays Remotion), au niveau du tiers, pour des
> centimes vs ~200 crédits/vidéo re-tirés chez Higgsfield. Boucle de raffinement V1→V2 (notre rendu +
> réf → Gemini compare → écarts croisés Gemini/Claude/Aziz) validée.
>
> **Doctrine + méthode complète** : `memory/doctrines/REVERSE-STYLE-VIDEO-VERS-ASSETS.md`.
> **Scripts** : `gemini-vox-reverse-breakdown.py` (breakdown), `gemini-compare-2videos.py` (diff V2),
> `gemini-genimg-ipv4.sh` (génération image, corrigé extension JPEG/PNG).
> **Livrables R&D** : composition `Vox-Papercut-Avion-16x9` (`src/projects/_rnd/svg-scenes/VoxPapercutAvion16x9.tsx`),
> 6 assets + rendus dans `public/_rnd/vox-repro/`, vidéo `out/_r-and-d/vox-papercut-avion-v2.mp4`.
>
> ⭐ **NEXT (prochaine session, quand Aziz veut)** : finitions restantes du plan (halo détourage résiduel,
> retirer noms d'États sur la carte, intégrer photo halftone) ; puis monter une SÉQUENCE multi-plans ;
> décider si on officialise ce format "motion graphic V2" comme brique de production réutilisable.

## ✅✅ SHORT SÉNÉGAL PÉTROLE & GAZ — VERSION D3.JS : COMPLET, PROMU PRET-PUBLICATION (2026-07-17 s12)

> **TERMINÉ.** Short vertical (9:16, D3.js/SVG pur — pas Mapbox), dérivé de la vidéo longue Sénégal,
> registre Short AES 90s. Les 5 beats + assemblage + audio complet sont faits et validés Aziz.
>
> **Livrable** : `out/PRET-PUBLICATION/senegal-petrole-gaz-short-d3-FINAL.mp4` (112.96s, full HD) +
> lien durable Vercel Blob. Composition = `SenegalShortD3-COMPLET` (`ShortComplet.tsx`, 5 beats +
> narration + musique AES + SFX dont 2 générés ElevenLabs : vault-lock, typewriter).
>
> ⭐ **NEXT (seule action restante, administrative — pas de production)** : programmer la publication
> via TryPost (Shorts YouTube + IG + FB, cf. `memory/tools/trypost.md`).
>
> Détail complet : `memory/episodes/souverain/senegal-petrole-gaz/STATUS-SHORT-D3.md`.
>
> **Gotcha réutilisable (leçon)** : `scripts/visual_review.py` peut bloquer en SYN_SENT IPv6 (9m+ sans
> erreur) — vérifier `lsof -p <pid>` avant de conclure à une lenteur Gemini normale. Et sur ce beat sans
> storyboard, Gemini review hallucine une palette sépia fantôme (juger sur override tracé + Aziz).

## ✅✅ SOUDAN MID-FORM — ACTE 5 : REFAIT EN GLOBE D3, PROMU FINAL v5 (2026-07-19)

> **TERMINÉ + PROMU.** Acte 5 entièrement REFAIT en GLOBE D3 intégral (abandon Mapbox), densifié, review
> Gemini/Kimi appliqué, validé Aziz. Moteur globe D3 prouvé sur 2 actes (3 et 5).
> **Livrable** : `out/PRET-PUBLICATION/soudan-midform/soudan-acte5-reseau-ombre-FINAL.mp4` (+ `_compressed`).
> **Code (le vrai livrable)** : `src/projects/_rnd/d3-16x9/SoudanActe5Globe.tsx` (compo `D3-SoudanActe5-Globe`).
> **Branche** : `feat/soudan-acte5-globe` (mergée dans master, commit d92ef780). Détail : `episodes/soudan-midform/STATUS.md` § tête.
>
> ⛔ **PÉRIMÉ** : mise en scène Mapbox actée s12 (100% carte, insert chirurgical, arbitrage Abou Dabi,
> diagnostic densification à trier), code `warmap/soudan-acte5/SoudanActe5.tsx` (v2), et starter
> `STARTER-PROMPT-soudan-acte5-densification.md` — tous remplacés par le globe. Trace uniquement.
>
> **Décision structurelle (rappel, session 10)** : Acte 5 = fait concret (réseau EAU-Libye) ; Acte 6 =
> verrou institutionnel détaillé + conclusion (**script+audio verrouillés + storyboard actés 2026-07-19, CODE à faire**). Pont Acte 4 déjà verrouillé valable
> pour les deux.

## 🗄️ SOUDAN MID-FORM — ACTE 4 (Mapbox v7, PÉRIMÉ 2026-07-21) : REFONTE BEAT 5 KOSTI + 4 LOTS s10 — TRACE HISTORIQUE

> ⛔ **PÉRIMÉ (2026-07-21)** : l'Acte 4 a été INTÉGRALEMENT REFAIT en GLOBE D3 3 registres (voir section tête de
> fichier + `episodes/soudan-midform/STATUS.md`). L'architecture Mapbox décrite ci-dessous (carte continue Mapbox +
> lots zoom/caméra) est ABANDONNÉE. **NE PAS repartir dessus.** Seul l'insert Kosti (Beat 5, `Kosti-Beat5-Standalone`)
> reste VALIDE et réutilisé tel quel dans le globe. Section conservée UNIQUEMENT pour : les leçons méthodologiques
> (sous-dimensionnement récurrent `WARMAP-GRAMMAIRE.md`, doctrine Tremblay règle 10 `DOCTRINE-SCRIPT-UNIFIEE.md`) et
> l'historique de production Kosti K3 (toujours pertinent, l'insert n'a pas changé).
>
> ⚠️⚠️ **CHANGEMENT 2026-07-17 (trace) — le Beat 5 (Kosti)
> a été REFONDU** — la carte Mapbox top-down (drone illisible sur fond crème) est REMPLACÉE par un **INSERT
> SVG plein écran** (`src/projects/warmap/soudan-acte4/KostiInsertSVG.tsx`), monté dans `Section4` de
> `SoudanActe4.tsx`. Décidé + validé Aziz par proto (`KostiFrappeProtoV3`, litter.catbox `xxm8ic`).
> Registre "carte d'état-major civil" : 6 jetons civils (portraits distincts) qui s'éteignent à la frappe +
> notre drone-rsf-td.png + Nil animé, sur une composition de base proposée par GPT-5.6 Sol. Calé sur la
> narration p4. **CONSÉQUENCE : le render v7 (`acte4-v7-full.mp4`) est PÉRIMÉ pour le Beat 5 → RE-RENDER
> COMPLET de l'Acte 4 nécessaire avant toute promotion.** Doctrine appliquée : `MOTEURS-VISUELS-ET-SOCLE.md`
> (intention "coût humain incarné" = QUOI/COMMENT → insert SVG, pas carte). L'ancien code carte Beat 5
> (DroneStrikeImpact/CAM4/HookDisplacementBurst) est laissé dans le fichier mais NON monté (récupérable via
> git si besoin). Reste à faire par Aziz : re-render Acte 4 complet + visionner le Beat 5 intégré (calage
> audio + transition avec Beat 4 et Beat 6).
>
> ⚠️⚠️ **2e CHANGEMENT 2026-07-17 (session Kimi K3) — branche `feat/kosti-refonte-k3`, NON mergée** : la
> STATION-SERVICE et le corps du DRONE du Beat 5 sont désormais dessinés par **Kimi K3** (test vision→SVG
> one-shot) et rendus INLINE (`StationDecor` + `DroneBodyK3`). Le sprite `drone-rsf-td.png` et le décor
> externe `kosti-sol-decor-noriver.svg` ne sont PLUS rendus (fond redessiné inline `MapBackdrop`, route
> ajoutée reliant la file aux pompes, Nil affiné). Mentions inventées par K3 retirées. Re-render isolé validé
> Aziz (compo `Kosti-Beat5-Standalone`). **Commits bd302d24 + 718244f3 sur `feat/kosti-refonte-k3` (NON
> mergée à master).** Reste : merge branche + re-render Acte 4 complet (jamais fait sur la version K3).
> Détail R&D K3 : `memory/tools/openrouter-svg.md` § Kimi K3.
>
> **PRIORITÉ 2.** Suite au visionnage du v6 (session 9) par Aziz, refonte en profondeur en 4 lots
> (chacun vérifié par render isolé avant intégration) :
> 1. **Beat 1 (Russie/Wagner)** : zoom Moscou dézoomé (6.4→3.6, le territoire filtré se lisait comme un
>    point isolé) + bascule 2024 fusionnée en un seul mouvement caméra (au lieu d'un aller-retour saccadé).
> 2. **Beat 5 (Kosti, drone)** — ⛔ **PÉRIMÉ 2026-07-17** : ce lot (pattern MapAnimation sur CARTE Mapbox,
>    sprite 40→95px, trajectoire) est REMPLACÉ par l'insert SVG plein écran (voir bloc CHANGEMENT en tête de
>    section). Conservé ici comme trace historique du lot s10 uniquement — ne PAS coder d'après cette ligne.
> 3. **Beat 2 (Port-Soudan)** : insert SVG plein écran abandonné, retour à la carte. Jeton naval iso/topdown
>    généré GPT-5.6 Sol (choisi par Aziz après comparaison sur la vraie carte, `_rnd/PortSoudanJetonCompare.tsx`),
>    agrandi +50% (140→210px, sous-dimensionnement récurrent identifié sur tout l'acte, cf doctrine gravée
>    ci-dessous).
> 4. **Beat 3-4 (Égypte/Nil)** : zoom resserré (4.0-4.6→5.2-5.8), `CountryParchmentMask` (généralisé de
>    `RussiaParchmentMask`) appliqué à l'Égypte, drapeau égyptien retiré de cette section (écrasait le
>    masque à 92% opacité — bug diagnostiqué par indicateur de debug temporaire, cf leçon gravée). Nil :
>    `GradientPathReveal` abandonné au profit d'un simple éclaircissement du tracé natif déjà dessiné par
>    le fond de carte.
> 5. **Beat 6 (synthèse 4 puissances)** : séquençage temporel (chaque puissance apparaît l'une après
>    l'autre + convergence finale avec halo) remplace 4 panneaux fixes qui occupaient ~40% de l'écran en
>    permanence (retour Kimi via Aziz).
>
> Render complet v7 fait (`out/episodes/soudan-midform/wip/acte4-v7-full.mp4`, catbox
> `https://files.catbox.moe/riedly.mp4`, override tracé). **PAS encore promu FINAL** — en attente du
> visionnage complet par Aziz (audio+visuel, pas juste des frames) avant promotion.
>
> **Acte 3 « Suivre l'or » reste FINAL et promu**, aucun changement : `out/PRET-PUBLICATION/soudan-midform/
> soudan-acte3-suivre-lor-FINAL.mp4` (+ `_compressed`), catbox `https://files.catbox.moe/y2swv7.mp4`.
>
> **Historique Acte 2** (FINAL, promu) : `out/PRET-PUBLICATION/soudan-midform/soudan-acte2-blocage-FINAL.mp4`
> · catbox `jgvhr2` (93.6s, 9 beats). Code : `src/projects/warmap/soudan-acte2/SoudanActe2.tsx`.
>
> **Leçon transversale gravée cette session dans `WARMAP-GRAMMAIRE.md`** : sous-dimensionnement récurrent
> (whip pan trop serré, drone 40px, jeton 140px, flash noyé) — pattern nommé explicitement par Aziz comme
> répété "à travers l'acte 4 et autres", pas un bug isolé par beat. Doctrines sœurs déjà existantes pour
> ce même biais dans d'autres registres : `SOUVERAIN-REMOTION-PLAYBOOK.md` (textes/graphismes trop petits,
> règle 40-60%), `WORKFLOW-DATAVIZ.md` (pictos sous-dimensionnés, +40-50%).
>
> **Leçon méthodologique gravée dans `DOCTRINE-SCRIPT-UNIFIEE.md`** (règle 10, doctrine Tremblay) : une
> doctrine d'écriture appliquée comme une checklist mécanique plutôt qu'un ressenti phrase par phrase
> produit un résultat PIRE que l'original (script Acte 5, connecteurs de présence plaqués détectés
> immédiatement par Aziz). 2e occurrence du même biais méthodologique déjà gravé pour la gate générale
> (2026-07-10) — cette fois sur la règle 10 spécifiquement.
>
> 💡 **Option disponible pour PLUS TARD** : une fois l'Acte 4 validé et l'Acte 5/6 avancés, le skill
> `passe-amelioration-scene` (doctrine `memory/doctrines/PASSE-AMELIORATION-SCENE-PAR-SCENE.md`) est un
> candidat naturel pour un audit qualité global de l'épisode complet. Aziz demandera explicitement ce
> skill le moment venu — ne pas le lancer de soi-même avant qu'il ne le dise.

---

## ✅✅ SOUDAN — moteur d'affrontement 2 factions = BRIQUE PRÊTE POUR ACTE 2 (session 2026-07-06)
> 🔧 Section historique conservée pour le contenu moteur. Le §NEXT ci-dessous est PÉRIMÉ (hook + Acte 1 FAITS
> en session 3 — voir la section Soudan en tête). Ces briques (`warmapChoc`/`KhartoumChocSVG`/`FrontOuvertSVG`)
> servent l'ACTE 2 selon le plan registres (`STORYBOARD-ACTE2` : beat 5 insert, beat 6 bloc).


> Le proto mono-faction du matin (`KhartoumEtatMajorSVG`, committé `c59d0dd`) a été ÉTENDU en un
> **moteur d'affrontement à 2 factions (RSF vs SAF) + 2 variantes, VALIDÉS par Aziz** (« les deux
> versions sont très bon »). Code : `src/projects/warmap/_shared/warmapChoc.tsx` (moteur paramétré
> `Faction` — RSF/SAF = 2 instances, jamais de « R »/« S » en dur) + `KhartoumChocSVG` (A : RSF
> assaut, SAF défend le palais, choc, bascule accentuée) + `FrontOuvertSVG` (B : front sinueux qui
> tient puis cède par un point de rupture = brique directe Acte 2 impasse militaire).
> Commits `351514e` (moteur) · `3974235` (flèches de manœuvre + zones + encerclement) · `9920643`
> (HOOK d'ouverture "l'or du Darfour" SVG parchemin/encre) sur branche DÉDIÉE `feat/warmap-insert-2factions`
> (⚠️ working tree Short Sahel préservé, non emporté). Renders catbox : A `2psuqm` · B `hihedl` ·
> hook `kes6he`. Doctrine amendée (3 règles : flèche→mouvement, SweepZone territorial, densité jetons).
>
> ℹ️ Clarifié : le proto n'a jamais eu de place dans un storyboard (pas de beat écrit) — R&D pure.
> Le hook "l'or du Darfour" est retrouvé + reskiné (asset Soudan). On est en **croissance du moteur**.
>
> ⛔ **§NEXT ci-dessus PÉRIMÉ (2026-07-10)** — datait d'avant les sessions 3-7 où Actes 1-2-3 sont FAITS/promus
> (Acte 3 FINAL PROMU 2026-07-11), Acte 4 est SCRIPT VERROUILLÉ v5. Voir la section Soudan en tête
> de fichier pour l'état réel. Conservé seulement pour le contenu moteur historique (warmapChoc/commits).
>
> État complet : `memory/episodes/soudan-midform/STATUS.md`.

---

## ✅✅✅ SHORT AES 90s — COMPLET (musique+SFX+durée), PROMU PRET-PUBLICATION (MàJ 2026-07-11)

> ✅✅✅ **Finitions audio TERMINÉES (2026-07-11)** : musique `music-D-montee-maitrisee.mp3` (volume 0.10,
> reprise de la vidéo longue AES), SFX ajoutés (ping sur traces de contour, whoosh remplacé par ping au
> climax AES, cedeao-snap sur la fracture, ding blip-bubble sur France + coups d'État, counter-tick en
> boucle sur le count-up 60 ans, animations en boucle sur icônes ressources or/uranium/pétrole), durée
> rallongée 91.9s→93.5s (2802 frames) pour laisser la narration finir. Livrable :
> `out/PRET-PUBLICATION/aes-short-90s-FINAL.mp4`. Code : `src/projects/warmap/shorts/aes-short-90s/`
> (compo `AES-Short-Full`).
> **NEXT = programmer la publication** (Short → TryPost, cf `memory/tools/trypost.md`).
> Détail production initiale : `memory/episodes/warmap-sahel/SHORT-90S-PRODUCTION-2026-07-08.md` · socle
> figé : `.claude/.../memory/aes-short-socle-valide.md`.

---

## ✅✅ SÉNÉGAL V3 — TERMINÉ + PRÊT-PUBLICATION (2026-07-05)

> Branche `fix/senegal-v3-passe-finition`, commits `207d223` (ROUND 1+2) et `606aff4` (marge respiration).
> ROUND 1 : 10 bugs corrigés (dédoublements audio, écran gris Mapbox structurel, carte gisements
> harmonisée, SFX parasites, point Dakar, texte épuré). ROUND 2 : mot "précise" tronqué, mot "trois"
> répété/coupé (résolu en faisant jouer le mot en entier + décalage de 5 frames côté scène suivante,
> plutôt qu'une coupe en plein son), musique gisements absente, silence "décide...vraiment du résultat"
> (endAt étendu +1.5s pour respiration), labels texte scène coin supprimés, écran gris de transition
> supprimé. Tout validé Aziz par extraits ciblés + mini-renders à chaque itération.
> **Livrable final** : `out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4` (+ `-compressed.mp4`).
> ✅ **Thumbnail finalisée et validée (2026-07-11, Pipeline C)** : "PÉTROLE : LE PIÈGE SÉNÉGALAIS ?"
> (baril enchaîné + LED "132%" = dette publique/PIB citée au script, carte Sénégal + Dakar marqué).
> Fichier : `public/_shared/thumbnails-library/senegal-petrole-gaz/senegal-piege-baril.png`.
> **NEXT** = titre à définir, puis upload MANUEL YouTube Studio (même décision que War-Map Sahel AES,
> cf `memory/tools/trypost.md` — vidéo longue = Studio pour garder Test & Compare).
>
> 💡 Note (réflexion Aziz 2026-07-05) : cette vidéo (1ère avec le système Mapbox complet) a été longue en
> R&D mais constitue un gabarit réutilisable avec War-Map Sahel AES (2e vidéo Mapbox) — à consulter
> explicitement lors du prochain projet Mapbox pour vérifier le gain de vitesse x2-3 espéré, plutôt que
> de laisser ces briques enfouies dans le code sans être re-référencées.

---

## ✅✅ PESTE 1347 — BUG GÉO + AUDIO CORRIGÉS, VALIDÉ AZIZ (2026-07-01)

> Livrable : `out/PRET-PUBLICATION/peste-1347-FINAL.mp4` (42 Mo, 103.4s). Catbox : files.catbox.moe/hptvlc.mp4
> Fix géo (territoires d'outre-mer rouges Beat1/2/3) + fix mix (musique 0.04, narration continue sans cuts).
> **VALIDÉ AZIZ** — transitions fluides, musique bien dosée. NEXT = programmer publication TryPost (comme cacao/GGW).
> **2 chantiers actés pour PROCHAINE SESSION** (détail : `episodes/peste-1347/STATUS.md` § PROCHAINE SESSION) :
>   1. Régénérer la narration avec le pipeline voix vivante (`PIPELINE-VOIX-VIVANTE-VALIDE.md`, Océane V3 + tags
>      + Speech-to-Speech GéoAfrique) — la narration actuelle (2026-05-15) est antérieure à ce pipeline (2026-06-10),
>      jugée "monotone" par Aziz par comparaison avec cacao/GGW.
>   2. Lancer un système multi-agent pour proposer des idées d'amélioration sur l'épisode (post-fix), en tenant
>      compte des acquis récents (personnage-vivant-svg, patterns SVG, etc.) — décider le type d'agents en session.

## ✅✅ CACAO + GGW — PUBLICATIONS PROGRAMMÉES (2026-07-01)

> Cacao : YT 2026-07-01 14h UTC · GGW : YT 2026-07-03 14h UTC (posts séparés YT vs IG+FB, TryPost n'a pas de
> caption par-plateforme — leçon gravée dans `memory/tools/trypost.md`). GGW coverB corrigé (bug sample-rate
> 44100/48000 qui ralentissait l'audio). TikTok reste manuel (compte en quarantaine).

## ✅✅ CACAO → CHOCOLAT SHORT — TERMINÉ, PRET PUBLICATION (2026-06-29)

> Short SVG vertical 9:16 (98,5s), pilier Souverain, registre encre/parchemin GGW. COMPLET et validé Aziz.
> **Livrable : `out/PRET-PUBLICATION/cacao-chocolat-FINAL.mp4`** · Catbox 72h : https://files.catbox.moe/bvbm63.mp4
> 5 beats (B1-B5) + musique B + SFX (palette GGW réutilisée + 4 créés, ALIGNÉS force alignment) + usine aux couleurs CI.
> Compo Remotion = `Cacao-FULL` (CacaoChocolatFull.tsx). ⛔ NE PAS refaire/re-rendre sans raison.
> **NEXT = PUBLIER** : trypost (YT+IG+FB) / postiz (TikTok — mais TikTok en quarantaine, cf bilan distrib).
>   Vu le bilan : prioriser YouTube + Facebook. Le short = teaser vers la version LONGUE (CTA renvoie au long).
> Détail session : `episodes/souverain/cacao-chocolat-short/STATUS.md` (§ TERMINE). Decisions Aziz tracees dedans.

## ✅ 4 REGISTRES VIDEO LONGUE SVG — FAIT (refactoring SVG + Grand Inga ont suivi) (2026-07-02)

> ✅ FAIT depuis (GeminiRig déplacé dans `_shared/`, `ProtoMap2dEncre.tsx` créé) — starter archivé :
> `memory/archive/starters-perimes-2026-07-11/STARTER-PROMPT-refactoring-svg-et-map2d.md`.
> Session du 2026-07-02 : grammaire visuelle SVG COMPLETE — 4 registres valides pour video longue :
> 1. Narratif SVG (deja grave) · 2. Data-viz plein ecran Vox (GridBackground + bar/donut/counter) ·
> 3. Presentateur+data (personnage devant ecran + bulles de dialogue) · 4. 2D flat maps d3-geo (a tester).
> Cross-fade narratif->data-viz prouve en MP4 (`out/_r-and-d/narratif-plus-data-proto.mp4`).
> Doctrine mise a jour : `memory/doctrines/SVG-MIDFORM-FORMAT.md` § 4 REGISTRES.
> **Protos crees** : ProtoDialogueEcran, ProtoDataVizEncre, ProtoDataVizPleinEcran, ProtoNarratifPlusData,
>   ProtoCadrages, ProtoFaceAFace, ProtoFaceExpressions (dans `_rnd/svg-scenes/`), ProtoFuguPoseBankWalk
>   (⚠️ archive dans `_rnd/svg-scenes/_archive/`, exclu du build).
> **Audit SVG (3 agents)** : GeminiRig a deplacer de `_rnd/` vers `_shared/`, 10+ vieux protos a archiver,
>   GridBackground/donut/bar chart dupliques, palette a harmoniser, documentation SVG en retard.
> **2 chantiers prochaine session** (ordre) : (1) refactoring SVG via agents Sonnet, (2) test carte 2D flat d3-geo.

## ✅ SEEDANCE PERSONNAGE — TECHNIQUE PROUVÉE, ÉCARTÉE PAR DÉCISION (coût) — backlog conditionnel, SVG reste la voie par défaut (2026-07-04)

> **Test complet fait et réussi** (3 clips, pêcheur, 3 lancers de filet — voir détail technique
> ci-dessous), **MAIS décision d'Aziz après coup : ne PAS adopter Seedance comme méthode par défaut
> pour les personnages.** Raison = le coût (~6.85$/clip de 10s, donc ~18-20$ pour une seule scène
> personnage complète) est disproportionné pour une piste encore en phase de test/itération — surtout
> qu'en pratique plusieurs essais sont souvent nécessaires avant d'obtenir le bon résultat. Verdict
> d'Aziz : "de la folie, un peu trop cher pour l'instant" pour ce qu'on fait actuellement.
>
> **Ce qui reste vrai et acquis (ne pas re-tester, c'est prouvé)** : Seedance PEUT très bien animer
> notre registre encre minimaliste (aucune dérive de style), suivre un prompt narratif riche (lancer,
> halage, retournement, dépôt précis dans un panier, pieds ancrés en permanence) sans storyboard multi-
> images. Si le budget/contexte change un jour (scène ponctuelle à fort enjeu, budget dédié), la méthode
> documentée plus bas reste directement réutilisable telle quelle.
>
> **Décision actée pour la suite immédiate** : privilégier et consolider la piste SVG organique (le
> registre qu'on maîtrise, prouvé sur GGW/cacao/cargo) plutôt que des personnages articulés complexes en
> attendant une meilleure solution de rig. Retirer/réduire les personnages organiques compliqués des
> scènes plutôt que de continuer à batailler avec leur coût (temps de code OU argent Seedance) tant
> qu'aucune des deux voies n'est pleinement satisfaisante. Cohérent avec la discussion actée avec Aziz :
> le personnage animé n'est PAS un prérequis pour des vidéos captivantes (GGW et cacao le prouvent déjà,
> quasi zéro personnage animé, sujet+carte+data-viz suffisent) — le personnage est un AJOUT ponctuel,
> pas une fondation manquante. Chantier séparé identifié pour plus tard, PAS prioritaire : représenter
> des FIGURES RÉELLES NOMMÉES (ex. Yacouba Sawadogo pour GGW) — barre de qualité différente (portrait
> fidèle vs personnage générique), à traiter à part si/quand ça devient pertinent.
>
> **Détail technique de la méthode (conservé pour référence future, PAS à appliquer par défaut
> maintenant)** :
> 1. UNE SEULE image source (pas de storyboard multi-panels envoyé à Seedance — cette technique
>    "reference-to-video" a un historique d'échec 0/3 à 0/5 sur tout style non-standard testé avant,
>    cf `memory/tools/seedance-rules.md` règles 75/76/83/86/97).
> 2. Prompt NARRATIF (verbes d'action enchaînés en langage naturel : "il lance, il se retourne, il
>    dépose"), PAS de timecodes frame-exacts — Seedance exécute l'INTENTION du geste, pas une partition
>    chronométrée (règle 29).
> 3. Clause STRICT STYLE FIDELITY obligatoire (registre non-standard) + identity lock + interdits
>    explicites (no text/dialogue/particules). `aspect_ratio` natif API, `generate_audio: false`.
> 4. Le décor (océan/ciel/chalutier/pirogue) reste ENTIÈREMENT en SVG codé — seul le personnage+geste
>    serait délégué, pas de rupture visuelle car même décor SVG en frame source.
> **Leçon méthodologique générale (au-delà de Seedance)** : lors d'une vérification vidéo, échantillonner
> SERRÉ (tous les 0.3-0.5s) autour des beats narratifs attendus avant de conclure à un échec — un premier
> passage avait conclu à tort à un échec (dépôt dans le panier "manqué") simplement parce que
> l'échantillonnage était trop grossier (toutes les 2s) et ratait la fenêtre exacte du geste.
>
> **Fichiers conservés** (pas supprimés, coexistent avec le rig codé) : `PecheurSurpecheSeedance16x9.tsx`
> (`RND-PecheurSurpecheSeedance16x9`), clips `public/_rnd/pecheur-seedance/cast{1,2,3}.mp4`, scripts
> `scripts/tools/seedance-pecheur-cast{2,3}.py`. Render : https://files.catbox.moe/24fbuy.mp4.

## ✅✅ 16:9 NARRATIF + PERSONNAGES — 4 chantiers + mix-and-match + indexation TERMINÉS (2026-07-04)

> Session 2026-07-04 (2 passes) : les 4 chantiers du 07-03 sont FAITS, PUIS la scène pêcheur a été
> upgradée (svg-scene-upgrade.py Gemini+GPT) et recomposée en mix-and-match, ET un chantier d'indexation
> d'objets visuels (arbres/océan/bateaux/etc., demandé par Aziz après avoir vu qu'aucun objet dessiné
> n'était réutilisable) a été fait en parallèle par agent. **MUSIQUE validée par Aziz** (cordes minimales
> sahel-warmap — ton correct pour le sujet, gardée).
>
> **1-4 (1re passe)** : extraction motion.ts (camAt/lerpHex/buildHorizonPath/sequenceExclusive/
> objectVisualBottom) · raccordement ProtoNarratifPlusData→CargoVoyage16x9_LibreInspire · cadrage serré
> personnage prouvé (ProtoCueilletteGrosPlan16x9, bug main↔objet corrigé par calcul algébrique plutôt
> que par l'œil — leçon clé) · 1re version de PecheurSurpeche16x9.tsx (filet en pointillé, chalutier/
> pirogue en formes géométriques brutes, poisson via 2 échecs LLM Qwen/GLM puis codé main).
>
> **2e passe — MIX-AND-MATCH + INDEXATION (demandée par Aziz après visionnage)** :
> - **Constat d'Aziz, juste** : la scène pêcheur ne réutilisait RIEN visuellement (océan/ciel/soleil du
>   cargo recodés en double, chalutier/pirogue improvisés) — seule la MÉCANIQUE (camAt, rig) était
>   partagée, pas les OBJETS. Comparé aux grands studios qui indexent tout objet créé.
> - **Chantier indexation (agent dédié, cacao+GGW)** : 3 éléments extraits de `cacao-chocolat-short/`
>   vers `svg-library/elements/agriculture/` (cacaoyer, cabosse ouverte, usine transformation) + 2
>   exclusions justifiées (PlanteurEncre = doublon obsolète de StickRig/GeminiRig ; TabletteMorphBarre =
>   trop couplée au chiffre du short cacao, pas un objet générique).
> - **Ciel/océan du cargo extraits** : `SoleilHaloRadial.tsx` + `OceanProfondeurVagues.tsx`
>   (`svg-library/elements/ciel/` et `elements/ocean/`) — `CargoVoyage16x9_LibreInspire.tsx` REFACTORISÉ
>   pour les consommer (zéro régression visuelle vérifiée par render). `CloudQwenGravure.tsx` déjà
>   partagé (juste mal rangé dans `_rnd/` au lieu de `_shared/` — pas déplacé, hors scope).
> - **Mix-and-match upgrade Gemini/GPT** (brief générique "ta meilleure version de cette scène", frame
>   SANS personnage envoyée pour éviter que les modèles le retouchent — leçon des échecs précédents) :
>   chalutier retenu = Gemini (plus détaillé/menaçant) → `ChalutierGemini.tsx`. Pirogue + ciel retenus =
>   GPT (motifs bois peints, plus sobre/cohérent charte) → `PirogueGPT.tsx`. Filet retenu = Gemini
>   (maillage/plombs/éclaboussures) → `FiletGemini.tsx`. Tous dans `svg-library/elements/peche/`.
> - **3 bugs réels trouvés et corrigés en vérifiant par render (pas juste "ça compile")** :
>   1. `seaColorDeep` codé en constantes bleu-froid FIXES, jamais réchauffées par la palette temporelle
>      → au crépuscule (ciel orange), le rectangle de profondeur océan restait bleu et se lisait comme
>      un bloc dissonant qui coupe l'écran. Fix : dériver `seaColorDeep` de `seaColor` (déjà réchauffé).
>   2. **Composition de `transform` SVG avec scale+translate** : `translate(-apex) scale(s)` scale
>      autour de l'origine DÉJÀ translatée, pas du point voulu — corrigé en ordre `scale(s)
>      translate(-apex)` (le point recentré à 0,0 devient le pivot naturel du scale). Piège répété 2 fois
>      dans la même session (1er essai avec `style={{transformOrigin}}` CSS, inefficace en SVG statique).
>   3. **Composant non recentré = coordonnées natives qui sortent du cadre** : `FiletGemini` gardait ses
>      coordonnées sources (apex à x=750,y=820) sans jamais les recentrer sur (0,0) — composé avec la
>      position du personnage, l'apex réel sortait du cadre visible (y calculé à 1278 sur un cadre 1080)
>      → filet invisible malgré opacity=1, bug diagnostiqué par calcul, pas résolu à l'œil. **Leçon
>      générale reconductible** : tout composant `svg-library/elements/*` DOIT recentrer ses coordonnées
>      natives sur (0,0) en interne (comme fait correctement pour PirogueGPT/ChalutierGemini) — vérifier
>      ce recentrage EXPLICITEMENT avant tout nouveau composant extrait d'un SVG source à coordonnées
>      absolues.
> Render final : `/tmp/pecheur-mix-final.mp4` (12 Mo, upload catbox en cours).
> **NEXT si repris** : option 2 (caravane sel/camion — 2 véhicules à vitesses différentes dans la même
> couche, vraie inconnue technique jamais testée) ou option 3 (cabosse→conteneur) si Aziz veut itérer.
> Le catalogue `svg-library/elements/peche/` (chalutier/pirogue/filet/poisson) est directement réutilisable
> pour tout futur sujet pêche/mer sans repartir de zéro.

## ✅✅ 16:9 NARRATIF + PERSONNAGES — SHOWCASE FINAL mis à jour (2026-07-03)
> Starter : `memory/starters/STARTER-PROMPT-16x9-narratif-personnages.md` (voir note de mise à jour en tête).
> ⭐⭐ **NOUVELLE RÉFÉRENCE (2026-07-03)** : `CargoVoyage16x9_LibreInspire.tsx` (`RND-CargoVoyage16x9-LibreInspire`)
>   remplace `CargoVoyage16x9.tsx` comme showcase final du format 16:9 — validé par Aziz comme preuve de concept
>   du pivot 9:16→16:9 (3-5min, style Infographic Show/Kurzgesagt). Issu d'un workflow mix-and-match : 2 agents
>   Sonnet en isolation worktree (gardien-de-charte vs libre-inspiré-encadré) ont chacun produit une version
>   complète en piochant dans Gemini 3.1 Pro + GPT-5.5 + code existant + doctrine ; version "libre inspiré"
>   retenue (reflet de soleil animé frame-driven, océan avec profondeur, cargo unifié). Détail complet du
>   process (bug réseau IPv4/IPv6 Gemini, pattern "upgrade prototype", verdict Qwen3.6 vs GLM-5.2) :
>   `memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md` § UPGRADE PROTOTYPE + `memory/tools/openrouter-svg.md`.
> **NEXT SESSION — 4 chantiers dans cet ordre (décidé Aziz 2026-07-03)** :
>   1. Extraire/indexer les briques réutilisables de CargoVoyage16x9_LibreInspire en composants nommés dans
>      `src/projects/_shared/svg-library/` (pas laissés locaux au fichier) : `camAt(p,speed)` (moteur parallaxe
>      3 couches), horizon paramétrique (interpolation 2 silhouettes via points de contrôle X fixes), palette
>      double-état `lerpHex` (chaud→froid / jour→nuit), séquençage strict d'éléments mutuellement exclusifs
>      (soleil/lune — jamais les 2 visibles en même temps), split fond/1er-plan calé sur le VRAI bas d'un objet
>      posé (pas sa position de référence).
>   2. Raccorder `ProtoNarratifPlusData.tsx` (fade scène-narrative→data-viz, DÉJÀ CODÉ 2026-07-02, ne PAS
>      recréer) au nouveau `CargoVoyage16x9_LibreInspire` — il pointe encore vers l'ancien `CargoVoyage16x9`.
>   3. Résoudre l'intégration personnage autrement que "plan large + fond minuscule" (a échoué 2x cette
>      session : StickRig et GeminiRig tous deux illisibles/mal proportionnés à cette échelle) — tester un
>      cadrage plus serré où le personnage EST le sujet (geste cueillette-arbre déjà prouvé, cf
>      `PERSONNAGE-VIVANT-INDEX.md`).
>   4. Produire une VRAIE scène complète ~1min (script + musique + montage), pas des tests de rendu isolés —
>      changement d'échelle : de "prouver la technique" à "livrable jugeable dans son ensemble". Réutiliser le
>      workflow "upgrade prototype" (`scripts/tools/svg-scene-upgrade.py`, codifié pour le 16:9 uniquement —
>      pas encore adapté au 9:16) dès le début de cette nouvelle scène, pas en rattrapage après coup.
>
> --- Historique (2026-07-02, patron 2-scènes original, toujours valide comme référence secondaire) ---
> ✅✅ **VALIDÉ AZIZ (2026-07-02)** : patron 2-scènes "voyage→arrivée/transformation" PROUVÉ de bout en bout —
>   `CargoVoyage16x9.tsx` (`RND-CargoVoyage16x9`) + `PortDechargement16x9.tsx` (`RND-PortDechargement16x9`),
>   archivés `out/templates-souverain/FINAL-CargoVoyage16x9-v1.mp4` + `FINAL-PortDechargement16x9-v1.mp4`.
>   Réutilisable tel quel pour un autre sujet Souverain (or→raffinerie, minerai→usine).

## ✅ PERSONNAGE VOLUMÉTRIQUE SVG — SYSTÈME GRAVÉ, catalogue de 7 gestes complet (2026-07-02)
> Rétrogradé depuis ⭐⭐ PRIORITÉ IMMÉDIATE — le catalogue est maintenant COMPLET (7/7 gestes), plus une
> priorité active. Seule extension optionnelle en backlog : `planter-arbre` (2 personnages). Contenu
> conservé ci-dessous pour l'historique des décisions.

> Contexte complet : `src/projects/_shared/personnage-vivant-svg/PERSONNAGE-VIVANT-INDEX.md` (§ Segments
> VOLUMÉTRIQUES, § GPT-5.5 générant du vrai code SVG, § LE VRAI TEST DÉCISIF, § Chaîne d'actions complète,
> § Extension du set de poses) + `memory/tools/pixellab.md` (§ PixelLab vs registre SVG, § Gamelabs Studio).

**✅ Priorité 1 — TERMINÉE cette session : rig volumétrique SVG intégré.** `capsuleSegment.ts` +
`StickRig.tsx` (nouveau prop `volumetric?: boolean`, défaut false = zéro régression) : jambes (cuisse+mollet+
genou+pied) ET bras avant (épaule+coude+main) en capsules tapered fermées, testé sur 3 poses
(debout/marche/bras tendu récolte) via `_rnd/svg-scenes/_archive/ProtoCapsuleLimb.tsx` ⚠️ archivé, exclu du
build (compo Root `RND-ProtoCapsuleLimb` désimportée). Cinématique `computePose()` 100% inchangée. **Reste (mineur, pas bloquant)** : léger
décrochage visuel cheville/pied observé sur la pose marche (à fixer si le rig est adopté en scène réelle),
torse/bottes/chapeau restent en formes rigides existantes (pas encore en capsule), vérification 8-directions
(`StickRigMultiDir`) pas faite.

**✅ Priorité 2 — TESTÉE 2026-07-02, RÉSULTAT NÉGATIF : prompt GPT "rig-first" écarté.** GPT-5.5 a produit un
SVG 15 groupes + JSON de pivots syntaxiquement parfait, mais dès qu'on applique les rotations déclarées
(`transform="rotate(angle,pivot)"`), les jointures coude/épaule se DISLOQUENT visuellement (paths dessinés en
pose figée, pas d'emboîtement géométrique garanti sous rotation). Le rig capsule (`capsuleSegment.ts`,
priorité 1) reste la seule approche production-ready — la robustesse vient du recalcul géométrique par le
code à chaque frame, pas de la qualité du prompt. Détail + fichiers test : `PERSONNAGE-VIVANT-INDEX.md`
§ "Nuance importante — reproduire une pose ≠ concevoir pour l'animation" (verdict en fin de section).
**NEXT = Priorité 3 ci-dessous (déjà traitée, voir résultats) ou reprendre le rig capsule pour finir les
points mineurs (décrochage cheville/pied pose marche, torse/bottes/chapeau en capsule, vérif 8-directions).**

**✅✅✅ Priorité 3 — TESTÉE A FOND 2026-07-02, VERDICT FINAL : Gemini 3.1 Pro gagne pour marche/statique,
squat écarté, personnalisation validée.** 1er passage avait conclu GPT meilleur sur images fixes — Aziz a
challengé et posé LA question décisive : est-ce que ça bouge vraiment ? **Gemini produit un vrai rig FK
imbriqué** (`translate(joint) rotate(angle)` parent→enfant) → marche FLUIDE par interpolation continue.
**GPT produit des paths en coordonnées absolues SANS hiérarchie** → cut sec obligatoire, ça saute. Chaîne
d'actions codée (`ProtoGeminiActionChain.tsx`) : marche→arrêt→repart→idle solide (viewBox élargi pour ne
plus couper le pied avant en pleine foulée — bug réel confirmé par Aziz). **Volet accroupissement/squat
TESTÉ PUIS ÉCARTÉ** : la pose générée par un appel Gemini séparé donnait un personnage aux couleurs
DIFFÉRENTES de celui qui marche (Aziz a détecté ça à l'œil, confirmé par grep des couleurs) — ET c'est un
registre marginal selon notre propre doctrine (`MISE-EN-SCENE-INFOGRAPHICS-SHOW.md` : statique+marche =
dominant chez les studios pro, actions articulées au sol = rares). Leçon gravée : générer toutes les poses
d'un personnage en UN SEUL appel avec description figée, jamais pose par pose séparément. **Personnalisation
par palette VALIDÉE** : `GeminiRig` paramétré par un objet couleurs (6 clés), 3 variantes démontrées
synchronisées en marche, zéro coût API, zéro risque d'incohérence — approche à privilégier pour différencier
des personnages. Détail complet : `PERSONNAGE-VIVANT-INDEX.md` § "LE VRAI TEST DÉCISIF" + § "Chaîne
d'actions complète" + § "Pose accroupissement/squat — ÉCARTÉE".

**✅✅✅ DERNIER TEST DE SESSION — méthode "1 appel, personnage figé" PROUVÉE (2026-07-02)** : set étendu à
5 poses (idle/walk-a/walk-b + **offer** bras tendu + **reach-up** cueillette) généré en 1 SEUL appel Gemini
avec 6 couleurs hex explicites données dans le prompt + consigne "même personnage, pas 5 différents".
Résultat vérifié par grep : couleurs **strictement identiques** sur les 5 SVG (zéro variation, contraste
net avec l'échec squat). Scène narrative test codée (`ProtoGeminiOfferScene.tsx`, compo Root
`RND-ProtoGeminiOfferScene`) : marche→arrêt→tend le bras→hold→repart, rendu fluide et cohérent
(`out/_rnd/pose-bank-test/gemini-offer-scene.mp4`). **C'est la procédure à suivre pour toute extension
future du set de poses** — jamais un appel séparé par pose.

**NEXT si repris en prod** : étendre encore le set (porte-charge, immobile-contemplatif) avec la même
méthode 1-appel-personnage-figé, écrire un script d'extraction automatique JSX depuis le SVG brut (fait à
la main pour ces tests). Le rig capsule (`capsuleSegment.ts`, zéro dépendance LLM) reste l'option la plus
robuste pour la PRODUCTION immédiate si on veut zéro dépendance API.
> ✅ MISE À JOUR 2026-07-02 (session suivante) : porte-charge et immobile-contemplatif sont désormais
> FAITS (voir catalogue 7/7 plus bas dans cette section) — seul `planter-arbre` reste en extension
> optionnelle. La méthode a aussi été affinée : 1 pose par appel Gemini (pas un lot de 5+), SVG source
> littéral en patron plutôt que l'image PNG seule — voir § "Deux systèmes distincts" dans
> `PERSONNAGE-VIVANT-INDEX.md` pour le détail complet.

**✅✅✅ SESSION 2026-07-02 (suite) — "Demander à Gemini ses propres capacités" TESTÉE, catalogue de 7
gestes COMPLET.** Consultation en 2 questions séparées (script Cacao précis vs éventail large) : réponses
concrètes et actionnables, aucune hallucination (Gemini a bien respecté le contexte technique donné,
marquant même l'accroupissement "Borderline/Risky" — cohérent avec notre propre écart déjà acté).
**Insight inattendu** : le short Cacao publié n'utilise en fait AUCUN personnage — 100% data-viz
symbolique (tablette, carte, arbres, usine). Comparaison aux propositions Gemini restée théorique de ce
fait, mais a débloqué la vraie question de fond.

**⭐⭐⭐ RECADRAGE MAJEUR (Aziz) — 2 systèmes complémentaires, pas concurrents** : le rig capsule
(`capsuleSegment.ts`/`StickRig.tsx`/`poses.ts`) = la MÉCANIQUE de mouvement (comment un bras porte un
poids crédiblement, comment plier un genou, 8 directions), 100% code, zéro dépendance API. Le personnage
Gemini = l'HABILLAGE (silhouette/couleurs/style), décliné en poses figées. Le vrai travail de la session a
été de **transposer la mécanique du rig capsule vers le personnage Gemini**, geste par geste, PAS une
"migration" en un coup. Détail complet + leçons : `PERSONNAGE-VIVANT-INDEX.md` § "Deux systèmes distincts".

**Catalogue complet, 7/7 gestes** (tous testés en rendu réel, pas juste en théorie) :
1. `ProtoGeminiHandBasketWalk.tsx` — panier tenu à la main, balancier amorti par le poids.
2. `ProtoGeminiShoulderSackWalk.tsx` — sac à l'épaule, torse penché, cadence ralentie.
3. `ProtoGeminiBendPickup.tsx` — recolte-au-sol (marche→penche→ramasse→redresse→repart).
4. `ProtoGeminiManipulateObject.tsx` — ramasse→transporte→dépose dans un contenant.
5. `ProtoGeminiHandoff.tsx` — 2 personnages, transfert d'objet main-à-main.
6. `ProtoGeminiTreeCueillette.tsx` — cueillette-arbre (bras levé), 1er geste SANS référence rig capsule.
7. `ProtoGeminiContemplatif.tsx` — immobile-contemplatif, respiration en boucle.

**Leçons gravées les plus importantes** (détail complet dans `PERSONNAGE-VIVANT-INDEX.md`) :
- Donner le SVG SOURCE littéral en patron (pas juste l'image PNG rendue) est nécessaire pour préserver la
  continuité du personnage — image seule fait dériver la géométrie.
- 1 pose par appel Gemini >> lot de plusieurs poses d'un coup (instructions oubliées si trop cumulées).
- **Bug structurel répété 2 fois** : un bras qui tient un objet ne peut PAS suivre le grand balancier de la
  marche libre (±45°) — doit être figé à un angle réduit. Repéré la 1ère fois sur `marche-porte-charge`,
  RE-repéré sur `cueillette-arbre` malgré la leçon déjà gravée — signal qu'une leçon en mémoire doit être
  activement relue avant de coder un geste similaire, pas seulement découverte après un nouveau bug.
- Un membre qui ne doit pas suivre un tilt de torse doit être structurellement SORTI du groupe SVG qui
  applique ce tilt (bug "effet planche" sur le penché, jambes qui héritaient à tort de `rotate(torsoTilt)`).
- Un objet mal positionné vs invisible sont deux bugs différents à diagnostiquer séparément — test debug
  (couleur/taille volontairement absurdes) pour trancher vite.
- Les gestes qui RECOMBINENT des briques déjà validées (`passer-objet-main-a-main`) réussissent du 1er
  coup ; ceux qui inventent une mécanique from scratch demandent systématiquement 2-3 corrections.

**Position sur la délégation à un agent (question Aziz)** : PAS ENCORE — le goulot d'étranglement de
cette session était le jugement visuel itératif (repérer qu'un rendu est faux, comprendre pourquoi,
corriger), pas la génération de code. Un agent sans supervision visuelle serrée déclarerait "fait" sur un
rendu cassé. Reprendre l'idée une fois que le catalogue est assez stable pour qu'un agent ait une check-list
de vérification visuelle explicite à suivre.

**NEXT si repris** : `planter-arbre` (2 personnages, creuser+déposer un jeune plant — seul item du §
Recettes rapides encore non transposé). Fichiers scratch de toute la session :
`out/_rnd/pose-bank-test/response-capabilities-{A-script,B-broad}.md` + `Proto*.tsx` (7 composants Root).

**Priorité 4 — Exploration continue Gamelabs Studio pour un registre RASTER séparé** (pas urgent, en fond).
Pipeline API REST complet validé et documenté (`memory/tools/pixellab.md` § Gamelabs) : image→video→spritesheet
fonctionnel, résultat NET une fois le personnage correctement cadré (règle : sujet doit remplir ≥80% du cadre).
Walk cycle testé et cohérent (jambes qui alternent, bras en balancier). Bug MCP contourné (appeler l'API REST
directement, PAS le serveur MCP qui route vers localhost:8000 — 401 systématique). ⛔ Reste un moteur RASTER
(PNG/MP4) — pas un remplacement de StickRig pour notre registre SVG mixte actuel, mais piste sérieuse pour un
FUTUR projet 100% raster où le contrôle frame-exact importe moins que la richesse visuelle immédiate (animations
pré-générées directionnelles, comme fait pour Atlas/PixelLab). 14 crédits gratuits restants sur le compte Aziz.
Clé dans `.env` (`GAMELABS_API_KEY`), config `.mcp.json` → `gamelabs` (bugué, contourner via REST direct).
> ✅ **Scène 3 "RetourAuChamp16x9" prototypée mais PAS validée** (`_rnd/svg-scenes/`, `RND-RetourAuChamp16x9`) —
>   jugée "plate narrativement" après comparaison avec des propositions LLM plus riches (voir ci-dessous).
> ⭐⭐ **3 doctrines R&D gravées cette session** (5 chaînes tierces analysées, yt-dlp+vision+lecture script) :
>   `doctrines/MISE-EN-SCENE-INFOGRAPHICS-SHOW.md` (grammaire caméra — marche plan large OK SI elle est le
>   sujet), `doctrines/STRUCTURE-NARRATIVE-HYPOTHETICALLY.md` (architecture narrative format long),
>   `doctrines/SCRIPTWRITING-MASTER-STORYTELLING-HYPOTHETICALLY.md` (écriture phrase par phrase, la plus
>   actionnable). ⚠️ Hypothèses de studios tiers — PAS ENCORE testées sur notre propre matière.
> 🔧 **Test comparatif Gemini vs GPT (svg-scene-narrative.py --ratio 16:9, nouveau flag)** : GPT-5.5 bat
>   nettement Gemini 3.1 Pro sur une scène complète (Gemini a produit un arbre déformé) — INVERSE du test
>   personnage-seul du 2026-06-29 (Gemini+ref avait gagné). Hypothèse à vérifier : Gemini meilleur sur asset
>   isolé, GPT meilleur en composition de scène. Résultats : `out/_rnd/gemini-gpt-svg-test/`.
> ⭐⭐ **OUVRIR LA PROCHAINE SESSION PAR Seedance 2.5 (fal.ai)** — modèle inconnu de notre mémoire projet
>   (`memory/tools/seedance-rules.md` ne documente que 2.0) et hors knowledge cutoff Claude : Tavily d'abord,
>   ne rien affirmer sur ses capacités avant vérification. Objectif : image-to-video sur une frame de nos
>   propres scènes SVG (registre stick-figure), voir si Seedance anime notre style directement. Puis
>   priorités 1-3 : personnages Gemini/GPT en style libre d'abord (pas bridé), re-test Gemini vs GPT sur les
>   2 cas d'usage, parallaxe/mouvement de véhicules générés par les LLM (jamais testé — outil actuel = statique).

## 📊 BILAN DISTRIBUTION 1 MOIS (2026-06-28) — niche VIABLE, prioriser YouTube long + Facebook
> Premiere donnee perf reelle a J+1mois : YouTube 88 abos/8 vidéos · Facebook 1100 followers (croissance ATYPIQUE) ·
> Instagram 24 · TikTok = shadowban (apres suppression de masse — NE PLUS supprimer en masse). DÉCISION : niche
> viable, prioriser YouTube LONG + Facebook ; depriorise Instagram ; TikTok en quarantaine.
> Detail : `memory/archive/BILAN-DISTRIBUTION-1MOIS-2026-06.md`. Conforte le pari format LONG (cacao = teaser vers long).

---

## 🆕 PROCHAINE SESSION DÉDIÉE — Grand Inga : Zoom Inversé (Powers of Ten)

> Session R&D Grand Inga 2026-06-28 : physicalité du sujet PROUVÉE. 4 prototypes produits (`IngaMondeVivant`, `IngaMondeV2` avec option C désaturation, `IngaDualScene`, `IngaSplitScreen`). Review Gemini reçue.
> **NEXT :** coder le "Zoom Inversé" (proposition Gemini, technique la plus forte) : macro turbine → dé-zoom carte SVG → câble d'or qui se trace → zoom sur village → bougies. Session dédiée.
> **À appliquer avant le Zoom Inversé :** turbine toujours ACTIVE en scène B (erreur narrative dans DualScene), câble émet halo froid sur les toits des maisons sans entrer dans les fenêtres, "siphon effect" sur les bougies au passage du câble.
> **Doctrine gravée :** Scène-Monde Persistante + Split-screen règle d'usage + 3ème voie Zoom Inversé → `memory/doctrines/SVG-MIDFORM-FORMAT.md`.
> **Prototypes R&D :** `src/projects/_rnd/svg-scenes/Inga*.tsx` (4 fichiers). Renders : `out/_r-and-d/inga-*.mp4`.

## ✅ PHYSICALITÉ du sujet — FAIT (2026-06-28, voir Grand Inga ci-dessus)
> Axe "physicalité" gravé dans `memory/doctrines/SUJET-PRIME-SUR-PRODUCTION.md`, testé sur Grand Inga (voir
> section juste au-dessus). Starter d'origine archivé :
> `memory/archive/starters-perimes-2026-07-11/STARTER-PROCHAINE-SESSION-physicalite-sujet.md`.

---

## ✅ FRANC CFA — archive du 2026-07-24 (PERIME — voir la section 🎬 FRANC CFA en tete de fichier)
> ⛔ Script complet = `episodes/souverain/franc-cfa-short/SCRIPT-MIDFORM-V2.md` (8 beats, colonne vertébrale
> validée) — PAS `SCRIPT-V6.md` (ça c'est la version SHORT différente, 2:20). Nos "Actes" 1-4 en prod = Beats 1-4 du V2.
> ✅ Beats 1-2-3 FINAL (encre/nuit). ⏸️ **Acte 4 « qui tient la clé » EN PAUSE** (2026-07-24) : direction non
> stabilisée après plusieurs itérations (carte D3 seule jugée trop proche de l'Acte 2 → tentative split-screen
> Paris/zones-CFA → aucune option Tour Eiffel/Seine ne convainc). Code en chantier non commité `CfaActe4Cle16x9.tsx`
> (worktree `remotion-cfa`). Ce qui MARCHE et à réutiliser si repris : Beat 1 garantie en carte D3 recentrée Paris
> + scène encre/nuit 1994 (murs FMI/France + signatures qui s'écrivent seules, validée par comparatif 4 modèles).
> **NEXT = Beat 5a/5b** (pas l'Acte 4) : **5a "Le quotidien"** (scène Dakar, braise-or/encre chaude, PAS d'humain,
> riz importé/dollar) · **5b "Le levier perdu"** (registre ⭐À TESTER "salle de contrôle monétaire"/data-terminal
> néon : manette "TAUX DE CHANGE" active pour un pays normal, verrouillée pour la zone CFA). Détail →
> `episodes/souverain/franc-cfa-short/STATUS.md` § 0-QUATER.

## 🆕 MÉTA — TYPAGE SUJET enrichi : moteur narratif + trousseau de style (2026-06-27)
> Décortiqué avec Aziz suite au CFA. Conclusion : le CFA n'était pas un MAUVAIS sujet, il était mal FORMATÉ.
> Cause racine = on ne typait pas le **moteur narratif** (ce qui crée la tension), seulement la durée.
> ✅ GRAVÉ : (1) axe « moteur narratif » (retournement/mécanisme/récit/révélation-chiffre → dynamisme+format+style)
> dans [[SUJET-PRIME-SUR-PRODUCTION]] § TYPER LE MOTEUR NARRATIF. (2) Trousseau « encre » 3 clés (parchemin/blanc-cassé/
> blanc-froid selon le TON, accent sémantique unique, N&B intégral proscrit) dans [[SUJET-PRIME]] + [[SVG-MIDFORM-FORMAT]].
> Comparaison visuelle 3 registres : files.catbox.moe/jb8puk.png. **À éprouver au prochain typage de sujet réel.**

## 🔧 BACKLOG STRATÉGIQUE — Shorts SVG ↔ Longs Mapbox (Hub & Spoke) — assemblage short SVG désormais PROUVÉ (GGW)
> 🗂️ Analyse Hub & Spoke gravée dans `memory/doctrines/SVG-SCENES-GENERATIVES.md` § Hub & Spoke + `ETAT-GGW-MURAILLE-VERTE.md` (acquis GGW). Aziz veut s'y lancer « pendant que c'est frais ».
> En bref : 2 formats séparés MÊME niche — longs analytiques (Mapbox/3D, autorité) + shorts SVG génératifs
> (paper-cut/blueprint, pédagogiques, multi-plateforme, gardent la chaîne vivante). PAS de la dilution = Hub & Spoke.
> ⚠️ AVANT d'industrialiser : (1) créer une SIGNATURE VISUELLE commune longs↔shorts · (2) tunnel = NOTORIÉTÉ
> cross-plateforme, pas conversion directe · (3) garder le gate [[SUJET-PRIME-SUR-PRODUCTION]] sur les shorts.
> Assemblage de PLUSIEURS scènes SVG en récit court = PROUVÉ (Short GGW Muraille Verte terminé ; cacao-chocolat
> 2e short SVG multi-scènes terminé 2026-06-29). Le chantier restant = INDUSTRIALISER (signature commune longs↔shorts,
> cadence). Prérequis prouvé = [[SVG-SCENES-GENERATIVES]].

## 🔧 BACKLOG TECHNIQUE — Système CARTO V5 (reprendre quand Sénégal V3 fini)

> ✅ Système prouvé. Doctrine gravée dans `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`. Point d'entrée (archivé, snapshot 2026-06-21) : `memory/archive/REPRISE-SYSTEME-CARTO-V5-2026-06-21.md`.
> ⚠️ Sénégal V3 est désormais TERMINÉ + PRÊT-PUBLICATION (scène gisements harmonisée confirmée dans son STATUS) —
> le "▶ RESTE" ci-dessous est probablement traité, à vérifier avant de le relancer.
> ⛔ Carte canonique = **GéoAfrique V5 (navy/gris/or)**. Les fichiers d3-geo parchemin V2 = PÉRIMÉS.
>
> **▶ RESTE** : (1) coder la vraie scène Mapbox Sénégal branchée audio · (2) peaufinage scène gisements (popup E4, plaque E2, jauge 18%) · (3) merger dans master. Session dédiée, pas urgent avant Sénégal V3 scène 6.

## ✅ Workflow Data-viz — SYSTÈME GRAVÉ (plus une priorité active)

> **MERGÉ DANS MASTER le 2026-06-20.** Pipeline complet dans `memory/doctrines/WORKFLOW-DATAVIZ.md`.
> Ce qui reste = optionnel (gate format phase 0 = doublon inutile). **Prochain vrai pas = l'éprouver sur une scène de prod réelle** (ex : Sénégal V3 scène 6).
> Détails dans `memory/archive/REPRISE-WORKFLOW-DATAVIZ-2026-06-20.md` si besoin de relire le système.

---

## ⏳ ACTION OUVERTE — Activer les routines /schedule (NON FAIT, rappeler à Aziz)

> **Statut : EN ATTENTE.** Aziz a demandé un rappel persistant jusqu'à confirmation.
> Tant qu'Aziz n'a pas dit "c'est activé / fait", **re-signaler en début de session** et proposer de fournir les instructions.

**Quoi** : créer 2 routines cloud `/schedule` pour le monitoring Postiz (Aziz les crée lui-même — clé API en env cloud = sa décision sécurité).
**Comment (instructions que Claude peut redonner sur demande)** :
1. Commandes à taper :
   - `/schedule jeudi 9h exécute scripts/postiz-weekly-check.py et préviens-moi si un post a échoué`
   - `/schedule samedi 10h exécute scripts/postiz-weekly-report.py et donne-moi le bilan`
2. Lors de la création, ajouter Environment variable : `POSTIZ_API_KEY=<la clé du .env>`
3. Notification : connecteur Slack/email OU consulter https://claude.ai/code/routines
**Doc détaillée** : `src/projects/souverain/carousels/good-news/README.md` section "Monitoring publications (anti-scroll)".
**Quand Aziz confirme l'activation** → supprimer cette section et noter la date d'activation.

---

## Projets en cours — décision immédiate

### ⭐ SUJET VALIDÉ EN RÉSERVE (gate 2026-06-16) — Mégaprojets / Gazoduc Nigeria-Maroc-Europe
**Etat** : SUJET passé GO par le gate complet [[SUJET-PRIME-SUR-PRODUCTION]].
**Decision Aziz** : à produire en SESSION DÉDIÉE quand War-Map/Sénégal/Maroc seront finis.
**Reprise** : ouvrir `memory/projects/GAZODUC-MEGAPROJETS-SUJET.md` + `DECODE-modeles-fr-afrique.md` (camp 3).

### 0. Carrousel "Good News" — pipeline hebdo PRET (2026-06-02)
**Etat** : Pipeline semi-auto data-driven COMPLET.
**Decision en attente** : aucune — pour le carrousel #2, lancer le workflow (voir README good-news section "Pipeline DATA-DRIVEN").
**Demarrer** : `python3 scripts/prepare-goodnews-weekly.py` puis suivre le BRIEF généré.

### 1. Maroc Batteries Short — RESTE A5 GÉOGRAPHIE + ASSEMBLAGE (vérifié 2026-06-03)

**ÉTAT EXACT (vérifié render par render 2026-06-03) :**
| Beat | État | Render |
|------|------|--------|
| Beat 0 Hook (Mapbox) | ✅ FINAL | `beat0-FINAL.mp4` |
| A2 Phosphate (Mapbox) | ✅ FINAL | `beat1-FINAL.mp4` |
| A3 Cailloux (Remotion) | ✅ FINAL | `a3-cailloux-FINAL.mp4` |
| A4 Acteurs (Mapbox) | ✅ FINAL | `beat3-FINAL.mp4` |
| **A5 Géographie (Mapbox)** | ❌ **STUB — À PRODUIRE** | `Beat4Geographie.tsx` = placeholder |
| A6 Question (Remotion) | ✅ FINAL | `a6-question-FINAL.mp4` |

**NEXT (2 tâches) — STARTER COMPLET : `memory/archive/starters-perimes-2026-06-15/STARTER-PROMPT-maroc-a5-geographie.md`** (scan templates + enchaînement premium + 3 signalements déjà faits) :
1. **A5 Géographie** (~37s, MAPBOX). 3 sub-moments : Maroc (monter dans la chaîne) / Europe (proximité Espagne, Volkswagen) / **triangle Maroc—Europe—Chine**. Pipeline Mapbox (`mapbox-session.py`).
2. **Assemblage final** : ffmpeg concat des 6 beats + 1 narration globale + mix.

### 2. Senegal Petrole & Gaz — REFONTE V3 SCÈNE PAR SCÈNE — ✅✅ TERMINÉ (MAJ 2026-07-05)
**⭐ SOURCE DE VÉRITÉ ÉTAT ACTUEL : `memory/episodes/souverain/senegal-petrole-gaz/STATUS.md`**
- ✅✅ **LES 8 SCÈNES (0→7) = PRODUITES + MONTAGE COMPLET ASSEMBLÉ + PASSE DE FINITION ROUND 1+2 TERMINÉE**.
  Commits `207d223` + `606aff4` sur `fix/senegal-v3-passe-finition`.
- ✅✅ **PROMU `out/PRET-PUBLICATION/senegal-petrole-gaz-FINAL.mp4`** (+ `-compressed.mp4`). Plus aucune
  action technique en attente — NEXT = programmer la publication (décision Aziz).
ℹ️ PÉRIMÉS : `STARTER-PROMPT-senegal-v3-passe-finition.md` (archivé, chantier ROUND 2 terminé),
`STARTER-PROMPT-senegal-makeover-premium.md`, `STATUS.md` (V1), `REPRISE-SCENE-1.md`, `STARTER-SCENE-1.md`,
`REPRISE-SCENE-2-COMPARAISON.md`, `REPRISE-SCENE-4-DETTE.md`.

### 3. Carousels Instagram (PRIORITE 3)
**Etat** : Or Africain + Thiaroye PRET-PUBLICATION. Mansa Moussa a refaire.
**Decision en attente** : commencer par Mansa Moussa ou Senegal Petrole ?
**Ma recommandation** : Senegal Petrole d'abord — la video vient d'etre publiee, la matiere est fraiche.

### 4bis. Peste 1347 — MI-FORME HORIZONTAL (CONCEPT VALIDÉ 2026-06-07 — BACKLOG)
**Statut** : concept validé, backlog — NE PAS commencer avant fin AES + Maroc Batteries.
**Fiche complète** : `memory/projects/peste-1347-midform.md`.

### 4. Peste 1347 Atlas — VALIDÉ AZIZ, voir section ✅✅ en tête de fichier
**État à jour** : voir la section "✅✅ PESTE 1347 — BUG GÉO + AUDIO CORRIGÉS, VALIDÉ AZIZ" tout en haut de ce fichier
(cette entrée-ci datait d'avant le bugfix du 2026-07-01, conservée seulement comme redirection).

---

## ✅✅✅ WAR-MAP SAHEL AES — VIDÉO FINALE VALIDÉE + PROMUE PRET-PUBLICATION (2026-07-05)

> Session C CONCLUE : fix audio "déjà", 1er render complet bout-en-bout, passe complète de retours
> post-visionnage (CEDEAO 3e itération, portraits dirigeants refaits sur vraies photos, SFX corrigés,
> hook "3" recentré, doublon audio "tensions..." corrigé via force-alignment Whisper), validée par Aziz
> SANS RÉSERVE. Promue `out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4` (386MB, 7min30). `wip/` purgé.
> Détail complet : `memory/episodes/warmap-sahel/STATUS.md` § "SESSION C — ÉTAT".
>
> ⭐⭐ **Thumbnail FAITE (2026-07-10, Pipeline C — voir `public/_shared/thumbnails-library/README.md`)** :
> 2 candidats A/B validés dans `public/_shared/thumbnails-library/warmap-sahel-aes/`. NEXT = titre +
> upload MANUEL YouTube Studio (décision Aziz : garder accès Test & Compare A/B natif, pas TryPost pour
> cette vidéo). Détail : `memory/starters/STARTER-PROMPT-warmap-sahel-thumbnail-titre.md`.
>
> Point ouvert non bloquant documenté (ne pas répéter l'investigation) : liseré blanc résiduel sur
> frontières CEDEAO (résidu Mapbox natif, cause exacte non isolée après 3 tentatives de fix) — cf
> STATUS.md § "POINT OUVERT NON RÉSOLU".

---

## ⛔ PÉRIMÉ — voir section Soudan en tête de fichier
> Cette section datait du 2026-06-16 (avant que l'Acte 3 soit codé/rendu). État réel à jour = la section
> Soudan tout en haut de ce fichier (structure 5 actes actée, Acte 4 script v5 verrouillé). Ne pas repartir
> d'ici. Conservé seulement pour la référence historique ci-dessous.
>
> **Short Soudan en attente** : ACLED toujours inaccessible.

---

## 💡 CHANTIER SCRIPT — Système hook + CTA commentaire (2026-06-13, session dédiée)

**Deux livrables à construire en session dédiée :**
1. **Checklist hook universelle** à intégrer dans `SCRIPT-ORAL-DOCTRINE.md` — les 20 premières secondes DOIVENT contenir soit une contradiction choquante, soit une honte réhabilitée, soit un fait qui renverse une croyance commune.
2. **Template CTA commentaire** à insérer à 30-60s dans chaque script.

---

## 💡 BACKLOG ENRICHI — Xénophobie SA (2026-07-01)

> Statut : MISE EN PAUSE enrichie. Angle validé ("double face" / colère mal dirigée / apartheid économique).
> Données 2026 intégrées (25k expulsés, ultimatums, March and March, réaction continentale).
> Format Hub & Spoke (Long Mapbox + Short SVG) intellectuellement pertinent mais complexe — Short SVG testé (images-cibles GPT/Gemini générées, faisable pour scènes symboliques, difficile pour foule/paradoxe).
> **Gate AVANT production** : TubeLab validation demande audience → candidat pour "3e sujet" prochain cycle.
> Dossier : `memory/episodes/souverain/xenophobie-sa-EXPLORATION/`. État complet : `04-DECISIONS-OUVERTES.md` § 7-8.

## 💡 IDÉE BACKLOG — Pipeline Shorts automatisé trending (2026-06-13)

**Décision** : ne pas commencer maintenant — y revenir quand Long Format bien en place.

---

## Techniques a exploiter (session future)

**⭐ BACKLOG GeoFlowConnection (pipeline Mapbox)** — Coder `GeoFlowConnection` headless-safe (lignes/arcs animés entre pays, centroïdes dérivés des bbox projetées) au PREMIER sujet à flux. Détails : `feedback_pipeline-mapbox-maturite-autonomie.md`.

Dossier `_reference-atlas-poc/` : patterns pas encore portés dans le pipeline :
- `AtlasParcheminGlobe.tsx` → mouvements camera spheriques a adapter en Mercator
- `AnimatedCaravan.tsx` → route commerciale animee (applicable Atlas + Souverain)
- `atlas-parchemin-mande.json` → style Mapbox historique (Empire Mali, etc.)

---

## ✅ Skillification 2026-07-11 — 3 skills construits (session ménage workspace)

Le skill `/wrap` a bien marché : un procédé "fichier passif à se souvenir de suivre" transformé en skill invocable avec gate. Aziz a demandé de construire les 3 candidats identifiés le jour même plutôt que d'attendre le seuil de maturité (3+ usages) — tous les 3 ont déjà débloqué au moins une session bloquée, jugé preuve suffisante :

1. ✅ **`da-brief-gate`** — `~/.claude/skills/da-brief-gate/SKILL.md`. Orchestre la review créative amont (Gemini+Kimi+DeepSeek, `scripts/tools/da-brief.py --upstream`) avec gate bloquant réel avant le code. Référencé `ROUTAGE.md`, `SYSTEME-AGENTIQUE.md` (étape 5.5), `CLAUDE.md` (Pipelines Beat).
2. ✅ **`passe-amelioration-scene`** — `~/.claude/skills/passe-amelioration-scene/SKILL.md`. N agents (1/scène) + 1 agent transversal de synthèse, pour un épisode multi-scènes déjà avancé. Doctrine source : `memory/doctrines/PASSE-AMELIORATION-SCENE-PAR-SCENE.md`.
3. ✅ **`creative-director-dual`** — `~/.claude/skills/creative-director-dual/SKILL.md`. 2 agents creative-director en parallèle (brief identique, zéro angle suggéré), déclencheur : 2+ rejets consécutifs sur le même chantier créatif.

Les 3 sont référencés dans `ROUTAGE.md` (table §2 skills) et `memory/SYSTEME-AGENTIQUE.md` (briques du système) — un agent qui consulte ces 2 points d'entrée doit maintenant tomber dessus sans effort de mémoire.

---

## 🔧 BACKLOG — Audit des skills du workspace (demandé 2026-07-11, à traiter en SESSION DÉDIÉE)

**Constat brut** : 88 dossiers sous `.claude/skills/` (génériques + spécifiques Remotion mélangés). Aziz soupçonne qu'une bonne part est inutilisée, redondante, ou mériterait fusion — exactement le même symptôme que le ménage `memory/`/`scripts/` fait cette session, jamais encore appliqué aux skills.

**Report volontaire** : session déjà longue et chargée ce jour-là (audit multi-piliers + 5 scripts + réorg memory/scripts/ + 3 skills construits) — Aziz préfère une tête fraîche dédiée plutôt qu'un audit de plus en bout de session fatiguée.

**Cadrage suggéré pour la session dédiée** (à valider avec Aziz au démarrage, pas à décider seul) :
- Distinguer skills génériques (gstack, code-review, design-*, superpowers:*...) vs spécifiques Remotion (souverain-preproduction, atlas-video-preproduction, wrap, session-close, memo, beat, les 3 nouveaux d'aujourd'hui...) — l'audit vise probablement surtout les seconds.
- Pour chaque skill Remotion : cherché des traces d'usage réel (grep dans `PIPELINE.md`/`STATUS.md`) — un skill jamais invoqué est un candidat suppression/fusion, pas un skill qu'on garde "au cas où".
- Chercher les doublons fonctionnels (ex: `session-close` + `memo` + `wrap` — déjà orchestrés proprement, mais vérifier s'il existe d'autres paires qui se chevauchent).
- Même méthode que les audits d'aujourd'hui : agents vierges en parallèle pour un diagnostic, puis trancher ensemble avant d'exécuter (fusion/suppression/archivage).

---

## 🧹 CHANTIERS DE NETTOYAGE — FAITS (2026-06-25)

1. ✅ **svg-scenes archivés** : 29 composants R&D écartés → `_archive/`, Root.tsx nettoyé (44 imports + ~35 Composition supprimés), build propre. Commit `0150ddf`.
2. ✅ **atlas-v2-components.tsx** : PAS à extraire — c'est la bibliothèque partagée de toute la V2 Atlas (12+ scènes l'importent). Aucune action.
3. ✅ **Purge `out/`** : ~1 GB libéré (5.8G → 4.8G). Purgés : hooks-lib, chantier3-test, carto-v5, scene-gisements-diagnostic, b2-compare, svg-scenes-refs, warmap-sahel/_r-and-d, gisements-v2, scene-gisements, carto-protos, test-orchestration-cobalt, sa1-frames + warmap-sahel/wip (219M). Conservés : decode-hera + wip Sénégal (scene4 en cours).
4. ✅ **Frontière 2-mémoires clarifiée** : NE PAS fusionner. `.claude/.../memory/` = navigation (MEMORY.md index + feedbacks courts) ; `memory/` workspace = contenu (doctrines, STATUS, outils). Règle gravée dans MEMORY.md header.
5. **Items "À CONFIRMER"** : `PLAN-ASSEMBLAGE-FINAL` War-Map (validations ouvertes) + `PIXELLAB-MASTER-INDEX` (statuts à confirmer quand on attaque ces prods).

## 🧹 NETTOYAGE CODE — FAITS (2026-06-25, session agentique 3 agents parallèles)

1. ✅ **Root.tsx protos A→D** : -34 imports, -57 compositions (Prototype_A→R, ProtoHera, ProtoCarto, HeraFidele, Matter, IntroProto, Lobito, Poc). Commit `d6b9348`. Build propre (6 erreurs pré-existantes inchangées).
2. ✅ **CLAUDE.md vides + dashboards** : 33 CLAUDE.md supprimés, 2 dashboards orphelins retirés. Commit `e27ca73`.
3. ✅ **Audit src/+public/ .md** (77 fichiers) : 3 périmés supprimés (senegal parchemin V2 + niger url). Commit `d0d782b`. Cobaye maroc GARDÉ (base peaufinage).
4. 🟡 **CLAUDE.md principal** : à dégraisser si besoin — surveiller taille en session. PAS urgent.
5. 🟡 **Purge out/ restante** : 4.8 GB. Re-scanner >7j en session dédiée si besoin d'espace.

---

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

Format : 3 lignes max par projet (Etat / Decision en attente / Recommandation).
