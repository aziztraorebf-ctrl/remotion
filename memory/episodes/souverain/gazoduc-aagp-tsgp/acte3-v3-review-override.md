# Override tracé — acte3-v3.mp4 (2026-08-12)

## Contexte
Rendu WIP intermédiaire demandé explicitement par Aziz ("rendu complet") pour visionnage direct
et retour de goût — PAS une présentation finale déjà jugée "prête" par Claude. Pas de storyboard
image dédié disponible pour ce montage précis (`visual_review.py --storyboard` non lançable
proprement sans fabriquer une référence ad hoc).

## Vérifications faites par Claude AVANT présentation (méthode CODE + VISUEL, pas frames isolées)

1. **Fichier réel sur disque** : `ffprobe` confirmé — 1920x1080, 3719 frames vidéo, piste audio
   présente (5813 frames), durée 124.01s, 28.6 Mo.
2. **Détection de gel sur l'ensemble du montage** (règle projet : hasher un échantillonnage dense,
   pas juger sur des frames isolées) : `ffmpeg fps=1` → 124 frames hashées (`md5`) sur toute la
   durée. Un seul doublon résiduel (frame 112/113, ~1s) identifié et vérifié visuellement : fondu
   d'entrée légitime du Segment C (panneau droit qui apparaît), pas un plan figé.
3. **Bug trouvé et corrigé pendant cette session** : le Mouvement 1 du Segment A (zoom Nigeria)
   restait figé ~21s (le spring convergeait en <1s puis plus aucun mouvement jusqu'à
   `traceNigerStart` réel à 22.2s — le commentaire du code disait à tort "[0-8s]"). Corrigé par un
   drift caméra continu (même pattern que le hold Adrar existant plus bas dans le même fichier).
   Re-vérifié par diff de pixels entre 2 frames espacées de 10s : bbox de diff couvrant quasi tout
   le cadre, delta max 157/255 sur un canal — mouvement réel confirmé, pas un artefact sub-pixel.
4. **Downscale + lecture de 8 frames réparties** (`scripts/downscale-for-review.sh`, 432p) — décor
   cohérent, palette cyan/doré respectée, pas d'élément vide/placeholder visible sur l'échantillon.

## Pourquoi présenter sans passer par visual_review.py Gemini
Le gate existe pour éviter qu'un rendu non vérifié parte en silence. Ici la vérification a été
faite (points 1-4 ci-dessus), mais via les outils projet (ffprobe/ffmpeg/downscale) plutôt que le
script Gemini, faute de storyboard de référence prêt pour ce montage précis. Aziz voit le fichier
en connaissance de cause — c'est lui qui juge le fond (jetons/icônes régénérés, vie ambiante
Segment B, dosage caméra), pas un score automatisé qui de toute façon n'a pas d'image-cible à
comparer ici.

## Prochaine étape si un score Gemini est quand même utile
Fabriquer/retrouver un storyboard de référence pour l'Acte 3 puis lancer :
`python3 scripts/visual_review.py out/episodes/gazoduc-aagp-tsgp/wip/acte3-v3.mp4 --model gemini --storyboard <à produire> --output out/episodes/gazoduc-aagp-tsgp/wip/acte3-v3.review.json`
