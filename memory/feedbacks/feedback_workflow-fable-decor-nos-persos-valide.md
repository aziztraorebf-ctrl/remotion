# ✅ WORKFLOW VALIDÉ — Fable compose le DÉCOR, nos briques prennent les PERSONNAGES

> Prouvé le 2026-08-18 (session registres). **Premier cas où un modèle externe compose une scène
> AVEC nos personnages sans les redessiner.** Validé par Aziz sur rendu : « ça donne un petit charme,
> quelque chose d'assez bon, on dirait quelque chose qui attire l'attention. »

## LE WORKFLOW (4 étapes, reproductible)

1. **Rendre nos personnages** (planche `Stick-IdentiteV2`) + **un décor existant** → 2 frames PNG.
2. **Agent Fable 5** (effort élevé, ZÉRO API) : lui donner les 2 frames en référence + lui faire LIRE
   `StickFigure.tsx` et `Roles.tsx`, avec l'interdit explicite « réutilise NOS personnages, n'en dessine
   pas de nouveaux ». Il rend un SVG statique en `<g id>` nommés (fond / plan-moyen / avant-plan / perso-N).
3. **Nous animons en Remotion** : rebrancher les personnages sur le vrai `<Figure>` importé (⛔ ne JAMAIS
   recopier les constantes du socle — bug `IdentiteEtVues16x9`), tenues Fable en overlays via `bodyPoints()`.
4. **Mesurer, puis regarder** — diff par zone + frames consécutives.

## POURQUOI ÇA MARCHE
Fable n'a pas approximé nos figures : il a **porté les formules du socle** (L=34, torse 32, tête r=9,
capsules 4.5, membre arrière opacity 0.75, `NECK_EXTEND`, `PAGNE_SUIVI_LEAN`). Le personnage reste NÔTRE,
donc riggable, donc animable — c'est toute la différence avec un personnage de storyboard génératif
(bloc organique non décomposable, cf. § LIMITE ci-dessous).

## ⛔ LES 3 DÉFAUTS RENCONTRÉS (et comment ils ont été trouvés)

1. **Le costume statique qui tue la marche** → [[FICHE-SVG-DESSINE]] § RÉFLEXES.
   Pagne à hanche+17 = 65 % de jambe masquée = « colonne qui glisse ». Trouvé EN ANIMANT, jamais sur la planche.
2. **`<Figure>` n'a pas de cou** → tête détachée dès que le buste s'incline à 32°. Comblé à la main.
   ⭐ Candidat à remonter dans le socle : se reproduira sur tout personnage habillé qui se penche.
3. ⛔⛔ **`scale(r2(zoom))` = 7,53 px de saut EN UNE FRAME** → [[FICHE-CAMERA]] § piège 3.
   **Le symptôme trompait** : Aziz voyait « l'image saute quand le personnage se penche » ; le coupable
   était une pirogue IMMOBILE d'avant-plan. **2 fixes plausibles appliqués avant de mesurer n'ont rien
   changé** (pic identique : 5,6× → 5,7×). Seul le diff PAR ZONE a désigné le vrai coupable.
   → **Localiser le saut dans l'IMAGE avant de corriger l'animation qu'on soupçonne.**
   Après fix : pic 5,6× → **1,7×** ; zone pirogue 391 pixels sautants → **0**.

## ⚠️ LA LIMITE DU REGISTRE (mesurée, à ne pas oublier)
- **Marche lente obligatoire** : le socle à jambes rigides glisse (~5 px/f à scale 3). La cadence est
  bornée par la référence validée du socle — **accélérer aggrave le patinage**. C'est une limite du
  registre, pas un réglage. Si le script exige une marche vive → autre moteur.
- **Manipulation fine d'objet** (saisir en vol) : impossible ici ET chez MiniMax H3. L'objet est déjà en
  main ou déjà posé ; la main RECOUVRE l'objet. Contournement Fable élégant : intention « regarder au
  loin » → main au front impossible → **bâton tenu**.
- **Profil uniquement** (décision Aziz 2026-07-26, gravée L117 `StickFigure.tsx`). Un rig segmenté ne
  tourne pas. Un personnage qui recule / se retourne / vient vers la caméra = hors registre → H3.

## LIVRABLES DE RÉFÉRENCE
- Rendu validé : `out/_r-and-d/fable-scene/WORKFLOW-VALIDE-fable-decor-nos-persos.mp4`
  (https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/test-registres/plage-v6-fWjc6j81M6Y50FVNYVmJgKQ404r3d7.mp4)
- SVG source (modifiable) : `public/_rnd/fable-svg/plage-peche-crepuscule.svg`
- Code d'animation : `src/projects/_rnd/fable-scene-animee/PlageFableAnimee16x9.tsx` (compo `RND-Fable-Plage`)
