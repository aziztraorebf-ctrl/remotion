# CHECKLIST PRE-COMPOSE

> A derouler AVANT d'ecrire la premiere ligne de `XxxShort.tsx` / `XxxComposition.tsx`.
> Si un item n'est pas coche : STOP. Resoudre avant de coder.

---

## Pre-requis inputs (Stages 1-4 prealables)

- [ ] `timing.ts` existe ET lu -> confirmer FPS, SCENES, TOTAL_FRAMES, HOOK_FRAMES (si hook)
- [ ] Tous les assets listes dans Visual Plan sont presents dans `public/assets/library/{project}/` (ls et compte)
- [ ] `public/audio/{project}/narration.mp3` present + duree ffprobe = TOTAL_FRAMES/FPS (tolerance +-0.1s)
- [ ] `public/audio/{project}/music.mp3` present (si applicable)
- [ ] `public/audio/{project}/hook-narration.mp3` present (si hook)
- [ ] `.claude/agent-memory/shared/PIPELINE.md` : Stages 1, 2, 4 marques COMPLETE

## Decisions architecture

- [ ] Hook present ? Si oui : verifier `HOOK_FRAMES` dans timing + Option B musique (silence pendant hook, Sequence from=SCENES_START_FRAME)
- [ ] Clips video (Seedance/Kling) presents ? -> OffthreadVideo muted + Sequence parent obligatoires (R9 + R10)
- [ ] Render final prevu Vercel ? -> verifier `public/audio/` dans `.gitignore` -> decision : render LOCAL obligatoire (R11)
- [ ] Transitions scene-to-scene ? Par defaut coupes franches. Si transitions stylisees : valider Aziz d'abord (R7)
- [ ] Mini-render strategie : Option B (Short <90s) ou Option A (long-form) ? Voir RULES-ACTIVE.md

## Root.tsx et inventaire assets

- [ ] Root.tsx : composition enregistree avec bon id, width, height, fps, durationInFrames
- [ ] Inventaire clips .mp4 : tous les clips references dans timing.ts existent dans `public/`

## Coherence duree

- [ ] Sum durations Sequence = TOTAL_FRAMES (pas de gap, pas d'overlap non intentionnel)
- [ ] Si hook : HOOK_FRAMES + sum(scene durations) = TOTAL_FRAMES
- [ ] Composition Root.tsx : `durationInFrames={TOTAL_FRAMES}` importe de timing.ts

## Safe zones

- [ ] Format cible identifie (YouTube Shorts / TikTok / Instagram / long-form)
- [ ] Safe zones choisies depuis table RULES-ACTIVE.md (defaut YouTube Shorts : top 120 / bottom 250 / sides 60 / Y>=1670)
- [ ] Aucun texte/element statique dans zone sous-titres reservee

## Regles critiques rappel

- [ ] Frames derivees de SCENES.x.start (R1) — zero hardcode
- [ ] Tous interpolate() ont clamp (R4)
- [ ] Zero setTimeout / @keyframes / CSS transition / requestAnimationFrame (R6)
- [ ] Sequence a premountFor (R3)
- [ ] Camera moves : un seul interpolate sur toute la plage (R5)

---

## Validation post-composition (avant handoff quality-reviewer)

- [ ] Dev server `npm start` lance sans erreur console
- [ ] Scrubbing manuel localhost:3000 : chaque scene entry/exit OK
- [ ] Audio audible throughout (narration + musique si applicable)
- [ ] Aucun warning Remotion dans console browser
- [ ] PIPELINE.md Stage 5 mis a jour avec chemins + notes

---

## Version

- 2026-04-24 v1 : checklist initiale extraite workflow Stage 5
- 2026-04-25 v2 : section Root.tsx + inventaire clips .mp4 ajoutee
