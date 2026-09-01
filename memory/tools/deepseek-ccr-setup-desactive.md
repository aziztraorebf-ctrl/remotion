# DeepSeek V4 via CCR — état et décision (DÉSACTIVÉ)

> Migré depuis auto-memory 2026-08-31 (statut au 2026-05-10). Distinct de l'usage DeepSeek comme
> 3e voix DA-brief (`deepseek/deepseek-v4-pro` via OpenRouter, verrouillé dans CLAUDE.md racine) —
> ce document couvre une tentative désactivée de faire tourner Claude Code LUI-MÊME via DeepSeek
> (proxy CCR), pas l'usage DeepSeek comme modèle de review/génération dans un script.

## Statut : DÉSACTIVÉ (2026-05-10)

Deux tentatives de migration échouées. CCR + OpenRouter + DeepSeek V4 Flash **fonctionne techniquement** mais mis en pause.

**Why:** Le workflow est vision-heavy (~80%+ des sessions utilisent images/screenshots). DeepSeek V4 Pro/Flash n'ont pas de vision intégrée. Complexité trop élevée pour le gain attendu.

**How to apply:** Ne pas relancer la migration sans vérifier les 3 conditions ci-dessous.

## Conditions de réactivation (les 3 déclencheurs)

- (a) DeepSeek annonce un V4 Vision avec endpoint Anthropic-compatible
- (b) Proportion workflow vision tombe sous 20%
- (c) Coût Anthropic dépasse X$/mois soutenu pendant 4 semaines consécutives

## Tentative 1 — API DeepSeek directe (échouée)

Config dans `~/.zshrc` :
```bash
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="$DEEPSEEK_API_KEY"
export CLAUDE_CODE_EFFORT_LEVEL="max"  # COUPABLE
```
Problème : `EFFORT_LEVEL=max` → thinking tokens 300s+ → accumulation dans historique → boucle compactage infinie.

## Tentative 2 — CCR + OpenRouter (fonctionnel mais désactivé)

### `~/.claude-code-router/config.json` (config correcte)
```json
{
  "Providers": [
    {
      "name": "openrouter",
      "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
      "api_key": "$OPENROUTER_API_KEY",
      "models": ["deepseek/deepseek-v4-flash", "deepseek/deepseek-v4-pro"]
    }
  ],
  "Router": {
    "default": "openrouter,deepseek/deepseek-v4-flash",
    "longContext": {
      "model": "openrouter,deepseek/deepseek-v4-pro",
      "threshold": 150000
    }
  }
}
```

### Bugs CCR 2.0.0 résolus (ne pas réintroduire)
- Clés config : `Providers` et `Router` en **majuscule** obligatoire
- Format modèle dans Router : `"providerName,modelId"` (ex: `"openrouter,deepseek/deepseek-v4-flash"`)
- `api_base_url` doit inclure `/chat/completions` complet (pas juste `/api/v1`)

### Pour réactiver quand conditions remplies
```bash
# 1. Décommenter dans ~/.zshrc :
export ANTHROPIC_BASE_URL="http://127.0.0.1:3456"
export ANTHROPIC_API_KEY="ccr-passthrough"

# 2. Charger le LaunchAgent
launchctl load ~/Library/LaunchAgents/com.clawdbot.ccr.plist

# 3. Sourcer
source ~/.zshrc
```

### Infrastructure en place (ne pas supprimer, au cas où réactivation)
- `~/.claude-code-router/config.json` — config prête
- `~/Library/LaunchAgents/com.clawdbot.ccr.plist` — LaunchAgent désactivé
- `@musistudio/claude-code-router@2.0.0` — installé globalement
- `OPENROUTER_API_KEY` — dans `~/.zshrc`, clé valide (⚠️ vérifier validité au 2026-08-31)
