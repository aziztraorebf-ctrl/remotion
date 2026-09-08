# L'ordre de rendu EST le sujet : ce qu'on voit A TRAVERS se dessine AVANT

Quand une piece doit apparaitre **a travers l'ouverture** d'une autre (roues sous une
platine ajouree, composants sous un chassis perce), elle se dessine AVANT celle qui la
recouvre. Le SVG n'a pas de z-index : l'ordre du document EST la profondeur.

    cuvette  ->  ROUES  ->  platine ajouree        ✅ les roues apparaissent dans les trous
    cuvette  ->  platine  ->  roues                ⛔ les roues passent par-dessus

**Why:** le 2026-09-05, apres avoir extrait les 10 pieces tournantes du groupe
`mouvement-horloger` pour pouvoir les animer, elles se retrouvaient rendues APRES la
platine — donc par-dessus. Le mecanisme se lisait **a plat, en autocollant** au lieu
d'etre vu a travers les fenetres decoupees de la platine. Le dessin d'origine avait le
bon ordre ; c'est mon extraction qui l'a casse.
⭐ La correction n'est pas un reglage : il faut **couper le groupe fixe en DEUX** (ce qui
est dessous, ce qui est dessus) et intercaler les pieces mobiles entre les deux.

**How to apply:**
- Reperer la forme-frontiere (ici la platine, 28e forme sur 128) et scinder le composant
  fixe en `...Cuvette` (avant) et `...Platine` (apres).
- Rendre : `<Cuvette /> {pieces mobiles} <Platine />`.
- ⛔ Verifier au RENDU, pas dans le code : un ordre faux ne produit aucune erreur, juste
  une image qui « fait sticker » sans qu'on sache pourquoi.
- ⚠️ Corollaire : extraire une piece d'un groupe pour l'animer CHANGE sa profondeur. Se
  demander systematiquement ce qui doit la recouvrir.

Lie a [[rotation-svg-le-rotate-va-DANS-le-groupe-qui-porte-le-translate]],
[[couche-complementaire-plutot-que-redessiner]].
