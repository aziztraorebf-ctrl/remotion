#!/usr/bin/env python3
"""Demonte un Lottie personnage : geometrie MONDE, chaine de parentage resolue.

⛔⛔ POURQUOI CET OUTIL EXISTE (3 pieges mesures le 2026-08-29 sur 15_Customs_Officer) :

1. `planche_calques.py` lit les sommets `sh` BRUTS et ignore les `tr` des groupes
   `gr` qui les portent. Sur une piece pro, CHAQUE forme est dans son propre `gr`
   avec un `tr` qui la PLACE (p=[76,146], p=[71,147]...). Sans eux, un calque de
   73x93 en sommets bruts vaut en realite 293x374 une fois les `tr` appliques.
   => il faut accumuler les `tr` EN DESCENDANT l'arbre des shapes.

2. Le parentage : un `ty=3` (null) porte le cadrage global (ici s=400%, p=[1284,1000]).
   Le NEGLIGER ne donne pas un resultat "un peu decale" mais un resultat qui tombe
   pile sur 0,0 par annulation arithmetique -- donc un faux plausible.

3. ⛔ La verite terrain est le RENDU, pas le calcul. Ce fichier a ete valide contre
   lottie-web (chrome headless, CDP) sur 4 calques temoins.
"""
import argparse, json, os, sys, zipfile

def charger(path):
    """.lottie = archive zip (manifest + animations/*.json) ; .json = direct."""
    if zipfile.is_zipfile(path):
        with zipfile.ZipFile(path) as z:
            # ⛔ le dossier varie selon l'exporteur : 'animations/' (LottieFiles) ou
            # 'a/' (dotLottie compact). Ne PAS coder un chemin en dur -- lire le manifest.
            noms = []
            if 'manifest.json' in z.namelist():
                try:
                    man = json.loads(z.read('manifest.json').decode('utf-8'))
                    for a in man.get('animations', []):
                        ident = a.get('id')
                        if ident:
                            noms += [n for n in z.namelist()
                                     if n.endswith('.json') and ident in n
                                     and not n.endswith('manifest.json')]
                except Exception:
                    pass
            if not noms:
                noms = [n for n in z.namelist()
                        if n.endswith('.json') and not n.endswith('manifest.json')
                        and not n.startswith(('t/', 's/', 'themes/', 'states/'))]
            if not noms:
                sys.exit('archive .lottie sans animation JSON : %s' % path)
            return json.loads(z.read(noms[0]).decode('utf-8'))
    return json.load(open(path, encoding='utf-8'))

def stat(pr, dflt):
    """Valeur a la frame 0 (1ere cle si animee)."""
    if not isinstance(pr, dict): return dflt
    k = pr.get("k")
    if pr.get("a") == 1 and isinstance(k, list) and k:
        s = k[0].get("s", dflt)
        return s if isinstance(s, list) else [s]
    return k if k is not None else dflt

def shapes_monde(noeud, ox=0.0, oy=0.0, sx=1.0, sy=1.0, acc=None):
    """Parcourt l'arbre gr/sh en accumulant les `tr`. Retourne les sommets PLACES."""
    if acc is None: acc = []
    if isinstance(noeud, list):
        for n in noeud: shapes_monde(n, ox, oy, sx, sy, acc)
        return acc
    if not isinstance(noeud, dict): return acc
    if noeud.get("ty") == "gr":
        it = noeud.get("it", [])
        tr = next((c for c in it if c.get("ty") == "tr"), None)
        nox, noy, nsx, nsy = ox, oy, sx, sy
        if tr:
            p = stat(tr.get("p"), [0, 0]); a = stat(tr.get("a"), [0, 0])
            s = stat(tr.get("s"), [100, 100])
            nsx = sx * s[0] / 100.0; nsy = sy * s[1] / 100.0
            nox = ox + (p[0] - a[0] * s[0] / 100.0) * sx
            noy = oy + (p[1] - a[1] * s[1] / 100.0) * sy
        for c in it:
            if c.get("ty") != "tr": shapes_monde(c, nox, noy, nsx, nsy, acc)
        return acc
    if noeud.get("ty") == "sh":
        k = noeud.get("ks", {}).get("k", {})
        if isinstance(k, dict) and "v" in k:
            for v in k["v"]:
                if isinstance(v, list) and len(v) == 2:
                    acc.append((v[0] * sx + ox, v[1] * sy + oy))
    return acc

