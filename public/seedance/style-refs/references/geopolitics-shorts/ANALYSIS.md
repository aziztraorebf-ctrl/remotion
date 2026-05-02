# Analyse : GeoGlobeTales (YouTube Shorts)

**Date** : 2026-03-08
**Chaine** : GeoGlobeTales | 1,66M abonnes | Shorts geo-education anglophone
**Videos analysees** : 6 Shorts (Spain borders, Everest/space, Switzerland WWII, Holland/Netherlands, Korea, Gulf Stream)
**Vues** : 5.9M - 36.7M par video

---

## Statistiques

| Video | Vues | Likes | Duree |
|-------|------|-------|-------|
| Spain Strange Borders | 36.7M | 887K | 97s |
| Everest/Chimborazo | 20.8M | 522K | 84s |
| Korea Still at War | 18.4M | 449K | 88s |
| Holland vs Netherlands | 17.8M | 340K | 81s |
| Gulf Stream USA/Europe | 15.3M | 492K | 86s |
| Switzerland WWII | 5.9M | 210K | 107s |

---

## Pattern Dominant

Anomalie geographique + imagerie satellite photo-realiste + camera fly-over Google Earth Studio.
La formule : "tu crois que tu sais X → la carte te montre que tu avais tort → revele la complexite"

---

## Stack technique identifie (frames extraites)

1. **Google Earth Studio** (fond video) — imagerie satellite NASA/Maxar avec mouvements de camera programmes (zoom, plongee, rotation orbitale). Export MP4.
2. **After Effects** — composite des overlays SVG sur la video satellite :
   - Masques pays (fill couleur semi-transparent + hachures)
   - Texte blanc + ombre noire
   - Fleches jaunes animees
   - Drapeaux + connecteurs blancs
   - Lignes de mesure pointillees jaunes

---

## Ce qu'on INTEGRE (applicable a notre pipeline)

1. **Hachures SVG sur pays** : `<pattern>` SVG avec lignes diagonales, opacity 0.6. Immediatement reproductible dans Remotion.
2. **Fleches directionnelles jaunes** : `<polygon>` ou `<path>` spring-animated. Simple.
3. **Lignes de mesure pointillees** : `strokeDasharray + strokeDashoffset`. Deja dans GeoShortV2.
4. **Masque pays avec bordure blanche epaisse** : SVG path + stroke 3px blanc + fill couleur. Notre D3 le fait deja.
5. **Zoom CSS scale progressif** : on le fait avec `interpolate(frame, ...)` sur le transform.
6. **Recul orbital** : D3 `geoOrthographic` avec `rotate` anime - possible mais moins realiste.

## Ce qu'on NOTE (a tester)

1. **Hybride Earth Studio + Remotion** : importer une sequence Earth Studio comme `<Video src={staticFile("earth-studio.mp4")}>` dans Remotion, overlayer nos SVG par-dessus. Faisable, ~30 min setup par video.
2. **Format 97-107s** : leurs meilleures performances sont sur des Shorts plus longs (97s Spain = 36.7M vues). On peut aller jusqu'a 3 min sur Shorts.

## Ce qu'on REJETTE

1. **Imagerie satellite pure** : necessite Google Earth Studio + After Effects. Notre pipeline Remotion/SVG est plus rapide et plus versatile pour les sujets analytiques (Iran, Taiwan, Dollar).
2. **Ton "curiosite/emerveillement"** : leur audience cherche des "fun facts" geo. Notre positionnement est geopolitique/analytique. Ne pas copier leur ton.

---

## Comparaison avec notre style

| Critere | GeoGlobeTales | Nos Shorts |
|---------|------------|------|
| Fond | Satellite photo-realiste | D3 vectoriel stylise |
| Mouvement camera | Google Earth Studio | Zoom CSS `scale()` |
| Public cible | Curiosite geo grand public | Comprehension geopolitique |
| Production | Earth Studio + AE | Remotion pur (React/SVG) |
| Sujets | Frontieres, anomalies geo | Tensions strategiques, economie |
| Vitesse prod | Inconnu | 2-3h par Short |

---

## Verdict pour notre pipeline

Pour sujets TERRITORIAUX (frontieres, enclaves, anomalies geo) : tester le mode hybride Earth Studio + SVG overlay Remotion.
Pour sujets GEOPOLITIQUES/ANALYTIQUES (Iran, Taiwan, Dollar) : notre style D3 vectoriel est superieur - plus lisible, plus rapide, plus versatile.
