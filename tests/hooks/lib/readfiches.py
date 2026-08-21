#!/usr/bin/env python3
"""Lit la sortie du hook fiche-inject sur stdin -> noms des fiches injectees."""
import json
import re
import sys

raw = sys.stdin.read()
if not raw.strip():
    print("")
    sys.exit(0)
try:
    ctx = json.loads(raw)["hookSpecificOutput"]["additionalContext"]
except Exception:
    print("")
    sys.exit(0)
print(",".join(sorted(re.findall(r"=== ([A-Z0-9 \-]+) \(rappel auto", ctx))))
