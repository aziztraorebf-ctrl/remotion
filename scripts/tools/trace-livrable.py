#!/usr/bin/env python3
"""
trace-livrable.py — Trace quel script/version a VRAIMENT servi a un rendu final.

Probleme root-cause (audit 2026-07-11) : un fichier nomme "SCRIPT-V4-FINAL.md" peut
ne PAS etre celui qui a servi au rendu promu si une V5 existe et qu'aucune trace
mecanique ne le confirme. Le nom de fichier est une convention humaine, pas une preuve.
Cas reel : War-Map Sahel AES — "V4-FINAL-2026-06-07.md" n'avait pas servi, c'est
"V5-LINEAIRE-2026-06-10.md" qui faisait foi (narration reelle = narration-v5-expressive.mp3),
decouvert seulement en extrayant l'audio du rendu et en cherchant le nom du fichier
audio importe dans le code de la composition.

METHODE (2 sources croisees, jamais une seule) :
1. CODE : cherche le/les Composition dans src/Root.tsx dont le nom ressemble au
   nom du livrable, lit le fichier .tsx du composant, extrait tous les staticFile(...)
   qui pointent vers un .mp3 de narration (heuristique : contient "narration" ou le nom
   d'episode, exclut sfx/music/impact/ambient).
2. AUDIO REEL : extrait l'audio du .mp4 fourni (ffmpeg), le transcrit (Whisper API),
   puis compare ce texte a chaque candidat SCRIPT-V*.md du dossier episode (similarite
   de sequence sur les mots, difflib — pas de jugement de sens, une mesure mecanique).

Sortie : classement des candidats par score de similarite + le nom du fichier audio
reellement importe dans le code (si trouvable) — les deux doivent converger vers la
MEME version. Si le meilleur score texte ET le fichier audio importe ne pointent pas
vers le meme candidat, c'est signale comme une DIVERGENCE A VERIFIER MANUELLEMENT.

Usage :
  python3 scripts/tools/trace-livrable.py out/PRET-PUBLICATION/mon-episode-FINAL.mp4 \
      --episode-dir memory/episodes/mon-pilier/mon-episode/ \
      [--composition-id NomDeLaComposition] [--skip-transcription]

Sans --composition-id, tente de deviner via le nom du fichier livrable (best-effort,
signale si la devinette est incertaine plutot que d'affirmer a tort).

Necessite : ffmpeg/ffprobe installes, OPENAI_API_KEY dans l'environnement (Whisper API)
sauf si --skip-transcription (dans ce cas seule la source CODE est utilisee).
"""
import argparse
import difflib
import os
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
ROOT_TSX = REPO_ROOT / "src" / "Root.tsx"

RED = "\033[91m"; YEL = "\033[93m"; GRN = "\033[92m"; DIM = "\033[2m"; BOLD = "\033[1m"; RST = "\033[0m"

# Mots-cles qui excluent un staticFile(...) mp3 candidat "narration"
NON_NARRATION_HINTS = ("sfx", "sound-effect", "music", "musique", "impact", "ambient",
                        "ambiance", "whoosh", "ink-spread", "reveal", "drone")


def err(msg):
    print(f"{RED}ERROR{RST} {msg}", file=sys.stderr)


def warn(msg):
    print(f"{YEL}WARN{RST} {msg}")


def info(msg):
    print(f"{DIM}{msg}{RST}")


def guess_composition_id(mp4_path: Path) -> str | None:
    """Devine un id de composition plausible depuis le nom du fichier livrable.
    Best-effort seulement — signale l'incertitude, n'affirme jamais."""
    stem = mp4_path.stem
    stem = re.sub(r"-FINAL$|-final$", "", stem)
    tokens = re.split(r"[-_]", stem)
    candidates = [
        "".join(t.capitalize() for t in tokens),
        "".join(t.capitalize() for t in tokens if t.lower() not in ("v1", "v2", "v3", "v4", "v5")),
    ]
    if not ROOT_TSX.exists():
        return None
    root_src = ROOT_TSX.read_text(encoding="utf-8")
    for cand in candidates:
        if f'id="{cand}"' in root_src or f"id='{cand}'" in root_src:
            return cand
    # Recherche floue : composition dont l'id contient le premier token significatif
    if tokens:
        key = tokens[0]
        matches = re.findall(rf'id="([^"]*{re.escape(key)}[^"]*)"', root_src, re.IGNORECASE)
        if len(matches) == 1:
            return matches[0]
        if len(matches) > 1:
            warn(f"Plusieurs compositions correspondent a '{key}' : {matches} — precise --composition-id.")
    return None


