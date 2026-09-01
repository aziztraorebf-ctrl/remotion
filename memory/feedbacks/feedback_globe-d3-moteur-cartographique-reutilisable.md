# Le globe D3 est un MOTEUR cartographique réutilisable, pas une scène isolée

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

Acquis majeur (2026-07-19, R&D Soudan Acte 3) — souligne par Aziz : "ca ouvre une voie cartographie
que nous n'avions pas acces avant". A traiter comme un MOTEUR reutilisable, pas une scene isolee.

**Ce que le moteur globe D3 sait faire (tout prouve en rendu)** :
- Globe orthographique frame-driven (`geoOrthographic`, socle `globeGeo.ts`), camera CONTINUE
  (`globeCamera.ts` : keyframes {frame,lon,lat,scaleMul} + interpolation easeInOut = "1 seule projection
  continue" transposee a D3, doctrine Mapbox). Raccord carte-rapprochee <-> globe = zoom scale continu.
- ARCS de flux qui SUIVENT LA COURBURE (`geoArc.ts` : `geoInterpolate` grand-cercle, clip natif derriere
  le globe) : marqueur voyageur, transformation en route (or->drone), trace fantome. = le "ressenti
  carrefour" impossible a plat (Mapbox plat "perd le spectateur" si on montre tout ensemble ; le globe
  le PERMET).
- PISTE SERPENTANTE geo-ancree (`geoArc.ts` : `windingCircle`/`windingPathD`/`pointAlongWinding`,
  2026-07-19, Acte 5) : grand-cercle geoInterpolate + ondulation SINUSOIDALE perpendiculaire (amp/waves,
  amplitude nulle aux extremites), revelable en [0..reveal] et echantillonnable pour poser un marqueur.
  = route de contrebande / corridor / flux ORGANIQUE (vs l'arc lisse). Reutilisable pour tout trajet
  clandestin sur la sphere. ⚠️ Un trace stylise propose par un LLM en SVG PLAT (GPT-5.6 Sol) n'est PAS
  collable sur un globe anime qui se reprojette frame par frame — on le prend comme SIGNAL d'intention
  graphique et on RE-DESSINE le trace geo-ancre via windingCircle (la geometrie vit en lon/lat, JAMAIS
  en path SVG fige).
- DRAPEAUX clippes dans le territoire projete (`GlobeFlagFill` : clipPath(path pays) + <image> drapeau
  local) — PLUS FACILE que Mapbox (le path EST deja la geometrie, pas de fill-pattern/sources GeoJSON).
  Assets : `public/_shared/flags/<iso>.png`. ⚠️ GARDE-FOU (2026-07-19, Acte 5) : `GlobeFlagFill` BAVE sur
  un pays MINUSCULE ou tres allonge (la bande sombre du drapeau EAU debordait hors du territoire projete).
  Petit pays / drapeau a bandes tres contrastees -> `FlagToken` (pastille RONDE ancree au centroide) au
  lieu du remplissage clippe. Regle : GlobeFlagFill = grands territoires ; FlagToken = petits pays / lisibilite.
- REACTIONS cible a l'arrivee d'un flux (combinables) : onde de choc geo-ancree + illumination/drapeau
  du territoire + objet-icone qui se materialise (hangar/dock). ⚠️ HALOS/EMBRASEMENT bavent en MER s'ils
  ne sont pas CLIPPES au territoire -> `clipPath(path pays)` obligatoire pour toute illumination/embrasement
  geo-ancre (sinon un cercle de glow deborde sur l'ocean). Lisibilite couleur sur fond kaki+bleu : un
  corridor/trace GRIS est illisible -> ROUGE franc. Cadrage trop lache -> resserrer via `scaleMul` de
  globeCamera. Ces ~5 bugs ont ete trouves par SELF-REVIEW SUR FRAMES REELLES, jamais par relecture de
  code (confirme la regle CODE+VISUEL de CLAUDE.md : juger un moteur/rendu sur frames extraites, pas sur
  le code — Aziz a du le rappeler sur l'Acte 5, le verdict s'est inverse une fois les frames vues).
- FLUX = LUMIERE (inerte) vs SPRITE (vehicule) — extension de la doctrine vehicule-glisse/objet-inerte
  (CLAUDE.md racine) aux flux sur globe : l'OR (inerte) ne "glisse" pas, il voyage comme point/flux
  LUMINEUX le long de l'arc ; le DRONE (vehicule) glisse en SPRITE oriente (angle = atan2 du trajet,
  +90deg, recette Mapbox). Regle : sur un flux, lumiere pour l'inerte, sprite oriente pour le mobile.
- JETONS = portraits (recette Mapbox `SoudanToken` : cercle parchemin + bordure faction + portrait
  clippe, overlay HTML aux coords projetees) OU disques abstraits. Portraits = coherence avec scenes
  Mapbox hotes.

**Palette de raccord (cle du melange avec Mapbox)** : theme "mixte" = terres KAKI (langage video Mapbox)
+ OCEAN BLEU (contraste terre/mer + signal "niveau mondial") + frontieres marquees premium + flux
satures (or franc chaud / drones acier-bleu froid = opposition de temperature = code or<->armes). Voir
[[d3-vitesse-iteration-vs-mapbox]] pour pourquoi D3 > Mapbox ici (iteration rapide, zero derive, render
`npx remotion render` classique sans WebGL).

**Pattern d'INTEGRATION prouve = INSERT** : on ne refait pas une video Mapbox validee. Le globe D3
remplace SEULEMENT les segments "flux internationaux/carrefour" (insert), raccorde au Mapbox par zoom-out
continu (l'objet quitte le pays = on prend de l'altitude). Ex. Soudan Acte 3 : Section 1 (interieur) reste
Mapbox, beats 3-7 (flux) = insert globe D3 [frame 1166->3773]. Audio = meme fichier FULL, portion jouee
via `startFrom` => zero re-calage. Meme logique que [[WARMAP-INSERT-SVG-ETATMAJOR]] (insert dans hote).
⚠️ FRICTION de session (2026-07-19) : Claude s'est emballe a vouloir RECODER toute la scene (interieur
Mapbox + flux) en D3 avant qu'Aziz recadre ("il ne fait pas de sens de refaire les scenes deja validees").
REFLEXE A GARDER : quand une video est deja validee/FINALE, le globe D3 ne remplace QUE le segment qui
GAGNE (les flux) — jamais toute la scene. Demander/verifier le perimetre AVANT de coder, pas recoder
l'existant qui marche. C'est le pattern [[enrichir-existant-vs-composant-partage-geometrie]] applique a
l'echelle d'une scene entiere.

