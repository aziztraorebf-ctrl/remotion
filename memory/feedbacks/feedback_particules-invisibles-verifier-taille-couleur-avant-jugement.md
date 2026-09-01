# Effet de particules jugé "raté" au premier jet — suspecter taille/distance/contraste avant de refaire le concept

Avant de conclure qu'un effet de particules/dissolution "ne marche pas" et de changer de concept, vérifier
dans l'ordre : (1) la frame de test correspond-elle au pic de visibilité de l'effet, (2) taille et distance
de dispersion sont-elles suffisantes à l'échelle 1920×1080, (3) le contraste couleur-élément vs fond est-il
suffisant.

**Why** : sur le Beat 6a CFA, l'effet de dissolution en particules ("Thanos snap") était quasi invisible au
premier jet — cause : frame de test choisie trop tardive dans la fenêtre d'animation, particules trop
petites, couleur or sur fond bleu nuit standard Souverain (`#182746`) peu contrastée pour de PETITS éléments
dispersés. Corrigé en augmentant taille + distance d'envol et en passant la couleur des particules au
blanc-cassé (couleur du texte de la charte) avec un halo doré en complément. Sur le fond bleu nuit standard
Souverain, l'or (couleur signature pour les éléments clés) a un contraste plus faible qu'attendu pour un
effet composé de petits éléments dispersés — contrairement à un élément plein/grand (jeton, texte) où l'or
lit bien.

**How to apply** : sur fond bleu nuit Souverain, préférer blanc-cassé/clair pour de PETITS éléments
dispersés (particules, points), réserver l'or aux éléments pleins/grands (jetons, contours, texte). Un
effet "raté" au premier essai peut être un problème de paramètres physiques (taille, distance, frame de
sampling) plutôt qu'un problème de concept — vérifier ces 3 points avant de changer d'approche. Le composant
partagé résultant `_shared/svg-library/elements/effects/ParticleDissolve.tsx` encode déjà ce choix de
couleur par défaut — le réutiliser plutôt que repartir de l'or par défaut sur un futur effet de particules.

Le composant `ParticleDissolve.tsx` est mentionné dans `projects/GAZODUC-MEGAPROJETS-SUJET.md` (usage pour
drapeaux clippés / tracé qui s'efface) mais sans cette leçon de calibration — ce fichier comble ce trou.

---
Migré depuis auto-memory (`feedback_particules-invisibles-verifier-taille-couleur-avant-jugement.md`) le
2026-08-31, contenu original inchangé.
