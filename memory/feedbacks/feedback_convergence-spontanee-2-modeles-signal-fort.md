# Convergence spontanée 2 modèles = signal fort

> Migré depuis auto-memory 2026-08-31 (modifié 2026-07-26). Complète
> `memory/feedbacks/feedback_convergence-modeles-vaut-le-critere-donne.md` (nuance sur l'AXE de la
> convergence) avec une nuance différente : sur QUOI porte la convergence (diagnostic non sollicité
> vs correctif à une prémisse fournie).

Dans une synthèse de review downstream à 2 modèles (Gemini + Kimi, même brief, génération indépendante),
distinguer explicitement les points où les deux convergent SANS avoir été guidés l'un vers l'autre — les
remonter en tête de synthèse comme signal prioritaire, avant les points où un seul modèle a une opinion.

**Why** : sur le Beat 6a CFA, passe downstream avec Gemini 3.1 Pro (vidéo native) + Kimi K2.5 (frames), même
brief custom (diagnostic général + question ouverte ciblée sur le cartouche calendrier, point faible déjà
identifié par Aziz). Les deux modèles, sans accès à la sortie l'un de l'autre, ont indépendamment recommandé
d'abandonner le cartouche/overlay et de faire porter le message par le jeton déjà existant plutôt qu'un
nouvel élément. Cette convergence spontanée sur un point non trivial a été traitée comme le signal le plus
fort de toute la review, plus fiable qu'un avis isolé. La doctrine existante ("Gemini = signal jamais juge")
vaut pour UN modèle ; quand DEUX modèles indépendants convergent spontanément sur une recommandation non
évidente, la probabilité que ce soit un vrai signal (pas un artefact de prompt ou un biais de modèle) monte
fortement.

**How to apply** : affine la doctrine DA-BRIEF-GATE (pattern 2 appels) avec une nuance sur comment PONDÉRER
2 avis modèles entre eux, pas seulement comment les utiliser chacun. Ne pas diluer une convergence spontanée
dans une liste plate de "points soulevés" — elle a une valeur informative supérieure à la somme des deux
avis pris séparément, mais le jugement d'Aziz reste toujours l'arbitre final.

---

## ⚠️ LA FRONTIÈRE : convergence sur un DIAGNOSTIC ≠ convergence sur un CORRECTIF (ajout 2026-07-26)

La règle ci-dessus vaut quand les modèles **identifient spontanément un point faible** qu'on ne leur a pas
soufflé. Elle ne vaut PAS quand ils convergent sur **la correction d'un défaut qu'on leur a déjà affirmé**.

**Contre-exemple vécu (CFA Beat 6b, 2026-07-26)** : le brief downstream disait *"la transition vers l'écran
de fin retombe, ça fait diapositive de fin — comment corriger ?"*. Les 3 voix (Gemini + Kimi + DeepSeek) ont
convergé sur la même réponse : faire naître l'écran de fin d'une expansion de l'or depuis la pièce Sira.
Codé, testé, présenté → verdict Aziz : *"complètement inutile, je ne comprends même pas pourquoi il est là,
mieux vaut garder ce qu'on avait"*. Retiré, retour au fondu simple.

**Ce qui s'est passé** : les modèles répondent à LA QUESTION POSÉE, ils ne remettent pas en cause sa
PRÉMISSE. Leur convergence ne portait pas sur *"ce fondu est raté"* (ça, c'est moi qui l'avais affirmé dans
le brief) mais seulement sur *"voici comment on remplace un fondu"*. Trois modèles d'accord sur le COMMENT
ne prouvent rien sur le SI.

**How to apply** :
- Convergence sur un **diagnostic non sollicité** (ils pointent un défaut qu'on n'avait pas nommé) → signal
  fort, cf. règle principale ci-dessus.
- Convergence sur un **correctif à une prémisse fournie dans le brief** → signal FAIBLE. Avant d'implémenter,
  revérifier soi-même que le défaut existe : relire le rendu, se demander *"est-ce que ça me gênait vraiment,
  ou est-ce que je l'ai écrit parce qu'un modèle l'a suggéré au tour d'avant ?"*
- Corollaire de méthode : quand on rédige un brief downstream, **séparer** ce qui est un constat vérifié de
  ce qui est une hypothèse — sinon on fabrique soi-même la convergence qu'on prendra ensuite pour une preuve.

---

## ⚖️ NUANCE COMPLÉMENTAIRE — voir aussi `feedback_convergence-modeles-vaut-le-critere-donne.md` (2026-07-26)

**Une convergence ne vaut que ce que vaut le CRITERE posé dans le brief.** Vécu sur le beat 4 CFA :
3 modèles (Gemini + Kimi + DeepSeek) ont convergé spontanément sur une même direction de scène — elle
était élégante mais **illisible** (5 conventions à décoder), parce que le brief n'avait pas posé
« compréhensible en 2 secondes » comme critère **ÉLIMINATOIRE**. Ils avaient donc convergé sur
l'élégance, pas sur la lisibilité : bonne réponse à la mauvaise question.

→ Avant de suivre une convergence, se demander **sur quel AXE elle porte**, et si c'est bien celui
qu'on voulait mesurer. Parade concrète = le **test aveugle** (appel SÉPARÉ, extrait COURT, sans son,
sans contexte).
