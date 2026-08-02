# Gazoduc Acte 1 (Hook) — Breakdown technique

> Transcrit le storyboard/DA-brief validé (`SYNTHESE-DA-BRIEF-ACTE1.md`) en plan de code. Ne crée rien de
> nouveau — la direction est déjà tranchée. Format adapté du § FORMAT DU BREAKDOWN REMOTION
> (`SOUVERAIN-REMOTION-PLAYBOOK.md`) au cas globe D3 : `cam_key` remplace `anim` (keyframes lon/lat/scaleMul
> au lieu de spring générique), le reste du schéma est identique en esprit.

## Socle technique (vérifié dans le code réel, pas supposé)

- Base : copie de `src/projects/_rnd/d3-16x9/Globe2Proto16x9.tsx` → nouveau fichier
  `src/projects/souverain/gazoduc-aagp-tsgp/GazoducActe1Hook.tsx`.
- Caméra continue : `camAt(keys, frame)` de `globeCamera.ts` (vérifié : `src/projects/_rnd/d3-16x9/globeCamera.ts`,
  exporte `CamKey`, `camAt`). `globeR = GLOBE_R * cam.scaleMul` ; `orthoAt(rotLambda, rotLat).scale(globeR)`
  (pattern vérifié dans `SoudanActe5Globe.tsx:137-138`).
- Occlusion réelle des arcs : logique `arcSegments()` du proto (déjà dans `Globe2Proto16x9.tsx:120-145`),
  réutilisée telle quelle (test `isVisible` par segment, `geoInterpolate`).
- Starfield : porté de `GlobeRecitProto.tsx:216-229` (PRNG seed=42, 140 pts, `#F4ECD2`) — GARDER cette
  couleur/seed pour cohérence de charte (DA-brief proposait `#b8c4d4`, écarté au profit de la continuité
  inter-vidéos, cf synthèse § "reste à trancher").
- Drapeaux : `GlobeFlagFill`/`FlagToken` (vérifiés dans `SoudanActe3GlobeProto16x9.tsx:27` et `:249`).
- Coordonnées géo : calculées depuis NOTRE GeoJSON réel (`public/_rnd/vox-repro/countries-110m.json`,
  centroïdes `d3.geoCentroid`, pas inventées) :
  - Nigeria (centroïde pays) : `[7.99, 9.54]`
  - Point source précis (delta du Niger, embouchure golfe de Guinée) : `[6.5, 5.0]`
  - Maroc (centroïde) : `[-8.69, 29.82]`
  - Algérie (centroïde) : `[2.61, 28.09]`
  - Niger (pays, centroïde) : `[9.27, 17.34]`
  - Mauritanie (centroïde) : `[-10.35, 20.18]`
  - Sierra Leone (centroïde, lieu de signature AAGP — mentionné Acte 2 seulement) : `[-11.80, 8.53]`
  - Pays du tracé côtier disponibles dans le GeoJSON pour drapeaux séquentiels : Nigeria, Bénin, Togo,
    Ghana, Côte d'Ivoire, Liberia, Sierra Leone, Guinée, Guinée-Bissau, Gambie, Sénégal, Mauritanie, Maroc.
- Nouveau fichier de coordonnées à créer : `src/projects/souverain/gazoduc-aagp-tsgp/gazoducGeo.ts` (même
  pattern que `GEO` dans `geoArc.ts`), pour ne pas polluer le fichier partagé Soudan avec des points
  spécifiques à cet épisode.

## `forbid` (rappel garde-fous, valable sur tout l'acte)

`CSS transition`, `setTimeout`, `@keyframes`, `requestAnimationFrame`, `filter:blur`/glow CSS, easing
linéaire, split-screen (2 vues juxtaposées), sprite orienté pour le gaz (c'est un flux inerte = lumière, pas
un véhicule), rouge en aplat plein, texte redondant avec la voix (seule exception : "UN SEUL").

