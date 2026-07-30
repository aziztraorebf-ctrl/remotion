# Kimi K3 — BORNER `reasoning.max_tokens`, sinon il ne rend JAMAIS de contenu

> **Verifie et corrige le 2026-07-30.** Symptome : `content: null`, tout part dans `reasoning`.
> Le fix etait DEJA diagnostique le 2026-07-22 mais n'etait applique dans AUCUN script — et
> 4 scripts portaient un commentaire perime disant l'INVERSE. C'est ce qui l'a fait revenir.

## Le symptome

Meme sur un prompt trivial (« Reply with exactly: OK ») :
```
finish_reason: "length"   ·   message.content: null
message.reasoning: "The user wants me to reply with exactly OK. This is a simple..."
usage: completion_tokens = max_tokens, TOUS en reasoning_tokens
```
Sur un vrai appel de production (generation SVG) : 12 756 completion_tokens, **tous** en
reasoning, **zero `<svg>`**. Sans aucune borne : l'appel **hang** (>2 min, parfois jamais).

## La cause racine

K3 est un *thinking model* dont le raisonnement **n'est pas borne par defaut** sur OpenRouter.
Il consomme tout le budget de completion en reasoning avant d'emettre le moindre `content`.

⛔ **`max_tokens` ne protege PAS** : il plafonne l'ENSEMBLE (reasoning + contenu), donc il est
integralement mange par le reasoning. Le champ a borner est **`reasoning.max_tokens`**, un
parametre DISTINCT (et distinct aussi de `reasoning_effort`).

## Le fix

```json
"reasoning": {"max_tokens": 2000},
"max_tokens": 16000
```

**Mesure avant/apres sur un gros prompt de production (SVG scene narrative)** :
- sans borne : hang, aucune reponse a 2 min -> timeout
- avec borne : **33 s**, `finish_reason: stop`, SVG complet et `</svg>` ferme,
  2316 completion_tokens dont seulement **40** de reasoning, **0,035 $**

Nuance : sur un prompt TRIVIAL, `reasoning.max_tokens` ou `max_tokens` suffisent chacun isolement.
C'est sur les **gros prompts** (le cas reel) que `reasoning.max_tokens` devient indispensable —
c'est le seul qui empeche le hang.

⭐ Ce n'est PAS un probleme de provider : les reponses correctes sont venues de Together ET de Modal.
K3 est parfaitement utilisable une fois borne.

## Scripts corriges (2026-07-30)

| Fichier | Etat |
|---|---|
| `scripts/tools/svg-scene-narrative.py` | ✅ fix applique dans `gen_kimi()` + garde d'erreur |
| `scripts/tools/llm-gen-svg.py` | ⚠️ commentaire corrige, **payload PAS encore fixe** |
| `scripts/tools/llm-gen-blueprint.py` | ⚠️ idem |
| `scripts/tools/kimi-vision-fill-scene.py` | ⚠️ idem |
| `scripts/tools/da-brief.py` | reste sur `kimi-k2.5` (avait fui le probleme au lieu de le resoudre) |

## ⛔ Le piege qui a camoufle le bug (a ne jamais reproduire)

`gen_kimi()` faisait `msg.get("content") or msg.get("reasoning")` : quand `content` etait null,
il ecrivait **la reflexion brute** dans le fichier de sortie et **annoncait un succes**. Un `.json`
de 50 Ko contenant « Let me think about this scene carefully... » passait pour une generation reussie.

Deux gardes ajoutes, a repliquer partout :
1. OpenRouter renvoie souvent une **erreur en HTTP 200** -> `raise_for_status()` ne leve rien et
   l'acces direct a `["choices"]` explose en `KeyError` en MASQUANT le message reel de l'API.
   Tester `status_code != 200` ET `"choices" not in data`, en affichant `data["error"]`.
2. Si `content` est vide -> **echouer bruyamment** en affichant `finish_reason` et
   `reasoning_tokens`. Ne jamais ecrire le reasoning en silence.

Le bon modele existait deja dans le repo : `scripts/tools/kimi-svg-ideation.py` L70-77.

## La lecon de methode (elle vaut plus que le fix)

**Un commentaire perime dans le code est plus nocif qu'une absence de commentaire** : les 4 scripts
disaient « NE PAS passer max_tokens », vrai au 17/07 (K3 n'avait que `reasoning:max` non
desactivable), invalide par le re-test du 20/07... qui n'a jamais ete repercute dans le CODE.
La correction vivait dans la memoire, le code disait le contraire, et c'est le code qui a gagne.

⭐ Corollaire, dans les deux sens : quand on met a jour une doctrine dans `memory/`, **grep le code**
pour les commentaires qui la contredisent. Et quand un comportement d'API change, corriger les
commentaires en meme temps que le payload.

Voisin : [[feedback_code-existant-vs-decision-documentee]] · `memory/tools/openrouter-svg.md`
(§ piege `reasoning.max_tokens`) · `memory/tools/kimi-review-bug.md` (plancher 16000).
