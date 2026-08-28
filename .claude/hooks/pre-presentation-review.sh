#!/bin/bash
# pre-presentation-review.sh
# PreToolUse — rend la review visuelle INCONTOURNABLE avant toute presentation d'un rendu.
#
# Declenche sur deux surfaces de presentation :
#   1. Bash : commande qui pousse un .mp4 vers Aziz (catbox / upload-to-blob / ntfy-notify).
#   2. SendUserFile : envoi direct d'un .mp4 a l'utilisateur.
#
# Le hook NE LANCE PAS visual_review.py (trop lent pour un hook). Il VERIFIE qu'une review
# existe deja, est a jour, et a passe le seuil. Si non -> exit 2 avec la commande exacte a lancer.
#
# Convention d'appariement : pour <chemin>/beatN_v3.mp4, la review attendue est
#   <chemin>/beatN_v3.review.json   (ecrite par : visual_review.py <mp4> --output <mp4-sans-ext>.review.json)
#
# Seuil de blocage : score < 8/10  OU  verdict == REBUILD.
# Pas de cle API / review illancable : ce hook ne bloque pas sur l'infra (il ne lance rien).
#
# Comportement :
#   exit 0 -> presentation autorisee
#   exit 2 -> presentation BLOQUEE (Claude voit le message, doit lancer/corriger la review)

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# --- 1. Extraire le(s) mp4 candidat(s) a la presentation selon l'outil ---
CANDIDATE_MP4=""

case "$TOOL_NAME" in
  Bash)
    CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
    # Seules les commandes de PRESENTATION nous interessent
    if [[ "$CMD" != *"catbox.moe"* ]] \
       && [[ "$CMD" != *"upload-catbox.sh"* ]] \
       && [[ "$CMD" != *"upload-to-blob.py"* ]] \
       && [[ "$CMD" != *"ntfy-notify.sh"* ]] \
       && [[ "$CMD" != *"litterbox"* ]]; then
      exit 0
    fi
    # Premier .mp4 LOCAL mentionne (exclure les URL http(s):// — ex: lien ntfy distant)
    CANDIDATE_MP4=$(echo "$CMD" | grep -oE '[^ "'"'"']+\.mp4' | grep -vE '^https?://' | head -1)
    # Nettoyer les prefixes curl/multipart : "fileToUpload=@/path" -> "/path", "key=@x" -> "x"
    CANDIDATE_MP4="${CANDIDATE_MP4##*@}"
    CANDIDATE_MP4="${CANDIDATE_MP4##*=}"
    ;;
  SendUserFile)
    # files[] peut contenir plusieurs chemins ; on prend le premier .mp4
    CANDIDATE_MP4=$(echo "$INPUT" | jq -r '.tool_input.files[]? // empty' | grep -E '\.mp4$' | head -1)
    ;;
  *)
    exit 0
    ;;
esac

# Aucun mp4 implique -> rien a verifier
if [[ -z "$CANDIDATE_MP4" ]]; then
  exit 0
fi

# --- 2. Proto EXPLICITE (_rnd / _r-and-d / templates) : exemption legitime et silencieuse ---
if [[ "$CANDIDATE_MP4" == *"/_r-and-d/"* ]] || [[ "$CANDIDATE_MP4" == *"/_rnd/"* ]] \
   || [[ "$CANDIDATE_MP4" == *"templates-souverain"* ]]; then
  exit 0
fi

# --- 2b. Ni livrable (out/) ni proto explicite : SUSPECT (A7). Un vrai livrable rendu vers ---
#     /tmp/ ou ailleurs shunterait la review en silence. On AVERTIT au lieu d'exit 0 muet.
if [[ "$CANDIDATE_MP4" != *"/out/"* ]] && [[ "$CANDIDATE_MP4" != *"out/"* ]]; then
  echo "[review] ⚠️  Présentation d'un .mp4 HORS out/ et HORS _rnd/ : $CANDIDATE_MP4"
  echo "[review]    Si c'est un PROTO → le mettre sous _rnd/ (exemption claire)."
  echo "[review]    Si c'est un LIVRABLE → il doit être sous out/episodes/<ep>/ + passer la review (sinon il shunte le gate)."
  exit 0
fi

