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
2. **`attachments` silencieusement non rattachés.** 6 `file_uid` (obtenus via
   `start_attachment_upload` + `get_upload_status`, tous `status: done`) passés au param
   `attachments` de `manage_proposals create`. Le draft ET le preview les affichaient
   correctement. Après `confirm_draft` (`SUCCESS`), la proposition réelle — vérifiée à la fois
   dans l'app Upwork ET via `list_freelancer_proposals get` — n'avait AUCUNE pièce jointe.

**Cause racine non identifiée** — pas assez de recul pour trancher entre bug serveur MCP,
mauvais relais d'un sous-champ à l'exécution finale, ou race condition. Les DEUX champs
étaient corrects dans le draft ET dans le preview juste avant confirmation — l'écart se
produit spécifiquement à l'étape `confirm_draft`.

**Protocole à suivre tant que ce n'est pas re-testé et confirmé fiable** :
- Après tout `confirm_draft` qui touche `boost_connects` ou `attachments`, **toujours
  demander à Aziz de vérifier lui-même dans l'app Upwork** (mobile ou web) — jamais
  annoncer "envoyé avec succès" sur la seule foi de la réponse MCP pour ces 2 champs.
- Si un écart est trouvé : Aziz corrige manuellement dans l'app (`Edit proposal`) — plus
  fiable que retenter côté MCP tant que la cause n'est pas comprise.
- Le CONTENU de la lettre et le MONTANT (`charged_amount`), eux, sont arrivés corrects et
  fidèles au draft dans ce test — le problème semble spécifique à `attachments` et
  `boost_connects`, pas généralisé à tout le payload.

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
