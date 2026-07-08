# Short "L'AES en 90 secondes" — PRODUCTION (session 2026-07-08, CONCLUANTE)

> Vidéo complète 92s produite et validée VISUELLEMENT par Aziz. Reste : musique + SFX (prochaine session).
> Livrable : `out/episodes/warmap-sahel/aes-short-90s-FINAL.mp4` · catbox https://files.catbox.moe/8ms702.mp4

## CE QUI EST FAIT (validé)
Carte vivante d3-geo PUR (zéro Mapbox), fond navy quadrillé, 9:16 vertical, 92s. Registre totalement
différent de la vidéo longue (qui est Mapbox) MAIS qui s'y raccorde — style qu'on maîtrise. Passage de
plusieurs échecs (2026-07-07) à une vidéo qui coule et fait sens.

Narratif (calé sur Whisper réel `src/projects/warmap/_shared/whisper-words-short-90s.ts`, audio
`public/_shared/audio/sahel-warmap/short-90s-v1.mp3`, 91.86s) :
- **Part1 (0-36s)** : ouverture Afrique se dessine→dissout→Sahel · trio se trace (contours colorés) ·
  rupture alliances CEDEAO (ghost borders) · Libye s'effondre 2012 (drapeau→gris) · contagion nord-Mali ·
  France/ONU villes tenues vs campagnes (hachures rouge) · extension du rouge.
- **Part2 (36-92s)** : LIBYE RETIRÉE, caméra recentrée/zoomée sur le trio (plus gros/lisible) · coups
  d'État (pictos militaires étoile, ordre chrono Mali→Burkina→Niger) · menace CEDEAO · FRACTURE trio/CEDEAO ·
  naissance AES = CLIMAX (bandes de drapeau SVG clippées + sceau qui disparaît après) · ressources (icônes
  lingot or/atome uranium/goutte pétrole) · count-up 60 ans (grand sur la carte) · CTA sur la carte (Kidal).

## FICHIERS CODE (`src/projects/warmap/shorts/aes-short-90s/`)
- `AesShortFull.tsx` — composition COMPLÈTE 92s (`AES-Short-Full`) : Part1+Part2 + audio unique + crossfade 36s.
- `AesShortPart1.tsx` (`AES-Short-Part1`, 0-36s) · `AesShortPart2.tsx` (`AES-Short-Part2`, 36-92s, timings
  absolus décalés de T_OFFSET=36s, prop noAudio).
- `aesGeo.ts` — projection d3-geo fixe (trio+Libye), `getCamera` (Part1 : zoom trio→dézoom Libye),
  `getTrioCamera` (Part2 : trio zoomé fixe). Rings réels depuis `warmap/parties/sahelCountries.ts`.
- `AfriqueOpening.tsx` — le continent qui se trace (ouverture). `SubtitlesWordByWord.tsx` — sous-titres
  phrases courtes karaoké (réutilise `buildDisplayWords` de cacao-chocolat).
- Inserts `LiptakoRevealSVG9x16` / `ResourcesRevealSVG9x16` / `CtaCard` : FINALEMENT PAS UTILISÉS (tout
  recodé nativement dans la carte). Gardés en référence, pas branchés dans Full. Peuvent être archivés.
- SUPPRIMÉS ce jour (protos/tests jetables) : `ProtoCadrageLibye.tsx`, `TestMilitaireMarker.tsx` + leurs compos Root.

## ⛔ RESTE À FAIRE (prochaine session) — 2 finitions AUDIO
1. **MUSIQUE** : reprendre la musique de la vidéo LONGUE War-Map AES (ne pas régénérer). Chercher le fichier
   musique dans `out/PRET-PUBLICATION/` / assets de la vidéo longue (`warmap-sahel-aes-FINAL`).
2. **SFX** : aucun son actuellement (que la narration). Ajouter ping/ding sur apparitions d'éléments
   (`public/_shared/sfx/camera/sfx-map-ping.mp3`, `_shared/sfx/ui/node-appear.mp3` déjà utilisés par les
   inserts Liptako/Resources) + 1-2 SFX bien placés (impact sur fracture, whoosh sur naissance AES).
3. (mineur) Vérifier la LUMINOSITÉ au soleil — éclaircie ce jour (NAVY_DEEP #141f3c, NAVY_TOP #2b3f70) ;
   confirmer que ça suffit.

## LEÇONS CLÉS (compactes)
- **Itérer sur render full HD + auto-éval frames (ffmpeg extract) + catbox** = la boucle qui a marché.
  Coder par MOITIÉ (valider la 1re avant la 2e).
- **Test avant présomption** (règle projet confirmée) : portrait PNJ testé vs picto militaire à taille
  réelle → PNJ illisible à 44px, picto étoile retenu. Ne jamais dire "lisible/illisible" sans render.
- **Gemini/GPT/Kimi = SIGNAL, filtrés par jugement métier** : leurs critiques (échelle, mouvement, ghost
  borders, hachures) ont amélioré la vidéo ; MAIS refusé icônes casque bleu/tour Eiffel (illisibles 15px)
  et "faire glisser la Libye" (faux géographiquement) — validé par Aziz.
- **Bandes de drapeau SVG clippées à la bbox RÉELLE** du pays (pas taille fixe) = remplissage complet même
  sur forme allongée (Mali). Lisible à petite échelle (rect SVG > image drapeau).
- **Gestes ponctuels doivent fade-out** une fois leur panel passé (anneaux, flèche) ; seuls les ÉTATS
  durables (couleurs, ghost borders) accumulent. Sinon encombrement.
- **Retirer un élément qui a fini son rôle** (Libye en Part2) = recentrer/zoomer = plus gros/lisible, zéro
  perte narrative. Bonne intuition Aziz.
- **Dégradé de fond** : éclaircir NAVY_TOP ET NAVY_DEEP (le bas du radial), sinon le bas reste sombre.
