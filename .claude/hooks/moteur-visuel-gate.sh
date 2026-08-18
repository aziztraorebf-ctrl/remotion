#!/bin/bash
# moteur-visuel-gate.sh
# PreToolUse hook (matcher: Write|Bash)
#
# POURQUOI CE GATE EXISTE
# -----------------------
# Regle deja ecrite dans CLAUDE.md, INTENTION-FORME-INDEX.md et DOCTRINE-SCRIPT-UNIFIEE.md :
#   INTENTION -> FORME -> MOTEUR -> TEMPLATE.
# L'etape MOTEUR se saute quand meme, parce qu'une regle ecrite ne force rien
# (cf memory/feedbacks/feedback_regle-ecrite-insuffisante-sans-gate-outille.md).
# Vecu 2026-08-15 : storyboard Gazoduc 4B entierement en fleches/traces, parce que le brief
# envoye au modele n'ouvrait aucune autre porte que la carte. Les modeles n'ont rien invente
# d'autre : ils ne pouvaient pas.
#
# CE QU'IL BLOQUE (2 moments ou le moteur se decide vraiment, pas a chaque edition)
#   1. CREATION d'un nouveau fichier de scene .tsx (Write sur un fichier qui n'existe pas encore)
#   2. ENVOI d'un brief de storyboard a un modele externe (scripts de generation d'images)
#
# COMMENT DEBLOQUER : declarer le moteur. Voir le message de blocage.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

DOCTRINE="memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md"

# Marqueur de declaration de moteur. Accepte plusieurs formes pour ne pas etre tatillon :
#   MOTEUR: Mapbox   /   MOTEUR : D3   /   @moteur SVG   /   MOTEUR DOMINANT: H3
MARQUEUR='(MOTEUR[[:space:]]*(DOMINANT)?[[:space:]]*:|@moteur)'

