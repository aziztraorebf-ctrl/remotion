# Consolidation Scout Souverain — V2 (extension batches 4-5)

> **Extension de CONSOLIDATION-V1.md** — lire V1 d'abord (batches 1-3, templates A-D lockés).
> Ce document couvre uniquement les 7 chaînes des batches 4 et 5.
> Mis à jour 2026-05-09. Scout COMPLET : 16/17 chaînes (Geopolitics Explained abortée = podcast).
>
> **DÉCISION FINALE ARBITRAGE TEMPLATES** : COMPLÉTÉ 2026-05-09 — voir Section V2-4 mise à jour.
> **JOUR 2 CODAGE** : Template B CartoCaspian V1 LIVRÉ + SmallMultiplesGrid V2 POC VALIDÉ — voir Section V2-8.

---

## SECTION V2-1 — Synthèse compacte batches 4-5 (7 chaînes)

| # | Chaîne | Catégorie | Verdict | Templates touchés | Top observation backlog |
|---|--------|-----------|---------|-------------------|--------------------------|
| 10 | **Le Monde** | Presse FR éditorial | 🟢 | E candidat 3 (source principale) | Système couches sémantiques cumulatives (1 concept = 1 layer translucide) + signature presse FR (serif + halftone océan + globe miniature) |
| 11 | **Africa Eye (BBC)** | Investigation OSINT TV | 🟢 (OSINT) / 🔴 (doc terrain) | E candidat 2 (consolide avec variante BBC) | Barre date rouge pleine largeur + OsintSplitScreen vertical 9:16 footage/satellite + annotation reveal séquentielle |
| 12 | **Johnny Harris** | Documentary handheld | 🟢 | F candidat (source principale) | Texture papier + micro-shake handheld 2-4px + tracés rouges dessinés progressivement (stroke-dasharray SVG) |
| 13 | **Geopolitics Explained** | ~~Scout abortée~~ | — | — | Chaîne = podcast audio statique logo fixe. 0% motion design. Skip définitif. |
| 14 | **Kurzgesagt** | Explainer vectoriel | 🟡 anti-modèle | Leçons système-couleur cross-templates | 3 leçons: saturation=donnée/désaturation=contexte ; wayfinder cross-templates ; flat color-block 3-4 zones prompt Gemini |
| 15 | **The Pudding** | Data-viz atypique | 🟢 | G candidat (source principale) | Grille SCRT (Same Composition Recoloured Temporal) N pays simultanés + palette nocturne mauve |
| 16 | **General Knowledge YT** | Hétérogène | 🟡 | F candidat (sous-variante) | Sous-variante "carnet scrapbook satirique" de F + tape jaune fluo + screenshot presse inline |
| 17 | **TLDR News Global** | Talking head + inserts | 🟡 | Leçons densité info | Portrait-dans-forme-géométrique + polaroid leader + BIG WORD overlay translucide (patterns ponctuels non-template) |

---

## SECTION V2-2 — Nouveaux candidats templates et briques

### Template E candidat 3 — "Le Monde Cartographique" (presse FR éditoriale)

**Source d'inspiration** : Le Monde (chaîne YouTube, 3 vidéos 2013-2025)

**ADN visuel** :
- **Projection** : Mercator standard, vue plane, aucun tilt
- **Fond carto** : gris-blanc minéral `#D8D8D8` / `#FFFFFF` (papier journal, pas de sombre)
- **Halftone océan** : pattern demi-teinte simulant texture presse papier (PNG overlay multiply)
- **Highlight pays** : rouge brique `#A04030` (conflits), terracotta `#D88B4A`, olive `#5A7A3A`, violet poussiéreux `#7A4A6A` — couches translucides cumulatives
- **Typo labels** : serif capitales (Le Monde journal : Plantin, IM Fell, ou Cormorant Garamond en fallback)
- **Wordmark italique** : "Le Monde Afrique" discret coin bas-gauche (à remplacer par "Souverain" pour nous)
- **Globe miniature** : miniature 120x120px coin haut-droit pour contextualisation géo (optionnel, Remotion `<Img>`)
- **Échelle km** : barre + chiffre sans-serif mono (attribut géo systématique)

