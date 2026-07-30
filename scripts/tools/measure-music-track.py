#!/usr/bin/env python3
"""Mesure reproductible d'une piste audio.

Sorties:
  dur      duree (s)
  lufs     LUFS integre (ffmpeg loudnorm, print_format=json)
  rms      RMS global (dBFS, astats Overall)
  peak     peak global (dBFS)
  ampl5    amplitude dynamique = max-min du RMS par fenetres de 5 s
  p90p10   ecart p90-p10 du RMS par fenetres de 1 s (methode de l'index existant)
  floor    RMS de la fenetre 5 s la plus faible (= niveau des "trous")
  bande    RMS filtre 200 Hz - 2 kHz (bande de la voix)
  loop     |RMS(3 premieres s) - RMS(3 dernieres s)| (couture de boucle)
"""
import json
import subprocess
import sys


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stderr


def rms_of(path, extra=None, ss=None, t=None):
    cmd = ["ffmpeg", "-hide_banner", "-nostats"]
    if ss is not None:
        cmd += ["-ss", str(ss)]
    if t is not None:
        cmd += ["-t", str(t)]
    cmd += ["-i", path]
    af = (extra + ",") if extra else ""
    cmd += ["-af", af + "astats=metadata=1:reset=0", "-f", "null", "-"]
    err = run(cmd)
    val = None
    for line in err.splitlines():
        if "RMS level dB:" in line:
            try:
                val = float(line.split("RMS level dB:")[1].strip())
            except ValueError:
                pass
    return val


def window_rms(path, win, total):
    """RMS par fenetre de `win` secondes, en DECOUPANT reellement le fichier.

    On tranche avec -ss/-t puis on lit le RMS "Overall" de la tranche (derniere
    occurrence de "RMS level dB:"). C'est lent mais NON AMBIGU : la variante
    asetnsamples+astats:reset ne reinitialisait pas reellement les compteurs et
    renvoyait une amplitude quasi nulle (verifie 2026-07-29).
    """
    vals = []
    n = int(total // win)
    for i in range(n):
        v = rms_of(path, ss=i * win, t=win)
        if v is not None and v > -200:
            vals.append(v)
    return vals


def lufs(path):
    cmd = [
        "ffmpeg", "-hide_banner", "-nostats", "-i", path,
        "-af", "loudnorm=I=-23:TP=-2:LRA=7:print_format=json",
        "-f", "null", "-",
    ]
    err = run(cmd)
    try:
        blob = err[err.rindex("{"): err.rindex("}") + 1]
        d = json.loads(blob)
        return float(d["input_i"]), float(d["input_lra"]), float(d["input_tp"])
    except Exception:
        return None, None, None


def dur(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip()
    return float(out) if out else 0.0


def percentile(v, p):
    if not v:
        return None
    s = sorted(v)
    i = (len(s) - 1) * p / 100.0
    lo, hi = int(i), min(int(i) + 1, len(s) - 1)
    return s[lo] + (s[hi] - s[lo]) * (i - lo)


def measure(path):
    d = dur(path)
    li, lra, tp = lufs(path)
    w5c = window_rms(path, 5, d)
    ampl5 = (max(w5c) - min(w5c)) if w5c else None
    floor = min(w5c) if w5c else None
    p9010 = (percentile(w5c, 90) - percentile(w5c, 10)) if w5c else None
    head = rms_of(path, ss=0, t=3)
    tail = rms_of(path, ss=max(0, d - 3), t=3)
    loop = abs(head - tail) if (head is not None and tail is not None) else None
    return {
        "path": path,
        "dur": round(d, 1),
        "lufs": li,
        "lra": lra,
        "tp": tp,
        "rms": rms_of(path),
        "bande": rms_of(path, "highpass=f=200,lowpass=f=2000"),
        "ampl5": round(ampl5, 1) if ampl5 is not None else None,
        "p90p10": round(p9010, 1) if p9010 is not None else None,
        "floor": round(floor, 1) if floor is not None else None,
        "loop": round(loop, 1) if loop is not None else None,
    }


if __name__ == "__main__":
    res = [measure(p) for p in sys.argv[1:]]
    print(json.dumps(res, indent=1))
