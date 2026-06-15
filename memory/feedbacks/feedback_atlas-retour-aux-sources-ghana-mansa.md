# ATLAS — Retour aux sources : le playbook se dérive de Ghana + Mansa Moussa (NON-NEGOTIABLE)

> Décision Aziz 2026-06-03 (session R&D Cannes/flèches). CORRECTION DE MÉTHODE majeure.
> À LIRE avant tout travail de playbook/template/beat Atlas.

## L'erreur corrigée

La R&D Atlas (mapanimation → flèches → scènes Cannes/Hannibal) a été bâtie sur une
référence EXTERNE non validée (mapanimation) et des sujets HYPOTHÉTIQUES (Cannes, Hannibal
— jamais produits). C'est l'inverse de ce qu'on a fait pour Souverain, où le playbook
DÉRIVE de nos vidéos validées. **On a mis la charrue avant les bœufs.**

## La règle (miroir de la méthode Souverain)

**Le playbook Atlas DOIT se dériver de ce qui est VALIDÉ et qui MARCHE.** Nos deux meilleures
Atlas pures, qui définissent "Atlas réussi" :
- **Empire du Ghana** (`empire-ghana-FINAL-v2.mp4`, 105s) — référence des ENCADRÉS data qui
  apparaissent (le sel et l'or), overlays, rythme.
- **Mansa Moussa pèlerinage** (`mansa-moussa-atlas-v2-FINAL.mp4`, 121s) — référence des
  OVERLAYS (parfaits) + intégration PERSONNAGES PIXELLAB (work cycles, séquentiels).

Ces deux vidéos = LE template Atlas à étudier. Tout le reste (mapanimation, flèches) =
ENRICHISSEMENT/idées qui viennent compléter, JAMAIS la fondation.

## Ce qui est validé et GARDÉ comme template (pas jeté)

`AtlasAttackArrow` + `AtlasEncirclement` + projections paramétrées (geoUtils) = template
"flèches tactiques" valide, à sauvegarder dans le catalogue Atlas. Mais il ENRICHIT un système
ancré dans Ghana/Mansa Moussa. Cf. [[feedback_atlas-inspiration-externe-faisabilite]].

## Le chantier (ce qu'on construit)

1. **DÉCODER** Ghana + Mansa Moussa frame-par-frame ET code-par-code (le résultat validé +
   le comment). Inventorier : overlays, encadrés (apparition, timing), mouvements, rythme,
   ET chorégraphie des sprites PixelLab (quel cycle, apparaît où, quand).
2. **PLAYBOOK ATLAS** dérivé de ce décodage (miroir SOUVERAIN-VISUAL/REMOTION-PLAYBOOK) —
   principes + vocabulaire de mouvements validés, PAS une mise en page figée (règle anti-clonage).
   Routage 2 sources : "pour CE besoin → réf Ghana / pour CE besoin → réf Mansa Moussa".
3. **SYSTÈME DE DÉMARRAGE DE BEAT ATLAS** (miroir du `/beat` Souverain) : au début d'un beat,
   scanner les templates, savoir quel mouvement est validé, qu'est-ce qui apparaît où. Atlas est
   PLUS dur que Souverain à cause de PixelLab → la couche sprite est un volet dédié du système.

## Points de réserve Claude (validés à intégrer, pas des désaccords)

1. **Anti-sur-rigidification** : extraire les PRINCIPES + le vocabulaire, pas figer un moule
   (sinon clones). Le playbook Souverain a une règle anti-clonage — Atlas aussi.
2. **Les 2 vidéos sont COMPLÉMENTAIRES** pas interchangeables : Ghana = encadrés data,
   Mansa Moussa = overlays + sprites mouvement. Routage par besoin.
3. **PixelLab = le morceau dur** : "quel sprite, quel cycle, apparaît où, quand" = couche dédiée
   (N2 "sprite = acteur" de l'échelle d'escalade). Cf. [[atlas-pixellab-differentiel]].

## Sources survivantes (vérifiées 2026-06-03)

- **GHANA — code VIVANT** : `src/_archive/episodes-livres/atlas/empire-ghana/` (EmpireGhanaFull.tsx
  + scenes/ + components/ + manifest + timing). Data géo : `data/geo/empire-ghana-data.json`.
- **MANSA MOUSSA — RESTAURÉ 2026-06-03** depuis git `50a79a6^` (avait été purgé) :
  - Code : `src/projects/atlas/_reference/mansa-moussa-v2/` (17 fichiers : scenes/ + AtlasPixelChar
    + atlas-v2-components/flags/shared-defs + data.json 2.3MB + narration-words). Type-check OK.
  - **Assets PixelLab : `public/atlas-mansa-moussa/` (79 fichiers, 6.8MB, restaurés de git)** —
    4 persos sprites (mansa-moussa couronné, porteur-mali, soldat-mali, chameau) walk_cycle
    east/west + royal_pose, PNG 92×92 RGBA + SFX + portraits + icônes + chibi. Le différentiel
    PixelLab est SAUVÉ.
  - Orchestrateur + timing restent dans `_archive/.../mansa-moussa/` (couplage `_reference→_archive`
    pour timing-mansa-moussa-v2 ; à rendre autonome si on veut re-render : copier orchestrateur+timing
    dans `_reference/`).
- **Décodages complets** : `memory/atlas-decode/DECODE-empire-ghana.md` + `DECODE-mansa-moussa.md`.
- Renders validés : `out/PRET-PUBLICATION/empire-ghana-FINAL-v2.mp4` + `mansa-moussa-atlas-v2-FINAL.mp4`.
- **Spritesheets Ghana** : à vérifier (l'agent a noté Mécanisme 2 frames PNG `getSpriteFramePath`,
  via shaka-zulu/helpers/spritePlayer.ts — localiser si besoin pour Ghana barter/invasion).

## Bug technique à ne pas refaire (lisibilité)

Réutiliser une carte Atlas FIGÉE (paths pré-projetés à une échelle) + zoom transform ×80 →
ILLISIBLE (on plonge dans l'intérieur uni d'un pays, plus de côte = "fond océan", cf. Cannes
Hannibal f410). Pour une échelle locale (bataille), REPROJETER la carte localement (geoMercator
à la bonne scale), comme la 1re démo Cannes (catbox 806sj2) qui était propre. Ne pas sacrifier
la lisibilité pour réutiliser un asset.
