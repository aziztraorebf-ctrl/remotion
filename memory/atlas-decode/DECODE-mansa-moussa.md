# DÉCODAGE TECHNIQUE — Mansa Moussa V2 (Atlas, 121s vertical 720×1280→1080×1920)

> Décodé 2026-06-03 (agent général-purpose, code récupéré via git 50a79a6^ + 20 frames render).
> Source du playbook Atlas avec [[DECODE-empire-ghana]]. Voir [[feedback_atlas-retour-aux-sources-ghana-mansa]].

> ⚠️ **CODE PURGÉ AU GRAND MÉNAGE** : les scènes (mécanique sprites/overlays) n'existent plus
> dans l'arbo active. Récupérées de `git 50a79a6^:quebec-jacques-poc/src/scenes/` + `/src/`.
> **Les spritesheets PixelLab** (`.../walk_cycle/east/frame_000.png`) sont aussi purgés — seules
> restent les refs Gemini (`public/assets/geoafrique/characters/mansa-moussa-*.png`). RESTAURER.

Fichiers (git `50a79a6^:quebec-jacques-poc/src/`) : `scenes/AtlasPixelChar.tsx`, `scenes/AtlasV2S1-S4Scene.tsx`, `scenes/AtlasV2HookScene.tsx`, `scenes/AtlasV2Subtitles.tsx`, `scenes/AtlasV2Insert{Pie,Bar,Line}Chart.tsx`, `scenes/AtlasV2Cta*.tsx`, `atlas-v2-components.tsx`, `atlas-v2-shared-defs.tsx`, `atlas-v2-flags.tsx`. Toujours dans l'archive Atlas : `AtlasMansaMoussaV2Final.tsx`, `timing-mansa-moussa-v2.ts`, `atlas-v2-narration-words.ts`.

## A. SPRITES PIXELLAB — la signature

### `AtlasPixelChar` (composant unique générique, 113 lignes)

Convention fichiers (frames PNG individuelles, PAS spritesheet packée) :
```
<charPath>/animations/<animName>/<direction>/frame_000.png   (walk cycle, frame_000..005)
<charPath>/static-<direction>.png                            (fallback statique)
```
Chargées via `staticFile()` + `<image href>`.

**Cadence découplée du fps vidéo** :
```js
const WALK_FPS = 8; const WALK_FRAMES = 6;
const animFrame = animated ? Math.floor(((frame-appearAt)/fps)*WALK_FPS) % frameCount : 0;
```
Sprite à 8fps indépendant du 30fps vidéo. `% frameCount` boucle. `if (frame<appearAt) return null` (= Math.max(0,localF)).

**Entrée fade spring (jamais pop)** : `spring({frame:frame-appearAt, fps, config:{damping:30, stiffness:120}})`.
**Ancrage au pied** : `x={x-size/2} y={y-size}` → sprite DEBOUT sur (x,y), bas touche le point. Crucial pour "marcher sur" la carte.
**Flip Ouest** : `direction==="west" ? scale(-1,1) translate(${-x*2-size} 0) : ""` (PixelLab génère face Est only).
**`imageRendering:"pixelated"` OBLIGATOIRE** (sinon bouillie).

### Chorégraphie caravane Hadj (`AtlasV2S3Scene.tsx`) — pièce maîtresse

