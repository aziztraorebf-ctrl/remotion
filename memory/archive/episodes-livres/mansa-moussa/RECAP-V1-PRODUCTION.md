---
name: Recap complet production Atlas Mansa Moussa V1
description: Toutes les etapes V1 documentees pour reference rapide. URLs Vercel + chemins locaux + decisions par etape.
type: project
---

# Recap V1 production — Atlas Mansa Moussa (2026-04-29)

> Statut : LIVRE. Aziz attend V2 hybride avant publication.

---

## URL FINALE V1

**Render** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/wip/showcase-v1-jLa2TD5cGTG1VCmaw77RQytNODfrGi.mp4

**Specs** :
- 81.04s @ 30fps = 2446 frames
- 1080x1920 (Short 9:16)
- 74.7 MB
- Render time : 12 min sur Mac M1

---

## SCRIPT V3 LOCKED

**Fichier** : `quebec-jacques-poc/scripts-atlas/script-mali-mansa-moussa-v3.md`

### Structure narrative (Cesar pure 6 segments)
- Hook (0-4s) : "Cet homme a fait s'effondrer le cours de l'or pendant douze ans."
- S1 Setup (4-16s) : Mali 1324 + carte Afrique Ouest + Empire + secret
- S2 Densite (16-34s) : 50% or mondial + La moitie [serious] + Tombouctou + Sankore 25 000 + Sorbonne 2 000
- S3 Climax Hadj (34-50s) : Douze ans apres couronnement + 60 000 hommes + 12 000 esclaves + 80 chameaux x 150kg
- S4 Consequence (50-62s) : Caire effondre + 12 ans chute + Un seul homme [serious]
- S5 CTA (62-81s) : Mansa Moussa + Rockefeller/Bezos/Musk + Et pourtant la vraie reponse

### Tags eleven_v3 inline
`[mysterious]` `[fast]` `[curious]` `[serious]` `[dramatic]` `[confident]`

### Settings ElevenLabs canonique Atlas
- Voix : Narratrice GeoAfrique v2 (`z3gESu49naEZW8Af2Upm`)
- Modele : `eleven_v3`
- stability=0.22, similarity_boost=0.55, style=0.55

### Fact-check 9 chiffres
**Confirmes (7)** : 12 ans effondrement / hajj 1324 / 60 000 hommes / 12 000 esclaves / 80 chameaux 150kg / 50% or mondial / Sankore 25 000.
**Corrige (1)** : "14 ans apres couronnement" -> "Douze ans" (couronnement 1312, hajj 1324 = 12 ans).
**Non sourcable mais conserve (1)** : Sorbonne 2 000 (decision Aziz : render test, dynamique Cesar prime).

**Documente** : `quebec-jacques-poc/research/FACT-CHECK-MANSA-MOUSSA.md`

---

## ETAPES PRODUCTION

### Etape 1 — Script V3 lock + scan TTS
- 2 pretests ElevenLabs (4 mots a risque + CTA tags)
- Cout : $0.010

### Etape 2 — Audio production
- 2a Narration complete 81.04s : $0.037
- 2b Forced alignment ElevenLabs : $0 (inclus)
- 2c 4 SFX (B impact, C ink-draw, D thud, E vent Sahara) : $0.005
- 2d Musique Minimax v2.6 variante C Mande Contemplatif : $0.10
- 2e Brief Kimi K2.5 pre-composition review : $0.015

### Etape 3 — Timing + assets
- 3a `timing-mansa-moussa.ts` (16 timestamps + COORDS + SFX_VOLUMES) : $0
- 3b Extraction polygone Egypte Natural Earth 50m : $0
- 3b Extraction polygone Empire Mali 1300 Historical Basemaps : $0 (decouverte session)
- 3b 5 generations Gemini :
  - Medaillon Gizeh paper-craft : $0.07
  - Portrait A v1 paper-craft (initial) : $0.07 [garde backup]
  - Portrait B v1 BD flat (initial) : $0.07 [garde backup]
  - Portrait A v2 canonique (char-ref Abou Bakari) : $0.07
  - Portrait B v2 trone canonique (char-ref + trône-ref) : $0.07

### Etape 4 — Composition Remotion
- Mini-render 6s test validation : $0
- Composition complete `AtlasMansaMoussaShowcase.tsx` : $0

### Etape 5 — Render final + upload
- Render 81s : $0
- Upload Vercel Blob : $0

**TOTAL V1** : $0.52

---

## ARCHITECTURE COMPOSITION V1

