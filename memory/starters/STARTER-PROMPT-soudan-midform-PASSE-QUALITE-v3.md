# STARTER — Soudan mid-form : PASSE QUALITÉ v3 (retours Aziz sur assemblage v2)

> Assemblage v2 (6 actes re-rendus passe finale + mix audio) PRODUIT et VISIONNÉ par Aziz le 2026-07-21.
> Aziz a donné ~25 retours détaillés. Plan d'action validé. CE STARTER = la feuille de route de la passe v3.
> ⛔ NE PAS re-produire l'assemblage v2 : il existe, c'est la BASE. On applique les corrections dessus.

## ÉTAT GIT / FICHIERS
- Branche **`feat/soudan-passe-finale-6lots`** (repo principal `/Users/clawdbot/Workspace/remotion`, worktree Soudan fermé).
- Session CFA mise en STASH (`stash@{0}` "WIP CFA Acte3 Parite") + backup `scratchpad/cfa-backup-avant-bascule-soudan/`. À restaurer en fin de chantier Soudan (checkout branche CFA + stash pop).
- Assemblage v2 : `out/episodes/soudan-midform/wip/passe-finale/soudan-midform-v2-MIX.mp4` (625.8s, sans le hook).
  Compressé : `...-v2-MIX-compressed.mp4`. Actes individuels re-rendus : `passe-finale/a1..a6.mp4` (+ fragments a3-section1/a3-insert, a4-b1b4/a4-kosti/a4-b6).
- Scripts audio durables : `scripts/tools/soudan-audio/` (build-music-loop.sh, mix-soudan.sh, concat-6actes.sh).
- Boucle musique : `scratchpad/soudan-assemblage/music-B-loop-626.mp3` (à refaire à ~648s après ajout hook).

## ⛔ ERREUR RATTRAPÉE — HOOK MANQUANT
Le hook "suivre l'or" (`out/PRET-PUBLICATION/soudan-midform/hook-or-darfour-VALIDE.mp4`, **23.4s**, validé 2026-07-07,
compo `OrDarfourHook` dans `src/projects/warmap/soudan-hook/OrDarfourHook.tsx`) = la VRAIE 1re scène, OUBLIÉ dans
l'assemblage v2. À REMETTRE EN TÊTE → vidéo finale ~10min48. (Le starter assemblage précédent listait à partir de l'Acte 1.)

## ✅ INVENTAIRE BRIQUES GLOBE (tout existe déjà — généraliser, ne rien réinventer)
Socle : `src/projects/_rnd/d3-16x9/` — `globeGeo.ts` (orthoAt/isVisible), `globeCamera.ts` (camAt keyframes + buildInsertCam/buildActe5Cam/buildActe6Cam), `geoArc.ts` (arcs, pointAlongArc particules, table GEO).
- **Dérive globe** : `driftLon` dans `SoudanActe4B6Globe.tsx:124` (LOT2, SEULE occurrence — à généraliser).
- **Zoom pays** : (a) push-pivot Dubai `SoudanActe3GlobeInsert.tsx:102` (scale×1.7 + lerp 45% vers cible) ; (b) zoom Haftar `buildActe5Cam` keyframes scaleMul 2.0→3.8 sur [22,27]. Pas de helper générique `zoomToCountry` → à factoriser.
- **Souffle frontière** : `BorderPulse` exporté `SoudanActe3GlobeProto16x9.tsx:287` (halo flou + trait, 1→10px, joué 1×). Branché A3/A4B6/A5. PAS en A6.
- **Drapeau clippé pays** : `GlobeFlagFill` exporté `SoudanActe3GlobeProto16x9.tsx:27` (clipPath silhouette + image drapeau + glow). Standard, partout.
- **Flux vivants** : dashoffset `(frame*2)%40` (A4B1B4:333, A4B6:276, A5 corridor:390) + particules cheminantes `pointAlongArc` (A5:137-142, modèle propre). Existe, à généraliser.
- **Drone** : globe = `DroneSprite` PNG (`SoudanActe3GlobeInsert.tsx:86`, drone-rsf-td.png) ; Kosti = `DroneBodyK3` SVG inline (`KostiInsertSVG.tsx:206`, non exporté → à exporter). Aziz veut remplacer le PNG globe par le SVG Kosti.

