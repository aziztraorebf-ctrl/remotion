# Protos D3.js en 16:9 — R&D

> Chantier ouvert 2026-07-18 (branche `feat/d3-16x9-protos`). Objectif : elargir notre moteur D3.js
> (jusque-la utilise seulement en 9:16 sur le Short AES, cf `src/projects/warmap/shorts/aes-short-90s/`)
> au format HORIZONTAL, et prouver des formes D3 qu'on n'avait jamais faites.
>
> **Pourquoi D3 et pas Mapbox** : D3 = SVG pur, 100% deterministe, rendu image-par-image par notre code
> (aucune couche WebGL/serveur non maitrisee). Sur un globe ou une carte stylisee (contours/drapeaux/encre),
> on controle TOUT au pixel — la ou Mapbox impose WebGL headless (incompatible Remotion sans contorsions,
> cf `render-mapbox.sh`). Contrepartie : D3 ne fait pas relief satellite / labels auto comme Mapbox.

## Protos

| Compo (Root.tsx id) | Fichier | Ce que ca prouve | Statut |
|---|---|---|---|
| `D3-A1-GlobeSahel16x9` | `GlobeSahel16x9.tsx` | **Globe orthographique** `geoOrthographic` rotation frame-driven Atlantique->Sahel + clip natif hemisphere cache + graticule + halo atmospherique + illumination trio facon AES. | ✅ Valide Aziz (proto 1 "excellent", rotation fluide, controle > Mapbox). 9s. |
| `D3-A1K1-GlobeToParchemin16x9` | `GlobeToParchemin16x9.tsx` | **Raccord globe -> carte PARCHEMIN AES** : le globe bleu se "deplie" en carte plate style video LONGUE AES (fond parchemin, trio vide en creme, contours colores par pays, drapeaux plantes). Methode = 1 seule projection ortho dont on augmente le scale (zoom-in) jusqu'a courbure imperceptible + lerp palette bleu->parchemin. 13s. | ✅ Valide Aziz ("tres smooth") |
| `D3-Jetons-SahelDezoom16x9` | `SahelJetonsDezoom16x9.tsx` | **Jetons/objets ancres + mouvement + dezoom** : jeton FAMA ancre, jeton JNIM qui bouge le long d'une trajectoire (contagion), base FR iso qui s'eteint, dezoom camera scale/tx/ty. Prouve que D3 fait tout ce que faisait la video Mapbox. Fond `paper-grain`. 14s. | ✅ Prouve |
| `D3-Jetons-Comparatif16x9` | `JetonsComparatif16x9.tsx` | **Compositing pions** : buste plante (A) vs medaillon pose (B, recette Mapbox exacte) vs objet iso sans ombre (C). Prouve : compositing = identique D3/Mapbox ; regle ombre iso (feedback_jeton-iso-pas-d-ombre-externe). 8s. | ✅ Prouve + lecon gravee |
| `D3-A5-CartePanneau16x9` | `CartePanneau16x9.tsx` | **Carte + panneau data (disposition 16:9)** : carte trio gauche 60% + panneau droit 40% qui reagit (compteur 0->3 coups, frise chrono, barre population). Impossible en 9:16. 11s. | ✅ Prouve |
| `D3-ForceNetwork-Proto16x9` | `ForceNetworkProto16x9.tsx` | **Reseau de force `d3-force` VIVANT** : noeuds d'acteurs (SAF/RSF/Or/Emirats/Egypte/Population) relies par forces physiques. DEUX layouts cuits (AVANT/APRES) -> le reseau SE RECOMPOSE physiquement quand le lien pivot Emirats->RSF s'active (triangle RSF-Or-Emirats + fracture SAF-RSF rouge). Noeuds premium (radial+anneau cisele+reflet), drift ambiant, flux dores. 100% deterministe (simulation CUITE en useMemo, zero Math.random). 13s. Reste pour usage episode : jetons-portraits dans les noeuds + SFX. | ✅ Prouve (proto V2, ref `out/_r-and-d/force-network-proto-v2.mp4`) |
| `D3-Globe2-Proto16x9` | `Globe2Proto16x9.tsx` | **GLOBE 2.0 = globe 1.0 + ce qu'il ne faisait pas** : (1) ⭐ ARCS A OCCLUSION REELLE — arc geodesique `geoInterpolate` decoupe en 60 pts, seuls les segments dont les 2 bouts sont `isVisible` sont traces -> un arc venant de la face cachee (source a l'oppose du globe) PASSE DERRIERE la sphere (segment coupe), respecte le volume 3D. (2) villes qui s'allument (masquees cote cache). (3) terminateur jour/nuit qui derive. (4) rotation frame-driven + tilt. Deterministe (D3 pur). 14s. Reste pour episode : jetons-portraits sur villes + SFX + terminateur plus marque. | ✅ Prouve (ref `out/_r-and-d/globe2-proto.mp4`) |
| `D3-PieMorph-Proto16x9` | `PieMorphProto16x9.tsx` | **Camembert/donut `d3-shape` + morphing** : donut qui se dessine (balayage d'angle), part qui se detache + compteur % central, puis transformation donut->barres empilees proportionnelles (labels). ⚠️ Le "morph" est un CROSS-FADE entre 2 formes (donut s'efface / barres apparaissent), PAS un morph geometrique continu (arc qui se deroule en rectangle) — lisible mais un vrai morph continu = proto dedie (interpolation de paths d3). Deterministe. 10s. | ✅ Prouve (cross-fade ; ref `out/_r-and-d/pie-morph-proto.mp4`) |
| `D3-Chartogram-Proto16x9` | `ChartogramProto16x9.tsx` | ⭐⭐ **CHARTOGRAM = VRAI morphing GEOGRAPHIQUE** (le vrai, PAS le cross-fade du PieMorph). Le CONTOUR REEL d'un pays (polygone D3 `geoMercator`) SE DEFORME point-a-point en une barre proportionnelle a sa donnee -> "la carte DEVIENT la donnee". Methode : reechantillonner contour + barre au meme N (200) pts equidistants (perimetre), aligner point de depart (min-dist), lerp point-a-point. Deterministe. 10s. Rare (personne en vulga FR). Suite naturelle = CARTOGRAMME (redimensionner le pays selon la valeur). ⚠️ qq filaments pendent pendant le morph (frontiere sud decoupee) — lissable. | ✅ Prouve (ref `out/_r-and-d/chartogram-proto.mp4`) |
| `D3-Sankey-Proto16x9` | `SankeyProto16x9.tsx` | **SANKEY (`d3-sankey`)** : flux ramifies en rubans EPAIS proportionnels. Or Darfour+Est -> Khartoum (hub) -> Dubai (gros)/Marches/Local ; epaisseur = tonnage. Rend QUANTITATIF ce que l'Acte 3 dit avec un arc simple. Rubans se revelent + gouttes circulent. Deterministe (layout cuit useMemo). 10s. ⚠️ rubans post-hub gris neutres — colorer par destination = plus premium. | ✅ Prouve (ref `out/_r-and-d/sankey-proto.mp4`) |
| `D3-Cartogram-Proto16x9` | `CartogramProto16x9.tsx` | **CARTOGRAMME** : chaque PAYS REEL redimensionne (scale autour du centroide) selon sa valeur, contour geographique garde. Soudan enfle (11M deplaces), UAE minuscule devient enorme (or importe) -> "le petit Emirat pese plus lourd que le pays qu'il alimente". Choquant/memorable. Carto PURE (moitie forte de D3). Deterministe. 10s. ⚠️ DEFAUT STRUCTUREL du procede : quand 2 pays enflent l'un vers l'autre ils se CHEVAUCHENT (UAE recouvre le label Soudan) — a regler (ecartement du centroide en enflant, ou 1 pays a la fois) avant usage episode. | ✅ Concept prouve, exec a affiner (ref `out/_r-and-d/cartogram-proto.mp4`) |
| `D3-SplitScreen-Proto16x9` | `SplitScreenProto16x9.tsx` | **SPLIT-SCREEN generalise** (extension de `CartePanneau16x9`) : GAUCHE 60% = scene SVG vivante (cargo maquette qui tangue sur mer de nuit + vagues sin) ; DROITE 40% = panneau data epure HTML/CSS qui SE CONSTRUIT (titre, chiffre-cle qui monte, liste d'etapes qui s'allument, barre chargement). Prouve : scene narrative gauche + analytique data droite cohabitent, epures, 1 palette. Applicable Soudan (scene or gauche + chiffres droite). ⚠️ petit chevauchement liste/label a regler (timing). 10s. | ✅ Prouve (ref `out/_r-and-d/split-screen-proto.mp4`) |