def find_component_file(composition_id: str) -> Path | None:
    """Trouve le fichier .tsx du composant associe a une Composition dans Root.tsx."""
    if not ROOT_TSX.exists():
        return None
    root_src = ROOT_TSX.read_text(encoding="utf-8")
    m = re.search(rf'id="{re.escape(composition_id)}"[^/]*component=\{{(\w+)\}}', root_src)
    if not m:
        return None
    component_name = m.group(1)
    import_m = re.search(rf'import\s*\{{[^}}]*\b{re.escape(component_name)}\b[^}}]*\}}\s*from\s*["\']([^"\']+)["\']', root_src)
    if not import_m:
        return None
    rel_path = import_m.group(1)
    for suffix in (".tsx", ".ts", "/index.tsx"):
        candidate = (ROOT_TSX.parent / rel_path).resolve()
        candidate = candidate.with_suffix("") if candidate.suffix else candidate
        full = Path(str(candidate) + suffix) if not suffix.startswith("/") else candidate.parent / candidate.name / suffix.lstrip("/")
        if full.exists():
            return full
    return None


def extract_narration_staticfiles(component_path: Path) -> list[str]:
    """Extrait les staticFile(...) .mp3 qui ressemblent a de la narration (pas SFX/musique)."""
    src = component_path.read_text(encoding="utf-8")
    all_mp3 = re.findall(r'staticFile\(["\']([^"\']+\.mp3)["\']\)', src)
    narration = [p for p in all_mp3 if not any(h in p.lower() for h in NON_NARRATION_HINTS)]
    return narration or all_mp3  # si tout a ete filtre, retourner la liste brute plutot que rien


