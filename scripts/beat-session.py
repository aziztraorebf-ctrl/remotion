#!/usr/bin/env python3
"""
beat-session.py — Orchestrateur générique de production Beat (tous épisodes Souverain)

Pipeline :
  1. Vérifier manifest           → ABSENT : ntfy + STOP
  2. Vérifier storyboard PNG     → ABSENT : ntfy + STOP
  3. Vérifier assets (bg, audio) → MANQUANT : ntfy + STOP
  4. Gate pré-vol                → FAIL : lister manques + STOP
  5. beat-breakdown.py           → JSON "quoi coder" (Appel Gemini 1)
     → STOP — Claude lit le breakdown et code
  --- Claude code + render (étape manuelle) ---
  6. visual_review.py            → score JSON (Appel Gemini 2)
  7. Si score >= 8.0             → corrections → re-render → ntfy + STOP "valide"
     Si score < 8.0              → ntfy BLOCKED + STOP

Usage :
  python3 scripts/beat-session.py --episode silicon-savannah --beat 6 --phase breakdown
  python3 scripts/beat-session.py --episode silicon-savannah --beat 6 --phase review --video out/episodes/silicon-savannah/wip/beat6_v1.mp4
  python3 scripts/beat-session.py --episode niger-uranium --beat 3 --phase breakdown

Épisodes disponibles (--episode) :
  silicon-savannah    src/projects/souverain/silicon-savannah/
  niger-uranium       src/projects/souverain/niger-uranium/
  vraie-taille        src/projects/souverain/vraie-taille-afrique/
  zimbabwe-lithium    src/projects/souverain/zimbabwe-lithium/
  (tout autre slug dans src/projects/souverain/ fonctionne automatiquement)
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"

PALETTE = {"gold": "#c8a951", "ivory": "#f0e8d8", "navy": "#112240", "dark": "#0d1420"}

SECURITY_BANNER = """
=== CONTRAINTES DE SECURITE SOUVERAIN ===
TAILLES   : HERO chiffre 180-220px / mot-cle 88-110px / question 110-150px.
            L'element hero occupe 40-60% largeur OU hauteur. Viser GROS des le 1er jet
            (erreur recurrente = textes trop petits). Voir PLAYBOOK section 2ter.
DEMARRAGE : 1er element visible AVANT ~1.5s (frame ~20-45), JAMAIS a 5s.
ANTI-VIDE : si le hero flotte petit avec du vide -> AGRANDIR. Fond actif (radial+grid+vignette).
SOUS-TITRE: inutile si le texte hero est deja a l'ecran en grand -> le retirer.
R1        : max 8s sans changement visuel (glow/float ne comptent PAS)
+30%      : frames review a segment_start + 30% duree -- JAMAIS a t=0
No-Black  : jamais #000000 -- minimum #0d1420 partout
SVG-Gate  : illustration/icone reconnaissable -> Gemini image OBLIGATOIRE
Font-Gate : loadFont() @remotion/google-fonts -- verifier avec grep avant de coder
SVG-Align : ping ring / cercle superpose -> integrer dans le MEME SVG
Opacity   : masquer explicitement (opacity: 0) avant frame declenchement
Tailwind  : OBLIGATOIRE -- lire tailwind.config.ts AVANT d'ecrire une ligne
            tokens : text-gold / text-ivory / bg-navy / text-stat-lg / font-bebas
            ZERO styles inline pour couleurs, typo, spacing
            Exception : valeurs SVG natives (fill, stroke, cx, cy) restent inline
Lucide    : lucide-react INSTALLE -- utiliser AVANT de generer via Gemini
            Landmark=etat, Radio/Tower=telecom, Building=entreprise, Globe=monde
