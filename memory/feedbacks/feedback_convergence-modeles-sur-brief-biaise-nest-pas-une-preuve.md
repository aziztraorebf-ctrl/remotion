---
name: feedback_convergence-modeles-sur-brief-biaise-nest-pas-une-preuve
description: N modeles qui convergent sur MON brief ne valident pas la direction — ils me renvoient mon propre biais
metadata:
  type: feedback
---

Quand un jury de N modeles converge, verifier **d'ou vient l'information qui les a fait
converger** avant de traiter la convergence comme une validation. Si c'est MA reformulation
d'une source (ma description d'images, mon extrait de transcript), la convergence ne mesure
que la force de mon propre cadrage.

**Why:** vecu 2026-09-05/06, candidature Upwork "Earth to Suzy" (intro YouTube 10 s). DEUX fois
de suite sur le meme chantier :

1. J'ai decrit ses miniatures YouTube EN MOTS (« collage, papier dechire, tampon postal ») sans
   joindre les images. Les 4 modeles ont converge sur un registre papier/encre/tampon. J'ai lu
   « convergence 4/4 » comme une preuve forte. Le rendu anime a ete rejete par Aziz : « ou est
   l'animation ? on dirait juste des objets qui apparaissent ». **Cause racine : un registre
   STATIQUE PAR NATURE pour repondre a une demande d'ANIMATION.** Les modeles n'avaient pas
   trouve ca dans ses miniatures — ils l'avaient trouve dans MA description.

2. Rejoue avec le mouvement en critere. J'ai ecrit dans le brief « son sport c'est LE FOOT, pas
   une salle de gym », extrait d'un transcript de 2023. Les 4 modeles ont converge sur un ballon
   de foot. Aziz a verifie : **le mot « soccer » est ABSENT de la demande cliente**, qui dit
   seulement « fitness/adventure », « staying active ». Sa video recente ne montre aucun sport.
   La convergence etait, la encore, mon interpretation qui me revenait.

Le mecanisme d'erreur est identique : faire passer une source SECONDAIRE (ses miniatures, son
transcript) avant sa demande EXPLICITE, puis lire l'echo comme une confirmation.

**How to apply:**
1. Avant de lancer un jury : distinguer dans le brief ce qui est **cite verbatim de la source**
   de ce qui est **mon interpretation**. Marquer les deux differemment.
2. Quand c'est possible, **joindre la source brute** (les images en `--ref`) plutot que ma
   description. `storyboard-dual-gen.py` accepte `--ref` repetable ; `storyboard-concepts-texte.py`
   a `--ref-note` pour les modeles sans vision.
3. **Le test decisif** : relancer un jury en RETIRANT mon interpretation, avec la source seule.
   Si la convergence tient, elle est reelle. Si elle change, elle mesurait mon biais.
   (Fait ici : le jury v3 « ses mots seuls » a produit un concept entierement different, sans
   aucun ballon — ce qui a prouve que le ballon venait de moi.)
4. Une convergence N/N n'est jamais une preuve a elle seule : demander « converge sur QUOI ? »
   — sur l'identite visuelle, ou sur l'adequation au livrable demande ? Ce n'est pas pareil.

Lie a [[feedback_convergence-llm-tester-en-retirant-le-contexte]] et
[[feedback_brief-souffle-la-reponse-par-son-vocabulaire]].
