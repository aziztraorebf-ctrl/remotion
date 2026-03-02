# Scenes — Regles obligatoires (Peste 1347)

> Ces regles s'appliquent a TOUT fichier dans ce dossier.
> Reference complete : `memory/visual-manifesto.md`

---

## GATE OBLIGATOIRE — Avant tout edit de fichier scene

**Avant d'ecrire la premiere ligne de code dans une scene, produire le Contrat Visuel.**

Format requis :

| Frames | Duree | Visuel affiche | Ce qui change |
|--------|-------|----------------|---------------|
| 0-90   | 3s    | ...            | ...           |
| 91-180 | 3s    | ...            | ...           |

**Regle absolue : si "Ce qui change" = "rien" pour une ligne -> BLOCAGE.**
Trouver un stimulus visuel pour cette ligne avant de coder.

Le Contrat Visuel doit etre aligne sur les frames de SCENE_TIMING si disponible.

---

## GATE EFFECTSLAB — Avant toute nouvelle technique visuelle

Avant d'implementer une technique dans une scene de production, verifier :

1. Est-ce que cette technique a ete testee dans `EffectsLab.tsx` ?
2. Si oui : utiliser le code prototype directement (pas de reimplementation)
3. Si non : tester d'abord dans EffectsLab, valider, PUIS integrer en production

**Effets disponibles dans EffectsLab.tsx (10 segments) :**
- Seg 1 : Baseline SVG pur (reference)
- Seg 2 : Grain anime + Fumee SVG
- Seg 3 : spring() physique sur personnages
- Seg 4 : Stroke-dasharray (dessin progressif)
- Seg 5 : Vignette + source lumineuse directionnelle
- Seg 6 : Split-screen enluminure / gravure
- Seg 7 : Lottie smoke vs SVG smoke
- Seg 8 : Animation marche Math.sin() (bras, jambes, corps)
- Seg 9 : Carte propagation (dessin progressif + cercles)
- Seg 10 : Micro-expressions (clignement, peur, bouche, flash, taches)

Quand un effet d'EffectsLab est utilise dans une scene : indiquer lequel et pourquoi dans un commentaire en tete de composant.

---

## Personnages nommes — Composants dedies OBLIGATOIRES

| Personnage | Composant | Interdit |
|------------|-----------|---------|
| Guillaume  | `<Guillaume .../>` | `<EnlumCharacter type="noble"/>` |
| Martin     | `<Martin .../>` | `<EnlumCharacter type="pretre"/>` |
| Agnes      | `<Agnes .../>` | `<EnlumCharacter type="femme"/>` |
| Pierre     | `<Pierre .../>` | tout generique |
| Isaac      | `<Isaac .../>` | tout generique |
| Renaud     | `<Renaud .../>` | tout generique |

---

## Regle du 70% — Rappel rapide

Viser sweet spot impact/complexite. Jamais 100% (trop complexe).

| Demande | Version 70% |
|---------|-------------|
| Stroke animation | Fade-in simple |
| 5 couches parallaxe | 3 couches |
| Suivi camera | Panning constant |
| Morphing path | translate/scale uniquement |

---

## Anti-patterns interdits (Remotion)

- `CSS transition:` -> utiliser `interpolate()` + `useCurrentFrame()`
- `setTimeout/setInterval` -> frames Remotion
- `@keyframes` -> `spring()` ou `interpolate()`
- Framer Motion -> INTERDIT (non-deterministe)
- Lottie : package `@remotion/lottie` UNIQUEMENT (pas `lottie-react`)


<claude-mem-context>
# Recent Activity

### Feb 24, 2026

| ID | Time | T | Title | Read |
|----|------|---|-------|------|
| #528 | 12:10 AM | 🔵 | HookBlocE scene demonstrates 6-character archetype reveal with audio synchronization | ~574 |
| #522 | " | 🔵 | Master composition pattern using Remotion Series for sequential scene assembly | ~476 |
</claude-mem-context>