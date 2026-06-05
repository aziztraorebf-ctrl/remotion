# DECODE — "Day-by-Day War Map" (genre mapsinanutshell)

> Decode du 2026-06-05 a la demande d'Aziz. Format YouTube : carte (Google Earth) + front colore qui avance jour par jour + compteur de date + compteurs pertes/territoire + musique epique + extraits de discours. Objectif : comprendre le genre, l'ecosysteme, la faisabilite chez nous comme PILIER LEGER RECURRENT (pas niche principale, mais variete a glisser entre nos videos premium).

## 1. Le genre (nom officiel + ecosysteme)

- Nom : **"every day of the war"** / **"territorial control timelapse"** / **"map timelapse"**. Communaute = **"mapping community"** (subreddit r/mapping, alt-history sur alternatehistory.com, Discord nombreux, ~260k "mappers" auto-estimes).
- **Pionnier** : EmperorTigerstar (~548k abos, depuis 2009). Sa "WW2 in Europe: Every Day" = ~17M vues = video fondatrice du genre.
- **Reference actuelle Google Earth 3D** : mapsinanutshell (~382k abos) — celle qu'Aziz regardait.
- **Branche premium** : The Operations Room (~1.4M abos, battle animations 15-30min, AE + GEOlayers).
- Autres : Ollie Bye, THETI Mapping, Kaiser Cat Cinema (alt-history), + des milliers de petits mappers.

## 2. Sous-genres (du + viral au - viral)

1. **"Every day of the war"** (front qui bouge) = LE plus viral. Sature sur Ukraine/WW2. **Soudan + conflits africains SOUS-EXPLOITES** = angle differenciant pour Kora & Cartes.
2. **"Year-by-year empires"** (Rome, Mongols) = meilleur fond de catalogue evergreen, moins de pics.
3. **Alt-history / uchronie** (WW3, "what if") = enorme en volume createurs.
4. Election maps / borders timelapse = niches plus petites.

## 3. Ce que la communaute cherche

- Lisibilite du MOUVEMENT (front avance/recule jour par jour = la dopamine du genre).
- Exhaustivite affichee dans le titre : **"Every Day"** / "every single day" = argument de clic recurrent.
- Sujets chauds : Ukraine, Gaza, Soudan, + WW2 evergreen. Commentaires tres actifs (watch-time + CPM).

## 4. CADENCE MESUREE (frames reelles, video Liban 60s)

- Video 60s couvre ~18 mois reels (oct 2024 -> avr 2026).
- **~28 jours reels par seconde de video (~1 mois/sec), lineaire constante.**
- Compteur date format `YYYY.MM.DD` haut-droite + horloge HH:MM:SS cosmetique (sentiment "temps reel").
- Layout : carte plein cadre, **compteur "Casualties" haut-gauche** (2 drapeaux + chiffres montants), **nombres de pertes flottants poses sur les zones** (rouge=attaquant, bleu=defenseur), **vignette discours video** haut-droite. Resolution 1280x720@60fps (upscale d'un GES 4096 max).

## 5. Pipeline reel du genre (2 ecoles, vu via recherche)

- **Ecole A (dominante pro)** : After Effects + plugin **GEOlayers 3** (~$200) qui fait entrer des tuiles Mapbox Satellite/Bing dans AE. Polygones de front = shape layers AE dessines a la main, avance = keyframes de path. Date/pertes = calques texte.
- **Ecole B (look Google Earth 3D)** : **Google Earth Studio** (GRATUIT, 4096x2304 max, export = sequence PNG pas video, keyframes camera, **3D Camera Export** vers AE pour coller les polygones au sol 3D). C'est l'ecole de mapsinanutshell.
- Donnee front (OSINT) : **ISW** (gratuit), **DeepStateMap.live** (le + cite Ukraine, PAS de download), **LiveUAmap** (GeoJSON/KML payant ~$85/an = seule source directement exploitable en pipeline). Sinon : retracage manuel du polygone par date depuis captures ISW.

## 6. FAISABILITE CHEZ NOUS (Remotion + Mapbox frame-driven) — OUI, superieur sur la rigueur

Notre stack reproduit ce format SANS Google Earth Studio ni AE, et de facon data-driven (zero retracage manuel) :
- **Fond** : Mapbox Satellite (V1 validee, voir backlog-ameliorations-mapbox-satellite.md). Gotcha headless : GPU off -> `preserveDrawingBuffer:true` + Remotion `--gl=angle`.
- **Front anime** : GeoJSON 1 polygone par date-jalon -> interpolation temporelle entre jalons (turf.js). `useCurrentFrame` -> date courante -> polygone interpole. Frame-driven = doctrine Souverain deja en place.
- **Date + pertes** : overlay DOM/SVG frame-driven trivial (briques HERO DATA / countUp existent).
- **Rendu MP4** : exemple officiel remotion-dev/mapbox-example. Nos scripts render-mapbox.sh / render-on-vercel.py.
- **Personne ne fait ce sous-genre en code aujourd'hui** (tous sur AE+GEOlayers manuel) = niche technique vide ou notre archi est exactement la bonne.
- Seul sacrifice vs GES : le survol 3D terrain "cinematique" Google Earth (Mapbox terrain 3D existe mais imagerie inferieure). Acceptable.

## 7. Monetisation observee

- **Seuil 8min = mid-rolls** (la video Ukraine fait 8min09 EXPRES ; les 1-2min Liban/Soudan = produits d'appel acquisition). Operations Room va 15-30min pour max mid-rolls.
- CPM geopolitique eleve ~$8-20 (RPM reel ~$4 apres skips). Patreon = pilier recurrent confirme partout. Sponsoring ~$500-2000/video a 50k abos.
- Modele complet = court (acquisition) + long 8min+ (monetisation) + Patreon (recurrent).

## 8. Pourquoi c'est interessant pour Kora & Cartes (lecture Aziz validee)

- Leur fosse = la DONNEE (OSINT jour par jour fastidieux), PAS le visuel -> 50 clones se cannibalisent. Notre fosse = visuel premium inimitable.
- **Idee Aziz** : format LEGER RECURRENT a glisser entre nos videos premium. Bonus : notre VARIETE de sujets (eco/geopo Afrique) evite l'effet repetitif qui plombe les chaines mono-format. Angle africain (Soudan, RDC, Sahel) sous-exploite dans ce genre.
- Brique mentale deja la : carrousel Good News data-driven (contenu dans un fichier, tout en derive) = meme philosophie qu'un format day-by-day.

## Sources cles
- mapsinanutshell youtube.com/@mapsinanutshell · EmperorTigerstar (Wikitubia) · Operations Room (vidiq stats)
- Google Earth Studio google.com/earth/studio · GEOlayers aescripts.com/geolayers
- ISW understandingwar.org · DeepStateMap.live · LiveUAmap (GeoJSON payant)
- Remotion Maps remotion.dev/docs/maps · remotion-dev/mapbox-example
- Communaute : r/mapping · The Mapping Wiki mappingwiki.org
