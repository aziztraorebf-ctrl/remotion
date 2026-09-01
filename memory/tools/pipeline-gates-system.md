# Systeme de Gates + Batch Runner

> Migré depuis auto-memory 2026-08-31 (créé 2026-04-17). Statut vérifié 2026-08-31 :
> `scripts/pipeline_gates.py` toujours présent et actif dans le repo. `batch_runner.py` et
> `notify.py` (Textbelt SMS) sont désormais dans `scripts/_archive/poc-veille-2026/` — probablement
> pas branchés dans le pipeline courant, à re-vérifier avant réutilisation.

## Systeme de Gates — 3 fichiers (à l'origine)

### scripts/pipeline_gates.py
Gates de validation pre-API. Chaque gate retourne PASS/FAIL + raison.

| Gate | Verifie | Pain point source |
|------|---------|-------------------|
| 1 prompt_structure | Longueur min adaptative (1000/<6s, 2000/>=6s), 3+ paragraphes, anti-artifact + "no music", style string | Prompts minimalistes rejetes (A/B test Acte IV 2026-04-16) |
| 2 canonical_ref | Ref canonique personnage present dans les inputs | Visual-producer a genere Soundjata from scratch au lieu du canon (2026-04-14) |
| 3 duration_match | clip_s >= ceil(narration_s), flag split si >15s | Gap 1.17s Acte VII force loop muette (2026-04-14) |
| 4 reverse_bias | Detecte mots declencheurs biais reverse Seedance ("tombe", "au sol", etc.) | Baobab qui se releve 3/3 tests (2026-04-09) |
| 5 seedance_inputs | Max 9 images, max 3 videos (cumul <=15s), max 3 audios, taille totale <=50MB, pas de "style" dans nom, chaining = image pas video | Styleref animee en plein clip (2026-04-10) + audit 2026-04-17 |
| 6 character_ref_context | Pas de fond neutre/blanc sur refs personnage | Seedance anime le fond blanc |
| 7 chain_continuity | Clip precedent existe + derniere frame extraite | Continuite inter-clips chaines |
| 8 fal_balance | Solde fal.ai suffisant avant batch | Crash silencieux 403 au milieu d'un batch (2026-04-14) |
| 9 tts_french_scan | Participes "e/ee", "ont+voyelle", chiffres dans script TTS | ElevenLabs drop accent final francais (regle CLAUDE.md) |
| 10 gemini_face_diversity | Marqueurs diversite (ages, morpho, expressions) si 2+ personnages | Visages clones 3x |
| 11 elevenlabs_params | Stability 0.20-0.55 (pas Robust), speed 0.82-1.0, style 0-0.50, model eleven_v3 | Audit 2026-04-17 |
| 12 character_age_continuity | Ref utilisee correspond a l'age declare + continuite avec actes adjacents | Acte II : baby ref utilisee pour garcon 7-8 ans (2026-04-17, $2.70 perdu) |
| 13 style_consistency | Storyboard doit avoir un sidecar .refs.txt prouvant qu'il a ete genere avec refs canoniques | Acte II : storyboard from scratch, Seedance copie le style sketch (2026-04-17, $2.74 perdu) |

Orchestrateurs : `pre_seedance_check(config)`, `pre_gemini_check(config)`, et `pre_elevenlabs_check(config)` executent les gates pertinents.

13 gates au total — couvrent Seedance, Gemini, ElevenLabs, fal.ai billing, continuite narrative, et style.

### scripts/notify.py (ARCHIVÉ — `scripts/_archive/poc-veille-2026/`)
SMS via Textbelt (fire-and-forget). 3 helpers : `notify_gate_block`, `notify_review_ready`, `notify_batch_complete`.
Env vars requises : `TEXTBELT_KEY` + `TEXTBELT_PHONE`.

### scripts/batch_runner.py (ARCHIVÉ — `scripts/_archive/poc-veille-2026/`)
Orchestrateur : lit manifest JSON, resout dependances, lance actes en parallele (max 3).
Clips chaines dans un meme acte = sequentiel (extraction derniere frame ffmpeg).
Mode `--dry-run` pour valider sans depenser.

## Pourquoi ce systeme

Analyse des 17 rejets de clips (2026-04-17) : 59% erreurs mecaniques evitables (prompt court, mauvaise ref, etc.). Les gates eliminent ces erreurs. Les 23% restants = jugement visuel Aziz (d'ou SMS + review mobile a l'epoque).

## Historique de correction (2026-04-17)

Toutes les corrections listées ci-dessous ont été appliquées à l'époque — à re-vérifier dans le
code actuel de `pipeline_gates.py` avant de s'y fier telles quelles (13 gates confirmées présentes
au moment de la migration, détail du contenu non re-audité) :
1. Gate 2 : path `soundjata` corrigé (canonical_ref)
2. Gate 1 : seuil adaptatif (<6s = 1000 chars min, >=6s = 2000 chars min)
3. Gate 8 : verification solde fal.ai integree dans pre_seedance_check
4. Gate 9 : TTS french scan (participes, "ont+voyelle", chiffres)
5. Gate 10 : Gemini face diversity (bloque si 2+ personnages sans marqueurs de diversite)
6. Appel Seedance API branché (`_call_seedance_api()` + `_upload_to_vercel_blob()` dans batch_runner.py — archivé depuis)
7. Agents connectés aux gates (instructions dans visual-producer/MEMORY.md et audio-director/MEMORY.md — à re-vérifier, agents ont été refondus depuis, cf `memory/projects/5-AGENTS-PRODUCTION-VIDEO-HISTORIQUE.md`)
8. Textbelt configuré (SMS test réussi à l'époque — système notify.py désormais archivé)
