# Décisions Aziz cumulatives — Souverain templates

Fichier consolidé : ce que Aziz valide ou refuse au fur et à mesure du scout.
Mis à jour à chaque dashboard.

---

## Mis à jour 2026-05-08 — Après dashboard v2 (Caspian Report)

### Idées validées (à coder ou déjà codées)

| Idée | Source | Statut code | Note |
|---|---|---|---|
| Leader-pin (portrait cercle + label) | Caspian v2 frame 020 | ✅ Existe | `MarqueurPortrait` dans `src/projects/poc-mapbox-tests/MapboxMarqueursV2.tsx`. Promouvoir vers `_shared/mapbox/` au moment d'utiliser sur Niger ou autre. |
| Pulses sonar concentriques | Caspian v2 frame 005 | ✅ Existe | `MarqueurPulse` dans même fichier. Aziz l'a déjà signalé "on a déjà ça". |
| Tableau ressources scroll + highlight jaune glissant | Caspian v3 frame 005 | ❌ À coder | Validé "très bonne chose à garder". Composant `<ResourcesScrollTable>` à créer. Estimé ~45 min. |
| News headline serif rouge sur noir charbon | Caspian v3 frames 060/080 | ❌ À coder | Validé "idée à garder pour tester plus tard". Composant `<NewsClipping>` à créer. Estimé ~20 min. |

### Idées rejetées ou nuancées

| Idée | Raison rejet/nuance |
|---|---|
| Choropleth + stagger icônes ressources | Pas explicitement rejeté mais Aziz a souligné "on a déjà ça" sur les pulses → low priority pour Template C. |

### Décisions visuelles structurelles (LOCKED — appliquer à TOUS les templates Souverain)

| Règle | Détail | Source |
|---|---|---|
| **Cartes épurées sans labels pays** | Aucun nom de pays ne doit apparaître sur les cartes. Contrairement à Caspian qui les affiche en gros sans-serif uppercase. La géographie est l'outil narratif, pas une légende. | Validation Aziz 2026-05-08 — règle absolue |
| **Mercator pour le format vertical** | La projection Mercator est conçue pour Shorts verticaux : pas de bandes noires, zoom élevé possible, framing naturel. La projection ne sera pas notre axe de différenciation. | Validation Aziz 2026-05-08 (révision après POC v2) |

### Méthode scout révisée — ce qu'on cherche vraiment

**Le scout n'est PAS un atelier de tests POC.** C'est une phase de **collecte d'observations**. Pour chaque chaîne, on note 3 axes pour tests ultérieurs (Jour 3-4 du plan) :

1. **Palette de couleurs** : ratios, hex codes, mood. Pas de copie 1:1. Inspiration uniquement.
2. **Assets / figures d'animation** : composants visuels réutilisables (pins, badges, clippings, icônes).
3. **Mouvements caméra** : patterns d'animation (ken burns, zoom narratifs, transitions).

**Règle d'or** : on ne teste rien tout de suite. On collecte les observations, on les met en file d'attente, et on teste séquentiellement quand le scout est terminé.

### Position Caspian Report (révisée)

| Axe | Verdict |
|---|---|
| Palette (ivoire 35% + bleu pâle océan) | 🟡 **À surveiller** — la pépite Caspian selon Aziz, mais ne pas copier. Inspiration pour palette Template C à inventer. |
| Assets (leader-pin, news clipping, tableau scroll, hachures) | 🟢 **À tester plus tard** — leader-pin et pulses déjà codés chez nous. News clipping + tableau scroll à ajouter au backlog. |
| Mouvements caméra (ken burns lent permanent) | 🟢 **À tester plus tard** — pattern signature à intégrer dans Template C |

### Idées validées (à coder ou déjà codées)

| Idée | Source | Statut code | Note |
|---|---|---|---|
| Leader-pin (portrait cercle + label) | Caspian v2 frame 020 | ✅ Existe | `MarqueurPortrait` dans `src/projects/poc-mapbox-tests/MapboxMarqueursV2.tsx`. À promouvoir vers `_shared/mapbox/` au moment d'utiliser. |
| Pulses sonar concentriques | Caspian v2 frame 005 | ✅ Existe | `MarqueurPulse` dans même fichier. |
| Tableau ressources scroll + highlight jaune glissant | Caspian v3 frame 005 | 🟡 Backlog | Composant `<ResourcesScrollTable>` à créer. Estimé ~45 min. À tester en phase post-scout. |
| News headline serif rouge sur noir charbon | Caspian v3 frames 060/080 | 🟡 Backlog | Composant `<NewsClipping>` à créer. Estimé ~20 min. À tester en phase post-scout. |

