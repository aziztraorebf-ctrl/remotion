# BRIEF PROCHAINE SESSION — Reset + Shaka Zulu Fork

> Créé : 2026-05-02
> Priorité : lire CE fichier en entier avant toute action
> Durée estimée session : 3-4h

---

## ORDRE D'EXÉCUTION OBLIGATOIRE

1. Nettoyage + restructuration workspace (1h)
2. Système de documentation réutilisable (30 min)
3. Fork Mansa Moussa → Shaka Zulu scène 1 (reste de la session)

NE PAS sauter à l'étape 3 avant d'avoir fini 1 et 2.

---

## ÉTAPE 1 — Nettoyage workspace

### Problème actuel
Le workspace a grandi organiquement sans structure. Résultat :
- Code validé mélangé avec code expérimental
- Composants réutilisables éparpillés dans 3 dossiers différents
- Mémoire éclatée en 15+ fichiers NEXT-SESSION-* sans index clair
- Renders temporaires jamais nettoyés dans `out/`
- `quebec-jacques-poc/` contient le vrai code Atlas mais son nom ne le dit pas

### Structure cible

```
remotion/
  src/
    projects/
      atlas/
        _shared/              ← composants partagés TOUS épisodes Atlas
          AtlasGlobe.tsx
          AtlasMercator.tsx
          AtlasLabel.tsx
          AtlasCartouche.tsx
          AtlasPulseMarker.tsx
          AtlasCaravane.tsx
          AtlasSubtitlesKaraoke.tsx
          AtlasInsertPieChart.tsx
          AtlasInsertBarChart.tsx
          AtlasInsertLineChart.tsx
        mansa-moussa/         ← épisode 1 (code existant déplacé)
        shaka-zulu/           ← épisode 2 (en cours)
        _precompute/          ← scripts Node.js precompute SVG paths
          precompute-mansa-moussa.mjs
          precompute-shaka-zulu.mjs
      geoafrique-shorts/      ← shorts narratifs (inchangé)
      [autres projets]/
  data/
    geo/                      ← GeoJSON sources (Natural Earth, Historical Basemaps)
      ne_50m_countries.geojson
      world_1300.geojson
    atlas/
      mansa-moussa-data.json  ← paths SVG precompilés Mansa Moussa
      shaka-zulu-data.json    ← paths SVG precompilés Shaka Zulu
  public/
    atlas-mansa-moussa/       ← assets (audio, images, sprites) — inchangé
    atlas-shaka-zulu/         ← assets Shaka Zulu — inchangé
  memory/                     ← voir structure mémoire ci-dessous
  out/
    PRET-PUBLICATION/         ← renders finaux validés UNIQUEMENT
    [tout le reste supprimé]  ← renders temporaires = poubelle
```

### Règles nettoyage
- NE PAS supprimer sans `ls` exhaustif d'abord
- NE PAS déplacer `quebec-jacques-poc/` tant que le code Atlas n'est pas migré dans `src/projects/atlas/`
- Confirmer avec Aziz avant toute suppression de render dans `out/`

---

## ÉTAPE 2 — Système de documentation réutilisable

### Le problème qu'on résout
À chaque session on perd du temps à retrouver : "on avait fait ça comment déjà ?"
Les fichiers mémoire deviennent énormes et on ne sait plus où chercher.
Les composants réutilisables existent mais ne sont pas référencés clairement.

### Structure mémoire cible

```
memory/
  MEMORY.md                   ← index principal (garder court, pointeurs seulement)
  NEXT-SESSION-BRIEF-COMPLET.md ← ce fichier (prochaine session uniquement)

  atlas/
    ATLAS-COMPOSANTS.md       ← catalogue tous composants réutilisables Atlas
    ATLAS-WORKFLOW.md         ← workflow validé scène par scène
    ATLAS-PALETTE.md          ← palettes validées par épisode
    ATLAS-DONNEES.md          ← où sont les GeoJSON, comment precomputer

  tools/                      ← déjà existant, garder
    seedance-rules.md
    gemini.md
    remotion.md
    elevenlabs.md
    etc.

  episodes/
    mansa-moussa/             ← tout ce qui concerne cet épisode
      RECAP.md                ← état final, URL render, coût total
      LEARNINGS.md            ← leçons techniques (déjà existant, déplacer)
    shaka-zulu/               ← en cours
      RECAP.md
      VAGUE-2-LOCKED.md       ← garder, contenu narratif verrouillé
```

### Le fichier clé à créer : ATLAS-COMPOSANTS.md

Ce fichier = catalogue de tout ce qu'on a construit et qui est réutilisable.
Format :

```markdown
## AtlasMercator
- Fichier : src/projects/atlas/_shared/AtlasMercator.tsx
- Usage : carte plate avec scale/drift/center offset
- Props : data (GeoJSON paths), countryColors, oceanColor, scale, driftX, driftY
- Exemple : S1 Mansa Moussa (Afrique large), S3 Shaka (KwaZulu)
- Notes : camera moves via <g transform>, pas de re-projection runtime

## AtlasCaravane
- Fichier : src/projects/atlas/_shared/AtlasCaravane.tsx
- Usage : sprite PNG sur path Bezier avec hopping vertical
- Props : spriteSrc, path (SVG string), duration, startFrame
- Exemple : S3 Mansa Moussa (Mali → La Mecque), S3 Shaka (impi expansion)
- Notes : walk cycle multi-frames Gemini = bug bbox → garder frame unique + Math.abs(sin)
```

