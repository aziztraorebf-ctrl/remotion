# Gazoduc AAGP vs TSGP — STATUS

**Mis à jour** : 2026-08-18

## 🏁 ACTE 3 — SEGMENT C **FINAL** + SEGMENT A **DÉBLOQUÉ** (2026-08-18)

### ✅ SEGMENT C (105,8 → 123,1 s) — « LE VERROU CROISÉ », validé Aziz
Livrable : `out/episodes/gazoduc-aagp-tsgp/acte3-segmentC-verrou-FINAL.mp4` (17,26 s, activité
médiane 2,94 %, aucun creux). Code : `GazoducActe3Verrou.tsx` (compo `D3-Gazoduc-Acte3-Verrou`).
Décor SVG : `src/projects/_rnd/svg-scenes/GazoducVerrouCroise.svg` (Fable 5, 20 groupes animables).
Concept : Grok · planche : Grok Imagine 2.0.

Une conduite en coupe, deux vannes. Côté Maroc la sécurité est grande ouverte mais le financement
verrouillé par un mécanisme arachnéen ; côté Algérie l'inverse exact (disques verrouillés, puis
barbelés + fissures). Le fluide pousse et ne passe jamais — c'est lui qui tient les 17 s.
SFX : `impact.mp3` ×2, `ui/stamp-dossier.mp3` ×3, `ui/vault-lock.mp3`, + `impact/metal-crack.mp3`
(généré pour cette scène). Tous via `<Sequence>`.

⛔ **VARIANTE REJETÉE — `GazoducActe3Ponts.tsx`** (conservée pour trace, ne pas la reprendre).
Les 2 variantes ont été codées et rendues exprès : une scène de mouvement ne se juge qu'en mouvement.
Motif du rejet, qui vaut comme RÈGLE : la métaphore était **importée** au lieu d'être prise dans le
monde du sujet. Une conduite avec une vanne EST un gazoduc ; un pont REPRÉSENTE une infrastructure
(2 traductions mentales). ⚠️ C'était la plus belle planche des quatre — la beauté ne rachète pas le
coût de décodage. → `feedback_metaphore-dans-le-monde-du-sujet.md`

### ⭐ SEGMENT A / Beats 1-2 (0 → 55 s) — DÉBLOQUÉ, à faire valider
Rendu : `out/.../versions/acte3-segmentA-beats12-V3.mp4` (activité médiane **10,33 %**, minimum
7,42 %, aucun creux — contre 0,57 % sur les premiers jets). Code : `GazoducActe3CarteTSGP.tsx`.

Ce qui a débloqué l'acte, après des semaines de gel :
- **0 → 22 s** (breakdown Grok) : les deux tracés partent du MÊME point au Nigeria et divergent —
  l'or contourne par la côte, le cyan perce au nord. Idée tirée du script (« son point de départ est
  le même… mais au lieu de faire le grand tour »), jamais exploitée jusque-là.
- **22 s** : raccordement au **réseau algérien existant** (cyan pâle `#7FD8FF`, jamais doré — le doré
  est réservé au rival), qui dit « ils pompent déjà vers l'Europe depuis des décennies ».
- **43 s** (breakdown Gemini, calé sur `pelleteusesStart`) : **RUPTURE D'ÉCHELLE**. On quitte la
  carte, plein écran sur le chantier + minimap d'Algérie. Flash blanc 4 frames en entrée, hard cut en
  sortie. ⛔ **155 frames, UNE seule passe** : le clip fait 5,18 s et NE BOUCLE PAS (7,4 % de saut) —
  le hard cut esquive le problème. Ne jamais « prolonger un peu » ce plan.
