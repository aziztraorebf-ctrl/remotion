---
name: NEXT SESSION - Atlas Tombouctou features avancees (apres iterations V5)
description: Etapes 4-5 restantes post-V5. Mix audio OK, mosquee OK, crossfade OK. Reste pays colorie + drapeau Mali + template formel.
type: project
---

# NEXT SESSION - Atlas Tombouctou : features avancees Phase 2

> Cree : 2026-04-28 fin de session 2 Atlas
> Mis a jour : 2026-04-29 session 3 — etapes 1-3 terminees, V5 livree
> Ce brief est self-contained.

---

## Etat actuel (2026-04-29 apres session 3)

### Decisions strategiques figees (NE PAS rediscuter)
- Style Atlas : **Globe Parchemin Mande + ocean indigo + relief 3D + halo dore**
- Pilote : **Tombouctou** (mini-serie Mali en episode 2)
- Stack : Remotion 4.0.452 + mapbox-gl 3.22 + react-map-gl 8.1 + ElevenLabs + Gemini + Minimax v2.6 fal.ai
- Voix narration : **Narratrice GeoAfrique v2** (`z3gESu49naEZW8Af2Upm`) — pas Chris
- Musique de fond : **Variante C - Mande Contemplatif** (kora solo + balafon, style Toumani Diabate)
- Volume musique : **0.04** (definitif — narration dominante)
- Volume SFX : B=0.6, C=0.85, **D=1.5** (cartouche)

### Iterations V5-V8 TERMINEES (2026-04-29)
- [x] Musique 0.07 → **0.04** — narration plus presente
- [x] SFX D 1.0 → **1.5** — cartouche plus punchy
- [x] Mosquee Sankore regeneree fond indigo solide #1F2A4A — zéro damier
- [x] ~~Crossfade indigo 200ms a frame 324~~ **RETIRE V8** : double clipping perçu pire que saut natif
- [x] **Pays Mali colorie** (V8) : overlay SVG React + Natural Earth 50m (474 points) + indigo `#1F2A4A` opacité 0.65
- [x] **Bordure dorée glow** Mali : stroke #D4A574 + filter Gaussian blur
- [x] **Drapeau Mali** : 3 bandes vert/jaune/rouge + hampe + spring entry au mot "Mali" (8.78s)
- **URL V8 (FINALE Mali colorié)** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-tombouctou/wip/showcase-v8-mali-rgd3qTTUjcueLaTbx99ZQcjdyNUQ5e.mp4

### Decouvertes techniques V8 (CRITIQUES — sauvegardees)
- **Mapbox `addLayer` + `setPaintProperty` ne fonctionnent PAS en Remotion headless globe mode** → utiliser overlay SVG React. Voir `feedback_mapbox-overlay-svg-vs-layer.md`
- **Tracés pays = Natural Earth 50m obligatoire** (474 points pour Mali) → JAMAIS écrire un polygone à la main. Voir `feedback_geojson-natural-earth-50m.md`
- **Crossfade pour masquer saut globe→mercator = anti-pattern** : crée double clipping perçu, le saut natif est plus subtil

### Templates valides reutilisables
- `quebec-jacques-poc/mapbox-styles/atlas-parchemin-mande-relief.json` — style.json template
- `quebec-jacques-poc/src/AtlasTombouctouShowcase.tsx` — composition template V5 (changer KEYFRAMES + assets pour autres episodes)
- `quebec-jacques-poc/scripts-atlas/generate-atlas-narration.py` — pattern ElevenLabs narration
- `quebec-jacques-poc/scripts-atlas/forced-alignment.py` — pattern alignment (endpoint v1/forced-alignment)
- `quebec-jacques-poc/scripts-atlas/generate-music-v2.py` — pattern Minimax v2.6
- `quebec-jacques-poc/scripts-atlas/generate-mosquee-sankore.py` — pattern Gemini asset (fond indigo solide maintenant)

### Cout total Phase 2 : ~$0.47
- ElevenLabs narration : $0.01
- ElevenLabs SFX (3) : ~$0.001
- Gemini mosquee x2 (premiere + V2 fond indigo) : ~$0.14
- Minimax 3 musiques : $0.30

---

## Brief actions next session

### Etape 4 - Tester pays colorie + drapeau Mali (30-45 min)

**Demande Aziz** : effet impressionnant ou pays se colorie quand son nom est prononce, et drapeau apparait aligne aux frontieres.

**Approche recommandee** :
- **A. Pays colorie** : ajouter un layer Mapbox conditionnel dans le style.json. Filtre `iso_3166_1 = MLI` avec `fill-color` qui interpole vers `#D4A574` (dore) entre frames X et Y. Animatable via `setPaintProperty` au runtime Remotion.
- **B. Drapeau Mali pin flottant** : asset SVG (3 bandes vertical vert/jaune/rouge) en overlay React, positionne au centroide du Mali via `map.project([lon, lat])`. Apparition avec spring au moment du mot "Mali" (8.78s = T.maliConverge).

**Note** : decouvrir cette approche sera utile pour TOUS les futurs episodes (pas que Tombouctou).

### Etape 5 - Template Atlas formel — TERMINE 2026-04-29
- **Fichier livre** : `memory/templates/atlas-template-v1.md` (440 lignes)
- 9 sections : script lock + audio + style.json + composition + render + cout + variantes + checklist
- Routage CLAUDE.md mis a jour (ligne "Produire un episode Atlas")

### NEXT SESSION — Episode 2 Mansa Moussa (decide 2026-04-29)
- **Script existant** : `quebec-jacques-poc/scripts-atlas/script-mali-mansa-moussa-v1.md`
- **Duree cible** : 30-40s
- **Espace experimentation** : Aziz veut tester variations (mouvements camera, transitions) sur Mansa Moussa. Toute amelioration validee = retour dans `atlas-template-v1.md` section 7 "Variantes a l'etude".
- **Pre-requis** : valider V8 Tombouctou en visionnage complet, fact-check chiffres Mansa Moussa, recharge Vercel Blob si quota plein.

---

## Render commands de reference

```bash
cd quebec-jacques-poc
npx remotion render src/index.ts AtlasTombouctouShowcaseMusicC out/atlas-tombouctou/showcase-vN-musicC.mp4 --gl=angle --concurrency=1
```

Render time : ~65s pour 26s @ 30fps 1080x1920. ~0.4x realtime.
Upload : `python scripts/tools/upload-to-blob.py <fichier> --folder atlas-tombouctou/wip`

---

## URLs Vercel reference

- Showcase V4 musique C (session 2) : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-tombouctou/wip/showcase-v4-musicC-xpYzxQ4w8SMueVTLrDw8b5Q4IKW5R8.mp4
- **Showcase V5 musique C (session 3 — a valider)** : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/atlas-tombouctou/wip/showcase-v5-musicC-aWnzJKIRp7nW553quQwITXsd0Uszd4.mp4

---

## Starter prompt next session

```
Charge la memoire de session :
1. MEMORY.md (auto-charge)
2. memory/NEXT-SESSION-atlas-tombouctou-iterations.md (ce brief)
3. feedback_atlas-direction-visuelle-actee.md

Session Atlas Tombouctou - features avancees Phase 2.

V5 livree et uploadee. Etapes 1-3 terminees (mix audio, mosquee, crossfade).
Prochaine etape : Etape 4 pays colorie + drapeau Mali.
Si Aziz a valide V5 : implémenter le pays colorie via setPaintProperty Mapbox + drapeau SVG spring.
```
