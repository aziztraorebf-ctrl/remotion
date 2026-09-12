#!/usr/bin/env python3
"""
test-gate.py — eprouver un hook PreToolUse dans les DEUX sens, sans le declencher.

POURQUOI CET OUTIL EXISTE
-------------------------
`feedback_gate-jamais-vu-se-declencher-est-indiscernable-dun-gate-mort.md` (11/09) pose la
regle : un gate n'est valide que par un cas reel sur lequel on l'a VU se declencher, ET un
cas sur lequel on l'a vu se taire. Un gate silencieux et un gate mort produisent la meme
sortie : rien.

Mais ce test etait impraticable a la main. Mesure du 11/09 : 3 tentatives perdues a vouloir
tester `moteur-visuel-gate.sh` depuis Bash — la commande de TEST contenait le motif surveille
(`cat > X.tsx`), donc le gate bloquait le test lui-meme. Meme un heredoc python qui GENERE le
cas se fait bloquer.

La parade : passer le cas au hook par STDIN depuis un fichier Python, jamais par une commande
Bash qui contient le motif. C'est ce que fait ce script.

USAGE
-----
  python3 scripts/tools/test-gate.py <hook.sh> --passe "<cmd>" --bloque "<cmd>" [...]

  # Repeter --passe / --bloque autant de fois que necessaire.
  python3 scripts/tools/test-gate.py .claude/hooks/git-destructif-gate.sh \\
      --bloque "git stash" --bloque "git reset --hard HEAD~1" \\
      --passe  "git status" --passe "git stash list"

  # Cas contenant un motif surveille : passer par --fichier (une ligne = un cas,
  # prefixee de "PASSE " ou "BLOQUE "), pour qu'il ne transite jamais par argv.
  python3 scripts/tools/test-gate.py <hook.sh> --fichier cas.txt

Exit 0 si tous les cas se comportent comme attendu, 1 sinon.

⛔ Un gate teste seulement sur l'etat courant — forcement sain, sinon on l'aurait corrige —
ne prouve rien. Toujours fournir au moins un cas --bloque.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def joue(hook: str, cmd: str, tool: str = "Bash") -> tuple[str, str]:
    """Envoie un cas au hook par stdin. Retourne (verdict, stderr)."""
    champ = "command" if tool == "Bash" else "file_path"
    payload = json.dumps({"tool_name": tool, "tool_input": {champ: cmd}})
    try:
        p = subprocess.run(["bash", hook], input=payload,
                           capture_output=True, text=True, timeout=30)
    except subprocess.TimeoutExpired:
        return "TIMEOUT", ""
    # exit 2 = bloque (convention Claude Code) ; une sortie JSON "decision":"block" aussi.
    bloque = p.returncode != 0 or '"block"' in (p.stdout or "")
    return ("BLOQUE" if bloque else "PASSE"), (p.stderr or p.stdout or "").strip()


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("hook", help="chemin du hook a eprouver")
    ap.add_argument("--passe", action="append", default=[], metavar="CMD",
                    help="cas qui DOIT passer (repetable)")
    ap.add_argument("--bloque", action="append", default=[], metavar="CMD",
                    help="cas qui DOIT etre bloque (repetable)")
    ap.add_argument("--fichier", help="fichier de cas : une ligne = 'PASSE <cmd>' ou 'BLOQUE <cmd>'")
    ap.add_argument("--tool", default="Bash", help="tool_name simule (defaut: Bash)")
    ap.add_argument("-v", "--verbose", action="store_true", help="afficher le motif de blocage")
    a = ap.parse_args()

    if not Path(a.hook).exists():
        print(f"⛔ hook introuvable : {a.hook}", file=sys.stderr)
        return 1

    cas = [("PASSE", c) for c in a.passe] + [("BLOQUE", c) for c in a.bloque]
    if a.fichier:
        for ligne in Path(a.fichier).read_text(encoding="utf-8").splitlines():
            ligne = ligne.strip()
            if not ligne or ligne.startswith("#"):
                continue
            attendu, _, cmd = ligne.partition(" ")
            if attendu in ("PASSE", "BLOQUE") and cmd:
                cas.append((attendu, cmd))

    if not cas:
        print("⛔ aucun cas fourni (--passe / --bloque / --fichier).", file=sys.stderr)
        return 1
    if not any(a_ == "BLOQUE" for a_, _ in cas):
        print("⚠️  aucun cas --bloque : ce test ne prouve PAS que le gate sait se declencher.",
              file=sys.stderr)

    echecs = 0
    for attendu, cmd in cas:
        reel, motif = joue(a.hook, cmd, a.tool)
        ok = reel == attendu
        echecs += not ok
        print(f"  {'OK ' if ok else '!! '} attendu={attendu:6s} reel={reel:6s} | {cmd[:60]}")
        if a.verbose and motif:
            print(f"       {motif.splitlines()[0][:100]}")

    total = len(cas)
    print(f"\n{total - echecs}/{total} conformes." if echecs else f"\n{total}/{total} conformes.")
    return 1 if echecs else 0


if __name__ == "__main__":
    sys.exit(main())
