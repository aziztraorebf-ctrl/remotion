# Strategie distribution Kora & Cartes — diagnostic + choix d'outil

> Session 2026-06-06. Apres 5 jours de lancement decevant (IG/TikTok ~0 traction, YouTube OK : 28 abos, 2.9K vues).
> Gros travail de recherche (last30days + web + lecture doc reelle). NE PAS REPERDRE.

## 1. DIAGNOSTIC VERROUILLE (preuve, pas theorie)
- **Cause racine du flop IG/TikTok = thumbnail/couverture VIDE** (bloc de couleur uni).
- Preuve code : `schedule-postiz.py` n'envoie aucun champ couverture -> plateformes prennent la frame 0.
- Preuve bug outil : GitHub issue #1572 gitroomhq/postiz-app — "Postiz ne supporte pas la couverture custom Reels" alors que l'API Insta le permet (cover_url).
- Preuve analytics (screenshots Aziz) : vignette vide = 0 vue ; vignette avec contenu = 1571 vues (TikTok) / 138 (IG). Lien mecanique.
- Preuve visuelle : frame 0 de vraie-taille = aplat bleu (10 KB) vs frame contenu (590-650 KB).
- **PAS la faute** du warm-up (comptes ~2 sem, deja navigues), ni de l'automatisation, ni du contenu (YouTube/FB acquierent de vrais abos).
- Gemini avait diagnostique le symptome (thumbnail) mais s'est egare sur une fausse piste (shadowban-bot non prouve). Instinct initial d'Aziz (blocs vides) = le bon.

## 2. SOLUTION COUVERTURE = FRAME 0 (acquis universel, independant de l'outil)
- Methode : ffmpeg sur le MP4 final. Coller 1s d'une frame riche (ou frame quasi-invisible) au debut.
- Testee OK sur vraie-taille : frame 0 passe de aplat bleu -> carte "30,3 M km2". Catbox test : files.catbox.moe/9s2d3r.mp4
- Decision de gout EN ATTENTE : quelle image de couverture par video (eviter de spoiler le chiffre final), et 1s visible vs quasi-invisible.
- AUCUN outil (Postiz, TryPost, Ayrshare) ne fait la couverture custom proprement -> la frame 0 reste la solution quoi qu'il arrive.

## 3. CHOIX D'OUTIL — tranche factuellement
Critere clarificateur trouve par Aziz : **l'app review (approbation plateforme)**. Outil heberge = SON app deja approuvee (pas d'audit). Self-host = audit a TA charge (2 sem, site requis ; pire : Postiz self-host non-audite poste en PRIVE sur TikTok).

| Option | Verdict |
|--------|---------|
| Ayrshare (API) | ELIMINE — $149/mois min (agences). Mais SEUL a exposer videoViewRetention par API. A garder si gros volume futur. |
| Postiz self-host / TryPost self-host | ELIMINE pour commencer — app review a charge d'Aziz. |
| **TryPost Cloud** | ✅ CHOISI A TESTER — $16/mois, trial 7j gratuit SANS carte. |
| Postiz Cloud (actuel) | Fallback OK : deja approuve, marche. Defaut couverture (frame 0 regle) + analytics faible. |

