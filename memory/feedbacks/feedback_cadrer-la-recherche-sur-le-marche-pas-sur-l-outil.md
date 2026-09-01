# Cadrer la recherche sur le MARCHÉ, pas sur l'OUTIL

> Migré depuis auto-memory 2026-08-31 (modifié 2026-08-27). Référencé en 1 ligne d'index dans
> `MEMORY.md` § Méthode/feedbacks-clés ("cadrer-la-recherche-sur-le-marche-pas-sur-l-outil") mais
> le détail complet n'existait nulle part côté repo — migré ici pour combler ce trou.

## 1. ⛔ Cadrer la recherche sur le MARCHÉ, jamais sur l'OUTIL

**Vécu 2026-08-26/27** : 5 agents lancés sur « Lottie ». Tous ont mesuré un **canal de FORMAT**,
aucun n'a mesuré un **marché**. Il a fallu une question d'Aziz — *« Lottie n'est pas un métier, c'est
une extension. On fait de l'ANIMATION. Est-ce que le mot Lottie ne nous enferme pas ? »* — pour
recadrer, et relancer 4 agents de plus.

⛔ **La leçon existait DÉJÀ en mémoire depuis le 2026-08-23** :
> « le marché ne demande pas du SVG, il demande de l'animation 2D et un fichier au bon format.
> **Le moyen ne l'intéresse pas.** »

Écrite, puis une journée entière passée à étudier le MOYEN quand même.

**Why** : quand on maîtrise un outil, la question qui vient naturellement est « qui achète mon outil ? ».
C'est la mauvaise question — elle produit une recherche qui décrit un rayon de supermarché, pas une
demande. La bonne question est **« qu'est-ce que le client cherche à obtenir ? »**, et l'outil n'apparaît
qu'à la fin, comme case de livraison.
⭐ Confirmé par la donnée : **« Remotion » n'a AUCUNE demande exprimée** sur Upwork (1 job à 15 $).
Le moyen de production **ne se vend pas** — il est un avantage de coût INTERNE.

**How to apply** — avant de lancer tout agent de recherche marché :
1. Écrire la question en **verbe côté client** (« expliquer un produit complexe »), pas en nom d'outil.
2. Se demander : *un client taperait-il ce mot dans une barre de recherche ?* Si le mot est un format
   de fichier ou un framework → c'est une question de LIVRAISON, pas de marché.
3. Chercher dans la mémoire si la leçon a déjà été tirée (`grep -ri "le moyen\|pas la technique" memory/`)
   AVANT de définir le brief des agents.

Voir `memory/projects/RECHERCHE-MARCHE-INDEX.md` (porte d'entrée unique de tout ce qu'on sait du marché).

## 2. ⛔⛔ Valider la MÉTHODE DE MESURE d'un agent AVANT de compter

**Vécu le même jour** : deux agents ont rendu des conclusions **opposées** sur la même question
(« y a-t-il des personnages dans les gigs ? »). Cause racine : sur Fiverr, le `path` SVG d'une case
à cocher est **IDENTIQUE** cochée et non-cochée — le signal est la classe CSS `_638a2b` sur le `<span>`
parent. **La règle naïve donne 100 % de faux positifs.**

Un 3e agent a validé son parseur contre une **vérité terrain** avant de compter, et a produit le bon
résultat. Un 4e a intercepté **dix avis clients FABRIQUÉS** (chacun collant pile au prix affiché du gig)
en vérifiant d'où venait la donnée : **les valeurs de commandes n'existent que sur les pages PROFIL
vendeur, jamais sur les pages CATÉGORIE**.

**Why** : un agent qui compte sans avoir validé sa méthode produit un chiffre **confiant et faux** —
plus dangereux qu'une absence de chiffre, parce qu'il entre dans une synthèse sans signal d'alarme.

**How to apply** :
- Dans tout brief d'agent qui doit COMPTER : exiger **« valide ton parseur/ta méthode sur un cas de
  vérité terrain connu avant de produire le moindre chiffre »**.
- Exiger aussi : **« distingue ce que tu as LU d'une page réelle de ce que tu DÉDUIS »**, et
  **« nomme la source primaire de chaque chiffre »**.
- ⭐ Quand 2 agents se contredisent : ne pas arbitrer sur l'autorité ou la longueur du rapport —
  **demander à chacun sa MÉTHODE**. Celui qui ne peut pas la décrire a tort.

Lié aux principes MEMORY.md § "chiffre-audit-relaye-sans-verification" (un chiffre d'agent est un
SIGNAL) et "prouver-une-capacite-nest-pas-produire-un-livrable".
