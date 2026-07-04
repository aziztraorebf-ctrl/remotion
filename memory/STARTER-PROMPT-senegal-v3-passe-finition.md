# STARTER — Sénégal V3, passe de finition ROUND 2 (3 bugs restants)

> Coller ce prompt en début de session. Mis à jour 2026-07-04, fin de la session "passe de finition
> round 1". Round 1 (contenu original de ce fichier) a corrigé les 10 points de
> `V3-REFONTE/REPRISE-PASSE-FINITION.md` (dédoublements audio, écran gris Mapbox, carte gisements pas
> harmonisée, SFX parasites, point Dakar, texte épuré). Montage réassemblé et **validé par Aziz après
> visionnage complet** (dynamisme jugé bon, ne pas y toucher). Aziz a ensuite relevé 3 nouveaux bugs
> précis à l'écoute de cette version finale — ROUND 2 = uniquement ces 3 points, session courte.

## ⛔ LIRE AVANT TOUT

- Branche : `fix/senegal-v3-passe-finition` (déjà ouverte, PAS de nouvelle branche — c'est une itération
  sur le même chantier, pas un chantier neuf).
- ⚠️ Working tree PARTAGÉ avec d'autres instances (war-map notamment). `git add` CHIRURGICAL sur les
  seuls fichiers Sénégal listés ci-dessous au moment de committer.
- Rien n'a encore été committé sur cette branche (round 1 + round 2 seront committés ensemble, ou round 1
  d'abord si Aziz préfère isoler — À DEMANDER, ne pas décider seul).
- **Montage complet round 1** (celui qu'Aziz a visionné et sur lequel il a relevé ces 3 bugs) :
  `out/episodes/senegal-petrole-gaz/senegal-petrole-gaz-V3-COMPLET.mp4` (495.1s) + version web compressée
  uploadée : https://files.catbox.moe/ejk1nb.mp4 — c'est LA référence, ne pas repartir de l'ancienne
  version pré-round-1.

## 📋 LES 3 BUGS À CORRIGER (dictés par Aziz après écoute, dans l'ordre de son message)

### Bug A — mot "précise" coupé, fin de sc.0 (~30-32s montage)
**Symptôme (Aziz)** : "la vérité est plus froide et..." — le mot "précise" n'a pas le temps de se
terminer avant que sc.1a ne démarre. Rallonger la scène ~1s.

**Diagnostic déjà fait (round 1)** : `SenegalScene0.tsx` a `endAt={Math.round(31.68*30)}` (950 frames),
mais `durationInFrames={970}` dans Root.tsx (20 frames de silence après la coupe audio). Le forced-align
global (`forced-align-v3.json`) disait "précise." se termine à 31.68s — **ce chiffre était peut-être
légèrement trop court**, ou le souci est un fade audio trop abrupt (pas de fade-out) plutôt qu'un vrai
mot manqué. **À FAIRE** : réécouter précisément ce moment, vérifier si le mot "précise" a vraiment besoin
de +1s (auquel cas reculer `endAt` à ~32.5-32.7s) OU si un simple fade-out audio de quelques frames suffit
à adoucir la coupure perçue. Fichier : `src/projects/_proto-16-9/SenegalScene0.tsx`.
⚠️ Si `endAt` recule au-delà de 32.62s, ça re-créerait le dédoublement avec sc.1a (qui commence sa
narration à "Ces deux récits" = 32.62s abs) — donc rester STRICTEMENT sous 32.62s. Marge dispo : ~0.9s.

### Bug B — mot "trois" répété deux fois (~50-53s montage, scène coin-flip → gisements)
**Symptôme (Aziz)** : "le Sénégal n'a pas trouvé un gisement, il en a trouvé trois" — le mot "trois" se
répète deux fois. Aziz suggère aussi de couper 1-1.5s pour réduire l'écran gris (le fond navy uni pendant
la transition, jugé pas terrible visuellement même si accepté en round 1).

