# PLAN SCÈNE 3 — "LE CONTRAT" (terrain 1) — V3-REFONTE

> Branche : `feat/senegal-v3-scene2-comparaison` (on continue dessus, scène 2 déjà mergée FINAL).
> Audio : 188.66s -> 241.3s (~52.6s). Réf V1 = Beat11 (kraft/data-viz, REMPLACÉE).
> Registre : navy #16213a + grille or (= fond du pivot baril 60% de SceneGisementsV3). Remotion pur + SVG.

## INTENTION (1 verbe) : RONGER.
Le "60%" que l'État ANNONCE est en réalité rogné par les règles du contrat (Woodside récupère ses
milliards d'infrastructures = cost recovery AVANT de partager). Le 60% devient incertain. Bras de fer.

## MÉTAPHORE VALIDÉE AZIZ (2026-06-24) : "le baril reste baril, la lame Woodside monte"
On REPREND le baril 60% de la scène gisements (continuité max, baril RECONNAISSABLE, PAS de morph abstrait).
Une lame/part sombre "COST RECOVERY" monte depuis le bas (Woodside se sert d'abord) et COMPRIME le drapeau
Sénégal vers le haut -> le 60% se réduit visuellement -> devient "??%". Bras de fer = le niveau OSCILLE
(force État qui pousse vs lame Woodside). Caviardage des clauses "pas publiques" = discret en arrière-plan.

## SYNTHÈSE EXTRACTIVE TRACÉE (jury G=Gemini, K=Kimi, D=DeepSeek, mode upstream)
CONVERGENCE G+K+D (socle) :
- Reprendre le baril 60%, le métamorphoser sans cut (pont narratif). [G+K+D]
- 60% rongé : cost recovery Woodside AVANT la part État -> 60% sur le reliquat -> "??%". [G+K+D]
- ABSTRACTION géométrique, PAS de papier/poignée de main littérale ("la loi = une architecture"). [G+K+D]
- Bras de fer = la FRONTIÈRE qui vibre, pas de poings/cordes : `Math.sin(frame)` sur X/Y de la séparation. [G+D]
- Caviardage clauses "pas publiques" = <rect> noirs NETS (navy presque noir #0a0f1d), spring rapide. [G+K]
- MINIMALISME : 3 éléments max, texte minimal, visuel NE répète PAS la voix (chiffre déjà fissuré
  quand voix dit "60%", disparaît quand voix dit "estimation" = contrepoint). [K]
- Couleurs navy+or 90%, drapeau <=10%, overlay navy 30% sur le drapeau (anti-clipart). [K]
- spring partout (pas interpolate linéaire majeur), grain 3-5% SVG, grille qui respire, hold-frames
  aux punchlines (figer 12f à 241s). [G+K]
- Icônes Lucide = DANGER interface web : limiter à 1-2 max, halo or dessous, traiter en "pions". [G+K+D]

DIVERGENCE métaphore (tranchée Aziz = variante baril-reste-baril, fusion K+D) :
- G : baril -> barre horizontale + piston (REJETÉ : perd le baril).
- K : baril 2 compartiments, résidu goutte en bas (RETENU : la part comprimée).
- D : baril -> jauge verticale, lame monte (RETENU : la lame sombre + compteur milliards).

## DÉCOUPAGE CALÉ VOIX (frame = (t_abs - 188.66) * 30, scène démarre à 188.66s)
| t_abs | frame | voix | visuel |
|---|---|---|---|
| 188.7 | 0 | "Et au Sénégal, ces règles se jouent" | le baril 60% (drapeau SEN) est là, stable, fond grille or |
| 193.4 | ~142 | "sur trois terrains" | 3 marqueurs discrets (1 actif or, 2 fantômes), "le 1er = le contrat" |
| 196.2 | ~226 | "le contrat lui-même" | focus baril, les autres terrains s'estompent |
| 198.2 | ~286 | "soixante pour cent" | "60%" présent à droite mais DÉJÀ fragile (léger tremble/halo) |
| 200.3 | ~349 | "mais c'est une estimation" | le 60% se voile/tremble, un "?" affleure (contrepoint : il doute) |
| 204.9 | ~487 | "écrite dans des contrats" | clauses = lignes fines or en arrière-plan se tracent (stroke-dashoffset) |
| ~213 | ~730 | "pas tous publics" | <rect> noirs caviardent quelques clauses (net, spring rapide) |
| 220.7 | ~961 | "Sonko, intérêt national" | force ÉTAT (bas) pousse pour rééquilibrer (le niveau remonte un peu) |
| 226 | ~1120 | "Woodside et l'État négocient l'impôt" | marqueur Woodside (haut), la lame sombre COST RECOVERY commence à monter |
| 232.5 | ~1315 | "récupérer ses milliards d'abord" | LA LAME MONTE FORT, comprime le drapeau, "60%" -> "??%" (clipPath), compteur Mds$ |
| 238.4 | ~1492 | "bras de fer" | le niveau OSCILLE (Math.sin), tension entre lame (haut) et État (bas) |
| 241.3 | ~1580 | "si les règles tiennent... ou pas" | tout se fige (hold 12f), le "??%" clignote, fade -> navy |

Durée totale ~1590f (~53s). END ~1590.

## CONTRAINTES (rappel)
Remotion frame-driven + audio-derived · SVG natif OK · PAS Mapbox · INTERDIT CSS transition/keyframes/setTimeout/3D lourde
· texte minimal accents FR · safe zones 1920x1080 · navy+or, drapeau <=10%.

## RÉUTILISATION
- `BarilJaugeIcon` (déjà utilisé dans PivotRevenu de SceneGisementsV3) = le baril rempli du drapeau à un ratio.
- fond grille or = repris du PivotRevenu (linear-gradient or 0.10, 60px).
- SFX/musique : même registre (stat-tick, impact, music-A-ambient).

## ÉTAT
Plan validé Aziz (métaphore + registre). PROCHAINE = coder SceneContratV3.tsx.
