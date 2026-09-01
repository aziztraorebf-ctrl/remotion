# MEMORY.md n'est PAS chargé dans les subagents — CLAUDE.md l'est

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo, alors que ce fichier est
> cité nommément et à plusieurs reprises dans `MEMORY.md` lui-même comme règle de placement).

**Date** : 2026-08-27 · **Source** : doc officielle Claude Code (`code.claude.com/docs/en/memory`)
· **Statut** : verifie interdit par interdit, migration faite

## Le fait

> *« The main conversation's auto memory isn't loaded into subagents. »*

| Fichier | Session principale | Subagents | Plafond |
|---|---|---|---|
| `MEMORY.md` | ✅ | ⛔ **NON** | **25 Ko OU 200 lignes** (dur) |
| `CLAUDE.md` | ✅ | ✅ | 4 MiB |

## Ce que ca cassait chez nous (mesure, pas suppose)

Le bloc GATES — les interdits critiques — vivait dans `MEMORY.md`. **6 gates sur 9 etaient
absents de CLAUDE.md**, donc invisibles a TOUT agent. Les 3 plus couteux :

- **git destructif en repertoire partage** — 2 incidents reels : un agent a ecrase le travail
  d'un autre par `git checkout` (07-01) ; un agent `/wrap` a lance `git stash` avec 25 fichiers
  non commites, `git status` est revenu VIDE (08-01). ⛔ C'est **precisement** ce qu'un AGENT
  doit savoir, et c'etait range la ou il ne peut pas le lire.
- **nom propre → Wikipedia avant render** (« HEMETI » vs « HEMEDTI » en ouverture d'Acte).
- **regle d'upload** : MP4 → Blob et HTML → here.now ne vivaient que dans MEMORY.md. Les agents
  uploadaient sur catbox selon une regle abandonnee depuis 10 jours.

⭐ Meme piege dans l'autre sens : le vecu « prompt multi-agents = preciser l'independance »
(sans quoi 2 agents sur 4 se mettent en attente au lieu de produire) ne vivait que dans
`SYSTEME-AGENTIQUE.md` — un fichier ouvert seulement sur demande. Un gate d'agent range dans un
fichier que les agents ne lisent pas.

## La regle qui en decoule

**Le critere de placement n'est pas « est-ce important ? » mais « QUI doit le lire ? »**

- Doit atteindre un AGENT (interdit, gate, regle de securite, convention de commit) → **CLAUDE.md**
- Navigation, etat des projets, index de feedbacks → **MEMORY.md** (et lui seul est sous plafond dur)
- Conditionnel a un type de travail → une **Skill** (chargee sur description)

⭐ **Bonus non evident** : migrer vers CLAUDE.md ne fait pas que liberer des octets sous le plafond
de 25 Ko — ca **repare une regle qui ne s'appliquait pas**. C'est le seul geste d'allegement qui
gagne sur les deux tableaux. Les autres (supprimer, raccourcir, memoire externe) ne font que
deplacer du poids.

## Piege de placement inverse — ne pas tout verser dans CLAUDE.md

CLAUDE.md est charge INTEGRALEMENT a chaque session ET dans chaque agent. Au-dela de **~200 lignes**
l'adherence baisse (doc officielle). Sur ce fichier le garde-fou n'est donc pas l'octet (4 MiB) mais
la LONGUEUR. Surveille par `scripts/tools/check-poids-contexte.py`.

Liens : [[budget-contexte-mesurer-la-chaine-entiere]] · [[upload-hosts-fallback]]

## ⛔ AUTRE MÉCANISME DE CHARGEMENT MAL CONNU — le CLAUDE.md du RÉPERTOIRE DE TRAVAIL

Ce n'est pas seulement `<repo>/CLAUDE.md` qui est chargé : Claude Code charge **aussi le
`CLAUDE.md` du répertoire dans lequel on travaille**. `src/CLAUDE.md` et `scripts/CLAUDE.md`
étaient donc injectés dès qu'on touchait à ces dossiers.

**Trouvaille (2026-08-27)** : **24 fichiers `CLAUDE.md` parasites (12,9 Ko)** dans le repo — des
résidus de blocs `<claude-mem-context>` (journaux d'activité de février à mai), **zéro
instruction**. On chargeait un journal de février en travaillant dans `src/`.

**Garde-fou appliqué** : ne supprimer QUE si le fichier est intégralement un bloc de log. Ce filtre
a retenu `peste-1347-pixel/scenes/CLAUDE.md`, qui porte 2 vrais gates (Contrat Visuel, EffectsLab)
— conservé, seul son log retiré. ⛔ **Ne jamais supprimer un CLAUDE.md sur son nom ou sa date :
lire le corps.**

**Réflexe d'audit** : `find . -name CLAUDE.md` périodiquement — cette injection-là est invisible
depuis la session principale, elle dépend du répertoire courant.

⚠️ Restent hors repo : `/Users/clawdbot/CLAUDE.md` et `/Users/clawdbot/Workspace/CLAUDE.md`,
2 balises vides de 43 o chargées à chaque session.
