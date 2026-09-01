# Historical Map Pipeline — Valide 2026-04-12 (ARCHIVE)

> Migré depuis auto-memory 2026-08-31. Pipeline d3-geo + Remotion + icônes Gemini pour cartes animées
> style RealLifeLore/Vox Borders. Composants `HistoricalMap.tsx` / `HistoricalMapGemini.tsx` désormais
> dans `src/_archive/episodes-livres/geoafrique-shorts/components/` (projet GeoAfrique archivé).
> Le pipeline d3-geo courant et plus abouti vit dans `memory/tools/d3-geo-vector-pipeline.md` —
> ce fichier est conservé pour la table des mouvements caméra CSS transform et le pipeline d'icônes
> Gemini (toujours potentiellement réutilisables), pas comme référence de composant actif.

Pipeline pour creer des cartes animees style RealLifeLore/Vox Borders dans Remotion.
Utilisable en YouTube Shorts (9:16) et format long (16:9).

## Stack technique

- **Carte** : d3-geo (geoMercator) + TopoJSON (countries-50m.json) + SVG inline
- **Trace de routes** : `@remotion/paths` evolvePath() — draw-on anime
- **Zoom/Pan** : CSS transform uniquement (jamais D3 re-projection par frame)
- **Icones** : Gemini 3.1 Flash (PNG) + PIL white-to-transparent
- **Labels** : SVG text + rect avec spring() apparition
- **Relief** : SVG filter feDropShadow (simplifie pour perf studio)
- **Ocean** : radialGradient + lignes ondulantes Math.sin()

## Mouvements de camera valides (tous CSS transform)

| Mouvement | Technique | Usage |
|-----------|-----------|-------|
| Pull back | scale(1.35 -> 1.12) + Easing.out | Ouverture, reveler contexte |
| Breathing | Math.sin(frame * 0.08) * 0.006 | Maintenir la carte vivante |
| Pan | translate() + Easing.bezier | Suivre une route, changer de ville |
| Snap zoom | spring({ damping: 12, stiffness: 300 }) | Attirer attention sur un point |
| Deep zoom | scale() jusqu'a 2.8x (SVG = pas de pixelisation) | Focus sur une ville |
| Rotation | rotate(2-3deg) pendant les pans | Dynamisme cinematique |
| Dolly zoom | scale() + translate() opposes | Tension, revelation |

**Regle** : sequencer hold/pan/hold — le rythme cree le dynamisme, pas la vitesse.

## Pipeline icones (Gemini, pas Recraft)

```
1. Charger image REF du personnage existant (ex: mansa-moussa-v3c.png)
2. Gemini 3.1 Flash — prompt avec :
   - "Using the attached character as exact reference"
   - "IMPORTANT: background MUST be pure white (#FFFFFF)"
   - "No shadows, no gradients, no decorations outside"
   - "512x512, flat 2D illustration style, no text"
3. PIL white-to-transparent (threshold 240)
4. Sauvegarder dans public/assets/geoafrique/icons/
5. Integrer avec <image> SVG + spring() apparition
```

**Pourquoi Gemini > Recraft pour les icones** :
- Recraft V3/V4 sans Style ID ignore la palette demandee (impose ses propres couleurs)
- Gemini avec image REF garde le style exact du personnage (visage, vetements, palette)
- Zero credits Recraft consommes
- Fond blanc facile a convertir en transparent via PIL

**Pourquoi pas SVG code a la main** :
- Formes geometriques simples = OK (mosquee basique, couronne)
- Visages, personnages, animaux detailles = impossible a coder proprement
- Les icones Gemini sont 10x plus riches visuellement

## Techniques visuelles validees

| Technique | Complexite | Impact visuel |
|-----------|------------|---------------|
| Frontieres colorees (empire) | Simple — fill anime via spring() | Fort — revele un territoire |
| Routes dorees (evolvePath) | Simple — one-liner | Fort — trace de route anime |
| Pulse rings sur villes | Simple — modulo + circle | Moyen — attire l'oeil |
| Ocean vivant (lignes sin) | Simple — 20 paths | Moyen — carte respire |
| Relief 2.5D (drop-shadow) | Simple — 1 filter | Fort — separe terre/mer |
| Icones PNG sur carte | Simple — <image> SVG | Fort — casse la monotonie |
| Titre anime (spring + translateY) | Simple | Moyen — contexte historique |
| Glow sur routes | Simple — stroke plus large, opaque | Moyen — lisibilite |

