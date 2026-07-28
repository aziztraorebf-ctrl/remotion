# Personnage vivant SVG — bibliothèque & savoir-faire

> ⭐ Brique TRANSVERSALE (tous projets). Un personnage d'encre stylisé, animé 100% par CODE (frame-driven),
> qui marche / se penche / ramasse — SANS sprites, SANS frame-by-frame. Validé à 100% par Aziz le 2026-06-30
> (prouvé sur le cacao). Si Aziz dit « une scène où le perso se penche et ramasse » → PARTIR D'ICI, pas de zéro.
>
> ⭐ **Nouveau registre 2026-07-10 : VISAGE riggé animable (GPT-5.6 Sol)** — clignement/parole/expressions
> (neutral/angry/surprised) testés avec succès, complémentaire au rig CORPOREL Gemini ci-dessous (le corps
> complet articulé reste le domaine exclusif de Gemini — Sol échoue esthétiquement sur ce point précis).
> Détail complet : `memory/tools/openrouter-svg.md` § "GPT-5.6 Sol".

## Quand l'utiliser
Tout sujet où un PERSONNAGE doit incarner une action dans une scène SVG encre/parchemin (planteur, mineur,
pêcheur, ouvrier, marchand…). Le rig est GÉNÉRIQUE : on change l'accessoire (`hat`) et la couleur (`ink`),
pas la mécanique. ⛔ Garde-fou doctrine : silhouette stylisée pictogramme, JAMAIS un humain réaliste. Segments DROITS.

## ⭐ AVANT LE RIG — l'option LÉGÈRE : stick figure de PROFIL, sans rig (2026-07-26, funambule CFA)

Si le personnage est **secondaire/symbolique** et **petit à l'écran** (~74 px de haut sur 1080), le rig
complet est surdimensionné. Une stick figure **DE PROFIL** marche, trébuche, tombe et rebondit avec ~20
lignes, **sans rig, sans foot-plant, sans machine à états** :
- 2 jambes en **ciseau** depuis une hanche commune (angle piloté par `Math.sin(phase)`),
- un **bob vertical** du corps (`Math.abs(Math.cos(phase))`) — c'est lui qui fait lire « il marche »,
- **aucune articulation genou/cheville** : invisible à cette taille, et c'est ce qui fait le pantin,
- chute + rebond par `spring()`.

⛔ **Fonctionne SEULEMENT de PROFIL.** De FACE, une stick figure ne peut que **glisser** (les jambes ne
peuvent pas marcher dans ce plan) → la garder immobile et ne faire vivre que son équilibre.
✅ **Le trait bat la silhouette pleine** à cette taille (testé au comparatif : la version « pleine »
referme la posture et se lit moins bien).

**Implémentation de référence** : `FunambuleProfil` dans
`src/projects/_rnd/fable-svg/CfaActe4Filet16x9.tsx` — ⚠️ pas encore extrait vers `_shared/`, candidat à
extraction dès la 2e réutilisation. R&D en cours pour élargir le registre (gestes, vues, interactions à
2) : `remotion-cfa/memory/starters/STARTER-PROMPT-rnd-stick-figures-registre.md`.
Leçon : [[feedback_stick-figure-profil-marche-capacite-debloquee]].

> **Choisir entre les deux** : rig Gemini = personnage PRINCIPAL, gros plan, poses complexes, objets
> tenus, foot-plant sur sol visible. Stick figure de profil = personnage SECONDAIRE, petit, un geste
> simple mais juste. Ne pas sortir le rig pour un funambule à 74 px.

## ⭐⭐ Rig FK Gemini — LE rig canonique (`rig/GeminiRig.tsx`)

**Chemin** : `src/projects/_shared/personnage-vivant-svg/rig/GeminiRig.tsx`. Composant `GeminiRig` (props
`GeminiRigProps` : `a: LimbAngles`, `face?: FaceExpression`, `faceView?: FaceView`, `skinTone`, `clothesColor`,
`pantsColor`, `inkColor`, `hatType`, `hatColor`). Poses exportées : `IDLE`, `WALK_A`, `WALK_B` (type `LimbAngles`).
Helpers : `lerp`, `lerpAngles` (interpolation continue des angles entre 2 poses — LE mécanisme qui porte le
mouvement, cf. § plus bas). 2 vues (`FaceView`: `"profile"|"front"`), 5 expressions (`FaceExpression`: `"none"|
"neutral"|"smile"|"serious"|"surprise"|"angry"`), 3 chapeaux (`hatType`: `"conical"|"cap"|"scarf"`).

**Origine** : text-to-SVG généré par Gemini 3.1 Pro (rig FK natif, hiérarchie `translate(joint) rotate(angle)`
imbriquée — comportement spontané du modèle sur ce type de prompt, jamais obtenu de GPT-5.5 malgré plusieurs
tentatives, cf. § tests comparatifs plus bas dans ce fichier). Promu depuis le proto `ProtoGeminiPoseBankWalk.tsx`
vers ce fichier `rig/` le 2026-07-03 (le proto garde un re-export temporaire pour compatibilité).

### ⚠️ Piège d'intégration — offset vertical pieds-au-sol (520*scale, pas 210*scale)
Découvert 2026-07-03 (scène cargo 16:9) : pour aligner les pieds de `GeminiRig` au sol dans une NOUVELLE
scène à une NOUVELLE échelle, l'offset vertical de positionnement doit être `~520 * scale` (pas `210 * scale`,
erreur intuitive si on part de `hipY=340` seul). Les pieds du rig sont à `y≈520` dans son repère local
(`hipY=340` + jambes `~180`), pas à `y≈210`. Utiliser un offset trop petit fait "flotter" le personnage
au-dessus du sol/de l'eau au lieu d'y être ancré. Ce n'est PAS un bug du composant — un piège d'intégration
qui se reproduira pour quiconque positionne `GeminiRig` sans le savoir.

**⛔ Distinct du rig CAPSULE (`StickRig`/`StickFigureSimplified`, § plus bas dans ce même fichier)** — ce sont
2 systèmes complémentaires, PAS concurrents (voir § "Deux systèmes distincts" ci-dessous) :
- **Rig capsule** (`StickRig.tsx`, `capsuleSegment.ts`) = la MÉCANIQUE, 100% code, zéro dépendance API. Rig de
  PRODUCTION historique, éprouvé sur ≥5 scènes, gère nativement 8 directions (`StickRigMultiDir`), charges
  (`carry`), objets (`objectHandling.ts`).
- ⛔⛔ **MàJ 2026-07-28 — LE GEMINIRIG N'EST PLUS LE RIG CANONIQUE.** Pour toute NOUVELLE scène
  narrative avec personnage, **partir du registre STICK FIGURE**, passé en PRODUCTION le 2026-07-28
  (6 scènes, socle validé Aziz sur rendu) :
  `remotion-cfa/src/projects/_shared/stick-figure-svg/STICK-FIGURE-INDEX.md` ⭐⭐
  (worktree `remotion-cfa`, branche `rnd/stick-figures-gestes`). Il sait faire : marcher (5 variantes,
  verrou pas/distance) · porter/tirer · manipuler un objet à états · échanger à deux · foule (≤12,
  perspective unifiée) · marchands de face qui hèlent · apparition dessinée. Et il porte le **filtre de
  scène** (sol ? geste du corps ? décor déjà rendu ?).
  **Raison** : le GeminiRig avait été écarté en prod (« pantin bien animé, pas maîtrisé ») ; la stick
  figure de profil, elle, a été validée geste après geste.