## PLAN D'ACTION (lots) — ORDRE : VOIX pilote le timing, donc en premier
Grammaire mouvement globe (anti-agitation) : micro-dérive de fond + zoom narratif ciblé + recul de synthèse.

- **LOT F — VOIX (pilote)** : ⛔⛔⛔ **MÉTHODE FINALE VALIDÉE (Aziz 2026-07-22, LE DÉBLOCAGE) — "PAUSES DÉTERMINISTES
  SUR AUDIO VALIDÉ"** :
  1. NE JAMAIS compter sur ElevenLabs pour placer les pauses (tags/ponctuation = le modèle INTERPRÈTE, hasard,
     2 itérations v2/v3 échouées).
  2. NE PAS RÉGÉNÉRER les segments : régénérer = re-tirage de prononciation → le TTS RATE des mots qui étaient
     CORRECTS dans l'audio validé (constaté : la version segments-régénérés avait des mots mal prononcés absents de l'original).
  3. ⭐ MÉTHODE : reprendre l'**AUDIO ORIGINAL VALIDÉ** (prononciation OK, déjà approuvé Aziz) → le DÉCOUPER aux fins de
     phrases via **forced-alignment Whisper** → RÉINSÉRER nos SILENCES EXACTS ffmpeg (anullsrc) exactement où Aziz veut respirer.
     = prononciation validée + rythme contrôlé au centième de seconde. Ajuster une pause = changer UN nombre, réassembler en 5s.
  Outils : `scripts/tools/soudan-audio/assemble-segments.py` (concat segments+silences depuis manifest JSON) +
  manifest par acte (ex `acte6-segments.json`, champ sil_after_s par segment, marqueur _aziz sur les pauses demandées).
  Pour l'audio-validé-découpé : découper l'original aux mots-frontières (whisper) puis manifest pointant les tranches.
  ⭐ VALIDÉ Aziz sur segments-régénérés (contrôle des pauses parfait) MAIS bascule sur AUDIO ORIGINAL DÉCOUPÉ pour éviter
  les erreurs de prononciation. Généraliser aux 6 actes : chaque acte a déjà un audio validé → découper + appliquer silences.
  Ne régénérer QUE si contenu à changer (ex phrase coupée fin A6) ou prononciation mauvaise à la base.
  Pauses Aziz Acte 6 : avant "le premier réflexe" 1.6s · avant "l'échelon au-dessus" 1.6s · après "personne n'est neutre" 1.3s ·
  avant "Dans ces conditions" 1.5s (nette) · après "...coup d'État de 2021" 0.9s · chute finale 2s.
  ⛔⛔ GARDE-FOU OBLIGATOIRE (exigé Aziz 2026-07-22, NON-NÉGOCIABLE) : APRÈS chaque assemblage de pauses, RE-TRANSCRIRE
  l'audio via `scripts/tools/whisper-align.py` et VÉRIFIER que TOUS les mots du script sont présents (aucun coupé/sauté).
  Cause du besoin : le forced-alignment whisper original était décalé jusqu'à ~1.4s à certains endroits → une coupure
  calée dessus mangeait un mot ("commencé" tronqué). FIX : caler cut_s sur les timings MOT-À-MOT du whisper (fin exacte
  du dernier mot), PAS sur les gros gaps -35dB (qui peuvent tomber après la mauvaise phrase). Puis re-whisper de contrôle.
  Outil : `scripts/tools/soudan-audio/pauses-sur-original.py` + manifest `acte6-pauses-sur-original.json` (cut_s/resume_s/sil_s).
  ✅ AUDIO A6 VALIDÉ Aziz 2026-07-22 (lien https://files.catbox.moe/mufehk.mp3, 137.6s).
  ⛔ DISCIPLINE ANTI-MANIAQUE (sagesse Aziz 2026-07-22) : l'écoute RÉPÉTÉE fait "entendre" des micro-défauts sous le seuil
  de perception d'un spectateur (qui écoute 1× porté par récit+visuel). NE PAS boucler sur l'audio à nu. Règle : UNE passe de
  pauses aux fins d'idées évidentes par acte + garde-fou whisper, PUIS juger le TOUT en CONTEXTE (vidéo assemblée finale avec
  musique+SFX+visuel qui masquent/portent). Ajuster une pause = 5s (changer un chiffre) même après coup → pas besoin de tout
  verrouiller au micron maintenant. Le pipeline audio est l'ACQUIS ; le perfectionnisme au-delà = coût sans gain perçu.