---

## ÉTAPE 3 — Fork Mansa Moussa → Shaka Zulu

### CORRECTION — État réel de la vague 1

> La vague 1 est plus avancée que ce brief l'indiquait initialement.
> Source de vérité : `memory/NEXT-SESSION-shaka-zulu-fork-mansa-moussa.md` (mis à jour 2026-05-02)

Ce qui EXISTE déjà :
- `timing.ts` — COMPLET (6 segments, 10 inserts, beats narratifs, triple-screen S2)
- `AtlasShakaFull.tsx` — assemblé avec toutes les scènes
- 9 scènes dans `scenes/`, 5 inserts dans `inserts/`
- Audio : `narration-v5.mp3`, `music-ingoma.mp3`, `music-isicathamiya.mp3`
- `shaka-zulu-data.json` (3 projections), `MourningWarp.tsx`, palette

Ce qui MANQUE (vague 2) : remplacer les fake globes/cercles CSS par vraie carte d3-geo dans S1_GEO, S3_EXPANSION, S4_NANDI.

**Commencer directement sur S1_GEO** — fork `AtlasMercator` depuis `quebec-jacques-poc/src/` + `shaka-zulu-data.json` projection `territory`.

### Ce qui change entre Mansa Moussa et Shaka Zulu

| Élément | Mansa Moussa | Shaka Zulu |
|---------|-------------|-----------|
| Projection | Mercator centré Mali/Afrique de l'Ouest | AzimuthalEqualArea centré KwaZulu-Natal |
| Pays focus | Mali (tricolore vert/or/rouge) | ZAF/KwaZulu (crème `#F5EBD8`) |
| Overlay empire | Hachuré crème Empire Mali 1300 | Hachuré bordeaux territoire Zulu 1816-1828 |
| Labels | Tombouctou, La Mecque, Le Caire | uMgungundlovu, GqokliHill, Durban |
| Sprites caravane | Mansa Moussa + chameau + guerrier → La Mecque | Impi (guerriers) expansion KwaZulu |
| Composant unique | — | MourningWarp.tsx (deuil Nandi S4) |
| Données carte | atlas-v2-data.json | shaka-zulu-data.json (DÉJÀ PRÊT) |
| Palette | Terracotta/indigo/or | Parchemin/bordeaux/or (déjà dans AtlasShakaPalette.tsx) |

### Workflow scène par scène

**Scène 1 — Territoire (S1)**
- Carte Afrique australe + KwaZulu crème
- Label uMgungundlovu + pulse marker
- Cartouche "ROYAUME ZULU — 1816"
- Render 5s → Aziz valide → commit

**Scène 2 — Expansion impi (S3)**
- Carte large Afrique australe
- Path Bezier KwaBulawayo → nord + ouest
- Sprites impi sur path (AtlasCaravane adapté)
- Cartouche "100 000 GUERRIERS"
- Render 5s → Aziz valide → commit

**Scène 3 — Deuil Nandi (S4)**
- Carte mourning (zoom intermédiaire)
- MourningWarp.tsx par-dessus (déjà construit)
- Cercles concentriques depuis uMgungundlovu
- Render 5s → Aziz valide → commit

**Scène 4 — Inserts chiffres**
- Mêmes composants Pie/Bar/Line
- Nouvelles données Shaka
- Render → valide → commit

**Scène 5 — CTA**
- Même structure Mansa Moussa
- Texte Shaka Zulu
- Render → valide → commit

**Assembly final**
- Render complet → Aziz valide → Vercel Blob → URL

### Assets déjà prêts
- `src/projects/shaka-zulu/shaka-zulu-data.json` — 3 projections KwaZulu ✓
- `src/projects/shaka-zulu/components/MourningWarp.tsx` — S4 ✓
- `src/projects/shaka-zulu/components/AtlasShakaPalette.tsx` — palette ✓
- `src/projects/shaka-zulu/timing.ts` — vérifier en début de session
- Narration audio : vérifier `public/atlas-shaka-zulu/audio/`

### Règle absolue pour Claude
Avant d'écrire du code : "Est-ce qu'un composant équivalent existe dans `_shared/` ou dans Mansa Moussa ?" Si oui → adapter. Si non → construire. Toujours annoncer le choix à Aziz avant de coder.

---

## RAPPELS CRITIQUES (appris cette session)

1. **VAGUE-2-LOCKED.md** contient la direction narrative (verrouillée). Il ne remplace pas le jugement visuel. Si une décision architecturale dans ce doc implique de reconstruire quelque chose qui existe déjà → lever le flag à Aziz AVANT de coder.

2. **Scène par scène = la méthode qui marche**. Ne pas tout construire d'un coup puis render. Une scène, un render, une validation, commit, scène suivante.

3. **Le workspace = notre maison**. Si c'est en bordel pour Aziz, c'est en bordel pour Claude aussi. Nettoyage = investissement qui fait gagner du temps à chaque session suivante.

4. **Réutilisabilité > Originalité**. Chaînes pro (Vox, Johnny Harris, RealLifeLore) : même template, nouvelles données. C'est la force industrielle. On n'invente pas la roue à chaque épisode.
