# Carrousels hybrides animés — composants réutilisables

> Pipeline validé 2026-05-31 (Or Africain, 8 slides). Standard de qualité : V2.
> Doctrine + règles : `memory/doctrines/STRATEGIE-DISTRIBUTION-INSTAGRAM-2026.md`.

## Principe

Carrousel Instagram **4:5 (1080×1350)** dont chaque slide est un **fond animé propre** (matière réutilisée des vidéos Remotion/Mapbox, SANS overlays karaoké/labels) + **texte premium** par-dessus (charte navy/gold/ivory, serif).

⛔ **Source de vérité = transcript de la vidéo finale, JAMAIS `carousel-data.ts`** (peut contenir des chiffres pré-fact-check). Lire `whisper-words-*.ts` ou narration AVANT d'écrire les slides.

## Composants

| Fichier | Rôle | Type render |
|---|---|---|
| `CarouselSlideHybrid.tsx` | **Composant générique** : clip de fond (`OffthreadVideo`) + voile dégradé navy + texte premium + header (1 rangée de barres, PAS de "SLIDE X/8") + footer @koraetcartes. Props : `bgClip, highlight?, body, subtitle?, isHook?, slideIndex, totalSlides, textAnchor`. Mode `isHook` = titre éditorial + filets dorés. | Remotion normal |
| `CarouselCtaSlide.tsx` | Slide CTA statique : flèche play + **ligne 1 typewriter** (curseur clignotant) + ligne 2 fade-in. Props : `line1, line2, totalSlides`. | Remotion normal |
| `Beat1HookClean.tsx` | Fond Hook : compteur prix qui grimpe (fond parchemin), sans overlays. | Remotion normal |
| `CurveChartClean.tsx` | Fond data-viz : courbe exponentielle qui se dessine (aire + point de tête glow). Réutilisable toute "stat ascendante". | Remotion normal |
| `Beat3bMapClean.tsx` | Fond carte monde : 6 pays s'allument en rouge + Ghana or, sans overlays. | **render-mapbox.sh** |
| `GhanaMapClean.tsx` | Fond carte Ghana : drift + zoom, Ghana en or. | **render-mapbox.sh** |
| `AfriqueOuestMapClean.tsx` | Fond carte Afrique Ouest : Mali/Burkina/Niger orange + Ghana or. | **render-mapbox.sh** |

## Recette (1 slide animée)

1. Identifier la matière dans la vidéo source → re-render un fond PROPRE (composant `*Clean`) sans overlays.
   - Map → `./scripts/render-mapbox.sh <compId> public/_carousel-test/<nom>.mp4`
   - Graphique/compteur → `npx remotion render src/index.ts <compId> public/_carousel-test/<nom>.mp4`
2. Composer la slide : `<CarouselSlideHybrid bgClip="_carousel-test/<nom>.mp4" highlight=... body=... />` (texte ISSU du transcript vidéo).
3. Render la slide → `out/_r-and-d/carousel-hybrid/<slide>.mp4`.
4. Compositions enregistrées dans `src/Root.tsx` Folder `CarouselHybridTest` (à renommer par épisode quand on industrialise).

## Specs visuelles (V2)

navy `#16213a` · gold `#c8a951` · ivory `#f5efe0` · serif Georgia · highlight ~96px · corps ~52px ·
animation ~5s · padding bas **250px** (safe-zone IG : ~21% bas mangé par boutons d'action) · header 1 rangée de barres.

## Or Africain — référence (8 slides, validé)

Hook (compteur) → 5% (courbe) → 5%→12% (Ghana) → 6 pays (monde) → Signé (Afrique) → 4 pays (Afrique) → 1 signal (Ghana) → CTA typewriter.
Fonds dans `public/_carousel-test/or-*.mp4`. Slides dans `out/_r-and-d/carousel-hybrid/`.
