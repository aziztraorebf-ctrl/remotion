#!/bin/bash
# Gemini 3.1 Flash image via REST curl -4 (le SDK Python stalle en IPv6 sandbox).
# Usage: gemini-genimg-ipv4.sh "<prompt>" <ref.jpg> <output.png>
set -e
PROMPT="$1"; REF="$2"; OUT="$3"
KEY=$(grep '^GEMINI_API_KEY=' "$(dirname "$0")/../../.env" | cut -d= -f2 | tr -d '"'"'"'"')
MIME="image/jpeg"; [[ "$REF" == *.png ]] && MIME="image/png"
TMP=$(mktemp -d)
B64=$(base64 -i "$REF")
python3 -c "
import json,sys
payload={'contents':[{'parts':[{'text':sys.argv[1]},{'inline_data':{'mime_type':sys.argv[2],'data':open(sys.argv[3]).read().strip()}}]}]}
json.dump(payload,open(sys.argv[4],'w'))
" "$PROMPT" "$MIME" <(echo "$B64") "$TMP/payload.json"
curl -4 -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=$KEY" \
  -H "Content-Type: application/json" --data-binary "@$TMP/payload.json" 2>/dev/null > "$TMP/resp.json"
RESP="$TMP/resp.json" python3 -c "
import json,base64,sys,os
d=json.load(open(os.environ['RESP']))
if 'error' in d: print('ERREUR:',d['error'].get('message')); sys.exit(1)
out=sys.argv[1]
for p in d['candidates'][0]['content']['parts']:
    idata=p.get('inlineData') or p.get('inline_data')
    if idata:
        raw=base64.b64decode(idata['data'])
        # IMPORTANT: Gemini renvoie souvent image/jpeg meme si on demande un .png.
        # Un JPEG dans un fichier .png = glitch bandes vertes au decodage. On ecrit la VRAIE extension.
        mime=(idata.get('mimeType') or idata.get('mime_type') or '').lower()
        if raw[:3]==bytes([255,216,255]): real='.jpg'
        elif raw[:8]==bytes([137,80,78,71,13,10,26,10]): real='.png'
        else: real='.jpg' if 'jpeg' in mime else '.png'
        base=out.rsplit('.',1)[0]
        path=base+real
        open(path,'wb').write(raw)
        print('OK',path,'('+mime+')'); sys.exit(0)
print('PAS D IMAGE'); sys.exit(2)
" "$OUT"
