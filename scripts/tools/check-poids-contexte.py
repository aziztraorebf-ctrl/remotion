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
#
# ⛔ SOURCE DE VERITE : memory/BUDGET.md. Ce script APPLIQUE la politique, il ne la
# definit pas. Toute revision se decide dans BUDGET.md D'ABORD, puis se reporte ici.
#
# ⚠️ NE PAS CONFONDRE DEUX PLAFONDS DIFFERENTS (amalgame corrige le 2026-09-08) :
#   - plafond SYSTEME  : ~25000 o / 200 lignes pour MEMORY.md. Au-dela, Claude Code
#     tronque SILENCIEUSEMENT a chaque chargement. C'est une limite technique subie.
#   - plafond POLITIQUE : 15000 o (MEMORY.md) et 20480 o (NEXT-ACTION.md). C'est NOTRE
#     choix — le juste milieu entre "leger" et "bordel" — plus strict que le systeme,
#     et c'est LUI qu'on applique ici.
#
# Aligne le 2026-09-08 : le code portait encore 20000/25000 (MEMORY) et 35000/aucun
# (NEXT-ACTION) alors qu'un commentaire annoncait deja l'alignement. Le commentaire
# disait vrai, le code disait autre chose — et c'est le code qui s'execute.
# Consequence mesuree : NEXT-ACTION a 25510 o violait la politique de 25 % sans
# declencher un mot. Un instrument de mesure qui ment = un plafond qui n'existe pas.
CHAINE = [
    # 34 Ko : CLAUDE.md est le SEUL fichier charge dans les subagents (MEMORY.md ne l'est
    # pas). Il accueille donc les GATES migres le 2026-08-27 — ce poids est un transfert
    # depuis MEMORY.md, pas une derive. Vraie limite technique : 4 MiB. Le garde-fou reel
    # ici est le nombre de LIGNES (adherence < 200), suivi ci-dessous.
    (REPO / "CLAUDE.md", 34000, None),
    (CLAUDE_HOME / "CLAUDE.md", 18000, None),
    (PROJ_MEM / "MEMORY.md", 12000, 15000),        # BUDGET.md : alerte 80%, dur 15000
    (REPO / "memory" / "NEXT-ACTION.md", 16384, 20480),  # BUDGET.md : alerte 80%, dur 20480
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
MARQUEURS_CLOS = ("✅", "🏁", "ABANDONN", "LIVRÉE", "LIVREE", "RÉSOLU", "RESOLU",
                  "TERMINÉ", "TERMINE", "CLOS", "CONCLUE", "[COMPLETE]", "FAIT PAR")


def tokens(n_car: int) -> int:
    """Approximation : ~3.2 caracteres par token en francais dense markdown."""
    return round(n_car / 3.2)


def sections_closes(path: Path) -> list[str]:
    """Titres de section portant un marqueur de cloture, dans un fichier d'ACTION.

    ⛔ ANGLE MORT CORRIGE LE 2026-09-11. Le test etait `line.startswith("## ")`,
    qui ne matche QUE le niveau 2 : `"### "` ne commence pas par `"## "` (le 3e
    caractere est un '#', pas une espace). Or dans PIPELINE.md les sections de
    projet sont toutes en `###`. Consequence mesuree : 7 sections closes depuis
    4 a 6 semaines (7 787 o, 31 % du fichier) n'ont JAMAIS ete signalees, et le
    fichier a continue de grossir en en accumulant une 8e.
    Le gate existait, la regle existait — l'instrument ne regardait pas au bon
    niveau. Un gate qu'on n'a pas vu se declencher sur un cas reel n'est pas
    un gate teste.
    """
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding="utf-8").split("\n"):
        if not line.startswith("##"):        # H2, H3, H4...
            continue
        titre = line.lstrip("#").strip()
        if any(m in line for m in MARQUEURS_CLOS):
            out.append(titre[:70])
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

    ETENDU le 2026-09-08 a TOUS les index de memoire, pas seulement MEMORY.md :
    ce jour-la, 10 lecons citees comme acquises n'existaient sur AUCUN chemin de
    master (elles vivaient sur des branches non mergees), dont
    `tester-le-script-nest-pas-tester-le-branchement` — cite en top-3 de MEMORY.md
    ET repris dans INDEX-FEEDBACKS-METHODE.md. Trois citations concordantes, zero
    fichier : chaque index faisait confiance aux autres. Un index de memoire est un
    catalogue comme un autre, et il ment de la meme facon.

    ⛔ CETTE HYPOTHESE N'EST PLUS LA SEULE CAUSE (mesure 2026-09-07). MEMORY.md vit
    HORS du repo (~/.claude/projects/...), donc COMMUN a toutes les branches, alors
    que memory/feedbacks/ vit DANS le repo, donc PAR BRANCHE. L'index reference
    l'union de ce qui a ete appris ; le worktree courant n'en porte qu'une
    intersection. Les 14 orphelins mesures ce jour-la existaient TOUS sur 2 a 6
    autres branches (3 sur master) — rien n'etait perdu, et les supprimer de
    MEMORY.md aurait detruit la seule trace d'un savoir vivant ailleurs.

    D'ou la separation en 2 catégories : ABSENT PARTOUT (vraie alerte, le nom est
    faux) vs SUR UNE AUTRE BRANCHE (le contenu existe, c'est la branche qui est en
    retard). Ne jamais pousser a supprimer la 2e categorie.
    """
    cibles = [
        PROJ_MEM / "MEMORY.md",
        REPO / "memory" / "INDEX-FEEDBACKS-METHODE.md",
        REPO / "memory" / "ROUTAGE.md",
    ]
    cibles = [c for c in cibles if c.exists()]
    if not cibles:
        return []
    stems = set()
    for root in (PROJ_MEM, REPO / "memory"):
        if root.exists():
            for f in root.rglob("*.md"):
                stems.add(f.stem)
                stems.add(f.stem.replace("feedback_", ""))
    orphelins = []
    for cible in cibles:
        txt = cible.read_text(encoding="utf-8")
        prefixe = "" if cible.name == "MEMORY.md" else f"{cible.name}: "
        orphelins.extend(_orphelins_du_texte(txt, stems, prefixe))
    return orphelins


def _orphelins_du_texte(txt: str, stems: set, prefixe: str = "") -> list[str]:
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
                orphelins.append(prefixe + m)
    return orphelins


def branches_portant(nom: str) -> list[str]:
    """Les branches locales qui portent feedback_<nom>.md, branche courante exclue.

    Sert a distinguer « le nom est faux » (absent partout) de « la branche est en
    retard » (present ailleurs). Voir le docstring de mentions_orphelines().
    """
    chemin = f"memory/feedbacks/feedback_{nom}.md"
    try:
        refs = subprocess.run(
            ["git", "for-each-ref", "--format=%(refname:short)", "refs/heads/"],
            cwd=REPO, capture_output=True, text=True, timeout=10)
        if refs.returncode != 0:
            return []
        porteuses = []
        for b in refs.stdout.split():
            r = subprocess.run(["git", "cat-file", "-e", f"{b}:{chemin}"],
                               cwd=REPO, capture_output=True, timeout=10)
            if r.returncode == 0:
                porteuses.append(b)
        return porteuses
    except (subprocess.SubprocessError, OSError):
        return []


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
            # ⚠️ Ne PAS dire "troncature silencieuse" ici : ce plafond est celui de
            # NOTRE politique (BUDGET.md), pas la limite technique. La troncature
            # systeme n'arrive que vers 25000 o / 200 lignes, et sur MEMORY.md seul.
            # Amalgame corrige le 2026-09-08 apres correction d'Aziz.
            sys_warn = (" ⚠️ Au-dela de ~25000 o, le systeme tronque EN PLUS silencieusement."
                        if nom == "MEMORY.md" and taille > 25000 else "")
            alertes.append(
                f"  ⛔ {nom} : {taille} o — DEPASSE LE PLAFOND DUR {plafond} o "
                f"(politique BUDGET.md).{sys_warn}")
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
        # Trier : le contenu existe-t-il sur une AUTRE branche ? Sans ce tri, le
        # message poussait a supprimer des lignes indexant un savoir bien vivant.
        ailleurs: dict[str, list[str]] = {}
        introuvables: list[str] = []
        for m in orph:
            br = branches_portant(m)
            if br:
                ailleurs[m] = br
            else:
                introuvables.append(m)

        if introuvables:
            alertes.append(
                f"  ⚠️  MEMORY.md : {len(introuvables)} mention(s) NUE(S) introuvable(s) "
                f"SUR TOUTE BRANCHE — le nom est probablement faux :")
            for m in introuvables[:5]:
                alertes.append(f"        · {m}")
            if len(introuvables) > 5:
                alertes.append(f"        · … et {len(introuvables) - 5} autre(s)")

        if ailleurs:
            alertes.append(
                f"  ℹ️  MEMORY.md : {len(ailleurs)} mention(s) dont le fichier existe SUR UNE "
                f"AUTRE BRANCHE (branche courante en retard) —")
            for m, br in list(ailleurs.items())[:3]:
                alertes.append(f"        · {m} → {br[0]}"
                               + (f" (+{len(br) - 1})" if len(br) > 1 else ""))
            if len(ailleurs) > 3:
                alertes.append(f"        · … et {len(ailleurs) - 3} autre(s)")
            alertes.append(
                "     ⛔ NE PAS supprimer ces lignes : le savoir existe, c'est la branche "
                "qui est en retard.")
            alertes.append(
                "     Recuperer sans rien ecraser : "
                "git show <branche>:<chemin> > <chemin>")

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
