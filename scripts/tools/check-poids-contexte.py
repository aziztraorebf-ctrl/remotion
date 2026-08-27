#!/usr/bin/env python3
"""
check-poids-contexte.py — le garde-fou qui empeche la memoire de DERIVER.

LE PROBLEME (diagnostic mesure le 2026-08-27)
---------------------------------------------
La chaine de demarrage (fichiers lus AVANT la premiere question d'Aziz) pesait
199 Ko / ~62k tokens. On compactait religieusement MEMORY.md (22 Ko, deja dans
les clous) pendant que NEXT-ACTION.md, charge dans la meme foulee, atteignait
63 Ko sans aucun plafond. L'effort portait sur 11 % du poids reel.

Historique git de NEXT-ACTION : un cycle en dents de scie.
  05 juil 49 Ko -> 29 juil 106 Ko -> 01 aout 15 Ko (purge manuelle) -> 26 aout 63 Ko
Le fichier gonfle 3-4 semaines, atteint un point de douleur, quelqu'un le purge
a la main, et ca repart. 225 commits.

La regle d'eviction EXISTE, ecrite en bas de NEXT-ACTION lui-meme :
  « Un projet TERMINE se SUPPRIME de ce fichier [...] git la conserve. »
Elle n'a jamais tenu. C'est le pattern deja documente en memoire :
`feedback_regle-ecrite-insuffisante-sans-gate-outille`.

Le workspace avait un gate pour la CAPITALISATION (check-capitalisation.py,
cote entree) et AUCUN pour l'EVICTION (cote sortie). Ce script comble ce trou.

CE QUE FAIT CE SCRIPT
---------------------
Il mesure les fichiers de la chaine de demarrage, les compare a un seuil, et
signale la derive AU DEMARRAGE — au moment ou on peut encore agir, pas en
cloture. Il signale aussi les sections closes qui trainent dans les fichiers
d'action (le symptome le plus courant de la derive).

Il ne bloque RIEN. Il informe. Comme check-capitalisation.py.
"""

import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
CLAUDE_HOME = Path.home() / ".claude"
PROJ_MEM = CLAUDE_HOME / "projects" / "-Users-clawdbot-Workspace-remotion" / "memory"

# (chemin, seuil_octets, plafond_dur_ou_None)
# MEMORY.md : plafond SYSTEME a 25000 o / 200 lignes, troncature SILENCIEUSE au-dela.
CHAINE = [
    # 34 Ko : CLAUDE.md est le SEUL fichier charge dans les subagents (MEMORY.md ne l'est
    # pas). Il accueille donc les GATES migres le 2026-08-27 — ce poids est un transfert
    # depuis MEMORY.md, pas une derive. Vraie limite technique : 4 MiB. Le garde-fou reel
    # ici est le nombre de LIGNES (adherence < 200), suivi ci-dessous.
    (REPO / "CLAUDE.md", 34000, None),
    (CLAUDE_HOME / "CLAUDE.md", 18000, None),
    (PROJ_MEM / "MEMORY.md", 20000, 25000),
    (REPO / "memory" / "NEXT-ACTION.md", 35000, None),
    (REPO / "memory" / "ROUTAGE.md", 40000, None),
    (REPO / ".claude" / "agent-memory" / "shared" / "PIPELINE.md", 25000, None),
]

# Budget total de la chaine de demarrage.
BUDGET_TOTAL = 175000

# Fichiers ou une section close ne doit PAS trainer (fichiers d'ACTION).
FICHIERS_ACTION = [
    REPO / "memory" / "NEXT-ACTION.md",
    REPO / ".claude" / "agent-memory" / "shared" / "PIPELINE.md",
]
MARQUEURS_CLOS = ("✅", "ABANDONN", "LIVRÉE", "LIVREE", "RÉSOLU", "RESOLU",
                  "CONCLUE", "[COMPLETE]", "FAIT PAR")


def tokens(n_car: int) -> int:
    """Approximation : ~3.2 caracteres par token en francais dense markdown."""
    return round(n_car / 3.2)


def sections_closes(path: Path) -> list[str]:
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding="utf-8").split("\n"):
        if line.startswith("## ") and any(m in line for m in MARQUEURS_CLOS):
            out.append(line[3:].strip()[:70])
    return out


