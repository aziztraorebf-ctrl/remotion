# Whisper API vs ElevenLabs forced-alignment — quand utiliser quoi

> Migré depuis auto-memory 2026-08-31 (créé 2026-04-29, mis à jour 2026-07-25). Complète
> `memory/tools/elevenlabs.md` (§ Forced Alignment, endpoint/gotchas techniques v1) avec la règle
> de SPLIT PAR USAGE (sous-titres vs beats narratifs) et une correction mesurée sur les voix
> expressives.

## La regle

**Sous-titres word-level** (karaoke, mot-par-mot synchronise) → **Whisper API OpenAI** (whisper-1)

**Timing global des beats de scenes** (debut/fin de phrases, segments narratifs) → **ElevenLabs forced-alignment**

## Why: La rule

- **ElevenLabs forced-alignment** : prend audio + texte exact, retourne timestamps. Tres precis quand la voix est "standard". Sur les voix expressives/atypiques (Narratrice GeoAfrique v2 remixee, accent ouest-africain), le loss peut exploser dans certains cas (>1.0 sur quasi tous les mots) → timestamps aberrants au niveau mot. **Nuance 2026-07-25 ci-dessous : ce n'est pas systématique.**

- **Whisper API OpenAI** : transcrit ce qu'il entend ET retourne les timestamps. Plus tolerant aux voix atypiques car il ne cherche pas a matcher un texte attendu. Donne des timestamps mot-par-mot exploitables meme sur voix expressives.

- **Mais Whisper transcrit avec ses propres conventions** (pas toujours conforme au script original). Donc OK pour timing visuel des sous-titres, PAS pour timing logique des beats narratifs (ou on a besoin de boundaries phrase exactes).

## How to apply

### Pour les sous-titres
```bash
python scripts/tools/whisper-align.py public/audio/<projet>/narration.mp3 \
    --out src/projects/<projet>/whisper-words.ts
```
Cout : ~$0.006/min (Whisper-1)

### Pour les beats de scenes
ElevenLabs forced-alignment (gratuit avec quota ElevenLabs) — voir `memory/tools/elevenlabs.md`
pour l'endpoint exact et les gotchas (route `/v2/forced-alignment` n'existe PAS, rester sur `/v1/`).

## Erreur a ne pas reproduire

**Sonjata session 2026-04-29** : tentative initiale d'utiliser ElevenLabs forced-alignment pour les sous-titres -> loss 1.93 globalement, mots collapses (Soundjata "dure" 6.28s, etc.). Switch vers Whisper API a sauve la session.

## Couts compares

| Outil | Cout | Granularite | Voix expressives |
|-------|------|-------------|------------------|
| ElevenLabs forced-alignment | inclus quota ElevenLabs | mot mais loss variable sur voix atypiques (voir nuance ci-dessous) | Variable, à mesurer |
| Whisper API (whisper-1) | $0.006/min | mot precis | OK |
| Whisper local | gratuit mais lent | mot mais moins precis | Variable — ⛔ éviter, doctrine projet = API seulement |

**Regle pratique** : 3 min audio = $0.018 via Whisper API. Toujours moins cher que de re-rendre une video.

---

## ⚠️ MISE À JOUR 2026-07-25 — le verdict « ElevenLabs = Échec sur voix expressives » est PÉRIMÉ (mesuré)

Le tableau ci-dessus (2026-04-29) classait ElevenLabs forced-alignment en **échec** sur les voix
expressives. **Démenti par la mesure** sur les VO des beats CFA 5a/5b, produites avec la voix
GéoAfrique V2 (`z3gESu49naEZW8Af2Upm`, pipeline TTS V3 → STS — la MÊME famille de voix) :

| VO | mots | loss GLOBAL |
|---|---|---|
| beat5a | 63 | **0.085** |
| beat5b | 58 | **0.040** |

Les timestamps obtenus ont servi à caler les deux composants au mot près, sans retouche.

**Nuance honnête** : le loss PAR MOT peut être élevé sur un mot court d'attaque (ex. 1.61 sur « Et »
en premier mot) **sans que les timestamps soient inexploitables** → juger sur le **loss global**, pas
sur le pire mot.

**Avantage structurel** (vaut indépendamment du quota) : le forced-alignment reçoit le **texte attendu**
en entrée, donc il ne peut pas mal transcrire un nom propre ou un sigle — plus fiable qu'une
transcription libre pour du CALAGE. C'est aussi le seul chemin disponible quand le quota OpenAI est
épuisé (`429 insufficient_quota`).

**Outil prêt** : `scripts/tools/forced-align.py` — ne plus écrire de script d'alignement par épisode.

**Conclusion pratique (2026-08-31)** : la règle de split par USAGE (sous-titres word-level = Whisper,
beats narratifs = ElevenLabs) reste valide comme heuristique de départ, mais le "loss élevé sur voix
expressive" n'est plus une raison automatique d'écarter ElevenLabs — mesurer le loss GLOBAL au cas
par cas avant de conclure à un échec.
