# AUDIO — fiche de déclenchement (lire AVANT tout appel TTS/musique/SFX et avant de caler un timing)
> Chaque appel TTS est PAYANT et chaque régénération remet au hasard des mots déjà corrects.
> ⚠️ Si ce que tu lis ici ne correspond PAS au code que tu as sous les yeux : **c'est la fiche qui a tort**. Corrige-la immédiatement.
> Dernière vérification contre le code : 2026-08-17.

## AVANT TOUT APPEL PAYANT
**1. SCAN FR BLOQUANT** (`memory/tools/elevenlabs.md` § Regles francais). Regex scriptable :
`\bont\s+[aeiouyéèêAEIOUY]` (liaison) · `\b\d+\b` (chiffres → lettres) · `-é/-ée/-és/-ées` en fin de groupe.
Le STS bave systématiquement sur les « é » TONIQUES finaux (alliés, rivalité, céder) → reformuler DÈS l'écriture :
`alliés→partenaires`, `accepté de céder→voulu reculer`, `ont accosté→firent escale`. Accents obligatoires.
**Coût de l'avoir sauté : 6 régénérations en une session (Soudan Acte 2).**
**2. `--dry-run` d'abord** : `python3 scripts/generate-narration-expressive.py --text-file X --out Y --dry-run`
(estime le coût sans appel). TTS V3 = 1 crédit/caractère · STS = 1000 crédits/MINUTE · musique ≈ 0.10 $/track.
**3. Générer PAR PARTIE/ACTE, jamais en bloc** (marqueur `### PARTIE <n> — <titre>`) : un mot qui bave se
régénère seul. Limite dure 5000 char/appel.
**4. Réglages verrouillés** : source **Harmonie** `obmcfXCePmPgsNsLIWIj` (V3, stab 0.30) → STS **GéoAfrique**
`z3gESu49naEZW8Af2Upm` (`eleven_multilingual_sts_v2`, **stability 0.45** — 0.30 bave, 0.5+ avale des syllabes).
Musique : `fal-ai/minimax-music/v2.6`, `{prompt, is_instrumental:true}`, PAS de `reference_audio_url`.
**5. GÉNÉRER un SFX** — ⛔ d'abord `public/_shared/sfx/SFX-INDEX.md` (**160 SFX déjà produits**, catalogue
par catégorie) : ne générer que ce qui manque. API `POST /v1/sound-generation`, prompts en ANGLAIS,
`prompt_influence` **0.4-0.6**, `duration_seconds` 0.5-30. Modèle : `scripts/generate-sfx-elevenlabs.py`.
⭐ **Un SFX sort exploitable du 1er coup, y compris sur de la matière neuve** (givre, glace, métal qui gèle) :
mesuré **15/15 au 1er essai**, < 2 min (2026-08-29). ⛔ Ne PAS budgéter « ~5 essais par son » — cette prudence
a failli faire écarter le son d'un livrable client.
⛔ **Garder les prompts dans un script versionné**, pas seulement les .mp3 : sans la recette, une régénération
repart de zéro et l'argument « on change le son sans retoucher l'image » ne tient plus.

