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

## ⚠️ Enregistrer dans Root.tsx SANS casser le bundle (A8 — incident connu)
`src/Root.tsx` (~3200 lignes) est un monolithe : un import vers un fichier inexistant casse le bundle ENTIER
(plus aucun render possible — incident documenté). Procédure sûre, dans l'ordre :
1. Créer le `.tsx` et vérifier `ls` qu'il existe AVANT de l'importer.
2. Ajouter l'import + le `<Composition>` ensemble (même édition logique).
3. `npx tsc --noEmit` après (ou laisser le hook post-edit le faire).
4. Multi-agents : UN SEUL agent touche Root.tsx à la fois (liste d'imports linéaire = collision sinon). Commit immédiat.
ℹ️ Le hook post-édit `lint-on-edit.sh` fait un **type-check en LECTURE SEULE** (`tsc --noEmit`) : il ne modifie
aucun fichier. Pas besoin de re-lire après lui (A9).

> Note : l'ancien dossier `src/projects/_proto-16-9/` (42 protos) migre ici au fil de l'eau (pas en big-bang
> pour ne pas casser les 42 imports de Root.tsx). Nouveaux protos → directement ici.