## ⛔ CORRECTIF POST-RENDU (2026-08-02, test frames réelles) — occlusion pivot ABANDONNÉE

Le DA-brief upstream promettait l'occlusion réelle comme "moment fort" du pivot 54.9s-70.78s (AAGP
disparaît derrière l'horizon pendant que TSGP émerge, et inversement). **Testé en rendu réel : ne se
déclenche JAMAIS.** Calcul de distance angulaire (loi des cosinus sphérique) : Maroc↔Algérie ne sont qu'à
**10° d'écart**, très en-deçà des 90° nécessaires pour qu'un point passe derrière l'horizon d'un globe
orthographique. Recherche exhaustive sur toute la sphère (pas d'intuition) : impossible de trouver un
centre caméra qui garde Nigeria (source) visible ET cache un des deux tracés — le meilleur compromis
possible plafonne à 59° d'écart, jamais 90°. Détail complet : `feedback_occlusion-globe-verifier-distance-
angulaire-avant-promettre.md` (mémoire, nouvelle leçon générique pour tout futur DA-brief globe D3).

**Remplacé par** : un facteur `aagpFocus`/`tsgpFocus` (opacité 1.0↔0.35, jamais 0) qui fait du tracé "hors
focus narratif" un trait discret mais jamais invisible, combiné au contraste de style déjà prévu
(plein/lent AAGP vs pointillé/rapide TSGP) et au mouvement caméra marqué. Testé en rendu réel (frame 2050,
pivot TSGP en cours) : le contraste se lit bien à l'image. Le code d'occlusion (`visibleSegments`/
`isVisible`) reste dans le fichier — il continue de fonctionner correctement, simplement il ne se
déclenche pas sur ce trio de points précis ; il pourrait s'activer naturellement si le globe adopte un
jour un cadrage plus large qui frôle réellement l'horizon.

## ⛔ CORRECTIF POST-REVUE (2026-08-02, question Aziz avant code) — 2 trous comblés

1. **Pays qui s'illuminent en CASCADE, jamais tous en un bloc statique.** Le proto `Globe2Proto16x9.tsx`
   dessine tous les pays du monde en un seul `features.map` figé (highlight unique en dur type `isSudan`).
   Ce N'EST PAS le mécanisme dynamique attendu. Le VRAI pattern prouvé (vérifié `SoudanActe4B1toB4Globe.tsx`
   lignes 391-457, `SoudanActe6Globe.tsx`) : un `xxxReveal = interpolate(frame, [T.xxxNomme, T.xxxNomme+22],
   [0,1], clampB)` PAR pays, appliqué à `fillOpacity`/`stroke` de CE pays précis, déclenché au frame exact où
   la voix le nomme — jamais un highlight statique appliqué d'un coup. **Appliqué ci-dessous à Nigeria
   (état 2), Maroc/Algérie (état 5 au split), et aux pays du tracé côtier (état 9)** — chaque `xxxReveal` a
   son propre frame de déclenchement, pas un bloc unique.
2. **Aucun segment caméra sans keyframe > 5-6s, SAUF 3 respirations narrativement voulues.** Les gaps entre
   `cam_key` initiaux dépassaient par endroits 8-9s, reproduisant exactement le défaut corrigé tardivement
   sur Soudan ("phases sur le globe trop statiques", cf `feedback_globe-d3-moteur-cartographique-reutilisable.md`).
   **Keyframes resserrées** partout SAUF 3 segments identifiés comme pauses narratives explicites par le
   DA-brief (Kimi + DeepSeek, convergents) : état 4→5 (7.0s, pendant les 3 "MÊME" — la caméra doit rester
   quasi fixe pour que les pulses soient lisibles) ; état 8→9 (5.5s, "respiration avant le moment fort",
   digestion narrative avant le pivot AAGP/TSGP) ; état 11→12 (6.0s, silence après "UN SEUL" avant la
   clôture). **Ces 3 segments restent couverts par le `driftLon` permanent** (jamais un vrai arrêt total,
   juste un ralentissement du rythme des keyframes) — ce ne sont PAS des oublis, ce sont des choix narratifs
   tracés, à distinguer d'un plateau accidentel. Tout le reste de l'acte : aucun écart >5s.

## Continuité

`continuite_avec` : aucun (premier acte de la vidéo, pas de raccord entrant). Sortie : raccord vers l'Acte 2
(scène-lieu narrative 2016) — dernière frame de l'Acte 1 doit permettre un fondu propre, pas de position
caméra extrême qui casserait la transition (éviter un `scaleMul` très bas en toute fin si l'Acte 2 ouvre
resserré — à vérifier une fois l'Acte 2 breakdown fait).

---

## ÉTATS (pivots = mots-clés porteurs du script, alignement forcé narration.mp3)

### État 1 — Ouverture, le globe est là
- `frames`: "0-126" (0.12s→4.20s, marge +qq frames avant le mot suivant)
- `intention_etat`: "Le spectateur atterrit dans l'espace. Un globe vivant, pas une carte plate — l'échelle est immédiatement planétaire."
- `forme_connue`: "Globe2Proto16x9 (fond spatial + sphère + starfield porté) + globeCamera camAt"
- `forme_verifiee`: "src/projects/_rnd/d3-16x9/Globe2Proto16x9.tsx ; src/projects/_rnd/d3-16x9/globeCamera.ts"
- `forme_couvre_tout`: true
- `cam_key`: {frame: 0, lon: 15, lat: 5, scaleMul: 1.4}
- `cout_estime`: "trivial"
- `fallback_si_echec`: "vue large fixe sans dérive si le drift casse le rendu"
- `sync_voix`: "Imaginez"
- `sfx`: [{"at": 0, "type": "ambiance-spatiale-douce", "gain": 0.55}]

### État 2 — Zoom source (Nigeria)
- `frames`: "126-343" (4.20s→11.46s)
- `intention_etat`: "On identifie le lieu et le produit : le Nigeria, ses réserves de gaz. La pastille source s'installe comme l'ancrage visuel de tout l'acte. Le territoire nigérian s'illumine — pas juste une pastille, le PAYS lui-même prend vie."
- `forme_connue`: "camAt keyframe + pastille spring (pattern CITIES du proto) + FlagToken Nigeria + nigeriaReveal (fillOpacity du path Nigeria)"
- `forme_verifiee`: "Globe2Proto16x9.tsx:275-308 (pattern CITIES/pastille+halo) ; SoudanActe3GlobeProto16x9.tsx:249 (FlagToken) ; SoudanActe4B1toB4Globe.tsx:391-457 (pattern xxxReveal par pays nommé)"
- `forme_couvre_tout`: true
- `cam_key_sequence`: [
    {frame: 126, lon: 8, lat: 8, scaleMul: 1.9},
    {frame: 240, lon: 6.5, lat: 5, scaleMul: 2.5},
    {frame: 343, lon: 6.5, lat: 5, scaleMul: 2.5}
  ]
- `nigeriaReveal`: "interpolate(frame, [126, 126+22], [0,1]) — fillOpacity path Nigeria, teinte légèrement plus claire que COL.land (pas une nouvelle couleur, une variante de la même famille kaki, cf parade AI-slop 'sapin de Noël')"
- `cout_estime`: "ajustement"
- `fallback_si_echec`: "pastille seule sans FlagToken si le clip du petit territoire bave"
- `sync_voix`: "réserves du Nigeria"
- `sfx`: []

### État 3 — Pivot vers l'Europe, arc unique symbolique
- `frames`: "343-634" (12.54s→21.14s)
- `intention_etat`: "Le lien commercial s'établit : un seul trait lumineux relie le Nigeria à l'Europe. On comprend la relation avant de comprendre qu'il y a 2 projets."
- `forme_connue`: "arc géodésique unique (greatCircle/arcSegments) + flux lumineux dashoffset"
- `forme_verifiee`: "geoArc.ts:20 (greatCircle) ; Globe2Proto16x9.tsx:232-273 (pattern FLUX + flow dashoffset)"
- `forme_couvre_tout`: true
- `cam_key_sequence`: [
    {frame: 343, lon: 6.5, lat: 5, scaleMul: 2.5},
    {frame: 490, lon: 5, lat: 20, scaleMul: 2.1},
    {frame: 634, lon: 5, lat: 30, scaleMul: 1.9}
  ]
- `cout_estime`: "ajustement"
- `fallback_si_echec`: "arc statique sans flux animé si le rythme de dashoffset distrait"
- `sync_voix`: "marché européen"
- `sfx`: []

### État 4 — Emphase "MÊME/MÊME/MÊME"
- `frames`: "634-845" (22.44s→28.18s)
- `intention_etat`: "Insistance rythmique : 3 pulses synchronisés sur les 3 'MÊME', pas de nouveau geste graphique — la caméra respire, l'arc et les 2 pastilles (source+destination) pulsent en écho."
- `forme_connue`: "pulse opacité/scale sur pastilles existantes (spring répété), pas de nouvel élément"
- `forme_verifiee`: "pattern pulse déjà dans Globe2Proto16x9.tsx:286 (Math.sin(frame/8+i))"
- `forme_couvre_tout`: true
- `cam_key`: {frame: 634, lon: 5, lat: 30, scaleMul: 2.0}
- `cout_estime`: "trivial"
- `fallback_si_echec`: "n/a — pattern déjà prouvé"
- `sync_voix`: "MÊME point / MÊME destination / MÊME urgence" (3 pulses distincts, un par mot)
- `sfx`: [{"at": 634, "type": "pulse-doux", "gain": 0.50}]

### État 5 — Le split (rupture narrative)
- `frames`: "845-988" (29.30s→32.94s, + prolongement jusqu'à 38.14s pour la divergence complète)
- `intention_etat`: "La rupture : l'arc unique se scinde en deux tracés distincts qui divergent. C'est le pivot narratif de tout le hook — 'ces deux projets ne se parlent pas'."
- `forme_connue`: null
- `forme_verifiee`: null
- `forme_couvre_tout`: false
- `ce_qui_manque`: "Interpolation de chemin (morphing) d'un arc unique vers 2 arcs distincts sur ~20 frames — PAS dans le proto existant, à coder. Mécanisme : au frame de split, calculer 2 `arcSegments()` cibles (AAGP: Nigeria→Maroc en suivant grossièrement la côte via un point de contrôle intermédiaire ; TSGP: Nigeria→Algérie quasi rectiligne), et interpoler chaque point de l'arc unique vers le point correspondant du nouvel arc (lerp lon/lat sur ~20 frames avec easeInOut)."
- `si_nouveau`: "L'arc unique existant (état 3) sert de état de départ ; 2 arcs cibles calculés avec greatCircle() vers Maroc et Algérie ; interpolation point-par-point (même nombre de samples) entre l'arc source et chaque arc cible, poids 0→1 sur 20 frames. Après le split, AAGP = trait plein `#e8b44a`, TSGP = trait pointillé `#ffe39a` dasharray 6-4 (différenciation immédiate par style, cf DA-brief convergence)."
- `marocReveal`/`algerieReveal`: "interpolate(frame, [988, 988+22], [0,1]) chacun, déclenchés au même frame (988, juste après le split) — les 2 pays cibles s'illuminent en MIROIR, jamais l'un avant l'autre (symétrie de traitement Maroc/Algérie, cf charte neutre)"
- `cam_key_sequence`: [
    {frame: 845, lon: 5, lat: 15, scaleMul: 2.0},
    {frame: 920, lon: 6, lat: 17, scaleMul: 2.1},
    {frame: 988, lon: 8, lat: 19, scaleMul: 2.2}
  ]
- `cout_estime`: "proto-rnd"
- `fallback_si_echec`: "split instantané (cross-fade opacité arc unique→2 arcs sur 10 frames) si le morphing point-par-point est trop coûteux à stabiliser visuellement"
- `sync_voix`: "ne se parlent pas"
- `sfx`: [{"at": 845, "type": "split-whoosh-discret", "gain": 0.52}]

### État 6 — Divergence mesurée + tension
- `frames`: "988-1327" (34.04s→44.28s, couvre "aucun kilomètre" + "guerre silencieuse")
- `intention_etat`: "Les 2 tracés sont nettement séparés et le spectateur ressent la tension du désaccord — pas de conflit ouvert, une tension silencieuse et contenue."
- `forme_connue`: "2 arcs stylés distincts (déjà créés à l'état 5) + polygone rouge semi-transparent clippé au globe (zone Sahel)"
- `forme_verifiee`: "clipPath(path pays) pattern vérifié feedback_globe-d3-moteur-cartographique-reutilisable.md (halos/embrasement doivent être clippés au territoire, sinon débordent en mer)"
- `forme_couvre_tout`: true
- `cam_key_sequence`: [
    {frame: 988, lon: 8, lat: 19, scaleMul: 2.2},
    {frame: 1080, lon: 9, lat: 20, scaleMul: 2.25},
    {frame: 1160, lon: 10, lat: 20, scaleMul: 2.3},
    {frame: 1250, lon: 9.5, lat: 19, scaleMul: 2.25}
  ]
- `cout_estime`: "ajustement"
- `fallback_si_echec`: "polygone rouge non clippé mais très réduit en taille si le clip Sahel pose problème géométrique"
- `sync_voix`: "guerre silencieuse"
- `sfx`: [{"at": 1160, "type": "tension-basse-bref", "gain": 0.50}]

### État 7 — Verdict incertain
- `frames`: "1327-1451" (44.32s→48.38s)
- `intention_etat`: "Un seul de ces deux tuyaux existera vraiment — le spectateur ressent l'enjeu binaire, sans verdict donné."
- `forme_connue`: "clignotement synchronisé des 2 flux (opacité pulse en alternance)"
- `forme_verifiee`: "pattern flow dashoffset déjà utilisé état 3/5"
- `forme_couvre_tout`: true
- `cam_key`: {frame: 1327, lon: 8, lat: 18, scaleMul: 2.1}
- `cout_estime`: "trivial"
- `fallback_si_echec`: "n/a"
- `sync_voix`: "un seul"
- `sfx`: []

### État 8 — Respiration / transition
- `frames`: "1451-1616" (49.48s→53.86s)
- `intention_etat`: "Pause narrative avant le développement — la caméra recule légèrement, rien de nouveau n'apparaît, le spectateur digère l'ampleur avant le pivot AAGP/TSGP."
- `forme_connue`: "recul caméra seul (camAt), aucun nouvel élément graphique"
- `forme_verifiee`: "n/a — juste des keyframes"
- `forme_couvre_tout`: true
- `cam_key`: {frame: 1451, lon: 8, lat: 18, scaleMul: 1.8}
- `cout_estime`: "trivial"
- `fallback_si_echec`: "n/a"
- `sync_voix`: "paris radicalement opposés"
- `sfx`: []

### État 9 — MOMENT FORT : travelling AAGP (côte)
- `frames`: "1616-1881" (54.90s→62.70s)
- `intention_etat`: "Le pari AAGP prend le premier plan : la caméra longe la côte atlantique, l'arc AAGP s'intensifie, TSGP s'estompe (occlusion réelle si la caméra passe assez près de l'horizon). Sensation de long détour international."
- `forme_connue`: "travelling camAt + arcSegments avec occlusion (test isVisible par segment) + FlagToken séquentiels sur pays traversés"
- `forme_verifiee`: "Globe2Proto16x9.tsx:120-145 (arcSegments avec occlusion) ; SoudanActe3GlobeProto16x9.tsx:249 (FlagToken)"
- `forme_couvre_tout`: true
- `cam_key_sequence`: [
    {frame: 1616, lon: 5, lat: 15, scaleMul: 2.0},
    {frame: 1690, lon: 0, lat: 17, scaleMul: 2.2},
    {frame: 1750, lon: -5, lat: 20, scaleMul: 2.4},
    {frame: 1815, lon: -8, lat: 23, scaleMul: 2.4},
    {frame: 1881, lon: -10, lat: 25, scaleMul: 2.4}
  ]
- `cout_estime`: "ajustement"
- `fallback_si_echec`: "supprimer l'occlusion sur ce segment si le passage derrière l'horizon casse la lisibilité du tracé (le tracé reste visible en continu, moins spectaculaire mais sûr)"
- `sync_voix`: "détour par la côte atlantique"
- `sfx`: [{"at": 1616, "type": "whoosh-travelling-lent", "gain": 0.55}]
- **Drapeaux limités à 6 max (DA-brief, anti-surcharge)** : Nigeria (déjà là), Bénin, Ghana, Côte d'Ivoire, Sénégal, Maroc — apparition séquentielle espacée ~0.8s (24 frames), chaque pays reçoit SON PROPRE `xxxReveal` calé sur le passage caméra à sa position (pattern identique à l'État 2, PAS un highlight en bloc) : Bénin `[1616,1640]`, Ghana `[1670,1694]`, Côte d'Ivoire `[1710,1734]`, Sénégal `[1780,1804]`, Maroc `[1850,1874]` — fondu après 3s (72 frames) chacun sauf Maroc qui reste (destination finale, cf État suivant reveal Maroc déjà actif depuis le split).

