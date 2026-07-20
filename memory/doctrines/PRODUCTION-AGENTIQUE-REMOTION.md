# ⭐⭐ PRODUCTION AGENTIQUE D'UNE SCENE REMOTION (data-viz / conceptuel) — source de verite

> Cree 2026-06-24, prouve sur la SCENE 4 "la dette" (Senegal V3) : 2 agents frais en parallele ont produit
> chacun une scene data-viz Remotion premium de bout en bout (concept BARRAGE + variante BARIL), au niveau
> de l'instance principale. SOURCE DE VERITE pour lancer 1, 2 ou 3 agents qui produisent une scene Remotion
> (data-viz, metaphore physique, chiffre-hero — PAS carte, PAS SVG genératif organique).
> Soeur de [[PRODUCTION-AGENTIQUE-SVG]] (scenes SVG/encre). On met a jour a chaque decouverte.
> Doctrines de fond : [[SOUVERAIN-REMOTION-PLAYBOOK]] · [[CONTINUITE-SCENE-INTENTION-DABORD]] · [[DA-BRIEF-GATE]].

## CE QU'UN AGENT A PROUVE POUVOIR FAIRE SEUL (A->Z, sans qu'on dicte) — scene 4 dette
Un agent general-purpose (Opus), a partir des doctrines + sources de verite du projet :
- **Verifie l'EXISTANT** sans qu'on le lui dise : extrait des frames du render V1 de reference, lit le code du
  beat V1, mesure l'audio sur le forced-align (sans relancer Whisper), confirme le texte/timings.
