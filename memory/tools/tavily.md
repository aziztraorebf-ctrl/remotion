# Tavily — recherche web + extraction (DÉFAUT, remplace Firecrawl)

> ⭐ **RÈGLE** : Tavily = outil de recherche web par DÉFAUT pour search + extract. Firecrawl = secours uniquement pour crawl lourd de site entier (jamais payer l'abo mensuel). Validé 2026-06-16.

## Pourquoi Tavily plutôt que Firecrawl
- On n'utilise que 2 fonctions sur ~30 de Firecrawl : chercher (`search`) + lire une page (`extract`). Payer l'abo Firecrawl mensuel pour 2 fonctions = refusé par Aziz.
- Tavily est conçu POUR agents IA : renvoie des extraits **scorés par pertinence** (moins de bruit, moins de tokens) là où Firecrawl rend la page brute complète (menus/pubs/footers).
- Plus rapide : mesuré search ~2,5s (advanced), extract ~0,1s.
- Firecrawl tombait en 402 (crédits épuisés) → ce qui a déclenché la bascule.

## Accès = MCP remote (déjà branché)
- Config dans `.mcp.json` (projet) : serveur `tavily`, `type: http`, URL `https://mcp.tavily.com/mcp/?tavilyApiKey=<CLE>`.
- Clé aussi dans `.env` racine : `TAVILY_API_KEY` (pour scripts éventuels).
- ⚠️ La clé du remote MCP est passée DANS L'URL (param `tavilyApiKey`). Auth Tavily standard. NE PAS exposer la clé en clair ailleurs.
- Après modif `.mcp.json` → **relancer Claude Code** (les MCP chargent au démarrage ; approuver le serveur projet au redémarrage).

## Outils disponibles (5)
- `mcp__tavily__tavily_search` — recherche web. Params utiles : `search_depth` (basic/advanced/fast/ultra-fast), `time_range` (day/week/month/year), `start_date`/`end_date` (YYYY-MM-DD), `include_domains`/`exclude_domains`, `country`, `max_results`. = remplace `firecrawl_search`.
- `mcp__tavily__tavily_extract` — lire le contenu d'URLs précises. Params : `urls[]`, `extract_depth` (basic/advanced — advanced pour tables/sites protégés), `format` (markdown/text), `query` (rerank des chunks par pertinence). = remplace `firecrawl_scrape` + WebFetch+PDF.
- `tavily_crawl` / `tavily_map` — crawl/cartographie de site (NON testés en réel ; pour le crawl lourd, Firecrawl reste plus éprouvé).
- `tavily_research` — recherche multi-sources agentique. **Testé et validé 2026-07-04** (mode `pro`) : synthèse structurée avec sources citées sur un sujet complexe (usage réel app Grok Imagine), bien plus fiable que le skill `/last30days` sur un sujet où les vidéos YouTube trouvées n'ont pas de transcripts (voir section fallback ci-dessous).

## Fallback quand `/last30days` bloque (sujet sans transcripts YouTube)
Observé 2026-07-04 : le skill `/last30days` peut échouer silencieusement (bouclage sans jamais atteindre la synthèse finale) quand les vidéos YouTube trouvées sur un sujet n'ont aucun sous-titre/transcript disponible — le moteur retente indéfiniment (yt-dlp → fallback HTTP → ScrapeCreators) sans jamais abandonner proprement. Confirmé 2x de suite sur le même sujet (~20 min puis ~16 min avant kill manuel), y compris après avoir retiré "youtube" des sources du plan JSON (le moteur y retourne quand même).
- **Symptôme** : process qui progresse (CPU/lignes de log qui bougent) mais qui boucle sur les memes tentatives YouTube sans jamais sauvegarder de rapport final.
- **Fallback recommandé** : basculer sur `mcp__tavily__tavily_research` (mode `pro`) directement plutôt que de retenter `/last30days` ou d'attendre indéfiniment qu'il se débloque. A fourni l'essentiel des informations utiles dans ce cas, avec sources citées.

## Quotas (page pricing officielle, vérifié 2026-06-16)
- **Free (Researcher)** : 1 000 crédits/mois, sans carte. ← plan actuel.
- **Pay As You Go** : 0,008 $/crédit.
- **Project** : 4 000 crédits/mois. **Étudiants** : gratuit.
- Coût/appel : ~1 crédit (search basic), ~2 (advanced), ~1/5 URLs (extract) — **estimation** (la page pricing ne détaille pas ; à confirmer via dashboard si besoin). 1 000 crédits ≈ 500-1000 recherches/mois = largement suffisant.

## Bonnes pratiques
- `search_depth: advanced` + `time_range`/`start_date` pour l'actu datée (ex. situation militaire qui bouge).
- `include_domains` pour cibler les sources primaires (ICG, ACLED, OHCHR, Chatham House…).
- `extract` avec `query` = rerank : donner le sujet précis pour ne récupérer que les chunks utiles.
- Pour figer un chiffre incertain : `extract` la source primaire plutôt que se fier à un snippet de search.

Liens : [[apis-and-tools]] · [[key-learnings]].
