# Doctrine — PAUSES AUDIO DÉTERMINISTES (corriger le rythme d'une narration SANS régénérer)

> ⭐⭐ **RÉUTILISABLE POUR TOUT PROJET** (pas seulement Soudan). Le déblocage prouvé le 2026-07-22 : contrôler
> le rythme/les pauses d'une narration au centième de seconde, en gardant 100% de la prononciation validée.
> Foyer canonique de cette méthode. Complète `memory/tools/elevenlabs.md` (qui couvre la GÉNÉRATION + tags),
> ici on couvre la CORRECTION DU RYTHME d'un audio déjà généré et validé.

## LE PROBLÈME (pourquoi cette méthode existe)
Quand Aziz dit « la voix se précipite / n'a pas de pause ici / la phrase est coupée » :
1. ❌ **NE PAS** compter sur ElevenLabs pour placer les pauses via tags `[pause]` / ponctuation. Le modèle
   INTERPRÈTE : il met la pause où LUI juge, pas où on demande. Prouvé 2 fois (v2/v3 tags) : une pause
   apparaît, une autre disparaît à chaque régénération = jeu de hasard, on tourne en rond.
2. ❌ **NE PAS RÉGÉNÉRER** un audio déjà validé pour « juste rajouter une pause ». Régénérer = nouveau tirage
   TTS → le modèle RE-RATE des mots qui étaient CORRECTS dans l'audio validé (prononciation qui dérive).
   Constaté : la version segments-régénérés avait des mots mal prononcés absents de l'original.

## LA MÉTHODE (déterministe, prouvée)
Reprendre l'**AUDIO ORIGINAL VALIDÉ** (prononciation intacte, déjà approuvée) → insérer des **SILENCES EXACTS
ffmpeg** aux points voulus. On ne touche JAMAIS à la voix, on ajoute/ajuste seulement les blancs.

### Étapes
1. **Forced-alignment MOT-À-MOT** de l'audio original : `python3 scripts/tools/whisper-align.py <audio.mp3> --out /tmp/align.ts`
   (API OpenAI Whisper, JAMAIS le binaire local — cf feedback whisper). Donne `{word, start, end}` par mot.
2. **Repérer les points de coupe** : pour chaque pause voulue, le `cut_s` = fin exacte du DERNIER mot de la
   phrase, `resume_s` = début du 1er mot suivant. ⛔ CALER SUR LES TIMINGS MOT-À-MOT, **PAS** sur les gros gaps
   de silence `-35dB` (silencedetect) — ceux-ci peuvent tomber APRÈS la mauvaise phrase (décalage jusqu'à ~1.4s
   observé) et manger un mot. C'est LA cause du bug « mot coupé ».
3. **Manifest JSON** `<projet>-pauses-sur-original.json` :
   `{source_audio, source_duration_s, cuts:[{label, cut_s, resume_s, sil_s}]}`. `sil_s` = durée du silence à
   insérer (remplace le gap naturel cut_s→resume_s). Repères : 0.7-1.0s fin d'idée · 1.3-1.6s changement de
   palier/beat · 2s chute finale. Marqueur `_aziz: true` sur les pauses explicitement demandées.
4. **Appliquer** : `python3 scripts/tools/soudan-audio/pauses-sur-original.py <manifest.json> <out.mp3>`.
   Le script découpe l'original à chaque cut, insère `sil_s` (anullsrc), recolle. 100% voix préservée.
5. ⛔⛔ **GARDE-FOU OBLIGATOIRE** (exigé Aziz, NON-NÉGOCIABLE) : re-transcrire le résultat via `whisper-align.py`
   et VÉRIFIER que TOUS les mots du script sont présents (aucun coupé/sauté). Si un mot manque → la coupure est
   mal calée, recaler `cut_s` sur le timing mot-à-mot exact. NE JAMAIS présenter un audio à pauses sans ce contrôle.

### Retirer un MOT (ex « Résumons ») — même principe
Re-couper l'audio à la frontière du mot (whisper) : garder [0..avant_le_mot] + [après_le_mot..fin], sans le mot.
Garde-fou whisper après (le mot retiré ne doit plus apparaître, RIEN d'autre ne doit manquer).

### Générer par segments (variante, si besoin de contrôle total dès la génération)
`gen-segments.py` (1 fichier TTS propre par phrase, trimé début/fin) + `assemble-segments.py` (concat + silences
depuis manifest `sil_after_s`). ⚠️ Régénère la voix → risque de re-rater des mots. Préférer la méthode
"sur-original" quand un audio validé existe déjà. Segments = pour un NOUVEL audio only.

## RE-TIMING DES VISUELS après pauses (crucial)
Les pauses DÉCALENT les mots dans le temps → les jalons visuels calés sur ces mots dérivent. Formule NETTE
(prouvée contre durées ffprobe) : **`F_new = F + 30 * somme( (sil_s − gap_naturel) des pauses dont cut_s < F/30 )`**
(30 = fps). ⛔ PAS la formule brute `F + 30*sil_s` : nos pauses REMPLACENT le gap naturel, elles ne l'ajoutent
pas. Erreur de la formule brute = désync jusqu'à +5.5s. Ajuster aussi la durée totale de la compo (+ somme des sil_s).

## OUTILS (durables, dans scripts/tools/soudan-audio/, réutilisables tout projet)
- `whisper-align.py` (racine scripts/tools/) — forced-alignment mot-à-mot (API OpenAI).
- `pauses-sur-original.py` — applique un manifest de pauses sur un audio original. **L'outil principal.**
- `assemble-segments.py` + `gen-segments.py` — variante segments (nouvel audio).
- `build-music-loop.sh` — boucle musique par crossfade triangulaire (couvre une durée cible).
- `mix-soudan-v3.sh` — mix musique (vol + bass domptées) + SFX (liste fichier:tc:vol). Template réutilisable.
- Manifests exemple : `acte{1,3,5,6}-pauses-sur-original.json` (Soudan, modèle à copier).

## RÈGLE ANTI-MANIAQUE (sagesse Aziz 2026-07-22)
L'écoute RÉPÉTÉE fait « entendre » des micro-défauts sous le seuil de perception d'un spectateur (qui écoute 1×
porté par récit+visuel). Une passe de pauses aux fins d'idées ÉVIDENTES par acte, garde-fou whisper, PUIS juger
en CONTEXTE (vidéo assemblée avec musique+SFX+visuel). Ajuster une pause = changer UN nombre dans le manifest =
5s. Donc pas besoin de tout verrouiller au micron : le pipeline est l'acquis, le perfectionnisme au-delà = coût
sans gain perçu. [[feedback_tester-avant-de-douter-gate]]

## Voir aussi
`memory/tools/elevenlabs.md` (génération + tags + règles FR à scanner) · `feedback_whisper-api-openai-jamais-local`
(whisper API only) · Soudan : `starters/STARTER-PROMPT-soudan-midform-PASSE-FINALE-DETAILS.md` (application concrète).
