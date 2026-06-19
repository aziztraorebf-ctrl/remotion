#!/bin/bash
# publish-storyboard.sh — Publie un storyboard beat sur here.now
# Usage: ./scripts/publish-storyboard.sh <beat_dir> <beat_name> [audio_script] [slug] [claimToken]
#
# Exemple:
#   ./scripts/publish-storyboard.sh /tmp/beat2_storyboard beat2 \
#     "Tout commence en deux mille sept..." [slug] [token]
#
# Lit automatiquement storyboard.md depuis beat_dir si present.
# Images : uploadees sur catbox.moe (URLs absolues) + fallback base64.
# HTML : script audio + grille segments + tableau R1 + composants suggeres.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$SCRIPT_DIR/.."
ENV_FILE="$REPO/.env"

BEAT_DIR="${1:-}"
BEAT_NAME="${2:-beat?}"
AUDIO_SCRIPT="${3:-}"
SLUG="${4:-}"
CLAIM_TOKEN="${5:-}"

if [[ -z "$BEAT_DIR" || ! -d "$BEAT_DIR" ]]; then
  echo "Usage: $0 <beat_dir> <beat_name> [audio_script] [slug] [claimToken]"
  exit 1
fi

PUBLISH_SCRIPT="$HOME/.claude/skills/atlas-video-preproduction/scripts/publish-here-now.sh"

# Charger NTFY_TOPIC
if [[ -f "$ENV_FILE" ]]; then
  NTFY_TOPIC=$(grep -E '^NTFY_TOPIC=' "$ENV_FILE" | cut -d'=' -f2 | tr -d '"' | tr -d "'" || true)
fi

echo "[publish-storyboard] Beat: $BEAT_NAME — Dir: $BEAT_DIR"

# ── Uploader images sur catbox ──────────────────────────────────────────────
upload_to_catbox() {
  local path="$1"
  local url
  url=$(curl -s --max-time 20 -F "reqtype=fileupload" -F "fileToUpload=@${path}" "https://catbox.moe/user.php" 2>/dev/null || true)
  if echo "$url" | grep -qE "^https://files\.catbox\.moe/"; then
    echo "$url"
  else
    # Fallback litterbox (72h)
    url=$(curl -s --max-time 20 -F "reqtype=fileupload" -F "time=72h" -F "fileToUpload=@${path}" "https://litterbox.catbox.moe/resources/internals/api.php" 2>/dev/null || true)
    if echo "$url" | grep -qE "^https://litter\.catbox\.moe/"; then
      echo "$url"
    else
      echo ""
    fi
  fi
}

# Collecter les images
declare -a IMG_PATHS=()
for i in 1 2 3 4 5 6 7 8; do
  for ext in png jpg jpeg; do
    f="$BEAT_DIR/segment_${i}.${ext}"
    if [[ -f "$f" ]]; then
      IMG_PATHS+=("$f")
      break
    fi
  done
done

echo "[publish-storyboard] ${#IMG_PATHS[@]} images trouvees"

# Uploader sur catbox, fallback base64
declare -a IMG_SRCS=()
USE_BASE64=false
for img in "${IMG_PATHS[@]}"; do
  echo -n "  Upload $(basename "$img")... "
  catbox_url=$(upload_to_catbox "$img")
  if [[ -n "$catbox_url" ]]; then
    echo "$catbox_url"
    IMG_SRCS+=("$catbox_url")
  else
    echo "catbox KO — fallback base64"
    USE_BASE64=true
    ext="${img##*.}"
    mime="image/png"
    [[ "$ext" == "jpg" || "$ext" == "jpeg" ]] && mime="image/jpeg"
    IMG_SRCS+=("data:${mime};base64,$(base64 -i "$img")")
  fi
done

# ── Lire storyboard.md pour extraire les donnees ───────────────────────────
STORYBOARD_FILE="$BEAT_DIR/storyboard.md"
# Chercher aussi dans le dossier beat du projet
PROJECT_STORYBOARD="$REPO/src/projects/souverain/silicon-savannah/${BEAT_NAME}/storyboard.md"
if [[ ! -f "$STORYBOARD_FILE" && -f "$PROJECT_STORYBOARD" ]]; then
  STORYBOARD_FILE="$PROJECT_STORYBOARD"
fi

# Extraire donnees depuis storyboard.md via python
if [[ -f "$STORYBOARD_FILE" ]]; then
  echo "[publish-storyboard] Lecture storyboard: $STORYBOARD_FILE"
  PARSED=$(python3 - "$STORYBOARD_FILE" <<'PYEOF'
import sys, re, json

path = sys.argv[1]
content = open(path).read()

# Extraire le bloc JSON
m = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
data = {}
segments = []
components = []
tailwind = []
animation_notes = ""

if m:
    try:
        data = json.loads(m.group(1))
        segments = data.get("r1_segments", [])
        components = data.get("components_suggested", [])
        tailwind = data.get("tailwind_tokens", [])
        animation_notes = data.get("animation_notes", "")
    except:
        pass

print(json.dumps({
    "segments": segments,
    "components": components,
    "tailwind": tailwind,
    "animation_notes": animation_notes,
    "duration_s": data.get("duration_s", 0),
}))
PYEOF
  )
