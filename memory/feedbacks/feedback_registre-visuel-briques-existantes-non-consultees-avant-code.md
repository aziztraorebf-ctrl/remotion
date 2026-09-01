Découverte du 2026-08-07, par comparaison directe du rendu Gazoduc Acte 3 (v2) avec deux productions
déjà livrées du même projet : le Soudan mid-form (`KhartoumEtatMajorSVG.tsx`, `KostiInsertSVG.tsx`)
et le Short AES (`aes-short-90s-FINAL.mp4`).

**Ce que le Soudan et l'AES font déjà, et que le Gazoduc n'a pas repris** :
- AES : drapeaux réels remplissant les territoires + icônes-ressources (or/uranium/pétrole) en
  pastilles rondes ancrées géographiquement sur la carte — pas des formes géométriques abstraites.
- Soudan : un vrai registre "carte d'état-major" pour les inserts scène-lieu — grille tactique,
  croix de visée, bâtiments en pictogrammes détaillés et reconnaissables (pas des rectangles), jetons
  de faction qui se DÉPLACENT physiquement sur la carte, cartouches façon documentaire militaire.

**Ce que le Gazoduc a fait à la place** : des jetons "Landmark" en formes géométriques inventées à la
main pour représenter le financement, un insert aéroport isolé sans carte de contexte ni mouvement de
force — un registre nettement moins incarné, alors même que les briques permettant de faire mieux
existent déjà et sont cataloguées (`MAPBOX-COMPOSANTS.md`, `CATALOGUE-CARTE-VIVANTE.md`,
`COMPOSANTS-INDEX.md`, `WARMAP-COMPOSANTS-INDEX.md`).

**Cause** : ces catalogues n'ont pas été consultés avant de coder le Gazoduc Acte 3. C'est la règle
"chercher/réutiliser l'existant avant de créer" (déjà dans CLAUDE.md) appliquée aux BRIQUES VISUELLES
elles-mêmes, pas seulement aux fichiers mémoire/doctrine — un angle mort qu'il est facile de rater
parce que le réflexe "chercher avant de créer" s'applique plus spontanément à la documentation qu'au
code de scène.

**Comment appliquer** : avant de coder tout insert scène-lieu ou dispositif de données sur une carte,
scanner explicitement `MAPBOX-COMPOSANTS.md` + `CATALOGUE-CARTE-VIVANTE.md` + `COMPOSANTS-INDEX.md` +
`WARMAP-COMPOSANTS-INDEX.md` pour voir si une brique existante (même conçue pour un autre épisode)
couvre déjà tout ou partie du besoin — pas seulement au niveau du concept (carte vivante, oui) mais au
niveau de l'EXÉCUTION (jetons animés, drapeaux réels, grille tactique). Voir aussi
[[feedback_regle-ecrite-insuffisante-sans-gate-outille]] : ce même chantier a révélé que le vrai trou
est l'absence de mécanique qui force cette consultation, pas l'absence de la règle elle-même.

Probable 3e passage nécessaire sur le Gazoduc Acte 3 pour intégrer ce registre — pas encore fait à la
date de cette note.
