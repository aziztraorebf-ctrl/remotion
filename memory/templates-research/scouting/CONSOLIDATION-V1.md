# Consolidation Scout Souverain — V1 (batches 1-3)

> **Source de vérité unique** pour les décisions templates Souverain.
> Mis à jour 2026-05-09. À regénérer en V2 après batches 4-5.
> Lecture estimée : 15-20 min mobile (mode détaillé).

---

## SECTION 1 — État global

### Avancement scout
- Chaînes scoutées : **9/17** (batches 1, 2, 3)
- Chaînes restantes : 8 (batches 4, 5 en auto-pilote)
- Stratégie en cours : auto-pilote + résumés 3 lignes par chaîne, sans dashboard intermédiaire

### Templates émergents
| Template | Source d'inspiration | Statut | Verdict |
|---|---|---|---|
| **A — Or Africain V5** | Existant (épisode 1) | LOCKED | Production en cours |
| **B — Carto Caspian** | Caspian Report (raffiné après captures Aziz) | LOCKED V1 | Hex codes définis, faisabilité 100% |
| **C — Atlas réaliste 3D** | RealLifeLore + Wendover + Vox (consolidé) | LOCKED V1 | Vocabulaire commun confirmé |
| **D — WonderWhy beige épuré** | WonderWhy | LOCKED V1 | 2 mécaniques validées Aziz |
| **E candidat 1 — PolyMatter rouge mandarin** | PolyMatter | EN ARBITRAGE | Risque "rouge = jugement moral subliminal" |
| **E candidat 2 — Investigation OSINT** | NYT VI | EN ARBITRAGE | Annotation-driven distinct de C |

### Briques visuelles validées (cross-templates)
| Brique | Source | Compatibilité |
|---|---|---|
| `<MapGlobeGrid>` | Map Men "Panama flat flags" | B, C (cold open), D |
| `<KraftCard>` | WonderWhy "kraft flag card" | A (variante), B (variante), D (pilier) |
| `<LeaderPin>` | Caspian Report (déjà codé `MarqueurPortrait`) | A, B, C, D |
| `<NewsClipping>` | Caspian Report (à coder ~20min) | A, E |
| `<ResourcesScrollTable>` | Caspian Report (à coder ~45min) | A, E |
| `<BigStat>` | Vox | A, B, C |
| `<PillCityLabel>` | Vox | B, C |

---

## SECTION 2 — Templates Souverain (locked + candidats)

### Template A — "Or Africain V5" (LOCKED, existant)

**ADN visuel** :
- Palette : noir `#0a0a0a` + or `#f5d547` + accents orange/rouge/blanc
- Mood : ledger financier, autorité économique posée, sérigraphie premium
- Cas d'usage : épisodes data-journalism financier, accords miniers, royalties, contrats

**Source** : Épisode 1 livré (manifest.ts existant `src/projects/souverain/or-africain/`)

**Briques compatibles** : `<KraftCard>` variante "papier ardoise" pour insert ponctuel

**Note** : risque saturation broadcast confirmé par scout Bloomberg — Bloomberg utilise exactement la même triade navy+or, donc on est dans un registre TV news codifié. Garder comme template signature mais ne pas multiplier les variantes proches.

---

### Template B — "Carto Caspian" (LOCKED V1)

**Source d'inspiration** : Caspian Report

**ADN visuel raffiné après captures Aziz 2026-05-08** :

| Élément | Hex / valeur | Notes |
|---|---|---|
| Océan | `#bcd5e3` (cible) | Bleu pâle uni avec léger grain (pas aquarelle full Caspian) |
| Continents | `#ede5d3` à `#f5f0e6` | Crème/blanc cassé |
| Frontières | `#5a5a5a` opacity 0.6 weight 0.5px | Trait fin |
| Highlight pays | Palette Souverain : or `#d4a93c`, terracotta `#a05a3a`, indigo `#3a4a6a` | Pas de pastel multi-pays Caspian |
| Labels pays | AUCUN | Règle Aziz lockée cross-templates |

**Sous-décisions Aziz lockées** :
- **Texture océan** : aplat + grain subtil (pas aquarelle full) — éviter POC coûteux
- **Densité** : épuré Souverain (1 pays + 1-2 pins max), pas la frame 2 Caspian chargée

