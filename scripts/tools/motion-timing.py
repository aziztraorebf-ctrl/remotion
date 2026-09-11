#!/usr/bin/env python3
"""
motion-timing.py — MESURE la structure temporelle d'un mouvement dans une video.

⭐⭐⭐ POURQUOI CE SCRIPT EXISTE (incident chill-meter, 2026-09-10, cout : 1 tour de
revision client) :

La cliente avait envoye une video de reference (un loot box qui tombe). On l'a REGARDEE,
jamais DECOMPOSEE. On en a tire des intentions (« il est lance », « il rebondit », « il y a
de la poussiere ») mais AUCUNE structure temporelle : a quelle image il touche, combien de
temps dure le rebond, quand la poussiere sort. Sans ces chiffres, on code par approximation
— d'ou un `IMPACT_FRAME = 32` pose « a peu pres la », alors que l'objet touchait le sol des
la frame 11. Resultat : 0,67 s ou l'objet etait pose, immobile, avant que « l'impact » ne se
declenche. La cliente l'a vu immediatement (« it slides in, then moves up and down
afterward »), nous non.

Mesurer sa reference a pris 10 minutes et a donne 3 chiffres — contact f10, rebond 6 frames,
poussiere au contact — qui auraient SUFFI a empecher le bug.

⛔⛔ LE TROU D'OUTILLAGE QU'IL COMBLE : `motion-breakdown.py` envoie la video a des LLM pour
qu'ils DECRIVENT le mouvement, et son propre en-tete dit « CE SCRIPT NE DONNE PAS DE VALEURS
[...] les chiffres viennent de la mesure sur les frames — c'est le travail de l'agent, et il
reste obligatoire ». Cette obligation n'a JAMAIS ete outillee. ⭐ Lecon generale : une regle
qui depend d'un travail manuel non outille finit par ne pas etre faite. On l'a fait a la main
UNE fois, en cherchant un bug — jamais en production normale.

CE QUE CE SCRIPT FAIT — de la mesure pure, zero LLM, zero appel reseau, zero cout :
  1. Suit l'objet en mouvement frame par frame (difference avec l'image de repos).
  2. En deduit : frame de CONTACT, si la chute ACCELERE, ou sont les PICS de mouvement
     (rebonds), et a partir de quelle frame l'image est STABLE.
  3. Detecte les attaques SONORES et les rapproche des evenements visuels.

DEUX USAGES, le second est le plus utile :
  A. Sur la REFERENCE du client, AVANT de coder -> donne les constantes a coder.
  B. Sur NOTRE rendu, AVANT de livrer -> verifie que notre structure colle a la sienne,
     et surtout que son + image COINCIDENT (le defaut qui ne se voit pas a l'oeil).

Usage :
  python3 scripts/tools/motion-timing.py <video.mp4> [--fps 30] [--max-frames 60]
                                         [--zone x0,y0,x1,y1] [--repos-frame N]

  --zone        limite la mesure a un rectangle (utile si l'arriere-plan bouge :
                un plateau filme, une video qui tourne sous l'overlay)
  --repos-frame frame servant de reference « objet au repos » (defaut : la derniere
                analysee). A ajuster si l'objet bouge encore a la fin.
"""
import argparse
import math
import os
import struct
import subprocess
import sys
import tempfile

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit("Pillow requis : pip install Pillow")


def extraire_frames(video, n, dossier):
    """Extrait les n premieres frames en PNG (sans perte, pour une mesure fiable)."""
    subprocess.run(
        ["ffmpeg", "-v", "error", "-i", video,
         "-vf", f"select='lt(n\\,{n})'", "-vsync", "0", "-pix_fmt", "rgb24",
         os.path.join(dossier, "f_%04d.png")],
        check=True,
    )
    return sorted(
        os.path.join(dossier, f) for f in os.listdir(dossier) if f.startswith("f_")
    )