- **Retour carte** : l'encart Adrar s'efface à la rupture et NE REVIENT PAS (décision d'Aziz : après
  l'avoir vu en grand, le remontrer en vignette est une redite). Le segment finit sur la carte vivante.

⛔ **LA TRANCHÉE A ÉTÉ CODÉE PUIS RETIRÉE** — ne pas la ressortir. Le script ne parle jamais de
creusement. Cause racine : **mon brief de storyboard l'avait soufflée** (`trench`, `it has started
digging`, `underground`) et 3 modèles sur 4 me l'ont renvoyée. 2e signal manqué : 4 itérations de
DOSAGE sur ce geste — quand un geste demande autant de réglage, c'est qu'il n'a pas de raison d'être.

### ⏭️ CE QUI RESTE SUR L'ACTE 3
1. **Beat 3 — panneau financement (55 → 72,3 s)** : ⭐ le plus prêt à coder. La spec existe au pixel
   près (`breakdown-v5-json/beat3-breakdown.json`) et n'a été codée qu'à moitié. Manquent : la banque
   barrée DANS le panneau (1170, 640), le trio ALGÉRIE → vanne ← NIGERIA (y≈700), les cylindres
   comparatifs. ⚠️ Le donut « 13 Mds$ » actuel n'est PAS dans la spec (elle demande du texte nu 104 px).
   Image-cible déjà composée, montrée à Aziz le 2026-08-17.
2. **Segment B (73,9 → 105,8 s)** : porter l'animation de `GazoducActe3InsertSecurite.tsx` sur le
   décor Fable 5 `GazoducAeroportFable5Test.tsx`. Timing/beats/extinction déjà résolus — seul le
   DÉCOR change. ⛔ Aucune figuration humaine.
3. Validation Aziz du Segment A.

## 🏁 ACTE 4 — COMPLET : mouvements A, B et C tous FINAUX (2026-08-16)

**Mouvement C** « le calendrier se retourne » (74.5→124.04s) : **FINAL, validé Aziz**.
Livrable `out/episodes/gazoduc-aagp-tsgp/acte4-mouvementC-FINAL.mp4` · code `GazoducActe4Calendrier.tsx`
(compo `D3-Gazoduc-Acte4-Calendrier`) · breakdown `breakdown-acte4/4C/4C-breakdown.json`.

⭐ **MOTEUR = GÉOMÉTRIE D3, pas la carte** — 1er beat de l'épisode à quitter la carte. Le beat parle du
TEMPS et de la QUANTITÉ (2030, « dizaines de milliards », marché qui rétrécit), pas de l'espace, et la
carte avait déjà porté 4A et 4B. Décision d'Aziz après 2 rounds de storyboard.

**Le concept, en une phrase** : un axe de temps · UNE courbe (la demande) qui reste vivante et s'en va ·
DEUX conduites ambre (les milliards) qui s'empilent puis se figent. Le sens est porté par le CONTRASTE
DE MOUVEMENT — l'argent bouge puis se verrouille, la demande continue de glisser. À la fin, **une
conduite s'éteint** : « un seul suffirait », sans un mot pour le dire.

⚠️ **3 décisions à ne pas défaire sur ce beat** :
1. **Le texte ne répète JAMAIS la narration.** 4 plaques supprimées (« des dizaines de milliards », « un
   marché qui rétrécit », « un seul suffirait », « AIE ») : c'était du sous-titrage déguisé. Il ne reste
   que l'indéductible : `AUJOURD'HUI` · `2030` · `DEMANDE EUROPÉENNE`. Leur sens est passé au GRAPHISME.
2. **Zéro tremblement, zéro flash.** 8 effets retirés (scale de cadre, pulses, flashs, ondes d'impact,
   frémissement animé de la courbe). Mesuré : agitation en phase calme 0.538 → 0.236. Un graphe premium
   ne tremble pas ; le relief de la courbe reste irrégulier mais FIGÉ dans l'espace.
3. **Storyboard : c'est le SIMPLE qui a gagné.** 2 rounds de propositions LLM (sablier, château de
   cartes, entonnoir, cartogramme, trajectoires croisées) tous écartés par Aziz au profit d'un simple
   graphe — « parfois faire simple est la manière la plus efficace d'expliquer un concept ».

## 🏁 ACTE 5 — FINAL (2026-08-17) — DERNIER ACTE DE L'ÉPISODE

Livrable : `out/episodes/gazoduc-aagp-tsgp/acte5-FINAL.mp4` (46,17 s / 1385 frames / audio -18,7 dB /
12 frames échantillonnées distinctes = aucun gel). Commit `2dc1464c`. Breakdown : `breakdown-acte5/`.

| Segment | Contenu | Composant |
|---|---|---|
| 0→10,4 s | maison en coupe + flamme + courbe de la facture | `GazoducActe5Maison.tsx` (mix Fable 5 + tracé de fil greffé de Kimi K3) |
| 10,4→29 s | UNE vanne + bifurcation en Y | `GazoducActe5Vannes2.tsx` (dessin GPT-5.5) |
| 29→42,1 s | négocier vs creuser | `GazoducActe5Negocier.tsx` (Fable 5, recalé) |
| 42,1→46,2 s | la faille finale | `GazoducActe5Faille.tsx` (dessin GPT-5.5) |

