# BUDGET.md — budgets mémoire (source de vérité)

> Config centralisée des plafonds mémoire. Le script `scripts/tools/check-poids-contexte.py`
> applique aujourd'hui des seuils légèrement différents (voir § Écarts constatés ci-dessous) —
> ce fichier documente la POLITIQUE cible ; l'alignement du script est une étape suivante,
> pas faite ici.

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

## Écarts constatés entre `check-poids-contexte.py` et cette politique (2026-08-31)

Le script encode aujourd'hui (§ `CHAINE`) :
- `MEMORY.md` : seuil d'alerte 20 000 o, **plafond dur 25 000 o** — plus large que le
  12 288 o cible ci-dessus.
- `NEXT-ACTION.md` : seuil d'alerte 35 000 o, **pas de plafond dur codé** (`None`) — cette
  politique en fixe un à 20 480 o.

Ces écarts ne sont PAS corrigés dans ce chantier (Couche 2, migration factuelle uniquement).
Prochaine étape logique : aligner `CHAINE` dans `check-poids-contexte.py` sur les plafonds
ci-dessus, une fois la dette NEXT-ACTION.md résorbée (sinon le script hurlerait en continu
sur un plafond déjà connu comme non tenu).
