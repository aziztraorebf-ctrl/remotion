---
name: "PixelLab map_object — recette gagnante pour illustrer cartes Atlas"
description: "Validé Empire Ghana Beat 1 v4 : objets PixelLab génèrent 2-3x plus vite que personnages, sans animation requise. Recipe pour illustrer cartes Atlas sans recourir à Lottie ou icônes génériques."
type: feedback
---

# PixelLab map_object — recette gagnante Atlas

> Validé Empire Ghana Beat 1 v4 (2026-05-03). Aziz : "On a trouvé une recette gagnante. On peut placer des objets sur notre carte et ça nous permet d'être inventif."
>
> **Règle** : pour illustrer une carte Atlas, **PixelLab map_object > Lottie > SVG manuel**.

## Avantages observés

| Critère | Objets PixelLab | Personnages PixelLab | Lottie | SVG manuel |
|---------|-----------------|----------------------|--------|------------|
| Temps génération | **30-60s** | 2-3 min (4 dirs + anim) | Génération instantanée mais code 100-300 lignes | Code 50-200 lignes |
| Qualité visuelle | **Premium** (relief 3D, ombres, détails) | Premium | Géométrique limité (~10 vertices max) | Plat |
| Animation requise | **NON** (breathing CSS suffit) | OUI (walk cycle) | OUI (souvent décevante) | OUI |
| Réutilisable cross-épisodes | OUI | Limité (sujet-spécifique) | OUI | OUI |
| Ressemblance objet réel | **EXCELLENTE** | EXCELLENTE | MAUVAISE pour objets | MAUVAISE |

## Recipe technique

### Génération (MCP tool)

```typescript
mcp__pixellab__create_map_object({
  description: "<objet médiéval clair>, <matériau/texture>, <vue>, isolated on transparent background, pixel art style matching ATLAS palette: <hex colors>, no text",
  width: 96,    // 64 pour POI carte, 96 pour spotlight, 112 pour héros
  height: 96,
  view: "high top-down",  // ou "side" pour profil
  detail: "high detail",
  shading: "detailed shading",
  outline: "single color outline",
})
```

### Pattern prompt

```
[OBJET CONCRET] [contexte historique], [matériau/couleur dominante], [détails distinctifs visibles], [vue: top-down ou side], isolated on transparent background, pixel art style matching ATLAS palette: [3 hex colors max], no text
```

**À TOUJOURS inclure** :
- "isolated on transparent background" → fond transparent garanti
- "no text" → évite que PixelLab ajoute du texte parasite
- "matching ATLAS palette + hex colors" → cohérence visuelle cross-épisodes
- View explicite ("high top-down" pour cartes, "side" pour objets profil)

### Intégration Remotion (pattern Beat 1 v4)

```tsx
import { staticFile } from "remotion";

<image
  href={staticFile("empire-ghana/assets/pixellab/koumbi-saleh.png")}
  x={poiX - 44}
  y={poiY - 44}
  width="88"
  height="88"
  preserveAspectRatio="xMidYMid meet"
  style={{ imageRendering: "pixelated" }}  // CRITIQUE : pas de blur
/>
```

**Animations légères CSS/SVG** :
```tsx
// Breathing subtil (pas besoin d'animer via PixelLab)
const breathing = 1 + 0.04 * Math.sin(localFrame * 0.08);

<g transform={`translate(${x} ${y}) scale(${breathing})`}>
  <image href={...} />
</g>
```

Ça suffit largement. **Pas besoin de générer une animation PixelLab** pour les objets statiques (économie 60s par asset, et qualité égale visuellement).

## Bibliothèque Empire Ghana (validée 2026-05-03)

Dans `public/empire-ghana/assets/pixellab/` :

| Fichier | Description | Usage |
|---------|-------------|-------|
| `koumbi-saleh.png` | Forteresse banco médiévale + mosquée tour, 112×112 top-down | Beat 1 (capitale Wagadou) |
| `seal-wagadou.png` | Médaillon or/bordeaux ornements mande, 96×96 top-down | Insert plein écran (validé v3) |
| `sac-or.png` | Sac jute brun + nuggets dorés débordant, 96×96 side | Beat 1 spotlight, Beat 3 silent barter |
| `sac-sel.png` | Sac jute pâle + cristaux blancs visibles, 96×96 side | Beat 1 spotlight, Beat 3 silent barter |
| `gold-ingot-stack.png` | Pile de lingots dorés en relief 3D, 96×96 top-down | (Test initial v2, garder pour réutilisation) |

### Assets génériques pré-générés Beats 2-5 (en cours 2026-05-03)

| Asset | Usage | Status |
|-------|-------|--------|
| Mosquée banco grande | Beat 2 "une mosquée" | en cours |
| Caravane chameau | Beat 2 "il taxait chaque caravane" | en cours |
| Stand marché | Beat 2 "20 000 habitants" | en cours |
| Balance commerciale | Beat 3 "presque au poids égal" | en cours |
| Guerrier almoravide à dos chameau | Beat 4 invasion 1076 | en cours |
| Ruines banco grises | Beat 4 effondrement | en cours |
| Pile pièces or dinars | Beat 5 Florence/Venise parallèle | en cours |
| Bloc sel mineurs | Beat 2 (alternative à mosquée) | en cours |

## Règles de placement carte

1. **Asset = ancré à un POI géographique** : utiliser les coords projetées (`mercSahel.poi.X`)
2. **Largeur 80-100px sur viewBox 720** : pas plus, sinon écrase la carte
3. **`imageRendering: "pixelated"`** : OBLIGATOIRE, sinon Remotion blur les pixel art
4. **Halo radial subtil derrière** (optionnel) pour intégration : `<circle r=55 fill="url(#halo)">`
5. **Breathing scale léger** (`1 → 1.04 → 1`) : donne vie sans distraire

## Workflow recommandé pour future scène Atlas

1. **Lister les éléments narratifs** qui méritent un asset (5-10 par épisode)
2. **Lancer génération en batch** avant la session de coding (parallèle, 30-60s chacun)
3. **Pendant que ça tourne** : code les composants Remotion
4. **Téléchargement curl** : `curl --fail -s -o name.png "https://api.pixellab.ai/mcp/map-objects/<id>/download"`
5. **Intégration directe** via `<image href={staticFile(...)} />`
6. **PAS d'animation PixelLab** sauf cas exceptionnel (économie temps majeure)

## Pourquoi pas Lottie pour les objets ?

- Lottie limité à ~10 vertices par path bezier → impossible d'avoir le détail/relief d'un sac/lingot/sceau
- Tentative Beat 1 v2 : "lingot" Lottie ressemblait à un trapèze géométrique (indéfendable)
- PixelLab donne immédiatement un objet identifiable, beau, premium

**Lottie reste pertinent pour primitives** : ring pulse, halo, cercles d'écho, glow → là où la simplicité est un atout.

## Why ça marche

PixelLab utilise l'IA pour générer des sprites cohérents stylistiquement. Le pixel art a un avantage : **moins de pixels = moins de risques de drift visuel** vs photo réaliste (où petites imperfections sont visibles). Les objets pixel art se "lisent" parfaitement à 64-112px et conservent leur identité même affichés à 140-180px sur viewBox SVG.

## How to apply

À chaque nouvelle scène Atlas :
1. Identifier 3-5 objets/lieux narratifs clés
2. Vérifier la bibliothèque existante (`public/<projet>/assets/pixellab/`)
3. Si manquant → générer en batch via `mcp__pixellab__create_map_object`
4. Suivre le pattern d'intégration ci-dessus
5. Documenter chaque nouvel asset dans le `feedback_pixellab-*` du projet