---

## Mis à jour 2026-05-09 — Après dashboard v3 (batch 2 cumulé : Caspian + RealLifeLore + Map Men + WonderWhy + Vox)

### Templates qui émergent (validation Aziz dashboard v3)

| ID | Nom | Source d'inspiration | ADN visuel | Cas d'usage |
|---|---|---|---|---|
| **A** | Or Africain V5 (existant) | — | Noir + or + ledger financier | Data-journalism financier, accords, royalties |
| **B** | Carto Caspian | Caspian Report | Palette ivoire papier + bleu pâle océan + accents chauds (notre version, pas copie) | Géopolitique narrative, contextuelle |
| **C** | Atlas réaliste 3D | RealLifeLore + Wendover/Vox (relief satellite) | Style natif Mapbox satellite + relief 3D + hillshade | Terrain/territoire (mines, frontières physiques, ressources) |
| **D** | WonderWhy beige épuré | WonderWhy | Fond papier sable + drapeaux SVG + objet/portrait en évidence, lisibilité immédiate | Pédagogique (avant/après, qui contre qui) |

**Note Aziz** : "Pour Caspian, j'ai beaucoup aimé sa map et ses couleurs. Si on peut imiter sa map en appliquant notre propre manière, excellent." → Template B = inspiration palette + composition Caspian, exécution Souverain.

**Note Aziz** : "Les 3 dernières chaînes du dashboard utilisent toutes des styles 3D relief satellite réaliste. C'est le style natif Mapbox, faisable." → Template C confirmé sur signal cross-chaînes (RealLifeLore + autres).

**Note Aziz** : "Pour WonderWhy, j'aime les parties avec drapeaux sur fond beige. Très épuré, immédiatement lisible. Utiliser ce genre de fond avec objet/personnage en évidence serait très bien." → Template D confirmé sur 1 chaîne mais signal fort.

### Backlog observations validées (à tester en phase post-scout)

#### Validées par Aziz dans dashboard v3
- **Morph chromatique chronologique** (WonderWhy) : territoire change couleur sans cut. À retenir pour Template D.
- **Drapeaux SVG sur fond beige** (WonderWhy) : signature visuelle Template D.
- **Style 3D relief satellite réaliste** (RealLifeLore, Wendover, Vox) : signature Template C.
- **Map Caspian** : palette + composition (ivoire/bleu pâle) à transposer Template B.

#### Non commentées explicitement par Aziz mais conservées en backlog
- Pen-stroke SVG animé pour frontières contestées (Map Men)
- Pattern "page de manuel annotée" (Map Men)
- Composant `<BigStat>` chiffre géant scale-in (Vox)
- `<PillCityLabel>` pour labels villes propres (Vox)
- Portrait Pin + Nameplate + Stat Grid (RealLifeLore)
- Cartouches noirs sur satellite désaturé (RealLifeLore)
- Drapeau-qui-parle (WonderWhy)
- Texture contextuelle de fond par épisode (WonderWhy)

### Décision : on continue batch 3
12 chaînes restantes peuvent consolider Templates B/C/D ou ajouter un Template E. Aziz valide la continuation.

---

## Mis à jour 2026-05-09 — Briques visuelles validées (issues de Map Men + WonderWhy)

Aziz a partagé 4 captures du dashboard avec annotations détaillées. Deux mécaniques visuelles précises sont validées comme **briques réutilisables cross-templates** (pas des templates entiers).

### Brique 1 — `<MapGlobeGrid>` (Map Men)

**Source** : Map Men frame "0018 panama flat flags"

**Description** :
- Fond gris foncé + grille latitude/longitude (illusion globe)
- Continents en blanc plat / gris clair (forme épurée, pas de relief)
- Pays mis en valeur en couleur saturée (palette Souverain : or, terracotta, indigo)
- Drapeau monté sur mât avec ombre légère (pas au sol)
- Label pays sans-serif bold + sous-label optionnel parenthésé "(NOT COLOMBIA)" type éditorial

**Faisabilité Mapbox** : haute. Graticules via custom layer Mapbox, country_boundaries filtré par ISO, drapeau-sur-mât = SVG overlay Remotion.

**Rejet explicite Aziz** : "On n'irait pas jusqu'au pastel total" (frame "0008 pastel flat borders" Map Men) → on garde la grammaire mais palette Souverain, pas pastel.

**Compatibilité templates** : B (Carto Caspian, palette ivoire+bleu), C (Atlas 3D, en cold open avant tilt), D (WonderWhy beige épuré, pilier).

