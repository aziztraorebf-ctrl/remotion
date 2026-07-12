# Parallaxe camAt + horizon paramétrique + palette double-état

> Code : `svg-library/motion.ts` (`camAt`, `lerpHex`, `buildHorizonPath`, `sequenceExclusive`, `objectVisualBottom`).
> Source : extrait de `_rnd/svg-scenes/CargoVoyage16x9_LibreInspire.tsx` (2026-07-03, showcase 16:9 validé Aziz).

## Quand l'utiliser
Scène narrative 16:9 « voyage/transformation » avec plusieurs calques de profondeur (ciel/horizon lointain,
sujet médian, premier plan qui défile) et une transition d'état globale (géographie, jour→nuit, chaud→froid).

## Les 5 briques

1. **`camAt(frame, p, speed)`** — moteur de parallaxe 3 calques. Un seul calcul par calque, `speed` différencie
   la vitesse de défilement : fond quasi fixe (0.05-0.15), sujet médian fixe ou presque, 1er plan rapide
   (0.9-1.3). L'écart de vitesse ACCENTUÉ (pas juste "un peu plus vite") est ce qui vend la profondeur.

2. **Horizon paramétrique (`buildHorizonPath`)** — 2 silhouettes (tableaux Y) partagent les MÊMES points de
   contrôle X fixes ; on interpole Y entre A et B selon `t` (0..1, ex. progression du voyage). Permet une
   transition géographique fluide (dunes/cacaoyers → pics enneigés) sans redessiner de path à chaque frame.
   ⛔ **Bug corrigé** : le polygone doit DÉBORDER du cadre visible (`overflow`, défaut 300px chaque côté) —
   sans marge, le bord du polygone se découvre pendant le drift de la caméra parallaxe et dessine une ligne
   verticale/triangle parasite au bord de l'écran.

3. **`lerpHex(a, b, t)`** — interpolation linéaire RGB entre 2 couleurs hex. Base de toute palette double-état
   (chaud→froid, jour→nuit). Appliquer à CHAQUE couleur de la scène qui doit suivre la même progression `t`
   (ciel, soleil, océan, océan profond...) pour une cohérence chromatique globale.

4. **`sequenceExclusive(transitionProgress, outThreshold)`** — séquençage STRICT de 2 éléments mutuellement
   exclusifs (soleil/lune, jour/nuit). ⛔ **Bug corrigé** : ne jamais calculer `opacityB = progress` et
   `opacityA = 1 - progress` en parallèle — les deux restent visibles simultanément pendant toute la
   transition (lu comme "deux lunes/soleils empilés"). A doit être COMPLÈTEMENT invisible avant que B
   commence seulement à apparaître (défaut : A finit à `outThreshold`=0.85, B apparaît entre 0.85 et 1).

5. **`objectVisualBottom(objectRefY, hullOffset)`** — cale le split fond/1er-plan d'un décor qui défile (vagues,
   poussière) sur le VRAI bas visuel d'un objet posé, pas sa position de référence dans le code. ⛔ **Bug
   corrigé** : comparer au point de référence seul (ex. `cargoY`) faisait dessiner une portion du décor
   "1er plan" par-dessus une zone qui tombe visuellement DANS l'objet (effet "vagues qui traversent le
   bateau"). Mesurer une fois l'offset réel (`hullOffset`) sur le composant SVG de l'objet.

## Pattern d'assemblage (3 calques, ordre de rendu)

```
<g transform={camAt(frame, 1, 0.05)}>   {/* FOND : ciel, horizon, soleil/lune, silhouettes lointaines */}
<g transform={camAt(frame, 1, 1.3)}>    {/* OCÉAN fond : sous le sujet, ancre la ligne d'eau */}
<g>                                      {/* SUJET médian : pas de parallaxe (ou quasi fixe) */}
<g transform={camAt(frame, 1, 1.3)}>    {/* OCÉAN 1er plan : au-dessus du bas du sujet (objectVisualBottom) */}
```

## Non-buts
Ces briques sont pour la MÉCANIQUE (calcul), pas la palette de couleurs elle-même (`palette.ts` reste la
source de vérité des valeurs hex par registre) ni les éléments dessinés (arbres, cargo — restent des
composants séparés, ex. `CacaoTree`, `CargoShipUnified`).
