# audio-director — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-22 (Minimax v2.6 valide + hook pattern + Sonjata Short complet)

---

## MANDATORY PRE-API GATE CHECK (2026-04-17)

**BEFORE any ElevenLabs TTS call, run the TTS French scan gate via Bash.**

```bash
python3 -c "
import sys; sys.path.insert(0, 'scripts')
from pipeline_gates import pre_elevenlabs_check
config = {'script': '''<YOUR_FRENCH_SCRIPT>'''}
ok, results = pre_elevenlabs_check(config)
for r in results: print(r)
print('VERDICT:', 'PASS' if ok else 'BLOCKED')
"
```

**Gate 9 checks:**
- Participes passes "e/ee" en fin de groupe (ElevenLabs drop accent)
- "ont + voyelle" (liaison bizarre)
- Nombres en chiffres (lecture robotique — ecrire en lettres)

**If BLOCKED: fix the script BEFORE calling ElevenLabs. Do NOT generate with known issues.**

---

## KNOWN AUDIO PITFALLS (validated 2026-04-13 on Soundjata Acte V)

Five recurring problems encountered during multi-segment audio mixing. **Anticipate them proactively** on every new project/segment to prevent re-occurrence.

- **P1 Narration cut at segment boundaries** → Whisper timestamps are approximations, actual ElevenLabs boundaries drift ±200-500ms. **Add ±0.3-0.5s buffer around segment cuts, verify by ear first/last 500ms before delivery**.
- **P2 Narration overflow into next act** → extraction sized to video duration leaks next act's opening phrase. **Clamp narration to SCRIPT boundary, not video duration. Rule: no phrase from act N+1 should appear in act N audio.**
- **P3 Seedance audio contains invented speech** → when `generate_audio: true`, Seedance sometimes produces parasitic words. **Before mixing, listen to Seedance audio pure. If parasitic speech in narration zone: mute that zone, or regenerate clip with "no vocal dialogue" clause, or accept if narration covers.**
- **P4 Keep-and-duck level per scene** → 30% default valid. Battle/crowd up to 35-40%, intimate/dialogue down to 15-20%. **Always listen-test before validating.**
- **P5 Whisper vs ElevenLabs timestamp drift** → ±0.3s margin on all cuts. For critical boundaries, measure actual silences with `ffmpeg silencedetect` OR direct listening.

**Full details in `.claude/agents/audio-director.md` section "Known Audio Pitfalls"**.

---

## FORCED ALIGNMENT — OBLIGATOIRE apres chaque generation TTS (2026-04-19)

**Quoi** : donne audio + texte, retourne timestamps mot-par-mot. Remplace Whisper.

**Endpoint** : `POST https://api.elevenlabs.io/v1/forced-alignment`
**Format** : multipart form-data (`file` = audio, `text` = plain text sans tags)
**Retour** : JSON avec `words[]` (text, start, end, loss) + `loss` global

**Regles** :
- Le `text` DOIT etre en plain string — PAS de tags V3, PAS de markdown
- Faire IMMEDIATEMENT apres generation TTS (meme appel API, meme session)
- Sauvegarder le JSON dans le meme dossier que l'audio
- Le fichier JSON sert directement au storyboarder pour le timing.ts

**Avantages vs Whisper** :
- Plus precis (texte exact fourni, pas de transcription)
- Score de confiance par mot (loss)
- Detecte les pauses entre mots
- 1 seul appel API

---

## Established voices per project

| Project | Voice name | Voice ID | Settings | Status |
|---------|-----------|----------|----------|--------|
| GeoAfrique Shorts | Narrateur GeoAfrique | `ICHuIqamER7XZMdm2HYC` | stab=0.30, style=0.25, speed=0.90 | Validated |
| GeoAfrique (feminin) | Narratrice GeoAfrique originale | `Y8XqpS6sj6cx5cCTLp8a` | stab=0.30, style=0.25, speed=0.92 | **ARCHIVEE — sonne robotique** |
| **Sonjata Papercraft** | **Narratrice GeoAfrique v2 (ACTIVE)** | `z3gESu49naEZW8Af2Upm` | **stab=0.22, style=0.55, sim=0.55, speed=1.0** | **Validated 2026-04-19** |
| Abou Bakari | Stephyra (PVC) | `QMNPncWXVcTVhJ9rDEQO` | n/a | **Deprecated** — PVC ignore les tags V3 |
| Soundjata | Narrateur B3 | `12mpLi4ieFNVlQlAIJ3m` | — | A tester |
| Soundjata antagoniste | Matrone Froide | `5eScDXbqClEhrA46NN4r` | Voice Design V3 | Validated |

### Lecon Voice Design vs Voice Remix (2026-04-19)
- Voice Design seule = souvent robotique/synthetique avec un "filtre" perceptible
- Voice Remix = prend une voix existante et la transforme en modele V3 complet
- **Toujours remixer une voix Voice Design avant production** (prompt_strength 0.45)
- Config "max-style" (stab=0.22, style=0.55) = meilleure expressivite, validee par Aziz

---

## Minimax Music 2.6 — VALIDE 2026-04-22 (Sonjata session 8)

