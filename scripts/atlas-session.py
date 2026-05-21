#!/usr/bin/env python3
"""
atlas-session.py — Orchestrateur de session Atlas (bilan + audit + next actions)

Usage:
  python3 scripts/atlas-session.py --episode peste-1347
  python3 scripts/atlas-session.py --episode peste-1347 --beat 4
  python3 scripts/atlas-session.py --episode peste-1347 --beats 4 5 6

Ce que le script fait:
  1. BILAN EPISODE  — etat de chaque beat (TSX / FINAL / EN COURS)
  2. ASSETS AUDIT   — pour les beats cibles : assets presents, RGB, ref i2i, frames anim
  3. DETECTION TSX  — parse les TSX existants pour extraire les sprites/objets utilises
  4. CHECKS TECH    — registration Root.tsx, Atlas patterns (A1/A2/A3), spec tables
  5. RAPPORT        — sauvegarde /tmp/{episode}-session-report.md + COMPACT_CURRENT.md
  6. NEXT ACTIONS   — liste priorisee avec commandes exactes a copier-coller
"""

import os
import sys
import re
import json
import argparse
import subprocess
from pathlib import Path
from datetime import date

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

PROJECT_ROOT = Path(__file__).parent.parent
PUBLIC_DIR = PROJECT_ROOT / "public"
SRC_DIR = PROJECT_ROOT / "src"
OUT_DIR = PROJECT_ROOT / "out" / "episodes"
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
MEMORY_DIR = PROJECT_ROOT / "memory"

OCEAN_BG = (3, 34, 76)
RGB_DARK_THRESHOLD = 80


# ─── HELPERS ─────────────────────────────────────────────────────────────────

def ok(msg: str) -> str:
    return f"  [OK]      {msg}"

def warn(msg: str) -> str:
    return f"  [WARN]    {msg}"

def block(msg: str) -> str:
    return f"  [BLOQUE]  {msg}"

def info(msg: str) -> str:
    return f"  [INFO]    {msg}"

def section(title: str) -> str:
    bar = "=" * 56
    return f"\n{bar}\n  {title}\n{bar}\n"


def atlas_dir(episode: str) -> Path:
    return SRC_DIR / "projects" / "atlas" / episode

def public_episode(episode: str) -> Path:
    return PUBLIC_DIR / "atlas" / episode

def out_episode(episode: str) -> Path:
    return OUT_DIR / episode

def timing_path(episode: str) -> Path:
    return atlas_dir(episode) / "timing.ts"

def refs_path(episode: str) -> Path:
    return public_episode(episode) / "assets" / "REFS.md"


# ─── PHASE 1 : BILAN EPISODE ─────────────────────────────────────────────────

def parse_timing(episode: str) -> list[dict]:
    """
    Lit timing.ts et extrait la liste des beats avec leurs bornes.
    Retourne: [{name, start_const, end_const, beat_num}]
    """
    path = timing_path(episode)
    if not path.exists():
        return []

    content = path.read_text()
    beats = []

    # Cherche les paires START/END dans BEATS = { ... }
    beats_block = re.search(r'export const BEATS\s*=\s*\{(.+?)\}\s*as const', content, re.DOTALL)
    if not beats_block:
        return []

    block_text = beats_block.group(1)
    entries = re.findall(
        r'//\s*\[([^\]]+)\][^\n]*\n\s*(\w+_START)\s*:\s*sec\(([0-9.]+)\)[^\n]*//\s*f\s*(\d+)[^\n]*\n\s*(\w+_END)\s*:\s*sec\(([0-9.]+)\)[^\n]*//\s*f\s*(\d+)',
        block_text
    )

    beat_num = 0
    for match in entries:
        label, start_const, start_sec, start_f, end_const, end_sec, end_f = match
        beat_num += 1
        beats.append({
            "num": beat_num,
            "label": label.strip(),
            "start_const": start_const,
            "end_const": end_const,
            "start_sec": float(start_sec),
            "end_sec": float(end_sec),
            "start_frame": int(start_f),
            "end_frame": int(end_f),
            "duration_frames": int(end_f) - int(start_f) + 1,
            "duration_sec": float(end_sec) - float(start_sec),
        })

    return beats


