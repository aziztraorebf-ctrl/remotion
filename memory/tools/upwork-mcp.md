# MCP Upwork — gotchas et protocole (première utilisation 2026-08-31)

> ⚠️ Si ce que tu lis ne correspond PAS au comportement réel observé : **c'est cette fiche
> qui a tort**, corrige-la. Le MCP est récent (annoncé ~10/08/2026) et évolue vite.

## Connexion

Serveur officiel Upwork : `claude mcp add --transport http upwork https://mcp.upwork.com/mcp`
puis `claude mcp login upwork` **depuis un terminal interactif** (OAuth 2.1, ne marche pas en
session non-interactive). Après connexion, redémarrer la session pour charger les tools
`mcp__upwork__upwork__*`. Vérifier avec `claude mcp get upwork` (doit dire `✔ Connected`).

Tous les tools de lecture/écriture exigent `org_uid` à CHAQUE appel (pas seulement le premier)
— le récupérer via `list_accounts` une fois par session et le garder sous la main.

## ⛔⛔ BUGS CONFIRMÉS — ne jamais faire confiance à un statut "SUCCESS" seul

**Contexte** : candidature vokabl du 2026-08-31, `memory/client-sim-tests/upwork-vokabl/STATUS.md`.

1. **`boost_connects` silencieusement ignoré.** `update_draft` puis `confirm_draft` avec
   `boost_connects: 4` dans les params ont renvoyé `status: SUCCESS` sans erreur. Le solde de
   connects réel après envoi (105) prouvait qu'AUCUN boost n'avait été débité (118 − 13
   candidature = 105 pile ; un boost de 4 aurait donné 101). Vérifié aussi dans
   `usage_history` : une seule ligne "Job application −13", aucune ligne de boost.
2. **`attachments` silencieusement non rattachés (proposals) — CONFIRMÉ 2× (2026-08-31 et
   2026-09-01, 2 candidatures différentes).** 6 `file_uid` (obtenus via
   `start_attachment_upload` + `get_upload_status`, tous `status: done`) passés au param
   `attachments` de `manage_proposals create`. Le draft ET le preview les affichaient
   correctement. Après `confirm_draft` (`SUCCESS`), la proposition réelle — vérifiée à la fois
   dans l'app Upwork ET via `list_freelancer_proposals get` — n'avait AUCUNE pièce jointe.
   ⛔⛔ **Ce n'est plus un doute, c'est un pattern reproductible** : 2e occurrence identique sur
   le même endpoint (`manage_proposals create`), avec 2 candidatures indépendantes (vokabl
   08-31, Appstore promo video 09-01). Aziz a dû joindre les fichiers manuellement dans l'app
   les 2 fois. **Ne plus tenter `attachments` sur `manage_proposals create` en espérant que
   ça passe** — annoncer d'emblée à Aziz qu'il devra les joindre lui-même dans l'app après
   l'envoi, plutôt que de le découvrir après coup à chaque fois.
3. **Pièces jointes mal affichées côté client (messages), 2026-09-01.** Livraison Milestone 1
   chill-meter (`room_bc1dd916da7ec932f9e0d1ca6719dc96`). `send_message` avec
   `file_attachments` (2 PNG, `file_id`/`image_id` obtenus via upload inline) a renvoyé succès,
   ET `list_messages` en relecture montrait bien les 2 attachments avec `scanStatus: CLEAN` —
   **donc ce n'est PAS le même bug que #2** (côté API/MCP tout est correct, vérifié 2 fois).
   Pourtant Aziz (côté client, dans l'app) a constaté que les images ne s'affichaient pas
   correctement, et a dû les re-uploader manuellement en éditant le message. **Écart entre ce
   que l'API confirme et ce que l'app affiche réellement au destinataire** — donc même un
   `list_messages` qui semble tout confirmer ne suffit pas.

4. **`confirm_attachment_upload` échoue avec une ERREUR UPSTREAM EXPLICITE (pas un faux SUCCESS) —
   2026-09-01, candidature spark-icon.** Distinct des bugs #1-3 ci-dessus : ici pas de rattachement
   via le param `attachments` de `create`, mais un upload standalone (`start_attachment_upload` →
   `get_upload_status` confirmant `status: done` → `confirm_attachment_upload`). Cette dernière
   étape a échoué 2 fois de suite avec `error_code: UPSTREAM` — un vrai échec visible, pas un
   succès trompeur. Le fichier était bien stocké côté Upwork (`file_uid` valide, `status: done`)
   mais jamais rattaché au draft. Aziz a dû l'attacher manuellement dans l'app.

**Cause racine non identifiée** — pas assez de recul pour trancher entre bug serveur MCP,
mauvais relais d'un sous-champ à l'exécution finale, race condition, ou (cas #3) un problème
de rendu/propagation côté app Upwork après un envoi via API tierce. Pour #1 et #2, les champs
étaient corrects dans le draft ET dans le preview juste avant confirmation — l'écart se
produit spécifiquement à l'étape `confirm_draft`. Pour #3, même la relecture post-envoi via
MCP ne suffisait pas à détecter le problème — seul un contrôle visuel dans l'app l'a révélé.

**Protocole à suivre** :
- ⛔⛔ **Pour `manage_proposals create` avec `attachments` : ne plus attendre une vérification
  après coup — prévenir Aziz AVANT l'envoi que les pièces jointes échoueront probablement
  et qu'il devra les rejoindre lui-même dans l'app** (2 échecs sur 2 essais, cf ci-dessus).
  Pour `send_message` (messages) et `boost_connects`, le bug est moins établi (1 occurrence
  chacun) — **toujours demander à Aziz de vérifier lui-même dans l'app Upwork** (mobile ou
  web) après `confirm_draft`, jamais annoncer "envoyé avec succès" sur la seule foi de la
  réponse MCP pour ces champs.
- ⭐ **Limite de lecture notée en passant (2026-09-01)** : `list_freelancer_proposals get`
  ne renvoie même PAS de champ `attachments` dans sa réponse, que les fichiers soient
  attachés ou non — impossible de confirmer/infirmer un attachement de proposition par ce
  seul appel. Contrairement à `get_messages list_messages`, qui LUI affiche bien les
  attachments d'un message avec `scanStatus`. Ne pas conclure "pas d'attachments" ou
  "attachments OK" sur la base de `list_freelancer_proposals get` seul — il ne le dit pas.
- ⛔⛔ **Ce contrôle vaut AUSSI pour `send_message` avec pièces jointes** (pas seulement
  `manage_proposals`) — le cas #3 montre qu'un `list_messages` qui confirme tout côté API
  n'exclut pas un problème d'affichage réel côté app. Ne jamais annoncer une pièce jointe
  "bien envoyée" sur la seule foi d'une relecture MCP quand des images sont en jeu.
- Si un écart est trouvé : Aziz corrige manuellement dans l'app (`Edit proposal` /
  ré-upload manuel du message) — plus fiable que retenter côté MCP tant que la cause n'est
  pas comprise.