**Faisabilité technique Mapbox** :
| Élément | Faisabilité | Méthode |
|---|---|---|
| Océan bleu pâle | Direct | `setPaintProperty("water", "fill-color", "#bcd5e3")` |
| Continents crème | Direct | `applyGeoAfriqueV5` modifié `land: "#ede5d3"` |
| Frontières fines | Direct | `setPaintProperty("admin-0-boundary", ...)` |
| Grain texture | Direct | PNG Gemini overlay blend `multiply` opacity 0.08 |
| Highlights | Direct | `addCountryHighlight` existant |
| Pas de labels | Direct | `removeLabels` existant |

**Mood** : géopolitique narrative, contextuelle, atlas vintage moderne

**Cas d'usage** : épisodes géopolitique (Sahel, blocus, récidive), narratif chronologique

**Code à créer post-scout** :
- `src/projects/_shared/mapbox/templates/CartoCaspian.tsx` : composant qui applique le style B
- `public/souverain/_shared/textures/grain-paper-bcd5e3.png` : grain généré Gemini, réutilisé cross-épisodes

**Briques compatibles** : `<MapGlobeGrid>` (variante palette ivoire+bleu), `<KraftCard>` (variante ivoire pour personae), `<LeaderPin>`, `<NewsClipping>`

---

### Template C — "Atlas réaliste 3D" (LOCKED V1)

**Sources d'inspiration consolidées** : RealLifeLore + Wendover + Vox

**ADN visuel** :
- **Style Mapbox** : `satellite-v9` avec hue/saturation/brightness baissées (désaturé)
- **Projection** : Mercator standard
- **Pitch** : 0° (vue plate) ou 50-65° (vue oblique tilt 3D)
- **Mask country shape** : silhouette du pays focus en satellite couleur, reste du monde gris désaturé `#3a3f44` — signature forte Wendover
- **Cartouches noirs** : `#0a0a0a` 80% opacité + 1px stroke or `#E8B33A` + texte blanc capitales
- **Drapeaux pins SVG** : tige + ombre légère (style Map Men + Wendover)
- **Accents narratifs** : 1 unique par scène (or, terracotta, ou indigo selon Souverain)

**Mood** : analytique géopolitique news-style, "expert sur le terrain"

**Cas d'usage** : épisodes territoire/terrain (mines, frontières physiques, ressources géologiques, chaînes logistiques)

**Faisabilité technique Mapbox** :
| Élément | Faisabilité | Méthode |
|---|---|---|
| Satellite désaturé | Direct | `setPaintProperty("satellite", "raster-saturation", -0.3)` |
| Mask country | Moyenne | Layer `fill` couleur saturée pour pays focus + layer overlay gris semi-transparent partout ailleurs |
| Tilt 3D oblique | Direct | `pitch: 60` + `flyTo` Mapbox |
| HUD timestamp + coords | Direct | Composant Remotion overlay |

**Code à créer post-scout** :
- `src/projects/_shared/mapbox/templates/AtlasRealiste3D.tsx`
- Composant `<CountryMask iso="MLI">` — pattern signature Wendover

**Briques compatibles** : `<MapGlobeGrid>` (cold open avant tilt), `<LeaderPin>`, `<BigStat>`, `<PillCityLabel>`

---

### Template D — "WonderWhy beige épuré" (LOCKED V1)

**Source d'inspiration** : WonderWhy

**ADN visuel** :
- **Fond** : texture papier kraft beige `#d9c8a4` (variantes possibles : papier gris, ardoise, ivoire selon ton)
- **Centre** : drapeau, portrait Gemini, ou objet isolé (taille ~30% hauteur)
- **Polygones territoires** : remplis couleur plate alpha ~0.6-0.7 qui mute dans le temps
- **Drapeaux SVG plats** omniprésents comme avatars d'États
- **Bulles dialogue** style "diplomatique BD" pour faire parler les États
- **Labels** : sans-serif noir sous l'asset

**Mood** : pédagogique, documentaire-cours, didactique chaleureux, sobre

**Cas d'usage** : épisodes pédagogiques (avant/après nationalisation, qui contre qui, frontières géopolitique territoriale)

**2 mécaniques validées Aziz 2026-05-08** :

1. **Morph chromatique chronologique** : un même territoire passe de couleur "colonie" → "indépendance" → "nationalisation" → "concession étrangère" sans que la caméra bouge. Lerp `fill-color` Mapbox via Remotion `interpolateColors`. Coût ~30 min.

