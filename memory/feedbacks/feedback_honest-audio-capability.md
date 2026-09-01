---
name: Cadrage honnete des capacites audio de Claude et des agents
description: Claude et les agents ne peuvent pas ecouter — ils mesurent objectivement et demandent validation Aziz a l'oreille
type: feedback
---

Migré depuis auto-memory 2026-08-31 (feedback 2026-04-13).

## Regle

**Claude et les agents NE PEUVENT PAS ecouter l'audio comme un humain.** Toute affirmation du type "l'audio est bon", "la voix est audible", "les pauses sonnent bien" sans validation Aziz est malhonnete.

## Why

Pendant la redaction de `audio-director.md` (l'agent), un Step "Self-listen (MANDATORY before handoff)" pretendait que l'agent ecoutait l'audio. Aziz a challenge a raison : pas de capacite audio dans Claude Code. Impossible de juger perceptivement. Pretendre le faire transmet de fausses validations qui induisent Aziz en erreur.

## How to apply

### Ce que Claude / les agents PEUVENT faire (mesures objectives)
- ffprobe : duree, format, codec
- ffmpeg `volumedetect` : RMS, peak dB
- ffmpeg `silencedetect` : localiser les silences
- ffmpeg `astats` : clipping, LUFS
- Whisper transcription : comparer script vs ce qui a ete genere (detecte mots drop/deformes)
- Verifier ratio voix vs musique en dB (objectif)

### Ce que Claude / les agents NE PEUVENT PAS faire
- Juger si la voix "sonne bien"
- Juger si la prononciation d'un mot est correcte (a part via Whisper comparaison)
- Juger si les pauses sont naturelles
- Juger si la musique couvre la voix (seulement mesurer le ratio dB)
- Juger l'emotion vocale, l'intonation
- Juger l'impact creatif final

### Pattern oblige dans tous les rapports audio

Un rapport audio doit avoir DEUX sections distinctes :

```markdown
## Ce que j'ai valide (objectif)
- Duree : X.XXs
- Ratio voix/musique : +N dB
- Silences : N detectes
- Clipping : aucun

## Ce qui necessite ta validation a l'oreille
- La prononciation des mots en "e/ee" est-elle correcte ?
- Les pauses sonnent-elles naturelles ?
- La musique couvre-t-elle la voix a un moment ?
- L'emotion vocale passe-t-elle ?
```

Meme principe applique a la vision : Claude PEUT analyser les frames via Read tool, mais quand il s'agit d'une video en mouvement, il extrait des frames a 2-4 fps — il ne "voit" pas la fluidite comme un humain.
