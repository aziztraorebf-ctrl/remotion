# Catalogue Templates Souverain — Version Gemini

> Fichier conçu pour être collé dans un prompt Gemini 3.1-pro avec un script.
> Usage : Gemini choisit les templates, justifie sa sélection narrative, génère un storyboard image.
> Dernière mise à jour : 2026-05-21

---

## INSTRUCTIONS POUR GEMINI

Tu as accès à une bibliothèque de 40+ templates d'animation Remotion pour documentaires africains.
Chaque template est décrit ci-dessous : mécanique, cas d'usage, ton, enchaînements recommandés.

**Ta mission** : à partir du script fourni, sélectionner les templates les mieux adaptés beat par beat,
justifier chaque choix narratif, puis générer un storyboard image (1 frame clé par beat, style esquisse analytique).

**Règles de sélection** :
- Privilégier la diversité mécanique (pas 3 data-viz d'affilée)
- Alterner tension/respiration (choc → analyse → révélation → pause)
- Favoriser les templates avec "Enchaîne avec" correspondant au beat suivant
- Ne pas choisir un template juste parce qu'il est beau — le SENS de sa mécanique doit coller au propos

**Palette obligatoire** : navy `#1a2535` · gold `#c8a951` · ivory `#f2ebd9` · bleu analytique `#4a9eff` · rouge urgence `#e63946`
**Typographie** : IBM Plex Mono exclusivement

---

## FORMAT

Ces templates fonctionnent en **16:9 (1920×1080) ET 9:16 (1080×1920)** via `useVideoConfig()` — zéro constante hardcodée depuis Vague 1 Refactor (2026-05-22). Ils s'utilisent via `<SouverainScene background="dark-dots-navy|slate-medium|kraft-dark">`.

**Refactor Vague 1 — 2026-05-22** : 18 templates refactorés (useVideoConfig, zéro constante hardcodée) :
ScaleShock · Timeline · IconStat · OdometerFlip · CoinFlip · GlitchReveal · SplitFlap · RadarScan · BarRace · StackedBars · ProcessFlow · PulseNumber · RadarPing · TimelineFracture · NetworkGraph · IconGrid · BurnReveal · ShatterReform
Showcase de validation : `ProtoR-Vague1-Refactor-Showcase` (18 scènes × 9s = 2min42)

**Pour les Shorts 9:16** : les mêmes templates s'appliquent. Adapter les positions `screen_position_xy` au canvas 1080×1920. Les grilles (IconGrid, BarRace) se reconfigurent verticalement via useVideoConfig.

---

## GROUPE A — DATA VISUALIZATION

### BarRace — Course de barres animée
Format : 16:9 | Durée : 6s
Mécanique : barres horizontales croissent de gauche → droite, chaque barre arrive avec spring, labels pays en bleu
Cas d'usage : classements qui évoluent, ranking PIB/production/exportation comparé entre pays
Ton : analytique, compétition visible
Enchaîne bien avec : PolyrythmieData (variations), StackedBars (répartition d'un même total)
Props : `data[] { label, value, color? }`, `maxValue`, `title`

### StackedBars — Barres empilées composition
Format : 16:9 | Durée : 5s
Mécanique : barres verticales empilées par couches, spring pop depuis le bas, légende couleur
Cas d'usage : répartition d'un budget, composition d'un PIB, parts de marché empilées
Ton : analytique structurel
Enchaîne bien avec : BarRace (si on veut ensuite comparer les totaux), PolyrythmieData

### PolyrythmieData — Barres syncopées groove djembé
Format : 16:9 natif | Durée : 8s
Mécanique : 6 barres verticales apparaissent avec délais irréguliers (pattern 3+2+3), ligne de seuil trace-on, l'ordre d'apparition raconte l'inégalité
Cas d'usage : comparaisons CEDEAO, inégalités régionales, budgets défense vs éducation
Ton : révélation progressive, dramatique contrôlé
Enchaîne bien avec : NoeudTisserand (si l'inégalité vient d'un goulot), LeSceau (si un acte explique l'écart)
Props : `bars[] { label, value, displayValue }`, `maxValue`, `title`, `thresholdValue`, `thresholdLabel`

### LaCalebasse — Jauge ondulante
Format : 16:9 natif | Durée : 8s
Mécanique : silhouette calebasse, vague dorée monte progressivement, odometer % au centre, crosshairs aux coins
Cas d'usage : réserves qui s'épuisent/remplissent, taux d'utilisation port, capacité de production
Ton : organique, mémoriel, culturellement ancré
Enchaîne bien avec : PolyrythmieData (si comparaison ensuite), LeSceau (si contrat suit)
Props : `percentage` (0-100), `label`, `sublabel`, `liquidColor`

### ScaleShock — Balance inégalité
Format : 16:9 | Durée : 5s
Mécanique : deux plateaux balance, l'un s'écrase vers le bas avec overshoot spring, chiffres des deux côtés
Cas d'usage : inégalité choc (PIB par habitant, salaires, budgets)
Ton : choc visuel immédiat, fort impact rhétorique
Enchaîne bien avec : PolyrythmieData, LaCalebasse

### PulseNumber — Chiffre héros pulsant
Format : 16:9 | Durée : 5s
Mécanique : un seul chiffre massif, spring pop overshoot, pulsation radiale, contexte en dessous
Cas d'usage : révélation d'une stat clé qui mérite l'écran entier (durée, montant, pourcentage)
Ton : pause dramatique, choc simple
Enchaîne bien avec : BarRace (si on contextualise ensuite), ScaleShock (si comparaison suit)
Props : `value`, `label`, `sublabel`, `unit`

### OdometerFlip — Compteur qui roule
Format : 16:9 | Durée : 5s
Mécanique : chiffres qui roulent comme compteur kilométrique, slot machine visuelle
Cas d'usage : montée en puissance progressive, compte à rebours, croissance année après année
Ton : mécanique, tension qui monte
Enchaîne bien avec : PulseNumber (après la montée), BarRace

### IconGrid — Grille icônes + stats
Format : 16:9 natif (refactoré) | Durée : 5s
Mécanique : grille 2×3 (ou 2×N) de cartes navy, chaque carte = icône + chiffre + label, spring pop stagger
Cas d'usage : synthèse de 4-6 ressources/indicateurs d'un secteur, dashboard économique compact
Ton : analytique synthèse, lisibilité maximale
Enchaîne bien avec : BarRace (si on détaille un item ensuite), PulseNumber (zoom sur le chiffre clé)
Props : `items[] { icon, stat, label }`, `title`, `subtitle`

### NetworkGraph — Réseau de connexions
Format : 16:9 natif (refactoré) | Durée : 7s
Mécanique : noeud central + 6 satellites, arcs draw-in séquentiels, pulse dot qui voyage, edge labels
Cas d'usage : cartographie d'un réseau commercial/politique, montrer qui est connecté à qui
Ton : systémique, géopolitique
Enchaîne bien avec : ArbreAPalabres (si le réseau est politique), NoeudTisserand (goulot dans ce réseau)
Props : `centralLabel`, `centralIcon`, `nodes[] { cx, cy, label, icon, edgeLabel? }`, `subtitle`

### SmallMultiplesGrid — Grille comparaisons multiples
Format : 16:9 | Durée : 7s
Mécanique : grille de mini-graphiques identiques côte à côte, même échelle, lecture simultanée
Cas d'usage : 6-9 pays mêmes données, comparer sans empiler
Ton : synthèse analytique, vue d'ensemble
Enchaîne bien avec : PolyrythmieData (zoom sur l'inégalité), NoeudTisserand

---

## GROUPE B — GÉOGRAPHIE & TERRITOIRE

### Stratigraphie — Coupe géologique
Format : 16:9 natif | Durée : 9s
Mécanique : scan clipPath descend verticalement, révèle des couches géologiques ondulées avec labels et ressources, bloc info latéral
Cas d'usage : forage Sangomar, mines uranium Niger, nappes phréatiques — tout ce qui est sous la surface
Ton : scientifique, révélation progressive, lent et pesant
Enchaîne bien avec : LeSceau (contrat signé après la découverte), LaCalebasse (réserve quantifiée)
Props : `layers[] { label, depth, color, resource? }`, `title`

### NoeudTisserand — Goulot d'étranglement
Format : 16:9 natif | Durée : 9s
Mécanique : 3 fils bezier convergent vers un nœud central pulsant, diamètre fil proportionnel au %, nœud rouge si bloqué / vert si fluide
Cas d'usage : monopole portuaire, corridor bloqué, dépendance à une infrastructure unique, Chine comme goulot batteries
Ton : structurel, géopolitique, tension
Enchaîne bien avec : LeSemeur (où partent les flux), PolyrythmieData (impact sur les économies amont)
Props : `inputFlows[] { label, percentage, side }`, `bottleneckEntity`, `outputLabel`, `blocked`

### Palimpseste — Frontières qui se dissolvent
Format : 16:9 natif | Durée : 9s
Mécanique : lignes rigides gold (frontières coloniales) se tracent, puis se dissolvent, corridors bezier bleu les traversent, titre glitch change
Cas d'usage : ZLECAf, routes transsahariennes, zones d'influence qui ignorent les frontières officielles
Ton : historique → contemporain, contradiction animée, fort en narration
Enchaîne bien avec : ArbreAPalabres (qui tire les ficelles sur ce territoire), LeSemeur (flux qui ignorent les frontières)
Props : `colonialLines[]`, `modernFlows[]`, `titleColonial`, `titleModern`

### LeSemeur — Transfert de valeur Awalé
Format : 16:9 natif | Durée : 9s
Mécanique : fosses Awalé africain, graines voyagent en arcs bezier des fosses sources vers destinations, fosses se vident/remplissent
Cas d'usage : fuite de capitaux, IDE qui quittent, fuite des cerveaux, échanges ZLECAf
Ton : culturellement ancré, flux visible et lisible, mémorable
Enchaîne bien avec : Palimpseste (frontières que ces flux traversent), NoeudTisserand (goulot qui bloque certains flux)
Props : `cups[] { id, label, seeds, role: "source"|"destination", x, y }`, `totalValue`, `title`

### ScanInfrarouge — Révélation de l'invisible
Format : 16:9 natif | Durée : 7s
Mécanique : ligne scan UV descend sur la scène, révèle des points cachés qui pulsent en rouge, labels apparaissent
Cas d'usage : bases militaires non officielles, concessions minières secrètes, présences cachées sur un territoire
Ton : investigation, révélation inquiétante, journalisme de données
Enchaîne bien avec : ArbreAPalabres (qui est derrière ces présences), Caviardage (document qui confirme)
Props : `hiddenPoints[] { x, y, label, triggerFrame }`

### RadarPing — Signal géographique
Format : 16:9 | Durée : 5s
Mécanique : ondes concentriques depuis un point, signal radar, focus sur une zone
Cas d'usage : localiser un événement sur une carte implicite, signaler une anomalie géographique
Ton : alerte, précision géographique
Enchaîne bien avec : ScanInfrarouge, MapboxSatelliteSenegal

### RadarScan — Balayage surveillance
Format : 16:9 | Durée : 5s
Mécanique : bras tournant radar, révèle points sur le sweep
Cas d'usage : surveillance, monitoring, apparition progressive de données sur une zone
Ton : technologique, surveillance
Enchaîne bien avec : RadarPing, ScanInfrarouge

---

## GROUPE C — NARRATION & DRAMATIQUE

### LeSceau — Tampon officiel
Format : 16:9 natif | Durée : 8s
Mécanique : cercle draw-on SVG, texte circulaire sur textPath, étoile spring pop, impact stamp overshoot (scale 1.4→1.0), glitch titre, date fadeIn
Cas d'usage : contrat signé, sanctions officielles, ratification, résolution ONU — moment de pause dramatique
Ton : solennel, institutionnel, fort poids rhétorique
Enchaîne bien avec : PolyrythmieData (impact chiffré qui suit l'acte), LaCalebasse (réserves affectées par l'acte)
Props : `title`, `subtitle` (texte circulaire), `institution`, `date`, `sealColor`

### LeCadranSolaire — Pivot historique
Format : 16:9 natif | Durée : 9s
Mécanique : cercle draw-on, aiguille tourne en spring mécanique, glitch 3 frames à l'inversion ère1→ère2, bascule colorimétrique
Cas d'usage : transition historique (colonial → indépendance), pivot énergétique, tout avant/après
Ton : gravité historique, temps qui bascule
Enchaîne bien avec : Stratigraphie (ressources sous la surface de ce pivot), Timeline (chronologie qui suit)
Props : `era1Label`, `era2Label`, `pivotYear`

### ArbreAPalabres — Carte de pouvoir
Format : 16:9 natif | Durée : 9s
Mécanique : nœud central rayonne vers acteurs périphériques via branches SVG draw-on, code couleur gold=allié/bleu=neutre/rouge=adversaire, connexions entre acteurs périphériques
Cas d'usage : qui est autour de la table, cartographie des intérêts divergents, qui s'oppose à qui
Ton : politique, analytique, le plus dense de la bibliothèque — à utiliser pour révélations de pouvoir
Enchaîne bien avec : LeSceau (l'arbre précède ou suit l'acte officiel), TrombinoscapeStrategique
Props : `centralLabel`, `actors[] { id, label, alignment, angle, weight, x, y, branchPath }`, `connections[]`

### Timeline — Chronologie narrative
Format : 16:9 | Durée : 6s
Mécanique : ligne horizontale draw-on, jalons spring pop depuis le bas, dates et labels
Cas d'usage : chronologie d'un événement, progression historique
Ton : pédagogique, structurant
Enchaîne bien avec : LeCadranSolaire (zoom sur un pivot), BarRace (données à un moment précis)
Props : `events[] { date, label, sublabel? }`, `title`

### CalqueDechire — Document déchiré révèle la vérité
Format : 16:9 natif | Durée : 6s
Mécanique : document officiel ivoire, déchirure SVG irrégulière, les deux moitiés partent en diagonale, fond navy révèle stat rouge
Cas d'usage : déclaration officielle vs réalité cachée, rapport qui contredit le discours, dette réelle vs annoncée
Ton : investigation, rupture narrative, choc de révélation
Enchaîne bien avec : SourceProuve (le vrai document), Caviardage (ce qui était caché)
Props : `officialText`, `bodyLines[]`, `statLabel`, `sourceLabel`

### Caviardage — Document déclassifié
Format : 16:9 | Durée : 7s
Mécanique : barres noires biffent du texte officiel, les vraies données gold apparaissent dans les espaces, tampon DÉCLASSIFIÉ
Cas d'usage : révéler ce qu'un rapport officiel cachait, journalisme d'investigation
Ton : investigation thriller, tension révélation
Enchaîne bien avec : CalqueDechire, SourceProuve, FilRouge
Props : `lines[] { text, redacted? }`, `revealedData`

### FilRouge — Tableau d'enquête
Format : 16:9 | Durée : 8s
Mécanique : fiches ivoire épinglées au mur, fils rouges les relient, point "?" qui se révèle
Cas d'usage : connecter les indices d'une enquête, révéler une connexion cachée entre acteurs
Ton : investigation thriller, construction de la preuve
Enchaîne bien avec : ArbreAPalabres (conclusion de l'enquête), Caviardage
Props : `cards[] { label, sub, x, y }`, `connections[] { from, to }`, `revealLabel`

### EffetDomino — Cascade de chutes
Format : 16:9 natif | Durée : 7s
Mécanique : 5 piliers drapeaux tombent en cascade spring (délai 27f entre chaque), texte impact final
Cas d'usage : coups d'État en série, propagation d'une crise, effet contagion régionale
Ton : choc progressif, momentum narratif
Enchaîne bien avec : LoomWipe (transition après l'impact), PolyrythmieData (conséquences économiques)
Props : `piliers[] { pays, code, bandes[], triggerFrame }`, `impactText`, `impactSubText`

---

## GROUPE D — PERSONNAGES & POUVOIR

### PortraitSilhouette — Profil acteur plein écran
Format : 16:9 natif | Durée : 8s
Mécanique : silhouette géométrique (octogone) spring pop, 3 facts slide-in séquentiels, badge statut (ALLIÉ/ANTAGONISTE/NEUTRE)
Cas d'usage : introduire un acteur clé, brief rapide identité + position politique
Ton : analytique, neutre, intelligence briefing
Enchaîne bien avec : ArbreAPalabres (l'acteur dans son réseau), TrombinoscapeStrategique
Props : `name`, `title`, `facts[] { label, value }`, `alignment`, `badgeColor`

### MosaïqueActeurs — Réseau 6 portraits
Format : 16:9 natif | Durée : 8s
Mécanique : 6 cartes grille, rotations fixées, arcs gold de connexion tracés, badge ALLIE/NEUTRE/ANTAGONISTE
Cas d'usage : présenter un réseau d'acteurs simultanément, cartographie d'une coalition
Ton : politique, densité informationnelle forte
Enchaîne bien avec : ArbreAPalabres (structure de pouvoir), LeSceau (l'accord entre ces acteurs)
Props : `actors[] { name, role, alignment, rotation }`, `connections[] { from, to }`

### TrombinoscapeStrategique — Grille pouvoir avec barres
Format : 16:9 natif | Durée : 7s
Mécanique : 4-6 portraits, barres de pouvoir 0-100% animées, couleurs alliances
Cas d'usage : qui a vraiment le pouvoir dans un conflit, distribution d'influence
Ton : analytique froid, journalisme géopolitique
Enchaîne bien avec : MosaïqueActeurs, ArbreAPalabres
Props : `actors[] { name, powerScore, alignment }`, `title`

### PassationPouvoir — Transition de leadership
Format : 16:9 natif | Durée : 8s
Mécanique : flash gold, sortant se grise, entrant s'agrandit, frise chronologique DÉPART→ARRIVÉE
Cas d'usage : coup d'État, élection, succession dynastique, changement de CEO
Ton : dramatique cinématique
Enchaîne bien avec : EffetDomino (si la succession cause une cascade), ArbreAPalabres (nouveau réseau de pouvoir)
Props : `outgoing { name, title, years }`, `incoming { name, title }`, `eventDate`, `eventLabel`

### VoixDuPeuple — Témoignage citation
Format : 16:9 natif | Durée : 7s
Mécanique : guillemets 220px gold, citation slide-in ligne par ligne, identité speaker spring bas-droite
Cas d'usage : voix de terrain, témoignage direct, humaniser une donnée froide
Ton : humain, empathique — contraste fort avec les templates analytiques
Enchaîne bien avec : PolyrythmieData (la citation avant ou après le chiffre), LeSceau (la voix humaine vs l'acte officiel)
Props : `quote`, `speaker`, `speakerRole`, `speakerLocation`

### PortraitDossier — Fiche intelligence
Format : 16:9 natif | Durée : 8s
Mécanique : cadre polygonal, 5 champs underscore draw-on (NOM / POSTE / ORGANISATION / DATE / STATUT)
Cas d'usage : fiche de renseignement, présentation acteur dans contexte investigation
Ton : militaire/intelligence, froid analytique
Enchaîne bien avec : FilRouge (la fiche dans l'enquête), MosaïqueActeurs

### PortraitEditorial — Une de magazine
Format : 16:9 natif | Durée : 6s
Mécanique : split magazine, cadre gold, rubrique rouge, 3 stats, badge source
Cas d'usage : acteur traité comme couverture de magazine analytique
Ton : éditorial premium, Jeune Afrique / Foreign Policy
Enchaîne bien avec : TrombinoscapeStrategique, PortraitSilhouette

### FaceAFace — Confrontation deux entités
Format : 16:9 natif | Durée : 8s
Mécanique : split vertical, ligne centrale, 3 stats chaque côté, médaillon VS au centre
Cas d'usage : Chine vs Occident, CEDEAO vs AES, pétrole vs solaire, deux périodes
Ton : duel, opposition frontale
Enchaîne bien avec : PolyrythmieData (les chiffres de chaque camp), LeSceau (l'accord ou la rupture)
Props : `entityA { name, stats[] }`, `entityB { name, stats[] }`, `vsLabel`

---

## GROUPE E — IMPACT & PREUVE

### TextChoc — Phrase impact mot à mot
Format : 16:9 natif | Durée : 5s
Mécanique : mots arrivent un par un avec délais accélérés, accent rouge/gold sur le mot-clé, soulignement spring
Cas d'usage : accroches chocs, affirmations fortes, citations courtes percutantes
Ton : choc rhétorique maximal — à utiliser avec parcimonie
Enchaîne bien avec : SourceProuve (la preuve qui suit l'affirmation), ChiffreChoc (le chiffre qui amplifie)
Props : `words[] { text, accent? }`, `accentColor`

### SourceProuve — Article highlight
Format : 16:9 natif | Durée : 6s
Mécanique : article ivoire slide-in depuis bas, publication rouge en haut, surlignage gold glissant sur la ligne-clé
Cas d'usage : citer une source, montrer qu'une affirmation est prouvée, crédibilité
Ton : journalistique, rigueur de l'enquête
Enchaîne bien avec : ChiffreChoc (amplifier la donnée de la source), CalqueDechire (si la source contredit le discours officiel)
Props : `headline`, `publication`, `date`, `highlightText`, `bodySnippet`

### ChiffreChoc — Stat fullscreen impact
Format : 16:9 natif | Durée : 5s
Mécanique : stat 220px fullscreen, grille navy, spring overshoot, 2 lignes contexte
Cas d'usage : révélation finale d'un chiffre décisif, ampleur qu'on ne peut pas ignorer
Ton : pause totale, choc absolu
Enchaîne bien avec : BarRace (contextualiser ensuite), NoeudTisserand (expliquer pourquoi ce chiffre existe)
Props : `prefix`, `value`, `suffix`, `context1`, `context2`

### GlitchReveal — Révélation par glitch
Format : 16:9 | Durée : 7s
Mécanique : image/texte qui glitch avant de révéler la vraie information, artefacts visuels
Cas d'usage : décoder, décrypter, révélation de l'information cachée derrière le bruit
Ton : hacking, révélation cryptée
Enchaîne bien avec : Caviardage, ScanInfrarouge

### BurnReveal — Révélation par brûlure
Format : 16:9 | Durée : 6s
Mécanique : zone brûlée qui s'étend révèle le contenu dessous
Cas d'usage : révélation progressive, destruction qui laisse voir la réalité
Ton : dramatique, viscéral
Enchaîne bien avec : CalqueDechire, GlitchReveal

---

## GROUPE F — TRANSITIONS & UTILITAIRES

### LoomWipe — Transition tissage signature
Format : 16:9 natif | Durée : 3s
Mécanique : 8 bandes horizontales + verticales gold/navy se tissent pour couvrir l'écran, puis se défont
Cas d'usage : UNIQUEMENT transition entre chapitres, séparation de segments
Ton : élégant, signature visuelle Souverain
Enchaîne bien avec : tout — c'est une transition
Props : `bandColorA` (gold), `bandColorB` (navy)

### SovereignEclipse — Transition dramatique
Format : 16:9 | Durée : 6s
Mécanique : disque noir slide, anneau gold éclate, fondu enchaîné cinématique
Cas d'usage : transition chapitre à fort poids dramatique, moment de rupture
Ton : plus dramatique que LoomWipe — pour pivots narratifs majeurs
Enchaîne bien avec : LeCadranSolaire, EffetDomino

### SplitFlap — Flip cards tableau d'affichage
Format : 16:9 | Durée : 7s
Mécanique : caractères flip à la façon tableau d'affichage gare, révélation lettre par lettre
Cas d'usage : révélation d'un mot ou d'une date clé, compte à rebours, annonce
Ton : mécanique, suspense
Enchaîne bien avec : LeSceau, CalqueDechire

### CountdownReveal — Compte à rebours
Format : 16:9 | Durée : 4s
Mécanique : décompte chiffres, reveal final
Cas d'usage : avant une révélation, compte avant événement
Ton : tension cinématique
Enchaîne bien avec : ChiffreChoc, LeSceau

### ShatterReform — Fracture puis reconstruction
Format : 16:9 | Durée : 7s
Mécanique : éléments se fragmentent puis se reforment en nouvelle configuration
Cas d'usage : transformation, rupture suivie d'une reconstruction
Ton : dramatique, transformation
Enchaîne bien avec : PassationPouvoir, EffetDomino

### CoinFlip — Pile ou face
Format : 16:9 | Durée : 7s
Mécanique : pièce qui tourne, révèle un côté ou l'autre
Cas d'usage : décision binaire, pari géopolitique, deux scénarios
Ton : incertitude, risque
Enchaîne bien avec : FaceAFace, ScaleShock

---

## GROUPE G — TEXTURES & SYSTÈMES VIVANTS (Expérimentaux)

> Ces 5 templates sont abstraits par design. Ils nécessitent un contexte narratif précis pour être pertinents.
> Ne pas les choisir par défaut — les réserver pour moments où une abstraction forte sert le propos.

### ParallaxeDiorama — Profondeur 3 couches
Format : 16:9 exp | Durée : 7s
Mécanique : 3 plans parallaxe différentielle, intro cinématique, caption + label
Cas d'usage : ouverture atmosphérique de chapitre, paysage politique en couches (surface/fond/arrière-fond)
Ton : cinématique contemplatif
Enchaîne bien avec : Stratigraphie (profondeur physique vs politique), LeCadranSolaire

### MosaïqueWax — Tissu vivant
Format : 16:9 exp | Durée : 7s
Mécanique : 24 triangles hexagonaux, couleurs wax africaines, spring pop stagger
Cas d'usage : richesse culturelle, diversité, tissu social — métaphore du patchwork africain
Ton : cultural pride, abstraction colorée
Enchaîne bien avec : VoixDuPeuple, PortraitSilhouette

### MétamorphoseFiduciaire — Symbole → Symbole
Format : 16:9 exp | Durée : 6s
Mécanique : un symbole (monnaie, arme, clé) se dissout en 15 gouttes d'encre, un autre émerge du cercle
Cas d'usage : transformation d'un système, franc CFA → monnaie souveraine, guerre → diplomatie
Ton : symbolique fort, abstraction narrative
Enchaîne bien avec : LeSceau (l'acte qui entérine la transformation), LeCadranSolaire

### OrigamiCarto — 4 quadrants déploiement
Format : 16:9 exp | Durée : 6s
Mécanique : 4 quadrants se déplient depuis le centre comme origami, croix gold, labels cardinaux
Cas d'usage : révéler une carte, ouvrir un nouveau chapitre géographique
Ton : cartographique, découverte
Enchaîne bien avec : NoeudTisserand, Palimpseste

### LoomWeaver — Tisser les alliances
Format : 16:9 exp | Durée : 7s
Mécanique : grille 8×8 de nœuds, fils warp/weft qui se tissent, quadrants de couleur représentant des alliances
Cas d'usage : complexité des alliances africaines, blocs géopolitiques qui se forment
Ton : systémique, abstrait — pour montrer la complexité sans la simplifier
Enchaîne bien avec : ArbreAPalabres, MosaïqueActeurs

---

## GROUPE H — HOOKS & INSERTS

### BrutalHookSplit — Hook photo typewriter
Format : 16:9 | Durée : 5-12s
Mécanique : photo Ken Burns haut + narration typewriter mot par mot bas + accent Bebas Neue doré
Cas d'usage : beat d'ouverture — accrocher en 5s
Ton : impact immédiat, journalisme terrain
Enchaîne bien avec : TextChoc (phrase choc ensuite), ChiffreChoc

### BrutalHeadline — Titre choc plein cadre
Format : 16:9 | Durée : 5s
Mécanique : titre massive plein écran + photo B&W en fond + accent couleur
Cas d'usage : accroches YouTube Short adaptables, titre de chapitre fort

### DataCard — Fiche donnée
Format : 16:9 insert | Durée : 4s
Mécanique : carte centrée, chiffre + contexte, simple et lisible
Cas d'usage : insert rapide entre deux templates denses

### DateBar — Marqueur temporel
Format : 16:9 insert | Durée : 2s
Mécanique : bandeau date horizontal, style chapitrage
Cas d'usage : marquer un saut temporel, transitions entre périodes
Enchaîne bien avec : Timeline, LeCadranSolaire

### KraftCard — Insert identité acteur
Format : 16:9 insert | Durée : 5s
Mécanique : carte kraft texturée, identité acteur (nom, titre, affiliation)
Cas d'usage : présentation rapide acteur sans aller jusqu'à PortraitDossier

---

## GROUPE I — MAPBOX (Cartographie plein écran)

> Tous les beats Mapbox sont **plein écran obligatoire** — jamais split 50/50.
> Texte = overlay CSS positionné absolument sur la carte.
> Style par défaut : Caspian Sepia (`applyGeoAfriqueV5`). Noir pour climax.
> Technique OBLIGATOIRE : `useCurrentFrame` + `interpolate` + `map.jumpTo()`. JAMAIS `flyTo`/`easeTo` (incompatibles headless).
> Projection OBLIGATOIRE : `{ name: "mercator" }` dans le constructeur `mapboxgl.Map`.
> Couleur dot gold : `#c08820` — jamais `#0d1525` (invisible sur Sepia).
> Render via `scripts/render-mapbox.sh` (chrome-headless-shell validé 2026-05-24).

### 12 Mouvements Caméra validés headless (Camera Lab v2)

Référence vidéo : https://files.catbox.moe/v0v4e6.mp4 (12 scènes × 10s, Mercator)

| # | Mouvement | Mécanique | Cas d'usage Souverain |
|---|-----------|-----------|----------------------|
| **1. Drift Continu** | Pan lent frame-driven, vitesse constante (~0.001 lat/frame) | Exploration douce d'un territoire, carte "vivante" en fond | Beat ambiance, fond pendant narration longue |
| **2. Orbit + Dolly** | Rotation autour d'un point + zoom simultané | Révéler un lieu en tournant autour | Gigafactory, mine, port — introduction lieu clé |
| **3. Multi-Stop Whip Pan** | Séquence de jumpTo rapides (3-4 lieux en <10s), blur 60f entre chaque | Connecter plusieurs lieux sur une même carte | Routes commerciales, acteurs multi-pays |
| **4. Zoom + Freeze** | Zoom in rapide jusqu'à zoom 14-16, freeze sur le lieu | Impact dramatique sur un point précis | Révélation d'une usine, d'un gisement, d'un port |
| **5. Tilt + Pull Back** | Pitch 60→0 + zoom out simultané | Révéler la géographie plus large depuis un point | Hook révélateur : on part du sol, on monte voir le pays entier |
| **6. Counter-Rotation** | Deux zones pivotent en sens opposés | Tension entre deux entités géographiques | Conflit, opposition, deux camps |
| **7. Blur Atmo** | Blur CSS progressif sur le fond Mapbox, texte reste net | Transition vers un overlay data, fond "fondu" | Passer d'une carte à une stat sans couper |
| **8. Pull Back Planétaire** | Zoom out jusqu'à voir le continent entier ou le globe | Contextualisation géopolitique macro | Révéler l'Afrique dans son ensemble, fin de séquence géo |
| **9. Zoom Sol 3D** | Satellite pitch 65° + zoom sol (zoom 15+) | Vue aérienne réaliste d'un site industriel | Gigafactory, port, mine — immersion terrain |
| **10. Fade Style Switch** | Transition opacity entre deux styles Mapbox (ex: Sepia → Noir) | Changement de ton sans couper | Pivot dramatique, révélation |
| **11. Whip Pan + Style Switch** | Whip pan 60f blur + changement de style à mi-blur | Transition énergique entre deux zones ET deux tons | Coupes montage rapide, multi-pays |
| **12. Zoom Out + Style + Zoom In** | Zoom out → change style → zoom in sur nouveau lieu | Voyage entre deux réalités géographiques | Connecter deux pays distants (ex: Chine → Maroc) |

### 5 Techniques Overlay validées headless (Overlay Lab v1 + v2)

Référence v1 : https://files.catbox.moe/gy3j6v.mp4
Référence v2 : https://files.catbox.moe/sbpmr4.mp4

| Technique | Mécanique | Cas d'usage |
|-----------|-----------|-------------|
| **Fill-Pattern drapeau** | Image drapeau tuilée sur le territoire via `addImage` + `fill-pattern` | Identifier visuellement un pays sur la carte |
| **Line Dasharray animé** | Lignes pointillées qui "courent" le long d'un tracé | Routes commerciales, pipelines, flux animés |
| **Fill-Extrusion 3D** | Polygones qui montent en 3D (hauteur proportionnelle à une valeur) | Comparaison production par pays, volumes |
| **Markers Spring Pop** | DOM markers avec animation spring Remotion au moment exact du mot | Labels de villes/pays qui apparaissent sur cue audio |
| **Canvas animé (updateImage)** | Canvas off-screen animé frame par frame, appliqué comme texture Mapbox | Gradients pulsants, halos, overlays premium |

### Règles d'enchaînement Mapbox

- **Mapbox → Template data** : utiliser Blur Atmo (7) pour fondre la carte, puis cut
- **Template data → Mapbox** : fade in Mapbox depuis noir ou depuis le dernier frame data
- **Mapbox → Mapbox** : Whip Pan 60f (blur CSS) — JAMAIS un cut sec entre deux cartes
- **Max 2 séquences Mapbox dans un Short 90s** — au-delà, le viewer perd le fil géographique
- **Pattern "1 seule Map continue"** pour multi-lieux liés (ex: Kénitra + Khouribga + Détroit) : même instance Map, jumpTo séquentiels — plus fluide qu'instancier plusieurs Maps

---

## RÈGLES D'ENCHAÎNEMENT (aide à la sélection)

**Séquences éprouvées :**
- Révélation data : `PulseNumber → BarRace → ScaleShock` (chiffre solo → comparaison → choc)
- Investigation : `Caviardage → FilRouge → ArbreAPalabres` (document → enquête → réseau)
- Trilogie preuve : `TextChoc → SourceProuve → ChiffreChoc` (affirmation → preuve → ampleur)
- Géopolitique : `LeCadranSolaire → Palimpseste → NoeudTisserand` (pivot historique → nouvelles routes → goulot actuel)
- Pouvoir : `PortraitSilhouette → LeSceau → ArbreAPalabres` (acteur → acte → réseau)
- Chute : `EffetDomino → LoomWipe → nouvelle séquence` (cascade → transition → suite)

**Alternance tension/respiration (règle des 3) :**
- Pas plus de 3 templates analytiques d'affilée sans VoixDuPeuple ou DateBar
- Après un LeSceau ou ChiffreChoc : insérer une transition (LoomWipe ou SovereignEclipse)
- Les templates "expérimentaux" (Groupe G) = max 1 par vidéo

---

## FOND (SouverainScene backgrounds disponibles)

| Valeur | Apparence | Utilisation |
|---|---|---|
| `dark-dots-navy` | Navy profond + grille de points ivoire | Templates analytiques, data, géopolitique |
| `slate-medium` | Ardoise moyenne | Personnages, narration, respiration |
| `kraft-dark` | Kraft texturé sombre | Moments historiques, documents, sceaux |