### Brique 2 — `<KraftCard>` (WonderWhy)

**Source** : WonderWhy frames "0006 kraft flag card" + frame drapeau-qui-parle Maroc

**Description** :
- Fond texture papier (kraft beige par défaut, variantes : papier gris, ardoise, ivoire selon ton)
- Centre : drapeau, portrait Gemini, ou objet isolé (taille ~30% hauteur)
- Nom/label en sans-serif sous l'asset
- Bulle de dialogue optionnelle (style "diplomatique BD" — pas comic book gamin)
- Footnote optionnel (date, source, précision honnête)

**Faisabilité Remotion** : 100%. Pas de Mapbox requis. Texture papier = PNG Gemini.

**Note Aziz** : "Je pourrais voir comment remplacer le fond par un fond plus gris ou d'autres couleurs. Parfait pour représenter des objets, drapeaux, portraits."

**Compatibilité templates** : A (variante "papier ardoise" pour insert), B (variante ivoire), D (pilier).

### Pourquoi briques et pas templates

Une brique est un composant réutilisable cross-templates. Un template est un système complet (palette + grammaire + caméra). Ces 2 mécaniques peuvent s'inviter dans plusieurs templates avec adaptation de palette, ce qui multiplie leur valeur.

---

## Mis à jour 2026-05-09 — Template B "Carto Caspian" raffiné (après captures Aziz)

Aziz a partagé 2 captures Caspian (Libya highlight + Mali/Niger/Chad colorés multi-pins). Décodage précis fait, et 2 sous-décisions lockées.

### Définition Template B — Carto Caspian

**Palette inférée des frames Aziz** :
- Océan : bleu pâle `#bcd5e3` (cible, à valider)
- Continents : blanc cassé / crème `#f5f0e6` à `#ede5d3`
- Frontières : gris foncé fin `#5a5a5a`, opacité 0.6, weight 0.5px
- Highlight pays : palette Souverain (or `#d4a93c`, terracotta `#a05a3a`, indigo `#3a4a6a`) — pas la palette pastel multi-pays Caspian
- **Pas de labels pays** (règle Aziz lockée cross-templates)

### Décisions lockées 2026-05-09

| Sous-décision | Choix Aziz | Note |
|---|---|---|
| **Texture océan** | Bleu pâle uni avec léger grain | Aplat `#bcd5e3` + grain texture overlay subtil. Pas de reproduction aquarelle Caspian (trop coûteuse en POC). Faisable directement. |
| **Densité visuelle** | Épuré Souverain | 1 pays highlight + 1-2 leader-pins max + 0 labels pays. Inverse de la frame 2 chargée Caspian (Mali/Niger/Chad multi-pins). Cohérent ADN éditorial Souverain. |

### Faisabilité technique Mapbox

| Élément | Faisabilité | Méthode |
|---|---|---|
| Océan bleu pâle | Direct | `setPaintProperty("water", "fill-color", "#bcd5e3")` |
| Continents crème | Direct | `applyGeoAfriqueV5` modifiée avec `land: "#ede5d3"` |
| Frontières fines | Direct | `setPaintProperty("admin-0-boundary", "line-color/width")` |
| Grain texture | Direct | PNG Gemini overlay en blend `multiply` opacity 0.08 |
| Highlights pays | Direct | `addCountryHighlight` existant |
| Pas de labels | Direct | `removeLabels` existant |

**Conclusion** : Template B 100% faisable avec composants `_shared/mapbox/` existants + 1 PNG grain texture à générer (Gemini).

### Code à créer post-scout

- `src/projects/_shared/mapbox/templates/CartoCaspian.tsx` : composant qui applique le style B sur n'importe quelle vue Mapbox
- `public/souverain/_shared/textures/grain-paper-bcd5e3.png` : grain texture océan généré Gemini une fois, réutilisé cross-épisodes

---

## Mis à jour 2026-05-09 — Stratégie scout révisée (auto-pilote pour batches 4-5)

### Constat Aziz après dashboard v5
Les notes des agents contiennent déjà tout : hex codes, ratios, composants, mouvements caméra, recettes Mapbox+Remotion, difficulté reproduction. Validation visuelle batch par batch n'apporte plus assez de valeur incrémentale vs le coût en temps mobile. Sauf découverte ponctuelle (cas Caspian frame 2 ou WonderWhy "kraft card" qui ont vraiment fait avancer Template B/D).

### Nouvelle stratégie — auto-pilote avec checkpoints opportunistes (Stratégie C)