# Resoudre en chemin absolu si relatif
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/clawdbot/Workspace/remotion}"
if [[ "$CANDIDATE_MP4" != /* ]]; then
  MP4_ABS="$PROJECT_DIR/$CANDIDATE_MP4"
else
  MP4_ABS="$CANDIDATE_MP4"
fi

# Le mp4 doit exister pour qu'on puisse comparer les dates
if [[ ! -f "$MP4_ABS" ]]; then
  # Fichier pas encore rendu / chemin inattendu : on ne bloque pas (rien a reviewer)
  exit 0
fi

REVIEW_JSON="${MP4_ABS%.mp4}.review.json"
OVERRIDE_MD="${MP4_ABS%.mp4}.review-override.md"
OVERRIDE_REL="${CANDIDATE_MP4%.mp4}.review-override.md"
REVIEW_CMD="python3 scripts/visual_review.py \"$CANDIDATE_MP4\" --model gemini --storyboard <storyboard.png> --output \"${CANDIDATE_MP4%.mp4}.review.json\""

# --- 2c. MESURES DETERMINISTES (signalement seul, ne bloque JAMAIS) -------------
# Ajoutees 2026-08-27. Deux tests calibres sur une reference pro (Foster, vendue sur
# Fiverr) : ils MESURENT, ils ne jugent pas. Un plan peut legitimement echouer.
#   test-pause.py  : l'info reste-t-elle lisible si on arrete la video ? (auto-portance)
#   test-coupe.py  : les raccords sont-ils perceptibles ? (change blindness)
# Ne bloquent pas -> pas d'override a ecrire, pas de gate a contourner.
# Bornes : timeout 25s chacun, echec silencieux (ne doit JAMAIS casser un upload).
# Formats JSON VERIFIES sur sortie reelle (2026-08-27), pas supposes :
#   pause -> LISTE d'objets, cles self_supporting_pct / holes[start_s,duration_s]
#   coupe -> OBJET, cles coupes[t,verdict,motif]
MESURES_DIR="$PROJECT_DIR/scripts/tools"

if [[ -f "$MESURES_DIR/test-pause.py" ]]; then
  PAUSE_OUT=$(timeout 25 python3 "$MESURES_DIR/test-pause.py" "$MP4_ABS" --json 2>/dev/null)
  if [[ -n "$PAUSE_OUT" ]]; then
    printf '%s' "$PAUSE_OUT" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
if isinstance(d, list):
    d = d[0] if d else {}
pct = d.get("self_supporting_pct")
trous = d.get("holes") or []
if pct is None:
    sys.exit(0)
if pct < 85 or trous:
    print("[mesure] PAUSE : %.0f%% de frames auto-portantes%s"
          % (pct, ", %d trou(s)" % len(trous) if trous else ""))
    for t in trous[:3]:
        print("[mesure]   -> %.1fs pendant %.1fs : rien de lisible si on met en pause"
              % (t.get("start_s", 0), t.get("duration_s", 0)))
    print("[mesure]   (signal, pas un verdict — un fondu volontaire est un faux positif normal)")
' 2>/dev/null
  fi
fi

if [[ -f "$MESURES_DIR/test-coupe.py" ]]; then
  COUPE_OUT=$(timeout 25 python3 "$MESURES_DIR/test-coupe.py" "$MP4_ABS" --json 2>/dev/null)
  if [[ -n "$COUPE_OUT" ]]; then
    printf '%s' "$COUPE_OUT" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
coupes = d.get("coupes") or []
mauvaises = [c for c in coupes
             if str(c.get("verdict", "")).upper() in ("INVISIBLE", "VIOLENTE")]
if mauvaises:
    print("[mesure] COUPE : %d raccord(s) a regarder sur %d" % (len(mauvaises), len(coupes)))
    for c in mauvaises[:3]:
        print("[mesure]   -> %.2fs %s : %s"
              % (c.get("t", 0), str(c.get("verdict", "")).upper(),
                 c.get("motif", "")))
    print("[mesure]   (seuils calibres sur UNE seule reference — a reconfirmer)")
' 2>/dev/null
  fi
fi

block() {
  echo ""
  echo "================================================================"
  echo "PRESENTATION BLOQUEE — review visuelle requise avant de montrer"
  echo "  Rendu : $CANDIDATE_MP4"
  echo "----------------------------------------------------------------"
  echo "$1"
  echo "----------------------------------------------------------------"
  echo "Lance (compare le rendu au storyboard, ecrit la note a cote du mp4) :"
  echo "  $REVIEW_CMD"
  echo "Seuil pour presenter : score >= 8/10 ET verdict != REBUILD."
  echo "(Sans cle API : le hook laisse passer avec un warning — il ne lance rien lui-meme.)"
  echo ""
  echo "FAUX POSITIF GEMINI ? (Gemini = signal, jamais juge : il ignore les decisions"
  echo "d'Aziz, ex. reclame des titres/labels qu'on a VOLONTAIREMENT retires, ou confond"
  echo "les labels de planche du storyboard avec du contenu manquant.) Si le score est"
  echo "bas UNIQUEMENT a cause de faux positifs ET que les vrais defauts sont corriges :"
  echo "  -> ecris une justification TRACEE dans :"
  echo "     $OVERRIDE_REL"
  echo "     (doit etre PLUS RECENTE que le mp4 ; lister chaque fix Gemini ignore + pourquoi)"
  echo "  -> puis relance l'upload. Le hook autorisera (override trace, pas de contournement silencieux)."
  echo "================================================================"
  exit 2
}

# --- OVERRIDE TRACE : faux positif Gemini justifie par ecrit ---
# Autorise la presentation malgre un score < 8 SI une justification a jour existe.
# Conserve le garde-fou (force une trace ecrite), evite les blocages a repetition sur faux positifs.
check_override() {
  if [[ -f "$OVERRIDE_MD" ]]; then
    if [[ "$MP4_ABS" -nt "$OVERRIDE_MD" ]]; then
      echo "[review] Override present mais PLUS ANCIEN que le mp4 (re-rendu depuis) — ignore. Mets a jour $OVERRIDE_REL."
      return 1
    fi
    echo ""
    echo "[review] OVERRIDE TRACE accepte — presentation autorisee malgre score ${SCORE}/10."
    echo "[review] Justification : $OVERRIDE_REL"
    echo "[review] (Faux positif Gemini assume par Claude ; jugement d'Aziz prime.)"
    exit 0
  fi
  return 1
}

# --- 3. Override trace : verifier EN PREMIER (couvre absence de review.json pour livrables finaux valides humainement) ---
if [[ -f "$OVERRIDE_MD" ]]; then
  if [[ "$MP4_ABS" -nt "$OVERRIDE_MD" ]]; then
    echo "[review] Override present mais PLUS ANCIEN que le mp4 (re-rendu depuis) — ignore. Mets a jour $OVERRIDE_REL."
  else
    echo ""
    echo "[review] OVERRIDE TRACE accepte — presentation autorisee (validation humaine)."
    echo "[review] Justification : $OVERRIDE_REL"
    exit 0
  fi
fi

# --- 4. La review existe-t-elle ? ---
if [[ ! -f "$REVIEW_JSON" ]]; then
  block "Aucune review trouvee ($(basename "$REVIEW_JSON") absent)."
fi

# --- 5. La review est-elle a jour (plus recente que le mp4) ? ---
if [[ "$MP4_ABS" -nt "$REVIEW_JSON" ]]; then
  block "La review est PLUS ANCIENNE que le rendu (le mp4 a ete re-rendu depuis). Relance la review."
fi

# --- 5. Lire score + verdict ---
SCORE=$(python3 -c "import json,sys
try:
    d=json.load(open('$REVIEW_JSON'))
    s=d.get('score')
    print(s if s is not None else '')
except Exception:
    print('')" 2>/dev/null)

VERDICT=$(python3 -c "import json,sys
try:
    d=json.load(open('$REVIEW_JSON'))
    print((d.get('verdict') or '').upper())
except Exception:
    print('')" 2>/dev/null)

# Review illisible / score non numerique (ex: cle API manquante au moment de la review)
if [[ -z "$SCORE" ]] || ! python3 -c "float('$SCORE')" >/dev/null 2>&1; then
  echo ""
  echo "[review] WARNING — review presente mais score illisible (score='$SCORE')."
  echo "[review] Probablement une review sans cle API. Presentation AUTORISEE, mais non verifiee."
  echo "[review] Pour une vraie verif : $REVIEW_CMD"
  exit 0
fi

# --- 6. Appliquer le seuil (avec porte de sortie override trace) ---
if [[ "$VERDICT" == "REBUILD" ]]; then
  check_override
  block "Verdict = REBUILD (score ${SCORE}/10). Le rendu demande une refonte, pas une presentation."
fi

if python3 -c "exit(0 if float('$SCORE') < 8 else 1)" 2>/dev/null; then
  check_override
  block "Score ${SCORE}/10 < 8 — corrige les fixes de la review avant de presenter."
fi

echo "[review] OK — ${SCORE}/10 (${VERDICT}). Presentation autorisee."
exit 0
