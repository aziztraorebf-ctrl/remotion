---
name: checklist-production-code
description: Checklist vivante pour la phase de code Remotion (toi + moi, sans agent). Applicable à tous les piliers.
metadata:
  type: project
---

# Checklist Production Code Remotion — Vivante & Contraignante — ⛔ ARCHIVÉ 2026-07-11

> **PÉRIMÉ — entry point `src/index.ts` contredit la pratique réelle** (le pipeline actuel enregistre les
> compositions dans `Root.tsx`, cf. `PRODUCTION-AGENTIQUE-REMOTION.md`). Contenu technique (Tailwind,
> spring(), safe zones) toujours valide mais dupliqué dans `rules-beat-production.md` (à jour, routé).
> Jamais routé — trouvé orphelin lors de l'audit 2026-07-11.

# Checklist Production Code Remotion — Vivante & Contraignante
> Pour la phase de code beat-par-beat quand Claude + Aziz travaillent ensemble (sans remotion-composer).
> Mis à jour : 2026-05-14

---

## AVANT de commencer

- [ ] Manifest validé par Aziz (`src/projects/<pilier>/<episode>/manifest.ts`)
- [ ] Tous les assets visuels générés et validés
- [ ] Audio + musique validés
- [ ] Entry point confirmé : `src/index.ts` (pas `src/Root.tsx`)
- [ ] Composition enregistrée dans `src/Root.tsx`
- [ ] Tailwind config lue (`tailwind.config.ts`) — tokens gold/navy/ivory disponibles

---

## Par beat (répéter pour chaque beat)

- [ ] Beat N codé dans `src/projects/<pilier>/<episode>/Beat<N>.tsx`
- [ ] Timing calé sur `manifest.ts` (SEG.xxx — pas de hardcode)
- [ ] Tailwind utilisé pour couleurs/typo/spacing — zéro inline styles
- [ ] Animations : `spring()` > `interpolate()`, `extrapolateRight: 'clamp'`
- [ ] `premountFor={1 * fps}` sur toutes les `<Sequence>`
- [ ] Anti-patterns absents : `CSS transition:`, `setTimeout`, `@keyframes`, `requestAnimationFrame`
- [ ] Safe zones respectées (marges 100px/60px, sous-titres Y>=850, texte min 32px)
- [ ] Mini-render lancé : `npx remotion render src/index.ts <BeatId> out/episodes/<ep>/wip/beat<N>_v1.mp4`
- [ ] Claude regarde le render (Read sur les frames extraites)
- [ ] Aziz valide → promu `beat<N>-FINAL.mp4`, wip purgé

---

## Assemblage final

- [ ] Composition principale créée avec tous les beats en `<Sequence>`
- [ ] Audio narration monté (`<Audio src={...} startFrom={0} />`)
- [ ] Audio musique monté (volume 0.04, fade in/out)
- [ ] Sous-titres écran intégrés (sources, captions)
- [ ] Render complet test : `npx remotion render src/index.ts <MainCompo> out/episodes/<ep>/versions/<ep>_V1.mp4`
- [ ] Si Mapbox : `./scripts/render-mapbox.sh` obligatoire (npx direct = fail)

---

## Règles Remotion critiques (rappel)

- Audio-derived timing OBLIGATOIRE — `const x = SEG.foo.start` jamais hardcodé
- `spring()` pour mouvements naturels
- NO EMOJIS dans `.ts`, `.tsx`, `.js`, `.json`
- Framer Motion INTERDIT dans Remotion
- Lucide icons OK (`import { Icon } from "lucide-react"`)
