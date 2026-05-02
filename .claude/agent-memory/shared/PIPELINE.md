# Production Pipeline — Shared Workspace (5 agents)

> Fichier partage. Chaque agent ecrit sa section lors de son invocation.
> Claude principal orchestre les handoffs.
> **Recree 2026-04-22** : l'ancien fichier (2881 lignes, Peste 1347 + 6 anciens agents)
> a ete archive dans `.claude/agent-memory/archive/PIPELINE-obsolete-peste-6agents.md`.

---

## Agent Team (5 agents — refonte 2026-04-13)

1. **audio-director** — Narration TTS (ElevenLabs V3) + musique (Minimax v2.6) + mix
2. **storyboarder** — Script + audio mesure → `timing.ts` frame-precis
3. **visual-producer** — Assets multi-outils (Gemini, Seedance, Kling, Recraft, fal.ai, PixelLab)
4. **remotion-composer** — Composition Remotion + mini-render validation
5. **quality-reviewer** — Review multi-dimensions + verdict

**Anciens agents archives** : creative-director, pixel-art-director, pixellab-expert, kimi-reviewer, visual-qa (remplaces par visual-producer + quality-reviewer).

---

## Pipeline Stages

```
Stage 0  Claude + Aziz       → Script locked
Stage 1  audio-director      → Narration + musique + mix (scan TTS bloquant)
Stage 2  storyboarder        → timing.ts frame-precis (audio mesure)
Stage 3  visual-producer     → Visual Plan proposal → Aziz approuve
Stage 4  visual-producer     → Assets generes (preview-before-pay)
Stage 5  remotion-composer   → Composition + mini-render 3-4s bloquant
Stage 6  quality-reviewer    → Review multi-dim + Kimi + verdict
Stage 7  Aziz                → Validation finale (oreille + oeil + decision creative)
Stage 8  Claude (main)       → Render final OU fix iteration
```

**Regles du pipeline** :
- Stage 1 prerequis : script LOCKED par Aziz
- Stage 2 prerequis : audio existe ET mesure (ffprobe ou forced alignment)
- Stage 3 prerequis : Aziz approuve Visual Plan AVANT toute generation
- Stage 4 regle : preview-before-pay pour CHAQUE appel API payant
- Stage 5 prerequis : mini-render validation AVANT de coder d'autres scenes
- Stage 6 regle : self-review AVANT Kimi, jamais l'inverse

---

## HANDOFF LOG (sessions actives)

### 2026-04-30 — Abou Bakari II : Stage 2 Storyboarder [COMPLETE]

**Stage 2 (storyboarder)** :
- Project: abou-bakari-ii
- Script: Abou Bakari II | Version: LOCKED 2026-03-14
- Audio narration: public/audio/abou-bakari/abou-bakari-narratrice-v1.mp3 | Measured: 82.80s @ 30fps
- Audio CTA: public/audio/abou-bakari/beat09-cta.mp3 | Measured: 12.16s
- Forced-alignment source: public/audio/abou-bakari/abou-bakari-alignment.json (316 entries)
- Whisper source: src/projects/geoafrique-shorts/whisper-words-abou-bakari.ts (228 mots)
- Output timing: src/projects/geoafrique-shorts/timing-abou-bakari.ts
- Format: BEATS flat (9 beats, order = timeline = narration order)
- Beat count: 9 | Acts: N/A
- TOTAL_FRAMES: 2849 | TOTAL_SECONDS: 94.96s

**Points d'attention pour remotion-composer** :
- `fleet_a` (beat03) = clip AUDIO OFF, narration track reste active dessous
- `fleet_b` (beat04) = seulement 34 frames (1.133s) — "On ne passe pas." seulement
  Le clip fleet-b-v1.mp4 fait 6.06s mais la narration ne dure que 1.1s.
  Le composer doit decider : couper le clip strict a 34f OU etendre le beat visuellement.