### Camera (13 keyframes multi-fly Mapbox-gl runtime)
- F0 : Globe Afrique
- F4s : Zoom Mali (Setup)
- F11s : Empire 1300 visible
- F23s : Tombouctou close
- F27s : Sankore close
- F37s : Mali large (climax pivot)
- F43s : Sahara pitch 60°
- F54s : Caire pitch 45°
- F63s : Mediterranee
- F67s : Retour Mali (CTA reveal)
- F80s : Mali rotation bearing finale

### Overlays cartographiques (SVG React + map.project)
- Empire Mali 1300 fill dore opacity 0.30 + stroke pointille 14-7 dasharray
- Mali moderne fill indigo opacity 0.55 + stroke plein dore
- Egypte fill rouge opacity 0.45 (effondrement scene 4)
- Trace caravane Niani -> Tombouctou -> Caire -> Mecque (path SVG bezier dasharray progressif)
- Pulse markers : Tombouctou (or), Caire (rouge), Mecque (or)

### Cartouches stats (Cormorant Garamond 700)
- ½ geant 130px (moment [serious] "La moitie")
- 25 000 ETUDIANTS A SANKORE
- 12 TONNES D'OR PUR EN CARAVANE
- 12 ANS - L'OR S'EFFONDRE EN MEDITERRANEE

### Portraits Mansa Moussa (cross-fade scene 5)
- A v2 (gros plan, 67-77s)
- B v2 (trône, 77-81s, punch finale)

### Effets narratifs
- Particules or Hook (8 SVG, 0.7-2.7s, narrative pas decorative)
- Medaillon Gizeh (54-65s, scene 4)
- Mention Empire 1300 (12-15s)
- CTA "MANSA MOUSSA - EMPEREUR DU MALI · 1312-1337"
- Punch finale "L'HOMME LE PLUS RICHE DE L'HISTOIRE"

### Effets [serious] (Q3 Kimi)
- Micro-zooms scene 2 sur chiffres-choc (boost 0.15-0.30)
- Freeze + dolly sur "La moitie." (zoom 0->0.4)
- Desaturation 70% + music duck 0.04->0.01 sur "Un seul homme. Un continent qui s'effondre."

### Audio mix
- Narration eleven_v3 volume 1.0
- Musique Mande Contemplatif volume 0.04 (ducked 0.01 sur [serious] moment 2)
- 4 SFX : 3x B impact villes (0.6) + C ink-draw caravane (0.85) + 4x D cartouches thud (1.5) + E vent Sahara 6s (0.5)

---

## REVIEW CLAUDE 9 FRAMES VALIDES

| Frame | Verdict |
|-------|---------|
| 1.5s | Particules or sur Hook visible ✅ |
| 12s | Empire 1300 + mention textuelle ✅ |
| 22s | Empire deborde + Mali moderne superpose ✅ |
| 28s | Cartouche 25 000 Sankore + marker pulse ✅ |
| 45s | Sahara pitch 60° + trace caravane dore ✅ |
| 55s | Medaillon Gizeh + trace Caire ✅ |
| 64s | Desaturation [serious] + Egypte rouge + cartouche 12 ans ✅ |
| 70s | Portrait A v2 + texte CTA ✅ |
| 80s | Portrait B v2 trône + punch finale ✅ |

---

## DEFAUTS V1 IDENTIFIES (a fixer en V2)

1. **Saccades switch globe -> mercator** (Mapbox-gl runtime) — fix V2 = abandon Mapbox runtime
2. **Footer attribution permanent** — fix V2 = retirer + cartel 2s fin
3. **Logo Mapbox visible** — fix V2 = pas de Mapbox du tout en V2 statique
4. **Mention Empire 1300 trop longue** — fix V2 = 2-3s seulement
5. **Manque dynamisme vs chaines pro** — fix V2 = personnages chibi animes + sous-titres karaoke + cuts entre plans statiques
6. **Pas de personnages sur la carte** — fix V2 = caravane chibi + Mansa mini chibi
7. **Pas de sous-titres** — fix V2 = TikTok karaoke mot-par-mot

---

## CHEMINS LOCAUX (dossier projet)

