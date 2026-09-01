Deux pieges techniques rencontres sur un format vertical etire non-standard (1080x2460 sur le test
MOCH-IT, 2026-08-08), reutilisables sur tout futur projet a ratio inhabituel :

**1. `preserveAspectRatio="xMidYMid slice"` recadre/coupe le contenu si le viewBox du SVG (souvent
issu d'un storyboard genere en 9:16 standard, ex 1080x1920) ne correspond pas exactement au format
cible.** Symptome : texte coupe sur les bords, composition zoomee/decalee par rapport a ce qui a ete
valide en storyboard. Fix : `xMidYMid meet` + etendre le viewBox du SVG a la taille cible exacte
(ex `viewBox="0 -270 1080 2460"` pour partir d'un contenu pense en 1920 et l'etendre a 2460, marge
de 270 en haut et en bas) — jamais laisser le viewBox d'origine avec `slice`.

**2. Un fond de scene en `<path>` complexe (ex un wipe en forme d'escalier) peut sembler correct au
calcul mais laisser des bandes non couvertes en pratique, parce que deux systemes de coordonnees
(une translation animee + la geometrie locale du path) se melangent silencieusement.** Symptome
repere par Aziz : "il y a un panneau blanc en dessous du mot, c'est normal ?" — le fond n'etait pas
uniforme sur toute la largeur a certaines hauteurs, un bug invisible en lisant le code mais evident
une fois mesure par pixel (`img.getpixel`). Fix : remplacer par un simple `<rect>` plein qui monte
(une seule variable Y a calibrer, depart hors-cadre + arrivee a la position finale) — bien plus
difficile a mal calculer qu'un path en plusieurs segments. Reflexe : pour un fond de wipe/transition,
partir du rectangle plein par defaut, ne complexifier (path en escalier, forme dentelee) que si
un besoin visuel precis le justifie et alors VERIFIER par pixel-sampling (pas juste au visuel) que
le fond reste uniforme sur toute la largeur a chaque instant de l'animation.
