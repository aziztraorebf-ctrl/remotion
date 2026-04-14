# quality-reviewer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-13 (initial)

---

## Recurring technical artifacts per tool

| Tool | Artifact | Typical trigger | Detection tip |
|------|---------|-----------------|---------------|
| Seedance 2.0 (ref-to-video) | Arme fantome | Conflit prompt (1 perso arme) vs ref video (2 armes) | Scanner tous les frames, chercher objets en contradiction avec le prompt |
| Seedance 2.0 | Flicker sur armes rapides | Combat dense + verbes MAJUSCULES | Extract frames a 4fps, chercher duplication 1-2 frames |
| Gemini 3.1 Flash Image | Text parasite | Prompt sans "no text" | Scanner frames pour lettres accidentelles |
| Gemini | Character identity drift | REF non fournie ou trop petite | Comparer frames vs REF image |
| Kling V3 Pro | 2D flat style ignore | Prompt 2D sur Kling = passe en semi-realisme | Verifier style consistency |
| Recraft V4 | Details parasites ajoutes | Sans Style ID | Verifier fidelite au brief |
| Remotion pure | Pop-in on Sequence entry | `premountFor` manquant | Scrubber dans le dev server |

---

## Kimi brief templates

### Template "confirm or refute" (scope strict)
```
I observed [X, Y, Z] in the rendered video [path].
Confirm or refute these observations with timestamps.

Also scan for these TECHNICAL artifacts only :
- morphing / anatomy bugs
- pop-in / layout shifts
- flicker between frames (objects appearing/disappearing)
- text parasites (banners, accidental text, subtitles)
- identity drift (character doesn't match reference)

Rules :
- Do NOT suggest creative improvements
- Do NOT judge narrative or emotional quality
- Do NOT comment on scene composition unless a technical bug is present
- Report findings per timestamp with severity (critical / minor / cosmetic)
```

### Template "scope ciblage" (specifique artefact)
```
At [timestamp X.Xs], I see [describe observation].
Confirm or refute : is this a bug or intentional ?
If bug : severity and cause ?
```

---

## Verdict patterns per project family

### Shorts GeoAfrique
- APPROVE typique : 1-2 cosmetic artifacts max, direction match OK
- MINOR FIX typique : 1 asset a regen ou 1 scene a adjuster
- RE-EVALUATE : rare, generalement structure narrative ou identity drift

### Long-form Soundjata / historical
- Plus de tolerance sur les imperfections techniques (compenses par la longueur)
- Direction match plus critique (coherence 5-10min)

### Hybrid (map + clips)
- Sync visuel-audio critique (cartes animees doivent caler sur les beats narratifs)

---

## Audio ratio targets validated per project type

| Project type | Voice RMS target | Music RMS target | Ratio target |
|--------------|------------------|------------------|--------------|
| Short GeoAfrique | -14 dB | -26 dB | +12 dB |
| Long-form narrative | -14 dB | -28 dB | +14 dB |
| Historical map + narration | -14 dB | -22 dB | +8 dB |

Mesure via `ffmpeg -i file.mp3 -filter:a volumedetect -f null -`.

---

## False positives from Kimi

_Liste vide au demarrage. Ajouter ici les suggestions Kimi qui ont ete rejetees par Aziz (pour eviter de les re-appliquer)._

Format :
```
Date | Kimi suggestion | Why rejected | Project
```

---

## Session log

### 2026-04-13 (initial)
Agent cree. Replace kimi-reviewer + visual-qa.
