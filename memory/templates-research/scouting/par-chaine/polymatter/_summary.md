# Scout PolyMatter — Synthèse

Date : 2026-05-08
Durée scout : ~22 min
Vidéos analysées : 3 (China Actually #1, Taiwan vs Ukraine, North Korea Makes Money)

## Verdict global
🟢 **Forte valeur**. PolyMatter a une signature visuelle d'une cohérence rare across 3 vidéos différentes : **rouge brand monolithique + flat icons noirs/blancs + slab condensed + pills colorées + drapeaux comme textures de pays**. C'est l'antithèse exacte du registre WonderWhy beige (Template D) et plus assumée que Wendover.

## Verdicts par axe

### Palette : 🟢
Système 4-5 couleurs extrêmement lisible :
- Fond rouge plein `#A41E22` (signature monolithique)
- Accent jaune `#F4D24A` (underlines, étoiles, pills "axis 1")
- Accent cyan `#3FC3CD` (pills "axis 2", oppositions)
- Accent orange `#F4A93C` (négatif/échec)
- Blanc cassé `#F4F4EE` (titres slab)
+ Variante "dark satellite" (`#0E1715` + `#39E07A`) pour openers cartographiques.

### Assets : 🟢
Devices signature ultra réutilisables :
1. **Country pills** (rectangle plein couleur sous nom de pays) au-dessus de chaque chiffre comparatif
2. **Slab numbers + underline jaune draw** (révélation séquentielle)
3. **Flat dark silhouette icons** (avion, sous-marin, tank, soldat) — toujours noir/blanc, jamais multicolores
4. **Tableau comparatif YES/NO** avec pills cyan/orange dans cells
5. **Drapeaux nationaux comme texture de remplissage** des pays sur cartes
6. **CV/ID card overlay** sur footage stock (avec rating étoiles + photo silhouette)
7. **Calendar grid 12 mois** avec une seule case allumée (storytelling temporel)
8. **Quart-de-cercle décoratif** dans coins (motif d'arrière-plan léger)

### Caméra : 🟢
Patterns transférables au Short vertical :
- **Stagger reveal** des lignes de tableau (150-200ms entre rows)
- **Slow push-in** sur footage stock (1.0x→1.05x, 6-8s)
- **Pop scale** sur pills/cells (1→1.05→1, 200ms)
- **Stroke draw** sur frontières cartes
- **Shake court** sur grosse stat (4-5 frames seulement)
- Pas de whip pan, pas de transitions fancy. Cuts francs. Hold 5-7s sur chaque graphique.

## Top 3 observations backlog

1. **Country pills + slab number + underline** = combo à formaliser comme composant Souverain `<StatCard country="GHANA" value="12%" accent="gold" />`. C'est le plus haut levier visuel cross-template.
2. **Drapeau-comme-texture-de-pays** sur Mapbox : injecter SVG/raster du drapeau dans `fill-pattern` de la couche pays sélectionné. Différenciateur fort vs concurrence francophone qui n'utilise jamais ça.
3. **Tableau comparatif YES/NO** avec pills cyan/orange : transposable directement à un Short Souverain "qui a obtenu quoi" (ex: pays africains qui ont renégocié vs pays qui ont signé sans amendement).

## Pertinence pour Template C "Atlas réaliste 3D"
**Partiellement pertinent.** PolyMatter n'utilise pas de 3D photoréaliste — leur registre cartographique est :
- **Satellite désaturé + neon overlay** (variante intéressante pour C : remplacer le relief 3D par une carte satellite verdâtre + réseau neon green)
- **Drapeaux-textures sur silhouettes pays plates** (totalement absent du C actuel, mais c'est plus proche du Template D ou un nouveau template)

## Nouveau template potentiel ?
🟢 **OUI — Template E "PolyMatter rouge mandarin"**
Signature : fond rouge plein + slab condensed + flat icons + pills + drapeaux-textures. Différent de :
- A (or sur noir, ledger sobre)
- B (ivoire/bleu pâle, très épuré)
- C (satellite/relief 3D)
- D (beige/papier, drapeaux SVG mais sur fond clair)

Template E partage avec D le motif "drapeau" mais inverse tout le reste (rouge dense, slab agressif, pills colorées). À tester sur un sujet géopolitique chargé (sanctions, blocs économiques, oppositions de camp) où le ton autoritaire/branded fonctionne narrativement.

**Risque** : le rouge plein peut se lire "agressif/jugement moral subliminal" → contredit la règle Souverain "couleurs ne codent pas un jugement moral". À tester avec une variante palette : rouge-brique `#8E2A26` plus terreux que le rouge Beijing.

## Chemin
`/Users/clawdbot/Workspace/remotion/par-chaine/polymatter/_summary.md`