**Path waypoints + lerp par segment** : `waypoints=[Niani,Tombouctou,Sahara1,Sahara2,LeCaire,Sinai,Mecque]`, `getWaypointPos(t∈[0,1])` lerp segment.
**Cortège = décalages temporels sur le MÊME path** (l'astuce) :
```js
const mansaT = interpolate(frame, [start,end], [0,1], clamp);
getWaypointPos(mansaT);        // Mansa tête
getWaypointPos(mansaT - 0.06); // chameau
getWaypointPos(mansaT - 0.10); // soldat
getWaypointPos(mansaT - 0.14); // porteur
```
File indienne SANS coder 4 trajectoires. Espacement = un seul nombre.
**4 persos** : porteur-mali/soldat-mali/chameau (size 48, frameCount 6 sauf chameau 4, dir east) + mansa-moussa (size **64**, walk 6 / **royal_pose 4**, east→**south**).
**Switch contextuel walk→pose royale à l'arrivée** : `atMecque ? royal_pose/south/4/animated:false : walk_cycle/east/6/animated:true`. Mansa se retourne face caméra.
**Fade-out groupé** : `<g opacity={spriteOpacity}>` tous les sprites, `interpolate([caravaneEnd, royalPoseEnd],[1,0])`.

## B. OVERLAYS (parfaits — pourquoi) — TRIADE systématique

(1) entrée `spring()` jamais linéaire (poids) ; (2) fond cream `#F2E5C8` + outline encre `#3A2A18` (lisibilité garantie sur terracotta/bleu) ; (3) timing sur **timestamp Whisper réel**.

- **`AtlasCartouche`** (L112-184) : chiffre-choc, `spring({damping:14,stiffness:200})` scale 0→1 + **wobble** `rotate(-1.5+sin(localF*0.08)*0.5)`, fadeOut 10f, chaînage `appearAt/disappearAt` (zéro collision). Cormorant 700.
- **`AtlasLabel`** (L200-254) : pill ville auto-width (`w=text.length*charW+pad`), `spring({damping:18,stiffness:220})` scale 0.6→1 **autour du point d'ancrage** (`translate(lx ly) scale translate(-lx -ly)`).
- **`AtlasPulseMarker`** (L267-300) : onde radar `pulse=max(0,1-(t%1.5)/1.5)`, rayon `inner+pulse*outer`, opacité `(1-pulse)*0.95`. Dot or + stroke encre.
- **`AtlasEmpireLegend`** (S1 L251) : cartouche avec **échantillon du pointillé** (rect `dasharray="8 4"`) → lien légende↔polygone. Didactique.
- **`IconCartouche`** (S2 L37) : icône Gemini transparente (livre/mosquée) dans plaque cream.
- **Médaillon Gizeh** (S4 L307-343) : `<image>` clippée `<clipPath><circle r=52>` + anneau or + halo.
- **`WipeOverlay`** (orch L37) : barre dégradé or→brun balaie vertical 15f, masque coupure carte↔insert.
- **Karaoke `AtlasV2Subtitles`** : mappe frame-visuel→sec-narration À TRAVERS les inserts (`visualFrameToNarrationSec` renvoie null pendant insert), groupe phrases (silence>0.5s ou 7 mots).

## C. MOUVEMENTS CAMÉRA (SVG pur, d3-geo précalculé, pas Mapbox)

Transform composé canonique (S1-S4 identique) :
```js
translate(360+driftX-camOffX, 640+driftY-camOffY) scale(camScale, camScale*scaleY) skewX(skewX) translate(-360,-640)
```
- **Drift Ken Burns** : `driftX=sin(f*0.014)*10, driftY=cos(f*0.011)*7` (fréquences premières → non-répétitif). Chaque scène.
- **Parallax fg** : `fgDriftX=sin(f*0.014)*13; parallaxX=fgDriftX-driftX` sur groupe Mali/Empire/caravane.
- **TILT (fausse 3D)** : `tiltDeg=peak+sin(localF*0.04)*2; skewX=tiltDeg*0.15; scaleY=1-tiltDeg*0.008`. Peaks croissants : **S1 20°→S2 20°→S3 28° climax→S4 24°**.
- **Camera SNAP** : `spring({damping:80,stiffness:400})` (raide+amorti=snap net) recentre+zoome sur ville. `camOff→(ville-centre)*0.65/0.8`.
- **Track sprite** (S3) : `activeCamX=mansaCx` pendant trajet (caméra=sprite), zoom `1→2→2→1` (in/hold/pull-back). **Tilt s'annule au zoom** (`tiltDeg→8`) pour lisibilité sprites.
- **Bump impact** : `1+0.06*sin(bumpT*π)`.

## D. STRUCTURE & RYTHME

Orchestrateur SVG unique, scènes = composants dans **un seul `<svg viewBox="0 0 720 1280">`**, `if (frame<start||frame>=end) return null`. Pas de `<Sequence>` pour le visuel (crossfade interne).

| Scène | Borne | Durée | Tilt |
|---|---|---|---|
| Hook globe+particules | 0–4s | 4s | — |
| S1 Setup (globe→Mercator) | 4–18.9s | 15s | 20° |
| S2 Densité (Tombouctou/Sankoré) | 18.9–36.1s | 17s | 20° |
| Insert 1 Pie | — | 10s | — |
| **S3 Climax Hadj (caravane)** | 36.1–54.8s | 19s | **28°** |
| Insert 2 Bar | — | 10s | — |
| S4 Conséquence (grisaille) | 54.8–67.8s | 13s | 24° |
| Insert 3 Line | — | 10s | — |
| CTA (Rockefeller/Bezos/Musk) | 67.8–81s | 13s | — |

**Insert "duck narration" (le + astucieux)** : 3 inserts dataviz insérés sans casser la narration. Audio découpé en **4 segments** (`AUDIO_SEGMENTS`) `startFrom/endAt` autour de chaque insert. `offsetForNarrFrame` décale les beats visuels de +10s par insert passé. Triggers **recalés sur fins de phrase Whisper**. Musique 0.04 continue.
**Respirations** : les inserts (3×10s) SONT les respirations. Cartouches micro-événement remplissent gaps >8s (R1).

## E. PALETTE & TYPO

`ATLAS_COLORS` parchemin chaud (PAS bleu-nuit Souverain) : fond `#1A1F3A→#2A1F2E`, océan `#3A5A7E`, terre **terracotta `#C97D5A`**, maliFill cream `#F5EBD8`, empireGold `#D4A574`, outline noir `#1A1A1A`, cream plaque `#F2E5C8`, encre `#3A2A18`.
`NATIONAL_COLORS` existe mais **désactivé** (anachronisme empire historique).
**Grisaille narrative** (S4) : sur "Un seul homme", pays Afrique terracotta→gris `#8A8A8A` lerp RGB 1.2s, Mali reste or. Métaphore.
Typo : **Cormorant Garamond** partout (700 chiffres), aucune sans-serif, labels MAJUSCULES.
**Filtres SVG zéro-asset** : `goldGlow/redGlow` (feGaussianBlur+feMerge), `paperTexture/paperGrain` (feTurbulence→cream/sépia).

## TOP 5 PATTERNS MANSA MOUSSA À FORMALISER

1. ⭐ **`AtlasPixelChar`** — sprite générique : convention dossier `<charPath>/animations/<anim>/<dir>/frame_NNN.png`, cadence découplée 8fps, **ancrage pied** (`y-size`), entrée fade spring, `pixelated`, flip-ouest `scale(-1,1)`. Le composant socle. (Restaurer + spritesheets.)
2. ⭐ **Cortège** = `getWaypointPos(mansaT - k)` k∈{0,0.06,0.10,0.14} → file indienne sur un seul path. + switch anim contextuel (walk→royal_pose) + fade-out groupé.
3. ⭐ **Caméra track sprite + annule tilt au zoom** : `activeCamX=mansaCx` zoom×2 puis pull-back, `tiltDeg→8` au zoom. Recette "follow-sprite + dezoom-on-arrival".
4. **Tilt skewX croissant + drift Ken Burns** = grammaire mouvement. Hook `useAtlasCamera(frame,{tiltPeak,snapTarget})`. Jamais statique.
5. **Overlays = triade** (spring+plaque cream/encre+sync Whisper) + **insert duck-narration** (4 segments audio + offsetForNarrFrame + triggers fin-de-phrase). Jamais à contretemps.
