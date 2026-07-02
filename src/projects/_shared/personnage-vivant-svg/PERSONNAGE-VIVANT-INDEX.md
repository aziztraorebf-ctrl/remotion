# Personnage vivant SVG — bibliothèque & savoir-faire

> ⭐ Brique TRANSVERSALE (tous projets). Un personnage d'encre stylisé, animé 100% par CODE (frame-driven),
> qui marche / se penche / ramasse — SANS sprites, SANS frame-by-frame. Validé à 100% par Aziz le 2026-06-30
> (prouvé sur le cacao). Si Aziz dit « une scène où le perso se penche et ramasse » → PARTIR D'ICI, pas de zéro.

## Quand l'utiliser
Tout sujet où un PERSONNAGE doit incarner une action dans une scène SVG encre/parchemin (planteur, mineur,
pêcheur, ouvrier, marchand…). Le rig est GÉNÉRIQUE : on change l'accessoire (`hat`) et la couleur (`ink`),
pas la mécanique. ⛔ Garde-fou doctrine : silhouette stylisée pictogramme, JAMAIS un humain réaliste. Segments DROITS.

## Fichiers
- `rig/poses.ts` — ⭐ SOURCE DE VÉRITÉ de la cinématique. `computePose({walkPhase,moveAmt,bend,armReach,offerReach})` →
  coords locales (bassin, épaules, **main avant**). À utiliser AUSSI côté scène pour coller un objet sur la main.
- `rig/StickRig.tsx` — le composant rig générique VUE PROFIL (facing gauche/droite). Props : `walkPhase, moveAmt,
  bend, armReach, offerReach, facing, ink, tunicColor, tunicPattern, neckwear, neckwearColor, hat`.
- `rig/StickRigMultiDir.tsx` — ⭐⭐ rig UNIFIÉ pour les 3 autres vues (3/4, dos, face) — voir § 8 DIRECTIONS.
  Prop `view: "3quarter"|"back"|"face"`. MÊME identité visuelle que StickRig (ink/tunicColor/hat) → un perso
  garde son identité en changeant de vue.
- `rig/multiDirection.ts` — briques de PROJECTION partagées par StickRigMultiDir (`quarterLegPath`, `depthLegPath`,
  `torsoQuad`) — ne pas dupliquer. `computePose` reste la source du TIMING, ce fichier ne fait QUE la projection écran.
- `rig/objectHandling.ts` — `objectState` (ramasser→tenir→déposer) + `handoffState` (transfert main-à-main, 2 persos).
- `scenes-proto/RecolteAuSol.tsx` — ⭐ scène-prototype validée (entre→marche→penche→ramasse→relève). Compo Root :
  `PersoVivant-RecolteAuSol`. La copier comme point de départ d'une nouvelle scène.
- `scenes-proto/PasserObjetMainAMain.tsx` — scène-prototype 2 persos, transfert main-à-main. Compo Root :
  `PersoVivant-PasserObjetMainAMain`. Render de réf : `out/_r-and-d/personnage-vivant-svg/passer-objet-main-a-main-v1.mp4`.
- `rnd-8dir/` — prototypes historiques par vue (Proto3Quarter/ProtoBack/ProtoFace/ProtoMultiDirTest), gardés comme
  référence/traçabilité (chacun documente sa revue externe Gemini+GPT). Pour une NOUVELLE scène, partir de
  `StickRigMultiDir`, pas de ces protos.

## LE SAVOIR-FAIRE (ce qui a coûté cher à trouver — ne pas réinventer)

### Marche sans « glissé » → FOOT-PLANT
Le pied au sol NE DOIT PAS bouger pendant son appui. Dans StickRig : le pied est clampé au sol (`if (fy>0) fy=0`).
Cadence balancier = `sin(walkPhase/6)` (validée Aziz). Ouverture jambes ±30°. + BOB du bassin (~7% jambe) = poids.
Bras opposés aux jambes (×0.6). ⚠️ Si la marche paraît rapide : ce n'est pas la cadence interne, c'est la DISTANCE
parcourue par frame côté scène (en 16:9 la distance est plus grande → pas qui « rament »). Régler la vitesse de
translation de la scène, pas la cadence du rig.

