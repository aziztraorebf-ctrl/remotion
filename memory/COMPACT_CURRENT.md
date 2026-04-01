# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-03-31 PM3 (cleanup, archive V1) | A LIRE EN DEBUT DE SESSION
> Archive V1 (Thiaroye, Kling beats, Hannibal, Amanirenas, Seedance discovery) : `memory/archive/production-v1.md`

---

## Abou Bakari Short V2 — EN COURS (Seedance-native)

### Audio V3 FINAL
- Fichier : `tmp/audio-abou-bakari-v2/abou-bakari-v2-full-v3.mp3` (**92.6s** — gagne 15s vs V2)
- Structure : Partie A narration (0-40s) + Dialogue (40-49s) + Partie B (49-93s)
- Narratrice V3 speed 0.92, `[pause]` au lieu de `[long pause]` entre beats
- **Accents corriges** : "le hante" (pas "hante par"), "tremble de peur" (pas "terrifie"), "de l'histoire" (pas "jamais tente"), "qu'on te cache" (pas "qu'on ne t'a pas racontee")
- Dialogue : Abou Bakari (`ICHuIqamER7XZMdm2HYC`, grave) + Moussa (`12mpLi4ieFNVlQlAIJ3m`, plus jeune)
- Script generation : `scripts/generate-abou-bakari-v2-audio.py`

### Script V2
- Fichier : `scripts/abou-bakari-v2-script.md` — 9 beats, ton epique, dialogue Moussa, Mansa Moussa "400 milliards"

### Timings Whisper V3
- Fichier : `src/projects/geoafrique-shorts/timing-v2.ts` (source : `tmp/whisper-v3/`)
- **NOTE** : frontieres Whisper entre beats 3/4/5 imprecises. Vrais timings silencedetect : beat 3 finit ~33.0s, beat 4 ~39.9s. Recalage necessaire avant assemblage.

### Beat Table

| Beat | Contenu | Debut | Fin | Duree | Clip | Statut |
|------|---------|-------|-----|-------|------|--------|
| hookGeo | "En 1311... Sauf un homme." | 0s | 10.6s | 10.6s | REUTILISE Remotion V1 | A integrer |
| empire | "Abou Bakari deux... le hante." | 10.6s | 24.6s | 14s | beat02-empire-v1.mp4 (12s) | **VALIDE** |
| expedition | "Il fait armer... On ne passe pas." | 24.6s | 33.0s | 8.4s | beat03-expedition-v1.mp4 (10s) | **VALIDE** |
| decision | "Il ne recule pas... son pouvoir." | 33.0s | 39.9s | 6.9s | beat04-decision-v1.mp4 (7s) | **VALIDE** |
| dialogue | 3 voix passation Moussa | 39.9s | 49.0s | ~9s | beat05-dialogue-v1.mp4 (10s, silent) | **VALIDE** |
| moussa | "Son demi-frere... 400 milliards." | 49.0s | ~64s | ~15s | A GENERER | **PROCHAIN** |
| depart | "Il monte... jamais." | ~64s | ~76s | ~12s | A GENERER | En attente |
| colomb | "181 ans plus tard... Le decouvreur." | ~76s | ~85s | ~9s | A DEFINIR | En attente |
| cta | "Mais qui a fait... en bio." | ~85s | 92.6s | ~8s | Remotion pur | A coder |

### Beats VALIDES — Details

**Beat 02 Empire** : 2 clips Seedance assembles — V2(0-4s marche) + V1(7-15s foule->close-up->silhouette). `beats-v2/beat02-empire-v1.mp4` (12s, 720x1280, 24fps, silent). 2s plus court que audio — freeze ou playbackRate.

**Beat 03 Expedition** : 2 clips — Clip A flotte aerienne (5s, 7.5/10) + Clip B survivant plage (5s, 8.5/10). `beats-v2/beat03-expedition-v1.mp4` (10s, silent). Refs : `beats-v2/refs/beat03-fleet-departure-ref.png` + `beat03-lone-survivor-ref.png`. 5 generations (3 ratees + 2 bonnes). Regles 15-19 Seedance apprises.

