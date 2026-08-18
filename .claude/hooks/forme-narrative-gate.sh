#!/bin/bash
# forme-narrative-gate.sh
# PreToolUse hook (matcher: Write)
#
# POURQUOI CE GATE EXISTE
# -----------------------
# Notre pipeline va : sujet -> script -> storyboard -> moteur visuel -> code.
# La FORME NARRATIVE n'est JAMAIS choisie explicitement : elle est heritee par defaut,
# et ce defaut est le documentaire explicatif. C'est le meme angle mort que
# moteur-visuel-gate.sh corrige pour l'image, un cran plus tot dans la chaine.
#
# Preuve que l'ecrit ne suffit pas : memory/feedbacks/feedback_regle-ecrite-insuffisante-sans-gate-outille.md
# Preuve du cout : decrochage mesure de l'AES entre 30s et 3min (memory/doctrines/DIAGNOSTIC-FLOP-VIDEO.md)
# — precisement la ou on quitte le recit pour l'explication.
#
# CE QU'IL BLOQUE : la CREATION d'un nouveau fichier de script d'episode.
# C'est LE moment ou la forme se decide. Editer un script existant ne la redecide pas
# -> on ne bloque pas les editions (sinon le gate devient insupportable et finit desactive).
#
# COMMENT DEBLOQUER : declarer la forme en tete de fichier. Voir le message de blocage.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
[ "$TOOL_NAME" = "Write" ] || exit 0

DOCTRINE="memory/doctrines/FORMES-NARRATIVES.md"

FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')

[ -z "$FILE_PATH" ] && exit 0

# Uniquement les NOUVEAUX fichiers : reecrire un script existant ne redecide pas la forme.
[ -f "$FILE_PATH" ] && exit 0

# ---------------------------------------------------------------- CIBLAGE
# Un fichier de SCRIPT NARRATIF. Noms reels releves dans le repo :
#   memory/episodes/warmap-sahel/SCRIPT-V5-LINEAIRE-2026-06-10.md
#   memory/episodes/warmap-sahel/SCRIPT-V6-TAGGED.txt
#   memory/episodes/peste-1347/script-v3-locked.md
#   src/projects/souverain/senegal-petrole-gaz-short-d3/SCRIPT-FR.txt
#   src/projects/_demos/petrole-patience/script-tts.txt
BASENAME=$(basename "$FILE_PATH")
echo "$BASENAME" | grep -qiE '^(script|scenario)[-_.]|^script\.|[-_]script[-_.]|SCRIPT-V|script-tts|SCRIPT-VOIX' || exit 0
echo "$FILE_PATH" | grep -qiE '\.(md|txt)$' || exit 0

# ---------------------------------------------------------------- HORS-SCOPE
# Ce qui n'est PAS un script d'episode a ecrire : archives, recherche, doctrines,
# fiches, et le dossier ou l'on ECRIT SUR les formes (sinon on se bloque soi-meme).
case "$FILE_PATH" in
  *_archive*|*/archive/*|*/recherche-formats/*|*/doctrines/*|*/fiches/*|*/_rnd/*|*/client-sim/*|*/_client-sim/*) exit 0 ;;
  # Faux positifs REELS mesures le 2026-08-17 (audit de couverture) :
  #   memory/feedbacks/feedback_warmap-script-process.md  = un feedback SUR le script
  #   memory/templates/script-ebauche-v1.md               = un GABARIT, pas un script d'episode
  #   *-SCRIPT-jury-results.md                            = la SORTIE du jury, pas le script
  */feedbacks/*|*/templates/*|*jury-results*|*-review*|*-notes*) exit 0 ;;
esac

# Marqueur de declaration. Plusieurs ecritures acceptees pour ne pas etre tatillon.
MARQUEUR='(FORME[[:space:]]*(NARRATIVE)?[[:space:]]*:|@forme)'
if echo "$CONTENT" | grep -qiE "$MARQUEUR"; then
  exit 0
fi

cat >&2 <<EOF
{
  "decision": "block",
  "reason": "FORME NARRATIVE NON DECLAREE — nouveau script : $FILE_PATH\n\nLa forme se choisit AVANT d'ecrire, sinon elle est heritee par defaut (= documentaire\nexplicatif). C'est l'etape qui manquait a la chaine :\n  SUJET -> FORME NARRATIVE -> script -> intention de scene -> forme visuelle -> MOTEUR -> code\n\nAjouter en en-tete du fichier, avec la RAISON du choix, ex :\n  FORME: question-non-resolue — la question 'a qui doit-on ?' est deja dans la tete du public\n\nLES 7 FORMES (condition d'usage = ce qui les rend INAPPLICABLES) :\n  1. bascule ................ 'ca marchait, puis ca s'est retourne'\n     -> exige un avant/apres REEL et datable. NOTRE DEFAUT : a questionner, pas a reprendre par reflexe.\n  2. question-non-resolue ... 'tout le monde se le demande, personne n'y repond'\n     -> exige que la question soit DEJA dans la tete du spectateur. La meilleure sur sujet abstrait.\n  3. revision-recit-officiel  'ce qu'on vous a raconte est incomplet'\n     -> exige qu'un traitement dominant EXISTE a depasser. La plus forte ET la plus risquee.\n  4. enquete-sur-du-froid ... 'il y a une anomalie dans un fait ancien, je cherche avec vous'\n     -> exige une anomalie verifiable + assez de matiere. Resoudre NETTEMENT a la fin.\n  5. scene-qui-contient-le-probleme  un cas date et incarne d'abord, la these APRES\n     -> exige un cas concret. Le contrepoison de nos ouvertures abstraites.\n  6. deux-trajectoires ...... 'deux cas comparables, un monte, l'autre tombe'\n     -> exige une comparaison HONNETE, sinon c'est un sophisme.\n  7a. boucle-escalade / 7b. paliers  (detail : memory/doctrines/STRUCTURE-NARRATIVE-HYPOTHETICALLY.md)\n\n⛔ UNE SEULE forme par video (jamais d'anthologie). Les autres restent des outils d'ouverture.\n⛔ Si AUCUNE ne convient, le probleme est probablement le SUJET (pas d'angle), pas la forme.\n\nDoctrine complete (arbre de decision, dosage mesure, boite a outils d'ecriture) : $DOCTRINE"
}
EOF
exit 2
