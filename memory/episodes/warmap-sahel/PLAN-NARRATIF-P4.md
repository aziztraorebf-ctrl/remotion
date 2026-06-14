# PLAN NARRATIF P4 — "Le Coût, le Levier, la Perspective" — phrase par phrase (depuis l'audio, 2026-06-14)

> ⭐ P4 EST LA DERNIÈRE PARTIE. Après P4 → assemblage final (concat Acte1+P1+P2+P3+P4 + mix).
>
> Méthode (identique P2/P3 validées) : on part de l'AUDIO. Pour CHAQUE phrase : "que doit COMPRENDRE un œil
> neuf ?" → quelle(s) technique(s) causale(s) du catalogue (`WARMAP-GRAMMAIRE-CAUSALE.md`) → quels assets.
> La CAUSE (un acteur agit) précède TOUJOURS l'EFFET (le territoire change). Action causale, jamais état qui pop.
>
> Modèle de code = `Partie3Rupture.tsx` (PAS Proto24 = legacy). Mode moteur `partie4` à créer (miroir `partie3`).
> Triggers VÉRIFIÉS contre `narration-v5-alignment.json` (×30fps) le 2026-06-14 — voir table ci-dessous.

---

## ⚠️ TABLE DE TRIGGERS — VÉRIFIÉE vs alignment (corrige BEATS-V5 qui était DÉCALÉ)

> Le `BEATS-V5.md` donnait des frames calées sur un audio antérieur. Voici les **frames réelles** (mot × 30fps,
> source de vérité unique = `narration-v5-alignment.json`). Écarts importants : confédération BEATS f11076 →
> **réel f11449** (+373), CFA BEATS f11763 → **réel f11869**, chute BEATS f12996 → **réel f13082**.

| Beat | Mot-ancre | Frame RÉELLE | (BEATS-V5 disait) | Texte |
|---|---|---|---|---|
| 4.1 transition | "Car" derrière | **f9416** | ~9410 | "derrière les cartes et drapeaux, populations vivent autre chose" |
| 4.1b | "populations" | f9615 | — | (montée du sujet humain) |
| 4.2 réfugiés | "familles" | **f9736** | f9732 | "familles ont fui Djibo/Ménaka/Tillabéri" |
| 4.2 | "Djibo" | f9790 | — | (1er foyer de fuite) |
| 4.2 | "Ménaka" | f9809 | — | (2e foyer) |
| 4.2 | "Tillabéri" | f9835 | — | (3e foyer) |
| 4.3 coût chiffré | "coût" | **f10047** | f10038 | "près de 3M déplacés, +15M insécurité alimentaire" |
| 4.3 | "trois millions" | f10151 | — | (1er chiffre) |
| 4.3 | "quinze millions" | f10216 | — | (2e chiffre) |
| 4.4 ressources | "ressources" | **f10594** | f10299 | "un atout que la pression ne peut pas effacer : ses ressources" |
| 4.5 or | "l'or" | **f10667** | f10587 | "l'or que se partagent Mali et Burkina" |
| 4.5 | "Mali" / "Burkina" | f10709 / f10729 | — | (2 capitales aurifères) |
| 4.6 uranium/pétrole | "l'uranium" | **f10804** | f10830 | "uranium et pétrole du Niger = levier face aux sanctions" |
| 4.6 | "pétrole" / "Niger" | f10835 / f10851 | — | — |
| 4.7 confédération | "confédération" | **f11449** | f11076 ⚠️ | "2024, l'AES devient confédération + force armée commune" |
| 4.7 | "force" | f11521 | — | (force conjointe) |
| 4.7 | "Niamey" | f11613 | — | (QG) |
| 4.7 | "Barkhane" | f11687 | — | (ex-base Barkhane = symbole) |
| 4.8 CFA | "CFA" | **f11869** | f11763 | "la question du franc CFA, toujours lié à Paris" |
| 4.8 | "Paris" | f11974 | — | — |
| 4.9 statu quo brisé | "statu" | **f12297** | f12216 | "en 3 ans, brisé un statu quo de 60 ans" |
| 4.9 | "soixante" | f12331 | — | — |
| 4.10 question ouverte | "réussir" | **f12662** | f12615 | "ce bloc parviendra-t-il à réussir là où les autres ont échoué ?" |
| 4.11 chute | "résister" | **f13082** | f12996 ⚠️ | "résister (prouvé) / construire (commencé) / durer (à démontrer)" |
| 4.11 | "construire" / "durer" | f13200 / f13290 | — | (gradation finale) |
| FIN | "démontrer." (end) | **f13372** | — | dernier mot → noir |

