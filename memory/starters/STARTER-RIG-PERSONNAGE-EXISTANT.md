# STARTER — PILOTER UN RIG DE PERSONNAGE EXISTANT (session parallele)

> Cadre par Aziz le 2026-08-28, en fin de session « chaine logo client ». A ouvrir dans
> une session NEUVE — le sujet est assez large pour meriter son propre depart.

## LA QUESTION EXACTE (formulation d'Aziz, ne pas la reduire)

> « On cree quelque chose — un decor, une forme — on veut y rajouter un personnage.
> Est-ce que prendre un rig existant peut ensuite etre PILOTE par nous ? Peut-on lui
> faire faire ce qu'on veut, le placer ? Est-ce que ca passe dans le Lottie ?
> Quel genre de rig existant, quel marche regarder ? »

⭐ Ce n'est PAS « sait-on animer un personnage » (repondu : non, c'est un metier).
C'est **« sait-on REUTILISER le travail de quelqu'un d'autre et le PILOTER »** — donc
une question d'assemblage et de controle, pas de character design.

## CE QUI EST DEJA ETABLI (ne pas re-explorer)

- ⛔ **Pas de rigging dans le MCP Creator** : verifie sur les 110 outils — ni bones, ni
  squelette, ni parentage. ⚠️ Ne pas exclure que l'INTERFACE le propose sans l'exposer
  au MCP. → `memory/tools/lottie-creator-mcp.md`
- ⛔ **Personnage-heros = ecarte comme offre** (metier different, zero differenciation,
  notre moat est le determinisme). Decision prise sur des briefs REELS.
  ✅ **Restent bons** : personnage FIGURANT dans une scene explicative · client qui
  FOURNIT son personnage. → `memory/client-sim-tests/repro-vendeur-lottie/STATUS.md`
- ⭐ **Un perso Lottie peut etre du BITMAP** : la scene d'exemple de LottieFiles est faite
  de 13 PNG rigges (`ty=2`), zero chemin vectoriel. ⛔ **On ne sait PAS** quelle
  proportion des Lottie a personnages est bitmap vs vectoriel — **mesurable** (compter
  `ty=2` vs `ty=4` sur un echantillon public), **pas mesure**. Ne pas y repondre de memoire.
- ⭐ Notre boucle de vie SANS rigging fonctionne (queue qui bat, clignement) — verdict
  d'Aziz : « a la limite de ce qu'on peut faire en vectoriel sans rigging ».

## LA REPONSE DE GEMINI — utile sur le FOND, ⛔ non verifiee sur les CHIFFRES

Son propos central est juste et recoupe notre propre mesure : **personne ne rigge from
scratch, l'industrie ASSEMBLE a partir de kits** (Envato Elements, Motion Array, Rive
Marketplace, LottieFiles). Un kit = un rig operationnel + une bibliotheque de tetes /
vetements / accessoires + **30 a 50 animations pre-faites**. Le freelance re-habille et
ajuste quelques cles.

⛔ **A TRAITER COMME UN SIGNAL, PAS COMME UN FAIT** :
- « 90-95 % », « 4-15 h de rig », « 30-45 min avec un kit » = **aucune source citee**.
- Sa conclusion (« votre valeur = la direction artistique et le storytelling ») est
  **generique** — vraie pour n'importe qui, elle ne dit rien de NOTRE difference.
- **Il ignore notre position** : son conseil « utilisez des kits » nous ferait entrer
  dans un marche ou on n'a aucun avantage.
→ recoupe `feedback_chiffre-audit-relaye-sans-verification`.

## LE TEST A MENER (3 etapes, dans cet ordre)

1. **TROUVER** un personnage Lottie deja anime, licence claire pour usage commercial.
   ⛔ La licence est le vrai point bloquant : beaucoup de fichiers « gratuits » interdisent
   l'usage client. **Verifier la licence AVANT de mesurer quoi que ce soit.**
2. **DEMONTER** : combien de calques, bitmap (`ty=2`) ou vectoriel (`ty=4`) ?
   Ou sont les pivots (`ks.a`) ? Combien de cles ? Y a-t-il du parentage (`parent`) ?
3. **PILOTER** : c'est LA question. Peut-on le PLACER dans une de nos scenes, changer
   ses couleurs, et surtout **lui faire faire autre chose que son animation d'origine** ?
   Ou bien est-il fige dans son mouvement, utilisable seulement tel quel ?

⭐ **Le critere de reussite** : si on peut re-habiller ET re-piloter, c'est une capacite
reelle. Si on ne peut que le poser tel quel, c'est un asset, pas un outil — et ca change
completement ce qu'on peut en dire a un client.

## OUTILS DEJA PRETS (ne pas les reecrire)

`src/projects/_client-sim/lottie-ui/tools/` :
- `planche_calques.py` — rend chaque calque SEUL (⭐ indispensable pour comprendre un
  fichier qu'on n'a pas ecrit ; annoter la planche avec couleur + centre + aire)
- `group_layers.py` — regroupe et nomme (⛔ **groupes CONTIGUS uniquement**)
- `animate_scene.py` — primitives `fondu` `pop` `trace` `geste3` `respire` `balance` `cligne`
- `compare_render.py` — ecart mesure entre 2 rendus
- `test_logo_client.py` — modele de test a 3 volets

⛔⛔ **PIEGE RECURRENT (3 occurrences)** : toujours chercher les `sh` **EN PROFONDEUR**,
jamais a un niveau fixe. Un fichier regroupe a un cran d'imbrication en plus, et une sonde
qui regarde au mauvais niveau **echoue SILENCIEUSEMENT** (ancre a [0,0], compte a 0).

## RAPPELS DE METHODE (payes 3 fois dans la session precedente)

- ⛔⛔ **Un rapport VERT ne prouve rien** — « transportable a l'identique » a menti 3x.
  RENDRE ET REGARDER avant de conclure.
- ⛔⛔ **Chercher la CAUSE des le 2e echec**, ne pas re-DOSER. Vecu 2 fois le 28/08 :
  0,37 -> 0,36 % (aucun progres) parce que je corrigeais au jugé.
- ⛔ **La mesure est biaisee par la FACON de mesurer** : verifier OU l'on echantillonne
  avant de conclure a un artefact (une mesure « rassurante » a failli enterrer un vrai defaut).
- ⭐ **Import Lottie dans Creator = URL PUBLIQUE obligatoire** (`127.0.0.1` refuse).
  Passer par `scripts/tools/upload-to-blob.py`.
- ⭐ `list_scenes` AVANT toute ecriture : un import CREE une scene et bascule l'active.
- ⚠️ Creator dit « N of M layers hidden » sur toute scene animee : **FAUX POSITIF**, il
  lit la frame 0 ou tout est encore a opacite 0.
