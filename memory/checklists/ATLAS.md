---
name: checklist-atlas
description: Checklist vivante pré-production + production Atlas (format ciné-théâtre cartographique, 30-60s). Mise à jour après chaque session.
metadata:
  type: project
---

# Checklist Atlas — Vivante & Contraignante
> Lire au DÉBUT de chaque session Atlas. Cocher au fur et à mesure.
> Mis à jour : 2026-05-14
> Ref complète : `memory/templates/atlas-template-v1.md`

---

## PHASE 0 — Sélection sujet

- [ ] Sujet = Atlas PUR (géo + exploit + chiffres) — pas contemporain (→ Souverain)
- [ ] 5 questions conception OBLIGATOIRES avant tout insert :
  - [ ] La carte peut-elle porter cette action sans insert ?
  - [ ] Le personnage peut-il agir directement sur la carte ?
  - [ ] L'action est-elle géographiquement localisable ?
  - [ ] Un insert apporte-t-il une info impossible à montrer sur carte ?
  - [ ] Max 1-2 inserts par beat — respecté ?
- [ ] Durée cible : 25-30s narration brute, ~30-35s avec respirations

---

## PHASE 1 — Script

- [ ] Script écrit selon formule Cesar pure (`memory/templates/script-atlas-v1.md`)
- [ ] 6 segments fixes : Hook / Setup geo / Fact 1 / Fact 2 / Comparison / Punchline
- [ ] Fact-check AVANT toute génération (WebSearch + sources académiques)
- [ ] Scan règles TTS français (zéro "é/ée" fin de groupe, nombres en lettres)
- [ ] Jury LLM si épisode > 30s (GPT-4o + Gemini + Grok)
- [ ] Script LOCKED par Aziz

---

## PHASE 2 — Audio

- [ ] TTS ElevenLabs (`eleven_multilingual_v2`, voix `z3gESu49naEZW8Af2Upm`)
- [ ] Settings : stability 0.5, similarity 0.75, style 0.3
- [ ] ffprobe durée mesurée → frames @30fps
- [ ] **Forced Alignment** généré (ElevenLabs `/with-timestamps` — PAS Whisper seul, drift 2.5s possible)
- [ ] Crossvalidation Whisper API OpenAI si doute
- [ ] **SFX 3 standards** générés :
  - [ ] B — impact ville (apparition marker pin) : vol 0.6, 3 frames AVANT le mot
  - [ ] C — ink-draw (caravane/route) : vol 0.85, sync début animation
  - [ ] D — cartouche stat thud : vol 1.5, 3 frames AVANT le mot

---

## PHASE 3 — Musique

- [ ] Lire `memory/tools/minimax.md` AVANT appel
- [ ] **3 variantes** générées via fal.ai Minimax (`fal-ai/minimax-music/v2.6`)
- [ ] Variante Atlas recommandée : Mande Contemplatif (kora + balafon)
- [ ] Volume : **0.04** (définitif), fade 2s in/out
- [ ] Aziz choisit la variante

---

## PHASE 4 — Concept Art & Storyboard

- [ ] **1 image Gemini par beat majeur** AVANT de coder (validé visuellement par Aziz)
- [ ] Consulter `ATLAS-COMPOSANTS.md` AVANT tout code
- [ ] Consulter ASSETS-INDEX.md pour composants existants
- [ ] Style.json Mapbox réutilisé (`atlas-parchemin-mande-relief.json`)
- [ ] Palette Atlas confirmée (terracotta, indigo, doré, crème parchemin)
- [ ] Assets PixelLab identifiés (consulter PIXELLAB-MASTER-INDEX.md)
- [ ] Validation visuelle Aziz AVANT de coder

---

## PHASE 5 — Timing

- [ ] `timing.ts` créé avec segments ElevenLabs word-level
- [ ] TOTAL_FRAMES calculé (durée × 30)
- [ ] Mots-pivots identifiés pour chaque beat
- [ ] FREEZE_FRAME_S = 1.0s après dernier beat

---

## PHASE 6 — Code Remotion (toi + moi, beat par beat)

- [ ] Entry point : `src/index.ts`
- [ ] Règle ATLAS PUR : carte = SCÈNE (pas fond). Personnages PixelLab portent l'action
- [ ] Zéro inline styles pour couleurs/typo — Tailwind tokens uniquement
- [ ] Anti-patterns INTERDITS : `CSS transition:`, `setTimeout`, `@keyframes`, `requestAnimationFrame`
- [ ] Duree clip >= durée narration (cross-check bloquant)
- [ ] Beat 1 codé + mini-render Aziz
- [ ] Beats suivants codés + mini-renders
- [ ] Composition complète assemblée

---

## PHASE 7 — Quality Review

- [ ] Downscale frames (`./scripts/downscale-for-review.sh`)
- [ ] Claude review AVANT Kimi
- [ ] Kimi review (scripts/review_with_kimi.py)
- [ ] Verdict APPROVE / MINOR FIX / RE-EVALUATE

---

## PHASE 8 — Render & Publication

- [ ] Render final (Mapbox → `./scripts/render-mapbox.sh` obligatoire pour WebGL)
- [ ] Promu → `out/PRET-PUBLICATION/<episode>-FINAL.mp4`
- [ ] Wip/versions purgés

---

## Règles non-négociables Atlas (rappel rapide)

- La carte est la SCÈNE, pas un fond
- Jamais SVG approximatif — toujours d3-geo + Natural Earth 50m
- Inserts plein écran : max 1-2 par beat, seulement si impossible sur carte
- 16 mouvements caméra documentés dans `memory/tools/atlas-camera-movements.md`
- Fork AVANT reconstruire — jamais patcher un prototype rejeté
