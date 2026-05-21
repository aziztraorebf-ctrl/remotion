# NYT Visual Investigations — Summary scout

Statut : ✅ Complet — 3 vidéos analysées, 17 frames sélectionnées
Date : 2026-05-08
Time-box : ~22 min

## Vidéos analysées

| # | Slug | URL | Verdict |
|---|------|-----|---------|
| 1 | wagner-car | https://youtube.com/watch?v=9-a_k52eH8c | 🟢 |
| 2 | congo-militias | https://youtube.com/watch?v=sjNPwP_iiVw | 🟢 |
| 3 | nk-ship | https://youtube.com/watch?v=hDTCHdcPYTQ | 🟢 |

## Verdict global  🟢

NYT Visual Investigations est **la chaîne la plus pertinente scoutée à ce jour pour Souverain**. ADN : OSINT investigation = footage réel + couches d'annotations carto + diagrammes entités. Trois patterns dominants (cadre vertical flottant, satellite + traits dashed, diagramme ledger noir) sont **directement reproductibles** dans notre stack Remotion + Mapbox + Gemini i2i.

## Verdicts par axe

- **Palette** 🟢 — Triple registre identifié : (1) noir + accents rouge sur footage, (2) satellite vert/bleu + traits blancs, (3) noir pur + vecteurs colorés saturés. Aucun ne contredit nos templates ; tous les enrichissent.
- **Assets** 🟢 — Catalogue exceptionnel : cadre vertical flottant, bandeau source, échelle miles, date stamp italique serif, flèches dashed, icônes événement, vector ships, diagrammes ledger.
- **Mouvements caméra** 🟢 — Vocabulaire restreint et investigation-friendly : push-in lent, pop-in séquentiel, pan Ken Burns, coupe sèche. Zéro effet de transition fancy. Confirme notre direction.

## Top 3 observations backlog (cross-vidéos)

1. **Cadre vertical flottant noir pour témoignages/archives** (V1 + V3) — Pattern signature OSINT NYT. Pour Souverain Short qui est déjà 9:16, on inverse : cadre vertical = format natif, mais le **bandeau "SOURCE: X"** noir top reste indispensable (transparence éditoriale, crédibilité). À ajouter systématiquement dès qu'on intègre footage/photo non-NYT.
2. **Diagramme entités sur noir pur avec vecteurs colorés codés** (V3 frame 05) — LE pattern manquant pour Souverain. Reproductible 100% en Remotion. Idéal pour visualiser propriété (sociétés écran, chaînes de contrats, flux d'argent). Cadence pop-in ~0.6s, lignes dashed grises, labels ALL CAPS sans-serif.
3. **Date stamp italique serif + échelle miles + labels pays italique large-tracked** (V2) — Trio typographique signature OSINT. Crédibilité instantanée. Migration possible de notre Template C (sans-serif actuel) vers serif italique pour les annotations carto = gain significatif d'autorité.

## Template OSINT investigation potentiel ?  🟢 → **TEMPLATE E DISTINCT recommandé**

**Réponse : Template E "Investigation OSINT" mérite d'exister à part.**

Pourquoi pas une consolidation de Template C (Atlas réaliste 3D / satellite) :
- Template C tel qu'esquissé est carto-driven (relief, satellite stylé). NYT VI est **annotation-driven** : la carte est un substrat, ce qui compte ce sont les couches qui se posent dessus (dashed arrows, icônes événement, date stamps, échelles, pop-ins séquentiels).
- Template C ne couvre PAS le pattern "diagramme entités noir pur" (frame V3 f11), ni le pattern "cadre vertical flottant + bandeau source", qui sont les deux signatures les plus fortes de NYT VI.
- Template C reste pertinent pour les segments "wide establishing" géographiques. Template E vit en parallèle pour les segments "investigation" (preuves, propriété, mouvements).

**Définition Template E "Investigation OSINT" (proposition) :**
- Palette : `#000000` dominant + accent rouge `#e63d2e` + vecteurs bleu/orange/rouge codés par entité + satellite vert/bleu en couche carto
- Typo : sans-serif blanc ALL CAPS pour labels investigation, serif italique large-tracked pour annotations carto, monospace pour timestamps
- Assets canoniques : cadre vertical flottant, bandeau source, échelle miles, date stamp, flèches dashed, vector entities, diagramme ledger
- Mouvements : push-in lent, pop-in séquentiel 0.6s, pan Ken Burns 0.5%/s, coupes sèches uniquement
- Cas d'usage Souverain : épisodes "qui possède quoi" (mines, sociétés écran), traçage flux d'argent, géolocalisation événements datés, présentation de preuves documentaires

**Compatibilité templates existants :**
- Template A (Or Africain) : Template E peut emprunter le `#000000` de fond et la rigueur ledger — synergies fortes
- Template C (Atlas 3D) : Template E vit côte-à-côte, pas en remplacement
- Template B (Carto Caspian) et D (WonderWhy) : registres différents, pas de conflit

## Path

`/Users/clawdbot/Workspace/remotion/par-chaine/nyt-visual-investigations/_summary.md`
