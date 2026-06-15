---
name: sfx-sequence-et-drapeaux-reels
description: 2 bugs critiques decouverts 2026-06-03 sur Beat3 Maroc — SFX inaudibles (pattern frame===X au lieu de Sequence) + drapeaux dessines a la main infideles (utiliser vraies images Wikimedia).
metadata:
  type: feedback
---

## BUG 1 — SFX inaudibles : pattern `{frame === X && <Audio/>}` NE JOUE PAS en render

**Why:** Aziz n'entendait AUCUN SFX dans Beat3 (ni swoosh, ni ping, ni plate-pop), meme avec ecouteurs. Cause : `{frame === X && <Audio .../>}` ne monte le `<Audio>` qu'UNE SEULE frame (1/30e s) → en render le son n'a pas le temps de demarrer. Confirme par ffmpeg volumedetect : avec frame===X, silence aux SFX ; avec Sequence, swoosh -8.4dB, ping -3.5dB (presents).

**How to apply:** TOUJOURS wrapper les SFX one-shot dans `<Sequence from={F} durationInFrames={20-30}>` :
```tsx
<Sequence from={F_PING} durationInFrames={20}>
  <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.50} />
</Sequence>
```
Pattern valide depuis Or Africain Beat4 (l.522). Le `{frame===X}` etait un anti-pattern.

**⚠️ IMPACT AUTRES BEATS** : Beat0 et Beat1 Maroc (deja "valides") utilisent AUSSI `{frame===X}` → leurs SFX ne jouent probablement PAS non plus. A corriger avant publication. Grep `frame===` / `frame ===` suivi de `<Audio` dans tous les beats.

## BUG 2 — Drapeaux dessines a la main (drawFlagCanvas) sont INFIDELES

**Why:** `drawFlagCanvas` dans flagCanvas.ts DESSINE les drapeaux en code (trigonometrie pour les etoiles) → approximatifs. L'etoile Maroc deformee, Chine en aplat rouge. Aggrave par le clip dans une silhouette non-rectangulaire (slice coupe l'etoile centrale).

**How to apply:** Utiliser de VRAIES IMAGES de drapeaux officiels :
- Source : **Wikimedia Commons SVG** (domaine public, vectoriel). Ex: `Flag_of_Morocco.svg`, `Flag_of_the_People%27s_Republic_of_China.svg`, `Flag_of_Germany.svg`.
- Conversion : `rsvg-convert -w 1024 -h 683 flag.svg -o flag.png` (rsvg-convert dispo via brew).
- Stockage local : `public/_shared/flags/` (headless-safe, pas de fetch flagcdn en render).
- Clip SVG : `preserveAspectRatio="xMidYMid meet"` (drapeau ENTIER, etoile non coupee) + `<path fill={couleurNationale}>` dessous pour combler les bords de la silhouette.
- JAMAIS `flagcdn.com` en `<image>`/`<img>` direct (fetch externe = KO headless).

Drapeaux HD installes 2026-06-03 : ma.png (pentagramme officiel), cn.png (5 etoiles), de.png, es.png, fr.png — TOUS refaits en HD Wikimedia. Les anciens es/fr/de.png (1.5Ko basse def) + ma.png (146o casse) remplaces.

**⚠️ IMPACT BEAT1** : Beat1 Phosphate utilise `drawMarocFlagCanvas` (Maroc dessine main) + `<img src=flagcdn.com>` dans les labels (fetch externe). A corriger : Maroc -> vraie image ma.png, mini-drapeaux labels -> images locales. [[pattern-or-africain-plaques-relief-sfx]]

## BUG 3 — Drapeau France (et pays a outre-mer) : bbox geante casse le clip SVG

**Why:** Le drapeau France apparaissait BLANC (que la bande du milieu). Cause : France en MultiPolygon inclut Guyane, Reunion, Mayotte, Antilles... -> bbox lon [-97.9, 55.8] lat [-21.4, 51.1] (Amerique -> ocean Indien). L'image drapeau dimensionnee sur cette bbox geante -> la metropole ne recoit qu'un fragment (bande blanche). Allemagne/Espagne OK car bbox compacte.

**How to apply:** Helper `useClipFlags` a une option `mainlandBox: [minLon, minLat, maxLon, maxLat]` -> ne garde que les anneaux dont le 1er point tombe dedans. Pour la France : `[-5, 41, 10, 52]` (metropole seule). A utiliser pour TOUT pays a territoires d'outre-mer (France, Pays-Bas, USA avec Alaska/Hawaii, Danemark+Groenland, etc.).

## REGLE SFX selon contexte camera (feedback Aziz 2026-06-03)

- **swoosh-zoomin** : SEULEMENT si vrai zoom-in camera. PAS sur carte fixe (Beat0 SweepReveal) ni sur beat demarrant a altitude fixe (Beat1).
- **swoosh-pullback** : SEULEMENT si pull back RAPIDE et marque. PAS sur dezoom lent/continu (Beat1 zoom 4.8->4.4 = imperceptible -> SFX retire).
- **Garder les SFX d'EVENEMENT** (slam stat, dot/ping apparition, plate-pop plaque, ping allumage pays) : eux correspondent a un evenement visuel precis, ils font toujours sens.
- Principe : un SFX doit correspondre a un EVENEMENT VISUEL reel. Pas de SFX "par habitude".

## Beat3 Acteurs — FINAL 2026-06-03
Valide Aziz. Technique clip SVG (vraies images, meet, fond couleur) + lignes connexion Maroc->Chine/Allemagne (centroides derives des bbox projetees, PAS de filter:blur CSS qui casse headless). Vue monde Mercator. Preview : https://files.catbox.moe/ivv7d8.mp4