# Plafond par SECTION de MEMORY.md (octets). La borne force l'arbitrage — c'est
# l'effet utile de la « fenetre glissante » du retour d'experience public, mais
# indexee sur le SUJET et non sur la DATE : ici l'index est thematique, l'age ne
# predit pas la valeur (agents-paralleles date de juillet et reste vital).
SECTIONS_MEMORY = {
    "Méthode & feedbacks-clés": 8000,
    "Projets actifs": 4000,
    "SVG, outils & workflows": 4000,
}
# Une ligne d'index = un POINTEUR (nom + chemin + declencheur), pas un resume.
# ⛔ NE PAS mesurer la longueur BRUTE : verifie le 2026-08-27, sur 31 lignes de
# plus de 300 o, 12 etaient des LISTES DE POINTEURS legitimes (jusqu'a 12 refs
# sur une ligne) — les raccourcir aurait supprime des entrees, soit exactement
# le mauvais geste. Ce qui distingue un index d'un resume est la DENSITE :
# combien d'octets par reference. Une liste dense est saine a 500 o ; une ligne
# de 350 o avec une seule reference est du contenu qui appartient au fichier pointe.
LIGNE_MAX = 320          # plancher : en dessous, on ne regarde meme pas
OCTETS_PAR_REF_MAX = 160  # au-dela = du texte explicatif, pas un index


def memory_sections_hors_borne() -> list[str]:
    """Sections de MEMORY.md au-dela de leur plafond, et lignes trop longues.

    POURQUOI (mesure du 2026-08-27) : MEMORY.md etait a 92 % du cap OCTETS mais
    seulement 52 % du cap LIGNES — 224 o/ligne de moyenne. La contrainte n'est
    donc PAS le nombre d'entrees mais leur LONGUEUR : le bon geste est de
    raccourcir, pas de supprimer. Croissance mesuree : ~217 o/jour.
    """
    mem = PROJ_MEM / "MEMORY.md"
    if not mem.exists():
        return []
    out = []
    cur, buf = None, 0
    longues = []
    for line in mem.read_text(encoding="utf-8").split("\n"):
        if line.startswith("## "):
            if cur and buf > SECTIONS_MEMORY.get(cur, 10 ** 9):
                out.append(f"section « {cur[:38]} » : {buf} o "
                           f"(plafond {SECTIONS_MEMORY[cur]})")
            titre = line[3:].strip()
            cur = next((k for k in SECTIONS_MEMORY if k in titre), None)
            buf = 0
        buf += len(line.encode()) + 1
        if len(line.encode()) > LIGNE_MAX and not line.startswith("#"):
            refs = (len(re.findall(r"[a-z0-9]+(?:-[a-z0-9]+){2,}", line))
                    + len(re.findall(r"`[^`]+\.(?:md|py|sh|tsx)`", line)))
            if len(line.encode()) / max(refs, 1) > OCTETS_PAR_REF_MAX:
                longues.append((len(line.encode()), refs))
    if cur and buf > SECTIONS_MEMORY.get(cur, 10 ** 9):
        out.append(f"section « {cur[:38]} » : {buf} o (plafond {SECTIONS_MEMORY[cur]})")
    if longues:
        out.append(f"{len(longues)} ligne(s) peu denses (> {OCTETS_PAR_REF_MAX} o/ref) "
                   f"— du CONTENU a deplacer vers le fichier pointe, pas des entrees a supprimer")
    return out


def mentions_orphelines() -> list[str]:
    """Les noms de feedbacks cites NUS dans MEMORY.md (sans lien markdown).

    ANGLE MORT DE check-links.py : il ne verifie que les CHEMINS ecrits en
    toutes lettres. Un nom nu comme `globe-d3-briques-exactes-pas-variante-maison`
    n'est pas un chemin — il passait donc au vert alors que 14 mentions sur 43
    ne correspondaient a AUCUN fichier (constate le 2026-08-27 : des abreviations
    du nom reel, ecrites de memoire). Rien n'etait perdu, mais un grep exact
    echouait et l'index devenait trompeur.
    """
    mem = PROJ_MEM / "MEMORY.md"
    if not mem.exists():
        return []
    stems = set()
    for root in (PROJ_MEM, REPO / "memory"):
        if root.exists():
            for f in root.rglob("*.md"):
                stems.add(f.stem)
                stems.add(f.stem.replace("feedback_", ""))
    txt = mem.read_text(encoding="utf-8")
    orphelins = []
    for line in txt.split("\n"):
        if not line.strip().startswith("- "):
            continue
        s = re.sub(r"\[[^\]]*\]\([^)]*\)", "", line)   # retire les liens markdown
        s = re.sub(r"`[^`]*`", "", s)                    # retire les chemins en backticks
        for m in re.findall(r"(?<![\w/.-])([a-z0-9]+(?:-[a-z0-9]+){2,})(?![\w/.-])", s):
            if re.match(r"^\d{4}-\d{2}-\d{2}$", m):
                continue
            # faux positifs : du francais courant qui ressemble a du kebab-case
            # ("retention seconde-par-seconde", "gotcha texte-au-lieu-d'image").
            # Un nom de feedback fait au moins 4 segments ; le francais courant, 3.
            if m.count("-") < 3:
                continue
            # une apostrophe colle au motif = du francais, pas un nom de fichier
            # ("texte-au-lieu-d'image" -> le motif capture "texte-au-lieu-d")
            if re.search(re.escape(m) + r"['\u2019]", s):
                continue
            if m not in stems and f"feedback_{m}" not in stems:
                orphelins.append(m)
    return orphelins


