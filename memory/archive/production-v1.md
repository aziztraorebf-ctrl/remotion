# Archive — Production V1 (pre-Seedance era + early Seedance discovery)
> Archive le 2026-03-31. Contenu deplace de COMPACT_CURRENT.md pour alleger.

---

## Projet Thiaroye 1944 — CLOS (validation pipeline uniquement, pas production)

### Contexte — Pourquoi ce projet maintenant
Test complet du pipeline batch Short YouTube : Gemini 3x3 storyboard -> Kling image-to-video -> ElevenLabs voix-off -> Remotion assemblage. Sujet choisi : verdict historique du 27 mars 2026 (Cour de cassation condamne l'Etat francais pour dissimulation des circonstances du massacre de Thiaroye 1944). Sujet d'actualite brulante, narrativement fort, ideal pour valider toute la chaine de production.

### Assets produits — TOUS VALIDES

**Storyboard :**
- `public/assets/library/geoafrique/thiaroye-1944/thiaroye-storyboard-grid-v2.jpg` — grille 3x3 Gemini sans texte/chiffres (v1 contenait des lignes et dates -> rejetee)

**Frames extraites (9 crops 336x336) :**
- `frames/frame-01.jpg` a `frame-09.jpg` — crops automatiques via PIL
- `frames/frame-04-diverse.jpg` — version diversifiee via Gemini editorial (visages distincts)

**Clips Kling — VALIDES (sauf F5 abandonnee) :**

| Clip | Modele | Statut | Notes |
|------|--------|--------|-------|
| frame-01-final.mp4 | V3 Pro | VALIDE | Mains + cachet de cire. Crop a 1.5s pour supprimer bordures blanches initiales |
| frame-02.mp4 | V3 Std | VALIDE | Camp Thiaroye vide, palmiers, sable -- excellent |
| frame-03.mp4 | O3 Std | VALIDE | Rangee tirailleurs, vent dans vetements -- acceptable |
| frame-04-v2.mp4 | O3 Std | VALIDE | Profils soldats diversifies (Gemini edit -> Kling) -- excellent |
| frame-05.mp4 | O3 Std | ABANDONNEE | Visages identiques + pose bizarre. Remplacer par carte Remotion pur |
| frame-06.mp4 | O3 Std | VALIDE | Silhouettes + fumee + eclairs -- un des meilleurs |
| frame-07.mp4 | V3 Pro | VALIDE | Mains vieillies sur table, lumiere -- excellent |
| frame-08.mp4 | V3 Std | VALIDE | Veteran dos a l'ocean, vagues -- quasi parfait |
| frame-09.mp4 | V3 Pro | VALIDE | Portrait descendante, lumiere doree, sourire -- excellent |

**Audio voix-off :**
- `thiaroye-voixoff-v6.mp3` — **VERSION FINALE** (110s)
- Voix : Narratrice GeoAfrique V3 `Y8XqpS6sj6cx5cCTLp8a`, stability 0.25, style 0.40, speed 0.88
- CTA final : "L'Afrique a une histoire qu'on t'a cachee -- et une actualite qu'on te simplifie. Le lien en bio."

### Assemblage Remotion — TERMINE

**Composant :** `src/projects/geoafrique-shorts/ThiaroyeShort.tsx`
**Composition :** `ThiaroyeShort` — 1080x1920, 30fps, 3302 frames (110s)
**Render :** `out/thiaroye-short-full.mp4` (59 MB, 110s) — vu par Aziz

**Etat :** Le render est fonctionnel mais les timings clips/audio ne sont PAS cales finement. Les clips sont en slow-motion force (playbackRate 0.29-0.50) car generes en 5s pour des segments de 10-20s. Le but etait de valider le pipeline, pas de produire la version finale.

### Test mouvement dynamique — TERMINE

**Constat :** Les prompts "atmospheric movement only" causent quasi-immobilite. Kling n'a PAS de parametre motion intensity -- tout passe par le prompt.
**Clips :** `clips/dynamic-A.mp4`, `clips/dynamic-B.mp4`

### Industrialisation — SKILL v2 (sessions 29-30 mars 2026)

**Quoi :** Skill `batch-short-production` dans `.claude/skills/batch-short-production/`
**Pipeline final (9 phases) :**
```
1. Kimi script review (iterer -> script LOCKED)
2. Audio ElevenLabs
3. Timing ffprobe
4. Kimi storyboard direction (script time-code -> multi-shots avec secondes)
   + Pass 3 simplification (max 3 persos, 1 focal, zero texte/gore, cartes vierges)
5. Storyboard Gemini (frames INDIVIDUELLES, pas de grille)
6. Clips I2V
7. Corrections
8. Assemblage Remotion
9. Review & delivery
```

### Lecons pipeline apprises cette session

| Lecon | Detail |
|-------|--------|
| Audio-first OBLIGATOIRE | On a fait les clips avant l'audio -> durees non calees. Pipeline correct : Script -> Audio -> ffprobe -> Storyboard Gemini (1 frame/beat avec duree cible) -> Kling clips (duration = duree beat) -> Assemblage Remotion |
| Format Long Short valide | 110s acceptable pour sujets historiques complexes. 60s strict = max 70-75 mots script avec cette voix |
| NO TEXT dans frames Gemini | Toujours regenerer si texte/chiffres visibles -- Kling anime le texte et ca produit des artefacts |
| Diversification visages via Gemini | Gemini editorial sur frame source AVANT Kling = solution au probleme "clones" de la grille 3x3 |
| Voix lente = gravitas | La narratrice V3 a speed 0.88 donne un ton documentaire excellent mais allonge tout script de ~40% |
| Duree clips = duree beats | Kling supporte `duration: "10"`. Generer des clips de 10s pour beats de 12s (playbackRate 0.83x) au lieu de 5s ralentis a 0.42x |
| Prompts dynamiques, PAS "atmospheric" | "atmospheric movement only" = quasi-immobilite. Pour du mouvement : verbes d'action, camera cues. JAMAIS "subtle", "gentle" sauf volonte explicite de calme |

---

## Infrastructure : Vercel Blob Asset Gallery (2026-03-27, OPERATIONNEL)

### Ce qui a ete mis en place
- **Projet Vercel** : `remotion-assets` (prj_rrLqyQtJVr3T4npZNH0o2U0JEcxq)
- **Blob store public** : `store_T6oLmi2NlOe9nhkg` — liens permanents, pas d'expiration
- **Base URL** : `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/`
- **Script** : `scripts/upload-to-blob.py` — upload solo, gallery HTML mixte (images+audio+video), listing
- **Token** : `BLOB_READ_WRITE_TOKEN` dans `.env`
- **Valide sur mobile** : images PNG + audio MP3 + page gallery HTML -- tout fonctionne sur iPhone Safari

### Comment utiliser
```bash
# Upload un fichier
python scripts/upload-to-blob.py fichier.png --folder images

# Gallery mixte (images + audio + video sur une page)
python scripts/upload-to-blob.py --gallery "Titre Review" img1.png img2.png audio.mp3 --folder review/date

# Lister les fichiers
python scripts/upload-to-blob.py --list
```

### Decisions cette session

| Date | Decision | Pourquoi | Impact |
|------|----------|----------|--------|
| 2026-03-27 | Blob store public (pas prive) | Les URLs doivent etre accessibles sans token depuis un telephone | Store supprime et recree en mode public |
| 2026-03-27 | Script Python (pas MCP Vercel) pour uploads | Le MCP Vercel blob_put ne fonctionne pas (erreur 403 token) + base64 pas pratique pour gros fichiers | Script standalone plus fiable |
| 2026-03-27 | Gallery HTML uploadee sur le Blob store | Besoin de mixer images+audio+video dans un seul lien reviewable sur mobile | Page HTML statique = zero backend |
| 2026-03-27 | Projet renderer separe (Option A) | Notre projet Remotion est un Studio pur sans Next.js. Le template-vercel requiert Next.js. Dupliquer le code serait complexe. | Nouveau repo `remotion-renderer` |

---

## Seedance 2.0 — Decouverte & Tests (2026-03-28 -> 2026-03-31)

> Reference complete de tous les tests et regles : `memory/seedance-reference.md`

### Tests effectues (9 tests, 9 succes)

- **Test 2** : Abou Bakari trone royal, 15s, 720p. Zero morphing, style Recraft maintenu, dolly parfait.
- **Test 3 (8.5/10)** : Format "SECONDS X TO Y" + COLOR GRADE. Proue navire, 10s. Coherence personnage PARFAITE.
- **Test 4 (9.5/10)** : Gestes + micro-expressions. Trone interieur palais, 10s. MEILLEURE GENERATION TOUS OUTILS CONFONDUS. Micro-animations d'acting validees.
- **Test 5 (10/10)** : POV -> 3e personne + flotte. MEILLEURE GENERATION ABSOLUE. Transition POV -> 3e personne sans coupure. 30+ navires style 2D flat coherent.
- **Test Orbite 180 (9.5/10)** : Orbite clockwise, coherence parfaite multi-angle.
- **Test Bataille (10/10)** : Duel Abou Bakari vs Amanirenas. 2 personnages en combat sans fusion.

### Recherche — Patterns de prompts
- Reference complete : `research/seedance-examples/REFERENCE.md`
- 3 formats valides : Narratif lineaire (~40 mots), Storyboard numerote (~75 mots), Timecodes SECONDS X TO Y (~200 mots)
- COLOR GRADE en fin de prompt, "gradually" = anti-artefact, POV -> 3e personne = game changer

### Decisions Seedance

| Date | Decision | Impact |
|------|----------|--------|
| 2026-03-31 | Seedance = outil PRINCIPAL GeoAfrique | Kling relegue a 4K/API uniquement |
| 2026-03-31 | Format SECONDS X TO Y = standard | Utiliser pour TOUS les clips narratifs |
| 2026-03-31 | SFX/musique Seedance = reutilisable | Garder piste audio Seedance a -12dB + overlay ElevenLabs |
| 2026-03-31 | Audio narration = toujours remplacer | Strip audio + overlay ElevenLabs dans Remotion |
| 2026-03-31 | 1 ref max si personnages similaires | Decrire soldats par texte |
| 2026-03-31 | "gradually" = mot-cle anti-artefact | Toujours inclure dans segments reveal |

---

## Exploration Style : Hannibal Vivid Flat 2D (2026-03-17, SESSION COMPLETE)

### Ce qui a ete produit
- **Clip 1 VALIDE** : `tmp/brainstorm/references/hannibal-o3-final-8s-VALIDATED.mp4` — Hannibal face->dos, armee apparait, 8s
- **Clip 2 MASTERPIECE** : `tmp/brainstorm/references/hannibal-army-appear-MASTERPIECE.mp4` — solo->armee de dos, 10s
- **Portrait REF CANONICAL** : `tmp/brainstorm/references/hannibal-portrait-REF-CANONICAL.png`
- Style IDs : cold (mint) `223aba34-6d9f-4d0a-a7a7-5b96ca9add8b` / warm (gold) `f5063f81-e1e8-4a2e-becc-0895841573a8`

### Lecons pipeline vivid flat 2D
- Start + end frame OBLIGATOIRE pour styles flat
- Regle ecart start->end : meme espace visuel, changer UN seul element
- Frame chaining : derniere frame clip -> Gemini edit -> start frame suivant
- Gemini 3.1 Flash = outil correction chirurgicale

---

## GeoAfrique V1 — Abou Bakari Short (Kling era, TOUS BEATS COMPLETES)

### Fichiers cles
- Code : `src/projects/geoafrique-shorts/AbouBakariShort.tsx`
- Timings : `src/projects/geoafrique-shorts/timing.ts` (derive Whisper V5)
- Audio principal : `public/audio/abou-bakari/abou-bakari-v5-full.mp3` (83.08s, mute a 80.60s)
- Audio CTA : `public/audio/abou-bakari/beat09-cta.mp3` (5.76s)
- Voix : Narratrice `Y8XqpS6sj6cx5cCTLp8a` | stability: 0.32, similarity_boost: 0.75, style: 0.40, speed: 0.85

### Etat des beats — TOUS COMPLETES

| Beat | Clip/Approche | Statut |
|------|--------------|--------|
| Beat01 ocean | beat01-o3-pan-B-14s.mp4 | INTEGRE + VALIDE |
| Beat02 empire | beat02-o3-westlook-v1.mp4 | INTEGRE + VALIDE |
| Beat03 fleet | beat03-o3-fleet-v3.mp4 | INTEGRE + VALIDE |
| Beat04 name | beat04-kling-v2.mp4 | INTEGRE + VALIDE |
| Beat05 abdication | beat05-moussa-grandeur-v3.mp4 (P1) + beat05-plan2-caravan-v3.mp4 (P2) | INTEGRE + VALIDE |
| Beat06 obsession | beat06-obsession-v1.mp4 -- overlay "OUEST" | INTEGRE + VALIDE |
| Beat07 colomb | beat07-colomb-v1.mp4 -- dolly in, palette froide | INTEGRE + VALIDE |
| Beat08 close | Split screen Beat06+Beat07, ligne or, dates 1311/1492 | INTEGRE + VALIDE |
| Beat09 CTA | Remotion pur, audio beat09-cta.mp3 | INTEGRE + VALIDE |

### Beat details (archive)

**Beat05 assets :**
- Plan 1 Moussa : `beat05-moussa-grandeur-v3.mp4` (10s V3 Pro)
- Plan 2 caravane : `beat05-plan2-caravan-v3.mp4` (10s O3 cfg 0.3)

**Beat06 assets :**
- Clip : `beat06-obsession-v1.mp4` (5s V3 Std)
- Overlay : mot "OUEST" fantome (opacite 18%, fontSize 120)

**Beat07 assets :**
- Clip : `beat07-colomb-v1.mp4` (5s V3 Std dolly in)
- Overlays : "181 ans plus tard" + "Christophe Colomb" + `le "decouvreur".` en bleu-gris

**Beat08 technique :**
- Split screen div overflow:hidden (PAS clipPath inset -- ne marche pas avec OffthreadVideo)

**Audio mute technique :**
- Mute via `volume={(f) => interpolate(f, [MUTE_START, MUTE_END], [1, 0])}` sur composant Audio
- MUTE_START = frame 2418 (80.60s * 30fps)

### Prompt Suno musique (3 variants)
```
Variant A : [Instrumental] West African ambient, solo kora opening, slow mysterious atmosphere, builds gradually with djembe and dundun percussion, epic and grand at midpoint, slight tension and unresolved ending, cinematic documentary style, 85 bpm
Variant B : [Instrumental] African ambient instrumental, tribal percussion djembe shekere, haunting kora melody, builds to epic orchestral swell, then fades to cold sparse ending, documentary soundtrack, emotional and contemplative, 80 bpm
Variant C : [Instrumental] Minimalist African score, sparse kora plucks over deep bass drum, slow cinematic build, West African traditional instruments, emotional documentary underscore, unresolved suspended ending, 75 bpm
```

---

## Projet Amanirenas — Session 2026-03-18 (PIPELINE VALIDE — EN ATTENTE CREDITS)

**FORMULE VALIDEE (v8 "Desert Spear") :**
- Technique : Dolly-in optical
- Prompt : Gemini Kling Director ecrit les prompts
- cfg_scale : 0.45 (v8) -> tester 0.35 sur v9
- Sol sable uni OBLIGATOIRE

**ASSETS V9 PRETS :**
- Portrait REF : `tmp/brainstorm/references/amanirenas-portrait-REF-v3-oneeye.png`
- Warrior REF : `tmp/brainstorm/references/amanirenas-warrior-REF-v2-silhouette.png`
- Startframe : `tmp/brainstorm/references/amanirenas-startframe-v3-sol.png`
- Endframe : `tmp/brainstorm/references/amanirenas-endframe-v5-sol.png`
- Script v9 : `scripts/test-amanirenas-kling.py`

**LECONS CRITIQUES :**
1. Sol riviere = cause racine de tous les morphings
2. Prompt "slow/steady/gently" = zero animation
3. "Explode from both sides" = collision garantie en 9:16
4. Gemini Kling Director > Claude pour les prompts Kling
5. Oeil avec shape anatomique = animable par Kling (surface plate + X seulement)
6. cfg_scale 0.35 recommande pour v9

---

## Technique elements — PROUVEE (2026-03-17)

**Clip reference** : `tmp/brainstorm/hannibal-elements-v1.mp4` — 9.5/10 Kimi
**Script** : `scripts/test-hannibal-elements-v1.py`
**Assets** :
- Hannibal REF : `tmp/brainstorm/references/hannibal-portrait-REF-CANONICAL.png`
- Soldat type REF : `tmp/brainstorm/references/hannibal-soldier-type-REF.png`
- Element3 crop = main visible PROUVE (v3)

---

## Prochains tests prioritaires (archive)

| Priorite | Test | Pourquoi |
|----------|------|----------|
| 1 | Amanirenas avec elements | Appliquer technique prouvee |
| 2 | Multi-shot prompting | 1 generation = 2 plans distincts |
| 3 | Seedance gestes + expressions | Micro-animations + lip sync + camera |
| 4 | Seedance motion pure sans audio | Mouvement corporel sans lip sync |
