---
name: tester-le-script-nest-pas-tester-le-branchement
description: "Un gate n'existe que si on l'a vu se declencher SEUL sur un vrai appel d'outil — tester le script en lui envoyant du JSON a la main ne prouve que la moitie"
metadata:
  type: feedback
---

Un gate a **deux** conditions d'existence, et elles se testent separement :
1. **le script fait ce qu'il doit** — se teste en lui envoyant du JSON a la main ;
2. **il se declenche vraiment** — ne se teste QUE par un vrai appel d'outil, sans le provoquer.

⛔ **Valider (1) et annoncer « branche, teste » est une affirmation non fondee.** C'est le
piege exact du cran precedent ([[regle-ecrite-insuffisante-sans-gate-outille]] : « ecrire ≠
appliquer ») deplace d'un niveau : **« le gate existe ≠ le gate se declenche »**.

**Le cas (2026-09-05, `client-source-gate.sh`)** : j'ai teste le script sur 5 cas — client,
repetition silencieuse, hors-client, client sans brief, dossiers `_shared`. Tous verts. J'ai
annonce « branche, teste ». **Aziz a exige le test du BRANCHEMENT.**
Ce test a trouve un defaut que les 5 autres ne pouvaient pas voir :

> En `PreToolUse`, une ecriture **bloquee par un AUTRE gate** consommait quand meme l'unique
> declenchement « 1× par client par session ». Le rappel s'affichait sur une ecriture qui
> n'a jamais eu lieu, puis se taisait definitivement.

⭐ Et le cas n'avait rien de theorique : `moteur-visuel-gate.sh` bloque precisement les
**nouvelles scenes** — donc le scenario le plus frequent d'un chantier client. Le gate aurait
ete silencieux la ou il devait parler, sans que rien ne le signale.
**FIX** : passer en `PostToolUse`, qui ne s'execute que si l'outil a REUSSI.

**Why** : un script teste isolement s'execute dans un monde sans les autres hooks, sans
l'ordre d'execution, sans les blocages, sans le cycle de vie de `settings.json` (relu au
DEMARRAGE de session — un hook ajoute en cours de session n'est pas actif). Les defauts qui
comptent vivent dans l'INTERACTION, pas dans le script. C'est la meme famille que
[[rapport-vert-ne-prouve-rien-regarder-l-image]] : le vert mesure ce qu'on a su mesurer.

**How to apply** — apres avoir ajoute ou modifie un hook :
1. **Provoquer un vrai appel d'outil** sur une cible jetable qui remplit le critere de
   declenchement (un fichier de test sous le chemin cible), et REGARDER si le message sort.
2. ⛔ **Ne pas conclure sur l'absence de message** : chercher une PREUVE D'EXECUTION
   independante (fichier stamp, `touch` daté, log). Ici le stamp portant l'ID de la session
   a prouve que le hook avait bien tourne — et a revele du meme coup qu'il avait brule son
   declenchement sur une ecriture annulee. Sans lui, j'aurais conclu « pas branche » et
   cherche au mauvais endroit.
3. **Verifier les AUTRES hooks du meme matcher** : qui peut bloquer avant moi, et dans quel
   ordre ? Un `PreToolUse` qui pose un etat (stamp, compteur, verrou) sur une action qui peut
   etre annulee est un bug par construction → si le hook ne bloque rien, `PostToolUse`.
4. ⛔ **`settings.json` est lu au demarrage de session** : un branchement modifie en cours de
   session ne peut etre confirme qu'a la session SUIVANTE. Le dire au lieu de l'affirmer, et
   le re-verifier a l'ouverture.
5. **Nettoyer les fichiers de test** et les stamps de session avant de commiter.

Lie a [[regle-ecrite-insuffisante-sans-gate-outille]] (le cran precedent) ·
[[gate-contourne-par-outil-alternatif]] (un gate qui se declenche mais se contourne) ·
[[rapport-vert-ne-prouve-rien-regarder-l-image]] ·
[[chantier-client-la-source-avant-le-gout]] (le gate ou le cas s'est produit)
