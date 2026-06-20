#!/usr/bin/env python3
"""
mapbox-session.py — Orchestrateur de production Beat MAPBOX (Shorts Souverain carte animee)

Systeme miroir de beat-session.py, mais pour les beats CARTE (getCam, overlays, 1 Map continue).
Routage CLAUDE.md : "Coder un beat / Short Souverain MAPBOX".

Pipeline (6 phases, discipline scoree, MAX 2 appels Gemini) :
  1. storyboard   → storyboard d'evolution (le modele PROPOSE, doctrine STORYBOARD-MAPBOX) + Production Brief. VALIDE PAR AZIZ.
  1b. breakdown   → decode la direction VALIDEE en plan technique (JSON par etat, champs anti-rigidite). Le pont vers le code.
  2. code         → Claude ecrit getCam() + ShortOverlays dans le fichier UNIQUE (etape manuelle)
  3. self-review  → assertions scriptees BLOQUANTES (--file requis) + checklist Mapbox cochee AVANT Gemini
  4. review       → gemini-mapbox-review.py → JSON score CONSULTATIF (jamais juge). 1 SEUL appel.
  5. corrections  → appliquer fix_code + ameliorations, iterer SANS nouvel appel Gemini (etape manuelle)
  6. upload       → catbox + presenter a Aziz (decisions de gout)

Usage :
  python3 scripts/mapbox-session.py --episode maroc-batteries --acte A2 --phase storyboard
  python3 scripts/mapbox-session.py --episode maroc-batteries --acte A2 --phase self-review --video out/episodes/maroc-batteries/wip/animatic_a2_v1.mp4
  python3 scripts/mapbox-session.py --episode maroc-batteries --acte A2 --phase review --video <mp4>
  python3 scripts/mapbox-session.py --episode maroc-batteries --acte A2 --phase upload --video <mp4>
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
REVIEW_SCRIPT = SCRIPTS_DIR / "tools" / "gemini-mapbox-review.py"

# Pas de SEUIL_GLOBAL : Gemini = SIGNAL CONSULTATIF, jamais juge (voir phase_review).
# Le jugement d'Aziz prime sur le score. Pas de verdict automatique.

# ── Checklist self-review Mapbox (cocher AVANT l'appel Gemini) ──────────────────
SELF_REVIEW_MAPBOX = [
    "Camera frame-driven uniquement (jumpTo) — aucun flyTo/easeTo",
    "Zoom toujours dans les bornes [2.0, 14.0]",
    "Pas de clipping/buffering visible au zoom rapide (tuiles chargees)",
    "Aucune collision de labels (markers DOM qui se chevauchent en vue large)",
    "Anti-gris : zone/highlight/frontieres habillent le vide negatif",
    "R1 : aucun plan statique > 8s (drift/orbit continu)",
    "Overlays ancres via map.project() sur coords geo reelles",
    "Layers verifies avec getLayer() avant setPaintProperty",
    "Fond navy #16213a (jamais #000000)",
    "SFX : volumes mix respectes (UI 0.25-0.35, cine 0.40-0.55, musique 0.15)",
    "SFX : triggers en frames globales (F.AX_START + frame_local)",
    "Stat/texte integre (pas 'PowerPoint' plein ecran qui ecrase la carte)",
]
SEUIL_SELF = 10  # sur 12


def ntfy(event: str, msg: str, url: str = "") -> None:
    script = SCRIPTS_DIR / "ntfy-notify.sh"
    if script.exists():
        try:
            subprocess.run([str(script), event, msg, url], check=False, timeout=15)
        except Exception:
            print(f"[ntfy] {event} — {msg} {url}")
    else:
        print(f"[ntfy] {event} — {msg} {url}")


def find_brief(episode: str) -> Path:
    base = PROJECT_ROOT / "memory" / "episodes" / "souverain"
    # chemin direct prioritaire
    direct = base / episode / "PRODUCTION-BRIEF.md"
    if direct.exists():
        return direct
    # sinon : tout dossier commencant par <episode> (ex: <episode>-kenitra, vestige Maroc)
    if base.exists():
        for d in sorted(base.glob(f"{episode}*")):
            cand = d / "PRODUCTION-BRIEF.md"
            if cand.exists():
                return cand
    return direct


def phase_storyboard(episode: str, acte: str) -> None:
    print(f"\n{'='*60}\nPHASE 1 — STORYBOARD (Production Brief) — {episode} {acte}\n{'='*60}")
    brief = find_brief(episode)
    if not brief.exists():
        print(f"[STOP] Production Brief absent : {brief}")
        print("Creer le Production Brief (Camera + Overlays + SFX par acte) AVANT de coder.")
        ntfy("blocked", f"{episode} {acte} : Production Brief manquant")
        sys.exit(1)
    print(f"[OK] Production Brief : {brief.relative_to(PROJECT_ROOT)}")
    print("\n>>> ETAPE 1 — CATALOGUE templates carte vivante (PIOCHER ET COMBINER en priorite) :")
    print(">>>   src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md")
    print(">>>   = templates prets (hooks/combos/inserts/territoire/dynamiques/sequentiel).")
    print(">>>   LIRE AVANT de composer : reutiliser un template existant > coder from scratch.")
    print("\n>>> COMPLEMENTARITE EXTERNE (CQC) — checklist de FINITION, PAS de production :")
    print(">>>   ⚠️ NE PAS ajouter d'elements pour 'remplir'. Notre playbook a deja l'essentiel.")
    print(">>>   APRES que la scene est bonne : une variation COULEUR / FRONTIERE / CAMERA / objet")
    print(">>>   l'enrichirait-elle, LISIBLEMENT, EN SUIVANT LA VOIX ? Sinon ne rien ajouter.")
    print(">>>   3 garde-fous ABSOLUS : (1) suit la voix, (2) lisible, (3) sequentiel pas metronome.")
    print(">>>   Lecon test A5 : 'mieux voir peu que voir enormement'. Voir Playbook section 2bis.")
    print(">>>   Source a la demande : memory/_r-and-d-mapanimation-PREMIUM-DECODE.md")
    print("\n>>> ETAPE 2 — STORYBOARD D'EVOLUTION (le modele PROPOSE la direction, doctrine complete) :")
    print(">>>   memory/doctrines/STORYBOARD-MAPBOX.md — preambule 4 couches a JOINDRE au generateur :")
    print(">>>   [1] NOTRE carte (frame ref selon pilier) [2] chaines de ref citees par NOM")
    print(">>>   [3] directive CARTE VIVANTE + interdits (pas de 3D AE) [4] intention (1 verbe) + narration.")
    print(">>>   Outil : scripts/tools/storyboard-dual-gen.py (Gemini + GPT) → multi-etats DEBUT→FIN, epure.")
    print(">>>   La geo du storyboard est APPROXIMATIVE = OK (vraie geo au CODE).")
    print("\n>>> AFFICHER le storyboard (+ Production Brief) a Aziz et OBTENIR validation de la DIRECTION.")
    print(">>> On ne decode PAS une direction non validee.")
    print("\nApres validation Aziz → --phase breakdown (decode la direction en plan technique) → code.")


def phase_breakdown(episode: str, acte: str) -> None:
    """Pont storyboard VALIDE -> code. Le breakdown TRANSCRIT la direction, il ne CREE pas."""
    print(f"\n{'='*60}\nPHASE 2 — BREAKDOWN CARTE — {episode} {acte}\n{'='*60}")
    print(">>> PREREQUIS : le storyboard d'evolution a ete VALIDE par Aziz (sinon, retour --phase storyboard).")
    print(">>> Le breakdown TRANSCRIT la direction validee en plan technique FIDELE. Il ne reinvente RIEN.")
    print(">>> Il ne rabote JAMAIS une idee du storyboard : si aucun composant ne la fait -> 'si_nouveau'.")
    print("\n>>> FORMAT (doctrine complete) : memory/doctrines/STORYBOARD-MAPBOX.md § FORMAT")
    print(">>>   (A) JSON par etat : camera frame-driven (jumpTo, JAMAIS flyTo), intention_etat (libre),")
    print(">>>       forme_connue / forme_couvre_tout / ce_qui_manque / si_nouveau,")
    print(">>>       cout_estime (trivial|ajustement|proto-rnd), fallback_si_echec, sync_voix, sfx.")
    print(">>>   + forbid global (rejets techniques) + continuite_avec (beat precedent).")
    print(">>>   (B) Resume prose 5-8 lignes pour validation Aziz.")
    print("\n>>> Ecrire le breakdown dans /tmp/mapbox-breakdown-{ep}-{acte}.json puis coder a partir de LUI.")
    print(f">>>   (chemin : /tmp/mapbox-breakdown-{episode}-{acte}.json)")
    print("\nApres breakdown -> code (vraie carte Mapbox) -> --phase self-review.")


def _selfreview_passed_marker(episode: str, acte: str) -> Path:
    """Marqueur ecrit quand la self-review scriptee passe (0 ERROR). phase_review le verifie."""
    return Path(f"/tmp/mapbox-selfreview-{episode}-{acte}.ok")


def phase_self_review(episode: str, acte: str, video: str, file: str = "") -> int:
    print(f"\n{'='*60}\nPHASE 3 — SELF-REVIEW MAPBOX — {episode} {acte}\n{'='*60}")
    selfreview_script = PROJECT_ROOT / "scripts" / "tools" / "mapbox-selfreview.py"
    marker = _selfreview_passed_marker(episode, acte)
    if marker.exists():
        marker.unlink()  # repartir propre : le marqueur ne vaut que si CE run passe

    # ETAPE A — assertions SCRIPTEES BLOQUANTES sur le code (0 ERROR avant tout).
    # --file est REQUIS : sans lui, on ne peut PAS garantir "0 ERROR avant review".
    # (correctif audit 06-03 : le gate etait contournable par omission du flag.)
    if not file:
        print("[STOP] --file <Beat*.tsx> est REQUIS en self-review.")
        print(">>> Les assertions scriptees sont le gate bloquant. Sans le code, pas de garantie.")
        print(f">>> Ex: --phase self-review --file src/.../Beat*.tsx --video {video or '<mp4>'}")
        sys.exit(1)
    if not Path(file).exists():
        print(f"[STOP] Fichier introuvable : {file}")
        sys.exit(1)
    print(f">>> ETAPE A — assertions scriptees (BLOQUANT) sur {file}\n")
    res = subprocess.run(["python3", str(selfreview_script), file], cwd=str(PROJECT_ROOT))
    if res.returncode != 0:
        print("\n[STOP] Self-review scriptee : des ERROR subsistent. CORRIGER avant la checklist et avant Gemini.")
        sys.exit(1)
    print("\n[OK] Assertions scriptees : 0 ERROR.")

    # ETAPE B — checklist visuelle (jugement). Video requise.
    if not video or not Path(video).exists():
        print(f"[STOP] Video introuvable : {video}")
        sys.exit(1)
    print(f"\n>>> ETAPE B — checklist visuelle. Video : {video}")
    print(f"\nCocher honnetement (seuil {SEUIL_SELF}/{len(SELF_REVIEW_MAPBOX)} requis avant Gemini) :\n")
    for i, crit in enumerate(SELF_REVIEW_MAPBOX, 1):
        print(f"  [ ] {i:2d}. {crit}")
    print(f"\n>>> Apres avoir coche, relance avec --checked N (nombre de criteres OK) pour valider le gate.")
    print(">>> Ex: --phase self-review --file <tsx> --video <mp4> --checked 11")
    # Le marqueur n'est PAS encore ecrit : il faut un passage explicite du seuil visuel (--checked).
    return len(SELF_REVIEW_MAPBOX)


def phase_self_review_confirm(episode: str, acte: str, checked: int) -> None:
    """Valide le seuil visuel et ecrit le marqueur qui debloque phase_review."""
    total = len(SELF_REVIEW_MAPBOX)
    print(f"\nSeuil visuel : {checked}/{total} (requis {SEUIL_SELF}/{total}).")
    if checked < SEUIL_SELF:
        print(f"[STOP] {checked}/{total} < {SEUIL_SELF}/{total}. CORRIGER avant de depenser l'appel Gemini.")
        sys.exit(1)
    _selfreview_passed_marker(episode, acte).write_text(f"checked={checked}/{total}\n")
    print(f"[OK] Seuil visuel atteint. Gate self-review debloque -> --phase review autorise.")


def phase_review(episode: str, acte: str, video: str, observations: str) -> None:
    print(f"\n{'='*60}\nPHASE 4 — REVIEW GEMINI (1 SEUL appel) — {episode} {acte}\n{'='*60}")
    # GATE : la self-review (scriptee + seuil visuel) doit avoir passe pour CET episode/acte.
    # (correctif audit 06-03 : review etait atteignable sans self-review.)
    marker = _selfreview_passed_marker(episode, acte)
    if not marker.exists():
        print("[STOP] Self-review non validee pour ce beat. Lance d'abord :")
        print(f">>>   --phase self-review --file <Beat*.tsx> --video {video or '<mp4>'}")
        print(f">>>   puis --phase self-review --checked N (N >= {SEUIL_SELF}).")
        print(">>> Le review Gemini ne s'execute qu'apres une self-review passee.")
        sys.exit(1)
    if not video or not Path(video).exists():
        print(f"[STOP] Video introuvable : {video}")
        sys.exit(1)
    brief = find_brief(episode)
    cmd = [
        "python3", str(REVIEW_SCRIPT), video,
        "--brief", str(brief),
        "--episode", episode, "--acte", acte,
    ]
    if observations:
        cmd += ["--observations", observations]
    out_json = f"/tmp/mapbox-review-{episode}-{acte}.json"
    cmd += ["--out", out_json]
    print(f"Commande : {' '.join(cmd)}\n")
    result = subprocess.run(cmd, cwd=str(PROJECT_ROOT))
    if result.returncode != 0:
        print("[STOP] Echec review Gemini")
        sys.exit(1)
    # Lire le score
    try:
        data = json.loads(Path(out_json).read_text())
        g = data.get("scores", {}).get("global", 0)
        print(f"\n{'='*60}\nSCORE GEMINI (CONSULTATIF) : {g}/10\n{'='*60}")
        print(">>> ⚠️ GEMINI = SIGNAL, JAMAIS JUGE. Un score bas n'invalide PAS le beat.")
        print(">>> Gemini analyse des frames SANS le son -> il hallucine sur le mouvement.")
        print(">>> PROCEDURE : verifier CHAQUE point contre les frames reelles -> appliquer")
        print(">>>   SEULEMENT ce qui est factuellement VRAI -> ignorer le reste -> STOP.")
        print(">>> JAMAIS de boucle Gemini->fix->Gemini. Le jugement d'Aziz prime sur le score.")
        print(">>> 1 SEUL appel Gemini. Apres corrections vraies -> upload (decision Aziz).")
        # Ecrire un review.json normalise A COTE du mp4, lu par le hook pre-presentation-review.sh.
        # verdict jamais REBUILD : la carte est CONSULTATIVE, le hook ne doit pas la bloquer durement.
        if video.endswith(".mp4"):
            adjacent = video[:-4] + ".review.json"
            try:
                gval = float(g)
            except (TypeError, ValueError):
                gval = 0.0
            Path(adjacent).write_text(json.dumps({
                "file": video, "model": "gemini-mapbox", "storyboard": None,
                "score": gval, "verdict": "APPROVE" if gval >= 8 else "NEEDS_WORK",
                "r1_violations": [], "review": data,
            }, ensure_ascii=False, indent=2))
            print(f">>> review.json ecrit a cote du mp4 : {adjacent}")
    except Exception as e:
        print(f"[WARN] JSON non lu : {e}")


def phase_upload(episode: str, acte: str, video: str) -> None:
    print(f"\n{'='*60}\nPHASE 6 — UPLOAD — {episode} {acte}\n{'='*60}")
    if not video or not Path(video).exists():
        print(f"[STOP] Video introuvable : {video}")
        sys.exit(1)
    try:
        r = subprocess.run(
            ["curl", "-s", "-F", "reqtype=fileupload", "-F", f"fileToUpload=@{video}", "https://catbox.moe/user/api.php"],
            capture_output=True, text=True, timeout=120,
        )
        url = r.stdout.strip()
        print(f"[OK] catbox : {url}")
        ntfy("ready", f"{episode} {acte} pret a valider", url)
    except Exception as e:
        print(f"[STOP] Upload echoue : {e}")
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--episode", required=True)
    ap.add_argument("--acte", required=True, help="A1, A2, ...")
    ap.add_argument("--phase", required=True,
                    choices=["storyboard", "breakdown", "self-review", "review", "upload"])
    ap.add_argument("--video", default="")
    ap.add_argument("--file", default="", help="Beat*.tsx — requis en self-review (assertions scriptees bloquantes)")
    ap.add_argument("--checked", type=int, default=-1,
                    help="Nb de criteres visuels coches — valide le gate self-review (>= seuil) et debloque review")
    ap.add_argument("--observations", default="")
    args = ap.parse_args()

    if args.phase == "storyboard":
        phase_storyboard(args.episode, args.acte)
    elif args.phase == "breakdown":
        phase_breakdown(args.episode, args.acte)
    elif args.phase == "self-review":
        if args.checked >= 0:
            phase_self_review_confirm(args.episode, args.acte, args.checked)
        else:
            phase_self_review(args.episode, args.acte, args.video, args.file)
    elif args.phase == "review":
        phase_review(args.episode, args.acte, args.video, args.observations)
    elif args.phase == "upload":
        phase_upload(args.episode, args.acte, args.video)


if __name__ == "__main__":
    main()