**Signature unique non trouvée dans A-D** :
- Combo **serif labels + halftone océan + wordmark italique** = presse francophone éditoriale, introuvable ailleurs
- Système **couches sémantiques cumulatives** : chaque "acteur" (groupe ethnique, zone d'influence, zone d'attaque) = un layer translucide qui apparaît séquentiellement sans que la caméra bouge. Économie de mouvement, lisibilité maximale.

**Palette signature** :
| Élément | Hex | Notes |
|---|---|---|
| Fond carte | `#D8D8D8` ou `#FFFFFF` | Papier minéral, pas de dark mode |
| Océan halftone | `#B0C4CC` + overlay PNG | Simulation presse papier |
| Conflits/tensions | `#A04030` | Rouge brique, pas rouge vif |
| Zones positives | `#5A7A3A` (olive), `#D88B4A` (terracotta) | Ambivalence chromatique |
| Labels | `#1A1A1A` serif | Ancrage éditorial |

**Mood** : didactique éditorial FR, "Le Monde t'explique la carte", pédagogique sérieux sans militantisme

**Cas d'usage** : épisodes pédagogiques complexes (Sahel multi-acteurs, frontières contestées, récits géopolitiques en couches) où le *qui occupe quoi* est au coeur

**Faisabilité technique Mapbox** :
| Élément | Faisabilité | Méthode |
|---|---|---|
| Fond minéral clair | Direct | `land: "#D8D8D8"`, `water: "#B0C4CC"` |
| Halftone océan | Directe | PNG overlay Gemini avec pattern demi-teinte en blend mode `multiply` |
| Couches cumulatives | Directe | Remotion `<Sequence>` décalées + Mapbox `addLayer` fill par entité |
| Globe miniature | Directe | Composant Remotion `<Img>` screenshot monde |
| Labels serif | Directe | Web font + composant overlay |

**Différenciation vs B (Carto Caspian)** :
- B = géopolitique clean vecteur, fond crème/bleu pâle, sans-serif
- E3 = éditorial presse FR clair, serif, halftone, couches cumulatives explicatives

**Verdict** : CANDIDAT FORT. Seul candidat natif francophone. Compatible ADN Souverain.

---

### Template F candidat — "Carnet Reporter" (texture organique)

**Source d'inspiration** : Johnny Harris (principal) + General Knowledge Sahel Confederation (sous-variante)

**ADN visuel** :
- **Fond** : texture papier ivoire scannée `#E8E0CD` (Gemini i2i, multiply blend)
- **Accents** : rouge terracotta `#C82828` + hachures graphite `#4A4540`
- **Cartes** : hachures crayon + frontières stylo bille (trait irrégulier), ZÉRO frontière vecteur clean
- **Typo** : Cormorant Garamond / IM Fell DW Pica pour labels + slab serif antique pour titres
- **Micro-shake** : translation handheld 2-4px permanente sur tout (seedé sur frame)
- **Tracés dessinés** : SVG path stroke-dasharray animé (révèle progressivement un trajet géopolitique)
- **Ken burns** : lent sur cartes statiques + tilt 5-10° "carte posée sur bureau"

**Sous-variante F2 "Carnet scrapbook satirique"** (General Knowledge video-2-sahel-confederation) :
- Même fond kraft mais avec cartoon aplat (silhouettes pays couleur saturée) + tape jaune fluo labels + screenshot presse collé + bulles dialogue BD
- Plus dense visuellement que F1 Harris, ton plus léger/satirique

**Mood** : intimiste "je t'emmène dans mon enquête", documentaire authenticité, terrain/reporter

**Cas d'usage** : épisodes narratifs à forte composante géographique (mines uranium Niger, routes contrebande or Mali, blocus carburant) où l'authenticité prime sur la sophistication graphique

**Faisabilité** :
| Élément | Faisabilité | Méthode |
|---|---|---|
| Texture papier | Directe | PNG Gemini + blend multiply Remotion |
| Micro-shake | Directe | `Math.sin(frame * 0.7) * 2` + random seedé |
| Tracés dessinés | Directe | SVG path + `strokeDashoffset` interpolate |
| Hachures | Moyenne | Texture Gemini overlay OU PixelLab map_object |

