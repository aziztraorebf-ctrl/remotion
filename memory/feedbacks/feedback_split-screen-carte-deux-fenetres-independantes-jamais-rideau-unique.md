Bug de conception découvert et corrigé le 2026-08-07 sur Gazoduc Acte 3 (Segment C, paradoxe
Maroc/Algérie) : un split-screen par "rideau vertical sur une carte D3 unique" échoue
structurellement quand les 2 territoires comparés se chevauchent en X sur la projection choisie —
le rideau coupe alors un territoire en plein milieu, invisible tant qu'on ne regarde pas la
projection réelle.

**Pourquoi** : Maroc et Algérie ont des centroïdes proches en X sur la projection utilisée, mais
l'Algérie (immense) s'étend très loin à l'ouest vers sa frontière marocaine — son bbox chevauche
largement celui du Maroc. Un rideau vertical fixe (`clipPath` rect gauche/droite) tranche donc
l'Algérie en deux au lieu de séparer proprement les deux pays.

**Comment appliquer** : tout split-screen comparatif entre 2 territoires géographiques (carte D3 ou
Mapbox) doit utiliser **2 systèmes de rendu totalement indépendants** (2 `<svg>` ou 2 instances Map),
chacun avec sa propre caméra/cadrage centré sur SON territoire — jamais un seul système de
coordonnées partagé avec un rideau qui suppose une séparation spatiale nette. Vérifier le
chevauchement des bbox AVANT de choisir le dispositif (`minX`/`maxX` des 2 territoires), pas après
avoir vu le rendu buggé.
