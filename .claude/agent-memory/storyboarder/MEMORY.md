# Storyboarder Agent — Persistent Memory (index)

## Role Summary
Produce `SCENES` et `BEATS` TypeScript constants a partir d'audio MESURE (ffprobe/Whisper).
`timing.ts` = source de verite (pas de scenes.json dans ce pipeline). Jamais d'estimation,
jamais `expected_duration_sec` comme source de timing.

Detail complet des regles et patterns : [`RULES.md`](./RULES.md).
Detail complet des projets (actifs + archives) : [`PROJECTS.md`](./PROJECTS.md).

---

## PRE-FLIGHT CHECKLIST (rapide — detail dans RULES.md)
Script LOCKED ? Audio mesure (pas estime) ? FPS explicite ? Format flat/nested justifie ? Somme
scenes == duree totale (delta <1 frame) ? Hook -> cumulative initial = HOOK_FRAMES ? Handoff
PIPELINE.md ecrit ?

## SEUIL FORMAT (rapide — detail + cas particuliers dans RULES.md)
<90s ou <8 scenes -> flat (A). >=90s ou actes narratifs explicites -> nested (B). Zone grise
60-90s -> demander a Aziz. Short lineaire >90s sans actes distincts -> reste flat (cf. Soudan Short).

## Regles non-negociables (1 ligne chacune — detail RULES.md)
- Handoff PIPELINE.md obligatoire a chaque livraison (6 lignes, format dans RULES.md).
- Duree clip visuel >= duree narration de la scene, TOUJOURS (arrondi seconde superieure) —
  jamais combler par boucle muette (lecon Soundjata Acte VII).
- Hook = frontieres absolues start/end, jamais de durees relatives.
- Ordre des beats = ordre NARRATIF de l'audio (forced-alignment), jamais l'ordre des clips du brief.
- Silences inter-blocs : toujours absorbes dans la scene PRECEDENTE, jamais un gap non-attribue —
  reverifier avec un script de controle independant (round(sec*FPS)==frame + timestamp existe
  reellement) avant de livrer (lecon Soudan Short).

---

## Projets actifs (detail -> PROJECTS.md)
- **Abou Bakari II** — LOCKED 2026-04-30. `src/projects/geoafrique-shorts/timing-abou-bakari.ts`,
  9 beats, 94.96s, READY FOR STAGE 3.
- **Soudan Short** — LOCKED 2026-08-01. `src/projects/warmap/shorts/soudan-short/timing.ts`,
  7 blocs, 111.34s, 26 beats geo-reperes, READY FOR STAGE 3 (attend adaptation GlobeRecitProto 9:16).

## Archives
Peste 1347 (abandonne 2026-02-21) — voir PROJECTS.md.