**Blocage identifié** : avant tout épisode F, POC obligatoire — appliquer overlay texture + micro-shake sur composition Mapbox existante (Or Africain Beat 2) pour valider que le rendu "respire" correctement.

---

### Template G candidat — "Grille SCRT" (data-viz multi-pays)

**Source d'inspiration** : The Pudding (video "The Loneliness Epidemic" pattern principal)

**ADN visuel** :
- **Structure** : grille de 12-16 vignettes pays identiques (même composition pour chaque pays)
- **Différenciation** : couleur de remplissage synchronisée à une métrique (prix matière, dette, balance, PIB per capita)
- **Palette nocturne** : `#241B33` fond mauve + `#9C7BB5` accent violet + `#F4A03B` highlight orange (sujets sombres : extraction, fuite capitaux, économie souterraine)
- **Métronome narratif** : un seul chiffre HUD top-right qui avance (année, $, tonnes) — ancrage temporel
- **Chart sur grille** : courbe vectorielle dessinée par-dessus mosaïque de drapeaux (50+ tiles possibles)

**Signature unique** : la **densité parallèle** — N pays montrés simultanément avec animation par couleur. Aucun template A-F ne couvre ce cas. Force narrative = "regarde TOUS ces pays subir la même chose en même temps."

**Palette signature** :
| Élément | Hex | Notes |
|---|---|---|
| Fond | `#241B33` | Mauve nocturne — sujets nuit économique |
| Vignette neutre | `#3A2E4A` | Pays non-focus |
| Highlight | `#F4A03B` | Pays en valeur (peak/nadir) |
| Accent violent | `#E83D2E` | Signaux d'alerte (dette max, extraction peak) |
| Texte labels | `#E8DFF5` | Blanc lavande lisible |

**Mood** : data-journalism comparatif brutal, "les chiffres sont accablants", densité informative assumée

**Cas d'usage** : sujets "comparaison multi-pays brutale" (54 pays africains + matières premières, dette extérieure vs ressources, balance commerciale Chine-Afrique)

**Composant Remotion à créer** :
- `<GridSCRT countries={[...]} metric={fn(country, frame)} />` — wrapper générique
- `<MetronomeHUD year={currentYear} />` — ancrage temporel
- `<ChartOnGrid data={[...]} />` — courbe sur mosaïque

**Faisabilité** : haute — 100% Remotion, zéro Mapbox requis. Premier épisode test : 54 pays africains + % de ressources extractives en PIB.

---

## SECTION V2-3 — Leçons cross-templates (batches 4-5)

### Leçon Kurzgesagt 1 — Saturation = donnée / désaturation = contexte

**Règle extraite** : dans les vidéos sur sujets graves/réels, désaturer les scènes de contexte (cartes, archives), réserver la saturation pure (rouge, or, vert flag) uniquement aux **chiffres-clés et marqueurs narratifs**.

**Application Souverain** : dans templates B, C, et tout candidat E/F/G, différencier visuellement "scène de contexte" (atténuée) vs "chiffre qui frappe" (saturé). Créer convention dans chaque manifest.

**Règle à ajouter** : `memory/rules-souverain-editorial.md` Section 2.

---

### Leçon Kurzgesagt 2 — Wayfinder cross-templates

**Observation** : Kurzgesagt = identité forte malgré sujets radicalement différents grâce à 3 éléments fixes répétés (background signature + pastille chapitre + ribbon titre).

**Application Souverain** : nos templates A-G risquent la fragmentation perçue. Proposer un **wayfinder unique cross-templates** :
- Micro-pastille verte panafricaine (`#3A7A3A`) + numéro acte en bas-droit
- Wordmark "Souverain" discret coin bas-gauche identique cross-templates
- Aucun autre élément cross-template — laisser chaque template sa personnalité

**Note** : à valider par Aziz avant d'implémenter (décision éditoriale).

---

### Leçon TLDR — Densité statique > montage rapide

**Observation** : TLDR atteint 9-12 unités d'info par plan sans accélérer le rythme de coupe — via superposition de couches (carte + portrait dans forme géométrique + chiffre flottant) tenues 4-5s.

