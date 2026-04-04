# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-04-04 (session majeure : reorganisation memoire + 6 tests Seedance + plan Thiaroye V2) | A LIRE EN DEBUT DE SESSION
> Archive V1 (Thiaroye Kling, Hannibal, Amanirenas, Seedance discovery) : `memory/archive/production-v1.md`

---

## CONTEXTE — Ce qui s'est passe cette session

Session la plus productive du projet. Deux chantiers majeurs :

**1. Reorganisation memoire** : les anciens monolithes (`seedance-reference.md`, `key-learnings.md`, `video-generation-pipeline.md`) ont ete splits en 8 fichiers thematiques dans `memory/tools/`. Le CLAUDE.md du projet a ete mis a jour avec un tableau de routage automatique (quand Aziz parle de Seedance → lire tools/seedance-prompts.md, etc.). Raison : les fichiers monolithiques melaient tout (prompts + regles + techniques + tests) et Claude ne savait pas quel fichier charger pour quel outil.

**2. Reverse engineering + tests Seedance** : analyse de 10+ videos de la communaute (@ChangningL29508, @drjoetw, @aiehon_aya, @liyue_ai), extraction de techniques, puis 6 tests sur notre contenu — tous reussis (moyenne 9.4/10). Decouverte majeure : le Format 6 (transitions slow-mo orbital entre scenes) permet de couvrir 2-3 beats narratifs en 1 seul clip de 15s, eliminant les coutures entre clips.

**Decision architecturale validee** : le pipeline "1 beat = 1 clip Kling" est remplace par "1 clip Format 6 = 2-3 beats Seedance avec transitions internes". Pour un Short de 60-110s, ca donne 4-7 clips x 15s au lieu de 9+ clips x 5-10s. Moins de credits, zero couture, meilleure qualite.

---

## Abou Bakari Short V2 — EN COURS (Seedance-native)

### Audio V3 FINAL
- Fichier : `tmp/audio-abou-bakari-v2/abou-bakari-v2-full-v3.mp3` (**92.6s**)
- Structure : Partie A narration (0-40s) + Dialogue (40-49s) + Partie B (49-93s)
- Narratrice V3 speed 0.92, Dialogue : Abou Bakari (`ICHuIqamER7XZMdm2HYC`) + Moussa (`12mpLi4ieFNVlQlAIJ3m`)

### Script V2
- Fichier : `scripts/abou-bakari-v2-script.md` — 9 beats, ton epique, dialogue Moussa

### Beat Table (ancien pipeline 1-beat-1-clip)

| Beat | Contenu | Duree | Clip | Statut |
|------|---------|-------|------|--------|
| hookGeo | "En 1311... Sauf un homme." | 10.6s | Remotion V1 | A integrer |
| empire | "Abou Bakari deux... le hante." | 14s | beat02-empire-v1.mp4 (12s) | **VALIDE** |
| expedition | "Il fait armer... On ne passe pas." | 8.4s | beat03-expedition-v1.mp4 (10s) | **VALIDE** |
| decision | "Il ne recule pas... son pouvoir." | 6.9s | beat04-decision-v1.mp4 (7s) | **VALIDE** |
| dialogue | 3 voix passation Moussa | ~9s | beat05-dialogue-v1.mp4 (10s, silent) | **VALIDE mais 16:9** |
| moussa | "Son demi-frere... 400 milliards." | ~15s | A GENERER | En attente |
| depart | "Il monte... jamais." | ~12s | A GENERER | En attente |
| colomb | "181 ans plus tard... Le decouvreur." | ~9s | A DEFINIR | En attente |
| cta | "Mais qui a fait... en bio." | ~8s | Remotion pur | A coder |

### NOTE IMPORTANTE — Reconsiderer le pipeline

Les tests de cette session suggerent qu'on pourrait refaire le Short en **3-4 clips Format 6** au lieu de 9 beats individuels. Par exemple :
- Clip 1 (Format 6) : hookGeo + empire + expedition (3 scenes, transitions slow-mo)
- Clip 2 (Format 6) : decision + dialogue (2 scenes)
- Clip 3 (Format 6) : moussa + depart (2 scenes)
- Clip 4 : colomb + cta (Remotion pur ou Seedance)

**Decision Aziz requise** : continuer le pipeline actuel (beats individuels) ou pivoter vers Format 6 multi-scenes ?

### Clips session 2026-04-03/04 — Inventaire production

**Clips prets pour production immediate (9:16, score >= 9.5) :**

| Clip | Fichier | Format | Score | Usage potentiel |
|------|---------|--------|-------|-----------------|
| **Format 6 — 3 epoques** | `~/Downloads/SixFrame.mp4` | 9:16 720x1280 15s | 9.5/10 | Couvre palais->ocean->tempete. Pourrait remplacer beats depart+expedition |
| **Contraste chromatique** | `~/Downloads/chromatic.mp4` | 9:16 720x1280 10s | 10/10 | Hook alternatif. Roi or parmi foule grise -> marche Tombouctou |

**Clips en 16:9 (a regenerer en 9:16 ou cropper) :**

| Clip | Fichier | Score | Action |
|------|---------|-------|--------|
| **Dialogue Abou Bakari/Moussa** | `~/Downloads/dialogue.mp4` | 10/10 | **PRIORITE #1 : regenerer en 9:16 natif.** Prompt dans `tmp/test-audio-guided-dialogue-prompt.md`. 120cr, 2 refs. |
| Plan-sequence Tombouctou | `~/Downloads/storyline_export.mp4` | 10/10 | Optionnel — cropper suffit |
| Dialogue croppe (backup) | `/tmp/dialogue-9x16.mp4` | 8/10 | Backup si credits limites |
| Extension flotte | `~/Downloads/extension.mp4` | 7.5/10 | Retester avec verbes dynamiques si besoin |

