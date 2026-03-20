# Ideas Lab — Explorations en cours

> Ce fichier = carnet d'idees vivant. Pas un plan de production.
> Une idee ici ne veut pas dire qu'on la lance. Elle veut dire qu'on l'explore.
> Mise a jour au fil des sessions.

---

## Idee #1 : Peste 1347 — Video longue YouTube educative

**Statut :** En production active (projet principal)

### Concept
Video educative YouTube (~10-15 min) sur les reactions humaines pendant la Peste Noire de 1347-1353. Style documentaire anime, voix-off francais, faceless.

### Ce qu'on a deja
- Script complet : `src/projects/peste-1347-pixel/scripts/script-lecture-v3.md`
- Style visuel defini : Enluminure medievale (couleur) + Gravure (monochrome) — SVG pur Remotion
- Guide style : `memory/svg-enluminure-style-guide.md` + `memory/visual-manifesto.md`
- Scenes produites : HookBlocA, B, C, D, E (hook complet), HookMaster, Seg3Fuite, VillageOpeningScene
- Composants reutilisables : EnlumCharacters, PlagueSpreadMap, TerminalEuropeMap
- Pipeline audio : ElevenLabs (voix Chris, fr) + Auphonic
- 6 agents specialises configures (creative-director, pixel-art-director, storyboarder, kimi-reviewer, visual-qa, pixellab-expert)

### Ou on en est
- Hook (60s) : quasi-complet, scenes A-E assembles dans HookMaster
- Corps de la video : Seg3Fuite en cours de rework, autres segments a produire
- Pivot SVG effectue le 2026-02-21 (pixel art abandonne apres echecs compositing)

### Questions ouvertes
- Calendrier de publication cible ?
- Monetisation : AdSense seul ou aussi sponsoring ?
- Langue : francais uniquement ou sous-titres EN ?

### Reutilisable pour d'autres projets
- `TerminalEuropeMap` / `PlagueSpreadMap` : adaptable pour toute carte animee (D3+GeoJSON)
- `EnlumCharacters` : archétypes de personnages reutilisables
- Pipeline ElevenLabs + timing ffprobe
- Style enluminure/gravure = differenciateur visuel fort

---

## Idee #2 : Shorts / TikTok — Style Noir & Blanc avec touches de couleur

**Statut :** Exploration (aucun code produit)

### Concept
Contenu court (30-60s) pour YouTube Shorts / TikTok. Style visuel : noir et blanc dominant, avec des touches de couleur strategiques pour attirer l'attention (un element cle colore sur fond monochrome).

