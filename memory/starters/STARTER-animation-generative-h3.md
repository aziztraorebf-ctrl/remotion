# STARTER — Animation générative (Gemini → H3 → screen → Remotion)

> Capacité **prouvée le 2026-09-07**. Chaîne complète, gratuite, mesurée.
> Doctrine : `memory/doctrines/CONCEPTS-ANIMES-AVANT-LE-CODE.md`
> Mécanique + gotchas : `memory/tools/minimax-h3-comfy-cloud.md`
> 📱 Page de suivi : https://claude.ai/code/artifact/99f5ae49-5719-495b-a3b8-d8d652b7b849

## LA CHAÎNE EN 4 ÉTAPES

1. **Gemini** génère la matière sur FOND NOIR PUR (`gemini-i2i.py --ref canvas-noir.png`)
   → exiger « PURE BLACK BACKGROUND #000000 » dans le prompt, vérifier `pixel(0,0)` avant d'animer.
2. **H3** l'anime — ⛔ `submit_workflow` avec le gabarit
   `scripts/tools/comfy-graphs/minimax-h3-r2v-graph-template.json`, **JAMAIS `run_template`**
   (bug connu : garde l'image de démo, sortie 640×640). Remplacer 137.image / 138.value /
   132.value ; width+height en INT littéraux sur 136 ; supprimer `ref_image_1` + node 139.
3. **`mixBlendMode: "screen"`** dans Remotion → le noir disparaît, zéro détourage, zéro coût.
   ⛔ `<Sequence>` obligatoire autour d'`OffthreadVideo` · `<Loop>` si la compo dépasse le clip.
4. **Contrôle** en code : opacité, cadrage, masque de retenue, timing.

## ⛔ LES 4 VERDICTS QUI ÉVITENT DE REFAIRE LES TESTS

| Question | Réponse mesurée |
|---|---|
| Faut-il un détourage alpha payant (Bria) ? | **NON** — `screen` fait mieux sur matière lumineuse (+18,2 contre +1,8). Bria est technic. parfait mais alpha *remplace* les pixels gris ; une brume est *additive*. 11 crédits/s économisés. |
| Peut-on animer un effet calé SUR un objet (givre sur des vis) ? | **NON** — reste en calques Gemini générés *depuis l'objet*. Une vidéo générée à côté ne connaît pas la géométrie. |
| Peut-on contrôler la densité d'un effet plein cadre ? | **NON** — flocons H3 : +3,8 à +9,7 sur le visage contre 0,2 % en codé. Le génératif subit, le code règle. |
| Peut-on changer la matière sans changer le mouvement ? | **OUI** — éditer l'IMAGE source (~0,03 $) + relancer au **même seed**. Prouvé : bleuté→blanc, lum 83-123 → 172-179, mouvement identique. ⛔ Jamais éditer la vidéo (4,17 $). |

## ⭐ LA RÈGLE QUI TRANCHE

**Génératif = la MATIÈRE · Code = le CONTRÔLE.**
Et : **mesurer la contrainte AVANT de juger la beauté** — sur 6 effets testés, 3 ont été
éliminés par la mesure, pas par le goût.

## GOTCHAS PAYÉS (ne pas re-découvrir)

- `upload_file` refuse les .mp4 → passer par un GIF, puis `LoadImage` + `CreateVideo`.
- Seed Bria plafonné à **2147483647** (un seed H3 le dépasse et casse la validation).
- Prompt : demander une turbulence **continue**, jamais « se dissoudre » (cadre vide en fin).
- `objectFit: "cover"` sur un ratio différent rogne le clip → `fill` pour une matière.
- **yt-dlp** : un 403 = version périmée. Et `/opt/homebrew/bin/yt-dlp` reste périmé après un
  `pip upgrade` — le binaire du PATH est le bon. Cf. `memory/tools/yt-dlp.md`.

## OÙ SONT LES CHOSES

- Composant de test : `src/projects/_rnd/chill-meter/TestBrumeH3.tsx`
  (compos `ChillMeter-TEST-*` dans `src/Root.tsx`, dont `SurSaVideo` = plateau vidéo réel)
- Clips produits : `public/_client-sim/chill-meter/test-brume/`
- Gabarit du graphe : `scripts/tools/comfy-graphs/minimax-h3-r2v-graph-template.json`
