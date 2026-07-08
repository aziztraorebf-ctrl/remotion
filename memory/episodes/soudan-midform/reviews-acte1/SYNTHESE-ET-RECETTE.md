---
name: soudan-acte1-review-synthese
description: Synthèse double review Gemini+Kimi de l'Acte 1 Soudan v3 + recette fiable des 2 outils de review
metadata:
  type: reference
---

# Acte 1 Soudan — Double review v3 (2026-07-07) : synthèse + recette outils

## Recette fiable des 2 reviews (réutilisable — évite les itérations)

- **Gemini VIDÉO complète** : `scripts/tools/gemini-video-review-custom.py <video.mp4> <brief.txt> <out.md>`.
  Upload Files API + attente state ACTIVE (jusqu'à 90×2s) puis `gemini-3.1-pro-preview`, temp 0.4, max_output 4000.
  Voit MOUVEMENT/rythme/son (supérieur aux frames). Fiable (validé 2026-06-16, cf gemini-video-upload-fiable).
- **Kimi FRAMES** : `scripts/tools/kimi-frames-review.py <brief.txt> <out.md> <img1.jpg> ...`.
  ⛔ GOTCHAS (sinon réponse vide, cf [[kimi-review-bug]]) : OpenRouter `moonshotai/kimi-k2.5` (PAS Moonshot direct
  = content=null) · `temperature: 1` obligatoire · `max_tokens: 4000` (2000 tronque) · fallback `content or reasoning`.
  6 frames-clés (1/beat) = bon équilibre (finish_reason:stop, pas de troncature). Images en base64 data-uri.
- **Brief commun** : `brief-commun.txt`. Clé = CADRER dans notre registre parchemin AES ("ne propose pas navy/gold")
  sinon Gemini rejoue la charte Souverain (faux positif récurrent). Signaler les points déjà connus (50M à refaire).

## Verdict (Gemini vidéo + Kimi frames, CONVERGENTS = signal fort)

| Point | Consensus | Action v4 |
|---|---|---|
| Caméra | Serré Darfour beats 1-2 → dézoom au beat 3 (avant al-Burhan) → large partition | APPLIQUÉ |
| Drift | Indispensable, jetons taille écran fixe glissent sans problème (inquiétude Aziz infondée) | APPLIQUÉ, lent + pause sur gestes |
| Drapeaux mines | AUCUN (les 2) — surcharge/ambiguïté ; la voix "bénédiction du gvt" porte le contexte | AUCUN (Aziz a tranché) |
| Ink bleed | feTurbulence+feDisplacementMap sur halos ET contours (encre qui bave, pas gradient net) | APPLIQUÉ |
| Physique jetons | ombre portée dynamique (large→resserrée à l'atterrissage) + halo qui PULSE (pas fade plat) | APPLIQUÉ |
| Vignette | vignette chaude centrale (lampe de bureau) + texture papier | APPLIQUÉ |
| Beat 4 | LIGNE DE FRONT nord→sud qui se trace AVANT les halos = "coupé en deux" physique (idée neuve) | APPLIQUÉ |
| Beat 5 | garder halos de contrôle OPAQUES sous les civils semi-transp = contraste "pris au piège" | APPLIQUÉ |
| 50M | (déjà acté avant review) grille éparpillée RATÉE → INSERT cartouche AES (pions + chiffre) | APPLIQUÉ |

Détail intégral : `gemini-video-v3.md` · `kimi-frames-v3.md`. Reviews = SIGNAL, jamais juge : vérifié contre le réel
(ex. Kimi disait "drapeau = fausse légitimité" mais le beat 1 dit "avec la bénédiction du gvt" → drapeau justifiable
au beat 1 ; Aziz a quand même tranché "aucun" pour l'épure).
