# Retourner un objet en SVG : passer par une largeur NULLE, il n'y a rien a dessiner

Un objet plat peut se « retourner » de facon convaincante sans aucune 3D : le comprimer
horizontalement jusqu'a `scaleX = 0`, puis faire repartir l'AUTRE FACE de 0 vers 1.

**Why:** le 2026-09-05, Aziz a pose le probleme que le thermostat n'avait pas : la plupart
des objets s'ouvrent PAR L'ARRIERE (une camera, un boitier, un telephone). L'interieur
n'est donc pas derriere la face qu'on regarde. Ses deux pistes etaient (a) deux plans
coupes — honnete mais on perd la continuite, c'est du montage ; (b) un retournement
continu — impossible proprement, un vrai pivot 3D exige les faces intermediaires (tranches
vues sous tous les angles) que le modele devrait INVENTER, et inventerait mal.
La 3e voie marche parce qu'a l'instant du basculement **l'objet est reduit a une ligne
verticale : il n'y a rien a dessiner**. L'oeil lit un retournement complet alors qu'aucun
angle intermediaire n'existe. C'est la meme formule que la porte du thermostat
(`scaleX(cos)` = projection d'une rotation autour d'un axe vertical), appliquee a l'objet
entier. ⭐ **L'ancre dit de quel geste il s'agit** : ancree au BORD = une porte qui s'ouvre ;
ancree au CENTRE = une piece qu'on retourne dans la main.

**How to apply:**
- `angle 0->180`, `largeur = |cos(angle)|`, et on bascule la face affichee quand `cos < 0`.
- ⛔ **CONDITION** : les deux faces doivent avoir EXACTEMENT la meme emprise (memes bords,
  meme hauteur). L'exiger dans le brief du dessin — un decalage et le retournement saute.
- ⛔⛔ **NE PAS ajouter de `scale(-1,1)` « parce qu'une face arriere est inversee »** : si
  le modele a dessine le dos d'apres une PHOTO prise de ce cote, il est DEJA dans le bon
  sens. Le miroir est porte par le dessin, pas par le code. Vecu : au rendu on lisait
  « 0808 nasnux » au lieu de « xunsan 502030 » sur l'etiquette de la batterie.
- Enchainer ensuite l'ouverture du capot avec la meme formule, ancree sur SA charniere.

Lie a [[couche-complementaire-plutot-que-redessiner]], [[photo-de-reference-bat-la-liste-d-organes]],
[[camera-svg-g-transform-jamais-viewbox]].