Pour batches 4 et 5 (8 chaînes restantes) :
1. Claude dispatche les 4 agents en parallèle, sans dashboard intermédiaire
2. À chaque fin d'agent, **résumé court à Aziz** (3 lignes : verdict + top observation + recette technique inférée)
3. Si Aziz dit "zoom", Claude génère mini-dashboard pour cette chaîne uniquement
4. Sinon on continue
5. **À la fin du scout** (17 chaînes complètes) : 1 dashboard de synthèse globale + 1 rapport de décision pour la phase dissection

### Brief agent amélioré (à appliquer batches 4 et 5)

**Filtre stock footage strict** :
- Notes : ratio live-action / motion design par vidéo
- Sélection frames : UNIQUEMENT motion design / cartes / annotations dans le top 5-7
- Si vidéo >50% live action, signaler explicitement comme limitation
- Si chaîne entière >70% live action, signaler comme limitation d'analyse

**Naming frames imposé** : `frame-NNN-{label}.jpg` (sinon casse le script dashboard).

**Path racine imposé** : chemin absolu complet `/Users/clawdbot/Workspace/remotion/memory/templates-research/scouting/par-chaine/{channel}/` (éviter le bug `/Users/.../par-chaine/` à la racine workspace).

### Garanties qualité notes (à vérifier dans la synthèse finale)
Toutes les notes doivent inclure :
- Axe 1 — Palette (hex codes + ratios)
- Axe 2 — Assets / figures (composants identifiés)
- Axe 3 — Mouvements caméra (patterns + sec/plan)
- Recette technique Mapbox + Remotion (style, projection, layers, animations, difficulté reproduction)

Les premières chaînes scoutées (Caspian) avaient le format batch 1 (Palette/Typo/Mouvement/Transitions, sans recette technique). À noter que pour la synthèse finale, ces formats sont compatibles, mais Caspian peut nécessiter un complément "recette technique" si elle est utile pour le ranking final.

---

## POC projection — résultat (clos)

POC effectuée le 2026-05-08, comparaison Mercator vs Equirectangulaire vs Natural Earth vs Winkel Tripel sur format vertical et horizontal. Conclusion :
- Equirectangulaire : peu différenciée de Mercator + bandes noires énormes en vertical
- Winkel Tripel / Natural Earth : signature visuelle ovale forte mais inadapté Short
- **Mercator retenu** pour Souverain (validation Aziz)
- Fichiers POC : `out/poc-projections/projections-v2-vertical.mp4` et `projections-v2-horizontal.mp4`

### Frames qui frappent le plus (Aziz, dashboard v2)

- Toutes les frames cartes
- Frames avec leader-pins (déjà couvert chez nous)
- Frames avec pulses (déjà couvert chez nous)

→ **Insight** : la signature Caspian qui parle vraiment à Aziz = la **carte elle-même** (projection + composition) plus que les éléments dessus. Renforce la priorité projection equirectangulaire pour Template C.

### Observations Aziz sur le format dashboard

- Lisibilité OK après fix padding
- Niveau de détail jugé "bon"
- Demande explicite : sauvegarder le HTML du dashboard dans le projet (fait dans `dashboard/v{N}-{slug}/`)
- Demande explicite : commentaires pertinents dans le HTML "comment il construit ses cartes et les composantes utilisées" — à appliquer aux prochains dashboards

---

## Pattern d'observation à reproduire dashboard par dashboard

Chaque batch produira une mise à jour de ce fichier avec :
1. Idées validées par Aziz (avec source frame + statut code existant/à coder)
2. Idées rejetées/nuancées (avec raison)
3. Décisions structurelles si elles émergent
4. Frames qui frappent
5. Observations sur le format dashboard

---

## ARBITRAGE FINAL 2026-05-09 — Revue moodboard V2 (session clôture scout)

### Décisions définitives sur les candidats E/F/G

**PolyMatter — RETENU comme bibliothèque d'inserts, PAS comme template map**
- Ce que dit Aziz : "tous les assets validés, ils permettent de rythmer entre les phases map"
- Décision : les composants PolyMatter (tableau YES/NO, country pills, calendar grid, stat comparaison) sont **inserts plein écran cross-templates** — pas un template à part entière
- Usage : intercalés entre beats carte pour présenter information dense (comparaisons, bilans, chronologies)
- Composants à créer : `<ComparisonTable>`, `<CountryPills>`, `<CalendarGrid>` dans `_shared/components/inserts/`