### Ce qui rend cette idee interessante
- Style tres distinctif, immediatement reconnaissable en scroll
- Faceless = production rapide une fois le pipeline rode
- Format natif Remotion : juste un filtre SVG grayscale + interpolation couleur selective
- Touches de couleur = naturellement lie aux animations spring() (l'element "se revele" en couleur)

### References visuelles a explorer
- GeoGlobeTales (analyse faite le 2026-03-07) : 7,6M vues sur un Short de 60s, format geo-explainer pur
- Pattern hook : 3 mots accusatoires + preuve visuelle immediate (zero intro)

### Questions ouvertes
- Quelle niche thematique ? (geographie, histoire, science, actu ?)
- Francophone uniquement ou EN/FR ?
- Rythme de publication viable ? (1/semaine ? 3/semaine ?)
- Connexion avec Idee #1 (funnel vers Peste 1347) ou chaine independante ?

### Faisabilite Remotion
- Filtre grayscale SVG : trivial (`filter: saturate(0)` + interpolate vers couleur)
- Format 9:16 : changement de dimensions composition uniquement
- Voix ElevenLabs : pipeline deja en place

---

## Idee #3 : Geo-Explainer Shorts — Cartes animees sur sujets d'actualite

**Statut :** Exploration (recherche faite, aucun code produit)

### Concept
Shorts 60s centres sur des cartes animees expliquant des phenomenes geographiques, conflits, donnees mondiales. Angle : "comprendre le monde avec une carte en 60 secondes".

### Ce qui rend cette idee interessante
- Fenetre d'opportunite : conflit Israel-Iran (depuis 28 fev 2026) = demande massive de contenus geo
- Niche francophone quasi-vierge sur ce format court
- Ultra-natif Remotion : D3+GeoJSON deja dans le projet (TerminalEuropeMap, PlagueSpreadMap)
- Pas lie a un seul sujet : carte + angle = infini de videos possibles

### Recherche effectuee (2026-03-07)
- Last30Days scan sur conflit Israel-Iran
- 32 threads Reddit, 21 posts X analyses
- Top question publique : ou sont les sites nucleaires iraniens ? Pourquoi les pays du Golfe ont peur ?
- Top voix : @ChinaliveX (251K likes sur post Coree du Nord/Iran)
- Angles Short identifies :
  1. "Pourquoi Israel ne peut pas bombarder Iran directement" (geographie pure)
  2. "Les sites nucleaires iraniens sur la carte" (Natanz, Isfahan, Minzadehei)
  3. "Pourquoi les pays du Golfe ont peur" (trajectoires missiles)
  4. "Iran vs Israel — les chiffres militaires" (data viz)

### Lien possible avec Idee #2
Les deux idees sont complementaires : Idee #2 = style visuel, Idee #3 = niche/sujet. Une chaine geo-explainer en N&B avec touches de couleur serait une combinaison naturelle.

### Questions ouvertes
- Sujet unique (geopolitique) ou multi-sujets (geographie + science + histoire) ?
- Positionnement : factuel/neutre ou avec un angle editorial ?
- Reutiliser le pipeline Peste 1347 ou nouveau projet Remotion dedie ?
- Modele economique : organique first, puis sponsoring geo/actu ?

### Faisabilite Remotion
- TerminalEuropeMap existant = base directement adaptable pour Moyen-Orient (changer GeoJSON)
- Animations de vagues de frappe = spring() + points qui s'allument sur la carte
- Comparatifs data viz = deja dans StyleMotion.tsx (composant existant)

---

---

## Idee #4 : Chaine Geo-Storytelling — Cartes + Stick Figures (CONCEPT CONSOLIDE)

**Statut :** Concept valide visuellement, non lance — a tester en mini-prototype

### Concept emergent (2026-03-07)
Format hybride : carte animee data-driven (cartes) + scenes stick figures modernes (humanisation).
Pas un style unique — une structure narrative en deux registres qui alternent.

### Pourquoi c'est different de tout ce qui existe
| Chaîne existante | Ce qu'ils font | Ce qui manque |
|---|---|---|
| GeoGlobeTales | Cartes animees courtes | Pas de personnages, 100% cartes |
| RealLifeLore | Cartes + stock footage | Stock footage = generique, date, cher |
| Kurzgesagt | Personnages illustres | Pas de cartes data-driven |
| Nota Bene (FR) | Narration historique | Pas de cartes animees programmatiques |
| **Notre concept** | **Cartes data-driven + stick figures SVG** | **Rien de comparable en francophone** |

### Structure narrative type (10-15 min)
```
[Carte] Hook geo — fait contre-intuitif sur la carte (30s)
[Carte] Contexte — pays, distances, donnees (60-90s)
[Figures] Humanisation — "voici ce que ca veut dire pour les gens" (60s)
[Carte] Developpement — evenements, trajectoires, propagation (90s)
[Figures] Consequence humaine — scene illustrant l'impact (45s)
[Carte] Resolution / conclusion avec donnees finales (30s)
```

### Pourquoi les stick figures et pas autre chose
- Culturellement neutres : pas de visage = pas de biais percu sur sujets geopolitiques sensibles
- Coherents avec la carte : meme univers SVG, meme style graphique, meme pipeline
- Adaptatifs : moderne (conflit actuel), historique (Peste 1347), economique, scientifique
- Deja produits : EffectsLab Seg3/Seg5, StyleSVG.tsx, CharacterSheet.tsx = briques existantes
- Ton : ni trop enfantin, ni trop realiste — registre "educational YouTuber" acceptable

### Ce qu'on a deja (actifs reutilisables)
- **Cartes** : GeoLabBW, GeoStyleShowcase, GeoAdvanced (produits le 2026-03-07)
  - D3+GeoJSON, projection Mercator, pays ISO, labels spring(), trajectoires bezier
  - Jetons personnages geolocalises, ondes de propagation, zoom narratif, stats live
- **Stick figures modernes** : StyleSVG.tsx (personnage marchant), EffectsLab Seg3 (personnages village)
  - A adapter : enlever contexte medieval, moderniser couleurs et decors
- **Pipeline complet** : ElevenLabs voix-off, ffprobe timing, Remotion render

### Avantage competitif pipeline
- 1 sujet = changer les variables (pays ISO, coordonnees, texte, couleurs) = nouvelle video
- Adaptation style personnages au sujet : 30 min de travail max
- Rythme possible : 2-3 Shorts/semaine ou 1 video longue/2 semaines une fois rode
- Reproductible : le meme template sert pour Israel-Iran aujourd'hui, autre sujet demain

### Differenciateur editorial
- **Precision geographique absolue** : donnees TopoJSON Natural Earth, codes ISO, coordonnees GPS reelles
- **Sources citees a l'ecran** : chaque chiffre a une source visible (contre la vague de fake geo-content)
- **Francophone** : niche quasi-vierge sur ce format

### Prochaine etape concrete
Prototype mini-Short 30-45s : carte Moyen-Orient (30s) -> transition -> scene stick figures (15s)
Sur le sujet : "Pourquoi Israel peut frapper l'Iran depuis si loin"
Objectif : valider que la transition carte/personnages fonctionne visuellement

### Questions ouvertes
- Nom de chaine ? (neutre/factuel vs editorial)
- Francophone uniquement ou EN sous-titres ?
- Format principal : Shorts viraux ou longues videos avec Shorts comme teaser ?
- Rythme de publication realiste avant de s'engager ?

---

## A explorer plus tard

- **Idee #5 (vague) :** Template Remotion generique vendable — un pipeline "geo-explainer en 2h" revendable a d'autres createurs. Naturel si Idee #4 est lance et rode.
- **Idee #6 (vague) :** Funnel Idee #4 -> Idee #1. Shorts geo sur des sujets historiques (Croisades, Colonisation, etc.) qui renvoient vers une video longue type Peste 1347. Meme chaine, deux formats.

---

## Backlog Technique

### BT-01 : Pipeline veille automatique (World Monitor + agent Claude)
**Source :** Video YouTube "OpenClaw Claude Code + World Monitor = ULTIMATE News Research"
**Priorite :** Basse — a faire apres lancement de la chaine

**Ce que c'est :**
Script cron toutes les 6h qui :
1. Scrape `worldmonitor.app` (agregateur news temps reel, open source, filtre par theme)
2. Agent Claude extrait les 5 evenements geopolitiques les plus actifs
3. Genere une fiche "sujet Short -> angle -> pourquoi maintenant"
4. Stocke dans un fichier local (Obsidian ou simple .md)

**Valeur principale :**
- Identification automatique de sujets de Shorts sans veille manuelle
- Detection d'angles "nobody is talking about yet" — etre premier francophone sur un sujet emergent

**Stack :** yt-dlp pour scraping si besoin, script Python simple, cron macOS ou launchd

---

*Derniere mise a jour : 2026-03-08*