- `name` (beat05) = silence 1.580s en fin de beat (absorbe dans le beat) = respiration avant "Son demi-frere"
- `abdication` (beat06) = 2 plans : abdication-v1.mp4 (10.04s) + caravane extract ~4s
- `close_cta` (beat09) = 2 phases : narration close (frames 2383-2484) puis CTA audio (frames 2484-2849)
  `narrationEndFrame: 2484` est dans le beat pour declencher le switch visuel

**Whisper WHISPER_WORDS_ABOU_BAKARI** :
- Export name: `WHISPER_WORDS_ABOU_BAKARI`
- Quelques fragments d'elision (l', n', qu') presents — le composant Subtitles.tsx les affiche tels quels
- Highlight color: #FFD84A (or — meme que Sonjata)



### 2026-04-30 — Abou Bakari II : Stage 5 Remotion Composer [COMPLETE]

**Stage 5 (remotion-composer)** :
- Project: abou-bakari-ii
- Composition: `AbouBakariShort` (enregistree dans Root.tsx)
- Fichier principal: `src/projects/geoafrique-shorts/AbouBakariShort.tsx`
- Timing source: `src/projects/geoafrique-shorts/timing-abou-bakari.ts` (BEATS, FPS, TOTAL_FRAMES)
- FPS: 30 | Duration: 2849 frames = 94.96s
- Composants: 9 beats (Beat01Ocean → Beat09CloseCTA, tous dans AbouBakariShort.tsx)
- Audio pistes:
  - Narration: `audio/abou-bakari/abou-bakari-narratrice-v1.mp3` (Sequence 0 -> 2484f, volume 1.0)
  - Musique: `audio/abou-bakari/music/variante-C-epique-balafon-djembe.mp3` (fade-in 2s / fade-out 2s, volume 0.07)
  - CTA audio: inclus dans Beat09CloseCTA via `<Sequence from={narrationEndLocalF}><Audio .../></Sequence>`
- Sous-titres: `WHISPER_WORDS_ABOU_BAKARI` via `Subtitles` component, highlight `#FFD84A`, tous beats sauf close_cta phase B
- Globe animation: copié dans `public/assets/abou-bakari/abou-bakari-final.mp4` (60MB)
- Root.tsx: import mis a jour → `TOTAL_FRAMES as ABOU_FRAMES` depuis `timing-abou-bakari.ts`
- Mini-render validé: `out/abou-bakari-mini-empire.mp4` (beat02 empire, frames 414-681, 8.93s, 14MB)
- Mini-render Vercel URL: https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/mini-renders/empire-with-subs-v1-mqVuzOwByIhF6KLnp4eXQ5rW9CJyNx.mp4
- Validation visuelle: clip empire charge OK, sous-titres synchronises, highlight #FFD84A visible, audio AAC present
- Notes:
  - fleet_b (34f narration) etendu visuellement a 182f (6.06s naturel du clip) pour eviter flash
  - Beat09 split en 2 phases : narration close (101f split-screen) + CTA (365f texte cascade)
  - Tous `extrapolateRight: 'clamp'` presents, tous `premountFor={FPS}` presents
  - TS compile sans erreur sur AbouBakariShort.tsx

**Prochaine etape** : quality-reviewer peut lancer le review + render final.

---

### 2026-04-22 — Sonjata Session 8 : Hook + Musique (VALIDATION FINALE)

**Stage 1 (audio-director)** :
- Minimax Music 2.6 validee : endpoint `fal-ai/minimax-music/v2.6`, payload `{prompt, is_instrumental: true}`
- 3 variantes generees ($0.30) : Toumani Diabate / Sidiki Diabate / Neba Solo
- Formule validee : artiste + 1-2 instruments + "no synthesizers, no electronic sounds" + origine precise
- Anti-pattern confirme : "Epic West African orchestral cinematic" = sortie electronique
- Hook narration : 63 chars, 4.32s, config max-style, voix Narratrice GeoAfrique v2

**Stage 5 (remotion-composer)** :
- Hook 5s integre dans `SonjataShortFull.tsx` (Sequence from=0, durationInFrames=150)
- Option B validee : musique COMMENCE a scene 1 (frame 150), silence pendant hook
- `musicVolume(frame)` avec `interpolate` fade-in 2s + fade-out 2s, volume 0.15 (-16.5dB)
- Render 151s valide par Aziz

