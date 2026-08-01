---
name: mcp-servers-env-resolution
description: "Un serveur MCP declare dans .mcp.json avec ${VAR} n'expose aucun outil si cette variable n'existe que dans .env du projet — diagnostic et fix generique"
metadata:
  type: reference
---

# Serveur MCP qui n'expose aucun outil malgre une config .mcp.json correcte

**Symptome** : un serveur MCP declare dans `.mcp.json` avec un header du type
`"Authorization": "Bearer ${TRYPOST_API_KEY}"` (ou toute autre variable) n'expose **aucun outil**
au demarrage de Claude Code, sans message d'erreur explicite pointant la vraie cause. D'autres
serveurs MCP du meme `.mcp.json` avec des cles EN DUR fonctionnent normalement — seul celui avec
`${VAR}` echoue.

**Cause racine** : Claude Code resout les `${VAR}` d'un `.mcp.json` depuis **l'environnement du
PROCESS qui lance `claude`** — JAMAIS depuis le `.env` du projet (celui-ci n'est lu que par les
scripts applicatifs via `load_dotenv()`/`dotenv`, pas par le harness lui-meme). Si la variable
n'existe que dans le `.env`, le header part **litteralement** comme `Bearer ${TRYPOST_API_KEY}`
(la string non substituee) vers le serveur distant, qui repond 401/403 → Claude Code marque le
serveur "Failed to connect" et n'enregistre aucun outil.

**Diagnostic (2 minutes)** :
1. Reperer dans `.mcp.json` les serveurs qui utilisent `${VAR}` (pas de cle en dur).
2. Verifier si `env | grep <VAR>` dans le shell de la session renvoie quelque chose — si vide,
   c'est le bug.
3. Confirmer que le serveur distant lui-meme fonctionne : tester manuellement avec la cle *resolue*
   depuis `.env` (`source .env && curl -H "Authorization: Bearer $VAR" <url>`). Si ca repond 200,
   la clé est bonne et le serveur est sain — le probleme est bien la resolution de variable, pas
   autre chose.

**Fix** : copier la/les variable(s) manquante(s) dans le bloc `"env"` de `~/.claude/settings.json`
(fichier NON versionne, distinct de `.env` du projet) :
```json
{
  "env": {
    "TRYPOST_API_KEY": "<valeur>",
    "GAMELABS_API_KEY": "<valeur>"
  }
}
```
Puis **redemarrer Claude Code entierement** (pas juste relancer une commande dans la session — la
config MCP n'est lue qu'au demarrage). Verifier ensuite que les outils `mcp__<serveur>__*`
apparaissent (via ToolSearch ou en tentant un appel).

**Vecu 2026-08-01** : ce bug a touche `trypost` (echec de connexion total, zero outil) ET
`gamelabs` (symptome different — son endpoint SSE accepte la connexion sans auth, donc les outils
apparaissent mais echouent a l'APPEL avec 401, ce qui aurait pu passer inapercu jusqu'au premier
usage reel). Meme cause, deux symptomes distincts selon que le serveur exige l'auth des le
handshake ou seulement a l'appel — a garder en tete si un futur serveur MCP a un comportement
"outils presents mais tous les appels echouent".