**Diagnostic à faire** : ce timing correspond à la toute fin du fondu étendu de `SenegalScene1IntroCoin.tsx`
(chantier 2 round 1, `TOTAL=641`, `endAt=53.9*30` sur l'Audio) qui chevauche le début de
`SceneGisementsV3.tsx` (`AUDIO_START=53.70`, `PRE_ROLL=58f`). **Hypothèse forte** : la marge de 0.2s entre
`endAt=53.9` (sc.1a) et le mot "trois." qui se termine à 53.70s (confirmé par le forced-align propre
`scene1-realign-2026-07-04.json`) pourrait laisser sc.1a répéter la fin du mot "trois" une deuxième fois
si le fondu audio n'est pas net. À VÉRIFIER : extraire l'audio 49-54s du montage final, transcrire
(whisper medium), voir si le doublon est dans sc.1a seule, à la jonction, ou dans gisements. Fichiers
concernés : `SenegalScene1IntroCoin.tsx` (endAt=53.9s) + `SceneGisementsV3.tsx` (AUDIO_START=53.70,
PRE_ROLL=58).
**Pour la demande de couper 1-1.5s d'écran gris** : réduire `PRE_ROLL` dans `SceneGisementsV3.tsx`
(actuellement 58f=1.93s) à ~28-35f (~1-1.2s). Attention : si `PRE_ROLL` change, il faut AUSSI recalculer
`END` et `durationInFrames` dans Root.tsx en conséquence (vu au round 1 : c'est exactement le genre de
décalage oublié qui avait recréé un dédoublement pendant le réassemblage — **toujours vérifier
`AUDIO_START + END/30` reste égal à 122.5s abs après tout changement de PRE_ROLL**).

### Bug C — musique de fond COMPLÈTEMENT ABSENTE pendant sc.1b (gisements) + sc.3 contrat (~50s → 2min08 montage)
**Symptôme (Aziz)** : "problème assez grave" — la musique s'arrête net au début de Sangomar (gisements)
et ne revient qu'à la scène Norvège/Botswana (sc.2 comparaison), soit ~2 actes complets sans musique
(gisements ENTIÈRE + sc.3 contrat ENTIÈRE, à confirmer quelle borne exacte).

**Cause racine DÉJÀ confirmée** (vérifié en fin de session round 1) :
```
grep -n "music-A-ambient" SceneGisementsV3.tsx   -> AUCUN RÉSULTAT (pas de musique du tout)
grep -n "music-A-ambient" SceneContratV3.tsx     -> présent (donc sc.3 a de la musique)
grep -n "music-A-ambient" SceneComparaisonV3.tsx -> présent
```
⚠️ Donc `SceneGisementsV3.tsx` est bien la scène en cause — **mais Aziz dit que le silence dure jusqu'à
sc.3 contrat AUSSI** ("les jisements étant présente la dette via le graphisme du baril" — sa phrase mélange
un peu gisements et contrat, le "baril" étant en fait sc.3/contrat). Si `SceneContratV3.tsx` a bien la
musique dans le code, il faut vérifier POURQUOI elle ne s'entend pas à l'écoute : soit un volume trop
bas, soit un fade-in qui démarre trop tard, soit (plus probable) le silence de gisements est si long
(toute la scène, ~70s) qu'Aziz perçoit le manque de musique comme continu jusqu'à sc.2, sans forcément
que sc.3 soit elle-même muette. **À FAIRE EN PRIORITÉ** : réécouter précisément où la musique revient
(est-ce dès sc.3/contrat, ou seulement à sc.2/comparaison ?) avant de toucher au code — ne pas supposer.

**Fix pour gisements (certain)** : ajouter une piste `music-A-ambient-souverain.mp3` dans
`SceneGisementsV3.tsx`, avec `startFrom` calé en CONTINUITÉ de la piste par rapport aux scènes voisines
(pattern déjà utilisé partout ailleurs, ex. `SceneComparaisonV3.tsx` ligne ~129-137 : fade-in début,
volume ~0.055, fade-out fin, `startFrom` qui reprend la piste là où la scène précédente (`SceneGisementsV3`
elle-même, donc à recalculer depuis 0 puisqu'elle n'en avait pas) l'aurait laissée). Vérifier aussi le
volume et le fade-in/out une fois ajouté — ne pas juste copier-coller un `startFrom` au hasard.

## MÉTHODE POUR CETTE SESSION (courte, ciblée)
1. Lire ce fichier + `V3-REFONTE/REPRISE-PASSE-FINITION.md` (contexte round 1 complet, cause racine
   audio expliquée en détail).
2. Pour CHAQUE bug : d'abord extraire l'audio du montage actuel autour du timestamp, transcrire (whisper
   medium, pas small — le modèle small hallucine des répétitions, prouvé round 1), confirmer le
   diagnostic AVANT de coder un fix.
3. Fixer un bug à la fois, re-render la scène concernée SEULE (pas tout le montage), vérifier par
   transcription, PUIS passer au suivant.
4. Une fois les 3 fixés : re-render toutes les scènes touchées, ré-assembler le montage complet
   (méthode ffmpeg concat déjà utilisée round 1, liste des 9 fichiers dans
   `out/episodes/senegal-petrole-gaz/`), re-transcrire TOUTES les jonctions (pas seulement les 3 bugs,
   au cas où un fix en recrée un autre — déjà arrivé une fois round 1 avec le bug END/endAt de gisements).
5. Upload catbox (version web compressée, `scale=1280:-2 crf 26`) pour visionnage Aziz avant de committer.
6. Demander à Aziz s'il veut committer round1+round2 ensemble ou séparément avant tout `git add`/commit.

## OUTILS RÉUTILISABLES (créés round 1)
- `scripts/render-mapbox.sh <CompositionId> <output.mp4> [args]` — SEUL moyen fiable de render les
  scènes Mapbox localement (chrome-headless-shell + public-dir slim + `--gl=angle`). `npx remotion render`
  brut échoue avec `Failed to initialize WebGL` sur cette machine.
- `scripts/senegal-scene1-realign.py` + `scripts/senegal-scene4-5-realign.py` — forced-align ElevenLabs
  propre sur des segments extraits proprement (pas l'ancien `scene1-alignment.json`, corrompu — NE PLUS
  JAMAIS l'utiliser). Réutilisables comme template si un nouveau segment doit être réaligné.
- Résultats déjà obtenus : `public/souverain/senegal-petrole-gaz/audio/scene1-realign-2026-07-04.json`
  (couvre 32.0s→124.5s) et `scene4-5-realign-2026-07-04.json` (couvre 243.0s→350.0s) — timestamps
  fiables, loss <0.35, à réutiliser directement pour les bugs A/B (déjà dans la fenêtre couverte).

## FICHIERS TOUCHÉS ROUND 1 (contexte, tous sur la branche, pas commités)
`src/projects/_proto-16-9/SenegalScene0.tsx` · `SenegalScene1IntroCoin.tsx` ·
`src/projects/_shared/mapbox/CartoSouverainV5.tsx` (ajout `driftScale` + fix `map.resize()`+`idle` —
composant PARTAGÉ, tout changement futur doit re-vérifier sc.2/sc.5 qui en dépendent aussi) ·
`src/projects/souverain/senegal-petrole-gaz/beats/{SceneBonusV3,SceneCoulissesV3,SceneDetteV3,
SceneGisementsV3}.tsx` · `src/Root.tsx` (durations).