else
  echo "[publish-storyboard] storyboard.md absent — HTML minimal"
  PARSED='{"segments":[],"components":[],"tailwind":[],"animation_notes":"","duration_s":0}'
fi

# ── Generer HTML complet ───────────────────────────────────────────────────
TMP_HTML="$BEAT_DIR/index_embed.html"
TMP_DATA="$BEAT_DIR/_gen_data.json"

# Ecrire les donnees dans un fichier JSON intermediaire
# Les img_srcs sont ecrits via python directement (evite "arg list too long" pour base64)
python3 - <<PYEOF2
import json, base64, os

parsed = json.loads(r"""${PARSED}""")
parsed['beat_name'] = """${BEAT_NAME}"""
parsed['audio_script'] = """${AUDIO_SCRIPT}"""

img_paths = [$(printf '"%s",' "${IMG_PATHS[@]}")]
img_srcs_raw = [$(printf '"%s",' "${IMG_SRCS[@]}")]

# Pour chaque src : si c'est une URL => garder, si vide => encoder en base64 depuis path
img_srcs_final = []
for i, src in enumerate(img_srcs_raw):
    if src.startswith("http"):
        img_srcs_final.append(src)
    elif i < len(img_paths) and os.path.exists(img_paths[i]):
        ext = img_paths[i].rsplit(".", 1)[-1].lower()
        mime = "image/jpeg" if ext in ("jpg", "jpeg") else "image/png"
        with open(img_paths[i], "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        img_srcs_final.append(f"data:{mime};base64,{b64}")
    else:
        img_srcs_final.append("")

parsed['img_srcs'] = img_srcs_final

with open("${TMP_DATA}", "w") as f:
    json.dump(parsed, f)
PYEOF2

python3 - "$TMP_DATA" <<'PYEOF' > "$TMP_HTML"
import sys, json, html

with open(sys.argv[1]) as f:
    data = json.load(f)

parsed = data
beat_name = data["beat_name"]
audio_script = data["audio_script"]
img_srcs = data["img_srcs"]

segments = parsed["segments"]
components = parsed["components"]
tailwind = parsed["tailwind"]
animation_notes = parsed["animation_notes"]
duration_s = parsed["duration_s"]

# Generer cartes segments
seg_cards = ""
for i, seg in enumerate(segments):
    img_src = img_srcs[i] if i < len(img_srcs) else ""
    seg_id = html.escape(seg.get("id", f"?"))
    start_f = seg.get("start_frame", "?")
    end_f = seg.get("end_frame", "?")
    start_s = seg.get("start_s", "?")
    end_s = seg.get("end_s", "?")
    dur = seg.get("duration_s", "?")
    change = html.escape(seg.get("change", ""))
    layout = html.escape(seg.get("layout", ""))
    elements = seg.get("elements", [])
    bg = html.escape(seg.get("bg_texture", ""))

    elements_html = "".join(f'<li>{html.escape(e)}</li>' for e in elements)

    img_tag = f'<img src="{img_src}" alt="Segment {seg_id}">' if img_src else '<div class="no-img">image absente</div>'
    seg_cards += f'''
    <div class="segment">
      {img_tag}
      <div class="info">
        <div class="seg-id">Segment {seg_id}</div>
        <div class="timing">frames {start_f}&#x2192;{end_f} &middot; {start_s}s&#x2192;{end_s}s &middot; {dur}s</div>
        <div class="change">{change}</div>
        <span class="r1-badge">R1 OK</span>
        <div class="layout-label">{layout}</div>
        <ul class="elements">{elements_html}</ul>
        <div class="bg-label">BG: {bg}</div>
      </div>
    </div>'''

# Tableau R1
r1_rows = ""
for seg in segments:
    seg_id = html.escape(seg.get("id", "?"))
    start_f = seg.get("start_frame", "?")
    end_f = seg.get("end_frame", "?")
    dur = seg.get("duration_s", "?")
    change = html.escape(seg.get("change", ""))
    r1_rows += f'<tr><td>{seg_id}</td><td>{start_f}&#x2192;{end_f}</td><td>{dur}s</td><td class="ok">OK</td><td>{change}</td></tr>\n'

# Composants
comp_str = ", ".join(components) if components else "—"
tw_str = ", ".join(tailwind) if tailwind else "—"
anim_str = html.escape(animation_notes) if animation_notes else "—"

script_block = f'<div class="audio-script">&#x201C;{html.escape(audio_script)}&#x201D;</div>' if audio_script else ""

print(f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Silicon Savannah — {beat_name} Storyboard</title>
<style>
  *{{box-sizing:border-box}}
  body{{background:#0d1420;color:#f5efe0;font-family:Georgia,serif;margin:0;padding:20px;max-width:960px;margin:0 auto;padding:24px}}
  h1{{color:#FFB800;font-size:1.5em;margin-bottom:4px}}
  .sub{{color:#888;font-size:.82em;margin-bottom:24px;font-family:monospace}}
  .audio-script{{background:#12192a;border-left:3px solid #FFB800;padding:14px 20px;border-radius:4px;font-style:italic;color:#f5efe0;line-height:1.7;margin-bottom:28px;font-size:.95em}}
  .section-title{{color:#FFB800;font-family:monospace;font-size:.8em;text-transform:uppercase;letter-spacing:2px;margin:32px 0 14px;border-bottom:1px solid #1a2035;padding-bottom:8px}}
  .grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}}
  .segment{{background:#12192a;border-radius:8px;overflow:hidden}}
  .segment img{{width:100%;display:block}}
  .no-img{{background:#1a2035;height:200px;display:flex;align-items:center;justify-content:center;color:#555;font-family:monospace;font-size:.8em}}
  .info{{padding:14px 16px}}
  .seg-id{{color:#FFB800;font-size:.78em;font-family:monospace;text-transform:uppercase;letter-spacing:2px}}
  .timing{{color:#aaa;font-size:.75em;font-family:monospace;margin:4px 0 6px}}
  .change{{color:#f5efe0;font-size:.88em;font-weight:bold;margin-bottom:6px;line-height:1.4}}
  .r1-badge{{display:inline-block;background:#1a3a1a;color:#4ade80;font-size:.68em;padding:2px 8px;border-radius:10px;font-family:monospace}}
  .layout-label{{color:#888;font-size:.75em;font-family:monospace;margin-top:6px}}
  .elements{{margin:8px 0 0;padding:0;list-style:none}}
  .elements li{{font-size:.78em;color:#aaa;padding:2px 0 2px 14px;position:relative;line-height:1.4}}
  .elements li::before{{content:"\\2192";position:absolute;left:0;color:#FFB800}}
  .bg-label{{font-size:.72em;color:#555;font-family:monospace;margin-top:6px;font-style:italic}}
  table{{width:100%;border-collapse:collapse;font-size:.82em}}
  th{{background:#1a2035;color:#FFB800;padding:10px 14px;text-align:left;font-family:monospace;font-size:.8em}}
  td{{padding:9px 14px;border-top:1px solid #1a2035;color:#ddd;font-family:monospace}}
  .ok{{color:#4ade80;font-weight:bold}}
  .json-block{{background:#0a0f1a;border:1px solid #1a2035;border-radius:6px;padding:16px;font-family:monospace;font-size:.75em;color:#a0aec0;white-space:pre-wrap;overflow-x:auto;line-height:1.6}}
</style>
</head>
<body>
<h1>Silicon Savannah — {beat_name}</h1>
<p class="sub">Phase 1 Storyboard &middot; 2026-05-14 &middot; gemini-3.1-flash-image-preview + gemini-3.1-pro-preview &middot; {duration_s}s</p>

{script_block}

<div class="section-title">Storyboard — {len(segments)} segments (R1 valid&eacute;)</div>
<div class="grid">{seg_cards}</div>

<div class="section-title">Tableau R1</div>
<table>
  <tr><th>Segment</th><th>Frames</th><th>Dur&eacute;e</th><th>R1</th><th>Changement visuel</th></tr>
  {r1_rows}
</table>

<div class="section-title">Composants sugg&eacute;r&eacute;s</div>
<div class="json-block">Composants : {comp_str}
Tailwind    : {tw_str}
Animations  : {anim_str}</div>

</body>
</html>''')
PYEOF

echo "[publish-storyboard] HTML genere : $TMP_HTML ($(wc -c < "$TMP_HTML" | tr -d ' ') bytes)"

# Verifier les images
if grep -qE 'src="https?://|src="data:image' "$TMP_HTML"; then
  echo "[publish-storyboard] Images presentes dans le HTML — OK"
else
  echo "[ERREUR] Aucune image dans le HTML — verifier les uploads"
  exit 1
fi

# ── Publier sur here.now ───────────────────────────────────────────────────
echo "[publish-storyboard] Publication sur here.now..."
if [[ -n "$SLUG" && -n "$CLAIM_TOKEN" ]]; then
  PUBLISH_OUTPUT=$(bash "$PUBLISH_SCRIPT" "$TMP_HTML" "$SLUG" "$CLAIM_TOKEN" 2>&1)
else
  PUBLISH_OUTPUT=$(bash "$PUBLISH_SCRIPT" "$TMP_HTML" 2>&1)
fi

echo "$PUBLISH_OUTPUT"

SITE_URL=$(echo "$PUBLISH_OUTPUT" | grep -E "^Live URL" | awk '{print $NF}' || true)
if [[ -z "$SITE_URL" ]]; then
  SITE_URL=$(echo "$PUBLISH_OUTPUT" | grep -oE 'https://[a-z0-9-]+\.here\.now/' | head -1 || true)
fi

echo ""
echo "======================================="
echo "STORYBOARD PUBLIE"
echo "URL : ${SITE_URL:-INCONNUE}"
echo "======================================="

# Notif ntfy avec lien cliquable
if [[ -n "${NTFY_TOPIC:-}" && -n "${SITE_URL:-}" ]]; then
  bash "$SCRIPT_DIR/ntfy-notify.sh" storyboard_ready "$BEAT_NAME" "$SITE_URL"
fi
