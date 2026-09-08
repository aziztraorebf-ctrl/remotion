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
| `scripts/tools/llm-gen-svg.py` | ✅ **payload FIXE le 2026-08-27** (max_tokens 16000 + reasoning.max_tokens 2000) |
| `scripts/tools/llm-gen-blueprint.py` | ⚠️ idem |
| `scripts/tools/kimi-vision-fill-scene.py` | ⚠️ idem |
| `scripts/tools/da-brief.py` | ✅ **MIGRE le 2026-09-08** — borne posee, repli supprime, teste par appel reel |

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

## ⚠️ `reasoning.effort` (imbrique) vs `reasoning.max_tokens` — MUTUELLEMENT EXCLUSIFS (2026-08-04)

Distinct du `reasoning_effort` top-level documente dans `openrouter-svg.md` (§ MUR LEVE 2026-07-20).
Si on passe **les deux champs dans le meme objet** `reasoning` (`{"max_tokens": 2000, "effort": "high"}`),
OpenRouter renvoie **HTTP 400** : `"Only one of \"reasoning.effort\" and \"reasoning.max_tokens\" can
be specified"`. Pour pousser l'effort au max sans la borne standard : `"reasoning": {"effort": "high"}`
**seul**, sans `max_tokens` dans le meme objet (le `max_tokens` global top-level reste ok a cote).
Verifie sur un test SVG reel (client-sim Flowdesk) : `effort:"high"` seul a produit un resultat nettement
plus riche que la borne standard `max_tokens:2000` (10600 chars vs 578 chars sur le meme prompt).

---

## ⛔⛔ CE FICHIER EST LUI-MEME UN CAS D'ECOLE (constate au wrap du 2026-08-27)

Le remede (`reasoning.max_tokens`) etait ecrit ici depuis le **2026-07-30**, et repete **TROIS FOIS
en commentaire dans `llm-gen-svg.py`** — pendant **4 semaines**, le payload de ces 3 scripts n'a
jamais ete corrige. Detecte par un agent d'audit en fin de session, pas en les utilisant.

⭐ **La lecon** : documenter un remede n'est pas l'appliquer, et un commentaire repete 3 fois
donne d'autant plus l'illusion que le sujet est traite. Le meme jour, `motion-breakdown.py`
presentait exactement le meme schema (avertissement en docstring, valeur jamais changee).
**Deux occurrences le meme jour = un mode d'echec, pas un accident.**
-> Grave en transversal : `memory/key-learnings.md` § « INSTRUMENTER LA DETECTION N'EST PAS
APPLIQUER LE REMEDE ».


---

## ⭐ MISE A JOUR 2026-08-30 (verifiee, pas supposee)

- ✅ `llm-gen-blueprint.py:87` et `kimi-vision-fill-scene.py:109` portent bien le fix
  (`reasoning.max_tokens: 2000`) — le tableau ci-dessus les donnait encore en attente.
  **Une fiche qui signale a tort un trou fait re-parcourir un chantier deja fait.**
- ✅ `da-brief.py` MIGRE le 2026-09-08 (voir ci-dessous). **Plus aucun script en contournement.**
- ⚠️ **Piege reproduit puis corrige le meme jour** : `da-brief-anim.py`, ecrit cette session,
  citait cette fiche en commentaire **et repliait quand meme sur `reasoning_content`** — sans
  poser la borne. Corrige : borne posee, repli SUPPRIME (un `content` vide doit lever une
  vraie erreur, pas etre masque par la reflexion brute).
  ⭐ **Citer une fiche n'est pas l'appliquer.** Le commentaire donnait l'illusion du contrôle.


---

## ✅ 2026-09-08 — `da-brief.py` migre, le contournement a vecu 6 SEMAINES

Dernier script en k2.5, et le pire cas : il **citait** cette fiche en commentaire tout en
appliquant l'inverse — le commentaire disait « pour re-tenter k3 un jour : passer
reasoning.max_tokens ~2000 », et le payload ne le passait pas. Il portait EN PLUS le repli
interdit `msg.get("content") or msg.get("reasoning")`, **en double** (kimi ET deepseek).

**Mesure de l'appel reel apres migration** (OpenRouter, `moonshotai/kimi-k3`) :
`10,8 s` · `finish_reason: stop` · `content: "OK"` · 49 completion_tokens dont **0** de reasoning.
→ **Le hang n'a jamais ete une fatalite de k3.** Le contournement a coute 6 semaines de
qualite degradee (k2.5 au lieu du modele courant) pour un fix d'une ligne, deja ecrit ici.

Applique : identifiant importe d'`api_models.py` (plus en dur), `reasoning.max_tokens: 2000`,
les 2 replis supprimes et remplaces par un echec bruyant (affiche `finish_reason` +
`reasoning_tokens`), et la garde n°1 de cette fiche (OpenRouter renvoie une erreur en HTTP 200).

⭐ **Ce que ce cas ajoute aux precedents** : un commentaire qui decrit le remede sans l'appliquer
est plus nocif qu'un silence — il fait croire au lecteur suivant que la question est instruite.
C'est la 3e forme du meme mode d'echec (documenter ≠ appliquer · citer ≠ appliquer · **decrire
le fix dans le commentaire du code qui ne l'applique pas**).
