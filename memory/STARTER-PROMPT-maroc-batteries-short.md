# Starter Prompt — Maroc Batteries Short (session suivante)

> Créé 2026-05-31 après session de construction du hook.
> Lire ce fichier EN PREMIER pour reprendre la production.

## État actuel

- **Hook (A1) FINAL** ✅ — `out/episodes/maroc-batteries/beat0-FINAL.mp4`
- **Fichier principal** : `src/projects/souverain/maroc-batteries/MarocBatteriesShort.tsx` (1 fichier unique, 6 actes)
- **Audio** : `public/souverain/maroc-batteries/audio/narration-maroc-v3.mp3` (109.48s)
- **Musique** : `public/souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3` (148s)
- **Mots karaoké** : `src/projects/souverain/maroc-batteries/maroc-words.ts` (228 mots, forced alignment)
- **Timing** : `src/projects/souverain/maroc-batteries/timing.ts`
- **Composition Root.tsx** : `MarocBatteries-Short` enregistrée

## Ce qu'il reste à faire (A2 → A6)

| Acte | Durée | Contenu voix | Technique |
|------|-------|-------------|-----------|
| A2 Phosphate | 20.3s | "Sous le sol marocain... 70% réserves mondiales" | Mapbox Khouribga + "70%" countUp + drapeau Maroc |
| A3 Cailloux | 12.3s | "Pendant des décennies... valeur ajoutée" | Image Gemini phosphate/cathode + Ken Burns |
| A4 Acteurs | 15.9s | "Gotion, Volkswagen, Kénitra" | Mapbox Kénitra + markers acteurs |
| A5 Géographie | 37.4s | "Pour le Maroc... géographie industrielle" | Mapbox 3 sub-moments + triangle géopolitique |
| A6 Question | 10.3s | "Qui fixe le prix dans 10 ans ?" | CSS pur navy + TextChoc |

## Architecture (NON-NÉGOCIABLE)

**1 fichier unique** `MarocBatteriesShort.tsx` — pas de beats séparés.
Raison validée en session : la caméra Mapbox est continue, 1 seule instance Map.
Modèle : `PetrolePatienceShort.tsx` (voir `memory/SOUVERAIN-SHORT-SKELETON.md`).

Pattern getCam(frame) → retourne {lon, lat, zoom, pitch, bearing} selon l'acte.
Tout le code dans ce seul fichier. Render via `render-mapbox.sh`.

## Render

```bash
# Hook uniquement (test rapide)
bash scripts/render-mapbox.sh MarocBatteries-Short out/episodes/maroc-batteries/wip/short_v1.mp4 --frames 0-248

# Vidéo complète
bash scripts/render-mapbox.sh MarocBatteries-Short out/episodes/maroc-batteries/wip/short_v1.mp4
```

## Leçons techniques apprises cette session

### 1. DOM Marker Mapbox pour labels géo-attachés
Le label "KÉNITRA" qui suivait le dot = DOM Marker, pas CSS fixe.
```ts
const marker = new mapboxgl.Marker({ element: el, anchor: "right", offset: [-16, 0] })
  .setLngLat(LOC.kenitra).addTo(map);
// Contrôler opacité via markerRef.current?.getElement().style.opacity
```

### 2. Fill-pattern drapeau — canvas 48x32px dessiné en code
Ne pas charger de PNG externe (headless bug). Dessiner directement le canvas dans setupRef.
Taille 48x32 = étoiles minuscules, rouge dominant, visible sans envahir.

### 3. Karaoké — utiliser maroc-words.ts pas WORD_ANCHORS
WORD_ANCHORS dans timing.ts = 8 mots-pivots seulement.
maroc-words.ts = 228 mots complets. Toujours filtrer par acte :
```ts
MAROC_WORDS.filter(w => w[1] >= startS - 0.1 && w[2] <= endS + 0.3)
```

### 4. Kimi = toujours via OpenRouter
`moonshotai/kimi-k2.5` sur OpenRouter. Moonshot direct = content null bug.
Script : `scripts/tools/kimi-mapbox-brief.py` (contexte Mapbox auto-injecté).

### 5. Gemini pour review vidéo
Gemini 3.1 Pro peut analyser une vidéo MP4 complète via Files API.
Script : `/tmp/gemini-review-short.py` (ou à recréer depuis ce pattern).
Envoyer la vidéo complète, demander JSON structuré avec fix_code_values.

### 6. Deux nouveautés max par épisode
Cette session : ligne dasharray transcontinentale Détroit Gibraltar.
Deuxième nouveauté à découvrir en codant A2-A5.

### 7. Zoom A1 = 4.2 → 7.0 (pas 10+)
Rester à distance pour voir le Maroc entier avec drapeau.
easing = `Math.pow(t, 0.6)` pour mouvement lent progressif.

## Workflow validé pour la session suivante

1. Lire ce fichier
2. Lire `memory/SOUVERAIN-SHORT-SKELETON.md`
3. Ouvrir `MarocBatteriesShort.tsx` — continuer à partir de A2
4. Coder A2 → render frames → valider → A3 → etc.
5. Envoyer vidéo complète à Gemini 3.1 Pro pour review globale
6. Appliquer corrections → render final → `out/PRET-PUBLICATION/`