⚠️ **3 DÉCISIONS À NE PAS DÉFAIRE**
1. **La MAIN a été retirée** du segment 2. Elle répétait la narration (« qui aura la main sur le
   robinet »), portait le mauvais sujet (le script dit « et SURTOUT, selon quel MODÈLE ») — et surtout
   **DEUX robinets contredisaient le texte qui dit « LE prochain grand robinet », au SINGULIER**.
   Diagnostic issu de la review downstream. Versions abandonnées conservées et annotées :
   `GazoducActe5Vannes.tsx` / `GazoducActe5VannesGPT.tsx` — ⛔ ne pas les reprendre.
   ⭐ **Élargissement de la règle 4C** : ce n'est plus seulement « le TEXTE ne répète pas la
   narration » — **rien à l'écran, texte OU geste, ne redit ce que la voix dit au même instant**
   (2 cas le prouvent : les 4 plaques du 4C, la main de l'Acte 5).
2. **Refonte du segment 2 en UNE vanne + bifurcation** : activité mesurée 0,3 → 18,15.
3. **Coupes posées dans les silences**, jamais sur l'ancre d'un mot (voir § RESTE, leçon de méthode).

## ⏭️ RESTE DE L'ÉPISODE (2026-08-17)

1. ⛔ **PRIORITÉ 1 — ACTE 3** : seul acte non validé. Gel du 14/08 **LEVÉ** (sa condition — produire
   4 et 5 d'abord — est remplie). Repartir de l'état gelé mesuré, § « ACTE 3 — GELÉ EN WIP » plus bas.
2. ⚠️ **Acte 4 à ASSEMBLER** : 3 fichiers séparés (124,68 s cumulées pour 124,04 s d'audio, marges de
   300 ms à rogner). ⛔ Filtre `concat=n=N:v=1:a=0`, jamais `-f concat` par liste.
3. 🆕 **CTA de fin** : non commencé. L'épisode s'arrête net sur « CREUSER ». ⛔ Jamais d'interpellation
   directe ni de « abonnez-vous » frontal — « de manière classe ». Nouvelle voix vs carton à trancher.
4. **Passe finale** : re-render Actes 1/2/3 en palette sombre `PAL_GPT`, ⛔ PAS acte par acte.

---

## ⭐ Mouvements A et B — FINAUX (2026-08-15)

**Mouvement A** « une ressource, deux tuyaux » (0→41.1s) : **FINAL**, palette sombre `PAL_GPT` portée
(fond radial `#0d1f38`→`#050c1a`, pays inactifs 0.92, frontières `#58809f`/0.72).
**Mouvement B** « objectifs opposés » (41.1→74.5s) : **FINAL**, validé Aziz. Carte (continuité 4A) →
**insert SVG « levier de pouvoir »** (concept Gemini, exécuté par Fable 5, animé par nous : bras qui
fléchit sous la charge, socle qui encaisse, pivot qui respire) → retour carte : l'Europe apparaît comme
destination, l'Algérie s'affirme en bloc clair puis **une comète contourne visiblement son territoire**
pour rejoindre l'Europe pendant que sa route se vide. Tous les timings calés **au mot** sur le
forced-align (règle Aziz : compréhensible en moins de 2 s → un élément apparaît quand le mot le nomme).

Livrables : `out/episodes/gazoduc-aagp-tsgp/acte4-mouvementA-FINAL.mp4` + `acte4-mouvementB-FINAL.mp4`.
Code : `GazoducActe4RessourceUnique.tsx` + `GazoducActe4Objectifs.tsx`.

*(⚠️ Ligne « RESTE de l'épisode » du 15/08 retirée le 18/08 : elle disait que l'Acte 5 n'existait pas
— il est FINAL depuis le 17/08, voir son § plus haut. L'état réel de l'épisode est en tête de fichier.)*

⚠️ 2 décisions à ne pas défaire : (1) palette sombre = Acte 4 **et la suite**, Actes 1/2/3 re-rendus
seulement à la passe finale ; (2) 4B **v3 (arcs schématiques) préférée à v4** (géométrie réelle Medgaz,
codée puis écartée pour lisibilité).

---

## (ARCHIVE — état gelé au 2026-08-17) ⚠️ PÉRIMÉ, voir le § en tête (2026-08-18)
> ⛔⛔ **NE PAS AGIR SUR CE § .** Son point 4 recommande de coder le Beat 4 dans le Segment C —
> **CADUC** : le Segment C a été codé comme LE VERROU CROISÉ et il est FINAL/validé. Suivre cette
> reco reviendrait à refaire un livrable validé (mode d'échec documenté :
> [[feedback_lire-verdict-rejet-breakdown-avant-reprendre-version]]).

> Le gel du 2026-08-14 avait UNE condition : produire les Actes 4 et 5 d'abord (un acte du milieu se
> juge par rapport à ses voisins). **C'est fait.** On repart de l'état mesuré ci-dessous, pas de zéro.

**L'Acte 3 n'est PAS validé.** Il reste beaucoup de travail dessus. Décision explicite d'Aziz :
on arrête de s'acharner, on le met de côté, **on produit les Actes 4 et 5 d'abord**, et on revient
compléter l'Acte 3 ensuite — probablement quand le reste de la vidéo existera.

**Rendu de référence de l'état gelé** (Segment A, 22.2→74.2s, audio muxé) :
`out/episodes/gazoduc-aagp-tsgp/versions/acte3-segmentA-suite-V12-WIP.mp4`
Lien : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/suite-v12-AUDIO-punmGmdzHKM1IHLX8asNgVytLsq8Pb.mp4
Code correspondant : commit `9e302fb2` (branche `feat/gazoduc-acte1-hook-globe`).

### Ce qui EST acquis dans cet état gelé (à ne pas refaire, c'est du gagné)
- **Beat 1** (0→22.2s) validé Aziz : caméra continue, dessin trait-par-trait, tracé qui part à 6.3s.
- **Beat 2 (chantier Adrar)** : vrai insert COMPOSÉ (cadre + clip H3 pelleteuse + badge date + jauge
  37% + badge activité + connecteur vers le pin Adrar + carte assombrie). Le principe de l'insert
  composé est acquis et fonctionne — c'est le gain principal de ces sessions.
- **Segment B (aéroport Niamey)** : décor Fable5 porté sur la logique d'animation existante.

### ⛔ Ce qui reste CASSÉ / à faire (mesuré, pas supposé — ne pas re-diagnostiquer de zéro)
1. **Beat 3, panneau financement incomplet** : ~40% du bloc est vide à droite ; la banque barrée est
   HORS panneau (`W*0.82, H*0.2` dans le code = widget de bord, le défaut v3 déjà rejeté) ; le robinet
   Algérie→vanne←Nigeria du storyboard V5 n'existe pas. La V5 veut les deux DANS le bloc (phase B du
   breakdown, 64.1→68.5s).
2. **Quasi-immobilité 64.2→71.7s** (7.5s à 0.45-0.99% de pixels modifiés, sous le seuil de 1%) —
   MÊME cause que le point 1 : rien ne se joue dans le panneau pendant que la narration continue.
3. **Beat 4 (paradoxe) jamais repris depuis la V5** : le code est encore du v3 rejeté (labels
   `PACIFIÉ`/`ZONE ACTIVE` en texte nu sans support visuel, lignes ~951-965).