- **LOT B — GLOBE VIVANT** (Actes 3/4/6 ; A5 zoom Haftar = réf) : B1 dérive fond partout · B2 zoom-pays à chaque nomination (factoriser helper) · B3 frontières s'allument (Dubai pôle doré exagéré, Turquie/Ankara) · B4 flux vivants après tracé · B5 géoplaques éphémères (~2s puis disparaissent : Le Caire/Port-Soudan/Moscou) · B6 île Suakin point→géopôle concentrique · B7 drone globe→DroneBodyK3 · B8 Nil plus brillant/long.
  ⭐ PROTO B6 VALIDÉ Aziz (2026-07-22) : géoplaques éphémères (~2s puis fade) + frontières persistantes lumineuses
  (contour coloré qui respire, pays "allumé vu de l'espace") = LE BON DOSAGE. Généraliser aux actes 3/4/6.
  ⭐⭐ GRAMMAIRE MOUVEMENT VALIDÉE Aziz : "on NAVIGUE dans le globe" — PAS besoin de toujours voir le globe entier ;
  ZOOMER/SERRER sur la région dont on parle + RECULER pour une synthèse, depuis la vue de l'espace. Un globe entier
  qui tourne en boucle = à éviter. Le mouvement doit être NARRATIF (accompagne le pays nommé), pas décoratif.
  Aziz ADORE le zoom vers pays (Haftar A5) + mouvement globe (enquêtes A6) + mini-zoom Soudan = à mettre PARTOUT.
- **LOT A — STRUCTURE** : A1 remettre hook en tête · A2 **SUPPRIMER le schéma "puits sans fond"** 2:31→2:48 (SVG éprouvette
  billets, début Acte3 `Beat1Paradoxe`/`SoudanActe3Section1Globe.tsx` partie A 0→523). Aziz : après "il faut sortir du Soudan",
  comme on REFAIT l'audio, la narration réécrite enchaîne direct → carte D3 → globe. Pas de fait orphelin, s'aligne. ·
  A3 raccord Acte2→Acte3 (seulement si transition dure subsiste). NB agent : l'insert Khartoum (assaut 15 avril 2023,
  `KhartoumEtatMajorSVG`) = GARDÉ (lieu incarné validé, PAS le problème).