## 4. TRYPOST CLOUD — verifie dans leur doc reelle (github trypostit/trypost-docs)
- **MCP natif** : `claude mcp add --transport http trypost https://app.trypost.it/mcp/trypost`. OAuth navigateur 1 fois. Compatible Claude Code directement.
- **Outils MCP** : Posts (List/Get/Create/Update/Publish/Delete/Attach Media/Preview/**Get Metrics**), Platforms, Signatures, Labels, Social Accounts, Workspace, API Keys.
- **Metriques par post via MCP** : `get-post-metrics-tool` (likes, comments, shares, reach, engagement). PAS zero analytics. Cache 5 min.
- **App review** : Cloud = "Connect TikTok, Authorize TryPost" (leur app). PAS d'audit. (Self-host = audit a charge.)
- **Prix** : Starter $16/mois (5 comptes), Plus $24, Pro $41. MCP + REST API sur TOUS les plans.
- **Bemol** : pas de retention seconde-par-seconde via API (TikTok rolling window). Pour le decrochage fin -> TikTok Studio natif (gratuit, deja dispo).
- **MCP requiert trial/abo actif** (HTTP 402 sinon). Trial 7j l'active.

## 5. API vs MCP pour travailler avec Claude
- MCP = plus naturel au quotidien (Claude agit DANS la conversation, sans scripts ni cles a gerer). Recommande pour Aziz.
- API = plus puissant en pipeline scripte. Ayrshare l'avait mais trop cher.
- TryPost donne LES DEUX (MCP + REST + meme PAT).

## 6. ETAT PUBLICATION (fait cette session)
- 24 posts Postiz en attente (9-20 juin) SUPPRIMES via API (script delete-postiz-pending.py corrige pour IDs live).
- Thiaroye (6 juin) deja PUBLISHED avec vrai thumbnail (soldat accroupi) -> 122 vues/2 likes -> LAISSE VIVRE (preuve par l'exemple).
- or-africain + vraie-taille deja publiees sans couverture -> Aziz a supprime manuellement sur IG/TikTok.
- Ordre narratif sauvegarde : ORDRE-POSTS-POSTIZ-SAUVEGARDE.md

## 7. PROCHAINES ETAPES (a decider)
1. Tester TryPost Cloud trial : `claude mcp add` + connecter 1 compte (confirme app review en pratique).
2. Generaliser frame 0 (choix image par video) sur les videos a republier.
3. Republier propre (TryPost ou Postiz) sur 2 jours, 2 posts/jour (eviter burst red flag).
4. SESSION SEPAREE : passe editoriale angle militant (voir TODO-PASSE-EDITORIALE-ANGLE-MILITANT.md) — Mansa Moussa "plus riche que Rockefeller" non prouve, Thiaroye titrage.

## 8. TRYPOST CLOUD — BRANCHE ET OPERATIONNEL (2026-06-06)
- MCP ajoute en scope USER : `claude mcp add --transport http --scope user trypost https://app.trypost.it/mcp/trypost --header "Authorization: Bearer $KEY"`
- Auth = PAT dans `.env` -> `TRYPOST_API_KEY=` (JWT, valide jusqu'a ~2027). Aussi utilisable pour REST API.
- Statut verifie : `claude mcp list` -> trypost ✓ Connected.
- IMPORTANT : MCP ajoute en cours de session n'est PAS charge avant REDEMARRAGE de Claude Code. Outils trypost dispo au prochain lancement.
- 26 outils MCP exposes. Cles pour nous : create-post-tool, publish-post-tool, get-post-metrics-tool, list-social-accounts-tool, list-content-types-tool, attach-media-from-url-tool.

### Comptes connectes (social_account_id pour publier)
- Facebook  "Koraetcartes" : 019e9de9-291d-7305-ba18-ed46fbec26ea
- Instagram "koraetcartes" : 019e9de9-6c3d-71a3-b438-1f3a3fda9c37
- YouTube   "Kora & Cartes": 019e9de9-e350-70ce-a3cb-2570aab342db

### TikTok
- ABSENT de TryPost Cloud actuellement (flag TIKTOK_ENABLED, desactive cote Cloud, lie aux durcissements API TikTok mai 2026). Probablement temporaire.
- DECISION : TikTok 100% MANUEL pour l'instant (volume faible, frame 0 = couverture propre, retention native TikTok Studio gratuite). Ajouter a TryPost quand il revient.

### App review : RESOLU en pratique
- Connexion des 3 comptes via TryPost Cloud = juste "Authorize", AUCUN credential developpeur demande. Leur app est approuvee. Self-host aurait demande l'audit (instinct d'Aziz confirme).
