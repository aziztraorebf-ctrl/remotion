# _proto-16-9/ — Protos 16:9 (EN MIGRATION vers _rnd/)

⚠️ Ce dossier est l'ANCIENNE zone de protos jetables. Depuis le 2026-06-19 (Chantier C anti-fouillis),
la zone proto canonique est **`src/projects/_rnd/<sujet>/`**.

- **Nouveau proto** → le créer dans `src/projects/_rnd/<sujet>/`, PAS ici.
- **Les 42 protos existants** restent ici en attendant : ils sont importés par `src/Root.tsx` (42 imports)
  + un import inter-protos (`Prototype_D_MapboxStyleComparison`). On NE migre PAS en big-bang (risque build).
  Quand on retouche un de ces protos → on peut le déplacer vers `_rnd/` à ce moment-là (et réécrire son import Root.tsx).

Règle complète des 3 zones : `src/projects/_shared/INTENTION-FORME-INDEX.md` (section « OÙ RANGER CE QUE JE CODE »).
