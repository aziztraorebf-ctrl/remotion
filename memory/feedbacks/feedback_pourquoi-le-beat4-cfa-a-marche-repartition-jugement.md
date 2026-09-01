**La verification technique complete peut etre TOTALEMENT aveugle au defaut qui compte.** Sur le
beat 4 CFA (2026-07-26), j'ai verifie le code, les timings au forced-alignment, le rendu frame par
frame, l'absence de gel, le mix par bande — tout etait mecaniquement correct. **Et la scene etait a
jeter** : elle rejouait la carte du beat 2 (meme geo, meme camera, meme geste, renomme). Aziz l'a vu
en une phrase.

**Why:** 3 fois dans la meme session, le jugement a tranche juste la ou ma verification ne pouvait
rien voir :
1. **La redondance** — j'ai valide un beat mecaniquement irreprochable qui refaisait une scene
   existante. Aucune verification technique ne detecte "c'est la meme scene que tout a l'heure".
2. **La lisibilite** — j'ai suivi 3 modeles convergents vers une "coupe geologique" elegante qui
   demandait 5 conventions a decoder. Aziz : "est-ce que quelqu'un peut comprendre dans une seconde
   ou deux ?" La convergence mesurait l'elegance ; personne n'avait mesure la comprehension.
3. **La fausse amelioration** — j'ai voulu remplacer un bonhomme-baton par une "silhouette pleine"
   plus soignee. Aziz a demande un comparatif AVANT d'accepter. A taille reelle (74 px), ma version
   "amelioree" REFERMAIT la posture et se lisait MOINS bien. On a garde l'original.

**La repartition qui a fonctionne** (c'est ca qui est reproductible, pas le pipeline) :
- **Claude** : la mecanique (frames, alignment, geometrie verifiee par calcul, mix par bande, hachage
  dense), et la MEMOIRE — je me souviens des 71 composants et des 71 pistes musicales, Aziz non.
- **Aziz** : le sens, la lisibilite, le registre, et le "a quoi bon ?" — ce qu'aucune metrique ne dit.
- Le pipeline (upstream 3 voix → image-cible → code → test aveugle → downstream 2 appels) n'est que
  l'outil qui rend cette boucle RAPIDE. Il ne remplace ni l'un ni l'autre role.

**How to apply:**
1. **Avant de valider un livrable passe, poser la question que la technique ne pose pas** : "est-ce
   que cette scene ressemble a une autre de l'episode ?" Comparer la GEO, la CAMERA et le GESTE, pas
   seulement verifier que le code tourne. Un `grep` des imports geo entre beats revele la redondance
   en 10 secondes (c'est ce qui a confirme le diagnostic d'Aziz).
2. **Montrer tot, en conditions reelles.** Le comparatif a taille reelle (74 px) a tranche en un
   coup d'oeil un debat que ma description ne pouvait pas trancher. Ne jamais defendre une
   "amelioration" par le raisonnement quand on peut la TESTER pour quelques minutes.
3. **Quand Aziz doute d'un truc que j'ai valide, le doute gagne par defaut** — il voit ce que je ne
   peux structurellement pas voir. Verifier son intuition dans le code AVANT de la discuter : 3 fois
   sur 3 elle etait exacte. Cf. [[doute-utilisateur-post-verdict-jury-llm-priorite]].
4. ⚠️ **Ne pas conclure trop vite sur la VITESSE du format.** Cette session a ete rapide parce que
   7 beats sur 8 existaient DEJA. Le beat 4 seul a demande 4 versions + upstream 3 voix + test
   aveugle + downstream. Le vrai test = une video entiere depuis zero (Aziz est d'accord : "il
   faudra faire une deuxieme ou une troisieme video pour s'assurer que cela fonctionne").

Voir aussi [[convergence-modeles-vaut-le-critere-donne]] (le critere n°1 doit etre ELIMINATOIRE dans
le brief) et [[stick-figure-profil-marche-capacite-debloquee]] (capacite decouverte dans la meme session).
