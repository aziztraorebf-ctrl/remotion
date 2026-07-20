---
name: warmap-sahel-short-90s-storyboard-agent-b
description: 2e storyboard (aveugle d'Agent A) pour le Short AES 90s, meme direction d3-geo tranchee — signature "la carte qui s'ecrit", fracture CEDEAO qui se referme au panel suivant via le sceau AES
metadata:
  type: project
---

Storyboard panel-par-panel complet ecrit dans `memory/episodes/warmap-sahel/STORYBOARD-AGENT-B.md`
(2026-07-07), execute EN AVEUGLE d'un autre agent creative-director (`STORYBOARD-AGENT-A.md`, voir
[[warmap-sahel-short-90s-storyboard-panel-driven]]) sur le MEME brief. Meme direction visuelle deja tranchee
par Aziz (carte d3-geo pure, un seul cadre continu) — pas de proposition de concept, execution des gestes.

**Why**: Angle demande = audace des gestes d'animation, pas convergence avec l'autre agent. Utile de garder
les 2 storyboards distincts en memoire pour qu'Aziz puisse arbitrer/fusionner plutot que privilegier un seul
recit de session.

**Signature propre (la ou le brief laissait la main)** : "la carte qui s'ecrit" — chaque panel AJOUTE une
couche d'encre sur la carte (trait, fill, symbole) sans jamais effacer la precedente avant que le sens
exige une rupture. Difference cle avec Agent A : la fracture CEDEAO (panel 8b) NE SE REFERME PAS entierement
dans son propre panel — elle reste ouverte a `recompose=0.7`, et le panel 9 (naissance AES) l'acheve en
faisant apparaitre le sceau AES EXACTEMENT au point de jonction de la fracture. C'est 1 seul mouvement
continu sur 2 panels, pas 2 effets juxtaposes — a verifier si Agent A a le meme lien ou traite les 2 comme
independants.

**Decouvertes qui recoupent Agent A (deja connues, non re-decouvertes a l'aveugle par coincidence)** :
- `SahelAttackArrow.tsx` Mapbox-only, `libya-outline.geojson` deja present, `ly.png` absent mais non
  bloquant (aplat couleur) — memes conclusions qu'Agent A, bon signal de convergence factuelle.

**Decouverte NOUVELLE (absente d'Agent A a verifier)** : ambiguite factuelle sur le drapeau Libye pour le
geste "vire gris puis rouge" — tricolore post-2011 (rouge-noir-vert-croissant, l'Etat instable APRES
Kadhafi) vs vert uni Kadhafi (l'Etat D'AVANT la chute de 2012 que le script decrit). J'ai suppose le
tricolore (plus de sens visuel pour un geste de bascule/effondrement d'un Etat qui existe puis vacille),
mais c'est un point a verifier avant render, pas a trancher seul.

**How to apply**: Ne pas relancer un 3e storyboard sans raison — Aziz doit d'abord arbitrer entre A et B
(ou fusionner). Si le point cadrage vertical (carte ancree tiers-bas de l'ecran, propre a ce storyboard B)
est valide, il conditionne tout le reste du code — le tester en preview isole avant d'investir plus loin.
