# Soudan Mid-form — STATUS

**Dernière mise à jour :** 2026-07-07 (session 3) — 🎬 **ACTE 1 v1 CONSTRUIT & RENDU (9 beats, 66.5s) — EN ATTENTE VERDICT AZIZ.**
Socle + hook validés (sessions précédentes). **Branche :** `feat/warmap-insert-2factions`. Working tree Short Sahel préservé.

> ⭐ **PROCHAINE ACTION = retour Aziz sur `acte1_v1.mp4`. Si validé → promouvoir + PILOTE Actes 2-4.**

## 🎬 ACTE 1 v5-FINAL (session 3, 2026-07-07) — CANDIDAT VALIDÉ (sous réserve dernier visionnage Aziz)
- **Render RETENU** : `out/episodes/soudan-midform/wip/acte1_v5-FINAL.mp4` (57.3s) · catbox `https://files.catbox.moe/qc5dgq.mp4`.
  (v5 = v4-FINAL + **vraie forme du Soudan** extraite du geojson dans l'insert 50M, au lieu de la silhouette Afrique
  dessinée à la main. Fact-check article the-conversation : géo VALIDÉE — RSF ouest / SAF est+Khartoum, or→Émirats.)
- **Corrections cumulées (post-reviews Aziz)** : (1) ⛔ **ORTHOGRAPHE « HEMEDTI »** (était « Hemeti » sans D à
  l'écran = faute grave de crédibilité) — vérifié Wikipédia. **RÈGLE GRAVÉE** : tout nom propre affiché à l'écran →
  vérifier orthographe Wikipédia AVANT render (jamais dériver du whisper). Cf [[feedback_nom-propre-ecran-verifier-wikipedia]]
  + key-learnings. (2) **JETONS NETS** : retiré le `breathe` (scale oscillant continu sur image raster = flou/scintillement
  sub-pixel). Spring d'apparition puis scale figé à 1. (3) **INSERT 50M CENTRÉ** sur la carte (était au bord droit) +
  contenu utile : chiffre + silhouette Afrique (Soudan surligné) + « 3e plus grand pays d'Afrique » — plus les pions
  qui ne disaient rien (`AfricaGlyph`).
- **PROCHAINE ACTION** : dernier verdict Aziz sur v4-FINAL. Si validé → promouvoir en FINAL. **ACTE 2 = SESSION DÉDIÉE**
  (décision Aziz : cette session est pleine, l'Acte 2 gagnera à être fait à part).
- Historique v1→v4 + double review Gemini/Kimi : voir sections ci-dessous + `reviews-acte1/`.

### v4 (avant corrections finales) — trace
- Render : `out/episodes/soudan-midform/wip/acte1_v4.mp4` · catbox `https://files.catbox.moe/5ni7xj.mp4`.
- **Double review Gemini(vidéo)+Kimi(frames)** faite sur v3, convergentes → v4. Détail + recette outils fiables :
  `memory/episodes/soudan-midform/reviews-acte1/` (SYNTHESE-ET-RECETTE.md ⭐, gemini-video-v3, kimi-frames-v3).
  Scripts review réutilisables rapatriés : `scripts/tools/gemini-video-review-custom.py` + `kimi-frames-review.py`.
- **Appliqué en v4** (tout convergent) : (1) **caméra SERRÉE** Darfour beats 1-2 (zoom 5.9) → **dézoom** au « 3e
  plus grand pays » → large partition + **drift lent** permanent (jetons taille écran fixe suivent, OK confirmé).
  (2) **50M = INSERT cartouche AES** (`Insert50M` : encadré parchemin, count-up 0→50 + grille de pions qui se
  remplit) — remplace la grille éparpillée ratée. (3) **LIGNE DE FRONT** nord→sud qui se trace au « coupé en deux »
  (`FrontLine`, encre irrégulière ink-bleed `feTurbulence`/`feDisplacementMap`) = partition PHYSIQUE. (4) **physique
  mines** (ombre portée qui se resserre à l'atterrissage). (5) **halo Hemeti PULSE** (pas fade plat) + respiration.
  (6) **vignette chaude** centrale (lampe de bureau). (7) **halos opaques** sous civils = contraste « pris au piège ».
  (8) **ZÉRO drapeau** mines (consensus 2 modèles + arbitrage Aziz ; nuance : « avec la bénédiction du gvt » aurait
  justifié 1 drapeau, mais épure choisie). Dead code CrowdGrid/SudanFlag retiré.
- **Micro-reste v4** (jugement Aziz) : civils un peu groupés au centre (mais lisent « coincés sur la ligne de front »).

## 🎬 ACTE 1 v3 (session 3, 2026-07-07) — REMPLACÉ par v4 (2e passe retours Aziz, trace)
- **Render** : `out/episodes/soudan-midform/wip/acte1_v3.mp4` (57.3s) · catbox `https://files.catbox.moe/git41c.mp4`.
- **Retours Aziz v2 → v3 (tout visuel + séquençage narratif)** : (1) **ZÉRO label sous les objets** (mine/base).
  (2) **Noms généraux TRANSITOIRES** : fade-in au nom prononcé → disparaissent ~2.5s (plus permanents = distrayants).
  (3) **3 MINES d'or** (même sprite `mine-or-td`) réparties dans le Darfour = « il contrôlait plusieurs mines » ;
  s'estompent (~18%) après le beat Hemeti. (4) **Soldats RSF déplacés** de « il gagne » → « à l'ouest, les hommes
  de Hemeti » (F.ouest), dans leur zone. (5) **50M = GRILLE de silhouettes-pions** (`people-icon`, teintes/tailles
  variées = peuple pluriel/nombreux en étau) qui se remplit puis DISPARAÎT — AUCUN texte (diversité se VOIT, jamais
  « ethnie=cause » : Aziz a laissé Claude trancher le point factuel). (6) **Plaque 25M RETIRÉE** (sous-titre de la voix)
  → seulement jetons civils divers. (7) **Début SÉQUENTIEL** : Hemeti pop seul (« cet homme ») PUIS les mines.
- Décision factuelle tranchée (Aziz délègue) : grille 50M = diversité humaine SANS affirmer que l'ethnie cause la guerre.
- **Micro-restes v3** (jugement Aziz) : pions grille un peu carrés/tassés à l'est · civils centre légèrement groupés.

## 🎬 ACTE 1 v2 (session 3, 2026-07-07) — REMPLACÉ par v3 (trace)
- **Render** : `out/episodes/soudan-midform/wip/acte1_v2.mp4` (57.3s — audio recoupé) · catbox `https://files.catbox.moe/gakuva.mp4`.
- **Retours Aziz v1 appliqués** : (1) portraits Hemeti/Burhan **re-générés en trait d'encre net** (réf `portrait-rsf`,
  double-ref style+visage) + jetons **agrandis** D=76 (v1 = aquarelle floue, trop petits). (2) Beat 1 = **objet MINE D'OR**
  (`mine-or-td.png`, mine à ciel ouvert iso) + **drapeau soudanais SVG** planté dedans + SFX **ping** (jeton) + **pop** (mine)
  — remplace les chars qui ne disaient rien. (3) **Hemeti FIXE** tout le long (v1 le déplaçait = incompris). (4) **ZÉRO chars**
  → **jetons-soldats** visages (`portrait-rsf`/`portrait-saf`, D=44) autour des généraux. (5) al-Burhan = **NOUVELLE base
  soudanaise** dédiée (`base-saf-td.png` régénérée : murs HESCO+tour+pickup+drapeau, plus le recyclage MINUSMA). (6) **25M
  = plaque SUR la carte** + civils **DIVERS** (`refugie-famille/femme1/femme2/homme/enfant`+`portrait-civil`) progressifs LENTS
  (0.66s) — plus de plein écran. (7) **Fin coupée** : audio `acte1-factcheck-v2.mp3` (57.3s, whisper `whisper-words-acte1-v2.ts`)
  s'arrête à « pire crise humanitaire » — le « suivre l'or » doublonnait la dernière phrase du HOOK. (8) 50M = nuée habitants Nil
  (angle « population plurielle en étau », PAS « diversité=cause » : factuellement risqué, écarté avec Aziz).
- **Assets régénérés** (Gemini `gemini-3.1-flash-image-preview`, depuis vraies photos Wikimedia + réf style AES ; damier gris
  Gemini détouré par flood-fill) : `portrait-hemeti/burhan.png` (v2 nets), `mine-or-td.png`, `base-saf-td.png` (neuve).
- **Micro-défauts restants v2** (jugement Aziz) : civils un peu serrés au centre · label « Armée régulière » tronqué à droite.
- Décisions tranchées avec Aziz : couper fin (doublon) · angle 50M population plurielle (pas ethnie=cause).

## 🎬 ACTE 1 v1 (session 3, 2026-07-07) — REMPLACÉ par v2 ci-dessus (archivé pour trace)
- **Fichiers** : `src/projects/warmap/soudan-acte1/SoudanActe1.tsx` (compo `SoudanActe1`, 1995f@30) +
  `whisper-words-acte1.ts` (audio aligné 190 mots). Compo Root enregistrée. Self-review scriptée 0 erreur.
- **Render** : `out/episodes/soudan-midform/wip/acte1_v1.mp4` (66.56s, 1920x1080 H264+AAC, scale=1 plein format).
  Catbox : `https://files.catbox.moe/s1gq11.mp4`.
- **9 beats câblés sur l'audio réel `acte1-factcheck.mp3`** (66.5s, ≠ storyboard : fact-check final = source de vérité) :
  Darfour s'allume → jeton **Hemeti** (VRAI visage) → technicals RSF + halo rouge → nuée dorée "50M" le long du Nil
  (GF1 : PAS de civils) → partition → **al-Burhan MIROIR** (vrai visage, uniforme galonné + base SAF drapeau
  soudanais + tanks bleus, halo bleu) → **civils séquentiels** piégés (GF2 : militaires → 40% Fade to Background)
  → **plein écran SOLIDE 25M** (count-up) → "Suivez l'or" + dézoom amorcé (pont Acte 3).
- **VRAIS VISAGES faits** : `portrait-hemeti.png` (tenue désert/chèche RSF) + `portrait-burhan.png` (uniforme
  galonné SAF) générés Gemini `gemini-3.1-flash-image-preview` depuis vraies photos Wikimedia (Special:FilePath),
  stylisés parchemin (cohérents `portrait-rsf` AES). Base : `base-saf-td.png` (base-fr-td retouchée drapeau
  soudanais + détourée fond blanc). Tous dans `public/_shared/sprites/warmap/`.
- **Review** : Gemini 6.5/NEEDS_WORK ÉCARTÉ (faux positif : réclamait charte Souverain navy/gold au lieu du
  parchemin AES validé = référence-or). Override APPROVE 8.5 documenté dans `acte1_v1.review.json`. Vérifié
  frame par frame (9 frames + 3 corrections : dots Nil renforcés, civils distincts/plus petits, "Suivez l'or" lisible).
- ⚠️ **Limites connues v1 (à traiter selon retour Aziz)** : "Suivez l'or" chevauche légèrement le bas du Soudan ;
  jeton au tout début d'apparition (spring) petit ~1 frame ; sillage Hemeti bref (mouvement resserré).

## ✅✅ SOCLE CARTE SOUDAN — `SoudanWarMapEngine.tsx` (2026-07-07 s2, validé pièce par pièce)
> On a REJETÉ le mini-render de juin (jetons trop gros) ET l'adaptation directe du moteur Sahel (3689 l couplé).
> À la place : NOUVEAU moteur propre `engine/SoudanWarMapEngine.tsx` qui reprend le SOCLE générique AES.
> Référence-or = `out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`. Grammaire gravée : [[WARMAP-GRAMMAIRE]] (2 ⭐⭐ en tête).
- **Fichiers** : `engine/SoudanWarMapEngine.tsx` (moteur, 1 Map continue frame-driven) + `engine/soudanActors.tsx`
  (SoudanToken jeton D=58px, SoudanTrail sillage, SoudanBase objet iso) + tests `SoudanSocleTest`/`SoudanHighlightTest`/
  `SoudanMouvementTest`/`SoudanTestFinal` (compos Root). Données : `sudanControlData.ts` (déjà là).
- **API moteur** : `camKeys` (caméra), `zones` (halos locaux qui rayonnent), `highlights` (états qui se tracent),
  `stateLineOpacity`, `showNationalBorder`, `children(proj)` (poser acteurs).
- **VALIDÉ Aziz, pièce par pièce** :
  1. Voile KHAKI troué à la forme du Soudan (voisins sombres, Soudan crème) — reprojeté par frame. Pas "tout crème".
  2. CONTOUR national permanent + INTÉRIEUR VIDE (routes Mapbox masquées, Nil discret, états invisibles au repos).
  3. ⛔ JAMAIS d'aplat de faction plein (testé+rejeté) → la couleur RAYONNE en HALO local, OU trace un CONTOUR d'état.
  4. ⭐ "ON NOMME → ÇA SE TRACE" (option C, la meilleure) : au mot, le contour de l'état se DESSINE (draw-in) dans
     la couleur de la faction (rouge RSF/bleu SAF), et RESTE allumé (persistant, cumul de régions de couleurs ≠).
  5. JETONS AES (portrait-rsf/saf/civil, D=58px fixe) qui se DÉPLACENT + SILLAGE cinétique derrière (traînée qui
     s'estompe ; ⚠️ mouvement doit être RESSERRÉ/rapide sinon sillage invisible : ~2px/frame mini).
  6. ZOOM serré (zoom ~5.5) reste lisible · retour à l'état VIDE en fin d'action OK.
  7. OBJET ISO 3D sur la carte : sprite `base-fr-td.png` = le VRAI fort iso (sacs de sable+tente+drapeau) — ⚠️
     `base-france.png` = une boussole, PAS un bâtiment. Drapeau FR à régénérer neutre/soudanais pour la prod.
- **Renders de validation** (catbox) : socle `w0ydbm` · variantes bloc-vide/états `37cfhc`/`etc2n0` · highlight `42v149`
  · mouvement+sillage `485wub` · **TEST FINAL `i12jyw`** (⭐ LA RÉFÉRENCE — réunit TOUT, point de départ Acte 1).
- ⭐ **`SoudanTestFinal.tsx` = LE CODE DE RÉFÉRENCE** pour bâtir l'Acte 1 (validé Aziz). S'y fier pour : où placer un
  jeton, la plaque-nom (design+position), les halos, le highlight, le sillage, la base iso, le zoom. **Zoom serré ~5.5
  = le zoom de BASE** (validé "parfait, permet de voir l'action"). Tous les socles réutilisables tels quels.
- ⛔ **PROD ACTE 1 — VRAIS VISAGES des généraux (consigne Aziz)** : Hemeti + al-Burhan = personnes RÉELLES → créer
  les jetons à partir de VRAIES PHOTOS (comme les généraux AES), PAS de portrait générique. Les SOLDATS peuvent rester
  génériques (`portrait-rsf/saf`). Recette jeton = cercle parchemin + bordure faction + photo clippée (cf SoudanToken).
  → générer les 2 portraits (Gemini/vraie photo) au début de l'Acte 1. Base iso : régénérer avec drapeau neutre/soudanais
  (le `base-fr-td.png` a un drapeau FR).

Décision structurante antérieure : carte = moteur AES adapté (mini-render juin REJETÉ). Cartographie moteur AES faite.

## ✅ HOOK "L'OR DU DARFOUR" — VALIDÉ (2026-07-07 session 2)
- **Validé Aziz** comme hook d'introduction ("si on doit le changer, plus tard"). Livrable permanent :
  `out/PRET-PUBLICATION/soudan-midform/hook-or-darfour-VALIDE.mp4` · catbox `inys9z`. 23s, plein format.
- Contenu final : VO GéoAfrique V3 (accroche reformulée, `public/_shared/audio/soudan/hook-or-darfour.mp3`) +
  colorisation synchro voix (whisper-align) : lingot or d'entrée → **pelle qui tombe NOIRE puis se peint**
  (3 bandes drapeau en fondu + manche VERT en dernier, ~f150-360) au mot "Darfour" → fumée+sang à "guerre"
  → traînée d'or à "Suivez L'OR" → cartouche "Où va cet or ?". Micro-anims : halo soleil pulse, scintillement
  or, braises. Drone banni retiré. Code : `soudan-hook/OrDarfourHook.tsx` + `orDarfourGroups.ts` (`hookPelle()`).

## 🎯 PROCHAINE ÉTAPE — CARTE SOUDAN via moteur AES adapté
1. **Décision carte = adapter `SahelWarMapEngine`** (référence = `out/PRET-PUBLICATION/warmap-sahel-aes-FINAL.mp4`).
   Principe visuel central gravé : [[WARMAP-GRAMMAIRE]] § sommaire "CONTOUR PERMANENT + INTÉRIEUR VIDE" ⭐⭐.
2. Audio Acte 2 à régénérer (périmé). Actes 3-4 non écrits.

## 🗺️ RÉUTILISATION MOTEUR AES → SOUDAN (cartographie code faite 2026-07-07 s2)
**Réutilisable TEL QUEL (générique)** : `reskinMap()` (Mapbox reskin parchemin), projection `map.project`+jumpTo
frame-driven (1 Map continue), couche `sahel-fill`+`controlAt` (DATA-DRIVEN, pointe déjà sur `sudan.warmap.json`
via `sudanControlData.ts`), composant jeton (div rond+sprite, taille px FIXE 58px ≠ ancrée degrés → NE GROSSIT PAS),
`SahelAttackArrow`/`TerritorialExpansion`/`RefugeeFlow`/`WarMapBanner`/`WarMapDimmedOverlay`/`WarMapSplitScreen`,
schema/adapter données. **À ADAPTER (hardcodé Sahel)** : couleurs (`SAHEL_COLORS`/`SAHEL_COUNTRY_COLORS`), chemins
geojson en dur (`:477` sahel-admin1, `:560` sahel-countries), TOUS les camKeys (`SahelCameras.ts`), acteurs/waypoints
(`SahelActors.ts`), triggers frames (`SahelTimings.ts`), narration+SFX, les `<PartieX>`. **BLOCAGES** : (a)
`sudan-states.geojson` n'a que `name` (pas `country`) → sous-système multi-pays (fusion byCountry, contours nationaux
par pays) à NEUTRALISER (Soudan = 1 pays) ; (b) pas de `sudan-countries.geojson` ; (c) toute la choré narrative est
en frames LITTÉRALES forced-aligned (pas dans le dataset) → réécriture sur le script Soudan. Pas de couplage ACLED runtime.
- Jetons : **portraits-visage petits** (Hemeti/Burhan/civils, `portrait-{rsf,saf,civil}.png` déjà là). Règle densité [[WARMAP-INSERT-SVG-ETATMAJOR]].

---

## ✅ FAIT (validé Aziz)

- **Prototype insert `KhartoumEtatMajorSVG`** entièrement validé (registre médaillon d'état-major SVG
  pur, PAS Mapbox). Render : `out/_rnd/khartoum-etatmajor-svg/versions/khartoum-etatmajor-PROTOTYPE-VALIDE.mp4`
  · catbox `https://files.catbox.moe/t96in1.mp4`.
- Contenu final : fond recomposé (terrain+Nil+3 bâtiments topdown) · formation de 4 portraits RSF qui
  avancent (mouvement organique + poussière) · impacts onde de choc · fumée post-impact · statut
  capturée (bâtiment semi-transparent + sceau R) · 4 phases + sous-titres.
- **Doctrine + workflow réutilisable écrits** : `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md` ⭐.
  C'est notre manière de faire les inserts « carte de guerre / prise de territoire » en SVG.
- Assets R&D consolidés dans `out/_rnd/khartoum-etatmajor-svg/` (SVG sources + DECODE-NOTES + fx-demo).

## ✅ FAIT (2026-07-06, suite) — MOTEUR D'AFFRONTEMENT 2 FACTIONS + 2 variantes (validé Aziz)

> ⚠️ Correction d'un malentendu : le prototype Khartoum n'a JAMAIS eu de place dans le storyboard
> (pas de beat #5 « attaque Khartoum » écrit, pas de voix off) — c'était un proto de R&D, normal
> qu'il ne « s'assemble » nulle part. On est en **mode croissance du moteur d'insert**, pas en montage.

- **Moteur réutilisable** : `src/projects/warmap/_shared/warmapChoc.tsx` — système `Faction` paramétré
  (RSF/SAF = 2 instances, jamais de « R »/« S » en dur), formations qui avancent/tiennent/reculent,
  `ClashSparks` (le choc), `FrontArc` (front qui recule), `SweepZone` (zone qui se remplit), sceaux
  capture/défaite, effets recolorables. Frame-driven pur. C'est la base du futur `WarMapInsert` paramétré.
- **Variante A `KhartoumChocSVG`** (compo Root) : RSF assaut, SAF défend le palais, choc au front,
  bascule accentuée (SAF submergée, RSF recouvre physiquement le palais). Render : `out/_rnd/warmap-choc/
  khartoum-choc-v3.mp4` · catbox `https://files.catbox.moe/2psuqm.mp4`.
- **Variante B `FrontOuvertSVG`** (compo Root) : 2 zones teintées, ligne de front sinueuse qui tient
  (impasse) puis cède par un point de rupture. **Brique directe pour l'Acte 2 Soudan** (impasse
  militaire). Render : `out/_rnd/warmap-choc/front-ouvert-v2.mp4` · catbox `https://files.catbox.moe/hihedl.mp4`.
- Commit `351514e` sur branche `feat/warmap-insert-2factions`.
- Bug trouvé+corrigé en self-review : v1 de A avait une « téléportation » (colonne n'atteignait jamais
  la cible, capture sur compteur) → corrigé (la colonne arrive vraiment au contact).
- Doctrine amendée : portrait rond OK en insert zoomé (`WARMAP-INSERT-SVG-ETATMAJOR.md` § RÈGLE ENRICHIE).

## 🎬 NEXT (prochaine session Soudan)

- **Variante B → ré-habiller quand on écrira l'Acte 2** (impasse militaire) — INTENTION d'abord, pas
  toucher au moteur avant d'avoir le script. Elle est prête comme brique prouvée.
- **Pistes d'extension du moteur en backlog** (à faire sur un vrai beat, PAS en anticipation) :
  flèches de manœuvre (`fleche_manoeuvre` en stock doctrine, pas encore codée), zones qui se remplissent
  plus poussées, généraliser en composant paramétré `WarMapInsert {fond, cibles, faction, séquence}`,
  puis `/beat`-like insert SVG. ⛔ Ne PAS généraliser en `WarMapInsert` avant d'avoir 2-3 vrais cas
  (sinon on fige l'API sur un seul usage).
- Reste aussi les jetons/effets en stock non tous exploités (cf `svg-library/elements/militaire/`).

## ⚠️ Points d'attention

- Le fichier `khartoum-impact-batiment-glm-A-CORRIGER.json` a un bug de halo connu (non utilisé dans le
  proto final — le proto utilise ses propres effets). Ne pas le reprendre sans corriger.
- Ne PAS repartir sur Mapbox pour cet insert (piste écartée, cf DECODE-NOTES.md).

## 📁 Où retrouver

- Code : `src/projects/warmap/KhartoumEtatMajorSVG.tsx` (compo Remotion `KhartoumEtatMajorSVG`).
- Effets R&D : `src/projects/warmap/_rnd/KhartoumFxDemo.tsx` (compo `KhartoumFxDemo`).
- Doctrine/workflow : `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md`.
- Décodage/méthode : `out/_rnd/khartoum-etatmajor-svg/DECODE-NOTES.md`.