case "$TOOL_NAME" in
  Write)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')

    # Uniquement les .tsx
    [[ "$FILE_PATH" =~ \.tsx$ ]] || exit 0

    # Uniquement les NOUVEAUX fichiers : editer un fichier existant ne redecide pas le moteur.
    [ -f "$FILE_PATH" ] && exit 0

    # Zones hors-scope : briques partagees, tests, archives.
    # (_rnd/ N'EST PAS exclu : un proto merite aussi de savoir quel registre il teste.)
    case "$FILE_PATH" in
      *_shared/*|*/tests/*|*_archive*|*/archive/*|*.test.tsx|*.spec.tsx) exit 0 ;;
    esac

    # Le moteur est-il declare dans l'en-tete du fichier ?
    if echo "$CONTENT" | grep -qiE "$MARQUEUR"; then
      exit 0
    fi

    cat >&2 <<EOF
{
  "decision": "block",
  "reason": "MOTEUR VISUEL NON DECLARE — nouvelle scene : $FILE_PATH\n\nAvant de coder une scene, l'etape MOTEUR ne se saute pas :\n  INTENTION (1 verbe) -> FORME (le geste) -> MOTEUR (le registre) -> TEMPLATE\n\nAjouter en en-tete du fichier un commentaire declarant le registre ET pourquoi, ex :\n  // MOTEUR: D3 — geometrie calculee (le beat montre une PROPORTION, pas un lieu)\n\nLes registres disponibles (amplitude prouvee de chacun dans la doctrine) :\n  Mapbox        OU        — lieu reel, territoire, frontieres\n  D3            COMBIEN   — flux, reseaux, arcs, projection, choropleth, globe\n  SVG           QUOI/COMMENT — objet, processus, trajet, metaphore\n  stick-figure  QUI       — un acteur, un geste, un rapport de force\n  MiniMax H3    LA MATIERE — texture, geste physique, lieu filme\n  RACCORD       LE MONTAGE — quitter la carte, couper, alterner, rompre l'echelle\n\n⛔ Si le moteur choisi est le MEME que la scene precedente, le justifier explicitement\n   (3 scenes d'affilee dans le meme registre = lassitude, pas une signature).\n\nDoctrine (amplitude prouvee + les 8 trous non couverts) : $DOCTRINE"
}
EOF
    exit 2
    ;;

  Bash)
    CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

    # Cible : les scripts qui envoient un brief de storyboard a un modele externe.
    if ! echo "$CMD" | grep -qE "(storyboard.*\.py|gemini-storyboard|openrouter-img2img|openrouter-gen-image|storyboard-dual-gen)"; then
      exit 0
    fi

    # Extraire le fichier de prompt passe au script (--prompt-file X)
    PROMPT_FILE=$(echo "$CMD" | grep -oE '\-\-prompt-file[= ]+[^ ]+' | head -1 | sed -E 's/--prompt-file[= ]+//')

    # Pas de --prompt-file identifiable : on laisse passer (on ne bloque pas ce qu'on ne peut pas lire)
    [ -z "$PROMPT_FILE" ] && exit 0
    [ -f "$PROMPT_FILE" ] || exit 0

    # ⛔ NE PAS compter des mots-cles : ca mesure le VOCABULAIRE, pas la LIBERTE reelle.
    # Vecu 2026-08-15 : le brief 4B fautif citait "cutaway", "cross-section", "character" — tout en
    # INTERDISANT explicitement d'en faire usage ("ZERO composed insert cards in this beat").
    # Un comptage naif le laissait passer. On cherche donc les FERMETURES et l'ABSENCE de question
    # ouverte, qui sont les 2 causes reelles du rendu en fleches.

    PROBLEMES=""

    # (1) FERMETURE EXPLICITE d'un registre entier ("ZERO/NO ... insert/cut/character/full-screen")
    if grep -qiE "(zero|no|never|without|aucun|jamais)[^.]{0,40}(insert|cut ?away|full[- ]screen|character|montage)" "$PROMPT_FILE"; then
      FERM=$(grep -ioE "(zero|no|never|without|aucun|jamais)[^.]{0,40}(insert|cut ?away|full[- ]screen|character|montage)" "$PROMPT_FILE" | head -2 | tr '\n' ';')
      PROBLEMES="$PROBLEMES\n  - FERMETURE d'un registre entier : \"$FERM\""
    fi

    # (0) PORTE DE SORTIE — BRIEF DE RE-DESSIN, PAS DE CONCEPTION (ajoutee 2026-08-18)
    # Le gate cherche un brief BRIDE. Mais une fois le concept ARBITRE par Aziz, on renvoie
    # legitimement au modele une planche a REDESSINER avec des corrections precises : la, ecrire le
    # concept n'est pas un biais, c'est la consigne. Vecu ce jour : le gate a bloque un re-dessin
    # legitime (planche "tranchee" v2, 3 defauts de lisibilite a corriger), contourne par un chemin
    # de fichier hors surveillance — un contournement n'est pas un fix.
    # ⚠️ Cette porte NE dispense PAS de l'audit du brief par un modele tiers (FICHE-STORYBOARD.md) :
    # elle dit seulement "ce brief n'est pas une conception", pas "ce brief est bon".
    if grep -qiE "REDRAW|RE-?DESSIN|ALREADY (SELECTED|CHOSEN|ARBITRATED)|concepts? (are|is) already (chosen|selected)|MISTAKES? FROM THE PREVIOUS ATTEMPT" "$PROMPT_FILE"; then
      exit 0
    fi

    # (2) CONCEPTS PRE-MACHES : on donne au modele les options a illustrer au lieu de les lui demander
    if grep -qiE "OPTION [AB][ ]*[-—:]|OPTION [AB] *$" "$PROMPT_FILE"; then
      PROBLEMES="$PROBLEMES\n  - CONCEPTS DEJA ECRITS PAR NOUS (\"OPTION A / OPTION B\") : le modele ILLUSTRE nos idees\n    au lieu d'en proposer. C'est la cause n°1 d'un storyboard qui redit la scene precedente."
    fi

    # (3) Aucune vraie question ouverte adressee au modele
    if ! grep -qiE "propose (your|3|three|ton|votre)|your own concept|invent|imagine|what would you|conceive" "$PROMPT_FILE"; then
      PROBLEMES="$PROBLEMES\n  - AUCUNE QUESTION OUVERTE : rien ne demande au modele de CONCEVOIR (\"propose TON concept\")."
    fi

    # (4) Liste de capacites mono-registre : que du trace/pulse/pin, rien d'autre
    TRACE=$(grep -ciE "route|pulse|trace|arrow|line|pin|flow" "$PROMPT_FILE")
    AUTRE=$(grep -ciE "cutaway|cross-section|full[- ]screen|character|footage|filmed|cartogram|choropleth|deform|montage|scale|zoom out" "$PROMPT_FILE")
    if [ "$TRACE" -gt 3 ] && [ "$AUTRE" -lt 2 ]; then
      PROBLEMES="$PROBLEMES\n  - VOCABULAIRE MONO-REGISTRE : $TRACE mentions de traces/pulses/fleches contre $AUTRE d'autre chose."
    fi

    [ -z "$PROBLEMES" ] && exit 0

    cat >&2 <<EOF
{
  "decision": "block",
  "reason": "BRIEF DE STORYBOARD BRIDE — $PROMPT_FILE\n\nProblemes detectes :$PROBLEMES\n\nUn moteur absent (ou ferme) dans le brief est un moteur que le modele ne proposera JAMAIS.\nVecu 2026-08-15 (Gazoduc 4B) : brief centre sur la carte, insert INTERDIT, et 2 concepts\ndeja rediges par nous => les 2 modeles ont rendu 6 panneaux de fleches. Ce n'etait pas leur\nmanque d'imagination : c'etait le monde que le brief leur avait donne.\n\nCE QU'IL FAUT CORRIGER AVANT DE RELANCER :\n  1. NE PAS ecrire les concepts. Demander : \"propose 3 concepts DISTINCTS, dis lequel tu defends\".\n  2. NE PAS fermer un registre entier. Un dispositif couteux se PLAFONNE et se JUSTIFIE\n     (\"si tu l'utilises, dis ce qu'il apporte que la carte ne peut pas dire\"), il ne s'interdit pas.\n  3. Ouvrir plusieurs registres : carte reelle · geometrie calculee (globe, cartogramme,\n     choropleth, deformation) · objet/metaphore SVG (coupe, schema) · acteur humain ·\n     matiere filmee H3 · LE MONTAGE (droit de QUITTER la carte, couper, plein ecran).\n  4. Poser les CONTRAINTES REELLES (ce qui est vrai : code deterministe, geo verrouillee,\n     pas de chiffres inventes) — jamais nos preferences de forme deguisees en contraintes.\n\nDoctrine moteurs (amplitude prouvee de chacun) : $DOCTRINE\nDoctrine storyboard (le modele PROPOSE, on valide) : memory/doctrines/STORYBOARD-MAPBOX.md"
}
EOF
    exit 2
    ;;

  *)
    exit 0
    ;;
esac