## INTERDITS — erreurs déjà payées
⛔ `{frame === X && <Audio/>}` — SFX inaudible en render, 3 beats livrés muets. → `<Sequence from={F} durationInFrames={20-30}>`.
⛔ Binaire `whisper` local — 50 min CPU, zéro sortie. API OpenAI (`whisper-align.py`) ; quota OpenAI épuisé depuis 2026-07-25 (429) → `scripts/tools/forced-align.py` (ElevenLabs) est le fallback qui marche.
⛔ Régénérer un audio VALIDÉ pour « juste une pause » — re-rate des mots déjà corrects, prouvé 2×.
⛔ Silence `anullsrc` splicé après-coup comme 1er réflexe — collage mécanique, rejeté en A/B. → `[pause]` NATIF dans le texte régénéré + splice.
⛔ Couper sur le `start` d'un mot — « SOUVERAINS » (1.70 s) coupé à son attaque. **2× la même session.** → prendre `end` + couper DANS le silence suivant.
⛔ `cut_s`/`resume_s` collés aux timestamps bruts (marge 0) — mot rogné sur TOUTES les jonctions P2/P4. → marge ≈ 0.04 s.
⛔ Une phrase par ligne — un saut de ligne = pause V3 implicite. 41 paragraphes = voix qui traîne. → 3-5 blocs >250 car.
⛔ SFX bannis : `ui/reveal.mp3` (18.4 s + VOIX fantôme — renommé `.CORROMPU`, remplacer par `ui/plate-pop.mp3` ou `ui/node-appear.mp3`, 0.48 s) et `warmap/tension-drone.mp3`. `ffprobe` la durée avant d'intégrer un SFX.
⛔ Whisper pour JUGER une prononciation — il « corrige » ce qui bave. Il aligne, il ne juge pas. Seule l'oreille d'Aziz valide.
⛔ `-c copy` sur un concat MP3 — casse les timestamps. → `filter_complex` / re-encode libmp3lame.
⛔ `--only-part pN` ne re-concatène PAS le global — re-concaténer à la main, sinon lien périmé présenté.

## PIPELINE
1. **Texte** : paragraphes fusionnés par transition de sujet · tags INTRA-phrase juste avant le mot ciblé (pas en tête) · CAPS 1-2/paragraphe · `[pause]` sur les 1-2 pics SEULEMENT · ⛔ jamais `[laughs]`/`[clears throat]`.
2. **Générer** `scripts/generate-narration-expressive.py` (`--dry-run`, `--sample`, `--only-part`, `--sts-stability`).
3. **ÉCOUTER** (Aziz) — aucun garde-fou automatique ne remplace ça.
4. **Corriger un défaut isolé** → `scripts/tools/splice-segment.py <orig> <replacement> <cut_s> <resume_s> <out>` (marge 40 ms), jamais re-tirer tout le bloc.
5. **Aligner AVANT de figer les gestes** — `scripts/tools/forced-align.py <audio.mp3> <texte.txt> [repères]` → donne les FRAMES. Une durée estimée aux mots se trompe de ~20 % par excès. Normaliser casse + ponctuation + ACCENTS (« devaluer » vs « dévaluer » = introuvable silencieux).
   ✅ **Corrigé 2026-08-17** : le script DÉTECTE désormais l'alignement corrompu (bug v1 intermittent) et sort en erreur au lieu d'afficher un faux `OK ... loss=0.12`. ⛔⛔ **`/v2/forced-alignment` N'EXISTE PAS** (404 vérifié) — le remède écrit en mémoire depuis mai était faux, ne jamais le re-tenter : basculer sur v2 transformerait un résultat dégradé en panne dure. Contournements RÉELS : relancer (bug intermittent) · ré-encoder en libmp3lame · découper la VO.
6. **Timing** : `durationInFrames` dérivé de l'audio mesuré, JAMAIS hardcodé. Pauses ajoutées après coup → `F_new = F + 30*Σ(sil_s − gap_naturel)` (pas la formule brute : désync jusqu'à +5.5 s).
7. **Garde-fou** : re-aligner, vérifier que tous les mots sont présents. Prouve l'absence de perte de TEXTE — jamais la qualité SONORE.
8. **Mix** : SFX plancher **0.50** (jusqu'à 0.60 sur gros moment) · **musique = 0.13 au départ** (harmonisé 2026-08-17 ; monter/descendre à l'oreille) · SFX ponctuels uniquement, jamais de nappe continue. Musique tardive : si `(durée_piste − startFrom) < durée_beat` → 2e `<Audio startFrom={0}>` en relais.

## ⭐⭐ OÙ placer les SFX — sur l'IMAGE, jamais sur un pic sonore

> Ajouté le 2026-08-27 (repro Foster). Verdict d'Aziz sur le montage : « les SFX sont
> parfois un peu décalés, et dans l'originale ils sont **deux fois plus nombreux** —
> c'est littéralement ce qui donne le côté premium ». Mesuré : il avait raison deux fois.

