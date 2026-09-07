---
name: client
description: "Aiguilleur des chantiers CLIENT freelance : quel skill lancer selon le moment du contrat."
disable-model-invocation: true
---

# Chantier client — par ou passer

Aiguilleur unique pour le travail freelance. Trouver le moment du contrat, lancer le skill.

| Le moment | Quoi lancer |
|---|---|
| Une annonce a trier — candidater ou non ? | lire `memory/fiches/FICHE-BRIEF-CLIENT.md` (auto-injectee par `fiche-inject.sh`) |
| Contrat gagne, ou revision cliente arrivee — rien n'est encore code | Skill `cadrer-brief-client` |
| Le cadrage est fait, il faut produire | `/beat` si c'est une scene ; sinon code direct |
| Le rendu existe, il faut l'envoyer | Skill `livrer-client` |
| Un desaccord VISUEL avec le client | annoter l'image des le 1er tour, jamais expliquer en 3 messages |
| Fin de session | `/wrap` |

## Les 3 reflexes qui reviennent dans tous les contrats

**Le client decrit un SYMPTOME, jamais une CAUSE.** Mesurer avant de doser. Le centrage
« pas bon » etait a 0,3 % pres ; l'ancrage demande visait une surface qui n'existait pas.

**Chercher un VERDICT DE REJET deja ecrit** avant de reprendre un livrable herite :
`grep -rn "VERDICT\|REJET\|ne PAS repartir" memory/client-sim-tests/<contrat>/`

**Ce qui n'est pas dans l'offre acceptee n'est pas engage.** Un accord dans le fil de
discussion n'existe pas dans le contrat.
