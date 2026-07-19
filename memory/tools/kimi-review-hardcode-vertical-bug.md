---
name: kimi-review-hardcode-vertical-bug
description: "visual_review.py --model kimi a un prompt câblé en dur pour Shorts verticaux 1080x1920 — ignore --ratio, halluciné sur tout render 16:9"
metadata:
  type: reference
---

# Bug — `visual_review.py --model kimi` ignore `--ratio`, prompt câblé Shorts vertical

Découvert 2026-07-17 sur la review de `SoudanActe5` (War-Map 16:9). `KIMI_NARRATIVE_PROMPT`
(`scripts/visual_review.py` ligne 149) contient en dur : *"Evaluate this Short YouTube vertical video
(1080x1920) for the 'Souverain' series"* — indépendant du flag `--ratio` passé en CLI (qui, lui, est
bien branché pour `--model gemini`, ligne 326 `fmt_map`).

**Symptôme concret** : sur un render 16:9 réel, Kimi a halluciné des problèmes de "mobile safe zones",
"YouTube Shorts UI (subscription button)", labels "obscured" par une UI mobile qui n'existe pas dans ce
contexte — verdict 6/10 basé sur un format qui n'est pas celui reviewé.

**Comment appliquer** : sur TOUT render non-Souverain-vertical (War-Map 16:9, tout futur format hors
Shorts 9:16), écarter en bloc tout retour Kimi lié à la mise en page/safe-zones/UI mobile — ce n'est pas
un signal valide, c'est un artefact du prompt câblé. Le score global Kimi reste peu fiable dans ce
contexte (pénalise un format qui n'est pas le vrai). Préférer `--model gemini` (respecte `--ratio`) pour
tout review hors Souverain-vertical. Fix propre (pas fait, à faire si Kimi doit resservir sur War-Map) :
paramétrer `KIMI_NARRATIVE_PROMPT` avec le même `fmt_map` que Gemini plutôt que le texte en dur.

Distinct de [[kimi-review-bug]] (bug de parsing `content`/`reasoning_content` vide, déjà résolu) — ici
Kimi RÉPOND bien, mais évalue le mauvais format.
