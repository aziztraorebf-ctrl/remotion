---
name: Verifier l'etat reel sur disque avant d'affirmer l'etat d'un projet
description: Les scripts draft peuvent etre obsoletes — les manifests dans src/projects/ et les assets dans public/ sont la source de verite
type: feedback
---

Migré depuis auto-memory 2026-08-31 (feedback 2026-04-13).

## Regle

**AVANT d'affirmer l'etat d'un projet, TOUJOURS verifier sur disque** (assets, timing.ts, manifests). Ne pas se fier uniquement aux scripts draft ou aux memoires anciennes qui peuvent etre obsoletes.

## Why

Incident 2026-04-13 : affirmation qu'un Short (Soundjata) etait "75s / 5 clips" en se basant sur un draft V1 obsolete. La realite etait 129.1s / 8 Actes selon le plan final plus recent. Aussi oublié que plusieurs clips etaient deja generes et qu'un acte etait termine. Cette confusion a cree du bruit et a failli faire relancer des travaux deja faits.

## How to apply

Hierarchie des sources de verite (de la plus fiable a la moins fiable) :

1. **Plus fiable** : `src/projects/*/manifests/*.md` (plans finaux, a jour)
2. **Tres fiable** : `public/assets/library/*/` (assets reels sur disque — ce qui existe, existe)
3. **Fiable** : `src/projects/*/timing*.ts` (timings frame-precis produits)
4. **Fiable** : fichiers memoire etat projet a jour (`memory/episodes/*/STATUS.md` dans le repo actuel)
5. **Moins fiable** : `scripts/*/draft-name.md` (peut etre obsolete, V1 remplace par V2/V3 plus tard)
6. **Pas fiable** : propre memoire de session anterieure sans verification

**Action concrete** quand on parle d'un projet actif :
- Lire les manifests/STATUS EN PREMIER (pas les vieux drafts scripts/)
- Lister les assets reels dans `public/assets/` pour voir ce qui existe deja
- Seulement APRES, si besoin d'historique : lire les scripts draft

Cette règle est le précurseur direct de la règle "Vérifier CODE + VISUEL avant d'agir sur un livrable
passé" du CLAUDE.md actuel — même principe, appliqué initialement au texte/manifest plutôt qu'au rendu.