def profil_mouvement(frames, zone, repos_idx):
    """Ecart de chaque frame a l'image de repos. Un objet qui se deplace fait monter
    cet ecart ; un objet pose et immobile le fait tomber a zero."""
    ref = Image.open(frames[repos_idx]).convert("L")
    if zone:
        ref = ref.crop(zone)
    profil = []
    for p in frames:
        im = Image.open(p).convert("L")
        if zone:
            im = im.crop(zone)
        diff = ImageChops.difference(im, ref)
        hist = diff.histogram()
        total = sum(i * v for i, v in enumerate(hist))
        profil.append(total / (diff.size[0] * diff.size[1]))
    return profil


def profil_audio(video, fps):
    """RMS par frame, normalise. Sert a situer les attaques (thud, clic, impact)."""
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", video, "-ac", "1", "-ar", "8000",
         "-f", "s16le", "-"],
        capture_output=True,
    ).stdout
    if not raw:
        return []
    n = len(raw) // 2
    ech = struct.unpack("<%dh" % n, raw[: n * 2])
    win = max(1, int(8000 / fps))
    pic = max((abs(x) for x in ech), default=1) or 1
    out = []
    for i in range(0, n - win, win):
        seg = ech[i : i + win]
        out.append(math.sqrt(sum(x * x for x in seg) / len(seg)) / pic)
    return out


def analyser(profil, fps):
    """Deduit la structure : contact, acceleration, pics, stabilisation."""
    if not profil:
        return {}
    mx = max(profil) or 1
    norm = [v / mx for v in profil]

    # CONTACT = la plus forte CHUTE de l'ecart au repos. L'objet arrive pres de sa
    # position finale d'un coup : c'est l'evenement le plus net de la courbe.
    chutes = [(norm[i] - norm[i + 1], i + 1) for i in range(len(norm) - 1)]
    delta_max, contact = max(chutes, default=(0, 0))

    # ACCELERATION : la chute est-elle de plus en plus rapide ? On compare la vitesse
    # de variation sur la 1re et la 2e moitie de la descente. Une chute qui accelere
    # (gravite) a une 2e moitie plus rapide ; un glissement lineaire non.
    accelere = None
    if contact > 3:
        moitie = contact // 2
        v1 = abs(norm[0] - norm[moitie]) / max(1, moitie)
        v2 = abs(norm[moitie] - norm[contact]) / max(1, contact - moitie)
        accelere = v2 > v1 * 1.25

    # PICS apres le contact = rebond(s). Un maximum local franc, pas du bruit.
    pics = []
    for i in range(contact + 1, len(norm) - 1):
        if norm[i] > norm[i - 1] and norm[i] >= norm[i + 1] and norm[i] > 0.04:
            pics.append(i)

    # ⛔ Le SOMMET d'un rebond n'est pas son DEPART. Un rebond sain part au contact et
    # culmine 3-6 frames plus tard (mesure sur la reference cliente : contact f8, sommet
    # f13 — et ce rebond-la est exemplaire). Chercher le seuil sur le sommet produisait un
    # faux positif sur sa propre video de reference. Ce qui compte est le DEPART : la
    # 1re frame ou la courbe REMONTE apres le contact. C'est elle qui doit valoir ~contact.
    depart_rebond = None
    if pics:
        i = pics[0]
        while i - 1 > contact and norm[i - 1] < norm[i]:
            i -= 1
        depart_rebond = i

    # STABLE : a partir d'ou l'image ne bouge plus (sous 2 % du max, definitivement).
    stable = None
    for i in range(contact, len(norm)):
        if all(v < 0.02 for v in norm[i:]):
            stable = i
            break

    return {
        "contact": contact,
        "delta_contact": delta_max,
        "accelere": accelere,
        "pics": pics,
        "depart_rebond": depart_rebond,
        "stable": stable,
        "norm": norm,
    }


