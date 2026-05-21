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

## R&D — Atlas Blueprints Library — 2026-05-14 [COMPLETE]

8 blueprints codés, rendus et validés visuellement en session autonome :
- `walk-to-destination` — walk cycle + zoom spring vers POI
- `confrontation` — 2 persos depuis bords opposés face-à-face
- `orbital-city` — rotation + drift caméra autour du POI
- `zoom-revelation` — pull-back 4x→1x depuis détail vers carte globale
- `shake-impact` — secousse caméra sin multifréquence + flash + decay
- `alliance` — convergence diagonale + cercle doré accord
- `empire-expansion` — strokeDashoffset path empire + fill fade
- `flashback` — filtre sepia CSS + skew + vignette sépia (★ le plus impressionnant)

Dossier : `src/projects/atlas/_blueprints/` — README.md complet avec gotchas.
Compositions enregistrées dans Root.tsx sous Folder `atlas-blueprints` (Atlas-BP-*).
Renders preview dans `out/templates-souverain/_dev/bp-*.mp4`.

Gotcha majeur découvert : `AtlasMercator` utilise `countries` (pas `data`) + `centerOffsetX/Y`.
Données atlas : `atlasData.mercWide.countries` (pas `atlasData.countries`).

---

## HANDOFF LOG (sessions actives)

## Stage 1 — audio-director — RDC No Sense — 2026-05-17 [COMPLETE]

- Project: geoafrique-shorts/rdc-no-sense
- Script: src/projects/geoafrique-shorts/rdc-no-sense/SCRIPT.md (LOCKED)
- Narration (déjà existante, non retouchée): audio/narration-v1.mp3 — 178.40s, voix Narratrice GeoAfrique v2
- Musique générée: audio/music-v1.mp3 — Minimax v2.6, 190.8s, documentary ambient sober (synth pads + light african percussion, no kora/djembe)
- Mix final: audio/final-mix.mp3 + audio/final-mix.wav — 180.00s exact, 192kbps stéréo 48kHz
- Levels: mean -19.5 dB, peak -2.8 dB (pas de clipping), narration 0.95, music ~0.10 + sidechain ducking ratio 8:1
- Layout: 1.0s music pure → narration entre (delay 0.8s pour aligner 1er mot à t=1.0s) → 0.8s tail silence → 180s total
- Fades: music fade-in 2s, fade-out 3s
- Coût: ~$0.30 (1 appel Minimax)
- Handoff → storyboarder: mix prêt. Storyboarder en cours en parallèle peut utiliser narration-v1.mp3 + whisper.json (déjà mesurés). final-mix.mp3 destiné au remotion-composer pour <Audio> de la composition finale.

### Niger Uranium (Souverain) — [COMPLET — PRET-PUBLICATION]

- Project: souverain/niger-uranium
- Fichier livrable : out/PRET-PUBLICATION/niger-uranium-FINAL.mp4
- Audio: narration-niger-uranium-v5.mp3 | 96.04s @ 30fps | 7 beats
- Status: PUBLIÉ — aucune action requise

---

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

---

## Or Africain (Souverain) — [COMPLET — PRET-PUBLICATION]

- Project: souverain/or-africain
- Fichier livrable : out/PRET-PUBLICATION/or-africain-FINAL.mp4
- Audio: narration-or-africain-FINAL.mp3 | 101.0s @ 30fps | 6 beats
- Status: PUBLIÉ — aucune action requise

---

## Stage 2 — Storyboarder — Vraie Taille de l'Afrique — 2026-05-11 [COMPLETE]

- Project: souverain/vraie-taille-afrique
- Script: La vraie taille de l'Afrique | Version: LOCKED 2026-05-11
- Audio: 5 fichiers narration-beat{1-5}.mp3 | Mesurés via ffprobe | FPS: 30
- Format: BEATS flat (Format A) — 5 beats | Short Souverain ~65s | 1080x1920 vertical
- Output: src/projects/souverain/vraie-taille-afrique/timing.ts
- Beat count: 5 | Acts: N/A
- DURATION_IN_FRAMES: 1950 | TOTAL_SECONDS: 65.0s
- Validations PASS: R1 (beat5.from+dur===1950), R2 (zero gap), R3 (VO contenue fenêtre), R4 (tous beats >=30f)
- Constantes exportées: AUDIO_SEGMENTS, BEATS, BEAT{1-5}_START, BEAT{1-5}_VO_END, BEAT{1-5}_SILENCE_FRAMES