def extract_audio(mp4_path: Path, out_wav: Path) -> bool:
    cmd = ["ffmpeg", "-y", "-i", str(mp4_path), "-vn", "-acodec", "pcm_s16le",
           "-ar", "16000", "-ac", "1", str(out_wav)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        err(f"ffmpeg a echoue sur {mp4_path} : {r.stderr[-500:]}")
        return False
    return True


def transcribe_whisper_api(wav_path: Path) -> str | None:
    try:
        import openai
    except ImportError:
        err("Le package openai n'est pas installe (pip install openai) — utilise --skip-transcription.")
        return None
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        err("OPENAI_API_KEY absent de l'environnement — utilise --skip-transcription.")
        return None
    client = openai.OpenAI(api_key=api_key)
    with open(wav_path, "rb") as f:
        result = client.audio.transcriptions.create(
            model="whisper-1", file=f, language="fr", response_format="text",
        )
    return result if isinstance(result, str) else str(result)


def normalize_text(text: str) -> list[str]:
    text = text.lower()
    text = re.sub(r"[^\w\sàâäéèêëïîôöùûüçñ]", " ", text)
    return [w for w in text.split() if w]


def score_candidate(rendered_words: list[str], candidate_path: Path) -> float:
    candidate_text = candidate_path.read_text(encoding="utf-8", errors="ignore")
    # Retirer le markdown structurel grossier (titres, listes techniques) — heuristique legere,
    # le score reste une mesure mecanique de similarite de mots, pas un jugement de contenu.
    candidate_text = re.sub(r"^#{1,6}\s.*$", "", candidate_text, flags=re.MULTILINE)
    candidate_words = normalize_text(candidate_text)
    if not candidate_words or not rendered_words:
        return 0.0
    matcher = difflib.SequenceMatcher(None, rendered_words, candidate_words, autojunk=False)
    return matcher.ratio()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("mp4", type=Path, help="Chemin du rendu final (.mp4)")
    ap.add_argument("--episode-dir", type=Path, required=True,
                     help="Dossier episode contenant les candidats SCRIPT-V*.md")
    ap.add_argument("--composition-id", default=None,
                     help="Id de la Composition Remotion (sinon devine depuis le nom du fichier)")
    ap.add_argument("--skip-transcription", action="store_true",
                     help="Ne pas transcrire l'audio (utilise seulement la source CODE)")
    args = ap.parse_args()

    if not args.mp4.exists():
        err(f"Fichier introuvable : {args.mp4}")
        sys.exit(2)
    if not args.episode_dir.exists():
        err(f"Dossier episode introuvable : {args.episode_dir}")
        sys.exit(2)

    print(f"{BOLD}=== trace-livrable : {args.mp4.name} ==={RST}\n")

    # --- Source 1 : CODE ---
    composition_id = args.composition_id or guess_composition_id(args.mp4)
    narration_files = []
    if composition_id:
        print(f"Composition detectee : {BOLD}{composition_id}{RST}")
        component_path = find_component_file(composition_id)
        if component_path:
            print(f"Composant source : {component_path.relative_to(REPO_ROOT)}")
            narration_files = extract_narration_staticfiles(component_path)
            if narration_files:
                print(f"Audio narration importe dans le code : {GRN}{narration_files}{RST}")
            else:
                warn("Aucun staticFile(...) .mp3 trouve dans le composant.")
        else:
            warn(f"Composant introuvable pour la composition '{composition_id}' dans Root.tsx.")
    else:
        warn("Impossible de deviner la composition — passe --composition-id explicitement.")

    # --- Candidats scripts ---
    candidates = sorted(args.episode_dir.glob("SCRIPT-V*.md")) + sorted(args.episode_dir.glob("SCRIPT-V*.txt"))
    if not candidates:
        candidates = sorted(args.episode_dir.glob("*script*.md"))
    if not candidates:
        err(f"Aucun candidat SCRIPT-V*.md trouve dans {args.episode_dir}")
        sys.exit(1)
    print(f"\n{len(candidates)} candidat(s) trouve(s) : {[c.name for c in candidates]}")

    # --- Match par nom de fichier audio (si narration_files trouve un motif de version) ---
    version_from_audio = None
    for nf in narration_files:
        vm = re.search(r"[vV](\d+)", Path(nf).stem)
        if vm:
            version_from_audio = vm.group(1)
            break

    best_by_name = None
    if version_from_audio:
        for c in candidates:
            if re.search(rf"[vV]{version_from_audio}\b", c.stem):
                best_by_name = c
                break
        if best_by_name:
            print(f"\nIndice nom de fichier audio → version {BOLD}V{version_from_audio}{RST} → candidat {GRN}{best_by_name.name}{RST}")
        else:
            warn(f"Le nom audio suggere V{version_from_audio} mais aucun candidat SCRIPT-V{version_from_audio}* trouve.")

    # --- Source 2 : AUDIO REEL (transcription + diff) ---
    best_by_text = None
    if not args.skip_transcription:
        import tempfile
        with tempfile.TemporaryDirectory() as tmpdir:
            wav_path = Path(tmpdir) / "audio.wav"
            print(f"\nExtraction audio ({args.mp4.name})...")
            if extract_audio(args.mp4, wav_path):
                print("Transcription Whisper en cours...")
                transcript = transcribe_whisper_api(wav_path)
                if transcript:
                    rendered_words = normalize_text(transcript)
                    print(f"Transcript ({len(rendered_words)} mots) obtenu.\n")
                    scores = [(c, score_candidate(rendered_words, c)) for c in candidates]
                    scores.sort(key=lambda x: -x[1])
                    print(f"{BOLD}Classement par similarite texte (audio reel vs script) :{RST}")
                    for c, s in scores:
                        bar = "#" * int(s * 40)
                        print(f"  {s:.1%}  {bar:<40} {c.name}")
                    best_by_text = scores[0][0] if scores else None
    else:
        info("Transcription sautee (--skip-transcription) — verdict base sur le CODE seul.")

    # --- Verdict final ---
    print(f"\n{BOLD}=== VERDICT ==={RST}")
    if best_by_text and best_by_name:
        same_version = re.search(r"[vV](\d+)", best_by_text.stem)
        same_version = same_version and same_version.group(1) == version_from_audio
        if best_by_text == best_by_name:
            print(f"{GRN}CONVERGENCE{RST} : les 2 sources (code + audio transcrit) pointent vers {BOLD}{best_by_text.name}{RST}.")
        elif same_version:
            print(f"{GRN}CONVERGENCE DE VERSION{RST} (fichiers differents, meme version V{version_from_audio}) : "
                  f"le nom audio pointe vers {best_by_name.name}, le texte le plus proche est {best_by_text.name} — "
                  f"probablement 2 formats du MEME script (ex: version taggee TTS vs version production annotee). "
                  f"NOTE : un candidat charge de notes de mise en scene/decisions de production (hors texte oral pur) "
                  f"scorera mecaniquement plus bas au diff de mots meme s'il s'agit de la bonne version — "
                  f"verifier qu'ils partagent bien les memes passages-cles avant de conclure a une vraie divergence.")
        else:
            print(f"{RED}DIVERGENCE DE VERSION A VERIFIER MANUELLEMENT{RST} : le nom du fichier audio suggere "
                  f"la version V{version_from_audio} ({best_by_name.name}), mais la transcription est LE PLUS PROCHE "
                  f"d'une version differente ({best_by_text.name}). Ne pas trancher automatiquement — comparer les "
                  f"2 textes a la main.")
            sys.exit(1)
    elif best_by_text:
        print(f"Meilleur candidat (texte transcrit) : {BOLD}{best_by_text.name}{RST}")
    elif best_by_name:
        print(f"Meilleur candidat (nom fichier audio) : {BOLD}{best_by_name.name}{RST} — non confirme par transcription.")
    else:
        warn("Aucune source n'a permis de trancher. Verifier manuellement.")
        sys.exit(1)


if __name__ == "__main__":
    main()