- **LOT C — ACTE 4 début** : C1 ne pas démarrer parchemin vide → 2 généraux + territoires surbrillance + soldats/chars dès
  le départ (comme A1), gardés tout l'acte · C2 **bug jetons Kosti** : `CivilToken` `KostiInsertSVG.tsx:184` `fleeMax = dead?26:58+idx*6`
  → à la mort fleeMax chute 58→26 = rétraction vers la file (ce qu'Aziz voit comme "reviennent"). FIX : geler fleeMax à la valeur
  atteinte vivant · C3 faire disparaître le soldat scène suivante chargée, garder généraux+territoires.
- **LOT D — POLISH** : D1 retirer flash mines d'or A1 · D2 fin A6 retirer typewriter, juste +2-3s musique + fade black ·
  D3 vérifier raccords, priorité **8:09-8:10** (cut rough repéré Aziz).
- **LOT E — SFX (refonte quasi complète)** : E1 SUPPRIMER corne Russie 4:44 (horrible), ding flèche 3:08, drone Kosti 6:05
  (tous les SFX Gemini ratés) · E2 remplacer par dings/pings discrets : apparition pays (A3/A4/UA A6), sièges ONU s'allument
  (rapides), sièges rouge+X (négatifs), jetons civils Kosti · E3 count-up 40M = SFX count-up (PAS effet chèque).

## ORDRE EXÉCUTION
1. Voix A6 (test) + Globe proto A4B6 EN PARALLÈLE → 2 validations Aziz.
2. Après validations : généralisation voix 6 actes + globe A3/4/6 (agents) + lots A/C/D/E en parallèle.
3. Re-render 6 actes + re-concat (avec hook) + re-mix (musique loop ~648s + SFX refaits) → présenter.
4. Promotion FINAL + restaurer stash CFA.

## RÉFÉRENCES
- Rapports agents investigation : cette session (insert 2:31 = Beat1Paradoxe pas Khartoum ; briques globe).
- Décision audio (musique) inchangée : `episodes/soudan-midform/AUDIO-MIX-DECISION.md`.
- STATUS projet : `episodes/soudan-midform/STATUS.md`.

## ⛔ MODE AUTONOMIE (Aziz 2026-07-22)
Aziz délègue l'EXÉCUTION du plan v3 en autonomie. Prendre les décisions d'agents/techniques seul, en se basant sur
ce qui a été validé jusqu'ici (dosage globe B6, pipeline audio déterministe+garde-fou, doctrines projet). NE l'interrompre
QUE pour un VRAI checkpoint : choix créatif coûteux à défaire (asset payant, refaire un beat, changer un parti-pris narratif),
ou blocage nécessitant son arbitrage. Il vérifie le RÉSULTAT FINAL. Décisions de goût mineures / techniques = trancher seul,
mentionner en 1 ligne. Garde-fous NON-NÉGOCIABLES même en autonomie : garde-fou whisper après chaque pause audio · vérif
CODE+VISUEL (frames scale=1) sur chaque acte re-rendu · pas de git destructif · ne pas régénérer un audio validé · dosage
globe = mouvement NARRATIF pas décoratif · signaler (pas cacher) tout défaut vu.

## ⛔ DÉCISION A2 FIGÉE (Aziz 2026-07-22) — SUPPRESSION TOTALE du "puits sans fond"
Le schéma SVG "puits sans fond" (Beat1Paradoxe, début Acte 3, ~2:31→2:48, éprouvette+billets qui fuient) =
SUPPRIMÉ INTÉGRALEMENT : le VISUEL **ET** la narration qu'il portait (~15s : "Cette guerre engloutit des
centaines de millions de dollars chaque mois... Quelqu'un paie cette guerre. Il faut suivre l'argent pour
comprendre qui et pourquoi."). L'Acte 3 DÉMARRE directement sur "Tout commence au Darfour, où les
paramilitaires contrôlent plusieurs mines d'or" (la scène des mines, déjà là). Conséquences à appliquer (Vague 2) :
1. AUDIO Acte 3 : re-couper le DÉBUT de acte3-suivre-lor (retirer la Partie 1 jusqu'à "...qui et pourquoi",
   garder à partir de "Tout commence au Darfour"). Trouver le timestamp exact via whisper-align. Garde-fou whisper après.
2. VISUEL Acte 3 : dans SoudanActe3Section1Globe.tsx, retirer Beat1Paradoxe (partie A SVG 0→~523f) — le globe/
   carte démarre direct. Recaler le timing (SECTION1_GLOBE_FRAMES) sur le nouvel audio raccourci.
3. La vidéo finale raccourcit d'~15s. Décision Aziz : "supprimé le tout, on enchaîne avec la chaîne suivante" +
   "couper le visuel ET cette portion de voix" (plus direct, on entre dans le concret).

## ✅ AUDIO ACTES 1/3/5 (pauses appliquées, garde-fou OK) + 2/4 (rien à changer, jointures bord-à-bord/déjà larges)
Actes 1/3/5 : `scratchpad/soudan-assemblage/voix-pauses/acte{1,3,5}-*-pauses.mp3`, manifests
`scripts/tools/soudan-audio/acte{1,3,5}-pauses-sur-original.json`. Acte 6 : acte6-pauses (validé Aziz).
Actes 2/4 : NE PAS forcer de pauses (vérifié : jointures qui pourraient respirer sont bord-à-bord par conception
= insert/offsets ; celles avec marge respirent déjà 2.45s). À juger en contexte à l'assemblage.
⚠️ Audio Acte 3 sera DE TOUTE FAÇON re-coupé au début (décision A2 ci-dessus) → refaire ses pauses après la coupe.

## LOT E — PLAN SFX v3 (à poser au mix Vague 3, timecodes après re-render)
SFX discrets DÉJÀ dispo (réutiliser, pas générer) : public/_shared/sfx/ui/{node-appear,blip-bubble,plate-pop,stamp-dossier}.mp3
+ public/_shared/sfx/camera/sfx-map-ping.mp3. Registre "ding/ping discret" = exactement ce qu'Aziz veut.
RETIRER (SFX ratés, retours Aziz) : sfx-soudan-russie.mp3 (CORNE horrible, 4:44 Moscou) · le "ding flèche" ~3:08 ·
le "drone" bruité Kosti ~6:05 (sfx-soudan-drone.mp3 si c'est lui — vérifier). Garder mines/fracture/connexion/veto/bilan
À REVOIR au cas par cas.
AJOUTER dings/pings DISCRETS (1-3 par événement, jamais 14) sur :
- Apparition de PAYS (Acte 3 Émirats/Turquie/Égypte · Acte 4 Russie/Égypte · Acte 6 UA quelques-uns au début) = node-appear ou map-ping.
- Sièges ONU qui s'allument (Acte 6 B3 vote) = plusieurs pings RAPIDES pour accompagner la cascade verte + SFX négatif (slash-red?) quand sièges virent au rouge + X.
- Jetons civils Kosti qui apparaissent (Acte 4 B5) = 2-3 dings discrets (PAS le drone bruité).
- Count-up 40M/13,5M (Acte 6 B5 + Acte 1 bilan) = SFX count-up léger (counter-tick en boucle courte, PAS effet chèque).
- Moscou apparaît (Acte 4) : au lieu de la corne = un "ding" simple (comme apparition pays).
Volume SFX 0.5 (inchangé). Aziz : "c'est discret, c'est beau" — ne PAS abuser.

## ✅ ASSEMBLAGE v3 COMPLET PRODUIT (2026-07-22) — EN ATTENTE VALIDATION AZIZ
Livrable : `out/episodes/soudan-midform/wip/passe-finale-v3/soudan-midform-v3-MIX.mp4` (636.23s = 10min36, full HD).
Compressé : `...-v3-MIX-compressed.mp4` (720p, 40mo). Lien 72h : https://litter.catbox.moe/wkn6hj.mp4 (catbox en panne, Litterbox).
Fragments v3 : `passe-finale-v3/a{1..6}.mp4` (+ a3-section1/insert, a4-b1b4/kosti/b6). Assemblage visuel : `soudan-midform-v3-VISUEL.mp4`.
TOUT appliqué : hook en tête (23.4s) · puits supprimé · globe vivant 3/4/6 (mouvement+frontières allumées+géoplaques éphémères+
Suakin géopôle+drone SVG+Nil brillant) · Acte 4 début habité (2 généraux+territoires+char/soldats) · audio pauses déterministes
6 actes+garde-fou · fin A6 sans typewriter · flash mines retiré · bug Kosti fixé · SFX v3 sobre (corne Russie virée, dings discrets).
Audio sain : Flat factor 0 (pas de clipping réel), max ~0dB (pic du hook, limiteur alimiter appliqué).
Structure : HOOK 0-23s · A1 23-81s · A2 81-174s · A3 174-283s (puits coupé) · A4 283-414s · A5 414-494s · A6 494-636s.
Mix : `scripts/tools/soudan-audio/mix-soudan-v3.sh` + music `scratchpad/soudan-assemblage/music-B-loop-640.mp3`.
RESTE (après validation Aziz) : promotion FINAL (assemblage v3 + actes individuels jamais promus 1/3/4 → PRET-PUBLICATION) +
commit branche feat/soudan-passe-finale-6lots + restaurer stash CFA (git checkout feat/cfa-nuit1994-svg-mix + stash pop).
