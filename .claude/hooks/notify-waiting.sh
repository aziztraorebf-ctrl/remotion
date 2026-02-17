#!/bin/bash
# notify-waiting.sh
# Plays a macOS notification sound when Claude is waiting for user input.
# Hook event: Notification

osascript -e 'display notification "Claude attend votre reponse" with title "Claude Code" sound name "Purr"' 2>/dev/null

exit 0
