# Règle : Fork avant reconstruire (Atlas)

**Règle** : Avant d'écrire un seul composant Atlas (carte, label, cartouche, caravane, insert), vérifier si l'équivalent existe dans `src/projects/atlas/_shared/` (catalogue : `ATLAS-COMPOSANTS.md`). Si oui → forker + adapter. Si non → construire et ajouter à `_shared/` + mettre à jour `ATLAS-COMPOSANTS.md`.

**Why** : Session 2026-05-02 — au lieu de forker `AtlasMansaMoussaV2Final.tsx`, on a reconstruit `MapShakaZulu.tsx` from scratch. Résultat : carte amateur vs qualité Mansa Moussa, 2h perdues, confusion Aziz. Cause : VAGUE-2-LOCKED.md spécifiait "nouveaux composants SVG purs" sans que l'impact visuel ait été validé avec Aziz.

**How to apply** :
1. Avant tout code : lire `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md`
2. Si composant équivalent trouvé : copier + adapter (palette, données, projection)
3. Si décision architecturale dans un doc locked implique de reconstruire → lever le flag à Aziz AVANT de coder : "Ce doc dit de reconstruire X mais X existe déjà dans _shared/ — confirmes-tu ?"
4. Chaînes pro (Vox, Johnny Harris) : même template, nouvelles données. C'est le modèle.

**Note post-restructuration 2026-05-02** : `quebec-jacques-poc/src/` reste en place (Mansa Moussa production), mais les composants partagés ont été copiés dans `_shared/`. Chercher d'abord dans `_shared/`, puis `quebec-jacques-poc/src/` en dernier recours.

---
Migré depuis auto-memory (`feedback_fork-avant-reconstruire.md`) le 2026-08-31, contenu original inchangé.