**NYT VI OSINT — RETENU partiellement : diagramme entités uniquement**
- Ce que dit Aziz : "le plus intéressant est le diagramme entité noir pur — c'est un asset pour représenter des informations"
- Décision : garder uniquement le **diagramme entités sur noir pur** (vecteurs colorés, pop-in séquentiel) comme asset insert ponctuel
- Template E "Investigation OSINT" complet = NOT adopted. Trop dépendant du footage satellite qu'on n'a pas.
- Composant à créer : `<EntityDiagram nodes edges />` dans `_shared/components/inserts/`

**Le Monde — RETENU partiellement : carte minimaliste comme transition**
- Ce que dit Aziz : "j'aime comment la map est faite — une manière de faire une transition entre notre map principale et une map vraiment minimaliste pour montrer de l'information"
- Décision : pas un template à part entière. **Pattern de transition** : carte principale Mapbox → carte Le Monde minimaliste (halftone, couches sémantiques cumulatives) pour séquences explicatives complexes
- Utilisation : uniquement quand il faut superposer plusieurs zones/acteurs sur une même carte (pas en carte principale)
- Code : pattern de style Mapbox `LeMonde` à ajouter dans `_shared/mapbox/templates/`

**Johnny Harris — ÉCARTÉ définitivement**
- Ce que dit Aziz : "je passe mon tour, ses maps sont beaucoup trop complexes"
- Template F "Carnet Reporter" = NOT adopted

**General Knowledge F2 "scrapbook satirique" — RETENU comme insert, PAS comme template**
- Ce que dit Aziz : "le kraft + dark shapes très intéressants, mais c'est plus un insert qu'une map"
- Décision : pattern kraft + dark shapes + tape jaune = **insert de présentation d'info** ponctuel, pas un template
- Peut être utilisé dans `<KraftCard>` déjà prévu (extension de la brique existante)

**The Pudding G "grille petits multiples" — RETENU**
- Ce que dit Aziz : "le plus intéressant — permet de présenter plus d'informations type chart, immédiatement associés à l'entité/personnage"
- Décision : **adopté comme mode visuel G** — grille petits multiples (image/portrait/drapeau + chart associé)
- Note précise : "ce n'est pas obligé d'être des portraits" — la grille peut associer n'importe quelle entité (pays, leader, ressource) + métrique
- Usage : sujets comparatifs multi-entités (ex: "voici 12 pays africains + leur % dette-PIB", "voici 6 présidents + leur bilan extraction")
- Composant à créer : `<SmallMultiplesGrid items={[{entity, chart}]} />` dans `_shared/components/inserts/`

---

### Tableau de synthèse final — Ce qu'on a

| ID | Nom | Type | Statut |
|---|---|---|---|
| **A** | Or Africain V5 | Template map complet | LOCKED — existant |
| **B** | Carto Caspian | Template map complet | LOCKED V1 — à coder |
| **C** | Atlas réaliste 3D | Template map complet | LOCKED V1 — à coder |
| **D** | WonderWhy beige épuré | Template map complet | LOCKED V1 — à coder |
| **Le Monde** | Carte minimaliste couches | Pattern de transition | À coder (style Mapbox + couches cumulatives) |
| **PolyMatter** | Inserts comparaison | Bibliothèque inserts cross-templates | À coder (`<ComparisonTable>`, `<CountryPills>`, `<CalendarGrid>`) |
| **NYT VI** | Diagramme entités | Insert ponctuel cross-templates | À coder (`<EntityDiagram>`) |
| **The Pudding G** | Grille petits multiples | Mode visuel data-viz | À coder (`<SmallMultiplesGrid>`) |
| **General Knowledge F2** | Kraft + dark shapes | Extension `<KraftCard>` | À intégrer dans brique existante |
| **Johnny Harris F** | Carnet reporter | ~~ÉCARTÉ~~ | Non retenu |
| **Template E1 PolyMatter rouge** | Fond rouge plein | ~~ÉCARTÉ~~ | Non retenu (risque moral + repositionné en inserts) |

### Conclusion scout
**4 templates maps + 4 modes inserts/data-viz** — c'est une bibliothèque riche et cohérente.
La distinction clé qu'Aziz a opérée : **map principale** (qui dure, qui structure le beat) vs **insert** (ponctuel, pour rythmer ou présenter une info dense). Cette distinction est plus fine que ce qu'on avait anticipé et simplifie l'architecture : les templates A/B/C/D gèrent la carte, les inserts se branchent dessus sans notion de template entier.

**Prochaine étape** : Jour 2 du plan — dissection et codage des composants prioritaires.