**Frame de départ P4 = f9416** (raccord direct depuis fin P3 f9410). **Frame de fin = ~f13380** (noir après f13372).
**durationInFrames compo `SahelPartie4`** : env 13380 (comme P3 part de 0 et la couche s'active dès f9416).

---

## IDÉE MOTRICE (script)
"Cette transition a un PRIX HUMAIN réel — mais aussi un LEVIER (les ressources) qui permet de tenir — et la
construction continue (confédération) — mais une question reste ouverte : durer."
**Arc P4 en 3 mouvements** : (1) LE COÛT (réfugiés + chiffres, registre grave/humain) → (2) LE LEVIER (or,
uranium, pétrole = ce qui permet de tenir, registre ressources/géoéco) → (3) LA PERSPECTIVE (confédération,
CFA, statu quo brisé, question ouverte, CHUTE finale).

## RACCORD DEPUIS P3 (caméra)
P3 finit f9410 serrée sur les 3 pays AES : `{lon:0.30, lat:13.95, zoom:5.50}`. P4 démarre f9416
(`getPartie4Cam`) : on REPART de cette vue (3 pays AES cadrés) → on quitte "les armées" pour "les populations"
(drift vers les zones de fuite, légère respiration) → puis on déroule coût/ressources/confédération → puis
DÉZOOM LENT final (4.9-4.11) : la carte AES s'ancre dans le continent africain, puis s'éteint au noir.
Caméra "serrée qui suit" pour le coût/ressources, puis "respiration / dézoom" pour la perspective finale.

---

## ARSENAL P4 (assets confirmés sur disque) — à COMBINER, jamais un seul
- **Réfugiés (jetons-visage)** : `refugie-enfant.png` / `refugie-famille.png` / `refugie-femme1.png` /
  `refugie-femme2.png` / `refugie-homme.png` + `portrait-civil.png`. ← l'incarnation humaine du coût.
- **Brique `RefugeeFlow`** (`warmap/_shared/RefugeeFlow.tsx`) + données `REFUGEE_FLOWS_ACT4` : rubans/traînées
  de fuite animés (corridors humanitaires). props: map, flows, frame, color, baseWidth.
- **Overlays** : ⭐ `WarMapOverlayDynamic` (`warmap/_shared/`, 6 blocs composables) = la brique P3 réutilisable —
  pour coût chiffré (4.3), confédération (4.7), CFA (4.8), question ouverte (4.10). Mode semi-transp OU plein écran.
- **Ressources (À VÉRIFIER/GÉNÉRER, voir ANGLE MORT 1)** : icônes top-down lingot or / cristal uranium / goutte
  pétrole. Sur disque : `wagon-cargo-or.png` + `convoi-uranium.png` (= VÉHICULES, pas icônes statiques posées).
- **Contours nationaux colorés** : Mali `#D98A3D` / Burkina `#C0553C` / Niger `#4E8C7D` (`SAHEL_COUNTRY_COLORS`).
  RÉUTILISÉS de P3 (draw-in + pulse + effacement sous overlay). 4.7 = les 3 contours FUSIONNENT en bloc uni.
- **Briques kit** (`warmapPremiumKit.ts`) : `interpWaypoints`, `countryOutline`, `spriteMapWidth`, `chip()`,
  `WarMapPlaque`, sillage mask. Du modèle `Partie3Rupture.tsx`.
- **Couleurs (PAL)** : or AES `#C9A24B` (continuité P3) · rouge sourd `#6B1A1A` (coût humain, registre grave) ·
  jaune-orange ressources Niger · contours nationaux ci-dessus.
- **Timeline** : graduée pleine largeur (rendue par le moteur), axe P4 ≈ 2024 → 2026 → présent.
- **SFX banque warmap/** : ink-spread, impact, drone, whoosh. (Choix SFX P4 = voir décisions de goût.)

---

## PLAN PAR PHRASE

### Phrase 1 — "Prendre un territoire est une chose, le conserver en est une autre. Car derrière les cartes et les drapeaux, il y a une réalité bien plus dure : pendant que les armées avancent, les populations, elles, vivent tout autre chose." (Car f9416 · populations f9615)
- **Comprendre (œil neuf)** : ON CHANGE DE REGISTRE. On a passé toute la vidéo sur les armées/territoires ; ici
  on bascule vers l'humain. La carte de manœuvre devient une carte de population.
- **Technique causale** : CASSER la grammaire (changement de registre, comme Moura en P3) — la carte "militaire"
  (jetons, contours de contrôle) S'ESTOMPE, le fond respire, on prépare un autre type de marqueur (visages).
- **Assets** : (1) board clearing DOUX : les jetons-combat/sprites militaires résiduels fade → fantômes 0.15 (PAS
  display:none) ; (2) les contours nationaux colorés RESPIRENT (atténués pendant l'action, ils restent présents) ;
  (3) AUCUN nouvel objet encore — on laisse 1.5s de respiration (la phrase "vivent tout autre chose" = suspension).
- **Mouvement** : drift léger depuis la vue AES (raccord P3) vers les zones de population (centre/nord, Sahel
  rural). Caméra calme, pas de push agressif. C'est une transition émotionnelle, pas une action.

### Phrase 2 — "Des familles entières ont dû fuir des villes comme Djibo, Ménaka ou Tillabéri, parce que les routes y étaient coupées, les puits contrôlés et les marchés fermés." (familles f9736 · Djibo f9790 · Ménaka f9809 · Tillabéri f9835)
- **Comprendre** : des gens FUIENT, depuis 3 villes nommées. C'est un MOUVEMENT (l'exode), pas un état.
- **Technique causale** : #1 l'AVANCÉE/déplacement — les jetons-visage réfugiés QUITTENT les 3 villes (traînées
  de fuite séquentielles, waypoints frame-driven) au moment où chaque ville est nommée. La cause (ville assiégée :
  routes coupées/puits/marchés) → effet (les gens partent). Séquencé sur les 3 noms (Djibo→Ménaka→Tillabéri).
- **Assets** : (1) à f9790 (Djibo), à f9809 (Ménaka), à f9835 (Tillabéri) : un jeton-visage réfugié apparaît à
  chaque ville (`refugie-famille`/`refugie-femme1`/`refugie-enfant`, variés, cercle parchemin comme `chip()`) ;
  (2) une TRAÎNÉE DE FUITE part de chaque ville vers l'extérieur (ruban `RefugeeFlow` OU mini-waypoints, couleur
  sable/terre désaturée, PAS rouge violence — c'est la fuite, pas l'attaque) ; (3) les 3 villes restent NOMMÉES
  (labels géo-ancrés, halo réserve parchemin, paintOrder=stroke, PAS de cartouche blanc). Délai 0.2s entre les 3
  (séquentiel, jamais synchro). [incarnation gardée — décision script V5.]
- **Mouvement** : caméra cadre les 3 villes (large centre-est Sahel) ; suit légèrement le mouvement de fuite
  (les traînées s'éloignent du foyer). Le mouvement raconte l'exode.

### Phrase 3 — "Et le coût de cette transition est bien réel : on parle de près de trois millions de personnes déplacées, et de plus de quinze millions d'habitants en situation d'insécurité alimentaire dans les trois pays." (coût f10047 · trois millions f10151 · quinze f10216)
- **Comprendre** : LE CHIFFRE. L'ampleur du coût humain, sourcé. Donnée sans équivalent cartographique direct.
- **Technique causale** : la donnée qui se MONTRE via overlay (chiffre sans équivalent carto = `WarMapOverlayData`/
  `WarMapOverlayDynamic`). FIGÉE 2s : les jetons-visage RESTENT en place (continuité Ph2), l'overlay se superpose.
- **Assets** : (1) **FIGÉE ~2s** au "coût" ; (2) overlay `WarMapOverlayDynamic` (semi-transparent ancré, PAS plein
  écran — c'est encore spatial/lié aux 3 pays) : "~2,5–3 millions déplacés · 15–18 millions en insécurité
  alimentaire" + source "OCHA · PAM · HCR" (cartouche sobre serif) ; (3) les 2 chiffres montent EN SÉQUENCE
  (déplacés au "trois millions" f10151, puis insécurité au "quinze" f10216 — countUp ou reveal, jamais les 2
  d'un coup) ; (4) les jetons-visage Ph2 persistent dessous (le coût a un visage). [CONTOURS effacés sous overlay :
  fenêtre `CONTOUR_HIDE_WINDOWS` f10047-10300, sinon bouillie. Leçon P3.]
- **Mouvement** : drift quasi nul pendant le figé (gravité). SFX impact sourd discret possible au "trois millions".

### Phrase 4 — "Mais en même temps, l'Alliance dispose d'un atout que la pression extérieure ne peut pas effacer aussi facilement : ses ressources." (ressources f10594)
- **Comprendre** : PIVOT. On quitte le coût (grave) pour le levier (les ressources = la force de l'AES). Bascule
  de registre : du rouge/humain vers le doré/géoéco.
- **Technique causale** : [L5 board clearing] — les jetons-visage réfugiés S'ESTOMPENT (fade, leur chapitre se
  solde), respiration 1s carte nue, drift vers les capitales. On nettoie pour accueillir les icônes-ressources.
- **Assets** : (1) jetons-visage fade → 0 (le coût reste compris, mais on tourne la page) ; (2) overlay coût
  disparaît ; (3) **respiration 1s carte nue** (parchemin + contours nationaux qui RE-RESPIRENT, remontent en
  présence) ; (4) drift caméra vers le centre des 3 capitales. AUCUN nouvel objet pendant la respiration (la
  phrase "ses ressources" = annonce, le paiement vient Ph5-6).
- **Mouvement** : dézoom léger + recentrage sur les 3 pays (préparer l'apparition or/uranium). Calme, montée.

### Phrase 5 — "Il y a d'abord l'or, que se partagent le Mali et le Burkina Faso." (l'or f10667 · Mali f10709 · Burkina f10729)
- **Comprendre** : l'OR = ressource de 2 pays (Mali + Burkina). Localisé géographiquement.
- **Technique causale** : la donnée qui se MONTRE par apparition d'objet géo-ancré (#objets sur la map). Icône or
  qui se POSE (atterrissage spring) sur les 2 pays nommés, en séquence.
- **Assets** : (1) au "l'or" (f10667) : une icône LINGOT OR top-down apparaît sur Bamako (Mali), pop spring
  overshoot ; (2) au "Burkina" (f10729) : 2e icône or sur Ouaga (Burkina), même pop décalé ; (3) les contours
  Mali (`#D98A3D`) + Burkina (`#C0553C`) PULSENT à leur nommage (table `COUNTRY_PULSES`, déjà câblée — vérifier
  les frames f10709/f10729) ; (4) les icônes or RESTENT permanentes (le levier s'accumule à l'écran). [ANGLE
  MORT 1 : icône lingot or top-down à générer si `wagon-cargo-or` ne convient pas — voir ci-dessous.]
- **Mouvement** : caméra cadre Mali+Burkina (ouest des 3 pays). Léger push sur chaque pop. L'or s'installe.

### Phrase 6 — "Et il y a surtout l'uranium et le pétrole du Niger. Ce sont des ressources dont le monde entier a besoin, et c'est précisément ce levier qui permet aux trois pays de tenir face aux sanctions." (l'uranium f10804 · pétrole f10835 · Niger f10851)
- **Comprendre** : le Niger a uranium + pétrole = ressources mondiales = LE levier contre les sanctions. Climax
  du mouvement "levier".
- **Technique causale** : la donnée qui se MONTRE — le Niger PULSE (jaune-orange), 2 icônes ressources se posent
  sur Niamey. Puis la phrase "le monde entier a besoin / tenir face aux sanctions" = la SIGNIFICATION (le levier),
  qu'on peut souligner par l'overlay léger ou le contour Niger qui s'allume fort.
- **Assets** : (1) au "l'uranium" (f10804) : icône CRISTAL URANIUM top-down sur Niamey ; (2) au "pétrole"
  (f10835) : icône GOUTTE PÉTROLE sur Niamey (les 2 cohabitent, le Niger est le pivot) ; (3) le contour Niger
  (`#4E8C7D`) pulse + remplissage jaune-orange diffus (la ressource "rayonne") ; (4) optionnel : micro-rayons/
  halo doré depuis le Niger vers l'extérieur (= "le monde entier en a besoin", le levier qui s'exerce) — sobre,
  PAS de flèche TikTok. [ÉPURÉ : PAS d'Areva, PAS de logo, décision script.] [ANGLE MORT 1 : icônes uranium/
  pétrole à générer.]
- **Mouvement** : caméra glisse vers le Niger (est). Le Niger devient le foyer doré. Push léger sur le pulse.

### Phrase 7 — "Et les trois pays ne se contentent plus de cette alliance militaire. En 2024, ils décident d'aller plus loin : ils transforment l'AES en une véritable confédération, et se dotent même d'une force armée commune, dont le quartier général s'installe à Niamey — sur l'ancienne base de l'opération Barkhane." (confédération f11449 · force f11521 · Niamey f11613 · Barkhane f11687)
- **Comprendre** : 2024 = l'AES PASSE D'ALLIANCE À CONFÉDÉRATION (intégration plus poussée) + force armée commune
  dont le QG est à Niamey, sur l'EX-base Barkhane (symbole fort : ils s'installent là où la France était).
- **Technique causale** : la donnée qui se MONTRE — les 3 contours nationaux FUSIONNENT en un bloc uni (l'union
  s'intègre, visible géographiquement) + un pictogramme/étoile "force conjointe" se pose sur Niamey. Le "QG sur
  l'ex-base Barkhane" = renversement symbolique à marquer (cause: ils prennent la place / effet: l'étoile AES là
  où était Barkhane).
- **Assets** : (1) au "confédération" (f11449) : les 3 contours (ocre/brique/sarcelle) virent progressivement vers
  une couleur AES UNIE (or `#C9A24B`) + une légère pulsation d'ensemble (le bloc se soude) ; (2) overlay
  `WarMapOverlayDynamic` "2024 · Confédération AES · force conjointe" ; (3) au "force"/"Niamey"/"Barkhane" : une
  ÉTOILE / pictogramme force conjointe se pose sur Niamey, avec une micro-note "QG · ex-base Barkhane" (le symbole
  du renversement) ; (4) FIGÉE ~1.5s sur le bloc uni (moment fort de la construction). [CONTOURS gérés ici :
  c'est leur fusion qui PORTE le sens — donc PAS dans CONTOUR_HIDE_WINDOWS, mais l'overlay texte doit être ANCRÉ
  haut/bas pour ne pas couvrir le bloc. Si overlay plein écran → alors hide contours. Décision au DA-brief.]
- **Mouvement** : dézoom léger pour cadrer les 3 pays ensemble (voir la fusion). Push sur l'étoile Niamey.

### Phrase 8 — "Il reste pourtant une question que personne n'a encore tranchée : celle du franc CFA. Cette monnaie commune, toujours liée à Paris, continue de circuler dans les trois pays — et rompre avec elle serait sans doute leur prochaine grande décision." (CFA f11869 · Paris f11974)
- **Comprendre** : la question OUVERTE du franc CFA, monnaie encore liée à Paris. CONCEPT non-spatial (économique/
  politique), pas une transformation de territoire. Registre "déjà parlé" → dézoom légitime.
- **Technique causale** : CONCEPT → overlay (plein écran OK ici, validé pour les concepts non-spatiaux de P4,
  décision Aziz/brief). On ne force PAS une représentation cartographique d'un concept monétaire (anti-pattern).
- **Assets** : (1) overlay `WarMapOverlayDynamic` (registre concept) : "Franc CFA · encore lié à Paris" + sous-
  texte léger "rompre = prochaine grande décision ?" ; (2) la carte derrière peut s'atténuer/se flouter doucement
  (registre "on prend de la hauteur, on parle d'un concept") ; (3) un fil ténu Sahel ↔ Paris peut être suggéré
  (lien monétaire) — sobre, optionnel, à trancher. [CONTOURS effacés sous overlay : fenêtre f11869-12200.]
- **Mouvement** : léger dézoom (on quitte le terrain pour le concept). Calme.

### Phrase 9 — "En l'espace de trois ans, le Sahel a donc brisé un statu quo vieux de soixante ans. L'ancien modèle est mort, et ce n'est plus vraiment la question. La vraie question, désormais, c'est celle de ce qui vient après." (statu f12297 · soixante f12331)
- **Comprendre** : BILAN — en 3 ans, rupture d'un ordre de 60 ans. On élargit le regard : le Sahel dans le
  continent, dans l'Histoire. Transition vers la question finale.
- **Technique causale** : DÉZOOM révélateur (#changement d'échelle) — la carte AES s'ANCRE dans le continent
  africain (on découvre le bloc dans son contexte continental). Le territoire ne change plus ; c'est le CADRE qui
  s'élargit = "ce qui vient après" est plus grand que la carte.
- **Assets** : (1) DÉZOOM LENT continu : la vue serrée AES s'éloigne, le continent africain entre dans le cadre,
  le bloc AES (3 pays or unis) devient un point fort sur le continent ; (2) overlay léger "3 ans · statu quo de
  60 ans brisé" (sobre, peut être juste un sur-titre) ; (3) le bloc AES garde sa couleur or unie (acquis Ph7).
- **Mouvement** : DÉZOOM ARRIÈRE majeur, lent, solennel. C'est le début de la sortie. La carte respire grand.

### Phrase 10 — "Ce nouveau bloc parviendra-t-il à réussir là où les anciennes alliances ont échoué — c'est-à-dire à sécuriser durablement les populations, à stabiliser ses frontières, et à faire tenir dans le temps les institutions qu'il vient de bâtir ?" (réussir f12662)
- **Comprendre** : LA QUESTION OUVERTE, en 3 volets (sécuriser / stabiliser / faire tenir). Pas de réponse. On
  laisse le spectateur avec l'interrogation.
- **Technique causale** : suspension — dézoom qui CONTINUE, drift calme, overlay-question léger. Aucune action
  causale (on a quitté la carte de manœuvre). Le vide/l'espace = l'incertitude.
- **Assets** : (1) dézoom continue (suite Ph9), drift très calme ; (2) overlay texte léger "Sécuriser · Stabiliser
  · Durer ?" (3 volets, sobre, espace négatif, serif) OU juste la question pendue ; (3) le bloc AES tient au
  centre, seul sur le continent. La question reste sans réponse.
- **Mouvement** : drift calme, dézoom qui ralentit. Préparer l'extinction.

### Phrase 11 — "Car résister, l'Alliance a déjà prouvé qu'elle savait le faire. Construire, elle a commencé. Mais durer, c'est ce qu'il lui reste encore à démontrer." (résister f13082 · construire f13200 · durer f13290 · démontrer f13372) ⭐ CHUTE FINALE — toute la vidéo s'achève ici
- **Comprendre** : la GRADATION finale — résister (prouvé) / construire (commencé) / durer (à démontrer). Chute
  morale. Puis NOIR. Fin de la vidéo.
- **Technique causale** : EXTINCTION progressive (esprit SOUSTRACTION de P1, bouclage) — la carte s'estompe, les
  3 drapeaux/le bloc AES en fondu, retour au noir. Le geste de fermeture = retrait, pas ajout.
- **Assets** : (1) à "résister" (f13082) : la carte est calme, le bloc AES uni au centre ; (2) gradation visuelle
  sur les 3 mots — "résister" (le bloc tient, ferme) → "construire" (léger éclat doré, l'étoile force conjointe
  rappelée) → "durer" (la carte commence à s'estomper) ; (3) à partir de "durer" (f13290) : EXTINCTION — fill
  contrôle → 0, contours nationaux fade, grain papier qui s'assombrit ; (4) optionnel : les 3 drapeaux AES (ml/bf/
  ne, useClipFlags) en fondu doux avant le noir ; (5) à "démontrer." (f13372) : NOIR complet (~10-15f de fondu).
  La phrase-morale reste pendue sur le noir 1-2s (silence final).
- **Mouvement** : caméra immobile ou dézoom ultra-lent qui se fige. L'extinction se fait par l'opacité, pas par
  le mouvement. Fin sobre, grave, ouverte.

---

## TECHNIQUES CAUSALES MOBILISÉES (récap, du catalogue)
| # | Technique | Où dans P4 |
|---|-----------|------------|
| 1 | Avancée / déplacement de jetons | Ph2 (réfugiés FUIENT les 3 villes, traînées de fuite) |
| 3 | Donnée qui se MONTRE (objet géo-ancré / contour) | Ph5 (or Mali+BF), Ph6 (uranium/pétrole Niger), Ph7 (3 contours fusionnent) |
| 5 | Casser la grammaire (changement de registre) | Ph1 (militaire→humain), Ph4 (humain→ressources), Ph8 (territoire→concept CFA) |
| — | Overlay donnée (chiffre sans équivalent carto) | Ph3 (coût chiffré), Ph7 (confédération), Ph8 (CFA), Ph10 (question) |
| — | Dézoom révélateur (changement d'échelle) | Ph9 (AES dans le continent), Ph10 (suspension) |
| — | Extinction / soustraction (bouclage P1) | Ph11 (chute finale → noir) |

## REGISTRE CHROMATIQUE P4 (l'arc en 3 couleurs)
- **Mouvement 1 — LE COÛT (Ph1-3)** : registre GRAVE/humain. Sable désaturé (fuite) + rouge sourd `#6B1A1A`
  (gravité), jetons-visage. PAS de couleurs vives. La carte se calme.
- **Mouvement 2 — LE LEVIER (Ph4-6)** : registre DORÉ/ressources. Or `#C9A24B` (lingots) + jaune-orange
  (uranium/pétrole Niger). La carte "rayonne", montée d'énergie.
- **Mouvement 3 — LA PERSPECTIVE (Ph7-11)** : registre UNI/solennel. Contours qui fusionnent en or AES, puis
  dézoom continental, puis extinction au noir. Fermeture.

---

## ⚠️ ANGLES MORTS / DÉCISIONS À TRANCHER (avant ou pendant le DA-brief)

### ANGLE MORT 1 (technique → je tranche, mais à vérifier) — Icônes-ressources top-down
Le script demande des ICÔNES top-down posées sur la carte : lingot or (Ph5), cristal uranium + goutte pétrole
(Ph6). Sur disque on a `wagon-cargo-or.png` et `convoi-uranium.png` = des VÉHICULES (wagon, convoi), pas des
icônes-symbole statiques. **Reco** : générer 3 petites icônes top-down cohérentes parchemin (lingot / cristal /
goutte) via Gemini (i2i depuis le style warmap) — c'est ~1 génération groupée, peu coûteuse, et l'identité
"objet posé sur le papier" est meilleure qu'un véhicule. À valider avec toi avant génération (règle visual-producer).

### DÉCISION DE GOÛT 1 — Plein écran vs overlay ancré (le débat clé de P4)
Le brief dit : plein écran VALIDÉ pour les CONCEPTS non-spatiaux de P4 (CFA notamment), overlay semi-transp pour
le territorial. **Ma lecture** : Ph3 (coût) = ancré (encore spatial, lié aux 3 pays) · Ph7 (confédération) =
ancré (la fusion des contours porte le sens) · Ph8 (CFA) = plein écran OK (concept monétaire pur) · Ph10
(question) = overlay léger sur la carte dézoomée. À confirmer par toi — c'est une décision de registre.

### DÉCISION DE GOÛT 2 — Jetons-visage réfugiés : 1 par ville ou flux/rubans ?
Deux options pour Ph2 : (A) 1 jeton-visage par ville (Djibo/Ménaka/Tillabéri) + traînée de fuite — incarnation
forte, 3 visages ; (B) rubans `RefugeeFlow` (corridors de masse) — montre l'AMPLEUR (millions) mais moins
incarné. **Reco** : (A) pour l'incarnation (le script garde "l'incarnation"), avec une discrète traînée. Le
chiffre de masse (millions) est porté par l'overlay Ph3. À trancher.

### DÉCISION DE GOÛT 3 — SFX P4 (délégué à Claude, comme P3)
Proposition : (a) note grave/impact sourd au "coût" / "trois millions" (Ph3, le poids du chiffre) ; (b) pop
doré discret aux apparitions or/uranium (Ph5-6, le levier qui s'installe) ; (c) gong/note solennelle à la
fusion confédération (Ph7) ; (d) souffle/extinction sur la chute finale (Ph11). PAS de SFX sur le dézoom Ph9-10
(respiration). À confirmer.

---

## DÉCISIONS DE GOÛT — TRANCHÉES PAR AZIZ (2026-06-14, avant DA-brief)
1. ✅ **Réfugiés (Ph2)** : JETON-VISAGE par ville + traînée de fuite (Option A). Incarnation forte (1 visage à
   Djibo/Ménaka/Tillabéri + petite traînée). L'ampleur (millions) portée par l'overlay chiffré Ph3. PAS de rubans de masse.
2. ✅ **Overlays concepts** : CFA (Ph8) = PLEIN ÉCRAN (concept monétaire pur, dézoom légitime). Coût chiffré (Ph3)
   + confédération (Ph7) = overlay ANCRÉ semi-transp sur la carte (encore spatial). Cohérent doctrine War-Map.
3. ✅ **Icônes-ressources** : GÉNÉRER 3 icônes Gemini i2i (style warmap parchemin) — lingot or / cristal uranium /
   goutte pétrole top-down. 1 génération groupée. Prompt montré à Aziz AVANT lancement (règle visual-producer).
   NE PAS réutiliser wagon-cargo-or/convoi-uranium (= véhicules, pas symboles-ressource).
4. (SFX P4 — délégué Claude, voir ANGLE MORT décision de goût 3 ci-dessus, à confirmer au moment du code.)

## SYNTHÈSE DA-BRIEF UPSTREAM (Gemini 3.1 Pro + Kimi K2.5 + DeepSeek V4, 2026-06-14 — signal vérifié, jamais gobé)
> Output archivé : `/tmp/da-refs/da-warmap-sahel-p4-upstream-{gemini,kimi,deepseek}.md`. 3/3 valident le plan +
> la structure 3 mouvements. Convergence FORTE, 0 hallucination (tout dans la boîte à outils). Gemini=SIGNAL jamais juge.

**CONVERGENT 3/3 (à intégrer au code — robuste) :**
1. **Pivot Coût→Levier (Ph3→Ph4) = LE point critique, traité identiquement par les 3** : éviter le cynisme via
   la MISE EN SCÈNE DU DEUIL. Les jetons-visage ne fondent PAS bêtement → ils s'ENFONCENT (translateY +30px,
   opacity→0, "quittent le champ"). Puis VIDE ABSOLU 1s (carte nue, contours qui respirent scale 1→1.015→1).
   Puis très légère remontée de luminosité ("aube", pas triomphe) AVANT que l'or apparaisse. L'or = l'aube
   après la nuit, pas le cynisme après la pitié. Pas de doré avant le mot "or".
2. **Fusion confédération Ph7 = surtout EFFACER les frontières INTERNES** (Mali-BF, BF-Niger, Mali-Niger →
   opacité 0) pendant que le périmètre EXTERNE devient or uni. Cross-fade couleur sur 1.5s (24f), JAMAIS
   instantané (= "morphing PowerPoint cheap"). Garder les NOMS des pays visibles pendant la fusion (label qui
   passe de couleur nationale → or). Sinon "bouillie colorée" + spectateur ne comprend pas.
3. **Chiffres Ph3 = compteur cinétique** (countUp/odomètre à tambour, translateY masqué OU spring overshoot
   amorti), JAMAIS un texte qui "pop" (= effet "diapo Excel / dashboard"). Les 2 chiffres décalés (déplacés au
   "trois millions", insécurité au "quinze", +5-8f d'écart).
4. **Accumulation, PAS substitution (Ph5-6)** : l'icône or sur Bamako RESTE quand l'uranium arrive sur Niamey.
   L'écran se remplit comme un plateau de pesée (le levier s'alourdit). Évite le "ton catalogue / liste de courses".
   Caméra : drift LENT continu qui balaie Bamako→Niamey PENDANT les poses (le territoire révèle ses atouts, pas
   un diaporama). La carte ne CHASSE pas l'or, l'or vient à elle (drift calme stable, pas de scan).
5. **Extinction Ph11 = STRUCTURELLE par couches, pas un fondu global** (= "fin de diaporama anniversaire" cheap) :
   "résister" (overlays/textes partent, bloc se fige, micro-épaississement du contour) → "construire" (court éclat
   doré sur l'étoile QG Niamey, rappel) → "durer" (fill or→0, désaturation + grain sombre qui monte) → "démontrer."
   CUT TO BLACK strict (~15f max, pas de fondu lent). La TIMELINE meurt EN DERNIER. Phrase-morale pendue 1,5s sur
   noir, typo très légère couleur encre/or sombre (inscription gravée). Pas de musique triomphale.
6. **Synchro narrative pas arithmétique** : uranium au mot "uranium", pétrole au mot "pétrole" (décalés ~8f) ·
   fusion au mot "confédération" · étoile au "Niamey/Barkhane" · dézoom débute au "statu quo de 60 ans".

**ENRICHISSEMENTS RETENUS (faisables, à coder) :**
- **Onde d'union Ph7** (DeepSeek+Kimi) : après la fusion couleur, un cercle doré expansif part de Niamey/centre
  vers la bordure puis fond (~0.7s) = la soudure politique qui RAYONNE. "À coder mais faisable". RETENU.
- **Respirations actives** (3/3) : micro-drift caméra continu (déjà le pattern P3 `getPartie3Cam` driftLon/Lat)
  pendant Ph1/Ph4/Ph9 → jamais de diapo figée. Grain papier qui respire légèrement (opacity 0.95→1.05).
- **Texte question Ph10 dans le VIDE géographique** (Gemini) : après dézoom continental, placer "Sécuriser ·
  Stabiliser · Durer ?" DANS le vide (Sahara/Atlantique), sans cartouche, typo serif encre #2A1C0E. Le vide
  géographique renforce l'incertitude. Excellent — RETENU.
- **Traînées de fuite Ph2 = courbes organiques** (Bézier avec bruit léger), pointillés sable 2px, PAS de lignes
  droites laser ni de flèches. Délai 0.4s (12f) entre les 3 villes (pas 0.2s — l'œil doit scanner). RETENU.
- **Vignette/spotlight Ph9-10** (Kimi) : vignettage progressif qui force le regard sur le bloc AES au centre du
  continent avant l'extinction. RETENU (sobre).
- **Drapeaux finaux Ph11** : si gardés, TRÈS petits, fondu 20f, à peine visibles (les 3 voix insistent : pas de
  sentimentalisme). OPTIONNEL — à juger au render.

**AI-SLOP — verrous AVANT code (3/3) :**
- Icônes ressources Gemini : prompt STRICT "flat vector, single brown/ochre ink, transparent bg, medieval map
  iconography, NO 3D, NO drop shadow, NO saturated color" + `mix-blend-mode:multiply` dans Remotion (incrustation grain).
- Jaune uranium Ph6 DÉSATURÉ (#E8B858 max, terreux, JAMAIS #FFD700 "taxi").
- Typo overlays = même serif que les labels carte (Cormorant Garamond family), JAMAIS Inter/system-ui ("Canva").
- Easing icônes = spring `cubic-bezier(0.34,1.56,0.64,1)` (poids), pas ease-in-out robotique. Lingot tombe plus
  "lourd" que jeton humain.
- Étoile force conjointe Ph7 = styliser en SCEAU DE CIRE / cachet gravé parchemin (Gemini i2i), PAS étoile
  géométrique générique "objectif jeu vidéo". 1 micro-plaque, pas d'effet lumineux superflu.
- Halos ressources = onde concentrique propre (cercle clippé scale+opacity) ou radial-gradient SVG palette, PAS
  un box-shadow CSS glow ("web 2.0").
- Un SEUL overlay ancré à la fois (l'ancien disparaît avant le nouveau).

**ÉCARTÉ / à ne PAS suivre (vérifié) :**
- Kimi "carte 2.5D = 2 couches Sahel opaque / reste Afrique 0.6 pour relief" Ph9 → SÉDUISANT mais alourdit
  l'archi (la Map continue est 1 seule couche). Le dézoom + vignette suffisent à isoler le bloc. ÉCARTÉ pour P4
  (à explorer hors-ligne si on veut un effet "isolement" plus tard).
- "Picto pièce de monnaie CFA" (Kimi+DeepSeek) Ph8 : tentant pour ancrer le concept, mais le mot "Franc CFA" +
  "Paris" en héros de l'overlay suffit ; un picto pièce risque le cliché. À TRANCHER par Aziz (cf. décision 4).
- Drapeaux finaux : 3/3 disent "danger sentimentalisme" → garder OPTIONNEL, juger au render (cf. décision 5).

## ⭐⭐ REVUE CAUSALE — DA-BRIEF v2 (Gemini + Kimi, catalogue + chaînes de réf, 2026-06-14)
> Output : `/tmp/da-refs/da-warmap-sahel-p4-causal-{gemini,kimi}.md`. DeepSeek a planté (parsing). 2 voix
> CONVERGENTES + profondes sur la causalité (le 1er brief l'avait sous-traitée). Vérifié contre la doctrine.
> Relance demandée par Aziz : "vous n'avez pas demandé comment rendre TOUTES les actions causales" — corrigé ici.

**RISQUES CAUSAUX IDENTIFIÉS (3 phrases ÉLEVÉ/CRITIQUE — à coder avec soin) :**
- **Ph7 fusion confédération = CRITIQUE** (2/2) : un morph de couleur des 3 contours = "PowerPoint". CAUSE
  manquante. ✅ SOLUTION RETENUE : (1) fils/beams partent des 3 capitales (Bamako/Ouaga/Niamey) et CONVERGENT
  vers le centre/Niamey (`GeoConvergenceOverlay` ou stroke-dashoffset) = l'accord politique ; (2) au contact,
  l'or se propage et "soude" via `TerritorialExpansion` couleur cible or, les frontières INTERNES s'effacent ;
  (3) le sceau `icon-sceau-confederation` s'appose sur Niamey comme un COUP DE TAMPON (scale Y compressé→release
  spring = "cire chaude"). Cause (l'accord) → effet (fusion) → sceau (officialisation). 100% causal.
- **Ph3 chiffre = ÉLEVÉ** (2/2) : un overlay qui pop = la donnée s'ÉCRIT (anti-pattern P2 "40% en coin = supprimé").
  ✅ SOLUTION RETENUE : overlay `WarMapOverlayDynamic` mode ANCRÉ via `anchorPx` SUR le cluster des 3 jetons-visage
  réfugiés (pas centré écran). Les chiffres = LÉGENDE de ce que représentent les visages, pas une diapo. Option
  Kimi : les 3 contours se remplissent légèrement rouge #6B1A1A proportionnel (donnée qui se montre) PUIS overlay confirme.
- **Ph5-6 ressources = ÉLEVÉ** (2/2) : icône qui pop sur la capitale = "or qui vient du ciel / météo". CAUSE
  manquante. ✅ SOLUTION RETENUE (simple) : contour pays pulse (le sol révèle sa richesse) → remplissage diffus
  monte dans le contour (`burkinaFill` couleur ressource, opacité ~20%) → l'icône ÉMERGE du remplissage (scale
  0→1 spring overshoot), ne pop pas sèche. Pour Ph6 : "le monde entier en a besoin" = micro-halos dorés qui
  ondulent depuis Niamey (`smokePingPong` doré, PAS de flèche). [Option Kimi "sillage depuis les mines réelles"
  = plus riche mais + complexe (waypoints+coords mines) → écartée pour rester simple, à garder en backlog.]

**RISQUES MOYENS (validés avec garde-fou) :**
- **Ph2 réfugiés** : si les visages poppent sans cause → la ville doit d'abord "souffrir" (micro-pulse rouge sourd
  #6B1A1A sur le point-ville) AVANT que le jeton-visage s'en extraie + traînée qui part DE la ville (pas au milieu
  du désert). Technique #2 (3 temps : tension→départ→sillage) + délai 0.4s entre villes. RETENU.
- **Ph9-10 dézoom** : pur mouvement caméra → garde-fou : TARGET LOCK sur le centre AES pendant tout le dézoom
  (le bloc reste centré, le continent entre dans le cadre), micro-rotation lente 0.5°. Sinon "dérive dans l'océan". RETENU.
- **Ph11 extinction** : courbe easeInExpo sur l'opacité (lent→accélère), PAS linéaire. La TIMELINE meurt EN
  PREMIER (le temps s'arrête) puis plaques→contours→grain noir. Kimi : garder les 3 contours en filigrane or 0.1
  jusqu'à la dernière seconde (silhouette persistante). RETENU.

**CAUSALITÉ — CE QUI EST LÉGITIMEMENT NON-CAUSAL (et c'est OK)** : Ph1 (transition/respiration), Ph4 (board
clearing = le narrateur change de sujet), Ph8 (concept CFA, dézoom), Ph9-10 (mise en perspective). Une conclusion
n'est PAS 100% causale — les phrases de RESPIRATION/CONCEPT le sont par soustraction ou par la voix, pas par un acteur.

**RÈGLE CHROMATIQUE ABSOLUE (2/2, anti-cynisme — grave)** : ⛔ JAMAIS rouge #6B1A1A (coût) et or #C9A24B (levier)
À L'ÉCRAN EN MÊME TEMPS. Le rouge doit être COMPLÈTEMENT effacé (fade→0) avant que le 1er or n'apparaisse.
Transition par le VIDE : "la terre est rouge de sang" → "la terre est nue (parchemin)" → "de cette terre sort l'or".
Le levier est une RÉPONSE/extraction, pas une négation de la souffrance. C'est ce qui rend le pivot honnête.

**COMPARAISON AU GENRE (ce qu'on prend, sans trahir notre identité) :**
- **Operations Room** : chiffres POSÉS sur les zones concernées (pas overlay central flottant) → Ph3 : `WarMapPlaque`
  chiffres près de Djibo/Ménaka/Tillabéri, pas juste un bloc global. RETENU (renforce la causalité spatiale).
- **Kings & Generals** : alternance d'échelles marquée (stratégique ↔ insert humain) → rythme P4 = micro/grave
  (Ph2-3) → moyen/ressources (Ph5-6) → macro/concept (Ph8-10). C'est la "respiration de caméra" anti-catalogue. RETENU.
- **BazBattles** : économie narrative (moins d'éléments, plus lisibles) → Ph5-6 : 2-3 sites max par pays, pas tout. RETENU.
- **CE QU'ON PROTÈGE (mieux qu'eux)** : grammaire causale stricte (eux = fronts qui bougent sans dire qui agit) ·
  palette parchemin (eux = satellite/Google Earth) · honnêteté données (pas de faux ticker temps réel). NE PAS singer.

**ENRICHISSEMENTS RETENUS (nos briques) :** (1) Ph7 "soudure confédérale" = `countryOutline` pulse +
`GeoConvergenceOverlay` fils + `TerritorialExpansion` or + sceau tampon — DÉJÀ FAISABLE ; (2) Ph3 overlay ancré sur
cluster (`anchorPx`) — DÉJÀ FAISABLE ; (3) respiration des contours (sinusoïde opacité 0.6→0.8) pendant les drifts —
DÉJÀ FAISABLE ; (4) ombre portée SVG sous les icônes ressources (pas blur CSS) pour les "asseoir" — DÉJÀ FAISABLE.

**ARBITRAGES À TRANCHER PAR AZIZ (ce que le brief fait remonter) :** voir AskUserQuestion session.

## DÉCISIONS À TRANCHER PAR AZIZ (post-DA) — TRANCHÉES 2026-06-14
5. ✅ **Franc CFA Ph8** : TEXTE SEUL ("Franc CFA" + "encore lié à Paris"), PAS de picto pièce, PAS de fil
   Sahel→Paris. Sobre. Le mot est le héros. (Écarte la suggestion picto de Kimi/DeepSeek.)
6. ✅ **Drapeaux finaux Ph11** : coder l'extinction par couches SANS drapeaux d'abord → DÉCIDER AU RENDER si un
   fondu de 3 drapeaux très petits (20f) ajoute. Risque sentimentalisme (3 voix) → prudence.
7. ✅ **Assets Gemini** : générer DIRECTEMENT avec le prompt anti-AI-slop du DA-brief (flat ink parchemin, no 3D),
   PUIS montrer le résultat à Aziz (pas de validation prompt préalable cette fois — décision Aziz). FAIT : 4 assets validés visuellement.
8. ✅ **Ph5-6 ressources (causalité)** : contour pays PULSE → remplissage diffus monte (`burkinaFill` couleur
   ressource ~20%) → icône ÉMERGE du remplissage (scale 0→1 spring). PAS de pop sec. Version "sillage mines réelles" = backlog.
9. ✅ **Ph2 réfugiés (causalité)** : chaque ville PULSE micro rouge sourd #6B1A1A (la cause : routes coupées/
   marchés fermés) PUIS le jeton-visage s'en extrait + traînée DE la ville. Technique #2 (3 temps). Délai 0.4s entre villes.
10. ✅ **Ph3 chiffre (causalité)** : 1 SEUL overlay `WarMapOverlayDynamic` mode ancré (`anchorPx`) SUR le cluster
   des 3 jetons réfugiés. Chiffres = légende des visages. PAS de plaques dispersées (1 foyer, doctrine anti-surcharge).

## MÉTHODE — PROCHAINE ÉTAPE
1. ✅ **DA-BRIEF-GATE upstream** FAIT (Gemini+Kimi+DeepSeek, synthèse ci-dessus). Aziz tranche le goût → PUIS code.
2. **CODER** : copier `Partie3Rupture.tsx` → `Partie4Cout.tsx` (réutiliser kit + RefugeeFlow + WarMapOverlayDynamic),
   brancher `partie4` dans le moteur (mode + getPartie4Cam + gates + contours nationaux + CONTOUR_HIDE_WINDOWS +
   SFX), enregistrer `SahelPartie4` dans Root. Render full HD pour juger.
3. **ASSEMBLAGE FINAL** (après validation P4) : concat Acte1+P1+P2+P3+P4 + narration globale + mix. DERNIÈRE étape.
