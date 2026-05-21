# Lab Hannibal — Résultats par phase

> Branche : `lab/hannibal-rpg-patterns`
> Objectif : prouver les patterns RPG/HUD pour Atlas avant épisode Hannibal réel.
> Coût total : à mettre à jour à chaque phase.

## Phase 1 + 1.5 — Validé Aziz 2026-05-04

**MP4** : `out/_lab-hannibal/phase1-5.mp4` (10s, 1.6 MB, portrait 1080×1920)
**Coût** : $0.10 (2 SFX ElevenLabs)

### Ce qu'on a prouvé

| Pattern | Verdict Aziz | Paramètre validé |
|---------|--------------|------------------|
| Règle 3 couches (fond/action/HUD) | KEEP | Carte palette riche méditerranéenne (PAS désaturée), sprite contraste, HUD semi-transparent |
| FocusBubble zoom+blur | **KEEP** ("superbe, marche très très bien") | `zoomTarget=1.45`, `blurMax=3.5`. Usage : moments dramatiques uniquement |
| StatGauge avec deltas animés | KEEP | Jauges permanentes mais `hideRanges` actif pendant focus dramatique |
| HUD permanent + disparition ponctuelle | KEEP | Validé Aziz : "garder durant la vidéo MAIS disparaissent pour moments dramatiques" |
| SFX blip avant focus | KEEP avec ajustement | Trim à 0.3s avec fade-out (ElevenLabs min 0.5s contournée par ffmpeg) |
| SFX tick apparition jauge | KEEP avec ajustement | Trim à 0.2s. Apparition seulement, JAMAIS continu |

### Composants promus vers `_shared/`

- [FocusBubble.tsx](src/projects/atlas/_shared/FocusBubble.tsx)
- [StatGauge.tsx](src/projects/atlas/_shared/StatGauge.tsx)
- Documentation : [ATLAS-COMPOSANTS.md](src/projects/atlas/_shared/ATLAS-COMPOSANTS.md) section RPG/HUD

### SFX bibliothèque lab

- `public/_lab-hannibal/sfx/blip-bubble-trimmed.mp3` — 0.3s, déclenchement focus
- `public/_lab-hannibal/sfx/stat-tick-trimmed.mp3` — 0.2s, apparition jauge
- Originaux bruts (0.5s) : `blip-bubble.mp3`, `stat-tick.mp3` (fallback si re-trim nécessaire)

### Ajustements appliqués Phase 1 → 1.5

| Avant | Après | Raison |
|-------|-------|--------|
| zoomTarget 1.22 | **1.45** | Aziz : "augmenter intensité zoom au lieu de voir le perso de loin" |
| blurMax 3.5 | 3.5 (inchangé) | Aziz : "blur on le laisse comme il est" |
| Jauges visibles tout du long | Masquées `[148, 215]` pendant focus | Aziz : "pour moments dramatiques elles disparaissent et réapparaissent" |
| blip 0.5s | 0.3s trim + fade | Aziz : "trimer pour pas que ça traîne" |
| tick 0.5s | 0.2s trim + fade | Aziz : "discret, seulement apparition" |
| SFX jauge en continu | SFX uniquement à l'apparition | Aziz : "imagine si musique + narration + actions + SFX continu = trop" |

## Phase 2 (à venir)

À tester :
- Bulle dialogue pixel ("Roma delenda est" sur Hannibal)
- Object states éléphant (vivant → épuisé neige → mort gel)

Décision avant lancement : génération PixelLab Hannibal + éléphants dédiés (PAS recyclage cette fois).

## Phase 3 (à venir)

- Particules narratives (nuée 50 sprites soldats sur trajet)
- War cry climax avec duck musique

## Décisions à mémoriser pour Hannibal v1 réel

- **Carte** : palette méditerranéenne (mer bleu marine + Carthage ocre + Rome violet + Alpes blanc) validée placeholder. Pour réel : d3-geo Natural Earth Méditerranée.
- **3 couches** : règle de **contraste relatif**, pas désaturation absolue (Aziz a corrigé : "désaturé = LED gris triste, on perd identité").
- **FocusBubble** : moments dramatiques uniquement. Pas systématique.
- **StatGauge** : permanentes + `hideRanges` ponctuels. SFX UNIQUEMENT à l'apparition.