def attaques_audio(aud, seuil=0.05):
    return [i for i in range(1, len(aud)) if aud[i] - aud[i - 1] > seuil]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--max-frames", type=int, default=60)
    ap.add_argument("--zone", help="x0,y0,x1,y1 — limite la mesure a ce rectangle")
    ap.add_argument("--repos-frame", type=int, default=None,
                    help="frame de reference 'objet au repos' (defaut : la derniere)")
    a = ap.parse_args()

    if not os.path.exists(a.video):
        sys.exit(f"Introuvable : {a.video}")

    zone = tuple(int(v) for v in a.zone.split(",")) if a.zone else None

    with tempfile.TemporaryDirectory() as d:
        frames = extraire_frames(a.video, a.max_frames, d)
        if len(frames) < 4:
            sys.exit("Pas assez de frames pour mesurer.")
        repos = a.repos_frame if a.repos_frame is not None else len(frames) - 1
        repos = max(0, min(repos, len(frames) - 1))
        prof = profil_mouvement(frames, zone, repos)

    aud = profil_audio(a.video, a.fps)
    res = analyser(prof, a.fps)

    print(f"\n=== STRUCTURE TEMPORELLE — {os.path.basename(a.video)} ===")
    print(f"{len(prof)} frames analysees @ {a.fps} fps"
          + (f" · zone {zone}" if zone else "")
          + f" · repos = frame {repos}\n")

    print("frame |  mouvement  | son   |")
    print("------+-------------+-------+" + "-" * 34)
    for i, v in enumerate(res["norm"]):
        s = aud[i] if i < len(aud) else 0.0
        mark = ""
        if i == res["contact"]:
            mark = "  <== CONTACT"
        elif i in res["pics"]:
            mark = "  <== pic (rebond)"
        elif res["stable"] is not None and i == res["stable"]:
            mark = "  <== stabilise"
        print(f" {i:4d} | {'#' * int(v * 11):<11} | {'*' * int(s * 5):<5} |"
              f" {v:.3f} {mark}")

    print("\n--- LECTURE ---")
    c = res["contact"]
    print(f"  CONTACT              : frame {c}  ({c / a.fps:.2f} s)")
    if res["accelere"] is None:
        print("  Chute accelere ?     : (trop court pour conclure)")
    elif res["accelere"]:
        print("  Chute accelere ?     : OUI — lit comme une chute (gravite)")
    else:
        print("  Chute accelere ?     : NON — vitesse constante, lit comme un GLISSEMENT")
    if res["pics"]:
        p = res["pics"]
        dr = res["depart_rebond"]
        print(f"  Rebond(s)            : {len(p)} — sommet(s) aux frames {p}")
        print(f"  DEPART du rebond     : frame {dr}"
              f"  ({dr - c:+d} frame(s) vs contact)"
              + ("   ⛔ DECROCHE DU CONTACT" if dr - c > 2 else "   OK — colle au contact"))
        print(f"  (sommet a f{p[0]}, soit {p[0] - dr} frames apres le depart — normal)")
    else:
        print("  Rebond(s)            : aucun detecte")
    if res["stable"] is not None:
        print(f"  Stabilise a          : frame {res['stable']}"
              f"  ({res['stable'] / a.fps:.2f} s)")

    if aud:
        att = attaques_audio(aud)
        print(f"\n  Attaques sonores     : frames {att if att else '(aucune)'}")
        for f in att:
            ecart = f - c
            if abs(ecart) <= 2:
                print(f"    f{f} : CALE sur le contact (ecart {ecart:+d})")
            else:
                print(f"    f{f} : ecart {ecart:+d} frames vs contact"
                      f" ({ecart / a.fps:+.2f} s)")
    else:
        print("\n  (pas de piste audio)")

    print("\n⛔ RAPPEL : rebond, poussiere et SFX doivent partir de la frame de CONTACT.")
    print("   Un ecart > 2 frames est le bug qui a coute un tour de revision le 10/09.\n")


if __name__ == "__main__":
    main()
