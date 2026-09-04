"""Chill Meter — verification des zones protegees, sur TOUTES les frames.

Usage : python3 scripts/tools/chill-meter-scan-zones.py <rendu.mov> <dossier_travail>

Compose le rendu alpha sur le plateau nu et mesure, frame par frame :
  - % de pixels modifies dans la fenetre video   -> doit etre 0 (interdit n°1)
  - % dans la zone visage                        -> quelques flocons admis, pas un voile
  - % dans le tiers superieur                    -> doit etre 0 AU 75 % seulement
  - saturation de la zone temoin                 -> doit rester ~60 (interdit n°5)
  - frames sans decor                            -> doit etre vide (piege <image> SVG)

⛔ Un echantillon de 3 frames NE PROUVE RIEN : les violations trouvees le 04/09 (fleurs
   de givre dans la fenetre video, onde qui frole le cadre) n'apparaissaient que sur
   certaines frames. Ce script les balaie toutes.
⛔ alpha DROIT (non premultiplie) -> PIL alpha_composite, jamais ffmpeg overlay.
"""
import sys, os, subprocess
from PIL import Image
import numpy as np
MOV=sys.argv[1]; OUT=sys.argv[2]
os.makedirs(OUT, exist_ok=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',MOV,'-vf','format=rgba',f'{OUT}/f_%04d.png'],check=True)
dec=Image.open('public/_shared/rnd/abigirl-decor.png').convert('RGBA')
dn=np.array(dec.convert('RGB')).astype(int)
hd=np.array(dec.convert('HSV')).astype(int)[:,:,1]
Z=dict(video=(237,725,28,872), visage=(280,700,1150,1460), tiers=(0,360,0,1920))
SAT=(100,260,1500,1900)
n=len([x for x in os.listdir(OUT) if x.startswith('f_')])
worst={k:(0,-1) for k in Z}; vides=[]; sat_min=(999,-1)
for i in range(1,n+1):
    ov=Image.open(f'{OUT}/f_{i:04d}.png').convert('RGBA')
    a=np.array(ov)[:,:,3]
    if (a>8).sum()/a.size < 0.001: vides.append(i-1)
    comp=Image.alpha_composite(dec,ov)
    c=np.array(comp.convert('RGB')).astype(int)
    ch=(np.abs(c-dn).max(axis=2)>6)
    for k,(y0,y1,x0,x1) in Z.items():
        m=ch[y0:y1,x0:x1]; p=100.0*m.sum()/m.size
        if p>worst[k][0]: worst[k]=(round(p,4), i-1)
    s=np.array(comp.convert('HSV')).astype(int)[:,:,1]
    sv=float(s[SAT[0]:SAT[1],SAT[2]:SAT[3]].mean())
    if sv<sat_min[0]: sat_min=(round(sv,1), i-1)
print(f"frames={n} vides={vides}")
for k,v in worst.items(): print(f"  PIRE {k}: {v[0]} % (frame {v[1]})")
print(f"  saturation MIN: {sat_min[0]} (frame {sat_min[1]}) — reference decor nu: {round(float(hd[SAT[0]:SAT[1],SAT[2]:SAT[3]].mean()),1)}")
