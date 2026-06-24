# REPRISE — Scène 4 "la dette" (barrage) : 2 derniers fixes avant FINAL

> Prompt prêt à coller en début de prochaine session. La scène 4 (concept BARRAGE) est À 95% — validée Aziz
> sur le fond, il reste 2 PETITS détails à corriger, puis on grave FINAL. Session fraîche recommandée.

## ÉTAT EXACT (2026-06-24 fin de session)
- Concept BARRAGE choisi par Aziz (le baril ecarté = redondant). Codé par un agent autonome puis amélioré.
- Composant : `src/projects/souverain/senegal-petrole-gaz/beats/SceneDetteV3.tsx` (enregistré dans Root.tsx).
- Dernier render validé sur le fond : `out/episodes/senegal-petrole-gaz/wip/scene4-barrage-v3.mp4`
  (catbox https://files.catbox.moe/qvx8j0.mp4). Audio scène = 243.26s→291s (forced-align V3). Musique redémarrée
  startFrom=0 (la portion 243s+ s'emballait). 50s, 16:9, full HD.
- Plan + synthèse jury + audit faisabilité : `V3-REFONTE/PLAN-SCENE-4-DETTE.md` (COMMITÉ).
- ⚠️ **BRANCHE** : tout le travail scène 4 est commité sur `feat/senegal-v3-scene2-comparaison` (HEAD = 69f6c9b
  "commit PLAN-SCENE-4"). MAIS le working tree est partagé multi-instances et peut être sur une AUTRE branche au
  démarrage (ex `rnd/svg-qwen3.6-test`, où ces commits sont aussi). **Au démarrage, faire `git branch --show-current` ;
  si pas sur une branche contenant le commit 69f6c9b, faire `git log --oneline -3` pour vérifier que SceneDetteV3
  barrage v3 est bien là** (il l'est sur les 2 branches). Ne pas s'inquiéter du nom de branche : vérifier le contenu.

## LES 2 FIXES À FAIRE (puis FINAL)
1. **Fissure nette à la rupture (regression v2→v3)** : en v2 il y avait une vraie fissure zigzag NETTE qui
   apparaissait. En v3 elle est moins présente. Cible : à la rupture (F_VIDER), le mur FONSIS se **sépare en
   deux au MILIEU** (fissure nette zigzag bien visible), PUIS la moitié GAUCHE (côté Sénégal) disparaît (déjà
   fait), ET les lignes de fissure disparaissent AUSSI avec elle (ne pas les laisser persister). 
   → Dans `SceneDetteV3.tsx` : composant `WallCracks` (la fissure spectaculaire technique pièce-d'or existe déjà,
   `jaggedCrack()`) + le bloc "MUR-BARRAGE" (la moitié gauche fade via `wallBreak`). Rendre la fissure centrale
   NETTE et marquée juste avant/pendant la séparation, puis la faire disparaître avec la moitié gauche.
2. **Le bac BUDGET / filet bouge encore** : il doit être IMMOBILE après son apparition. 
   → composant `DrainStream` (le `sway = Math.sin(frame/16)*1.2` bouge encore) + `BudgetBasin`. Figer le filet
   après l'apparition (sway → 0 une fois établi), bac statique.

## COMMENT REPRENDRE (sans être bloqué)
1. Lire ce fichier + `PLAN-SCENE-4-DETTE.md` + `_ASSEMBLAGE-V3.md` (état des renders).
2. Lire `SceneDetteV3.tsx` (composants `WallCracks`, `DrainStream`, `BudgetBasin`, le bloc MUR-BARRAGE).
3. Comparer la fissure v2 (commit 228698b) vs v3 (d263863) pour voir ce qui a régressé : `git show 228698b:src/projects/souverain/senegal-petrole-gaz/beats/SceneDetteV3.tsx` (la version v2 du WallCracks avec le `burst`).
4. Faire les 2 fixes. Render : `npx remotion render src/index.ts SceneDetteV3 out/episodes/senegal-petrole-gaz/wip/scene4-barrage-v4.mp4` (Remotion pur, PAS render-mapbox). typecheck d'abord.
5. Extraire frames (fin ~46s pour la fissure+disparition, ~33s pour le bac), vérifier, présenter Aziz.
6. Si validé → graver `out/episodes/senegal-petrole-gaz/scene4-dette-FINAL.mp4`, cocher `_ASSEMBLAGE-V3.md` +
   `README.md` (scène 4 ✅), purger les wip scene4. **4 scènes V3 = ~49% de l'audio** (0→291s).

## APRÈS LA SCÈNE 4 : la suite
- **Scène 5** = les coulisses / Yakaar (audio 291→347s) : Yakaar pas décidé, Chine observe, Europe ralentit
  (climat). Réf V1 = Beat13. Remotion. → relancer le pipeline agentique (PRODUCTION-AGENTIQUE-REMOTION.md).
- **Scènes 6, 7** : bilan + bonus AES. Voir README V3-REFONTE.
- ⭐ **Le système agentique est PROUVÉ** (doctrine `memory/doctrines/PRODUCTION-AGENTIQUE-REMOTION.md`) : on peut
  lancer des agents (1 ou 2 en parallèle, worktree isolé) pour les scènes suivantes. ⛔ Mapbox agentique = pas
  encore testé. ⚠️ Trous outils connus à garder en tête : visual_review.py parseur de score (override tracé),
  gotcha worktree (lister les assets gitignored), storyboard multi-panel→portrait.

## ⛔ GOTCHAS IMPORTANTS
- Modèles API VERROUILLÉS (CLAUDE.md) — la knowledge cutoff invente sinon.
- Scène 16:9 HORIZONTAL (jamais vertical/empilé). 
- `visual_review.py` peut sortir un score "?" → le hook bloque l'upload → écrire un `.review-override.md` tracé.
