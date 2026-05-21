---
name: checklist-seedance
description: Checklist vivante pré-production + production Seedance 2.0 (clips vidéo IA). Mise à jour après chaque session.
metadata:
  type: project
---

# Checklist Seedance 2.0 — Vivante & Contraignante
> Lire au DÉBUT de chaque session Seedance. Cocher au fur et à mesure.
> Mis à jour : 2026-05-14
> Refs : `memory/tools/seedance-rules.md`, `memory/tools/seedance-prompts.md`

---

## PHASE 0 — Décision Seedance vs autre outil

- [ ] Seedance justifié (action, mouvement, clip narratif) — pas Gemini statique
- [ ] Budget estimé (prix réel : ~$0.683/s i2v sur fal.ai)
- [ ] Durée clips planifiée : duree clip >= durée narration (cross-check BLOQUANT)
- [ ] Si narration > 15s → splitter en 2 clips back-to-back

---

## PHASE 1 — Préparation refs

- [ ] Lire `memory/tools/seedance-rules.md` complet AVANT premier prompt
- [ ] Template prompt identifié (`memory/templates/combat.md`, `narratif.md`, `montage.md`, `exploration.md`)
- [ ] Checklist du template cochée
- [ ] Scan affiché (tableau points vérifiés)
- [ ] Refs séparées par élément (personnage, lieu, objets) — 3-5 refs dans Seedance
- [ ] Style paper-craft confirmé si applicable (`memory/tools/style-papercraft-sepia.md`)

---

## PHASE 2 — Génération clips

- [ ] Preview cost + settings AVANT tout appel payant
- [ ] Validation Aziz AVANT lancement
- [ ] Endpoint : `fal-ai/bytedance/seedance-2.0/image-to-video` (i2v) ou `text-to-video`
- [ ] Anti-patterns évités : `still`, `motionless`, dust/sparkles (R-NO-PARTICLES), `contemplatif`
      NOTE : R-NO-PARTICLES = règle Seedance 2.0 UNIQUEMENT. Particules CSS/React dans Remotion/Souverain = AUTORISÉES.
- [ ] R-VIVANT-PARTOUT : tout clip a un mouvement permanent
- [ ] Diversité visages vérifiée (ethnicity spécifiée — oubli fréquent)
- [ ] Clip reçu → Claude review AVANT présentation Aziz
- [ ] Clip review → Kimi si artefacts techniques suspectés

---

## PHASE 3 — Intégration Remotion

- [ ] `timing.ts` stable AVANT assemblage
- [ ] Duree clip >= narration cross-check (cross-check bloquant — voir `memory/pipeline.md`)
- [ ] Clips dans `public/seedance/` avec nommage convention
- [ ] INDEX.md mis à jour (`public/seedance/INDEX.md`)

---

## Pricing réel fal.ai (2026-04-26)

| Durée | i2v cost | Video Extend |
|-------|----------|--------------|
| 5s    | $3.42    | ~$0.90       |
| 6s    | $4.10    | ~$1.08       |
| 7s    | $4.78    | ~$1.26       |
| 9s    | $6.15    | ~$1.62       |
| 10s   | $6.83    | ~$1.80       |

---

## Étapes les plus souvent oubliées

1. Lire le template prompt AVANT d'écrire (oublié fréquemment)
2. Ethnicity/diversité dans le prompt (oublié 3x le 2026-04-07)
3. Cross-check durée clip >= narration AVANT appel API
4. Refs séparées par élément (sous-utilisées — 1 ref au lieu de 3-5)
