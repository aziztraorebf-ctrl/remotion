#!/usr/bin/env python3
"""
Pre-generation validation gates for the video production pipeline.

Prevents wasted API spend ($3-5/clip Seedance, $0.01-0.05/call Gemini) by catching
bad inputs before they hit external services. Each gate is independently testable
and returns a structured (passed, reason) result.

Usage as module:
    from scripts.pipeline_gates import pre_seedance_check, pre_gemini_check

Usage standalone:
    python scripts/pipeline_gates.py
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from math import ceil
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Project root (two levels up from scripts/)
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MIN_PROMPT_LENGTH_LONG = 2000   # clips >= 6s
MIN_PROMPT_LENGTH_SHORT = 1000  # clips < 6s
MIN_PARAGRAPHS = 3

MAIN_STYLE_STRING = (
    "2D vivid flat anime illustration, painted graphic novel, "
    "bold clean outlines, cel-shaded flat colors"
)

ANTI_ARTIFACT_CLAUSES: list[str] = [
    "no morphing",
    "RIGID",
    "no crown",
    "no deformation",
    "maintain proportions",
    "no face distortion",
    "no extra limbs",
    "no melting",
    "no warping",
    # NOTE: "no music" intentionally OMITTED — we use keep-and-duck strategy
    # (Seedance audio at 30% under narration). generate_audio=True is correct.
]

REVERSE_BIAS_TRIGGERS: list[str] = [
    "au sol",
    "tombe",
    "tombee",
    "fallen",
    "on the ground",
    "brise",
    "broken",
    "collapse",
    "effondre",
    "a terre",
    "renverse",
    "overturned",
    "uprooted",
    "deracine",
]

NEUTRAL_BG_MARKERS: list[str] = [
    "neutral",
    "white-bg",
    "white_bg",
    "whitebg",
    "sheet",
    "turnaround",
    "t-pose",
    "tpose",
    "blank",
    "isolated",
]

MAX_SEEDANCE_IMAGE_REFS = 9

# ---------------------------------------------------------------------------
# Canonical character reference registry
# ---------------------------------------------------------------------------

CANONICAL_REFS: dict[str, Path] = {
    "soundjata": (
        ROOT / "public" / "assets" / "library" / "geoafrique"
        / "heros-oublies" / "soundjata" / "refs" / "soundjata-combat-ref.png"
    ),
    "soundjata-enfant": (
        ROOT / "public" / "assets" / "library" / "geoafrique"
        / "heros-oublies" / "soundjata" / "refs" / "acte1" / "soundjata-baby-ref.png"
    ),
    "soumaoro": (
        ROOT / "public" / "assets" / "library" / "geoafrique"
        / "heros-oublies" / "soundjata" / "refs" / "soumaoro-combat-ref.png"
    ),
    "lat-dior": (
        ROOT / "tmp" / "yaroflasher-test" / "ref1-latdior-historical-sheet.png"
    ),
}


# ---------------------------------------------------------------------------
# Gate result type
# ---------------------------------------------------------------------------

@dataclass
class GateResult:
    """Result of a single validation gate."""

    gate: str
    passed: bool
    reason: str
    details: dict[str, Any] = field(default_factory=dict)

    def __str__(self) -> str:
        status = "PASS" if self.passed else "FAIL"
        return f"[{status}] {self.gate}: {self.reason}"


# ---------------------------------------------------------------------------
# Gate 1 -- Prompt Length & Structure (Seedance)
# ---------------------------------------------------------------------------

def gate_prompt_structure(prompt: str, clip_duration: float = 10.0) -> GateResult:
    """Validate that the Seedance prompt meets minimum length, paragraph,
    anti-artifact, and style-string requirements.

    The minimum prompt length scales with clip duration:
      - Clips < 6s: 1000 chars min (short scenes, fewer shots)
      - Clips >= 6s: 2000 chars min (multi-shot, needs detail)
    """

    failures: list[str] = []

    # Length check — adaptive threshold based on clip duration
    min_length = MIN_PROMPT_LENGTH_SHORT if clip_duration < 6.0 else MIN_PROMPT_LENGTH_LONG
    length = len(prompt)
    if length < min_length:
        failures.append(
            f"Prompt too short: {length} chars (min {min_length} for {clip_duration}s clip)"
        )

    # Paragraph count (non-empty blocks separated by blank lines)
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", prompt) if p.strip()]
    if len(paragraphs) < MIN_PARAGRAPHS:
        failures.append(
            f"Too few paragraphs: {len(paragraphs)} (min {MIN_PARAGRAPHS})"
        )

    # Anti-artifact clause
    prompt_lower = prompt.lower()
    has_anti_artifact = any(
        clause.lower() in prompt_lower for clause in ANTI_ARTIFACT_CLAUSES
    )
    if not has_anti_artifact:
        failures.append(
            "Missing anti-artifact clause (e.g. 'no morphing', 'RIGID')"
        )

    # Main style string
    if MAIN_STYLE_STRING.lower() not in prompt_lower:
        failures.append(
            f"Missing main style string: '{MAIN_STYLE_STRING[:50]}...'"
        )

    if failures:
        return GateResult(
            gate="prompt_structure",
            passed=False,
            reason="; ".join(failures),
            details={
                "length": length,
                "paragraphs": len(paragraphs),
                "has_anti_artifact": has_anti_artifact,
            },
        )

    return GateResult(
        gate="prompt_structure",
        passed=True,
        reason=f"OK ({length} chars, {len(paragraphs)} paragraphs)",
        details={
            "length": length,
            "paragraphs": len(paragraphs),
            "has_anti_artifact": True,
        },
    )


# ---------------------------------------------------------------------------
# Gate 2 -- Canonical Character Reference
# ---------------------------------------------------------------------------

def gate_canonical_ref(
    character_name: str,
    input_refs: list[str | Path],
) -> GateResult:
    """Verify that the canonical character sheet is present in the input refs."""

    name_lower = character_name.lower().strip()

    if name_lower not in CANONICAL_REFS:
        return GateResult(
            gate="canonical_ref",
            passed=False,
            reason=f"Unknown character '{character_name}'. "
                   f"Known: {', '.join(CANONICAL_REFS.keys())}",
        )

    canonical_path = CANONICAL_REFS[name_lower]

    # Check file existence on disk
    if not canonical_path.exists():
        return GateResult(
            gate="canonical_ref",
            passed=False,
            reason=f"Canonical ref file missing on disk: {canonical_path}",
        )

    # Check inclusion in input refs (resolve to compare absolute paths)
    resolved_refs = [Path(r).resolve() for r in input_refs]
    if canonical_path.resolve() not in resolved_refs:
        return GateResult(
            gate="canonical_ref",
            passed=False,
            reason=(
                f"Canonical ref for '{character_name}' not in input refs. "
                f"Expected: {canonical_path.name}"
            ),
            details={"canonical_path": str(canonical_path)},
        )

    return GateResult(
        gate="canonical_ref",
        passed=True,
        reason=f"Canonical ref for '{character_name}' present",
    )


# ---------------------------------------------------------------------------
# Gate 3 -- Duration Match (clip >= narration)
# ---------------------------------------------------------------------------

def gate_duration_match(
    clip_duration: float,
    narration_duration: float,
) -> GateResult:
    """Verify clip duration covers the narration. Flag splits needed for >15s."""

    required = ceil(narration_duration)
    needs_split = narration_duration > 15.0

    failures: list[str] = []

    if clip_duration < required:
        failures.append(
            f"Clip too short: {clip_duration}s < ceil({narration_duration}s) = {required}s"
        )

    if needs_split:
        failures.append(
            f"Narration > 15s ({narration_duration}s) -- must split into 2 clips"
        )

    if failures:
        return GateResult(
            gate="duration_match",
            passed=False,
            reason="; ".join(failures),
            details={
                "clip_duration": clip_duration,
                "narration_duration": narration_duration,
                "required": required,
                "needs_split": needs_split,
            },
        )

    return GateResult(
        gate="duration_match",
        passed=True,
        reason=f"OK (clip={clip_duration}s >= narration ceil={required}s)",
        details={"needs_split": needs_split},
    )


# ---------------------------------------------------------------------------
# Gate 4 -- Reverse Bias Detection
# ---------------------------------------------------------------------------

def gate_reverse_bias(prompt: str) -> GateResult:
    """Scan for keywords that trigger Seedance reverse-bias behavior.

    Seedance tends to 'stand back up' any object described as fallen, broken,
    or on the ground. This gate flags those trigger words so the prompt can be
    rewritten to avoid the artifact.
    """

    prompt_lower = prompt.lower()
    found: list[str] = []

    for trigger in REVERSE_BIAS_TRIGGERS:
        # Use word-boundary-like matching to reduce false positives
        pattern = re.compile(
            r"(?<!\w)" + re.escape(trigger.lower()) + r"(?!\w)"
        )
        if pattern.search(prompt_lower):
            found.append(trigger)

    if found:
        return GateResult(
            gate="reverse_bias",
            passed=False,
            reason=f"Reverse-bias triggers found: {', '.join(found)}",
            details={"triggers": found},
        )

    return GateResult(
        gate="reverse_bias",
        passed=True,
        reason="No reverse-bias triggers detected",
    )


# ---------------------------------------------------------------------------
# Gate 5 -- Seedance Input Validation
# ---------------------------------------------------------------------------

MAX_SEEDANCE_VIDEO_REFS = 3
MAX_SEEDANCE_VIDEO_CUMUL_S = 15.0
MAX_SEEDANCE_AUDIO_REFS = 3
MAX_SEEDANCE_TOTAL_SIZE_MB = 50.0


def gate_seedance_inputs(
    image_refs: list[str | Path],
    video_refs: list[str | Path] | None = None,
    audio_refs: list[str | Path] | None = None,
    is_chaining: bool = False,
    chaining_ref_type: str | None = None,
) -> GateResult:
    """Validate Seedance API input constraints.

    Limits (from Seedance 2.0 Omni spec, seedance-rules.md Rule 59):
    - Max 9 image refs
    - Max 3 video refs, cumulative duration <= 15s
    - Max 3 audio refs
    - Total file size <= 50MB
    - No image labeled/named 'style' (would be animated as a scene)
    - For chaining: must use an IMAGE (last frame), not a VIDEO ref
    """

    failures: list[str] = []
    video_refs = video_refs or []
    audio_refs = audio_refs or []

    # Max image refs
    if len(image_refs) > MAX_SEEDANCE_IMAGE_REFS:
        failures.append(
            f"Too many image refs: {len(image_refs)} (max {MAX_SEEDANCE_IMAGE_REFS})"
        )

    # Max video refs
    if len(video_refs) > MAX_SEEDANCE_VIDEO_REFS:
        failures.append(
            f"Too many video refs: {len(video_refs)} (max {MAX_SEEDANCE_VIDEO_REFS})"
        )

    # Max audio refs
    if len(audio_refs) > MAX_SEEDANCE_AUDIO_REFS:
        failures.append(
            f"Too many audio refs: {len(audio_refs)} (max {MAX_SEEDANCE_AUDIO_REFS})"
        )

    # Check for 'style' in image ref filenames
    for ref in image_refs:
        name = Path(ref).stem.lower()
        if "style" in name:
            failures.append(
                f"Image ref '{Path(ref).name}' contains 'style' in name -- "
                f"Seedance will animate it as a scene. Rename or remove."
            )

    # Total file size check (all refs combined)
    total_size_bytes = 0
    for ref in [*image_refs, *video_refs, *audio_refs]:
        p = Path(ref)
        if p.exists():
            total_size_bytes += p.stat().st_size
    total_size_mb = total_size_bytes / (1024 * 1024)
    if total_size_mb > MAX_SEEDANCE_TOTAL_SIZE_MB:
        failures.append(
            f"Total ref size too large: {total_size_mb:.1f}MB (max {MAX_SEEDANCE_TOTAL_SIZE_MB}MB)"
        )

    # Chaining validation
    if is_chaining and chaining_ref_type:
        ref_lower = chaining_ref_type.lower()
        if ref_lower == "video":
            failures.append(
                "Chaining must use an IMAGE (last frame), not a VIDEO ref. "
                "Extract the last frame first."
            )

    if failures:
        return GateResult(
            gate="seedance_inputs",
            passed=False,
            reason="; ".join(failures),
            details={
                "image_ref_count": len(image_refs),
                "video_ref_count": len(video_refs),
                "audio_ref_count": len(audio_refs),
                "total_size_mb": round(total_size_mb, 1),
            },
        )

    return GateResult(
        gate="seedance_inputs",
        passed=True,
        reason=f"OK ({len(image_refs)} images, {len(video_refs)} videos, {len(audio_refs)} audios, {total_size_mb:.1f}MB)",
    )


# ---------------------------------------------------------------------------
# Gate 6 -- Character Ref Context (no neutral background)
# ---------------------------------------------------------------------------

def gate_character_ref_context(
    ref_paths: list[str | Path],
    has_environment: bool | None = None,
) -> GateResult:
    """Check that character refs have contextual backgrounds, not neutral/white.

    If has_environment is explicitly provided, uses that flag.
    Otherwise inspects filenames for neutral-background markers.
    """

    if has_environment is True:
        return GateResult(
            gate="character_ref_context",
            passed=True,
            reason="Environment flag explicitly set",
        )

    if has_environment is False:
        return GateResult(
            gate="character_ref_context",
            passed=False,
            reason="Character ref has no contextual environment (explicit flag)",
        )

    # Inspect filenames
    flagged: list[str] = []
    for ref in ref_paths:
        stem = Path(ref).stem.lower()
        for marker in NEUTRAL_BG_MARKERS:
            if marker in stem:
                flagged.append(f"{Path(ref).name} (marker: '{marker}')")
                break

    if flagged:
        return GateResult(
            gate="character_ref_context",
            passed=False,
            reason=f"Neutral-background refs detected: {', '.join(flagged)}",
            details={"flagged_refs": flagged},
        )

    return GateResult(
        gate="character_ref_context",
        passed=True,
        reason="All refs appear to have contextual backgrounds",
    )


# ---------------------------------------------------------------------------
# Gate 7 -- Chain Continuity (intra-acte clip sequencing)
# ---------------------------------------------------------------------------

def gate_chain_continuity(
    previous_clip_path: str | Path | None,
    is_chained: bool,
    last_frame_suffix: str = ".last-frame.png",
) -> GateResult:
    """For chained clips within an acte, verify that the previous clip exists
    and its last frame has been extracted as an image ref.

    Args:
        previous_clip_path: Path to the previous clip in the chain.
        is_chained: Whether this clip depends on a preceding clip.
        last_frame_suffix: Expected suffix for the extracted last frame file.
    """

    if not is_chained:
        return GateResult(
            gate="chain_continuity",
            passed=True,
            reason="Not a chained clip",
        )

    if not previous_clip_path:
        return GateResult(
            gate="chain_continuity",
            passed=False,
            reason="Chained clip declared but no previous_clip_path provided",
        )

    prev = Path(previous_clip_path)

    if not prev.exists():
        return GateResult(
            gate="chain_continuity",
            passed=False,
            reason=f"Previous clip not found: {prev.name}",
            details={"expected_path": str(prev)},
        )

    last_frame = prev.with_suffix(last_frame_suffix)

    if not last_frame.exists():
        return GateResult(
            gate="chain_continuity",
            passed=False,
            reason=(
                f"Last frame not extracted from {prev.name}. "
                f"Expected: {last_frame.name}. "
                f"Run: ffmpeg -sseof -0.1 -i '{prev}' -frames:v 1 '{last_frame}'"
            ),
            details={
                "clip_path": str(prev),
                "expected_last_frame": str(last_frame),
            },
        )

    return GateResult(
        gate="chain_continuity",
        passed=True,
        reason=f"Chain ref ready: {last_frame.name}",
        details={"last_frame_path": str(last_frame)},
    )


# ---------------------------------------------------------------------------
# Gate 8 -- fal.ai Balance Check
# ---------------------------------------------------------------------------

def gate_fal_balance(
    estimated_cost: float,
    min_buffer: float = 2.0,
) -> GateResult:
    """Check that fal.ai account has enough balance for the planned spend.

    Reads FAL_KEY from env, queries the billing endpoint. If the endpoint
    is unreachable or the key is missing, returns a warning (PASS with note)
    rather than blocking — the API call itself will fail with a 403 if broke.

    Args:
        estimated_cost: Estimated cost in USD for this batch.
        min_buffer: Minimum balance above estimated_cost to pass ($2 default).
    """

    fal_key = os.environ.get("FAL_KEY")
    if not fal_key:
        # Try loading from .env
        env_file = ROOT / ".env"
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                line = line.strip()
                if line.startswith("FAL_KEY="):
                    fal_key = line.split("=", 1)[1].strip()
                    break

    if not fal_key:
        return GateResult(
            gate="fal_balance",
            passed=True,
            reason="FAL_KEY not found — skipping balance check (will fail at API call if broke)",
            details={"warning": True},
        )

    import urllib.request
    import urllib.error

    required = estimated_cost + min_buffer

    try:
        req = urllib.request.Request(
            "https://rest.alpha.fal.ai/billing/balance",
            headers={"Authorization": f"Key {fal_key}"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            import json
            data = json.loads(resp.read().decode("utf-8"))
            balance = float(data.get("balance", 0))

            if balance < required:
                return GateResult(
                    gate="fal_balance",
                    passed=False,
                    reason=f"fal.ai balance too low: ${balance:.2f} < ${required:.2f} needed (${estimated_cost:.2f} estimated + ${min_buffer:.2f} buffer)",
                    details={"balance": balance, "required": required},
                )

            return GateResult(
                gate="fal_balance",
                passed=True,
                reason=f"fal.ai balance OK: ${balance:.2f} (need ${required:.2f})",
                details={"balance": balance, "required": required},
            )

    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        return GateResult(
            gate="fal_balance",
            passed=True,
            reason=f"Could not check fal.ai balance ({exc}) — proceeding with caution",
            details={"warning": True, "error": str(exc)},
        )


# ---------------------------------------------------------------------------
# Gate 9 -- TTS French Script Scan (ElevenLabs)
# ---------------------------------------------------------------------------

# Participes passes en "e/ee" — ElevenLabs drop l'accent final en francais
_PARTICIPE_PATTERN = re.compile(
    r"\b\w+(?:e|ee|ees)(?:\s*[.,;:!?\-]|\s+[A-Z]|\s*$)",
    re.MULTILINE,
)

# Common safe words ending in "e" that are NOT problematic participes
_SAFE_E_WORDS: set[str] = {
    # Determinants, pronoms, conjonctions
    "le", "de", "ne", "ce", "se", "je", "me", "te", "que", "une",
    "elle", "comme", "cette", "entre", "autre", "meme",
    # Noms communs en -e/-ie/-te/-re (accent naturel, pas de drop)
    "monde", "terre", "pere", "mere", "frere", "homme", "femme", "arbre",
    "guerre", "pierre", "fleche", "masse", "passe", "place",
    "force", "source", "prince", "ville", "famille", "histoire",
    "partie", "vie", "voie", "chose", "phrase", "garde", "porte",
    "suite", "route", "forme", "ligne", "base", "face", "race",
    "classe", "phrase", "sorte", "perte", "reste",
    # Noms en -ie (prophetie, tyrannie, etc. = accent naturel)
    "prophetie", "tyrannie", "jalousie", "folie", "magie",
    "categorie", "garantie", "compagnie", "colonie", "harmonie",
    # Noms en -te / -ite (liberte, dignite, etc.)
    "liberte", "dignite", "verite", "securite", "autorite",
    "societe", "communaute", "qualite", "quantite", "cite",
    "majeste", "fierte", "beaute", "cruaute", "pauvrete",
    # Nombres en lettres
    "trente", "quarante", "cinquante", "soixante",
    # Verbes courants
    "faire", "dire", "mettre", "prendre", "connaitre",
    "naitre", "paraitre", "disparaitre", "vivre", "suivre",
    "etre", "oire", "oire",
    # Autres mots courants
    "encore", "ensemble", "derriere", "desserre", "empire",
    "titre", "chapitre", "centre", "ministre", "maitre",
    "ordre", "cadre", "registre", "arbitre", "nombre",
}

# "ont + voyelle" — creates weird liaison in ElevenLabs
_ONT_VOYELLE_PATTERN = re.compile(r"\bont\s+[aeiouyAEIOUY]", re.IGNORECASE)

# Numbers that should be written as words for TTS
_NUMBER_PATTERN = re.compile(r"\b\d{2,}\b")


def gate_tts_french_scan(script: str) -> GateResult:
    """Scan a French TTS script for known ElevenLabs pronunciation traps.

    Checks:
    1. Participes passes en "e/ee" at end of phrase (accent drop)
    2. "ont + voyelle" sequences (bad liaison)
    3. Numbers not written as words (robotic reading)

    Returns FAIL with specific locations so the script can be fixed.
    """

    issues: list[str] = []

    # Check 1: Participes passes ending phrases
    problematic_participes: list[str] = []
    for line in script.split("\n"):
        words = re.findall(r"\b(\w+e(?:e|es)?)\b", line, re.IGNORECASE)
        for word in words:
            w_lower = word.lower()
            if w_lower in _SAFE_E_WORDS:
                continue
            if len(w_lower) < 4:
                continue
            # Check if word ends a phrase (before punctuation or end of line)
            pattern = re.compile(
                r"\b" + re.escape(word) + r"\s*[.,;:!?\-\"]",
                re.IGNORECASE,
            )
            if pattern.search(line):
                problematic_participes.append(word)

    if problematic_participes:
        unique = list(dict.fromkeys(problematic_participes))[:8]
        issues.append(
            f"Participes 'e/ee' en fin de groupe ({len(problematic_participes)} found): "
            f"{', '.join(unique)}. ElevenLabs drop l'accent final. "
            f"Reformuler avec verbe conjugue."
        )

    # Check 2: "ont + voyelle"
    ont_matches = _ONT_VOYELLE_PATTERN.findall(script)
    if ont_matches:
        issues.append(
            f"'ont + voyelle' ({len(ont_matches)}x): liaison bizarre. "
            f"Remplacer par passe simple (ex: 'ont accede' -> 'accederent')"
        )

    # Check 3: Numbers as digits
    number_matches = _NUMBER_PATTERN.findall(script)
    if number_matches:
        unique_nums = list(dict.fromkeys(number_matches))[:6]
        issues.append(
            f"Nombres en chiffres ({len(number_matches)}x): {', '.join(unique_nums)}. "
            f"Ecrire en lettres pour TTS naturel."
        )

    if issues:
        return GateResult(
            gate="tts_french_scan",
            passed=False,
            reason="; ".join(issues),
            details={
                "participes": problematic_participes,
                "ont_voyelle_count": len(ont_matches),
                "numbers": number_matches,
            },
        )

    return GateResult(
        gate="tts_french_scan",
        passed=True,
        reason="No TTS pronunciation traps detected",
    )


# ---------------------------------------------------------------------------
# Gate 10 -- Gemini Face Diversity
# ---------------------------------------------------------------------------

_DIVERSITY_MARKERS: list[str] = [
    "age",
    "ages",
    "elderly",
    "young",
    "old",
    "child",
    "enfant",
    "vieux",
    "jeune",
    "ancien",
    "morpholog",
    "corpulent",
    "thin",
    "mince",
    "slender",
    "muscular",
    "diverse",
    "distinct",
    "different face",
    "different visage",
    "unique face",
    "expression",
]


def gate_gemini_face_diversity(
    prompt: str,
    num_characters: int = 1,
) -> GateResult:
    """Check that a Gemini prompt generating multiple characters includes
    diversity markers (ages, morphologies, expressions).

    Only triggers when num_characters >= 2 (group scenes).
    Single-character prompts pass automatically.
    """

    if num_characters < 2:
        return GateResult(
            gate="gemini_face_diversity",
            passed=True,
            reason="Single character — diversity check not needed",
        )

    prompt_lower = prompt.lower()
    found_markers: list[str] = []

    for marker in _DIVERSITY_MARKERS:
        if marker in prompt_lower:
            found_markers.append(marker)

    if not found_markers:
        return GateResult(
            gate="gemini_face_diversity",
            passed=False,
            reason=(
                f"Prompt generates {num_characters} characters but has NO diversity "
                f"markers (ages, morphologies, expressions). Gemini will clone faces. "
                f"Add explicit diversity: 'elderly griot', 'young warrior', 'muscular build', etc."
            ),
            details={"num_characters": num_characters},
        )

    if len(found_markers) < 2 and num_characters >= 3:
        return GateResult(
            gate="gemini_face_diversity",
            passed=False,
            reason=(
                f"Only {len(found_markers)} diversity marker(s) for {num_characters} characters. "
                f"Found: {', '.join(found_markers)}. Need at least 2 distinct markers "
                f"to avoid face cloning."
            ),
            details={"found": found_markers, "num_characters": num_characters},
        )

    return GateResult(
        gate="gemini_face_diversity",
        passed=True,
        reason=f"Diversity markers found: {', '.join(found_markers)}",
        details={"found": found_markers},
    )


# ---------------------------------------------------------------------------
# Gate 12 -- Character Age Continuity
# ---------------------------------------------------------------------------

def gate_character_age_continuity(
    acte_id: str,
    character_ref_used: str | Path,
    character_age_declared: str,
    adjacent_acte_refs: dict[str, str | Path] | None = None,
) -> GateResult:
    """Verify that the character ref matches the declared age for this acte,
    and is consistent with adjacent actes.

    This gate catches the Acte II/III continuity error (2026-04-17):
    baby ref used for Acte II but Acte III shows a 7-8 year old boy.

    Args:
        acte_id: e.g. "acte2"
        character_ref_used: Path to the ref image being used.
        character_age_declared: e.g. "garcon ~7-8 ans qui rampe"
        adjacent_acte_refs: Dict of adjacent acte_id -> ref path for continuity check.
    """

    failures: list[str] = []

    ref_name = Path(character_ref_used).stem.lower()

    # Check age vs ref name heuristics
    age_lower = character_age_declared.lower()
    is_baby_age = any(w in age_lower for w in ["bebe", "baby", "toddler", "2 ans", "3 ans", "nourrisson"])
    is_child_age = any(w in age_lower for w in ["garcon", "7 ans", "8 ans", "enfant", "child", "boy"])
    is_adult_age = any(w in age_lower for w in ["adulte", "adult", "guerrier", "warrior", "empereur", "15 ans", "20 ans"])

    is_baby_ref = any(w in ref_name for w in ["baby", "bebe", "toddler", "infant"])
    is_adult_ref = any(w in ref_name for w in ["combat", "warrior", "adult", "guerrier"])

    # Mismatch detection
    if is_child_age and is_baby_ref:
        failures.append(
            f"Age declared '{character_age_declared}' but ref is a BABY ref ({Path(character_ref_used).name}). "
            f"A 7-8 year old child needs a CHILD ref, not a toddler/baby ref."
        )

    if is_baby_age and is_adult_ref:
        failures.append(
            f"Age declared '{character_age_declared}' but ref is an ADULT ref ({Path(character_ref_used).name})."
        )

    if is_child_age and is_adult_ref:
        failures.append(
            f"Age declared '{character_age_declared}' but ref is an ADULT ref ({Path(character_ref_used).name})."
        )

    # Adjacent acte continuity check
    if adjacent_acte_refs:
        ref_resolved = Path(character_ref_used).resolve()
        for adj_id, adj_ref in adjacent_acte_refs.items():
            adj_resolved = Path(adj_ref).resolve()
            # If adjacent acte uses a very different ref, warn
            if ref_resolved != adj_resolved:
                ref_stem = Path(character_ref_used).stem
                adj_stem = Path(adj_ref).stem
                # Baby vs non-baby = likely age discontinuity
                ref_is_baby = any(w in ref_stem.lower() for w in ["baby", "bebe", "toddler"])
                adj_is_baby = any(w in adj_stem.lower() for w in ["baby", "bebe", "toddler"])
                if ref_is_baby != adj_is_baby:
                    failures.append(
                        f"Age discontinuity with {adj_id}: this acte uses '{ref_stem}' "
                        f"but {adj_id} uses '{adj_stem}'. Are they the same character at the same age?"
                    )

    if failures:
        return GateResult(
            gate="character_age_continuity",
            passed=False,
            reason="; ".join(failures),
            details={
                "acte_id": acte_id,
                "ref_used": str(character_ref_used),
                "age_declared": character_age_declared,
            },
        )

    return GateResult(
        gate="character_age_continuity",
        passed=True,
        reason=f"Age '{character_age_declared}' consistent with ref '{Path(character_ref_used).name}'",
    )


# ---------------------------------------------------------------------------
# Gate 13 -- Style Consistency Check
# ---------------------------------------------------------------------------

def gate_style_consistency(
    new_ref_path: str | Path,
    validated_clip_path: str | Path | None = None,
) -> GateResult:
    """Verify that a new storyboard/ref was generated WITH canonical refs as input,
    not from scratch.

    This gate checks file metadata heuristics. It cannot do pixel comparison,
    but it flags refs that were likely generated without canonical input.

    The real check is: does the storyboard file's creation time come AFTER
    the canonical refs were read? This is a weak heuristic. The strong version
    is the REVIEW-BEFORE-SPEND workflow (human review on Vercel Blob).

    This gate primarily serves as a REMINDER to the agent and orchestrator.
    """

    new_path = Path(new_ref_path)

    if not new_path.exists():
        return GateResult(
            gate="style_consistency",
            passed=False,
            reason=f"New ref not found on disk: {new_path.name}",
        )

    # Check if a sidecar file exists documenting which refs were used as input
    sidecar = new_path.with_suffix(".refs.txt")
    if not sidecar.exists():
        return GateResult(
            gate="style_consistency",
            passed=False,
            reason=(
                f"No sidecar file '{sidecar.name}' found. "
                f"When generating storyboards/refs with Gemini, save a .refs.txt listing "
                f"which canonical refs were used as input. This proves the storyboard was NOT "
                f"generated from scratch."
            ),
            details={"expected_sidecar": str(sidecar)},
        )

    return GateResult(
        gate="style_consistency",
        passed=True,
        reason=f"Sidecar file found: {sidecar.name}",
        details={"sidecar_path": str(sidecar)},
    )


# ---------------------------------------------------------------------------
# Gate 11 -- ElevenLabs Parameter Validation
# ---------------------------------------------------------------------------

# Validated ranges from memory/tools/elevenlabs.md (2026-04-12)
ELEVENLABS_STABILITY_RANGE = (0.20, 0.55)  # Creative to Natural mode
ELEVENLABS_SPEED_RANGE = (0.82, 1.00)       # Dramatic slow to normal
ELEVENLABS_STYLE_RANGE = (0.0, 0.50)        # 0 = neutral, 0.50 = max expression
ELEVENLABS_VALID_MODEL = "eleven_v3"


def gate_elevenlabs_params(
    stability: float | None = None,
    speed: float | None = None,
    style: float | None = None,
    model_id: str | None = None,
) -> GateResult:
    """Validate ElevenLabs V3 generation parameters against proven ranges.

    Ranges from memory/tools/elevenlabs.md:
    - Stability 0.20-0.55 (Creative/Natural mode — audio tags work)
    - Speed 0.82-1.00 (dramatic slow to normal)
    - Style 0.0-0.50 (expression level)
    - Model must be eleven_v3 (active model as of April 2026)

    Stability >= 0.70 is "Robust" mode which IGNORES audio tags — always a mistake
    for our use case.
    """

    failures: list[str] = []

    if model_id and model_id != ELEVENLABS_VALID_MODEL:
        failures.append(
            f"Model '{model_id}' is not the active model. Use '{ELEVENLABS_VALID_MODEL}'"
        )

    if stability is not None:
        if stability >= 0.70:
            failures.append(
                f"Stability {stability} is in ROBUST mode (>=0.70) — audio tags will be IGNORED. "
                f"Use 0.20-0.35 for Creative mode."
            )
        elif not (ELEVENLABS_STABILITY_RANGE[0] <= stability <= ELEVENLABS_STABILITY_RANGE[1]):
            failures.append(
                f"Stability {stability} outside proven range {ELEVENLABS_STABILITY_RANGE}. "
                f"0.20-0.35 = Creative (recommended), 0.40-0.55 = Natural."
            )

    if speed is not None:
        if not (ELEVENLABS_SPEED_RANGE[0] <= speed <= ELEVENLABS_SPEED_RANGE[1]):
            failures.append(
                f"Speed {speed} outside proven range {ELEVENLABS_SPEED_RANGE}. "
                f"0.88-0.90 = hooks, 0.90-0.92 = narrative, 0.82-0.85 = dramatic."
            )

    if style is not None:
        if not (ELEVENLABS_STYLE_RANGE[0] <= style <= ELEVENLABS_STYLE_RANGE[1]):
            failures.append(
                f"Style {style} outside proven range {ELEVENLABS_STYLE_RANGE}."
            )

    if failures:
        return GateResult(
            gate="elevenlabs_params",
            passed=False,
            reason="; ".join(failures),
            details={
                "stability": stability,
                "speed": speed,
                "style": style,
                "model_id": model_id,
            },
        )

    return GateResult(
        gate="elevenlabs_params",
        passed=True,
        reason="ElevenLabs parameters within proven ranges",
        details={
            "stability": stability,
            "speed": speed,
            "style": style,
            "model_id": model_id,
        },
    )


# ---------------------------------------------------------------------------
# Orchestrators
# ---------------------------------------------------------------------------

def pre_seedance_check(config: dict[str, Any]) -> tuple[bool, list[GateResult]]:
    """Run all Seedance-relevant gates. Returns (all_passed, list_of_results).

    Expected config keys:
        prompt (str): The Seedance prompt text.
        image_refs (list[str|Path]): Image reference paths.
        clip_duration (float): Duration of the clip to generate.
        narration_duration (float): Duration of the narration audio.
        character_name (str, optional): For canonical ref check.
        character_ref_paths (list[str|Path], optional): For context check.
        has_environment (bool, optional): Explicit environment flag.
        is_chaining (bool, optional): Whether this is a chained clip.
        chaining_ref_type (str, optional): 'image' or 'video'.
        estimated_cost (float, optional): Estimated API cost for fal.ai balance check.
    """

    results: list[GateResult] = []

    prompt = config.get("prompt", "")
    image_refs = config.get("image_refs", [])

    # Gate 1 -- Prompt structure (threshold scales with clip duration)
    clip_dur = config.get("clip_duration", 10.0)
    results.append(gate_prompt_structure(prompt, clip_duration=clip_dur))

    # Gate 3 -- Duration match
    narr_dur = config.get("narration_duration", 0.0)
    if clip_dur > 0 or narr_dur > 0:
        results.append(gate_duration_match(clip_dur, narr_dur))

    # Gate 4 -- Reverse bias
    results.append(gate_reverse_bias(prompt))

    # Gate 5 -- Seedance inputs
    results.append(gate_seedance_inputs(
        image_refs=image_refs,
        is_chaining=config.get("is_chaining", False),
        chaining_ref_type=config.get("chaining_ref_type"),
    ))

    # Gate 6 -- Character ref context
    char_refs = config.get("character_ref_paths", image_refs)
    if char_refs:
        results.append(gate_character_ref_context(
            ref_paths=char_refs,
            has_environment=config.get("has_environment"),
        ))

    # Gate 7 -- Chain continuity (for multi-clip actes)
    is_chained = config.get("is_chained", False)
    if is_chained:
        results.append(gate_chain_continuity(
            previous_clip_path=config.get("previous_clip_path"),
            is_chained=True,
        ))

    # Gate 8 -- fal.ai balance check
    estimated_cost = config.get("estimated_cost", 0.0)
    if estimated_cost > 0:
        results.append(gate_fal_balance(estimated_cost=estimated_cost))

    # Gate 12 -- Character age continuity
    acte_id = config.get("acte_id", "")
    character_age = config.get("character_age", "")
    if acte_id and character_age and char_refs:
        main_ref = char_refs[0] if char_refs else ""
        results.append(gate_character_age_continuity(
            acte_id=acte_id,
            character_ref_used=main_ref,
            character_age_declared=character_age,
            adjacent_acte_refs=config.get("adjacent_acte_refs"),
        ))

    # Gate 13 -- Style consistency (storyboard sidecar check)
    storyboard_path = config.get("storyboard_path", "")
    if storyboard_path:
        results.append(gate_style_consistency(new_ref_path=storyboard_path))

    all_passed = all(r.passed for r in results)
    return all_passed, results


def pre_gemini_check(config: dict[str, Any]) -> tuple[bool, list[GateResult]]:
    """Run Gemini-relevant gates. Returns (all_passed, list_of_results).

    Expected config keys:
        character_name (str): Name of the character being generated.
        input_refs (list[str|Path]): Reference images passed to Gemini.
        character_ref_paths (list[str|Path], optional): For context check.
        has_environment (bool, optional): Explicit environment flag.
        prompt (str, optional): Gemini prompt text (for diversity check).
        num_characters (int, optional): Number of characters in the scene.
    """

    results: list[GateResult] = []

    # Gate 2 -- Canonical ref
    character_name = config.get("character_name", "")
    input_refs = config.get("input_refs", [])
    if character_name:
        results.append(gate_canonical_ref(character_name, input_refs))

    # Gate 6 -- Character ref context
    char_refs = config.get("character_ref_paths", input_refs)
    if char_refs:
        results.append(gate_character_ref_context(
            ref_paths=char_refs,
            has_environment=config.get("has_environment"),
        ))

    # Gate 10 -- Face diversity (for multi-character scenes)
    prompt = config.get("prompt", "")
    num_chars = config.get("num_characters", 1)
    if prompt and num_chars >= 2:
        results.append(gate_gemini_face_diversity(prompt, num_chars))

    all_passed = all(r.passed for r in results)
    return all_passed, results


def pre_elevenlabs_check(config: dict[str, Any]) -> tuple[bool, list[GateResult]]:
    """Run ElevenLabs TTS-relevant gates. Returns (all_passed, list_of_results).

    Expected config keys:
        script (str): The French TTS script text to scan.
        stability (float, optional): Voice stability setting.
        speed (float, optional): Voice speed setting.
        style (float, optional): Voice style setting.
        model_id (str, optional): ElevenLabs model ID.
    """

    results: list[GateResult] = []

    # Gate 9 -- TTS French scan
    script = config.get("script", "")
    if script:
        results.append(gate_tts_french_scan(script))

    # Gate 11 -- ElevenLabs parameter validation
    has_params = any(
        config.get(k) is not None
        for k in ("stability", "speed", "style", "model_id")
    )
    if has_params:
        results.append(gate_elevenlabs_params(
            stability=config.get("stability"),
            speed=config.get("speed"),
            style=config.get("style"),
            model_id=config.get("model_id"),
        ))

    all_passed = all(r.passed for r in results)
    return all_passed, results


# ---------------------------------------------------------------------------
# SMS alert formatter
# ---------------------------------------------------------------------------

def format_sms_alert(
    short_name: str,
    acte: str | int,
    failures: list[GateResult],
) -> str:
    """Format a concise SMS-ready alert message from gate failures.

    Args:
        short_name: Short identifier for the video/episode (e.g. 'soundjata').
        acte: Act number or label (e.g. 'acte4' or 4).
        failures: List of failed GateResult objects.

    Returns:
        A string under 160 chars when possible, multi-line for many failures.
    """

    if not failures:
        return f"PIPELINE OK | {short_name} {acte} | All gates passed"

    header = f"PIPELINE BLOCK | {short_name} {acte}"
    lines = [header]
    for f in failures:
        # Truncate individual reasons to keep SMS concise
        short_reason = f.reason[:80] if len(f.reason) > 80 else f.reason
        lines.append(f"- {f.gate}: {short_reason}")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# CLI demo
# ---------------------------------------------------------------------------

def _demo() -> None:
    """Demonstrate gate usage with a passing and a failing config."""

    separator = "=" * 60

    # --- Failing Seedance config ---
    print(separator)
    print("DEMO: Failing Seedance config")
    print(separator)

    bad_config: dict[str, Any] = {
        "prompt": "A warrior walks across a field. The enemy has fallen on the ground.",
        "image_refs": [
            "/tmp/ref1-style-hero.png",
            "/tmp/ref2.png",
            "/tmp/ref3.png",
            "/tmp/ref4.png",
            "/tmp/ref5.png",
        ],
        "clip_duration": 8.0,
        "narration_duration": 18.5,
        "is_chaining": True,
        "chaining_ref_type": "video",
        "character_ref_paths": ["/tmp/hero-turnaround-sheet.png"],
    }

    passed, results = pre_seedance_check(bad_config)
    for r in results:
        print(f"  {r}")

    print(f"\n  Overall: {'PASS' if passed else 'BLOCKED'}")
    failures = [r for r in results if not r.passed]
    if failures:
        print(f"\n  SMS alert:\n{format_sms_alert('soundjata', 'acte4', failures)}")

    # --- Passing Seedance config ---
    print(f"\n{separator}")
    print("DEMO: Passing Seedance config")
    print(separator)

    # Build a prompt that meets all requirements
    style_block = (
        "2D vivid flat anime illustration, painted graphic novel, "
        "bold clean outlines, cel-shaded flat colors."
    )
    anti_artifact = (
        "RIGID body proportions throughout. No morphing, no deformation. "
        "Maintain proportions at all times."
    )
    shot_a = (
        "SECONDS 0 TO 3: Wide aerial shot -- Soundjata rides at the head of a "
        "Mandinka cavalry column. Golden dust erupts behind galloping horses. "
        "His warrior armor catches the morning light as the camera sweeps in a "
        "wide orbital arc above the formation. The savanna stretches endlessly "
        "in every direction under a vast indigo sky. Birds scatter from tall "
        "grass as the column thunders forward. The scale is epic. "
        "Camera continues its slow arc, revealing more riders joining from the east."
    )
    shot_b = (
        "SECONDS 3 TO 7: Medium tracking shot -- Soundjata raises the spear "
        "tipped with a rooster's spur high above his head. Warriors behind him "
        "roar silently in unison. The golden metal catches contrasting light "
        "against storm clouds gathering on the horizon. His face is fierce and "
        "determined, jaw set, eyes locked on the distant plains of Kirina. "
        "Camera dollies alongside at galloping pace, dust swirling in the "
        "foreground. Horses' manes whip in the wind. Shields gleam."
    )
    shot_c = (
        "SECONDS 7 TO 10: Wide shot -- the two massive armies converge on the "
        "plains of Kirina. Soundjata's golden cavalry surges like a wave into "
        "the dark mass of Soumaoro's forces. Dust clouds billow hundreds of "
        "meters into the sky. Camera rises slowly to reveal the full scale of "
        "the battlefield stretching from horizon to horizon. Hundreds of warriors "
        "clash in swirling clouds of red laterite dust. The earth trembles under "
        "the combined charge. Spears glint in the stormy light. Shields splinter. "
        "The Mandinka war drums echo across the valley. Soumaoro's sorcerers "
        "retreat as the golden tide pushes forward relentlessly. "
        "COLOR GRADE: storm grey versus molten gold, deep red earth, indigo shadows. "
        "Volumetric dust particles catch the last rays of sun breaking through "
        "the storm clouds. No text, no banners, no writing visible anywhere. "
        "No words overlaid on screen at any point during the full sequence."
    )

    good_prompt = "\n\n".join([style_block, anti_artifact, shot_a, shot_b, shot_c])

    good_config: dict[str, Any] = {
        "prompt": good_prompt,
        "image_refs": [
            "/tmp/soundjata-combat-ref.png",
            "/tmp/savanna-environment-plate.png",
        ],
        "clip_duration": 10.0,
        "narration_duration": 9.2,
        "has_environment": True,
    }

    passed, results = pre_seedance_check(good_config)
    for r in results:
        print(f"  {r}")

    print(f"\n  Overall: {'PASS' if passed else 'BLOCKED'}")

    # --- Gemini check demo ---
    print(f"\n{separator}")
    print("DEMO: Failing Gemini config (missing canonical ref)")
    print(separator)

    gemini_config: dict[str, Any] = {
        "character_name": "soundjata",
        "input_refs": ["/tmp/some-random-ref.png"],
        "character_ref_paths": ["/tmp/hero-neutral-sheet.png"],
        "prompt": "Generate a scene with three griots sitting around a fire.",
        "num_characters": 3,
    }

    passed, results = pre_gemini_check(gemini_config)
    for r in results:
        print(f"  {r}")

    print(f"\n  Overall: {'PASS' if passed else 'BLOCKED'}")
    failures = [r for r in results if not r.passed]
    if failures:
        print(f"\n  SMS alert:\n{format_sms_alert('soundjata', 'acte2', failures)}")

    # --- TTS French scan demo ---
    print(f"\n{separator}")
    print("DEMO: Failing ElevenLabs TTS scan")
    print(separator)

    bad_script = (
        "Soundjata a ete terrifie par la prophetie.\n"
        "Les guerriers ont accede au pouvoir en 1235.\n"
        "La charte a ete proclamee devant 44 chefs.\n"
        "Son peuple a ete libere, sa mere honoree."
    )

    passed, results = pre_elevenlabs_check({"script": bad_script})
    for r in results:
        print(f"  {r}")
    print(f"\n  Overall: {'PASS' if passed else 'BLOCKED'}")

    print(f"\n{separator}")
    print("DEMO: Passing ElevenLabs TTS scan")
    print(separator)

    good_script = (
        "Soundjata, la terreur le saisit devant la prophetie.\n"
        "Les guerriers accederent au pouvoir en douze cent trente-cinq.\n"
        "La charte fut proclamee devant quarante-quatre chefs.\n"
        "Son peuple retrouva la liberte, sa mere retrouva l'honneur."
    )

    passed, results = pre_elevenlabs_check({"script": good_script})
    for r in results:
        print(f"  {r}")
    print(f"\n  Overall: {'PASS' if passed else 'BLOCKED'}")

    # --- Gemini face diversity demo ---
    print(f"\n{separator}")
    print("DEMO: Passing Gemini face diversity (with markers)")
    print(separator)

    diverse_config: dict[str, Any] = {
        "character_name": "soundjata",
        "input_refs": [str(CANONICAL_REFS["soundjata"])],
        "prompt": "Three griots: an elderly man with a kora, a young woman with braids, a muscular middle-aged drummer.",
        "num_characters": 3,
        "has_environment": True,
    }

    passed, results = pre_gemini_check(diverse_config)
    for r in results:
        print(f"  {r}")
    print(f"\n  Overall: {'PASS' if passed else 'BLOCKED'}")


if __name__ == "__main__":
    _demo()
