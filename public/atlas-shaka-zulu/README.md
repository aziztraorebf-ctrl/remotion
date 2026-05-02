# Atlas Shaka Zulu — Structure du projet

## src/projects/shaka-zulu/ — Code Remotion

```
shaka-alignment.json    Source de vérité timing (ElevenLabs Forced Alignment brut)
shaka-alignment.ts      Même données en TypeScript (pour sous-titres karaoke)
whisper-words-shaka.ts  Whisper word-level (composant <Subtitles>)
timing.ts               Segments + inserts + beats narratifs en frames @30fps
shaka-manifest.ts       Guide visuel complet scène par scène (textes, couleurs, positions)

components/             Composants partagés entre scènes (carte, palette, etc.)
scenes/                 AtlasShakaHook.tsx, AtlasShakaS1.tsx, etc.
inserts/                AtlasShakaInsert.tsx (composant réutilisable tous inserts)
helpers/                cameraShake.ts, spritePlayer.ts, etc.
```

## public/atlas-shaka-zulu/ — Assets statiques

```
audio/
  narration-v5.mp3      MASTER — audio final validé (150.32s)
  narration-v1/v2/v3    Versions obsolètes (ne pas utiliser)

characters/
  shaka/                PixelLab MCP ID e8c38444 — rotations + animations
    rotations/          4 directions (south/east/north/west)
    animations/
      walking-ba529e39/ Walk cycle 6 frames x4 dir
      animating-a04dc52d/ Fight-stance-idle 8 frames (sans east)
      animating-d4924c9b/ Breathing-idle
  warrior/              PixelLab MCP ID 33e221bd — rotations + walking
    rotations/
    animations/
      walking-38346bae/ Walk cycle 6 frames x4 dir

inserts/
  pixellab/             Option A — objets pixel art (iklwa, bouclier, formation)
  gemini/               Option B — illustrations parchemin militaire

hook/                   Hook 5s (Seedance OU PixelLab — à décider)

renders/
  mini-renders/         Renders de validation par scène (avant render final)
  final/                Render final validé

archive/                Assets SDK non-canoniques (drift de style — NE PAS UTILISER)
  shaka-walk-east/
  shaka-royal/
  shaka-warcry/
  warrior-walk-east/
  warrior-attack/
  warrior-warcry/
```

## Règle assets
- **Canon** : `characters/shaka/` et `characters/warrior/` (MCP, style cohérent)
- **Interdit** : tout dossier dans `archive/` (généré via SDK, drift détecté)
- **Inserts** : générer dans `inserts/pixellab/` (Option A) OU `inserts/gemini/` (Option B)

## Statut production (2026-05-02)

| Étape | Statut |
|-------|--------|
| Script V5 | VALIDÉ |
| Audio narration-v5.mp3 | GÉNÉRÉ (150.32s) |
| Forced Alignment | FAIT (loss 0.244) |
| timing.ts | FAIT |
| shaka-manifest.ts | FAIT |
| Inserts S2 PixelLab (iklwa, bouclier) | EN COURS |
| Inserts S2 Gemini parchemin | EN COURS |
| Hook (Seedance + PixelLab) | EN COURS |
| Composants Remotion | À FAIRE |
| Mini-renders validation | À FAIRE |
| Render final | À FAIRE |