### Prochaines actions Abou Bakari

1. **PRIORITE : Regenerer dialogue beat 05 en 9:16 natif** (prompt pret, 120cr)
2. **Decision : pivoter vers Format 6 multi-scenes ou continuer beats individuels ?**
3. Beat 06 Moussa : Seedance 80cr
4. Recaler timing-v2.ts (silencedetect)
5. Assemblage Remotion
6. Musique Suno

---

## Thiaroye V2 — NOUVEAU PROJET (Seedance Format 6)

### Contexte
Le test du clip 1 (village->recrutement->bateau) a score 10/10 — sans ref image, 80 credits, one shot. Cela valide le Format 6 pour des sujets historiques africains. Le script V6 existe deja (audio 110s). Un plan complet de 7 clips a ete redige.

### Etat
- **Clip 1 FAIT** : `~/Downloads/test thiaroye.mp4` (9:16, 15s, 10/10)
- **Plan complet** : `scripts/thiaroye-v2-seedance-plan.md` — 7 clips avec prompts prets, 560 credits total
- **Audio existant** : `public/assets/library/geoafrique/thiaroye-1944/thiaroye-voixoff-v6.mp3` (110s)
- **Script transcrit** : dans le plan (transcription Whisper de l'audio V6)

### Decision requise
Le clip 1 actuel montre village -> recrutement -> bateau (depart VERS la guerre). Le script parle d'un RETOUR de guerre. Options :
- A) Garder comme hook visuel (narrativement puissant meme si chronologiquement different)
- B) Regenerer avec le vrai contexte (retour, camp d'attente)

### Prochaine action
Quand Aziz decide de produire : ouvrir `scripts/thiaroye-v2-seedance-plan.md`, generer clips 2-7 avec les prompts prets.

---

## Reorganisation memoire (FAIT cette session)

### Structure actuelle `memory/tools/`

| Fichier | Contenu | Quand le lire |
|---------|---------|---------------|
| `seedance-prompts.md` | **REFERENCE COMPLETE** : 6 formats + camera + VFX + dialogue + pipeline + tests | Quand on parle de Seedance |
| `seedance-rules.md` | **CHECKLIST** : 27 regles + anti-patterns | Apres avoir ecrit un prompt |
| `seedance-community.md` | Repos, auteurs, veille | Pour s'inspirer |
| `kling.md` | Endpoints, cfg_scale, frame chaining | Quand on utilise Kling |
| `gemini.md` | Chirurgical, character sheets, Nano Banana | Quand on retouche des images |
| `recraft.md` | Pipeline SVG, vivid_shapes | Quand on genere des assets |
| `elevenlabs.md` | TTS francais, scan accents | Quand on genere de l'audio |
| `remotion.md` | Animation, OffthreadVideo, geo effects | Quand on code |

**Routage automatique** ajoute dans `CLAUDE.md` du projet — Claude charge le bon fichier quand Aziz parle d'un outil.

### Anciens fichiers archives
`memory/archive/pre-reorg-2026-04-02/` : seedance-reference.md, key-learnings.md, video-generation-pipeline.md, learnings-to-test.md, seedance-community-repos.md, seedance-techniques.md

---

## Tests Seedance valides cette session

| # | Test | Score | Technique validee | Credits |
|---|------|-------|-------------------|---------|
| 1 | Plan-sequence Tombouctou | 10/10 | Format 4 (plan-sequence impossible) | 80 |
| 2 | Dialogue francais lip sync | 10/10 | Regle 25 (Audio-Guided Dialogue) | 80-120 |
| 3 | Format 6 Abou Bakari 3 epoques | 9.5/10 | Format 6 + COLOR GRADE progressif | 80 |
| 4 | Extension video (V2V) flotte | 7.5/10 | V2V fonctionne mais verbes trop doux | 120 |
| 5 | Contraste chromatique | 10/10 | Contraste 1 couleur vs monde gris | 80 |
| 6 | Thiaroye clip 1 | 10/10 | Format 6 SANS ref, nouveau sujet | 80 |

### Regles apprises
- **Regle 25 VALIDEE** : dialogue francais lip sync natif dans Seedance, sans fournir d'audio
- **Regle 26** : toujours decrire le mouvement physique de rotation ("slowly turns") sinon morphing snap
- **Regle 27** : extensions V2V = verbes dynamiques obligatoires, 15s > 10s, 1 changement majeur max

---

## Infrastructure (compact)

**Vercel Blob** : `scripts/upload-to-blob.py` — upload, gallery HTML, listing.
**Vercel Renderer** : `remotion-renderer-khaki.vercel.app` — render remote.

---

## Autres projets (status)

**Peste 1347** : HookMaster v2 TERMINE (Kimi 9/10). Corps S1-S6 A FAIRE.

---

## Regles Critiques Transversales

- Audio startFrame INTOUCHABLE — derive de mesures ffprobe
- NO EMOJIS dans .ts/.tsx/.js/.json/.yaml
- OffthreadVideo : toujours muted, toujours dans Sequence from={BEATS.xxx.start}
- Audio Seedance = TOUJOURS remplacer narration (garder SFX/musique a -12dB)
- Gemini retouche chirurgicale avant de regenerer
- **Reference outils** : `memory/tools/` (routage auto dans CLAUDE.md)
- **Pipeline Shorts** : Format 6 (2-3 scenes/clip x 15s) > ancienne approche 1 beat/clip
