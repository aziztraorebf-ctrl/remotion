# Beats Remotion standalone — pas d'offset BEAT_START sur useCurrentFrame

Quand un beat est rendu comme **composition Remotion standalone** (`<Composition id="OrAfricainBeat2" durationInFrames={BEAT_DURATION} />`), `useCurrentFrame()` retourne déjà des frames relatives à la composition (0 → BEAT_DURATION-1). Il ne faut **PAS** soustraire `BEAT_START`.

**Why:** Le bug s'est produit sur Or Africain Beat 2 — j'avais codé `relFrame = frame - BEAT_START` en supposant une timeline globale, mais en composition standalone `frame` commence à 0. Résultat : `isRienMoment` ne se déclenchait jamais → cut-to-black inactif, render à refaire.

**How to apply:**
- Dans une composition standalone : `const clampedRel = Math.max(0, Math.min(frame, BEAT_DURATION - 1));` — pas d'offset.
- Garder `BEAT_START` UNIQUEMENT pour :
  - `<Audio startFrom={BEAT_START}>` (skip dans le fichier narration global)
  - `<Subtitles sceneStartS={BEAT_START_S}>` (offset secondes pour filtrer les words)
  - Les frames absolues d'`AUDIO_SEGMENTS` doivent être converties en relatif via `AUDIO_SEGMENTS.x.startFrame - BEAT_START` au moment de l'utilisation
- Quand on assemble plus tard tous les beats dans une composition Full, c'est là qu'il faudra adapter (probablement via `<Sequence from={BEAT_START}>` pour chaque beat — pas de modif du composant).

Validé 2026-05-07 sur Or Africain Beat 2 v3.

---
Migré depuis auto-memory (`feedback_remotion-beat-standalone-frame-offset.md`) le 2026-08-31, contenu
original inchangé.