**Fichiers** : `src/projects/_rnd/d3-16x9/` — `globeGeo.ts` (socle), `geoArc.ts` (arcs+coords),
`globeCamera.ts` (camera continue), `SoudanActe3GlobeProto16x9.tsx` (biblio composants exportes : THEMES,
GlobeFlagFill, DestPoint/hangar, FlagToken, ShockRing), `SoudanActe3GlobeInsert.tsx` (scene reelle).
Monde = `public/_rnd/vox-repro/countries-110m.json` (NE 110m ; 50m/10m dispo si plan rapproche).

**Quand l'utiliser** : tout sujet a FLUX INTERNATIONAUX / dependance / carrefour geopolitique (armes,
ressources, argent, migrations) ou le "vu de l'espace" fait ressentir la dimension mondiale. Voir
[[MOTEURS-VISUELS-ET-SOCLE]] (D3 n'est plus cantonne aux contours).

**CANDIDATS identifies (2026-07-19)** :
- **Acte 3 Soudan "Suivre l'or"** = candidat n°1, EN COURS (insert globe beats 3-7 fait cette session,
  branche `feat/soudan-acte3-globe-d3`). Etoile de flux multidirectionnels (or->Dubai, drones retour,
  Turquie->SAF, or->Egypte).
- **Acte 5 Soudan "Le reseau qui arme dans l'ombre"** = ✅ **FAIT + PROMU FINAL v5 (2026-07-19) — GLOBE D3
  INTEGRAL (0 Mapbox).** Chaine LINEAIRE a 3 maillons trans-continentaux : Emirats/Abou Dabi (~54E) ->
  Haftar/Kufra Libye (~23E) -> El-Fasher/Darfour (~25E, 13N). Le decoupage HYBRIDE globe/Mapbox initialement
  envisage (Beat 3 Mapbox, Beat 4 hybride...) a ete ABANDONNE au profit d'un globe INTEGRAL : 0 couture
  inter-moteurs, aucun desert vide. Le globe supprime le VIDE STRUCTUREL des ~37deg Abou Dabi<->Libye qu'une
  carte plate n'affiche qu'en desert (le code Mapbox etait FORCE de dezoomer a 3.4).
  **LEÇON de passage a l'echelle** : pour une scene NEUVE a dominante 100% flux/carrefour, viser directement
  le globe INTEGRAL, PAS le montage hybride globe/Mapbox — la couture inter-moteurs coute plus que le gain
  2D local. Le pattern INSERT (globe qui ne remplace QUE le segment flux) reste valable UNIQUEMENT quand une
  video Mapbox est DEJA VALIDEE/FINALE (cf Acte 3). Distinguer : scene neuve dominante flux -> globe integral ;
  scene Mapbox deja validee a enrichir -> insert.
  Fichiers reels : `src/projects/_rnd/d3-16x9/SoudanActe5Globe.tsx` (compo `D3-SoudanActe5-Globe`) +
  `soudanActe5GlobeTiming.ts`, moule = `SoudanActe3GlobeInsert.tsx`. Livrable :
  `out/PRET-PUBLICATION/soudan-midform/soudan-acte5-reseau-ombre-FINAL.mp4`. Branche `feat/soudan-acte5-globe`.
  Le code Mapbox `warmap/soudan-acte5/SoudanActe5.tsx` (v2) n'est PLUS le livrable (trace).
  ⚠️ Rappel structure : "verrou institutionnel UA/ONU/Quad" = ACTE 6 (a ecrire), PAS l'Acte 5.
  **Le moteur globe D3 est desormais prouve sur 2 actes (3 et 5).**

**Pattern RESPIRATION — isoler un tracé noyé sans casser la persistance (2026-07-21, Acte 4 B1-B4).** Sur un globe CONTINU où tout persiste (flux, jetons, drapeaux accumulés), un élément géographique important peut devenir illisible parce que noyé (le Nil, caché sous le drapeau égyptien + les flux). Solution SANS le sortir du globe : ouvrir une FENÊTRE de respiration de ~2-3s pilotée par un facteur `nilBreath` (0→1→tient→0) pendant laquelle (a) TOUS les flux/arcs s'effacent (`<g opacity={1-nilBreath}>` englobant), (b) le pays voisin prend le MÊME aplat crème que le pays focal (unification visuelle, le drapeau disparaît via `reveal*(1-nilBreath)`), (c) l'élément à révéler (Nil) respire seul et bien lisible, puis (d) TOUT REVIENT à l'état dense. Les jetons + géoplaques RESTENT (ancrage). Réutilisable pour tout élément qu'on veut faire "respirer" un instant (fleuve, frontière, corridor) sans rompre la persistance inter-beats. Prouvé + validé Aziz ("magnifique"). Code : `SoudanActe4B1toB4Globe.tsx` (§ RESPIRATION NIL).

**⛔ GARDE-FOU — le globe est une grammaire de FLUX, PAS de DÉFINITION (2026-07-21, CFA Beat 2).** Le globe orthographique excelle à montrer des flux/trajets/relations entre lieux (Soudan : or, armes, migrations). Mais un beat qui DÉFINIT/catégorise/dénombre ("il existe 2 zones monétaires", "voici 14 pays") n'est PAS un flux : c'est un DIAGRAMME / CARTE PLATE qui SE CONSTRUIT (carte D3 geoMercator qui se dessine, colorisation séquentielle), pas la sphère. Ne pas imposer le globe partout par réflexe "nouveau moteur puissant". Test : le beat montre-t-il quelque chose qui VOYAGE/RELIE (→ globe) ou qui SE DÉFINIT/SE RÉPARTIT (→ carte plate) ? Confirmé UNANIMEMENT par un brief 3 voix (Gemini + Kimi vidéo + Fable 5 MAX) sur CFA Beat 2 : globe abandonné, carte D3 plate retenue (la 1re version globe = démarrage mort + drapeaux qui contredisent le propos "un même principe"). Le moteur carte plate = celui du short AES (`aesGeo`/`getCamera`) transposé en 16:9. Cf [[feedback_d3-vitesse-iteration-vs-mapbox]] (carte plate) et la variante "brief de registre" dans [[DA-BRIEF-GATE]].
