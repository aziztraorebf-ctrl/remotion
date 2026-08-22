# ZAMBIE / PEACE CORPS — démo client cartographique (2026-08-21/22)

> ⚠️ **COPIE VERSIONNÉE** de `out/_r-and-d/zambia-peacecorps/MANIFESTE.md`. `out/` est gitignoré :
> l'original disparaît sur tout autre clone. C'est ici la source de vérité pour retrouver le cas.
> Les MP4 vivent sur Vercel Blob (liens ci-dessous), pas dans git.

> **Premier test complet du workflow DÉMO CLIENT** : brief client réel → storyboard 3 modèles →
> arbitrage Aziz → breakdown → code → self-review mécanique → comparatif → correction par la mesure.
> Brief source : offre Upwork (animation 15 s, volontaires Peace Corps en Zambie 1995→2026).
> Extrait produit : **1995 → 2005**, 8 s, en **2 traitements** (gabarit de choix avant-vente).

## ⭐ LES 2 VERSIONS VALIDÉES

| | Concept A — « le globe, la descente, la propagation » | Concept B — « le continent, la descente, la constellation » |
|---|---|---|
| Moteur | **D3** (projection ortho unique, globe → pays sans raccord) | **Mapbox** (1 Map continue, Mercator forcé + relief) |
| Source | Storyboard **Gemini**, concept 1 + arcs du concept 2 | Storyboard **Grok**, concept 2 case 1 + concept 1 cases 2-4 desserrées |
| Vidéo | https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/client-sim/zambia-FINAL/conceptA-FINAL-9YUEXLWhBkPCAtnwlujR6AnLeGGxci.mp4 | https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/client-sim/zambia-FINAL/conceptB-FINAL-CZhGAchtcPyMqibpPLp2dijRV1SLjh.mp4 |
| Local | `conceptA-FINAL.mp4` | `conceptB-FINAL.mp4` |
| Code | `src/projects/_client-sim/zambia-peacecorps/ZambiaConceptA.tsx` | `…/ZambiaConceptB.tsx` |
| Composition | `Zambia-ConceptA-Globe` | `Zambia-ConceptB-Continent` |
| Rendu | `npx remotion render` | ⛔ `./scripts/render-mapbox.sh` (WebGL) |
| Mouvement | 240/240 frames uniques | 228/240 |
| Self-review | 4/4 | 4/4 |

**Socle partagé** : `zambiaGeo.ts` (7 provinces du brief + 3 hors-brief en fond neutre, semis
déterministe lon/lat, interpolation des totaux) · GeoJSON régénérable par
`scripts/warmap/generate-zambia-admin1.py` (⚠️ `public/` est gitignoré).

## 📉 LE 1er RENDU, REJETÉ (`v1-rejete/`)

`traitementA.mp4` / `traitementB.mp4` — **jugés « prototype » par Aziz**. À garder comme point
de comparaison : c'est la mesure du progrès.
Ce qui n'allait pas : codé **sans storyboard** (mon idée, pas une proposition validée) · un seul
moteur (D3) alors que le choix client porte sur le registre · un carré de Zambie sur fond uni au
lieu d'une portion de film · des `<circle>` dessinés à la main alors que l'arsenal existait.

## 📐 ÉCARTS AU STORYBOARD — mesurés, pas jugés

| Écart | Avant | Après | Cible mesurée sur la case |
|---|---|---|---|
| A — terres du globe | RGB(61,82,115) | RGB(191,201,207) | RGB(194,203,209) |
| A — provinces actives | RGB(183,170,120) | tan appliqué | RGB(232,190,132) |
| A — hauteur du sujet | 60 % | **77 %** | 77 % |
| B — fond océan | RGB(9,9,9) | RGB(25,59,91) | RGB(21,53,82) |
| B — projection | 4/4 coins noirs (globe) | **0/4** (carte plate) | 0/4 |
| B — cartouche vs billes | 3,8× | **0,7×** | les billes portent le plan |
| B — largeur du sujet | 61 % | **72 %** | 73 % |

## 🔧 BRIQUES NÉES DE CETTE SESSION

- `scripts/tools/carto-selfreview.py` — vérif **mécanique** O/X d'une frame carto (projection,
  fond, cadrage, vide). Bloque en `exit 1`. ⚠️ `--attendu-fond` ne vaut que si le fond est visible
  aux bords (globe, carte large) — sur vue pleine il mesure les terres.
- `scripts/tools/make-comparatif-panel.py` — planche A/B : **une case ↔ une frame pleine taille**.
- `memory/fiches/FICHE-ARSENAL-SCENE.md` — ce qu'on POSSÈDE (les autres fiches disent la méthode).

## 🗂 STORYBOARDS & APPELS

Planches : `storyboard-v2/zambia2-{gemini,grok,gpt}.jpg` (v1 dans `storyboard/`).
Briefs + breakdowns + comparatifs : `memory/client-sim-tests/zambia-peacecorps/`.

## ⛔ CE QU'IL NE FAUT PAS REFAIRE

1. **Coder avant storyboard.** Le gate existait, je l'ai sauté.
2. **Comparer sur des vignettes** — Gemini ET Grok ont halluciné « 15-20 % du cadre » (réel : 61 %).
3. **Appliquer un point de modèle sans le vérifier** : 2 des 7 points reçus étaient nuisibles
   (violer l'interdit client, supprimer une décision d'Aziz) ; Grok a demandé d'afficher un « 150 »
   qu'il avait lui-même interdit 2 appels plus tôt.
4. **Laisser Mapbox choisir sa projection** : bascule en globe sous zoom ~5, silencieusement.
5. **Laisser `dark-v11` brut** : fond noir. Appeler `applyGeoAfriqueV5()`.
