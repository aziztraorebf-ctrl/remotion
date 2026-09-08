---
name: "Atlas — Camera-track avec sprites en CSS (pattern Beat 3 Ghana)"
description: "Variant du pattern S3 Mansa Moussa quand les sprites sont en <Img> CSS absolu (pas dans le SVG). Helper svgToCompWithCam projette les coordonnées SVG → composition en suivant la caméra. Validé Beat 3 Empire Ghana v4."
type: feedback
originSessionId: c4fb0f76-d74b-41f7-a264-13fa900e4565
---
# Camera-track Atlas avec sprites CSS

> Validé 2026-05-03 Beat 3 Empire du Ghana v4. Aziz : "il n'y a pas de zoom sur les personnages et le track en tant que tel. On les voit encore de haut" → fix : amplifier zoom (2.0→2.8) + recalcul projection CSS.

## Contexte : 2 patterns possibles

| Pattern | Sprites | Caméra | Quand utiliser |
|---------|---------|--------|----------------|
| **S3 Mansa Moussa** | `<image>` dans le SVG | scale/translate SVG déplace les sprites automatiquement | Sprites simples, animations frame-based intégrées |
| **Beat 3 Ghana** | `<Img>` CSS absolu par-dessus SVG | sprites doivent être projetés manuellement | Spritesheet `getSpriteFramePath` + filtres CSS (drop-shadow) |

## Règle d'or

Si les sprites sont en CSS, **calculer manuellement** la position composition à partir des coords SVG + état caméra. Sinon les sprites restent fixes pendant que la carte bouge dessous = bug visuel immédiat.

## Helper réutilisable

```tsx
function computeCameraState(localFrame: number) {
  // 1. Position des sprites en temps réel (waypoints/interpolate)
  let spriteX = ...;
  let spriteY = ...;

  // 2. Camera focus suit le sprite actif
  let camFocusX = DEFAULT_X;
  let camFocusY = DEFAULT_Y;
  if (localFrame >= WALK_START && localFrame < WALK_END) {
    camFocusX = spriteX;  // suit le perso
    camFocusY = spriteY;
  }

  // 3. Camera zoom (amplitudes Beat 3 validées)
  // Walk = 2.8, Crouch = 3.2 (insert), Pull-back inter = 1.6, Dolly-out = 1.0
  let camZoom = 1.85;
  // ... calcul par phase ...

  return { driftX, driftY, camFocusX, camFocusY, camZoom, skewX, scaleY, spriteX, spriteY };
}

function svgToCompWithCam(svgX, svgY, cam) {
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + 360 + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + 640 + cam.driftY;
  return { x: screenSvgX * CSS_SCALE, y: screenSvgY * CSS_SCALE };
}
```

`CSS_SCALE = COMP_W / SVG_W` (ex: 1080/720 = 1.5).

## Transform SVG correspondant

```tsx
<g transform={`
  translate(${360 + cam.driftX} ${640 + cam.driftY})
  scale(${cam.camZoom} ${cam.camZoom * cam.scaleY})
  skewX(${cam.skewX})
  translate(${-cam.camFocusX} ${-cam.camFocusY})
`}>
```

Important : pas de `translate(-360, -640)` final ici, on fait `translate(-camFocusX, -camFocusY)` directement.

## Sprites + sacs en CSS qui suivent la caméra

```tsx
const spritePos = svgToCompWithCam(cam.spriteX, cam.spriteY, cam);
const dropSelComp = svgToCompWithCam(SVG_DROP_SEL_X, SVG_DROP_SEL_Y, cam);

// Sprite
<Img
  src={spriteSrc}
  style={{
    position: "absolute",
    left: spritePos.x - SPRITE_SIZE / 2,
    top: spritePos.y - SPRITE_SIZE / 2 - 30, // offset anchor pied
    width: SPRITE_SIZE,
    height: SPRITE_SIZE,
    imageRendering: "pixelated",
    filter: "drop-shadow(2px 2px 6px rgba(0,0,0,0.6))",
  }}
/>

// Sac persistant au point de drop (suit aussi la caméra)
{sacSelVisible && (
  <div style={{
    position: "absolute",
    left: dropSelComp.x - sacSize / 2,
    top: dropSelComp.y - sacSize / 2,
    opacity: sacSelOpacity,
  }}>
    <img src={staticFile("...")} style={{ width: sacSize, ... }} />
  </div>
)}
```

## Taille adaptative au zoom (CRITIQUE)

Si zoom passe de 2.8 à 1.0 (dolly-out), un sprite à taille fixe devient ridiculement gros par rapport à la carte qui rétrécit. Fix :

```tsx
const sacSize = BASE_SIZE * (cam.camZoom / REFERENCE_ZOOM);
// Ex : sacSize = 60 * (camZoom / 1.85) → 91px à zoom 2.8, 32px à zoom 1.0
```

Pour les sprites perso : moins critique car on le voit principalement à un seul niveau de zoom.

## Amplitudes zoom validées Atlas (Beat 3 v4)

| Phase narrative | Zoom |
|-----------------|------|
| Wide / contexte | 1.0 - 1.5 |
| Standard map | 1.7 - 1.85 |
| Walk perso | **2.8** |
| Insert détail (crouch, dépôt) | **3.2** |
| Dolly-out dramatique final | **2.4 → 1.0** (amplitude > 2x) |

**Règle** : pour un "zoom sur le perso" qui se sent VRAIMENT zoomé sur SVG 720×1280, viser ≥ 2.5x. À 2.0x on a juste l'impression que la carte est légèrement plus proche.

## Anti-patterns

1. **Sprites CSS sans recalcul projection** → la carte bouge, les sprites restent figés.
2. **Sacs ancrés au POI plutôt qu'au pied du sprite** → décalage visuel : le berbere s'accroupit ici, le sac apparaît là-bas.
3. **Sacs taille fixe pendant un dolly-out** → sacs gigantesques à pull-back complet.
4. **Zoom 2.0 considéré comme "gros plan"** → c'est juste un cadrage moyen. Vrai gros plan = 2.8+.

## Référence code

`src/projects/atlas/empire-ghana/scenes/Beat3Barter.tsx` — `computeCameraState()` + `svgToCompWithCam()` + `Beat3Sprites` component.
