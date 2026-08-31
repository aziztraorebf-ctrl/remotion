---
name: mcp-recent-succes-declare-verifier-manuellement
description: Un MCP/outil externe récent ne prouve rien avec un statut SUCCESS sur les champs secondaires d'une écriture — vérifier manuellement dans l'outil tiers lui-même
metadata:
  type: feedback
---

Un MCP récent (annoncé depuis quelques semaines seulement) ne doit jamais voir son statut
"SUCCESS"/"OK" pris comme preuve suffisante d'exécution réelle — en particulier sur les
CHAMPS SECONDAIRES d'un appel (pas le contenu principal, mais les paramètres annexes).

**Pourquoi** : cas Upwork du 2026-08-31 (détail technique complet dans
[[upwork-mcp]] `memory/tools/upwork-mcp.md`) — `confirm_draft` a répondu `status: SUCCESS`
alors que `boost_connects` n'avait pas été appliqué ET que les 6 `attachments` n'avaient pas
été rattachés à la proposition réelle. Le seul moyen fiable de détecter l'écart a été la
vérification manuelle d'Aziz dans l'app Upwork elle-même — pas dans les tools MCP de
lecture, qui auraient pu recycler la même donnée erronée en interne. Répété 2 fois dans la
même session, 2 écarts trouvés à chaque fois.

**Comment appliquer** : ce principe dépasse le cas Upwork — s'applique à TOUT MCP/outil
externe jeune sur lequel on écrit des données réelles, tant qu'il n'a pas prouvé sa
fiabilité sur plusieurs usages répétés. Après toute écriture significative (paiement,
publication, pièce jointe, paramètre de configuration) via un tel outil : demander à Aziz
de vérifier lui-même dans l'interface tierce, ne jamais annoncer "envoyé/fait avec succès"
sur la seule foi de la réponse structurée de l'outil. Rejoint la règle CLAUDE.md "vérifier
avant d'affirmer" — mais précise que même une réponse SANS erreur n'est pas une preuve
suffisante pour un outil récent.