### Endpoint et payload (confirmes)
```python
fal_client.subscribe("fal-ai/minimax-music/v2.6", arguments={
    "prompt": "<description>",
    "is_instrumental": True,  # OBLIGATOIRE pour musique de fond
})
```
- Schema : `TextToMusic26Request` — prompt 10-2000 chars, lyrics optionnel, audio_setting optionnel
- **PAS de `reference_audio_url`** (champ n'existe pas en v2.6, causait 422 sur endpoints anciens)
- **PAS de `duration_seconds`** (le modele genere 2-9min, trim ffmpeg apres OU Remotion tronque via Sequence)
- Cout : $0.10/generation, ~3min par job
- 3 variantes parallele via `fal_client.submit` = ~6min total, $0.30

### Formule prompt validee (reconfirmee 2026-04-22)
1. **Artiste specifique nomme** (ex: "Style of Toumani Diabate")
2. **1-2 instruments principaux** (PAS 5 empiles)
3. **Rythme precis** (ex: "gentle 6/8 rhythm", BPM)
4. **Texture organique** ("warm, acoustic, organic")
5. **Interdictions OBLIGATOIRES** : "No synthesizers, no electronic sounds"
6. **Origine culturelle precise** ("Traditional Mande griot music from Mali", PAS "West African")

### Prompts Sonjata session 8 (3 variantes)

**A — Griot intime (RETENU par Aziz)** — 157s genere, kora + balafon
```
Traditional Mande griot music from Mali, 13th century empire era.
Solo kora with slow balafon accents. Style of Toumani Diabate.
Gentle 6/8 rhythm, acoustic, warm, organic, meditative.
No synthesizers, no electronic sounds, no drums except soft dundun.
```

**B — Griot royal** — Sidiki Diabate, kora + djembe + dundun, 168s genere
**C — Griot guerrier** — Neba Solo, djembe + balafon, 520s genere (long, reutilisable pour versions longues)

Voir `memory/tools/minimax.md` pour le guide complet.

### Anti-pattern confirme (rejete 2026-04-22)
```
Epic West African orchestral, kora + djembe + dunun + balafon,
majestic warm tones, cinematic, 95 BPM
```
Resultat : "accents electroniques tres pousses, pas africain ancien" (Aziz).
**Pourquoi ca echoue** :
- "orchestral" + "cinematic" poussent vers les synthes
- 4+ instruments empiles (vs 1-2 nommes)
- Pas d'artiste de reference
- Pas d'interdiction explicite

### Gotcha prompt
NE PAS mettre le mot "instrumental" dans le prompt si `is_instrumental: true` est passe en parametre. Cause 422 de validation (observe 2026-04-22).

---

## HOOK NARRATION PATTERN (valide 2026-04-22)

### Recette phrase-choc
Formule : **"[Constat impossible]. [Promesse au futur]."**

Exemples :
- "Cet enfant ne peut pas se lever. Il fondera un empire africain." (Sonjata, 63 chars, 4.32s)

### Contraintes techniques
- **Max 14 mots** pour tenir en 5s (debit Narratrice GeoAfrique v2)
- **2 phrases courtes** > 1 phrase longue
- **Scan TTS obligatoire** : participes "e/ee", "ont+voyelle", chiffres
- **Config max-style** : stab=0.22, sim=0.55, style=0.55, speed=1.0

### Integration Remotion
- Hook 5s = Sequence from=0, musique SILENCE pendant hook (Option B)
- Musique entre a Sequence scene 1 avec fade-in 2s (contraste dramatique)
- Voir `memory/templates/hook-short.md`

---

## Mix audio (regle projet consolidee)
- **Volume musique** : 0.15 dans Remotion (~-16.5dB, compatible regle -18dB sous voix)
- **Fade-in** : 2s (60 frames @30fps) via `interpolate` clamped
- **Fade-out** : 2s avant fin composition
- **Option B** : silence musique pendant hook, entree a scene 1
- Reference implementation : `src/projects/geoafrique-shorts/SonjataShortFull.tsx`

---

## Cost averages

| Project type | Narration (ElevenLabs) | Music (Minimax) | Total typical |
|--------------|------------------------|-----------------|---------------|
| Short 60-90s | ~$0.20 | ~$0.50 | ~$0.70 |
| Long-form 5-10min | ~$1.50 | ~$0.50 | ~$2.00 |

---

## French TTS gotchas discovered

- **Accents ecrits OBLIGATOIRES** (2026-04-19) : ElevenLabs prononce "Mande" comme "monde", "frappe" comme nom au lieu de participe, "tremblerent" mal articule. TOUS les accents francais doivent etre ecrits dans le script Python (e, a grave, c cedille, etc.). Scanner AVANT chaque generation.
- **"se mirent a trembler" > "tremblerent"** : reformuler les passes simples problematiques en tournures plus sures.

---

## Session log

### 2026-04-13 (initial)
Agent cree. Aucune invocation encore.

### 2026-04-13 PM (5 audio pitfalls identified from Soundjata Acte V)
Pendant la production Soundjata Acte V (hors agent, fait par Claude principal), 5 problemes audio recurrents ont ete identifies : P1 narration coupee aux frontieres (buffer Whisper), P2 debordement narration sur acte suivant, P3 audio Seedance avec paroles inventees, P4 niveau keep-and-duck a ajuster par scene, P5 drift timestamps Whisper vs ElevenLabs. Documentes dans la section "Known Audio Pitfalls" de l'agent. **A anticiper proactivement** sur tous les futurs mixes audio multi-segments.

### 2026-04-22 (Sonjata session 8 — Minimax v2.6 + hook validation finale)
**Hors agent, par Claude principal** :
- Bug Minimax historique resolu : `fal-ai/minimax-music/v2.6` + `is_instrumental: true`, pas de `reference_audio_url`
- Formule prompt Mande validee : artiste nomme + 1-2 instruments + "no synthesizers" + origine precise
- 3 variantes Mande generees ($0.30), Aziz choisit A-Toumani (157s kora + balafon)
- Hook narration 5s genere : "Cet enfant ne peut pas se lever. Il fondera un empire africain." (4.32s)
- Integration Remotion : musique Sequence from=scene1 (Option B), silence pendant hook
- Render final 151s valide par Aziz : "tres bon, publiable pending CTA"
- Seule tache restante : CTA narration apres recharge ElevenLabs
