---
name: reprise-scene-2-comparaison
description: "Prompt de reprise — scène 2 V3 Sénégal (comparaison Norvège/Congo-Brazzaville/Botswana, carte Mapbox, réf Beat10)."
metadata: 
  node_type: memory
  type: project
  originSessionId: d4356163-8699-4839-8981-58ef08a0a76e
---

# REPRISE — Scène 2 V3 : comparaison Norvège / Congo-Brazzaville / Botswana (2026-06-23)

> ⛔⛔ **PÉRIMÉ — LA SCÈNE 2 EST FAITE ET GRAVÉE FINALE (2026-06-24)** : `out/episodes/senegal-petrole-gaz/scene2-comparaison-FINAL.mp4`
> (composant `beats/SceneComparaisonV3.tsx`). NE PAS produire à partir d'ici. PROCHAINE = **scène 4 (la dette)**.
> SOURCE DE VÉRITÉ : `V3-REFONTE/README.md` + `out/episodes/senegal-petrole-gaz/_ASSEMBLAGE-V3.md`.
> Ce fichier ne reste que comme archive du prompt initial de la scène 2.

> Prompt prêt à coller en début de prochaine session. La scène gisements (scène 1b) est TERMINÉE/finale.

## PROMPT

```
Continue la refonte V3 du Sénégal Pétrole & Gaz — PROCHAINE SCÈNE : scène 2 (comparaison Norvège / Congo-Brazzaville / Botswana).

CONTEXTE : scène gisements V3 TERMINÉE, validée, gravée finale, nettoyée. 3 parties V3 faites (audio 0→122s = 25%). Reste 6 scènes (~75%).

⛔ À LIRE D'ABORD (source de vérité, dans cet ordre) :
1. out/episodes/senegal-petrole-gaz/_ASSEMBLAGE-V3.md — carte des renders finaux + roadmap + plan d'assemblage (gitignoré, sur disque).
2. memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/README.md — tableau des 8 scènes.
3. feedbacks/feedback_ne-pas-inventer-forme-scene-verifier-livrable.md — ⚠️ NE PAS inventer la forme/sujet : VÉRIFIER le réel (frame render V1 + beat).

ÉTAT DES 3 PARTIES FINALES (out/episodes/senegal-petrole-gaz/) :
- scene0-hook-FINAL.mp4 (32s) · scene1-intro-coin-FINAL.mp4 (30s) · scene-gisements-FINAL.mp4 (70.7s, avec musique).

LA SCÈNE À FAIRE — scène 2 (audio 122→185s) :
- Sujet (texte vérifié) : Norvège (fonds souverain 1500 Mds$, pétrole mer du Nord 1969) / Congo-Brazzaville (même époque → endetté/pauvre) / Botswana (diamants 1966 → institutions). Thèse : « ce qui décide = les RÈGLES, pas la ressource. »
- FORME (vérifiée) : CARTE MAPBOX. Réf V1 = src/projects/souverain/senegal-petrole-gaz/beats/Beat10.tsx (1 carte continue, caméra voyage Norvège→Congo→Botswana, marqueurs sonar, nom pays en or). Render V1 = out/episodes/senegal-petrole-gaz/beat10-FINAL.mp4 — l'une des plus réussies selon Aziz. → la REPRENDRE et la premiumiser (pas repartir de zéro).

MÉTHODE (réappliquer) :
- D'abord EXTRAIRE frames de beat10-FINAL + LIRE Beat10.tsx (voir ce qui marche).
- Audio-derived : force alignment Whisper du segment 122-185s (scripts/tools/whisper-align.py). NE PAS se fier à scene1-alignment.json (désync ~20s, prouvé).
- Doctrine carto : memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md (drapeaux MapboxCountryFlagDecal + clipBbox DOM-TOM ; jetons SVG GPT-5.5). Cible = CartoSouverainV5.
- Render : ./scripts/render-mapbox.sh (--gl=angle). Gate : mapbox-selfreview.py (E6 sur overlay plein écran = faux positif à ignorer). Catbox plein format, juger en mouvement.

⚠️ MULTI-INSTANCES : vérifier l'état réel du fichier avant d'éditer, commit tôt, git add chirurgical (jamais -A).

À LA FIN : render → scene2-comparaison-FINAL.mp4 + cocher _ASSEMBLAGE-V3.md + README.

DÉMARRE PAR : confirmer l'état réel (2-3 frames beat10-FINAL, lire Beat10.tsx, mesurer audio 122-185s), puis propose le plan scène 2 premium (garder de la V1 vs élever) AVANT de coder.
```

## Roadmap restante (après scène 2)
3 Terrain 1 contrat (Remotion, réf Beat11) · 4 Terrain 2 dette 132% (Remotion, réf Beat12 calebasse) ·
5 Terrain 3 coulisses Yakaar (Remotion, réf Beat13) · 6 Bilan zéro→exportateur (réf Beat14) ·
7 BONUS fracture+AES (nouveau) · puis ASSEMBLAGE FINAL (concat 8 scènes + mix musique globale).
```