2. **Drapeau-qui-parle** : drapeau SVG + bulle dialogue avec citation directe. Évite les portraits humains, évite la moralisation, garde la lisibilité. Cas d'usage Souverain : France vs Niger sur uranium, BHP vs Mali, ONU vs Maroc.

**Faisabilité technique** :
| Élément | Faisabilité | Méthode |
|---|---|---|
| Fond papier | Direct | PNG Gemini texture kraft, en `<AbsoluteFill>` |
| Drapeau-qui-parle | Direct | Composant Remotion : `<Img>` drapeau + `<SpeechBubble>` SVG |
| Morph chromatique | Direct | `interpolateColors` Remotion + Mapbox `fill-color` setter par frame |

**Code à créer post-scout** :
- `src/projects/_shared/components/KraftCard.tsx` (brique transversale)
- `src/projects/_shared/components/SpeakingFlag.tsx`
- `src/projects/_shared/mapbox/animations/chromaticMorph.ts`
- `public/souverain/_shared/textures/kraft-paper-d9c8a4.png`

**Briques compatibles** : `<KraftCard>` (pilier), `<MapGlobeGrid>` (variante beige)

---

### Template E candidat 1 — "PolyMatter rouge mandarin" (EN ARBITRAGE)

**Source d'inspiration** : PolyMatter

**ADN visuel** :
- **Fond** : rouge plein `#A41E22` (signature monolithique) ou variante rouge-brique `#8E2A26` plus terreux
- **Accents** : jaune `#F4D24A` (underlines, étoiles), cyan `#3FC3CD` (oppositions), orange `#F4A93C` (négatif/échec)
- **Typo** : slab condensed bold pour titres + sans-serif pour labels
- **Country pills** : rectangle plein couleur sous nom de pays
- **Drapeaux comme texture de remplissage** des pays sur cartes (Mapbox `fill-pattern`)
- **Flat dark silhouette icons** (avion, sous-marin, soldat) noir/blanc uniquement

**Mood** : autoritaire branded, ton documentaire premium punchy

**Cas d'usage proposé** : sujets géopolitiques chargés (sanctions, blocs économiques, oppositions de camp)

**Risque identifié par scout** : "rouge plein peut se lire agressif/jugement moral subliminal" → contredit règle Souverain. Solution : variante rouge-brique terreux.

**Verdict en attente** : à arbitrer avec Aziz. Choix : adopter (avec variante terreux), pas adopter, ou tester en POC court.

---

### Template E candidat 2 — "Investigation OSINT" (EN ARBITRAGE)

**Source d'inspiration** : NYT Visual Investigations

**ADN visuel** :
- **Palette** : `#000000` dominant + accent rouge `#e63d2e` + vecteurs bleu/orange/rouge codés par entité + satellite vert/bleu en couche carto
- **Typo** : sans-serif blanc ALL CAPS pour labels, **serif italique large-tracked** pour annotations carto, monospace pour timestamps
- **Assets canoniques** : cadre vertical flottant, bandeau source, échelle miles, date stamp, flèches dashed, vector entities, diagramme ledger
- **Mouvements** : push-in lent, pop-in séquentiel 0.6s, Ken Burns 0.5%/s, coupes sèches uniquement (zéro effet fancy)

**Distinction par rapport à Template C** : Template C est carto-driven (relief, satellite stylé). Template E "OSINT" est **annotation-driven** (la carte est un substrat, ce qui compte ce sont les couches qui se posent : dashed arrows, icônes événement, date stamps).

**Cas d'usage** : épisodes "qui possède quoi" (mines, sociétés écran), traçage flux d'argent, géolocalisation événements datés, présentation de preuves documentaires

**Synergies** : Template A (peut emprunter `#000000` + rigueur ledger), Template C (vit côte-à-côte, pas en remplacement)

**Mon avis honnête (Claude)** : NYT VI est plus aligné avec l'ADN Souverain (rigueur Fact-Sheet, sources visibles, transparence éditoriale) que PolyMatter (look pop/punchy plus risqué).

**Verdict en attente** : à arbitrer avec Aziz. Choix : adopter, ou garder en backlog comme "patterns à voler" sans en faire un template entier.

---

## SECTION 3 — Briques visuelles validées (détail)

### Brique `<MapGlobeGrid>` (issue de Map Men)

