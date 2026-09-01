# Music loop pour `startFrom` tardif

**Règle :** Quand un beat utilise une piste musicale avec un `startFrom` proche de la fin de la piste, la musique s'arrête au milieu du beat. Il faut empiler un 2e `<Audio>` qui relance la piste depuis le début.

**Détection** : si `(durée_piste_sec - startFrom_sec) < durée_beat_sec` → loop obligatoire.

## Exemple Beat13 Sénégal (2026-05-24)

- Piste : `music-A-ambient-souverain.mp3` — durée 321s
- Beat13 : `startFrom={8851}` (= 295.02s × 30) — donc seulement **26s** de musique restante
- Durée beat : 49s (1470 frames @ 30fps)
- Conséquence sans loop : silence à partir de ~f780 (26s × 30)

## Pattern code

```tsx
{/* Piste originale — joue jusqu'à épuisement */}
<Audio
  src={staticFile("music.mp3")}
  startFrom={8851}
  volume={interpolate(frame, [F_END - 45, F_END], [0.13, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
/>
{/* Loop — démarre à f780 avec fade-in 20 frames */}
<Audio
  src={staticFile("music.mp3")}
  startFrom={0}
  volume={interpolate(frame, [780, 800, F_END - 45, F_END], [0, 0.13, 0.13, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
/>
```

## Calcul rapide

```
loop_start_frame = (durée_piste_sec - startFrom_sec) * fps
```

Pour Beat13 : `(321 - 295.02) * 30 = 779.4` → arrondi à f780.

## Cas où la règle s'applique

- Tout beat tard dans l'épisode utilisant une piste musique unique partagée
- Plus le beat est tard dans l'audio global, plus le risque est élevé
- À vérifier systématiquement pour : Acte 3 (mécanismes 2/3) et Acte 4 de tout Mid-form Souverain

## Référencé depuis

- DOCTRINE-SOUVERAIN §3.7 (Checklist Mapbox-in-Beat point 4)
- STARTER-PROMPT-senegal-acte4.md (rappel)
- `tools/minimax-music-tts.md` § limite boucle 3+ min (pointeur déjà présent côté repo vers ce fichier,
  qui n'existait pas encore — comblé par cette migration)

---
Migré depuis auto-memory (`feedback_audio-music-loop-startfrom-tardif.md`) le 2026-08-31, contenu original
inchangé.