- **Rig FK Gemini** (`GeminiRig.tsx`, CE chemin) = **rig HISTORIQUE, conservé** (ne pas supprimer : son
  catalogue garde de la valeur pour le GROS PLAN et les poses complexes, registres où la stick figure
  n'a rien à dire). Silhouette + couleurs + visage dessinés par Gemini, mécanique transposée à la main
  depuis le rig capsule. Catalogue de 7 gestes (marche, panier, sac-épaule, récolte-au-sol,
  manipuler-objet, passer-main-à-main, cueillette-arbre, contemplatif) + trio visage/expressions
  + vue frontale. ⛔ **Ne PAS en faire le point de départ d'une nouvelle scène narrative.**

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

⛔ **DÉCISION AZIZ 2026-07-02 pour la SUITE** :
1. **Pas de marche de FACE** dans les prochaines scènes de production — réserver la vue face aux moments
   statiques/gros plans/entrée-sortie, jamais à un déplacement en plan large (aligné avec la règle pro ci-dessus,
   **non affectée par la révision ci-dessous** — c'est une contrainte géométrique de lisibilité des jambes,
   pas une question de choix de mise en scène).
2. ✅ **Piste R&D FAITE, 2 vagues (2026-07-02)** : analyse de 5 épisodes réels (Infographics Show ×2 +
   SimpleHistory ×3, yt-dlp + breakdown vision, 5 agents indépendants, ~160 frames) → doctrine complète dans
   [[MISE-EN-SCENE-INFOGRAPHICS-SHOW]] ⭐⭐. Vague 1 : confirme ET généralise la règle pro ci-dessus — la marche
   en plan large est évitée par défaut par les studios pro (statique+décor-qui-vit, véhicule qui glisse,
   vignettes+flèches). ⚠️ **RÉVISION vague 2** (SimpleHistory "French in War") : ce n'est vrai QUE quand le
   déplacement N'EST PAS le sujet de la scène — quand la progression EST le message narratif (colonne qui
   avance, exode, invasion), les studios pro animent la marche PLEINEMENT en registre/profil, plan large tenu.
   Notre `StickRigMultiDir` 8-directions reste donc l'outil pertinent pour ce cas précis (ex. War-Map Sahel :
   colonne en mouvement = marche plan large justifiée), pas un travail gâché. Notre patron CargoVoyage16x9
   (véhicule quasi-fixe + décor qui défile) reste validé a posteriori pour le cas "déplacement pas le sujet".

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
  **✅ TRANSPOSÉ côté personnage Gemini (2026-07-02)** : `ProtoGeminiManipulateObject.tsx`
  (`RND-ProtoGeminiManipulateObject`). Voir § "Deux systèmes distincts" ci-dessous.
- ✅ `marche-porte-charge` : traverse en portant un sac/panier. (StickRig `carry` + `load` ; trivial = pas de scène dédiée)
  **✅ TRANSPOSÉ côté personnage Gemini (2026-07-02)** : `ProtoGeminiHandBasketWalk.tsx` (panier à la main,
  `RND-ProtoGeminiHandBasketWalk`) + `ProtoGeminiShoulderSackWalk.tsx` (sac à l'épaule + marche penchée/
  ralentie, `RND-ProtoGeminiShoulderSackWalk`). Voir § "Deux systèmes distincts" ci-dessous pour la méthode.
- ✅ `passer-objet-main-a-main` : 2 persos se font face, tendent le bras (offerReach), transfert au HOLD. (PasserObjetMainAMain.tsx, handoffState)
  **✅ TRANSPOSÉ côté personnage Gemini (2026-07-02), réussi du 1er essai** : `ProtoGeminiHandoff.tsx`
  (`RND-ProtoGeminiHandoff`). Voir § "Deux systèmes distincts" ci-dessous.
