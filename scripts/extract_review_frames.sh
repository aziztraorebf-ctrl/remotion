#!/bin/bash
# ============================================================
# extract_review_frames.sh
# Extract frames + contact sheet + LLM prompt from a video
#
# Usage:
#   ./scripts/extract_review_frames.sh <video.mp4> [interval_seconds] [project_name]
#
# Examples:
#   ./scripts/extract_review_frames.sh out/anomalie-1347-v2.mp4
#   ./scripts/extract_review_frames.sh out/video.mp4 2 "peste-1347"
#
# Output:
#   review-frames/<project>/<timestamp>/
#     frame-001.jpg ... frame-NNN.jpg   (individual frames)
#     contact-sheet.jpg                  (all frames on 1 image)
#     PROMPT.txt                         (copy-paste to any LLM)
#     REVIEW.md                          (detailed template)
#
# Requirements: ffmpeg
# ============================================================

set -euo pipefail

VIDEO_PATH="${1:?Usage: $0 <video.mp4> [interval_seconds] [project_name]}"
INTERVAL="${2:-3}"
PROJECT_NAME="${3:-$(basename "$VIDEO_PATH" .mp4)}"

# Resolve paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VIDEO_ABS="$(cd "$(dirname "$VIDEO_PATH")" 2>/dev/null && pwd)/$(basename "$VIDEO_PATH")" || VIDEO_ABS="$VIDEO_PATH"

if [ ! -f "$VIDEO_ABS" ]; then
  if [ -f "$VIDEO_PATH" ]; then
    VIDEO_ABS="$(pwd)/$VIDEO_PATH"
  else
    echo "Error: Video file not found: $VIDEO_PATH"
    exit 1
  fi
fi

# Get video duration
DURATION=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$VIDEO_ABS" | cut -d. -f1)
if [ -z "$DURATION" ]; then
  echo "Error: Could not determine video duration"
  exit 1
fi

# Create output directory
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="$PROJECT_ROOT/review-frames/${PROJECT_NAME}/${TIMESTAMP}"
mkdir -p "$OUTPUT_DIR"

echo "=== Frame Extraction for LLM Review ==="
echo "Video:    $VIDEO_ABS"
echo "Duration: ${DURATION}s"
echo "Interval: every ${INTERVAL}s"
echo "Output:   $OUTPUT_DIR"
echo ""

# ---- STEP 1: Extract individual frames ----
FRAME_COUNT=$(( DURATION / INTERVAL + 1 ))
echo "[1/3] Extracting ~${FRAME_COUNT} frames..."

ffmpeg -y -i "$VIDEO_ABS" \
  -vf "fps=1/${INTERVAL},scale=960:-1" \
  -q:v 2 \
  "$OUTPUT_DIR/frame-%03d.jpg" \
  2>/dev/null

