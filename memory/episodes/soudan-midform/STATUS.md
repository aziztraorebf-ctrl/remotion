# Soudan Mid-form — STATUS

**Dernière mise à jour :** 2026-07-07 (session 2) — ✅ **HOOK VALIDÉ + SOCLE CARTE SOUDAN CONSTRUIT & VALIDÉ**
(grammaire AES fidèlement reproduite). Prochaine session = **CONSTRUIRE l'Acte 1** (9 beats sur le socle).
**Branche :** `feat/warmap-insert-2factions`. Working tree Short Sahel (non à nous) préservé. NB : `@remotion/motion-blur`
installé (dépendance manquante d'un fichier tiers qui cassait le bundle — OK Aziz, cf [[key-learnings]]).

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