## Socle partage

- `globeGeo.ts` — decode le monde Natural Earth 110m (`public/_rnd/vox-repro/countries-110m.json`, TopoJSON,
  objects countries+land) via `topojson-client`, expose : features monde, graticule, `orthoAt(lambda,phi)`
  (projection ortho pour une rotation donnee), helper `isVisible` (face visible d'un point pour labels).
  Cible Sahel = centroide moyen Mali+Niger+Burkina.

## Palette AES longue (reference, extraite du code `warmap/parties/`)

- Terre parchemin clair (trio vide) : `#F5EFD6` · Ocean : `#C8D9E0` · Encre contours : `#3A2A18`
- Contours colores par pays (video longue) : Mali orange, Burkina rouge, Niger vert/turquoise.

## A venir (decides, pas encore codes)

- **A5** — carte a gauche + panneau data anime a droite (disposition 16:9 signature, impossible en 9:16).
- ~~**A2** — reseau de force `d3-force`~~ ✅ FAIT (proto V2 ci-dessus). CORRECTION : `d3-force`, `d3-sankey`, `d3-shape` SONT installes (verifie 2026-07-20, node_modules). L'ancienne note "PAS installe" etait FAUSSE. Methode retenue = simulation CUITE en useMemo (2 layouts pre-calcules), pas de sim live (deterministe).

> Idees completes (A1-A7 sur 3 axes) + decisions : `memory/NEXT-ACTION.md` § R&D D3 en 16:9.
