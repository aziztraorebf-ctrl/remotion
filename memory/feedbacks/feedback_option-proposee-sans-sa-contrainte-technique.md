---
name: option-proposee-sans-sa-contrainte-technique
description: Proposer un choix a Aziz en omettant la contrainte qui le conditionne rend une des options fausse — il tranche sur une base erronee.
metadata:
  type: feedback
---

# Une option proposée sans sa contrainte technique est une option fausse

**Vécu 2026-08-21 (galerie de mouvements de caméra).** J'ai proposé un choix : « favoris **locaux** à ton
navigateur, ou favoris **partagés** ? » Aziz a choisi « partagés ». J'ai livré, puis annoncé « les favoris
sont en place » — alors qu'**aucun bouton n'existait pour en marquer un**, et que le filtre était même
caché tant qu'aucun favori n'existait. Aziz ne pouvait rien faire, et me l'a signalé.

**Why** : une page statique (GitHub Pages) **ne peut rien persister** côté serveur. « Partagé » signifiait
donc en pratique « déclaré en dur dans le code par Claude » — pas du tout ce qu'Aziz croyait choisir. La
contrainte faisait partie de l'option, et je l'ai tue. Ce n'est pas un bug : c'est un **défaut de
formulation d'option**, et il fait trancher sur une base faussée.

**How to apply** :
1. **Énoncer la contrainte dans la même phrase que l'option** — « une page statique ne persiste rien :
   soit c'est local à ton navigateur, soit c'est moi qui l'écris dans le dépôt ».
2. Dire ce que chaque option **empêche**, pas seulement ce qu'elle apporte.
3. ⛔ **Avant de dire « c'est en place », vérifier qu'un HUMAIN peut déclencher la fonction** — pas
   seulement que le code la supporte. Un bouton absent rend la fonctionnalité inexistante.
4. Résolution retenue ici (option B) : étoile locale (immédiate) **+ bouton d'export** vers le dépôt —
   l'utilisateur marque, Claude fige. Les deux besoins sont servis au lieu d'en sacrifier un.

**Corollaire du même jour — une doctrine ne s'applique pas toute seule à mes propres propositions.**
J'ai proposé une galerie d'**images fixes** pour montrer des **mouvements** de caméra. Aziz a corrigé :
une image fixe ne montre rien d'un mouvement. Or c'est exactement notre feedback déjà écrit
([[frame-espacee-sous-estime-mouvement-fin-lecture-continue-prime]], « des frames isolées NE PROUVENT
RIEN ») — appliqué jusque-là au *jugement* d'un livrable, jamais retourné vers un livrable que je
*concevais*. Une règle de vérification est aussi une règle de conception.
