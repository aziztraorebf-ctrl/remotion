# Budget de contexte — mesurer la CHAINE ENTIERE, pas le seul fichier plafonné

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

⛔ **Ne jamais optimiser le seul fichier qui porte un plafond.** On a compacte `MEMORY.md`
(22 Ko) pendant que `NEXT-ACTION.md` derivait a **63 Ko** — invisible, parce qu'aucun seuil
ne le surveillait. Le cout de contexte est celui de la CHAINE de demarrage complete
(CLAUDE.md + MEMORY.md + NEXT-ACTION.md + PIPELINE.md + fiches auto-injectees), pas d'un fichier.

**Why** : un plafond sur un seul fichier cree une illusion de controle. Le budget se deplace
vers ce qui n'est pas mesure, et la derive devient invisible exactement la ou on ne regarde pas.

**How to apply** : lancer `python3 scripts/tools/check-poids-contexte.py` — il mesure la chaine
entiere et rapporte le total en octets ET en tokens. Avant de compacter quoi que ce soit,
regarder ce total, pas la ligne d'un fichier isole.

## Seuils en vigueur (source : le script lui-meme)

| Fichier | Alerte | Plafond DUR |
|---|---|---|
| `MEMORY.md` | 20 000 o | **25 000 o / 200 lignes — troncature SILENCIEUSE au-dela** |
| `PIPELINE.md` | 25 000 o | — |

Regle de densite du gate : **160 o par reference maximum**. Au-dela, la ligne porte du texte
explicatif et non un index — le CONTENU doit migrer vers le fichier pointe, l'entree reste.

## Deux pistes ECARTEES (ne pas les re-proposer)

- ⛔ **Memoire externe / MCP dedie** : un serveur MCP coute un forfait fixe de contexte a chaque
  session, qu'on s'en serve ou non. Le RAG ne devient rentable que vers ~**50 000 documents** ;
  on en a ~**1 100**. Le rapport cout/benefice est defavorable de deux ordres de grandeur.
- ⛔ **`.claude/rules/`** : ecarte — le champ `paths:` est bugue (3 issues ouvertes). Le
  chargement conditionnel promis ne se produit pas de facon fiable.

Liens : [[memory-md-invisible-aux-subagents]] · [[gotcha-doit-vivre-dans-la-fiche-injectee]]
