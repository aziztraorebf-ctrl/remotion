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
8. **Mix** : SFX plancher **0.50** (jusqu'à 0.60 sur gros moment) · **musique = 0.13 au départ** (valeur harmonisée par Aziz le 2026-08-17 sur le code réel — les anciennes 0.07 / 0.12-0.15 / 0.10-0.14 sont périmées ; on part de 0.13 et on monte ou descend à l'oreille) · SFX ponctuels uniquement, jamais de nappe continue. Musique tardive : si `(durée_piste − startFrom) < durée_beat` → 2e `<Audio startFrom={0}>` en relais.

## SI ÇA RATE 2×
**Symptôme audio ≠ cause audio.** Avant de retoucher le son, MESURER :
`ffmpeg -hide_banner -nostats -i <audio> -af "silencedetect=noise=-38dB:d=0.5" -f null /dev/null 2>&1 | grep silence`
(⛔ sans `-v error`, sinon la sortie du filtre est masquée).
Si le silence existe déjà → le défaut est VISUEL : une bascule de scène tombe à côté (mesuré : 27 frames après la
reprise de voix = « coupure sèche » alors que rien n'était coupé, corrigé sans toucher un octet d'audio).
Un timecode écrit dans une note N'EST PAS une mesure (note « ~9,6 s » vs signal 8,92 s = un mot coupé).
Au 2e rejet du même symptôme : STOP, mesurer, puis déléguer à un agent frais (Opus, `run_in_background`).