**Application Souverain Short** : possible d'augmenter densité info SANS accélérer pacing. Modèle "3 couches empilées tenues 4s" > "3 coupes rapides 1.3s". La voix-off reste posée éditoriale, l'écran travaille.

**Anti-pattern TLDR** : leurs cartes "rapides tabloid" = légende — no patterns à voler directement. Aller chercher pacing density chez PolyMatter et Vox plutôt.

---

### Leçon Africa Eye — Template E reste UNE famille, deux accents

**Observation** : Africa Eye CONSOLIDE Template E (OSINT investigation) sans l'éclater en template séparé. Points communs NYT VI + Africa Eye : satellite Google Earth, annotations rouges, match-cut footage/satellite, pop-in séquentiel.

**Différence principale** : rouge BBC `#D0021B` trop signature BBC. Pour Souverain Template E : utiliser rouge propre `#C03028` (entre NYT et BBC, distinctif).

**Brique `<OsintSplitScreen>`** : nouveau composant à créer — footage UGC vertical (haut 9:16) + satellite Mapbox (bas) + bande séparatrice 6px `#C03028` + arc rouge connectant détail entre les deux.

---

## SECTION V2-4 — État complet des candidats (arbitrage Aziz)

### Templates lockés (DÉCIDÉS, ne pas revenir dessus)
| Template | Source | Statut |
|---|---|---|
| A — Or Africain V5 | Existant | LOCKED production |
| B — Carto Caspian | Caspian Report | ✅ CODÉ V1 — `src/projects/_shared/mapbox/templates/CartoCaspian.tsx` |
| C — Atlas réaliste 3D | RealLifeLore + Wendover + Vox | LOCKED V1, à coder |
| D — WonderWhy beige épuré | WonderWhy | LOCKED V1, à coder |

### Candidats en arbitrage (DÉCISION AZIZ REQUISE)

**Option 1 — Adopter Template E "Investigation OSINT"** (NYT VI + Africa Eye consolidés)
- Pour : ADN Souverain-natif (rigueur OSINT, transparence sources), distinct A-D, reproductible 100%
- Contre : demande footage satellite Google Earth qu'on n'a pas (contournement : Mapbox satellite mode)
- Niveau effort : moyen. Composants nouveaux : `<OsintSplitScreen>`, `<OsintAnnotation>`, `<DateBar>`

**Option 2 — Adopter Template E3 "Le Monde Cartographique"**
- Pour : seul template natif francophone, pédagogique (épisodes Sahel multi-acteurs), palette claire (alternative au dark)
- Contre : moins dramatique/impactant que OSINT, rythme plus lent
- Niveau effort : moyen-bas. Composants : palette Mapbox `D8D8D8`, overlay halftone Gemini PNG, system couches

**Option 3 — Adopter Template F "Carnet Reporter"** (Johnny Harris)
- Pour : identité journalistique forte, très différencié A-D, compatibilité ton Souverain
- Contre : POC obligatoire avant (risque technique texture multiply + shake), nécessite bibliothèque textures
- Niveau effort : moyen. POC = 1 session R&D dédiée avant premier épisode

**Option 4 — Adopter Template G "Grille SCRT"** (The Pudding)
- Pour : pattern unique non couvert A-F, high impact comparaison multi-pays, 100% Remotion
- Contre : très niche (sujets "comparaison brutale 54 pays"), risque infodump si mal dosé
- Niveau effort : moyen. Composants génériques à créer, mais logique simple.

**Option 5 — Conserver candidat E1 "PolyMatter rouge mandarin"**
- Pour : impactant, punchy, très reconnaissable
- Contre : risque "rouge = jugement moral subliminal" (règle Souverain), chevauchement Or Africain V5 sur sujets dark premium
- Niveau effort : bas (design clair). Risque éditorial : élevé.

---

## SECTION V2-5 — Backlog tests batches 4-5 (priorisé)

### Haute priorité (à intégrer section 5 CONSOLIDATION-V1)

