---
name: checklist-souverain
description: Checklist vivante pré-production + production Souverain (format hybride 60-130s). Mise à jour après chaque session.
metadata:
  type: project
---

# Checklist Souverain — Vivante & Contraignante
> Lire au DÉBUT de chaque session Souverain. Cocher au fur et à mesure.
> Mis à jour : 2026-05-14

---

## PHASE 0 — Sélection sujet

- [ ] Sujet évalué selon critères go/no-go (Section 4 `rules-workflow-processus.md`)
- [ ] Score monétisation estimé (YouTube + Patreon + newsletter)
- [ ] Angle validé : ni condescendant, ni binaire, ni moralisateur
- [ ] Test adversarial fait : quels commentaires hostiles va-t-on recevoir ? → neutraliser dans le script

---

## PHASE 1 — Recherche & Fact-check

- [ ] **Perplexity sonar-pro** lancé (OpenRouter, modèle `perplexity/sonar-pro`) — chiffres, dates, sources
- [ ] Fact-Sheet complétée (`memory/templates/fact-sheet-souverain-v1.md`)
- [ ] Toutes les données datent de 2024-2026 (pas de chiffres périmés)
- [ ] Sources primaires identifiées (pas "selon les experts")
- [ ] Chiffres max 3 par Short — sélectionner les plus frappants

---

## PHASE 2 — Script

- [ ] Script V1 écrit selon règles éditoriales (`memory/rules-souverain-editorial.md`)
- [ ] Sources JAMAIS dites à l'oral — affichées discrètement à l'écran uniquement
- [ ] Zéro "selon", "d'après", "des études montrent" dans la narration
- [ ] Scan règles TTS français :
  - [ ] Zéro participe passé en "é/ée" en fin de groupe
  - [ ] Zéro "ont + voyelle"
  - [ ] Nombres en lettres (pas de chiffres)
- [ ] **Jury LLM** : GPT-4o + Gemini + Grok → score + retours
- [ ] Corrections intégrées selon jury
- [ ] Script LOCKED par Aziz

---

## PHASE 3 — Audio

- [ ] TTS ElevenLabs V3 généré (voix `z3gESu49naEZW8Af2Upm`, `eleven_v3`)
- [ ] Settings : stability 0.22, style 0.55, similarity_boost 0.55, speed 1.25
- [ ] ffprobe durée mesurée → frames @30fps calculées
- [ ] Durée validée par Aziz (cible 60-130s)
- [ ] **Forced Alignment v2** généré via API ElevenLabs `/with-timestamps`
- [ ] Crossvalidation Whisper API OpenAI (`whisper-1`, `verbose_json`, `word+segment`)
- [ ] Timestamps cohérents entre les deux sources

---

## PHASE 4 — Musique

- [ ] Lire `memory/tools/minimax.md` AVANT tout appel
- [ ] **3 variantes musique** générées via fal.ai Minimax (`fal-ai/minimax-music/v2.6`)
- [ ] Chaque variante : instrumental, cohérente avec le ton de l'épisode
- [ ] Aziz écoute et choisit la variante
- [ ] Volume cible : 0.04 (narration dominante), fade in/out 2s

---

## PHASE 5 — Manifest visuel

- [ ] Templates identifiés beat par beat (consulter ASSETS-INDEX.md d'abord)
- [ ] Timestamps tous calés sur ElevenLabs forced alignment (pas estimés)
- [ ] Manifest écrit : `src/projects/souverain/<episode>/manifest.ts`
- [ ] Overlays texte écran identifiés (sources, captions discrètes)
- [ ] Assets visuels manquants listés dans `ASSETS_TODO`

---

## PHASE 6 — Assets visuels

- [ ] Lire `memory/tools/gemini.md` AVANT toute génération
- [ ] SDK : `from google import genai` + `from google.genai import types` (pas `google.generativeai`)
- [ ] `response_modalities` dans `types.GenerateContentConfig` (pas en kwarg direct)
- [ ] `inline_data.data` = bytes directs (pas base64 à décoder)
- [ ] Beat 1 : image fond (illustration stylisée ou photo selon sujet)
- [ ] Autres beats : assets selon manifest (icônes, graphiques, photos)
- [ ] Chaque asset relu par Claude AVANT présentation à Aziz

---

## PHASE 7 — Code Remotion (toi + moi)

- [ ] Entry point : `src/index.ts` (pas `src/Root.tsx`)
- [ ] Render test : `npx remotion render src/index.ts <CompositionId> out/...`
- [ ] Beat 1 codé + mini-render validé par Aziz
- [ ] Beat 2 codé + mini-render validé
- [ ] Beat 3 codé + mini-render validé
- [ ] Beat 4 codé + mini-render validé
- [ ] Beat 5 codé + mini-render validé
- [ ] Beat 6 codé + mini-render validé
- [ ] Beat 7 / CTA codé + mini-render validé
- [ ] Composition complète assemblée (tous beats + audio + musique)

---

## PHASE 8 — Quality Review

- [ ] Downscale frames avant review (`./scripts/downscale-for-review.sh`)
- [ ] Claude review visuelle AVANT Kimi
- [ ] Kimi review technique (scripts/review_with_kimi.py)
- [ ] Verdict : APPROVE / MINOR FIX / RE-EVALUATE
- [ ] Fixes appliqués si nécessaire

---

## PHASE 9 — Render & Publication

- [ ] Render final lancé
- [ ] Fichier promu → `out/PRET-PUBLICATION/<episode>-FINAL.mp4`
- [ ] Sous-titres vérifiés
- [ ] `out/episodes/<ep>/wip/` et `versions/` purgés

---

## Étapes les plus souvent oubliées (historique sessions)

1. Perplexity sonar-pro AVANT script (oublié session Silicon Savannah)
2. Musique fal.ai Minimax — 3 variantes (oublié session Silicon Savannah 2026-05-14)
3. Test adversarial AVANT script final (oublié session Silicon Savannah)
4. Forced alignment crossvalidation Whisper (alignment v1 était corrompu)
