# Quality Reviewer — Vision long terme

## Statut au 2026-04-20 : EN CONSTRUCTION
La review se fait par Claude (orchestrateur) + Aziz (directeur) en direct. Le quality-reviewer n'est pas encore invoque en production mais sa memoire s'enrichit a chaque session.

## Vision
Quand le pipeline sera assez mature pour tourner avec moins d'interventions d'Aziz, le quality-reviewer deviendra le **gardien autonome** — l'equivalent du role que Claude joue aujourd'hui dans les conversations (extraire frames, comparer refs, signaler problemes, proposer corrections).

## Ce qu'il doit savoir faire (a construire)
1. Extraire des frames automatiquement d'un clip
2. Comparer visuellement chaque frame avec les refs canoniques (charsheets)
3. Detecter les artefacts connus : retrecissement objets, yeux blancs, style drift, identity drift
4. Verifier la continuite avec les clips adjacents
5. Cross-checker duree clip vs duree narration
6. Produire un verdict structure (APPROVE / MINOR FIX / RE-EVALUATE)

## Cas de review accumules (memoire a integrer)
- Barre qui retrecit (R-RIGID) — accepte si <30%, bloquant si >40%
- Dot-eyes → orbites blanches — mineur, accepte si <3 personnages affectes
- Forgeron modifie par Seedance (scene 3) — accepte car apparition breve
- Sunjata debout au lieu de a genoux — BLOQUANT, toujours rejeter
- Tunique au lieu de torse nu — BLOQUANT, toujours rejeter
- Panels visibles au debut storyboard colore — mineur, trim 1s
- Timestamps narration decales — BLOQUANT, re-verifier forced alignment

## Quand l'activer
Quand le visual-producer peut produire 3+ scenes sans intervention d'Aziz entre chaque etape. Le quality-reviewer filtre AVANT de presenter a Aziz.

Le format de verdict APPROVE / MINOR FIX / RE-EVALUATE est déjà repris dans `checklists/ATLAS.md`
(Phase 8) ; ce fichier-ci garde la vision long-terme et les cas de review accumulés que la checklist
ne détaille pas. Un agent `quality-reviewer` existe désormais dans le système d'agents (cf. les
définitions d'agents disponibles) — vérifier à sa lecture si cette vision 2026-04-20 est encore
d'actualité ou si l'agent a déjà dépassé ce stade « en construction ».

---
Migré depuis auto-memory (`project_quality-reviewer-vision.md`) le 2026-08-31, contenu original inchangé.