| # | Test | Source | Effort |
|---|---|---|---|
| A | Couches sémantiques cumulatives Mapbox | Le Monde | ~45 min |
| B | Overlay halftone océan (texture presse) | Le Monde | ~20 min (Gemini PNG) |
| C | Composant `<OsintSplitScreen>` | Africa Eye + NYT VI | ~45 min |
| D | Composant `<DateBar>` pleine largeur | Africa Eye | ~15 min |
| E | Micro-shake handheld seedé sur frame | Johnny Harris | ~20 min |
| F | Tracés SVG dessinés progressivement | Johnny Harris | ~30 min |
| G | Grid `<GridSCRT>` prototype 12 pays | The Pudding | ~60 min |

### Moyenne priorité

| # | Test | Source | Effort |
|---|---|---|---|
| H | Wayfinder cross-templates (pastille acte) | Kurzgesagt leçon | ~30 min |
| I | Règle flat color-block 3-4 zones dans prompts Gemini | Kurzgesagt leçon | ~0 min (convention) |
| J | Portrait-dans-forme-géométrique-couleur | TLDR | ~20 min |
| K | Polaroid leader + drapeau-pastille sur carte | TLDR | ~20 min |

---

## SECTION V2-6 — Pointeurs fichiers batches 4-5

- `par-chaine/le-monde/_summary.md` — chaîne 10
- `par-chaine/africa-eye/_summary.md` — chaîne 11
- `par-chaine/johnny-harris/_summary.md` — chaîne 12
- `par-chaine/geopolitics-explained/` — abortée (podcast statique)
- `par-chaine/kurzgesagt/_summary.md` — chaîne 14 (anti-modèle + leçons)
- `par-chaine/the-pudding/_summary.md` — chaîne 15
- `par-chaine/general-knowledge/_summary.md` — chaîne 16
- `par-chaine/tldr-news-global/_summary.md` — chaîne 17

---

## SECTION V2-7 — Moodboard V2 (frames à ajouter)

> Moodboard V1 existant : https://open-mirage-fpj4.here.now/ (10 sections, locked)
> Moodboard V2 doit ajouter : E candidat 3 (Le Monde), F candidat (Johnny Harris), G candidat (The Pudding)

### Frames candidates moodboard V2

