# Upwork — "Motion Graphic Designer" (vokabl) — STATUS

> Candidature envoyée le **2026-08-31**, via le MCP Upwork officiel (première utilisation
> réelle de ce MCP en session, cf `memory/tools/upwork-mcp.md` pour le détail technique).

## ⭐⭐⭐ ÉTAT — proposition soumise, en attente de réponse

- **Proposal ID** : `2094511541814583297`, statut "Submitted" (Pending côté vocabulaire UI).
- **Montant final** : 40$ pour le sample (Aziz a ajusté de 45$ à 40$ après coup dans l'app,
  jugé plus réaliste). Full project non chiffré, cf lettre.
- **Boost** : 8 connects, position 1re place au moment de l'envoi (rang précédent : 7/6/5/3
  pour les positions 1-4). Ajouté manuellement par Aziz dans l'app après un échec silencieux
  du boost via MCP (voir bug ci-dessous) — expérience volontaire pour voir si la 1re place
  change quelque chose.
- **Pièces jointes** : 6 fichiers, ajoutés manuellement par Aziz dans l'app après un échec
  silencieux de l'attachement via MCP (voir bug ci-dessous). Détail des 6 pièces et leur
  provenance : `out/PORTFOLIO-UPWORK/README.md`.
- **Connects dépensés** : 13 (candidature) + 8 (boost) = 21, sur un solde de départ 118.

## Le job

"Motion Graphic Designer" — vokabl (plateforme d'apprentissage de l'allemand, UK, "coming
soon"). 200$ affiché, jalons : sample payé → direction/storyboard → 1er draft → 3 rounds de
révision. Client sérieux : 8 contrats, 5/5, 2344$ dépensés historiquement.
URL : https://www.upwork.com/jobs/~022094047514485334453

## ⛔⛔ 2 BUGS MCP DÉCOUVERTS PENDANT CETTE CANDIDATURE

Détail technique complet, avec preuve : `memory/tools/upwork-mcp.md` § BUGS CONFIRMÉS.
Résumé : `confirm_draft` a répondu `status: SUCCESS` alors que (1) le `boost_connects: 4`
passé au draft n'a PAS été appliqué (solde resté à 105 au lieu de 101), et (2) les 6
`attachments` passés au `create` n'ont PAS été rattachés à la proposition (absents de la
proposition telle que vue dans l'app ET dans la relecture via `list_freelancer_proposals
get`). Les deux corrigés manuellement par Aziz dans l'app après vérification.
**Leçon retenue** : ne jamais annoncer un envoi "réussi" sur la seule foi de la réponse MCP
— toujours faire vérifier par Aziz dans l'app tant que ce MCP n'a pas prouvé sa fiabilité
sur plusieurs candidatures.

## Ce que cette session a vraiment produit — au-delà de la candidature

⭐⭐⭐ Le travail réel n'est pas "une proposition Upwork" (15-30 min si le portfolio existait
déjà) mais un **portfolio de 6 pièces réutilisables**, couvrant 5 registres visuels distincts
(UI produit, storytelling conceptuel, personnage/bureau SaaS, flux de données), chacune
retraitée pour un usage anglophone générique (narration coupée, textes FR corrigés). Ce
portfolio sert de base à TOUTE candidature future via le MCP, pas seulement celle-ci.
→ `out/PORTFOLIO-UPWORK/README.md`

## La lettre envoyée

Voir le proposal_id ci-dessus dans l'app Upwork pour le texte exact et à jour (Aziz l'a
ajusté après l'envoi initial généré — prix 45$→40$). Style validé pendant la session :
zéro tiret cadratin, chaque exemple présenté avec un rôle concret (design/animation/code),
milestones réexpliqués avec le POURQUOI (pas une reformulation du brief client).

## Prochaine action si réponse

Si la cliente répond : lire le fil via `get_messages`/`list_freelancer_proposals get_room`,
arbitrer avec Aziz avant toute réponse écrite (même règle que chill-meter : le prix affiché
n'est pas une enchère de départ à descendre sans contrepartie).
