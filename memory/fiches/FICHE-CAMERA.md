# CAMÉRA — fiche de déclenchement (lire AVANT de coder un mouvement)
> Pain point n°1 mesuré du projet : 3 des 5 boucles les plus chères sont des boucles caméra (4 + 3 + 3 itérations complètes).
> **Aucune n'était un problème de dosage.** Toutes ont été résolues par une MESURE, jamais par une retouche de valeur.
> ⚠️ Si ce que tu lis ici ne correspond PAS au code que tu as sous les yeux : **c'est la fiche qui a tort**. Corrige-la immédiatement.
> Dernière vérification contre le code : 2026-08-17.

## PATTERNS VALIDÉS — réutiliser, ne pas réinventer

**Globe D3 (rotation+zoom continu)** — `src/projects/_rnd/d3-16x9/globeCamera.ts`
Keyframes `CamKey{frame,lon,lat,scaleMul}` + `camAt()`. UNE projection ortho reconstruite chaque frame :
`globeR = GLOBE_R * cam.scaleMul` ; `orthoAt(-lon,-lat).scale(globeR)`.
Amplitudes RÉELLES validées (`buildInsertCam`/`buildActe5Cam`/`buildActe6Cam`, Soudan A3→A6) :
scaleMul **1.22 → 4.4** ; 4.4 = pays plein cadre/courbure plate (raccord vers carte 2D) · 2.0-2.4 = carrefour
2 régions · 1.5 = dézoom « tout le système ». Deltas lon/lat par segment : 4-12°.
⭐ Le zoom max DÉBORDE du cadre (Soudan A6 : 1792px sur 1920). **Un globe qui garde des marges constantes = signal visuel du bug §2.**
⛔⛔ `camAt()` applique un easeInOut PAR SEGMENT → **arrêt complet à chaque keypoint** (piège n°1). Pour tout NOUVEAU
mouvement, utiliser `camAtContinu()` du même fichier. `camAt()` est conservée telle quelle car 12 fichiers en dépendent
(Soudan A3-A6 publiés, Gazoduc Acte 1, protos) — ne PAS la corriger en place sans re-render de ces 12.
**Ne pas réécrire une variante maison** : importer `BorderPulse`, `GlowBorder`, `THEMES.*` depuis
`SoudanActe3GlobeProto16x9.tsx` / `SoudanActe3GlobeInsert.tsx`.

**Caméra continue D3/SVG multi-segments (CORRIGÉE)** — `GazoducActe4Objectifs.tsx:290-303` (lerp pur)
et `GazoducActe4RessourceUnique.tsx:181-195` (smoothstep atténué : `t = raw + 0.25*(raw²(3-2raw) - raw)`).
Cam = `{scale, tx, ty}` via `camFor(center, scale)` ; `lerpCam(a,b,t)` ; rendu `<g transform="translate(tx ty) scale(k)">`.
Ce sont les 2 implémentations à copier — elles portent le fix payé 3 itérations.

**Cadrage** : dériver de la **bbox projetée** des éléments qui DOIVENT être visibles, jamais à l'œil.
Ex vérifié (A4 RessourceUnique) : `FRAME_CENTER=[821.3, 237.7]`, `FRAME_SCALE=1.98`.

**Mapbox 1 seule Map continue** — `src/projects/souverain/senegal-petrole-gaz/SenegalActe2Continu.tsx`
1 `<div>`, 1 `new mapboxgl.Map`, phases dans un seul `useEffect`, `map.jumpTo({center,zoom,bearing,pitch})` (l.286),
projection des dots APRÈS le jumpTo. Valeurs validées : zoom 7.2→7.8 (dolly in) · Pull Back 7.8→3.6 ·
pitch 0→45 (crane down) · bearing 0→-18 (orbit lent). Durées doctrine : Pull Back Reveal et Whip Pan = **60f actives** ;
orbit 200-600f ; tilt 100-300f ; blur CSS pic **12-16px à mi-course**.
⚠️ Blur/60f viennent de la doctrine, non vérifiés dans un composant appliqué.

**Pan/travelling SVG** — transformer le CONTENU dans un `viewBox` **FIXE** (`<g transform>`).
⛔ ne JAMAIS animer `viewBox`. Construire la scène plus large que le cadre. Zoom validé : 3.1x.

