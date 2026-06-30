# IDÉE — Personnage d'encre SVG multi-directions (8 directions, façon sprite PixelLab)

> Idée d'Aziz, session 2026-06-30 (R&D perso d'encre 16:9 narratif). À creuser une fois le rig validé.

## Le constat technique (vérifié, pas confabulé)
- **PixelLab = sprites RASTER** (PNG figés, frames pré-rendues en 4/8 directions). On NE PEUT PAS importer
  un walkcycle PixelLab dans notre perso SVG : un sprite PNG ne devient pas des angles d'articulation.
- **Notre planteur = SVG VECTORIEL paramétrique** (`<path>` calculés par formules, frame-driven via props).
  Mondes techniques différents.

## Mais l'intuition d'Aziz est juste — et mieux que PixelLab sur 2 points
1. **« Contrôle à la seconde près »** : on l'a DÉJÀ, et plus fin. Frame-driven (`useCurrentFrame`) → chaque pose
   pilotée à la frame près via props (walkPhase/bend/armReach). PixelLab = cycle fixe ; nous = chaque instant.
2. **« 8 directions »** = la vraie bonne idée, FAISABLE en SVG. Actuellement le perso n'a que `facing: 1|-1`
   (profil plat G/D). On peut le passer en pseudo-3D top-down : N/S/E/O + diagonales, comme un sprite.
   En SVG paramétrique : dessiner le corps selon un angle de vue (épaules qui tournent, jambes croisées en
   3/4, dos vu de derrière quand il marche « vers le nord »). Plus de travail (coder les vues), mais ensuite
   UN SEUL perso marche dans toutes les directions, sans la limite de ce que PixelLab a généré.

## Pourquoi c'est puissant pour le projet
Débloque un perso qui ne marche plus seulement en ligne droite latérale, mais **traverse un champ EN PROFONDEUR**
(vers le fond = nord), tourne, s'éloigne vers l'usine. Sert exactement le plan-séquence **champ → usine**
(géo de l'injustice cacao).

## Séquencement (pour ne pas coder 2×)
1. D'abord VALIDER quel rig garder (PlanteurFK biomécanique vs PlanteurOrganique courbes) — les directions se
   construiront SUR le rig retenu.
2. Puis sur le rig gagnant : ajouter profil → 3/4 → dos (commencer par 3 vues), puis les 8 si concluant.

## Fichiers
- Rigs candidats : `src/projects/souverain/cacao-chocolat-short/_rnd-perso/Planteur{FK,Organique}.tsx`
- Base actuelle (profil seul) : `components/PlanteurEncre.tsx`
