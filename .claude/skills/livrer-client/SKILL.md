---
name: livrer-client
description: "Verifier et empaqueter un livrable client (alpha, codec, nommage, README, envoi). Use avant tout envoi d'un rendu a un client, ou des qu'un export transparent / ProRes / WebM est demande."
---

# Livrer a un client

Le rendu existe. Ce skill le rend envoyable : verifier ce que le client verra, l'empaqueter
sous un nom qu'il comprend, et lui expliquer en clair ce qu'il recoit.

## Phase 1 — Rendre au bon codec

La question qui decide tout : **le client a-t-il besoin de transparence ?** Elle est censee
etre reglee au cadrage (`cadrer-brief-client`). Si elle ne l'est pas, la poser avant de rendre.

### Avec alpha, pour un montage (CapCut, Premiere) — ProRes 4444

```bash
npx remotion render src/index.ts <composition-id> out.mov \
  --codec=prores --prores-profile=4444 \
  --pixel-format=yuva444p10le --image-format=png --scale=1
```

Les trois options sont **independantes et toutes obligatoires** :
- `--prores-profile=4444` seul ne donne PAS d'alpha : ffmpeg retombe silencieusement sur
  `yuv422p12le`. Piege reproduit deux fois (peste-1347 le 2026-07-01, chill-meter le 2026-09-07).
- `--pixel-format=yuva444p10le` est ce qui porte reellement le canal alpha.
- `--image-format=png` est obligatoire : le JPEG n'a pas d'alpha a transmettre.

Poids reel mesure : ~43 Mo pour 135 frames en 1080p. Prevoir l'hebergement en consequence.

### Avec alpha, pour le web — WebM VP8

```bash
npx remotion render src/index.ts <composition-id> out.webm \
  --codec=vp8 --pixel-format=yuva420p --image-format=png
```

~200 Ko contre ~43 Mo, mais le support de l'alpha est inegal dans CapCut. Pour un client qui
monte, prendre le ProRes.

### Sans alpha

`--codec=h264` en `.mp4`. C'est le defaut de nos livrables portfolio.

Reference complete : `memory/tools/remotion.md` § Export video avec ALPHA.

## Phase 2 — Verifier l'alpha, sans se mentir

Rendre ne prouve pas que l'alpha est la. La verification a produit deux faux diagnostics de
« bug Remotion » qui n'existaient pas : la methode compte autant que le rendu.

**Sur un ProRes** — `ffprobe` dit la verite :

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,pix_fmt,width,height,nb_frames \
  -of default=nw=1 out.mov
```

Attendu : `pix_fmt=yuva444p12le` (ffmpeg promeut le 10le demande en 12le a l'ecriture — c'est
normal, l'alpha est bien la). Un `yuv422p12le` signifie zero alpha : re-rendre.

**Sur un WebM VP8** — ⛔ `ffprobe` affiche `pix_fmt=yuv420p` MEME quand l'alpha est presente
et correcte : VP8 la code dans un plan Matroska separe (`BlockAdditional`), pas dans le pixel
format. Le vrai marqueur est le tag conteneur `alpha_mode: "1"`. Et le decodeur ffmpeg par
defaut jette l'alpha silencieusement a l'extraction : `ffmpeg -i x.webm frame.png` donne un
PNG opaque partout (faux negatif). Forcer le decodeur :

```bash
ffmpeg -vcodec libvpx -i out.webm frame.png
```

**Verification finale, non negociable : REGARDER.** Composer le rendu sur un fond contrastant
(pas noir, pas blanc — un gris moyen ou la vraie capture du client) et extraire des frames au
debut, au milieu, a la fin, plus chaque transition. Un rapport vert ne prouve rien ; l'image
prouve. Un fond de controle mal choisi peut aussi contenir un ancien livrable : verifier sur
quoi on compose.

## Phase 3 — Verifier contre les MOTS du brief

Reprendre les demandes numerotees du cadrage, une par une, et confronter chacune au rendu
reel — pas au souvenir de ce qu'on a code. Etat par etat quand le livrable a plusieurs etats.

Sur un objet symetrique : comparer gauche et droite au meme zoom. Une mesure globale ne dit
rien sur la repartition — c'est ainsi qu'un defaut a echappe a une validation avant d'etre vu
par Aziz sur un telephone.

Le hook `pre-presentation-review.sh` bloque de toute facon l'envoi d'un `.mp4` de `out/` sans
review adjacente valide. S'il bloque, la review manque ou est perimee : la relancer, ne pas
la contourner.

## Phase 4 — Empaqueter

Un sous-dossier par livraison, sous `out/PORTFOLIO/` ou le dossier du contrat.

**Le nom est pour le client, pas pour nous.** Il doit savoir ce qu'il ouvre sans demander :
`ChillMeter-Fill75.mov`, jamais `beat3_v4_final.mov`. Meme regle pour les calques d'un `.lottie` :
`livrer_piece.py` renomme et signale ce qui reste illisible.

Joindre un `README.md` court, ecrit pour quelqu'un qui ne connait ni Remotion ni notre chaine :
ce que contient chaque fichier · comment l'importer dans son logiciel · le fait que le fond est
transparent et comment le verifier de son cote · ce qui est modifiable et ce qui ne l'est pas.

## Phase 5 — Envoyer

Un LIEN, jamais un chemin local — Aziz est sur mobile.

- Moins de 16 Mo → Artifact Claude (defaut). Une page par SUJET, enrichie toute la session,
  son lien vit dans le STARTER du sujet.
- Plus de 16 Mo (le cas de tout ProRes) → Vercel Blob (`scripts/tools/upload-to-blob.py`).
- Blob indisponible → catbox, puis Litterbox.

⛔ Verifier `content-length` apres tout upload externe : catbox renvoie HTTP 200 avec
`content-length: 0` en cas de faux succes.

⛔ Un upload n'est pas une archive : garder le rendu local.

Le message au client passe par `outbound-message-guard.sh`. Ecrire en clair, nommer le fichier
et ce qu'il contient.