- ✅ `cueilleurs-fond-de-plan-16x9` : persos MINUSCULES (scale ~0.27-0.3) intégrés au décor lointain d'un plan large
  parallaxe, geste de récolte en BOUCLE continue (pas de machine à états, juste `bend`/`armReach` cycliques via
  `wf % periode`). Preuve : `_rnd/svg-scenes/CargoVoyage16x9.tsx`. ⚠️ LEARNING (test empirique 2026-07-02) :
  `carry="shoulder-sack"` DEVIENT ILLISIBLE à cette échelle (silhouette se confond avec le feuillage de l'arbre) →
  à cette taille, rester `carry="none"`, le geste seul suffit à raconter le travail. Espacer le perso du TRONC
  (ne pas le coller à l'arbre) sinon confusion silhouette/feuillage.
- ⬜ `planter-arbre` (GGW) : 2 persos, creuser/déposer un jeune plant. (prochain)
- ✅✅ `cueillette-arbre` **CONÇU DE ZÉRO côté personnage Gemini (2026-07-02)** — premier geste sans
  référence rig capsule. `ProtoGeminiTreeCueillette.tsx` (`RND-ProtoGeminiTreeCueillette`). Voir §
  "Deux systèmes distincts" ci-dessous pour le détail + 2 bugs corrigés.
- ✅ `immobile-contemplatif` **FAIT côté personnage Gemini (2026-07-02)** : `ProtoGeminiContemplatif.tsx`
  (`RND-ProtoGeminiContemplatif`). Voir § "Deux systèmes distincts" ci-dessous — 7/7 gestes du plan de
  session, catalogue complet.
- ✅ `recolte-au-sol` **TRANSPOSÉ côté personnage Gemini (2026-07-02)** : `ProtoGeminiBendPickup.tsx`
  (`RND-ProtoGeminiBendPickup`). Voir § "Deux systèmes distincts" pour la formule + bug structurel corrigé
  (jambes qui héritaient à tort de `rotate(torsoTilt)`).
- ✅ `manipuler-objet` et `passer-objet-main-a-main` : **TRANSPOSÉS côté personnage Gemini (2026-07-02)** —
  voir § "Deux systèmes distincts" plus bas pour le détail des 2 fichiers + leçons.
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

### Segments VOLUMÉTRIQUES (capsule tapered) — PROTOTYPE VALIDÉ 2026-07-02, pas encore intégré production

**Origine** : Aziz montre `planteur-cacao-charsheet-GPT.png` (planche GPT Image 2, contours fermés à volume —
bras/jambes tapered avec manches/bottes, PAS des lignes strokeWidth comme StickRig actuel) et demande si ce
niveau de détail est atteignable en SVG animé. Breakdown demandé DIRECTEMENT à `openai/gpt-5.5` via
`scripts/tools/openrouter-vision-breakdown.py` (le modèle qui a dessiné la planche, interrogé sur sa propre
construction) — verdict : **"étendre le rig actuel en cutout puppet volumétrique, PAS de path-morphing entre
poses dessinées à la main"**. Chaque segment ligne devient un `<path>` fermé tapered (`Segment(endpointA,
endpointB, widthA, widthB)`), la cinématique (`computePose`) reste 100% inchangée — seul le RENDU change.

**Prototype réalisé** (`capsuleSegment.ts` + `_rnd/svg-scenes/_archive/ProtoCapsuleLimb.tsx` ⚠️ fichier source
archivé, exclu du build, compo Root `RND-ProtoCapsuleLimb` désimportée) : helper `capsulePath()` génère un
contour fermé tapered avec bouts arrondis entre 2
points, testé isolément sur le bras avant à 3 poses (debout/marche/bras tendu) superposé au `StickRig` normal
sans le modifier. **Résultat visuel concluant** : le bras capsule se distingue nettement de la ligne d'origine,
volume cohérent avec la pose, aucune régression sur la cinématique.

**⛔ PAS encore intégré à StickRig.tsx** (production intacte). Reste à faire avant adoption :
1. Étendre `capsuleSegment.ts` aux jambes (2 segments cuisse/mollet avec genou, comme recommandé par GPT)
2. Ajouter un coude explicite au bras avant (actuellement 1 segment direct épaule→main, GPT recommande
   épaule→coude→main en 2 capsules chaînées pour matcher la planche de référence)
3. Torse/bottes/chapeau : GPT recommande des formes rigides groupées plutôt que des capsules (torse = trapèze
   déjà existant, juste à épaissir légèrement ; bottes/chapeau = groupes séparés attachés aux joints)
4. Décider du flag d'activation (`volumetric?: boolean` sur `StickRigProps` ?) pour ne pas casser les 5+ scènes
   de production qui utilisent le rig ligne actuel
5. Vérifier le comportement en 8-directions (`StickRigMultiDir`) — GPT prévient que ce registre "fonctionne
   mieux en angle de vue limité, pas comme modèle pleinement rotatif" (chevauchements probables en 3/4/dos)

**Pourquoi cette piste bat PixelLab pour un registre "personnage développé"** (voir aussi `memory/tools/pixellab.md`
§ PixelLab vs registre SVG) : reste 100% dans l'écosystème SVG/code — zéro coût par itération (contrairement à
un appel API payant par génération), zéro risque de choc de langage graphique (vecteur natif, pas de conversion
pixel/vecteur), et le contrôle de timing reste total (contrairement à Seedance qui n'interprète le timing qu'à
l'intention, voir `memory/tools/seedance-storyboard-technique.md` § 29).

### GPT-5.5 générant du VRAI code SVG (pas une analyse) — TESTÉ 2026-07-02, résultat POSITIF avec réserve

**Clarification importante** : le breakdown GPT ci-dessus (§ Segments VOLUMÉTRIQUES) répondait à "comment RIGGERAIS-TU
ce personnage" — une analyse théorique, PAS une génération de code. Aziz a pointé la confusion : le test qu'il
voulait était de demander à GPT de **produire le code SVG lui-même** à partir de l'image `planteur-cacao-charsheet-GPT.png`
(la planche que GPT a lui-même dessinée), pour voir si le modèle peut convertir SA PROPRE image en paths
exploitables — pas juste théoriser dessus.

**Test réalisé** : prompt direct à `openai/gpt-5.5` (via `openrouter-vision-breakdown.py`) demandant le SVG brut
de la pose "debout, mains sur les hanches" (5e figure de la planche), avec consigne de groupes nommés
(`arm-upper-left`, `leg-lower-right`, `torso`, `hat`, `head`...) et paths FERMÉS (pas de lignes strokées).

**Résultat** : ✅ GPT a produit du **vrai SVG structuré et syntaxiquement valide** (rendu direct via `rsvg-convert`,
aucune erreur de parsing) — pas du texte vague, du code copiable. La structure de groupes nommés est cohérente
et directement exploitable pour un futur rig (chaque membre séparé, prêt à recevoir une transform de rotation).

**Mais écarts réels vs l'original** (comparaison visuelle 3 volets : original / SVG brut GPT / SVG nettoyé à la
main) :
- 1er jet GPT : tête trop grosse (mauvaise proportion tête/corps), chapeau en 2 formes qui se chevauchent
  (rendu strié confus au lieu de calotte+bord nets), zone mains/coudes confuse (formes qui se chevauchent).
- Après nettoyage manuel (réduction tête, refonte chapeau en 2 ellipses propres, refonte bras avec coude
  explicite qui rejoint la hanche) : résultat nettement plus proche de l'original, mais toujours pas
  pixel-parfait (torse un peu large, jambes sans la légère torsion 3/4 de l'original, trait un peu épais).

**Conclusion opérationnelle** : GPT-5.5 en génération SVG directe est un **accélérateur de premier jet**, pas un
générateur final. Il capture correctement le SQUELETTE et le GESTE (mains sur les hanches lisibles, chapeau
conique reconnaissable, jambes ancrées) avec une structure de code exploitable (groupes nommés = prêt à animer),
mais nécessite systématiquement une passe de nettoyage manuel sur les proportions et les chevauchements de
formes avant d'être production-ready. Gain de temps réel vs dessiner à la main de zéro, mais PAS un remplacement
complet du travail manuel de finition.

Fichiers test : `gpt-svg-test.svg` (1er jet brut GPT), `gpt-svg-test-v2-cleaned.svg` (nettoyé, groupes intacts).
Non conservés dans le repo (scratchpad de session) — à re-générer si cette piste est reprise en production.

### ⭐⭐ Nuance importante — "reproduire une pose" ≠ "concevoir pour l'animation" (Aziz 2026-07-02)

**Distinction cruciale identifiée par Aziz après le test ci-dessus** : le test GPT-5.5 réalisé a demandé une
**reproduction fidèle d'une pose existante** (la 5e figure de la planche GPT) — objectif "fais un SVG qui
ressemble à CE dessin précis". Ce n'est PAS la même chose que demander à GPT de **concevoir un personnage dont
la structure est pensée dès le départ pour être animée** — c'est-à-dire lui donner le CONTEXTE de notre système
(joints hanche/genou/cheville, épaule/coude/poignet, `computePose()` qui pivote chaque segment autour de son
articulation parente) et lui demander de produire un SVG dont chaque `<g>` correspond à un os du squelette,
avec un point de pivot cohérent, PAS juste "voici un joli dessin découpé en calques nommés a posteriori".

**Prompt à tester en priorité à la prochaine session** (au lieu de "reproduis cette pose") :
```
You are designing a character RIG, not just an illustration. This SVG will be driven by code: each named
group will receive a `transform="rotate(angle, pivotX, pivotY)"` computed per-frame by a skeletal animation
system (hip/knee/ankle, shoulder/elbow/wrist joints — same architecture as a 2D cutout puppet).

Design the character with this constraint FIRST, aesthetics SECOND:
- Each limb segment (upper-arm, forearm, thigh, shin) must be a SEPARATE closed path, sized to rotate
  cleanly around its PROXIMAL joint (e.g. upper-arm rotates around the shoulder point) without the shape
  itself needing to deform.
- Report the exact pivot point (x,y in the path's local coordinate space) for each group, so the code can
  set the correct rotation origin.
- Keep proportions and joint positions consistent with a standing neutral pose — this is the REST POSE the
  rig will be built from before any rotation is applied.
- [style constraints: ink-line, flat fill, no face detail, etc.]

Output the SVG code AND a JSON list of {group_id, pivot_x, pivot_y, parent_joint} for every group.
```

**Pourquoi ça change la donne** : le test précédent a produit un SVG "joli mais figé" — les groupes existent
mais aucun point de pivot n'a été pensé pour la rotation (GPT a dessiné une pose statique et découpé après
coup). Avec cette approche, on demanderait à GPT de résoudre le MÊME problème de rigging que
`capsuleSegment.ts` résout en code — mais en lui laissant dessiner la forme réelle des segments (avec plis de
vêtement, volume organique) au lieu de nos capsules géométriques simples. Si ça marche, ça pourrait fusionner
le meilleur des deux pistes : la précision de contrôle du rig code + la richesse visuelle du dessin GPT.

**Statut** : ✅ TESTÉ 2026-07-02 — **RÉSULTAT NÉGATIF, piste écartée pour la production.**

**Test réalisé** : prompt ci-dessus envoyé à `openai/gpt-5.5` sur `planteur-cacao-charsheet-GPT.png`
(`scripts/tools/openrouter-vision-breakdown.py`). GPT a produit une réponse structurée conforme à la
demande : SVG complet (15 groupes nommés `leg-upper-left`, `arm-lower-right`, `torso`, `hat`... chacun un
`<path>` fermé) + JSON de 15 pivots avec `parent_joint` explicite (hip/knee/ankle, shoulder/elbow/wrist).
Rendu de la pose REST seule (`rig-first-rest-pose.png`) : net, propre, proportions correctes.

**Le vrai test** (celui qui compte) : appliquer des `transform="rotate(angle, pivot_x, pivot_y)"` aux groupes
pour simuler une pose de marche/bras levé (`rig-first-posed-test.png` + version angle modéré
`rig-first-posed-mild.png`). **Échec net** : dès une rotation même modérée (~20-25°) au coude/épaule, un
écart/décrochage visible apparaît entre `arm-upper-right` et `arm-lower-right`, la main se détache
visuellement du bras. Cause racine : les paths sont dessinés une fois en pose REST avec un chevauchement
approximatif aux jointures (pas d'emboîtement géométrique garanti) — contrairement à `capsulePath()`
(§ Segments VOLUMÉTRIQUES) qui RECALCULE la capsule à chaque frame à partir des 2 points d'articulation
réels (`computePose()`), garantissant la continuité par construction quelle que soit la pose.

**Conclusion opérationnelle** : GPT-5.5 peut produire un JSON de pivots syntaxiquement cohérent (bonne
lecture de l'intention rig), mais ne sait PAS dessiner des segments dont la géométrie reste connectée sous
rotation arbitraire — il dessine une illustration figée, pas une machine articulée. La nuance "concevoir
pour l'animation" ne suffit pas à obtenir un résultat robuste : la robustesse vient de la RÈGLE DE
CONSTRUCTION (capsule recalculée par le code à chaque frame), pas de la qualité du prompt. **Le rig capsule
(`capsuleSegment.ts`, déjà intégré à `StickRig.tsx`) reste la seule approche production-ready** — supérieur
sur ce critère décisif, même si visuellement le SVG GPT a un dessin plus riche (vêtements, chapeau à 2
formes, cacao brodé sur le torse) que nos capsules géométriques nues. Piste de récupération possible (non
testée) : utiliser le dessin GPT comme RÉFÉRENCE STYLE pour redessiner à la main les capsules avec plus de
détail (manches, plis), mais garder le calcul géométrique du code — jamais faire confiance à un path GPT
pour la rotation elle-même.

Fichiers test (scratch, non conservés dans le repo) : `out/_rnd/gpt-rig-first-test/` (prompt, réponse brute,
SVG extrait, JSON pivots, 3 renders PNG dont les 2 poses tournées qui démontrent l'échec).

### ⭐⭐ "Banque de poses" text-to-SVG (idée Aziz 2026-07-02) — ✅ TESTÉE, RÉSULTAT POSITIF (GPT-5.5)

**Origine de l'idée** : après l'échec du rig-first sous rotation (section précédente), Aziz a reformulé le
problème — au lieu de forcer UN squelette unique à TOUT interpoler en continu (ce qui a échoué), reproduire
le pattern des studios pro type The Infographics Show : une **bibliothèque de poses discrètes pré-dessinées**
par catégorie de mouvement (idle, marche-1, marche-2, tend-la-main...), utilisées au bon moment par CUT/swap,
pas par interpolation continue d'un rig unique. Aziz a aussi noté que le test précédent était biaisé : il
partait d'une IMAGE déjà générée (vision→SVG), pas d'une génération SVG texte-pur dès le départ (le vrai
pattern qui a produit les scènes SVG génératives GGW/Muraille Verte, cf. `llm-gen-svg.py`).

**Test réalisé** : prompt texte pur (AUCUNE image de référence) envoyé en parallèle à `openai/gpt-5.5` ET
`gemini-3.1-pro-preview`, demandant 4 poses SVG standalone du MÊME personnage (planteur de cacao) avec
convention de nommage de groupes IDENTIQUE entre poses (`torso`, `leg-upper-front`, `arm-lower-back`...) :
`idle` / `walk-a` / `walk-b` (les 2 moments alternés d'un cycle de marche) / `bend-reach` (penché, ramasse).
Fichiers : `out/_rnd/pose-bank-test/` (prompt, réponses brutes, 8 SVG extraits, planche comparative
`COMPARISON-pose-bank.png`).

**Résultat GPT-5.5 : net succès.**
- Personnage visuellement COHÉRENT sur les 4 poses (même chapeau, mêmes proportions, mêmes couleurs, même
  ligne de sol) — bien le même perso reconnaissable, pas 4 dessins déconnectés.
- Anatomie crédible sur les 4 poses, y compris `bend-reach` (posture penchée avec bassin compensé, PAS de
  bascule improbable — le même problème qu'on avait dû résoudre à la main en code pour StickRig).
- **Topologie de groupes VALIDÉE identique** sur les 4 SVG (vérifié par grep des `<g id="...">`) : les 15
  mêmes IDs présents dans chaque pose (`head, hat, torso, arm-upper-front, arm-lower-front, hand-front,
  arm-upper-back, arm-lower-back, hand-back, leg-upper-front, leg-lower-front, foot-front, leg-upper-back,
  leg-lower-back, foot-back`) — donc cible-able de façon fiable en code (`#torso`, sélecteurs CSS/JS) à
  travers les 4 poses, même si l'ORDRE de dessin (front/back) varie selon la pose (attendu, pas un défaut).

**Jugement visuel initial (images fixes) : Gemini semblait moins bon** — bras/jambes désaxés à l'idle, mains
disproportionnées en boules à petite échelle. **Mais Aziz a challengé ce jugement** en regardant le
`bend-reach` en grand format : le Gemini est en fait le PLUS CRÉDIBLE des deux sur ce geste précis (posture
accroupie basse, main qui touche vraiment le sol — contre un GPT plus "penché debout", main qui flotte).
Vérification à l'œil en gros plan (`bend-reach-side-by-side.png`) : jugement initial corrigé, Gemini meilleur.

### ⭐⭐⭐ LE VRAI TEST DÉCISIF — structure XML + interpolation en MOUVEMENT (2026-07-02)

Aziz a alors posé la question qui compte vraiment : *peut-on FAIRE BOUGER ces poses, ou faut-il bricoler ?*
Inspection du XML brut des 2 sets a révélé une différence structurelle majeure, invisible sur une image fixe :

- **Gemini 3.1 Pro a spontanément produit un vrai RIG FK (forward-kinematics) imbriqué** : chaque membre est
  un `<g transform="translate(jointX,jointY) rotate(angle)">` ENFANT du groupe parent (ex. `arm-lower`
  imbriqué DANS `arm-upper`, avec son propre `translate`+`rotate` relatif à l'épaule). C'est exactement
  l'architecture squelette/joint qu'on avait explicitement demandée à GPT dans le test rig-first (échoué) —
  Gemini l'a produite SANS qu'on le lui demande, juste en générant du texte-pur avec la contrainte de nommage
  de groupes. Preuve : les angles `rotate()` de `walk-a` (gemini-pose2.svg) et `walk-b` (gemini-pose3.svg)
  sont EXACTEMENT le miroir front/back l'un de l'autre (mêmes valeurs, juste permutées) — Gemini a conçu
  UN SEUL squelette et l'a réutilisé pour les 2 moments du cycle de marche.
- **GPT-5.5 a produit des paths en coordonnées ABSOLUES**, sans aucune hiérarchie `translate`/`rotate` — le
  JSON de pivots du test rig-first précédent était donc un ANNOTATION a posteriori, pas une vraie structure
  de rendu exploitable en rotation (cohérent avec l'échec de ce test-là).

**Test de mouvement réalisé** (protos Remotion, gardés dans le repo) :
- `src/projects/_rnd/svg-scenes/ProtoGeminiPoseBankWalk.tsx` (compo Root `RND-ProtoGeminiPoseBankWalk`) :
  reconstruction du rig Gemini en JSX (paths + hiérarchie copiés du SVG brut), **interpolation continue**
  des angles `rotate()` entre walk-a et walk-b frame par frame (`lerpAngles`, easing linéaire, ~14 frames par
  demi-pas). **Résultat : marche FLUIDE, ZÉRO décrochage, mouvement crédible** — confirmé visuellement
  frame par frame (contact sheet `walk-contact-sheet.png`, render `out/_rnd/pose-bank-test/gemini-walk-test.mp4`).
- `src/projects/_rnd/svg-scenes/_archive/ProtoGptPoseBankWalk.tsx` ⚠️ fichier source archivé, exclu du build
  (compo Root `RND-ProtoGptPoseBankWalk` désimportée) : les 4 SVG GPT bruts (`public/_rnd/gpt-pose-bank/*.svg`)
  affichés en **CUT SEC** (pas d'interpolation possible, vu l'absence de hiérarchie de joints) au même rythme
  (~14 frames/pose). Résultat : chaque pose individuelle reste correcte, mais le mouvement SAUTE d'un état à
  l'autre au lieu de progresser — pas une vraie marche animée, un slideshow à 2 images (render
  `out/_rnd/pose-bank-test/gpt-walk-test.mp4`).

**VERDICT FINAL — renversement complet du jugement du 1er passage** : **Gemini 3.1 Pro l'emporte nettement**
pour ce cas d'usage (personnage articulé destiné à être animé), pas GPT-5.5. La raison structurelle : Gemini
a "pensé articulation" nativement en écrivant le SVG (translate au joint + rotate = comportement par défaut
de son style de génération), alors que GPT "pense illustration" (paths figés, jointures ajoutées a
posteriori sous forme d'annotation JSON qui ne correspond à aucune structure de rendu réelle). C'est cohérent
à travers TOUS les tests de cette session : rig-first sur image (GPT, échoué) + banque de poses texte-pur
(GPT anatomie moyenne + pas de rig ; Gemini anatomie fine sur le geste dur + rig FK natif qui marche).

**⚠️ Correction de diagnostic (2026-07-02, question d'Aziz après avoir vu la vidéo GPT)** : Aziz a noté que
le perso GPT "fait un pas puis se fige complètement" — investigation a montré que ce N'EST PAS le rig plat
en cause en premier lieu : **`walk-a.svg` et `walk-b.svg` de GPT sont quasiment la MÊME pose** (comparaison
côte à côte `check-a-vs-b.png` — même jambe avant, même bras, écart minime), pas un vrai moment opposé du
cycle de marche. Un `key={src}` forçant le remount DOM a été testé pour écarter un bug de cache navigateur —
aucun changement, confirmant que le cut alterne bien mais entre 2 images quasi identiques. **Fait notable :
les 2 poses Gemini (walk-a/walk-b) sont ÉGALEMENT quasi identiques entre elles** (`check-gemini-a-vs-b.png`)
— donc ce n'est PAS l'écart entre poses qui a produit la marche fluide de Gemini dans le test vidéo. **La
vraie cause du succès Gemini est l'INTERPOLATION CONTINUE des angles** (codée dans `ProtoGeminiPoseBankWalk`,
`lerpAngles` frame par frame) : même entre 2 poses-cibles proches, faire varier en continu les valeurs de
rotation produit un vrai balancement lisible comme mouvement. GPT, sans hiérarchie de joints, ne peut QUE
cutter entre états figés — et 2 états figés presque identiques + zéro valeur intermédiaire = perception de
personnage qui "ne bouge plus". **Conséquence pour la suite** : ne pas compter sur l'écart entre poses
successives pour faire le travail de suggestion du mouvement — c'est le rig FK + interpolation d'angles qui
porte le mouvement, quelle que soit la proximité des poses-cibles. Ça ouvre la porte à enchaîner PLUSIEURS
actions en une seule chaîne continue de valeurs d'angles (marcher→s'arrêter→se pencher→ramasser→se relever),
exactement comme `computePose()` le fait dans StickRig — sauf que la FORME des segments vient de Gemini.

**Conclusion opérationnelle révisée** : pour un personnage SVG riche et ANIMABLE en continu (pas juste en
cut), **Gemini 3.1 Pro text-to-SVG est la piste gagnante**, à condition de demander explicitement la
convention de nommage de groupes (comme fait ici) — le rig FK semble être un comportement spontané de ce
modèle sur ce type de prompt, pas quelque chose qu'il faut lui arracher. Le rig capsule (`capsuleSegment.ts`,
code pur, zéro dépendance LLM) reste l'option la plus robuste et gratuite par itération pour la PRODUCTION
immédiate ; la piste Gemini pose-bank est plus riche visuellement (vêtements, volume, couleurs) mais dépend
d'un appel API par personnage/tenue et nécessite de reconstruire le rig en JSX à la main à partir du SVG brut
(comme fait dans `ProtoGeminiPoseBankWalk.tsx` — pas un import direct, un portage manuel du XML vers JSX avec
`lerp` des angles). GPT-5.5 texte-pur reste utile pour des poses STATIQUES isolées (pas de plan d'animation
continue prévu) mais est écarté pour tout personnage destiné à marcher/bouger en continu.

**Prochaine étape si cette piste Gemini est reprise en production** : étendre le set de poses (au minimum :
idle, walk-a/b, bend-reach déjà faits + tend-la-main/offerReach, porte-charge — cf. Recettes rapides
ci-dessous), écrire un script réutilisable qui EXTRAIT automatiquement la hiérarchie de joints du SVG Gemini
brut vers une structure JSX/objet Angles (au lieu du portage manuel fait pour ce test), et valider la
robustesse sur des rotations plus amples / d'autres poses (bend-reach, offer) avant de considérer la piste
mûre pour un vrai personnage de production.

Fichiers de ce test (scratch) : `out/_rnd/pose-bank-test/` (prompt, réponses brutes GPT+Gemini, 8 SVG,
2 renders MP4, contact sheets). Fichiers gardés dans le repo (protos réutilisables) :
`src/projects/_rnd/svg-scenes/ProtoGeminiPoseBankWalk.tsx` (actif), `_archive/ProtoGptPoseBankWalk.tsx`
⚠️ archivé, exclu du build, `public/_rnd/gpt-pose-bank/*.svg`.

### ⭐⭐⭐ Chaîne d'actions complète (2026-07-02) — enchaînement marche→arrêt→penché→ramasse→relève→repart

Suite au test de marche isolée, Aziz a demandé si GPT "se fige après un pas" (observé sur `gpt-walk-test.mp4`)
révélait un vrai problème et ce qu'il fallait comprendre du succès Gemini pour enchaîner PLUSIEURS actions.
Investigation + un enchaînement complet codé et corrigé en 3 itérations. Résumé pour ne pas répéter les
mêmes erreurs de raisonnement :

**1. Le "GPT se fige" n'est PAS un bug de code.** Vérifié : la logique de cut alterne bien walk-a/walk-b,
un `key={src}` forçant le remount DOM n'a rien changé. La vraie cause, révélée en comparant `walk-a.svg` et
`walk-b.svg` de GPT côte à côte (`check-a-vs-b.png`) : **ce sont deux poses quasiment identiques**, pas un
vrai moment opposé du cycle de marche. Fait surprenant : **les 2 poses Gemini walk-a/walk-b sont ELLES
AUSSI quasi identiques** (`check-gemini-a-vs-b.png`) — donc l'écart entre poses-cibles n'explique PAS le
succès de Gemini en marche. La vraie cause : **l'interpolation continue des angles** (codée à la main,
`lerpAngles` frame par frame) crée le mouvement même entre 2 poses proches ; GPT, sans hiérarchie de joints,
ne peut QUE cutter entre états figés → 2 états quasi identiques + zéro intermédiaire = perception de
personnage figé. Leçon : ne JAMAIS compter sur l'écart entre poses-cibles pour "faire le travail" du
mouvement — c'est le rig FK + l'interpolation qui portent le mouvement, quelle que soit la proximité des
poses fournies par le LLM.

**2. Chaîne complète codée** (`src/projects/_rnd/svg-scenes/ProtoGeminiActionChain.tsx`, compo Root
`RND-ProtoGeminiActionChain`) : une timeline explicite (objet `T` en frames) enchaîne idle → marche (cycle
walk-a/walk-b) → décélère vers idle → penché vers `BEND_REACH` → HOLD → redressement vers idle → repart en
marche → arrêt final. Structure directement inspirée de `computePose()`/`poses.ts` (StickRig) : une SEULE
fonction de pose continue pilotée par `frame`, pas des clips vidéo qu'on colle bout à bout.

**3. Deux itérations d'échec avant le résultat correct — la vraie leçon de cette section.**
- **v1** (lerp linéaire simple entre IDLE et BEND_REACH, `hipX/hipY` gardés à la valeur BEND_REACH de Gemini
  telle quelle) : au HOLD, le personnage apparaissait **couché sur le côté**, pas accroupi
  (`chain-contact-sheet.png`). Diagnostic initial (FAUX) : "manque la compensation du bassin qu'on connaît
  déjà pour StickRig" (`poses.ts` § compensation bassin — `hipBack`/`hipDrop` proportionnels au `torsoTilt`).
- **v2** (ajout d'une fonction `withHipCompensation` inspirée de `poses.ts`, `hipX/hipY` recalculés
  artificiellement en fonction de `torsoTilt`) : **AUCUNE amélioration** — toujours couché
  (`chain-v2-contact-sheet.png`). Ce diagnostic était donc faux : le rig Gemini n'est PAS un système de
  pivot pur autour d'une hanche fixe comme StickRig (où le code calcule `hipBack`/`hipDrop` PARCE QUE la
  cinématique part d'une hanche fixe et fait pivoter le torse) — Gemini avait dessiné sa pose `bend-reach`
  avec son PROPRE point d'ancrage `hipX/hipY=(120,415)`, DÉJÀ cohérent avec ses propres angles de jambes
  (torse penché + bassin qui a reculé/descendu, exactement l'équilibre visé — mais encodé dans la
  TRANSLATION du groupe racine, pas dans une correction a posteriori des angles de jambes).
- **v3 (correct)** : diagnostic refait en comparant ma reconstruction JSX à l'image originale
  `check-gemini-bend.png` (`bend-original-vs-mine.png`) — la jambe avant "pendouillait" au lieu d'être
  repliée sous le corps. Fix réel : **supprimer entièrement la compensation ad hoc et laisser `hipX/hipY`
  interpoler NATIVEMENT entre les valeurs IDLE (200,340) et BEND_REACH (120,415) exactement comme les
  autres angles** (déjà supporté par `lerpAngles`, il suffisait de ne pas les figer artificiellement).
  Résultat vérifié par comparaison directe : pose HOLD quasi identique à l'original Gemini
  (`chain-v3-vs-original-final.png`). Render final : `out/_rnd/pose-bank-test/gemini-action-chain-v3.mp4`.

**Leçon opérationnelle pour toute future pose Gemini multi-états** : NE PAS supposer que le savoir-faire
StickRig (compensation de bassin autour d'un pivot fixe) s'applique tel quel à des poses Gemini importées —
Gemini encode l'équilibre de sa pose directement dans le COUPLE (translation racine, angles de membres),
pas dans une correction séparée. Le bon réflexe : interpoler TOUTES les valeurs (translation ET angles)
entre 2 poses Gemini complètes plutôt que d'isoler un sous-ensemble "stable" (hipX/hipY) et le recalculer à
la main — le LLM a déjà résolu cet équilibre en amont, le rôle du code est de FAIRE CONFIANCE aux 2 poses
extrêmes et d'interpoler entre elles, pas de réinventer une physique par-dessus.

**Point (a) corrigé — transition "se penche" STAGGERED (2026-07-02, v4)** : la transition mi-chemin
bancale (torse déjà penché sur des jambes encore presque droites) a été fixée avec `lerpBendPose()` —
les jambes (genoux/pieds/hipX/hipY) interpolent en AVANCE (`t/0.85`), le torse/bras/tête suivent avec un
retard de 15% (`(t-0.15)/0.85`), chacun avec son propre `easeInOutCubic`. Reproduit l'ordre naturel d'un
accroupissement (on fléchit les jambes avant que le buste finisse de plonger). Vérifié visuellement sur
6 frames intermédiaires (`chain-v4-bend-transition.png`) : progression lisible, plus de passage bancal.
Render final : `out/_rnd/pose-bank-test/gemini-action-chain-v4.mp4`.

**Point (b) non traité, à noter** : le personnage se déplace toujours visiblement horizontalement pendant
le penché/relevé (hipX 200→120, cohérent avec "reculer le bassin en se penchant" mais à valider si ce
déplacement latéral est souhaité narrativement ou à contraindre selon la scène de production future).

### ⛔ Pose accroupissement/squat — ÉCARTÉE après retour Aziz (2026-07-02), 2 raisons de fond

Après le fix v4 ci-dessus, Aziz a pointé un problème plus profond que je n'avais pas assez creusé — la pose
`BEND_REACH` (torsoTilt=80°) se lit toujours comme quelqu'un À TERRE / QUI A TRÉBUCHÉ, pas un accroupissement,
même après correction de la transition. Une nouvelle pose dédiée a été générée (prompt explicite demandant
un vrai SQUAT — genoux fléchis, torse quasi-vertical ≤25°, PAS de bend-at-hips) : `torsoTilt=25°` au lieu de
80°, résultat nettement plus lisible comme accroupissement (`squat-pose.png`). Intégrée avec un composant de
rendu séparé (`SquatRig`, formes arrondies/cercles aux joints — géométrie différente de `GeminiRig`) et un
cross-fade court aux transitions.

**Mais 2 raisons ont fait écarter cette piste ENTIÈREMENT (squat retiré de `ProtoGeminiActionChain.tsx`,
retour à idle→marche→arrêt→repart→idle uniquement) :**

1. **Incohérence de personnage détectée par Aziz** : la pose squat a été générée par un appel Gemini
   SÉPARÉ, sans référence au personnage établi (couleurs/proportions non données dans le prompt). Résultat
   vérifiable : peau `#5c3a21` (squat) vs `#8B5A2B` (marche/idle, plus clair), chemise `#d4c5b0` beige terne
   vs `#FFFDD0` crème, pantalon `#2c3539` vs `#2F4F4F`, chapeau `#e8c37d` + forme différente (2 formes
   superposées vs triangle+base elliptique). Ce n'est PAS le même personnage — Gemini réinvente sa palette
   à chaque appel indépendant. Confirmé par grep des couleurs sur les 2 fichiers SVG source.
2. **Cas d'usage marginal selon notre propre doctrine** : `MISE-EN-SCENE-INFOGRAPHICS-SHOW.md` (issue du
   décodage de 5 épisodes réels de studios pro) établit que le registre DOMINANT est statique+marche
   latérale/3-4 — les actions articulées au sol (accroupissement, ramassage) sont rares en plan large.
   Continuer à peaufiner cette pose spécifique = optimiser un cas qu'on utilisera peu, au détriment du
   temps disponible pour fiabiliser le cas qui compte (marche/statique, déjà solide).

**⭐ Leçon pour toute future extension de pose bank** : générer TOUTES les poses d'un même personnage dans
UN SEUL appel/prompt avec une description de personnage FIGÉE (couleurs précises données explicitement,
pas laissées au hasard du modèle) — jamais des appels séparés pose par pose. Cf. `PERSONNAGE-VIVANT-INDEX.md`
section pose bank originale (idle/walk-a/walk-b/bend-reach) qui AVAIT bien été générée en 1 seul appel —
c'est justement pourquoi CES 3 poses restent cohérentes entre elles, contrairement au squat généré à part.

**✅ Personnalisation par palette — validée, approche RETENUE (2026-07-02)** : plutôt que régénérer via
Gemini (risque d'incohérence, coût API), le rig `GeminiRig` a été rendu paramétrable par un objet `Palette`
(6 couleurs : skin/shirt/pants/hat/boot/ink) injecté en props, la géométrie des segments restant strictement
inchangée. Démo (`ProtoGeminiPaletteDemo.tsx`, compo Root `RND-ProtoGeminiPaletteDemo`) : 3 personnages
synchronisés en marche côte à côte, 3 palettes différentes (chemise/pantalon recolorés). Résultat net,
zéro coût API, zéro risque d'incohérence — **approche à privilégier pour toute variation de personnage**
(différencier plusieurs personnages dans une scène, décliner un même personnage pour un autre épisode).
Render : `out/_rnd/pose-bank-test/gemini-palette-demo.mp4`.

### ✅✅✅ Extension du set de poses (5 poses, 1 seul appel, personnage FIGÉ) — PROUVÉ, 2026-07-02

Dernier test de la session, validant la leçon gravée juste au-dessus (générer toutes les poses d'un
personnage en UN SEUL appel avec description figée). Prompt unique à `gemini-3.1-pro-preview` demandant
**5 poses d'un coup** : `idle`, `walk-a`, `walk-b` (les 3 déjà connues) + 2 nouvelles — `offer` (bras avant
tendu à l'horizontale, geste "voici/tiens" pour montrer/offrir un objet) et `reach-up` (bras levé pour
cueillir sur un arbre). Choix motivé par Aziz comme le patron narratif le PLUS fréquent dans nos scènes
Souverain existantes (un personnage qui marche puis tend/montre un objet), par opposition au squat écarté
(registre marginal).

**Différence clé vs le test squat qui avait échoué** : le prompt donne cette fois une description de
personnage **entièrement figée** — 6 couleurs hex explicites (`skin #8B5A2B`, `shirt #FFFDD0`,
`pants #2F4F4F`, `hat #D2B48C`, `boot #3E2723`, `ink #1A1A1A`) + proportions numériques approximatives
(rayon tête, longueur torse/membres), avec la consigne explicite "this is the SAME character in different
poses, not 5 different characters".

**Résultat — cohérence de personnage VÉRIFIÉE, pas supposée** : grep des couleurs sur les 5 fichiers SVG
générés confirme des hex codes **strictement identiques** sur les 5 poses (aucune variation, contrairement
au squat où peau/chemise/pantalon/chapeau différaient tous). Planche comparative des 5 poses rendues
(`v2-pose-bank-sheet.png`) : même chapeau, mêmes proportions, même personnage reconnaissable de bout en
bout — y compris `offer` (bras tendu, main ouverte, geste lisible) et `reach-up` (bras levé, tête qui suit
la main, cohérent avec une cueillette).

**Cohérence géométrique interne notée** : `hipY=280` pour idle/offer/reach-up, `hipY=298` pour walk-a/b —
proche, pas de saut brutal comme le squat (qui passait de 340 à 415, cause du problème de portage). Chaque
pose garde la même hiérarchie de groupes (`torso`→`arm-upper-front`→`arm-lower-front`→`hand-front`, etc.)
que le premier set de poses.

**Scène narrative test codée** (`src/projects/_rnd/svg-scenes/ProtoGeminiOfferScene.tsx`, compo Root
`RND-ProtoGeminiOfferScene`) : idle → marche → arrêt → tend le bras (interpolation `easeInOutCubic` IDLE→
OFFER) → hold → rabaisse le bras → repart → idle. Rendu vérifié frame par frame
(`offer-scene-contact-sheet.png`) : transitions fluides, aucune incohérence visuelle, geste du bras tendu
bien lisible dès l'arrêt de la marche. Render : `out/_rnd/pose-bank-test/gemini-offer-scene.mp4`.

**Conclusion opérationnelle** : la méthode "1 appel, personnage figé par couleurs hex explicites" est
**validée et reproductible** — c'est la procédure à suivre pour toute future extension du set de poses
Gemini (ex. futurs : porte-charge, immobile-contemplatif). Fichiers de ce test (scratch) :
`out/_rnd/pose-bank-test/prompt-pose-bank-v2-offer.txt`, `response-v2-offer.txt`, `v2-*.svg` (5 fichiers).

### ⭐⭐⭐ Deux systèmes distincts, PAS concurrents : rig capsule = mécanique, personnage Gemini = habillage (2026-07-02)

Session "consulter Gemini sur ses propres capacités" (au lieu de deviner quelles poses demander). Aziz a
recadré une confusion en cours de session : le rig capsule (`capsuleSegment.ts`/`StickRig.tsx`) et le
"rig FK Gemini" (poses text-to-SVG figées, § ci-dessus) ne sont **pas deux systèmes à choisir l'un contre
l'autre** — ce sont deux couches complémentaires du même problème :
- **Rig capsule** = la MÉCANIQUE de mouvement, 100% code, zéro dépendance API. C'est lui qui sait déjà FAIRE
  crédiblement porter une charge (`carry="hand-basket"`/`"shoulder-sack"`, bras qui pend + balancier amorti
  par le poids — PAS un bras levé au-dessus de la tête), plier un genou, gérer 8 directions
  (`StickRigMultiDir.tsx`). Squelette technique, sans habillage visuel (couleurs/silhouette).
- **Personnage Gemini** = l'HABILLAGE (silhouette, couleurs, chapeau, style encre), déclinable en poses
  figées via consultation + génération 1-appel-1-pose (méthode ci-dessus). N'a PAS de mécanique paramétrique
  générale — chaque nouvelle action doit être transposée à la main depuis le rig capsule.

**Le vrai travail = transposer la mécanique du rig capsule vers le personnage Gemini, action par action**,
PAS une "migration" générale en un coup. Preuve par l'échec puis la correction (2026-07-02) :

1. **Échec initial "tête chargée"** (`ProtoGeminiHeadLoadWalk.tsx`) : un panier posé en équilibre sur la
   tête, bras levés en V de chaque côté. Lu par Aziz comme "bras qui saluent", pas "porte un panier" —
   parce que ce n'est PAS la mécanique réelle du port de charge (aucune main ne "tient" rien, juste un
   objet qui flotte). Erreur de jugement visuel de ma part, pas une limite du rig.