### État 10 — MOMENT FORT : pivot rapide TSGP (Sahara)
- `frames`: "1911-2123" (63.70s→70.78s)
- `intention_etat`: "Bascule vers le pari TSGP : pivot caméra continu (pas de cut) vers l'Est, AAGP disparaît par occlusion pendant que TSGP émerge de face, ligne droite à travers le Sahara. Sensation de vitesse et de risque assumé."
- `forme_connue`: "pivot camAt + arcSegments occlusion (inversé : AAGP passe derrière) + polygone rouge zone Niger + icône alerte (Lucide AlertTriangle, faisabilité déjà validée ailleurs dans le projet — 3e voie SVG/Lucide)"
- `forme_verifiee`: "même mécanisme qu'état 9, symétrique ; lucide-react déjà installé (CLAUDE.md § Config)"
- `forme_couvre_tout`: true
- `cam_key_sequence`: [
    {frame: 1911, lon: 6.5, lat: 5, scaleMul: 2.3},
    {frame: 1965, lon: 8, lat: 11, scaleMul: 2.4},
    {frame: 2020, lon: 9, lat: 17, scaleMul: 2.5},
    {frame: 2075, lon: 6, lat: 21, scaleMul: 2.35},
    {frame: 2123, lon: 3, lat: 25, scaleMul: 2.2}
  ]
