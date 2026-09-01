# Transparence lue comme bug

> Migré depuis auto-memory 2026-08-31 (extension 2026-08-29). Référencé en 1 ligne d'index dans
> `MEMORY.md` § "Rendu/présentation" mais le détail complet n'existait nulle part côté repo.

Sur un overlay 1920x1080 a fond transparent (Remotion + ProRes alpha), j'ai signale a Aziz un
« rectangle noir opaque » au centre du cadre, puis « corrige » l'onde de choc pour le faire
disparaitre. **Il n'y avait aucun bug.** Mesure : le pixel au centre = `(0,0,0,0)` — alpha zero,
57,2 % de l'image transparente, 1 % de pixels opaques sombres (le corps de l'objet).

**Why:** les visualiseurs d'images (dont l'outil Read) aplatissent le canal alpha sur un fond noir
par defaut. La transparence *s'affiche* donc exactement comme le defaut qu'on redoute. Deux
tentatives de correction perdues, et une modification du code pour un probleme inexistant.

**How to apply:** devant une zone noire suspecte sur un rendu a fond transparent, MESURER avant
de conclure : `Image.open(f).convert("RGBA").getpixel((x,y))` → si alpha == 0, il n'y a rien a
corriger. Composer sur un fond magenta pour lever le doute visuellement. Ne jamais toucher au code
sur la foi d'un apercu aplati.

Corollaire — le VRAI risque est ailleurs : un export sans les bons flags produit un fond noir
CUIT dans le fichier. `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le
--image-format=png` : les trois sont obligatoires ; sans `--pixel-format`, ProRes retombe
silencieusement en `yuv422p12le` sans alpha, **sans erreur**.

## Extension 2026-08-29 — quand c'est l'OUTIL DE MESURE qui ment (WebM / VP9)

Meme famille, forme plus retorse : cette fois ce n'etait pas l'affichage, c'etait la **verification**.
Conversion ProRes alpha -> WebM VP9 pour une page web. Verdict pose : « l'alpha est perdu ».
**Il n'etait pas perdu. La toute premiere commande etait deja correcte.** 3 tentatives de fix
sur une commande qui n'a jamais ete cassee.

**Why:** VP9 ne stocke PAS l'alpha dans le `pix_fmt` du flux principal — il vit dans un flux
secondaire Matroska (`BlockAdditional`), signale par le tag conteneur `alpha_mode=1`. D'ou
deux outils qui echouent de la MEME facon et donnent deux fausses confirmations independantes :
- `ffprobe` rapporte `pix_fmt=yuv420p` meme quand l'alpha est present et correct ;
- `ffmpeg -i out.webm ... .png` aplatit l'alpha en noir, parce que le decodeur VP9 *natif* de
  ffmpeg ignore le BlockAdditional.

**How to apply:** pour un WebM alpha, ⛔ ne jamais conclure sur `pix_fmt`. Tester ainsi :
```
ffprobe -v error -select_streams v:0 -show_entries stream_tags=alpha_mode \
  -of default=nw=1:nk=1 out.webm          # doit rendre 1
ffmpeg -c:v libvpx-vp9 -i out.webm -vframes 1 -pix_fmt rgba f.png   # decodeur FORCE
```
La commande d'encodage qui marche est la plus simple (ni `-auto-alt-ref 0`, ni `-metadata
alpha_mode`, ni `format=` dans le filtre — ffmpeg ecrit le tag seul) :
`ffmpeg -i src.mov -c:v libvpx-vp9 -pix_fmt yuva420p -crf 40 -b:v 0 -vf "scale=640:-2" -an -row-mt 1 out.webm`

⭐⭐ **La lecon generale, au-dela du codec** : quand deux verifications independantes confirment
un probleme, elles peuvent partager le MEME angle mort. Ici les deux passaient par ffmpeg. Le seul
test valable etait le **critere reel d'usage** — le rendu dans un vrai navigateur sur fond temoin.
⭐ Trouve par un agent dedie, apres 2 echecs (protocole des 2 tentatives applique).
Meme motif qu'un outil qui s'auto-evalue (cf MEMORY.md § "rapport-vert-ne-prouve-rien-regarder-l-image").
