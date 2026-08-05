# DA-brief upstream — Flowdesk registre personne (2B), synthèse tracée

> Brief envoyé : `/tmp/da-refs/brief-flowdesk-personne2b.txt` (mode `--upstream`, 2 frames jointes :
> storyboard 4 panneaux validé + notre rendu actuel panneau 1). Sorties brutes :
> `/tmp/da-refs/da-flowdesk-personne2b-{gemini,kimi,deepseek}.md`.
>
> Diagnostic convergent des 3 modèles sur notre rendu actuel : on a fait un **"wallpaper animé"**
> (Gemini) — personnage qui respire + icônes qui flottent, mais rien qui **agit** sur le cadre. Pas
> une mise en scène. Confirme le retour d'Aziz ("manque d'action" au panneau 2).

## Chantier 1 — Diagnostic du problème actuel

| Idée | Source | Décision |
|---|---|---|
| "Wallpaper animé" : mouvement présent mais pas de mise en scène/hiérarchie | G | ✅ RETENU — reformule exactement le retour d'Aziz, cadre bien le problème |
| L'œil ne sait pas où regarder, pas de "gravité visuelle" vers le personnage | G | ✅ RETENU |
| Décalage de texture entre vidéo H3 organique et SVG parfait = risque "cheap" si pas assumé | D | ✅ RETENU — angle qu'on n'avait pas identifié, réel (cf `feedback_...` observations de dérive) |

## Chantier 2 — Structure de rythme global (Partie B)

Les 3 proposent un découpage en beats proche mais avec des bornes légèrement différentes. Convergence
forte sur la logique **tension → rupture → fluidité → didactique → apaisement**.

| Idée | Source | Décision |
|---|---|---|
| Découpage en 5 beats calés sur les 4 panneaux + 1 transition-choc à 17.3s | G+K+D (convergent) | ✅ RETENU comme structure de base |
| Le moment fort = la bascule 17.3s (whip-pan + absorption) | G+K+D (convergent, unanime) | ✅ RETENU — **c'est LE moment à over-investir** |
| Micro-événements toutes les 3-4s dans le panneau 1 pour casser la linéarité (icône qui "explose" puis se reforme, cut vers un autre moment du clip H3) | D | ✅ RETENU — répond directement à la durée 17s du panneau 1 qui est le point de risque "slideshow" le plus long |
| Anticipation visuelle : le mot apparaît 0.2s AVANT que la voix le dise | K | 🔶 NUANCÉ — bon principe, mais risque de désynchro perçue si mal calibré. Tester à ±3 frames (0.1s) plutôt que 0.2s, vérifier au render avant de généraliser |
| Beat 3 "Mécanisme" = rythme métronome, une action = une seconde | G+K+D (convergent) | ✅ RETENU — contraste utile avec le chaos du panneau 1 |

## Chantier 3 — Transitions inter-panneaux (le trou le plus net de notre version actuelle)

On n'avait littéralement RIEN entre panneau 1 et 2 (juste un cut de `<Sequence>`). Les 3 modèles
identifient ça comme un manque majeur.

| Idée | Source | Décision |
|---|---|---|
| Whip-pan simulé SVG (translation X massive + spring rapide) pour la transition 1→2 | G+K+D (convergent, unanime) | ✅ RETENU — **priorité CRITIQUE**, comble le trou le plus visible |
| Masque circulaire (`clipPath`) qui grandit depuis le centre pour la transition 2→3 | G | ✅ RETENU |
| Morphing du logo en fond crème pour la transition 2→3 (paths qui se déforment) | K+D | ❌ ÉCARTÉ — DeepSeek lui-même flag ce risque ("effet pâte à modeler numérique très amateur" si mal fait) et propose un remplacement plus sûr : scale+opacity depuis le même point d'ancrage ("faux morphing"). On retient le remplacement, pas le morphing de path réel |
| "Faux morphing" par scale/opacity synchronisés (pas de déformation de path) | D | ✅ RETENU — remplace l'idée précédente, plus sûr techniquement et plus proche de notre stack (spring, pas d'interpolation de path complexe) |
| Split-screen : la flèche de sortie panneau 3 "pousse" le cadre vers panneau 4 | D | ✅ RETENU |
| "Fil d'Ariane orange" : un trait SVG continu qui traverse physiquement les 4 panneaux (chaos→vortex→circuits→soulignement texte final) | G | ✅ RETENU — idée la plus forte des 3 rapports pour la cohérence transversale, répond exactement à la consigne d'Aziz "jamais un slideshow" |
| "Icône-témoin" : une icône unique traverse tous les panneaux (email → aspirée P2 → réapparaît P3 → devient check P4) | K | 🔶 NUANCÉ — proche du "Fil d'Ariane" de Gemini mais objet différent (icône vs trait). Les deux ne sont pas mutuellement exclusifs mais risquent de se marcher dessus visuellement si combinés tels quels. Trancher au moment du code : un seul élément-signature transversal, pas deux |

