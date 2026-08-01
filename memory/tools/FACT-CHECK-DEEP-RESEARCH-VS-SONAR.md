---
name: FACT-CHECK-DEEP-RESEARCH-VS-SONAR
description: Quand utiliser Perplexity Deep Research vs Sonar Pro vs Tavily pour le fact-check. Test comparatif Soudan 2026-06-16. Cutoff Deep Research = fin 2024 (aveugle sur actu récente).
metadata:
  type: reference
---

# FACT-CHECK : Deep Research vs Sonar Pro vs Tavily

> Test comparatif réel (fact-check Actes 1-2 Soudan, 2026-06-16). Pour tous formats de vidéo.

## Les 3 outils, par usage

| Outil | Modèle / accès | Force | Faiblesse | Coût |
|---|---|---|---|---|
| **Perplexity Deep Research** | `perplexity/sonar-deep-research` via OpenRouter (`OPENROUTER_API_KEY`) | Raisonnement multi-step, **détection de nuances/biais** (ex : « qui a tiré le premier » = récit disputé), reformulations tracées, auto-signale ses limites | ⚠️ **CUTOFF fin 2024** — AVEUGLE sur l'actu 2025-2026 (marque « NON VÉRIFIABLE »). Lent (~4 min). | ~0,19$ pour 10 affirmations (237s) |
| **Sonar Pro** | `perplexity/sonar-pro` via OpenRouter | Rapide, recherche web live, citations | Moins de profondeur analytique que Deep Research | $3/M in, $15/M out |
| **Tavily** | MCP `tavily_search`/`extract` | **Actu FRAÎCHE** (juin 2026 OK), sources datées, scorées | Pas de raisonnement multi-step (c'est moi qui synthétise) | gratuit 1000/mois |

⚠️ **BUG CONNU (2026-08-01, fact-check Gazoduc)** : Deep Research peut renvoyer une **réponse VIDE malgré
un HTTP 200** — pas d'exception, `choices` absent ou contenu vide, silencieux. Constaté sur un prompt long
(script complet en contexte). TOUJOURS vérifier que le texte retourné est non-vide avant de traiter l'appel
comme réussi. Ne PAS s'acharner à relancer le même outil — basculer sur un 2e/3e passage Sonar Pro ciblé,
surtout si le sujet est 100% daté de l'année courante (Deep Research y est de toute façon peu utile, cutoff
fin-2024).

## RÈGLE D'USAGE (qui pour quoi)
- **Fond historique / structurel + détection de biais/nuance** → **Deep Research**. (Ex : relations de pouvoir, « qui a commencé », formulations qui prennent parti involontairement.) Le plus utile sur un sujet COMPLEXE où une simplification peut devenir de la propagande.
- **Actu récente / ce qui bouge** (situation militaire, chiffres à jour, événement 2025-2026) → **Tavily** (ou Sonar Pro). Deep Research est aveugle dessus.
- **Idéal sujet complexe** : LES DEUX. Deep Research pour le socle + nuances ; Tavily pour verrouiller le présent. Ils sont complémentaires, pas concurrents.

## CE QUE DEEP RESEARCH A ATTRAPÉ (et qu'un check rapide aurait raté)
1. « X frappe le premier » dans une guerre = souvent un **récit disputé** des deux camps → ne pas l'affirmer (risque propagande).
2. Distinctions de pouvoir fines (« gardait pour le compte de » vs « contrôlait dans un pacte de rente »).
3. Superlatifs attaquables (« LA plus grande crise » vs « l'UNE des plus graves » / « plus grande crise de déplacement »).
4. Confusion besoins humanitaires GLOBAUX vs insécurité alimentaire (chiffres différents).

## RÉSULTAT TEST DIRECT (2026-06-16, mêmes affirmations Soudan)
- **Deep Research** : 237s, 0,19$. Profondeur max, nuances fines. AVEUGLE 2025-2026.
- **Sonar Pro** : 53s, 0,10$. Rapide, citations numérotées [1][11], un peu d'actu (a confirmé Polymarket ~20%). MAIS étonnamment PRUDENT : a botté en touche sur El Fasher oct.2025, famine IPC, 1000 morts drones (« non vérifiable ») — **alors que Tavily avait ces faits avec sources datées**.
- **VERDICT** : aucun Perplexity ne bat **Tavily** sur l'actu fraîche vérifiable. Hiérarchie réelle :
  - **Tavily** = roi actu vérifiable (sources primaires datées). LE SOCLE.
  - **Deep Research** = roi nuance structurelle/historique + détection propagande. Le fond.
  - **Sonar Pro** = bon milieu rapide/citations, mais trop prudent (rate des faits que Tavily a).
- **Convergence rassurante** : les 3 outils d'accord sur les corrections critiques (« contrôlait » pas « gardait » · « qui tire le premier » disputé · superlatif crise à nuancer) → triple confirmation.

## PROCÉDURE
1. Lister les affirmations narratives (pas les faits triviaux) en 1 prompt structuré (verdict + reformulation + source par affirmation).
2. Lancer Deep Research en arrière-plan (script type : `/tmp/deep-research-*.py`, POST OpenRouter).
3. Pour tout point daté 2025-2026 → re-vérifier avec Tavily (Deep Research aveugle).
4. Appliquer SEULEMENT ce qui est vrai (comme Gemini : signal, pas juge). Le jugement éditorial d'Aziz prime.

Liens : [[tavily]] · [[soudan-midform-DONNEES]] · [[DA-BRIEF-GATE]].
