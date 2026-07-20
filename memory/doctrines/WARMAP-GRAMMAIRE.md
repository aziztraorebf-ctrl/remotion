---
name: War-Map — Grammaire de réalisation (le standard narratif unifié)
description: LA doctrine de réalisation War-Map. Fusion des 3 fichiers (CAUSALE + VIVANTE + CARTE-VS-OVERLAY). Montrer la CAUSE avant l'EFFET, mais la carte sert au CAUSAL/SPATIAL — le CONCEPTUEL va en overlay solide ou plein écran. Catalogue des techniques causales, dynamisme D-0→D-9, 4 règles de discipline R-V, templates overlay validés. NON-NEGOTIABLE tout war-map.
type: project
---

# WAR-MAP — GRAMMAIRE DE RÉALISATION (LIRE AVANT DE CODER TOUTE WAR-MAP)

## ⚡ SOMMAIRE EXÉCUTIF — RÈGLES NON-NEGOTIABLE (extrait du corps, détail ci-dessous)

- **⭐⭐ CONTOUR PERMANENT + INTÉRIEUR VIDE = LA CARACTÉRISTIQUE CENTRALE (Aziz 2026-07-07, "les parties les plus importantes").** Le(s) territoire(s) actif(s) ont un **contour TOUJOURS présent** (squelette permanent, encre affirmée). Leur **intérieur reste TRANSPARENT/crème UNI** — aucune bordure interne, aucun remplissage, aucun label parasite. Cette **surface vide est la TOILE de l'action** (jetons, flèches, halos). Les voisins/hors-sujet = assombris (kaki/olive, voile SVG troué à la forme du pays) → l'œil ne va QUE sur le territoire actif. Réf : `warmap-sahel-aes-FINAL.mp4`. Implémentation : `reskinMap()` (land crème uni, symboles masqués) + contour national permanent + voile khaki troué.
- **⭐⭐ JAMAIS D'APLAT DE FACTION PLEIN — la couleur RAYONNE localement, elle ne "colorie" pas le pays (Aziz 2026-07-07, confirmé sur contre-exemple).** Dans TOUTE la vidéo AES, on ne voit JAMAIS un état/pays rempli en aplat de couleur pleine. C'est un ANTI-PATTERN (testé, rejeté : `soudan-socle-test.mp4` avec états bleu/rouge/or pleins = FAUX). Le bon système : le fond reste **crème+contours en permanence** ; une faction se manifeste par un **HALO de couleur DOUX et LOCAL qui rayonne autour du jeton/de l'action** (le rouge RSF s'étend depuis Hemeti, le bleu SAF depuis al-Burhan), en dégradé diffus, SANS bord net d'état, SANS jamais peindre la carte entière. La couleur SUIT l'action, elle ne remplit pas la géographie. **Nuance autorisée** : pour une bascule territoriale précise (ex. "El Fasher tombe"), une teinte douce (opacité ~0.25 max) peut monter BRIÈVEMENT sur CET état seul le temps du beat, puis redescendre — jamais permanent, jamais toute la carte. Réf halo : le halo rouge translucide autour des jetons + la zone grise qui déborde dans AES.
- **CAUSE avant EFFET** — un territoire ne change jamais par magie : un acteur agit → le territoire change en conséquence (§1)
- **Carte = CAUSAL/SPATIAL ; overlay = CONCEPTUEL** — ce qui n'a pas d'ancrage géographique va en overlay solide ou plein écran, puis on revient sur la carte (§2)
- **JAMAIS 5 secondes sans mouvement visible** — déplacement, pulse, révélation ; viser moins (D-0)
- **1 transformation à la fois** — MAX 1 objet mobile, reste à opacity 0.3 ; jamais 2 mouvements simultanés (R-V4, D-0)
- **BOARD CLEARING entre registres** — estomper la couche sortante à opacity 0.15-0.25 avant d'entrer dans le registre suivant (R-V1)
- **Overlay SEMI-TRANSPARENT BANNI** — `WarMapOverlayDynamic mode="semitransp"` interdit dans toutes les vidéos ; 2 seules options : plein écran opaque OU représentation sur la carte (§9)
- **WarMapDimmedOverlay = AUTORISÉ** (≠ semi-transparent banni) : voile fort ~0.62 + trou dans les contours sous l'élément — la carte n'est plus lisible dessous (§6)
- **Overlay TOUJOURS ANIMÉ** — jamais une plaque statique posée plusieurs secondes pendant que rien ne bouge (§9)
- **"On nomme → ça se dessine"** — chaque toponyme cité déclenche un contour/allumage/pulse sur la carte, couleur porteuse de sens (D-7)
- **Ken Burns PERMANENT** — drift continu 10-15 px/s même sur les temps "calmes" ; ne jamais retirer (D-2)
- **Caméra : PAN serré, JAMAIS pull-back continental** — zoom IN sur l'action encouragé ; le pull-back "pour tout montrer" est banni (R-V3, D-3)
- **Overlays = PREMIUM SOUVERAIN** (FlowBrick, CountUp glow, HeroBars, ProcessFlow…), jamais style "encre austère" (D-9)
- **Ancrage géo vérifié avant code** — test §2 obligatoire : "ancrage géographique réel ?" OUI → sur carte ; NON → overlay solide/plein écran
- **6-8 événements pour un beat <60s** — entre les gros jalons, micro-événements (pulse, label, micro-zoom) pour ne jamais laisser la carte au repos (D-1)
- **Overlay = MÉCANISME, jamais le texte de la voix** — un overlay qui affiche ce que la voix prononce = sous-titre = interdit (§8, D-8)
- **⭐ SOUS-DIMENSIONNEMENT RÉCURRENT** — tout objet/effet (sprite, zoom, trajectoire, flash) doit être visible dès le premier coup d'œil sur render RÉEL, pas juste correct dans le code ; réflexe = agrandir/étaler/allonger l'ensemble, jamais une valeur isolée (R-V5)

---

