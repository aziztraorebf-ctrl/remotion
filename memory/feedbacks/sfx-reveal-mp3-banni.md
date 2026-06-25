---
name: sfx-reveal-mp3-banni
description: "Le SFX ui/reveal.mp3 dure 18.4s et contient une voix — ne jamais l'utiliser"
metadata: 
  node_type: memory
  type: project
  originSessionId: fc5f26c6-b90c-4a2c-ab12-2de5f4f7a354
---

`public/_shared/sfx/ui/reveal.mp3` est catalogué dans SFX-INDEX comme "reveal doux ~0.6s" mais dure en réalité **18.4 secondes et contient une voix masculine** ("et voici la vérité qu'on ne dit jamais"...).

Découvert le 2026-06-03 sur Petrole Patience Short : utilisé via `<Sequence durationInFrames={60}>` pour les allumages de drapeaux, il a injecté une voix fantôme par-dessus la narration (audible à ~14s, à l'arrivée Angola, et à la fin).

**Pourquoi :** un fichier SFX mal catalogué peut contenir tout autre chose que son label. La durée réelle est la première chose à vérifier.

**How to apply :** pour un son d'apparition court (allumage drapeau, reveal élément), utiliser `ui/plate-pop.mp3` (0.48s) ou `ui/node-appear.mp3` (0.48s). TOUJOURS vérifier `ffprobe -show_entries format=duration` d'un SFX avant de l'intégrer si sa durée annoncée semble louche. L'index SFX a été corrigé (reveal.mp3 marqué ⛔ banni).
