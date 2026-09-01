# Avant d'inventer une pose par tâtonnement, chercher si elle existe déjà sur l'autre moteur du même registre

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Le probleme** (2026-08-03, registre stick-figure, pose "corps effondre au sol") : 2 agents
dedies, 2 rounds independants, 8 variantes de pose testees a la main (angles/flexions ajustes,
verifiees par calcul geometrique) pour faire tenir un personnage couche au sol sur le moteur
`<Stick>` — aucune n'a convaincu (soit echec au calcul pur, soit pose qui "lit" comme un baton
ou quelqu'un qui se debat plutot qu'un corps inerte). Le 1er prototype avait meme conclu, par
calcul, que la pose etait "arithmetiquement impossible" sur ce moteur (bras trop long).

Aziz a pose la question qui a tout debloque : *"je suis sur d'avoir deja vu un personnage tomber
vers l'avant dans nos modeles — si ca existe, pourquoi repartir de zero ?"* Il avait raison : la
pose `P_SOL` existait deja, VALIDEE EN PRODUCTION, dans `GestesLocomotion16x9.tsx` (geste
`BandeChute`, moteur `<Figure>` — l'AUTRE moteur du meme registre). Un 3e agent a porte cette
pose par IK geometrique (methode deja prouvee sur une autre pose-cle du meme fichier) en ~1 passe.

**Cause racine du blocage des 2 premiers agents** : aucun des deux n'a ouvert
`GestesLocomotion16x9.tsx` (la planche de gestes de LOCOMOTION) alors que le sujet etait un
enchainement de gestes EXPRESSIFS — ils ont cherche/invente dans le mauvais sous-registre au lieu
de balayer TOUT le registre pour une pose deja validee. Le 1er prototype avait meme cite ce
fichier (il en reprenait le geste de chute `P_CHUTE`) mais sans remarquer que la MEME bande
contenait aussi `P_SOL`, la pose finale — lecture partielle d'un fichier deja ouvert.

**Le vrai diagnostic technique etait aussi faux** : "bras trop long, contrainte arithmetique"
n'etait pas la cause reelle (verifie par balayage exhaustif 14u-46u, 0 solution partout). La
vraie cause etait un parametre absent (`headTuck`, "rentrer la tete") que l'AUTRE moteur avait
deja et que personne n'avait pense a chercher/transposer, faute d'avoir compare aux deux moteurs
cote a cote.

**Regle a appliquer** : avant de conclure qu'une pose/geste/etat est impossible ou de le
construire par tatonnement (angles ajustes a la main, meme verifies par calcul), chercher dans
TOUT le registre (toutes les planches, tous les moteurs, pas seulement le fichier deja ouvert
pour une autre raison) si une pose equivalente existe deja, validee. Si elle existe sur un AUTRE
moteur du meme registre : porter par IK geometrique (position de main = donnee objective, jamais
retraduire un angle) plutot que reinventer — c'est souvent plus rapide qu'un seul round de
tatonnement, et le resultat est deja valide visuellement par construction.

**Lien avec la doctrine existante** : variante specifique de
[[feedback_globe-d3-reutiliser-briques-exactes-pas-variante-maison]] (meme piege racine : ne pas
chercher/reutiliser l'existant avant de batir une variante maison) — mais ici le piege est en
amont : ce n'est pas "j'ai lu la reference et mal applique", c'est "je n'ai pas cherche assez
large dans le registre avant de conclure a l'impossibilite et de tatonner". Egalement lie a la
regle CLAUDE.md projet "ameliorer l'existant avant de creer", qu'il faut appliquer aussi aux
POSES/GESTES d'un registre d'animation, pas seulement aux fichiers de code/doctrine.
