# Motion Choreography References

Videos de reference pour la technique **Motion Reference Transfer** via Seedance 2.0 reference-to-video.

## Fichiers

### `source-anime-fight-22s.mov` (126 MB)
Video source complete (22.2s). Combat 2D anime style : 2 combattants (kimono blanc martial arts vs tenue noire avec epee), montagnes enneigees, mouvements fluides, changements de plan (wide / medium / close-up). Style proche de Avatar: The Last Airbender / Dragon Prince.

### `source-anime-fight-segment-B-4to12s-8s.mp4` (2.9 MB)
Segment B (4s-12s du source, 8s total). **C'est le segment retenu pour le Test 1 et Test 2 Soundjata vs Soumaoro (2026-04-13)**.

Pourquoi ce segment : action dense sans temps mort (rush -> clash -> close-ups -> retour stance), multi-angles camera, parfait pour transfert de choregraphie.

## Tests valides avec ces refs

### Test 1 (2026-04-13) — Soundjata vs Soumaoro V1
- Resultat : `public/assets/library/geoafrique/soundjata/combat-tests/test-choreography-transfer-1776105175.mp4`
- Score : 8.5/10
- Issues : sabre fantome sur Soumaoro a ~7.5s, expressions faciales plates

### Test 2 (2026-04-13) — Soundjata vs Soumaoro V2 (corrections appliquees)
- Resultat : `public/assets/library/geoafrique/soundjata/combat-tests/test-choreography-v2-1776106128.mp4`
- Score : 9.5/10
- Ameliorations : sabre fantome resolu, expressions faciales intenses, tempo ~2x plus rapide (bonus)
- Seul gotcha restant : micro-artefact sabre flicker pendant le recul de Soundjata (invisible pour spectateur normal)

## Documentation

Voir `memory/motion-reference-transfer.md` (auto-memory) pour le pipeline complet, gotchas, et leviers de controle du tempo.

## Reutilisation future

Cette ref choregraphie + ce segment B seront reutilises pour les vraies scenes scenarisees des Heros Oublies (combat Soundjata vs Soumaoro dans le script ou autres combats 1-vs-1).