4. ⚠️ **Conflit de budget temporel non tranché** : le breakdown V5 dimensionne le Beat 4 sur **15.2s**,
   or le Segment A n'a que **1.9s** de tail après `financementEtatsEnd` (verrouillé sur l'audio).
   Reco Claude (NON validée par Aziz, à re-décider à la reprise) : coder le Beat 4 dans le **Segment C**
   (17.5s, dont le texte narré est justement "Le Maroc mise sur… / L'Algérie mise sur…"), en y mettant
   la carte avec la divergence des tracés à la place de l'insert SVG séparé — ce qui tranche du même
   coup le sort de `GazoducActe3InsertParadoxe.tsx`. Coût : un cut A→C.
   **Cette décision sera plus facile APRÈS l'Acte 4** (dont le climax "70% de la production siphonnée"
   détermine ce que la fin de l'Acte 3 doit préparer) — c'est une des raisons du gel.

### 🔑 Pourquoi on gèle (leçon de méthode, vaut au-delà du Gazoduc)
Même pattern que le **Soudan Acte 4** : plusieurs sessions d'acharnement sur un acte du MILIEU, avec
des moments de doute et de non-avancement. Un acte du milieu se juge par rapport à ses voisins — ici
l'Acte 3 est coincé entre un Acte 2 validé et des Actes 4/5 **qui n'existent pas**, donc sa fin se
juge dans le vide. Le conflit de budget du point 4 en est la preuve littérale. Produire 4 et 5
d'abord, revenir sur 3 ensuite.

---

## 🧭 (ARCHIVE — état au 2026-08-14) OÙ ON EN EST — ⚠️ PÉRIMÉ, voir le § RESTE DE L'ÉPISODE en tête

**Commit de référence** : `9e302fb2` sur `feat/gazoduc-acte1-hook-globe`. Tout est versionné
(breakdowns V5, breakdown caméra, clip H3, audio p3 — ils étaient non suivis par git avant ce commit).

