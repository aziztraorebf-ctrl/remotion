# WARMAP VIVANTE — Grammaire de réalisation (R&D chaînes de référence)

> Créé 2026-06-09. Dérivé du décodage Historia Civilis + mapsinanutshell (frames vues de mes yeux)
> + acquis K&G/BazBattles (`out/_r-and-d/decode-channels/README.md`). MOTIF : B1 (Acte 2 Sahel) a raté
> par "empiler des icônes" au lieu de "transformer la carte". Ce playbook est la grammaire qui manquait.
> Frames preuves : `out/_r-and-d/decode-channels/{historia-civilis,mapsinanutshell}/`.
> Complète (ne remplace pas) : `WARMAP-LONG-DOCTRINE.md` (structure/actes) + `WARMAP-PLAYBOOK.md` (briques/R1-R6).

---

## LA LOI CENTRALE (les 2 références la prouvent par 2 chemins opposés)

> **Lisibilité = invariance du vocabulaire + UNE SEULE transformation à la fois.**

- **mapsinanutshell** l'obtient par MONOTONIE : 1 seul type d'événement (le front qui avance), carte
  fixe, caméra immobile. Viral par la DONNÉE ("every day"), pas par la mise en scène. = mur-timelapse.
- **Historia Civilis** l'obtient par DISCIPLINE : vocabulaire minuscule (carrés colorés) + board clearing
  radical entre chaque idée + 1 plan = 1 transformation. = récit lisible malgré une esthétique PowerPoint.
- **B1 a violé les DEUX** : vocabulaire hétérogène (jetons combat + bases + flux + uranium + accords 1960)
  ET plusieurs transformations simultanées, carte jamais nettoyée. → bruit illisible.

---

## ⚡ DYNAMISME (ajouté 2026-06-09 — recherche last30days + critiques Aziz sur B1 V2)

> **POURQUOI cette section** : nos 2 références décodées (Historia Civilis = PowerPoint statique,
> mapsinanutshell = timelapse monotone) sont des CONTRE-MODÈLES de dynamisme. On a appris d'elles la
> DISCIPLINE (board clearing, 1 idée) mais PAS le mouvement. Résultat : B1 V2 = propre mais MORT
> (19s sans rien au début, caméra figée vue large, timeline gelée). En SUR-corrigeant l'empilement,
> on a créé le vide. Cette section rétablit l'équilibre. Sources : recherche métier (Moshion,
> EdicionVideoPro, MapLibrary, GeoLayers, Animaps) + standards retention 2026.

### D-0 — RÈGLE D'OR AZIZ (la plus stricte, prime sur tout)
> **JAMAIS 5 SECONDES SANS MOUVEMENT VISIBLE qui accroche le regard.**
> Mouvement visible = un déplacement, un pulse, une révélation, quelque chose qui SE PASSE sur la carte.
> "On a largement de quoi faire." S'applique MÊME (surtout) sur une carte technique/sérieuse comme une
> war-map. Le standard métier dit 3-4s (au-delà = "freeze feeling", le viewer décroche) ; notre règle = 5s
> MAX, mais viser moins. C'est la règle n°1 — un beat qui la viole est à refaire, peu importe sa propreté.

### D-1 — DENSITÉ : 6-8 événements pour un beat <60s (standard métier chiffré)
B1 V2 ratait avec ~4 événements dont 19s de vide. Viser **6-8 temps forts** (= "waypoints") sur ~52s.
Entre les gros événements (avion, convoi, bases), REMPLIR avec des micro-événements : pulse de ville,
révélation de label, micro-zoom, frémissement d'une zone. La carte ne se repose JAMAIS complètement.

### D-2 — KEN BURNS PERMANENT : pan continu 10-15 px/s sur les temps "calmes"
Même quand "rien" ne se passe narrativement, la caméra DÉRIVE (10-15 px/s) — c'est l'anti-freeze.
L'Acte 1 le fait déjà (drift blueprint). B1 V2 l'avait perdu. À ne JAMAIS retirer.