## Chantier 4 — Panneau 1 (icônes/mur) — corrige notre écart déjà identifié avec Aziz

| Idée | Source | Décision |
|---|---|---|
| Grille stricte qui se "casse" progressivement plutôt qu'un `Math.random()` pur | G | ✅ RETENU — piège AI-slop réel, on utilisait déjà des positions à la main (pas du random), donc déjà conforme, à vérifier en gardant cette discipline pour tout ajout |
| Limiter à 20-30 icônes secondaires max, varier l'opacité pour la profondeur plutôt que la densité pure | D | ✅ RETENU — notre v3 a 9 icônes, largement sous ce plafond, marge pour densifier si besoin sans risquer le "bouillie visuelle" |
| Hiérarchie : 3 icônes "héros" plus grandes + nommées, le reste plus petit et sans texte | D | 🔶 NUANCÉ — cohérent avec nos 3 tailles de bulle déjà produites (v2), mais l'idée d'ajouter le NOM en texte sous l'icône n'était pas prévue. Fidèle à la référence storyboard (qui affiche "Slak"/"HR" en texte dans certaines bulles) — à valider avec Aziz au gate, ajoute de la lisibilité mais aussi de la charge visuelle |
| Le nom du canal apparaît en texte 1.5s avant que l'icône ne rejoigne le mur (mot → icône → mur) | D | 🔶 NUANCÉ — même remarque, lié au point précédent, dépend de la décision sur les noms textuels |
| Micro-tremblement + scale pulse sur les icônes déjà posées (tension qui monte) | K+D (convergent) | ✅ RETENU — déjà en partie fait (notre `driftSeed` sinusoïdal), à intensifier légèrement vers la fin du panneau |
| Zoom-in continu léger du cadre global (scale 1→1.15) pour la sensation d'étouffement | G | ✅ RETENU — facile à ajouter sur l'`AbsoluteFill` racine du panneau |
| Glitch split-screen ponctuel sur "rien ne se parle" (rupture de communication) | K+D (convergent) | 🔶 NUANCÉ — bon symbolisme, mais à doser : un seul glitch bref (4-6 frames), pas un effet récurrent, sinon ça contredit le principe "espace négatif" que les 3 modèles demandent par ailleurs |
| Personnage caché derrière un élément SVG au premier plan pour masquer le point de couture du ping-pong H3 | G | ✅ RETENU — répond à un vrai risque technique déjà identifié par nous (jonction ping-pong) |
| Prévoir plusieurs clips H3 différents et les cross-fader plutôt qu'un seul clip loopé | K | ❌ ÉCARTÉ pour cette passe — cohérent en théorie mais chaque clip H3 coûte ~1.30$/5s et double le budget de test ; le ping-pong actuel a déjà été vérifié frame par frame sans saut visible (session précédente), pas de preuve que ça soit nécessaire. À revisiter seulement si le rendu final montre un problème réel |

## Chantier 5 — Panneau 2 (bascule) — where "manque d'action" a été signalé

| Idée | Source | Décision |
|---|---|---|
| Vortex/spirale logarithmique pour la trajectoire des icônes convergentes (formule paramétrique précise) | K (formule donnée) | ✅ RETENU — on avait déjà une version simplifiée (spring linéaire xPct/yPct), cette formule spirale donnera un mouvement plus riche. À implémenter au code |
| Absorption séquentielle (pas simultanée) des icônes vers le logo | G+K+D (convergent) | ✅ RETENU — déjà notre comportement actuel (startFrame échelonné), à garder |
| Barre orange qui traverse l'écran plein cadre au moment du whip-pan (signal fort) | K | ✅ RETENU |
| Changement subtil de teinte du fond (marine → marine plus clair) pendant la bascule | K | 🔶 NUANCÉ — joli sur le papier, risque de complexifier le rendu vidéo H3 en arrière-plan (le clip lui-même ne changera pas de teinte, seul un overlay pourrait). Faisable via un `<rect>` overlay à faible opacité, à tester au rendu avant de valider visuellement |