==========================================
"""


def resolve_paths(episode: str, beat_num: int) -> dict:
    src_dir = PROJECT_ROOT / "src" / "projects" / "souverain" / episode
    pub_dir = PROJECT_ROOT / "public" / "souverain" / episode

    if not src_dir.exists():
        print(f"[ERROR] Episode introuvable : {src_dir}", file=sys.stderr)
        print(f"        Episodes disponibles :", file=sys.stderr)
        for d in (PROJECT_ROOT / "src" / "projects" / "souverain").iterdir():
            if d.is_dir():
                print(f"          --episode {d.name}", file=sys.stderr)
        sys.exit(1)

    beat_src = src_dir / f"beat{beat_num}"
    beat_pub = pub_dir / f"beat{beat_num}"

    return {
        "src_dir": src_dir,
        "pub_dir": pub_dir,
        "beat_src": beat_src,
        "beat_pub": beat_pub,
        "wip_dir": PROJECT_ROOT / "out" / "episodes" / episode / "wip",
        "final_dir": PROJECT_ROOT / "out" / "episodes" / episode,
    }


def ntfy(event: str, beat: str, url: str = "", msg: str = "") -> None:
    script = SCRIPTS_DIR / "ntfy-notify.sh"
    if script.exists():
        subprocess.run(["bash", str(script), event, beat, url, msg], check=False)
    else:
        print(f"[ntfy] {event} — {beat} {msg}")


def stop(reason: str, beat: str, event: str = "blocked", url: str = "", notify: bool = False) -> None:
    print(f"\n[STOP] {reason}")
    if notify:
        ntfy(event, beat, url, reason)
    sys.exit(1)


def phase_preflight(episode: str, beat_num: int) -> dict:
    paths = resolve_paths(episode, beat_num)
    beat = f"beat{beat_num}"
    beat_src = paths["beat_src"]
    pub_dir = paths["pub_dir"]
    beat_pub = paths["beat_pub"]

    print(SECURITY_BANNER)
    print(f"=== GATE PRE-VOL {episode} Beat{beat_num} ===\n")

    # 1. Manifest OU constantes inline dans Beat*.tsx (pattern Souverain Mid-form Beat11/12/13)
    manifest = beat_src / "manifest.ts"
    beat_tsx_parent = beat_src.parent / f"Beat{beat_num}.tsx"

    if manifest.exists():
        manifest_content = manifest.read_text()
        print(f"  [OK] manifest.ts present")
        if "SEG" not in manifest_content or "DURATION_FRAMES" not in manifest_content:
            stop(
                f"manifest.ts incomplet — SEG ou DURATION_FRAMES manquant. "
                "Verifier que le manifest contient les timings corrects.",
                beat
            )
        print(f"  [OK] manifest.ts valide (SEG + DURATION_FRAMES presents)")
    elif beat_tsx_parent.exists():
        # Pattern Souverain Mid-form : constantes F_*_END inline dans BeatN.tsx
        tsx_content = beat_tsx_parent.read_text()
        if "F_A_END" not in tsx_content and "F_END" not in tsx_content:
            stop(
                f"Ni manifest.ts ni constantes inline (F_A_END/F_END) trouves dans {beat_tsx_parent}. "
                "Definir les timings avant de continuer.",
                beat
            )
        print(f"  [OK] constantes inline detectees dans {beat_tsx_parent.name} (pattern Souverain Mid-form)")
    else:
        stop(
            f"Ni manifest.ts ({beat_src}) ni Beat{beat_num}.tsx ({beat_tsx_parent}) trouves. "
            "Le beat doit avoir une source de verite de timings.",
            beat
        )

    # 2. Storyboard PNG
    storyboard_candidates = [
        beat_pub / "storyboard-gemini.png",
        pub_dir / f"beat{beat_num}" / "storyboard-gemini.png",
    ]
    storyboard_found = None
    for sp in storyboard_candidates:
        if sp.exists():
            storyboard_found = sp
            print(f"  [OK] storyboard PNG : {sp.relative_to(PROJECT_ROOT)}")
            break

    if not storyboard_found:
        stop(
            f"Storyboard PNG ABSENT pour {episode} Beat{beat_num}. "
            f"Chemin attendu : public/souverain/{episode}/beat{beat_num}/storyboard-gemini.png.\n"
            f"        STORYBOARD GEMINI VISUEL OBLIGATOIRE (NON-NEGOTIABLE) — multi-panels montrant la progression :\n"
            f"          1. Rediger le prompt depuis le scan (templates + combinaisons), le faire valider par Aziz\n"
            f"          2. python3 scripts/tools/gemini-storyboard-panels.py --episode {episode} --beat {beat_num} \\\n"
            f"               --prompt-file /tmp/{episode}-beat{beat_num}-storyboard-prompt.txt\n"
            f"          3. Presenter le PNG a Aziz pour validation AVANT le breakdown.\n"
            f"        Le storyboard est ce qui permet de coder sans hesiter ET d'en tirer le breakdown JSON.",
            beat,
            event="storyboard_ready"
        )

    # 3. Audio narration
    narration = beat_src / "narration.mp3"
    if not narration.exists():
        stop(f"narration.mp3 ABSENT : {narration}", beat)
    print(f"  [OK] narration.mp3 present")

    # 4. Background (WARN seulement — certains beats utilisent un fond CSS pur)
    bg_candidates = [
        beat_pub / "bg.png",
        pub_dir / f"bg-beat{beat_num}.png",
        pub_dir / "bg.png",
    ]
    bg_found = None
    for bg in bg_candidates:
        if bg.exists():
            bg_found = bg
            print(f"  [OK] bg : {bg.relative_to(PROJECT_ROOT)}")
            break

    if not bg_found:
        print(f"  [WARN] bg.png absent pour {episode} Beat{beat_num}.")
        print(f"         Candidats verifies : {[str(b) for b in bg_candidates]}")
        print(f"         Certains beats utilisent un fond CSS pur (dots, gradient, solid navy).")
        while True:
            rep = input(f"         Fond CSS-only (pas d'image) ? (O=continuer / N=stopper pour generer bg) : ").strip().upper()
            if rep in ("O", "N"):
                break
        if rep == "N":
            stop(
                f"bg requis — generer via Gemini image avant de continuer.",
                beat,
                notify=False
            )
        else:
            print(f"  [OK] bg : fond CSS-only confirme — pas d'image requise")
            bg_found = "css-only"

    # 5. Font gate + No-black (sur le fichier TSX si existant)
    tsx_candidates = list(paths["src_dir"].glob(f"Beat{beat_num}*.tsx"))
    if tsx_candidates:
        tsx_content = tsx_candidates[0].read_text()
        if "loadFont" not in tsx_content and "fontFamily" in tsx_content:
            print(f"  [WARN] Font-Gate : fontFamily inline sans loadFont() dans {tsx_candidates[0].name}")
            print(f"         Fix : import {{ loadFont }} from '@remotion/google-fonts/BebasNeue'")
        elif "loadFont" in tsx_content:
            print(f"  [OK] Font-Gate : loadFont() present")
        else:
            print(f"  [OK] Font-Gate : pas de fontFamily inline detecte")

        if "#000000" in tsx_content:
            print(f"  [WARN] No-Black : #000000 detecte dans {tsx_candidates[0].name} — remplacer par #0d1420 minimum")
        else:
            print(f"  [OK] No-Black : aucun #000000")

    # 6. Tailwind check
    tailwind_config = PROJECT_ROOT / "tailwind.config.ts"
    if tailwind_config.exists():
        print(f"  [OK] tailwind.config.ts present — tokens disponibles : text-gold, text-ivory, bg-navy")
    else:
        print(f"  [WARN] tailwind.config.ts introuvable — verifier l'installation Tailwind")

    gate = {
        "episode": episode,
        "beat": beat_num,
        "manifest": str(manifest),
        "storyboard": str(storyboard_found),
        "narration": str(narration),
        "bg": str(bg_found),
        "wip_dir": str(paths["wip_dir"]),
        "final_dir": str(paths["final_dir"]),
        "gate_status": "PASS"
    }

    print(f"\n[GATE] PASS — tous les prereqs sont presents pour {episode} Beat{beat_num}")
    return gate


TAILWIND_CUSTOM_TOKENS = {
    # Couleurs (classes Tailwind générées : text-gold, bg-navy, etc.)
    "text-gold", "text-gold-light", "text-gold-dark",
    "bg-gold", "bg-gold-light", "bg-gold-dark",
    "text-navy", "text-navy-deep", "text-navy-light",
    "bg-navy", "bg-navy-deep", "bg-navy-light",
    "text-ivory", "bg-ivory",
    "text-slate", "text-slate-light", "bg-slate",
    "text-kraft", "bg-kraft",
    # Tailles de texte custom
    "text-stat-2xl", "text-stat-xl", "text-stat-lg", "text-stat-md",
    "text-entity", "text-label", "text-mono-sm",
    # Spacing custom
    "pt-safe-top", "pb-safe-bottom", "px-col-pad", "px-side-pad",
    "mt-safe-top", "mb-safe-bottom",
    "p-safe-top", "p-safe-bottom",
    "pt-safe-top-169", "pb-safe-bottom-169",
}


def validate_tailwind_tokens(breakdown: dict) -> None:
    """Vérifie que les classes Tailwind retournées par Gemini existent dans tailwind.config.ts."""
    tailwind_layout = breakdown.get("tailwind_layout", {})
    if not tailwind_layout:
        return

    import re
    all_classes = " ".join(str(v) for v in tailwind_layout.values())
    custom_pattern = re.compile(
        r'\b(text-(?:gold|navy|ivory|slate|kraft|stat-\w+|entity|label|mono-sm)'
        r'|bg-(?:gold|navy|ivory|slate|kraft)'
        r'|(?:pt|pb|mt|mb|px|p)-(?:safe|col-pad|side-pad)\S*)\b'
    )
    found = custom_pattern.findall(all_classes)
    unknown = [c for c in set(found) if c not in TAILWIND_CUSTOM_TOKENS]

    if unknown:
        print(f"\n  [WARN] Tokens Tailwind custom non reconnus dans breakdown :")
        for c in sorted(unknown):
            print(f"    - {c}  (non declare dans tailwind.config.ts — remplacer par token existant)")
        print(f"  Tokens valides : {', '.join(sorted(TAILWIND_CUSTOM_TOKENS))}")
    else:
        print(f"  [OK] Tokens Tailwind du breakdown valides")


def assets_marker_path(episode: str, beat_num: int) -> Path:
    return Path(f"/tmp/{episode}-beat{beat_num}-assets-ok.json")


def spec_table_path(episode: str, beat_num: int) -> Path:
    return Path(f"/tmp/{episode}-beat{beat_num}-spec.md")


def phase_spec_table(episode: str, beat_num: int) -> None:
    """
    Génère le tableau de spécification OBLIGATOIRE avant tout code de beat.
    Bloquant : --phase self-review vérifie l'existence de ce fichier.

    Le tableau couvre :
    - Phases narratives (A, B, C...) avec frames absolues audio-ancrées
    - Coords stations utilisées (STATIONS.X.x, STATIONS.X.y)
    - Slots cartouches (positions, dimensions, hideAt)
    - Mouvements caméra (cameraTo params)
    - Assets visuels avec justification script audio
    """
    output = spec_table_path(episode, beat_num)

    print(f"\n=== SPEC-TABLE — {episode} Beat{beat_num} ===")
    print(f"    Fichier cible : {output}")
    print()
    print("Ce tableau DOIT être complété avant d'écrire une ligne de code.")
    print("Il sera vérifié par --phase self-review (bloquant si absent).")
    print()

    # Vérifier si breakdown JSON existe pour pré-remplir les frames
    breakdown = Path(f"/tmp/{episode}-beat{beat_num}-breakdown.json")
    if breakdown.exists():
        print(f"[OK] Breakdown JSON trouvé : {breakdown}")
        print("     Utiliser les frames du breakdown pour remplir le tableau.")
    else:
        print(f"[!] Breakdown JSON absent ({breakdown})")
        print("    Lancer d'abord : python3 scripts/beat-session.py"
              f" --episode {episode} --beat {beat_num} --phase breakdown")
        print("    Le tableau peut être rempli manuellement, mais le breakdown est recommandé.")

    print()

    # Template interactif
    lines = []
    lines.append(f"# Spec Table — {episode} Beat{beat_num}")
    lines.append(f"> Généré le : {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("")
    lines.append("## Script audio (mots-clés + frames absolues)")
    lines.append("| Mot / phrase | Frame absolue | Déclencheur visuel |")
    lines.append("|---|---|---|")

    print("--- SCRIPT AUDIO ---")
    print("Entre les mots-clés du script avec leurs frames absolues (forced-alignment).")
    print("Format : 'mot,frame,déclencheur' ou ENTER pour terminer.")
    print()
    while True:
        entry = input("  mot,frame,déclencheur (ENTER pour terminer) : ").strip()
        if not entry:
            break
        parts = entry.split(",", 2)
        if len(parts) == 3:
            lines.append(f"| {parts[0].strip()} | {parts[1].strip()} | {parts[2].strip()} |")
        else:
            print("  Format invalide, ignorer.")

    lines.append("")
    lines.append("## Phases narratives")
    lines.append("| Phase | Frames (absolues) | Description | Caméra |")
    lines.append("|---|---|---|---|")

    print()
    print("--- PHASES NARRATIVES ---")
    print("Format : 'label,f_start-f_end,description,camera' ou ENTER pour terminer.")
    while True:
        entry = input("  Phase (ENTER pour terminer) : ").strip()
        if not entry:
            break
        parts = entry.split(",", 3)
        if len(parts) >= 2:
            label = parts[0].strip()
            frames = parts[1].strip() if len(parts) > 1 else "?"
            desc = parts[2].strip() if len(parts) > 2 else ""
            cam = parts[3].strip() if len(parts) > 3 else ""
            lines.append(f"| {label} | {frames} | {desc} | {cam} |")

    lines.append("")
    lines.append("## Assets visuels — justification script")
    lines.append("| Asset | Mot script qui le justifie | Beat si absent |")
    lines.append("|---|---|---|")

    print()
    print("--- ASSETS VISUELS ---")
    print("Chaque asset DOIT être nommé dans le script audio.")
    print("Format : 'asset,mot_script,beat_si_absent' ou ENTER pour terminer.")
    while True:
        entry = input("  Asset (ENTER pour terminer) : ").strip()
        if not entry:
            break
        parts = entry.split(",", 2)
        if len(parts) >= 2:
            asset = parts[0].strip()
            mot = parts[1].strip()
            beat_alt = parts[2].strip() if len(parts) > 2 else "—"
            lines.append(f"| {asset} | {mot} | {beat_alt} |")

    lines.append("")
    lines.append("## Règles techniques appliquées")
    lines.append("- [ ] durationInFrames Root.tsx = BEAT_END - BEAT_START")
    lines.append("- [ ] Math.max(0, localF) dans tout calcul frameIdx")
    lines.append("- [ ] Spring pop défaut : interpolate(lf, [0,12,45], [0,3.0,1.8])")
    lines.append("- [ ] Pixels RGB asset vérifiés (add-city-asset.sh ou manuel)")
    lines.append("- [ ] Ref i2i documentée dans assets/REFS.md")
    lines.append("")

    output.write_text("\n".join(lines))
    print(f"\n[OK] Spec table sauvegardée : {output}")
    print(f"     Pipeline débloqué pour --phase self-review.")


def scan_marker_path(episode: str, beat_num: int) -> Path:
    return Path(f"/tmp/{episode}-beat{beat_num}-scan.md")


CATALOGUES_REMOTION = [
    ("INDEX-DES-INDEX (point d'entree maitre)", "src/projects/_shared/INDEX-DES-INDEX.md"),
    ("COMPOSANTS-INDEX (71+ composants par cas d'usage + section HERO DATA)", "src/projects/_shared/COMPOSANTS-INDEX.md"),
    ("PLAYBOOK data-viz (8 principes + template storyboard 10 champs)", "memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md"),
    ("SKELETON assemblage (1 narration globale, CutFade navy)", "memory/doctrines/SOUVERAIN-REMOTION-SKELETON.md"),
]


def phase_scan(episode: str, beat_num: int) -> None:
    """
    Phase 0 — SCAN TEMPLATES (miroir de la phase 0 mapbox-session.py).
    OBLIGATOIRE avant breakdown. Force Claude a :
      1. lire les catalogues de composants
      2. identifier les templates pertinents pour le besoin narratif du beat
      3. PROPOSER des combinaisons (hero + satellites + verdict, etc.)
      4. recommander un choix justifie
    Produit /tmp/{episode}-beat{N}-scan.md (gate : phase_breakdown bloque sans lui).
    """
    beat = f"beat{beat_num}"
    output = scan_marker_path(episode, beat_num)

    print(f"\n=== SCAN TEMPLATES — {episode} Beat{beat_num} (Phase 0, OBLIGATOIRE) ===\n")
    print(">>> AVANT d'ecrire une ligne de code, LIRE ces catalogues et presenter a Aziz")
    print(">>> les templates pertinents + des COMBINAISONS. Reutiliser > coder from scratch.\n")
    for label, path in CATALOGUES_REMOTION:
        exists = (PROJECT_ROOT / path).exists()
        flag = "OK " if exists else "!! "
        print(f"  [{flag}] {label}")
        print(f"         {path}")
    print()
    print(">>> REGLE SCAN COMPLET (NON-NEGOTIABLE) :")
    print(">>>   LIRE l'INTEGRALITE de COMPOSANTS-INDEX.md (71+ composants, TOUTES les sections),")
    print(">>>   PAS seulement la section HERO DATA. Aziz ne peut pas memoriser 71 composants — Claude OUI.")
    print(">>>   Parcourir : Chiffre/Stat, Comparaison, Timeline, Carte, Revelation, Citation, Portrait,")
    print(">>>   Preuve, Reseau, Hook, Data-viz, HERO DATA, Utilitaires.")
    print()
    print(">>> REGLE COMBINAISON (NON-NEGOTIABLE) :")
    print(">>>   Un beat premium = PLUSIEURS templates assembles (corps + insert + overlay + sous-titre),")
    print(">>>   JAMAIS un seul template tout du long. Proposer >= 2 combinaisons distinctes a Aziz.")
    print()
    print(">>> DOCTRINE data-viz : memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md")
    print(">>>   8 principes (chiffre-evenement, secondary motion, metaphore physique, transitions seamless...)")
    print(">>>   Briques HERO DATA pretes : CountUp(bounce), HeroMirrorBars, FloatingHeroObject,")
    print(">>>   Badge(satellite), CountdownReveal(pingNode), TextChoc, SubtitleBarSouverain.\n")
    print(">>> * REGLE CAPACITE NON UTILISEE (NON-NEGOTIABLE — ajoutee 2026-07-25) :")
    print(">>>   Le scan repond a 'qu'est-ce qu'on A ?'. Il DOIT aussi repondre a 'qu'est-ce qui MANQUE ?'.")
    print(">>>   Signaler a Aziz UNE capacite non utilisee — celle qui aurait le plus d'effet sur CE beat.")
    print(">>>   UNE seule, ciblee, jamais un catalogue. Format doctrine :")
    print(">>>     « Je remarque [X]. Reco : [Y]. On en discute avant que je code ? »")
    print(">>>   Pourquoi : nos scenes sont jugees 'ca marche', jamais 'ca pourrait etre mieux'. Le pipeline")
    print(">>>   VALIDE, il ne cherche pas ce qui est ABSENT. Aziz ne peut pas demander ce qu'il ignore —")
    print(">>>   c'est a Claude de proposer (doctrine 'signalement ET proposition proactifs').")
    print(">>>   Pistes deja documentees comme sous-exploitees : Mapbox/D3 et bloc SVG")
    print(">>>   (MOTEURS-VISUELS-ET-SOCLE) · finitions matiere : glow multi-couches, reflet au sol,")
    print(">>>   pointe de trace, couche atmosphere (svg-library/techniques/neon-glow-reflet-trace.md)")
    print(">>>   · mouvement de camera SVG (g transform dans un viewBox FIXE).")
    print(">>>   Si rien ne manque VRAIMENT sur ce beat : l'ecrire explicitement ('RAS, et pourquoi').\n")
    print(f">>> Ecrire le scan dans : {output}")
    print(">>> Format attendu (rempli par Claude, puis valide par Aziz) :")
    print("""
    # Scan templates — {ep} Beat{n}
    ## Besoin narratif
    Ce beat doit montrer : ...
    ## Templates pertinents (lus dans les catalogues)
    - [Composant X] (cat) — fait [quoi] — pertinent car [raison]
    - [Composant Y] — alternative
    ## Combinaisons proposees
    - hook [A] -> corps [B] -> verdict [C]
    ## Recommandation
    [choix] car [raison narrative + doctrine playbook]
    """.format(ep=episode, n=beat_num))

    # Pre-creer un squelette si absent (Claude le remplit)
    if not output.exists():
        output.write_text(
            f"# Scan templates — {episode} Beat{beat_num}\n\n"
            f"> Phase 0 OBLIGATOIRE. Remplir AVANT le breakdown.\n"
            f"> Catalogues SCANNES EN ENTIER : COMPOSANTS-INDEX.md (71+ composants, TOUTES sections)\n"
            f"> + INDEX-DES-INDEX.md + SOUVERAIN-REMOTION-PLAYBOOK.md\n\n"
            f"## Besoin narratif\n(ce beat doit montrer ...)\n\n"
            f"## Templates pertinents (scan COMPLET, toutes sections de l'index)\n"
            f"- [Composant] (section) — fait [quoi] — pertinent car [raison]\n\n"
            f"## Combinaisons proposees (>= 2, plusieurs templates assembles)\n"
            f"- Option A : [corps] + [insert] + [overlay] + [sous-titre]\n"
            f"- Option B : [alternative]\n\n"
            f"## Recommandation\n(choix + justification doctrine playbook)\n\n"
            f"## * Capacite NON UTILISEE (obligatoire — 1 seule, la plus utile a CE beat)\n"
            f"> Ce que le scan ci-dessus ne dit pas : ce qui MANQUE. Repondre meme si la reponse est RAS.\n"
            f"- Je remarque : (ce qui rendrait cette scene meilleure et qu'on n'utilise pas)\n"
            f"- Reco : (la capacite + l'effet attendu, en 1 phrase)\n"
            f"- Cout : (temps / API / risque) et QUAND l'appliquer (ce beat ou plus tard)\n"
            f"- [ ] presente a Aziz AVANT de coder\n"
        )
        print(f"\n[OK] Squelette scan cree : {output}")
        print(f"     Claude le remplit (scan COMPLET + >=2 combinaisons), le presente a Aziz,")
        print(f"     PUIS genere le storyboard Gemini, PUIS lance --phase breakdown.")
    else:
        print(f"\n[OK] Scan deja present : {output}")


def phase_breakdown(episode: str, beat_num: int, gate: dict) -> dict:
    beat = f"beat{beat_num}"
    output = f"/tmp/{episode}-beat{beat_num}-breakdown.json"

    # --- Gate scan : bloquant si absent ou non rempli ---
    scan = scan_marker_path(episode, beat_num)
    if not scan.exists():
        print(f"\n[BLOQUE] Scan templates absent : {scan}", file=sys.stderr)
        print(f"  La phase 0 SCAN est OBLIGATOIRE avant le breakdown (parite avec le pipeline Mapbox).")
        print(f"  Lancer d'abord :")
        print(f"    python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase scan")
        sys.exit(1)
    scan_content = scan.read_text()
    # Detecter un scan non rempli (squelette laisse vide)
    if "(ce beat doit montrer ...)" in scan_content or scan_content.count("- \n") >= 2:
        print(f"\n[BLOQUE] Scan templates present mais NON REMPLI : {scan}", file=sys.stderr)
        print(f"  Remplir le scan (besoin narratif + templates pertinents + combinaisons + reco)")
        print(f"  et le presenter a Aziz AVANT de lancer le breakdown.")
        sys.exit(1)
    print(f"[OK] Scan templates rempli : {scan}")

    print(f"\n=== BREAKDOWN GEMINI {episode} Beat{beat_num} (Appel Gemini 1) ===\n")

    cmd = [
        sys.executable,
        str(SCRIPTS_DIR / "beat-breakdown.py"),
        "--beat", str(beat_num),
        "--storyboard", gate["storyboard"],
        "--output", output
    ]

    result = subprocess.run(cmd, capture_output=False)
    if result.returncode != 0:
        stop(f"beat-breakdown.py a echoue — verifier les logs ci-dessus", beat)

    breakdown = json.loads(Path(output).read_text())

    missing_assets = [a for a in breakdown.get("assets_needed", []) if a["status"] == "missing"]
    if missing_assets:
        # Ecrire le marker "assets bloquants" pour tracabilite
        blocked_path = Path(f"/tmp/{episode}-beat{beat_num}-assets-blocked.json")
        blocked_path.write_text(json.dumps({
            "episode": episode,
            "beat": beat_num,
            "missing_assets": [a["filename"] for a in missing_assets],
            "status": "BLOCKED — resolution manuelle requise"
        }, ensure_ascii=False, indent=2))

        print(f"\n[ASSETS BLOQUES] {len(missing_assets)} asset(s) manquant(s) :")
        for a in missing_assets:
            print(f"  - {a['filename']}")
        print(f"""
