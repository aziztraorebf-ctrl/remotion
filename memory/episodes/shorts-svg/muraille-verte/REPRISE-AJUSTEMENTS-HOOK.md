# REPRISE — Ajustements du HOOK (prochaine session) : esthetique gravure + mouvement "se dessine"

> Cree 2026-06-22 fin de session. 2 retours MAJEURS d'Aziz sur le hook encre produit par l'agent vierge.
> Le hook FONCTIONNE (vraie carte d3-geo + arbres Gemini + 2 registres + SFX, tout commite branche feat/shorts-svg-muraille-verte)
> MAIS 2 ecarts a corriger pour atteindre la vision. Reference cible = `https://files.catbox.moe/wuar68.png` (comparatif 3 registres ORIGINAL).

## ⚠️ ECART 1 — ESTHETIQUE : l'encre de l'agent = APLAT PLAT, pas GRAVURE
L'agent a produit du vectoriel PROPRE (frontieres nettes, arbres aplats verts sur parchemin). C'est lisible/elegant MAIS
ce N'EST PAS le registre encre de la reference `wuar68.png` (panneau ENCRE droite) qui est une VRAIE GRAVURE / PLANCHE DE
NATURALISTE :
- trait d'encre ORGANIQUE, vivant, legerement irregulier (plume sur parchemin)
- HACHURES (sol, ombres) + LIGNES DE CONSTRUCTION techniques (pointilles, cotes) = rendu "carnet d'explorateur/botaniste"
- arbre DETAILLE grave (nervures feuilles, fibres racines), CHARGE de matiere au bon sens ("document d'etude")
- vs l'agent = "infographie propre" plate. Difference = gravure-naturaliste VS aplat-vectoriel.
POURQUOI l'agent a diverge : il n'avait PAS `wuar68.png` sous les yeux (erreur de brief Claude). Le registre `encre` du
generateur produit du trait propre, pas le niveau de hachure/gravure de cette ref precise.
-> PROCHAINE SESSION : redonner `wuar68.png` (panneau encre) comme IMAGE-CIBLE explicite. Pousser le registre encre vers la
   GRAVURE : hachures sur le sol/les pays, trait vivant, lignes de construction techniques, arbres graves (pas aplats).
   (Idem affiner braise vers sa ref si besoin.) NB : la ref est en vue de FACE/coupe, nous on est en top-down/iso — les
   PRINCIPES (hachure, trait grave, lignes de construction) s'appliquent quand meme.

## ⭐⭐ ECART 2 (le PLUS IMPORTANT) — MOUVEMENT : exploiter "le SVG SE DESSINE bit-by-bit, pilote par la VOIX"
Vision Aziz : la vraie PUISSANCE du SVG (vs une video IA) = chaque partie est MODULABLE et peut se DESSINER trait par trait,
synchronise a la voix. Dans la version de l'agent, la carte s'affiche d'un coup + arbres apparaissent en bloc. C'est sous-
exploite. Ce qu'on VEUT (et qui PROUVE qu'on fait du SVG) :
- la CARTE qui SE TRACE (frontieres se dessinent a l'encre, "la main qui dessine") pendant que la voix parle -> stroke-dasharray anime.
- les HACHURES du sol qui se REMPLISSENT progressivement.
- chaque ARBRE qui SE CONSTRUIT (tronc -> branches -> feuilles) sur un mot.
- les COTES / annotations techniques qui s'INSCRIVENT une par une.
Technique = `stroke-dasharray`=longueur + `stroke-dashoffset` anime L->0 (= la main qui trace), deja dans la doctrine
[[SVG-SCENES-GENERATIVES]] (grammaire "SE CONSTRUIT" / fleches tracees) mais PAS applique au hook. C'est CA notre signature.

## ORDRE PROUVE pour la prochaine session (audio-derived devenu instrument)
1. GENERER L'AUDIO (narration GeoAfrique du script v1 — lock TTS d'abord) + les SFX.
2. PUIS caler l'apparition de CHAQUE element (carte qui se trace, arbres qui se construisent, cotes qui s'inscrivent) SUR la voix,
   bit-by-bit. Tests d'apparition "doucement mais surement". C'est la ou on exploite la modularite totale (fond/arbres/carte separes).
3. Affiner l'esthetique gravure (ecart 1) en parallele.

## ETAT (rappel) — tout commite, rien perdu
- 5 commits branche `feat/shorts-svg-muraille-verte` (60a52e4, dd853f8, 684e2e7, ad5f416, effd1ae).
- Hook braise anime : `GgwD3GeoMap.tsx` (+SFX `GgwD3GeoMapSFX`). Hook encre : `GgwD3GeoMapEncre.tsx` (+SFX `GgwD3GeoMapEncreSFX`).
- Carte = `public/_shared/geo-data/ggw/ggw-countries.geojson` (11 pays). Arbres = `geminiTrees.ts` (Gemini reutilises).
- Rendus actuels (a DEPASSER) : encre+SFX 9e2vw4 · braise+SFX voafm4. Cible esthetique = wuar68.png (encre).
- ✅ TEST AGENT VIERGE REUSSI : l'agent a reproduit le hook encre du 1er coup = doctrine reproductible. Trous remontes :
  (a) pas de SFX "fletrissement organique" dedie ; (b) `loop` audio fonctionne en render headless (a graver) ; (c) l'agent
  avait besoin de l'IMAGE-CIBLE precise (wuar68) pour viser la bonne esthetique — sans elle il fait du propre-plat.

## RESTE APRES LE HOOK
Storyboard v2 (vision Aziz : B2 mort stylisee, B3 image-fausse-barree, B4 demi-lune verticale native, portraits Rinaudo/
Sawadogo N&B, B5 demultiplication, B6 outro boucle) + produire beats 2-6 dans le(s) registre(s) retenu(s) + assemblage 2 versions.
