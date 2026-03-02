# Storyboarder Agent — Persistent Memory

## Role Summary
Produce `SCENE_TIMING` TypeScript constants from measured audio + scenes.json.
Never estimate. Never use `expected_duration_sec` as a timing source.

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
