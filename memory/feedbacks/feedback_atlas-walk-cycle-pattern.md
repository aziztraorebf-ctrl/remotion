# Atlas walk cycle PixelLab — pattern validé Shaka Zulu

> Migré depuis auto-memory 2026-08-31 (validé 2026-05-02, épisode Shaka Zulu archivé). Pattern
> technique complet pour un personnage animé (walk cycle PixelLab) sur carte d3-geo Atlas, avec
> zoom caméra, flip, arrêt en fin de chemin, colorisation territoire.

Pattern complet validé 2026-05-02 sur S3 Expansion Shaka Zulu.

**Règle 1 — Les dossiers `archive/<perso>-<animation>-east/` ne sont PAS un walk cycle.**
Ce sont N designs différents du même personnage (variations PixelLab). Le vrai walk cycle = output `animate_character` PixelLab (6 frames numérotées `frame_000` à `frame_005`). Cf `memory/feedbacks/feedback_remotion-pixellab-gotchas.md` règle 12 pour le gotcha de vérification visuelle correspondant.

**Règle 2 — Props composant walk cycle (référence, adapter au composant actuel) :**
```tsx
walkFrames={WALK_EAST}  // tableau de 6 chemins public/
walkSpeed={6}           // frames par sprite (30fps = ~5 cycles/sec naturel)
flipX={true}            // pour guerrier marchant vers la GAUCHE
hopAmplitude={3}        // léger rebond vertical (0 = statique)
showHaloOnPath={false}  // gérer chemins manuellement dans la scène parente
chibiSize={90}          // taille validée pour zoom caméra 2.5x
tOffset={0}             // 0 pour guerrier principal (positif = en retard)
```

**Règle 3 — `tOffset` JAMAIS négatif** (crash sur calcul waypoints index).

**Règle 4 — Zoom caméra Atlas serré :**
```tsx
const camScale = interpolate(frame, [0, durationFrames], [2.5, 1.8], {...});
const camX = 360 - mapPointX * camScale;  // centrer sur région cible
const camY = 640 - mapPointY * camScale;
// Tous les éléments dans <g transform={`translate(${camX} ${camY}) scale(${camScale})`}>
// stroke-width divisé par camScale pour rester constant visuellement
```

**Règle 5 — Arrêt walk cycle en fin de chemin :**
```tsx
const isArrived = t >= 0.95;
const hopY = isArrived ? 0 : Math.abs(Math.sin(frame * 0.4)) * hopAmplitude;
const spriteSrc = isArrived ? walkFrames[0] : walkFrames[Math.floor(frame/walkSpeed) % walkFrames.length];
```

**Règle 6 — Colorisation territoire conquis :**
```tsx
function lerpColor(t: number): string {
  // terracotta #C67B5A → or #C8A84B (exemple, adapter à la palette du projet)
  const r = Math.round(0xC6 + (0xC8 - 0xC6) * t);
  const g = Math.round(0x7B + (0xA8 - 0x7B) * t);
  const b = Math.round(0x5A + (0x4B - 0x5A) * t);
  return `rgb(${r},${g},${b})`;
}
// highlightFills[iso] = lerpColor(interpolate(frame, [startFrame, endFrame], [0, 1], {clamp}))
```

**Technique "insert écran de fumée"** (détail complet : `memory/feedbacks/feedback_inserts-pattern-interrupt.md`) :
Un pattern interrupt (overlay sombre) qui cache la carte 5-7s = temps de grâce pour changer les couleurs de territoire sans timing précis au frame. Quand la carte réapparaît, le spectateur voit le résultat final.

**Why:** Validé après plusieurs itérations sur S3 Shaka Zulu. L'approche zoom serré + walk cycle + territoire progressif reproduit le même feeling qu'une scène caravane précédemment validée.

**How to apply:** Réutiliser ce pattern pour toute scène avec personnage animé sur carte d3-geo, si un tel système est relancé.
