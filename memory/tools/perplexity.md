# Perplexity (via OpenRouter) — fact-check règle d'or + pricing/gotchas

> Migré depuis auto-memory 2026-08-31 (règle établie 2026-05-07, mise à jour 2026-05-11 ;
> pricing vérifié 2026-05-07). Fusionne 2 fichiers auto-memory (`feedback_perplexity-fact-check-rule.md`
> et `feedback_perplexity-openrouter-pricing.md`). Voir aussi `memory/tools/tavily.md` pour la
> recherche web générale, et les rapports fact-check existants dans
> `archive/episodes-livres/money-legends/or-africain-fact-check-perplexity.md`,
> `episodes/souverain/xenophobie-sa-EXPLORATION/02-PERPLEXITY-FACT-CHECK.md`,
> `episodes/souverain/senegal-petrole-gaz/jury/perplexity-factcheck-v2.md` pour des exemples de sortie.

## RÈGLE D'OR — fact-check obligatoire après script lock

Une fois qu'un script est validé/locked et qu'on est prêt à lancer la production, **AVANT même de
générer l'audio TTS**, lancer un fact-check Perplexity (**Sonar Pro via OpenRouter — pas Deep
Research, trop cher et redondant avec les recherches WebSearch faites en amont**).

**Why** : sur Or Africain (2026-05-07), découvert en post-prod que :
1. La source Mali était précise (Bloomberg nov. 2025) mais Burkina et Niger n'avaient AUCUNE source affichée
2. Le Niger a nationalisé l'**uranium** (mine Somaïr d'Orano), PAS de l'or — l'audience aurait pu reprocher cette imprécision dans un Short sur "l'or africain"
3. Sans fact-check pré-prod, un v3 du render a dû être fait après livraison v2 pour corriger

## How to apply

1. **Quand** : après script lock, **AVANT ElevenLabs TTS**
2. **Outil** : OpenRouter — modèle `perplexity/sonar-pro` (rapide, citations solides, suffisant avec recherches WebSearch en amont)
   - `perplexity/sonar-deep-research` : RETIRÉ du workflow par défaut — trop cher, redondant quand un WebSearch approfondi a déjà été fait
3. **Input** : prompter Perplexity avec le script complet + demander de :
   - Lister chaque affirmation factuelle (chiffres, dates, lois, noms, montants, comparaisons quantitatives)
   - Confirmer / nuancer / réfuter chaque fait avec source primaire (institutionnelle de préférence : loi officielle, communiqué d'entreprise, rapport ONU/FMI, plutôt que média)
   - Proposer des reformulations pour les faits ambigus ou trompeurs
4. **Output attendu** :
   - Faits confirmés + URL source primaire prête à citer
   - Faits à reformuler (ex: Niger uranium ≠ or)
   - Faits faux à supprimer
   - Sources affichables en sous-badge dans le visuel
5. **Intégration manifest** : dès cette étape, ajouter les sources au manifest visuel pour qu'elles soient codées dès la première itération.

**Avantage** : économise potentiellement 1-2 re-renders Mapbox WebGL (~10-20 min) en aval. ROI immédiat.

**Bonus** : conserver le rapport Perplexity dans `memory/episodes/<projet>/fact-check.md` pour audit rétroactif et défense en commentaires.

## Modèles disponibles sur OpenRouter (vérifié 2026-05-07)

| Modèle OpenRouter | Input | Output | Search | Context | Notes |
|-------------------|-------|--------|--------|---------|-------|
| `perplexity/sonar` | $1/M | $1/M | inclus | 128k | Basique, à éviter pour fact-check sérieux |
| `perplexity/sonar-pro` | $3/M | $15/M | inclus | 200k | Search rapide + citations, max_output 8k tokens |
| `perplexity/sonar-deep-research` | $2/M | $8/M | $5/1000 | 128k | Multi-step research, 30-90s, rapport structuré |
| `perplexity/sonar-pro-search` | $3/M | $15/M | +$18/1000 req | 200k | Pro Search mode (autonomous reasoning) |

⚠️ Pricing à re-vérifier avant usage — ces chiffres datent de mai 2026.

## Coût réel observé sur Or Africain fact-check

- 1256 input + 3000 output tokens + ~10 searches
- = $0.027 pour rapport Deep Research complet sur script 250 mots
- **Estimation type** : $0.10-0.30 par fact-check vidéo (selon longueur script)

## Gotchas

### #1 — max_tokens limité par crédits OpenRouter
OpenRouter limite `max_tokens` à ce que le solde permet. Erreur 402 si trop ambitieux.
**Solution** : commencer à `max_tokens: 3000` (suffit pour ~8 affirmations factuelles structurées). Si rapport tronqué, faire un 2e appel sur les affirmations restantes.

### #2 — Endpoint API

```python
URL = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://claude.ai",  # optionnel mais recommandé
    "X-Title": "MyApp"                     # optionnel
}
body = {
    "model": "perplexity/sonar-pro",
    "messages": [{"role": "user", "content": prompt}],
    "max_tokens": 3000,
    "temperature": 0.2,  # bas pour fact-check rigoureux
}
```

### #3 — Format réponse
Citations parfois dans `data["choices"][0].get("citations")` (non-standard). À gérer.

## Quand utiliser quel modèle

- **Fact-check pré-prod vidéo (DÉFAUT)** : `sonar-pro` — suffisant quand WebSearch approfondi déjà fait en amont. Rapide + citations solides.
- **Vérif rapide d'une affirmation isolée** : `sonar-pro` (même modèle)
- **Recherche conversationnelle** : `sonar-pro-search`
- **Test cheap** : `sonar` (mais qualité limitée)
- **`sonar-deep-research`** : réservé uniquement si aucune recherche WebSearch préalable ET sujet très sensible.

## Script de référence

`scripts/tools/perplexity-fact-check-or-africain.py` (⚠️ vérifier existence) : pattern complet TTS + structure prompt + parsing réponse.
