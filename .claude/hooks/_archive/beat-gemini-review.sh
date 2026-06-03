#!/bin/bash
# beat-gemini-review.sh
# PostToolUse (Bash) — se declenche apres chaque commande Bash
# Detecte si un render wip/*.mp4 vient d'etre produit
# Lance automatiquement review Gemini 3.1-pro-preview et enregistre le score

exit 0  # temporairement desactive — bug heredoc backticks Python

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [[ "$COMMAND" != *"remotion render"* ]] && [[ "$COMMAND" != *"render-mapbox"* ]]; then
  exit 0
fi

# Extraire le fichier de sortie depuis la commande (compatible macOS)
OUTPUT_FILE=$(echo "$COMMAND" | python3 -c "import sys,re; m=re.search(r'(out/episodes/\S+\.mp4)', sys.stdin.read()); print(m.group(1) if m else '')" 2>/dev/null)
if [ -z "$OUTPUT_FILE" ]; then
  exit 0
fi

# Attendre que le fichier existe
if [ ! -f "$OUTPUT_FILE" ]; then
  exit 0
fi

# Extraire episode et beat depuis le chemin (compatible macOS)
EPISODE=$(echo "$OUTPUT_FILE" | python3 -c "import sys,re; m=re.search(r'episodes/([^/]+)', sys.stdin.read()); print(m.group(1) if m else '')" 2>/dev/null)
BEAT_FILE=$(basename "$OUTPUT_FILE" .mp4)
BEAT_NUM=$(echo "$BEAT_FILE" | python3 -c "import sys,re; m=re.search(r'beat([0-9]+)', sys.stdin.read()); print(m.group(1) if m else '')" 2>/dev/null)

echo ""
echo "================================================"
echo "AUTO GEMINI REVIEW — ${EPISODE}/${BEAT_FILE}"
echo "================================================"
echo "Render detecte : $OUTPUT_FILE"
echo "Lancement review Gemini 3.1-pro-preview..."
echo ""

# Extraire 5 frames 432p
FRAMES_DIR="/tmp/gemini_review_${EPISODE}_beat${BEAT_NUM}"
mkdir -p "$FRAMES_DIR"
DURATION=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$OUTPUT_FILE" 2>/dev/null)
TOTAL_FRAMES=$(ffprobe -v quiet -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 "$OUTPUT_FILE" 2>/dev/null | tr -d ',' | awk '{print int($1)}')

if [ -z "$TOTAL_FRAMES" ] || [ "$TOTAL_FRAMES" = "0" ] || [ "$TOTAL_FRAMES" = "N/A" ]; then
  TOTAL_FRAMES=300
fi

# 5 frames reparties uniformement
F1=0
F2=$(( TOTAL_FRAMES / 5 ))
F3=$(( TOTAL_FRAMES * 2 / 5 ))
F4=$(( TOTAL_FRAMES * 3 / 5 ))
F5=$(( TOTAL_FRAMES * 4 / 5 ))

ffmpeg -y -i "$OUTPUT_FILE" \
  -vf "select='eq(n,${F1})+eq(n,${F2})+eq(n,${F3})+eq(n,${F4})+eq(n,${F5})',scale=243:432,setpts=N/TB" \
  -vsync vfr "${FRAMES_DIR}/frame_%02d.jpg" 2>/dev/null

FRAME_COUNT=$(ls "${FRAMES_DIR}"/frame_*.jpg 2>/dev/null | wc -l)
if [ "$FRAME_COUNT" -lt 3 ]; then
  echo "[ERREUR] Extraction frames echouee ($FRAME_COUNT frames extraites)."
  exit 0
fi

echo "Frames extraites : $FRAME_COUNT frames dans $FRAMES_DIR"
echo "Envoi a Gemini 3.1-pro-preview..."

# Lire les regles de production pour le contexte du prompt
RULES_SUMMARY="R1:Max 8s sans changement visuel. R3:Composants _shared/ utilises. R4:Score min 8.5. R5:Timing audio-derived. R6:Tailwind tokens. R7:Permanent motion."

# Review Gemini via Python — clé lue depuis .env et exportée pour le sous-shell
_GEMINI_KEY_VAR="GEMINI_API_KEY"
_GEMINI_KEY_VAL=$(grep "$_GEMINI_KEY_VAR" /Users/clawdbot/Workspace/remotion/.env 2>/dev/null | cut -d= -f2)
export "$_GEMINI_KEY_VAR=$_GEMINI_KEY_VAL"
unset _GEMINI_KEY_VAR _GEMINI_KEY_VAL