- `nigerReveal`: "interpolate(frame, [1965, 1965+22], [0,1]) — territoire Niger, symétrique au traitement Bénin/Ghana côté AAGP"
- `cout_estime`: "ajustement"
- `fallback_si_echec`: "icône Lucide remplacée par simple pastille rouge pulsante si l'intégration casse le style"
- `sync_voix`: "tracé droit à travers le Sahara"
- `sfx`: [{"at": 1911, "type": "whoosh-pivot-rapide", "gain": 0.58}]

### État 11 — Duel / verdict binaire
- `frames`: "2166-2302" (72.22s→76.72s)
- `intention_etat`: "Retour à la vue d'ensemble, les 2 arcs côte à côte, texte 'UN SEUL' — seul texte de l'acte, justifié par l'emphase orale forte."
- `forme_connue`: "recul camAt + texte spring (pattern déjà dans Globe2Proto16x9.tsx:323-341, interpolate opacity)"
- `forme_verifiee`: "Globe2Proto16x9.tsx:323-341"
- `forme_couvre_tout`: true
- `cam_key`: {frame: 2166, lon: 5, lat: 15, scaleMul: 1.6}
- `cout_estime`: "trivial"
- `fallback_si_echec`: "n/a"
- `sync_voix`: "SEUL"
- `sfx`: [{"at": 2166, "type": "impact-doux", "gain": 0.55}]