**Template E3 Le Monde** :
- `le-monde/video-2-mali-5min/frame-025-azawad-rebellion-stars.jpg`
- `le-monde/video-2-mali-5min/frame-035-aqmi-zone-action.jpg`
- `le-monde/video-3-russie-armes-afrique/frame-010-afrique-or-globe-noir.jpg` (clin d'œil Or Africain)

**Template F Carnet Reporter** :
- `johnny-harris/video-1-europe-stole-africa/frame-005-paper-map-1800-empires.jpg`
- `johnny-harris/video-3-ignored-war/frame-015-hatched-map-eritrea-yemen-trade-lines.jpg`
- `johnny-harris/video-3-ignored-war/frame-320-red-shipping-routes-egypt-callout.jpg`

**Template G Grille SCRT** :
- `the-pudding/video-2-loneliness-epidemic/frame-005-grid-twilight-purple.jpg`
- `the-pudding/video-2-loneliness-epidemic/frame-003-grid-sunset.jpg`

**General Knowledge (sous-variante F2)** :
- à vérifier : `general-knowledge/video-2-sahel-confederation/frame-014-tape-jaune.jpg` si existe

---

## SECTION V2-8 — Résultats Jour 2 codage (2026-05-09)

### Template B — CartoCaspian V1 LIVRÉ ✅

| Item | Statut | Détail |
|---|---|---|
| `CartoCaspian.tsx` | ✅ | `src/projects/_shared/mapbox/templates/CartoCaspian.tsx` |
| `applyCartoCaspian(map)` | ✅ | Override ocean `#bcd5e3`, terre `#ede5d3`, borders `#5a5a5a` 0.5px, removeLabels |
| `CASPIAN_PALETTE` | ✅ | or `#d4a93c`, terracotta `#a05a3a`, indigo `#3a4a6a` |
| `CartoCaspianOverlay` | ✅ | PNG grain overlay multiply 0.08 (fallback gracieux si PNG absent) |
| Demo composition | ✅ | `CartoCaspianDemo` — Mercator plat, Niger or + Algérie indigo, LeaderPin, cartouche éditorial |
| Render catbox | ✅ | https://files.catbox.moe/cho609.mp4 |
| Validation Aziz V1 | ✅ | "Couleurs bien visibles, nom des pays pop bien, intéressante" |

**V2 à faire (session dédiée via jury LLM)** :
- Légère teinte océan (plus bleutée) — testé : `#2a4a6a` op 0.45 OK, `satellite-streets-v12` OK, hillshade OK
- Palette continents légèrement plus chaude (garder crème unique)
- Grain texture PNG à générer (Gemini) et positionner dans `public/souverain/_shared/textures/`

---

### Insert SmallMultiplesGrid — POC V2 VALIDÉ concept ✅

| Item | Statut | Détail |
|---|---|---|
| `SmallMultiplesGrid.tsx` | ✅ | `src/projects/_shared/components/inserts/SmallMultiplesGrid.tsx` |
| Variante `cream` | ✅ | Fond crème clair, courbes violet sombre |
| Variante `kraft` | ✅ | Fond kraft affirmé brun chaud |
| Portraits Gemini | ✅ | `public/souverain/_shared/avatars/niger/mali/burkina-portrait.png` (B&W editorial) |
| Background kraft | ✅ | `public/souverain/_shared/textures/bg-kraft-affirme.png` |
| Background cream | ✅ | Via Gemini (généré en session) |
| Demos Root.tsx | ✅ | `Insert-SmallMultiplesGridDemoA-Cream` + `Insert-SmallMultiplesGridDemoB-Kraft` |
| Validation Aziz | ✅ POC | Concept validé. Prouve que ça marche. |

**Retours Aziz session 2026-05-09 — à traiter session dédiée polish (jury LLM)** :

**Template C — Atlas Réaliste 3D** :
- Océan trop sombre : 3 variantes testées (bleu-acier overlay / satellite-streets-v12 / hillshade). Showcase : https://files.catbox.moe/19qk2e.mp4
- Haut continent africain (Sahara) apparaît trop sombre dans tous les modes — à investiguer (possible artefact satellite naturel ou layer mal appliqué)
- Esthétique sombre = fait partie du look, mais risque "template générique". Différenciation à trouver
- Session V2 : améliorer océan + luminosité Sahara + tester hillshade seul sans overlay gris monde

**Template D — KraftCard** :
- Option 3 (fond narratif) = préféré Aziz. Mais : portrait en fond ET portrait en avant-plan = trop redondant
  → V2 : remplacer fond par quelque chose de différent : fond plein coloré, drapeau du pays, ou texture géographique
- Option 2 (magazine cover) : fond noir pur ne fonctionne pas visuellement
  → V2 : remplacer le fond noir par drapeau plein écran flou OU couleur saturée du pays
- Option 1 (cadre collection premium) : intéressant mais tout trop petit
  → V2 : doubler la taille de l'image du drapeau et des sous-titres
- Showcase catbox : https://files.catbox.moe/mf6bgg.mp4

**SmallMultiplesGrid bugs connus** :
- Labels pays coupés par l'avatar (overlap layout)
- Annotations text coupées à droite
- Dates bas peu visibles (contraste faible)
- Portrait pas assez espacé du nom pays

---

## Notes pour la prochaine session

**État scout** : COMPLET (16/17 chaînes, Geopolitics Explained abortée = podcast).
**État codage Jour 2** : Template B ✅ + SmallMultiplesGrid POC ✅

**Prochaines étapes Jour 3** :
1. Choisir prochain composant : Template C (Atlas 3D), Template D (WonderWhy KraftCard), ou insert ComparisonTable/EntityDiagram
2. Pour Template C : demander 2 frames Wendover depuis le moodboard (mask country + tilt 3D) avant de coder
3. Pour Template D : demander 1 frame WonderWhy "kraft flag card" avant de coder KraftCard
4. SmallMultiplesGrid V3 polish : session dédiée avec Kimi review visuelle post-render
5. CartoCaspian V2 : grain texture PNG + palette océan légèrement plus chaude
