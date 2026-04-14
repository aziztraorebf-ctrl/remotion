# visual-producer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-13 (initial)

---

## Established Style IDs per project

| Project | Style ID | Tool | Ref image | Status |
|---------|---------|------|-----------|--------|
| _(none established yet)_ | | | | |

Quand un Style ID Recraft V3 est cree pour un projet, l'ajouter ici.

---

## REF character paths per project

| Project | Character | REF file path | Notes |
|---------|-----------|--------------|-------|
| Thiaroye 1944 | Style anchor | `public/assets/library/geoafrique/thiaroye-1944/frames/frame-03.jpg` | 2D flat BD style |
| Soundjata combat test | Soundjata | `public/assets/library/geoafrique/soundjata/combat-refs/soundjata-combat-ref.png` | Full body, combat stance |
| Soundjata combat test | Soumaoro | `public/assets/library/geoafrique/soundjata/combat-refs/soumaoro-combat-ref.png` | Full body, casting stance |
| GeoAfrique characters | _(references to add)_ | | |

---

## Seed values that produced good results

| Asset | Tool | Seed | Prompt tag | Use case |
|-------|------|------|-----------|----------|
| Soundjata combat V2 | Seedance 2.0 reference-to-video | (seed varies) | Choreography transfer | Reference for future combat scenes |

---

## Cost averages per scene

| Scene type | Typical tool | Cost | Notes |
|------------|-------------|------|-------|
| Static Gemini image (character, background) | Gemini 3.1 Flash Image | ~$0.04 | 1024x1920 typical |
| Icon with REF character | Gemini | ~$0.04 | PIL white->transparent post-processing |
| Parchment map | Gemini | ~$0.04 | "visually CALM" prompt |
| Seedance Short clip 5-10s | Seedance 2.0 T2V/I2V | $1.50-3.00 | 720p |
| Seedance reference-to-video 10s | Seedance 2.0 | ~$3.02 | 720p with video ref |
| Kling V3 Pro 4K clip | Kling | ~$0.50-2.00 | Premium quality |
| Recraft V3 SVG with Style ID | Recraft | ~$0.04 | Style ID must pre-exist |

---

## New gotchas discovered

_Liste vide au demarrage. Ajouter ici toute nouvelle regle qui n'etait pas dans `memory/tools/{outil}.md` — puis propager dans le fichier tool-specifique._

---

## Session log

### 2026-04-13 (initial)
Agent cree. Motion reference transfer teste (hors agent) sur Soundjata vs Soumaoro : validation de la technique.