**Tracés progressifs + suivi de tracé** — `GazoducActe2AAGP.tsx:230-280` : caméra qui suit une fenêtre
glissante du tracé (`windowBBox`, back 45% / ahead 10%, `scaleFit` borné 1.3-2.0), puis ralentit et HOLD au climax.
⛔ `getPointAtLength`/heuristique de longueur de path : jamais fiable, échantillonner.

## MÉCANISMES — les 3 pièges structurels

1. **easeInOut PAR SEGMENT = vitesse 0 à chaque keypoint.** Dérivée nulle aux 2 extrémités → « elle approche,
   stop, elle approche, stop ». Position continue, aucun gel détectable au hash. Mesuré : v=0.00 px/f aux 7 keypoints
   (Acte 3 B1, 3 itérations perdues). Fix : lerp pur, smoothstep atténué, OU un seul easing global sur toute la plage.
   Corollaire : `Math.round` sur un index de samples → avance par paliers (pic mesuré 765 px/f).
2. **Toute valeur dérivée du zoom doit VRAIMENT suivre le zoom.** Une seule occurrence de la constante brute
   (`GLOBE_R` au lieu de `globeR`) dans un clipPath / cercle atmosphère / océan / liseré / terminateur → silhouette clouée
   pendant que l'intérieur bouge. Mesuré : diamètre 868px ±1px sur 85s alors que scaleMul allait de 1.2 à 4.0 (4 itérations).
   **Grep obligatoire** : après avoir calculé `globeR`, aucun `GLOBE_R` ne doit rester hors import+calcul.
   Symétrique : tout élément DANS le `<g>` zoomé dont l'épaisseur écran doit rester constante se contre-échelonne `/ cam.scale`.
3. **Mapbox frame-driven obligatoire** : `useCurrentFrame` + `interpolate` + `map.jumpTo()`. ⛔ `flyTo`/`easeTo`
   (incompatibles headless). Render : `scripts/render-mapbox.sh` (pas Vercel).
   Un `interpolate` qui sature (`Math.min(1,p)` convergé en 2-3s sur un beat de 15s) laisse la caméra strictement immobile.

## MESURER AVANT DE RETOUCHER
⭐ **Outil dédié : `python3 scripts/tools/measure-camera.py --help`** (créé 2026-08-17, couvre les 3 mesures).
- **Vitesse frame-à-frame, HORS render** (le moins cher, à faire en premier) — `measure-camera.py speed` :
  rejoue la fonction caméra sur toutes les frames, imprime Δposition/Δscale. v=0.000 quelque part → piège 1. Pic énorme → index arrondi.
- **Diamètre/échelle réels sur N frames** — `measure-camera.py scale` : détecte les pixels non-fond sur la ligne médiane.
  Amplitude <5% alors que scaleMul varie fort → piège 2.
- **Immobilité réelle (≠ gel)** — `measure-camera.py motion` : rapporte min/médiane/max ET la plus longue série sous 0,5 %.
  Sain : min >1 %, médiane ~5 %, série=0s.
  ⚠️ Mesurer à **640px minimum**. Un détecteur en vignettes 320px est AVEUGLE aux mouvements lents/localisés
  (2 faux positifs « 10s figées »/« 9s figées » démentis par une mesure fine). Avant d'itérer sur un verdict : re-mesurer + REGARDER un crop.
- **Autres scripts** : `verify-trajectory.py` = élément mobile vs trajectoire (ne mesure PAS la caméra).
  `measure-insert-clip.py` = clips d'insert (ne mesure PAS la caméra).
- Juger la netteté uniquement sur `scale=1`. Frames isolées ne prouvent rien sur le mouvement.

## SI ÇA RATE 2×
Au **2e rejet du même symptôme de mouvement** : STOP. Ne pas retoucher une 3e valeur — aucune des 3 boucles caméra
du projet n'était un problème de dosage. Mesurer (ci-dessus), puis déléguer à un agent dédié frais
(Opus, `run_in_background`, reverse-engineering du repo D'ABORD puis `systematic-debugging`). L'agent RAPPORTE, n'applique pas.
Coût documenté de ne pas l'avoir fait : 4 + 3 + 3 itérations complètes (code + render + review).