- Le CONTENU de la lettre/du message et le MONTANT (`charged_amount`), eux, sont arrivés
  corrects et fidèles au draft dans tous ces tests — le problème semble concentré sur le
  sous-système fichiers/images (upload, attachment, rendu), pas généralisé à tout le payload.
- ⭐ **Piste à explorer si le bug se reproduit** : comparer le serveur MCP officiel Upwork à
  un accès direct à l'API REST Upwork (si un token/app existe côté Aziz) pour voir si le
  problème est spécifique à la couche MCP ou présent aussi en API directe — non testé à ce
  jour, aucune conclusion à tirer avant un vrai comparatif.

## ⛔ Vérifier l'état de financement réel via l'API AVANT toute action qui engage la relation client

Avant de relancer sur un paiement ou proposer un livrable, vérifier l'état des jalons EN DIRECT
(`list_milestones` / `get_freelancer_financials`) — jamais sur la foi d'une note mémoire, qui périme
vite. Vécu (contrat chill-meter 44402562, 08/09) : `STATUS.md` portait une lecture erronée d'un jalon
`NotFunded` comme "argent pas déposé", corrigée seulement après vérification API (`fundedAmount` déjà
rempli sur les 3 jalons — `NotFunded` signifiait "pas encore actif dans la séquence", pas "pas payé").
Une décision de relance/négociation basée sur l'ancienne lecture aurait été fausse.

## Mécanique confirmée fiable

- **Flux draft → confirm** : toute écriture (`manage_proposals`, `submit_milestones`,
  `send_message`, etc.) crée un draft serveur via l'action correspondante, jamais une
  exécution directe. Un aperçu complet (`preview`) est retourné, à valider AVEC Aziz avant
  `confirm_draft(type=..., draft_id=...)`. Éditer un draft (`update_draft`) invalide
  l'ancien `draft_id` et en émet un nouveau — la ré-approbation est donc obligatoire à
  chaque édition, pas seulement à la création.
- **Upload de fichiers** : `start_attachment_upload(context="proposals", ...)` renvoie un
  `fallback_url` (`https://mcp.upwork.com/ui/upload?task_id=...`) valide 30 minutes. Aziz
  doit lui-même télécharger les fichiers puis les uploader via ce lien (impossible de le
  faire depuis le côté agent — mécanisme volontaire, garde-fou de sécurité). Pour un usage
  mobile sans le Mac : mettre les fichiers sources sur Vercel Blob AVANT de générer le lien
  d'upload, pour que tout soit faisable depuis le téléphone. Après upload, `get_upload_status`
  (PAS `confirm_attachment_upload`, réservé aux uploads non-inline) renvoie les `file_uid`.
- **Scopes OAuth** : à la connexion, l'autorisation donne accès à TOUT le compte d'un coup
  (pas de granularité read-only isolable côté OAuth) — la sécurité repose sur la discipline
  draft→confirm et sur `always_ask` (défaut), pas sur un scope technique limité.