**L'erreur de méthode** : j'ai posé les SFX sur les pics d'un signal AUDIO relevé dans la
vidéo de référence. Deux défauts, tous deux mesurés après coup :
1. l'audio de la référence était une **capture dégradée** (16 kHz mono) → 18 transitoires
   détectés là où l'image en compte **68** ;
2. surtout, **le pic sonore de LEUR montage ne dit pas où l'image bouge dans le NÔTRE** :
   seuls **7 de nos 13 SFX** tombaient à moins de 3 frames d'un événement visuel réel.
⭐ Sur un rendu muet — le cas de toute scène Remotion avant mixage — il n'y a de toute
façon aucun audio à analyser. **Le repère est l'image.**

**L'outil** : `python3 scripts/tools/sfx-cues.py <video.mp4> [--crop W:H:X:Y] [--json out]`
Il classe trois familles d'événements, seuils **relatifs** à la vidéo analysée (un seuil
absolu ne survit pas au changement de registre) :
| type | ce que c'est | son par défaut |
|---|---|---|
| `COUPE` | rupture franche, **rare et isolée** | `ui/plate-pop.mp3` |
| `APPARITION` | un élément entre : l'encre augmente sans que tout change | `ui/node-appear.mp3` |
| `POSE` | un mouvement continu **s'arrête** — le temps fort qu'on oublie | `data/stat-tick.mp3` |
Sortie : un bloc `{ at, src, vol }` prêt à coller.

⭐ **Validé objectivement** : sur la référence Foster, ses 7 `COUPE` retrouvent **exactement**
les 7 bornes de plans mesurées à la main pendant la session (1,600 · 5,600 · 13,600 ·
25,067 · 27,067 · 28,067 · 40,467 s).

⛔ **Une COUPE est rare et isolée** : le seuil d'intensité ne suffit pas, il faut le CONTEXTE.
Sans ce garde-fou, une salve d'apparitions rapides (une phrase qui s'écrit mot à mot) sortait
entièrement en « COUPE ». Une vraie coupe **domine largement ses voisines** (× 2,5).

⭐⭐ **Un impact fort se marque par un CREUX sonore juste avant, pas par un pic au moment de
l'impact** (mesuré TED-Ed 2026-09-02 : la seule vraie coupe du film est le seul moment où le son
DESCEND de -30dB, jamais où il monte). Pour un effondrement/impact : couper le lit sonore ~0.5s
avant, laisser l'impact seul, laisser le lit revenir après. ⭐ **La durée d'un SFX ponctuel = la
durée du geste qu'il accompagne** : un geste bref (~5 frames) → tick sec haut-perché (+9 à +32dB
en 3-10kHz, decay médian 5 frames) ; un geste tenu (~1s, ex. un zoom qui dure) → son tenu toute sa
durée, pas un tick. Source : `ANALYSE-CONTINUOUS-FLOW.md` §5 R7/R9 (13 événements mesurés à la main).

⚠️ **La sortie donne des CANDIDATS, pas une vérité.** Garder ce qui porte un sens narratif,
retirer le reste : un SFX par micro-mouvement fatigue autant que pas de SFX du tout. L'outil
dit **OÙ**, jamais **QUOI** — le choix du fichier reste un jugement.
⭐ Banque écoutable (SFX + 2 pages musique) : voir `memory/INDEX-LIENS.md`.

## SI ÇA RATE 2×
**Symptôme audio ≠ cause audio.** Avant de retoucher le son, MESURER :
`ffmpeg -hide_banner -nostats -i <audio> -af "silencedetect=noise=-38dB:d=0.5" -f null /dev/null 2>&1 | grep silence`
(⛔ sans `-v error`, sinon la sortie du filtre est masquée).
Si le silence existe déjà → le défaut est VISUEL : une bascule de scène tombe à côté (mesuré : 27 frames après la
reprise de voix = « coupure sèche » alors que rien n'était coupé, corrigé sans toucher un octet d'audio).
Un timecode écrit dans une note N'EST PAS une mesure (note « ~9,6 s » vs signal 8,92 s = un mot coupé).
Au 2e rejet du même symptôme : STOP, mesurer, puis déléguer à un agent frais (Opus, `run_in_background`).
