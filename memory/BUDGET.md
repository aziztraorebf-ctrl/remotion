# BUDGET.md — budgets mémoire (source de vérité)

> Config centralisée des plafonds mémoire. ⭐ **`scripts/tools/check-poids-contexte.py` et
> `.claude/hooks/budget-memoire-gate.sh` sont ALIGNÉS sur ce fichier depuis le 2026-09-08**
> (commit `19a3f7d7`) — ce fichier définit, ils appliquent. Toute révision se décide ICI d'abord.
>
> ⚠️ **Deux plafonds de natures différentes, ne pas les confondre** (amalgame corrigé le 08/09) :
> le plafond de **POLITIQUE** ci-dessous est NOTRE choix (dépassement = dette, rien ne casse) ;
> le plafond **SYSTÈME** (~25 000 o **ou** 200 lignes, `MEMORY.md` seul) est une limite technique
> de Claude Code — au-delà, troncature **silencieuse** à chaque chargement.

## MEMORY.md (fichier chargé à chaque session)

Chemin : `.claude/projects/-Users-clawdbot-Workspace-remotion/memory/MEMORY.md`

- **Plafond dur total** : 15 000 octets (~15 Ko). Ajusté le 2026-09-01 (départ 12 288 o) — le
  fichier retombait à 97 % du plafond juste après densification, marge réelle insuffisante pour
  absorber 3-4 nouveaux projets actifs sans re-négocier. Reste ajustable dans les deux sens :
  si dépassé de façon persistante malgré élagage correct, la limite peut remonter ; si le fichier
  reste durablement bien en dessous, elle peut redescendre — décision explicite d'Aziz à chaque
  révision, jamais automatique.
- **Plafond par ligne** : ~100 caractères. Format attendu : emoji-priorité + slug-de-fichier-exact
  + 3-6 mots-clés MAX. JAMAIS une phrase narrative complète, jamais une explication du "pourquoi".
- **Plafond souple par section** : ~15-20 entrées. Au-delà, scinder en sous-catégories plutôt
  que laisser la section grossir linéairement.
- **Seuil d'alerte** (pas encore bloquant) : 80 % du plafond dur, soit ~12 000 octets.

## NEXT-ACTION.md (repo)

Chemin : `/Users/clawdbot/Workspace/remotion/memory/NEXT-ACTION.md`

- **Règle d'éviction vérifiable** : toute section dont le TITRE contient ✅, "RÉSOLU",
  "TERMINÉ", "CLOS" ou "ARCHIVÉ" ET qui pointe déjà vers un fichier de destination permanent
  DOIT être supprimée du fichier (pas juste marquée). La règle existe déjà dans CLAUDE.md
  (« Un projet TERMINÉ se SUPPRIME de ce fichier — git la conserve. ») — ce fichier la rend
  vérifiable : **âge max toléré pour une section ✅ avant suppression obligatoire = 7 jours**
  après la date mentionnée dans son titre.
- **Plafond dur total** : 20 480 octets (20 Ko).
- **Dette existante** (non corrigée ici) : le fichier est actuellement à ~30 934 o après
  Couche 1 — encore au-dessus du plafond. À résorber dans une étape suivante, pas dans cette tâche.

## Répartition repo vs auto-memory (règle structurelle)

- Le **repo** (`/Users/clawdbot/Workspace/remotion/memory/`) est TOUJOURS l'autorité pour le
  contenu : doctrines, feedbacks, fiches, projets, outils, archive.
- L'**auto-memory** (`.claude/projects/-Users-clawdbot-Workspace-remotion/memory/`) ne doit
  contenir QUE :
  (a) le `MEMORY.md` actif lui-même (fichier de navigation, propre à cette arborescence par
      design du système) ;
  (b) des **STUBS de 2-3 lignes** pour tout fichier qui existait à l'origine côté auto-memory
      mais dont le contenu a été rapatrié vers le repo. Format de stub : nommer le fichier repo
      cible, dire « Source de vérité : voir [chemin repo] », rien d'autre.
- Tout **NOUVEAU contenu** (mémoire créée par Claude en session) doit être écrit DIRECTEMENT
  dans le repo, jamais dans l'auto-memory, sauf pour MEMORY.md lui-même.

## ✅ Alignement script ↔ politique — FAIT le 2026-09-08

Cette section documentait un écart (le script tolérait 25 000 o pour `MEMORY.md` et **aucun**
plafond dur pour `NEXT-ACTION.md`). **L'écart est corrigé** — `CHAINE` encode désormais
`MEMORY.md 12000/15000` et `NEXT-ACTION.md 16384/20480`.

⛔ **Ce que l'écart avait coûté, à ne pas reproduire** : `NEXT-ACTION.md` à 25 510 o violait la
politique de 25 % **sans déclencher un mot**, parce que l'instrument de mesure ne mesurait pas ce
que la politique disait. Un plafond que rien ne vérifie n'existe pas. Pire : le script portait
déjà un commentaire annonçant l'alignement, ce qui a fait rayer le point d'un plan d'audit — le
commentaire disait vrai, le code disait autre chose, et c'est le code qui s'exécute
(→ `feedback_commentaire-code-perime-bat-la-doctrine` § LE MIROIR).

**Règle qui en découle** : après toute révision d'un plafond ici, reporter la valeur dans
`check-poids-contexte.py` (§ `CHAINE`) ET `budget-memoire-gate.sh` **dans la même session**, puis
lancer le script pour voir l'alerte changer. Un plafond révisé et non reporté est une politique
qui ne s'applique à rien.