**Description** :
- Fond gris foncé + grille latitude/longitude (illusion globe)
- Continents en blanc plat / gris clair (forme épurée, pas de relief)
- Pays mis en valeur en couleur saturée (palette Souverain)
- Drapeau monté sur mât avec ombre légère
- Label pays sans-serif bold + sous-label optionnel parenthésé "(NOT COLOMBIA)"

**Faisabilité Mapbox** : haute. Graticules via custom layer Mapbox, country_boundaries filtré par ISO, drapeau-sur-mât = SVG overlay Remotion.

**Rejet explicite Aziz** : pas de pastel total Map Men → garder grammaire mais palette Souverain.

**Compatibilité templates** : B (palette ivoire+bleu), C (cold open avant tilt), D (pilier).

---

### Brique `<KraftCard>` (issue de WonderWhy)

**Description** :
- Fond texture papier (kraft beige par défaut, variantes : papier gris, ardoise, ivoire)
- Centre : drapeau, portrait Gemini, ou objet isolé (~30% hauteur)
- Nom/label sans-serif sous l'asset
- Bulle de dialogue optionnelle (style diplomatique BD)
- Footnote optionnel (date, source, précision honnête)

**Faisabilité Remotion** : 100%. Pas de Mapbox requis. Texture papier = PNG Gemini.

**Note Aziz** : "Parfait pour représenter des objets, drapeaux, portraits."

**Compatibilité templates** : A (variante ardoise insert), B (variante ivoire), D (pilier).

---

### Brique `<LeaderPin>` (issue de Caspian Report)

**Description** :
- Portrait rond + drapeau rond + label "PRO-X"
- Ombre légère sous le pin
- Scale-in spring à l'apparition

**Statut code** : ✅ EXISTE déjà dans `src/projects/poc-mapbox-tests/MapboxMarqueursV2.tsx` (composant `MarqueurPortrait`). À promouvoir vers `_shared/mapbox/` au moment d'utiliser.

**Compatibilité** : tous templates avec carte Mapbox.

---

### Brique `<NewsClipping>` (issue de Caspian Report)

**Description** :
- Fond noir charbon
- Titre serif rouge `#a63232` (Playfair Display)
- Sous-titre sans-serif blanc
- Date en monospace
- Pattern "press evidence" pour citer sources institutionnelles à l'écran

**Faisabilité** : haute, ~20 min code.

**Compatibilité templates** : A (insert preuve), E "OSINT".

---

### Brique `<ResourcesScrollTable>` (issue de Caspian Report)

**Description** :
- Fond chalkboard noir
- Tableau scroll vertical lent
- Bandeau jaune qui descend item par item highlightant la ligne courante
- Colonnes : nom ressource | % production | usage industriel

**Faisabilité** : haute, ~45 min code.

**Compatibilité templates** : A (variante ledger), E "OSINT".

---

### Brique `<BigStat>` (issue de Vox)

**Description** :
- Chiffre géant blanc/or bold scale-in spring + label dessous
- Posable sur footage live, carte Mapbox, ou fond plat
- Signature Vox la plus reproductible

**Faisabilité** : haute, ~30 min code.

**Compatibilité templates** : A, B, C.

---

### Brique `<PillCityLabel>` (issue de Vox)

**Description** :
- Pill noir arrondi + texte blanc bold + queue pointeur courte vers la ville
- Plus propre que les labels Mapbox natifs

**Faisabilité** : directe via Remotion `<AbsoluteFill>` + Mapbox project().

**Compatibilité templates** : B, C.

---

## SECTION 4 — Synthèse compacte par chaîne (9 chaînes batches 1-3)