**Stage 7 (Aziz)** :
- Verdict : "tres bon, Short = cas d'ecole qui a rode le pipeline. Publiable pending CTA."
- Blocage unique : recharge credits ElevenLabs pour CTA
- Corrections post-publication optionnelles : scene 5A clip anime, normalisation audio, extension hook 5.5s

---

## PATTERNS VALIDES (cross-session)

### Hook Short (pattern teaser 5s)
- Clip muet extrait d'une scene existante (tension sans climax)
- Narration 2 phrases courtes, <14 mots, 4-5s total
- **Option B** : silence pendant hook, musique entre a scene 1 (contraste dramatique)
- Template : `memory/templates/hook-short.md`

### Musique Minimax 2.6
- Endpoint : `fal-ai/minimax-music/v2.6`
- Payload : `{"prompt": str, "is_instrumental": true}` (PAS de reference_audio_url)
- Formule prompt : artiste + 1-2 instruments + rythme precis + "no synthesizers"
- Cout : $0.10/gen, 3 variantes parallele = $0.30, ~6min
- Reference : `memory/tools/minimax.md`

### Narration ElevenLabs V3
- Voix Sonjata : `z3gESu49naEZW8Af2Upm` (Narratrice GeoAfrique v2, Voice Remix)
- Config max-style : `{stability: 0.22, similarity: 0.55, style: 0.55, speed: 1.0}`
- Scan TTS bloquant AVANT generation (participes "e/ee", "ont+voyelle", chiffres)
- Forced alignment apres generation (source de verite timing)

### Integration Remotion audio
- Volume musique : 0.15 (~-16.5dB, compatible regle projet -18dB sous voix)
- Fade-in 2s + fade-out 2s via `<Audio volume={frame => interpolate(...)}>`
- Reference implementation : `src/projects/geoafrique-shorts/SonjataShortFull.tsx`

---

---

## Stage 4 — Visual Producer [COMPLETE — Thiaroye V5 scenes 2-6]
- **Date** : 2026-04-24
- **Project** : thiaroye-1944
- **Scenes livrées** : 8 scenes x 2 variations = 16 images (+ 3 corrections = 19 appels total)
- **Assets** :
  - `public/assets/thiaroye-1944/scene2/scene2-source-v1{a,b}.png`
  - `public/assets/thiaroye-1944/scene3a/scene3a-source-v1{a,b}.png`
  - `public/assets/thiaroye-1944/scene3b/scene3b-source-v1{a,b}.png`
  - `public/assets/thiaroye-1944/scene4a/scene4a-source-v1{a,b}.png`
  - `public/assets/thiaroye-1944/scene4b/scene4b-source-v1{a,b}.png`
  - `public/assets/thiaroye-1944/scene5a/scene5a-source-v1{a,b-fixed}.png`
  - `public/assets/thiaroye-1944/scene5b/scene5b-source-v1{a,b}-v2.png` (regen sans texte)
  - `public/assets/thiaroye-1944/scene6/scene6-source-v1{a,b}.png`
- **Cout total** : ~$0.76 (16 gen x $0.04 + 3 fixes x $0.04)
- **Budget cumule** : $13.15 depense / $30 initial, restant $16.85
- **Dashboard** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/thiaroye-v5-dashboard/dashboard-bundled-tvBAGU73c18yglrIydagBZy7r3glpd.html
- **Nouveau gotcha** : scene5b gravures memorielles → Gemini genere TOUJOURS du texte lisible meme avec "NO readable text". Fix : demander pierre sans gravures.
- **Regenerations** : 3 (scene5a-B text removal + scene5b x2 regen sans texte)
- **CLIPS BATCH 2026-04-24** : 4 clips generés (4B→5A→6→3B), $10.20
  - `clips/s4b-tribunal-v1.mp4` (10s)
  - `clips/s5a-biram-memorial-v1.mp4` (10s)
  - `clips/s6-dakar-cote-v1.mp4` (7s)
  - `clips/s3b-aftermath-v1.mp4` (7s)