### Ce qui est FAIT et VALIDÉ par Aziz
- **Acte 3 / Segment A / Beat 1 (0→22.2s)** — VALIDÉ. Caméra continue, dessin trait-par-trait,
  tracé qui part à 6.3s, pays qui restent marqués après passage.
  Render : `beat1-v8-AUDIO` (lien Vercel Blob dans l'historique de session).
- **Acte 3 / Segment B (aéroport Niamey)** — décor Fable5 porté sur la logique d'animation existante,
  vérifié par mini-renders. (L'ancien bloc « à intégrer » de ce STATUS était périmé.)

### Ce qui est FAIT mais PAS ENCORE VALIDÉ par Aziz
- **Beat 2 (chantier Adrar)** refait depuis le storyboard V5 : carte-insert composée avec le clip
  MiniMax H3 (pelleteuse), badge date, jauge 37%, badge activité, connecteur vers pin Adrar.
- **Beat 3 (financement)** : comparateur ramené du bord droit vers un panneau encadré centré.
- **Immobilité** corrigée sur 3 mouvements (plus longue série figée 12.0s → 0.0s sur 22→74s).
- Render : `suite-v12-AUDIO` (22.2→74.2s). **À faire regarder à Aziz au début de la prochaine session.**

### ⛔ Ce qui RESTE à faire sur l'Acte 3
1. **Beat 3** : le panneau est correct mais incomplet — la V5 y met aussi le robinet
   (Algérie→vanne←Nigeria) et la banque barrée DANS le même bloc. Actuellement moitié droite vide.
2. **Beat 4 (paradoxe)** : jamais repris depuis la V5. Doit être la divergence visuelle pure du même
   tracé — Maroc doré stable vs Algérie qui vire au rouge avec icônes bouclier le long du trajet.
   Le code actuel est encore de la v3.
3. Décider du sort de `GazoducActe3InsertParadoxe.tsx` (rendu obsolète si Beat 4 intégré à la carte).

### ⛔ Ce qui n'existe PAS ENCORE (vérifié : aucun fichier, aucune composition)
- **Acte 4 — Conséquences** (Partie 4 du script) : Nigeria incapable de remplir les 2 tuyaux,
  **70% de la production siphonnée** (le plan l'identifie comme un PIC DE RUPTURE DE FORME
  carte→insert physique, pas un beat mineur), objectifs opposés Maroc/Algérie, calendrier européen
  qui se retourne (demande en baisse d'ici 2030).
  > ⭐⭐ **BRIQUE DÉJÀ PRÊTE POUR CE PIC — `ProtoInsertMatiereConduite`** (validée Aziz 2026-08-15).
  > La « rupture de forme carte→insert physique » demandée par le plan EXISTE déjà en prototype
  > rendu : insert « coupe de conduite » (clip H3 en boucle) ancré sur le tracé TSGP réel, avec
  > impulsions cyan qui circulent le long du tracé + bande claire qui donne le sens du transit.
  > **Ne pas re-concevoir cette forme depuis zéro** — partir du proto et l'extraire en composant.
  > Fiche complète (4 briques, règle de partage H3/SVG, seuils voile 0.40 & zoom ~2.0) :
  > `src/projects/_shared/INTENTION-FORME-INDEX.md` § INSERT MATIÈRE.
  > Pertinence directe pour les 70% : une conduite à moitié vide se MONTRE dans la coupe.
- **Acte 5 — Implication** (Partie 5 du script) : la facture européenne, **le robinet géant avec
  mains stylisées** (idée Kimi, `PLAN-ACTES2-5.md` ligne 118 — c'est là que vit la « scène du
  robinet », à ne pas confondre avec le petit robinet du Beat 3), chute « d'autres ont déjà
  commencé à CREUSER ».
- ⚠️ **Audio Parties 4/5 non vérifié** : seuls `narration-p2.mp3` (139s) et `narration-p3.mp3` (123s)
  existent par partie. `narration.mp3` fait 516s et couvre probablement tout — À VÉRIFIER avant de
  supposer qu'il faut regénérer.

### 🔑 Leçons de méthode de cette session (coûteuses, ne pas les reperdre)
- **Un mouvement « par à-coups » n'est presque jamais un problème de dosage.** 3 itérations perdues à
  retoucher des valeurs. Cause réelle : `easeInOut` appliqué PAR SEGMENT a une dérivée nulle à ses
  2 extrémités → vitesse exactement 0 à chaque point de passage. **Mesurer la vitesse caméra frame à
  frame AVANT de retoucher quoi que ce soit.**
- **Chercher la brique existante AVANT de coder** : le mécanisme de caméra continue existait déjà
  (Acte 2 validé + prototype dédié), et le fichier importait même déjà la moitié des helpers.
- **Vérifier visuellement un livrable hérité avant de bâtir dessus** : les Beats 2/3/4 étaient la v3
  explicitement rejetée, avec une note « ne PAS repartir du code v3 actuel » dans le doc de fusion.
- **Le hash anti-gel ne suffit pas** : mesurer le % de pixels modifiés entre frames espacées, et la
  plus longue série consécutive sous seuil.

---

## (ARCHIVE) Segment B (aéroport Niamey) : nouveau décor SVG — FAIT le 2026-08-14

**Décision Aziz explicite : ce nouveau décor doit remplacer le décor actuel dans la vidéo de l'Acte 3.**
Jugé par Aziz visuellement supérieur au rendu existant (tour+radar, lune, halos lumineux, véhicule
de piste et avion au sol notamment "quasiment identiques à l'image Gemini de référence").

- **Composant source** : `src/projects/_rnd/svg-scenes/GazoducAeroportFable5Test.tsx` (composition
  Root `RND-GazoducAeroportFable5Test`, 1920×1080). SVG pur, zéro raster base64, groupes déjà nommés
  et adressables (`ciel/etoiles/lune/nuages/sol/routes/piste/balisage/projecteurs/terminal/
  tour_controle/vehicule_piste/avion/manche_air`) — prêt à recevoir l'animation (radar rotatif,
  flicker des feux, manche à air, roulage avion, extinction climax) selon la même logique déjà
  câblée dans le fichier de PRODUCTION actuel `GazoducActe3InsertSecurite.tsx` (585 lignes, timing/
  beats/extinction déjà tous résolus — cf `deathFlicker`, `tourStaccado`, `RadarTour`, `VehiculePiste`,
  `AvionRoulage`).
- **Ce qu'il reste à faire (pas encore fait)** : porter les fonctions d'animation existantes de
  `GazoducActe3InsertSecurite.tsx` sur les NOUVEAUX groupes SVG de `GazoducAeroportFable5Test.tsx` —
  soit en remplaçant le décor statique dans le fichier de prod par les nouveaux groupes (en gardant
  toute la logique de timing/`BEATS_B`/extinction/climax intacte), soit en portant les callbacks
  d'animation dans le nouveau fichier. Ne PAS repartir de zéro sur le timing — tout est déjà résolu
  et validé (4 DA-briefs + verdict Aziz sur le v3 actuel), seul le DÉCOR change.
- ⛔ **Contrainte éditoriale à préserver strictement en portant l'animation** : toujours AUCUNE
  figuration humaine (déjà respecté dans le nouveau SVG, vérifié par l'agent) — le lieu bascule seul,
  pas d'acteur montré. Cf décision antérieure documentée plus bas dans ce fichier et dans
  `PLAN-ACTES2-5.md`.
- **Images de comparaison** (référence Gemini + rendu SVG Fable5 + rendu actuel) :
  `memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/gazoduc-aeroport-ref/`
  (`scene-frame150.png` = actuel, `gemini-reference-v1.png` = cible Gemini, `gazoduc-aeroport-svg-fable5-test.png` = résultat Fable5 validé).
- **Méthode reproductible** (si un autre segment Gazoduc a besoin du même traitement) : voir
  `memory/NEXT-ACTION.md` § piste "SVG codé direct (Fable5, sans jury)" pour le protocole complet
  (image Gemini de référence → agent Fable5 mode MAX qui reproduit en SVG codé).

---

## État — ACTE 3 (TSGP) : Segment A REJETÉ en v3, Segment B/C historique v1→v2 (dernier commit propre)

⛔⛔ **Segment A (carte) — le fichier `GazoducActe3CarteTSGP.tsx` est MODIFIÉ SUR DISQUE (non commité)
dans un état v3 REJETÉ par Aziz le 2026-08-14** — NE PAS repartir de ce code tel quel. Défauts du rejet :
widgets HUD en coin d'écran (viole une règle DA-brief déjà actée le 2026-08-04/07 : "financement/
banques = dispositif SUR la carte, jamais un widget coin d'écran"), texte flottant sans support visuel,
insert chantier appauvri, ~15-22s de vide en tout début de segment. Storyboard V4/V5 (2e passage GPT
Image 2, mode "libre créative") validé comme nouvelle base — prochaine étape : breakdown JSON par GPT
Image 2 lui-même sur les 4 images V5, PUIS recoder. Détail complet : `BREAKDOWN-SEGMENT-A-STORYBOARD-FUSION.md`.
Dernier commit propre du fichier (avant le v3 non commité) : `07785c28` (v2).

3 segments (A carte D3 tracé Nigeria→Niger→Algérie, B insert sécurité aéroport Niamey, C insert
paradoxe Maroc/Algérie) + montage codés et rendus deux fois : v1 jugé "catastrophique" par Aziz
(diaporama, à refaire), puis refonte complète après 3 DA-briefs critiques ciblés (Gemini+Kimi+
DeepSeek) — v2 rendu et uploadé (commit `07785c28`, c'est la dernière version propre committée pour
les 3 segments). Détail complet (synthèse DA-brief, décisions tranchées, correctifs appliqués) :
`PLAN-ACTES2-5.md`. Analyse comparative Soudan/AES faite en fin de session : registre visuel
(jetons/décors) reste sous le niveau déjà prouvé ailleurs dans le projet — probable 3e passage à
venir, pas encore fait (Segment B depuis remplacé, voir bloc en tête de fichier).

⭐⭐ **PLAN DE REFONTE v3 PRODUIT PAR 4 AGENTS VIERGES (2026-08-07)** — détail complet, diagnostic
transversal, et point de goût non tranché (registre Segment B) : `PLAN-ACTES2-5.md` § "TEST STUDIO
RÉUTILISABLE — 4 AGENTS VIERGES SUR L'ACTE 3 v2". Résumé : le rythme caméra n'est PAS le problème
(déjà bon) ; le vrai défaut = jetons/icônes des 3 segments dessinés à la main au lieu de générés par
un modèle SVG (Règle N°0 violée, incohérence avec le Segment B qui, lui, a reçu ce traitement). Point
en attente de décision Aziz : Segment B doit-il rester "vie qui s'éteint sans acteur" (choix éditorial
DA-brief antérieur) ou une variante du registre état-major Soudan (multi-cibles même site, sans
acteur armé) mérite-t-elle d'être réexaminée ?

---

## État — ACTE 2 TERMINÉ ET VALIDÉ (finale produite le 2026-08-04)

**Livrable** : `out/episodes/gazoduc-aagp-tsgp/acte2-FINAL.mp4` (127.4s, validé explicitement par
Aziz). Structure = **4 segments montés bout à bout** (pas un fichier monolithique) :
1. **Insert SVG signature Freetown** (22s) — `GazoducActe2Signature.tsx`
   (`GazoducActe2SignatureFreetown` + `GazoducActe2SignatureFlashback`).
2. **Carte D3 tracé AAGP** (20.8s) — `GazoducActe2AAGP.tsx` refondu en v4, segment court comme
   tranché par Aziz (25-30s visé, PAS 2min18 comme la version précédente).
3. **Insert SVG flashback genèse 2016** (33.4s) — dans le même fichier `GazoducActe2Signature.tsx`.
4. **Insert SVG financement manquant** (51.3s) — `GazoducActe2Financement.tsx`.

Montage assemblé dans `GazoducActe2Montage.tsx`, tous les segments importés/composés dans
`src/Root.tsx` (compositions `D3-Gazoduc-Acte2-Signature-Freetown`, `-Signature-Flashback`,
`-AAGP`, `-Financement`, `-Montage`). Audio `narration-p2.mp3` synchronisé par segment.

**Pipeline SVG "liberté créative" étendu à 4 modèles externes** (Gemini 3.1 Pro / GPT-5.6 Sol /
GLM-5.2 / Kimi K3) en plus de Fable 5 — 20 candidats comparés au total. Mix retenus :
- **Signature** : base GPT-5.6 Sol (arche + colonnes) + bannières de Fable (12 drapeaux ECOWAS
  réels, remplace les 15 bannières anonymes du candidat Fable seul décrit précédemment).
- **Financement** : document/plume/goutte de Gemini + tuyau/gouffre de GPT-5.6 Sol.

Technique de dessin progressif (`strokeDasharray`/`strokeDashoffset`) généralisée à tous les
éléments structurants des inserts SVG. 3 bugs de synchro audio corrigés (marge +300ms, chéquier
resynchronisé). Contresens narratif corrigé : signature manuscrite retirée du segment financement
(incohérente avec le texte — l'accord manque, on ne montre pas une signature).

**Géoplaque Mauritanie retirée** de la carte (le pays sans accord n'a pas de géoplaque d'arrivée,
cohérent avec le narratif "financement manquant").

Les 20 SVG candidats "liberté créative" (12 sauvegardés initialement + 8 des modèles externes
ajoutés) sont dans `memory/episodes/souverain/gazoduc-aagp-tsgp/svg-inserts-acte2-candidats/`
(copie persistante). Script réutilisable : `scripts/tools/gazoduc-svg-inserts-gen-libre.py`.

## Acte 3 (TSGP) — voir État en tête de fichier

Section déplacée en tête (2026-08-07) — ne plus se fier à la mention "aucun visuel encore produit"
ci-dessous, périmée depuis le codage v1→v2.

---

## État — ACTE 1 (GLOBE, 84.68s) VALIDÉ COMME BASE DE PRODUCTION ✅

Après le prototypage (8 rounds, review upstream 3 voix) puis PLUSIEURS passes de production complètes
sur `GazoducActe1Hook.tsx` (10 beats, caméra continue refondue sur le modèle `camAt()`/`CamKey`, tracé
AAGP côtier réel via jalons géographiques Nigeria→Maroc, correction factuelle Maroc/Espagne, drapeaux
retardés jusqu'à l'arrivée, overlay échelle km, review downstream 3 voix appliquée), Aziz a validé le
render **v6** comme base de production le 2026-08-03 :
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/acte1-v6-m5QFFUpozes11al9Vs2NxEXfaZkPdU.mp4

**3 points de polish restants, VOLONTAIREMENT reportés à la passe finale** (tous actes assemblés,
pas acte par acte) — détail complet + citations Aziz : `POLISH-TODO-FINAL-RENDER.md`.

Fichier de production : `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe1Hook.tsx` (composition
Root `D3-Gazoduc-Acte1-Hook`). Le prototype `ProtoGazoducGlobeFusion.tsx` (16s) reste la trace du
mécanisme d'origine mais n'est plus le fichier de référence.

**Prochaine étape** : passer à l'Acte 2 (scène-lieu narrative, genèse 2016) — cf `NEXT-ACTION.md`.

---

## Historique (rounds de prototypage, archivé pour trace)

**⛔ POINT NON TRANCHÉ, À DÉCIDER EN PRIORITÉ À LA REPRISE (décision Aziz explicite : ne pas trancher
en fin de session, regard neuf requis)** : les 3 modèles convergent (3/3) pour dire que le
remplissage PLEIN par drapeau réel (Espagne/Algérie, ajouté en Round 8 à la demande d'Aziz) lit
comme amateur ("carte de Risk", "défilé d'emblèmes surdimensionnés"). Solutions proposées
différentes (suppression complète / pastille+halo / flash bref puis désaturation) — voir
`da-brief-acte1-v8-review/SYNTHESE.md` pour le détail. NE PAS appliquer un fix par réflexe sans
qu'Aziz tranche — c'est un changement direct par rapport à sa propre demande.

**Reste de la review upstream (séquençage 85s, dynamisme caméra, hiérarchie du regard) à
appliquer à l'extension du prototype de 16s → 84.68s complètes** — chantier distinct de la question
des drapeaux, détaillé dans `da-brief-acte1-v8-review/SYNTHESE.md`.

**Ce qui fonctionne et est validé visuellement (Aziz)** :
- Zoom caméra ample (scaleMul 1.3→4.1+), jamais figé, sphère+contenu toujours solidaires
  (discipline `globeR` unique — ne jamais réintroduire `GLOBE_R` brut, cf
  [[feedback_globe-d3-scaleMul-doit-piloter-tous-les-cercles-dessines]]).
- **2 tracés distincts** : AAGP (Nigeria→Espagne, arc en S via `windingPathD`, doré) et TSGP
  (Nigeria→Algérie, ligne directe via `arcPathD`, orange pointillé) — démarrent ensemble, TSGP finit
  ~2s avant (trajet plus court, écho au texte "l'un mise sur la vitesse").
- Geste "contour se trace PUIS se remplit" (`PaysTrace`, repris de `GlobeRecitProto.tsx`) sur
  Nigeria, Espagne, Algérie — fill toujours progressif, jamais figé à 1 (bug corrigé, cf
  round 4-5).
- Fond neutre kaki (`t.land`) peint dès la frame 0 sous tout pays pas encore actif à opacité 0.88
  (PAS 0.16-0.42, trop faible pour contraster avec l'océan sombre — bug de contraste diagnostiqué
  à tort comme "mauvais thème" avant d'être correctement isolé comme un problème d'opacité,
  cf retour croisé Kimi+Gemini round 6).
- Vague continentale organique (décalage par distance réelle au Nigeria via `geoDistance`, jamais
  tous les pays au même rythme) — caméra tenue en hold pendant ce geste.
- Champ d'étoiles (140 points, PRNG seed=42 déterministe, repris tel quel de `GlobeRecitProto.tsx`).

**Piste carte plate alternative** (`ProtoGazoducAfriqueComplete.tsx`, compo `RND-ProtoGazoducAfriqueComplete`)
également fonctionnelle et testée en parallèle — palette CFA (bleu-marine/crème, copiée de
`CfaActe2Carte16x9.tsx`), continent africain entier visible, mêmes 2 tracés. Décision Aziz
2026-08-03 : **garder le globe pour l'ouverture** (l'Acte 1 dure ~85s sur tout le texte, un globe
qui ne s'arrête jamais de bouger porte mieux cette durée qu'une carte plate statique) — la carte
plate reste une option pour un acte plus tardif nécessitant plus de précision géographique
(13 pays du tracé détaillé).

**Prochaine étape (reprise)** *(FAIT — voir État en tête de fichier, la transposition a été faite le
2026-08-03, GazoducActe1Hook.tsx est maintenant le fichier de production validé v6)* : transposer/
fusionner `ProtoGazoducGlobeFusion.tsx` en vrai fichier de production pour l'Acte 1, en respectant
le découpage en 12 états du breakdown DA (`da-brief-acte1/BREAKDOWN-ACTE1.md`) et le timing exact
aligné sur `narration.mp3`. Ne PAS repartir du fichier `GazoducActe1Hook.tsx` existant (buggé,
plusieurs itérations ratées avant diagnostic) — repartir du prototype validé.

## État — AUDIO COMPLET ✅
5 parties audio individuellement validées par Aziz (voix Harmonie→GéoAfrique, méthode texte
paragraphes fusionnés + CAPS + tags ciblés, corrections via `scripts/tools/splice-segment.py`),
**concaténées et uploadées** : `out/episodes/gazoduc-aagp-tsgp/narration.mp3` (8min37, mono 44100Hz
uniforme, garde-fou forced-align 1053/1053 mots sur le fichier complet).
Upload : `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/gazoduc-aagp-tsgp/narration-SC6MI24buZKc8Z2HirtddmBDy9WLyu.mp3`
`SCRIPT-V3-VOIX.md` mis à jour avec le texte définitif (tags/CAPS/corrections).
**Prochaine étape = storyboard/timing puis code de la 1ère scène** (plus rien à faire côté audio).

## Fichiers finaux validés (à concaténer)
1. **P1** — `out/_voix-test/p1-harmonie-final-full.mp3` (validé Round 4, aucune correction ultérieure)
2. **P2** — `out/_voix-test/splice-p2/p2-final-v2.mp3` (splice "de longer"→"de suivre" + 2 pauses,
   marges corrigées — Round 11)
3. **P3** — `out/_voix-test/p3-harmonie-final-full.mp3` (validé Round 3, aucune correction ultérieure)
4. **P4** — `out/_voix-test/p4-v3-pause-native-full.mp3` (régénération complète avec `[pause]` native
   + corrections indispensable/demande/rétrécit déjà dans le texte — Round 13, **version finale
   confirmée par Aziz**)
5. **P5** — `out/_voix-test/p5-harmonie-final-full.mp3` (validé Round 5, aucune correction)

## Prochaine étape (session suivante)
Storyboard/timing (forced-align complet déjà fait sur `narration.mp3`, `.alignment.json` disponible)
PUIS code de la 1ère scène (voir NEXT-ACTION.md § Gazoduc). Note : léger doublon lexical dans P4
("la demande de gaz de leur client" / "la demande européenne" 2 phrases après) laissé tel quel car
c'est le texte qui a produit l'audio validé — signalé pour info, pas bloquant.

## Découvertes méthodologiques de cette session (détail complet : `memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md`)
- Voix source Harmonie remplace Océane (défaut du pipeline).
- Paragraphes fusionnés + CAPS ciblées > tags seuls pour l'expressivité.
- Tags de réaction humaine (souffle, choc) fonctionnent bien ; `[laughs]`/`[clears throat]` à éviter.
- Nouvel outil `scripts/tools/splice-segment.py` : remplace un segment fautif sans re-tirer tout le
  bloc, fonctionne n'importe où dans la timeline (y compris tout début de clip).
- ⛔ Bug trouvé et corrigé : les coupes ffmpeg (splice ET pauses `pauses-sur-original.py`) doivent
  avoir une marge de sécurité (~40ms) autour des timestamps forced-align — coller à 0ms tranche
  l'attaque des mots voisins.
- Pause **NATIVE dans le texte** (`[pause]` envoyé au TTS) donne une transition bien plus naturelle
  qu'un silence splicé après-coup (`sil_s` mécanique, collage sec) — Aziz préfère nettement cette
  méthode. Pour les futures pauses : privilégier `[pause]` dans le texte dès la génération plutôt que
  `pauses-sur-original.py`, sauf réparation chirurgicale sur un audio déjà validé par ailleurs.

---

## (ARCHIVE) ACTE 3 — ARBITRAGE SVG DU 2026-08-18 (nuit) — ⚠️ écrit AVANT le render final
> ✅ Réconcilié le 18/08 : le livrable existe et est commité —
> `out/episodes/gazoduc-aagp-tsgp/acte3-segmentC-verrou-FINAL.mp4` (4,3 Mo, vérifié sur disque).
> Ce § décrit l'état de la nuit, avant rendu. La source de vérité est le § en tête.

Deux variantes d'insert SVG codées et rendues pour l'Acte 3, puis arbitrées par Aziz :

| Variante | Fichier | Verdict |
|---|---|---|
| Deux ponts (suspendu / rompu) | `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe3Ponts.tsx` | ⛔⛔ **REJETÉ** — « la métaphore est importée au lieu d'être prise dans le monde du sujet ». Verdict écrit dans l'en-tête du fichier. **Ne pas la reprendre, ne pas la monter.** |
| Double verrou croisé | `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe3Verrou.tsx` | ✅ **RETENUE** |

- Briefs associés : `BRIEF-SVG-PONTS.md` · `BRIEF-SVG-VERROU.md`
- SVG sources : `src/projects/_rnd/svg-scenes/GazoducDeuxPonts.svg` · `GazoducVerrouCroise.svg`
- `src/Root.tsx` : 2 compositions ajoutées (`D3-Gazoduc-Acte3-Ponts`, `D3-Gazoduc-Acte3-Verrou`)
- Leçon capitalisée : [[feedback_metaphore-dans-le-monde-du-sujet]]
- ⭐ La variante retenue a été **indexée** comme 2e usage du « mécanisme en coupe » dans
  `src/projects/_shared/INTENTION-FORME-INDEX.md` → le seuil d'extraction en composant partagé est atteint
  (sous-composant `FluideClip` déjà propre ; le parent lit `BEATS_C` en dur, à paramétrer avant extraction).

⚠️ **AUCUN RENDER LOCAL RETROUVÉ** sous `out/` alors que les commentaires du code mentionnent des
corrections faites « au rendu » et « au still frame 90 ». Cf. [[feedback_upload-nest-pas-une-archive-garder-le-render-local]]
— si le rendu a été uploadé sans être gardé, il faudra re-rendre pour juger.