- **Filtres de statut** : `list_freelancer_proposals list` par défaut ne montre QUE le statut
  `Accepted` (= "soumis avec succès", pas "accepté par le client"). Une proposition qui a
  débouché sur un contrat passe au statut `Hired` et disparaît du filtre par défaut — utiliser
  `status: "Hired"` explicitement pour la retrouver après signature.
- **Limite `find_jobs`** : `limit` plafonné à 10 résultats par appel (paginable via `cursor`).
  Pas de scraping massif en un seul appel, par construction.
- **Rien à faire côté Upwork après confirmation** : contrairement à une intuition naturelle,
  il n'existe PAS de brouillon visible dans l'app Upwork à valider séparément — la seule
  confirmation nécessaire est celle donnée à Claude dans la conversation, avant l'appel
  `confirm_draft`. Une fois confirmé, la proposition est réellement envoyée, point final
  (sous réserve des 2 bugs ci-dessus sur des sous-champs spécifiques).

## ⭐⭐ Biais structurel de visibilité — pourquoi un profil neuf voit surtout des petits budgets

Vérifié par recherche web le 2026-09-01 (question d'Aziz : "les bonnes offres sont-elles cachées
aux profils sans historique ?"). Le mécanisme réel n'est PAS qu'un client peut cacher une offre à
un freelance précis — mais l'effet perçu est réel, via 3 canaux différents :
1. **Classement des propositions** : sur une offre à beaucoup de propositions, Upwork classe ce
   que le CLIENT voit en premier selon la proximité du profil au brief — un profil neuf sans
   historique atterrit mécaniquement plus bas dans sa liste, même candidaté à temps.
2. **Featured Jobs** : poussées par email en priorité aux freelances Top Rated / Rising Talent —
   canal fermé tant qu'on n'a pas ce badge, donc ces offres nous sont invisibles EN AMONT.
3. **Filtres client** (`Job Success 90%+`, `Rising Talent`) : un client peut filtrer les candidats
   qu'il regarde par ces critères — équivalent pratique à nous rendre invisibles pour lui, même
   avec une proposition envoyée.
⭐ **Conséquence pratique** : les offres qu'on voit en tête de nos recherches manuelles (peu de
propositions, client récent) sont statistiquement sur-représentées en petit budget/profil client
neuf — pas parce que la recherche est mal faite, mais parce que les bons freelances établis ne
les voient pas en priorité (pas de Featured Jobs) et ont peu de motivation à y répondre. Ne pas en
déduire que la méthode de recherche a un problème — c'est un biais structurel de plateforme, pas
une erreur de tri. La doctrine Q1-stack-first (`memory/fiches/FICHE-BRIEF-CLIENT.md`) reste le bon
filtre sur ce qu'on VOIT ; ce biais explique juste la COMPOSITION de ce qu'on voit.
Sources : support.upwork.com (Featured Jobs, Rising Talent), upwork.com/resources (proposal
visibility), vollna.com/blog (algorithme Upwork 2026).

## Politique anti-spam Upwork (pas un rate-limit technique du MCP)

Upwork interdit la soumission de propositions sans qu'un humain les revoie avant l'envoi —
c'est une politique de plateforme, appliquée dans le protocole via le flux draft→confirm
obligatoire, pas une limite numérique arbitraire. Bonne pratique citée dans la doc tierce :
rester sous ~15 propositions/heure si on automatise la recherche — largement hors de portée
de notre usage (candidatures ponctuelles, réfléchies).

## Ce que le MCP NE peut PAS faire

- Voir les montants misés par les autres candidats (`bid_stats` = fonctionnalité payante
  "Freelancer Plus", absente sur le plan Basic — le MCP le signale explicitement plutôt que
  d'inventer un chiffre).
- Initier une conversation sur une proposition côté freelance (TALENT) — c'est au client
  d'écrire en premier ; répondre seulement via une room existante.
- Uploader un fichier à la place d'Aziz (garde-fou volontaire, voir ci-dessus).

## Portfolio réutilisable produit lors du premier usage réel

`out/PORTFOLIO-UPWORK/README.md` — 6 pièces vidéo couvrant 5 registres visuels, retraitées
pour un usage anglophone générique (narration coupée, textes FR corrigés). Base à réutiliser
et enrichir pour toute candidature future, pas seulement celle qui l'a produit.

## ⭐ GARDE-FOU — ne jamais envoyer depuis le MCP sur un contrat actif (2026-09-11)

Vérifier après coup qu'aucun envoi n'a eu lieu via le MCP est une vérification **utile, pas de la
paranoïa** (fait par Aziz le 11/09 sur le contrat chill-meter : confirmé lecture seule uniquement).

Les envois client de ce contrat passent TOUS par l'interface Upwork **manuellement** (bug
`attachments` confirmé 2×) : un `send_message` parti du MCP créerait un message **sans ses pièces
jointes**, dans un fil contractuel.

⛔ Ne jamais appeler `upwork__send_message` / `upwork__submit_milestones` sur un contrat actif sans
demande explicite d'Aziz **dans le tour courant**. Une validation de brouillon n'est pas une
autorisation d'envoi.
