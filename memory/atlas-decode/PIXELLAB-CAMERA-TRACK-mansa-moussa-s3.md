# PixelLab camera-track sur carte SVG — technique validée 2026-05-01 (Atlas Mansa Moussa S3)

> Migré depuis auto-memory 2026-08-31.

## Technique validée : camera tracking sprite sur carte SVG

### Principe
La caméra (translate/scale SVG) suit dynamiquement la position du sprite en temps réel.
Le `translate(${-activeCamX} ${-activeCamY})` pointe vers les coordonnées actuelles du personnage.

### Code pattern (copier-coller)

```tsx
// 1. Position sprite sur waypoints
const getWaypointPos = (t: number): [number, number] => {
  const clampedT = Math.max(0, Math.min(1, t));
  const segmentT = clampedT * (waypoints.length - 1);
  const segIdx = Math.min(Math.floor(segmentT), waypoints.length - 2);
  const localT = segmentT - segIdx;
  const p1 = waypoints[segIdx];
  const p2 = waypoints[segIdx + 1];
  return [p1[0] + (p2[0] - p1[0]) * localT, p1[1] + (p2[1] - p1[1]) * localT];
};

const progressT = interpolate(frame, [walkStart, walkEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const [charX, charY] = getWaypointPos(progressT);
// Deuxieme perso avec retard sur le path :
const [char2X, char2Y] = getWaypointPos(progressT - 0.06);

// 2. Zoom in progressif puis pull-back
const zoomInEnd = walkStart + Math.round(fps * 3); // 3s pour atteindre zoom max
const camZoom = interpolate(
  frame,
  [walkStart, zoomInEnd, walkEnd, poseEnd],
  [1.0,       2.0,       2.0,    1.0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

// 3. Tilt s'annule au zoom (sprites lisibles en gros plan)
const effectiveTilt = interpolate(
  frame,
  [walkStart, zoomInEnd],
  [tiltPeak, 8],   // de 28deg -> 8deg
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
const skewX = effectiveTilt * 0.15;
const scaleY = 1 - effectiveTilt * 0.008;

// 4. Camera focus suit le perso en temps reel
const activeCamX = atDestination
  ? interpolate(frame, [walkEnd, poseEnd], [charX, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  : frame >= walkStart ? charX : 360;
const activeCamY = atDestination
  ? interpolate(frame, [walkEnd, poseEnd], [charY, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  : frame >= walkStart ? charY : 640;

// 5. Transform SVG principal
<g transform={`
  translate(${360 + driftX} ${640 + driftY})
  scale(${baseScale * camZoom} ${baseScale * camZoom * scaleY})
  skewX(${skewX})
  translate(${-activeCamX} ${-activeCamY})
`}>
```

### Regles critiques

1. **inputRange monotonique** : `zoomInEnd` doit toujours etre < `walkEnd`. Utiliser `Math.min(walkStart + Math.round(fps * 3), walkEnd - 5)` si les beats sont proches.
2. **Beats visuels** : toujours utiliser `narrToVisual()` pour convertir les temps narration en frames visuelles. Les beats narration bruts peuvent etre a 1s d'ecart la ou les frames visuelles sont a 7s.
3. **getWaypointPos** : toujours clamper `t` avec `Math.max(0, Math.min(1, t))` pour eviter les positions hors-path.
4. **Sprite fade out** : utiliser `interpolate(frame, [walkEnd, poseEnd], [1, 0])` pour disparition propre.
5. **Chameau/deuxieme perso** : retard de `0.06` sur le `progressT` suffit pour un espacement visuel naturel.

### Valeurs validees S3 Mansa Moussa
- Zoom : 1.0 -> 2.0 en 3s
- Tilt annule : 28deg -> 8deg pendant le zoom-in
- Retard chameau : 0.06 sur progressT
- Taille Mansa : 64px, taille chameau : 48px
- Pose royale : 5s avant fin scene, fade out jusqu'a fin

### Reference video validee
`out/atlas-mansa-moussa/v2-finition/s3-pixellab-v2.mp4`
URL Vercel : https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/s3-pixellab-v2-ebYcEZ9ROHGOboPKRNyRY8AN8kR0rT.mp4

### Probleme connu : sprites + encadres
Si un personnage marche vers une zone ou un label/encadre SVG est positionne, les deux se superposent.
Solutions : (a) faire disparaitre le sprite avant l'encadre, (b) sortir les encadres du groupe tilt/camera, (c) ajuster l'ordre de rendu (encadre APRES sprite dans le JSX = encadre par-dessus).

---

**Note (2026-08-31)** : pattern précurseur du camera-track sprites CSS de Beat 3 Empire Ghana
(`archive/episodes-livres/empire-ghana/BEAT-3-COMPLETE.md`) — celui-ci opère sur sprites DANS le SVG
(la caméra scale/translate les déplace automatiquement), Empire Ghana sur sprites CSS par-dessus
le SVG (calcul manuel de projection). Les deux techniques coexistent selon le besoin.