| # | Chaîne | Catégorie | Verdict | Templates touchés | Top observation backlog |
|---|--------|-----------|---------|-------------------|--------------------------|
| 1 | **Caspian Report** | Cartographie/géopolitique | 🟢 | B (source principale), E "OSINT" (NewsClipping) | Palette ivoire+bleu pâle Caspian (Aziz a validé pour Template B) |
| 2 | **Map Men** | Cartographie 2D flat | 🟢 | D (Brique MapGlobeGrid) | Pen-stroke SVG animé pour frontières contestées + pattern minimaliste "carte page de manuel" |
| 3 | **RealLifeLore** | Cartographie/géopolitique | 🟢 | C (consolide) | Module "Portrait Pin + Stat Grid" (dataviz character-driven) + style "Satellite désaturé + cartouches noirs" |
| 4 | **Vox** | Motion design éditorial | 🟢 | A (variante navy/or), C (BigStat + PillCityLabel) | Composant `<BigStat>` chiffre géant scale-in (signature reproductible) |
| 5 | **WonderWhy** | Cartographie pédagogique | 🟢 | D (source principale) | Morph chromatique chronologique + drapeau-qui-parle |
| 6 | **Wendover Productions** | Motion design éditorial | 🟢 | C (consolide fortement) | Mask country shape (satellite couleur sur pays focus, gris désaturé ailleurs) + tilt 3D oblique avec dolly forward |
| 7 | **PolyMatter** | Motion design premium | 🟢 | E candidat 1 | Country pills + slab number + underline (composant `<StatCard>`) — risque rouge moral à arbitrer |
| 8 | **Bloomberg Originals** | Broadcast TV magazine | 🟡 | A (ajustements ponctuels seulement) | Cartouche "double-bordure or sur card noir" (variante austère vs cartouche A actuel). Risque chevauchement A FORT, ne pas en faire un template. |
| 9 | **NYT Visual Investigations** | Investigation OSINT | 🟢 | E candidat 2 | Diagramme entités sur noir pur avec vecteurs colorés codés (pour visualiser propriété, sociétés écran, flux d'argent) |

---

## SECTION 5 — Backlog tests post-scout (priorisé)

### 🔴 Haute priorité (validés Aziz, à tester en premier)

1. **Template B "Carto Caspian" V1** — palette `#bcd5e3` océan + `#ede5d3` terre + grain subtil + highlights or/terracotta/indigo. POC composant `CartoCaspian.tsx` + texture grain Gemini.
2. **Brique `<MapGlobeGrid>`** — Map Men style avec palette Souverain, drapeau-sur-mât + label allcaps.
3. **Brique `<KraftCard>`** — fond papier kraft + drapeau/portrait/objet centré + bulle dialogue optionnelle.
4. **Morph chromatique chronologique** (Template D pilier) — territoire change couleur dans le temps sans cut. Lerp `interpolateColors` + Mapbox `fill-color`.
5. **Mask country shape** (Template C pilier Wendover) — satellite couleur dans pays focus, gris désaturé partout ailleurs.

### 🟡 Moyenne priorité

6. **Tilt 3D oblique avec dolly forward** (Template C, mouvement signature) — `pitch: 50-65°` + `flyTo` Mapbox sur lieux narrativement chargés.
7. **Composant `<StatCard country value accent />`** (PolyMatter) — country pill + slab number + underline jaune draw.
8. **Composant `<BigStat>`** (Vox) — chiffre géant scale-in spring + label dessous.
9. **Drapeau-qui-parle** (Template D) — bulle dialogue + drapeau SVG pour citations diplomatiques.
10. **Diagramme entités sur noir pur** (Template E "OSINT") — vecteurs colorés codés par entité, pop-in séquentiel 0.6s.
11. **Composant `<NewsClipping source headline date />`** (Caspian + NYT) — Playfair rouge `#a63232` + sans-serif subtitle.
12. **Pen-stroke SVG animé pour frontières contestées** (Map Men) — `strokeDasharray` interpolate.

### 🟢 Basse priorité (à surveiller, optionnel)

13. **`<ResourcesScrollTable>`** (Caspian) — tableau scroll + bandeau jaune item par item.
14. **Drapeau-comme-texture-de-pays** (PolyMatter) — Mapbox `fill-pattern` SVG drapeau.
15. **HUD timestamp + coords** style intel (Wendover) — overlay carto Template C.
16. **Ken Burns sur antique maps** (RealLifeLore) — pour épisodes patrimoine pré-colonial.
17. **Animated red arrow + "no entry" icon** (RealLifeLore) — pattern blocage symbolique.
18. **Cartouche "double-bordure or sur card noir"** (Bloomberg) — variante austère cartouche A.
19. **Lower-third minimaliste sans bandeau** (Bloomberg) — citations témoins.

---

## SECTION 6 — Décisions Aziz lockées (cumulatives)

### Règles non-négociables cross-templates

| Règle | Détail | Source |
|---|---|---|
| **Cartes épurées sans labels pays** | Aucun nom de pays sur les cartes Mapbox. La géographie est l'outil narratif, pas une légende. | Locked 2026-05-08 dashboard v2 |
| **Mercator pour vertical** | Mercator est conçu pour Shorts verticaux (pas de bandes noires, zoom élevé). Projection N'EST PAS notre axe de différenciation. | Locked 2026-05-08 après POC projections |
| **Couleurs ne codent pas un jugement moral subliminal** | Les couleurs servent à identifier, différencier, évoquer narrativement. Pas à dire "voici les méchants" sans le nommer. | Règle éditoriale Souverain (`memory/rules-souverain-editorial.md` Section 2) |
| **Symétrie d'humanisation** | Sur tout dossier contentieux : si un camp a N détails concrets, l'autre camp doit en avoir N. | Règle éditoriale Souverain |
| **Densité épurée Souverain** | Cross-templates : 1 pays highlight + 1-2 leader-pins max + 0 labels. Inverse de la frame chargée Caspian. | Locked 2026-05-09 dashboard v3 |

### Stratégie scout actuelle (depuis dashboard v5)

- Auto-pilote pour batches 4 et 5 (8 chaînes restantes)
- Résumés 3 lignes après chaque agent
- Aziz peut dire "zoom" pour mini-dashboard ciblé
- Synthèse finale unique en fin de scout

### Brief agents amélioré (batches 4 et 5)

- Path absolu obligatoire : `/Users/clawdbot/Workspace/remotion/memory/templates-research/scouting/par-chaine/<channel>/`
- Naming frames : `frame-NNN-{label}.jpg` (3 digits)
- Filtre stock footage strict : ratio live/motion documenté, frames priorité motion design
- Si vidéo >50% live action : signaler limitation
- Si chaîne >70% live action : signaler dans summary

---

## SECTION 7 — Pointeurs vers fichiers détaillés

### Fichiers projet
- `decisions-aziz-cumulatives.md` — historique chronologique des décisions (complément à ce fichier)
- `par-chaine/caspian-report/_summary.md` — détail chaîne 1
- `par-chaine/map-men/_summary.md` — détail chaîne 2
- `par-chaine/reallifelore/_summary.md` — détail chaîne 3
- `par-chaine/vox/_summary.md` — détail chaîne 4
- `par-chaine/wonderwhy/_summary.md` — détail chaîne 5
- `par-chaine/wendover/_summary.md` — détail chaîne 6
- `par-chaine/polymatter/_summary.md` — détail chaîne 7
- `par-chaine/bloomberg/_summary.md` — détail chaîne 8
- `par-chaine/nyt-visual-investigations/_summary.md` — détail chaîne 9

### Dashboards live (here.now)
- `dashboard/dashboard-url.md` — historique URLs + claim tokens
- v5 ACTIF batch 3 isolé : https://silent-zephyr-e8wt.here.now/

### Composants Remotion existants
- `src/projects/_shared/mapbox/MapboxBase.tsx` — `applyGeoAfriqueV5`, `removeLabels`, `addCountryHighlight`, `MapboxBrandingHide`, `lerpCam`, `CAM_PRESETS`, `ISO`
- `src/projects/poc-mapbox-tests/MapboxMarqueursV2.tsx` — 7 marqueurs animés (LeaderPin déjà codé : `MarqueurPortrait`)
- `src/projects/poc-mapbox-tests/MapboxProjectionsTestV2.tsx` — POC projections (close, Mercator validé)

### Plan parent
- `/Users/clawdbot/.claude/plans/ok-claude-avant-de-foamy-kernighan.md` — plan original 7 jours bibliothèque templates

---

## Notes pour la prochaine session

**Quand on revient sur ce projet** :
1. Lire ce fichier en premier (5 min mobile)
2. Vérifier si batches 4-5 sont finis → CONSOLIDATION-V2.md doit exister
3. Si oui : prioriser Section 5 (backlog tests) selon ce qui consolide ou affine après batches 4-5
4. Si non : reprendre l'auto-pilote là où on en était

**Frames Aziz a particulièrement aimées** (à réutiliser comme références pour POCs) :
- Map Men "0018 panama flat flags" — référence pour `<MapGlobeGrid>`
- Map Men "0008 pastel flat borders" — référence pour structure (mais palette à remplacer)
- WonderWhy "0006 kraft flag card" — référence pour `<KraftCard>`
- WonderWhy "drapeau-qui-parle Maroc" — référence pour `<SpeakingFlag>`
- Caspian Report Libya highlight — référence palette + composition Template B
- Caspian Report Mali/Niger/Chad multi-pins — anti-référence (densité à éviter)
