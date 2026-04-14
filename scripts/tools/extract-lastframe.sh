#!/bin/bash
# Extract the last frame from a video clip for frame chaining.
# Usage: ./extract-lastframe.sh clip_1.mp4 [clip_2.mp4 ...]
# Output: lastframe_clip_1.png in the same directory as the input file.

set -euo pipefail

if [ $# -eq 0 ]; then
    echo "Usage: $0 <clip1.mp4> [clip2.mp4 ...]"
    echo "Extracts the last frame from each video as lastframe_<name>.png"
    exit 1
fi

for clip in "$@"; do
    if [ ! -f "$clip" ]; then
        echo "SKIP: $clip not found"
        continue
    fi

    dir=$(dirname "$clip")
    base=$(basename "$clip" .mp4)
    output="${dir}/lastframe_${base}.png"

    ffmpeg -sseof -0.1 -i "$clip" -frames:v 1 -update 1 -y "$output" 2>/dev/null

    if [ -f "$output" ]; then
        echo "OK: $output"
    else
        echo "FAIL: $clip"
    fi
done
