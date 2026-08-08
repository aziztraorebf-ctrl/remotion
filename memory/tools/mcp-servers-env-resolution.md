---
name: mcp-servers-env-resolution
description: "Un serveur MCP declare dans .mcp.json avec ${VAR} n'expose aucun outil si cette variable n'existe que dans .env du projet — diagnostic et fix generique. Couvre aussi le cas serveur OAuth-only (clé API en .mcp.json ne suffit pas)."
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

## Cas distinct : serveur MCP OAuth-only (une cle API en `.mcp.json` NE SUFFIT PAS)

**Symptome** : `.mcp.json` configure avec `"headers": {"X-API-Key": "${VAR}"}`, la variable existe
bien (pas le bug ci-dessus), mais le serveur reste dans la liste "requires authentication" apres
redemarrage — aucune erreur claire n'explique pourquoi une cle API pourtant valide ne suffit pas.

**Cause racine** : certains serveurs MCP hebergés (ex. Comfy Cloud) exigent un **flow OAuth
navigateur complet**, pas juste une clé API en header statique — meme si la doc du serveur mentionne
"X-API-Key" comme option pour clients headless generiques, Claude Code specifiquement route ces
serveurs via un **plugin dedie** qui gere l'auth OAuth proprement (`claude plugin marketplace add
<repo>` puis `claude plugin install <plugin>@<marketplace>`), pas via une entree manuelle dans
`.mcp.json`. Une entree manuelle avec cle API peut sembler correcte syntaxiquement mais ne
declenche jamais le bon flow d'auth.

**Diagnostic (avant de perdre du temps a debugger `.mcp.json`)** :
1. Chercher si le fournisseur du serveur MCP publie un **plugin Claude Code officiel** (souvent
   nomme `<service>-cloud` ou `<service>-mcp`, distribue via un "marketplace" GitHub dedie) — c'est
   le cas pour Comfy Cloud (`Comfy-Org/comfy-skills`, plugin `comfy-cloud`). Verifier la doc
   officielle du service AVANT de tenter une config manuelle.
2. Si un plugin existe : `claude plugin marketplace add <owner>/<repo>` puis
   `claude plugin install <plugin>@<marketplace>` (execute via Bash si le CLI `claude` est
   accessible hors session — fonctionne meme si les commandes slash `/plugin` sont indisponibles
   dans l'environnement courant, ex. extension VSCode).
3. Redemarrer Claude Code entierement, puis `/mcp` → selectionner le serveur → `Authenticate` (ouvre
   le navigateur pour le vrai flow OAuth).
4. Confirmer via l'outil `get_server_info` du serveur (si disponible) que `auth_state` affiche
   `"authenticated (OAuth)"` avant de considerer la connexion etablie.

**Vecu 2026-08-08** : tente d'abord une entree manuelle `.mcp.json` avec `X-API-Key: ${COMFY_API_KEY}`
pour Comfy Cloud (MiniMax H3) — echec silencieux (serveur reste "requires authentication" meme apres
redemarrage). Egalement tente l'auth via le connecteur claude.ai (Parametres → Connecteurs) — **piste
fausse**, ce systeme est distinct de `.mcp.json`/Claude Code et n'authentifie rien pour la session
CLI. La vraie solution : plugin officiel `comfy-cloud@comfy-skills`, qui gere l'auth OAuth
correctement en un flow propre.
