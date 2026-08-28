#!/bin/bash
# render-loop-guard.sh
# PreToolUse (matcher: Bash) — compte les RENDUS de la MEME composition dans la session.
#
# POURQUOI CE HOOK EXISTE (2026-08-27, repro Foster plan 10)
# Le protocole projet dit : « des la 2e tentative infructueuse sur le meme blocage, deleguer
# a un agent dedie — NON-NEGOCIABLE ». Cette regle a echoue 3 fois dans le meme fichier de
# suivi (plan 2 : mesure au 3e essai ; plan 4 : delegue au 4e ; plan 10 : delegue au 4e).
# Une regle qui echoue 3 fois n'est pas un probleme de memoire, c'est un probleme de
# DECLENCHEUR : rien ne comptait les essais, donc rien ne rappelait la regle au bon moment.
#
# ⚠️ `circuit-breaker.sh` ne couvre pas ce cas : il compte les EDITIONS d'un fichier de scene
# (seuil 6). Or une boucle couteuse ressemble a : 1 edition -> 1 rendu -> 1 mesure, repete.
# Le compteur d'editions monte a 3 quand on a deja brule 3 rendus complets. Une passe
# rendre+mesurer coute ~15x une edition — c'est CE compteur qu'il fallait.
#
# Ne bloque JAMAIS (exit 0 systematique) : il RAPPELLE. Un gate qui bloque un rendu legitime
# ferait plus de degats qu'il n'en evite (on rend aussi pour verifier, pas seulement pour corriger).

STATE="/Users/clawdbot/Workspace/remotion/.claude/render-loop-state.json"
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Seuls les rendus Remotion nous interessent
case "$CMD" in
  *"remotion render"*|*"render-mapbox.sh"*) ;;
  *) exit 0 ;;
esac

# Extraire l'identifiant de composition : 1er mot apres `render` / le script
COMP=$(printf '%s' "$CMD" \
  | grep -oE '(remotion render|render-mapbox\.sh)[[:space:]]+[A-Za-z0-9_-]+' \
  | awk '{print $NF}' | head -1)
[ -z "$COMP" ] && exit 0

[ -f "$STATE" ] || echo '{}' > "$STATE"

# Reset si le dernier rendu de cette composition date de plus de 3 h (nouvelle session de travail)
NOW=$(date +%s)
LAST=$(jq -r --arg k "$COMP" '.[$k].last // 0' "$STATE" 2>/dev/null)
N=$(jq -r --arg k "$COMP" '.[$k].n // 0' "$STATE" 2>/dev/null)
if [ $((NOW - LAST)) -gt 10800 ]; then N=0; fi
N=$((N + 1))

jq --arg k "$COMP" --argjson n "$N" --argjson t "$NOW" \
   '.[$k] = {"n":$n,"last":$t}' "$STATE" > /tmp/rlg.json 2>/dev/null && mv /tmp/rlg.json "$STATE"

# 3e rendu : le protocole disait de deleguer au 2e echec. On rappelle ici, sans bloquer.
if [ "$N" -eq 3 ]; then
  cat <<MSG

---
⚠️  3e RENDU de « $COMP » dans cette session.

Le protocole projet dit de DELEGUER des le 2e echec sur le meme blocage. Cette regle a
deja echoue 3 fois faute de declencheur — c'est ce rappel.

Avant un 4e rendu, repondre a ceci :
  . Les 2 corrections precedentes ont-elles change le CHIFFRE mesure ?
      -> Si elles ne l'ont PAS bouge (pas « trop peu » : RIEN), ce n'est pas un dosage.
         C'est une BORNE du systeme. Mesurer la reponse du parametre (le balayer et
         regarder si sa courbe est plate) au lieu d'essayer une valeur de plus.
  . Les 2 corrections ont-elles rate dans des SENS OPPOSES ?
      -> Alors le modele est faux, pas la valeur. Poser le systeme (N cibles mesurees,
         N inconnues) et le RESOUDRE.
  . Sinon : lancer un agent de diagnostic dedie (Opus, run_in_background), qui fait
    d'abord du reverse engineering du repo puis systematic-debugging. Il RAPPORTE,
    il n'applique pas.
---
MSG
fi

exit 0
