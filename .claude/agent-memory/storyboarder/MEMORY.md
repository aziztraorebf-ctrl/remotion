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

## Project: Peste 1347

### Audio Status
| Scene ID | Audio File | Measured Duration | Status |
|----------|-----------|-------------------|--------|
| hook_01_issyk_kul | - | - | NOT GENERATED |
| hook_02_catapulte | - | - | NOT GENERATED |
| hook_03_galeres | - | - | NOT GENERATED |
| hook_04_moitie | - | - | NOT GENERATED |
| hook_05_reframe | - | - | NOT GENERATED |
| hook_06_reveal | - | - | NOT GENERATED |
| hook_07_reflexes | - | - | NOT GENERATED |

Update this table each time audio is generated and measured with ffprobe.

### hookTiming.ts — Provisional vs Measured
```
HOOK_DURATIONS_SEC provisional = [8, 10, 8, 3, 3, 6, 5]
```
Replace each value with measured duration as audio is generated.
SCENE_TIMING must use measured values only.

---

## Learnings (mis a jour 2026-02-18)

### Pipeline B — Impact sur le timing
- Godot gere les scenes animees. Remotion gere uniquement le texte/audio/export.
- Les scenes Godot sont exportees en MP4 puis importees dans Remotion via <Video>.
- SCENE_TIMING reste valide : les startFrame/endFrame correspondent toujours aux segments audio.
- Le timing audio (hookTiming.ts) est la source de verite. Godot rend le visuel, Remotion synchro le tout.

### Audio Status (MESURE — ffprobe, verite absolue)
| Scene ID | Duree reelle | startFrame | endFrame |
|----------|-------------|-----------|---------|
| hook_01_issyk_kul | 9.52s | 0 | 285 |
| hook_02_catapulte | 12.56s | 286 | 662 |
| hook_03_galeres | 11.84s | 663 | 1017 |
| hook_04_moitie | 3.60s | 1018 | 1125 |
| hook_05_reframe | 1.92s | 1126 | 1183 |
| hook_06_reveal | 3.68s | 1184 | 1293 |
| hook_07_reflexes | 4.72s | 1294 | 1435 |
HOOK_TOTAL_FRAMES = 1435 (real). hookTiming.ts genere et confirme.

### NPC timing patterns
- Walk cycle : 6 frames @ 12 FPS = 0.5s per cycle (confortable pour lecture humaine)
- Offsets [0,1,3,5,2,4] par NPC = jamais synchronises
- Scene 6 (hook_06_reveal) = 110 frames = 3.68s. Suffisant pour 2 cycles walk complets.
- Scene 7 (hook_07_reflexes) = 142 frames = 4.72s. Suffisant pour 3 cycles complets.

---

## Character Constraints (Peste 1347 — do not re-verify each session)
- monk: NO west direction
- noble: south ONLY
- child: folder = "walk" not "walking"
- TOUS les assets = PixelLab uniquement. GothicVania INTERDIT (decision 2026-02-18).
