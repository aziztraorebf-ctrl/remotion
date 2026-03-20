---
name: Voix GeoAfrique V3 — migration et IDs permanents
description: Voix natives eleven_ttv_v3 creees le 2026-03-14 pour remplacer Stephyra V2.5
type: project
---

## Decision 2026-03-14 — Abandon Stephyra, migration V3

**Stephyra (`QMNPncWXVcTVhJ9rDEQO`) abandonnee** :
- Voix publique ElevenLabs, fine-tunee sur multilingual_v2 / Flash v2.5 / Turbo v2.5
- Non compatible eleven_v3 nativement (audio tags limites)
- Trop utilisee publiquement — pas de differentiation

**Why:** Passer a eleven_v3 pour l'expressivite maximale (audio tags, stability creative, speed). Choisir accent africain subtil pour differentiation et authenticite narrative (histoire africaine, voix africaine).

**How to apply:** Toujours utiliser ces Voice IDs pour GeoAfrique. Ne jamais revenir a Stephyra.

---

## Voix sauvegardees (permanentes, natives eleven_ttv_v3)

| Voix | Voice ID | Genre | Profil |
|------|----------|-------|--------|
| Narratrice GeoAfrique V3 — Africaine Subtile | `Y8XqpS6sj6cx5cCTLp8a` | Feminine | Accent West Africa subtil, melodique, chaleureux |
| Narrateur GeoAfrique V3 — Africain Subtil | `ICHuIqamER7XZMdm2HYC` | Masculin | Accent West Africa subtil, baritone chaud, gravitas |

---

## Regles V3 (NON-NEGOTIABLE)

- **Modele TTS** : `eleven_v3`
- **Params** : `stability: 0.30, similarity_boost: 0.75, style: 0.25, speed: 0.90`
- **`use_speaker_boost`** : OMIS — non supporte en v3
- **Pauses** : `[pause]` / `[long pause]` — JAMAIS `<break time="Xs" />` (incompatible v3)
- **Audio tags disponibles** : `[nervous]`, `[pause]`, `[long pause]`, `[curious]`, `[drawn out]`, majuscules
- **Endpoint save voix** : `POST /v1/text-to-voice` (sans `/create` — 404 sinon)

---

## Musique de fond ElevenLabs

- **Endpoint** : `POST /v1/sound-generation`
- **Model** : `eleven_text_to_sound_v2` (PAS `music_v1` — 400 error)
- **Duree max** : 30s par generation (PAS 60s) — looper via ffmpeg pour couvrir 100s
- **Limite prompt** : 450 caracteres MAX
- **Mix recommande** : voix 100% + musique -18dB (level documentaire)
- **Styles testes 2026-03-14** : C (kora), D (dark ambient), E (tribal), F (orchestral), G (tribal+chant), H (tribal sans chant), I-raw/rich (ethnic), J (ethnic+tags NeoSounds)
- **Meilleur style valide** : J — description instrumentale (djembe, dundun, shekere, kora) + tags mood (African, tribal, festive, optimistic)
- **Script** : `scripts/generate-music-test.py`

### Workflow audio-analyse → prompt (PIPELINE VALIDE)
1. Trouver preview NeoSounds/TunePocket qui plait
2. Envoyer le fichier audio a Gemini API (`GEMINI_API_KEY` deja dans .env)
3. Demander : "Decris les instruments, style, mood, tempo, tags. Max 400 chars."
4. Recycler la description comme prompt ElevenLabs sound generation
- **Gemini audio** : `generateContent` avec inline audio ou File API (MP3/WAV/AAC support)
- **Cout** : gratuit (Gemini 2.0 Flash free tier)

### APIs musique alternatives (recherche 2026-03-14)
- **ElevenLabs Eleven Music** : API officielle, licensed data, commercial cleared, deja integre — PREFERE
- **Soundraw** : API publique, Afrobeats explicite (djembe/shekere/conga, BPM 95-115), $11/mois — option B si EL insuffisant
- **Udio** : ELIMINE — export desactive depuis nov 2025 (accord UMG)
- **Suno** : pas d'API officielle — wrappers tiers non-fiables
- **Mubert** : API publique mais peu de styles africains, orienté ambiant electronique

---

## Scripts

- `scripts/save-voices-v3.py` : regenere + sauvegarde les deux voix (a relancer si les IDs expirent)
- `scripts/voice-design-narratrice-v3.py` : genere de nouveaux candidats si besoin
- `scripts/voice-design-african.py` : voix masculines africaines (round 2, v3)
- `scripts/generate-music-test.py` : genere musique de fond styles C + D (30s, loopable)

---

## Strategie double voix

Les deux voix sont disponibles. Tester sur script complet 90s avant de choisir la voix principale.
Option future : alterner selon le sujet ou creer identite "equipe" sur la chaine.
