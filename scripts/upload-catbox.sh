#!/bin/bash
# Upload file to catbox.moe and return URL
FILE="$1"
if [ ! -f "$FILE" ]; then
  echo "ERROR: file not found: $FILE" >&2
  exit 1
fi
SIZE=$(stat -f%z "$FILE")
SIZE_MB=$((SIZE / 1024 / 1024))
echo "Uploading $FILE ($SIZE_MB MB) to catbox.moe..." >&2

if [ "$SIZE" -gt 209715200 ]; then
  echo "File too large (>200MB) for catbox, using litterbox (72h expiry)..." >&2
  URL=$(curl -sS -F "reqtype=fileupload" -F "time=72h" -F "fileToUpload=@$FILE" https://litterbox.catbox.moe/resources/internals/api.php)
else
  URL=$(curl -sS -F "reqtype=fileupload" -F "fileToUpload=@$FILE" https://catbox.moe/user/api.php)
fi

echo "$URL"
