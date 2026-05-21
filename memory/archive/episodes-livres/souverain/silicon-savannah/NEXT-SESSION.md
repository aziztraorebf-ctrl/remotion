# Silicon Savannah — Next Session Starter
> Créé fin session 2026-05-14. Contexte frais requis.

---

## ÉTAT ACTUEL

### Beat 1 — VALIDÉ
- Fichier : `src/projects/souverain/silicon-savannah/Beat1Hook.tsx`
- Background : `public/souverain/silicon-savannah/bg-beat1.png` (topographique navy) — copié
- Render validé par Aziz — illustration Nairobi + texte + background = formule premium

### Beats 2–7 — À RECODER COMPLÈTEMENT
Tous les beats existants doivent être refaits selon le nouveau storyboard Gemini.
Storyboard complet : `src/projects/souverain/silicon-savannah/storyboard/storyboard-complet.md`

### Backgrounds — ÉTAT PAR BEAT

| Beat | Fichier | Statut |
|------|---------|--------|
| B1 | `public/souverain/silicon-savannah/bg-beat1.png` | VALIDÉ |
| B2 | À régénérer | Régénérer — voir règle background ci-dessous |
| B3 | `public/souverain/silicon-savannah/bg-beat3.png` | Candidat (lignes dorées) — à tester avec texte |
| B4 | `public/souverain/silicon-savannah/bg-beat4.png` | Candidat (anthracite minimal) |
| B5 | À régénérer | Régénérer — voir règle background ci-dessous |
| B6 | `public/souverain/silicon-savannah/bg-beat6.png` | Candidat (diagonales subtiles) |
| B7 | À régénérer | Régénérer — voir règle background ci-dessous |

---

## RÈGLE BACKGROUND (NON-NEGOTIABLE — apprise cette session)

**Le background ne rivalise jamais avec le contenu.**

- Texture discrète, dégradé sombre, grain subtil
- Couleurs : sombres et désaturées — PAS de noir pur (`#000000`) — utiliser #0d1420, #12192a, #1a1f2e
- Aucune forme reconnaissable (pas de carte, pas de contour pays, pas de pins)
- Test : "Si je pose du texte blanc/or dessus, le background disparaît-il ?" → si non, trop fort
- Référence validée : Or Africain — texture grain sombre + ornements de coin très discrets
- INTERDIT dans les prompts : "pure dark", "noir pur", "no shapes" (Gemini refuse et retourne parts=None)
- Prompts qui marchent : "Close-up aged paper / brushed concrete / dark stone texture, deep [couleur] tones, subtle, moody, minimal, portrait 9:16"

### Modèles Gemini (NON-NEGOTIABLE)
- **Génération image** : `gemini-3.1-flash-image-preview`
- **Vision / review** : `gemini-3.1-pro-preview`
- **Fallback review** : `gemini-2.5-flash` (thinking_budget=0, SEULEMENT si 3.1-pro timeout)
- **INTERDIT** : `gemini-2.5-flash-image`, `gemini-2.0-flash-*`, `imagen-*`

---

## PROBLÈMES À FIXER PAR BEAT

### Beat 5 — Le Monopole (`Beat5Monopole.tsx`)
- Score Gemini : 7.0/10 (fallback 2.5-flash)
- Problème 1 : TimelineFracture statique après son animation initiale — violates R1 (max 8s sans changement)
- Problème 2 : overlay "UN SEUL SERVICE" trop discret, apparaît trop tard (frame 585)
- Fix requis : ajouter pulse/glow oscillation sur TimelineFracture après f=180 + monter le stat overlay plus tôt et plus visible

### Beat 2 — Situer 2007
- N'existe pas encore au bon format — à recoder selon storyboard Beat 2
- Storyboard : TimelineFracture (ligne dorée 2007) → TypeReveal (MAJORITÉ NON BANCARISÉE) → icône téléphone + SAFARICOM LANCE M-PESA
- Note : Beat 2 est Mapbox — nécessite `./scripts/render-mapbox.sh` pour le render

### Beats 3, 4, 6, 7
- À recoder from scratch selon storyboard-complet.md
- Chaque beat : storyboard → manifest → code → render → hook Gemini review → score >=8.5

---

## RÈGLE R1 — RAPPEL CRITIQUE
**Max 8 secondes sans changement visible à l'écran.**
- Permanent motion seul (pulse, glow) ne compte PAS comme changement
- Un "changement" = nouveau texte, nouvel élément, transition composant, nouvelle couleur
- Segmenter chaque beat en sous-segments ≤8s AVANT de coder

---

## HOOK GEMINI REVIEW — ÉTAT
- `beat-gemini-review.sh` : fix macOS grep -oP → python3 regex appliqué
- `beat-preflight.sh` : rappel modèles Gemini ajouté
- Les deux hooks sont opérationnels

---

## PIPELINE POUR LA PROCHAINE SESSION

**Ordre recommandé :**
1. Régénérer B2, B5, B7 (prompts texture concrets, pas "pure dark")
2. Valider les 7 backgrounds avec Aziz
3. Recoder Beat 2 (le plus simple narrativement)
4. Render Beat 2 → hook auto → score >=8.5
5. Beats 3, 4, 5 fix, 6, 7 dans l'ordre
6. Assembler composition principale

**À chaque beat :**
- Lire storyboard-complet.md section correspondante AVANT de coder
- `touch /tmp/shared-components-read` après lecture des composants _shared/
- Render dans `out/episodes/silicon-savannah/wip/`
- Hook Gemini auto après render

---

## FICHIERS CLÉS

- Storyboard : `src/projects/souverain/silicon-savannah/storyboard/storyboard-complet.md`
- Manifest : `src/projects/souverain/silicon-savannah/manifest.ts`
- Backgrounds validés : `public/souverain/silicon-savannah/`
- Audio : `public/souverain/silicon-savannah/audio/`
- Règles éditoriales + background : `memory/rules-souverain-editorial.md` (Section 0B)
- Règles modèles Gemini : `memory/tools/gemini.md` (ligne 11)