| Beat | Fenêtre | VO | Silence post-VO | Notes |
|------|---------|-----|-----------------|-------|
| beat1 | 0–150f (5s) | 110f (3.68s) | 40f (1.33s) | Carte Mercator statique, hold |
| beat2 | 150–750f (20s) | 166f (5.52s) | 434f (14.47s) | Animation silhouettes USA/Chine/Europe/Inde |
| beat3 | 750–990f (8s) | 89f (2.96s) | 151f (5.03s) | Chiffre 30,3M km² + hold silhouettes |
| beat4 | 990–1740f (25s) | 684f (22.80s) | 66f (2.20s) | Explication biais Mercator, VO longue |
| beat5 | 1740–1950f (7s) | 36f (1.20s) | 174f (5.80s) | Punchline finale, hold Afrique plein écran |

- Status: LOCKED — READY FOR STAGE 3 (visual-producer)

---

## Silicon Savannah (Souverain) — 2026-05-19 [FINAL — PRÊT PUBLICATION]

- Fichier : `out/PRET-PUBLICATION/silicon-savannah-FINAL.mp4` — 49.1 MB, 122.1s — VALIDÉ AZIZ
- Beat3 redesigné : courbe épurée + Nokia centré + 3 badges (300k / 50M+ / 1ER MONDIAL)
- Beat2 : `beat2/Beat2.tsx` data-driven (Mapbox retiré de la full composition)
- Sous-titres : SubtitleBar permanent sur beats 2-3-4-5-6
- Timings : offsets audio-dérivés depuis manifest SEG (3662f = narration exacte, plus de silence final)

---

## Stage 1 — Audio Director — Zimbabwe Lithium — 2026-05-15 [MUSIC COMPLETE — AZIZ VALIDATION PENDING]

- Project: souverain/zimbabwe-lithium
- Narration existante: public/souverain/zimbabwe-lithium/audio/narration-zimbabwe-v1.mp3 | 86.0s
- Musique generee: 3 variantes Shona/Ndebele (Zimbabwe) — fal-ai/minimax-music/v2.6
  - music-A-contemplatif.mp3 — 126.6s — Solo mbira + marimba, style Stella Chiweshe
  - music-B-geopolitique.mp3 — 227.6s — Mbira dzavadzimu + ngoma, style Forward Kwenda
  - music-C-tension.mp3 — 255.8s — Mbira + hosho, style Dumisani Maraire
- Cout: ~$0.30 (3 x $0.10)
- Script generation: scripts/tools/minimax-zimbabwe-music.py
- Prochaine etape: Aziz ecoute les 3 variantes → choisit → integration Remotion-native (volume 0.07 si SFX, 0.15 si narration seule)
- Note: Timing.ts Zimbabwe a des decalages documentes dans PRODUCTION-ZIMBABWE-DETTES.md — a corriger avant assemblage final

## La Peste et le Sahara 1347 (Atlas pur) — 2026-05-16 [IN PRODUCTION — BEAT 3 NEXT]

**PROJET ACTIF — lire en premier**

- Project: atlas/peste-1347
- Format: Atlas pur (SVG 2D Mercator d3-geo, pas de Mapbox, pas de Tailwind)
- Script: LOCKED — Angle A "Sahara comme bouclier" — 211 mots
- Audio: public/atlas/peste-1347/audio/narration-v1.mp3 | 105.12s | 3153 frames @30fps
- Timing: src/projects/atlas/peste-1347/timing.ts (BEATS/PIVOTS/STATS/CITIES/ROUTES — LOCKED)
- Musique: public/atlas/peste-1347/audio/music-c-desert.mp3 (vol 0.04)
- Carte: public/atlas/peste-1347/geo/peste-map-data.json (4 vues: mercLarge/mercEurope/mercMali/mercSahara)
  - Fix appliqué 2026-05-16 : Natural Earth ISO_A3=-99 → fallback ADM0_A3 (France maintenant présente)

### État beats (ordre séquentiel obligatoire)
| Beat | Frames | Durée | Statut |
|------|--------|-------|--------|
| Beat1 Hook | f2→f225 | 7.5s | ✅ FINAL — `out/episodes/peste-1347/beat1-FINAL.mp4` |
| Beat2 Setup Géo | f241→f690 | 15s | ✅ FINAL — `out/episodes/peste-1347/beat2-FINAL.mp4` |
| Beat3 Densité Cesar | f714→f1223 | 17s | ✅ FINAL — `out/episodes/peste-1347/beat3-FINAL.mp4` |
| Beat4 Climax Bouclier | f1241→f2291 | 35s | ✅ FINAL — `out/episodes/peste-1347/beat4-FINAL.mp4` |
| Beat5 Mali Vivant | f2323→f2974 | 21s | ⏳ À CODER (PROCHAINE SESSION) |
| Beat6 Punchline | f2975→f3152 | 6s | ⏳ À faire |

