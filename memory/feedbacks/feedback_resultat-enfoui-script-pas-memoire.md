Session R&D stick figure (2026-07-27). En fin de session j'ai decouvert `scripts/tools/gemini-analyse-stickfigure.py`,
date du **30 juin 2026**, dont l'en-tete disait deja mot pour mot :

> « L'auteur (le realisateur) a tranche : il PREFERE le stick figure SIMPLE. Il pense que la complexite
> du corps est une erreur, et que le VRAI probleme n'est pas le corps mais l'ANIMATION : la marche
> semble trop rapide / "glissee". »

Autrement dit : **la preference d'Aziz pour le stick figure simple ET le diagnostic du glissement de la
marche etaient etablis depuis un mois** — et ont ete integralement redecouverts de zero pendant cette
session (le glissement a ete rediagnostique 3 fois, sur 3 lots differents).

**Why** : un script est ouvert quand on veut EXECUTER quelque chose, jamais quand on cherche « qu'a-t-on
deja decide sur X ? ». Son en-tete est donc un cul-de-sac documentaire : l'information y est exacte,
datee, bien redigee — et invisible. Le cout n'est pas le temps de redecouverte (une session R&D
reprouve volontiers), c'est le risque de **retrancher differemment** une question deja tranchee par Aziz,
et de lui refaire valider ce qu'il avait deja valide.

**How to apply** :
- Quand un script encode un VERDICT d'Aziz ou un DIAGNOSTIC etabli (pas juste un parametre technique) :
  ecrire le verdict dans un fichier de navigation (index de composants, doctrine, `NEXT-ACTION.md`,
  `feedbacks/`) et ne laisser dans le script qu'un POINTEUR vers lui.
- Test simple avant de fermer une session : « si quelqu'un cherche ce resultat dans 3 mois, quel fichier
  ouvrira-t-il ? » Si la reponse est « il faudrait qu'il pense a grep les scripts », ce n'est pas de la memoire.
- Vaut aussi pour les commentaires de code longs qui documentent une DECISION (vs une mecanique).
  Un commentaire qui explique COMMENT le code marche : sa place est dans le code. Un commentaire qui
  explique POURQUOI Aziz a tranche ainsi : sa place est en memoire, avec un pointeur depuis le code.
- Corollaire d'orchestration : briefer un agent avec « cherche d'abord si on l'a deja fait » ne suffit
  pas si le resultat n'est pas dans un fichier trouvable — c'est le rangement qui doit etre bon,
  pas la recherche.

Cousin de la regle CLAUDE.md « ameliorer/remplacer l'existant avant de creer (source de verite unique) » :
ici le probleme n'est pas la duplication mais l'**inaccessibilite** — une source de verite rangee la ou
personne ne la cherchera.

---

## ⭐⭐ DEGRE ZERO — la methode qui ne vit que dans la CONVERSATION (2026-07-30)

Le cas ci-dessus est un **mauvais rangement** (l'artefact existe, au mauvais endroit). Il existe pire :
**aucun artefact du tout.**

**Vecu** : la boucle NotebookLM long→Short etait **eprouvee 3 fois** et avait produit **2 Shorts
PUBLIES** (AES 90s, Senegal Petrole & Gaz D3) — et n'existait **nulle part** : ni doctrine, ni
`memory/tools/`, ni feedback, ni commit. Aucun grep ne la trouvait. Il a fallu un agent fouillant les
transcripts de conversation pour la reconstituer, un mois apres son dernier usage.

⭐ **Pourquoi elle a echappe a toute ecriture** : parce qu'elle a **toujours marche**. Nos declencheurs
d'ecriture sont des INCIDENTS (un bug, une correction d'Aziz, un echec mesure). Une methode qui reussit
du premier coup ne declenche rien — et plus elle reussit, plus elle parait evidente, donc moins on
pense a l'ecrire. **Le savoir-faire silencieux est le plus fragile.**

**How to apply — le declencheur de cloture qui manquait.** A chaque `/wrap`, ne pas se demander
seulement « qu'ai-je APPRIS ? » (ca ne remonte que les incidents) mais aussi :

> **« Qu'ai-je FAIT plusieurs fois, avec succes, sans jamais l'ecrire ? »**

Si une reponse vient : verifier par `grep` qu'elle existe en memoire. Si le grep est vide alors que la
pratique a produit des livrables → c'est un trou de documentation, pas un trou de pratique. L'ecrire
immediatement, avec ses gotchas mesures et un pointeur depuis un fichier de navigation.

Exemple du fix : `memory/tools/notebooklm-boucle-short.md`, branche depuis `ROUTAGE.md`, depuis
`MEMORY.md`, et en **Etape 0** de `SOUVERAIN-SHORT-DEMARRAGE.md` — qui demarrait a « script locked »
sans jamais dire ce qui PRODUIT ce script.
