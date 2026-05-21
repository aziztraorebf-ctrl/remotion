# Africa Eye — Sudan's Secret Hit Squads

- Source : https://youtube.com/watch?v=AuNDd_pteRQ
- Durée : 11m26 (686s) — format mobile vertical recadré dans 16:9 (cadre central + flou latéral)
- Vues : 342k
- Date : 2019 (post-révolution Omar el-Béchir)

## PALETTE — verdict 🟢

- Footage UGC mobile vertical : ocre sable + ombres dures Khartoum `#B89A75` / `#7A6242`
- Bandes latérales noires + flou (gaussian blur 30+ du même footage zoomé) : pattern signature mobile→16:9 vu frames 001-004
- Satellite Google Earth couleur (pas N&B cette fois) : tons saturés `#A0846B` (sol sableux Khartoum) — frame 005, 006
- Rouge BBC `#D0021B` : trapèzes/rectangles d'annotation (frames 005, 006). Stroke 6-8px, fill transparent OU fill 30% rouge
- Jaune `#FFD500` : ligne pointillée timeline + flèches d'annotation arabes (frame 006)
- Texte arabe : jaune `#FFD500` taille ~32-40px, sans-serif arabe simple
- "Actor's voice" : libellé blanc sans-serif italique, position bord gauche frame 006
- Attribution "Google Earth / DigitalGlobe" coin haut-droit : empilée sur 2 lignes, blanc 80% opacity

## ASSETS — verdict 🟢

OSINT richer que video 1, ajoute la dimension réseau social :
- Cadre central mobile (~720px de large dans 1280) avec flou latéral : pattern direct pour réutiliser footage UGC vertical en 16:9. Inverse parfait de notre besoin (on peut faire UGC horizontal centré dans 9:16)
- Trapèze rouge `#D0021B` stroke 6px (frame 005) : annotation de bâtiment vu du ciel — non rectangulaire, suit la perspective
- Rectangle rouge plein 30% opacity sur immeuble (frame 006)
- Flèche jaune incurvée pointant vers la cible : `<path>` SVG avec `stroke-linecap: round`, head triangulaire jaune
- Texte arabe label sur la cible : "تلاجة الموز" (le congélateur de bananes — argot pour cellule de torture)
- Timeline pointillée jaune horizontale : suite de cercles `r=3px` espacés de 12-15px sur largeur écran. Indicateur "ligne du temps"
- Pas de portraits stylisés, pas de réseau de personnages. Très sobre

## CAMÉRA — verdict 🟢

- Zoom progressif sur footage UGC déjà cropped : double-zoom (zoom du téléphone + zoom de la post-prod). Effet "on cherche le détail"
- Push-in sur satellite + révélation séquentielle des annotations : trapèze apparaît → pause 1.5s → arrow apparaît → label arabe apparaît
- Pull-out vue large quartier après identification du bâtiment : "voici où on est dans Khartoum"
- Ken burns lent sur footage témoin (frame 002) : statique mais subtle drift gauche-droite ~3px/s
- Pas de transitions glitchy, pas de speed-ramp. Très posé, didactique
- Coupe nette entre footage UGC et satellite (pas de morph)

## APPLICABILITÉ SOUVERAIN

- Trapèze rouge perspective + flèche annotation + label texte = recette directe Mapbox satellite + SVG overlay
- Cadre central + flou latéral pour recadrer footage UGC = pattern précieux INVERSE pour Souverain (footage horizontal centré dans 9:16 + flou latéral du même footage). À tester
- Timeline pointillée jaune = composant Remotion simple (boucle de Circle + animation séquentielle reveal)
- "Actor's voice" libellé = pattern d'éthique BBC pour signaler reconstitution. Souverain peut adopter (sources protégées)
- Rouge `#D0021B` + jaune `#FFD500` = palette OSINT sobre. Compatible avec notre Or Africain noir+or (le rouge BBC est le concurrent direct du gold sur fond sombre)
