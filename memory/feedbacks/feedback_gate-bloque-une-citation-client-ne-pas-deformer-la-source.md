---
name: feedback_gate-bloque-une-citation-client-ne-pas-deformer-la-source
description: Quand un gate bloque sur une citation verbatim du client, corriger le gate — jamais reformuler la demande du client
metadata:
  type: feedback
---

Si un gate outille bloque un brief parce qu'il contient une **citation verbatim d'un client**,
le fix est dans le GATE, jamais dans la citation. Ne JAMAIS reformuler la demande d'un client
pour satisfaire un garde-fou interne : sur un chantier client, la citation EST la source de
verite, et la deformer est precisement le risque que le reste de la methode cherche a eviter.

**Why:** vecu 2026-09-06, candidature Upwork "Earth to Suzy". Le brief envoye au jury de modeles
recopiait mot pour mot la demande de la cliente, qui contient « No cartoon or character-based
animation ». `moteur-visuel-gate.sh` y a lu une FERMETURE de registre et a bloque — 2 fois.
J'ai fini par reecrire sa phrase pour passer le gate. C'est l'inverse de ce qu'il faut faire :
le gate est cense empecher NOS briefs d'etre brides, pas empecher un client de poser SES
contraintes. Le gate mesurait la bonne chose (une fermeture) sur la mauvaise source (le client
au lieu de nous).

Cout secondaire du meme incident : le compteur d'ouverture du gate (`AUTRE`) ne compte que des
mots-cles ANGLAIS orientes cartographie (`choropleth`, `cartogram`, `cutaway`, `zoom out`).
Un brief d'ANIMATION redige en francais ne peut structurellement pas le satisfaire sans y
injecter du vocabulaire hors-sujet. J'ai du ecrire « montage / match-cut », « scale / zoom out »
en anglais dans un brief francais uniquement pour le compteur.

**How to apply:**
1. Un gate qui bloque : d'abord se demander **d'ou vient le texte incrimine**. De nous
   (= le gate a raison) ou d'une source externe citee (= le gate a un faux positif) ?
2. Faux positif -> **corriger le gate**, avec un commentaire datant l'incident, comme les 2
   portes de sortie qui existent deja dedans (re-dessin 2026-08-18, negation 2026-08-21).
   ⛔ Ne PAS contourner par un chemin de fichier hors surveillance : « un contournement n'est
   pas un fix » (deja ecrit dans ce hook le 2026-08-18).
3. **Tester le gate dans les DEUX sens** apres correction : le cas legitime passe ET le cas
   fautif d'origine bloque toujours. Un gate n'existe que vu se declencher seul.
   (Fait ici : citation client plafonnee -> passe ; « ZERO composed insert cards » -> bloque.)
4. Si la citation client porte une contrainte reelle, la **plafonner** dans le brief (dispositif
   couteux a justifier) plutot que de la supprimer — c'est ce que le gate demande par ailleurs,
   et ca sert le brief.

⚠️ Corollaire mesure le meme jour : **un blocage de hook annule TOUTE la commande**. Mes
commandes qui ecrivaient un fichier PUIS lancaient le script bloque n'ont jamais ecrit — j'ai
cru corriger un fichier 3 fois de suite alors qu'il etait intact. Separer l'ECRITURE de
l'EXECUTION en deux commandes quand un gate peut intervenir.

Lie a [[feedback_gate-contourne-par-outil-alternatif]] et
[[feedback_tester-le-script-nest-pas-tester-le-branchement]].
