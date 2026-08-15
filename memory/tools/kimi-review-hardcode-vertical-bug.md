---
name: kimi-review-hardcode-vertical-bug
description: "CORRIGÉ le 2026-08-15 — visual_review.py --model kimi respecte enfin --ratio (le prompt était câblé Shorts verticaux 1080x1920, hallucinait sur tout render 16:9)"
metadata:
  type: reference
---

# ✅ CORRIGÉ (2026-08-15) — `visual_review.py --model kimi` ignorait `--ratio`

> **Le fix prescrit en bas de cette fiche a été APPLIQUÉ le 2026-08-15** : `KIMI_NARRATIVE_PROMPT` est
> désormais paramétré par `{fmt}`/`{hook_line}` et reçoit le format réel au moment de l'appel (même
> `fmt_map` que Gemini). Vérifié : plus aucun `1080x1920` en dur, le prompt bascule correctement entre
> 16:9 et 9:16. Un render 16:9 est maintenant jugé comme du long-form (« établit le sujet sur grand
> écran ») et non comme un Short (« stoppe le scroll en 0.8s sur mobile »).
>
> ⛔⛔ **LEÇON DE MÉTHODE, plus importante que le bug lui-même** : ce bug a été rencontré **3 fois**
> (2026-07-17 SoudanActe5, puis 2×2026-08-15 sur le Gazoduc) alors que cette fiche existait, était
> juste, ET prescrivait déjà le bon fix en dernière ligne. **Une note qui documente un bug ne le
> corrige pas** — elle fait re-payer le diagnostic à chaque occurrence. Quand un fix est connu, tenu,
> et tient en quelques lignes : le faire, ne pas l'écrire pour plus tard.
> (Cas particulier de [[feedback_regle-ecrite-insuffisante-sans-gate-outille]].)

## Historique du bug (conservé pour trace)

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
tout review hors Souverain-vertical. ~~Fix propre (pas fait…)~~ → **FAIT le 2026-08-15, cf bloc en
tête** : `KIMI_NARRATIVE_PROMPT` paramétré avec le même `fmt_map` que Gemini.
⚠️ Le conseil ci-dessus (« écarter en bloc les retours Kimi sur la mise en page ») ne s'applique donc
plus aux appels POSTÉRIEURS au 2026-08-15 — mais reste valable pour relire d'anciens rapports.

Distinct de [[kimi-review-bug]] (bug de parsing `content`/`reasoning_content` vide, déjà résolu) — ici
Kimi RÉPOND bien, mais évalue le mauvais format.
