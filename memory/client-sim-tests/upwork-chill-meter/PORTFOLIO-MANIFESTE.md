# Portfolio Upwork EN — manifeste des livrables (2026-08-23)

> ⚠️ `out/` est **gitignoré**. Ce fichier est la seule trace de la correspondance
> pièce ↔ composition source. Le versionner si les MP4 doivent être reproductibles.
> Tout est en **1920×1080, muet, anglais**.

## Les 4 showcases (`UPWORK/showcases/`) — à mettre en TÊTE du portfolio

⭐ Upwork joue **5 à 10 s automatiquement au survol** quand la vidéo est en couverture :
le meilleur plan est en tête de chaque montage. Limite plateforme : **60 s max**.

| Fichier | Durée | Contenu (dans l'ordre) |
|---|---|---|
| `SHOWCASE-1-animated-maps.mp4` | 43 s | globe drapeaux+routes · carte drapeau Sénégal · Norvège · Congo · 2 registres sépia War-Map · globe faisceau |
| `SHOWCASE-2-narrative-scenes.mp4` | 37,5 s | réticules · 3 cibles prises · approche drone · impact · front qui pousse · défense antiaérienne |
| `SHOWCASE-3-data-and-objects.mp4` | 57 s | maison+courbe · **fracture du territoire (13 s)** · pièce à 2 faces · deux tuyaux · vanne |
| `SHOWCASE-4-motion-graphics.mp4` | 56,6 s | 11 registres : chiffre-choc · **lower third** · compteur · barres · morphing · cartes acteurs · radar · échelle · goulot · document caviardé · réseau |

Montés par `ffmpeg xfade` (fondus 0,4-0,6 s). ⛔ L'offset est cumulatif et chaque entrée doit passer
par `scale=1920:1080,setsar=1,fps=30` — cf. `memory/fiches/FICHE-ASSEMBLAGE.md`.

## Les 11 pièces isolées (`UPWORK/`)

| # | Fichier | Durée | Source |
|---|---|---|---|
| 01 | `01-animated-map-flag-fills.mp4` | 14 s | composition `Portfolio-EN-Senegal-Gisements` (Mapbox, rendu EN) |
| 02 | `02-narrative-three-positions.mp4` | 25 s | Soudan — prise des 3 positions Khartoum. ⚠️ rendu EN produit, **code source perdu** (cf. incident agents) |
| 03 | `03-country-comparison-map.mp4` | 21 s | composition `Portfolio-EN-Senegal-Comparaison` (Mapbox, rendu EN) |
| 04 | `04-data-from-the-object.mp4` | 10 s | `out/_r-and-d/acte5-maison-p1-mix.mp4` (aucun texte) |
| 05 | `05-two-faces-coin.mp4` | 20 s | `senegal-petrole-gaz-FINAL.mp4` @31,5 s (aucun texte) |
| 06 | `06-technical-blueprint.mp4` | 17,6 s | composition `Portfolio-EN-Gazoduc-Blueprint` (re-rendu HD — la source disque n'existait qu'en 960×540) |
| 07 | `07-balance-of-forces.mp4` | 9,5 s | Soudan `BlocImpasseB6`. ⚠️ rendu EN produit, **code source perdu** |
| 08 | `08-two-outcomes.mp4` | 19 s | `gazoduc acte5-FINAL.mp4` @26 s (aucun texte) |
| 09 | `09-flow-split.mp4` | 17 s | `gazoduc acte3-segmentC-verrou-FINAL.mp4` (label « MAROC » conservé) |
| 10 | `10-event-without-words.mp4` | 17 s | `soudan-midform-FINAL.mp4` @365 s (micro-label « NIL BLANC » conservé) |
| 11 | `11-territory-splits.mp4` | 14 s | `senegal-petrole-gaz-FINAL.mp4` @17,5 s — le territoire qui se fracture (aucun texte) |

**Vignettes** : `UPWORK/thumbnails/` et `UPWORK/showcases/thumbnails/`, choisies à la main après examen
de 5 candidats par vidéo. ⛔ Upwork prend sinon une frame au hasard — vécu : cartouche coupé au bord.

## Le code source des variantes EN

Commits `c2f51e6b` (scènes carto Sénégal), `3c7120cf` (12 compositions motion), `847668dc` (gazoduc).
Pattern : **prop `labels` avec défaut FR + constante `X_LABELS_EN` exportée** — les compositions de
production ne passent pas la prop, donc rendent à l'identique. Non-régression garantie par construction.

⛔ **Deux exceptions, pièces 02 et 07** : leur code de traduction a été détruit par un écrasement
entre deux agents parallèles (cf. `feedback_agents-paralleles-ecrasement-src-partage`). Les MP4 sont
bons et utilisables ; les re-rendre demanderait de refaire la passe de traduction.

## Ce qui a été volontairement EXCLU

Simulations client sans autorisation : **Zambie, Flowdesk, chill-meter/AbiGirl, NorthShield**.
Un travail techniquement réussi sur un concept qui appartient à quelqu'un d'autre ne se montre pas.
