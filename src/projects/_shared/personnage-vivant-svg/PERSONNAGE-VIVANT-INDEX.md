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
- `rig/StickRig.tsx` — le composant rig générique. Props : `walkPhase, moveAmt, bend, armReach, offerReach, facing, ink, tunicColor, hat`.
- `rig/objectHandling.ts` — `objectState` (ramasser→tenir→déposer) + `handoffState` (transfert main-à-main, 2 persos).
- `scenes-proto/RecolteAuSol.tsx` — ⭐ scène-prototype validée (entre→marche→penche→ramasse→relève). Compo Root :
  `PersoVivant-RecolteAuSol`. La copier comme point de départ d'une nouvelle scène.
- `scenes-proto/PasserObjetMainAMain.tsx` — scène-prototype 2 persos, transfert main-à-main. Compo Root :
  `PersoVivant-PasserObjetMainAMain`. Render de réf : `out/_r-and-d/personnage-vivant-svg/passer-objet-main-a-main-v1.mp4`.

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
- ⬜ `planter-arbre` (GGW) : 2 persos, creuser/déposer un jeune plant. (prochain)
- ⬜ `cueillette-arbre` : tend le bras vers le HAUT (cabosse sur tronc) — inverser l'angle du bras.
- ⬜ `immobile-contemplatif` : debout, respiration, regarde l'horizon.

## Idées d'évolution
- [[IDEE-PERSO-8-DIRECTIONS]] : passer de profil (facing ±1) à 8 directions (N/S/E/O + diagonales) pour traverser
  en profondeur (champ→usine). À construire SUR ce rig.
- Transposition 16:9 : la grammaire profondeur/parallaxe/heure dorée est prouvée (B5PontH). Régler la vitesse de
  translation (voir note FOOT-PLANT) pour matcher la cadence du 9:16.

## Historique
Né de la R&D cacao 2026-06-30 (dossier `_rnd-perso/` purgé après extraction ici). Feuille de route animation (Gemini+web concordants) :
`memory/episodes/souverain/cacao-chocolat-short/ANIMATION-STICKFIGURE-FEUILLE-ROUTE.md`.