def analyse(path):
    doc = charger(path)
    L = doc["layers"]; by = {l["ind"]: l for l in L}

    def chaine(l):
        out, seen, cur = [], set(), l
        while cur is not None and cur["ind"] not in seen:
            seen.add(cur["ind"]); out.append(cur)
            cur = by.get(cur.get("parent")) if "parent" in cur else None
        return out

    def monde(l, x, y):
        """Local -> monde. Le calque applique (x-a)*s+p ; chaque ancetre applique
        ensuite x*s + (p - a*s) : son ancre decale SON repere, elle ne se
        re-soustrait pas au point de l'enfant."""
        ks = l["ks"]
        p = stat(ks.get("p"), [0, 0]); a = stat(ks.get("a"), [0, 0]); s = stat(ks.get("s"), [100, 100])
        x = (x - a[0]) * (s[0] / 100.0) + p[0]; y = (y - a[1]) * (s[1] / 100.0) + p[1]
        for anc in chaine(l)[1:]:
            ks = anc["ks"]
            p = stat(ks.get("p"), [0, 0]); a = stat(ks.get("a"), [0, 0]); s = stat(ks.get("s"), [100, 100])
            x = x * (s[0] / 100.0) + (p[0] - a[0] * (s[0] / 100.0))
            y = y * (s[1] / 100.0) + (p[1] - a[1] * (s[1] / 100.0))
        return x, y

    lignes = []
    for i, l in enumerate(L):
        pts = shapes_monde(l.get("shapes", []))
        ks = l["ks"]
        anim = ",".join(k for k in ("r", "p", "s", "o")
                        if isinstance(ks.get(k), dict) and ks[k].get("a") == 1)
        ch = "->".join(str(x["ind"]) for x in chaine(l))
        rec = {"pile": i, "ind": l["ind"], "ty": l["ty"], "chaine": ch,
               "anim": anim or "-", "nb": len(pts)}
        if pts:
            xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
            c0 = monde(l, min(xs), min(ys)); c1 = monde(l, max(xs), max(ys))
            rec.update(cx=(c0[0]+c1[0])/2, cy=(c0[1]+c1[1])/2,
                       w=abs(c1[0]-c0[0]), h=abs(c1[1]-c0[1]))
        lignes.append(rec)
    return doc, lignes

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lottie"); ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    doc, lignes = analyse(a.lottie)
    if a.json:
        print(json.dumps(lignes, indent=1)); return
    print("=== %s : %d calques, %dx%d, %d fps, %d frames ==="
          % (os.path.basename(a.lottie), len(doc["layers"]), doc["w"], doc["h"],
             doc["fr"], doc["op"]))
    print("%4s %4s %3s %-14s %11s %11s %6s %s"
          % ("pile", "ind", "ty", "chaine", "centre", "taille", "somm", "anime"))
    for r in lignes:
        if "cx" in r:
            print("%4d %4d %3d %-14s %11s %11s %6d %s"
                  % (r["pile"], r["ind"], r["ty"], r["chaine"][:14],
                     "%.0f,%.0f" % (r["cx"], r["cy"]), "%.0fx%.0f" % (r["w"], r["h"]),
                     r["nb"], r["anim"]))
        else:
            print("%4d %4d %3d %-14s %11s %11s %6d %s  <<< sans shape"
                  % (r["pile"], r["ind"], r["ty"], r["chaine"][:14], "-", "-", 0, r["anim"]))

if __name__ == "__main__":
    main()