ACTUAL_COUNT=$(ls "$OUTPUT_DIR"/frame-*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "       ${ACTUAL_COUNT} frames extracted"

# ---- STEP 2: Generate contact sheet ----
echo "[2/3] Generating contact sheet..."

# Calculate grid: max 5 columns
COLS=5
ROWS=$(( (ACTUAL_COUNT + COLS - 1) / COLS ))

# Try with drawtext for frame numbers (needs libfreetype)
ffmpeg -y -start_number 1 \
  -i "$OUTPUT_DIR/frame-%03d.jpg" \
  -vf "drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:text='%{n}':x=5:y=5:fontsize=18:fontcolor=red:box=1:boxcolor=white@0.7:boxborderw=3,tile=${COLS}x${ROWS}:padding=4:margin=6:color=white" \
  -frames:v 1 -update 1 -q:v 2 \
  "$OUTPUT_DIR/contact-sheet.jpg" \
  2>/dev/null || true

# If drawtext fails (filter not compiled or font not found), retry without it
if [ ! -f "$OUTPUT_DIR/contact-sheet.jpg" ]; then
  ffmpeg -y -start_number 1 \
    -i "$OUTPUT_DIR/frame-%03d.jpg" \
    -vf "tile=${COLS}x${ROWS}:padding=4:margin=6:color=white" \
    -frames:v 1 -update 1 -q:v 2 \
    "$OUTPUT_DIR/contact-sheet.jpg" \
    2>/dev/null
fi

SHEET_SIZE=$(ls -lh "$OUTPUT_DIR/contact-sheet.jpg" | awk '{print $5}')
echo "       contact-sheet.jpg (${SHEET_SIZE})"

# ---- STEP 3: Generate timecode reference ----
echo "[3/3] Generating LLM prompt + review template..."

# Build timecode map
TIMECODE_MAP=""
for i in $(seq 1 "$ACTUAL_COUNT"); do
  SEC=$(( (i - 1) * INTERVAL ))
  MIN=$(( SEC / 60 ))
  SECS=$(( SEC % 60 ))
  TC=$(printf "%d:%02d" $MIN $SECS)
  TIMECODE_MAP="${TIMECODE_MAP}Frame $i = ${TC} (${SEC}s)
"
done

# ---- PROMPT.txt: copy-paste to any LLM ----
cat > "$OUTPUT_DIR/PROMPT.txt" << 'PROMPT_HEADER'
## Context

I'm building animated educational YouTube videos using code (Remotion/React).
The attached image is a CONTACT SHEET: all key frames from my video laid out
in a grid, reading left-to-right, top-to-bottom (like reading a book).

This is NOT a finished product - it's a work-in-progress prototype.
I need your honest, specific feedback to improve it.

## What this video is

- Style: Animated doodle/sketch on cream paper (hand-drawn feel)
- Target: YouTube educational content (8-15 min format, this is a 60s excerpt)
- Audio: There's a voiceover narrating (you can't hear it, but the text on screen corresponds to what's being said)
- Left side: A stick-figure character that reacts to the content
- Right side: The main visual content (maps, charts, data visualizations)

## Frame timecodes

PROMPT_HEADER

echo "$TIMECODE_MAP" >> "$OUTPUT_DIR/PROMPT.txt"

cat >> "$OUTPUT_DIR/PROMPT.txt" << 'PROMPT_BODY'

## What I need from you

Look at EVERY frame in the contact sheet and answer these 5 questions:

### 1. READABILITY (most important)
- Can you read ALL text in every frame? If not, which frames have illegible text?
- Are labels, numbers, and titles clear at this size?
- Is the handwritten font readable or too messy?

### 2. VISUAL STORYTELLING
- Does the sequence tell a clear story from frame 1 to the last frame?
- Can you understand what the video is about just from the frames?
- Is there a clear "hook" at the start, "build-up" in the middle, and "payoff" at the end?
- Which frame is the most visually impactful? Which is the weakest?

### 3. COMPOSITION & LAYOUT
- Is the split-screen (character left, content right) balanced or does one side feel empty?
- Does the chart/graph use enough of the available space?
- Is there too much empty space (wasted) or too little (cluttered)?

### 4. CONSISTENCY & STYLE
- Does the doodle/sketch style feel consistent across all frames?
- Are there any frames that look "off" compared to the others?
- Does the character on the left add value or is it distracting?

### 5. TOP 3 SPECIFIC IMPROVEMENTS
Give me exactly 3 concrete, actionable improvements. For each one:
- Reference specific frame numbers
- Explain what's wrong
- Suggest how to fix it

## Output format

Please structure your answer with these 5 numbered sections.
Be direct and specific. I prefer honest criticism over politeness.
PROMPT_BODY

# ---- REVIEW.md: detailed template ----
cat > "$OUTPUT_DIR/REVIEW.md" << REVIEW_HEAD
# Video Review - ${PROJECT_NAME}
## Date: $(date '+%Y-%m-%d %H:%M')
## Source: $(basename "$VIDEO_ABS")
## Duration: ${DURATION}s | Interval: ${INTERVAL}s | Frames: ${ACTUAL_COUNT}

## Timecodes
$(echo "$TIMECODE_MAP")

## Files
- \`contact-sheet.jpg\` - Upload this single image to any LLM
- \`PROMPT.txt\` - Copy-paste this as your message to the LLM
- \`frame-XXX.jpg\` - Individual frames if you need to zoom in

## How to use

### Option A: Quick review (1 image upload)
1. Open ChatGPT / Gemini / Claude
2. Upload \`contact-sheet.jpg\`
3. Copy-paste the contents of \`PROMPT.txt\`
4. Get feedback

### Option B: Detailed review (multiple images)
1. Upload 5-6 key frames (e.g. frame-001, frame-004, frame-007, frame-010, frame-015, frame-020)
2. Copy-paste \`PROMPT.txt\`
3. Ask follow-up questions about specific frames

### Option C: Claude Code review
1. Ask Claude to read the frames and PROMPT.txt from this directory
2. Claude can see images directly and give feedback in-context
REVIEW_HEAD

echo ""
echo "=== Done! ==="
echo ""
echo "Output: $OUTPUT_DIR"
echo ""
echo "Files:"
echo "  contact-sheet.jpg  - 1 image with ALL frames (upload to any LLM)"
echo "  PROMPT.txt         - Copy-paste as your message"
echo "  REVIEW.md          - Instructions & timecodes"
echo "  frame-*.jpg        - Individual frames"
echo ""
echo "Quick start:"
echo "  1. Upload contact-sheet.jpg to ChatGPT/Gemini/Claude"
echo "  2. Paste the content of PROMPT.txt"
echo "  3. Get feedback!"
