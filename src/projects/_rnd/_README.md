# _rnd/ — Protos jetables (R&D, test de mécanique)

Zone des prototypes JETABLES : tester une mécanique d'animation, une idée visuelle, un effet.
Pas un livrable. Durée de vie ~7j implicite, se purge.

## Règle des 3 zones (où ranger un .tsx) — voir `_shared/INTENTION-FORME-INDEX.md`
- **Livrable** d'un épisode → `src/projects/<pilier>/<episode>/` (PAS ici).
- **Proto jetable** → ICI, `src/projects/_rnd/<sujet>/`.
- **Brique réutilisable** validée (réutilisée ≥2× ou validée Aziz) → `src/projects/_shared/components/` + indexer.

## PROTO vs LIVRABLE (ne pas confondre)
Ce dossier = **PROTO uniquement**. Render local + self-review scriptée suffisent. PAS de Gemini, PAS de
review.json, présentation libre (le hook `pre-presentation-review.sh` exempte `_rnd/`). Un proto ne va
JAMAIS dans `out/episodes/` et n'est jamais présenté comme « final ».
Si ce que tu codes est destiné à la VRAIE vidéo → ce n'est PAS un proto : va dans `<pilier>/<episode>/`
et passe par la session complète (`/beat`). Table comparative : `_shared/INTENTION-FORME-INDEX.md`.

## Conventions
- Un sous-dossier par sujet : `_rnd/<sujet>/`.
- Enregistrer la compo dans `src/Root.tsx` sous un `<Folder name="proto-<sujet>">` pour la prévisualiser.
- Quand un proto est validé et réutilisé → le PROMOUVOIR vers `_shared/components/` (ne pas le laisser pourrir ici).

> Note : l'ancien dossier `src/projects/_proto-16-9/` (42 protos) migre ici au fil de l'eau (pas en big-bang
> pour ne pas casser les 42 imports de Root.tsx). Nouveaux protos → directement ici.
