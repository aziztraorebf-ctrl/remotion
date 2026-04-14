# audio-director — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-13 (initial)

---

## Established voices per project

| Project | Voice name | Voice ID | Settings | Status |
|---------|-----------|----------|----------|--------|
| GeoAfrique Shorts | Narrateur GeoAfrique | `ICHuIqamER7XZMdm2HYC` | stab=0.30, style=0.25, speed=0.90 | Validated |
| GeoAfrique (feminin) | Narratrice GeoAfrique | `Y8XqpS6sj6cx5cCTLp8a` | stab=0.30, style=0.25, speed=0.92 | Validated |
| Abou Bakari | Stephyra (PVC) | `QMNPncWXVcTVhJ9rDEQO` | n/a | **Deprecated** — PVC ignore les tags V3 |
| Soundjata | Narrateur B3 | `12mpLi4ieFNVlQlAIJ3m` | — | A tester |
| Soundjata antagoniste | Matrone Froide | `5eScDXbqClEhrA46NN4r` | Voice Design V3 | Validated |

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

_Liste vide au demarrage. Ajouter ici toute nouvelle regle qui n'etait pas dans `memory/tools/elevenlabs.md`._

---

## Session log

### 2026-04-13 (initial)
Agent cree. Aucune invocation encore.
