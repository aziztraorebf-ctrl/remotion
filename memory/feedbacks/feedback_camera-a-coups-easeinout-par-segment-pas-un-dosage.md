# Caméra « par à-coups » = bug de structure d'interpolation, pas un problème de dosage

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Quand Aziz rejette un mouvement de caméra en disant « elle approche, stop, elle approche, stop » ou
« ça avance par à-coups », **ce n'est presque jamais un problème de dosage** (amplitude, scale, timing
des points). C'est un bug de STRUCTURE d'interpolation.

Cause mécanique : `easeInOut` a une dérivée nulle à ses DEUX extrémités. Appliqué indépendamment sur
chaque segment entre points de contrôle (`easeInOut((frame - T[i]) / (T[i+1] - T[i]))`), il met la
vitesse caméra à **exactement 0 à chaque point de passage**. La position reste continue (aucun saut
visible, aucun gel détecté par un hash), mais la vitesse est discontinue → stop-and-go perçu.

Vécu 2026-08-14, Gazoduc Acte 3 Beat 1 : **3 itérations complètes perdues** à retoucher les valeurs
des 9 points de contrôle. Mesure après délégation à un agent : v = 0.00 px/frame aux 7 keypoints,
d(scale) = 0.0000. Le fix n'était pas de re-doser mais de supprimer le mécanisme : un seul zoom
monotone sur toute la durée + un centre qui suit une position continue. Résultat mesuré : vitesse min
0.000 → 0.011, pic 765 → 12.7 px/frame.

**Why:** re-doser un paramètre ne peut pas corriger une dérivée nulle structurelle — chaque itération
produit le même symptôme, ce qui donne l'illusion que « ça ne marche jamais » et brûle la confiance.

**How to apply:**
1. Au 2e rejet du même symptôme de mouvement, ARRÊTER de retoucher des valeurs (protocole des 2 échecs).
2. Mesurer la vitesse frame à frame hors render (script Node qui rejoue la logique caméra) : si elle
   tombe à 0.000 quelque part, c'est le bug. Un pic énorme (ex. 765 px/f) signale l'inverse : un index
   arrondi qui fait avancer par paliers (`Math.round` sur un index de samples).
3. Chercher la brique continue existante AVANT de coder — voir [[globe-d3-reutiliser-briques-exactes-pas-variante-maison]].
4. Formulation qui ne peut pas produire d'à-coups : zoom = fonction monotone du temps avec UN SEUL
   easing sur toute la plage ; centre = position interpolée en continu (jamais un index entier).

Voir aussi [[frame-espacee-sous-estime-mouvement]] et [[verifier-code-et-visuel-avant-de-reutiliser]].