```
quebec-jacques-poc/
├── out/atlas-mansa-moussa/
│   ├── showcase-v1.mp4                     [render final]
│   ├── narration-v3.mp3                    [narration]
│   ├── narration-v3-alignment.json         [forced alignment]
│   ├── pretest-words.mp3                   [pretest 4 mots]
│   ├── pretest2-cta.mp3                    [pretest CTA tags]
│   ├── kimi-precomposition-review.md       [synthese Kimi]
│   ├── kimi-raw-response.json              [raw Kimi]
│   ├── sfx/
│   │   ├── B-impact-stamp.mp3
│   │   ├── C-caravane-ink-draw.mp3
│   │   ├── D-cartouche-thud.mp3
│   │   └── E-vent-sahara.mp3
│   ├── music/
│   │   └── C-mande-contemplatif.mp3
│   ├── assets/
│   │   ├── gizeh-medallion.png
│   │   ├── mansa-portrait-A-papercraft.png         [V1 initial backup]
│   │   ├── mansa-portrait-B-bdflat.png             [V1 initial backup]
│   │   ├── mansa-portrait-A-v2-canonique.png       [V1 utilise]
│   │   └── mansa-portrait-B-v2-canonique-trone.png [V1 utilise]
│   └── wip/
│       ├── empire-halo-test.mp4            [test V1 abandon halo radial]
│       ├── empire-halo-v2.mp4              [test V1 valide Empire 1300]
│       └── ...frames check-*s.png
├── public/atlas-mansa-moussa/              [assets pour Remotion staticFile]
│   ├── narration-v3.mp3
│   ├── sfx/
│   ├── music/
│   └── assets/
├── src/
│   ├── AtlasMansaMoussaShowcase.tsx        [composition V1]
│   ├── AtlasEmpireHaloTest.tsx             [test concept]
│   ├── timing-mansa-moussa.ts              [timing T + COORDS]
│   ├── mali-polygon.json                   [Mali moderne]
│   ├── mali-empire-1300-polygon.json       [Empire Mali 1300]
│   └── egypt-polygon.json                  [Egypte]
├── data/
│   ├── ne_50m_countries.geojson            [Natural Earth complet]
│   ├── world_1300.geojson                  [Historical Basemaps 1300]
│   └── world_1400.geojson                  [Historical Basemaps 1400]
└── scripts-atlas/
    ├── script-mali-mansa-moussa-v3.md      [script LOCKED]
    ├── generate-mansa-moussa-narration.py
    ├── forced-alignment-mansa-moussa.py
    ├── generate-sfx-mansa-moussa.py
    ├── generate-music-mansa-moussa.py      [endpoint fal.ai fixe]
    ├── generate-gizeh-medallion.py
    ├── generate-mansa-portrait-A-v2.py     [avec char-ref]
    ├── generate-mansa-portrait-B-v2.py     [avec 2 char-refs]
    ├── pretest-mansa-moussa-words.py
    ├── pretest2-mansa-moussa-cta.py
    └── kimi-precomposition-mansa-moussa.py
```

---

## URLs VERCEL BLOB (uploads session)

### Audio
- Pretest 1 : `pretest-words-chJUA0FJoHAOwmQIYjYPneEHtDDJjr.mp3`
- Pretest 2 : `pretest2-cta-qKRKR0W3qsSUwp0TQdqvU4eaCFAzH0.mp3`
- Narration V3 : `narration-v3-OffLQNkbDNZVlE8chKSaBFIFmia19V.mp3`
- Musique : `C-mande-contemplatif-WUY0z7Pt3Ng03ivYrUvPiIvRud0Qey.mp3`

### Assets
- Gizeh : `gizeh-medallion-pCGN6KgseRboqYzX1jVlOcTmnVXKqN.png`
- Portrait A v1 (initial) : `mansa-portrait-A-papercraft-IKhUujMSUuQX6jRbkAmNtKgIOUi4Cf.png`
- Portrait B v1 (initial) : `mansa-portrait-B-bdflat-zNiEguU7TwwzuBp1SMEMEsdiD7DEgm.png`
- Portrait A v2 (canonique utilise) : `mansa-portrait-A-v2-canonique-XpcqZmkPhbZ6bioHizfc5FTCYMVY29.png`
- Portrait B v2 trône (canonique utilise) : `mansa-portrait-B-v2-canonique-trone-W11pcaPGUrGncxSwomcFovnt5O8Qdf.png`

### Tests V1
- Empire halo V2 (concept Empire 1300) : `empire-halo-v2-vOoxp5nIFvklmjLAUX1EH8m6IIozeV.mp4`

### Render final
- **Showcase V1** : `showcase-v1-jLa2TD5cGTG1VCmaw77RQytNODfrGi.mp4`

Tous prefixes : `https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-mansa-moussa/`
