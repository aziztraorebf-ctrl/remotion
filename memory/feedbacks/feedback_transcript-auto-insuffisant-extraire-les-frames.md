# Un transcript auto ne suffit pas à juger un workflow VISUEL — extraire les frames AVANT de conclure

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Date** : 2026-08-25 · **Déclencheur** : Aziz, « tu n'as pas extrait les frames » · **Gravité** : ⛔⛔ (2 faits faux produits et relayés)

## Ce qui s'est passé
Reverse engineering d'une vidéo YouTube tierce (Danny Why, « Claude Code Just Changed CapCut Forever », 30 min).
J'ai conclu **sur le seul transcript automatique**. Deux erreurs :

1. **Nom propre mal transcrit relayé comme un fait** : le transcript disait « Cance 2.5 ». J'ai affirmé
   **« Kling 2.5 »**. C'était **SEEDANCE 2.5**. Deux outils différents, deux prix, deux pipelines.
2. **Fait purement visuel raté** : l'auteur utilise **Fable 5** — visible UNIQUEMENT à l'écran (son interface,
   son prompt affiché), jamais prononcé. Invisible par construction dans un transcript.

Après extraction de **87 frames + planches contact**, les deux faits sont apparus immédiatement. Bonus : son
prompt, **lu en pleine résolution sur ses propres frames**, contenait des contraintes qu'aucun résumé n'aurait
données (boucle parfaite 5 tours/20 s, anti-green-spill explicite, rendu 8K puis downscale = supersampling).

## Les deux règles

### ⛔ RÈGLE 1 — Un workflow VISUEL se juge sur des FRAMES, jamais sur un transcript
Dès qu'on reverse-engineere une vidéo tierce (outil utilisé, réglage, geste d'interface, prompt affiché),
**extraire les frames est la PREMIÈRE étape, pas une vérification optionnelle**. Le transcript ne capture que
ce qui est *dit* ; un workflow se *montre*. Un auteur ne prononce presque jamais le nom des outils qu'il clique.

```bash
yt-dlp -f 'best[height<=720][ext=mp4]/18' -o /tmp/src.mp4 '<url>'
mkdir -p /tmp/scan && for s in $(seq 60 20 1790); do
  ffmpeg -v error -ss 00:$(printf "%02d:%02d" $((s/60)) $((s%60))) -i /tmp/src.mp4 \
    -frames:v 1 -vf scale=480:-1 /tmp/scan/s$(printf "%04d" $s).jpg -y; done
ffmpeg -pattern_type glob -i '/tmp/scan/s*.jpg' -filter_complex "tile=6x5:margin=4:padding=4" /tmp/planche_%d.jpg
```
⭐ **Lire les zones de texte en PLEINE RÉSOLUTION** (pas sur la planche contact) : c'est là que vivent les
prompts, les noms de modèles et les réglages — la vraie valeur du reverse engineering.

### ⛔ RÈGLE 2 — Un NOM PROPRE issu d'un transcript auto est une HYPOTHÈSE, jamais un fait
Les transcripts auto massacrent systématiquement les noms de produits et de modèles. **Tout nom propre lu dans
un transcript auto doit être confirmé** par la frame où il s'affiche, la description, ou une recherche web.
🚩 **Signal d'alerte** : un nom qui « ne ressemble à rien de connu » n'est pas un outil obscur — c'est presque
toujours un nom courant mal transcrit. ⛔ Ne pas le normaliser silencieusement vers l'outil le plus familier de
ma mémoire (c'est ce que j'ai fait : « Cance » → « Kling », le nom que je connaissais le mieux).

## Famille
Même nature que `feedback_chiffre-audit-relaye-sans-verification` (un chiffre d'agent = SIGNAL, pas fait) et que
la règle CLAUDE.md « NOM PROPRE AFFICHÉ = vérifier contre Wikipédia AVANT render ». Ici la source non fiable est
la **machine de transcription**.
