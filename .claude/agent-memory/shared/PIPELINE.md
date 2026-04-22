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
