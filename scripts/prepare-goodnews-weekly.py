"""
prepare-goodnews-weekly.py — Étape 1 du pipeline carrousel Good News (SEMI-AUTO).

Lance last30days sur 7 jours (économie/géopo macro Afrique), sauvegarde la recherche
brute, et génère un FICHIER DE TRAVAIL que Claude remplira ensuite :
  - candidats "bonnes nouvelles à impact macro mondial"
  - brief de sélection (critères + structure carousel-data.ts à remplir)

Le jugement éditorial + factuel (choisir/vérifier/rédiger les 3 nouvelles) reste
fait par Claude EN SESSION à partir de ce fichier — pas automatisé (anti-hallucination).

Usage :
  python3 scripts/prepare-goodnews-weekly.py
  python3 scripts/prepare-goodnews-weekly.py --days 14   # fenêtre plus large

Sortie :
  out/_r-and-d/good-news/weekly/research-<date>-raw.md   (recherche brute last30days)
  out/_r-and-d/good-news/weekly/BRIEF-<date>.md          (fichier de travail Claude)
"""
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out/_r-and-d/good-news/weekly"
OUT.mkdir(parents=True, exist_ok=True)

DAYS = 7
if "--days" in sys.argv:
    DAYS = int(sys.argv[sys.argv.index("--days") + 1])

# Date du jour (script Python normal — pas de contrainte workflow ici)
TODAY = datetime.now(timezone.utc)
DATE = TODAY.strftime("%Y-%m-%d")
WEEK = TODAY.strftime("%Y-W%V")

TOPIC = (
    "Afrique bonnes nouvelles economie technologie energie infrastructure investissement "
    "innovation - avancees positives a impact macro mondial - derniers jours"
)

# Localiser le skill last30days
SKILL = None
for cand in [
    Path.home() / ".claude/skills/last30days/scripts/last30days.py",
    Path.home() / ".agents/skills/last30days/scripts/last30days.py",
    Path.home() / ".codex/skills/last30days/scripts/last30days.py",
]:
    if cand.exists():
        SKILL = cand
        break

raw_path = OUT / f"research-{DATE}-raw.md"
brief_path = OUT / f"BRIEF-{DATE}.md"


def run_research():
    if not SKILL:
        print("⚠️ last30days introuvable — brief généré sans recherche auto.")
        return "(recherche non lancée : skill last30days absent)"
    print(f"[last30days] recherche {DAYS}j sur : {TOPIC[:60]}...")
    try:
        proc = subprocess.run(
            ["python3", str(SKILL), TOPIC, f"--days={DAYS}", "--emit=compact", "--no-native-web"],
            capture_output=True, text=True, timeout=300,
        )
        out = proc.stdout
        raw_path.write_text(out, encoding="utf-8")
        print(f"[last30days] sauvé → {raw_path}")
        return out
    except Exception as e:
        print(f"⚠️ recherche échouée : {e}")
        return f"(recherche échouée : {e})"


BRIEF_TEMPLATE = """# BRIEF Carrousel Good News — semaine {week} ({date})

> Généré par `prepare-goodnews-weekly.py`. **À traiter par Claude EN SESSION.**
> Recherche brute complète : `research-{date}-raw.md`

## Ta mission (Claude)

1. **Lire** la recherche brute + compléter par WebSearch si besoin (sources fiables).
2. **Sélectionner 3 bonnes nouvelles** africaines de la semaine répondant aux critères ci-dessous.
3. **Vérifier chaque fait** (chiffre, date, acteur) — JAMAIS publier un chiffre non sourcé.
4. **Rédiger** et remplir une nouvelle entrée `GoodNewsEdition` dans
   `src/projects/souverain/carousels/good-news/carousel-data.ts`, puis pointer `CURRENT_EDITION` dessus.
5. Render (preview + 8 slides), ajouter musique, publier via les scripts Postiz.

## Critères de sélection (NON-NEGOTIABLE)

- **Bonne nouvelle** : avancée, contrat, innovation, infrastructure, record positif. PAS de crise/conflit (réservé au flux analytique).
- **Angle MACRO** : la nouvelle doit avoir un impact MESURABLE hors d'Afrique (Europe/Asie/Amérique). Le "pourquoi le monde regarde" doit être réel, pas forcé.
- **Factuel** : chiffre ou fait précis et vérifiable. Une nouvelle floue = écartée.
- **Variété de briques** : viser 1 chiffre (gauge), 1 classement/comparaison (bars), 1 géographie (map) si possible — sinon adapter.
- **Diversité géographique** : éviter 3 nouvelles du même pays.

## Structure à remplir (rappel carousel-data.ts)

Chaque nouvelle = `fact` (brique gauge/bars/map + body) + `macro` (flow source→cible + body).
Icônes flow disponibles : factory, plane, zap, server, droplets, wind, leaf, cpu, globe.
Hook : titre accrocheur + sous-titre "Le continent ne reçoit plus. Il fournit." (ou variation).
CTA : "Clique sur notre photo de profil pour suivre @koraetcartes".

## Anti-pièges

- Ne PAS inventer de corridor/route géographique pour la brique map si la nouvelle ne s'y prête pas.
- Ne PAS forcer l'angle macro si l'impact mondial est anecdotique → choisir une autre nouvelle.
- Ton premium éditorial (Monocle/Economist), jamais naïf.

---

## Recherche brute (extrait last30days {days}j)

{research}
"""


def main():
    research = run_research()
    # Tronquer la recherche dans le brief (le raw complet est dans l'autre fichier)
    snippet = research[:6000] + ("\n\n[...tronqué, voir research-*-raw.md]" if len(research) > 6000 else "")
    brief = BRIEF_TEMPLATE.format(week=WEEK, date=DATE, days=DAYS, research=snippet)
    brief_path.write_text(brief, encoding="utf-8")
    print(f"\n✅ Brief prêt → {brief_path}")
    print("\nProchaine étape (Claude en session) :")
    print(f"  1. Lire {brief_path.name}")
    print("  2. Sélectionner + vérifier 3 bonnes nouvelles macro")
    print("  3. Remplir carousel-data.ts (nouvelle GoodNewsEdition + CURRENT_EDITION)")
    print("  4. Render + musique + publication Postiz")


if __name__ == "__main__":
    main()
