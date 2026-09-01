# Thiaroye 1944 — Pivot paper-craft (2026-04-19)

> Migré depuis auto-memory 2026-08-31. Épisode aujourd'hui publié/clos. Conservé pour l'historique
> de production et les contraintes de style spécifiques (utile si un projet similaire au ton grave
> revient au style paper-craft).

## Decision

Aziz decide de pivoter Thiaroye vers le style paper-craft palette froide. Les clips Kling existants (9 clips, style sepia-gold documentary) sont abandonnes. L'audio v6 (110s) et le script V4 (7 scenes, DA Kimi) restent.

**Why** : Thiaroye n'avait pas beaucoup progresse dans l'ancien style. Le paper-craft palette froide a ete valide (5/5 i2v Seedance) et convient parfaitement au ton grave du sujet (massacre militaire 1944). C'est le 3e Short a publier (apres Soundjata + Abou Bakari).

**How to apply** : reprendre le script V4 en adaptant les prompts au style paper-craft. Utiliser le manifest JSON comme roadmap. Travailler en ordre chronologique strict.

## Manifest (historique)

Source de verite : `src/projects/geoafrique-shorts/manifests/thiaroye-manifest.json` (⚠️ projet GeoAfrique archivé depuis)

7 scenes, 110s total :
1. Le Retour (15s, contemplatif, 5 panels)
2. La Revendication (15s, narratif, 5 panels)
3. Le Massacre (17s, action, 7 panels)
4. L'Effacement (17s, contemplatif, 4 panels)
5. Le Jugement (21s, narratif, 5 panels)
6. La Verite Prisonniere (16s, narratif, 5 panels)
7. Le Souvenir / CTA (11s, contemplatif, 4 panels)

## Pipeline paper-craft pour Thiaroye

Le storyboard-to-video echoue en paper-craft (0/3, cf `memory/tools/seedance-rules.md` règle 83).
Le pipeline valide est :

```
Pour chaque scene (15s) :
  1. Generer 3 images paper-craft palette froide (wide, medium, close-up)
  2. Seedance image-to-video 5s chacun
  3. Assembler les 3 clips en Remotion avec transitions
```

## Etat 2026-04-25 (dernier snapshot connu)

**COMPOSITION ASSEMBLEE. Mini-render valide.**

- 8 clips Seedance produits
- 2 Video Extend ($0.91 chacun) : Scene 2 OTS Reveal + Scene 4A Archives
- ThiaroyeShortV5.tsx assemble (timing.ts + remotion-composer)
- Mini-render hook+S1 (18s) valide visuellement
- Budget restant : ~$4.83

## Contraintes paper-craft specifiques Thiaroye

- Palette froide (gris-bleu, khaki, olive) — PAS sepia
- Le mot "mature" dans les prompts Gemini = piege (drift vers BD flat). Changer PALETTE pas ANATOMIE
  (cf `memory/tools/seedance-rules.md` pour la règle générale équivalente).
- La lettre blanche = element narratif valide (objet-pont vers Scene 2)
- Ne PAS demander a la lettre de "briller" ou etre "the brightest" — risque d'artefact magique