### Se pencher sans « basculer en arrière » → COMPENSATION DU BASSIN
Cause racine (trouvée par Gemini + 2 agents) : pivoter le torse autour d'une hanche FIXE fait partir la tête en
arrière. FIX : quand `bend` monte, le bassin RECULE (`hipBack`) ET DESCEND (`hipDrop`) → centre de masse au-dessus
des pieds. + genoux qui fléchissent. Easing `easeInOutCubic` sur le penché (jamais linéaire).

### Ramasser au sol sans « lévitation magique » → MACHINE À ÉTATS + HOLD + objet-enfant-de-la-main
1. Le BRAS pointe vers le SOL-avant (angle bas ~22°, **indépendant** du penché du torse). C'est ça qui fait que la
   main DESCEND au sol (et pas qu'elle se lève — erreur corrigée le 2026-06-30).
2. L'objet reste FIXE au sol, posé EXACTEMENT à la position de la main au moment du HOLD (`computePose` à F_HOLD).
3. HOLD (~14 frames) : tout s'arrête → signale la saisie (petit flash optionnel).
4. Après le HOLD : l'objet devient ENFANT de la main (= `handScene` calculé par le MÊME `computePose`) → suit le
   redressement naturellement. ZÉRO saut, ZÉRO flottement.
5. Le bras RESTE en bas pendant le HOLD, remonte seulement APRÈS (en même temps que le corps se redresse).
Timeline de réf (RecolteAuSol) : ARRIVE 120 / BEND 165 / REACH 195 / HOLD 209 / UP 260.

### Arrêt de marche sans « saut de jambe » → moveAmt CONTINU (pas moving booléen)
Cause racine (trouvée 2026-07-01, Aziz) : couper `moving: true→false` net fige les jambes à l'instant T, quelle
que soit la phase de la foulée en cours → jambes parfois figées ÉCARTÉES (saut visible) au lieu de revenir jointes.
FIX (`poses.ts`) : `moveAmt` (0..1 continu) remplace `moving` (toujours accepté, rétrocompatible mais garde le
bug). La SCÈNE doit faire décroître `moveAmt` vers 0 sur ~15 frames AVANT l'arrêt complet
(`interpolate(frame, [fArrive-15, fArrive], [1,0])`), jamais un cut. ⚠️ Le glissement n'est pas 100% parfait même
avec le fix (résiduel mineur observé, acceptable pour un proto — à reprendre en vraie production si visible).
Les scènes historiques (RecolteAuSol, HistoirePlanteur, HistoireGGW) utilisent encore l'ancien `moving` booléen
(non cassées, mais gardent le bug) — migrer vers `moveAmt` à la prochaine retouche.

### TORSE-POLYGONE = standard (2026-07-01, promu depuis le chantier 8 directions)
La ligne simple hanche→épaule d'origine est remplacée par un TRAPÈZE opaque (épaules plus larges que hanches),
colorable via `tunicColor` (défaut = parchemin neutre). Né du besoin de lisibilité en 3/4/dos (une ligne ne
suffit pas à lire la torsion du corps), Aziz préfère ce design MÊME en profil : donne un 3e axe de
différenciation des persos — `ink` (couleur du TRAIT), `hat` (accessoire tête), `tunicColor` (vêtement/boubou/
tunique) — combinables librement. Le tracé du torse est calculé perpendiculairement à l'axe hanche→épaule
(`torsoDeg`), donc suit automatiquement le penché/la marche sans logique séparée.

### Offrir/tendre un objet à quelqu'un en face → offerReach (≠ armReach)
`armReach` (existant) pointe le bras vers le SOL-avant (~22°, pensé pour ramasser) — INADAPTÉ pour tendre un objet
horizontalement à un autre perso (le bras reste presque vertical, ne « sort » pas assez). Nouveau paramètre
`offerReach` (0..1, angle cible ~88° = horizontal, indépendant de `armReach`) dans `computePose`/`StickRig`.
Priorité sur `armReach`/la marche quand `offerReach > 0`.

### Transfert d'objet MAIN-À-MAIN entre 2 persos → handoffState (`rig/objectHandling.ts`)
Même discipline que le ramassage au sol : JAMAIS de glissade autonome, l'objet suit une main réelle jusqu'au HOLD.
1. Calculer la distance A↔B pour que les mains tendues (`offerReach=1`) se REJOIGNENT exactement (vérifier
   `frontHandX` numériquement, pas à l'œil — 1er essai avait un écart de 250px, mains dans le vide).
2. `handoffState({frame, fHold, fRelease, handAX/Y, handBX/Y, contactX/Y})` : avant `fHold` → suit main A ; HOLD
   (~14f) → point de contact FIGÉ (calculé UNE FOIS à `fHold` via `computePose`, pas recalculé à chaque frame —
   sinon glissade si les mains bougent encore légèrement pendant le HOLD) ; après `fRelease` → suit main B.
3. Les 2 bras montent en miroir (`offerReach` synchronisé, léger décalage ~6 frames pour éviter l'effet robotique).
4. Flash de contact (optionnel) : fondu D'ENTRÉE obligatoire (pas d'opacité qui apparaît d'un coup = pop visuel).
Preuve : `scenes-proto/PasserObjetMainAMain.tsx` (planteur → acheteur, cacao). Validé Aziz 2026-07-01.

### 8 DIRECTIONS — 3/4, DOS, FACE (2026-07-01/02, ⭐⭐ palier 1 complet)
Passage de profil-seul (facing ±1) à 4 formes de base (profil/3-4/dos/face) × miroir gauche-droite = 8 directions
couvertes. Chaque vue codée en proto ISOLÉ d'abord (`rnd-8dir/`), validée par Aziz EN MOUVEMENT (jamais sur une
pose figée — un rig qui a l'air bon à l'arrêt peut se révéler faux dès qu'il marche), après revue croisée
Gemini 3.1 Pro + GPT-5.5 à chaque fois qu'un 1er essai échouait. Puis CONSOLIDÉES dans `rig/StickRigMultiDir.tsx`
+ `rig/multiDirection.ts` (les 3 protos dupliquaient chacun leur projection — extrait en briques partagées
avant d'attaquer une scène narrative qui doit changer de vue en cours de mouvement).

**2 familles de projection de jambe** (ne jamais réinventer, la géométrie diffère fondamentalement) :
- **LATÉRALE (3/4)** : le pas se lit sur l'axe X écran. Near/far doivent avoir une longueur ET une amplitude
  DIFFÉRENTES (`quarterLegPath`), sinon ça relit "profil juste compressé" (bug du 1er essai, corrigé après
  revue Gemini+GPT : hanches/épaules 2 points distincts en X ET Y, jambe far ~0.88x plus courte, amplitude
  ~0.6x, opacité/trait plus légers, torse = polygone OPAQUE qui sert de masque entre far et near).
- **PROFONDEUR (dos, face)** : le pas se lit sur l'axe Y écran (raccourci/foreshortening), PAS X (`depthLegPath`).
  Piège du 1er essai dos : réutiliser la mécanique latérale du profil → lit comme un PAS CHASSÉ, pas une marche
  vers le fond (bug repéré par Aziz, confirmé fondamental — pas un réglage — par Gemini+GPT). Pied qui avance
  vers le fond (dos) ou vers la caméra (face) = MÊME formule, seul le SIGNE de `advance` s'inverse. X reste une
  piste étroite quasi-fixe (~0.16L, jamais un angle >15-20°). ⚠️ Honnêteté technique (2 modèles concordants) :
  le DOS PUR reste la vue la plus limitée du système — même les jeux vidéo (Zelda, Pokémon) trichent en 3/4-dos.
- **FACE** : symétrique gauche/droite (contrairement au dos qui garde un léger near/far). 1ère vue où un visage
  simple (2 points = yeux, PAS de bouche/expression) est cohérent avec le registre pictogramme.
- Draw-order : en 3/4 il est FIXE (far toujours derrière — c'est un écart de projection latérale constant, pas
  une vraie profondeur qui alterne). En dos/face il est DYNAMIQUE (`legNear.fy >= legFar.fy`, le pied le plus
  bas écran = le plus proche caméra = dessiné devant) — ⛔ ne PAS appliquer le dynamique au 3/4 (mélange les
  2 familles → jambes qui se chevauchent de façon incohérente, bug trouvé lors de la consolidation).
- Méthode de review qui a payé 3× : proto isolé → render EN MOUVEMENT (pas un still) → si doute, brief GPT-5.5
  ET Gemini 3.1 Pro EN PARALLÈLE avec la même image/vidéo + le diagnostic suspecté → appliquer seulement ce qui
  converge entre les 2. Les 2 modèles se sont toujours accordés exactement (jamais de désaccord net observé).

### RÈGLE PRO DE MISE EN SCÈNE — pas de jambes dos/face à petite échelle (2026-07-02, ⭐⭐ décisive)
Constat empirique (render réel + confirmé par revue croisée Gemini 3.1 Pro + GPT-5.5) : à petite échelle
(perso lointain dans le cadre), les jambes dos/face sont QUASI ILLISIBLES — le mouvement de 3-4px sur l'axe Y
est mangé par l'épaisseur du trait, contrairement au profil où le mouvement se lit sur X (large, lisible à
toute taille). **Ce n'est pas un bug du rig, c'est une contrainte géométrique de la projection 2D.**

Confirmé par observation directe (Aziz, visionnage accéléré d'épisodes The Infographics Show) : même avec des
personnages BEAUCOUP plus détaillés que nos stick figures, ils restent très majoritairement en PROFIL (3/4
en second) pour tout mouvement en plan large — quasi jamais de marche de face. Les 2 modèles confirment que
c'est un choix de mise en scène délibéré des studios pro (staging = 1er principe de l'animation), pas une
limite technique honteuse. Citation Gemini : *"Ne perds pas des semaines à essayer de résoudre mathématiquement
un problème de perception humaine."*

**RÈGLE ADOPTÉE** (`rig/StickFigureSimplified.tsx`, prouvée sur `rnd-8dir/SceneMultiPlanTest.tsx`) :
- Profil / 3/4 : gardent le rig complet (`StickRig`/`StickRigMultiDir`) à TOUTE échelle — lisibles nativement.
- Dos / face LOINTAIN (perso petit, sous un seuil d'échelle ~0.85) : `StickFigureSimplified` — PAS de cycle de
  jambes articulé (2 segments fixes légèrement écartés), le mouvement est porté par **Scale & Bob** : rebond
  vertical sinusoïdal du corps entier (même cadence que la marche réelle) + balancement des bras + changement
  d'échelle (approche/éloignement). "C'est le cerveau du spectateur qui fait le reste du travail" (Gemini).
- Dos / face PROCHE (gros plan, au-dessus du seuil) : repasse sur le rig complet (jambes lisibles à cette taille).
- C'est la SCÈNE qui choisit (pas un seuil automatique dans le rig) — le rig ne devine pas l'intention du plan.

⛔ **DÉCISION AZIZ 2026-07-02 pour la SUITE (à traiter en prochaine session)** :
1. **Pas de marche de FACE** dans les prochaines scènes de production — réserver la vue face aux moments
   statiques/gros plans/entrée-sortie, jamais à un déplacement en plan large (aligné avec la règle pro ci-dessus).
2. **Piste R&D à ouvrir** : analyser des épisodes réels (ex. The Infographics Show) via yt-dlp (extraction de
   frames) + breakdown vision (Gemini/GPT) pour en extraire une doctrine concrète — mouvements de caméra,
   placement des personnages, gestion profil/3-4, rythme des cuts, transposable à notre registre encre/SVG.
   Potentiellement une mine d'apprentissage sur le narratif, au-delà du seul problème jambes/orientation.

### TORSE = 3e axe de différenciation perso (2026-07-02, banc d'essai ProtoFace)
Au-delà de `tunicColor` : `tunicPattern` (`"stripes"` = rayures verticales internes au trapèze, `"collar"` =
bordure de col courbe) et `neckwear` (`"tie"` = triangle qui pend du cou, `"scarf-knot"` = rond + queue qui
flotte) + `neckwearColor`. Combinables librement avec `ink` (trait) et `hat` (tête) → 3 axes indépendants pour
différencier plusieurs persos dans une même scène sans changer la mécanique. Registre : reste pictogramme digne,
PAS caricatural (pas de motifs complexes, juste 2-3 traits internes au polygone existant).

### Netteté / rendu encre (Gemini)
Hiérarchie d'épaisseurs (torse 14 / membres 9-11). `linecap`+`linejoin` round OBLIGATOIRE. Encre `#2b2117` (charte)
opacity ~0.92 (pas de noir pur). Chapeau = léger overlap (suit la tête avec retard).

### Manipuler un OBJET (ramasser → tenir → transporter → déposer dans un contenant) — `rig/objectHandling.ts`
Prouvé sur HistoirePlanteur (cacao). ⛔ L'objet est TOUJOURS collé à la position RÉELLE de la main (`computePose`
→ `handScene`) tant qu'il est tenu. JAMAIS de glissade autonome de l'objet vers une cible (= le bug "il touche
la fève, elle glisse seule"). C'est la MAIN/le corps qui l'amène. L'objet disparaît au dépôt (contenu +1).
- `objectState({frame, fGrab, fDrop, handX, handY, groundX, groundY})` → `{visible, inHand, deposited, x, y}`.
- `depotStopX(containerX, frontHandLocalX, scale)` : le CORPS s'arrête AVANT le contenant pour que la MAIN tendue
  arrive AU-DESSUS (sinon le corps se met sur le contenant, la main le dépasse). 
- Chorégraphie type (2 penchés) : ramasse (penche1) → se redresse à demi en tenant l'objet → MARCHE vers le
  contenant → se re-penche au-dessus (penche2) → dépose → ramasse le contenant → repart. Marche = vitesse
  CONSTANTE (translation linéaire, pas d'easing). Réf : `souverain/cacao-chocolat-short/_rnd/HistoirePlanteur.tsx`.

## Recettes rapides (on enrichit au fil des scénarios)
- ✅ `recolte-au-sol` : entre→marche→penche→ramasse→relève. (RecolteAuSol.tsx)
- ✅ `manipuler-objet` : ramasse→tient→transporte→dépose dans contenant. (objectHandling.ts + HistoirePlanteur)
- ✅ `marche-porte-charge` : traverse en portant un sac/panier. (StickRig `carry` + `load` ; trivial = pas de scène dédiée)
- ✅ `passer-objet-main-a-main` : 2 persos se font face, tendent le bras (offerReach), transfert au HOLD. (PasserObjetMainAMain.tsx, handoffState)
- ✅ `cueilleurs-fond-de-plan-16x9` : persos MINUSCULES (scale ~0.27-0.3) intégrés au décor lointain d'un plan large
  parallaxe, geste de récolte en BOUCLE continue (pas de machine à états, juste `bend`/`armReach` cycliques via
  `wf % periode`). Preuve : `_rnd/svg-scenes/CargoVoyage16x9.tsx`. ⚠️ LEARNING (test empirique 2026-07-02) :
  `carry="shoulder-sack"` DEVIENT ILLISIBLE à cette échelle (silhouette se confond avec le feuillage de l'arbre) →
  à cette taille, rester `carry="none"`, le geste seul suffit à raconter le travail. Espacer le perso du TRONC
  (ne pas le coller à l'arbre) sinon confusion silhouette/feuillage.
- ⬜ `planter-arbre` (GGW) : 2 persos, creuser/déposer un jeune plant. (prochain)
- ⬜ `cueillette-arbre` : tend le bras vers le HAUT (cabosse sur tronc) — inverser l'angle du bras.
- ⬜ `immobile-contemplatif` : debout, respiration, regarde l'horizon.
- ✅✅ `8-directions` : profil/3-4/dos/face × miroir = 8 directions (StickRigMultiDir + StickRig). Voir § 8 DIRECTIONS.
  NEXT (piste en cours) : scène narrative multi-plan (perso avance/recule/tourne, change de vue en mouvement —
  le vrai test de la consolidation).

## Idées d'évolution
- [[IDEE-PERSO-8-DIRECTIONS]] : ✅ RÉALISÉ 2026-07-01/02 (voir § 8 DIRECTIONS + `rig/StickRigMultiDir.tsx`). Ce
  fichier documente l'intuition d'origine (Aziz) et l'historique de la décision — gardé pour contexte.
- Transposition 16:9 : la grammaire profondeur/parallaxe/heure dorée est prouvée (B5PontH). Régler la vitesse de
  translation (voir note FOOT-PLANT) pour matcher la cadence du 9:16.
- ⭐ PATRON « plan large parallaxe + véhicule + persos fond de plan » (2026-07-02) : `_rnd/svg-scenes/CargoVoyage16x9.tsx`
  (compo Root `RND-CargoVoyage16x9`) — 3 calques (ciel/horizon lent, véhicule quasi-fixe qui tangue, 1er plan qui
  défile vite), horizon PARAMÉTRIQUE (interpolation point par point entre 2 silhouettes = transition géographique,
  ex. dunes/cacaoyers → pics enneigés), soleil qui traverse l'écran en arc (marque le temps qui passe, fade →
  nuit étoilée), palette qui glisse via `lerpHex` (chaud→froid). Persos minuscules intégrés au décor (voir recette
  `cueilleurs-fond-de-plan-16x9` ci-dessus) = montage simultané travail-humain (terre, petit) / produit-qui-part
  (mer, grand) DANS LE MÊME PLAN, sans cut ni texte. Réutilisable tel quel pour toute scène « transport/voyage/
  transformation » du registre Souverain (minerai vers usine, or vers raffinerie, etc.) — changer le véhicule et
  les 2 silhouettes d'horizon, garder la mécanique. Bugs déjà corrigés (ne pas réintroduire) : (1) rect de fond
  océan trop étroit → bord visible en fin de drift caméra (toujours largeur ≥ 2× viewBox + marge du drift max) ;
  (2) véhicule positionné AU-DESSUS de la ligne d'horizon = flotte « dans le ciel » (toujours caler Y du véhicule
  DANS la bande du calque 1er-plan, pas au niveau du calque fond) ; (3) ordre de calques : fond-océan → véhicule
  → lignes-de-vague-proches (pour que les vagues passent devant le bas de la coque = ancrage visuel dans l'eau).

## Historique
Né de la R&D cacao 2026-06-30 (dossier `_rnd-perso/` purgé après extraction ici). Feuille de route animation (Gemini+web concordants) :
`memory/episodes/souverain/cacao-chocolat-short/ANIMATION-STICKFIGURE-FEUILLE-ROUTE.md`.
