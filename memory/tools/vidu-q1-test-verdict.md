# Vidu Q1 Reference-to-Video — Verdict test 2026-04-22

## Test execute
- Scene : Sonjata Papercraft scene 8B (Charte du Mande, 12 chefs assemblee sous baobab)
- Image source : `scene8b-charte-proclamation-v3.png` (meme image que test Seedance V2 existant)
- Endpoint : `fal-ai/vidu/q1/reference-to-video`
- Params : aspect_ratio 9:16, movement_amplitude "small", bgm false, 1 ref image
- Output : 5.4s, 1080x1920, 24fps, ~$0.40
- Fichier : `public/assets/library/geoafrique/heros-oublies/soundjata/clips-pending/scene8b-charte-vidu-q1-test.mp4`

## Verdict Aziz (honnête)
**Decevant.** Style parfaitement maintenu MAIS clip trop statique.

**Ce qui marche** :
- Style paper-craft sepia maintenu frame par frame (meilleur que Seedance V2 sur le meme test)
- Dot-eyes preserves sur 12+ personnages
- Palette ocre/sepia intacte, zero drift photorealisme

**Ce qui ne marche pas** :
- Mouvement camera quasi-inexistant malgre prompt "camera orbits 90 degrees"
- Sundiata quasi-statique (leve la tablette + bouge les levres, c'est tout)
- Personnages autour : juste quelques clignements d'yeux
- Arriere-plan (baobab, ciel) completement fige

## Hypothese possible (pas confirmee)
Le `movement_amplitude: "small"` a peut-etre trop contraint le mouvement. Un test `medium` coûterait $0.40 de plus mais **Aziz n'a pas valide cette re-tentative** — il ne veut pas gaspiller de credits pour confirmer une intuition.

## Decision
**Vidu Q1 Ref2V = pas adopte dans le pipeline** pour scenes multi-personnages historiques paper-craft. Seedance V2 reste le choix defaut malgre son prix plus eleve : le mouvement produit est superieur, et le style tient suffisamment avec les clauses "MAINTAIN dot-eyes".

## Cout total du test
$0.40 pour generation Vidu. Decision eclairee obtenue rapidement.

## Re-evaluation future
Si Vidu sort Q3 Ref2V avec amplitude auto plus agressive, ou si un cas specifique emerge (ex: scene multi-perso ou Seedance dérive), re-tester avec `movement_amplitude: medium` ou `large`.

---
Migré depuis auto-memory (`vidu-q1-test-verdict.md`) le 2026-08-31, contenu original inchangé.