> ⭐ **NON-NEGOTIABLE — LIRE AVANT DE CODER TOUTE WAR-MAP.**
> **Provenance — fusion de 3 fichiers de doctrine** (consolidés 2026-06-15) :
> - `WARMAP-GRAMMAIRE-CAUSALE.md` (12 juin 2026, Sahel P2) — la règle d'or cause→effet + 5 techniques causales + règle overlay semi-transp banni.
> - `WARMAP-VIVANTE-GRAMMAIRE.md` (9 juin 2026, décodage Historia Civilis + mapsinanutshell) — le dynamisme D-0→D-9 + les 4 règles de discipline R-V + arsenal overlay détaillé.
> - `WARMAP-CARTE-VS-OVERLAY.md` (14 juin 2026, session Polish Chantier 3) — quand sortir de la carte + 2 templates validés.
>
> **⚠️ ARBITRAGE VALIDÉ AZIZ (la version corrigée PRIME)** : la règle CARTE-VS-OVERLAY (14 juin) CORRIGE la
> lecture trop dogmatique de "tout sur la carte" (12 juin). La carte sert au **CAUSAL** et au **SPATIAL** ;
> tout ce qui est **CONCEPTUEL** (accord, donnée pure, concept abstrait) va en **overlay solide ou plein écran**,
> PUIS on revient sur la carte. La grammaire causale reste valide, mais NUANCÉE par cette règle maîtresse.
>
> Le polish ne suffit PAS : une carte "belle mais qui montre des états qui poppent" est CONFUSE et rejetée.
> Ce qui sauve = la causalité visible. Référence vidéo : `out/episodes/warmap-sahel/p2-FINAL.mp4` (catbox gfsa3h).

---

## 1. LA RÈGLE D'OR : CAUSE avant EFFET

Un territoire ne change JAMAIS par magie. **Un acteur AGIT → le territoire change EN CONSÉQUENCE.**
Ne jamais faire apparaître un RÉSULTAT (zone rouge qui pop, base qui s'efface, capitale qui bascule) sans
montrer d'abord sa CAUSE (les jetons qui avancent/encerclent/franchissent).

**TEST DE LISIBILITÉ (Kimi, à appliquer à chaque scène)** : *coupe le son. Si un œil neuf comprend
« des gens avancent, assiègent des forts, le territoire devient rouge » → gagné. S'il voit juste des taches
apparaître → c'est de l'AI-slop narratif, à refaire.*

**Pourquoi c'est vital** : sans causalité, on retombe dans le "bordel confus du départ" — le spectateur voit du
beau mouvement sans comprendre QUI fait QUOI ni POURQUOI. La causalité = ce qui sépare une carte météo
(états qui changent) d'une carte de bataille (récit de causes et d'effets).

---

## 2. CARTE vs OVERLAY : quand sortir de la carte (RÈGLE MAÎTRESSE — elle encadre tout le reste)

> Gravé 2026-06-14 (Aziz, session Polish Chantier 3). Décision de MÉTHODE valable pour TOUTES les scènes
> War-Map. Corrige une erreur d'interprétation de la grammaire causale (section 1).

### L'erreur qu'on faisait
On interprétait "tout sur la carte" trop DOGMATIQUEMENT → on FORÇAIT sur la carte des choses qui n'y ont pas
leur place naturelle (un accord institutionnel, une donnée pure, un concept abstrait). Résultat : métaphores
plaquées faibles (liens qui se tracent + mini-sceau noyé) au lieu d'un récit clair. Sur un PETIT territoire
(3 pays voisins), c'est encore pire : pas la place de faire quelque chose de premium.

### La règle juste (Aziz 2026-06-14)
**La carte sert au CAUSAL et au SPATIAL. Tout ce qui se lit mieux HORS-SOL mérite un overlay solide ou un
plein écran, PUIS on revient sur la carte.**

| Va SUR la carte (causal/spatial) | Va en OVERLAY/PLEIN ÉCRAN (conceptuel) |
|---|---|
| jeton qui avance / prend une ville | un ACCORD institutionnel (confédération, traité) |
| territoire qui change de main (couleur) | une DONNÉE pure (chiffre, ratio, comparaison) |
| drapeaux/couleurs projetés dans polygone | un CONCEPT abstrait (le franc CFA, la dette) |
| déplacements, flux, exode, sillages | une métaphore qui n'a pas d'ancrage géographique |
| frontières qui se tracent, fronts | une liste, un classement, une chronologie dense |
| acteurs ancrés à de VRAIS lieux + liens géo (P1) | un schéma d'alliance entre entités non-localisées |