def main() -> int:
    alertes, infos = [], []
    total = 0

    for path, seuil, plafond in CHAINE:
        if not path.exists():
            infos.append(f"  ? introuvable : {path}")
            continue
        taille = path.stat().st_size
        total += taille
        nom = path.name if path.name != "CLAUDE.md" else (
            "CLAUDE.md (projet)" if path.is_relative_to(REPO) else "CLAUDE.md (global)")

        if plafond and taille > plafond:
            alertes.append(
                f"  ⛔ {nom} : {taille} o — DEPASSE LE PLAFOND DUR {plafond} o. "
                f"TRONCATURE SILENCIEUSE en cours.")
        elif plafond and taille > plafond * 0.88:
            alertes.append(
                f"  ⚠️  {nom} : {taille} o — approche le plafond dur ({plafond} o).")
        elif taille > seuil:
            alertes.append(
                f"  ⚠️  {nom} : {taille} o (seuil {seuil}) — +{taille - seuil} o a evincer.")

    for path in FICHIERS_ACTION:
        closes = sections_closes(path)
        if closes:
            alertes.append(
                f"  ⚠️  {path.name} : {len(closes)} section(s) CLOSE(S) a evincer —")
            for s in closes[:4]:
                alertes.append(f"        · {s}")
            if len(closes) > 4:
                alertes.append(f"        · … et {len(closes) - 4} autre(s)")

    claude = REPO / "CLAUDE.md"
    if claude.exists():
        n = claude.read_text(encoding="utf-8").count("\n") + 1
        if n > 200:
            alertes.append(f"  ⚠️  CLAUDE.md : {n} lignes — au-dela de ~200 l'adherence baisse "
                           f"(doc officielle). Deplacer vers une doctrine pointee.")

    for m in memory_sections_hors_borne():
        alertes.append(f"  ⚠️  MEMORY.md : {m}")

    orph = mentions_orphelines()
    if orph:
        alertes.append(
            f"  ⚠️  MEMORY.md : {len(orph)} mention(s) NUE(S) sans fichier correspondant "
            f"(angle mort de check-links) —")
        for m in orph[:5]:
            alertes.append(f"        · {m}")
        if len(orph) > 5:
            alertes.append(f"        · … et {len(orph) - 5} autre(s)")

    if total > BUDGET_TOTAL:
        alertes.insert(0, (
            f"  ⛔ CHAINE DE DEMARRAGE : {total} o (~{tokens(total)} tokens) "
            f"— budget {BUDGET_TOTAL} o depasse de {total - BUDGET_TOTAL} o."))

    if not alertes:
        print(f"check-poids-contexte : OK — chaine de demarrage {total} o "
              f"(~{tokens(total)} tokens), sous le budget de {BUDGET_TOTAL} o.")
        return 0

    print("=" * 68)
    print("POIDS DU CONTEXTE — derive detectee")
    print("=" * 68)
    for a in alertes:
        print(a)
    print()
    print(f"  Chaine de demarrage : {total} o (~{tokens(total)} tokens)")
    print()
    print("  ⛔ Regle (NEXT-ACTION.md, jamais appliquee en continu jusqu'au 27/08) :")
    print("     « Un projet TERMINE se SUPPRIME de ce fichier — git la conserve. »")
    print("  Une section close se supprime ; un chantier OUVERT enterre sous un titre")
    print("  coche s'EXTRAIT vers son propre fichier (cf. memory/projects/CHANTIER-FMI.md).")
    print("=" * 68)
    return 0


if __name__ == "__main__":
    sys.exit(main())