Options de resolution :
  A) Generer les assets (Gemini/Lucide/Recraft) puis marquer comme resolus :
     python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --resolve-assets \\
       --resolution "icon_person=Lucide:Users, icon_bank=Lucide:Landmark, icon_antenna=Lucide:Radio"

  B) Generer les fichiers SVG/PNG et les placer dans le dossier attendu,
     puis relancer : python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase breakdown

IMPORTANT : sans --resolve-assets, --phase review sera BLOQUE.
""")
        ntfy("blocked", beat, "", f"{len(missing_assets)} assets manquants — resolution requise avant code")  # notify=True : action requise d'Aziz
        sys.exit(1)

    # Aucun asset manquant : ecrire le marker "assets OK" automatiquement
    marker = assets_marker_path(episode, beat_num)
    marker.write_text(json.dumps({
        "episode": episode,
        "beat": beat_num,
        "resolved_by": "breakdown_auto",
        "missing_assets": [],
        "status": "OK"
    }, ensure_ascii=False, indent=2))

    validate_tailwind_tokens(breakdown)

    print(f"\n[STOP] Breakdown sauvegarde : {output}")
    print(f"       1. Lire ce JSON + ouvrir storyboard image")
    print(f"       2. Coder {episode}/Beat{beat_num}*.tsx — Tailwind OBLIGATOIRE (h-[X%] + flex, tokens text-gold/text-ivory/bg-navy)")
    print(f"       3. Render -> {gate['wip_dir']}/beat{beat_num}_v1.mp4")
    print(f"       4. Auto-review OBLIGATOIRE (score >= 19/25 requis) :")
    print(f"          python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase self-review --video {gate['wip_dir']}/beat{beat_num}_v1.mp4")
    print(f"       5. Si self-review OK → Appel Gemini 2 :")
    print(f"          python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase review --video {gate['wip_dir']}/beat{beat_num}_v1.mp4")
    print(f"       6. Après corrections post-review → notifier Aziz :")
    print(f"          python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase upload --video {gate['wip_dir']}/beat{beat_num}_vFinal.mp4")
    print(f"\n[!] NE PAS presenter le render a Aziz avant self-review >= 19/25 ET --phase review.")
    # Pas de ntfy ici — Claude continue seul, aucune action requise d'Aziz
    return breakdown


def phase_resolve_assets(episode: str, beat_num: int, resolution: str) -> None:
    """
    Marque les assets comme resolus manuellement (Lucide, Recraft, etc.).
    Debloquer le pipeline pour permettre --phase review apres render.

    --resolution format : "filename=methode:valeur, ..."
    Ex : "icon_person=Lucide:Users, icon_bank=Lucide:Landmark"
    """
    beat = f"beat{beat_num}"
    blocked_path = Path(f"/tmp/{episode}-beat{beat_num}-assets-blocked.json")

    if not blocked_path.exists():
        print(f"[WARN] Aucun marker 'assets bloquants' trouve pour {episode} Beat{beat_num}.")
        print(f"       Le breakdown n'avait peut-etre pas d'assets manquants.")

    resolutions = {}
    if resolution:
        for part in resolution.split(","):
            part = part.strip()
            if "=" in part:
                filename, method = part.split("=", 1)
                resolutions[filename.strip()] = method.strip()

    marker = assets_marker_path(episode, beat_num)
    marker.write_text(json.dumps({
        "episode": episode,
        "beat": beat_num,
        "resolved_by": "manual",
        "resolutions": resolutions,
        "status": "OK"
    }, ensure_ascii=False, indent=2))

    print(f"\n[OK] Assets marques comme resolus pour {episode} Beat{beat_num} :")
    for f, m in resolutions.items():
        print(f"  - {f} → {m}")
    print(f"\n[NEXT — OBLIGATOIRE apres render] :")
    wip = Path("out") / "episodes" / episode / "wip"
    print(f"  python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase review --video {wip}/beat{beat_num}_v1.mp4")
    print(f"\n[!] NE PAS presenter le render a Aziz avant d'avoir lance --phase review.")
    # Pas de ntfy ici — Claude continue seul, aucune action requise d'Aziz


SELF_REVIEW_CRITERIA = [
    # Groupe 1 — Remplissage écran
    ("G1-1", "Aucune zone > 25% de l'écran vide sans contenu intentionnel"),
    ("G1-2", "Le contenu principal occupe au moins 60% de la hauteur visible"),
    ("G1-3", "Pas de padding/margin excessif qui pousse le contenu hors de sa zone"),
    # Groupe 2 — Layout & positionnement
    ("G2-1", "Chaque élément est dans la zone assignée par le storyboard"),
    ("G2-2", "Pas de débordement hors écran (overflow visible)"),
    ("G2-3", "Alignements respectés : centré=centré, gauche=gauche, droite=droite"),
    # Groupe 3 — Typographie
    ("G3-1", "Texte lisible : taille minimum 32px en 1080x1920"),
    ("G3-2", "Pas de troncature (whitespace:nowrap respecté ou wrap géré)"),
    ("G3-3", "Police correcte chargée via loadFont() — Bebas/IBM Plex Mono selon beat"),
    # Groupe 4 — Couleurs & contraste
    ("G4-1", "Texte gold sur fond sombre = lisible"),
    ("G4-2", "Texte ivory sur fond sombre = lisible"),
    ("G4-3", "Aucune couleur avec connotation narrative non intentionnelle"),
    # Groupe 5 — Animation & timing
    ("G5-1", "Aucun segment > 8s sans changement visuel — glow/float ne comptent PAS (règle R1)"),
    ("G5-2", "Animations spring visibles — opacity=0 ne bloque pas trop longtemps"),
    ("G5-3", "Éléments apparaissent dans le timing prévu par le breakdown JSON"),
    # Groupe 6 — Fidélité storyboard
    ("G6-1", "Nombre d'éléments = storyboard (ni plus, ni moins)"),
    ("G6-2", "Position relative des éléments respectée (haut/bas/gauche/droite)"),
    ("G6-3", "Palette couleurs = storyboard (pas de couleur inventée)"),
    # Groupe 7 — Tailwind
    ("G7-1", "Zéro position:absolute + paddingTop manuel pour zone % — utiliser h-[X%] + flex"),
    ("G7-2", "Zéro couleur inline si token Tailwind existe (text-gold, text-ivory, bg-navy)"),
    ("G7-3", "Zéro fontSize inline si token Tailwind existe (text-stat-lg, text-entity, text-label)"),
    ("G7-4", "Tout split-screen / zone % → flex + justify-center + items-center"),
    ("G7-5", "Espacement via gap-X Tailwind — pas de marginTop inline"),
    # Groupe 8 — Sources & Contraste (Atlas)
    ("G8-1", "Au moins une source documentée intégrée dans le beat (bandeau parchment bas écran)"),
    ("G8-2", "Tout label texte sur zone colorée = PARCHMENT + drop-shadow, jamais même couleur que le fond"),
]

SELF_REVIEW_THRESHOLD = 19  # sur 25


def grep_tailwind_violations(episode: str, beat_num: int) -> list:
    """
    Vérifie mécaniquement les critères G7 (Tailwind) directement dans le TSX.
    Retourne la liste des violations trouvées : [(code, description)].
    """
    import re
    src_dir = PROJECT_ROOT / "src" / "projects" / "souverain" / episode
    tsx_candidates = list(src_dir.glob(f"Beat{beat_num}*.tsx"))
    if not tsx_candidates:
        return [("G7-?", f"Fichier Beat{beat_num}*.tsx introuvable dans {src_dir}")]

    content = tsx_candidates[0].read_text()
    violations = []

    # G7-1 : paddingTop en % = zone layout mal construite
    if re.search(r'paddingTop\s*[:=]\s*["\']?\d+%', content):
        violations.append(("G7-1", "paddingTop en % detecte — utiliser h-[X%] + flex a la place"))

    # G7-2 : couleurs hex hardcodees alors que token Tailwind existe
    color_map = {"#c8a951": "text-gold", "#f0e8d8": "text-ivory", "#112240": "bg-navy", "#0d1420": "bg-navy-deep"}
    for hex_val, token in color_map.items():
        if hex_val in content:
            # Compter les occurrences dans color:/background: inline (pas dans les constantes PALETTE)
            pattern = rf'(?:color|background)\s*[:=]\s*["\']?{re.escape(hex_val)}'
            if re.search(pattern, content):
                violations.append(("G7-2", f"Couleur inline {hex_val} dans style prop — utiliser {token}"))

    # G7-3 : fontSize hardcode alors que token Tailwind existe
    known_sizes = {"200px": "text-stat-2xl", "180px": "text-stat-xl", "120px": "text-stat-lg",
                   "80px": "text-stat-md", "110px": "text-entity", "38px": "text-label", "28px": "text-mono-sm"}
    for px, token in known_sizes.items():
        px_num = px[:-2]
        if re.search(rf'fontSize\s*[:=]\s*["\']?{re.escape(px)}', content) or \
           re.search(rf'fontSize\s*[:=]\s*{re.escape(px_num)}\b', content):
            violations.append(("G7-3", f"fontSize {px} inline dans style prop — utiliser {token}"))

    # G7-4 : width:50% sans flex context (split-screen mal construit)
    if re.search(r'width\s*[:=]\s*["\']?50%', content) and "flex-1" not in content:
        violations.append(("G7-4", "width:50% sans flex-1 detecte — utiliser flex flex-row + flex-1 sur chaque colonne"))

    # G7-5 : marginTop inline pour espacement
    if re.search(r'marginTop\s*[:=]\s*["\']?\d', content):
        violations.append(("G7-5", "marginTop inline detecte — utiliser gap-X Tailwind"))

    return violations


def check_atlas_patterns(tsx_path: str) -> list:
    """
    Vérifie les patterns Atlas obligatoires dans un fichier Beat tsx.
    Retourne une liste de (code, message) pour chaque violation.
    """
    violations = []
    if not Path(tsx_path).exists():
        return violations

    content = Path(tsx_path).read_text()

    # A1 : frameIdx sans Math.max(0, localF)
    # Cherche % frameCount sans Math.max dans la même expression ou ligne
    for line in content.splitlines():
        if "% frameCount" in line or "% frame_count" in line.lower():
            if "Math.max(0" not in line and "Math.max(0," not in content.split(line)[0][-100:]:
                violations.append(("A1", f"frameIdx sans Math.max(0, localF) détecté → index négatif possible : {line.strip()}"))
                break

    # A2 : spring pop absent sur composant sprite (interpolate [0, X, Y])
    has_sprite = "CitySpriteAnimated" in content or "spriteScale" in content or "frameIdx" in content
    has_spring = re.search(r'interpolate\s*\([^,]+,\s*\[0,\s*\d+,\s*\d+\]', content)
    if has_sprite and not has_spring:
        violations.append(("A2", "Sprite détecté mais aucun spring pop interpolate([0,X,Y]) trouvé — utiliser [0,12,45],[0,3.0,1.8]"))

    # A3 : élément visuel potentiellement sans justification script (heuristique légère)
    # Signale si "rat" ou "bateau" ou "fumée" dans le code mais pas dans un commentaire "script:"
    suspicious = ["RatScurry", "BateauSprite", "FuméeSprite"]
    for s in suspicious:
        if s in content:
            violations.append(("A3", f"Composant '{s}' détecté — vérifier qu'il est nommé dans le script audio du beat"))

    return violations


def phase_self_review(episode: str, beat_num: int, video_path: str, is_post_corrections: bool = False) -> int:
    """
    Checklist auto-review Claude AVANT --phase review (Appel Gemini 2)
    ou apres corrections (is_post_corrections=True).
    G7 (Tailwind) : verifie automatiquement par grep — pas de biais possible.
    Atlas patterns (A1-A3) : vérifiés automatiquement.
    G1-G6 : interactif apres extraction de frames automatique.
    Bloque si score < 19/25.
    Bloque si spec-table absente (--phase spec-table requis avant).
    """
    beat = f"beat{beat_num}"

    if not Path(video_path).exists():
        print(f"[ERROR] Video absente : {video_path}", file=sys.stderr)
        sys.exit(1)

    # --- Gate spec-table : bloquant si absent ---
    spec = spec_table_path(episode, beat_num)
    if not spec.exists():
        print(f"\n[BLOQUÉ] Spec-table absente : {spec}", file=sys.stderr)
        print(f"  Le tableau de spécification est OBLIGATOIRE avant self-review.")
        print(f"  Lancer d'abord :")
        print(f"    python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase spec-table")
        sys.exit(1)
    else:
        print(f"[OK] Spec-table trouvée : {spec}")

    # --- Vérifications Atlas patterns (A1-A3) ---
    import glob
    tsx_candidates = glob.glob(f"src/projects/atlas/*/Beat{beat_num}*.tsx") + \
                     glob.glob(f"src/projects/atlas/*/{episode}*/Beat{beat_num}*.tsx")
    if tsx_candidates:
        tsx_path = tsx_candidates[0]
        atlas_violations = check_atlas_patterns(tsx_path)
        if atlas_violations:
            print(f"\n[ATLAS PATTERNS] Violations détectées dans {tsx_path} :")
            for code, msg in atlas_violations:
                print(f"  [{code}] {msg}")
            print("  Corriger avant de continuer.\n")
        else:
            print(f"[OK] Atlas patterns (A1-A3) : aucune violation dans {tsx_path}")

    phase_label = "POST-CORRECTIONS" if is_post_corrections else "PRE-REVIEW"
    print(f"\n=== AUTO-REVIEW CLAUDE [{phase_label}] — {episode} Beat{beat_num} ===")
    print(f"    Video : {video_path}")
    print(f"    Criteres : {len(SELF_REVIEW_CRITERIA)} | Seuil : {SELF_REVIEW_THRESHOLD}/{len(SELF_REVIEW_CRITERIA)}")

    # --- Etape 1 : extraction frames AUTOMATIQUE ---
    frames_dir = Path(f"/tmp/self_review_{episode}_beat{beat_num}")
    frames_dir.mkdir(exist_ok=True)
    print(f"\n[frames] Extraction automatique → {frames_dir}/")
    r = subprocess.run([
        "ffmpeg", "-i", video_path,
        "-vf", "fps=1,scale=432:-1", "-frames:v", "5",
        str(frames_dir / "frame_%02d.jpg"), "-y"
    ], capture_output=True, text=True)
    frames = sorted(frames_dir.glob("frame_*.jpg"))
    if frames:
        print(f"  [OK] {len(frames)} frames extraites :")
        for f in frames:
            print(f"    {f}")
        print(f"\n[INSTRUCTION] Utiliser le Read tool sur chaque frame + ouvrir le storyboard.")
        print(f"              Comparer visuellement AVANT de repondre aux criteres G1-G6.\n")
    else:
        print(f"  [WARN] Extraction frames echouee — analyser la video directement.")

    # --- Etape 2 : G7 Tailwind verifie automatiquement par grep ---
    print(f"--- G7 Tailwind (verification automatique par grep) ---")
    g7_violations = grep_tailwind_violations(episode, beat_num)
    g7_scores = {code: 1 for code, _ in SELF_REVIEW_CRITERIA if code.startswith("G7-")}
    for v_code, _ in g7_violations:
        if v_code in g7_scores:
            g7_scores[v_code] = 0

    if g7_violations:
        for v_code, desc in g7_violations:
            print(f"  [FAIL] [{v_code}] {desc}")
    else:
        print(f"  [OK] Aucune violation Tailwind dans le TSX")

    for code, _ in SELF_REVIEW_CRITERIA:
        if code.startswith("G7-"):
            status = "O" if g7_scores.get(code, 0) == 1 else "X"
            print(f"  [{code}] -> {status} (auto-grep)")

    # --- Etape 3 : G1-G6 interactifs ---
    print(f"\n--- G1-G6 Visuels (repondre apres avoir lu les frames) ---\n")
    scores = []
    fails = []

    for code, crit_label in SELF_REVIEW_CRITERIA:
        if code.startswith("G7-"):
            val = g7_scores.get(code, 0)
            scores.append(val)
            if val == 0:
                desc = next((d for c, d in g7_violations if c == code), crit_label)
                fails.append((code, desc))
            continue

        while True:
            rep = input(f"  [{code}] {crit_label}\n         (O/X/?) : ").strip().upper()
            if rep in ("O", "X", "?"):
                break
        if rep == "O":
            scores.append(1)
        elif rep == "X":
            scores.append(0)
            fails.append((code, crit_label))
        else:
            scores.append(0)
            fails.append((code, f"{crit_label} [INCERTAIN]"))

    total = sum(scores)
    print(f"\n[AUTO-REVIEW] Score : {total}/{len(SELF_REVIEW_CRITERIA)}")

    if fails:
        print(f"\n  Criteres echoues ou incertains :")
        for code, crit_label in fails:
            print(f"    - [{code}] {crit_label}")

    if total < SELF_REVIEW_THRESHOLD:
        print(f"\n[BLOQUE] Score {total} < {SELF_REVIEW_THRESHOLD} — corriger avant de continuer.")
        print(f"         Commande : python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase self-review --video <nouveau_render>")
        # Pas de ntfy — Claude corrige seul
        sys.exit(1)

    # Tracer la self-review post-corrections pour debloquer --phase upload
    if is_post_corrections:
        trace_path = Path(f"/tmp/{episode}-beat{beat_num}-self-review-final.json")
        trace_path.write_text(json.dumps({
            "episode": episode, "beat": beat_num, "score": total,
            "threshold": SELF_REVIEW_THRESHOLD, "status": "PASS", "is_post_corrections": True
        }, ensure_ascii=False, indent=2))
        print(f"\n[OK] Score {total}/{len(SELF_REVIEW_CRITERIA)} — self-review post-corrections tracee.")
        print(f"     Pret pour upload : python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase upload --video {video_path}")
    else:
        print(f"\n[OK] Score {total}/{len(SELF_REVIEW_CRITERIA)} >= {SELF_REVIEW_THRESHOLD} — pret pour Appel Gemini 2.")
        print(f"     python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase review --video {video_path}")

    return total


def phase_upload(episode: str, beat_num: int, video_path: str, gate: dict) -> None:
    """
    Upload render + storyboard sur catbox → ntfy Aziz avec liens.
    Requiert que --phase self-review --post-corrections ait ete lance (trace dans self-review-final.json).
    """
    beat = f"beat{beat_num}"

    if not Path(video_path).exists():
        print(f"[ERROR] Video absente : {video_path}", file=sys.stderr)
        sys.exit(1)

    # Verifier que la self-review post-corrections a ete effectuee
    trace_path = Path(f"/tmp/{episode}-beat{beat_num}-self-review-final.json")
    if not trace_path.exists():
        print(f"\n[WARN] self-review post-corrections non tracee pour {episode} Beat{beat_num}.")
        print(f"       Recommande : lancer d'abord :")
        print(f"       python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase self-review --post-corrections --video {video_path}")
        while True:
            rep = input(f"       Continuer sans self-review post-corrections ? (O=upload quand meme / N=stopper) : ").strip().upper()
            if rep in ("O", "N"):
                break
        if rep == "N":
            sys.exit(0)

    print(f"\n=== UPLOAD + NOTIFY AZIZ — {episode} Beat{beat_num} ===")

    # Extraire 3 frames pour comparaison
    frames_dir = Path(f"/tmp/upload_frames_{episode}_beat{beat_num}")
    frames_dir.mkdir(exist_ok=True)
    subprocess.run([
        "ffmpeg", "-i", video_path,
        "-vf", "fps=1,scale=432:-1",
        "-frames:v", "3",
        str(frames_dir / "frame_%02d.jpg"),
        "-y"
    ], capture_output=True)

    # Upload vidéo sur catbox
    print(f"[upload] Envoi vidéo sur catbox...")
    result = subprocess.run(
        ["curl", "-F", f"reqtype=fileupload", "-F", f"fileToUpload=@{video_path}", "https://catbox.moe/user/api.php"],
        capture_output=True, text=True
    )
    video_url = result.stdout.strip() if result.returncode == 0 else ""

    # Upload storyboard sur catbox
    storyboard_url = ""
    if gate.get("storyboard") and Path(gate["storyboard"]).exists():
        print(f"[upload] Envoi storyboard sur catbox...")
        result2 = subprocess.run(
            ["curl", "-F", "reqtype=fileupload", "-F", f"fileToUpload=@{gate['storyboard']}", "https://catbox.moe/user/api.php"],
            capture_output=True, text=True
        )
        storyboard_url = result2.stdout.strip() if result2.returncode == 0 else ""

    msg = f"Beat{beat_num} prêt — render : {video_url} | storyboard : {storyboard_url}"
    print(f"\n[LINKS]")
    print(f"  Render     : {video_url}")
    print(f"  Storyboard : {storyboard_url}")
    print(f"\n[ntfy] Notification Aziz envoyée.")
    ntfy("beat_done", beat, video_url, msg)


def phase_review(episode: str, beat_num: int, video_path: str, gate: dict) -> None:
    beat = f"beat{beat_num}"

    # Verifier que les assets ont ete resolus (marker present)
    marker = assets_marker_path(episode, beat_num)
    if not marker.exists():
        blocked_path = Path(f"/tmp/{episode}-beat{beat_num}-assets-blocked.json")
        if blocked_path.exists():
            blocked = json.loads(blocked_path.read_text())
            missing = blocked.get("missing_assets", [])
            print(f"\n[BLOQUE] --phase review impossible : assets non resolus.")
            print(f"         Assets manquants : {', '.join(missing)}")
            print(f"\n         Resoudre d'abord :")
            print(f"         python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --resolve-assets \\")
            print(f"           --resolution \"nom_asset=methode:valeur, ...\"")
            ntfy("blocked", beat, "", f"Review bloquee — assets non resolus pour {episode} Beat{beat_num}")
            sys.exit(1)
        else:
            # Pas de marker mais pas de blocked non plus = breakdown propre jamais lance
            print(f"[WARN] Marker assets introuvable. Verifier que --phase breakdown a tourne.")
            print(f"       Continuer quand meme (assume breakdown propre)...")


    if not Path(video_path).exists():
        stop(f"Video ABSENTE : {video_path} — render d'abord", beat)

    print(f"\n=== REVIEW GEMINI {episode} Beat{beat_num} (Appel Gemini 2) ===\n")

    # Review ecrite A COTE du mp4 (<video>.review.json) : c'est l'emplacement que le
    # hook pre-presentation-review.sh verifie pour autoriser la presentation. Survit a /tmp.
    if video_path.endswith(".mp4"):
        output = video_path[:-4] + ".review.json"
    else:
        output = f"/tmp/{episode}-beat{beat_num}-review.json"
    cmd = [
        sys.executable,
        str(SCRIPTS_DIR / "visual_review.py"),
        video_path,
        "--model", "gemini",
        "--storyboard", gate["storyboard"],
        "--frames", "5",
        "--offset", "0.3",
        "--output", output
    ]

    result = subprocess.run(cmd, capture_output=False)
    if result.returncode != 0:
        stop(f"visual_review.py a echoue — verifier les logs ci-dessus", beat)

    review = json.loads(Path(output).read_text())
    score = review.get("score", 0)
    verdict = review.get("verdict", "UNKNOWN")
    r1_violations = review.get("r1_violations", [])

    print(f"\n[REVIEW] Score : {score}/10 — Verdict : {verdict}")

    if r1_violations:
        print(f"[R1] {len(r1_violations)} violation(s) R1 :")
        for v in r1_violations:
            print(f"  - {v.get('segment')} : {v.get('static_duration_s')}s — {v.get('fix')}")

    if score >= 8.0:
        all_fixes = []
        print(f"\n[OK] Score {score} >= 8.0 — corrections a appliquer :")
        for phase_key in ["phase_a", "phase_b", "phase_c"]:
            phase = review.get(phase_key, {})
            for fix in phase.get("fixes", []):
                all_fixes.append(fix)
                print(f"  [{fix.get('priority','?').upper():8s}] {fix.get('element')} — {fix.get('problem')}")
                for k, v in fix.get("code_values", {}).items():
                    if k != "note":
                        print(f"             {k}: {v}")

        print(f"\n[STOP] Appliquer les {len(all_fixes)} correction(s), re-render, puis valider.")
        print(f"       Lancer ensuite : python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase self-review --video <render_corrige>")
        print(f"       Puis upload    : python3 scripts/beat-session.py --episode {episode} --beat {beat_num} --phase upload --video <render_final>")
        # Pas de ntfy ici — Claude applique les corrections en autonome, Aziz sera notifié à l'upload

    else:
        print(f"\n[BLOCKED] Score {score} < 8.0 — intervention manuelle requise.")
        print(f"          Review complete : {output}")
        stop(
            f"Score {score}/10 trop bas — Claude ne peut pas corriger seul.",
            beat,
            event="blocked",
            notify=True  # Seul cas bloquant où Aziz doit intervenir manuellement
        )


def main():
    parser = argparse.ArgumentParser(
        description='beat-session.py — Orchestrateur générique session production Beat Souverain'
    )
    parser.add_argument('--episode', type=str, required=True,
                        help='Slug épisode (ex: silicon-savannah, niger-uranium)')
    parser.add_argument('--beat', type=int, required=True,
                        help='Numéro du beat (ex: 6)')
    parser.add_argument('--phase', choices=['scan', 'preflight', 'breakdown', 'spec-table', 'self-review', 'review', 'upload', 'full'],
                        default='preflight',
                        help='Phase à exécuter (défaut: preflight). scan = Phase 0 templates (OBLIGATOIRE avant breakdown)')
    parser.add_argument('--video', type=str, default=None,
                        help='Chemin vidéo rendue (requis pour --phase review ou full)')
    parser.add_argument('--resolve-assets', action='store_true',
                        help='Marquer les assets manquants comme résolus manuellement (Lucide, Recraft…)')
    parser.add_argument('--resolution', type=str, default='',
                        help='Description des résolutions ex: "icon_person=Lucide:Users, icon_bank=Lucide:Landmark"')
    parser.add_argument('--post-corrections', action='store_true',
                        help='Avec --phase self-review : marque la passe comme post-corrections (débloque --phase upload)')
    args = parser.parse_args()

    if args.resolve_assets:
        phase_resolve_assets(args.episode, args.beat, args.resolution)

    elif args.phase == 'scan':
        phase_scan(args.episode, args.beat)
        print(f"\n[NEXT] Remplir le scan + presenter a Aziz, PUIS :")
        print(f"       python3 scripts/beat-session.py --episode {args.episode} --beat {args.beat} --phase breakdown")

    elif args.phase == 'preflight':
        gate = phase_preflight(args.episode, args.beat)
        print(f"\n[NEXT] Lancer la Phase 0 SCAN (OBLIGATOIRE) : python3 scripts/beat-session.py --episode {args.episode} --beat {args.beat} --phase scan")

    elif args.phase == 'breakdown':
        gate = phase_preflight(args.episode, args.beat)
        phase_breakdown(args.episode, args.beat, gate)

    elif args.phase == 'spec-table':
        phase_spec_table(args.episode, args.beat)

    elif args.phase == 'self-review':
        if not args.video:
            print("[ERROR] --video requis pour --phase self-review", file=sys.stderr)
            sys.exit(1)
        phase_self_review(args.episode, args.beat, args.video, is_post_corrections=args.post_corrections)

    elif args.phase == 'review':
        if not args.video:
            print("[ERROR] --video requis pour --phase review", file=sys.stderr)
            sys.exit(1)
        gate = phase_preflight(args.episode, args.beat)
        phase_review(args.episode, args.beat, args.video, gate)

    elif args.phase == 'upload':
        if not args.video:
            print("[ERROR] --video requis pour --phase upload", file=sys.stderr)
            sys.exit(1)
        gate = phase_preflight(args.episode, args.beat)
        phase_upload(args.episode, args.beat, args.video, gate)

    elif args.phase == 'full':
        if not args.video:
            print("[ERROR] --video requis pour --phase full", file=sys.stderr)
            sys.exit(1)
        gate = phase_preflight(args.episode, args.beat)
        phase_breakdown(args.episode, args.beat, gate)
        phase_review(args.episode, args.beat, args.video, gate)


if __name__ == '__main__':
    main()
