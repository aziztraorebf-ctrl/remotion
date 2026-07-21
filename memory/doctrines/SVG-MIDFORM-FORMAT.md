# Doctrine — FORMAT SVG mid-form (& SVG-insert) ⭐⭐

> 🧭 ORDRE DE LECTURE : (0) SVG-FAISABILITE-AMONT (valider la vue AVANT) → (1) SVG-SCENES-GENERATIVES (generer+animer, manuel principal) → si multi-agents : PRODUCTION-AGENTIQUE-SVG → **(si format video long) VOUS ETES ICI — SVG-MIDFORM-FORMAT**.

> Prouve 2026-06-25 (test franc CFA, ~45s, 3 registres). Le SVG genere (GLM-5.2 / Gemini / GPT) + anime par frame
> en Remotion n'est pas qu'un effet ponctuel : c'est un FORMAT de video a part entiere ET un OUTIL narratif a integrer
> dans TOUS les scripts. Source de verite du format. Voir aussi : [[SVG-SCENES-GENERATIVES]] (technique de generation),
> [[openrouter-svg]] (modeles + colorisation timee), `memory/episodes/_rnd/PLAN-ANIMATION-CFA-MIDFORM.md` (plan exemple).

## Ce que le SVG fait MIEUX que tout (le critere d'usage)

Le SVG excelle quand **le sens se construit par le TRAIT et la TRANSFORMATION** — qu'il soit :
- **conceptuel/abstrait** : un mecanisme, un flux, un montage financier, une parite (ex. franc CFA : zone -> parite verrouillee -> depot -> flux sortant) ;
- **narratif/metaphorique** : un recit incarne porte par des formes qui se dessinent/colorisent/transforment (ex. PROUVES : Grande Muraille Verte = graine qui devient arbre, mur qui se construit ; Soudan = "l'or sort de la terre et finance la guerre" = pelle, lingot, creuset).

Le point commun : **ca se RACONTE par des formes qui evoluent** (tracage, colorisation timee, assemblage, transformation, flux). Pas une image figee — un geste visuel.

## ⭐⭐ 4 REGISTRES VIDEO LONGUE SVG (valides Aziz, 2026-07-02)

> Le format long SVG se decline en 4 registres de mise en scene distincts. Ce ne sont pas des palettes
> (voir [[SVG-SCENES-GENERATIVES]] § REGISTRES pour ca) mais des ARCHITECTURES DE SCENE — le choix se fait AVANT la palette.

1. **Narratif SVG** (le format deja grave) : scene-lieu, personnage-vivant-svg, transformation/voyage. Voir patterns ci-dessous + [[PERSONNAGE-VIVANT-INDEX]].
2. **Data-viz plein ecran sur grille Vox** (3e voie, ouverte 2026-07-02) : composition facon Bloomberg/Vox — grille de fond (`GridBackground`, stepSmall=30px, stepLarge=150px, pas de decor narratif), 1-2 visualisations plein cadre (barres/donut/compteur), typographie Georgia serif. Palette : `BG="#0f1a2e"`, `GRID="#1e2d47"`, `INK="#2b2117"`, `PARCH="#e8dcc0"`, `PARCH_DIM="#b0a58a"`. Protos : `_rnd/svg-scenes/ProtoDataVizPleinEcran.tsx` + `ProtoDataVizEncre.tsx`.
3. **Presentateur + data** : un personnage (rig FK Gemini) interagit avec un ecran de donnees incruste (DataScreen), dialogue/geste vers l'ecran + bulles de dialogue (SpeechBubble). Proto : `_rnd/svg-scenes/ProtoDialogueEcran.tsx`.
4. **2D flat maps (d3-geo)** (pas encore teste en render) : projection SVG reelle via d3-geo + rendu encre/parchemin, pour la geo qui a besoin d'exactitude SANS Mapbox 3D (Aziz : "Mapbox 3D casse l'esthetique SVG dessinee"). A tester : starter (FAIT/archive) `memory/archive/starters-perimes-2026-07-11/STARTER-PROMPT-refactoring-svg-et-map2d.md` § CHANTIER 2.