## Deux variantes validees

| Variante | Fond | Bordures empire | Deep zoom | Quand l'utiliser |
|----------|------|----------------|-----------|-----------------|
| **d3-geo** (`HistoricalMap.tsx`) | SVG polygones + ocean + relief | OUI — coloration pays exacte | Infini (SVG) | Quand on a besoin de colorier des territoires |
| **Gemini parchment** (`HistoricalMapGemini.tsx`) | PNG Gemini V4 parchment | NON — routes + icones seulement | ~2.5x max | Quand on veut un style carte ancienne premium |

**Decision 2026-04-12** : sur carte Gemini PNG, ne PAS essayer de colorier des pays avec un polygone approximatif — ca flotte et ne s'aligne pas. Les routes dorees + icones + labels suffisent a raconter l'histoire. Si coloration pays necessaire, utiliser la variante d3-geo.

**Hybride (Gemini fond + d3-geo overlay)** : teste, faisable mais demande calibration projection — pas retenu pour l'instant.

## Limites connues

- **Grain SVG (feTurbulence)** : retire — trop lourd pour le studio live, peu d'impact visuel
- **Deep zoom > 3x** : frontieres deviennent grossieres (TopoJSON 50m simplifie)
- **Icones PNG au deep zoom** : OK jusqu'a ~2.8x a 70-90px d'affichage. Au-dela = pixelisation
- **Re-projection D3 par frame** : INTERDIT — 8-15ms bloquant par frame. CSS transform uniquement.

## Cartes Gemini generees

| Fichier | Style | Verdict |
|---------|-------|---------|
| `west-africa-map-v1.png` | Aquarelle detaillee (terrain, rivieres, vegetation) | Trop chargee — distrait des overlays |
| `west-africa-map-v3-neutral.png` | Beige plat neutre | Bon fond mais Gemini a mis du texte malgre l'instruction |
| **`west-africa-map-v4-parchment.png`** | **Parchemin ancien, subtil, zero texte** | **RETENU — meilleur compromis fond calme + caractere** |
| `west-africa-map-gpt-v1-neutral.png` | GPT ultra-minimal | Trop plat, ocean/terre se confondent |
| `west-africa-map-gpt-v2-parchment.png` | GPT parchemin ancien | Bon caractere mais pas retenu (Gemini V4 prefere) |

**Prompt qui fonctionne pour carte neutre** : insister sur "visually CALM", "background for animated overlays", "NO terrain, NO vegetation, NO rivers", "pure map silhouette only". Style "parchment" > "neutral" pour eviter le texte.

## Fichiers de reference (ARCHIVÉS — projet GeoAfrique clos)

- **Composant d3-geo** : `src/_archive/episodes-livres/geoafrique-shorts/components/HistoricalMap.tsx`
- **Composant Gemini** : `src/_archive/episodes-livres/geoafrique-shorts/components/HistoricalMapGemini.tsx`
- **TopoJSON** : `public/assets/maps/countries-50m.json`

## Audio Pipeline (valide 2026-04-12)

### Narration
- **ElevenLabs V3** — Narrateur GeoAfrique (`ICHuIqamER7XZMdm2HYC`)
- Params : `stability: 0.30, similarity_boost: 0.75, style: 0.25, speed: 0.90`
- Scanner regles TTS avant generation (participes passes, "ont+voyelle", nombres)
- Integration : `<Sequence from={30}><Audio src={narration} /></Sequence>`

### Musique
- **Minimax Music 2.6** via fal.ai (`fal-ai/minimax-music/v2.6`) — PREFERE
  - ~$0.035/generation, genere 2-5 min
  - `is_instrumental: true` pour musique de fond
  - Prompt max 300 chars
  - `duration_seconds` = IGNORE (le modele genere la duree qu'il veut)
  - Couper avec `ffmpeg -t 30` pour duree exacte
  - Supports lyrics avec tags structure : `[Intro] [Verse] [Chorus] [Bridge] [Outro]`
  - Prompt V2 valide (plus africain) : "Traditional Mande griot music from Mali. Solo kora with slow balafon melody. Acoustic djembe and dundun in gentle 6/8 rhythm. Style of Toumani Diabate. Warm, acoustic, organic. No synthesizers, no electronic sounds."
- **ElevenLabs Sound Gen** — backup, 30s max, bon pour SFX
- Mix : voix 100%, musique ~12% (= -18dB), fade in/out 1s
