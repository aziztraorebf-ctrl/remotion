---
name: Backlog — Mapbox Premium Playbook
description: Session future — construire une doctrine cartographique premium via Gemini 3.1 Pro multi-vidéos (nos validées + réfs geotainment)
type: project
---

# Backlog — MAPBOX PREMIUM PLAYBOOK (idée Aziz 2026-06-01)

> ✅ RÉALISÉ 2026-06-01 → `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md`.
> Construit via `scripts/tools/gemini-visual-playbook.py` (2 appels Gemini 3.1 Pro). Ce backlog reste comme trace de la genèse.

## Objectif
Passer de la review par-scène à une **doctrine cartographique premium stable** — une référence réutilisable à chaque Mapbox pendant des mois. Résout durablement le syndrome "carte grise" (rétention 2/10 sur l'animatic A2).

## Méthode
Un seul appel Gemini 3.1 Pro (Files API, multi-vidéos) qui reçoit :
1. **2-3 de nos vidéos validées** (Or Africain, Sénégal Pétrole, Niger Uranium) — "comment on travaille"
2. **2-3 vidéos de référence choisies par Aziz** (Géo Globe-Trotter, Jacque a dit, Johnny Harris) — "où on veut aller". Extraits 30-60s via yt-dlp ciblés sur les moments carte marquants (Aziz fournit liens + timecodes).
3. **Nos fichiers** : PRODUCTION-BRIEF, catalogue overlays (script gemini-mapbox-review.py), Camera Lab v2, contraintes DOCTRINE-SOUVERAIN.
4. **Beat 1 Maroc avant/après correction** comme cas d'étude.

## Demande à Gemini
"Compare nos cartes aux références. Qu'est-ce qui sépare les deux ? Donne un rundown de principes applicables, compatibles avec nos contraintes (navy, frame-driven, headless, R1), sur lesquels on peut se fier à chaque Mapbox."

## Sortie
memory/doctrines/MAPBOX-PREMIUM-PLAYBOOK.md — doctrine cartographique réutilisable.

## Point critique
Aziz choisit les réfs — son jugement "qu'est-ce qui est bon" est ce que Gemini doit apprendre. Ne pas choisir les réfs à sa place.

## Lien boucle autonome future
Le script `scripts/tools/gemini-mapbox-review.py` (validé 2026-06-01, comme feedback_gemini-video-review-pattern mais pour Mapbox) devient la brique de validation d'un futur `/goal` : code → render → Gemini review → applique fix_code → re-render → jusqu'à score seuil. Même logique que ce qu'on avait fait pour l'émotion narrative. Prouvé manuellement sur Beat 1 d'abord.
