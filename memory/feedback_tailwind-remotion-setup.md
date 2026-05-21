---
name: feedback_tailwind-remotion-setup
description: Installation et configuration Tailwind CSS dans Remotion — règles obligatoires
type: feedback
---

## Packages requis

```bash
npm install tailwindcss@3.4.19 @remotion/tailwind@4.0.456 postcss autoprefixer lucide-react
```

## Fichiers à créer

### `tailwind.config.ts`
- Tokens Souverain : gold, navy, slate, ivory
- fontSize : stat-2xl / stat-xl / stat-lg / stat-md / entity / label / mono-sm
- spacing : safe-top / safe-bottom / col-pad / side-pad

### `postcss.config.js`
Standard PostCSS avec tailwindcss + autoprefixer.

### `src/styles.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## RÈGLE BLOQUANTE — S'applique à TOUT composant Souverain

**Avant d'écrire UN SEUL style inline pour couleur/typo/spacing dans un composant `.tsx` :**
→ Vérifier si un token Tailwind existe (`text-gold`, `text-ivory`, `bg-navy`, `text-stat-lg`, `pt-safe-top`, etc.)
→ Si oui : utiliser la classe Tailwind. JAMAIS `color: "#c8a951"` inline quand `text-gold` existe.
→ Styles inline autorisés UNIQUEMENT pour : valeurs dynamiques calculées (spring, interpolate), transform, opacity animée.

**Erreur passée (2026-05-13) :** Beat6Question.tsx codé entièrement en styles inline sans consulter Tailwind → dette technique, tokens non réutilisés, dérive visuelle.

## Règles OBLIGATOIRES

1. **`remotion.config.ts`** — ajouter `enableTailwind()` dans la config webpack. SANS ça, les classes CSS ne compilent PAS dans le render.
   ```ts
   import { enableTailwind } from "@remotion/tailwind";
   // dans webpack config :
   enableTailwind()(config)
   ```

2. **`src/index.ts`** (entry point) — importer `./styles.css`. PAS dans Root.tsx.
   ```ts
   import "./styles.css";
   ```

3. **Framer Motion = INTERDIT** dans ce projet. Incompatible avec le render déterministe Remotion (moteur temps-réel vs frame-index). Utiliser `animations.ts` maison.

4. **shadcn/ui = HORS SUJET** — composants UI interactifs, inutiles pour vidéo.

## Stack validé

Remotion + D3-geo/Mapbox + Tailwind 3.4 + animations.ts maison + Lucide React + Gemini

## Fichiers fondation créés (2026-05-13)

- `src/projects/_shared/FORMATS.ts` — FORMAT_916 et FORMAT_169
- `src/projects/_shared/animations.ts` — presets : fadeIn, fadeOut, fadeInOut, slideUp, slideDown, popIn, gentleReveal, drawPath, countUp, appearFromBelow
- `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx` — split 50/50 générique : asset + items flex-1 + séparateurs gold + sous-titre

## Astuce ffmpeg — retrait fond noir PNG

```bash
ffmpeg -i input.png -vf "colorkey=0x000000:0.15:0.1" -update 1 output.png
```
