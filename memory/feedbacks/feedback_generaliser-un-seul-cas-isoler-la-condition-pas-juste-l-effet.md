# Copier la forme sans sa condition, c'est copier une rustine

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo — nom auto-memory
> `feedback_generaliser-un-seul-cas-isoler-la-condition-pas-juste-l-effet.md`).

**Règle** : avant de transposer une technique observée sur **un seul cas de référence** (concurrent,
vidéo virale, code d'un autre projet), isoler la **condition structurelle** qui la rend nécessaire
*là-bas*. Une forme copiée sans sa condition n'est pas une amélioration — c'est un ajout cosmétique,
parfois nuisible.

## Le cas (2026-08-17, session packaging YouTube)

J'ai extrait de la vidéo d'Adam Ivy (« Most Of You Will Never Get Monetized Now | YouTube
Monetization Update ») la structure `Accroche | Mot-clé cherchable`, et je l'ai présentée à Aziz
comme **« à voler telle quelle »** — justification : « il obtient la tension ET l'indexation ».

**Aziz a corrigé** : il n'utilise cette structure QUE parce que son accroche (« Most of you will
never get monetized now ») **ne contient elle-même aucun mot cherchable** — ni « YouTube », ni
« monétisation ». Le `| Mot-clé` **compense un manque propre à SA phrase**. C'est une rustine, pas
un modèle. Ses mots : *« je n'ai jamais vu personne mettre le mot-clé à la toute fin, ce n'est pas
du SEO traditionnel »*.

Or nos titres du patron « créer le manque » portent déjà le mot-clé DANS l'accroche : « Le même or
paie les deux **armées du Soudan** », « **La guerre au Soudan** n'a aucune raison de s'arrêter ».
Y ajouter « | Soudan » aurait été redondant — et aurait violé notre propre règle 8 (le titre ne
redit pas ce qui est déjà dit ailleurs).

## Cause racine

J'ai observé l'**EFFET** (titre performant) et l'ai attribué à la **FORME** (la barre verticale),
sans vérifier la **CONDITION** qui rendait cette forme nécessaire dans ce cas précis.

## How to apply

Avant de transposer une technique vue sur 1 cas, poser explicitement :
> **« Cette technique compense-t-elle un manque spécifique à CE cas, ou est-ce une amélioration
> générale ? »**

Si c'est une compensation → vérifier que **notre** cas a le même manque avant d'appliquer.
Un seul exemple donne un **mécanisme candidat**, jamais une règle prête à l'emploi. La règle
n'existe qu'une fois isolé *pourquoi* ça marchait là-bas.

⚠️ Le même piège, côté production : une abstraction écrite sur un seul exemple est un pari, pas une
brique — cf. la règle du CLAUDE.md « documenter une méthode prouvée AVANT de la généraliser en
code », qui exige un 2e cas d'usage réel avant d'extraire une fonction générique.

Voir aussi : `memory/doctrines/PACKAGING-YOUTUBE.md` §3 règle 8 (titre ≠ miniature) ·
[[feedback_benchmark-concurrent-ecart-est-une-charte-pas-une-brique]] (un écart au concurrent est
une discipline, pas une capacité manquante — même famille d'erreur de lecture).

---

## ⭐ 2e cas — 2026-08-26 (chaîne SVG→Lottie) : une heuristique VRAIE devient FAUSSE ailleurs

`est_un_fond()` (dans `finir_piece.py`) devait exclure le fond du calcul d'emprise avant recadrage.
Elle jugeait sur **la TAILLE seule** — juste tant que le seul grand objet était le fond.
Quand la courbe est devenue **animée et large**, elle a été prise pour un fond et **exclue du
cadrage** : l'emprise sortait incohérente et le recadrage ne corrigeait plus rien, **sans erreur**.

**Le correctif est celui que cette leçon prescrit — isoler la CONDITION, pas l'effet** : un vrai
fond n'est pas « ce qui est grand », c'est un **RECTANGLE PLEIN**. Nouveau critère : **peu de
sommets ET aucune animation de forme**. « Grand » était une CONSÉQUENCE d'être un fond, pas sa
définition — et une conséquence **partagée avec d'autres objets**.

⭐ **Le test à faire sur toute heuristique** : « quel autre objet de mon domaine partage ce
symptôme ? » Si la réponse existe, le critère décrit un effet, pas la cause.
