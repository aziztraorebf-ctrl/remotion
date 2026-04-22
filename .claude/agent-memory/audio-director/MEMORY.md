# audio-director — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-19 (Voice Remix V3 + Forced Alignment + config max-style)

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

## Music prompts validés (Minimax Music 2.6)

### Historical Map / Abou Bakari (mandingue griot)
Prompt qui fonctionne : `"Toumani Diabate style, kora + ngoni, Mandinka traditional, no synths, no electronic elements, acoustic only, contemplative, solo instrumental"`
Cout : ~$0.50 pour 30s trimmed
Trim : `ffmpeg -i raw.mp3 -t 30 -c copy music.mp3`

### Anti-pattern a eviter
- "cinematic orchestra" -> son synthetique generique
- "epic soundtrack" -> meme probleme
- Sans "no synths" -> Minimax ajoute des synths par defaut

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
