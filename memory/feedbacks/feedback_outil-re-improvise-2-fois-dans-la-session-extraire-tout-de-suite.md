# Un outil re-improvise 2 FOIS dans la meme session : l'extraire tout de suite

Le declencheur n'est pas « ai-je un outil pour ca ? » (ca, c'est
[[chercher-outil-existant-avant-improviser]], et il suppose que l'outil EXISTE deja).
C'est : **suis-je en train d'ecrire pour la 2e fois le meme heredoc ?**

**Why:** le 2026-09-05, j'ai re-ecrit **TROIS FOIS** dans la meme session le meme script de
decoupage d'un SVG en composants React — pour les documents+loupe, puis pour le thermostat, puis
pour la camera — a chaque fois dans un heredoc jete juste apres. C'etait pourtant la brique la
plus reutilisable de toute la chaine : sans elle il faut recopier les formes a la main, ce qui
est long et introduit des erreurs.
Extrait a la **4e** occasion seulement (`scripts/tools/svg-vers-calques.py`).

⭐ **Ce que l'extraction tardive a revele** : teste RETROACTIVEMENT sur les 3 SVG deja convertis
a la main, l'outil retrouve 381 et 395 formes a l'identique, les 19 groupes du thermostat (vis
incluses — le piege qui m'avait coute une passe), et son alerte « translate imbrique » se
declenche sur la camera : **exactement le piege qui m'avait fait envoyer un element hors cadre
plus tot dans la meme session**. Les garde-fous d'un outil prouvent leur valeur sur les cas
DEJA payes.

**How to apply:**
- 2e occurrence du meme heredoc dans une session → s'arreter et extraire. Pas la 3e.
- L'outil extrait doit **echouer bruyamment** plutot que produire un resultat partiel : compter
  les formes avant/apres et refuser d'ecrire s'il en manque, refuser si un attribut kebab-case
  survit (React l'ignorerait en silence).
- ⭐ **Re-tester l'outil sur les cas deja traites a la main** — c'est la qu'on verifie qu'il
  aurait evite les erreurs qu'on vient de payer, et c'est gratuit.
- Un outil non indexe est un outil perdu : l'ajouter au catalogue ET au ROUTAGE dans la foulee.

Lie a [[chercher-outil-existant-avant-improviser]], [[tester-le-script-nest-pas-tester-le-branchement]],
[[preview-avant-appel-api-paye]].