- **NEXT** : Aziz valide les 4 clips → scenes 2 et 3A à générer → assembly Remotion

---

---

## Stage 2 — Storyboarder — Abou Bakari II — 2026-04-25 (recalcul forced-alignment)
- Input : `public/audio/abou-bakari/abou-bakari-alignment.json` | ElevenLabs forced-alignment word-level
- Output : `src/projects/geoafrique-shorts/timing.ts`
- Format : BEATS flat (Format A) — 9 beats (ocean/empire/fleet/name/abdication/obsession/colomb/close/cta)
- FPS : 30
- AUDIO_DURATION_S : 82.760s (derniere valeur end du JSON alignment)
- TOTAL_FRAMES : 2483 | TOTAL_FRAMES_WITH_CTA : 2657
- Methode : start = start du 1er mot du beat, end = end du dernier mot (silences absorbes dans beat precedent)
- Notes : fleet 16.0s (inclut pause 3s entre "geant." et "On ne passe pas." — absorbee). empire 8.9s (plus court qu'attendu, Whisper vs forced-alignment).
- Status : LOCKED — READY FOR STAGE 3

---

---

## Stage 3 — Visual Producer — Abou Bakari II — 2026-04-26 (dashboard v1.3 analyse)

**Dashboard URL Vercel v1.3 FINAL** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/abou-bakari/dashboard/dashboard-bundled-v4UfsGc5wztLsTfbPgnt2HkfgPLcIt.html

**Status** : IMAGES TOUTES VALIDEES (8/8) | CLIPS PENDING | CTA = Remotion pur (pas de clip)

**Scenes + statuts** :
| ID | Titre | Duree | Status | Complement |
|---|---|---|---|---|
| ocean | Le Mur de Brouillard | 13.4s | image_validated | Video Extend 4s |
| empire | Le Roi des Rois | 8.9s | image_validated | non |
| fleet-a | Les Deux Mille Pirogues — Flotte | 10.0s | image_validated | non |
| fleet-b | Les Deux Mille Pirogues — Retour Capitaine | 6.0s | image_validated | non |
| name | Le Depart | 12.9s | image_validated | Video Extend 3s |
| abdication | Le Successeur | 13.3s | image_validated | Video Extend 4s |
| obsession | La Seule Obsession | 5.9s | image_validated | non |
| colomb | Cent Quatre-Vingt-Un Ans Plus Tard | 6.4s | image_validated | non |
| close_cta | La Question + CTA | 9.1s | pending (Remotion pur) | non |

**Prochaine etape : Stage 4 — generation clips Seedance**

---

## PROCHAINES SESSIONS

### Sonjata finalisation (post-recharge ElevenLabs)
1. CTA narration (~103 credits)
2. Unicode fix SonjataCTA.tsx
3. Integration scene 11
4. Render final + publication

### Pipeline hardening (avant Short #2 Abou Bakari)
1. Integrer `scripts/pipeline_gates.py` (13 gates) comme wrapper bloquant pour TOUT appel API
2. Diagnostic 2026-04-22 : gates existent mais pas integres → erreurs couteuses Sonjata auraient ete bloquees
3. Creer generic PREGEN_CHECKLIST (le Sonjata-specifique est dans `sonjata-papercraft/PREGEN_CHECKLIST.md`)


## Atlas Mansa Moussa V2 - Phase 3 production
Stage 1.8 — Storyboarder [BYPASSED — timing-mansa-moussa-v2.ts already validated, scenes coded directly]


Stage 1.8 — Storyboarder [COMPLETE — Atlas V2 timing-mansa-moussa-v2.ts produced]



CIRCUIT BREAKER RE-OPEN: AtlasV2S1Scene.tsx — Ajout vie sur scene S1 (slow push-in 1.35->1.55 + tilt qui respire +/-2deg + halo Mali pulse plus tot a 5s). Nouveau brief : eviter statisme entre 11s et 19s. Validation visuelle BLOC 1 confirme par Aziz, ces ajouts sont des micro-mouvements sur acquis valides.