### État 12 — Clôture / accroche
- `frames`: "2346-2540" (78.22s→84.68s, fin de l'acte)
- `intention_etat`: "Éloignement final, vue planétaire, les 2 flux continuent de courir — plateau de RESPIRATION avant la transition vers l'Acte 2. Aucun nouveau texte, la voix conclut seule."
- `forme_connue`: "recul camAt + terminateur jour/nuit qui dérive + flux continus, plateau de respiration (règle 5-6s)"
- `forme_verifiee`: "Globe2Proto16x9.tsx:107-111 (terminateur), pattern respiration doctrine SOUVERAIN-REMOTION-PLAYBOOK"
- `forme_couvre_tout`: true
- `cam_key_sequence`: [
    {frame: 2346, lon: 6, lat: 13, scaleMul: 1.6},
    {frame: 2440, lon: 7, lat: 11, scaleMul: 1.45},
    {frame: 2540, lon: 8, lat: 10, scaleMul: 1.3}
  ]
- `cout_estime`: "trivial"
- `fallback_si_echec`: "n/a"
- `sync_voix`: "maître du gaz africain"
- `sfx`: []
- **Note plateau de respiration** : même en "respiration", ce sont 3 keyframes (pas 1) + le `driftLon`
  permanent superposé — la respiration est un ralentissement de rythme, jamais un arrêt total du mouvement
  (cf doctrine SOUVERAIN-REMOTION-PLAYBOOK "plateau de respiration" ≠ frame figée).

---

## Fond

Palette fixe du proto (`COL` dans `Globe2Proto16x9.tsx`) — fond spatial `#060a14`→`#0d1526`, océan
`#16324a`/`#1d4363`, terres `#c8a45e`, or `#e8b44a`/`#ffe39a`, rouge `#d6552e`, ivoire `#e8dcc0`. Aucune
palette de fond externe (`_PALETTE-BACKGROUNDS.md`) ne s'applique ici — le globe a sa propre charte déjà
validée sur 4 actes Soudan.

## Résumé prose (pour validation Aziz)

L'Acte 1 ouvre directement dans l'espace : un globe vivant, étoilé, jamais figé. La caméra descend sur le
Nigeria, trace un lien unique vers l'Europe, puis — au moment exact où la voix dit "et pourtant, ces deux
projets ne se parlent pas" — cet unique trait se scinde en deux tracés distincts (le seul morceau de code
vraiment nouveau : le morphing d'un arc vers deux). S'ensuit une tension silencieuse (zone rouge discrète
sur le Sahel), puis le cœur du hook : un travelling continu qui longe la côte atlantique pour raconter
l'AAGP, puis un pivot rapide vers le désert pour le TSGP — à chaque bascule, le tracé qu'on quitte disparaît
derrière l'horizon de la sphère (occlusion réelle), jamais de coupe. L'acte se referme sur "UN SEUL" (seul
texte de tout le hook) puis un éloignement qui laisse les deux flux courir en parallèle, ouvrant sur l'Acte
2. Zéro asset payant, tout est du code (D3 + SVG + Remotion frame-driven) sur un socle déjà prouvé en
production (globe D3 Soudan, 4 actes).
