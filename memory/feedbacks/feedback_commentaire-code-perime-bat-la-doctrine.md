# Un commentaire de code périmé bat la doctrine mémoire — c'est le code qui gagne

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Un commentaire perime dans le code est plus nocif qu'une absence de commentaire.** Il ne se contente
pas de ne rien dire : il **contredit activement** la doctrine et fait rebrousser chemin a quelqu'un qui
allait appliquer le bon fix.

**Why** — vecu 2026-07-30 (Kimi K3). Le fix `reasoning.max_tokens` avait ete **diagnostique le
2026-07-22** et ecrit en memoire. Il n'etait applique dans **AUCUN script**, et **4 scripts portaient un
commentaire disant l'INVERSE** (« NE PAS passer max_tokens ») — vrai au 17/07, invalide par le re-test du
20/07, **jamais repercute dans le CODE**. Le bug est revenu a l'identique 8 jours plus tard, et il a fallu
tout re-diagnostiquer.

> La correction vivait dans la memoire, le code disait le contraire, **et c'est le code qui a gagne.**

⭐⭐ **Et la meme session a REPRODUIT l'erreur en miroir, dans l'heure.** Apres avoir corrige les 4
commentaires de code, j'ai laisse la phrase fausse « NE PAS passer max_tokens » dans `openrouter-svg.md`
— c'est-a-dire dans la MEMOIRE. Le reflexe « je corrige la ou j'ai mal » ne suffit pas : il faut balayer
**les deux cotes** systematiquement. C'est ce qui rend cette lecon non triviale — je l'ai enfreinte en la
decouvrant.

## How to apply

1. **Doctrine -> code** : quand on met a jour une doctrine outil/API dans `memory/`, **grep le code**
   pour les commentaires qui la contredisent, et les corriger dans la MEME passe. Une doctrine a jour +
   un code qui la contredit = une doctrine morte.
2. **Code -> doctrine** : quand un comportement d'API change, corriger **les commentaires en meme temps
   que le payload**, ET grep `memory/` pour les phrases devenues fausses.
3. **La commande** — apres tout changement de consigne sur un outil, sur la phrase exacte qui devient
   fausse : `grep -rn "<ancienne consigne>" scripts/ memory/ src/`. Les deux arbres, jamais un seul.
4. Corollaire de la regle CLAUDE.md « code existant vs decision documentee » : cette regle dit « si un
   fichier contredit une decision, le FICHIER est faux ». Vrai — mais **encore faut-il que quelqu'un le
   remarque**. Un commentaire de code n'est jamais relu comme une doctrine ; il est lu comme un fait
   local et cru sur parole.

## Le mecanisme voisin qui a CAMOUFLE le bug — un fallback silencieux

`gen_kimi()` faisait `msg.get("content") or msg.get("reasoning")` : quand `content` etait null, il
ecrivait **la reflexion brute** dans le fichier de sortie **en annoncant un succes**. Un `.json` de 50 Ko
contenant « Let me think about this scene carefully... » passait pour une generation reussie.

**Deux gardes a repliquer partout ou on appelle un LLM :**
1. **OpenRouter renvoie souvent une erreur en HTTP 200** -> `raise_for_status()` ne leve rien, et
   l'acces direct a `["choices"]` explose en `KeyError` **en MASQUANT le message reel de l'API**.
   Tester `status_code != 200` **ET** `"choices" not in data`, en affichant `data["error"]`.
2. **Champ attendu vide -> echouer BRUYAMMENT** (afficher `finish_reason` + `reasoning_tokens`).
   ⛔ Jamais de fallback silencieux vers un champ de repli : un fallback qui produit un fichier fait
   croire au succes, et c'est ce qui transforme un bug d'une minute en bug de 8 jours.

Modele correct deja present dans le repo : `scripts/tools/kimi-svg-ideation.py` L70-77.

Voisin : [[kimi-k3-reasoning-borne]] (le cas source) · [[feedback_rapport-agent-texte-pas-preuve-verifier-disque]]
(meme famille : un artefact produit ≠ un succes) · [[feedback_verifier-son-propre-souvenir-comme-un-verdict-llm]].