def beat_tsx_path(episode: str, beat_num: int) -> Path | None:
    adir = atlas_dir(episode)
    candidates = list(adir.glob(f"Beat{beat_num}*.tsx"))
    if candidates:
        return candidates[0]
    return None


def episode_status(episode: str, beats: list[dict]) -> list[dict]:
    """
    Pour chaque beat, detecte : TSX present, FINAL present, WIP present.
    """
    out_dir = out_episode(episode)
    results = []
    for b in beats:
        tsx = beat_tsx_path(episode, b["num"])
        final = None
        if out_dir.exists():
            finals = list(out_dir.glob(f"beat{b['num']}-FINAL.mp4"))
            if finals:
                final = finals[0]

        wip = None
        wip_dir = out_dir / "wip"
        if wip_dir.exists():
            wips = sorted(wip_dir.glob(f"beat{b['num']}_*.mp4"))
            if wips:
                wip = wips[-1]

        results.append({
            **b,
            "tsx_path": tsx,
            "tsx_exists": tsx is not None,
            "final_path": final,
            "final_exists": final is not None,
            "wip_path": wip,
            "wip_exists": wip is not None,
        })

    return results


# ─── PHASE 2 : ASSETS AUDIT ──────────────────────────────────────────────────

def check_rgb(png_path: Path) -> tuple[bool, str]:
    """
    Retourne (is_dark, description).
    is_dark = True si moins de 40% des pixels non-transparents ont au moins un canal > 80.
    Utilise une grille reguliere sur toute l'image (step=8px) pour eviter les faux positifs
    sur des zones de bordure/ombre.
    """
    if not HAS_PIL:
        return False, "PIL non disponible (pip3 install Pillow)"

    try:
        img = Image.open(png_path).convert("RGBA")
        w, h = img.size
        bright_count = 0
        valid_count = 0
        step = max(4, min(w, h) // 16)

        for y in range(0, h, step):
            for x in range(0, w, step):
                r, g, b, a = img.getpixel((x, y))
                if a > 30:
                    valid_count += 1
                    if r > RGB_DARK_THRESHOLD or g > RGB_DARK_THRESHOLD or b > RGB_DARK_THRESHOLD:
                        bright_count += 1

        if valid_count == 0:
            return False, "transparent"

        ratio = bright_count / valid_count
        desc = f"{bright_count}/{valid_count} pixels lumineux ({ratio:.0%})"
        return ratio < 0.40, desc

    except Exception as e:
        return False, f"erreur PIL: {e}"


def audit_asset_folder(folder: Path, name: str, refs_content: str) -> dict:
    """
    Audit complet d'un dossier asset (cities-v2/X ou objects/X).
    """
    result = {
        "name": name,
        "folder": str(folder),
        "static_ok": False,
        "anim_frames": 0,
        "rgb_dark": False,
        "rgb_desc": "",
        "ref_i2i": False,
        "issues": [],
        "ok": False,
    }

    static_png = folder / "static.png"
    # Preferer une frame mediane de l'animation pour le RGB check (plus representatif)
    anim_dir = folder / "anim"
    anim_frames_check = []
    if anim_dir.exists():
        anim_frames_check = sorted(anim_dir.glob("frame_*.png"))

    check_target = static_png
    if anim_frames_check:
        mid = len(anim_frames_check) // 2
        check_target = anim_frames_check[mid]

    if static_png.exists():
        result["static_ok"] = True
        dark, desc = check_rgb(check_target)
        result["rgb_dark"] = dark
        result["rgb_desc"] = desc
        if dark:
            result["issues"].append(f"RGB trop sombre ({desc}) — invisible sur fond OCEAN #03224c")
    else:
        result["issues"].append("static.png absent")

    anim_dir = folder / "anim"
    if anim_dir.exists():
        frames = sorted(anim_dir.glob("frame_*.png"))
        result["anim_frames"] = len(frames)
        if len(frames) == 0:
            result["issues"].append("anim/ present mais vide (0 frames)")
    else:
        result["issues"].append("anim/ absent — frames animation manquantes")

    if name in refs_content:
        result["ref_i2i"] = True
    else:
        result["issues"].append(f"ref i2i non documentee dans REFS.md")

    result["ok"] = len(result["issues"]) == 0
    return result


def audit_all_assets(episode: str) -> dict:
    """
    Audit tous les assets de l'episode (cities-v2/ et objects/).
    """
    assets_dir = public_episode(episode) / "assets"
    refs_content = ""
    if refs_path(episode).exists():
        refs_content = refs_path(episode).read_text()

    results = {"cities": {}, "objects": {}}

    cities_dir = assets_dir / "objects" / "cities-v2"
    if cities_dir.exists():
        for city_folder in sorted(cities_dir.iterdir()):
            if city_folder.is_dir():
                results["cities"][city_folder.name] = audit_asset_folder(
                    city_folder, city_folder.name, refs_content
                )

    objects_dir = assets_dir / "objects"
    if objects_dir.exists():
        for obj_folder in sorted(objects_dir.iterdir()):
            if obj_folder.is_dir() and obj_folder.name not in ("cities-v2", "cities"):
                results["objects"][obj_folder.name] = audit_asset_folder(
                    obj_folder, obj_folder.name, refs_content
                )

    return results


# ─── PHASE 3 : DETECTION SPRITES DANS TSX ────────────────────────────────────

def extract_sprites_from_tsx(tsx_path: Path, episode: str) -> list[dict]:
    """
    Parse un TSX Beat Atlas et extrait les sprites/objets utilises.
    Detecte : cities-v2/X, objects/X, staticFile patterns.
    """
    content = tsx_path.read_text()
    sprites = []

    city_matches = re.findall(
        rf'atlas/{re.escape(episode)}/assets/objects/cities-v2/([^/"\'+`]+)',
        content
    )
    for city in set(city_matches):
        city = city.strip()
        if city and not city.startswith("$"):
            frame_counts = re.findall(
                rf'cityKey=["\']?{re.escape(city)}["\']?\s+frameCount=\{{(\d+)\}}',
                content
            )
            fc = int(frame_counts[0]) if frame_counts else None
            sprites.append({"type": "city", "name": city, "frameCount": fc})

    obj_matches = re.findall(
        rf'atlas/{re.escape(episode)}/assets/objects/([^/"\'+`]+)/anim',
        content
    )
    for obj in set(obj_matches):
        obj = obj.strip()
        if obj and obj != "cities-v2":
            frame_counts = re.findall(
                rf'{re.escape(obj)}.*?frameCount=\{{(\d+)\}}',
                content, re.DOTALL
            )
            fc = int(frame_counts[0]) if frame_counts else None
            sprites.append({"type": "object", "name": obj, "frameCount": fc})

    city_key_matches = re.findall(r'cityKey=["\']([^"\']+)["\']', content)
    for city in set(city_key_matches):
        if not any(s["name"] == city for s in sprites):
            sprites.append({"type": "city", "name": city, "frameCount": None})

    return sprites


def cross_sprites_with_assets(sprites: list[dict], asset_audit: dict, episode: str) -> list[dict]:
    """
    Pour chaque sprite detecte dans le TSX, verifie si l'asset est pret.
    """
    results = []
    for sprite in sprites:
        name = sprite["name"]
        asset_type = sprite["type"]

        if asset_type == "city":
            asset = asset_audit["cities"].get(name)
        else:
            asset = asset_audit["objects"].get(name)

        status = {
            **sprite,
            "asset_found": asset is not None,
            "issues": [],
            "ready": False,
        }

        if asset is None:
            status["issues"].append(f"Asset '{name}' utilise dans le TSX mais dossier absent dans public/")
        else:
            status["issues"] = asset["issues"]
            if sprite["frameCount"] and asset["anim_frames"] > 0:
                if asset["anim_frames"] != sprite["frameCount"]:
                    status["issues"].append(
                        f"frameCount TSX={sprite['frameCount']} mais anim/ contient {asset['anim_frames']} frames"
                    )

        status["ready"] = len(status["issues"]) == 0
        results.append(status)

    return results


# ─── PHASE 4 : CHECKS TECHNIQUES ─────────────────────────────────────────────

def check_spec_table(episode: str, beat_num: int) -> bool:
    spec = Path(f"/tmp/{episode}-beat{beat_num}-spec.md")
    return spec.exists()


def check_atlas_patterns_quick(tsx_path: Path) -> list[tuple[str, str]]:
    """Version legere de check_atlas_patterns pour le rapport de session."""
    if not tsx_path.exists():
        return []

    content = tsx_path.read_text()
    violations = []

    has_frameidx = bool(re.search(r'frameIdx|frameStr|frame_\$\{', content))
    has_mathmax = "Math.max(0" in content
    if has_frameidx and not has_mathmax:
        violations.append(("A1", "frameIdx sans Math.max(0, localF) — index negatif possible"))

    has_sprite = bool(re.search(r'CitySpriteAnimated|staticFile.*frame_|spriteScale', content))
    has_springpop = bool(re.search(r'interpolate\(lf,\s*\[0,\s*\d+,\s*\d+\]', content))
    if has_sprite and not has_springpop:
        violations.append(("A2", "Sprite sans spring pop — apparition lineaire"))

    for suspect in ["RatScurry", "ParisSprite", "StockholmSprite"]:
        if suspect in content:
            violations.append(("A3", f"Composant suspect: {suspect}"))

    return violations


def check_registration(episode: str, beat: dict) -> tuple[str, str]:
    """
    Lance check-beat-registration.py et retourne (status, message).
    """
    script = SCRIPTS_DIR / "check-beat-registration.py"
    if not script.exists():
        return "SKIP", "check-beat-registration.py absent"

    try:
        result = subprocess.run(
            [sys.executable, str(script),
             "--episode", episode,
             "--beat", str(beat["num"]),
             "--start", str(beat["start_frame"]),
             "--end", str(beat["end_frame"])],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode == 0:
            return "OK", "durationInFrames correct"
        else:
            output = result.stdout + result.stderr
            m = re.search(r'\[ERREUR R1\].*', output)
            if m:
                return "BLOCK", m.group(0)
            return "WARN", output.strip()[:120]
    except Exception as e:
        return "SKIP", str(e)


# ─── PHASE 5 : NEXT ACTIONS ──────────────────────────────────────────────────

def generate_next_actions(
    episode: str,
    beat_statuses: list[dict],
    asset_audit: dict,
    sprite_checks: dict[int, list[dict]],
    tech_checks: dict[int, dict],
) -> list[dict]:
    """
    Genere une liste priorisee d'actions avec commandes exactes.
    Priorites : BLOQUANT > MANQUANT > WARN > OK
    """
    actions = []

    for b in beat_statuses:
        n = b["num"]
        checks = tech_checks.get(n, {})

        if not b["tsx_exists"]:
            continue

        # Beats FINAL valides : pas de spec-table requise (deja livre)
        if not b["final_exists"] and not check_spec_table(episode, n):
            actions.append({
                "priority": 1,
                "beat": n,
                "type": "BLOQUANT",
                "label": f"Beat{n} : spec-table absente (bloque atlas-beat-guard.sh)",
                "cmd": f"python3 scripts/beat-session.py --episode {episode} --beat {n} --phase spec-table",
            })

        for code, msg in checks.get("atlas_violations", []):
            actions.append({
                "priority": 1 if code == "A1" else 2,
                "beat": n,
                "type": "BLOQUANT" if code == "A1" else "WARN",
                "label": f"Beat{n} [{code}] {msg}",
                "cmd": f"# Corriger {b['tsx_path'].name} : {msg}",
            })

        reg_status, reg_msg = checks.get("registration", ("SKIP", ""))
        if reg_status == "BLOCK":
            actions.append({
                "priority": 1,
                "beat": n,
                "type": "BLOQUANT",
                "label": f"Beat{n} : {reg_msg}",
                "cmd": f"# Corriger durationInFrames dans Root.tsx pour Beat{n} (duree={b['duration_frames']}f)",
            })

        for sprite in sprite_checks.get(n, []):
            if not sprite["ready"]:
                for issue in sprite["issues"]:
                    asset_type = "cities-v2" if sprite["type"] == "city" else "objects"
                    actions.append({
                        "priority": 2,
                        "beat": n,
                        "type": "MANQUANT",
                        "label": f"Beat{n} sprite '{sprite['name']}' : {issue}",
                        "cmd": f"# Generer via PixelLab : {sprite['name']} ({sprite['type']})\n"
                               f"# Puis : ./scripts/add-city-asset.sh {sprite['name']} /tmp/{sprite['name']}.png {episode}",
                    })

        if not b["final_exists"] and b["tsx_exists"]:
            beat_end = b["end_frame"]
            beat_start = b["start_frame"]
            all_sprites_ready = all(s["ready"] for s in sprite_checks.get(n, []))
            spec_ok = check_spec_table(episode, n)
            violations = checks.get("atlas_violations", [])
            if all_sprites_ready and spec_ok and not violations:
                actions.append({
                    "priority": 4,
                    "beat": n,
                    "type": "READY",
                    "label": f"Beat{n} : pret pour render (tous checks OK)",
                    "cmd": f"npx remotion render PesteBeat{n} --frames={beat_start}-{beat_end} --output out/episodes/{episode}/wip/beat{n}_v1.mp4",
                })

    for city_name, audit in asset_audit["cities"].items():
        if not audit["ok"] and not any(
            city_name == s["name"]
            for beat_sprites in sprite_checks.values()
            for s in beat_sprites
        ):
            for issue in audit["issues"]:
                actions.append({
                    "priority": 3,
                    "beat": 0,
                    "type": "ASSET",
                    "label": f"Asset orphelin cities-v2/{city_name} : {issue}",
                    "cmd": f"./scripts/add-city-asset.sh {city_name} /tmp/{city_name}.png {episode}",
                })

    actions.sort(key=lambda x: (x["priority"], x["beat"]))
    return actions


# ─── PHASE 6 : RAPPORT + SAUVEGARDE ─────────────────────────────────────────

def save_report(
    episode: str,
    beat_statuses: list[dict],
    asset_audit: dict,
    sprite_checks: dict[int, list[dict]],
    tech_checks: dict[int, dict],
    actions: list[dict],
) -> Path:
    today = date.today().isoformat()
    lines = [f"# Atlas Session Report — {episode}", f"Date: {today}\n"]

    lines.append("## Etat des beats\n")
    lines.append("| Beat | Label | TSX | FINAL | Violations | Sprite issues |")
    lines.append("|------|-------|-----|-------|------------|---------------|")
    for b in beat_statuses:
        n = b["num"]
        tsx = "OK" if b["tsx_exists"] else "ABSENT"
        final = "FINAL" if b["final_exists"] else ("WIP" if b["wip_exists"] else "-")
        viol = len(tech_checks.get(n, {}).get("atlas_violations", []))
        sprite_issues = sum(1 for s in sprite_checks.get(n, []) if not s["ready"])
        lines.append(f"| Beat{n} | {b['label']} | {tsx} | {final} | {viol} | {sprite_issues} |")

    lines.append("\n## Assets audit\n")
    for city_name, a in asset_audit["cities"].items():
        status = "OK" if a["ok"] else "ISSUES"
        issues = " / ".join(a["issues"]) if a["issues"] else "-"
        lines.append(f"- cities-v2/{city_name}: {status} — {a['anim_frames']} frames — {issues}")

    for obj_name, a in asset_audit["objects"].items():
        status = "OK" if a["ok"] else "ISSUES"
        issues = " / ".join(a["issues"]) if a["issues"] else "-"
        lines.append(f"- objects/{obj_name}: {status} — {a['anim_frames']} frames — {issues}")

    lines.append("\n## Next actions\n")
    for action in actions:
        lines.append(f"**[{action['type']}] Beat{action['beat']}** — {action['label']}")
        lines.append(f"```\n{action['cmd']}\n```\n")

    report_path = Path(f"/tmp/{episode}-session-report.md")
    report_path.write_text("\n".join(lines))
    return report_path


def update_compact_current(episode: str, beat_statuses: list[dict]) -> None:
    compact = MEMORY_DIR / "COMPACT_CURRENT.md"
    if not compact.exists():
        return

    content = compact.read_text()
    today = date.today().isoformat()

    for b in beat_statuses:
        n = b["num"]
        label = b["label"]
        if b["final_exists"]:
            new_status = f"Beat{n} ({label}) : FINAL"
        elif b["wip_exists"]:
            new_status = f"Beat{n} ({label}) : EN COURS"
        elif b["tsx_exists"]:
            new_status = f"Beat{n} ({label}) : TSX existe, pas encore rendu"
        else:
            new_status = f"Beat{n} ({label}) : A CODER"

        pattern = rf'Beat{n}\s*\([^)]+\)\s*:.*'
        if re.search(pattern, content):
            content = re.sub(pattern, new_status, content)

    content = re.sub(r'Mis a jour.*\n', f'Mis a jour {today} via atlas-session.py\n', content)
    compact.write_text(content)


# ─── AFFICHAGE ────────────────────────────────────────────────────────────────

def print_report(
    episode: str,
    beat_statuses: list[dict],
    target_beats: list[int],
    asset_audit: dict,
    sprite_checks: dict[int, list[dict]],
    tech_checks: dict[int, dict],
    actions: list[dict],
    report_path: Path,
) -> None:
    print(section(f"ATLAS SESSION — {episode.upper()}"))

    print("  BILAN EPISODE")
    print("  " + "-" * 52)
    for b in beat_statuses:
        n = b["num"]
        if b["final_exists"]:
            status = "[FINAL]"
        elif b["wip_exists"]:
            status = "[WIP]  "
        elif b["tsx_exists"]:
            status = "[TSX]  "
        else:
            status = "[TODO] "

        target = " <-- CIBLE" if n in target_beats else ""
        print(f"  Beat{n} {status} {b['label']:30s} {b['start_frame']:>5}f → {b['end_frame']:>5}f{target}")

    if target_beats:
        print(section("ASSETS AUDIT — beats cibles"))
        for n in target_beats:
            b = next((x for x in beat_statuses if x["num"] == n), None)
            if not b:
                continue
            sprites = sprite_checks.get(n, [])
            print(f"\n  Beat{n} — sprites detectes dans TSX :")
            if not sprites:
                print(info("Aucun sprite detecte dans le TSX"))
            for s in sprites:
                status_str = ok(f"{s['type']}/{s['name']} — {s.get('frameCount','?')} frames") if s["ready"] \
                    else block(f"{s['type']}/{s['name']} — " + " | ".join(s["issues"]))
                print(status_str)

        print("\n  TOUS LES ASSETS DE L'EPISODE :")
        for city_name, a in asset_audit["cities"].items():
            if a["ok"]:
                print(ok(f"cities-v2/{city_name} — {a['anim_frames']} frames anim"))
            else:
                for issue in a["issues"]:
                    print(block(f"cities-v2/{city_name} — {issue}"))

        for obj_name, a in asset_audit["objects"].items():
            if a["ok"]:
                print(ok(f"objects/{obj_name} — {a['anim_frames']} frames anim"))
            else:
                for issue in a["issues"]:
                    print(block(f"objects/{obj_name} — {issue}"))

        print(section("CHECKS TECHNIQUES — beats cibles"))
        for n in target_beats:
            checks = tech_checks.get(n, {})
            b = next((x for x in beat_statuses if x["num"] == n), None)
            if not b:
                continue

            print(f"\n  Beat{n} :")

            spec_ok = check_spec_table(episode, n)
            if spec_ok:
                print(ok("Spec table presente (/tmp/)"))
            else:
                print(block(f"Spec table absente — lancer --phase spec-table"))

            reg_status, reg_msg = checks.get("registration", ("SKIP", "non verifie"))
            if reg_status == "OK":
                print(ok(f"Registration Root.tsx : {reg_msg}"))
            elif reg_status == "BLOCK":
                print(block(f"Registration : {reg_msg}"))
            else:
                print(warn(f"Registration : {reg_msg}"))

            violations = checks.get("atlas_violations", [])
            if not violations:
                if b["tsx_exists"]:
                    print(ok("Atlas patterns A1/A2/A3 : aucune violation"))
            else:
                for code, msg in violations:
                    print(block(f"[{code}] {msg}"))

    print(section("NEXT ACTIONS — liste priorisee"))
    if not actions:
        print(ok("Aucune action bloquante detectee. Episode pret."))
    else:
        current_priority = None
        for i, action in enumerate(actions, 1):
            if action["priority"] != current_priority:
                current_priority = action["priority"]
                labels = {1: "CRITIQUE (bloquant)", 2: "IMPORTANT (assets manquants)",
                          3: "MINEUR (assets orphelins)", 4: "PRET A RENDER"}
                print(f"\n  --- {labels.get(current_priority, '')} ---")
            print(f"\n  {i}. [{action['type']}] Beat{action['beat']} — {action['label']}")
            print(f"     Commande :")
            for line in action["cmd"].split("\n"):
                print(f"       {line}")

    print(f"\n{section('RAPPORT SAUVEGARDE')}")
    print(info(f"Rapport complet : {report_path}"))
    print(info(f"COMPACT_CURRENT.md mis a jour"))
    print()


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Orchestrateur de session Atlas — bilan + audit + next actions"
    )
    parser.add_argument("--episode", required=True, help="Slug episode (ex: peste-1347)")
    parser.add_argument("--beat", type=int, default=None, help="Un seul beat cible")
    parser.add_argument("--beats", type=int, nargs="+", default=None, help="Liste de beats cibles")
    args = parser.parse_args()

    episode = args.episode

    if not atlas_dir(episode).exists():
        print(f"[ERROR] Episode introuvable : {atlas_dir(episode)}")
        sys.exit(1)

    print(f"\nLecture timing.ts...")
    beats = parse_timing(episode)
    if not beats:
        print(f"[ERROR] Impossible de parser timing.ts : {timing_path(episode)}")
        sys.exit(1)

    print(f"  {len(beats)} beats detectes.")

    print("Bilan episode...")
    beat_statuses = episode_status(episode, beats)

    if args.beat:
        target_beats = [args.beat]
    elif args.beats:
        target_beats = args.beats
    else:
        target_beats = [b["num"] for b in beat_statuses if not b["final_exists"]]

    print(f"Beats cibles : {target_beats}")

    print("Audit assets...")
    asset_audit = audit_all_assets(episode)

    print("Detection sprites dans TSX...")
    sprite_checks: dict[int, list[dict]] = {}
    for b in beat_statuses:
        n = b["num"]
        if n in target_beats and b["tsx_exists"]:
            sprites = extract_sprites_from_tsx(b["tsx_path"], episode)
            crossed = cross_sprites_with_assets(sprites, asset_audit, episode)
            sprite_checks[n] = crossed
        else:
            sprite_checks[n] = []

    print("Checks techniques...")
    tech_checks: dict[int, dict] = {}
    for b in beat_statuses:
        n = b["num"]
        if n not in target_beats:
            tech_checks[n] = {}
            continue

        checks = {}
        if b["tsx_exists"]:
            checks["atlas_violations"] = check_atlas_patterns_quick(b["tsx_path"])
            checks["registration"] = check_registration(episode, b)
        tech_checks[n] = checks

    print("Generation next actions...")
    actions = generate_next_actions(episode, beat_statuses, asset_audit, sprite_checks, tech_checks)

    print("Sauvegarde rapport...")
    report_path = save_report(episode, beat_statuses, asset_audit, sprite_checks, tech_checks, actions)
    update_compact_current(episode, beat_statuses)

    print_report(
        episode, beat_statuses, target_beats,
        asset_audit, sprite_checks, tech_checks,
        actions, report_path
    )


if __name__ == "__main__":
    main()