### Règles techniques validées cette session (NON-NEGOTIABLE pour Beat3+)
1. **makeMapCoord(W, H, scale, driftX, driftY)** — helper obligatoire pour tous les markers/labels. Copier depuis Beat2Setup.tsx. Jamais `poi.x + driftX` seul.
2. **Audio endAt** : `endAt={BEATS.X_START + BEATS.X_END}` — pas `endAt={BEATS.X_END}`
3. **Volume callback** : `const lf = f - beatStart` à l'intérieur — `f` est global
4. **`<image href>` SVG natif** — jamais `<Img>` Remotion dans un `<svg>`
5. **Ordre codage** : séquentiel Beat3 → Beat4 → Beat5 → Beat6. Pas de saut.

### Assets PixelLab disponibles
- Mansa Souleymane (eb3d1a3e) — walk east+west 6f
- Souleymane trônant (cb6d0d56)
- Rat noir (e2e541a8) — 32x32
- Bateau génois (0d101547) — 64x48 (utilisé Beat2)
- Mosquée Tombouctou (53d88ecb) — 64x64
- Ville européenne deuil (8b6e61d2) — 64x48
- Marchand berbère assis (e2e06a90) — 4 rotations

### Beat3 — ce qui est prévu
- Narration: "En Angleterre : 46% de la population meurt. 4,8M → 2,6M. Au Caire : 7000 morts/jour."
- Vue carte: mercEurope (zoom Europe, scale=700, center=[12,48])
- Triggers: f718 (46%), f840 (4.8M), f926 (2.6M), f1105 (Le Caire 7000/j)
- Style: cartouches stats impactantes (rect noir + chiffre blanc bold)

---

## Sénégal Pétrole & Gaz (Souverain Mid-form) — 2026-05-19 [STAGE 2 IN PROGRESS]

- Project: souverain/senegal-petrole-gaz
- Format: Mid-form 6-7 min | 1920x1080 16:9 | 30fps
- Script: memory/episodes/souverain/senegal-petrole-gaz/SCRIPT-V2.md — LOCKED
- Audio narration: memory/episodes/souverain/senegal-petrole-gaz/audio/senegal-petrole-elevenlabs-v1-auphonic.mp3 | 433.3s (7 min 13s) | ElevenLabs V3 + Auphonic denoise
- Stage 0 (Script): COMPLETE — V2-FINAL, jury 4 LLMs, fact-check Perplexity, 2 corrections appliquées
- Stage 1 (Audio): COMPLETE — ElevenLabs z3gESu49naEZW8Af2Upm + Auphonic polish. Minimax neutral généré aussi (comparatif A/B, ElevenLabs retenu)
- Stage 2 (Storyboard): COMPLETE → timing.ts livré, 7 beats, R1-R4 validés
  - Fichier: src/projects/souverain/senegal-petrole-gaz/timing.ts
  - 12998 frames @ 30fps | 433.252s | Forced alignment 1924 mots, loss 0.219
  - 7 beats: acte1(0→1496) / acte2(1496→4177) / acte3_comp(4177→5907) / M1(5907→7334) / M2(7334→8993) / M3(8993→10584) / acte4(10584→12998)
  - Anchors clés: bigstatReveal=f752, contradictionBeat=f1064, pekinRegarde=f9973, maintenant=f12287
- Stage 3 (Visual Plan): NEXT → visual-producer

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

---

## MISE A JOUR INFRASTRUCTURE — SESSION 2026-05-13