## Chantier 6 — Panneaux 3 et 4 (aucun visuel produit — cœur du besoin de ce brief)

Convergence FORTE des 3 modèles sur la structure de base du panneau 3 (flux gauche → boîte centrale →
sortie droite, stroke-dashoffset, mini-icônes qui glissent sur les traits). Diffèrent sur les détails.

| Idée | Source | Décision |
|---|---|---|
| Structure tripartite entrée/traitement/sortie, lignes qui se dessinent en stroke-dashoffset | G+K+D (convergent, unanime) | ✅ RETENU — structure de base du panneau 3 |
| Mini-icônes qui "surfent"/glissent littéralement sur le trait qui se dessine | K+D (convergent) | ✅ RETENU |
| Codage couleur temporaire par type de donnée (email/chat/doc), qui s'uniformise en sortie | K | ✅ RETENU — résout directement le risque "abstrait/incompris" que K lui-même soulève en angle spectateur-lambda, bonne réponse à un problème réel |
| Rupture de palette : fond CRÈME pour tout le panneau 3 (au lieu de marine) | D | 🔶 NUANCÉ — idée forte et différenciante (D est seul à la proposer), MAIS c'est un changement d'identité visuelle qui dépasse le cadre "bonifier sans réinventer" du brief. Décision de GOÛT à trancher par Aziz au gate, pas une décision technique |
| Personnage en silhouette semi-transparente (30% opacité) pour ne pas concurrencer le mécanisme | D | ✅ RETENU — bon principe de hiérarchie visuelle, indépendant de la décision sur la palette |
| Panneau 4 : cercle qui se dessine en stroke-dashoffset = "la boucle", check qui pop au moment de la fermeture | G+K+D (convergent, unanime) | ✅ RETENU — structure de base du panneau 4 |
| Onde de choc/pulse qui part du check vers l'extérieur à la résolution | K+D (convergent) | ✅ RETENU |
| Respiration du logo (halo orange pulsant lentement) en fin de panneau 4 | D | ✅ RETENU |

## Chantier 7 — Idées bonus transversales (Partie D, 9 propositions au total)

| Idée | Source | Décision |
|---|---|---|
| "Fil d'Ariane orange" (trait continu 4 panneaux) | G | ✅ RETENU (cf Chantier 3 — fusionné, c'est la même famille d'idée que "icône-témoin" de K, un seul élément retenu) |
| Micro-typographie cinétique en fond (mots-clés géants à 10% opacité, 4 frames) | G | 🔶 NUANCÉ — effet "subliminal" séduisant mais risque de flou conceptuel si mal exécuté (à quoi ça sert si le spectateur ne le voit pas consciemment ?). Reporté après une 1ère passe complète, pas prioritaire |
| Onde de choc/ripple à chaque icône qui "crie" (panneau 1) | G | ✅ RETENU — cohérent avec le "poids visuel" que D demande aussi ("sonification visuelle") |
| Beat Grid (lignes verticales qui traversent, accélèrent avant la bascule) | K | ❌ ÉCARTÉ — risque de surcharge en plus du mur d'icônes déjà dense ; le zoom-in continu (Chantier 4) remplit déjà ce rôle de tension montante sans ajouter une couche visuelle de plus |
| Flash orange plein écran (2-3 frames) à chaque action clé | D | 🔶 NUANCÉ — punchy mais à réserver à UN SEUL moment (la bascule 17.3s), pas à répéter à chaque action sous peine de fatiguer l'œil et de perdre son impact |
| Cercle marine qui "avale" l'écran en fin de vidéo (signature de clôture) | D | ✅ RETENU — belle façon de clore proprement sans fondu au noir générique |

## Chantier 8 — Pièges AI-slop (convergence forte, à appliquer systématiquement)

| Règle | Source | Décision |
|---|---|---|
| Règle 60/30/10 : 60% marine, 30% blanc/crème, 10% orange max — l'orange réservé à ce qui bouge/résout | G+D (convergent) | ✅ RETENU — règle simple, vérifiable visuellement à chaque render |
| Jamais de phrase complète à l'écran, uniquement des mots-clés isolés | K | ✅ RETENU |
| Chaque élément SVG doit être un "acteur narratif" (entre/agit/sort) — pas de décoration qui ne sert à rien | K | ✅ RETENU — bon garde-fou pour juger nos ajouts futurs |
| Varier les paramètres spring selon le "poids" perçu de l'élément (pas un seul preset partout) | K+D (convergent) | ✅ RETENU |
| Ne jamais utiliser un fondu enchaîné classique pour une transition majeure — toujours une coupe cachée par un élément graphique | D | ✅ RETENU — cohérent avec le whip-pan déjà retenu |

