---
name: Niger S1 — État fin session 2026-05-08 + plan prochaine session
description: Problèmes identifiés S1HookNiger + plan de travail session suivante
type: project
---

# Niger S1 — État fin session + plan prochaine session

**Statut** : NON VALIDÉ par Aziz. À reprendre.
**Fichier** : `src/projects/souverain/niger-uranium/scenes/S1HookNiger.tsx`
**Composition** : `NigerS1Hook` dans Root.tsx

---

## Problèmes identifiés (session 2026-05-08)

### 1. Couleur territoire — or trop criard au zoom
- Or `#f5d547` visible de loin mais écrasant une fois zoomé sur Niger
- Même problème que le vert précédent : trop saturé
- **Solution prochaine session** : extraire frames de `out/or-africain/or-africain-FINAL.mp4` pour reverse-engineer exactement comment Ghana est traité dans Or Africain — opacité réelle, couleur exacte, traitement au zoom

### 2. Pulse Arlit mal positionné
- Mine d'Arlit apparaît hors du territoire Niger
- Position SVG hardcodée (cx=460, cy=700) ne suit pas la projection caméra
- Malgré correction tentée, placement reste incorrect
- **Solution** : utiliser `map.project([lon, lat])` via ref Mapbox pour position pixel exacte OU accepter un positionnement manuel calibré frame par frame via screenshot

### 3. Badge "×20 la norme" — placement bizarre
- Apparaît au mauvais endroit visuellement
- Chevauchement avec badge principal quand les deux sont visibles simultanément
- Timing à revoir (trop tôt ?)

### 4. Risque "mass produce / template générique"
- **Règle Aziz** : la scène doit être reconnaissable comme Souverain SANS être un copier-coller exact de Or Africain
- Actuellement : même badge, même progress bar, mêmes positions → risque de contenu perçu comme générique par YouTube et spectateurs
- **Ce qu'il faut garder** : structure encadrée (fond noir + bordure) — c'est la signature
- **Ce qu'il faut différencier** : couleurs (pas or Ghana = or Niger), typographie (variation subtile), positionnement des éléments

---

## Plan session prochaine

### Étape 1 — Reverse-engineer Or Africain
- Extraire 3-4 frames de `out/or-africain/or-africain-FINAL.mp4` au moment du zoom Ghana
- Mesurer : opacité réelle du fill, taille typo, position exacte des badges
- Identifier ce qui rend Ghana "premium" vs S1 Niger actuel

### Étape 2 — Couleur territoire Niger
- Tester opacité réduite de l'or : `fill-opacity: 0.45` au lieu de 0.85
- Alternative : couleur distincte pour Niger — ne pas reprendre l'or Ghana exactement
- Candidats : or désaturé `#c9a227`, or sombre `#a88a1a`, ou blanc très léger `0.15 opacity`

### Étape 3 — Pulse Arlit repositionné
- Utiliser screenshot exact frame zoom Arlit pour calibrer cx/cy à la main
- Ou implémenter projection Mapbox via `map.project()` correctement

### Étape 4 — Différenciation visuelle vs Or Africain
- Changer police du badge : Georgia → Inter ExtraBold (différent d'Or Africain)
- Retirer progress bar (trop identique) → remplacer par ligne fine différente
- Repositionner les badges (pas top:260 comme Or Africain)

### Étape 5 — Timing overlays
- Revoir quand ×20 apparaît : peut-être dans le même encadré que 400 FÛTS (pas un badge séparé)

---

## Fichiers à lire en début de prochaine session
1. Ce fichier
2. `memory/episodes/niger-uranium/DECISIONS-LOCKED.md`
3. `src/projects/souverain/niger-uranium/scenes/S1HookNiger.tsx`
4. `out/or-africain/or-africain-FINAL.mp4` → extraire frames via yt-dlp ou ffmpeg
