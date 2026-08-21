#!/usr/bin/env python3
"""Construit un payload de hook PreToolUse pour les tests.
Usage: mkpayload.py <session> <tool> <file_path|command> [content]
Extrait dans un fichier plutot qu'en heredoc : un heredoc imbrique dans une
fonction shell appelee en pipeline se comportait de facon instable (4 faux
echecs lors de l'ecriture de cette suite, 2026-08-21)."""
import json
import sys

sid, tool, arg3 = sys.argv[1], sys.argv[2], sys.argv[3]
ti = {"command": arg3} if tool == "Bash" else {"file_path": arg3, "content": sys.argv[4]}
print(json.dumps({"session_id": sid, "tool_name": tool, "tool_input": ti}))