### Cross-fade NARRATIF -> DATA-VIZ (prouve 2026-07-02)
Preuve : `out/_r-and-d/narratif-plus-data-proto.mp4`, code `_rnd/svg-scenes/ProtoNarratifPlusData.tsx`. Enchaine scene narrative (CargoVoyage16x9) puis transitionne vers data-viz plein ecran (DonutScene sur GridBackground) via crossfade opacity. Usage : commencer un beat en narratif (incarner l'enjeu) puis basculer vers la preuve chiffree SANS rupture. Les 4 registres ne sont pas exclusifs — ils se composent dans une meme video.

## ⛔ Ce pour quoi le SVG n'est PAS le bon outil (garde-fou anti-dilution)

- **Geo reelle 3D/zoomable** (territoire, frontieres, bataille situee, trajet avec pitch/rotation) → reste **Mapbox** (frame-driven).
- **Geo reelle 2D plate/illustree** (contour de pays, projection simple, pas de relief) → **d3-geo + SVG** (registre 4 ci-dessus).
- **Organique humain/animal realiste, emotion d'un visage, scene "filmee"** → reste image generee / Seedance / vraie matiere.
- **Recit chronologique pur "que s'est-il passe"** sans transformation visuelle a montrer → narration classique.

Ce garde-fou preserve la signature de chaque format (une War-Map reste geo, etc.) SANS amputer le SVG de sa force narrative. Le critere n'est donc PAS "abstrait vs narratif" (erreur), c'est "**transformation visuelle de formes OUI ; geo reelle seule / organique realiste / recit sans transfo NON**".

**Cas hybride SVG + géo réelle = POSSIBLE via SVG-insert** : un beat Mapbox peut contenir un insert SVG narratif (ex : War-Map AES = carte Mapbox pour la géo + `WarmapCfaInsertSVG` pour le mécanisme CFA). Ce n'est PAS une violation de ce garde-fou — c'est la complémentarité des deux formats. Le SVG-insert reste dans son rôle (transfo narrative), la carte reste dans son rôle (géo réelle). Arbre de décision complet : `memory/ROUTAGE.md` § "ARBRE DE DÉCISION".

## Le FORMAT mid-form 100% SVG (viable, prouve)

- **Viable en format long** (5-7 min) : 6-8 scenes SVG enchainees, CHACUNE ~30s-1min, avec changements de registre rythmes pour briser la monotonie. Contre-intuitif mais vrai : decomprimer (30-45s/scene au lieu de 5s) AMELIORE le rythme (chaque element/concept a le temps d'etre pose un par un), ca ne fatigue pas — A CONDITION que le script porte un raisonnement coherent.
- **Parfois PLUS SIMPLE qu'un beat Mapbox** : un appel GLM (~centimes) + animation par frame en controle total. Pas de carte qui derive, pas de headless capricieux. Le controle total est un avantage de PRODUCTION, pas que d'esthetique.
- **Regle anti-monotonie** : changer de registre toutes les 1-2 scenes (blueprint froid / encre chaude / flux / medaille / papier-decoupe). 3-4 registres dominants par video. Le CONTRASTE de registre = le moteur de retention.
- **Densite par scene** : une scene de 45s doit avoir ~4-6 micro-evenements echelonnes (sinon temps mort).

### ⭐ FOND + ACCENT du registre encre selon le TON (PAS un nouveau registre — 2026-06-27 : files.catbox.moe/jb8puk.png)
⚠️ Changer le fond (parchemin→blanc) et l'accent (vert→or→rouge) ne cree PAS un registre : c'est la colorisation
semantique deja en place. Acquis reel = **le fond peut quitter le parchemin** (blanc casse/froid tient aussi bien).
⛔ N&B INTEGRAL PROSCRIT (sans accent, formes grises = pierres mortes). TOUJOURS une couleur d'accent reservee au sens.
- **Espoir/nature/vie** → fond parchemin `#e8dcc0`, accent VERT. = signature GGW.
- **Analytique/mecanisme/argent** → fond blanc casse `#f4f1ea`, accent OR/bleu-acier. Pour CFA & co.
- **Tragique/guerre/perte** → fond blanc froid `#fbfaf7`, accent ROUGE SANG (le seul, jamais de vert).
Le TON se deduit au TYPAGE DU SUJET → source de verite : [[SUJET-PRIME-SUR-PRODUCTION]] § moteur narratif + densite.

### ⭐⭐ SCENE-LIEU A ACTIVATION SEQUENTIELLE — la grammaire de l'HORIZONTAL (prouve 2026-06-27)
> Le 16:9 a une exigence de densite que le 9:16 n'a pas (un objet seul y lit « inacheve », pas « aere »). Reponse =
> densite NARRATIVE, pas decorative. Preuve : scene-port animee `files.catbox.moe/voh2fv.mp4` (35s, encre, 0 API).
**Le pattern** : composer un LIEU (plusieurs objets coherents d'un meme decor, SANS organique humain — ex. un port :
grue+conteneurs+navire+caisses+panneau de prix ; un bureau : decret+balance+pieces+tampon+fenetre). On POSE la scene
calme (tout dessine en encre), PUIS on l'ACTIVE objet par objet (traçage + colorisation semantique timee sur le script).
- Chaque objet porte UN sens activable (aucun n'est du remplissage) → l'attention VOYAGE d'objet en objet = retention ~1 min.
- VERTICAL = sequence dans le TEMPS (un objet remplace le precedent) ; HORIZONTAL = sequence dans l'ESPACE (objets
  coexistent, le regard se deplace). Deux grammaires de montage distinctes — le ratio n'est PAS qu'un cadrage.
- La contrainte du champ large FORCE une sequence causale (la ressource sort → le prix vient d'ailleurs) = pousse a EXPLIQUER.
- Parent du Data-Hero ([[DECODE-mpesa-data-hero-MOTION]]) applique a une scene-lieu narrative. Cale les 4-6 micro-evenements/scene sur le script.

### ⛔⛔ SCENE-LIEU SANS MONTAGE TEMPOREL = EFFET POWERPOINT (jury 3 modeles, 2026-06-28)
> Prouve : test CFA "bureau 1994" (32s horizontal) juge par Gemini-video + Kimi-frames + Claude, 3 perspectives
> CONVERGENTES → verdict unanime "NON, pas au niveau de GGW, c'est du PowerPoint sophistique masque par des lignes
> d'encre". Verdicts : `scratchpad jury` (ou re-generer). Le diagnostic est FERME ; le remede ci-dessous est la version corrigee.
**LE TROU** : composer un lieu + activer/coloriser les objets sur place NE SUFFIT PAS. Sans transformation dans le
TEMPS, le plan reste fige = "tableau unique" = presentation d'entreprise. GGW raconte AVEC l'espace ; une scene-lieu
figee illustre un concept DANS un espace. La grammaire de couleur (3 mecanismes) est OK — ce qui manque = la mise en scene temporelle.

**⛔ LE PIEGE A EVITER — "mouvement de camera" (Aziz 2026-06-28, prouve faux pour le SVG)** : les modeles video
(Gemini/Kimi) recommandent des pans/zooms "camera". ⛔ FAUX pour le SVG headless : bouger le viewBox (zoom/pan/scale
du calque) fait SORTIR les objets du cadre et VIDE les bords (le SVG est dessine pour UN cadrage) — exactement le bug
constate sur les tests passes. Meme famille que `flyTo`/`easeTo` bannis en Mapbox headless. Les modeles nomment mal
ce qu'ils voient : GGW ne "zoome" pas, il ENCHAINE des etats d'objets.

**✅ LE REMEDE — mise en scene par REVELATION/TRANSFORMATION d'objets (natif SVG, PAS de viewBox mobile)** :
- **SPOTLIGHT / revelation** : un objet a la fois est mis en avant (eclaire / a pleine opacite), le reste recule en
  encre pale. L'attention "voyage" sans bouger le cadre. = la vraie version SVG du "mouvement de camera".
- **TRANSITION-ENCRE (signature, idee phare du jury)** : le trait s'efface ici et se REDESSINE la ; un element (ex. le
  fil rouge) s'echappe, traverse, et DESSINE la scene suivante. La scene se transforme au lieu que la camera se deplace.
- **ECHELLE D'OBJET** : l'objet-focus GRANDIT (lui-meme change de taille), les autres rapetissent/s'estompent. Pas un zoom camera.
- **MORPHING** : un objet se transforme en un autre (la piece -> la balance). Continuite par metamorphose.
- **PARALLAXE LEGERE** (a doser) : couches a vitesses differentes pour la profondeur — SANS vider les bords (amplitude faible).
- **⭐ FIL CONDUCTEUR VISUEL = l'OSSATURE (le plus structurant — convergence GPT-5.5 + Gemini, 2026-06-28)** : un trait/
  flux/element graphique UNIQUE qui RELIE les objets du lieu et porte le regard gauche->droite EN SUIVANT la causalite
  (ex. une veine de minerai qui va de la mine -> au port -> a la finance). Preuve forte : en CARTE BLANCHE TOTALE, GPT et
  Gemini ont TOUS DEUX, sans concertation, choisi le meme sujet (cobalt/RDC) AVEC un fil conducteur cyan reliant les poles
  (`files.catbox.moe/scgup3.png` + `7b1ruq.png`). C'est ce qui transforme une JUXTAPOSITION d'objets en scene RACONTEE :
  le fil impose la sequence causale ET fait voyager l'oeil sans bouger le cadre. A poser DES la composition de toute
  scene-lieu horizontale (c'est lui qui evite l'effet PowerPoint, plus encore que le spotlight).
→ Garde-fou avant TOUT format long horizontal : si une scene se contente de "poser + coloriser sur place", elle sera jugee PowerPoint.

---

## ⭐⭐ TRANSPOSER UN SHORT VERTICAL EN 16:9 + PROFONDEUR CINEMATOGRAPHIQUE (prouve 2026-06-29, proto B5 cacao)

Test : transposer le beat B5 "arbre aux 4 ombres" (9:16) en 16:9, puis le pousser jusqu'au plan de cinema.
Proto final : https://files.catbox.moe/ppqbb9.mp4 (paysage vivant, parallaxe + heure doree).
Code de reference : `src/projects/souverain/cacao-chocolat-short/beats/B5PontH.tsx` (compo `Cacao-B5PontH-16x9`).

### 1. La transposition 9:16 -> 16:9 = RE-COMPOSITION, pas reconstruction (~70% reutilise)
- **Reutilise tel quel** : les COMPOSANTS (CacaoTree...), la logique d'effet (ombrePath, drift, gouttes, spring),
  l'AUDIO, le karaoke word-level, les phases. Le SVG est parametrique -> redimensionnable/recomposable.
- **A re-composer** (le coût réel, ~1 fichier ~140 lignes ~15 min pour un beat simple) : viewBox `1920x1080`,
  position/echelle du sujet, ANGLES des elements, zones sures des labels, placement texte.
- ⚠️ Cout VARIABLE par beat : un beat simple/autonome (B5) = trivial ; un beat a perspective verticale forte
  (verger en plongee) ou split-screen geo = plus cher. NE PAS extrapoler "tout le short en 15 min".
- Estimation realiste : transposer un short SVG 5 beats deja produit = ~1 jour (assets+preprod deja la).

### 2. La grammaire CHANGE avec le format (pas qu'un re-cadrage)
- **Ombres/elements rayonnent LATERALEMENT** (l'oeil voyage G->D) au lieu de descendre. Le sujet decale a
  GAUCHE sur la ligne de force (regle des tiers) ; l'espace droit = respiration assumee, pas un vide a meubler.
- **SANS SOUS-TITRES** : 16:9 = ecran/TV, regarde SON ACTIVE (≠ vertical mobile souvent muet ou le ST est vital).
  Retirer le karaoke LIBERE la composition -> texte DIEGETIQUE (mots-cles/cartons integres DANS la scene, pas un bandeau).
- ⭐ **LE REGISTRE change aussi avec le RATIO (2026-07-07)** : l'encre-croquis GGW (traits fins, objet isole qui
  respire) est natif du 9:16 pedagogique — un objet seul y lit "aere". En 16:9 war-map (plan de bataille dense,
  plusieurs forces), le meme trait fin lit "pauvre/inacheve". Reponse prouvee (insert etat-major Khartoum) :
  basculer vers un registre GRAVE + DENSE (medaillon d'etat-major, terrain plein, batiments illustres) TOUT en
  gardant la DISCIPLINE COULEUR GGW (fond neutre + 1-2 accents SEMANTIQUES reserves au sens ; jamais N&B integral).
  Le ratio impose le registre, pas l'inverse. Cf [[WARMAP-INSERT-SVG-ETATMAJOR]] + hook or Darfour (colorisation
  selective : la pelle aux couleurs du drapeau = accent semantique, pas decoratif).

### 3. PROFONDEUR = la reponse au "vide horizontal" (le point cle)
Un seul element central FAIT VIDE en 16:9 (alors qu'il remplit le cadre etroit vertical). Solution = PLANS MULTIPLES :
- **Fond** : le motif principal repete au loin, COLORE (pas silhouette), tons VARIES (pas la couleur du heros),
  etage a 2 distances + brume d'horizon (bande plus claire) qui separe les plans.
- **Median** : le sujet-heros, plus grand (16:9 permet du grand).
- **Ciel vivant** : nuages qui derivent + oiseaux (boucle + fade aux bords = JAMAIS hors cadre, logique VergerCacao).
- ⛔ Ecarter le faux avant-plan decoratif (ex herbes/traits au sol) s'il "bouge bizarrement" sans lire — Aziz l'a rejete.

### 4. CAMERA LENTE + PARALLAXE + HEURE DOREE = le passage "plan anime" -> "plan filme"
- **Camera** : tres leger zoom-OUT + derive laterale (interpolate sur un transform global, pivot sur le sujet).
- **PARALLAXE** (l'effet le plus cinema) : appliquer le mouvement camera a INTENSITES differentes par profondeur —
  `camAt(p)` avec p=1.0 (1er plan), ~0.6 (median), ~0.28 (ciel). Le fond bouge MOINS -> profondeur PHYSIQUE percue.
- **Heure doree** : sur la duree, interpoler le fond parchemin -> ambre chaud + le soleil jaune -> ambre couchant
  (lerp de canaux hex). Ambiance cinematographique, reste dans le registre.
- Tout en `useCurrentFrame`+`interpolate`+`sin` (zero CSS transition). Vie permanente partout (Regle 3 GGW).

→ **Quand un format long horizontal est demande : NE PAS recadrer le vertical. Re-composer en pensant
  rayonnement lateral + 3 plans de profondeur + camera/parallaxe.** C'est ce qui evite le "vide TV".

### 4bis. SCENE-VOYAGE vs SCENE-TRANSFORMATION — quand coloriser, quand ne PAS coloriser (2026-07-02)
Distinction actée avec Aziz sur le patron "plan large parallaxe + véhicule" (`CargoVoyage16x9.tsx` /
`PortDechargement16x9.tsx`) — généralise au-delà du 16:9 personnage, s'applique à toute scène SVG narrative :
- **Scène-VOYAGE** (le sujet SE DÉPLACE mais ne change pas de nature en transit — ex : cargo qui traverse
  l'océan, camion sur une route) → une **palette stable/globale** suffit (éventuellement un lerp chaud→froid
  lié au TEMPS qui passe, pas à une transformation de la matière). PAS besoin de colorisation progressive
  objet-par-objet : rien ne se transforme, on ne fait que voyager.
- **Scène-TRANSFORMATION** (le sujet CHANGE D'ÉTAT — matière brute → produit fini, ex : cabosse → fève →
  chocolat, minerai → lingot) → **colorisation progressive OBLIGATOIRE** : c'est le VECTEUR du message
  narratif, pas un effet cosmétique. Cohérent avec le pattern déjà gravé Règle 2 GGW (§ ci-dessous, "la scène
  se dessine entière d'abord puis se colorie") et prouvé sur GGW/Cacao B3-B4 ("3 états").
- Critère de décision rapide : **le sujet a-t-il une nature différente à la fin qu'au début ?** Oui →
  transformation → coloriser progressivement. Non (il a juste changé de LIEU) → voyage → palette stable.
- Preuve d'application : `PortDechargement16x9.tsx` mélange les deux dans le MÊME plan — le cargo (a voyagé,
  ne se transforme pas) garde sa palette figée à l'arrivée, tandis que l'usine à l'arrière-plan se colorise
  neutre→premium pendant le déchargement (elle, transforme la matière) — la doctrine ne dit pas "toute la
  scène coloris" ou "rien ne colorise", elle s'applique OBJET PAR OBJET selon sa propre nature narrative.

### 4ter. CONTINUITÉ DE SCÈNE EN SÉQUENCE = réutiliser le CODE EXACT, pas "s'inspirer" (2026-07-02, leçon coûteuse)
Quand une scène SVG doit être la SUITE narrative d'une scène précédente (même monde qui continue, cf.
[[CONTINUITE-SCENE-INTENTION-DABORD]] §2), le réflexe correct est de **COPIER LITTÉRALEMENT** le code de
dessin des éléments qui persistent (véhicule, décor, constantes de palette) — PAS de re-décrire le même sujet
from scratch avec de nouvelles valeurs, même proches visuellement.
- **Erreur vécue** : 1ère tentative de `PortDechargement16x9.tsx` (suite de `CargoVoyage16x9.tsx`) a recréé un
  port générique avec un NOUVEAU ciel, un NOUVEL océan, un NOUVEAU style de cargo — visuellement dans le même
  registre mais un MONDE DIFFÉRENT. Verdict Aziz : *« ce n'est pas du tout une continuation, c'est une scène
  complètement différente. »* Rejeté malgré une doctrine de continuité déjà connue et une intention correcte.
- **Pourquoi ça casse la continuité perçue même si "ça ressemble"** : en SVG (contrairement au live-action),
  la continuité EST facile à obtenir techniquement — on peut littéralement réutiliser les mêmes fonctions de
  dessin, les mêmes constantes hex. Ne pas le faire = choisir la redite conceptuelle plutôt que l'identité
  exacte, ce que l'œil détecte immédiatement (couleurs/formes légèrement différentes = signal "nouvel écran").
- **Fix (réécriture v2 réussie)** : relire le fichier de la scène précédente, EXTRAIRE ses valeurs de couleur/
  géométrie exactes (`SKY_B`, `SUN_B`, `SEA_B` de `CargoVoyage16x9`), les réutiliser LITTÉRALEMENT comme point
  de départ figé (on "arrive" dans cet état) ; copier le dessin exact du véhicule (mêmes chemins coque/
  superstructure/cheminée/fumée) ; réutiliser la même fonction de lignes d'océan ; démarrer sur l'état exact où
  la scène précédente a fini (mêmes coordonnées d'étoiles, nuit qui redevient jour par vrai lever de soleil).
- **Réflexe généralisable** : pour toute future "suite de scène" SVG, la question n'est pas *"qu'est-ce qui
  ressemble ?"* mais *"quel fichier dois-je ouvrir et RÉUTILISER TEL QUEL ?"* — le patron "s'en inspirer" est
  le piège, celui de "réutiliser littéralement" est la règle.

### 5. PERSONNAGE D'ENCRE — la brique "identification" du FORMAT LONG (proto 2026-06-29)
Le long debloque un PROTAGONISTE (le short n'a pas le temps). Prouve : un planteur entre, marche, se penche, RECOLTE.
Proto : https://files.catbox.moe/hunvwd.mp4 · ref `out/templates-souverain/svg-personnage-encre-REFERENCE.mp4`.
Composant : `components/PlanteurEncre.tsx` (compo proto `Cacao-ProtoPlanteur-16x9`).
- ⛔ GARDE-FOU (doctrine SVG) : SILHOUETTE STYLISEE facon pictogramme GGW (traits epais, digne), JAMAIS un humain
  detaille/realiste (le SVG genere mal l'organique humain). Chapeau de paille = situe culturellement, rappelle VergerCacao.
- Animation paramatrique pure (props walkPhase/bend/armReach/facing) : balancier de marche (sin), flexion du buste
  (pivot a la hanche, ~28deg MAX — au-dela ca "plonge"/bascule), bras qui s'etend en recolte.
- ECHELLE CRUCIALE : un homme = ~1/3 d'un cacaoyer (scale ~0.5). Trop grand = casse l'echelle, lit faux.
- Combine aux autres briques (profondeur, parallaxe, plan-sequence champ->usine) = inventaire technique complet
  pour passer un sujet du SHORT (teaser) au LONG (immersion). Le 16:9+profondeur EST la base du format long.

---

## ⭐⭐ DOCTRINE GGW — LES 5 RÈGLES FONDAMENTALES (blueprint vivant, gravé 2026-06-28)

> GGW (Grande Muraille Verte) est notre **référence absolue** pour toute scène SVG encre narrative.
> Ces règles sont tirées de l'analyse frame-par-frame de `out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.mp4`.
> Elles s'appliquent AVANT tout appel à Gemini/GPT pour générer une scène.

### Règle 1 — Zéro chiffre à l'écran. L'information passe par la FORME.

Les chiffres appartiennent à la narration audio. La forme montre : arbres qui meurent = 80% d'échec.
Un chiffre à l'écran transforme une scène narrative en infographie. Même beau, c'est du PowerPoint.
Exception tolérée : une date isolée (ex. "1994"), un nom propre (ex. "TONY RINAUDO") — jamais un ratio/statistique.

### Règle 2 — La scène SE DESSINE ENTIÈRE D'ABORD, puis SE COLORIE.

Toute la scène arrive en encre neutre (rapidement ou lentement). ENSUITE la voix nomme un objet → il reçoit
sa couleur. La couleur = le doigt qui montre, pas l'objet qui naît.
Anti-pattern : construire ET coloriser en même temps (verdict : schéma, pas récit).
Bonne pratique : poser le décor complet en encre frame 1 → voix → couleur → voix → couleur → etc.

### Règle 3 — Tout est VIVANT dès la première frame.

Le soleil tourne. L'eau ondule. La turbine tourne. Les feuilles bougent. La caméra ne bouge PAS —
mais le monde à l'écran n'est jamais statique. La couleur arrive ensuite, mais la vie était là depuis le début.
Corollaire : une scène SVG sans mouvement permanent de fond = scène morte dès le départ.
La "caméra" ne bouge pas — c'est le DESSIN qui progresse dans l'espace (révélation de profondeur :
ciel → milieu → sol/racines). Le viewBox reste fixe en permanence.

### Règle 4 — FORMAT = DIRECTION NATURELLE DU SUJET (choisir AVANT la recherche approfondie)

**Vertical 9:16** = sujets dont le mouvement naturel est HAUT ↔ BAS :
- arbres qui poussent, eau qui monte, soleil qui écrase, graine qui germe, profondeur révélée par couches
- l'œil suit la gravité ou la vie — haut (ciel/contexte) → bas (sol/conséquence)

**Horizontal 16:9** = sujets dont le mouvement naturel est GAUCHE → DROITE :
- électricité qui voyage d'un barrage vers les villes, gaz qui traverse un continent, route commerciale,
  front de guerre, chaîne causale (ressource → transformation → exportation → profit)
- l'œil suit la causalité — le fil conducteur visuel EST la métaphore du voyage

**Gate à appliquer** : avant toute session de recherche approfondie sur un sujet SVG, poser la question :
"Le mouvement naturel de ce sujet est-il vertical ou horizontal ?" → choisir le format en conséquence.
Un sujet sans direction naturelle claire = questionner si SVG est le bon outil (vs Mapbox/Atlas).

### Règle 5 — FRAMES GGW COMME RÉFÉRENCE DE REGISTRE (pour tout modèle vision : Gemini, GPT, Claude, agents)

Quand on demande à un modèle (Gemini, GPT-5.5, Claude, agent remotion-composer…) de générer ou coder
une scène SVG encre narrative, joindre 5-7 frames GGW comme référence visuelle.
Les frames sont en 9:16 mais le modèle les utilise comme référence de REGISTRE (palette, trait, épure,
taille des héros), pas de composition — il adapte à la grammaire du format demandé (16:9 ou 9:16).
Valable aussi pour Claude lui-même en session : lire ces frames avant de coder une scène encre.

Frames canoniques permanentes : `public/_shared/refs/ggw-frames/`
(re-extraire si besoin : `ffmpeg -i out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.mp4 -vf "fps=1/7,scale=540:960" frame_%03d.jpg`)

| Frame | Ce qu'elle illustre | Règle |
|---|---|---|
| frame_001 | Scène entière en encre, pelle seule, tout le reste vide | R2 — dessin complet d'abord |
| frame_002 | Colorisation sélective verte sur fond encre, arbres vivants | R2 — mécanisme B en action |
| frame_004 | Deux arbres héros énormes, 60% du cadre, fond presque vide | R1 + R3 — taille + vide intentionnel |
| frame_005 | Un vivant + deux morts décharnés, contraste sans mot | R1 — forme montre, pas chiffre |
| frame_007 | Un seul objet héros + décor stable, grand vide | R3 — vie permanente + respiration |
| frame_013 | Racines révélées sous le sol, arbres en haut | R3 — profondeur révélée par couches |
| frame_019 | Vue mosaïque finale avec perspective, scène qui se referme | R2+R4 — clôture de la scène-lieu |

---

## ⭐ Le SVG-INSERT (dans TOUS les formats — la vraie bascule strategique)

Le SVG-insert (un bloc SVG de 30s-1min insere dans une video Mapbox/Atlas/Souverain/War-Map) doit etre pense **DES L'ECRITURE DU SCRIPT**, pas plaque apres coup. C'est integre a [[DOCTRINE-SCRIPT-UNIFIEE]] : a l'ecriture de tout script, reperer les moments "mecanisme/concept/transformation a expliquer" = candidats insert SVG. Chaque playbook format (ATLAS / SOUVERAIN / WARMAP) pointe vers cette doctrine.

Resultat : le script NAIT avec le bon outil pour chaque moment (SVG pour la transformation, Mapbox pour la geo, image pour l'organique), au lieu de "se casser la tete plus tard".

## Le PIPELINE prouve (script-first)

1. **Script-first** : ecrire le script en sachant ou le SVG sert (transformation/mecanisme/metaphore). C'est le denominateur commun long ET insert.
2. **Voix** : narration TTS reelle (Souverain : V3 Oceane -> STS GeoAfrique `z3gESu49naEZW8Af2Upm`). Mesurer la duree (ffprobe) + transcrire (Whisper `--word_timestamps`) pour caler les animations frame-perfect sur les mots-cles.
3. **Generer les SVG** par scene (GLM-5.2 defaut low-cost ; Gemini pour l'organique riche ; voir [[openrouter-svg]]). Decoupe en groupes nommes. Pour coloriser : groupe `couleurs` ferme (voir [[openrouter-svg]] colorisation timee).
4. **Animer par frame** (zero CSS) : tracage stroke-dashoffset, colorisation timee (opacite du groupe couleurs), flux (particules), gestes, transitions cross-fade + changement de fond entre registres.
5. **SFX** : reutiliser l'existant (`public/_shared/sfx/` — ink-spread, cedeao-snap, arrow-whoosh, cost-recovery-drain, liptako-gong, birds-ambient...). Nappe continue sous la voix.
6. **Render full HD** + verifier (frames + ecoute) + presenter.

## Acquis techniques (R&D 2026-06-24/25)
- Tracage : `strokeDasharray`/`strokeDashoffset` interpole 1->0 = le trait se dessine.
- Colorisation timee : groupe `couleurs` ferme dessous le trait, opacite animee (gotcha wrapper : [[openrouter-svg]]).
- Flux qui coule : particules (`<circle>`) qui defilent le long des fleches (phase % periode).
- Transitions : cross-fade (opacite) + changement de couleur de fond = marque le beat.
- Continuite : reutiliser un meme symbole entre scenes (ex. hexagone "zone CFA" beat 1 ET beat 3) = meme monde qui evolue.

## Reference vivante (test CFA)
- Composant : `src/projects/_rnd/svg-scenes/CfaMidformTest.tsx` (+ cfaMecaGroups / cfaMarcheGroups / cfaFluxGroups).
- Final : https://files.catbox.moe/fe3u3g.mp4 (colorisation timee OK). v1 PoC : https://files.catbox.moe/skaxho.mp4

---

## ASSEMBLAGE D'UN SHORT SVG (N beats -> video finale)

> Documente le REEL de GGW Muraille Verte (7 beats, 141s, branche `feat/shorts-svg-muraille-verte` + master).
> B7MosaiqueFinal.tsx : presente dans la svg-library + dans le rendu final, mais PAS enregistre dans Root.tsx
> (le render final a ete produit via renderMedia CLI directement depuis la branche). Signaler + committer B7 dans
> Root.tsx a l'assemblage du prochain short (pour pouvoir previsualiser dans Remotion Studio).

### 1. Principe : une composition d'assemblage par short (Series + Sequence)

Chaque beat = un composant TSX autonome avec ses `durationInFrames` et `fps` en export.
L'assemblage = 1 fichier `<Nom>Short.tsx` + 1 composition dans Root.tsx :

```tsx
// GgwMurailleVerteShort.tsx (a creer si manquant)
import { Series } from "remotion";
import { GgwHookEncreVivant } from "./_rnd/svg-scenes/GgwHookEncreVivant";
import { B2LigneBrisee } from "./_rnd/svg-scenes/B2LigneBrisee";
// ... importer chaque beat

const BEATS = [
  { component: GgwHookEncreVivant, durationInFrames: 640 },
  { component: B2LigneBrisee,       durationInFrames: 606 },
  { component: B3Malentendu,        durationInFrames: 468 },
  { component: B4Demilune,          durationInFrames: 750 },
  { component: B5LaPreuve,          durationInFrames: 424 },
  { component: B6Outro,             durationInFrames: 690 },
  { component: B7MosaiqueFinal,     durationInFrames: 642 },
];

export const GgwShort: React.FC = () => (
  <Series>
    {BEATS.map(({ component: Comp, durationInFrames }, i) => (
      <Series.Sequence key={i} durationInFrames={durationInFrames}>
        <Comp />
      </Series.Sequence>
    ))}
  </Series>
);

export const GGW_SHORT_TOTAL_FRAMES = BEATS.reduce((s, b) => s + b.durationInFrames, 0);
// -> 4220 frames a 30fps = 140.67s (correspondance validee ETAT-GGW 140.99s)
```

Dans Root.tsx :
```tsx
import { GgwShort, GGW_SHORT_TOTAL_FRAMES } from "./projects/_rnd/svg-scenes/GgwShort";
// ...
<Composition id="GGW-MurailleVerte-Short" component={GgwShort}
  durationInFrames={GGW_SHORT_TOTAL_FRAMES} fps={30} width={1080} height={1920} />
```

### 2. Cross-fade entre beats (si voulu)

`Series` enchaine sans transition. Pour un cross-fade :
- Utiliser `<Sequence>` + `premountFor` (charge le beat suivant N frames avant sa position)
- Opacite du beat sortant : `interpolate(frame, [end-15, end], [1, 0])` + `extrapolateRight:'clamp'`
- Opacite du beat entrant : `interpolate(frame, [start, start+15], [0, 1])`
- GGW N'A PAS utilise de cross-fade (coupes nettes + SFX pont = suffisant pour l'encre). Cross-fade = a
  utiliser seulement si les registres changent de facon abrupte (ex: encre -> blueprint).

### 3. Nappe musicale globale (technique GGW)

La nappe se pose EN UNE COUCHE sur l'assemblage, PAS sur chaque beat :
```tsx
// Dans GgwShort.tsx, au niveau de la composition entiere
import { Audio } from "remotion";
// ...
<Audio src={staticFile("audio/ggw-muraille-verte/music/ambiance-raw.mp3")}
  volume={0.10} />
{/* Series avec les beats ci-dessus */}
```
- Volume nappe : ~0.10 (sous la narration). Les narrations de chaque beat ont leurs propres `<Audio>`.
- Si la nappe est plus courte que le short : ajouter `loop` sur l'element `<Audio>` (fonctionne en headless, prouve GGW).
- `loop` sur un `<Audio>` = ok en render headless (non documente Remotion, valide 2026-06-22).

### 4. CTA final (beat dedie vs overlay)

Deux strategies :
- **Beat dedie** (GGW B7) : composant `B7MosaiqueFinal.tsx` est a la fois le climax esthetique ET le CTA.
  `typewriter` du CTA demarre quand la foret est en place (~frame 520 sur 642).
- **Overlay independant** : un composant `<CTAOverlay>` en `<Sequence from={totalFrames-120}>` sur la composition
  d'assemblage. Avantage : CTA unifie pour tous les shorts (pas a recoder par beat).
Recommandation : beat dedie si le CTA s'integre narrativement (climax = transition naturelle) ; overlay si le CTA
est generique et la derniere scene ne le porte pas.

### 5. Render final (CLI ou Vercel)

```bash
# Render direct depuis Root.tsx (beats individuels)
npx remotion render src/index.ts RND-GgwHookEncreVivant out/episodes/ggw-muraille-verte/beat1.mp4

# Render assemblage (composition GGW-MurailleVerte-Short)
npx remotion render src/index.ts GGW-MurailleVerte-Short out/PRET-PUBLICATION/ggw-muraille-verte-FINAL.mp4

# Pour >30s -> preferer render Vercel (evite saturation machine locale)
python3 scripts/tools/render-on-vercel.py --comp GGW-MurailleVerte-Short --out ggw-FINAL.mp4
```

### 6. Pre-cable Root.tsx AVANT de lancer les agents

Lecon GGW (2026-06-25, 2 agents en parallele) : le chef d'orchestre pre-cable TOUS les imports et
`<Composition>` dans Root.tsx AVANT de lancer les agents (meme si les fichiers TSX n'existent pas encore).
Les agents creent leurs fichiers, ils compilent immediatement sans toucher Root.tsx -> zero collision.
Si Root.tsx n'est pas pre-cable : les agents creent des fichiers "flottants" (pas de comp Remotion, pas
de previsualisation) -> risque de double touche sur Root.tsx.

### 7. Signaux d'alerte assemblage

- Un beat dont le `durationInFrames` differe de l'audio mesure au ffprobe = glissement de timing
  (recalibrer via `scripts/tools/ggw-b2-alignment.py` ou `ggw-b4b5-alignment.py`).
- La `<Series>` enchaıne en frames absolus : un beat trop long = decalage de TOUS les suivants.
  Verifier : `sum(BEATS.map(b => b.durationInFrames))` == duree totale attendue.
- B7MosaiqueFinal.tsx absent de Root.tsx sur master -> a enregistrer lors du prochain merge de `feat/shorts-svg-muraille-verte`.

**Reference GGW complete** : `memory/episodes/shorts-svg/muraille-verte/ETAT-GGW-MURAILLE-VERTE.md` (durees exactes de chaque beat, commits, liens catbox).

---

## Scène-Monde Persistante (prouvé 2026-06-28, session Grand Inga)

Un seul SVG qui change d'état sans coupe — la transformation EST le récit. Validé sur `IngaMondeV2.tsx` (60s, encre→colorisation→jour→crépuscule→nuit) et `IngaDualScene.tsx` (montage en continuité de monde, cross-dissolve).

**Règles :**
- Partir de l'encre pure (fond `#1a1008`, traits `#3a2a18`) — la couleur est une révélation, pas un décor
- Colorisation séquentielle GGW R2 : fleuve d'abord → turbine → câble → pylône → ciel
- Un objet inerte (barrage, maison, rocher) NE GLISSE JAMAIS — il s'illumine, change de couleur, ou fade
- La turbine Inga ne s'arrête JAMAIS narrativement — elle tourne à plein régime pendant que le village est dans le noir (erreur à éviter : la montrer arrêtée = faux historiquement ET narrativement)

**Option C — Désaturation intermédiaire (chromatic narration, prouvé `IngaMondeV2.tsx` avec `feColorMatrix saturate`) :**
Avant tout changement de palette vif→vif, passer par un gris-beige neutre (saturation→0.05 puis re-saturation). Le monde "s'éteint" avant de "changer de registre" — signal que quelque chose change fondamentalement. Implémentation : `<filter id="desat"><feColorMatrix type="saturate" values={satValue}/></filter>` sur tout le groupe SVG, activé seulement pendant la transition.

**Référence cinématographique :** Pixar "Day and Night" (2010) — 6 minutes, zéro coupe, même espace, cycle jour/nuit. Notre équivalent SVG.

## Split-screen — Règle d'usage (prouvé 2026-06-28)

Le split-screen crée une **rivalité d'attention** quand les deux côtés bougent simultanément. Le cerveau ne sait jamais lequel regarder.

**Usage correct :** Ponctuel, 2-4 secondes maximum, pour une révélation simultanée ("voilà les deux faces"). Puis retour plan unique. Court, chirurgical — l'effet est dévastateur précisément parce qu'il ne dure pas.

**Seule exception viable en continu :** un côté statique (photo fixe, titre) + un côté animé. Dès que les deux bougent = rivalité.

**Diagnostic Gemini sur notre SplitScreen Inga :** Le split Jour/Nuit est un faux paradoxe — l'injustice n'est pas une question d'heure. Le barrage tourne jour ET nuit, le village est privé jour ET nuit. Version upgrade = split CONCEPTUEL (gauche = macro mécanique en encre, droite = humain/bougies) tout en fond sombre `#1a1008`.

## La 3ème voie : Zoom Inversé / Powers of Ten (non encore codé, 2026-06-28)

Proposition Gemini sur les prototypes Inga — technique à coder en session dédiée :

1. Macro sur le rotor de la turbine (or qui pulse, tourne vite)
2. Dé-zoom brutal (easing exponentiel) → carte topographique SVG encre, tout petit
3. Câble d'or se trace à vitesse impériale sur la carte
4. Zoom soudain sur un grain de poussière sur le tracé du câble
5. Révélation : c'est le village. Câble domine en haut du cadre. Bougies en bas.

**Pourquoi supérieur :** montre physiquement l'écrasement technologique — l'infrastructure enjambe les habitants comme des grains de poussière. Exploite la vraie force du SVG vectoriel : zoom infini sans perte de résolution. C'est le seul format qui encode l'ÉCHELLE de l'injustice, pas seulement le contraste.

**Geste manquant des deux protos (Gemini) :** Le câble d'or qui passe au-dessus des maisons doit émettre un halo FROID qui éclaire les toits mais n'entre jamais dans les fenêtres — et les flammes des bougies vacillent au passage ("siphon effect"). L'énergie les frôle, ne les pénètre pas.

---

## ⭐⭐ FORMAT "RÉCIT-RESSOURCE" (référence prouvée 2026-07-20) — squelette prédonné, à AUGMENTER

> ⛔ RIEN DE FIGÉ DANS LE MARBRE : ces protos donnent une BASE, pas un gabarit rigide. L'ordre des registres visuels, le choix scène/carte/chart, tout peut CHANGER à la conception de la vraie vidéo. Rester flexible.

3 protos existants (sources sur disque, reproductibles/corrigeables — les .mp4 uguu partagés étaient temporaires, INUTILE de les garder) qui prouvent le langage visuel « voyage d'une ressource + chaîne de valeur », SANS personnage-acteur :
- **`CargoVoyage16x9_LibreInspire`** (compo `RND-CargoVoyage16x9-LibreInspire`) : cargo qui VOYAGE, décor mer+montagnes qui passe JOUR→NUIT (lune, étoiles). Objet-véhicule qui glisse crédiblement (règle véhicule). ⚠️ signature « GéoAfrique » PÉRIMÉE → Kora et Cartes.
- **`ProtoNarratifPlusData`** (compo `RND-ProtoNarratifPlusData`) : le cargo se FOND (cargoOpacity→0) vers un DONUT premium « QUI CAPTE LA VALEUR DU CACAO ? » (6% planteurs… 51% marques, source Mighty Earth/ICCO). = LE modèle scène-narrative→chart-data.
- **`ProtoDataVizPleinEcran`** (compo `RND-ProtoDataVizPleinEcran`) + variante parallaxe arbres/labels COBALT-CAFÉ-OR-CACAO : chart qui pousse DANS la scène.

**⭐ POINT CLÉ (Aziz) : ces protos datent d'AVANT notre arsenal 2026.** Ils sont le SQUELETTE narratif prédonné (voyage→fondu→chart). Ce qu'on AJOUTE aujourd'hui pour élever la vraie vidéo :
- donut statique → **Sankey** (valeur qui se ramifie, rubans proportionnels)
- fond montagnes générique → **vraie route maritime carte D3/globe à occlusion** (Afrique→Suez→Europe)
- **chartogram** (pays producteur qui se déforme selon sa part misérable) · **cartogramme**
- **inserts SVG premium** (néon marchés, registres Fable 5 max) · **portraits-médaillons** pour les acteurs (jamais perso-acteur)

= la future vidéo = ces protos AUGMENTÉS par tout l'arsenal D3/Sankey/chartogram/inserts construit depuis. Mélange 3 moteurs à majorité SVG. Cf [[SVG-SCENES-GENERATIVES]] § NOTRE VRAIE FORCE.
