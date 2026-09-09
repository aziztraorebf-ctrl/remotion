#!/bin/bash
# git-destructif-gate.sh
# PreToolUse hook (matcher: Bash)
# Bloque les commandes git destructives dans un repertoire partage entre plusieurs
# sessions/agents, et NOMME l'alternative non destructive.
#
# Pourquoi ce gate existe — 3 incidents reels :
#   2026-07-01  un agent a ecrase le travail d'un autre par `git checkout`
#   2026-08-01  un agent /wrap a fait `git stash` avec 25 fichiers non commites en cours,
#               `git status` est revenu VIDE, tout semblait perdu
#   2026-09-03  `git stash`/`stash pop` reutilises 3x pour comparer un rendu a HEAD,
#               pendant qu'une AUTRE session travaillait sur la meme branche
# La regle etait ecrite dans CLAUDE.md depuis le 1er incident. Elle a ete violee 2 fois
# de plus. Une regle ecrite sans gate outille ne tient pas.
#
# Regle source : CLAUDE.md § GATES (1re puce)

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
[ "$TOOL_NAME" != "Bash" ] && exit 0

CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
[ -z "$CMD" ] && exit 0

# Echappatoire explicite et tracee : l'operateur humain assume en prefixant la commande.
# Ex: GIT_DESTRUCTIF_OK=1 git stash
if echo "$CMD" | grep -q 'GIT_DESTRUCTIF_OK=1'; then
  exit 0
fi

bloquer() {
  cat >&2 <<EOF
⛔ BLOQUE — commande git destructive en repertoire partage

  Commande : $1
  Motif    : $2

$3

Cette regle vient de 3 incidents reels (2026-07-01, 2026-08-01, 2026-09-03) ou du
travail non commite d'une AUTRE session a ete perdu ou a failli l'etre.

Si l'operation est reellement voulue et que le risque est assume, demander a Aziz,
puis prefixer : GIT_DESTRUCTIF_OK=1 <commande>
EOF
  exit 2
}

# --- git stash (stash, push, pop, apply, drop, clear)
# `stash list` et `stash show` sont en lecture seule : laisses passer.
if echo "$CMD" | grep -qE '(^|[;&|] *)git +(-[^ ]+ +)*stash\b' \
   && ! echo "$CMD" | grep -qE '(^|[;&|] *)git +(-[^ ]+ +)*stash +(list|show)\b'; then
  bloquer "$CMD" "git stash — l'index est PARTAGE entre les sessions" \
"POUR COMPARER un fichier a HEAD sans toucher a l'index :
  git show HEAD:<chemin> > /tmp/ref-<nom>     puis diff avec la version courante
  ou simplement : cp <fichier> /tmp/avant-<nom>  avant de modifier

Ces deux methodes donnent exactement la meme comparaison, sans jamais toucher
a l'index que les autres sessions utilisent."
fi

# --- git checkout / restore qui ECRASE des fichiers (pas un changement de branche)
# Bloque : checkout ., checkout -- <path>, checkout <ref> -- <path>, restore <path>
# Laisse passer : checkout -b, checkout <branche>, switch
if echo "$CMD" | grep -qE '(^|[;&|] *)git +(-[^ ]+ +)*checkout +(\.|--|[^ ]+ +--)'; then
  bloquer "$CMD" "git checkout qui ECRASE des fichiers du disque" \
"POUR RECUPERER une version sans ecraser le travail en cours :
  git show <ref>:<chemin> > /tmp/version-<nom>
puis comparer, et copier a la main SEULEMENT ce qui doit l'etre."
fi

if echo "$CMD" | grep -qE '(^|[;&|] *)git +(-[^ ]+ +)*restore\b'; then
  bloquer "$CMD" "git restore ecrase les modifications non commitees" \
"POUR RECUPERER une version de reference :
  git show HEAD:<chemin> > /tmp/ref-<nom>
Copier ensuite a la main uniquement ce qui doit l'etre."
fi

# --- git reset --hard
if echo "$CMD" | grep -qE '(^|[;&|] *)git +(-[^ ]+ +)*reset\b.*--hard'; then
  bloquer "$CMD" "git reset --hard DETRUIT tout le travail non commite du repertoire" \
"POUR REVENIR a un etat connu sans rien detruire :
  git stash n'est PAS la solution (bloque ici aussi).
  Commiter le travail en cours sur une branche jetable, PUIS repartir :
  git switch -c wip-avant-reset && git add <fichiers nommes> && git commit -m wip"
fi

# --- git clean -f
if echo "$CMD" | grep -qE '(^|[;&|] *)git +(-[^ ]+ +)*clean\b.*-[a-zA-Z]*f'; then
  bloquer "$CMD" "git clean -f supprime DEFINITIVEMENT les fichiers non suivis" \
"Les fichiers non suivis d'une autre session (renders, assets, protos) sont
invisibles dans git mais bien reels sur le disque.
D'abord VOIR ce qui serait supprime, sans rien supprimer :
  git clean -n -d
puis supprimer nommement ce qui doit l'etre avec rm."
fi

# --- git add -A / git add . (un agent commite NOMMEMENT ses propres fichiers)
if echo "$CMD" | grep -qE '(^|[;&|] *)git +(-[^ ]+ +)*add +(-A\b|--all\b|\. *($|[;&|]))'; then
  bloquer "$CMD" "git add -A embarque les fichiers des AUTRES sessions" \
"Commiter NOMMEMENT ses propres fichiers :
  git add <chemin1> <chemin2> ...
Voir d'abord ce qui trainerait : git status --short"
fi

# --- git branch -D (suppression forcee d'une branche non mergee)
if echo "$CMD" | grep -qE '(^|[;&|] *)git +(-[^ ]+ +)*branch\b.*-D'; then
  bloquer "$CMD" "git branch -D supprime une branche NON MERGEE" \
"Plusieurs registres canoniques du projet n'ont jamais vecu que sur une branche
R&D non mergee (pattern deja rencontre).
Verifier d'abord ce qui serait perdu :
  git log <branche> --not --remotes --oneline
Puis, si la branche est bien mergee, la suppression douce suffit : git branch -d"
fi

exit 0
