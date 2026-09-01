# Socle visuel DÉFINITIF — Short "L'AES en 90 secondes" (2026-07-08)

> Migré depuis auto-memory 2026-08-31. Complète `SHORT-90S-PRODUCTION-2026-07-08.md` (état de
> production) avec le détail des DÉCISIONS de socle visuel verrouillées par Aziz — ne pas refaire
> les fondations.

Short "L'AES en 90 secondes" (warmap-sahel, branche `feat/aes-short-90s-carte-vivante`). Après ~8 itérations
(V1→V7) le SOCLE VISUEL est VALIDÉ par Aziz (2026-07-08). Ne PAS refaire les fondations. Fichiers :
`src/projects/warmap/shorts/aes-short-90s/` — `AesShortPart1.tsx` (scène 1re moitié), `aesGeo.ts` (projection+caméra),
`AfriqueOpening.tsx` (ouverture continent), `SubtitlesWordByWord.tsx` (sous-titres).

## Socle validé (décisions Aziz, non négociables)

- Carte d3-geo PUR sur fond NAVY quadrillé (dégradé radial `#1c2b4a`→`#16213a`→`#101a30` + halo froid + grille `#33456b`).
- OUVERTURE : le continent africain se trace (contours ocre éclaircis `#e8d5a3` + glow, trio AES en focus lumineux)
  → zoom-in doux + les pays hors-AES s'estompent → crossfade vers la carte Sahel. PAS de hard cut.
- CAMÉRA quasi-fixe : `getCamera()` dans aesGeo — zoom trio plein écran (0-13.3s, `trioZoom` calculé) → dézoom
  à l'arrivée Libye (cadre complet) + respiration subtile MONOTONE (pas d'oscillation avant-arrière = ça agaçait Aziz).
  2 gestes motivés seulement, sinon quasi-fixe. PAS de pan/travelling permanent.
- PAYS = CONTOUR COLORÉ (couleur nationale : Mali vert `#3b9a5a`, Niger orange `#e0782e`, Burkina rouge `#d0453e`),
  INTÉRIEUR TRANSPARENT (navy visible). Fill translucide = "activation" quand on parle du pays. PAS d'aplats pleins.
- SOUS-TITRES = phrases COURTES façon cacao/GGW (2-5 mots, pause>0.42s coupe, une phrase active, mot en or).
  Réutilise `buildDisplayWords` de cacao. Corrections orthographe affichage (CDAO→CEDEAO, compagnes→campagnes,
  Nait→Naît, coup→coût). PAS de blocs de phrase entière.
- ZONES : territoire perdu = trame rouge HACHURÉE directionnelle par pays (Mali ↗ / Niger ↘ / Burkina horizontal,
  stroke 3). Villes tenues = POINTS bleus nets (îlot navy dessous) + corridor (ligne connexion). PAS d'icônes
  casque bleu/tour Eiffel (illisible à 15px — jugement métier maintenu contre Kimi, validé Aziz).
- GHOST BORDERS (Gemini) : élément détruit (lien CEDEAO) reste en pointillé fantôme, jamais opacity 0.

**Faits vérifiés** : drapeau Libye 2012 = tricolore rouge-noir-vert post-Kadhafi. "+territoire" = SYMBOLIQUE (pas de %).

**Méthode qui a marché** : itération sur render full HD → auto-évaluation frames (ffmpeg) → présentation catbox →
retours Aziz + critiques Kimi/Gemini (SIGNAL, filtrés par jugement métier). Coder par MOITIÉ (1re validée, 2e en cours).

**STATUT 2026-07-08 : VIDÉO COMPLÈTE 92s PRODUITE ET VALIDÉE (visuel) par Aziz.** Composition Remotion
`AES-Short-Full` (`AesShortFull.tsx`) = Part1 (0-36s) + Part2 (36-92s) + audio unique + crossfade 36s.
La 2e moitié a été codée NATIVEMENT dans la carte (les inserts Liptako/Resources n'ont PAS été utilisés au
final — bandes de drapeau SVG + sceau + icônes ressources recodés directement). Livrable :
`out/episodes/warmap-sahel/aes-short-90s-FINAL.mp4`.

Ajustements Part2 clés (au-delà du socle Part1) : Libye RETIRÉE en Part2 + `getTrioCamera` (trio zoomé) ·
bandes de drapeau clippées à la bbox RÉELLE du pays · picto militaire étoile (pas PNJ, testé) · icônes
ressources SVG · sceau AES qui fade après les drapeaux · gestes ponctuels (anneaux/flèche) qui fade-out.