**Beat 04 Decision** : Crop centre du Seedance Test 2 (16:9->9:16), upscale 405x720->720x1280. `beats-v2/beat04-decision-v1.mp4` (7s, silent). 0 credits — reutilisation test existant.

**Beat 05 Dialogue** : 2 refs (Abou Bakari + Moussa sheets) + @Audio. `beats-v2/beat05-dialogue-v1.mp4` (10s, silent). Lip sync visuellement correct mais timing Seedance != ElevenLabs. Solution Remotion : 3 pistes `<Audio>` separees calees sur moments visuels (Abou L1 ~0s, Moussa ~6.5s, Abou L2 ~8.1s). Fichiers : `dialogue-abou-bakari-line1.mp3`, `dialogue-moussa.mp3`, `dialogue-abou-bakari-line2.mp3`. Note : "Cut to" = mot censure par Seedance, utiliser "Camera shifts to frame".

### Character sheet Moussa
- Fichier : `characters/moussa/mansa-moussa-character-sheet-v1.png`
- Genere Gemini 3.1 Flash, style identique a Abou Bakari
- Turban blanc + bande or, boubou blanc, clean-shaven, chaine or — clairement distinct d'Abou Bakari

### Securite — Incident cle API (session 31 mars)
Cle Gemini TTZM hardcodee dans 4 scripts, commitee, Google l'a revoquee. Corrige : commit `c890f4a`. Hook pre-commit installe (local + global `~/.git-hooks/pre-commit`). Voir `feedback_no-hardcoded-keys.md`.

### Prochaines actions

1. **Beat 5b Moussa** : Seedance 80cr — Moussa seul sur trone + caravanes d'or. Ref = Moussa character sheet. Format SECONDS X TO Y.
2. **Beat 06 Depart** : tester V2V sur Test 3 (ajouter equipages) — 120cr. Sinon regenerer 9:16 natif.
3. **Beat 07 Colomb** : Seedance text-to-video palette froide ou Remotion pur — a definir.
4. **Recaler timing-v2.ts** : utiliser silencedetect sur audio complet pour vrais timings.
5. **Assemblage Remotion** : creer `AbouBakariV2.tsx` utilisant timing-v2.ts recale + clips beats-v2/.
6. **Musique** : generer dans Suno, looper 30s x3. Prompts dans `memory/archive/production-v1.md`.

### Backlog tests Seedance (non bloquants)

| Test | Objectif |
|------|----------|
| Plan-sequence 15s | Duree max |
| Video-to-video | Ajouter elements a un clip existant |
| Lip sync dialogue 15s | Narration longue avec lip sync natif |

---

## Infrastructure (compact)

**Vercel Blob** : `scripts/upload-to-blob.py` — upload, gallery HTML, listing. Token `BLOB_READ_WRITE_TOKEN` dans `.env`. Details : `memory/archive/production-v1.md`.
**Vercel Renderer** : `remotion-renderer-khaki.vercel.app` — render remote.

---

## Autres projets (status)

**Peste 1347** : HookMaster v2 TERMINE (Kimi 9/10). Corps S1-S6 A FAIRE (ordre : S6->S3->S4->S1->S5->S2).

---

## Regles Critiques Transversales

- Audio startFrame INTOUCHABLE — derive de mesures ffprobe
- NO EMOJIS dans .ts/.tsx/.js/.json/.yaml
- OffthreadVideo : toujours muted, toujours dans Sequence from={BEATS.xxx.start}
- Seedance : format SECONDS X TO Y standard, 1 ref max si persos similaires, "gradually" anti-artefact
- Audio Seedance = TOUJOURS remplacer narration (garder SFX/musique a -12dB)
- Gemini retouche chirurgicale avant de regenerer
- Reference complete regles Seedance : `memory/seedance-reference.md`