## Point de VIGILANCE technique (Claude, pas les modèles) — vérifié contre nos contraintes réelles

- Le whip-pan "translation X massive -1920px" (G) et la "barre orange plein écran" (K) sont tous les
  deux **faisables tels quels** avec `interpolate`/`spring` sur un `<AbsoluteFill>` — confirmé, aucune
  brique manquante.
- La formule de spirale logarithmique de K (`x = cx + r(t)*cos(t)`) est mathématiquement correcte et
  directement portable en JS/TS, aucun risque.
- Le "faux morphing" scale+opacity de D est plus sûr qu'un vrai morphing de path — confirmé, on n'a
  aucune lib de path-morphing dans le stack (Flubber ou équivalent absent), donc un vrai morphing
  aurait été une fausse promesse. Bon réflexe de D d'anticiper ça.
- Convergence à 3/3 modèles n'est PAS en soi une preuve de qualité (doctrine) — mais ici, converger
  sur "whip-pan pour la transition 1→2" ET "structure tripartite panneau 3" correspond aussi à notre
  propre lecture du problème (retour Aziz), donc double signal, pas juste un artefact de prompt.

---

## GATE — Décisions d'Aziz (2026-08-05, tranchées)

1. **Panneau 3 : fond CRÈME** (rupture de palette assumée, proposition D retenue) — personnage en
   silhouette marine semi-transparente sur ce panneau.
2. **Panneau 1 : icônes SEULES, pas de texte nominal.** Reste l'approche déjà produite (pictogramme
   seul, pas de kinetic typography du nom de canal).
3. **Fil d'Ariane / élément-signature transversal : REPORTÉ.** Pas cette passe — pas de trait continu
   4-panneaux pour l'instant.
4. **Priorité d'exécution : PANNEAUX 1+2 EN PROFONDEUR, pas 3/4.** Décision d'Aziz explicite, hors des
   2 options proposées : "Travaillons à fond dessus, surtout sur le dynamisme, hyper dynamisme,
   rendant le tout irrésistible. Le but est que l'action ne soit jamais figée, que ça aille vite quand
   même, tout en restant lisible." → Panneaux 3/4 restent VIDES pour cette passe. Focus exclusif sur
   muscler 1+2 avec le vocabulaire retenu ci-dessus (whip-pan, vortex spiralé, zoom-in continu,
   micro-événements de rupture, ripple sur les icônes, règle 60/30/10, springs différenciés par poids).

## CE QUI SE CODE MAINTENANT (portée de cette passe, dérivé des chantiers ci-dessus)

Retenu et applicable IMMÉDIATEMENT sur panneaux 1+2 (tout le reste — panneaux 3/4, fil d'Ariane —
explicitement hors scope de cette passe) :

- **Transition 1→2** : whip-pan SVG (translation X massive + spring rapide/overshoot) + barre orange
  plein cadre qui traverse en ~6 frames au moment de la coupe (Chantier 3).
- **Panneau 1** : zoom-in continu léger du cadre (scale 1→1.15 sur la durée du panneau, Chantier 4) +
  micro-événements de rupture toutes les 3-4s (pas juste un mur statique qui s'accumule, Chantier 4) +
  1 glitch bref (4-6 frames) sur "rien ne se parle" (Chantier 4, dosé — un seul, pas récurrent) +
  ripple/onde sur chaque icône qui apparaît (Chantier 7) + personnage caché par un élément SVG au
  premier plan à un moment pour masquer la jonction ping-pong (Chantier 4).
- **Panneau 2** : trajectoire en spirale logarithmique pour les icônes convergentes (formule K,
  Chantier 5, remplace le spring linéaire actuel) + absorption séquentielle déjà en place (garder) +
  éventuel léger overlay de teinte pendant la bascule (Chantier 5, nuancé — à tester au rendu).
- **Discipline transversale à appliquer sur tout ajout** : règle 60/30/10, springs différenciés par
  "poids" perçu de l'élément (pas un seul preset partout), jamais de fondu enchaîné classique pour
  une transition (Chantier 8).