### D-3 — START WIDE → ZOOM SERRÉ (la caméra raconte, ta critique #4)
Standard métier : ouvrir LARGE (contexte spatial) PUIS **zoomer SERRÉ sur l'action**. Rester en vue large
tout le temps = faute (perte de dynamisme ET de lisibilité). On PEUT perdre du territoire — on n'a pas
besoin de tout voir tout le temps. Exploiter zoom/pan/pitch (GeoLayers fait scroll+zoom+pitch+rotate ;
nous on n'exploite quasi rien). Le hors-champ est un OUTIL, pas une peur. NB : ceci NUANCE R-V3 (qui
interdisait le PULL-BACK continental injustifié) — le zoom IN serré sur l'action est au contraire ENCOURAGÉ.
La règle exacte : zoom/pan AU SERVICE de l'action (suivre, révéler, dramatiser), jamais "dézoomer pour tout montrer".

### D-4 — TIMELINE TOUJOURS VIVANTE (ta critique #1)
Le curseur de temps GLISSE en continu, jamais figé (sauf arrêt narratif explicite type B6 "le temps s'arrête").
Un beat qui couvre 2013→2022 DOIT montrer le temps avancer. Brancher sur les bornes du beat.

### D-5 — COLOR PACING : alterner chaud/froid (anti-monotonie)
Découverte recherche qu'on n'avait pas. Alterner moments **chauds/vifs** (haute énergie : un acteur arrive,
une zone s'embrase) et **froids/doux** (calme : respiration, lecture). Crée un RYTHME au lieu d'une intensité
constante OU d'une fadeur constante. B1 V2 était monotone (sépia uniforme partout) = une des causes du "mort".
Ne pas tout garder au même niveau chromatique : le pic d'un acteur peut réchauffer la palette localement.

### D-6 — JETON-ACTEUR > ICÔNE ILLUSTRATIVE (ta critique #3, confirmée recherche)
Un objet illustratif générique (avion qui vole) dit "un avion a volé". Un JETON-ACTEUR (notre grammaire,
cohérent avec JNIM/EIGS) dit "X est un acteur sur cette carte". Le signal métier (@squatsons, @AthenumMap) :
le problème n'est jamais l'objet, c'est la CLARTÉ de l'acteur et de son emprise. Préférer le jeton-acteur +
son emprise territoriale qui se dessine. Réserver les sprites-véhicules (avion/convoi) aux FLUX (mouvement
de ressource/logistique), PAS pour représenter un acteur politique (= jeton).

### D-7 — "ON NOMME → ÇA SE DESSINE" (standard war-map, idée Aziz 2026-06-09) ⭐
> Quand la voix NOMME un territoire, il se DESSINE / s'allume à l'écran. C'est un STANDARD pour nos cartes.
Mouvement GRATUIT + signifiant à chaque toponyme — résout dynamisme ET lisibilité ("on voit OÙ l'action se passe") d'un coup.
- **Région/pays nommé** (Mali, Niger, Burkina) → silhouette admin se DESSINE (stroke-dashoffset) + se teinte
  de sa couleur de contrôle. Brique déjà existante Acte 1 : `A1_REGION_PULSES` (reprojection admin-1 frame-driven). À GÉNÉRALISER.
- **Ville/point nommé** (Gao, Arlit, Niamey) → pop + pulse (3 ondes) + label qui se trace.
- **Cadence** : la narration cite ~6-8 toponymes/beat → à elle seule, fournit quasi tous les événements D-1,
  tous synchro-voix (forced-alignment). C'est le SQUELETTE de mouvement d'un beat war-map, à compléter par
  les acteurs/flux. Couleur = celle du contrôle (bleu État / ocre contesté / rouge JNIM-EIGS), pas décorative.
- Variations possibles même famille (Aziz) : épaisseur frontière qui monte, hachure qui se remplit, halo bref.

### D-8 — OVERLAY REMOTION "COMPLÉMENT ANIMÉ" sur la carte (3e registre, idée Aziz 2026-06-09) ⭐⭐
> Certains concepts sont DURS à montrer sur une carte : un mécanisme économique, une chronologie longue,
> une proportion, un accord juridique invisible. On les EXPLIQUE via un graphisme Remotion semi-transparent
> par-dessus la carte qui CONTINUE DE VIVRE derrière (drift doux). On ne quitte JAMAIS la carte.
>
> ⛔ RÈGLE N°1 (corrigée après échec B1 V3) : un overlay qui AFFICHE LE TEXTE QUE LA VOIX PRONONCE = un
> SOUS-TITRE = INTERDIT. Erreur commise B1 V3 ("Pourquoi la France en 11 jours ?" pendant que la voix le
> dit = redondance, n'apporte rien, rejeté Aziz). L'overlay légitime MONTRE ce que la voix NE dit PAS
> visuellement : un MÉCANISME, une PROPORTION, une CHRONOLOGIE, un FLUX, une COMPARAISON — du SENS, pas du texte.
>
> ⛔ RÈGLE N°2 : la carte NE FREEZE JAMAIS. Elle continue de drifter/bouger derrière l'overlay semi-transp.
> L'overlay apparaît en FONDU, illustre, DISPARAÎT en fondu. (≠ le Sudan WarMapOverlayExplicatif qui FIGEAIT.)
>
> ⛔ RÈGLE N°3 (Aziz) : l'overlay est l'EXCEPTION, pas la règle. La plupart des zones molles doivent RESTER
> sur la carte et être mieux MEUBLÉES (mouvement/événement/transformation cartographique). N'utiliser l'overlay
> QUE pour les concepts VRAIMENT impossibles à montrer cartographiquement. Garder le MAXIMUM sur la carte.
>
> Pour CHAQUE zone molle, arbitrer : (A) overlay-complément justifié (concept invisible) OU (B) meubler SUR
> la carte (et préciser par quelle animation cartographique). Préférer B par défaut.

- C'est le pont entre l'arsenal DATA-VIZ Souverain (StackedBars, ProcessFlow, CountUp, frises, schémas de flux)
  et la war-map : importer cette puissance graphique PAR-DESSUS la carte vivante, sans sacrifier premium ni action.
  Registre que ni K&G ni Historia Civilis n'ont (eux figent/coupent) = différenciateur.
**RÈGLES CONSOLIDÉES (upstream Gemini+Kimi+DeepSeek 2026-06-09, convergence totale) :**
- **Overlay = STRUCTURE, jamais le texte de la voix.** Test pro : "si je ferme les yeux et comprends la même
  chose, l'image est inutile." Conçois l'overlay en partant de "qu'est-ce que la voix NE dit PAS ?". Ex : voix
  dit "11 jours" → overlay montre les AUTRES interventions (frise comparative) pour révéler que 11j est
  exceptionnel — pas le chiffre 11 en gros (= sous-titre).
- **Règle des ~3-5 mots / 1 idée par overlay.** Que des chiffres + formes/icônes SVG + labels minimaux
  (noms propres, dates que la voix NE cite pas). Jamais une phrase complète.
- **La carte ne freeze JAMAIS** : drift continu (même +15% pendant l'overlay pour compenser), micro-mouvement
  interne de l'overlay (jamais parfaitement statique). Voile cream `#F3E9C8` ~70-85% JAMAIS noir.
- **L'overlay NAÎT de la carte** (clipPath/mask depuis le jeton ou une coordonnée géo), pas un panneau flottant.
- **1-2 overlays MAX/beat (viser 1).** Durée 6-14s. Transition : voile fade 0.5s → éléments en STAGGER 0.1-0.2s
  (jamais bloc d'un coup) → sortie inverse. Espace négatif : overlay ≤40% surface, marges ≥10%.
- **FACTUEL ABSOLU** : ne JAMAIS inventer un chiffre. Vérifier (WebSearch) avant. Sinon angle qualitatif sans chiffre.
- Easing : `cubic-bezier(0.16,1,0.3,1)` (ease-out-expo) apparitions · spring damping élevé (pas de bounce cartoon).

**ARBITRAGE PAR ZONE (la méthode, validée Aziz) — préférer (B) meublage-carte, (A) overlay = exception :**
Pour chaque zone molle : (A) overlay justifié SEULEMENT si concept invisible cartographiquement (chrono longue,
proportion, comparaison historique, chaîne de décision) · (B) sinon MEUBLER SUR LA CARTE. Briques de meublage :
- **Lignes de tension** (`TensionLine from→to`, stroke or pointillé animé) = liens invisibles (accords, alliances)
  tracés sur la carte (ex : Paris hors-champ → capitales africaines = "toile juridique").
- **Zones d'influence** = cercles semi-transp (opacity 0.1, bordure pointillée) qui s'étendent (spring) autour
  d'une base et S'INTERSECTENT = "verrouillage du triangle". Casse la répétition d'un simple pop.
- **Révélation de ressources** = icônes (uranium/pétrole/or) qui apparaissent le long d'une frontière quand
  nommée ("la carte révèle ses richesses").
- **Pulse frontière** au mot ("le Niger voisin" → frontière Mali-Niger pulse).
- **Flux ocre** Arlit→France qui se DESSINE (stroke-dashoffset) = uranium sur la carte (pas besoin d'overlay).
- **Apparition séquentielle** (bases 1→2→3 + caméra recule à chaque ajout) au lieu de 3 pops simultanés.

**TYPES DE GRAPHIQUES OVERLAY validés (SVG 2D, palette parchemin) :**
- **Frise comparative** (la + puissante) : barres horizontales, l'événement-clé en or + 2-3 comparables en contour
  + un seuil de référence. Ancre un chiffre dans une SÉRIE (donc pas redondant avec la voix).
- **Sankey/flux de dépendance** : 2 cercles (source/dest) + flux `<path>` épaisseur = volume, stroke-dashoffset = "coule".
- **Negative narrative** (Neil Halloran) : ligne fantôme (ce qui N'EST PAS arrivé, opacity 0.2) sous la ligne réelle = contraste.
- **Paper-cut** : profondeur par ombres d'OPACITÉ pure (décalage +3px cream foncé 40%, pas de blur interdit) = relief pop-up book 2D.
- Barres "faites main" (stroke irrégulier, linecap round) pour rester encre, pas vecteur parfait.

**WORKFLOW DEV (Aziz) : coder l'overlay en COMPOSITION ISOLÉE d'abord** (`SahelOverlay*Demo` dans Root) → render
rapide SANS la carte ni Mapbox (valider typo/design/anim) → PUIS intégrer sur la carte. Évite de re-rendre 52s+Mapbox à chaque itération.

**Leçon** : un overlay titre/texte = INSUFFISANT (c'était du sous-titre déguisé, supprimé). À FAIRE si besoin :
composants graphiques dédiés (frise délai, flux de dépendance, ligne de tension, zone d'influence).

**DÉCISION B1 (Aziz 2026-06-09)** : UN seul overlay = frise délais d'intervention (zone 8-22s), tout le reste
meublé SUR la carte (lignes tension or accords, zones influence bases, pulse frontière, flux uranium dessiné).

### ⛔ D-9 — OVERLAYS = PREMIUM SOUVERAIN, JAMAIS "encre austère Historia Civilis" (Aziz 2026-06-09) ⭐⭐⭐
> **CORRECTION MAJEURE de doctrine.** Le 1er overlay pré-positionnement codé en style encre/parchemin
> "fait main" (petits forts dessinés, traits fins cream) a été REJETÉ par Aziz : "ça ressemble à des
> dessins de châteaux, ça descend notre niveau au lieu de le monter."
>
> **RÈGLE** : un overlay Remotion par-dessus la carte DOIT être au niveau **premium data-viz Souverain**
> (briques HERO DATA : FlowBrick, CountUp glow, HeroVerticalBars, Badge satellite, ProcessFlow, secondary
> motion, métaphore physique, transitions seamless). Le langage de référence = `SOUVERAIN-REMOTION-PLAYBOOK.md`
> + section HERO DATA de `COMPOSANTS-INDEX.md`. PAS le style encre minimaliste.
>
> **POURQUOI** : s'inspirer d'Historia Civilis (volontairement PowerPoint-austère) pour la DISCIPLINE
> narrative (board clearing, 1 idée) ne doit JAMAIS contaminer le RENDU visuel. Une référence qui pousse
> le rendu vers le bas ne sert à rien. On garde sa rigueur narrative, on REJETTE son esthétique pauvre.
> Le standard de rendu est premium PARTOUT, y compris sur la carte.
>
> **NUANCE carte** : l'overlay doit rester lisible PAR-DESSUS la carte vivante (voile, contraste). Donc
> premium Souverain ADAPTÉ au contexte carte (peut emprunter la palette parchemin pour le voile, mais les
> ÉLÉMENTS — nœuds, chiffres, flux — sont au niveau FlowBrick/CountUp, pas des croquis). Premium d'abord.

### ⚖️ ÉQUILIBRE — dynamisme SANS retomber dans l'empilement
Les règles D (mouvement) et R-V (discipline) ne s'opposent pas, elles se complètent :
- D = "il se passe TOUJOURS quelque chose" (jamais 5s mort, 6-8 événements, caméra vivante).
- R-V = "UNE chose lisible à la fois" (board clearing court, 1 transformation focus, pas de bruit simultané).
La synthèse : un FLUX CONTINU d'événements SÉQUENTIELS — chacun lisible, mais qui s'enchaînent serré sans
trou. Le board clearing devient une TRANSITION rapide (1-2s) entre deux événements, PAS 19s de vide.

**Notre place** = la rigueur narrative d'Historia Civilis + la richesse de texture qu'aucun des deux n'a
(encre/parchemin, jetons incarnés, taches organiques) + forced-alignment automatique. JAMAIS le mur-timelapse.

---

## LES 4 RÈGLES (chacune répond à une faute de B1)

### R-V1 — BOARD CLEARING : nettoyer le plateau à chaque changement de registre
> Faute B1 : couche tactique Acte 1 laissée allumée pendant qu'on parle géopolitique. Tout reste = bruit.

**Preuve HC** : quand le sujet change (politique → guerre → Sénat), HC CUT vers un plateau VIERGE — la salle
du Sénat (gris, carrés en U), le terrain vert local, OU un carton-titre noir plein écran (`Political Purges`,
`CONSULS`, `DICTATOR`). La carte d'Italie DISPARAÎT. Il ne superpose JAMAIS deux registres.

**Chez nous** (pas de cut sec — on a UNE carte continue) :
- Estomper la couche du registre sortant à `opacity 0.15-0.25` (jamais 0 brutal : "faire le deuil", la
  trace reste fantôme). Les jetons-combattants Acte 1 passent en fantôme quand B1 entre en géopolitique.
- OU vignette focus : assombrir TOUT sauf la zone parlée (radial mask), pour isoler un registre sans
  changer de carte. = l'équivalent doux du board clearing HC.
- Le carton-titre noir de HC = notre respiration (assombrissement f2220→END Acte 1 = déjà ça). Sert de
  SÉPARATEUR sémantique entre deux idées. Utilisable comme transition entre beats (B1→B2).
- **Règle dure** : 2 registres sémantiquement distincts (tactique-combat vs géo-stratégique-ressource)
  ne coexistent JAMAIS à pleine intensité. L'un domine, l'autre est fantôme.

### R-V2 — TRANSFORMER, PAS POSER : l'information EST le changement d'état de la carte
> Faute B1 : on AJOUTE des icônes (bases, flux, sprites) à côté de la carte. Logique d'inventaire.

**Preuve HC** : rien n'est "ajouté en plus". Une cité change de main → son carré CHANGE DE COULEUR. Révolte
→ des flammes apparaissent SUR la zone. Territoire perdu → il s'assombrit en gris pointillé rouge. L'état
de la carte MUTE. **Preuve mapsinanutshell** : le seul événement = le front (rose) qui MANGE le territoire.

**Chez nous** :
- Présence française ≠ poser une pastille-base. C'est un PÉRIMÈTRE qui se dessine (stroke-dashoffset), une
  emprise qui colore une zone, une route logistique qui s'allume. La carte change d'état.
- Flux d'armes Libye ne doit pas être un arc décoratif → il CAUSE le grossissement de la tache rouge
  (la cause précède l'effet, lien visible). Causalité, pas juxtaposition.
- Un sprite mobile (avion, convoi) ne s'ajoute pas : il TRACE (laisse une veine d'encre = le flux permanent)
  puis se résorbe. Le mouvement EST le flux, pas un objet en plus posé sur un flux déjà dessiné.

### R-V3 — DISCIPLINE CAMÉRA : PAN/glisse serré, JAMAIS pull-back continental
> Faute B1 : zoom out continental que l'Acte 1 ne fait jamais → vide océanique + perte du serré tactique.

**Preuve HC** : la caméra ne fait quasi JAMAIS de pull-back. Elle PAN latéralement ou CUT entre 3 échelles
FIXES (Italie / Méditerranée / terrain local). **Preuve mapsinanutshell** : caméra immobile, c'est le front
qui bouge dans le cadre. Aucune des deux ne "dézoome pour tout montrer".

**Chez nous** :
- Rester au zoom serré Acte 1. Pour révéler un nouveau lieu (Mali→Niger) : GLISSER en PAN serré, pas dézoomer.
- Hors-champ assumé : la France hors-cadre = une route qui SORT du cadre + un label suffit. On ne dézoome
  PAS pour "faire rentrer la France". Le hors-champ est un outil narratif (cf. HC qui garde l'Italie serrée
  même quand l'action est en Hispanie — il met un carton-titre, il ne dézoome pas).
- Mouvement caméra = intention narrative (CLAUDE.md) : suivre un sprite, révéler le lieu suivant. Jamais "voir plus large".

### R-V4 — UNE IDÉE = UN PLAN = UNE TRANSFORMATION (synchro voix)
> Faute B1 : 5 choses en même temps, lambda décroche.

**Preuve HC** : chaque proposition de la narration a SON plan dédié. 1 carré bouge à la fois. Jamais 2
mouvements simultanés. Le carton-titre noir sépare les idées. **Preuve mapsinanutshell** : 1 seul type
d'événement sur toute la vidéo.

**Chez nous** (règle "1+1") :
- MAX 1 objet mobile à la fois. Quand un sprite bouge, tout le reste → opacity 0.3 (hiérarchie forcée).
- 1 transformation = 1 segment de narration (forced-alignment). RESPIRATIONS statiques entre (la carte
  respire, on lit la trace laissée). MAX ~3 événements mobiles sur 30s.
- Si ça surcharge au render : COUPER (sacrifier le sceau/le réseau secondaire). Densité = ennemi n°1.

---

## HIÉRARCHIE PAR SOUSTRACTION (méta-règle qui sous-tend les 4)
HC : quand un acteur est important, TOUT le reste disparaît (plan terrain vert, 1 seul carré au centre).
Le vide négatif est INTENTIONNEL et focalise le regard. B1 avait du vide océanique NON-intentionnel
(centrage maths). → Le vide se MÉRITE : on enlève pour souligner, on ne laisse pas traîner par hasard.

## CAUSALITÉ HUMANISÉE SANS PERSONNAGES (substitut HC, on a mieux)
HC porte la causalité par des BULLES de dialogue (`WTF!`, `DEBT ABOLITION!`, `THAT KINDA MAKES SENSE`).
Le carré qui parle = l'acteur. C'est leur substitut au manque de personnages animés. NOUS avons jetons
incarnés (chèche/cagoule) + PixelLab — notre incarnation est supérieure. On peut emprunter l'IDÉE (un
acteur "réagit" → micro-pulse, léger recul du jeton) sans copier les bulles cartoon (trahirait l'ADN doc).

---

## CE QUI EST DÉJÀ ACQUIS (ne pas re-décoder)
- **K&G / BazBattles** : grammaire de BATAILLE tactique (manœuvre de masses, file→ligne→charge) — décodé
  2026-06-04, `out/_r-and-d/decode-channels/README.md` + `DECODE-bazbattles-manoeuvres.md`. Différent du
  registre territorial-temporel ici. Utile pour les beats COMBAT, pas pour les transitions géopolitiques.
- **Grammaire d'apparition des objets** (cadence pop, <=6 objets, 1/3-5s, pop près du dernier point nommé,
  atterrissage spring) : README decode-channels §1. S'applique direct aux bases B1.
- **mapsinanutshell écosystème/cadence** : `DECODE-daybyday-warmap.md` (déjà écrit, dimension business/pipeline).
  CE fichier ajoute leur dimension VISUELLE manquante (= mur-timelapse, contre-modèle de mise en scène).

---

## APPLICATION DIRECTE AUX BEATS (les 4 règles, valables tout l'Acte 2 V5)
> NB : le plan "B1 sprites" original est ABANDONNÉ (refonte script V5 linéaire 2026-06-10, voir STATUS.md).
> La GRAMMAIRE ci-dessous reste la règle pour coder les beats des Parties 1-4.
1. **R-V1 d'abord** : entrer dans un nouveau beat = estomper l'état précédent (opacity→0.2) + vignette focus. Condition n°1.
2. **R-V3** : caméra = PAN serré / Ken Burns continu sur la zone nommée. JAMAIS pull-back injustifié.
3. **R-V2** : un flux trace une veine (pas une pastille). Une emprise = périmètre qui se dessine, pas un sticker. Le flux CAUSE le changement.
4. **R-V4** : 1 sprite mobile à la fois, reste à 0.3, respirations entre. Couper si surcharge.
5. Soustraction : assumer le hors-champ France (route qui sort + label), ne pas dézoomer pour la montrer.

→ Render → downstream Gemini/Kimi de contrôle (da-brief.py), 1 appel max, Gemini consultatif jamais juge.