2. **Correction "panier à la main"** (`ProtoGeminiHandBasketWalk.tsx`) : bras avant PEND le long du corps
   (pas levé), main tient le panier, balancier léger amorti par la marche ; bras arrière libre balance
   normalement. Mécanique copiée directement de `StickRig.tsx` (`carry="hand-basket"`, ligne ~128 :
   `swingLoad = swingDeg * 0.25 * (1 - load)`). Résultat validé par Aziz — "marche parfaitement".
3. **"Sac à l'épaule + marche penchée/ralentie"** (`ProtoGeminiShoulderSackWalk.tsx`) : mécanique copiée de
   `carry="shoulder-sack"` (main remonte tenir la sangle près de l'épaule/cou, coude serré). 2 échecs avant
   le bon résultat : (a) sac positionné à la mauvaise hauteur (`y=-160`, chevauchait la tête à `y=-180` —
   toujours vérifier la position relative aux AUTRES groupes, ex. head à `translate(0,-135)` puis
   `cy=-45` = tête réelle vers `y=-180`) ; (b) angles de bras devinés au jugé (`upper=-35, lower=-95`)
   produisaient un bras qui pointait HORS du corps au lieu de replier vers l'épaule — **corrigé en
   calculant la position finale de la main par trigonométrie** (simulation Python de la chaîne de
   rotations cumulées `sin/cos(upper)` puis `sin/cos(upper+lower)`) plutôt qu'en essayant des angles à
   l'aveugle. Leçon : dès qu'un angle de bras replié semble faux visuellement, calculer la position
   finale de la main au lieu d'itérer par essais-erreurs sur les degrés.

**Conclusion opérationnelle** : avant de transposer une nouvelle charge/geste, (1) identifier la bonne
mécanique dans `StickRig.tsx` (grep `carry=`), (2) SI un angle replié semble faux, calculer trigonométri-
quement la position de main visée plutôt que deviner, (3) toujours vérifier la position d'un objet ajouté
(sac/panier) relative aux AUTRES groupes déjà positionnés (tête, épaule), pas en absolu.

**✅ `recolte-au-sol` TRANSPOSÉ (2026-07-02)** : `ProtoGeminiBendPickup.tsx` (`RND-ProtoGeminiBendPickup`).
Formule reprise EXACTEMENT de `poses.ts computePose(bend)` : `torsoDeg=bend*70`, `hipBack=-(torsoDeg/90)*70`
(compensation), `hipDrop` proportionnel à NOS longueurs de jambe (pas la constante `34` du système source,
qui suppose `LEG=150` — recalculer `bend * NOTRE_LEG_TOTAL * (34/150)` sinon le ratio drop/jambe est faux
à une autre échelle). Bras avant vise 22° ABSOLU vers le sol (indépendant du torse) → converti en angle
LOCAL par soustraction du tilt (`armUpperLocal = 22 - torsoDeg`), sinon le bras ramasse dans le mauvais sens
dès que le torse est incliné.

**⛔⛔ BUG STRUCTUREL trouvé et corrigé — jambes NE DOIVENT PAS hériter de `rotate(torsoTilt)`** : dans
`poses.ts`, `stepAmp = moveAmt*(1-bend)` → dès que `bend=1`, `swingDeg=0` et **les jambes restent
VERTICALES dans l'espace absolu**, seul le bassin translate (recule+descend) et le torse pivote AUTOUR de
la hanche. 1er essai : un seul groupe racine appliquait `translate(hip) rotate(torsoTilt)` à TOUT (jambes
incluses, héritage du composant marche où c'était voulu) → jambes qui pivotent avec le torse = effet
"planche/pompe à bras", pas un vrai penché. **Fix** : découpler en 2 groupes — le groupe HANCHE fait
seulement `translate()` (position), un SOUS-groupe séparé fait `rotate(torsoTilt)` pour torse+bras+tête
uniquement ; les jambes restent enfants directs du groupe hanche, donc verticales même à torsoTilt=70°.
Règle générale à vérifier à chaque nouvelle transposition : **si un membre ne doit PAS suivre un tilt de
torse, il ne doit PAS être dans le même `<g>` que celui qui applique ce tilt** — même si ça marchait pour
un autre geste (ici la marche), la hiérarchie de groupes n'est pas neutre, elle encode des hypothèses.

**✅ `manipuler-objet` TRANSPOSÉ (2026-07-02)** : `ProtoGeminiManipulateObject.tsx`
(`RND-ProtoGeminiManipulateObject`). Bâti directement sur `recolte-au-sol` (même `bendPose`) + machine à
états reprise d'`objectHandling.ts` (objet collé à la position RÉELLE de la main tant que tenu, jamais de
glissade autonome). **Bug trouvé** : l'objet était correctement positionné (calcul trigonométrique juste)
mais **invisible à l'écran** — deux causes cumulées : (1) dessiné AVANT le personnage dans le JSX donc
masqué par le bras qui se dessine par-dessus (ordre JSX = ordre de calque SVG) ; (2) couleur/taille trop
proches des couleurs déjà présentes sur le personnage (bras `#8B5A2B`, chaussures `#3E2723`) pour se
distinguer même une fois au-dessus. Diagnostic confirmé en rendant l'objet temporairement énorme et en
magenta vif — ne pas hésiter à ce genre de test volontairement absurde pour trancher vite entre "mal
positionné" et "invisible pour une autre raison".

**✅ `passer-objet-main-a-main` TRANSPOSÉ (2026-07-02), RÉUSSI DU PREMIER ESSAI** :
`ProtoGeminiHandoff.tsx` (`RND-ProtoGeminiHandoff`). Contraste instructif avec les 2 gestes ci-dessus (qui
ont chacun nécessité 2-3 corrections) : celui-ci a marché immédiatement car il ne fait que RECOMBINER des
briques déjà validées — le cycle de marche, le geste "offer" bras tendu horizontal (angles repris tels
quels de `ProtoGeminiOfferScene.tsx`, pas recalculés), et la fonction de calcul de position de main déjà
écrite pour `manipuler-objet`. Personnage B = simple miroir de A (`scale(-1,1)` sur tout son groupe), donc
son bras "avant" pointe automatiquement à gauche sans recalcul d'angle séparé. Point de contact FIGÉ
(calculé une fois à `fHold`, pas recalculé à chaque frame du hold) — même principe que `handoffState()`
dans `objectHandling.ts`. **Leçon** : quand un nouveau geste peut se décomposer en gestes déjà transposés
et validés, l'assembler directement plutôt que recalculer from scratch — le risque d'erreur baisse
fortement.

**✅✅ `cueillette-arbre` CONÇU DE ZÉRO (2026-07-02) — premier geste SANS référence rig capsule** :
`ProtoGeminiTreeCueillette.tsx` (`RND-ProtoGeminiTreeCueillette`). Contrairement aux 5 gestes précédents
(tous transposés depuis une mécanique déjà écrite dans `StickRig.tsx`/`poses.ts`/`objectHandling.ts`),
celui-ci n'avait aucune référence côté rig capsule. Angles du bras levé repris tels quels du test Gemini
`v2-reach-up.svg` (session précédente, déjà validé en silhouette) — `armUpperFront=-155,
armLowerFront=-10, headTilt=15` — plutôt que devinés, même sans référence "mécanique" à copier.

**2 bugs trouvés, tous deux DÉJÀ documentés dans une leçon antérieure de cette même session — vérifier
qu'une leçon gravée est bien réappliquée avant de coder, pas seulement après avoir buggé :**
1. Le personnage sortait du viewBox en fin de séquence (distance de marche de retour mal calibrée par
   rapport à la largeur du cadre SVG) — erreur de calcul simple, pas un bug de mécanique.
2. **L'objet cueilli "disparaissait" pendant la marche de retour** — même erreur EXACTE que
   `marche-porte-charge` (§ "Deux systèmes distincts" plus haut) : le bras qui tient l'objet réutilisait
   le cycle de marche LIBRE (`WALK_A`/`WALK_B`, bras à ±45°), alors qu'un bras chargé doit être figé à un
   angle réduit (ici `armUpperFront=-10` au lieu de ±45) pendant que l'AUTRE bras (libre) suit le grand
   balancier. Fix : variantes `WALK_A_CARRY`/`WALK_B_CARRY` (mêmes jambes, bras avant figé), `walkCycle()`
   généralisé pour accepter des poses A/B en paramètre au lieu de les coder en dur.

**✅ `immobile-contemplatif` FAIT (2026-07-02) — dernier geste du catalogue, réussi du 1er essai** :
`ProtoGeminiContemplatif.tsx` (`RND-ProtoGeminiContemplatif`). Le plus simple des 7 : boucle sinusoïdale
lente (période ~4s) sur torse/bras/tête (pas de machine à états, pas de déplacement, pas d'objet) pour
éviter l'effet "statue figée". Confirme le pattern de la session : les gestes sans interaction d'objet ni
déplacement (donc sans risque de z-order/glissade/cadrage) sont les plus fiables du premier coup.

**Catalogue complet (7/7 gestes du plan de session 2026-07-02)** : marche neutre, panier à la main, sac à
l'épaule + marche penchée, recolte-au-sol, manipuler-objet, passer-objet-main-a-main, cueillette-arbre,
immobile-contemplatif. Prochaine extension suggérée : `planter-arbre` (2 personnages, creuser+déposer —
seul item du § Recettes rapides encore non transposé).

Fichiers scratch de cette session : `out/_rnd/pose-bank-test/response-capabilities-A-script.md` (Gemini
consulté sur poses utiles pour le script Cacao précis) + `response-capabilities-B-broad.md` (catalogue
large, avec niveaux de risque auto-évalués par Gemini — accroupissement marqué "Borderline/Risky",
cohérent avec l'écart déjà acté § squat) + `Proto*Walk.tsx` (3 composants Root, testés en rendu réel).

### Fugu Ultra (Sakana AI) — testé, écarté pour le SVG (2026-07-02)
Même protocole "pose bank" que le test Gemini/GPT ci-dessus. Résultat technique positif (rig FK natif,
tient en interpolation) mais écarté pour la production : API peu fiable sur prompt multi-poses (3 échecs
500), coût 2-3x supérieur à Gemini pour un set équivalent, style de rendu instable entre appels. Détail :
`memory/tools/openrouter-svg.md` § Fugu Ultra. Gardé en réserve pour un cas hors-SVG futur, pas ce registre.

### ⭐⭐ TRIO VISAGE + CORPS FRONTAL sur GeminiRig (2026-07-03, valide Aziz)

**Constat** : analyse de 4 chaines YouTube (Infographics Show, Simple History, Hypothetically, Crayon Capital)
-> TOUTES ont au minimum yeux-points + sourcils + bouche, meme les plus minimalistes. Notre rig n'avait aucun
trait facial -> gros plan impossible, personnage sans vie.

**Solution** : trio minimum (yeux + sourcils 2 traits separes + bouche courbe) ajoute au GeminiRig canonique
(FK Gemini 3.1 Pro). Le StickRig a aussi recu le trio (prototypage initial) mais le GeminiRig est le rig
CANONIQUE pour les scenes narratives bustes/gros plans.

**2 vues seulement** (decision Aziz, le 3/4 est visuellement identique au front = gain nul) :
- `profile` : 1 oeil, corps de profil, bras/jambes en balancier FK
- `front` : 2 yeux symetriques, corps face camera (torse elargi, bras sur les cotes, jambes paralleles)

**5 expressions** : `neutral`, `smile`, `serious`, `surprise`, `angry` — via `face` prop.
A RETRAVAILLER (session future) : les sourcils seuls ne distinguent pas assez angry/surprise/smile. Combiner
sourcils + forme de bouche + ouverture des yeux de maniere plus contrastee.

**Cou ajoute** : petit trapeze couleur peau entre epaules et tete. Plus de tete flottante.

**Chapeaux** : 3 types (`conical`, `cap`, `scarf`) + `none`. Hat de profil = triangle asymetrique (perspective).
Hat frontal = symetrique. A CONSOLIDER (session future) : les accessoires doivent etre ancres au centre exact
de la tete avec un offset fixe, pas un path absolu -> eviter les artefacts de position au headTilt.

**Fichiers** :
- `rig/GeminiRig.tsx` : ⭐ chemin CANONIQUE (déplacé depuis `_rnd/svg-scenes/ProtoGeminiPoseBankWalk.tsx` le
  2026-07-03, proto garde un re-export temporaire). GeminiRig exporté (composant paramétré), types exportés
  (`LimbAngles`, `FaceExpression`, `FaceView`, `GeminiRigProps`), poses (`IDLE`/`WALK_A`/`WALK_B`), helpers
  (`lerp`/`lerpAngles`).
- `_rnd/svg-scenes/ProtoCadrages.tsx` : planche comparative 4 panels (plan large profil, buste profil,
  buste face, gros plan face) avec cycle d'expressions. Compo Root `RND-ProtoCadrages`.

**Prochains chantiers grammaire narrative** (valides Aziz, a faire en session future) :
1. 2-3 personnages buste face-a-face (differencies vetement/chapeau/peau)
2. Personnage buste devant ecran/tableau de donnees
3. Texte dialogue flottant au-dessus du personnage
4. Scene de groupe 4-5 personnages alignes

## Historique
Ne de la R&D cacao 2026-06-30 (dossier `_rnd-perso/` purge apres extraction ici). Feuille de route animation (Gemini+web concordants) :
`memory/episodes/souverain/cacao-chocolat-short/ANIMATION-STICKFIGURE-FEUILLE-ROUTE.md`.
