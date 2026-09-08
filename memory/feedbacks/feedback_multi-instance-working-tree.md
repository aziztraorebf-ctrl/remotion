---
name: multi-instance-claude-m-me-working-tree-pas-branches-isol-es
description: "Deux instances Claude lancées dans le même dossier partagent le MÊME working tree + la même branche git. Committer tôt pour sécuriser, jamais git stash/checkout à l'aveugle."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7def50bc-4a6c-457c-adb9-1730b58e0d51
  modified: 2026-07-31T21:13:42.567Z
---

# Deux instances Claude dans le même dossier = working tree PARTAGÉ (2026-06-14)

**Découvert** quand Aziz a fait travailler 2 instances en parallèle (une sur P4, une sur P3) dans
`/Users/clawdbot/Workspace/remotion`.

## Le fait technique (vérifié, pas supposé)
Deux instances Claude lancées dans le MÊME dossier de travail partagent **le même working tree et la
même branche git** — ce ne sont PAS des branches/checkouts isolés. Concrètement :
- L'instance A voit les fichiers non commités modifiés par l'instance B (et inversement).
- `git status` / `git diff` montrent le travail des DEUX instances mêlé.
- L'instance B croyait être seule sur `feat/p3-ambient-vie` (créée depuis `feat/da-brief-gate-warmap-sahel`) ;
  en réalité les 2 étaient sur la même branche, même HEAD.

