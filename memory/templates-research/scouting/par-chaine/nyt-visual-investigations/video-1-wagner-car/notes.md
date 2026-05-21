# NYT Visual Investigations — Wagner in Africa (CAR)

URL : https://youtube.com/watch?v=9-a_k52eH8c
Durée analysée : ~12 frames échantillonnées (1/8s)

## Axe 1 — Palette  🟡

| Bloc | HEX inférés | Mood | Ratio |
|------|-------------|------|-------|
| Letterbox/cadre signature | `#000000` pur | Sobriété investigation | ~25% surface |
| Footage témoin | Tons réalistes désaturés (`#5a4a3a` `#9a8a70` `#c4a890`) | Documentaire brut | ~55% |
| Accents alerte | `#e63d2e` `#ff5942` (rouge NYT) | Marquage critique | ~5% |
| Documents archivés | `#fff1e0` papier + `#d97042` highlight orange | Preuve papier | apparitions |
| Satellite map | `#3d5b3a` vert forêt + `#2a3142` ombre | Géolocalisation OSINT | scènes carto |

**Pas de palette signature stylisée** — NYT laisse le footage parler. L'unité vient du noir + typo + rouge accent.

## Axe 2 — Assets / Figures d'animation  🟢

- **Cadre vertical flottant noir** : footage témoin (téléphone) recadré 9:16 avec coins arrondis légers, déposé sur fond noir 16:9. Signature OSINT majeure.
- **Lower-third typo** : sans-serif blanc bold (Franklin/Helvetica style NYT), ALL CAPS pour mots-clés ("MASSIVE MILITARY DEPLOYMENT")
- **Légende carto** : pastille rouge + label dans cartouche noir arrondi (`Wagner base`)
- **Filigrane "T" gothique NYT** bottom-right permanent
- **Documents PDF** : pages flottantes 3D légèrement inclinées avec glow chaud orange/rouge derrière, surlignages jaunes sur passages clés
- **Photo stock encadrée** : portrait/poignée de main sur fond carte satellite avec contour pays en rouge tracé
- **Bandeau source** : bande noire top avec `WINSON GROUP PROMOTIONAL VIDEO` en sans-serif blanc 16-20px (pattern de transparence sourcing)
- **Pastilles événement** : cercles rouges semi-transparents sur carte satellite (déploiement militaire)

## Axe 3 — Mouvements caméra  🟢

- **Push-in lent sur footage témoin** : zoom 1.0→1.08 sur 4-6s pendant voix-off (laisse respirer)
- **Reveal séquentiel pastilles** : pop-in d'événements un par un sur carte satellite (cadence narrative ~0.3s entre apparitions)
- **Pan satellite** : drift latéral très lent (`pan + zoom` Ken Burns) sur image satellite figée
- **Coupe sèche** entre footage et insert carte (pas de transition fancy)
- **Cadre flottant qui zoome** : la fenêtre vidéo verticale grandit légèrement pendant qu'on entend le témoin

## Reproductible Souverain ?

✅ Cadre vertical flottant : Remotion `<Video>` avec borderRadius + ombre, sur AbsoluteFill noir
✅ Pastilles + dashed lines satellite : Mapbox + SVG overlay (déjà maîtrisé batch précédent)
✅ Bandeau "SOURCE: X" : composant texte simple noir
🟡 Documents glow : Gemini i2i pour générer feuilles + Remotion glow CSS
🔴 Footage drone réel : pas reproductible, mais Gemini i2i peut imiter le rendu satellite/drone

## Top observations backlog

1. **Cadre vertical flottant noir** = parfait pour Souverain Short (déjà 9:16 natif !)
2. **Pattern "SOURCE: X" en bandeau noir** = transparence éditoriale, à intégrer pour contextualiser archives
3. **Pastilles satellite séquentielles** = grammaire narrative claire pour énumérer pays/événements
