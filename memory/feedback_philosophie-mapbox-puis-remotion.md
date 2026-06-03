---
name: philosophie-mapbox-puis-remotion
description: Nouvelle philosophie de production (2026-06-03) — séparer la charge en deux blocs indépendants : TOUT le Mapbox d'abord (toutes sessions nécessaires), validé, PUIS tout le Remotion, avant assemblage final.
metadata:
  type: feedback
---

## Philosophie de travail (validée Aziz 2026-06-03)

**Pour un Short/épisode mixte (beats Mapbox + beats Remotion), produire en DEUX BLOCS séparés :**

1. **BLOC 1 — CARTE (Mapbox)** : coder + valider TOUS les beats Mapbox d'abord. Peu importe le nombre de sessions. On ne passe pas à Remotion tant que toutes les cartes ne sont pas validées par Aziz.
2. **BLOC 2 — REMOTION** : une fois tout le Mapbox validé, coder + valider tous les beats Remotion (graphisme, data-viz, images, texte).
3. **PUIS assemblage final** (ffmpeg, ordre des beats, SFX, mix).

**Why:** Les cartes Mapbox et les beats Remotion ne dépendent PAS l'un de l'autre — ils sont complètement séparés techniquement (Mapbox = WebGL headless, getCam, render-mapbox.sh ; Remotion = composition standard). Les regrouper par type évite le context-switching, permet de rester dans un même mode mental/technique, et **prépare le travail autonome** (un bloc homogène est plus facile à confier à Claude en autonomie qu'un mélange).

**How to apply:**
- Au démarrage d'un épisode mixte : lister les beats par type (Mapbox vs Remotion).
- Attaquer TOUS les Mapbox en premier (bloc continu sur N sessions).
- Ne proposer le passage à Remotion qu'une fois le dernier beat Mapbox validé Aziz.
- L'assemblage final vient en tout dernier.

## Application immédiate — Maroc Batteries Short (109.5s, 6 beats)

| Beat | Type | État |
|---|---|---|
| Beat 0 Hook | MAPBOX | ✅ FINAL (SweepRevealTerritory) |
| Beat 1 Phosphate | MAPBOX | ✅ FINAL (FlagFill multi-pays) |
| **Beat 3 Acteurs Gotion/VW** | **MAPBOX** | ⏳ À FAIRE — prochain beat carte (Kénitra zoom 3D pitch + Wolfsburg + arc) |
| Beat 2 Cailloux | REMOTION | ⏸ BLOC 2 (split phosphate/cathode + balance + 5,6 Md$, assets Gemini à valider) |
| Beat 4 Géographie | REMOTION | ⏸ BLOC 2 |
| Beat 5 Question finale | REMOTION | ⏸ BLOC 2 |

**Donc : il ne reste qu'UN SEUL beat Mapbox = Beat 3 (Acteurs Gotion/VW).** Une fois Beat 3 validé, le BLOC CARTE est terminé → on passe au BLOC REMOTION (Beats 2, 4, 5).

Beat 3 brief : Stop1 Kénitra (zoom 13, pitch 0→45 sur 60f, plaques GOTION rouge + VOLKSWAGEN bleu) → Whip Pan 60f → Stop2 Wolfsburg (drift, arc Kénitra→Wolfsburg). Templates candidats à scanner : plaques (GeoCountryPlaque possible pour GOTION/VW + source), camCountryApproach pitch 32, MapCutaway si insert. [[pattern-or-africain-plaques-relief-sfx]]
