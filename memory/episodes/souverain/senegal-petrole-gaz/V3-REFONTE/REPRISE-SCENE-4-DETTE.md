# Scène 4 "la dette" (barrage) — ✅ FINAL (clôturée 2026-06-25)

> Cette fiche est CLOSE. La scène 4 est validée Aziz et gravée FINAL. Pour la suite → voir § SCÈNE 5 en bas.

## RÉSULTAT
- ✅ Concept BARRAGE. Composant : `src/projects/souverain/senegal-petrole-gaz/beats/SceneDetteV3.tsx`.
- ✅ FINAL : `out/episodes/senegal-petrole-gaz/scene4-dette-FINAL.mp4` (catbox https://files.catbox.moe/f1wbdp.mp4).
- Durée 45.4s / 1363f, 16:9 full HD. Audio scène = 243.26s → **288.7s**. Musique startFrom=0.

## CE QUI A ÉTÉ FAIT EN DERNIÈRE SESSION (v3 → v5)
1. **Fissure NETTE à la rupture** (régression v2→v3 corrigée) : `burst` recalé pile sur F_VIDER + ajout d'une
   **fissure centrale verticale** (`splitCrack` dans `WallCracks`) qui sépare le mur en deux au milieu, puis
   disparaît avec la moitié gauche du mur. La cause de la régression était le `burst` qui culminait AVANT F_VIDER.
2. **Filet DrainStream figé** : `sway *= settle` (1 à l'ouverture F_PIOCHER+12 → 0 à +42). Ruban immobile une fois établi.
3. **Raccord audio corrigé (retour Aziz)** : la v4 coupait à 291.2s = EN PLEIN MILIEU de "Reste le dernier terrain.
   Et celui-là, [coupe] il se joue loin de Dakar". Coupe ramenée à **288.7s** (fin nette de "...ne protège plus
   rien" à 288.34s + 0.36s de souffle). END 1440→1363, F_FIN 1389→1342 (fade après la fin de l'effondrement).
   Vérifié par forced-align V3 + analyse RMS de la queue : aucune amorce de la phrase suivante ne déborde.

## GOTCHA méthode (à retenir)
- Le hook `pre-presentation-review.sh` exige une `<mp4>.review.json` à jour avant tout upload catbox. Si score < 8
  uniquement à cause de faux positifs Gemini (ici : Gemini réclame de retirer le ROUGE = la dette/l'alerte FMI,
  qui sont la sémantique CENTRALE) → écrire un `<mp4>.review-override.md` tracé PLUS RÉCENT que le mp4, point par
  point. NE PAS modifier le hook, NE PAS contourner. Gemini = signal, jamais juge.

---

## ▶ SCÈNE 5 — "qui regarde dans les coulisses" (terrain 3) — NEXT
- **Point d'entrée audio = 288.7s** (juste après la coupe sc.4). Commence par : "Reste le dernier terrain.
  Et celui-là, il se joue loin de Dakar. Souvenez-vous du troisième champ — Yakaar-Teranga, celui qui attendait..."
- Audio scène 5 ≈ 288.7s → ~347s. Réf V1 = Beat13. Contenu : Yakaar pas décidé, Chine observe, Europe ralentit (climat).
- Format : Remotion (data-viz/géopolitique). Relancer le pipeline agentique → `memory/doctrines/PRODUCTION-AGENTIQUE-REMOTION.md`.
- Continuité visuelle : registre navy #16213a + grille or + BebasNeue (cohérence sc.1b/3/4). Drapeau via `useClipFlags`.
- ⛔ 16:9 HORIZONTAL. Modèles API VERROUILLÉS (CLAUDE.md).

## ÉTAT GLOBAL V3 (après scène 4)
- ✅ Scènes 0, 1, 2, 3, 4 FAITES. ⬜ Scènes 5, 6, 7 à faire.
- **5 scènes V3 couvrent l'audio 0 → 288.7s ≈ 50% de la narration** (durée totale ~580s).
- Tableau complet + composants → `README.md` (source de vérité V3).
