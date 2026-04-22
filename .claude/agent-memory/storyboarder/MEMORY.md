# Storyboarder Agent — Persistent Memory

## Role Summary
Produce `SCENE_TIMING` TypeScript constants from measured audio + scenes.json.
Never estimate. Never use `expected_duration_sec` as a timing source.

---

## CRITICAL RULE — Audio narration duration MUST match scene clip duration (added 2026-04-14)

**Erreur de production observée sur Soundjata Acte VII** :
- Narration Acte VII : 13.22s (de 108.98s à 122.20s dans `narration-full.mp3`)
- Clip Seedance demandé/livré : 12.05s
- **Gap de 1.17s** → a forcé une boucle muette du WIDE FINAL (loop tail) en post-prod, +30 min de travail sur 2 itérations Remotion (`LOOP_START` mal positionné en V1, fix en V2)

**Cause racine** : le Visual Plan a demandé `duration: "12"` sans vérifier que la narration de l'Acte faisait précisément 12s. Le visual-producer a appliqué la règle "preferred Seedance duration = 12s" sans cross-check avec le timing audio.

**Règle opérationnelle pour storyboarder + visual-producer** :
1. **AVANT de proposer une `duration` Seedance**, calculer la durée exacte de la narration de l'Acte (`scene.end - scene.start` ou somme des sous-scènes)
2. **Arrondir à la seconde supérieure pour Seedance** (Seedance accepte 4-15s par paliers de 1s) : si narration = 13.22s → demander **14s** au clip Seedance, pas 12s
3. **Si arrondi > 15s** : splitter en 2 clips Seedance back-to-back, JAMAIS combler par boucle muette
4. **Cross-check obligatoire avant tout appel API Seedance** : `clip_duration_seconds >= narration_duration_seconds`. Sinon STOP et ré-évaluer le découpage.

**Coût d'éviter cette règle** : ~30 min de Remotion + 1 itération mini-render ratée. Coût de l'appliquer : +$0.60 (2s de Seedance supplémentaires) + 0 pain point.

---

## HOOK PATTERN (valide 2026-04-22 sur Sonjata)

Structure `timing.ts` avec hook d'ouverture :

```typescript
const HOOK_DURATION_S = 5;
const HOOK_FRAMES = HOOK_DURATION_S * FPS;

// Hook = Sequence from=0, durationInFrames=HOOK_FRAMES
// Scenes commencent APRES le hook : cumulative initial = HOOK_FRAMES, pas 0
let cumulative = HOOK_FRAMES;
for (const f of sceneFrames) {
  startFrames.push(cumulative);
  cumulative += f;
}
const TOTAL_FRAMES = cumulative; // includes hook
```

**Regles timing hook** :
- Narration hook = 4.0-5.0s ideal (scan TTS obligatoire AVANT generation)
- Clip video extrait d'une scene existante (tension sans climax)
- Musique = SILENCE pendant hook, commence a scene 1 (Option B validee)

Template complet : `memory/templates/hook-short.md`

---

## PROJETS ARCHIVES (references seulement)

**Peste 1347** : projet SVG abandonne 2026-02-21 (pivot du pixel art vers pur Remotion SVG enluminure).
Les 7 scenes `hook_*` et le code Godot/PixelLab mentionnes dans les anciennes versions de ce fichier ne sont plus actifs. Voir `memory/archive/` si besoin historique.
