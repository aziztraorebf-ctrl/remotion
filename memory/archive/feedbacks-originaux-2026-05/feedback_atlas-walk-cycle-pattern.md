---
name: Atlas walk cycle PixelLab — pattern complet validé S3 Shaka Zulu
description: Pattern walk cycle PixelLab sur carte Atlas — sprites, caméra, flipX, isArrived, timing latéral, lerpColor territoire
type: feedback
---

Pattern validé S3 Shaka Zulu. Réutilisable sur tous les épisodes Atlas avec sprites en mouvement.

**Why:** Construit sur ~4 sessions de production Shaka Zulu + Mansa Moussa. Chaque règle correspond à un bug réel.

**How to apply:** Lire AVANT de coder tout beat Atlas impliquant des sprites PixelLab en déplacement sur une carte.

---

## Pattern complet walk cycle

### Paramètres canoniques sprites sur carte
- Taille sprite : 64px (canon, ne pas changer)
- Pas d'ombre sous les sprites
- Pas de hop statique (animation seule = assez)
- Carte plate pour les persos (pas de perspective 3D)
- Labels hors animation (ne pas les inclure dans la zone du sprite)

### Zoom caméra pendant le walk
- Zoom actif pendant le déplacement : `scale: 2.5x` (validé S3 Shaka Zulu)
- Pull-back automatique à l'arrivée (`isArrived` flag)
- Tilt caméra annulé via `rotate(0deg)` explicite pendant le walk

### flipX
- `flipX: true` quand le personnage se déplace vers la gauche (maintenir cohérence directionnelle)

### lerpColor territoire
- Pendant le walk : interpoler la couleur du territoire survolé OR_VIF → BORDEAUX pour signaler l'expansion

### isArrived
- Quand le sprite atteint la destination → déclencher idle animation + pull-back caméra
- Vérifier la distance euclidienne pixel par pixel (pas de timing approximatif)

---

## Timing walk cycle latéral (VALIDÉ session 2026-05-02)

**Contexte :** Beat Shaka Zulu avec 3 guerriers (1 central + 2 latéraux). Les latéraux convergent vers le central quand la corne descend vers lui.

**Règle :** Ne PAS déclencher le walk cycle des guerriers latéraux au frame 0. Le déclencher uniquement quand la corne commence à descendre vers le guerrier central.

- **Timing recommandé :** ~frame 240 (8e seconde à 30fps) — plus safe
- **Timing maximum :** ~frame 300 (10e seconde) — là où la corne commence effectivement à descendre
- **Résultat :** les latéraux bougent AVEC la corne, pas avant. Synchronisation narrative correcte.

**Anti-pattern :** walk cycle latéral déclenché à frame 0 = les guerriers marchent dans le vide avant que la corne ne descende. Pas de sens narratif.

---

## Vrais walk cycles vs archive designs

**Les dossiers `archive/<perso>-<animation>-east/frame_XXX.png` ne sont PAS des walk cycles.**
Ce sont 6 designs alternatifs d'un personnage. Les boucler = effet "palpitation" désastreux.

**Les vrais walk cycles** sont dans `characters/<perso>/animations/<animation-id>/<direction>/frame_XXX.png` (PixelLab MCP officiel).

Avant d'utiliser un dossier PixelLab en boucle : Read 3 frames espacées et vérifier visuellement la continuité. Si ce sont 6 personnages différents → utiliser UN seul frame statique.

---

## Références
- Session prod : `memory/episodes/shaka-zulu/SESSION-2026-05-02-VAGUE-2-LESSONS.md`
- Gotchas PixelLab : `memory/feedback_remotion-pixellab-gotchas.md` règles 11 + 12
- Camera-track CSS sprites : `memory/feedback_atlas-camera-track-css-sprites.md`
