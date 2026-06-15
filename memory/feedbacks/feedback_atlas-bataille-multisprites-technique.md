# Feedback — Technique BATAILLE multi-sprites Atlas (validée 2026-06-04)

> Session marquante : on a prouvé qu'une vraie BATAILLE NARRATIVE est faisable en d3-geo + PixelLab
> pur (zéro Mapbox, zéro After Effects). Aziz : "quelque chose que je ne pensais pas possible",
> "ne pas perdre ça", "Hannibal se débloque beaucoup plus qu'avant".
> Template canonique : `src/projects/atlas/_reference/mansa-moussa-v2/scenes/AtlasV2ArmyDeployScene.tsx`.
> Voir aussi [[ATLAS-PIXELLAB-PLAYBOOK]], [[ATLAS-PLAYBOOK]].

## Ce qui marche (recettes durables)

1. **Multi-sprites par camp = boucle sur indices, état calculé par fonction pure.**
   `getState(camp, idx)` retourne `{x, y, dir, anim, frameCount, loop, animStartAt, opacity}`.
   Aucun React state — tout est dérivé analytiquement de `frame` (et `frame-1` pour la direction).

2. **File indienne (Recette A) = offset le long d'un vecteur d'avance.**
   `headPos = lerp(start, fileEnd, tMarch)` puis `soldat_i = headPos - uniteAvance * i * fileStep`.
   N sprites en file SANS coder N trajectoires.

3. **Transition file→ligne = smoothstep entre position-file et position-ligne, EN VAGUE.**
   `dStart = deploy + idx*waveStagger` → chaque rang se déploie un peu plus tard = vivant, pas en bloc.

4. **Direction DÉDUITE du déplacement (`dx = x(frame) - x(frame-1)`) = anti-moonwalk universel.**
   `dir = |dx|<0.05 ? versEnnemi : (dx>=0 ? "east" : "west")`. Marche sur 8 sprites en glissement
   latéral simultané. C'est LA généralisation du fix flip : on ne flippe jamais, on choisit la
   frame native selon le sens réel du mouvement. (Sprites est+ouest natifs suffisent.)

5. **Play-once (estoc, mort) = `loop=false` dans AtlasPixelChar → clamp à la dernière frame.**
   Ajouté props `loop` (défaut true) + `animStartAt` (recale le cycle indépendamment du fade-in
   `appearAt`). L'estoc se fige lance tendue ; la mort se fige au sol puis fade-out.

6. **Phases combat = beats optionnels enchaînés.**
   `charge` (ruée vers le centre, anim course, loop) → `clash` (estoc, play-once, séquentiel via
   `clashMode` + `CLASH_SEQ_DELAY` ou simultané) → `death` (camp `losingSide`, les `casualties`
   derniers index tombent en cascade `+idx*6f` puis `opacity→0` après la fin de l'anim death).

7. **SFX combat (ElevenLabs)** : `sfx-army-charge` (cri+ruée, 2s) à `charge`, `sfx-clash-impact`
   (choc armes, 1.36s) à `clash`. TOUJOURS en `<Sequence from durationInFrames>`, jamais frame===X.

8. **PixelLab : générer les anims de combat sur le perso existant via son ID.**
   `animate_character` modes : template (`running-6-frames`, `falling-back-death` = play-once natif),
   v3 custom (`thrusting a spear forward` = estoc). 1 gen/direction, est+ouest, ~2-4min async.
   Règle async respectée (poll download `--fail` jusqu'à HTTP 200, le zip renvoie 423 sinon).
   INSPECTER les frames (planche horizontale) avant intégration — RGB/style check.

## Limites connues (assumées avec Aziz)

- **Lignes serrées au combat** : lances qui se chevauchent (dense mais lisible). Ajustement `lineGap`
  = peaufinage de toute fin, pas bloquant.
- **Limite lisible vs chargé** : on touche le plafond du cadre 9:16 à 4v4 en mêlée. Ne pas surcharger.

## BACKLOG avancé (prochain palier, pas trivial)

**Multi-lignes séquentielles** (Aziz) : plusieurs rangs par camp, chaque rang s'affronte tour à tour,
les soldats de l'arrière AVANCENT pour combler ceux qui meurent. Demande un vrai MOTEUR D'ÉTAT par
soldat (vivant/mort/position-cible dynamique) — pas dérivable d'une simple fonction de `frame`.
À faire quand un sujet le justifie (grande bataille). Ne PAS complexifier le template actuel pour ça.

## Briques extractibles (grep-usage AVANT extraction)

- `AtlasPixelChar` enrichi (loop/animStartAt) → **promouvoir vers `_shared`** (brique universelle).
- File indienne / file→formation / Spotlight Insert : restent dans la scène de réf, extraire au 2e usage réel.
