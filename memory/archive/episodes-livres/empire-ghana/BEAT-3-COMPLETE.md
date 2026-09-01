# BEAT 3 Empire Ghana — COMPLET (v4 livré 2026-05-03)

> Migré depuis auto-memory 2026-08-31.

## Livrable final

| Item | Path | Statut |
|------|------|--------|
| Render final | `out/empire-ghana/beat3-v4.mp4` (22 MB, 690 frames, ~23s) | validé Aziz |
| Code source | `src/projects/atlas/empire-ghana/scenes/Beat3Barter.tsx` | |
| Composition Remotion | `EmpireGhanaBeat3Barter` (1080×1920, 30fps) | |

## Trajet Beat 3 v1 → v4

| Version | Cause itération |
|---------|-----------------|
| v1 | Sacs SVG abstraits + flèche au lieu des sprites berbere/sahelien. Marché placé sur POI au lieu du pied du sprite. |
| v2 | Vrais sprites OK + sacs PixelLab + balance Lottie. Mais : caméra trop statique (pas de zoom-track), sacs apparaissent loin du sprite, balance Lottie invisible. |
| v3 | Camera-track ajouté + sacs au pied + balance PixelLab. Mais : zoom encore trop large (2.0x), empire glow + routes du dolly-out invisibles (z-order + radialGradient trop pâle). |
| **v4** | **validé** — zoom 2.8x walk / 3.2x crouch / dolly-out 2.4→1.0. Empire OR_VIF fill direct + outline gold qui pulse. Routes par-dessus l'empire avec glow stroke en sous-couche. |

## Découvertes techniques (à réutiliser)

### 1. Camera-track sprite avec sprites en CSS (différent du pattern S3 Mansa Moussa)

Pattern S3 Mansa Moussa : sprites dans le SVG → la caméra scale/translate les déplace automatiquement.
**Pattern Beat 3 Ghana** : sprites en `<Img>` CSS absolu (par-dessus le SVG) → il faut **calculer manuellement** la projection à l'écran.

Helper réutilisable :
```tsx
function svgToCompWithCam(svgX, svgY, cam) {
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + 360 + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + 640 + cam.driftY;
  return { x: screenSvgX * CSS_SCALE, y: screenSvgY * CSS_SCALE };
}
```

`camFocusX/Y` = point que la caméra "regarde". Pendant le walk, on le fait suivre la position du sprite en temps réel → la caméra suit le perso, et tous les éléments CSS (sacs, balance) suivent automatiquement.

### 2. Zoom amplitudes pour vraiment voir les perso

Sur SVG 720×1280 affiché en 1080×1920, **zoom 2.0x est trop faible** pour avoir l'impression d'un gros plan sur un sprite 140px. Échelle validée v4 :
- Phase intro : 1.7 → 2.2 → 2.8
- Walk : **2.8** (gros plan)
- Crouch : **3.2** (insert détail)
- Pull-back inter-marchands : 1.6
- Dolly-out final : **2.4 → 1.0** (amplitude dramatique)

### 3. Sacs au pied du sprite (pas au POI fixe)

Définir un drop point séparé du POI :
```tsx
const SVG_DROP_SEL_X = SVG_KOUMBI_X - 28;
const SVG_DROP_SEL_Y = SVG_KOUMBI_Y - 18;
```

Le berbere walk de Taghaza vers `SVG_DROP_SEL_*` (pas vers Koumbi). Le sac apparaît à `svgToCompWithCam(SVG_DROP_SEL_X, SVG_DROP_SEL_Y, cam)` → exactement à l'endroit où le berbere s'est accroupi, suit la caméra automatiquement.

### 4. Sacs taille adaptative au zoom

`sacSize = 60 * (camZoom / 1.85)` → les sacs grossissent quand on zoom et restent visibles quand on dolly-out. Sans ça : invisibles au pull-back final.

### 5. Empire pulse + routes — z-order et opacity réelle

**ÉCHEC v3** : `radialGradient` avec stopOpacity 0.3 multiplié par dollyT*0.4 → opacity finale ~0.18-0.30 sur fond doré déjà saturé = invisible.

**FIX v4** :
- Fill direct `OR_VIF` (pas gradient) avec opacity `dollyT * (0.25 + pulse * 0.25)` = visible
- Outline gold épais qui pulse : `strokeWidth={3 + dollyT*4 + pulse*2}` = 3px → 9-11px (lecture immédiate)
- **Routes APRÈS l'empire dans le JSX** (z-order) sinon hatch les masque
- Glow néon sur routes : double-stroke 8-12px en sous-couche opacity 0.35-0.45 = effet illumination

### 6. Balance PixelLab > Lottie SVG

`balance-commerciale.png` (PixelLab) bien plus visible et stylistiquement cohérent que `balance.json` (Lottie). Toujours préférer asset PixelLab si disponible — Lottie SVG = fallback uniquement.

## Mouvement caméra Beat 3 v4 — chorégraphie complète

| Frame | Phase | Zoom | Focus |
|-------|-------|------|-------|
| 0-30 | Intro zoom-in | 1.7→2.2 | Koumbi |
| 30-99 | Build-up | 2.2→2.8 | Koumbi |
| 99-159 | Berbere walk south | 2.8 | suit berbere |
| 159-179 | Berbere crouch (dépôt sel) | **3.2** insert | berbere figé |
| 179-273 | Berbere walk north (sortie) | 2.8 | suit berbere |
| 273-296 | Re-frame marché | 2.8→1.6 | berbere → Koumbi |
| 296-363 | Sahelien walk east | 1.6→2.8 | suit sahelien |
| 363-383 | Sahelien crouch (dépôt or) | **3.2** insert | sahelien figé |
| 383-443 | Sahelien walk west (sortie) | 2.8 | suit sahelien |
| 443-499 | Maintien Koumbi | 2.8→2.4 | Koumbi |
| 499-611 | Cartouche "LE SILENT BARTER" | 2.4 | Koumbi |
| **611-690** | **Dolly-out dramatique** | **2.4→1.0** | Koumbi → vue empire |

Pendant le dolly-out final :
- Empire Wagadou : fill OR_VIF + outline gold qui pulse (3px → 9-11px)
- Routes Taghaza→Koumbi + Bambouk→Koumbi : glow néon par-dessus l'empire
- Cartouche apparaît : "5 SIÈCLES de commerce mondial sur ce silence"

## Règle confirmée Beat 3

**"Plus de zoom = plus d'émotion"** : Aziz a explicitement signalé que les zooms étaient sous-utilisés dans l'épisode. Pour les prochains beats : oser zoom 2.5-3.0x sur les moments narratifs forts. Le pull-back final = effet "révélation" qui DOIT être justifié par contenu narratif (cartouche, illumination empire, etc.) — sinon on perd le spectateur.

## Prochaine scène (au moment de la rédaction) = Beat 4 Effondrement

Pattern walk-cycle camera-track désormais éprouvé sur sprites CSS — réutilisable sur d'autres beats/épisodes si besoin (guerrier almoravide ?).
