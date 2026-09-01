# Une forme validée n'est valide que pour le problème qu'elle a résolu

**Vécu 2026-08-15, R&D inserts — DEUX FOIS dans la même session, corrigé par Aziz les deux fois.**

Distinct de [[recherche-templates-obligatoire]] (chercher AVANT de coder) et de
[[registre-visuel-briques-existantes-non-consultees]] (ne pas ignorer l'existant) : ici la brique
avait bien été trouvée et elle était bonne — **elle a été réappliquée hors de son domaine de
validité**, sans qu'on redemande ce que le nouveau cas exigeait.

## Les 2 occurrences

**1. « Insert MATIÈRE » transposé à un gisement.** L'insert matière (montrer ce qui transite dans une
conduite) venait d'être validé sur le Gazoduc. Appliqué tel quel aux 3 champs pétroliers du Sénégal,
il produisait 3 vignettes de fluide (gaz doré, pétrole noir) — qui **se ressemblent toutes**. Aziz :
*« ne serait-il pas mieux de créer le lieu ? »* Un gisement n'est pas une matière, c'est une
**installation** : trois installations se distinguent par leur SILHOUETTE avant même la couleur.
La différenciation que je cherchais dans la matière était dans la forme.
→ Pourquoi l'insert matière était juste pour le gazoduc : **une conduite n'a rien d'autre à montrer
que son contenu**. Ce n'est pas vrai d'un site, d'un port, d'un barrage.

**2. Cadre d'insert repris tel quel.** Les proportions de cadre du premier insert ont été reprises
pour les mini-inserts, sans recalculer. Résultat mesuré : **32 % de chaque clip rogné** (cadre en
2.35:1 pour des clips en 16:9). Aziz : *« les vidéos ne prennent pas toute la place »*.

## La question à se poser

Avant de réutiliser une forme validée : **« qu'est-ce qui rendait cette forme juste dans le cas
d'origine, et est-ce toujours vrai ici ? »** — une phrase, avant de coder.

Si la réponse tient en une raison structurelle (« une conduite n'a que son contenu à montrer »),
vérifier explicitement que cette raison vaut encore. Si elle ne vaut plus, la forme ne vaut plus non
plus, même si elle vient d'être validée.

## Le signal d'alerte

**Une session qui enchaîne des cas voisins** (4 inserts d'affilée, 3 beats d'un même acte) crée
l'inertie : chaque nouveau cas hérite des réponses du précédent sans repasser par l'intention.
C'est précisément la situation décrite par [[CONTINUITE-SCENE-INTENTION-DABORD]] — INTENTION → FORME
→ TEMPLATE, dans cet ordre — mais appliquée ici *entre deux cas de la même session*, pas entre deux
scènes d'une vidéo.

⭐ **Ce qui a limité le coût les 2 fois** : Aziz a corrigé la direction **avant la génération payante**
(les images étaient faites, pas les clips). Corollaire pratique : montrer l'image/le cadrage AVANT
d'animer reste le meilleur point de contrôle — c'est là que la correction coûte le moins cher.

## ⭐⭐ Le déclencheur précis : le passage à la SÉRIALISATION

Le moment où une erreur de direction devient coûteuse est identifiable : **quand on passe d'un asset
unique à une SÉRIE** (N gisements, N inserts, N variantes du même geste). Jusque-là l'erreur coûte un
asset ; à partir de là elle coûte la série entière.

**Règle** : dès que je m'apprête à sérialiser, montrer le **PREMIER** exemplaire à Aziz avec la
question de DIRECTION posée explicitement — *« est-ce que c'est ça qu'on veut montrer ? »* — et pas
seulement la question de qualité (*« est-ce que c'est réussi ? »*). Les deux questions sont
différentes et je ne posais que la seconde : je validais chaque asset contre sa propre intention sans
jamais rouvrir celle du geste global.

Complémentaire de [[semantic-test-gate-pas-signal-informatif]] (direction vs exécution) et de la règle
de validation bloquante avant tout appel payant — celle-ci porte sur le PROMPT déjà formulé, ici c'est
le **choix de sujet en amont du prompt**.