## Les règles qui en découlent (NON-NEGOTIABLE en multi-instance)
1. **Committer TÔT son propre travail** pour le sécuriser (sinon l'autre instance peut l'écraser/le perdre).
2. **Stager chirurgicalement** : `git add <mes-fichiers>` uniquement. JAMAIS `git add -A` / `git add .`
   (engloberait le travail non commité de l'autre instance).
3. **Avant tout `git stash` / `git checkout` / `git reset`** : vérifier qu'il n'y a pas de travail non commité
   de l'autre instance dans le working tree → sinon perte. En multi-instance, éviter ces commandes.
4. **Identifier l'auteur d'un diff non commité** avant d'y toucher : `git diff <fichier>` + grep des mots-clés
   du sujet de l'autre (ex. P3 "touareg/onde ONU" vs P4 "exode/chantier"). Si ce n'est pas mon sujet → pas à moi → ne pas stager.
5. **Fichiers PARTAGÉS** (ex. `SahelWarMapEngine.tsx`, `WarMapOverlayDynamic.tsx`) = le vrai risque de conflit.
   Se coordonner : qui touche quoi, dans quel ordre. Ne pas réécrire chacun de son côté un composant partagé.
6. **Préférence Aziz (2026-06-14)** : éviter de travailler dans 2 sessions parallèles. Une instance finit + passe
   une PASSATION CLAIRE (fait / fixé / décidé / reste / fichiers à lire), l'autre reprend en solo.

**Pourquoi** : sur un working tree partagé, un `add -A` + commit d'une instance "vole" le travail non commité
de l'autre dans son propre commit, et un stash/checkout peut l'effacer. Voir [[feedback_systeme-navigation-proactive]].

## Cas confirmé — détecter puis SÉCURISER avant merge (Acte 4 Soudan, 2026-07-21)

Deuxième occurrence réelle, confirme les règles ci-dessus : une session travaillait sur l'Acte 4 (globe D3)
pendant qu'une AUTRE session tournait en parallèle sur un sujet différent (SVG via Fable 5) dans le même repo.

- **Détection** : croiser `ps`/processus actifs ET `git status` (fichiers modifiés/non-trackés qui ne
  correspondent à aucun changement fait par la session courante) — les deux signaux ensemble, pas un seul
  (un process actif sans diff peut être une session en lecture ; un diff sans process visible peut être
  un reliquat d'une session déjà finie).
- **Geste correct une fois détecté** : NE JAMAIS écraser — committer le travail de l'autre session tel
  quel (fichiers identifiés par sujet, règle 4 ci-dessus) pour le mettre en sécurité, PUIS continuer/merger
  son propre travail par-dessus. Sécuriser d'abord, discuter de l'intégration ensuite.
- Confirme empiriquement la règle 1 (committer tôt) appliquée à la fois à SON PROPRE travail et, quand on
  détecte une collision, à celui de l'autre session avant de risquer de le perdre dans un merge/rebase.

## Corollaire — RÉCUPÉRER son propre travail STASHÉ par l'autre instance (CFA, 2026-07-21 soir)

3e occurrence, angle NOUVEAU : cette fois c'est MON travail (hook SVG franc CFA) qui a été mis de côté par
l'autre instance. Elle a fait `git stash` de mes fichiers non commités PUIS `git checkout` vers sa branche
Soudan, pour libérer le working tree partagé. Symptôme vécu : `git add mon-fichier.tsx` → `fatal: pathspec
did not match any files` (le fichier avait "disparu"), `ls` → "No such file or directory". **Réflexe erroné
possible : croire à une perte / paniquer.** Ne PAS improviser — diagnostiquer méthodiquement :

**Procédure de récupération (vérifiée, non destructive) :**
1. `git stash list` → chercher un stash au message explicite ("WIP <ma-branche>: ..."). Le travail y est SAUF.
2. `find . -name "<mon-fichier>"` + `ls out/` `ls public/` → **les renders/audio/assets NON stashés
   (fichiers dans out/ public/ non trackés) sont INTACTS sur le disque** (le stash ne touche que le tracked +
   untracked stagé selon l'option). Vérifier leur présence avant de conclure quoi que ce soit.
3. `git branch` → confirmer sur quelle branche je suis (souvent celle de l'AUTRE instance).
4. Récupérer : `git checkout <ma-branche>` (mes modifs mémoire non commitées SUIVENT le checkout, pas de
   conflit si les fichiers n'existent pas différemment sur la branche cible — vérifier le message de checkout),
   PUIS `git stash pop` → tout réapparaît (code + Root.tsx + SVG).
5. **Commiter IMMÉDIATEMENT** (chirurgical, `git add <mes-fichiers>`, jamais `-A`) pour que ça ne puisse plus
   être re-stashé/perdu. C'est la règle 1 (committer tôt) appliquée en rattrapage.

**Ne jamais faire dans cet ordre à l'aveugle** : `git stash drop` / `git reset --hard` avant d'avoir localisé
et poppé le stash. Le stash est la sauvegarde — le détruire = la vraie perte. (Lié [[feedback_agent-derive-git-destructif]].)

## Corollaire — worktrees d'AGENTS souvent périmés (Acte 4 Soudan, 2026-07-21)

Quand on délègue à des agents en `isolation: worktree`, le worktree assigné à l'agent peut être un
COMMIT ANCÊTRE périmé (il manque les fichiers/dossiers récents — ex: tout `d3-16x9/` absent). Observé sur
5 agents successifs la même session : chacun a dû recréer une branche depuis le tip cible.
- **Symptôme** : l'agent signale "le fichier cible n'existe pas dans mon worktree" ou "branche cible déjà
  checked out ailleurs".
- **Fix à mettre DANS LE BRIEF de l'agent d'emblée** : « crée ta branche depuis le tip À JOUR :
  `git checkout -b <nom> $(git rev-parse <branche-cible>)`, et copie les `.mp3`/assets gitignorés depuis le
  repo principal (absents des worktrees neufs), symlink node_modules si besoin pour le render. »
- **Au merge** : ces branches partent du bon tip → fast-forward propre (vérifier `git merge-base --is-ancestor`).

**⛔ COMMITER IMMÉDIATEMENT quand plusieurs instances partagent le MÊME working tree (2026-07-21, CFA Beat 2).** Vécu : une autre instance a fait un `git checkout` de branche sur le working tree principal PENDANT que je codais → mes fichiers suivis non commités (composant globe) ont été remisés avec la branche = ~20 min de travail "disparu" (récupérable en re-checkout la branche, mais panique + perte de temps). Les assets untracked gitignorés (drapeaux .png) eux ont bien dû être re-téléchargés. **Règle** : si le contexte de session montre qu'une 2e instance touche le même repo (worktree secondaire actif, fichiers d'un autre projet qui apparaissent dans `git status`), COMMITER après CHAQUE étape (fichier écrit + render OK), ne jamais laisser du code suivi non commité entre 2 gestes. Un checkout externe ne détruit pas un commit ; il balaie le working tree. Corollaire : à chaque reprise après une opération longue (render en tâche de fond), re-vérifier `git branch --show-current` (le reflog révèle les checkouts externes : `git reflog -5`).

## Corollaire — vérifier `branch --show-current` DÈS le premier commit après un `checkout -b`, pas seulement après une reprise (ménage mémoire, 2026-07-31)

5e occurrence, angle nouveau : **sans 2e instance visible cette fois** — juste un checkout externe (probablement une session Soudan concurrente) survenu entre la création de branche et le premier commit. `git checkout -b chore/menage-memoire-poids` exécuté en début de session ; au moment du premier `git commit`, le repo s'est retrouvé sur `feat/soudan-passe-finale-6lots` (gelée au 27/07) sans que je le revérifie. Coût concret : le commit a contenu 5 "corrections" mémoire **fausses** — des chemins déclarés `N'EXISTE PAS` alors qu'ils existaient tous sur la vraie branche à jour (`jury-titres-llm.py`, `GRILLE-JUGEMENT-MIDFORM.md`, `freelance-linkedin/README.md`, `kimi-k3-reasoning-borne.md`). Détecté seulement par un conflit au `cherry-pick` en tentant de rapatrier le commit sur la bonne branche — pas par une vérification proactive.

**Extension de la règle** : le déclencheur "`git branch --show-current`" ne doit pas se limiter à la reprise après tâche longue (cas ci-dessus) — il doit aussi s'appliquer **immédiatement avant le premier commit qui suit un `checkout -b`**. Créer une branche ne met PAS à l'abri d'un checkout externe survenu juste après ; seule la vérification explicite avant d'écrire le protège. Réflexe : `git checkout -b <nom>` → travailler → **avant le 1er `git commit` : `git branch --show-current`** → si différent du nom attendu, `git log --oneline -3` pour comprendre ce qui a changé avant de committer quoi que ce soit.
