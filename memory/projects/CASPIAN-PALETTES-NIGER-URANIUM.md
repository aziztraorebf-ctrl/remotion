# Caspian palettes — Décision Niger uranium (Jour 5, 2026-05-09)

> Migré depuis auto-memory 2026-08-31. Composant `CartoCaspian` toujours présent dans le repo
> (`src/projects/_shared/mapbox/templates/CartoCaspian.tsx` + `_shared/demos/CartoCaspianDemo.tsx`).

## Décision Aziz

- **Palette par défaut Niger uranium** : `CASPIAN_SEPIA`
- **Variante climax / beats dramatiques** : `CASPIAN_NOIR` (disponible immédiatement, déjà codée)
- **`CASPIAN_SMOKE`** : gardée dans le code (rare use, sujets neutres/austères)
- **`CASPIAN_PALETTE` (original)** : reste comme référence Or Africain validée précédemment

## Why : choix Sepia

- Lisibilité +40% vs original (frontières admin-0 brun foncé `#3a2f20` à 0.85 vs `#5a5a5a` à 0.6 = 2x plus de contraste)
- Land `#d8c9a8` (sépia vieux papier) chaleureux, cohérence narrative archives uranium
- Highlight Niger `#c08820` (or sombre) ressort fortement sur sépia (couleur complémentaire)
- ADN papier éditorial conservé — pas un pivot total, juste assombri vers le chaud
- Vignette radial 18% aux coins (focus optique sur centre)

## How to apply

```ts
import { applyCartoCaspian, CASPIAN_SEPIA, CASPIAN_NOIR } from "../mapbox/templates/CartoCaspian";

map.on("style.load", () => {
  applyCartoCaspian(map, CASPIAN_SEPIA);  // default Niger uranium
  // OU pour beat climax :
  applyCartoCaspian(map, CASPIAN_NOIR);
});
```

## Comparatif rendu (validé visuellement, liens catbox 2026-05-09 — probablement expirés)

| Variante | Notes |
|----------|-------|
| Original | Référence Or Africain. Frontières trop discrètes pour multi-pays. |
| **Sepia** ⭐ | **DEFAULT Niger uranium**. Lisibilité max + ADN papier. |
| Smoke | Neutre, désaturé. Rare use. |
| Noir alternative | Variante climax. Cohérence EntityDiagram dossier. |

# Principe de design : map = famille de variantes (Souverain)

> ⭐ Ce principe est le contenu le plus durable de ce document — au-delà de la décision Niger uranium.

## Règle

Chaque map de la lib peut avoir N variantes (différentes "lumières"). Toutes les variantes d'une même map DOIVENT partager :
1. **Grammaire visuelle** : structure de couches (water/land/border), niveaux de détail, traitement des labels
2. **Typographie associée** : fonts utilisées (Bebas Neue + IBM Plex Mono pour Caspian)
3. **Placement highlights** : règles de positionnement pays/villes/pins
4. **Comportements interactifs** : timing animations, courbes spring

Seule **la palette de couleurs** change entre variantes. Cela permet de changer la "lumière" d'une scène à l'autre dans une même vidéo SANS rupture stylistique.

## Why : color script narratif

Comme dans Pixar/Ghibli, la palette peut évoluer scène par scène pour soutenir l'arc émotionnel :
- Sepia (état "enquête", neutre informatif) → Noir (climax, révélation dramatique) → Smoke (résolution, recul analytique)
- Le spectateur perçoit un changement émotionnel, pas une rupture stylistique
- Évite le piège "tout dans la même tonalité = monotonie"

## How to apply

- **Par défaut** : utiliser une seule variante par vidéo (ex: Sepia partout pour Niger uranium)
- **Si beat dramatique nécessite plus d'impact** : passer à Noir pour ce beat précis
- **NE JAMAIS** changer de FAMILY dans une vidéo (ex: Caspian → un autre registre de carte = rupture)
- **OK** de changer de variante d'une même family (ex: Caspian Sepia → Caspian Noir = continuité)

## Variantes disponibles au moment de la décision (Jour 5, 2026-05-09)

| Map | Variantes | Status |
|-----|-----------|--------|
| MapboxGeoAfriqueV5 | (1 — version standard) | Variantes Day/Night possibles plus tard si besoin |
| **CartoCaspian** | **4 : Original / Sepia / Smoke / Noir** | ✅ Validé Jour 5 |
| AtlasRealiste3D | (1 — satellite jour) | Variantes crépuscule possibles plus tard |
| MapboxOceanColor | (1 — bleu profond) | Variantes possibles plus tard |

## Ne pas over-engineer

- N'introduire de nouvelles variantes que **quand le besoin narratif émerge** dans une vidéo en cours, pas avant
- 4 maps × 3 variantes = 12 styles à maintenir = trop pour 1 vidéo
- Au moment de la décision : 4 variantes Caspian étaient assez.

## Application immédiate Niger uranium (2026-05-09)

- Hook ouverture : GlobeLocationReveal `style="souverain"` (continuité globe nuit)
- Beat 1 contexte géographique : CartoCaspian **Sepia**
- Beat 2 dossier acteurs : EntityDiagram (déjà bleu nuit, autonome)
- Beat 3 comparaison ères : ComparisonTable `background="dossier"` (déjà bleu nuit)
- Beat 4 climax révélation chiffrée : CartoCaspian **Noir** (changement de "lumière" pour appuyer la dramaturgie)
- CTA : retour vers KraftCardDocClassifie + signature
