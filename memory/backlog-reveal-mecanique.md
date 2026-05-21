---
name: backlog-reveal-mecanique
description: Famille de templates "reveal mécanique" — 1 élément central animé, peu de texte, pattern captivant. Validé par Aziz 2026-05-13.
metadata:
  type: project
---

# Famille Reveal Mécanique — Backlog Templates

**Concept fondateur :** CountdownReveal. Pattern : 1 élément visuel central qui "fait quelque chose", presque zéro texte, l'animation EST le message, le viewer regarde jusqu'à la fin.

**Règles de la famille :**
- 1 seul élément central dominant (≥60% écran)
- Animation déterministe — le viewer comprend où ça va mais veut voir la fin
- Peu de texte — label court en haut, contexte court en bas max
- Universel — pas obligatoirement style Souverain/journalistique
- Zéro asset externe si possible (CSS/SVG pur = réutilisable immédiatement)

## Backlog complet (10 idées, validé Aziz 2026-05-13)

| # | Nom | Concept central | Complexité | Priorité |
|---|---|---|---|---|
| 1 | **FillScreen** | Couleur qui monte depuis le bas, remplit l'écran progressivement — % affiché au centre | Faible | TOP 1 |
| 2 | **OdometerFlip** | Compteur mécanique style odomètre — chiffres qui "flippent" un par un droite→gauche | Moyenne | TOP 2 |
| 3 | **RadarPing** | Point central + cercles concentriques qui s'expandent — stats apparaissent au contact du bord | Moyenne | TOP 3 |
| 4 | **BarRace** | Barre horizontale qui s'étend gauche→droite, chiffre countUp en temps réel | Faible | Backlog |
| 5 | **PulseNumber** | Chiffre géant qui "bat" comme un cœur — grossit/rétrécit, change de valeur à chaque pulse | Faible | Backlog |
| 6 | **TypeReveal** | Texte court lettre par lettre style machine à écrire — mots clés explosent en grand avant de se remettre | Moyenne | Backlog |
| 7 | **ScaleShock** | Deux formes — l'une grandit jusqu'à écraser l'autre hors cadre. Comparaison de taille pure | Faible | Backlog |
| 8 | **SplitReveal** | Écran noir fendu en deux — image/info apparaît derrière comme un rideau | Moyenne | Backlog |
| 9 | **MorphShape** | Forme simple qui se transforme (cercle→carré→triangle) — chaque forme = entité ou époque | Moyenne | Backlog |
| 10 | **StackedBars** | 3-4 barres verticales montent en stagger — comparaison sans labels 3s, labels apparaissent ensuite | Faible | Backlog |

## Prochaine session
Coder FillScreen + OdometerFlip + RadarPing via pipeline Flash → 3.1 Pro → agents parallèles.
