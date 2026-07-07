# Soudan Mid-form — STATUS

**Dernière mise à jour :** 2026-07-07 — ✅ **Moteur affrontement 2 factions (+flèches/zones/encerclement)
+ HOOK d'ouverture "l'or du Darfour" + storyboard Actes 1&2 relu.** Prochaine session = **PILOTE Actes 1-2**.
**Branche :** `feat/warmap-insert-2factions` (commits `351514e` moteur · `3974235` flèches/zones ·
`9920643` hook or). Working tree Short Sahel (non à nous) préservé tout du long.

## 🎯 PROCHAINE SESSION — pilote Actes 1-2 (décision Aziz 2026-07-07)
1. **Finir le hook** (RAPIDE, quasi fini) : reformuler accroche + pelle-drapeau soudanais + colorisation
   séquencée synchro voix. Détail : [[soudan-midform-STORYBOARD-ACTE1]] § HOOK.
2. **Produire Actes 1 & 2 en pilote.** Storyboard relu + support par beat = artifact catbox `pqenlu` /
   analyse hook `rhq0n8`. Insert état-major = beat 5 A2 (`KhartoumChocSVG`, quasi fini) + beat 8 candidat
   (`FrontOuvertSVG`). Reste : carte Mapbox à adapter au Soudan (data+géo déjà sur disque, cf §RÉUTILISATION).
3. **Avant prod complète** : régénérer audio Acte 2 (périmé) ; Actes 3-4 non écrits.

## 🗺️ RÉUTILISATION AES pour Soudan (analyse faits 2026-07-07)
- Carte Mapbox AES réutilisable ~80% — **déjà amorcé** : `sudanControlData.ts` + `sudan-outline/states.geojson`
  + mini-render Acte 1 validé (16 juin). Moteur `SahelWarMapEngine` (3689 l, couplé Sahel) = à ADAPTER.
- Jetons : **portraits-visage** (peu de jetons = incarné, cf AES) pour figures Soudan (Hemeti/Burhan/civils,
  sprites `portrait-{rsf,saf,civil}.png` déjà là). **Blocs abstraits** (beaucoup de jetons) = insert état-major.
  → règle densité gravée dans [[WARMAP-INSERT-SVG-ETATMAJOR]].

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
