---
name: Audio overlap obligatoire trimAfter en assemblage Remotion
description: Quand un beat individuel a son <Audio src startFrom=X>, l'audio joue jusqu'à la fin de sa Sequence parent par défaut. Lors de l'assemblage, ça crée des overlaps audio entre beats consécutifs.
type: feedback
---

## Règle

Quand un beat charge son propre `<Audio>` avec `startFrom`, l'audio continue à jouer jusqu'à la fin de la `<Sequence>` parente. Si la durée Sequence > durée segment audio prévu, l'audio dépasse dans le segment suivant et crée un overlap avec le `<Audio>` du beat suivant.

**Symptôme** : voix doublée à la transition entre 2 beats (Aziz a entendu "Wagadou" deux fois entre Hook et Beat 1).

## Solution

Toujours ajouter `trimAfter={frameLastSegmentAudio}` dans les `<Audio>` des beats individuels, surtout pour le Hook ou tout beat dont la Sequence dure plus longtemps que son segment audio prévu.

**Exemple** (Hook Empire Ghana) :
```tsx
// Hook segment audio : f5 → f153 (5.1s du fichier source)
// Hook Sequence dans assemblage : durationInFrames=211 (jusqu'au début Beat 1)
// → Sans trimAfter, audio joue de f5 à f216 et chevauche Beat 1 audio (qui démarre à f211)
<Audio
  src={staticFile("...narration-v1.mp3")}
  trimBefore={5}
  trimAfter={153}  // ← OBLIGATOIRE
/>
```

## Why

Remotion v4 : `endAt` et `startFrom` sont dépréciés. Utiliser `trimBefore` et `trimAfter`. `trimAfter` est en frames du fichier source (pas en frames de la composition).

## How to apply

À chaque beat qui a son propre `<Audio>` narration, déterminer la frame de fin du segment audio (depuis `timing.ts` SEGMENTS) et l'utiliser comme `trimAfter`. Ça garantit zéro overlap en assemblage.

## Référence

Cas d'origine : Empire Ghana session 2026-05-04, render v1 → render v2 fix. Hook narration jouait de 0.16s à ~7s alors qu'il aurait dû s'arrêter à 5.1s, créant overlap avec Beat 1 qui dit "Wagadou" exactement à 7s.

Fichier corrigé : `src/projects/atlas/empire-ghana/scenes/Beat0Hook.tsx` ligne 27.