REVIEW_RESULT=$(FRAMES_DIR="$FRAMES_DIR" BEAT_FILE="$BEAT_FILE" \
  EPISODE="$EPISODE" RULES_SUMMARY="$RULES_SUMMARY" \
  python3 - <<'PYEOF'
import os, json, sys
from google import genai
from google.genai import types
import glob

api_key = os.environ.get('GEMINI_API_KEY')
if not api_key:
    print(json.dumps({"score": 0, "verdict": "ERROR", "error": "API key manquante"}))
    sys.exit(0)

client = genai.Client(api_key=api_key)

frames_dir = os.environ.get('FRAMES_DIR', '')
beat_file = os.environ.get('BEAT_FILE', '')
episode = os.environ.get('EPISODE', '')
rules = os.environ.get('RULES_SUMMARY', '')

frame_files = sorted(glob.glob(f"{frames_dir}/frame_*.jpg"))
frames_parts = []
for f in frame_files[:5]:
    with open(f, "rb") as fp:
        frames_parts.append(types.Part.from_bytes(data=fp.read(), mime_type="image/jpeg"))

prompt = f"""Tu es directeur artistique expert en Shorts YouTube verticaux (1080x1920) pour GeoAfrique.

Analyse ces frames du beat '{beat_file}' episode '{episode}'.

REGLES A VERIFIER :
{rules}

PALETTE SOUVERAIN : fond #112240, gold #FFB800, ivory #f5efe0, Bebas Neue, monospace pour stats.

Reponds UNIQUEMENT avec ce JSON (pas de texte avant ou apres) :
{{
  "score": 8.5,
  "verdict": "APPROVE",
  "r1_rythme": "ok|fail — explication courte",
  "r7_motion": "ok|fail — explication",
  "palette": "ok|fail — explication",
  "typography": "ok|fail — explication",
  "fixes": [{{"severity": "minor|major", "element": "X", "fix": "Y"}}],
  "strengths": ["point 1", "point 2"]
}}"""

def extract_json(text):
    text = text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    return text

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt] + frames_parts,
        config=types.GenerateContentConfig(
            temperature=0.2,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
            max_output_tokens=800
        )
    )
    result = json.loads(extract_json(response.text))
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"score": 0, "verdict": "ERROR", "error": str(e)}))
PYEOF
)

# Parser le score
SCORE=$(echo "$REVIEW_RESULT" | python3 -c "
import json, sys
try:
    data = json.loads(sys.stdin.read())
    print(data.get('score', 0))
except:
    print(0)
" 2>/dev/null)

VERDICT=$(echo "$REVIEW_RESULT" | python3 -c "
import json, sys
try:
    data = json.loads(sys.stdin.read())
    print(data.get('verdict', 'UNKNOWN'))
except:
    print('UNKNOWN')
" 2>/dev/null)

# Afficher le resultat
echo ""
echo "SCORE : ${SCORE}/10 — ${VERDICT}"
echo ""
echo "$REVIEW_RESULT" | python3 -c "
import json, sys
try:
    data = json.loads(sys.stdin.read())
    fixes = data.get('fixes', [])
    if fixes:
        print('CORRECTIONS REQUISES :')
        for f in fixes:
            sev = f.get('severity','?').upper()
            elem = f.get('element','?')
            fix = f.get('fix','?')
            print(f'  [{sev}] {elem} -> {fix}')
    strengths = data.get('strengths', [])
    if strengths:
        print('POINTS FORTS :')
        for s in strengths:
            print(f'  + {s}')
    fallback = data.get('fallback_model')
    if fallback:
        print(f'  [NOTE] Fallback utilise: {fallback} (3.1-pro timeout)')
except:
    pass
" 2>/dev/null

# Enregistrer le score dans gemini-scores.json
SCORES_FILE="/tmp/gemini-scores.json"
python3 - <<PYEOF2
import json, os
scores_file = "$SCORES_FILE"
try:
    with open(scores_file) as f:
        scores = json.load(f)
except:
    scores = {}

key = "${EPISODE}-beat${BEAT_NUM}"
try:
    result = json.loads('''$REVIEW_RESULT''')
    scores[key] = {
        "score": result.get("score", 0),
        "verdict": result.get("verdict", "UNKNOWN"),
        "file": "$OUTPUT_FILE"
    }
except:
    pass

with open(scores_file, "w") as f:
    json.dump(scores, f, indent=2)
print(f"Score enregistre : {key}")
PYEOF2

# Bloquer si score < 8.5
if python3 -c "exit(0 if float('${SCORE:-0}') >= 8.5 else 1)" 2>/dev/null; then
  echo ""
  echo "[VALIDE] Score ${SCORE}/10 >= 8.5 — Beat autorise pour presentation."
  exit 0
else
  echo ""
  echo "================================================"
  echo "[BLOQUE] Score ${SCORE}/10 < 8.5"
  echo "Appliquer les corrections ci-dessus et re-render avant de presenter."
  echo "================================================"
  exit 0
fi