### Test à se poser AVANT de coder une scène
> "Ce que je veux montrer a-t-il un ANCRAGE GÉOGRAPHIQUE réel (un lieu, un mouvement, un territoire) ?"
> - OUI → sur la carte (grammaire causale, section 1 + techniques section 4).
> - NON (c'est un concept, un accord, une donnée) → overlay solide central OU plein écran, puis retour carte.

### Garde-fous (ne pas tomber dans l'excès inverse)
1. **La carte reste le FIL CONDUCTEUR** et le lieu du causal — c'est notre différentiel (Bellona/Sahel
   Chronicles ne l'ont pas). On ne bascule PAS tout en plein écran (sinon on perd la carte vivante).
2. **L'overlay/plein écran est un OUTIL qu'on dégaine SANS HÉSITER** pour le conceptuel — on ne l'osait pas
   assez. Les chaînes de réf ne se gênent pas pour le plein écran ; nous avons EN PLUS l'option de ne pas
   toujours casser la carte (cartouche central solide = la carte reste visible autour).
3. **Toujours REVENIR sur la carte** après l'overlay (le fil narratif géographique reprend).
4. Outils dispo : `WarMapOverlayDynamic` mode `"card"` (cartouche opaque, carte visible autour) ou
   `"fullscreen"` (plein écran opaque, casse la carte). `"semitransp"` BANNI (voir section 9).

---

## 3. CARTE — LES 5 TECHNIQUES CAUSALES (recettes réutilisables)

> S'appliquent à tout ce qui passe le test section 2 = "OUI, ancrage géographique".

### 3.1 L'AVANCÉE — jetons qui se déplacent + SILLAGE qui colore le territoire
**Effet narratif** : "les groupes armés prennent du terrain." Le territoire rouge NAÎT de leur passage.
**Recette** :
- Jetons = acteurs avec waypoints `{f, lon, lat}[]` interpolés frame-driven → `interpWaypoints()` (kit).
- Le SILLAGE : échantillonner les positions PASSÉES de chaque jeton (tous les ~12 frames depuis son apparition
  jusqu'à la frame courante) → cercles dans un `<mask>` flouté (`feGaussianBlur stdDeviation~16`) → une nappe
  rouge `mix-blend-mode: multiply` n'apparaît QUE sous le mask. "Wet ink" : chaque empreinte grandit avec l'âge.
- Résultat : le rouge se révèle DERRIÈRE le jeton, progressivement, jamais un pop.
**Anti-pattern** : une zone rouge qui apparaît seule (sans acteur) = incompréhensible. Un sillage en ronds
visibles (mask non flouté) = "taches rondes". Flouter pour une nappe continue.
**Code** : `Partie2Blocage.tsx` (sillageStamps + mask p2-sillage). Jetons 4-6 max à l'écran.

### 3.2 LA CHUTE D'UNE BASE — en 3 temps (jamais une disparition magique)
**Effet narratif** : "la base tombe parce qu'elle est attaquée." La cause (l'attaque) précède l'effet (la chute).
**Recette (3 temps)** :
1. APPROCHE : les jetons avancent jusqu'à la base (waypoints qui convergent vers sa coord).
2. PRESSION : un pulse d'alerte ROUGE qui bat (~30-40f) sur la base juste avant la chute (`baseState.alert`).
3. CHUTE : à `fallAt`, la base s'EFFACE TOTALEMENT (opacity→0 sur ~50f, grayscale+brightness) + fumée
   PixelLab (`smokePingPong`, ambiant, qui se DISPERSE après +9-15s, ne brûle pas éternellement).
**Anti-pattern** : base qui brûle/disparaît sans qu'on voie l'attaquant = "pourquoi ça disparaît ?". Fumée qui
persiste tout le reste de la scène = sature les beats suivants. Explosion en boucle = une explosion ne se dé-explose pas.
**Décision Aziz** : effacement TOTAL (territoire perdu = plus aucune présence), pas désaturation partielle.
**Code** : `Partie2Blocage.tsx` (baseState 3 temps + halos alerte + fumée disperse).

### 3.3 LA DONNÉE QUI SE MONTRE — le "40%" par le territoire qui se remplit
**Effet narratif** : "40% du Burkina échappe à l'État" → on VOIT 40% du pays devenir rouge, on ne le LIT pas.
**Recette** :
- Vrai contour du pays projeté (`sahelCountries.ts`, décimé depuis le geojson) → `clipPath`.
- Un `<rect>` rouge `multiply` qui MONTE depuis le bas du pays jusqu'à 40% de sa hauteur (clippé au contour).
- + contour flash (technique 3.4) au moment où le pays est nommé.
**Anti-pattern** : un overlay chiffré "40%" en coin d'écran qui répète la voix = inutile, hors-centre, supprimé.
La data-viz jauge circulaire = aussi supprimée (même raison). **Règle : la donnée se MONTRE, jamais ne s'écrit.**
(NB : une donnée pure SANS ancrage spatial relève de la section 2 = overlay/plein écran. Ici "40% d'un pays"
A un ancrage = ça se montre SUR le territoire.)
**Code** : `Partie2Blocage.tsx` (burkinaFill + clipPath p2-burkina-clip).

### 3.4 LE CONTOUR DE TERRITOIRE NOMMÉ — se dessine + flash (technique SYSTÉMATIQUE)
**Effet narratif** : guider l'œil quand on nomme un pays. Le contour se TRACE + un flash pulse.
**Recette** : `countryOutline()` (kit) — stroke-dashoffset qui se trace sur ~40f + halo flash au bout du tracé.
Couleur PORTEUSE DE SENS : rouge=menace jihadiste, kaki=junte militaire, or=AES, orange=CEDEAO.
Renforcé : double trait (glow épais 7 + trait net 3.6) + halo de remplissage au flash.
**Anti-pattern** : nommer un pays sans repère visuel = l'œil ne sait pas où regarder. Caméra trop serrée = le
contour déborde du cadre (élargir pour que le pays entier soit visible quand on le nomme).
**Code** : `countryOutline` dans `warmapPremiumKit.ts`, contours dans `sahelCountries.ts`.

### 3.5 CASSER LA GRAMMAIRE pour un acteur DIFFÉRENT (le coup d'État ≠ les groupes armés)
**Effet narratif** : distinguer un coup d'État militaire (acteur institutionnel) de l'avancée jihadiste.
**Recette** : un JETON militaire distinct (jeton-junte, officier béret) se pose sur la capitale, couleur KAKI
(pas le rouge jihadiste), événement PONCTUEL (pas de sillage). Contour kaki du pays.
**Anti-pattern** : utiliser le même rouge/la même mécanique → le spectateur croit "les jihadistes ont pris le
pays". Une forme abstraite (losange/étoile) = cheap sur une carte riche. Tout marqueur = jeton/sprite à notre identité.

### Règles transversales des techniques causales
- **Combiner l'ARSENAL**, jamais un seul asset : jetons + zones + sprites Gemini + PixelLab + timeline + contours + plaques.
- **Jeton = cercle** (parchemin + bordure faction + portrait clippé, helper `chip()`), JAMAIS un portrait nu (= buste flottant).
- **Taille ancrée carte** (`spriteMapWidth`, en degrés), ne grossit pas au dézoom.
- **Timeline graduée** pleine largeur, présente dès le début (curseur date qui glisse = donne le sens du temps).
- **SFX seulement si support visuel** (retiré cedeao-snap : on ne voyait pas la CEDEAO). Silencieux sur poses/avancées.
- **1 foyer d'attention à la fois** (anti-saturation). Hiérarchie du regard : assombrir le reste pendant l'action.
- **EMPHASE CHIRURGICALE sur les territoires concernés** (Aziz 2026-06-11) : quand 1-2 territoires portent la scène
  (ex : Kidal repris, zone AES qui naît), les GARDER pleinement traités (couleur, contour, jetons) et ÉPURER tout
  le tour (carte calme, voisins atténués). On met l'emphase sur les deux parties concernées, pas sur le décor.

> Voir aussi : [[WARMAP-ANIMER-OBJETS]] (Gemini vs PixelLab + 3 règles R-OBJ) ·
> `memory/key-learnings.md` (leçon grammaire causale) · `PLAN-NARRATIF-P2.md` (modèle de plan).

---

## 4. LE DYNAMISME (D-0 → D-9)

> Dérivé du décodage Historia Civilis + mapsinanutshell (frames vues de mes yeux) + acquis K&G/BazBattles.
> MOTIF : B1 (Acte 2 Sahel) a raté par "empiler des icônes" au lieu de "transformer la carte", PUIS sa
> sur-correction V2 a créé le vide (mort). Cette section rétablit l'équilibre mouvement.
> Frames preuves : `out/_r-and-d/decode-channels/{historia-civilis,mapsinanutshell}/`.

### LA LOI CENTRALE (les 2 références la prouvent par 2 chemins opposés)
> **Lisibilité = invariance du vocabulaire + UNE SEULE transformation à la fois.**
- **mapsinanutshell** l'obtient par MONOTONIE : 1 seul type d'événement (le front qui avance), carte
  fixe, caméra immobile. Viral par la DONNÉE ("every day"), pas par la mise en scène. = mur-timelapse.
- **Historia Civilis** l'obtient par DISCIPLINE : vocabulaire minuscule (carrés colorés) + board clearing
  radical entre chaque idée + 1 plan = 1 transformation. = récit lisible malgré une esthétique PowerPoint.
- **B1 a violé les DEUX** : vocabulaire hétérogène (jetons combat + bases + flux + uranium + accords 1960)
  ET plusieurs transformations simultanées, carte jamais nettoyée. → bruit illisible.

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

### D-3 — START WIDE → ZOOM SERRÉ (la caméra raconte)
Standard métier : ouvrir LARGE (contexte spatial) PUIS **zoomer SERRÉ sur l'action**. Rester en vue large
tout le temps = faute (perte de dynamisme ET de lisibilité). On PEUT perdre du territoire — on n'a pas
besoin de tout voir tout le temps. Exploiter zoom/pan/pitch (GeoLayers fait scroll+zoom+pitch+rotate ;
nous on n'exploite quasi rien). Le hors-champ est un OUTIL, pas une peur. NB : ceci NUANCE R-V3 (qui
interdisait le PULL-BACK continental injustifié) — le zoom IN serré sur l'action est au contraire ENCOURAGÉ.
La règle exacte : zoom/pan AU SERVICE de l'action (suivre, révéler, dramatiser), jamais "dézoomer pour tout montrer".

### D-4 — TIMELINE TOUJOURS VIVANTE
Le curseur de temps GLISSE en continu, jamais figé (sauf arrêt narratif explicite type B6 "le temps s'arrête").
Un beat qui couvre 2013→2022 DOIT montrer le temps avancer. Brancher sur les bornes du beat.

### D-5 — COLOR PACING : alterner chaud/froid (anti-monotonie)
Découverte recherche qu'on n'avait pas. Alterner moments **chauds/vifs** (haute énergie : un acteur arrive,
une zone s'embrase) et **froids/doux** (calme : respiration, lecture). Crée un RYTHME au lieu d'une intensité
constante OU d'une fadeur constante. B1 V2 était monotone (sépia uniforme partout) = une des causes du "mort".
Ne pas tout garder au même niveau chromatique : le pic d'un acteur peut réchauffer la palette localement.

### D-6 — JETON-ACTEUR > ICÔNE ILLUSTRATIVE
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
> une proportion, un accord juridique invisible. On les EXPLIQUE via un graphisme Remotion par-dessus la carte.
> ⚠️ NB ARBITRAGE : cette idée d'origine envisageait un overlay SEMI-TRANSPARENT sur carte vivante derrière.
> La règle a depuis été CORRIGÉE (section 9) : le semi-transparent avec carte au travers est BANNI. L'esprit
> D-8 reste valide (montrer un CONCEPT que la voix ne dit pas visuellement) mais le SUPPORT est désormais
> overlay SOLIDE (plaque opaque ancrée ou plein écran opaque animé), pas un voile sur carte.
>
> ⛔ RÈGLE N°1 (corrigée après échec B1 V3) : un overlay qui AFFICHE LE TEXTE QUE LA VOIX PRONONCE = un
> SOUS-TITRE = INTERDIT. Erreur commise B1 V3 ("Pourquoi la France en 11 jours ?" pendant que la voix le
> dit = redondance, n'apporte rien, rejeté Aziz). L'overlay légitime MONTRE ce que la voix NE dit PAS
> visuellement : un MÉCANISME, une PROPORTION, une CHRONOLOGIE, un FLUX, une COMPARAISON — du SENS, pas du texte.
>
> ⛔ RÈGLE N°2 : la carte NE FREEZE JAMAIS quand elle est visible (drift doux). (≠ le Sudan WarMapOverlayExplicatif qui FIGEAIT.)
>
> ⛔ RÈGLE N°3 (Aziz) : l'overlay est l'EXCEPTION, pas la règle. La plupart des zones molles doivent RESTER
> sur la carte et être mieux MEUBLÉES (mouvement/événement/transformation cartographique). N'utiliser l'overlay
> QUE pour les concepts VRAIMENT impossibles à montrer cartographiquement. Garder le MAXIMUM sur la carte.
>
> Pour CHAQUE zone molle, arbitrer : (A) overlay-complément justifié (concept invisible) OU (B) meubler SUR
> la carte (et préciser par quelle animation cartographique). Préférer B par défaut.

- C'est le pont entre l'arsenal DATA-VIZ Souverain (StackedBars, ProcessFlow, CountUp, frises, schémas de flux)
  et la war-map : importer cette puissance graphique sans sacrifier premium ni action.
  Registre que ni K&G ni Historia Civilis n'ont (eux figent/coupent) = différenciateur.

### ⛔ D-9 — OVERLAYS = PREMIUM SOUVERAIN, JAMAIS "encre austère Historia Civilis" (Aziz 2026-06-09) ⭐⭐⭐
> **CORRECTION MAJEURE de doctrine.** Le 1er overlay pré-positionnement codé en style encre/parchemin
> "fait main" (petits forts dessinés, traits fins cream) a été REJETÉ par Aziz : "ça ressemble à des
> dessins de châteaux, ça descend notre niveau au lieu de le monter."
>
> **RÈGLE** : un overlay Remotion DOIT être au niveau **premium data-viz Souverain**
> (briques HERO DATA : FlowBrick, CountUp glow, HeroVerticalBars, Badge satellite, ProcessFlow, secondary
> motion, métaphore physique, transitions seamless). Le langage de référence = `SOUVERAIN-REMOTION-PLAYBOOK.md`
> + section HERO DATA de `COMPOSANTS-INDEX.md`. PAS le style encre minimaliste.
>
> **POURQUOI** : s'inspirer d'Historia Civilis (volontairement PowerPoint-austère) pour la DISCIPLINE
> narrative (board clearing, 1 idée) ne doit JAMAIS contaminer le RENDU visuel. Une référence qui pousse
> le rendu vers le bas ne sert à rien. On garde sa rigueur narrative, on REJETTE son esthétique pauvre.
> Le standard de rendu est premium PARTOUT, y compris sur la carte.
>
> **NUANCE carte** : l'overlay doit rester lisible (contraste). Donc premium Souverain ADAPTÉ au contexte
> carte (peut emprunter la palette parchemin pour le fond solide, mais les ÉLÉMENTS — nœuds, chiffres, flux —
> sont au niveau FlowBrick/CountUp, pas des croquis). Premium d'abord.

---

## 5. LES 4 RÈGLES DE DISCIPLINE R-V (chacune répond à une faute de B1)

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
- NB cohérence avec D-3 : le zoom IN serré sur l'action est ENCOURAGÉ ; c'est le pull-back "pour tout montrer" qui est banni.

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

### CAUSALITÉ HUMANISÉE SANS PERSONNAGES (substitut HC, on a mieux)
HC porte la causalité par des BULLES de dialogue (`WTF!`, `DEBT ABOLITION!`, `THAT KINDA MAKES SENSE`).
Le carré qui parle = l'acteur. C'est leur substitut au manque de personnages animés. NOUS avons jetons
incarnés (chèche/cagoule) + PixelLab — notre incarnation est supérieure. On peut emprunter l'IDÉE (un
acteur "réagit" → micro-pulse, léger recul du jeton) sans copier les bulles cartoon (trahirait l'ADN doc).

### R-V5 — SOUS-DIMENSIONNEMENT RÉCURRENT : agrandir/étaler/allonger, jamais un ajustement isolé
> Gravée 2026-07-12 (Soudan Acte 4, session 10). Pattern répété 4x dans le MÊME acte, nommé explicitement
> par Aziz comme récurrent "à travers l'acte 4 et autres" — pas un bug isolé par beat mais un biais
> systématique du premier jet en War-Map. Doctrines SŒURS déjà gravées pour ce même biais dans d'autres
> registres du projet — le principe est mûr, juste absent d'un registre à l'autre : `SOUVERAIN-REMOTION-
> PLAYBOOK.md` (« erreur récurrente de Claude : faire les textes/graphismes TROP PETITS et TROP TARDIFS au
> premier jet », règle d'or élément HERO = 40-60% largeur/hauteur écran) · `WORKFLOW-DATAVIZ.md` (pictos
> sous-dimensionnés, réflexe : agrandir de +40 à +50% vs la 1re estimation).

**4 occurrences dans le même acte (Soudan Acte 4)** :
- Whip pan Moscou : zoom 6.4 (échelle "ville") sur un territoire filtré immense (Russie occidentale,
  `mainlandBox` lon 19-100°) — se lisait comme un point isolé perdu dans un vide kaki. Corrigé à zoom 3.6.
- Drone Kosti (Beat 5) : sprite 40px fixe, trajectoire 272px sur 1.2s, zéro contraste avec le fond crème —
  invisible <1s à l'écran malgré un code fonctionnel. Corrigé à 95px, ~770px/2s, + traînée + halo.
- Jeton naval Port-Soudan (Beat 2) : 140px jugé "beaucoup trop petit" par Aziz au premier test sur la vraie
  carte, alors même que c'était déjà plus gros qu'un jeton portrait standard (D=58px). Agrandi +50% (210px).
- Flash "profondeur stratégique" (Beat 4, Nil) : trait blanc à la MÊME largeur que le trait plein déjà
  affiché — techniquement présent dans le code, invisible sur render réel (noyé visuellement).

**Règle** : tout objet/effet War-Map (sprite, trajectoire, flash, jeton, zoom) doit être jugé "est-il
visible dès le premier coup d'œil sur render RÉEL, pas juste correct en lisant le code" — même test que
`SOUVERAIN-REMOTION-PLAYBOOK.md` ("si après render il flotte petit avec du vide autour → trop petit,
agrandir"). Le réflexe de correction est TOUJOURS d'agrandir/étaler/allonger la valeur en question, jamais
un ajustement ponctuel isolé d'une seule propriété (ex. juste l'opacité sans la taille, ou juste la taille
sans la durée du mouvement) — le sous-dimensionnement touche généralement plusieurs dimensions à la fois
(taille ET durée ET contraste) et se corrige comme un ensemble, pas une variable seule.

---

## 6. TEMPLATES OVERLAY VALIDÉS

> Pour tout ce qui passe le test section 2 = "NON, c'est conceptuel" → ces templates solides.

### ⭐ TEMPLATE PRINCIPAL — `WarMapDimmedOverlay` (validé Aziz 2026-06-14, à réutiliser largement)
Code : `src/projects/warmap/_shared/WarMapDimmedOverlay.tsx`. Aziz : "devrait devenir un de nos templates
principaux, marche très bien, réutilisable dans d'autres vidéos".

**Le pattern** : on NE quitte PAS la carte → on l'ASSOMBRIT (voile semi-transparent ~0.62) en gardant ses
contours/couleurs VISIBLES en arrière-plan, + halo radial doré (spotlight), + grain, puis on SUPERPOSE des
éléments (sceau, drapeaux, titre, data, schéma) PAR-DESSUS. Effet cinématographique : la carte reste le décor
vivant, l'élément superposé est la scène. Bien plus fort que le plein écran opaque (tue la carte) OU forcer le
concept sur la carte (illisible).
- `WarMapDimmedOverlay` = composant PUR (frame en prop) : voile + halo + grain + fade in/out + slot `children`.
- ⚠️ **Conflit z-order (leçon Chantier 3)** : si la carte a une couche de contours rendue PAR LE MOTEUR APRÈS
  l'overlay (ex. `countryBorderPaths` de SahelWarMapEngine), ces contours TRAVERSENT l'élément superposé.
  → percer un TROU (mask SVG) dans la couche contours du moteur, à l'emplacement écran de l'élément, MÊME
  fenêtre. Helper `dimmedOverlayHole()` donne {cx,cy,r}. NE PAS masquer TOUS les contours (tue la beauté) —
  seulement un disque local sous l'élément. Réf moteur : mask `confed-seal-hole` dans SahelWarMapEngine.
- Réf validée : confédération AES (Chantier 3 P4) — `out/episodes/warmap-sahel/p4-chantier3-confed-FINAL.mp4`
  (catbox xt8ztb). Drapeaux ml/bf/ne convergent → sceau SVG "Confédération AES / Septembre 2023".

> NB cohérence section 9 : `WarMapDimmedOverlay` assombrit FORTEMENT (voile ~0.62 + halo + grain) au point que
> les détails de carte sous l'élément superposé ne parasitent plus, et un trou est percé dans les contours sous
> l'élément. C'est un cas AUTORISÉ (fond neutralisé sous l'élément), distinct du semi-transparent banni (voile
> léger laissant villes/jetons/contours transparaître de façon illisible).

### ⭐ TEMPLATE — `WarMapSplitScreen` (les DEUX en parallèle, validé Aziz 2026-06-15)
Code : `src/projects/warmap/_shared/WarMapSplitScreen.tsx` (promu des protos R&D P5/P6).
Évolution de la doctrine : au lieu de "OU la carte OU l'overlay", le split montre **les deux SIMULTANÉMENT** —
spatial à gauche (carte), conceptuel à droite (data), côte à côte. **Incarne une DIVERGENCE** (la frontière du
split EST la séparation des 2 mondes) au lieu de la décrire. Cas roi : opposition/comparaison/dépendance.
- 2 render-props (chacun son repère 0..w/0..h), orientation vertical/horizontal, `connector` qui traverse la
  séparation (ex. fil de parité CFA), ouverture animée.
- Réf validée : CFA P4 (`out/episodes/warmap-sahel/p4-cfa-FINAL.mp4`, catbox 5fxlvp). GAUCHE carte AES + pièce
  CFA pulsante. DROITE drapeau France SVG ondulant + équation "1 € = ~656 FCFA" PERSISTANTE → bascule vers le
  SENS en typewriter (souveraineté + jeunesse, charte analyste : documenter le ressenti sans le valider).
- Leçon data : afficher les chiffres ARRONDIS sans ambiguïté ("~656" pas "655,957" → lu "655 000"). Voir FACTS-CFA-2026.
- ⚠️ **GARDE-FOU (Soudan Acte 3, 2026-07-11)** : ce template est validé pour carte+overlay (1 seule vraie
  Mapbox, l'autre volet en SVG/data comme CFA P4 ci-dessus). **2 vraies instances Mapbox WebGL simultanées
  dans les 2 panels = CRASH CONFIRMÉ** (`Error: Failed to initialize WebGL` sur la 2e Map, dès l'init —
  limite dure du renderer headless de ce projet, pas un problème d'enfants complexes). Ne JAMAIS retenter
  sans changement d'architecture (ex. compositing server-side de 2 renders séparés). Pour "carte+carte",
  utiliser des panneaux glissants + connector convergent à la place (cf `Acte3SideFlags` dans `SoudanActe3.tsx`).

### Cas d'application immédiat (Chantier 3 confédération)
La confédération AES = acte INSTITUTIONNEL (3 pays signent), AUCUN ancrage spatial → ne PAS la forcer sur la
carte (liens+mini-sceau = raté). → **overlay/plein écran solide premium** : 3 drapeaux AES (ml/bf/ne) qui
convergent → sceau "Septembre 2023 · Confédération AES", fond opaque charte épisode. Puis retour carte (CFA,
dézoom, Chantier 4). La mécanique P1 (liens) n'est PAS ratée : elle est pour les acteurs ANCRÉS à de vrais
lieux (soutiens étrangers Russie→Mali, Émirats→X) — pas pour un accord entre 3 voisins.

---

## 7. ARSENAL OVERLAY DÉTAILLÉ

> Quand un overlay (solide, section 6) est justifié : voici les types de graphiques, les règles consolidées
> et le workflow dev. Source : upstream Gemini+Kimi+DeepSeek 2026-06-09 (convergence totale).

### RÈGLES CONSOLIDÉES
- **Overlay = STRUCTURE, jamais le texte de la voix.** Test pro : "si je ferme les yeux et comprends la même
  chose, l'image est inutile." Conçois l'overlay en partant de "qu'est-ce que la voix NE dit PAS ?". Ex : voix
  dit "11 jours" → overlay montre les AUTRES interventions (frise comparative) pour révéler que 11j est
  exceptionnel — pas le chiffre 11 en gros (= sous-titre).
- **Règle des ~3-5 mots / 1 idée par overlay.** Que des chiffres + formes/icônes SVG + labels minimaux
  (noms propres, dates que la voix NE cite pas). Jamais une phrase complète.
- **L'overlay NAÎT de la carte** (clipPath/mask depuis le jeton ou une coordonnée géo) quand c'est possible,
  plutôt qu'un panneau flottant arbitraire.
- **1-2 overlays MAX/beat (viser 1).** Durée 6-14s. Transition : voile fade 0.5s → éléments en STAGGER 0.1-0.2s
  (jamais bloc d'un coup) → sortie inverse. Espace négatif : overlay ≤40% surface, marges ≥10%.
- **FACTUEL ABSOLU** : ne JAMAIS inventer un chiffre. Vérifier (WebSearch) avant. Sinon angle qualitatif sans chiffre.
- Easing : `cubic-bezier(0.16,1,0.3,1)` (ease-out-expo) apparitions · spring damping élevé (pas de bounce cartoon).

### ARBITRAGE PAR ZONE (la méthode, validée Aziz) — préférer (B) meublage-carte, (A) overlay = exception
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

### TYPES DE GRAPHIQUES OVERLAY validés (SVG 2D, palette parchemin)
- **Frise comparative** (la + puissante) : barres horizontales, l'événement-clé en or + 2-3 comparables en contour
  + un seuil de référence. Ancre un chiffre dans une SÉRIE (donc pas redondant avec la voix).
- **Sankey/flux de dépendance** : 2 cercles (source/dest) + flux `<path>` épaisseur = volume, stroke-dashoffset = "coule".
- **Negative narrative** (Neil Halloran) : ligne fantôme (ce qui N'EST PAS arrivé, opacity 0.2) sous la ligne réelle = contraste.
- **Paper-cut** : profondeur par ombres d'OPACITÉ pure (décalage +3px cream foncé 40%, pas de blur interdit) = relief pop-up book 2D.
- Barres "faites main" (stroke irrégulier, linecap round) pour rester encre, pas vecteur parfait.

### WORKFLOW DEV (Aziz) : coder l'overlay en COMPOSITION ISOLÉE d'abord
`SahelOverlay*Demo` dans Root → render rapide SANS la carte ni Mapbox (valider typo/design/anim) → PUIS intégrer.
Évite de re-rendre 52s+Mapbox à chaque itération.

**Leçon** : un overlay titre/texte = INSUFFISANT (c'était du sous-titre déguisé, supprimé). À FAIRE si besoin :
composants graphiques dédiés (frise délai, flux de dépendance, ligne de tension, zone d'influence).
**DÉCISION B1 (Aziz 2026-06-09)** : UN seul overlay = frise délais d'intervention (zone 8-22s), tout le reste
meublé SUR la carte (lignes tension or accords, zones influence bases, pulse frontière, flux uranium dessiné).

---

## 8. APPLICATION DIRECTE AUX BEATS (les 4 règles R-V, valables tout l'Acte 2 V5)
> NB : le plan "B1 sprites" original est ABANDONNÉ (refonte script V5 linéaire 2026-06-10, voir STATUS.md).
> La GRAMMAIRE ci-dessous reste la règle pour coder les beats des Parties 1-4.
1. **R-V1 d'abord** : entrer dans un nouveau beat = estomper l'état précédent (opacity→0.2) + vignette focus. Condition n°1.
2. **R-V3** : caméra = PAN serré / Ken Burns continu sur la zone nommée. JAMAIS pull-back injustifié.
3. **R-V2** : un flux trace une veine (pas une pastille). Une emprise = périmètre qui se dessine, pas un sticker. Le flux CAUSE le changement.
4. **R-V4** : 1 sprite mobile à la fois, reste à 0.3, respirations entre. Couper si surcharge.
5. Soustraction : assumer le hors-champ France (route qui sort + label), ne pas dézoomer pour la montrer.

→ Render → downstream Gemini/Kimi de contrôle (da-brief.py), 1 appel max, Gemini consultatif jamais juge.

### ⛔ R-V5 — OBJET FIGURATIF NON NOMMÉ PAR LA VOIX = confus, rejeté (Aziz 2026-07-09, Soudan Acte 2)
Un objet figuratif posé sur la carte (bâtiment, palais, mine, monument, usine…) DOIT être ancré à
quelque chose que la VOIX prononce à ce moment — sinon le spectateur ne comprend pas ce que c'est ni
d'où ça sort. **Deux rejets Aziz** cette session : (1) un palais gouvernemental iso au coup d'État et
(2) une mine d'or au beat 8 — tous deux JAMAIS nommés par la narration → retirés du montage.
**RÈGLE** : avant de poser un objet, vérifier que la voix le désigne (synchro « on nomme → ça
apparaît »). Sinon : le supprimer, OU le remplacer par un signe qui se lit SANS être nommé.
*Alternative validée (beat 8)* : au lieu d'un objet abstrait, montrer les **FORCES qui tiennent leur
position** (généraux + soldats figés de part et d'autre du front) → ça MONTRE « personne n'a pu
gagner » sans nommer quoi que ce soit. Distinct de R-V N°2 (overlay-sous-titre) : ici le problème
n'est pas la redondance mais l'ABSENCE d'ancrage verbal d'un objet figuratif.

### ⭐ BRIQUES SIGNATURE War-Map (vocabulaire réutilisable — NE PAS re-coder, adapter l'existant)
- **TwoFaceToken** (jeton alliance→rupture) : un jeton UNIQUE coupé par une ligne d'or, deux demi-visages.
  Grammaire d'états : convergence → **FUSION** (alliance) → la ligne **FEND** (tension, « qui commande ? »)
  → **SPLIT** (rupture) → reconstitution en 2 jetons. Candidat récurrent pour tout duo d'acteurs qui
  s'allient puis se déchirent. Code : `src/projects/warmap/soudan-acte2/TwoFaceToken.tsx`.
- **YearCounter** (fil temporel) : compteur d'année qui RECULE (2026→2021) puis avance (→2023) =
  matérialise « revenir en arrière » ET meuble un beat sans surcharge. Garder le CHIFFRE seul, retirer
  tout label texte redondant avec la voix. Cohérent avec **KmCounter** « le chiffre qui frappe ».
  Code : inline dans `src/projects/warmap/soudan-acte2/SoudanActe2.tsx`.
- **BlocImpasseB6** (rapport de force plein cadre) : concept SANS ancrage géo (« puissance de feu vs
  territoire ») → BLOC état-major, PAS plaqué sur la carte (cf §2 test d'ancrage : d'abord tenté sur
  carte = raté, basculé en bloc = juste). Code : `src/projects/warmap/soudan-acte2/BlocImpasseB6.tsx`.

---

## 9. ⛔ RÈGLE OVERLAY SEMI-TRANSPARENT BANNI (Aziz 2026-06-14)

**Gravé après P4 v2 (capture "2024 Confédération AES" jugée "vraiment très moche", "interdit").**

Un overlay (cartouche texte/données) avec la CARTE ou des CONTOURS qui transparaissent dessous = BOUILLIE
illisible. On ne comprend pas ce qui se passe, les écrits sont noyés par les traits du fond. BANNI dans
TOUTES les vidéos (War-Map, Atlas, Souverain).

**Les 2 seules options autorisées pour présenter de l'info :**
1. **PLEIN ÉCRAN OPAQUE** — fond parchemin solide, la carte disparaît complètement. C'est notre force Remotion :
   l'overlay plein écran s'ANIME à fond (data-viz, icônes en cascade, camemberts/barres, objets PixelLab DANS
   l'overlay comme en Atlas). Jamais un bloc texte statique posé quelques secondes.
2. **SUR LA CARTE** — pas d'overlay du tout : l'info se représente directement sur le territoire (contour qui
   vire de couleur, jeton/sprite qui se pose, remplissage, sceau, plaque-nom ancrée). La carte porte le sens.

**JAMAIS l'entre-deux** (cartouche semi-transparent flottant avec territoires/contours visibles dessous).
Si on tient à un cartouche sur fond de carte : le fond DOIT être totalement assombri/neutralisé dessous
(aucun contour ni détail visible) — mais par défaut, préférer plein écran opaque ou représentation sur carte.
(C'est exactement ce que fait `WarMapDimmedOverlay`, section 6 : voile fort + trou dans les contours = AUTORISÉ.)

**Corollaire (règle gravée Aziz)** : un overlay Remotion DOIT être animé (c'est notre force). Un overlay statique
posé plusieurs secondes pendant que rien ne bouge = mort. Animer, ou ne pas mettre d'overlay.

**⛔ RENFORCEMENT (Aziz 2026-06-14, P4 Chantier 1) — ON ARRÊTE LES SEMI-TRANSPARENTS, POINT.**
`WarMapOverlayDynamic mode="semitransp"` est BANNI (le voile + carte au travers = exactement la bouillie ci-dessus,
les sprites/villes/jetons transparaissent à travers le cartouche). Ne plus l'utiliser nulle part. Aziz : "pourquoi
se compliquer la vie ? un overlay solide empêche les sprites de passer au travers." Toujours :
- chiffre/info ABSTRAITE (national, sans point géo : "3 M déplacés") → **plaque OPAQUE ancrée** (fond parchemin
  100% solide, AUCUN détail de carte visible dessous) avec le flux/action qui continue AUTOUR (pas dessous), OU
  **plein écran opaque animé** (Chantier 2 data-viz).
- info SPATIALE (territoire, ville, flux) → représentée SUR la carte (contour, jeton, remplissage, plaque-nom ancrée).
Le composant `WarMapOverlayDynamic` n'a que 2 modes utilisables (semitransp=banni, fullscreen=opaque ; "card"=cartouche
opaque carte visible autour) → pour une plaque opaque ancrée locale, coder une plaque inline à fond solide (pas le
composant). À terme : ajouter un mode "solid-anchor".

**⚠️ PRÉCISION EXÉCUTION (2026-07-20, Soudan Acte 6) — le fond opaque ne suffit PAS si son OPACITÉ MONTE.**
Un cartouche/plaque au fond ciblé 100% solide redevient une bouillie transparente PENDANT toute la phase où
son opacité monte progressivement (fade-in long 0→1 : la carte/scène transparaît à travers = brouillon,
exactement comme un semi-transparent). Le fix : le FOND doit être plein dès la 1re frame d'apparition —
animer l'ENTRÉE par un fade TRÈS court (~4 frames) + un scale (pop), PAS par une longue montée d'opacité du
fond. L'opacité du fond n'est jamais un canal d'animation d'entrée ; le mouvement d'apparition passe par
scale/translate/clip, jamais par la transparence du fond. (Bug réel : cartouche "13,5M déplacés" Acte 6.)

---

## 10. L'ÉQUILIBRE dynamisme vs discipline + HIÉRARCHIE PAR SOUSTRACTION

### ÉQUILIBRE — dynamisme SANS retomber dans l'empilement
Les règles D (mouvement, section 4) et R-V (discipline, section 5) ne s'opposent pas, elles se complètent :
- D = "il se passe TOUJOURS quelque chose" (jamais 5s mort, 6-8 événements, caméra vivante).
- R-V = "UNE chose lisible à la fois" (board clearing court, 1 transformation focus, pas de bruit simultané).
La synthèse : un FLUX CONTINU d'événements SÉQUENTIELS — chacun lisible, mais qui s'enchaînent serré sans
trou. Le board clearing devient une TRANSITION rapide (1-2s) entre deux événements, PAS 19s de vide.

**Notre place** = la rigueur narrative d'Historia Civilis + la richesse de texture qu'aucun des deux n'a
(encre/parchemin, jetons incarnés, taches organiques) + forced-alignment automatique. JAMAIS le mur-timelapse.

### HIÉRARCHIE PAR SOUSTRACTION (méta-règle qui sous-tend les 4)
HC : quand un acteur est important, TOUT le reste disparaît (plan terrain vert, 1 seul carré au centre).
Le vide négatif est INTENTIONNEL et focalise le regard. B1 avait du vide océanique NON-intentionnel
(centrage maths). → Le vide se MÉRITE : on enlève pour souligner, on ne laisse pas traîner par hasard.

---

## 11. LA MÉTHODE avant de coder + CE QUI EST DÉJÀ ACQUIS

### LA MÉTHODE (avant de coder — la même qui a débloqué la P2)
1. Écouter l'audio phrase par phrase → `PLAN-NARRATIF-PN.md` : "que doit COMPRENDRE un œil neuf à cette phrase ?"
2. Pour chaque phrase, appliquer le TEST section 2 (ancrage géo ?) → carte (techniques section 3) OU overlay (sections 6-7).
3. Pour les phrases-carte, choisir la/les technique(s) causale(s) du catalogue section 3.
4. DA-brief upstream sur le PLAN (Gemini+Kimi), signal jamais juge → filtrer les hallucinations.
5. Valider le plan avec Aziz, PUIS coder (copier `Partie2Blocage.tsx` comme modèle).

### CE QUI EST DÉJÀ ACQUIS (ne pas re-décoder)
- **K&G / BazBattles** : grammaire de BATAILLE tactique (manœuvre de masses, file→ligne→charge) — décodé
  2026-06-04, `out/_r-and-d/decode-channels/README.md` + `DECODE-bazbattles-manoeuvres.md`. Différent du
  registre territorial-temporel ici. Utile pour les beats COMBAT, pas pour les transitions géopolitiques.
- **Grammaire d'apparition des objets** (cadence pop, <=6 objets, 1/3-5s, pop près du dernier point nommé,
  atterrissage spring) : README decode-channels §1. S'applique direct aux bases B1.
- **mapsinanutshell écosystème/cadence** : `DECODE-daybyday-warmap.md` (déjà écrit, dimension business/pipeline).
  Ce fichier ajoute leur dimension VISUELLE manquante (= mur-timelapse, contre-modèle de mise en scène).

---

## 12. LIENS

- [[WARMAP-PLAYBOOK]] — doctrine DESIGN (briques + R1-R6, identité parchemin).
- [[WARMAP-LONG-DOCTRINE]] — format long 5-7min, carte permanente, 100% carte.
- [[WARMAP-ANIMER-OBJETS]] — quel outil pour animer un objet sur carte (SVG / Gemini / PixelLab) + 3 règles R-OBJ.
- [[WARMAP-RESEARCH-PLAYBOOK]] — doctrine DONNÉES (phase recherche OSINT, schéma canonique).
- Voir aussi : `memory/key-learnings.md` · `PLAN-NARRATIF-P2.md` (modèle de plan) ·
  [[DECODE-maxbellona]] · [[PLAN-MATCH-POLISH-MECANIQUES]] · [[WARMAP-ANIMER-OBJETS]].
