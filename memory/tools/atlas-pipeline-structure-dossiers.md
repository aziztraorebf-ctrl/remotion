# Workflow Atlas — Pipeline et structure de projet

> Migré depuis auto-memory 2026-08-31 (créé 2026-05-02, projet Atlas Shaka Zulu). Complète
> `memory/doctrines/ATLAS-PLAYBOOK.md` (principes narratifs/visuels) avec la structure de DOSSIERS
> et l'ORDRE DE PIPELINE technique concret. ⚠️ Vérifier la structure de dossiers réelle d'un
> épisode Atlas récent avant de l'imposer telle quelle — datée mai 2026, l'organisation projet a pu évoluer.

## Règle : Pipeline Atlas obligatoire (dans cet ordre exact)

1. **Script validé** — plain text + scan TTS (no e/ee, no ont+voyelle, no digits)
2. **Audio TTS ElevenLabs** — `narration-vN.mp3` dans `public/<episode>/audio/`
3. **ElevenLabs Forced Alignment** → `<episode>-alignment.json` + `.ts`
   - Endpoint `POST /v1/forced-alignment` — plain text SANS tags TTS
   - Loss cible : <0.35 (0.244 atteint Shaka Zulu — référence)
   - **C'est la source de vérité pour timing.ts, PAS Whisper** (nuance : voir `memory/tools/whisper-vs-elevenlabs-alignment.md` pour la répartition exacte par usage)
4. **Whisper API** → `whisper-words-<episode>.ts` (uniquement pour sous-titres karaoke)
5. **timing.ts** — segments + inserts + beats narratifs en frames @30fps, dérivés du Forced Alignment
6. **<episode>-manifest.ts** — guide visuel complet par scène
   - Textes, couleurs, positions, labels carte, options assets (PixelLab path + Gemini path)
   - Zéro valeur hardcodée dans les composants Remotion — tout lu depuis le manifest
7. **Assets** — générés en parallèle (inserts PixelLab + inserts Gemini + hook)
8. **Composants Remotion** — lisent timing.ts + manifest uniquement
9. **Mini-renders par scène** → `renders/mini-renders/`
10. **Render final** → `renders/final/` → upload

## Règle : Structure de dossiers obligatoire par épisode Atlas (référence, à re-vérifier)

```
src/projects/<episode>/
  <episode>-alignment.json    Forced Alignment brut (source de vérité)
  <episode>-alignment.ts      Même données TypeScript
  whisper-words-<episode>.ts  Whisper word-level (karaoke seulement)
  timing.ts                   Frames segments + inserts + beats
  <episode>-manifest.ts       Guide visuel complet
  components/                 Composants partagés
  scenes/                     Un fichier par segment (S0, S1, S2...)
  inserts/                    Composant AtlasInsert.tsx réutilisable
  helpers/                    cameraShake, spritePlayer, etc.

public/<episode>/
  audio/
    narration-vN.mp3          MASTER validé (les autres = obsolètes, laisser en place)
  characters/
    <perso>/                  Assets PixelLab MCP canoniques (rotations + animations)
  inserts/
    pixellab/                 Option A inserts — pixel art
    gemini/                   Option B inserts — parchemin/illustration
  hook/                       Assets hook (Seedance OU PixelLab)
  renders/
    mini-renders/             Renders validation scène par scène
    final/                    Render final validé avant upload
  archive/                    Assets SDK non-canoniques (NE PAS UTILISER en prod)
  README.md                   Statut production + guide navigation
```

## Règle : Forced Alignment vs Whisper (distinction critique)

| Outil | Usage | Cas d'usage |
|-------|-------|-------------|
| ElevenLabs Forced Alignment | timing.ts, segments, beats | Synchronisation animations Remotion sur narration |
| Whisper API OpenAI | whisper-words.ts | Sous-titres karaoke mot-par-mot |

**Whisper seul NE SUFFIT PAS pour timing.ts** — drift jusqu'à 2.5s détecté sur Abou Bakari II.
Forced Alignment = on donne le texte exact → timestamps précis + score de confiance par mot.

## Règle : manifest = source de vérité visuelle

Le manifest est créé APRÈS le timing.ts, AVANT tout code de composant.
Il contient :
- Textes de chaque overlay / insert (modifiables sans toucher au code)
- Couleurs par scène et transitions
- Paths assets (PixelLab ET Gemini côte à côte — Aziz choisit après visionnage)
- Paramètres carte (center, zoom, labels, couleurs territoire)
- Timing local des inserts (triggerFrame relatif au segment)

**Erreur à éviter** : coder des valeurs visuelles directement dans les composants .tsx
→ chaque correction visuelle d'Aziz nécessite un diff de code au lieu d'une ligne de manifest.

## Pourquoi cette règle

Appris sur Abou Bakari II (2026-04-25) : Whisper drift 2.5s cassait la sync narration/animation.
Appris sur Sonjata (2026-04-29) : valeurs hardcodées dans .tsx = re-code pour chaque retour visuel.
Appris sur Mansa Moussa V2 (2026-04-30) : manifest centralisé = 0 re-code pour corrections Aziz.