- **Decide V1-vs-neuf** avec un vrai jugement (a ECARTE le kraft V1 ; a raisonne depuis l'INTENTION -> forme).
- **Consulte le jury LLM** (`da-brief.py --upstream`), fait une SYNTHESE EXTRACTIVE TRACEE (sources G/K/D), FILTRE.
- **Rebondit sur un refus d'Aziz** : quand le baril a ete refuse (redondance), a deduit 3 CONCEPTS NEUFS depuis
  l'intention (pas depuis le jury, qui avait un biais de continuite) -> a trouve le barrage (le bon).
- **Genere des storyboards** (pipeline `gemini-storyboard-panels.py` / `gemini-gen-image.py`), les JUGE, les uploade.
- **Fait un AUDIT DE FAISABILITE** element par element (CODE SVG vs ASSET a generer) -> a conclu "100% SVG, 0 asset"
  avec la bonne regle : objet geometrique net (cadenas, mur, vanne, jauge) = SVG code, jamais une image.
- **Code la scene Remotion** (SVG inline, clipPath niveaux, gradients, fissures stroke-dashoffset, count-up,
  Math.sin pour les liquides, spring, SFX en `<Sequence>`, musique) en REUTILISANT la grammaire d'une scene FINALE
  precedente (ici `SceneContratV3.tsx`). Respecte 16:9 horizontal, texte minimal FR, frame-driven + audio-derived.
- **Self-review honnete sur frames reelles** : a vu et corrige ses propres bugs (titre recouvert, label colle,
  element trop petit) en 2-3 iterations. Review Gemini = signal (verifie, ne boucle pas).
- **REND full HD, verifie l'audio, upload catbox**, ecrit un override trace si le gate bloque a tort.
- **AUTO-EVALUE** : compte-rendu lucide (ce qu'il a fait / trous rencontres / ce qu'il ferait avec plus de temps).
=> Role humain reduit a : valider le CONCEPT (1-2 points de controle de gout, groupes) + finitions.

## LE FLUX EN 2 PHASES + POINTS DE CONTROLE GROUPES
**PHASE A (agent autonome) — verif existant -> decision -> jury -> plan -> STOP au checkpoint gout.**
L'agent verifie l'existant, decide la forme (continuite vs neuf), consulte le jury, ecrit un PLAN-SCENE-N.md,
et REMONTE 1 question de gout groupee (la metaphore / le registre). Il NE CODE PAS. -> Aziz tranche.
(Sur la scene 4, il a fallu 2-3 allers-retours de gout : metaphore -> concepts neufs -> storyboards -> faisabilite.
C'est normal pour un CONCEPT NEUF ; pour une scene a forme evidente, 1 seul checkpoint suffit.)

**PHASE B (agent autonome) — code -> render -> self-review -> upload -> compte-rendu.**
A partir du concept valide : l'agent code la scene, REND full HD, self-review sur frames, corrige les bugs
evidents (1-2 iter), review Gemini (signal), upload catbox. + compte-rendu lucide. -> Aziz juge le render
(perception, rythme). Claude applique les micro-fixes de gout lui-meme (ne relance pas un agent pour 2 px).

**PARALLELISME PROUVE** : 2 agents Phase B en meme temps (un par concept/scene), chacun en WORKTREE ISOLE
(obligatoire si plusieurs touchent `src/` + `Root.tsx`). Handoff = fichier disque (le PLAN-SCENE-N.md).

## CE QU'IL FAUT DONNER A L'AGENT (checklist de lancement)
1. La REGLE 16:9 HORIZONTAL en GROS (cadre large, image centree, JAMAIS de layout vertical/empile = piege prouve).
2. Les SOURCES DE VERITE : README V3-REFONTE + _ASSEMBLAGE-V3 (etat reel) + le PLAN-SCENE-N.md si Phase A faite.
3. Le MODELE = une scene FINALE precedente du meme projet (`SceneContratV3.tsx`) : "etudie et reutilise sa
   grammaire, n'invente pas". C'est ce qui donne le niveau premium reproductible.
4. L'INTENTION (1 verbe) + le texte VO + le DECOUPAGE AUDIO (frames @30 depuis le forced-align, calage reel).
5. L'audio : chemin du MP3 narration + startFrom/endAt calcules + musique.
6. Les MODELES API VERROUILLES (CLAUDE.md) — la knowledge cutoff de l'agent est PERIMEE, il inventerait sinon.
7. Commandes exactes : `npx remotion render src/index.ts <CompoId> <out.mp4>` (Remotion pur, PAS render-mapbox),
   typecheck, review, upload catbox. Enregistrer la compo dans Root.tsx.
8. La consigne d'AUTO-EVAL (compte-rendu : fait / trous / avec plus de temps) — c'est ce qui fait progresser le systeme.

## ⛔⛔ STORYBOARD PHASE A = PANEL D'ÉVOLUTION, JAMAIS UNE AFFICHE (regle orchestrateur, gravee 2026-06-26)
> Erreur commise par l'orchestrateur (Opus) sur sc.6+7 Senegal V3 : a brief les agents Phase A avec
> "genere 1 image representative par direction" via `gemini-gen-image.py`. Resultat = une FRAME isolee figee
> (un poster), PAS un storyboard. Aziz a tranche : ce n'est PAS notre format. Le format canonique est rappele ici
> pour que l'orchestrateur ne refasse PLUS l'erreur — c'est SA responsabilite, pas celle de l'agent.

**Le storyboard canonique = un PANEL MULTI-CASES (4 cases) qui montre l'ÉVOLUTION TEMPORELLE de la scene**
(etat_debut → etat_2 → etat_3 → etat_fin). C'est un outil de CHOREGRAPHIE : on doit VOIR le mouvement de la scene,
pas une image d'affiche. Une frame unique ne raconte aucun mouvement et ne permet pas le breakdown.
- **OUTIL = `gemini-storyboard-panels.py`** (montre la PROGRESSION intro→dev→climax), PAS `gemini-gen-image.py`.
- ⛔ **JAMAIS de photoréalisme** : pas de photos reelles (tanker photo, mur de pierre photo), pas de visages
  photoréalistes (Faye/Sonko), pas de drapeaux raster réalistes. Tout reste dans le registre DATA-HERO / motion
  design VECTORIEL : fond navy #16213a, grille or, formes géométriques épurées, BebasNeue, accents or/blanc.
  (Sc.7 Dualite A = photomontage TV tanker+mur = HORS univers. Sc.7 Cicatrice B = visages photo = HORS univers.)
- **16:9 HORIZONTAL** : panel en bande horizontale ou grille 2×2, chaque case en 16:9, JAMAIS portrait empilé.
- ⚠️ Le point 3 ci-dessous ("générer 4 images séparées via gemini-gen-image.py") visait à éviter le portrait,
  mais a poussé vers la frame-affiche. CORRECTIF : utiliser `gemini-storyboard-panels.py` (panel d'évolution) ;
  s'il sort du portrait, relancer avec ratio 16:9 explicite — ne PAS retomber sur la frame isolée.

## TROUS DE DOCTRINE / OUTILS REMONTES PAR LES AGENTS (a garder a jour)
1. **`visual_review.py` — bug parseur de score** : sur certains formats de sortie Gemini (liste de criteres au lieu
   d'un score global), le score ressort `"?"` -> le hook `pre-presentation-review.sh` bloque l'upload comme si <8.
   Ce n'est PAS un echec qualite. Parade : ecrire un `<mp4>.review-override.md` trace. ⛔ A REPARER (le parseur doit
   gerer le format liste / extraire une moyenne). Remonte 2x (scene 3 + scene 4).
2. **Gotcha WORKTREE — assets gitignores absents** : un agent en worktree isole part d'une branche neuve SANS les
   fichiers gitignores (audio MP3, SFX .mp3, .env, renders out/) NI les fichiers non commités (un PLAN-SCENE-N.md
   ecrit mais pas commité est ABSENT du worktree). L'agent a du les copier manuellement depuis le repo principal.
   REGLE : dans le prompt d'un agent worktree, donner (a) la liste exacte des assets gitignores a copier + le chemin
   du repo principal, (b) la branche source a `git checkout`, (c) committer le PLAN avant de lancer (ou le passer
   inline). `.env` non copiable (harness bloque `cp .env`) -> l'agent le `source` au runtime.
3. **Storyboard multi-panel force le PORTRAIT** : `gemini-storyboard-panels.py` met les 4 panels dans UNE image 16:9 ;
   range en rangee, chaque cellule devient portrait (~344x768). Pour juger un plan en VRAI 16:9, generer 4 images
   SEPAREES via `gemini-gen-image.py`. (Le multi-panel reste OK pour une vue d'ensemble compacte.)
4. **Le modele image met des LABELS PARASITES** (prend les mots descriptifs du prompt pour des textes a afficher,
   souvent en anglais). Parade : preciser "ces mots sont descriptifs, n'affiche QUE X/Y/Z" dans le prompt.
5. **Biais de continuite du jury LLM** : G+K+D ont sur-recommande de REUTILISER l'existant (le baril) au lieu de
   proposer du neuf. Si Aziz veut de la nouveaute, demander EXPLICITEMENT a l'agent "propose AUSSI une rupture,
   pas que la continuite" — sinon le jury rabat tout sur l'objet deja connu.

## STATUT PAR MEDIUM (ce qui est PROUVE en agentique)
- ✅ **SVG genératif / encre** (organique, conceptuel) : prouve — voir [[PRODUCTION-AGENTIQUE-SVG]] (Beat 3 GGW).
- ✅ **Remotion data-viz / metaphore physique** (chiffre-hero, jauge, barrage) : prouve — scene 4 dette (CE fichier).
- ⬜ **Mapbox / cartes** : ⛔ NON ENCORE TESTE en agentique (au 2026-06-24). Les scenes carto (scene 2 comparaison)
  ont ete faites par l'instance principale, pas par un agent. A TESTER avant de garantir la reproductibilite carto
  (le frame-driven Mapbox + le gate carto-selfreview + les briques V5 sont plus complexes -> test dedie a faire).

## CE QUE L'HUMAIN GARDE (ne se delegue pas)
- Validation du SUJET/angle + du CONCEPT (point de controle de gout, groupe).
- Les FINITIONS de gout : metaphore (continuite vs neuf), couleur, intention d'un symbole, perception audio/musique,
  rythme final. Le jugement final est celui d'Aziz (ex scene 4 : a refuse le baril = redondant, a choisi le barrage).
- Trancher les ambiguites de raccord entre scenes (musique qui doit se concorder, niveau de depart d'un objet).
