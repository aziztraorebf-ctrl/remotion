# Un petit objet ne se juge pas sur des frames redimensionnées

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

⛔ **Ne JAMAIS conclure qu'un PETIT objet a disparu/bougé sur la base de frames redimensionnées.**

Vecu 2026-08-19 (test combo action+camera, scribe de Tombouctou). J'ai annonce a Aziz : *« la plume
disparait du champ au lieu de rester posee sur la table »* — et je l'ai ecrit dans la fiche memoire.
**FAUX.** Aziz au visionnage : la plume est bien posee sur la table et **y reste** pendant qu'il se
leve et jusqu'a la fin. Le defaut n'existait pas.

**Why** : je jugeais sur une planche de 6 frames redimensionnees a ~580 px de large. Une plume fait
quelques pixels a cette echelle — elle se fond dans la table. J'ai lu une absence la ou il y avait
juste un manque de resolution. Le cout : une fausse note en memoire, qui aurait envoye une session
future corriger un probleme inexistant (et potentiellement casser ce qui marchait).

**How to apply** :
1. **Lister ce qui est PETIT dans le plan** (objet manipule, accessoire, detail de main) AVANT de juger.
2. Pour ces elements : **crop pleine resolution** sur la zone (`PIL crop` sans resize) ou lecture reelle
   de la video — jamais une planche contact.
3. En cas de doute sur un petit element, **le dire au conditionnel** et demander confirmation a Aziz
   plutot que d'ecrire un defaut en memoire. Une fausse note coute plus cher qu'un defaut reel :
   le defaut se voit et se corrige, la fausse note oriente le travail futur dans le vide.
4. Corollaire de [[animation-vs-image-fixe-mesurer-frames-uniques]] : les frames espacees sous-estiment
   le MOUVEMENT, les frames redimensionnees sous-estiment les PETITS OBJETS. Deux biais distincts,
   meme remede — mesurer/regarder au bon niveau de detail.

⭐ **Ce qui a REELLEMENT marche pour l'objet** (a garder) : previs qui dessine l'objet a CHAQUE frame
(dans la main, puis sur la table) + prompt declarant son etat seconde par seconde + negatif
`no floating objects, no object sliding by itself, no teleporting pen, no disappearing pen`.