### Agent Teams activés
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` dans `~/.claude/settings.json`
- /goal et /bg disponibles en session interactive Claude Code
- Les agents peuvent se communiquer directement sans passer par Claude principal

### Règles budget API — fichier source
- `.claude/agents/API-BUDGET-RULES.md` — lire AVANT tout appel payant
- `scripts/check-api-balance.sh` — vérifier balances avant génération
- Balances 2026-05-13 : ElevenLabs 54 425 chars | PixelLab $4.94 USD

### MEMORY.md des 5 agents mis à jour
Tous les agents ont maintenant la section "NOUVEAUTES SESSION 2026-05-13" avec :
- Règles budget API par agent
- Référence check-api-balance.sh
- Confirmation Agent Teams + /goal /bg

### Session Start orchestrateur (nouvelle règle CLAUDE.md)
Claude principal doit lire PIPELINE.md en DEBUT de session — ajouté dans CLAUDE.md projet.

### Episodic Memory plugin
- `episodic-memory@superpowers-marketplace` activé dans settings.json (était false)
- Permet aux agents d'utiliser le MCP structuré pour lire/écrire leur mémoire
- Attention : source de vérité reste les fichiers .md — episodic memory = complément, pas remplacement


## Atlas Mansa Moussa V2 - Phase 3 production
Stage 1.8 — Storyboarder [BYPASSED — timing-mansa-moussa-v2.ts already validated, scenes coded directly]


Stage 1.8 — Storyboarder [COMPLETE — Atlas V2 timing-mansa-moussa-v2.ts produced]



CIRCUIT BREAKER RE-OPEN: AtlasV2S1Scene.tsx — Ajout vie sur scene S1 (slow push-in 1.35->1.55 + tilt qui respire +/-2deg + halo Mali pulse plus tot a 5s). Nouveau brief : eviter statisme entre 11s et 19s. Validation visuelle BLOC 1 confirme par Aziz, ces ajouts sont des micro-mouvements sur acquis valides.

---

## RDC No Sense — Project — 2026-05-17 [IN PROGRESS]

**Sujet** : "Pourquoi la geographie de la RDC n'a aucun sens ?" — Short style Jacq Adi
**Format** : 1920x1080 (16:9) — 30fps — 5400 frames (180s)
**Audio mix** : final-mix.mp3 (narration ElevenLabs GeoAfrique v2 + musique Minimax) — 180.00s exact
**Composition ID** : `RdcNoSenseFull`
**Entry-point** : `src/index-rdc.ts` (mini Root pour render rapide)

### Stage 0 — Script + Fact-check [COMPLETE]
- Script lock 380 mots, scan TTS ElevenLabs applique
- Fact-check Perplexity sonar-pro : 14 affirmations verifiees, 4 corrigees (superficie 2.345M km2, longueur Congo 4370km, 170M ha foret, 200+ langues prudence)

### Stage 1 — audio-director [COMPLETE]
- TTS ElevenLabs `z3gESu49naEZW8Af2Upm` ($0.076, 178.40s)
- Musique Minimax v2.6 documentary ambient sober ($0.30)
- Mix final 180.00s : narration + music ducking sidechain 8:1, fade in 2s / out 3s
- Whisper API OpenAI alignment word-level pour AUDIO_SEGMENTS

### Stage 2 — Storyboard + Manifest [COMPLETE]
- 8 beats audio-anchored : Hook / Taille / France×4 / Frontieres / Neuf / Berlin / Fleuve / Debit-Equateur / Foret / Diversite / Cobalt-Paradoxe / Chute
- AUDIO_SEGMENTS frame-precis depuis Whisper word timestamps

### Stage 3 — Composants nouveaux [COMPLETE]
Reutilisables pour 10+ episodes futurs :
- `MapboxSatelliteBeat` — wrapper satellite-v9 + highlight + slot children + lerp camera
- `CountryFlagFill` — drapeau remplit silhouette pays via SVG clipPath + d3-geo + Natural Earth
- `FlagPin` — drapeau circulaire bounce entry + float idle (flagcdn.com)
- `CountryStackComparison` — empiler silhouettes pays dans pays pivot (tailles relatives respectees)
- `useTopology` — hook chargement TopoJSON async avec delayRender

### Stage 4 — Code beats [COMPLETE]
- `RdcNoSenseFull.tsx` : 8 beats inline (1 fichier compact)
- Tailwind tokens + Bebas Neue + couleurs PALETTE (gold/orange/navy/cream/forest/river)
- countUp helpers, spring entries, fade-out final 30f
- `timing.ts` + `constants.ts` + `STORYBOARD.md` documentation complete

### Stage 5 — Render local [IN PROGRESS]
- `npx remotion render RdcNoSenseFull ... --gl=angle --concurrency=1 --timeout=180000 --public-dir=/tmp/public-rdc`
- Mini public-dir 13MB (extrait depuis 2.4GB principal) pour bundle rapide
- Entry-point isole `src/index-rdc.ts` (evite bundle des 200+ compos Root.tsx)
- Output : `out/episodes/rdc-no-sense/wip/rdc_v1.mp4`
- Duree attendue : ~30min (5400 frames @ ~3-5fps render rate)

### Stage 6 — Upload + livraison [PENDING]
- Upload catbox (si <200MB) ou litterbox 72h
- ntfy Aziz avec URL + resume
